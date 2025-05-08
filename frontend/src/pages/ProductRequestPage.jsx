import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/common/Footer';
import useAuth from '../hooks/useAuth';

// Placeholder for product data
const availableProducts = [
  { id: '1', name: 'Sanitary Pads (Pack of 10)', category: 'Pads' },
  { id: '2', name: 'Tampons (Pack of 20)', category: 'Tampons' },
  { id: '3', name: 'Menstrual Cup (Size S)', category: 'Cups' },
  { id: '4', name: 'Menstrual Cup (Size M)', category: 'Cups' },
  { id: '5', name: 'Menstrual Cup (Size L)', category: 'Cups' },
  { id: '6', name: 'Reusable Cloth Pads (Set of 3)', category: 'Reusable' },
];

const kenyanLocations = [
  { id: 'loc1', name: 'Nairobi Central, Nairobi' },
  { id: 'loc2', name: 'Westlands, Nairobi' },
  { id: 'loc3', name: 'Kasarani, Nairobi' },
  { id: 'loc4', name: 'Embakasi East, Nairobi' },
  { id: 'loc5', name: 'Dagoretti North, Nairobi' },
  { id: 'loc6', name: 'Mombasa CBD, Mombasa' },
  { id: 'loc7', name: 'Nyali, Mombasa' },
  { id: 'loc8', name: 'Kisauni, Mombasa' },
  { id: 'loc9', name: 'Kisumu Central, Kisumu' },
  { id: 'loc10', name: 'Kisumu East, Kisumu' },
  { id: 'loc11', name: 'Nakuru Town East, Nakuru' },
  { id: 'loc12', name: 'Nakuru Town West, Nakuru' },
  { id: 'loc13', name: 'Eldoret CBD, Uasin Gishu' },
  { id: 'loc14', name: 'Kapseret, Uasin Gishu' },
  { id: 'loc15', name: 'Thika Town, Kiambu' },
  { id: 'loc16', name: 'Ruiru, Kiambu' },
  { id: 'loc17', name: 'Machakos Town, Machakos' },
  { id: 'loc18', name: 'Kitui Central, Kitui' },
  { id: 'loc19', name: 'Garissa Town, Garissa' },
  { id: 'loc20', name: 'Kakamega Town, Kakamega' },
  { id: 'loc21', name: 'Malindi, Kilifi' },
  { id: 'loc22', name: 'Nyeri Town, Nyeri' },
  { id: 'loc23', name: 'Meru Town, Meru' },
  { id: 'loc24', name: 'Naivasha, Nakuru' },
  { id: 'loc25', name: 'Kiambu Town, Kiambu' },
  { id: 'loc26', name: 'Utawala, Nairobi' },
  { id: 'loc27', name: 'Juja, Kiambu' },
  { id: 'loc28', name: 'Ruaka, Kiambu' },
  { id: 'loc29', name: 'Ruai, Nairobi' }
];

const ProductRequestPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const locationInputRef = useRef(null);
  
  const [currentSelectedProductId, setCurrentSelectedProductId] = useState(availableProducts[0]?.id || '');
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [orderItems, setOrderItems] = useState([]);

  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null); // Stores {id, name}
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [isLocationListVisible, setIsLocationListVisible] = useState(false);

  useEffect(() => {
    if (locationSearchTerm) {
      const lowerSearchTerm = locationSearchTerm.toLowerCase();
      setFilteredLocations(
        kenyanLocations.filter(loc => 
          loc.name.toLowerCase().includes(lowerSearchTerm)
        )
      );
    } else {
      setFilteredLocations([]); // Or show all/top suggestions if needed
    }
  }, [locationSearchTerm]);

  // Effect to handle clicks outside the location dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (locationInputRef.current && !locationInputRef.current.contains(event.target)) {
        setIsLocationListVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [locationInputRef]);

  const handleLocationSearchChange = (e) => {
    setLocationSearchTerm(e.target.value);
    setSelectedLocation(null); // Clear selected location if user types again
    setIsLocationListVisible(true);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setLocationSearchTerm(location.name);
    setIsLocationListVisible(false);
  };

  const handleAddProduct = () => {
    if (!currentSelectedProductId || currentQuantity <= 0) {
      alert('Please select a product and enter a valid quantity.');
      return;
    }
    const productToAdd = availableProducts.find(p => p.id === currentSelectedProductId);
    if (!productToAdd) return;

    setOrderItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.productId === currentSelectedProductId);
      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += currentQuantity;
        return updatedItems;
      } else {
        return [...prevItems, { ...productToAdd, quantity: currentQuantity }];
      }
    });
    setCurrentQuantity(1);
  };

  const handleRemoveProduct = (productIdToRemove) => {
    setOrderItems(prevItems => prevItems.filter(item => item.productId !== productIdToRemove));
  };

  const handleQuantityInListChange = (productId, newQuantity) => {
    const quantityNum = parseInt(newQuantity, 10);
    setOrderItems(prevItems => 
      prevItems.map(item => 
        item.productId === productId ? { ...item, quantity: Math.max(0, quantityNum) } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedLocation) {
      alert('Please select a pickup location.');
      return;
    }
    if (orderItems.length === 0) {
      alert('Please add at least one product to your request.');
      return;
    }
    console.log('Order submitted:', { selectedLocation, orderItems });
    alert('Your request has been submitted! We will process it shortly.');
    setOrderItems([]);
    setSelectedLocation(null);
    setLocationSearchTerm('');
    // navigate('/');
  };

  const handleExploreOrgServicesClick = () => {
    console.log("Explore Org Services button clicked. Is Authenticated:", isAuthenticated);
    navigate('/organization-services');
  };

  return (
    <div style={styles.pageContainer}>
      <main style={styles.mainContent}>
        <h1 style={styles.title}>Request Hygiene Products</h1>
        <p style={styles.subtitle}>Select products, specify quantity, choose a pickup location, and add to your request.</p>
        
        <div style={styles.formSection} ref={locationInputRef}>
          <label htmlFor="locationSearch" style={styles.label}>Pickup Location:</label>
          <input 
            type="text"
            id="locationSearch"
            placeholder="Search for a pickup location..."
            value={locationSearchTerm}
            onChange={handleLocationSearchChange}
            onFocus={() => setIsLocationListVisible(true)}
            style={styles.locationInput}
            autoComplete="off"
          />
          {isLocationListVisible && filteredLocations.length > 0 && (
            <ul style={styles.locationList}>
              {filteredLocations.map(loc => (
                <li 
                  key={loc.id} 
                  onClick={() => handleLocationSelect(loc)}
                  style={styles.locationListItem}
                >
                  {loc.name}
                </li>
              ))}
            </ul>
          )}
           {isLocationListVisible && locationSearchTerm && filteredLocations.length === 0 && (
            <div style={styles.noResults}>No locations found matching "{locationSearchTerm}"</div>
          )}
        </div>

        <div style={styles.formSection}>
          <label style={styles.label}>Add Product to Request:</label>
          <div style={styles.selectionArea}>
            <select 
              value={currentSelectedProductId} 
              onChange={(e) => setCurrentSelectedProductId(e.target.value)}
              style={styles.dropdown}
            >
              {availableProducts.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.category})
                </option>
              ))}
            </select>
            <input 
              type="number" 
              min="1" 
              value={currentQuantity} 
              onChange={(e) => setCurrentQuantity(Math.max(1, parseInt(e.target.value, 10)))}
              style={styles.quantityInput}
            />
            <button onClick={handleAddProduct} style={styles.addButton}>Add to Request</button>
          </div>
        </div>

        {orderItems.length > 0 && (
          <div style={styles.orderListContainer}>
            <h2 style={styles.listTitle}>Your Current Request:</h2>
            {selectedLocation && <p style={styles.selectedLocationText}>Pickup Location: <strong>{selectedLocation.name}</strong></p>}
            {orderItems.map(item => (
              <div key={item.productId} style={styles.orderItem}>
                <div style={styles.orderItemInfo}>
                  <span style={styles.orderItemName}>{item.name}</span>
                </div>
                <input 
                  type="number"
                  min="1" 
                  value={item.quantity}
                  onChange={(e) => handleQuantityInListChange(item.productId, e.target.value)}
                  style={styles.quantityInputInList}
                />
                <button onClick={() => handleRemoveProduct(item.productId)} style={styles.removeButton}>Remove</button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <button type="submit" style={styles.submitButton} disabled={orderItems.length === 0 || !selectedLocation}>
            Submit Full Request
          </button>
        </form>

        <div style={styles.promoSection}>
            <p style={styles.promoText}>
                Are you requesting on behalf of an organization or group? 
                Discover additional services and resources tailored for organizations.
            </p>
            <button onClick={handleExploreOrgServicesClick} style={styles.promoButton}>
                Explore Organization Services
            </button>
        </div>

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
    padding: '30px 40px',
    maxWidth: '900px',
    margin: '30px auto',
    backgroundColor: '#fff',
    flexGrow: 1,
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: 'clamp(1.8em, 3.5vw, 2.5em)',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '10px',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 'clamp(0.9em, 1.4vw, 1.05em)',
    color: '#555',
    marginBottom: '30px',
    textAlign: 'center',
    lineHeight: '1.6',
  },
  formSection: {
    marginBottom: '25px',
    position: 'relative', // For positioning the location list
  },
  label: {
    display: 'block',
    fontSize: '1em',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },
  locationInput: {
    width: '100%',
    padding: '12px',
    fontSize: '1em',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  locationList: {
    listStyleType: 'none',
    padding: '0',
    margin: '0',
    border: '1px solid #ccc',
    borderTop: 'none',
    borderRadius: '0 0 4px 4px',
    position: 'absolute',
    width: '100%',
    backgroundColor: 'white',
    zIndex: '1000',
    maxHeight: '200px',
    overflowY: 'auto',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  locationListItem: {
    padding: '10px 12px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
  },
  'locationListItem:last-child': {
    borderBottom: 'none',
  },
  'locationListItem:hover': {
    backgroundColor: '#f0f0f0',
  },
  noResults: {
    padding: '10px 12px',
    color: '#777',
    border: '1px solid #ccc',
    borderTop: 'none',
    borderRadius: '0 0 4px 4px',
    backgroundColor: 'white',
    position: 'absolute',
    width: '100%',
    zIndex: '1000',
  },
  selectionArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },
  dropdown: {
    flexGrow: 1,
    padding: '12px',
    fontSize: '1em',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: 'white',
  },
  quantityInput: {
    width: '80px',
    padding: '12px',
    fontSize: '1em',
    border: '1px solid #ccc',
    borderRadius: '4px',
    textAlign: 'center',
  },
  addButton: {
    padding: '12px 25px',
    fontSize: '1em',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#8E2DE2', // Vibrant Purple (themed)
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  orderListContainer: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  },
  listTitle: {
    fontSize: '1.3em',
    color: '#333',
    marginBottom: '15px',
  },
  selectedLocationText: {
    fontSize: '1em',
    color: '#555',
    marginBottom: '15px',
    padding: '10px',
    backgroundColor: '#e9e9ff',
    borderRadius: '4px',
  },
  orderItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '15px',
    backgroundColor: '#fdfdfd',
    border: '1px solid #e8e8e8',
    borderRadius: '6px',
    marginBottom: '10px',
    gap: '10px',
  },
  orderItemInfo: {
    flexGrow: 1,
  },
  orderItemName: {
    fontSize: '1em',
    fontWeight: '500',
    color: '#444',
  },
  quantityInputInList: {
    width: '70px',
    padding: '8px',
    fontSize: '0.95em',
    border: '1px solid #ccc',
    borderRadius: '4px',
    textAlign: 'center',
  },
  removeButton: {
    padding: '8px 15px',
    fontSize: '0.9em',
    color: '#000000', // Black text for contrast with light purple
    backgroundColor: '#D4C2FF', // Light Purple (themed)
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  form: {
    marginTop: '30px',
    textAlign: 'center',
  },
  submitButton: {
    padding: '15px 40px',
    fontSize: 'clamp(1em, 1.8vw, 1.15em)',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#5A4CAD', // Darker/Muted Purple (themed)
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
    transition: 'background-color 0.2s ease',
  },
  promoSection: {
    marginTop: '40px',
    padding: '25px',
    backgroundColor: '#e9e9ff', // Light purple background
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid #d0d0e0',
  },
  promoText: {
    fontSize: 'clamp(0.95em, 1.5vw, 1.1em)',
    color: '#444',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  promoButton: {
    padding: '12px 30px',
    fontSize: 'clamp(0.9em, 1.6vw, 1em)',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#6a4cad', // A distinct purple
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  'promoButton:hover': {
      backgroundColor: '#5A3C9D', // Darker shade on hover
  },
  'addButton:hover': {
    backgroundColor: '#7024B7', // Darker vibrant purple
  },
  'removeButton:hover': {
    backgroundColor: '#B8AEE5', // Darker light purple
  },
  'submitButton:hover': {
    backgroundColor: '#483D8B', // Darker muted purple
  },
};

export default ProductRequestPage; 