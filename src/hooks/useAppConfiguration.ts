import { useState, useEffect } from 'react';
import CONFIG, { isProduction, initializeSimpleConfig } from '../lib/config';
import { initSentry } from '../lib/monitoring';

export function useAppConfiguration() {
  const [configInitialized, setConfigInitialized] = useState(false);

  // Initialize configuration safely
  useEffect(() => {
    try {
      const result = initializeSimpleConfig();
      setConfigInitialized(true);
      
      if (!result.validation.isValid && isProduction) {
        console.error('❌ Configuration validation failed in production');
      }
    } catch (error) {
      console.error('❌ Failed to initialize configuration:', error);
      setConfigInitialized(true); // Still allow app to continue
    }
  }, []);

  // Initialize monitoring on app start
  useEffect(() => {
    try {
      // Initialize Sentry for error monitoring
      initSentry();
      
      // Initialize production monitoring only if configuration is valid
      if (isProduction && CONFIG.ANALYTICS_ENABLED && CONFIG.GA_MEASUREMENT_ID) {
        // Initialize Google Analytics
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);

        window.gtag = window.gtag || function() {
          (window.gtag.q = window.gtag.q || []).push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', CONFIG.GA_MEASUREMENT_ID);
        
        console.log('📊 Analytics initialized');
      }
      
      // Set session ID for analytics
      if (!sessionStorage.getItem('ff-session-id')) {
        sessionStorage.setItem('ff-session-id', `ff-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
      }
      
    } catch (error) {
      console.debug('Monitoring initialization failed:', error);
    }
  }, []);

  // Global error handler
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      try {
        if (CONFIG.ERROR_REPORTING) {
          console.error('🚨 Global Error:', event.error);
          // In production, this would send to Sentry or similar
        }
      } catch (error) {
        console.debug('Error reporting failed:', error);
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      try {
        if (CONFIG.ERROR_REPORTING) {
          console.error('🚨 Unhandled Promise Rejection:', event.reason);
          // In production, this would send to Sentry or similar
        }
      } catch (error) {
        console.debug('Error reporting failed:', error);
      }
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return { configInitialized };
}