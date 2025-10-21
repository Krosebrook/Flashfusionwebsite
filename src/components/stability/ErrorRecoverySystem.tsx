import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Zap, 
  Activity, 
  Clock, 
  TrendingDown,
  Server,
  Database,
  Network,
  Cpu,
  HardDrive,
  Users,
  Bug,
  Wrench
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { analyticsService } from '../../services/AnalyticsService';

interface ErrorEvent {
  id: string;
  type: 'client' | 'server' | 'network' | 'database' | 'auth' | 'performance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  stack?: string;
  context: {
    userId?: string;
    sessionId: string;
    userAgent: string;
    url: string;
    timestamp: number;
    component?: string;
    action?: string;
  };
  resolved: boolean;
  resolutionAttempts: number;
  autoResolved: boolean;
}

interface RecoveryAction {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  automated: boolean;
  estimatedTime: number; // in seconds
  successRate: number; // percentage
  execute: () => Promise<boolean>;
}

interface SystemStatus {
  overall: 'healthy' | 'degraded' | 'critical' | 'recovering';
  components: {
    frontend: 'healthy' | 'degraded' | 'down';
    backend: 'healthy' | 'degraded' | 'down';
    database: 'healthy' | 'degraded' | 'down';
    auth: 'healthy' | 'degraded' | 'down';
    cdn: 'healthy' | 'degraded' | 'down';
  };
  metrics: {
    uptime: number;
    errorRate: number;
    responseTime: number;
    activeUsers: number;
    recoveredErrors: number;
    preventedOutages: number;
  };
}

export function ErrorRecoverySystem() {
  const [errors, setErrors] = useState<ErrorEvent[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    overall: 'healthy',
    components: {
      frontend: 'healthy',
      backend: 'healthy',
      database: 'healthy',
      auth: 'healthy',
      cdn: 'healthy'
    },
    metrics: {
      uptime: 99.9,
      errorRate: 0.1,
      responseTime: 120,
      activeUsers: 0,
      recoveredErrors: 47,
      preventedOutages: 12
    }
  });
  const [activeRecoveries, setActiveRecoveries] = useState<string[]>([]);
  const [recoveryHistory, setRecoveryHistory] = useState<any[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  
  const errorQueueRef = useRef<ErrorEvent[]>([]);
  const recoveryIntervalRef = useRef<NodeJS.Timeout>();

  // Recovery actions available
  const recoveryActions: RecoveryAction[] = [
    {
      id: 'cache-clear',
      name: 'Clear Cache',
      description: 'Clear application cache and reload critical data',
      icon: RefreshCw,
      automated: true,
      estimatedTime: 5,
      successRate: 85,
      execute: async () => {
        try {
          localStorage.clear();
          sessionStorage.clear();
          if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
          }
          return true;
        } catch (error) {
          console.error('Cache clear failed:', error);
          return false;
        }
      }
    },
    {
      id: 'service-restart',
      name: 'Restart Services',
      description: 'Restart critical background services',
      icon: Server,
      automated: true,
      estimatedTime: 10,
      successRate: 90,
      execute: async () => {
        try {
          // Simulate service restart
          await new Promise(resolve => setTimeout(resolve, 2000));
          return true;
        } catch (error) {
          console.error('Service restart failed:', error);
          return false;
        }
      }
    },
    {
      id: 'database-reconnect',
      name: 'Database Reconnection',
      description: 'Re-establish database connections',
      icon: Database,
      automated: true,
      estimatedTime: 8,
      successRate: 95,
      execute: async () => {
        try {
          // Simulate database reconnection
          await new Promise(resolve => setTimeout(resolve, 1500));
          return true;
        } catch (error) {
          console.error('Database reconnection failed:', error);
          return false;
        }
      }
    },
    {
      id: 'memory-cleanup',
      name: 'Memory Cleanup',
      description: 'Free up memory and optimize performance',
      icon: Cpu,
      automated: true,
      estimatedTime: 3,
      successRate: 75,
      execute: async () => {
        try {
          // Force garbage collection if available
          if ('gc' in window) {
            (window as any).gc();
          }
          return true;
        } catch (error) {
          console.error('Memory cleanup failed:', error);
          return false;
        }
      }
    },
    {
      id: 'failover-switch',
      name: 'Failover Switch',
      description: 'Switch to backup systems and redundant services',
      icon: Network,
      automated: false,
      estimatedTime: 30,
      successRate: 98,
      execute: async () => {
        try {
          // Simulate failover
          await new Promise(resolve => setTimeout(resolve, 3000));
          return true;
        } catch (error) {
          console.error('Failover switch failed:', error);
          return false;
        }
      }
    }
  ];

  // Error detection and monitoring
  const detectError = useCallback((error: Partial<ErrorEvent>) => {
    const errorEvent: ErrorEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type: error.type || 'client',
      severity: error.severity || 'medium',
      message: error.message || 'Unknown error occurred',
      stack: error.stack,
      context: {
        sessionId: Math.random().toString(36).substr(2, 9),
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now(),
        ...error.context
      },
      resolved: false,
      resolutionAttempts: 0,
      autoResolved: false
    };

    setErrors(prev => [errorEvent, ...prev.slice(0, 49)]); // Keep last 50 errors
    errorQueueRef.current.push(errorEvent);
    
    // Track error in analytics
    analyticsService.trackError(errorEvent.type, errorEvent.message, {
      severity: errorEvent.severity,
      component: errorEvent.context.component
    });

    // Trigger immediate recovery for critical errors
    if (errorEvent.severity === 'critical') {
      handleAutomaticRecovery(errorEvent);
    }
  }, []);

  // Automatic error recovery
  const handleAutomaticRecovery = useCallback(async (error: ErrorEvent) => {
    const applicableActions = recoveryActions.filter(action => {
      // Logic to determine which actions apply to specific error types
      switch (error.type) {
        case 'client':
          return ['cache-clear', 'memory-cleanup'].includes(action.id);
        case 'server':
          return ['service-restart', 'failover-switch'].includes(action.id);
        case 'database':
          return ['database-reconnect', 'service-restart'].includes(action.id);
        case 'network':
          return ['failover-switch', 'service-restart'].includes(action.id);
        default:
          return action.automated;
      }
    });

    for (const action of applicableActions) {
      if (action.automated && !activeRecoveries.includes(action.id)) {
        await executeRecoveryAction(action, error);
      }
    }
  }, [activeRecoveries]);

  // Execute recovery action
  const executeRecoveryAction = useCallback(async (action: RecoveryAction, error?: ErrorEvent) => {
    setActiveRecoveries(prev => [...prev, action.id]);
    
    const startTime = Date.now();
    let success = false;
    
    try {
      toast.info(`Starting ${action.name}...`);
      success = await action.execute();
      
      const duration = Date.now() - startTime;
      const recoveryEvent = {
        id: Math.random().toString(36).substr(2, 9),
        actionId: action.id,
        actionName: action.name,
        success,
        duration,
        timestamp: Date.now(),
        triggeredBy: error?.id || 'manual',
        errorType: error?.type
      };
      
      setRecoveryHistory(prev => [recoveryEvent, ...prev.slice(0, 19)]);
      
      if (success) {
        toast.success(`${action.name} completed successfully`);
        
        // Mark related errors as resolved
        if (error) {
          setErrors(prev => prev.map(e => 
            e.id === error.id ? { ...e, resolved: true, autoResolved: true } : e
          ));
        }
        
        // Update system status
        setSystemStatus(prev => ({
          ...prev,
          metrics: {
            ...prev.metrics,
            recoveredErrors: prev.metrics.recoveredErrors + 1
          }
        }));
      } else {
        toast.error(`${action.name} failed`);
      }
    } catch (actionError) {
      console.error(`Recovery action ${action.id} failed:`, actionError);
      toast.error(`${action.name} encountered an error`);
    } finally {
      setActiveRecoveries(prev => prev.filter(id => id !== action.id));
    }
  }, []);

  // System health monitoring
  useEffect(() => {
    if (!isMonitoring) return;

    const healthCheckInterval = setInterval(async () => {
      try {
        // Simulate health checks
        const components = {
          frontend: Math.random() > 0.05 ? 'healthy' : 'degraded',
          backend: Math.random() > 0.03 ? 'healthy' : 'degraded',
          database: Math.random() > 0.02 ? 'healthy' : 'degraded',
          auth: Math.random() > 0.01 ? 'healthy' : 'degraded',
          cdn: Math.random() > 0.01 ? 'healthy' : 'degraded'
        } as const;

        const degradedComponents = Object.values(components).filter(status => status !== 'healthy').length;
        const overall = degradedComponents === 0 ? 'healthy' : 
                        degradedComponents <= 1 ? 'degraded' : 'critical';

        setSystemStatus(prev => ({
          ...prev,
          overall,
          components,
          metrics: {
            ...prev.metrics,
            errorRate: Math.max(0, prev.metrics.errorRate + (Math.random() - 0.5) * 0.1),
            responseTime: Math.max(50, prev.metrics.responseTime + (Math.random() - 0.5) * 20),
            activeUsers: Math.max(0, prev.metrics.activeUsers + Math.floor((Math.random() - 0.5) * 10))
          }
        }));

        // Generate simulated errors occasionally
        if (Math.random() < 0.1) {
          const errorTypes: ErrorEvent['type'][] = ['client', 'server', 'network', 'database', 'auth'];
          const severities: ErrorEvent['severity'][] = ['low', 'medium', 'high', 'critical'];
          
          detectError({
            type: errorTypes[Math.floor(Math.random() * errorTypes.length)],
            severity: severities[Math.floor(Math.random() * severities.length)],
            message: `Simulated ${errorTypes[Math.floor(Math.random() * errorTypes.length)]} error`,
            context: {
              component: 'system-monitor'
            }
          });
        }
      } catch (error) {
        console.error('Health check failed:', error);
      }
    }, 5000);

    return () => clearInterval(healthCheckInterval);
  }, [isMonitoring, detectError]);

  // Global error handler
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      detectError({
        type: 'client',
        severity: 'medium',
        message: event.error?.message || 'Global JavaScript error',
        stack: event.error?.stack,
        context: {
          component: 'global-handler'
        }
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      detectError({
        type: 'client',
        severity: 'high',
        message: `Unhandled promise rejection: ${event.reason}`,
        context: {
          component: 'promise-handler'
        }
      });
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [detectError]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'degraded': return 'text-yellow-500';
      case 'critical': case 'down': return 'text-red-500';
      case 'recovering': return 'text-blue-500';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'degraded': return AlertTriangle;
      case 'critical': case 'down': return AlertTriangle;
      case 'recovering': return RefreshCw;
      default: return Activity;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-500/10 text-blue-500';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500';
      case 'high': return 'bg-orange-500/10 text-orange-500';
      case 'critical': return 'bg-red-500/10 text-red-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const unresolvedErrors = errors.filter(e => !e.resolved);
  const criticalErrors = unresolvedErrors.filter(e => e.severity === 'critical');

  return (
    <div className="space-y-6 ff-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold ff-text-gradient">Error Recovery System</h1>
          <p className="text-muted-foreground">
            Proactive error detection and automatic recovery for platform stability
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge 
            variant={systemStatus.overall === 'healthy' ? 'default' : 'destructive'}
            className={`font-medium ${systemStatus.overall === 'healthy' ? 'ff-badge-glow' : ''}`}
          >
            <Activity className={`h-3 w-3 mr-1 ${isMonitoring ? 'animate-pulse' : ''}`} />
            System {systemStatus.overall}
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`ff-focus-ring ${isMonitoring ? 'bg-primary/10' : ''}`}
          >
            <Shield className="h-4 w-4 mr-2" />
            {isMonitoring ? 'Monitoring Active' : 'Start Monitoring'}
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalErrors.length > 0 && (
        <Alert className="border-destructive bg-destructive/5">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-destructive">Critical Errors Detected</AlertTitle>
          <AlertDescription>
            {criticalErrors.length} critical error{criticalErrors.length === 1 ? '' : 's'} require immediate attention.
            <div className="mt-2 space-x-2">
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => criticalErrors.forEach(error => handleAutomaticRecovery(error))}
              >
                Auto Recover All
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(systemStatus.components).map(([component, status]) => {
          const StatusIcon = getStatusIcon(status);
          return (
            <Card key={component} className="ff-card-interactive">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(status)} bg-muted`}>
                    <StatusIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm capitalize">{component}</p>
                    <p className={`text-xs capitalize ${getStatusColor(status)}`}>{status}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="h-5 w-5 text-green-500" />
              <h3 className="font-medium text-sm">Error Rate</h3>
            </div>
            <p className="text-2xl font-bold">{systemStatus.metrics.errorRate.toFixed(2)}%</p>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-sm">Auto Recovered</h3>
            </div>
            <p className="text-2xl font-bold">{systemStatus.metrics.recoveredErrors}</p>
            <p className="text-xs text-muted-foreground">Errors resolved automatically</p>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-5 w-5 text-secondary" />
              <h3 className="font-medium text-sm">Outages Prevented</h3>
            </div>
            <p className="text-2xl font-bold">{systemStatus.metrics.preventedOutages}</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-accent" />
              <h3 className="font-medium text-sm">Uptime</h3>
            </div>
            <p className="text-2xl font-bold">{systemStatus.metrics.uptime.toFixed(2)}%</p>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="errors" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="errors" className="ff-focus-ring">
            Active Errors ({unresolvedErrors.length})
          </TabsTrigger>
          <TabsTrigger value="recovery" className="ff-focus-ring">
            Recovery Actions
          </TabsTrigger>
          <TabsTrigger value="history" className="ff-focus-ring">
            Recovery History
          </TabsTrigger>
          <TabsTrigger value="prevention" className="ff-focus-ring">
            Prevention
          </TabsTrigger>
        </TabsList>

        <TabsContent value="errors" className="space-y-4">
          {unresolvedErrors.length === 0 ? (
            <Card className="ff-card-interactive">
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <h3 className="font-medium mb-2">No Active Errors</h3>
                <p className="text-muted-foreground">All systems are running smoothly!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {unresolvedErrors.map((error) => (
                <Card key={error.id} className="ff-card-interactive">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(error.severity)}>
                            {error.severity}
                          </Badge>
                          <Badge variant="outline">{error.type}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(error.context.timestamp).toLocaleString()}
                          </span>
                        </div>
                        
                        <h4 className="font-medium">{error.message}</h4>
                        
                        {error.context.component && (
                          <p className="text-sm text-muted-foreground">
                            Component: {error.context.component}
                          </p>
                        )}
                        
                        {error.stack && (
                          <details className="text-xs">
                            <summary className="cursor-pointer text-muted-foreground">
                              Stack trace
                            </summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                              {error.stack}
                            </pre>
                          </details>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAutomaticRecovery(error)}
                          disabled={activeRecoveries.length > 0}
                          className="ff-focus-ring"
                        >
                          <Wrench className="h-3 w-3 mr-1" />
                          Auto Recover
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setErrors(prev => prev.map(e => 
                              e.id === error.id ? { ...e, resolved: true } : e
                            ));
                          }}
                          className="ff-focus-ring"
                        >
                          Mark Resolved
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recovery" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recoveryActions.map((action) => {
              const Icon = action.icon;
              const isActive = activeRecoveries.includes(action.id);
              
              return (
                <Card key={action.id} className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        <Icon className={`h-6 w-6 ${isActive ? 'animate-spin' : ''}`} />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-medium">{action.name}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Success Rate: {action.successRate}%</span>
                            <span>~{action.estimatedTime}s</span>
                          </div>
                          <Progress value={action.successRate} className="h-2" />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant={action.automated ? 'default' : 'secondary'}>
                            {action.automated ? 'Automated' : 'Manual'}
                          </Badge>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => executeRecoveryAction(action)}
                            disabled={isActive}
                            className="ff-focus-ring ml-auto"
                          >
                            {isActive ? 'Running...' : 'Execute'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {recoveryHistory.length === 0 ? (
            <Card className="ff-card-interactive">
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">No Recovery History</h3>
                <p className="text-muted-foreground">Recovery actions will appear here when executed.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {recoveryHistory.map((recovery) => (
                <Card key={recovery.id} className="ff-card-interactive">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{recovery.actionName}</h4>
                          <Badge variant={recovery.success ? 'default' : 'destructive'}>
                            {recovery.success ? 'Success' : 'Failed'}
                          </Badge>
                          {recovery.errorType && (
                            <Badge variant="outline">{recovery.errorType}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Completed in {(recovery.duration / 1000).toFixed(1)}s
                        </p>
                      </div>
                      
                      <span className="text-xs text-muted-foreground">
                        {new Date(recovery.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="prevention" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="text-lg">Proactive Monitoring</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Global Error Handling</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Performance Monitoring</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Health Checks</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-Recovery</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="text-lg">Prevention Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Issues Prevented</span>
                    <span className="font-medium">{systemStatus.metrics.preventedOutages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Auto-Recoveries</span>
                    <span className="font-medium">{systemStatus.metrics.recoveredErrors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Detection Speed</span>
                    <span className="font-medium"><5s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Recovery Speed</span>
                    <span className="font-medium"><30s</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}