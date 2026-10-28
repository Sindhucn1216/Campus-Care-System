import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';
import ComplaintFilterBar from '../../components/complaints/ComplaintFilterBar';
import ComplaintTable from '../../components/complaints/ComplaintTable';
import FeedbackModal from '../../components/complaints/FeedbackModal';
import { PlusCircle, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

export const MyComplaintsPage = () => {
  const { complaints, submitComplaintFeedback } = useComplaints();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [feedbackComplaint, setFeedbackComplaint] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter complaints for current student / faculty user
  const userComplaints = useMemo(() => {
    return complaints.filter((c) => c.reporterId === currentUser?.id || currentUser?.role === 'student');
  }, [complaints, currentUser]);

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

  // Paginated records
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage) || 1;
  const paginatedComplaints = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredComplaints.slice(start, start + itemsPerPage);
  }, [filteredComplaints, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('All');
    setSelectedCategory('All');
    setSelectedPriority('All');
    setSortBy('newest');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Account Grievance Archive
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-campus-900 mt-2">
            My Submitted Complaints
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search, filter, and review the complete resolution status of all tickets filed by you.
          </p>
        </div>

        <button
          onClick={() => navigate('/complaints/new')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Grievance</span>
        </button>
      </div>

      <ComplaintFilterBar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        selectedStatus={selectedStatus}
        onStatusChange={(s) => {
          setSelectedStatus(s);
          setCurrentPage(1);
        }}
        selectedCategory={selectedCategory}
        onCategoryChange={(c) => {
          setSelectedCategory(c);
          setCurrentPage(1);
        }}
        selectedPriority={selectedPriority}
        onPriorityChange={(p) => {
          setSelectedPriority(p);
          setCurrentPage(1);
        }}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalCount={filteredComplaints.length}
        onResetFilters={handleResetFilters}
      />

      <ComplaintTable
        complaints={paginatedComplaints}
        showReporter={false}
        showDepartment={true}
        onFeedbackClick={(c) => setFeedbackComplaint(c)}
        emptyMessage="No complaints match your criteria."
        emptyAction={{
          label: 'File a Complaint',
          onClick: () => navigate('/complaints/new'),
        }}
      />

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200 text-xs text-slate-600">
          <p>
            Showing <span className="font-semibold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-semibold text-slate-900">
              {Math.min(currentPage * itemsPerPage, filteredComplaints.length)}
            </span>{' '}
            of <span className="font-semibold text-slate-900">{filteredComplaints.length}</span> complaints
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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

export default MyComplaintsPage;
