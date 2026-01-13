import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/globals.css';

import { ENV } from './src/lib/env';

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
  
  if (ENV.NODE_ENV === 'development') {
    console.log('FlashFusion initialized successfully');
  }
  
} catch (error) {
  console.error('Failed to initialize FlashFusion:', error);
  
  // Fallback error display using safe DOM manipulation
  const rootElement = document.getElementById('root');
  if (rootElement) {
    // Clear any existing content
    rootElement.textContent = '';
    
    // Create elements safely
    const container = document.createElement('div');
    container.style.cssText = `
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0F172A;
      color: white;
      font-family: system-ui, sans-serif;
      padding: 20px;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = 'text-align: center; max-width: 500px;';
    
    const heading = document.createElement('h1');
    heading.style.cssText = 'color: #FF7B00; margin-bottom: 20px;';
    heading.textContent = 'FlashFusion Error';
    
    const message = document.createElement('p');
    message.style.cssText = 'margin-bottom: 20px;';
    message.textContent = 'Failed to initialize the application. Please try refreshing the page.';
    
    const button = document.createElement('button');
    button.style.cssText = `
      background: #FF7B00;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
    `;
    button.textContent = 'Refresh Page';
    button.onclick = () => window.location.reload();
    
    content.appendChild(heading);
    content.appendChild(message);
    content.appendChild(button);
    container.appendChild(content);
    rootElement.appendChild(container);
  }
}