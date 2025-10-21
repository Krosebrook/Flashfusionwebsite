/**
 * @fileoverview FlashFusion Immediate Next Actions - Priority Implementation
 * @chunk blindspot
 * @category immediate-actions
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Comprehensive priority-based action management system featuring three priority levels:
 * Priority 1 - Foundation (Days 1-2) with to-do list interface for foundation tasks,
 * Priority 2 - Quality Gates (Days 3-5) with Kanban board for quality gate tasks,
 * Priority 3 - Success Metrics (Days 6-7) with analytics setup dashboard.
 * 
 * Features:
 * - Interactive task management with completion tracking
 * - Priority-based organization and timeline management
 * - Progress monitoring and deadline tracking
 * - Team assignment and resource allocation
 * - Comprehensive task templates and checklists
 * - Integration with project management workflows
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import { 
  CheckCircle, 
  Clock, 
  Flag, 
  Target,
  Calendar,
  Users,
  Settings,
  BarChart3,
  Shield,
  Zap,
  AlertTriangle,
  ArrowRight,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Database,
  Code,
  Server,
  Globe,
  Monitor,
  Activity,
  TestTube,
  Lock,
  Eye,
  MousePointer,
  TrendingUp,
  PieChart,
  LineChart,
  MessageSquare,
  Bell,
  Award,
  Star,
  Briefcase,
  DollarSign,
  Gauge,
  Search,
  Filter,
  Download,
  Upload
} from 'lucide-react';

// Priority 1: Foundation Tasks (Days 1-2)
const foundationTasks = [
  {
    id: 'scale-targets',
    title: 'Define Scalability Targets',
    description: 'Establish clear user volume and MRR growth targets for system scalability planning',
    completed: false,
    priority: 'critical',
    estimatedTime: '4 hours',
    assignee: 'CTO',
    dueDate: '2024-12-20',
    category: 'scalability',
    checklist: [
      'Define target user volumes (100K, 500K, 1M+ users)',
      'Set MRR growth targets ($10K, $50K, $100K+ monthly)',
      'Establish infrastructure scaling thresholds',
      'Document performance benchmarks and SLAs',
      'Create capacity planning models and projections'
    ],
    dependencies: [],
    resources: ['System Architecture Team', 'Business Analytics'],
    successCriteria: 'Clear scalability targets documented with measurable thresholds'
  },
  {
    id: 'compliance-requirements',
    title: 'Clarify Compliance Requirements',
    description: 'Define and document SOC 2, GDPR, HIPAA compliance requirements and implementation plan',
    completed: false,
    priority: 'critical',
    estimatedTime: '6 hours',
    assignee: 'Security Engineer',
    dueDate: '2024-12-20',
    category: 'compliance',
    checklist: [
      'Assess SOC 2 Type II requirements and current gaps',
      'Document GDPR compliance requirements for EU users',
      'Evaluate HIPAA compliance needs for healthcare data',
      'Create compliance implementation roadmap',
      'Establish regular compliance audit schedule'
    ],
    dependencies: [],
    resources: ['Legal Team', 'Security Consultant', 'Compliance Officer'],
    successCriteria: 'Comprehensive compliance framework with clear implementation timeline'
  },
  {
    id: 'team-roles',
    title: 'Establish Team Roles and Responsibilities',
    description: 'Define clear team structure, roles, responsibilities, and communication protocols',
    completed: false,
    priority: 'high',
    estimatedTime: '3 hours',
    assignee: 'Engineering Manager',
    dueDate: '2024-12-21',
    category: 'team-structure',
    checklist: [
      'Create detailed team organizational chart',
      'Define role-specific responsibilities and expectations',
      'Establish communication protocols and meeting schedules',
      'Set up project management and collaboration tools',
      'Document escalation procedures and decision-making processes'
    ],
    dependencies: ['scale-targets'],
    resources: ['HR Team', 'Team Leads', 'Project Manager'],
    successCriteria: 'Clear team structure with defined roles and communication workflows'
  },
  {
    id: 'monitoring-setup',
    title: 'Set Up Comprehensive Monitoring',
    description: 'Implement comprehensive monitoring with Sentry, DataDog, or similar tools',
    completed: false,
    priority: 'critical',
    estimatedTime: '8 hours',
    assignee: 'DevOps Engineer',
    dueDate: '2024-12-21',
    category: 'monitoring',
    checklist: [
      'Configure error tracking with Sentry or equivalent',
      'Set up infrastructure monitoring with DataDog/New Relic',
      'Implement application performance monitoring (APM)',
      'Configure alerting rules and notification channels',
      'Create monitoring dashboards for key metrics'
    ],
    dependencies: ['team-roles'],
    resources: ['DevOps Team', 'SRE', 'Development Team'],
    successCriteria: 'Comprehensive monitoring system with proactive alerting and dashboards'
  }
];

// Priority 2: Quality Gates (Days 3-5)
const qualityGateTasks = [
  {
    id: 'automated-testing',
    title: 'Implement Automated Testing Pipeline',
    description: 'Build comprehensive automated testing pipeline with unit, integration, and e2e tests',
    status: 'todo',
    priority: 'critical',
    estimatedTime: '12 hours',
    assignee: 'QA Lead',
    dueDate: '2024-12-23',
    category: 'testing',
    subtasks: [
      'Set up unit testing framework with 80%+ coverage',
      'Implement integration testing for API endpoints',
      'Configure end-to-end testing with Playwright/Cypress',
      'Set up automated test execution in CI/CD pipeline',
      'Create test reporting and quality metrics dashboard'
    ],
    acceptanceCriteria: [
      'All tests run automatically on code commits',
      'Test coverage reports generated for each build',
      'Failed tests block deployment to production',
      'Test results visible to entire development team'
    ]
  },
  {
    id: 'performance-budgets',
    title: 'Set Up Performance Budgets and Monitoring',
    description: 'Establish performance budgets and continuous monitoring for key metrics',
    status: 'todo',
    priority: 'high',
    estimatedTime: '8 hours',
    assignee: 'Performance Engineer',
    dueDate: '2024-12-24',
    category: 'performance',
    subtasks: [
      'Define performance budgets for Core Web Vitals',
      'Set up Lighthouse CI for automated performance testing',
      'Configure real user monitoring (RUM) tracking',
      'Implement performance regression detection',
      'Create performance optimization recommendations system'
    ],
    acceptanceCriteria: [
      'Performance budgets enforced in CI/CD pipeline',
      'Real-time performance monitoring active',
      'Performance regressions automatically detected',
      'Regular performance reports generated'
    ]
  },
  {
    id: 'security-scanning',
    title: 'Create Security Scanning Automation',
    description: 'Implement automated security scanning for vulnerabilities and compliance',
    status: 'todo',
    priority: 'critical',
    estimatedTime: '10 hours',
    assignee: 'Security Engineer',
    dueDate: '2024-12-24',
    category: 'security',
    subtasks: [
      'Set up SAST (Static Application Security Testing)',
      'Implement DAST (Dynamic Application Security Testing)',
      'Configure dependency vulnerability scanning',
      'Set up container security scanning',
      'Create security compliance reporting dashboard'
    ],
    acceptanceCriteria: [
      'Security scans run on every code commit',
      'Vulnerabilities automatically flagged and reported',
      'Security compliance status tracked continuously',
      'Security team receives real-time alerts'
    ]
  },
  {
    id: 'code-review-process',
    title: 'Establish Code Review and Deployment Processes',
    description: 'Create comprehensive code review guidelines and deployment procedures',
    status: 'todo',
    priority: 'high',
    estimatedTime: '6 hours',
    assignee: 'Technical Lead',
    dueDate: '2024-12-25',
    category: 'process',
    subtasks: [
      'Create code review guidelines and checklists',
      'Set up pull request templates and automation',
      'Implement deployment approval workflows',
      'Configure automated deployment with safety checks',
      'Create rollback procedures and documentation'
    ],
    acceptanceCriteria: [
      'All code changes require peer review',
      'Deployment process includes safety checks',
      'Rollback procedures tested and documented',
      'Team trained on review and deployment processes'
    ]
  }
];

// Priority 3: Success Metrics (Days 6-7)
const successMetricsTasks = [
  {
    id: 'analytics-tracking',
    title: 'Define and Implement Analytics Tracking',
    description: 'Set up comprehensive analytics tracking for events and user behavior',
    completed: false,
    progress: 0,
    priority: 'high',
    estimatedTime: '10 hours',
    assignee: 'Data Engineer',
    dueDate: '2024-12-26',
    category: 'analytics',
    components: [
      {
        name: 'Event Tracking Setup',
        description: 'Implement comprehensive event tracking for user interactions',
        tasks: ['Configure Google Analytics 4', 'Set up custom event tracking', 'Implement conversion funnel tracking'],
        completed: false
      },
      {
        name: 'User Behavior Analytics',
        description: 'Track user behavior patterns and engagement metrics',
        tasks: ['Set up heatmap tracking', 'Implement session recording', 'Configure user journey analysis'],
        completed: false
      },
      {
        name: 'Performance Analytics',
        description: 'Monitor application performance and user experience metrics',
        tasks: ['Core Web Vitals tracking', 'Error rate monitoring', 'Page load time analysis'],
        completed: false
      }
    ]
  },
  {
    id: 'business-metrics',
    title: 'Create Business Metrics Dashboard',
    description: 'Build comprehensive dashboard for MAU, MRR, NPS, and churn tracking',
    completed: false,
    progress: 0,
    priority: 'critical',
    estimatedTime: '12 hours',
    assignee: 'Business Analyst',
    dueDate: '2024-12-26',
    category: 'business-intelligence',
    components: [
      {
        name: 'User Growth Metrics',
        description: 'Track Monthly Active Users (MAU) and user acquisition',
        tasks: ['MAU calculation and tracking', 'User acquisition funnel analysis', 'Cohort retention analysis'],
        completed: false
      },
      {
        name: 'Revenue Metrics',
        description: 'Monitor Monthly Recurring Revenue (MRR) and financial KPIs',
        tasks: ['MRR tracking and forecasting', 'Customer lifetime value (CLV)', 'Revenue per user analysis'],
        completed: false
      },
      {
        name: 'Satisfaction Metrics',
        description: 'Track Net Promoter Score (NPS) and customer satisfaction',
        tasks: ['NPS survey implementation', 'Customer satisfaction tracking', 'Churn rate analysis'],
        completed: false
      }
    ]
  },
  {
    id: 'feedback-system',
    title: 'Set Up User Feedback Collection System',
    description: 'Implement comprehensive user feedback collection with surveys and NPS',
    completed: false,
    progress: 0,
    priority: 'medium',
    estimatedTime: '8 hours',
    assignee: 'Product Manager',
    dueDate: '2024-12-27',
    category: 'user-feedback',
    components: [
      {
        name: 'In-App Feedback',
        description: 'Collect feedback directly within the application',
        tasks: ['Feedback widget implementation', 'Feature request tracking', 'Bug report system'],
        completed: false
      },
      {
        name: 'Survey System',
        description: 'Automated survey system for user satisfaction',
        tasks: ['NPS survey automation', 'User satisfaction surveys', 'Feature usage surveys'],
        completed: false
      },
      {
        name: 'Feedback Analysis',
        description: 'Analyze and act on user feedback data',
        tasks: ['Feedback categorization system', 'Sentiment analysis implementation', 'Action item tracking'],
        completed: false
      }
    ]
  },
  {
    id: 'ab-testing',
    title: 'Establish A/B Testing Framework',
    description: 'Set up comprehensive A/B testing framework for feature optimization',
    completed: false,
    progress: 0,
    priority: 'medium',
    estimatedTime: '6 hours',
    assignee: 'Growth Engineer',
    dueDate: '2024-12-27',
    category: 'experimentation',
    components: [
      {
        name: 'Testing Infrastructure',
        description: 'Set up A/B testing platform and infrastructure',
        tasks: ['A/B testing platform setup', 'Feature flag system', 'Statistical significance tracking'],
        completed: false
      },
      {
        name: 'Experiment Design',
        description: 'Create templates and processes for experiment design',
        tasks: ['Experiment design templates', 'Hypothesis documentation', 'Success metrics definition'],
        completed: false
      },
      {
        name: 'Results Analysis',
        description: 'Automated analysis and reporting of A/B test results',
        tasks: ['Results dashboard creation', 'Statistical analysis automation', 'Recommendation engine'],
        completed: false
      }
    ]
  }
];

interface ImmediateNextActionsProps {
  // Optional props for customization
}

/**
 * FlashFusion Immediate Next Actions Component
 */
export function ImmediateNextActions({}: ImmediateNextActionsProps) {
  const [selectedPriority, setSelectedPriority] = useState<1 | 2 | 3>(1);
  const [foundationTasksState, setFoundationTasksState] = useState(foundationTasks);
  const [qualityTasksState, setQualityTasksState] = useState(qualityGateTasks);
  const [metricsTasksState, setMetricsTasksState] = useState(successMetricsTasks);

  // Calculate progress for each priority
  const priorityProgress = useMemo(() => {
    const priority1Progress = (foundationTasksState.filter(t => t.completed).length / foundationTasksState.length) * 100;
    const priority2Progress = (qualityTasksState.filter(t => t.status === 'done').length / qualityTasksState.length) * 100;
    const priority3Progress = metricsTasksState.reduce((sum, task) => sum + task.progress, 0) / metricsTasksState.length;
    
    return {
      priority1: Math.round(priority1Progress),
      priority2: Math.round(priority2Progress),
      priority3: Math.round(priority3Progress)
    };
  }, [foundationTasksState, qualityTasksState, metricsTasksState]);

  const toggleFoundationTask = (taskId: string) => {
    setFoundationTasksState(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const updateQualityTaskStatus = (taskId: string, newStatus: string) => {
    setQualityTasksState(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const updateMetricsTaskProgress = (taskId: string, progress: number) => {
    setMetricsTasksState(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, progress } : task
      )
    );
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'var(--ff-error)';
      case 2: return 'var(--ff-warning)';
      case 3: return 'var(--ff-success)';
      default: return 'var(--ff-text-muted)';
    }
  };

  const getPriorityIcon = (priority: number) => {
    switch (priority) {
      case 1: return <Flag className="w-4 h-4" />;
      case 2: return <Shield className="w-4 h-4" />;
      case 3: return <Target className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)]" style={{ fontFamily: 'var(--ff-font-secondary)' }}>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 ff-fade-in-up">
          <Badge className="ff-badge-warning mb-4">
            <Clock className="w-4 h-4 mr-2" />
            Immediate Actions - Next 7 Days
          </Badge>
          
          <h1 className="ff-text-display">
            Priority
            <span className="ff-text-gradient"> Action Plan</span>
          </h1>
          
          <p className="ff-text-body max-w-3xl mx-auto">
            Structured 7-day action plan with priority-based task management covering Foundation 
            (Days 1-2), Quality Gates (Days 3-5), and Success Metrics (Days 6-7) with comprehensive 
            tracking and progress monitoring systems.
          </p>
        </div>

        {/* Priority Overview */}
        <Card className="ff-card">
          <CardHeader>
            <CardTitle className="ff-text-title flex items-center gap-2">
              <Activity className="w-5 h-5 text-[var(--ff-warning)]" />
              7-Day Implementation Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((priority) => (
                <Card 
                  key={priority}
                  className={`ff-card cursor-pointer transition-all duration-200 ${
                    selectedPriority === priority 
                      ? 'border-2' 
                      : 'hover:border-opacity-50'
                  }`}
                  style={{ 
                    borderColor: selectedPriority === priority ? getPriorityColor(priority) : 'transparent'
                  }}
                  onClick={() => setSelectedPriority(priority as 1 | 2 | 3)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: getPriorityColor(priority) + '20' }}
                      >
                        {React.cloneElement(getPriorityIcon(priority), { 
                          style: { color: getPriorityColor(priority) } 
                        })}
                      </div>
                      <div>
                        <h3 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                          Priority {priority}
                        </h3>
                        <p className="ff-text-xs text-[var(--ff-text-muted)]">
                          {priority === 1 ? 'Days 1-2' : priority === 2 ? 'Days 3-5' : 'Days 6-7'}
                        </p>
                      </div>
                    </div>
                    
                    <p className="ff-text-xs text-[var(--ff-text-secondary)] mb-3">
                      {priority === 1 ? 'Foundation setup and infrastructure' : 
                       priority === 2 ? 'Quality gates and testing frameworks' : 
                       'Success metrics and analytics setup'}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="ff-text-xs text-[var(--ff-text-muted)]">Progress</span>
                        <span className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                          {priority === 1 ? priorityProgress.priority1 : 
                           priority === 2 ? priorityProgress.priority2 : 
                           priorityProgress.priority3}%
                        </span>
                      </div>
                      <Progress 
                        value={priority === 1 ? priorityProgress.priority1 : 
                               priority === 2 ? priorityProgress.priority2 : 
                               priorityProgress.priority3} 
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority Content */}
        <Card className="ff-card">
          <CardContent className="p-0">
            <Tabs value={`priority${selectedPriority}`} onValueChange={(value) => setSelectedPriority(parseInt(value.replace('priority', '')) as 1 | 2 | 3)} className="w-full">
              <div className="border-b border-[var(--border)]">
                <TabsList className="grid w-full grid-cols-3 bg-[var(--ff-surface)] rounded-none">
                  <TabsTrigger value="priority1" className="flex items-center gap-2">
                    <Flag className="w-4 h-4" />
                    Priority 1: Foundation
                  </TabsTrigger>
                  <TabsTrigger value="priority2" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Priority 2: Quality Gates
                  </TabsTrigger>
                  <TabsTrigger value="priority3" className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Priority 3: Success Metrics
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Priority 1: Foundation Tasks (Days 1-2) */}
              <TabsContent value="priority1" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="ff-text-title">Foundation Tasks - Days 1-2</h3>
                    <p className="ff-text-sm text-[var(--ff-text-muted)] mt-1">
                      Critical foundation setup for scalability, compliance, team structure, and monitoring
                    </p>
                  </div>
                  <Badge className="ff-badge-error">
                    {foundationTasksState.filter(t => t.completed).length}/{foundationTasksState.length} Complete
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {foundationTasksState.map((task) => (
                    <Card key={task.id} className="ff-card">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => toggleFoundationTask(task.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className={`ff-text-sm ${task.completed ? 'line-through text-[var(--ff-text-muted)]' : 'text-[var(--ff-text-primary)]'}`} 
                                  style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                {task.title}
                              </h4>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  className={`ff-badge-${task.priority === 'critical' ? 'error' : 'warning'} text-xs`}
                                >
                                  {task.priority}
                                </Badge>
                                <Badge className="ff-badge-secondary text-xs">
                                  {task.estimatedTime}
                                </Badge>
                              </div>
                            </div>
                            
                            <p className="ff-text-sm text-[var(--ff-text-muted)] mb-3">{task.description}</p>
                            
                            <div className="grid md:grid-cols-3 gap-4 mb-4 text-xs">
                              <div>
                                <span className="text-[var(--ff-text-muted)]">Assignee:</span>
                                <span className="text-[var(--ff-text-primary)] ml-1" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                  {task.assignee}
                                </span>
                              </div>
                              <div>
                                <span className="text-[var(--ff-text-muted)]">Due Date:</span>
                                <span className="text-[var(--ff-text-primary)] ml-1" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                  {task.dueDate}
                                </span>
                              </div>
                              <div>
                                <span className="text-[var(--ff-text-muted)]">Category:</span>
                                <span className="text-[var(--ff-text-primary)] ml-1 capitalize" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                  {task.category.replace('-', ' ')}
                                </span>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <h5 className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                  Checklist ({task.checklist.length} items)
                                </h5>
                                <ul className="mt-2 space-y-1">
                                  {task.checklist.map((item, index) => (
                                    <li key={index} className="ff-text-xs text-[var(--ff-text-muted)] flex items-start gap-2">
                                      <CheckCircle className="w-3 h-3 text-[var(--ff-success)] mt-0.5 flex-shrink-0" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                  Required Resources
                                </h5>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {task.resources.map((resource, index) => (
                                    <Badge key={index} className="ff-badge-secondary text-xs">
                                      {resource}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Priority 2: Quality Gates (Days 3-5) */}
              <TabsContent value="priority2" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="ff-text-title">Quality Gates - Days 3-5</h3>
                    <p className="ff-text-sm text-[var(--ff-text-muted)] mt-1">
                      Implement comprehensive quality gates, testing frameworks, and deployment processes
                    </p>
                  </div>
                  <Badge className="ff-badge-warning">
                    {qualityTasksState.filter(t => t.status === 'done').length}/{qualityTasksState.length} Complete
                  </Badge>
                </div>
                
                {/* Kanban Board */}
                <div className="grid lg:grid-cols-3 gap-6">
                  {['todo', 'in-progress', 'done'].map((status) => (
                    <div key={status} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                          {status === 'todo' ? 'To Do' : status === 'in-progress' ? 'In Progress' : 'Done'}
                        </h4>
                        <Badge className={`ff-badge-${status === 'todo' ? 'secondary' : status === 'in-progress' ? 'warning' : 'success'} text-xs`}>
                          {qualityTasksState.filter(t => t.status === status).length}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3 min-h-[400px] p-3 bg-[var(--ff-surface)] rounded-lg">
                        {qualityTasksState
                          .filter(task => task.status === status)
                          .map((task) => (
                            <Card key={task.id} className="ff-card cursor-pointer hover:border-[var(--ff-warning)]/30">
                              <CardContent className="p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                    {task.title}
                                  </h5>
                                  <Badge 
                                    className={`ff-badge-${task.priority === 'critical' ? 'error' : 'warning'} text-xs`}
                                  >
                                    {task.priority}
                                  </Badge>
                                </div>
                                
                                <p className="ff-text-xs text-[var(--ff-text-muted)] mb-3">{task.description}</p>
                                
                                <div className="space-y-2 mb-3">
                                  <div className="ff-text-xs text-[var(--ff-text-muted)]">
                                    <span>Assignee: </span>
                                    <span className="text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                      {task.assignee}
                                    </span>
                                  </div>
                                  <div className="ff-text-xs text-[var(--ff-text-muted)]">
                                    <span>Due: </span>
                                    <span className="text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                      {task.dueDate}
                                    </span>
                                  </div>
                                  <div className="ff-text-xs text-[var(--ff-text-muted)]">
                                    <span>Effort: </span>
                                    <span className="text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                      {task.estimatedTime}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <Badge className="ff-badge-secondary text-xs">
                                    {task.subtasks.length} subtasks
                                  </Badge>
                                  
                                  <div className="flex gap-1">
                                    {status !== 'todo' && (
                                      <Button
                                        size="sm"
                                        onClick={() => updateQualityTaskStatus(task.id, 
                                          status === 'in-progress' ? 'todo' : 'in-progress'
                                        )}
                                        className="ff-btn-outline p-1 h-6 w-6"
                                      >
                                        <ArrowRight className="w-3 h-3 rotate-180" />
                                      </Button>
                                    )}
                                    {status !== 'done' && (
                                      <Button
                                        size="sm"
                                        onClick={() => updateQualityTaskStatus(task.id, 
                                          status === 'todo' ? 'in-progress' : 'done'
                                        )}
                                        className="ff-btn-outline p-1 h-6 w-6"
                                      >
                                        <ArrowRight className="w-3 h-3" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Priority 3: Success Metrics (Days 6-7) */}
              <TabsContent value="priority3" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="ff-text-title">Success Metrics - Days 6-7</h3>
                    <p className="ff-text-sm text-[var(--ff-text-muted)] mt-1">
                      Analytics setup, business metrics dashboard, user feedback systems, and A/B testing framework
                    </p>
                  </div>
                  <Badge className="ff-badge-success">
                    {Math.round(metricsTasksState.reduce((sum, task) => sum + task.progress, 0) / metricsTasksState.length)}% Complete
                  </Badge>
                </div>
                
                <div className="space-y-6">
                  {metricsTasksState.map((task) => (
                    <Card key={task.id} className="ff-card">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                              {task.title}
                            </h4>
                            <p className="ff-text-sm text-[var(--ff-text-muted)] mt-1">{task.description}</p>
                            
                            <div className="grid md:grid-cols-3 gap-4 mt-3 text-xs">
                              <div>
                                <span className="text-[var(--ff-text-muted)]">Assignee:</span>
                                <span className="text-[var(--ff-text-primary)] ml-1" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                  {task.assignee}
                                </span>
                              </div>
                              <div>
                                <span className="text-[var(--ff-text-muted)]">Due Date:</span>
                                <span className="text-[var(--ff-text-primary)] ml-1" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                  {task.dueDate}
                                </span>
                              </div>
                              <div>
                                <span className="text-[var(--ff-text-muted)]">Effort:</span>
                                <span className="text-[var(--ff-text-primary)] ml-1" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                  {task.estimatedTime}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="ff-text-2xl text-[var(--ff-success)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                              {task.progress}%
                            </div>
                            <div className="ff-text-xs text-[var(--ff-text-muted)]">Progress</div>
                          </div>
                        </div>
                        
                        <Progress value={task.progress} className="h-3 mb-6" />
                        
                        <div className="space-y-4">
                          {task.components.map((component, index) => (
                            <div key={index} className="p-4 bg-[var(--ff-surface)] rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                  {component.name}
                                </h5>
                                <Checkbox
                                  checked={component.completed}
                                  onCheckedChange={(checked) => {
                                    // Update component completion status
                                    const newComponents = task.components.map(c => 
                                      c.name === component.name ? { ...c, completed: checked as boolean } : c
                                    );
                                    const newProgress = Math.round((newComponents.filter(c => c.completed).length / newComponents.length) * 100);
                                    updateMetricsTaskProgress(task.id, newProgress);
                                  }}
                                />
                              </div>
                              
                              <p className="ff-text-xs text-[var(--ff-text-muted)] mb-3">{component.description}</p>
                              
                              <div>
                                <h6 className="ff-text-xs text-[var(--ff-text-primary)] mb-2" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                  Tasks ({component.tasks.length} items)
                                </h6>
                                <ul className="space-y-1">
                                  {component.tasks.map((taskItem, taskIndex) => (
                                    <li key={taskIndex} className="ff-text-xs text-[var(--ff-text-muted)] flex items-start gap-2">
                                      <CheckCircle className="w-3 h-3 text-[var(--ff-success)] mt-0.5 flex-shrink-0" />
                                      {taskItem}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ImmediateNextActions;