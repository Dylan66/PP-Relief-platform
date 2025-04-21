// frontend/src/components/common/LoadingSpinner.jsx

import React from 'react';
import './LoadingSpinner.css'; // We'll add some basic CSS

const LoadingSpinner = ({ size = '40px', color = '#3498db' }) => {
  const spinnerStyle = {
    width: size,
    height: size,
    borderTopColor: color,
    borderRightColor: color,
    borderBottomColor: color,
    borderLeftColor: 'transparent', // Makes it look like it's spinning
  };

  return (
    <div className="loading-spinner-overlay"> {/* Optional overlay */}
      <div className="loading-spinner" style={spinnerStyle}></div>
    </div>
  );
};

export default LoadingSpinner;