/**
 * FlashFusion System Detection Utilities
 * Intelligent system capability detection with graceful degradation
 * Enhanced with comprehensive browser and device compatibility checks
 */

export type AppMode = 'full' | 'lite' | 'emergency';

/**
 * System capability assessment interface
 */
interface SystemCapabilities {
  deviceMemory: number;
  connectionType: string;
  browserFeatures: {
    webgl: boolean;
    webWorkers: boolean;
    serviceWorkers: boolean;
    intersectionObserver: boolean;
    requestIdleCallback: boolean;
    es6Modules: boolean;
  };
  performanceMetrics: {
    memoryPressure: number;
    batteryLevel?: number;
    isLowEndDevice: boolean;
  };
}

/**
 * Detect browser feature support
 */
const detectBrowserFeatures = () => {
  try {
    return {
      webgl: !!window.WebGLRenderingContext,
      webWorkers: !!window.Worker,
      serviceWorkers: 'serviceWorker' in navigator,
      intersectionObserver: !!window.IntersectionObserver,
      requestIdleCallback: !!window.requestIdleCallback,
      es6Modules: 'noModule' in HTMLScriptElement.prototype
    };
  } catch (error) {
    console.warn('⚠️ Browser feature detection failed:', error);
    return {
      webgl: false,
      webWorkers: false,
      serviceWorkers: false,
      intersectionObserver: false,
      requestIdleCallback: false,
      es6Modules: false
    };
  }
};

/**
 * Assess device performance characteristics
 */
const assessPerformanceMetrics = () => {
  try {
    let memoryPressure = 0;
    let batteryLevel: number | undefined;
    let isLowEndDevice = false;

    // Memory pressure assessment
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      if (memory) {
        memoryPressure = memory.usedJSHeapSize / memory.totalJSHeapSize;
      }
    }

    // Battery level (if available)
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        batteryLevel = battery.level;
      }).catch(() => {
        // Battery API not available or failed
      });
    }

    // Low-end device detection
    const nav = navigator as any;
    const hardwareConcurrency = nav.hardwareConcurrency || 1;
    const deviceMemory = nav.deviceMemory || 1;
    
    isLowEndDevice = hardwareConcurrency <= 2 || deviceMemory <= 1;

    return {
      memoryPressure,
      batteryLevel,
      isLowEndDevice
    };
  } catch (error) {
    console.warn('⚠️ Performance metrics assessment failed:', error);
    return {
      memoryPressure: 0,
      isLowEndDevice: false
    };
  }
};

/**
 * Comprehensive system capability detection
 */
const detectSystemCapabilitiesInternal = (): SystemCapabilities => {
  try {
    const nav = navigator as any;
    
    // Device memory detection with fallbacks
    let deviceMemory = 4; // Default assumption
    if ('deviceMemory' in nav) {
      deviceMemory = nav.deviceMemory;
    } else {
      // Fallback estimation based on other indicators
      const hardwareConcurrency = nav.hardwareConcurrency || 1;
      if (hardwareConcurrency <= 2) deviceMemory = 2;
      if (hardwareConcurrency >= 8) deviceMemory = 8;
    }
    
    // Connection type detection
    let connectionType = 'unknown';
    if ('connection' in nav) {
      const connection = nav.connection;
      connectionType = connection.effectiveType || connection.type || 'unknown';
    }
    
    // Browser features assessment
    const browserFeatures = detectBrowserFeatures();
    
    // Performance metrics
    const performanceMetrics = assessPerformanceMetrics();
    
    return {
      deviceMemory,
      connectionType,
      browserFeatures,
      performanceMetrics
    };
  } catch (error) {
    console.error('❌ System capability detection failed:', error);
    // Return safe defaults
    return {
      deviceMemory: 2,
      connectionType: 'unknown',
      browserFeatures: detectBrowserFeatures(),
      performanceMetrics: {
        memoryPressure: 0.5,
        isLowEndDevice: true
      }
    };
  }
};

/**
 * Smart system health detection with enhanced logic
 * Determines the optimal performance mode based on comprehensive system assessment
 */
export const detectOptimalMode = (): AppMode => {
  try {
    const capabilities = detectSystemCapabilitiesInternal();
    const emergencyFlag = localStorage.getItem('ff-emergency-mode') === 'true';
    
    console.log('🔍 System Capabilities Assessment:', capabilities);
    
    // Emergency mode triggers
    if (emergencyFlag) {
      console.log('🚨 Emergency mode flag detected');
      return 'emergency';
    }
    
    if (capabilities.deviceMemory < 1) {
      console.log('🚨 Critical memory constraint detected');
      return 'emergency';
    }
    
    // Critical browser feature failures
    const criticalFeatures = [
      capabilities.browserFeatures.intersectionObserver,
      capabilities.browserFeatures.es6Modules
    ];
    
    if (criticalFeatures.filter(Boolean).length < 1) {
      console.log('🚨 Critical browser features missing');
      return 'emergency';
    }
    
    // Lite mode triggers
    if (capabilities.deviceMemory < 2) {
      console.log('⚠️ Low memory device detected');
      return 'lite';
    }
    
    if (capabilities.connectionType === 'slow-2g' || capabilities.connectionType === '2g') {
      console.log('⚠️ Slow connection detected');
      return 'lite';
    }
    
    if (capabilities.performanceMetrics.isLowEndDevice) {
      console.log('⚠️ Low-end device detected');
      return 'lite';
    }
    
    if (capabilities.performanceMetrics.memoryPressure > 0.8) {
      console.log('⚠️ High memory pressure detected');
      return 'lite';
    }
    
    // Battery-based optimization
    if (capabilities.performanceMetrics.batteryLevel !== undefined && 
        capabilities.performanceMetrics.batteryLevel < 0.2) {
      console.log('⚠️ Low battery detected, using lite mode');
      return 'lite';
    }
    
    // Modern browser feature availability for full mode
    const modernFeatures = [
      capabilities.browserFeatures.webgl,
      capabilities.browserFeatures.webWorkers,
      capabilities.browserFeatures.serviceWorkers,
      capabilities.browserFeatures.requestIdleCallback
    ];
    
    const modernFeatureScore = modernFeatures.filter(Boolean).length / modernFeatures.length;
    
    if (modernFeatureScore < 0.75) {
      console.log('⚠️ Limited modern browser features, using lite mode');
      return 'lite';
    }
    
    console.log('✅ System capable of full performance mode');
    return 'full';
    
  } catch (error) {
    console.warn('⚠️ System detection failed, defaulting to lite mode:', error);
    return 'lite';
  }
};

/**
 * Legacy compatibility function (backwards compatibility)
 */
export const detectSystemCapabilities = detectOptimalMode;

/**
 * Initialize application with enhanced system detection and validation
 */
export const initializeApp = async (): Promise<AppMode> => {
  const startTime = performance.now();
  
  try {
    console.log('🚀 FlashFusion initialization starting...');
    
    // Brief loading delay for smooth UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Detect optimal performance mode
    const systemMode = detectOptimalMode();
    
    // Validate the detected mode
    const validModes: AppMode[] = ['full', 'lite', 'emergency'];
    if (!validModes.includes(systemMode)) {
      console.warn(`⚠️ Invalid mode detected: ${systemMode}, falling back to lite`);
      return 'lite';
    }
    
    // Additional validation for emergency mode
    if (systemMode === 'emergency') {
      console.warn('🚨 Emergency mode activated - limited functionality available');
      
      // Store emergency flag for persistence
      try {
        localStorage.setItem('ff-last-emergency', Date.now().toString());
      } catch (storageError) {
        console.warn('⚠️ Could not store emergency flag:', storageError);
      }
    }
    
    // Performance logging
    const initTime = performance.now() - startTime;
    console.log(`✅ System detection completed in ${initTime.toFixed(2)}ms`);
    console.log(`🎯 Selected mode: ${systemMode}`);
    
    // Mode-specific initialization
    switch (systemMode) {
      case 'full':
        console.log('🔥 Full performance mode: All features enabled');
        break;
      case 'lite':
        console.log('⚡ Lite mode: Optimized performance with essential features');
        break;
      case 'emergency':
        console.log('🚨 Emergency mode: Critical functionality only');
        break;
    }
    
    return systemMode;
    
  } catch (error) {
    console.error('❌ App initialization failed:', error);
    
    // Emergency fallback
    try {
      localStorage.setItem('ff-emergency-mode', 'true');
    } catch (storageError) {
      // If we can't even access localStorage, system is in critical state
      console.error('💥 Critical system failure - localStorage unavailable');
    }
    
    return 'emergency';
  }
};

/**
 * Clear emergency mode flag (for recovery)
 */
export const clearEmergencyMode = (): void => {
  try {
    localStorage.removeItem('ff-emergency-mode');
    localStorage.removeItem('ff-last-emergency');
    console.log('🔄 Emergency mode flags cleared');
  } catch (error) {
    console.warn('⚠️ Could not clear emergency flags:', error);
  }
};

/**
 * Get system information for debugging
 */
export const getSystemInfo = () => {
  const capabilities = detectSystemCapabilitiesInternal();
  const mode = detectOptimalMode();
  
  return {
    mode,
    capabilities,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    emergencyFlag: localStorage.getItem('ff-emergency-mode'),
    lastEmergency: localStorage.getItem('ff-last-emergency')
  };
};