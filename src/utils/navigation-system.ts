/**
 * @fileoverview Enhanced Navigation System for FlashFusion
 * @chunk core
 * @category utilities
 * @version 2.0.0
 * @author FlashFusion Team
 * 
 * Comprehensive navigation system with robust URL detection and state management.
 */

/**
 * Navigation Event Manager
 * Handles all navigation-related events and state changes
 */
export class NavigationEventManager {
  private static instance: NavigationEventManager;
  private listeners: Set<() => void> = new Set();

  static getInstance(): NavigationEventManager {
    if (!NavigationEventManager.instance) {
      NavigationEventManager.instance = new NavigationEventManager();
    }
    return NavigationEventManager.instance;
  }

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Real DOM events that we can listen to
    window.addEventListener('popstate', () => this.notifyListeners());
    window.addEventListener('hashchange', () => this.notifyListeners());
    
    // Custom navigation event
    window.addEventListener('ff-navigation-change', () => this.notifyListeners());
    
    // Storage events (for cross-tab sync)
    window.addEventListener('storage', (e) => {
      if (e.key === 'ff-show-app') {
        this.notifyListeners();
      }
    });

    // Override pushState and replaceState to emit custom events
    this.overrideHistoryMethods();
  }

  private overrideHistoryMethods(): void {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      window.dispatchEvent(new CustomEvent('ff-navigation-change'));
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      window.dispatchEvent(new CustomEvent('ff-navigation-change'));
    };
  }

  addListener(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    console.log('🔔 Navigation change detected, notifying', this.listeners.size, 'listeners');
    this.listeners.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('❌ Navigation listener error:', error);
      }
    });
  }

  // Manual trigger method
  triggerNavigationChange(): void {
    window.dispatchEvent(new CustomEvent('ff-navigation-change'));
  }
}

/**
 * Enhanced URL Parameter Detection
 */
export class URLParameterDetector {
  private static cachedResult: boolean | null = null;
  private static lastCheck: number = 0;
  private static readonly CACHE_DURATION = 500; // Very short cache for responsiveness

  /**
   * Enhanced app interface detection
   */
  static shouldShowAppInterface(): boolean {
    const now = Date.now();
    
    // Skip cache in development for immediate updates
    const useCache = process.env.NODE_ENV !== 'development';
    
    if (useCache && this.cachedResult !== null && (now - this.lastCheck) < this.CACHE_DURATION) {
      return this.cachedResult;
    }

    try {
      const result = this.performDetection();
      
      // Cache the result
      this.cachedResult = result;
      this.lastCheck = now;
      
      return result;
    } catch (error) {
      console.warn('⚠️ URL detection failed:', error);
      return false;
    }
  }

  private static performDetection(): boolean {
    // 1. Check localStorage first (most reliable)
    const storedPreference = localStorage.getItem('ff-show-app');
    if (storedPreference === 'true') {
      console.log('🔍 URL Detection: localStorage indicates app interface');
      return true;
    }

    // 2. Check URL parameters
    const { search, pathname, hash } = window.location;
    const searchParams = new URLSearchParams(search);
    
    // URL parameter check
    const hasAppParam = searchParams.get('app') === 'true';
    if (hasAppParam) {
      console.log('🔍 URL Detection: URL param app=true found');
      return true;
    }

    // Hash check
    const hasHashApp = hash === '#app';
    if (hasHashApp) {
      console.log('🔍 URL Detection: Hash #app found');
      return true;
    }

    // Pathname checks
    const appPaths = ['/app', '/dashboard', '/tools', '/projects'];
    const matchesPath = appPaths.some(path => 
      pathname === path || pathname.startsWith(path + '/')
    );
    if (matchesPath) {
      console.log('🔍 URL Detection: App path found:', pathname);
      return true;
    }

    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 URL Detection Debug:');
      console.log('- URL:', window.location.href);
      console.log('- Search:', search);
      console.log('- Pathname:', pathname);
      console.log('- Hash:', hash);
      console.log('- localStorage:', storedPreference);
      console.log('- Result: LANDING PAGE');
    }

    return false;
  }

  static clearCache(): void {
    this.cachedResult = null;
    this.lastCheck = 0;
  }

  static forceCheck(): boolean {
    this.clearCache();
    return this.shouldShowAppInterface();
  }
}

/**
 * Navigation Helper Functions
 */
export class NavigationHelper {
  /**
   * Navigate to app interface
   */
  static enterApp(): void {
    try {
      console.log('🚀 NavigationHelper: Entering app...');
      
      // Set localStorage
      localStorage.setItem('ff-show-app', 'true');
      
      // Update URL
      const url = new URL(window.location.href);
      url.searchParams.set('app', 'true');
      history.pushState({}, '', url.toString());
      
      // Clear cache and trigger events
      URLParameterDetector.clearCache();
      NavigationEventManager.getInstance().triggerNavigationChange();
      
      console.log('✅ NavigationHelper: App entry completed');
    } catch (error) {
      console.error('❌ NavigationHelper: Failed to enter app:', error);
      // Fallback
      window.location.href = '?app=true';
    }
  }

  /**
   * Navigate to landing page
   */
  static exitApp(): void {
    try {
      console.log('🚪 NavigationHelper: Exiting app...');
      
      // Remove localStorage
      localStorage.removeItem('ff-show-app');
      
      // Update URL
      const url = new URL(window.location.href);
      url.searchParams.delete('app');
      url.hash = '';
      history.pushState({}, '', url.toString());
      
      // Clear cache and trigger events
      URLParameterDetector.clearCache();
      NavigationEventManager.getInstance().triggerNavigationChange();
      
      console.log('✅ NavigationHelper: App exit completed');
    } catch (error) {
      console.error('❌ NavigationHelper: Failed to exit app:', error);
      // Fallback
      window.location.href = '/';
    }
  }

  /**
   * Get current navigation state
   */
  static getCurrentState(): {
    showAppInterface: boolean;
    url: string;
    localStorage: string | null;
    timestamp: string;
  } {
    return {
      showAppInterface: URLParameterDetector.shouldShowAppInterface(),
      url: window.location.href,
      localStorage: localStorage.getItem('ff-show-app'),
      timestamp: new Date().toISOString()
    };
  }
}

// Initialize the navigation system
if (typeof window !== 'undefined') {
  NavigationEventManager.getInstance();
  
  // Add global debug helpers
  if (process.env.NODE_ENV === 'development') {
    (window as any).ffNavigation = {
      enterApp: NavigationHelper.enterApp,
      exitApp: NavigationHelper.exitApp,
      getState: NavigationHelper.getCurrentState,
      forceCheck: URLParameterDetector.forceCheck,
      clearCache: URLParameterDetector.clearCache,
    };
  }
}

export default {
  NavigationEventManager,
  URLParameterDetector,
  NavigationHelper
};