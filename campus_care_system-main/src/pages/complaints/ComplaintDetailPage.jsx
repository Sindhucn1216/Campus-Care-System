import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusTimeline from '../../components/complaints/StatusTimeline';
import FeedbackModal from '../../components/complaints/FeedbackModal';
import AssignDepartmentModal from '../../components/complaints/AssignDepartmentModal';
import UpdateStatusModal from '../../components/complaints/UpdateStatusModal';
import { formatDate, getRelativeTime } from '../../utils/formatters';
import {
  ArrowLeft,
  MapPin,
  Building2,
  Calendar,
  User,
  Star,
  ShieldCheck,
  Edit,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const ComplaintDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { complaints, submitComplaintFeedback } = useComplaints();
  const { currentUser, role } = useAuth();

  const [complaint, setComplaint] = useState(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const clean = id.trim().toUpperCase();
    const found = complaints.find(
      (c) => c.complaintCode.toUpperCase() === clean || c.id === id
    );
    setComplaint(found || null);
  }, [id, complaints]);

  if (!complaint) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Complaint Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested complaint identifier "{id}" does not exist in the system.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  const isReporter = currentUser?.id === complaint.reporterId;
  const canManage = role === 'admin' || role === 'staff';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Staff/Admin Action Quick Buttons */}
        {canManage && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAssignModalOpen(true)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Route Department
            </button>
            <button
              onClick={() => setStatusModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              Update Status
            </button>
          </div>
        )}
      </div>

      {/* Main Grievance Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-extrabold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl">
                {complaint.complaintCode}
              </span>
              <StatusBadge status={complaint.status} size="md" />
              <PriorityBadge priority={complaint.priority} size="md" />
              {complaint.isOverdue && complaint.status !== 'Resolved' && (
                <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                  SLA Breached
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {complaint.title}
            </h1>
          </div>

          {complaint.status === 'Resolved' && (
            <div>
              {complaint.feedback ? (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>Student Rating: {complaint.feedback.rating}/5</span>
                  </div>
                  {complaint.feedback.comments && (
                    <p className="text-emerald-700 italic">"{complaint.feedback.comments}"</p>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setFeedbackModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  <Star className="w-4 h-4 fill-white" />
                  <span>Rate Resolution</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-slate-400 font-semibold uppercase tracking-wider">Campus Location</p>
            <div className="flex items-start gap-1.5 font-semibold text-slate-800 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
              <div>
                <p>{complaint.location}</p>
                {complaint.specificLocation && (
                  <p className="text-slate-500 font-normal">{complaint.specificLocation}</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-slate-400 font-semibold uppercase tracking-wider">Assigned Resolution Desk</p>
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 mt-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>{complaint.departmentName || 'Pending Admin Assignment'}</span>
            </div>
            {complaint.assignedStaffName && (
              <p className="text-[11px] text-slate-500 mt-0.5">Lead: {complaint.assignedStaffName}</p>
            )}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-slate-400 font-semibold uppercase tracking-wider">Reported By</p>
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 mt-1">
              <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>{complaint.reporterName}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 capitalize">{complaint.reporterRole}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-slate-400 font-semibold uppercase tracking-wider">Lodged Date</p>
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 mt-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>{formatDate(complaint.createdAt)}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">{getRelativeTime(complaint.createdAt)}</p>
          </div>
        </div>

        {/* Grievance Description & Image */}
        <div className="space-y-4 pt-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Grievance Description
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-100 mt-1.5">
              {complaint.description}
            </p>
          </div>

          {complaint.imageUrl && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Attached Photo Evidence
              </h3>
              <div className="max-w-md rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <img
                  src={complaint.imageUrl}
                  alt={complaint.title}
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resolution Workflow & History Timeline */}
      <StatusTimeline complaint={complaint} />

      {/* Modals */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        complaint={complaint}
        onSubmitFeedback={submitComplaintFeedback}
      />

      <AssignDepartmentModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        complaint={complaint}
      />

      <UpdateStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        complaint={complaint}
      />
    </div>
  );
};

export default ComplaintDetailPage;
