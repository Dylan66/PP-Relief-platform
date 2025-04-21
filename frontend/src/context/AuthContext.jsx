// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../services/api'; // Ensure this path is correct

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores user data object from API
  const [token, setToken] = useState(localStorage.getItem('authToken')); // Stores the auth token string
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken')); // Boolean flag
  const [isLoading, setIsLoading] = useState(true); // Tracks initial loading and async operations
  const [userType, setUserType] = useState(null); // 'individual', 'organization', 'donor', or null
  const navigate = useNavigate();

  // --- Fetch User Data ---
  // useCallback is used here to prevent the function identity from changing on every render,
  // which could cause unnecessary re-runs of the useEffect hook.
  const fetchUser = useCallback(async () => {
    if (token) {
      console.log("AuthContext: Token found, attempting to fetch user...");
      try {
        // Ensure token is correctly stored before API call (just in case)
        localStorage.setItem('authToken', token);
        const response = await getCurrentUser(); // API call using the token (via interceptor)

        if (response.data) {
          setUser(response.data);

          // --- IMPORTANT: Determine user type ---
          // Adjust this logic based on the actual field returned by your /api/auth/user/ endpoint.
          // Example: Check for a specific field like 'profile_type' or 'is_organization' etc.
          let determinedType = 'individual'; // Default assumption
          if (response.data.user_type) { // Assuming your UserSerializer includes 'user_type'
             determinedType = response.data.user_type;
          } else if (response.data.organization_profile) { // Alternative: check if relation exists
             determinedType = 'organization';
          } // Add checks for 'donor' if applicable
          // --- End of User Type Determination ---

          setUserType(determinedType);
          setIsAuthenticated(true);
          console.log("AuthContext: User fetched successfully:", response.data, "Type:", determinedType);
        } else {
           // Handle case where API returns success but no data (unlikely but possible)
           throw new Error("No user data received");
        }

      } catch (error) {
        // Handle errors like invalid token, network issues, API errors
        console.error("AuthContext: Failed to fetch user or token invalid:", error.response?.data || error.message);
        // Clear invalid token and user state
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
        setUserType(null);
        setIsAuthenticated(false);
      }
    } else {
      // No token found, ensure user is logged out state
      console.log("AuthContext: No token found.");
      setUser(null);
      setUserType(null);
      setIsAuthenticated(false);
    }
    // Finished initial check or fetch attempt
    setIsLoading(false);
  }, [token]); // Dependency: Re-run this function only if the token changes

  // --- Effect to Fetch User on Load or Token Change ---
  useEffect(() => {
    console.log("AuthContext: useEffect triggered to fetch user.");
    fetchUser();
  }, [fetchUser]); // Run fetchUser whenever its identity changes (which happens when `token` changes)

  // --- Login Function ---
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await loginUser(credentials);
      const newToken = response.data.key; // dj-rest-auth default token key name
      if (!newToken) {
        throw new Error("Login response did not include a token key.");
      }
      console.log("AuthContext: Login successful, received token.");
      setToken(newToken); // Update token state -> This triggers the useEffect -> fetchUser runs
      // No need to set isLoading false here, fetchUser will do it.
      // Navigation should happen based on ProtectedRoute logic after state updates.
    } catch (error) {
      console.error("AuthContext: Login failed:", error.response?.data || error.message);
      setIsLoading(false); // Stop loading on login failure
      throw error; // Re-throw the error so the LoginForm can display feedback
    }
  };

  // --- Register Function ---
  const register = async (userData) => {
    setIsLoading(true);
    try {
      // Assuming backend registration returns user details + token, or just confirmation.
      // Adjust based on your dj-rest-auth + custom serializer setup.
      console.log("AuthContext: Attempting registration with data:", userData);
      const response = await registerUser(userData);

      // Option A: Registration returns token directly (e.g., if using dj_rest_auth.registration with custom serializer)
      if (response.data.key) {
          const newToken = response.data.key;
          console.log("AuthContext: Registration successful, token received.");
          setToken(newToken); // Triggers useEffect -> fetchUser
      }
      // Option B: Registration doesn't return token (e.g., email verification enabled, or default setup)
      // In this case, we might need to log the user in immediately after successful registration.
      else {
         console.log("AuthContext: Registration successful (no token returned), attempting automatic login...");
         // Ensure you have username and password from the registration data
         if(userData.username && userData.password) {
            await login({ username: userData.username, password: userData.password });
         } else {
            console.warn("AuthContext: Cannot auto-login after registration - missing credentials.");
            setIsLoading(false); // Need to stop loading if we can't proceed
         }
      }
      // Again, let fetchUser handle setting isLoading false after user data is retrieved.
    } catch (error) {
      console.error("AuthContext: Registration failed:", error.response?.data || error.message);
      setIsLoading(false); // Stop loading on registration failure
      throw error; // Re-throw so the RegistrationForm can display feedback
    }
  };

  // --- Logout Function ---
  const logout = async () => {
    console.log("AuthContext: Logging out...");
    setIsLoading(true); // Indicate activity
    try {
      // Attempt to invalidate token on the backend (best practice)
      if (token) { // Only call if token exists
         await logoutUser();
         console.log("AuthContext: Backend logout successful.");
      }
    } catch (error) {
      // Log backend error but proceed with client-side logout regardless
      console.error("AuthContext: Backend logout failed (proceeding with client logout):", error.response?.data || error.message);
    } finally {
      // Always perform client-side cleanup
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      setUserType(null);
      setIsAuthenticated(false);
      setIsLoading(false); // Finished logout process
      console.log("AuthContext: Client-side logout complete.");
      navigate('/login'); // Redirect to login page after logout
    }
  };

  // 3. Provide the Context Value
  const contextValue = {
    user,
    token,
    isAuthenticated,
    isLoading,
    userType,
    login,
    register,
    logout,
    fetchUser // Expose fetchUser if manual refresh is needed elsewhere
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Export the Context itself as Default (for use in useAuth hook)
export default AuthContext;