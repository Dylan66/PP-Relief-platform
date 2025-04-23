// frontend/src/App.jsx (Corrected)

import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Keep these imports

// Import Page Components (using paths from your file)
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/Auth/LoginPage.jsx'; // Correct path
import RegisterPage from './pages/Auth/RegisterPage.jsx'; // Correct path
import NotFoundPage from './pages/NotFoundPage.jsx';

// Import the Dashboard Router Component (create this as discussed previously)
import DashboardRouter from './pages/DashboardRouter.jsx'; // Assuming you create this

// Import Common Components
import Navbar from './components/common/Navbar.jsx'; // Use your Navbar path
// import Footer from './components/common/Footer.jsx';

// Import your EXISTING ProtectedRoute component (using your path)
import ProtectedRoute from './components/common/ProtectedRoute.jsx'; // Use your ProtectedRoute path

function App() {
  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <Routes>
          {/* === Public Routes === */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Add other public routes like About, Contact etc. here */}


          {/* === Protected Routes === */}
          {/* Use the element prop on Route to apply ProtectedRoute */}
          <Route element={<ProtectedRoute />}> {/* <-- Wrapper Route using ProtectedRoute */}
            {/* Nested routes are rendered via <Outlet> inside ProtectedRoute */}

            {/* Single entry point for all dashboards */}
            <Route path="/dashboard" element={<DashboardRouter />} />

            {/* Add other routes that require login INSIDE this wrapper */}
            {/* Example:
            <Route path="/request-pads" element={<RequestPadsPage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            */}

          </Route> {/* <-- End of ProtectedRoute wrapper */}


          {/* Catch-all route for 404 Not Found - must be last */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* <Footer /> */}
    </div>
  );
}

export default App;