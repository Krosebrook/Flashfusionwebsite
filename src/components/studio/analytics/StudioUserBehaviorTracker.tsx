import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Clock,
  Target,
  Zap,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface UserBehaviorMetrics {
  mostUsedFeatures: FeatureUsage[];
  averageSessionDuration: number;
  dropOffPoints: DropOffPoint[];
  conversionFunnels: FunnelData[];
  userSegments: UserSegment[];
}

interface FeatureUsage {
  feature: string;
  usageCount: number;
  avgTimeSpent: number;
  completionRate: number;
  trend: 'up' | 'down' | 'stable';
}

interface DropOffPoint {
  step: string;
  dropOffRate: number;
  usersAffected: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

interface FunnelData {
  name: string;
  steps: FunnelStep[];
  conversionRate: number;
  avgTimeToConvert: number;
}

interface FunnelStep {
  name: string;
  users: number;
  conversionRate: number;
  avgTime: number;
}

interface UserSegment {
  name: string;
  count: number;
  avgRevenue: number;
  engagement: number;
  characteristics: string[];
}

const StudioUserBehaviorTracker: React.FC = () => {
  const [metrics, setMetrics] = useState<UserBehaviorMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFunnel, setSelectedFunnel] = useState<string>('song_creation');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadBehaviorMetrics();
  }, [timeRange]);

  const loadBehaviorMetrics = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockMetrics: UserBehaviorMetrics = {
        mostUsedFeatures: [
          {
            feature: 'Prompt-to-Song',
            usageCount: 45230,
            avgTimeSpent: 180,
            completionRate: 78,
            trend: 'up'
          },
          {
            feature: 'Chord Designer',
            usageCount: 32450,
            avgTimeSpent: 420,
            completionRate: 85,
            trend: 'up'
          },
          {
            feature: 'Mixing Console',
            usageCount: 28900,
            avgTimeSpent: 960,
            completionRate: 62,
            trend: 'stable'
          },
          {
            feature: 'Lyric Generator',
            usageCount: 24100,
            avgTimeSpent: 300,
            completionRate: 72,
            trend: 'down'
          },
          {
            feature: 'Publishing Hub',
            usageCount: 18750,
            avgTimeSpent: 540,
            completionRate: 91,
            trend: 'up'
          }
        ],
        averageSessionDuration: 1260,
        dropOffPoints: [
          {
            step: 'Song Generation - AI Processing',
            dropOffRate: 15.3,
            usersAffected: 2340,
            severity: 'high'
          },
          {
            step: 'Mixing Console - Track Upload',
            dropOffRate: 22.1,
            usersAffected: 1890,
            severity: 'critical'
          },
          {
            step: 'Publishing - Platform Connect',
            dropOffRate: 18.7,
            usersAffected: 1560,
            severity: 'high'
          },
          {
            step: 'Marketplace - Payment Setup',
            dropOffRate: 12.4,
            usersAffected: 980,
            severity: 'medium'
          }
        ],
        conversionFunnels: [
          {
            name: 'song_creation',
            conversionRate: 42.3,
            avgTimeToConvert: 18,
            steps: [
              { name: 'Visit Studio', users: 10000, conversionRate: 100, avgTime: 0 },
              { name: 'Start Generation', users: 7800, conversionRate: 78, avgTime: 2 },
              { name: 'Generate Song', users: 6240, conversionRate: 80, avgTime: 5 },
              { name: 'Edit/Refine', users: 4992, conversionRate: 80, avgTime: 8 },
              { name: 'Complete Song', users: 4230, conversionRate: 85, avgTime: 18 }
            ]
          },
          {
            name: 'publishing',
            conversionRate: 28.5,
            avgTimeToConvert: 35,
            steps: [
              { name: 'Complete Song', users: 4230, conversionRate: 100, avgTime: 0 },
              { name: 'Open Publishing', users: 2960, conversionRate: 70, avgTime: 5 },
              { name: 'Connect Platform', users: 2220, conversionRate: 75, avgTime: 15 },
              { name: 'Upload Metadata', users: 1776, conversionRate: 80, avgTime: 25 },
              { name: 'Publish Track', users: 1207, conversionRate: 68, avgTime: 35 }
            ]
          },
          {
            name: 'free_to_paid',
            conversionRate: 8.4,
            avgTimeToConvert: 12,
            steps: [
              { name: 'Free User', users: 10000, conversionRate: 100, avgTime: 0 },
              { name: 'View Pricing', users: 3200, conversionRate: 32, avgTime: 3 },
              { name: 'Start Checkout', users: 1280, conversionRate: 40, avgTime: 7 },
              { name: 'Enter Payment', users: 960, conversionRate: 75, avgTime: 10 },
              { name: 'Complete Purchase', users: 840, conversionRate: 87.5, avgTime: 12 }
            ]
          }
        ],
        userSegments: [
          {
            name: 'Professional Producers',
            count: 2340,
            avgRevenue: 588,
            engagement: 92,
            characteristics: [
              'Daily active users',
              'Use advanced features',
              'High completion rate',
              'Studio tier subscription'
            ]
          },
          {
            name: 'Singer-Songwriters',
            count: 5670,
            avgRevenue: 228,
            engagement: 78,
            characteristics: [
              'Weekly active users',
              'Focus on lyrics & chords',
              'Moderate publishing rate',
              'Pro tier subscription'
            ]
          },
          {
            name: 'Hobbyists',
            count: 12450,
            avgRevenue: 0,
            engagement: 45,
            characteristics: [
              'Monthly active users',
              'Experiment with features',
              'Low completion rate',
              'Free tier'
            ]
          },
          {
            name: 'Educators',
            count: 890,
            avgRevenue: 1176,
            engagement: 88,
            characteristics: [
              'Regular scheduled usage',
              'Collaboration features',
              'High engagement',
              'Enterprise tier'
            ]
          }
        ]
      };

      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Failed to load behavior metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedFunnelData = useMemo(() => {
    return metrics?.conversionFunnels.find(f => f.name === selectedFunnel);
  }, [metrics, selectedFunnel]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <Activity className="h-4 w-4 text-slate-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'high':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0F172A]">
        <div className="text-center space-y-4">
          <Activity className="h-12 w-12 animate-spin mx-auto text-[#FF7B00]" />
          <p className="text-[#CBD5E1]">Loading user behavior analytics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="min-h-screen bg-[#0F172A] p-6">
      <div className="max-w-7xl mx-auto space-y-6 ff-stagger-fade">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white font-['Sora'] ff-text-gradient">
              User Behavior Analytics
            </h1>
            <p className="text-[#CBD5E1] mt-2 font-['Inter']">
              Track user engagement, identify drop-off points, and optimize conversion funnels
            </p>
          </div>
          <div className="flex gap-3">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <Button
                key={range}
                onClick={() => setTimeRange(range)}
                className={
                  timeRange === range
                    ? 'ff-btn-primary'
                    : 'ff-btn-secondary'
                }
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </Button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="ff-card-interactive bg-[#1E293B] border-[#334155]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Inter']">Avg Session</p>
                  <p className="text-2xl font-bold text-white mt-1 font-['Sora']">
                    {Math.floor(metrics.averageSessionDuration / 60)}m {metrics.averageSessionDuration % 60}s
                  </p>
                </div>
                <Clock className="h-8 w-8 text-[#00B4D8]" />
              </div>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive bg-[#1E293B] border-[#334155]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Inter']">Total Users</p>
                  <p className="text-2xl font-bold text-white mt-1 font-['Sora']">
                    {metrics.userSegments.reduce((sum, seg) => sum + seg.count, 0).toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-[#FF7B00]" />
              </div>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive bg-[#1E293B] border-[#334155]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Inter']">Avg Conversion</p>
                  <p className="text-2xl font-bold text-white mt-1 font-['Sora']">
                    {(metrics.conversionFunnels.reduce((sum, f) => sum + f.conversionRate, 0) / metrics.conversionFunnels.length).toFixed(1)}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-[#E91E63]" />
              </div>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive bg-[#1E293B] border-[#334155]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Inter']">Active Features</p>
                  <p className="text-2xl font-bold text-white mt-1 font-['Sora']">
                    {metrics.mostUsedFeatures.length}
                  </p>
                </div>
                <Zap className="h-8 w-8 text-[#00B4D8]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Most Used Features */}
        <Card className="ff-card-interactive bg-[#1E293B] border-[#334155]">
          <CardHeader>
            <CardTitle className="text-white font-['Sora']">
              Most Used Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics.mostUsedFeatures.map((feature, index) => (
              <div key={index} className="space-y-2 ff-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getTrendIcon(feature.trend)}
                    <span className="text-[#CBD5E1] font-['Inter']">{feature.feature}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-[#94A3B8]">
                      {feature.usageCount.toLocaleString()} uses
                    </span>
                    <span className="text-[#94A3B8]">
                      {Math.floor(feature.avgTimeSpent / 60)}m avg
                    </span>
                    <Badge className="bg-[#00B4D8]/10 text-[#00B4D8] border-[#00B4D8]/20">
                      {feature.completionRate}% complete
                    </Badge>
                  </div>
                </div>
                <Progress value={feature.completionRate} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Drop-off Points */}
        <Card className="ff-card-interactive bg-[#1E293B] border-[#334155]">
          <CardHeader>
            <CardTitle className="text-white font-['Sora'] flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-[#E91E63]" />
              Critical Drop-off Points
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics.dropOffPoints.map((point, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ff-fade-in-up ${getSeverityColor(point.severity)}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold font-['Sora']">{point.step}</span>
                  <Badge className={getSeverityColor(point.severity)}>
                    {point.severity.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>{point.dropOffRate}% drop-off rate</span>
                  <span>{point.usersAffected.toLocaleString()} users affected</span>
                </div>
                <Progress value={100 - point.dropOffRate} className="h-2 mt-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Conversion Funnels */}
        <Card className="ff-card-interactive bg-[#1E293B] border-[#334155]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white font-['Sora']">
                Conversion Funnels
              </CardTitle>
              <div className="flex gap-2">
                {metrics.conversionFunnels.map((funnel) => (
                  <Button
                    key={funnel.name}
                    onClick={() => setSelectedFunnel(funnel.name)}
                    className={
                      selectedFunnel === funnel.name
                        ? 'ff-btn-primary'
                        : 'ff-btn-secondary'
                    }
                    size="sm"
                  >
                    {funnel.name.replace('_', ' ').toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedFunnelData && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#94A3B8] font-['Inter']">Overall Conversion Rate</p>
                    <p className="text-3xl font-bold text-white mt-1 font-['Sora']">
                      {selectedFunnelData.conversionRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#94A3B8] font-['Inter']">Avg Time to Convert</p>
                    <p className="text-3xl font-bold text-white mt-1 font-['Sora']">
                      {selectedFunnelData.avgTimeToConvert} min
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedFunnelData.steps.map((step, index) => (
                    <div key={index} className="relative ff-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-[#0F172A] border border-[#334155]">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FF7B00]/10 border border-[#FF7B00]/20">
                            <span className="text-[#FF7B00] font-bold">{index + 1}</span>
                          </div>
                          <div>
                            <p className="text-white font-semibold font-['Sora']">{step.name}</p>
                            <p className="text-sm text-[#94A3B8]">{step.users.toLocaleString()} users</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-sm text-[#94A3B8]">Conversion</p>
                            <p className="text-lg font-bold text-white">{step.conversionRate}%</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-[#94A3B8]">Avg Time</p>
                            <p className="text-lg font-bold text-white">{step.avgTime}m</p>
                          </div>
                        </div>
                      </div>
                      {index < selectedFunnelData.steps.length - 1 && (
                        <div className="flex justify-center py-2">
                          <div className="w-px h-6 bg-[#334155]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Segments */}
        <Card className="ff-card-interactive bg-[#1E293B] border-[#334155]">
          <CardHeader>
            <CardTitle className="text-white font-['Sora']">
              User Segments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metrics.userSegments.map((segment, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg bg-[#0F172A] border border-[#334155] ff-fade-in-up ff-hover-lift"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white font-['Sora']">{segment.name}</h3>
                    <Users className="h-5 w-5 text-[#00B4D8]" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-[#94A3B8]">Users</p>
                      <p className="text-xl font-bold text-white">{segment.count.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#94A3B8]">Avg Revenue</p>
                      <p className="text-xl font-bold text-white">${segment.avgRevenue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#94A3B8]">Engagement</p>
                      <p className="text-xl font-bold text-white">{segment.engagement}%</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {segment.characteristics.map((char, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-[#00B4D8]" />
                        <span className="text-sm text-[#CBD5E1]">{char}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudioUserBehaviorTracker;
