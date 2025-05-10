import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loginUser } from '../../services/api';

const LoginTest = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || '');
  
  // Get the API base URL on component mount
  useEffect(() => {
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');
    setApiUrl(baseUrl);
  }, []);
  
  // Check if we already have a token
  useEffect(() => {
    if (token) {
      getCurrentUser();
    }
  }, [token]);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus('Logging in...');
    
    try {
      // Try both username and email to see which one works
      const credentials = { password };
      
      if (username) credentials.username = username;
      if (email) credentials.email = email;
      
      const response = await loginUser(credentials);
      setStatus(`Login successful! Token: ${response.key}`);
      setToken(response.key);
      getCurrentUser();
    } catch (error) {
      console.error('Login error:', error);
      setStatus(`Login failed: ${error.response?.data ? JSON.stringify(error.response.data) : error.message}`);
    }
  };
  
  const getCurrentUser = async () => {
    try {
      setStatus('Fetching user data...');
      const response = await axios.get(`${apiUrl}/auth/user/`, {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      setUserData(response.data);
      setStatus('User data fetched successfully');
    } catch (error) {
      console.error('Error fetching user data:', error);
      setStatus(`Error fetching user data: ${error.response?.data ? JSON.stringify(error.response.data) : error.message}`);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken('');
    setUserData(null);
    setStatus('Logged out');
  };
  
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Authentication Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Environment</h2>
        <p><strong>API URL:</strong> {apiUrl}</p>
        <p><strong>Current Token:</strong> {token ? `${token.substring(0, 10)}...` : 'None'}</p>
      </div>
      
      {userData ? (
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
          <h2>User Data</h2>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
          <button 
            onClick={handleLogout}
            style={{ padding: '8px 16px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      ) : (
        <form onSubmit={handleLogin} style={{ marginBottom: '20px' }}>
          <h2>Login Form</h2>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              required
            />
          </div>
          <button 
            type="submit"
            style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Login
          </button>
        </form>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <h2>Status</h2>
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '5px',
          whiteSpace: 'pre-wrap'
        }}>
          {status}
        </pre>
      </div>
    </div>
  );
};

export default LoginTest; 