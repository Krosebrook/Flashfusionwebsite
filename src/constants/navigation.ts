import type { PageType } from '../types/core';

export interface NavigationItem {
  id: string;
  label: string;
  page: PageType;
  icon: string;
  description?: string;
  requiresAuth?: boolean;
  badge?: string;
  children?: NavigationItem[];
}

export interface NavigationSection {
  id: string;
  label: string;
  items: NavigationItem[];
  collapsed?: boolean;
}

export interface NavigationDropdown {
  id: string;
  label: string;
  icon: string;
  items: NavigationItem[];
}

// Core System Navigation (Missing Apps)
export const coreSystemNavigation: NavigationSection = {
  id: 'core-system',
  label: 'Core System',
  items: [
    {
      id: 'notifications',
      label: 'Notifications',
      page: 'notifications',
      icon: 'Bell',
      description: 'Activity center and real-time alerts',
      requiresAuth: true,
      badge: 'New'
    },
    {
      id: 'profile',
      label: 'Profile & Settings',
      page: 'profile',
      icon: 'User',
      description: 'Personal information and account settings',
      requiresAuth: true
    },
    {
      id: 'search',
      label: 'Global Search',
      page: 'search',
      icon: 'Search',
      description: 'Search everything with command palette',
      badge: '⌘+K'
    },
    {
      id: 'plugins',
      label: 'Plugin Manager',
      page: 'plugins',
      icon: 'Plug',
      description: 'Manage extensions and integrations',
      requiresAuth: true
    },
    {
      id: 'data-hub',
      label: 'Data Hub',
      page: 'data-hub',
      icon: 'Database',
      description: 'Import, export, and sync data',
      requiresAuth: true
    },
    {
      id: 'insights',
      label: 'Analytics & Insights',
      page: 'insights',
      icon: 'BarChart3',
      description: 'Advanced analytics and reporting',
      requiresAuth: true
    },
    {
      id: 'workspace',
      label: 'Cross-App Workspace',
      page: 'workspace',
      icon: 'Layout',
      description: 'Unified workspace dashboard',
      requiresAuth: true,
      badge: 'Beta'
    }
  ]
};

// Main Navigation Sections
export const primaryNavigation: NavigationSection = {
  id: 'primary',
  label: 'Main',
  items: [
    {
      id: 'home',
      label: 'Home',
      page: 'home',
      icon: 'Home',
      description: 'FlashFusion homepage'
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      page: 'dashboard',
      icon: 'LayoutDashboard',
      description: 'Your personalized dashboard',
      requiresAuth: true
    },
    {
      id: 'projects',
      label: 'Projects',
      page: 'projects',
      icon: 'Folder',
      description: 'Manage your projects',
      requiresAuth: true
    },
    {
      id: 'tools',
      label: 'AI Tools',
      page: 'tools',
      icon: 'Zap',
      description: '60+ AI-powered tools'
    },
    {
      id: 'templates',
      label: 'Templates',
      page: 'templates',
      icon: 'FileText',
      description: 'Ready-to-use templates'
    }
  ]
};

// Creator Suite Navigation
export const creatorNavigation: NavigationSection = {
  id: 'creator',
  label: 'Creator Suite',
  items: [
    {
      id: 'creator-hub',
      label: 'Creator Hub',
      page: 'creator-hub',
      icon: 'Crown',
      description: 'Main creator dashboard',
      requiresAuth: true
    },
    {
      id: 'creator-content-pipeline',
      label: 'Content Pipeline',
      page: 'creator-content-pipeline',
      icon: 'Pipeline',
      description: 'Content creation workflow',
      requiresAuth: true
    },
    {
      id: 'creator-commerce',
      label: 'Creator Commerce',
      page: 'creator-commerce',
      icon: 'ShoppingBag',
      description: 'Monetization platform',
      requiresAuth: true
    },
    {
      id: 'brand-kit',
      label: 'Brand Kit',
      page: 'brand-kit',
      icon: 'Palette',
      description: 'Brand asset generator',
      requiresAuth: true
    }
  ]
};

// Validation Suite Navigation
export const validationNavigation: NavigationSection = {
  id: 'validation',
  label: 'Validation Suite',
  items: [
    {
      id: 'validator-hub',
      label: 'Validator Hub',
      page: 'validator-hub',
      icon: 'Shield',
      description: 'Main validation dashboard',
      requiresAuth: true
    },
    {
      id: 'ai-validation',
      label: 'AI Validation',
      page: 'ai-validation',
      icon: 'Brain',
      description: 'AI-powered validation engine',
      requiresAuth: true
    },
    {
      id: 'cross-app-validation',
      label: 'Cross-App Data',
      page: 'cross-app-validation',
      icon: 'GitMerge',
      description: 'Data consistency validation',
      requiresAuth: true
    },
    {
      id: 'security-compliance',
      label: 'Security Compliance',
      page: 'security-compliance',
      icon: 'ShieldCheck',
      description: 'Security monitoring',
      requiresAuth: true
    },
    {
      id: 'collaboration-trust',
      label: 'Collaboration Trust',
      page: 'collaboration-trust',
      icon: 'Users',
      description: 'Team collaboration validation',
      requiresAuth: true
    },
    {
      id: 'ai-output-validator',
      label: 'AI Output Validator',
      page: 'ai-output-validator',
      icon: 'CheckCircle',
      description: 'AI content quality assurance',
      requiresAuth: true
    },
    {
      id: 'sync-integrity',
      label: 'Sync Integrity',
      page: 'sync-integrity',
      icon: 'RefreshCw',
      description: 'Data sync validation',
      requiresAuth: true
    },
    {
      id: 'system-health',
      label: 'System Health',
      page: 'system-health',
      icon: 'Activity',
      description: 'System monitoring',
      requiresAuth: true
    },
    {
      id: 'plugin-security',
      label: 'Plugin Security',
      page: 'plugin-security',
      icon: 'Lock',
      description: 'Plugin security scanner',
      requiresAuth: true
    }
  ]
};

// Advanced Tools Navigation
export const advancedNavigation: NavigationSection = {
  id: 'advanced',
  label: 'Advanced Tools',
  items: [
    {
      id: 'multi-agent',
      label: 'Multi-Agent',
      page: 'multi-agent',
      icon: 'Bot',
      description: 'AI agent orchestration',
      requiresAuth: true
    },
    {
      id: 'collaboration',
      label: 'Collaboration',
      page: 'collaboration',
      icon: 'Users',
      description: 'Team collaboration tools',
      requiresAuth: true
    },
    {
      id: 'integrations',
      label: 'Integrations',
      page: 'integrations',
      icon: 'Puzzle',
      description: 'Third-party integrations'
    },
    {
      id: 'security',
      label: 'Security Center',
      page: 'security',
      icon: 'Shield',
      description: 'Security scanning & monitoring',
      requiresAuth: true,
      badge: 'New'
    },
    {
      id: 'deployments',
      label: 'Deployments',
      page: 'deployments',
      icon: 'Rocket',
      description: 'Deploy to 8+ platforms',
      requiresAuth: true
    },
    {
      id: 'analytics',
      label: 'Analytics',
      page: 'analytics',
      icon: 'TrendingUp',
      description: 'Advanced analytics',
      requiresAuth: true
    }
  ]
};

// Public Pages Navigation
export const publicNavigation: NavigationSection = {
  id: 'public',
  label: 'Learn More',
  items: [
    {
      id: 'features',
      label: 'Features',
      page: 'features',
      icon: 'Star',
      description: 'Platform features overview'
    },
    {
      id: 'pricing',
      label: 'Pricing',
      page: 'pricing',
      icon: 'CreditCard',
      description: 'Subscription plans'
    },
    {
      id: 'demo',
      label: 'Live Demo',
      page: 'demo',
      icon: 'Play',
      description: 'Interactive demonstration'
    },
    {
      id: 'about',
      label: 'About',
      page: 'about',
      icon: 'Info',
      description: 'About FlashFusion'
    },
    {
      id: 'contact',
      label: 'Contact',
      page: 'contact',
      icon: 'MessageSquare',
      description: 'Get in touch'
    }
  ]
};

// All navigation sections
export const allNavigationSections: NavigationSection[] = [
  coreSystemNavigation,
  primaryNavigation,
  creatorNavigation,
  validationNavigation,
  advancedNavigation,
  publicNavigation
];

// Main navigation items for the Navigation component
export const MAIN_NAVIGATION_ITEMS: NavigationItem[] = [
  ...primaryNavigation.items,
  ...coreSystemNavigation.items.filter(item => !item.requiresAuth || item.id === 'search'),
];

// Navigation dropdowns for organized menus
export const NAVIGATION_DROPDOWNS: NavigationDropdown[] = [
  {
    id: 'creator-suite',
    label: 'Creator Suite',
    icon: 'Crown',
    items: creatorNavigation.items
  },
  {
    id: 'validation-suite',
    label: 'Validation Suite',
    icon: 'Shield',
    items: validationNavigation.items
  },
  {
    id: 'advanced-tools',
    label: 'Advanced Tools',
    icon: 'Settings',
    items: advancedNavigation.items
  },
  {
    id: 'core-system',
    label: 'System Apps',
    icon: 'Grid3X3',
    items: coreSystemNavigation.items
  }
];

// Quick access items for global search
export const quickAccessItems: NavigationItem[] = [
  ...coreSystemNavigation.items,
  ...primaryNavigation.items.filter(item => item.requiresAuth),
  ...creatorNavigation.items,
  ...validationNavigation.items,
  ...advancedNavigation.items.filter(item => item.requiresAuth)
];

// Get navigation item by page
export function getNavigationItem(page: PageType): NavigationItem | undefined {
  for (const section of allNavigationSections) {
    const item = section.items.find(item => item.page === page);
    if (item) return item;
  }
  return undefined;
}

// Get section for a page
export function getNavigationSection(page: PageType): NavigationSection | undefined {
  for (const section of allNavigationSections) {
    if (section.items.some(item => item.page === page)) {
      return section;
    }
  }
  return undefined;
}

// Check if page requires authentication
export function requiresAuthentication(page: PageType): boolean {
  const item = getNavigationItem(page);
  return item?.requiresAuth ?? false;
}