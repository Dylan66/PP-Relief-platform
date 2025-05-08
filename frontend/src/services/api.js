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

// === Placeholder API Functions ===
// You will replace these with actual API calls

// --- Auth ---
export const loginUser = async (credentials) => {
  console.log("API Call: loginUser", credentials);
  // Example: const response = await apiClient.post('/auth/login/', credentials);
  // return response.data;
  // Placeholder: Simulate successful login returning a token
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  const fakeToken = 'fake_auth_token_' + Date.now();
  const fakeUser = { id: 1, username: credentials.username, email: 'user@example.com' };
  localStorage.setItem('authToken', fakeToken); // Store token locally for now
  return { key: fakeToken, user: fakeUser }; // Simulate dj-rest-auth response structure
};

export const registerUser = async (userData) => {
  console.log("API Call: registerUser", userData);
  // Example: const response = await apiClient.post('/auth/registration/', userData);
  // return response.data;
   // Placeholder: Simulate successful registration
  await new Promise(resolve => setTimeout(resolve, 500));
  const fakeToken = 'fake_reg_token_' + Date.now();
  const fakeUser = { id: 2, username: userData.username, email: userData.email };
   localStorage.setItem('authToken', fakeToken);
  return { key: fakeToken, user: fakeUser }; // Simulate response
};

export const logoutUser = async () => {
  console.log("API Call: logoutUser");
   // Example: await apiClient.post('/auth/logout/');
   // Placeholder: Clear local token
   localStorage.removeItem('authToken');
  await new Promise(resolve => setTimeout(resolve, 200));
  return { detail: "Successfully logged out." }; // Simulate response
};

export const getCurrentUser = async () => {
  console.log("API Call: getCurrentUser");
  const token = localStorage.getItem('authToken');
  if (!token) return null; // No token, no user

  // Example: const response = await apiClient.get('/auth/user/');
  // return response.data;
  // Placeholder: Return a fake user if token exists
  await new Promise(resolve => setTimeout(resolve, 300));
  return { id: 1, username: 'testuser', email: 'user@example.com', first_name: '', last_name: '' };
};

// --- Product Requests ---
export const createProductRequest = async (requestData) => {
    console.log("API Call: createProductRequest", requestData);
    // Example: const response = await apiClient.post('/product-requests/', requestData);
    // return response.data;
    await new Promise(resolve => setTimeout(resolve, 500));
    // Simulate response
    return {
        id: Date.now(),
        product_type: requestData.product_type,
        product_type_name: "Pads (Simulated)",
        quantity: requestData.quantity,
        status: "Pending",
        created_at: new Date().toISOString(),
        ...requestData // Include other fields passed in
    };
};

// --- Product Types (Example - needed for forms) ---
export const getProductTypes = async () => {
    console.log("API Call: getProductTypes");
    // Example: const response = await apiClient.get('/product-types/');
    // return response.data;
    await new Promise(resolve => setTimeout(resolve, 300));
    // Simulate response
    return [
        { id: 1, name: "Sanitary Pads (Regular)", description: "" },
        { id: 2, name: "Sanitary Pads (Maxi)", description: "" },
        { id: 3, name: "Tampons (Regular)", description: "" },
    ];
};


// --- Add other API functions as needed ---
// e.g., getRequests, getInventory, updateInventory, etc.

export default apiClient; // Export the configured instance if needed elsewhere