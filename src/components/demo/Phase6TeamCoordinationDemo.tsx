/**
 * @fileoverview Phase 6 Team Structure & Coordination Demo
 * @chunk demo
 * @category components
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Interactive demonstration of the completed Phase 6 Team Structure & Coordination
 * showcasing recommended team organization and cross-functional coordination systems.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  CheckCircle, 
  ExternalLink, 
  Users, 
  MessageSquare, 
  ArrowRight,
  Crown,
  Target,
  Award,
  Activity,
  Eye,
  MousePointer,
  Calendar,
  Clock,
  User,
  Code,
  Server,
  Palette,
  Bug,
  BarChart3,
  Shield,
  TrendingUp,
  Briefcase,
  DollarSign,
  Zap,
  Flame,
  FileText
} from 'lucide-react';

/**
 * Phase 6 Team Structure & Coordination Demo Component
 * 
 * Provides quick access and overview of the completed team coordination framework
 */
export function Phase6TeamCoordinationDemo() {
  const [demoStats] = useState({
    teamStructureViews: 945,
    coordinationInteractions: 821,
    organizationTracking: 736,
    completionStatus: 100
  });

  const teamCoordinationFeatures = [
    {
      id: 'team-structure',
      title: 'Recommended Team Structure',
      description: 'Comprehensive organizational chart with core SaaS team roles, extended positions, and hiring timeline',
      icon: <Users className="w-5 h-5" />,
      status: 'complete',
      access: '?app=true&page=team-structure',
      features: [
        'Complete organizational chart with 14 roles',
        'Leadership structure (CEO, CTO, Product Manager)',
        'Engineering team hierarchy (Frontend, Backend, DevOps)',
        'Quality & Analytics roles (QA Engineer, Data Analyst)',
        'Extended team positions (Security, Performance, Marketing)',
        'Salary ranges and equity distribution ($50k - $200k+)',
        'Hiring timeline from pre-seed to Series A',
        'Team collaboration patterns and best practices'
      ],
      metrics: {
        totalRoles: 14,
        coreTeam: 7,
        estimatedBudget: 2.8,
        timeToFullTeam: 24
      }
    },
    {
      id: 'cross-functional-coordination',
      title: 'Cross-Functional Coordination',
      description: 'Team coordination calendar with daily stand-ups, weekly syncs, sprint planning, and OKR sessions',
      icon: <MessageSquare className="w-5 h-5" />,
      status: 'complete',
      access: '?app=true&page=cross-functional-coordination',
      features: [
        'Interactive team coordination calendar',
        'Daily stand-ups (15min with engineering team)',
        'Weekly cross-team sync meetings (60min leadership)',
        'Bi-weekly sprint planning and retrospectives (2-3 hours)',
        'Monthly all-hands meetings (60min entire team)',
        'Quarterly OKR planning sessions (3 hours leadership)',
        'Color-coded meeting types and priorities',
        'Cross-team dependency tracking and management'
      ],
      metrics: {
        totalMeetings: 142,
        averageAttendance: 87.3,
        meetingEfficiency: 78.5,
        crossTeamCollaboration: 92.1
      }
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
        <Badge className="ff-badge-secondary px-4 py-2">
          <CheckCircle className="w-4 h-4 mr-2" />
          Phase 6 Complete
        </Badge>
        
        <h1 className="ff-text-display">
          Team Structure &
          <span className="ff-text-gradient"> Coordination</span>
        </h1>
        
        <p className="ff-text-body max-w-3xl mx-auto">
          Complete implementation of team structure organization and cross-functional coordination 
          with comprehensive org charts, hiring timelines, meeting schedules, and collaboration frameworks.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ff-stagger-fade">
        <Card className="ff-card text-center p-4">
          <div className="w-10 h-10 bg-[var(--ff-secondary)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Users className="w-5 h-5 text-[var(--ff-secondary)]" />
          </div>
          <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
            {demoStats.teamStructureViews.toLocaleString()}
          </div>
          <div className="ff-text-xs text-[var(--ff-text-muted)]">Team Structure Views</div>
        </Card>

        <Card className="ff-card text-center p-4">
          <div className="w-10 h-10 bg-[var(--ff-accent)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <MessageSquare className="w-5 h-5 text-[var(--ff-accent)]" />
          </div>
          <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
            {demoStats.coordinationInteractions.toLocaleString()}
          </div>
          <div className="ff-text-xs text-[var(--ff-text-muted)]">Coordination Interactions</div>
        </Card>

        <Card className="ff-card text-center p-4">
          <div className="w-10 h-10 bg-[var(--ff-primary)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Target className="w-5 h-5 text-[var(--ff-primary)]" />
          </div>
          <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
            {demoStats.organizationTracking.toLocaleString()}
          </div>
          <div className="ff-text-xs text-[var(--ff-text-muted)]">Organization Tracking</div>
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

      {/* Framework Components Grid */}
      <div className="grid lg:grid-cols-2 gap-8 ff-stagger-fade">
        {teamCoordinationFeatures.map((component, index) => (
          <Card 
            key={component.id} 
            className="ff-card-interactive hover:border-[var(--ff-secondary)]/30"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[var(--ff-secondary)]/20 rounded-lg flex items-center justify-center">
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
                        key.includes('Budget') ? `$${value.toFixed(1)}M` :
                        key.includes('Team') ? `${value}mo` :
                        value.toFixed(1)
                      : value}
                      {key.includes('Attendance') || key.includes('Efficiency') || key.includes('Collaboration') ? '%' : ''}
                    </div>
                    <div className="ff-text-xs text-[var(--ff-text-muted)]">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    {(key.includes('Attendance') || key.includes('Efficiency') || key.includes('Collaboration')) && (
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
                className="w-full ff-btn-secondary flex items-center justify-center gap-2"
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

      {/* Implementation Highlights */}
      <Card className="ff-card bg-gradient-to-r from-[var(--ff-surface)] to-[var(--ff-surface-light)]">
        <CardHeader>
          <CardTitle className="ff-text-title flex items-center gap-2">
            <Crown className="w-5 h-5 text-[var(--ff-secondary)]" />
            Team Organization Excellence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Team Structure Achievements */}
            <div className="space-y-4">
              <h3 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                Recommended Team Structure ✅
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--ff-accent)]/20 rounded-lg flex items-center justify-center">
                    <Crown className="w-4 h-4 text-[var(--ff-accent)]" />
                  </div>
                  <div>
                    <div className="ff-text-sm text-[var(--ff-text-primary)]">Leadership Structure</div>
                    <div className="ff-text-xs text-[var(--ff-text-muted)]">CEO, CTO, Product Manager hierarchy</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--ff-secondary)]/20 rounded-lg flex items-center justify-center">
                    <Code className="w-4 h-4 text-[var(--ff-secondary)]" />
                  </div>
                  <div>
                    <div className="ff-text-sm text-[var(--ff-text-primary)]">Engineering Team</div>
                    <div className="ff-text-xs text-[var(--ff-text-muted)]">Frontend, Backend, DevOps roles</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--ff-success)]/20 rounded-lg flex items-center justify-center">
                    <Bug className="w-4 h-4 text-[var(--ff-success)]" />
                  </div>
                  <div>
                    <div className="ff-text-sm text-[var(--ff-text-primary)]">Quality & Analytics</div>
                    <div className="ff-text-xs text-[var(--ff-text-muted)]">QA Engineer, Data Analyst</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--ff-warning)]/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-[var(--ff-warning)]" />
                  </div>
                  <div>
                    <div className="ff-text-sm text-[var(--ff-text-primary)]">Extended Team</div>
                    <div className="ff-text-xs text-[var(--ff-text-muted)]">Security, Performance, Marketing</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coordination Achievements */}
            <div className="space-y-4">
              <h3 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                Cross-Functional Coordination ✅
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--ff-primary)]/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-[var(--ff-primary)]" />
                  </div>
                  <div>
                    <div className="ff-text-sm text-[var(--ff-text-primary)]">Daily Stand-ups</div>
                    <div className="ff-text-xs text-[var(--ff-text-muted)]">15min engineering team meetings</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--ff-secondary)]/20 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-[var(--ff-secondary)]" />
                  </div>
                  <div>
                    <div className="ff-text-sm text-[var(--ff-text-primary)]">Weekly Cross-Team Sync</div>
                    <div className="ff-text-xs text-[var(--ff-text-muted)]">60min leadership coordination</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--ff-accent)]/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-[var(--ff-accent)]" />
                  </div>
                  <div>
                    <div className="ff-text-sm text-[var(--ff-text-primary)]">Sprint Planning</div>
                    <div className="ff-text-xs text-[var(--ff-text-muted)]">Bi-weekly 2-hour sessions</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--ff-error)]/20 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-[var(--ff-error)]" />
                  </div>
                  <div>
                    <div className="ff-text-sm text-[var(--ff-text-primary)]">OKR Planning</div>
                    <div className="ff-text-xs text-[var(--ff-text-muted)]">Quarterly 3-hour strategy sessions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Section */}
          <div className="border-t border-[var(--border)] pt-6">
            <h3 className="ff-text-base text-[var(--ff-text-primary)] mb-4" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
              Quick Access to Phase 6 Components
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => handleQuickAccess('?app=true&page=team-structure')}
                className="ff-btn-secondary"
                style={{
                  fontFamily: 'var(--ff-font-primary)',
                  fontWeight: 'var(--ff-weight-semibold)',
                  fontSize: 'var(--ff-text-sm)'
                }}
              >
                <Users className="w-4 h-4 mr-2" />
                Team Structure
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
              
              <Button
                onClick={() => handleQuickAccess('?app=true&page=cross-functional-coordination')}
                className="ff-btn-accent"
                style={{
                  fontFamily: 'var(--ff-font-primary)',
                  fontWeight: 'var(--ff-weight-semibold)',
                  fontSize: 'var(--ff-text-sm)'
                }}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Team Coordination
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Organization & ROI */}
      <Card className="ff-card border-[var(--ff-secondary)]/20">
        <CardHeader>
          <CardTitle className="ff-text-title flex items-center gap-2">
            <Flame className="w-5 h-5 text-[var(--ff-secondary)]" />
            Team Organization & Operational ROI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="ff-text-body">
            Phase 6 Team Structure & Coordination provides comprehensive organizational planning 
            with detailed team hierarchies, coordination frameworks, and operational excellence systems.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
              <div className="ff-text-2xl text-[var(--ff-secondary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                14
              </div>
              <div className="ff-text-sm text-[var(--ff-text-muted)]">Total Team Roles</div>
            </div>
            
            <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
              <div className="ff-text-2xl text-[var(--ff-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                $2.8M
              </div>
              <div className="ff-text-sm text-[var(--ff-text-muted)]">Annual Team Budget</div>
            </div>
            
            <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
              <div className="ff-text-2xl text-[var(--ff-accent)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                87.3%
              </div>
              <div className="ff-text-sm text-[var(--ff-text-muted)]">Meeting Attendance</div>
            </div>
            
            <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
              <div className="ff-text-2xl text-[var(--ff-success)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                92.1%
              </div>
              <div className="ff-text-sm text-[var(--ff-text-muted)]">Team Collaboration</div>
            </div>
          </div>

          {/* Complete Platform Integration */}
          <div className="border-t border-[var(--border)] pt-6">
            <h4 className="ff-text-base text-[var(--ff-text-primary)] mb-4" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
              Complete 6-Phase Platform Integration
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              <Button
                onClick={() => handleQuickAccess('?app=true&page=pricing-wireframe')}
                className="ff-btn-outline"
                size="sm"
              >
                Phase 1: Business Intel
              </Button>
              <Button
                onClick={() => handleQuickAccess('?app=true&page=responsive-ui-kit')}
                className="ff-btn-outline"
                size="sm"
              >
                Phase 2: Technical Arch
              </Button>
              <Button
                onClick={() => handleQuickAccess('?app=true&page=design-system-sync')}
                className="ff-btn-outline"
                size="sm"
              >
                Phase 3: Design/Dev
              </Button>
              <Button
                onClick={() => handleQuickAccess('?app=true&page=quality-thresholds')}
                className="ff-btn-outline"
                size="sm"
              >
                Phase 4: Quality/Metrics
              </Button>
              <Button
                onClick={() => handleQuickAccess('?app=true&page=security-compliance')}
                className="ff-btn-outline"
                size="sm"
              >
                Phase 5: Risk Mitigation
              </Button>
              <Button
                onClick={() => handleQuickAccess('?app=true&page=team-structure')}
                className="ff-btn-outline"
                size="sm"
              >
                Phase 6: Team Structure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Phase6TeamCoordinationDemo;