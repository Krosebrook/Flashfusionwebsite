import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Users, Zap, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Server, Clock, Shield, Cpu, HardDrive, Network } from 'lucide-react';
import { analyticsService } from '../../services/AnalyticsService';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  threshold: {
    warning: number;
    critical: number;
  };
  history: { timestamp: number; value: number }[];
}

interface UserMetrics {
  activeUsers: number;
  newSignups: number;
  conversionRate: number;
  onboardingCompletion: number;
  toolUsage: { tool: string; usage: number }[];
  userJourney: { step: string; completion: number; dropOff: number }[];
}

interface SystemHealth {
  uptime: number;
  responseTime: number;
  errorRate: number;
  throughput: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  databaseConnections: number;
  queueLength: number;
}

interface LaunchAlert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  timestamp: number;
  resolved: boolean;
  action?: string;
}

export function LaunchPerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [userMetrics, setUserMetrics] = useState<UserMetrics | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [alerts, setAlerts] = useState<LaunchAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  // Fetch performance data
  const fetchPerformanceData = useCallback(async () => {
    try {
      // Simulate real-time metrics (in production, this would fetch from your monitoring service)
      const mockMetrics: PerformanceMetric[] = [
        {
          id: 'response-time',
          name: 'Response Time',
          value: Math.random() * 100 + 50,
          unit: 'ms',
          status: 'good',
          trend: 'stable',
          threshold: { warning: 200, critical: 500 },
          history: Array.from({ length: 20 }, (_, i) => ({
            timestamp: Date.now() - (19 - i) * 60000,
            value: Math.random() * 50 + 70
          }))
        },
        {
          id: 'active-users',
          name: 'Active Users',
          value: Math.floor(Math.random() * 200) + 300,
          unit: 'users',
          status: 'good',
          trend: 'up',
          threshold: { warning: 400, critical: 600 },
          history: Array.from({ length: 20 }, (_, i) => ({
            timestamp: Date.now() - (19 - i) * 60000,
            value: Math.floor(Math.random() * 100) + 250 + i * 5
          }))
        },
        {
          id: 'error-rate',
          name: 'Error Rate',
          value: Math.random() * 2,
          unit: '%',
          status: 'good',
          trend: 'down',
          threshold: { warning: 2, critical: 5 },
          history: Array.from({ length: 20 }, (_, i) => ({
            timestamp: Date.now() - (19 - i) * 60000,
            value: Math.random() * 1.5
          }))
        },
        {
          id: 'throughput',
          name: 'Throughput',
          value: Math.floor(Math.random() * 1000) + 500,
          unit: 'req/min',
          status: 'good',
          trend: 'up',
          threshold: { warning: 800, critical: 1200 },
          history: Array.from({ length: 20 }, (_, i) => ({
            timestamp: Date.now() - (19 - i) * 60000,
            value: Math.floor(Math.random() * 200) + 400 + i * 10
          }))
        }
      ];

      // Update status based on thresholds
      mockMetrics.forEach(metric => {
        if (metric.value >= metric.threshold.critical) {
          metric.status = 'critical';
        } else if (metric.value >= metric.threshold.warning) {
          metric.status = 'warning';
        } else {
          metric.status = 'good';
        }
      });

      const mockUserMetrics: UserMetrics = {
        activeUsers: mockMetrics.find(m => m.id === 'active-users')?.value || 0,
        newSignups: Math.floor(Math.random() * 50) + 20,
        conversionRate: Math.random() * 30 + 65,
        onboardingCompletion: Math.random() * 20 + 75,
        toolUsage: [
          { tool: 'Full-Stack Builder', usage: Math.random() * 100 + 150 },
          { tool: 'Content Generator', usage: Math.random() * 80 + 100 },
          { tool: 'Multi-Agent Orchestration', usage: Math.random() * 60 + 80 },
          { tool: 'Brand Kit Generator', usage: Math.random() * 40 + 60 },
          { tool: 'Analytics Dashboard', usage: Math.random() * 30 + 40 }
        ],
        userJourney: [
          { step: 'Landing', completion: 100, dropOff: 0 },
          { step: 'Sign Up', completion: 85, dropOff: 15 },
          { step: 'Onboarding', completion: 72, dropOff: 13 },
          { step: 'First Tool Use', completion: 68, dropOff: 4 },
          { step: 'Second Session', completion: 45, dropOff: 23 },
          { step: 'Active User', completion: 38, dropOff: 7 }
        ]
      };

      const mockSystemHealth: SystemHealth = {
        uptime: 99.8,
        responseTime: mockMetrics.find(m => m.id === 'response-time')?.value || 0,
        errorRate: mockMetrics.find(m => m.id === 'error-rate')?.value || 0,
        throughput: mockMetrics.find(m => m.id === 'throughput')?.value || 0,
        cpuUsage: Math.random() * 30 + 20,
        memoryUsage: Math.random() * 40 + 40,
        diskUsage: Math.random() * 20 + 60,
        networkLatency: Math.random() * 20 + 10,
        databaseConnections: Math.floor(Math.random() * 50) + 20,
        queueLength: Math.floor(Math.random() * 10) + 5
      };

      const mockAlerts: LaunchAlert[] = [
        ...(mockMetrics.some(m => m.status === 'critical') ? [{
          id: 'critical-metric',
          severity: 'critical' as const,
          title: 'Critical Performance Alert',
          message: 'Response time exceeding critical threshold',
          timestamp: Date.now() - 300000,
          resolved: false,
          action: 'Scale infrastructure'
        }] : []),
        {
          id: 'high-traffic',
          severity: 'info' as const,
          title: 'High Traffic Volume',
          message: 'User activity is 40% above normal levels',
          timestamp: Date.now() - 600000,
          resolved: false
        }
      ];

      setMetrics(mockMetrics);
      setUserMetrics(mockUserMetrics);
      setSystemHealth(mockSystemHealth);
      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    fetchPerformanceData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchPerformanceData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, fetchPerformanceData]);

  const overallStatus = useMemo(() => {
    if (metrics.some(m => m.status === 'critical')) return 'critical';
    if (metrics.some(m => m.status === 'warning')) return 'warning';
    return 'good';
  }, [metrics]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return AlertTriangle;
      default: return Activity;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Activity;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="ff-fade-in-up">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ff-fade-in-up">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold ff-text-gradient">Launch Performance Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time monitoring for 500+ user stability
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge 
            variant={overallStatus === 'good' ? 'default' : 'destructive'}
            className={`${overallStatus === 'good' ? 'ff-badge-glow' : ''} font-medium`}
          >
            System {overallStatus === 'good' ? 'Healthy' : overallStatus === 'warning' ? 'Warning' : 'Critical'}
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`ff-focus-ring ${autoRefresh ? 'bg-primary/10' : ''}`}
          >
            <Activity className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-pulse' : ''}`} />
            Auto Refresh
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPerformanceData}
            className="ff-focus-ring"
          >
            Refresh Now
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {alerts.some(a => a.severity === 'critical' && !a.resolved) && (
        <Alert className="border-destructive bg-destructive/5">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-destructive">Critical Alerts Active</AlertTitle>
          <AlertDescription>
            {alerts.filter(a => a.severity === 'critical' && !a.resolved).length} critical issues require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const StatusIcon = getStatusIcon(metric.status);
          const TrendIcon = getTrendIcon(metric.trend);
          
          return (
            <Card key={metric.id} className="ff-card-interactive">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-muted ${getStatusColor(metric.status)}`}>
                    <StatusIcon className="h-5 w-5" />
                  </div>
                  <Badge 
                    variant={metric.status === 'good' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {metric.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-sm text-muted-foreground">{metric.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      {typeof metric.value === 'number' ? metric.value.toFixed(metric.unit === '%' ? 1 : 0) : metric.value}
                    </span>
                    <span className="text-sm text-muted-foreground">{metric.unit}</span>
                    <TrendIcon className={`h-4 w-4 ${
                      metric.trend === 'up' ? 'text-green-500' : 
                      metric.trend === 'down' ? 'text-red-500' : 
                      'text-muted-foreground'
                    }`} />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Warning: {metric.threshold.warning}{metric.unit}</span>
                      <span>Critical: {metric.threshold.critical}{metric.unit}</span>
                    </div>
                    <Progress 
                      value={(metric.value / metric.threshold.critical) * 100} 
                      className={`h-2 ${
                        metric.status === 'critical' ? 'bg-red-100' :
                        metric.status === 'warning' ? 'bg-yellow-100' : 
                        'bg-green-100'
                      }`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance" className="ff-focus-ring">Performance</TabsTrigger>
          <TabsTrigger value="users" className="ff-focus-ring">Users</TabsTrigger>
          <TabsTrigger value="system" className="ff-focus-ring">System Health</TabsTrigger>
          <TabsTrigger value="alerts" className="ff-focus-ring">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {metrics.map((metric) => (
              <Card key={metric.id} className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="text-lg">{metric.name} Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={metric.history}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                        stroke="rgba(255,255,255,0.5)"
                      />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleString()}
                        formatter={(value: number) => [`${value.toFixed(1)}${metric.unit}`, metric.name]}
                        contentStyle={{ 
                          backgroundColor: 'var(--ff-surface)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="var(--ff-primary)" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          {userMetrics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="text-lg">Tool Usage Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={userMetrics.toolUsage}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="tool" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        stroke="rgba(255,255,255,0.5)"
                      />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--ff-surface)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)'
                        }}
                      />
                      <Bar dataKey="usage" fill="var(--ff-primary)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="text-lg">User Journey Funnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userMetrics.userJourney.map((step, index) => (
                      <div key={step.step} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{step.step}</span>
                          <span className="text-muted-foreground">
                            {step.completion}% ({step.dropOff}% drop-off)
                          </span>
                        </div>
                        <div className="relative">
                          <Progress value={step.completion} className="h-3" />
                          {step.dropOff > 0 && (
                            <div className="absolute top-0 right-0 h-3 bg-red-500/20 rounded-r" 
                                 style={{ width: `${step.dropOff}%` }} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="ff-card-interactive lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">User Metrics Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center space-y-2">
                      <Users className="h-8 w-8 mx-auto text-primary" />
                      <div>
                        <p className="text-2xl font-bold">{userMetrics.activeUsers}</p>
                        <p className="text-sm text-muted-foreground">Active Users</p>
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <TrendingUp className="h-8 w-8 mx-auto text-green-500" />
                      <div>
                        <p className="text-2xl font-bold">{userMetrics.newSignups}</p>
                        <p className="text-sm text-muted-foreground">New Signups</p>
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <Zap className="h-8 w-8 mx-auto text-yellow-500" />
                      <div>
                        <p className="text-2xl font-bold">{userMetrics.conversionRate.toFixed(1)}%</p>
                        <p className="text-sm text-muted-foreground">Conversion Rate</p>
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <CheckCircle className="h-8 w-8 mx-auto text-blue-500" />
                      <div>
                        <p className="text-2xl font-bold">{userMetrics.onboardingCompletion.toFixed(1)}%</p>
                        <p className="text-sm text-muted-foreground">Onboarding Complete</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          {systemHealth && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="ff-card-interactive">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Server className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Server Health</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Uptime</span>
                      <span className="font-medium">{systemHealth.uptime}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Response Time</span>
                      <span className="font-medium">{systemHealth.responseTime.toFixed(0)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Error Rate</span>
                      <span className="font-medium">{systemHealth.errorRate.toFixed(2)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="ff-card-interactive">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Cpu className="h-5 w-5 text-secondary" />
                    <h3 className="font-medium">Resource Usage</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">CPU</span>
                        <span className="font-medium">{systemHealth.cpuUsage.toFixed(1)}%</span>
                      </div>
                      <Progress value={systemHealth.cpuUsage} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Memory</span>
                        <span className="font-medium">{systemHealth.memoryUsage.toFixed(1)}%</span>
                      </div>
                      <Progress value={systemHealth.memoryUsage} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Disk</span>
                        <span className="font-medium">{systemHealth.diskUsage.toFixed(1)}%</span>
                      </div>
                      <Progress value={systemHealth.diskUsage} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="ff-card-interactive">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Network className="h-5 w-5 text-accent" />
                    <h3 className="font-medium">Network & Database</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Network Latency</span>
                      <span className="font-medium">{systemHealth.networkLatency.toFixed(0)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">DB Connections</span>
                      <span className="font-medium">{systemHealth.databaseConnections}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Queue Length</span>
                      <span className="font-medium">{systemHealth.queueLength}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <Card className="ff-card-interactive">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <h3 className="font-medium mb-2">All Clear!</h3>
                  <p className="text-muted-foreground">No active alerts at this time.</p>
                </CardContent>
              </Card>
            ) : (
              alerts.map((alert) => (
                <Alert 
                  key={alert.id}
                  className={`${
                    alert.severity === 'critical' ? 'border-destructive bg-destructive/5' :
                    alert.severity === 'warning' ? 'border-yellow-500 bg-yellow-500/5' :
                    'border-blue-500 bg-blue-500/5'
                  }`}
                >
                  <AlertTriangle className={`h-4 w-4 ${
                    alert.severity === 'critical' ? 'text-destructive' :
                    alert.severity === 'warning' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`} />
                  <div className="flex-1">
                    <AlertTitle className="flex items-center justify-between">
                      {alert.title}
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {alert.severity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </AlertTitle>
                    <AlertDescription className="mt-2">
                      {alert.message}
                      {alert.action && (
                        <div className="mt-3">
                          <Button size="sm" variant="outline" className="ff-focus-ring">
                            {alert.action}
                          </Button>
                        </div>
                      )}
                    </AlertDescription>
                  </div>
                </Alert>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}