import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { 
  Rocket, 
  Share2, 
  Mail, 
  Twitter, 
  Linkedin, 
  MessageCircle,
  TrendingUp,
  Users,
  Star,
  Calendar,
  ExternalLink,
  Copy,
  CheckCircle
} from 'lucide-react';
import { cn } from '../ui/utils';
import { toast } from 'sonner';

// Launch campaign configuration
const LAUNCH_CAMPAIGNS = {
  PRODUCT_HUNT: {
    id: 'product-hunt',
    name: 'Product Hunt Launch',
    description: 'Launch on Product Hunt to reach tech-savvy early adopters',
    status: 'scheduled',
    date: '2025-01-28', // Tuesday launch
    time: '12:01 AM PST',
    icon: Rocket,
    color: 'text-orange-500',
    url: 'https://www.producthunt.com/posts/flashfusion',
    preparation: [
      'Submit product 24-48 hours before launch',
      'Prepare social media assets and GIFs',
      'Notify personal network about launch day',
      'Schedule launch day social media posts',
      'Prepare launch day email to subscribers'
    ],
    metrics: {
      target_votes: 500,
      target_comments: 50,
      target_signups: 200,
    }
  },
  HACKER_NEWS: {
    id: 'hacker-news',
    name: 'Hacker News Post',
    description: 'Share technical deep-dive to engage developer community',
    status: 'ready',
    date: '2025-01-29',
    time: '10:00 AM EST',
    icon: MessageCircle,
    color: 'text-orange-600',
    url: 'https://news.ycombinator.com/',
    preparation: [
      'Write technical blog post about architecture',
      'Create compelling title and description',
      'Prepare for Q&A in comments',
      'Monitor post performance',
    ],
    metrics: {
      target_points: 100,
      target_comments: 30,
      target_clicks: 1000,
    }
  },
  SOCIAL_MEDIA: {
    id: 'social-media',
    name: 'Social Media Blitz',
    description: 'Coordinated campaign across all social platforms',
    status: 'active',
    date: '2025-01-27',
    time: 'All day',
    icon: Share2,
    color: 'text-blue-500',
    url: 'https://twitter.com/FlashFusionAI',
    preparation: [
      'Create demo video (2-3 minutes)',
      'Design social media graphics',
      'Write platform-specific copy',
      'Schedule posts across platforms',
      'Engage with community responses'
    ],
    metrics: {
      target_impressions: 10000,
      target_engagements: 500,
      target_clicks: 300,
    }
  },
  EMAIL_CAMPAIGN: {
    id: 'email-campaign',
    name: 'Email Launch Announcement',
    description: 'Send launch announcement to subscriber list',
    status: 'ready',
    date: '2025-01-27',
    time: '9:00 AM EST',
    icon: Mail,
    color: 'text-green-500',
    url: 'mailto:list@flashfusion.ai',
    preparation: [
      'Design email template',
      'Write compelling subject line',
      'Include demo video and screenshots',
      'Add clear call-to-action buttons',
      'Set up tracking and analytics'
    ],
    metrics: {
      target_open_rate: 25,
      target_click_rate: 5,
      target_conversions: 50,
    }
  }
};

const SOCIAL_TEMPLATES = {
  TWITTER: {
    platform: 'Twitter/X',
    icon: Twitter,
    template: `🚀 Just launched FlashFusion - an AI platform that builds complete web applications from simple descriptions!

✨ 60+ AI tools
🤝 Real-time collaboration  
📱 Mobile-responsive output
🚀 Deploy to 8+ platforms
🎮 Gamified experience

Built with React, Supabase, and tons of ☕

Try it free: https://flashfusion.ai

What should I build next? 👇

#AI #WebDev #NoCode #React #OpenSource`,
    hashtags: ['#AI', '#WebDev', '#NoCode', '#React', '#OpenSource']
  },
  LINKEDIN: {
    platform: 'LinkedIn',
    icon: Linkedin,
    template: `I'm excited to announce the launch of FlashFusion - an AI-powered platform that revolutionizes web application development.

After months of development, we've created a comprehensive solution that includes:
• 60+ specialized AI tools for developers
• Real-time collaboration features
• Automated deployment to 8+ platforms
• Gamified development experience
• Mobile-responsive output

The platform is built on modern technologies including React, Supabase, and advanced AI models. We're seeing incredible results in our beta testing phase.

Try FlashFusion for free: https://flashfusion.ai

I'd love to hear your thoughts on how AI is transforming the development landscape. What challenges are you facing in your development workflow?

#ArtificialIntelligence #WebDevelopment #SaaS #TechInnovation #Startup`,
    hashtags: ['#ArtificialIntelligence', '#WebDevelopment', '#SaaS', '#TechInnovation']
  }
};

interface LaunchCampaignProps {
  className?: string;
}

export const LaunchCampaign: React.FC<LaunchCampaignProps> = ({ className }) => {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [launchMetrics, setLaunchMetrics] = useState({
    totalSignups: 0,
    totalVisitors: 0,
    socialEngagement: 0,
    emailOpens: 0,
  });

  // Mock real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLaunchMetrics(prev => ({
        totalSignups: prev.totalSignups + Math.floor(Math.random() * 3),
        totalVisitors: prev.totalVisitors + Math.floor(Math.random() * 10),
        socialEngagement: prev.socialEngagement + Math.floor(Math.random() * 5),
        emailOpens: prev.emailOpens + Math.floor(Math.random() * 2),
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedText(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white">Active</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500 text-white">Scheduled</Badge>;
      case 'ready':
        return <Badge className="bg-yellow-500 text-white">Ready</Badge>;
      default:
        return <Badge variant="secondary">Draft</Badge>;
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Launch Metrics Dashboard */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>Launch Day Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">
                {launchMetrics.totalSignups}
              </div>
              <div className="text-sm text-muted-foreground">Total Signups</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-secondary">
                {launchMetrics.totalVisitors}
              </div>
              <div className="text-sm text-muted-foreground">Visitors</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-accent">
                {launchMetrics.socialEngagement}
              </div>
              <div className="text-sm text-muted-foreground">Social Engagement</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-green-500">
                {launchMetrics.emailOpens}
              </div>
              <div className="text-sm text-muted-foreground">Email Opens</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.values(LAUNCH_CAMPAIGNS).map((campaign) => {
          const IconComponent = campaign.icon;
          
          return (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="ff-hover-lift cursor-pointer" 
                    onClick={() => setSelectedCampaign(
                      selectedCampaign === campaign.id ? null : campaign.id
                    )}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <IconComponent className={cn('w-6 h-6', campaign.color)} />
                      <div>
                        <CardTitle className="text-lg">{campaign.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {campaign.description}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(campaign.status)}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{campaign.date} at {campaign.time}</span>
                      </div>
                      <Button
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(campaign.url, '_blank');
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Progress indicators for metrics */}
                    <div className="space-y-2">
                      {Object.entries(campaign.metrics).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs text-muted-foreground">
                          <span>{key.replace('target_', '').replace('_', ' ')}</span>
                          <span>Target: {value}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Expanded content */}
                    {selectedCampaign === campaign.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-border"
                      >
                        <h4 className="font-medium mb-2">Preparation Checklist:</h4>
                        <ul className="space-y-1">
                          {campaign.preparation.map((item, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Social Media Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Share2 className="w-5 h-5" />
            <span>Social Media Templates</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.values(SOCIAL_TEMPLATES).map((template) => {
              const IconComponent = template.icon;
              
              return (
                <div key={template.platform} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="w-5 h-5 text-blue-500" />
                    <h4 className="font-medium">{template.platform}</h4>
                  </div>
                  
                  <div className="relative">
                    <Textarea
                      value={template.template}
                      readOnly
                      className="min-h-[200px] font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(template.template, template.platform)}
                    >
                      {copiedText === template.platform ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {template.hashtags.map((hashtag) => (
                      <Badge key={hashtag} variant="secondary" className="text-xs">
                        {hashtag}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Launch Day Action Items */}
      <Card className="bg-gradient-to-r from-accent/10 to-pink-500/10 border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-accent" />
            <span>Launch Day Action Items</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              <span>Post on Product Hunt at 12:01 AM PST</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>Send launch email to subscriber list</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-secondary"></div>
              <span>Share on Twitter, LinkedIn, and other social platforms</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Engage with comments and feedback throughout the day</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span>Monitor analytics and respond to support requests</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span>Submit to Hacker News with technical deep-dive</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LaunchCampaign;