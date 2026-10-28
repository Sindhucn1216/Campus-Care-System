import React, { useState, useMemo } from 'react';
import { useComplaints } from '../../context/ComplaintContext';
import ComplaintFilterBar from '../../components/complaints/ComplaintFilterBar';
import ComplaintTable from '../../components/complaints/ComplaintTable';
import AssignDepartmentModal from '../../components/complaints/AssignDepartmentModal';
import UpdateStatusModal from '../../components/complaints/UpdateStatusModal';
import { Download, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

export const AdminComplaintsPage = () => {
  const { complaints } = useComplaints();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [assignModalComplaint, setAssignModalComplaint] = useState(null);
  const [statusModalComplaint, setStatusModalComplaint] = useState(null);

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
  }, [complaints, searchQuery, selectedStatus, selectedCategory, selectedPriority, sortBy]);

  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage) || 1;
  const paginatedComplaints = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredComplaints.slice(start, start + itemsPerPage);
  }, [filteredComplaints, currentPage]);

  const handleExportCSV = () => {
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
    link.setAttribute('download', `Master_Tickets_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Audit Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-campus-900 mt-2">
            Master Complaints Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            All tickets reported by students, faculty, and campus staff with instant administrative actions.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-campus-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-teal-400" />
          <span>Export All Data (CSV)</span>
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
        onResetFilters={() => {
          setSearchQuery('');
          setSelectedStatus('All');
          setSelectedCategory('All');
          setSelectedPriority('All');
          setSortBy('newest');
          setCurrentPage(1);
        }}
      />

      <ComplaintTable
        complaints={paginatedComplaints}
        showReporter={true}
        showDepartment={true}
        onAssignClick={(c) => setAssignModalComplaint(c)}
        onStatusClick={(c) => setStatusModalComplaint(c)}
        emptyMessage="No tickets match your administrative filter."
      />

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200 text-xs text-slate-600">
          <p>
            Showing <span className="font-semibold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-semibold text-slate-900">
              {Math.min(currentPage * itemsPerPage, filteredComplaints.length)}
            </span>{' '}
            of <span className="font-semibold text-slate-900">{filteredComplaints.length}</span> tickets
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

export default AdminComplaintsPage;
