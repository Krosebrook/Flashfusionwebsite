import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Activity,
  Users,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Target,
  RefreshCw,
  Download
} from 'lucide-react';
import { cn } from '../ui/utils';

// Analytics data interfaces
interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    revenue: number;
    conversionRate: number;
    churnRate: number;
    avgSessionDuration: number;
  };
  userGrowth: Array<{
    date: string;
    newUsers: number;
    totalUsers: number;
    revenue: number;
  }>;
  deviceBreakdown: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  featureUsage: Array<{
    feature: string;
    usage: number;
    trend: number;
  }>;
  performance: {
    pageLoadTime: number;
    apiResponseTime: number;
    errorRate: number;
    uptime: number;
  };
  geography: Array<{
    country: string;
    users: number;
    revenue: number;
  }>;
}

// Mock analytics data - replace with real API calls
const mockAnalyticsData: AnalyticsData = {
  overview: {
    totalUsers: 1247,
    activeUsers: 892,
    revenue: 8450,
    conversionRate: 12.5,
    churnRate: 3.2,
    avgSessionDuration: 425,
  },
  userGrowth: [
    { date: '2025-01-20', newUsers: 45, totalUsers: 1202, revenue: 7890 },
    { date: '2025-01-21', newUsers: 23, totalUsers: 1225, revenue: 8120 },
    { date: '2025-01-22', newUsers: 19, totalUsers: 1244, revenue: 8340 },
    { date: '2025-01-23', newUsers: 31, totalUsers: 1275, revenue: 8450 },
  ],
  deviceBreakdown: [
    { name: 'Desktop', value: 65, color: 'var(--ff-primary)' },
    { name: 'Mobile', value: 28, color: 'var(--ff-secondary)' },
    { name: 'Tablet', value: 7, color: 'var(--ff-accent)' },
  ],
  featureUsage: [
    { feature: 'AI Code Generator', usage: 89, trend: 12 },
    { feature: 'Template System', usage: 76, trend: 8 },
    { feature: 'Deployment Tools', usage: 65, trend: -3 },
    { feature: 'Collaboration', usage: 58, trend: 15 },
    { feature: 'Analytics Dashboard', usage: 42, trend: 22 },
  ],
  performance: {
    pageLoadTime: 1.8,
    apiResponseTime: 245,
    errorRate: 0.12,
    uptime: 99.97,
  },
  geography: [
    { country: 'United States', users: 456, revenue: 3820 },
    { country: 'United Kingdom', users: 123, revenue: 1240 },
    { country: 'Canada', users: 98, revenue: 890 },
    { country: 'Germany', users: 87, revenue: 780 },
    { country: 'Australia', users: 65, revenue: 650 },
  ],
};

interface ProductionAnalyticsProps {
  className?: string;
}

export const ProductionAnalytics: React.FC<ProductionAnalyticsProps> = ({ className }) => {
  const [data, setData] = useState<AnalyticsData>(mockAnalyticsData);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');

  // Real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => ({
        ...prevData,
        overview: {
          ...prevData.overview,
          activeUsers: prevData.overview.activeUsers + Math.floor(Math.random() * 5 - 2),
          revenue: prevData.overview.revenue + Math.floor(Math.random() * 100),
        },
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flashfusion-analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const getPerformanceStatus = (metric: string, value: number) => {
    const thresholds = {
      pageLoadTime: { good: 2, warning: 3 },
      apiResponseTime: { good: 200, warning: 500 },
      errorRate: { good: 0.1, warning: 1 },
      uptime: { good: 99.9, warning: 99.5 },
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return 'good';

    if (metric === 'uptime') {
      return value >= threshold.good ? 'good' : value >= threshold.warning ? 'warning' : 'error';
    }

    return value <= threshold.good ? 'good' : value <= threshold.warning ? 'warning' : 'error';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold ff-text-gradient">Production Analytics</h1>
          <p className="text-muted-foreground">
            Real-time insights into FlashFusion platform performance
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw className={cn('w-4 h-4 mr-2', isLoading && 'animate-spin')} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="ff-hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{formatNumber(data.overview.totalUsers)}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-green-500">↗ {data.overview.activeUsers}</span>
              <span className="text-muted-foreground ml-1">active now</span>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(data.overview.revenue)}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-green-500">↗ {data.overview.conversionRate}%</span>
              <span className="text-muted-foreground ml-1">conversion rate</span>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Growth Rate</p>
                <p className="text-2xl font-bold">+24.5%</p>
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-red-500">↘ {data.overview.churnRate}%</span>
              <span className="text-muted-foreground ml-1">churn rate</span>
            </div>
          </CardContent>
        </Card>

        <Card className="ff-hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-8 h-8 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Session</p>
                <p className="text-2xl font-bold">{Math.floor(data.overview.avgSessionDuration / 60)}m</p>
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-green-500">↗ +12%</span>
              <span className="text-muted-foreground ml-1">vs last week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="totalUsers" 
                      stroke="var(--ff-primary)" 
                      fill="var(--ff-primary)" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={([value]) => [formatCurrency(value as number), 'Revenue']} />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="var(--ff-secondary)" 
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Device Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.deviceBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {data.deviceBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* User Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>User Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Monitor className="w-4 h-4 text-primary" />
                    <span>Desktop Users</span>
                  </div>
                  <span className="font-bold">65%</span>
                </div>
                <Progress value={65} className="h-2" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-secondary" />
                    <span>Mobile Users</span>
                  </div>
                  <span className="font-bold">28%</span>
                </div>
                <Progress value={28} className="h-2" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-accent" />
                    <span>Tablet Users</span>
                  </div>
                  <span className="font-bold">7%</span>
                </div>
                <Progress value={7} className="h-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Usage Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.featureUsage.map((feature, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{feature.feature}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          {feature.usage}% usage
                        </span>
                        <Badge 
                          variant={feature.trend > 0 ? "default" : "secondary"}
                          className={cn(
                            feature.trend > 0 ? "text-green-500" : "text-red-500"
                          )}
                        >
                          {feature.trend > 0 ? '+' : ''}{feature.trend}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={feature.usage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { 
                key: 'pageLoadTime', 
                label: 'Page Load Time', 
                value: data.performance.pageLoadTime, 
                unit: 's',
                icon: Zap
              },
              { 
                key: 'apiResponseTime', 
                label: 'API Response Time', 
                value: data.performance.apiResponseTime, 
                unit: 'ms',
                icon: Activity
              },
              { 
                key: 'errorRate', 
                label: 'Error Rate', 
                value: data.performance.errorRate, 
                unit: '%',
                icon: AlertTriangle
              },
              { 
                key: 'uptime', 
                label: 'Uptime', 
                value: data.performance.uptime, 
                unit: '%',
                icon: CheckCircle
              },
            ].map((metric) => {
              const status = getPerformanceStatus(metric.key, metric.value);
              const IconComponent = metric.icon;
              
              return (
                <Card key={metric.key} className="ff-hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-8 h-8 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">{metric.label}</p>
                          <p className="text-2xl font-bold">
                            {metric.value}{metric.unit}
                          </p>
                        </div>
                      </div>
                      {getStatusIcon(status)}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="geography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.geography.map((country, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">{country.country}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(country.users)} users
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(country.revenue)}</p>
                      <p className="text-sm text-muted-foreground">revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductionAnalytics;