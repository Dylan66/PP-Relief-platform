// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
// Import Cookies library to read the csrftoken cookie
import Cookies from 'js-cookie'; // Make sure you have js-cookie installed (npm install js-cookie or yarn add js-cookie)

// Create the context
const AuthContext = createContext(undefined);

// Create an API client instance (optional but good practice)
const apiClient = axios.create({
  baseURL: '/api', // Base URL for all API requests relative to the domain
  headers: {
    'Content-Type': 'application/json',
  },
  // *** Configure Axios to send cookies ***
  withCredentials: true, // This tells Axios to send cookies (like csrftoken) with cross-origin requests
  // *** END Configure Axios ***
});

// *** Configure Axios to include CSRF token in headers ***
// This interceptor runs before each request
apiClient.interceptors.request.use(
    (config) => {
        // Get the csrftoken from the cookie
        const csrfToken = Cookies.get('csrftoken');
        // If the request method is not GET, HEAD, OPTIONS, TRACE
        // AND we have a csrfToken, add it to the X-CSRFToken header
        if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method)) {
            config.headers['X-CSRFToken'] = csrfToken;
            console.log(`Axios Interceptor: Adding X-CSRFToken header: ${csrfToken.substring(0, 5)}...`); // Debug log (partial token)
        } else {
            // console.log(`Axios Interceptor: No X-CSRFToken added for method ${config.method}. csrfToken exists: ${!!csrfToken}`); // Debug log
        }
        return config;
    },
    (error) => {
        // Do something with request error
        console.error("Axios Interceptor: Request Error:", error);
        return Promise.reject(error);
    }
);
// *** END Configure Axios Interceptor ***


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [isLoading, setIsLoading] = useState(true); // Context's loading state

  // --- Fetch CSRF Cookie ---
  // This function makes a GET request to the backend to ensure the csrftoken cookie is set
  const fetchCsrfCookie = useCallback(async () => {
      console.log("AuthContext: Attempting to fetch CSRF cookie...");
      try {
           // Hit the backend endpoint we created
           await apiClient.get('/csrf/'); // Use apiClient
           console.log("AuthContext: CSRF cookie fetched/set.");
      } catch (error) {
           console.error("AuthContext: Failed to fetch CSRF cookie:", error);
           // Decide how to handle failure (e.g., show error, disable forms)
           setError("Failed to set up security token. Please refresh."); // You might need a context-level error state
      }
  }, []); // No dependencies

  // --- Configure Axios to send token with requests ---
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
  const fetchUser = useCallback(async () => {
     console.log("AuthContext: Attempting to fetch user...");
    if (!apiClient.defaults.headers.common['Authorization']) {
       console.log("AuthContext: fetchUser - No auth header found, skipping fetchUser.");
       setUser(null);
       setIsLoading(false);
       return;
     }

    setIsLoading(true);
    try {
      const response = await apiClient.get('/auth/user/');
      console.log("AuthContext: User fetched successfully:", response.data);
      setUser(response.data);
    } catch (error) {
      console.error('AuthContext: Failed to fetch user. Token might be invalid.', error.response?.data || error.message);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
      console.log(`AuthContext: fetchUser finished. AuthContext isLoading state set to ${false}. User state is now:`, user);
    }
  }, []);


  // --- Auth Check Function ---
   const checkAuthStatus = useCallback(async () => {
        console.log("AuthContext: checkAuthStatus called.");
        const currentToken = localStorage.getItem('authToken');
        console.log("AuthContext: checkAuthStatus - localStorage token exists:", !!currentToken);
        if (currentToken) {
             console.log("AuthContext: checkAuthStatus - Token found, preparing to fetch user.");
            if (!apiClient.defaults.headers.common['Authorization']) {
                 apiClient.defaults.headers.common['Authorization'] = `Token ${currentToken}`;
            }
            await fetchUser();
            console.log("AuthContext: checkAuthStatus - fetchUser awaited.");
        } else {
             console.log("AuthContext: checkAuthStatus - No token found, setting user null and isLoading false.");
             setUser(null);
             setIsLoading(false);
        }
   }, [fetchUser]);


  // --- Initial Auth Check on Application Load ---
  useEffect(() => {
     console.log("AuthContext: Initializing - running checkAuthStatus on mount.")
     setIsLoading(true);
     // *** First, fetch the CSRF cookie ***
     fetchCsrfCookie().then(() => {
          // *** Then, check authentication status ***
          checkAuthStatus();
     });

     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCsrfCookie, checkAuthStatus]); // Dependencies: run when these stable functions change


  // --- Register Function ---
  const register = useCallback(async (userData) => {
    console.log('AuthContext: Attempting registration with form data:', userData);
    setIsLoading(true);
    try {
      const backendData = {
         username: userData.username,
         email: userData.email,
         password: userData.password,   //Correct key should be 'password'
         password2: userData.password2, // be 'password2'
         first_name: userData.first_name || '',
         last_name: userData.last_name || '',
      };

      console.log('AuthContext: Sending data to backend:', backendData);

      const response = await apiClient.post('/auth/registration/', backendData);

      console.log('AuthContext: Registration API call successful:', response.data);

      if (response.data.key) {
         console.log("AuthContext: Registration response included token (likely auto-login). Calling setToken.");
         setToken(response.data.key);
      } else {
         console.log("AuthContext: Registration response did NOT include token (auto-login is false or failed).");
         setIsLoading(false);
      }

      return response.data;

    } catch (error) {
      let errorDetails = error.response?.data || error.message;
       if (error.response?.data) {
        try {
            errorDetails = Object.entries(error.response.data).map(([key, value]) => {
                const message = Array.isArray(value) ? value.join(', ') : String(value);
                 const displayKey = key === 'non_field_errors' ? 'Error' : key;
                 if (key === 'password') displayKey = 'Password';
                 else if (key === 'password2') displayKey = 'Confirm Password';
                 else if (key === 'username') displayKey = 'Username';
                 else if (key === 'email') displayKey = 'Email';
                 else if (key === 'detail') displayKey = 'Error'; // Generic error detail from DRF/permissions
                 else if (key === 'code') displayKey = 'Error Code'; // Sometimes code is returned
                 else if (key === 'messages') displayKey = 'Messages'; // Sometimes messages array is returned


                return `${displayKey.charAt(0).toUpperCase() + displayKey.slice(1)}: ${message}`;
            }).join('\n');
             if (errorDetails.length === 0 && typeof errors === 'string') {
                  errorDetails = errors;
             } else if (errorDetails.length === 0) {
                 errorDetails = JSON.stringify(errors);
             }

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


  // --- Login Function ---
  const login = useCallback(async (credentials) => {
    console.log("AuthContext: Attempting login with credentials:", credentials);
    setIsLoading(true);
    try {
        const response = await apiClient.post('/auth/login/', credentials);
        const { key } = response.data;
        console.log("AuthContext: Login successful, received token.");
        setToken(key);
        console.log("AuthContext: login success -> setToken called. useEffect [token] will run shortly.");
        return response.data;
    } catch (error) {
        let errorDetails = error.response?.data || error.message;
         if (error.response?.data) {
            try {
                const errors = error.response.data;
                 if (errors.non_field_errors && Array.isArray(errors.non_field_errors)) {
                    errorDetails = `Error: ${errors.non_field_errors.join(', ')}`;
                } else if (errors.detail) { // Handle DRF PermissionDenied errors etc.
                     errorDetails = `Detail: ${errors.detail}`;
                } else {
                     errorDetails = Object.entries(errors).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('; ');
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


  // --- Logout Function ---
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

    // Expose the apiClient so other components/services can use the authenticated instance
    apiClient,
  };

  return (
    <AuthContext.Provider value={contextValue}>
       {children}
    </AuthContext.Provider>
  );
};

// Export the context itself
export default AuthContext;