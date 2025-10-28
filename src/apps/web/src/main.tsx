import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// Enable React strict mode for development
const StrictModeWrapper = ({ children }: { children: React.ReactNode }) => {
  if (import.meta.env.DEV) {
    return <React.StrictMode>{children}</React.StrictMode>;
  }
  return <>{children}</>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictModeWrapper>
    <App />
  </StrictModeWrapper>
);