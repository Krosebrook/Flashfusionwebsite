/**
 * @fileoverview FlashFusion Common Blindspots & Solutions Matrix
 * @chunk blindspot
 * @category blindspot-mitigation
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Comprehensive risk matrix board that categorizes blindspots such as Technical Debt,
 * User Experience Gaps, Performance Under Load, Security Vulnerabilities, and Market
 * Competition. Maps each category to mitigation strategies like allocating sprint
 * capacity for refactoring, conducting regular user testing, performing comprehensive
 * load testing, scheduling security audits, and running monthly competitive analyses.
 * 
 * Features:
 * - Interactive risk matrix with impact vs probability assessment
 * - Comprehensive blindspot categorization and identification
 * - Detailed mitigation strategies with actionable recommendations
 * - Progress tracking and implementation monitoring
 * - Risk severity assessment and prioritization
 * - Resource allocation and timeline planning
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  AlertTriangle, 
  Shield, 
  Bug, 
  Users, 
  Zap,
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  ArrowUp,
  ArrowDown,
  Settings,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Plus,
  Minus,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Database,
  Code2,
  Server,
  Globe,
  Smartphone,
  Monitor,
  FileText,
  MessageSquare,
  Calendar,
  Star,
  Award,
  Briefcase,
  DollarSign,
  TrendingUp,
  Wrench,
  Layers,
  GitBranch,
  TestTube,
  Lock,
  UserCheck,
  MousePointer,
  Gauge
} from 'lucide-react';

// Blindspot categories and their details
const blindspotCategories = {
  'technical-debt': {
    name: 'Technical Debt',
    color: 'var(--ff-error)',
    icon: <Code2 className="w-5 h-5" />,
    description: 'Accumulated shortcuts, outdated code, and architectural issues that slow development',
    riskLevel: 'high',
    blindspots: [
      {
        id: 'legacy-code',
        name: 'Legacy Code Dependencies',
        description: 'Outdated libraries and deprecated dependencies affecting security and performance',
        impact: 8,
        probability: 7,
        severity: 'critical',
        detectedAt: '2024-12-19',
        status: 'identified',
        affectedAreas: ['Backend Services', 'Frontend Components', 'Build Pipeline'],
        businessImpact: 'Slower feature development, increased maintenance costs, security vulnerabilities',
        mitigationStrategies: [
          'Allocate 20% of sprint capacity for dependency updates',
          'Implement automated dependency scanning and alerts',
          'Create migration roadmap with timeline and resource allocation',
          'Establish technical debt tracking and measurement metrics'
        ],
        estimatedEffort: '40 hours per sprint',
        priority: 'critical',
        owner: 'Engineering Team',
        timeline: '2-4 sprints'
      },
      {
        id: 'code-quality',
        name: 'Code Quality Issues',
        description: 'Inconsistent coding standards, lack of documentation, and poor test coverage',
        impact: 6,
        probability: 8,
        severity: 'high',
        detectedAt: '2024-12-18',
        status: 'in-progress',
        affectedAreas: ['Codebase Quality', 'Developer Productivity', 'Maintainability'],
        businessImpact: 'Increased bug rates, slower onboarding, higher maintenance costs',
        mitigationStrategies: [
          'Implement automated code quality checks in CI/CD',
          'Establish code review guidelines and enforcement',
          'Increase test coverage to 80% minimum',
          'Create comprehensive code documentation standards'
        ],
        estimatedEffort: '60 hours',
        priority: 'high',
        owner: 'Development Team',
        timeline: '3-6 sprints'
      },
      {
        id: 'architecture-debt',
        name: 'Architecture Technical Debt',
        description: 'Monolithic structures, tight coupling, and scalability bottlenecks',
        impact: 9,
        probability: 6,
        severity: 'critical',
        detectedAt: '2024-12-17',
        status: 'planned',
        affectedAreas: ['System Architecture', 'Scalability', 'Performance'],
        businessImpact: 'Limited scalability, increased infrastructure costs, system reliability issues',
        mitigationStrategies: [
          'Develop microservices migration strategy',
          'Implement API versioning and backward compatibility',
          'Refactor monolithic components into modular services',
          'Establish architecture review board and guidelines'
        ],
        estimatedEffort: '200+ hours',
        priority: 'critical',
        owner: 'Architecture Team',
        timeline: '6-12 sprints'
      }
    ]
  },
  'user-experience': {
    name: 'User Experience Gaps',
    color: 'var(--ff-warning)',
    icon: <Users className="w-5 h-5" />,
    description: 'Usability issues, accessibility problems, and poor user journey optimization',
    riskLevel: 'medium',
    blindspots: [
      {
        id: 'accessibility-gaps',
        name: 'Accessibility Compliance Issues',
        description: 'WCAG 2.1 AA compliance gaps affecting user accessibility and inclusivity',
        impact: 7,
        probability: 6,
        severity: 'high',
        detectedAt: '2024-12-19',
        status: 'identified',
        affectedAreas: ['User Interface', 'Legal Compliance', 'User Inclusivity'],
        businessImpact: 'Legal compliance risks, reduced user base, brand reputation impact',
        mitigationStrategies: [
          'Conduct comprehensive accessibility audit using automated tools',
          'Implement regular user testing with disabled users',
          'Establish accessibility checklist for all new features',
          'Provide accessibility training for design and development teams'
        ],
        estimatedEffort: '80 hours',
        priority: 'high',
        owner: 'UX/UI Team',
        timeline: '2-4 sprints'
      },
      {
        id: 'user-journey',
        name: 'Suboptimal User Journey',
        description: 'Complex onboarding, confusing navigation, and high user drop-off rates',
        impact: 8,
        probability: 7,
        severity: 'high',
        detectedAt: '2024-12-18',
        status: 'in-progress',
        affectedAreas: ['User Onboarding', 'Navigation', 'Conversion Rates'],
        businessImpact: 'Lower user retention, reduced conversion rates, increased support costs',
        mitigationStrategies: [
          'Conduct regular user testing sessions and surveys',
          'Implement user journey analytics and heatmap tracking',
          'A/B test critical user flows and onboarding steps',
          'Create user persona-based journey optimization'
        ],
        estimatedEffort: '120 hours',
        priority: 'high',
        owner: 'Product Team',
        timeline: '4-6 sprints'
      },
      {
        id: 'mobile-experience',
        name: 'Mobile User Experience Issues',
        description: 'Poor mobile responsiveness and touch interaction optimization',
        impact: 6,
        probability: 5,
        severity: 'medium',
        detectedAt: '2024-12-17',
        status: 'planned',
        affectedAreas: ['Mobile Interface', 'Touch Interactions', 'Performance'],
        businessImpact: 'Reduced mobile user satisfaction, lower mobile conversion rates',
        mitigationStrategies: [
          'Implement mobile-first responsive design principles',
          'Conduct mobile usability testing on various devices',
          'Optimize touch targets and mobile interaction patterns',
          'Implement progressive web app (PWA) features'
        ],
        estimatedEffort: '100 hours',
        priority: 'medium',
        owner: 'Frontend Team',
        timeline: '3-5 sprints'
      }
    ]
  },
  'performance': {
    name: 'Performance Under Load',
    color: 'var(--ff-accent)',
    icon: <Zap className="w-5 h-5" />,
    description: 'System performance degradation under high load and traffic spikes',
    riskLevel: 'high',
    blindspots: [
      {
        id: 'load-performance',
        name: 'High Load Performance Issues',
        description: 'System slowdown and timeouts under concurrent user load',
        impact: 9,
        probability: 7,
        severity: 'critical',
        detectedAt: '2024-12-19',
        status: 'identified',
        affectedAreas: ['Server Performance', 'Database', 'User Experience'],
        businessImpact: 'User frustration, increased churn, potential revenue loss during traffic spikes',
        mitigationStrategies: [
          'Implement comprehensive load testing with realistic traffic patterns',
          'Set up auto-scaling policies for server and database resources',
          'Optimize database queries and implement caching strategies',
          'Establish performance monitoring and alerting systems'
        ],
        estimatedEffort: '160 hours',
        priority: 'critical',
        owner: 'DevOps Team',
        timeline: '3-6 sprints'
      },
      {
        id: 'database-bottlenecks',
        name: 'Database Performance Bottlenecks',
        description: 'Slow queries, inefficient indexing, and connection pool limitations',
        impact: 8,
        probability: 6,
        severity: 'high',
        detectedAt: '2024-12-18',
        status: 'in-progress',
        affectedAreas: ['Database Performance', 'API Response Times', 'System Reliability'],
        businessImpact: 'Slow application performance, poor user experience, increased infrastructure costs',
        mitigationStrategies: [
          'Conduct database performance audit and query optimization',
          'Implement database connection pooling and caching',
          'Set up database monitoring and slow query logging',
          'Establish database maintenance and optimization schedules'
        ],
        estimatedEffort: '80 hours',
        priority: 'high',
        owner: 'Backend Team',
        timeline: '2-4 sprints'
      },
      {
        id: 'frontend-performance',
        name: 'Frontend Performance Issues',
        description: 'Large bundle sizes, slow loading times, and poor Core Web Vitals',
        impact: 7,
        probability: 8,
        severity: 'high',
        detectedAt: '2024-12-17',
        status: 'planned',
        affectedAreas: ['Frontend Performance', 'SEO Rankings', 'User Experience'],
        businessImpact: 'Poor SEO rankings, higher bounce rates, reduced user satisfaction',
        mitigationStrategies: [
          'Implement code splitting and lazy loading strategies',
          'Optimize images and assets with compression and CDN',
          'Monitor and improve Core Web Vitals metrics',
          'Establish performance budgets and monitoring'
        ],
        estimatedEffort: '120 hours',
        priority: 'high',
        owner: 'Frontend Team',
        timeline: '4-6 sprints'
      }
    ]
  },
  'security': {
    name: 'Security Vulnerabilities',
    color: 'var(--ff-secondary)',
    icon: <Shield className="w-5 h-5" />,
    description: 'Security weaknesses, compliance gaps, and potential attack vectors',
    riskLevel: 'critical',
    blindspots: [
      {
        id: 'auth-security',
        name: 'Authentication & Authorization Gaps',
        description: 'Weak authentication mechanisms and insufficient access controls',
        impact: 9,
        probability: 5,
        severity: 'critical',
        detectedAt: '2024-12-19',
        status: 'identified',
        affectedAreas: ['User Security', 'Data Protection', 'System Access'],
        businessImpact: 'Data breaches, legal liability, loss of user trust and business reputation',
        mitigationStrategies: [
          'Implement multi-factor authentication (MFA) for all users',
          'Conduct regular security audits and penetration testing',
          'Establish role-based access control (RBAC) systems',
          'Implement OAuth 2.0 and JWT token security best practices'
        ],
        estimatedEffort: '100 hours',
        priority: 'critical',
        owner: 'Security Team',
        timeline: '2-3 sprints'
      },
      {
        id: 'data-protection',
        name: 'Data Protection Vulnerabilities',
        description: 'Insufficient data encryption and inadequate privacy controls',
        impact: 8,
        probability: 4,
        severity: 'critical',
        detectedAt: '2024-12-18',
        status: 'in-progress',
        affectedAreas: ['Data Security', 'Privacy Compliance', 'Regulatory Requirements'],
        businessImpact: 'GDPR/CCPA violations, regulatory fines, user privacy breaches',
        mitigationStrategies: [
          'Implement end-to-end data encryption for sensitive information',
          'Establish data retention and deletion policies',
          'Conduct privacy impact assessments for new features',
          'Implement data anonymization and pseudonymization techniques'
        ],
        estimatedEffort: '80 hours',
        priority: 'critical',
        owner: 'Security Team',
        timeline: '2-4 sprints'
      },
      {
        id: 'api-security',
        name: 'API Security Weaknesses',
        description: 'Inadequate API rate limiting, validation, and monitoring',
        impact: 7,
        probability: 6,
        severity: 'high',
        detectedAt: '2024-12-17',
        status: 'planned',
        affectedAreas: ['API Security', 'System Integration', 'Data Access'],
        businessImpact: 'API abuse, data leakage, system overload and potential service disruption',
        mitigationStrategies: [
          'Implement comprehensive API rate limiting and throttling',
          'Establish API input validation and sanitization',
          'Set up API security monitoring and threat detection',
          'Implement API versioning and deprecation strategies'
        ],
        estimatedEffort: '60 hours',
        priority: 'high',
        owner: 'Backend Team',
        timeline: '2-3 sprints'
      }
    ]
  },
  'market-competition': {
    name: 'Market Competition',
    color: 'var(--ff-primary)',
    icon: <TrendingDown className="w-5 h-5" />,
    description: 'Competitive threats, market positioning issues, and differentiation challenges',
    riskLevel: 'medium',
    blindspots: [
      {
        id: 'feature-parity',
        name: 'Feature Parity Gaps',
        description: 'Missing key features compared to competitive products',
        impact: 6,
        probability: 7,
        severity: 'medium',
        detectedAt: '2024-12-19',
        status: 'identified',
        affectedAreas: ['Product Features', 'Market Position', 'User Acquisition'],
        businessImpact: 'Reduced competitive advantage, potential user churn to competitors',
        mitigationStrategies: [
          'Conduct monthly competitive analysis and feature comparison',
          'Prioritize unique value proposition development',
          'Implement rapid feature development and deployment cycles',
          'Establish competitive intelligence monitoring systems'
        ],
        estimatedEffort: '200+ hours',
        priority: 'medium',
        owner: 'Product Team',
        timeline: '6-12 sprints'
      },
      {
        id: 'market-positioning',
        name: 'Market Positioning Challenges',
        description: 'Unclear value proposition and weak brand differentiation',
        impact: 7,
        probability: 6,
        severity: 'medium',
        detectedAt: '2024-12-18',
        status: 'in-progress',
        affectedAreas: ['Brand Identity', 'Marketing Strategy', 'Customer Acquisition'],
        businessImpact: 'Lower brand recognition, reduced customer acquisition, pricing pressure',
        mitigationStrategies: [
          'Develop clear and compelling unique value proposition',
          'Implement brand consistency across all customer touchpoints',
          'Conduct regular brand perception and market research',
          'Establish thought leadership through content marketing'
        ],
        estimatedEffort: '120 hours',
        priority: 'medium',
        owner: 'Marketing Team',
        timeline: '4-8 sprints'
      },
      {
        id: 'pricing-strategy',
        name: 'Pricing Strategy Misalignment',
        description: 'Pricing not optimized for market conditions and customer value perception',
        impact: 8,
        probability: 5,
        severity: 'high',
        detectedAt: '2024-12-17',
        status: 'planned',
        affectedAreas: ['Revenue Optimization', 'Market Penetration', 'Customer Retention'],
        businessImpact: 'Suboptimal revenue, customer acquisition challenges, competitive disadvantage',
        mitigationStrategies: [
          'Conduct comprehensive pricing analysis and market research',
          'Implement value-based pricing strategies',
          'Establish A/B testing for pricing models and tiers',
          'Monitor competitor pricing and adjust strategies accordingly'
        ],
        estimatedEffort: '80 hours',
        priority: 'high',
        owner: 'Business Team',
        timeline: '3-6 sprints'
      }
    ]
  }
};

// Mitigation implementation tracking
const mitigationProgress = {
  'technical-debt': {
    implemented: 2,
    total: 10,
    progress: 20,
    lastUpdate: '2024-12-19',
    nextActions: ['Dependency audit completion', 'Code quality metrics setup']
  },
  'user-experience': {
    implemented: 4,
    total: 9,
    progress: 44,
    lastUpdate: '2024-12-18',
    nextActions: ['Accessibility audit', 'Mobile usability testing']
  },
  'performance': {
    implemented: 3,
    total: 11,
    progress: 27,
    lastUpdate: '2024-12-17',
    nextActions: ['Load testing implementation', 'Database optimization']
  },
  'security': {
    implemented: 5,
    total: 8,
    progress: 63,
    lastUpdate: '2024-12-19',
    nextActions: ['MFA implementation', 'API security hardening']
  },
  'market-competition': {
    implemented: 1,
    total: 7,
    progress: 14,
    lastUpdate: '2024-12-18',
    nextActions: ['Competitive analysis update', 'Value proposition refinement']
  }
};

interface CommonBlindspotsMatrixProps {
  // Optional props for customization
}

/**
 * FlashFusion Common Blindspots & Solutions Matrix Component
 */
export function CommonBlindspotsMatrix({}: CommonBlindspotsMatrixProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('technical-debt');
  const [selectedBlindspot, setSelectedBlindspot] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'matrix' | 'detailed' | 'progress'>('matrix');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  // Calculate overall risk metrics
  const riskMetrics = useMemo(() => {
    const allBlindspots = Object.values(blindspotCategories).flatMap(cat => cat.blindspots);
    const criticalCount = allBlindspots.filter(b => b.severity === 'critical').length;
    const highCount = allBlindspots.filter(b => b.severity === 'high').length;
    const totalBlindspots = allBlindspots.length;
    const avgImpact = allBlindspots.reduce((sum, b) => sum + b.impact, 0) / totalBlindspots;
    const avgProbability = allBlindspots.reduce((sum, b) => sum + b.probability, 0) / totalBlindspots;
    
    return {
      totalBlindspots,
      criticalCount,
      highCount,
      avgImpact: Math.round(avgImpact * 10) / 10,
      avgProbability: Math.round(avgProbability * 10) / 10,
      totalCategories: Object.keys(blindspotCategories).length
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'var(--ff-success)';
      case 'in-progress': return 'var(--ff-warning)';
      case 'planned': return 'var(--ff-secondary)';
      case 'identified': return 'var(--ff-error)';
      default: return 'var(--ff-text-muted)';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Clock;
      case 'planned': return Calendar;
      case 'identified': return AlertTriangle;
      default: return XCircle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'var(--ff-error)';
      case 'high': return 'var(--ff-warning)';
      case 'medium': return 'var(--ff-secondary)';
      case 'low': return 'var(--ff-success)';
      default: return 'var(--ff-text-muted)';
    }
  };

  const getRiskScore = (impact: number, probability: number) => {
    return Math.round((impact * probability) / 10);
  };

  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)]" style={{ fontFamily: 'var(--ff-font-secondary)' }}>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 ff-fade-in-up">
          <Badge className="ff-badge-error mb-4">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Blindspot Mitigation
          </Badge>
          
          <h1 className="ff-text-display">
            Risk Matrix &
            <span className="ff-text-gradient"> Solutions</span>
          </h1>
          
          <p className="ff-text-body max-w-3xl mx-auto">
            Comprehensive risk matrix board categorizing blindspots such as Technical Debt, 
            User Experience Gaps, Performance Under Load, Security Vulnerabilities, and Market 
            Competition with detailed mitigation strategies and implementation tracking.
          </p>
        </div>

        {/* Risk Overview Metrics */}
        <Card className="ff-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="ff-text-title flex items-center gap-2">
                <Shield className="w-5 h-5 text-[var(--ff-error)]" />
                Risk Assessment Overview
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setViewMode('matrix')}
                  size="sm"
                  className={viewMode === 'matrix' ? 'ff-btn-error' : 'ff-btn-outline'}
                >
                  Risk Matrix
                </Button>
                <Button
                  onClick={() => setViewMode('detailed')}
                  size="sm"
                  className={viewMode === 'detailed' ? 'ff-btn-error' : 'ff-btn-outline'}
                >
                  Detailed View
                </Button>
                <Button
                  onClick={() => setViewMode('progress')}
                  size="sm"
                  className={viewMode === 'progress' ? 'ff-btn-error' : 'ff-btn-outline'}
                >
                  Progress
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-error)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <AlertTriangle className="w-6 h-6 text-[var(--ff-error)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  {riskMetrics.totalBlindspots}
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Total Blindspots</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-error)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <XCircle className="w-6 h-6 text-[var(--ff-error)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  {riskMetrics.criticalCount}
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Critical Risks</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-warning)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <AlertTriangle className="w-6 h-6 text-[var(--ff-warning)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  {riskMetrics.highCount}
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">High Risks</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-secondary)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Target className="w-6 h-6 text-[var(--ff-secondary)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  {riskMetrics.avgImpact}
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Avg Impact</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-accent)]/20 rounded-full flex items-center justify-center mx-auto mb-2">  
                  <BarChart3 className="w-6 h-6 text-[var(--ff-accent)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  {riskMetrics.avgProbability}
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Avg Probability</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-primary)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Layers className="w-6 h-6 text-[var(--ff-primary)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  {riskMetrics.totalCategories}
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Categories</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Matrix View */}
        {viewMode === 'matrix' && (
          <div className="space-y-6 ff-stagger-fade">
            {/* Category Overview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(blindspotCategories).map(([key, category]) => (
                <Card 
                  key={key} 
                  className={`ff-card cursor-pointer transition-all duration-200 ${
                    selectedCategory === key 
                      ? 'border-[var(--ff-error)] bg-[var(--ff-surface-light)]' 
                      : 'hover:border-[var(--ff-error)]/30'
                  }`}
                  onClick={() => setSelectedCategory(key)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: category.color + '20' }}
                      >
                        {React.cloneElement(category.icon, { style: { color: category.color } })}
                      </div>
                      <div>
                        <h3 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                          {category.name}
                        </h3>
                        <Badge 
                          className={`ff-badge-${category.riskLevel === 'critical' ? 'error' : category.riskLevel === 'high' ? 'warning' : 'secondary'} text-xs`}
                        >
                          {category.riskLevel} risk
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="ff-text-sm text-[var(--ff-text-muted)] mb-4">{category.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="ff-text-xs text-[var(--ff-text-muted)]">Blindspots</span>
                        <span className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                          {category.blindspots.length}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="ff-text-xs text-[var(--ff-text-muted)]">Progress</span>
                        <span className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                          {mitigationProgress[key as keyof typeof mitigationProgress]?.progress || 0}%
                        </span>
                      </div>
                      
                      <Progress 
                        value={mitigationProgress[key as keyof typeof mitigationProgress]?.progress || 0} 
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Selected Category Details */}
            {selectedCategory && (
              <Card className="ff-card">
                <CardHeader>
                  <CardTitle className="ff-text-title flex items-center gap-2">
                    {blindspotCategories[selectedCategory as keyof typeof blindspotCategories].icon}
                    {blindspotCategories[selectedCategory as keyof typeof blindspotCategories].name} - Detailed Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {blindspotCategories[selectedCategory as keyof typeof blindspotCategories].blindspots.map((blindspot) => {
                    const StatusIcon = getStatusIcon(blindspot.status);
                    const riskScore = getRiskScore(blindspot.impact, blindspot.probability);
                    
                    return (
                      <Card 
                        key={blindspot.id} 
                        className={`ff-card cursor-pointer transition-all duration-200 ${
                          selectedBlindspot === blindspot.id 
                            ? 'border-[var(--ff-error)] bg-[var(--ff-surface-light)]' 
                            : 'hover:border-[var(--ff-error)]/30'
                        }`}
                        onClick={() => setSelectedBlindspot(selectedBlindspot === blindspot.id ? null : blindspot.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                  {blindspot.name}
                                </h4>
                                <Badge 
                                  className={`ff-badge-${blindspot.severity === 'critical' ? 'error' : blindspot.severity === 'high' ? 'warning' : 'secondary'} text-xs`}
                                >
                                  {blindspot.severity}
                                </Badge>
                              </div>
                              
                              <p className="ff-text-sm text-[var(--ff-text-muted)] mb-3">{blindspot.description}</p>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                                <div className="text-center p-2 bg-[var(--ff-surface)] rounded">
                                  <div className="ff-text-lg text-[var(--ff-error)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                                    {blindspot.impact}
                                  </div>
                                  <div className="ff-text-xs text-[var(--ff-text-muted)]">Impact</div>
                                </div>
                                
                                <div className="text-center p-2 bg-[var(--ff-surface)] rounded">
                                  <div className="ff-text-lg text-[var(--ff-warning)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                                    {blindspot.probability}
                                  </div>
                                  <div className="ff-text-xs text-[var(--ff-text-muted)]">Probability</div>
                                </div>
                                
                                <div className="text-center p-2 bg-[var(--ff-surface)] rounded">
                                  <div className="ff-text-lg text-[var(--ff-accent)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                                    {riskScore}
                                  </div>
                                  <div className="ff-text-xs text-[var(--ff-text-muted)]">Risk Score</div>
                                </div>
                                
                                <div className="text-center p-2 bg-[var(--ff-surface)] rounded">
                                  <StatusIcon className="w-6 h-6 mx-auto mb-1" style={{ color: getStatusColor(blindspot.status) }} />
                                  <div className="ff-text-xs text-[var(--ff-text-muted)] capitalize">
                                    {blindspot.status.replace('-', ' ')}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {selectedBlindspot === blindspot.id && (
                            <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-4">
                              <div>
                                <h5 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                  Business Impact
                                </h5>
                                <p className="ff-text-sm text-[var(--ff-text-secondary)] mt-1">{blindspot.businessImpact}</p>
                              </div>
                              
                              <div>
                                <h5 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                  Mitigation Strategies
                                </h5>
                                <ul className="mt-2 space-y-2">
                                  {blindspot.mitigationStrategies.map((strategy, index) => (
                                    <li key={index} className="ff-text-sm text-[var(--ff-text-secondary)] flex items-start gap-2">
                                      <CheckCircle className="w-4 h-4 text-[var(--ff-success)] mt-0.5 flex-shrink-0" />
                                      {strategy}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div className="grid md:grid-cols-3 gap-4 pt-2">
                                <div>
                                  <h6 className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                    Owner
                                  </h6>
                                  <p className="ff-text-xs text-[var(--ff-text-muted)]">{blindspot.owner}</p>
                                </div>
                                
                                <div>
                                  <h6 className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                    Timeline
                                  </h6>
                                  <p className="ff-text-xs text-[var(--ff-text-muted)]">{blindspot.timeline}</p>
                                </div>
                                
                                <div>
                                  <h6 className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                    Estimated Effort
                                  </h6>
                                  <p className="ff-text-xs text-[var(--ff-text-muted)]">{blindspot.estimatedEffort}</p>
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
            )}
          </div>
        )}

        {/* Progress Tracking View */}
        {viewMode === 'progress' && (
          <div className="space-y-6 ff-stagger-fade">
            <Card className="ff-card">
              <CardHeader>
                <CardTitle className="ff-text-title">Mitigation Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(mitigationProgress).map(([key, progress]) => {
                    const category = blindspotCategories[key as keyof typeof blindspotCategories];
                    
                    return (
                      <div key={key} className="p-4 bg-[var(--ff-surface)] rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {category.icon}
                            <div>
                              <h4 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                {category.name}
                              </h4>
                              <p className="ff-text-xs text-[var(--ff-text-muted)]">
                                Last updated: {progress.lastUpdate}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                              {progress.progress}%
                            </div>
                            <div className="ff-text-xs text-[var(--ff-text-muted)]">
                              {progress.implemented}/{progress.total} completed
                            </div>
                          </div>
                        </div>
                        
                        <Progress value={progress.progress} className="h-3 mb-4" />
                        
                        <div>
                          <h5 className="ff-text-xs text-[var(--ff-text-primary)] mb-2" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                            Next Actions
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {progress.nextActions.map((action, index) => (
                              <Badge key={index} className="ff-badge-secondary text-xs">
                                {action}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommonBlindspotsMatrix;