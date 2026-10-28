import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DEMO_USERS, USER_ROLES } from '../../constants';
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  UserCheck,
  Sparkles,
} from 'lucide-react';

export const LoginPage = () => {
  const { login, loginAsDemo, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(USER_ROLES.STUDENT);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid campus email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const user = await login(email, password, selectedRole);
      redirectToDashboard(user.role);
    } catch (err) {
      setErrors({ form: err.message || 'Login failed.' });
    }
  };

  const handleQuickDemoLogin = async (role) => {
    try {
      const user = await loginAsDemo(role);
      redirectToDashboard(user.role);
    } catch (err) {
      setErrors({ form: err.message || 'Demo login failed.' });
    }
  };

  const redirectToDashboard = (role) => {
    if (role === USER_ROLES.ADMIN) navigate('/admin/dashboard');
    else if (role === USER_ROLES.STAFF) navigate('/staff/dashboard');
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-campus-900 to-blue-600 flex items-center justify-center text-white mx-auto shadow-md shadow-blue-500/20">
            <ShieldCheck className="w-7 h-7 text-teal-300" />
          </div>
          <h1 className="text-2xl font-extrabold text-campus-900 tracking-tight">
            Sign In to CampusCare
          </h1>
          <p className="text-xs text-slate-500">
            Smart Campus Complaint and Grievance Management System
          </p>
        </div>

        {/* Quick Demo Account Selector (Hackathon Evaluation Helper) */}
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>1-Click Hackathon Evaluation Logins:</span>
          </div>
          <p className="text-[11px] text-blue-700/80">
            Click any demo profile to instantly test that role's interface and permissions:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin(USER_ROLES.STUDENT)}
              className="p-2 bg-white rounded-xl border border-blue-200 hover:border-blue-400 text-left transition-all shadow-sm group"
            >
              <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600">Student</p>
              <p className="text-[10px] text-slate-500">Aarav (CS Dept)</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin(USER_ROLES.FACULTY)}
              className="p-2 bg-white rounded-xl border border-blue-200 hover:border-blue-400 text-left transition-all shadow-sm group"
            >
              <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600">Faculty</p>
              <p className="text-[10px] text-slate-500">Dr. Meera (ECE)</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin(USER_ROLES.STAFF)}
              className="p-2 bg-white rounded-xl border border-blue-200 hover:border-blue-400 text-left transition-all shadow-sm group"
            >
              <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600">Dept Staff</p>
              <p className="text-[10px] text-slate-500">Venkatesh (IT Desk)</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin(USER_ROLES.ADMIN)}
              className="p-2 bg-white rounded-xl border border-blue-200 hover:border-blue-400 text-left transition-all shadow-sm group"
            >
              <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600">Admin</p>
              <p className="text-[10px] text-slate-500">Dean Dr. Harish</p>
            </button>
          </div>
        </div>

        {/* Standard Login Form */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Campus Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                  }}
                  placeholder="student@campus.edu"
                  className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors.email ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Any test password</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors.password ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Role Radio Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Select Persona Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { role: USER_ROLES.STUDENT, label: 'Student' },
                  { role: USER_ROLES.STAFF, label: 'Staff' },
                  { role: USER_ROLES.ADMIN, label: 'Admin' },
                ].map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setSelectedRole(item.role)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                      selectedRole === item.role
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {errors.form && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {errors.form}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all disabled:opacity-50"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              New campus member?{' '}
              <Link to="/register" className="font-semibold text-blue-600 hover:underline">
                Register an account
              </Link>
            </p>
          </div>
        </div>

        {/* Security Disclaimer */}
        <p className="text-[11px] text-slate-400 text-center leading-relaxed">
          Demonstration Notice: Simulated authentication provided for hackathon workflow evaluation. The production Express & MySQL backend enforces bcrypt password hashing and signed JWT bearer tokens.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
