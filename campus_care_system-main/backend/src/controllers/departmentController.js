import { pool } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';
import { prefixedId } from '../utils/ids.js';
import { requireString, trimToNull } from '../utils/sanitize.js';

async function withCounts() {
  const [depts] = await pool.query('SELECT * FROM departments ORDER BY name ASC');
  const [counts] = await pool.query(
    `SELECT department_id AS id,
            SUM(CASE WHEN status NOT IN ('Resolved','Rejected') THEN 1 ELSE 0 END) AS assignedCount
     FROM complaints
     GROUP BY department_id`
  );
  const map = new Map(counts.map((c) => [c.id, Number(c.assignedCount)]));
  return depts.map((d) => ({
    id: d.id,
    name: d.name,
    code: d.code,
    active: Boolean(d.active),
    head: d.head,
    contact: d.contact,
    staffCount: d.staff_count,
    assignedCount: map.get(d.id) || 0,
  }));
}

export const list = asyncHandler(async (_req, res) => {
  res.json(await withCounts());
});

export const create = asyncHandler(async (req, res) => {
  const name = requireString(req.body.name, 'Department name', { min: 3, max: 150 });
  const code = (trimToNull(req.body.code) || name.slice(0, 4)).toUpperCase();
  const head = trimToNull(req.body.head) || 'Unassigned';
  const contact = trimToNull(req.body.contact) || 'contact@campuscare.edu';
  const staffCount = Number(req.body.staffCount || 1);

  const [dup] = await pool.query(
    'SELECT id FROM departments WHERE LOWER(name) = LOWER(?) OR UPPER(code) = ? LIMIT 1',
    [name, code]
  );
  if (dup[0]) {
    throw new HttpError(409, `A department with that name or code already exists.`);
  }

  const id = prefixedId('dept');
  await pool.query(
    `INSERT INTO departments (id, name, code, active, head, contact, staff_count)
     VALUES (?, ?, ?, 1, ?, ?, ?)`,
    [id, name, code, head, contact, Number.isFinite(staffCount) ? staffCount : 1]
  );
  const listNow = await withCounts();
  res.status(201).json(listNow.find((d) => d.id === id));
});

export const update = asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM departments WHERE id = ?', [req.params.id]);
  if (!rows[0]) throw new HttpError(404, 'Department not found.');

  const current = rows[0];
  const name = req.body.name ? requireString(req.body.name, 'Department name', { min: 3, max: 150 }) : current.name;
  const code = req.body.code ? String(req.body.code).trim().toUpperCase() : current.code;
  const head = req.body.head !== undefined ? trimToNull(req.body.head) : current.head;
  const contact = req.body.contact !== undefined ? trimToNull(req.body.contact) : current.contact;
  const active = req.body.active === undefined ? current.active : req.body.active ? 1 : 0;
  const staffCount = req.body.staffCount === undefined ? current.staff_count : Number(req.body.staffCount);

  if (req.body.name) {
    const [dup] = await pool.query(
      'SELECT id FROM departments WHERE LOWER(name) = LOWER(?) AND id <> ? LIMIT 1',
      [name, current.id]
    );
    if (dup[0]) throw new HttpError(409, `Another department with name "${name}" already exists.`);
  }

  await pool.query(
    `UPDATE departments SET name = ?, code = ?, head = ?, contact = ?, active = ?, staff_count = ? WHERE id = ?`,
    [name, code, head, contact, active, staffCount, current.id]
  );
  const listNow = await withCounts();
  res.json(listNow.find((d) => d.id === current.id));
});
