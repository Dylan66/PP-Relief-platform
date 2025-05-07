// src/components/Auth/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './LoginForm.css';

// Placeholder for logo - replace with actual path or import
// import logoImage from '../../../assets/logo.png'; // Example path

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Assuming login function expects an object with email and password
      // If it expects { username, password }, you might need to pass { username: email, password }
      await login({ email, password }); 
      console.log("Login successful in form, attempting navigation to:", from);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login failed! Response Data:", err.response?.data || err.message);
      let errorMsg = 'Login failed. Please check your credentials.';
      if (err.response?.data) {
        const errors = err.response.data;
        if (errors.non_field_errors && Array.isArray(errors.non_field_errors)) {
          errorMsg = errors.non_field_errors.join(', ');
        } else if (typeof errors === 'string') {
          errorMsg = errors;
        } else if (typeof errors === 'object' && errors !== null) {
          try {
            const messages = Object.entries(errors).map(([key, value]) =>
              `${key}: ${Array.isArray(value) ? value.join(', ') : String(value)}`
            );
            errorMsg = messages.join('; ');
          } catch {
            errorMsg = 'An unexpected error occurred during login.';
          }
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-form-wrapper">
      <div className="login-logo-container">
        {/* Replace with actual logo image - ensure you have the image in your assets */}
        <img src="/company_hero_image.jpeg" alt="Her Ubuntu Logo" className="login-logo-image" />
        {/* <div className="logo-placeholder-graphic">[Logo Graphic Placeholder]</div> */}
        <h1 className="login-title-text">HER UBUNTU</h1>
      </div>

      <div className="login-form-container">
        <h2 className="login-welcome-text">Hello, Welcome Back!</h2>
        
        {error && <p className="login-error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <input 
              type="email" 
              placeholder="Email" 
              className="login-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              autoComplete="email"
            />
          </div>
          <div className="login-input-group">
            <input 
              type="password" 
              placeholder="Password" 
              className="login-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              autoComplete="current-password"
            />
            {/* Placeholder for visibility toggle icon - Implement functionality if needed */}
            <span className="password-visibility-toggle">👁️</span> 
          </div>
          
          <div className="login-options">
            <label className="login-remember-me">
              <input type="checkbox" /> Remember Me
            </label>
            {/* Using Link for client-side navigation if you have a route for it */}
            <Link to="/forgot-password" className="login-forgot-password">Forgotten password?</Link>
          </div>
          
          <button type="submit" className="login-button-submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-divider">
          <span className="login-divider-text">Or With</span>
        </div>

        <div className="login-social-buttons">
          <button type="button" className="login-social-button facebook" onClick={() => console.log('Login with Facebook clicked')}>
            {/* Placeholder for Facebook icon - replace with actual icon/SVG */}
            <span className="social-icon">f</span> Login with Facebook
          </button>
          <button type="button" className="login-social-button google" onClick={() => console.log('Login with Google clicked')}>
            {/* Placeholder for Google icon - replace with actual icon/SVG */}
            <span className="social-icon">G</span> Login with Google
          </button>
        </div>

        <div className="login-signup-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;