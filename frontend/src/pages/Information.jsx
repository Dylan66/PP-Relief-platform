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
            <h3 className={styles.articleTitle}>ARTICLE TITLE</h3>
            <p className={styles.articleText}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
              diam nonummy nibh euismod tincidunt ut laoreet dolore magna
              aliquam erat volutpat.
            </p>
          </div>
          {/* Article 2 */}
          <div className={styles.articleCard}>
            <h3 className={styles.articleTitle}>ARTICLE TITLE</h3>
            <p className={styles.articleText}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
              diam nonummy nibh euismod tincidunt ut laoreet dolore magna
              aliquam erat volutpat.
            </p>
          </div>
          {/* Article 3 */}
          <div className={styles.articleCard}>
            <h3 className={styles.articleTitle}>ARTICLE TITLE</h3>
            <p className={styles.articleText}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
              diam nonummy nibh euismod tincidunt ut laoreet dolore magna
              aliquam erat volutpat.
            </p>
          </div>
        </div>
      </div>

      <Footer /> {/* Use the new Footer component */}
    </div>
  );
};

export default Information; 