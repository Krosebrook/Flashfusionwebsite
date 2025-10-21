/**
 * @fileoverview Optimized Navigation System with Memory Leak Prevention
 * @category Fix Mode - Memory Leak Prevention & Navigation Optimization
 * @version 1.0.0
 * 
 * High-performance navigation system with event listener cleanup,
 * throttled updates, and memory-aware optimizations.
 */

import React, { useEffect, useRef, useCallback, useMemo } from 'react';

// Navigation Event Types
type NavigationEventType = 'route-change' | 'auth-change' | 'storage-change' | 'error';

interface NavigationEvent {
  type: NavigationEventType;
  path: string;
  params: URLSearchParams;
  timestamp: number;
  meta?: Record<string, any>;
}

interface NavigationListener {
  id: string;
  callback: (event: NavigationEvent) => void;
  priority: number;
  once?: boolean;
}

/**
 * Singleton Navigation Manager with Memory Optimization
 */
class OptimizedNavigationManager {
  private static instance: OptimizedNavigationManager;
  private listeners = new Map<string, NavigationListener>();
  private isDestroyed = false;
  private eventQueue: NavigationEvent[] = [];
  private isProcessing = false;
  private cleanupCallbacks = new Set<() => void>();

  // Performance tracking
  private performanceMetrics = {
    listenerCount: 0,
    eventCount: 0,
    lastEventTime: 0,
    averageProcessingTime: 0,
  };

  static getInstance(): OptimizedNavigationManager {
    if (!OptimizedNavigationManager.instance) {
      OptimizedNavigationManager.instance = new OptimizedNavigationManager();
    }
    return OptimizedNavigationManager.instance;
  }

  private constructor() {
    this.initialize();
  }

  private initialize() {
    if (typeof window === 'undefined') return;

    // Throttled route change handler
    let routeChangeTimeout: NodeJS.Timeout;
    const handleRouteChange = () => {
      clearTimeout(routeChangeTimeout);
      routeChangeTimeout = setTimeout(() => {
        this.emitEvent({
          type: 'route-change',
          path: window.location.pathname,
          params: new URLSearchParams(window.location.search),
          timestamp: Date.now(),
        });
      }, 16); // ~60fps throttling
    };

    // Storage change handler for cross-tab sync
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('ff-')) {
        this.emitEvent({
          type: 'storage-change',
          path: window.location.pathname,
          params: new URLSearchParams(window.location.search),
          timestamp: Date.now(),
          meta: { key: e.key, newValue: e.newValue, oldValue: e.oldValue },
        });
      }
    };

    // Error handler
    const handleError = (error: ErrorEvent) => {
      this.emitEvent({
        type: 'error',
        path: window.location.pathname,
        params: new URLSearchParams(window.location.search),
        timestamp: Date.now(),
        meta: { error: error.error, message: error.message },
      });
    };

    // Add listeners
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('pushstate', handleRouteChange);
    window.addEventListener('replacestate', handleRouteChange);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('error', handleError);

    // Register cleanup
    this.cleanupCallbacks.add(() => {
      clearTimeout(routeChangeTimeout);
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('pushstate', handleRouteChange);
      window.removeEventListener('replacestate', handleRouteChange);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('error', handleError);
    });

    // Patch history methods to capture programmatic navigation
    this.patchHistoryMethods();
  }

  private patchHistoryMethods() {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      window.dispatchEvent(new Event('pushstate'));
    };

    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      window.dispatchEvent(new Event('replacestate'));
    };

    // Register cleanup for history patching
    this.cleanupCallbacks.add(() => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    });
  }

  /**
   * Add navigation listener with automatic cleanup
   */
  addListener(
    callback: (event: NavigationEvent) => void,
    options: { priority?: number; once?: boolean } = {}
  ): () => void {
    if (this.isDestroyed) {
      console.warn('Navigation manager is destroyed, ignoring listener');
      return () => {};
    }

    const id = `listener_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const listener: NavigationListener = {
      id,
      callback,
      priority: options.priority || 0,
      once: options.once,
    };

    this.listeners.set(id, listener);
    this.performanceMetrics.listenerCount = this.listeners.size;

    console.log(`📡 Navigation listener added: ${id} (${this.listeners.size} total)`);

    // Return cleanup function
    return () => {
      this.removeListener(id);
    };
  }

  private removeListener(id: string) {
    if (this.listeners.delete(id)) {
      this.performanceMetrics.listenerCount = this.listeners.size;
      console.log(`🗑️ Navigation listener removed: ${id} (${this.listeners.size} remaining)`);
    }
  }

  private async emitEvent(event: NavigationEvent) {
    if (this.isDestroyed || this.listeners.size === 0) return;

    // Add to queue
    this.eventQueue.push(event);
    this.performanceMetrics.eventCount++;
    this.performanceMetrics.lastEventTime = Date.now();

    // Process queue if not already processing
    if (!this.isProcessing) {
      this.processEventQueue();
    }
  }

  private async processEventQueue() {
    this.isProcessing = true;
    const startTime = performance.now();

    try {
      while (this.eventQueue.length > 0 && !this.isDestroyed) {
        const event = this.eventQueue.shift();
        if (!event) continue;

        // Get sorted listeners by priority
        const sortedListeners = Array.from(this.listeners.values())
          .sort((a, b) => b.priority - a.priority);

        // Process listeners
        for (const listener of sortedListeners) {
          try {
            await this.callListener(listener, event);
            
            // Remove one-time listeners
            if (listener.once) {
              this.removeListener(listener.id);
            }
          } catch (error) {
            console.error(`Navigation listener error (${listener.id}):`, error);
          }
        }

        // Yield to prevent blocking
        if (this.eventQueue.length > 0) {
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }
    } finally {
      this.isProcessing = false;
      
      // Update performance metrics
      const processingTime = performance.now() - startTime;
      this.performanceMetrics.averageProcessingTime = 
        (this.performanceMetrics.averageProcessingTime + processingTime) / 2;
    }
  }

  private async callListener(listener: NavigationListener, event: NavigationEvent) {
    // Wrap in try-catch and timeout for safety
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Listener timeout: ${listener.id}`));
      }, 1000); // 1 second timeout

      try {
        const result = listener.callback(event);
        
        if (result instanceof Promise) {
          result
            .then(() => {
              clearTimeout(timeout);
              resolve();
            })
            .catch(error => {
              clearTimeout(timeout);
              reject(error);
            });
        } else {
          clearTimeout(timeout);
          resolve();
        }
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    return { ...this.performanceMetrics };
  }

  /**
   * Force cleanup and destroy manager
   */
  destroy() {
    console.log('🧹 Destroying navigation manager...');
    
    this.isDestroyed = true;
    
    // Clear all listeners
    this.listeners.clear();
    
    // Clear event queue
    this.eventQueue = [];
    
    // Run all cleanup callbacks
    this.cleanupCallbacks.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        console.error('Navigation cleanup error:', error);
      }
    });
    
    this.cleanupCallbacks.clear();
    
    // Reset singleton
    OptimizedNavigationManager.instance = null as any;
  }
}

/**
 * React Hook for Optimized Navigation
 */
export function useOptimizedNavigation() {
  const managerRef = useRef<OptimizedNavigationManager>();
  const listenersRef = useRef<Set<() => void>>(new Set());

  // Initialize manager
  useMemo(() => {
    managerRef.current = OptimizedNavigationManager.getInstance();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Remove all listeners registered by this hook
      listenersRef.current.forEach(cleanup => {
        try {
          cleanup();
        } catch (error) {
          console.error('Navigation listener cleanup error:', error);
        }
      });
      listenersRef.current.clear();
    };
  }, []);

  const addListener = useCallback((
    callback: (event: NavigationEvent) => void,
    options?: { priority?: number; once?: boolean }
  ) => {
    if (!managerRef.current) return () => {};

    const cleanup = managerRef.current.addListener(callback, options);
    listenersRef.current.add(cleanup);

    // Return enhanced cleanup that also removes from our tracking
    return () => {
      cleanup();
      listenersRef.current.delete(cleanup);
    };
  }, []);

  const navigate = useCallback((path: string, options?: { replace?: boolean }) => {
    try {
      if (options?.replace) {
        history.replaceState({}, '', path);
      } else {
        history.pushState({}, '', path);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, []);

  const getMetrics = useCallback(() => {
    return managerRef.current?.getMetrics() || null;
  }, []);

  return {
    addListener,
    navigate,
    getMetrics,
  };
}

/**
 * Navigation Debug Component
 */
export const NavigationDebugPanel: React.FC = () => {
  const { getMetrics } = useOptimizedNavigation();
  const [metrics, setMetrics] = React.useState(getMetrics());
  const [events, setEvents] = React.useState<NavigationEvent[]>([]);

  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(getMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, [getMetrics]);

  // Listen to navigation events for debugging
  const { addListener } = useOptimizedNavigation();
  
  useEffect(() => {
    return addListener((event) => {
      setEvents(prev => [event, ...prev.slice(0, 9)]); // Keep last 10 events
    });
  }, [addListener]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/90 text-white p-4 rounded-lg text-xs z-50 max-w-sm">
      <h3 className="font-semibold mb-2">🧭 Navigation Debug</h3>
      
      {metrics && (
        <div className="space-y-1 mb-3">
          <div>Listeners: {metrics.listenerCount}</div>
          <div>Events: {metrics.eventCount}</div>
          <div>Avg Process: {metrics.averageProcessingTime.toFixed(2)}ms</div>
          <div>Last Event: {metrics.lastEventTime ? new Date(metrics.lastEventTime).toLocaleTimeString() : 'None'}</div>
        </div>
      )}

      <div>
        <div className="font-semibold mb-1">Recent Events:</div>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {events.map((event, i) => (
            <div key={i} className="text-xs opacity-80">
              <span className="text-blue-300">{event.type}</span>
              <span className="ml-2">{event.path}</span>
            </div>
          ))}
          {events.length === 0 && (
            <div className="text-gray-400">No events yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export { OptimizedNavigationManager };
export type { NavigationEvent, NavigationEventType };