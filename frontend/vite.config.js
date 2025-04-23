// frontend/vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ADD THIS SECTION:
  server: {
    proxy: {
      // Forward requests starting with /api to Django backend
      '/api': {
        target: 'http://127.0.0.1:8000', // Your Django server address
        changeOrigin: true, // Recommended, handles origin header correctly
        secure: false,      // Set to true if your Django backend uses HTTPS (unlikely in dev)
        // Optional: Add rewrite rule if needed, but usually not necessary
        // rewrite: (path) => path.replace(/^\/api/, '/api')
      }
      // You can add other proxy rules here if needed
    }
  }
});