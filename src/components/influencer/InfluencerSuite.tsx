import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Target, 
  Zap, 
  Star,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  DollarSign,
  BarChart3,
  PlayCircle,
  Image,
  Video,
  Mic,
  Globe
} from 'lucide-react';
import { SocialMediaManager } from './SocialMediaManager';
import { AudienceAnalytics } from './AudienceAnalytics';

interface InfluencerSuiteProps {
  user: any;
  userTier: 'free' | 'pro' | 'enterprise';
  setCurrentPage: (page: any) => void;
}

interface InfluencerMetrics {
  totalFollowers: number;
  totalEngagement: number;
  monthlyReach: number;
  conversionRate: number;
  avgEngagementRate: number;
  topPerformingPlatform: string;
  contentPieces: number;
  activeCampaigns: number;
}

interface ContentIdea {
  id: string;
  title: string;
  description: string;
  platform: string[];
  estimatedEngagement: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  trending: boolean;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  platforms: string[];
  startDate: string;
  endDate: string;
  status: 'Active' | 'Scheduled' | 'Completed' | 'Draft';
  budget: number;
  reach: number;
  engagement: number;
  conversion: number;
}

export function InfluencerSuite({ user, userTier, setCurrentPage }: InfluencerSuiteProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState<InfluencerMetrics>({
    totalFollowers: 45280,
    totalEngagement: 8750,
    monthlyReach: 125300,
    conversionRate: 3.2,
    avgEngagementRate: 4.8,
    topPerformingPlatform: 'Instagram',
    contentPieces: 24,
    activeCampaigns: 3
  });

  const [contentIdeas] = useState<ContentIdea[]>([
    {
      id: '1',
      title: 'AI Tools for Content Creators',
      description: 'Showcase the top 10 AI tools that every content creator should know about',
      platform: ['YouTube', 'Instagram', 'TikTok'],
      estimatedEngagement: 12500,
      difficulty: 'Medium',
      category: 'Technology',
      trending: true
    },
    {
      id: '2',
      title: '24-Hour Productivity Challenge',
      description: 'Document a full day using productivity hacks and AI tools',
      platform: ['Instagram', 'TikTok'],
      estimatedEngagement: 8200,
      difficulty: 'Hard',
      category: 'Lifestyle',
      trending: false
    },
    {
      id: '3',
      title: 'Quick Web Design Tips',
      description: 'Share 5 quick tips for better web design using AI assistance',
      platform: ['LinkedIn', 'Twitter'],
      estimatedEngagement: 5400,
      difficulty: 'Easy',
      category: 'Education',
      trending: true
    }
  ]);

  const [campaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Spring Product Launch',
      description: 'Promoting new AI-powered design tools',
      platforms: ['Instagram', 'YouTube', 'TikTok'],
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      status: 'Active',
      budget: 5000,
      reach: 125000,
      engagement: 8750,
      conversion: 1250
    },
    {
      id: '2',
      name: 'Educational Series',
      description: 'Weekly tutorials on AI development',
      platforms: ['YouTube', 'LinkedIn'],
      startDate: '2024-04-01',
      endDate: '2024-06-30',
      status: 'Scheduled',
      budget: 3000,
      reach: 0,
      engagement: 0,
      conversion: 0
    }
  ]);

  const MetricCard = ({ icon: Icon, label, value, change, color = "text-primary" }: any) => (
    <Card className="p-6 ff-card-interactive">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg bg-${color === 'text-primary' ? 'primary' : color === 'text-secondary' ? 'secondary' : 'accent'}/10 flex items-center justify-center`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
        {change && (
          <div className={`flex items-center space-x-1 text-sm ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
            <TrendingUp className="h-4 w-4" />
            <span>{change > 0 ? '+' : ''}{change}%</span>
          </div>
        )}
      </div>
    </Card>
  );

  const ContentIdeaCard = ({ idea }: { idea: ContentIdea }) => (
    <Card className="p-4 ff-card-interactive">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-semibold">{idea.title}</h4>
            {idea.trending && (
              <Badge className="bg-gradient-to-r from-primary to-secondary text-white">
                Trending
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-3">{idea.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {idea.platform.map((platform) => (
              <Badge key={platform} variant="outline" className="text-xs">
                {platform}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3 text-muted-foreground" />
                <span>{idea.estimatedEngagement.toLocaleString()}</span>
              </div>
              <Badge variant={
                idea.difficulty === 'Easy' ? 'default' : 
                idea.difficulty === 'Medium' ? 'secondary' : 'destructive'
              }>
                {idea.difficulty}
              </Badge>
            </div>
            <Button size="sm" variant="outline">
              Create Content
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  const CampaignCard = ({ campaign }: { campaign: Campaign }) => (
    <Card className="p-6 ff-card-interactive">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-semibold">{campaign.name}</h4>
            <Badge 
              variant={
                campaign.status === 'Active' ? 'default' :
                campaign.status === 'Scheduled' ? 'secondary' :
                campaign.status === 'Completed' ? 'outline' : 'destructive'
              }
            >
              {campaign.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{campaign.description}</p>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {campaign.platforms.map((platform) => (
              <Badge key={platform} variant="outline" className="text-xs">
                {platform}
              </Badge>
            ))}
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-sm font-semibold">${campaign.budget.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Budget</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold">{campaign.reach.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Reach</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold">{campaign.engagement.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold">{campaign.conversion.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Conversions</div>
            </div>
          </div>
          
          {campaign.status === 'Active' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>65%</span>
              </div>
              <Progress value={65} className="ff-progress-bar" />
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          {campaign.startDate} - {campaign.endDate}
        </div>
        <Button size="sm" variant="outline">
          View Details
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Influencer Suite
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive tools for content creators and social media influencers
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => setCurrentPage('content-creation-hub')}
          >
            <Zap className="h-4 w-4 mr-2" />
            Content Hub
          </Button>
          <Button className="bg-gradient-to-r from-primary to-secondary">
            <Target className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content Ideas</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="social">Social Manager</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              icon={Users}
              label="Total Followers"
              value={metrics.totalFollowers.toLocaleString()}
              change={12.5}
              color="text-primary"
            />
            <MetricCard
              icon={Heart}
              label="Monthly Engagement"
              value={metrics.totalEngagement.toLocaleString()}
              change={8.3}
              color="text-secondary"
            />
            <MetricCard
              icon={Eye}
              label="Monthly Reach"
              value={metrics.monthlyReach.toLocaleString()}
              change={15.7}
              color="text-accent"
            />
            <MetricCard
              icon={DollarSign}
              label="Conversion Rate"
              value={`${metrics.conversionRate}%`}
              change={2.1}
              color="text-primary"
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Platform Performance</h3>
              <div className="space-y-4">
                {[
                  { platform: 'Instagram', followers: '18.5K', engagement: '4.8%', color: 'from-pink-500 to-purple-500' },
                  { platform: 'YouTube', followers: '12.3K', engagement: '6.2%', color: 'from-red-500 to-red-600' },
                  { platform: 'TikTok', followers: '8.9K', engagement: '7.1%', color: 'from-black to-gray-800' },
                  { platform: 'LinkedIn', followers: '5.5K', engagement: '3.4%', color: 'from-blue-600 to-blue-700' }
                ].map((item) => (
                  <div key={item.platform} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                        <Globe className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">{item.platform}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold">{item.followers}</div>
                        <div className="text-muted-foreground">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{item.engagement}</div>
                        <div className="text-muted-foreground">Engagement</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { action: 'Posted new video on YouTube', time: '2 hours ago', engagement: '+1.2K views' },
                  { action: 'Instagram story published', time: '4 hours ago', engagement: '+450 views' },
                  { action: 'LinkedIn article shared', time: '1 day ago', engagement: '+89 reactions' },
                  { action: 'TikTok video went viral', time: '2 days ago', engagement: '+5.7K views' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium text-sm">{activity.action}</div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                    <div className="text-xs text-green-400 font-medium">
                      {activity.engagement}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Image className="h-6 w-6" />
                <span className="text-sm">Create Post</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Video className="h-6 w-6" />
                <span className="text-sm">Record Video</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Schedule Content</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">View Analytics</span>
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">AI-Generated Content Ideas</h3>
            <Button className="bg-gradient-to-r from-primary to-secondary">
              <Zap className="h-4 w-4 mr-2" />
              Generate New Ideas
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {contentIdeas.map((idea) => (
              <ContentIdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Active Campaigns</h3>
            <Button className="bg-gradient-to-r from-primary to-secondary">
              <Target className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </div>
          
          <div className="space-y-6">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AudienceAnalytics user={user} userTier={userTier} />
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <SocialMediaManager user={user} userTier={userTier} />
        </TabsContent>
      </Tabs>
    </div>
  );
}