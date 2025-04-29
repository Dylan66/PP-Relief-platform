// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(undefined);

const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
      apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;
    } else {
      localStorage.removeItem('authToken');
      delete apiClient.defaults.headers.common['Authorization'];
    }
    checkAuthStatus();
  }, [token]);

  const fetchUser = useCallback(async () => {
    if (!apiClient.defaults.headers.common['Authorization']) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await apiClient.get('/auth/user/');
      setUser(response.data);
    } catch (error) {
      console.error('Fetch user failed:', error.response?.data || error.message);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkAuthStatus = useCallback(async () => {
    const currentToken = localStorage.getItem('authToken');
    if (currentToken) {
      if (!apiClient.defaults.headers.common['Authorization']) {
        apiClient.defaults.headers.common['Authorization'] = `Token ${currentToken}`;
      }
      await fetchUser();
    } else {
      setUser(null);
      setIsLoading(false);
    }
  }, [fetchUser]);

  useEffect(() => {
    setIsLoading(true);
    checkAuthStatus();
  }, [checkAuthStatus]);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    try {
      const backendData = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        password2: userData.password2,
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
      };
      const response = await apiClient.post('/auth/registration/', backendData);
      if (response.data.key) {
        setToken(response.data.key);
      } else {
        setIsLoading(false);
      }
      return response.data;
    } catch (error) {
      let errorDetails = error.response?.data || error.message;
      if (error.response?.data) {
        try {
          errorDetails = Object.entries(error.response.data).map(([key, value]) => {
            let displayKey = key.replace(/_/g, ' ');
            if (key === 'password') displayKey = 'password';
            else if (key === 'password') displayKey = 'password';
            else if (key === 'password2') displayKey = 'confirm password';
            else if (key === 'non_field_errors') displayKey = 'Error';
            const message = Array.isArray(value) ? value.join(', ') : String(value);
            return `${displayKey.charAt(0).toUpperCase() + displayKey.slice(1)}: ${message}`;
          }).join('\n');
        } catch (formatError) {
          errorDetails = JSON.stringify(error.response.data);
        }
      }
      console.error('Registration failed:', errorDetails);
      setIsLoading(false);
      throw error;
    }
  }, []);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/login/', credentials);
      if (response.data.key) {
        setToken(response.data.key);
      }
      return response.data;
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      setIsLoading(false);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiClient.post('/auth/logout/');
    } catch (error) {
      console.error('Logout error (ignored):', error);
    } finally {
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
