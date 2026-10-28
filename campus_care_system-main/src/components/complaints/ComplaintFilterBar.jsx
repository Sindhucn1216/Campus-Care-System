import React from 'react';
import { COMPLAINT_CATEGORIES, COMPLAINT_STATUSES, COMPLAINT_PRIORITIES } from '../../constants';
import { Search, Filter, X, ArrowUpDown } from 'lucide-react';

export const ComplaintFilterBar = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  selectedPriority,
  onPriorityChange,
  sortBy,
  onSortChange,
  totalCount,
  onResetFilters,
}) => {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedStatus !== 'All' ||
    selectedCategory !== 'All' ||
    selectedPriority !== 'All';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3.5">
      {/* Top Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by ID (e.g. CMP-2026-001), title, or location..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-slate-50 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Priority (High to Low)</option>
              <option value="status">Status</option>
            </select>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {totalCount} {totalCount === 1 ? 'record' : 'records'}
          </span>
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mr-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className={`text-xs rounded-xl border px-3 py-1.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
            selectedStatus !== 'All'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
          }`}
        >
          <option value="All">All Statuses</option>
          {Object.values(COMPLAINT_STATUSES).map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className={`text-xs rounded-xl border px-3 py-1.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
            selectedCategory !== 'All'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
          }`}
        >
          <option value="All">All Categories</option>
          {COMPLAINT_CATEGORIES.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className={`text-xs rounded-xl border px-3 py-1.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
            selectedPriority !== 'All'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
          }`}
        >
          <option value="All">All Priorities</option>
          {Object.values(COMPLAINT_PRIORITIES).map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {/* Reset Filters button */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors flex items-center gap-1 ml-auto"
          >
            <X className="w-3.5 h-3.5" />
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default ComplaintFilterBar;
