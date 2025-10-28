/**
 * Enhanced Error Recovery System for FlashFusion
 * Intelligent error detection, recovery, and user guidance
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert } from '../ui/alert';

interface ErrorInfo {
  id: string;
  timestamp: number;
  type: 'network' | 'auth' | 'component' | 'performance' | 'memory' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  stack?: string;
  component?: string;
  url?: string;
  userAgent?: string;
  recovery?: {
    attempted: boolean;
    successful: boolean;
    method: string;
  };
}

interface RecoveryAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  action: () => Promise<boolean>;
  severity: 'low' | 'medium' | 'high';
}

interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'critical';
  components: {
    authentication: 'healthy' | 'degraded' | 'critical';
    network: 'healthy' | 'degraded' | 'critical';
    storage: 'healthy' | 'degraded' | 'critical';
    performance: 'healthy' | 'degraded' | 'critical';
    memory: 'healthy' | 'degraded' | 'critical';
  };
  lastCheck: number;
}

/**
 * Enhanced error recovery hook with intelligent suggestions
 */
export function useErrorRecovery() {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: 'healthy',
    components: {
      authentication: 'healthy',
      network: 'healthy',
      storage: 'healthy',
      performance: 'healthy',
      memory: 'healthy'
    },
    lastCheck: Date.now()
  });
  const [isRecovering, setIsRecovering] = useState(false);
  const errorQueueRef = useRef<ErrorInfo[]>([]);

  // Error classification
  const classifyError = useCallback((error: Error, errorInfo?: any): ErrorInfo => {
    const errorObj: ErrorInfo = {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      type: 'unknown',
      severity: 'medium',
      message: error.message || 'Unknown error occurred',
      stack: error.stack,
      component: errorInfo?.componentStack?.split('\n')[1]?.trim(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Classify by error message and stack
    if (error.message.includes('network') || error.message.includes('fetch')) {
      errorObj.type = 'network';
      errorObj.severity = 'high';
    } else if (error.message.includes('auth') || error.message.includes('token')) {
      errorObj.type = 'auth';
      errorObj.severity = 'high';
    } else if (error.message.includes('memory') || error.message.includes('heap')) {
      errorObj.type = 'memory';
      errorObj.severity = 'critical';
    } else if (error.stack?.includes('React') || errorInfo) {
      errorObj.type = 'component';
      errorObj.severity = 'medium';
    } else if (error.message.includes('performance') || error.message.includes('timeout')) {
      errorObj.type = 'performance';
      errorObj.severity = 'high';
    }

    return errorObj;
  }, []);

  // System health monitoring
  const checkSystemHealth = useCallback(async (): Promise<SystemHealth> => {
    const health: SystemHealth = {
      overall: 'healthy',
      components: {
        authentication: 'healthy',
        network: 'healthy',
        storage: 'healthy',
        performance: 'healthy',
        memory: 'healthy'
      },
      lastCheck: Date.now()
    };

    try {
      // Check authentication
      const token = localStorage.getItem('ff-auth-token');
      if (!token) {
        health.components.authentication = 'degraded';
      }

      // Check network
      try {
        const start = Date.now();
        await fetch('/api/health', { method: 'HEAD', signal: AbortSignal.timeout(5000) });
        const latency = Date.now() - start;
        if (latency > 2000) health.components.network = 'degraded';
        if (latency > 5000) health.components.network = 'critical';
      } catch {
        health.components.network = 'critical';
      }

      // Check storage
      try {
        const testKey = 'ff-health-check';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
      } catch {
        health.components.storage = 'critical';
      }

      // Check performance
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const memoryUsage = memory.usedJSHeapSize / memory.totalJSHeapSize;
        if (memoryUsage > 0.8) health.components.performance = 'degraded';
        if (memoryUsage > 0.9) health.components.performance = 'critical';
        
        if (memoryUsage > 0.8) health.components.memory = 'degraded';
        if (memoryUsage > 0.9) health.components.memory = 'critical';
      }

      // Determine overall health
      const componentStates = Object.values(health.components);
      if (componentStates.some(state => state === 'critical')) {
        health.overall = 'critical';
      } else if (componentStates.some(state => state === 'degraded')) {
        health.overall = 'degraded';
      }

    } catch (error) {
      console.error('Health check failed:', error);
      health.overall = 'critical';
    }

    return health;
  }, []);

  // Recovery actions
  const recoveryActions: RecoveryAction[] = [
    {
      id: 'refresh-page',
      label: 'Refresh Page',
      description: 'Reload the application to clear temporary issues',
      icon: '🔄',
      severity: 'low',
      action: async () => {
        window.location.reload();
        return true;
      }
    },
    {
      id: 'clear-cache',
      label: 'Clear Cache',
      description: 'Remove stored data that might be causing issues',
      icon: '🧹',
      severity: 'medium',
      action: async () => {
        try {
          localStorage.clear();
          sessionStorage.clear();
          if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
          }
          return true;
        } catch {
          return false;
        }
      }
    },
    {
      id: 'reset-auth',
      label: 'Reset Authentication',
      description: 'Clear authentication data and prompt re-login',
      icon: '🔐',
      severity: 'medium',
      action: async () => {
        try {
          localStorage.removeItem('ff-auth-token');
          localStorage.removeItem('ff-remember-user');
          // Trigger auth flow
          window.location.href = '/?auth=true';
          return true;
        } catch {
          return false;
        }
      }
    },
    {
      id: 'safe-mode',
      label: 'Enable Safe Mode',
      description: 'Run with minimal features for stability',
      icon: '🚨',
      severity: 'high',
      action: async () => {
        try {
          localStorage.setItem('ff-emergency-mode', 'true');
          localStorage.setItem('ff-reduce-animations', 'true');
          localStorage.setItem('ff-lite-mode', 'true');
          window.location.reload();
          return true;
        } catch {
          return false;
        }
      }
    },
    {
      id: 'memory-cleanup',
      label: 'Memory Cleanup',
      description: 'Force garbage collection and memory optimization',
      icon: '🧠',
      severity: 'high',
      action: async () => {
        try {
          // Force garbage collection if available
          if ('gc' in window) {
            (window as any).gc();
          }
          
          // Clear large data structures
          const analytics = localStorage.getItem('ff-analytics');
          if (analytics && analytics.length > 50000) {
            localStorage.setItem('ff-analytics', '[]');
          }
          
          return true;
        } catch {
          return false;
        }
      }
    }
  ];

  // Automatic recovery attempt
  const attemptRecovery = useCallback(async (error: ErrorInfo): Promise<boolean> => {
    setIsRecovering(true);
    
    try {
      // Select appropriate recovery action based on error type
      let actionId: string;
      
      switch (error.type) {
        case 'auth':
          actionId = 'reset-auth';
          break;
        case 'memory':
          actionId = 'memory-cleanup';
          break;
        case 'network':
          actionId = 'refresh-page';
          break;
        case 'performance':
          actionId = 'safe-mode';
          break;
        default:
          actionId = 'clear-cache';
      }
      
      const action = recoveryActions.find(a => a.id === actionId);
      if (action) {
        const success = await action.action();
        
        // Update error with recovery info
        setErrors(prev => prev.map(e => 
          e.id === error.id 
            ? { ...e, recovery: { attempted: true, successful: success, method: action.label } }
            : e
        ));
        
        return success;
      }
    } catch (recoveryError) {
      console.error('Recovery attempt failed:', recoveryError);
    } finally {
      setIsRecovering(false);
    }
    
    return false;
  }, [recoveryActions]);

  // Log error and attempt recovery
  const logError = useCallback(async (error: Error, errorInfo?: any) => {
    const errorObj = classifyError(error, errorInfo);
    
    // Add to error queue for batch processing
    errorQueueRef.current.push(errorObj);
    setErrors(prev => [...prev.slice(-19), errorObj]); // Keep last 20 errors
    
    // Check system health
    const health = await checkSystemHealth();
    setSystemHealth(health);
    
    // Attempt automatic recovery for critical errors
    if (errorObj.severity === 'critical' || health.overall === 'critical') {
      await attemptRecovery(errorObj);
    }
    
    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      try {
        // Analytics.track('error_occurred', { 
        //   error: errorObj,
        //   health: health
        // });
      } catch {
        // Silent fail for analytics
      }
    }
  }, [classifyError, checkSystemHealth, attemptRecovery]);

  // Clear resolved errors
  const clearError = useCallback((errorId: string) => {
    setErrors(prev => prev.filter(e => e.id !== errorId));
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setErrors([]);
    errorQueueRef.current = [];
  }, []);

  // Periodic health check
  useEffect(() => {
    const interval = setInterval(async () => {
      const health = await checkSystemHealth();
      setSystemHealth(health);
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [checkSystemHealth]);

  return {
    errors,
    systemHealth,
    isRecovering,
    recoveryActions,
    logError,
    clearError,
    clearAllErrors,
    attemptRecovery,
    checkSystemHealth
  };
}

/**
 * Enhanced Error Recovery System Component
 */
export function EnhancedErrorRecoverySystem() {
  const {
    errors,
    systemHealth,
    isRecovering,
    recoveryActions,
    clearError,
    clearAllErrors,
    attemptRecovery,
    checkSystemHealth
  } = useErrorRecovery();

  const [selectedError, setSelectedError] = useState<string | null>(null);

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'from-red-500 to-red-600';
      case 'high': return 'from-orange-500 to-red-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  // Get health status color
  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'degraded': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6 ff-fade-in-up">
      {/* System Health Overview */}
      <Card className="ff-card-interactive">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="ff-text-title">System Health Status</span>
            <Badge 
              variant={systemHealth.overall === 'healthy' ? 'default' : 'destructive'}
              className={
                systemHealth.overall === 'healthy' ? 'ff-badge-primary' :
                systemHealth.overall === 'degraded' ? 'ff-badge-warning' :
                'ff-badge-error'
              }
            >
              {systemHealth.overall.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(systemHealth.components).map(([component, status]) => (
              <div key={component} className="text-center space-y-2">
                <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${
                  status === 'healthy' ? 'bg-green-500/20' :
                  status === 'degraded' ? 'bg-yellow-500/20' :
                  'bg-red-500/20'
                }`}>
                  <div className={`w-6 h-6 rounded-full ${
                    status === 'healthy' ? 'bg-green-500' :
                    status === 'degraded' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                </div>
                <div className="ff-text-sm font-medium capitalize">{component}</div>
                <div className={`ff-text-xs ${getHealthColor(status)}`}>
                  {status}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="ff-text-caption">
              Last checked: {new Date(systemHealth.lastCheck).toLocaleTimeString()}
            </div>
            <Button 
              onClick={checkSystemHealth}
              variant="outline"
              size="sm"
              className="ff-btn-outline"
            >
              Check Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Errors */}
      {errors.length > 0 && (
        <Card className="ff-card-interactive">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="ff-text-title">Recent Errors ({errors.length})</span>
              <Button
                onClick={clearAllErrors}
                variant="outline"
                size="sm"
                className="ff-btn-outline"
              >
                Clear All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {errors.slice().reverse().map((error) => (
                <div key={error.id} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={error.severity === 'critical' ? 'destructive' : 'secondary'}
                          className={
                            error.severity === 'critical' ? 'ff-badge-error' :
                            error.severity === 'high' ? 'ff-badge-warning' :
                            'ff-badge-secondary'
                          }
                        >
                          {error.type.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="ff-badge-secondary">
                          {error.severity}
                        </Badge>
                        {error.recovery?.attempted && (
                          <Badge 
                            variant={error.recovery.successful ? 'default' : 'destructive'}
                            className={error.recovery.successful ? 'ff-badge-primary' : 'ff-badge-error'}
                          >
                            {error.recovery.successful ? 'Recovered' : 'Recovery Failed'}
                          </Badge>
                        )}
                      </div>
                      <h4 className="ff-text-lg font-semibold">{error.message}</h4>
                      <div className="ff-text-caption">
                        {new Date(error.timestamp).toLocaleString()}
                        {error.component && ` • ${error.component}`}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => attemptRecovery(error)}
                        disabled={isRecovering}
                        className="ff-btn-primary"
                      >
                        {isRecovering ? 'Recovering...' : 'Recover'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => clearError(error.id)}
                        className="ff-btn-outline"
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                  
                  {selectedError === error.id && error.stack && (
                    <div className="mt-3 p-3 bg-muted rounded text-xs font-mono max-h-40 overflow-y-auto">
                      {error.stack}
                    </div>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedError(selectedError === error.id ? null : error.id)}
                    className="ff-text-caption"
                  >
                    {selectedError === error.id ? 'Hide Details' : 'Show Details'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recovery Actions */}
      <Card className="ff-card-interactive">
        <CardHeader>
          <CardTitle className="ff-text-title">Recovery Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {recoveryActions.map((action) => (
              <div key={action.id} className="p-4 border border-border rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${getSeverityColor(action.severity)} rounded-lg flex items-center justify-center text-white text-lg`}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="ff-text-lg font-semibold">{action.label}</h4>
                    <p className="ff-text-caption">{action.description}</p>
                  </div>
                </div>
                <Button
                  onClick={action.action}
                  disabled={isRecovering}
                  variant={action.severity === 'high' ? 'destructive' : 'outline'}
                  size="sm"
                  className={action.severity === 'high' ? 'ff-btn-accent w-full' : 'ff-btn-outline w-full'}
                >
                  Execute
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Actions */}
      <Alert>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="ff-text-lg font-semibold">Emergency Recovery</h4>
            <p className="ff-text-body">If the system is unresponsive, use these emergency actions.</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                localStorage.setItem('ff-emergency-mode', 'true');
                window.location.reload();
              }}
              variant="destructive"
              className="ff-btn-accent"
            >
              Safe Mode
            </Button>
            <Button
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload();
              }}
              variant="destructive"
              className="ff-btn-accent"
            >
              Factory Reset
            </Button>
          </div>
        </div>
      </Alert>
    </div>
  );
}

export default EnhancedErrorRecoverySystem;