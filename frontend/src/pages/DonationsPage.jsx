import React from 'react';
import Footer from '../components/common/Footer';

const DonationsPage = () => {
  return (
    <div style={styles.pageContainer}>
      

      <main style={styles.mainContent}>
        <section style={styles.heroSection}>
          <h1 style={styles.heroTitle}>Empowering Women <br /> through Menstrual <br /> Health Awareness</h1>
          <p style={styles.heroSubtitle}>
            Our mission is to raise awareness about menstrual health and empower
            women with the knowledge and resources they need. We envision a
            world where every woman has access to safe and hygienic menstrual
            products.
          </p>
          <button style={styles.learnMoreButton}>Learn More</button>
        </section>

        <section style={styles.articlesSection}>
          <div style={styles.articleCard}>
            <h5 style={styles.articleCardTitle}>ARTICLE TITLE</h5>
            <p style={styles.articleCardText}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
              diam nonummy nibh euismod tincidunt ut laoreet dolore magna
              aliquam erat volutpat.
            </p>
          </div>
          <div style={styles.articleCard}>
            <h5 style={styles.articleCardTitle}>ARTICLE TITLE</h5>
            <p style={styles.articleCardText}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
              diam nonummy nibh euismod tincidunt ut laoreet dolore magna
              aliquam erat volutpat.
            </p>
          </div>
          <div style={styles.articleCard}>
            <h5 style={styles.articleCardTitle}>ARTICLE TITLE</h5>
            <p style={styles.articleCardText}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
              diam nonummy nibh euismod tincidunt ut laoreet dolore magna
              aliquam erat volutpat.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const styles = {
  pageContainer: {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    backgroundColor: '#f0f0f0', // Light grey background for the page overall
    color: '#333',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 50px', // Padding for header
    backgroundColor: '#f8f9fa', // Slightly off-white for header bg, matching hero
    borderBottom: '1px solid #dee2e6',
    width: '100%',
    boxSizing: 'border-box',
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoGraphicPlaceholder: {
    width: '50px', // Approximate size from image
    height: '50px',
    backgroundColor: '#ccc', // Placeholder color
    borderRadius: '50%',
    marginBottom: '5px',
     // In a real app, this would be an <img /> or SVG
  },
  logoText: {
    fontSize: '0.8em',
    fontWeight: 'bold',
    color: '#555',
  },
  nav: {
    display: 'flex',
    gap: '25px',
  },
  navLink: {
    textDecoration: 'none',
    color: '#333',
    fontSize: '1em',
    fontWeight: '500',
  },
  navLinkActive: { // Style for the "Donate Now" link, assuming it's the current page
    textDecoration: 'none',
    color: '#000',
    fontSize: '1em',
    fontWeight: 'bold',
  },
  langSelector: {
    fontSize: '0.9em',
    color: '#333',
    fontWeight: '500',
  },
  mainContent: {
    padding: '0 50px', // Match header horizontal padding
    maxWidth: '1200px',
    margin: '0 auto', // Center content if page is wider
    backgroundColor: '#f8f9fa', // Background for the main content area below header
    flexGrow: 1,
  },
  heroSection: {
    textAlign: 'left',
    padding: '80px 0px', // Generous vertical padding, no extra horizontal padding here
    backgroundColor: '#f8f9fa', // Off-white background for this section
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  heroTitle: {
    fontSize: 'clamp(2.5em, 5vw, 3.8em)', // Responsive font size
    fontWeight: 'bold',
    color: '#000',
    marginBottom: '25px',
    lineHeight: '1.1',
  },
  heroSubtitle: {
    fontSize: 'clamp(1em, 2vw, 1.1em)',
    color: '#4A4A4A',
    marginBottom: '40px',
    lineHeight: '1.6',
    maxWidth: '550px',
  },
  learnMoreButton: {
    backgroundColor: '#D4C2FF', // Light purple from image (approximated)
    color: '#000000',
    border: 'none',
    padding: '18px 35px',
    fontSize: 'clamp(1em, 2vw, 1.1em)',
    fontWeight: 'bold',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  articlesSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '40px',
    padding: '50px 0px',
  },
  articleCard: {
    backgroundColor: '#EAE4FF', // Very light lavender/purple (approximated)
    padding: '35px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  },
  articleCardTitle: {
    fontSize: '0.8em',
    color: '#5A4CAD', // A purple shade, matching general theme
    fontWeight: '600',
    marginBottom: '15px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  articleCardText: {
    fontSize: '0.95em',
    color: '#333',
    lineHeight: '1.7',
  },
};

export default DonationsPage; 