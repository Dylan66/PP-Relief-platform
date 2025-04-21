// src/pages/MetricsPage.jsx
import React from 'react';
// Import chart library later if needed (e.g., Chart.js, Recharts)

const MetricsPage = () => {
  // Fetch metrics data from API later
  const metricsData = {
    usersReached: 1500, // Example data
    productsDistributed: 12000,
    locationsServed: 5,
  };

  return (
    <div>
      <h2>Our Impact</h2>
      <p>Tracking our progress in combating period poverty.</p>
      <div style={styles.metricsContainer}>
        <div style={styles.metricBox}>
          <h3>{metricsData.usersReached}+</h3>
          <p>Individuals & Families Supported</p>
        </div>
        <div style={styles.metricBox}>
          <h3>{metricsData.productsDistributed}+</h3>
          <p>Menstrual Products Distributed</p>
        </div>
         <div style={styles.metricBox}>
           <h3>{metricsData.locationsServed}</h3>
           <p>Active Distribution Centers</p>
         </div>
         {/* Add more metrics or charts later */}
      </div>
    </div>
  );
};

const styles = {
    metricsContainer: { display: 'flex', gap: '1rem', justifyContent: 'space-around', flexWrap: 'wrap', marginTop: '2rem' },
    metricBox: { border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', background: '#f8f9fa', minWidth: '200px' }
};


export default MetricsPage;