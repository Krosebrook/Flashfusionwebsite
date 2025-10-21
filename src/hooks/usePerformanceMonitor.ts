import { useEffect, useMemo } from 'react';
import { 
  PerformanceMonitor, 
  PerformanceMetrics, 
  createComponentPerformanceUtils,
  ComponentPerformanceUtils 
} from '../utils/performance';

/**
 * React hook for component performance monitoring
 * Automatically tracks component mount/unmount times and provides utilities
 * for measuring async operations and recording custom metrics
 */
export function usePerformanceMonitor(componentName: string): ComponentPerformanceUtils {
  const performanceMonitor = PerformanceMonitor.getInstance();

  // Measure component lifecycle
  useEffect(() => {
    const cleanup = performanceMonitor.measureComponentLoad(componentName);
    return cleanup;
  }, [componentName, performanceMonitor]);

  // Memoize performance utilities to avoid recreation on every render
  const performanceUtils = useMemo(
    () => createComponentPerformanceUtils(componentName),
    [componentName]
  );

  return performanceUtils;
}

/**
 * Hook for monitoring page-level performance
 * Tracks page navigation and loading times
 */
export function usePagePerformance(pageName: string) {
  const performanceMonitor = PerformanceMonitor.getInstance();

  useEffect(() => {
    const startTime = performance.now();
    
    // Record page navigation
    performanceMonitor.recordMetric(`page-${pageName}-start`, {
      loadTime: startTime,
      renderTime: 0,
      interactionTime: 0
    });

    return () => {
      const endTime = performance.now();
      performanceMonitor.recordMetric(`page-${pageName}-end`, {
        loadTime: endTime - startTime,
        renderTime: 0,
        interactionTime: 0
      });
    };
  }, [pageName, performanceMonitor]);

  const recordInteraction = (interactionName: string) => {
    const timestamp = performance.now();
    performanceMonitor.recordMetric(`page-${pageName}-interaction-${interactionName}`, {
      loadTime: 0,
      renderTime: 0,
      interactionTime: timestamp
    });
  };

  return { recordInteraction };
}

/**
 * Hook for tracking render performance
 * Measures component render times and provides optimization insights
 */
export function useRenderPerformance(componentName: string) {
  const performanceMonitor = PerformanceMonitor.getInstance();

  useEffect(() => {
    const renderStart = performance.now();
    
    // Use setTimeout to measure render completion
    setTimeout(() => {
      const renderEnd = performance.now();
      const renderTime = renderEnd - renderStart;
      
      performanceMonitor.recordMetric(`render-${componentName}`, {
        loadTime: 0,
        renderTime,
        interactionTime: 0
      });
    }, 0);
  });

  const trackRerender = (reason: string) => {
    const timestamp = performance.now();
    performanceMonitor.recordMetric(`rerender-${componentName}-${reason}`, {
      loadTime: 0,
      renderTime: timestamp,
      interactionTime: 0
    });
  };

  return { trackRerender };
}