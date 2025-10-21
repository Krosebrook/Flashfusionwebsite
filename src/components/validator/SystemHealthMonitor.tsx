import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Monitor,
  RefreshCw,
  Shield,
  Eye,
  Zap,
  Settings,
  Download,
  Bell,
  Filter,
  XCircle,
  AlertTriangle,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Local imports
import type { SystemMetric, ErrorLog, PerformanceMetric, Incident, HealthScore } from './system-health/types';
import { 
  INITIAL_HEALTH_SCORE,
  INITIAL_SYSTEM_METRICS,
  INITIAL_ERROR_LOGS,
  INITIAL_PERFORMANCE_METRICS,
  INITIAL_INCIDENTS
} from './system-health/constants';
import { getScoreColor } from './system-health/utils';
import { 
  MetricCard,
  ErrorLogCard,
  PerformanceCard,
  IncidentCard,
  TrendsPlaceholder
} from './system-health/components';

export function SystemHealthMonitor() {
  const [isRunningHealthCheck, setIsRunningHealthCheck] = useState(false);
  const [healthProgress, setHealthProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [healthScore, setHealthScore] = useState<HealthScore>(INITIAL_HEALTH_SCORE);

  // Initialize data
  useEffect(() => {
    setSystemMetrics(INITIAL_SYSTEM_METRICS);
    setErrorLogs(INITIAL_ERROR_LOGS);
    setPerformanceMetrics(INITIAL_PERFORMANCE_METRICS);
    setIncidents(INITIAL_INCIDENTS);
  }, []);

  const runHealthCheck = async () => {
    setIsRunningHealthCheck(true);
    setHealthProgress(0);

    // Simulate health check process
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setHealthProgress(i);
    }

    // Update some results after check
    setSystemMetrics(prev => prev.map(metric => ({
      ...metric,
      lastUpdate: 'just now',
      value: metric.name === 'CPU Usage' ? 
        Math.max(10, Math.min(90, metric.value + Math.floor(Math.random() * 20) - 10)) :
        metric.value
    })));

    setHealthScore(prev => ({
      ...prev,
      overall: Math.min(100, prev.overall + Math.floor(Math.random() * 4) - 1)
    }));

    setIsRunningHealthCheck(false);
  };

  const criticalMetrics = systemMetrics.filter(metric => metric.status === 'critical').length;
  const warningMetrics = systemMetrics.filter(metric => metric.status === 'warning').length;
  const activeIncidents = incidents.filter(incident => incident.status !== 'resolved').length;
  const unresolvedErrors = errorLogs.filter(log => !log.resolved && log.level === 'error').length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-2">
          <Monitor className="w-8 h-8 text-primary" />
          <h1 className="ff-text-gradient">System Health Monitor</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Comprehensive observability with real-time monitoring, error tracking, performance analytics, and automated incident management.
        </p>
      </motion.div>

      {/* Health Score Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6"
      >
        <Card className="ff-card-interactive col-span-1 md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center">
                  <span className={`text-2xl font-bold ${getScoreColor(healthScore.overall)}`}>
                    {healthScore.overall}
                  </span>
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-primary" 
                     style={{ 
                       background: `conic-gradient(from 0deg, var(--ff-primary) 0deg, var(--ff-primary) ${healthScore.overall * 3.6}deg, transparent ${healthScore.overall * 3.6}deg)`
                     }}
                />
              </div>
              <div>
                <h3 className="font-medium">System Health</h3>
                <p className="text-sm text-muted-foreground">Overall system performance</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    Operational
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Issues</p>
                <p className="text-2xl font-bold text-red-500">{criticalMetrics}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <div className="mt-2">
              <Badge variant={criticalMetrics === 0 ? "outline" : "destructive"}>
                {criticalMetrics === 0 ? 'None' : 'Action Required'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Warnings</p>
                <p className="text-2xl font-bold text-yellow-500">{warningMetrics}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                Monitor
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Incidents</p>
                <p className="text-2xl font-bold text-secondary">{activeIncidents}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-secondary" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-blue-500 border-blue-500">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Errors</p>
                <p className="text-2xl font-bold text-red-500">{unresolvedErrors}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <div className="mt-2">
              <Badge variant={unresolvedErrors === 0 ? "outline" : "destructive"}>
                {unresolvedErrors === 0 ? 'Clean' : 'Needs Review'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-4"
      >
        <Button 
          onClick={runHealthCheck} 
          disabled={isRunningHealthCheck}
          className="ff-btn-primary"
          size="lg"
        >
          {isRunningHealthCheck ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Checking... {healthProgress}%
            </>
          ) : (
            <>
              <Shield className="w-5 h-5 mr-2" />
              Run Health Check
            </>
          )}
        </Button>

        <Button variant="outline" size="lg">
          <Zap className="w-5 h-5 mr-2" />
          Auto-Fix Issues
        </Button>

        <Button variant="outline" size="lg">
          <Bell className="w-5 h-5 mr-2" />
          Alert Settings
        </Button>

        <Button variant="outline" size="lg">
          <Download className="w-5 h-5 mr-2" />
          Export Report
        </Button>
      </motion.div>

      {/* Health Check Progress */}
      <AnimatePresence>
        {isRunningHealthCheck && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-primary/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Monitor className="w-5 h-5 text-primary animate-pulse" />
                    <span className="font-medium">Running Comprehensive Health Check</span>
                  </div>
                  <Progress value={healthProgress} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    Analyzing system metrics, error logs, and performance indicators...
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Metrics</TabsTrigger>
            <TabsTrigger value="errors">Error Logs</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="space-y-4">
              {systemMetrics.map((metric, index) => (
                <MetricCard key={metric.id} metric={metric} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="errors" className="space-y-6">
            <div className="space-y-4">
              {errorLogs.map((error, index) => (
                <ErrorLogCard key={error.id} error={error} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {performanceMetrics.map((metric, index) => (
                <PerformanceCard key={metric.id} metric={metric} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="incidents" className="space-y-6">
            <div className="space-y-4">
              {incidents.map((incident, index) => (
                <IncidentCard key={incident.id} incident={incident} index={index} />
              ))}

              {incidents.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No Active Incidents</h3>
                  <p className="text-muted-foreground">All systems are operating normally</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <TrendsPlaceholder />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}