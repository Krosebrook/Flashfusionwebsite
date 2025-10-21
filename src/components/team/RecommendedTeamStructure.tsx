/**
 * @fileoverview FlashFusion Recommended Team Structure
 * @chunk team
 * @category team-structure
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Comprehensive organizational chart illustrating the core SaaS team structure
 * with Product Manager, Frontend Engineers, Backend Engineers, DevOps Engineer,
 * UI/UX Designer, QA Engineer, Data Analyst, and extended roles including
 * Security Consultant and Performance Engineer.
 * 
 * Features:
 * - Interactive org chart with role details
 * - Team size recommendations and scaling paths
 * - Skill requirements and responsibilities
 * - Compensation ranges and hiring priorities
 * - Team collaboration patterns
 * - Extended role integration planning
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Users, 
  User, 
  Crown,
  Code,
  Server,
  Cloud,
  Palette,
  Bug,
  BarChart3,
  Shield,
  Zap,
  Target,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Plus,
  Star,
  Award,
  Briefcase,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Eye,
  Settings,
  Globe,
  Database,
  Smartphone,
  Monitor,
  GitBranch,
  MessageSquare,
  PieChart,
  LineChart,
  Activity,
  FileText,
  Search,
  Filter,
  Download,
  Upload
} from 'lucide-react';

// Team structure data
const teamStructure = {
  leadership: {
    name: 'Leadership',
    color: 'var(--ff-accent)',
    roles: [
      {
        id: 'ceo',
        title: 'CEO / Founder',
        department: 'Executive',
        level: 'C-Level',
        count: 1,
        priority: 'critical',
        salary: '$120k - $200k+',
        equity: '5% - 15%',
        skills: ['Strategic Vision', 'Leadership', 'Fundraising', 'Product Strategy', 'Team Building'],
        responsibilities: [
          'Overall company vision and strategy',
          'Fundraising and investor relations',
          'Team building and culture development',
          'Product roadmap oversight',
          'Market positioning and competitive strategy'
        ],
        reports: ['product-manager', 'cto', 'head-of-marketing'],
        hiringStage: 'pre-seed',
        timeToHire: 'immediate',
        criticalPath: true
      }
    ]
  },
  product: {
    name: 'Product & Design',
    color: 'var(--ff-primary)',
    roles: [
      {
        id: 'product-manager',
        title: 'Product Manager',
        department: 'Product',
        level: 'Senior',
        count: 1,
        priority: 'critical',
        salary: '$90k - $140k',
        equity: '0.5% - 2%',
        skills: ['Product Strategy', 'User Research', 'Analytics', 'Roadmap Planning', 'Stakeholder Management'],
        responsibilities: [
          'Product roadmap and feature prioritization',
          'User research and customer feedback analysis',
          'Cross-functional team coordination',
          'Product analytics and KPI tracking',
          'Go-to-market strategy development'
        ],
        reports: ['ui-ux-designer'],
        reportsTo: 'ceo',
        hiringStage: 'pre-seed',
        timeToHire: '0-3 months',
        criticalPath: true
      },
      {
        id: 'ui-ux-designer',
        title: 'UI/UX Designer',
        department: 'Design',
        level: 'Mid-Senior',
        count: 1,
        priority: 'high',
        salary: '$70k - $110k',
        equity: '0.3% - 1%',
        skills: ['User Experience Design', 'Interface Design', 'Design Systems', 'Prototyping', 'User Testing'],
        responsibilities: [
          'User experience research and design',
          'Interface design and visual systems',
          'Design system development and maintenance',
          'Prototyping and user testing',
          'Cross-platform design consistency'
        ],
        reports: [],
        reportsTo: 'product-manager',
        hiringStage: 'seed',
        timeToHire: '3-6 months',
        criticalPath: true
      }
    ]
  },
  engineering: {
    name: 'Engineering',
    color: 'var(--ff-secondary)',
    roles: [
      {
        id: 'cto',
        title: 'CTO / Technical Co-founder',
        department: 'Engineering',
        level: 'C-Level',
        count: 1,
        priority: 'critical',
        salary: '$100k - $180k+',
        equity: '3% - 10%',
        skills: ['Technical Leadership', 'Architecture Design', 'Team Management', 'Technology Strategy', 'Security'],
        responsibilities: [
          'Technical vision and architecture decisions',
          'Engineering team leadership and mentoring',
          'Technology stack and infrastructure planning',
          'Security and compliance oversight',
          'Technical debt management and code quality'
        ],
        reports: ['frontend-lead', 'backend-lead', 'devops-engineer'],
        reportsTo: 'ceo',
        hiringStage: 'pre-seed',
        timeToHire: 'immediate',
        criticalPath: true
      },
      {
        id: 'frontend-lead',
        title: 'Frontend Engineer (Lead)',
        department: 'Engineering',
        level: 'Senior',
        count: 1,
        priority: 'critical',
        salary: '$85k - $130k',
        equity: '0.4% - 1.5%',
        skills: ['React/TypeScript', 'Frontend Architecture', 'Performance Optimization', 'UI Implementation', 'Testing'],
        responsibilities: [
          'Frontend architecture and development',
          'UI/UX implementation and optimization',
          'Frontend performance and accessibility',
          'Code review and quality assurance',
          'Frontend team leadership (when scaling)'
        ],
        reports: ['frontend-engineer-2'],
        reportsTo: 'cto',
        hiringStage: 'pre-seed',
        timeToHire: '0-3 months',
        criticalPath: true
      },
      {
        id: 'frontend-engineer-2',
        title: 'Frontend Engineer',
        department: 'Engineering',
        level: 'Mid-Level',
        count: 1,
        priority: 'high',
        salary: '$70k - $105k',
        equity: '0.2% - 0.8%',
        skills: ['React/TypeScript', 'Component Development', 'API Integration', 'Testing', 'Version Control'],
        responsibilities: [
          'Feature development and implementation',
          'Component library development',
          'API integration and state management',
          'Testing and bug fixes',
          'Code documentation and maintenance'
        ],
        reports: [],
        reportsTo: 'frontend-lead',
        hiringStage: 'seed',
        timeToHire: '6-12 months',
        criticalPath: false
      },
      {
        id: 'backend-lead',
        title: 'Backend Engineer (Lead)',
        department: 'Engineering',
        level: 'Senior',
        count: 1,
        priority: 'critical',
        salary: '$90k - $135k',
        equity: '0.4% - 1.5%',
        skills: ['Node.js/Python', 'Database Design', 'API Development', 'Cloud Architecture', 'Security'],
        responsibilities: [
          'Backend architecture and API development',
          'Database design and optimization',
          'Cloud infrastructure and scaling',
          'Security implementation and monitoring',
          'Backend team leadership (when scaling)'
        ],
        reports: ['backend-engineer-2'],
        reportsTo: 'cto',
        hiringStage: 'pre-seed',
        timeToHire: '0-3 months',
        criticalPath: true
      },
      {
        id: 'backend-engineer-2',
        title: 'Backend Engineer',
        department: 'Engineering',
        level: 'Mid-Level',
        count: 1,
        priority: 'high',
        salary: '$75k - $110k',
        equity: '0.2% - 0.8%',
        skills: ['Server Development', 'API Design', 'Database Management', 'Testing', 'Documentation'],
        responsibilities: [
          'API endpoint development and maintenance',
          'Database queries and optimization',
          'Integration with third-party services',
          'Testing and performance monitoring',
          'Technical documentation'
        ],
        reports: [],
        reportsTo: 'backend-lead',
        hiringStage: 'seed',
        timeToHire: '6-12 months',
        criticalPath: false
      },
      {
        id: 'devops-engineer',
        title: 'DevOps Engineer',
        department: 'Infrastructure',
        level: 'Senior',
        count: 1,
        priority: 'high',
        salary: '$85k - $125k',
        equity: '0.3% - 1%',
        skills: ['Cloud Platforms', 'CI/CD', 'Containerization', 'Monitoring', 'Infrastructure as Code'],
        responsibilities: [
          'CI/CD pipeline development and maintenance',
          'Cloud infrastructure management',
          'Deployment automation and monitoring',
          'Security and compliance implementation',
          'Performance optimization and scaling'
        ],
        reports: [],
        reportsTo: 'cto',
        hiringStage: 'seed',
        timeToHire: '3-9 months',
        criticalPath: true
      }
    ]
  },
  quality: {
    name: 'Quality & Analytics',
    color: 'var(--ff-success)',
    roles: [
      {
        id: 'qa-engineer',
        title: 'QA Engineer',
        department: 'Quality',
        level: 'Mid-Senior',
        count: 1,
        priority: 'medium',
        salary: '$65k - $95k',
        equity: '0.2% - 0.6%',
        skills: ['Test Automation', 'Manual Testing', 'Bug Tracking', 'Performance Testing', 'Quality Processes'],
        responsibilities: [
          'Test plan development and execution',
          'Automated testing framework implementation',
          'Bug identification and tracking',
          'Performance and load testing',
          'Quality assurance process improvement'
        ],
        reports: [],
        reportsTo: 'cto',
        hiringStage: 'series-a',
        timeToHire: '12-18 months',
        criticalPath: false
      },
      {
        id: 'data-analyst',
        title: 'Data Analyst',
        department: 'Analytics',
        level: 'Mid-Level',
        count: 1,
        priority: 'medium',
        salary: '$70k - $100k',
        equity: '0.2% - 0.7%',
        skills: ['Data Analysis', 'SQL', 'Analytics Tools', 'Reporting', 'Statistical Analysis'],
        responsibilities: [
          'User behavior analysis and insights',
          'Product analytics and KPI tracking',
          'A/B testing design and analysis',
          'Dashboard creation and maintenance',
          'Data-driven recommendations'
        ],
        reports: [],
        reportsTo: 'product-manager',
        hiringStage: 'series-a',
        timeToHire: '9-15 months',
        criticalPath: false
      }
    ]
  },
  extended: {
    name: 'Extended Team',
    color: 'var(--ff-warning)',
    roles: [
      {
        id: 'security-consultant',
        title: 'Security Consultant',
        department: 'Security',
        level: 'Senior',
        count: 1,
        priority: 'medium',
        salary: '$120 - $200/hour',
        equity: '0% - 0.1%',
        type: 'contractor',
        skills: ['Security Auditing', 'Penetration Testing', 'Compliance', 'Risk Assessment', 'Security Architecture'],
        responsibilities: [
          'Security audits and penetration testing',
          'Compliance framework implementation',
          'Security policy development',
          'Incident response planning',
          'Security training and awareness'
        ],
        reports: [],
        reportsTo: 'cto',
        hiringStage: 'seed',
        timeToHire: '6-12 months',
        criticalPath: false
      },
      {
        id: 'performance-engineer',
        title: 'Performance Engineer',
        department: 'Engineering',
        level: 'Senior',
        count: 1,
        priority: 'low',
        salary: '$95k - $140k',
        equity: '0.2% - 0.8%',
        type: 'contractor-to-hire',
        skills: ['Performance Optimization', 'Monitoring', 'Load Testing', 'Profiling', 'Scalability'],
        responsibilities: [
          'Application performance monitoring',
          'Performance bottleneck identification',
          'Load testing and capacity planning',
          'Performance optimization implementation',
          'Scalability architecture review'
        ],
        reports: [],
        reportsTo: 'cto',
        hiringStage: 'series-a',
        timeToHire: '18-24 months',
        criticalPath: false
      },
      {
        id: 'head-of-marketing',
        title: 'Head of Marketing',
        department: 'Marketing',
        level: 'Senior',
        count: 1,
        priority: 'high',
        salary: '$80k - $120k',
        equity: '0.5% - 2%',
        skills: ['Growth Marketing', 'Content Strategy', 'SEO/SEM', 'Analytics', 'Brand Management'],
        responsibilities: [
          'Go-to-market strategy development',
          'Content marketing and SEO',
          'Lead generation and conversion',
          'Brand positioning and messaging',
          'Marketing analytics and ROI tracking'
        ],
        reports: ['content-marketer'],
        reportsTo: 'ceo',
        hiringStage: 'seed',
        timeToHire: '6-12 months',
        criticalPath: true
      },
      {
        id: 'content-marketer',
        title: 'Content Marketer',
        department: 'Marketing',
        level: 'Mid-Level',
        count: 1,
        priority: 'medium',
        salary: '$50k - $75k',
        equity: '0.1% - 0.4%',
        skills: ['Content Creation', 'SEO Writing', 'Social Media', 'Email Marketing', 'Analytics'],
        responsibilities: [
          'Blog content creation and management',
          'Social media strategy and execution',
          'Email marketing campaigns',
          'SEO content optimization',
          'Content performance analysis'
        ],
        reports: [],
        reportsTo: 'head-of-marketing',
        hiringStage: 'series-a',
        timeToHire: '12-18 months',
        criticalPath: false
      }
    ]
  }
};

// Hiring timeline and budget data
const hiringTimeline = {
  'pre-seed': {
    name: 'Pre-Seed (0-6 months)',
    budget: '$500k - $1M',
    teamSize: '3-5 people',
    focus: 'Core team and MVP development',
    priorities: ['CEO', 'CTO', 'Product Manager', 'Frontend Lead', 'Backend Lead']
  },
  'seed': {
    name: 'Seed (6-18 months)',
    budget: '$2M - $5M',
    teamSize: '8-12 people',
    focus: 'Product-market fit and scaling',
    priorities: ['UI/UX Designer', 'DevOps Engineer', 'Security Consultant', 'Head of Marketing']
  },
  'series-a': {
    name: 'Series A (18+ months)',
    budget: '$5M - $15M',
    teamSize: '15-25 people',
    focus: 'Growth and optimization',
    priorities: ['QA Engineer', 'Data Analyst', 'Performance Engineer', 'Additional Engineers']
  }
};

// Team collaboration patterns
const collaborationPatterns = [
  {
    name: 'Product Development',
    participants: ['Product Manager', 'UI/UX Designer', 'Frontend Engineers', 'Backend Engineers'],
    frequency: 'Daily',
    tools: ['Figma', 'Jira', 'Slack', 'GitHub'],
    outcomes: ['Feature specifications', 'Design mockups', 'Development tasks', 'Release planning']
  },
  {
    name: 'Technical Architecture',
    participants: ['CTO', 'Backend Lead', 'Frontend Lead', 'DevOps Engineer'],
    frequency: 'Weekly',
    tools: ['Miro', 'GitHub', 'AWS Console', 'Monitoring Tools'],
    outcomes: ['Architecture decisions', 'Infrastructure planning', 'Performance optimization', 'Security reviews']
  },
  {
    name: 'Quality Assurance',
    participants: ['QA Engineer', 'Frontend Engineers', 'Backend Engineers', 'Product Manager'],
    frequency: 'Per Sprint',
    tools: ['TestRail', 'Selenium', 'Postman', 'Analytics Tools'],
    outcomes: ['Test plans', 'Bug reports', 'Quality metrics', 'Release approval']
  },
  {
    name: 'Data & Analytics',
    participants: ['Data Analyst', 'Product Manager', 'Marketing Team', 'Leadership'],
    frequency: 'Weekly',
    tools: ['Mixpanel', 'Google Analytics', 'Tableau', 'SQL Database'],
    outcomes: ['User insights', 'KPI reports', 'A/B test results', 'Growth recommendations']
  }
];

interface RecommendedTeamStructureProps {
  // Optional props for customization
}

/**
 * FlashFusion Recommended Team Structure Component
 */
export function RecommendedTeamStructure({}: RecommendedTeamStructureProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [expandedDepartments, setExpandedDepartments] = useState<string[]>(['leadership', 'product', 'engineering']);
  const [viewMode, setViewMode] = useState<'org-chart' | 'timeline' | 'collaboration'>('org-chart');

  // Calculate team metrics
  const teamMetrics = useMemo(() => {
    const allRoles = Object.values(teamStructure).flatMap(dept => dept.roles);
    const coreTeamCount = allRoles.filter(role => role.priority === 'critical').length;
    const totalBudget = allRoles.reduce((sum, role) => {
      const salary = parseInt(role.salary.split('$')[1].split('k')[0]);
      return sum + salary * 1000;
    }, 0);
    
    return {
      totalRoles: allRoles.length,
      coreTeam: coreTeamCount,
      extendedTeam: allRoles.length - coreTeamCount,
      estimatedBudget: totalBudget,
      timeToFullTeam: '18-24 months'
    };
  }, []);

  const toggleDepartment = (deptId: string) => {
    setExpandedDepartments(prev => 
      prev.includes(deptId) 
        ? prev.filter(id => id !== deptId)
        : [...prev, deptId]
    );
  };

  const getRoleIcon = (role: any) => {
    const iconMap: Record<string, React.ReactNode> = {
      'CEO / Founder': <Crown className="w-4 h-4" />,
      'CTO / Technical Co-founder': <Code className="w-4 h-4" />,
      'Product Manager': <Target className="w-4 h-4" />,
      'UI/UX Designer': <Palette className="w-4 h-4" />,
      'Frontend Engineer (Lead)': <Monitor className="w-4 h-4" />,
      'Frontend Engineer': <Smartphone className="w-4 h-4" />,
      'Backend Engineer (Lead)': <Server className="w-4 h-4" />,
      'Backend Engineer': <Database className="w-4 h-4" />,
      'DevOps Engineer': <Cloud className="w-4 h-4" />,
      'QA Engineer': <Bug className="w-4 h-4" />,
      'Data Analyst': <BarChart3 className="w-4 h-4" />,
      'Security Consultant': <Shield className="w-4 h-4" />,
      'Performance Engineer': <Zap className="w-4 h-4" />,
      'Head of Marketing': <TrendingUp className="w-4 h-4" />,
      'Content Marketer': <FileText className="w-4 h-4" />
    };
    return iconMap[role.title] || <User className="w-4 h-4" />;
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

  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)]" style={{ fontFamily: 'var(--ff-font-secondary)' }}>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 ff-fade-in-up">
          <Badge className="ff-badge-primary mb-4">
            <Users className="w-4 h-4 mr-2" />
            Team Structure & Organization
          </Badge>
          
          <h1 className="ff-text-display">
            Recommended
            <span className="ff-text-gradient"> Team Structure</span>
          </h1>
          
          <p className="ff-text-body max-w-3xl mx-auto">
            Comprehensive organizational chart for SaaS team scaling from pre-seed to Series A,
            including core roles, extended team members, hiring timeline, and collaboration patterns.
          </p>
        </div>

        {/* Team Overview Metrics */}
        <Card className="ff-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="ff-text-title flex items-center gap-2">
                <Award className="w-5 h-5 text-[var(--ff-primary)]" />
                Team Overview
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setViewMode('org-chart')}
                  size="sm"
                  className={viewMode === 'org-chart' ? 'ff-btn-primary' : 'ff-btn-outline'}
                >
                  Org Chart
                </Button>
                <Button
                  onClick={() => setViewMode('timeline')}
                  size="sm"
                  className={viewMode === 'timeline' ? 'ff-btn-primary' : 'ff-btn-outline'}
                >
                  Timeline
                </Button>
                <Button
                  onClick={() => setViewMode('collaboration')}
                  size="sm"
                  className={viewMode === 'collaboration' ? 'ff-btn-primary' : 'ff-btn-outline'}
                >
                  Collaboration
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  {teamMetrics.totalRoles}
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Total Roles</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="ff-text-2xl text-[var(--ff-error)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  {teamMetrics.coreTeam}
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Core Team</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="ff-text-2xl text-[var(--ff-warning)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  {teamMetrics.extendedTeam}
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Extended Team</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="ff-text-2xl text-[var(--ff-success)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  ${(teamMetrics.estimatedBudget / 1000000).toFixed(1)}M
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Annual Budget</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="ff-text-2xl text-[var(--ff-secondary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  24mo
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Full Team</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Switching */}
        {viewMode === 'org-chart' && (
          <div className="space-y-6 ff-stagger-fade">
            {/* Organizational Chart */}
            {Object.entries(teamStructure).map(([deptId, department]) => (
              <Card key={deptId} className="ff-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: department.color }}></div>
                      <CardTitle className="ff-text-lg">{department.name}</CardTitle>
                      <Badge className="ff-badge-secondary">{department.roles.length} roles</Badge>
                    </div>
                    <Button
                      onClick={() => toggleDepartment(deptId)}
                      size="sm"
                      className="ff-btn-ghost"
                    >
                      {expandedDepartments.includes(deptId) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                
                {expandedDepartments.includes(deptId) && (
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {department.roles.map((role) => (
                        <Card 
                          key={role.id} 
                          className={`ff-card border border-[var(--border)] cursor-pointer transition-all duration-200 ${
                            selectedRole === role.id ? 'border-[var(--ff-primary)] bg-[var(--ff-surface-light)]' : 'hover:border-[var(--ff-primary)]/30'
                          }`}
                          onClick={() => setSelectedRole(selectedRole === role.id ? null : role.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                {getRoleIcon(role)}
                                <div>
                                  <h3 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                    {role.title}
                                  </h3>
                                  <p className="ff-text-xs text-[var(--ff-text-muted)]">{role.level}</p>
                                </div>
                              </div>
                              <Badge 
                                className={`ff-badge-${role.priority === 'critical' ? 'error' : role.priority === 'high' ? 'warning' : role.priority === 'medium' ? 'secondary' : 'success'}`}
                              >
                                {role.priority}
                              </Badge>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="ff-text-xs text-[var(--ff-text-muted)]">Salary Range</span>
                                <span className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                  {role.salary}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="ff-text-xs text-[var(--ff-text-muted)]">Equity</span>
                                <span className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                  {role.equity}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="ff-text-xs text-[var(--ff-text-muted)]">Hire By</span>
                                <span className="ff-text-xs text-[var(--ff-text-secondary)]">
                                  {role.timeToHire}
                                </span>
                              </div>
                              
                              {role.type && (
                                <Badge className="ff-badge-warning text-xs w-full justify-center">
                                  {role.type}
                                </Badge>
                              )}
                            </div>
                            
                            {selectedRole === role.id && (
                              <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-3">
                                <div>
                                  <h4 className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                    Key Skills
                                  </h4>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {role.skills.slice(0, 3).map((skill, index) => (
                                      <Badge key={index} className="ff-badge-secondary text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                    Top Responsibilities
                                  </h4>
                                  <ul className="mt-1 space-y-1">
                                    {role.responsibilities.slice(0, 2).map((resp, index) => (
                                      <li key={index} className="ff-text-xs text-[var(--ff-text-muted)] flex items-start gap-1">
                                        <span className="w-1 h-1 bg-[var(--ff-primary)] rounded-full mt-1.5 flex-shrink-0"></span>
                                        {resp}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {viewMode === 'timeline' && (
          <div className="space-y-6 ff-stagger-fade">
            {/* Hiring Timeline */}
            <Card className="ff-card">
              <CardHeader>
                <CardTitle className="ff-text-title flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[var(--ff-secondary)]" />
                  Hiring Timeline & Budget
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(hiringTimeline).map(([stage, data]) => (
                  <div key={stage} className="relative">
                    <Card className="ff-card">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                              {data.name}
                            </h3>
                            <p className="ff-text-sm text-[var(--ff-text-muted)]">{data.focus}</p>
                          </div>
                          <div className="text-right">
                            <div className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                              {data.budget}
                            </div>
                            <div className="ff-text-xs text-[var(--ff-text-muted)]">{data.teamSize}</div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="ff-text-sm text-[var(--ff-text-primary)] mb-2" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                            Priority Hires
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {data.priorities.map((priority, index) => (
                              <Badge key={index} className="ff-badge-primary">
                                {priority}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {viewMode === 'collaboration' && (
          <div className="space-y-6 ff-stagger-fade">
            {/* Collaboration Patterns */}
            <Card className="ff-card">
              <CardHeader>
                <CardTitle className="ff-text-title flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[var(--ff-accent)]" />
                  Team Collaboration Patterns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {collaborationPatterns.map((pattern, index) => (
                  <Card key={index} className="ff-card">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                            {pattern.name}
                          </h3>
                          <p className="ff-text-sm text-[var(--ff-text-muted)]">
                            {pattern.frequency} collaboration
                          </p>
                        </div>
                        <Badge className="ff-badge-secondary">
                          {pattern.participants.length} roles
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="ff-text-sm text-[var(--ff-text-primary)] mb-2" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                            Participants
                          </h4>
                          <div className="space-y-1">
                            {pattern.participants.map((participant, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <User className="w-3 h-3 text-[var(--ff-text-muted)]" />
                                <span className="ff-text-sm text-[var(--ff-text-secondary)]">{participant}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="ff-text-sm text-[var(--ff-text-primary)] mb-2" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                            Tools & Outcomes
                          </h4>
                          <div className="space-y-2">
                            <div>
                              <span className="ff-text-xs text-[var(--ff-text-muted)]">Tools:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {pattern.tools.map((tool, i) => (
                                  <Badge key={i} className="ff-badge-secondary text-xs">{tool}</Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="ff-text-xs text-[var(--ff-text-muted)]">Outcomes:</span>
                              <ul className="mt-1 space-y-1">
                                {pattern.outcomes.slice(0, 2).map((outcome, i) => (
                                  <li key={i} className="ff-text-xs text-[var(--ff-text-secondary)] flex items-start gap-1">
                                    <CheckCircle className="w-3 h-3 text-[var(--ff-success)] mt-0.5 flex-shrink-0" />
                                    {outcome}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecommendedTeamStructure;