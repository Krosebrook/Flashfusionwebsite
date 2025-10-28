/**
 * @fileoverview FlashFusion App Core - Main Application Component (Fixed & Optimized)
 * @chunk core
 * @category application
 * @version 5.2.0
 * @author FlashFusion Team
 * 
 * Refactored core application component with:
 * - Fixed import issues and path resolution
 * - Simplified state management with error boundaries
 * - Improved performance and memory management
 * - Enhanced error handling and recovery
 */

import React, { Suspense, useEffect, useState, useCallback } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { AuthErrorBoundary } from '../auth/AuthErrorBoundary';
import { LoadingState } from './app-states/LoadingState';
import { ErrorState } from './app-states/ErrorState';
import { useAuthentication } from '../../hooks/useAuthentication';
import { initializeApp, type AppMode } from '../../utils/system-detection';

// Create safe fallback components with proper React component structure
const createFallbackComponent = (name: string, message: string) => {
  const FallbackComponent: React.FC = () => (
    <div className="min-h-screen bg-[var(--ff-bg-dark)] flex items-center justify-center">
      <div className="p-8 text-center text-white max-w-md">
        <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="text-lg font-semibold mb-2">{message}</h2>
        <p className="text-gray-400 mb-4">This component is temporarily unavailable.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
  FallbackComponent.displayName = `${name}Fallback`;
  return FallbackComponent;
};

// Create fallback components
const InterfaceFallback = createFallbackComponent('FlashFusionInterface', 'Interface Temporarily Unavailable');
const LandingFallback = createFallbackComponent('FlashFusionLandingPage', 'Landing Page Temporarily Unavailable');
const DemoFallback = createFallbackComponent('TryDemoInterface', 'Demo Temporarily Unavailable');
const AuthFallback = createFallbackComponent('AuthenticationSystem', 'Authentication Temporarily Unavailable');

// Simplified and more robust lazy loading
const FlashFusionInterface = React.lazy(() => 
  import('./flash-fusion-interface')
    .catch((error) => {
      console.warn('Failed to load FlashFusionInterface:', error);
      return { default: InterfaceFallback };
    })
);

const FlashFusionLandingPage = React.lazy(() => 
  import('../landing/FlashFusionLandingPage')
    .catch((error) => {
      console.warn('Failed to load FlashFusionLandingPage:', error);
      return { default: LandingFallback };
    })
);

const TryDemoInterface = React.lazy(() => 
  import('../demo/TryDemoInterface')
    .catch((error) => {
      console.warn('Failed to load TryDemoInterface:', error);
      return { default: DemoFallback };
    })
);

// Detect mobile devices
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth <= 768;
};

const AuthenticationSystem = React.lazy(() => {
  // Use mobile-optimized auth on mobile devices
  if (isMobile()) {
    return import('../auth/MobileAuthenticationSystem')
      .catch((error) => {
        console.warn('Failed to load MobileAuthenticationSystem, falling back to regular auth:', error);
        return import('../auth/AuthenticationSystem')
          .catch((fallbackError) => {
            console.warn('Failed to load AuthenticationSystem:', fallbackError);
            return { default: AuthFallback };
          });
      });
  } else {
    return import('../auth/AuthenticationSystem')
      .catch((error) => {
        console.warn('Failed to load AuthenticationSystem:', error);
        return { default: AuthFallback };
      });
  }
});

interface AppState {
  mode: AppMode;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

/**
 * System Information Hook - Simplified and Memoized
 */
function useSystemInfo() {
  return React.useMemo(() => {
    if (typeof window === 'undefined') return {};
    
    return {
      connection: 'connection' in navigator ? (navigator as any).connection?.effectiveType : 'unknown',
      deviceMemory: 'deviceMemory' in navigator ? (navigator as any).deviceMemory : 4,
      hardwareConcurrency: navigator.hardwareConcurrency || 4,
      userAgent: navigator.userAgent,
      platform: navigator.platform
    };
  }, []);
}

/**
 * App Initialization Hook - Simplified
 */
function useAppInitialization() {
  const [appState, setAppState] = useState<AppState>({
    mode: 'lite',
    isLoading: true,
    error: null,
    isInitialized: false
  });

  const initializeSystem = useCallback(async () => {
    try {
      console.log('🚀 FlashFusion initialization starting...');
      
      const detectedMode = await initializeApp();
      
      setAppState({
        mode: detectedMode,
        isLoading: false,
        error: null,
        isInitialized: true
      });
      
      console.log(`✅ FlashFusion initialized in ${detectedMode} mode`);
    } catch (error) {
      console.error('❌ FlashFusion initialization failed:', error);
      
      setAppState({
        mode: 'lite', // Safe fallback
        isLoading: false,
        error: error instanceof Error ? error.message : 'Initialization failed',
        isInitialized: true
      });
    }
  }, []);

  useEffect(() => {
    initializeSystem();
  }, [initializeSystem]);

  return { appState, retry: initializeSystem };
}

/**
 * Route Detection Hook
 */
function useRouteDetection() {
  const [routeInfo, setRouteInfo] = useState({
    currentPath: '/',
    isDemoMode: false,
    isAuthRoute: false,
    shouldShowApp: false
  });

  useEffect(() => {
    const updateRouteInfo = () => {
      const currentPath = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      
      const isDemoMode = searchParams.has('demo') || currentPath.includes('/demo');
      const isAuthRoute = currentPath.includes('/auth/') || currentPath.includes('/verify-') || currentPath.includes('/reset-');
      const shouldShowApp = searchParams.has('app') || localStorage.getItem('ff-show-app') === 'true';
      
      setRouteInfo({
        currentPath,
        isDemoMode,
        isAuthRoute,
        shouldShowApp
      });
    };

    updateRouteInfo();
    
    // Listen for route changes
    const handleRouteChange = () => updateRouteInfo();
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return routeInfo;
}

/**
 * Main FlashFusion Application Core Component
 */
export function AppCore(): JSX.Element {
  const { appState, retry } = useAppInitialization();
  const auth = useAuthentication();
  const systemInfo = useSystemInfo();
  const routeInfo = useRouteDetection();

  // Emergency mode fallback
  if (appState.mode === 'emergency') {
    return (
      <div className="min-h-screen bg-[var(--ff-bg-dark)] flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <h1 className="text-2xl font-bold text-white">🚨 Emergency Mode</h1>
          <p className="text-gray-300">System running in safe mode with limited functionality</p>
          <button 
            onClick={retry}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Retry Initialization
          </button>
        </div>
      </div>
    );
  }

  // Loading state during initialization
  if (!appState.isInitialized || appState.isLoading) {
    return (
      <LoadingState 
        message="Initializing FlashFusion"
        detail="Setting up your AI development workspace..."
      />
    );
  }

  // Error state with retry option
  if (appState.error && appState.mode !== 'emergency') {
    return (
      <ErrorState 
        error={appState.error}
        onRetry={retry}
        mode={appState.mode}
      />
    );
  }

  // Demo mode (no authentication required)
  if (routeInfo.isDemoMode) {
    return (
      <ErrorBoundary fallback={<div className="p-8 text-center text-white">Demo temporarily unavailable</div>}>
        <div className="min-h-screen bg-[var(--ff-bg-dark)]">
          <Suspense fallback={
            <LoadingState 
              message="Loading FlashFusion Demo" 
              detail="Preparing your interactive experience..." 
            />
          }>
            <TryDemoInterface />
          </Suspense>
        </div>
      </ErrorBoundary>
    );
  }

  // Handle authentication routes
  if (routeInfo.isAuthRoute) {
    return (
      <AuthErrorBoundary>
        <div className="min-h-screen bg-[var(--ff-bg-dark)]">
          <Suspense fallback={
            <LoadingState 
              message="Loading Authentication" 
              detail="Securing your session..." 
            />
          }>
            <AuthenticationSystem
              onAuthSuccess={(user) => {
                console.log('Auth success:', user);
                window.location.href = '/';
              }}
              onAuthError={(error) => {
                console.error('Auth error:', error);
              }}
              onClose={() => {
                window.history.back();
              }}
            />
          </Suspense>
        </div>
      </AuthErrorBoundary>
    );
  }

  // Show authentication modal if needed
  if (routeInfo.shouldShowApp && !auth.isAuthenticated && auth.isInitialized) {
    return (
      <AuthErrorBoundary>
        <Suspense fallback={
          <LoadingState 
            message="Loading Authentication" 
            detail="Preparing secure login..." 
          />
        }>
          <AuthenticationSystem
            onAuthSuccess={(user) => {
              console.log('Auth success:', user);
              // Clear URL parameters and localStorage flags
              const url = new URL(window.location.href);
              url.searchParams.delete('app');
              localStorage.removeItem('ff-show-app');
              window.history.replaceState({}, '', url.toString());
            }}
            onAuthError={(error) => {
              console.error('Auth error:', error);
            }}
            onClose={() => {
              // Clear URL parameters and localStorage flags
              const url = new URL(window.location.href);
              url.searchParams.delete('app');
              localStorage.removeItem('ff-show-app');
              window.history.replaceState({}, '', url.toString());
            }}
          />
        </Suspense>
      </AuthErrorBoundary>
    );
  }

  // Main application interface (requires authentication)
  if (auth.isAuthenticated && auth.user) {
    return (
      <ErrorBoundary fallback={<div className="p-8 text-center text-white">Interface temporarily unavailable</div>}>
        <div className="min-h-screen bg-[var(--ff-bg-dark)]">
          <Suspense fallback={
            <LoadingState 
              message="Loading FlashFusion Interface" 
              detail="Preparing your AI development workspace..." 
            />
          }>
            <FlashFusionInterface mode={appState.mode} />
          </Suspense>
          
          {/* Development debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs">
              Mode: {appState.mode} | User: {auth.user.email}
            </div>
          )}
        </div>
      </ErrorBoundary>
    );
  }

  // Landing page (public access)
  return (
    <ErrorBoundary fallback={<div className="p-8 text-center text-white">Landing page temporarily unavailable</div>}>
      <div className="min-h-screen bg-[var(--ff-bg-dark)]">
        <Suspense fallback={
          <LoadingState 
            message="Loading FlashFusion" 
            detail="Preparing the ultimate creators hub..." 
          />
        }>
          <FlashFusionLandingPage />
        </Suspense>
        
        {/* Development debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs">
            Mode: {appState.mode} | Auth: {auth.isInitialized ? 'Ready' : 'Loading'}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

AppCore.displayName = 'FlashFusionAppCore';

// Development debugging helpers
if (process.env.NODE_ENV === 'development') {
  (window as any).ffDebug = {
    version: '5.2.0-fixed',
    features: [
      'Simplified Architecture',
      'Fixed Import Issues',
      'Robust Error Handling',
      'Memory Leak Prevention',
      'Performance Optimized'
    ],
    architecture: 'Clean & Modular'
  };
}

export default AppCore;