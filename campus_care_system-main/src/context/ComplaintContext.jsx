import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api/apiClient';
import { complaintService } from '../services/mock/complaintService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const ComplaintContext = createContext(null);
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const ComplaintProvider = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const deptsList = USE_MOCK_DATA
        ? await complaintService.listDepartments()
        : await api.departments.list();
      setDepartments(deptsList);

      if (!isAuthenticated) {
        setComplaints([]);
        setAnalytics(null);
        return;
      }

      const [complaintsList, analyticsData] = USE_MOCK_DATA
        ? await Promise.all([
            complaintService.listComplaints({}),
            complaintService.getDashboardAnalytics(),
          ])
        : await Promise.all([api.complaints.list({}), api.analytics.getDashboard()]);
      setComplaints(complaintsList);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Error refreshing complaint data:', err);
      showToast({
        title: 'Data Load Error',
        message: err.message || 'Could not fetch records from the server.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, showToast]);

  useEffect(() => {
    refreshData();
  }, [refreshData, currentUser?.id]);

  const createNewComplaint = async (formData) => {
    try {
      const created = USE_MOCK_DATA
        ? await complaintService.createComplaint(formData, currentUser)
        : await api.complaints.create(formData);
      await refreshData();
      showToast({
        title: 'Complaint Registered Successfully',
        message: `Assigned ID ${created.complaintCode}. You can track it anytime.`,
        type: 'success',
      });
      return created;
    } catch (err) {
      showToast({
        title: 'Submission Failed',
        message: err.message || 'Validation error while submitting complaint.',
        type: 'error',
      });
      throw err;
    }
  };

  const changeComplaintStatus = async (id, newStatus, note, resolutionNotes) => {
    try {
      const updated = USE_MOCK_DATA
        ? await complaintService.updateComplaintStatus(id, newStatus, note, currentUser, resolutionNotes)
        : await api.complaints.updateStatus(id, newStatus, note, currentUser, resolutionNotes);
      await refreshData();
      showToast({
        title: 'Status Updated',
        message: `Complaint status marked as ${newStatus}.`,
        type: 'success',
      });
      return updated;
    } catch (err) {
      showToast({
        title: 'Status Update Failed',
        message: err.message,
        type: 'error',
      });
      throw err;
    }
  };

  const assignDepartmentToComplaint = async (id, departmentId, staffId, note) => {
    try {
      const updated = USE_MOCK_DATA
        ? await complaintService.assignComplaint(id, departmentId, staffId, note, currentUser)
        : await api.complaints.assign(id, departmentId, staffId, note);
      await refreshData();
      showToast({
        title: 'Department Assigned',
        message: `Complaint reassigned to ${updated.departmentName}.`,
        type: 'success',
      });
      return updated;
    } catch (err) {
      showToast({
        title: 'Assignment Failed',
        message: err.message,
        type: 'error',
      });
      throw err;
    }
  };

  const updateComplaintPriority = async (id, priority) => {
    try {
      const updated = USE_MOCK_DATA
        ? await complaintService.updatePriority(id, priority, currentUser)
        : await api.complaints.updatePriority(id, priority);
      await refreshData();
      showToast({
        title: 'Priority Updated',
        message: `Ticket priority escalated to ${priority}.`,
        type: 'info',
      });
      return updated;
    } catch (err) {
      showToast({
        title: 'Update Failed',
        message: err.message,
        type: 'error',
      });
      throw err;
    }
  };

  const submitComplaintFeedback = async (complaintId, { rating, comments }) => {
    try {
      const updated = USE_MOCK_DATA
        ? await complaintService.submitFeedback(complaintId, {
            rating,
            comments,
            userId: currentUser?.id,
            userName: currentUser?.name,
          })
        : await api.complaints.submitFeedback(complaintId, { rating, comments });
      await refreshData();
      showToast({
        title: 'Feedback Recorded',
        message: `Thank you for rating our resolution (${rating} stars).`,
        type: 'success',
      });
      return updated;
    } catch (err) {
      showToast({
        title: 'Feedback Error',
        message: err.message,
        type: 'error',
      });
      throw err;
    }
  };

  const addNewDepartment = async (deptData) => {
    try {
      const created = USE_MOCK_DATA
        ? await complaintService.createDepartment(deptData)
        : await api.departments.create(deptData);
      await refreshData();
      showToast({
        title: 'Department Created',
        message: `${created.name} is now available for routing grievances.`,
        type: 'success',
      });
      return created;
    } catch (err) {
      showToast({
        title: 'Creation Failed',
        message: err.message,
        type: 'error',
      });
      throw err;
    }
  };

  const toggleDepartmentStatus = async (id, currentStatus) => {
    try {
      const updated = USE_MOCK_DATA
        ? await complaintService.updateDepartment(id, { active: !currentStatus })
        : await api.departments.update(id, { active: !currentStatus });
      await refreshData();
      showToast({
        title: updated.active ? 'Department Activated' : 'Department Deactivated',
        message: `${updated.name} status updated.`,
        type: 'info',
      });
      return updated;
    } catch (err) {
      showToast({
        title: 'Action Failed',
        message: err.message,
        type: 'error',
      });
      throw err;
    }
  };

  const resetDemo = async () => {
    try {
      if (USE_MOCK_DATA) complaintService.resetToDefault();
      else await api.resetDemoData();
      await refreshData();
      showToast({
        title: 'Demo Data Reset',
        message: USE_MOCK_DATA
          ? 'The local demo complaints and departments were restored.'
          : 'Seeded campus complaints were restored in MySQL.',
        type: 'info',
      });
    } catch (err) {
      showToast({
        title: 'Reset Failed',
        message: err.message || 'Only administrators can reset demo records.',
        type: 'error',
      });
    }
  };

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        departments,
        analytics,
        loading,
        refreshData,
        createNewComplaint,
        changeComplaintStatus,
        assignDepartmentToComplaint,
        updateComplaintPriority,
        submitComplaintFeedback,
        addNewDepartment,
        toggleDepartmentStatus,
        resetDemo,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};
