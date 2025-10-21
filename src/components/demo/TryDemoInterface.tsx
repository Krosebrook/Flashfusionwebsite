/**
 * @fileoverview Try Demo Interface
 * @category demo
 * @version 1.0.0
 * 
 * Interactive demo interface that showcases FlashFusion capabilities
 * without requiring authentication or registration.
 */

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  ArrowLeft, 
  Rocket, 
  Zap, 
  DollarSign, 
  BarChart3, 
  Users, 
  Play, 
  CheckCircle,
  Star,
  Code,
  Palette,
  Globe,
  Shield,
  Activity,
  Sparkles,
  ChevronRight,
  FileText,
  Database,
  Settings
} from 'lucide-react';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: number;
  interactive: boolean;
  completed: boolean;
}

interface DemoWorkflow {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  steps: DemoStep[];
  estimatedTime: string;
}

export const TryDemoInterface: React.FC = () => {
  const [currentWorkflow, setCurrentWorkflow] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [demoProgress, setDemoProgress] = useState(0);

  const demoWorkflows: DemoWorkflow[] = [
    {
      id: 'ai-creation',
      name: 'AI-Powered Creation',
      description: 'Watch as FlashFusion generates a complete web application from a simple description',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500',
      estimatedTime: '3 min',
      steps: [
        {
          id: 'prompt-input',
          title: 'Project Description',
          description: 'Enter your project idea in natural language',
          icon: <FileText className="w-5 h-5" />,
          duration: 2000,
          interactive: true,
          completed: false
        },
        {
          id: 'ai-analysis',
          title: 'AI Analysis',
          description: 'FlashFusion analyzes your requirements and plans the architecture',
          icon: <Sparkles className="w-5 h-5" />,
          duration: 3000,
          interactive: false,
          completed: false
        },
        {
          id: 'code-generation',
          title: 'Code Generation',
          description: 'AI generates optimized React, TypeScript, and API code',
          icon: <Code className="w-5 h-5" />,
          duration: 4000,
          interactive: false,
          completed: false
        },
        {
          id: 'ui-design',
          title: 'UI/UX Design',
          description: 'Automatically creates beautiful, responsive user interfaces',
          icon: <Palette className="w-5 h-5" />,
          duration: 3000,
          interactive: false,
          completed: false
        },
        {
          id: 'preview-ready',
          title: 'Preview Ready',
          description: 'Your complete application is ready for preview and deployment',
          icon: <CheckCircle className="w-5 h-5" />,
          duration: 1000,
          interactive: true,
          completed: false
        }
      ]
    },
    {
      id: 'one-click-publishing',
      name: 'One-Click Publishing',
      description: 'Deploy your application to multiple platforms instantly',
      icon: <Rocket className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      estimatedTime: '2 min',
      steps: [
        {
          id: 'platform-selection',
          title: 'Choose Platforms',
          description: 'Select from 15+ deployment platforms',
          icon: <Globe className="w-5 h-5" />,
          duration: 2000,
          interactive: true,
          completed: false
        },
        {
          id: 'environment-setup',
          title: 'Environment Setup',
          description: 'Configure production environment and variables',
          icon: <Settings className="w-5 h-5" />,
          duration: 3000,
          interactive: false,
          completed: false
        },
        {
          id: 'deployment-process',
          title: 'Deployment',
          description: 'Deploy to Vercel, Netlify, and AWS simultaneously',
          icon: <Activity className="w-5 h-5" />,
          duration: 4000,
          interactive: false,
          completed: false
        },
        {
          id: 'live-monitoring',
          title: 'Live & Monitored',
          description: 'Your app is live with real-time monitoring enabled',
          icon: <BarChart3 className="w-5 h-5" />,
          duration: 1000,
          interactive: true,
          completed: false
        }
      ]
    },
    {
      id: 'creator-commerce',
      name: 'Creator Commerce',
      description: 'Transform your creation into a revenue-generating business',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      estimatedTime: '4 min',
      steps: [
        {
          id: 'monetization-analysis',
          title: 'Revenue Analysis',
          description: 'AI identifies monetization opportunities in your application',
          icon: <Database className="w-5 h-5" />,
          duration: 3000,
          interactive: false,
          completed: false
        },
        {
          id: 'payment-integration',
          title: 'Payment Setup',
          description: 'Integrate Stripe, PayPal, and subscription management',
          icon: <DollarSign className="w-5 h-5" />,
          duration: 3000,
          interactive: false,
          completed: false
        },
        {
          id: 'marketing-tools',
          title: 'Marketing Automation',
          description: 'Set up email campaigns, analytics, and user engagement',
          icon: <Users className="w-5 h-5" />,
          duration: 3000,
          interactive: false,
          completed: false
        },
        {
          id: 'revenue-dashboard',
          title: 'Revenue Dashboard',
          description: 'Monitor sales, subscriptions, and growth metrics',
          icon: <BarChart3 className="w-5 h-5" />,
          duration: 2000,
          interactive: true,
          completed: false
        }
      ]
    }
  ];

  const handleBackToLanding = () => {
    // Navigate back to landing page
    window.location.href = '/';
  };

  const handleStartWorkflow = (workflowId: string) => {
    setCurrentWorkflow(workflowId);
    setCurrentStep(0);
    setIsPlaying(false);
    setCompletedSteps(new Set());
    setDemoProgress(0);
  };

  const handlePlayDemo = () => {
    setIsPlaying(true);
    playNextStep();
  };

  const playNextStep = () => {
    const workflow = demoWorkflows.find(w => w.id === currentWorkflow);
    if (!workflow || currentStep >= workflow.steps.length) {
      setIsPlaying(false);
      return;
    }

    const step = workflow.steps[currentStep];
    
    // Simulate step execution
    setTimeout(() => {
      setCompletedSteps(prev => new Set([...prev, step.id]));
      setDemoProgress(((currentStep + 1) / workflow.steps.length) * 100);
      
      if (currentStep < workflow.steps.length - 1) {
        setCurrentStep(prev => prev + 1);
        playNextStep();
      } else {
        setIsPlaying(false);
      }
    }, step.duration);
  };

  // Enhanced sign up with conversion tracking
  const handleSignUp = () => {
    try {
      // Track demo completion for analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'demo_completed', {
          demo_type: currentWorkflow || 'overview',
          conversion_source: 'demo_interface'
        });
      }

      // Navigate to sign up with promotional context
      const signupUrl = new URL(window.location.origin);
      signupUrl.searchParams.set('signup', 'true');
      signupUrl.searchParams.set('source', 'demo');
      signupUrl.searchParams.set('promo', '50OFF');
      signupUrl.searchParams.set('workflow', currentWorkflow || 'general');
      
      window.location.href = signupUrl.toString();
    } catch (error) {
      console.error('Demo signup navigation error:', error);
      // Fallback to simple navigation
      window.location.href = '/?signup=true&source=demo&promo=50OFF';
    }
  };

  const currentWorkflowData = demoWorkflows.find(w => w.id === currentWorkflow);

  if (currentWorkflow && currentWorkflowData) {
    return (
      <div className="min-h-screen bg-[var(--ff-bg-dark)] text-white">
        {/* Demo Header */}
        <div className="bg-[var(--ff-surface)] border-b border-white/10 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setCurrentWorkflow(null)}
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Workflows
              </Button>
              <div className="h-6 w-px bg-white/20" />
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 bg-gradient-to-br ${currentWorkflowData.color} rounded-lg flex items-center justify-center`}>
                  {currentWorkflowData.icon}
                </div>
                <div>
                  <h1 className="font-semibold text-lg">{currentWorkflowData.name}</h1>
                  <p className="text-sm text-white/60">Interactive Demo</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-[var(--ff-primary)] text-white">
                🎯 Demo Mode
              </Badge>
              <Button onClick={handleSignUp} className="bg-[var(--ff-primary)] hover:bg-[var(--ff-primary)]/90">
                Sign Up to Build Real Apps
              </Button>
            </div>
          </div>
        </div>

        {/* Demo Progress */}
        <div className="bg-[var(--ff-surface)] px-6 py-3 border-b border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/80">Demo Progress</span>
              <span className="text-sm text-white/80">{Math.round(demoProgress)}% Complete</span>
            </div>
            <Progress value={demoProgress} className="h-2" />
          </div>
        </div>

        {/* Demo Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Steps Timeline */}
            <div className="lg:col-span-1">
              <Card className="bg-[var(--ff-surface)] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Workflow Steps</CardTitle>
                  <CardDescription className="text-white/60">
                    Follow along as FlashFusion executes each step
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentWorkflowData.steps.map((step, index) => (
                      <div
                        key={step.id}
                        className={`flex items-start space-x-3 p-3 rounded-lg transition-all ${
                          index === currentStep && isPlaying
                            ? 'bg-[var(--ff-primary)]/20 border border-[var(--ff-primary)]/40'
                            : completedSteps.has(step.id)
                            ? 'bg-green-500/20 border border-green-500/40'
                            : 'bg-white/5'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          completedSteps.has(step.id)
                            ? 'bg-green-500 text-white'
                            : index === currentStep && isPlaying
                            ? 'bg-[var(--ff-primary)] text-white animate-pulse'
                            : 'bg-white/10 text-white/60'
                        }`}>
                          {completedSteps.has(step.id) ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <span className="text-xs font-bold">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white">{step.title}</div>
                          <div className="text-sm text-white/60">{step.description}</div>
                          {index === currentStep && isPlaying && (
                            <div className="mt-2">
                              <div className="text-xs text-[var(--ff-primary)] font-medium">Processing...</div>
                              <Progress value={50} className="h-1 mt-1" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {!isPlaying && completedSteps.size === 0 && (
                    <Button
                      onClick={handlePlayDemo}
                      className="w-full mt-6 bg-[var(--ff-primary)] hover:bg-[var(--ff-primary)]/90"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Demo
                    </Button>
                  )}
                  
                  {completedSteps.size === currentWorkflowData.steps.length && (
                    <div className="mt-6 p-4 bg-green-500/20 border border-green-500/40 rounded-lg text-center">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <div className="font-medium text-white">Demo Complete!</div>
                      <div className="text-sm text-white/60 mb-3">
                        Ready to build your own app?
                      </div>
                      <Button
                        onClick={handleSignUp}
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                      >
                        Sign Up Free
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Demo Visualization */}
            <div className="lg:col-span-2">
              <Card className="bg-[var(--ff-surface)] border-white/10 h-full">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Live Demo Visualization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-black/20 rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden">
                    {/* Simulated Code Editor */}
                    <div className="absolute inset-4 bg-[#1e1e1e] rounded-lg border border-white/10 overflow-hidden">
                      <div className="h-8 bg-[#2d2d2d] border-b border-white/10 flex items-center px-3">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="ml-4 text-xs text-white/60">FlashFusion AI Generator</div>
                      </div>
                      <div className="p-4 font-mono text-sm">
                        {isPlaying || completedSteps.size > 0 ? (
                          <div className="space-y-2">
                            <div className="text-green-400">// FlashFusion AI is generating your application...</div>
                            <div className="text-blue-400">import React from 'react';</div>
                            <div className="text-blue-400">import {'{Component}'} from './components';</div>
                            <div className="text-white/80">
                              {completedSteps.has('ai-analysis') && (
                                <div className="mt-2">
                                  <div className="text-yellow-400">// Architecture analysis complete ✓</div>
                                </div>
                              )}
                              {completedSteps.has('code-generation') && (
                                <div className="mt-2">
                                  <div className="text-purple-400">export const App = () =&gt; {'{'}</div>
                                  <div className="text-white/60 ml-4">return &lt;YourAmazingApp /&gt;;</div>
                                  <div className="text-purple-400">{'}'}</div>
                                </div>
                              )}
                              {completedSteps.has('ui-design') && (
                                <div className="mt-2">
                                  <div className="text-cyan-400">// Beautiful UI components generated ✓</div>
                                  <div className="text-cyan-400">// Responsive design applied ✓</div>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-white/40 text-center mt-16">
                            Click "Start Demo" to watch FlashFusion build your app
                          </div>
                        )}
                        
                        {isPlaying && (
                          <div className="absolute bottom-4 right-4">
                            <div className="flex items-center space-x-2 text-[var(--ff-primary)]">
                              <div className="w-2 h-2 bg-[var(--ff-primary)] rounded-full animate-pulse"></div>
                              <span className="text-xs">AI Processing...</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Demo Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-[var(--ff-primary)]">
                        {completedSteps.size}
                      </div>
                      <div className="text-sm text-white/60">Steps Completed</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-[var(--ff-secondary)]">
                        {Math.round(demoProgress)}%
                      </div>
                      <div className="text-sm text-white/60">Progress</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-[var(--ff-accent)]">
                        {currentWorkflowData.estimatedTime}
                      </div>
                      <div className="text-sm text-white/60">Demo Length</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main demo selection screen
  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)] text-white">
      {/* Demo Header */}
      <div className="bg-[var(--ff-surface)] border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleBackToLanding}
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div className="h-6 w-px bg-white/20" />
            <div>
              <h1 className="font-semibold text-xl">FlashFusion Interactive Demo</h1>
              <p className="text-sm text-white/60">Experience AI-powered development in action</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-[var(--ff-primary)] text-white">
              🎯 No Sign-up Required
            </Badge>
            <Button onClick={handleSignUp} className="bg-[var(--ff-primary)] hover:bg-[var(--ff-primary)]/90">
              Sign Up to Build Real Apps
            </Button>
          </div>
        </div>
      </div>

      {/* Demo Introduction */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            See FlashFusion in Action
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Choose a workflow below to watch how FlashFusion transforms ideas into 
            production-ready applications using the power of AI.
          </p>
        </div>

        {/* Demo Workflows */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {demoWorkflows.map((workflow) => (
            <Card
              key={workflow.id}
              className="bg-[var(--ff-surface)] border-white/10 hover:border-white/20 transition-all cursor-pointer group"
              onClick={() => handleStartWorkflow(workflow.id)}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${workflow.color} rounded-2xl flex items-center justify-center mx-auto text-white group-hover:scale-110 transition-transform`}>
                    {workflow.icon}
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold text-white">{workflow.name}</h3>
                    <p className="text-sm text-white/60">{workflow.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="outline" className="border-white/20 text-white/80">
                      {workflow.estimatedTime}
                    </Badge>
                    <div className="flex items-center text-white/60 group-hover:text-[var(--ff-primary)] transition-colors">
                      <span className="mr-1">Try Demo</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Demo Features */}
        <Card className="bg-[var(--ff-surface)] border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-center">What You'll Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-[var(--ff-primary)] rounded-xl flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white">AI in Action</h3>
                <p className="text-sm text-white/60">
                  Watch our AI analyze requirements, generate code, and create beautiful interfaces automatically.
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-[var(--ff-secondary)] rounded-xl flex items-center justify-center mx-auto">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white">Real Workflows</h3>
                <p className="text-sm text-white/60">
                  Experience authentic development workflows that mirror real-world application building.
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-[var(--ff-accent)] rounded-xl flex items-center justify-center mx-auto">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white">No Commitment</h3>
                <p className="text-sm text-white/60">
                  Try everything without signing up. See if FlashFusion is right for your projects.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TryDemoInterface;