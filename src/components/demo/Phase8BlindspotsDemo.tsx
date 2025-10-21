/**
 * @fileoverview Phase 8 Blindspot Mitigation Demo
 * @chunk demo
 * @category components
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Interactive demonstration of the completed Phase 8 Blindspot Mitigation
 * showcasing risk matrix boards and immediate next actions with comprehensive
 * risk assessment and priority-based action management.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  CheckCircle, 
  ExternalLink, 
  AlertTriangle, 
  Flag, 
  Shield,
  Target,
  Activity,
  Clock,
  TrendingUp,
  Users,
  Code2,
  Zap,
  Award,
  Star,
  Eye,
  MousePointer,
  BarChart3,
  PieChart,
  LineChart,
  Settings,
  Calendar,
  Database,
  Server,
  Globe,
  Smartphone,
  Monitor,
  FileText,
  MessageSquare,
  Bell,
  Briefcase,
  DollarSign,
  Flame,
  XCircle,
  ArrowRight
} from 'lucide-react';

/**
 * Phase 8 Blindspot Mitigation Demo Component
 * 
 * Provides quick access and overview of the completed blindspot mitigation framework
 */
export function Phase8BlindspotsDemo() {
  const [demoStats] = useState({
    blindspotViews: 1456,
    actionInteractions: 1298,
    riskMitigations: 1087,
    completionStatus: 100
  });

  const blindspotMitigationFeatures = [
    {
      id: 'common-blindspots',
      title: 'Common Blindspots Matrix',
      description: 'Risk matrix board categorizing blindspots with comprehensive mitigation strategies and implementation tracking',
      icon: <AlertTriangle className="w-5 h-5" />,
      status: 'complete',
      access: '?app=true&page=common-blindspots',
      features: [
        'Technical Debt risk assessment and mitigation strategies',
        'User Experience gaps identification and improvement plans',
        'Performance Under Load testing and optimization frameworks',
        'Security Vulnerabilities scanning and remediation protocols',
        'Market Competition analysis and differentiation strategies',
        'Interactive risk matrix with impact vs probability assessment',
        'Comprehensive blindspot categorization and prioritization',
        'Detailed mitigation strategies with actionable recommendations',
        'Progress tracking and implementation monitoring systems',
        'Risk severity assessment and resource allocation planning'
      ],
      metrics: {
        totalBlindspots: 15,
        criticalRisks: 6,
        avgImpactScore: 7.4,
        mitigationProgress: 31
      }
    },
    {
      id: 'immediate-actions',
      title: 'Immediate Next Actions',
      description: 'Priority-based 7-day action plan with foundation tasks, quality gates, and success metrics implementation',
      icon: <Flag className="w-5 h-5" />,
      status: 'complete',
      access: '?app=true&page=immediate-next-actions',
      features: [
        'Priority 1 - Foundation (Days 1-2): Scalability, compliance, team setup',
        'Priority 2 - Quality Gates (Days 3-5): Testing, performance, security',
        'Priority 3 - Success Metrics (Days 6-7): Analytics, dashboards, feedback',
        'Interactive task management with completion tracking',
        'To-do list interface for foundation tasks with checklists',
        'Kanban board for quality gate tasks with workflow management',
        'Analytics setup dashboard with component-based tracking',
        'Team assignment and resource allocation planning',
        'Progress monitoring and deadline tracking systems',
        'Comprehensive task templates and implementation guides'
      ],
      metrics: {
        totalActions: 12,
        foundationTasks: 4,
        qualityGates: 4,
        successMetrics: 4
      }
    }
  ];

  const blindspotCategories = [
    {
      name: 'Technical Debt',
      color: 'var(--ff-error)',
      icon: <Code2 className="w-4 h-4" />,
      riskLevel: 'Critical',
      blindspots: 3,
      mitigated: 20
    },
    {
      name: 'User Experience',
      color: 'var(--ff-warning)',
      icon: <Users className="w-4 h-4" />,
      riskLevel: 'High',
      blindspots: 3,
      mitigated: 44
    },
    {
      name: 'Performance',
      color: 'var(--ff-accent)',
      icon: <Zap className="w-4 h-4" />,
      riskLevel: 'High',
      blindspots: 3,
      mitigated: 27
    },
    {
      name: 'Security',
      color: 'var(--ff-secondary)',
      icon: <Shield className="w-4 h-4" />,
      riskLevel: 'Critical',
      blindspots: 3,
      mitigated: 63
    },
    {
      name: 'Market Competition',
      color: 'var(--ff-primary)',
      icon: <TrendingUp className="w-4 h-4" />,
      riskLevel: 'Medium',
      blindspots: 3,
      mitigated: 14
    }
  ];

  const immediatePriorities = [
    {
      priority: 1,
      name: 'Foundation',
      timeframe: 'Days 1-2',
      color: 'var(--ff-error)',
      icon: <Flag className="w-4 h-4" />,
      tasks: 4,
      focus: 'Scalability, compliance, team setup, monitoring',
      completion: 0
    },
    {
      priority: 2,
      name: 'Quality Gates', 
      timeframe: 'Days 3-5',
      color: 'var(--ff-warning)',
      icon: <Shield className="w-4 h-4" />,
      tasks: 4,
      focus: 'Testing pipeline, performance, security, processes',
      completion: 0
    },
    {
      priority: 3,
      name: 'Success Metrics',
      timeframe: 'Days 6-7',
      color: 'var(--ff-success)',
      icon: <Target className="w-4 h-4" />,
      tasks: 4,
      focus: 'Analytics, business metrics, feedback, A/B testing',
      completion: 0
    }
  ];

  const handleQuickAccess = (access: string) => {
    if (access.startsWith('?')) {
      const newUrl = `${window.location.origin}${window.location.pathname}${access}`;
      window.open(newUrl, '_blank');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4 ff-fade-in-up">
        <Badge className="ff-badge-warning px-4 py-2">
          <CheckCircle className="w-4 h-4 mr-2" />
          Phase 8 Complete
        </Badge>
        
        <h1 className="ff-text-display">
          Blindspot
          <span className="ff-text-gradient"> Mitigation</span>
        </h1>
        
        <p className="ff-text-body max-w-3xl mx-auto">
          Complete implementation of blindspot mitigation with comprehensive risk matrix boards and 
          priority-based action plans covering technical debt, user experience gaps, performance issues, 
          security vulnerabilities, and market competition with immediate 7-day implementation roadmap.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ff-stagger-fade">
        <Card className="ff-card text-center p-4">
          <div className="w-10 h-10 bg-[var(--ff-error)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <AlertTriangle className="w-5 h-5 text-[var(--ff-error)]" />
          </div>
          <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
            {demoStats.blindspotViews.toLocaleString()}
          </div>
          <div className="ff-text-xs text-[var(--ff-text-muted)]">Blindspot Views</div>
        </Card>

        <Card className="ff-card text-center p-4">
          <div className="w-10 h-10 bg-[var(--ff-warning)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Flag className="w-5 h-5 text-[var(--ff-warning)]" />
          </div>
          <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
            {demoStats.actionInteractions.toLocaleString()}
          </div>
          <div className="ff-text-xs text-[var(--ff-text-muted)]">Action Interactions</div>
        </Card>

        <Card className="ff-card text-center p-4">
          <div className="w-10 h-10 bg-[var(--ff-secondary)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Shield className="w-5 h-5 text-[var(--ff-secondary)]" />
          </div>
          <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
            {demoStats.riskMitigations.toLocaleString()}
          </div>
          <div className="ff-text-xs text-[var(--ff-text-muted)]">Risk Mitigations</div>
        </Card>

        <Card className="ff-card text-center p-4">
          <div className="w-10 h-10 bg-[var(--ff-success)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Award className="w-5 h-5 text-[var(--ff-success)]" />
          </div>
          <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
            {demoStats.completionStatus}%
          </div>
          <div className="ff-text-xs text-[var(--ff-text-muted)]">Complete</div>
        </Card>
      </div>

      {/* Blindspot Categories Overview */}
      <Card className="ff-card">
        <CardHeader>
          <CardTitle className="ff-text-title flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[var(--ff-error)]" />
            Risk Categories & Mitigation Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {blindspotCategories.map((category, index) => (
              <Card key={index} className="ff-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: category.color + '20' }}
                    >
                      {React.cloneElement(category.icon, { style: { color: category.color } })}
                    </div>
                    <div>
                      <h4 className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                        {category.name}
                      </h4>
                      <Badge 
                        className={`ff-badge-${category.riskLevel === 'Critical' ? 'error' : category.riskLevel === 'High' ? 'warning' : 'secondary'} text-xs`}
                      >
                        {category.riskLevel}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="ff-text-xs text-[var(--ff-text-muted)]">Blindspots</span>
                      <span className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                        {category.blindspots}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="ff-text-xs text-[var(--ff-text-muted)]">Mitigated</span>
                      <span className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                        {category.mitigated}%
                      </span>
                    </div>
                    <Progress value={category.mitigated} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Immediate Priorities Timeline */}
      <Card className="ff-card">
        <CardHeader>
          <CardTitle className="ff-text-title flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--ff-warning)]" />
            7-Day Priority Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {immediatePriorities.map((priority) => (
              <Card key={priority.priority} className="ff-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: priority.color + '20' }}
                    >
                      {React.cloneElement(priority.icon, { style: { color: priority.color } })}
                    </div>
                    <div>
                      <h4 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                        Priority {priority.priority}: {priority.name}
                      </h4>
                      <p className="ff-text-xs text-[var(--ff-text-muted)]">{priority.timeframe}</p>
                    </div>
                  </div>
                  
                  <p className="ff-text-xs text-[var(--ff-text-secondary)] mb-4">{priority.focus}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="ff-text-xs text-[var(--ff-text-muted)]">Tasks</span>
                      <span className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                        {priority.tasks}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="ff-text-xs text-[var(--ff-text-muted)]">Progress</span>
                      <span className="ff-text-xs text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                        {priority.completion}%
                      </span>
                    </div>
                    <Progress value={priority.completion} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Framework Components Grid */}
      <div className="grid lg:grid-cols-2 gap-8 ff-stagger-fade">
        {blindspotMitigationFeatures.map((component, index) => (
          <Card 
            key={component.id} 
            className="ff-card-interactive hover:border-[var(--ff-error)]/30"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[var(--ff-error)]/20 rounded-lg flex items-center justify-center">
                    {component.icon}
                  </div>
                  <div>
                    <CardTitle className="ff-text-lg text-[var(--ff-text-primary)] mb-1">
                      {component.title}
                    </CardTitle>
                    <Badge className="ff-badge-success text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {component.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <p className="ff-text-sm text-[var(--ff-text-muted)] mt-3">
                {component.description}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-[var(--ff-surface-light)] rounded-lg">
                {Object.entries(component.metrics).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="ff-text-xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                      {typeof value === 'number' ? 
                        value > 100 ? value.toLocaleString() : 
                        key.includes('Progress') || key.includes('Score') ? `${value}${key.includes('Score') ? '' : '%'}` :
                        value.toLocaleString()
                      : value}
                    </div>
                    <div className="ff-text-xs text-[var(--ff-text-muted)]">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    {key.includes('Progress') && (
                      <Progress value={value as number} className="h-1 mt-2" />
                    )}
                  </div>
                ))}
              </div>

              {/* Feature List */}
              <div className="space-y-3">
                <h4 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                  Key Features:
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {component.features.map((feature, itemIndex) => (
                    <div key={itemIndex} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[var(--ff-success)] flex-shrink-0 mt-0.5" />
                      <span className="ff-text-sm text-[var(--ff-text-secondary)]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Access Button */}
              <Button
                onClick={() => handleQuickAccess(component.access)}
                className="w-full ff-btn-error flex items-center justify-center gap-2"
                style={{
                  fontFamily: 'var(--ff-font-primary)',
                  fontWeight: 'var(--ff-weight-semibold)',
                  fontSize: 'var(--ff-text-sm)'
                }}
              >
                <MousePointer className="w-4 h-4" />
                Live Dashboard
                <ExternalLink className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Implementation Excellence */}
      <Card className="ff-card bg-gradient-to-r from-[var(--ff-surface)] to-[var(--ff-surface-light)]">
        <CardHeader>
          <CardTitle className="ff-text-title flex items-center gap-2">
            <Shield className="w-5 h-5 text-[var(--ff-error)]" />
            Risk Mitigation Excellence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Blindspot Achievements */}
            <div className="space-y-4">
              <h3 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                Common Blindspots Matrix ✅
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--ff-error)]/20 rounded-lg flex items-center justify-center">
                    <Code2 className="w-4 h-4 text-[var(--ff-error)]" />
                  </div>
                  <div>
                    <div className="ff-text-sm text-[var(--ff-text-primary)]">Technical Debt</div>
                    <div className="ff-text-xs text-[var(--ff-text-muted)]">Legacy code, quality issues, architecture debt</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--ff-warning)]/20 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-[var(--ff-warning)]" />
                  </div>
                  <div>
                    <div className="ff-text-sm text-[var(--ff-text-primary)]">User Experience</div>
                    <div className="ff-text-xs text-[var(--ff-text-muted)]">Accessibility gaps, journey optimization</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--ff-accent)]/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-[var(--ff-accent)]" />
                  </div>
                  <div>
                    <div className="ff-text-sm text-[var(--ff-text-primary)]">Performance Under Load</div>
                    <div className="ff-text-xs text-[var(--ff-text-muted)]">Load testing, database optimization</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--ff-secondary)]/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-[var(--ff-secondary)]" />
                  </div>
                  <div>
                    <div className="ff-text-sm text-[var(--ff-text-primary)]">Security Vulnerabilities</div>
                    <div className="ff-text-xs text-[var(--ff-text-muted)]">Auth gaps, data protection, API security</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Plan Achievements */}
            <div className="space-y-4">
              <h3 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                Immediate Next Actions ✅
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--ff-error)]/20 rounded-lg flex items-center justify-center">
                    <Flag className="w-4 h-4 text-[var(--ff-error)]" />
                  </div>
                  <div>
                    <div className="ff-text-sm text-[var(--ff-text-primary)]">Priority 1: Foundation</div>
                    <div className="ff-text-xs text-[var(--ff-text-muted)]">Days 1-2, scalability & compliance</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--ff-warning)]/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-[var(--ff-warning)]" />
                  </div>
                  <div>
                    <div className="ff-text-sm text-[var(--ff-text-primary)]">Priority 2: Quality Gates</div>
                    <div className="ff-text-xs text-[var(--ff-text-muted)]">Days 3-5, testing & security</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--ff-success)]/20 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-[var(--ff-success)]" />
                  </div>
                  <div>
                    <div className="ff-text-sm text-[var(--ff-text-primary)]">Priority 3: Success Metrics</div>
                    <div className="ff-text-xs text-[var(--ff-text-muted)]">Days 6-7, analytics & feedback</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--ff-primary)]/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-[var(--ff-primary)]" />
                  </div>
                  <div>
                    <div className="ff-text-sm text-[var(--ff-text-primary)]">Market Competition</div>
                    <div className="ff-text-xs text-[var(--ff-text-muted)]">Feature parity, positioning, pricing</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Section */}
          <div className="border-t border-[var(--border)] pt-6">
            <h3 className="ff-text-base text-[var(--ff-text-primary)] mb-4" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
              Quick Access to Phase 8 Components
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => handleQuickAccess('?app=true&page=common-blindspots')}
                className="ff-btn-error"
                style={{
                  fontFamily: 'var(--ff-font-primary)',
                  fontWeight: 'var(--ff-weight-semibold)',
                  fontSize: 'var(--ff-text-sm)'
                }}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Risk Matrix
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
              
              <Button
                onClick={() => handleQuickAccess('?app=true&page=immediate-next-actions')}
                className="ff-btn-warning"
                style={{
                  fontFamily: 'var(--ff-font-primary)',
                  fontWeight: 'var(--ff-weight-semibold)',
                  fontSize: 'var(--ff-text-sm)'
                }}
              >
                <Flag className="w-4 h-4 mr-2" />
                Action Plan
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Mitigation & ROI */}
      <Card className="ff-card border-[var(--ff-error)]/20">
        <CardHeader>
          <CardTitle className="ff-text-title flex items-center gap-2">
            <Flame className="w-5 h-5 text-[var(--ff-error)]" />
            Risk Mitigation & Operational ROI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="ff-text-body">
            Phase 8 Blindspot Mitigation provides comprehensive risk assessment with detailed 
            mitigation strategies and immediate action plans for technical debt, user experience, 
            performance, security, and competitive positioning.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
              <div className="ff-text-2xl text-[var(--ff-error)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                15
              </div>
              <div className="ff-text-sm text-[var(--ff-text-muted)]">Total Blindspots</div>
            </div>
            
            <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
              <div className="ff-text-2xl text-[var(--ff-warning)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                12
              </div>
              <div className="ff-text-sm text-[var(--ff-text-muted)]">Immediate Actions</div>
            </div>
            
            <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
              <div className="ff-text-2xl text-[var(--ff-secondary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                7.4
              </div>
              <div className="ff-text-sm text-[var(--ff-text-muted)]">Avg Impact Score</div>
            </div>
            
            <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
              <div className="ff-text-2xl text-[var(--ff-success)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                31%
              </div>
              <div className="ff-text-sm text-[var(--ff-text-muted)]">Mitigated</div>
            </div>
          </div>

          {/* Complete Platform Integration */}
          <div className="border-t border-[var(--border)] pt-6">
            <h4 className="ff-text-base text-[var(--ff-text-primary)] mb-4" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
              Complete 8-Phase Platform Integration
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-8 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((phase) => (
                <Button
                  key={phase}
                  onClick={() => handleQuickAccess(
                    phase === 1 ? '?app=true&page=pricing-wireframe' :
                    phase === 2 ? '?app=true&page=responsive-ui-kit' :
                    phase === 3 ? '?app=true&page=design-system-sync' :
                    phase === 4 ? '?app=true&page=quality-thresholds' :
                    phase === 5 ? '?app=true&page=security-compliance' :
                    phase === 6 ? '?app=true&page=team-structure' :
                    phase === 7 ? '?app=true&page=discovery-phase-timeline' :
                    '?app=true&page=common-blindspots'
                  )}
                  className={`ff-btn-outline ${phase === 8 ? 'ff-btn-error' : ''}`}
                  size="sm"
                >
                  Phase {phase}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Phase8BlindspotsDemo;