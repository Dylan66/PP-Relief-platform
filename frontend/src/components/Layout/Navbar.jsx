// src/components/Layout/Navbar.jsx (Create this file if it doesn't exist)

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'; // Import the hook

const Navbar = () => {
  const { user, logout } = useAuth(); // Get user state and logout function
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function from context
      navigate('/'); // Redirect to home page after successful logout
      console.log("Logout successful, navigated home.");
    } catch (error) {
      // Handle potential errors during logout (though context logout is robust)
      console.error("Error during logout:", error);
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navBrand}>
        <Link to="/" style={styles.navLink}>Period Relief</Link>
      </div>
      <ul style={styles.navList}>
        {user ? (
          // --- Logged In User Links ---
          <>
            <li style={styles.navItem}>
              {/* Link to a future dashboard */}
              <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
            </li>
             <li style={styles.navItem}>
               {/* Display username - consider adding a profile link later */}
              <span style={styles.navText}>Welcome, {user.username}!</span>
            </li>
            <li style={styles.navItem}>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
              </button>
            </li>
          </>
        ) : (
          // --- Logged Out User Links ---
          <>
            <li style={styles.navItem}>
              <Link to="/login" style={styles.navLink}>Login</Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/register" style={styles.navLink}>Register</Link>
            </li>
          </>
        )}
         {/* Add other common links like 'About', 'Donate' etc. here if needed */}
         <li style={styles.navItem}>
             <Link to="/about" style={styles.navLink}>About</Link>
         </li>
      </ul>
    </nav>
  );
};

// --- Basic Styles --- (Consider CSS Modules or a UI library later)
const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.8rem 2rem',
    backgroundColor: '#f8f9fa', // Light background
    borderBottom: '1px solid #dee2e6',
    color: '#333',
  },
  navBrand: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  navList: {
    listStyle: 'none',
    display: 'flex',
    alignItems: 'center',
    margin: 0,
    padding: 0,
  },
  navItem: {
    marginLeft: '1.5rem',
  },
  navLink: {
    textDecoration: 'none',
    color: '#007bff', // Blue links
    transition: 'color 0.2s ease-in-out',
  },
  navLinkHover: { // Add hover effect later if needed
     color: '#0056b3',
  },
  navText: {
      color: '#6c757d', // Grey text for welcome message
      marginRight: '1rem', // Space before logout button
  },
  logoutButton: {
    padding: '0.4rem 0.8rem',
    backgroundColor: '#dc3545', // Red logout button
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s ease-in-out',
  },
  logoutButtonHover: { // Add hover effect later
      backgroundColor: '#c82333',
  }
};


export default Navbar;