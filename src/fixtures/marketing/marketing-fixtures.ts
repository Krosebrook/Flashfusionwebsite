/**
 * Mock data fixtures for Marketing components
 * Extracted from components/marketing/LaunchMarketingCampaign.tsx
 */

import { Twitter, Linkedin, Instagram, Youtube, MessageCircle, Globe } from 'lucide-react';

export const SOCIAL_PLATFORMS = [
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
