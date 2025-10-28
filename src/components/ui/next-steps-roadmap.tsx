import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Progress } from './progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  Target, 
  Users, 
  Zap,
  Sparkles,
  Shield,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Step {
  id: string;
  title: string;
  description: string;
  status: 'complete' | 'in-progress' | 'planned';
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  features: string[];
  dependencies?: string[];
  icon: React.ReactNode;
}

export function NextStepsRoadmap() {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  const steps: Step[] = [
    {
      id: 'step-1',
      title: 'Complete Full-Stack App Builder',
      description: 'Real AI-powered code generation with downloadable outputs and gamification integration',
      status: 'complete',
      priority: 'high',
      estimatedTime: 'Completed',
      features: [
        'Real AI code generation using OpenAI/Anthropic APIs',
        'Complete project file structure generation',
        'ZIP download system with proper file organization',
        'Gamification integration with XP tracking',
        'Real-time code preview with syntax highlighting',
        'Multiple framework support (React, Vue, Next.js, etc.)'
      ],
      icon: <CheckCircle className="h-5 w-5 text-success" />
    },
    {
      id: 'step-2',
      title: 'Complete Gamification System',
      description: 'Full XP progression, achievement system, and real-time notifications',
      status: 'in-progress',
      priority: 'high',
      estimatedTime: '2-3 hours',
      features: [
        'Enhanced achievement system with 15+ badges',
        'Daily challenges and flash tasks',
        'Leaderboard system with real-time updates',
        'Streak tracking and bonus multipliers',
        'Level progression with unlock rewards',
        'Social sharing of achievements'
      ],
      dependencies: ['step-1'],
      icon: <Zap className="h-5 w-5 text-warning" />
    },
    {
      id: 'step-3',
      title: 'Multi-Agent Orchestration Engine',
      description: 'Real agent coordination system for complex project workflows',
      status: 'planned',
      priority: 'high',
      estimatedTime: '4-6 hours',
      features: [
        'Agent personality and role assignment',
        'Real-time task coordination and delegation',
        'Workflow pipeline with status tracking',
        'Inter-agent communication system',
        'Predictive failure detection and recovery',
        'Voice command interface for agent control'
      ],
      dependencies: ['step-1', 'step-2'],
      icon: <Users className="h-5 w-5 text-info" />
    },
    {
      id: 'step-4',
      title: 'Creator Content Pipeline',
      description: 'AI-powered content generation for all creator formats and platforms',
      status: 'planned',
      priority: 'medium',
      estimatedTime: '3-5 hours',
      features: [
        'Multi-format content generation (video, audio, text, images)',
        'Platform-specific optimization (YouTube, TikTok, Instagram, etc.)',
        'Brand kit integration and consistency',
        'Content calendar and scheduling',
        'Performance analytics and optimization',
        'Cross-platform publishing automation'
      ],
      dependencies: ['step-3'],
      icon: <Sparkles className="h-5 w-5 text-accent" />
    },
    {
      id: 'step-5',
      title: 'Intelligent Validation Nexus',
      description: 'AI-powered business idea validation with comprehensive market analysis',
      status: 'planned',
      priority: 'medium',
      estimatedTime: '3-4 hours',
      features: [
        'Market research and competitive analysis',
        'Revenue model validation and projections',
        'Technical feasibility assessment',
        'Risk analysis and mitigation strategies',
        'Go-to-market strategy recommendations',
        'Real-time validation scoring and feedback'
      ],
      dependencies: ['step-3'],
      icon: <Shield className="h-5 w-5 text-success" />
    }
  ];

  const completedSteps = steps.filter(step => step.status === 'complete').length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const handleStartStep = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (step) {
      toast.success(`🚀 Ready to implement: ${step.title}`);
      toast.info(`Estimated time: ${step.estimatedTime}`, {
        description: 'This step will add significant value to the FlashFusion platform',
        duration: 4000
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'in-progress':
        return <div className="h-4 w-4 rounded-full border-2 border-primary bg-primary/20 animate-pulse" />;
      case 'planned':
        return <Circle className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-success text-white">Complete</Badge>;
      case 'in-progress':
        return <Badge className="bg-primary text-white animate-pulse">In Progress</Badge>;
      case 'planned':
        return <Badge variant="outline">Planned</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-destructive';
      case 'medium':
        return 'border-l-4 border-warning';
      case 'low':
        return 'border-l-4 border-success';
      default:
        return 'border-l-4 border-muted';
    }
  };

  return (
    <Card className="ff-card-interactive">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="flex items-center gap-2 ff-text-gradient">
            <Target className="h-6 w-6" />
            FlashFusion Priority Roadmap
          </CardTitle>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Overall Progress</div>
            <div className="text-2xl font-bold text-primary">{completedSteps}/{totalSteps}</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Implementation Progress</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timeline">Timeline View</TabsTrigger>
            <TabsTrigger value="details">Detailed View</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`p-4 border rounded-lg transition-all duration-300 hover:shadow-md ${
                  getPriorityColor(step.priority)
                } ${selectedStep === step.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedStep(selectedStep === step.id ? null : step.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0 mt-0.5">
                      {step.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{step.title}</h3>
                        {getStatusBadge(step.status)}
                        <Badge variant="outline" className="text-xs">
                          {step.priority.toUpperCase()} PRIORITY
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {step.estimatedTime}
                        </span>
                        {step.dependencies && (
                          <span>Depends on: {step.dependencies.join(', ')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    {getStatusIcon(step.status)}
                    {step.status !== 'complete' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartStep(step.id);
                        }}
                        className="text-xs ff-hover-scale"
                      >
                        {step.status === 'in-progress' ? 'Continue' : 'Start'}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedStep === step.id && (
                  <div className="mt-4 pt-4 border-t space-y-3 ff-fade-in-up">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Key Features:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {step.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {steps.map((step) => (
                <Card key={step.id} className="ff-card-interactive">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      {step.icon}
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(step.status)}
                      <Badge variant="outline" className="text-xs">
                        {step.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Time:</span> {step.estimatedTime}
                    </div>
                    <div>
                      <div className="text-xs font-medium mb-1">Features:</div>
                      <div className="text-xs text-muted-foreground">
                        {step.features.length} key features planned
                      </div>
                    </div>
                    {step.status !== 'complete' && (
                      <Button
                        size="sm"
                        className="w-full ff-btn-primary"
                        onClick={() => handleStartStep(step.id)}
                      >
                        {step.status === 'in-progress' ? 'Continue Step' : 'Start Implementation'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-success">{completedSteps}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">
                {steps.filter(s => s.status === 'in-progress').length}
              </div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-warning">
                {steps.filter(s => s.status === 'planned').length}
              </div>
              <div className="text-xs text-muted-foreground">Planned</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-accent">
                {steps.reduce((acc, step) => acc + step.features.length, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Features</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default NextStepsRoadmap;