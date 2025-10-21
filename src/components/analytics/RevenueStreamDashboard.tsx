import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Zap,
  Target,
  BarChart3,
  PieChart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Crown,
  Star,
  Sparkles
} from 'lucide-react';

interface RevenueMetric {
  id: string;
  title: string;
  value: number;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  prefix?: string;
  suffix?: string;
  trend: number[];
  target?: number;
  category: 'subscription' | 'marketplace' | 'services' | 'advertising';
}

interface RevenueStream {
  id: string;
  name: string;
  description: string;
  revenue: number;
  growth: number;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  breakdown: {
    name: string;
    value: number;
    percentage: number;
  }[];
}

const REVENUE_METRICS: RevenueMetric[] = [
  {
    id: 'total-revenue',
    title: 'Total Revenue',
    value: 184750,
    change: 12.4,
    changeType: 'positive',
    prefix: '$',
    trend: [145000, 156000, 162000, 171000, 178000, 184750],
    target: 200000,
    category: 'subscription'
  },
  {
    id: 'monthly-recurring',
    title: 'Monthly Recurring Revenue',
    value: 47200,
    change: 8.7,
    changeType: 'positive',
    prefix: '$',
    trend: [38000, 41000, 43500, 45200, 46100, 47200],
    target: 60000,
    category: 'subscription'
  },
  {
    id: 'active-subscribers',
    title: 'Active Subscribers',
    value: 2847,
    change: 15.3,
    changeType: 'positive',
    trend: [2100, 2300, 2450, 2600, 2720, 2847],
    target: 5000,
    category: 'subscription'
  },
  {
    id: 'marketplace-sales',
    title: 'Marketplace Sales',
    value: 89350,
    change: 23.1,
    changeType: 'positive',
    prefix: '$',
    trend: [62000, 68000, 74000, 78000, 84000, 89350],
    target: 120000,
    category: 'marketplace'
  },
  {
    id: 'avg-revenue-per-user',
    title: 'Average Revenue Per User',
    value: 64.85,
    change: -3.2,
    changeType: 'negative',
    prefix: '$',
    trend: [71.20, 69.50, 68.00, 66.80, 65.90, 64.85],
    target: 80,
    category: 'subscription'
  },
  {
    id: 'churn-rate',
    title: 'Churn Rate',
    value: 2.8,
    change: -0.5,
    changeType: 'positive',
    suffix: '%',
    trend: [3.8, 3.5, 3.2, 3.0, 2.9, 2.8],
    target: 2.0,
    category: 'subscription'
  }
];

const REVENUE_STREAMS: RevenueStream[] = [
  {
    id: 'subscriptions',
    name: 'Subscription Plans',
    description: 'Monthly and annual subscription revenue from Pro and Enterprise tiers',
    revenue: 94400,
    growth: 12.4,
    color: '#FF7B00', // FlashFusion Primary
    icon: Crown,
    breakdown: [
      { name: 'Pro Monthly', value: 38600, percentage: 40.9 },
      { name: 'Pro Annual', value: 24800, percentage: 26.3 },
      { name: 'Enterprise Monthly', value: 18200, percentage: 19.3 },
      { name: 'Enterprise Annual', value: 12800, percentage: 13.6 }
    ]
  },
  {
    id: 'marketplace',
    name: 'Marketplace Commission',
    description: 'Revenue from print-on-demand and digital product sales',
    revenue: 48200,
    growth: 23.1,
    color: '#00B4D8', // FlashFusion Secondary
    icon: ShoppingCart,
    breakdown: [
      { name: 'Print-on-Demand', value: 28700, percentage: 59.5 },
      { name: 'Digital Templates', value: 12300, percentage: 25.5 },
      { name: 'Brand Assets', value: 7200, percentage: 14.9 }
    ]
  },
  {
    id: 'services',
    name: 'Professional Services',
    description: 'Custom development and consulting revenue',
    revenue: 28500,
    growth: 8.7,
    color: '#E91E63', // FlashFusion Accent
    icon: Sparkles,
    breakdown: [
      { name: 'Custom Development', value: 18200, percentage: 63.9 },
      { name: 'Consulting', value: 6800, percentage: 23.9 },
      { name: 'Training', value: 3500, percentage: 12.3 }
    ]
  },
  {
    id: 'advertising',
    name: 'Advertising & Partnerships',
    description: 'Revenue from ads and strategic partnerships',
    revenue: 13650,
    growth: 18.2,
    color: '#10B981', // Success Green
    icon: Target,
    breakdown: [
      { name: 'Display Ads', value: 8200, percentage: 60.1 },
      { name: 'Sponsored Content', value: 3450, percentage: 25.3 },
      { name: 'Affiliate Commission', value: 2000, percentage: 14.6 }
    ]
  }
];

export function RevenueStreamDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);

  const totalRevenue = REVENUE_METRICS.find(m => m.id === 'total-revenue')?.value || 0;
  const totalGrowth = REVENUE_METRICS.find(m => m.id === 'total-revenue')?.change || 0;

  useEffect(() => {
    const timer = setTimeout(() => setAnimationComplete(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getChangeIcon = (changeType: RevenueMetric['changeType']) => {
    if (changeType === 'positive') return ArrowUpRight;
    if (changeType === 'negative') return ArrowDownRight;
    return BarChart3;
  };

  const getChangeColor = (changeType: RevenueMetric['changeType']) => {
    if (changeType === 'positive') return '#10B981';
    if (changeType === 'negative') return '#EF4444';
    return '#6B7280';
  };

  const MetricCard = ({ metric }: { metric: RevenueMetric }) => {
    const ChangeIcon = getChangeIcon(metric.changeType);
    const changeColor = getChangeColor(metric.changeType);
    const progressPercentage = metric.target ? (metric.value / metric.target) * 100 : 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card 
          className="relative overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Gradient overlay */}
          <div 
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              background: 'linear-gradient(90deg, #FF7B00 0%, #00B4D8 50%, #E91E63 100%)'
            }}
          />

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-600 mb-1 truncate">
                  {metric.title}
                </h3>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {metric.prefix}{metric.value.toLocaleString()}{metric.suffix}
                  </span>
                </div>
              </div>

              <Badge 
                className="flex items-center space-x-1"
                style={{
                  backgroundColor: `${changeColor}15`,
                  color: changeColor,
                  border: `1px solid ${changeColor}30`
                }}
              >
                <ChangeIcon className="h-3 w-3" />
                <span>{formatPercentage(metric.change)}</span>
              </Badge>
            </div>

            {/* Mini trend chart */}
            <div className="mb-4">
              <div className="flex items-end justify-between h-12">
                {metric.trend.map((value, index) => {
                  const height = (value / Math.max(...metric.trend)) * 100;
                  return (
                    <motion.div
                      key={index}
                      className="flex-1 mx-0.5 rounded-t"
                      style={{
                        background: index === metric.trend.length - 1 
                          ? 'linear-gradient(to top, #FF7B00, #00B4D8)'
                          : '#E5E7EB',
                        height: animationComplete ? `${height}%` : '0%'
                      }}
                      initial={{ height: 0 }}
                      animate={{ height: animationComplete ? `${height}%` : '0%' }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Target progress */}
            {metric.target && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">Target Progress</span>
                  <span className="text-xs font-medium" style={{ color: '#10B981' }}>
                    {progressPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: progressPercentage >= 100 
                        ? '#10B981'
                        : 'linear-gradient(90deg, #FF7B00, #00B4D8)'
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: animationComplete ? `${Math.min(progressPercentage, 100)}%` : 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    );
  };

  const StreamCard = ({ stream }: { stream: RevenueStream }) => {
    const isSelected = selectedStream === stream.id;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <Card 
          className={`cursor-pointer transition-all duration-300 ${
            isSelected ? 'ring-2' : 'hover:shadow-lg'
          }`}
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: isSelected 
              ? `2px solid ${stream.color}` 
              : '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: isSelected
              ? `0 8px 32px rgba(0, 0, 0, 0.15), 0 0 20px ${stream.color}30`
              : '0 8px 32px rgba(0, 0, 0, 0.1)',
            ringColor: stream.color
          }}
          onClick={() => setSelectedStream(isSelected ? null : stream.id)}
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ 
                  backgroundColor: `${stream.color}15`,
                  border: `2px solid ${stream.color}30`
                }}
              >
                <stream.icon className="h-6 w-6" style={{ color: stream.color }} />
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stream.revenue)}
                </div>
                <Badge 
                  className="flex items-center space-x-1 mt-1"
                  style={{
                    backgroundColor: '#10B98115',
                    color: '#10B981',
                    border: '1px solid #10B98130'
                  }}
                >
                  <TrendingUp className="h-3 w-3" />
                  <span>+{stream.growth}%</span>
                </Badge>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {stream.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {stream.description}
            </p>

            {/* Revenue breakdown */}
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t pt-4 space-y-3"
                >
                  {stream.breakdown.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: stream.color }}
                        />
                        <span className="text-sm text-gray-700">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.value)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.percentage}%
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Revenue contribution bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: stream.color }}
                  initial={{ width: 0 }}
                  animate={{ 
                    width: animationComplete 
                      ? `${(stream.revenue / totalRevenue) * 100}%` 
                      : 0 
                  }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1 text-center">
                {((stream.revenue / totalRevenue) * 100).toFixed(1)}% of total revenue
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <motion.h1 
            className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Revenue Dashboard
          </motion.h1>
          <motion.p 
            className="text-muted-foreground mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Track revenue streams, growth metrics, and financial performance
          </motion.p>
        </div>

        <div className="flex items-center space-x-3">
          <Tabs value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as any)}>
            <TabsList>
              <TabsTrigger value="7d">7 Days</TabsTrigger>
              <TabsTrigger value="30d">30 Days</TabsTrigger>
              <TabsTrigger value="90d">90 Days</TabsTrigger>
              <TabsTrigger value="1y">1 Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REVENUE_METRICS.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Revenue Streams */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Revenue Streams</h2>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>View Details</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {REVENUE_STREAMS.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </div>
      </div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card 
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 123, 0, 0.1) 0%, rgba(0, 180, 216, 0.1) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 123, 0, 0.2)'
          }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Total Revenue Performance
                </h3>
                <div className="flex items-baseline space-x-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatCurrency(totalRevenue)}
                  </span>
                  <Badge 
                    className="flex items-center space-x-1"
                    style={{
                      backgroundColor: '#10B98115',
                      color: '#10B981',
                      border: '1px solid #10B98130'
                    }}
                  >
                    <TrendingUp className="h-3 w-3" />
                    <span>{formatPercentage(totalGrowth)} this month</span>
                  </Badge>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">On track for goals</span>
                </div>
                <p className="text-xs text-gray-500">
                  Revenue growth exceeding targets by {(totalGrowth - 8).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Decorative gradient line */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{
              background: 'linear-gradient(90deg, #FF7B00 0%, #00B4D8 50%, #E91E63 100%)'
            }}
          />
        </Card>
      </motion.div>
    </div>
  );
}