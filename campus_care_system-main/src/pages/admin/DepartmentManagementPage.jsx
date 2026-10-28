import React, { useState } from 'react';
import { useComplaints } from '../../context/ComplaintContext';
import Modal from '../../components/common/Modal';
import {
  Building2,
  Plus,
  Edit2,
  CheckCircle2,
  XCircle,
  Mail,
  User,
  Layers,
  Users,
  Search,
} from 'lucide-react';

export const DepartmentManagementPage = () => {
  const { departments, addNewDepartment, toggleDepartmentStatus } = useComplaints();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [newDept, setNewDept] = useState({
    name: '',
    code: '',
    head: '',
    contact: '',
    staffCount: 4,
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredDepartments = departments.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.head && d.head.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newDept.name.trim()) {
      setError('Department name is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await addNewDepartment(newDept);
      setNewDept({ name: '', code: '', head: '', contact: '', staffCount: 4 });
      setModalOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to create department.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-campus-900 mt-2">
            Campus Resolution Departments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure resolution desks, department leads, active routing status, and technician capacity.
          </p>
        </div>

        <button
          onClick={() => {
            setError('');
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search department name, code, or lead..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          />
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.map((dept) => (
          <div
            key={dept.id}
            className={`bg-white rounded-3xl border p-6 shadow-sm flex flex-col justify-between transition-all ${
              dept.active ? 'border-slate-200 hover:border-blue-300' : 'border-slate-200/60 bg-slate-50/50 opacity-75'
            }`}
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs font-mono shadow-inner">
                  {dept.code}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      dept.active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${dept.active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    {dept.active ? 'Active Desk' : 'Deactivated'}
                  </span>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-4 leading-snug">{dept.name}</h3>

              <div className="space-y-2 mt-4 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>
                    Lead: <strong className="text-slate-700">{dept.head || 'Unassigned'}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{dept.contact || 'contact@campuscare.edu'}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs">
                <div>
                  <span className="text-slate-400">Assigned: </span>
                  <span className="font-bold text-blue-600">{dept.assignedCount || 0}</span>
                </div>
                <div>
                  <span className="text-slate-400">Staff: </span>
                  <span className="font-bold text-slate-700">{dept.staffCount || 1}</span>
                </div>
              </div>

              <button
                onClick={() => toggleDepartmentStatus(dept.id, dept.active)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
                  dept.active
                    ? 'text-rose-600 bg-rose-50 border-rose-200 hover:bg-rose-100'
                    : 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                {dept.active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Department Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Campus Resolution Desk"
        subtitle="Add a new administrative department to triage complaints."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Department Name *
            </label>
            <input
              type="text"
              value={newDept.name}
              onChange={(e) => {
                setNewDept({ ...newDept, name: e.target.value });
                setError('');
              }}
              required
              placeholder="e.g. Campus Safety & Security"
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Desk Code
              </label>
              <input
                type="text"
                value={newDept.code}
                onChange={(e) => setNewDept({ ...newDept, code: e.target.value })}
                placeholder="e.g. SEC"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 uppercase font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Staff Members
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={newDept.staffCount}
                onChange={(e) => setNewDept({ ...newDept, staffCount: e.target.value })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Department Head / Lead Officer
            </label>
            <input
              type="text"
              value={newDept.head}
              onChange={(e) => setNewDept({ ...newDept, head: e.target.value })}
              placeholder="e.g. Major R. K. Nair"
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Official Desk Email
            </label>
            <input
              type="email"
              value={newDept.contact}
              onChange={(e) => setNewDept({ ...newDept, contact: e.target.value })}
              placeholder="security@campuscare.edu"
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm hover:shadow-blue-500/25 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Add Department'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DepartmentManagementPage;
