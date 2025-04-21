// src/pages/Auth/RegisterPage.jsx
import React from 'react';
import RegistrationForm from '../../components/Auth/RegistrationForm'; // Create this next

const RegisterPage = () => {
  return (
    <div>
      <h2>Register</h2>
      <p>Choose your account type and fill in the details.</p>
      <RegistrationForm />
    </div>
  );
};

export default RegisterPage;