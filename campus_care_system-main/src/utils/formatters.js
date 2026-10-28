// Utility formatters and helper functions

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatShortDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffHours = Math.round((now - date) / (1000 * 60 * 60));
  
  if (diffHours < 1) return 'Just now';
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
};

export const generateComplaintCode = (existingCount = 0) => {
  const currentYear = new Date().getFullYear();
  const sequence = String(existingCount + 1).padStart(3, '0');
  return `CMP-${currentYear}-${sequence}`;
};

export const getStatusBadgeStyles = (status) => {
  switch (status) {
    case 'Submitted':
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
      };
    case 'In Progress':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500 animate-pulse',
      };
    case 'Resolved':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
      };
    case 'Rejected':
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
      };
    case 'Overdue':
      return {
        bg: 'bg-red-50 text-red-700 border-red-200 font-semibold',
        dot: 'bg-red-500 animate-ping',
      };
    default:
      return {
        bg: 'bg-slate-50 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
      };
  }
};

export const getPriorityBadgeStyles = (priority) => {
  switch (priority) {
    case 'Urgent':
      return 'bg-red-100 text-red-800 border-red-200 font-semibold';
    case 'High':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Medium':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Low':
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};
