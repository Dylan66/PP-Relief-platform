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

      // Store the full user object including the 'role' field and linked IDs
      // response.data should now contain: id, username, ..., is_staff, is_superuser,
      // role (e.g., 'individual', 'organization_admin', 'donor', 'center_admin'),
      // profile_id, linked_organization_id, linked_center_id
      setUser(response.data);

    } catch (error) {
      console.error('AuthContext: Failed to fetch user. Token might be invalid.', error.response?.data || error.message);
      // If fetching user fails (e.g., invalid token), clear the token and user
      setUser(null);
      setToken(null); // This triggers the useEffect [token] -> checkAuthStatus flow to finish clearing
    } finally {
      // Ensure context loading is set to false regardless of success/failure
      setIsLoading(false);
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
     setIsLoading(true); // Make sure loading is true at the very start of the app's auth process
     checkAuthStatus();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // --- Register Function (with Debug Prints) ---
  // Handles user registration via the backend API
  const register = useCallback(async (userData) => {
    console.log('AuthContext: Attempting registration with form data:', userData);
    setIsLoading(true); // Set context loading state
    try {
      // Construct backend data object matching the RegisterSerializer expectations
      const backendData = {
         username: userData.username,
         email: userData.email,
         password: userData.password,   // Correct key
         password2: userData.password2, // Correct key
         first_name: userData.first_name || '',
         last_name: userData.last_name || '',
      };

      console.log('AuthContext: Sending data to backend:', backendData);

      const response = await apiClient.post('/auth/registration/', backendData);

      // *** DEBUG LOGS: Check the raw response and if setToken is called ***
      console.log('AuthContext: Registration API call successful. Raw response:', response); // Log the full response object
      console.log('AuthContext: Checking response.data for key:', response.data?.key); // Check if key property exists
      // *** END DEBUG LOGS ***

      if (response.data && response.data.key) { // Ensure response.data exists and has a key
         console.log("AuthContext: Registration response included token (auto-login success). Calling setToken.");
         setToken(response.data.key); // Set the token state, which triggers useEffect [token] -> checkAuthStatus -> fetchUser
      } else {
         console.log("AuthContext: Registration response did NOT include token (auto-login failed or off).");
         setIsLoading(false);
      }
      return response.data; // Return success data
    } catch (error) {
      // --- Improved Error Logging and Handling ---
      let errorDetails = error.response?.data || error.message; // Default to basic message
      if (error.response?.data) {
        try {
            errorDetails = Object.entries(error.response.data).map(([key, value]) => {
                const message = Array.isArray(value) ? value.join(', ') : String(value);
                 const displayKey = key === 'non_field_errors' ? 'Error' : key;
                return `${displayKey.charAt(0).toUpperCase() + displayKey.slice(1)}: ${message}`;
            }).join('\n');
        } catch (formatError) {
            console.error("AuthContext: Error formatting backend registration error object:", formatError);
            errorDetails = JSON.stringify(error.response.data);
        }
      }
      console.error('AuthContext: Registration failed! Response Details:', errorDetails);
      setIsLoading(false);
      throw error;
    }
  }, []);


  // --- Login Function (keep existing) ---
  const login = useCallback(async (credentials) => {
    console.log("AuthContext: Attempting login with credentials:", credentials);
    setIsLoading(true);
    try {
        const response = await apiClient.post('/auth/login/', credentials);
        const { key } = response.data;
        console.log("AuthContext: Login successful, received token.");
        setToken(key); // This triggers the useEffect [token] -> checkAuthStatus -> fetchUser flow
        console.log("AuthContext: login success -> setToken called. useEffect [token] will run shortly.");
        return response.data;
    } catch (error) {
        let errorDetails = error.response?.data || error.message;
         if (error.response?.data) {
            try {
                const errors = error.response.data;
                 if (errors.non_field_errors && Array.isArray(errors.non_field_errors)) {
                    errorDetails = `Error: ${errors.non_field_errors.join('\n')}`;
                } else {
                     errorDetails = Object.entries(errors).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('\n');
                }
            } catch (formatError) {
                 console.error("AuthContext: Error formatting backend login error object:", formatError);
                 errorDetails = JSON.stringify(error.response.data);
            }
         }
        console.error('AuthContext: Login failed! Response Details:', errorDetails);
        setIsLoading(false);
        setUser(null);
        setToken(null);
        throw error;
    }
  }, []);


  // --- Logout Function (keep existing) ---
  const logout = useCallback(async () => {
    console.log("AuthContext: Attempting logout.");
    setIsLoading(true);
    try {
        if (token) {
           await apiClient.post('/auth/logout/');
           console.log("AuthContext: Backend logout successful.");
        } else {
            console.log("AuthContext: No token found, skipping backend logout call.");
        }
    } catch (error) {
        console.error("AuthContext: Backend logout failed (token might already be invalid/expired):", error.response?.data || error.message);
    } finally {
        setUser(null);
        setToken(null);
        setIsLoading(false);
        console.log("AuthContext: Frontend state cleared for logout.");
    }
  }, [token]);


  // --- Value provided to consuming components ---
  const contextValue = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    checkAuthStatus,

    isAuthenticated: !!user,
    isSystemAdmin: !!user?.is_staff || !!user?.is_superuser,
    isOrgAdmin: user?.role === 'organization_admin',
    isCenterAdmin: user?.role === 'center_admin',
    isDonor: user?.role === 'donor',
    isIndividualRecipient: user?.role === 'individual',

    linkedOrganizationId: user?.linked_organization_id || null,
    linkedCenterId: user?.linked_center_id || null,
    profileId: user?.profile_id || null,
  };

  return (
    <AuthContext.Provider value={contextValue}>
       {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;