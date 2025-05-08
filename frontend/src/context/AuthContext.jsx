// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext(undefined);

// Determine the base URL from environment variables for AuthContext's apiClient
const AUTH_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Keep apiClient setup as it might be imported elsewhere, but its calls will be disabled
const apiClient = axios.create({
  baseURL: AUTH_API_BASE_URL, // Use the environment variable
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

apiClient.interceptors.request.use(
    (config) => {
        const csrfToken = Cookies.get('csrftoken');
        if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method)) {
            config.headers['X-CSRFToken'] = csrfToken;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Start with null, checkAuthStatus will populate from localStorage
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialAuthCheckDone, setIsInitialAuthCheckDone] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get location

  const fetchCsrfCookie = useCallback(async () => {
      console.log("AuthContext: Attempting to fetch CSRF cookie...");
      try {
           await apiClient.get('/csrf/');
           console.log("AuthContext: CSRF cookie fetched/set.");
      } catch (error) {
           console.error("AuthContext: Failed to fetch CSRF cookie:", error);
      }
  }, [apiClient]);

  const fetchUser = useCallback(async () => {
    console.log("AuthContext: fetchUser - ACTUAL called.");
    if (!apiClient.defaults.headers.common['Authorization']) {
      console.log("AuthContext: fetchUser - No auth header...");
      setUser(null); setIsLoading(false);
      if (!isInitialAuthCheckDone) setIsInitialAuthCheckDone(true);
       return;
     }
    console.log("AuthContext: fetchUser - Token exists, attempting fetch...");
    setIsLoading(true);
    try {
      const response = await apiClient.get('/auth/user/');
      setUser(response.data);
    } catch (error) {
      console.error('AuthContext: Failed fetch user:', error);
      setUser(null); setToken(null); 
    } finally {
      setIsLoading(false);
      if (!isInitialAuthCheckDone) setIsInitialAuthCheckDone(true);
    }
  }, [apiClient, setToken, setUser, setIsLoading, isInitialAuthCheckDone]);

  useEffect(() => { // Token effect
    if (token) {
      localStorage.setItem('authToken', token);
      apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;
       fetchUser();
    } else {
      localStorage.removeItem('authToken');
      delete apiClient.defaults.headers.common['Authorization'];
       setUser(null);
      setIsLoading(false); 
      if (!isInitialAuthCheckDone) setIsInitialAuthCheckDone(true);
    }
  }, [token, apiClient, fetchUser, setUser, setIsLoading, isInitialAuthCheckDone]);

   const checkAuthStatus = useCallback(async () => {
    const currentToken = localStorage.getItem('authToken');
    if (currentToken) setToken(currentToken);
    else { setUser(null); setToken(null); setIsInitialAuthCheckDone(true); setIsLoading(false); }
  }, [setToken, setUser, setIsLoading]);

  useEffect(() => { // Initial effect
    setIsLoading(true);
    fetchCsrfCookie().finally(() => checkAuthStatus());
  }, [fetchCsrfCookie, checkAuthStatus]);

  const register = useCallback(async (userData, role) => { 
    console.log('AuthContext: ACTUAL register called...');
    setIsLoading(true);
    try {
      const backendData = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        password2: userData.password2,
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        phone_number: userData.phone_number || '',
        role: role,
      };
      const response = await apiClient.post('/auth/registration/', backendData);
      if (response.data.key) {
         setToken(response.data.key); // Triggers user fetch and navigation effect
      } else {
         setIsLoading(false); 
         navigate('/login'); // RE-ENABLE navigate for no-token case
      }
      return response.data;
    } catch (error) {
        console.error('AuthContext: Registration failed:', error);
        setIsLoading(false);
        throw error;
    }
  }, [apiClient, setToken, setIsLoading, navigate]); // RE-ENABLE navigate dependency

  const login = useCallback(async (credentials) => {
    console.log("AuthContext: ACTUAL login called.");
    setIsLoading(true);
    try {
        const response = await apiClient.post('/auth/login/', credentials);
        if (response.data.key) {
          setToken(response.data.key); // Triggers token effect -> fetchUser -> nav effect
        } else {
          // Should not happen with dj-rest-auth login unless customized
          setIsLoading(false);
          throw new Error("Login response did not include a token.");
        }
        return response.data; // Return full response if needed
    } catch (error) {
        console.error('AuthContext: Login failed:', error);
        setIsLoading(false); // Ensure loading is false on error
        setUser(null);     // Clear user state
        setToken(null);    // Clear token state
        throw error;       // Re-throw for the form to handle
    }
  }, [apiClient, setToken, setUser, setIsLoading]); // Dependencies

  const logout = useCallback(async () => {
    console.log("AuthContext: ACTUAL logout called.");
    // Indicate loading if desired, though logout is usually quick
    // setIsLoading(true); 
    try {
        if (token) {
           // Optimistically clear state before API call for faster UI response
           setUser(null);
           setToken(null); 
           navigate('/login', { replace: true }); // Navigate immediately
           await apiClient.post('/auth/logout/');
           console.log("AuthContext: Backend logout successful.");
        } else {
           // If no token, just ensure state is clear and navigate
           setUser(null);
           setToken(null); 
           navigate('/login', { replace: true });
        }
    } catch (error) {
        console.error("AuthContext: Backend logout failed (ignored):", error);
        // Frontend state is already cleared, navigation already happened
    } finally {
        // Ensure loading state is false if it was set
        // setIsLoading(false);
    }
  }, [apiClient, token, setUser, setToken, navigate]); // RE-ENABLE navigate dependency

  // --- Effect for Role-Based Navigation (REVISED LOGIC) ---
  useEffect(() => {
    const currentPath = location.pathname; // Get current path from location object
    console.log('AuthContext NavEffect (REVISED): ', { path: currentPath, userRole: user?.role, isAuthenticated: !!user, isLoading, isInitialAuthCheckDone });

    if (typeof navigate !== 'function') {
      console.warn("AuthContext NavEffect: navigate function not available.");
      return;
    }

    // Conditions for attempting initial redirect:
    if (isInitialAuthCheckDone && !isLoading && user) {
      let targetPath = '/dashboard'; // Default fallback
      if (user.role === 'individual') targetPath = '/product-request';
      else if (user.role === 'organization_admin') targetPath = '/organization-services';
      else if (user.role === 'donor') targetPath = '/donations';
      else if (user.role === 'center_admin') targetPath = '/dashboard';
      else console.warn(`AuthContext NavEffect: Unknown user role '${user.role}'`);

      // Paths we ALWAYS redirect FROM if authenticated and not already at the target
      const redirectFromPaths = ['/login', '/register', '/']; // Add other public paths if needed

      if (redirectFromPaths.includes(currentPath) && currentPath !== targetPath) {
        console.log(`AuthContext NavEffect: User authenticated (Role: ${user.role}). Current path (${currentPath}) requires initial redirect. Navigating to ${targetPath}...`);
        navigate(targetPath, { replace: true });
      } else {
        // If already authenticated and NOT on a 'redirectFrom' path, do nothing.
        console.log(`AuthContext NavEffect: User authenticated. Current path (${currentPath}) does not require initial redirect. No automatic navigation.`);
      }
    } else {
      console.log("AuthContext NavEffect: Conditions NOT met for navigation check (InitialCheckDone, !isLoading, user).");
    }
  // Depend on user, location.pathname, isLoading, isInitialAuthCheckDone, navigate
  }, [user, location.pathname, isLoading, isInitialAuthCheckDone, navigate]); // Added location.pathname dependency

  const contextValue = {
    user, token, isLoading, isInitialAuthCheckDone, 
    login, // ACTUAL
    register, // ACTUAL
    logout, // ACTUAL
    checkAuthStatus, // Actual
    fetchUser, // Actual
    isAuthenticated: !!user, 
    isSystemAdmin: !!user?.is_staff || !!user?.is_superuser,
    isOrgAdmin: user?.role === 'organization_admin',
    isCenterAdmin: user?.role === 'center_admin',
    isDonor: user?.role === 'donor',
    isIndividualRecipient: user?.role === 'individual',
    linkedOrganizationId: user?.linked_organization_id || null,
    linkedCenterId: user?.linked_center_id || null,
    profileId: user?.profile_id || null,
    apiClient, 
  };

  console.log("AuthProvider rendering. isLoading:", isLoading, "isInitialAuthCheckDone:", isInitialAuthCheckDone, "Token:", token, "User:", user?.username);
  return (
    <AuthContext.Provider value={contextValue}>
       {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;