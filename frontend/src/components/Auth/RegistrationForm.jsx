// src/components/Auth/RegistrationForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const RegistrationForm = () => {
  const [userType, setUserType] = useState('individual'); // 'individual', 'organization', 'donor'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    location: '', // Individual & Org
    organization_name: '', // Org only
    // Add organization_id later if needed, maybe after verification
    // Add donor specific fields later if needed
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    // Reset potentially irrelevant fields when type changes? Optional.
    setFormData(prev => ({
        ...prev,
        location: userType === 'donor' ? '' : prev.location, // Donors might not need location initially
        organization_name: userType !== 'organization' ? '' : prev.organization_name,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password2) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);

    // Prepare data based on user type
    const registrationData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      password2: formData.password2,
      user_type: userType, // Send the selected user type
    };

    if (userType === 'individual' || userType === 'organization') {
      registrationData.location = formData.location;
    }
    if (userType === 'organization') {
      registrationData.organization_name = formData.organization_name;
      // Add org_id if applicable
    }
     // Add donor specific fields if any

    try {
      console.log("Submitting registration data:", registrationData);
      await register(registrationData);
      // Registration successful, context handles login/state update.
      // Redirect based on role (ProtectedRoute will handle this on next render)
      // Or navigate explicitly after ensuring auth state is updated
      // For now, let context handle state and redirect happens via ProtectedRoute logic
       alert("Registration successful! Redirecting..."); // Simple feedback
       navigate('/'); // Redirect to home, let protected routes handle dashboard access

    } catch (err) {
      console.error("Registration component error:", err.response?.data || err);
      // Process backend validation errors (complex, requires parsing DRF error format)
       let errorMsg = 'Registration failed. Please check your input.';
       if (err.response?.data) {
           // Simple extraction - improve this based on your actual error structure
           const errors = err.response.data;
           const messages = Object.keys(errors).map(key => `${key}: ${errors[key].join ? errors[key].join(', '): errors[key]}`);
           errorMsg = messages.join('\n');
       }
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {error && <pre style={styles.error}>{error}</pre>} {/* Use pre for multi-line errors */}

      {/* User Type Selection */}
      <div style={styles.formGroup}>
        <label>Register as:</label>
        <div>
          <label style={styles.radioLabel}>
            <input type="radio" value="individual" name="userType" checked={userType === 'individual'} onChange={handleUserTypeChange} /> Individual
          </label>
          <label style={styles.radioLabel}>
            <input type="radio" value="organization" name="userType" checked={userType === 'organization'} onChange={handleUserTypeChange} /> Organization
          </label>
          <label style={styles.radioLabel}>
            <input type="radio" value="donor" name="userType" checked={userType === 'donor'} onChange={handleUserTypeChange} /> Donor
          </label>
        </div>
      </div>

      {/* Common Fields */}
      <div style={styles.formGroup}>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} required style={styles.input} />
      </div>
      <div style={styles.formGroup}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required style={styles.input} />
      </div>
      <div style={styles.formGroup}>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required style={styles.input} />
      </div>
       <div style={styles.formGroup}>
        <label htmlFor="password2">Confirm Password:</label>
        <input type="password" id="password2" name="password2" value={formData.password2} onChange={handleInputChange} required style={styles.input} />
      </div>


      {/* Individual/Organization Fields */}
      {(userType === 'individual' || userType === 'organization') && (
        <div style={styles.formGroup}>
          <label htmlFor="location">Location (City/Area):</label>
          <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} required style={styles.input} />
        </div>
      )}

      {/* Organization Fields */}
      {userType === 'organization' && (
        <div style={styles.formGroup}>
          <label htmlFor="organization_name">Organization Name:</label>
          <input type="text" id="organization_name" name="organization_name" value={formData.organization_name} onChange={handleInputChange} required style={styles.input} />
        </div>
        // Add Org ID input later if needed
      )}

       {/* Donor Fields - None specified for now, but could add contact info etc. */}
       {/* {userType === 'donor' && ( ... inputs ... )} */}


      <button type="submit" disabled={isLoading} style={styles.button}>
        {isLoading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

// Basic styles (reuse/adapt from LoginForm)
const styles = {
   form: { maxWidth: '500px', margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' },
   formGroup: { marginBottom: '1rem' },
   input: { display: 'block', width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
   button: { padding: '0.7rem 1.5rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem' },
   error: { color: 'red', marginBottom: '1rem', whiteSpace: 'pre-wrap', background: '#ffe0e0', border: '1px solid red', padding: '0.5rem', borderRadius: '4px'},
   radioLabel: { marginRight: '1rem' }
};


export default RegistrationForm;