/**
 * @fileoverview Test Suite Orchestrator
 * @category Testing Infrastructure
 * @version 1.0.0
 * 
 * Central orchestration system for managing all testing workflows:
 * - Integration tests
 * - Performance benchmarks
 * - Regression testing
 * - CI/CD pipeline integration
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
  Play,
  Pause,
  RefreshCw,
  Settings,
  Calendar,
  Clock,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Target,
  Zap,
  Database,
  GitBranch,
  Users,
  BarChart3,
  LineChart,
  Download,
  Upload,
  Shield
} from 'lucide-react';

// Test suite definitions
interface TestSuite {
  id: string;
  name: string;
  type: 'integration' | 'performance' | 'regression' | 'security' | 'accessibility';
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedDuration: number;
  dependencies: string[];
  triggers: TestTrigger[];
  environment: 'development' | 'staging' | 'production' | 'all';
  parallelizable: boolean;
  retryPolicy: {
    maxRetries: number;
    backoffMultiplier: number;
  };
}

interface TestTrigger {
  type: 'manual' | 'schedule' | 'webhook' | 'commit' | 'deploy' | 'api';
  condition?: string;
  schedule?: string; // cron expression
}

interface TestExecution {
  id: string;
  suiteId: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled' | 'skipped';
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  trigger: string;
  environment: string;
  buildId?: string;
  commitHash?: string;
  results?: TestExecutionResult[];
  logs?: string[];
  artifacts?: string[];
}

interface TestExecutionResult {
  testId: string;
  status: 'pass' | 'fail' | 'skip';
  duration: number;
  error?: string;
  metrics?: { [key: string]: number };
}

interface PipelineConfig {
  id: string;
  name: string;
  suites: string[];
  parallel: boolean;
  failFast: boolean;
  environment: string;
  schedule?: string;
  notifications: {
    slack?: string;
    email?: string[];
    webhook?: string;
  };
}

// Test suite registry
const TEST_SUITES: TestSuite[] = [
  // Integration Test Suites
  {
    id: 'integration-comprehensive',
    name: 'Comprehensive Integration Tests',
    type: 'integration',
    description: 'End-to-end testing of all 65+ AI tools and core functionality',
    priority: 'critical',
    estimatedDuration: 1800, // 30 minutes
    dependencies: [],
    triggers: [
      { type: 'commit', condition: 'main' },
      { type: 'schedule', schedule: '0 */4 * * *' }, // Every 4 hours
      { type: 'manual' }
    ],
    environment: 'all',
    parallelizable: true,
    retryPolicy: { maxRetries: 2, backoffMultiplier: 1.5 }
  },
  {
    id: 'integration-auth-flows',
    name: 'Authentication Flow Tests',
    type: 'integration',
    description: 'Comprehensive authentication and authorization testing',
    priority: 'critical',
    estimatedDuration: 300, // 5 minutes
    dependencies: [],
    triggers: [
      { type: 'commit' },
      { type: 'manual' }
    ],
    environment: 'all',
    parallelizable: false,
    retryPolicy: { maxRetries: 3, backoffMultiplier: 2 }
  },
  {
    id: 'integration-ai-tools',
    name: 'AI Tools Integration Tests',
    type: 'integration',
    description: 'Testing all AI tool categories and cross-tool workflows',
    priority: 'high',
    estimatedDuration: 1200, // 20 minutes
    dependencies: ['integration-auth-flows'],
    triggers: [
      { type: 'commit', condition: 'main' },
      { type: 'manual' }
    ],
    environment: 'staging',
    parallelizable: true,
    retryPolicy: { maxRetries: 1, backoffMultiplier: 1 }
  },

  // Performance Test Suites
  {
    id: 'performance-benchmarks',
    name: 'Performance Benchmarks',
    type: 'performance',
    description: 'Core Web Vitals and performance metric validation',
    priority: 'high',
    estimatedDuration: 600, // 10 minutes
    dependencies: [],
    triggers: [
      { type: 'commit', condition: 'main' },
      { type: 'schedule', schedule: '0 0 * * *' }, // Daily
      { type: 'manual' }
    ],
    environment: 'production',
    parallelizable: false,
    retryPolicy: { maxRetries: 2, backoffMultiplier: 1.2 }
  },
  {
    id: 'performance-load-testing',
    name: 'Load Testing',
    type: 'performance',
    description: 'High-load scenarios and stress testing',
    priority: 'medium',
    estimatedDuration: 900, // 15 minutes
    dependencies: ['performance-benchmarks'],
    triggers: [
      { type: 'schedule', schedule: '0 2 * * 0' }, // Weekly
      { type: 'manual' }
    ],
    environment: 'staging',
    parallelizable: false,
    retryPolicy: { maxRetries: 1, backoffMultiplier: 1 }
  },

  // Regression Test Suites
  {
    id: 'regression-automated',
    name: 'Automated Regression Tests',
    type: 'regression',
    description: 'Automated regression detection and baseline comparison',
    priority: 'critical',
    estimatedDuration: 480, // 8 minutes
    dependencies: [],
    triggers: [
      { type: 'commit' },
      { type: 'schedule', schedule: '0 */2 * * *' }, // Every 2 hours
      { type: 'deploy' }
    ],
    environment: 'all',
    parallelizable: true,
    retryPolicy: { maxRetries: 2, backoffMultiplier: 1.5 }
  },

  // Security Test Suites
  {
    id: 'security-comprehensive',
    name: 'Security Scan Suite',
    type: 'security',
    description: 'Comprehensive security vulnerability scanning',
    priority: 'high',
    estimatedDuration: 720, // 12 minutes
    dependencies: [],
    triggers: [
      { type: 'schedule', schedule: '0 1 * * *' }, // Daily at 1 AM
      { type: 'manual' }
    ],
    environment: 'staging',
    parallelizable: false,
    retryPolicy: { maxRetries: 1, backoffMultiplier: 1 }
  },

  // Accessibility Test Suites
  {
    id: 'accessibility-compliance',
    name: 'Accessibility Compliance Tests',
    type: 'accessibility',
    description: 'WCAG 2.1 AA compliance validation',
    priority: 'medium',
    estimatedDuration: 360, // 6 minutes
    dependencies: [],
    triggers: [
      { type: 'schedule', schedule: '0 0 * * 1' }, // Weekly on Monday
      { type: 'manual' }
    ],
    environment: 'staging',
    parallelizable: true,
    retryPolicy: { maxRetries: 2, backoffMultiplier: 1 }
  }
];

// Pipeline configurations
const PIPELINE_CONFIGS: PipelineConfig[] = [
  {
    id: 'ci-pipeline',
    name: 'CI Pipeline',
    suites: ['integration-auth-flows', 'regression-automated'],
    parallel: true,
    failFast: true,
    environment: 'staging',
    notifications: {
      slack: '#dev-alerts',
      email: ['dev-team@flashfusion.ai']
    }
  },
  {
    id: 'nightly-pipeline',
    name: 'Nightly Testing Pipeline',
    suites: ['integration-comprehensive', 'performance-benchmarks', 'security-comprehensive'],
    parallel: false,
    failFast: false,
    environment: 'staging',
    schedule: '0 0 * * *',
    notifications: {
      slack: '#qa-reports',
      email: ['qa-team@flashfusion.ai']
    }
  },
  {
    id: 'release-pipeline',
    name: 'Release Validation Pipeline',
    suites: ['integration-comprehensive', 'performance-benchmarks', 'regression-automated', 'security-comprehensive', 'accessibility-compliance'],
    parallel: false,
    failFast: true,
    environment: 'production',
    notifications: {
      slack: '#release-alerts',
      email: ['release-team@flashfusion.ai', 'leadership@flashfusion.ai']
    }
  }
];

/**
 * Test Suite Orchestrator Component
 */
export const TestSuiteOrchestrator: React.FC = () => {
  const [executions, setExecutions] = useState<TestExecution[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<string>('ci-pipeline');
  const [isRunning, setIsRunning] = useState(false);
  const [queuedSuites, setQueuedSuites] = useState<string[]>([]);

  // Generate mock execution history
  useEffect(() => {
    const mockExecutions: TestExecution[] = [];
    const now = new Date();
    
    for (let i = 20; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000); // Hourly executions
      const suite = TEST_SUITES[Math.floor(Math.random() * TEST_SUITES.length)];
      const status = Math.random() > 0.15 ? 'completed' : Math.random() > 0.5 ? 'failed' : 'completed';
      
      mockExecutions.push({
        id: `exec-${i}`,
        suiteId: suite.id,
        status: status as any,
        startTime: timestamp,
        endTime: new Date(timestamp.getTime() + suite.estimatedDuration * 1000),
        duration: suite.estimatedDuration + Math.floor(Math.random() * 60) - 30,
        trigger: ['commit', 'schedule', 'manual'][Math.floor(Math.random() * 3)],
        environment: ['development', 'staging', 'production'][Math.floor(Math.random() * 3)],
        buildId: `build-${(20 - i).toString().padStart(3, '0')}`,
        commitHash: Math.random().toString(36).substr(2, 8)
      });
    }
    
    setExecutions(mockExecutions);
  }, []);

  // Calculate statistics
  const statistics = useMemo(() => {
    const recent = executions.slice(-24); // Last 24 executions
    const total = recent.length;
    const passed = recent.filter(e => e.status === 'completed').length;
    const failed = recent.filter(e => e.status === 'failed').length;
    const avgDuration = recent.reduce((sum, e) => sum + (e.duration || 0), 0) / total || 0;
    
    const suiteStats = TEST_SUITES.map(suite => {
      const suiteExecutions = recent.filter(e => e.suiteId === suite.id);
      const successRate = suiteExecutions.length > 0 
        ? (suiteExecutions.filter(e => e.status === 'completed').length / suiteExecutions.length) * 100
        : 0;
      
      return {
        suite: suite.name,
        successRate,
        executions: suiteExecutions.length
      };
    });
    
    return {
      total,
      passed,
      failed,
      successRate: total > 0 ? (passed / total) * 100 : 0,
      avgDuration: Math.round(avgDuration),
      suiteStats
    };
  }, [executions]);

  // Execute test suite
  const executeSuite = useCallback(async (suiteId: string, trigger: string = 'manual') => {
    const suite = TEST_SUITES.find(s => s.id === suiteId);
    if (!suite) return;
    
    const execution: TestExecution = {
      id: `exec-${Date.now()}`,
      suiteId,
      status: 'queued',
      trigger,
      environment: 'staging',
      buildId: `build-${Date.now()}`,
      commitHash: Math.random().toString(36).substr(2, 8)
    };
    
    setExecutions(prev => [...prev, execution]);
    
    // Simulate execution
    setTimeout(() => {
      setExecutions(prev => prev.map(e => 
        e.id === execution.id 
          ? { ...e, status: 'running', startTime: new Date() }
          : e
      ));
    }, 1000);
    
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      const endTime = new Date();
      const duration = suite.estimatedDuration + Math.floor(Math.random() * 60) - 30;
      
      setExecutions(prev => prev.map(e => 
        e.id === execution.id 
          ? { 
              ...e, 
              status: success ? 'completed' : 'failed',
              endTime,
              duration,
              results: generateMockResults(success)
            }
          : e
      ));
    }, suite.estimatedDuration * 10); // 10ms per second for demo
  }, []);

  // Execute pipeline
  const executePipeline = useCallback(async (pipelineId: string) => {
    const pipeline = PIPELINE_CONFIGS.find(p => p.id === pipelineId);
    if (!pipeline) return;
    
    setIsRunning(true);
    
    if (pipeline.parallel) {
      // Execute suites in parallel
      await Promise.all(pipeline.suites.map(suiteId => 
        executeSuite(suiteId, 'pipeline')
      ));
    } else {
      // Execute suites sequentially
      for (const suiteId of pipeline.suites) {
        await executeSuite(suiteId, 'pipeline');
        // Wait for completion if failFast is enabled
        if (pipeline.failFast) {
          // Check if last execution failed
          // In real implementation, wait for actual completion
        }
      }
    }
    
    setIsRunning(false);
  }, [executeSuite]);

  // Generate mock test results
  const generateMockResults = useCallback((success: boolean): TestExecutionResult[] => {
    const numTests = Math.floor(Math.random() * 20) + 10;
    const results: TestExecutionResult[] = [];
    
    for (let i = 0; i < numTests; i++) {
      const testSuccess = success ? Math.random() > 0.05 : Math.random() > 0.5;
      results.push({
        testId: `test-${i}`,
        status: testSuccess ? 'pass' : 'fail',
        duration: Math.floor(Math.random() * 5000) + 100,
        error: testSuccess ? undefined : 'Mock test failure',
        metrics: {
          performance: Math.random() * 100,
          coverage: Math.random() * 100
        }
      });
    }
    
    return results;
  }, []);

  // Export test report
  const exportReport = useCallback(() => {
    const report = {
      timestamp: new Date().toISOString(),
      statistics,
      executions: executions.slice(-50), // Last 50 executions
      suites: TEST_SUITES,
      pipelines: PIPELINE_CONFIGS
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-orchestrator-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [statistics, executions]);

  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)] p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Test Suite Orchestrator
          </h1>
          <p className="text-gray-400">
            Central command center for managing all testing workflows and CI/CD pipelines
          </p>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="bg-[var(--ff-surface)] border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{statistics.total}</div>
              <div className="text-sm text-gray-400">Total Runs</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[var(--ff-surface)] border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{statistics.passed}</div>
              <div className="text-sm text-gray-400">Passed</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[var(--ff-surface)] border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{statistics.failed}</div>
              <div className="text-sm text-gray-400">Failed</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[var(--ff-surface)] border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {statistics.successRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[var(--ff-surface)] border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {statistics.avgDuration}s
              </div>
              <div className="text-sm text-gray-400">Avg Duration</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-[var(--ff-surface)] border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => executePipeline(selectedPipeline)}
                disabled={isRunning}
                className="bg-[var(--ff-primary)] hover:bg-[var(--ff-primary)]/80"
              >
                {isRunning ? (
                  <>
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                    Running Pipeline...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Pipeline
                  </>
                )}
              </Button>

              <select
                value={selectedPipeline}
                onChange={(e) => setSelectedPipeline(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm"
              >
                {PIPELINE_CONFIGS.map(pipeline => (
                  <option key={pipeline.id} value={pipeline.id}>
                    {pipeline.name}
                  </option>
                ))}
              </select>

              <Button
                onClick={exportReport}
                variant="outline"
                className="border-gray-600"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>

              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
                <span>{isRunning ? 'Pipeline Running' : 'Ready'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-[var(--ff-surface)]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="suites">Test Suites</TabsTrigger>
            <TabsTrigger value="pipelines">Pipelines</TabsTrigger>
            <TabsTrigger value="executions">Executions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-6">
              {/* Active Executions */}
              <Card className="bg-[var(--ff-surface)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Active Executions</CardTitle>
                </CardHeader>
                <CardContent>
                  {executions.filter(e => e.status === 'running').length > 0 ? (
                    <div className="space-y-3">
                      {executions.filter(e => e.status === 'running').map(execution => {
                        const suite = TEST_SUITES.find(s => s.id === execution.suiteId);
                        return (
                          <div key={execution.id} className="p-4 bg-gray-800 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-white">{suite?.name}</h4>
                              <Badge variant="secondary">
                                <Activity className="h-3 w-3 mr-1 animate-spin" />
                                Running
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Environment:</span>
                                <div className="font-medium text-white">{execution.environment}</div>
                              </div>
                              <div>
                                <span className="text-gray-400">Trigger:</span>
                                <div className="font-medium text-white">{execution.trigger}</div>
                              </div>
                              <div>
                                <span className="text-gray-400">Build:</span>
                                <div className="font-medium text-white">{execution.buildId}</div>
                              </div>
                              <div>
                                <span className="text-gray-400">Started:</span>
                                <div className="font-medium text-white">
                                  {execution.startTime?.toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                            <Progress value={50} className="mt-3 h-2" />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No active executions</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Results */}
              <Card className="bg-[var(--ff-surface)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {executions.slice(-10).reverse().map(execution => {
                        const suite = TEST_SUITES.find(s => s.id === execution.suiteId);
                        return (
                          <div key={execution.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <div className="flex items-center space-x-3">
                              {execution.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-400" />}
                              {execution.status === 'failed' && <XCircle className="h-5 w-5 text-red-400" />}
                              {execution.status === 'running' && <Activity className="h-5 w-5 text-blue-400" />}
                              
                              <div>
                                <div className="font-medium text-white">{suite?.name}</div>
                                <div className="text-sm text-gray-400">
                                  {execution.startTime?.toLocaleString()}
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-medium text-white">{execution.duration}s</div>
                              <div className="text-xs text-gray-500">{execution.environment}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Test Suites Tab */}
          <TabsContent value="suites">
            <div className="space-y-4">
              {['integration', 'performance', 'regression', 'security', 'accessibility'].map(type => (
                <Card key={type} className="bg-[var(--ff-surface)] border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white capitalize flex items-center">
                      {type === 'integration' && <Target className="h-5 w-5 mr-2" />}
                      {type === 'performance' && <Zap className="h-5 w-5 mr-2" />}
                      {type === 'regression' && <RefreshCw className="h-5 w-5 mr-2" />}
                      {type === 'security' && <Shield className="h-5 w-5 mr-2" />}
                      {type === 'accessibility' && <Users className="h-5 w-5 mr-2" />}
                      {type} Test Suites
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {TEST_SUITES.filter(suite => suite.type === type).map(suite => (
                        <div key={suite.id} className="p-4 bg-gray-800 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-white">{suite.name}</h4>
                            <Badge variant={
                              suite.priority === 'critical' ? 'destructive' :
                              suite.priority === 'high' ? 'default' :
                              'secondary'
                            }>
                              {suite.priority}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-400 mb-3">{suite.description}</p>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Duration:</span>
                              <span className="text-gray-300">{Math.floor(suite.estimatedDuration / 60)}m {suite.estimatedDuration % 60}s</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Environment:</span>
                              <span className="text-gray-300">{suite.environment}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Parallelizable:</span>
                              <span className="text-gray-300">{suite.parallelizable ? 'Yes' : 'No'}</span>
                            </div>
                          </div>
                          
                          <Button
                            size="sm"
                            onClick={() => executeSuite(suite.id)}
                            className="w-full mt-3 text-xs"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Run Suite
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Pipelines Tab */}
          <TabsContent value="pipelines">
            <div className="space-y-4">
              {PIPELINE_CONFIGS.map(pipeline => (
                <Card key={pipeline.id} className="bg-[var(--ff-surface)] border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span className="flex items-center">
                        <GitBranch className="h-5 w-5 mr-2" />
                        {pipeline.name}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => executePipeline(pipeline.id)}
                        disabled={isRunning}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Run
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-white mb-2">Configuration</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Execution:</span>
                            <span className="text-gray-300">{pipeline.parallel ? 'Parallel' : 'Sequential'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Fail Fast:</span>
                            <span className="text-gray-300">{pipeline.failFast ? 'Yes' : 'No'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Environment:</span>
                            <span className="text-gray-300">{pipeline.environment}</span>
                          </div>
                          {pipeline.schedule && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Schedule:</span>
                              <span className="text-gray-300 font-mono">{pipeline.schedule}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-white mb-2">Test Suites ({pipeline.suites.length})</h4>
                        <div className="space-y-1">
                          {pipeline.suites.map(suiteId => {
                            const suite = TEST_SUITES.find(s => s.id === suiteId);
                            return (
                              <div key={suiteId} className="text-sm text-gray-300">
                                • {suite?.name}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Executions Tab */}
          <TabsContent value="executions">
            <Card className="bg-[var(--ff-surface)] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Execution History</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {executions.slice().reverse().map(execution => {
                      const suite = TEST_SUITES.find(s => s.id === execution.suiteId);
                      return (
                        <div key={execution.id} className="p-4 bg-gray-800 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              {execution.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-400" />}
                              {execution.status === 'failed' && <XCircle className="h-5 w-5 text-red-400" />}
                              {execution.status === 'running' && <Activity className="h-5 w-5 text-blue-400" />}
                              {execution.status === 'queued' && <Clock className="h-5 w-5 text-yellow-400" />}
                              
                              <div>
                                <div className="font-medium text-white">{suite?.name}</div>
                                <div className="text-sm text-gray-400">
                                  {execution.startTime?.toLocaleString()}
                                </div>
                              </div>
                            </div>
                            
                            <Badge variant={
                              execution.status === 'completed' ? 'default' :
                              execution.status === 'failed' ? 'destructive' :
                              'secondary'
                            }>
                              {execution.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Duration:</span>
                              <div className="font-medium text-white">{execution.duration}s</div>
                            </div>
                            <div>
                              <span className="text-gray-400">Trigger:</span>
                              <div className="font-medium text-white">{execution.trigger}</div>
                            </div>
                            <div>
                              <span className="text-gray-400">Environment:</span>
                              <div className="font-medium text-white">{execution.environment}</div>
                            </div>
                            <div>
                              <span className="text-gray-400">Build:</span>
                              <div className="font-mono text-sm text-gray-300">{execution.buildId}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card className="bg-[var(--ff-surface)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Suite Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {statistics.suiteStats.map(stat => (
                      <div key={stat.suite} className="p-4 bg-gray-800 rounded-lg">
                        <h4 className="font-medium text-white mb-2">{stat.suite}</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Success Rate:</span>
                            <span className={`font-medium ${
                              stat.successRate >= 90 ? 'text-green-400' :
                              stat.successRate >= 70 ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {stat.successRate.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Executions:</span>
                            <span className="text-gray-300">{stat.executions}</span>
                          </div>
                          <Progress value={stat.successRate} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[var(--ff-surface)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Trend Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Performance Trends</h3>
                    <p className="text-gray-400 mb-4">
                      Detailed analytics and trend analysis charts would be displayed here.
                    </p>
                    <Button variant="outline" className="border-gray-600">
                      <LineChart className="h-4 w-4 mr-2" />
                      View Detailed Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TestSuiteOrchestrator;