// src/components/Common/Navbar.jsx
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
// import UserIcon from '../../assets/user-icon.svg'; // Add an SVG icon later

const Navbar = () => {
  const { isAuthenticated, user, userType, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    // Navigation is handled within logout function now
  };

  const getDashboardLink = () => {
    if (!userType) return "/"; // Fallback
    switch (userType) {
      case 'individual': return '/dashboard/individual';
      case 'organization': return '/dashboard/organization';
      case 'donor': return '/dashboard/donor';
      default: return '/';
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navBrand}>
        <Link to="/" style={styles.brandLink}>Her Ubuntu</Link>
      </div>
      <ul style={styles.navList}>
        <li style={styles.navItem}><NavLink to="/" style={({ isActive }) => (isActive ? styles.activeLink : styles.navLink)}>Home</NavLink></li>
        {/* Add other public links here if needed */}
        <li style={styles.navItem}><NavLink to="/metrics" style={({ isActive }) => (isActive ? styles.activeLink : styles.navLink)}>Impact</NavLink></li>
      </ul>
      <div style={styles.navAuth}>
        {isLoading ? (
          <span>Loading...</span>
        ) : isAuthenticated ? (
          <>
            <span style={styles.welcome}>Welcome, {user?.username || 'User'}!</span>
            <Link to={getDashboardLink()} style={styles.authLink}>Dashboard</Link>
            <button onClick={handleLogout} style={styles.authButton}>Logout</button>
          </>
        ) : (
          <>
            {/* Replace with actual icon later */}
            <Link to="/login" style={styles.authLink} title="Login/Register">
              {/* <img src={UserIcon} alt="Login/Register" style={{height: '24px'}} /> */}
              Login/Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

// Basic inline styles - replace with CSS modules or styled-components later
const styles = {
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#f8f8f8', borderBottom: '1px solid #eee' },
  navBrand: {},
  brandLink: { fontWeight: 'bold', color: '#d63384', textDecoration: 'none', fontSize: '1.5rem' },
  navList: { listStyle: 'none', display: 'flex', margin: 0, padding: 0, gap: '1.5rem' },
  navItem: {},
  navLink: { textDecoration: 'none', color: '#333' },
  activeLink: { textDecoration: 'none', color: '#d63384', fontWeight: 'bold' },
  navAuth: { display: 'flex', alignItems: 'center', gap: '1rem' },
  welcome: { marginRight: '1rem', fontStyle: 'italic' },
  authLink: { textDecoration: 'none', color: '#007bff', padding: '0.3rem 0.6rem' },
  authButton: { cursor: 'pointer', background: '#dc3545', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px' }
};

export default Navbar;