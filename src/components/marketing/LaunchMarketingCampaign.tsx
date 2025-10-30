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
import { toast } from 'sonner@2.0.3';
import { analyticsService } from '../../services/AnalyticsService';
import {
  CONTENT_TEMPLATES,
  SOCIAL_PLATFORMS,
  createMarketingFixtures,
  type CommunityMetrics,
  type ContentPiece,
  type InfluencerOutreach,
  type LaunchGoal,
  type MarketingCampaign
} from '../../fixtures/marketing/marketing-fixtures';

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
        const {
          campaigns: mockCampaigns,
          influencers: mockInfluencers,
          contentPieces: mockContentPieces,
          communityMetrics: mockCommunityMetrics,
          launchGoals: mockGoals
        } = createMarketingFixtures();

        setCampaigns(mockCampaigns);
        setInfluencers(mockInfluencers);
        setContentPieces(mockContentPieces);
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