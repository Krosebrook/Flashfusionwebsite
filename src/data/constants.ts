import { 
  Home,
  BarChart3,
  Wrench,
  Gamepad2,
  TrendingUp,
  Settings,
  Globe,
  Smartphone,
  Monitor,
  Code,
  Layers,
  Sparkles,
  Link,
  Rocket
} from 'lucide-react';
import { Badge, DailyTask, LeaderboardEntry, PageConfig, FeatureCard } from '../types';
import { getAllTools, getPopularTools } from './tools';

export const createBadges = (userRole?: string): Badge[] => [
  { id: '1', name: 'React Rookie', description: 'Generated your first React app', icon: '⚛️', color: '#FF7B00', earned: true, earnedAt: new Date('2024-01-15') },
  { id: '2', name: 'Platform Pro', description: 'Created apps on 3+ platforms', icon: '🚀', color: '#00B4D8', earned: true, earnedAt: new Date('2024-02-01') },
  { id: '3', name: 'Validator Veteran', description: 'Validated 10+ app ideas', icon: '✅', color: '#E91E63', earned: userRole === 'pro' },
  { id: '4', name: 'Code Crusader', description: 'Generated 100+ code snippets', icon: '⚡', color: '#FF7B00', earned: true, earnedAt: new Date('2024-01-20') },
  { id: '5', name: 'Design Dynamo', description: 'Created 50+ images with AI', icon: '🎨', color: '#00B4D8', earned: true, earnedAt: new Date('2024-02-10') },
  { id: '6', name: 'Remix Master', description: 'Remixed 25+ templates', icon: '🔄', color: '#E91E63', earned: userRole === 'pro' },
  { id: '7', name: 'Speed Demon', description: 'Built an app in under 5 minutes', icon: '💨', color: '#FF7B00', earned: userRole === 'pro' },
  { id: '8', name: 'Community Champion', description: 'Shared 10+ templates publicly', icon: '👥', color: '#00B4D8', earned: userRole === 'pro' },
  { id: '9', name: 'AI Pioneer', description: 'Used 10+ AI tools', icon: '🤖', color: '#E91E63', earned: userRole === 'pro' },
  { id: '10', name: 'Deploy Master', description: 'Deployed to 5+ platforms', icon: '🚀', color: '#FF7B00', earned: userRole === 'pro' },
  { id: '11', name: 'Integration Expert', description: 'Connected 10+ services', icon: '🔗', color: '#00B4D8', earned: userRole === 'pro' },
  { id: '12', name: 'Analytics Guru', description: 'Set up advanced analytics', icon: '📊', color: '#E91E63', earned: userRole === 'pro' }
];

export const dailyTasks: DailyTask[] = [
  { id: 'create-project', title: 'Create a Project', description: 'Start a new project using the wizard', xpReward: 100, completed: true, type: 'generate' },
  { id: 'use-tool', title: 'Use an AI Tool', description: 'Try any AI tool from our catalog', xpReward: 75, completed: true, type: 'generate' },
  { id: 'deploy-project', title: 'Deploy a Project', description: 'Deploy your project to any platform', xpReward: 150, completed: false, type: 'platform' },
  { id: 'share-project', title: 'Share Your Work', description: 'Share a project with the community', xpReward: 125, completed: false, type: 'remix' },
  { id: 'complete-integration', title: 'Add Integration', description: 'Connect a service to your project', xpReward: 175, completed: false, type: 'generate' },
  { id: 'earn-badge', title: 'Earn a Badge', description: 'Complete actions to unlock a new badge', xpReward: 200, completed: false, type: 'achievement' }
];

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Alex Chen', apps: 156, downloads: 12500, level: 15, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
  { rank: 2, name: 'Sarah Kim', apps: 143, downloads: 11200, level: 14, avatar: 'https://images.unsplash.com/photo-1494790108755-2616b6a7a428?w=40&h=40&fit=crop&crop=face' },
  { rank: 4, name: 'Marcus Liu', apps: 89, downloads: 7650, level: 11, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
  { rank: 5, name: 'Emma Davis', apps: 76, downloads: 6800, level: 10, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' },
  { rank: 6, name: 'David Park', apps: 65, downloads: 5900, level: 9, avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop&crop=face' },
  { rank: 7, name: 'Lisa Wong', apps: 58, downloads: 5200, level: 9, avatar: 'https://images.unsplash.com/photo-1494790108755-2616b6a7a428?w=40&h=40&fit=crop&crop=face' }
];

export const createUserLeaderboardEntry = (userRole?: string): LeaderboardEntry => ({
  rank: userRole === 'pro' ? 3 : 8, 
  name: 'You', 
  apps: userRole === 'pro' ? 45 : 12, 
  downloads: userRole === 'pro' ? 2890 : 890, 
  level: userRole === 'pro' ? 12 : 7, 
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face'
});

// Framework options for project creation
export const frameworks = [
  {
    id: 'react',
    name: 'React',
    description: 'Modern JavaScript library for building user interfaces',
    icon: '⚛️',
    category: 'Frontend'
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    description: 'Full-stack React framework with SSR and API routes',
    icon: '▲',
    category: 'Full-Stack'
  },
  {
    id: 'vue',
    name: 'Vue.js',
    description: 'Progressive JavaScript framework for building UIs',
    icon: '💚',
    category: 'Frontend'
  },
  {
    id: 'nuxt',
    name: 'Nuxt.js',
    description: 'Vue.js framework with universal rendering',
    icon: '💚',
    category: 'Full-Stack'
  },
  {
    id: 'svelte',
    name: 'Svelte',
    description: 'Cybernetically enhanced web apps',
    icon: '🔥',
    category: 'Frontend'
  },
  {
    id: 'sveltekit',
    name: 'SvelteKit',
    description: 'Full-stack framework powered by Svelte',
    icon: '🔥',
    category: 'Full-Stack'
  },
  {
    id: 'angular',
    name: 'Angular',
    description: 'Platform for building mobile and desktop web applications',
    icon: '🅰️',
    category: 'Frontend'
  },
  {
    id: 'react-native',
    name: 'React Native',
    description: 'Build native mobile apps using React',
    icon: '📱',
    category: 'Mobile'
  },
  {
    id: 'flutter',
    name: 'Flutter',
    description: 'Google\'s UI toolkit for building natively compiled applications',
    icon: '🐦',
    category: 'Mobile'
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    description: 'JavaScript runtime for server-side applications',
    icon: '🟢',
    category: 'Backend'
  },
  {
    id: 'express',
    name: 'Express.js',
    description: 'Fast, unopinionated web framework for Node.js',
    icon: '🚄',
    category: 'Backend'
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    description: 'Modern, fast web framework for building APIs with Python',
    icon: '🐍',
    category: 'Backend'
  },
  {
    id: 'django',
    name: 'Django',
    description: 'High-level Python web framework',
    icon: '🐍',
    category: 'Backend'
  },
  {
    id: 'rails',
    name: 'Ruby on Rails',
    description: 'Web application framework written in Ruby',
    icon: '💎',
    category: 'Backend'
  },
  {
    id: 'laravel',
    name: 'Laravel',
    description: 'PHP framework for web artisans',
    icon: '🎨',
    category: 'Backend'
  },
  {
    id: 'spring',
    name: 'Spring Boot',
    description: 'Java framework for building production-ready applications',
    icon: '☕',
    category: 'Backend'
  }
];

// Deployment platform options
export const deploymentPlatforms = [
  {
    id: 'vercel',
    name: 'Vercel',
    description: 'Deploy instantly to the global edge network',
    icon: '▲',
    category: 'Hosting',
    supports: ['React', 'Next.js', 'Vue.js', 'Angular', 'Svelte']
  },
  {
    id: 'netlify',
    name: 'Netlify',
    description: 'Build, deploy, and manage modern web projects',
    icon: '🌐',
    category: 'Hosting',
    supports: ['React', 'Vue.js', 'Angular', 'Svelte', 'Static Sites']
  },
  {
    id: 'railway',
    name: 'Railway',
    description: 'Deploy code with zero configuration',
    icon: '🚂',
    category: 'Hosting',
    supports: ['Node.js', 'Python', 'Go', 'Ruby', 'PHP']
  },
  {
    id: 'render',
    name: 'Render',
    description: 'Cloud platform for developers and teams',
    icon: '🎨',
    category: 'Hosting',
    supports: ['Node.js', 'Python', 'Go', 'Ruby', 'Docker']
  },
  {
    id: 'aws',
    name: 'AWS',
    description: 'Amazon Web Services cloud platform',
    icon: '☁️',
    category: 'Cloud',
    supports: ['All frameworks', 'Docker', 'Serverless']
  },
  {
    id: 'digitalocean',
    name: 'DigitalOcean',
    description: 'Simple cloud hosting and infrastructure',
    icon: '🌊',
    category: 'Cloud',
    supports: ['All frameworks', 'Docker', 'Kubernetes']
  },
  {
    id: 'heroku',
    name: 'Heroku',
    description: 'Platform as a service supporting several programming languages',
    icon: '💜',
    category: 'PaaS',
    supports: ['Node.js', 'Python', 'Ruby', 'Java', 'PHP']
  },
  {
    id: 'firebase',
    name: 'Firebase',
    description: 'Google\'s mobile and web application development platform',
    icon: '🔥',
    category: 'BaaS',
    supports: ['React', 'Vue.js', 'Angular', 'React Native', 'Flutter']
  },
  {
    id: 'supabase',
    name: 'Supabase',
    description: 'Open source Firebase alternative with PostgreSQL',
    icon: '⚡',
    category: 'BaaS',
    supports: ['React', 'Vue.js', 'Angular', 'React Native', 'Flutter']
  },
  {
    id: 'github-pages',
    name: 'GitHub Pages',
    description: 'Host static websites directly from GitHub repository',
    icon: '🐙',
    category: 'Static',
    supports: ['Static Sites', 'Jekyll', 'React', 'Vue.js']
  },
  {
    id: 'cloudflare-pages',
    name: 'Cloudflare Pages',
    description: 'Fast, secure, and free frontend hosting',
    icon: '☁️',
    category: 'Static',
    supports: ['React', 'Vue.js', 'Angular', 'Svelte', 'Static Sites']
  },
  {
    id: 'surge',
    name: 'Surge',
    description: 'Simple, single-command web publishing',
    icon: '⚡',
    category: 'Static',
    supports: ['Static Sites', 'Single Page Apps']
  }
];

// Use all tools from the comprehensive tools data
export const tools = getAllTools();

// Get popular tools for homepage
export const popularTools = getPopularTools();

export const createProjects = (userRole?: string) => [
  { name: 'E-commerce Dashboard', description: 'React admin panel with analytics', updated: '2 hours ago', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=120&fit=crop', status: 'active', framework: 'React' },
  { name: 'Travel Blog App', description: 'Next.js blog with CMS integration', updated: 'Yesterday', image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=200&h=120&fit=crop', status: 'completed', framework: 'Next.js' },
  { name: 'Fitness Tracker', description: 'React Native mobile application', updated: '2 days ago', image: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=200&h=120&fit=crop', status: 'active', framework: 'React Native' },
  { name: 'Recipe Manager', description: 'Vue.js recipe organizer with AI', updated: '3 days ago', image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=200&h=120&fit=crop', status: 'draft', framework: 'Vue.js' },
  { name: 'AI Chatbot Platform', description: 'Customer support chatbot with NLP', updated: '4 days ago', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=120&fit=crop', status: 'active', framework: 'Python' },
  { name: 'Social Media Scheduler', description: 'Multi-platform content scheduler', updated: '5 days ago', image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=120&fit=crop', status: 'completed', framework: 'Next.js' },
  ...(userRole === 'pro' ? [
    { name: 'Crypto Portfolio Tracker', description: 'Flutter app with real-time data', updated: '1 week ago', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=120&fit=crop', status: 'completed', framework: 'Flutter' },
    { name: 'AI Image Generator', description: 'DALL-E integration with custom UI', updated: '1 week ago', image: 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=200&h=120&fit=crop', status: 'active', framework: 'React' },
    { name: 'Video Streaming Platform', description: 'Netflix-style streaming service', updated: '2 weeks ago', image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=200&h=120&fit=crop', status: 'active', framework: 'Next.js' },
    { name: 'IoT Dashboard', description: 'Real-time IoT device monitoring', updated: '2 weeks ago', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&h=120&fit=crop', status: 'completed', framework: 'React' },
    { name: 'Blockchain Voting App', description: 'Decentralized voting system', updated: '3 weeks ago', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&h=120&fit=crop', status: 'draft', framework: 'Web3' },
    { name: 'AR Shopping Experience', description: 'Augmented reality product viewer', updated: '1 month ago', image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=200&h=120&fit=crop', status: 'completed', framework: 'React Native' }
  ] : [])
];

export const pageConfig: Record<string, PageConfig> = {
  home: { title: 'Home', breadcrumb: ['Home'] },
  dashboard: { title: 'Dashboard', breadcrumb: ['Dashboard'] },
  projects: { title: 'My Projects', breadcrumb: ['Projects'] },
  tools: { title: 'AI Tools', breadcrumb: ['Tools'] },
  generator: { title: 'Code Generator', breadcrumb: ['Tools', 'Code Generator'] },
  wizard: { title: 'Project Wizard', breadcrumb: ['Tools', 'Project Wizard'] },
  'tool-detail': { title: 'Tool Details', breadcrumb: ['Tools', 'Tool Details'] },
  integrations: { title: 'Integrations', breadcrumb: ['Integrations'] },
  deployments: { title: 'Deployments', breadcrumb: ['Deployments'] },
  analytics: { title: 'Analytics', breadcrumb: ['Analytics'] },
  settings: { title: 'Settings', breadcrumb: ['Settings'] }
};

export const featureCards: FeatureCard[] = [
  {
    title: 'Web Applications',
    description: 'React, Next.js, Vue.js applications with modern features',
    icon: Globe,
    examples: 'E-commerce, Dashboards, Blogs',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Mobile Apps',
    description: 'Cross-platform iOS & Android applications',
    icon: Smartphone,
    examples: 'Social Apps, Utilities, Games',
    color: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Desktop Apps',
    description: 'Native desktop applications for all platforms',
    icon: Monitor,
    examples: 'Productivity Tools, Media Apps',
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'APIs & Backends',
    description: 'RESTful APIs with authentication and databases',
    icon: Code,
    examples: 'User Management, Data APIs',
    color: 'from-orange-500 to-red-500'
  },
  {
    title: 'Full-Stack Solutions',
    description: 'Complete applications with frontend and backend',
    icon: Layers,
    examples: 'SaaS Platforms, Marketplaces',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    title: 'AI-Powered Apps',
    description: 'Applications with integrated AI capabilities',
    icon: Sparkles,
    examples: 'Chatbots, Image Generation',
    color: 'from-yellow-500 to-orange-500'
  }
];

// Complete navigation items including all pages
export const navigationItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, requireAuth: true },
  { id: 'projects', label: 'Projects', icon: Wrench, requireAuth: true },
  { id: 'tools', label: 'AI Tools', icon: Gamepad2 },
  { id: 'integrations', label: 'Integrations', icon: Link, requireAuth: true },
  { id: 'deployments', label: 'Deployments', icon: Rocket, requireAuth: true },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp, requireAuth: true },
  { id: 'settings', label: 'Settings', icon: Settings, requireAuth: true }
];