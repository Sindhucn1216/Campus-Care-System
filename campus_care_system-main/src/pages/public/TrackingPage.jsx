import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusTimeline from '../../components/complaints/StatusTimeline';
import FeedbackModal from '../../components/complaints/FeedbackModal';
import { formatDate, getRelativeTime } from '../../utils/formatters';
import {
  Search,
  MapPin,
  Building2,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Star,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export const TrackingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { complaints, submitComplaintFeedback } = useComplaints();

  const [inputCode, setInputCode] = useState(searchParams.get('id') || '');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [error, setError] = useState('');
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  // Auto-search if query param present
  useEffect(() => {
    const queryId = searchParams.get('id');
    if (queryId) {
      setInputCode(queryId);
      lookupComplaint(queryId);
    } else if (complaints.length > 0) {
      // Default to first complaint so user sees a working view immediately!
      setSelectedComplaint(complaints[0]);
    }
  }, [searchParams, complaints]);

  const lookupComplaint = (code) => {
    if (!code || !code.trim()) {
      setError('Please provide a Complaint ID or Tracking Code.');
      setSelectedComplaint(null);
      return;
    }

    const clean = code.trim().toUpperCase();
    const found = complaints.find(
      (c) => c.complaintCode.toUpperCase() === clean || c.id === code.trim()
    );

    if (found) {
      setSelectedComplaint(found);
      setError('');
    } else {
      setSelectedComplaint(null);
      setError(`No grievance found matching "${code}". Please check your tracking ID.`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      setSearchParams({ id: inputCode.trim() });
      lookupComplaint(inputCode.trim());
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Search Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm text-center max-w-2xl mx-auto space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
          <Search className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-campus-900">
            Track Grievance Resolution
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enter your unique complaint tracking number to view real-time department updates.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 pt-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="e.g. CMP-2026-001"
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-sm hover:shadow-blue-500/20"
          >
            Track Status
          </button>
        </form>

        {/* Quick sample chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-slate-500">
          <span>Quick Samples:</span>
          {complaints.slice(0, 3).map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setInputCode(c.complaintCode);
                setSearchParams({ id: c.complaintCode });
                setSelectedComplaint(c);
                setError('');
              }}
              className="font-mono text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200"
            >
              {c.complaintCode}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Found Complaint Display */}
      {selectedComplaint && (
        <div className="space-y-6">
          {/* Main Info Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-base text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl">
                    {selectedComplaint.complaintCode}
                  </span>
                  <StatusBadge status={selectedComplaint.status} size="md" />
                  <PriorityBadge priority={selectedComplaint.priority} size="md" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                  {selectedComplaint.title}
                </h2>
              </div>

              {selectedComplaint.status === 'Resolved' && (
                <div>
                  {selectedComplaint.feedback ? (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">
                        Rated {selectedComplaint.feedback.rating}/5 Stars
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setFeedbackModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      <Star className="w-4 h-4 fill-white" />
                      <span>Provide Feedback</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-slate-100 text-xs">
              <div>
                <p className="text-slate-400 uppercase tracking-wider font-semibold">Category</p>
                <p className="font-medium text-slate-800 mt-1">{selectedComplaint.categoryName}</p>
              </div>

              <div>
                <p className="text-slate-400 uppercase tracking-wider font-semibold">Assigned Desk</p>
                <div className="flex items-center gap-1.5 font-medium text-slate-800 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedComplaint.departmentName || 'Triage in Progress'}</span>
                </div>
              </div>

              <div>
                <p className="text-slate-400 uppercase tracking-wider font-semibold">Location</p>
                <div className="flex items-center gap-1.5 font-medium text-slate-800 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedComplaint.location}</span>
                </div>
                {selectedComplaint.specificLocation && (
                  <p className="text-slate-500 text-[11px] mt-0.5">{selectedComplaint.specificLocation}</p>
                )}
              </div>

              <div>
                <p className="text-slate-400 uppercase tracking-wider font-semibold">Submitted On</p>
                <div className="flex items-center gap-1.5 font-medium text-slate-800 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatDate(selectedComplaint.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Description & Optional Image */}
            <div className="pt-6 space-y-4">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Grievance Description
                </h4>
                <p className="text-sm text-slate-700 mt-1.5 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {selectedComplaint.description}
                </p>
              </div>

              {selectedComplaint.imageUrl && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Attached Photo Verification
                  </h4>
                  <div className="max-w-md rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                    <img
                      src={selectedComplaint.imageUrl}
                      alt="Complaint attachment"
                      className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Resolution Timeline */}
          <StatusTimeline complaint={selectedComplaint} />

          {/* Security & Access Notice */}
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-500 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700">Demonstration Tracking Notice:</span> In this frontend prototype, public tracking demonstrates the end-to-end resolution timeline. In the production Express & MySQL deployment, role-based authorization headers ensure privacy safeguards for non-public records.
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {selectedComplaint && (
        <FeedbackModal
          isOpen={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          complaint={selectedComplaint}
          onSubmitFeedback={submitComplaintFeedback}
        />
      )}
    </div>
  );
};

export default TrackingPage;
