import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useComplaints } from '../../context/ComplaintContext';
import { COMPLAINT_PRIORITIES } from '../../constants';
import { Building2, ShieldAlert, ArrowRight } from 'lucide-react';

export const AssignDepartmentModal = ({
  isOpen,
  onClose,
  complaint,
}) => {
  const { departments, assignDepartmentToComplaint, updateComplaintPriority } = useComplaints();
  const [selectedDeptId, setSelectedDeptId] = useState(complaint?.departmentId || departments[0]?.id || '');
  const [selectedPriority, setSelectedPriority] = useState(complaint?.priority || 'Medium');
  const [assignmentNote, setAssignmentNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complaint) return;

    try {
      setLoading(true);
      if (selectedPriority !== complaint.priority) {
        await updateComplaintPriority(complaint.id, selectedPriority);
      }
      await assignDepartmentToComplaint(
        complaint.id,
        selectedDeptId,
        null,
        assignmentNote || `Reassigned by Administrator.`
      );
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!complaint) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Department & Route Ticket"
      subtitle={`Ticket ${complaint.complaintCode}: ${complaint.title}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Target Resolution Department
          </label>
          <select
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          >
            {departments.filter((d) => d.active).map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.head})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Confirm / Escalate Priority
          </label>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          >
            {Object.values(COMPLAINT_PRIORITIES).map((p) => (
              <option key={p} value={p}>
                {p} Priority
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Internal Dispatch Note
          </label>
          <textarea
            value={assignmentNote}
            onChange={(e) => setAssignmentNote(e.target.value)}
            rows={3}
            placeholder="e.g., Forwarding to electrical lead for urgent generator inspection..."
            className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50"
          />
        </div>

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
            {loading ? 'Routing...' : 'Confirm Assignment'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignDepartmentModal;
