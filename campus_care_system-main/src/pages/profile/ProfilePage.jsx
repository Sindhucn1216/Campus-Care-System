import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { USER_ROLES } from '../../constants';
import {
  User,
  Mail,
  Shield,
  Bell,
  RotateCcw,
  CheckCircle2,
  Database,
  Server,
  Layers,
  Sparkles,
} from 'lucide-react';

export const ProfilePage = () => {
  const { currentUser, role, switchRole, updateProfile } = useAuth();
  const { resetDemo } = useComplaints();

  const [name, setName] = useState(currentUser?.name || '');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySMS, setNotifySMS] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({ name });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          User Settings
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-campus-900 mt-2">
          Profile & System Information
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review your active persona, configure alert preferences, or review backend integration hooks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: User Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5 text-center">
          <div className="relative mx-auto w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100 shadow-md">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
              alt={currentUser?.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">{currentUser?.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{currentUser?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {role} Role
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100 text-left space-y-2 text-xs text-slate-600">
            {currentUser?.department && (
              <div className="flex justify-between">
                <span className="text-slate-400">Department:</span>
                <span className="font-semibold text-slate-800">{currentUser.department}</span>
              </div>
            )}
            {currentUser?.rollNo && (
              <div className="flex justify-between">
                <span className="text-slate-400">Roll No:</span>
                <span className="font-mono font-semibold text-slate-800">{currentUser.rollNo}</span>
              </div>
            )}
            {currentUser?.designation && (
              <div className="flex justify-between">
                <span className="text-slate-400">Designation:</span>
                <span className="font-semibold text-slate-800">{currentUser.designation}</span>
              </div>
            )}
          </div>

          {/* Quick Persona Switcher */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Demo Persona Switcher
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => switchRole(USER_ROLES.STUDENT)}
                className={`py-1.5 rounded-lg border transition-colors ${
                  role === USER_ROLES.STUDENT
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => switchRole(USER_ROLES.FACULTY)}
                className={`py-1.5 rounded-lg border transition-colors ${
                  role === USER_ROLES.FACULTY
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Faculty
              </button>
              <button
                type="button"
                onClick={() => switchRole(USER_ROLES.STAFF)}
                className={`py-1.5 rounded-lg border transition-colors ${
                  role === USER_ROLES.STAFF
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                IT Staff
              </button>
              <button
                type="button"
                onClick={() => switchRole(USER_ROLES.ADMIN)}
                className={`py-1.5 rounded-lg border transition-colors ${
                  role === USER_ROLES.ADMIN
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Preferences & Architecture Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Edit Profile Form */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Personal Details</h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Notification Dispatch Toggles (Simulated)
                </label>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700">Email alerts for technician updates & resolution notices</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifySMS}
                      onChange={(e) => setNotifySMS(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700">SMS emergency notifications for campus-wide infrastructure</span>
                  </label>
                </div>
              </div>

              {savedNotice && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Preferences saved to local demo session!</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  Labeled as demo-only until backend database sync.
                </span>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* System & Architecture Integration Specs */}
          <div className="bg-slate-900 text-slate-200 rounded-3xl border border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold text-white">Backend Integration Architecture</h3>
              </div>
              <span className="text-[10px] font-mono bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/30">
                Ready for Node.js + MySQL
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              CampusCare uses a centralized API service layer (<span className="text-slate-200 font-mono">src/services/api/apiClient.js</span>). Switching from local mock mode to a real Express/MySQL backend is achieved by setting <span className="text-teal-300 font-mono">VITE_USE_MOCK_DATA=false</span> in <span className="text-slate-200 font-mono">.env</span>.
            </p>

            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-400">Reset all complaints to default seed data:</span>
              <button
                onClick={resetDemo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Records</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
