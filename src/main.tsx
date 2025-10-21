import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// Initialize app with error handling
try {
  // Get root element
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  // Create root and render app
  const root = createRoot(rootElement);
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  
  console.log('FlashFusion initialized successfully');
  
} catch (error) {
  console.error('Failed to initialize FlashFusion:', error);
  
  // Fallback error display
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #0F172A;
        color: white;
        font-family: system-ui, sans-serif;
        padding: 20px;
      ">
        <div style="text-align: center; max-width: 500px;">
          <h1 style="color: #FF7B00; margin-bottom: 20px;">FlashFusion Error</h1>
          <p style="margin-bottom: 20px;">Failed to initialize the application. Please try refreshing the page.</p>
          <button 
            onclick="window.location.reload()" 
            style="
              background: #FF7B00;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
            "
          >
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }
}