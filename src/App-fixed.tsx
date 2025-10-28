/**
 * @fileoverview FlashFusion Main Application - Navigation Fixed
 * @chunk core
 * @category application
 * @version 3.0.0
 * @author FlashFusion Team
 * 
 * Fixed navigation system with robust URL detection and event handling.
 */

import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { SimpleErrorBoundary } from './components/ui/simple-error-boundary';
import { EmergencyMode } from './components/ui/emergency-mode';
import { FlashFusionInterface } from './components/core/flash-fusion-interface';
import { FlashFusionLandingPage } from './components/landing/FlashFusionLandingPage';
import { useAppInitialization } from './hooks/useAppInitialization';
import { LoadingState } from './components/core/app-states/LoadingState';
import { ErrorState } from './components/core/app-states/ErrorState';
import { PerformanceMonitor } from './components/core/app-states/PerformanceMonitor';
import { NavigationDebug } from './components/ui/navigation-debug';
import { 
  NavigationEventManager, 
  URLParameterDetector, 
  NavigationHelper 
} from './utils/navigation-system';

/**
 * Enhanced App Interface Detection Hook
 * Now properly reactive to navigation changes
 */
function useAppInterfaceDetection() {
  const [showAppInterface, setShowAppInterface] = useState(() => {
    // Initial state from URL detection
    return URLParameterDetector.shouldShowAppInterface();
  });

  useEffect(() => {
    const navigationManager = NavigationEventManager.getInstance();
    
    const handleNavigationChange = () => {
      const newState = URLParameterDetector.forceCheck(); // Force fresh check
      console.log('📍 Navigation change detected, new state:', newState);
      setShowAppInterface(newState);
    };

    // Register listener
    const unsubscribe = navigationManager.addListener(handleNavigationChange);
    
    // Initial check
    handleNavigationChange();

    return unsubscribe;
  }, []);

  return showAppInterface;
}

/**
 * System Information Hook - Memoized
 */
function useSystemInfo() {
  return React.useMemo(() => ({
    connection: 'connection' in navigator ? (navigator as any).connection?.effectiveType : undefined,
    deviceMemory: 'deviceMemory' in navigator ? (navigator as any).deviceMemory : undefined,
    hardwareConcurrency: navigator.hardwareConcurrency,
    userAgent: navigator.userAgent,
    platform: navigator.platform
  }), []);
}

/**
 * App Rendering Logic Component
 */
const AppRenderer = React.memo(({ 
  appState, 
  performanceMetrics, 
  systemInfo,
  showAppInterface, 
  handleRetry 
}: {
  appState: any;
  performanceMetrics: any;
  systemInfo: any;
  showAppInterface: boolean;
  handleRetry: () => void;
}) => {
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
        onRetry={handleRetry}
      />
    );
  }

  // Main application interface
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
          {process.env.NODE_ENV === 'development' && (
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

  // Landing page
  return (
    <SimpleErrorBoundary>
      <div className="ff-page-transition min-h-screen bg-[var(--ff-bg-dark)]" 
           style={{ fontFamily: 'var(--ff-font-secondary)' }}>
        <FlashFusionLandingPage />
        
        {/* Development performance monitor */}
        {process.env.NODE_ENV === 'development' && (
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
 * Main FlashFusion Application - Navigation Fixed
 */
function App(): JSX.Element {
  const { appState, performanceMetrics, handleRetry } = useAppInitialization();
  const showAppInterface = useAppInterfaceDetection();
  const systemInfo = useSystemInfo();

  // Debug logging in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 App State Debug:');
      console.log('- Show App Interface:', showAppInterface);
      console.log('- Current URL:', window.location.href);
      console.log('- localStorage ff-show-app:', localStorage.getItem('ff-show-app'));
      console.log('- App State Mode:', appState.mode);
    }
  }, [showAppInterface, appState.mode]);

  // Error recovery mechanism
  const handleGlobalError = useCallback((error: Error, errorInfo: any) => {
    console.error('FlashFusion Global Error:', error, errorInfo);
  }, []);

  return (
    <>
      <AppRenderer
        appState={appState}
        performanceMetrics={performanceMetrics}
        systemInfo={systemInfo}
        showAppInterface={showAppInterface}
        handleRetry={handleRetry}
      />
      
      {/* Development debug component */}
      {process.env.NODE_ENV === 'development' && (
        <NavigationDebug showAppInterface={showAppInterface} />
      )}
    </>
  );
}

App.displayName = 'FlashFusionApp';

// Development debugging helpers
if (process.env.NODE_ENV === 'development') {
  (window as any).ffDebug = {
    navigation: NavigationHelper,
    detector: URLParameterDetector,
    version: '3.0.0-fixed'
  };
}

export default App;