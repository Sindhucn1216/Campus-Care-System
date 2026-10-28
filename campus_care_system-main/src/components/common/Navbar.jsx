import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../constants';
import {
  ShieldCheck,
  PlusCircle,
  Search,
  LayoutDashboard,
  Building2,
  LogOut,
  User,
  Menu,
  X,
  FileText,
  ChevronDown,
} from 'lucide-react';

export const Navbar = () => {
  const { currentUser, role, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  // Determine dashboard link based on active role
  const getDashboardPath = () => {
    if (role === USER_ROLES.ADMIN) return '/admin/dashboard';
    if (role === USER_ROLES.STAFF) return '/staff/dashboard';
    return '/dashboard';
  };

  const getDashboardLabel = () => {
    if (role === USER_ROLES.ADMIN) return 'Admin Console';
    if (role === USER_ROLES.STAFF) return 'Staff Queue';
    return 'Dashboard';
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-campus-900 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-campus-900 group-hover:text-blue-600 transition-colors">
                Campus<span className="text-blue-600">Care</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-widest font-semibold text-slate-600 -mt-1">
                Grievance Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'text-blue-600 bg-blue-50/80 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            <Link
              to="/track"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/track') ? 'text-blue-600 bg-blue-50/80 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4 text-slate-600" />
              Track Grievance
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to={getDashboardPath()}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    location.pathname.includes('/dashboard') || location.pathname.includes('/admin')
                      ? 'text-blue-600 bg-blue-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-600" />
                  {getDashboardLabel()}
                </Link>

                {role === USER_ROLES.ADMIN && (
                  <>
                    <Link
                      to="/admin/complaints"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/admin/complaints') ? 'text-blue-600 bg-blue-50/80 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      All Tickets
                    </Link>
                    <Link
                      to="/admin/departments"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                        isActive('/admin/departments') ? 'text-blue-600 bg-blue-50/80 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-slate-600" />
                      Departments
                    </Link>
                  </>
                )}

                {(role === USER_ROLES.STUDENT || role === USER_ROLES.FACULTY) && (
                  <Link
                    to="/complaints"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isActive('/complaints') ? 'text-blue-600 bg-blue-50/80 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-slate-600" />
                    My Grievances
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/complaints/new"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm hover:shadow-blue-500/25 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report an Issue</span>
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left"
                  aria-expanded={profileDropdownOpen}
                >
                  <img
                    src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                    alt={currentUser?.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <div className="hidden lg:block">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">{currentUser?.name}</p>
                    <p className="text-[11px] text-slate-600 capitalize">{role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
                </button>

                {/* Profile dropdown menu */}
                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900">{currentUser?.name}</p>
                      <p className="text-[11px] text-slate-600 truncate">{currentUser?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {role} Mode
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-600" />
                      Profile & System Info
                    </Link>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors border-t border-slate-100"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/complaints/new"
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              title="Report Issue"
            >
              <PlusCircle className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-4 duration-200">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            to="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Track Grievance
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                {getDashboardLabel()}
              </Link>
              {(role === USER_ROLES.STUDENT || role === USER_ROLES.FACULTY) && (
                <Link
                  to="/complaints"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
                >
                  My Grievances
                </Link>
              )}
              {role === USER_ROLES.ADMIN && (
                <>
                  <Link
                    to="/admin/complaints"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
                  >
                    All Complaints Table
                  </Link>
                  <Link
                    to="/admin/departments"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Manage Departments
                  </Link>
                </>
              )}
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                Profile & Settings
              </Link>
            </>
          )}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/complaints/new"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 px-4 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Report an Issue
            </Link>
            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-800"
                >
                  Register
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                  navigate('/');
                }}
                className="w-full py-2 text-center text-sm font-medium text-rose-600 bg-rose-50 rounded-lg"
              >
                Sign Out ({currentUser?.name})
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
