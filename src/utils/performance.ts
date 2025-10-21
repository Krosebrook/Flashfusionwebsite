// Performance utilities for FlashFusion
import { isProduction } from './environment';

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage?: number;
  bundleSize?: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private observers: Map<string, PerformanceObserver> = new Map();

  private constructor() {
    this.initializeObservers();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeObservers() {
    if (typeof window === 'undefined') return;

    // Observe paint metrics
    if ('PerformanceObserver' in window) {
      try {
        const paintObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              this.recordMetric('fcp', { 
                loadTime: entry.startTime,
                renderTime: entry.duration || 0,
                interactionTime: 0
              });
            }
            if (entry.name === 'largest-contentful-paint') {
              this.recordMetric('lcp', { 
                loadTime: entry.startTime,
                renderTime: entry.duration || 0,
                interactionTime: 0
              });
            }
          });
        });

        paintObserver.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
        this.observers.set('paint', paintObserver);
      } catch (error) {
        console.warn('Failed to initialize paint observer:', error);
      }

      // Observe navigation timing
      try {
        const navigationObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordMetric('navigation', {
              loadTime: navEntry.loadEventEnd - navEntry.navigationStart,
              renderTime: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              interactionTime: navEntry.loadEventEnd - navEntry.loadEventStart
            });
          });
        });

        navigationObserver.observe({ entryTypes: ['navigation'] });
        this.observers.set('navigation', navigationObserver);
      } catch (error) {
        console.warn('Failed to initialize navigation observer:', error);
      }
    }
  }

  recordMetric(name: string, metric: PerformanceMetrics) {
    this.metrics.set(name, metric);
    
    // Send to analytics in production
    if (isProduction()) {
      this.sendToAnalytics(name, metric);
    }
  }

  getMetric(name: string): PerformanceMetrics | undefined {
    return this.metrics.get(name);
  }

  getAllMetrics(): Record<string, PerformanceMetrics> {
    return Object.fromEntries(this.metrics);
  }

  measureComponentLoad(componentName: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      this.recordMetric(`component-${componentName}`, {
        loadTime,
        renderTime: 0,
        interactionTime: 0
      });
    };
  }

  measureAsyncOperation(
    operationName: string,
    operation: () => Promise<any>
  ): Promise<any> {
    const startTime = performance.now();
    
    return operation().finally(() => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      this.recordMetric(`async-${operationName}`, {
        loadTime: duration,
        renderTime: 0,
        interactionTime: 0
      });
    });
  }

  private async sendToAnalytics(name: string, metric: PerformanceMetrics) {
    try {
      // In a real app, this would send to your analytics service
      const analyticsData = {
        event: 'performance_metric',
        metric_name: name,
        ...metric,
        timestamp: Date.now(),
        user_agent: navigator.userAgent,
        url: window.location.href
      };

      // Store locally for now
      const existingData = localStorage.getItem('ff-performance-metrics');
      const metrics = existingData ? JSON.parse(existingData) : [];
      metrics.push(analyticsData);
      
      // Keep only last 100 metrics
      if (metrics.length > 100) {
        metrics.splice(0, metrics.length - 100);
      }
      
      localStorage.setItem('ff-performance-metrics', JSON.stringify(metrics));
    } catch (error) {
      console.warn('Failed to send performance metric:', error);
    }
  }

  getPerformanceReport(): string {
    const metrics = this.getAllMetrics();
    const report = Object.entries(metrics)
      .map(([name, metric]) => `${name}: ${metric.loadTime.toFixed(2)}ms`)
      .join('\n');
    
    return `Performance Report:\n${report}`;
  }

  cleanup() {
    this.observers.forEach((observer) => {
      observer.disconnect();
    });
    this.observers.clear();
    this.metrics.clear();
  }
}

// Bundle analyzer utility
export function analyzeBundleSize(): Promise<{ size: number; gzipSize: number }> {
  return new Promise((resolve) => {
    // In a real implementation, this would analyze the actual bundle
    // For now, we'll estimate based on the DOM size
    const html = document.documentElement.outerHTML;
    const size = new Blob([html]).size;
    const gzipSize = Math.floor(size * 0.3); // Rough gzip estimate
    
    resolve({ size, gzipSize });
  });
}

// Resource loading optimizer
export class ResourceOptimizer {
  private static preloadedResources = new Set<string>();

  static preloadResource(url: string, type: 'script' | 'style' | 'image' | 'font' = 'script') {
    if (this.preloadedResources.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    
    switch (type) {
      case 'script':
        link.setAttribute('as', 'script');
        break;
      case 'style':
        link.setAttribute('as', 'style');
        break;
      case 'image':
        link.setAttribute('as', 'image');
        break;
      case 'font':
        link.setAttribute('as', 'font');
        link.setAttribute('crossorigin', 'anonymous');
        break;
    }
    
    document.head.appendChild(link);
    this.preloadedResources.add(url);
  }

  static preloadRoute(routeName: string) {
    // Map routes to their chunks (would be generated by build process)
    const routeChunks: Record<string, string[]> = {
      'dashboard': ['/chunks/dashboard.js'],
      'tools': ['/chunks/tools.js', '/chunks/ai-tools.js'],
      'projects': ['/chunks/projects.js'],
      'settings': ['/chunks/settings.js']
    };

    const chunks = routeChunks[routeName];
    if (chunks) {
      chunks.forEach(chunk => this.preloadResource(chunk, 'script'));
    }
  }

  static optimizeImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.getAttribute('data-src');
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px'
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      images.forEach(img => {
        const src = img.getAttribute('data-src');
        if (src) {
          (img as HTMLImageElement).src = src;
          img.removeAttribute('data-src');
        }
      });
    }
  }
}

// Memory usage monitor
export function getMemoryUsage(): { used: number; total: number; percentage: number } | null {
  if ('memory' in performance && (performance as any).memory) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100
    };
  }
  return null;
}

// Performance monitoring utilities for components
export interface ComponentPerformanceUtils {
  recordMetric: (name: string, metric: PerformanceMetrics) => void;
  measureAsync: (name: string, operation: () => Promise<any>) => Promise<any>;
}

export function createComponentPerformanceUtils(componentName: string): ComponentPerformanceUtils {
  const performanceMonitor = PerformanceMonitor.getInstance();

  return {
    recordMetric: (name: string, metric: PerformanceMetrics) => 
      performanceMonitor.recordMetric(`${componentName}-${name}`, metric),
    measureAsync: (name: string, operation: () => Promise<any>) => 
      performanceMonitor.measureAsyncOperation(`${componentName}-${name}`, operation)
  };
}

// Critical resource hints
export function addCriticalResourceHints() {
  // Add DNS prefetch for external domains
  const domains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'api.unsplash.com'
  ];

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });

  // Add preconnect for critical domains
  const criticalDomains = ['fonts.googleapis.com'];
  criticalDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = `https://${domain}`;
    link.setAttribute('crossorigin', 'anonymous');
    document.head.appendChild(link);
  });
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();