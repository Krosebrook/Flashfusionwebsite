/**
 * @fileoverview Dedicated Authentication State Machine
 * @category Fix Mode - State Synchronization
 * @category Build Mode - Simplified Auth State Machine
 * @version 1.0.0
 * 
 * Centralized authentication state management with proper error handling,
 * memory leak prevention, and state synchronization.
 */

import { useReducer, useCallback, useEffect, useRef } from 'react';
import { useAuthentication } from './useAuthentication';
import type { AuthUser } from './useAuthentication';

// Auth State Types
interface AuthState {
  // Core Auth State
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  error: string | null;
  
  // Navigation State
  showAuthModal: boolean;
  shouldShowApp: boolean;
  navigationFlags: {
    hasAppParam: boolean;
    hasStoredPreference: boolean;
    currentPath: string;
  };
  
  // UI State
  retryCount: number;
  lastError: string | null;
  isRecovering: boolean;
}

// Action Types
type AuthAction =
  | { type: 'AUTH_INIT_START' }
  | { type: 'AUTH_INIT_SUCCESS'; payload: { user: AuthUser | null } }
  | { type: 'AUTH_INIT_ERROR'; payload: { error: string } }
  | { type: 'AUTH_LOGIN_START' }
  | { type: 'AUTH_LOGIN_SUCCESS'; payload: { user: AuthUser } }
  | { type: 'AUTH_LOGIN_ERROR'; payload: { error: string } }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'SHOW_AUTH_MODAL'; payload: { show: boolean } }
  | { type: 'UPDATE_NAVIGATION_FLAGS'; payload: { flags: Partial<AuthState['navigationFlags']> } }
  | { type: 'SET_SHOULD_SHOW_APP'; payload: { show: boolean } }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RETRY_AUTH' }
  | { type: 'SET_RECOVERING'; payload: { recovering: boolean } };

// Initial State
const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  isLoading: true,
  user: null,
  error: null,
  showAuthModal: false,
  shouldShowApp: false,
  navigationFlags: {
    hasAppParam: false,
    hasStoredPreference: false,
    currentPath: '/',
  },
  retryCount: 0,
  lastError: null,
  isRecovering: false,
};

// State Reducer with Memory-Aware Optimizations
function authStateReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_INIT_START':
      return {
        ...state,
        isLoading: true,
        error: null,
        isRecovering: false,
      };

    case 'AUTH_INIT_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isInitialized: true,
        isAuthenticated: !!action.payload.user,
        user: action.payload.user,
        error: null,
        retryCount: 0,
        isRecovering: false,
      };

    case 'AUTH_INIT_ERROR':
      return {
        ...state,
        isLoading: false,
        isInitialized: true,
        error: action.payload.error,
        lastError: action.payload.error,
        retryCount: state.retryCount + 1,
        isRecovering: false,
      };

    case 'AUTH_LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
        showAuthModal: true,
      };

    case 'AUTH_LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        error: null,
        showAuthModal: false,
        retryCount: 0,
        shouldShowApp: true,
      };

    case 'AUTH_LOGIN_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
        lastError: action.payload.error,
        retryCount: state.retryCount + 1,
      };

    case 'AUTH_LOGOUT':
      return {
        ...initialState,
        isInitialized: true,
        navigationFlags: state.navigationFlags, // Preserve navigation context
      };

    case 'SHOW_AUTH_MODAL':
      return {
        ...state,
        showAuthModal: action.payload.show,
      };

    case 'UPDATE_NAVIGATION_FLAGS':
      return {
        ...state,
        navigationFlags: {
          ...state.navigationFlags,
          ...action.payload.flags,
        },
      };

    case 'SET_SHOULD_SHOW_APP':
      return {
        ...state,
        shouldShowApp: action.payload.show,
        showAuthModal: action.payload.show && !state.isAuthenticated,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
        isRecovering: false,
      };

    case 'RETRY_AUTH':
      return {
        ...state,
        isRecovering: true,
        error: null,
      };

    case 'SET_RECOVERING':
      return {
        ...state,
        isRecovering: action.payload.recovering,
      };

    default:
      return state;
  }
}

/**
 * Enhanced Auth State Hook with Memory Leak Prevention
 */
export function useAuthStateReducer() {
  const [state, dispatch] = useReducer(authStateReducer, initialState);
  const { isAuthenticated, isInitialized, user, clearError } = useAuthentication();
  
  // Cleanup tracker for memory leak prevention
  const cleanupRefs = useRef<Set<() => void>>(new Set());
  const isUnmountedRef = useRef(false);

  // Safe dispatch wrapper to prevent memory leaks
  const safeDispatch = useCallback((action: AuthAction) => {
    if (!isUnmountedRef.current) {
      dispatch(action);
    }
  }, []);

  // Register cleanup function
  const registerCleanup = useCallback((cleanup: () => void) => {
    cleanupRefs.current.add(cleanup);
    return () => {
      cleanupRefs.current.delete(cleanup);
    };
  }, []);

  // Sync with authentication hook
  useEffect(() => {
    if (isInitialized) {
      safeDispatch({
        type: 'AUTH_INIT_SUCCESS',
        payload: { user: isAuthenticated ? user : null }
      });
    }
  }, [isAuthenticated, isInitialized, user, safeDispatch]);

  // Navigation Detection with Optimized Event Handling
  useEffect(() => {
    if (!isInitialized) return;

    const updateNavigationFlags = () => {
      try {
        const currentPath = window.location.pathname;
        const urlParams = new URLSearchParams(window.location.search);
        const hasAppParam = urlParams.has('app') || currentPath.includes('/app');
        const hasStoredPreference = localStorage.getItem('ff-show-app') === 'true';

        safeDispatch({
          type: 'UPDATE_NAVIGATION_FLAGS',
          payload: {
            flags: {
              hasAppParam,
              hasStoredPreference,
              currentPath,
            }
          }
        });

        // Determine if should show app
        const shouldShow = hasAppParam || hasStoredPreference;
        safeDispatch({
          type: 'SET_SHOULD_SHOW_APP',
          payload: { show: shouldShow }
        });

        console.log('🔍 Navigation State Updated:', {
          hasAppParam,
          hasStoredPreference,
          shouldShow,
          isAuthenticated,
          currentPath
        });

      } catch (error) {
        console.error('Navigation detection error:', error);
        safeDispatch({
          type: 'AUTH_INIT_ERROR',
          payload: { error: 'Navigation detection failed' }
        });
      }
    };

    // Initial check
    updateNavigationFlags();

    // Optimized event listeners with throttling
    let ticking = false;
    const throttledUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateNavigationFlags();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Storage event listener for cross-tab sync
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ff-show-app') {
        throttledUpdate();
      }
    };

    // Add listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('popstate', throttledUpdate);

    // Register cleanup
    const cleanup = () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('popstate', throttledUpdate);
    };

    registerCleanup(cleanup);

    return cleanup;
  }, [isInitialized, isAuthenticated, safeDispatch, registerCleanup]);

  // Enhanced Action Creators
  const actions = {
    login: useCallback((user: AuthUser) => {
      safeDispatch({ type: 'AUTH_LOGIN_SUCCESS', payload: { user } });
      
      // Clear navigation flags on successful login
      try {
        localStorage.removeItem('ff-show-app');
        const url = new URL(window.location.href);
        url.searchParams.delete('app');
        window.history.replaceState({}, '', url.toString());
      } catch (error) {
        console.error('Error clearing navigation flags:', error);
      }
    }, [safeDispatch]),

    logout: useCallback(() => {
      safeDispatch({ type: 'AUTH_LOGOUT' });
    }, [safeDispatch]),

    showAuthModal: useCallback((show: boolean) => {
      safeDispatch({ type: 'SHOW_AUTH_MODAL', payload: { show } });
    }, [safeDispatch]),

    clearError: useCallback(() => {
      safeDispatch({ type: 'CLEAR_ERROR' });
      clearError(); // Also clear base auth error
    }, [safeDispatch, clearError]),

    retryAuth: useCallback(() => {
      safeDispatch({ type: 'RETRY_AUTH' });
    }, [safeDispatch]),

    handleAuthError: useCallback((error: string) => {
      safeDispatch({ type: 'AUTH_LOGIN_ERROR', payload: { error } });
    }, [safeDispatch]),

    closeAuthModal: useCallback(() => {
      safeDispatch({ type: 'SHOW_AUTH_MODAL', payload: { show: false } });
      
      // Clear navigation flags when closing modal
      try {
        localStorage.removeItem('ff-show-app');
        const url = new URL(window.location.href);
        url.searchParams.delete('app');
        window.history.replaceState({}, '', url.toString());
      } catch (error) {
        console.error('Error clearing navigation flags on close:', error);
      }
    }, [safeDispatch]),
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isUnmountedRef.current = true;
      
      // Run all registered cleanup functions
      cleanupRefs.current.forEach(cleanup => {
        try {
          cleanup();
        } catch (error) {
          console.error('Cleanup error:', error);
        }
      });
      
      cleanupRefs.current.clear();
    };
  }, []);

  // Computed values for UI
  const computed = {
    shouldShowAppInterface: state.isAuthenticated && state.isInitialized,
    shouldShowAuthModal: state.showAuthModal && !state.isAuthenticated,
    canRetry: state.retryCount < 3 && !!state.error,
    isMaxRetries: state.retryCount >= 3,
  };

  return {
    state,
    actions,
    computed,
  };
}

export type { AuthState, AuthAction };