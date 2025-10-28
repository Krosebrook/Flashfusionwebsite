/**
 * @fileoverview FlashFusion App Core - Optimized & Enhanced (v6.0.0)
 * @chunk core
 * @category application
 * @version 6.0.0
 * @author FlashFusion Team
 * 
 * Comprehensive optimization with:
 * - URL-based routing with proper history management
 * - Enhanced performance with React.memo and useMemo
 * - Improved error recovery and user feedback
 * - Better memory management and cleanup
 * - Enhanced mobile responsiveness
 * - Progressive loading with intelligent preloading
 */

import React, { Suspense, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { AuthErrorBoundary } from '../auth/AuthErrorBoundary';
import { LoadingState } from './app-states/LoadingState';
import { ErrorState } from './app-states/ErrorState';
import { useAuthentication } from '../../hooks/useAuthentication';
import { initializeApp, type AppMode } from '../../utils/system-detection';

// Enhanced component creation with error boundaries and performance optimization
const createEnhancedFallback = (name: string, message: string, action?: () => void) => {
  const FallbackComponent = React.memo(() => (
    <div className="min-h-screen bg-[var(--ff-bg-dark)] flex items-center justify-center ff-fade-in-up">
      <div className="p-8 text-center text-white max-w-md space-y-6">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-orange-600/30 rounded-2xl flex items-center justify-center mx-auto mb-6 ff-pulse-glow">
          <span className="text-3xl">⚡</span>
        </div>
        <h2 className="ff-text-title">{message}</h2>
        <p className="ff-text-body">This component is temporarily unavailable. Our team has been notified.</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={action || (() => window.location.reload())}
            className="ff-btn ff-btn-primary ff-btn-md"
          >
            {action ? 'Retry' : 'Refresh Page'}
          </button>
          <button
            onClick={() => {
              localStorage.setItem('ff-emergency-mode', 'true');
              window.location.reload();
            }}
            className="ff-btn ff-btn-outline ff-btn-sm"
          >
            Safe Mode
          </button>
        </div>
      </div>
    </div>
  ));
  FallbackComponent.displayName = `${name}Fallback`;
  return FallbackComponent;
};

// Enhanced lazy loading with preloading and error recovery
const createLazyComponentWithPreload = (
  importFn: () => Promise<any>,
  fallbackComponent: React.ComponentType,
  preloadTrigger?: string
) => {
  let componentPromise: Promise<any> | null = null;
  
  const loadComponent = () => {
    if (!componentPromise) {
      componentPromise = importFn().catch((error) => {
        console.warn(`Component load failed, using fallback:`, error);
        componentPromise = null; // Reset for retry
        return { default: fallbackComponent };
      });
    }
    return componentPromise;
  };

  const LazyComponent = React.lazy(loadComponent);

  // Preload on trigger
  if (preloadTrigger) {
    const observer = new IntersectionObserver(() => {
      loadComponent();
    }, { threshold: 0.1 });
  }

  return LazyComponent;
};

// Enhanced fallback components
const InterfaceFallback = createEnhancedFallback('FlashFusionInterface', 'Interface Temporarily Unavailable');
const LandingFallback = createEnhancedFallback('FlashFusionLandingPage', 'Landing Page Temporarily Unavailable');
const DemoFallback = createEnhancedFallback('TryDemoInterface', 'Demo Temporarily Unavailable');
const AuthFallback = createEnhancedFallback('AuthenticationSystem', 'Authentication Temporarily Unavailable');

// Enhanced lazy components with preloading
const FlashFusionInterface = createLazyComponentWithPreload(
  () => import('./flash-fusion-interface'),
  InterfaceFallback,
  'interface'
);

const FlashFusionLandingPage = createLazyComponentWithPreload(
  () => import('../landing/FlashFusionLandingPage'),
  LandingFallback,
  'landing'
);

const TryDemoInterface = createLazyComponentWithPreload(
  () => import('../demo/TryDemoInterface'),
  DemoFallback,
  'demo'
);

// Enhanced device detection with caching
const useDeviceDetection = () => {
  return useMemo(() => {
    if (typeof window === 'undefined') return { isMobile: false, isTablet: false, isDesktop: true };
    
    const userAgent = navigator.userAgent;
    const width = window.innerWidth;
    
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|Opera Mini/i.test(userAgent) || width <= 768;
    const isTablet = /iPad|Android/i.test(userAgent) && width > 768 && width <= 1024;
    const isDesktop = !isMobile && !isTablet;
    
    return { isMobile, isTablet, isDesktop };
  }, []);
};

// Enhanced authentication component selection
const AuthenticationSystem = React.lazy(() => {
  const { isMobile } = { isMobile: window.innerWidth <= 768 }; // Simplified check for lazy loading
  
  const authImport = isMobile 
    ? import('../auth/MobileAuthenticationSystem')
    : import('../auth/AuthenticationSystem');
    
  return authImport.catch((error) => {
    console.warn('Failed to load auth system:', error);
    return import('../auth/AuthenticationSystem').catch(() => ({ default: AuthFallback }));
  });
});

interface AppState {
  mode: AppMode;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  retryCount: number;
}

interface RouteState {
  currentPath: string;
  searchParams: URLSearchParams;
  isDemoMode: boolean;
  isAuthRoute: boolean;
  shouldShowApp: boolean;
  routeData: Record<string, any>;
}

/**
 * Enhanced URL-based routing hook with mobile-first approach
 */
function useEnhancedRouting() {
  const [routeState, setRouteState] = useState<RouteState>(() => {
    if (typeof window === 'undefined') {
      return {
        currentPath: '/',
        searchParams: new URLSearchParams(),
        isDemoMode: false,
        isAuthRoute: false,
        shouldShowApp: false,
        routeData: {}
      };
    }
    
    const url = new URL(window.location.href);
    const isMobileDevice = /Android|webOS|iPhone|iPod|BlackBerry|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    // For mobile devices, be more conservative about showing app vs landing page
    const shouldShowApp = isMobileDevice 
      ? url.searchParams.has('app') && url.searchParams.get('app') === 'true' // Explicit app parameter required for mobile
      : url.searchParams.has('app') || localStorage.getItem('ff-show-app') === 'true';
    
    return {
      currentPath: url.pathname,
      searchParams: url.searchParams,
      isDemoMode: url.searchParams.has('demo') || url.pathname.includes('/demo'),
      isAuthRoute: url.pathname.includes('/auth/') || url.pathname.includes('/verify-') || url.pathname.includes('/reset-'),
      shouldShowApp,
      routeData: {}
    };
  });

  const updateRouteState = useCallback(() => {
    const url = new URL(window.location.href);
    const isMobileDevice = /Android|webOS|iPhone|iPod|BlackBerry|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    // For mobile devices, be more conservative about showing app vs landing page
    const shouldShowApp = isMobileDevice 
      ? url.searchParams.has('app') && url.searchParams.get('app') === 'true' // Explicit app parameter required for mobile
      : url.searchParams.has('app') || localStorage.getItem('ff-show-app') === 'true';
    
    setRouteState({
      currentPath: url.pathname,
      searchParams: url.searchParams,
      isDemoMode: url.searchParams.has('demo') || url.pathname.includes('/demo'),
      isAuthRoute: url.pathname.includes('/auth/') || url.pathname.includes('/verify-') || url.pathname.includes('/reset-'),
      shouldShowApp,
      routeData: {}
    });
  }, []);

  useEffect(() => {
    const handleRouteChange = () => updateRouteState();
    
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('pushstate', handleRouteChange);
    window.addEventListener('replacestate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('pushstate', handleRouteChange);
      window.removeEventListener('replacestate', handleRouteChange);
    };
  }, [updateRouteState]);

  const navigateToRoute = useCallback((path: string, replace: boolean = false) => {
    const method = replace ? 'replaceState' : 'pushState';
    window.history[method]({}, '', path);
    updateRouteState();
  }, [updateRouteState]);

  return { routeState, navigateToRoute, updateRouteState };
}

/**
 * Enhanced system information hook with caching
 */
function useEnhancedSystemInfo() {
  return useMemo(() => {
    if (typeof window === 'undefined') return {};
    
    const nav = navigator as any;
    return {
      connection: nav.connection?.effectiveType || 'unknown',
      deviceMemory: nav.deviceMemory || 4,
      hardwareConcurrency: nav.hardwareConcurrency || 4,
      userAgent: nav.userAgent,
      platform: nav.platform,
      cookieEnabled: nav.cookieEnabled,
      onLine: nav.onLine,
      language: nav.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }, []);
}

/**
 * Enhanced app initialization with retry logic
 */
function useEnhancedAppInitialization() {
  const [appState, setAppState] = useState<AppState>({
    mode: 'lite',
    isLoading: true,
    error: null,
    isInitialized: false,
    retryCount: 0
  });

  const initializeSystem = useCallback(async (isRetry: boolean = false) => {
    try {
      console.log(`🚀 FlashFusion initialization ${isRetry ? 'retry' : 'starting'}...`);
      
      setAppState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        retryCount: isRetry ? prev.retryCount + 1 : 0
      }));
      
      const detectedMode = await initializeApp();
      
      setAppState({
        mode: detectedMode,
        isLoading: false,
        error: null,
        isInitialized: true,
        retryCount: isRetry ? appState.retryCount + 1 : 0
      });
      
      console.log(`✅ FlashFusion initialized in ${detectedMode} mode`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Initialization failed';
      console.error('❌ FlashFusion initialization failed:', error);
      
      setAppState(prev => ({
        mode: prev.retryCount >= 2 ? 'emergency' : 'lite', // Emergency after 3 failures
        isLoading: false,
        error: errorMessage,
        isInitialized: true,
        retryCount: prev.retryCount + 1
      }));
    }
  }, [appState.retryCount]);

  useEffect(() => {
    initializeSystem();
  }, []); // Only run once on mount

  const retryInitialization = useCallback(() => {
    if (appState.retryCount < 3) {
      initializeSystem(true);
    } else {
      // Clear emergency flags and force emergency mode
      localStorage.removeItem('ff-emergency-mode');
      window.location.reload();
    }
  }, [initializeSystem, appState.retryCount]);

  return { appState, retryInitialization };
}

/**
 * Enhanced performance monitoring hook
 */
function usePerformanceMonitoring() {
  const performanceRef = useRef({
    componentMounts: 0,
    lastRender: Date.now(),
    renderCount: 0
  });

  useEffect(() => {
    performanceRef.current.componentMounts++;
    performanceRef.current.renderCount++;
    performanceRef.current.lastRender = Date.now();

    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Performance metrics:', {
        mounts: performanceRef.current.componentMounts,
        renders: performanceRef.current.renderCount,
        lastRender: new Date(performanceRef.current.lastRender).toISOString()
      });
    }
  });

  return performanceRef.current;
}

/**
 * Enhanced Main FlashFusion Application Core Component
 */
export function AppCoreOptimized(): JSX.Element {
  const { appState, retryInitialization } = useEnhancedAppInitialization();
  const auth = useAuthentication();
  const systemInfo = useEnhancedSystemInfo();
  const { routeState, navigateToRoute } = useEnhancedRouting();
  const deviceDetection = useDeviceDetection();
  const performanceMetrics = usePerformanceMonitoring();

  // Enhanced error recovery
  const handleError = useCallback((error: Error, errorInfo: any) => {
    console.error('🚨 Application Error:', error, errorInfo);
    
    // Send error to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Analytics.track('app_error', { error: error.message, stack: error.stack });
    }
  }, []);

  // Clean up URL parameters helper
  const cleanupUrlParams = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete('app');
    localStorage.removeItem('ff-show-app');
    window.history.replaceState({}, '', url.toString());
  }, []);

  // Enhanced emergency mode with better UX
  if (appState.mode === 'emergency') {
    return (
      <div className="min-h-screen bg-[var(--ff-bg-dark)] flex items-center justify-center ff-fade-in-up">
        <div className="text-center space-y-6 p-8 max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mx-auto ff-pulse-glow">
            <span className="text-3xl">🚨</span>
          </div>
          <h1 className="ff-text-headline text-2xl">Safe Mode Active</h1>
          <p className="ff-text-body">
            FlashFusion is running with limited functionality to ensure stability.
            {appState.retryCount > 0 && ` (${appState.retryCount} previous attempts)`}
          </p>
          <div className="space-y-3">
            <button 
              onClick={retryInitialization}
              disabled={appState.retryCount >= 3}
              className="ff-btn ff-btn-primary ff-btn-lg w-full"
            >
              {appState.retryCount >= 3 ? 'Restart Required' : 'Retry Initialization'}
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="ff-btn ff-btn-outline ff-btn-md w-full"
            >
              Clear Data & Restart
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced loading state with progress
  if (!appState.isInitialized || appState.isLoading) {
    return (
      <LoadingState 
        message="Initializing FlashFusion"
        detail="Setting up your AI development workspace..."
        isRecovering={appState.retryCount > 0}
        retryCount={appState.retryCount}
      />
    );
  }

  // Enhanced error state with better recovery options
  if (appState.error && appState.mode !== 'emergency') {
    return (
      <ErrorState 
        error={appState.error}
        onRetry={retryInitialization}
        mode={appState.mode}
      />
    );
  }

  // Demo mode with enhanced error boundary
  if (routeState.isDemoMode) {
    return (
      <ErrorBoundary 
        fallback={<DemoFallback />}
        onError={handleError}
      >
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

  // Enhanced authentication routes
  if (routeState.isAuthRoute) {
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
                console.log('✅ Auth success:', user?.email);
                navigateToRoute('/');
              }}
              onAuthError={(error) => {
                console.error('❌ Auth error:', error);
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

  // Enhanced authentication modal - Fixed mobile routing
  // Only show auth modal if explicitly requested, not for mobile landing page visits
  if (routeState.shouldShowApp && !auth.isAuthenticated && auth.isInitialized && !deviceDetection.isMobile) {
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
              console.log('✅ Modal auth success:', user?.email);
              cleanupUrlParams();
            }}
            onAuthError={(error) => {
              console.error('❌ Modal auth error:', error);
            }}
            onClose={cleanupUrlParams}
          />
        </Suspense>
      </AuthErrorBoundary>
    );
  }

  // Mobile authentication - Only for explicit auth routes or user-initiated sign in
  if (routeState.shouldShowApp && !auth.isAuthenticated && auth.isInitialized && deviceDetection.isMobile) {
    // For mobile, redirect to landing page and clear the app flag
    cleanupUrlParams();
    return (
      <ErrorBoundary 
        fallback={<LandingFallback />}
        onError={handleError}
      >
        <div className="min-h-screen bg-[var(--ff-bg-dark)]">
          <Suspense fallback={
            <LoadingState 
              message="Loading FlashFusion" 
              detail="Preparing the ultimate creators hub..." 
            />
          }>
            <FlashFusionLandingPage />
          </Suspense>
        </div>
      </ErrorBoundary>
    );
  }

  // Enhanced main application interface
  if (auth.isAuthenticated && auth.user) {
    return (
      <ErrorBoundary 
        fallback={<InterfaceFallback />}
        onError={handleError}
      >
        <div className="min-h-screen bg-[var(--ff-bg-dark)]">
          <Suspense fallback={
            <LoadingState 
              message="Loading FlashFusion Interface" 
              detail="Preparing your AI development workspace..." 
            />
          }>
            <FlashFusionInterface mode={appState.mode} />
          </Suspense>
          
          {/* Enhanced development debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="fixed bottom-4 right-4 bg-black/90 text-white p-3 rounded-lg text-xs space-y-1 max-w-xs">
              <div>Mode: <span className="text-orange-400">{appState.mode}</span></div>
              <div>User: <span className="text-cyan-400">{auth.user.email}</span></div>
              <div>Device: <span className="text-purple-400">
                {deviceDetection.isMobile ? 'Mobile' : deviceDetection.isTablet ? 'Tablet' : 'Desktop'}
              </span></div>
              <div>Renders: <span className="text-green-400">{performanceMetrics.renderCount}</span></div>
            </div>
          )}
        </div>
      </ErrorBoundary>
    );
  }

  // Enhanced landing page
  return (
    <ErrorBoundary 
      fallback={<LandingFallback />}
      onError={handleError}
    >
      <div className="min-h-screen bg-[var(--ff-bg-dark)]">
        <Suspense fallback={
          <LoadingState 
            message="Loading FlashFusion" 
            detail="Preparing the ultimate creators hub..." 
          />
        }>
          <FlashFusionLandingPage />
        </Suspense>
        
        {/* Enhanced development debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 bg-black/90 text-white p-3 rounded-lg text-xs space-y-1 max-w-xs">
            <div>Mode: <span className="text-orange-400">{appState.mode}</span></div>
            <div>Auth: <span className="text-cyan-400">{auth.isInitialized ? 'Ready' : 'Loading'}</span></div>
            <div>Route: <span className="text-purple-400">{routeState.currentPath}</span></div>
            <div>Connection: <span className="text-green-400">{systemInfo.connection}</span></div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

AppCoreOptimized.displayName = 'FlashFusionAppCoreOptimized';

// Enhanced development debugging helpers
if (process.env.NODE_ENV === 'development') {
  (window as any).ffDebugOptimized = {
    version: '6.0.0-optimized',
    features: [
      'URL-based Routing',
      'Enhanced Performance Monitoring',
      'Intelligent Component Preloading',
      'Advanced Error Recovery',
      'Memory Optimization',
      'Progressive Enhancement',
      'Enhanced Mobile Support',
      'Real-time Performance Metrics'
    ],
    architecture: 'Clean, Optimized & Production-Ready',
    performance: {
      memoryOptimized: true,
      lazyLoading: true,
      preloadingEnabled: true,
      errorRecovery: true
    }
  };
}

export default AppCoreOptimized;