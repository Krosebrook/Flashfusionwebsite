import { Tool } from '../types';

export const FEATURED_TOOLS: Tool[] = [
  {
    id: 'creator-content-pipeline',
    name: 'Content Pipeline (CAP)',
    description: 'Transform one piece of content into dozens of multi-platform outputs with AI',
    category: 'generation',
    icon: '🔥',
    tier: 'pro',
    popularity: 98,
    usageCount: 2847,
    featured: true
  },
  {
    id: 'next-app-generator',
    name: 'Next.js App Generator',
    description: 'Generate full-stack Next.js applications with TypeScript, Tailwind, and more',
    category: 'generation',
    icon: '⚡',
    tier: 'free',
    popularity: 95,
    usageCount: 12543,
    featured: true
  },
  {
    id: 'react-component-builder',
    name: 'React Component Builder',
    description: 'Create reusable React components with props, styling, and documentation',
    category: 'generation',
    icon: '🧩',
    tier: 'free',
    popularity: 92,
    usageCount: 8932,
    featured: true
  },
  {
    id: 'ai-design-system',
    name: 'AI Design System',
    description: 'Generate complete design systems with tokens, components, and guidelines',
    category: 'design',
    icon: '🎨',
    tier: 'pro',
    popularity: 89,
    usageCount: 5621,
    featured: true
  },
  {
    id: 'seo-optimizer',
    name: 'SEO Optimizer',
    description: 'Optimize your web applications for search engines with AI-powered suggestions',
    category: 'optimization',
    icon: '🔍',
    tier: 'free',
    popularity: 87,
    usageCount: 7234,
    featured: true
  },
  {
    id: 'performance-analyzer',
    name: 'Performance Analyzer',
    description: 'Analyze and optimize your application\'s performance with detailed insights',
    category: 'analysis',
    icon: '📊',
    tier: 'pro',
    popularity: 85,
    usageCount: 4532,
    featured: true
  }
];

export const ALL_TOOLS: Tool[] = [
  ...FEATURED_TOOLS,
  // Generation Tools
  {
    id: 'vue-app-generator',
    name: 'Vue.js App Generator',
    description: 'Create modern Vue.js applications with Composition API and TypeScript',
    category: 'generation',
    icon: '💚',
    tier: 'free',
    popularity: 78,
    usageCount: 3421,
    featured: false
  },
  {
    id: 'svelte-app-generator',
    name: 'SvelteKit Generator',
    description: 'Build fast SvelteKit applications with modern tooling',
    category: 'generation',
    icon: '🧡',
    tier: 'free',
    popularity: 72,
    usageCount: 2187,
    featured: false
  },
  {
    id: 'angular-app-generator',
    name: 'Angular App Generator',
    description: 'Generate enterprise Angular applications with best practices',
    category: 'generation',
    icon: '🅰️',
    tier: 'pro',
    popularity: 69,
    usageCount: 1943,
    featured: false
  },
  {
    id: 'api-generator',
    name: 'REST API Generator',
    description: 'Generate RESTful APIs with Node.js, Express, and database integration',
    category: 'generation',
    icon: '🌐',
    tier: 'free',
    popularity: 84,
    usageCount: 6754,
    featured: false
  },
  {
    id: 'graphql-generator',
    name: 'GraphQL API Generator',
    description: 'Create GraphQL APIs with resolvers, types, and authentication',
    category: 'generation',
    icon: '📡',
    tier: 'pro',
    popularity: 76,
    usageCount: 3892,
    featured: false
  },

  // Design Tools
  {
    id: 'logo-generator',
    name: 'AI Logo Generator',
    description: 'Create professional logos with AI-powered design suggestions',
    category: 'design',
    icon: '🎯',
    tier: 'free',
    popularity: 91,
    usageCount: 9876,
    featured: false
  },
  {
    id: 'color-palette-generator',
    name: 'Color Palette Generator',
    description: 'Generate beautiful color palettes for your projects',
    category: 'design',
    icon: '🌈',
    tier: 'free',
    popularity: 88,
    usageCount: 11234,
    featured: false
  },
  {
    id: 'icon-generator',
    name: 'Icon Set Generator',
    description: 'Create consistent icon sets for your applications',
    category: 'design',
    icon: '🔳',
    tier: 'pro',
    popularity: 82,
    usageCount: 4567,
    featured: false
  },
  {
    id: 'mockup-generator',
    name: 'Mockup Generator',
    description: 'Generate realistic mockups and wireframes',
    category: 'design',
    icon: '📱',
    tier: 'pro',
    popularity: 79,
    usageCount: 3211,
    featured: false
  },

  // Optimization Tools
  {
    id: 'bundle-analyzer',
    name: 'Bundle Analyzer',
    description: 'Analyze and optimize your JavaScript bundles',
    category: 'optimization',
    icon: '📦',
    tier: 'free',
    popularity: 83,
    usageCount: 5432,
    featured: false
  },
  {
    id: 'image-optimizer',
    name: 'Image Optimizer',
    description: 'Optimize images for web with compression and format conversion',
    category: 'optimization',
    icon: '🖼️',
    tier: 'free',
    popularity: 90,
    usageCount: 8765,
    featured: false
  },
  {
    id: 'code-splitter',
    name: 'Code Splitter',
    description: 'Implement code splitting for better performance',
    category: 'optimization',
    icon: '✂️',
    tier: 'pro',
    popularity: 75,
    usageCount: 3456,
    featured: false
  },
  {
    id: 'lazy-loader',
    name: 'Lazy Loading Generator',
    description: 'Generate lazy loading implementations for images and components',
    category: 'optimization',
    icon: '⏳',
    tier: 'free',
    popularity: 81,
    usageCount: 4321,
    featured: false
  },

  // Analysis Tools
  {
    id: 'accessibility-checker',
    name: 'Accessibility Checker',
    description: 'Analyze and improve your application\'s accessibility',
    category: 'analysis',
    icon: '♿',
    tier: 'free',
    popularity: 86,
    usageCount: 6543,
    featured: false
  },
  {
    id: 'security-scanner',
    name: 'Security Scanner',
    description: 'Scan your code for security vulnerabilities',
    category: 'analysis',
    icon: '🔒',
    tier: 'pro',
    popularity: 77,
    usageCount: 2987,
    featured: false
  },
  {
    id: 'code-quality-analyzer',
    name: 'Code Quality Analyzer',
    description: 'Analyze code quality and get improvement suggestions',
    category: 'analysis',
    icon: '✅',
    tier: 'pro',
    popularity: 74,
    usageCount: 3654,
    featured: false
  },
  {
    id: 'lighthouse-runner',
    name: 'Lighthouse Runner',
    description: 'Run Lighthouse audits and get detailed performance reports',
    category: 'analysis',
    icon: '🏮',
    tier: 'free',
    popularity: 88,
    usageCount: 7890,
    featured: false
  },

  // Automation Tools
  {
    id: 'deployment-automation',
    name: 'Deployment Automation',
    description: 'Automate your deployment process with CI/CD pipelines',
    category: 'automation',
    icon: '🚀',
    tier: 'pro',
    popularity: 80,
    usageCount: 4123,
    featured: false
  },
  {
    id: 'testing-automation',
    name: 'Testing Automation',
    description: 'Generate automated tests for your applications',
    category: 'automation',
    icon: '🧪',
    tier: 'pro',
    popularity: 73,
    usageCount: 2876,
    featured: false
  },
  {
    id: 'backup-automation',
    name: 'Backup Automation',
    description: 'Automate database and file backups',
    category: 'automation',
    icon: '💾',
    tier: 'enterprise',
    popularity: 68,
    usageCount: 1532,
    featured: false
  },
  {
    id: 'monitoring-setup',
    name: 'Monitoring Setup',
    description: 'Set up application monitoring and alerting',
    category: 'automation',
    icon: '📊',
    tier: 'pro',
    popularity: 76,
    usageCount: 3789,
    featured: false
  },

  // Collaboration Tools
  {
    id: 'code-review-assistant',
    name: 'Code Review Assistant',
    description: 'AI-powered code review suggestions and feedback',
    category: 'collaboration',
    icon: '👥',
    tier: 'pro',
    popularity: 82,
    usageCount: 4567,
    featured: false
  },
  {
    id: 'documentation-generator',
    name: 'Documentation Generator',
    description: 'Generate comprehensive documentation for your projects',
    category: 'collaboration',
    icon: '📚',
    tier: 'free',
    popularity: 85,
    usageCount: 6789,
    featured: false
  },
  {
    id: 'changelog-generator',
    name: 'Changelog Generator',
    description: 'Automatically generate changelogs from git commits',
    category: 'collaboration',
    icon: '📝',
    tier: 'free',
    popularity: 79,
    usageCount: 4321,
    featured: false
  },
  {
    id: 'readme-generator',
    name: 'README Generator',
    description: 'Create beautiful README files for your projects',
    category: 'collaboration',
    icon: '📄',
    tier: 'free',
    popularity: 87,
    usageCount: 8901,
    featured: false
  },

  // Coming Soon
  {
    id: 'flutter-generator',
    name: 'Flutter App Generator',
    description: 'Generate cross-platform Flutter applications',
    category: 'generation',
    icon: '📱',
    tier: 'pro',
    popularity: 0,
    usageCount: 0,
    featured: false,
    comingSoon: true
  },
  {
    id: 'react-native-generator',
    name: 'React Native Generator',
    description: 'Create React Native mobile applications',
    category: 'generation',
    icon: '📲',
    tier: 'pro',
    popularity: 0,
    usageCount: 0,
    featured: false,
    comingSoon: true
  },
  {
    id: 'blockchain-generator',
    name: 'Blockchain App Generator',
    description: 'Build decentralized applications with smart contracts',
    category: 'generation',
    icon: '⛓️',
    tier: 'enterprise',
    popularity: 0,
    usageCount: 0,
    featured: false,
    comingSoon: true
  },
  {
    id: 'ai-chatbot-builder',
    name: 'AI Chatbot Builder',
    description: 'Create intelligent chatbots with natural language processing',
    category: 'automation',
    icon: '🤖',
    tier: 'pro',
    popularity: 0,
    usageCount: 0,
    featured: false,
    comingSoon: true
  },
];

export const TOOL_CATEGORIES = [
  { id: 'generation', name: 'Generation', icon: '⚡', count: ALL_TOOLS.filter(t => t.category === 'generation').length },
  { id: 'design', name: 'Design', icon: '🎨', count: ALL_TOOLS.filter(t => t.category === 'design').length },
  { id: 'optimization', name: 'Optimization', icon: '🚀', count: ALL_TOOLS.filter(t => t.category === 'optimization').length },
  { id: 'analysis', name: 'Analysis', icon: '📊', count: ALL_TOOLS.filter(t => t.category === 'analysis').length },
  { id: 'automation', name: 'Automation', icon: '🤖', count: ALL_TOOLS.filter(t => t.category === 'automation').length },
  { id: 'collaboration', name: 'Collaboration', icon: '👥', count: ALL_TOOLS.filter(t => t.category === 'collaboration').length },
];

export const getToolById = (id: string): Tool | undefined => {
  return ALL_TOOLS.find(tool => tool.id === id);
};

export const getToolsByCategory = (category: string): Tool[] => {
  return ALL_TOOLS.filter(tool => tool.category === category);
};

export const getFeaturedTools = (): Tool[] => {
  return ALL_TOOLS.filter(tool => tool.featured);
};

export const getToolsByTier = (tier: 'free' | 'pro' | 'enterprise'): Tool[] => {
  return ALL_TOOLS.filter(tool => tool.tier === tier);
};

export const searchTools = (query: string): Tool[] => {
  const lowercaseQuery = query.toLowerCase();
  return ALL_TOOLS.filter(tool =>
    tool.name.toLowerCase().includes(lowercaseQuery) ||
    tool.description.toLowerCase().includes(lowercaseQuery) ||
    tool.category.toLowerCase().includes(lowercaseQuery)
  );
};