import React from 'react';
import { getStatusBadgeStyles } from '../../utils/formatters';

export const StatusBadge = ({ status, size = 'sm' }) => {
  const styles = getStatusBadgeStyles(status);
  
  const sizeClasses = size === 'xs'
    ? 'text-[11px] px-2 py-0.5'
    : size === 'md'
    ? 'text-sm px-3 py-1'
    : 'text-xs px-2.5 py-0.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-sm ${styles.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} aria-hidden="true" />
      {status || 'Unknown'}
    </span>
  );
};

export default StatusBadge;
