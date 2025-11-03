import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Activity, 
  AlertTriangle, 
  Bell, 
  CheckCircle, 
  Database, 
  Globe, 
  Network,
  Server,
  Users,
  Zap,
  Clock,
  TrendingUp,
  TrendingDown,
  Shield,
  Cpu,
  HardDrive,
  Gauge,
  Eye,
  Settings,
  RefreshCw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { analyticsService } from '../../services/AnalyticsService';

interface MonitoringAlert {
  id: string;
  severity: 'info' | 'warning' | 'critical' | 'emergency';
  title: string;
  message: string;
  source: string;
  timestamp: number;
  acknowledged: boolean;
  resolved: boolean;
  resolvedAt?: number;
  metadata: Record<string, any>;
}

interface SystemMetric {
  timestamp: number;
  cpu: number;
  memory: number;
  disk: number;
  network: {
    inbound: number;
    outbound: number;
    latency: number;
  };
  database: {
    connections: number;
    queryTime: number;
    errorRate: number;
  };
  application: {
    responseTime: number;
    errorRate: number;
    throughput: number;
    activeUsers: number;
  };
}

interface UptimeStatus {
  component: string;
  status: 'up' | 'down' | 'degraded';
  uptime: number;
  lastCheck: number;
  responseTime: number;
  errorCount: number;
  region: string;
}

interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  severity: MonitoringAlert['severity'];
  enabled: boolean;
  channels: ('email' | 'slack' | 'webhook' | 'sms')[];
  cooldown: number; // minutes
  lastTriggered?: number;
}

interface PerformanceBenchmark {
  metric: string;
  current: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

const DEFAULT_ALERT_RULES: AlertRule[] = [
  {
    id: 'high-cpu',
    name: 'High CPU Usage',
    condition: 'cpu > threshold',
    threshold: 85,
    severity: 'warning',
    enabled: true,
    channels: ['email', 'slack'],
    cooldown: 15
  },
  {
    id: 'critical-cpu',
    name: 'Critical CPU Usage',
    condition: 'cpu > threshold',
    threshold: 95,
    severity: 'critical',
    enabled: true,
    channels: ['email', 'slack', 'sms'],
    cooldown: 5
  },
  {
    id: 'high-memory',
    name: 'High Memory Usage',
    condition: 'memory > threshold',
    threshold: 80,
    severity: 'warning',
    enabled: true,
    channels: ['email', 'slack'],
    cooldown: 15
  },
  {
    id: 'slow-response',
    name: 'Slow Response Time',
    condition: 'responseTime > threshold',
    threshold: 500,
    severity: 'warning',
    enabled: true,
    channels: ['email'],
    cooldown: 10
  },
  {
    id: 'high-error-rate',
    name: 'High Error Rate',
    condition: 'errorRate > threshold',
    threshold: 5,
    severity: 'critical',
    enabled: true,
    channels: ['email', 'slack', 'webhook'],
    cooldown: 5
  },
  {
    id: 'database-slow',
    name: 'Database Performance',
    condition: 'db_queryTime > threshold',
    threshold: 1000,
    severity: 'warning',
    enabled: true,
    channels: ['email', 'slack'],
    cooldown: 10
  }
];

export function AdvancedMonitoringSystem() {
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [uptimeStatus, setUptimeStatus] = useState<UptimeStatus[]>([]);
  const [alertRules, setAlertRules] = useState<AlertRule[]>(DEFAULT_ALERT_RULES);
  const [performanceBenchmarks, setPerformanceBenchmarks] = useState<PerformanceBenchmark[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize monitoring data
  useEffect(() => {
    const initializeMonitoring = async () => {
      try {
        // Initialize uptime status
        const initialUptime: UptimeStatus[] = [
          {
            component: 'Frontend Application',
            status: 'up',
            uptime: 99.9,
            lastCheck: Date.now(),
            responseTime: 120,
            errorCount: 0,
            region: 'Global CDN'
          },
          {
            component: 'Backend API',
            status: 'up',
            uptime: 99.8,
            lastCheck: Date.now(),
            responseTime: 85,
            errorCount: 0,
            region: 'US-East-1'
          },
          {
            component: 'Database',
            status: 'up',
            uptime: 99.95,
            lastCheck: Date.now(),
            responseTime: 15,
            errorCount: 0,
            region: 'US-East-1'
          },
          {
            component: 'File Storage',
            status: 'up',
            uptime: 100,
            lastCheck: Date.now(),
            responseTime: 45,
            errorCount: 0,
            region: 'Multi-Region'
          },
          {
            component: 'Authentication',
            status: 'up',
            uptime: 99.7,
            lastCheck: Date.now(),
            responseTime: 95,
            errorCount: 0,
            region: 'Global'
          }
        ];

        // Initialize performance benchmarks
        const initialBenchmarks: PerformanceBenchmark[] = [
          {
            metric: 'Response Time',
            current: 125,
            target: 200,
            trend: 'stable',
            status: 'good'
          },
          {
            metric: 'Error Rate',
            current: 0.8,
            target: 1.0,
            trend: 'down',
            status: 'good'
          },
          {
            metric: 'Throughput',
            current: 850,
            target: 1000,
            trend: 'up',
            status: 'good'
          },
          {
            metric: 'CPU Usage',
            current: 45,
            target: 70,
            trend: 'stable',
            status: 'good'
          },
          {
            metric: 'Memory Usage',
            current: 68,
            target: 80,
            trend: 'up',
            status: 'warning'
          },
          {
            metric: 'Database Connections',
            current: 25,
            target: 100,
            trend: 'stable',
            status: 'good'
          }
        ];

        // Generate initial metrics
        const initialMetrics: SystemMetric[] = Array.from({ length: 20 }, (_, i) => ({
          timestamp: Date.now() - (19 - i) * 60000,
          cpu: Math.random() * 30 + 40,
          memory: Math.random() * 20 + 60,
          disk: Math.random() * 10 + 70,
          network: {
            inbound: Math.random() * 100 + 50,
            outbound: Math.random() * 80 + 40,
            latency: Math.random() * 20 + 10
          },
          database: {
            connections: Math.floor(Math.random() * 20) + 20,
            queryTime: Math.random() * 100 + 50,
            errorRate: Math.random() * 1
          },
          application: {
            responseTime: Math.random() * 50 + 100,
            errorRate: Math.random() * 2,
            throughput: Math.random() * 200 + 800,
            activeUsers: Math.floor(Math.random() * 100) + 300
          }
        }));

        setUptimeStatus(initialUptime);
        setPerformanceBenchmarks(initialBenchmarks);
        setSystemMetrics(initialMetrics);

      } catch (error) {
        console.error('Failed to initialize monitoring:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeMonitoring();
  }, []);

  // Real-time monitoring loop
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      // Generate new system metrics
      const newMetric: SystemMetric = {
        timestamp: Date.now(),
        cpu: Math.max(0, Math.min(100, systemMetrics[systemMetrics.length - 1]?.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(0, Math.min(100, systemMetrics[systemMetrics.length - 1]?.memory + (Math.random() - 0.5) * 5)),
        disk: Math.max(0, Math.min(100, 70 + Math.random() * 15)),
        network: {
          inbound: Math.random() * 150 + 50,
          outbound: Math.random() * 120 + 40,
          latency: Math.random() * 30 + 10
        },
        database: {
          connections: Math.floor(Math.random() * 30) + 15,
          queryTime: Math.random() * 150 + 50,
          errorRate: Math.random() * 2
        },
        application: {
          responseTime: Math.random() * 100 + 80,
          errorRate: Math.random() * 3,
          throughput: Math.random() * 300 + 700,
          activeUsers: Math.floor(Math.random() * 200) + 250
        }
      };

      setSystemMetrics(prev => [...prev.slice(-19), newMetric]);

      // Check alert rules
      alertRules.forEach(rule => {
        if (!rule.enabled) return;
        
        const now = Date.now();
        if (rule.lastTriggered && now - rule.lastTriggered < rule.cooldown * 60000) {
          return; // Still in cooldown
        }

        let shouldAlert = false;
        let currentValue = 0;

        switch (rule.condition.split(' ')[0]) {
          case 'cpu':
            currentValue = newMetric.cpu;
            shouldAlert = currentValue > rule.threshold;
            break;
          case 'memory':
            currentValue = newMetric.memory;
            shouldAlert = currentValue > rule.threshold;
            break;
          case 'responseTime':
            currentValue = newMetric.application.responseTime;
            shouldAlert = currentValue > rule.threshold;
            break;
          case 'errorRate':
            currentValue = newMetric.application.errorRate;
            shouldAlert = currentValue > rule.threshold;
            break;
          case 'db_queryTime':
            currentValue = newMetric.database.queryTime;
            shouldAlert = currentValue > rule.threshold;
            break;
        }

        if (shouldAlert) {
          const alert: MonitoringAlert = {
            id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            severity: rule.severity,
            title: rule.name,
            message: `${rule.condition.split(' ')[0]} is ${currentValue.toFixed(1)} (threshold: ${rule.threshold})`,
            source: 'monitoring-system',
            timestamp: now,
            acknowledged: false,
            resolved: false,
            metadata: {
              rule: rule.id,
              value: currentValue,
              threshold: rule.threshold
            }
          };

          setAlerts(prev => [alert, ...prev.slice(0, 49)]);
          
          // Update rule last triggered
          setAlertRules(prevRules => prevRules.map(r => 
            r.id === rule.id ? { ...r, lastTriggered: now } : r
          ));

          // Play sound if enabled
          if (soundEnabled && (rule.severity === 'critical' || rule.severity === 'emergency')) {
            // Would play alert sound in production
            console.log('🚨 Critical alert sound');
          }

          // Show toast notification
          const toastMessage = `${rule.name}: ${currentValue.toFixed(1)} > ${rule.threshold}`;
          if (rule.severity === 'critical' || rule.severity === 'emergency') {
            toast.error(toastMessage);
          } else {
            toast.warning(toastMessage);
          }

          // Track alert in analytics
          analyticsService.trackError('monitoring-alert', rule.name, {
            severity: rule.severity,
            value: currentValue,
            threshold: rule.threshold
          });
        }
      });

      // Update uptime status
      setUptimeStatus(prev => prev.map(status => ({
        ...status,
        lastCheck: now,
        uptime: Math.max(95, status.uptime + (Math.random() - 0.01) * 0.1),
        responseTime: Math.max(10, status.responseTime + (Math.random() - 0.5) * 10),
        status: Math.random() > 0.99 ? 'degraded' : 'up'
      })));

      // Update performance benchmarks
      setPerformanceBenchmarks(prev => prev.map(benchmark => {
        const change = (Math.random() - 0.5) * (benchmark.current * 0.1);
        const newValue = Math.max(0, benchmark.current + change);
        
        let status: PerformanceBenchmark['status'] = 'good';
        if (newValue > benchmark.target) {
          status = benchmark.metric === 'Error Rate' ? 'critical' : 'warning';
        } else if (newValue > benchmark.target * 0.8) {
          status = 'warning';
        }

        let trend: PerformanceBenchmark['trend'] = 'stable';
        if (Math.abs(change) > benchmark.current * 0.05) {
          trend = change > 0 ? 'up' : 'down';
        }

        return {
          ...benchmark,
          current: newValue,
          trend,
          status
        };
      }));

    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [isMonitoring, refreshInterval, alertRules, soundEnabled, systemMetrics]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
    toast.success('Alert acknowledged');
  }, []);

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { 
        ...alert, 
        resolved: true, 
        resolvedAt: Date.now() 
      } : alert
    ));
    toast.success('Alert resolved');
  }, []);

  const toggleAlertRule = useCallback((ruleId: string) => {
    setAlertRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  }, []);

  const currentMetrics = systemMetrics[systemMetrics.length - 1];
  const activeAlerts = alerts.filter(alert => !alert.resolved);
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical' || alert.severity === 'emergency');
  const overallUptime = uptimeStatus.reduce((sum, status) => sum + status.uptime, 0) / uptimeStatus.length;

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold ff-text-gradient">Advanced Monitoring System</h1>
          <p className="text-muted-foreground">
            Real-time system monitoring with intelligent alerting for 500+ user stability
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge 
            variant={overallUptime >= 99.5 ? 'default' : overallUptime >= 99 ? 'secondary' : 'destructive'}
            className={`font-medium ${overallUptime >= 99.5 ? 'ff-badge-glow' : ''}`}
          >
            <Activity className={`h-3 w-3 mr-1 ${isMonitoring ? 'animate-pulse' : ''}`} />
            {overallUptime.toFixed(2)}% Uptime
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`ff-focus-ring ${soundEnabled ? 'bg-primary/10' : ''}`}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`ff-focus-ring ${isMonitoring ? 'bg-secondary/10' : ''}`}
          >
            {isMonitoring ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isMonitoring ? 'Pause' : 'Resume'}
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Alert className="border-destructive bg-destructive/5">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-destructive">Critical Alerts Active</AlertTitle>
          <AlertDescription>
            {criticalAlerts.length} critical alert{criticalAlerts.length === 1 ? '' : 's'} require immediate attention.
            <div className="mt-3 space-x-2">
              {criticalAlerts.slice(0, 2).map(alert => (
                <Button 
                  key={alert.id}
                  size="sm" 
                  variant="destructive"
                  onClick={() => acknowledgeAlert(alert.id)}
                >
                  Acknowledge: {alert.title}
                </Button>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium">System Health</h3>
            </div>
            <p className={`text-2xl font-bold ${overallUptime >= 99.5 ? 'text-green-500' : overallUptime >= 99 ? 'text-yellow-500' : 'text-red-500'}`}>
              {overallUptime.toFixed(2)}%
            </p>
            <p className="text-sm text-muted-foreground">
              {uptimeStatus.filter(s => s.status === 'up').length}/{uptimeStatus.length} services up
            </p>
          </CardContent>
        </Card>

        {currentMetrics && (
          <>
            <Card className="ff-card-interactive">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Users className="h-5 w-5 text-secondary" />
                  </div>
                  <h3 className="font-medium">Active Users</h3>
                </div>
                <p className="text-2xl font-bold">{currentMetrics.application.activeUsers}</p>
                <p className="text-sm text-muted-foreground">
                  {currentMetrics.application.throughput.toFixed(0)} req/min
                </p>
              </CardContent>
            </Card>

            <Card className="ff-card-interactive">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Zap className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-medium">Response Time</h3>
                </div>
                <p className={`text-2xl font-bold ${currentMetrics.application.responseTime > 500 ? 'text-red-500' : currentMetrics.application.responseTime > 200 ? 'text-yellow-500' : 'text-green-500'}`}>
                  {currentMetrics.application.responseTime.toFixed(0)}ms
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentMetrics.application.errorRate.toFixed(2)}% error rate
                </p>
              </CardContent>
            </Card>

            <Card className="ff-card-interactive">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <Cpu className="h-5 w-5 text-green-500" />
                  </div>
                  <h3 className="font-medium">CPU Usage</h3>
                </div>
                <p className={`text-2xl font-bold ${currentMetrics.cpu > 85 ? 'text-red-500' : currentMetrics.cpu > 70 ? 'text-yellow-500' : 'text-green-500'}`}>
                  {currentMetrics.cpu.toFixed(0)}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentMetrics.memory.toFixed(0)}% memory
                </p>
              </CardContent>
            </Card>
          </>
        )}

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Bell className="h-5 w-5 text-yellow-500" />
              </div>
              <h3 className="font-medium">Active Alerts</h3>
            </div>
            <p className={`text-2xl font-bold ${activeAlerts.length > 5 ? 'text-red-500' : activeAlerts.length > 0 ? 'text-yellow-500' : 'text-green-500'}`}>
              {activeAlerts.length}
            </p>
            <p className="text-sm text-muted-foreground">
              {criticalAlerts.length} critical
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="ff-focus-ring">
            System Overview
          </TabsTrigger>
          <TabsTrigger value="alerts" className="ff-focus-ring">
            Alerts ({activeAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="metrics" className="ff-focus-ring">
            Live Metrics
          </TabsTrigger>
          <TabsTrigger value="uptime" className="ff-focus-ring">
            Service Uptime
          </TabsTrigger>
          <TabsTrigger value="settings" className="ff-focus-ring">
            Alert Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="space-y-6">
            {/* Performance Benchmarks */}
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="text-lg">Performance Benchmarks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {performanceBenchmarks.map((benchmark) => (
                    <div key={benchmark.metric} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{benchmark.metric}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            benchmark.status === 'good' ? 'default' :
                            benchmark.status === 'warning' ? 'secondary' :
                            'destructive'
                          }>
                            {benchmark.status}
                          </Badge>
                          {benchmark.trend === 'up' ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : benchmark.trend === 'down' ? (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          ) : (
                            <Activity className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Current: {benchmark.current.toFixed(1)}</span>
                          <span>Target: {benchmark.target}</span>
                        </div>
                        <Progress value={(benchmark.current / benchmark.target) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Real-time Charts */}
            {systemMetrics.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="ff-card-interactive">
                  <CardHeader>
                    <CardTitle className="text-lg">System Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={systemMetrics.slice(-10)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis 
                          dataKey="timestamp" 
                          tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                          stroke="rgba(255,255,255,0.5)"
                        />
                        <YAxis stroke="rgba(255,255,255,0.5)" />
                        <Tooltip 
                          labelFormatter={(value) => new Date(value).toLocaleString()}
                          contentStyle={{ 
                            backgroundColor: 'var(--ff-surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)'
                          }}
                        />
                        <Line type="monotone" dataKey="cpu" stroke="var(--ff-primary)" name="CPU %" strokeWidth={2} />
                        <Line type="monotone" dataKey="memory" stroke="var(--ff-secondary)" name="Memory %" strokeWidth={2} />
                        <Line type="monotone" dataKey="disk" stroke="var(--ff-accent)" name="Disk %" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="ff-card-interactive">
                  <CardHeader>
                    <CardTitle className="text-lg">Application Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={systemMetrics.slice(-10)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis 
                          dataKey="timestamp" 
                          tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                          stroke="rgba(255,255,255,0.5)"
                        />
                        <YAxis stroke="rgba(255,255,255,0.5)" />
                        <Tooltip 
                          labelFormatter={(value) => new Date(value).toLocaleString()}
                          contentStyle={{ 
                            backgroundColor: 'var(--ff-surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)'
                          }}
                        />
                        <Area type="monotone" dataKey="application.responseTime" stackId="1" stroke="var(--ff-primary)" fill="var(--ff-primary)" fillOpacity={0.3} name="Response Time (ms)" />
                        <Area type="monotone" dataKey="application.errorRate" stackId="2" stroke="var(--ff-error)" fill="var(--ff-error)" fillOpacity={0.3} name="Error Rate %" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="space-y-3">
            {activeAlerts.length === 0 ? (
              <Card className="ff-card-interactive">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <h3 className="font-medium mb-2">No Active Alerts</h3>
                  <p className="text-muted-foreground">All systems are operating normally.</p>
                </CardContent>
              </Card>
            ) : (
              activeAlerts.map((alert) => (
                <Card key={alert.id} className={`ff-card-interactive ${
                  alert.severity === 'critical' || alert.severity === 'emergency' ? 'border-red-500/30 bg-red-500/5' :
                  alert.severity === 'warning' ? 'border-yellow-500/30 bg-yellow-500/5' :
                  'border-blue-500/30 bg-blue-500/5'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            alert.severity === 'critical' || alert.severity === 'emergency' ? 'bg-red-500/10' :
                            alert.severity === 'warning' ? 'bg-yellow-500/10' :
                            'bg-blue-500/10'
                          }`}>
                            <AlertTriangle className={`h-5 w-5 ${
                              alert.severity === 'critical' || alert.severity === 'emergency' ? 'text-red-500' :
                              alert.severity === 'warning' ? 'text-yellow-500' :
                              'text-blue-500'
                            }`} />
                          </div>
                          
                          <div>
                            <h4 className="font-medium">{alert.title}</h4>
                            <p className="text-sm text-muted-foreground">{alert.message}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Source: {alert.source}</span>
                          <span>•</span>
                          <span>{new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant={
                          alert.severity === 'critical' || alert.severity === 'emergency' ? 'destructive' :
                          alert.severity === 'warning' ? 'secondary' :
                          'default'
                        }>
                          {alert.severity}
                        </Badge>
                        
                        {!alert.acknowledged && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="ff-focus-ring"
                          >
                            Acknowledge
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resolveAlert(alert.id)}
                          className="ff-focus-ring"
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Live System Metrics</h3>
            <div className="flex items-center gap-3">
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-32 ff-focus-ring">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15m">15 minutes</SelectItem>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="6h">6 hours</SelectItem>
                  <SelectItem value="24h">24 hours</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={refreshInterval.toString()} onValueChange={(value) => setRefreshInterval(parseInt(value))}>
                <SelectTrigger className="w-32 ff-focus-ring">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                  <SelectItem value="300">5 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {currentMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-primary" />
                    System Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">CPU Usage</span>
                        <span className="text-sm font-medium">{currentMetrics.cpu.toFixed(1)}%</span>
                      </div>
                      <Progress value={currentMetrics.cpu} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Memory Usage</span>
                        <span className="text-sm font-medium">{currentMetrics.memory.toFixed(1)}%</span>
                      </div>
                      <Progress value={currentMetrics.memory} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Disk Usage</span>
                        <span className="text-sm font-medium">{currentMetrics.disk.toFixed(1)}%</span>
                      </div>
                      <Progress value={currentMetrics.disk} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Network className="h-5 w-5 text-secondary" />
                    Network
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Inbound</span>
                      <span className="font-medium">{currentMetrics.network.inbound.toFixed(0)} MB/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Outbound</span>
                      <span className="font-medium">{currentMetrics.network.outbound.toFixed(0)} MB/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Latency</span>
                      <span className="font-medium">{currentMetrics.network.latency.toFixed(0)}ms</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Database className="h-5 w-5 text-accent" />
                    Database
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Connections</span>
                      <span className="font-medium">{currentMetrics.database.connections}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Query Time</span>
                      <span className="font-medium">{currentMetrics.database.queryTime.toFixed(0)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Error Rate</span>
                      <span className={`font-medium ${currentMetrics.database.errorRate > 2 ? 'text-red-500' : 'text-green-500'}`}>
                        {currentMetrics.database.errorRate.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="uptime" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uptimeStatus.map((status) => (
              <Card key={status.component} className={`ff-card-interactive ${
                status.status === 'up' ? 'border-green-500/20 bg-green-500/5' :
                status.status === 'degraded' ? 'border-yellow-500/20 bg-yellow-500/5' :
                'border-red-500/20 bg-red-500/5'
              }`}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{status.component}</h4>
                      <Badge variant={
                        status.status === 'up' ? 'default' :
                        status.status === 'degraded' ? 'secondary' :
                        'destructive'
                      }>
                        {status.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Uptime:</span>
                        <span className="font-medium">{status.uptime.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Response Time:</span>
                        <span className="font-medium">{status.responseTime.toFixed(0)}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Region:</span>
                        <span className="font-medium">{status.region}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Check:</span>
                        <span className="font-medium">{new Date(status.lastCheck).toLocaleTimeString()}</span>
                      </div>
                      {status.errorCount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Errors:</span>
                          <span className="font-medium text-red-500">{status.errorCount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Alert Rules Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Configure automated alerts for system monitoring
              </p>
            </div>

            <div className="space-y-3">
              {alertRules.map((rule) => (
                <Card key={rule.id} className={`ff-card-interactive ${rule.enabled ? 'border-primary/20' : 'border-muted'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{rule.name}</h4>
                          <Badge variant={
                            rule.severity === 'critical' || rule.severity === 'emergency' ? 'destructive' :
                            rule.severity === 'warning' ? 'secondary' :
                            'default'
                          }>
                            {rule.severity}
                          </Badge>
                          <Badge variant={rule.enabled ? 'default' : 'secondary'} className="text-xs">
                            {rule.enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {rule.condition} {rule.threshold} • Cooldown: {rule.cooldown}min
                        </p>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Channels:</span>
                          {rule.channels.map(channel => (
                            <Badge key={channel} variant="outline" className="text-xs">
                              {channel}
                            </Badge>
                          ))}
                        </div>
                        
                        {rule.lastTriggered && (
                          <p className="text-xs text-muted-foreground">
                            Last triggered: {new Date(rule.lastTriggered).toLocaleString()}
                          </p>
                        )}
                      </div>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleAlertRule(rule.id)}
                        className="ff-focus-ring"
                      >
                        {rule.enabled ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}