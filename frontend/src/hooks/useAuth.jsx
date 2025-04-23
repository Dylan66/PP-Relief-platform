// src/hooks/useAuth.jsx

import { useContext } from 'react';
import AuthContext from '../context/AuthContext'; // Import the actual context

const useAuth = () => {
  const context = useContext(AuthContext); // Use the context
  if (context === undefined) { // Check if used outside provider
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context; // Return the real context value
};

export default useAuth;