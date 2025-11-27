import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Alert, AlertDescription } from '../../ui/alert';
import { Separator } from '../../ui/separator';
import { 
  GitBranch, 
  Search, 
  Code, 
  TestTube, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Zap,
  Users,
  Download,
  Share2,
  Play,
  ArrowRight,
  Settings,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { RepositoryAnalyzer } from './RepositoryAnalyzer';
import { EnhancedCodeGenerator } from './EnhancedCodeGenerator';
import { IntegrationTester } from './IntegrationTester';
import { TeamDevelopmentDashboard } from '../../collaboration/TeamDevelopmentDashboard';

interface Repository {
  id: string;
  url: string;
  branch: string;
  accessToken?: string;
  provider: 'github' | 'gitlab' | 'bitbucket';
  isPrivate: boolean;
}

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  component: 'analyzer' | 'generator' | 'tester' | 'collaboration';
  required: boolean;
}

interface RepositoryIntegrationWorkflowProps {
  repository?: Repository;
  onWorkflowComplete?: (results: any) => void;
}

export function RepositoryIntegrationWorkflow({ 
  repository, 
  onWorkflowComplete 
}: RepositoryIntegrationWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [testResults, setTestResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('workflow');
  const [overallProgress, setOverallProgress] = useState(0);

  // Initialize workflow steps
  useEffect(() => {
    const steps: WorkflowStep[] = [
      {
        id: 'analyze',
        name: 'Repository Analysis',
        description: 'Analyze codebase structure, technologies, and patterns',
        status: 'pending',
        component: 'analyzer',
        required: true
      },
      {
        id: 'generate',
        name: 'Enhanced Code Generation',
        description: 'Generate context-aware code based on repository patterns',
        status: 'pending',
        component: 'generator',
        required: true
      },
      {
        id: 'test',
        name: 'Integration Testing',
        description: 'Validate generated code and integration workflow',
        status: 'pending',
        component: 'tester',
        required: false
      },
      {
        id: 'collaborate',
        name: 'Team Collaboration',
        description: 'Share results and collaborate with team members',
        status: 'pending',
        component: 'collaboration',
        required: false
      }
    ];

    setWorkflowSteps(steps);
  }, []);

  const updateStepStatus = useCallback((stepId: string, status: WorkflowStep['status']) => {
    setWorkflowSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  }, []);

  const runFullWorkflow = useCallback(async () => {
    if (!repository) {
      toast.error('Please connect a repository first');
      return;
    }

    setIsRunning(true);
    setOverallProgress(0);

    try {
      // Step 1: Repository Analysis
      setCurrentStep(0);
      updateStepStatus('analyze', 'running');
      setOverallProgress(25);
      
      toast.info('Starting repository analysis...');
      
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysis = {
        structure: [],
        technologies: ['React', 'TypeScript', 'Tailwind CSS'],
        recommendations: ['Add error boundaries', 'Implement proper loading states'],
        codebase_summary: 'Modern React application with TypeScript and Tailwind CSS',
        complexity: 'medium' as const,
        maintainability: 85,
        patterns: ['Component-based Architecture', 'Custom Hooks Pattern']
      };
      
      setAnalysisResults(mockAnalysis);
      updateStepStatus('analyze', 'completed');
      setOverallProgress(50);
      
      toast.success('Repository analysis completed!');

      // Step 2: Code Generation
      setCurrentStep(1);
      updateStepStatus('generate', 'running');
      
      toast.info('Generating enhanced code...');
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockCode = `import React, { useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface EnhancedComponentProps {
  title: string;
  onAction?: () => void;
}

export function EnhancedComponent({ title, onAction }: EnhancedComponentProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = useCallback(async () => {
    setIsLoading(true);
    try {
      await onAction?.();
    } finally {
      setIsLoading(false);
    }
  }, [onAction]);

  return (
    <Card className="ff-card-interactive">
      <CardHeader>
        <CardTitle className="ff-text-gradient">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleAction}
          disabled={isLoading}
          className="ff-btn-primary ff-hover-glow"
        >
          {isLoading ? 'Processing...' : 'Take Action'}
        </Button>
      </CardContent>
    </Card>
  );
}`;

      setGeneratedCode(mockCode);
      updateStepStatus('generate', 'completed');
      setOverallProgress(75);
      
      toast.success('Code generation completed!');

      // Step 3: Integration Testing (Optional)
      setCurrentStep(2);
      updateStepStatus('test', 'running');
      
      toast.info('Running integration tests...');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTestResults = {
        totalTests: 12,
        passed: 10,
        failed: 0,
        warnings: 2,
        duration: 1500,
        overallStatus: 'warning' as const,
        recommendations: ['Add unit tests for custom hooks', 'Consider adding accessibility tests']
      };
      
      setTestResults(mockTestResults);
      updateStepStatus('test', 'completed');
      setOverallProgress(90);
      
      toast.success('Integration tests completed!');

      // Step 4: Collaboration Setup
      setCurrentStep(3);
      updateStepStatus('collaborate', 'completed');
      setOverallProgress(100);
      
      if (onWorkflowComplete) {
        onWorkflowComplete({
          analysis: analysisResults,
          generatedCode,
          testResults: mockTestResults
        });
      }

      toast.success('🎉 Repository integration workflow completed successfully!');
    } catch (error) {
      console.error('Workflow error:', error);
      const currentStepId = workflowSteps[currentStep]?.id;
      if (currentStepId) {
        updateStepStatus(currentStepId, 'error');
      }
      toast.error('Workflow failed. Please try again.');
    } finally {
      setIsRunning(false);
    }
  }, [repository, currentStep, workflowSteps, onWorkflowComplete, updateStepStatus, analysisResults, generatedCode]);

  const runSingleStep = useCallback(async (stepId: string) => {
    const step = workflowSteps.find(s => s.id === stepId);
    if (!step || !repository) return;

    updateStepStatus(stepId, 'running');
    
    try {
      switch (stepId) {
        case 'analyze':
          toast.info('Running repository analysis...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          updateStepStatus(stepId, 'completed');
          break;
          
        case 'generate':
          if (!analysisResults) {
            toast.error('Please complete repository analysis first');
            updateStepStatus(stepId, 'error');
            return;
          }
          toast.info('Generating code...');
          await new Promise(resolve => setTimeout(resolve, 3000));
          updateStepStatus(stepId, 'completed');
          break;
          
        case 'test':
          if (!generatedCode) {
            toast.error('Please generate code first');
            updateStepStatus(stepId, 'error');
            return;
          }
          toast.info('Running tests...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          updateStepStatus(stepId, 'completed');
          break;
          
        case 'collaborate':
          updateStepStatus(stepId, 'completed');
          setActiveTab('collaboration');
          break;
      }
      
      toast.success(`${step.name} completed!`);
    } catch (error) {
      updateStepStatus(stepId, 'error');
      toast.error(`${step.name} failed`);
    }
  }, [workflowSteps, repository, analysisResults, generatedCode, updateStepStatus]);

  const getStepIcon = (step: WorkflowStep) => {
    switch (step.component) {
      case 'analyzer': return <Search className="w-4 h-4" />;
      case 'generator': return <Code className="w-4 h-4" />;
      case 'tester': return <TestTube className="w-4 h-4" />;
      case 'collaboration': return <Users className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-ff-success" />;
      case 'running': return <RefreshCw className="w-4 h-4 text-ff-primary animate-spin" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-ff-error" />;
      default: return null;
    }
  };

  const getStatusColor = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed': return 'border-ff-success bg-ff-success/10';
      case 'running': return 'border-ff-primary bg-ff-primary/10';
      case 'error': return 'border-ff-error bg-ff-error/10';
      default: return 'border-ff-text-muted bg-ff-surface';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold ff-text-gradient">Repository Integration Workflow</h1>
          <p className="text-ff-text-secondary mt-1">
            End-to-end AI-powered development workflow for repository integration
          </p>
        </div>
        
        {repository && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-ff-text-primary">
                {repository.url.split('/').slice(-2).join('/')}
              </div>
              <div className="text-xs text-ff-text-muted">
                {repository.branch} • {repository.provider}
              </div>
            </div>
            
            <Button 
              onClick={runFullWorkflow}
              disabled={isRunning}
              className="ff-btn-primary ff-hover-glow"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Full Workflow
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {!repository && (
        <Alert className="border-ff-warning/20 bg-ff-warning/5">
          <AlertCircle className="h-4 w-4 text-ff-warning" />
          <AlertDescription className="text-ff-warning">
            Please connect a repository first to use the integration workflow.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="analyzer">Analyzer</TabsTrigger>
          <TabsTrigger value="generator">Generator</TabsTrigger>
          <TabsTrigger value="tester">Tester</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
        </TabsList>

        <TabsContent value="workflow" className="space-y-6">
          {/* Progress Overview */}
          {isRunning && (
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-ff-primary" />
                  Workflow Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="w-full ff-progress-bar" />
                  <div className="text-sm text-ff-text-muted">
                    {isRunning ? `Running step ${currentStep + 1} of ${workflowSteps.length}` : 'Workflow completed'}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Workflow Steps */}
          <div className="grid gap-4">
            {workflowSteps.map((step, index) => (
              <Card key={step.id} className={`ff-card-interactive transition-all ${getStatusColor(step.status)}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-ff-surface flex items-center justify-center">
                          {getStepIcon(step)}
                        </div>
                        <div className="text-lg font-medium text-ff-text-primary">
                          {index + 1}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-ff-text-primary">{step.name}</h3>
                          {step.required && (
                            <Badge variant="outline" className="text-xs">Required</Badge>
                          )}
                          {getStatusIcon(step.status)}
                        </div>
                        <p className="text-sm text-ff-text-secondary">{step.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => runSingleStep(step.id)}
                        disabled={isRunning}
                        variant="outline"
                        size="sm"
                        className="ff-focus-ring"
                      >
                        {step.status === 'completed' ? (
                          <>
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Re-run
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 mr-1" />
                            Run
                          </>
                        )}
                      </Button>
                      
                      {step.status === 'completed' && (
                        <Button
                          onClick={() => setActiveTab(step.component)}
                          variant="outline"
                          size="sm"
                          className="ff-focus-ring"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {index < workflowSteps.length - 1 && (
                    <div className="flex justify-center mt-4">
                      <ArrowRight className="w-4 h-4 text-ff-text-muted" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Results Summary */}
          {workflowSteps.every(step => step.status === 'completed' || !step.required) && (
            <Card className="ff-card-interactive border-ff-success/20 bg-ff-success/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-ff-success" />
                  Workflow Completed Successfully
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-ff-primary">
                      {analysisResults ? '✓' : '○'}
                    </div>
                    <div className="text-sm text-ff-text-muted">Analysis Complete</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-ff-secondary">
                      {generatedCode ? generatedCode.split('\n').length : 0}
                    </div>
                    <div className="text-sm text-ff-text-muted">Lines Generated</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-ff-accent">
                      {testResults ? testResults.passed : 0}
                    </div>
                    <div className="text-sm text-ff-text-muted">Tests Passed</div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-center gap-2">
                  <Button variant="outline" className="ff-focus-ring">
                    <Download className="w-4 h-4 mr-2" />
                    Export Results
                  </Button>
                  
                  <Button variant="outline" className="ff-focus-ring">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share with Team
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveTab('collaboration')}
                    className="ff-btn-primary ff-hover-glow"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Start Collaboration
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analyzer">
          {repository ? (
            <RepositoryAnalyzer 
              repository={repository}
              onAnalysisComplete={setAnalysisResults}
            />
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please connect a repository to use the analyzer.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="generator">
          {repository ? (
            <EnhancedCodeGenerator 
              repository={repository}
              repositoryAnalysis={analysisResults}
              onCodeGenerated={(code) => setGeneratedCode(code)}
            />
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please connect a repository to use the generator.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="tester">
          <IntegrationTester 
            repository={repository}
            generatedCode={generatedCode}
            onTestComplete={setTestResults}
          />
        </TabsContent>

        <TabsContent value="collaboration">
          <TeamDevelopmentDashboard 
            userId="current-user"
            onSessionCreate={(session) => {
              toast.success(`Created collaboration session: ${session.name}`);
            }}
            onSessionJoin={(sessionId) => {
              toast.success(`Joined collaboration session`);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default RepositoryIntegrationWorkflow;