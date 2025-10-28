/**
 * @fileoverview Progressive Loading System with Memory-Aware Lazy Loading
 * @category Build Mode - Progressive Loading Implementation
 * @version 1.0.0
 * 
 * Advanced lazy loading system with preloading, error boundaries,
 * memory optimization, and loading state management.
 */

import React, { 
  Suspense, 
  lazy, 
  useEffect, 
  useState, 
  useRef, 
  useCallback, 
  useMemo 
} from 'react';
import { LoadingState } from '../core/app-states/LoadingState';
import { ErrorState } from '../core/app-states/ErrorState';

// Loading Priority Levels
export enum LoadingPriority {
  CRITICAL = 'critical',     // Load immediately
  HIGH = 'high',            // Load after critical
  NORMAL = 'normal',        // Load on demand
  LOW = 'low',              // Load when idle
  BACKGROUND = 'background' // Preload in background
}

// Component Configuration
interface LazyComponentConfig {
  priority: LoadingPriority;
  preload?: boolean;
  retries?: number;
  timeout?: number;
  fallback?: React.ComponentType;
  errorBoundary?: boolean;
  memoryThreshold?: number; // MB
}

// Component Registry
interface ComponentEntry {
  loader: () => Promise<{ default: React.ComponentType<any> }>;
  config: LazyComponentConfig;
  component?: React.ComponentType<any>;
  loading?: boolean;
  error?: Error;
  lastUsed?: number;
}

/**
 * Memory-Aware Component Registry
 */
class LazyComponentRegistry {
  private static instance: LazyComponentRegistry;
  private registry = new Map<string, ComponentEntry>();
  private loadingQueue = new Map<LoadingPriority, Set<string>>();
  private memoryMonitor: MemoryMonitor;

  static getInstance(): LazyComponentRegistry {
    if (!LazyComponentRegistry.instance) {
      LazyComponentRegistry.instance = new LazyComponentRegistry();
    }
    return LazyComponentRegistry.instance;
  }

  private constructor() {
    this.memoryMonitor = new MemoryMonitor();
    this.initializeLoadingQueue();
    this.startBackgroundProcessing();
  }

  private initializeLoadingQueue() {
    Object.values(LoadingPriority).forEach(priority => {
      this.loadingQueue.set(priority as LoadingPriority, new Set());
    });
  }

  /**
   * Register a lazy component
   */
  register(
    id: string, 
    loader: () => Promise<{ default: React.ComponentType<any> }>,
    config: LazyComponentConfig = { priority: LoadingPriority.NORMAL }
  ) {
    const entry: ComponentEntry = {
      loader,
      config: {
        retries: 3,
        timeout: 10000,
        errorBoundary: true,
        memoryThreshold: 50, // 50MB default
        ...config
      }
    };

    this.registry.set(id, entry);

    // Add to appropriate loading queue
    this.loadingQueue.get(config.priority)?.add(id);

    console.log(`📦 Registered lazy component: ${id} (${config.priority})`);

    // Preload if configured
    if (config.preload && config.priority !== LoadingPriority.BACKGROUND) {
      this.preloadComponent(id);
    }
  }

  /**
   * Get or load a component
   */
  async getComponent(id: string): Promise<React.ComponentType<any> | null> {
    const entry = this.registry.get(id);
    if (!entry) {
      console.warn(`Component not registered: ${id}`);
      return null;
    }

    // Update last used timestamp
    entry.lastUsed = Date.now();

    // Return if already loaded
    if (entry.component) {
      return entry.component;
    }

    // Load if not loading
    if (!entry.loading) {
      return this.loadComponent(id);
    }

    // Wait for current loading to complete
    return new Promise((resolve, reject) => {
      const checkLoading = () => {
        const currentEntry = this.registry.get(id);
        if (currentEntry?.component) {
          resolve(currentEntry.component);
        } else if (currentEntry?.error) {
          reject(currentEntry.error);
        } else {
          setTimeout(checkLoading, 100);
        }
      };
      checkLoading();
    });
  }

  /**
   * Load component with retry logic and memory checking
   */
  private async loadComponent(id: string): Promise<React.ComponentType<any> | null> {
    const entry = this.registry.get(id);
    if (!entry) return null;

    entry.loading = true;
    entry.error = undefined;

    // Check memory before loading
    const memoryInfo = this.memoryMonitor.getMemoryInfo();
    if (memoryInfo.usedPercent > (entry.config.memoryThreshold || 50)) {
      console.warn(`Memory threshold exceeded for ${id}, deferring load`);
      await this.cleanupUnusedComponents();
    }

    let lastError: Error | null = null;
    const maxRetries = entry.config.retries || 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`⏳ Loading component ${id} (attempt ${attempt}/${maxRetries})`);

        // Create timeout promise
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Component load timeout')), entry.config.timeout);
        });

        // Race between loader and timeout
        const module = await Promise.race([
          entry.loader(),
          timeoutPromise
        ]);

        entry.component = module.default;
        entry.loading = false;

        console.log(`✅ Component loaded: ${id}`);
        return entry.component;

      } catch (error) {
        lastError = error as Error;
        console.error(`❌ Component load failed ${id} (attempt ${attempt}):`, error);

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    // All retries failed
    entry.loading = false;
    entry.error = lastError || new Error('Unknown loading error');
    
    throw entry.error;
  }

  /**
   * Preload component in background
   */
  private async preloadComponent(id: string) {
    try {
      await this.getComponent(id);
      console.log(`🚀 Preloaded component: ${id}`);
    } catch (error) {
      console.error(`Preload failed for ${id}:`, error);
    }
  }

  /**
   * Background processing for loading queue
   */
  private startBackgroundProcessing() {
    const processQueue = async () => {
      // Process by priority
      for (const priority of Object.values(LoadingPriority)) {
        const queue = this.loadingQueue.get(priority as LoadingPriority);
        if (!queue || queue.size === 0) continue;

        // Only process background loading when idle
        if (priority === LoadingPriority.BACKGROUND) {
          if (!this.isSystemIdle()) continue;
        }

        // Load one component per cycle
        const componentId = queue.values().next().value;
        if (componentId) {
          queue.delete(componentId);
          try {
            await this.preloadComponent(componentId);
          } catch (error) {
            console.error(`Background loading failed for ${componentId}:`, error);
          }
        }

        // Yield to prevent blocking
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    };

    // Run every 2 seconds
    setInterval(processQueue, 2000);
  }

  /**
   * Check if system is idle
   */
  private isSystemIdle(): boolean {
    const memoryInfo = this.memoryMonitor.getMemoryInfo();
    return memoryInfo.usedPercent < 30; // Only preload when memory usage is low
  }

  /**
   * Cleanup unused components to free memory
   */
  private async cleanupUnusedComponents() {
    const now = Date.now();
    const CLEANUP_THRESHOLD = 5 * 60 * 1000; // 5 minutes

    let cleanedCount = 0;

    for (const [id, entry] of this.registry.entries()) {
      if (
        entry.component &&
        entry.lastUsed &&
        (now - entry.lastUsed) > CLEANUP_THRESHOLD
      ) {
        // Keep critical components
        if (entry.config.priority === LoadingPriority.CRITICAL) continue;

        delete entry.component;
        cleanedCount++;
        console.log(`🧹 Cleaned up unused component: ${id}`);
      }
    }

    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} unused components`);
      
      // Force garbage collection if available
      if ('gc' in window && typeof (window as any).gc === 'function') {
        (window as any).gc();
      }
    }
  }

  /**
   * Get registry statistics
   */
  getStats() {
    const total = this.registry.size;
    let loaded = 0;
    let loading = 0;
    let errors = 0;

    for (const entry of this.registry.values()) {
      if (entry.component) loaded++;
      if (entry.loading) loading++;
      if (entry.error) errors++;
    }

    return { total, loaded, loading, errors };
  }
}

/**
 * Memory Monitor for Performance Tracking
 */
class MemoryMonitor {
  getMemoryInfo() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize / 1024 / 1024, // MB
        total: memory.totalJSHeapSize / 1024 / 1024, // MB
        limit: memory.jsHeapSizeLimit / 1024 / 1024, // MB
        usedPercent: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      };
    }

    return {
      used: 0,
      total: 0,
      limit: 0,
      usedPercent: 0
    };
  }
}

/**
 * Enhanced Lazy Component Wrapper
 */
interface LazyWrapperProps {
  componentId: string;
  fallback?: React.ReactNode;
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  children?: React.ReactNode;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  componentId,
  fallback,
  errorFallback,
  children
}) => {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const registry = LazyComponentRegistry.getInstance();

  const loadComponent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const comp = await registry.getComponent(componentId);
      setComponent(() => comp);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [componentId, registry]);

  useEffect(() => {
    loadComponent();
  }, [loadComponent]);

  const retry = useCallback(() => {
    loadComponent();
  }, [loadComponent]);

  if (loading) {
    return (
      <Suspense fallback={fallback || <LoadingState message={`Loading ${componentId}...`} />}>
        {fallback || <LoadingState message={`Loading ${componentId}...`} />}
      </Suspense>
    );
  }

  if (error) {
    const ErrorFallback = errorFallback || DefaultErrorFallback;
    return <ErrorFallback error={error} retry={retry} />;
  }

  if (!Component) {
    return <div>Component not found: {componentId}</div>;
  }

  return <Component {...children} />;
};

/**
 * Default Error Fallback Component
 */
const DefaultErrorFallback: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => (
  <ErrorState 
    error={error.message}
    mode="component"
    onRetry={retry}
    retryCount={0}
    isRecovering={false}
    performanceMetrics={null}
  />
);

/**
 * Hook for Lazy Component Management
 */
export function useLazyComponent(componentId: string, config?: LazyComponentConfig) {
  const registry = LazyComponentRegistry.getInstance();
  const [stats, setStats] = useState(registry.getStats());

  // Update stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(registry.getStats());
    }, 1000);

    return () => clearInterval(interval);
  }, [registry]);

  const preload = useCallback(async () => {
    try {
      await registry.getComponent(componentId);
    } catch (error) {
      console.error(`Preload failed for ${componentId}:`, error);
    }
  }, [componentId, registry]);

  return {
    stats,
    preload,
  };
}

/**
 * High-Level Lazy Component Creator
 */
export function createLazyComponent(
  loader: () => Promise<{ default: React.ComponentType<any> }>,
  config: LazyComponentConfig = { priority: LoadingPriority.NORMAL }
) {
  const registry = LazyComponentRegistry.getInstance();
  const componentId = `lazy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  registry.register(componentId, loader, config);

  return React.forwardRef<any, any>((props, ref) => (
    <LazyWrapper componentId={componentId} {...props} ref={ref} />
  ));
}

/**
 * Lazy Loading Debug Panel
 */
export const LazyLoadingDebugPanel: React.FC = () => {
  const registry = LazyComponentRegistry.getInstance();
  const [stats, setStats] = useState(registry.getStats());
  const memoryMonitor = useMemo(() => new MemoryMonitor(), []);
  const [memoryInfo, setMemoryInfo] = useState(memoryMonitor.getMemoryInfo());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(registry.getStats());
      setMemoryInfo(memoryMonitor.getMemoryInfo());
    }, 1000);

    return () => clearInterval(interval);
  }, [registry, memoryMonitor]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs z-50 max-w-sm">
      <h3 className="font-semibold mb-2">📦 Lazy Loading Debug</h3>
      
      <div className="space-y-1 mb-3">
        <div>Total: {stats.total}</div>
        <div>Loaded: {stats.loaded}</div>
        <div>Loading: {stats.loading}</div>
        <div>Errors: {stats.errors}</div>
      </div>

      <div className="space-y-1">
        <div className="font-semibold">Memory:</div>
        <div>Used: {memoryInfo.used.toFixed(1)}MB</div>
        <div>Usage: {memoryInfo.usedPercent.toFixed(1)}%</div>
        <div className={`h-2 bg-gray-700 rounded overflow-hidden`}>
          <div 
            className={`h-full transition-all duration-300 ${
              memoryInfo.usedPercent > 80 ? 'bg-red-500' :
              memoryInfo.usedPercent > 60 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(memoryInfo.usedPercent, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export { LazyComponentRegistry };
export type { LazyComponentConfig, ComponentEntry };