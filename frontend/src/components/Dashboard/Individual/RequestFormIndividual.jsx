// src/components/Dashboard/Individual/RequestFormIndividual.jsx

import React, { useState, useEffect, useCallback } from 'react';
import useAuth from '../../../hooks/useAuth';

const RequestFormIndividual = () => {
  const { apiClient, user, isLoading: isAuthLoading } = useAuth();

  const [productType, setProductType] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // *** Implement Fetching Available Product Types from API ***
  // Wrap fetchProductTypes in useCallback if it's used as a dependency elsewhere (it is below)
  const fetchProductTypes = useCallback(async () => {
      setIsLoading(true);
      setError('');
      setMessage('');

      try {
        console.log("Attempting to fetch product types...");
        const response = await apiClient.get('/product-types/');
        console.log("Product types fetched successfully:", response.data);
        setAvailableProducts(response.data.results); // *** FIX: Use response.data.results as per traceback ***

        if (response.data.results.length > 0) { // *** FIX: Check results length ***
          // Check if the previously selected product type ID exists in the new list
          // This avoids resetting the dropdown if the user had already selected something
           const firstProductId = response.data.results[0].id;
           if (!response.data.results.some(product => product.id === productType)) {
              setProductType(firstProductId); // Default to the ID of the first product if current not found
           } else {
              // If previously selected product type is still available, keep it (state update is implicit)
           }

        } else {
           setProductType(''); // No products available
        }

      } catch (err) {
        console.error("Failed to fetch product types:", err.response?.data || err.message);
        setError("Could not load available product types.");
         setAvailableProducts([]); // Clear products on error
         setProductType(''); // Clear selected product
      } finally {
        setIsLoading(false);
      }
  }, [apiClient, productType]); // Keep productType as dependency if you want to ensure selected ID is valid after fetch

  // *** FIX START: Modify useEffect to run only once ***
  useEffect(() => {
      console.log("RequestFormIndividual useEffect [fetchProductTypes] triggered."); // Debug log
    // Fetch products when the component mounts AND apiClient is available
    if (apiClient) {
       fetchProductTypes();
    } else {
       console.warn("API Client not available in RequestFormIndividual useEffect.");
       setError("API client not initialized for product fetch.");
       setIsLoading(false);
    }
  }, [fetchProductTypes]); // Dependency: run when fetchProductTypes changes (due to useCallback dependencies)
  // *** FIX END ***


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
     // Check if availableProducts is actually populated before allowing submission
    if (availableProducts.length === 0) {
         setError("Product types are not loaded. Cannot submit request.");
         setIsLoading(false);
         // You might want to trigger fetchProductTypes again here if you want to re-attempt loading
         // fetchProductTypes();
         return;
    }


    const requestData = {
      product_type: parseInt(productType),
      quantity: parseInt(quantity),
    };
    console.log("Attempting to submit individual request:", requestData);

    try {
      const response = await apiClient.post('/product-requests/', requestData);

      console.log("Request submitted successfully:", response.data);

      const userLocation = user?.location || 'your registered location';
      setMessage(`Request submitted successfully! Status: ${response.data.status}. You can likely pick up your pads near ${userLocation}. Pickup details will be sent via notification/SMS soon.`);

      // *** IMPLEMENT FORM RESET ***
       // Reset form fields after successful submission
       setQuantity(1);
       // Optional: Reset product type to the first one if available
       if (availableProducts.length > 0) {
            setProductType(availableProducts[0].id);
       } else {
            setProductType('');
       }
      // *** END IMPLEMENT FORM RESET ***


      // TODO: Optionally trigger a refresh of a RequestHistory list component on the same page

    } catch (err) {
      console.error("Failed to submit request:", err.response?.data || err);
       let errorMsg = "Failed to submit request. Please try again.";
       // ... (keep error formatting logic) ...
        if (err.response?.data) {
            const errors = err.response.data;
            try {
                 const messages = Object.keys(errors).map(key => {
                     const errorList = Array.isArray(errors[key]) ? errors[key].join(', ') : String(errors[key]);
                      let fieldName = key.replace(/_/g, ' ');
                      if (key === 'non_field_errors') fieldName = 'Error';
                      else if (key === 'detail') fieldName = 'Error';

                     return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}: ${errorList}`;
                 });
                 errorMsg = messages.filter(msg => msg.length > 0).join('\n');
                  if (errorMsg.length === 0 && typeof errors === 'string') {
                       errorMsg = errors;
                  } else if (errorMsg.length === 0 && typeof errors === 'object') {
                      errorMsg = JSON.stringify(errors);
                  } else if (errorMsg.length === 0) {
                       errorMsg = String(errors);
                  }

            } catch (formatError) {
                console.error("Error formatting backend error message:", formatError);
                if (err.response?.data) errorMsg = JSON.stringify(error.response.data);
                else errorMsg = err.message;
            }
        } else if (err.message) {
            errorMsg = `Network Error: ${err.message}`;
        }
       setError(errorMsg);

    } finally {
      setIsLoading(false);
    }
  };

  // Check if auth context is still loading, or if the form's fetch is loading
   const formIsDisabled = isLoading || isAuthLoading || availableProducts.length === 0;

  return (
    <section>
      <h3>Request Menstrual Products</h3>
      {message && <p style={styles.success}>{message}</p>}
      {error && <pre style={styles.error}>{error}</pre>}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Display loading state for products */}
        {(isLoading || isAuthLoading) && availableProducts.length === 0 && <p>Loading products...</p>} {/* Check form OR auth loading */}
        {!isLoading && !isAuthLoading && availableProducts.length === 0 && !error && <p>No products available at this time.</p>} {/* Only show if loading is done and no error */}


        <div style={styles.formGroup}>
          <label htmlFor="productType">Product Type:</label>
          <select
            id="productType"
            name="productType"
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            required
            style={styles.input}
            disabled={formIsDisabled}
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
            name="quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            min="1"
            required
            style={styles.input}
            disabled={formIsDisabled}
          />
        </div>

        <button type="submit" disabled={formIsDisabled} style={styles.button}>
          {isLoading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </section>
  );
};

// Basic styles
const styles = {
  form: { margin: '1rem 0', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' },
  formGroup: { marginBottom: '1rem' },
  input: { display: 'block', width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
  button: { padding: '0.7rem 1.5rem', background: '#d63384', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem' },
  error: { color: 'red', marginBottom: '1rem', whiteSpace: 'pre-wrap'},
  success: { color: 'green', marginBottom: '1rem' }
};

export default RequestFormIndividual;