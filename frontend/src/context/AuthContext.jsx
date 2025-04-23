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
  const [user, setUser] = useState(null); // Store user details { id, username, email, etc. }
  const [token, setToken] = useState(localStorage.getItem('authToken') || null); // Get token from storage on initial load
  const [isLoading, setIsLoading] = useState(true); // Indicate if initial auth check is happening (context's loading state)

  // --- Configure Axios to send token with requests ---
  useEffect(() => {
    console.log("AuthContext useEffect [token] triggered. Token is:", !!token); // <-- ADDED DEBUG LOG
    if (token) {
      // Add token to localStorage
      localStorage.setItem('authToken', token);
      // Apply token to subsequent Axios requests for this instance
      apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;
       console.log("AuthContext: Token set in localStorage and Axios headers. Calling checkAuthStatus."); // <-- ADDED DEBUG LOG
    } else {
      // Remove token from localStorage
      localStorage.removeItem('authToken');
      // Remove token from Axios defaults
      delete apiClient.defaults.headers.common['Authorization'];
       console.log("AuthContext: Token removed from localStorage and Axios headers. Calling checkAuthStatus."); // <-- ADDED DEBUG LOG
    }
     // When token changes, attempt to fetch user data (ensures user state matches token)
     // We wrap this check in a separate function to avoid direct async call in useEffect
     checkAuthStatus(); // Call checkAuthStatus whenever token changes
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Re-run ONLY when token changes (fetchUser is now a dependency of checkAuthStatus)


  // --- Fetch Logged-in User Data ---
  const fetchUser = useCallback(async () => {
     console.log("AuthContext: Attempting to fetch user..."); // <-- ADDED DEBUG LOG
    // Check if the header is actually set before making the request
    if (!apiClient.defaults.headers.common['Authorization']) {
       console.log("AuthContext: fetchUser - No auth header found, skipping fetchUser."); // <-- ADDED DEBUG LOG
       setUser(null);
       setIsLoading(false); // Ensure context loading stops if called without token
       return;
     }

    setIsLoading(true); // Set context loading true specifically for user fetch
    try {
      // Use the endpoint we created: /api/auth/user/
      const response = await apiClient.get('/auth/user/');
      console.log("AuthContext: User fetched successfully:", response.data); // <-- ADDED DEBUG LOG
      setUser(response.data); // Set user state
    } catch (error) {
      console.error('AuthContext: Failed to fetch user. Token might be invalid.', error.response?.data || error.message); // <-- UPDATED ERROR LOG
      setUser(null); // Clear user if token is invalid
      setToken(null); // Clear invalid token (this triggers the useEffect above)
    } finally {
      setIsLoading(false); // Ensure context loading is set to false regardless of success/failure
      console.log(`AuthContext: fetchUser finished. AuthContext isLoading state set to ${false}. User is now:`, !!user); // <-- ADDED DEBUG LOG + User status
    }
     // fetchUser relies on the existence of the token being in the default headers
     // and updates state (user, isLoading, token). It doesn't depend on anything outside.
  }, []); // No dependencies needed for fetchUser itself as it uses apiClient default headers


  // --- Auth Check Function (can be called on load or manually) ---
  // This function checks local storage and initiates fetchUser if a token is found
   const checkAuthStatus = useCallback(async () => {
        console.log("AuthContext: checkAuthStatus called."); // <-- ADDED DEBUG LOG
        const currentToken = localStorage.getItem('authToken'); // Check storage directly too
        console.log("AuthContext: checkAuthStatus - localStorage token:", !!currentToken); // <-- ADDED DEBUG LOG
        if (currentToken) {
             console.log("AuthContext: checkAuthStatus - Token found, preparing to fetch user."); // <-- ADDED DEBUG LOG
            // Ensure token is applied to headers before fetching (redundant if useEffect works, but safe)
            if (!apiClient.defaults.headers.common['Authorization']) {
                 apiClient.defaults.headers.common['Authorization'] = `Token ${currentToken}`;
            }
            await fetchUser(); // Wait for user fetch to complete
            console.log("AuthContext: checkAuthStatus - fetchUser awaited."); // <-- ADDED DEBUG LOG
        } else {
             console.log("AuthContext: checkAuthStatus - No token found, setting user null and isLoading false."); // <-- ADDED DEBUG LOG
             setUser(null);
             setIsLoading(false); // Ensure context loading stops if there's no token
        }
   }, [fetchUser]); // Depends on fetchUser function itself


  // --- Initial Auth Check on Application Load ---
  // This useEffect runs once when the AuthProvider component mounts
  useEffect(() => {
     console.log("AuthContext: Initializing - running checkAuthStatus on mount.") // <-- ADDED DEBUG LOG
     // Set loading to true initially before checking status
     setIsLoading(true);
     checkAuthStatus();
     // Intentionally run only once on mount
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this runs only on mount and unmount


  // --- Register Function ---
  const register = useCallback(async (userData) => {
    console.log('AuthContext: Attempting registration with form data:', userData); // <-- ADDED DEBUG LOG
    setIsLoading(true); // Set context loading state
    try {
      // *** FIX START: Correctly construct backendData ***
      // dj-rest-auth's registration endpoint expects 'username', 'email', 'password', 'password2' by default.
      // If you used a custom serializer in api.serializers.py that renames 'password' to 'password1',
      // you would use password1 here. Let's assume the default dj-rest-auth naming for now.
      const backendData = {
         username: userData.username,
         email: userData.email,
         password1: userData.password,   // Use 'password' (default dj-rest-auth registration serializer expects this)
         password2: userData.password2, // Use 'password2'
         // Add other fields from your form/serializer if needed, e.g.:
         // first_name: userData.first_name || '',
         // last_name: userData.last_name || '',
      };
      // *** FIX END ***

      console.log('AuthContext: Sending data to backend:', backendData); // <-- Updated log description

      // Make the POST request to the standard dj-rest-auth registration endpoint
      const response = await apiClient.post('/auth/registration/', backendData);

      console.log('AuthContext: Registration API call successful:', response.data); // <-- ADDED DEBUG LOG
      // Note: dj-rest-auth registration *might* return a token or might require a separate login step
      // depending on settings. If it auto-logs in, the setToken below handles it.
      // If not, the form component might need to redirect to login page.

      // Attempt to get token if registration response includes it (optional, depends on dj-rest-auth settings)
      if (response.data.key) {
         console.log("AuthContext: Registration response included token, calling setToken."); // <-- ADDED DEBUG LOG
         setToken(response.data.key); // This will trigger the useEffect -> checkAuthStatus -> fetchUser flow
      } else {
         console.log("AuthContext: Registration response did NOT include token."); // <-- ADDED DEBUG LOG
         // If no token, assume user needs to log in. Let the form component handle navigation.
         setIsLoading(false); // Context loading is done for the registration process
      }


      return response.data; // Return success data

    } catch (error) {
      // --- UPDATED: Improved Error Logging and Handling ---
      let errorDetails = error.response?.data || error.message; // Default to basic message
      if (error.response?.data) {
        // Attempt to format DRF error messages nicely
        try {
            errorDetails = Object.entries(error.response.data).map(([key, value]) => {
                // Join array values, otherwise use string representation
                const message = Array.isArray(value) ? value.join(', ') : String(value);
                 // Make key names more readable if needed (e.g., 'non_field_errors' -> 'Error')
                 const displayKey = key === 'non_field_errors' ? 'Error' : key;
                return `${displayKey}: ${message}`; // Format as "field: error message"
            }).join('; '); // Join multiple field errors with semicolon
        } catch (formatError) {
            console.error("AuthContext: Error formatting backend error object:", formatError); // <-- ADDED DEBUG LOG
            // Fallback if error structure is unexpected
            errorDetails = JSON.stringify(error.response.data);
        }
      }
      console.error('AuthContext: Registration failed! Response Details:', errorDetails); // <-- UPDATED ERROR LOG
      setIsLoading(false); // Set context loading state back to false on error
      throw error; // Re-throw the original error so the calling component can access response details if needed
    }
  }, []); // No dependencies needed for register itself

  // --- Login Function ---
  const login = useCallback(async (credentials) => {
    console.log("AuthContext: Attempting login with credentials:", credentials); // <-- ADDED DEBUG LOG
    setIsLoading(true); // Set context loading
    try {
        // Assumes credentials object has { username: '...', password: '...' }
        const response = await apiClient.post('/auth/login/', credentials);
        const { key } = response.data; // dj-rest-auth returns the token under 'key'
        console.log("AuthContext: Login successful, received token."); // <-- ADDED DEBUG LOG (Don't log key itself)
        setToken(key); // This triggers the useEffect [token] -> checkAuthStatus -> fetchUser flow
        // DO NOT set setIsLoading(false) here on success. Let the fetchUser.finally handle the final context loading state.
        console.log("AuthContext: login success -> setToken called. useEffect [token] will run shortly."); // <-- ADDED DEBUG LOG
        return response.data; // Return success data (includes token)
    } catch (error) {
        // --- UPDATED: Improved Error Logging and Handling ---
        let errorDetails = error.response?.data || error.message;
         if (error.response?.data) {
            try {
                // Similar error formatting as in register, focus on non_field_errors for login
                const errors = error.response.data;
                 if (errors.non_field_errors && Array.isArray(errors.non_field_errors)) {
                    errorDetails = `Error: ${errors.non_field_errors.join(', ')}`;
                } else {
                    // Fallback for other structures
                     errorDetails = Object.entries(errors).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('; ');
                }
            } catch (formatError) {
                 console.error("AuthContext: Error formatting backend login error object:", formatError); // <-- ADDED DEBUG LOG
                 errorDetails = JSON.stringify(error.response.data);
            }
         }
        console.error('AuthContext: Login failed! Response Details:', errorDetails); // <-- UPDATED ERROR LOG
        setIsLoading(false); // Set context loading back to false on error
        setUser(null); // Ensure user is null on failed login
        setToken(null); // Ensure token is null on failed login (triggers useEffect)
        throw error; // Re-throw for the form component
    }
  }, []); // No dependencies needed here

  // --- Logout Function ---
  const logout = useCallback(async () => {
    console.log("AuthContext: Attempting logout."); // <-- ADDED DEBUG LOG
    setIsLoading(true); // Set context loading
    try {
        // Optional: Call the backend logout endpoint to invalidate the token server-side
        // This endpoint usually requires authentication (the token you are about to clear)
        if (token) { // Only attempt backend logout if we still have a token
           await apiClient.post('/auth/logout/'); // Assuming endpoint is /api/auth/logout/
           console.log("AuthContext: Backend logout successful."); // <-- ADDED DEBUG LOG
        } else {
            console.log("AuthContext: No token found, skipping backend logout call."); // <-- ADDED DEBUG LOG
        }
    } catch (error) {
        // Log error but proceed with frontend logout regardless
        console.error("AuthContext: Backend logout failed (token might already be invalid/expired):", error.response?.data || error.message); // <-- UPDATED ERROR LOG
    } finally {
        // Always clear state and token on the frontend
        setUser(null);
        setToken(null); // This triggers useEffect to clear localStorage/Axios header and set isLoading=false
        // setIsLoading(false); // Let the useEffect [token] handle the final isLoading=false
        console.log("AuthContext: Frontend state cleared for logout."); // <-- ADDED DEBUG LOG
    }
  }, [token]); // Logout needs 'token' as a dependency to decide if backend call is needed


  // Value provided to consuming components
  const contextValue = {
    user,
    token,
    isLoading, // Provide context's loading state (useful for UI feedback throughout the app)
    login,
    register,
    logout,
    checkAuthStatus, // Expose if manual refresh is needed
    isAuthenticated: !!user // Provide a derived state for easier checking
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {/*
        You might conditionally render children or a full-page loading spinner here
        based on context.isLoading, especially during the initial load check.
        For example: {isLoading ? <FullPageSpinner /> : children}
        However, placing ProtectedRoute inside children achieves a similar effect
        by letting ProtectedRoute handle the loading state display.
      */}
       {children}
    </AuthContext.Provider>
  );
};

// Export the context itself (less common to use directly, use useAuth hook instead)
export default AuthContext;