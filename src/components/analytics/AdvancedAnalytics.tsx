import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, Code, Zap, Award, 
  Calendar, Clock, Target, Activity, BarChart3, PieChart as PieChartIcon
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AnalyticsData {
  overview: {
    totalProjects: number;
    totalUsers: number;
    toolUsage: number;
    deployments: number;
    avgSessionTime: number;
    userGrowth: number;
    projectGrowth: number;
    toolGrowth: number;
  };
  projectMetrics: Array<{
    date: string;
    projects: number;
    deployments: number;
    tools: number;
  }>;
  toolUsage: Array<{
    name: string;
    usage: number;
    category: string;
    growth: number;
  }>;
  userEngagement: Array<{
    date: string;
    activeUsers: number;
    sessions: number;
    avgDuration: number;
  }>;
  performanceMetrics: {
    avgLoadTime: number;
    errorRate: number;
    uptime: number;
    satisfaction: number;
  };
}

interface AdvancedAnalyticsProps {
  timeRange: '7d' | '30d' | '90d' | '1y';
  userId?: string;
}

export function AdvancedAnalytics({ timeRange = '30d', userId }: AdvancedAnalyticsProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange, userId]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Simulate loading comprehensive analytics data
      // In a real app, this would come from your analytics service
      const mockData: AnalyticsData = {
        overview: {
          totalProjects: 1247,
          totalUsers: 8934,
          toolUsage: 45672,
          deployments: 3421,
          avgSessionTime: 24.5,
          userGrowth: 12.3,
          projectGrowth: 8.7,
          toolGrowth: 23.1
        },
        projectMetrics: [
          { date: '2024-01', projects: 89, deployments: 67, tools: 234 },
          { date: '2024-02', projects: 124, deployments: 89, tools: 312 },
          { date: '2024-03', projects: 156, deployments: 134, tools: 445 },
          { date: '2024-04', projects: 189, deployments: 167, tools: 523 },
          { date: '2024-05', projects: 234, deployments: 198, tools: 634 },
          { date: '2024-06', projects: 267, deployments: 234, tools: 756 }
        ],
        toolUsage: [
          { name: 'React Generator', usage: 8934, category: 'Frontend', growth: 15.2 },
          { name: 'API Builder', usage: 6745, category: 'Backend', growth: 23.4 },
          { name: 'UI Designer', usage: 5623, category: 'Design', growth: 12.1 },
          { name: 'Database Schema', usage: 4532, category: 'Database', growth: 18.7 },
          { name: 'Deploy Assistant', usage: 3421, category: 'DevOps', growth: 9.8 }
        ],
        userEngagement: [
          { date: '2024-01', activeUsers: 2341, sessions: 4567, avgDuration: 22.3 },
          { date: '2024-02', activeUsers: 2856, sessions: 5234, avgDuration: 24.1 },
          { date: '2024-03', activeUsers: 3234, sessions: 6123, avgDuration: 25.7 },
          { date: '2024-04', activeUsers: 3789, sessions: 7234, avgDuration: 23.9 },
          { date: '2024-05', activeUsers: 4123, sessions: 8456, avgDuration: 26.2 },
          { date: '2024-06', activeUsers: 4567, sessions: 9123, avgDuration: 24.8 }
        ],
        performanceMetrics: {
          avgLoadTime: 1.2,
          errorRate: 0.3,
          uptime: 99.9,
          satisfaction: 4.7
        }
      };
      
      setData(mockData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    format = 'number' 
  }: {
    title: string;
    value: number;
    change: number;
    icon: any;
    format?: 'number' | 'percentage' | 'time';
  }) => {
    const formatValue = () => {
      switch (format) {
        case 'percentage':
          return `${value}%`;
        case 'time':
          return `${value}min`;
        default:
          return formatNumber(value);
      }
    };

    return (
      <Card className="p-6 ff-card-interactive">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold">{formatValue()}</p>
            <div className="flex items-center mt-2">
              {change > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(change)}%
              </span>
            </div>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-8 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-20"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Projects"
          value={data.overview.totalProjects}
          change={data.overview.projectGrowth}
          icon={Code}
        />
        <MetricCard
          title="Active Users"
          value={data.overview.totalUsers}
          change={data.overview.userGrowth}
          icon={Users}
        />
        <MetricCard
          title="Tool Usage"
          value={data.overview.toolUsage}
          change={data.overview.toolGrowth}
          icon={Zap}
        />
        <MetricCard
          title="Avg Session"
          value={data.overview.avgSessionTime}
          change={5.2}
          icon={Clock}
          format="time"
        />
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Growth Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Project Growth
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.projectMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1E293B', 
                      border: '1px solid rgba(255,123,0,0.2)',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="projects" 
                    stroke="#FF7B00" 
                    fill="url(#projectGradient)" 
                  />
                  <defs>
                    <linearGradient id="projectGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF7B00" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FF7B00" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Performance Metrics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Performance Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Load Time</span>
                  <span className="font-semibold">{data.performanceMetrics.avgLoadTime}s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Error Rate</span>
                  <span className="font-semibold text-green-500">{data.performanceMetrics.errorRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Uptime</span>
                  <span className="font-semibold text-green-500">{data.performanceMetrics.uptime}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">User Satisfaction</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{data.performanceMetrics.satisfaction}/5</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < Math.floor(data.performanceMetrics.satisfaction) 
                              ? 'bg-yellow-400' 
                              : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Project Metrics Over Time</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data.projectMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    border: '1px solid rgba(255,123,0,0.2)',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey="projects" stroke="#FF7B00" strokeWidth={3} />
                <Line type="monotone" dataKey="deployments" stroke="#00B4D8" strokeWidth={3} />
                <Line type="monotone" dataKey="tools" stroke="#E91E63" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Tool Usage Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.toolUsage}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="usage"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.toolUsage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={
                        index === 0 ? '#FF7B00' :
                        index === 1 ? '#00B4D8' :
                        index === 2 ? '#E91E63' :
                        index === 3 ? '#10B981' :
                        '#F59E0B'
                      } />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Top Tools by Usage</h3>
              <div className="space-y-4">
                {data.toolUsage.map((tool, index) => (
                  <div key={tool.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{
                        backgroundColor: 
                          index === 0 ? '#FF7B00' :
                          index === 1 ? '#00B4D8' :
                          index === 2 ? '#E91E63' :
                          index === 3 ? '#10B981' :
                          '#F59E0B'
                      }} />
                      <div>
                        <p className="font-medium">{tool.name}</p>
                        <p className="text-sm text-muted-foreground">{tool.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatNumber(tool.usage)}</p>
                      <Badge variant={tool.growth > 15 ? 'default' : 'secondary'} className="text-xs">
                        +{tool.growth}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">User Engagement Trends</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data.userEngagement}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    border: '1px solid rgba(255,123,0,0.2)',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Bar dataKey="activeUsers" fill="#FF7B00" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sessions" fill="#00B4D8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}