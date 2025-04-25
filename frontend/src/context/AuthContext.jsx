// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext(undefined);

// Create an API client instance (optional but good practice)
// It will automatically use the Vite proxy settings defined in vite.config.js
const apiClient = axios.create({
  baseURL: '/api', // Base URL for all API requests relative to the domain
  headers: {
    'Content-Type': 'application/json',
  }
});

export const AuthProvider = ({ children }) => {
  // Store user details { id, username, email, first_name, last_name, is_staff, is_superuser,
  // role (e.g., 'individual', 'organization_admin', 'donor', 'center_admin'),
  // profile_id, linked_organization_id, linked_center_id } - as returned by CustomUserDetailsSerializer
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null); // Get token from storage on initial load
  const [isLoading, setIsLoading] = useState(true); // Indicate if initial auth check is happening (context's loading state)

  // --- Configure Axios to send token with requests ---
  // This useEffect runs whenever the `token` state changes
  useEffect(() => {
    console.log("AuthContext useEffect [token] triggered. Token is present:", !!token);
    if (token) {
      localStorage.setItem('authToken', token);
      apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;
       console.log("AuthContext: Token set in localStorage and Axios headers.");
    } else {
      localStorage.removeItem('authToken');
      delete apiClient.defaults.headers.common['Authorization'];
       console.log("AuthContext: Token removed from localStorage and Axios headers.");
    }
     // Call checkAuthStatus when the token state changes.
    checkAuthStatus();
     // checkAuthStatus depends on fetchUser, but fetchUser is wrapped in useCallback
     // with no dependencies, so checkAuthStatus is stable and only depends on fetchUser
     // if fetchUser's definition changed (which it won't here).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Re-run ONLY when token state changes


  // --- Fetch Logged-in User Data ---
  // This function fetches user details from the backend using the currently set token
  const fetchUser = useCallback(async () => {
     console.log("AuthContext: Attempting to fetch user...");
    // Check if the header is actually set before making the request
    if (!apiClient.defaults.headers.common['Authorization']) {
       console.log("AuthContext: fetchUser - No auth header found, skipping fetchUser.");
       setUser(null);
       setIsLoading(false); // Ensure context loading stops if no token is available
       return;
     }

    setIsLoading(true); // Set context loading true specifically for user fetch
    try {
      // Use the endpoint configured by dj-rest-auth: /api/auth/user/
      // This endpoint uses our CustomUserDetailsSerializer
      const response = await apiClient.get('/auth/user/');
      console.log("AuthContext: User fetched successfully:", response.data);

      // *** UPDATE: Store the full user object including the 'role' field and linked IDs ***
      // response.data should now contain: id, username, ..., is_staff, is_superuser,
      // role (e.g., 'individual', 'organization_admin', 'donor', 'center_admin'),
      // profile_id, linked_organization_id, linked_center_id
      setUser(response.data);
      // *** END UPDATE ***

    } catch (error) {
      console.error('AuthContext: Failed to fetch user. Token might be invalid.', error.response?.data || error.message);
      // If fetching user fails (e.g., invalid token), clear the token and user
      setUser(null);
      setToken(null); // This triggers the useEffect [token] -> checkAuthStatus flow to finish clearing
    } finally {
      // Ensure context loading is set to false regardless of success/failure
      setIsLoading(false);
      // Note: console.log might not reflect the state change immediately
      console.log(`AuthContext: fetchUser finished. AuthContext isLoading state set to ${false}. User state is now:`, user);
    }
  }, []);


  // --- Auth Check Function (keep existing) ---
  // This function checks local storage for a token and initiates fetchUser if found.
   const checkAuthStatus = useCallback(async () => {
        console.log("AuthContext: checkAuthStatus called.");
        const currentToken = localStorage.getItem('authToken'); // Check storage directly too
        console.log("AuthContext: checkAuthStatus - localStorage token exists:", !!currentToken);
        if (currentToken) {
             console.log("AuthContext: checkAuthStatus - Token found, preparing to fetch user.");
            if (!apiClient.defaults.headers.common['Authorization']) {
                 apiClient.defaults.headers.common['Authorization'] = `Token ${currentToken}`;
            }
            await fetchUser(); // Wait for user fetch to complete
            console.log("AuthContext: checkAuthStatus - fetchUser awaited.");
        } else {
             console.log("AuthContext: checkAuthStatus - No token found, setting user null and isLoading false.");
             setUser(null);
             setIsLoading(false); // Ensure context loading stops if there's no token
        }
   }, [fetchUser]);


  // --- Initial Auth Check on Application Load (keep existing) ---
  // This useEffect runs once when the AuthProvider component mounts to check for existing token
  useEffect(() => {
     console.log("AuthContext: Initializing - running checkAuthStatus on mount.")
     // Set loading to true initially before checking status from storage
     setIsLoading(true); // Make sure loading is true at the very start of the app's auth process
     checkAuthStatus();
     // Intentionally run only once on mount
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this runs only on mount (and unmount)


  // --- Register Function (keep existing with fix) ---
  // Handles user registration via the backend API
  const register = useCallback(async (userData) => {
    console.log('AuthContext: Attempting registration with form data:', userData);
    setIsLoading(true); // Set context loading state
    try {
      // Construct backend data object matching the RegisterSerializer expectations
      const backendData = {
         username: userData.username,
         email: userData.email,
         password: userData.password,   // dj-rest-auth default expects 'password'
         password2: userData.password2, //dj-rest-auth default expects 'password2'
         first_name: userData.first_name || '', // Include optional fields if form provides them
         last_name: userData.last_name || '',
      };

      console.log('AuthContext: Sending data to backend:', backendData);

      // Make the POST request to the standard dj-rest-auth registration endpoint
      const response = await apiClient.post('/auth/registration/', backendData);

      console.log('AuthContext: Registration API call successful:', response.data);

      // dj-rest-auth registration can be configured to auto-login (REGISTER_AUTO_LOGIN: True)
      // If it auto-logs in, the response *might* contain a token.
      if (response.data.key) {
         console.log("AuthContext: Registration response included token (likely auto-login). Calling setToken.");
         setToken(response.data.key); // Set the token which triggers useEffect [token] -> checkAuthStatus -> fetchUser
      } else {
         console.log("AuthContext: Registration response did NOT include token (auto-login is false or failed).");
         // If no token, assume user needs to log in. The form component should handle navigation
         // (e.g., redirect to login page). Context loading is done for this specific API call.
         setIsLoading(false); // Context loading is finished for the registration API call
      }

      return response.data; // Return success data

    } catch (error) {
      // --- Improved Error Logging and Handling ---
      let errorDetails = error.response?.data || error.message; // Default to basic message
      if (error.response?.data) {
        // Attempt to format DRF error messages nicely
        try {
            errorDetails = Object.entries(error.response.data).map(([key, value]) => {
                // Join array values, otherwise use string representation
                const message = Array.isArray(value) ? value.join(', ') : String(value);
                 // Make key names more readable (e.g., 'non_field_errors' -> 'Error')
                 const displayKey = key === 'non_field_errors' ? 'Error' : key;
                return `${displayKey}: ${message}`; // Format as "field: error message"
            }).join('; '); // Join multiple field errors with semicolon
        } catch (formatError) {
            console.error("AuthContext: Error formatting backend registration error object:", formatError);
            // Fallback if error structure is unexpected
            errorDetails = JSON.stringify(error.response.data);
        }
      }
      console.error('AuthContext: Registration failed! Response Details:', errorDetails);
      setIsLoading(false); // Set context loading state back to false on error
      throw error; // Re-throw the original error so the calling component can access response details if needed
    }
  }, []);


  // --- Login Function (keep existing) ---
  // Handles user login via the backend API
  const login = useCallback(async (credentials) => {
    console.log("AuthContext: Attempting login with credentials:", credentials);
    setIsLoading(true); // Set context loading
    try {
        // Make POST request to the standard dj-rest-auth login endpoint
        const response = await apiClient.post('/auth/login/', credentials);
        const { key } = response.data; // dj-rest-auth token auth returns the token under 'key'
        console.log("AuthContext: Login successful, received token."); // Don't log key itself for security
        setToken(key); // Set the token state, which triggers useEffect [token] -> checkAuthStatus -> fetchUser
        // DO NOT set setIsLoading(false) here on login success.
        // Let the subsequent fetchUser.finally handle the final context loading state transition after getting user details.
        console.log("AuthContext: login success -> setToken called. useEffect [token] will run shortly.");
        return response.data; // Return success data (includes token key)
    } catch (error) {
        // --- Improved Error Logging and Handling ---
        let errorDetails = error.response?.data || error.message;
         if (error.response?.data) {
            try {
                // Handle login specific errors (often in non_field_errors)
                const errors = error.response.data;
                 if (errors.non_field_errors && Array.isArray(errors.non_field_errors)) {
                    errorDetails = `Error: ${errors.non_field_errors.join(', ')}`;
                } else {
                     // Fallback for other structures
                     errorDetails = Object.entries(errors).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('; ');
                }
            } catch (formatError) {
                 console.error("AuthContext: Error formatting backend login error object:", formatError);
                 errorDetails = JSON.stringify(error.response.data);
            }
         }
        console.error('AuthContext: Login failed! Response Details:', errorDetails);
        setIsLoading(false); // Set context loading back to false on error
        setUser(null); // Ensure user is null on failed login
        setToken(null); // Ensure token is null on failed login (triggers useEffect [token])
        throw error; // Re-throw for the form component to handle (e.g., display error message)
    }
  }, []); // No dependencies needed here


  // --- Logout Function (keep existing) ---
  // Handles user logout (clears frontend state and optionally calls backend)
  const logout = useCallback(async () => {
    console.log("AuthContext: Attempting logout.");
    setIsLoading(true); // Set context loading (optional for logout)
    try {
        // Optional: Call the backend logout endpoint to invalidate the token server-side
        // This endpoint usually requires authentication (the token you are about to clear).
        // If the token is already expired/invalid, this might fail, but we proceed with frontend clear.
        if (token) {
           // Assuming dj-rest-auth logout endpoint is /api/auth/logout/
           // This endpoint usually expects POST with no body and uses the Authorization header.
           await apiClient.post('/auth/logout/');
           console.log("AuthContext: Backend logout successful.");
        } else {
            console.log("AuthContext: No token found, skipping backend logout call.");
        }
    } catch (error) {
        // Log error but proceed with frontend logout regardless
        console.error("AuthContext: Backend logout failed (token might already be invalid/expired):", error.response?.data || error.message);
    } finally {
        setUser(null);
        setToken(null); // This triggers useEffect [token] -> checkAuthStatus which sets isLoading=false
        setIsLoading(false); // Explicitly set loading to false here too just in case
        console.log("AuthContext: Frontend state cleared for logout.");
    }
  }, [token]);


  // --- Value provided to consuming components ---
  // Expose state and functions via context
  const contextValue = {
    user, // The user object from fetchUser, containing the 'role' string and linked IDs
    token,
    isLoading, // Provide context's loading state (true during initial check, login, register, fetchUser)
    login,
    register,
    logout,
    checkAuthStatus, // Expose if manual refresh of auth status is needed

    // --- Derived states for easier role checking in components ---
    // These are booleans derived from the user object's 'role' property
    // Use ?. (optional chaining) because user might be null initially or after logout
    isAuthenticated: !!user, // True if user object is not null (implies token was valid and user fetched)

    // Use user?.role === '...' to check specific roles
    isSystemAdmin: !!user?.is_staff || !!user?.is_superuser, // Check built-in Django admin flags
    isOrgAdmin: user?.role === 'organization_admin',
    isCenterAdmin: user?.role === 'center_admin',
    isDonor: user?.role === 'donor',
    isIndividualRecipient: user?.role === 'individual',

    // --- Expose linked IDs for fetching role-specific data ---
    // These are still useful for dashboard components to know *which* org/center/etc. they manage
    linkedOrganizationId: user?.linked_organization_id || null, // Assumes backend provides this
    linkedCenterId: user?.linked_center_id || null,           // Assumes backend provides this
    profileId: user?.profile_id || null, // Expose the profile ID
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {/*
        Optionally render a full-page loading spinner here if context.isLoading is true
        to cover the initial check when the app loads.
        Otherwise, ProtectedRoute will handle showing a loading state for protected pages.
      */}
       {children}
    </AuthContext.Provider>
  );
};

// Export the context itself (less common to use directly, use useAuth hook instead)
export default AuthContext;