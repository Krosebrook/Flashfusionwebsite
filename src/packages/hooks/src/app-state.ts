import { useState, useCallback, useEffect } from 'react';
import type { PageType } from '@flashfusion/types';

interface AppState {
  currentPage: PageType;
  isAuthenticated: boolean;
  isLoading: boolean;
  connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'checking';
}

interface AppError {
  type: string;
  message: string;
  details?: string;
  recoverable: boolean;
  code?: string;
  timestamp?: string;
}

export function useAppState() {
  const [appState, setAppState] = useState<AppState>({
    currentPage: 'home',
    isAuthenticated: false,
    isLoading: true,
    connectionStatus: 'checking'
  });

  const [error, setError] = useState<AppError | null>(null);
  const [errorSeverity, setErrorSeverity] = useState<'info' | 'warning' | 'error' | 'critical'>('error');
  const [retryCount, setRetryCount] = useState(0);

  const handleAuthToggle = useCallback(() => {
    setAppState(prev => ({
      ...prev,
      isAuthenticated: !prev.isAuthenticated
    }));
  }, []);

  const handlePageChange = useCallback((page: PageType) => {
    setAppState(prev => ({
      ...prev,
      currentPage: page
    }));
  }, []);

  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    setError(null);
    setAppState(prev => ({
      ...prev,
      isLoading: true,
      connectionStatus: 'checking'
    }));

    // Simulate retry logic
    setTimeout(() => {
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        connectionStatus: 'connected'
      }));
    }, 1000);
  }, []);

  // Initialize app state
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simulate initialization
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setAppState(prev => ({
          ...prev,
          isLoading: false,
          connectionStatus: 'connected'
        }));
      } catch (err) {
        setError({
          type: 'INITIALIZATION_ERROR',
          message: 'Failed to initialize application',
          recoverable: true,
          timestamp: new Date().toISOString()
        });
        setAppState(prev => ({
          ...prev,
          isLoading: false,
          connectionStatus: 'disconnected'
        }));
      }
    };

    initializeApp();
  }, []);

  return {
    appState,
    error,
    errorSeverity,
    retryCount,
    handleAuthToggle,
    handlePageChange,
    handleRetry
  };
}