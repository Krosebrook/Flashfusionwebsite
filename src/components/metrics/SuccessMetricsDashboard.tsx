/**
 * @fileoverview FlashFusion Success Metrics Dashboard
 * @chunk metrics
 * @category success-metrics
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * KPI dashboard displaying comprehensive success metrics including Monthly Active Users,
 * trial-to-paid conversion rate, Net Promoter Score, feature adoption, uptime,
 * API response time, error rate, and performance scores.
 * 
 * Features:
 * - Real-time KPI monitoring
 * - Interactive charts and gauges
 * - Historical trend analysis
 * - Performance benchmarking
 * - Business intelligence insights
 * - Automated alert thresholds
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Users, 
  TrendingUp, 
  Star, 
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Activity,
  Target,
  DollarSign,
  Award,
  Globe,
  Smartphone,
  Monitor,
  Database,
  Server,
  Shield,
  Eye,
  RefreshCw,
  Download,
  Upload,
  ArrowUp,
  ArrowDown,
  Calendar,
  Heart,
  ThumbsUp,
  Gauge,
  Settings,
  PlayCircle,
  PauseCircle,
  Info,
  Flame,
  Crown,
  Trophy
} from 'lucide-react';

// Success metrics data
const successMetrics = {
  mau: {
    current: 24891,
    target: 25000,
    growth: 12.5,
    trend: 'up',
    historical: [18650, 19320, 20150, 21480, 22890, 24891],
    cohorts: {
      new: 3240,
      returning: 18450,
      reactivated: 3201
    }
  },
  conversion: {
    current: 17.2,
    target: 15,
    growth: 2.8,
    trend: 'up',
    historical: [12.3, 13.8, 14.5, 15.7, 16.1, 17.2],
    funnel: {
      visitors: 145000,
      trials: 28450,
      paid: 4893
    }
  },
  nps: {
    current: 72,
    target: 70,
    growth: 8.5,
    trend: 'up',
    historical: [58, 62, 65, 67, 69, 72],
    breakdown: {
      promoters: 68,
      passives: 24,
      detractors: 8
    }
  },
  featureAdoption: {
    current: 78.4,
    target: 75,
    growth: 5.2,
    trend: 'up',
    users: 19520,
    features: {
      'AI Code Generator': 89.2,
      'Project Templates': 82.1,
      'Deployment Tools': 76.8,
      'Collaboration Hub': 71.5,
      'Analytics Dashboard': 68.9
    }
  },
  uptime: {
    current: 99.97,
    target: 99.9,
    incidents: 0,
    trend: 'stable',
    sla: 99.9,
    historical: [99.94, 99.96, 99.98, 99.95, 99.97, 99.97],
    regions: {
      'US East': 99.98,
      'US West': 99.97,
      'EU West': 99.96,
      'Asia Pacific': 99.95
    }
  },
  apiResponseTime: {
    current: 127,
    target: 200,
    p95: 185,
    p99: 289,
    trend: 'down',
    improvement: -23,
    historical: [165, 152, 143, 138, 132, 127],
    endpoints: {
      '/api/generate': 98,
      '/api/deploy': 156,
      '/api/analytics': 89,
      '/api/auth': 67,
      '/api/files': 201
    }
  },
  errorRate: {
    current: 0.12,
    target: 0.5,
    trend: 'down',
    improvement: -0.08,
    historical: [0.34, 0.28, 0.22, 0.18, 0.15, 0.12],
    categories: {
      '4xx': 0.08,
      '5xx': 0.04,
      timeout: 0.002,
      network: 0.001
    }
  },
  performanceScore: {
    current: 94,
    target: 90,
    improvement: 6,
    trend: 'up',
    historical: [82, 85, 88, 90, 92, 94],
    metrics: {
      lighthouse: 94,
      webVitals: 91,
      bundleSize: 87,
      loadTime: 96
    }
  }
};

const kpiCategories = [
  {
    id: 'growth',
    name: 'Growth & Engagement',
    icon: TrendingUp,
    color: 'var(--ff-success)',
    metrics: ['mau', 'conversion', 'featureAdoption']
  },
  {
    id: 'satisfaction',
    name: 'Customer Satisfaction',
    icon: Heart,
    color: 'var(--ff-accent)',
    metrics: ['nps']
  },
  {
    id: 'reliability',
    name: 'System Reliability',
    icon: Shield,
    color: 'var(--ff-secondary)',
    metrics: ['uptime', 'apiResponseTime', 'errorRate']
  },
  {
    id: 'performance',
    name: 'Performance Quality',
    icon: Zap,
    color: 'var(--ff-primary)',
    metrics: ['performanceScore']
  }
];

interface SuccessMetricsDashboardProps {
  // Optional props for customization
}

/**
 * FlashFusion Success Metrics Dashboard Component
 */
export function SuccessMetricsDashboard({}: SuccessMetricsDashboardProps) {
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [refreshCount, setRefreshCount] = useState(0);

  // Simulate real-time updates
  useEffect(() => {
    if (isLiveMode) {
      const interval = setInterval(() => {
        setRefreshCount(prev => prev + 1);
        // Simulate metric updates
        Object.keys(successMetrics).forEach(key => {
          const metric = successMetrics[key as keyof typeof successMetrics];
          if (typeof metric.current === 'number') {
            // Add realistic variations
            const variation = Math.random() * 0.02 - 0.01; // ±1%
            metric.current = Math.max(0, metric.current * (1 + variation));
          }
        });
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isLiveMode]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return ArrowUp;
      case 'down': return ArrowDown;
      default: return Activity;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'var(--ff-success)';
      case 'down': return 'var(--ff-error)';
      default: return 'var(--ff-text-muted)';
    }
  };

  // KPI Card Component
  const KPICard = ({ title, current, target, unit = '', growth, trend, icon: Icon, color }: any) => (
    <Card className="ff-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <h3 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
              {title}
            </h3>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="ff-text-3xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
            {typeof current === 'number' ? 
              current < 1 ? current.toFixed(2) : 
              current > 1000 ? current.toLocaleString() : 
              current.toFixed(1)
            : current}{unit}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {trend !== 'stable' && (
                <div className="flex items-center gap-1">
                  {React.createElement(getTrendIcon(trend), {
                    className: "w-4 h-4",
                    style: { color: getTrendColor(trend) }
                  })}
                  <span className="ff-text-sm" style={{ color: getTrendColor(trend) }}>
                    {Math.abs(growth).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="ff-text-xs text-[var(--ff-text-muted)]">Target</div>
              <div className="ff-text-sm text-[var(--ff-text-secondary)]">
                {typeof target === 'number' ? target.toLocaleString() : target}{unit}
              </div>
            </div>
          </div>
          
          <Progress 
            value={target ? Math.min(100, (current / target) * 100) : current} 
            className="h-2"
          />
        </div>
      </CardContent>
    </Card>
  );

  // Chart Component (simplified bar chart)
  const SimpleChart = ({ data, title, color }: any) => (
    <div className="space-y-2">
      <h4 className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
        {title}
      </h4>
      <div className="flex items-end justify-between h-20 gap-1">
        {data.map((value: number, index: number) => {
          const maxValue = Math.max(...data);
          const height = (value / maxValue) * 100;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              <div 
                className="w-full rounded-t-sm transition-all duration-500"
                style={{ 
                  height: `${height}%`,
                  backgroundColor: color,
                  opacity: 0.8,
                  minHeight: '4px'
                }}
              />
              <div className="ff-text-xs text-[var(--ff-text-muted)]">
                {index + 1}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)]" style={{ fontFamily: 'var(--ff-font-secondary)' }}>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 ff-fade-in-up">
          <Badge className="ff-badge-success mb-4">
            <BarChart3 className="w-4 h-4 mr-2" />
            Success Metrics & KPIs
          </Badge>
          
          <h1 className="ff-text-display">
            Business
            <span className="ff-text-gradient"> Intelligence</span>
          </h1>
          
          <p className="ff-text-body max-w-3xl mx-auto">
            Comprehensive KPI dashboard tracking Monthly Active Users, conversion rates, Net Promoter Score,
            feature adoption, system uptime, API performance, and business intelligence metrics.
          </p>
        </div>

        {/* Control Panel */}
        <Card className="ff-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="ff-text-title flex items-center gap-2">
                <Activity className="w-5 h-5 text-[var(--ff-success)]" />
                KPI Control Center
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="ff-text-sm text-[var(--ff-text-muted)]">Timeframe:</span>
                  <select 
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                    className="ff-input bg-[var(--ff-surface)] border border-[var(--border)] rounded px-3 py-1 text-sm"
                  >
                    <option value="24h">24 Hours</option>
                    <option value="7d">7 Days</option>
                    <option value="30d">30 Days</option>
                    <option value="90d">90 Days</option>
                  </select>
                </div>
                <Button
                  onClick={() => setIsLiveMode(!isLiveMode)}
                  size="sm"
                  className={isLiveMode ? 'ff-btn-success' : 'ff-btn-secondary'}
                >
                  {isLiveMode ? <PauseCircle className="w-4 h-4 mr-2" /> : <PlayCircle className="w-4 h-4 mr-2" />}
                  {isLiveMode ? 'Live' : 'Paused'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-success)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-[var(--ff-success)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  8/8
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">KPIs Above Target</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-primary)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-[var(--ff-primary)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  24.9K
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Monthly Active Users</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-secondary)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <DollarSign className="w-6 h-6 text-[var(--ff-secondary)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  17.2%
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Conversion Rate</div>
              </div>
              
              <div className="text-center p-4 bg-[var(--ff-surface)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--ff-accent)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="w-6 h-6 text-[var(--ff-accent)]" />
                </div>
                <div className="ff-text-2xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                  72
                </div>
                <div className="ff-text-sm text-[var(--ff-text-muted)]">Net Promoter Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main KPI Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 ff-stagger-fade">
          <KPICard
            title="Monthly Active Users"
            current={successMetrics.mau.current}
            target={successMetrics.mau.target}
            growth={successMetrics.mau.growth}
            trend={successMetrics.mau.trend}
            icon={Users}
            color="var(--ff-primary)"
          />
          
          <KPICard
            title="Conversion Rate"
            current={successMetrics.conversion.current}
            target={successMetrics.conversion.target}
            unit="%"
            growth={successMetrics.conversion.growth}
            trend={successMetrics.conversion.trend}
            icon={DollarSign}
            color="var(--ff-secondary)"
          />
          
          <KPICard
            title="Net Promoter Score"
            current={successMetrics.nps.current}
            target={successMetrics.nps.target}
            growth={successMetrics.nps.growth}
            trend={successMetrics.nps.trend}
            icon={Heart}
            color="var(--ff-accent)"
          />
          
          <KPICard
            title="Feature Adoption"
            current={successMetrics.featureAdoption.current}
            target={successMetrics.featureAdoption.target}
            unit="%"
            growth={successMetrics.featureAdoption.growth}
            trend={successMetrics.featureAdoption.trend}
            icon={Star}
            color="var(--ff-warning)"
          />
        </div>

        {/* Secondary KPI Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 ff-stagger-fade">
          <KPICard
            title="System Uptime"
            current={successMetrics.uptime.current}
            target={successMetrics.uptime.target}
            unit="%"
            growth={0}
            trend="stable"
            icon={Shield}
            color="var(--ff-success)"
          />
          
          <KPICard
            title="API Response Time"
            current={successMetrics.apiResponseTime.current}
            target={successMetrics.apiResponseTime.target}
            unit="ms"
            growth={successMetrics.apiResponseTime.improvement}
            trend="down"
            icon={Zap}
            color="var(--ff-secondary)"
          />
          
          <KPICard
            title="Error Rate"
            current={successMetrics.errorRate.current}
            target={successMetrics.errorRate.target}
            unit="%"
            growth={successMetrics.errorRate.improvement}
            trend="down"
            icon={AlertTriangle}
            color="var(--ff-error)"
          />
          
          <KPICard
            title="Performance Score"
            current={successMetrics.performanceScore.current}
            target={successMetrics.performanceScore.target}
            growth={successMetrics.performanceScore.improvement}
            trend="up"
            icon={Gauge}
            color="var(--ff-primary)"
          />
        </div>

        {/* Detailed Metrics Tabs */}
        <Card className="ff-card">
          <CardContent className="p-0">
            <Tabs defaultValue="growth" className="w-full">
              <div className="border-b border-[var(--border)]">
                <TabsList className="grid w-full grid-cols-4 bg-[var(--ff-surface)] rounded-none">
                  {kpiCategories.map((category) => (
                    <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                      <category.icon className="w-4 h-4" />
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {/* Growth & Engagement Tab */}
              <TabsContent value="growth" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="ff-text-title">Growth & Engagement Metrics</h3>
                  <Badge className="ff-badge-success">All Targets Met</Badge>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {/* MAU Breakdown */}
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">MAU Composition</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(successMetrics.mau.cohorts).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between">
                          <span className="ff-text-sm text-[var(--ff-text-secondary)] capitalize">{type}</span>
                          <span className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                            {count.toLocaleString()}
                          </span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-[var(--border)]">
                        <SimpleChart 
                          data={successMetrics.mau.historical} 
                          title="6-Month Trend" 
                          color="var(--ff-primary)"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Conversion Funnel */}
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">Conversion Funnel</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(successMetrics.conversion.funnel).map(([stage, count], index) => {
                        const total = successMetrics.conversion.funnel.visitors;
                        const percentage = (count / total) * 100;
                        
                        return (
                          <div key={stage} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="ff-text-sm text-[var(--ff-text-secondary)] capitalize">{stage}</span>
                              <div className="text-right">
                                <span className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                  {count.toLocaleString()}
                                </span>
                                <div className="ff-text-xs text-[var(--ff-text-muted)]">
                                  {percentage.toFixed(1)}%
                                </div>
                              </div>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                  
                  {/* Feature Adoption */}
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">Feature Usage</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(successMetrics.featureAdoption.features).map(([feature, rate]) => (
                        <div key={feature} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="ff-text-sm text-[var(--ff-text-secondary)]">{feature}</span>
                            <span className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                              {rate}%
                            </span>
                          </div>
                          <Progress value={rate} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Customer Satisfaction Tab */}
              <TabsContent value="satisfaction" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="ff-text-title">Customer Satisfaction Analysis</h3>
                  <Badge className="ff-badge-success">NPS: 72 (Excellent)</Badge>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">NPS Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-4 h-4 bg-[var(--ff-success)] rounded-full"></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="ff-text-sm text-[var(--ff-text-secondary)]">Promoters (9-10)</span>
                              <span className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                {successMetrics.nps.breakdown.promoters}%
                              </span>
                            </div>
                            <Progress value={successMetrics.nps.breakdown.promoters} className="h-2" />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="w-4 h-4 bg-[var(--ff-warning)] rounded-full"></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="ff-text-sm text-[var(--ff-text-secondary)]">Passives (7-8)</span>
                              <span className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                {successMetrics.nps.breakdown.passives}%
                              </span>
                            </div>
                            <Progress value={successMetrics.nps.breakdown.passives} className="h-2" />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="w-4 h-4 bg-[var(--ff-error)] rounded-full"></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="ff-text-sm text-[var(--ff-text-secondary)]">Detractors (0-6)</span>
                              <span className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                                {successMetrics.nps.breakdown.detractors}%
                              </span>
                            </div>
                            <Progress value={successMetrics.nps.breakdown.detractors} className="h-2" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-[var(--border)]">
                        <div className="text-center">
                          <div className="ff-text-3xl text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
                            {successMetrics.nps.current}
                          </div>
                          <div className="ff-text-sm text-[var(--ff-text-muted)]">Net Promoter Score</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">NPS Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SimpleChart 
                        data={successMetrics.nps.historical} 
                        title="6-Month NPS Evolution" 
                        color="var(--ff-accent)"
                      />
                      <div className="mt-4 p-3 bg-[var(--ff-surface)] rounded-lg">
                        <div className="flex items-center gap-2">
                          <ArrowUp className="w-4 h-4 text-[var(--ff-success)]" />
                          <span className="ff-text-sm text-[var(--ff-text-primary)]">
                            +{successMetrics.nps.growth}% improvement over 6 months
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* System Reliability Tab */}
              <TabsContent value="reliability" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="ff-text-title">System Reliability & Performance</h3>
                  <Badge className="ff-badge-success">99.97% Uptime</Badge>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Uptime by Region */}
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">Regional Uptime</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(successMetrics.uptime.regions).map(([region, uptime]) => (
                        <div key={region} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="ff-text-sm text-[var(--ff-text-secondary)]">{region}</span>
                            <span className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                              {uptime}%
                            </span>
                          </div>
                          <Progress value={uptime} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  
                  {/* API Response Times */}
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">API Endpoints</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(successMetrics.apiResponseTime.endpoints).map(([endpoint, time]) => (
                        <div key={endpoint} className="flex items-center justify-between">
                          <span className="ff-text-sm text-[var(--ff-text-secondary)]" style={{ fontFamily: 'var(--ff-font-mono)' }}>
                            {endpoint}
                          </span>
                          <div className="text-right">
                            <span className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                              {time}ms
                            </span>
                            <div className={`ff-text-xs ${time > 150 ? 'text-[var(--ff-warning)]' : 'text-[var(--ff-success)]'}`}>
                              {time > 150 ? 'Slow' : 'Good'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  
                  {/* Error Categories */}
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">Error Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(successMetrics.errorRate.categories).map(([category, rate]) => (
                        <div key={category} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="ff-text-sm text-[var(--ff-text-secondary)]">{category}</span>
                            <span className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                              {rate}%
                            </span>
                          </div>
                          <Progress value={rate * 20} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Performance Quality Tab */}
              <TabsContent value="performance" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="ff-text-title">Performance Quality Metrics</h3>
                  <Badge className="ff-badge-success">Score: 94/100</Badge>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">Performance Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(successMetrics.performanceScore.metrics).map(([metric, score]) => (
                        <div key={metric} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="ff-text-sm text-[var(--ff-text-secondary)] capitalize">
                              {metric.replace(/([A-Z])/g, ' $1')}
                            </span>
                            <span className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                              {score}/100
                            </span>
                          </div>
                          <Progress value={score} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle className="ff-text-base">Performance Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SimpleChart 
                        data={successMetrics.performanceScore.historical} 
                        title="6-Month Performance Evolution" 
                        color="var(--ff-primary)"
                      />
                      <div className="mt-4 p-3 bg-[var(--ff-surface)] rounded-lg">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-[var(--ff-success)]" />
                          <span className="ff-text-sm text-[var(--ff-text-primary)]">
                            +{successMetrics.performanceScore.improvement} points improvement
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SuccessMetricsDashboard;