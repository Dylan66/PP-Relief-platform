// src/components/Auth/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/"; // Redirect back or to home

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login({ username, password });
      // Login function in context now handles setting state.
      // Navigation might happen automatically via ProtectedRoute or based on userType check in context effect.
      // For robustness, explicitly navigate after loading state confirmed authenticated:
       navigate(from, { replace: true }); // Navigate back to intended page or home
    } catch (err) {
      setError(err.response?.data?.non_field_errors?.[0] || 'Login failed. Please check username and password.');
      console.error("Login component error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.formGroup}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
      </div>
      <button type="submit" disabled={isLoading} style={styles.button}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

// Basic styles
const styles = {
  form: { maxWidth: '400px', margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' },
  formGroup: { marginBottom: '1rem' },
  input: { width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' },
  button: { padding: '0.7rem 1.5rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  error: { color: 'red', marginBottom: '1rem', textAlign: 'center' }
};


export default LoginForm;