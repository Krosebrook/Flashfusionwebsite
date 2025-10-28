import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Target, Zap, Rocket, User, Briefcase, Code, Palette } from 'lucide-react';
import { analyticsService } from '../../services/AnalyticsService';
import type { UserPersona } from './UserPersonaSelection';

interface OnboardingData {
  persona: UserPersona | null;
  experience: string;
  goals: string[];
  primaryUseCase: string;
  techStack: string[];
  projectScale: string;
  timeline: string;
  collaboration: boolean;
  newsletter: boolean;
  completedSteps: number;
}

interface OptimizedOnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

const PERSONAS: UserPersona[] = [
  {
    id: 'developer',
    title: 'Developer',
    description: 'Build full-stack applications with AI assistance',
    icon: Code,
    tools: ['Full-Stack Builder', 'Code Generator', 'Deployment Manager'],
    color: 'primary'
  },
  {
    id: 'creator',
    title: 'Content Creator',
    description: 'Generate content and build your creator business',
    icon: Palette,
    tools: ['Content Generator', 'Brand Kit Generator', 'Creator Commerce'],
    color: 'secondary'
  },
  {
    id: 'entrepreneur',
    title: 'Entrepreneur',
    description: 'Launch and scale your business with AI tools',
    icon: Rocket,
    tools: ['Multi-Agent Orchestration', 'Analytics Dashboard', 'Team Collaboration'],
    color: 'accent'
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    description: 'Scale team productivity with advanced AI workflows',
    icon: Briefcase,
    tools: ['Team Collaboration', 'Deployment Manager', 'Security Monitor'],
    color: 'primary'
  }
];

const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Beginner (0-1 years)', description: 'New to development/content creation' },
  { value: 'intermediate', label: 'Intermediate (2-5 years)', description: 'Some experience with tools and workflows' },
  { value: 'advanced', label: 'Advanced (5+ years)', description: 'Experienced with complex projects' },
  { value: 'expert', label: 'Expert (10+ years)', description: 'Industry veteran and thought leader' }
];

const GOALS = [
  { id: 'build-apps', label: 'Build Full-Stack Applications', icon: Code },
  { id: 'generate-content', label: 'Generate High-Quality Content', icon: Palette },
  { id: 'automate-workflows', label: 'Automate Development Workflows', icon: Zap },
  { id: 'scale-team', label: 'Scale Team Productivity', icon: Briefcase },
  { id: 'deploy-fast', label: 'Deploy to Production Quickly', icon: Rocket },
  { id: 'analyze-performance', label: 'Monitor & Optimize Performance', icon: Target }
];

const TECH_STACKS = [
  'React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte',
  'Node.js', 'Python', 'Java', 'C#', 'Go', 'Rust',
  'TypeScript', 'JavaScript', 'PHP', 'Ruby', 'Swift', 'Kotlin'
];

const PROJECT_SCALES = [
  { value: 'personal', label: 'Personal Projects', description: 'Side projects and learning' },
  { value: 'startup', label: 'Startup/Small Business', description: '1-10 team members' },
  { value: 'medium', label: 'Medium Business', description: '10-100 team members' },
  { value: 'enterprise', label: 'Enterprise', description: '100+ team members' }
];

const TIMELINES = [
  { value: 'immediate', label: 'Immediate (This week)', urgency: 'high' },
  { value: 'month', label: 'Within a month', urgency: 'medium' },
  { value: 'quarter', label: 'Within 3 months', urgency: 'low' },
  { value: 'exploring', label: 'Just exploring', urgency: 'none' }
];

export function OptimizedOnboardingFlow({ onComplete, onSkip }: OptimizedOnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    persona: null,
    experience: '',
    goals: [],
    primaryUseCase: '',
    techStack: [],
    projectScale: '',
    timeline: '',
    collaboration: false,
    newsletter: true,
    completedSteps: 0
  });

  const [startTime] = useState(Date.now());
  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  // Track onboarding analytics
  useEffect(() => {
    analyticsService.trackOnboardingStart();
    
    return () => {
      const duration = Date.now() - startTime;
      analyticsService.trackOnboardingAbandoned(currentStep, duration);
    };
  }, []);

  useEffect(() => {
    if (currentStep > data.completedSteps) {
      setData(prev => ({ ...prev, completedSteps: currentStep }));
      analyticsService.trackOnboardingStepCompleted(currentStep, Date.now() - startTime);
    }
  }, [currentStep, data.completedSteps, startTime]);

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleComplete = useCallback(() => {
    const duration = Date.now() - startTime;
    analyticsService.trackOnboardingCompleted(data, duration);
    onComplete(data);
  }, [data, onComplete, startTime]);

  const handleSkip = useCallback(() => {
    const duration = Date.now() - startTime;
    analyticsService.trackOnboardingSkipped(currentStep, duration);
    onSkip();
  }, [currentStep, onSkip, startTime]);

  const updateData = useCallback((updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const isStepValid = useCallback(() => {
    switch (currentStep) {
      case 0: return data.persona !== null;
      case 1: return data.experience !== '';
      case 2: return data.goals.length > 0;
      case 3: return data.primaryUseCase.trim().length > 0;
      case 4: return data.projectScale !== '' && data.timeline !== '';
      case 5: return true; // Final step
      default: return false;
    }
  }, [currentStep, data]);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            key="persona"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold ff-text-gradient">Welcome to FlashFusion!</h2>
              <p className="text-muted-foreground">
                Let's personalize your AI development experience. Choose your primary role:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PERSONAS.map((persona) => {
                const Icon = persona.icon;
                const isSelected = data.persona?.id === persona.id;
                
                return (
                  <Card
                    key={persona.id}
                    className={`ff-card-interactive cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => updateData({ persona })}
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${
                          persona.color === 'primary' ? 'bg-primary/10 text-primary' :
                          persona.color === 'secondary' ? 'bg-secondary/10 text-secondary' :
                          'bg-accent/10 text-accent'
                        }`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{persona.title}</h3>
                          <p className="text-sm text-muted-foreground">{persona.description}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Top Tools:</p>
                        <div className="flex flex-wrap gap-1">
                          {persona.tools.slice(0, 3).map((tool) => (
                            <Badge key={tool} variant="secondary" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            key="experience"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">What's your experience level?</h2>
              <p className="text-muted-foreground">
                This helps us tailor recommendations and complexity levels for you.
              </p>
            </div>

            <div className="space-y-3">
              {EXPERIENCE_LEVELS.map((level) => (
                <Card
                  key={level.value}
                  className={`ff-card-interactive cursor-pointer transition-all duration-200 ${
                    data.experience === level.value 
                      ? 'ring-2 ring-primary bg-primary/5' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => updateData({ experience: level.value })}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">{level.label}</h4>
                        <p className="text-sm text-muted-foreground">{level.description}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                        data.experience === level.value 
                          ? 'bg-primary border-primary' 
                          : 'border-muted-foreground'
                      }`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="goals"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">What do you want to achieve?</h2>
              <p className="text-muted-foreground">
                Select all goals that interest you. We'll prioritize relevant tools and features.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {GOALS.map((goal) => {
                const Icon = goal.icon;
                const isSelected = data.goals.includes(goal.id);
                
                return (
                  <Card
                    key={goal.id}
                    className={`ff-card-interactive cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => {
                      const newGoals = isSelected 
                        ? data.goals.filter(g => g !== goal.id)
                        : [...data.goals, goal.id];
                      updateData({ goals: newGoals });
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg transition-colors ${
                          isSelected 
                            ? 'bg-primary/20 text-primary' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{goal.label}</h4>
                        </div>
                        <Checkbox 
                          checked={isSelected}
                          className="ff-focus-ring"
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {data.goals.length > 0 && (
              <div className="text-center">
                <Badge variant="secondary" className="ff-badge-glow">
                  {data.goals.length} goal{data.goals.length === 1 ? '' : 's'} selected
                </Badge>
              </div>
            )}
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="usecase"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Tell us about your primary project</h2>
              <p className="text-muted-foreground">
                Describe what you're working on or planning to build. This helps us recommend the best tools.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">Project Description</label>
                <Textarea
                  placeholder="e.g., Building a SaaS platform for team collaboration, Creating content for my YouTube channel, Developing an e-commerce store..."
                  value={data.primaryUseCase}
                  onChange={(e) => updateData({ primaryUseCase: e.target.value })}
                  className="ff-focus-ring min-h-[100px] resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {data.primaryUseCase.length}/500 characters
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Tech Stack (Optional)</label>
                <div className="flex flex-wrap gap-2">
                  {TECH_STACKS.map((tech) => {
                    const isSelected = data.techStack.includes(tech);
                    return (
                      <Badge
                        key={tech}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer transition-all duration-200 ${
                          isSelected ? 'ff-badge-glow' : 'hover:bg-muted'
                        }`}
                        onClick={() => {
                          const newTechStack = isSelected 
                            ? data.techStack.filter(t => t !== tech)
                            : [...data.techStack, tech];
                          updateData({ techStack: newTechStack });
                        }}
                      >
                        {tech}
                      </Badge>
                    );
                  })}
                </div>
                {data.techStack.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {data.techStack.length} technologies selected
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="context"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Project scale & timeline</h2>
              <p className="text-muted-foreground">
                Help us understand your project scope and urgency.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Project Scale</h3>
                <div className="space-y-2">
                  {PROJECT_SCALES.map((scale) => (
                    <Card
                      key={scale.value}
                      className={`ff-card-interactive cursor-pointer transition-all duration-200 ${
                        data.projectScale === scale.value 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => updateData({ projectScale: scale.value })}
                    >
                      <CardContent className="p-3">
                        <div className="space-y-1">
                          <h4 className="font-medium text-sm">{scale.label}</h4>
                          <p className="text-xs text-muted-foreground">{scale.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Timeline</h3>
                <div className="space-y-2">
                  {TIMELINES.map((timeline) => (
                    <Card
                      key={timeline.value}
                      className={`ff-card-interactive cursor-pointer transition-all duration-200 ${
                        data.timeline === timeline.value 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => updateData({ timeline: timeline.value })}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{timeline.label}</h4>
                          <Badge 
                            variant={timeline.urgency === 'high' ? 'destructive' : 
                                   timeline.urgency === 'medium' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {timeline.urgency === 'high' ? 'Urgent' :
                             timeline.urgency === 'medium' ? 'Soon' :
                             timeline.urgency === 'low' ? 'Planned' : 'Exploring'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="final"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">You're all set!</h2>
              <p className="text-muted-foreground">
                One last step: would you like to stay updated on new features and tips?
              </p>
            </div>

            <Card className="ff-card-interactive">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={data.collaboration}
                      onCheckedChange={(checked) => updateData({ collaboration: !!checked })}
                      className="ff-focus-ring"
                    />
                    <div className="space-y-1">
                      <p className="font-medium">Enable team collaboration features</p>
                      <p className="text-sm text-muted-foreground">
                        Share projects, collaborate in real-time, and manage team access
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={data.newsletter}
                      onCheckedChange={(checked) => updateData({ newsletter: !!checked })}
                      className="ff-focus-ring"
                    />
                    <div className="space-y-1">
                      <p className="font-medium">Subscribe to FlashFusion updates</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified about new AI tools, features, and productivity tips
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                  <h4 className="font-medium text-sm">Your Personalized Setup:</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground">Role:</span>
                      <p className="font-medium">{data.persona?.title}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Experience:</span>
                      <p className="font-medium capitalize">{data.experience}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Goals:</span>
                      <p className="font-medium">{data.goals.length} selected</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tech Stack:</span>
                      <p className="font-medium">{data.techStack.length || 'Any'} technologies</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl ff-fade-in-up">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Getting Started
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {totalSteps}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip Setup
            </Button>
          </div>
          
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-8">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
          
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="ff-focus-ring"
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              {currentStep === totalSteps - 1 ? (
                <Button
                  onClick={handleComplete}
                  className="ff-btn-primary px-8"
                >
                  Complete Setup
                  <Rocket className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="ff-btn-primary px-8"
                >
                  Next Step
                  <Zap className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}