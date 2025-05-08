import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'; // Import useAuth

const BookTalkPage = () => {
  const { user, isAuthenticated } = useAuth(); // Get user and auth status

  const [formData, setFormData] = useState({
    organizationName: '',
    contactPerson: '',
    email: '',
    phone: '',
    preferredDate: '',
    topicOfInterest: '',
    estimatedAudience: '',
    additionalInfo: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Determine contact person name
      let personName = '';
      if (user.first_name && user.last_name) {
        personName = `${user.first_name} ${user.last_name}`;
      } else if (user.first_name) {
        personName = user.first_name;
      } else {
        personName = user.username || '';
      }

      setFormData(prevData => ({
        ...prevData,
        organizationName: user.organization_name || '',
        contactPerson: personName,
        email: user.email || '',
        phone: user.phone_number || ''
      }));
    }
  }, [user, isAuthenticated]); // Rerun if user or auth status changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to a backend API
    console.log("Booking Request Submitted:", formData);
    setIsSubmitted(true);
    // Consider resetting form: setFormData({ organizationName: '', ...etc. });
  };
  
  const styles = {
    pageContainer: { padding: '20px 30px', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', maxWidth: '760px', margin: '20px auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
    header: { fontSize: 'clamp(1.7em, 3vw, 2.2em)', color: '#2c3e50', marginBottom: '25px', textAlign: 'center' },
    form: { display: 'flex', flexDirection: 'column', gap: '18px' },
    inputGroup: { display: 'flex', flexDirection: 'column' },
    label: { marginBottom: '6px', fontWeight: '600', color: '#34495e', fontSize: '0.95em' },
    input: { padding: '10px 12px', border: '1px solid #bdc3c7', borderRadius: '4px', fontSize: '1em', boxSizing: 'border-box' }, // Added boxSizing
    textarea: { padding: '10px 12px', border: '1px solid #bdc3c7', borderRadius: '4px', fontSize: '1em', minHeight: '100px', boxSizing: 'border-box' }, // Added boxSizing
    submitButton: { padding: '12px 20px', backgroundColor: '#5A4CAD', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1.05em', cursor: 'pointer', transition: 'background-color 0.2s ease', marginTop: '10px' },
    backLink: { display: 'inline-block', marginTop: '25px', padding: '10px 18px', backgroundColor: '#7f8c8d', color: 'white', textDecoration: 'none', borderRadius: '5px', transition: 'background-color 0.2s ease' },
    successMessage: { padding: '15px', backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', borderRadius: '5px', textAlign: 'center', marginBottom: '20px' }
  };

  // JS-based hover effects for inline styles
  const applyButtonHover = (e, hover) => {
    e.currentTarget.style.backgroundColor = hover ? '#483D8B' : '#5A4CAD'; // Darker purple for submit
  };
  const applyBackLinkHover = (e, hover) => {
    e.currentTarget.style.backgroundColor = hover ? '#6c7a7b' : '#7f8c8d';
  };

  if (isSubmitted) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.successMessage}>
          Thank you for your request! We have received your booking information and will be in touch shortly.
        </div>
        <Link 
          to="/dashboard/organization" 
          style={styles.backLink} 
          onMouseOver={(e) => applyBackLinkHover(e, true)}
          onMouseOut={(e) => applyBackLinkHover(e, false)}
        >
          &larr; Back to Organization Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.header}>Book a Talk or Workshop</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="organizationName" style={styles.label}>Organization Name:</label>
          <input type="text" id="organizationName" name="organizationName" value={formData.organizationName} onChange={handleChange} required style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="contactPerson" style={styles.label}>Contact Person:</label>
          <input type="text" id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="email" style={styles.label}>Email Address:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="phone" style={styles.label}>Phone Number:</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="preferredDate" style={styles.label}>Preferred Date(s):</label>
          <input type="date" id="preferredDate" name="preferredDate" value={formData.preferredDate} onChange={handleChange} style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="topicOfInterest" style={styles.label}>Topic(s) of Interest:</label>
          <input type="text" id="topicOfInterest" name="topicOfInterest" value={formData.topicOfInterest} onChange={handleChange} required style={styles.input} placeholder="e.g., MHM Fundamentals, Sustainable Menstruation"/>
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="estimatedAudience" style={styles.label}>Estimated Audience Size:</label>
          <input type="number" id="estimatedAudience" name="estimatedAudience" value={formData.estimatedAudience} onChange={handleChange} style={styles.input} min="1" />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="additionalInfo" style={styles.label}>Additional Information or Specific Requests:</label>
          <textarea id="additionalInfo" name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} style={styles.textarea}></textarea>
        </div>
        <button 
          type="submit" 
          style={styles.submitButton} 
          onMouseOver={(e) => applyButtonHover(e, true)}
          onMouseOut={(e) => applyButtonHover(e, false)}
        >
          Submit Booking Request
        </button>
      </form>
      <Link 
        to="/dashboard/organization" 
        style={styles.backLink} 
        onMouseOver={(e) => applyBackLinkHover(e, true)}
        onMouseOut={(e) => applyBackLinkHover(e, false)}
      >
        &larr; Back to Organization Dashboard
      </Link>
    </div>
  );
};

export default BookTalkPage; 