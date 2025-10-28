import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Checkbox } from '../ui/checkbox';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Target, 
  Users, 
  Shield, 
  Database,
  Server,
  Globe,
  MessageCircle,
  Mail,
  Settings,
  Eye,
  Zap,
  Activity,
  BarChart3,
  TrendingUp,
  Bell,
  Play,
  Pause,
  RefreshCw,
  Calendar,
  FileText,
  Monitor,
  Smartphone,
  Download,
  Upload,
  Lock,
  Unlock,
  Star,
  Gift
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { analyticsService } from '../../services/AnalyticsService';

interface ChecklistItem {
  id: string;
  category: 'technical' | 'marketing' | 'content' | 'legal' | 'team' | 'monitoring';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  assignee: string;
  estimated_time: number; // minutes
  dependencies: string[];
  automation_available: boolean;
  completion_time?: number;
  notes?: string;
  verification_required: boolean;
}

interface LaunchPhase {
  id: string;
  name: string;
  description: string;
  start_time: number;
  duration: number; // minutes
  items: string[];
  status: 'pending' | 'active' | 'completed' | 'delayed';
  critical: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: 'available' | 'busy' | 'offline';
  assigned_items: string[];
  contact: string;
}

interface LaunchMetrics {
  countdown_timer: number;
  completion_percentage: number;
  critical_items_remaining: number;
  estimated_time_remaining: number;
  team_availability: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  automation_coverage: number;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  // Technical Items
  {
    id: 'tech-01',
    category: 'technical',
    title: 'Final Production Deployment',
    description: 'Deploy latest version to production environment with all optimizations',
    priority: 'critical',
    status: 'pending',
    assignee: 'DevOps Team',
    estimated_time: 30,
    dependencies: [],
    automation_available: true,
    verification_required: true
  },
  {
    id: 'tech-02',
    category: 'technical',
    title: 'Database Migration & Optimization',
    description: 'Execute final database migrations and optimize for 500+ concurrent users',
    priority: 'critical',
    status: 'pending',
    assignee: 'Backend Team',
    estimated_time: 45,
    dependencies: ['tech-01'],
    automation_available: true,
    verification_required: true
  },
  {
    id: 'tech-03',
    category: 'technical',
    title: 'CDN Configuration',
    description: 'Configure global CDN for optimal performance across all regions',
    priority: 'high',
    status: 'pending',
    assignee: 'DevOps Team',
    estimated_time: 20,
    dependencies: ['tech-01'],
    automation_available: true,
    verification_required: true
  },
  {
    id: 'tech-04',
    category: 'technical',
    title: 'SSL Certificate Verification',
    description: 'Verify SSL certificates are installed and configured correctly',
    priority: 'high',
    status: 'pending',
    assignee: 'Security Team',
    estimated_time: 15,
    dependencies: ['tech-01'],
    automation_available: true,
    verification_required: true
  },
  {
    id: 'tech-05',
    category: 'technical',
    title: 'Load Balancer Configuration',
    description: 'Configure load balancers for high availability and auto-scaling',
    priority: 'critical',
    status: 'pending',
    assignee: 'DevOps Team',
    estimated_time: 25,
    dependencies: ['tech-01'],
    automation_available: true,
    verification_required: true
  },
  {
    id: 'tech-06',
    category: 'technical',
    title: 'Backup Systems Verification',
    description: 'Verify all backup systems are operational and tested',
    priority: 'high',
    status: 'pending',
    assignee: 'DevOps Team',
    estimated_time: 20,
    dependencies: ['tech-02'],
    automation_available: true,
    verification_required: true
  },
  {
    id: 'tech-07',
    category: 'technical',
    title: 'Performance Monitoring Setup',
    description: 'Configure real-time performance monitoring and alerting',
    priority: 'critical',
    status: 'pending',
    assignee: 'DevOps Team',
    estimated_time: 30,
    dependencies: ['tech-01'],
    automation_available: true,
    verification_required: true
  },
  {
    id: 'tech-08',
    category: 'technical',
    title: 'API Rate Limiting',
    description: 'Configure API rate limiting to handle traffic spikes',
    priority: 'high',
    status: 'pending',
    assignee: 'Backend Team',
    estimated_time: 15,
    dependencies: ['tech-01'],
    automation_available: true,
    verification_required: true
  },

  // Marketing Items
  {
    id: 'mkt-01',
    category: 'marketing',
    title: 'Social Media Campaign Launch',
    description: 'Launch coordinated social media campaigns across all platforms',
    priority: 'critical',
    status: 'pending',
    assignee: 'Marketing Team',
    estimated_time: 60,
    dependencies: [],
    automation_available: true,
    verification_required: false
  },
  {
    id: 'mkt-02',
    category: 'marketing',
    title: 'Product Hunt Submission',
    description: 'Submit FlashFusion to Product Hunt for launch day',
    priority: 'high',
    status: 'pending',
    assignee: 'Marketing Team',
    estimated_time: 30,
    dependencies: [],
    automation_available: false,
    verification_required: true
  },
  {
    id: 'mkt-03',
    category: 'marketing',
    title: 'Press Release Distribution',
    description: 'Distribute press release to tech media outlets',
    priority: 'medium',
    status: 'pending',
    assignee: 'PR Team',
    estimated_time: 45,
    dependencies: [],
    automation_available: true,
    verification_required: false
  },
  {
    id: 'mkt-04',
    category: 'marketing',
    title: 'Influencer Campaign Activation',
    description: 'Activate confirmed influencer partnerships for launch day',
    priority: 'high',
    status: 'pending',
    assignee: 'Marketing Team',
    estimated_time: 40,
    dependencies: [],
    automation_available: false,
    verification_required: true
  },
  {
    id: 'mkt-05',
    category: 'marketing',
    title: 'Email Campaign Launch',
    description: 'Send launch announcement to subscriber list',
    priority: 'high',
    status: 'pending',
    assignee: 'Marketing Team',
    estimated_time: 20,
    dependencies: [],
    automation_available: true,
    verification_required: false
  },

  // Content Items
  {
    id: 'cnt-01',
    category: 'content',
    title: 'Launch Video Publication',
    description: 'Publish official launch video across all channels',
    priority: 'high',
    status: 'pending',
    assignee: 'Content Team',
    estimated_time: 25,
    dependencies: [],
    automation_available: false,
    verification_required: true
  },
  {
    id: 'cnt-02',
    category: 'content',
    title: 'Documentation Updates',
    description: 'Ensure all documentation is current and comprehensive',
    priority: 'medium',
    status: 'pending',
    assignee: 'Content Team',
    estimated_time: 60,
    dependencies: [],
    automation_available: false,
    verification_required: true
  },
  {
    id: 'cnt-03',
    category: 'content',
    title: 'Blog Post Publication',
    description: 'Publish launch announcement blog post',
    priority: 'medium',
    status: 'pending',
    assignee: 'Content Team',
    estimated_time: 15,
    dependencies: [],
    automation_available: true,
    verification_required: false
  },
  {
    id: 'cnt-04',
    category: 'content',
    title: 'Tutorial Content Activation',
    description: 'Make all tutorial content accessible to new users',
    priority: 'high',
    status: 'pending',
    assignee: 'Content Team',
    estimated_time: 30,
    dependencies: [],
    automation_available: false,
    verification_required: true
  },

  // Legal Items
  {
    id: 'leg-01',
    category: 'legal',
    title: 'Terms of Service Review',
    description: 'Final review and approval of Terms of Service',
    priority: 'high',
    status: 'pending',
    assignee: 'Legal Team',
    estimated_time: 30,
    dependencies: [],
    automation_available: false,
    verification_required: true
  },
  {
    id: 'leg-02',
    category: 'legal',
    title: 'Privacy Policy Updates',
    description: 'Ensure Privacy Policy is compliant and up-to-date',
    priority: 'high',
    status: 'pending',
    assignee: 'Legal Team',
    estimated_time: 20,
    dependencies: [],
    automation_available: false,
    verification_required: true
  },
  {
    id: 'leg-03',
    category: 'legal',
    title: 'GDPR Compliance Check',
    description: 'Verify GDPR compliance for EU users',
    priority: 'critical',
    status: 'pending',
    assignee: 'Legal Team',
    estimated_time: 45,
    dependencies: [],
    automation_available: false,
    verification_required: true
  },

  // Team Items
  {
    id: 'team-01',
    category: 'team',
    title: 'Launch Day Team Briefing',
    description: 'Conduct final briefing with all team members',
    priority: 'high',
    status: 'pending',
    assignee: 'Project Manager',
    estimated_time: 45,
    dependencies: [],
    automation_available: false,
    verification_required: false
  },
  {
    id: 'team-02',
    category: 'team',
    title: 'Emergency Contact Setup',
    description: 'Ensure all emergency contacts are available and responsive',
    priority: 'critical',
    status: 'pending',
    assignee: 'Project Manager',
    estimated_time: 15,
    dependencies: [],
    automation_available: false,
    verification_required: true
  },
  {
    id: 'team-03',
    category: 'team',
    title: 'Support Team Activation',
    description: 'Activate customer support team for launch day coverage',
    priority: 'critical',
    status: 'pending',
    assignee: 'Support Manager',
    estimated_time: 30,
    dependencies: [],
    automation_available: false,
    verification_required: true
  },

  // Monitoring Items
  {
    id: 'mon-01',
    category: 'monitoring',
    title: 'Analytics Tracking Setup',
    description: 'Verify all analytics tracking is configured correctly',
    priority: 'high',
    status: 'pending',
    assignee: 'Analytics Team',
    estimated_time: 20,
    dependencies: ['tech-01'],
    automation_available: true,
    verification_required: true
  },
  {
    id: 'mon-02',
    category: 'monitoring',
    title: 'Error Tracking Configuration',
    description: 'Configure comprehensive error tracking and alerting',
    priority: 'critical',
    status: 'pending',
    assignee: 'DevOps Team',
    estimated_time: 25,
    dependencies: ['tech-01'],
    automation_available: true,
    verification_required: true
  },
  {
    id: 'mon-03',
    category: 'monitoring',
    title: 'User Behavior Monitoring',
    description: 'Set up user behavior and engagement monitoring',
    priority: 'medium',
    status: 'pending',
    assignee: 'Analytics Team',
    estimated_time: 30,
    dependencies: ['tech-01'],
    automation_available: true,
    verification_required: true
  }
];

const LAUNCH_PHASES: LaunchPhase[] = [
  {
    id: 'phase-01',
    name: 'Pre-Launch Preparation',
    description: 'Complete all technical and legal preparations',
    start_time: Date.now(),
    duration: 120,
    items: ['tech-01', 'tech-02', 'tech-03', 'tech-04', 'tech-05', 'tech-06', 'tech-07', 'tech-08', 'leg-01', 'leg-02', 'leg-03'],
    status: 'active',
    critical: true
  },
  {
    id: 'phase-02',
    name: 'Content & Marketing Activation',
    description: 'Activate all marketing campaigns and content',
    start_time: Date.now() + 7200000,
    duration: 90,
    items: ['mkt-01', 'mkt-02', 'mkt-03', 'mkt-04', 'mkt-05', 'cnt-01', 'cnt-02', 'cnt-03', 'cnt-04'],
    status: 'pending',
    critical: true
  },
  {
    id: 'phase-03',
    name: 'Team Coordination',
    description: 'Ensure team is ready and support systems are active',
    start_time: Date.now() + 3600000,
    duration: 60,
    items: ['team-01', 'team-02', 'team-03'],
    status: 'pending',
    critical: true
  },
  {
    id: 'phase-04',
    name: 'Monitoring & Analytics',
    description: 'Activate all monitoring and tracking systems',
    start_time: Date.now() + 5400000,
    duration: 45,
    items: ['mon-01', 'mon-02', 'mon-03'],
    status: 'pending',
    critical: false
  }
];

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-01',
    name: 'Alex Chen',
    role: 'DevOps Lead',
    status: 'available',
    assigned_items: ['tech-01', 'tech-03', 'tech-05', 'tech-06', 'tech-07', 'mon-02'],
    contact: 'alex@flashfusion.ai'
  },
  {
    id: 'team-02',
    name: 'Sarah Johnson',
    role: 'Marketing Director',
    status: 'available',
    assigned_items: ['mkt-01', 'mkt-02', 'mkt-04', 'mkt-05'],
    contact: 'sarah@flashfusion.ai'
  },
  {
    id: 'team-03',
    name: 'Michael Rodriguez',
    role: 'Backend Developer',
    status: 'available',
    assigned_items: ['tech-02', 'tech-08'],
    contact: 'michael@flashfusion.ai'
  },
  {
    id: 'team-04',
    name: 'Emily Davis',
    role: 'Content Manager',
    status: 'available',
    assigned_items: ['cnt-01', 'cnt-02', 'cnt-03', 'cnt-04'],
    contact: 'emily@flashfusion.ai'
  },
  {
    id: 'team-05',
    name: 'David Kim',
    role: 'Legal Counsel',
    status: 'available',
    assigned_items: ['leg-01', 'leg-02', 'leg-03'],
    contact: 'david@flashfusion.ai'
  }
];

export function LaunchDayPreparationChecklist() {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(CHECKLIST_ITEMS);
  const [launchPhases, setLaunchPhases] = useState<LaunchPhase[]>(LAUNCH_PHASES);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAutoExecuting, setIsAutoExecuting] = useState(false);
  const [launchCountdown, setLaunchCountdown] = useState(86400); // 24 hours in seconds
  const [isLoading, setIsLoading] = useState(false);

  // Calculate launch metrics
  const launchMetrics = useMemo((): LaunchMetrics => {
    const completedItems = checklistItems.filter(item => item.status === 'completed');
    const criticalItems = checklistItems.filter(item => item.priority === 'critical');
    const criticalRemaining = criticalItems.filter(item => item.status !== 'completed').length;
    const totalEstimatedTime = checklistItems
      .filter(item => item.status === 'pending' || item.status === 'in_progress')
      .reduce((sum, item) => sum + item.estimated_time, 0);
    
    const availableMembers = teamMembers.filter(member => member.status === 'available').length;
    const teamAvailability = (availableMembers / teamMembers.length) * 100;
    
    const automatedItems = checklistItems.filter(item => item.automation_available);
    const automationCoverage = (automatedItems.length / checklistItems.length) * 100;
    
    let riskLevel: LaunchMetrics['risk_level'] = 'low';
    if (criticalRemaining > 5 || teamAvailability < 50) {
      riskLevel = 'critical';
    } else if (criticalRemaining > 2 || teamAvailability < 75) {
      riskLevel = 'high';
    } else if (criticalRemaining > 0 || teamAvailability < 90) {
      riskLevel = 'medium';
    }

    return {
      countdown_timer: launchCountdown,
      completion_percentage: (completedItems.length / checklistItems.length) * 100,
      critical_items_remaining: criticalRemaining,
      estimated_time_remaining: totalEstimatedTime,
      team_availability: teamAvailability,
      risk_level: riskLevel,
      automation_coverage: automationCoverage
    };
  }, [checklistItems, teamMembers, launchCountdown]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setLaunchCountdown(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto-update phases based on time
  useEffect(() => {
    const now = Date.now();
    setLaunchPhases(prev => prev.map(phase => {
      if (phase.start_time <= now && phase.status === 'pending') {
        return { ...phase, status: 'active' };
      }
      if (phase.start_time + (phase.duration * 60000) <= now && phase.status === 'active') {
        return { ...phase, status: 'completed' };
      }
      return phase;
    }));
  }, []);

  const handleItemStatusChange = useCallback((itemId: string, newStatus: ChecklistItem['status']) => {
    setChecklistItems(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            status: newStatus,
            completion_time: newStatus === 'completed' ? Date.now() : undefined
          }
        : item
    ));

    if (newStatus === 'completed') {
      toast.success('Task completed successfully!');
      analyticsService.trackFeatureUsage('checklist-item-completed', { itemId });
    }
  }, []);

  const handleAutoExecuteItem = useCallback(async (itemId: string) => {
    const item = checklistItems.find(i => i.id === itemId);
    if (!item || !item.automation_available) return;

    setChecklistItems(prev => prev.map(i => 
      i.id === itemId ? { ...i, status: 'in_progress' } : i
    ));

    try {
      // Simulate automation execution
      await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 2000));

      setChecklistItems(prev => prev.map(i => 
        i.id === itemId 
          ? { ...i, status: 'completed', completion_time: Date.now() }
          : i
      ));

      toast.success(`Automated execution of "${item.title}" completed!`);
      analyticsService.trackFeatureUsage('automated-task-completed', { itemId, category: item.category });

    } catch (error) {
      setChecklistItems(prev => prev.map(i => 
        i.id === itemId ? { ...i, status: 'failed' } : i
      ));
      toast.error(`Automation failed for "${item.title}"`);
    }
  }, [checklistItems]);

  const handleAutoExecuteAll = useCallback(async () => {
    setIsAutoExecuting(true);
    
    try {
      const automatedItems = checklistItems.filter(item => 
        item.automation_available && 
        (item.status === 'pending' || item.status === 'failed')
      );

      for (const item of automatedItems) {
        // Check dependencies
        const dependenciesCompleted = item.dependencies.every(depId => 
          checklistItems.find(i => i.id === depId)?.status === 'completed'
        );

        if (dependenciesCompleted) {
          await handleAutoExecuteItem(item.id);
          // Small delay between executions
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      toast.success('Automated execution completed!');

    } catch (error) {
      toast.error('Some automated tasks failed to execute');
    } finally {
      setIsAutoExecuting(false);
    }
  }, [checklistItems, handleAutoExecuteItem]);

  const filteredItems = selectedCategory === 'all' 
    ? checklistItems 
    : checklistItems.filter(item => item.category === selectedCategory);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryIcon = (category: ChecklistItem['category']) => {
    switch (category) {
      case 'technical': return Server;
      case 'marketing': return TrendingUp;
      case 'content': return FileText;
      case 'legal': return Shield;
      case 'team': return Users;
      case 'monitoring': return Monitor;
      default: return Settings;
    }
  };

  const getStatusColor = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'in_progress': return 'text-blue-500';
      case 'failed': return 'text-red-500';
      case 'skipped': return 'text-gray-500';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: ChecklistItem['priority']) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-500/5';
      case 'high': return 'border-orange-500 bg-orange-500/5';
      case 'medium': return 'border-yellow-500 bg-yellow-500/5';
      default: return 'border-gray-500 bg-gray-500/5';
    }
  };

  return (
    <div className="space-y-6 ff-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold ff-text-gradient">Launch Day Preparation Checklist</h1>
          <p className="text-muted-foreground">
            Comprehensive checklist for flawless FlashFusion launch execution
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge 
            variant={launchMetrics.risk_level === 'low' ? 'default' : launchMetrics.risk_level === 'medium' ? 'secondary' : 'destructive'}
            className={`font-medium ${launchMetrics.risk_level === 'low' ? 'ff-badge-glow' : ''}`}
          >
            <Target className="h-3 w-3 mr-1" />
            {launchMetrics.risk_level.toUpperCase()} Risk
          </Badge>
          
          <div className="text-center">
            <div className="text-2xl font-bold ff-text-gradient">{formatTime(launchCountdown)}</div>
            <p className="text-xs text-muted-foreground">Until Launch</p>
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      {launchMetrics.critical_items_remaining > 0 && (
        <Alert className="border-destructive bg-destructive/5">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-destructive">Critical Items Remaining</AlertTitle>
          <AlertDescription>
            {launchMetrics.critical_items_remaining} critical item{launchMetrics.critical_items_remaining === 1 ? '' : 's'} must be completed before launch.
            Estimated time remaining: {Math.ceil(launchMetrics.estimated_time_remaining / 60)} hours.
          </AlertDescription>
        </Alert>
      )}

      {/* Launch Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium">Completion</h3>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{launchMetrics.completion_percentage.toFixed(0)}%</p>
              <Progress value={launchMetrics.completion_percentage} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {checklistItems.filter(i => i.status === 'completed').length}/{checklistItems.length} tasks
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <h3 className="font-medium">Critical Items</h3>
            </div>
            <p className={`text-2xl font-bold ${launchMetrics.critical_items_remaining === 0 ? 'text-green-500' : 'text-red-500'}`}>
              {launchMetrics.critical_items_remaining}
            </p>
            <p className="text-sm text-muted-foreground">
              remaining to complete
            </p>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <h3 className="font-medium">Team Availability</h3>
            </div>
            <p className={`text-2xl font-bold ${launchMetrics.team_availability >= 90 ? 'text-green-500' : launchMetrics.team_availability >= 75 ? 'text-yellow-500' : 'text-red-500'}`}>
              {launchMetrics.team_availability.toFixed(0)}%
            </p>
            <p className="text-sm text-muted-foreground">
              {teamMembers.filter(m => m.status === 'available').length}/{teamMembers.length} available
            </p>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Zap className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-medium">Automation</h3>
            </div>
            <p className="text-2xl font-bold">{launchMetrics.automation_coverage.toFixed(0)}%</p>
            <p className="text-sm text-muted-foreground">
              tasks can be automated
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Automation Control */}
      <Card className="ff-card-interactive">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Automated Execution</h3>
              <p className="text-muted-foreground">
                Execute all available automated tasks with dependency checking
              </p>
            </div>
            
            <Button
              onClick={handleAutoExecuteAll}
              disabled={isAutoExecuting}
              className="ff-btn-primary"
            >
              {isAutoExecuting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Auto-Execute All
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="checklist" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="checklist" className="ff-focus-ring">
            Checklist ({checklistItems.length})
          </TabsTrigger>
          <TabsTrigger value="phases" className="ff-focus-ring">
            Launch Phases
          </TabsTrigger>
          <TabsTrigger value="team" className="ff-focus-ring">
            Team Status
          </TabsTrigger>
          <TabsTrigger value="timeline" className="ff-focus-ring">
            Timeline View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checklist" className="space-y-4">
          {/* Category Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
              className="ff-focus-ring"
            >
              All ({checklistItems.length})
            </Button>
            {['technical', 'marketing', 'content', 'legal', 'team', 'monitoring'].map((category) => {
              const count = checklistItems.filter(item => item.category === category).length;
              const Icon = getCategoryIcon(category as ChecklistItem['category']);
              
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="ff-focus-ring capitalize"
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {category} ({count})
                </Button>
              );
            })}
          </div>

          {/* Checklist Items */}
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const dependencyItems = item.dependencies.map(depId => 
                checklistItems.find(i => i.id === depId)
              ).filter(Boolean);
              const dependenciesCompleted = item.dependencies.every(depId => 
                checklistItems.find(i => i.id === depId)?.status === 'completed'
              );
              const assignee = teamMembers.find(member => member.assigned_items.includes(item.id));

              return (
                <Card 
                  key={item.id} 
                  className={`ff-card-interactive ${getPriorityColor(item.priority)} ${
                    item.status === 'completed' ? 'opacity-75' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={item.status === 'completed'}
                        onCheckedChange={(checked) => 
                          handleItemStatusChange(item.id, checked ? 'completed' : 'pending')
                        }
                        className="mt-1"
                      />
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{item.title}</h4>
                              <Badge variant="outline" className="text-xs capitalize">
                                {item.category}
                              </Badge>
                              <Badge variant={
                                item.priority === 'critical' ? 'destructive' :
                                item.priority === 'high' ? 'default' :
                                'secondary'
                              } className="text-xs">
                                {item.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          
                          <Badge variant={
                            item.status === 'completed' ? 'default' :
                            item.status === 'in_progress' ? 'secondary' :
                            item.status === 'failed' ? 'destructive' :
                            'outline'
                          } className={getStatusColor(item.status)}>
                            {item.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Assignee:</span>
                            <p className="font-medium">{assignee?.name || item.assignee}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Estimated Time:</span>
                            <p className="font-medium">{item.estimated_time} minutes</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Automation:</span>
                            <p className={`font-medium ${item.automation_available ? 'text-green-500' : 'text-muted-foreground'}`}>
                              {item.automation_available ? 'Available' : 'Manual'}
                            </p>
                          </div>
                        </div>
                        
                        {item.dependencies.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Dependencies:</p>
                            <div className="flex flex-wrap gap-1">
                              {dependencyItems.map((dep) => dep && (
                                <Badge 
                                  key={dep.id} 
                                  variant={dep.status === 'completed' ? 'default' : 'outline'}
                                  className="text-xs"
                                >
                                  {dep.title}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {item.verification_required && (
                          <div className="flex items-center gap-2 text-sm text-yellow-600">
                            <Eye className="h-4 w-4" />
                            Manual verification required
                          </div>
                        )}
                        
                        {item.completion_time && (
                          <p className="text-xs text-muted-foreground">
                            Completed: {new Date(item.completion_time).toLocaleString()}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {item.automation_available && item.status !== 'completed' && dependenciesCompleted && (
                          <Button
                            size="sm"
                            onClick={() => handleAutoExecuteItem(item.id)}
                            disabled={item.status === 'in_progress'}
                            className="ff-btn-secondary"
                          >
                            {item.status === 'in_progress' ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Zap className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        
                        {!dependenciesCompleted && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled
                            className="opacity-50"
                          >
                            <Lock className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="phases" className="space-y-4">
          <div className="space-y-4">
            {launchPhases.map((phase) => {
              const phaseItems = phase.items.map(itemId => 
                checklistItems.find(item => item.id === itemId)
              ).filter(Boolean);
              const completedItems = phaseItems.filter(item => item.status === 'completed');
              const progress = (completedItems.length / phaseItems.length) * 100;
              
              return (
                <Card key={phase.id} className={`ff-card-interactive ${
                  phase.status === 'active' ? 'border-primary/20 bg-primary/5' :
                  phase.status === 'completed' ? 'border-green-500/20 bg-green-500/5' :
                  ''
                }`}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h4 className="font-medium text-lg">{phase.name}</h4>
                            <Badge variant={
                              phase.status === 'completed' ? 'default' :
                              phase.status === 'active' ? 'secondary' :
                              'outline'
                            } className={phase.status === 'active' ? 'ff-badge-glow' : ''}>
                              {phase.status}
                            </Badge>
                            {phase.critical && (
                              <Badge variant="destructive" className="text-xs">
                                Critical
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-muted-foreground">{phase.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Start: {new Date(phase.start_time).toLocaleString()}</span>
                            <span>•</span>
                            <span>Duration: {phase.duration} minutes</span>
                            <span>•</span>
                            <span>{phaseItems.length} tasks</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold">{progress.toFixed(0)}%</div>
                          <p className="text-sm text-muted-foreground">
                            {completedItems.length}/{phaseItems.length} completed
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Progress value={progress} className="h-2" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {phaseItems.map((item) => item && (
                            <div key={item.id} className="flex items-center gap-2 text-sm">
                              <div className={`w-2 h-2 rounded-full ${
                                item.status === 'completed' ? 'bg-green-500' :
                                item.status === 'in_progress' ? 'bg-blue-500' :
                                item.status === 'failed' ? 'bg-red-500' :
                                'bg-muted-foreground'
                              }`} />
                              <span className={item.status === 'completed' ? 'line-through opacity-75' : ''}>
                                {item.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => {
              const assignedItems = member.assigned_items.map(itemId => 
                checklistItems.find(item => item.id === itemId)
              ).filter(Boolean);
              const completedItems = assignedItems.filter(item => item.status === 'completed');
              const progress = assignedItems.length > 0 ? (completedItems.length / assignedItems.length) * 100 : 0;
              
              return (
                <Card key={member.id} className={`ff-card-interactive ${
                  member.status === 'available' ? 'border-green-500/20 bg-green-500/5' :
                  member.status === 'busy' ? 'border-yellow-500/20 bg-yellow-500/5' :
                  'border-gray-500/20 bg-gray-500/5'
                }`}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{member.name}</h4>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                        
                        <Badge variant={
                          member.status === 'available' ? 'default' :
                          member.status === 'busy' ? 'secondary' :
                          'outline'
                        }>
                          {member.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Task Progress</span>
                          <span>{progress.toFixed(0)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {completedItems.length}/{assignedItems.length} tasks completed
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Assigned Tasks:</p>
                        <div className="space-y-1">
                          {assignedItems.slice(0, 3).map((item) => item && (
                            <div key={item.id} className="flex items-center gap-2 text-xs">
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                item.status === 'completed' ? 'bg-green-500' :
                                item.status === 'in_progress' ? 'bg-blue-500' :
                                'bg-muted-foreground'
                              }`} />
                              <span className={item.status === 'completed' ? 'line-through opacity-75' : ''}>
                                {item.title}
                              </span>
                            </div>
                          ))}
                          {assignedItems.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                              +{assignedItems.length - 3} more tasks
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="ff-focus-ring w-full"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Launch Timeline</h3>
              <p className="text-muted-foreground">
                Visual timeline of all launch phases and critical milestones
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
              
              <div className="space-y-8">
                {launchPhases.map((phase, index) => {
                  const phaseItems = phase.items.map(itemId => 
                    checklistItems.find(item => item.id === itemId)
                  ).filter(Boolean);
                  const completedItems = phaseItems.filter(item => item.status === 'completed');
                  const progress = (completedItems.length / phaseItems.length) * 100;
                  
                  return (
                    <div key={phase.id} className="relative flex items-start gap-6">
                      {/* Timeline marker */}
                      <div className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        phase.status === 'completed' ? 'bg-green-500 border-green-500' :
                        phase.status === 'active' ? 'bg-primary border-primary' :
                        'bg-background border-muted-foreground'
                      }`}>
                        {phase.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : phase.status === 'active' ? (
                          <Activity className="h-4 w-4 text-white" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      
                      {/* Phase content */}
                      <div className="flex-1 pb-8">
                        <Card className={`ff-card-interactive ${
                          phase.status === 'active' ? 'border-primary/20 bg-primary/5' :
                          phase.status === 'completed' ? 'border-green-500/20 bg-green-500/5' :
                          ''
                        }`}>
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{phase.name}</h4>
                                <Badge variant={
                                  phase.status === 'completed' ? 'default' :
                                  phase.status === 'active' ? 'secondary' :
                                  'outline'
                                }>
                                  {phase.status}
                                </Badge>
                              </div>
                              
                              <p className="text-sm text-muted-foreground">{phase.description}</p>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Start:</span>
                                  <p className="font-medium">{new Date(phase.start_time).toLocaleTimeString()}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Duration:</span>
                                  <p className="font-medium">{phase.duration}m</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Tasks:</span>
                                  <p className="font-medium">{phaseItems.length}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Progress:</span>
                                  <p className="font-medium">{progress.toFixed(0)}%</p>
                                </div>
                              </div>
                              
                              <Progress value={progress} className="h-1.5" />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}