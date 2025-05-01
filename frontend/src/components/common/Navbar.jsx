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

          {/* === New Public Navigation Links === */}
          {/* These links are visible to all users */}
           <Link to="/" className={styles.navLink}>Home</Link> {/* Link to the homepage */}
           <Link to="/about" className={styles.navLink}>About Us</Link> {/* Link to an About Us page (needs route/component) */}
           <Link to="/learn" className={styles.navLink}>Learn More</Link> {/* Link to Learn More/Education page (needs route/component) */}
           <Link to="/receive" className={styles.navLink}>Receive Products</Link> {/* Link to Receive Products info/form page (needs route/component) */}
           <Link to="/donate" className={styles.navLink}>Donate Now</Link> {/* Link to Donate page (needs route/component) */}
          {/* === End New Public Links === */}

          {/* Add a separator if desired */}
          {/* <span className={styles.separator}>|</span> */}


          {/* === Authentication Links (Conditional) === */}
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
               {/* Removed Register link from Navbar as requested */}
            </>
          )}
          {/* === End Authentication Links === */}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;