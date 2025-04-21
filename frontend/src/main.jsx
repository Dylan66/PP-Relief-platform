// frontend/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter here
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; // Import AuthProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Router is the outermost component */}
      <AuthProvider> {/* AuthProvider is INSIDE Router */}
        <App /> {/* App now has access to both Router and Auth context */}
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);