/**
 * @fileoverview Authentication Error Boundary with Mobile Support
 * @chunk auth
 * @category error-handling
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Specialized error boundary for authentication issues with mobile-specific
 * error handling and recovery mechanisms.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { 
  AlertCircle, 
  RefreshCw, 
  Smartphone, 
  Wifi, 
  WifiOff,
  Shield,
  Settings,
  Bug,
  ExternalLink
} from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  networkStatus: 'online' | 'offline' | 'unknown';
  isDebugMode: boolean;
}

/**
 * Enhanced Error Boundary for Authentication Components
 */
export class AuthErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      networkStatus: typeof navigator !== 'undefined' && navigator.onLine ? 'online' : 'offline',
      isDebugMode: process.env.NODE_ENV === 'development' || localStorage.getItem('ff-debug') === 'true'
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Auth Error Boundary caught error:', error);
    console.error('Error Info:', errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Log error for debugging
    this.logAuthError(error, errorInfo);
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidMount() {
    // Listen for network status changes
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleNetworkChange);
      window.addEventListener('offline', this.handleNetworkChange);
    }
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleNetworkChange);
      window.removeEventListener('offline', this.handleNetworkChange);
    }
    
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private handleNetworkChange = () => {
    const networkStatus = navigator.onLine ? 'online' : 'offline';
    this.setState({ networkStatus });
    
    // Auto-retry if network comes back online
    if (networkStatus === 'online' && this.state.hasError) {
      this.retryTimeoutId = setTimeout(() => {
        this.handleRetry();
      }, 2000);
    }
  };

  private logAuthError = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      // Try to log error to backend for debugging
      const errorData = {
        error_type: 'auth_component_error',
        error_message: error.message,
        error_stack: error.stack,
        component_stack: errorInfo.componentStack,
        user_agent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        network_status: this.state.networkStatus
      };

      // Store in localStorage for later sync if network is down
      const existingErrors = JSON.parse(localStorage.getItem('ff-auth-errors') || '[]');
      existingErrors.push(errorData);
      localStorage.setItem('ff-auth-errors', JSON.stringify(existingErrors.slice(-10))); // Keep last 10 errors
      
      console.log('🔍 Auth error logged locally:', errorData);
    } catch (logError) {
      console.warn('Failed to log auth error:', logError);
    }
  };

  private handleRetry = () => {
    console.log('🔄 Retrying authentication component...');
    
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  private handleClearStorage = () => {
    try {
      // Clear all auth-related storage
      const keysToRemove = [
        'ff-auth-token',
        'ff-remember-user',
        'ff-auth-errors',
        'ff-session-data',
        'supabase.auth.token'
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      
      console.log('🧹 Auth storage cleared');
      
      // Retry after clearing storage
      setTimeout(() => {
        this.handleRetry();
      }, 500);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  };

  private getErrorCategory = (error: Error): string => {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'network';
    } else if (message.includes('supabase') || message.includes('auth')) {
      return 'authentication';
    } else if (message.includes('chunk') || message.includes('loading')) {
      return 'loading';
    } else if (message.includes('import') || message.includes('module')) {
      return 'module';
    } else {
      return 'unknown';
    }
  };

  private getErrorSolution = (category: string): { title: string; actions: string[] } => {
    switch (category) {
      case 'network':
        return {
          title: 'Network Issue',
          actions: [
            'Check your internet connection',
            'Try switching between WiFi and mobile data',
            'Wait a moment and try again'
          ]
        };
      case 'authentication':
        return {
          title: 'Authentication Service Issue',
          actions: [
            'Clear browser data and try again',
            'Try refreshing the page',
            'Contact support if the issue persists'
          ]
        };
      case 'loading':
        return {
          title: 'Component Loading Issue',
          actions: [
            'Refresh the page to reload components',
            'Clear browser cache',
            'Try using an incognito/private browser window'
          ]
        };
      case 'module':
        return {
          title: 'Module Loading Error',
          actions: [
            'Refresh the page completely',
            'Clear browser cache and cookies',
            'Try a different browser if available'
          ]
        };
      default:
        return {
          title: 'Unexpected Error',
          actions: [
            'Refresh the page',
            'Clear browser data',
            'Contact support with error details'
          ]
        };
    }
  };

  private isMobile = (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768;
  };

  render() {
    if (this.state.hasError) {
      // Return custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error } = this.state;
      const errorCategory = error ? this.getErrorCategory(error) : 'unknown';
      const errorSolution = this.getErrorSolution(errorCategory);
      const isMobile = this.isMobile();

      return (
        <div className="min-h-screen bg-[var(--ff-bg-dark)] flex items-center justify-center p-4">
          <div className="w-full max-w-lg mx-auto">
            <Card className="bg-[var(--ff-surface)] border-[var(--border)] shadow-xl">
              <CardHeader className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-[var(--ff-text-primary)] flex items-center gap-2">
                      Authentication Error
                      {isMobile && <Smartphone className="w-4 h-4 text-[var(--ff-text-muted)]" />}
                    </CardTitle>
                    <CardDescription className="text-[var(--ff-text-muted)]">
                      {errorSolution.title}
                    </CardDescription>
                  </div>
                </div>

                {/* Network Status */}
                <div className="flex items-center gap-2">
                  <Badge variant={this.state.networkStatus === 'online' ? 'default' : 'destructive'}>
                    {this.state.networkStatus === 'online' ? (
                      <>
                        <Wifi className="w-3 h-3 mr-1" />
                        Online
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-3 h-3 mr-1" />
                        Offline
                      </>
                    )}
                  </Badge>
                  {this.state.retryCount > 0 && (
                    <Badge variant="outline">
                      Retry #{this.state.retryCount}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Error Alert */}
                <Alert className="border-red-500/20 bg-red-500/10">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-400">
                    <strong>Error:</strong> {error?.message || 'An unexpected error occurred'}
                  </AlertDescription>
                </Alert>

                {/* Solutions */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-[var(--ff-text-primary)] text-sm">
                    Try these solutions:
                  </h4>
                  <ul className="space-y-2 text-sm text-[var(--ff-text-secondary)]">
                    {errorSolution.actions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-[var(--ff-primary)] font-bold mt-0.5">•</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <Button
                      onClick={this.handleRetry}
                      className="w-full bg-[var(--ff-primary)] hover:bg-[var(--ff-primary-600)] text-white"
                      disabled={this.state.networkStatus === 'offline'}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>

                    <Button
                      onClick={this.handleClearStorage}
                      variant="outline"
                      className="w-full border-[var(--border)] text-[var(--ff-text-primary)] hover:bg-[var(--ff-surface-light)]"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Clear Data & Retry
                    </Button>

                    <Button
                      onClick={() => window.location.reload()}
                      variant="outline"
                      className="w-full border-[var(--border)] text-[var(--ff-text-primary)] hover:bg-[var(--ff-surface-light)]"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Page
                    </Button>
                  </div>

                  {isMobile && (
                    <Alert className="border-blue-500/20 bg-blue-500/10">
                      <Smartphone className="h-4 w-4 text-blue-400" />
                      <AlertDescription className="text-blue-400 text-sm">
                        <strong>Mobile Tip:</strong> Try switching between WiFi and mobile data, or try again in a few minutes.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Debug Information */}
                {this.state.isDebugMode && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm text-[var(--ff-text-muted)] hover:text-[var(--ff-text-primary)] flex items-center gap-2">
                      <Bug className="w-3 h-3" />
                      Debug Information
                    </summary>
                    <div className="mt-2 p-3 bg-[var(--ff-bg-dark)] rounded border text-xs text-[var(--ff-text-muted)] font-mono">
                      <div><strong>Error:</strong> {error?.message}</div>
                      <div><strong>Stack:</strong> {error?.stack?.slice(0, 200)}...</div>
                      <div><strong>Component:</strong> {this.state.errorInfo?.componentStack?.slice(0, 200)}...</div>
                      <div><strong>Retry Count:</strong> {this.state.retryCount}</div>
                      <div><strong>Network:</strong> {this.state.networkStatus}</div>
                      <div><strong>User Agent:</strong> {navigator.userAgent.slice(0, 100)}...</div>
                    </div>
                  </details>
                )}

                {/* Support Link */}
                <div className="text-center">
                  <a
                    href="/contact"
                    className="text-sm text-[var(--ff-primary)] hover:text-[var(--ff-primary-400)] inline-flex items-center gap-1"
                  >
                    Need help? Contact Support
                    <ExternalLink className="w-3 h-3" />
                  </a>
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

export default AuthErrorBoundary;