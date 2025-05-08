import React from 'react';
import { Link } from 'react-router-dom'; // Restore Link import

const OrganizationServicesPage = () => {
  // Restore original styles
  const styles = {
    pageContainer: { padding: '20px 30px', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', maxWidth: '960px', margin: '20px auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
    header: { fontSize: 'clamp(1.7em, 3vw, 2.2em)', color: '#2c3e50', marginBottom: '25px', borderBottom: '2px solid #eaeaea', paddingBottom: '10px', textAlign: 'center' },
    navSection: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '15px',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '6px',
      marginBottom: '30px',
      border: '1px solid #e7e7e7',
    },
    navButton: {
      display: 'inline-block',
      padding: '12px 22px',
      textDecoration: 'none',
      color: '#fff',
      backgroundColor: '#5A4CAD',
      borderRadius: '5px',
      fontSize: '1em',
      fontWeight: '500',
      textAlign: 'center',
      transition: 'background-color 0.2s ease, transform 0.1s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      minWidth: '200px',
    },
    sectionTitle: { fontSize: '1.5em', color: '#34495e', marginTop: '30px', marginBottom: '15px' },
    paragraph: { fontSize: '1em', color: '#555', lineHeight: '1.7', marginBottom: '15px' },
    list: { listStylePosition: 'inside', paddingLeft: '0', marginBottom: '20px' },
    listItem: { fontSize: '1em', color: '#555', lineHeight: '1.7', marginBottom: '8px', paddingLeft: '10px', position: 'relative' },
    backLink: { display: 'inline-block', marginTop: '30px', padding: '10px 18px', backgroundColor: '#7f8c8d', color: 'white', textDecoration: 'none', borderRadius: '5px', transition: 'background-color 0.2s ease' }
  };
  
  // Restore hover handlers
  const applyNavButtonHover = (e, hover) => {
    e.currentTarget.style.backgroundColor = hover ? '#483D8B' : '#5A4CAD';
    e.currentTarget.style.transform = hover ? 'scale(1.03)' : 'scale(1)';
  };

  const applyBackLinkHover = (e, hover) => {
    e.currentTarget.style.backgroundColor = hover ? '#6c7a7b' : '#7f8c8d';
  };

  return (
    // Restore original JSX content
    <div style={styles.pageContainer}>
      <h1 style={styles.header}>Welcome, Partner Organization!</h1>
      
      <div style={styles.navSection}>
        <Link 
          to="/product-request"
          style={styles.navButton}
          onMouseOver={(e) => applyNavButtonHover(e, true)}
          onMouseOut={(e) => applyNavButtonHover(e, false)}
        >
          Request Products
        </Link>
        <Link 
          to="/book-talk"
          style={styles.navButton}
          onMouseOver={(e) => applyNavButtonHover(e, true)}
          onMouseOut={(e) => applyNavButtonHover(e, false)}
        >
          Book a Talk/Workshop
        </Link>
        <Link 
          to="/volunteer-activities"
          style={styles.navButton}
          onMouseOver={(e) => applyNavButtonHover(e, true)}
          onMouseOut={(e) => applyNavButtonHover(e, false)}
        >
          Volunteer Opportunities
        </Link>
      </div>

      <p style={styles.paragraph}>
        We are committed to empowering organizations like yours that are working to advance menstrual health and dignity. 
        Explore the range of services and collaborative opportunities we offer below.
      </p>

      <section>
        <h2 style={styles.sectionTitle}>Educational Workshops & Training</h2>
        <p style={styles.paragraph}>
          We provide comprehensive training sessions and workshops tailored for your staff, volunteers, or the communities you serve. Our topics include:
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>Menstrual Health Management (MHM) fundamentals.</li>
          <li style={styles.listItem}>Sustainable menstruation options and product education.</li>
          <li style={styles.listItem}>Addressing stigma and cultural sensitivities.</li>
          <li style={styles.listItem}>Advocacy and community mobilization strategies.</li>
        </ul>
      </section>

      <section>
        <h2 style={styles.sectionTitle}>Resource Sharing & Material Development</h2>
        <p style={styles.paragraph}>
          Gain access to our library of educational materials or collaborate with us to develop bespoke resources for your specific programs. This includes:
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>Informational brochures, posters, and digital content.</li>
          <li style={styles.listItem}>Curriculum modules for schools and community groups.</li>
          <li style={styles.listItem}>Best practice guides for product distribution and MHM support.</li>
        </ul>
      </section>
      
      <section>
        <h2 style={styles.sectionTitle}>Advocacy & Policy Support</h2>
        <p style={styles.paragraph}>
          Join us in advocating for systemic change. We can support your organization by:
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>Providing data and research on period poverty in Kenya.</li>
          <li style={styles.listItem}>Collaborating on policy briefs and advocacy campaigns.</li>
          <li style={styles.listItem}>Connecting you with a network of like-minded organizations.</li>
        </ul>
      </section>

      {/* Restore optional back link if needed */}
      {/* <Link 
        to="/dashboard/organization" 
        style={styles.backLink} 
        onMouseOver={(e) => applyBackLinkHover(e, true)}
        onMouseOut={(e) => applyBackLinkHover(e, false)}
      >
        &larr; Back to Organization Dashboard
      </Link> */}
    </div>
  );
};

export default OrganizationServicesPage; 