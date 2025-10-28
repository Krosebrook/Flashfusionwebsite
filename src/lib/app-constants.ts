import { PageType } from '../types';
import { Home, Zap, Folder, User, FileCode, Users as UsersIcon, GitBranch } from 'lucide-react';

export const PROTECTED_PAGES: PageType[] = [
  'dashboard', 'projects', 'analytics', 'settings', 'integrations', 
  'deployments', 'templates', 'collaboration', 'cicd'
];

export const PUBLIC_PAGES: PageType[] = [
  'home', 'features', 'pricing', 'testimonials', 'tools', 'tool-detail',
  'about', 'contact', 'faq', 'privacy', 'terms', 'demo'
];

export const MOBILE_NAV_ITEMS = [
  { id: 'dashboard' as PageType, label: 'Dashboard', icon: Home },
  { id: 'tools' as PageType, label: 'Tools', icon: Zap },
  { id: 'projects' as PageType, label: 'Projects', icon: Folder },
  { id: 'templates' as PageType, label: 'Templates', icon: FileCode },
  { id: 'collaboration' as PageType, label: 'Team', icon: UsersIcon },
  { id: 'cicd' as PageType, label: 'Deploy', icon: GitBranch },
  { id: 'settings' as PageType, label: 'Profile', icon: User }
];

export const XP_REWARDS = {
  FIRST_PROJECT_SETUP: 150,
  TOOL_USAGE: 25,
  PROJECT_DEPLOYMENT: 200,
  DEMO_COMPLETION: 50,
  ONBOARDING_COMPLETION: 100
} as const;

export const APP_TITLE = 'FlashFusion';

export const PAGE_TITLES: Record<PageType, string> = {
  home: APP_TITLE,
  dashboard: 'Dashboard',
  generator: 'Generator',
  wizard: 'Project Wizard',
  tools: 'AI Tools',
  'tool-detail': 'Tool Details',
  integrations: 'Integrations',
  deployments: 'Deployments',
  projects: 'Projects',
  analytics: 'Analytics',
  settings: 'Settings',
  features: 'Features',
  pricing: 'Pricing',
  testimonials: 'Success Stories',
  templates: 'Templates',
  collaboration: 'Collaboration',
  cicd: 'CI/CD Pipelines',
  about: 'About Us',
  contact: 'Contact Us',
  faq: 'FAQ',
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
  demo: 'Interactive Demo'
};

export const COMPANY_INFO = {
  name: 'FlashFusion',
  tagline: 'Build Apps with AI in Minutes, Not Months',
  description: 'The comprehensive AI-powered platform that helps users generate web applications across multiple frameworks and platforms, featuring a complete gamification system with XP progression, achievement badges, daily flash tasks, and leaderboards.',
  email: 'hello@flashfusion.dev',
  support: 'support@flashfusion.dev',
  sales: 'sales@flashfusion.dev',
  phone: '+1 (555) 123-4567',
  address: {
    street: '123 Innovation Drive',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    country: 'United States'
  },
  social: {
    twitter: 'https://twitter.com/flashfusion',
    github: 'https://github.com/flashfusion',
    linkedin: 'https://linkedin.com/company/flashfusion',
    discord: 'https://discord.gg/flashfusion'
  },
  founded: '2024',
  team_size: '50+'
} as const;