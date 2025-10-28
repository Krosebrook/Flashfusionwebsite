/**
 * @fileoverview Real-Time Performance Dashboard
 * @category performance
 * @version 1.0.0
 * 
 * Comprehensive performance monitoring dashboard that tracks
 * system health, user metrics, and conversion rates in real-time.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Zap, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Refresh
} from 'lucide-react';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  target: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface ConversionMetric {
  stage: string;
  visitors: number;
  conversions: number;
  rate: number;
  target: number;
}

export const RealTimePerformanceDashboard: React.FC = () => {
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [conversionMetrics, setConversionMetrics] = useState<ConversionMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Simulate real-time performance data
  const generatePerformanceMetrics = useCallback((): PerformanceMetric[] => {
    const baseMetrics = [
      { name: 'Page Load Time', baseValue: 1.2, unit: 's', target: 2.0 },
      { name: 'First Contentful Paint', baseValue: 0.8, unit: 's', target: 1.5 },
      { name: 'Time to Interactive', baseValue: 2.1, unit: 's', target: 3.0 },
      { name: 'Memory Usage', baseValue: 45, unit: 'MB', target: 100 },
      { name: 'Error Rate', baseValue: 0.2, unit: '%', target: 1.0 },
      { name: 'API Response Time', baseValue: 150, unit: 'ms', target: 500 }
    ];

    return baseMetrics.map(metric => {
      // Add some realistic variation
      const variation = (Math.random() - 0.5) * 0.2;
      const value = Math.max(0, metric.baseValue * (1 + variation));
      const change = (Math.random() - 0.5) * 10;
      
      let status: 'excellent' | 'good' | 'warning' | 'critical';
      if (value <= metric.target * 0.5) status = 'excellent';
      else if (value <= metric.target * 0.75) status = 'good';
      else if (value <= metric.target) status = 'warning';
      else status = 'critical';

      return {
        name: metric.name,
        value: Math.round(value * 100) / 100,
        unit: metric.unit,
        target: metric.target,
        status,
        trend: change > 2 ? 'up' : change < -2 ? 'down' : 'stable',
        change: Math.round(Math.abs(change) * 10) / 10
      };
    });
  }, []);

  // Simulate conversion funnel data
  const generateConversionMetrics = useCallback((): ConversionMetric[] => {
    const baseConversions = [
      { stage: 'Landing Page Visits', visitors: 1000, baseRate: 100 },
      { stage: 'Demo Started', visitors: 350, baseRate: 35 },
      { stage: 'Sign Up Initiated', visitors: 120, baseRate: 12 },
      { stage: 'Payment Completed', visitors: 45, baseRate: 4.5 },
      { stage: 'Active Users', visitors: 38, baseRate: 3.8 }
    ];

    return baseConversions.map((stage, index) => {
      const variation = (Math.random() - 0.5) * 0.3;
      const visitors = Math.max(1, Math.round(stage.visitors * (1 + variation)));
      const rate = Math.max(0.1, stage.baseRate * (1 + variation));
      const conversions = Math.round(visitors * (rate / 100));
      
      return {
        stage: stage.stage,
        visitors,
        conversions,
        rate: Math.round(rate * 10) / 10,
        target: stage.baseRate * 1.2 // 20% above base as target
      };
    });
  }, []);

  // Update metrics every 5 seconds
  useEffect(() => {
    const updateMetrics = () => {
      setPerformanceMetrics(generatePerformanceMetrics());
      setConversionMetrics(generateConversionMetrics());
      setLastUpdated(new Date());
      setIsLoading(false);
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);

    return () => clearInterval(interval);
  }, [generatePerformanceMetrics, generateConversionMetrics]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'good': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'down': return <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />;
      default: return <Activity className="w-3 h-3 text-gray-500" />;
    }
  };

  const overallHealth = performanceMetrics.length > 0 
    ? Math.round((performanceMetrics.filter(m => m.status === 'excellent' || m.status === 'good').length / performanceMetrics.length) * 100)
    : 0;

  const totalConversions = conversionMetrics.reduce((sum, metric) => sum + metric.conversions, 0);
  const estimatedRevenue = totalConversions * 29 * 0.5; // $29/month * 50% discount

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ff-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="ff-text-headline">Performance Dashboard</h1>
          <p className="ff-text-body">Real-time platform health and conversion metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500 flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setPerformanceMetrics(generatePerformanceMetrics());
              setConversionMetrics(generateConversionMetrics());
              setLastUpdated(new Date());
            }}
          >
            <Refresh className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid md:grid-cols-4 gap-6 ff-stagger-fade">
        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">System Health</p>
                <p className="text-2xl font-bold text-green-500">{overallHealth}%</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
            <Progress value={overallHealth} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-blue-500">
                  {conversionMetrics.find(m => m.stage === 'Active Users')?.visitors || 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversions Today</p>
                <p className="text-2xl font-bold text-purple-500">{totalConversions}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8% conversion rate
            </div>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Est. Revenue</p>
                <p className="text-2xl font-bold text-green-500">${estimatedRevenue.toFixed(0)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              50% promo active
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="ff-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Performance Metrics
          </CardTitle>
          <CardDescription>
            Real-time system performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{metric.name}</span>
                  {getStatusIcon(metric.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-lg font-bold ${getStatusColor(metric.status)}`}>
                    {metric.value}{metric.unit}
                  </span>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(metric.trend)}
                    <span className="text-xs text-gray-500">{metric.change}%</span>
                  </div>
                </div>
                <div className="mt-2">
                  <Progress 
                    value={Math.min(100, (metric.value / metric.target) * 100)} 
                    className="h-1"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Target: {metric.target}{metric.unit}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversion Funnel */}
      <Card className="ff-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Conversion Funnel
          </CardTitle>
          <CardDescription>
            User journey and conversion rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversionMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{metric.stage}</span>
                    <Badge variant={metric.rate >= metric.target ? 'default' : 'secondary'}>
                      {metric.rate}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{metric.conversions.toLocaleString()} / {metric.visitors.toLocaleString()}</span>
                    <span>Target: {metric.target.toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={metric.rate} 
                    className="mt-2 h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimePerformanceDashboard;