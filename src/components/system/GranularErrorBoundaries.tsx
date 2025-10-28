/**
 * @fileoverview Granular Error Boundary System with Enhanced Error Handling
 * @category Fix Mode - Error Boundary Improvements
 * @version 1.0.0
 * 
 * Advanced error boundary system with context-aware error handling,
 * automatic recovery, performance impact tracking, and user-friendly fallbacks.
 */

import React, { Component, ErrorInfo, ReactNode, useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AlertTriangle, RefreshCw, Bug, Zap, Clock, TrendingDown } from 'lucide-react';

// Error Types
export enum ErrorSeverity {
  LOW = 'low',           // Minor UI glitches
  MEDIUM = 'medium',     // Component failures
  HIGH = 'high',         // Page-level failures
  CRITICAL = 'critical'  // App-breaking errors
}

export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  NAVIGATION = 'navigation',
  DATA_LOADING = 'data_loading',
  RENDERING = 'rendering',
  NETWORK = 'network',
  MEMORY = 'memory',
  PERMISSIONS = 'permissions',
  UNKNOWN = 'unknown'
}

// Error Context
interface ErrorContext {
  componentName?: string;
  userAgent: string;
  url: string;
  timestamp: number;
  userId?: string;
  sessionId: string;
  buildVersion?: string;
  performanceMetrics?: {
    memoryUsage?: number;
    loadTime?: number;
    renderTime?: number;
  };
}

// Enhanced Error Info
interface EnhancedError {
  error: Error;
  errorInfo: ErrorInfo;
  context: ErrorContext;
  severity: ErrorSeverity;
  category: ErrorCategory;
  recoverable: boolean;
  retryCount: number;
  firstOccurrence: number;
  lastOccurrence: number;
  userImpact: string;
}

// Error Boundary Configuration
interface ErrorBoundaryConfig {
  name: string;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: EnhancedError) => void;
  enableRecovery?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  reportToAnalytics?: boolean;
  showDebugInfo?: boolean;
  isolateError?: boolean;
}

// Error Fallback Props
interface ErrorFallbackProps {
  error: EnhancedError;
  resetError: () => void;
  canRetry: boolean;
  config: ErrorBoundaryConfig;
}

/**
 * Error Analytics and Tracking
 */
class ErrorAnalytics {
  private static instance: ErrorAnalytics;
  private errors: EnhancedError[] = [];
  private errorCounts = new Map<string, number>();
  private recoverySuccess = new Map<string, number>();

  static getInstance(): ErrorAnalytics {
    if (!ErrorAnalytics.instance) {
      ErrorAnalytics.instance = new ErrorAnalytics();
    }
    return ErrorAnalytics.instance;
  }

  recordError(error: EnhancedError) {
    this.errors.push(error);
    
    // Keep only last 100 errors
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(-100);
    }

    // Update error counts
    const errorKey = `${error.category}_${error.error.name}`;
    this.errorCounts.set(errorKey, (this.errorCounts.get(errorKey) || 0) + 1);

    console.error('🚨 Error recorded:', {
      category: error.category,
      severity: error.severity,
      message: error.error.message,
      component: error.context.componentName,
      retryCount: error.retryCount
    });
  }

  recordRecovery(errorKey: string, successful: boolean) {
    if (successful) {
      this.recoverySuccess.set(errorKey, (this.recoverySuccess.get(errorKey) || 0) + 1);
      console.log('✅ Error recovery successful:', errorKey);
    }
  }

  getErrorStats() {
    const totalErrors = this.errors.length;
    const criticalErrors = this.errors.filter(e => e.severity === ErrorSeverity.CRITICAL).length;
    const recentErrors = this.errors.filter(e => Date.now() - e.lastOccurrence < 3600000).length; // Last hour
    
    const errorsByCategory = Array.from(this.errorCounts.entries())
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalErrors,
      criticalErrors,
      recentErrors,
      errorsByCategory,
      recoveryRate: this.calculateRecoveryRate(),
    };
  }

  private calculateRecoveryRate(): number {
    const totalRecoveryAttempts = Array.from(this.recoverySuccess.values()).reduce((sum, count) => sum + count, 0);
    const totalErrors = this.errorCounts.size;
    return totalErrors > 0 ? (totalRecoveryAttempts / totalErrors) * 100 : 0;
  }
}

/**
 * Error Categorization and Analysis
 */
class ErrorClassifier {
  static categorizeError(error: Error, errorInfo: ErrorInfo): { category: ErrorCategory; severity: ErrorSeverity; recoverable: boolean } {
    const errorMessage = error.message.toLowerCase();
    const stack = error.stack?.toLowerCase() || '';

    // Authentication errors
    if (errorMessage.includes('auth') || errorMessage.includes('token') || errorMessage.includes('unauthorized')) {
      return { category: ErrorCategory.AUTHENTICATION, severity: ErrorSeverity.HIGH, recoverable: true };
    }

    // Navigation errors
    if (errorMessage.includes('navigation') || errorMessage.includes('route') || stack.includes('router')) {
      return { category: ErrorCategory.NAVIGATION, severity: ErrorSeverity.MEDIUM, recoverable: true };
    }

    // Network errors
    if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('timeout')) {
      return { category: ErrorCategory.NETWORK, severity: ErrorSeverity.MEDIUM, recoverable: true };
    }

    // Memory errors
    if (errorMessage.includes('memory') || errorMessage.includes('heap') || error.name === 'OutOfMemoryError') {
      return { category: ErrorCategory.MEMORY, severity: ErrorSeverity.CRITICAL, recoverable: false };
    }

    // Rendering errors
    if (stack.includes('react') || stack.includes('render') || errorMessage.includes('component')) {
      return { category: ErrorCategory.RENDERING, severity: ErrorSeverity.MEDIUM, recoverable: true };
    }

    // Permission errors
    if (errorMessage.includes('permission') || errorMessage.includes('access denied')) {
      return { category: ErrorCategory.PERMISSIONS, severity: ErrorSeverity.HIGH, recoverable: false };
    }

    // Default to unknown
    return { category: ErrorCategory.UNKNOWN, severity: ErrorSeverity.MEDIUM, recoverable: true };
  }

  static getUserImpactDescription(category: ErrorCategory, severity: ErrorSeverity): string {
    const impacts = {
      [ErrorCategory.AUTHENTICATION]: {
        [ErrorSeverity.LOW]: 'Minor login display issue',
        [ErrorSeverity.MEDIUM]: 'Authentication feature unavailable',
        [ErrorSeverity.HIGH]: 'Cannot access authenticated features',
        [ErrorSeverity.CRITICAL]: 'Complete authentication failure'
      },
      [ErrorCategory.NAVIGATION]: {
        [ErrorSeverity.LOW]: 'Minor navigation glitch',
        [ErrorSeverity.MEDIUM]: 'Some navigation features unavailable',
        [ErrorSeverity.HIGH]: 'Major navigation problems',
        [ErrorSeverity.CRITICAL]: 'Cannot navigate the application'
      },
      [ErrorCategory.NETWORK]: {
        [ErrorSeverity.LOW]: 'Minor connectivity issue',
        [ErrorSeverity.MEDIUM]: 'Some features may be slow',
        [ErrorSeverity.HIGH]: 'Limited functionality due to network issues',
        [ErrorSeverity.CRITICAL]: 'Application offline'
      },
      [ErrorCategory.RENDERING]: {
        [ErrorSeverity.LOW]: 'Minor display issue',
        [ErrorSeverity.MEDIUM]: 'Component not displaying correctly',
        [ErrorSeverity.HIGH]: 'Page partially broken',
        [ErrorSeverity.CRITICAL]: 'Application display completely broken'
      },
      [ErrorCategory.MEMORY]: {
        [ErrorSeverity.LOW]: 'Minor performance impact',
        [ErrorSeverity.MEDIUM]: 'Noticeable slowdown',
        [ErrorSeverity.HIGH]: 'Significant performance issues',
        [ErrorSeverity.CRITICAL]: 'Application may crash due to memory issues'
      }
    };

    return impacts[category]?.[severity] || 'Unknown impact';
  }
}

/**
 * Enhanced Error Boundary Component
 */
interface GranularErrorBoundaryState {
  hasError: boolean;
  error: EnhancedError | null;
  retryCount: number;
  isRecovering: boolean;
  lastErrorTime: number;
}

export class GranularErrorBoundary extends Component<
  { children: ReactNode; config: ErrorBoundaryConfig },
  GranularErrorBoundaryState
> {
  private analytics = ErrorAnalytics.getInstance();
  private retryTimeout?: NodeJS.Timeout;

  constructor(props: { children: ReactNode; config: ErrorBoundaryConfig }) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0,
      isRecovering: false,
      lastErrorTime: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<GranularErrorBoundaryState> {
    return {
      hasError: true,
      lastErrorTime: Date.now(),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const classification = ErrorClassifier.categorizeError(error, errorInfo);
    
    const context: ErrorContext = {
      componentName: this.props.config.name,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      buildVersion: process.env.REACT_APP_VERSION,
      performanceMetrics: this.getPerformanceMetrics(),
    };

    const enhancedError: EnhancedError = {
      error,
      errorInfo,
      context,
      ...classification,
      retryCount: this.state.retryCount,
      firstOccurrence: Date.now(),
      lastOccurrence: Date.now(),
      userImpact: ErrorClassifier.getUserImpactDescription(classification.category, classification.severity),
    };

    this.setState({ error: enhancedError });

    // Record in analytics
    this.analytics.recordError(enhancedError);

    // Call custom error handler
    this.props.config.onError?.(enhancedError);

    // Report to external analytics if enabled
    if (this.props.config.reportToAnalytics) {
      this.reportToAnalytics(enhancedError);
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('ff-session-id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('ff-session-id', sessionId);
    }
    return sessionId;
  }

  private getPerformanceMetrics() {
    try {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        return {
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024, // MB
          loadTime: performance.now(),
        };
      }
    } catch (error) {
      console.warn('Could not get performance metrics:', error);
    }
    return undefined;
  }

  private async reportToAnalytics(error: EnhancedError) {
    try {
      // This would integrate with your analytics service
      console.log('📊 Reporting error to analytics:', error);
      // await analyticsService.reportError(error);
    } catch (reportError) {
      console.error('Failed to report error to analytics:', reportError);
    }
  }

  private handleRetry = () => {
    const { config } = this.props;
    const { error, retryCount } = this.state;

    if (!error || !error.recoverable || retryCount >= (config.maxRetries || 3)) {
      return;
    }

    this.setState({ isRecovering: true });

    const delay = config.retryDelay || 1000 * Math.pow(2, retryCount); // Exponential backoff

    this.retryTimeout = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        retryCount: retryCount + 1,
        isRecovering: false,
      });

      // Record recovery attempt
      const errorKey = `${error.category}_${error.error.name}`;
      this.analytics.recordRecovery(errorKey, true);
    }, delay);
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      retryCount: 0,
      isRecovering: false,
      lastErrorTime: 0,
    });
  };

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  render() {
    const { hasError, error, retryCount, isRecovering } = this.state;
    const { children, config } = this.props;

    if (hasError && error) {
      const FallbackComponent = config.fallback || DefaultErrorFallback;
      const canRetry = error.recoverable && retryCount < (config.maxRetries || 3);

      return (
        <FallbackComponent
          error={error}
          resetError={this.handleReset}
          canRetry={canRetry && !isRecovering}
          config={config}
        />
      );
    }

    return children;
  }
}

/**
 * Default Error Fallback Component
 */
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetError, 
  canRetry, 
  config 
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getSeverityColor = (severity: ErrorSeverity) => {
    switch (severity) {
      case ErrorSeverity.LOW: return 'text-yellow-400 border-yellow-400';
      case ErrorSeverity.MEDIUM: return 'text-orange-400 border-orange-400';
      case ErrorSeverity.HIGH: return 'text-red-400 border-red-400';
      case ErrorSeverity.CRITICAL: return 'text-red-600 border-red-600';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getSeverityIcon = (severity: ErrorSeverity) => {
    switch (severity) {
      case ErrorSeverity.LOW: return <Clock className="h-5 w-5" />;
      case ErrorSeverity.MEDIUM: return <TrendingDown className="h-5 w-5" />;
      case ErrorSeverity.HIGH: return <AlertTriangle className="h-5 w-5" />;
      case ErrorSeverity.CRITICAL: return <Zap className="h-5 w-5" />;
      default: return <Bug className="h-5 w-5" />;
    }
  };

  return (
    <Card className={`border-2 ${getSeverityColor(error.severity)} bg-red-950/20`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getSeverityIcon(error.severity)}
          <span>Something went wrong in {config.name}</span>
          <span className={`text-sm px-2 py-1 rounded ${getSeverityColor(error.severity)} border`}>
            {error.severity.toUpperCase()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-300">{error.userImpact}</p>
          <p className="text-xs text-gray-500 mt-1">
            Category: {error.category} | Retry: {error.retryCount}
          </p>
        </div>

        <div className="flex gap-2">
          {canRetry && (
            <Button
              onClick={resetError}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
          
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
          >
            Reload Page
          </Button>

          {config.showDebugInfo && (
            <Button
              onClick={() => setShowDetails(!showDetails)}
              variant="ghost"
              size="sm"
            >
              <Bug className="h-4 w-4" />
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
          )}
        </div>

        {showDetails && config.showDebugInfo && (
          <div className="mt-4 p-3 bg-gray-900 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Debug Information</h4>
            <div className="text-xs space-y-1">
              <div><strong>Error:</strong> {error.error.name}</div>
              <div><strong>Message:</strong> {error.error.message}</div>
              <div><strong>Component:</strong> {error.context.componentName}</div>
              <div><strong>Time:</strong> {new Date(error.context.timestamp).toLocaleString()}</div>
              {error.context.performanceMetrics && (
                <div><strong>Memory:</strong> {error.context.performanceMetrics.memoryUsage?.toFixed(1)}MB</div>
              )}
            </div>
            {error.error.stack && (
              <details className="mt-2">
                <summary className="text-xs cursor-pointer">Stack Trace</summary>
                <pre className="text-xs mt-1 overflow-auto max-h-32">
                  {error.error.stack}
                </pre>
              </details>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Error Boundary Hook for Functional Components
 */
export function useErrorBoundary() {
  const [error, setError] = useState<Error | null>(null);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const captureError = useCallback((error: Error) => {
    setError(error);
  }, []);

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
}

/**
 * Error Analytics Dashboard
 */
export const ErrorAnalyticsDashboard: React.FC = () => {
  const analytics = ErrorAnalytics.getInstance();
  const [stats, setStats] = useState(analytics.getErrorStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(analytics.getErrorStats());
    }, 5000);

    return () => clearInterval(interval);
  }, [analytics]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs z-50 max-w-sm">
      <h3 className="font-semibold mb-2">🚨 Error Analytics</h3>
      
      <div className="space-y-1 mb-3">
        <div>Total Errors: {stats.totalErrors}</div>
        <div className="text-red-400">Critical: {stats.criticalErrors}</div>
        <div>Recent (1h): {stats.recentErrors}</div>
        <div>Recovery Rate: {stats.recoveryRate.toFixed(1)}%</div>
      </div>

      <div>
        <div className="font-semibold mb-1">Top Error Categories:</div>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {stats.errorsByCategory.slice(0, 5).map((item, i) => (
            <div key={i} className="text-xs">
              <span className="text-orange-300">{item.key}</span>
              <span className="ml-2">({item.count})</span>
            </div>
          ))}
          {stats.errorsByCategory.length === 0 && (
            <div className="text-gray-400">No errors recorded</div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Convenient wrapper for creating error boundaries
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  config: Partial<ErrorBoundaryConfig> = {}
) {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <GranularErrorBoundary 
      config={{
        name: Component.displayName || Component.name || 'UnknownComponent',
        enableRecovery: true,
        maxRetries: 3,
        retryDelay: 1000,
        reportToAnalytics: true,
        showDebugInfo: process.env.NODE_ENV === 'development',
        ...config
      }}
    >
      <Component {...props} ref={ref} />
    </GranularErrorBoundary>
  ));

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

export type { EnhancedError, ErrorBoundaryConfig, ErrorFallbackProps, ErrorContext };