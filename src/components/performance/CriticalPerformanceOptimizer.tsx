import React, { memo, useCallback, useMemo, useEffect, useRef } from 'react';
import { PerformanceMonitor, getMemoryUsage } from '../../utils/performance';
import { analyticsService } from '../../services/AnalyticsService';
import { memoryOptimizer } from '../../utils/memory-optimizer';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  componentCount: number;
  bundleSize: number;
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
  ttfb: number; // Time to First Byte
}

interface CriticalPerformanceOptimizerProps {
  children: React.ReactNode;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

const CriticalPerformanceOptimizer = memo(({ 
  children, 
  onMetricsUpdate 
}: CriticalPerformanceOptimizerProps) => {
  const performanceRef = useRef<PerformanceMonitor>(PerformanceMonitor.getInstance());
  const metricsRef = useRef<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    componentCount: 0,
    bundleSize: 0,
    fcp: 0,
    lcp: 0,
    cls: 0,
    fid: 0,
    ttfb: 0
  });
  const renderStartTime = useRef<number>(performance.now());

  // Memoized performance monitoring setup
  const initializePerformanceMonitoring = useCallback(() => {
    const monitor = performanceRef.current;
    
    // Monitor Web Vitals
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcp) {
          metricsRef.current.fcp = fcp.startTime;
          onMetricsUpdate?.(metricsRef.current);
        }
      });
      
      try {
        fcpObserver.observe({ entryTypes: ['paint'] });
      } catch (error) {
        console.warn('FCP observer failed:', error);
      }

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          metricsRef.current.lcp = lastEntry.startTime;
          onMetricsUpdate?.(metricsRef.current);
        }
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        console.warn('LCP observer failed:', error);
      }

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let cls = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            cls += (entry as any).value;
          }
        }
        metricsRef.current.cls = cls;
        onMetricsUpdate?.(metricsRef.current);
      });
      
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('CLS observer failed:', error);
      }

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstInput = entries[0];
        if (firstInput) {
          metricsRef.current.fid = (firstInput as any).processingStart - firstInput.startTime;
          onMetricsUpdate?.(metricsRef.current);
        }
      });
      
      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (error) {
        console.warn('FID observer failed:', error);
      }

      // Navigation timing for TTFB
      const navigationObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const navEntry = entries[0] as PerformanceNavigationTiming;
        if (navEntry) {
          metricsRef.current.ttfb = navEntry.responseStart - navEntry.requestStart;
          onMetricsUpdate?.(metricsRef.current);
        }
      });
      
      try {
        navigationObserver.observe({ entryTypes: ['navigation'] });
      } catch (error) {
        console.warn('Navigation observer failed:', error);
      }
    }
  }, [onMetricsUpdate]);

  // Optimized memory monitoring
  const monitorMemoryUsage = useCallback(() => {
    const memoryInfo = getMemoryUsage();
    if (memoryInfo) {
      metricsRef.current.memoryUsage = memoryInfo.percentage;
      
      // Alert if memory usage is too high
      if (memoryInfo.percentage > 90) {
        console.warn('🚨 High memory usage detected:', memoryInfo);
        
        // Throttle memory tracking to prevent spam
        const lastMemoryAlert = (window as any).__lastMemoryAlert || 0;
        const now = Date.now();
        
        if (now - lastMemoryAlert > 10000) { // Only alert once every 10 seconds
          (window as any).__lastMemoryAlert = now;
          
          try {
            analyticsService.trackMemoryUsage(memoryInfo);
            
            // Use the memory optimizer for better cleanup
            memoryOptimizer.forceCleanup();
            
          } catch (error) {
            console.warn('Failed to handle high memory usage:', error);
          }
        }
      }
      
      onMetricsUpdate?.(metricsRef.current);
    }
  }, [onMetricsUpdate]);

  // Bundle size estimation
  const estimateBundleSize = useCallback(async () => {
    try {
      // Estimate based on loaded resources
      const resources = performance.getEntriesByType('resource');
      let totalSize = 0;
      
      resources.forEach((resource: any) => {
        if (resource.transferSize) {
          totalSize += resource.transferSize;
        }
      });
      
      metricsRef.current.bundleSize = totalSize;
      onMetricsUpdate?.(metricsRef.current);
    } catch (error) {
      console.warn('Bundle size estimation failed:', error);
    }
  }, [onMetricsUpdate]);

  // Component count estimation
  const countComponents = useCallback(() => {
    const allElements = document.querySelectorAll('*');
    const reactElements = Array.from(allElements).filter(el => 
      el.hasAttribute('data-reactroot') || 
      el.className.includes('react-') ||
      el.hasAttribute('data-testid')
    );
    
    metricsRef.current.componentCount = reactElements.length;
    onMetricsUpdate?.(metricsRef.current);
  }, [onMetricsUpdate]);

  // Performance optimization techniques
  const optimizePerformance = useCallback(() => {
    // Image lazy loading optimization
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      (img as HTMLImageElement).loading = 'lazy';
    });

    // Prefetch critical resources
    const criticalRoutes = ['dashboard', 'tools', 'projects'];
    criticalRoutes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = `/${route}`;
      document.head.appendChild(link);
    });

    // Enable passive event listeners where possible
    const passiveEvents = ['scroll', 'touchstart', 'touchmove', 'wheel'];
    passiveEvents.forEach(eventType => {
      document.addEventListener(eventType, () => {}, { passive: true, once: true });
    });
  }, []);

  // Comprehensive performance monitoring effect
  useEffect(() => {
    initializePerformanceMonitoring();
    optimizePerformance();

    // Initial measurements - delayed to avoid blocking render
    const measureInitialMetrics = () => {
      monitorMemoryUsage();
      estimateBundleSize();
      countComponents();
    };

    // Measure after initial render with longer delay
    setTimeout(measureInitialMetrics, 500);

    // Set up periodic monitoring with longer intervals to reduce overhead
    const memoryInterval = setInterval(monitorMemoryUsage, 15000); // Every 15 seconds instead of 5
    const metricsInterval = setInterval(() => {
      estimateBundleSize();
      countComponents();
    }, 30000); // Every 30 seconds instead of 10

    // Performance budget alerts - less frequent
    const checkPerformanceBudget = () => {
      const metrics = metricsRef.current;
      
      // Performance budget thresholds
      const budgets = {
        fcp: 1800, // 1.8s
        lcp: 2500, // 2.5s
        cls: 0.1,  // 0.1
        fid: 100,  // 100ms
        ttfb: 600  // 600ms
      };

      Object.entries(budgets).forEach(([metric, threshold]) => {
        const value = metrics[metric as keyof PerformanceMetrics];
        if (typeof value === 'number' && value > threshold) {
          console.warn(`⚠️ Performance budget exceeded for ${metric}:`, value, 'threshold:', threshold);
          
          // Throttle budget alerts
          const lastBudgetAlert = (window as any).__lastBudgetAlert || 0;
          const now = Date.now();
          
          if (now - lastBudgetAlert > 30000) { // Only alert once every 30 seconds
            (window as any).__lastBudgetAlert = now;
            
            try {
              analyticsService.trackError('performance_budget', `${metric} exceeded`, {
                metric,
                value,
                threshold,
                page: window.location.pathname
              });
            } catch (error) {
              console.warn('Failed to track performance budget alert:', error);
            }
          }
        }
      });
    };

    const budgetInterval = setInterval(checkPerformanceBudget, 60000); // Every minute instead of 15 seconds

    // Cleanup
    return () => {
      clearInterval(memoryInterval);
      clearInterval(metricsInterval);
      clearInterval(budgetInterval);
    };
  }, [initializePerformanceMonitoring, monitorMemoryUsage, estimateBundleSize, countComponents, optimizePerformance]);

  // Track render time
  useEffect(() => {
    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;
    
    metricsRef.current.renderTime = renderTime;
    
    // Track slow renders - but throttle to prevent spam
    if (renderTime > 16) { // 60fps threshold
      console.warn('🐌 Slow render detected:', renderTime, 'ms');
      
      // Throttle performance tracking to prevent excessive analytics calls
      const lastSlowRenderTime = (window as any).__lastSlowRenderTrack || 0;
      const now = Date.now();
      
      if (now - lastSlowRenderTime > 5000) { // Only track once every 5 seconds
        (window as any).__lastSlowRenderTrack = now;
        
        try {
          analyticsService.trackRenderPerformance('CriticalPerformanceOptimizer', renderTime);
        } catch (error) {
          console.warn('Failed to track render performance:', error);
        }
      }
    }
    
    onMetricsUpdate?.(metricsRef.current);
  });

  // Performance debugging in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const logPerformanceMetrics = () => {
        console.group('🔥 FlashFusion Performance Metrics');
        console.table(metricsRef.current);
        console.groupEnd();
      };

      // Log metrics every 30 seconds in development
      const debugInterval = setInterval(logPerformanceMetrics, 30000);
      
      return () => clearInterval(debugInterval);
    }
  }, []);

  return <>{children}</>;
});

CriticalPerformanceOptimizer.displayName = 'CriticalPerformanceOptimizer';

export default CriticalPerformanceOptimizer;

// Performance monitoring hook for components
export const usePerformanceMonitoring = (componentName: string) => {
  const renderStartTime = useRef<number>(performance.now());
  const performanceMonitor = useRef<PerformanceMonitor | null>(null);

  // Initialize performance monitor safely
  useEffect(() => {
    try {
      performanceMonitor.current = PerformanceMonitor.getInstance();
    } catch (error) {
      console.warn(`Performance monitoring failed to initialize for ${componentName}:`, error);
    }
  }, [componentName]);

  const trackRender = useCallback(() => {
    try {
      if (performanceMonitor.current) {
        const renderTime = performance.now() - renderStartTime.current;
        performanceMonitor.current.recordMetric(`${componentName}-render`, {
          loadTime: renderTime,
          renderTime,
          interactionTime: 0
        });

        if (renderTime > 16) {
          // Use trackRenderPerformance instead of trackPerformance
          try {
            analyticsService.trackRenderPerformance(componentName, renderTime);
          } catch (error) {
            console.warn(`Render performance tracking failed for ${componentName}:`, error);
          }
        }
      }
    } catch (error) {
      console.warn(`Track render failed for ${componentName}:`, error);
    }
  }, [componentName]);

  const trackAsyncOperation = useCallback((operationName: string, operation: () => Promise<any>) => {
    try {
      if (performanceMonitor.current) {
        return performanceMonitor.current.measureAsyncOperation(`${componentName}-${operationName}`, operation);
      } else {
        return operation();
      }
    } catch (error) {
      console.warn(`Track async operation failed for ${componentName}-${operationName}:`, error);
      return operation();
    }
  }, [componentName]);

  useEffect(() => {
    trackRender();
  });

  return {
    trackRender,
    trackAsyncOperation,
    getMetrics: () => performanceMonitor.current?.getAllMetrics() || {}
  };
};

// Memory leak detector
export const useMemoryLeakDetector = (componentName: string) => {
  const memoryMonitor = useRef<(() => void) | null>(null);

  useEffect(() => {
    try {
      // Use the new memory optimizer for better leak detection
      memoryMonitor.current = memoryOptimizer.monitorComponent(componentName);
    } catch (error) {
      console.warn(`Memory leak detector initialization failed for ${componentName}:`, error);
    }

    return () => {
      try {
        if (memoryMonitor.current) {
          memoryMonitor.current();
        }
      } catch (error) {
        console.warn(`Memory leak detector cleanup failed for ${componentName}:`, error);
      }
    };
  }, [componentName]);
};

// Bundle size analyzer
export const analyzeCriticalBundleSize = async () => {
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  
  const analysis = {
    totalSize: 0,
    jsSize: 0,
    cssSize: 0,
    imageSize: 0,
    fontSize: 0,
    criticalResources: [] as Array<{
      name: string;
      size: number;
      type: string;
      critical: boolean;
    }>
  };

  resources.forEach(resource => {
    if (resource.transferSize) {
      analysis.totalSize += resource.transferSize;
      
      const url = new URL(resource.name);
      const extension = url.pathname.split('.').pop()?.toLowerCase();
      
      let type = 'other';
      let critical = false;
      
      if (['js', 'jsx', 'ts', 'tsx'].includes(extension || '')) {
        type = 'javascript';
        analysis.jsSize += resource.transferSize;
        critical = url.pathname.includes('main') || url.pathname.includes('vendor');
      } else if (['css', 'scss', 'sass'].includes(extension || '')) {
        type = 'stylesheet';
        analysis.cssSize += resource.transferSize;
        critical = true;
      } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
        type = 'image';
        analysis.imageSize += resource.transferSize;
        critical = url.pathname.includes('logo') || url.pathname.includes('hero');
      } else if (['woff', 'woff2', 'ttf', 'otf'].includes(extension || '')) {
        type = 'font';
        analysis.fontSize += resource.transferSize;
        critical = true;
      }
      
      analysis.criticalResources.push({
        name: resource.name,
        size: resource.transferSize,
        type,
        critical
      });
    }
  });

  // Sort by size descending
  analysis.criticalResources.sort((a, b) => b.size - a.size);

  return analysis;
};