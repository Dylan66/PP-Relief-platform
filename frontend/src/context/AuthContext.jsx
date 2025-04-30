// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext(undefined);

const apiClient = axios.create({
  baseURL: '/api', // Base URL for all API requests relative to the domain
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This tells Axios to send cookies (like csrftoken) with cross-origin requests
});

apiClient.interceptors.request.use(
    (config) => {
        const csrfToken = Cookies.get('csrftoken');
        if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method)) {
            config.headers['X-CSRFToken'] = csrfToken;
            // console.log(`Axios Interceptor: Adding X-CSRFToken header: ${csrfToken ? csrfToken.substring(0, 5) + '...' : 'none'}`); // Reduce frequency if needed
        } else {
             // console.log(`Axios Interceptor: No X-CSRFToken added for method ${config.method}. csrfToken exists: ${!!csrfToken}`);
        }
        return config;
    },
    (error) => {
        console.error("Axios Interceptor: Request Error:", error);
        return Promise.reject(error);
    }
);


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [isLoading, setIsLoading] = useState(true); // Context's loading state

  // --- Fetch CSRF Cookie (Keep existing) ---
  const fetchCsrfCookie = useCallback(async () => {
      console.log("AuthContext: Attempting to fetch CSRF cookie...");
      try {
           await apiClient.get('/csrf/');
           console.log("AuthContext: CSRF cookie fetched/set.");
      } catch (error) {
           console.error("AuthContext: Failed to fetch CSRF cookie:", error);
           // Decide how to handle failure
      }
  }, [apiClient]); // Dependency on apiClient (stable)


  // --- Fetch Logged-in User Data (Dependencies Refined) ---
  const fetchUser = useCallback(async () => {
     console.log("AuthContext: Attempting to fetch user...");
     // Check token existence here explicitly before setting isLoading = true
    if (!apiClient.defaults.headers.common['Authorization']) {
       console.log("AuthContext: fetchUser - No auth header in defaults, skipping fetchUser logic.");
       setUser(null);
       setIsLoading(false);
       return;
     }

    setIsLoading(true); // Set context loading true specifically for user fetch
    try {
      const response = await apiClient.get('/auth/user/');
      console.log("AuthContext: User fetched successfully:", response.data);
      setUser(response.data);
    } catch (error) {
      console.error('AuthContext: Failed to fetch user. Token might be invalid.', error.response?.data || error.message);
      // If fetching user fails (e.g., invalid token), clear the token and user
      setUser(null);
      setToken(null); // This triggers the useEffect [token] below
    } finally {
      setIsLoading(false);
      console.log(`AuthContext: fetchUser finished. AuthContext isLoading state set to ${false}.`); // Avoid logging 'user' here if user state update is async
    }
     // Dependencies: apiClient (stable), setToken, setUser, setIsLoading (React guarantees stable setters)
     // No need for 'user' as a dependency if only used in the final log value
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiClient, setToken, setUser, setIsLoading]);


  // --- Configure Axios/LocalStorage when token changes (Refactored) ---
  // This useEffect runs whenever the `token` state changes (null -> value, value -> null, value1 -> value2)
  useEffect(() => {
    console.count('AuthContext useEffect [token]'); // *** DEBUG COUNT ***
    console.log("AuthContext useEffect [token] triggered. Token is present:", !!token);

    if (token) {
      localStorage.setItem('authToken', token);
      apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;
       console.log("AuthContext: Token set in localStorage and Axios headers.");
       // *** FIX: Call fetchUser *directly* when token becomes available ***
       // checkAuthStatus is no longer needed here.
       fetchUser();
    } else {
      // If token becomes null, clear localStorage and headers, and set user/isLoading
      localStorage.removeItem('authToken');
      delete apiClient.defaults.headers.common['Authorization'];
       console.log("AuthContext: Token removed from localStorage and Axios headers.");
       // *** FIX: When token is explicitly removed, set user and isLoading here ***
       setUser(null);
       setIsLoading(false); // Loading is finished when token is known to be absent
    }
    // Dependencies: token changes, fetchUser is stable, apiClient is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, fetchUser, apiClient]); // List dependencies


  // --- Auth Check Function (Keep existing) ---
  // This function is now only called on initial load.
   const checkAuthStatus = useCallback(async () => {
        console.log("AuthContext: checkAuthStatus called.");
        const currentToken = localStorage.getItem('authToken'); // Check storage directly
        console.log("AuthContext: checkAuthStatus - localStorage token exists:", !!currentToken);
        // If a token is found in storage on initial load, set the state.
        // The useEffect([token]) will then trigger fetchUser.
        if (currentToken) {
             console.log("AuthContext: checkAuthStatus - Token found in storage, setting token state.");
             setToken(currentToken); // Setting token state triggers useEffect([token])
             // setIsLoading(true); // Loading will be set by fetchUser
        } else {
             // If no token in storage, set user null and loading false immediately
             console.log("AuthContext: checkAuthStatus - No token found in storage, setting user null and isLoading false.");
             setUser(null);
             setIsLoading(false); // Loading is finished
        }
   }, [setToken, setUser, setIsLoading, apiClient]); // Dependencies: state setters and apiClient


  // --- Initial Auth Check on Application Load (Refactored) ---
  // This useEffect runs once when the AuthProvider component mounts
  useEffect(() => {
     console.count('AuthContext useEffect Initial'); // *** DEBUG COUNT ***
     console.log("AuthContext: Initializing - fetching CSRF cookie then checking auth status.")
     // Set loading to true initially before checking status from storage and fetching cookie
     setIsLoading(true); // Ensure loading is true at the very start

     // Fetch CSRF cookie FIRST
     fetchCsrfCookie().then(() => {
          // Then, check authentication status from localStorage
          checkAuthStatus();
     }).catch(() => {
         // If fetching CSRF fails, still attempt to check auth status, but loading should eventually stop
         console.error("AuthContext: Initial CSRF fetch failed, proceeding with auth check.");
         checkAuthStatus(); // Proceed with auth check even if cookie fetch failed
     });

     // Dependencies: fetchCsrfCookie and checkAuthStatus are stable via useCallback
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCsrfCookie, checkAuthStatus]); // Dependencies


  // --- Register Function (Keep existing with fixes) ---
  const register = useCallback(async (userData) => {
    // ... (keep existing register logic) ...
    console.log('AuthContext: Attempting registration with form data:', userData);
    setIsLoading(true);
    try {
      const backendData = { /* ... */ password: userData.password, password2: userData.password2, /* ... */ };
      console.log('AuthContext: Sending data to backend:', backendData);
      const response = await apiClient.post('/auth/registration/', backendData);
      console.log('AuthContext: Registration API call successful:', response.data);

      if (response.data.key) {
         console.log("AuthContext: Registration response included token (likely auto-login). Calling setToken.");
         setToken(response.data.key); // Triggers useEffect [token] -> fetchUser
      } else {
         console.log("AuthContext: Registration response did NOT include token (auto-login is false or failed).");
         setIsLoading(false); // Registration API call is done
         // If auto-login is false, the form component should redirect to login page.
      }
      return response.data;
    } catch (error) {
       // ... (keep error handling) ...
        console.error('AuthContext: Registration failed! Response Details:', error.response?.data || error.message);
        setIsLoading(false);
        throw error;
    }
  }, [apiClient, setToken, setIsLoading]); // Dependencies: apiClient, state setters


  // --- Login Function (Keep existing) ---
  const login = useCallback(async (credentials) => {
    console.log("AuthContext: Attempting login with credentials:", credentials);
    setIsLoading(true);
    try {
        const response = await apiClient.post('/auth/login/', credentials);
        const { key } = response.data;
        console.log("AuthContext: Login successful, received token.");
        // Set token state, which triggers useEffect [token] -> fetchUser
        setToken(key);
        console.log("AuthContext: login success -> setToken called. useEffect [token] will run shortly.");
        // DO NOT set setIsLoading(false) here. useEffect([token]).fetchUser.finally handles it.
        return response.data;
    } catch (error) {
       // ... (keep error handling) ...
        console.error('AuthContext: Login failed! Response Details:', error.response?.data || error.message);
        setIsLoading(false);
        setUser(null);
        setToken(null); // Trigger useEffect [token] to clear state fully
        throw error;
    }
  }, [apiClient, setToken, setUser, setIsLoading]); // Dependencies: apiClient, state setters


  // --- Logout Function (Keep existing) ---
  const logout = useCallback(async () => {
    console.log("AuthContext: Attempting logout.");
    setIsLoading(true); // Set context loading (optional)
    try {
        if (token) {
           await apiClient.post('/auth/logout/');
           console.log("AuthContext: Backend logout successful.");
        } else {
            console.log("AuthContext: No token found, skipping backend logout call.");
        }
    } catch (error) {
        console.error("AuthContext: Backend logout failed (ignored):", error.response?.data || error.message);
    } finally {
        // Always clear state and token on the frontend
        setUser(null);
        setToken(null); // This triggers useEffect [token] to clear storage/headers and set isLoading=false
        // setIsLoading(false); // Let useEffect handle final isLoading=false
        console.log("AuthContext: Frontend state cleared for logout.");
    }
    // Dependencies: apiClient for the post call, token to decide if to call backend
  }, [apiClient, token, setUser, setToken, setIsLoading]); // Dependencies


  const contextValue = {
    user,
    token,
    isLoading, // Context's loading state
    login,
    register,
    logout,
    checkAuthStatus, // Expose if manual refresh is needed

    isAuthenticated: !!user, // Derived state

    isSystemAdmin: !!user?.is_staff || !!user?.is_superuser,
    isOrgAdmin: user?.role === 'organization_admin',
    isCenterAdmin: user?.role === 'center_admin',
    isDonor: user?.role === 'donor',
    isIndividualRecipient: user?.role === 'individual',

    linkedOrganizationId: user?.linked_organization_id || null,
    linkedCenterId: user?.linked_center_id || null,
    profileId: user?.profile_id || null,

    apiClient, // Expose the apiClient
  };

  return (
    <AuthContext.Provider value={contextValue}>
       {/*
        Optionally render a full-page loading spinner here based on context.isLoading
        for the initial app load or when user data is being fetched.
        Alternatively, let ProtectedRoute handle the loading state for protected pages.
      */}
       {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;