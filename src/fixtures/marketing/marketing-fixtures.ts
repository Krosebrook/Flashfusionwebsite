/**
 * Mock data fixtures for Marketing components
 * Extracted from components/marketing/LaunchMarketingCampaign.tsx
 */

import type { LucideIcon } from 'lucide-react';
import { Twitter, Linkedin, Instagram, Youtube, MessageCircle, Globe } from 'lucide-react';

export interface SocialPlatform {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
}

export interface MarketingCampaign {
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

export interface InfluencerOutreach {
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

export interface ContentPiece {
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

export interface CommunityMetrics {
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

export interface LaunchGoal {
  id: string;
  metric: string;
  target: number;
  current: number;
  deadline: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  campaigns: string[];
}

export interface MarketingFixturesData {
  campaigns: MarketingCampaign[];
  influencers: InfluencerOutreach[];
  contentPieces: ContentPiece[];
  communityMetrics: CommunityMetrics;
  launchGoals: LaunchGoal[];
}

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: '#1DA1F2' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0077B5' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: '#FF0000' },
  { id: 'discord', name: 'Discord', icon: MessageCircle, color: '#5865F2' },
  { id: 'reddit', name: 'Reddit', icon: Globe, color: '#FF4500' },
];

export const CONTENT_TEMPLATES = [
  {
    id: 'launch-announcement',
    name: 'Launch Announcement',
    template:
      "🚀 We're launching FlashFusion! Transform your ideas into production-ready apps with 60+ AI tools. #FlashFusion #AIDevTools #Launch",
  },
  {
    id: 'feature-highlight',
    name: 'Feature Highlight',
    template:
      "⚡ New Feature: [FEATURE NAME] - [BRIEF DESCRIPTION]. Build faster with FlashFusion's AI assistance. #FlashFusion #ProductUpdate",
  },
  {
    id: 'user-testimonial',
    name: 'User Testimonial',
    template:
      '"FlashFusion helped me build my app 10x faster!" - [USER NAME]. Join thousands of developers already building with AI. #FlashFusion #Testimonial',
  },
  {
    id: 'tutorial-post',
    name: 'Tutorial Post',
    template:
      '📚 Tutorial: How to [TASK] with FlashFusion in under 5 minutes. Perfect for [TARGET AUDIENCE]. Link in bio! #Tutorial #FlashFusion',
  },
];

const MS_IN_DAY = 86_400_000;

const offset = (days: number, now: number): number => now + days * MS_IN_DAY;

export const createMarketingFixtures = (now: number = Date.now()): MarketingFixturesData => {
  const campaigns: MarketingCampaign[] = [
    {
      id: 'launch-twitter',
      name: 'Twitter Launch Campaign',
      type: 'social',
      platform: 'Twitter',
      status: 'active',
      startDate: offset(-1, now),
      endDate: offset(7, now),
      budget: 5000,
      spent: 1250,
      metrics: {
        reach: 45000,
        impressions: 125000,
        engagement: 3400,
        clicks: 890,
        conversions: 47,
        cost_per_acquisition: 26.6,
      },
      content: {
        title: 'FlashFusion Launch - AI Development Revolution',
        description: 'Transform ideas into production-ready applications with 60+ AI tools',
        cta: 'Try FlashFusion Free',
        hashtags: ['#FlashFusion', '#AIDevTools', '#Launch', '#Developer'],
      },
      targeting: {
        demographics: ['Developers', 'Tech Entrepreneurs', 'Startup Founders'],
        interests: ['AI/ML', 'Software Development', 'Productivity Tools'],
        location: ['United States', 'Canada', 'United Kingdom', 'Germany'],
        devices: ['Desktop', 'Mobile'],
      },
    },
    {
      id: 'linkedin-b2b',
      name: 'LinkedIn B2B Campaign',
      type: 'social',
      platform: 'LinkedIn',
      status: 'scheduled',
      startDate: offset(1, now),
      endDate: offset(14, now),
      budget: 8000,
      spent: 0,
      metrics: {
        reach: 0,
        impressions: 0,
        engagement: 0,
        clicks: 0,
        conversions: 0,
        cost_per_acquisition: 0,
      },
      content: {
        title: 'Enterprise AI Development Platform',
        description: "Scale your development team productivity with FlashFusion's enterprise-grade AI tools",
        cta: 'Request Demo',
        hashtags: ['#EnterpriseAI', '#DevTools', '#Productivity'],
      },
      targeting: {
        demographics: ['CTOs', 'Engineering Managers', 'Tech Leads'],
        interests: ['Enterprise Software', 'AI/ML', 'DevOps'],
        location: ['United States', 'Canada', 'United Kingdom'],
        devices: ['Desktop'],
      },
    },
    {
      id: 'product-hunt',
      name: 'Product Hunt Launch',
      type: 'pr',
      platform: 'Product Hunt',
      status: 'scheduled',
      startDate: offset(2, now),
      endDate: offset(3, now),
      budget: 2000,
      spent: 500,
      metrics: {
        reach: 25000,
        impressions: 85000,
        engagement: 1200,
        clicks: 450,
        conversions: 78,
        cost_per_acquisition: 6.41,
      },
      content: {
        title: 'FlashFusion - AI Development Assistant',
        description: 'The ultimate AI-powered development platform with 60+ tools for building production-ready applications',
        cta: 'Upvote & Try Free',
      },
      targeting: {
        demographics: ['Product Hunt Community', 'Early Adopters', 'Tech Enthusiasts'],
        interests: ['New Products', 'AI Tools', 'Developer Tools'],
        location: ['Global'],
        devices: ['Desktop', 'Mobile'],
      },
    },
    {
      id: 'youtube-content',
      name: 'YouTube Content Series',
      type: 'content',
      platform: 'YouTube',
      status: 'active',
      startDate: offset(-5, now),
      endDate: offset(30, now),
      budget: 15000,
      spent: 3750,
      metrics: {
        reach: 75000,
        impressions: 180000,
        engagement: 8500,
        clicks: 2100,
        conversions: 156,
        cost_per_acquisition: 24.04,
      },
      content: {
        title: 'FlashFusion Tutorial Series',
        description: 'Learn to build full-stack applications with AI assistance',
        cta: 'Subscribe & Try FlashFusion',
      },
      targeting: {
        demographics: ['Developers', 'Students', 'Tech Enthusiasts'],
        interests: ['Programming Tutorials', 'AI/ML', 'Web Development'],
        location: ['Global'],
        devices: ['Desktop', 'Mobile', 'TV'],
      },
    },
  ];

  const influencers: InfluencerOutreach[] = [
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
      contact_date: offset(-7, now),
      campaign_date: offset(1, now),
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
      contact_date: offset(-5, now),
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
      contact_date: offset(-2, now),
    },
  ];

  const contentPieces: ContentPiece[] = [
    {
      id: 'content-1',
      title: 'FlashFusion Launch: The Future of AI Development',
      type: 'blog',
      platform: ['Website', 'Medium', 'Dev.to'],
      status: 'published',
      publish_date: offset(-1, now),
      author: 'Marketing Team',
      performance: {
        views: 12500,
        shares: 340,
        likes: 890,
        comments: 156,
        conversion_rate: 3.2,
      },
      seo_score: 92,
    },
    {
      id: 'content-2',
      title: 'Building a Full-Stack App in 10 Minutes with FlashFusion',
      type: 'video',
      platform: ['YouTube', 'Twitter', 'LinkedIn'],
      status: 'published',
      publish_date: offset(-2, now),
      author: 'Product Team',
      performance: {
        views: 45000,
        shares: 1200,
        likes: 3400,
        comments: 567,
        conversion_rate: 5.8,
      },
      seo_score: 87,
    },
    {
      id: 'content-3',
      title: 'FlashFusion vs Competition: Feature Comparison',
      type: 'infographic',
      platform: ['Twitter', 'LinkedIn', 'Instagram'],
      status: 'approved',
      publish_date: offset(1, now),
      author: 'Design Team',
      performance: {
        views: 0,
        shares: 0,
        likes: 0,
        comments: 0,
        conversion_rate: 0,
      },
      seo_score: 0,
    },
  ];

  const communityMetrics: CommunityMetrics = {
    discord: {
      members: 2340,
      active_users: 456,
      messages_per_day: 890,
      growth_rate: 15.2,
    },
    twitter: {
      followers: 8900,
      engagement_rate: 4.7,
      mentions: 234,
      hashtag_performance: {
        '#FlashFusion': 1240,
        '#AIDevTools': 890,
        '#BuildFaster': 567,
        '#Developer': 2340,
      },
    },
    github: {
      stars: 1560,
      forks: 234,
      contributors: 23,
      issues: 45,
    },
    reddit: {
      subscribers: 1890,
      posts_per_week: 12,
      upvote_ratio: 0.94,
    },
  };

  const launchGoals: LaunchGoal[] = [
    {
      id: 'goal-signups',
      metric: 'User Signups',
      target: 500,
      current: 287,
      deadline: offset(7, now),
      priority: 'critical',
      campaigns: ['launch-twitter', 'linkedin-b2b', 'product-hunt'],
    },
    {
      id: 'goal-social-followers',
      metric: 'Social Media Followers',
      target: 10000,
      current: 8900,
      deadline: offset(14, now),
      priority: 'high',
      campaigns: ['launch-twitter', 'youtube-content'],
    },
    {
      id: 'goal-community-members',
      metric: 'Community Members',
      target: 3000,
      current: 2340,
      deadline: offset(14, now),
      priority: 'medium',
      campaigns: ['youtube-content'],
    },
    {
      id: 'goal-content-views',
      metric: 'Content Views',
      target: 100000,
      current: 57500,
      deadline: offset(21, now),
      priority: 'medium',
      campaigns: ['youtube-content'],
    },
  ];

  return {
    campaigns,
    influencers,
    contentPieces,
    communityMetrics,
    launchGoals,
  };
};
