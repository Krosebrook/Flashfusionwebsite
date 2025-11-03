import { useState, useEffect, useCallback, useMemo } from 'react';
import type { PageType } from '../types/core';

// Application configuration constants
export const APP_CONFIG = {
  INIT_TIMEOUT: 5000,
  RETRY_ATTEMPTS: 3,
  STORAGE_KEYS: {
    AUTH_TOKEN: 'ff-auth-token',
    USER_PREFERENCES: 'ff-user-preferences',
    APP_STATE: 'ff-app-state'
  },
  ANIMATION_DELAYS: {
    PAGE_TRANSITION: 300,
    AUTH_SUCCESS: 1000,
    RETRY_BASE: 1000
  }
} as const;

// Enhanced error types with better categorization
export interface AppError {
  type: 'initialization' | 'authentication' | 'network' | 'component' | 'permission';
  message: string;
  details?: string;
  recoverable?: boolean;
  code?: string;
  timestamp?: string;
}

// Application state interface
export interface AppState {
  currentPage: PageType;
  isAuthenticated: boolean;
  connectionStatus: 'online' | 'offline' | 'checking';
  isLoading: boolean;
}

export function useAppState() {
  // Core application state
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  // Enhanced application initialization
  const initializeApp = useCallback(async (attempt = 1): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check network connectivity
      setConnectionStatus('checking');
      const isOnline = navigator.onLine && 
        (navigator.connection?.effectiveType !== 'slow-2g' || !navigator.connection);
      setConnectionStatus(isOnline ? 'online' : 'offline');
      
      if (!isOnline) {
        throw new Error('No internet connection detected');
      }

      // Enhanced initialization with proper error boundaries
      const initPromise = new Promise<void>((resolve, reject) => {
        try {
          setTimeout(() => {
            // Verify critical dependencies
            if (typeof window === 'undefined') {
              reject(new Error('Window object not available'));
              return;
            }
            
            if (!localStorage) {
              reject(new Error('LocalStorage not available'));
              return;
            }
            
            resolve();
          }, Math.min(1000, 2000 - (attempt * 200)));
        } catch (error) {
          reject(error);
        }
      });

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Initialization timeout'));
        }, APP_CONFIG.INIT_TIMEOUT);
      });

      await Promise.race([initPromise, timeoutPromise]);
      
      // Enhanced authentication state recovery
      try {
        const authToken = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
        const isValidToken = authToken && 
          authToken !== 'null' && 
          authToken !== 'undefined' && 
          authToken.length > 10;
        
        if (isValidToken) {
          setIsAuthenticated(true);
        }
      } catch (authError) {
        console.warn('Authentication state recovery failed:', authError);
        localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      }
      
      // Enhanced user preferences loading
      try {
        const savedPreferences = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.USER_PREFERENCES);
        if (savedPreferences) {
          const preferences = JSON.parse(savedPreferences);
          
          if (preferences && typeof preferences === 'object') {
            if (preferences.lastPage && 
                typeof preferences.lastPage === 'string' && 
                preferences.lastPage !== 'search') {
              setCurrentPage(preferences.lastPage as PageType);
            }
          }
        }
      } catch (prefError) {
        console.warn('Failed to load user preferences:', prefError);
        localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.USER_PREFERENCES);
      }
      
      setIsLoading(false);
      setRetryCount(0);
      
      // Add success animation
      if (attempt > 1) {
        document.body.classList.add('ff-scale-pop');
        setTimeout(() => document.body.classList.remove('ff-scale-pop'), APP_CONFIG.ANIMATION_DELAYS.PAGE_TRANSITION);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
      console.error(`App initialization failed (attempt ${attempt}):`, error);
      
      const appError: AppError = {
        type: 'initialization',
        message: errorMessage,
        details: `Attempt ${attempt} of ${APP_CONFIG.RETRY_ATTEMPTS}`,
        recoverable: attempt < APP_CONFIG.RETRY_ATTEMPTS,
        code: `INIT_ERROR_${attempt}`,
        timestamp: new Date().toISOString()
      };
      
      setError(appError);
      
      if (attempt < APP_CONFIG.RETRY_ATTEMPTS) {
        setRetryCount(attempt);
        const delay = Math.pow(2, attempt) * APP_CONFIG.ANIMATION_DELAYS.RETRY_BASE + 
                     Math.random() * 500;
        setTimeout(() => {
          initializeApp(attempt + 1);
        }, delay);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  // Enhanced authentication handler
  const handleAuthToggle = useCallback(() => {
    try {
      const newAuthState = !isAuthenticated;
      
      if (newAuthState) {
        const demoToken = `ff-demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN, demoToken);
        setIsAuthenticated(true);
        
        document.body.classList.add('ff-level-up');
        setTimeout(() => {
          document.body.classList.remove('ff-level-up');
        }, APP_CONFIG.ANIMATION_DELAYS.AUTH_SUCCESS);
        
        if (error?.type === 'authentication' || error?.type === 'permission') {
          setError(null);
        }
        
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.USER_PREFERENCES);
        
        setCurrentPage('home');
        
        // Clear application caches
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => {
              if (name.includes('ff-') || name.includes('flashfusion')) {
                caches.delete(name);
              }
            });
          }).catch(console.warn);
        }
        
        setError(null);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError({
        type: 'authentication',
        message: 'Authentication process failed',
        details: error instanceof Error ? error.message : 'Unknown authentication error',
        recoverable: true,
        code: 'AUTH_PROCESS_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }, [isAuthenticated, error]);

  // Enhanced page change handler
  const handlePageChange = useCallback((page: PageType) => {
    try {
      const protectedPages: PageType[] = ['dashboard', 'settings', 'profile', 'notifications'];
      if (protectedPages.includes(page) && !isAuthenticated) {
        setError({
          type: 'permission',
          message: 'Authentication required',
          details: `Please log in to access ${page.replace('-', ' ')}`,
          recoverable: true,
          code: `AUTH_REQUIRED_${page.toUpperCase()}`,
          timestamp: new Date().toISOString()
        });
        return;
      }
      
      if (error?.recoverable && error?.type !== 'network') {
        setError(null);
      }
      
      const validPages: PageType[] = [
        // Public pages
        'home', 'tools', 'features', 'pricing', 'about', 'contact',
        'testimonials', 'faq', 'privacy', 'terms',
        
        // Protected pages
        'dashboard', 'projects', 'settings', 'profile', 'notifications',
        
        // Tool pages
        'code-generator', 'ecommerce-generator', 'content-generator', 'cicd-pipeline',
        
        // Creator pages
        'creator-hub', 'creator-content-pipeline', 'creator-commerce', 
        'brand-kit', 'content-creation',
        
        // Validation pages
        'validation', 'ai-validation',
        
        // Validator pages
        'validator-hub', 'ai-output-validator', 'cross-app-validation',
        'security-compliance', 'collaboration-trust', 'sync-integrity',
        'system-health', 'plugin-security',
        
        // Core system pages
        'plugins', 'data-hub', 'insights', 'workspace',
        
        // Additional pages
        'analytics', 'demo', 'deployments', 'collaboration',
        'integrations', 'multi-agent-orchestration', 'templates', 'tool-detail',
        
        // System pages
        'search', 'not-found'
      ];
      
      if (!validPages.includes(page)) {
        console.warn(`Invalid page requested: ${page}`);
        setCurrentPage('not-found');
        return;
      }
      
      setCurrentPage(page);
      
      try {
        const preferences = {
          lastPage: page,
          timestamp: Date.now(),
          userAgent: navigator.userAgent.slice(0, 100),
          version: '1.0.0'
        };
        localStorage.setItem(APP_CONFIG.STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
      } catch (storageError) {
        console.warn('Failed to save navigation state:', storageError);
      }
      
      // Enhanced page transition with accessibility
      document.body.classList.add('ff-page-transition');
      setTimeout(() => {
        document.body.classList.remove('ff-page-transition');
      }, APP_CONFIG.ANIMATION_DELAYS.PAGE_TRANSITION);
      
      // Announce page change to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = `Navigated to ${page.replace('-', ' ')} page`;
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 1000);
      
    } catch (error) {
      console.error('Page change error:', error);
      setError({
        type: 'component',
        message: 'Navigation failed',
        details: error instanceof Error ? error.message : 'Unknown navigation error',
        recoverable: true,
        code: 'NAVIGATION_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }, [isAuthenticated, error]);

  // Enhanced retry handler
  const handleRetry = useCallback(() => {
    if (error?.type === 'initialization') {
      setRetryCount(0);
      setError(null);
      initializeApp();
    } else if (error?.type === 'network') {
      setError(null);
      fetch('/health', { method: 'HEAD', cache: 'no-cache' })
        .then(() => setConnectionStatus('online'))
        .catch(() => setConnectionStatus('offline'));
    } else {
      setError(null);
    }
  }, [error, initializeApp]);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setConnectionStatus('online');
      if (error?.type === 'network') {
        setError(null);
        setTimeout(() => initializeApp(), 1000);
      }
    };
    
    const handleOffline = () => {
      setConnectionStatus('offline');
      setError({
        type: 'network',
        message: 'No internet connection',
        details: 'Some features may not work properly offline',
        recoverable: true,
        code: 'NETWORK_OFFLINE',
        timestamp: new Date().toISOString()
      });
    };

    const handleConnectionChange = () => {
      const connection = navigator.connection;
      if (connection) {
        const isSlowConnection = connection.effectiveType === 'slow-2g' || 
                                connection.effectiveType === '2g';
        if (isSlowConnection && connectionStatus === 'online') {
          setError({
            type: 'network',
            message: 'Slow connection detected',
            details: 'Performance may be reduced',
            recoverable: true,
            code: 'NETWORK_SLOW',
            timestamp: new Date().toISOString()
          });
        }
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    if (navigator.connection) {
      navigator.connection.addEventListener('change', handleConnectionChange);
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, [error, initializeApp, connectionStatus]);

  // Initialize app on mount
  useEffect(() => {
    let mounted = true;
    
    if (mounted) {
      initializeApp();
    }
    
    return () => {
      mounted = false;
    };
  }, [initializeApp]);

  // Memoized app state
  const appState: AppState = useMemo(() => ({
    currentPage,
    isAuthenticated,
    connectionStatus,
    isLoading
  }), [currentPage, isAuthenticated, connectionStatus, isLoading]);

  // Error severity classification
  const errorSeverity = useMemo(() => {
    if (!error) return null;
    
    switch (error.type) {
      case 'initialization':
        return 'critical';
      case 'network':
        return 'warning';
      case 'authentication':
      case 'permission':
        return 'info';
      case 'component':
        return 'error';
      default:
        return 'error';
    }
  }, [error]);

  return {
    // State
    appState,
    error,
    errorSeverity,
    retryCount,
    
    // Actions
    handleAuthToggle,
    handlePageChange,
    handleRetry,
    initializeApp
  };
}