/**
 * @fileoverview Automated Regression Testing System
 * @category Testing Infrastructure
 * @version 1.0.0
 * 
 * Automated performance regression detection, baseline comparison,
 * and continuous performance validation across builds.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  GitCommit,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  BarChart3,
  Settings,
  Play,
  Pause,
  FastForward,
  Calendar,
  Database,
  Target,
  Zap,
  Shield
} from 'lucide-react';

// Regression test configuration
interface RegressionTest {
  id: string;
  name: string;
  category: 'performance' | 'functional' | 'visual' | 'accessibility';
  description: string;
  baseline: number;
  threshold: number; // Percentage degradation threshold
  metric: string;
  unit: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  frequency: 'every-commit' | 'daily' | 'weekly';
}

interface TestRun {
  id: string;
  timestamp: Date;
  buildId: string;
  commitHash: string;
  branch: string;
  environment: 'development' | 'staging' | 'production';
  results: Map<string, TestResult>;
  overallStatus: 'pass' | 'fail' | 'warning';
  duration: number;
}

interface TestResult {
  testId: string;
  value: number;
  baseline: number;
  threshold: number;
  degradation: number; // Percentage change from baseline
  status: 'pass' | 'fail' | 'warning';
  trend: 'improving' | 'degrading' | 'stable';
  history: number[];
}

interface RegressionAlert {
  id: string;
  testId: string;
  severity: 'critical' | 'warning';
  message: string;
  timestamp: Date;
  buildId: string;
  degradation: number;
  acknowledged: boolean;
}

// Regression test definitions
const REGRESSION_TESTS: RegressionTest[] = [
  // Performance Tests
  {
    id: 'perf-page-load',
    name: 'Page Load Time',
    category: 'performance',
    description: 'Homepage initial load time',
    baseline: 1200,
    threshold: 15, // 15% degradation threshold
    metric: 'load-time',
    unit: 'ms',
    priority: 'critical',
    frequency: 'every-commit'
  },
  {
    id: 'perf-app-init',
    name: 'App Initialization',
    category: 'performance',
    description: 'Time to app interactive state',
    baseline: 1800,
    threshold: 20,
    metric: 'tti',
    unit: 'ms',
    priority: 'critical',
    frequency: 'every-commit'
  },
  {
    id: 'perf-bundle-size',
    name: 'Bundle Size',
    category: 'performance',
    description: 'Initial JavaScript bundle size',
    baseline: 250,
    threshold: 10,
    metric: 'bundle-size',
    unit: 'KB',
    priority: 'high',
    frequency: 'every-commit'
  },
  {
    id: 'perf-memory-usage',
    name: 'Memory Usage',
    category: 'performance',
    description: 'Peak memory consumption',
    baseline: 45,
    threshold: 25,
    metric: 'memory-peak',
    unit: 'MB',
    priority: 'high',
    frequency: 'daily'
  },
  {
    id: 'perf-ai-tool-response',
    name: 'AI Tool Response Time',
    category: 'performance',
    description: 'Average AI tool response time',
    baseline: 3000,
    threshold: 30,
    metric: 'ai-response-time',
    unit: 'ms',
    priority: 'critical',
    frequency: 'every-commit'
  },
  
  // Functional Tests
  {
    id: 'func-auth-flow',
    name: 'Authentication Flow',
    category: 'functional',
    description: 'Login/signup success rate',
    baseline: 99.5,
    threshold: 1,
    metric: 'success-rate',
    unit: '%',
    priority: 'critical',
    frequency: 'every-commit'
  },
  {
    id: 'func-tool-execution',
    name: 'Tool Execution Success',
    category: 'functional',
    description: 'AI tool execution success rate',
    baseline: 98.0,
    threshold: 2,
    metric: 'success-rate',
    unit: '%',
    priority: 'critical',
    frequency: 'every-commit'
  },
  
  // Visual Tests
  {
    id: 'visual-layout-stability',
    name: 'Layout Stability',
    category: 'visual',
    description: 'Cumulative Layout Shift score',
    baseline: 0.05,
    threshold: 50,
    metric: 'cls',
    unit: 'score',
    priority: 'medium',
    frequency: 'daily'
  },
  
  // Accessibility Tests
  {
    id: 'a11y-compliance',
    name: 'Accessibility Compliance',
    category: 'accessibility',
    description: 'WCAG 2.1 AA compliance score',
    baseline: 95,
    threshold: 5,
    metric: 'a11y-score',
    unit: '%',
    priority: 'high',
    frequency: 'daily'
  }
];

/**
 * Automated Regression Testing System
 */
export const AutomatedRegressionTester: React.FC = () => {
  const [testRuns, setTestRuns] = useState<TestRun[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedBuild, setSelectedBuild] = useState<string | null>(null);
  const [regressionAlerts, setRegressionAlerts] = useState<RegressionAlert[]>([]);
  const [autoRun, setAutoRun] = useState(false);

  // Generate mock test history
  useEffect(() => {
    const mockTestRuns: TestRun[] = [];
    const now = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const buildId = `build-${(30 - i).toString().padStart(3, '0')}`;
      const commitHash = Math.random().toString(36).substr(2, 8);
      
      const results = new Map<string, TestResult>();
      let passCount = 0;
      let failCount = 0;
      
      REGRESSION_TESTS.forEach(test => {
        // Simulate performance variation
        const variation = (Math.random() - 0.5) * 0.4; // ±20% variation
        const value = test.baseline * (1 + variation);
        const degradation = ((value - test.baseline) / test.baseline) * 100;
        
        let status: 'pass' | 'fail' | 'warning';
        if (Math.abs(degradation) <= test.threshold / 2) {
          status = 'pass';
          passCount++;
        } else if (Math.abs(degradation) <= test.threshold) {
          status = 'warning';
        } else {
          status = 'fail';
          failCount++;
        }
        
        results.set(test.id, {
          testId: test.id,
          value,
          baseline: test.baseline,
          threshold: test.threshold,
          degradation,
          status,
          trend: degradation > 0 ? 'degrading' : degradation < 0 ? 'improving' : 'stable',
          history: []
        });
      });
      
      mockTestRuns.push({
        id: buildId,
        timestamp,
        buildId,
        commitHash,
        branch: 'main',
        environment: 'production',
        results,
        overallStatus: failCount > 0 ? 'fail' : 'pass',
        duration: Math.floor(Math.random() * 300) + 60 // 1-6 minutes
      });
    }
    
    setTestRuns(mockTestRuns.reverse());
  }, []);

  // Generate regression alerts
  useEffect(() => {
    const alerts: RegressionAlert[] = [];
    
    testRuns.slice(-5).forEach(run => {
      run.results.forEach((result, testId) => {
        const test = REGRESSION_TESTS.find(t => t.id === testId);
        if (result.status === 'fail' && test) {
          alerts.push({
            id: `alert-${run.buildId}-${testId}`,
            testId,
            severity: test.priority === 'critical' ? 'critical' : 'warning',
            message: `${test.name} degraded by ${result.degradation.toFixed(1)}% (threshold: ${test.threshold}%)`,
            timestamp: run.timestamp,
            buildId: run.buildId,
            degradation: result.degradation,
            acknowledged: Math.random() > 0.7 // 30% acknowledged
          });
        }
      });
    });
    
    setRegressionAlerts(alerts);
  }, [testRuns]);

  // Calculate statistics
  const statistics = useMemo(() => {
    if (testRuns.length === 0) return null;
    
    const latestRun = testRuns[testRuns.length - 1];
    const totalTests = REGRESSION_TESTS.length;
    
    let passCount = 0;
    let failCount = 0;
    let warningCount = 0;
    
    latestRun.results.forEach(result => {
      if (result.status === 'pass') passCount++;
      else if (result.status === 'fail') failCount++;
      else warningCount++;
    });
    
    const passRate = (passCount / totalTests) * 100;
    const avgDuration = testRuns.slice(-7).reduce((sum, run) => sum + run.duration, 0) / Math.min(7, testRuns.length);
    
    return {
      totalTests,
      passCount,
      failCount,
      warningCount,
      passRate,
      avgDuration,
      latestBuild: latestRun.buildId,
      unacknowledgedAlerts: regressionAlerts.filter(a => !a.acknowledged).length
    };
  }, [testRuns, regressionAlerts]);

  // Run regression tests
  const runRegressionTests = useCallback(async () => {
    setIsRunning(true);
    
    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newRun: TestRun = {
      id: `build-${Date.now()}`,
      timestamp: new Date(),
      buildId: `build-${(testRuns.length + 1).toString().padStart(3, '0')}`,
      commitHash: Math.random().toString(36).substr(2, 8),
      branch: 'main',
      environment: 'production',
      results: new Map(),
      overallStatus: 'pass',
      duration: Math.floor(Math.random() * 180) + 120
    };
    
    const results = new Map<string, TestResult>();
    let hasFailures = false;
    
    REGRESSION_TESTS.forEach(test => {
      const variation = (Math.random() - 0.5) * 0.3;
      const value = test.baseline * (1 + variation);
      const degradation = ((value - test.baseline) / test.baseline) * 100;
      
      let status: 'pass' | 'fail' | 'warning';
      if (Math.abs(degradation) <= test.threshold / 2) {
        status = 'pass';
      } else if (Math.abs(degradation) <= test.threshold) {
        status = 'warning';
      } else {
        status = 'fail';
        hasFailures = true;
      }
      
      results.set(test.id, {
        testId: test.id,
        value,
        baseline: test.baseline,
        threshold: test.threshold,
        degradation,
        status,
        trend: degradation > 0 ? 'degrading' : degradation < 0 ? 'improving' : 'stable',
        history: []
      });
    });
    
    newRun.results = results;
    newRun.overallStatus = hasFailures ? 'fail' : 'pass';
    
    setTestRuns(prev => [...prev, newRun]);
    setIsRunning(false);
  }, [testRuns]);

  // Auto-run effect
  useEffect(() => {
    if (!autoRun) return;
    
    const interval = setInterval(() => {
      if (!isRunning) {
        runRegressionTests();
      }
    }, 60000); // Run every minute when auto-run is enabled
    
    return () => clearInterval(interval);
  }, [autoRun, isRunning, runRegressionTests]);

  // Acknowledge alert
  const acknowledgeAlert = useCallback((alertId: string) => {
    setRegressionAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  }, []);

  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)] p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Automated Regression Testing
          </h1>
          <p className="text-gray-400">
            Continuous performance validation and regression detection across builds
          </p>
        </div>

        {/* Statistics Dashboard */}
        {statistics && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <Card className="bg-[var(--ff-surface)] border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white">{statistics.totalTests}</div>
                <div className="text-sm text-gray-400">Total Tests</div>
              </CardContent>
            </Card>
            
            <Card className="bg-[var(--ff-surface)] border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{statistics.passCount}</div>
                <div className="text-sm text-gray-400">Passing</div>
              </CardContent>
            </Card>
            
            <Card className="bg-[var(--ff-surface)] border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-400">{statistics.failCount}</div>
                <div className="text-sm text-gray-400">Failing</div>
              </CardContent>
            </Card>
            
            <Card className="bg-[var(--ff-surface)] border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {statistics.passRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">Pass Rate</div>
              </CardContent>
            </Card>
            
            <Card className="bg-[var(--ff-surface)] border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {Math.round(statistics.avgDuration)}s
                </div>
                <div className="text-sm text-gray-400">Avg Duration</div>
              </CardContent>
            </Card>
            
            <Card className="bg-[var(--ff-surface)] border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-400">
                  {statistics.unacknowledgedAlerts}
                </div>
                <div className="text-sm text-gray-400">Alerts</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Controls */}
        <Card className="bg-[var(--ff-surface)] border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Test Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-center">
              <Button
                onClick={runRegressionTests}
                disabled={isRunning}
                className="bg-[var(--ff-primary)] hover:bg-[var(--ff-primary)]/80"
              >
                {isRunning ? (
                  <>
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Regression Tests
                  </>
                )}
              </Button>

              <Button
                onClick={() => setAutoRun(!autoRun)}
                variant={autoRun ? "default" : "outline"}
                className={autoRun ? "bg-green-600 hover:bg-green-700" : "border-gray-600"}
              >
                {autoRun ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Auto-Run Enabled
                  </>
                ) : (
                  <>
                    <FastForward className="h-4 w-4 mr-2" />
                    Enable Auto-Run
                  </>
                )}
              </Button>

              {statistics && (
                <div className="text-sm text-gray-400">
                  Latest Build: {statistics.latestBuild}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Regression Alerts */}
        {regressionAlerts.filter(a => !a.acknowledged).length > 0 && (
          <Card className="bg-[var(--ff-surface)] border-red-500 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
                Regression Alerts ({regressionAlerts.filter(a => !a.acknowledged).length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {regressionAlerts.filter(a => !a.acknowledged).slice(0, 5).map(alert => (
                  <Alert key={alert.id} className="border-red-500/20 bg-red-500/5">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{alert.message}</span>
                        <div className="text-xs text-gray-400 mt-1">
                          Build: {alert.buildId} • {alert.timestamp.toLocaleString()}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="text-xs"
                      >
                        Acknowledge
                      </Button>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-[var(--ff-surface)]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tests">Test Results</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-6">
              {/* Latest Test Run */}
              {testRuns.length > 0 && (
                <Card className="bg-[var(--ff-surface)] border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <GitCommit className="h-5 w-5 mr-2" />
                      Latest Test Run
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const latestRun = testRuns[testRuns.length - 1];
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <div className="text-sm text-gray-400">Build ID</div>
                            <div className="font-medium text-white">{latestRun.buildId}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-gray-400">Commit</div>
                            <div className="font-mono text-sm text-gray-300">{latestRun.commitHash}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-gray-400">Status</div>
                            <Badge variant={
                              latestRun.overallStatus === 'pass' ? 'default' :
                              latestRun.overallStatus === 'warning' ? 'secondary' :
                              'destructive'
                            }>
                              {latestRun.overallStatus}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-gray-400">Duration</div>
                            <div className="font-medium text-white">{latestRun.duration}s</div>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}

              {/* Test Categories Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {['performance', 'functional', 'visual', 'accessibility'].map(category => {
                  const categoryTests = REGRESSION_TESTS.filter(t => t.category === category);
                  const latestResults = testRuns.length > 0 
                    ? testRuns[testRuns.length - 1].results 
                    : new Map();
                  
                  const passCount = categoryTests.filter(t => 
                    latestResults.get(t.id)?.status === 'pass'
                  ).length;
                  
                  return (
                    <Card key={category} className="bg-[var(--ff-surface)] border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white capitalize">{category}</h4>
                          {category === 'performance' && <Zap className="h-4 w-4 text-blue-400" />}
                          {category === 'functional' && <CheckCircle className="h-4 w-4 text-green-400" />}
                          {category === 'visual' && <Target className="h-4 w-4 text-purple-400" />}
                          {category === 'accessibility' && <Shield className="h-4 w-4 text-orange-400" />}
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">
                          {passCount}/{categoryTests.length}
                        </div>
                        <div className="text-sm text-gray-400">Tests Passing</div>
                        <Progress 
                          value={(passCount / categoryTests.length) * 100}
                          className="mt-2 h-1"
                        />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Test Results Tab */}
          <TabsContent value="tests">
            <Card className="bg-[var(--ff-surface)] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {REGRESSION_TESTS.map(test => {
                      const latestResult = testRuns.length > 0 
                        ? testRuns[testRuns.length - 1].results.get(test.id)
                        : null;
                      
                      return (
                        <div key={test.id} className="p-4 bg-gray-800 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-white">{test.name}</h4>
                              <p className="text-sm text-gray-400">{test.description}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={
                                test.priority === 'critical' ? 'destructive' :
                                test.priority === 'high' ? 'default' :
                                'secondary'
                              }>
                                {test.priority}
                              </Badge>
                              {latestResult && (
                                <>
                                  {latestResult.status === 'pass' && <CheckCircle className="h-5 w-5 text-green-400" />}
                                  {latestResult.status === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-400" />}
                                  {latestResult.status === 'fail' && <XCircle className="h-5 w-5 text-red-400" />}
                                </>
                              )}
                            </div>
                          </div>
                          
                          {latestResult && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Current:</span>
                                <div className="font-medium text-white">
                                  {latestResult.value.toFixed(1)} {test.unit}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-400">Baseline:</span>
                                <div className="font-medium text-gray-300">
                                  {test.baseline} {test.unit}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-400">Change:</span>
                                <div className={`font-medium flex items-center ${
                                  latestResult.degradation > 0 ? 'text-red-400' : 'text-green-400'
                                }`}>
                                  {latestResult.degradation > 0 ? (
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                  ) : (
                                    <TrendingDown className="h-3 w-3 mr-1" />
                                  )}
                                  {Math.abs(latestResult.degradation).toFixed(1)}%
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-400">Threshold:</span>
                                <div className="font-medium text-gray-300">
                                  {test.threshold}%
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card className="bg-[var(--ff-surface)] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Test Run History</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {testRuns.slice().reverse().map(run => (
                      <div 
                        key={run.id} 
                        className={`p-4 bg-gray-800 rounded-lg cursor-pointer transition-colors ${
                          selectedBuild === run.buildId ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => setSelectedBuild(selectedBuild === run.buildId ? null : run.buildId)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {run.overallStatus === 'pass' && <CheckCircle className="h-5 w-5 text-green-400" />}
                            {run.overallStatus === 'fail' && <XCircle className="h-5 w-5 text-red-400" />}
                            {run.overallStatus === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-400" />}
                            
                            <div>
                              <div className="font-medium text-white">{run.buildId}</div>
                              <div className="text-sm text-gray-400">
                                {run.timestamp.toLocaleString()} • {run.duration}s
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-mono text-sm text-gray-300">{run.commitHash}</div>
                            <div className="text-xs text-gray-500">{run.branch}</div>
                          </div>
                        </div>
                        
                        {selectedBuild === run.buildId && (
                          <div className="mt-4 pt-4 border-t border-gray-700">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              {Array.from(run.results.entries()).map(([testId, result]) => {
                                const test = REGRESSION_TESTS.find(t => t.id === testId);
                                return (
                                  <div key={testId} className="space-y-1">
                                    <div className="text-gray-400">{test?.name}</div>
                                    <div className={`font-medium ${
                                      result.status === 'pass' ? 'text-green-400' :
                                      result.status === 'warning' ? 'text-yellow-400' :
                                      'text-red-400'
                                    }`}>
                                      {result.value.toFixed(1)} {test?.unit}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="configuration">
            <Card className="bg-[var(--ff-surface)] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Test Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-white mb-3">Regression Thresholds</h4>
                    <div className="space-y-3">
                      {REGRESSION_TESTS.map(test => (
                        <div key={test.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                          <div>
                            <div className="font-medium text-white">{test.name}</div>
                            <div className="text-sm text-gray-400">{test.category}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">Threshold:</div>
                            <div className="font-medium text-white">{test.threshold}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-white mb-3">Test Frequencies</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-gray-800 rounded-lg">
                        <div className="text-lg font-bold text-green-400">
                          {REGRESSION_TESTS.filter(t => t.frequency === 'every-commit').length}
                        </div>
                        <div className="text-sm text-gray-400">Every Commit</div>
                      </div>
                      <div className="text-center p-3 bg-gray-800 rounded-lg">
                        <div className="text-lg font-bold text-blue-400">
                          {REGRESSION_TESTS.filter(t => t.frequency === 'daily').length}
                        </div>
                        <div className="text-sm text-gray-400">Daily</div>
                      </div>
                      <div className="text-center p-3 bg-gray-800 rounded-lg">
                        <div className="text-lg font-bold text-purple-400">
                          {REGRESSION_TESTS.filter(t => t.frequency === 'weekly').length}
                        </div>
                        <div className="text-sm text-gray-400">Weekly</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AutomatedRegressionTester;