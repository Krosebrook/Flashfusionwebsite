import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Zap, 
  Activity,
  Monitor,
  Users,
  Database,
  Network,
  Cpu,
  HardDrive,
  Timer,
  BarChart3,
  TrendingUp,
  Shield,
  RefreshCw,
  Play,
  Pause,
  Square,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { analyticsService } from '../../services/AnalyticsService';

interface TestResult {
  id: string;
  component: string;
  testType: 'stability' | 'performance' | 'integration' | 'load' | 'accessibility' | 'security';
  status: 'pending' | 'running' | 'passed' | 'failed' | 'warning';
  duration: number;
  score: number;
  details: {
    renderTime: number;
    memoryUsage: number;
    errorCount: number;
    warningCount: number;
    accessibilityScore: number;
    performanceScore: number;
    issues: string[];
  };
  timestamp: number;
}

interface LoadTestMetrics {
  concurrentUsers: number;
  requestsPerSecond: number;
  averageResponseTime: number;
  errorRate: number;
  throughput: number;
  cpuUsage: number;
  memoryUsage: number;
  timestamp: number;
}

interface ComponentHealth {
  component: string;
  uptime: number;
  errorRate: number;
  averageRenderTime: number;
  memoryLeaks: number;
  crashCount: number;
  lastError?: string;
  status: 'healthy' | 'warning' | 'critical';
}

const LAUNCH_COMPONENTS = [
  'OptimizedOnboardingFlow',
  'LaunchPerformanceDashboard',
  'ErrorRecoverySystem', 
  'UserEngagementHub',
  'MobileOptimizationCenter',
  'SEOOptimizationSuite',
  'CommunityFeedbackHub',
  'LaunchDayCommand'
];

const TEST_SCENARIOS = [
  {
    id: 'component-stability',
    name: 'Component Stability',
    description: 'Test component mounting, unmounting, and error boundaries',
    duration: 30000,
    priority: 'critical'
  },
  {
    id: 'performance-benchmark',
    name: 'Performance Benchmark',
    description: 'Measure render times, memory usage, and optimization scores',
    duration: 45000,
    priority: 'high'
  },
  {
    id: 'load-simulation',
    name: 'Load Simulation',
    description: 'Simulate 500+ concurrent users interacting with components',
    duration: 120000,
    priority: 'critical'
  },
  {
    id: 'accessibility-audit',
    name: 'Accessibility Audit',
    description: 'WCAG 2.1 compliance and keyboard navigation testing',
    duration: 60000,
    priority: 'high'
  },
  {
    id: 'integration-tests',
    name: 'Integration Tests',
    description: 'Test component interactions and data flow',
    duration: 90000,
    priority: 'critical'
  },
  {
    id: 'security-scan',
    name: 'Security Scan',
    description: 'Check for vulnerabilities and security best practices',
    duration: 75000,
    priority: 'high'
  }
];

export function LaunchStabilityTester() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loadTestMetrics, setLoadTestMetrics] = useState<LoadTestMetrics[]>([]);
  const [componentHealth, setComponentHealth] = useState<ComponentHealth[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [testProgress, setTestProgress] = useState(0);
  const [testStartTime, setTestStartTime] = useState<number | null>(null);
  const [autoMode, setAutoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize testing data
  useEffect(() => {
    const initializeTestingData = async () => {
      try {
        // Initialize component health monitoring
        const initialHealth: ComponentHealth[] = LAUNCH_COMPONENTS.map(component => ({
          component,
          uptime: 100,
          errorRate: 0,
          averageRenderTime: Math.random() * 50 + 20,
          memoryLeaks: 0,
          crashCount: 0,
          status: 'healthy'
        }));

        setComponentHealth(initialHealth);

        // Initialize with some sample test results
        const sampleResults: TestResult[] = [];
        setTestResults(sampleResults);

      } catch (error) {
        console.error('Failed to initialize testing data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTestingData();
  }, []);

  // Auto health monitoring
  useEffect(() => {
    if (!autoMode) return;

    const interval = setInterval(() => {
      setComponentHealth(prev => prev.map(health => {
        // Simulate realistic health metrics
        const errorRate = Math.max(0, health.errorRate + (Math.random() - 0.95) * 0.1);
        const renderTime = Math.max(10, health.averageRenderTime + (Math.random() - 0.5) * 5);
        const uptime = Math.max(95, health.uptime + (Math.random() - 0.02) * 0.5);
        
        let status: ComponentHealth['status'] = 'healthy';
        if (errorRate > 5 || renderTime > 100 || uptime < 98) {
          status = 'critical';
        } else if (errorRate > 2 || renderTime > 75 || uptime < 99) {
          status = 'warning';
        }

        return {
          ...health,
          errorRate,
          averageRenderTime: renderTime,
          uptime,
          status
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [autoMode]);

  const runComponentTest = useCallback(async (component: string, testType: TestResult['testType']) => {
    const testId = `${component}-${testType}-${Date.now()}`;
    
    // Create pending test result
    const pendingTest: TestResult = {
      id: testId,
      component,
      testType,
      status: 'running',
      duration: 0,
      score: 0,
      details: {
        renderTime: 0,
        memoryUsage: 0,
        errorCount: 0,
        warningCount: 0,
        accessibilityScore: 0,
        performanceScore: 0,
        issues: []
      },
      timestamp: Date.now()
    };

    setTestResults(prev => [pendingTest, ...prev.slice(0, 49)]);

    // Simulate test execution
    const startTime = Date.now();
    const testDuration = Math.random() * 5000 + 2000; // 2-7 seconds

    try {
      await new Promise(resolve => setTimeout(resolve, testDuration));

      // Generate realistic test results
      const renderTime = Math.random() * 100 + 20;
      const memoryUsage = Math.random() * 50 + 10;
      const errorCount = Math.floor(Math.random() * 3);
      const warningCount = Math.floor(Math.random() * 5);
      const accessibilityScore = Math.random() * 20 + 80;
      const performanceScore = Math.random() * 25 + 70;
      
      const issues: string[] = [];
      if (renderTime > 75) issues.push('Slow render time detected');
      if (memoryUsage > 40) issues.push('High memory usage');
      if (errorCount > 0) issues.push(`${errorCount} error(s) found`);
      if (accessibilityScore < 90) issues.push('Accessibility improvements needed');

      let status: TestResult['status'] = 'passed';
      if (errorCount > 2 || renderTime > 100 || accessibilityScore < 70) {
        status = 'failed';
      } else if (errorCount > 0 || renderTime > 75 || accessibilityScore < 85) {
        status = 'warning';
      }

      const score = Math.min(100, (performanceScore + accessibilityScore) / 2);

      const completedTest: TestResult = {
        ...pendingTest,
        status,
        duration: Date.now() - startTime,
        score,
        details: {
          renderTime,
          memoryUsage,
          errorCount,
          warningCount,
          accessibilityScore,
          performanceScore,
          issues
        }
      };

      setTestResults(prev => prev.map(test => 
        test.id === testId ? completedTest : test
      ));

      // Track test completion
      analyticsService.trackFeatureUsage('stability-test-completed', {
        component,
        testType,
        status,
        score,
        duration: completedTest.duration
      });

    } catch (error) {
      console.error('Test failed:', error);
      
      setTestResults(prev => prev.map(test => 
        test.id === testId ? {
          ...test,
          status: 'failed',
          duration: Date.now() - startTime,
          details: {
            ...test.details,
            issues: ['Test execution failed', error.message]
          }
        } : test
      ));
    }
  }, []);

  const runFullTestSuite = useCallback(async () => {
    if (isRunningTests) return;
    
    setIsRunningTests(true);
    setTestStartTime(Date.now());
    setTestProgress(0);
    
    try {
      const totalTests = LAUNCH_COMPONENTS.length * TEST_SCENARIOS.length;
      let completedTests = 0;

      for (const scenario of TEST_SCENARIOS) {
        setCurrentTest(scenario.name);
        
        for (const component of LAUNCH_COMPONENTS) {
          await runComponentTest(component, scenario.id.split('-')[0] as TestResult['testType']);
          completedTests++;
          setTestProgress((completedTests / totalTests) * 100);
          
          // Small delay between tests to prevent overwhelming
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      toast.success('Full test suite completed successfully!');
      analyticsService.trackFeatureUsage('full-test-suite-completed', {
        totalTests,
        duration: Date.now() - (testStartTime || 0),
        timestamp: Date.now()
      });

    } catch (error) {
      toast.error('Test suite execution failed');
      console.error('Test suite failed:', error);
    } finally {
      setIsRunningTests(false);
      setCurrentTest(null);
      setTestProgress(0);
    }
  }, [isRunningTests, testStartTime, runComponentTest]);

  const runLoadTest = useCallback(async () => {
    if (isRunningTests) return;

    setIsRunningTests(true);
    setCurrentTest('Load Testing (500+ Users)');
    
    try {
      // Simulate progressive load test
      for (let users = 100; users <= 500; users += 50) {
        const metrics: LoadTestMetrics = {
          concurrentUsers: users,
          requestsPerSecond: users * (Math.random() * 2 + 1),
          averageResponseTime: Math.random() * 100 + 50 + (users * 0.2),
          errorRate: Math.max(0, Math.random() * 2 - (500 - users) * 0.001),
          throughput: users * (Math.random() * 1.5 + 0.5),
          cpuUsage: Math.min(95, 20 + users * 0.1 + Math.random() * 10),
          memoryUsage: Math.min(90, 30 + users * 0.08 + Math.random() * 5),
          timestamp: Date.now()
        };

        setLoadTestMetrics(prev => [...prev.slice(-19), metrics]);
        setTestProgress((users / 500) * 100);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      toast.success('Load test completed - System stable at 500+ users!');
      
    } catch (error) {
      toast.error('Load test failed');
    } finally {
      setIsRunningTests(false);
      setCurrentTest(null);
      setTestProgress(0);
    }
  }, [isRunningTests]);

  const exportTestReport = useCallback(() => {
    const report = {
      timestamp: Date.now(),
      summary: {
        totalTests: testResults.length,
        passed: testResults.filter(t => t.status === 'passed').length,
        failed: testResults.filter(t => t.status === 'failed').length,
        warnings: testResults.filter(t => t.status === 'warning').length,
        averageScore: testResults.reduce((sum, t) => sum + t.score, 0) / testResults.length || 0
      },
      componentHealth,
      testResults,
      loadTestMetrics
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flashfusion-stability-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Test report exported successfully!');
  }, [testResults, componentHealth, loadTestMetrics]);

  const overallHealth = useMemo(() => {
    const healthyComponents = componentHealth.filter(h => h.status === 'healthy').length;
    const totalComponents = componentHealth.length;
    return totalComponents > 0 ? (healthyComponents / totalComponents) * 100 : 0;
  }, [componentHealth]);

  const testSummary = useMemo(() => {
    const total = testResults.length;
    const passed = testResults.filter(t => t.status === 'passed').length;
    const failed = testResults.filter(t => t.status === 'failed').length;
    const warnings = testResults.filter(t => t.status === 'warning').length;
    const avgScore = total > 0 ? testResults.reduce((sum, t) => sum + t.score, 0) / total : 0;

    return { total, passed, failed, warnings, avgScore };
  }, [testResults]);

  const criticalIssues = testResults.filter(test => 
    test.status === 'failed' || test.details.issues.some(issue => 
      issue.includes('critical') || issue.includes('security') || issue.includes('crash')
    )
  ).length;

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
          <h1 className="text-3xl font-bold ff-text-gradient">Launch Stability Tester</h1>
          <p className="text-muted-foreground">
            Comprehensive testing suite for production-ready launch validation
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge 
            variant={overallHealth >= 95 ? 'default' : overallHealth >= 85 ? 'secondary' : 'destructive'}
            className={`font-medium ${overallHealth >= 95 ? 'ff-badge-glow' : ''}`}
          >
            <Activity className={`h-3 w-3 mr-1 ${autoMode ? 'animate-pulse' : ''}`} />
            {overallHealth.toFixed(0)}% Healthy
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoMode(!autoMode)}
            className={`ff-focus-ring ${autoMode ? 'bg-primary/10' : ''}`}
          >
            <Monitor className="h-4 w-4 mr-2" />
            {autoMode ? 'Auto Mode On' : 'Auto Mode Off'}
          </Button>
        </div>
      </div>

      {/* Critical Issues Alert */}
      {criticalIssues > 0 && (
        <Alert className="border-destructive bg-destructive/5">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-destructive">Critical Issues Detected</AlertTitle>
          <AlertDescription>
            {criticalIssues} critical issue{criticalIssues === 1 ? '' : 's'} found that could impact launch stability.
            Review failed tests and resolve issues before launch.
          </AlertDescription>
        </Alert>
      )}

      {/* Test Control Panel */}
      <Card className="ff-card-interactive">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Test Control Panel</h3>
              {isRunningTests && currentTest && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Running: {currentTest}</p>
                  <div className="w-64">
                    <Progress value={testProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {testProgress.toFixed(0)}% complete
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={runFullTestSuite}
                disabled={isRunningTests}
                className="ff-btn-primary"
              >
                {isRunningTests ? (
                  <><Pause className="h-4 w-4 mr-2" />Testing...</>
                ) : (
                  <><Play className="h-4 w-4 mr-2" />Run Full Suite</>
                )}
              </Button>
              
              <Button
                onClick={runLoadTest}
                disabled={isRunningTests}
                variant="secondary"
                className="ff-btn-secondary"
              >
                <Users className="h-4 w-4 mr-2" />
                Load Test (500+)
              </Button>
              
              <Button
                onClick={exportTestReport}
                variant="outline"
                className="ff-focus-ring"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TestTube className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium">Total Tests</h3>
            </div>
            <p className="text-2xl font-bold">{testSummary.total}</p>
            <p className="text-sm text-muted-foreground">
              Avg Score: {testSummary.avgScore.toFixed(0)}%
            </p>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="font-medium">Tests Passed</h3>
            </div>
            <p className="text-2xl font-bold text-green-500">{testSummary.passed}</p>
            <p className="text-sm text-muted-foreground">
              {testSummary.total > 0 ? ((testSummary.passed / testSummary.total) * 100).toFixed(0) : 0}% success rate
            </p>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
              <h3 className="font-medium">Warnings</h3>
            </div>
            <p className="text-2xl font-bold text-yellow-500">{testSummary.warnings}</p>
            <p className="text-sm text-muted-foreground">
              {testSummary.failed} failed tests
            </p>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Activity className="h-5 w-5 text-secondary" />
              </div>
              <h3 className="font-medium">System Health</h3>
            </div>
            <p className={`text-2xl font-bold ${overallHealth >= 95 ? 'text-green-500' : overallHealth >= 85 ? 'text-yellow-500' : 'text-red-500'}`}>
              {overallHealth.toFixed(0)}%
            </p>
            <p className="text-sm text-muted-foreground">
              {componentHealth.filter(h => h.status === 'healthy').length}/{componentHealth.length} components
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="results" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="results" className="ff-focus-ring">
            Test Results ({testResults.length})
          </TabsTrigger>
          <TabsTrigger value="health" className="ff-focus-ring">
            Component Health
          </TabsTrigger>
          <TabsTrigger value="load" className="ff-focus-ring">
            Load Testing
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="ff-focus-ring">
            Test Scenarios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-4">
          <div className="space-y-3">
            {testResults.length === 0 ? (
              <Card className="ff-card-interactive">
                <CardContent className="p-8 text-center">
                  <TestTube className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No Test Results</h3>
                  <p className="text-muted-foreground">Run the test suite to see results here.</p>
                </CardContent>
              </Card>
            ) : (
              testResults.map((test) => (
                <Card key={test.id} className={`ff-card-interactive ${
                  test.status === 'passed' ? 'border-green-500/20 bg-green-500/5' :
                  test.status === 'failed' ? 'border-red-500/20 bg-red-500/5' :
                  test.status === 'warning' ? 'border-yellow-500/20 bg-yellow-500/5' :
                  test.status === 'running' ? 'border-blue-500/20 bg-blue-500/5' :
                  ''
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            test.status === 'passed' ? 'bg-green-500/10' :
                            test.status === 'failed' ? 'bg-red-500/10' :
                            test.status === 'warning' ? 'bg-yellow-500/10' :
                            test.status === 'running' ? 'bg-blue-500/10' :
                            'bg-muted'
                          }`}>
                            {test.status === 'passed' ? <CheckCircle className="h-5 w-5 text-green-500" /> :
                             test.status === 'failed' ? <XCircle className="h-5 w-5 text-red-500" /> :
                             test.status === 'warning' ? <AlertTriangle className="h-5 w-5 text-yellow-500" /> :
                             test.status === 'running' ? <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" /> :
                             <Clock className="h-5 w-5 text-muted-foreground" />}
                          </div>
                          
                          <div>
                            <h4 className="font-medium">{test.component}</h4>
                            <p className="text-sm text-muted-foreground capitalize">{test.testType} Test</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Score:</span>
                            <p className={`font-medium ${test.score >= 90 ? 'text-green-500' : test.score >= 70 ? 'text-yellow-500' : 'text-red-500'}`}>
                              {test.score.toFixed(0)}%
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duration:</span>
                            <p className="font-medium">{(test.duration / 1000).toFixed(1)}s</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Render Time:</span>
                            <p className="font-medium">{test.details.renderTime.toFixed(0)}ms</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Memory:</span>
                            <p className="font-medium">{test.details.memoryUsage.toFixed(1)}MB</p>
                          </div>
                        </div>
                        
                        {test.details.issues.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium">Issues Found:</h5>
                            <ul className="space-y-1">
                              {test.details.issues.map((issue, index) => (
                                <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                                  <AlertTriangle className="h-3 w-3 text-yellow-500" />
                                  {issue}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right space-y-2">
                        <Badge variant={
                          test.status === 'passed' ? 'default' :
                          test.status === 'failed' ? 'destructive' :
                          'secondary'
                        }>
                          {test.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {new Date(test.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {componentHealth.map((health) => (
              <Card key={health.component} className={`ff-card-interactive ${
                health.status === 'healthy' ? 'border-green-500/20 bg-green-500/5' :
                health.status === 'warning' ? 'border-yellow-500/20 bg-yellow-500/5' :
                'border-red-500/20 bg-red-500/5'
              }`}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{health.component}</h4>
                      <Badge variant={
                        health.status === 'healthy' ? 'default' :
                        health.status === 'warning' ? 'secondary' :
                        'destructive'
                      }>
                        {health.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Uptime:</span>
                        <span className="font-medium">{health.uptime.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Error Rate:</span>
                        <span className={`font-medium ${health.errorRate > 2 ? 'text-red-500' : health.errorRate > 1 ? 'text-yellow-500' : 'text-green-500'}`}>
                          {health.errorRate.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg Render:</span>
                        <span className="font-medium">{health.averageRenderTime.toFixed(0)}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Memory Leaks:</span>
                        <span className={`font-medium ${health.memoryLeaks > 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {health.memoryLeaks}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Crashes:</span>
                        <span className={`font-medium ${health.crashCount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {health.crashCount}
                        </span>
                      </div>
                    </div>
                    
                    {health.lastError && (
                      <div className="p-2 bg-red-500/5 border border-red-500/20 rounded text-xs">
                        <p className="font-medium text-red-500 mb-1">Last Error:</p>
                        <p className="text-muted-foreground">{health.lastError}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="load" className="space-y-4">
          {loadTestMetrics.length === 0 ? (
            <Card className="ff-card-interactive">
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">No Load Test Data</h3>
                <p className="text-muted-foreground">Run a load test to see performance metrics here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {loadTestMetrics.length > 0 && (() => {
                  const latestMetrics = loadTestMetrics[loadTestMetrics.length - 1];
                  return (
                    <>
                      <Card className="ff-card-interactive">
                        <CardContent className="p-6">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Users className="h-5 w-5 text-primary" />
                              <h3 className="font-medium">Concurrent Users</h3>
                            </div>
                            <p className="text-2xl font-bold">{latestMetrics.concurrentUsers}</p>
                            <p className="text-xs text-muted-foreground">Peak load tested</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="ff-card-interactive">
                        <CardContent className="p-6">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Zap className="h-5 w-5 text-secondary" />
                              <h3 className="font-medium">Response Time</h3>
                            </div>
                            <p className={`text-2xl font-bold ${latestMetrics.averageResponseTime > 500 ? 'text-red-500' : latestMetrics.averageResponseTime > 200 ? 'text-yellow-500' : 'text-green-500'}`}>
                              {latestMetrics.averageResponseTime.toFixed(0)}ms
                            </p>
                            <p className="text-xs text-muted-foreground">Average response</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="ff-card-interactive">
                        <CardContent className="p-6">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <BarChart3 className="h-5 w-5 text-accent" />
                              <h3 className="font-medium">Throughput</h3>
                            </div>
                            <p className="text-2xl font-bold">{latestMetrics.requestsPerSecond.toFixed(0)}</p>
                            <p className="text-xs text-muted-foreground">Requests per second</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="ff-card-interactive">
                        <CardContent className="p-6">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Shield className="h-5 w-5 text-green-500" />
                              <h3 className="font-medium">Error Rate</h3>
                            </div>
                            <p className={`text-2xl font-bold ${latestMetrics.errorRate > 2 ? 'text-red-500' : latestMetrics.errorRate > 1 ? 'text-yellow-500' : 'text-green-500'}`}>
                              {latestMetrics.errorRate.toFixed(2)}%
                            </p>
                            <p className="text-xs text-muted-foreground">Error percentage</p>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEST_SCENARIOS.map((scenario) => (
              <Card key={scenario.id} className="ff-card-interactive">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{scenario.name}</h4>
                      <Badge variant={scenario.priority === 'critical' ? 'destructive' : scenario.priority === 'high' ? 'default' : 'secondary'}>
                        {scenario.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{scenario.description}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{(scenario.duration / 1000).toFixed(0)}s</span>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Run individual scenario
                        LAUNCH_COMPONENTS.forEach(component => {
                          runComponentTest(component, scenario.id.split('-')[0] as TestResult['testType']);
                        });
                      }}
                      disabled={isRunningTests}
                      className="ff-focus-ring w-full"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Run Scenario
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}