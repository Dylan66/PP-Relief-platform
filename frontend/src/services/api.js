// frontend/src/services/api.js

import axios from 'axios';

// Determine the base URL from environment variables
// For production, Vercel will provide VITE_API_BASE_URL.
// For local development, if VITE_API_BASE_URL is not set in .env.local,
// it will fall back to '/api' to use the Vite proxy.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include credentials for CORS
});

// === Add Authentication Token Interceptor ===
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Or get token from auth context
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// === API Functions ===

// --- Auth ---
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login/', credentials);
    if (response.data && response.data.key) {
      localStorage.setItem('authToken', response.data.key);
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/auth/registration/', userData);
    if (response.data && response.data.key) {
      localStorage.setItem('authToken', response.data.key);
    }
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await apiClient.post('/auth/logout/');
    localStorage.removeItem('authToken');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    // Still remove the token even if the API call fails
   localStorage.removeItem('authToken');
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
  const token = localStorage.getItem('authToken');
    if (!token) return null;
    
    const response = await apiClient.get('/auth/user/');
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    // If unauthorized (401), clear the token
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
    }
    throw error;
  }
};

// --- Product Requests ---
export const createProductRequest = async (requestData) => {
  try {
    const response = await apiClient.post('/product-requests/', requestData);
    return response.data;
  } catch (error) {
    console.error('Create product request error:', error);
    throw error;
  }
};

// --- Product Types ---
export const getProductTypes = async () => {
  try {
    const response = await apiClient.get('/product-types/');
    return response.data;
  } catch (error) {
    console.error('Get product types error:', error);
    throw error;
  }
};

// --- Add other API functions as needed ---
// e.g., getRequests, getInventory, updateInventory, etc.

export default apiClient; // Export the configured instance if needed elsewhere