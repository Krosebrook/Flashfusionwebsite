/**
 * @fileoverview FlashFusion Quality Thresholds Dashboard
 * @chunk quality
 * @category quality-gates
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Quality dashboard that visualizes design approval thresholds with comprehensive
 * monitoring of accessibility compliance, performance targets, visual consistency,
 * and mobile optimization metrics.
 * 
 * Features:
 * - WCAG 2.1 AA accessibility compliance monitoring
 * - Performance targets tracking (<3s page load on 3G)
 * - Visual consistency validation (100% design token usage)
 * - Mobile optimization metrics (<2s load)
 * - Real-time threshold monitoring
 * - Interactive quality gates system
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Shield, 
  Zap, 
  Palette, 
  Smartphone,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Eye,
  Target,
  Activity,
  Settings,
  RefreshCw,
  PlayCircle,
  PauseCircle,
  BarChart3,
  Gauge,
  Monitor,
  Tablet,
  Globe,
  Code,
  Users,
  Star,
  Award,
  Flame,
  ArrowUp,
  ArrowDown,
  Info,
  Download,
  Upload
} from 'lucide-react';

// Quality threshold data
const qualityMetrics = {
  accessibility: {
    current: 96.8,
    target: 95,
    threshold: 'WCAG 2.1 AA',
    status: 'excellent',
    trend: 2.3,
    lastCheck: '2024-12-19T14:30:00Z',
    checks: {
      colorContrast: 98.5,
      keyboardNav: 100,
      screenReader: 94.2,
      altText: 95.8,
      ariaLabels: 97.1,
      semanticHTML: 99.2
    },
    issues: [
      { type: 'minor', count: 3, description: 'Missing alt text on decorative images' },
      { type: 'moderate', count: 1, description: 'Insufficient color contrast in one component' }
    ]
  },
  performance: {
    current: 2.1,
    target: 3.0,
    threshold: '<3s page load on 3G',
    status: 'excellent',
    trend: -0.4,
    lastCheck: '2024-12-19T14:25:00Z',
    metrics: {
      fcp: 1.2,
      lcp: 2.1,
      fid: 85,
      cls: 0.08,
      ttfb: 450
    },
    devices: {
      mobile3G: 2.1,
      mobile4G: 1.3,
      desktop: 0.8
    },
    recommendations: [
      'Optimize image compression (potential 15% improvement)',
      'Enable resource bundling (potential 8% improvement)',
      'Implement service worker caching (potential 12% improvement)'
    ]
  },
  visualConsistency: {
    current: 98.7,
    target: 100,
    threshold: '100% design token usage',
    status: 'excellent',
    trend: 1.2,
    lastCheck: '2024-12-19T14:28:00Z',
    components: {
      colors: 99.8,
      typography: 98.2,
      spacing: 99.1,
      icons: 97.4,
      animations: 98.9
    },
    violations: [
      { component: 'Button', issue: 'Custom color used instead of token', severity: 'low' },
      { component: 'Modal', issue: 'Inconsistent padding values', severity: 'medium' }
    ]
  },
  mobileOptimization: {
    current: 1.7,
    target: 2.0,
    threshold: '<2s mobile load',
    status: 'excellent',
    trend: -0.3,
    lastCheck: '2024-12-19T14:32:00Z',
    scores: {
      performance: 94,
      accessibility: 96,
      bestPractices: 92,
      seo: 98
    },
    optimizations: {
      imageOptimization: 95,
      codeMinification: 98,
      resourceCompression: 92,
      cacheStrategy: 89
    }
  }
};

const qualityGates = [
  {
    id: 'accessibility-gate',
    name: 'Accessibility Gate',
    description: 'WCAG 2.1 AA compliance verification',
    threshold: 95,
    current: 96.8,
    status: 'passed',
    blocksDeployment: true,
    lastRun: '2024-12-19T14:30:00Z',
    checks: 6,
    passed: 6,
    failed: 0
  },
  {
    id: 'performance-gate',
    name: 'Performance Gate',
    description: '3G load time under 3 seconds',
    threshold: 3.0,
    current: 2.1,
    status: 'passed',
    blocksDeployment: true,
    lastRun: '2024-12-19T14:25:00Z',
    checks: 5,
    passed: 5,
    failed: 0
  },
  {
    id: 'design-consistency-gate',
    name: 'Design Consistency Gate',
    description: '100% design token compliance',
    threshold: 98,
    current: 98.7,
    status: 'passed',
    blocksDeployment: false,
    lastRun: '2024-12-19T14:28:00Z',
    checks: 5,
    passed: 4,
    failed: 1
  },
  {
    id: 'mobile-optimization-gate',
    name: 'Mobile Optimization Gate',
    description: 'Mobile load time under 2 seconds',
    threshold: 2.0,
    current: 1.7,
    status: 'passed',
    blocksDeployment: true,
    lastRun: '2024-12-19T14:32:00Z',
    checks: 4,
    passed: 4,
    failed: 0
  }
];

interface QualityThresholdsDashboardProps {
  // Optional props for customization
}

/**
 * FlashFusion Quality Thresholds Dashboard Component
 */
export function QualityThresholdsDashboard({}: QualityThresholdsDashboardProps) {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<string>('accessibility');
  const [refreshCount, setRefreshCount] = useState(0);

  // Simulate real-time updates
  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        setRefreshCount(prev => prev + 1);
        // Simulate small metric variations
        Object.keys(qualityMetrics).forEach(key => {
          const metric = qualityMetrics[key as keyof typeof qualityMetrics];
          if (typeof metric.current === 'number') {
            // Add small random variation
            const variation = (Math.random() - 0.5) * 0.5;
            metric.current = Math.max(0, metric.current + variation);
          }
        });
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'var(--ff-success)';
      case 'good': return 'var(--ff-secondary)';
      case 'warning': return 'var(--ff-warning)';
      case 'critical': return 'var(--ff-error)';
      default: return 'var(--ff-text-muted)';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'failed': return XCircle;
      default: return Clock;
    }
  };

  // Quality gauge component
  const QualityGauge = ({ title, current, target, unit = '%', status, icon: Icon, trend }: any) => (
    <Card className="ff-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5" style={{ color: getStatusColor(status) }} />
            <h3 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
              {title}
            </h3>
          </div>
          <Badge className={`ff-badge-${status === 'excellent' ? 'success' : status === 'good' ? 'secondary' : 'warning'}`}>
            {status}
          </Badge>
        </div>
        
        {/* Circular gauge */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="var(--ff-surface-light)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke={getStatusColor(status)}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(current / (unit === 's' ? target : 100)) * 283} 283`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                {typeof current === 'number' ? current.toFixed(1) : current}
              </div>
              <div className="ff-text-xs text-[var(--ff-text-muted)]">{unit}</div>
            </div>
          </div>
        </div>
        
        {/* Target and trend */}
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="ff-text-sm text-[var(--ff-text-muted)]">Target</div>
            <div className="ff-text-lg text-[var(--ff-text-secondary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
              {target}{unit}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {trend > 0 ? (
              <ArrowUp className="w-4 h-4 text-[var(--ff-success)]" />
            ) : (
              <ArrowDown className="w-4 h-4 text-[var(--ff-error)]" />
            )}
            <span className={`ff-text-sm ${trend > 0 ? 'text-[var(--ff-success)]' : 'text-[var(--ff-error)]'}`}>
              {Math.abs(trend).toFixed(1)}{unit}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)]" style={{ fontFamily: 'var(--ff-font-secondary)' }}>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 ff-fade-in-up">
          <Badge className="ff-badge-warning mb-4">
            <Shield className="w-4 h-4 mr-2" />
            Quality Gates & Thresholds
          </Badge>
          
          <h1 className="ff-text-display">
            Quality
            <span className="ff-text-gradient"> Assurance</span>
          </h1>
          
          <p className="ff-text-body max-w-3xl mx-auto">
            Comprehensive quality monitoring with automated thresholds for accessibility compliance,
            performance targets, visual consistency validation, and mobile optimization metrics.
          </p>
        </div>

        {/* Quality Control Panel */}
        <Card className="ff-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="ff-text-title flex items-center gap-2">
                <Activity className="w-5 h-5 text-[var(--ff-warning)]" />
                Quality Control Panel
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={`ff-badge-${isMonitoring ? 'success' : 'secondary'}`}>
                  {isMonitoring ? 'Live Monitoring' : 'Paused'}
                </Badge>
                <Button
                  onClick={() => setIsMonitoring(!isMonitoring)}
                  size="sm"
                  className={isMonitoring ? 'ff-btn-accent' : 'ff-btn-primary'}
                >
                  {isMonitoring ? <PauseCircle className="w-4 h-4 mr-2" /> : <PlayCircle className="w-4 h-4 mr-2" />}
                  {isMonitoring ? 'Pause' : 'Start'} Monitoring
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-success)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-[var(--ff-success)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  4/4
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Gates Passed</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-warning)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <AlertTriangle className="w-6 h-6 text-[var(--ff-warning)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  4
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Minor Issues</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-primary)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-[var(--ff-primary)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  +2.1%
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Quality Trend</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-secondary)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-6 h-6 text-[var(--ff-secondary)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  2m
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Last Check</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quality Gauges Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 ff-stagger-fade">
          <QualityGauge
            title="Accessibility"
            current={qualityMetrics.accessibility.current}
            target={qualityMetrics.accessibility.target}
            unit="%"
            status={qualityMetrics.accessibility.status}
            icon={Shield}
            trend={qualityMetrics.accessibility.trend}
          />
          
          <QualityGauge
            title="Performance"
            current={qualityMetrics.performance.current}
            target={qualityMetrics.performance.target}
            unit="s"
            status={qualityMetrics.performance.status}
            icon={Zap}
            trend={qualityMetrics.performance.trend}
          />
          
          <QualityGauge
            title="Visual Consistency"
            current={qualityMetrics.visualConsistency.current}
            target={qualityMetrics.visualConsistency.target}
            unit="%"
            status={qualityMetrics.visualConsistency.status}
            icon={Palette}
            trend={qualityMetrics.visualConsistency.trend}
          />
          
          <QualityGauge
            title="Mobile Optimization"
            current={qualityMetrics.mobileOptimization.current}
            target={qualityMetrics.mobileOptimization.target}
            unit="s"
            status={qualityMetrics.mobileOptimization.status}
            icon={Smartphone}
            trend={qualityMetrics.mobileOptimization.trend}
          />
        </div>

        {/* Detailed Quality Metrics */}
        <Card className="ff-card">
          <CardContent className="p-0">
            <Tabs defaultValue="accessibility" className="w-full">
              <div className="border-b border-[var(--border)]">
                <TabsList className="grid w-full grid-cols-4 bg-[var(--ff-surface)] rounded-none">
                  <TabsTrigger value="accessibility" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Accessibility
                  </TabsTrigger>
                  <TabsTrigger value="performance" className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Performance
                  </TabsTrigger>
                  <TabsTrigger value="consistency" className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Consistency
                  </TabsTrigger>
                  <TabsTrigger value="mobile" className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Mobile
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* Accessibility Tab */}
              <TabsContent value="accessibility" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="ff-text-title">WCAG 2.1 AA Compliance</h3>
                  <Badge className="ff-badge-success">
                    96.8% Compliant
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(qualityMetrics.accessibility.checks).map(([key, value]) => (
                    <div key={key} className="p-4 bg-[var(--ff-surface)] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="ff-text-sm text-[var(--ff-text-primary)] capitalize" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                          {key.replace(/([A-Z])/g, ' $1')}
                        </span>
                        <span className="ff-text-sm text-[var(--ff-text-secondary)]">{value}%</span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3">
                  <h4 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                    Outstanding Issues
                  </h4>
                  {qualityMetrics.accessibility.issues.map((issue, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-[var(--ff-surface-light)] rounded-lg">
                      <AlertTriangle className={`w-4 h-4 mt-0.5 ${issue.type === 'minor' ? 'text-[var(--ff-warning)]' : 'text-[var(--ff-error)]'}`} />
                      <div className="flex-1">
                        <div className="ff-text-sm text-[var(--ff-text-primary)]">{issue.description}</div>
                        <div className="ff-text-xs text-[var(--ff-text-muted)] mt-1">
                          {issue.count} {issue.count === 1 ? 'instance' : 'instances'} • {issue.type} severity
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              {/* Performance Tab */}
              <TabsContent value="performance" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="ff-text-title">Performance Metrics</h3>
                  <Badge className="ff-badge-success">
                    2.1s Load Time
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {Object.entries(qualityMetrics.performance.metrics).map(([key, value]) => (
                    <div key={key} className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                      <div className="ff-text-xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                        {typeof value === 'number' && value < 1 ? (value * 1000).toFixed(0) : value}
                      </div>
                      <div className="ff-text-xs text-[var(--ff-text-muted)]">
                        {key.toUpperCase()}
                        {key === 'fid' ? 'ms' : key === 'ttfb' ? 'ms' : key.includes('cp') ? 's' : ''}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h4 className="ff-text-base text-[var(--ff-text-primary)] mb-4" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                    Device Performance
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {Object.entries(qualityMetrics.performance.devices).map(([device, time]) => (
                      <div key={device} className="p-4 bg-[var(--ff-surface)] rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          {device.includes('mobile') ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                          <span className="ff-text-sm text-[var(--ff-text-primary)] capitalize">
                            {device.replace(/([A-Z])/g, ' $1')}
                          </span>
                        </div>
                        <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                          {time}s
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              {/* Visual Consistency Tab */}
              <TabsContent value="consistency" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="ff-text-title">Design Token Usage</h3>
                  <Badge className="ff-badge-success">
                    98.7% Consistent
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {Object.entries(qualityMetrics.visualConsistency.components).map(([key, value]) => (
                    <div key={key} className="p-4 bg-[var(--ff-surface)] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="ff-text-sm text-[var(--ff-text-primary)] capitalize" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                          {key}
                        </span>
                        <span className="ff-text-sm text-[var(--ff-text-secondary)]">{value}%</span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3">
                  <h4 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                    Token Violations
                  </h4>
                  {qualityMetrics.visualConsistency.violations.map((violation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-[var(--ff-surface-light)] rounded-lg">
                      <Code className={`w-4 h-4 mt-0.5 ${violation.severity === 'low' ? 'text-[var(--ff-warning)]' : 'text-[var(--ff-error)]'}`} />
                      <div className="flex-1">
                        <div className="ff-text-sm text-[var(--ff-text-primary)]">
                          <span style={{ fontWeight: 'var(--ff-weight-semibold)' }}>{violation.component}:</span> {violation.issue}
                        </div>
                        <div className="ff-text-xs text-[var(--ff-text-muted)] mt-1">
                          {violation.severity} severity
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              {/* Mobile Optimization Tab */}
              <TabsContent value="mobile" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="ff-text-title">Mobile Performance</h3>
                  <Badge className="ff-badge-success">
                    1.7s Load Time
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(qualityMetrics.mobileOptimization.scores).map(([key, value]) => (
                    <div key={key} className="p-4 bg-[var(--ff-surface)] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="ff-text-sm text-[var(--ff-text-primary)] capitalize" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                          {key.replace(/([A-Z])/g, ' $1')}
                        </span>
                        <span className="ff-text-sm text-[var(--ff-text-secondary)]">{value}</span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  ))}
                </div>
                
                <div>
                  <h4 className="ff-text-base text-[var(--ff-text-primary)] mb-4" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                    Optimization Areas
                  </h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(qualityMetrics.mobileOptimization.optimizations).map(([key, value]) => (
                      <div key={key} className="p-4 bg-[var(--ff-surface)] rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                            {key.replace(/([A-Z])/g, ' $1')}
                          </span>
                          <span className="ff-text-sm text-[var(--ff-text-secondary)]">{value}%</span>
                        </div>
                        <Progress value={value} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quality Gates Status */}
        <Card className="ff-card">
          <CardHeader>
            <CardTitle className="ff-text-title flex items-center gap-2">
              <Target className="w-5 h-5 text-[var(--ff-secondary)]" />
              Quality Gates Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {qualityGates.map((gate) => {
                const StatusIcon = getStatusIcon(gate.status);
                
                return (
                  <div key={gate.id} className="p-4 bg-[var(--ff-surface)] rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`w-5 h-5 ${
                          gate.status === 'passed' ? 'text-[var(--ff-success)]' :
                          gate.status === 'warning' ? 'text-[var(--ff-warning)]' :
                          'text-[var(--ff-error)]'
                        }`} />
                        <h3 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                          {gate.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {gate.blocksDeployment && (
                          <Badge className="ff-badge-warning">Blocking</Badge>
                        )}
                        <Badge className={`ff-badge-${gate.status === 'passed' ? 'success' : gate.status === 'warning' ? 'warning' : 'error'}`}>
                          {gate.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="ff-text-sm text-[var(--ff-text-muted)] mb-3">{gate.description}</p>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="ff-text-sm text-[var(--ff-text-secondary)]">
                        {gate.passed}/{gate.checks} checks passed
                      </span>
                      <span className="ff-text-sm text-[var(--ff-text-muted)]">
                        Last run: {new Date(gate.lastRun).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <Progress value={(gate.passed / gate.checks) * 100} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default QualityThresholdsDashboard;