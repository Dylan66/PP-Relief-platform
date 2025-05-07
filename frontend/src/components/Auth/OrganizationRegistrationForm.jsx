import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { FaEye, FaEyeSlash, FaFacebook, FaGoogle } from 'react-icons/fa';

const OrganizationRegistrationForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    businessRegNumber: '',
    estimatedWomenOrGirls: '',
    password: '',
    confirmPassword: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth(); // Assuming register function can handle organization type
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // --- Start Validation ---
    if (!formData.companyName.trim()) {
        setError("Please enter the company name.");
        return;
    }
    if (!formData.companyEmail.trim()) {
        setError("Please enter the company email.");
        return;
    }
    // Add other specific validations for organization form if needed here
    // e.g., for businessRegNumber or estimatedWomenOrGirls

    if (formData.password.length <= 8) {
      setError("Password must be longer than 8 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreedToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }
    // --- End Validation ---

    setIsLoading(true);

    const registrationAttemptData = {
      organization_name: formData.companyName,
      email: formData.companyEmail,
      username: formData.companyEmail,
      business_registration_number: formData.businessRegNumber,
      estimated_beneficiaries: formData.estimatedWomenOrGirls,
      password: formData.password,
      password2: formData.confirmPassword,
    };
    
    console.log("OrganizationRegistrationForm: Data for submission:", registrationAttemptData);

    try {
      await register(registrationAttemptData, 'organization'); 

      // On successful registration, RegisterPage.jsx handles redirect via useAuth
      // No need to navigate or alert here if global state handles it.

    } catch (err) {
      console.error("OrganizationRegistrationForm: Registration error", err);
      let errorMsg = 'Registration failed. Please check your input.';
      if (err.response?.data) {
        const errors = err.response.data;
        try {
          const messages = Object.keys(errors).map(key => {
            const errorList = Array.isArray(errors[key]) ? errors[key].join(', ') : String(errors[key]);
            let fieldName = key.replace(/_/g, ' ');
            // Map backend error keys to user-friendly names
            if (key === 'organization_name') fieldName = 'Name of Company';
            else if (key === 'companyEmail' || key === 'email') fieldName = 'Company Email';
            else if (key === 'business_registration_number') fieldName = 'Business Registration Number';
            else if (key === 'estimated_beneficiaries') fieldName = 'Estimated Number of Women or Girls';
            else if (key === 'password') fieldName = 'Password';
            else if (key === 'username') fieldName = 'Username/Email';
            else if (key === 'non_field_errors' || key === 'detail') fieldName = 'Error';
            return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}: ${errorList}`;
          });
          errorMsg = messages.filter(msg => msg.length > 0).join('\n');
           if (errorMsg.length === 0 && typeof errors.detail === 'string') {
               errorMsg = errors.detail;
           } else if (errorMsg.length === 0) {
               errorMsg = JSON.stringify(errors);
           }
        } catch (formatError) {
          console.error("Error formatting backend error:", formatError);
          if (err.response?.data?.detail) {
            errorMsg = err.response.data.detail;
          } else {
            errorMsg = JSON.stringify(err.response.data);
          }
        }
      } else if (err.message) {
        errorMsg = `Network Error: ${err.message}`;
      }
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Reusing styles from RegistrationForm.jsx (or a shared style object)
  // For simplicity, copying relevant styles here. Consider a shared CSS module or styled-components theme.
  const styles = {
    formContainer: { width: '100%', maxWidth: '400px', padding: '0px', boxSizing: 'border-box', fontFamily: '"Arial", sans-serif', color: '#333' },
    formTitle: { fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', color: '#333', textAlign: 'left' },
    form: { display: 'flex', flexDirection: 'column' },
    formGroup: { marginBottom: '15px' },
    formGroupPassword: { marginBottom: '15px', position: 'relative', display: 'flex', alignItems: 'center' },
    input: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontSize: '0.9rem' },
    inputPassword: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontSize: '0.9rem', paddingRight: '40px' },
    eyeIcon: { position: 'absolute', right: '10px', cursor: 'pointer', color: '#777' },
    termsContainer: { display: 'flex', alignItems: 'flex-start', marginBottom: '20px', fontSize: '0.75rem', color: '#555' },
    checkbox: { marginRight: '8px', marginTop: '2px', accentColor: '#E6A5E6' },
    termsLabel: { lineHeight: '1.4' },
    link: { color: '#D973D9', textDecoration: 'none' },
    signUpButton: { backgroundColor: '#FAD1FA', color: '#333', padding: '12px', border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px' },
    orWithContainer: { display: 'flex', alignItems: 'center', margin: '20px 0', color: '#777' },
    hr: { flexGrow: 1, border: 'none', borderTop: '1px solid #ddd' },
    orWithText: { padding: '0 10px', fontSize: '0.9rem' },
    socialButton: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem', cursor: 'pointer', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '500' },
    facebookButton: { backgroundColor: '#1877F2', color: 'white', borderColor: '#1877F2' },
    googleButton: { backgroundColor: 'white', color: '#444', borderColor: '#ccc' },
    socialIcon: { marginRight: '10px', fontSize: '1.2rem' },
    loginLinkContainer: { textAlign: 'center', fontSize: '0.9rem', marginTop: '20px', color: '#333' },
    loginLink: { color: '#D973D9', fontWeight: 'bold', textDecoration: 'none' },
    error: { color: 'red', marginBottom: '1rem', whiteSpace: 'pre-wrap', background: '#ffe0e0', border: '1px solid red', padding: '0.75rem', borderRadius: '4px', fontSize: '0.9rem', textAlign: 'left' },
  };

  return (
    <div style={styles.formContainer}>
      <h3 style={styles.formTitle}>Organization Sign Up</h3>
      {error && <pre style={styles.error}>{error}</pre>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <input type="text" name="companyName" placeholder="Name of Company" value={formData.companyName} onChange={handleInputChange} required style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <input type="email" name="companyEmail" placeholder="Company Email" value={formData.companyEmail} onChange={handleInputChange} required style={styles.input} autoComplete="email" />
        </div>
        <div style={styles.formGroup}>
          <input type="text" name="businessRegNumber" placeholder="Business Registration Number" value={formData.businessRegNumber} onChange={handleInputChange} style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <input type="number" name="estimatedWomenOrGirls" placeholder="Estimated Number of Women or Girls" value={formData.estimatedWomenOrGirls} onChange={handleInputChange} style={styles.input} min="0" />
        </div>
        <div style={styles.formGroupPassword}>
          <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required style={styles.inputPassword} autoComplete="new-password" />
          <span onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
        </div>
        <div style={styles.formGroupPassword}>
          <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} required style={styles.inputPassword} autoComplete="new-password"/>
          <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</span>
        </div>
        <div style={styles.termsContainer}>
          <input type="checkbox" id="orgAgreedToTerms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} style={styles.checkbox} />
          <label htmlFor="orgAgreedToTerms" style={styles.termsLabel}>
            By clicking on 'sign up', you're agreeing to the Her Ubuntu <Link to="/terms" style={styles.link}>Terms of Service</Link> and <Link to="/privacy" style={styles.link}>Privacy Policy</Link>
          </label>
        </div>
        <button type="submit" disabled={isLoading} style={styles.signUpButton}>
          {isLoading ? 'Signing Up...' : 'SignUp'}
        </button>
      </form>

      <div style={styles.orWithContainer}>
        <hr style={styles.hr} />
        <span style={styles.orWithText}>Or With</span>
        <hr style={styles.hr} />
      </div>

      <button style={{ ...styles.socialButton, ...styles.facebookButton }}>
        <FaFacebook style={styles.socialIcon} /> Signup with Facebook
      </button>
      <button style={{ ...styles.socialButton, ...styles.googleButton }}>
        <FaGoogle style={styles.socialIcon} /> Signup with Google
      </button>

      <p style={styles.loginLinkContainer}>
        Already have an account? <Link to="/login" style={styles.loginLink}>Login</Link>
      </p>
    </div>
  );
};

export default OrganizationRegistrationForm; 