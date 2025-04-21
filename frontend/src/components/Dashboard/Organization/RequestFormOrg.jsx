// src/components/Dashboard/Organization/RequestFormOrg.jsx
import React, { useState, useEffect } from 'react';
// Assuming you will create a function to fetch product types later
// import { getProductTypes } from '../../../services/api';
import { createProductRequest } from '../../../services/api';

const RequestFormOrg = () => {
   const [productType, setProductType] = useState(''); // Initialize as empty string
   const [quantity, setQuantity] = useState(5); // Default higher quantity for orgs
   const [availableProducts, setAvailableProducts] = useState([]); // Start empty
   const [isLoading, setIsLoading] = useState(false); // For form submission loading
   const [isLoadingProducts, setIsLoadingProducts] = useState(false); // For loading product types
   const [message, setMessage] = useState('');
   const [error, setError] = useState('');

   // Effect 1: Fetch product types on mount
   useEffect(() => {
        const fetchProducts = async () => {
            setIsLoadingProducts(true);
            try {
                // --- Replace with actual API call ---
                // const response = await getProductTypes({ category: 'bulk' }); // Example API call
                // setAvailableProducts(response.data);

                // --- Using Placeholder Data for now ---
                await new Promise(resolve => setTimeout(resolve, 50)); // Simulate network delay
                 setAvailableProducts([
                     { id: 1, name: "Sanitary Pads (Bulk Pack)" },
                     { id: 4, name: "Tampons (Bulk Pack)" },
                     // Add other relevant bulk product types
                 ]);
                // --- End Placeholder ---

            } catch (fetchError) {
                console.error("Failed to fetch product types:", fetchError);
                setError("Could not load product types. Please try refreshing.");
            } finally {
                setIsLoadingProducts(false);
            }
        };

        fetchProducts();
   }, []); // Empty array means run once on mount

    // Effect 2: Set default product type *after* availableProducts is populated
    useEffect(() => {
        // Check if products are loaded and if productType hasn't been set yet (or needs reset)
        if (availableProducts.length > 0 && !productType) {
             console.log("Setting default product type:", availableProducts[0].id);
             setProductType(availableProducts[0].id.toString()); // Ensure it's a string if select value is string
        }
        // If availableProducts becomes empty later, maybe reset productType? Optional.
        // else if (availableProducts.length === 0) {
        //  setProductType('');
        // }
    }, [availableProducts]); // Run whenever availableProducts changes


   const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');
        if (!productType || quantity <= 0) {
             setError("Please select a product type and enter a valid quantity.");
             setIsLoading(false); // Stop loading if validation fails
             return;
        }
        try {
            const response = await createProductRequest({
                product_type: parseInt(productType), // Ensure API gets an integer ID
                quantity: quantity
            });
            setMessage(`Org Request submitted successfully! Status: ${response.data.status}. Pickup details will follow.`);
             // Optionally reset form fields
             // setQuantity(5);
             // setProductType(availableProducts.length > 0 ? availableProducts[0].id.toString() : '');
        } catch (err) {
             console.error("Failed to submit org request:", err.response?.data || err); // Log the detailed error
             // Try to get specific error message from backend if available
             const backendError = err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || "An unexpected error occurred.";
             setError(`Failed to submit request: ${backendError}`);
        } finally {
             setIsLoading(false);
        }
   };

   return (
     <form onSubmit={handleSubmit} style={styles.form}>
        <h3>Request Products for Organization</h3>

        {/* Display messages/errors */}
        {message && <p style={styles.success}>{message}</p>}
        {/* Corrected style application below */}
        {error && <p style={styles.error}>{error}</p>}

        {/* Product Type Dropdown */}
         <div style={styles.formGroup}>
            <label htmlFor="productTypeOrg">Product Type:</label>
            <select
                id="productTypeOrg"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                required
                style={styles.input}
                // Disable while loading products OR if no products were found
                disabled={isLoadingProducts || availableProducts.length === 0}
            >
                 <option value="" disabled>
                    {isLoadingProducts ? "Loading products..." : "Select product..."}
                 </option>
                 {availableProducts.map(p => (
                    // Ensure value is consistent (string used here to match onChange event value)
                    <option key={p.id} value={p.id.toString()}>
                        {p.name}
                    </option>
                 ))}
            </select>
         </div>

         {/* Quantity Input */}
          <div style={styles.formGroup}>
            <label htmlFor="quantityOrg">Quantity (Bulk Packs/Units):</label>
            <input
                type="number"
                id="quantityOrg"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                min="1"
                required
                style={styles.input}
                disabled={isLoading} // Disable during form submission
            />
         </div>

         {/* Submit Button */}
        <button
            type="submit"
            // Disable if products loading, no products available, or form submitting
            disabled={isLoadingProducts || availableProducts.length === 0 || isLoading}
            style={styles.button}
        >
            {isLoading ? 'Submitting...' : 'Submit Organization Request'}
        </button>
     </form>
   );
};

// Styles object (remains the same)
const styles = {
  form: { margin: '1rem 0', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' },
  formGroup: { marginBottom: '1rem' },
  input: { display: 'block', width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
  button: { padding: '0.7rem 1.5rem', background: '#d63384', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem' },
  error: { color: '#dc3545', background: '#f8d7da', border: '1px solid #f5c6cb', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem'}, // Improved error styling
  success: { color: '#155724', background: '#d4edda', border: '1px solid #c3e6cb', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem' } // Improved success styling
};


export default RequestFormOrg;