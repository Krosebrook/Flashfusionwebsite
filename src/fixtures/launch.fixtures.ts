/**
 * @fileoverview Launch component mock data fixtures
 * @internal - For development and testing only
 *
 * Extracted from oversized launch components during Prompt 1 refactoring
 * Source: LaunchPreparationHub.tsx (1,976 lines)
 */

export interface LaunchAsset {
  id: string;
  type: 'documentation' | 'video' | 'image' | 'press-kit' | 'legal' | 'tutorial';
  title: string;
  description: string;
  status: 'draft' | 'review' | 'approved' | 'published';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  dueDate?: Date;
  assignee?: string;
  tags: string[];
}

export interface MarketingCampaign {
  id: string;
  name: string;
  type: 'social' | 'email' | 'press' | 'influencer' | 'content';
  status: 'planning' | 'created' | 'scheduled' | 'active' | 'completed';
  reach: number;
  engagement: number;
  budget: number;
  roi: number;
  startDate: Date;
  endDate: Date;
}

export interface SupportChannel {
  id: string;
  name: string;
  type: 'email' | 'chat' | 'phone' | 'docs' | 'community' | 'video';
  status: 'active' | 'setup' | 'testing';
  responseTime: string;
  satisfaction: number;
  volume: number;
}

/**
 * Mock launch assets for development/testing
 * @provenance LaunchPreparationHub.tsx lines 151-192
 */
export const mockLaunchAssets: LaunchAsset[] = [
  {
    id: 'user-manual',
    type: 'documentation',
    title: 'Complete User Manual',
    description: 'Comprehensive guide covering all FlashFusion features',
    status: 'approved',
    priority: 'critical',
    progress: 95,
    tags: ['documentation', 'user-guide'],
  },
  {
    id: 'api-docs',
    type: 'documentation',
    title: 'API Documentation',
    description: 'Developer-focused API reference and examples',
    status: 'review',
    priority: 'high',
    progress: 80,
    tags: ['api', 'developers'],
  },
  {
    id: 'launch-video',
    type: 'video',
    title: 'Product Launch Video',
    description: '2-minute product demonstration and overview',
    status: 'draft',
    priority: 'high',
    progress: 60,
    tags: ['marketing', 'video'],
  },
  {
    id: 'press-kit',
    type: 'press-kit',
    title: 'Media Press Kit',
    description: 'Complete press kit with assets and information',
    status: 'approved',
    priority: 'medium',
    progress: 100,
    tags: ['press', 'media'],
  },
];

/**
 * Mock marketing campaigns for development/testing
 * @provenance LaunchPreparationHub.tsx lines 194-219
 */
export const mockMarketingCampaigns: MarketingCampaign[] = [
  {
    id: 'social-launch',
    name: 'Social Media Launch Campaign',
    type: 'social',
    status: 'scheduled',
    reach: 50000,
    engagement: 3.2,
    budget: 5000,
    roi: 145,
    startDate: new Date(Date.now() + 86400000),
    endDate: new Date(Date.now() + 604800000),
  },
  {
    id: 'email-sequence',
    name: 'Launch Email Sequence',
    type: 'email',
    status: 'created',
    reach: 15000,
    engagement: 12.5,
    budget: 1200,
    roi: 280,
    startDate: new Date(Date.now() + 172800000),
    endDate: new Date(Date.now() + 1209600000),
  },
];

/**
 * Mock support channels for development/testing
 * @provenance LaunchPreparationHub.tsx lines 221-249
 */
export const mockSupportChannels: SupportChannel[] = [
  {
    id: 'email-support',
    name: 'Email Support',
    type: 'email',
    status: 'active',
    responseTime: '< 4 hours',
    satisfaction: 4.7,
    volume: 150,
  },
  {
    id: 'live-chat',
    name: 'Live Chat',
    type: 'chat',
    status: 'testing',
    responseTime: '< 2 minutes',
    satisfaction: 4.9,
    volume: 89,
  },
  {
    id: 'docs-portal',
    name: 'Documentation Portal',
    type: 'docs',
    status: 'active',
    responseTime: 'Instant',
    satisfaction: 4.5,
    volume: 2400,
  },
];
