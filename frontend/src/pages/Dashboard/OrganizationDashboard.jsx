// src/pages/Dashboard/OrganizationDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// import useAuth from '../../hooks/useAuth'; // Uncomment if you need user info here, e.g., for a personalized welcome

const OrganizationDashboard = () => {
  // const { user } = useAuth(); // Example: Get user info

  // Basic inline styles - consider moving to a CSS file for larger applications
  const styles = {
    dashboardContainer: {
      padding: '20px 30px',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      maxWidth: '960px',
      margin: '20px auto', // Added top/bottom margin
      backgroundColor: '#fff', // White background for the card
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Soft shadow for depth
    },
    header: {
      fontSize: 'clamp(1.8em, 3vw, 2.4em)',
      color: '#2c3e50', // Dark blue-grey
      marginBottom: '20px',
      borderBottom: '2px solid #eaeaea',
      paddingBottom: '10px',
    },
    welcomeMessage: {
      fontSize: '1.1em',
      color: '#555',
      marginBottom: '30px',
      lineHeight: '1.6',
    },
    nav: {
      marginBottom: '30px',
    },
    navList: {
      listStyle: 'none',
      padding: 0,
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap', // Allow wrapping on smaller screens
      justifyContent: 'center', // Center links if they wrap
    },
    navItem: {
      // Styles can be applied directly to Link if preferred
    },
    navLink: {
      display: 'inline-block',
      padding: '12px 22px',
      textDecoration: 'none',
      color: '#fff',
      backgroundColor: '#5A4CAD', // Theme purple (from DonationsPage)
      borderRadius: '6px',
      fontSize: '1em',
      fontWeight: '500',
      textAlign: 'center',
      transition: 'background-color 0.2s ease, transform 0.1s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      minWidth: '180px', // Ensure buttons have a decent width
    },
    contentArea: {
      marginTop: '20px',
      padding: '25px',
      backgroundColor: '#f8f9fa', // Light grey background for content within the card
      borderRadius: '8px',
      // boxShadow: '0 1px 3px rgba(0,0,0,0.05)', // Optional inner shadow
    }
  };
  
  // Simple JS-based hover effect for inline styles
  const applyHover = (e, hover) => {
    e.currentTarget.style.backgroundColor = hover ? '#483D8B' : '#5A4CAD';
    e.currentTarget.style.transform = hover ? 'scale(1.03)' : 'scale(1)';
  };

  return (
    <div style={styles.dashboardContainer}>
      <h1 style={styles.header}>Organization Dashboard</h1>
      <p style={styles.welcomeMessage}>
        {/* Example: Welcome, {user?.profile?.organization_name || user?.username}! */}
        Welcome! From here, you can explore our services tailored for organizations, 
        request products for your community, book informative talks or workshops, and discover volunteering opportunities.
      </p>
      
      <nav style={styles.nav}>
        <ul style={styles.navList}>
          {/* We can re-add a link to RequestFormOrg if needed, e.g., /dashboard/organization/request-products */}
          {/* For now, focusing on the new pages */}
          <li style={styles.navItem}>
            <Link 
              to="/dashboard/organization/services" 
              style={styles.navLink} 
              onMouseOver={(e) => applyHover(e, true)}
              onMouseOut={(e) => applyHover(e, false)}
            >
              Our Services
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link 
              to="/dashboard/organization/book-talk" 
              style={styles.navLink}
              onMouseOver={(e) => applyHover(e, true)}
              onMouseOut={(e) => applyHover(e, false)}
            >
              Book a Talk/Workshop
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link 
              to="/dashboard/organization/volunteer" 
              style={styles.navLink}
              onMouseOver={(e) => applyHover(e, true)}
              onMouseOut={(e) => applyHover(e, false)}
            >
              Volunteer Activities
            </Link>
          </li>
          {/* Add more links as needed, e.g., for product requests specifically */}
        </ul>
      </nav>

      <div style={styles.contentArea}>
        <h2>Quick Access</h2>
        <p>This area can feature key information, alerts, or quick stats relevant to your organization. You can also add a direct link here to request products if that's a primary action.</p>
        {/* Consider adding a prominent button/link here for product requests if it was removed from the main view */}
      </div>
    </div>
  );
};

export default OrganizationDashboard;