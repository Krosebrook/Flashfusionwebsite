import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { 
  Users, 
  TrendingUp, 
  TrendingDown,
  Globe,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  Tablet,
  User,
  Calendar,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react';

interface AudienceAnalyticsProps {
  user: any;
  userTier: 'free' | 'pro' | 'enterprise';
}

interface AudienceData {
  totalFollowers: number;
  monthlyGrowth: number;
  demographics: {
    ageGroups: { range: string; percentage: number }[];
    genderSplit: { male: number; female: number; other: number };
    topLocations: { country: string; percentage: number }[];
  };
  engagement: {
    averageRate: number;
    bestPerformingContent: string;
    peakTimes: { day: string; hour: number }[];
  };
  deviceUsage: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  contentPerformance: {
    topPosts: Array<{
      id: string;
      content: string;
      platform: string;
      engagement: number;
      reach: number;
      date: string;
    }>;
  };
}

export function AudienceAnalytics({ user, userTier }: AudienceAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('30days');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  
  const [audienceData] = useState<AudienceData>({
    totalFollowers: 45280,
    monthlyGrowth: 12.5,
    demographics: {
      ageGroups: [
        { range: '18-24', percentage: 35 },
        { range: '25-34', percentage: 42 },
        { range: '35-44', percentage: 18 },
        { range: '45+', percentage: 5 }
      ],
      genderSplit: { male: 58, female: 40, other: 2 },
      topLocations: [
        { country: 'United States', percentage: 35 },
        { country: 'United Kingdom', percentage: 15 },
        { country: 'Canada', percentage: 12 },
        { country: 'Australia', percentage: 8 },
        { country: 'Germany', percentage: 7 }
      ]
    },
    engagement: {
      averageRate: 4.8,
      bestPerformingContent: 'Educational Tech Content',
      peakTimes: [
        { day: 'Tuesday', hour: 14 },
        { day: 'Wednesday', hour: 15 },
        { day: 'Thursday', hour: 13 }
      ]
    },
    deviceUsage: {
      mobile: 68,
      desktop: 24,
      tablet: 8
    },
    contentPerformance: {
      topPosts: [
        {
          id: '1',
          content: 'AI tools that every content creator should know about',
          platform: 'Instagram',
          engagement: 1250,
          reach: 15400,
          date: '2024-03-10'
        },
        {
          id: '2',
          content: 'Building my first AI-powered web app - full tutorial',
          platform: 'YouTube',
          engagement: 2100,
          reach: 8900,
          date: '2024-03-08'
        },
        {
          id: '3',
          content: 'The future of no-code development platforms',
          platform: 'LinkedIn',
          engagement: 890,
          reach: 12300,
          date: '2024-03-05'
        }
      ]
    }
  });

  const MetricCard = ({ icon: Icon, title, value, change, color = "text-primary" }: any) => (
    <Card className="p-6 ff-card-interactive">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-lg bg-${color === 'text-primary' ? 'primary' : color === 'text-secondary' ? 'secondary' : 'accent'}/10 flex items-center justify-center`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 text-sm ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span>{change > 0 ? '+' : ''}{change}%</span>
          </div>
        )}
      </div>
    </Card>
  );

  const AgeGroupChart = () => (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Age Demographics</h3>
      <div className="space-y-4">
        {audienceData.demographics.ageGroups.map((group) => (
          <div key={group.range} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{group.range}</span>
              <span>{group.percentage}%</span>
            </div>
            <Progress value={group.percentage} className="h-2" />
          </div>
        ))}
      </div>
    </Card>
  );

  const LocationChart = () => (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Top Locations</h3>
      <div className="space-y-4">
        {audienceData.demographics.topLocations.map((location) => (
          <div key={location.country} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{location.country}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-16">
                <Progress value={location.percentage} className="h-2" />
              </div>
              <span className="text-sm font-semibold">{location.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  const GenderChart = () => (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Gender Distribution</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-primary"></div>
            <span className="text-sm">Male</span>
          </div>
          <span className="font-semibold">{audienceData.demographics.genderSplit.male}%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-secondary"></div>
            <span className="text-sm">Female</span>
          </div>
          <span className="font-semibold">{audienceData.demographics.genderSplit.female}%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-accent"></div>
            <span className="text-sm">Other</span>
          </div>
          <span className="font-semibold">{audienceData.demographics.genderSplit.other}%</span>
        </div>
        
        <div className="mt-4">
          <div className="flex h-4 rounded-full overflow-hidden">
            <div 
              className="bg-primary" 
              style={{ width: `${audienceData.demographics.genderSplit.male}%` }}
            ></div>
            <div 
              className="bg-secondary" 
              style={{ width: `${audienceData.demographics.genderSplit.female}%` }}
            ></div>
            <div 
              className="bg-accent" 
              style={{ width: `${audienceData.demographics.genderSplit.other}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Card>
  );

  const DeviceUsageChart = () => (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Device Usage</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Smartphone className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Mobile</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-20">
              <Progress value={audienceData.deviceUsage.mobile} className="h-2" />
            </div>
            <span className="font-semibold">{audienceData.deviceUsage.mobile}%</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Monitor className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium">Desktop</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-20">
              <Progress value={audienceData.deviceUsage.desktop} className="h-2" />
            </div>
            <span className="font-semibold">{audienceData.deviceUsage.desktop}%</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Tablet className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">Tablet</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-20">
              <Progress value={audienceData.deviceUsage.tablet} className="h-2" />
            </div>
            <span className="font-semibold">{audienceData.deviceUsage.tablet}%</span>
          </div>
        </div>
      </div>
    </Card>
  );

  const TopContentCard = ({ post }: { post: typeof audienceData.contentPerformance.topPosts[0] }) => (
    <Card className="p-4 ff-card-interactive">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm font-medium line-clamp-2 mb-2">{post.content}</p>
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="outline" className="text-xs">{post.platform}</Badge>
            <span className="text-xs text-muted-foreground">{post.date}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-primary">{post.engagement.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Engagement</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-secondary">{post.reach.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Reach</div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Audience Analytics</h2>
          <p className="text-muted-foreground">
            Deep insights into your audience demographics and engagement patterns
          </p>
        </div>
        
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={Users}
          title="Total Followers"
          value={audienceData.totalFollowers.toLocaleString()}
          change={audienceData.monthlyGrowth}
          color="text-primary"
        />
        <MetricCard
          icon={TrendingUp}
          title="Engagement Rate"
          value={`${audienceData.engagement.averageRate}%`}
          change={0.8}
          color="text-secondary"
        />
        <MetricCard
          icon={Globe}
          title="Monthly Reach"
          value="125.3K"
          change={15.2}
          color="text-accent"
        />
        <MetricCard
          icon={Activity}
          title="Active Rate"
          value="89.2%"
          change={3.1}
          color="text-primary"
        />
      </div>

      <Tabs defaultValue="demographics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="content">Top Content</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AgeGroupChart />
            <GenderChart />
            <LocationChart />
            <DeviceUsageChart />
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Best Posting Times</h3>
              <div className="space-y-4">
                {audienceData.engagement.peakTimes.map((time) => (
                  <div key={`${time.day}-${time.hour}`} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium">{time.day}</span>
                    </div>
                    <Badge variant="outline">
                      {time.hour}:00 - {time.hour + 1}:00
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Content Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Best Performing Content</span>
                  <span className="font-semibold">{audienceData.engagement.bestPerformingContent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Average Engagement</span>
                  <span className="font-semibold">{audienceData.engagement.averageRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Peak Engagement Day</span>
                  <span className="font-semibold">Wednesday</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Optimal Post Length</span>
                  <span className="font-semibold">150-200 characters</span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Weekly Engagement Pattern</h3>
            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                const engagement = [65, 80, 95, 75, 60, 45, 50][index];
                return (
                  <div key={day} className="text-center">
                    <div className="text-xs text-muted-foreground mb-2">{day}</div>
                    <div className="h-20 bg-muted rounded relative overflow-hidden">
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-primary/60 transition-all duration-300"
                        style={{ height: `${engagement}%` }}
                      ></div>
                    </div>
                    <div className="text-xs font-semibold mt-1">{engagement}%</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {audienceData.contentPerformance.topPosts.map((post) => (
              <TopContentCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Key Insights</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Peak Engagement Window</p>
                    <p className="text-xs text-muted-foreground">Your audience is most active on Tuesday-Thursday between 2-4 PM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Content Sweet Spot</p>
                    <p className="text-xs text-muted-foreground">Educational tech content gets 3x more engagement than other topics</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Mobile-First Audience</p>
                    <p className="text-xs text-muted-foreground">68% of your audience consumes content on mobile devices</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Growth Opportunities</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded">
                  <span className="text-sm">Increase video content</span>
                  <Badge className="bg-green-500/20 text-green-400">High Impact</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded">
                  <span className="text-sm">Post during peak hours</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400">Medium Impact</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded">
                  <span className="text-sm">Expand to TikTok</span>
                  <Badge className="bg-green-500/20 text-green-400">High Impact</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded">
                  <span className="text-sm">More interactive content</span>
                  <Badge className="bg-blue-500/20 text-blue-400">Low Impact</Badge>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}