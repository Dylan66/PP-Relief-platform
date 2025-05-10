import React, { useState, useEffect } from 'react';
import axios from 'axios';
import apiClient from '../services/api';

function DiagnosticsPage() {
  const [apiBaseUrl, setApiBaseUrl] = useState('');
  const [apiStatus, setApiStatus] = useState('Not checked yet');
  const [corsStatus, setCorsStatus] = useState('Not checked yet');
  const [csrfStatus, setCsrfStatus] = useState('Not checked yet');
  const [authStatus, setAuthStatus] = useState('Not checked yet');
  const [detailedResults, setDetailedResults] = useState('');

  useEffect(() => {
    // Display the API_BASE_URL from environment with trailing slash
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/?$/, '/');
    setApiBaseUrl(baseUrl);
  }, []);

  const testApiConnection = async () => {
    setApiStatus('Testing...');
    try {
      // We're using a basic endpoint that doesn't require auth
      const response = await axios.get(`${apiBaseUrl}/product-types/`, {
        timeout: 5000 // 5 second timeout
      });
      setApiStatus(`Success (${response.status}): ${response.data.length} product types retrieved`);
      appendResults('API Connection', 'Success', response);
    } catch (error) {
      setApiStatus(`Failed: ${error.message}`);
      appendResults('API Connection', 'Failed', error);
    }
  };

  const testCors = async () => {
    setCorsStatus('Testing...');
    try {
      const response = await axios.options(`${apiBaseUrl}/product-types/`, {
        timeout: 5000 // 5 second timeout
      });
      setCorsStatus(`Success (${response.status}): CORS headers received`);
      appendResults('CORS Check', 'Success', response);
    } catch (error) {
      setCorsStatus(`Failed: ${error.message}`);
      appendResults('CORS Check', 'Failed', error);
    }
  };

  const testCsrf = async () => {
    setCsrfStatus('Testing...');
    try {
      const response = await axios.get(`${apiBaseUrl}/csrf/`, {
        withCredentials: true,
        timeout: 5000 // 5 second timeout
      });
      setCsrfStatus(`Success (${response.status}): CSRF cookie set`);
      appendResults('CSRF Test', 'Success', response);
    } catch (error) {
      setCsrfStatus(`Failed: ${error.message}`);
      appendResults('CSRF Test', 'Failed', error);
    }
  };

  const testAuth = async () => {
    setAuthStatus('Testing...');
    try {
      // Try to access a protected endpoint
      const token = localStorage.getItem('authToken');
      if (!token) {
        setAuthStatus('No auth token in localStorage');
        appendResults('Auth Test', 'No token', null);
        return;
      }

      const response = await axios.get(`${apiBaseUrl}/auth/user/`, {
        headers: {
          'Authorization': `Token ${token}`
        },
        withCredentials: true,
        timeout: 5000 // 5 second timeout
      });
      setAuthStatus(`Success (${response.status}): Authenticated as ${response.data.username}`);
      appendResults('Auth Test', 'Success', response);
    } catch (error) {
      setAuthStatus(`Failed: ${error.message}`);
      appendResults('Auth Test', 'Failed', error);
    }
  };

  const appendResults = (test, status, data) => {
    const timestamp = new Date().toISOString();
    const details = data ? JSON.stringify(data.response?.data || data, null, 2) : 'No data';
    setDetailedResults(prev => 
      `${prev}\n\n--- ${test} (${timestamp}) ---\nStatus: ${status}\n${details}`
    );
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>API Diagnostics</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Environment Settings</h2>
        <p><strong>API Base URL:</strong> {apiBaseUrl}</p>
        <p><strong>Current URL:</strong> {window.location.href}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>API Connectivity Tests</h2>
        
        <div style={{ marginBottom: '10px' }}>
          <button onClick={testApiConnection} style={{ marginRight: '10px' }}>
            Test API Connection
          </button>
          <span>{apiStatus}</span>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <button onClick={testCors} style={{ marginRight: '10px' }}>
            Test CORS
          </button>
          <span>{corsStatus}</span>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <button onClick={testCsrf} style={{ marginRight: '10px' }}>
            Test CSRF
          </button>
          <span>{csrfStatus}</span>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <button onClick={testAuth} style={{ marginRight: '10px' }}>
            Test Authentication
          </button>
          <span>{authStatus}</span>
        </div>
      </div>

      <div>
        <h2>Detailed Results</h2>
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '5px',
          maxHeight: '400px',
          overflow: 'auto',
          whiteSpace: 'pre-wrap'
        }}>
          {detailedResults || 'Run tests to see detailed results'}
        </pre>
      </div>
    </div>
  );
}

export default DiagnosticsPage; 