/**
 * FlashFusion Analytics Utility
 * Privacy-focused analytics and user behavior tracking
 */

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: string;
  sessionId?: string;
  userId?: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: string;
  additionalData?: Record<string, any>;
}

interface UserSession {
  sessionId: string;
  startTime: string;
  lastActivity: string;
  pageViews: number;
  events: AnalyticsEvent[];
  userAgent: string;
  referrer?: string;
  deviceInfo: {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    screenResolution: string;
    deviceMemory?: number;
    connectionType?: string;
  };
}

class FlashFusionAnalytics {
  private sessionId: string;
  private userId: string | null = null;
  private session: UserSession;
  private eventQueue: AnalyticsEvent[] = [];
  private isOnline: boolean = navigator.onLine;
  private sendInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.session = this.initializeSession();
    this.setupEventListeners();
    this.startBatchSending();
    this.loadUserIdFromStorage();
  }

  private generateSessionId(): string {
    return `ff_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSession(): UserSession {
    return {
      sessionId: this.sessionId,
      startTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      pageViews: 0,
      events: [],
      userAgent: navigator.userAgent,
      referrer: document.referrer || undefined,
      deviceInfo: {
        isMobile: this.isMobile(),
        isTablet: this.isTablet(),
        isDesktop: this.isDesktop(),
        screenResolution: `${screen.width}x${screen.height}`,
        deviceMemory: (navigator as any).deviceMemory,
        connectionType: (navigator as any).connection?.effectiveType
      }
    };
  }

  private loadUserIdFromStorage(): void {
    try {
      this.userId = localStorage.getItem('ff-user-id');
    } catch (error) {
      console.warn('Could not load user ID from localStorage:', error);
    }
  }

  private isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  private isTablet(): boolean {
    return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
  }

  private isDesktop(): boolean {
    return !this.isMobile() && !this.isTablet();
  }

  private setupEventListeners(): void {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.track('page_hidden');
      } else {
        this.track('page_visible');
      }
    });

    // Track online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.track('connection_restored');
      this.flushEventQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.track('connection_lost');
    });

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.track('page_unload');
      this.flushEventQueue(true); // Force immediate send
    });

    // Track errors
    window.addEventListener('error', (event) => {
      this.trackError('javascript_error', {
        message: event.error?.message || 'Unknown error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError('unhandled_promise_rejection', {
        reason: event.reason?.toString() || 'Unknown rejection'
      });
    });
  }

  private startBatchSending(): void {
    // Send events every 30 seconds
    this.sendInterval = setInterval(() => {
      if (this.eventQueue.length > 0 && this.isOnline) {
        this.flushEventQueue();
      }
    }, 30000);
  }

  /**
   * Set user ID for tracking
   */
  setUserId(userId: string): void {
    this.userId = userId;
    try {
      localStorage.setItem('ff-user-id', userId);
    } catch (error) {
      console.warn('Could not save user ID to localStorage:', error);
    }
    this.track('user_identified', { userId });
  }

  /**
   * Track a custom event
   */
  track(event: string, properties?: Record<string, any>): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        path: window.location.pathname,
        userAgent: navigator.userAgent,
        referrer: document.referrer || undefined
      },
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId || undefined
    };

    this.eventQueue.push(analyticsEvent);
    this.session.events.push(analyticsEvent);
    this.session.lastActivity = new Date().toISOString();

    // Send immediately for critical events
    const criticalEvents = ['error', 'crash', 'payment_completed', 'signup_completed'];
    if (criticalEvents.some(critical => event.includes(critical))) {
      this.flushEventQueue(true);
    }

    console.log('Analytics Event:', event, properties);
  }

  /**
   * Track page view
   */
  trackPageView(page?: string, title?: string): void {
    this.session.pageViews++;
    this.track('page_view', {
      page: page || window.location.pathname,
      title: title || document.title,
      pageViewNumber: this.session.pageViews
    });
  }

  /**
   * Track user interaction
   */
  trackInteraction(type: string, element: string, properties?: Record<string, any>): void {
    this.track('user_interaction', {
      interactionType: type,
      element,
      ...properties
    });
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metric: PerformanceMetric): void {
    this.track('performance_metric', {
      metricName: metric.name,
      metricValue: metric.value,
      ...metric.additionalData
    });
  }

  /**
   * Track errors
   */
  trackError(type: string, errorDetails: Record<string, any>): void {
    this.track('error', {
      errorType: type,
      ...errorDetails,
      severity: 'error'
    });
  }

  /**
   * Track feature usage
   */
  trackFeatureUsage(feature: string, action: string, properties?: Record<string, any>): void {
    this.track('feature_usage', {
      feature,
      action,
      ...properties
    });
  }

  /**
   * Track conversion events
   */
  trackConversion(type: string, value?: number, properties?: Record<string, any>): void {
    this.track('conversion', {
      conversionType: type,
      value,
      ...properties
    });
  }

  /**
   * Flush event queue to server
   */
  private async flushEventQueue(force: boolean = false): Promise<void> {
    if (this.eventQueue.length === 0) return;
    if (!this.isOnline && !force) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events,
          session: this.session,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        // Re-queue events if send failed
        this.eventQueue.unshift(...events);
        console.warn('Failed to send analytics events:', response.statusText);
      }
    } catch (error) {
      // Re-queue events if send failed
      this.eventQueue.unshift(...events);
      console.warn('Analytics send error:', error);
    }
  }

  /**
   * Get session information
   */
  getSession(): UserSession {
    return { ...this.session };
  }

  /**
   * Clear all stored analytics data
   */
  clearData(): void {
    this.eventQueue = [];
    this.session.events = [];
    try {
      localStorage.removeItem('ff-user-id');
    } catch (error) {
      console.warn('Could not clear analytics data from localStorage:', error);
    }
  }

  /**
   * Destroy analytics instance
   */
  destroy(): void {
    if (this.sendInterval) {
      clearInterval(this.sendInterval);
    }
    this.flushEventQueue(true);
  }
}

// Global analytics instance
let analyticsInstance: FlashFusionAnalytics | null = null;

/**
 * Initialize analytics
 */
export const initializeAnalytics = (): FlashFusionAnalytics => {
  if (analyticsInstance) {
    return analyticsInstance;
  }

  analyticsInstance = new FlashFusionAnalytics();
  
  // Auto-track initial page view
  analyticsInstance.trackPageView();

  // Track performance metrics
  if ('performance' in window && 'getEntriesByType' in performance) {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        analyticsInstance?.trackPerformance({
          name: 'page_load_time',
          value: navigation.loadEventEnd - navigation.fetchStart,
          timestamp: new Date().toISOString(),
          additionalData: {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
            firstContentfulPaint: 0, // Would need additional measurement
            timeToInteractive: 0 // Would need additional measurement
          }
        });
      }
    });
  }

  return analyticsInstance;
};

/**
 * Get analytics instance
 */
export const getAnalytics = (): FlashFusionAnalytics | null => {
  return analyticsInstance;
};

/**
 * Quick access functions
 */
export const track = (event: string, properties?: Record<string, any>) => {
  analyticsInstance?.track(event, properties);
};

export const trackPageView = (page?: string, title?: string) => {
  analyticsInstance?.trackPageView(page, title);
};

export const trackInteraction = (type: string, element: string, properties?: Record<string, any>) => {
  analyticsInstance?.trackInteraction(type, element, properties);
};

export const trackFeatureUsage = (feature: string, action: string, properties?: Record<string, any>) => {
  analyticsInstance?.trackFeatureUsage(feature, action, properties);
};

export const trackConversion = (type: string, value?: number, properties?: Record<string, any>) => {
  analyticsInstance?.trackConversion(type, value, properties);
};

export const setUserId = (userId: string) => {
  analyticsInstance?.setUserId(userId);
};

// Export types
export type { AnalyticsEvent, PerformanceMetric, UserSession };
export default FlashFusionAnalytics;