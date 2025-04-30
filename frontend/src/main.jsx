// frontend/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Keep or remove as needed

// Import BrowserRouter here (if you haven't already)
// import { BrowserRouter } from 'react-router-dom'; // <-- Need this import

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* *** REMOVE BrowserRouter WRAPPER HERE *** */}
    {/* <BrowserRouter> */}
      <App /> {/* Your App component */}
    {/* </BrowserRouter> */}
    {/* *** END REMOVE *** */}
  </React.StrictMode>,
);

// The BrowserRouter should only be in App.jsx, wrapping the <AuthProvider>