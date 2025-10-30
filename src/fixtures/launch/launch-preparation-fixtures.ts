/**
 * Mock data fixtures for LaunchPreparationHub
 * Extracted from components/launch/LaunchPreparationHub.tsx
 */

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
];

export const INITIAL_ASSETS = [
  {
    id: 'user-manual',
    type: 'documentation' as const,
    title: 'Complete User Manual',
    description: 'Comprehensive guide covering all FlashFusion features',
    status: 'approved' as const,
    priority: 'critical' as const,
    progress: 95,
    tags: ['documentation', 'user-guide'],
  },
  {
    id: 'api-docs',
    type: 'documentation' as const,
    title: 'API Documentation',
    description: 'Developer-focused API reference and examples',
    status: 'review' as const,
    priority: 'high' as const,
    progress: 80,
    tags: ['api', 'developers'],
  },
  {
    id: 'launch-video',
    type: 'video' as const,
    title: 'Product Launch Video',
    description: '2-minute product demonstration and overview',
    status: 'draft' as const,
    priority: 'high' as const,
    progress: 60,
    tags: ['video', 'marketing'],
  },
];

export const INITIAL_CAMPAIGNS = [
  {
    id: 'social-launch',
    name: 'Social Media Launch Campaign',
    type: 'social' as const,
    status: 'active' as const,
    reach: 125_000,
    engagement: 8.5,
    budget: 5_000,
    roi: 162,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-03-15'),
  },
  {
    id: 'email-sequence',
    name: 'Launch Email Sequence',
    type: 'email' as const,
    status: 'scheduled' as const,
    reach: 42_000,
    engagement: 12.4,
    budget: 2_400,
    roi: 118,
    startDate: new Date('2024-02-05'),
    endDate: new Date('2024-02-25'),
  },
  {
    id: 'influencer-program',
    name: 'Influencer Partnership Program',
    type: 'influencer' as const,
    status: 'planning' as const,
    reach: 250_000,
    engagement: 6.1,
    budget: 10_000,
    roi: 95,
    startDate: new Date('2024-02-10'),
    endDate: new Date('2024-04-05'),
  },
];

export const INITIAL_SUPPORT_CHANNELS = [
  {
    id: 'email-support',
    name: 'Email Support',
    type: 'email' as const,
    status: 'active' as const,
    responseTime: '< 4 hours',
    satisfaction: 4.7,
    volume: 250,
  },
  {
    id: 'live-chat',
    name: 'Live Chat',
    type: 'chat' as const,
    status: 'testing' as const,
    responseTime: '< 2 minutes',
    satisfaction: 4.9,
    volume: 180,
  },
  {
    id: 'community-forum',
    name: 'Community Forum',
    type: 'community' as const,
    status: 'setup' as const,
    responseTime: '12 hours',
    satisfaction: 4.1,
    volume: 420,
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
