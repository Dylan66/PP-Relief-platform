import React from 'react';
import styles from './Information.module.css'; // CSS module for this page
import Footer from '../components/common/Footer'; // Import the new Footer component

const Information = () => {
  return (
    <div className={styles.pageContainer}>
      {/* Section 1: Hero - Aligned Left */}
      <div className={`${styles.heroSection} ${styles.heroSectionAlignLeft}`}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroHeading}>
            Empowering Women through Menstrual Health Awareness
          </h1>
          <p className={styles.heroParagraph}>
            Our mission is to raise awareness about menstrual health and
            empower women with the knowledge and resources they need. We
            envision a world where every woman has access to safe and hygienic
            menstrual products.
          </p>
          <button className={styles.learnMoreButton}>Learn More</button>
        </div>
      </div>

      {/* Section 2: Pink Background Section - Aligned Right */}
      <div className={`${styles.heroSection} ${styles.heroSectionPink} ${styles.heroSectionAlignRight}`}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroHeading}>
            Empowering Women through Menstrual Health Awareness
          </h1>
          <p className={styles.heroParagraph}>
            Our mission is to raise awareness about menstrual health and
            empower women with the knowledge and resources they need. We
            envision a world where every woman has access to safe and hygienic
            menstrual products.
          </p>
          <button className={styles.learnMoreButton}>Learn More</button>
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
            <h3 className={styles.articleTitle}>Understanding Endometriosis: More Than Just Bad Cramp</h3>
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