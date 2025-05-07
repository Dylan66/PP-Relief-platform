// src/pages/Auth/RegisterPage.jsx

import React, { useEffect, useState } from 'react'; // Import useState
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import RegistrationForm from '../../components/Auth/RegistrationForm';
import OrganizationRegistrationForm from '../../components/Auth/OrganizationRegistrationForm'; // Import Organization form
import DonorRegistrationForm from '../../components/Auth/DonorRegistrationForm'; // Import Donor form
import useAuth from '../../hooks/useAuth'; // Import useAuth

const RegisterPage = () => {
  // Get the isAuthenticated state from AuthContext
  const { isAuthenticated, isLoading } = useAuth(); // Also get isLoading for safety
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Individual'); // To manage active tab

  // --- Effect to redirect if user becomes authenticated ---
  useEffect(() => {
    console.log("RegisterPage useEffect check auth state:", { isAuthenticated, isLoading });
    if (!isLoading && isAuthenticated) {
      console.log("RegisterPage: User is authenticated, redirecting to /dashboard.");
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // --- Effect to set active tab based on URL hash ---
  useEffect(() => {
    const hash = window.location.hash.substring(1); // Remove #
    if (hash === 'donor') {
      setActiveTab('Donor');
    } else if (hash === 'organization') {
      setActiveTab('Organization');
    } else if (hash === 'individual') {
      // Explicitly set for clarity, though it's the default
      setActiveTab('Individual');
    }
    // If hash is empty or doesn't match known tabs, 
    // activeTab remains its initial value ('Individual').
  }, []); // Empty dependency array: run once on mount

  // --- Render Logic ---
  // Optionally, you could show a loading state here if context is loading initially,
  // though ProtectedRoute should primarily handle this for protected routes.
  if (isLoading) {
      console.log("RegisterPage: Auth context is loading, showing loading indicator.");
      return <div style={styles.loadingContainer}>Loading...</div>; // Or a spinner component
  }

  // If not loading and not authenticated, render the registration page content
  console.log("RegisterPage: User is not authenticated or still loading, rendering appropriate form.");
  return (
    <div style={styles.pageContainer}>
      <div style={styles.logoContainer}>
        <img src="/company_hero_image.jpeg" alt="Her Ubuntu Logo" style={styles.logo} />
        <h1 style={styles.mainTitle}>HER UBUNTU</h1>
      </div>

      <div style={styles.tabContainer}>
        {['Individual', 'Organization', 'Donor'].map(tabName => (
          <button
            key={tabName}
            style={activeTab === tabName ? { ...styles.tabButton, ...styles.activeTabButton } : styles.tabButton}
            onClick={() => setActiveTab(tabName)}
          >
            {tabName}
          </button>
        ))}
      </div>

      <div style={styles.formWrapper}>
        {activeTab === 'Individual' && <RegistrationForm />}
        {activeTab === 'Organization' && <OrganizationRegistrationForm />}
        {activeTab === 'Donor' && <DonorRegistrationForm />}
      </div>

    </div>
  );
};

// Inline styles for RegisterPage
const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items to the top
    minHeight: '100vh',
    padding: '20px',
    boxSizing: 'border-box',
    backgroundColor: '#fff', // White background as per image
    fontFamily: '"Arial", sans-serif',
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '30px',
  },
  logo: {
    width: '150px', // Adjust as needed
    height: 'auto',
    marginBottom: '10px',
  },
  mainTitle: {
    fontSize: '2.5rem', // Large text for "HER UBUNTU"
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: '0.1em', // Letter spacing as in image
    margin: '0',
    // Simple black stroke - browser support varies
    textShadow: '-1px -1px 0 #E6A5E6, 1px -1px 0 #E6A5E6, -1px 1px 0 #E6A5E6, 1px 1px 0 #E6A5E6, -2px 0 0 #E6A5E6, 2px 0 0 #E6A5E6, 0 -2px 0 #E6A5E6, 0 2px 0 #E6A5E6', // Pinkish outline
  },
  tabContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '500px', // Align with form width if needed
    backgroundColor: '#FDF0FD', // Very light pink background for tabs section
    borderRadius: '8px',
    padding: '5px',
    marginBottom: '20px',
  },
  tabButton: {
    padding: '10px 20px',
    margin: '0 5px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#555',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'normal',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
  },
  activeTabButton: {
    fontWeight: 'bold',
    color: '#000',
    borderBottom: '2px solid #D973D9', // Pinkish underline for active tab
  },
  formWrapper: {
    width: '100%',
    maxWidth: '400px', // Should match RegistrationForm.formContainer.maxWidth
    backgroundColor: '#fff',
    // padding: '20px', // Padding is now inside the form components
    borderRadius: '8px',
    // boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Optional subtle shadow
  },
  placeholderTab: {
    padding: '20px',
    textAlign: 'center',
    color: '#777',
    fontSize: '1rem',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontSize: '1.5rem',
  },
};

export default RegisterPage;