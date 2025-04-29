// src/components/Auth/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

// ProtectedRoute component to guard routes that require authentication
// allowedRoles prop is optional for future role-based routing *within* protected areas
const ProtectedRoute = ({ allowedRoles }) => {
  // Get authentication state and flags from the AuthContext
  const { user, isLoading, isAuthenticated, isSystemAdmin, isOrgAdmin, isCenterAdmin, isDonor, isIndividualRecipient } = useAuth();
  const location = useLocation(); // Get current location to redirect back after login
   
  
  // *** DEBUG LOG: Log state when ProtectedRoute renders ***
   console.log("ProtectedRoute rendering.", {
    location: location.pathname, // The path the user is trying to access
    isLoadingContext: isLoading, // Is the authentication context currently loading?
    isAuthenticatedContext: isAuthenticated, // Is the user considered authenticated (based on !!user)?
    userContext: !!user, // Does the user object exist in context?
    userRole: user?.role, // The user's explicit role string if user exists
    // Include derived flags for clarity if needed:
    // isSystemAdmin: isSystemAdmin, isOrgAdmin: isOrgAdmin, ...
});
// *** END DEBUG LOG ***


  // --- Check Context Loading State ---
  // While the initial authentication check is happening, show a loading indicator
  if (isLoading) {
     console.log("ProtectedRoute: Auth context is still loading auth status."); // Debug log
    return (
      <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em' }}>
        Loading Authentication...
      </div>
    );
  }

  // --- Check Authentication Status ---
  // If the user is not authenticated (user object is null after loading)
  if (!isAuthenticated) {
    console.log("ProtectedRoute: User is not authenticated (!isAuthenticated is true), redirecting to login."); // Debug log
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them back after login.
    // Use replace: true to avoid the protected route being in the history history stack before login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // --- Optional: Role-based Access Check (if allowedRoles prop is used) ---
  // If specific roles are required for this route
  if (allowedRoles && user) { // Ensure allowedRoles array is provided and user object exists
      const userHasRequiredRole = allowedRoles.some(role => {
          switch (role) {
              case 'system_admin': return isSystemAdmin;
              case 'org_admin': return isOrgAdmin;
              case 'center_admin': return isCenterAdmin;
              case 'donor': return isDonor;
              case 'individual': return isIndividualRecipient;
              default: return false; // Unknown role in allowedRoles list
          }
      });

       if (!userHasRequiredRole) {
           console.log("ProtectedRoute: Authenticated but user role not allowed.", { allowedRoles: allowedRoles, userRole: user?.role, isSystemAdmin, isOrgAdmin, isCenterAdmin, isDonor, isIndividualRecipient }); // Debug log
           // Redirect to an unauthorized page or show an access denied message
           return <Navigate to="/unauthorized" replace />; // Create this route/component
       }
       console.log("ProtectedRoute: Authenticated and authorized for roles:", allowedRoles); // Debug log
  } else {
      // If no allowedRoles are specified, any authenticated user can access this protected route
       console.log("ProtectedRoute: Authenticated, no specific roles required for this route."); // Debug log
  }


  // If authenticated (and optionally authorized by role), render the child route element
  // The <Outlet> component renders whatever nested route is matched (e.g., DashboardRouter)
  return <Outlet />;
};

export default ProtectedRoute;