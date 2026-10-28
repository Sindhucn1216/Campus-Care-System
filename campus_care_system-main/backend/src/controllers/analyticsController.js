import { pool } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { visibilityClause } from '../services/complaintAccess.js';
import { computeOverdue } from '../utils/status.js';
import { mapComplaint } from '../services/complaintMapper.js';

export const dashboard = asyncHandler(async (req, res) => {
  const vis = visibilityClause(req.user);
  const extra = [];
  const params = [...vis.params];
  if (req.user.role === 'admin' && req.query.departmentId && req.query.departmentId !== 'All') {
    extra.push('c.department_id = ?');
    params.push(req.query.departmentId);
  }
  const where = [vis.sql, ...extra].join(' AND ');

  const [complaints] = await pool.query(
    `SELECT c.*, cat.name AS category_name, d.name AS department_name,
            reporter.name AS reporter_name, reporter.role AS reporter_role,
            staff.name AS assigned_staff_name
     FROM complaints c
     JOIN complaint_categories cat ON cat.id = c.category_id
     JOIN users reporter ON reporter.id = c.reporter_id
     LEFT JOIN departments d ON d.id = c.department_id
     LEFT JOIN users staff ON staff.id = c.assigned_staff_id
     WHERE ${where}`,
    params
  );

  const total = complaints.length;
  const submitted = complaints.filter((c) => c.status === 'Submitted').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;
  const rejected = complaints.filter((c) => c.status === 'Rejected').length;
  const overdue = complaints.filter((c) => computeOverdue(c)).length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const resolvedItems = complaints.filter((c) => c.status === 'Resolved' && c.resolved_at);
  let avgResolutionHours = 0;
  if (resolvedItems.length > 0) {
    const totalHours = resolvedItems.reduce((acc, curr) => {
      const start = new Date(curr.created_at);
      const end = new Date(curr.resolved_at);
      return acc + Math.max((end - start) / (1000 * 60 * 60), 0.5);
    }, 0);
    avgResolutionHours = Math.round((totalHours / resolvedItems.length) * 10) / 10;
  }

  const [categories] = await pool.query('SELECT id, name FROM complaint_categories ORDER BY name');
  const categoryDistribution = categories.map((cat) => {
    const count = complaints.filter((c) => c.category_id === cat.id).length;
    return {
      name: cat.name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    };
  });

  const [departments] = await pool.query('SELECT id, name, code FROM departments');
  const departmentPerformance = departments.map((dept) => {
    const deptComplaints = complaints.filter((c) => c.department_id === dept.id);
    const deptResolved = deptComplaints.filter((c) => c.status === 'Resolved').length;
    const deptActive = deptComplaints.filter((c) => c.status === 'In Progress' || c.status === 'Submitted').length;
    const deptOverdue = deptComplaints.filter((c) => computeOverdue(c)).length;
    return {
      id: dept.id,
      name: dept.name,
      code: dept.code,
      total: deptComplaints.length,
      resolved: deptResolved,
      active: deptActive,
      overdue: deptOverdue,
      rate: deptComplaints.length > 0 ? Math.round((deptResolved / deptComplaints.length) * 100) : 100,
    };
  });

  const [updateRows] = await pool.query(
    `SELECT u.*, c.title AS complaintTitle, c.complaint_code AS complaintCode, c.id AS complaintId, usr.name AS updatedByName
     FROM complaint_updates u
     JOIN complaints c ON c.id = u.complaint_id
     LEFT JOIN users usr ON usr.id = u.updated_by
     WHERE ${where.replaceAll('c.', 'c.')}
     ORDER BY u.created_at DESC
     LIMIT 8`,
    params
  );

  const highPriorityComplaints = [];
  for (const c of complaints
    .filter((row) => (row.priority === 'High' || row.priority === 'Urgent') && row.status !== 'Resolved' && row.status !== 'Rejected')
    .slice(0, 5)) {
    highPriorityComplaints.push(mapComplaint(c));
  }

  const trends = [];
  for (let i = 6; i >= 0; i -= 1) {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - i);
    const next = new Date(day);
    next.setDate(next.getDate() + 1);
    const submittedCount = complaints.filter((c) => {
      const created = new Date(c.created_at);
      return created >= day && created < next;
    }).length;
    const resolvedCount = complaints.filter((c) => {
      if (!c.resolved_at) return false;
      const resolvedAt = new Date(c.resolved_at);
      return resolvedAt >= day && resolvedAt < next;
    }).length;
    const inProgressCount = complaints.filter((c) => {
      const created = new Date(c.created_at);
      return created < next && c.status === 'In Progress';
    }).length;
    trends.push({
      day: day.toLocaleDateString('en-US', { weekday: 'short' }),
      submitted: submittedCount,
      resolved: resolvedCount,
      inProgress: inProgressCount,
    });
  }

  res.json({
    total,
    submitted,
    inProgress,
    resolved,
    rejected,
    overdue,
    resolutionRate,
    avgResolutionHours,
    categoryDistribution,
    departmentPerformance,
    activityFeed: updateRows.map((u) => ({
      id: u.id,
      complaintId: u.complaintId,
      complaintTitle: u.complaintTitle,
      complaintCode: u.complaintCode,
      updatedByName: u.updatedByName,
      oldStatus: u.old_status,
      newStatus: u.new_status,
      note: u.note,
      createdAt: u.created_at,
    })),
    highPriorityComplaints,
    trends,
  });
});
