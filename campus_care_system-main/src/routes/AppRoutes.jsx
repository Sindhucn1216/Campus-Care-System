import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import { USER_ROLES } from '../constants';

import LandingPage from '../pages/public/LandingPage';
import TrackingPage from '../pages/public/TrackingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import StudentDashboard from '../pages/student/StudentDashboard';
import SubmitComplaintPage from '../pages/student/SubmitComplaintPage';
import MyComplaintsPage from '../pages/student/MyComplaintsPage';
import StaffDashboard from '../pages/staff/StaffDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminComplaintsPage from '../pages/admin/AdminComplaintsPage';
import DepartmentManagementPage from '../pages/admin/DepartmentManagementPage';
import ComplaintDetailPage from '../pages/complaints/ComplaintDetailPage';
import ProfilePage from '../pages/profile/ProfilePage';

const NotFoundPage = () => (
  <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
    <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-2xl font-bold font-mono">
      404
    </div>
    <h2 className="text-2xl font-bold text-campus-900">Page Not Found</h2>
    <p className="text-sm text-slate-500">
      The requested route does not exist on the CampusCare platform.
    </p>
    <Link
      to="/"
      className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
    >
      Return to Home
    </Link>
  </div>
);

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/track" element={<TrackingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={[USER_ROLES.STUDENT, USER_ROLES.FACULTY]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaints"
          element={
            <ProtectedRoute roles={[USER_ROLES.STUDENT, USER_ROLES.FACULTY]}>
              <MyComplaintsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaints/new"
          element={
            <ProtectedRoute roles={[USER_ROLES.STUDENT, USER_ROLES.FACULTY]}>
              <SubmitComplaintPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaints/:id"
          element={
            <ProtectedRoute>
              <ComplaintDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute roles={[USER_ROLES.STAFF]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={[USER_ROLES.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute roles={[USER_ROLES.ADMIN]}>
              <AdminComplaintsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/departments"
          element={
            <ProtectedRoute roles={[USER_ROLES.ADMIN]}>
              <DepartmentManagementPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
