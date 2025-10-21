/**
 * @fileoverview Launch & Post-Launch Optimization Dashboard - Step 10 Implementation
 * @chunk launch
 * @category analytics
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Comprehensive launch execution and post-launch optimization system with
 * real-time analytics, user feedback collection, performance monitoring,
 * and continuous improvement recommendations.
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Rocket,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Star,
  DollarSign,
  Target,
  Zap,
  Award,
  Clock,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  MapPin,
  RefreshCw,
  Filter,
  Download,
  Share2,
  Bell,
  Settings,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  ExternalLink,
  Lightbulb,
  Flag,
  Gauge,
  ThumbsUp,
  ThumbsDown,
  Search,
  Play,
  Pause
} from 'lucide-react';

interface LaunchMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  category: 'user' | 'performance' | 'business' | 'technical';
}

interface UserFeedback {
  id: string;
  type: 'bug' | 'feature' | 'improvement' | 'praise' | 'complaint';
  title: string;
  description: string;
  rating: number;
  user: {
    id: string;
    name: string;
    plan: 'free' | 'pro' | 'enterprise';
  };
  timestamp: Date;
  status: 'new' | 'reviewing' | 'planned' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  votes: number;
}

interface LaunchPhase {
  id: string;
  name: string;
  status: 'completed' | 'active' | 'planned' | 'delayed';
  startDate: Date;
  endDate: Date;
  progress: number;
  metrics: string[];
  goals: string[];
}

interface OptimizationRecommendation {
  id: string;
  category: 'performance' | 'user-experience' | 'conversion' | 'retention' | 'growth';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  effort: 'low' | 'medium' | 'high';
  estimatedRoi: number;
  priority: number;
}

export function LaunchOptimizationDashboard() {
  const [metrics, setMetrics] = useState<LaunchMetric[]>([
    {
      id: 'daily-active-users',
      name: 'Daily Active Users',
      value: 1247,
      previousValue: 1089,
      target: 1500,
      unit: 'users',
      trend: 'up',
      category: 'user'
    },
    {
      id: 'conversion-rate',
      name: 'Trial to Paid Conversion',
      value: 12.5,
      previousValue: 10.8,
      target: 15.0,
      unit: '%',
      trend: 'up',
      category: 'business'
    },
    {
      id: 'response-time',
      name: 'Average Response Time',
      value: 245,
      previousValue: 289,
      target: 200,
      unit: 'ms',
      trend: 'up',
      category: 'performance'
    },
    {
      id: 'user-satisfaction',
      name: 'User Satisfaction Score',
      value: 4.7,
      previousValue: 4.5,
      target: 4.8,
      unit: '/5',
      trend: 'up',
      category: 'user'
    },
    {
      id: 'feature-adoption',
      name: 'New Feature Adoption',
      value: 34,
      previousValue: 28,
      target: 50,
      unit: '%',
      trend: 'up',
      category: 'user'
    },
    {
      id: 'error-rate',
      name: 'Error Rate',
      value: 0.8,
      previousValue: 1.2,
      target: 0.5,
      unit: '%',
      trend: 'up',
      category: 'technical'
    }
  ]);

  const [feedback, setFeedback] = useState<UserFeedback[]>([
    {
      id: 'fb-001',
      type: 'feature',
      title: 'Add dark mode support',
      description: 'Would love to have a dark theme option for better night-time usage',
      rating: 5,
      user: { id: 'u-001', name: 'Sarah Chen', plan: 'pro' },
      timestamp: new Date(Date.now() - 3600000),
      status: 'planned',
      priority: 'medium',
      votes: 47
    },
    {
      id: 'fb-002',
      type: 'bug',
      title: 'Image generation timeout',
      description: 'Sometimes image generation takes too long and times out',
      rating: 3,
      user: { id: 'u-002', name: 'Mike Johnson', plan: 'free' },
      timestamp: new Date(Date.now() - 7200000),
      status: 'in-progress',
      priority: 'high',
      votes: 23
    },
    {
      id: 'fb-003',
      type: 'praise',
      title: 'Amazing workflow builder!',
      description: 'The workflow builder saved me hours of development time. Fantastic feature!',
      rating: 5,
      user: { id: 'u-003', name: 'Alex Rivera', plan: 'enterprise' },
      timestamp: new Date(Date.now() - 14400000),
      status: 'resolved',
      priority: 'low',
      votes: 89
    }
  ]);

  const [launchPhases, setLaunchPhases] = useState<LaunchPhase[]>([
    {
      id: 'beta',
      name: 'Beta Testing',
      status: 'completed',
      startDate: new Date(Date.now() - 2592000000), // 30 days ago
      endDate: new Date(Date.now() - 1209600000), // 14 days ago
      progress: 100,
      metrics: ['user-feedback', 'bug-reports', 'feature-requests'],
      goals: ['100 beta users', 'Major bug fixes', 'Feature validation']
    },
    {
      id: 'soft-launch',
      name: 'Soft Launch',
      status: 'completed',
      startDate: new Date(Date.now() - 1209600000), // 14 days ago
      endDate: new Date(Date.now() - 604800000), // 7 days ago
      progress: 100,
      metrics: ['user-acquisition', 'performance', 'stability'],
      goals: ['500 users', 'Performance optimization', 'Stability improvements']
    },
    {
      id: 'public-launch',
      name: 'Public Launch',
      status: 'active',
      startDate: new Date(Date.now() - 604800000), // 7 days ago
      endDate: new Date(Date.now() + 604800000), // 7 days from now
      progress: 65,
      metrics: ['user-growth', 'conversion', 'engagement'],
      goals: ['1000 daily users', '10% conversion rate', 'Media coverage']
    },
    {
      id: 'growth',
      name: 'Growth Phase',
      status: 'planned',
      startDate: new Date(Date.now() + 604800000), // 7 days from now
      endDate: new Date(Date.now() + 2592000000), // 30 days from now
      progress: 0,
      metrics: ['viral-growth', 'retention', 'expansion'],
      goals: ['5000 daily users', 'Viral coefficient > 1.0', 'Enterprise customers']
    }
  ]);

  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([
    {
      id: 'rec-001',
      category: 'performance',
      title: 'Implement caching for AI generation results',
      description: 'Cache frequently requested AI generations to reduce response time and API costs',
      impact: 'high',
      effort: 'medium',
      estimatedRoi: 230,
      priority: 1
    },
    {
      id: 'rec-002',
      category: 'user-experience',
      title: 'Add onboarding tooltips for new users',
      description: 'Guide new users through key features with interactive tooltips',
      impact: 'medium',
      effort: 'low',
      estimatedRoi: 180,
      priority: 2
    },
    {
      id: 'rec-003',
      category: 'conversion',
      title: 'Implement usage-based upgrade prompts',
      description: 'Show upgrade prompts when users approach their plan limits',
      impact: 'high',
      effort: 'medium',
      estimatedRoi: 340,
      priority: 3
    }
  ]);

  const [selectedDateRange, setSelectedDateRange] = useState('7d');
  const [selectedMetricCategory, setSelectedMetricCategory] = useState('all');
  const [feedbackFilter, setFeedbackFilter] = useState('all');

  // Calculate trend percentage
  const calculateTrendPercentage = useCallback((current: number, previous: number): number => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }, []);

  // Filter metrics by category
  const filteredMetrics = useMemo(() => {
    if (selectedMetricCategory === 'all') return metrics;
    return metrics.filter(metric => metric.category === selectedMetricCategory);
  }, [metrics, selectedMetricCategory]);

  // Filter feedback
  const filteredFeedback = useMemo(() => {
    if (feedbackFilter === 'all') return feedback;
    return feedback.filter(item => item.type === feedbackFilter);
  }, [feedback, feedbackFilter]);

  // Generate launch insights
  const launchInsights = useMemo(() => {
    const insights = [];
    
    // User growth insight
    const userGrowth = calculateTrendPercentage(
      metrics.find(m => m.id === 'daily-active-users')?.value || 0,
      metrics.find(m => m.id === 'daily-active-users')?.previousValue || 0
    );
    
    if (userGrowth > 15) {
      insights.push({
        type: 'positive',
        title: 'Strong User Growth',
        description: `Daily active users increased by ${userGrowth.toFixed(1)}% this week`,
        action: 'Continue current marketing strategies'
      });
    }

    // Performance insight
    const responseTime = metrics.find(m => m.id === 'response-time')?.value || 0;
    if (responseTime > 300) {
      insights.push({
        type: 'warning',
        title: 'Performance Attention Needed',
        description: 'Response times are above optimal thresholds',
        action: 'Implement performance optimizations'
      });
    }

    // Conversion insight
    const conversionRate = metrics.find(m => m.id === 'conversion-rate')?.value || 0;
    if (conversionRate < 10) {
      insights.push({
        type: 'opportunity',
        title: 'Conversion Optimization Opportunity',
        description: 'Trial to paid conversion is below industry average',
        action: 'Review pricing and onboarding flow'
      });
    }

    return insights;
  }, [metrics, calculateTrendPercentage]);

  // Export analytics report
  const exportReport = useCallback(() => {
    const report = {
      generated: new Date().toISOString(),
      period: selectedDateRange,
      summary: {
        totalUsers: metrics.find(m => m.id === 'daily-active-users')?.value || 0,
        conversionRate: metrics.find(m => m.id === 'conversion-rate')?.value || 0,
        satisfaction: metrics.find(m => m.id === 'user-satisfaction')?.value || 0,
        performance: metrics.find(m => m.id === 'response-time')?.value || 0
      },
      metrics: filteredMetrics,
      feedback: {
        total: feedback.length,
        byType: {
          bugs: feedback.filter(f => f.type === 'bug').length,
          features: feedback.filter(f => f.type === 'feature').length,
          praise: feedback.filter(f => f.type === 'praise').length
        }
      },
      recommendations: recommendations.slice(0, 5),
      insights: launchInsights
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flashfusion-launch-report-${selectedDateRange}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [filteredMetrics, feedback, recommendations, launchInsights, selectedDateRange]);

  return (
    <div className="space-y-6" style={{ fontFamily: 'var(--ff-font-secondary)' }}>
      <Card className="bg-[var(--ff-surface)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)' }}>
            <Rocket className="w-6 h-6 text-[var(--ff-primary)]" />
            Launch & Optimization Dashboard
          </CardTitle>
          <CardDescription className="text-[var(--ff-text-secondary)]">
            Real-time launch analytics, user feedback analysis, and continuous optimization recommendations for post-launch success.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Quick Actions & Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
              <SelectTrigger className="w-32 bg-[var(--input-background)] border-[var(--border)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedMetricCategory} onValueChange={setSelectedMetricCategory}>
              <SelectTrigger className="w-40 bg-[var(--input-background)] border-[var(--border)]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="user">User Metrics</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={exportReport} variant="outline" className="border-[var(--border)]">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>

            <Button variant="outline" className="border-[var(--border)]">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="metrics" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Metrics
              </TabsTrigger>
              <TabsTrigger value="feedback" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Feedback
              </TabsTrigger>
              <TabsTrigger value="phases" className="flex items-center gap-2">
                <Flag className="w-4 h-4" />
                Launch Phases
              </TabsTrigger>
              <TabsTrigger value="optimization" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Optimization
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Alert className="border-[var(--ff-primary)] bg-[var(--ff-primary)]/10">
                <Activity className="h-4 w-4 text-[var(--ff-primary)]" />
                <AlertDescription className="text-[var(--ff-text-secondary)]">
                  <strong className="text-[var(--ff-primary)]">Launch Status:</strong> Public launch is 65% complete with strong user adoption and positive feedback trends.
                </AlertDescription>
              </Alert>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredMetrics.slice(0, 4).map((metric) => {
                  const trendPercentage = calculateTrendPercentage(metric.value, metric.previousValue);
                  const isPositive = metric.id === 'error-rate' ? trendPercentage < 0 : trendPercentage > 0;
                  
                  return (
                    <Card key={metric.id} className="bg-[var(--ff-surface-light)] border-[var(--border)]">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {metric.category === 'user' && <Users className="w-4 h-4 text-[var(--ff-primary)]" />}
                            {metric.category === 'performance' && <Gauge className="w-4 h-4 text-[var(--ff-secondary)]" />}
                            {metric.category === 'business' && <DollarSign className="w-4 h-4 text-[var(--ff-accent)]" />}
                            {metric.category === 'technical' && <Activity className="w-4 h-4 text-[var(--ff-warning)]" />}
                            <span className="text-xs text-[var(--ff-text-muted)] uppercase tracking-wide">
                              {metric.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {isPositive ? (
                              <ArrowUp className="w-3 h-3 text-[var(--ff-success)]" />
                            ) : trendPercentage < 0 ? (
                              <ArrowDown className="w-3 h-3 text-[var(--ff-error)]" />
                            ) : (
                              <Minus className="w-3 h-3 text-[var(--ff-text-muted)]" />
                            )}
                            <span className={`text-xs ${
                              isPositive ? 'text-[var(--ff-success)]' : 
                              trendPercentage < 0 ? 'text-[var(--ff-error)]' : 
                              'text-[var(--ff-text-muted)]'
                            }`}>
                              {Math.abs(trendPercentage).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-[var(--ff-text-primary)]">
                              {metric.value.toLocaleString()}
                            </span>
                            <span className="text-sm text-[var(--ff-text-muted)]">
                              {metric.unit}
                            </span>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-[var(--ff-text-muted)]">Target: {metric.target.toLocaleString()}</span>
                              <span className="text-[var(--ff-text-muted)]">
                                {((metric.value / metric.target) * 100).toFixed(0)}%
                              </span>
                            </div>
                            <Progress 
                              value={Math.min((metric.value / metric.target) * 100, 100)} 
                              className="h-1"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Launch Insights */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[var(--ff-text-primary)]">Launch Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {launchInsights.map((insight, index) => (
                    <Card key={index} className="bg-[var(--ff-surface)] border-[var(--border)]">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {insight.type === 'positive' && <CheckCircle className="w-4 h-4 text-[var(--ff-success)]" />}
                            {insight.type === 'warning' && <AlertTriangle className="w-4 h-4 text-[var(--ff-warning)]" />}
                            {insight.type === 'opportunity' && <Lightbulb className="w-4 h-4 text-[var(--ff-primary)]" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-[var(--ff-text-primary)] mb-1">
                              {insight.title}
                            </h4>
                            <p className="text-xs text-[var(--ff-text-secondary)] mb-2">
                              {insight.description}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {insight.action}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <Card className="bg-[var(--ff-surface)] border-[var(--border)]">
                <CardHeader>
                  <CardTitle className="text-[var(--ff-text-primary)]">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-48">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <TrendingUp className="w-4 h-4 text-[var(--ff-success)]" />
                        <span className="text-[var(--ff-text-primary)]">Daily active users increased by 14.5%</span>
                        <span className="text-[var(--ff-text-muted)]">2 hours ago</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Star className="w-4 h-4 text-[var(--ff-warning)]" />
                        <span className="text-[var(--ff-text-primary)]">New 5-star review: "Game-changing platform!"</span>
                        <span className="text-[var(--ff-text-muted)]">4 hours ago</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Users className="w-4 h-4 text-[var(--ff-primary)]" />
                        <span className="text-[var(--ff-text-primary)]">50 new user signups in the last hour</span>
                        <span className="text-[var(--ff-text-muted)]">1 hour ago</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Gauge className="w-4 h-4 text-[var(--ff-secondary)]" />
                        <span className="text-[var(--ff-text-primary)]">Average response time improved to 245ms</span>
                        <span className="text-[var(--ff-text-muted)]">6 hours ago</span>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-6">
              <Alert className="border-[var(--ff-secondary)] bg-[var(--ff-secondary)]/10">
                <BarChart3 className="h-4 w-4 text-[var(--ff-secondary)]" />
                <AlertDescription className="text-[var(--ff-text-secondary)]">
                  <strong className="text-[var(--ff-secondary)]">Performance Metrics:</strong> Track key performance indicators across user engagement, technical performance, and business metrics.
                </AlertDescription>
              </Alert>

              {/* Detailed Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMetrics.map((metric) => {
                  const trendPercentage = calculateTrendPercentage(metric.value, metric.previousValue);
                  const isPositive = metric.id === 'error-rate' ? trendPercentage < 0 : trendPercentage > 0;
                  const progressToTarget = Math.min((metric.value / metric.target) * 100, 100);
                  
                  return (
                    <Card key={metric.id} className="bg-[var(--ff-surface-light)] border-[var(--border)]">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-[var(--ff-text-primary)]">
                              {metric.name}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {metric.category}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-baseline gap-2">
                              <span className="text-3xl font-bold text-[var(--ff-text-primary)]">
                                {metric.value.toLocaleString()}
                              </span>
                              <span className="text-sm text-[var(--ff-text-muted)]">
                                {metric.unit}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {isPositive ? (
                                <ArrowUp className="w-3 h-3 text-[var(--ff-success)]" />
                              ) : trendPercentage < 0 ? (
                                <ArrowDown className="w-3 h-3 text-[var(--ff-error)]" />
                              ) : (
                                <Minus className="w-3 h-3 text-[var(--ff-text-muted)]" />
                              )}
                              <span className={`text-sm ${
                                isPositive ? 'text-[var(--ff-success)]' : 
                                trendPercentage < 0 ? 'text-[var(--ff-error)]' : 
                                'text-[var(--ff-text-muted)]'
                              }`}>
                                {Math.abs(trendPercentage).toFixed(1)}% vs previous period
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-[var(--ff-text-muted)]">
                                Target: {metric.target.toLocaleString()} {metric.unit}
                              </span>
                              <span className="text-[var(--ff-text-primary)]">
                                {progressToTarget.toFixed(0)}%
                              </span>
                            </div>
                            <Progress value={progressToTarget} className="h-2" />
                          </div>

                          <div className="text-xs text-[var(--ff-text-muted)]">
                            Previous: {metric.previousValue.toLocaleString()} {metric.unit}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="feedback" className="space-y-6">
              <Alert className="border-[var(--ff-accent)] bg-[var(--ff-accent)]/10">
                <MessageCircle className="h-4 w-4 text-[var(--ff-accent)]" />
                <AlertDescription className="text-[var(--ff-text-secondary)]">
                  <strong className="text-[var(--ff-accent)]">User Feedback:</strong> Monitor and analyze user feedback to drive product improvements and feature development.
                </AlertDescription>
              </Alert>

              {/* Feedback Filters */}
              <div className="flex items-center gap-4">
                <Select value={feedbackFilter} onValueChange={setFeedbackFilter}>
                  <SelectTrigger className="w-40 bg-[var(--input-background)] border-[var(--border)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Feedback</SelectItem>
                    <SelectItem value="bug">Bug Reports</SelectItem>
                    <SelectItem value="feature">Feature Requests</SelectItem>
                    <SelectItem value="improvement">Improvements</SelectItem>
                    <SelectItem value="praise">Praise</SelectItem>
                    <SelectItem value="complaint">Complaints</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2 text-sm text-[var(--ff-text-muted)]">
                  <span>Total: {filteredFeedback.length}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span>Avg Rating: {(feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)}/5</span>
                </div>
              </div>

              {/* Feedback Summary */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {['bug', 'feature', 'improvement', 'praise', 'complaint'].map((type) => {
                  const count = feedback.filter(f => f.type === type).length;
                  const percentage = ((count / feedback.length) * 100).toFixed(0);
                  
                  return (
                    <Card key={type} className="bg-[var(--ff-surface-light)] border-[var(--border)]">
                      <CardContent className="p-4 text-center">
                        <div className="space-y-2">
                          <div className="flex justify-center">
                            {type === 'bug' && <AlertTriangle className="w-5 h-5 text-[var(--ff-error)]" />}
                            {type === 'feature' && <Lightbulb className="w-5 h-5 text-[var(--ff-primary)]" />}
                            {type === 'improvement' && <TrendingUp className="w-5 h-5 text-[var(--ff-secondary)]" />}
                            {type === 'praise' && <ThumbsUp className="w-5 h-5 text-[var(--ff-success)]" />}
                            {type === 'complaint' && <ThumbsDown className="w-5 h-5 text-[var(--ff-warning)]" />}
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-[var(--ff-text-primary)]">{count}</p>
                            <p className="text-xs text-[var(--ff-text-muted)] capitalize">{type}s</p>
                            <p className="text-xs text-[var(--ff-text-muted)]">{percentage}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Feedback List */}
              <div className="space-y-4">
                {filteredFeedback.map((item) => (
                  <Card key={item.id} className="bg-[var(--ff-surface)] border-[var(--border)]">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {item.type === 'bug' && <AlertTriangle className="w-4 h-4 text-[var(--ff-error)]" />}
                            {item.type === 'feature' && <Lightbulb className="w-4 h-4 text-[var(--ff-primary)]" />}
                            {item.type === 'improvement' && <TrendingUp className="w-4 h-4 text-[var(--ff-secondary)]" />}
                            {item.type === 'praise' && <ThumbsUp className="w-4 h-4 text-[var(--ff-success)]" />}
                            {item.type === 'complaint' && <ThumbsDown className="w-4 h-4 text-[var(--ff-warning)]" />}
                            
                            <div>
                              <h4 className="font-semibold text-[var(--ff-text-primary)]">{item.title}</h4>
                              <div className="flex items-center gap-2 text-sm text-[var(--ff-text-muted)]">
                                <span>{item.user.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {item.user.plan}
                                </Badge>
                                <span>{item.timestamp.toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3 h-3 ${i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <Badge 
                              variant={
                                item.status === 'resolved' ? 'default' : 
                                item.status === 'in-progress' ? 'secondary' : 
                                'outline'
                              }
                              className={
                                item.status === 'resolved' ? 'bg-[var(--ff-success)] text-white' :
                                item.status === 'in-progress' ? 'bg-[var(--ff-warning)] text-white' :
                                ''
                              }
                            >
                              {item.status}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-sm text-[var(--ff-text-secondary)]">{item.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-[var(--ff-text-muted)]">
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              <span>{item.votes} votes</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {item.priority} priority
                            </Badge>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              Reply
                            </Button>
                            <Button size="sm" variant="outline">
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="phases" className="space-y-6">
              <Alert className="border-[var(--ff-warning)] bg-[var(--ff-warning)]/10">
                <Flag className="h-4 w-4 text-[var(--ff-warning)]" />
                <AlertDescription className="text-[var(--ff-text-secondary)]">
                  <strong className="text-[var(--ff-warning)]">Launch Phases:</strong> Track progress through beta testing, soft launch, public launch, and growth phases with detailed metrics and goals.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {launchPhases.map((phase, index) => (
                  <Card key={phase.id} className="bg-[var(--ff-surface)] border-[var(--border)]">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {phase.status === 'completed' && <CheckCircle className="w-5 h-5 text-[var(--ff-success)]" />}
                              {phase.status === 'active' && <Play className="w-5 h-5 text-[var(--ff-primary)]" />}
                              {phase.status === 'planned' && <Clock className="w-5 h-5 text-[var(--ff-text-muted)]" />}
                              {phase.status === 'delayed' && <AlertTriangle className="w-5 h-5 text-[var(--ff-warning)]" />}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-[var(--ff-text-primary)]">{phase.name}</h3>
                              <div className="flex items-center gap-4 text-sm text-[var(--ff-text-muted)]">
                                <span>{phase.startDate.toLocaleDateString()} - {phase.endDate.toLocaleDateString()}</span>
                                <Badge variant={
                                  phase.status === 'completed' ? 'default' :
                                  phase.status === 'active' ? 'secondary' :
                                  'outline'
                                }>
                                  {phase.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-2xl font-bold text-[var(--ff-text-primary)]">{phase.progress}%</p>
                            <p className="text-sm text-[var(--ff-text-muted)]">Complete</p>
                          </div>
                        </div>

                        <Progress value={phase.progress} className="h-2" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-semibold text-[var(--ff-text-primary)] mb-2">Key Metrics</h4>
                            <div className="space-y-1">
                              {phase.metrics.map((metric, metricIndex) => (
                                <div key={metricIndex} className="flex items-center gap-2 text-sm">
                                  <BarChart3 className="w-3 h-3 text-[var(--ff-secondary)]" />
                                  <span className="text-[var(--ff-text-secondary)]">{metric.replace('-', ' ')}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold text-[var(--ff-text-primary)] mb-2">Goals</h4>
                            <div className="space-y-1">
                              {phase.goals.map((goal, goalIndex) => (
                                <div key={goalIndex} className="flex items-center gap-2 text-sm">
                                  <Target className="w-3 h-3 text-[var(--ff-accent)]" />
                                  <span className="text-[var(--ff-text-secondary)]">{goal}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="optimization" className="space-y-6">
              <Alert className="border-[var(--ff-success)] bg-[var(--ff-success)]/10">
                <Lightbulb className="h-4 w-4 text-[var(--ff-success)]" />
                <AlertDescription className="text-[var(--ff-text-secondary)]">
                  <strong className="text-[var(--ff-success)]">Optimization Recommendations:</strong> AI-powered insights and actionable recommendations to improve performance, user experience, and business metrics.
                </AlertDescription>
              </Alert>

              {/* Priority Recommendations */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[var(--ff-text-primary)]">Priority Recommendations</h3>
                
                {recommendations.map((rec, index) => (
                  <Card key={rec.id} className="bg-[var(--ff-surface)] border-[var(--border)]">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                rec.priority === 1 ? 'bg-[var(--ff-error)]' :
                                rec.priority === 2 ? 'bg-[var(--ff-warning)]' :
                                'bg-[var(--ff-secondary)]'
                              }`}>
                                {rec.priority}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-[var(--ff-text-primary)] mb-1">{rec.title}</h4>
                              <p className="text-sm text-[var(--ff-text-secondary)] mb-3">{rec.description}</p>
                              
                              <div className="flex items-center gap-4">
                                <Badge variant="outline" className="text-xs">
                                  {rec.category.replace('-', ' ')}
                                </Badge>
                                <div className="flex items-center gap-2 text-xs text-[var(--ff-text-muted)]">
                                  <span>Impact: {rec.impact}</span>
                                  <span>•</span>
                                  <span>Effort: {rec.effort}</span>
                                  <span>•</span>
                                  <span>ROI: {rec.estimatedRoi}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-[var(--ff-primary)] hover:bg-[var(--ff-primary-600)] text-white">
                              Implement
                            </Button>
                            <Button size="sm" variant="outline">
                              Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Optimization Categories */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
                  <CardHeader>
                    <CardTitle className="text-[var(--ff-text-primary)] flex items-center gap-2">
                      <Gauge className="w-5 h-5" />
                      Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[var(--ff-text-muted)]">Response Time</span>
                        <span className="text-[var(--ff-text-primary)]">245ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--ff-text-muted)]">Cache Hit Rate</span>
                        <span className="text-[var(--ff-text-primary)]">87%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--ff-text-muted)]">Error Rate</span>
                        <span className="text-[var(--ff-text-primary)]">0.8%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
                  <CardHeader>
                    <CardTitle className="text-[var(--ff-text-primary)] flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      User Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[var(--ff-text-muted)]">Satisfaction</span>
                        <span className="text-[var(--ff-text-primary)]">4.7/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--ff-text-muted)]">Feature Adoption</span>
                        <span className="text-[var(--ff-text-primary)]">34%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--ff-text-muted)]">Support Tickets</span>
                        <span className="text-[var(--ff-text-primary)]">23</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
                  <CardHeader>
                    <CardTitle className="text-[var(--ff-text-primary)] flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Business
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[var(--ff-text-muted)]">Conversion Rate</span>
                        <span className="text-[var(--ff-text-primary)]">12.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--ff-text-muted)]">Churn Rate</span>
                        <span className="text-[var(--ff-text-primary)]">3.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--ff-text-muted)]">Revenue Growth</span>
                        <span className="text-[var(--ff-text-primary)]">+24%</span>
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
  );
}