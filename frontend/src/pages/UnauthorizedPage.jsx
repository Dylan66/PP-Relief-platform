// frontend/src/pages/UnauthorizedPage.jsx (Create this file)

import React from 'react';
import { Link } from 'react-router-dom'; // If you want to link back home or login

const UnauthorizedPage = ({ message = "You do not have permission to view this page." }) => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2>Unauthorized Access</h2>
      <p>{message}</p>
      <p>
        <Link to="/">Go to Home</Link> {/* Or link to login/dashboard if appropriate */}
      </p>
    </div>
  );
};

export default UnauthorizedPage;