import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { UserPersonaSelection, type UserPersona } from '../onboarding/UserPersonaSelection';
import PersonalizedOnboarding from '../onboarding/PersonalizedOnboarding';
import { AlertCircle, CheckCircle, Clock, Zap, Users, Target } from 'lucide-react';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  component: string;
  estimatedTime: string;
  dependencies?: string[];
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  result?: any;
}

interface UserWorkflow {
  id: string;
  name: string;
  description: string;
  persona: string;
  priority: 'high' | 'medium' | 'low';
  steps: WorkflowStep[];
  totalTime: string;
  completionRate: number;
}

interface UserWorkflowOrchestratorProps {
  currentUser?: {
    id: string;
    name: string;
    persona?: UserPersona;
    onboardingCompleted: boolean;
  };
  onWorkflowComplete: (workflow: UserWorkflow) => void;
  onToolSelect: (tool: string) => void;
}

export function UserWorkflowOrchestrator({
  currentUser,
  onWorkflowComplete,
  onToolSelect
}: UserWorkflowOrchestratorProps) {
  const [currentPhase, setCurrentPhase] = useState<
    'persona-selection' | 'onboarding' | 'workflow-selection' | 'workflow-execution'
  >('persona-selection');
  
  const [selectedPersona, setSelectedPersona] = useState<UserPersona | null>(
    currentUser?.persona || null
  );
  
  const [activeWorkflow, setActiveWorkflow] = useState<UserWorkflow | null>(null);
  const [availableWorkflows, setAvailableWorkflows] = useState<UserWorkflow[]>([]);

  // Define persona-based workflows
  const getPersonaWorkflows = (persona: UserPersona): UserWorkflow[] => {
    const baseWorkflows = [
      {
        id: 'quick-start',
        name: 'Quick Start Experience',
        description: 'Get familiar with core platform features',
        persona: persona.id,
        priority: 'high' as const,
        totalTime: '10 minutes',
        completionRate: 0,
        steps: [
          {
            id: 'platform-tour',
            title: 'Platform Overview',
            description: 'Navigate the main interface and understand key features',
            component: 'PlatformTour',
            estimatedTime: '2 min',
            status: 'pending' as const
          },
          {
            id: 'first-tool',
            title: 'Try Your First Tool',
            description: 'Use one of your recommended tools',
            component: 'ToolDemo',
            estimatedTime: '3 min',
            status: 'pending' as const,
            dependencies: ['platform-tour']
          },
          {
            id: 'save-result',
            title: 'Save and Share',
            description: 'Learn to save and share your creations',
            component: 'SaveShare',
            estimatedTime: '2 min',
            status: 'pending' as const,
            dependencies: ['first-tool']
          }
        ]
      }
    ];

    switch (persona.id) {
      case 'solo-developer':
        return [
          ...baseWorkflows,
          {
            id: 'full-stack-app',
            name: 'Build Complete App',
            description: 'Create, customize, and deploy a full application',
            persona: persona.id,
            priority: 'high' as const,
            totalTime: '15 minutes',
            completionRate: 0,
            steps: [
              {
                id: 'app-concept',
                title: 'Define App Concept',
                description: 'Describe your app idea and requirements',
                component: 'AppConceptForm',
                estimatedTime: '3 min',
                status: 'pending' as const
              },
              {
                id: 'generate-app',
                title: 'Generate Application',
                description: 'AI builds your complete application',
                component: 'FullStackBuilder',
                estimatedTime: '5 min',
                status: 'pending' as const,
                dependencies: ['app-concept']
              },
              {
                id: 'customize-app',
                title: 'Customize Features',
                description: 'Modify and enhance your application',
                component: 'AppCustomizer',
                estimatedTime: '4 min',
                status: 'pending' as const,
                dependencies: ['generate-app']
              },
              {
                id: 'deploy-app',
                title: 'Deploy to Production',
                description: 'Deploy your app to live URL',
                component: 'DeploymentManager',
                estimatedTime: '3 min',
                status: 'pending' as const,
                dependencies: ['customize-app']
              }
            ]
          },
          {
            id: 'code-optimization',
            name: 'Code Optimization Workflow',
            description: 'Improve existing code with AI assistance',
            persona: persona.id,
            priority: 'medium' as const,
            totalTime: '10 minutes',
            completionRate: 0,
            steps: [
              {
                id: 'upload-code',
                title: 'Upload Existing Code',
                description: 'Share your codebase for analysis',
                component: 'CodeUploader',
                estimatedTime: '2 min',
                status: 'pending' as const
              },
              {
                id: 'analyze-code',
                title: 'AI Code Analysis',
                description: 'Get optimization recommendations',
                component: 'CodeAnalyzer',
                estimatedTime: '4 min',
                status: 'pending' as const,
                dependencies: ['upload-code']
              },
              {
                id: 'apply-optimizations',
                title: 'Apply Improvements',
                description: 'Implement suggested optimizations',
                component: 'CodeOptimizer',
                estimatedTime: '4 min',
                status: 'pending' as const,
                dependencies: ['analyze-code']
              }
            ]
          }
        ];

      case 'content-creator':
        return [
          ...baseWorkflows,
          {
            id: 'content-campaign',
            name: 'Multi-Platform Content Campaign',
            description: 'Create consistent content across all social platforms',
            persona: persona.id,
            priority: 'high' as const,
            totalTime: '12 minutes',
            completionRate: 0,
            steps: [
              {
                id: 'brand-setup',
                title: 'Define Brand Voice',
                description: 'Set up your unique brand identity',
                component: 'BrandKitGenerator',
                estimatedTime: '4 min',
                status: 'pending' as const
              },
              {
                id: 'content-batch',
                title: 'Generate Content Batch',
                description: 'Create content for multiple platforms',
                component: 'ContentBatchGenerator',
                estimatedTime: '5 min',
                status: 'pending' as const,
                dependencies: ['brand-setup']
              },
              {
                id: 'schedule-posts',
                title: 'Schedule & Publish',
                description: 'Schedule content across platforms',
                component: 'ContentScheduler',
                estimatedTime: '3 min',
                status: 'pending' as const,
                dependencies: ['content-batch']
              }
            ]
          },
          {
            id: 'monetization-setup',
            name: 'Creator Monetization',
            description: 'Set up revenue streams and commerce features',
            persona: persona.id,
            priority: 'medium' as const,
            totalTime: '8 minutes',
            completionRate: 0,
            steps: [
              {
                id: 'affiliate-setup',
                title: 'Affiliate Integration',
                description: 'Connect affiliate programs and links',
                component: 'AffiliateManager',
                estimatedTime: '3 min',
                status: 'pending' as const
              },
              {
                id: 'product-creation',
                title: 'Digital Products',
                description: 'Create digital products for sale',
                component: 'ProductCreator',
                estimatedTime: '5 min',
                status: 'pending' as const,
                dependencies: ['affiliate-setup']
              }
            ]
          }
        ];

      case 'startup-team':
        return [
          ...baseWorkflows,
          {
            id: 'team-collaboration',
            name: 'Team Collaboration Setup',
            description: 'Configure team workspace and workflows',
            persona: persona.id,
            priority: 'high' as const,
            totalTime: '18 minutes',
            completionRate: 0,
            steps: [
              {
                id: 'team-workspace',
                title: 'Create Team Workspace',
                description: 'Set up collaborative environment',
                component: 'TeamWorkspaceCreator',
                estimatedTime: '5 min',
                status: 'pending' as const
              },
              {
                id: 'invite-members',
                title: 'Invite Team Members',
                description: 'Add team members and set permissions',
                component: 'TeamInviteManager',
                estimatedTime: '3 min',
                status: 'pending' as const,
                dependencies: ['team-workspace']
              },
              {
                id: 'workflow-automation',
                title: 'Automate Workflows',
                description: 'Set up multi-agent automation',
                component: 'WorkflowAutomator',
                estimatedTime: '7 min',
                status: 'pending' as const,
                dependencies: ['invite-members']
              },
              {
                id: 'analytics-setup',
                title: 'Team Analytics',
                description: 'Configure team performance tracking',
                component: 'TeamAnalytics',
                estimatedTime: '3 min',
                status: 'pending' as const,
                dependencies: ['workflow-automation']
              }
            ]
          }
        ];

      default:
        return baseWorkflows;
    }
  };

  // Initialize workflows when persona is selected
  useEffect(() => {
    if (selectedPersona) {
      setAvailableWorkflows(getPersonaWorkflows(selectedPersona));
      
      // Skip persona selection if user already has one
      if (currentUser?.persona && currentUser.onboardingCompleted) {
        setCurrentPhase('workflow-selection');
      } else if (currentUser?.persona) {
        setCurrentPhase('onboarding');
      }
    }
  }, [selectedPersona, currentUser]);

  const handlePersonaSelect = (persona: UserPersona) => {
    setSelectedPersona(persona);
    setCurrentPhase('onboarding');
  };

  const handleOnboardingComplete = () => {
    setCurrentPhase('workflow-selection');
  };

  const handleWorkflowSelect = (workflow: UserWorkflow) => {
    setActiveWorkflow(workflow);
    setCurrentPhase('workflow-execution');
  };

  const handleStepComplete = (stepId: string, result?: any) => {
    if (!activeWorkflow) return;

    const updatedWorkflow = {
      ...activeWorkflow,
      steps: activeWorkflow.steps.map(step =>
        step.id === stepId
          ? { ...step, status: 'completed' as const, result }
          : step
      )
    };

    const completedSteps = updatedWorkflow.steps.filter(s => s.status === 'completed').length;
    updatedWorkflow.completionRate = (completedSteps / updatedWorkflow.steps.length) * 100;

    setActiveWorkflow(updatedWorkflow);

    // If all steps completed, mark workflow as complete
    if (completedSteps === updatedWorkflow.steps.length) {
      onWorkflowComplete(updatedWorkflow);
    }
  };

  const renderCurrentPhase = () => {
    switch (currentPhase) {
      case 'persona-selection':
        return (
          <UserPersonaSelection
            onPersonaSelect={handlePersonaSelect}
            onSkip={handleOnboardingComplete}
          />
        );

      case 'onboarding':
        if (!selectedPersona) return null;
        return (
          <PersonalizedOnboarding
            selectedPersona={selectedPersona}
            onComplete={handleOnboardingComplete}
            onToolSelect={onToolSelect}
          />
        );

      case 'workflow-selection':
        return (
          <WorkflowSelectionView
            workflows={availableWorkflows}
            persona={selectedPersona}
            onWorkflowSelect={handleWorkflowSelect}
            onToolSelect={onToolSelect}
          />
        );

      case 'workflow-execution':
        if (!activeWorkflow) return null;
        return (
          <WorkflowExecutionView
            workflow={activeWorkflow}
            onStepComplete={handleStepComplete}
            onToolSelect={onToolSelect}
            onBackToSelection={() => setCurrentPhase('workflow-selection')}
          />
        );

      default:
        return null;
    }
  };

  return renderCurrentPhase();
}

// Workflow Selection Component
function WorkflowSelectionView({
  workflows,
  persona,
  onWorkflowSelect,
  onToolSelect
}: {
  workflows: UserWorkflow[];
  persona: UserPersona | null;
  onWorkflowSelect: (workflow: UserWorkflow) => void;
  onToolSelect: (tool: string) => void;
}) {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl font-bold ff-text-gradient">
            Choose Your Workflow
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select a guided workflow to accomplish your goals, or explore tools freely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {workflows.map((workflow) => (
            <Card
              key={workflow.id}
              className="ff-card-interactive cursor-pointer hover:border-primary/40"
              onClick={() => onWorkflowSelect(workflow)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant={workflow.priority === 'high' ? 'default' : 'secondary'}
                  >
                    {workflow.priority}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{workflow.totalTime}</span>
                </div>
                <CardTitle className="text-lg">{workflow.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {workflow.description}
                </p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{workflow.completionRate}%</span>
                  </div>
                  <Progress value={workflow.completionRate} className="h-2" />
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {workflow.steps.length} steps
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {workflow.totalTime}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => onToolSelect('tools')}
            className="px-8"
          >
            Explore Tools Freely
          </Button>
        </div>
      </div>
    </div>
  );
}

// Workflow Execution Component
function WorkflowExecutionView({
  workflow,
  onStepComplete,
  onToolSelect,
  onBackToSelection
}: {
  workflow: UserWorkflow;
  onStepComplete: (stepId: string, result?: any) => void;
  onToolSelect: (tool: string) => void;
  onBackToSelection: () => void;
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = workflow.steps[currentStepIndex];
  const completedSteps = workflow.steps.filter(s => s.status === 'completed').length;

  const handleStepAction = () => {
    // Simulate step completion
    onStepComplete(currentStep.id, { timestamp: Date.now() });
    
    if (currentStepIndex < workflow.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold ff-text-gradient">{workflow.name}</h1>
            <p className="text-muted-foreground">{workflow.description}</p>
          </div>
          <Button variant="outline" onClick={onBackToSelection}>
            Back to Workflows
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Step {currentStepIndex + 1} of {workflow.steps.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {completedSteps} completed
            </span>
          </div>
          <Progress value={(completedSteps / workflow.steps.length) * 100} className="h-2" />
        </div>

        {/* Current Step */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              {currentStep.title}
            </CardTitle>
            <p className="text-muted-foreground">{currentStep.description}</p>
          </CardHeader>
          
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge variant="outline">{currentStep.estimatedTime}</Badge>
              <Button
                onClick={handleStepAction}
                className="ff-btn-primary"
              >
                {currentStep.status === 'completed' ? 'Completed' : 'Start Step'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* All Steps Overview */}
        <div className="space-y-3">
          <h3 className="font-semibold">Workflow Steps</h3>
          {workflow.steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                step.status === 'completed'
                  ? 'bg-success/10 border-success/20'
                  : index === currentStepIndex
                  ? 'bg-primary/10 border-primary/20'
                  : 'bg-muted/30'
              }`}
            >
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                ${step.status === 'completed'
                  ? 'bg-success text-success-foreground'
                  : index === currentStepIndex
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                {step.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : index + 1}
              </div>
              
              <div className="flex-1">
                <div className="font-medium text-sm">{step.title}</div>
                <div className="text-xs text-muted-foreground">{step.estimatedTime}</div>
              </div>
              
              {step.status === 'completed' && (
                <CheckCircle className="w-4 h-4 text-success" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserWorkflowOrchestrator;