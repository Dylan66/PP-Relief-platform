import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import styles from './AboutUs.module.css'; // Import the CSS module
import Footer from '../components/common/Footer'; // Import the new Footer component

const AboutUs = () => {
  return (
    // Increased vertical padding for overall spacing if needed
    <div className={styles.pageContainer}>

      {/* Hero Section: Text Left, Graphic Right */}
      {/* Added light lavender background (bg-violet-50 or similar) and padding */}
      <div className={styles.heroSection}>
        {/* Text & Buttons Container (Left) */}
        {/* Adjusted width to md:w-3/5 for a roughly 40% width, pr for spacing */}
        <div className={styles.heroTextContainer}>
          <h1 className={styles.heroHeading}>
            Empowering Women through Menstrual Health Awareness
          </h1>
          <p className={styles.heroParagraph}>
            Our mission is to raise awareness about menstrual health and
            empower women with the knowledge and resources they need. We
            envision a world where every woman has access to safe and hygienic
            menstrual products.
          </p>
          <div className={styles.heroButtons}>
            <Link to="/donations" className={styles.donateButtonLink}>
              <button className={styles.donateButton}>Donate</button>
            </Link>
            <Link to="/register" className={styles.registerButtonLink}>
              <button className={styles.registerButton}>Register</button>
            </Link>
          </div>
        </div>
        {/* Graphic Container (Right) */}
        <div className={styles.heroGraphicContainer}>
          <img src="/images/her-ubuntu.svg" alt="Her Ubuntu" className={styles.heroImage} />
        </div>
      </div>

      {/* Combined Mission/Vision/Values Section */}
      <div className={styles.infoSection}> {/* Add space between the two rows */}
        {/* Row 1: Mission & Vision */}
        <div className={styles.infoRow}>
          <div className={styles.infoBlock}>
            <h2 className={styles.infoHeading}>Our Mission:</h2>
            <p className={styles.infoText}>
              To eradicate period poverty globally by ensuring access to
              menstrual products and empowering individuals with
              comprehensive and engaging menstrual health knowledge.
            </p>
          </div>
          <div className={styles.infoBlock}>
            <h2 className={styles.infoHeading}>Our Vision:</h2>
            <p className={styles.infoText}>
              A world where period poverty is eliminated, and all individuals,
              regardless of location or circumstance, can manage their
              menstruation with dignity, knowledge, and without limitation.
            </p>
          </div>
        </div>

        {/* Row 2: Values (Empowerment, Dignity, Compassion) */}
        <div className={styles.infoRow}>
           <div className={styles.infoBlock}> {/* Removed md:w-1/3, letting grid handle sizing */}
             <h2 className={styles.infoHeading}>Empowerment:</h2>
             <p className={styles.infoText}>
               We believe in equipping people with the knowledge and resources
               to take control of their health and futures.
             </p>
           </div>
           <div className={styles.infoBlock}>
             <h2 className={styles.infoHeading}>Dignity:</h2>
             <p className={styles.infoText}>
               We champion the inherent worth and right to respect for every menstruating
               individual.
             </p>
           </div>
           <div className={styles.infoBlock}>
             <h2 className={styles.infoHeading}>Compassion:</h2>
             <p className={styles.infoText}>
               We approach our work with empathy and understanding for the
               diverse experiences of individuals around the world.
             </p>
           </div>
         </div>
       </div>


      {/* Articles Section (Remains Horizontal) */}
      <div className={styles.articlesSection}> {/* Added bottom margin */}
        <div className={styles.articlesGrid}> {/* Increased gap */}
          {/* Article 1 */}
          <div className={styles.articleCard}>
            <div className={styles.articleImagePlaceholder}></div>
            <h3 className={styles.articleHeading}>Delivering Dignity: Menstrual Product Distribution</h3>
            <p className={styles.articleText}>
            So far, we've distributed thousands of essential menstrual product packs to individuals in need across diverse communities globally. 
            This provides crucial access, 
            helping over 7,000 individuals manage their periods hygienically 
            and maintain their dignity 
            and daily routines.
            </p>
          </div>
          {/* Article 2 */}
          <div className={styles.articleCard}>
            <div className={styles.articleImagePlaceholder}></div>
            <h3 className={styles.articleHeading}>Sharing Knowledge: Empowering Through Education</h3>
            <p className={styles.articleText}>
            We've conducted dozens of workshops and created 
              accessible resources that have educated hundreds of 
              people on menstrual health. 
              Our focus on debunking myths and sharing vital information empowers 
              individuals to understand their bodies and make informed decisions.
            </p>
          </div>
          {/* Article 3 */}
          <div className={styles.articleCard}>
            <div className={styles.articleImagePlaceholder}></div>
            <h3 className={styles.articleHeading}>Building Reach: Expanding Access to Information</h3>
            <p className={styles.articleText}>
            Beyond direct sessions, we've developed a growing library of online resources, 
              making reliable menstrual health information available to anyone, 
              anywhere. This digital reach helps break down barriers and extends our mission 
              to a global audience reaching tens of thousands of online users annually, 
              seeking knowledge and support.
            </p>
          </div>
        </div>
      </div>

      <Footer /> {/* Use the new Footer component */}

    </div>
  );
};

export default AboutUs; 