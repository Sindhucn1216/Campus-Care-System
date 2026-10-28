export const STATUSES = ['Submitted', 'In Progress', 'Resolved', 'Rejected', 'Overdue'];
export const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
export const PUBLIC_ROLES = ['student', 'faculty', 'staff'];
export const REPORTER_ROLES = ['student', 'faculty'];
export const SLA_HOURS = 48;

const ALLOWED_TRANSITIONS = {
  Submitted: ['In Progress', 'Rejected', 'Overdue'],
  'In Progress': ['Resolved', 'Rejected', 'Overdue', 'In Progress'],
  Overdue: ['In Progress', 'Resolved', 'Rejected', 'Overdue'],
  Resolved: [],
  Rejected: [],
};

export function assertStatusTransition(from, to) {
  if (from === to && to === 'In Progress') return;
  const allowed = ALLOWED_TRANSITIONS[from] || [];
  if (!allowed.includes(to)) {
    const err = new Error(`Cannot change status from ${from} to ${to}.`);
    err.status = 400;
    throw err;
  }
}

export function computeOverdue(row) {
  if (row.status === 'Resolved' || row.status === 'Rejected') return false;
  if (row.status === 'Overdue' || Number(row.is_overdue) === 1) return true;
  const created = row.created_at instanceof Date ? row.created_at : new Date(row.created_at);
  const hours = (Date.now() - created.getTime()) / (1000 * 60 * 60);
  return hours > SLA_HOURS;
}
