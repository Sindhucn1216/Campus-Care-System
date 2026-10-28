import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import { COMPLAINT_CATEGORIES } from '../../constants';
import {
  ShieldCheck,
  Search,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Camera,
  Layers,
  BarChart3,
  Users,
  Building2,
  Zap,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

export const LandingPage = () => {
  const { analytics, complaints } = useComplaints();
  const [trackingCode, setTrackingCode] = useState('');
  const navigate = useNavigate();

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackingCode.trim()) {
      navigate(`/track?id=${encodeURIComponent(trackingCode.trim())}`);
    }
  };

  const totalComplaints = analytics?.total || complaints.length || 8;
  const resolutionRate = analytics?.resolutionRate || 82;
  const avgHours = analytics?.avgResolutionHours || 28.5;

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-12 lg:pb-20 bg-gradient-to-b from-blue-50/50 via-white to-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span>Next-Gen Smart Campus Infrastructure</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-campus-900 tracking-tight leading-[1.15]">
                Transparent, Fast & Reliable <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
                  Campus Grievance
                </span>{' '}
                Resolution
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                A centralized digital platform connecting students, faculty, and administrative departments. Submit issues with photos, track real-time technician progress, and hold campus facilities accountable.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/complaints/new"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-semibold text-sm transition-all shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
                >
                  <span>Report an Issue</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/track"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 font-semibold text-sm transition-all shadow-sm hover:border-slate-300"
                >
                  <Search className="w-4 h-4 text-slate-500" />
                  <span>Track Complaint</span>
                </Link>
              </div>

              {/* Quick Tracking Search Bar */}
              <div className="pt-4 max-w-md mx-auto lg:mx-0">
                <form
                  onSubmit={handleTrackSubmit}
                  className="flex items-center p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500"
                >
                  <input
                    type="text"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    placeholder="Enter Tracking ID (e.g. CMP-2026-001)..."
                    className="flex-1 px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-campus-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    Track
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
                <p className="text-[11px] text-slate-400 mt-1.5 pl-2">
                  Try demo tickets: <span className="font-mono font-medium text-slate-600">CMP-2026-001</span> or{' '}
                  <span className="font-mono font-medium text-slate-600">CMP-2026-002</span>
                </p>
              </div>
            </div>

            {/* Right Product Mockup Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl bg-campus-900 p-3 sm:p-5 shadow-2xl shadow-campus-900/40 border border-campus-800 text-white">
                {/* Mockup Header */}
                <div className="flex items-center justify-between pb-4 border-b border-campus-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-xs text-slate-400 font-mono ml-2">campuscare.live/dashboard</span>
                  </div>
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 font-mono px-2 py-0.5 rounded-full border border-teal-500/30">
                    Live Dispatch
                  </span>
                </div>

                {/* Mockup Metrics */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-campus-800/80 p-3 rounded-xl border border-campus-700/60">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Active Complaints</p>
                    <p className="text-xl font-bold text-white mt-1">14 Pending</p>
                    <span className="text-[10px] text-emerald-400 font-medium">92% on SLA target</span>
                  </div>
                  <div className="bg-campus-800/80 p-3 rounded-xl border border-campus-700/60">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Average Speed</p>
                    <p className="text-xl font-bold text-teal-300 mt-1">{avgHours}h</p>
                    <span className="text-[10px] text-slate-400">Under 48h benchmark</span>
                  </div>
                </div>

                {/* Simulated Recent Grievances List */}
                <div className="mt-4 space-y-2.5">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Recent Verified Tickets
                  </p>

                  <div className="p-3 rounded-xl bg-campus-800/90 border border-campus-700/80 flex items-center justify-between">
                    <div className="space-y-0.5 max-w-[200px]">
                      <span className="font-mono text-[10px] text-blue-400 font-bold">CMP-2026-001</span>
                      <p className="text-xs font-medium text-slate-200 truncate">Turing Lab Wi-Fi Down</p>
                      <p className="text-[10px] text-slate-400">IT Support • Floor 3</p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      In Progress
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-campus-800/90 border border-campus-700/80 flex items-center justify-between">
                    <div className="space-y-0.5 max-w-[200px]">
                      <span className="font-mono text-[10px] text-emerald-400 font-bold">CMP-2026-002</span>
                      <p className="text-xs font-medium text-slate-200 truncate">AC Water Leak Podium</p>
                      <p className="text-[10px] text-slate-400">Electrical • Hall 204</p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Resolved (5★)
                    </span>
                  </div>
                </div>

                {/* Floating Notification Badge */}
                <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white text-slate-900 p-3 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Auto Department Routing</p>
                    <p className="text-[10px] text-slate-500">Zero manual delays</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time KPI Stats Ribbon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            <div className="pt-3 sm:pt-0 sm:px-4 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Grievances</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">{totalComplaints}</p>
              <p className="text-xs text-slate-500 mt-0.5">Recorded across campus</p>
            </div>

            <div className="pt-3 sm:pt-0 sm:px-4 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Resolution Rate</p>
              <p className="text-3xl font-extrabold text-emerald-600 mt-1">{resolutionRate}%</p>
              <p className="text-xs text-slate-500 mt-0.5">Closed with satisfaction</p>
            </div>

            <div className="pt-3 sm:pt-0 sm:px-4 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg Turnaround</p>
              <p className="text-3xl font-extrabold text-blue-600 mt-1">{avgHours}h</p>
              <p className="text-xs text-slate-500 mt-0.5">From triage to closure</p>
            </div>

            <div className="pt-3 sm:pt-0 sm:px-4 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Campus Desks</p>
              <p className="text-3xl font-extrabold text-purple-600 mt-1">6 Active</p>
              <p className="text-xs text-slate-500 mt-0.5">Cross-department SLA</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Streamlined Resolution Lifecycle
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-campus-900">
            How CampusCare Resolves Issues
          </h2>
          <p className="text-sm text-slate-600">
            From the moment an issue is photographed to final student verification, every step is transparent and tracked.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative">
            <span className="absolute top-5 right-5 text-2xl font-black text-slate-100 font-mono">01</span>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">1. Snap & Report</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Describe the problem, tag your building and classroom, attach photo evidence, and hit submit in under 60 seconds.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative">
            <span className="absolute top-5 right-5 text-2xl font-black text-slate-100 font-mono">02</span>
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">2. Auto-Triage & Assign</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              System generates a unique ticket ID and automatically routes it to IT, Electrical, Civil, or Sanitation leads.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative">
            <span className="absolute top-5 right-5 text-2xl font-black text-slate-100 font-mono">03</span>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">3. Live Status Updates</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Watch step-by-step progress notes from technicians. Transparent timeline keeps students and professors informed.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative">
            <span className="absolute top-5 right-5 text-2xl font-black text-slate-100 font-mono">04</span>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">4. Verified Closure</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Staff logs fix details and closes the grievance. The reporter rates the service quality from 1 to 5 stars.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600">Categories</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-campus-900 mt-1">
              Supported Complaint Domains
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select any domain to instantly launch a pre-categorized complaint.
            </p>
          </div>
          <Link
            to="/complaints/new"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            <span>View All Forms</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {COMPLAINT_CATEGORIES.map((cat) => {
            const count = complaints.filter((c) => c.categoryId === cat.id || c.categoryName.toLowerCase() === cat.name.toLowerCase()).length;
            return (
              <Link
                key={cat.id}
                to={`/complaints/new?category=${encodeURIComponent(cat.name)}`}
                className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 font-mono">Desk #{cat.id.replace('cat-', '0')}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                      {count} active tickets
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-3 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>File grievance</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Value Proposition Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-campus-900 via-navy-900 to-campus-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold">
              Zero Bureaucracy • 100% Accountability
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Report a Campus Issue?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Help make our university cleaner, safer, and technologically seamless. Your reports go directly to maintenance engineers and department deans.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/complaints/new"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/30"
              >
                Submit Grievance Now
              </Link>
              <Link
                to="/track"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
              >
                Track Existing Ticket
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
