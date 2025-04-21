// src/pages/Dashboard/DonorDashboard.jsx
import React from 'react';
import DonationOptions from '../../components/Dashboard/Donor/DonationOptions'; // Create this next

const DonorDashboard = () => {
  return (
    <div>
      <h2>Donor Dashboard</h2>
      <p>Thank you for your interest in supporting Her Ubuntu!</p>
      <p>Choose how you'd like to contribute:</p>

      <DonationOptions />

       {/* Add section to show past donations or impact later */}
    </div>
  );
};

export default DonorDashboard;