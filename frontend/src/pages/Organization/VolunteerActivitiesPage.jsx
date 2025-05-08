import React from 'react';
import { Link } from 'react-router-dom';

const VolunteerActivitiesPage = () => {
  // Sample data - replace with dynamic data from your backend
  const activities = [
    { id: 1, title: 'Community Product Packing Drive', date: 'Upcoming: Next Month', description: 'Help us sort and pack menstrual product kits for distribution in underserved communities. A great team activity!', location: 'Our Main Office / Warehouse', commitment: '3-4 hours, flexible shifts' },
    { id: 2, title: 'Educational Workshop Facilitator Training', date: 'Ongoing Applications', description: 'Become a trained facilitator to deliver menstrual health education workshops in schools and community centers.', location: 'Online & In-Person Sessions', commitment: 'Multi-session training + ongoing volunteering' },
    { id: 3, title: 'Awareness Campaign Support', date: 'Seasonal', description: 'Assist with our local and online awareness campaigns. Roles include content creation, event support, and community outreach.', location: 'Remote & Event-based', commitment: 'Varies per campaign' }
  ];

  const styles = {
    pageContainer: { padding: '20px 30px', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', maxWidth: '960px', margin: '20px auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
    header: { fontSize: 'clamp(1.7em, 3vw, 2.2em)', color: '#2c3e50', marginBottom: '25px', borderBottom: '2px solid #eaeaea', paddingBottom: '10px' },
    intro: { fontSize: '1em', color: '#555', lineHeight: '1.7', marginBottom: '30px' },
    activityCard: { backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
    activityTitle: { fontSize: '1.4em', color: '#5A4CAD', marginBottom: '8px' }, // Theme purple
    activityMeta: { fontSize: '0.9em', color: '#777', marginBottom: '12px', lineHeight: '1.5' },
    activityDescription: { fontSize: '1em', color: '#444', lineHeight: '1.6', marginBottom: '15px' },
    contactInfo: { marginTop: '30px', padding: '20px', backgroundColor: '#e9ecef', borderRadius: '5px', textAlign: 'center', border: '1px solid #ced4da' },
    backLink: { display: 'inline-block', marginTop: '30px', padding: '10px 18px', backgroundColor: '#7f8c8d', color: 'white', textDecoration: 'none', borderRadius: '5px', transition: 'background-color 0.2s ease' }
  };

  // Basic hover for backLink (JS based for inline styles)
  const applyBackLinkHover = (e, hover) => {
    e.currentTarget.style.backgroundColor = hover ? '#6c7a7b' : '#7f8c8d';
  };

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.header}>Volunteer Activities for Organizations</h1>
      <p style={styles.intro}>
        We believe in the power of collaboration! Engage your team in meaningful volunteer activities that directly support our mission. 
        Below are some of the ways your organization can get involved.
      </p>

      {activities.length > 0 ? (
        activities.map(activity => (
          <div key={activity.id} style={styles.activityCard}>
            <h2 style={styles.activityTitle}>{activity.title}</h2>
            <p style={styles.activityMeta}>
              <strong>Date/Frequency:</strong> {activity.date} <br /> 
              <strong>Location:</strong> {activity.location} <br />
              <strong>Commitment:</strong> {activity.commitment}
            </p>
            <p style={styles.activityDescription}>{activity.description}</p>
            {/* You might add a "Learn More" or "Express Interest" button here linked to a form or mailto */}
          </div>
        ))
      ) : (
        <p>No specific volunteer activities listed at the moment. Please check back soon or contact us for corporate volunteering opportunities.</p>
      )}

      <div style={styles.contactInfo}>
        <p style={{margin: 0, lineHeight: '1.6'}}>Interested in custom volunteer events for your organization or have other ideas for collaboration? <br/> Please contact our partnership coordinator at <a href="mailto:partnerships@example.com" style={{color: '#5A4CAD'}}>partnerships@example.com</a>.</p>
      </div>

      <Link 
        to="/dashboard/organization" 
        style={styles.backLink} 
        onMouseOver={(e) => applyBackLinkHover(e, true)}
        onMouseOut={(e) => applyBackLinkHover(e, false)}
      >
        &larr; Back to Organization Dashboard
      </Link>
    </div>
  );
};

export default VolunteerActivitiesPage; 