import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'blue', // 'blue' | 'emerald' | 'amber' | 'red' | 'purple' | 'slate'
  trend,
  onClick,
  badge,
}) => {
  const variantStyles = {
    blue: {
      border: 'border-blue-100 hover:border-blue-300',
      iconBg: 'bg-blue-50 text-blue-600',
      glow: 'group-hover:shadow-blue-500/5',
    },
    emerald: {
      border: 'border-emerald-100 hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-600',
      glow: 'group-hover:shadow-emerald-500/5',
    },
    amber: {
      border: 'border-amber-100 hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-600',
      glow: 'group-hover:shadow-amber-500/5',
    },
    red: {
      border: 'border-red-100 hover:border-red-300',
      iconBg: 'bg-red-50 text-red-600',
      glow: 'group-hover:shadow-red-500/5',
    },
    purple: {
      border: 'border-purple-100 hover:border-purple-300',
      iconBg: 'bg-purple-50 text-purple-600',
      glow: 'group-hover:shadow-purple-500/5',
    },
    slate: {
      border: 'border-slate-200 hover:border-slate-300',
      iconBg: 'bg-slate-100 text-slate-700',
      glow: 'group-hover:shadow-slate-500/5',
    },
  };

  const style = variantStyles[variant] || variantStyles.blue;

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:shadow-lg ${style.border} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{value}</span>
            {badge && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {badge}
              </span>
            )}
          </div>
          {(subtitle || trend) && (
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
              {trend && (
                <span className={`font-medium ${trend.isPositive ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {trend.text}
                </span>
              )}
              {subtitle && <span>{subtitle}</span>}
            </div>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl ${style.iconBg} transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
