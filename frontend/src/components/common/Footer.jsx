// src/components/Common/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>© {new Date().getFullYear()} Her Ubuntu. All rights reserved.</p>
      {/* Add other footer links/info */}
    </footer>
  );
};

const styles = {
  footer: {
    textAlign: 'center',
    padding: '1rem',
    marginTop: '2rem',
    background: '#f1f1f1',
    borderTop: '1px solid #ddd'
  }
};

export default Footer;