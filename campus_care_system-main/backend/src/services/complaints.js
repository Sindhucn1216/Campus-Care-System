import { pool, withTransaction } from '../config/db.js';
import { HttpError } from '../utils/httpError.js';
import { prefixedId } from '../utils/ids.js';
import { mapComplaint } from './complaintMapper.js';
import { visibilityClause, assertCanView, assertCanManage } from './complaintAccess.js';
import { assertStatusTransition, PRIORITIES, STATUSES, computeOverdue } from '../utils/status.js';

const BASE_SELECT = `
  SELECT
    c.*,
    cat.name AS category_name,
    d.name AS department_name,
    reporter.name AS reporter_name,
    reporter.role AS reporter_role,
    staff.name AS assigned_staff_name
  FROM complaints c
  JOIN complaint_categories cat ON cat.id = c.category_id
  JOIN users reporter ON reporter.id = c.reporter_id
  LEFT JOIN departments d ON d.id = c.department_id
  LEFT JOIN users staff ON staff.id = c.assigned_staff_id
`;

export async function fetchUpdates(complaintId) {
  const [rows] = await pool.query(
    `SELECT u.*, usr.name AS updated_by_name
     FROM complaint_updates u
     LEFT JOIN users usr ON usr.id = u.updated_by
     WHERE u.complaint_id = ?
     ORDER BY u.created_at ASC`,
    [complaintId]
  );
  return rows;
}

export async function fetchFeedback(complaintId) {
  const [rows] = await pool.query('SELECT * FROM feedback WHERE complaint_id = ? LIMIT 1', [complaintId]);
  return rows[0] || null;
}

export async function hydrate(row, { publicView = false } = {}) {
  if (!row) return null;
  const [updates, feedback] = await Promise.all([fetchUpdates(row.id), fetchFeedback(row.id)]);
  return mapComplaint(row, { updates, feedback, publicView });
}

export async function getRawByIdOrCode(idOrCode) {
  const [rows] = await pool.query(
    `${BASE_SELECT} WHERE c.id = ? OR c.complaint_code = ? LIMIT 1`,
    [idOrCode, idOrCode]
  );
  return rows[0] || null;
}

export async function getVisibleComplaint(user, idOrCode, { publicView = false } = {}) {
  const row = await getRawByIdOrCode(idOrCode);
  if (!row) throw new HttpError(404, 'Complaint not found.');
  if (!publicView) assertCanView(user, row);
  return hydrate(row, { publicView });
}

export async function listComplaints(user, filters = {}) {
  const vis = visibilityClause(user);
  const where = [vis.sql];
  const params = [...vis.params];

  if (filters.status && filters.status !== 'All') {
    if (filters.status === 'Overdue') {
      where.push(`(c.status = 'Overdue' OR (c.is_overdue = 1 AND c.status NOT IN ('Resolved','Rejected')))`);
    } else {
      where.push('c.status = ?');
      params.push(filters.status);
    }
  }
  if (filters.category && filters.category !== 'All') {
    where.push('(c.category_id = ? OR cat.name = ?)');
    params.push(filters.category, filters.category);
  }
  if (filters.priority && filters.priority !== 'All') {
    where.push('c.priority = ?');
    params.push(filters.priority);
  }
  if (filters.departmentId && filters.departmentId !== 'All') {
    where.push('c.department_id = ?');
    params.push(filters.departmentId);
  }
  if (filters.search && String(filters.search).trim()) {
    const q = `%${String(filters.search).trim().toLowerCase()}%`;
    where.push(`(
      LOWER(c.title) LIKE ? OR LOWER(c.complaint_code) LIKE ?
      OR LOWER(c.location) LIKE ? OR LOWER(c.description) LIKE ?
    )`);
    params.push(q, q, q, q);
  }

  const sort = filters.sort === 'oldest' ? 'c.created_at ASC' : 'c.created_at DESC';
  const [rows] = await pool.query(
    `${BASE_SELECT} WHERE ${where.join(' AND ')} ORDER BY ${sort}`,
    params
  );

  const results = [];
  for (const row of rows) {
    results.push(await hydrate(row));
  }
  return results;
}

async function nextComplaintCode(conn) {
  const year = new Date().getFullYear();
  await conn.query(
    'INSERT INTO complaint_code_seq (year, last_seq) VALUES (?, 0) ON DUPLICATE KEY UPDATE year = year',
    [year]
  );
  const [rows] = await conn.query('SELECT last_seq FROM complaint_code_seq WHERE year = ? FOR UPDATE', [year]);
  const next = (rows[0]?.last_seq || 0) + 1;
  await conn.query('UPDATE complaint_code_seq SET last_seq = ? WHERE year = ?', [next, year]);
  return `CMP-${year}-${String(next).padStart(3, '0')}`;
}

export async function createComplaint(user, data) {
  return withTransaction(async (conn) => {
    const [cats] = await conn.query(
      'SELECT id, name, default_department_id FROM complaint_categories WHERE id = ? OR name = ? LIMIT 1',
      [data.categoryId, data.categoryName]
    );
    const category = cats[0];
    if (!category) throw new HttpError(400, 'Invalid complaint category.');

    let departmentId = category.default_department_id || null;
    let departmentName = null;
    if (departmentId) {
      const [depts] = await conn.query('SELECT id, name FROM departments WHERE id = ? AND active = 1', [departmentId]);
      if (depts[0]) {
        departmentName = depts[0].name;
      } else {
        departmentId = null;
      }
    }

    const id = prefixedId('cmp');
    const complaintCode = await nextComplaintCode(conn);
    const now = new Date();

    await conn.query(
      `INSERT INTO complaints (
        id, complaint_code, title, description, category_id, location, specific_location,
        priority, status, reporter_id, department_id, image_url, image_filename, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Submitted', ?, ?, ?, ?, ?, ?)`,
      [
        id,
        complaintCode,
        data.title,
        data.description,
        category.id,
        data.location,
        data.specificLocation,
        data.priority,
        user.id,
        departmentId,
        data.imageUrl,
        data.imageFilename,
        now,
        now,
      ]
    );

    const note = departmentName
      ? `Grievance registered. Routed to ${departmentName}.`
      : 'Grievance registered. Pending administrative routing.';

    await conn.query(
      `INSERT INTO complaint_updates (id, complaint_id, updated_by, old_status, new_status, note, created_at)
       VALUES (?, ?, ?, 'None', 'Submitted', ?, ?)`,
      [prefixedId('upd'), id, user.id, note, now]
    );

    return { id, complaintCode, departmentId, departmentName };
  });
}

export async function updateStatus(user, idOrCode, { status, note, resolutionNotes }) {
  if (!STATUSES.includes(status)) {
    throw new HttpError(400, 'Invalid status value.');
  }

  return withTransaction(async (conn) => {
    const [lockRows] = await conn.query(
      'SELECT id FROM complaints WHERE id = ? OR complaint_code = ? LIMIT 1 FOR UPDATE',
      [idOrCode, idOrCode]
    );
    if (!lockRows[0]) throw new HttpError(404, 'Complaint not found.');
    const [rows] = await conn.query(`${BASE_SELECT} WHERE c.id = ?`, [lockRows[0].id]);
    const complaint = rows[0];
    assertCanManage(user, complaint);
    assertStatusTransition(complaint.status, status);

    if (status === 'Resolved' && !String(resolutionNotes || note || '').trim()) {
      throw new HttpError(400, 'Resolution notes are required when marking a complaint as Resolved.');
    }
    if (status === 'Rejected' && !String(note || '').trim()) {
      throw new HttpError(400, 'A rejection reason is required.');
    }

    const now = new Date();
    const isResolved = status === 'Resolved';
    const resolvedAt = isResolved ? complaint.resolved_at || now : null;
    const notes = resolutionNotes
      ? String(resolutionNotes).trim()
      : isResolved
        ? complaint.resolution_notes || note
        : complaint.resolution_notes;
    const overdue = status === 'Overdue' ? 1 : isResolved ? 0 : complaint.is_overdue;

    await conn.query(
      `UPDATE complaints
       SET status = ?, updated_at = ?, resolved_at = ?, resolution_notes = ?, is_overdue = ?
       WHERE id = ?`,
      [status, now, resolvedAt, notes, overdue, complaint.id]
    );

    await conn.query(
      `INSERT INTO complaint_updates (id, complaint_id, updated_by, old_status, new_status, note, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        prefixedId('upd'),
        complaint.id,
        user.id,
        complaint.status,
        status,
        note || `Status changed from ${complaint.status} to ${status}.`,
        now,
      ]
    );

    return complaint.id;
  });
}

export async function assignComplaint(user, idOrCode, { departmentId, staffId, note }) {
  if (user.role !== 'admin') {
    throw new HttpError(403, 'Only administrators can assign complaints.');
  }

  return withTransaction(async (conn) => {
    const [lockRows] = await conn.query(
      'SELECT id FROM complaints WHERE id = ? OR complaint_code = ? LIMIT 1 FOR UPDATE',
      [idOrCode, idOrCode]
    );
    if (!lockRows[0]) throw new HttpError(404, 'Complaint not found.');
    const [rows] = await conn.query(`${BASE_SELECT} WHERE c.id = ?`, [lockRows[0].id]);
    const complaint = rows[0];

    const [depts] = await conn.query('SELECT id, name FROM departments WHERE id = ? AND active = 1', [departmentId]);
    const dept = depts[0];
    if (!dept) throw new HttpError(400, 'Active department not found.');

    let assignedStaffId = complaint.assigned_staff_id;
    let assignedStaffName = complaint.assigned_staff_name;
    if (staffId) {
      const [staffRows] = await conn.query(
        `SELECT id, name, department_id, role FROM users WHERE id = ? AND role = 'staff'`,
        [staffId]
      );
      const staff = staffRows[0];
      if (!staff || staff.department_id !== dept.id) {
        throw new HttpError(400, 'Assigned staff must belong to the selected department.');
      }
      assignedStaffId = staff.id;
      assignedStaffName = staff.name;
    }

    const now = new Date();
    const nextStatus = complaint.status === 'Submitted' ? 'In Progress' : complaint.status;

    await conn.query(
      `UPDATE complaints
       SET department_id = ?, assigned_staff_id = ?, status = ?, updated_at = ?
       WHERE id = ?`,
      [dept.id, assignedStaffId, nextStatus, now, complaint.id]
    );

    await conn.query(
      `INSERT INTO complaint_updates (id, complaint_id, updated_by, old_status, new_status, note, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        prefixedId('upd'),
        complaint.id,
        user.id,
        complaint.status,
        nextStatus,
        note || `Assigned to department: ${dept.name}.`,
        now,
      ]
    );

    return { id: complaint.id, departmentName: dept.name, assignedStaffName };
  });
}

export async function updatePriority(user, idOrCode, priority) {
  if (user.role !== 'admin') {
    throw new HttpError(403, 'Only administrators can change complaint priority.');
  }
  if (!PRIORITIES.includes(priority)) {
    throw new HttpError(400, 'Invalid priority value.');
  }

  return withTransaction(async (conn) => {
    const [lockRows] = await conn.query(
      'SELECT id FROM complaints WHERE id = ? OR complaint_code = ? LIMIT 1 FOR UPDATE',
      [idOrCode, idOrCode]
    );
    if (!lockRows[0]) throw new HttpError(404, 'Complaint not found.');
    const [rows] = await conn.query(`${BASE_SELECT} WHERE c.id = ?`, [lockRows[0].id]);
    const complaint = rows[0];

    const now = new Date();
    await conn.query('UPDATE complaints SET priority = ?, updated_at = ? WHERE id = ?', [priority, now, complaint.id]);
    await conn.query(
      `INSERT INTO complaint_updates (id, complaint_id, updated_by, old_status, new_status, note, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        prefixedId('upd'),
        complaint.id,
        user.id,
        complaint.status,
        complaint.status,
        `Priority changed from ${complaint.priority} to ${priority}.`,
        now,
      ]
    );
    return complaint.id;
  });
}

export async function submitFeedback(user, idOrCode, { rating, comments }) {
  const numeric = Number(rating);
  if (!Number.isInteger(numeric) || numeric < 1 || numeric > 5) {
    throw new HttpError(400, 'Rating must be an integer from 1 to 5.');
  }

  return withTransaction(async (conn) => {
    const [lockRows] = await conn.query(
      'SELECT id FROM complaints WHERE id = ? OR complaint_code = ? LIMIT 1 FOR UPDATE',
      [idOrCode, idOrCode]
    );
    if (!lockRows[0]) throw new HttpError(404, 'Complaint not found.');
    const [rows] = await conn.query(`${BASE_SELECT} WHERE c.id = ?`, [lockRows[0].id]);
    const complaint = rows[0];
    if (complaint.reporter_id !== user.id) {
      throw new HttpError(403, 'Only the original reporter can submit feedback.');
    }
    if (complaint.status !== 'Resolved') {
      throw new HttpError(400, 'Feedback can only be provided for resolved complaints.');
    }
    const [existing] = await conn.query('SELECT id FROM feedback WHERE complaint_id = ? LIMIT 1', [complaint.id]);
    if (existing[0]) {
      throw new HttpError(409, 'Feedback has already been submitted for this complaint.');
    }

    const id = prefixedId('fb');
    await conn.query(
      `INSERT INTO feedback (id, complaint_id, user_id, rating, comments, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, complaint.id, user.id, numeric, comments ? String(comments).trim() : '', new Date()]
    );
    return complaint.id;
  });
}

export { computeOverdue };
