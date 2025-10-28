/**
 * @fileoverview FlashFusion Discovery Phase Timeline
 * @chunk roadmap
 * @category implementation-roadmap
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Comprehensive discovery phase roadmap timeline for Weeks 1-2 showing activities
 * such as finalizing business requirements, auditing technical architecture,
 * establishing team roles, creating detailed project timeline, and setting up
 * monitoring and deployment infrastructure.
 * 
 * Features:
 * - Interactive Gantt chart visualization
 * - Team role assignments and responsibilities
 * - Dependency tracking and critical path analysis
 * - Progress monitoring and milestone tracking
 * - Risk assessment and mitigation planning
 * - Resource allocation and capacity planning
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Calendar, 
  Clock, 
  Users, 
  Target,
  CheckCircle,
  AlertTriangle,
  XCircle,
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
  Minus,
  BarChart3,
  TrendingUp,
  Activity,
  Zap,
  Shield,
  Database,
  Code,
  Server,
  Cloud,
  Globe,
  Smartphone,
  Monitor,
  Key,
  Lock,
  Flag,
  Award,
  Star,
  Briefcase,
  GitBranch,
  MessageSquare,
  Bell,
  Archive,
  BookOpen,
  PieChart,
  LineChart
} from 'lucide-react';

// Discovery phase activities data
const discoveryActivities = {
  week1: {
    name: 'Week 1: Foundation & Requirements',
    duration: '5 days',
    focus: 'Business requirements, stakeholder alignment, and initial technical assessment',
    activities: [
      {
        id: 'req-1',
        name: 'Stakeholder Alignment Sessions',
        description: 'Conduct comprehensive stakeholder interviews and requirement gathering sessions',
        duration: 2,
        startDay: 1,
        owner: 'Product Manager',
        participants: ['CEO', 'CTO', 'Key Stakeholders'],
        status: 'planned',
        priority: 'critical',
        deliverables: ['Stakeholder requirements matrix', 'Business objectives document', 'Success criteria definition'],
        dependencies: [],
        risks: ['Conflicting priorities', 'Unclear requirements'],
        category: 'requirements'
      },
      {
        id: 'req-2',
        name: 'Business Requirements Finalization',
        description: 'Document and validate all business requirements with clear acceptance criteria',
        duration: 3,
        startDay: 2,
        owner: 'Product Manager',
        participants: ['Business Analyst', 'UI/UX Designer'],
        status: 'planned',
        priority: 'critical',
        deliverables: ['Business requirements document', 'User stories backlog', 'Acceptance criteria'],
        dependencies: ['req-1'],
        risks: ['Incomplete requirements', 'Changing priorities'],
        category: 'requirements'
      },
      {
        id: 'arch-1',
        name: 'Current Architecture Audit',
        description: 'Comprehensive review of existing technical architecture and infrastructure',
        duration: 2,
        startDay: 1,
        owner: 'Solutions Architect',
        participants: ['CTO', 'Senior Engineers', 'DevOps Engineer'],
        status: 'planned',
        priority: 'high',
        deliverables: ['Architecture assessment report', 'Technical debt analysis', 'Scalability evaluation'],
        dependencies: [],
        risks: ['Legacy system constraints', 'Technical debt impact'],
        category: 'architecture'
      },
      {
        id: 'team-1',
        name: 'Team Role Definition',
        description: 'Define team structure, roles, responsibilities, and communication protocols',
        duration: 1,
        startDay: 3,
        owner: 'CTO',
        participants: ['HR Lead', 'Team Leads'],
        status: 'planned',
        priority: 'high',
        deliverables: ['Team structure chart', 'Role definitions', 'RACI matrix'],
        dependencies: ['req-1'],
        risks: ['Resource availability', 'Skill gaps'],
        category: 'team'
      },
      {
        id: 'risk-1',
        name: 'Risk Assessment & Mitigation',
        description: 'Identify potential risks and develop comprehensive mitigation strategies',
        duration: 2,
        startDay: 4,
        owner: 'Project Manager',
        participants: ['All Team Leads', 'Security Consultant'],
        status: 'planned',
        priority: 'medium',
        deliverables: ['Risk register', 'Mitigation strategies', 'Contingency plans'],
        dependencies: ['arch-1', 'team-1'],
        risks: ['Unforeseen technical challenges', 'External dependencies'],
        category: 'planning'
      }
    ]
  },
  week2: {
    name: 'Week 2: Infrastructure & Timeline',
    duration: '5 days',
    focus: 'Technical infrastructure setup, detailed planning, and monitoring implementation',
    activities: [
      {
        id: 'infra-1',
        name: 'Development Environment Setup',
        description: 'Configure development, staging, and testing environments with proper CI/CD pipelines',
        duration: 3,
        startDay: 6,
        owner: 'DevOps Engineer',
        participants: ['Infrastructure Team', 'Security Engineer'],
        status: 'planned',
        priority: 'critical',
        deliverables: ['Environment configurations', 'CI/CD pipeline setup', 'Access controls'],
        dependencies: ['arch-1'],
        risks: ['Environment compatibility', 'Security vulnerabilities'],
        category: 'infrastructure'
      },
      {
        id: 'monitor-1',
        name: 'Monitoring & Alerting Setup',
        description: 'Implement comprehensive monitoring, logging, and alerting systems',
        duration: 2,
        startDay: 7,
        owner: 'SRE',
        participants: ['DevOps Engineer', 'Security Engineer'],
        status: 'planned',
        priority: 'high',
        deliverables: ['Monitoring dashboards', 'Alert configurations', 'Log aggregation setup'],
        dependencies: ['infra-1'],
        risks: ['Performance impact', 'Alert fatigue'],
        category: 'monitoring'
      },
      {
        id: 'deploy-1',
        name: 'Deployment Infrastructure',
        description: 'Set up automated deployment pipelines and infrastructure as code',
        duration: 3,
        startDay: 6,
        owner: 'DevOps Engineer',
        participants: ['Infrastructure Team', 'Security Engineer'],
        status: 'planned',
        priority: 'critical',
        deliverables: ['Deployment scripts', 'Infrastructure templates', 'Rollback procedures'],
        dependencies: ['infra-1'],
        risks: ['Deployment failures', 'Rollback complexity'],
        category: 'deployment'
      },
      {
        id: 'timeline-1',
        name: 'Detailed Project Timeline',
        description: 'Create comprehensive project timeline with milestones, dependencies, and resource allocation',
        duration: 2,
        startDay: 8,
        owner: 'Project Manager',
        participants: ['All Team Leads', 'Product Manager'],
        status: 'planned',
        priority: 'critical',
        deliverables: ['Project timeline', 'Milestone definitions', 'Resource allocation plan'],
        dependencies: ['req-2', 'team-1'],
        risks: ['Unrealistic timelines', 'Resource conflicts'],
        category: 'planning'
      },
      {
        id: 'quality-1',
        name: 'Quality Assurance Framework',
        description: 'Establish testing strategies, quality gates, and review processes',
        duration: 2,
        startDay: 9,
        owner: 'QA Lead',
        participants: ['QA Engineers', 'Development Team'],
        status: 'planned',
        priority: 'high',
        deliverables: ['Testing strategy', 'Quality gates', 'Review processes'],
        dependencies: ['timeline-1'],
        risks: ['Insufficient testing', 'Quality bottlenecks'],
        category: 'quality'
      }
    ]
  }
};

// Team roles and responsibilities
const teamRoles = [
  {
    role: 'Product Manager',
    responsibilities: ['Requirements gathering', 'Stakeholder management', 'Product roadmap'],
    workload: 90,
    skills: ['Product Strategy', 'User Research', 'Stakeholder Management'],
    status: 'assigned'
  },
  {
    role: 'Solutions Architect',
    responsibilities: ['Architecture review', 'Technical decisions', 'System design'],
    workload: 85,
    skills: ['System Architecture', 'Cloud Platforms', 'Technical Leadership'],
    status: 'assigned'
  },
  {
    role: 'DevOps Engineer',
    responsibilities: ['Infrastructure setup', 'CI/CD pipelines', 'Deployment automation'],
    workload: 95,
    skills: ['Docker', 'Kubernetes', 'AWS/Azure', 'Terraform'],
    status: 'assigned'
  },
  {
    role: 'Project Manager',
    responsibilities: ['Timeline management', 'Risk assessment', 'Team coordination'],
    workload: 80,
    skills: ['Project Management', 'Risk Management', 'Communication'],
    status: 'assigned'
  },
  {
    role: 'QA Lead',
    responsibilities: ['Quality framework', 'Testing strategy', 'Review processes'],
    workload: 75,
    skills: ['Test Strategy', 'Quality Assurance', 'Process Design'],
    status: 'assigned'
  },
  {
    role: 'Security Engineer',
    responsibilities: ['Security assessment', 'Compliance review', 'Threat analysis'],
    workload: 70,
    skills: ['Security Architecture', 'Compliance', 'Risk Assessment'],
    status: 'consultant'
  }
];

// Timeline visualization data
const timelineData = {
  totalDays: 10,
  workingDays: 10,
  weekends: [],
  milestones: [
    { day: 3, name: 'Requirements Baseline', type: 'major' },
    { day: 5, name: 'Week 1 Completion', type: 'minor' },
    { day: 8, name: 'Infrastructure Ready', type: 'major' },
    { day: 10, name: 'Discovery Complete', type: 'critical' }
  ]
};

interface DiscoveryPhaseTimelineProps {
  // Optional props for customization
}

/**
 * FlashFusion Discovery Phase Timeline Component
 */
export function DiscoveryPhaseTimeline({}: DiscoveryPhaseTimelineProps) {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'gantt' | 'kanban' | 'calendar'>('gantt');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedWeek, setSelectedWeek] = useState<1 | 2>(1);

  // Calculate overall progress and metrics
  const discoveryMetrics = useMemo(() => {
    const allActivities = [...discoveryActivities.week1.activities, ...discoveryActivities.week2.activities];
    const totalActivities = allActivities.length;
    const criticalActivities = allActivities.filter(a => a.priority === 'critical').length;
    const totalDuration = allActivities.reduce((sum, a) => sum + a.duration, 0);
    const averageDuration = totalDuration / totalActivities;
    
    return {
      totalActivities,
      criticalActivities,
      totalDuration,
      averageDuration: Math.round(averageDuration * 10) / 10,
      teamMembers: teamRoles.length,
      avgWorkload: Math.round(teamRoles.reduce((sum, role) => sum + role.workload, 0) / teamRoles.length)
    };
  }, []);

  // Filter activities by category
  const filteredActivities = useMemo(() => {
    const activities = selectedWeek === 1 ? discoveryActivities.week1.activities : discoveryActivities.week2.activities;
    if (filterCategory === 'all') return activities;
    return activities.filter(activity => activity.category === filterCategory);
  }, [selectedWeek, filterCategory]);

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
    switch (category) {
      case 'requirements': return FileText;
      case 'architecture': return Server;
      case 'infrastructure': return Cloud;
      case 'monitoring': return Activity;
      case 'deployment': return Globe;
      case 'team': return Users;
      case 'planning': return Target;
      case 'quality': return Shield;
      default: return Settings;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)]" style={{ fontFamily: 'var(--ff-font-secondary)' }}>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 ff-fade-in-up">
          <Badge className="ff-badge-success mb-4">
            <Calendar className="w-4 h-4 mr-2" />
            Discovery Phase - Weeks 1-2
          </Badge>
          
          <h1 className="ff-text-display">
            Implementation
            <span className="ff-text-gradient"> Discovery</span>
          </h1>
          
          <p className="ff-text-body max-w-3xl mx-auto">
            Comprehensive discovery phase timeline for finalizing business requirements, auditing technical 
            architecture, establishing team roles, creating detailed project timeline, and setting up 
            monitoring and deployment infrastructure.
          </p>
        </div>

        {/* Discovery Overview Metrics */}
        <Card className="ff-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="ff-text-title flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[var(--ff-success)]" />
                Discovery Phase Overview
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setViewMode('gantt')}
                  size="sm"
                  className={viewMode === 'gantt' ? 'ff-btn-success' : 'ff-btn-outline'}
                >
                  Gantt
                </Button>
                <Button
                  onClick={() => setViewMode('kanban')}
                  size="sm"
                  className={viewMode === 'kanban' ? 'ff-btn-success' : 'ff-btn-outline'}
                >
                  Kanban
                </Button>
                <Button
                  onClick={() => setViewMode('calendar')}
                  size="sm"
                  className={viewMode === 'calendar' ? 'ff-btn-success' : 'ff-btn-outline'}
                >
                  Calendar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-success)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Target className="w-6 h-6 text-[var(--ff-success)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  {discoveryMetrics.totalActivities}
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Total Activities</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-error)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Flag className="w-6 h-6 text-[var(--ff-error)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  {discoveryMetrics.criticalActivities}
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Critical Tasks</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-primary)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-6 h-6 text-[var(--ff-primary)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  {discoveryMetrics.totalDuration}
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Total Days</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-secondary)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-[var(--ff-secondary)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  {discoveryMetrics.teamMembers}
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Team Members</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Visualization */}
        <Card className="ff-card">
          <CardContent className="p-0">
            <Tabs value={`week${selectedWeek}`} onValueChange={(value) => setSelectedWeek(parseInt(value.replace('week', '')) as 1 | 2)} className="w-full">
              <div className="border-b border-[var(--border)]">
                <div className="flex items-center justify-between p-6">
                  <TabsList className="grid w-full max-w-md grid-cols-2 bg-[var(--ff-surface)]">
                    <TabsTrigger value="week1" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Week 1
                    </TabsTrigger>
                    <TabsTrigger value="week2" className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Week 2
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center gap-4">
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-3 py-2 bg-[var(--ff-surface)] border border-[var(--border)] rounded-lg text-[var(--ff-text-primary)] focus:outline-none focus:border-[var(--ff-success)]"
                    >
                      <option value="all">All Categories</option>
                      <option value="requirements">Requirements</option>
                      <option value="architecture">Architecture</option>
                      <option value="infrastructure">Infrastructure</option>
                      <option value="monitoring">Monitoring</option>
                      <option value="deployment">Deployment</option>
                      <option value="team">Team</option>
                      <option value="planning">Planning</option>
                      <option value="quality">Quality</option>
                    </select>
                    
                    <Button className="ff-btn-success">
                      <Download className="w-4 h-4 mr-2" />
                      Export Timeline
                    </Button>
                  </div>
                </div>
              </div>

              {/* Week 1 Activities */}
              <TabsContent value="week1" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="ff-text-title">{discoveryActivities.week1.name}</h3>
                    <p className="ff-text-sm text-[var(--ff-text-muted)] mt-1">{discoveryActivities.week1.focus}</p>
                  </div>
                  <Badge className="ff-badge-success">
                    {discoveryActivities.week1.duration}
                  </Badge>
                </div>
                
                {/* Gantt Chart View */}
                {viewMode === 'gantt' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-2 mb-4">
                      <div className="col-span-4 ff-text-sm text-[var(--ff-text-muted)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                        Activity
                      </div>
                      <div className="col-span-8 grid grid-cols-5 gap-1">
                        {[1, 2, 3, 4, 5].map(day => (
                          <div key={day} className="text-center ff-text-xs text-[var(--ff-text-muted)]">
                            Day {day}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {filteredActivities.map((activity) => {
                      const CategoryIcon = getCategoryIcon(activity.category);
                      
                      return (
                        <Card 
                          key={activity.id} 
                          className={`ff-card cursor-pointer transition-all duration-200 ${
                            selectedActivity === activity.id 
                              ? 'border-[var(--ff-success)] bg-[var(--ff-surface-light)]' 
                              : 'hover:border-[var(--ff-success)]/30'
                          }`}
                          onClick={() => setSelectedActivity(selectedActivity === activity.id ? null : activity.id)}
                        >
                          <CardContent className="p-4">
                            <div className="grid grid-cols-12 gap-4 items-center">
                              <div className="col-span-4">
                                <div className="flex items-center gap-3">
                                  <CategoryIcon className="w-4 h-4 text-[var(--ff-success)]" />
                                  <div>
                                    <h4 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                      {activity.name}
                                    </h4>
                                    <p className="ff-text-xs text-[var(--ff-text-muted)]">{activity.owner}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="col-span-8">
                                <div className="grid grid-cols-5 gap-1 h-8">
                                  {[1, 2, 3, 4, 5].map(day => {
                                    const isActive = day >= activity.startDay && day < activity.startDay + activity.duration;
                                    return (
                                      <div
                                        key={day}
                                        className={`h-full rounded ${
                                          isActive 
                                            ? 'bg-[var(--ff-success)] opacity-80' 
                                            : 'bg-[var(--ff-surface)]'
                                        }`}
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2">
                                <Badge 
                                  className={`ff-badge-${activity.priority === 'critical' ? 'error' : activity.priority === 'high' ? 'warning' : 'secondary'} text-xs`}
                                >
                                  {activity.priority}
                                </Badge>
                                <Badge className="ff-badge-secondary text-xs">
                                  {activity.duration} days
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span className="ff-text-xs text-[var(--ff-text-muted)]">
                                  {activity.participants.length} participants
                                </span>
                                {React.createElement(getStatusIcon(activity.status), {
                                  className: "w-4 h-4",
                                  style: { color: getStatusColor(activity.status) }
                                })}
                              </div>
                            </div>
                            
                            {selectedActivity === activity.id && (
                              <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-4">
                                <p className="ff-text-sm text-[var(--ff-text-secondary)]">{activity.description}</p>
                                
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <h5 className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                      Participants
                                    </h5>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {activity.participants.map((participant, index) => (
                                        <Badge key={index} className="ff-badge-secondary text-xs">
                                          {participant}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h5 className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                      Key Deliverables
                                    </h5>
                                    <ul className="mt-1 space-y-1">
                                      {activity.deliverables.slice(0, 2).map((deliverable, index) => (
                                        <li key={index} className="ff-text-xs text-[var(--ff-text-muted)] flex items-start gap-1">
                                          <CheckCircle className="w-3 h-3 text-[var(--ff-success)] mt-0.5 flex-shrink-0" />
                                          {deliverable}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                                
                                {activity.risks.length > 0 && (
                                  <div>
                                    <h5 className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                      Risk Factors
                                    </h5>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {activity.risks.map((risk, index) => (
                                        <Badge key={index} className="ff-badge-warning text-xs">
                                          <AlertTriangle className="w-3 h-3 mr-1" />
                                          {risk}
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
                  </div>
                )}
              </TabsContent>

              {/* Week 2 Activities */}
              <TabsContent value="week2" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="ff-text-title">{discoveryActivities.week2.name}</h3>
                    <p className="ff-text-sm text-[var(--ff-text-muted)] mt-1">{discoveryActivities.week2.focus}</p>
                  </div>
                  <Badge className="ff-badge-success">
                    {discoveryActivities.week2.duration}
                  </Badge>
                </div>
                
                {/* Gantt Chart View for Week 2 */}
                {viewMode === 'gantt' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-2 mb-4">
                      <div className="col-span-4 ff-text-sm text-[var(--ff-text-muted)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                        Activity
                      </div>
                      <div className="col-span-8 grid grid-cols-5 gap-1">
                        {[6, 7, 8, 9, 10].map(day => (
                          <div key={day} className="text-center ff-text-xs text-[var(--ff-text-muted)]">
                            Day {day}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {discoveryActivities.week2.activities.filter(activity => 
                      filterCategory === 'all' || activity.category === filterCategory
                    ).map((activity) => {
                      const CategoryIcon = getCategoryIcon(activity.category);
                      
                      return (
                        <Card 
                          key={activity.id} 
                          className={`ff-card cursor-pointer transition-all duration-200 ${
                            selectedActivity === activity.id 
                              ? 'border-[var(--ff-success)] bg-[var(--ff-surface-light)]' 
                              : 'hover:border-[var(--ff-success)]/30'
                          }`}
                          onClick={() => setSelectedActivity(selectedActivity === activity.id ? null : activity.id)}
                        >
                          <CardContent className="p-4">
                            <div className="grid grid-cols-12 gap-4 items-center">
                              <div className="col-span-4">
                                <div className="flex items-center gap-3">
                                  <CategoryIcon className="w-4 h-4 text-[var(--ff-success)]" />
                                  <div>
                                    <h4 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                      {activity.name}
                                    </h4>
                                    <p className="ff-text-xs text-[var(--ff-text-muted)]">{activity.owner}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="col-span-8">
                                <div className="grid grid-cols-5 gap-1 h-8">
                                  {[6, 7, 8, 9, 10].map(day => {
                                    const isActive = day >= activity.startDay && day < activity.startDay + activity.duration;
                                    return (
                                      <div
                                        key={day}
                                        className={`h-full rounded ${
                                          isActive 
                                            ? 'bg-[var(--ff-success)] opacity-80' 
                                            : 'bg-[var(--ff-surface)]'
                                        }`}
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2">
                                <Badge 
                                  className={`ff-badge-${activity.priority === 'critical' ? 'error' : activity.priority === 'high' ? 'warning' : 'secondary'} text-xs`}
                                >
                                  {activity.priority}
                                </Badge>
                                <Badge className="ff-badge-secondary text-xs">
                                  {activity.duration} days
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span className="ff-text-xs text-[var(--ff-text-muted)]">
                                  {activity.participants.length} participants
                                </span>
                                {React.createElement(getStatusIcon(activity.status), {
                                  className: "w-4 h-4",
                                  style: { color: getStatusColor(activity.status) }
                                })}
                              </div>
                            </div>
                            
                            {selectedActivity === activity.id && (
                              <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-4">
                                <p className="ff-text-sm text-[var(--ff-text-secondary)]">{activity.description}</p>
                                
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <h5 className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                      Key Deliverables
                                    </h5>
                                    <ul className="mt-1 space-y-1">
                                      {activity.deliverables.slice(0, 2).map((deliverable, index) => (
                                        <li key={index} className="ff-text-xs text-[var(--ff-text-muted)] flex items-start gap-1">
                                          <CheckCircle className="w-3 h-3 text-[var(--ff-success)] mt-0.5 flex-shrink-0" />
                                          {deliverable}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  <div>
                                    <h5 className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                      Dependencies
                                    </h5>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {activity.dependencies.length > 0 ? (
                                        activity.dependencies.map((dep, index) => (
                                          <Badge key={index} className="ff-badge-warning text-xs">
                                            <ArrowRight className="w-3 h-3 mr-1" />
                                            {dep}
                                          </Badge>
                                        ))
                                      ) : (
                                        <Badge className="ff-badge-success text-xs">
                                          No dependencies
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Team Roles & Workload */}
        <Card className="ff-card">
          <CardHeader>
            <CardTitle className="ff-text-title flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--ff-secondary)]" />
              Team Roles & Workload Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamRoles.map((role, index) => (
                <Card key={index} className="ff-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                        {role.role}
                      </h4>
                      <Badge className={`ff-badge-${role.status === 'assigned' ? 'success' : 'warning'} text-xs`}>
                        {role.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="ff-text-xs text-[var(--ff-text-muted)]">Workload</span>
                          <span className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                            {role.workload}%
                          </span>
                        </div>
                        <Progress 
                          value={role.workload} 
                          className="h-2"
                          style={{
                            '--progress-background': role.workload > 90 ? 'var(--ff-error)' : 
                                                  role.workload > 80 ? 'var(--ff-warning)' : 
                                                  'var(--ff-success)'
                          } as React.CSSProperties}
                        />
                      </div>
                      
                      <div>
                        <h5 className="ff-text-xs text-[var(--ff-text-primary)] mb-1" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                          Key Responsibilities
                        </h5>
                        <ul className="space-y-1">
                          {role.responsibilities.map((resp, i) => (
                            <li key={i} className="ff-text-xs text-[var(--ff-text-muted)] flex items-start gap-1">
                              <span className="w-1 h-1 bg-[var(--ff-success)] rounded-full mt-1.5 flex-shrink-0"></span>
                              {resp}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="ff-text-xs text-[var(--ff-text-primary)] mb-1" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                          Required Skills
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {role.skills.map((skill, i) => (
                            <Badge key={i} className="ff-badge-secondary text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DiscoveryPhaseTimeline;