import { env } from './env';

// Monitoring state
let monitoringInitialized = false;
let sentryAvailable = false;

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

// Initialize monitoring (completely optional)
export const initSentry = () => {
  if (!isBrowser || monitoringInitialized) {
    return;
  }

  monitoringInitialized = true;

  // Try to get Sentry DSN
  const sentryDsn = env.SENTRY_DSN;
  
  if (!sentryDsn) {
    console.debug('Sentry not configured - monitoring disabled');
    return;
  }

  try {
    // Dynamically import Sentry to avoid build issues
    import('@sentry/react').then((Sentry) => {
      Sentry.init({
        dsn: sentryDsn,
        environment: env.NODE_ENV,
        integrations: [
          ...(env.IS_PRODUCTION ? [
            Sentry.replayIntegration?.({
              maskAllText: false,
              blockAllMedia: false,
            })
          ].filter(Boolean) : [])
        ],
        tracesSampleRate: env.IS_PRODUCTION ? 0.1 : 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        beforeSend(event) {
          if (env.IS_DEVELOPMENT) return null;
          return event;
        },
      });
      
      sentryAvailable = true;
      console.debug('Sentry initialized successfully');
    }).catch((error) => {
      console.debug('Sentry initialization failed:', error.message);
    });
  } catch (error) {
    console.debug('Sentry not available:', error);
  }
};

// User context tracking (optional)
export const setUserContext = (user: any) => {
  if (!isBrowser || !sentryAvailable) return;
  
  try {
    import('@sentry/react').then((Sentry) => {
      Sentry.setUser({
        id: user.id,
        email: user.email,
        username: user.user_metadata?.name || user.username,
        level: user.stats?.level || user.level || 1,
        xp: user.stats?.xp || user.total_xp || 0,
      });
    }).catch(() => {
      // Silent fail
    });
  } catch {
    // Silent fail
  }
};

// Error tracking (optional)
export const trackError = (error: Error, context?: Record<string, any>) => {
  // Always log to console
  console.error('Error:', error.message, context);
  
  if (!isBrowser || !sentryAvailable) return;

  try {
    import('@sentry/react').then((Sentry) => {
      Sentry.withScope((scope) => {
        if (context) {
          scope.setContext('custom', context);
        }
        Sentry.captureException(error);
      });
    }).catch(() => {
      // Silent fail
    });
  } catch {
    // Silent fail
  }
};

// Performance tracking (optional)
export const trackPerformance = (operation: string, data?: Record<string, any>) => {
  if (env.IS_DEVELOPMENT) {
    console.debug('Performance:', operation, data);
  }

  if (!isBrowser || !sentryAvailable) {
    return {
      finish: () => {},
    };
  }

  try {
    return import('@sentry/react').then((Sentry) => {
      return Sentry.startTransaction({
        name: operation,
        data,
      });
    }).catch(() => {
      return { finish: () => {} };
    });
  } catch {
    return {
      finish: () => {},
    };
  }
};

// Gamification tracking (optional)
export const trackGamificationEvent = (event: string, data: Record<string, any>) => {
  if (env.IS_DEVELOPMENT) {
    console.debug('Gamification Event:', event, data);
  }

  if (!isBrowser || !sentryAvailable) return;

  try {
    import('@sentry/react').then((Sentry) => {
      Sentry.addBreadcrumb({
        category: 'gamification',
        message: event,
        data,
        level: 'info',
      });
    }).catch(() => {
      // Silent fail
    });
  } catch {
    // Silent fail
  }
};

// AI Tool usage tracking (optional)
export const trackAIToolUsage = (toolId: string, success: boolean, metadata?: Record<string, any>) => {
  if (env.IS_DEVELOPMENT) {
    console.debug('AI Tool Usage:', toolId, success, metadata);
  }

  if (!isBrowser || !sentryAvailable) return;

  try {
    import('@sentry/react').then((Sentry) => {
      Sentry.addBreadcrumb({
        category: 'ai-tools',
        message: `Tool ${toolId} ${success ? 'succeeded' : 'failed'}`,
        data: {
          toolId,
          success,
          ...metadata,
        },
        level: success ? 'info' : 'warning',
      });
    }).catch(() => {
      // Silent fail
    });
  } catch {
    // Silent fail
  }
};

// Monitor performance metrics (optional)
export const monitorPerformance = () => {
  if (!isBrowser) return;

  try {
    // Monitor Core Web Vitals
    if ('performance' in window && 'observe' in PerformanceObserver.prototype) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (env.IS_DEVELOPMENT) {
            console.debug('Performance Metric:', entry.name, entry);
          }
          
          // Track in Sentry if available
          if (sentryAvailable) {
            import('@sentry/react').then((Sentry) => {
              Sentry.addBreadcrumb({
                category: 'performance',
                message: `${entry.name}: ${entry.value || entry.duration}ms`,
                data: {
                  name: entry.name,
                  value: entry.value || entry.duration,
                  entryType: entry.entryType,
                },
                level: 'info',
              });
            }).catch(() => {
              // Silent fail
            });
          }
        });
      });

      // Observe various performance metrics
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
      } catch {
        // Fallback for browsers that don't support all entry types
        try {
          observer.observe({ entryTypes: ['paint', 'navigation'] });
        } catch {
          // Silent fail if no performance monitoring available
        }
      }
    }

    // Monitor memory usage if available
    if ('memory' in performance) {
      const checkMemory = () => {
        const memoryInfo = (performance as any).memory;
        if (env.IS_DEVELOPMENT) {
          console.debug('Memory Usage:', {
            used: memoryInfo.usedJSHeapSize,
            total: memoryInfo.totalJSHeapSize,
            limit: memoryInfo.jsHeapSizeLimit,
          });
        }
      };

      // Check memory every 30 seconds in development
      if (env.IS_DEVELOPMENT) {
        setInterval(checkMemory, 30000);
      }
    }

    console.debug('Performance monitoring initialized');
  } catch (error) {
    console.debug('Performance monitoring initialization failed:', error);
  }
};