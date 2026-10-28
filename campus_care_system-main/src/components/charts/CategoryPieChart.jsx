import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = [
  '#2563EB', // Blue - Infra
  '#0D9488', // Teal - IT
  '#10B981', // Emerald - Cleanliness
  '#F59E0B', // Amber - Electrical
  '#6366F1', // Indigo - Water
  '#8B5CF6', // Purple - Transport
  '#94A3B8', // Slate - Other
];

export const CategoryPieChart = ({ data = [] }) => {
  const filtered = data.filter((d) => d.count > 0);

  if (!filtered || filtered.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        No complaints reported across categories yet.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl border border-slate-700 text-xs">
          <p className="font-semibold text-slate-200">{item.name}</p>
          <p className="text-slate-300 mt-0.5">
            <span className="font-bold text-white">{item.value}</span> complaints ({item.payload.percentage || 0}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filtered}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={4}
            dataKey="count"
          >
            {filtered.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;
