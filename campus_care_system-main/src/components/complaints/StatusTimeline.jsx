import React from 'react';
import { formatDate } from '../../utils/formatters';
import {
  CheckCircle2,
  Clock,
  Send,
  XCircle,
  AlertTriangle,
  User,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

export const StatusTimeline = ({ complaint }) => {
  if (!complaint) return null;

  const { status, updates = [], createdAt, resolvedAt, resolutionNotes } = complaint;

  // Step Progress Calculation
  const isRejected = status === 'Rejected';
  const isResolved = status === 'Resolved';
  const isInProgress = status === 'In Progress' || isResolved;
  const isOverdue = status === 'Overdue' || complaint.isOverdue;

  const steps = [
    {
      id: 'submitted',
      label: 'Submitted',
      completed: true,
      current: status === 'Submitted',
      date: createdAt,
    },
    {
      id: 'in-progress',
      label: 'In Progress',
      completed: isInProgress || isResolved,
      current: status === 'In Progress' || isOverdue,
      date: updates.find((u) => u.newStatus === 'In Progress')?.createdAt,
    },
    {
      id: 'resolved',
      label: isRejected ? 'Rejected' : 'Resolved',
      completed: isResolved || isRejected,
      current: isResolved || isRejected,
      date: resolvedAt || updates.find((u) => u.newStatus === 'Resolved' || u.newStatus === 'Rejected')?.createdAt,
      error: isRejected,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 3-Step Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-6">
          Resolution Workflow Stage
        </h4>

        <div className="relative">
          {/* Connector Line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0">
            <div
              className={`h-full transition-all duration-500 ${
                isRejected ? 'bg-rose-500' : 'bg-blue-600'
              }`}
              style={{
                width: isResolved || isRejected ? '100%' : isInProgress ? '50%' : '0%',
              }}
            />
          </div>

          {/* Steps */}
          <div className="relative z-10 flex justify-between">
            {steps.map((step, idx) => {
              let circleBg = 'bg-white border-2 border-slate-300 text-slate-400';
              if (step.error) {
                circleBg = 'bg-rose-600 border-2 border-rose-600 text-white shadow-md shadow-rose-500/20';
              } else if (step.completed) {
                circleBg = 'bg-blue-600 border-2 border-blue-600 text-white shadow-md shadow-blue-500/20';
              } else if (step.current) {
                circleBg = 'bg-amber-500 border-2 border-amber-500 text-white animate-pulse shadow-md';
              }

              return (
                <div key={step.id} className="flex flex-col items-center text-center max-w-[100px]">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${circleBg}`}
                  >
                    {step.error ? (
                      <XCircle className="w-4 h-4" />
                    ) : step.completed ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-bold">{idx + 1}</span>
                    )}
                  </div>
                  <span className="mt-2 text-xs font-semibold text-slate-800">{step.label}</span>
                  {step.date && (
                    <span className="text-[10px] text-slate-400 mt-0.5">{formatDate(step.date)}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Chronological History Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          Audit & Progress Timeline ({updates.length + 1} events)
        </h4>

        <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
          {/* First Submission Event */}
          <div className="relative">
            <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm" />
            <div className="text-xs text-slate-400">{formatDate(createdAt)}</div>
            <p className="text-sm font-semibold text-slate-900 mt-0.5">Complaint Submitted by Reporter</p>
            <p className="text-xs text-slate-600 mt-1">
              Registered by <span className="font-medium text-slate-800">{complaint.reporterName}</span> ({complaint.reporterRole}). Initial triage priority set to {complaint.priority}.
            </p>
          </div>

          {/* Subsequent Staff & Admin updates */}
          {updates.map((upd) => (
            <div key={upd.id} className="relative">
              <div
                className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm ${
                  upd.newStatus === 'Resolved'
                    ? 'bg-emerald-600'
                    : upd.newStatus === 'Rejected'
                    ? 'bg-rose-600'
                    : 'bg-amber-500'
                }`}
              />
              <div className="text-xs text-slate-400">{formatDate(upd.createdAt)}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-sm font-semibold text-slate-900">
                  {upd.oldStatus !== upd.newStatus ? `Status updated to ${upd.newStatus}` : 'Staff Progress Note'}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-700">{upd.updatedByName || 'Authorized Staff'}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{upd.note}</p>
              </div>
            </div>
          ))}

          {/* Resolution Card if marked resolved */}
          {isResolved && resolutionNotes && (
            <div className="relative">
              <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-600 border-4 border-white shadow-sm" />
              <div className="text-xs text-slate-400">{formatDate(resolvedAt)}</div>
              <p className="text-sm font-semibold text-emerald-800 mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Final Resolution Details
              </p>
              <div className="mt-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed font-medium">
                {resolutionNotes}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusTimeline;
