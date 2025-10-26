import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { 
  Rocket, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Activity, 
  Users, 
  TrendingUp,
  Server,
  Database,
  Shield,
  Zap,
  Target,
  BarChart3,
  Bell,
  RefreshCw,
  PlayCircle,
  StopCircle,
  Timer,
  Monitor
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface LaunchChecklist {
  id: string;
  category: 'technical' | 'content' | 'marketing' | 'operations' | 'monitoring';
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  deadline: number;
  estimatedTime: number;
  automatable: boolean;
}

interface SystemMetrics {
  timestamp: number;
  performance: {
    responseTime: number;
    throughput: number;
    errorRate: number;
    cpuUsage: number;
    memoryUsage: number;
  };
  users: {
    active: number;
    signups: number;
    conversions: number;
    churnRate: number;
  };
  business: {
    revenue: number;
    subscriptions: number;
    supportTickets: number;
    satisfactionScore: number;
  };
}

interface LaunchGoal {
  id: string;
  metric: string;
  target: number;
  current: number;
  unit: string;
  category: 'user' | 'performance' | 'business' | 'engagement';
  priority: 'low' | 'medium' | 'high' | 'critical';
  deadline: number;
}

export function LaunchDayCommand() {
  const [launchChecklist, setLaunchChecklist] = useState<LaunchChecklist[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics[]>([]);
  const [launchGoals, setLaunchGoals] = useState<LaunchGoal[]>([]);
  const [launchStatus, setLaunchStatus] = useState<'preparing' | 'launching' | 'launched' | 'monitoring'>('preparing');
  const [countdownTime, setCountdownTime] = useState<number>(0);
  const [isLiveMonitoring, setIsLiveMonitoring] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock launch date - set to next hour for demo
  const launchDate = useMemo(() => Date.now() + 3600000, []);

  // Initialize launch data
  useEffect(() => {
    const initializeLaunchData = async () => {
      try {
        const mockChecklist: LaunchChecklist[] = [
          {
            id: 'db-backup',
            category: 'technical',
            title: 'Database Backup Complete',
            description: 'Create full database backup before launch',
            status: 'completed',
            priority: 'critical',
            assignee: 'DevOps Team',
            deadline: Date.now() - 3600000,
            estimatedTime: 30,
            automatable: true
          },
          {
            id: 'load-testing',
            category: 'technical',
            title: 'Load Testing Results Verified',
            description: 'Confirm system can handle 500+ concurrent users',
            status: 'in-progress',
            priority: 'critical',
            assignee: 'QA Team',
            deadline: Date.now() + 1800000,
            estimatedTime: 120,
            automatable: true
          },
          {
            id: 'monitoring-setup',
            category: 'operations',
            title: 'Monitoring Systems Active',
            description: 'All monitoring and alerting systems are operational',
            status: 'completed',
            priority: 'critical',
            assignee: 'DevOps Team',
            deadline: Date.now() - 600000,
            estimatedTime: 60,
            automatable: false
          }
        ];

        const mockGoals: LaunchGoal[] = [
          {
            id: 'user-signups',
            metric: 'New User Signups',
            target: 500,
            current: 127,
            unit: 'users',
            category: 'user',
            priority: 'critical',
            deadline: launchDate + 86400000
          },
          {
            id: 'response-time',
            metric: 'Average Response Time',
            target: 200,
            current: 156,
            unit: 'ms',
            category: 'performance',
            priority: 'high',
            deadline: launchDate + 3600000
          }
        ];

        const mockMetrics: SystemMetrics[] = Array.from({ length: 10 }, (_, i) => ({
          timestamp: Date.now() - (9 - i) * 60000,
          performance: {
            responseTime: Math.random() * 50 + 100,
            throughput: Math.random() * 200 + 800,
            errorRate: Math.random() * 2,
            cpuUsage: Math.random() * 30 + 20,
            memoryUsage: Math.random() * 40 + 40
          },
          users: {
            active: Math.floor(Math.random() * 50) + 100,
            signups: Math.floor(Math.random() * 10) + 5,
            conversions: Math.floor(Math.random() * 3) + 1,
            churnRate: Math.random() * 2 + 1
          },
          business: {
            revenue: Math.random() * 1000 + 500,
            subscriptions: Math.floor(Math.random() * 20) + 10,
            supportTickets: Math.floor(Math.random() * 5) + 1,
            satisfactionScore: Math.random() * 1 + 4
          }
        }));

        setLaunchChecklist(mockChecklist);
        setLaunchGoals(mockGoals);
        setSystemMetrics(mockMetrics);

      } catch (error) {
        console.error('Failed to load launch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeLaunchData();
  }, [launchDate]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeUntilLaunch = launchDate - now;
      
      if (timeUntilLaunch <= 0) {
        setCountdownTime(0);
        if (launchStatus === 'preparing') {
          setLaunchStatus('launching');
        }
      } else {
        setCountdownTime(timeUntilLaunch);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [launchDate, launchStatus]);

  const handleStartLiveMonitoring = useCallback(() => {
    setIsLiveMonitoring(true);
    setLaunchStatus('monitoring');
    toast.success('Live monitoring started!');
  }, []);

  const handleStopLiveMonitoring = useCallback(() => {
    setIsLiveMonitoring(false);
    toast.info('Live monitoring stopped');
  }, []);

  const formatTime = useCallback((ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const overallProgress = useMemo(() => {
    const total = launchChecklist.length;
    const completed = launchChecklist.filter(item => item.status === 'completed').length;
    return total > 0 ? (completed / total) * 100 : 0;
  }, [launchChecklist]);

  const criticalItemsRemaining = launchChecklist.filter(
    item => item.priority === 'critical' && item.status !== 'completed'
  ).length;

  const currentMetrics = systemMetrics[systemMetrics.length - 1];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="ff-fade-in-up">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ff-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold ff-text-gradient">Launch Day Command Center</h1>
          <p className="text-muted-foreground">
            Mission control for FlashFusion's successful launch to 500+ users
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg">T-{formatTime(countdownTime)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Until Launch</p>
          </div>
          
          <Badge 
            variant={launchStatus === 'launched' ? 'default' : 'secondary'}
            className={`font-medium ${launchStatus === 'launched' ? 'ff-badge-glow' : ''}`}
          >
            <Activity className={`h-3 w-3 mr-1 ${isLiveMonitoring ? 'animate-pulse' : ''}`} />
            {launchStatus === 'preparing' ? 'Preparing' :
             launchStatus === 'launching' ? 'Launching' :
             launchStatus === 'launched' ? 'Launched' : 'Monitoring'}
          </Badge>
        </div>
      </div>

      {/* Critical Issues Alert */}
      {criticalItemsRemaining > 0 && (
        <Alert className="border-destructive bg-destructive/5">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-destructive">Critical Items Pending</AlertTitle>
          <AlertDescription>
            {criticalItemsRemaining} critical checklist item{criticalItemsRemaining === 1 ? '' : 's'} must be completed before launch.
          </AlertDescription>
        </Alert>
      )}

      {/* Launch Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium">Launch Readiness</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">{overallProgress.toFixed(0)}%</span>
                <span className="text-sm text-muted-foreground">
                  {launchChecklist.filter(item => item.status === 'completed').length}/{launchChecklist.length}
                </span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {currentMetrics && (
          <>
            <Card className="ff-card-interactive">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Users className="h-5 w-5 text-secondary" />
                  </div>
                  <h3 className="font-medium">Active Users</h3>
                </div>
                <p className="text-2xl font-bold">{currentMetrics.users.active}</p>
                <p className="text-sm text-muted-foreground">
                  +{currentMetrics.users.signups} new signups
                </p>
              </CardContent>
            </Card>

            <Card className="ff-card-interactive">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Zap className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-medium">Performance</h3>
                </div>
                <p className="text-2xl font-bold">{currentMetrics.performance.responseTime.toFixed(0)}ms</p>
                <p className="text-sm text-muted-foreground">
                  {currentMetrics.performance.errorRate.toFixed(1)}% error rate
                </p>
              </CardContent>
            </Card>

            <Card className="ff-card-interactive">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <h3 className="font-medium">Revenue</h3>
                </div>
                <p className="text-2xl font-bold">${currentMetrics.business.revenue.toFixed(0)}</p>
                <p className="text-sm text-muted-foreground">
                  {currentMetrics.business.subscriptions} new subscriptions
                </p>
              </CardContent>
            </Card>
          </>
        )}

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Target className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="font-medium">Goals Progress</h3>
            </div>
            <p className="text-2xl font-bold">
              {launchGoals.filter(goal => (goal.current / goal.target) >= 1).length}/{launchGoals.length}
            </p>
            <p className="text-sm text-muted-foreground">Goals achieved</p>
          </CardContent>
        </Card>
      </div>

      {/* Live Monitoring Controls */}
      <Card className="ff-card-interactive">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary" />
                <span className="font-medium">Live Monitoring</span>
                {isLiveMonitoring && (
                  <Badge variant="default" className="animate-pulse">LIVE</Badge>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground">
                Real-time system monitoring and alerting
              </div>
            </div>
            
            <div className="flex gap-2">
              {!isLiveMonitoring ? (
                <Button
                  onClick={handleStartLiveMonitoring}
                  className="ff-btn-primary"
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start Monitoring
                </Button>
              ) : (
                <Button
                  onClick={handleStopLiveMonitoring}
                  variant="destructive"
                >
                  <StopCircle className="h-4 w-4 mr-2" />
                  Stop Monitoring
                </Button>
              )}
              
              <Button variant="outline" className="ff-focus-ring">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="checklist" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="checklist" className="ff-focus-ring">
            Checklist ({launchChecklist.filter(item => item.status === 'completed').length}/{launchChecklist.length})
          </TabsTrigger>
          <TabsTrigger value="metrics" className="ff-focus-ring">
            Live Metrics
          </TabsTrigger>
          <TabsTrigger value="goals" className="ff-focus-ring">
            Launch Goals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checklist" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {launchChecklist.map((item) => (
              <Card 
                key={item.id} 
                className={`ff-card-interactive ${
                  item.status === 'completed' ? 'bg-green-500/5 border-green-500/20' :
                  item.status === 'in-progress' ? 'bg-yellow-500/5 border-yellow-500/20' :
                  item.status === 'failed' ? 'bg-red-500/5 border-red-500/20' :
                  'hover:bg-muted/50'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          item.status === 'completed' ? 'bg-green-500/10' :
                          item.status === 'in-progress' ? 'bg-yellow-500/10' :
                          item.status === 'failed' ? 'bg-red-500/10' :
                          'bg-muted'
                        }`}>
                          {item.status === 'completed' ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : item.status === 'in-progress' ? (
                            <Clock className="h-5 w-5 text-yellow-500" />
                          ) : item.status === 'failed' ? (
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Priority:</span>
                          <p className={`font-medium capitalize ${
                            item.priority === 'critical' ? 'text-red-500' :
                            item.priority === 'high' ? 'text-orange-500' :
                            item.priority === 'medium' ? 'text-yellow-500' :
                            'text-blue-500'
                          }`}>
                            {item.priority}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Assignee:</span>
                          <p className="font-medium">{item.assignee || 'Unassigned'}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Time:</span>
                          <p className="font-medium">{item.estimatedTime}min</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Type:</span>
                          <p className="font-medium capitalize">{item.category}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Badge variant={
                        item.status === 'completed' ? 'default' :
                        item.status === 'in-progress' ? 'secondary' :
                        item.status === 'failed' ? 'destructive' :
                        'outline'
                      }>
                        {item.status.replace('-', ' ')}
                      </Badge>
                      
                      {item.automatable && item.status !== 'completed' && (
                        <Button size="sm" variant="outline" className="ff-focus-ring">
                          <Zap className="h-3 w-3 mr-1" />
                          Auto
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {currentMetrics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Response Time</span>
                      <span className="font-medium">{currentMetrics.performance.responseTime.toFixed(0)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Throughput</span>
                      <span className="font-medium">{currentMetrics.performance.throughput.toFixed(0)}/min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Error Rate</span>
                      <span className="font-medium">{currentMetrics.performance.errorRate.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">CPU Usage</span>
                      <span className="font-medium">{currentMetrics.performance.cpuUsage.toFixed(0)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-secondary" />
                    User Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Active Users</span>
                      <span className="font-medium">{currentMetrics.users.active}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">New Signups</span>
                      <span className="font-medium">{currentMetrics.users.signups}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Conversions</span>
                      <span className="font-medium">{currentMetrics.users.conversions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Churn Rate</span>
                      <span className="font-medium">{currentMetrics.users.churnRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    Business Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Revenue</span>
                      <span className="font-medium">${currentMetrics.business.revenue.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Subscriptions</span>
                      <span className="font-medium">{currentMetrics.business.subscriptions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Support Tickets</span>
                      <span className="font-medium">{currentMetrics.business.supportTickets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Satisfaction</span>
                      <span className="font-medium">{currentMetrics.business.satisfactionScore.toFixed(1)}/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="ff-card-interactive">
              <CardContent className="p-8 text-center">
                <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">No Metrics Available</h3>
                <p className="text-muted-foreground">Start live monitoring to see real-time metrics.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="space-y-4">
            {launchGoals.map((goal) => {
              const progress = (goal.current / goal.target) * 100;
              const isCompleted = progress >= 100;
              const daysLeft = Math.max(0, Math.ceil((goal.deadline - Date.now()) / 86400000));
              
              return (
                <Card key={goal.id} className={`ff-card-interactive ${isCompleted ? 'border-green-500/20 bg-green-500/5' : ''}`}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h4 className="font-medium text-lg">{goal.metric}</h4>
                            <Badge variant={
                              goal.priority === 'critical' ? 'destructive' :
                              goal.priority === 'high' ? 'default' :
                              'secondary'
                            }>
                              {goal.priority}
                            </Badge>
                            {isCompleted && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Target:</span>
                              <p className="font-medium">{goal.target.toLocaleString()} {goal.unit}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Category:</span>
                              <p className="font-medium capitalize">{goal.category}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${isCompleted ? 'text-green-500' : 'text-primary'}`}>
                            {goal.current.toLocaleString()}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            of {goal.target.toLocaleString()} {goal.unit}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress: {progress.toFixed(0)}%</span>
                          <span className={`${daysLeft <= 1 ? 'text-red-500' : daysLeft <= 3 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                            {daysLeft} days left
                          </span>
                        </div>
                        <Progress value={Math.min(100, progress)} className="h-3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}