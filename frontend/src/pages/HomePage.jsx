// src/pages/HomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // Use auth to show different CTA maybe

import styles from './HomePage.module.css'; // Import CSS Modules

const HomePage = () => {
  const { isAuthenticated } = useAuth(); // Get auth state

  return (
    // Apply container style to the main div
    <div className={styles.homePageContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}> {/* Apply hero styles */}
        <div className={styles.heroContent}> {/* Container for hero text/button */}
          <h1>Welcome to Her Ubuntu</h1>
          <p>Empowering women and girls by ensuring access to essential menstrual products and health education.</p>
          {/* Add more mission/vision text */}
          <p>We connect individuals and organizations in need with donors and distribution centers, fostering a community of support and dignity.</p>

          {/* CTA Button based on authentication status */}
          {!isAuthenticated && (
            // Apply button styles from CSS Module
            <Link to="/register" className={styles.ctaButton}>Join Us / Get Help</Link>
          )}
          {isAuthenticated && (
            // Apply button styles from CSS Module
            <Link to="/dashboard" className={styles.ctaButton}>Go to Dashboard</Link>
          )}
        </div>
      </section>

      {/* Our Mission & Vision Section */}
      <section className={styles.section}> {/* Apply general section styles */}
        <h2>Our Mission</h2> {/* Headings will inherit global styles or section styles */}
        <p>To eradicate period poverty through accessible distribution, comprehensive education, and community support.</p>
        <h2>Our Vision</h2>
        <p>A world where menstruation is not a barrier to education, health, or opportunity for any woman or girl.</p>
      </section>

      {/* How It Works Section */}
      <section className={styles.section}> {/* Apply general section styles */}
         <h2>How It Works</h2>
         <p>Request products via Web/SMS {'>'} Match {'>'} Pickup {'>'} Get Support {'&'} Education.</p> {/* Use expressions */}         <h2>Get Involved</h2>
         <p>Whether you need support, want to donate products or funds, or volunteer your time, Her Ubuntu provides a platform to make a difference.</p>
          {!isAuthenticated && (
             <p>Ready to participate? <Link to="/register">Register Now</Link> or <Link to="/login">Login</Link>.</p>
          )}
      </section>
       {/* Add sections for Educational Resources links if desired */}

    </div>
  );
};

export default HomePage;