import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  Users, 
  Share2, 
  TrendingUp, 
  Target, 
  Calendar, 
  MessageCircle,
  Mail,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  Eye,
  Heart,
  Repeat,
  BarChart3,
  Clock,
  Zap,
  Star,
  Gift,
  Megaphone,
  Send,
  Copy,
  Download,
  Play,
  Pause,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { analyticsService } from '../../services/AnalyticsService';

interface MarketingCampaign {
  id: string;
  name: string;
  type: 'social' | 'email' | 'content' | 'influencer' | 'pr' | 'community';
  platform: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  startDate: number;
  endDate: number;
  budget: number;
  spent: number;
  metrics: {
    reach: number;
    impressions: number;
    engagement: number;
    clicks: number;
    conversions: number;
    cost_per_acquisition: number;
  };
  content: {
    title: string;
    description: string;
    media?: string;
    cta: string;
    hashtags?: string[];
  };
  targeting: {
    demographics: string[];
    interests: string[];
    location: string[];
    devices: string[];
  };
}

interface InfluencerOutreach {
  id: string;
  name: string;
  platform: string;
  followers: number;
  engagement_rate: number;
  status: 'identified' | 'contacted' | 'negotiating' | 'confirmed' | 'completed';
  fee: number;
  deliverables: string[];
  expected_reach: number;
  contact_date?: number;
  campaign_date?: number;
}

interface ContentPiece {
  id: string;
  title: string;
  type: 'blog' | 'video' | 'infographic' | 'case_study' | 'tutorial' | 'announcement';
  platform: string[];
  status: 'planned' | 'in_progress' | 'review' | 'approved' | 'published';
  publish_date: number;
  author: string;
  performance: {
    views: number;
    shares: number;
    likes: number;
    comments: number;
    conversion_rate: number;
  };
  seo_score: number;
}

interface CommunityMetrics {
  discord: {
    members: number;
    active_users: number;
    messages_per_day: number;
    growth_rate: number;
  };
  twitter: {
    followers: number;
    engagement_rate: number;
    mentions: number;
    hashtag_performance: Record<string, number>;
  };
  github: {
    stars: number;
    forks: number;
    contributors: number;
    issues: number;
  };
  reddit: {
    subscribers: number;
    posts_per_week: number;
    upvote_ratio: number;
  };
}

interface LaunchGoal {
  id: string;
  metric: string;
  target: number;
  current: number;
  deadline: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  campaigns: string[];
}

const SOCIAL_PLATFORMS = [
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: '#1DA1F2' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0077B5' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: '#FF0000' },
  { id: 'discord', name: 'Discord', icon: MessageCircle, color: '#5865F2' },
  { id: 'reddit', name: 'Reddit', icon: Globe, color: '#FF4500' }
];

const CONTENT_TEMPLATES = [
  {
    id: 'launch-announcement',
    name: 'Launch Announcement',
    template: '🚀 We\'re launching FlashFusion! Transform your ideas into production-ready apps with 60+ AI tools. #FlashFusion #AIDevTools #Launch'
  },
  {
    id: 'feature-highlight',
    name: 'Feature Highlight',
    template: '⚡ New Feature: [FEATURE NAME] - [BRIEF DESCRIPTION]. Build faster with FlashFusion\'s AI assistance. #FlashFusion #ProductUpdate'
  },
  {
    id: 'user-testimonial',
    name: 'User Testimonial',
    template: '"FlashFusion helped me build my app 10x faster!" - [USER NAME]. Join thousands of developers already building with AI. #FlashFusion #Testimonial'
  },
  {
    id: 'tutorial-post',
    name: 'Tutorial Post',
    template: '📚 Tutorial: How to [TASK] with FlashFusion in under 5 minutes. Perfect for [TARGET AUDIENCE]. Link in bio! #Tutorial #FlashFusion'
  }
];

export function LaunchMarketingCampaign() {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [influencers, setInfluencers] = useState<InfluencerOutreach[]>([]);
  const [contentPieces, setContentPieces] = useState<ContentPiece[]>([]);
  const [communityMetrics, setCommunityMetrics] = useState<CommunityMetrics | null>(null);
  const [launchGoals, setLaunchGoals] = useState<LaunchGoal[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<MarketingCampaign | null>(null);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'social' as MarketingCampaign['type'],
    platform: '',
    content: '',
    budget: 1000,
    duration: 7
  });
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize marketing data
  useEffect(() => {
    const initializeMarketingData = async () => {
      try {
        // Mock campaigns
        const mockCampaigns: MarketingCampaign[] = [
          {
            id: 'launch-twitter',
            name: 'Twitter Launch Campaign',
            type: 'social',
            platform: 'Twitter',
            status: 'active',
            startDate: Date.now() - 86400000,
            endDate: Date.now() + 604800000,
            budget: 5000,
            spent: 1250,
            metrics: {
              reach: 45000,
              impressions: 125000,
              engagement: 3400,
              clicks: 890,
              conversions: 47,
              cost_per_acquisition: 26.60
            },
            content: {
              title: 'FlashFusion Launch - AI Development Revolution',
              description: 'Transform ideas into production-ready applications with 60+ AI tools',
              cta: 'Try FlashFusion Free',
              hashtags: ['#FlashFusion', '#AIDevTools', '#Launch', '#Developer']
            },
            targeting: {
              demographics: ['Developers', 'Tech Entrepreneurs', 'Startup Founders'],
              interests: ['AI/ML', 'Software Development', 'Productivity Tools'],
              location: ['United States', 'Canada', 'United Kingdom', 'Germany'],
              devices: ['Desktop', 'Mobile']
            }
          },
          {
            id: 'linkedin-b2b',
            name: 'LinkedIn B2B Campaign',
            type: 'social',
            platform: 'LinkedIn',
            status: 'scheduled',
            startDate: Date.now() + 86400000,
            endDate: Date.now() + 1209600000,
            budget: 8000,
            spent: 0,
            metrics: {
              reach: 0,
              impressions: 0,
              engagement: 0,
              clicks: 0,
              conversions: 0,
              cost_per_acquisition: 0
            },
            content: {
              title: 'Enterprise AI Development Platform',
              description: 'Scale your development team productivity with FlashFusion\'s enterprise-grade AI tools',
              cta: 'Request Demo',
              hashtags: ['#EnterpriseAI', '#DevTools', '#Productivity']
            },
            targeting: {
              demographics: ['CTOs', 'Engineering Managers', 'Tech Leads'],
              interests: ['Enterprise Software', 'AI/ML', 'DevOps'],
              location: ['United States', 'Canada', 'United Kingdom'],
              devices: ['Desktop']
            }
          },
          {
            id: 'product-hunt',
            name: 'Product Hunt Launch',
            type: 'pr',
            platform: 'Product Hunt',
            status: 'scheduled',
            startDate: Date.now() + 172800000,
            endDate: Date.now() + 259200000,
            budget: 2000,
            spent: 500,
            metrics: {
              reach: 25000,
              impressions: 85000,
              engagement: 1200,
              clicks: 450,
              conversions: 78,
              cost_per_acquisition: 6.41
            },
            content: {
              title: 'FlashFusion - AI Development Assistant',
              description: 'The ultimate AI-powered development platform with 60+ tools for building production-ready applications',
              cta: 'Upvote & Try Free'
            },
            targeting: {
              demographics: ['Product Hunt Community', 'Early Adopters', 'Tech Enthusiasts'],
              interests: ['New Products', 'AI Tools', 'Developer Tools'],
              location: ['Global'],
              devices: ['Desktop', 'Mobile']
            }
          },
          {
            id: 'youtube-content',
            name: 'YouTube Content Series',
            type: 'content',
            platform: 'YouTube',
            status: 'active',
            startDate: Date.now() - 432000000,
            endDate: Date.now() + 2592000000,
            budget: 15000,
            spent: 3750,
            metrics: {
              reach: 75000,
              impressions: 180000,
              engagement: 8500,
              clicks: 2100,
              conversions: 156,
              cost_per_acquisition: 24.04
            },
            content: {
              title: 'FlashFusion Tutorial Series',
              description: 'Learn to build full-stack applications with AI assistance',
              cta: 'Subscribe & Try FlashFusion'
            },
            targeting: {
              demographics: ['Developers', 'Students', 'Tech Enthusiasts'],
              interests: ['Programming Tutorials', 'AI/ML', 'Web Development'],
              location: ['Global'],
              devices: ['Desktop', 'Mobile', 'TV']
            }
          }
        ];

        // Mock influencers
        const mockInfluencers: InfluencerOutreach[] = [
          {
            id: 'inf-1',
            name: 'TechGuru_Dev',
            platform: 'Twitter',
            followers: 125000,
            engagement_rate: 4.2,
            status: 'confirmed',
            fee: 2500,
            deliverables: ['Tweet thread', 'Retweet campaign', 'Live demo'],
            expected_reach: 80000,
            contact_date: Date.now() - 604800000,
            campaign_date: Date.now() + 86400000
          },
          {
            id: 'inf-2',
            name: 'CodeWithSarah',
            platform: 'YouTube',
            followers: 89000,
            engagement_rate: 6.8,
            status: 'negotiating',
            fee: 5000,
            deliverables: ['Full video review', 'Shorts series', 'Community post'],
            expected_reach: 120000,
            contact_date: Date.now() - 432000000
          },
          {
            id: 'inf-3',
            name: 'DevLifestyle',
            platform: 'Instagram',
            followers: 67000,
            engagement_rate: 8.1,
            status: 'contacted',
            fee: 1800,
            deliverables: ['Story series', 'Reel', 'Post'],
            expected_reach: 45000,
            contact_date: Date.now() - 172800000
          }
        ];

        // Mock content pieces
        const mockContent: ContentPiece[] = [
          {
            id: 'content-1',
            title: 'FlashFusion Launch: The Future of AI Development',
            type: 'blog',
            platform: ['Website', 'Medium', 'Dev.to'],
            status: 'published',
            publish_date: Date.now() - 86400000,
            author: 'Marketing Team',
            performance: {
              views: 12500,
              shares: 340,
              likes: 890,
              comments: 156,
              conversion_rate: 3.2
            },
            seo_score: 92
          },
          {
            id: 'content-2',
            title: 'Building a Full-Stack App in 10 Minutes with FlashFusion',
            type: 'video',
            platform: ['YouTube', 'Twitter', 'LinkedIn'],
            status: 'published',
            publish_date: Date.now() - 172800000,
            author: 'Product Team',
            performance: {
              views: 45000,
              shares: 1200,
              likes: 3400,
              comments: 567,
              conversion_rate: 5.8
            },
            seo_score: 87
          },
          {
            id: 'content-3',
            title: 'FlashFusion vs Competition: Feature Comparison',
            type: 'infographic',
            platform: ['Twitter', 'LinkedIn', 'Instagram'],
            status: 'approved',
            publish_date: Date.now() + 86400000,
            author: 'Design Team',
            performance: {
              views: 0,
              shares: 0,
              likes: 0,
              comments: 0,
              conversion_rate: 0
            },
            seo_score: 0
          }
        ];

        // Mock community metrics
        const mockCommunityMetrics: CommunityMetrics = {
          discord: {
            members: 2340,
            active_users: 456,
            messages_per_day: 890,
            growth_rate: 15.2
          },
          twitter: {
            followers: 8900,
            engagement_rate: 4.7,
            mentions: 234,
            hashtag_performance: {
              '#FlashFusion': 1240,
              '#AIDevTools': 890,
              '#BuildFaster': 567,
              '#Developer': 2340
            }
          },
          github: {
            stars: 1560,
            forks: 234,
            contributors: 23,
            issues: 45
          },
          reddit: {
            subscribers: 1890,
            posts_per_week: 12,
            upvote_ratio: 0.94
          }
        };

        // Mock launch goals
        const mockGoals: LaunchGoal[] = [
          {
            id: 'goal-signups',
            metric: 'User Signups',
            target: 500,
            current: 287,
            deadline: Date.now() + 604800000,
            priority: 'critical',
            campaigns: ['launch-twitter', 'linkedin-b2b', 'product-hunt']
          },
          {
            id: 'goal-social-followers',
            metric: 'Social Media Followers',
            target: 10000,
            current: 8900,
            deadline: Date.now() + 1209600000,
            priority: 'high',
            campaigns: ['launch-twitter', 'youtube-content']
          },
          {
            id: 'goal-community-members',
            metric: 'Community Members',
            target: 3000,
            current: 2340,
            deadline: Date.now() + 1209600000,
            priority: 'medium',
            campaigns: ['youtube-content']
          },
          {
            id: 'goal-content-views',
            metric: 'Content Views',
            target: 100000,
            current: 57500,
            deadline: Date.now() + 1814400000,
            priority: 'medium',
            campaigns: ['youtube-content']
          }
        ];

        setCampaigns(mockCampaigns);
        setInfluencers(mockInfluencers);
        setContentPieces(mockContent);
        setCommunityMetrics(mockCommunityMetrics);
        setLaunchGoals(mockGoals);

      } catch (error) {
        console.error('Failed to load marketing data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeMarketingData();
  }, []);

  const handleCreateCampaign = useCallback(async () => {
    if (!newCampaign.name.trim() || !newCampaign.platform) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsCreatingCampaign(true);

    try {
      // Simulate campaign creation
      await new Promise(resolve => setTimeout(resolve, 1500));

      const campaign: MarketingCampaign = {
        id: `campaign-${Date.now()}`,
        name: newCampaign.name,
        type: newCampaign.type,
        platform: newCampaign.platform,
        status: 'draft',
        startDate: Date.now() + 86400000,
        endDate: Date.now() + (newCampaign.duration * 86400000),
        budget: newCampaign.budget,
        spent: 0,
        metrics: {
          reach: 0,
          impressions: 0,
          engagement: 0,
          clicks: 0,
          conversions: 0,
          cost_per_acquisition: 0
        },
        content: {
          title: newCampaign.name,
          description: newCampaign.content,
          cta: 'Try FlashFusion Free',
          hashtags: ['#FlashFusion']
        },
        targeting: {
          demographics: ['Developers'],
          interests: ['Software Development'],
          location: ['United States'],
          devices: ['Desktop', 'Mobile']
        }
      };

      setCampaigns(prev => [campaign, ...prev]);
      
      // Reset form
      setNewCampaign({
        name: '',
        type: 'social',
        platform: '',
        content: '',
        budget: 1000,
        duration: 7
      });

      toast.success('Campaign created successfully!');
      analyticsService.trackFeatureUsage('campaign-created', {
        type: campaign.type,
        platform: campaign.platform,
        budget: campaign.budget
      });

    } catch (error) {
      toast.error('Failed to create campaign');
    } finally {
      setIsCreatingCampaign(false);
    }
  }, [newCampaign]);

  const handleLaunchCampaign = useCallback((campaignId: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: 'active', startDate: Date.now() }
        : campaign
    ));
    toast.success('Campaign launched successfully!');
    analyticsService.trackFeatureUsage('campaign-launched', { campaignId });
  }, []);

  const handlePauseCampaign = useCallback((campaignId: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: 'paused' }
        : campaign
    ));
    toast.info('Campaign paused');
  }, []);

  const copyTemplate = useCallback((template: string) => {
    navigator.clipboard.writeText(template);
    toast.success('Template copied to clipboard!');
  }, []);

  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalReach = campaigns.reduce((sum, campaign) => sum + campaign.metrics.reach, 0);
  const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.metrics.conversions, 0);
  const avgCAC = totalSpent > 0 && totalConversions > 0 ? totalSpent / totalConversions : 0;

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const completedGoals = launchGoals.filter(goal => goal.current >= goal.target).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="ff-fade-in-up">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ff-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold ff-text-gradient">Launch Marketing Campaign</h1>
          <p className="text-muted-foreground">
            Drive user acquisition and build community for FlashFusion's successful launch
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge 
            variant={activeCampaigns > 0 ? 'default' : 'secondary'}
            className={`font-medium ${activeCampaigns > 0 ? 'ff-badge-glow' : ''}`}
          >
            <Rocket className="h-3 w-3 mr-1" />
            {activeCampaigns} Active Campaign{activeCampaigns === 1 ? '' : 's'}
          </Badge>
          
          <Button
            onClick={() => setSelectedCampaign(null)}
            className="ff-btn-primary"
          >
            <Megaphone className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Marketing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium">Total Reach</h3>
            </div>
            <p className="text-2xl font-bold">{totalReach.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">
              {totalConversions} conversions
            </p>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <h3 className="font-medium">Community</h3>
            </div>
            <p className="text-2xl font-bold">
              {communityMetrics ? (
                communityMetrics.discord.members + 
                communityMetrics.twitter.followers + 
                communityMetrics.reddit.subscribers
              ).toLocaleString() : '0'}
            </p>
            <p className="text-sm text-muted-foreground">Total members</p>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <BarChart3 className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-medium">Budget</h3>
            </div>
            <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">
              of ${totalBudget.toLocaleString()} total
            </p>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="font-medium">CAC</h3>
            </div>
            <p className={`text-2xl font-bold ${avgCAC > 50 ? 'text-red-500' : avgCAC > 25 ? 'text-yellow-500' : 'text-green-500'}`}>
              ${avgCAC.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">Avg cost per acquisition</p>
          </CardContent>
        </Card>

        <Card className="ff-card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Star className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="font-medium">Goals</h3>
            </div>
            <p className="text-2xl font-bold">
              {completedGoals}/{launchGoals.length}
            </p>
            <p className="text-sm text-muted-foreground">Goals achieved</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="campaigns" className="ff-focus-ring">
            Campaigns ({campaigns.length})
          </TabsTrigger>
          <TabsTrigger value="content" className="ff-focus-ring">
            Content ({contentPieces.length})
          </TabsTrigger>
          <TabsTrigger value="influencers" className="ff-focus-ring">
            Influencers ({influencers.length})
          </TabsTrigger>
          <TabsTrigger value="community" className="ff-focus-ring">
            Community
          </TabsTrigger>
          <TabsTrigger value="goals" className="ff-focus-ring">
            Launch Goals
          </TabsTrigger>
          <TabsTrigger value="templates" className="ff-focus-ring">
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          {/* Create New Campaign */}
          {selectedCampaign === null && (
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="text-lg">Create New Campaign</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Campaign Name</label>
                    <Input
                      placeholder="e.g., Twitter Launch Campaign"
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                      className="ff-focus-ring"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Campaign Type</label>
                    <Select value={newCampaign.type} onValueChange={(value) => setNewCampaign(prev => ({ ...prev, type: value as any }))}>
                      <SelectTrigger className="ff-focus-ring">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="email">Email Marketing</SelectItem>
                        <SelectItem value="content">Content Marketing</SelectItem>
                        <SelectItem value="influencer">Influencer</SelectItem>
                        <SelectItem value="pr">PR & Media</SelectItem>
                        <SelectItem value="community">Community</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Platform</label>
                    <Select value={newCampaign.platform} onValueChange={(value) => setNewCampaign(prev => ({ ...prev, platform: value }))}>
                      <SelectTrigger className="ff-focus-ring">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {SOCIAL_PLATFORMS.map((platform) => (
                          <SelectItem key={platform.id} value={platform.name}>
                            {platform.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Budget ($)</label>
                    <Input
                      type="number"
                      value={newCampaign.budget}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
                      className="ff-focus-ring"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Campaign Content</label>
                  <Textarea
                    placeholder="Describe your campaign content, messaging, and objectives..."
                    value={newCampaign.content}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, content: e.target.value }))}
                    className="ff-focus-ring resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleCreateCampaign}
                    disabled={isCreatingCampaign || !newCampaign.name.trim() || !newCampaign.platform}
                    className="ff-btn-primary"
                  >
                    {isCreatingCampaign ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Rocket className="h-4 w-4 mr-2" />
                        Create Campaign
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Campaign List */}
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className={`ff-card-interactive ${
                campaign.status === 'active' ? 'border-green-500/20 bg-green-500/5' :
                campaign.status === 'scheduled' ? 'border-blue-500/20 bg-blue-500/5' :
                ''
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium text-lg">{campaign.name}</h4>
                        <Badge variant="outline" className="capitalize">
                          {campaign.platform}
                        </Badge>
                        <Badge variant={
                          campaign.status === 'active' ? 'default' :
                          campaign.status === 'scheduled' ? 'secondary' :
                          campaign.status === 'completed' ? 'outline' :
                          'destructive'
                        } className={campaign.status === 'active' ? 'ff-badge-glow' : ''}>
                          {campaign.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{campaign.content.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Reach:</span>
                          <p className="font-medium">{campaign.metrics.reach.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Engagement:</span>
                          <p className="font-medium">{campaign.metrics.engagement.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Conversions:</span>
                          <p className="font-medium">{campaign.metrics.conversions}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Spent:</span>
                          <p className="font-medium">${campaign.spent.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">CAC:</span>
                          <p className={`font-medium ${campaign.metrics.cost_per_acquisition > 50 ? 'text-red-500' : campaign.metrics.cost_per_acquisition > 25 ? 'text-yellow-500' : 'text-green-500'}`}>
                            ${campaign.metrics.cost_per_acquisition.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Budget Usage</span>
                          <span>{((campaign.spent / campaign.budget) * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-6">
                      {campaign.status === 'draft' && (
                        <Button
                          size="sm"
                          onClick={() => handleLaunchCampaign(campaign.id)}
                          className="ff-btn-primary"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Launch
                        </Button>
                      )}
                      
                      {campaign.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePauseCampaign(campaign.id)}
                          className="ff-focus-ring"
                        >
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="ff-focus-ring"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="space-y-4">
            {contentPieces.map((content) => (
              <Card key={content.id} className={`ff-card-interactive ${
                content.status === 'published' ? 'border-green-500/20 bg-green-500/5' :
                content.status === 'approved' ? 'border-blue-500/20 bg-blue-500/5' :
                ''
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{content.title}</h4>
                        <Badge variant="outline" className="capitalize">
                          {content.type.replace('_', ' ')}
                        </Badge>
                        <Badge variant={
                          content.status === 'published' ? 'default' :
                          content.status === 'approved' ? 'secondary' :
                          'outline'
                        }>
                          {content.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Platforms:</span>
                        {content.platform.map((platform) => (
                          <Badge key={platform} variant="secondary" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                      
                      {content.status === 'published' && (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Views:</span>
                            <p className="font-medium">{content.performance.views.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Shares:</span>
                            <p className="font-medium">{content.performance.shares.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Likes:</span>
                            <p className="font-medium">{content.performance.likes.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Comments:</span>
                            <p className="font-medium">{content.performance.comments.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Conversion:</span>
                            <p className="font-medium">{content.performance.conversion_rate.toFixed(1)}%</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Author: {content.author}</span>
                        <span>
                          {content.status === 'published' ? 'Published' : 'Scheduled'}: {new Date(content.publish_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="ml-6">
                      {content.seo_score > 0 && (
                        <div className="text-center">
                          <div className={`text-lg font-bold ${content.seo_score >= 90 ? 'text-green-500' : content.seo_score >= 70 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {content.seo_score}
                          </div>
                          <p className="text-xs text-muted-foreground">SEO Score</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="influencers" className="space-y-4">
          <div className="space-y-4">
            {influencers.map((influencer) => (
              <Card key={influencer.id} className={`ff-card-interactive ${
                influencer.status === 'confirmed' ? 'border-green-500/20 bg-green-500/5' :
                influencer.status === 'negotiating' ? 'border-yellow-500/20 bg-yellow-500/5' :
                ''
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{influencer.name}</h4>
                        <Badge variant="outline">{influencer.platform}</Badge>
                        <Badge variant={
                          influencer.status === 'confirmed' ? 'default' :
                          influencer.status === 'negotiating' ? 'secondary' :
                          'outline'
                        }>
                          {influencer.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Followers:</span>
                          <p className="font-medium">{influencer.followers.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Engagement:</span>
                          <p className="font-medium">{influencer.engagement_rate.toFixed(1)}%</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Fee:</span>
                          <p className="font-medium">${influencer.fee.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expected Reach:</span>
                          <p className="font-medium">{influencer.expected_reach.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Deliverables:</p>
                        <div className="flex flex-wrap gap-1">
                          {influencer.deliverables.map((deliverable) => (
                            <Badge key={deliverable} variant="secondary" className="text-xs">
                              {deliverable}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {influencer.contact_date && (
                          <span>Contacted: {new Date(influencer.contact_date).toLocaleDateString()}</span>
                        )}
                        {influencer.campaign_date && (
                          <>
                            <span>•</span>
                            <span>Campaign: {new Date(influencer.campaign_date).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          {communityMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-purple-500" />
                    Discord Community
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Members:</span>
                      <p className="font-medium text-lg">{communityMetrics.discord.members.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Active Users:</span>
                      <p className="font-medium text-lg">{communityMetrics.discord.active_users.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Messages/Day:</span>
                      <p className="font-medium text-lg">{communityMetrics.discord.messages_per_day.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Growth Rate:</span>
                      <p className="font-medium text-lg text-green-500">+{communityMetrics.discord.growth_rate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Twitter className="h-5 w-5 text-blue-500" />
                    Twitter Presence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Followers:</span>
                      <p className="font-medium text-lg">{communityMetrics.twitter.followers.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Engagement:</span>
                      <p className="font-medium text-lg">{communityMetrics.twitter.engagement_rate}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Mentions:</span>
                      <p className="font-medium text-lg">{communityMetrics.twitter.mentions}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Top Hashtag:</span>
                      <p className="font-medium text-lg">#FlashFusion</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5 text-black" />
                    GitHub Repository
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Stars:</span>
                      <p className="font-medium text-lg">{communityMetrics.github.stars.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Forks:</span>
                      <p className="font-medium text-lg">{communityMetrics.github.forks.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Contributors:</span>
                      <p className="font-medium text-lg">{communityMetrics.github.contributors}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Open Issues:</span>
                      <p className="font-medium text-lg">{communityMetrics.github.issues}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5 text-orange-500" />
                    Reddit Community
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Subscribers:</span>
                      <p className="font-medium text-lg">{communityMetrics.reddit.subscribers.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Posts/Week:</span>
                      <p className="font-medium text-lg">{communityMetrics.reddit.posts_per_week}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Upvote Ratio:</span>
                      <p className="font-medium text-lg">{(communityMetrics.reddit.upvote_ratio * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="space-y-4">
            {launchGoals.map((goal) => {
              const progress = (goal.current / goal.target) * 100;
              const isCompleted = progress >= 100;
              const daysLeft = Math.max(0, Math.ceil((goal.deadline - Date.now()) / 86400000));
              
              return (
                <Card key={goal.id} className={`ff-card-interactive ${isCompleted ? 'border-green-500/20 bg-green-500/5' : ''}`}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h4 className="font-medium text-lg">{goal.metric}</h4>
                            <Badge variant={
                              goal.priority === 'critical' ? 'destructive' :
                              goal.priority === 'high' ? 'default' :
                              'secondary'
                            }>
                              {goal.priority}
                            </Badge>
                            {isCompleted && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Campaigns:</span>
                            {goal.campaigns.map((campaignId) => {
                              const campaign = campaigns.find(c => c.id === campaignId);
                              return campaign ? (
                                <Badge key={campaignId} variant="outline" className="text-xs">
                                  {campaign.platform}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${isCompleted ? 'text-green-500' : 'text-primary'}`}>
                            {goal.current.toLocaleString()}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            of {goal.target.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress: {progress.toFixed(0)}%</span>
                          <span className={`${daysLeft <= 3 ? 'text-red-500' : daysLeft <= 7 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                            {daysLeft} days left
                          </span>
                        </div>
                        <Progress value={Math.min(100, progress)} className="h-3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Marketing Content Templates</h3>
              <p className="text-muted-foreground">
                Pre-written templates for consistent messaging across platforms
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CONTENT_TEMPLATES.map((template) => (
                <Card key={template.id} className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">{template.name}</h4>
                      
                      <div className="p-3 bg-muted/30 rounded-lg text-sm">
                        {template.template}
                      </div>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyTemplate(template.template)}
                        className="ff-focus-ring w-full"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}