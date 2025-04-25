// src/pages/DashboardRouter.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // Import useAuth hook

// Import your specific dashboard components
import IndividualDashboard from './Dashboard/IndividualDashboard';
import OrganizationDashboard from './Dashboard/OrganizationDashboard';
import DonorDashboard from './Dashboard/DonorDashboard';
import DistributionCenterDashboard from './Dashboard/DistributionCenterDashboard'; // Assuming this component exists
import AdminDashboard from './Dashboard/AdminDashboard'; // Assuming this component exists
import UnauthorizedPage from './UnauthorizedPage'; // Create an UnauthorizedPage component


// This component acts as a router *within* the protected dashboard area
// It determines which specific dashboard view to show based on the user's explicit role
const DashboardRouter = () => {
  // Get authentication state and explicit role flags from your AuthContext
  const {
      user, // Contains the user object with 'role' string
      isLoading, // Context loading state
      isAuthenticated, // Derived state (!!user)
      // Get the boolean flags derived from the explicit role
      isSystemAdmin,
      isOrgAdmin,
      isCenterAdmin,
      isDonor,
      isIndividualRecipient,
      // We don't necessarily need linkedOrganizationId, linkedCenterId here,
      // the specific dashboard components can get them via useAuth() if needed.
  } = useAuth();


  // --- Handle Loading State (from AuthContext) ---
  // This check is primarily for initial load or re-fetching user data within the protected route.
  // ProtectedRoute handles the *initial* auth loading before rendering this component.
  if (isLoading) {
    console.log("DashboardRouter: Auth context is loading user data...");
    return <div>Loading user data...</div>; // Or a more elaborate spinner
  }

  // --- Handle Unauthenticated State (Fallback) ---
  // This scenario should ideally not happen if DashboardRouter is rendered within ProtectedRoute,
  // as ProtectedRoute should redirect unauthenticated users.
  if (!isAuthenticated) {
    console.log("DashboardRouter: User is unexpectedly not authenticated, redirecting to login.");
    // Use Navigate with replace to prevent navigating back
    return <Navigate to="/login" replace />;
  }

  // --- Route to Specific Dashboard Based on Explicit Role ---
  // The user is authenticated. Now, based on their roles, decide which dashboard component to render.
  // Prioritize roles based on typical access level: System Admin > Org Admin > Center Admin > Donor > Individual Recipient
  // Use the boolean flags derived from the explicit role string in AuthContext for clarity.
  console.log("DashboardRouter: User is authenticated. Determining dashboard based on explicit role:", {
      username: user.username,
      role: user?.role, // Log the actual role string from the user object
      isSystemAdmin: isSystemAdmin,
      isOrgAdmin: isOrgAdmin,
      isCenterAdmin: isCenterAdmin,
      isDonor: isDonor,
      isIndividualRecipient: isIndividualRecipient,
  });

  if (isSystemAdmin) {
    console.log("DashboardRouter: User is System Admin, rendering Admin Dashboard.");
    return <AdminDashboard />;
  }

  if (isOrgAdmin) {
    console.log("DashboardRouter: User is Organization Admin, rendering Organization Dashboard.");
    return <OrganizationDashboard />;
  }

  if (isCenterAdmin) {
    console.log("DashboardRouter: User is Distribution Center Admin, rendering Distribution Center Dashboard.");
    return <DistributionCenterDashboard />;
  }

   // --- Handle Donor vs Individual ---
   // Use the boolean flags derived from the explicit role string
   if (isDonor) { // Checks if user?.role === 'donor'
       console.log("DashboardRouter: User is Donor, rendering Donor Dashboard.");
       return <DonorDashboard />;
   }

  // Default case: User is logged in, but not any of the specific admin types or flagged as donor.
  // Check if they are the 'individual' role.
  if (isIndividualRecipient) { // Checks if user?.role === 'individual'
      console.log("DashboardRouter: User is Individual Recipient, rendering Individual Dashboard.");
      return <IndividualDashboard />;
  }


  // Fallback for any authenticated user that doesn't match any known role/type (should ideally not happen)
  // This might indicate a problem if isAuthenticated is true but user object is null, or user.role is missing/unexpected.
  console.warn("DashboardRouter: Authenticated user role could not be determined or matched to a dashboard.", { user: user });
   // Show a generic welcome or an error message, or redirect to unauthorized
  return (
       <UnauthorizedPage message="Your user role could not be determined or matched to a dashboard." />
   );
  // Or redirect to a safe default page:
  // return <Navigate to="/" replace />;

};

export default DashboardRouter;