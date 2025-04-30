// src/components/Dashboard/Individual/RequestFormIndividual.jsx

import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
// Remove the import for createProductRequest from a separate service file
// import { createProductRequest } from '../../../services/api';
// *** Import useAuth hook to access the authenticated apiClient and user info ***
import useAuth from '../../../hooks/useAuth';

const RequestFormIndividual = () => {
  // Use AuthContext to get the apiClient for making authenticated requests
  // and potentially user info if needed for display (though not strictly for the payload structure)
  // *** Get apiClient from useAuth ***
  const { apiClient, user } = useAuth(); // Assuming useAuth exposes apiClient

  // State for form inputs and fetched data
  const [productType, setProductType] = useState(''); // Stores the selected productType ID (string)
  const [quantity, setQuantity] = useState(1);
  const [availableProducts, setAvailableProducts] = useState([]); // [{id: 1, name: 'Pads Regular'}, ...]

  // State for UI feedback (loading, messages)
  const [isLoading, setIsLoading] = useState(false); // Loading state for fetch AND submit
  const [isFetchingProducts, setIsFetchingProducts] = useState(true); // Separate loading state for initial fetch
  const [message, setMessage] = useState(''); // Success message
  const [error, setError] = useState(''); // Error message

  // *** Implement Fetching Available Product Types from API ***
  const fetchProductTypes = useCallback(async (client) => { // Wrap fetch logic in useCallback
    setIsFetchingProducts(true); // Set fetching state
    setError(''); // Clear previous errors
    setMessage(''); // Clear messages
    setAvailableProducts([]); // Clear previous products

    try {
      console.log("RequestFormIndividual: Attempting to fetch product types...");
      // Use the provided apiClient instance to make the GET request
      const response = await client.get('/product-types/');
      console.log("RequestFormIndividual: Product types fetched successfully:", response.data);

      // Update state with fetched data
      const fetchedProducts = response.data.results;
      setAvailableProducts(fetchedProducts);

      // Set default product type if data is available
      if (response.data.length > 0) {
        // Set default to the ID of the first product, ensure it's a string for the select value
        // The <select> value should be a string, but the API expects an integer ID
        setProductType(String(response.data[0].id));
      } else {
         setProductType(''); // No products available
      }

    } catch (err) {
      console.error("RequestFormIndividual: Failed to fetch product types:", err.response?.data || err.message);
       // Improved error formatting for fetch errors
      let errorMsg = "Could not load available product types.";
       if (err.response?.data) {
           try {
               const messages = Object.values(err.response.data).map(value =>
                  Array.isArray(value) ? value.join(', ') : String(value)
               ).join('\n');
               errorMsg = `Failed to load products: ${messages}`;
           } catch {
               errorMsg = `Failed to load products: ${JSON.stringify(err.response.data)}`;
           }
       } else if (err.message) {
           errorMsg = `Failed to load products: ${err.message}`;
       }
      setError(errorMsg);

    } finally {
      setIsFetchingProducts(false); // Reset fetching state
    }
  }, []); // fetchProductTypes itself has no external dependencies it needs to react to


  // useEffect to call fetchProductTypes when apiClient becomes available (on mount)
  useEffect(() => {
     console.log("RequestFormIndividual useEffect [apiClient] triggered. apiClient is available:", !!apiClient);
    // Only call fetch if apiClient is available from useAuth
    if (apiClient) {
       fetchProductTypes(apiClient); // Pass the apiClient instance
    } else {
       // This else block might not be strictly necessary if ProtectedRoute ensures AuthProvider is ready,
       // but it's a defensive check.
       console.warn("RequestFormIndividual useEffect: API Client not available yet.");
       setError("Authentication context not fully loaded. Please wait or try logging in again.");
       setIsFetchingProducts(false); // Ensure fetching state is false if client is missing
    }
     // Add apiClient and the fetch function itself to dependency array.
     // React recommends adding the fetchProductTypes function even though it's wrapped in useCallback.
  }, [apiClient, fetchProductTypes]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state for submission
    setMessage('');
    setError('');

    // Basic frontend validation
    if (!productType || parseInt(quantity) <= 0) { // Ensure quantity is a valid number
      setError("Please select a product type and enter a valid quantity.");
      setIsLoading(false);
      return;
    }
    if (availableProducts.length === 0) {
         setError("Product types are not loaded. Cannot submit request.");
         setIsLoading(false);
         return;
    }
    // Ensure a product is actually selected
     if (!productType) {
         setError("Please select a product type.");
         setIsLoading(false);
         return;
     }


    // Prepare data for the backend POST request
    const requestData = {
      product_type: parseInt(productType), // Ensure product_type ID is an integer
      quantity: parseInt(quantity), // Ensure quantity is an integer
      // Do NOT include requester_user, requesting_organization, or phone_number here.
      // The backend view's perform_create logic handles setting the correct one based on the logged-in user's role.
    };
    console.log("RequestFormIndividual: Attempting to submit individual request:", requestData);


    try {
      // Make POST request to the backend endpoint for product requests using the authenticated apiClient
      const response = await apiClient.post('/product-requests/', requestData); // Use apiClient

      console.log("RequestFormIndividual: Request submitted successfully:", response.data);
      // Format the success message using the response data
      // Check if response.data exists and is an object before accessing its properties
      if (response.data && typeof response.data === 'object') {
           // Use optional chaining and fallback values defensively
          const status = response.data.status || 'Pending';
          const assignedCenter = response.data.assigned_distribution_center_name || 'assigned soon';
          const pickupDetails = response.data.pickup_details || 'details pending';
          setMessage(`Request submitted successfully! Status: ${status}. Assigned Center: ${assignedCenter}. Pickup details: ${pickupDetails}.`);

           // Optional: clear the form fields upon success
           // setQuantity(1);
           // setProductType(availableProducts.length > 0 ? String(availableProducts[0].id) : ''); // Reset to first or empty
      } else {
           // Handle unexpected response format (e.g., just a success string)
           setMessage("Request submitted successfully! Details pending.");
      }


      // TODO: Optionally trigger a refresh of a RequestHistory list component on the same page
      // e.g., by calling a prop function like onNewRequest(response.data);

    } catch (err) {
      console.error("RequestFormIndividual: Failed to submit request:", err.response?.data || err.message);

      // *** Implement Improved Error Handling from Backend Response ***
       let errorMsg = "Failed to submit request. Please check your input."; // Default message
       if (err.response?.data) {
           const errors = err.response.data;
           // Try to format common DRF error structures (objects/arrays)
           try {
                const messages = Object.keys(errors).map(key => {
                    const errorList = Array.isArray(errors[key]) ? errors[key].join(', ') : String(errors[key]);
                     // Make field names more user-friendly (optional mapping)
                     let fieldName = key.replace(/_/g, ' '); // e.g., product_type -> product type
                     if (key === 'non_field_errors') fieldName = 'Error'; // General errors
                     else if (key === 'detail') fieldName = 'Error'; // Generic error detail from DRF/permissions

                    return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}: ${errorList}`;
                });
                // Join messages with newline for <pre> tag, filter out empty messages
                errorMsg = messages.filter(msg => msg.length > 0).join('\n');
                 // Fallback if the error object was unexpectedly empty after mapping
                 if (errorMsg.length === 0 && typeof errors === 'object' && Object.keys(errors).length > 0) {
                     errorMsg = `Backend Errors: ${JSON.stringify(errors)}`; // Show raw data if formatting failed but object had keys
                 } else if (errorMsg.length === 0 && typeof errors === 'string') {
                      errorMsg = `Backend Error: ${errors}`; // Show raw string if that's the response
                 } else if (errorMsg.length === 0) {
                     errorMsg = `Backend Error: Unknown format or empty response data. ${JSON.stringify(err.response?.data)}`; // Final fallback
                 }


           } catch (formatError) {
               console.error("RequestFormIndividual: Error formatting backend error message:", formatError);
               // Fallback if error structure is completely unexpected
               errorMsg = `Backend Error: ${JSON.stringify(err.response?.data || {})}`;
           }
       } else if (err.message) {
           // Handle network errors or other non-response errors (no response data)
           errorMsg = `Network Error: ${err.message}`; // Use generic Axios error message
       }
      setError(errorMsg); // Set the formatted error message for display
      // *** End Improved Error Handling ***


    } finally {
      setIsLoading(false); // Ensure loading indicator stops
    }
  };

  // --- Render Form ---
  return (
    <section>
      <h3>Request Menstrual Products</h3>
      {/* Display formatted messages/errors */}
      {message && <p style={styles.success}>{message}</p>}
      {error && <pre style={styles.error}>{error}</pre>} {/* Use <pre> for newline formatting */}

      {/* Show loading state or the form */}
      {isFetchingProducts ? ( // Use isFetchingProducts for the initial load
         <p>Loading product types...</p>
      ) : !apiClient ? (
           <p style={styles.error}>API Client not available. Authentication context issue.</p> // Should not happen if ProtectedRoute used
       ) : availableProducts.length === 0 ? (
           <p>No product types available at this time.</p> // Message if no products loaded
      ) : (
           <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                  <label htmlFor="productType">Product Type:</label>
                  <select
                    id="productType"
                    name="productType" // Use name for consistency
                    value={productType} // This value state holds the ID (as a string)
                    onChange={(e) => setProductType(e.target.value)} // Update state with the selected option's value (the ID string)
                    required
                    style={styles.input}
                    disabled={isLoading} // Disable while submitting
                  >
                    {/* Render options from fetched productTypes */}
                    {/* The option's value should be the product's ID (as a string for the select value) */}
                    {/* The displayed text is the product's name */}
                    {availableProducts.map(product => (
                      <option key={product.id} value={String(product.id)}>{product.name}</option>
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
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} // Parse input value to integer, default to 1 if invalid
                    min="1"
                    required
                    style={styles.input}
                    disabled={isLoading} // Disable while submitting
                  />
                </div>

                <button type="submit" disabled={isLoading} style={styles.button}>
                  {isLoading ? 'Submitting...' : 'Submit Request'}
                </button>
          </form>
      )}
    </section>
  );
};

// Basic styles (consider moving to CSS modules or styled-components)
const styles = {
  form: { margin: '1rem 0', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' },
  formGroup: { marginBottom: '1rem' },
  input: { display: 'block', width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
  button: { padding: '0.7rem 1.5rem', background: '#d63384', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem' },
   // Optional disabled style for the button
   // buttonDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  error: { color: 'red', marginBottom: '1rem', whiteSpace: 'pre-wrap'}, // Use pre-wrap to respect newlines
  success: { color: 'green', marginBottom: '1rem' }
};

export default RequestFormIndividual;