import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
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
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown,
  Users,
  Activity,
  DollarSign,
  Target,
  Zap,
  Brain,
  Eye,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  MousePointer,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle,
  Info,
  Lightbulb,
  Star,
  Calendar,
  Filter,
  Download,
  Share,
  Settings,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Gauge
} from 'lucide-react';

interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  trend: number[];
  unit: string;
  description: string;
  category: 'user' | 'performance' | 'business' | 'engagement';
}

interface UserSegment {
  name: string;
  users: number;
  percentage: number;
  color: string;
  engagement: number;
  conversion: number;
}

interface Insight {
  id: string;
  type: 'opportunity' | 'warning' | 'success' | 'info';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionRequired: boolean;
  recommendation: string;
  estimatedValue?: string;
}

interface UserBehavior {
  path: string;
  users: number;
  conversions: number;
  conversionRate: number;
  avgTime: number;
  bounceRate: number;
}

const IntelligentAnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('users');
  const [isRealTime, setIsRealTime] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Analytics data
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [userSegments, setUserSegments] = useState<UserSegment[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [userBehavior, setUserBehavior] = useState<UserBehavior[]>([]);
  const [realtimeData, setRealtimeData] = useState<any[]>([]);

  // Initialize analytics data
  const initializeAnalytics = useCallback(() => {
    const baseMetrics: AnalyticsMetric[] = [
      {
        id: 'users',
        name: 'Active Users',
        value: 12847,
        previousValue: 11934,
        change: 7.6,
        changeType: 'increase',
        trend: [8420, 9150, 10280, 11200, 11934, 12847],
        unit: '',
        description: 'Total active users in the selected period',
        category: 'user'
      },
      {
        id: 'sessions',
        name: 'Sessions',
        value: 28945,
        previousValue: 26823,
        change: 7.9,
        changeType: 'increase',
        trend: [18200, 20400, 23100, 25600, 26823, 28945],
        unit: '',
        description: 'Total number of user sessions',
        category: 'engagement'
      },
      {
        id: 'conversion_rate',
        name: 'Conversion Rate',
        value: 3.42,
        previousValue: 3.18,
        change: 7.5,
        changeType: 'increase',
        trend: [2.8, 2.9, 3.1, 3.2, 3.18, 3.42],
        unit: '%',
        description: 'Percentage of users who complete desired actions',
        category: 'business'
      },
      {
        id: 'avg_session_duration',
        name: 'Avg Session Duration',
        value: 247,
        previousValue: 231,
        change: 6.9,
        changeType: 'increase',
        trend: [185, 203, 218, 229, 231, 247],
        unit: 'seconds',
        description: 'Average time users spend per session',
        category: 'engagement'
      },
      {
        id: 'revenue',
        name: 'Revenue',
        value: 84320,
        previousValue: 78450,
        change: 7.5,
        changeType: 'increase',
        trend: [52000, 58200, 65800, 72100, 78450, 84320],
        unit: '$',
        description: 'Total revenue generated',
        category: 'business'
      },
      {
        id: 'page_load_time',
        name: 'Page Load Time',
        value: 1.23,
        previousValue: 1.47,
        change: -16.3,
        changeType: 'increase', // Decrease in load time is good
        trend: [2.1, 1.9, 1.7, 1.5, 1.47, 1.23],
        unit: 'seconds',
        description: 'Average page load time',
        category: 'performance'
      }
    ];

    const segments: UserSegment[] = [
      { name: 'New Users', users: 3456, percentage: 27, color: '#FF7B00', engagement: 2.3, conversion: 1.8 },
      { name: 'Returning Users', users: 5821, percentage: 45, color: '#00B4D8', engagement: 4.7, conversion: 4.2 },
      { name: 'Premium Users', users: 2156, percentage: 17, color: '#E91E63', engagement: 8.9, conversion: 12.3 },
      { name: 'Enterprise', users: 1414, percentage: 11, color: '#10B981', engagement: 12.4, conversion: 18.7 }
    ];

    const intelligentInsights: Insight[] = [
      {
        id: 'insight-001',
        type: 'opportunity',
        title: 'Mobile Conversion Opportunity',
        description: 'Mobile users have 23% lower conversion rate but 45% higher engagement time',
        impact: 'high',
        actionRequired: true,
        recommendation: 'Optimize mobile checkout flow and add mobile-specific features',
        estimatedValue: '+$12,400/month'
      },
      {
        id: 'insight-002',
        type: 'success',
        title: 'Premium Feature Adoption Surge',
        description: 'AI tools usage increased 156% among premium users this week',
        impact: 'medium',
        actionRequired: false,
        recommendation: 'Promote AI features to free users to drive upgrades'
      },
      {
        id: 'insight-003',
        type: 'warning',
        title: 'Drop-off in Onboarding',
        description: 'Step 3 of onboarding shows 34% abandonment rate',
        impact: 'high',
        actionRequired: true,
        recommendation: 'Simplify onboarding step 3 or add progress indicators',
        estimatedValue: '+890 conversions/month'
      },
      {
        id: 'insight-004',
        type: 'info',
        title: 'Geographic Expansion Potential',
        description: 'Significant organic traffic growth from European markets',
        impact: 'medium',
        actionRequired: false,
        recommendation: 'Consider localization for German and French markets'
      }
    ];

    const behaviorData: UserBehavior[] = [
      { path: '/dashboard', users: 8945, conversions: 234, conversionRate: 2.6, avgTime: 312, bounceRate: 23 },
      { path: '/tools', users: 6821, conversions: 456, conversionRate: 6.7, avgTime: 445, bounceRate: 18 },
      { path: '/pricing', users: 4567, conversions: 123, conversionRate: 2.7, avgTime: 156, bounceRate: 45 },
      { path: '/features', users: 3456, conversions: 89, conversionRate: 2.6, avgTime: 234, bounceRate: 34 },
      { path: '/onboarding', users: 2345, conversions: 789, conversionRate: 33.6, avgTime: 678, bounceRate: 12 }
    ];

    // Generate real-time data
    const realtime = Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      users: Math.floor(Math.random() * 500) + 200,
      sessions: Math.floor(Math.random() * 800) + 400,
      conversions: Math.floor(Math.random() * 50) + 10
    }));

    setMetrics(baseMetrics);
    setUserSegments(segments);
    setInsights(intelligentInsights);
    setUserBehavior(behaviorData);
    setRealtimeData(realtime);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.value + (Math.random() - 0.5) * metric.value * 0.02,
        trend: [...metric.trend.slice(1), metric.value + (Math.random() - 0.5) * metric.value * 0.05]
      })));

      setLastUpdated(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, [isRealTime]);

  // Initialize data
  useEffect(() => {
    initializeAnalytics();
  }, [initializeAnalytics]);

  const formatValue = (value: number, unit: string) => {
    if (unit === '$') {
      return `$${value.toLocaleString()}`;
    }
    if (unit === 'seconds') {
      return `${value.toFixed(1)}s`;
    }
    if (unit === '%') {
      return `${value.toFixed(1)}%`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return Math.round(value).toLocaleString();
  };

  const getChangeColor = (changeType: string, value: number) => {
    if (changeType === 'increase') {
      return value > 0 ? 'text-green-500' : 'text-red-500';
    }
    return value > 0 ? 'text-red-500' : 'text-green-500';
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const selectedMetricData = useMemo(() => {
    return metrics.find(m => m.id === selectedMetric);
  }, [metrics, selectedMetric]);

  return (
    <div className="space-y-6 ff-stagger-fade">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h1 className="ff-text-2xl font-bold ff-text-gradient font-sora">
                Intelligent Analytics
              </h1>
              <p className="ff-text-sm text-muted-foreground font-inter">
                AI-powered insights and real-time performance monitoring
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant={isRealTime ? "default" : "secondary"} className="ff-badge-glow">
            {isRealTime ? (
              <>
                <div className="ff-status-dot ff-status-active mr-2"></div>
                Live Data
              </>
            ) : (
              <>
                <div className="ff-status-dot ff-status-offline mr-2"></div>
                Static
              </>
            )}
          </Badge>
          
          <Button
            onClick={() => setIsRealTime(!isRealTime)}
            variant="outline"
            size="sm"
            className="ff-hover-scale"
          >
            {isRealTime ? 'Pause' : 'Resume'} Updates
          </Button>
          
          <Button variant="outline" size="sm" className="ff-hover-scale">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <Tabs value={timeRange} onValueChange={setTimeRange}>
          <TabsList>
            <TabsTrigger value="24h">24 Hours</TabsTrigger>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
            <TabsTrigger value="90d">90 Days</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2 ff-text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card 
              className={`ff-card-interactive cursor-pointer transition-all duration-200 ${
                selectedMetric === metric.id ? 'ring-2 ring-primary/20 bg-primary/5' : ''
              }`}
              onClick={() => setSelectedMetric(metric.id)}
            >
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="ff-text-sm font-medium text-muted-foreground font-sora">
                        {metric.name}
                      </p>
                      <p className="ff-text-2xl font-bold font-sora">
                        {formatValue(metric.value, metric.unit)}
                      </p>
                    </div>
                    <div className={`flex items-center gap-1 ff-text-sm ${getChangeColor(metric.changeType, metric.change)}`}>
                      {metric.change > 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {Math.abs(metric.change).toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="h-12">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metric.trend.map((value, index) => ({ value, index }))}>
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="currentColor"
                          strokeWidth={2}
                          dot={false}
                          className={metric.changeType === 'increase' ? 'text-green-500' : 'text-blue-500'}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* AI Insights */}
      <Card className="ff-card-interactive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-sora">
            <Brain className="h-5 w-5 text-purple-500" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.type === 'opportunity' ? 'border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20' :
                  insight.type === 'warning' ? 'border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/20' :
                  insight.type === 'success' ? 'border-l-green-500 bg-green-50/50 dark:bg-green-950/20' :
                  'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      {getInsightIcon(insight.type)}
                      <h4 className="font-semibold font-sora">{insight.title}</h4>
                      <Badge 
                        variant={insight.impact === 'high' ? 'destructive' : 
                                insight.impact === 'medium' ? 'default' : 'secondary'}
                        className="ff-text-xs"
                      >
                        {insight.impact} impact
                      </Badge>
                      {insight.actionRequired && (
                        <Badge variant="outline" className="ff-text-xs text-orange-600 border-orange-600">
                          Action Required
                        </Badge>
                      )}
                    </div>
                    <p className="ff-text-sm text-muted-foreground font-inter">
                      {insight.description}
                    </p>
                    <div className="space-y-1">
                      <p className="ff-text-sm font-medium font-sora">
                        Recommendation: {insight.recommendation}
                      </p>
                      {insight.estimatedValue && (
                        <p className="ff-text-sm text-green-600 font-semibold font-sora">
                          Estimated Impact: {insight.estimatedValue}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="ff-hover-scale">
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                    {insight.actionRequired && (
                      <Button size="sm" className="ff-btn-primary ff-hover-glow">
                        Take Action
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Chart */}
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="font-sora">
                  {selectedMetricData?.name} Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedMetricData?.trend.map((value, index) => ({ 
                      value, 
                      index: index + 1,
                      label: `Period ${index + 1}`
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="index" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="rgb(var(--ff-primary))"
                        fill="rgb(var(--ff-primary))"
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* User Segments */}
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="font-sora">User Segments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userSegments.map((segment, index) => (
                    <motion.div
                      key={segment.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: segment.color }}
                          />
                          <span className="font-medium font-sora">{segment.name}</span>
                        </div>
                        <div className="flex items-center gap-4 ff-text-sm text-muted-foreground">
                          <span>{segment.users.toLocaleString()} users</span>
                          <span>{segment.percentage}%</span>
                        </div>
                      </div>
                      <Progress value={segment.percentage} className="h-2" />
                      <div className="flex justify-between ff-text-xs text-muted-foreground">
                        <span>Engagement: {segment.engagement}min avg</span>
                        <span>Conversion: {segment.conversion}%</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-sora">
                  <Monitor className="h-5 w-5" />
                  Device Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Desktop', value: 45, color: '#FF7B00' },
                          { name: 'Mobile', value: 38, color: '#00B4D8' },
                          { name: 'Tablet', value: 17, color: '#E91E63' }
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {[
                          { name: 'Desktop', value: 45, color: '#FF7B00' },
                          { name: 'Mobile', value: 38, color: '#00B4D8' },
                          { name: 'Tablet', value: 17, color: '#E91E63' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="ff-card-interactive lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-sora">
                  <Users className="h-5 w-5" />
                  User Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={realtimeData.slice(0, 12)}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Bar 
                        dataKey="users" 
                        fill="rgb(var(--ff-primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4">
          <Card className="ff-card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-sora">
                <MousePointer className="h-5 w-5" />
                User Behavior Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userBehavior.map((behavior, index) => (
                  <motion.div
                    key={behavior.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-muted/30 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold font-sora">{behavior.path}</h4>
                      <Badge variant="outline" className="ff-text-xs">
                        {behavior.users.toLocaleString()} users
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ff-text-sm">
                      <div>
                        <p className="text-muted-foreground font-inter">Conversions</p>
                        <p className="font-semibold text-green-600 font-sora">{behavior.conversions}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-inter">Conv. Rate</p>
                        <p className="font-semibold font-sora">{behavior.conversionRate.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-inter">Avg Time</p>
                        <p className="font-semibold font-sora">{Math.floor(behavior.avgTime / 60)}m {behavior.avgTime % 60}s</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-inter">Bounce Rate</p>
                        <p className="font-semibold font-sora">{behavior.bounceRate}%</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between ff-text-xs text-muted-foreground">
                        <span>Conversion Rate</span>
                        <span>{behavior.conversionRate.toFixed(1)}%</span>
                      </div>
                      <Progress value={behavior.conversionRate} className="h-2" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-sora">
                  <Activity className="h-5 w-5" />
                  Real-time Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={realtimeData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="users" 
                        stroke="rgb(var(--ff-primary))"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="sessions" 
                        stroke="rgb(var(--ff-secondary))"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-sora">
                  <Gauge className="h-5 w-5" />
                  Current Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="ff-text-3xl font-bold text-primary font-sora">
                      {realtimeData[realtimeData.length - 1]?.users || 0}
                    </div>
                    <p className="ff-text-sm text-muted-foreground font-inter">Active Users</p>
                  </div>
                  <div className="text-center">
                    <div className="ff-text-3xl font-bold text-secondary font-sora">
                      {realtimeData[realtimeData.length - 1]?.sessions || 0}
                    </div>
                    <p className="ff-text-sm text-muted-foreground font-inter">Active Sessions</p>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between ff-text-sm">
                    <span className="font-inter">Server Load</span>
                    <span className="font-sora">23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                  
                  <div className="flex justify-between ff-text-sm">
                    <span className="font-inter">Response Time</span>
                    <span className="font-sora">1.2s</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntelligentAnalyticsDashboard;