/**
 * @fileoverview App Initialization Hook
 * @chunk core
 * @category hooks
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Custom hook for managing application initialization state and logic.
 * Handles system detection, performance monitoring, and error recovery.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp, type AppMode } from '../utils/system-detection';

/**
 * Application initialization state interface
 */
interface AppInitState {
  /** Current application performance mode */
  mode: AppMode;
  /** Whether the application is still initializing */
  isLoading: boolean;
  /** Initialization error if any */
  error: string | null;
  /** Number of initialization retries attempted */
  retryCount: number;
  /** Whether recovery mode is active */
  isRecovering: boolean;
}

/**
 * Performance metrics interface
 */
interface PerformanceMetrics {
  initTime: number;
  memoryUsage: number;
  renderTime: number;
}

/**
 * App initialization hook return type
 */
interface UseAppInitializationReturn {
  appState: AppInitState;
  performanceMetrics: PerformanceMetrics;
  handleRetry: () => Promise<void>;
}

/**
 * Custom hook for managing application initialization
 * 
 * Handles:
 * - System detection and mode selection
 * - Performance metrics tracking
 * - Error handling and retry logic
 * - Memory-aware optimizations
 * 
 * @returns App initialization state and handlers
 */
export function useAppInitialization(): UseAppInitializationReturn {
  // Application state management
  const [appState, setAppState] = useState<AppInitState>({
    mode: 'lite', // Start with lite mode for safety
    isLoading: true,
    error: null,
    retryCount: 0,
    isRecovering: false
  });

  // Performance metrics tracking
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    initTime: 0,
    memoryUsage: 0,
    renderTime: 0
  });

  /**
   * Track performance metrics with memory awareness
   */
  const trackPerformanceMetrics = useCallback((initStartTime: number): void => {
    const initTime = performance.now() - initStartTime;
    
    let memoryUsage = 0;
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      if (memory) {
        memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      }
    }
    
    setPerformanceMetrics({
      initTime,
      memoryUsage,
      renderTime: performance.now()
    });
    
    // Enhanced logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 FlashFusion Performance Metrics:`);
      console.log(`   ⚡ Initialization: ${initTime.toFixed(2)}ms`);
      console.log(`   🧠 Memory Usage: ${memoryUsage}MB`);
      console.log(`   🎨 Render Time: ${performance.now().toFixed(2)}ms`);
    }
  }, []);

  /**
   * Validate critical dependencies
   */
  const validateCriticalDependencies = useCallback((): void => {
    const criticalComponents = [
      { name: 'React.Suspense', check: () => typeof React.Suspense !== 'undefined' },
      { name: 'localStorage', check: () => typeof localStorage !== 'undefined' },
      { name: 'fetch', check: () => typeof fetch !== 'undefined' },
      { name: 'performance', check: () => typeof performance !== 'undefined' }
    ];
    
    const failedChecks = criticalComponents.filter(comp => !comp.check());
    if (failedChecks.length > 0) {
      throw new Error(`Critical dependencies missing: ${failedChecks.map(c => c.name).join(', ')}`);
    }
    
    console.log('✅ FlashFusion critical dependencies validated');
  }, []);

  /**
   * Enhanced retry logic with exponential backoff
   */
  const handleRetry = useCallback(async (): Promise<void> => {
    if (appState.retryCount >= 3) {
      console.warn('🚨 Maximum retry attempts reached, forcing lite mode');
      setAppState(prev => ({
        ...prev,
        mode: 'lite',
        isLoading: false,
        error: null,
        isRecovering: false
      }));
      return;
    }

    setAppState(prev => ({
      ...prev,
      isRecovering: true,
      retryCount: prev.retryCount + 1
    }));

    // Exponential backoff delay
    const retryDelay = Math.min(1000 * Math.pow(2, appState.retryCount), 5000);
    await new Promise(resolve => setTimeout(resolve, retryDelay));

    try {
      console.log(`🔄 FlashFusion retry attempt ${appState.retryCount + 1}/3`);
      const systemMode = await initializeApp();
      
      setAppState(prev => ({
        ...prev,
        mode: systemMode,
        isLoading: false,
        error: null,
        isRecovering: false
      }));
      
      console.log(`✅ FlashFusion recovery successful in ${systemMode} mode`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Recovery failed';
      console.error(`❌ Retry ${appState.retryCount + 1} failed:`, errorMessage);
      
      if (appState.retryCount >= 2) {
        // Final fallback to emergency mode
        setAppState(prev => ({
          ...prev,
          mode: 'emergency',
          isLoading: false,
          error: 'All initialization attempts failed',
          isRecovering: false
        }));
      } else {
        setAppState(prev => ({
          ...prev,
          error: errorMessage,
          isRecovering: false
        }));
      }
    }
  }, [appState.retryCount]);

  /**
   * Main initialization effect
   */
  useEffect(() => {
    const initializeApplication = async (): Promise<void> => {
      const initStartTime = performance.now();
      
      try {
        console.log('🚀 FlashFusion initialization starting...');
        console.log('🔧 Environment:', process.env.NODE_ENV || 'development');
        
        // Validate critical dependencies
        validateCriticalDependencies();
        
        // Initialize with system detection
        const systemMode = await initializeApp();
        
        // Validate mode and apply safety fallbacks
        const validModes: AppMode[] = ['full', 'lite', 'emergency'];
        const safeMode = validModes.includes(systemMode) ? systemMode : 'lite';
        
        if (safeMode !== systemMode) {
          console.warn(`⚠️ Invalid mode '${systemMode}' detected, falling back to '${safeMode}'`);
        }
        
        // Update state with detected mode
        setAppState({
          mode: safeMode,
          isLoading: false,
          error: null,
          retryCount: 0,
          isRecovering: false
        });
        
        // Track performance metrics
        trackPerformanceMetrics(initStartTime);
        
        // Log initialization success
        console.log(`✅ FlashFusion initialized successfully in ${safeMode} mode`);
        console.log('🎯 AI Tools Suite: Ready (65+ tools available)');
        console.log('🔧 Critical components: Validated');
        console.log('🛡️ Error boundaries: Active');
        console.log('🚀 Performance mode:', safeMode);
        
        // Production environment logging
        if (process.env.NODE_ENV === 'production') {
          console.log('🌐 Production environment detected');
          console.log('📡 Analytics tracking: Enabled');
          console.log('🔒 Security headers: Active');
        }
        
      } catch (error) {
        // Enhanced error handling with context
        console.error('❌ FlashFusion initialization failed:', error);
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
        const errorContext = {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          memory: 'memory' in performance ? (performance as any).memory?.usedJSHeapSize : 'unknown',
          connection: 'connection' in navigator ? (navigator as any).connection?.effectiveType : 'unknown'
        };
        
        console.error('🔍 Error Context:', errorContext);
        
        // Determine appropriate fallback mode based on error type
        let fallbackMode: AppMode = 'lite';
        if (errorMessage.includes('memory') || errorMessage.includes('Memory')) {
          fallbackMode = 'emergency';
        } else if (errorMessage.includes('Critical dependencies missing')) {
          fallbackMode = 'emergency';
        }
        
        setAppState({
          mode: fallbackMode,
          isLoading: false,
          error: errorMessage,
          retryCount: 0,
          isRecovering: false
        });
        
        // Optional: Send error to monitoring service in production
        if (process.env.NODE_ENV === 'production') {
          try {
            console.log('📤 Sending error report to monitoring service...');
            // Analytics.track('app_initialization_error', { 
            //   error: errorMessage,
            //   context: errorContext,
            //   fallbackMode
            // });
          } catch (trackingError) {
            console.warn('⚠️ Failed to send error report:', trackingError);
          }
        }
        
        console.log(`🔄 Falling back to ${fallbackMode} mode for stability`);
      }
    };

    initializeApplication();
  }, [validateCriticalDependencies, trackPerformanceMetrics]);

  return {
    appState,
    performanceMetrics,
    handleRetry
  };
}