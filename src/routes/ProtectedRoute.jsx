import React from 'react';
import { Navigate } from 'react-router-dom';

// Notice we destructured 'children' here to grab <AdminDashboard /> cleanly
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const isAdminAuthenticated = localStorage.getItem('isAdminAuthenticated');

  // If credentials are missing, instantly redirect back to login tracking
  if (!token || isAdminAuthenticated !== 'true') {
    return <Navigate to="/admin/login" replace />;
  }

  // If token exists, pass through and render the nested component layout safely
  return children;
};

export default ProtectedRoute;