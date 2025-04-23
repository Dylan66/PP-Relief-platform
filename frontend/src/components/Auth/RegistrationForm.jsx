// src/components/Auth/RegistrationForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'; // Import the hook that uses AuthContext

const RegistrationForm = () => {
  // User Type state - Keep this if you plan to collect profile info later
  const [userType, setUserType] = useState('individual'); // 'individual', 'organization', 'donor'

  // Form Data State - Includes fields for potential profile info
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    location: '', // For Individual & Org profiles (collected here, sent later)
    organization_name: '', // For Org profiles (collected here, sent later)
    first_name: '', // Optional standard User fields
    last_name: '', // Optional standard User fields
  });

  const [error, setError] = useState(''); // Stores formatted error messages for display
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth(); // Get the register function from context
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Keep userType change handler if needed for conditional fields
  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    setFormData(prev => ({
        ...prev,
        location: userType === 'donor' ? '' : prev.location,
        organization_name: userType !== 'organization' ? '' : prev.organization_name,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Frontend password match check
    if (formData.password !== formData.password2) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    // Prepare the data object expected by the `register` function in AuthContext
    // This might include profile fields now, BUT AuthContext's register function
    // will filter them before sending to the backend registration endpoint.
    const registrationAttemptData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      password2: formData.password2,
      // Include other fields if AuthContext might use them (like first/last name)
      // first_name: formData.first_name,
      // last_name: formData.last_name,

      // You can keep profile data here if you intend to use it immediately
      // after successful registration in a subsequent step/call,
      // BUT it's NOT sent by the default register function in AuthContext.
      // user_type: userType,
      // location: formData.location,
      // organization_name: formData.organization_name,
    };

    try {
       console.log("RegistrationForm: Calling register function with:", registrationAttemptData);
      // Call the register function from AuthContext
      await register(registrationAttemptData);

      // Handle successful registration
      // Maybe show a success message and redirect to login page
      alert("Registration successful! Please log in.");
      navigate('/login'); // Redirect user to login after successful registration

    } catch (err) {
      // Catch the error re-thrown by the AuthContext register function
      console.error("RegistrationForm: Caught error during registration!", err);
      console.error("RegistrationForm: Error response data:", err.response?.data); // Log specific backend errors

      // Process backend validation errors for display
      let errorMsg = 'Registration failed. Please check your input and try again.';
      if (err.response?.data) {
          const errors = err.response.data;
          // Format errors from DRF (often objects/arrays) into a readable string
          try {
             const messages = Object.keys(errors).map(key => {
                 const errorList = Array.isArray(errors[key]) ? errors[key].join(', ') : String(errors[key]);
                 // Make field names more user-friendly if needed
                 const fieldName = key.replace(/_/g, ' '); // e.g., non_field_errors -> non field errors
                 return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}: ${errorList}`;
             });
             errorMsg = messages.join('\n');
          } catch (formatError) {
              console.error("Error formatting backend error message:", formatError)
              // Fallback if error structure is unexpected
              errorMsg = JSON.stringify(err.response.data);
          }
      } else if (err.message) {
          errorMsg = err.message; // Use generic Axios error message if no response data
      }
      setError(errorMsg); // Set the formatted error message for display

    } finally {
      setIsLoading(false); // Ensure loading indicator stops
    }
  };

  // --- Render Form ---
  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Register</h2>
      {/* Display formatted error messages */}
      {error && <pre style={styles.error}>{error}</pre>}

      {/* User Type Selection - Keep if collecting profile info */}
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
        <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} required style={styles.input} />
      </div>
      <div style={styles.formGroup}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required style={styles.input} />
      </div>
      {/* Optional First/Last Name */}
      {/* <div style={styles.formGroup}>
        <label htmlFor="first_name">First Name:</label>
        <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleInputChange} style={styles.input} />
      </div>
       <div style={styles.formGroup}>
        <label htmlFor="last_name">Last Name:</label>
        <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleInputChange} style={styles.input} />
      </div> */}
      <div style={styles.formGroup}>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required style={styles.input} />
      </div>
       <div style={styles.formGroup}>
        <label htmlFor="password2">Confirm Password:</label>
        <input type="password" id="password2" name="password2" value={formData.password2} onChange={handleInputChange} required style={styles.input} />
      </div>

      {/* --- Conditional Profile Fields (Collected now, sent later) --- */}
      {(userType === 'individual' || userType === 'organization') && (
        <div style={styles.formGroup}>
          <label htmlFor="location">Location (City/Area):</label>
          <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} required={userType !== 'donor'} style={styles.input} />
          <small> (For finding nearby centers)</small>
        </div>
      )}

      {userType === 'organization' && (
        <div style={styles.formGroup}>
          <label htmlFor="organization_name">Organization Name:</label>
          <input type="text" id="organization_name" name="organization_name" value={formData.organization_name} onChange={handleInputChange} required style={styles.input} />
        </div>
      )}

      {/* --- Submission Button --- */}
      <button type="submit" disabled={isLoading} style={styles.button}>
        {isLoading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

// Basic inline styles (consider moving to CSS modules or styled-components)
const styles = {
   form: { maxWidth: '500px', margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
   formGroup: { marginBottom: '1.2rem' },
   input: { display: 'block', width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', fontSize: '1rem' },
   button: { display: 'block', width: '100%', padding: '0.8rem 1.5rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem', fontSize: '1rem', fontWeight: 'bold' },
   buttonDisabled: { background: '#aaa', cursor: 'not-allowed'}, // Add later if needed
   error: { color: 'red', marginBottom: '1rem', whiteSpace: 'pre-wrap', background: '#ffe0e0', border: '1px solid red', padding: '0.75rem', borderRadius: '4px', fontSize: '0.9rem'},
   radioLabel: { marginRight: '1rem', display: 'inline-block', marginBottom: '0.5rem' } // Style radio buttons better if needed
};

export default RegistrationForm;