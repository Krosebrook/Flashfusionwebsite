import React, { useState, useMemo } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  BarChart3, TrendingUp, Users, Zap, Calendar, Download,
  Eye, Clock, Target, DollarSign, Activity, Layers,
  ArrowUp, ArrowDown, X, Filter, RefreshCw
} from 'lucide-react';

interface AnalyticsInsightsDashboardProps {
  onClose?: () => void;
}

interface MetricCard {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  trend: number[];
  description: string;
}

interface ChartData {
  name: string;
  value: number;
  change?: number;
}

const mockMetrics: MetricCard[] = [
  {
    id: 'total-users',
    title: 'Total Users',
    value: '12,543',
    change: 15.3,
    changeType: 'increase',
    icon: <Users className="w-6 h-6" />,
    trend: [100, 120, 135, 145, 160, 175, 190],
    description: 'Active users across all tools'
  },
  {
    id: 'tools-used',
    title: 'Tools Generated',
    value: '45,789',
    change: 23.1,
    changeType: 'increase',
    icon: <Zap className="w-6 h-6" />,
    trend: [80, 95, 110, 125, 140, 155, 178],
    description: 'AI tools generated this month'
  },
  {
    id: 'revenue',
    title: 'Monthly Revenue',
    value: '$89,432',
    change: 8.7,
    changeType: 'increase',
    icon: <DollarSign className="w-6 h-6" />,
    trend: [70, 82, 88, 95, 103, 108, 115],
    description: 'Subscription and usage revenue'
  },
  {
    id: 'success-rate',
    title: 'Success Rate',
    value: '94.2%',
    change: 2.1,
    changeType: 'increase',
    icon: <Target className="w-6 h-6" />,
    trend: [85, 87, 90, 92, 93, 94, 94.2],
    description: 'Tool generation success rate'
  },
  {
    id: 'avg-session',
    title: 'Avg. Session Time',
    value: '24m 32s',
    change: -5.2,
    changeType: 'decrease',
    icon: <Clock className="w-6 h-6" />,
    trend: [30, 28, 26, 25.5, 25, 24.8, 24.5],
    description: 'Average user session duration'
  },
  {
    id: 'deployment-success',
    title: 'Deployment Success',
    value: '87.9%',
    change: 12.4,
    changeType: 'increase',
    icon: <Layers className="w-6 h-6" />,
    trend: [75, 78, 82, 85, 86, 87.5, 87.9],
    description: 'Successful deployments rate'
  }
];

const mockChartData: ChartData[] = [
  { name: 'Jan', value: 4000, change: 12 },
  { name: 'Feb', value: 3000, change: -5 },
  { name: 'Mar', value: 5000, change: 18 },
  { name: 'Apr', value: 4500, change: 8 },
  { name: 'May', value: 6000, change: 25 },
  { name: 'Jun', value: 5500, change: 15 },
  { name: 'Jul', value: 7000, change: 30 }
];

const toolUsageData = [
  { name: 'Code Generator', usage: 45, growth: 15.2 },
  { name: 'Full-Stack Builder', usage: 38, growth: 23.1 },
  { name: 'Logo Generator', usage: 32, growth: 8.7 },
  { name: 'Content Creator', usage: 28, growth: 12.4 },
  { name: 'API Generator', usage: 25, growth: 18.9 },
];

export function AnalyticsInsightsDashboard({ onClose }: AnalyticsInsightsDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const totalUsers = useMemo(() => {
    return mockMetrics.find(m => m.id === 'total-users')?.value || '0';
  }, []);

  const totalRevenue = useMemo(() => {
    return mockMetrics.find(m => m.id === 'revenue')?.value || '$0';
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto bg-card border border-border rounded-lg shadow-lg ff-fade-in-up">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <BarChart3 className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold ff-text-gradient">Analytics & Insights</h1>
            <p className="text-sm text-muted-foreground">
              Real-time performance metrics and business intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{totalUsers}</div>
              <div className="text-xs text-muted-foreground">Users</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-success">{totalRevenue}</div>
              <div className="text-xs text-muted-foreground">Revenue</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[100px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 days</SelectItem>
                <SelectItem value="30d">30 days</SelectItem>
                <SelectItem value="90d">90 days</SelectItem>
                <SelectItem value="1y">1 year</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-8"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>

            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8">
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockMetrics.map((metric, index) => (
                <Card 
                  key={metric.id} 
                  className="ff-card-interactive"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {metric.icon}
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${
                        metric.changeType === 'increase' ? 'text-success' : 'text-destructive'
                      }`}>
                        {metric.changeType === 'increase' ? (
                          <ArrowUp className="w-3 h-3" />
                        ) : (
                          <ArrowDown className="w-3 h-3" />
                        )}
                        {Math.abs(metric.change)}%
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">{metric.value}</h3>
                      <p className="text-sm font-medium text-foreground">{metric.title}</p>
                      <p className="text-xs text-muted-foreground">{metric.description}</p>
                    </div>

                    {/* Mini trend chart */}
                    <div className="mt-4 h-12 flex items-end gap-1">
                      {metric.trend.map((value, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-primary/20 rounded-sm transition-all duration-300"
                          style={{
                            height: `${(value / Math.max(...metric.trend)) * 100}%`,
                            backgroundColor: i === metric.trend.length - 1 ? 'var(--ff-primary)' : undefined
                          }}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Usage Trends */}
              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Usage Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockChartData.map((data, index) => (
                      <div key={data.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium w-8">{data.name}</span>
                          <div className="flex-1 bg-muted rounded-full h-2 w-32">
                            <div
                              className="bg-primary rounded-full h-2 transition-all duration-500"
                              style={{
                                width: `${(data.value / Math.max(...mockChartData.map(d => d.value))) * 100}%`,
                                animationDelay: `${index * 100}ms`
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{data.value.toLocaleString()}</span>
                          {data.change && (
                            <span className={`text-xs flex items-center gap-1 ${
                              data.change > 0 ? 'text-success' : 'text-destructive'
                            }`}>
                              {data.change > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                              {Math.abs(data.change)}%
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Tools */}
              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-secondary" />
                    Top Performing Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {toolUsageData.map((tool, index) => (
                      <div key={tool.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{tool.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{tool.usage}%</span>
                            <span className="text-xs text-success flex items-center gap-1">
                              <ArrowUp className="w-3 h-3" />
                              {tool.growth}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-secondary to-primary rounded-full h-2 transition-all duration-700"
                            style={{
                              width: `${tool.usage}%`,
                              animationDelay: `${index * 150}ms`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="ff-hover-scale">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                  <Button variant="outline" className="ff-hover-scale">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Report
                  </Button>
                  <Button variant="outline" className="ff-hover-scale">
                    <Filter className="w-4 h-4 mr-2" />
                    Custom Filter
                  </Button>
                  <Button variant="outline" className="ff-hover-scale">
                    <Eye className="w-4 h-4 mr-2" />
                    Live Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle>User Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Detailed user analytics will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="mt-6">
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle>Tool Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Tool performance metrics will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="mt-6">
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Revenue analytics will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AnalyticsInsightsDashboard;