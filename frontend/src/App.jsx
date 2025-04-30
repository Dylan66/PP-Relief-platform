// frontend/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Page Components (using your file paths)
// Ensure these files exist in your project at these exact paths
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/Auth/LoginPage.jsx';
import RegisterPage from './pages/Auth/RegisterPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';       // Make sure NotFoundPage.jsx exists
import UnauthorizedPage from './pages/UnauthorizedPage.jsx'; // Make sure UnauthorizedPage.jsx exists

// Import the Dashboard Router Component (create this as discussed previously)
// Ensure this file exists at this exact path
import DashboardRouter from './pages/DashboardRouter.jsx';

// Import Common Components (using your file paths)
// Ensure these files exist at these exact paths
import Navbar from './components/common/Navbar.jsx';
// import Footer from './components/common/Footer.jsx'; // Uncomment if you create a Footer

// Import your EXISTING ProtectedRoute component (using your path)
// Ensure this file exists at this exact path
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

// Import the AuthProvider to wrap the application
// Ensure this file exists at this exact path
import { AuthProvider } from './context/AuthContext.jsx';

// Import App layout styles
// Ensure this file exists at this exact path
import styles from './App.module.css';


function App() {
  return (
    // Wrap the entire application in BrowserRouter for routing
    <Router>
      {/* Wrap components that need authentication context */}
      {/* The AuthProvider manages auth state and provides apiClient */}
      <AuthProvider>
        {/* Place the Navbar outside of Routes so it's always visible on all pages */}
        {/* It uses the auth context to show different links */}
        <Navbar />

        {/* Main content area */}
        {/* Apply a CSS class for padding to compensate for the fixed navbar */}
        {/* The padding-top value should be in App.module.css */}
        <main className={styles.mainContent}>
          <Routes>
            {/* === Public Routes === */}
            {/* These routes are accessible without authentication */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Route for unauthorized access - accessible even if not logged in to display the message */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Add other potential public routes here (e.g., About, Contact) */}


            {/* === Protected Routes === */}
            {/* Use the element prop on Route to apply ProtectedRoute as a wrapper */}
            {/* Any nested routes within this <Route> element will require authentication */}
            <Route element={<ProtectedRoute />}>
              {/* Nested routes are rendered via <Outlet> inside ProtectedRoute */}

              {/* Single entry point for all dashboards */}
              {/* The DashboardRouter will decide WHICH specific dashboard component to render */}
              {/* Using path="/dashboard/*" allows DashboardRouter to handle any sub-paths under /dashboard */}
              <Route path="/dashboard/*" element={<DashboardRouter />} />

              {/* Add other routes that require login INSIDE this wrapper */}
              {/* Example:
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/settings" element={<UserSettingsPage />} />
              */}

            </Route> {/* <-- End of ProtectedRoute wrapper */}


            {/* Catch-all route for 404 Not Found - This must be the last route defined */}
            {/* If none of the above paths match, render the NotFoundPage */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Optional Footer - Place outside main if you want it below all content */}
        {/* <Footer /> */}
      </AuthProvider>
    </Router>
  );
}

export default App;