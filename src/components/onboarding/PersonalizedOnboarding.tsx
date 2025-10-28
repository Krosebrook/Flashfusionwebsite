import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { CheckCircle, ArrowRight, Play, Zap } from 'lucide-react';
import type { UserPersona } from './UserPersonaSelection';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  action: string;
  tool: string;
  estimatedTime: string;
  completed: boolean;
  optional?: boolean;
}

interface PersonalizedOnboardingProps {
  selectedPersona: UserPersona;
  onComplete: () => void;
  onToolSelect: (tool: string) => void;
}

export function PersonalizedOnboarding({ 
  selectedPersona, 
  onComplete, 
  onToolSelect 
}: PersonalizedOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);

  // Generate personalized onboarding steps based on persona
  const getPersonalizedSteps = (persona: UserPersona): OnboardingStep[] => {
    const baseSteps: OnboardingStep[] = [
      {
        id: 'welcome',
        title: 'Welcome Setup',
        description: 'Quick platform overview and navigation',
        action: 'Watch 60-second intro',
        tool: 'Platform Tour',
        estimatedTime: '1 min',
        completed: false
      }
    ];

    switch (persona.id) {
      case 'solo-developer':
        return [
          ...baseSteps,
          {
            id: 'first-app',
            title: 'Build Your First App',
            description: 'Create a React to-do app in under 3 minutes',
            action: 'Try Full-Stack Builder',
            tool: 'Full-Stack Builder',
            estimatedTime: '3 min',
            completed: false
          },
          {
            id: 'code-optimization',
            title: 'Code Optimization',
            description: 'Learn how AI can optimize your existing code',
            action: 'Upload code for analysis',
            tool: 'Code Optimizer',
            estimatedTime: '2 min',
            completed: false
          },
          {
            id: 'deployment',
            title: 'One-Click Deployment',
            description: 'Deploy your app to Vercel instantly',
            action: 'Deploy to production',
            tool: 'Deployment Manager',
            estimatedTime: '1 min',
            completed: false
          }
        ];

      case 'content-creator':
        return [
          ...baseSteps,
          {
            id: 'brand-setup',
            title: 'Create Your Brand Kit',
            description: 'Generate consistent brand assets and voice',
            action: 'Build brand identity',
            tool: 'Brand Kit Generator',
            estimatedTime: '2 min',
            completed: false
          },
          {
            id: 'content-generation',
            title: 'Generate Content',
            description: 'Create social media posts for all platforms',
            action: 'Generate first content',
            tool: 'Creator Content Pipeline',
            estimatedTime: '2 min',
            completed: false
          },
          {
            id: 'monetization',
            title: 'Monetization Setup',
            description: 'Set up affiliate links and commerce features',
            action: 'Configure monetization',
            tool: 'Creator Commerce Hub',
            estimatedTime: '3 min',
            completed: false,
            optional: true
          }
        ];

      case 'startup-team':
        return [
          ...baseSteps,
          {
            id: 'team-setup',
            title: 'Team Collaboration',
            description: 'Set up real-time collaboration workspace',
            action: 'Create team workspace',
            tool: 'Team Collaboration',
            estimatedTime: '3 min',
            completed: false
          },
          {
            id: 'multi-agent',
            title: 'Multi-Agent Workflow',
            description: 'Create automated development pipeline',
            action: 'Build first workflow',
            tool: 'Multi-Agent Orchestration',
            estimatedTime: '5 min',
            completed: false
          },
          {
            id: 'analytics',
            title: 'Team Analytics',
            description: 'Monitor team productivity and progress',
            action: 'Set up analytics',
            tool: 'Analytics Dashboard',
            estimatedTime: '2 min',
            completed: false
          }
        ];

      case 'agency-team':
        return [
          ...baseSteps,
          {
            id: 'client-portal',
            title: 'Client Portal Setup',
            description: 'Create client communication hub',
            action: 'Set up client access',
            tool: 'Client Portal',
            estimatedTime: '4 min',
            completed: false
          },
          {
            id: 'multi-project',
            title: 'Multi-Project Management',
            description: 'Manage multiple client projects efficiently',
            action: 'Create project dashboard',
            tool: 'Multi-Project Orchestrator',
            estimatedTime: '5 min',
            completed: false
          },
          {
            id: 'bulk-operations',
            title: 'Bulk Content Generation',
            description: 'Generate content for multiple clients at once',
            action: 'Try bulk generation',
            tool: 'Bulk Export Manager',
            estimatedTime: '3 min',
            completed: false
          }
        ];

      case 'enterprise-developer':
        return [
          ...baseSteps,
          {
            id: 'security-setup',
            title: 'Security Compliance',
            description: 'Configure enterprise security settings',
            action: 'Set up compliance monitoring',
            tool: 'Security Compliance Monitor',
            estimatedTime: '5 min',
            completed: false
          },
          {
            id: 'integration-setup',
            title: 'Enterprise Integrations',
            description: 'Connect to existing enterprise systems',
            action: 'Configure integrations',
            tool: 'Custom Integration Hub',
            estimatedTime: '10 min',
            completed: false
          },
          {
            id: 'audit-setup',
            title: 'Audit Dashboard',
            description: 'Set up compliance and audit tracking',
            action: 'Configure audit settings',
            tool: 'Audit Dashboard',
            estimatedTime: '3 min',
            completed: false,
            optional: true
          }
        ];

      default:
        return baseSteps;
    }
  };

  const [steps] = useState<OnboardingStep[]>(getPersonalizedSteps(selectedPersona));
  const progress = (completedSteps.size / steps.length) * 100;

  const handleStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleToolLaunch = (tool: string, stepId: string) => {
    onToolSelect(tool);
    handleStepComplete(stepId);
  };

  const isAllComplete = completedSteps.size === steps.length;

  const playIntroVideo = () => {
    setIsPlaying(true);
    // Simulate video playing
    setTimeout(() => {
      setIsPlaying(false);
      handleStepComplete('welcome');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="text-6xl mb-4">{selectedPersona.icon}</div>
          <h1 className="text-3xl font-bold ff-text-gradient">
            Welcome, {selectedPersona.title}!
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Let's get you started with the tools that matter most to you. 
            This personalized tour will have you productive in {selectedPersona.timeToValue}.
          </p>
          
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{selectedPersona.timeToValue}</div>
              <div className="text-xs text-muted-foreground">Time to Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{steps.length}</div>
              <div className="text-xs text-muted-foreground">Quick Steps</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{selectedPersona.primaryTools.length}</div>
              <div className="text-xs text-muted-foreground">Primary Tools</div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Setup Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedSteps.size} of {steps.length} complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-8">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.has(step.id);
            const isCurrent = index === currentStep;
            const isAccessible = index <= currentStep || isCompleted;

            return (
              <Card
                key={step.id}
                className={`transition-all duration-300 ${
                  isCompleted
                    ? 'bg-success/10 border-success/20'
                    : isCurrent
                    ? 'ring-2 ring-primary bg-primary/5 border-primary/20'
                    : 'bg-muted/30'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1
                      ${isCompleted 
                        ? 'bg-success text-success-foreground' 
                        : isCurrent 
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                      }
                    `}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">
                            {step.title}
                          </h3>
                          {step.optional && (
                            <Badge variant="outline" className="text-xs">
                              Optional
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {step.estimatedTime}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>

                      {isAccessible && !isCompleted && (
                        <div className="flex items-center gap-3">
                          {step.id === 'welcome' ? (
                            <Button
                              onClick={playIntroVideo}
                              disabled={isPlaying}
                              className="ff-btn-primary"
                              size="sm"
                            >
                              {isPlaying ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                  Playing...
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  {step.action}
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleToolLaunch(step.tool, step.id)}
                              className="ff-btn-primary"
                              size="sm"
                            >
                              <Zap className="w-4 h-4 mr-2" />
                              {step.action}
                            </Button>
                          )}
                          
                          <span className="text-xs text-muted-foreground">
                            Using: {step.tool}
                          </span>
                        </div>
                      )}

                      {isCompleted && (
                        <div className="flex items-center gap-2 text-success">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Completion */}
        {isAllComplete && (
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                <div className="text-4xl">🎉</div>
                <h3 className="text-xl font-bold ff-text-gradient">
                  Congratulations! You're all set up.
                </h3>
                <p className="text-muted-foreground">
                  You've completed your personalized onboarding. You're now ready to use FlashFusion to its full potential.
                </p>
                <Button
                  onClick={onComplete}
                  className="ff-btn-primary"
                  size="lg"
                >
                  Start Building
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skip Option */}
        {!isAllComplete && (
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={onComplete}
              className="text-muted-foreground"
            >
              Skip onboarding and explore freely
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PersonalizedOnboarding;