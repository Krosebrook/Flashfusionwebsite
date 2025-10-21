import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { motion, AnimatePresence } from 'motion/react';
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
  Globe,
  MessageSquare,
  Share2,
  Target,
  BarChart3,
  Settings,
  Eye,
  Bell,
  RefreshCw,
  PlayCircle,
  StopCircle,
  Calendar,
  Timer,
  Gauge,
  AlertCircle,
  ThumbsUp,
  ChevronRight,
  Download,
  Upload,
  Network,
  Monitor
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { analyticsService } from '../../services/AnalyticsService';

interface LaunchChecklist {
  id: string;
  category: 'technical' | 'content' | 'marketing' | 'operations' | 'monitoring';
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  deadline: number;
  estimatedTime: number; // minutes
  dependencies?: string[];
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

interface MarketingCampaign {
  id: string;
  name: string;
  platform: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  reach: number;
  engagement: number;
  conversions: number;
  budget: number;
  spent: number;
  startTime: number;
  endTime: number;
}

interface LaunchIncident {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'monitoring';
  assignee: string;
  createdAt: number;
  resolvedAt?: number;
  impact: string;
}

export function LaunchDayCommand() {
  const [launchChecklist, setLaunchChecklist] = useState<LaunchChecklist[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics[]>([]);
  const [launchGoals, setLaunchGoals] = useState<LaunchGoal[]>([]);
  const [marketingCampaigns, setMarketingCampaigns] = useState<MarketingCampaign[]>([]);
  const [incidents, setIncidents] = useState<LaunchIncident[]>([]);
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
        // Mock launch checklist
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
            id: 'cdn-config',
            category: 'technical',
            title: 'CDN Configuration Verified',
            description: 'Ensure CDN is properly configured for global distribution',
            status: 'completed',
            priority: 'high',
            assignee: 'Infrastructure Team',
            deadline: Date.now() - 1800000,
            estimatedTime: 45,
            automatable: false
          },
          {
            id: 'ssl-certificates',
            category: 'technical',
            title: 'SSL Certificates Updated',
            description: 'Verify all SSL certificates are valid and properly configured',
            status: 'completed',
            priority: 'critical',
            assignee: 'Security Team',
            deadline: Date.now() - 900000,
            estimatedTime: 20,
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
            dependencies: ['db-backup'],
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
          },
          {
            id: 'analytics-tracking',
            category: 'marketing',
            title: 'Analytics Tracking Configured',
            description: 'Verify all analytics and conversion tracking is working',
            status: 'completed',
            priority: 'high',
            assignee: 'Marketing Team',
            deadline: Date.now() - 300000,
            estimatedTime: 30,
            automatable: false
          },
          {
            id: 'content-review',
            category: 'content',
            title: 'Final Content Review',
            description: 'All public-facing content has been reviewed and approved',
            status: 'in-progress',
            priority: 'medium',
            assignee: 'Content Team',
            deadline: Date.now() + 900000,
            estimatedTime: 90,
            automatable: false
          },
          {
            id: 'social-media-ready',
            category: 'marketing',
            title: 'Social Media Campaigns Ready',
            description: 'All social media campaigns are scheduled and ready to go',
            status: 'pending',
            priority: 'high',
            assignee: 'Social Media Team',
            deadline: Date.now() + 1200000,
            estimatedTime: 45,
            automatable: false
          },
          {
            id: 'support-team-briefed',
            category: 'operations',
            title: 'Support Team Briefed',
            description: 'Customer support team is trained and ready for launch',
            status: 'completed',
            priority: 'medium',
            assignee: 'Support Manager',
            deadline: Date.now() - 1200000,
            estimatedTime: 60,
            automatable: false
          },
          {
            id: 'rollback-plan',
            category: 'technical',
            title: 'Rollback Plan Tested',
            description: 'Emergency rollback procedures have been tested and documented',
            status: 'completed',
            priority: 'critical',
            assignee: 'DevOps Team',
            deadline: Date.now() - 2400000,
            estimatedTime: 120,
            automatable: true
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
            deadline: launchDate + 86400000 // 24 hours after launch
          },
          {
            id: 'response-time',
            metric: 'Average Response Time',
            target: 200,
            current: 156,
            unit: 'ms',
            category: 'performance',
            priority: 'high',
            deadline: launchDate + 3600000 // 1 hour after launch
          },
          {
            id: 'error-rate',
            metric: 'Error Rate',
            target: 1,
            current: 0.8,
            unit: '%',
            category: 'performance',
            priority: 'critical',
            deadline: launchDate + 1800000 // 30 minutes after launch
          },
          {
            id: 'conversion-rate',
            metric: 'Trial to Paid Conversion',
            target: 15,
            current: 8.2,
            unit: '%',
            category: 'business',
            priority: 'medium',
            deadline: launchDate + 172800000 // 48 hours after launch
          },
          {
            id: 'tool-usage',
            metric: 'Tools Used Per Session',
            target: 3,
            current: 2.1,
            unit: 'tools',
            category: 'engagement',
            priority: 'medium',
            deadline: launchDate + 259200000 // 72 hours after launch
          }
        ];

        const mockCampaigns: MarketingCampaign[] = [
          {
            id: 'twitter-launch',
            name: 'Twitter Launch Announcement',
            platform: 'Twitter',
            status: 'scheduled',
            reach: 15000,
            engagement: 850,
            conversions: 42,
            budget: 2000,
            spent: 0,
            startTime: launchDate,
            endTime: launchDate + 86400000
          },
          {
            id: 'linkedin-b2b',
            name: 'LinkedIn B2B Campaign',
            platform: 'LinkedIn',
            status: 'scheduled',
            reach: 8500,
            engagement: 320,
            conversions: 28,
            budget: 3000,
            spent: 0,
            startTime: launchDate + 3600000,
            endTime: launchDate + 172800000
          },
          {
            id: 'product-hunt',
            name: 'Product Hunt Launch',
            platform: 'Product Hunt',
            status: 'scheduled',
            reach: 25000,
            engagement: 1200,
            conversions: 85,
            budget: 500,
            spent: 0,
            startTime: launchDate + 7200000,
            endTime: launchDate + 93600000
          }
        ];

        const mockMetrics: SystemMetrics[] = Array.from({ length: 20 }, (_, i) => ({
          timestamp: Date.now() - (19 - i) * 60000,
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
        setMarketingCampaigns(mockCampaigns);
        setSystemMetrics(mockMetrics);
        setIncidents([]);

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

  // Live monitoring simulation
  useEffect(() => {
    if (!isLiveMonitoring) return;

    const interval = setInterval(() => {
      // Add new metric point
      const newMetric: SystemMetrics = {
        timestamp: Date.now(),
        performance: {
          responseTime: Math.random() * 50 + 100,
          throughput: Math.random() * 200 + 800,
          errorRate: Math.random() * 2,
          cpuUsage: Math.random() * 30 + 20,
          memoryUsage: Math.random() * 40 + 40
        },
        users: {
          active: Math.floor(Math.random() * 50) + 150,
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
      };

      setSystemMetrics(prev => [...prev.slice(-19), newMetric]);

      // Update goals progress
      setLaunchGoals(prev => prev.map(goal => {
        let increment = 0;
        switch (goal.metric) {
          case 'New User Signups':
            increment = Math.floor(Math.random() * 5) + 1;
            break;
          case 'Trial to Paid Conversion':
            increment = Math.random() * 0.5;
            break;
          case 'Tools Used Per Session':
            increment = Math.random() * 0.1;
            break;
          default:
            increment = 0;
        }
        
        return {
          ...goal,
          current: Math.min(goal.target, goal.current + increment)
        };
      }));

    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isLiveMonitoring]);

  const handleStartLiveMonitoring = useCallback(() => {
    setIsLiveMonitoring(true);
    setLaunchStatus('monitoring');
    toast.success('Live monitoring started!');
    analyticsService.trackLaunchEvent('monitoring-started');
  }, []);

  const handleStopLiveMonitoring = useCallback(() => {
    setIsLiveMonitoring(false);
    toast.info('Live monitoring stopped');
    analyticsService.trackLaunchEvent('monitoring-stopped');
  }, []);

  const handleCompleteChecklistItem = useCallback((itemId: string) => {
    setLaunchChecklist(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: 'completed' } : item
    ));
    toast.success('Checklist item completed!');
    analyticsService.trackLaunchChecklistComplete(itemId);
  }, []);

  const handleLaunchCampaign = useCallback((campaignId: string) => {
    setMarketingCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId ? { ...campaign, status: 'active' } : campaign
    ));
    toast.success('Marketing campaign launched!');
    analyticsService.trackMarketingCampaignLaunch(campaignId);
  }, []);

  const formatTime = useCallback((ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'in-progress': return 'text-yellow-500';
      case 'pending': return 'text-blue-500';
      case 'failed': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="checklist" className="ff-focus-ring">
            Checklist ({launchChecklist.filter(item => item.status === 'completed').length}/{launchChecklist.length})
          </TabsTrigger>
          <TabsTrigger value="metrics" className="ff-focus-ring">
            Live Metrics
          </TabsTrigger>
          <TabsTrigger value="goals" className="ff-focus-ring">
            Launch Goals
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="ff-focus-ring">
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="incidents" className="ff-focus-ring">
            Incidents ({incidents.length})
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
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      item.status === 'completed' ? 'bg-green-500/10' :
                      item.status === 'in-progress' ? 'bg-yellow-500/10' :
                      item.status === 'failed' ? 'bg-red-500/10' :
                      'bg-muted'
                    }`}>
                      {item.status === 'completed' ? (
                        <CheckCircle className={`h-5 w-5 ${getStatusColor(item.status)}`} />
                      ) : item.status === 'failed' ? (
                        <AlertCircle className={`h-5 w-5 ${getStatusColor(item.status)}`} />
                      ) : (
                        <Clock className={`h-5 w-5 ${getStatusColor(item.status)}`} />
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <span>Assignee: {item.assignee}</span>
                          <span>•</span>
                          <span>Est. {item.estimatedTime}min</span>
                          {item.automatable && (
                            <>
                              <span>•</span>
                              <Badge variant="secondary" className="text-xs">Automated</Badge>
                            </>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`text-xs ${
                            Date.now() > item.deadline && item.status !== 'completed' 
                              ? 'text-red-500' 
                              : 'text-muted-foreground'
                          }`}>
                            Due: {new Date(item.deadline).toLocaleString()}
                          </span>
                          
                          {item.status !== 'completed' && (
                            <Button
                              size="sm"
                              onClick={() => handleCompleteChecklistItem(item.id)}
                              className="ff-focus-ring"
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {currentMetrics && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Zap className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">Response Time</h3>
                      </div>
                      <p className="text-2xl font-bold">{currentMetrics.performance.responseTime.toFixed(0)}ms</p>
                      <Progress value={Math.max(0, 100 - (currentMetrics.performance.responseTime / 5))} className="h-2" />
                      <p className="text-xs text-muted-foreground">Target: <200ms</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="h-5 w-5 text-secondary" />
                        <h3 className="font-medium">Throughput</h3>
                      </div>
                      <p className="text-2xl font-bold">{currentMetrics.performance.throughput.toFixed(0)} req/min</p>
                      <Progress value={(currentMetrics.performance.throughput / 1200) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground">Capacity: 1200 req/min</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-accent" />
                        <h3 className="font-medium">Error Rate</h3>
                      </div>
                      <p className="text-2xl font-bold">{currentMetrics.performance.errorRate.toFixed(2)}%</p>
                      <Progress value={Math.max(0, 100 - (currentMetrics.performance.errorRate * 20))} className="h-2" />
                      <p className="text-xs text-muted-foreground">Target: <1%</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Gauge className="h-5 w-5 text-green-500" />
                        <h3 className="font-medium">CPU Usage</h3>
                      </div>
                      <p className="text-2xl font-bold">{currentMetrics.performance.cpuUsage.toFixed(0)}%</p>
                      <Progress value={currentMetrics.performance.cpuUsage} className="h-2" />
                      <p className="text-xs text-muted-foreground">Memory: {currentMetrics.performance.memoryUsage.toFixed(0)}%</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="text-lg">Real-Time System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <Server className="h-4 w-4" />
                        Infrastructure
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Database</span>
                          <Badge variant="default" className="text-xs">Healthy</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>API Gateway</span>
                          <Badge variant="default" className="text-xs">Healthy</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>CDN</span>
                          <Badge variant="default" className="text-xs">Healthy</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Load Balancer</span>
                          <Badge variant="default" className="text-xs">Healthy</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        User Activity
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Active Sessions</span>
                          <span className="font-medium">{currentMetrics.users.active}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>New Signups</span>
                          <span className="font-medium">+{currentMetrics.users.signups}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Conversions</span>
                          <span className="font-medium">+{currentMetrics.users.conversions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Satisfaction</span>
                          <span className="font-medium">{currentMetrics.business.satisfactionScore.toFixed(1)}/5</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Security & Support
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>SSL Status</span>
                          <Badge variant="default" className="text-xs">Valid</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Security Scan</span>
                          <Badge variant="default" className="text-xs">Clean</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Support Tickets</span>
                          <span className="font-medium">{currentMetrics.business.supportTickets}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Response Time</span>
                          <span className="font-medium"><2min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {launchGoals.map((goal) => {
              const progress = (goal.current / goal.target) * 100;
              const isCompleted = progress >= 100;
              
              return (
                <Card key={goal.id} className={`ff-card-interactive ${isCompleted ? 'bg-green-500/5 border-green-500/20' : ''}`}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium">{goal.metric}</h4>
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(goal.priority)}>
                              {goal.priority}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {goal.category}
                            </Badge>
                          </div>
                        </div>
                        
                        {isCompleted && (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold">
                            {typeof goal.current === 'number' && goal.current % 1 !== 0 
                              ? goal.current.toFixed(1) 
                              : goal.current}
                            <span className="text-sm text-muted-foreground ml-1">
                              / {goal.target} {goal.unit}
                            </span>
                          </span>
                          <span className={`text-lg font-medium ${isCompleted ? 'text-green-500' : 'text-primary'}`}>
                            {progress.toFixed(0)}%
                          </span>
                        </div>
                        
                        <Progress value={Math.min(100, progress)} className="h-3" />
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Deadline: {new Date(goal.deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="space-y-4">
            {marketingCampaigns.map((campaign) => (
              <Card key={campaign.id} className="ff-card-interactive">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{campaign.name}</h4>
                        <Badge variant="outline">{campaign.platform}</Badge>
                        <Badge 
                          variant={campaign.status === 'active' ? 'default' : 'secondary'}
                          className={campaign.status === 'active' ? 'ff-badge-glow' : ''}
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Reach:</span>
                          <p className="font-medium">{campaign.reach.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Engagement:</span>
                          <p className="font-medium">{campaign.engagement.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Conversions:</span>
                          <p className="font-medium">{campaign.conversions}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Budget:</span>
                          <p className="font-medium">${campaign.spent}/${campaign.budget}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Budget Usage</span>
                          <span>{((campaign.spent / campaign.budget) * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="ml-6">
                      {campaign.status === 'scheduled' && (
                        <Button
                          onClick={() => handleLaunchCampaign(campaign.id)}
                          className="ff-btn-primary"
                        >
                          <Rocket className="h-4 w-4 mr-2" />
                          Launch Now
                        </Button>
                      )}
                      
                      {campaign.status === 'active' && (
                        <Badge variant="default" className="ff-badge-glow">
                          <Activity className="h-3 w-3 mr-1 animate-pulse" />
                          Live
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 text-xs text-muted-foreground">
                    Duration: {new Date(campaign.startTime).toLocaleDateString()} - {new Date(campaign.endTime).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          {incidents.length === 0 ? (
            <Card className="ff-card-interactive">
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <h3 className="font-medium mb-2">All Systems Operational</h3>
                <p className="text-muted-foreground">No active incidents. Everything is running smoothly!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {incidents.map((incident) => (
                <Card key={incident.id} className={`ff-card-interactive ${getPriorityColor(incident.severity)}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{incident.title}</h4>
                          <Badge className={getPriorityColor(incident.severity)}>
                            {incident.severity}
                          </Badge>
                          <Badge variant="outline">{incident.status}</Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{incident.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Assignee: {incident.assignee}</span>
                          <span>•</span>
                          <span>Impact: {incident.impact}</span>
                          <span>•</span>
                          <span>Created: {new Date(incident.createdAt).toLocaleString()}</span>
                          {incident.resolvedAt && (
                            <>
                              <span>•</span>
                              <span>Resolved: {new Date(incident.resolvedAt).toLocaleString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}