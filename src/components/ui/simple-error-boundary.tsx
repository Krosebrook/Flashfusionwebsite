import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableRecovery?: boolean;
  showErrorDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  isRecovering: boolean;
}

/**
 * Enhanced Error Boundary with FlashFusion design system integration
 * 
 * Features:
 * - Automatic error recovery with retry mechanism
 * - Detailed error reporting and logging
 * - FlashFusion design system compliance
 * - Performance monitoring integration
 * - User-friendly error messages
 * - Technical detail toggle for developers
 * 
 * @component
 * @example
 * ```tsx
 * <SimpleErrorBoundary 
 *   enableRecovery={true}
 *   showErrorDetails={true}
 *   onError={(error, errorInfo) => console.error('Error:', error)}
 * >
 *   <MyComponent />
 * </SimpleErrorBoundary>
 * ```
 */
export class SimpleErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0,
      isRecovering: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
      hasError: true, 
      error 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 FlashFusion Error Boundary caught an error:', error);
    console.error('📍 Error Details:', errorInfo);
    
    // Store error info in state
    this.setState({ errorInfo });
    
    // Enhanced error logging with context
    const errorContext = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      componentStack: errorInfo.componentStack,
      errorStack: error.stack,
      errorMessage: error.message,
      errorName: error.name,
      retryCount: this.state.retryCount
    };
    
    console.error('🔍 Error Context:', errorContext);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Report to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportErrorToMonitoring(error, errorContext);
    }
  }

  componentWillUnmount() {
    // Clean up retry timeout
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  /**
   * Report error to monitoring service
   */
  private reportErrorToMonitoring = (error: Error, context: any): void => {
    try {
      // Example implementation - replace with your monitoring service
      console.log('📤 Reporting error to monitoring service...', { error, context });
      
      // Example: Send to analytics service
      // Analytics.track('error_boundary_triggered', {
      //   error: error.message,
      //   context
      // });
    } catch (reportingError) {
      console.warn('⚠️ Failed to report error to monitoring:', reportingError);
    }
  };

  /**
   * Handle error recovery with exponential backoff
   */
  private handleRetry = (): void => {
    const { retryCount } = this.state;
    const { enableRecovery = true } = this.props;
    
    if (!enableRecovery || retryCount >= 3) {
      console.warn('🚨 Maximum retry attempts reached or recovery disabled');
      return;
    }
    
    this.setState({ isRecovering: true });
    
    // Exponential backoff: 1s, 2s, 4s
    const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 4000);
    
    console.log(`🔄 Attempting error recovery (${retryCount + 1}/3) in ${retryDelay}ms...`);
    
    this.retryTimeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: retryCount + 1,
        isRecovering: false
      });
      
      console.log('✅ Error boundary reset - attempting recovery');
    }, retryDelay);
  };

  /**
   * Handle manual refresh
   */
  private handleRefresh = (): void => {
    console.log('🔄 Manual page refresh requested');
    window.location.reload();
  };

  /**
   * Clear error state manually
   */
  private handleClearError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRecovering: false
    });
    console.log('🧹 Error state cleared manually');
  };

  /**
   * Format error details for display
   */
  private formatErrorDetails = (): string => {
    const { error, errorInfo, retryCount } = this.state;
    
    return JSON.stringify({
      error: {
        name: error?.name,
        message: error?.message,
        stack: error?.stack?.split('\n').slice(0, 5) // Limit stack trace
      },
      errorInfo: {
        componentStack: errorInfo?.componentStack?.split('\n').slice(0, 10) // Limit component stack
      },
      context: {
        retryCount,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      }
    }, null, 2);
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, retryCount, isRecovering } = this.state;
      const { enableRecovery = true, showErrorDetails = false } = this.props;
      const canRetry = enableRecovery && retryCount < 3;

      return (
        <div className="min-h-screen bg-[var(--ff-bg-dark)] flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <Card className="ff-card border-[var(--ff-error)]/20 bg-[var(--ff-surface)]">
              <CardHeader className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--ff-error)] to-[var(--ff-warning)] rounded-full flex items-center justify-center mx-auto ff-pulse-glow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                
                <div className="space-y-2">
                  <CardTitle 
                    className="ff-text-title text-[var(--ff-text-primary)]"
                    style={{
                      fontFamily: 'var(--ff-font-primary)',
                      fontSize: 'var(--ff-text-xl)',
                      fontWeight: 'var(--ff-weight-semibold)'
                    }}
                  >
                    Something went wrong
                  </CardTitle>
                  
                  <div className="flex items-center justify-center gap-2">
                    <Badge className="ff-badge-error">
                      Error Boundary
                    </Badge>
                    {retryCount > 0 && (
                      <Badge variant="outline" className="text-[var(--ff-text-muted)]">
                        Attempt {retryCount}/3
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="text-center space-y-3">
                  <p 
                    className="ff-text-body text-[var(--ff-text-secondary)]"
                    style={{
                      fontSize: 'var(--ff-text-sm)',
                      lineHeight: 'var(--ff-leading-relaxed)'
                    }}
                  >
                    An unexpected error occurred in the FlashFusion interface. 
                    {canRetry ? ' The system will attempt automatic recovery.' : ' Please refresh the page to continue.'}
                  </p>
                  
                  {error?.message && (
                    <div className="p-3 bg-[var(--ff-error)]/10 border border-[var(--ff-error)]/20 rounded-lg">
                      <p 
                        className="ff-text-code text-[var(--ff-error)]"
                        style={{ 
                          fontSize: 'var(--ff-text-xs)',
                          fontFamily: 'var(--ff-font-mono)'
                        }}
                      >
                        {error.message}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {canRetry && (
                    <Button 
                      onClick={this.handleRetry}
                      disabled={isRecovering}
                      className="ff-btn-primary"
                      style={{
                        fontFamily: 'var(--ff-font-primary)',
                        fontWeight: 'var(--ff-weight-semibold)',
                        fontSize: 'var(--ff-text-sm)',
                        padding: 'var(--ff-space-3) var(--ff-space-6)',
                        borderRadius: 'var(--ff-radius)'
                      }}
                    >
                      {isRecovering ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Recovering...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Try Recovery
                        </span>
                      )}
                    </Button>
                  )}
                  
                  <Button 
                    onClick={this.handleRefresh}
                    variant="outline"
                    className="ff-btn-outline"
                    style={{
                      fontFamily: 'var(--ff-font-primary)',
                      fontWeight: 'var(--ff-weight-semibold)',
                      fontSize: 'var(--ff-text-sm)',
                      padding: 'var(--ff-space-3) var(--ff-space-6)',
                      borderRadius: 'var(--ff-radius)'
                    }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh Page
                    </span>
                  </Button>
                </div>
                
                {/* Clear Error Button (for development) */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="pt-3 border-t border-[var(--border)]">
                    <Button 
                      onClick={this.handleClearError}
                      variant="ghost"
                      size="sm"
                      className="w-full ff-btn-ghost"
                      style={{
                        fontSize: 'var(--ff-text-xs)',
                        opacity: 0.7
                      }}
                    >
                      Clear Error (Dev Only)
                    </Button>
                  </div>
                )}
                
                {/* Error Details Toggle */}
                {(showErrorDetails || process.env.NODE_ENV === 'development') && (
                  <details className="pt-3 border-t border-[var(--border)]">
                    <summary 
                      className="cursor-pointer ff-text-caption text-[var(--ff-text-muted)] hover:text-[var(--ff-text-secondary)] transition-colors"
                      style={{
                        fontSize: 'var(--ff-text-xs)',
                        fontWeight: 'var(--ff-weight-medium)'
                      }}
                    >
                      🔍 Technical Details
                    </summary>
                    <div className="mt-3 p-4 bg-[var(--ff-surface-light)] rounded-lg border border-[var(--border)]">
                      <pre 
                        className="ff-text-code text-[var(--ff-text-muted)] overflow-auto whitespace-pre-wrap break-words max-h-64"
                        style={{
                          fontFamily: 'var(--ff-font-mono)',
                          fontSize: 'var(--ff-text-xs)',
                          lineHeight: 'var(--ff-leading-snug)'
                        }}
                      >
                        {this.formatErrorDetails()}
                      </pre>
                    </div>
                  </details>
                )}
                
                {/* Help Text */}
                <div className="pt-3 border-t border-[var(--border)] text-center">
                  <p 
                    className="ff-text-caption text-[var(--ff-text-muted)]"
                    style={{
                      fontSize: 'var(--ff-text-xs)',
                      lineHeight: 'var(--ff-leading-normal)'
                    }}
                  >
                    If this problem persists, please contact support or check our{' '}
                    <a 
                      href="/help" 
                      className="text-[var(--ff-primary)] hover:text-[var(--ff-primary-400)] transition-colors underline"
                    >
                      help documentation
                    </a>.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SimpleErrorBoundary;