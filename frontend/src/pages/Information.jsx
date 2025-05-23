import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from './Information.module.css'; // CSS module for this page
import Footer from '../components/common/Footer'; // Import the new Footer component
import endometImage from '../assets/images/endomet.jpeg'; // Import the first image
import endomet2Image from '../assets/images/endomet2.jpeg'; // Import the second image

const Information = () => {
  const navigate = useNavigate(); // Initialize navigate

  const handleLearnMoreClick = () => {
    navigate('/register'); // Navigate to the register page
  };

  return (
    <div className={styles.pageContainer}>
      {/* Section 1: Hero - Aligned Left */}
      <div className={`${styles.heroSection} ${styles.heroSectionAlignLeft}`}>
        <img src={endometImage} alt="Endometriosis awareness" className={styles.heroImage} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroHeading}>
          Understanding Endometriosis: More Than Just Bad Cramps
          </h1>
          <p className={styles.heroParagraph}>
          Severe period pain can sometimes be a sign of something more. 
            Endometriosis is a common but often misunderstood condition that affects millions. Learn about its symptoms, impact on health, and why early diagnosis and support are crucial. 
            Your health matters, and understanding the signs is key
          </p>
          <button className={styles.learnMoreButton} onClick={handleLearnMoreClick}>Learn More</button>
        </div>
      </div>

      {/* Section 2: Pink Background Section - Aligned Right */}
      <div className={`${styles.heroSection} ${styles.heroSectionPink} ${styles.heroSectionAlignRight}`}>
        <img src={endomet2Image} alt="Endometriosis awareness" className={styles.heroImage} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroHeading}>
          Finding the Right Menstrual Products
          </h1>
          <p className={styles.heroParagraph}>
          Navigating the world of pads, tampons, cups, and more can be overwhelming! 
            This article breaks down the different choices available, discussing pros, 
            cons, and how to find the best fit for your body and lifestyle. 
            Make informed choices for comfort and confidence every month.
          </p>
          <button className={styles.learnMoreButton} onClick={handleLearnMoreClick}>Learn More</button>
        </div>
      </div>

      {/* Section 3: Articles Section */}
      <div className={styles.articlesSection}>
        <div className={styles.articlesGrid}>
          {/* Article 1 */}
          <div className={styles.articleCard}>
            <h3 className={styles.articleTitle}>Finding the Right Menstrual Products</h3>
            <p className={styles.articleText}>
            Navigating the world of pads, tampons, cups, and more can be overwhelming! 
            This article breaks down the different choices available, discussing pros, 
            cons, and how to find the best fit for your body and lifestyle. 
            Make informed choices for comfort and confidence every month.
            </p>
          </div>
          {/* Article 2 */}
          <div className={styles.articleCard}>
            <h3 className={styles.articleTitle}>Debunking Common Menstrual Myths</h3>
            <p className={styles.articleText}>
            From "you can't swim on your period" to harmful beliefs about cleanliness, 
            misinformation about menstruation is everywhere. 
            We tackle the most common myths head-on with factual, 
            easy-to-understand information. Arm yourself with knowledge and help us bust the stigma!
            </p>
          </div>
          {/* Article 3 */}
          <div className={styles.articleCard}>
            <h3 className={styles.articleTitle}>Understanding Endometriosis: More Than Just Bad Cramps</h3>
            <p className={styles.articleText}>
            Severe period pain can sometimes be a sign of something more. 
            Endometriosis is a common but often misunderstood condition that affects millions. Learn about its symptoms, impact on health, and why early diagnosis and support are crucial. 
            Your health matters, and understanding the signs is key.</p>
          </div>
        </div>
      </div>

      <Footer /> {/* Use the new Footer component */}
    </div>
  );
};

export default Information; 