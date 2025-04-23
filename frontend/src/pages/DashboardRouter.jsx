// src/pages/DashboardRouter.jsx (Create this file)

import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Import your specific dashboard components
import IndividualDashboard from './Dashboard/IndividualDashboard';
import OrganizationDashboard from './Dashboard/OrganizationDashboard';
import DonorDashboard from './Dashboard/DonorDashboard'; // Adjust name as needed

const DashboardRouter = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  if (!user) {
    // Should be caught by ProtectedRoute, but good fallback
    return <Navigate to="/login" replace />;
  }

  // *** IMPORTANT: Adapt this logic based on how user role is stored in your user object ***
  // Example: Assuming user object has a 'role' property like 'individual', 'org_admin', 'admin'
  const userRole = user.role; // Replace 'user.role' with your actual role field identifier

  console.log("DashboardRouter: Determining dashboard for role:", userRole);

  switch (userRole) {
    case 'individual': // Adjust role names as needed
      return <IndividualDashboard />;
    case 'org_admin': // Adjust role names as needed
    case 'organization': // Or however you identify org users
      return <OrganizationDashboard />;
    case 'admin': // Adjust role names as needed
    case 'donor': // Maybe donors share an admin view or have their own?
      return <DonorDashboard />; // Adjust component name
    default:
      // Handle unexpected roles or users without a defined role
      console.warn("DashboardRouter: Unknown or missing user role:", userRole);
      // Redirect to home or show an error/default dashboard
      return (
          <div>
              <h2>Welcome, {user.username}</h2>
              <p>Could not determine your specific dashboard role.</p>
              {/* Optionally show a generic dashboard or links */}
          </div>
      );
       // Or: return <Navigate to="/" replace />;
  }
};

export default DashboardRouter;