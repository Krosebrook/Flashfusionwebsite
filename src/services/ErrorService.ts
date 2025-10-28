import { toast } from 'sonner@2.0.3';

export interface AppError {
  type: 'initialization' | 'authentication' | 'network' | 'component' | 'permission' | 'api' | 'validation';
  message: string;
  details?: string;
  recoverable?: boolean;
  code?: string;
  timestamp?: string;
  context?: Record<string, any>;
}

export type ErrorSeverity = 'critical' | 'error' | 'warning' | 'info';

export class ErrorService {
  private static instance: ErrorService;
  private errorListeners: Array<(error: AppError) => void> = [];
  private errorHistory: AppError[] = [];
  private maxHistorySize = 50;

  private constructor() {}

  static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  /**
   * Create a standardized error object
   */
  createError(
    type: AppError['type'],
    message: string,
    options: Partial<Pick<AppError, 'details' | 'recoverable' | 'code' | 'context'>> = {}
  ): AppError {
    return {
      type,
      message,
      details: options.details,
      recoverable: options.recoverable ?? true,
      code: options.code ?? `${type.toUpperCase()}_ERROR`,
      timestamp: new Date().toISOString(),
      context: options.context
    };
  }

  /**
   * Handle and process errors with appropriate UI feedback
   */
  handleError(error: AppError | Error | string, context?: Record<string, any>): AppError {
    let processedError: AppError;

    if (typeof error === 'string') {
      processedError = this.createError('component', error, { context });
    } else if (error instanceof Error) {
      processedError = this.createError('component', error.message, {
        details: error.stack,
        context: { ...context, originalError: error.name }
      });
    } else {
      processedError = { ...error, context: { ...error.context, ...context } };
    }

    // Add to history
    this.addToHistory(processedError);

    // Log error for debugging
    this.logError(processedError);

    // Show appropriate user feedback
    this.showUserFeedback(processedError);

    // Notify listeners
    this.notifyListeners(processedError);

    return processedError;
  }

  /**
   * Get error severity level
   */
  getErrorSeverity(error: AppError): ErrorSeverity {
    switch (error.type) {
      case 'initialization':
        return 'critical';
      case 'network':
        return 'warning';
      case 'authentication':
      case 'permission':
        return 'info';
      case 'api':
      case 'component':
      case 'validation':
        return 'error';
      default:
        return 'error';
    }
  }

  /**
   * Show user-friendly error feedback
   */
  private showUserFeedback(error: AppError): void {
    const severity = this.getErrorSeverity(error);
    
    // Don't show toasts for critical errors (they should be handled by components)
    if (severity === 'critical') {
      return;
    }

    const toastOptions = {
      description: error.details,
      duration: this.getToastDuration(severity),
      action: error.recoverable ? {
        label: 'Retry',
        onClick: () => this.triggerRetry(error)
      } : undefined
    };

    switch (severity) {
      case 'error':
        toast.error(error.message, toastOptions);
        break;
      case 'warning':
        toast.warning(error.message, toastOptions);
        break;
      case 'info':
        toast.info(error.message, toastOptions);
        break;
    }
  }

  /**
   * Get appropriate toast duration based on severity
   */
  private getToastDuration(severity: ErrorSeverity): number {
    switch (severity) {
      case 'critical':
        return Infinity;
      case 'error':
        return 8000;
      case 'warning':
        return 6000;
      case 'info':
        return 4000;
      default:
        return 5000;
    }
  }

  /**
   * Trigger retry for recoverable errors
   */
  private triggerRetry(error: AppError): void {
    // Emit retry event that components can listen to
    window.dispatchEvent(new CustomEvent('ff-error-retry', {
      detail: { error }
    }));
  }

  /**
   * Log error with appropriate level
   */
  private logError(error: AppError): void {
    const severity = this.getErrorSeverity(error);
    const logData = {
      ...error,
      severity,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    switch (severity) {
      case 'critical':
        console.error('[CRITICAL]', error.message, logData);
        break;
      case 'error':
        console.error('[ERROR]', error.message, logData);
        break;
      case 'warning':
        console.warn('[WARNING]', error.message, logData);
        break;
      case 'info':
        console.info('[INFO]', error.message, logData);
        break;
    }

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(logData);
    }
  }

  /**
   * Send error to monitoring service
   */
  private async sendToMonitoring(errorData: any): Promise<void> {
    try {
      // Only send critical and error level issues to monitoring
      if (!['critical', 'error'].includes(errorData.severity)) {
        return;
      }

      // In a real app, this would send to your monitoring service
      // For now, we'll just store it locally for development
      const monitoringData = {
        ...errorData,
        sessionId: this.getSessionId(),
        userId: this.getUserId()
      };

      localStorage.setItem(
        `ff-error-${Date.now()}`,
        JSON.stringify(monitoringData)
      );

      // Clean up old error reports (keep last 10)
      this.cleanupLocalErrorReports();
    } catch (monitoringError) {
      console.warn('Failed to send error to monitoring:', monitoringError);
    }
  }

  /**
   * Get session ID for error tracking
   */
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('ff-session-id');
    if (!sessionId) {
      sessionId = `sess-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('ff-session-id', sessionId);
    }
    return sessionId;
  }

  /**
   * Get user ID for error tracking
   */
  private getUserId(): string | null {
    // In a real app, this would get the actual user ID
    const authToken = localStorage.getItem('ff-auth-token');
    return authToken ? `user-${authToken.slice(-8)}` : null;
  }

  /**
   * Clean up old local error reports
   */
  private cleanupLocalErrorReports(): void {
    try {
      const errorKeys = Object.keys(localStorage)
        .filter(key => key.startsWith('ff-error-'))
        .sort()
        .reverse();

      // Keep only the last 10 error reports
      if (errorKeys.length > 10) {
        const keysToRemove = errorKeys.slice(10);
        keysToRemove.forEach(key => localStorage.removeItem(key));
      }
    } catch (error) {
      console.warn('Failed to cleanup error reports:', error);
    }
  }

  /**
   * Add error to history
   */
  private addToHistory(error: AppError): void {
    this.errorHistory.unshift(error);
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory = this.errorHistory.slice(0, this.maxHistorySize);
    }
  }

  /**
   * Notify error listeners
   */
  private notifyListeners(error: AppError): void {
    this.errorListeners.forEach(listener => {
      try {
        listener(error);
      } catch (listenerError) {
        console.warn('Error listener failed:', listenerError);
      }
    });
  }

  /**
   * Subscribe to error events
   */
  subscribe(listener: (error: AppError) => void): () => void {
    this.errorListeners.push(listener);
    
    return () => {
      const index = this.errorListeners.indexOf(listener);
      if (index > -1) {
        this.errorListeners.splice(index, 1);
      }
    };
  }

  /**
   * Get error history
   */
  getErrorHistory(): AppError[] {
    return [...this.errorHistory];
  }

  /**
   * Clear error history
   */
  clearErrorHistory(): void {
    this.errorHistory = [];
  }

  /**
   * Check if error should be retried automatically
   */
  shouldAutoRetry(error: AppError): boolean {
    // Auto retry network errors and temporary API errors
    if (error.type === 'network' && error.recoverable) {
      return true;
    }
    
    if (error.type === 'api' && error.code?.includes('TIMEOUT')) {
      return true;
    }
    
    return false;
  }

  /**
   * Create network error
   */
  createNetworkError(message: string, details?: string): AppError {
    return this.createError('network', message, {
      details,
      recoverable: true,
      code: 'NETWORK_ERROR'
    });
  }

  /**
   * Create API error
   */
  createApiError(message: string, statusCode?: number, details?: string): AppError {
    return this.createError('api', message, {
      details,
      recoverable: statusCode ? statusCode >= 500 : true,
      code: `API_ERROR_${statusCode || 'UNKNOWN'}`,
      context: { statusCode }
    });
  }

  /**
   * Create validation error
   */
  createValidationError(message: string, fieldErrors?: Record<string, string[]>): AppError {
    return this.createError('validation', message, {
      details: fieldErrors ? Object.entries(fieldErrors)
        .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
        .join('\n') : undefined,
      recoverable: true,
      code: 'VALIDATION_ERROR',
      context: { fieldErrors }
    });
  }
}

// Export singleton instance
export const errorService = ErrorService.getInstance();

// Export hook for React components
export function useErrorService() {
  return errorService;
}