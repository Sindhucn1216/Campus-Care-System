import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useComplaints } from '../../context/ComplaintContext';
import { COMPLAINT_STATUSES } from '../../constants';
import { CheckCircle2, AlertTriangle, ArrowRight, XCircle } from 'lucide-react';

export const UpdateStatusModal = ({
  isOpen,
  onClose,
  complaint,
}) => {
  const { changeComplaintStatus } = useComplaints();
  const [newStatus, setNewStatus] = useState(complaint?.status || 'In Progress');
  const [note, setNote] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState(complaint?.resolutionNotes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complaint) return;

    if (newStatus === 'Resolved' && !resolutionNotes.trim()) {
      setError('Please provide detailed resolution notes explaining how this issue was resolved.');
      return;
    }

    if (newStatus === 'Rejected' && !note.trim()) {
      setError('Please provide a specific rejection rationale.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await changeComplaintStatus(complaint.id, newStatus, note, resolutionNotes);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update status.');
    } finally {
      setLoading(false);
    }
  };

  if (!complaint) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Complaint Status"
      subtitle={`Ticket ${complaint.complaintCode} — ${complaint.title}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Select New Status
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['In Progress', 'Resolved', 'Rejected', 'Overdue'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setNewStatus(st);
                  setError('');
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                  newStatus === st
                    ? st === 'Resolved'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                      : st === 'Rejected'
                      ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-sm'
                      : st === 'Overdue'
                      ? 'bg-red-50 border-red-500 text-red-700 shadow-sm'
                      : 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {newStatus === 'Resolved' && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Resolution Summary (Required for Resolved Tickets)
            </label>
            <textarea
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              rows={3}
              required
              placeholder="Detail the technical fix, replaced components, vendor work, or facility verification..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-emerald-200 bg-emerald-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            {newStatus === 'Rejected' ? 'Rejection Reason (Required)' : 'Staff Progress Note'}
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder={
              newStatus === 'Rejected'
                ? 'Specify why this grievance is being rejected or marked duplicate...'
                : 'Brief note for the public tracking timeline...'
            }
            className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm hover:shadow-blue-500/25 disabled:opacity-50"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            {loading ? 'Saving...' : 'Update Status'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateStatusModal;
