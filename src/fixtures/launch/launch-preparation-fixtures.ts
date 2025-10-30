/**
 * Mock data fixtures for LaunchPreparationHub
 * Extracted from components/launch/LaunchPreparationHub.tsx
 */

import type {
  LaunchAsset,
  MarketingCampaign,
  SupportChannel,
} from '../../components/launch/LaunchPreparationHub.types';

export const LAUNCH_CHECKLIST = [
  {
    category: 'Documentation',
    items: [
      'User Manual and Getting Started Guide',
      'API Documentation and Reference',
      'Video Tutorials and Walkthroughs',
      'FAQ and Troubleshooting Guide',
      'Developer Documentation',
      'Release Notes and Changelog',
    ],
  },
  {
    category: 'Marketing',
    items: [
      'Landing Page Optimization',
      'Social Media Campaign',
      'Press Release and Media Kit',
      'Influencer Outreach Program',
      'Email Marketing Sequence',
      'SEO and Content Strategy',
    ],
  },
  {
    category: 'Legal & Compliance',
    items: [
      'Terms of Service',
      'Privacy Policy',
      'GDPR Compliance Documentation',
      'Security and Data Protection',
      'Intellectual Property Review',
      'Compliance Certifications',
    ],
  },
  {
    category: 'Support Systems',
    items: [
      'Help Desk Setup',
      'Community Forum Launch',
      'Knowledge Base Creation',
      'Support Team Training',
      'Escalation Procedures',
      'Feedback Collection System',
    ],
  },
] as const;

export const INITIAL_ASSETS: LaunchAsset[] = [
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

export const INITIAL_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'social-launch',
    name: 'Social Media Launch Campaign',
    type: 'social',
    status: 'scheduled',
    reach: 50000,
    engagement: 3.2,
    budget: 5000,
    roi: 145,
    startDate: new Date('2024-04-15T00:00:00.000Z'),
    endDate: new Date('2024-04-22T00:00:00.000Z'),
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
    startDate: new Date('2024-04-16T00:00:00.000Z'),
    endDate: new Date('2024-04-30T00:00:00.000Z'),
  },
];

export const INITIAL_SUPPORT_CHANNELS: SupportChannel[] = [
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

export const CONTENT_REQUESTS = [
  {
    id: 'press-release',
    title: 'Launch Press Release',
    type: 'Press Release',
    status: 'pending',
    priority: 'high',
    deadline: '2024-01-15',
  },
  {
    id: 'blog-announcement',
    title: 'Launch Announcement Blog Post',
    type: 'Blog Post',
    status: 'in-progress',
    priority: 'high',
    deadline: '2024-01-10',
  },
  {
    id: 'social-assets',
    title: 'Social Media Asset Pack',
    type: 'Graphics',
    status: 'review',
    priority: 'medium',
    deadline: '2024-01-12',
  },
];
