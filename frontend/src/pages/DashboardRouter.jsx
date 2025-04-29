// src/pages/DashboardRouter.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // Import useAuth hook

// Import all your specific dashboard components
import IndividualDashboard from './Dashboard/IndividualDashboard';
import OrganizationDashboard from './Dashboard/OrganizationDashboard';
import DonorDashboard from './Dashboard/DonorDashboard';
import DistributionCenterDashboard from './Dashboard/DistributionCenterDashboard'; // Assuming this component exists
import AdminDashboard from './Dashboard/AdminDashboard'; // Assuming this component exists
import UnauthorizedPage from './UnauthorizedPage'; // Import the UnauthorizedPage component


// This component acts as a router *within* the protected dashboard area (rendered by ProtectedRoute).
// It determines which specific dashboard view to show based on the user's explicit role from AuthContext.
const DashboardRouter = () => {
  // Get authentication state and explicit role flags from your AuthContext
  // These values will be stable after ProtectedRoute has finished its initial loading check.
  const {
      user, // Contains the user object { id, username, ..., role, profile_id, linked_organization_id, ... }
      isLoading, // Context loading state (should be false here if coming from ProtectedRoute)
      isAuthenticated, // Derived state (!!user) (should be true here if coming from ProtectedRoute)
      // Get the boolean flags derived from the explicit role for easier checks
      isSystemAdmin,
      isOrgAdmin,
      isCenterAdmin,
      isDonor,
      isIndividualRecipient,
      // You can also get linkedOrganizationId, linkedCenterId here if needed by ALL dashboards,
      // or fetch them within the specific dashboard components using useAuth().
  } = useAuth();


  // *** DEBUG LOG: Log state when DashboardRouter renders ***
   console.log("DashboardRouter rendering.", {
        isLoadingContext: isLoading, // Should be false here after initial load
        isAuthenticatedContext: isAuthenticated, // Should be true here
        userContext: !!user, // Should be true here
        userRole: user?.role, // The explicit role string
        isSystemAdmin: isSystemAdmin, // Derived flag
        isOrgAdmin: isOrgAdmin,       // Derived flag
        isCenterAdmin: isCenterAdmin, // Derived flag
        isDonor: isDonor,             // Derived flag
        isIndividualRecipient: isIndividualRecipient, // Derived flag
   });
  // *** END DEBUG LOG ***


  // --- Handle Context Loading State (Redundant check if ProtectedRoute is used, but safe) ---
  // If for some reason isLoading is true here, show a loading state.
  // This should be covered by ProtectedRoute, but defensive coding never hurts.
  if (isLoading) {
    console.log("DashboardRouter: Auth context is still loading user data. Showing loading message.");
    return <div>Loading user data...</div>; // Or a more elaborate spinner
  }

  // --- Handle Unauthenticated State (Should NOT happen if ProtectedRoute is used correctly) ---
  // This scenario indicates a misconfiguration in routing where DashboardRouter is reached
  // without the user being authenticated. ProtectedRoute should prevent this.
  if (!isAuthenticated) {
    console.log("DashboardRouter: User is unexpectedly not authenticated. This should be handled by ProtectedRoute. Redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  // --- Route to Specific Dashboard Based on Explicit Role ---
  // The user is authenticated (isAuthenticated is true, user object exists).
  // Now, based on their explicit role (derived from user.role), render the correct dashboard component.
  // Prioritize roles based on typical access level: System Admin > Org Admin > Center Admin > Center Admin > Donor > Individual Recipient
  // Use the boolean flags derived from the explicit role string in AuthContext for clarity.
  console.log("DashboardRouter: User authenticated. Determining dashboard based on explicit role:", user?.role);


  // Check roles in order of priority
  if (isSystemAdmin) { // Checks user?.is_staff || user?.is_superuser
    console.log("DashboardRouter: User is System Admin, rendering Admin Dashboard.");
    return <AdminDashboard />;
  }

  if (isOrgAdmin) { // Checks user?.role === 'organization_admin'
    console.log("DashboardRouter: User is Organization Admin, rendering Organization Dashboard.");
    return <OrganizationDashboard />;
  }

  if (isCenterAdmin) { // Checks user?.role === 'center_admin'
    console.log("DashboardRouter: User is Distribution Center Admin, rendering Distribution Center Dashboard.");
    return <DistributionCenterDashboard />;
  }

   if (isDonor) { // Checks user?.role === 'donor'
       console.log("DashboardRouter: User is Donor, rendering Donor Dashboard.");
       return <DonorDashboard />;
   }

  // Default case: User is logged in, but not any of the specific admin types or flagged as donor.
  // Check if they are the 'individual' role.
  if (isIndividualRecipient) { // Checks user?.role === 'individual'
      console.log("DashboardRouter: User is Individual Recipient, rendering Individual Dashboard.");
      return <IndividualDashboard />;
  }


  // Fallback for any authenticated user that doesn't match any known role/type (should ideally not happen)
  // This indicates a problem with how roles are set or retrieved if isAuthenticated is true but no role matches.
  console.warn("DashboardRouter: Authenticated user role could not be determined or matched to a dashboard.", { user: user });
   // Show an unauthorized page or a generic message indicating the issue
  return (
       <UnauthorizedPage message={`Authenticated user '${user?.username}' has an unrecognized role: ${user?.role}. Please contact support.`} />
   );
  // Alternatively, redirect to a safe default page, but UnauthorizedPage provides better feedback.
  // return <Navigate to="/" replace />;

};

export default DashboardRouter;