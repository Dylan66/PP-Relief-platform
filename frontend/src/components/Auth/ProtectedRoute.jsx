// src/components/Auth/ProtectedRoute.jsx (Create this file)

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const ProtectedRoute = ({ allowedRoles }) => { // Optional: Add role-based access later
  const { user, token, isLoading } = useAuth();
  const location = useLocation(); // Get current location to redirect back after login

  if (isLoading) {
    // Show a loading indicator while checking auth status initially
    return (
      <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em' }}>
        Loading Authentication...
      </div>
    );
  }

  // Check if user is authenticated (either user object exists or token exists)
  const isAuthenticated = !!user || !!token;

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them back after login.
    console.log("ProtectedRoute: Not authenticated, redirecting to login.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Optional: Role-based access check
  // if (allowedRoles && user?.roles && !user.roles.some(role => allowedRoles.includes(role))) {
  //    console.log("ProtectedRoute: User does not have required roles.");
  //    return <Navigate to="/unauthorized" replace />; // Or show an unauthorized message
  // }

  // If authenticated (and optionally authorized), render the child route element
  return <Outlet />; // Renders the component defined in the nested route
};

export default ProtectedRoute;