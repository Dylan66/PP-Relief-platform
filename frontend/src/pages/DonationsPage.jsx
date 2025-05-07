import React from 'react';
import Footer from '../components/common/Footer';
import donorsImage from '../assets/images/donors.jpeg';

const DonationsPage = () => {
  return (
    <div style={styles.pageContainer}>
      

      <main style={styles.mainContent}>
        <section style={styles.heroSection}>
          <h1 style={styles.heroTitle}>How You <br /> Can Create <br /> Impact</h1>
          <div style={styles.heroContentRow}>
            <div style={styles.heroTextContainer}>
              <p style={styles.heroSubtitle}>
                Your support directly advances menstrual dignity and health across Kenya. You can join us in this vital work by:
              </p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px', maxWidth: '550px', marginBottom: '20px' }}>
                <li style={{ marginBottom: '10px', fontSize: 'clamp(1em, 2vw, 1.1em)', color: '#4A4A4A', lineHeight: '1.6' }}>Donating Funds: Your financial gift enables us to purchase products, run workshops, and sustain our operations.</li>
                <li style={{ marginBottom: '10px', fontSize: 'clamp(1em, 2vw, 1.1em)', color: '#4A4A4A', lineHeight: '1.6' }}>Donating Products: Contribute sanitary pads, reusable options, or other menstrual supplies directly.</li>
                <li style={{ marginBottom: '10px', fontSize: 'clamp(1em, 2vw, 1.1em)', color: '#4A4A4A', lineHeight: '1.6' }}>Sharing Expertise: Volunteer your professional knowledge in menstrual health education or program development.</li>
                <li style={{ fontSize: 'clamp(1em, 2vw, 1.1em)', color: '#4A4A4A', lineHeight: '1.6' }}>Providing Space: Help us establish or support a distribution center by donating or offering space and resources.</li>
              </ul>
              <p style={styles.heroSubtitle}>
                Every contribution, big or small, helps us make a real difference.
              </p>
              <a href="/donor-registration" style={styles.learnMoreButton}>Learn More</a>
            </div>
            <div style={styles.heroImageContainer}>
              <img src={donorsImage} alt="Donors contributing to the cause" style={styles.heroImage} />
            </div>
          </div>
        </section>

        <section style={styles.articlesSection}>
          <div style={styles.articleCard}>
            <h5 style={styles.articleCardTitle}>Gift of Dignity: Directly Providing Menstrual Essentials Across Kenya</h5>
            <p style={styles.articleCardText}>
            When you donate, you directly place essential menstrual products into the hands of 
            someone in need right here in Kenya. Your generosity means a student in a rural school
             can stay in class, a woman in an urban centre can attend work, and an individual can manage their period hygienically and without shame. 
             So far, your support has helped us distribute over 20,000 product packs,
             reaching more than 10,000 individuals across various Kenyan communities. 
             Your gift isn't just a product; it's a restoration of dignity and a fundamental step 
             towards enabling participation and well-being for fellow Kenyans. 
            Thank you for making dignity possible in our communities.
            </p>
          </div>
          <div style={styles.articleCard}>
            <h5 style={styles.articleCardTitle}>Investing in Empowerment: Fueling Menstrual Health Knowledge in Kenya</h5>
            <p style={styles.articleCardText}>
            Your contribution does more than provide immediate relief; 
            it empowers futures within Kenya. By supporting our educational programs and 
            resource development, you are helping to break cycles of misinformation and
             stigma in schools and communities across the country. 
             Through our workshops and online resources, we've educated over 5,000 Kenyans, 
             providing vital knowledge that challenges myths and promotes healthy practices. 
             You are giving individuals the knowledge to understand their bodies, 
             make informed health choices, and advocate for themselves. 
             Your investment in knowledge is an investment in long-term health, 
            confidence, and independence for individuals across Kenya.
            </p>
          </div>
          <div style={styles.articleCard}>
            <h5 style={styles.articleCardTitle}>Joining a Local Movement: Your Impact Creates Change Here in Kenya</h5>
            <p style={styles.articleCardText}>
            Your support extends beyond individual supplies or single workshops. 
            You are joining a vital local movement dedicated to ending period poverty 
            and championing menstrual health equity across Kenya. 
            Operating through 15 distribution points and partnering with numerous community groups, 
            your donation helps us reach underserved areas and advocate for systemic change right here 
            in the country. 
            You are a vital part of building a future where menstruation 
            is never a barrier for anyone in Kenya.
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
    padding: '80px 0px', // Generous vertical padding
    backgroundColor: '#f8f9fa', // Off-white background for this section
    display: 'flex',
    flexDirection: 'column', // Changed from row to column
    alignItems: 'flex-start', // Align items (H1 and heroContentRow) to the start
    // justifyContent: 'space-between', // Removed as it's not typical for column
    // gap: '40px', // Removed, H1 margin-bottom will handle spacing
  },
  heroContentRow: { // New style for the row containing text and image
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start', // Key for aligning paragraph and image tops
    justifyContent: 'space-between', // To space out text and image blocks
    gap: '40px', // Horizontal gap between text and image
    width: '100%', // Ensure it takes full width
    marginTop: '25px', // Space below the H1, was heroTitle.marginBottom
  },
  heroTextContainer: {
    flex: 1, // Allow text container to take up available space in heroContentRow
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // Keep text aligned to the start
  },
  heroImageContainer: {
    flex: 1, // Allow image container to take up available space in heroContentRow
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    maxWidth: '100%',
    maxHeight: '400px', // Constrain image height
    borderRadius: '8px',
    objectFit: 'cover',
  },
  heroTitle: {
    fontSize: 'clamp(2.5em, 5vw, 3.8em)', // Responsive font size
    fontWeight: 'bold',
    color: '#000',
    marginBottom: '0px', // Adjusted as heroContentRow now has marginTop
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
    textDecoration: 'none', // Ensure no underline for the link
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