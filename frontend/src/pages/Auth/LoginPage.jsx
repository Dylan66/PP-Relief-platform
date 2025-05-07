// src/pages/Auth/LoginPage.jsx
import React from 'react';
import LoginForm from '../../components/Auth/LoginForm'; // Create this next
// You might want a specific CSS file for page-level layout if LoginForm.css doesn't cover it.
// import './LoginPage.css'; 

const LoginPage = () => {
  return (
    // Added a class for potential page-level styling
    <div className="auth-page-container">
      <LoginForm />
    </div>
  );
};

export default LoginPage;