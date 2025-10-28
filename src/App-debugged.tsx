/**
 * @fileoverview FlashFusion Main Application - Debugged Version
 * @chunk core
 * @category application
 * @version 4.1.0
 * @author FlashFusion Team
 * 
 * Simplified and debugged main application with streamlined authentication.
 */

import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { SimpleErrorBoundary } from './components/ui/simple-error-boundary';
import { TimeoutErrorBoundary } from './components/ui/timeout-error-boundary';
import { EmergencyMode } from './components/ui/emergency-mode';
import { FlashFusionInterface } from './components/core/flash-fusion-interface';
import { FlashFusionLandingPage } from './components/landing/FlashFusionLandingPage';
import { AuthenticationSystem } from './components/auth/AuthenticationSystem';
import { AuthCallback } from './components/auth/AuthCallback';
import { EmailVerification } from './components/auth/EmailVerification';
import { PasswordReset } from './components/auth/PasswordReset';
import { useAppInitialization } from './hooks/useAppInitialization';
import { useAuthentication } from './hooks/useAuthentication';
import type { AuthUser } from './hooks/useAuthentication';
import { LoadingState } from './components/core/app-states/LoadingState';
import { ErrorState } from './components/core/app-states/ErrorState';
import { PerformanceMonitor } from './components/core/app-states/PerformanceMonitor';

// Environment-based debug control
const DEBUG = process.env.NODE_ENV === 'development';
const ENABLE_PERFORMANCE_MONITOR = DEBUG;

/**
 * Simplified App Interface Detection Hook
 * Removed complex navigation event system for better reliability
 */
function useAppInterfaceDetection() {
  const { isAuthenticated, isInitialized, error } = useAuthentication();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [requestedAppAccess, setRequestedAppAccess] = useState(false);

  // Check if user is trying to access the app
  useEffect(() => {
    if (!isInitialized) return;

    const checkAppAccess = () => {
      try {
        // Check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const hasAppParam = urlParams.has('app');
        
        // Check current path
        const currentPath = window.location.pathname;
        const isAppPath = currentPath.includes('/app');
        
        // Check stored preference (simplified)
        const hasStoredPreference = localStorage.getItem('ff-show-app') === 'true';
        
        const wantsApp = hasAppParam || isAppPath || hasStoredPreference;
        
        if (DEBUG) {
          console.log('🔍 App Access Check:', {
            wantsApp,
            isAuthenticated,
            hasAppParam,
            isAppPath,
            hasStoredPreference,
            currentPath
          });
        }
        
        setRequestedAppAccess(wantsApp);
        
        // Show auth modal only if user wants app but isn't authenticated
        if (wantsApp && !isAuthenticated) {
          setShowAuthModal(true);
        } else if (isAuthenticated || !wantsApp) {
          setShowAuthModal(false);
        }
      } catch (error) {
        console.error('App access check error:', error);
        // Safe fallback
        setShowAuthModal(false);
        setRequestedAppAccess(false);
      }
    };

    // Initial check
    checkAppAccess();

    // Listen for URL changes (simplified)
    const handlePopState = () => checkAppAccess();
    window.addEventListener('popstate', handlePopState);

    // Listen for storage changes (cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ff-show-app') {
        checkAppAccess();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAuthenticated, isInitialized]);

  // Handle authentication errors (simplified)
  useEffect(() => {
    if (error && DEBUG) {
      console.error('❌ Authentication error:', error);
    }
  }, [error]);

  return {
    showAppInterface: isAuthenticated && isInitialized,
    showAuthModal: showAuthModal && !isAuthenticated,
    requestedAppAccess,
    setShowAuthModal
  };
}

/**
 * System Information Hook - Memoized
 */
const useSystemInfo = React.useMemo(() => {
  if (!ENABLE_PERFORMANCE_MONITOR) return {};
  
  return {
    connection: 'connection' in navigator ? (navigator as any).connection?.effectiveType : undefined,
    deviceMemory: 'deviceMemory' in navigator ? (navigator as any).deviceMemory : undefined,
    hardwareConcurrency: navigator.hardwareConcurrency,
    platform: navigator.platform
  };
}, []);

/**
 * App Rendering Logic Component
 */
const AppRenderer = React.memo(({ 
  appState, 
  performanceMetrics, 
  systemInfo,
  showAppInterface,
  showAuthModal,
  onAuthSuccess,
  onAuthError,
  onAuthClose
}: {
  appState: any;
  performanceMetrics: any;
  systemInfo: any;
  showAppInterface: boolean;
  showAuthModal: boolean;
  onAuthSuccess: (user: AuthUser) => void;
  onAuthError: (error: string) => void;
  onAuthClose: () => void;
}) => {
  // Check for special auth routes first
  const currentPath = window.location.pathname;
  
  // Handle OAuth callback
  if (currentPath.includes('/auth/callback')) {
    return (
      <AuthCallback
        onAuthSuccess={onAuthSuccess}
        onAuthError={onAuthError}
      />
    );
  }
  
  // Handle email verification
  if (currentPath.includes('/verify-email')) {
    return <EmailVerification />;
  }
  
  // Handle password reset
  if (currentPath.includes('/reset-password')) {
    return <PasswordReset />;
  }

  // Emergency mode
  if (appState.mode === 'emergency') {
    return (
      <div className="min-h-screen bg-[var(--ff-bg-dark)] ff-fade-in-up">
        <EmergencyMode />
      </div>
    );
  }

  // Loading state
  if (appState.isLoading) {
    return (
      <LoadingState 
        isRecovering={appState.isRecovering}
        retryCount={appState.retryCount}
        message="Initializing FlashFusion Platform"
        detail="Preparing your AI development workspace..."
      />
    );
  }

  // Error state
  if (appState.error && appState.mode !== 'emergency') {
    return (
      <ErrorState 
        error={appState.error}
        mode={appState.mode}
        retryCount={appState.retryCount}
        isRecovering={appState.isRecovering}
        performanceMetrics={performanceMetrics}
        onRetry={() => {}}
      />
    );
  }

  // Authentication modal
  if (showAuthModal) {
    return (
      <div className="min-h-screen bg-[var(--ff-bg-dark)]">
        <AuthenticationSystem
          onAuthSuccess={onAuthSuccess}
          onAuthError={onAuthError}
          onClose={onAuthClose}
        />
      </div>
    );
  }

  // Main application interface (requires authentication)
  if (showAppInterface) {
    return (
      <SimpleErrorBoundary>
        <div className="ff-page-transition min-h-screen bg-[var(--ff-bg-dark)]" 
             style={{ fontFamily: 'var(--ff-font-secondary)' }}>
          <Suspense fallback={
            <LoadingState 
              message="Loading FlashFusion Interface" 
              detail="Preparing your AI development workspace..." 
            />
          }>
            <FlashFusionInterface mode={appState.mode} />
          </Suspense>
          
          {/* Development performance monitor */}
          {ENABLE_PERFORMANCE_MONITOR && (
            <PerformanceMonitor 
              mode={appState.mode}
              metrics={performanceMetrics}
              systemInfo={systemInfo}
            />
          )}
        </div>
      </SimpleErrorBoundary>
    );
  }

  // Landing page (public access)
  return (
    <SimpleErrorBoundary>
      <div className="ff-page-transition min-h-screen bg-[var(--ff-bg-dark)]" 
           style={{ fontFamily: 'var(--ff-font-secondary)' }}>
        <FlashFusionLandingPage />
        
        {/* Development performance monitor */}
        {ENABLE_PERFORMANCE_MONITOR && (
          <PerformanceMonitor 
            mode={appState.mode}
            metrics={performanceMetrics}
            systemInfo={systemInfo}
          />
        )}
      </div>
    </SimpleErrorBoundary>
  );
});

AppRenderer.displayName = 'AppRenderer';

/**
 * Main FlashFusion Application - Debugged Version
 */
function App(): JSX.Element {
  const { appState, performanceMetrics } = useAppInitialization();
  const { showAppInterface, showAuthModal, requestedAppAccess, setShowAuthModal } = useAppInterfaceDetection();
  const { isInitialized, clearError, isAuthenticated } = useAuthentication();
  const systemInfo = useSystemInfo;

  // Handle successful authentication
  const handleAuthSuccess = useCallback((user: AuthUser) => {
    if (DEBUG) {
      console.log('🎉 Authentication successful:', user.email);
    }
    
    setShowAuthModal(false);
    clearError();
    
    // Clean up navigation flags
    try {
      localStorage.removeItem('ff-show-app');
      const url = new URL(window.location.href);
      url.searchParams.delete('app');
      window.history.replaceState({}, '', url.toString());
    } catch (error) {
      console.error('Error cleaning navigation flags:', error);
    }
  }, [setShowAuthModal, clearError]);

  // Handle authentication error
  const handleAuthError = useCallback((error: string) => {
    console.error('❌ Authentication failed:', error);
    // Error is handled within the AuthenticationSystem component
  }, []);

  // Handle auth modal close
  const handleAuthClose = useCallback(() => {
    setShowAuthModal(false);
    
    // Clear navigation flags when closing auth modal
    try {
      localStorage.removeItem('ff-show-app');
      const url = new URL(window.location.href);
      url.searchParams.delete('app');
      window.history.replaceState({}, '', url.toString());
    } catch (error) {
      console.error('Error clearing navigation flags on close:', error);
    }
  }, [setShowAuthModal]);

  // Debug logging (development only)
  useEffect(() => {
    if (DEBUG && isInitialized) {
      console.log('🔍 App State Debug:');
      console.log('- Show App Interface:', showAppInterface);
      console.log('- Show Auth Modal:', showAuthModal);
      console.log('- Requested App Access:', requestedAppAccess);
      console.log('- Is Authenticated:', isAuthenticated);
      console.log('- Current URL:', window.location.href);
      console.log('- App State Mode:', appState.mode);
    }
  }, [showAppInterface, showAuthModal, requestedAppAccess, isAuthenticated, appState.mode, isInitialized]);

  // Don't render anything until auth is initialized
  if (!isInitialized) {
    return (
      <LoadingState 
        message="Initializing FlashFusion"
        detail="Setting up your experience..."
      />
    );
  }

  // Add timeout protection wrapper
  return (
    <TimeoutErrorBoundary onError={(error, errorInfo) => {
      console.error('App timeout error:', error, errorInfo);
    }}>
      <div className="ff-app-wrapper">
        <AppRenderer
          appState={appState}
          performanceMetrics={performanceMetrics}
          systemInfo={systemInfo}
          showAppInterface={showAppInterface}
          showAuthModal={showAuthModal}
          onAuthSuccess={handleAuthSuccess}
          onAuthError={handleAuthError}
          onAuthClose={handleAuthClose}
        />
        
        {/* Development debug indicator */}
        {DEBUG && (
          <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-black/80 text-white text-xs p-2 rounded font-mono">
              Auth: {isAuthenticated ? '✅' : '❌'} | 
              Modal: {showAuthModal ? '👁️' : '🚫'} |
              App: {showAppInterface ? '🏠' : '🌐'} |
              Init: {isInitialized ? '✅' : '⏳'}
            </div>
          </div>
        )}
      </div>
    </TimeoutErrorBoundary>
  );
}

App.displayName = 'FlashFusionApp';

// Development debugging helpers (only in development)
if (DEBUG) {
  (window as any).ffDebug = {
    version: '4.1.0-debugged',
    clearStorage: () => {
      localStorage.removeItem('ff-show-app');
      console.log('🧹 Cleared FlashFusion storage');
    },
    showApp: () => {
      localStorage.setItem('ff-show-app', 'true');
      window.location.reload();
    },
    hideApp: () => {
      localStorage.removeItem('ff-show-app');
      window.location.reload();
    }
  };
  
  console.log('🛠️ FlashFusion Debug Mode Active');
  console.log('Use window.ffDebug for debug commands');
}

export default App;