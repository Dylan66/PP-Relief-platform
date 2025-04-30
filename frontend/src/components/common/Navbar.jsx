// src/components/common/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for internal navigation
import useAuth from '../../hooks/useAuth'; // Import useAuth to check authentication status

import styles from './Navbar.module.css'; // Import CSS Modules

const Navbar = () => {
  // Get auth state and logout function from your AuthContext via useAuth
  const { isAuthenticated, logout, user } = useAuth();

  // Get the user's username if available for the greeting
  const username = user?.username || '';

  return (
    <nav className={styles.navbar}> {/* Apply navbar styles */}
      <div className={styles.navbarContainer}> {/* Container for content */}
        {/* Site Title or Logo - Links to Home */}
        <Link to="/" className={styles.navbarBrand}>
          Her Ubuntu Platform
        </Link>

        {/* Navigation Links */}
        <div className={styles.navbarNav}>
          {isAuthenticated ? (
            <>
              {/* Links when logged in */}
              <span className={styles.navbarText}>Welcome, {username}!</span> {/* Optional: Display username */}
              {/* Changed to just 'Dashboard' as requested */}
              <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>
              {/* Use a button for logout, as it performs an action, not just navigates */}
              {/* Use onClick to call the logout function */}
              <button onClick={logout} className={styles.navButton}>Logout</button> {/* Apply button styles */}
            </>
          ) : (
            <>
              {/* Link when logged out - Changed to just 'Login' */}
              <Link to="/login" className={styles.navLink}>Login</Link>
               {/* Removed Register link as requested */}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;