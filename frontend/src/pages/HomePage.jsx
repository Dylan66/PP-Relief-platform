// src/pages/HomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

import styles from './HomePage.module.css';

// Path to your company picture - adjust this if your image is in a different location
// Corrected the file extension from .jpg to .jpeg
const companyHeroImageUrl = '/company_hero_image.jpeg'; // <--- FIX: Changed .jpg to .jpeg


const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className={styles.homePageContainer}>

      {/* === Section 1: Company picture, front and center === */}
      <section className={styles.heroSection}>
        <img
          src={companyHeroImageUrl} // Use the defined image URL
          alt="Her Ubuntu Company Picture" // Add a meaningful alt text describing the image
          className={styles.heroImage} // Apply image styling
        />
      </section>


      {/* === Section 2: Three text boxes organized horizontally === */}
      {/* Apply general section styles defined in HomePage.module.css */}
      <section className={styles.section}>
        <h2>What We Do</h2> {/* Heading for this section */}
        {/* Container for the three horizontal boxes using flexbox */}
        {/* This style is defined in HomePage.module.css */}
        <div className={styles.threeBoxesContainer}>
          {/* Text Box 1: Distribution */}
          {/* Apply style for individual box, defined in HomePage.module.css */}
          <div className={styles.textBox}>
            <h3>Accessible Distribution</h3> {/* Heading within the box */}
            <p>We provide easy access to essential menstrual products through a network of local distribution centers across Kenya.</p> {/* Paragraph within the box */}
          </div>
          {/* Text Box 2: Education */}
          <div className={styles.textBox}>
            <h3>Health Education</h3>
            <p>Our platform and community programs offer vital information on menstrual health, hygiene, and related conditions, breaking down stigma and myths.</p>
          </div>
          {/* Text Box 3: Community Support */}
          <div className={styles.textBox}>
            <h3>Empowering Community</h3>
            <p>We connect individuals in need and organizations with donors, volunteers, and resources, fostering a supportive network.</p>
          </div>
        </div>
         {/* Optional Call to Action below the boxes */}
         {/* *** FIX START: Corrected JSX Conditional Rendering *** */}
         {!isAuthenticated && (
             <p className={styles.sectionCtaText}>Ready to make a difference or get help? <Link to="/register">Register Now</Link> or <Link to="/login">Login</Link>.</p>
          )}
           {/* This block renders ONLY if isAuthenticated is true */}
           {isAuthenticated && (
             <p className={styles.sectionCtaText}><Link to="/dashboard">Go to your Dashboard</Link> to manage requests or donations.</p>
          )}
         {/* *** FIX END *** */}
      </section>


      {/* === Section 3: Address on left, two smaller text boxes on right === */}
      <section className={styles.section}>
         <h2>Get In Touch / Get Involved</h2>
        <div className={styles.contactSectionContainer}>

          <div className={styles.contactAddressBox}>
            <h3>Contact Us</h3>
            <p>Her Ubuntu Initiative</p>
            <p>123 Main Street</p>
            <p>Spring Valley, Nairobi</p>
            <p>Kenya, 00100</p>
            <p>Email: <a href="mailto:info@herubuntu.org">info@herubuntu.org</a></p>
            <p>Phone: <a href="tel:+254712345678">+254 712 345 678</a></p>
          </div>

          <div className={styles.getInvolvedBoxesContainer}>
            <div className={styles.getInvolvedTextBox}>
              <h3>Need Products?</h3>
              <p>Individuals and organizations can request menstrual products through our platform.</p>
               {!isAuthenticated && <p><Link to="/register">Register</Link> or <Link to="/login">Login</Link> to submit a request.</p>}
                {isAuthenticated && <p><Link to="/dashboard">Go to Dashboard</Link> to request.</p>}
            </div>
            <div className={styles.getInvolvedTextBox}>
              <h3>Want to Donate?</h3>
              <p>Your support makes a difference. Find out how you can <Link to="/register">register as a donor</Link> or contribute today.</p>
               {!isAuthenticated && <p><Link to="/register">Register</Link> or <Link to="/login">Login</Link> to become a donor.</p>}
                {isAuthenticated && <p><Link to="/dashboard">Go to Dashboard</Link> to find donation options.</p>}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default HomePage;