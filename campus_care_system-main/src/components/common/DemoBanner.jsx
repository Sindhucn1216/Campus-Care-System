import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { USER_ROLES } from '../../constants';
import { Sparkles, RotateCcw, ShieldAlert, ChevronDown, ChevronUp, UserCheck } from 'lucide-react';

export const DemoBanner = () => {
  const { currentUser, switchRole } = useAuth();
  const { resetDemo } = useComplaints();
  const [collapsed, setCollapsed] = useState(false);

  const rolePills = [
    { role: USER_ROLES.STUDENT, label: 'Student', sub: 'Aarav (CS)' },
    { role: USER_ROLES.FACULTY, label: 'Faculty', sub: 'Dr. Meera (ECE)' },
    { role: USER_ROLES.STAFF, label: 'Staff', sub: 'Venkatesh (IT Dept)' },
    { role: USER_ROLES.ADMIN, label: 'Administrator', sub: 'Dean Dr. Harish' },
  ];

  return (
    <aside aria-label="Demo notice banner" className="bg-campus-900 text-slate-200 border-b border-campus-800 text-xs py-2 px-4 shadow-sm relative z-40 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            Hackathon Live Evaluation Mode:
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Interactive frontend with client state persistence. Real backend integration ready.
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Quick Role Switcher Pills */}
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60">
            <span className="px-2 text-[11px] font-medium text-slate-400 hidden lg:inline">
              Switch Persona:
            </span>
            {rolePills.map((pill) => {
              const isActive = currentUser?.role === pill.role;
              return (
                <button
                  key={pill.role}
                  onClick={() => switchRole(pill.role)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                  title={`Switch to demo role: ${pill.label}`}
                >
                  {isActive && <UserCheck className="w-3 h-3 text-teal-300" />}
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={resetDemo}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-700/60 transition-colors"
            title="Reset database to seed records"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span className="hidden sm:inline">Reset Data</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default DemoBanner;
