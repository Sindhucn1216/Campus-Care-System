import React from 'react';
import { getPriorityBadgeStyles } from '../../utils/formatters';
import { Flame, AlertTriangle, Clock, ArrowDown } from 'lucide-react';

export const PriorityBadge = ({ priority, size = 'sm', showIcon = true }) => {
  const badgeClasses = getPriorityBadgeStyles(priority);

  const sizeClasses = size === 'xs'
    ? 'text-[11px] px-2 py-0.5'
    : size === 'md'
    ? 'text-sm px-3 py-1'
    : 'text-xs px-2.5 py-0.5';

  const renderIcon = () => {
    if (!showIcon) return null;
    const iconSize = size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5';
    switch (priority) {
      case 'Urgent':
        return <Flame className={`${iconSize} text-red-600 animate-pulse`} />;
      case 'High':
        return <AlertTriangle className={`${iconSize} text-orange-600`} />;
      case 'Medium':
        return <Clock className={`${iconSize} text-amber-600`} />;
      case 'Low':
      default:
        return <ArrowDown className={`${iconSize} text-slate-500`} />;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-sm ${badgeClasses} ${sizeClasses}`}
    >
      {renderIcon()}
      {priority || 'Medium'}
    </span>
  );
};

export default PriorityBadge;
