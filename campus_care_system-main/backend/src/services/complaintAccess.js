import { HttpError } from '../utils/httpError.js';

export function canViewComplaint(user, complaint) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (user.role === 'staff') {
    return Boolean(user.department_id && complaint.department_id === user.department_id);
  }
  return complaint.reporter_id === user.id;
}

export function canManageComplaint(user, complaint) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (user.role === 'staff') {
    return Boolean(user.department_id && complaint.department_id === user.department_id);
  }
  return false;
}

export function assertCanView(user, complaint) {
  if (!canViewComplaint(user, complaint)) {
    throw new HttpError(404, 'Complaint not found.');
  }
}

export function assertCanManage(user, complaint) {
  if (!canManageComplaint(user, complaint)) {
    throw new HttpError(403, 'You are not authorized to update this complaint.');
  }
}

export function visibilityClause(user, { alias = 'c' } = {}) {
  if (user.role === 'admin') {
    return { sql: '1=1', params: [] };
  }
  if (user.role === 'staff') {
    if (!user.department_id) {
      return { sql: '1=0', params: [] };
    }
    return { sql: `${alias}.department_id = ?`, params: [user.department_id] };
  }
  return { sql: `${alias}.reporter_id = ?`, params: [user.id] };
}
