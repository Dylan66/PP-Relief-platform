import React from 'react';
import Footer from '../components/common/Footer'; // Assuming you have a Footer component

const DonateNowPage = () => {
  // Placeholder functions for form submissions or interactions
  const handleMpesaDonation = () => {
    console.log('Mpesa donation initiated');
    // Actual Mpesa integration logic would go here
  };

  const handleStripeDonation = () => {
    console.log('Stripe donation initiated');
    // Actual Stripe integration logic would go here
  };

  const handleProductDonationSubmit = (event) => {
    event.preventDefault();
    console.log('Product donation form submitted');
    // Logic to handle product donation form data
  };

  const handleExpertiseShareSubmit = (event) => {
    event.preventDefault();
    console.log('Expertise sharing form submitted');
    // Logic to handle expertise sharing form data
  };

  return (
    <div style={styles.pageContainer}>
      <main style={styles.mainContent}>
        <h1 style={styles.pageTitle}>Make a Donation</h1>

        <section style={styles.donationSection}>
          <h2 style={styles.sectionTitle}>Monetary Donations</h2>
          <p style={styles.sectionIntro}>
            Your financial support helps us reach more individuals in need. Choose your preferred method:
          </p>
          <div style={styles.paymentOptionsContainer}>
            <div style={styles.paymentOptionCard}>
              <h3 style={styles.paymentOptionTitle}>M-Pesa</h3>
              <p><strong>PayBill Number:</strong> 123456</p>
              <p><strong>Account Number:</strong> YOURNAME</p>
              <p style={styles.smallText}>Use your name or organization name as the account number.</p>
              {/* Placeholder for M-Pesa input fields or button */}
              <button onClick={handleMpesaDonation} style={styles.actionButton}>Donate via M-Pesa</button>
            </div>
            <div style={styles.paymentOptionCard}>
              <h3 style={styles.paymentOptionTitle}>Stripe (Credit/Debit Card)</h3>
              <p>Click the button below to securely donate using your credit or debit card via Stripe.</p>
              <p style={styles.smallText}>You will be redirected to Stripe's secure payment page.</p>
              {/* Placeholder for Stripe elements or button */}
              <button onClick={handleStripeDonation} style={styles.actionButton}>Donate via Stripe</button>
            </div>
          </div>
        </section>

        <section style={styles.donationSection}>
          <h2 style={styles.sectionTitle}>Donate Products</h2>
          <p style={styles.sectionIntro}>
            We accept donations of sanitary pads, reusable menstrual products, and other essential hygiene supplies.
            Please fill out the form below to coordinate your product donation.
          </p>
          <form onSubmit={handleProductDonationSubmit} style={styles.donationForm}>
            <label htmlFor="productName" style={styles.formLabel}>Product(s) you want to donate:</label>
            <input type="text" id="productName" name="productName" style={styles.formInput} required />

            <label htmlFor="quantity" style={styles.formLabel}>Estimated Quantity:</label>
            <input type="text" id="quantity" name="quantity" style={styles.formInput} />

            <label htmlFor="contactNameP" style={styles.formLabel}>Your Name:</label>
            <input type="text" id="contactNameP" name="contactNameP" style={styles.formInput} required />
            
            <label htmlFor="contactEmailP" style={styles.formLabel}>Your Email:</label>
            <input type="email" id="contactEmailP" name="contactEmailP" style={styles.formInput} required />

            <button type="submit" style={styles.submitButton}>Arrange Product Donation</button>
          </form>
        </section>

        <section style={styles.donationSection}>
          <h2 style={styles.sectionTitle}>Share Your Expertise</h2>
          <p style={styles.sectionIntro}>
            Are you a gynecologist, health educator, or have other relevant skills?
            Volunteer your time and knowledge to support our programs.
          </p>
          <form onSubmit={handleExpertiseShareSubmit} style={styles.donationForm}>
            <label htmlFor="expertiseArea" style={styles.formLabel}>Area of Expertise:</label>
            <input type="text" id="expertiseArea" name="expertiseArea" style={styles.formInput} required />

            <label htmlFor="availability" style={styles.formLabel}>Your Availability (e.g., hours per week, specific days):</label>
            <textarea id="availability" name="availability" style={styles.formTextarea} rows="3"></textarea>

            <label htmlFor="contactNameE" style={styles.formLabel}>Your Name:</label>
            <input type="text" id="contactNameE" name="contactNameE" style={styles.formInput} required />

            <label htmlFor="contactEmailE" style={styles.formLabel}>Your Email:</label>
            <input type="email" id="contactEmailE" name="contactEmailE" style={styles.formInput} required />

            <button type="submit" style={styles.submitButton}>Offer My Expertise</button>
          </form>
        </section>

      </main>
      <Footer />
    </div>
  );
};

const styles = {
  pageContainer: {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    backgroundColor: '#f0f0f0',
    color: '#333',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  mainContent: {
    padding: '40px 50px',
    maxWidth: '1000px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    flexGrow: 1,
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    marginBottom: '40px', // Space for footer
  },
  pageTitle: {
    fontSize: 'clamp(2em, 4vw, 2.8em)',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: '40px',
  },
  donationSection: {
    marginBottom: '50px',
    padding: '30px',
    backgroundColor: '#f9f9f9', // Slightly off-white for section background
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },
  sectionTitle: {
    fontSize: 'clamp(1.5em, 3vw, 2em)',
    color: '#5A4CAD', // Purple shade from DonationsPage
    marginBottom: '15px',
    borderBottom: '2px solid #D4C2FF',
    paddingBottom: '10px',
  },
  sectionIntro: {
    fontSize: 'clamp(1em, 1.5vw, 1.1em)',
    color: '#4A4A4A',
    lineHeight: '1.6',
    marginBottom: '25px',
  },
  paymentOptionsContainer: {
    display: 'flex',
    gap: '30px',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  paymentOptionCard: {
    flex: 1,
    minWidth: '280px',
    padding: '25px',
    backgroundColor: '#EAE4FF',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    textAlign: 'center',
  },
  paymentOptionTitle: {
    fontSize: 'clamp(1.2em, 2vw, 1.5em)',
    color: '#5A4CAD',
    marginBottom: '15px',
  },
  smallText: { // New style for smaller descriptive text
    fontSize: '0.85em',
    color: '#555',
    marginTop: '10px',
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '12px 25px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: 'bold',
    marginTop: '15px',
    transition: 'background-color 0.3s ease',
  },
  // Re-use actionButton style for submitButton or create a new one
  // For submitButton, ensure it has ':hover' styles if actionButton does
  donationForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formLabel: {
    fontSize: '0.95em',
    fontWeight: '600',
    color: '#333',
    marginBottom: '5px',
  },
  formInput: {
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1em',
    width: '100%', // Make inputs take full width of their container
    boxSizing: 'border-box',
  },
  formTextarea: {
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1em',
    width: '100%',
    boxSizing: 'border-box',
    minHeight: '80px',
  },
  submitButton: {
    backgroundColor: '#5A4CAD', // Purple shade
    color: 'white',
    padding: '15px 30px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.1em',
    fontWeight: 'bold',
    marginTop: '20px',
    alignSelf: 'flex-start', // Align button to the start if form is wider
    transition: 'background-color 0.3s ease',
  },
  // Add hover styles for buttons if desired, e.g.:
  // 'actionButton:hover': {
  //   backgroundColor: '#45a049',
  // },
  // 'submitButton:hover': {
  //   backgroundColor: '#4A3F9A',
  // }
};

// Ensure styles for :hover are applied correctly, often done with CSS modules or styled-components
// For inline styles, you'd need JavaScript event handlers (onMouseEnter, onMouseLeave) to change styles.

export default DonateNowPage; 