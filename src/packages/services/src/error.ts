interface FlashFusionError {
  type: string;
  message: string;
  details?: string;
  recoverable: boolean;
  code?: string;
  timestamp?: string;
  stack?: string;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
}

interface ErrorTrackingConfig {
  enabled: boolean;
  dsn?: string; // For Sentry-like services
  environment: string;
  release?: string;
  sampleRate?: number;
  beforeSend?: (error: FlashFusionError) => FlashFusionError | null;
}

// Error severity levels
type ErrorSeverity = 'fatal' | 'error' | 'warning' | 'info' | 'debug';

// Error tracking service singleton
class ErrorTrackingService {
  private static instance: ErrorTrackingService;
  private config: ErrorTrackingConfig;
  private errorQueue: FlashFusionError[] = [];
  private isInitialized = false;
  private sessionId: string;
  private userId?: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.config = {
      enabled: import.meta.env.PROD,
      environment: import.meta.env.MODE || 'development',
      release: import.meta.env.VITE_APP_VERSION || '1.0.0',
      sampleRate: 1.0,
    };
  }

  static getInstance(): ErrorTrackingService {
    if (!ErrorTrackingService.instance) {
      ErrorTrackingService.instance = new ErrorTrackingService();
    }
    return ErrorTrackingService.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  initialize(config: Partial<ErrorTrackingConfig> = {}) {
    this.config = { ...this.config, ...config };
    this.isInitialized = true;

    // Set up global error handlers
    if (typeof window !== 'undefined') {
      window.onerror = (message, source, lineno, colno, error) => {
        this.captureError({
          type: 'UNCAUGHT_ERROR',
          message: String(message),
          details: `${source}:${lineno}:${colno}`,
          stack: error?.stack,
          recoverable: false,
        });
        return false; // Don't prevent default error handling
      };

      window.onunhandledrejection = (event) => {
        this.captureError({
          type: 'UNHANDLED_PROMISE_REJECTION',
          message: event.reason?.message || String(event.reason),
          stack: event.reason?.stack,
          recoverable: false,
        });
      };
    }

    // Flush any queued errors
    this.flushErrorQueue();

    console.log('🛡️ Error tracking initialized', {
      environment: this.config.environment,
      sessionId: this.sessionId,
    });
  }

  setUser(userId: string, userData?: Record<string, any>) {
    this.userId = userId;
    if (import.meta.env.DEV) {
      console.log('👤 Error tracking user set:', userId);
    }
  }

  clearUser() {
    this.userId = undefined;
  }

  captureError(
    error: Partial<FlashFusionError> & { type: string; message: string },
    severity: ErrorSeverity = 'error'
  ) {
    const fullError: FlashFusionError = {
      type: error.type,
      message: error.message,
      details: error.details,
      recoverable: error.recoverable ?? true,
      code: error.code,
      timestamp: new Date().toISOString(),
      stack: error.stack,
      context: error.context,
      userId: this.userId,
      sessionId: this.sessionId,
    };

    // Apply beforeSend hook if configured
    if (this.config.beforeSend) {
      const processedError = this.config.beforeSend(fullError);
      if (!processedError) return; // Skip if null returned
    }

    // Always log to console in development
    if (import.meta.env.DEV || !this.config.enabled) {
      this.logErrorToConsole(fullError, severity);
    }

    // In production, send to tracking service
    if (this.config.enabled && this.isInitialized) {
      this.sendToTrackingService(fullError, severity);
    } else if (this.config.enabled) {
      // Queue errors until initialized
      this.errorQueue.push(fullError);
    }
  }

  captureException(exception: Error, context?: Record<string, any>) {
    this.captureError({
      type: exception.name || 'Error',
      message: exception.message,
      stack: exception.stack,
      context,
      recoverable: false,
    });
  }

  captureMessage(message: string, severity: ErrorSeverity = 'info', context?: Record<string, any>) {
    this.captureError({
      type: 'MESSAGE',
      message,
      context,
      recoverable: true,
    }, severity);
  }

  private logErrorToConsole(error: FlashFusionError, severity: ErrorSeverity) {
    const severityColors: Record<ErrorSeverity, string> = {
      fatal: 'color: #ff0000; font-weight: bold',
      error: 'color: #ff4444',
      warning: 'color: #ffaa00',
      info: 'color: #0088ff',
      debug: 'color: #888888',
    };

    const severityEmoji: Record<ErrorSeverity, string> = {
      fatal: '💀',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      debug: '🔍',
    };

    console.groupCollapsed(
      `%c${severityEmoji[severity]} FlashFusion ${severity.toUpperCase()}: ${error.type}`,
      severityColors[severity]
    );
    console.log('Message:', error.message);
    if (error.details) console.log('Details:', error.details);
    if (error.code) console.log('Code:', error.code);
    if (error.context) console.log('Context:', error.context);
    if (error.stack) console.log('Stack:', error.stack);
    console.log('Timestamp:', error.timestamp);
    console.log('Session ID:', error.sessionId);
    if (error.userId) console.log('User ID:', error.userId);
    console.groupEnd();
  }

  private async sendToTrackingService(error: FlashFusionError, severity: ErrorSeverity) {
    // Check sample rate
    if (Math.random() > (this.config.sampleRate || 1.0)) {
      return;
    }

    try {
      // If DSN is configured (Sentry-style), send to that endpoint
      if (this.config.dsn) {
        await fetch(this.config.dsn, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error,
            severity,
            environment: this.config.environment,
            release: this.config.release,
          }),
        });
        return;
      }

      // Fallback: Send to Supabase edge function or custom endpoint
      const trackingEndpoint = import.meta.env.VITE_ERROR_TRACKING_ENDPOINT;
      if (trackingEndpoint) {
        await fetch(trackingEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error,
            severity,
            environment: this.config.environment,
            release: this.config.release,
          }),
        });
      }

      // Also store in localStorage for later analysis
      this.storeErrorLocally(error);

    } catch (sendError) {
      // Don't throw - we don't want error tracking to break the app
      console.warn('Failed to send error to tracking service:', sendError);
    }
  }

  private storeErrorLocally(error: FlashFusionError) {
    try {
      const stored = localStorage.getItem('ff_error_log') || '[]';
      const errors = JSON.parse(stored);
      errors.push(error);
      // Keep only last 50 errors
      const trimmed = errors.slice(-50);
      localStorage.setItem('ff_error_log', JSON.stringify(trimmed));
    } catch {
      // Ignore storage errors
    }
  }

  private flushErrorQueue() {
    while (this.errorQueue.length > 0) {
      const error = this.errorQueue.shift();
      if (error) {
        this.sendToTrackingService(error, 'error');
      }
    }
  }

  getStoredErrors(): FlashFusionError[] {
    try {
      const stored = localStorage.getItem('ff_error_log');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  clearStoredErrors() {
    localStorage.removeItem('ff_error_log');
  }
}

// Export singleton instance
export const errorTracking = ErrorTrackingService.getInstance();

// React hook for error handling
export function useErrorService() {
  const handleError = (error: FlashFusionError) => {
    errorTracking.captureError(error);
  };

  const handleException = (exception: Error, context?: Record<string, any>) => {
    errorTracking.captureException(exception, context);
  };

  const createError = (
    type: string,
    message: string,
    options: Partial<FlashFusionError> = {}
  ): FlashFusionError => {
    const error: FlashFusionError = {
      type,
      message,
      recoverable: true,
      timestamp: new Date().toISOString(),
      ...options,
    };

    // Automatically capture the error
    errorTracking.captureError(error);

    return error;
  };

  const logMessage = (message: string, severity: ErrorSeverity = 'info', context?: Record<string, any>) => {
    errorTracking.captureMessage(message, severity, context);
  };

  return {
    handleError,
    handleException,
    createError,
    logMessage,
    setUser: (userId: string, userData?: Record<string, any>) => errorTracking.setUser(userId, userData),
    clearUser: () => errorTracking.clearUser(),
    getStoredErrors: () => errorTracking.getStoredErrors(),
    clearStoredErrors: () => errorTracking.clearStoredErrors(),
  };
}

// Initialize error tracking (call this in App.tsx or main.tsx)
export function initializeErrorTracking(config?: Partial<ErrorTrackingConfig>) {
  errorTracking.initialize(config);
}