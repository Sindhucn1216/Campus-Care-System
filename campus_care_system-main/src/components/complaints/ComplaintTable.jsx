import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';
import EmptyState from '../common/EmptyState';
import { formatDate, getRelativeTime } from '../../utils/formatters';
import { ChevronRight, MapPin, Building2, User, Eye, ArrowUpRight } from 'lucide-react';

export const ComplaintTable = ({
  complaints = [],
  showDepartment = true,
  showReporter = true,
  onAssignClick,
  onStatusClick,
  onFeedbackClick,
  emptyMessage,
  emptyAction,
}) => {
  if (!complaints || complaints.length === 0) {
    return (
      <EmptyState
        title={emptyMessage || 'No grievances found'}
        description="Try adjusting your filters or search keywords to locate specific tickets."
        actionLabel={emptyAction?.label}
        onAction={emptyAction?.onClick}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Desktop & Tablet Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4 sm:px-6">Complaint ID</th>
              <th className="py-3.5 px-4">Title & Location</th>
              <th className="py-3.5 px-4">Category</th>
              {showDepartment && <th className="py-3.5 px-4">Department</th>}
              {showReporter && <th className="py-3.5 px-4">Reporter</th>}
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {complaints.map((c) => (
              <tr
                key={c.id}
                className="hover:bg-blue-50/40 transition-colors group"
              >
                {/* ID */}
                <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                  <Link
                    to={`/complaints/${c.complaintCode}`}
                    className="font-mono text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                  >
                    {c.complaintCode}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </td>

                {/* Title & Location */}
                <td className="py-4 px-4 max-w-xs sm:max-w-md">
                  <Link
                    to={`/complaints/${c.complaintCode}`}
                    className="font-medium text-slate-900 group-hover:text-blue-700 line-clamp-1 transition-colors"
                  >
                    {c.title}
                  </Link>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{c.location}</span>
                    {c.specificLocation && (
                      <span className="text-slate-400 text-[11px]">({c.specificLocation})</span>
                    )}
                  </div>
                </td>

                {/* Category */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                    {c.categoryName}
                  </span>
                </td>

                {/* Department */}
                {showDepartment && (
                  <td className="py-4 px-4 whitespace-nowrap">
                    {c.departmentName ? (
                      <div className="flex items-center gap-1.5 text-xs text-slate-700">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.departmentName}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-amber-600 font-medium italic">Unassigned</span>
                    )}
                  </td>
                )}

                {/* Reporter */}
                {showReporter && (
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-xs text-slate-800 font-medium">{c.reporterName}</div>
                    <div className="text-[11px] text-slate-500 capitalize">{c.reporterRole}</div>
                  </td>
                )}

                {/* Priority */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <PriorityBadge priority={c.priority} size="xs" />
                </td>

                {/* Status */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <StatusBadge status={c.status} size="xs" />
                  {c.isOverdue && c.status !== 'Resolved' && (
                    <span className="ml-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                      SLA Exceeded
                    </span>
                  )}
                </td>

                {/* Date */}
                <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500">
                  <span title={formatDate(c.createdAt)}>{getRelativeTime(c.createdAt)}</span>
                </td>

                {/* Actions */}
                <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    {onStatusClick && (
                      <button
                        onClick={() => onStatusClick(c)}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg text-slate-700 hover:text-blue-600 hover:bg-slate-100 border border-slate-200"
                        title="Update status"
                      >
                        Status
                      </button>
                    )}

                    {onAssignClick && (
                      <button
                        onClick={() => onAssignClick(c)}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg text-slate-700 hover:text-blue-600 hover:bg-slate-100 border border-slate-200"
                        title="Assign Department"
                      >
                        Assign
                      </button>
                    )}

                    {onFeedbackClick && c.status === 'Resolved' && !c.feedback && (
                      <button
                        onClick={() => onFeedbackClick(c)}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
                      >
                        Rate
                      </button>
                    )}

                    <Link
                      to={`/complaints/${c.complaintCode}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      aria-label="View complaint details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden divide-y divide-slate-100">
        {complaints.map((c) => (
          <div key={c.id} className="p-4 space-y-3 hover:bg-slate-50 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <Link
                to={`/complaints/${c.complaintCode}`}
                className="font-mono text-xs font-bold text-blue-600 hover:underline"
              >
                {c.complaintCode}
              </Link>
              <div className="flex items-center gap-1.5">
                <PriorityBadge priority={c.priority} size="xs" />
                <StatusBadge status={c.status} size="xs" />
              </div>
            </div>

            <Link
              to={`/complaints/${c.complaintCode}`}
              className="block font-medium text-sm text-slate-900 hover:text-blue-600 leading-snug"
            >
              {c.title}
            </Link>

            <div className="flex flex-col gap-1 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{c.location}</span>
              </div>
              {c.departmentName && (
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{c.departmentName}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
              <span>{getRelativeTime(c.createdAt)}</span>
              <Link
                to={`/complaints/${c.complaintCode}`}
                className="font-medium text-blue-600 flex items-center gap-1 hover:underline"
              >
                Details
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplaintTable;
