import { useEffect } from 'react';
import { ENV, isProduction, isDevelopment, isAnalyticsEnabled } from '../lib/env';
import type { PageType } from '../types/core';

interface AnalyticsConfig {
  googleAnalyticsId?: string;
  enabled: boolean;
  debug: boolean;
}

// Analytics configuration - Using safe environment configuration
function createAnalyticsConfig(): AnalyticsConfig {
  try {
    return {
      googleAnalyticsId: ENV.VITE_GOOGLE_ANALYTICS_ID,
      enabled: isProduction() && isAnalyticsEnabled(),
      debug: isDevelopment()
    };
  } catch (error) {
    console.warn('Failed to create analytics config:', error);
    return {
      enabled: false,
      debug: false
    };
  }
}

// Lazy initialize analytics config
let analyticsConfig: AnalyticsConfig | null = null;
function getAnalyticsConfig(): AnalyticsConfig {
  if (!analyticsConfig) {
    analyticsConfig = createAnalyticsConfig();
  }
  return analyticsConfig;
}

// Track page views
export function trackPageView(page: PageType, title?: string) {
  const config = getAnalyticsConfig();
  
  if (!config.enabled) {
    if (config.debug) {
      console.log('Analytics (Debug): Page view -', { page, title });
    }
    return;
  }

  try {
    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', config.googleAnalyticsId!, {
        page_title: title || page,
        page_location: window.location.href,
        page_path: window.location.pathname
      });
      
      window.gtag('event', 'page_view', {
        page_title: title || page,
        page_location: window.location.href,
        page_path: window.location.pathname
      });
    }
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
}

// Track custom events
export function trackEvent(
  eventName: string, 
  parameters: Record<string, any> = {}
) {
  const config = getAnalyticsConfig();
  
  if (!config.enabled) {
    if (config.debug) {
      console.log('Analytics (Debug): Event -', { eventName, parameters });
    }
    return;
  }

  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        ...parameters,
        timestamp: Date.now()
      });
    }
  } catch (error) {
    console.warn('Analytics event tracking error:', error);
  }
}

// Track tool usage
export function trackToolUsage(toolName: string, action: string, metadata?: Record<string, any>) {
  trackEvent('tool_usage', {
    tool_name: toolName,
    action,
    category: 'Tools',
    ...metadata
  });
}

// Track authentication events
export function trackAuth(action: 'login' | 'logout' | 'signup') {
  trackEvent('auth_action', {
    action,
    category: 'Authentication'
  });
}

// Track generation events
export function trackGeneration(
  type: 'code' | 'content' | 'ecommerce' | 'deployment',
  status: 'started' | 'completed' | 'failed',
  metadata?: Record<string, any>
) {
  trackEvent('generation_event', {
    generation_type: type,
    status,
    category: 'Generation',
    ...metadata
  });
}

// Track download events
export function trackDownload(fileName: string, fileType: string, source: string) {
  trackEvent('file_download', {
    file_name: fileName,
    file_type: fileType,
    source,
    category: 'Downloads'
  });
}

// Track performance metrics
export function trackPerformance(metric: string, value: number, unit: string = 'ms') {
  trackEvent('performance_metric', {
    metric_name: metric,
    value,
    unit,
    category: 'Performance'
  });
}

// Track errors
export function trackError(
  errorType: string,
  errorMessage: string,
  context?: Record<string, any>
) {
  trackEvent('error_occurred', {
    error_type: errorType,
    error_message: errorMessage,
    category: 'Errors',
    ...context
  });
}

// Main Analytics component
export function Analytics() {
  useEffect(() => {
    const config = getAnalyticsConfig();
    
    // Initialize Google Analytics
    if (config.enabled && config.googleAnalyticsId) {
      try {
        // Load Google Analytics script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${config.googleAnalyticsId}`;
        document.head.appendChild(script);

        // Initialize gtag
        if (!window.gtag) {
          window.gtag = function() {
            (window.gtag as any).dataLayer = (window.gtag as any).dataLayer || [];
            (window.gtag as any).dataLayer.push(arguments);
          };
          window.gtag('js', new Date());
          window.gtag('config', config.googleAnalyticsId);
        }
      } catch (error) {
        console.warn('Failed to initialize Google Analytics:', error);
      }
    }

    // Track initial page load
    try {
      trackPageView('home', 'FlashFusion - AI-Powered App Generator');
    } catch (error) {
      console.warn('Failed to track initial page view:', error);
    }

    // Performance monitoring
    if (typeof window !== 'undefined' && 'performance' in window) {
      try {
        // Track page load performance
        window.addEventListener('load', () => {
          setTimeout(() => {
            try {
              const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
              if (perfData) {
                trackPerformance('page_load_time', perfData.loadEventEnd - perfData.fetchStart);
                trackPerformance('dom_content_loaded', perfData.domContentLoadedEventEnd - perfData.fetchStart);
                trackPerformance('first_contentful_paint', perfData.loadEventStart - perfData.fetchStart);
              }
            } catch (error) {
              console.warn('Failed to track performance metrics:', error);
            }
          }, 1000);
        });

        // Track Core Web Vitals if available
        if ('PerformanceObserver' in window) {
          try {
            // Largest Contentful Paint (LCP)
            new PerformanceObserver((list) => {
              try {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                trackPerformance('largest_contentful_paint', lastEntry.startTime);
              } catch (error) {
                console.warn('Failed to track LCP:', error);
              }
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay (FID)
            new PerformanceObserver((list) => {
              try {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                  trackPerformance('first_input_delay', entry.processingStart - entry.startTime);
                });
              } catch (error) {
                console.warn('Failed to track FID:', error);
              }
            }).observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift (CLS)
            new PerformanceObserver((list) => {
              try {
                let clsValue = 0;
                const entries = list.getEntries();
                entries.forEach((entry: any) => {
                  if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                  }
                });
                trackPerformance('cumulative_layout_shift', clsValue, 'score');
              } catch (error) {
                console.warn('Failed to track CLS:', error);
              }
            }).observe({ entryTypes: ['layout-shift'] });
          } catch (error) {
            // Performance Observer not supported
            console.warn('Performance Observer not supported:', error);
          }
        }
      } catch (error) {
        console.warn('Failed to set up performance monitoring:', error);
      }
    }

    // Track user engagement
    let startTime = Date.now();
    let isActive = true;

    const handleVisibilityChange = () => {
      try {
        if (document.hidden) {
          if (isActive) {
            const sessionTime = Date.now() - startTime;
            trackEvent('session_engagement', {
              session_duration: sessionTime,
              category: 'Engagement'
            });
            isActive = false;
          }
        } else {
          startTime = Date.now();
          isActive = true;
        }
      } catch (error) {
        console.warn('Failed to track visibility change:', error);
      }
    };

    const handleBeforeUnload = () => {
      try {
        if (isActive) {
          const sessionTime = Date.now() - startTime;
          trackEvent('session_end', {
            session_duration: sessionTime,
            category: 'Engagement'
          });
        }
      } catch (error) {
        console.warn('Failed to track session end:', error);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // This component doesn't render anything
  return null;
}

// Analytics hooks for React components
export function useAnalytics() {
  return {
    trackPageView,
    trackEvent,
    trackToolUsage,
    trackAuth,
    trackGeneration,
    trackDownload,
    trackPerformance,
    trackError
  };
}

// Enhanced error boundary integration
export function withAnalytics<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return function AnalyticsWrappedComponent(props: P) {
    useEffect(() => {
      try {
        trackEvent('component_mounted', {
          component_name: componentName,
          category: 'Components'
        });

        return () => {
          trackEvent('component_unmounted', {
            component_name: componentName,
            category: 'Components'
          });
        };
      } catch (error) {
        console.warn('Failed to track component analytics:', error);
      }
    }, []);

    return <Component {...props} />;
  };
}

// Default export
export default Analytics;