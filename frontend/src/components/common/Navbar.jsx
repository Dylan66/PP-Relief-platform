// src/components/common/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for internal navigation
import useAuth from '../../hooks/useAuth'; // Import useAuth to check authentication status
import { FaUser } from 'react-icons/fa'; // Import the user icon

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
          {/* === New Public Navigation Links === */}
          {/* These links are visible to all users */}
           <Link to="/" className={styles.navLink}>Home</Link> {/* Link to the homepage */}
           <Link to="/about" className={styles.navLink}>About Us</Link> {/* Link to an About Us page (needs route/component) */}
           <Link to="/information" className={styles.navLink}>Learn More</Link> {/* Updated Link to Information page */}
           <Link to="/receive" className={styles.navLink}>Receive Products</Link> {/* Link to Receive Products info/form page (needs route/component) */}
           <Link to="/donate" className={styles.navLink}>Donate Now</Link> {/* Link to Donate page (needs route/component) */}
          {/* === End New Public Links === */}
        </div>

        {/* Authentication Links/User Area - Pushed to the right */} 
        <div className={styles.navbarAuth}>
          {isAuthenticated ? (
            <>
              {/* Logged-in view: Icon, Welcome message, Dashboard, Logout */}
              <span className={styles.navbarText}>
                <FaUser className={styles.authIcon} /> Welcome, {username}!
              </span>
              <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>
              <button onClick={logout} className={styles.navButton}>Logout</button>
            </>
          ) : (
            <>
              {/* Logged-out view: Icon, Login link */}
              <Link to="/login" className={styles.navLink}>
                <FaUser className={styles.authIcon} /> Login
              </Link>
            </>
          )}
        </div>
        {/* === End Authentication Links === */}

      </div>
    </nav>
  );
};

export default Navbar;