import React from 'react';
import styles from './Information.module.css'; // CSS module for this page

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

      {/* Footer Section */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
            <p className={styles.footerText}><strong>Address:</strong> Level 1, 12 Sample St, Sydney NSW 2000</p>
            <p className={styles.footerText}><strong>Contact:</strong> info@relume.io</p>
            <p className={styles.footerText}>1800 123 4567</p>
        </div>
        <div className={styles.socialLinks}>
            <a href="#" aria-label="Instagram"><img src="/images/instagram-icon.svg" alt="Instagram" /></a>
            <a href="#" aria-label="Facebook"><img src="/images/facebook-icon.svg" alt="Facebook" /></a>
            <a href="#" aria-label="LinkedIn"><img src="/images/linkedin-icon.svg" alt="LinkedIn" /></a>
            <a href="#" aria-label="YouTube"><img src="/images/youtube-icon.svg" alt="YouTube" /></a>
            <a href="#" aria-label="Twitter"><img src="/images/twitter-icon.svg" alt="Twitter" /></a>
        </div>
      </footer>
    </div>
  );
};

export default Information; 