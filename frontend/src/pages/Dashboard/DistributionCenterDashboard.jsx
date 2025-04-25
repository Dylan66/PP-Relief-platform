// frontend/src/pages/Dashboard/DistributionCenterDashboard.jsx

import React from 'react';
import useAuth from '../../hooks/useAuth'; // If needed to access linkedCenterId

const DistributionCenterDashboard = () => {
   const { user, linkedCenterId } = useAuth();

  return (
    <div>
      <h2>Distribution Center Dashboard</h2>
      {/* Use optional chaining ?. as user might be null initially */}
      <p>Welcome, Center Admin {user?.username}! Manage inventory and requests for Center {linkedCenterId || '...'}.</p>

      {/* TODO: Add components for Inventory Management and Request Management */}
      {/* Example: <InventoryTable centerId={linkedCenterId} /> */}
      {/* Example: <AssignedRequestsList centerId={linkedCenterId} /> */}


    </div>
  );
};

export default DistributionCenterDashboard;