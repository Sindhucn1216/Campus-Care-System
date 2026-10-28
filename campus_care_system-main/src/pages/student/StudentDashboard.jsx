import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import ComplaintFilterBar from '../../components/complaints/ComplaintFilterBar';
import ComplaintTable from '../../components/complaints/ComplaintTable';
import FeedbackModal from '../../components/complaints/FeedbackModal';
import {
  PlusCircle,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  BarChart2,
} from 'lucide-react';

export const StudentDashboard = () => {
  const { complaints, submitComplaintFeedback } = useComplaints();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [feedbackComplaint, setFeedbackComplaint] = useState(null);

  // Filter complaints filed by or relevant to current user
  const userComplaints = useMemo(() => {
    return complaints.filter((c) => c.reporterId === currentUser?.id || currentUser?.role === 'student');
  }, [complaints, currentUser]);

  // Derived Counts from the actual dataset (STRICTLY NON-HARDCODED)
  const totalCount = userComplaints.length;
  const submittedCount = userComplaints.filter((c) => c.status === 'Submitted').length;
  const inProgressCount = userComplaints.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = userComplaints.filter((c) => c.status === 'Resolved').length;
  const overdueCount = userComplaints.filter((c) => c.status === 'Overdue' || (c.isOverdue && c.status !== 'Resolved')).length;

  // Filtered & Sorted Display Records
  const filteredComplaints = useMemo(() => {
    let list = [...userComplaints];

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

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'priority') {
        const order = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
        return (order[b.priority] || 0) - (order[a.priority] || 0);
      }
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      return 0;
    });

    return list;
  }, [userComplaints, searchQuery, selectedStatus, selectedCategory, selectedPriority, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('All');
    setSelectedCategory('All');
    setSelectedPriority('All');
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-campus-900 to-navy-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Campus Member Portal
            </span>
            {currentUser?.rollNo && (
              <span className="text-xs font-mono text-slate-300">Roll: {currentUser.rollNo}</span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser?.name || 'Student'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Monitor active grievances, view maintenance progress in real-time, or file a new service request.
          </p>
        </div>

        <Link
          to="/complaints/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Submit Grievance</span>
        </Link>
      </div>

      {/* Summary KPI Cards Grid (Calculated from actual data) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-5">
        <StatCard
          title="Total Filed"
          value={totalCount}
          subtitle="All grievances"
          icon={FileText}
          variant="blue"
          onClick={() => setSelectedStatus('All')}
        />
        <StatCard
          title="Submitted"
          value={submittedCount}
          subtitle="Pending triage"
          icon={Clock}
          variant="slate"
          onClick={() => setSelectedStatus('Submitted')}
        />
        <StatCard
          title="In Progress"
          value={inProgressCount}
          subtitle="Technician dispatched"
          icon={Clock}
          variant="amber"
          onClick={() => setSelectedStatus('In Progress')}
        />
        <StatCard
          title="Resolved"
          value={resolvedCount}
          subtitle="Closed successfully"
          icon={CheckCircle2}
          variant="emerald"
          onClick={() => setSelectedStatus('Resolved')}
        />
        <StatCard
          title="Overdue"
          value={overdueCount}
          subtitle="SLA exceeded"
          icon={AlertTriangle}
          variant="red"
          onClick={() => setSelectedStatus('Overdue')}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Your Grievance History</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {filteredComplaints.length} shown
            </span>
          </h2>

          <Link
            to="/complaints"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Full History View</span>
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
          onResetFilters={handleResetFilters}
        />

        {/* Complaints Table */}
        <ComplaintTable
          complaints={filteredComplaints}
          showReporter={false}
          showDepartment={true}
          onFeedbackClick={(c) => setFeedbackComplaint(c)}
          emptyMessage="No grievances matching your filters."
          emptyAction={{
            label: 'Submit a Complaint',
            onClick: () => navigate('/complaints/new'),
          }}
        />
      </div>

      {/* Feedback Modal for rating resolved complaints */}
      {feedbackComplaint && (
        <FeedbackModal
          isOpen={!!feedbackComplaint}
          onClose={() => setFeedbackComplaint(null)}
          complaint={feedbackComplaint}
          onSubmitFeedback={submitComplaintFeedback}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
