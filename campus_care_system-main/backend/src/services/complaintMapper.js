import { env } from '../config/env.js';
import { capitalizeRole, toIso } from '../utils/ids.js';
import { computeOverdue } from '../utils/status.js';

function imageUrlFor(row) {
  if (row.image_filename) {
    return `http://localhost:${env.port}/api/complaints/${row.id}/image`;
  }
  return row.image_url || null;
}

export function mapComplaint(row, { updates = [], feedback = null, publicView = false } = {}) {
  const overdue = computeOverdue(row);
  const mapped = {
    id: row.id,
    complaintCode: row.complaint_code,
    title: row.title,
    description: row.description,
    categoryId: row.category_id,
    categoryName: row.category_name,
    location: row.location,
    specificLocation: row.specific_location || '',
    priority: row.priority,
    status: row.status,
    departmentId: row.department_id || null,
    departmentName: row.department_name || null,
    assignedStaffId: publicView ? null : row.assigned_staff_id || null,
    assignedStaffName: publicView ? null : row.assigned_staff_name || null,
    imageUrl: imageUrlFor(row),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
    resolvedAt: toIso(row.resolved_at),
    resolutionNotes: row.resolution_notes || null,
    isOverdue: overdue,
    updates: updates.map((u) => ({
      id: u.id,
      complaintId: u.complaint_id,
      updatedBy: publicView ? null : u.updated_by,
      updatedByName: u.updated_by_name || 'CampusCare Desk',
      oldStatus: u.old_status,
      newStatus: u.new_status,
      note: u.note,
      createdAt: toIso(u.created_at),
    })),
    feedback: feedback
      ? {
          id: feedback.id,
          complaintId: feedback.complaint_id,
          userId: publicView ? null : feedback.user_id,
          rating: feedback.rating,
          comments: feedback.comments || '',
          createdAt: toIso(feedback.created_at),
        }
      : null,
  };

  if (publicView) {
    return mapped;
  }

  mapped.reporterId = row.reporter_id;
  mapped.reporterName = row.reporter_name;
  mapped.reporterRole = capitalizeRole(row.reporter_role);
  return mapped;
}

export function resolveImageSrc(row) {
  if (row.image_filename) return { type: 'file', filename: row.image_filename };
  if (row.image_url) return { type: 'url', url: row.image_url };
  return null;
}
