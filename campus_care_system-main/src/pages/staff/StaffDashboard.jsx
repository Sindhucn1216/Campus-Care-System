import React, { useState, useMemo } from 'react';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import ComplaintFilterBar from '../../components/complaints/ComplaintFilterBar';
import ComplaintTable from '../../components/complaints/ComplaintTable';
import UpdateStatusModal from '../../components/complaints/UpdateStatusModal';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building2,
  ShieldAlert,
} from 'lucide-react';

export const StaffDashboard = () => {
  const { complaints } = useComplaints();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [sortBy, setSortBy] = useState('priority');
  const [activeComplaintForStatus, setActiveComplaintForStatus] = useState(null);

  // Department identification: Staff user's department or default to IT Support ('dept-1')
  const staffDeptId = currentUser?.departmentId || 'dept-1';
  const staffDeptName = currentUser?.departmentName || 'IT Support & Networks';

  // Department complaints queue
  const departmentComplaints = useMemo(() => {
    return complaints.filter(
      (c) => c.departmentId === staffDeptId || !c.departmentId
    );
  }, [complaints, staffDeptId]);

  // Derived counts
  const totalAssigned = departmentComplaints.length;
  const inProgress = departmentComplaints.filter((c) => c.status === 'In Progress').length;
  const resolved = departmentComplaints.filter((c) => c.status === 'Resolved').length;
  const overdue = departmentComplaints.filter((c) => c.isOverdue || c.status === 'Overdue').length;

  const filteredComplaints = useMemo(() => {
    let list = [...departmentComplaints];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.complaintCode.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q)
      );
    }

    if (selectedStatus !== 'All') {
      list = list.filter((c) => c.status.toLowerCase() === selectedStatus.toLowerCase());
    }

    if (selectedCategory !== 'All') {
      list = list.filter(
        (c) =>
          c.categoryName.toLowerCase() === selectedCategory.toLowerCase() ||
          c.categoryId === selectedCategory
      );
    }

    if (selectedPriority !== 'All') {
      list = list.filter((c) => c.priority.toLowerCase() === selectedPriority.toLowerCase());
    }

    list.sort((a, b) => {
      if (sortBy === 'priority') {
        const order = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
        return (order[b.priority] || 0) - (order[a.priority] || 0);
      }
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      return 0;
    });

    return list;
  }, [departmentComplaints, searchQuery, selectedStatus, selectedCategory, selectedPriority, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-campus-900 via-navy-900 to-campus-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              {staffDeptName} Desk
            </span>
            <span className="text-xs text-slate-300">Staff: {currentUser?.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Department Triage & Resolution Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Inspect assigned tickets, record technical diagnostic notes, update dispatch stages, and close verified complaints.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        <StatCard
          title="Assigned Queue"
          value={totalAssigned}
          subtitle="Department total"
          icon={FileText}
          variant="blue"
          onClick={() => setSelectedStatus('All')}
        />
        <StatCard
          title="Under Resolution"
          value={inProgress}
          subtitle="Active on-site work"
          icon={Wrench}
          variant="amber"
          onClick={() => setSelectedStatus('In Progress')}
        />
        <StatCard
          title="Resolved"
          value={resolved}
          subtitle="Verified closed"
          icon={CheckCircle2}
          variant="emerald"
          onClick={() => setSelectedStatus('Resolved')}
        />
        <StatCard
          title="Overdue SLA"
          value={overdue}
          subtitle="Requires attention"
          icon={AlertTriangle}
          variant="red"
          onClick={() => setSelectedStatus('Overdue')}
        />
      </div>

      {/* Filter Bar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Assigned Grievances</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {filteredComplaints.length} tickets
            </span>
          </h2>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Click <span className="font-semibold text-blue-600">Status</span> on any ticket to add technical notes or resolve
          </span>
        </div>

        <ComplaintFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalCount={filteredComplaints.length}
          onResetFilters={() => {
            setSearchQuery('');
            setSelectedStatus('All');
            setSelectedCategory('All');
            setSelectedPriority('All');
            setSortBy('priority');
          }}
        />

        {/* Complaints Table with Staff Action */}
        <ComplaintTable
          complaints={filteredComplaints}
          showReporter={true}
          showDepartment={false}
          onStatusClick={(c) => setActiveComplaintForStatus(c)}
          emptyMessage="No complaints assigned to this department match the filters."
        />
      </div>

      {/* Role-Aware Notice */}
      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Role-Aware Authorization Note:</span> Staff can only modify complaints within their assigned department scope. In this frontend demo, the user context reflects the IT Support desk. The backend Node/Express server validates JWT department claims on every PATCH request.
        </div>
      </div>

      {/* Update Status Modal */}
      {activeComplaintForStatus && (
        <UpdateStatusModal
          isOpen={!!activeComplaintForStatus}
          onClose={() => setActiveComplaintForStatus(null)}
          complaint={activeComplaintForStatus}
        />
      )}
    </div>
  );
};

export default StaffDashboard;
