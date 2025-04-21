// frontend/src/App.jsx

import React from 'react';
// Import necessary components from react-router-dom, but NOT BrowserRouter
import { Routes, Route } from 'react-router-dom';

// Import Page Components
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/Auth/LoginPage.jsx';
import RegisterPage from './pages/Auth/RegisterPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
// Import Dashboard pages (assuming they exist or will be created)
// import IndividualDashboard from './pages/IndividualDashboard.jsx';
// import OrgDashboard from './pages/OrgDashboard.jsx';
// import CenterDashboard from './pages/CenterDashboard.jsx';
// import AdminDashboard from './pages/AdminDashboard.jsx';

// Import Common Components
import Navbar from './components/common/Navbar.jsx'; // You need to create/have this
// import Footer from './components/common/Footer.jsx'; // Optional: You need to create/have this
import ProtectedRoute from './components/common/ProtectedRoute.jsx'; // You need to create/have this

function App() {
  return (
    // Outermost element is a div or React Fragment, NOT <Router>
    <div className="app-container"> {/* Optional: Add a class for styling */}
      {/* Navbar will be displayed on all pages */}
      <Navbar />

      {/* Main content area where routed pages will be rendered */}
      <main className="main-content"> {/* Optional: Add a class for styling */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* --- Protected Routes (Examples) --- */}
          {/* Wrap routes that require authentication with ProtectedRoute */}

          {/* Example: Individual User Dashboard */}
          {/*
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <IndividualDashboard />
            </ProtectedRoute>
          } />
          */}

          {/* Example: Request Form for Individuals */}
          {/*
          <Route path="/request-products" element={
            <ProtectedRoute>
              <RequestFormIndividual /> // Assuming this is a component, maybe inside a page
            </ProtectedRoute>
          } />
           */}

          {/* Example: Organization Dashboard (might need role check) */}
          {/*
          <Route path="/org/dashboard" element={
             <ProtectedRoute requiredRole="OrgAdmin"> // Add role checking later
               <OrgDashboard />
             </ProtectedRoute>
           } />
           */}

          {/* --- Add other public or protected routes here --- */}


          {/* Catch-all route for 404 Not Found - must be last */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Optional Footer */}
      {/* <Footer /> */}
    </div>
  );
}

export default App;