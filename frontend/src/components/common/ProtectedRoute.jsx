// src/components/Common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

// Optional: Extend to check for specific roles/user types
const ProtectedRoute = ({ allowedUserTypes }) => {
  const { isAuthenticated, isLoading, userType } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const isAllowed = allowedUserTypes ? allowedUserTypes.includes(userType) : true;

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they login,
    // which is a nicer user experience than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAllowed) {
    // User is authenticated but not authorized for this route
    // Redirect to a general dashboard or home page?
    console.warn(`User type '${userType}' not allowed for this route. Allowed: ${allowedUserTypes}`);
    // Maybe redirect to their *correct* dashboard?
     const correctDashboard = userType === 'individual' ? '/dashboard/individual' : userType === 'organization' ? '/dashboard/organization' : userType === 'donor' ? '/dashboard/donor' : '/';
     return <Navigate to={correctDashboard} replace />;
    // Or show an "Unauthorized" page:
    // return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated and (optionally) authorized, render the child routes/component
  return <Outlet />; // Renders the nested child route components
};

export default ProtectedRoute;