import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import ComplaintTrendsChart from '../../components/charts/ComplaintTrendsChart';
import CategoryPieChart from '../../components/charts/CategoryPieChart';
import DepartmentBarChart from '../../components/charts/DepartmentBarChart';
import ComplaintFilterBar from '../../components/complaints/ComplaintFilterBar';
import ComplaintTable from '../../components/complaints/ComplaintTable';
import AssignDepartmentModal from '../../components/complaints/AssignDepartmentModal';
import UpdateStatusModal from '../../components/complaints/UpdateStatusModal';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate, getRelativeTime } from '../../utils/formatters';
import {
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  Building2,
  Sparkles,
  ArrowRight,
  Flame,
  Activity,
  Layers,
  ArrowUpRight,
  Download,
} from 'lucide-react';

export const AdminDashboard = () => {
  const { complaints, departments, analytics } = useComplaints();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Management Table Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [sortBy, setSortBy] = useState('priority');

  // Modals
  const [assignModalComplaint, setAssignModalComplaint] = useState(null);
  const [statusModalComplaint, setStatusModalComplaint] = useState(null);

  // Derive metrics strictly from dataset
  const total = complaints.length;
  const submitted = complaints.filter((c) => c.status === 'Submitted').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;
  const overdue = complaints.filter((c) => c.isOverdue || c.status === 'Overdue').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const avgHours = analytics?.avgResolutionHours || 28.5;

  // Filtered complaints for quick triage table
  const filteredComplaints = useMemo(() => {
    let list = [...complaints];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.complaintCode.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          (c.reporterName && c.reporterName.toLowerCase().includes(q))
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
  }, [complaints, searchQuery, selectedStatus, selectedCategory, selectedPriority, sortBy]);

  // Export report as JSON/CSV simulation
  const handleExportReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Complaint Code,Title,Category,Location,Priority,Status,Reporter,Department,Created At\n' +
      complaints
        .map(
          (c) =>
            `"${c.complaintCode}","${c.title.replace(/"/g, '""')}","${c.categoryName}","${c.location}","${c.priority}","${c.status}","${c.reporterName}","${c.departmentName || 'Unassigned'}","${c.createdAt}"`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CampusCare_Grievance_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Executive Command Banner */}
      <div className="bg-gradient-to-r from-campus-900 via-navy-950 to-campus-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-campus-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Administrative Command Center
            </span>
            <span className="text-xs text-slate-400 font-mono">Real-time Campus Metrics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Campus Operations & Grievance Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            University-wide visibility into building maintenance, SLA breaches, technician workloads, and student satisfaction ratings.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={handleExportReport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all shadow-sm"
            title="Download CSV Audit Report"
          >
            <Download className="w-4 h-4 text-teal-400" />
            <span>Export CSV</span>
          </button>

          <Link
            to="/admin/departments"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/25 transition-all"
          >
            <Building2 className="w-4 h-4" />
            <span>Manage Desks</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5 sm:gap-4">
        <StatCard
          title="Total Filed"
          value={total}
          subtitle="All complaints"
          icon={Layers}
          variant="blue"
          onClick={() => setSelectedStatus('All')}
        />
        <StatCard
          title="Submitted"
          value={submitted}
          subtitle="Pending triage"
          icon={Clock}
          variant="slate"
          onClick={() => setSelectedStatus('Submitted')}
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          subtitle="Active repairs"
          icon={Activity}
          variant="amber"
          onClick={() => setSelectedStatus('In Progress')}
        />
        <StatCard
          title="Resolved"
          value={resolved}
          subtitle="Closed tickets"
          icon={CheckCircle2}
          variant="emerald"
          onClick={() => setSelectedStatus('Resolved')}
        />
        <StatCard
          title="Overdue SLA"
          value={overdue}
          subtitle="Breached targets"
          icon={AlertTriangle}
          variant="red"
          onClick={() => setSelectedStatus('Overdue')}
        />
        <StatCard
          title="Resolution Rate"
          value={`${resolutionRate}%`}
          subtitle={`Avg ${avgHours}h closure`}
          icon={TrendingUp}
          variant="purple"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Complaint Trends Area Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Complaint Velocity & Resolution Trend</h3>
              <p className="text-xs text-slate-500">Volume of incoming vs resolved grievances over past 7 days</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              High Velocity
            </span>
          </div>
          <ComplaintTrendsChart data={analytics?.trends} />
        </div>

        {/* Category Breakdown Donut Chart */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Domain Distribution</h3>
              <p className="text-xs text-slate-500">Breakdown by issue category</p>
            </div>
          </div>
          <CategoryPieChart data={analytics?.categoryDistribution} />
        </div>

        {/* Department Workload Bar Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Department Workload & SLA Compliance</h3>
              <p className="text-xs text-slate-500">Active vs resolved cases assigned to each campus team</p>
            </div>
          </div>
          <DepartmentBarChart data={analytics?.departmentPerformance} />
        </div>

        {/* High Priority Emergency Queue */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-600 animate-pulse" />
                Urgent & High Priority
              </h3>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Action Required
              </span>
            </div>

            <div className="space-y-3">
              {analytics?.highPriorityComplaints?.length > 0 ? (
                analytics.highPriorityComplaints.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-400 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-blue-600">{c.complaintCode}</span>
                      <PriorityBadge priority={c.priority} size="xs" />
                    </div>
                    <p className="text-xs font-semibold text-slate-800 mt-1 line-clamp-1">{c.title}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                      <span>{c.departmentName || 'Needs Assignment'}</span>
                      <button
                        onClick={() => setAssignModalComplaint(c)}
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        Assign Desk
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">No urgent unresolved grievances.</p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>SLA Target: 48h resolution</span>
            <span className="text-emerald-600 font-semibold">92% Met</span>
          </div>
        </div>
      </div>

      {/* Comprehensive Grievance Management Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Master Campus Complaints Directory</h2>
            <p className="text-xs text-slate-500">
              Filter, route to departments, upgrade priorities, or close verified grievances.
            </p>
          </div>

          <Link
            to="/admin/complaints"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Open Dedicated Ticket Console</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
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

        <ComplaintTable
          complaints={filteredComplaints}
          showReporter={true}
          showDepartment={true}
          onAssignClick={(c) => setAssignModalComplaint(c)}
          onStatusClick={(c) => setStatusModalComplaint(c)}
          emptyMessage="No tickets match the administrative query."
        />
      </div>

      {/* Modals */}
      {assignModalComplaint && (
        <AssignDepartmentModal
          isOpen={!!assignModalComplaint}
          onClose={() => setAssignModalComplaint(null)}
          complaint={assignModalComplaint}
        />
      )}

      {statusModalComplaint && (
        <UpdateStatusModal
          isOpen={!!statusModalComplaint}
          onClose={() => setStatusModalComplaint(null)}
          complaint={statusModalComplaint}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
