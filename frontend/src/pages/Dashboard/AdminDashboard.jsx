// frontend/src/pages/Dashboard/AdminDashboard.jsx

import React from 'react';
// import useAuth from '../../hooks/useAuth'; // You might need this if you display user-specific admin info

const AdminDashboard = () => {
  // You could get user details like username from useAuth if you want to personalize the welcome
  // const { user } = useAuth();

  return (
    <div>
      <h2>System Administrator Dashboard</h2>
      {/* You could use user?.username here if you import useAuth */}
      <p>Welcome, Admin! This is the central control panel for the platform.</p>

      <section style={{ marginTop: '2rem' }}>
        <h3>Platform Overview</h3>
        {/* TODO: Add components to display key metrics */}
        <ul>
          <li>Total Registered Users (Coming Soon)</li>
          <li>Total Organizations (Coming Soon)</li>
          <li>Total Distribution Centers (Coming Soon)</li>
          <li>Total Requests Made (Coming Soon)</li>
          <li>Total Products Distributed (Coming Soon)</li>
          <li>Total Donations Received (Coming Soon)</li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h3>Management Actions</h3>
        {/* TODO: Add links or components for admin tasks */}
        <ul>
          {/* Link to Django Admin directly for complex tasks initially */}
          <li><a href="/admin/" target="_blank" rel="noopener noreferrer">Access Django Admin</a></li>
          <li>Manage Users (Coming Soon)</li>
          <li>Manage Organizations (Coming Soon)</li>
          <li>Manage Distribution Centers (Coming Soon)</li>
          <li>Manage Product Types (Coming Soon)</li>
          <li>View/Manage All Requests (Coming Soon)</li>
          <li>View/Manage All Inventory (Coming Soon)</li>
          <li>Verify Organizations (Coming Soon)</li>
          <li>Generate Reports (Coming Soon)</li>
        </ul>
      </section>

    </div>
  );
};

export default AdminDashboard;