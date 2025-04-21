// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // Use auth to show different CTA maybe

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <section style={styles.hero}>
        <h1>Welcome to Her Ubuntu</h1>
        <p>Empowering women and girls by ensuring access to essential menstrual products and health education.</p>
        {/* Add more mission/vision text */}
        <p>We connect individuals and organizations in need with donors and distribution centers, fostering a community of support and dignity.</p>
        {!isAuthenticated && (
          <Link to="/register" style={styles.ctaButton}>Join Us / Get Help</Link>
        )}
        {isAuthenticated && (
          <Link to="/dashboard" style={styles.ctaButton}>Go to Dashboard</Link> // Link to correct dashboard handled by Navbar/ProtectedRoute
        )}
      </section>

      <section style={styles.infoSection}>
        <h2>Our Mission</h2>
        <p>To eradicate period poverty through accessible distribution, comprehensive education, and community support.</p>
        <h2>Our Vision</h2>
        <p>A world where menstruation is not a barrier to education, health, or opportunity for any woman or girl.</p>
      </section>

      {/* Removed embedded registration form - use CTA button */}
      <section style={styles.infoSection}>
         <h2>How It Works</h2>
        <p>[Explain the process: Request via Web/SMS &gt; Match &gt; Pickup &gt; Support]</p>         <h2>Get Involved</h2>
         <p>Whether you need support, want to donate products or funds, or volunteer your time, Her Ubuntu provides a platform to make a difference.</p>
          {!isAuthenticated && (
             <p>Ready to participate? <Link to="/register">Register Now</Link> or <Link to="/login">Login</Link>.</p>
          )}
      </section>
       {/* Add sections for Educational Resources links if desired */}

    </div>
  );
};

// Basic styles
const styles = {
  hero: { textAlign: 'center', padding: '3rem 1rem', background: '#fce4ec', borderRadius: '8px', marginBottom: '2rem' },
  ctaButton: { display: 'inline-block', marginTop: '1rem', padding: '0.8rem 1.5rem', background: '#d63384', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' },
  infoSection: { margin: '2rem 0', padding: '1.5rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
};

export default HomePage;