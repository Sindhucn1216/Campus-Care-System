import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, role, bootstrapped, isLoading } = useAuth();
  const location = useLocation();

  if (!bootstrapped || isLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center text-sm text-slate-500">
        Checking your session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && !roles.includes(role)) {
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'staff') return <Navigate to="/staff/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
