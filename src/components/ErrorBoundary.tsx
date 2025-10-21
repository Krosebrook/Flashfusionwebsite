/**
 * @fileoverview Enhanced Error Boundary Component
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Production-ready error boundary with:
 * - Detailed error reporting
 * - Graceful fallback UI
 * - Development debugging info
 * - Memory leak prevention
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: LogRocketService.captureException(error, { extra: errorInfo });
      console.error('Production error caught:', error.message);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div 
          className="min-h-screen bg-[var(--ff-bg-dark)] flex items-center justify-center"
          style={{ fontFamily: 'var(--ff-font-secondary)' }}
        >
          <div className="max-w-md mx-auto text-center space-y-6 p-8">
            <div className="space-y-4">
              <div className="text-6xl">😵</div>
              <h1 
                className="text-2xl text-white"
                style={{ 
                  fontFamily: 'var(--ff-font-primary)',
                  fontWeight: 'var(--ff-weight-bold)'
                }}
              >
                Something went wrong
              </h1>
              <p 
                className="text-gray-300"
                style={{ fontSize: 'var(--ff-text-base)' }}
              >
                We've encountered an unexpected error. Don't worry, your data is safe.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full px-4 py-2 bg-[var(--ff-primary)] text-white rounded-lg hover:bg-[var(--ff-primary-600)] transition-colors"
                style={{ 
                  fontFamily: 'var(--ff-font-primary)',
                  fontWeight: 'var(--ff-weight-semibold)'
                }}
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-[var(--ff-surface)] text-gray-300 rounded-lg hover:bg-[var(--ff-surface-light)] transition-colors"
                style={{ 
                  fontFamily: 'var(--ff-font-primary)',
                  fontWeight: 'var(--ff-weight-medium)'
                }}
              >
                Reload Page
              </button>
            </div>

            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary 
                  className="cursor-pointer text-sm text-gray-400 hover:text-gray-300"
                  style={{ fontFamily: 'var(--ff-font-mono)' }}
                >
                  Error Details (Development)
                </summary>
                <div 
                  className="mt-2 p-4 bg-red-900/20 border border-red-500/30 rounded text-xs text-red-300 overflow-auto max-h-40"
                  style={{ fontFamily: 'var(--ff-font-mono)' }}
                >
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.error.stack && (
                    <div className="mb-2">
                      <strong>Stack:</strong>
                      <pre className="mt-1 whitespace-pre-wrap text-xs">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="mt-1 whitespace-pre-wrap text-xs">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="pt-4 border-t border-gray-700">
              <p 
                className="text-xs text-gray-500"
                style={{ fontSize: 'var(--ff-text-xs)' }}
              >
                If this problem persists, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;