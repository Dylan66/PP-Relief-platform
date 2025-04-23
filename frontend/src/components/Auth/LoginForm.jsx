// src/components/Auth/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'; // Assuming useAuth hook is correctly set up

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to hold user-facing error messages
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // Get the login function from your Auth context
  const navigate = useNavigate();
  const location = useLocation();
  // Determine where to redirect after successful login
  // Reads the 'from' state passed by ProtectedRoute or defaults to home ('/')
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(''); // Clear previous errors
    setIsLoading(true); // Set loading state

    try {
      // Call the login function from AuthContext with username and password
      await login({ username, password });

      console.log("Login successful in form, attempting navigation to:", from);

      // Navigate to the intended page ('from') or the default page ('/')
      // Use replace: true to avoid the login page being in the history stack
      navigate(from, { replace: true });

    } catch (err) {
      // --- Improved Error Logging ---
      // Log the specific data from the error response if available, otherwise log the general error message
      console.error("Login failed! Response Data:", err.response?.data || err.message);

      // --- Set User-Facing Error Message ---
      let errorMsg = 'Login failed. Please check username and password.'; // Default message
      if (err.response?.data) {
          const errors = err.response.data;
          // dj-rest-auth/allauth often puts general login errors in 'non_field_errors'
          if (errors.non_field_errors && Array.isArray(errors.non_field_errors)) {
              errorMsg = errors.non_field_errors.join(', '); // Join if it's an array
          } else if (typeof errors === 'string') {
              // Sometimes the error might just be a string
              errorMsg = errors;
          } else if (typeof errors === 'object' && errors !== null) {
             // Attempt to format other object-based errors (less common for login)
             try {
                const messages = Object.entries(errors).map(([key, value]) =>
                    `${key}: ${Array.isArray(value) ? value.join(', ') : String(value)}`
                );
                errorMsg = messages.join('; ');
             } catch {
                 // Fallback if formatting fails
                 errorMsg = 'An unexpected error occurred during login.';
             }
          }
      } else if (err.message) {
         // Use Axios error message if no response data (e.g., network error)
         errorMsg = err.message;
      }
      setError(errorMsg); // Update the state to display the error message in the UI

    } finally {
      setIsLoading(false); // Reset loading state regardless of success or failure
      console.log("LoginForm.jsx: setIsLoading(false) called in finally.");
    }
  };

  // --- Render Form ---
  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Login</h2>
      {/* Display the error message if present */}
      {error && <p style={styles.error}>{error}</p>}

      {/* Username Input */}
      <div style={styles.formGroup}>
        <label htmlFor="login-username">Username:</label> {/* Use unique id */}
        <input
          type="text"
          id="login-username" // Use unique id
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username" // Help browser autofill
          style={styles.input}
        />
      </div>

      {/* Password Input */}
      <div style={styles.formGroup}>
        <label htmlFor="login-password">Password:</label> {/* Use unique id */}
        <input
          type="password"
          id="login-password" // Use unique id
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password" // Help browser autofill
          style={styles.input}
        />
      </div>

      {/* Submit Button */}
      <button type="submit" disabled={isLoading} style={styles.button}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

// Basic inline styles (Consider moving to CSS Modules or a UI Library)
const styles = {
  form: { maxWidth: '400px', margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  formGroup: { marginBottom: '1.2rem' },
  input: { display: 'block', width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', fontSize: '1rem' },
  button: { display: 'block', width: '100%', padding: '0.8rem 1.5rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem', fontSize: '1rem', fontWeight: 'bold' },
  error: { color: 'red', marginBottom: '1rem', textAlign: 'center', background: '#ffe0e0', border: '1px solid red', padding: '0.75rem', borderRadius: '4px', fontSize: '0.9rem' }
};

export default LoginForm;