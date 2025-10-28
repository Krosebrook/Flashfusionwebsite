import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableRecovery?: boolean;
  enableReporting?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  retryCount: number;
  isRecovering: boolean;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  private retryTimeouts: NodeJS.Timeout[] = [];

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
      isRecovering: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Generate unique error ID for tracking
    const errorId = `ff_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Store error info
    this.setState({ errorInfo });

    // Call onError prop if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report error if enabled
    if (this.props.enableReporting !== false) {
      this.reportError(error, errorInfo);
    }

    // Log error for debugging
    console.error('FlashFusion Error Boundary caught an error:', error, errorInfo);
  }

  componentWillUnmount() {
    // Clear any pending retry timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  private reportError = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      const errorReport = {
        id: this.state.errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: this.getUserId(),
        sessionId: this.getSessionId(),
        appVersion: this.getAppVersion(),
        additionalContext: this.gatherAdditionalContext()
      };

      // Send to error reporting service (replace with your service)
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport)
      });

      console.log('Error reported successfully:', errorReport.id);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private getUserId = (): string | null => {
    try {
      return localStorage.getItem('ff-user-id') || 'anonymous';
    } catch {
      return 'anonymous';
    }
  };

  private getSessionId = (): string | null => {
    try {
      return sessionStorage.getItem('ff-session-id') || 'unknown';
    } catch {
      return 'unknown';
    }
  };

  private getAppVersion = (): string => {
    return process.env.REACT_APP_VERSION || '1.0.0';
  };

  private gatherAdditionalContext = () => {
    try {
      return {
        memoryUsage: (performance as any).memory ? {
          used: (performance as any).memory.usedJSHeapSize,
          total: (performance as any).memory.totalJSHeapSize,
          limit: (performance as any).memory.jsHeapSizeLimit
        } : null,
        connectionType: (navigator as any).connection?.effectiveType || 'unknown',
        deviceMemory: (navigator as any).deviceMemory || 'unknown',
        hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        localStorage: this.checkLocalStorageAvailability(),
        sessionStorage: this.checkSessionStorageAvailability()
      };
    } catch {
      return {};
    }
  };

  private checkLocalStorageAvailability = (): boolean => {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  };

  private checkSessionStorageAvailability = (): boolean => {
    try {
      const test = '__sessionStorage_test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  };

  private handleRetry = async () => {
    if (this.state.retryCount >= 3) {
      console.warn('Maximum retry attempts reached');
      return;
    }

    this.setState({ isRecovering: true });

    try {
      // Perform cleanup before retry
      await this.performRecoveryCleanup();

      // Wait a bit before retrying
      const retryDelay = Math.min(1000 * Math.pow(2, this.state.retryCount), 5000);
      
      const timeout = setTimeout(() => {
        this.setState({
          hasError: false,
          error: null,
          errorInfo: null,
          errorId: null,
          retryCount: this.state.retryCount + 1,
          isRecovering: false
        });
      }, retryDelay);

      this.retryTimeouts.push(timeout);

    } catch (recoveryError) {
      console.error('Recovery cleanup failed:', recoveryError);
      this.setState({ isRecovering: false });
    }
  };

  private performRecoveryCleanup = async (): Promise<void> => {
    try {
      // Clear any cached data that might be corrupted
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        const criticalCaches = ['flashfusion-v1.0.0']; // Keep critical caches
        
        for (const cacheName of cacheNames) {
          if (!criticalCaches.includes(cacheName)) {
            await caches.delete(cacheName);
          }
        }
      }

      // Clear non-essential localStorage items
      if (typeof localStorage !== 'undefined') {
        const essentialKeys = ['ff-user-id', 'ff-theme', 'ff-language'];
        const keys = Object.keys(localStorage);
        
        keys.forEach(key => {
          if (!essentialKeys.some(essential => key.includes(essential))) {
            try {
              localStorage.removeItem(key);
            } catch {
              // Ignore individual removal errors
            }
          }
        });
      }

      // Force garbage collection if available
      if ('gc' in window && typeof (window as any).gc === 'function') {
        (window as any).gc();
      }

      console.log('Recovery cleanup completed');
    } catch (error) {
      console.error('Recovery cleanup failed:', error);
      throw error;
    }
  };

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportIssue = () => {
    const errorDetails = {
      id: this.state.errorId,
      message: this.state.error?.message || 'Unknown error',
      timestamp: new Date().toISOString()
    };

    const mailto = `mailto:support@flashfusion.ai?subject=Error%20Report%20${errorDetails.id}&body=Error%20Details:%0A%0AID:%20${errorDetails.id}%0AMessage:%20${encodeURIComponent(errorDetails.message)}%0ATimestamp:%20${errorDetails.timestamp}%0A%0APlease%20describe%20what%20you%20were%20doing%20when%20this%20error%20occurred:%0A%0A`;
    
    window.open(mailto);
  };

  private renderErrorDetails = () => {
    if (!this.state.error) return null;

    const isDevelopment = process.env.NODE_ENV === 'development';

    return (
      <details className="mt-6 p-4 bg-muted/50 rounded-lg">
        <summary className="cursor-pointer text-sm font-medium mb-2">
          Technical Details
        </summary>
        <div className="space-y-2 text-xs font-mono">
          <div>
            <strong>Error ID:</strong> {this.state.errorId}
          </div>
          <div>
            <strong>Message:</strong> {this.state.error.message}
          </div>
          {isDevelopment && this.state.error.stack && (
            <div>
              <strong>Stack Trace:</strong>
              <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
                {this.state.error.stack}
              </pre>
            </div>
          )}
          {isDevelopment && this.state.errorInfo?.componentStack && (
            <div>
              <strong>Component Stack:</strong>
              <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
                {this.state.errorInfo.componentStack}
              </pre>
            </div>
          )}
        </div>
      </details>
    );
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl border-destructive/20">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <CardTitle className="text-2xl text-destructive">Something went wrong</CardTitle>
              <p className="text-muted-foreground mt-2">
                We encountered an unexpected error in FlashFusion. Our team has been notified and is working on a fix.
              </p>
              {this.state.errorId && (
                <Badge variant="secondary" className="mt-2">
                  Error ID: {this.state.errorId}
                </Badge>
              )}
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Recovery Actions */}
              <div className="grid gap-3 sm:grid-cols-2">
                {this.props.enableRecovery !== false && this.state.retryCount < 3 && (
                  <Button 
                    onClick={this.handleRetry}
                    disabled={this.state.isRecovering}
                    className="w-full"
                    variant="default"
                  >
                    {this.state.isRecovering ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Recovering...</span>
                      </div>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Try Again ({3 - this.state.retryCount} attempts left)
                      </>
                    )}
                  </Button>
                )}
                
                <Button 
                  onClick={this.handleRefresh}
                  variant="outline"
                  className="w-full"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Page
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button 
                  onClick={this.handleGoHome}
                  variant="secondary"
                  className="w-full"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Go to Home
                </Button>
                
                <Button 
                  onClick={this.handleReportIssue}
                  variant="outline"
                  className="w-full"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Report Issue
                </Button>
              </div>

              {/* Recovery Suggestions */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Troubleshooting Tips:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Try refreshing the page</li>
                  <li>• Check your internet connection</li>
                  <li>• Clear your browser cache</li>
                  <li>• Disable browser extensions temporarily</li>
                  <li>• Try using an incognito/private window</li>
                </ul>
              </div>

              {/* Error Details */}
              {this.renderErrorDetails()}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC wrapper for easier usage
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <EnhancedErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </EnhancedErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

export default EnhancedErrorBoundary;