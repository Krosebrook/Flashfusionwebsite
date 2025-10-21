import React, { Suspense, lazy, useState, useEffect } from 'react';
import { performanceMonitor, ResourceOptimizer } from '../../utils/performance';
import { ComponentErrorBoundary } from '../ui/error-boundary-enhanced';
import { FullPageLoader } from '../ui/loading-states';

// Code splitting configuration
interface CodeSplitConfig {
  chunkName?: string;
  preload?: boolean;
  retryable?: boolean;
  fallback?: React.ReactNode;
  loadingMessage?: string;
}

// Create a code-split component with advanced options
export function createCodeSplitComponent<T = {}>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  config: CodeSplitConfig = {}
) {
  const {
    chunkName = 'unknown',
    preload = false,
    retryable = true,
    fallback,
    loadingMessage = 'Loading...'
  } = config;

  // Create lazy component with performance monitoring
  const LazyComponent = lazy(async () => {
    const startTime = performance.now();
    
    try {
      const module = await importFn();
      
      // Record loading performance
      const loadTime = performance.now() - startTime;
      performanceMonitor.recordMetric(`chunk-${chunkName}`, {
        loadTime,
        renderTime: 0,
        interactionTime: 0
      });
      
      return module;
    } catch (error) {
      console.error(`Failed to load chunk ${chunkName}:`, error);
      throw error;
    }
  });

  // Preload if requested
  if (preload && typeof window !== 'undefined') {
    setTimeout(() => {
      importFn().catch(() => {
        // Ignore preload errors
      });
    }, 100);
  }

  return React.forwardRef<any, T>((props, ref) => (
    <CodeSplitWrapper
      chunkName={chunkName}
      fallback={fallback}
      loadingMessage={loadingMessage}
      retryable={retryable}
    >
      <LazyComponent {...props} ref={ref} />
    </CodeSplitWrapper>
  ));
}

// Wrapper component for code-split components
interface CodeSplitWrapperProps {
  children: React.ReactNode;
  chunkName: string;
  fallback?: React.ReactNode;
  loadingMessage: string;
  retryable: boolean;
}

function CodeSplitWrapper({
  children,
  chunkName,
  fallback,
  loadingMessage,
  retryable
}: CodeSplitWrapperProps) {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    if (retryable && retryCount < 3) {
      setIsRetrying(true);
      setRetryCount(prev => prev + 1);
      
      // Retry after a delay
      setTimeout(() => {
        setIsRetrying(false);
        // Force re-render by updating key
        window.location.reload();
      }, 1000);
    }
  };

  const loadingFallback = fallback || (
    <div className="flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <FullPageLoader message={loadingMessage} />
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Loading {chunkName} module...
          </p>
          {retryCount > 0 && (
            <p className="text-xs text-muted-foreground">
              Retry attempt {retryCount}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  if (isRetrying) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <FullPageLoader message="Retrying..." />
          <p className="text-sm text-muted-foreground">
            Attempting to reload {chunkName}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ComponentErrorBoundary
      onError={() => {
        console.error(`Code split component ${chunkName} crashed`);
      }}
      fallback={
        retryable ? (
          <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-destructive">
                  Failed to load {chunkName}
                </p>
                <p className="text-sm text-muted-foreground">
                  The module could not be loaded properly.
                </p>
              </div>
              <button
                onClick={handleRetry}
                className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                disabled={retryCount >= 3}
              >
                {retryCount >= 3 ? 'Max retries' : 'Retry'}
              </button>
            </div>
          </div>
        ) : undefined
      }
    >
      <Suspense fallback={loadingFallback}>
        {children}
      </Suspense>
    </ComponentErrorBoundary>
  );
}

// Route-based code splitting with preloading
export class RouteManager {
  private static loadedRoutes = new Set<string>();
  private static preloadedRoutes = new Set<string>();

  static createRoute<T = {}>(
    routeName: string,
    importFn: () => Promise<{ default: React.ComponentType<T> }>,
    options: { preload?: boolean; critical?: boolean } = {}
  ) {
    const component = createCodeSplitComponent(importFn, {
      chunkName: routeName,
      preload: options.preload,
      loadingMessage: `Loading ${routeName}...`
    });

    // Mark as loaded when accessed
    this.loadedRoutes.add(routeName);

    return component;
  }

  static preloadRoute(routeName: string) {
    if (!this.preloadedRoutes.has(routeName)) {
      ResourceOptimizer.preloadRoute(routeName);
      this.preloadedRoutes.add(routeName);
    }
  }

  static preloadRoutes(routeNames: string[]) {
    routeNames.forEach(route => this.preloadRoute(route));
  }

  static getLoadedRoutes(): string[] {
    return Array.from(this.loadedRoutes);
  }

  static clearPreloadCache() {
    this.preloadedRoutes.clear();
  }
}

// Smart preloading hook
export function useSmartPreloading() {
  useEffect(() => {
    // Preload critical routes after initial load
    const preloadCriticalRoutes = () => {
      const criticalRoutes = ['dashboard', 'tools'];
      RouteManager.preloadRoutes(criticalRoutes);
    };

    // Preload on idle or after a delay
    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadCriticalRoutes);
    } else {
      setTimeout(preloadCriticalRoutes, 2000);
    }

    // Preload routes on hover/focus (for navigation items)
    const handleNavigation = (event: Event) => {
      const target = event.target as HTMLElement;
      const route = target.getAttribute('data-route');
      if (route) {
        RouteManager.preloadRoute(route);
      }
    };

    document.addEventListener('mouseover', handleNavigation);
    document.addEventListener('focus', handleNavigation, true);

    return () => {
      document.removeEventListener('mouseover', handleNavigation);
      document.removeEventListener('focus', handleNavigation, true);
    };
  }, []);
}

// Progressive loading component
interface ProgressiveLoaderProps {
  stages: Array<{
    name: string;
    component: () => Promise<{ default: React.ComponentType<any> }>;
    condition?: () => boolean;
  }>;
  fallback?: React.ReactNode;
}

export function ProgressiveLoader({ stages, fallback }: ProgressiveLoaderProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [loadedComponents, setLoadedComponents] = useState<React.ComponentType<any>[]>([]);

  useEffect(() => {
    const loadNextStage = async () => {
      if (currentStage < stages.length) {
        const stage = stages[currentStage];
        
        // Check condition if provided
        if (stage.condition && !stage.condition()) {
          setCurrentStage(prev => prev + 1);
          return;
        }

        try {
          const module = await stage.component();
          setLoadedComponents(prev => [...prev, module.default]);
          setCurrentStage(prev => prev + 1);
        } catch (error) {
          console.error(`Failed to load stage ${stage.name}:`, error);
          setCurrentStage(prev => prev + 1);
        }
      }
    };

    loadNextStage();
  }, [currentStage, stages]);

  if (loadedComponents.length === 0) {
    return fallback || <FullPageLoader message="Initializing..." />;
  }

  return (
    <>
      {loadedComponents.map((Component, index) => (
        <Component key={index} />
      ))}
    </>
  );
}

// Predefined code-split components for FlashFusion
export const CodeSplitDashboard = createCodeSplitComponent(
  () => import('../pages/DashboardPage'),
  { chunkName: 'dashboard', preload: true }
);

export const CodeSplitTools = createCodeSplitComponent(
  () => import('../pages/ToolsPage'),
  { chunkName: 'tools', preload: true }
);

export const CodeSplitProjects = createCodeSplitComponent(
  () => import('../pages/ProjectsPage'),
  { chunkName: 'projects' }
);

export const CodeSplitSettings = createCodeSplitComponent(
  () => import('../pages/SettingsPage'),
  { chunkName: 'settings' }
);

export const CodeSplitOrchestration = createCodeSplitComponent(
  () => import('../pages/MultiAgentOrchestrationPage'),
  { chunkName: 'orchestration' }
);

// Analytics for code splitting
export function getCodeSplitAnalytics() {
  const metrics = performanceMonitor.getAllMetrics();
  const chunkMetrics = Object.entries(metrics)
    .filter(([name]) => name.startsWith('chunk-'))
    .reduce((acc, [name, metric]) => {
      acc[name.replace('chunk-', '')] = metric;
      return acc;
    }, {} as Record<string, any>);

  return {
    loadedChunks: Object.keys(chunkMetrics),
    averageLoadTime: Object.values(chunkMetrics)
      .reduce((sum: number, metric: any) => sum + metric.loadTime, 0) / 
      Object.keys(chunkMetrics).length,
    totalLoadTime: Object.values(chunkMetrics)
      .reduce((sum: number, metric: any) => sum + metric.loadTime, 0),
    chunkMetrics
  };
}