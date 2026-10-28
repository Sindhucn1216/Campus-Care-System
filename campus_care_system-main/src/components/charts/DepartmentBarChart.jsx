import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export const DepartmentBarChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        No department workload metrics available.
      </div>
    );
  }

  // Format department labels nicely for mobile/desktop
  const chartData = data.map((d) => ({
    ...d,
    shortName: d.code || d.name.slice(0, 10),
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const current = chartData.find((c) => c.shortName === label);
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1">
          <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">
            {current?.name || label}
          </p>
          <p className="text-blue-300">Active Queue: {current?.active || 0}</p>
          <p className="text-emerald-300">Resolved: {current?.resolved || 0}</p>
          {current?.overdue > 0 && <p className="text-red-400">Overdue SLA: {current?.overdue}</p>}
          <p className="text-slate-400 pt-1 text-[11px]">Resolution Rate: {current?.rate || 0}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis dataKey="shortName" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }} />
          <Bar name="Active Complaints" dataKey="active" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          <Bar name="Resolved Issues" dataKey="resolved" fill="#10B981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentBarChart;
