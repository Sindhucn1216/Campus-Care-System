import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, PhoneCall, Mail, MapPin, Heart, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-campus-900 text-slate-300 border-t border-campus-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <ShieldCheck className="w-5 h-5 text-teal-300" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Campus<span className="text-blue-400">Care</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-sm">
              The centralized, transparent grievance and maintenance management platform empowering university students, faculty, and administrative departments with fast, accountable resolutions.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-campus-800 text-teal-300 border border-campus-700 font-medium">
                ISO 9001:2015 Compliant Workflow
              </span>
              <span className="px-2.5 py-1 rounded-md bg-campus-800 text-slate-300 border border-campus-700">
                v2.4 Hackathon Edition
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Quick Navigation</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home Portal
                </Link>
              </li>
              <li>
                <Link to="/track" className="text-slate-400 hover:text-white transition-colors">
                  Track Grievance
                </Link>
              </li>
              <li>
                <Link to="/complaints/new" className="text-slate-400 hover:text-white transition-colors">
                  File a Complaint
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                  User Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="text-slate-400 hover:text-white transition-colors">
                  Admin Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Resolution Desks</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li>IT Support & Wi-Fi</li>
              <li>Infrastructure & Civil</li>
              <li>Electrical Maintenance</li>
              <li>Housekeeping & Sanitation</li>
              <li>Water Coolers & Plumbing</li>
              <li>Campus Shuttle & Transport</li>
            </ul>
          </div>

          {/* Campus Helpline */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Emergency Assistance</h4>
            <div className="mt-4 space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Campus Control Room</p>
                  <p>+91 (080) 2856-1000 (24x7)</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Grievance Cell Email</p>
                  <p>grievance@campuscare.edu</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Administrative Bhavan</p>
                  <p>Ground Floor, Room G-08</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-campus-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} CampusCare University Platform. Designed for Smart Campus Excellence.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Client State: Active</span>
            <span>•</span>
            <span>API Layer: Ready for Express & MySQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
