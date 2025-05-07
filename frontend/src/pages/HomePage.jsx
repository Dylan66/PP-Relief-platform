// src/pages/HomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Footer from '../components/common/Footer'; // Import the new Footer component

import styles from './HomePage.module.css';

// Path to your company picture - adjust this if your image is in a different location
// Corrected the file extension from .jpg to .jpeg
const companyHeroImageUrl = '/company_hero_image.jpeg'; // <--- FIX: Changed .jpg to .jpeg

// NOTE: Assuming your logo image is in the `public` folder
const companyLogoUrl = '/company_hero_image.jpeg'; // Use the provided filename

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className={styles.homePageContainer}>

      {/* === Section 1: Hero with Logo and Text === */}
      <section className={styles.heroSection}>
        <p className={styles.heroTextAbove}>MANY HANDS. ONE MISSION. HER POWER.</p>
        <img
          src={companyLogoUrl} // Use the defined logo URL
          alt="Her Ubuntu Logo" // Updated alt text for the logo
          className={styles.heroLogo} // Apply logo styling
        />
        <h1 className={styles.heroTextBelow}>HER UBUNTU</h1>
      </section>


      {/* === Section 2: Articles Section (Using the new structure) === */}
      <section className={styles.section}>
        {/* Container for the three horizontal article boxes */}
        <div className={styles.articlesContainer}>

          {/* Article Box 1 */}
          <div className={styles.articleBox}>
            <div className={styles.articleImagePlaceholder}></div> {/* Image Placeholder */}
            <p className={styles.articleCategory}>CATEGORY</p>
            <h3 className={styles.articleTitle}>Delivering Dignity: Menstrual Product Distribution</h3>
            <p className={styles.articleDescription}>So far, we've distributed thousands of essential menstrual product packs to individuals in need across diverse communities globally. 
              This provides crucial access, 
              helping over 7,000 individuals manage their periods hygienically and maintain their dignity 
              and daily routines.</p>
          </div>

          {/* Article Box 2 */}
          <div className={styles.articleBox}>
            <div className={styles.articleImagePlaceholder}></div> {/* Image Placeholder */}
            <p className={styles.articleCategory}>CATEGORY</p>
            <h3 className={styles.articleTitle}>Sharing Knowledge: Empowering Through Education</h3>
            <p className={styles.articleDescription}>We've conducted dozens of workshops and created 
              accessible resources that have educated hundreds of 
              people on menstrual health. 
              Our focus on debunking myths and sharing vital information empowers 
              individuals to understand their bodies and make informed decisions.
            </p>
          </div>

          {/* Article Box 3 */}
          <div className={styles.articleBox}>
            <div className={styles.articleImagePlaceholder}></div> {/* Image Placeholder */}
            <p className={styles.articleCategory}>CATEGORY</p>
            <h3 className={styles.articleTitle}> Building Reach: Expanding Access to Information</h3>
            <p className={styles.articleDescription}>Beyond direct sessions, we've developed a growing library of online resources, 
              making reliable menstrual health information available to anyone, 
              anywhere. This digital reach helps break down barriers and extends our mission 
              to a global audience reaching tens of thousands of online users annually, 
              seeking knowledge and support.</p>
          </div>

        </div>
        {/* Remove the old CTA text or adapt if needed for the new design */}
        {/* {!isAuthenticated && (
             <p className={styles.sectionCtaText}>Ready to make a difference or get help? <Link to="/register">Register Now</Link> or <Link to="/login">Login</Link>.</p>
          )}
           {isAuthenticated && (
             <p className={styles.sectionCtaText}><Link to="/dashboard">Go to your Dashboard</Link> to manage requests or donations.</p>
          )} */}
      </section>

      <Footer /> {/* Use the new Footer component */}

      {/* Remove the old Section 3 */}
      {/* <section className={styles.section}>
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
      </section> */}

    </div>
  );
};

export default HomePage;