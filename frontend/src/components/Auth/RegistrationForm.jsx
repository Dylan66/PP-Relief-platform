// src/components/Auth/RegistrationForm.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'; // Import the hook that uses AuthContext

const RegistrationForm = () => {
  // User Type state - Keep this if you plan to collect profile info later
  const [userType, setUserType] = useState('individual');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '', // Correct key
    password2: '', // Correct key
    location: '',
    organization_name: '',
    first_name: '',
    last_name: '',
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
    const newUserType = e.target.value;
    setUserType(newUserType);
    setFormData(prev => ({
        ...prev,
        location: (newUserType === 'donor' && prev.location !== '') ? '' : prev.location,
        organization_name: (newUserType !== 'organization' && prev.organization_name !== '') ? '' : prev.organization_name,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password2) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    if (userType === 'organization' && !formData.organization_name) {
         setError("Organization Name is required for Organization registration.");
         setIsLoading(false);
         return;
    }
    if ((userType === 'individual' || userType === 'organization') && userType !== 'donor' && !formData.location) {
         setError("Location is required for Individual or Organization registration.");
         setIsLoading(false);
         return;
    }


    setIsLoading(true);

    const registrationAttemptData = {
      username: formData.username,
      email: formData.email,
      password: formData.password, // Correct key
      password2: formData.password2, // Correct key
      first_name: formData.first_name,
      last_name: formData.last_name,
    };

    // *** DEBUG LOG: See the data object being sent to AuthContext's register function ***
    console.log("RegistrationForm: Data object being sent to AuthContext register:", registrationAttemptData);
    // *** END DEBUG LOG ***


    try {
       console.log("RegistrationForm: Calling register function with:", registrationAttemptData);
      await register(registrationAttemptData);

      alert("Registration successful! You will now be taken to your dashboard.");
      // navigate('/dashboard'); // assuming auto-login
      // navigate('/login'); // if auto-login is OFF

    } catch (err) {
      console.error("RegistrationForm: Caught error during registration!", err);
      console.error("RegistrationForm: Error response data:", err.response?.data);

      let errorMsg = 'Registration failed. Please check your input and try again.';
      if (err.response?.data) {
          const errors = err.response.data;
          try {
             const messages = Object.keys(errors).map(key => {
                 const errorList = Array.isArray(errors[key]) ? errors[key].join(', ') : String(errors[key]);
                 let fieldName = key.replace(/_/g, ' ');
                 if (key === 'password') fieldName = 'Password';
                 else if (key === 'password2') fieldName = 'Confirm Password';
                 else if (key === 'username') fieldName = 'Username';
                 else if (key === 'email') fieldName = 'Email';
                 else if (key === 'non_field_errors') fieldName = 'Error';
                 else if (key === 'detail') fieldName = 'Error';

                 return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}: ${errorList}`;
             });
             errorMsg = messages.filter(msg => msg.length > 0).join('\n');
             if (errorMsg.length === 0 && typeof errors === 'string') {
                  errorMsg = errors;
             } else if (errorMsg.length === 0) {
                 errorMsg = JSON.stringify(errors);
             }

          } catch (formatError) {
              console.error("Error formatting backend error message:", formatError)
              errorMsg = JSON.stringify(err.response.data);
          }
      } else if (err.message) {
          errorMsg = `Network Error: ${err.message}`;
      }
      setError(errorMsg);

    } finally {
      setIsLoading(false);
      console.log("RegistrationForm.jsx: setIsLoading(false) called in finally.");
    }
  };

  // --- Render Form ---
  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Register</h2>
      {error && <pre style={styles.error}>{error}</pre>}

      {/* User Type Selection */}
      <div style={styles.formGroup}>
        <label>I am registering as:</label>
        <div>
          <label style={styles.radioLabel}>
            <input type="radio" value="individual" name="userType" checked={userType === 'individual'} onChange={handleUserTypeChange} /> Individual Requester
          </label>
          <label style={styles.radioLabel}>
            <input type="radio" value="organization" name="userType" checked={userType === 'organization'} onChange={handleUserTypeChange} /> Organization
          </label>
          <label style={styles.radioLabel}>
            <input type="radio" value="donor" name="userType" checked={userType === 'donor'} onChange={handleUserTypeChange} /> Donor
          </label>
        </div>
      </div>

      {/* --- Required Registration Fields --- */}
      <div style={styles.formGroup}>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} required style={styles.input} autoComplete="username" />
      </div>
      <div style={styles.formGroup}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required style={styles.input} autoComplete="email" />
      </div>
      {/* Optional First/Last Name */}
       {/* <div style={styles.formGroup}> ... inputs for first_name/last_name ... </div> */}

      <div style={styles.formGroup}>
        <label htmlFor="password">Password:</label>
        {/* *** THIS INPUT's NAME ATTRIBUTE MUST BE 'password' *** */}
        <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required style={styles.input} autoComplete="new-password" />
      </div>

       <div style={styles.formGroup}>
        <label htmlFor="password2">Confirm Password:</label>
        {/* THIS INPUT's NAME ATTRIBUTE MUST BE 'password2' */}
        <input type="password" id="password2" name="password2" value={formData.password2} onChange={handleInputChange} required style={styles.input} autoComplete="new-password" />
      </div>

      {/* --- Conditional Profile Fields --- */}
      {(userType === 'individual' || userType === 'organization') && userType !== 'donor' && (
        <div style={styles.formGroup}>
          <label htmlFor="location">Location (City/Area):</label>
          <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} required={userType !== 'donor'} style={styles.input} autoComplete={userType === 'organization' ? 'organization-address' : 'street-address'}/>
          <small> (For finding nearby centers)</small>
        </div>
      )}

      {userType === 'organization' && (
        <div style={styles.formGroup}>
          <label htmlFor="organization_name">Organization Name:</label>
          <input type="text" id="organization_name" name="organization_name" value={formData.organization_name} onChange={handleInputChange} required={userType === 'organization'} style={styles.input} autoComplete="organization" />
        </div>
      )}
      {/* Add fields for Donor if needed */}


      {/* --- Submission Button --- */}
      <button type="submit" disabled={isLoading} style={styles.button}>
        {isLoading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

// Basic inline styles
const styles = {
   form: { maxWidth: '500px', margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
   formGroup: { marginBottom: '1.2rem' },
   input: { display: 'block', width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', fontSize: '1rem' },
   button: { display: 'block', width: '100%', padding: '0.8rem 1.5rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem', fontSize: '1rem', fontWeight: 'bold' },
   buttonDisabled: { background: '#aaa', cursor: 'not-allowed'},
   error: { color: 'red', marginBottom: '1rem', whiteSpace: 'pre-wrap', background: '#ffe0e0', border: '1px solid red', padding: '0.75rem', borderRadius: '4px', fontSize: '0.9rem'},
   radioLabel: { marginRight: '1rem', display: 'inline-block', marginBottom: '0.5rem' }
};

export default RegistrationForm;