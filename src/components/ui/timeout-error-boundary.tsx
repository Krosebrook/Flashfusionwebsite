/**
 * @fileoverview Timeout Error Boundary for FlashFusion
 * @chunk ui
 * @category error-handling
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Specialized error boundary to handle timeout and API connection issues
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Alert, AlertDescription } from './alert';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isRetrying: boolean;
  retryCount: number;
  isOnline: boolean;
}

export class TimeoutErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null;
  private onlineListener: (() => void) | null = null;
  private offlineListener: (() => void) | null = null;

  constructor(props: Props) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRetrying: false,
      retryCount: 0,
      isOnline: navigator.onLine
    };
  }

  componentDidMount() {
    // Listen for online/offline events
    this.onlineListener = () => this.setState({ isOnline: true });
    this.offlineListener = () => this.setState({ isOnline: false });
    
    window.addEventListener('online', this.onlineListener);
    window.addEventListener('offline', this.offlineListener);
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
    
    if (this.onlineListener) {
      window.removeEventListener('online', this.onlineListener);
    }
    
    if (this.offlineListener) {
      window.removeEventListener('offline', this.offlineListener);
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('TimeoutErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Call the optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private isTimeoutError = (error: Error | null): boolean => {
    if (!error) return false;
    
    const timeoutIndicators = [
      'timeout',
      'timed out',
      'network error',
      'fetch failed',
      'aborted',
      'connection refused',
      'ERR_NETWORK',
      'Failed to fetch'
    ];
    
    return timeoutIndicators.some(indicator => 
      error.message.toLowerCase().includes(indicator.toLowerCase()) ||
      error.name.toLowerCase().includes(indicator.toLowerCase())
    );
  };

  private handleRetry = async () => {
    if (this.state.retryCount >= 3) {
      console.warn('Maximum retry attempts reached');
      return;
    }

    this.setState({ isRetrying: true });

    // Wait a bit before retrying
    this.retryTimeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isRetrying: false,
        retryCount: this.state.retryCount + 1
      });
    }, 2000);
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isRetrying: false,
      retryCount: 0
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isTimeout = this.isTimeoutError(this.state.error);
      const { isOnline, retryCount, isRetrying } = this.state;

      return (
        <div className="min-h-screen bg-[var(--ff-bg-dark)] flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-[var(--card)] border-[var(--border)] shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 bg-[var(--ff-error)] bg-opacity-10 rounded-full flex items-center justify-center mx-auto">
                {isOnline ? (
                  <AlertTriangle className="w-8 h-8 text-[var(--ff-error)]" />
                ) : (
                  <WifiOff className="w-8 h-8 text-[var(--ff-error)]" />
                )}
              </div>
              <CardTitle className="text-xl font-semibold text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)' }}>
                {isTimeout ? 'Connection Timeout' : 'Something went wrong'}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Network status indicator */}
              <Alert className={`border-[var(--border)] ${isOnline ? 'bg-[var(--ff-success)] bg-opacity-10' : 'bg-[var(--ff-error)] bg-opacity-10'}`}>
                <div className="flex items-center gap-2">
                  {isOnline ? (
                    <Wifi className="w-4 h-4 text-[var(--ff-success)]" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-[var(--ff-error)]" />
                  )}
                  <AlertDescription className={isOnline ? 'text-[var(--ff-success)]' : 'text-[var(--ff-error)]'}>
                    {isOnline ? 'Internet connection is active' : 'No internet connection detected'}
                  </AlertDescription>
                </div>
              </Alert>

              {/* Error message */}
              <div className="space-y-2">
                <h4 className="font-semibold text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)' }}>
                  {isTimeout ? 'The request took too long to complete' : 'An unexpected error occurred'}
                </h4>
                <p className="text-sm text-[var(--ff-text-secondary)]">
                  {isTimeout 
                    ? 'This might be due to a slow internet connection or server issues. Please try again.'
                    : 'We\'re working to fix this issue. Please try refreshing the page.'
                  }
                </p>
                
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm text-[var(--ff-text-muted)] hover:text-[var(--ff-primary)]">
                      Error Details (Development)
                    </summary>
                    <pre className="mt-2 p-3 bg-[var(--ff-surface)] rounded text-xs text-[var(--ff-text-muted)] overflow-auto max-h-32">
                      {this.state.error.message}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                )}
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                {retryCount < 3 && (
                  <Button
                    onClick={this.handleRetry}
                    disabled={isRetrying || !isOnline}
                    className="w-full bg-[var(--ff-primary)] hover:bg-[var(--ff-primary-600)] text-white font-semibold py-3 rounded-lg transition-all duration-200"
                    style={{ fontFamily: 'var(--ff-font-primary)' }}
                  >
                    {isRetrying ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Retrying...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2" />
                        Try Again ({3 - retryCount} attempts left)
                      </>
                    )}
                  </Button>
                )}

                <Button
                  onClick={this.handleReset}
                  variant="outline"
                  className="w-full border-[var(--border)] text-[var(--ff-text-primary)] hover:bg-[var(--ff-surface)] transition-all duration-200"
                  style={{ fontFamily: 'var(--ff-font-primary)' }}
                >
                  Reset Error State
                </Button>

                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  className="w-full border-[var(--border)] text-[var(--ff-text-primary)] hover:bg-[var(--ff-surface)] transition-all duration-200"
                  style={{ fontFamily: 'var(--ff-font-primary)' }}
                >
                  Reload Page
                </Button>
              </div>

              {/* Additional help text */}
              {!isOnline && (
                <div className="text-center">
                  <p className="text-xs text-[var(--ff-text-muted)]">
                    Please check your internet connection and try again
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default TimeoutErrorBoundary;