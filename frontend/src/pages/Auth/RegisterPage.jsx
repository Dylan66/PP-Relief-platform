// src/pages/Auth/RegisterPage.jsx

import React, { useEffect } from 'react'; // Import useEffect
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import RegistrationForm from '../../components/Auth/RegistrationForm';
import useAuth from '../../hooks/useAuth'; // Import useAuth

const RegisterPage = () => {
  // Get the isAuthenticated state from AuthContext
  const { isAuthenticated, isLoading } = useAuth(); // Also get isLoading for safety
  const navigate = useNavigate();

  // --- Effect to redirect if user becomes authenticated ---
  // This useEffect will run when the component mounts and whenever isAuthenticated or isLoading changes.
  useEffect(() => {
     // Check if the user is authenticated and loading is false (meaning the auth check is complete)
    console.log("RegisterPage useEffect check auth state:", { isAuthenticated, isLoading });
    if (!isLoading && isAuthenticated) {
      console.log("RegisterPage: User is authenticated, redirecting to /dashboard.");
      // Redirect to the dashboard.
      // Use replace: true so the user can't navigate back to the registration page
      // using the browser's back button after being redirected.
      navigate('/dashboard', { replace: true });
    }
    // Dependencies: Re-run this effect if isAuthenticated or isLoading changes
  }, [isAuthenticated, isLoading, navigate]); // include navigate as dependency for best practice


  // --- Render Logic ---
  // Optionally, you could show a loading state here if context is loading initially,
  // though ProtectedRoute should primarily handle this for protected routes.
  if (isLoading) {
      console.log("RegisterPage: Auth context is loading, showing loading indicator.");
      return <div>Loading...</div>; // Or a spinner component
  }

  // If not loading and not authenticated, render the registration form
  // The useEffect above will handle the redirect if isAuthenticated becomes true.
  console.log("RegisterPage: User is not authenticated or still loading, rendering Registration Form.");
  return (
    <div>
      {/* You might add a title or other content specific to the RegisterPage */}
      {/* <h1>Register for an Account</h1> */}
      <RegistrationForm />
    </div>
  );
};

export default RegisterPage;