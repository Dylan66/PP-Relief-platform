// src/components/Dashboard/Donor/DonationOptions.jsx
import React from 'react';

const DonationOptions = () => {
  // TODO: Add state and handlers for different donation types later
  // TODO: Fetch drop-off locations from API

  const handleMoneyDonation = () => {
    alert("Redirecting to M-Pesa/PayPal... (Integration Pending)");
    // window.location.href = 'PAYMENT_LINK';
  };

  const handleProductDonation = () => {
     alert("Showing nearest drop-off locations... (Integration Pending)");
     // Show modal or list of locations fetched from API
  };

   const handleServiceOffer = () => {
      alert("Opening service offer form... (Feature Pending)");
   };

    const handleBecomePickupPoint = () => {
      alert("Opening pickup point sign-up form... (Feature Pending)");
   };


  return (
    <div style={styles.container}>
      <div style={styles.optionCard}>
        <h4>Donate Money</h4>
        <p>Support our operations and product purchasing.</p>
        <button onClick={handleMoneyDonation} style={styles.button}>Donate via M-Pesa/PayPal</button>
      </div>
      <div style={styles.optionCard}>
        <h4>Donate Products</h4>
        <p>Drop off pads, tampons, or other hygiene products.</p>
        {/* TODO: Display list of drop-off centers here */}
        <p><i>Drop-off locations will be listed here.</i></p>
        <button onClick={handleProductDonation} style={styles.button}>Find Drop-off Location</button>
      </div>
      <div style={styles.optionCard}>
        <h4>Offer Professional Services</h4>
        <p>Are you a gynecologist, therapist, or educator?</p>
        <button onClick={handleServiceOffer} style={styles.button}>Offer Services</button>
      </div>
      <div style={styles.optionCard}>
        <h4>Become a Pickup Point</h4>
        <p>Register your safe space as a distribution hub.</p>
        <button onClick={handleBecomePickupPoint} style={styles.button}>Sign Up as Pickup Point</button>
      </div>
    </div>
  );
};

// Basic styles
const styles = {
    container: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1rem' },
    optionCard: { border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    button: { padding: '0.6rem 1.2rem', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem' }
};


export default DonationOptions;