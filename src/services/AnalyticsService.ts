interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  userId?: string;
  timestamp?: number;
}

interface UserProperties {
  userId: string;
  email?: string;
  persona?: string;
  signupDate?: string;
  plan?: string;
  [key: string]: any;
}

interface ConversionGoal {
  name: string;
  category: 'signup' | 'activation' | 'retention' | 'revenue';
  value?: number;
  properties?: Record<string, any>;
}

class AnalyticsService {
  private isInitialized = false;
  private userId: string | null = null;
  private sessionId: string;
  private events: AnalyticsEvent[] = [];
  public isDevelopment: boolean;

  constructor() {
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Safe environment detection using simpler method
    this.isDevelopment = this.isSimpleDevMode();
    
    this.initialize();
  }

  private isSimpleDevMode(): boolean {
    try {
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        const port = window.location.port;
        
        return hostname === 'localhost' || 
               hostname === '127.0.0.1' ||
               port === '5173' ||
               port === '3000';
      }
      return false;
    } catch {
      return false;
    }
  }

  // Method removed - using isSimpleDevMode instead

  private async initialize() {
    try {
      // Initialize Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', 'GA_MEASUREMENT_ID', {
          page_title: 'FlashFusion - AI Development Platform',
          page_location: window.location.href
        });
      }

      // Initialize Mixpanel (if available)
      if (typeof window !== 'undefined' && (window as any).mixpanel) {
        const mixpanelToken = this.getEnvironmentVariable('VITE_MIXPANEL_TOKEN');
        if (mixpanelToken) {
          (window as any).mixpanel.init(mixpanelToken);
        }
      }

      // Set up user tracking
      if (typeof localStorage !== 'undefined') {
        const userId = localStorage.getItem('ff-user-id');
        if (userId) {
          this.setUserId(userId);
        }
      }

      this.isInitialized = true;
      if (this.isDevelopment) {
        console.debug('Analytics service initialized');
      }
    } catch (error) {
      console.error('Analytics initialization failed:', error);
    }
  }

  private getEnvironmentVariable(key: string): string | undefined {
    try {
      // Check process.env first
      if (typeof process !== 'undefined' && process.env) {
        return process.env[key];
      }

      // Check window env (if set by build process)
      if (typeof window !== 'undefined' && (window as any).__ENV__) {
        return (window as any).__ENV__[key];
      }

      return undefined;
    } catch (error) {
      return undefined;
    }
  }

  setUserId(userId: string) {
    try {
      this.userId = userId;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('ff-user-id', userId);
      }

      // Update Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', 'GA_MEASUREMENT_ID', {
          user_id: userId
        });
      }

      // Update Mixpanel
      if (typeof window !== 'undefined' && (window as any).mixpanel) {
        (window as any).mixpanel.identify(userId);
      }
    } catch (error) {
      // Silently handle any storage errors
    }
  }

  track(event: string, properties: Record<string, any> = {}) {
    try {
      const eventData: AnalyticsEvent = {
        event,
        properties: {
          ...properties,
          sessionId: this.sessionId,
          timestamp: Date.now(),
          url: typeof window !== 'undefined' ? window.location.href : '',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
        },
        userId: this.userId || undefined,
        timestamp: Date.now()
      };

      // Store locally for offline support
      this.events.push(eventData);
      this.saveEventsToStorage();

      // Send to Google Analytics
      this.sendToGoogleAnalytics(eventData);

      // Send to Mixpanel
      this.sendToMixpanel(eventData);

      // Send to custom analytics endpoint
      this.sendToCustomEndpoint(eventData);

      // Only log in development to avoid console spam
      if (this.isDevelopment) {
        console.debug('Analytics event tracked:', eventData.event, eventData.properties);
      }
    } catch (error) {
      // Silently handle all tracking errors to prevent breaking the app
      if (this.isDevelopment) {
        console.warn('Analytics tracking error (non-critical):', error);
      }
    }
  }

  private sendToGoogleAnalytics(event: AnalyticsEvent) {
    try {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', event.event, {
          event_category: event.properties.category || 'engagement',
          event_label: event.properties.label,
          value: event.properties.value,
          user_id: event.userId,
          custom_parameters: event.properties
        });
      }
    } catch (error) {
      // Silently handle Google Analytics errors
    }
  }

  private sendToMixpanel(event: AnalyticsEvent) {
    try {
      if (typeof window !== 'undefined' && (window as any).mixpanel) {
        (window as any).mixpanel.track(event.event, event.properties);
      }
    } catch (error) {
      // Silently handle Mixpanel errors
    }
  }

  private async sendToCustomEndpoint(event: AnalyticsEvent) {
    // Skip endpoint calls in development to avoid 404 errors
    if (this.isDevelopment) {
      return;
    }

    try {
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      });

      if (!response.ok) {
        throw new Error(`Analytics endpoint failed: ${response.status}`);
      }
    } catch (error) {
      // Silently handle all analytics errors to prevent breaking the app
      // Analytics should never cause user-facing errors
      if (this.isDevelopment) {
        console.debug('Analytics endpoint error (non-critical):', error);
      }
    }
  }

  // Conversion tracking methods
  trackSignup(email: string, persona?: string) {
    this.track('user_signup', {
      category: 'conversion',
      email,
      persona,
      source: this.getAttributionSource(),
      value: 1
    });
  }

  trackToolUsage(toolName: string, duration?: number, success?: boolean) {
    this.track('tool_used', {
      category: 'engagement',
      tool_name: toolName,
      duration_ms: duration,
      success,
      value: success ? 1 : 0
    });
  }

  trackAppGeneration(framework: string, features: string[], deploymentTime?: number) {
    this.track('app_generated', {
      category: 'core_action',
      framework,
      features: features.join(','),
      feature_count: features.length,
      deployment_time_ms: deploymentTime,
      value: 10 // High-value event
    });
  }

  trackContentGeneration(contentType: string, platforms: string[], wordCount?: number) {
    this.track('content_generated', {
      category: 'core_action',
      content_type: contentType,
      platforms: platforms.join(','),
      platform_count: platforms.length,
      word_count: wordCount,
      value: 5
    });
  }

  trackWorkflowCompletion(workflowId: string, duration: number, success: boolean) {
    this.track('workflow_completed', {
      category: 'conversion',
      workflow_id: workflowId,
      duration_ms: duration,
      success,
      value: success ? 20 : 0
    });
  }

  trackPageView(page: string, properties: Record<string, any> = {}) {
    this.track('page_view', {
      category: 'navigation',
      page,
      ...properties
    });
  }

  trackFeatureDiscovery(feature: string, source: string) {
    this.track('feature_discovered', {
      category: 'engagement',
      feature,
      source,
      value: 2
    });
  }

  trackError(error: string, message: string, context?: Record<string, any>) {
    this.track('error_occurred', {
      category: 'error',
      error_type: error,
      error_message: message,
      ...context,
      value: -1 // Negative value for errors
    });
  }

  // User property tracking
  setUserProperties(properties: UserProperties) {
    // Update Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        custom_map: properties
      });
    }

    // Update Mixpanel
    if (typeof window !== 'undefined' && (window as any).mixpanel) {
      (window as any).mixpanel.people.set(properties);
    }

    // Store locally
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('ff-user-properties', JSON.stringify(properties));
      }
    } catch (error) {
      // Silently handle storage errors
    }
  }

  // Conversion goal tracking
  trackConversionGoal(goal: ConversionGoal) {
    this.track('conversion_goal', {
      category: 'conversion',
      goal_name: goal.name,
      goal_category: goal.category,
      goal_value: goal.value || 1,
      ...goal.properties
    });

    // Special handling for revenue goals
    if (goal.category === 'revenue' && goal.value) {
      this.trackRevenue(goal.value, goal.properties);
    }
  }

  trackRevenue(amount: number, properties: Record<string, any> = {}) {
    this.track('revenue', {
      category: 'revenue',
      revenue_amount: amount,
      currency: 'USD',
      ...properties,
      value: amount
    });

    // Send to Google Analytics Enhanced Ecommerce
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: `transaction_${Date.now()}`,
        value: amount,
        currency: 'USD',
        items: [{
          item_id: 'flashfusion_subscription',
          item_name: 'FlashFusion Subscription',
          category: 'subscription',
          quantity: 1,
          price: amount
        }]
      });
    }
  }

  // Attribution and funnel tracking
  private getAttributionSource(): string {
    try {
      if (typeof window === 'undefined') return 'unknown';

      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source');
      const referrer = document.referrer;

      if (utmSource) return utmSource;
      if (referrer) {
        try {
          const referrerDomain = new URL(referrer).hostname;
          return referrerDomain;
        } catch {
          return 'direct';
        }
      }
      return 'direct';
    } catch (error) {
      return 'unknown';
    }
  }

  trackFunnelStep(funnel: string, step: string, properties: Record<string, any> = {}) {
    this.track('funnel_step', {
      category: 'funnel',
      funnel_name: funnel,
      step_name: step,
      step_order: properties.order || 1,
      ...properties
    });
  }

  // A/B testing support
  trackExperiment(experimentName: string, variant: string, converted: boolean = false) {
    this.track('experiment_exposure', {
      category: 'experiment',
      experiment_name: experimentName,
      variant,
      converted,
      value: converted ? 1 : 0
    });
  }

  // Session and engagement tracking
  trackSessionStart() {
    this.track('session_start', {
      category: 'session',
      session_id: this.sessionId
    });
  }

  trackSessionEnd(duration: number) {
    this.track('session_end', {
      category: 'session',
      session_id: this.sessionId,
      duration_ms: duration
    });
  }

  trackEngagement(action: string, target: string, value?: number) {
    this.track('user_engagement', {
      category: 'engagement',
      action,
      target,
      value: value || 1
    });
  }

  // Launch-specific tracking methods
  trackLaunchReadinessCheck(data: {
    score: number;
    isReady: boolean;
    blockers: number;
    warnings: number;
    checkDuration: number;
  }) {
    this.track('launch_readiness_check', {
      category: 'launch',
      readiness_score: data.score,
      is_ready: data.isReady,
      blocker_count: data.blockers,
      warning_count: data.warnings,
      check_duration_ms: data.checkDuration,
      value: data.isReady ? 10 : 0
    });
  }

  trackLaunchReadinessChange(data: {
    isReady: boolean;
    overallScore: number;
    blockers: number;
    warnings: number;
    environment: string;
  }) {
    this.track('launch_readiness_changed', {
      category: 'launch',
      is_ready: data.isReady,
      overall_score: data.overallScore,
      blocker_count: data.blockers,
      warning_count: data.warnings,
      environment: data.environment,
      value: data.isReady ? 15 : 0
    });
  }

  trackLaunchModeActivated(readinessState: any) {
    this.track('launch_mode_activated', {
      category: 'launch',
      readiness_score: readinessState.overallScore,
      environment: readinessState.environment,
      blockers_resolved: readinessState.blockers.length === 0,
      value: 25 // High-value event
    });
  }

  trackLaunchModeDeactivated() {
    this.track('launch_mode_deactivated', {
      category: 'launch',
      value: 0
    });
  }

  trackLaunchEvent(event: string, properties: Record<string, any> = {}) {
    this.track(`launch_${event}`, {
      category: 'launch',
      ...properties,
      value: 5
    });
  }

  trackLaunchChecklistComplete(itemId: string) {
    this.track('launch_checklist_item_completed', {
      category: 'launch',
      item_id: itemId,
      value: 2
    });
  }

  // Performance tracking methods
  trackPerformance(eventName: string, data: Record<string, any>) {
    this.track(`performance_${eventName}`, {
      category: 'performance',
      ...data,
      value: 0 // Performance events are informational
    });
  }

  trackRenderPerformance(componentName: string, renderTime: number) {
    this.track('component_render_time', {
      category: 'performance',
      component: componentName,
      render_time: renderTime,
      is_slow: renderTime > 16,
      value: renderTime > 16 ? -1 : 0 // Negative for slow renders
    });
  }

  trackMemoryUsage(data: { used: number; total: number; percentage: number }) {
    this.track('memory_usage', {
      category: 'performance',
      memory_used: data.used,
      memory_total: data.total,
      memory_percentage: data.percentage,
      is_high: data.percentage > 80,
      value: data.percentage > 90 ? -5 : 0 // Negative for high memory usage
    });
  }

  trackBundleSize(size: number) {
    this.track('bundle_size', {
      category: 'performance',
      bundle_size_bytes: size,
      bundle_size_mb: (size / 1024 / 1024).toFixed(2),
      value: 0
    });
  }

  trackMarketingCampaignLaunch(campaignId: string) {
    this.track('marketing_campaign_launched', {
      category: 'marketing',
      campaign_id: campaignId,
      value: 8
    });
  }

  // Utility methods
  private saveEventsToStorage() {
    try {
      if (typeof localStorage !== 'undefined') {
        const recentEvents = this.events.slice(-100); // Keep last 100 events
        localStorage.setItem('ff-analytics-events', JSON.stringify(recentEvents));
      }
    } catch (error) {
      // Silently handle storage errors
    }
  }

  getStoredEvents(): AnalyticsEvent[] {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('ff-analytics-events');
        return stored ? JSON.parse(stored) : [];
      }
      return [];
    } catch (error) {
      return [];
    }
  }

  // Batch event sending for performance
  async flushEvents() {
    if (this.events.length === 0) return;

    // Skip network requests in development
    if (this.isDevelopment) {
      // Just clear events in development, keep them in localStorage for debugging
      this.events = [];
      return;
    }

    try {
      const eventsToSend = [...this.events];
      this.events = [];

      const response = await fetch('/api/analytics/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ events: eventsToSend })
      });

      if (!response.ok) {
        // Re-add events if sending failed
        this.events.unshift(...eventsToSend);
      }
    } catch (error) {
      // Re-add events if sending failed and we cleared them
      // Silently handle all errors to prevent breaking the app
      if (this.isDevelopment) {
        console.debug('Analytics batch error (non-critical):', error);
      }
    }
  }

  // Real-time analytics dashboard data
  getSessionMetrics() {
    const events = this.getStoredEvents();
    const sessionEvents = events.filter(e => e.properties.sessionId === this.sessionId);

    return {
      sessionId: this.sessionId,
      eventCount: sessionEvents.length,
      toolsUsed: [...new Set(sessionEvents
        .filter(e => e.event === 'tool_used')
        .map(e => e.properties.tool_name))],
      pagesViewed: [...new Set(sessionEvents
        .filter(e => e.event === 'page_view')
        .map(e => e.properties.page))],
      conversionEvents: sessionEvents.filter(e => 
        e.properties.category === 'conversion'
      ).length,
      engagementScore: sessionEvents
        .filter(e => e.properties.category === 'engagement')
        .reduce((sum, e) => sum + (e.properties.value || 0), 0)
    };
  }
}

// Singleton instance
export const analyticsService = new AnalyticsService();

// Global event listeners for automatic tracking
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  try {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      try {
        if (document.hidden) {
          analyticsService.flushEvents();
        }
      } catch (error) {
        // Silently handle flush errors
      }
    });

    // Track before page unload
    window.addEventListener('beforeunload', () => {
      try {
        analyticsService.flushEvents();
      } catch (error) {
        // Silently handle flush errors
      }
    });

    // Auto-flush events periodically (only in production)
    try {
      if (!analyticsService.isDevelopment) {
        setInterval(() => {
          try {
            analyticsService.flushEvents();
          } catch (error) {
            // Silently handle flush errors
          }
        }, 30000); // Every 30 seconds
      }
    } catch (error) {
      // Silently handle timer setup errors
    }
  } catch (error) {
    // Silently handle any setup errors
  }
}

export default AnalyticsService;