import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Sparkles, 
  Rocket, 
  Zap, 
  Target,
  Play,
  Star,
  Gift,
  Users,
  Settings,
  X
} from 'lucide-react';
import { PageType } from '../../types/core';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'secondary' | 'outline';
  };
  highlight?: {
    element: string;
    position: 'top' | 'bottom' | 'left' | 'right';
    offset?: number;
  };
  autoAdvance?: boolean;
  skippable?: boolean;
}

interface OnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  userLevel?: number;
  setCurrentPage: (page: PageType) => void;
  setShowWizard: (show: boolean) => void;
}

export function OnboardingFlow({ 
  isOpen, 
  onClose, 
  onComplete, 
  userLevel = 1,
  setCurrentPage,
  setShowWizard 
}: OnboardingFlowProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isHighlighting, setIsHighlighting] = useState(false);

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to FlashFusion!',
      description: 'Your AI-powered development journey starts here',
      icon: Sparkles,
      content: (
        <div className="space-y-4 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center ff-pulse-glow">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold ff-text-gradient">Welcome to FlashFusion!</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              The most powerful AI development platform that helps you build applications 
              70% faster with our comprehensive suite of tools and gamified learning experience.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">60+</div>
              <div className="text-xs text-muted-foreground">AI Tools</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-secondary">8+</div>
              <div className="text-xs text-muted-foreground">Platforms</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-accent">25K+</div>
              <div className="text-xs text-muted-foreground">Developers</div>
            </div>
          </div>
        </div>
      ),
      skippable: false
    },
    {
      id: 'dashboard',
      title: 'Your Command Center',
      description: 'Track your progress and daily challenges',
      icon: Target,
      content: (
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <Target className="w-12 h-12 text-primary mx-auto" />
            <h3 className="text-xl font-bold">Your Dashboard</h3>
            <p className="text-muted-foreground">
              Track your XP, daily tasks, and project progress all in one place.
            </p>
          </div>
          <Card className="ff-card-interactive">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Star className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Level {userLevel}</div>
                  <div className="text-sm text-muted-foreground">Your current level</div>
                </div>
              </div>
              <Progress value={30} className="h-2 mb-2" />
              <div className="text-xs text-muted-foreground">300/1000 XP to next level</div>
            </CardContent>
          </Card>
        </div>
      ),
      action: {
        label: 'View Dashboard',
        onClick: () => setCurrentPage('dashboard')
      }
    },
    {
      id: 'tools',
      title: 'AI Tools Arsenal',
      description: 'Discover 60+ powerful AI development tools',
      icon: Zap,
      content: (
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <Zap className="w-12 h-12 text-secondary mx-auto" />
            <h3 className="text-xl font-bold">60+ AI Tools</h3>
            <p className="text-muted-foreground">
              From code generation to deployment automation, we've got you covered.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {['Code Generator', 'UI Designer', 'API Builder', 'Database Helper'].map((tool, index) => (
              <Card key={tool} className="ff-card-interactive text-center p-3">
                <div className="w-8 h-8 mx-auto rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-2">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-medium">{tool}</div>
              </Card>
            ))}
          </div>
        </div>
      ),
      action: {
        label: 'Explore Tools',
        onClick: () => setCurrentPage('tools')
      }
    },
    {
      id: 'project',
      title: 'Create Your First Project',
      description: 'Start building with our guided wizard',
      icon: Rocket,
      content: (
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <Rocket className="w-12 h-12 text-accent mx-auto" />
            <h3 className="text-xl font-bold">Create Your First Project</h3>
            <p className="text-muted-foreground">
              Our wizard will guide you through setting up your perfect development environment.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
              <CheckCircle className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <div className="font-medium">Choose Framework</div>
                <div className="text-sm text-muted-foreground">React, Vue, Angular & more</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
              <CheckCircle className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <div className="font-medium">Select Features</div>
                <div className="text-sm text-muted-foreground">Authentication, database, etc.</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
              <CheckCircle className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <div className="font-medium">Deploy Instantly</div>
                <div className="text-sm text-muted-foreground">One-click deployment</div>
              </div>
            </div>
          </div>
        </div>
      ),
      action: {
        label: 'Start Project Wizard',
        onClick: () => {
          setShowWizard(true);
          onClose();
        }
      }
    },
    {
      id: 'gamification',
      title: 'Level Up Your Skills',
      description: 'Earn XP, unlock achievements, and climb leaderboards',
      icon: Gift,
      content: (
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <Gift className="w-12 h-12 text-primary mx-auto" />
            <h3 className="text-xl font-bold">Gamified Learning</h3>
            <p className="text-muted-foreground">
              Every action earns XP. Complete daily challenges and unlock achievements.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="font-medium">Use AI Tool</span>
              </div>
              <Badge className="bg-primary text-white">+25 XP</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/10 border border-secondary/20">
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-secondary" />
                <span className="font-medium">Deploy Project</span>
              </div>
              <Badge className="bg-secondary text-white">+200 XP</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10 border border-accent/20">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-accent" />
                <span className="font-medium">Daily Streak</span>
              </div>
              <Badge className="bg-accent text-white">+50 XP</Badge>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'community',
      title: 'Join the Community',
      description: 'Connect with 25,000+ developers worldwide',
      icon: Users,
      content: (
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <Users className="w-12 h-12 text-secondary mx-auto" />
            <h3 className="text-xl font-bold">Join 25K+ Developers</h3>
            <p className="text-muted-foreground">
              Share your projects, get feedback, and learn from the community.
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-xl font-bold text-primary">4.9/5</div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold text-secondary">50K+</div>
                <div className="text-xs text-muted-foreground">Apps Built</div>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold text-accent">24/7</div>
                <div className="text-xs text-muted-foreground">Support</div>
              </div>
            </div>
          </div>
        </div>
      ),
      skippable: true
    }
  ];

  const currentStep = onboardingSteps[currentStepIndex];

  const goToNextStep = () => {
    if (currentStep) {
      setCompletedSteps(prev => new Set([...prev, currentStep.id]));
    }
    
    if (currentStepIndex < onboardingSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Completed all steps
      onComplete();
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const skipOnboarding = () => {
    onComplete();
  };

  // Handle highlighting
  useEffect(() => {
    if (currentStep?.highlight) {
      setIsHighlighting(true);
      const timer = setTimeout(() => setIsHighlighting(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const progress = ((currentStepIndex + 1) / onboardingSteps.length) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
            <DialogHeader className="pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                  Getting Started
                </DialogTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {currentStepIndex + 1} of {onboardingSteps.length}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <DialogDescription className="sr-only">
                {currentStep?.description || `Step ${currentStepIndex + 1} of ${onboardingSteps.length} in the FlashFusion onboarding process`}
              </DialogDescription>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="text-sm text-muted-foreground">
                  Step {currentStepIndex + 1}: {currentStep?.title}
                </div>
              </div>
            </DialogHeader>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="py-4"
              >
                {currentStep?.content}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                {currentStepIndex > 0 && (
                  <Button
                    variant="outline"
                    onClick={goToPreviousStep}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                )}
                {currentStep?.skippable && (
                  <Button
                    variant="ghost"
                    onClick={skipOnboarding}
                    className="text-muted-foreground"
                  >
                    Skip Tour
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Custom Action Button */}
                {currentStep?.action && (
                  <Button
                    variant={currentStep.action.variant || 'outline'}
                    onClick={() => {
                      currentStep.action!.onClick();
                      if (currentStep.action!.variant !== 'outline') {
                        goToNextStep();
                      }
                    }}
                  >
                    {currentStep.action.label}
                  </Button>
                )}

                {/* Next/Complete Button */}
                <Button
                  className="ff-btn-primary"
                  onClick={goToNextStep}
                >
                  {currentStepIndex === onboardingSteps.length - 1 ? (
                    <>
                      Complete
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

// Hook to manage onboarding state
export function useOnboarding() {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding (you'd store this in localStorage or user preferences)
    const completed = localStorage.getItem('ff_onboarding_completed');
    setHasCompletedOnboarding(!!completed);
    
    // Show onboarding for new users
    if (!completed) {
      const timer = setTimeout(() => setIsOnboardingOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const startOnboarding = () => {
    setIsOnboardingOpen(true);
  };

  const completeOnboarding = () => {
    setIsOnboardingOpen(false);
    setHasCompletedOnboarding(true);
    localStorage.setItem('ff_onboarding_completed', 'true');
  };

  const resetOnboarding = () => {
    localStorage.removeItem('ff_onboarding_completed');
    setHasCompletedOnboarding(false);
  };

  return {
    isOnboardingOpen,
    hasCompletedOnboarding,
    startOnboarding,
    completeOnboarding,
    resetOnboarding,
    closeOnboarding: () => setIsOnboardingOpen(false)
  };
}