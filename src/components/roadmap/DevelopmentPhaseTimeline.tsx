/**
 * @fileoverview FlashFusion Development Phase Timeline
 * @chunk roadmap
 * @category implementation-roadmap
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Comprehensive development phase roadmap timeline for Weeks 3-8 divided into
 * foundation (monitoring, testing pipeline, deployment automation, security scanning),
 * feature development (AI tool integration, improved onboarding flow, advanced analytics,
 * collaboration features) and optimization (performance tuning, security hardening,
 * UX refinement, documentation).
 * 
 * Features:
 * - Multi-phase development timeline visualization
 * - Foundation, development, and optimization phases
 * - Resource allocation and team coordination
 * - Sprint planning and milestone tracking
 * - Feature development progress monitoring
 * - Performance and security optimization tracking
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Code, 
  Zap, 
  Shield, 
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Calendar,
  ArrowRight,
  Play,
  Pause,
  Settings,
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Plus,
  Users,
  Target,
  Activity,
  Database,
  Server,
  Cloud,
  Globe,
  Smartphone,
  Monitor,
  Key,
  Lock,
  Bug,
  TestTube,
  GitBranch,
  MessageSquare,
  Bell,
  BarChart3,
  PieChart,
  LineChart,
  Layers,
  Cpu,
  HardDrive,
  Wifi,
  Award,
  Star,
  Briefcase,
  BookOpen,
  Gauge,
  Rocket,
  Wrench,
  Cog
} from 'lucide-react';

// Development phase structure
const developmentPhases = {
  foundation: {
    name: 'Foundation Phase',
    weeks: '3-4',
    duration: '2 weeks',
    focus: 'Core infrastructure, monitoring, testing, and security foundations',
    color: 'var(--ff-primary)',
    icon: <Server className="w-5 h-5" />,
    sprints: [
      {
        id: 'sprint-1',
        name: 'Sprint 1: Infrastructure Foundation',
        week: 3,
        duration: 7,
        goals: ['Monitoring setup', 'Testing pipeline', 'Basic security'],
        tasks: [
          {
            id: 'found-1',
            name: 'Production Monitoring Setup',
            description: 'Implement comprehensive monitoring, logging, and alerting for production systems',
            duration: 3,
            startDay: 1,
            owner: 'DevOps Engineer',
            team: ['SRE', 'Backend Engineers'],
            status: 'planned',
            priority: 'critical',
            category: 'monitoring',
            deliverables: ['Monitoring dashboards', 'Alert configurations', 'Log aggregation'],
            dependencies: [],
            effort: 24
          },
          {
            id: 'found-2',
            name: 'Automated Testing Pipeline',
            description: 'Build comprehensive CI/CD testing pipeline with unit, integration, and e2e tests',
            duration: 4,
            startDay: 2,
            owner: 'QA Lead',
            team: ['QA Engineers', 'Frontend Engineers', 'Backend Engineers'],
            status: 'planned',
            priority: 'critical',
            category: 'testing',
            deliverables: ['Test automation framework', 'CI/CD integration', 'Test coverage reports'],
            dependencies: ['found-1'],
            effort: 32
          },
          {
            id: 'found-3',
            name: 'Deployment Automation',
            description: 'Implement zero-downtime deployment automation with rollback capabilities',
            duration: 3,
            startDay: 3,
            owner: 'DevOps Engineer',
            team: ['Infrastructure Team', 'Backend Engineers'],
            status: 'planned',
            priority: 'high',
            category: 'deployment',
            deliverables: ['Deployment scripts', 'Rollback procedures', 'Environment management'],
            dependencies: ['found-1'],
            effort: 20
          },
          {
            id: 'found-4',
            name: 'Security Scanning Integration',
            description: 'Integrate automated security scanning into CI/CD pipeline',
            duration: 2,
            startDay: 4,
            owner: 'Security Engineer',
            team: ['DevOps Engineer', 'Backend Engineers'],
            status: 'planned',
            priority: 'high',
            category: 'security',
            deliverables: ['Security scan integration', 'Vulnerability reports', 'Compliance checks'],
            dependencies: ['found-2'],
            effort: 16
          }
        ]
      },
      {
        id: 'sprint-2',
        name: 'Sprint 2: Platform Hardening',
        week: 4,
        duration: 7,
        goals: ['Performance optimization', 'Security hardening', 'Monitoring enhancement'],
        tasks: [
          {
            id: 'found-5',
            name: 'Performance Baseline & Optimization',
            description: 'Establish performance baselines and implement critical optimizations',
            duration: 4,
            startDay: 8,
            owner: 'Performance Engineer',
            team: ['Frontend Engineers', 'Backend Engineers'],
            status: 'planned',
            priority: 'high',
            category: 'performance',
            deliverables: ['Performance benchmarks', 'Optimization implementations', 'Monitoring setup'],
            dependencies: ['found-1'],
            effort: 28
          },
          {
            id: 'found-6',
            name: 'Security Hardening',
            description: 'Implement security best practices and vulnerability mitigation',
            duration: 3,
            startDay: 9,
            owner: 'Security Engineer',
            team: ['DevOps Engineer', 'Backend Engineers'],
            status: 'planned',
            priority: 'critical',
            category: 'security',
            deliverables: ['Security configurations', 'Access controls', 'Audit logging'],
            dependencies: ['found-4'],
            effort: 24
          },
          {
            id: 'found-7',
            name: 'Advanced Monitoring & Alerting',
            description: 'Enhance monitoring with business metrics and intelligent alerting',
            duration: 2,
            startDay: 10,
            owner: 'SRE',
            team: ['DevOps Engineer', 'Data Engineer'],
            status: 'planned',
            priority: 'medium',
            category: 'monitoring',
            deliverables: ['Business dashboards', 'Smart alerts', 'Capacity monitoring'],
            dependencies: ['found-1', 'found-5'],
            effort: 16
          }
        ]
      }
    ]
  },
  development: {
    name: 'Feature Development Phase',
    weeks: '5-6',
    duration: '2 weeks',
    focus: 'Core feature implementation, AI integration, and user experience development',
    color: 'var(--ff-secondary)',
    icon: <Code className="w-5 h-5" />,
    sprints: [
      {
        id: 'sprint-3',
        name: 'Sprint 3: AI Tool Integration',
        week: 5,
        duration: 7,
        goals: ['AI service integration', 'Tool development', 'API implementation'],
        tasks: [
          {
            id: 'dev-1',
            name: 'AI Tool Integration Framework',
            description: 'Build comprehensive framework for integrating multiple AI services and tools',
            duration: 5,
            startDay: 15,
            owner: 'AI Engineer',
            team: ['Backend Engineers', 'Frontend Engineers'],
            status: 'planned',
            priority: 'critical',
            category: 'ai-integration',
            deliverables: ['AI service abstraction', 'Tool plugin system', 'API integrations'],
            dependencies: ['found-2', 'found-6'],
            effort: 40
          },
          {
            id: 'dev-2',
            name: 'Enhanced Onboarding Flow',
            description: 'Implement intelligent, personalized user onboarding experience',
            duration: 4,
            startDay: 16,
            owner: 'Product Manager',
            team: ['UI/UX Designer', 'Frontend Engineers'],
            status: 'planned',
            priority: 'high',
            category: 'user-experience',
            deliverables: ['Onboarding components', 'User flow optimization', 'Analytics integration'],
            dependencies: ['dev-1'],
            effort: 32
          },
          {
            id: 'dev-3',
            name: 'Advanced Analytics Implementation',
            description: 'Build comprehensive analytics system for user behavior and system performance',
            duration: 3,
            startDay: 17,
            owner: 'Data Engineer',
            team: ['Backend Engineers', 'Frontend Engineers'],
            status: 'planned',
            priority: 'medium',
            category: 'analytics',
            deliverables: ['Analytics pipeline', 'Reporting dashboards', 'Data visualization'],
            dependencies: ['found-7'],
            effort: 24
          },
          {
            id: 'dev-4',
            name: 'API Rate Limiting & Caching',
            description: 'Implement intelligent rate limiting and caching for AI services',
            duration: 2,
            startDay: 18,
            owner: 'Backend Engineer',
            team: ['DevOps Engineer', 'Performance Engineer'],
            status: 'planned',
            priority: 'medium',
            category: 'performance',
            deliverables: ['Rate limiting system', 'Caching layer', 'Performance optimization'],
            dependencies: ['dev-1'],
            effort: 16
          }
        ]
      },
      {
        id: 'sprint-4',
        name: 'Sprint 4: Collaboration Features',
        week: 6,
        duration: 7,
        goals: ['Team collaboration', 'Real-time features', 'User management'],
        tasks: [
          {
            id: 'dev-5',
            name: 'Real-time Collaboration System',
            description: 'Implement real-time collaboration features for team workflows',
            duration: 4,
            startDay: 22,
            owner: 'Frontend Lead',
            team: ['Frontend Engineers', 'Backend Engineers'],
            status: 'planned',
            priority: 'high',
            category: 'collaboration',
            deliverables: ['Real-time sync', 'Collaborative editing', 'Presence indicators'],
            dependencies: ['dev-1', 'dev-3'],
            effort: 32
          },
          {
            id: 'dev-6',
            name: 'Advanced User Management',
            description: 'Build comprehensive user management with roles, permissions, and team features',
            duration: 3,
            startDay: 23,
            owner: 'Backend Engineer',
            team: ['Frontend Engineers', 'Security Engineer'],
            status: 'planned',
            priority: 'high',
            category: 'user-management',
            deliverables: ['Role-based access', 'Team management', 'Permission system'],
            dependencies: ['found-6'],
            effort: 24
          },
          {
            id: 'dev-7',
            name: 'Notification & Communication System',
            description: 'Implement comprehensive notification and communication features',
            duration: 2,
            startDay: 24,
            owner: 'Frontend Engineer',
            team: ['Backend Engineers', 'UI/UX Designer'],
            status: 'planned',
            priority: 'medium',
            category: 'communication',
            deliverables: ['Notification system', 'In-app messaging', 'Email notifications'],
            dependencies: ['dev-5', 'dev-6'],
            effort: 16
          },
          {
            id: 'dev-8',
            name: 'Mobile Optimization',
            description: 'Optimize application for mobile devices with responsive design',
            duration: 3,
            startDay: 25,
            owner: 'Frontend Engineer',
            team: ['UI/UX Designer', 'QA Engineer'],
            status: 'planned',
            priority: 'medium',
            category: 'mobile',
            deliverables: ['Mobile UI components', 'Responsive layouts', 'Touch interactions'],
            dependencies: ['dev-2'],
            effort: 20
          }
        ]
      }
    ]
  },
  optimization: {
    name: 'Optimization Phase',
    weeks: '7-8',
    duration: '2 weeks',
    focus: 'Performance tuning, security hardening, UX refinement, and comprehensive documentation',
    color: 'var(--ff-accent)',
    icon: <Zap className="w-5 h-5" />,
    sprints: [
      {
        id: 'sprint-5',
        name: 'Sprint 5: Performance & Security',
        week: 7,
        duration: 7,
        goals: ['Performance optimization', 'Security hardening', 'Scalability improvements'],
        tasks: [
          {
            id: 'opt-1',
            name: 'Advanced Performance Tuning',
            description: 'Comprehensive performance optimization across all system components',
            duration: 4,
            startDay: 29,
            owner: 'Performance Engineer',
            team: ['Frontend Engineers', 'Backend Engineers', 'DevOps Engineer'],
            status: 'planned',
            priority: 'critical',
            category: 'performance',
            deliverables: ['Performance optimizations', 'Caching improvements', 'Database tuning'],
            dependencies: ['dev-1', 'dev-5'],
            effort: 32
          },
          {
            id: 'opt-2',
            name: 'Security Vulnerability Assessment',
            description: 'Comprehensive security assessment and vulnerability remediation',
            duration: 3,
            startDay: 30,
            owner: 'Security Engineer',
            team: ['DevOps Engineer', 'Backend Engineers'],
            status: 'planned',
            priority: 'critical',
            category: 'security',
            deliverables: ['Security audit report', 'Vulnerability fixes', 'Penetration testing'],
            dependencies: ['found-6', 'dev-6'],
            effort: 24
          },
          {
            id: 'opt-3',
            name: 'Scalability Architecture Review',
            description: 'Review and optimize system architecture for scalability',
            duration: 2,
            startDay: 31,
            owner: 'Solutions Architect',
            team: ['Backend Engineers', 'DevOps Engineer'],
            status: 'planned',
            priority: 'high',
            category: 'scalability',
            deliverables: ['Architecture improvements', 'Scaling strategies', 'Load testing'],
            dependencies: ['opt-1'],
            effort: 16
          },
          {
            id: 'opt-4',
            name: 'Database Optimization',
            description: 'Optimize database performance and implement advanced caching strategies',
            duration: 3,
            startDay: 32,
            owner: 'Database Engineer',
            team: ['Backend Engineers', 'Performance Engineer'],
            status: 'planned',
            priority: 'high',
            category: 'database',
            deliverables: ['Query optimization', 'Index improvements', 'Caching layer'],
            dependencies: ['opt-1'],
            effort: 20
          }
        ]
      },
      {
        id: 'sprint-6',
        name: 'Sprint 6: UX Refinement & Documentation',
        week: 8,
        duration: 7,
        goals: ['User experience polish', 'Documentation completion', 'Testing finalization'],
        tasks: [
          {
            id: 'opt-5',
            name: 'UX/UI Polish & Refinement',
            description: 'Final user experience improvements and interface polish',
            duration: 4,
            startDay: 36,
            owner: 'UI/UX Designer',
            team: ['Frontend Engineers', 'Product Manager'],
            status: 'planned',
            priority: 'high',
            category: 'user-experience',
            deliverables: ['UI improvements', 'Interaction polish', 'Accessibility enhancements'],
            dependencies: ['dev-2', 'dev-8'],
            effort: 28
          },
          {
            id: 'opt-6',
            name: 'Comprehensive Documentation',
            description: 'Create comprehensive technical and user documentation',
            duration: 3,
            startDay: 37,
            owner: 'Technical Writer',
            team: ['All Team Leads', 'Product Manager'],
            status: 'planned',
            priority: 'medium',
            category: 'documentation',
            deliverables: ['API documentation', 'User guides', 'Technical documentation'],
            dependencies: ['opt-1', 'opt-2'],
            effort: 24
          },
          {
            id: 'opt-7',
            name: 'End-to-End Testing Suite',
            description: 'Comprehensive end-to-end testing across all user workflows',
            duration: 3,
            startDay: 38,
            owner: 'QA Lead',
            team: ['QA Engineers', 'Frontend Engineers'],
            status: 'planned',
            priority: 'critical',
            category: 'testing',
            deliverables: ['E2E test suite', 'Automated testing', 'Performance testing'],
            dependencies: ['opt-5'],
            effort: 20
          },
          {
            id: 'opt-8',
            name: 'Production Readiness Review',
            description: 'Final production readiness assessment and launch preparation',
            duration: 2,
            startDay: 39,
            owner: 'CTO',
            team: ['All Team Leads', 'DevOps Engineer'],
            status: 'planned',
            priority: 'critical',
            category: 'launch-prep',
            deliverables: ['Readiness checklist', 'Launch plan', 'Rollback procedures'],
            dependencies: ['opt-6', 'opt-7'],
            effort: 16
          }
        ]
      }
    ]
  }
};

// Resource allocation data
const resourceAllocation = {
  totalEffort: 468, // Total person-hours
  teamUtilization: {
    'Frontend Engineers': 85,
    'Backend Engineers': 90,
    'DevOps Engineer': 95,
    'UI/UX Designer': 70,
    'QA Engineers': 80,
    'Performance Engineer': 75,
    'Security Engineer': 65,
    'Data Engineer': 60
  },
  sprintCapacity: {
    'Sprint 1': 92,
    'Sprint 2': 68,
    'Sprint 3': 112,
    'Sprint 4': 92,
    'Sprint 5': 92,
    'Sprint 6': 88
  }
};

interface DevelopmentPhaseTimelineProps {
  // Optional props for customization
}

/**
 * FlashFusion Development Phase Timeline Component
 */
export function DevelopmentPhaseTimeline({}: DevelopmentPhaseTimelineProps) {
  const [selectedPhase, setSelectedPhase] = useState<'foundation' | 'development' | 'optimization'>('foundation');
  const [selectedSprint, setSelectedSprint] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'sprints' | 'resources'>('timeline');

  // Calculate development metrics
  const developmentMetrics = useMemo(() => {
    const allTasks = Object.values(developmentPhases).flatMap(phase => 
      phase.sprints.flatMap(sprint => sprint.tasks)
    );
    
    const totalTasks = allTasks.length;
    const criticalTasks = allTasks.filter(task => task.priority === 'critical').length;
    const totalEffort = allTasks.reduce((sum, task) => sum + task.effort, 0);
    const avgEffortPerTask = Math.round((totalEffort / totalTasks) * 10) / 10;
    
    return {
      totalTasks,
      criticalTasks,
      totalEffort,
      avgEffortPerTask,
      totalSprints: 6,
      totalWeeks: 6
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'var(--ff-success)';
      case 'in-progress': return 'var(--ff-warning)';
      case 'planned': return 'var(--ff-secondary)';
      case 'blocked': return 'var(--ff-error)';
      default: return 'var(--ff-text-muted)';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Clock;
      case 'planned': return Calendar;
      case 'blocked': return XCircle;
      default: return AlertTriangle;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'var(--ff-error)';
      case 'high': return 'var(--ff-warning)';
      case 'medium': return 'var(--ff-secondary)';
      case 'low': return 'var(--ff-success)';
      default: return 'var(--ff-text-muted)';
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'monitoring': Activity,
      'testing': TestTube,
      'deployment': Rocket,
      'security': Shield,
      'performance': Zap,
      'ai-integration': Code,
      'user-experience': Smartphone,
      'analytics': BarChart3,
      'collaboration': Users,
      'user-management': Key,
      'communication': MessageSquare,
      'mobile': Smartphone,
      'scalability': TrendingUp,
      'database': Database,
      'documentation': BookOpen,
      'launch-prep': Award
    };
    return iconMap[category] || Settings;
  };

  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)]" style={{ fontFamily: 'var(--ff-font-secondary)' }}>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 ff-fade-in-up">
          <Badge className="ff-badge-secondary mb-4">
            <Code className="w-4 h-4 mr-2" />
            Development Phase - Weeks 3-8
          </Badge>
          
          <h1 className="ff-text-display">
            Development
            <span className="ff-text-gradient"> Timeline</span>
          </h1>
          
          <p className="ff-text-body max-w-3xl mx-auto">
            Comprehensive 6-week development phase divided into foundation, feature development, 
            and optimization stages with detailed sprint planning, resource allocation, and 
            milestone tracking across all development activities.
          </p>
        </div>

        {/* Development Overview Metrics */}
        <Card className="ff-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="ff-text-title flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[var(--ff-secondary)]" />
                Development Phase Overview
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setViewMode('timeline')}
                  size="sm"
                  className={viewMode === 'timeline' ? 'ff-btn-secondary' : 'ff-btn-outline'}
                >
                  Timeline
                </Button>
                <Button
                  onClick={() => setViewMode('sprints')}
                  size="sm"
                  className={viewMode === 'sprints' ? 'ff-btn-secondary' : 'ff-btn-outline'}
                >
                  Sprints
                </Button>
                <Button
                  onClick={() => setViewMode('resources')}
                  size="sm"
                  className={viewMode === 'resources' ? 'ff-btn-secondary' : 'ff-btn-outline'}
                >
                  Resources
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-secondary)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Target className="w-6 h-6 text-[var(--ff-secondary)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  {developmentMetrics.totalTasks}
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Total Tasks</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-error)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <AlertTriangle className="w-6 h-6 text-[var(--ff-error)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  {developmentMetrics.criticalTasks}
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Critical Tasks</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-primary)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-6 h-6 text-[var(--ff-primary)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  {developmentMetrics.totalEffort}h
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Total Effort</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-accent)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calendar className="w-6 h-6 text-[var(--ff-accent)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  {developmentMetrics.totalSprints}
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Sprints</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-success)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-[var(--ff-success)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  8
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Team Roles</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-warning)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-[var(--ff-warning)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  {developmentMetrics.totalWeeks}
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Weeks</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Development Phases */}
        <Card className="ff-card">
          <CardContent className="p-0">
            <Tabs value={selectedPhase} onValueChange={(value) => setSelectedPhase(value as any)} className="w-full">
              <div className="border-b border-[var(--border)]">
                <TabsList className="grid w-full grid-cols-3 bg-[var(--ff-surface)] rounded-none">
                  <TabsTrigger value="foundation" className="flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    Foundation
                  </TabsTrigger>
                  <TabsTrigger value="development" className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Development  
                  </TabsTrigger>
                  <TabsTrigger value="optimization" className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Optimization
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Foundation Phase */}
              <TabsContent value="foundation" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {developmentPhases.foundation.icon}
                    <div>
                      <h3 className="ff-text-title">{developmentPhases.foundation.name}</h3>
                      <p className="ff-text-sm text-[var(--ff-text-muted)] mt-1">{developmentPhases.foundation.focus}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="ff-badge-primary">
                      Weeks {developmentPhases.foundation.weeks}
                    </Badge>
                    <Badge className="ff-badge-secondary">
                      {developmentPhases.foundation.duration}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-6">
                  {developmentPhases.foundation.sprints.map((sprint) => (
                    <Card key={sprint.id} className="ff-card">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="ff-text-base">{sprint.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge className="ff-badge-primary text-xs">Week {sprint.week}</Badge>
                            <Badge className="ff-badge-secondary text-xs">{sprint.duration} days</Badge>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {sprint.goals.map((goal, index) => (
                            <Badge key={index} className="ff-badge-success text-xs">
                              {goal}
                            </Badge>
                          ))}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {sprint.tasks.map((task) => {
                          const CategoryIcon = getCategoryIcon(task.category);
                          
                          return (
                            <Card 
                              key={task.id} 
                              className={`ff-card cursor-pointer transition-all duration-200 ${
                                selectedTask === task.id 
                                  ? 'border-[var(--ff-primary)] bg-[var(--ff-surface-light)]' 
                                  : 'hover:border-[var(--ff-primary)]/30'
                              }`}
                              onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-3">
                                    <CategoryIcon className="w-4 h-4 text-[var(--ff-primary)]" />
                                    <div>
                                      <h4 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                        {task.name}
                                      </h4>
                                      <p className="ff-text-xs text-[var(--ff-text-muted)]">{task.owner}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge 
                                      className={`ff-badge-${task.priority === 'critical' ? 'error' : task.priority === 'high' ? 'warning' : 'secondary'} text-xs`}
                                    >
                                      {task.priority}
                                    </Badge>
                                    <Badge className="ff-badge-secondary text-xs">
                                      {task.effort}h
                                    </Badge>
                                    {React.createElement(getStatusIcon(task.status), {
                                      className: "w-4 h-4",
                                      style: { color: getStatusColor(task.status) }
                                    })}
                                  </div>
                                </div>
                                
                                <div className="mt-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="ff-text-xs text-[var(--ff-text-muted)]">Duration</span>
                                    <span className="ff-text-xs text-[var(--ff-text-primary)]">{task.duration} days</span>
                                  </div>
                                  <Progress value={(task.duration / 7) * 100} className="h-2" />
                                </div>
                                
                                {selectedTask === task.id && (
                                  <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-4">
                                    <p className="ff-text-sm text-[var(--ff-text-secondary)]">{task.description}</p>
                                    
                                    <div className="grid md:grid-cols-2 gap-4">
                                      <div>
                                        <h5 className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                          Team Members
                                        </h5>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {task.team.map((member, index) => (
                                            <Badge key={index} className="ff-badge-secondary text-xs">
                                              {member}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <h5 className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                          Key Deliverables
                                        </h5>
                                        <ul className="mt-1 space-y-1">
                                          {task.deliverables.slice(0, 2).map((deliverable, index) => (
                                            <li key={index} className="ff-text-xs text-[var(--ff-text-muted)] flex items-start gap-1">
                                              <CheckCircle className="w-3 h-3 text-[var(--ff-success)] mt-0.5 flex-shrink-0" />
                                              {deliverable}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                    
                                    {task.dependencies.length > 0 && (
                                      <div>
                                        <h5 className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                          Dependencies
                                        </h5>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {task.dependencies.map((dep, index) => (
                                            <Badge key={index} className="ff-badge-warning text-xs">
                                              <ArrowRight className="w-3 h-3 mr-1" />
                                              {dep}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          );
                        })}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Development Phase */}
              <TabsContent value="development" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {developmentPhases.development.icon}
                    <div>
                      <h3 className="ff-text-title">{developmentPhases.development.name}</h3>
                      <p className="ff-text-sm text-[var(--ff-text-muted)] mt-1">{developmentPhases.development.focus}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="ff-badge-secondary">
                      Weeks {developmentPhases.development.weeks}
                    </Badge>
                    <Badge className="ff-badge-primary">
                      {developmentPhases.development.duration}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-6">
                  {developmentPhases.development.sprints.map((sprint) => (
                    <Card key={sprint.id} className="ff-card">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="ff-text-base">{sprint.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge className="ff-badge-secondary text-xs">Week {sprint.week}</Badge>
                            <Badge className="ff-badge-primary text-xs">{sprint.duration} days</Badge>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {sprint.goals.map((goal, index) => (
                            <Badge key={index} className="ff-badge-success text-xs">
                              {goal}
                            </Badge>
                          ))}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {sprint.tasks.map((task) => {
                          const CategoryIcon = getCategoryIcon(task.category);
                          
                          return (
                            <Card 
                              key={task.id} 
                              className={`ff-card cursor-pointer transition-all duration-200 ${
                                selectedTask === task.id 
                                  ? 'border-[var(--ff-secondary)] bg-[var(--ff-surface-light)]' 
                                  : 'hover:border-[var(--ff-secondary)]/30'
                              }`}
                              onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-3">
                                    <CategoryIcon className="w-4 h-4 text-[var(--ff-secondary)]" />
                                    <div>
                                      <h4 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                        {task.name}
                                      </h4>
                                      <p className="ff-text-xs text-[var(--ff-text-muted)]">{task.owner}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge 
                                      className={`ff-badge-${task.priority === 'critical' ? 'error' : task.priority === 'high' ? 'warning' : 'secondary'} text-xs`}
                                    >
                                      {task.priority}
                                    </Badge>
                                    <Badge className="ff-badge-secondary text-xs">
                                      {task.effort}h
                                    </Badge>
                                    {React.createElement(getStatusIcon(task.status), {
                                      className: "w-4 h-4",
                                      style: { color: getStatusColor(task.status) }
                                    })}
                                  </div>
                                </div>
                                
                                <div className="mt-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="ff-text-xs text-[var(--ff-text-muted)]">Duration</span>
                                    <span className="ff-text-xs text-[var(--ff-text-primary)]">{task.duration} days</span>
                                  </div>
                                  <Progress value={(task.duration / 7) * 100} className="h-2" />
                                </div>
                                
                                {selectedTask === task.id && (
                                  <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-4">
                                    <p className="ff-text-sm text-[var(--ff-text-secondary)]">{task.description}</p>
                                    
                                    <div className="grid md:grid-cols-2 gap-4">
                                      <div>
                                        <h5 className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                          Deliverables
                                        </h5>
                                        <ul className="mt-1 space-y-1">
                                          {task.deliverables.map((deliverable, index) => (
                                            <li key={index} className="ff-text-xs text-[var(--ff-text-muted)] flex items-start gap-1">
                                              <CheckCircle className="w-3 h-3 text-[var(--ff-success)] mt-0.5 flex-shrink-0" />
                                              {deliverable}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      
                                      <div>
                                        <h5 className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                          Team
                                        </h5>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {task.team.map((member, index) => (
                                            <Badge key={index} className="ff-badge-secondary text-xs">
                                              {member}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          );
                        })}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Optimization Phase */}
              <TabsContent value="optimization" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {developmentPhases.optimization.icon}
                    <div>
                      <h3 className="ff-text-title">{developmentPhases.optimization.name}</h3>
                      <p className="ff-text-sm text-[var(--ff-text-muted)] mt-1">{developmentPhases.optimization.focus}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="ff-badge-accent">
                      Weeks {developmentPhases.optimization.weeks}
                    </Badge>
                    <Badge className="ff-badge-secondary">
                      {developmentPhases.optimization.duration}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-6">
                  {developmentPhases.optimization.sprints.map((sprint) => (
                    <Card key={sprint.id} className="ff-card">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="ff-text-base">{sprint.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge className="ff-badge-accent text-xs">Week {sprint.week}</Badge>
                            <Badge className="ff-badge-secondary text-xs">{sprint.duration} days</Badge>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {sprint.goals.map((goal, index) => (
                            <Badge key={index} className="ff-badge-success text-xs">
                              {goal}
                            </Badge>
                          ))}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {sprint.tasks.map((task) => {
                          const CategoryIcon = getCategoryIcon(task.category);
                          
                          return (
                            <Card 
                              key={task.id} 
                              className={`ff-card cursor-pointer transition-all duration-200 ${
                                selectedTask === task.id 
                                  ? 'border-[var(--ff-accent)] bg-[var(--ff-surface-light)]' 
                                  : 'hover:border-[var(--ff-accent)]/30'
                              }`}
                              onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-3">
                                    <CategoryIcon className="w-4 h-4 text-[var(--ff-accent)]" />
                                    <div>
                                      <h4 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                        {task.name}
                                      </h4>
                                      <p className="ff-text-xs text-[var(--ff-text-muted)]">{task.owner}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge 
                                      className={`ff-badge-${task.priority === 'critical' ? 'error' : task.priority === 'high' ? 'warning' : 'secondary'} text-xs`}
                                    >
                                      {task.priority}
                                    </Badge>
                                    <Badge className="ff-badge-secondary text-xs">
                                      {task.effort}h
                                    </Badge>
                                    {React.createElement(getStatusIcon(task.status), {
                                      className: "w-4 h-4",
                                      style: { color: getStatusColor(task.status) }
                                    })}
                                  </div>
                                </div>
                                
                                <div className="mt-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="ff-text-xs text-[var(--ff-text-muted)]">Duration</span>
                                    <span className="ff-text-xs text-[var(--ff-text-primary)]">{task.duration} days</span>
                                  </div>
                                  <Progress value={(task.duration / 7) * 100} className="h-2" />
                                </div>
                                
                                {selectedTask === task.id && (
                                  <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-4">
                                    <p className="ff-text-sm text-[var(--ff-text-secondary)]">{task.description}</p>
                                    
                                    <div className="grid md:grid-cols-2 gap-4">
                                      <div>
                                        <h5 className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                          Deliverables
                                        </h5>
                                        <ul className="mt-1 space-y-1">
                                          {task.deliverables.map((deliverable, index) => (
                                            <li key={index} className="ff-text-xs text-[var(--ff-text-muted)] flex items-start gap-1">
                                              <CheckCircle className="w-3 h-3 text-[var(--ff-success)] mt-0.5 flex-shrink-0" />
                                              {deliverable}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      
                                      <div>
                                        <h5 className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                          Team
                                        </h5>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {task.team.map((member, index) => (
                                            <Badge key={index} className="ff-badge-secondary text-xs">
                                              {member}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          );
                        })}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Resource Allocation */}
        {viewMode === 'resources' && (
          <Card className="ff-card">
            <CardHeader>
              <CardTitle className="ff-text-title flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--ff-accent)]" />
                Resource Allocation & Team Utilization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Team Utilization */}
                <div>
                  <h4 className="ff-text-base text-[var(--ff-text-primary)] mb-4" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                    Team Utilization
                  </h4>
                  <div className="space-y-4">
                    {Object.entries(resourceAllocation.teamUtilization).map(([role, utilization}) => (
                      <div key={role} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="ff-text-sm text-[var(--ff-text-primary)]">{role}</span>
                          <span className="ff-text-sm text-[var(--ff-text-secondary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                            {utilization}%
                          </span>
                        </div>
                        <Progress 
                          value={utilization} 
                          className="h-2"
                          style={{
                            '--progress-background': utilization > 90 ? 'var(--ff-error)' : 
                                                  utilization > 80 ? 'var(--ff-warning)' : 
                                                  'var(--ff-success)'
                          } as React.CSSProperties}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sprint Capacity */}
                <div>
                  <h4 className="ff-text-base text-[var(--ff-text-primary)] mb-4" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                    Sprint Capacity (Hours)
                  </h4>
                  <div className="space-y-4">
                    {Object.entries(resourceAllocation.sprintCapacity).map(([sprint, capacity]) => (
                      <div key={sprint} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="ff-text-sm text-[var(--ff-text-primary)]">{sprint}</span>
                          <span className="ff-text-sm text-[var(--ff-text-secondary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                            {capacity}h
                          </span>
                        </div>
                        <Progress value={(capacity / 120) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default DevelopmentPhaseTimeline;