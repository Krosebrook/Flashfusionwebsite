import React, { useState, useEffect, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { toast } from 'sonner@2.0.3';

// Pipeline Types
interface PipelineStage {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped' | 'cancelled';
  duration?: number;
  startTime?: number;
  endTime?: number;
  logs: string[];
  artifacts?: string[];
  tests?: {
    total: number;
    passed: number;
    failed: number;
    coverage?: number;
  };
}

interface Pipeline {
  id: string;
  name: string;
  branch: string;
  commit: {
    hash: string;
    message: string;
    author: string;
    timestamp: number;
  };
  status: 'pending' | 'running' | 'success' | 'failed' | 'cancelled';
  stages: PipelineStage[];
  startTime?: number;
  endTime?: number;
  totalDuration?: number;
  deploymentUrl?: string;
  environment: 'development' | 'staging' | 'production';
}

interface DeploymentTarget {
  id: string;
  name: string;
  provider: string;
  environment: string;
  url?: string;
  status: 'connected' | 'disconnected' | 'deploying';
  lastDeployment?: number;
  health: 'healthy' | 'degraded' | 'unhealthy';
}

// Mock Data
const DEPLOYMENT_TARGETS: DeploymentTarget[] = [
  {
    id: 'vercel-prod',
    name: 'Vercel Production',
    provider: 'Vercel',
    environment: 'production',
    url: 'https://flashfusion.vercel.app',
    status: 'connected',
    lastDeployment: Date.now() - 3600000,
    health: 'healthy'
  },
  {
    id: 'netlify-staging',
    name: 'Netlify Staging',
    provider: 'Netlify',
    environment: 'staging',
    url: 'https://staging.flashfusion.app',
    status: 'connected',
    lastDeployment: Date.now() - 1800000,
    health: 'healthy'
  },
  {
    id: 'aws-dev',
    name: 'AWS Development',
    provider: 'AWS',
    environment: 'development',
    url: 'https://dev.flashfusion.aws.com',
    status: 'disconnected',
    health: 'unhealthy'
  }
];

const PIPELINE_TEMPLATES = [
  {
    id: 'react-app',
    name: 'React Application',
    stages: ['Install', 'Lint', 'Test', 'Build', 'Deploy', 'E2E Tests']
  },
  {
    id: 'full-stack',
    name: 'Full-Stack Application',
    stages: ['Install', 'Lint Backend', 'Lint Frontend', 'Test Backend', 'Test Frontend', 'Build', 'Deploy Backend', 'Deploy Frontend', 'Integration Tests']
  },
  {
    id: 'mobile-app',
    name: 'Mobile Application',
    stages: ['Install', 'Lint', 'Test', 'Build iOS', 'Build Android', 'Deploy Staging', 'UI Tests']
  }
];

const AdvancedCICDPipeline: React.FC = memo(() => {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null);
  const [deploymentTargets, setDeploymentTargets] = useState<DeploymentTarget[]>(DEPLOYMENT_TARGETS);
  const [isCreatingPipeline, setIsCreatingPipeline] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('react-app');
  const [pipelineConfig, setPipelineConfig] = useState({
    name: '',
    branch: 'main',
    environment: 'development' as Pipeline['environment'],
    autoTrigger: true,
    notifications: true
  });

  // Initialize with sample pipeline
  useEffect(() => {
    const samplePipeline: Pipeline = {
      id: 'pipeline-1',
      name: 'FlashFusion Main Build',
      branch: 'main',
      commit: {
        hash: '7a3b2c1',
        message: 'feat: Add multi-model AI integration',
        author: 'Developer',
        timestamp: Date.now() - 300000
      },
      status: 'running',
      environment: 'production',
      stages: [
        {
          id: 'install',
          name: 'Install Dependencies',
          status: 'success',
          duration: 45000,
          startTime: Date.now() - 300000,
          endTime: Date.now() - 255000,
          logs: [
            'Installing dependencies...',
            'npm install completed successfully',
            'Dependencies cached for future builds'
          ]
        },
        {
          id: 'lint',
          name: 'Code Quality Check',
          status: 'success',
          duration: 30000,
          startTime: Date.now() - 255000,
          endTime: Date.now() - 225000,
          logs: [
            'Running ESLint...',
            'Running Prettier...',
            'Code quality checks passed'
          ]
        },
        {
          id: 'test',
          name: 'Run Tests',
          status: 'success',
          duration: 120000,
          startTime: Date.now() - 225000,
          endTime: Date.now() - 105000,
          logs: [
            'Running unit tests...',
            'Running integration tests...',
            'All tests passed'
          ],
          tests: {
            total: 156,
            passed: 156,
            failed: 0,
            coverage: 92.5
          }
        },
        {
          id: 'build',
          name: 'Build Application',
          status: 'running',
          startTime: Date.now() - 105000,
          logs: [
            'Building production bundle...',
            'Optimizing assets...',
            'Generating source maps...'
          ]
        },
        {
          id: 'deploy',
          name: 'Deploy to Production',
          status: 'pending',
          logs: []
        },
        {
          id: 'e2e',
          name: 'End-to-End Tests',
          status: 'pending',
          logs: []
        }
      ],
      startTime: Date.now() - 300000
    };

    setPipelines([samplePipeline]);
    setSelectedPipeline(samplePipeline);

    // Simulate pipeline progress
    const interval = setInterval(() => {
      setPipelines(prev => prev.map(pipeline => {
        if (pipeline.status === 'running') {
          const updatedStages = pipeline.stages.map(stage => {
            if (stage.status === 'running') {
              // Simulate stage completion
              if (Math.random() > 0.7) {
                return {
                  ...stage,
                  status: 'success' as const,
                  endTime: Date.now(),
                  duration: Date.now() - (stage.startTime || Date.now()),
                  logs: [...stage.logs, `${stage.name} completed successfully`]
                };
              }
            }
            return stage;
          });

          // Move to next pending stage
          const nextPendingIndex = updatedStages.findIndex(s => s.status === 'pending');
          if (nextPendingIndex !== -1 && updatedStages[nextPendingIndex - 1]?.status === 'success') {
            updatedStages[nextPendingIndex] = {
              ...updatedStages[nextPendingIndex],
              status: 'running',
              startTime: Date.now(),
              logs: [`Starting ${updatedStages[nextPendingIndex].name}...`]
            };
          }

          // Check if all stages are complete
          const allComplete = updatedStages.every(s => s.status === 'success' || s.status === 'failed');
          
          return {
            ...pipeline,
            stages: updatedStages,
            status: allComplete ? 'success' as const : pipeline.status,
            endTime: allComplete ? Date.now() : undefined,
            totalDuration: allComplete ? Date.now() - (pipeline.startTime || Date.now()) : undefined
          };
        }
        return pipeline;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Update selected pipeline when pipelines change
  useEffect(() => {
    if (selectedPipeline) {
      const updated = pipelines.find(p => p.id === selectedPipeline.id);
      if (updated) {
        setSelectedPipeline(updated);
      }
    }
  }, [pipelines, selectedPipeline]);

  // Create new pipeline
  const createPipeline = useCallback(async () => {
    if (!pipelineConfig.name) {
      toast.error('Please enter a pipeline name');
      return;
    }

    setIsCreatingPipeline(true);

    try {
      const template = PIPELINE_TEMPLATES.find(t => t.id === selectedTemplate);
      if (!template) {
        throw new Error('Invalid template selected');
      }

      const newPipeline: Pipeline = {
        id: `pipeline-${Date.now()}`,
        name: pipelineConfig.name,
        branch: pipelineConfig.branch,
        commit: {
          hash: Math.random().toString(36).substr(2, 7),
          message: 'Latest commit',
          author: 'Developer',
          timestamp: Date.now()
        },
        status: 'pending',
        environment: pipelineConfig.environment,
        stages: template.stages.map((stageName, index) => ({
          id: `stage-${index}`,
          name: stageName,
          status: index === 0 ? 'pending' : 'pending',
          logs: []
        })),
        startTime: Date.now()
      };

      setPipelines(prev => [newPipeline, ...prev]);
      setSelectedPipeline(newPipeline);
      
      toast.success('Pipeline created successfully');
      
      // Reset form
      setPipelineConfig({
        name: '',
        branch: 'main',
        environment: 'development',
        autoTrigger: true,
        notifications: true
      });

    } catch (error) {
      console.error('Pipeline creation failed:', error);
      toast.error('Failed to create pipeline');
    } finally {
      setIsCreatingPipeline(false);
    }
  }, [pipelineConfig, selectedTemplate]);

  // Trigger pipeline
  const triggerPipeline = useCallback(async (pipelineId: string) => {
    setPipelines(prev => prev.map(pipeline => {
      if (pipeline.id === pipelineId) {
        const updatedStages = pipeline.stages.map((stage, index) => ({
          ...stage,
          status: index === 0 ? 'running' as const : 'pending' as const,
          startTime: index === 0 ? Date.now() : undefined,
          logs: index === 0 ? [`Starting ${stage.name}...`] : []
        }));

        return {
          ...pipeline,
          status: 'running' as const,
          startTime: Date.now(),
          endTime: undefined,
          totalDuration: undefined,
          stages: updatedStages
        };
      }
      return pipeline;
    }));

    toast.success('Pipeline triggered successfully');
  }, []);

  // Cancel pipeline
  const cancelPipeline = useCallback((pipelineId: string) => {
    setPipelines(prev => prev.map(pipeline => {
      if (pipeline.id === pipelineId && pipeline.status === 'running') {
        return {
          ...pipeline,
          status: 'cancelled' as const,
          endTime: Date.now(),
          totalDuration: Date.now() - (pipeline.startTime || Date.now()),
          stages: pipeline.stages.map(stage => ({
            ...stage,
            status: stage.status === 'running' ? 'cancelled' as const : stage.status
          }))
        };
      }
      return pipeline;
    }));

    toast.info('Pipeline cancelled');
  }, []);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-success text-white';
      case 'failed': return 'bg-destructive text-white';
      case 'running': return 'bg-primary text-white';
      case 'pending': return 'bg-muted text-muted-foreground';
      case 'cancelled': return 'bg-warning text-black';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Calculate pipeline progress
  const calculateProgress = (pipeline: Pipeline) => {
    const completedStages = pipeline.stages.filter(s => s.status === 'success').length;
    return (completedStages / pipeline.stages.length) * 100;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-sora">
            Advanced CI/CD Pipeline
          </h1>
          <p className="text-muted-foreground mt-2">
            Automated build, test, and deployment pipeline with real-time monitoring
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-xs">
            {pipelines.filter(p => p.status === 'running').length} Running
          </Badge>
          <Badge variant="outline" className="text-xs">
            {pipelines.filter(p => p.status === 'success').length} Successful
          </Badge>
        </div>
      </div>

      {/* Pipeline Creation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>⚙️</span>
            <span>Create New Pipeline</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Pipeline Name</label>
              <input
                type="text"
                value={pipelineConfig.name}
                onChange={(e) => setPipelineConfig(prev => ({ ...prev, name: e.target.value }))}
                placeholder="My Awesome Pipeline"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Branch</label>
              <Select
                value={pipelineConfig.branch}
                onValueChange={(value) => setPipelineConfig(prev => ({ ...prev, branch: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">main</SelectItem>
                  <SelectItem value="develop">develop</SelectItem>
                  <SelectItem value="staging">staging</SelectItem>
                  <SelectItem value="feature/*">feature/*</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Template</label>
              <Select
                value={selectedTemplate}
                onValueChange={setSelectedTemplate}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PIPELINE_TEMPLATES.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Environment</label>
              <Select
                value={pipelineConfig.environment}
                onValueChange={(value: Pipeline['environment']) => 
                  setPipelineConfig(prev => ({ ...prev, environment: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={createPipeline}
            disabled={isCreatingPipeline}
            className="bg-gradient-to-r from-primary to-secondary"
          >
            {isCreatingPipeline ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating...</span>
              </div>
            ) : (
              <>
                <span className="mr-2">🚀</span>
                Create Pipeline
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Pipeline List & Details */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pipeline List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📋</span>
              <span>Recent Pipelines</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pipelines.map((pipeline) => (
                <div
                  key={pipeline.id}
                  onClick={() => setSelectedPipeline(pipeline)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedPipeline?.id === pipeline.id ? 'bg-primary/10 border border-primary/20' : 'border border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{pipeline.name}</h4>
                    <Badge className={`text-xs ${getStatusColor(pipeline.status)}`}>
                      {pipeline.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{pipeline.branch}</span>
                      <span>{pipeline.commit.hash}</span>
                    </div>
                    
                    <Progress value={calculateProgress(pipeline)} className="h-1" />
                    
                    <div className="text-xs text-muted-foreground">
                      {pipeline.totalDuration ? 
                        `Completed in ${Math.floor(pipeline.totalDuration / 1000)}s` :
                        pipeline.startTime ? 
                          `Running for ${Math.floor((Date.now() - pipeline.startTime) / 1000)}s` :
                          'Not started'
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            {selectedPipeline ? (
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <span>🔍</span>
                  <span>{selectedPipeline.name}</span>
                  <Badge className={`text-xs ${getStatusColor(selectedPipeline.status)}`}>
                    {selectedPipeline.status}
                  </Badge>
                </CardTitle>
                
                <div className="flex items-center space-x-2">
                  {selectedPipeline.status === 'pending' && (
                    <Button
                      onClick={() => triggerPipeline(selectedPipeline.id)}
                      size="sm"
                      className="bg-gradient-to-r from-primary to-secondary"
                    >
                      Trigger
                    </Button>
                  )}
                  
                  {selectedPipeline.status === 'running' && (
                    <Button
                      onClick={() => cancelPipeline(selectedPipeline.id)}
                      size="sm"
                      variant="destructive"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <CardTitle>Select a pipeline to view details</CardTitle>
            )}
          </CardHeader>
          
          {selectedPipeline && (
            <CardContent>
              {/* Pipeline Info */}
              <div className="grid md:grid-cols-2 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
                <div>
                  <span className="text-sm font-medium">Commit:</span>
                  <p className="text-sm text-muted-foreground">
                    {selectedPipeline.commit.hash} - {selectedPipeline.commit.message}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">Author:</span>
                  <p className="text-sm text-muted-foreground">{selectedPipeline.commit.author}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Branch:</span>
                  <p className="text-sm text-muted-foreground">{selectedPipeline.branch}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Environment:</span>
                  <p className="text-sm text-muted-foreground capitalize">{selectedPipeline.environment}</p>
                </div>
              </div>

              {/* Pipeline Stages */}
              <div className="space-y-4">
                <h3 className="font-semibold mb-3">Pipeline Stages</h3>
                
                {selectedPipeline.stages.map((stage, index) => (
                  <div key={stage.id} className="flex items-start space-x-4 p-4 border border-border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getStatusColor(stage.status)}`}>
                        {index + 1}
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{stage.name}</h4>
                        <div className="flex items-center space-x-2">
                          {stage.duration && (
                            <span className="text-xs text-muted-foreground">
                              {Math.floor(stage.duration / 1000)}s
                            </span>
                          )}
                          <Badge className={`text-xs ${getStatusColor(stage.status)}`}>
                            {stage.status}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Stage Tests */}
                      {stage.tests && (
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Tests:</span> {stage.tests.passed}/{stage.tests.total}
                          </div>
                          <div>
                            <span className="font-medium">Coverage:</span> {stage.tests.coverage}%
                          </div>
                          <div>
                            <span className="font-medium">Status:</span> 
                            <Badge variant={stage.tests.failed === 0 ? 'default' : 'destructive'} className="ml-1 text-xs">
                              {stage.tests.failed === 0 ? 'Passed' : 'Failed'}
                            </Badge>
                          </div>
                        </div>
                      )}
                      
                      {/* Stage Logs */}
                      {stage.logs.length > 0 && (
                        <div className="bg-muted/50 rounded p-3">
                          <div className="space-y-1">
                            {stage.logs.slice(-3).map((log, logIndex) => (
                              <div key={logIndex} className="text-xs font-mono text-muted-foreground">
                                {log}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Deployment Targets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🎯</span>
            <span>Deployment Targets</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deploymentTargets.map((target) => (
              <div key={target.id} className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{target.name}</h4>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={target.status === 'connected' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {target.status}
                    </Badge>
                    <Badge
                      variant={target.health === 'healthy' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {target.health}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Provider:</span>
                    <span>{target.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Environment:</span>
                    <span className="capitalize">{target.environment}</span>
                  </div>
                  {target.lastDeployment && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Deploy:</span>
                      <span>{Math.floor((Date.now() - target.lastDeployment) / 60000)}m ago</span>
                    </div>
                  )}
                </div>
                
                {target.url && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-3"
                    onClick={() => window.open(target.url, '_blank')}
                  >
                    <span className="mr-2">🔗</span>
                    Visit Site
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration Alert */}
      <Alert>
        <AlertDescription>
          💡 <strong>Pro Tip:</strong> Connect your GitHub repository to enable automatic pipeline triggers on commits. 
          Set up webhooks in your repository settings to trigger builds on push, pull requests, and releases.
        </AlertDescription>
      </Alert>
    </div>
  );
});

AdvancedCICDPipeline.displayName = 'AdvancedCICDPipeline';

export default AdvancedCICDPipeline;