// src/components/Dashboard/Individual/RequestFormIndividual.jsx
import React, { useState, useEffect } from 'react';
import { createProductRequest } from '../../../services/api'; // Assuming API service is set up

const RequestFormIndividual = () => {
  const [productType, setProductType] = useState(''); // Should fetch product types from API
  const [quantity, setQuantity] = useState(1); // Default quantity
  const [availableProducts, setAvailableProducts] = useState([]); // [{id: 1, name: 'Pads Regular'}, ...]
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // TODO: Fetch available product types from API on component mount
  useEffect(() => {
    // Example: fetchProductTypes().then(data => setAvailableProducts(data));
     setAvailableProducts([
        { id: 1, name: "Sanitary Pads (Regular)" },
        { id: 2, name: "Sanitary Pads (Heavy)" },
        { id: 3, name: "Tampons (Regular)" },
      ]); // Placeholder
      if (availableProducts.length > 0) {
          setProductType(availableProducts[0].id); // Default to first product
      }
  }, []); // Run once on mount


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    if (!productType || quantity <= 0) {
      setError("Please select a product type and enter a valid quantity.");
      setIsLoading(false);
      return;
    }

    try {
      // API call expects product_type ID and quantity
      const response = await createProductRequest({ product_type: parseInt(productType), quantity });
      setMessage(`Request submitted successfully! Status: ${response.data.status}. Pickup details will be sent via notification/SMS soon.`);
      // Reset form?
      // setQuantity(1);
    } catch (err) {
      console.error("Request failed:", err.response?.data || err);
      setError("Failed to submit request. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3>Request Menstrual Products</h3>
      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.formGroup}>
        <label htmlFor="productType">Product Type:</label>
        <select
          id="productType"
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
          required
          style={styles.input}
          disabled={availableProducts.length === 0}
        >
          <option value="" disabled>Select a product...</option>
          {availableProducts.map(product => (
            <option key={product.id} value={product.id}>{product.name}</option>
          ))}
        </select>
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="quantity">Quantity (Packs/Units):</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          min="1"
          required
          style={styles.input}
        />
      </div>

      <button type="submit" disabled={isLoading} style={styles.button}>
        {isLoading ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
};

// Basic styles
const styles = {
  form: { margin: '1rem 0', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' },
  formGroup: { marginBottom: '1rem' },
  input: { display: 'block', width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
  button: { padding: '0.7rem 1.5rem', background: '#d63384', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem' },
  error: { color: 'red', marginBottom: '1rem'},
  success: { color: 'green', marginBottom: '1rem' }
};

export default RequestFormIndividual;