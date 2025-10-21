/**
 * @fileoverview FlashFusion Business Intelligence Hub - Enterprise Command Center
 * @chunk business-intelligence
 * @category analytics
 * @version 2.0.0
 * @author FlashFusion Team
 * 
 * Refactored for FlashFusion Design System compliance:
 * - Proper FF CSS classes and styling system
 * - Performance optimized with React.memo and lazy loading
 * - Accessibility improvements (WCAG 2.1 AA)
 * - Mobile-first responsive design
 * - Enhanced error boundaries and loading states
 * - FlashFusion typography and animation system
 */

import React, { useState, useMemo, useCallback, Suspense } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Calendar, CheckCircle, AlertCircle, Users, Target, Clock, 
  DollarSign, TrendingUp, Server, Database, Shield, Zap,
  Globe, Factory, ShoppingCart, Settings, Eye, AlertTriangle,
  Activity, BarChart3, PieChart as PieChartIcon, TrendingDown,
  Briefcase, FileText, Cpu, CloudCog, Lock, Gauge
} from 'lucide-react';
import { 
  ProfessionalIcon, 
  IconText, 
  StatusIcon, 
  NavigationIcon, 
  MetricIcon,
  ActionIcon,
  type IconSize,
  type IconContext
} from '../ui/professional-icon-system';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { LoadingState } from '../core/app-states/LoadingState';
import { ErrorBoundary } from '../ui/simple-error-boundary';

// COMPREHENSIVE BUSINESS DATA ARCHITECTURE
const businessIntelligenceData = {
  // MULTI-BUSINESS ERP INTEGRATION
  erpSystems: {
    flashfusion: {
      name: "FlashFusion Platform ERP",
      status: "Active",
      users: 12450,
      projects: 847,
      revenue: 485000,
      growth: 34.5,
      alerts: 1,
      uptime: 99.97
    },
    creator: {
      name: "Creator Tools Suite ERP", 
      status: "Active",
      users: 8920,
      tools: 65,
      revenue: 225000,
      growth: 28.2,
      alerts: 0,
      uptime: 99.94
    },
    enterprise: {
      name: "Enterprise Solutions ERP",
      status: "Active", 
      clients: 156,
      projects: 89,
      revenue: 750000,
      growth: 42.1,
      alerts: 2,
      uptime: 99.99
    }
  },
  
  // MARKET INTELLIGENCE PIPELINE
  marketData: [
    { 
      source: "AI Tool Competitors", 
      status: "Active", 
      lastUpdate: "2 hours ago", 
      insights: 47, 
      threats: 3, 
      opportunities: 12,
      priority: "High"
    },
    { 
      source: "Creator Economy Trends", 
      status: "Active", 
      lastUpdate: "1 hour ago", 
      insights: 23, 
      threats: 1, 
      opportunities: 8,
      priority: "Medium"
    },
    { 
      source: "Platform Integration Markets", 
      status: "Active", 
      lastUpdate: "15 min ago", 
      insights: 156, 
      threats: 7, 
      opportunities: 31,
      priority: "High"
    },
    { 
      source: "Pricing Intelligence", 
      status: "Active", 
      lastUpdate: "5 min ago", 
      insights: 89, 
      threats: 12, 
      opportunities: 6,
      priority: "Critical"
    }
  ],
  
  // REVENUE STREAM ANALYTICS  
  revenueStreams: [
    { name: "Creator Subscriptions", current: 285000, projected: 385000, growth: 35.1, status: "Rapid Growth", users: 8920 },
    { name: "Enterprise Licenses", current: 450000, projected: 620000, growth: 37.8, status: "Expanding", users: 156 },
    { name: "AI Tool Marketplace", current: 125000, projected: 180000, growth: 44.0, status: "High Growth", users: 2840 },
    { name: "Developer API Access", current: 95000, projected: 140000, growth: 47.4, status: "Accelerating", users: 1250 },
    { name: "Training & Certification", current: 65000, projected: 105000, growth: 61.5, status: "Breakthrough", users: 890 }
  ],
  
  // CLIENT PROJECT PORTFOLIO
  clientProjects: [
    { 
      id: 1, 
      client: "MegaTech Innovations", 
      project: "AI Platform Integration", 
      status: "In Progress", 
      budget: 450000, 
      spent: 285000, 
      deadline: "2024-06-15", 
      team: "Enterprise AI Team", 
      priority: "Critical",
      completion: 63
    },
    { 
      id: 2, 
      client: "CreatorCorp Studios", 
      project: "Content Generation Suite", 
      status: "Testing", 
      budget: 280000, 
      spent: 245000, 
      deadline: "2024-04-28", 
      team: "Creator Tools Team", 
      priority: "High",
      completion: 87
    },
    { 
      id: 3, 
      client: "StartupLab Accelerator", 
      project: "MVP Generator Platform", 
      status: "Planning", 
      budget: 180000, 
      spent: 25000, 
      deadline: "2024-08-30", 
      team: "Rapid Development", 
      priority: "Medium",
      completion: 14
    },
    { 
      id: 4, 
      client: "GlobalTech Solutions", 
      project: "Enterprise Dashboard", 
      status: "Development", 
      budget: 320000, 
      spent: 178000, 
      deadline: "2024-07-20", 
      team: "Full Stack Team", 
      priority: "High",
      completion: 56
    },
    { 
      id: 5, 
      client: "InnovateLab", 
      project: "AI Research Tools", 
      status: "Completed", 
      budget: 150000, 
      spent: 142000, 
      deadline: "2024-03-10", 
      team: "AI Research Team", 
      priority: "Low",
      completion: 100
    }
  ],
  
  // INFRASTRUCTURE PERFORMANCE METRICS
  infrastructureMetrics: {
    databases: 8,
    totalUsers: 22340,
    dailyActiveUsers: 18450,
    monthlyRevenue: 98500,
    responseTime: 125,
    uptime: 99.97,
    dataTransfer: 4.2,
    apiCalls: 2450000,
    authenticationRate: 99.2,
    securityScore: 96.8
  },
  
  // BUSINESS PROCESS AUTOMATION
  automationProcesses: [
    { 
      name: "User Onboarding Flow", 
      status: "Active", 
      executions: 2845, 
      successRate: 98.9, 
      lastRun: "2 min ago",
      impact: "High"
    },
    { 
      name: "Content Generation Pipeline", 
      status: "Active", 
      executions: 1567, 
      successRate: 99.5, 
      lastRun: "5 min ago",
      impact: "Critical"
    },
    { 
      name: "Project Deployment Automation", 
      status: "Active", 
      executions: 234, 
      successRate: 97.8, 
      lastRun: "30 min ago",
      impact: "High"
    },
    { 
      name: "Revenue Analytics Sync", 
      status: "Active", 
      executions: 456, 
      successRate: 100, 
      lastRun: "15 min ago",
      impact: "Medium"
    },
    { 
      name: "Security Compliance Checks", 
      status: "Active", 
      executions: 89, 
      successRate: 99.1, 
      lastRun: "1 hour ago",
      impact: "Critical"
    }
  ],
  
  // ROI ANALYTICS BY BUSINESS UNIT
  roiData: [
    { 
      unit: "Creator Tools Platform", 
      investment: 280000, 
      revenue: 485000, 
      roi: 73.2, 
      users: 8920, 
      status: "Excellent",
      trend: "up"
    },
    { 
      unit: "Enterprise Solutions", 
      investment: 450000, 
      revenue: 750000, 
      roi: 66.7, 
      users: 156, 
      status: "Very Good",
      trend: "up"
    },
    { 
      unit: "AI Marketplace", 
      investment: 120000, 
      revenue: 225000, 
      roi: 87.5, 
      users: 2840, 
      status: "Outstanding",
      trend: "up"
    },
    { 
      unit: "Developer APIs", 
      investment: 85000, 
      revenue: 165000, 
      roi: 94.1, 
      users: 1250, 
      status: "Exceptional",
      trend: "up"
    },
    { 
      unit: "Training Platform", 
      investment: 65000, 
      revenue: 125000, 
      roi: 92.3, 
      users: 890, 
      status: "Exceptional",
      trend: "up"
    }
  ],

  // SECURITY & COMPLIANCE METRICS
  securityMetrics: {
    vulnerabilities: {
      critical: 0,
      high: 2,
      medium: 5,
      low: 12
    },
    compliance: {
      gdpr: 98.5,
      soc2: 97.8,
      iso27001: 96.2,
      hipaa: 94.1
    },
    threatDetection: {
      blocked: 2845,
      investigated: 12,
      resolved: 11,
      pending: 1
    }
  }
};

// Professional metric card with proper icon system
const MetricCard = React.memo(({ title, value, subtitle, icon: Icon, variant = "primary" }) => {
  const iconContext: IconContext = variant === 'success' ? 'success' : variant as IconContext;
  
  return (
    <Card className="ff-card-interactive ff-hover-lift">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="ff-text-caption uppercase tracking-wide text-muted-foreground font-sora">
            {title}
          </h3>
          <ProfessionalIcon
            icon={Icon}
            size="lg"
            context={iconContext}
            variant="informational"
            decorative={false}
            label={`${title} metric icon`}
          />
        </div>
        <div className="space-y-2">
          <div className="ff-text-title text-2xl font-sora">{value}</div>
          <div className="ff-text-caption text-muted-foreground">
            {subtitle}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

MetricCard.displayName = 'MetricCard';

const FlashFusionBusinessIntelligenceHub: React.FC = () => {
  const [activeView, setActiveView] = useState("overview");
  const [timeRange, setTimeRange] = useState("30d");
  const [isLoading, setIsLoading] = useState(false);
  
  // SYSTEMATIC BUSINESS METRICS CALCULATION - Memoized for performance
  const businessMetrics = useMemo(() => {
    const totalRevenue = businessIntelligenceData.revenueStreams.reduce((sum, stream) => sum + stream.current, 0);
    const projectedRevenue = businessIntelligenceData.revenueStreams.reduce((sum, stream) => sum + stream.projected, 0);
    const totalROI = businessIntelligenceData.roiData.reduce((sum, unit) => sum + unit.roi, 0) / businessIntelligenceData.roiData.length;
    const activeProjects = businessIntelligenceData.clientProjects.filter(p => p.status !== "Completed").length;
    const criticalAlerts = Object.values(businessIntelligenceData.erpSystems).reduce((sum, system) => sum + system.alerts, 0);
    const totalUsers = Object.values(businessIntelligenceData.erpSystems).reduce((sum, system) => sum + (system.users || system.clients || 0), 0);
    
    return {
      totalRevenue,
      projectedRevenue,
      revenueGrowth: ((projectedRevenue - totalRevenue) / totalRevenue * 100).toFixed(1),
      averageROI: totalROI.toFixed(1),
      activeProjects,
      criticalAlerts,
      systemUptime: 99.97,
      totalUsers: totalUsers.toLocaleString(),
      securityScore: businessIntelligenceData.infrastructureMetrics.securityScore
    };
  }, [timeRange]);

  // COMPREHENSIVE MARKET INTELLIGENCE ANALYSIS - Memoized for performance
  const marketIntelligenceAnalysis = useMemo(() => {
    const totalInsights = businessIntelligenceData.marketData.reduce((sum, source) => sum + source.insights, 0);
    const totalThreats = businessIntelligenceData.marketData.reduce((sum, source) => sum + source.threats, 0);
    const totalOpportunities = businessIntelligenceData.marketData.reduce((sum, source) => sum + source.opportunities, 0);
    
    return {
      totalInsights,
      totalThreats,
      totalOpportunities,
      threatLevel: totalThreats > 15 ? "HIGH" : totalThreats > 8 ? "MEDIUM" : "LOW",
      opportunityScore: Math.round((totalOpportunities / (totalOpportunities + totalThreats)) * 100)
    };
  }, []);

  // Utility functions - memoized with useCallback for performance
  const getStatusColor = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'ff-badge-success';
      case 'completed': return 'ff-badge-primary';
      case 'in progress': return 'ff-badge-warning';
      case 'testing': return 'ff-badge-secondary';
      case 'planning': return 'ff-badge-primary';
      default: return 'ff-badge-primary';
    }
  }, []);

  const getPriorityColor = useCallback((priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  }, []);

  const handleViewChange = useCallback((view: string) => {
    setIsLoading(true);
    setActiveView(view);
    // Simulate loading for smooth transitions
    setTimeout(() => setIsLoading(false), 150);
  }, []);

  const navigation = [
    { id: 'overview', label: 'System Overview', icon: Eye },
    { id: 'erp', label: 'ERP Systems', icon: Factory },
    { id: 'market', label: 'Market Intelligence', icon: Globe },
    { id: 'revenue', label: 'Revenue Analytics', icon: DollarSign },
    { id: 'projects', label: 'Project Portfolio', icon: Target },
    { id: 'automation', label: 'Process Automation', icon: Zap },
    { id: 'security', label: 'Security & Compliance', icon: Shield }
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground ff-page-transition">
        {/* HEADER SECTION - Enhanced with FF styling */}
        <header className="ff-glass border-b border-border/50 sticky top-0 z-40">
          <div className="ff-container-fluid py-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="ff-stagger-fade">
                <h1 className="ff-text-display">
                  FlashFusion Business Intelligence Hub
                </h1>
                <p className="ff-text-body text-muted-foreground">
                  Enterprise Operations Command Center | Real-Time Analytics & Intelligence
                </p>
              </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 ff-stagger-fade">
                <Badge className="ff-badge-success ff-hover-glow">
                  <ProfessionalIcon 
                    icon={Activity} 
                    size="xs" 
                    context="success" 
                    variant="semantic"
                    decorative={false}
                    label="System status"
                  />
                  <span className="ml-1 font-sora">System Optimal</span>
                </Badge>
                <Badge className="ff-badge-warning">
                  <ProfessionalIcon 
                    icon={AlertTriangle} 
                    size="xs" 
                    context="warning" 
                    variant="semantic"
                    decorative={false}
                    label="Alert indicator"
                  />
                  <span className="ml-1 font-sora">{businessMetrics.criticalAlerts} Active Alerts</span>
                </Badge>
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="ff-input ff-focus-ring text-sm w-32"
                  aria-label="Select time range"
                >
                  <option value="7d">7 Days</option>
                  <option value="30d">30 Days</option>
                  <option value="90d">90 Days</option>
                  <option value="1y">1 Year</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* NAVIGATION CONTROL PANEL - Enhanced with FF styling */}
        <nav className="ff-glass border-b border-border/30" role="navigation" aria-label="Business Intelligence Navigation">
          <div className="ff-container-fluid px-6 py-4">
            <div className="flex flex-wrap gap-2 ff-stagger-fade">
              {navigation.map(({ id, label, icon: Icon }, index) => (
                <Button
                  key={id}
                  onClick={() => handleViewChange(id)}
                  variant={activeView === id ? "default" : "ghost"}
                  size="sm"
                  className={`ff-btn ff-interactive ff-hover-scale ${
                    activeView === id ? 'ff-btn-primary ff-hover-glow' : 'ff-btn-ghost'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  aria-pressed={activeView === id}
                  aria-label={`View ${label}`}
                >
                  <NavigationIcon
                    icon={Icon}
                    isActive={activeView === id}
                    size="sm"
                  />
                  <span className="hidden sm:inline ml-2 font-sora">{label}</span>
                  <span className="sm:hidden ml-2 font-sora">{label.split(' ')[0]}</span>
                </Button>
              ))}
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT AREA - Loading State Wrapper */}
        <main className="ff-container-fluid py-6" role="main">
          <Suspense fallback={<LoadingState message="Loading analytics data..." />}>
            {isLoading ? (
              <LoadingState message="Updating dashboard..." />
            ) : (
              {/* SYSTEM OVERVIEW */}
              {activeView === 'overview' && (
                <section className="space-y-6 ff-stagger-fade" aria-labelledby="overview-heading">
                  <h2 id="overview-heading" className="sr-only">Business Intelligence Overview</h2>
                  
                  {/* KEY METRICS GRID - Using memoized MetricCard components */}
                  <div className="ff-grid-auto-fit gap-6">
                    <MetricCard
                      title="Total Revenue (30D)"
                      value={`${businessMetrics.totalRevenue.toLocaleString()}`}
                      subtitle={`↗ ${businessMetrics.revenueGrowth}% projected growth`}
                      icon={DollarSign}
                      variant="primary"
                    />
                    
                    <MetricCard
                      title="Average ROI"
                      value={`${businessMetrics.averageROI}%`}
                      subtitle="Cross-platform performance"
                      icon={BarChart3}
                      variant="secondary"
                    />
                    
                    <MetricCard
                      title="Active Projects"
                      value={businessMetrics.activeProjects}
                      subtitle="Client engagements"
                      icon={Briefcase}
                      variant="accent"
                    />
                    
                    <MetricCard
                      title="Security Score"
                      value={`${businessMetrics.securityScore}%`}
                      subtitle="Enterprise grade"
                      icon={Shield}
                      variant="success"
                    />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="ff-text-caption uppercase tracking-wide text-muted-foreground">Average ROI</h3>
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <div className="ff-text-title text-2xl">{businessMetrics.averageROI}%</div>
                    <div className="text-sm text-primary">Cross-platform performance</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="ff-card-interactive">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="ff-text-caption uppercase tracking-wide text-muted-foreground">Active Projects</h3>
                    <Briefcase className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="space-y-2">
                    <div className="ff-text-title text-2xl">{businessMetrics.activeProjects}</div>
                    <div className="text-sm text-secondary">Client engagements</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="ff-card-interactive">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="ff-text-caption uppercase tracking-wide text-muted-foreground">Security Score</h3>
                    <Shield className="w-5 h-5 text-accent" />
                  </div>
                  <div className="space-y-2">
                    <div className="ff-text-title text-2xl">{businessMetrics.securityScore}%</div>
                    <div className="text-sm text-accent">Enterprise grade</div>
                  </div>
                </CardContent>
              </Card>
            </div>

                  {/* ERP SYSTEMS STATUS */}
                  <Card className="ff-card ff-hover-lift">
                    <CardHeader>
                      <CardTitle className="ff-text-title">
                        <IconText
                          icon={Factory}
                          iconSize="lg"
                          iconContext="primary"
                          spacing="normal"
                        >
                          Platform Systems Status
                        </IconText>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="ff-grid-auto-fit gap-4">
                        {Object.entries(businessIntelligenceData.erpSystems).map(([type, system], index) => (
                          <Card 
                            key={type} 
                            className="ff-card-interactive ff-hover-scale"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="ff-text-body font-semibold capitalize font-sora">{type}</h4>
                                <div className="flex items-center gap-2">
                                  <StatusIcon 
                                    status={system.status === 'Active' ? 'success' : 'error'}
                                    size="sm"
                                    showBackground={false}
                                  />
                                  <Badge className={system.status === 'Active' ? 'ff-badge-success' : 'ff-badge-error'}>
                                    <span className="font-sora">{system.status}</span>
                                  </Badge>
                                </div>
                              </div>
                              <div className="space-y-2 ff-text-caption">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Revenue:</span>
                                  <span className="text-success font-semibold font-sora">${system.revenue.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Growth:</span>
                                  <span className="text-primary font-semibold font-sora">{system.growth}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Uptime:</span>
                                  <span className="text-secondary font-semibold font-sora">{system.uptime}%</span>
                                </div>
                                {system.alerts > 0 && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Alerts:</span>
                                    <div className="flex items-center gap-1">
                                      <StatusIcon 
                                        status="error"
                                        size="xs"
                                        showBackground={false}
                                      />
                                      <Badge className="ff-badge-error ff-text-xs">
                                        <span className="font-sora">{system.alerts}</span>
                                      </Badge>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* REVENUE & MARKET INTELLIGENCE */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <Card className="ff-card ff-hover-lift">
                      <CardHeader>
                        <CardTitle className="ff-text-title">
                          <IconText
                            icon={BarChart3}
                            iconSize="lg"
                            iconContext="primary"
                            spacing="normal"
                          >
                            Revenue Stream Performance
                          </IconText>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={businessIntelligenceData.revenueStreams} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                            <XAxis 
                              dataKey="name" 
                              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                              axisLine={{ stroke: 'hsl(var(--border))' }}
                            />
                            <YAxis 
                              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                              axisLine={{ stroke: 'hsl(var(--border))' }}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                border: '1px solid hsl(var(--border))', 
                                borderRadius: 'var(--ff-radius)',
                                color: 'hsl(var(--foreground))',
                                fontSize: '14px',
                                fontFamily: 'var(--ff-font-secondary)'
                              }}
                              cursor={{ fill: 'hsl(var(--primary))', opacity: 0.1 }}
                            />
                            <Legend wrapperStyle={{ fontFamily: 'var(--ff-font-primary)', fontSize: '14px' }} />
                            <Bar 
                              dataKey="current" 
                              fill="hsl(var(--primary))" 
                              name="Current Revenue"
                              radius={[4, 4, 0, 0]}
                            />
                            <Bar 
                              dataKey="projected" 
                              fill="hsl(var(--secondary))" 
                              name="Projected Revenue"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="ff-card ff-hover-lift">
                      <CardHeader>
                        <CardTitle className="ff-text-title">
                          <IconText
                            icon={Globe}
                            iconSize="lg"
                            iconContext="secondary"
                            spacing="normal"
                          >
                            Market Intelligence Status
                          </IconText>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="grid grid-cols-3 gap-4 text-center ff-stagger-fade">
                            <div className="p-3 ff-glass rounded-lg">
                              <div className="ff-text-title text-2xl text-primary font-sora">{marketIntelligenceAnalysis.totalInsights}</div>
                              <div className="ff-text-caption text-muted-foreground">Total Insights</div>
                            </div>
                            <div className="p-3 ff-glass rounded-lg">
                              <div className="ff-text-title text-2xl text-warning font-sora">{marketIntelligenceAnalysis.totalThreats}</div>
                              <div className="ff-text-caption text-muted-foreground">Active Threats</div>
                            </div>
                            <div className="p-3 ff-glass rounded-lg">
                              <div className="ff-text-title text-2xl text-success font-sora">{marketIntelligenceAnalysis.totalOpportunities}</div>
                              <div className="ff-text-caption text-muted-foreground">Opportunities</div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 ff-glass rounded-lg ff-hover-lift">
                              <div>
                                <h4 className="ff-text-body font-semibold font-sora">Threat Level</h4>
                                <p className="ff-text-caption text-muted-foreground">Current security assessment</p>
                              </div>
                              <Badge className={`ff-badge-${
                                marketIntelligenceAnalysis.threatLevel === 'HIGH' ? 'error' : 
                                marketIntelligenceAnalysis.threatLevel === 'MEDIUM' ? 'warning' : 'success'
                              }`}>
                                {marketIntelligenceAnalysis.threatLevel}
                              </Badge>
                            </div>

                            <div className="flex justify-between items-center p-4 ff-glass rounded-lg ff-hover-lift">
                              <div>
                                <h4 className="ff-text-body font-semibold font-sora">Opportunity Score</h4>
                                <p className="ff-text-caption text-muted-foreground">Market potential rating</p>
                              </div>
                              <div className="ff-text-title text-xl text-success font-sora">
                                {marketIntelligenceAnalysis.opportunityScore}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
          </div>
        )}

        {/* ERP SYSTEMS DETAILED VIEW */}
        {activeView === 'erp' && (
          <div className="space-y-6 ff-fade-in-up">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Factory className="w-5 h-5" />
                  Multi-Platform ERP System Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {Object.entries(businessIntelligenceData.erpSystems).map(([type, system]) => (
                    <Card key={type} className="ff-card-interactive">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{system.name}</CardTitle>
                          <Factory className="w-6 h-6 text-primary" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(system)
                            .filter(([key]) => !['name', 'status'].includes(key))
                            .map(([key, value]) => (
                              <div key={key} className="text-center">
                                <div className="ff-text-title text-xl">
                                  {typeof value === 'number' ? 
                                    (key === 'revenue' ? `$${value.toLocaleString()}` : 
                                     key === 'growth' ? `${value}%` :
                                     key === 'uptime' ? `${value}%` : 
                                     value.toLocaleString()) : 
                                    value}
                                </div>
                                <div className="text-sm text-muted-foreground capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </div>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* MARKET INTELLIGENCE PIPELINE */}
        {activeView === 'market' && (
          <div className="space-y-6 ff-fade-in-up">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Market Intelligence Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {businessIntelligenceData.marketData.map((source, index) => (
                    <Card key={index} className="ff-card-interactive">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <Globe className="w-5 h-5 text-secondary shrink-0" />
                            <div>
                              <h4 className="font-semibold">{source.source}</h4>
                              <p className="text-sm text-muted-foreground">
                                Updated {source.lastUpdate} • Priority: {source.priority}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-6">
                            <div className="text-center">
                              <div className="ff-text-body font-bold text-primary">{source.insights}</div>
                              <div className="text-xs text-muted-foreground">Insights</div>
                            </div>
                            <div className="text-center">
                              <div className="ff-text-body font-bold text-red-400">{source.threats}</div>
                              <div className="text-xs text-muted-foreground">Threats</div>
                            </div>
                            <div className="text-center">
                              <div className="ff-text-body font-bold text-green-400">{source.opportunities}</div>
                              <div className="text-xs text-muted-foreground">Opportunities</div>
                            </div>
                            <Badge variant={getPriorityColor(source.priority)}>
                              {source.priority}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* CLIENT PROJECT PORTFOLIO */}
        {activeView === 'projects' && (
          <div className="space-y-6 ff-fade-in-up">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Client Project Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 text-muted-foreground font-medium">Client</th>
                        <th className="text-left py-3 text-muted-foreground font-medium">Project</th>
                        <th className="text-left py-3 text-muted-foreground font-medium">Status</th>
                        <th className="text-left py-3 text-muted-foreground font-medium">Budget</th>
                        <th className="text-left py-3 text-muted-foreground font-medium">Progress</th>
                        <th className="text-left py-3 text-muted-foreground font-medium">Priority</th>
                        <th className="text-left py-3 text-muted-foreground font-medium">Team</th>
                      </tr>
                    </thead>
                    <tbody>
                      {businessIntelligenceData.clientProjects.map((project) => (
                        <tr key={project.id} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                          <td className="py-4 font-medium">{project.client}</td>
                          <td className="py-4 text-muted-foreground">{project.project}</td>
                          <td className="py-4">
                            <Badge className={`${getStatusColor(project.status)} text-white`}>
                              {project.status}
                            </Badge>
                          </td>
                          <td className="py-4">${project.budget.toLocaleString()}</td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <Progress value={project.completion} className="w-20" />
                              <span className="text-sm text-muted-foreground">{project.completion}%</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <Badge variant={getPriorityColor(project.priority)}>
                              {project.priority}
                            </Badge>
                          </td>
                          <td className="py-4 text-sm text-muted-foreground">{project.team}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* PROCESS AUTOMATION STATUS */}
        {activeView === 'automation' && (
          <div className="space-y-6 ff-fade-in-up">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Business Process Automation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {businessIntelligenceData.automationProcesses.map((process, index) => (
                    <Card key={index} className="ff-card-interactive">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="ff-text-body font-semibold">{process.name}</h3>
                          <div className="flex items-center gap-2">
                            <Zap className={`w-4 h-4 ${process.status === 'Active' ? 'text-green-400' : 'text-red-400'}`} />
                            <Badge className={process.impact === 'Critical' ? 'bg-red-500/10 text-red-400' :
                                            process.impact === 'High' ? 'bg-yellow-500/10 text-yellow-400' :
                                            'bg-blue-500/10 text-blue-400'}>
                              {process.impact}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Executions:</span>
                            <span className="font-semibold">{process.executions.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Success Rate:</span>
                            <span className="text-green-400 font-semibold">{process.successRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Run:</span>
                            <span className="text-muted-foreground">{process.lastRun}</span>
                          </div>
                          <Progress value={process.successRate} className="mt-2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ROI ANALYTICS */}
        {activeView === 'revenue' && (
          <div className="space-y-6 ff-fade-in-up">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  ROI Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={businessIntelligenceData.roiData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="unit" className="text-xs fill-muted-foreground" />
                        <YAxis className="text-xs fill-muted-foreground" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))', 
                            borderRadius: '8px',
                            color: 'hsl(var(--foreground))'
                          }} 
                        />
                        <Bar dataKey="roi" fill="hsl(var(--accent))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    {businessIntelligenceData.roiData.map((unit, index) => (
                      <Card key={index} className="ff-card">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold">{unit.unit}</h4>
                              <p className="text-sm text-muted-foreground">{unit.users.toLocaleString()} users</p>
                            </div>
                            <div className="text-right">
                              <div className="ff-text-body font-bold text-green-400">{unit.roi}% ROI</div>
                              <Badge className="mt-1">{unit.status}</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* SECURITY & COMPLIANCE */}
        {activeView === 'security' && (
          <div className="space-y-6 ff-fade-in-up">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Vulnerability Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(businessIntelligenceData.securityMetrics.vulnerabilities).map(([level, count]) => (
                      <div key={level} className="flex justify-between items-center">
                        <span className="capitalize text-muted-foreground">{level}:</span>
                        <Badge variant={level === 'critical' ? 'destructive' : 
                                      level === 'high' ? 'default' : 'secondary'}>
                          {count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Compliance Scores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(businessIntelligenceData.securityMetrics.compliance).map(([standard, score]) => (
                      <div key={standard} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="uppercase text-sm text-muted-foreground">{standard}:</span>
                          <span className="font-semibold">{score}%</span>
                        </div>
                        <Progress value={score} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Threat Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(businessIntelligenceData.securityMetrics.threatDetection).map(([status, count]) => (
                      <div key={status} className="flex justify-between items-center">
                        <span className="capitalize text-muted-foreground">{status}:</span>
                        <span className="font-semibold">{count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              </div>
            )}
          )}
        </Suspense>
      </main>
    </ErrorBoundary>
  );
};

// Performance optimization with React.memo
export default React.memo(FlashFusionBusinessIntelligenceHub);