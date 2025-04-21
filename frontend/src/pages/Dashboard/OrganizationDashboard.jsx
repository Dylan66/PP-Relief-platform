// src/pages/Dashboard/OrganizationDashboard.jsx
import React from 'react';
import RequestFormOrg from '../../components/Dashboard/Organization/RequestFormOrg'; // Create this next

const OrganizationDashboard = () => {
  return (
    <div>
      <h2>Organization Dashboard</h2>
      <p>Request products for your community members and access resources.</p>

      <RequestFormOrg />

      <hr style={{ margin: '2rem 0' }}/>

      <section>
        <h3>Community Health Resources</h3>
        <h4>Guides</h4>
        <ul>
          <li>Guide: Hosting Menstrual Health Talks</li>
          <li>Guide: Debunking Common Menstrual Myths</li>
          {/* Add links or content */}
        </ul>
        <h4>Book a Session</h4>
        <p>Interested in having a Her Ubuntu volunteer facilitate a session for your group? </p>
        <button>Request Facilitation (Coming Soon)</button>
      </section>
    </div>
  );
};

export default OrganizationDashboard;