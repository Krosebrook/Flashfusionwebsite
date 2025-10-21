import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Play, 
  Pause, 
  RotateCcw,
  Target,
  Zap,
  Users,
  TrendingUp,
  Globe,
  Settings,
  Monitor,
  Shield,
  Rocket,
  ArrowRight
} from 'lucide-react';

interface LaunchTask {
  id: string;
  title: string;
  description: string;
  category: 'infrastructure' | 'features' | 'performance' | 'marketing' | 'validation';
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedTime: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  dependencies?: string[];
  validationSteps?: string[];
  resources?: {
    docs?: string;
    tools?: string[];
    contacts?: string[];
  };
}

interface LaunchDay {
  day: number;
  title: string;
  description: string;
  focus: string[];
  tasks: LaunchTask[];
  successCriteria: string[];
}

interface LaunchChecklistDashboardProps {
  onTaskComplete: (taskId: string) => void;
  onTaskStart: (taskId: string) => void;
  onNavigateToTool: (tool: string) => void;
}

export function LaunchChecklistDashboard({
  onTaskComplete,
  onTaskStart,
  onNavigateToTool
}: LaunchChecklistDashboardProps) {
  const [currentDay, setCurrentDay] = useState(1);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [activeTasks, setActiveTasks] = useState<Set<string>>(new Set());
  const [launchProgress, setLaunchProgress] = useState({
    overall: 0,
    infrastructure: 0,
    features: 0,
    performance: 0,
    marketing: 0
  });

  // Define the 7-day launch plan
  const LAUNCH_DAYS: LaunchDay[] = [
    {
      day: 1,
      title: 'Foundation & Infrastructure',
      description: 'Critical systems validation and performance optimization',
      focus: ['Infrastructure Setup', 'Performance Optimization', 'Security Hardening'],
      successCriteria: [
        'Production environment live and stable',
        'Monitoring and error tracking active',
        'Core workflows tested and functional',
        'Critical bugs identified and fixed'
      ],
      tasks: [
        {
          id: 'prod-deployment',
          title: 'Production Deployment',
          description: 'Deploy FlashFusion to production environment',
          category: 'infrastructure',
          priority: 'critical',
          estimatedTime: '1 hour',
          status: 'pending',
          validationSteps: [
            'Deploy to Vercel production',
            'Configure environment variables',
            'Test production URL',
            'Verify SSL certificate'
          ],
          resources: {
            docs: '/docs/deployment',
            tools: ['Vercel CLI', 'Environment Config'],
            contacts: ['DevOps Team']
          }
        },
        {
          id: 'monitoring-setup',
          title: 'Monitoring & Error Tracking',
          description: 'Configure comprehensive monitoring systems',
          category: 'infrastructure',
          priority: 'critical',
          estimatedTime: '45 minutes',
          status: 'pending',
          dependencies: ['prod-deployment'],
          validationSteps: [
            'Set up Sentry for error tracking',
            'Configure uptime monitoring',
            'Test alert notifications',
            'Create monitoring dashboard'
          ]
        },
        {
          id: 'performance-audit',
          title: 'Performance Optimization',
          description: 'Optimize Core Web Vitals and loading times',
          category: 'performance',
          priority: 'high',
          estimatedTime: '1.5 hours',
          status: 'pending',
          dependencies: ['prod-deployment'],
          validationSteps: [
            'Run Lighthouse audit',
            'Optimize bundle sizes',
            'Configure CDN',
            'Test loading performance'
          ]
        },
        {
          id: 'security-hardening',
          title: 'Security Configuration',
          description: 'Implement security headers and hardening',
          category: 'infrastructure',
          priority: 'high',
          estimatedTime: '45 minutes',
          status: 'pending',
          dependencies: ['prod-deployment'],
          validationSteps: [
            'Configure security headers',
            'Set up HTTPS redirects',
            'Test vulnerability scanning',
            'Verify data encryption'
          ]
        },
        {
          id: 'core-features-test',
          title: 'Core Feature Testing',
          description: 'End-to-end testing of critical workflows',
          category: 'features',
          priority: 'critical',
          estimatedTime: '2 hours',
          status: 'pending',
          dependencies: ['prod-deployment'],
          validationSteps: [
            'Test AI tool functionality',
            'Verify user authentication',
            'Test content generation',
            'Validate deployment pipeline'
          ]
        },
        {
          id: 'database-optimization',
          title: 'Database Performance',
          description: 'Optimize database queries and connections',
          category: 'performance',
          priority: 'medium',
          estimatedTime: '1 hour',
          status: 'pending',
          dependencies: ['prod-deployment'],
          validationSteps: [
            'Review query performance',
            'Configure connection pooling',
            'Set up database monitoring',
            'Test under load'
          ]
        }
      ]
    },
    {
      day: 2,
      title: 'User Experience & Polish',
      description: 'UX optimization and landing page creation',
      focus: ['User Experience', 'Landing Page', 'Mobile Optimization'],
      successCriteria: [
        'Smooth user onboarding experience',
        'High-converting landing page live',
        'Interactive demo showcasing core value',
        'Mobile-optimized experience'
      ],
      tasks: [
        {
          id: 'onboarding-flow',
          title: 'Onboarding Optimization',
          description: 'Streamline new user experience',
          category: 'features',
          priority: 'critical',
          estimatedTime: '2 hours',
          status: 'pending',
          validationSteps: [
            'Create guided onboarding',
            'Add progress indicators',
            'Implement smart defaults',
            'Test first-time user flow'
          ]
        },
        {
          id: 'landing-page',
          title: 'Landing Page Creation',
          description: 'Build high-converting marketing landing page',
          category: 'marketing',
          priority: 'critical',
          estimatedTime: '3 hours',
          status: 'pending',
          validationSteps: [
            'Design compelling hero section',
            'Add feature demonstrations',
            'Include social proof',
            'Optimize conversion elements'
          ]
        },
        {
          id: 'mobile-optimization',
          title: 'Mobile Experience',
          description: 'Optimize for mobile devices and touch interactions',
          category: 'features',
          priority: 'high',
          estimatedTime: '1.5 hours',
          status: 'pending',
          validationSteps: [
            'Test touch interactions',
            'Optimize responsive design',
            'Verify mobile performance',
            'Test cross-device compatibility'
          ]
        },
        {
          id: 'interactive-demo',
          title: 'Interactive Demo',
          description: 'Create engaging product demonstration',
          category: 'marketing',
          priority: 'high',
          estimatedTime: '2 hours',
          status: 'pending',
          validationSteps: [
            'Build interactive tool demo',
            'Create guided walkthrough',
            'Add call-to-action flow',
            'Test demo conversion'
          ]
        }
      ]
    },
    // Add more days as needed...
  ];

  // Calculate progress
  useEffect(() => {
    const allTasks = LAUNCH_DAYS.flatMap(day => day.tasks);
    const totalTasks = allTasks.length;
    const completedCount = Array.from(completedTasks).length;
    
    const overallProgress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
    
    // Calculate category-specific progress
    const categoryProgress = {
      infrastructure: calculateCategoryProgress(allTasks, 'infrastructure'),
      features: calculateCategoryProgress(allTasks, 'features'),
      performance: calculateCategoryProgress(allTasks, 'performance'),
      marketing: calculateCategoryProgress(allTasks, 'marketing')
    };
    
    setLaunchProgress({
      overall: overallProgress,
      ...categoryProgress
    });
  }, [completedTasks]);

  const calculateCategoryProgress = (tasks: LaunchTask[], category: string) => {
    const categoryTasks = tasks.filter(task => task.category === category);
    const completedCategoryTasks = categoryTasks.filter(task => completedTasks.has(task.id));
    return categoryTasks.length > 0 ? (completedCategoryTasks.length / categoryTasks.length) * 100 : 0;
  };

  const handleTaskAction = (task: LaunchTask, action: 'start' | 'complete' | 'navigate') => {
    switch (action) {
      case 'start':
        setActiveTasks(prev => new Set([...prev, task.id]));
        onTaskStart(task.id);
        break;
      case 'complete':
        setCompletedTasks(prev => new Set([...prev, task.id]));
        setActiveTasks(prev => {
          const newSet = new Set(prev);
          newSet.delete(task.id);
          return newSet;
        });
        onTaskComplete(task.id);
        break;
      case 'navigate':
        // Navigate to relevant tool/page based on task
        const toolMap: Record<string, string> = {
          'core-features-test': 'tools',
          'onboarding-flow': 'dashboard',
          'landing-page': 'about',
          'interactive-demo': 'demo'
        };
        const tool = toolMap[task.id] || 'dashboard';
        onNavigateToTool(tool);
        break;
    }
  };

  const getTaskIcon = (task: LaunchTask) => {
    if (completedTasks.has(task.id)) return <CheckCircle className="w-4 h-4 text-success" />;
    if (activeTasks.has(task.id)) return <Play className="w-4 h-4 text-primary animate-pulse" />;
    return <Clock className="w-4 h-4 text-muted-foreground" />;
  };

  const getTaskStatus = (task: LaunchTask) => {
    if (completedTasks.has(task.id)) return 'completed';
    if (activeTasks.has(task.id)) return 'in-progress';
    return task.status;
  };

  const getPriorityColor = (priority: LaunchTask['priority']) => {
    switch (priority) {
      case 'critical': return 'text-destructive';
      case 'high': return 'text-warning';
      case 'medium': return 'text-primary';
      case 'low': return 'text-muted-foreground';
    }
  };

  const currentDayData = LAUNCH_DAYS.find(day => day.day === currentDay);
  const dayProgress = currentDayData ? 
    (currentDayData.tasks.filter(task => completedTasks.has(task.id)).length / currentDayData.tasks.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl font-bold ff-text-gradient">
            FlashFusion Launch Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your comprehensive 7-day launch checklist. Track progress, validate systems, and ensure a successful launch.
          </p>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-primary" />
                Launch Progress
              </span>
              <Badge variant="outline">
                Day {currentDay} of 7
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {Math.round(launchProgress.overall)}%
                </div>
                <div className="text-sm text-muted-foreground">Overall</div>
                <Progress value={launchProgress.overall} className="h-2 mt-2" />
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary mb-1">
                  {Math.round(launchProgress.infrastructure)}%
                </div>
                <div className="text-sm text-muted-foreground">Infrastructure</div>
                <Progress value={launchProgress.infrastructure} className="h-2 mt-2" />
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-1">
                  {Math.round(launchProgress.features)}%
                </div>
                <div className="text-sm text-muted-foreground">Features</div>
                <Progress value={launchProgress.features} className="h-2 mt-2" />
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-warning mb-1">
                  {Math.round(launchProgress.performance)}%
                </div>
                <div className="text-sm text-muted-foreground">Performance</div>
                <Progress value={launchProgress.performance} className="h-2 mt-2" />
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-success mb-1">
                  {Math.round(launchProgress.marketing)}%
                </div>
                <div className="text-sm text-muted-foreground">Marketing</div>
                <Progress value={launchProgress.marketing} className="h-2 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Day Selection */}
        <Tabs 
          value={currentDay.toString()} 
          onValueChange={(value) => setCurrentDay(parseInt(value))}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-7">
            {LAUNCH_DAYS.map((day) => (
              <TabsTrigger
                key={day.day}
                value={day.day.toString()}
                className={`text-xs ${day.day === currentDay ? 'bg-primary/20' : ''}`}
              >
                Day {day.day}
              </TabsTrigger>
            ))}
          </TabsList>

          {LAUNCH_DAYS.map((day) => (
            <TabsContent key={day.day} value={day.day.toString()}>
              <div className="space-y-6">
                {/* Day Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Day {day.day}: {day.title}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{Math.round(dayProgress)}% Complete</Badge>
                        <Badge variant="secondary">{day.tasks.length} Tasks</Badge>
                      </div>
                    </CardTitle>
                    <p className="text-muted-foreground">{day.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Focus Areas:</h4>
                      <div className="flex flex-wrap gap-2">
                        {day.focus.map((focus, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {focus}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Success Criteria:</h4>
                      <ul className="space-y-1">
                        {day.successCriteria.map((criteria, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-success" />
                            {criteria}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Progress value={dayProgress} className="h-2" />
                  </CardContent>
                </Card>

                {/* Tasks */}
                <div className="grid gap-4">
                  {day.tasks.map((task) => {
                    const taskStatus = getTaskStatus(task);
                    const isBlocked = task.dependencies?.some(dep => !completedTasks.has(dep));
                    
                    return (
                      <Card 
                        key={task.id}
                        className={`transition-all duration-300 ${
                          taskStatus === 'completed' ? 'bg-success/10 border-success/20' :
                          taskStatus === 'in-progress' ? 'bg-primary/10 border-primary/20' :
                          isBlocked ? 'bg-muted/30 opacity-60' : 'hover:border-primary/40'
                        }`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 mt-1">
                              {getTaskIcon(task)}
                            </div>
                            
                            <div className="flex-1 space-y-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold">{task.title}</h3>
                                  <Badge
                                    variant={task.priority === 'critical' ? 'destructive' : 'outline'}
                                    className={`text-xs ${getPriorityColor(task.priority)}`}
                                  >
                                    {task.priority}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {task.estimatedTime}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {task.description}
                                </p>
                              </div>

                              {task.dependencies && task.dependencies.length > 0 && (
                                <div>
                                  <div className="text-xs text-muted-foreground mb-1">Dependencies:</div>
                                  <div className="flex flex-wrap gap-1">
                                    {task.dependencies.map((dep) => (
                                      <Badge
                                        key={dep}
                                        variant="outline"
                                        className={`text-xs ${completedTasks.has(dep) ? 'text-success' : 'text-muted-foreground'}`}
                                      >
                                        {dep}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {task.validationSteps && (
                                <div>
                                  <div className="text-xs text-muted-foreground mb-1">Validation Steps:</div>
                                  <ul className="space-y-1">
                                    {task.validationSteps.map((step, index) => (
                                      <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                                        {step}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              <div className="flex items-center gap-2">
                                {taskStatus === 'completed' ? (
                                  <Badge variant="outline" className="text-success">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Completed
                                  </Badge>
                                ) : taskStatus === 'in-progress' ? (
                                  <Button
                                    size="sm"
                                    onClick={() => handleTaskAction(task, 'complete')}
                                    className="ff-btn-primary"
                                  >
                                    Mark Complete
                                  </Button>
                                ) : !isBlocked ? (
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleTaskAction(task, 'start')}
                                      className="ff-btn-primary"
                                    >
                                      <Play className="w-3 h-3 mr-1" />
                                      Start Task
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleTaskAction(task, 'navigate')}
                                    >
                                      <ArrowRight className="w-3 h-3 mr-1" />
                                      Go to Tool
                                    </Button>
                                  </div>
                                ) : (
                                  <Badge variant="outline" className="text-muted-foreground">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    Blocked
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default LaunchChecklistDashboard;