// Mock Service Layer for CampusCare Complaints & Departments
// Persists safely to localStorage for interactive demo flow

import { INITIAL_COMPLAINTS } from './mockData';
import { INITIAL_DEPARTMENTS, COMPLAINT_CATEGORIES } from '../../constants';

const COMPLAINTS_STORAGE_KEY = 'campuscare_complaints_v1';
const DEPARTMENTS_STORAGE_KEY = 'campuscare_departments_v1';

// Initialize storage if empty
const getStoredComplaints = () => {
  try {
    const raw = localStorage.getItem(COMPLAINTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(INITIAL_COMPLAINTS));
      return INITIAL_COMPLAINTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('LocalStorage access issue, using in-memory mock', e);
    return INITIAL_COMPLAINTS;
  }
};

const saveComplaints = (complaints) => {
  try {
    localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(complaints));
  } catch (e) {
    console.error('Failed to save complaints to localStorage', e);
  }
};

const getStoredDepartments = () => {
  try {
    const raw = localStorage.getItem(DEPARTMENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(DEPARTMENTS_STORAGE_KEY, JSON.stringify(INITIAL_DEPARTMENTS));
      return INITIAL_DEPARTMENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_DEPARTMENTS;
  }
};

const saveDepartments = (departments) => {
  try {
    localStorage.setItem(DEPARTMENTS_STORAGE_KEY, JSON.stringify(departments));
  } catch (e) {
    console.error('Failed to save departments to localStorage', e);
  }
};

export const complaintService = {
  // Get all complaints with flexible filtering
  listComplaints: async (filters = {}) => {
    let list = getStoredComplaints();
    const { status, category, priority, departmentId, search, reporterId } = filters;

    if (reporterId) {
      list = list.filter((c) => c.reporterId === reporterId);
    }

    if (status && status !== 'All') {
      list = list.filter((c) => c.status.toLowerCase() === status.toLowerCase());
    }

    if (category && category !== 'All') {
      list = list.filter((c) => c.categoryName.toLowerCase() === category.toLowerCase() || c.categoryId === category);
    }

    if (priority && priority !== 'All') {
      list = list.filter((c) => c.priority.toLowerCase() === priority.toLowerCase());
    }

    if (departmentId && departmentId !== 'All') {
      list = list.filter((c) => c.departmentId === departmentId);
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.complaintCode.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q))
      );
    }

    // Default newest first
    return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // Find complaint by ID or complaintCode
  getComplaintById: async (idOrCode) => {
    const list = getStoredComplaints();
    const cleanQuery = (idOrCode || '').trim().toUpperCase();
    const item = list.find(
      (c) => c.id === idOrCode || c.complaintCode.toUpperCase() === cleanQuery
    );
    if (!item) {
      throw new Error(`Complaint with identifier "${idOrCode}" not found.`);
    }
    return item;
  },

  // Create a new complaint
  createComplaint: async (data, reporter) => {
    const list = getStoredComplaints();
    const departments = getStoredDepartments();

    // Generate code
    const year = new Date().getFullYear();
    const nextSeq = list.length + 1;
    const complaintCode = `CMP-${year}-${String(nextSeq).padStart(3, '0')}`;

    // Auto-match department from category if not explicitly specified
    let matchedDeptId = data.departmentId || null;
    let matchedDeptName = null;

    if (!matchedDeptId) {
      const catLower = (data.categoryName || '').toLowerCase();
      if (catLower.includes('it') || catLower.includes('wi-fi')) matchedDeptId = 'dept-1';
      else if (catLower.includes('infra')) matchedDeptId = 'dept-2';
      else if (catLower.includes('clean')) matchedDeptId = 'dept-3';
      else if (catLower.includes('elec')) matchedDeptId = 'dept-4';
      else if (catLower.includes('water')) matchedDeptId = 'dept-5';
      else if (catLower.includes('transport')) matchedDeptId = 'dept-6';
    }

    if (matchedDeptId) {
      const deptObj = departments.find((d) => d.id === matchedDeptId);
      if (deptObj) matchedDeptName = deptObj.name;
    }

    const newComplaint = {
      id: `cmp-${Date.now()}`,
      complaintCode,
      title: data.title.trim(),
      description: data.description.trim(),
      categoryId: data.categoryId || 'cat-7',
      categoryName: data.categoryName || 'Other',
      location: data.location,
      specificLocation: data.specificLocation || '',
      priority: data.priority || 'Medium',
      status: 'Submitted',
      reporterId: reporter?.id || 'usr-student-1',
      reporterName: reporter?.name || 'Anonymous Student',
      reporterRole: reporter?.role || 'Student',
      departmentId: matchedDeptId,
      departmentName: matchedDeptName,
      assignedStaffId: null,
      assignedStaffName: null,
      imageUrl: data.imageUrl || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resolvedAt: null,
      resolutionNotes: null,
      isOverdue: false,
      updates: [
        {
          id: `upd-${Date.now()}`,
          complaintId: `cmp-${Date.now()}`,
          updatedBy: reporter?.id || 'system',
          updatedByName: reporter?.name || 'System Automated Entry',
          oldStatus: 'None',
          newStatus: 'Submitted',
          note: `Grievance registered in system. Department routing: ${matchedDeptName || 'Unassigned (Pending Admin Review)'}.`,
          createdAt: new Date().toISOString(),
        },
      ],
      feedback: null,
    };

    const updatedList = [newComplaint, ...list];
    saveComplaints(updatedList);
    return newComplaint;
  },

  // Update Status & Notes (by Staff or Admin)
  updateComplaintStatus: async (id, newStatus, note, updatedByUser, resolutionNotes = '') => {
    const list = getStoredComplaints();
    const index = list.findIndex((c) => c.id === id || c.complaintCode === id);
    if (index === -1) throw new Error('Complaint not found');

    const complaint = list[index];
    const oldStatus = complaint.status;
    const now = new Date().toISOString();

    const isResolved = newStatus === 'Resolved';
    const isOverdue = newStatus === 'Overdue' ? true : complaint.isOverdue;

    const newUpdate = {
      id: `upd-${Date.now()}`,
      complaintId: complaint.id,
      updatedBy: updatedByUser?.id || 'user',
      updatedByName: updatedByUser?.name || 'Authorized Staff',
      oldStatus,
      newStatus,
      note: note || `Status changed from ${oldStatus} to ${newStatus}.`,
      createdAt: now,
    };

    const updatedComplaint = {
      ...complaint,
      status: newStatus,
      isOverdue: newStatus === 'Resolved' ? false : isOverdue,
      updatedAt: now,
      resolvedAt: isResolved ? (complaint.resolvedAt || now) : null,
      resolutionNotes: resolutionNotes ? resolutionNotes : (isResolved ? (complaint.resolutionNotes || note) : complaint.resolutionNotes),
      updates: [...(complaint.updates || []), newUpdate],
    };

    list[index] = updatedComplaint;
    saveComplaints(list);
    return updatedComplaint;
  },

  // Assign to Department and optional Staff member
  assignComplaint: async (id, departmentId, assignedStaffId, note, updatedByUser) => {
    const list = getStoredComplaints();
    const departments = getStoredDepartments();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Complaint not found');

    const complaint = list[index];
    const dept = departments.find((d) => d.id === departmentId);
    const now = new Date().toISOString();

    const newUpdate = {
      id: `upd-${Date.now()}`,
      complaintId: complaint.id,
      updatedBy: updatedByUser?.id || 'admin',
      updatedByName: updatedByUser?.name || 'Administrator',
      oldStatus: complaint.status,
      newStatus: complaint.status === 'Submitted' ? 'In Progress' : complaint.status,
      note: note || `Assigned to department: ${dept ? dept.name : departmentId}.`,
      createdAt: now,
    };

    const updatedComplaint = {
      ...complaint,
      status: complaint.status === 'Submitted' ? 'In Progress' : complaint.status,
      departmentId,
      departmentName: dept ? dept.name : complaint.departmentName,
      assignedStaffId: assignedStaffId || complaint.assignedStaffId,
      assignedStaffName: assignedStaffId ? (dept?.head || 'Staff Member') : complaint.assignedStaffName,
      updatedAt: now,
      updates: [...(complaint.updates || []), newUpdate],
    };

    list[index] = updatedComplaint;
    saveComplaints(list);
    return updatedComplaint;
  },

  // Update Priority
  updatePriority: async (id, priority, updatedByUser) => {
    const list = getStoredComplaints();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Complaint not found');

    const complaint = list[index];
    const now = new Date().toISOString();

    const updatedComplaint = {
      ...complaint,
      priority,
      updatedAt: now,
      updates: [
        ...(complaint.updates || []),
        {
          id: `upd-${Date.now()}`,
          complaintId: complaint.id,
          updatedBy: updatedByUser?.id || 'admin',
          updatedByName: updatedByUser?.name || 'Administrator',
          oldStatus: complaint.status,
          newStatus: complaint.status,
          note: `Priority changed from ${complaint.priority} to ${priority}.`,
          createdAt: now,
        },
      ],
    };

    list[index] = updatedComplaint;
    saveComplaints(list);
    return updatedComplaint;
  },

  // Submit Feedback on resolved issue
  submitFeedback: async (complaintId, { rating, comments, userId, userName }) => {
    const list = getStoredComplaints();
    const index = list.findIndex((c) => c.id === complaintId);
    if (index === -1) throw new Error('Complaint not found');

    const complaint = list[index];
    if (complaint.status !== 'Resolved') {
      throw new Error('Feedback can only be provided for resolved complaints.');
    }

    if (complaint.feedback) {
      throw new Error('Feedback has already been submitted for this complaint.');
    }

    const feedbackObj = {
      id: `fb-${Date.now()}`,
      complaintId,
      userId: userId || 'anonymous',
      userName: userName || 'Student',
      rating: Number(rating),
      comments: comments ? comments.trim() : '',
      createdAt: new Date().toISOString(),
    };

    const updatedComplaint = {
      ...complaint,
      feedback: feedbackObj,
    };

    list[index] = updatedComplaint;
    saveComplaints(list);
    return updatedComplaint;
  },

  // Department Management
  listDepartments: async () => {
    const list = getStoredComplaints();
    const depts = getStoredDepartments();

    // Calculate real-time counts from current complaints
    return depts.map((d) => {
      const activeCount = list.filter((c) => c.departmentId === d.id && c.status !== 'Resolved' && c.status !== 'Rejected').length;
      return {
        ...d,
        assignedCount: activeCount,
      };
    });
  },

  createDepartment: async (deptData) => {
    const depts = getStoredDepartments();
    const exists = depts.some((d) => d.name.toLowerCase() === deptData.name.trim().toLowerCase());
    if (exists) {
      throw new Error(`A department with the name "${deptData.name}" already exists.`);
    }

    const newDept = {
      id: `dept-${Date.now()}`,
      name: deptData.name.trim(),
      code: deptData.code ? deptData.code.trim().toUpperCase() : deptData.name.slice(0, 4).toUpperCase(),
      active: true,
      head: deptData.head?.trim() || 'Unassigned',
      contact: deptData.contact?.trim() || 'contact@campuscare.edu',
      assignedCount: 0,
      staffCount: Number(deptData.staffCount) || 1,
    };

    const updated = [...depts, newDept];
    saveDepartments(updated);
    return newDept;
  },

  updateDepartment: async (id, updates) => {
    const depts = getStoredDepartments();
    const index = depts.findIndex((d) => d.id === id);
    if (index === -1) throw new Error('Department not found');

    if (updates.name) {
      const duplicate = depts.some(
        (d) => d.id !== id && d.name.toLowerCase() === updates.name.trim().toLowerCase()
      );
      if (duplicate) throw new Error(`Another department with name "${updates.name}" already exists.`);
    }

    const updatedDept = { ...depts[index], ...updates };
    depts[index] = updatedDept;
    saveDepartments(depts);
    return updatedDept;
  },

  // Calculate comprehensive dashboard analytics
  getDashboardAnalytics: async (departmentFilter = null) => {
    let complaints = getStoredComplaints();
    if (departmentFilter && departmentFilter !== 'All') {
      complaints = complaints.filter((c) => c.departmentId === departmentFilter);
    }

    const total = complaints.length;
    const submitted = complaints.filter((c) => c.status === 'Submitted').length;
    const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
    const resolved = complaints.filter((c) => c.status === 'Resolved').length;
    const rejected = complaints.filter((c) => c.status === 'Rejected').length;
    const overdue = complaints.filter((c) => c.status === 'Overdue' || (c.isOverdue && c.status !== 'Resolved')).length;

    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    // Calculate average resolution time in hours
    const resolvedItems = complaints.filter((c) => c.status === 'Resolved' && c.resolvedAt);
    let avgResolutionHours = 0;
    if (resolvedItems.length > 0) {
      const totalHours = resolvedItems.reduce((acc, curr) => {
        const start = new Date(curr.createdAt);
        const end = new Date(curr.resolvedAt);
        const hours = (end - start) / (1000 * 60 * 60);
        return acc + Math.max(hours, 0.5);
      }, 0);
      avgResolutionHours = Math.round((totalHours / resolvedItems.length) * 10) / 10;
    }

    // Category distribution
    const categoryDistribution = COMPLAINT_CATEGORIES.map((cat) => {
      const count = complaints.filter((c) => c.categoryId === cat.id || c.categoryName.toLowerCase() === cat.name.toLowerCase()).length;
      return {
        name: cat.name,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      };
    });

    // Department Performance
    const departments = getStoredDepartments();
    const departmentPerformance = departments.map((dept) => {
      const deptComplaints = complaints.filter((c) => c.departmentId === dept.id);
      const deptResolved = deptComplaints.filter((c) => c.status === 'Resolved').length;
      const deptActive = deptComplaints.filter((c) => c.status === 'In Progress' || c.status === 'Submitted').length;
      const deptOverdue = deptComplaints.filter((c) => c.isOverdue || c.status === 'Overdue').length;
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

    // Recent activity feed
    const activityFeed = [];
    complaints.forEach((c) => {
      if (c.updates && c.updates.length > 0) {
        c.updates.forEach((u) => {
          activityFeed.push({
            ...u,
            complaintTitle: c.title,
            complaintCode: c.complaintCode,
            complaintId: c.id,
          });
        });
      }
    });
    activityFeed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // High Priority active complaints
    const highPriorityComplaints = complaints
      .filter((c) => (c.priority === 'High' || c.priority === 'Urgent') && c.status !== 'Resolved' && c.status !== 'Rejected')
      .slice(0, 5);

    // Mock trend data for Recharts (past 7 days activity)
    const trends = [
      { day: 'Mon', submitted: 4, resolved: 3, inProgress: 2 },
      { day: 'Tue', submitted: 6, resolved: 5, inProgress: 3 },
      { day: 'Wed', submitted: 8, resolved: 6, inProgress: 4 },
      { day: 'Thu', submitted: 5, resolved: 7, inProgress: 3 },
      { day: 'Fri', submitted: 7, resolved: 6, inProgress: 5 },
      { day: 'Sat', submitted: 3, resolved: 4, inProgress: 2 },
      { day: 'Sun', submitted: 2, resolved: 3, inProgress: 1 },
    ];

    return {
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
      activityFeed: activityFeed.slice(0, 8),
      highPriorityComplaints,
      trends,
    };
  },

  // Reset to initial mock data (helpful for testing and demos)
  resetToDefault: () => {
    localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(INITIAL_COMPLAINTS));
    localStorage.setItem(DEPARTMENTS_STORAGE_KEY, JSON.stringify(INITIAL_DEPARTMENTS));
    return { success: true };
  },
};
