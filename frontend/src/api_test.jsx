import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ApiTest() {
  const [apiBaseUrl, setApiBaseUrl] = useState('');
  const [testUrl, setTestUrl] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    // Get the API base URL from environment variables
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');
    setApiBaseUrl(baseUrl);
  }, []);

  const testApi = async () => {
    try {
      setResult('Testing...');
      const response = await axios.get(testUrl, { timeout: 15000 });
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}\n${JSON.stringify(error, null, 2)}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>API Testing</h1>
      <div>
        <p><strong>API Base URL from environment:</strong> {apiBaseUrl}</p>
        <input 
          type="text" 
          value={testUrl} 
          onChange={(e) => setTestUrl(e.target.value)}
          placeholder="Enter full URL to test"
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <button onClick={testApi} style={{ padding: '8px 16px' }}>Test API</button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Result:</h3>
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '5px',
          whiteSpace: 'pre-wrap',
          maxHeight: '400px',
          overflow: 'auto'
        }}>
          {result}
        </pre>
      </div>
    </div>
  );
} 