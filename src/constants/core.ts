/**
 * @fileoverview Core application constants for FlashFusion
 * @description Contains constants for navigation, user management, branding, and core app functionality
 */

/**
 * Application navigation routes and metadata
 * @description Defines all available routes with their display names and access requirements
 */
export const NAVIGATION_ROUTES = {
  // Public routes
  PUBLIC: {
    HOME: 'home',
    ABOUT: 'about',
    FEATURES: 'features', 
    PRICING: 'pricing',
    CONTACT: 'contact',
    TESTIMONIALS: 'testimonials',
    FAQ: 'faq',
    DEMO: 'demo',
    TERMS: 'terms',
    PRIVACY: 'privacy'
  },
  
  // Creator Mode routes
  CREATOR: {
    CREATOR_MODE: 'creator-mode',
    BRAND_KIT_GENERATOR: 'brand-kit-generator',
    CONTENT_CREATION_HUB: 'content-creation-hub',
    PRINT_DESIGNER: 'print-designer',
    MARKETPLACE_MANAGER: 'marketplace-manager',
    PRODUCT_CATALOG: 'product-catalog',
    ORDER_MANAGEMENT: 'order-management',
    FULFILLMENT_CENTER: 'fulfillment-center'
  },
  
  // Protected routes
  PROTECTED: {
    DASHBOARD: 'dashboard',
    PROJECTS: 'projects',
    TOOLS: 'tools',
    TOOL_DETAIL: 'tool-detail',
    ANALYTICS: 'analytics',
    PRODUCTION_ANALYTICS: 'production-analytics',
    SETTINGS: 'settings',
    INTEGRATIONS: 'integrations',
    DEPLOYMENTS: 'deployments',
    TEMPLATES: 'templates',
    COLLABORATION: 'collaboration',
    CICD: 'cicd',
    SUBSCRIPTION: 'subscription',
    LAUNCH_CAMPAIGN: 'launch-campaign'
  }
} as const;

/**
 * Route display names for UI components
 * @description Human-readable names for navigation routes
 */
export const ROUTE_DISPLAY_NAMES = {
  [NAVIGATION_ROUTES.PUBLIC.HOME]: 'Home',
  [NAVIGATION_ROUTES.PUBLIC.ABOUT]: 'About Us',
  [NAVIGATION_ROUTES.PUBLIC.FEATURES]: 'Features',
  [NAVIGATION_ROUTES.PUBLIC.PRICING]: 'Pricing',
  [NAVIGATION_ROUTES.PUBLIC.CONTACT]: 'Contact',
  [NAVIGATION_ROUTES.PUBLIC.TESTIMONIALS]: 'Testimonials',
  [NAVIGATION_ROUTES.PUBLIC.FAQ]: 'FAQ',
  [NAVIGATION_ROUTES.PUBLIC.DEMO]: 'Demo',
  [NAVIGATION_ROUTES.PUBLIC.TERMS]: 'Terms of Service',
  [NAVIGATION_ROUTES.PUBLIC.PRIVACY]: 'Privacy Policy',
  
  [NAVIGATION_ROUTES.CREATOR.CREATOR_MODE]: 'Creator Mode',
  [NAVIGATION_ROUTES.CREATOR.BRAND_KIT_GENERATOR]: 'Brand Kit Generator',
  [NAVIGATION_ROUTES.CREATOR.CONTENT_CREATION_HUB]: 'Content Hub',
  [NAVIGATION_ROUTES.CREATOR.PRINT_DESIGNER]: 'Print Designer',
  [NAVIGATION_ROUTES.CREATOR.MARKETPLACE_MANAGER]: 'Marketplace Manager',
  [NAVIGATION_ROUTES.CREATOR.PRODUCT_CATALOG]: 'Product Catalog',
  [NAVIGATION_ROUTES.CREATOR.ORDER_MANAGEMENT]: 'Order Management',
  [NAVIGATION_ROUTES.CREATOR.FULFILLMENT_CENTER]: 'Fulfillment Center',
  
  [NAVIGATION_ROUTES.PROTECTED.DASHBOARD]: 'Dashboard',
  [NAVIGATION_ROUTES.PROTECTED.PROJECTS]: 'Projects',
  [NAVIGATION_ROUTES.PROTECTED.TOOLS]: 'AI Tools',
  [NAVIGATION_ROUTES.PROTECTED.TOOL_DETAIL]: 'Tool Details',
  [NAVIGATION_ROUTES.PROTECTED.ANALYTICS]: 'Analytics',
  [NAVIGATION_ROUTES.PROTECTED.PRODUCTION_ANALYTICS]: 'Production Analytics',
  [NAVIGATION_ROUTES.PROTECTED.SETTINGS]: 'Settings',
  [NAVIGATION_ROUTES.PROTECTED.INTEGRATIONS]: 'Integrations',
  [NAVIGATION_ROUTES.PROTECTED.DEPLOYMENTS]: 'Deployments',
  [NAVIGATION_ROUTES.PROTECTED.TEMPLATES]: 'Templates',
  [NAVIGATION_ROUTES.PROTECTED.COLLABORATION]: 'Collaboration',
  [NAVIGATION_ROUTES.PROTECTED.CICD]: 'CI/CD Pipeline',
  [NAVIGATION_ROUTES.PROTECTED.SUBSCRIPTION]: 'Subscription',
  [NAVIGATION_ROUTES.PROTECTED.LAUNCH_CAMPAIGN]: 'Launch Campaign'
} as const;

/**
 * Subscription tier configurations
 * @description Defines available subscription levels with their capabilities
 */
export const SUBSCRIPTION_TIERS = {
  FREE: {
    id: 'free',
    name: 'Free',
    displayName: 'Free Plan',
    price: 0,
    limits: {
      projects: 3,
      aiToolsPerMonth: 50,
      storageGB: 1,
      collaborators: 1,
      deploymentsPerMonth: 5,
      printProducts: 0,
      marketplaceListings: 0
    },
    features: [
      'Basic AI tools',
      'Project templates',
      'Community support',
      'Basic analytics'
    ]
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    displayName: 'Pro Plan',
    price: 29,
    limits: {
      projects: 50,
      aiToolsPerMonth: 500,
      storageGB: 25,
      collaborators: 5,
      deploymentsPerMonth: 50,
      printProducts: 100,
      marketplaceListings: 25
    },
    features: [
      'All AI tools',
      'Advanced templates',
      'Priority support',
      'Advanced analytics',
      'Brand kit generator',
      'Content automation',
      'Print-on-demand suite',
      'Multi-marketplace sync'
    ]
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    displayName: 'Enterprise Plan',
    price: 99,
    limits: {
      projects: -1, // Unlimited
      aiToolsPerMonth: -1, // Unlimited
      storageGB: 500,
      collaborators: 50,
      deploymentsPerMonth: -1, // Unlimited
      printProducts: -1, // Unlimited
      marketplaceListings: -1 // Unlimited
    },
    features: [
      'Everything in Pro',
      'White-label solutions',
      'Custom integrations',
      'Dedicated support',
      'Advanced CI/CD',
      'Team management',
      'Custom print fulfillment',
      'API access',
      'SLA guarantee'
    ]
  }
} as const;

/**
 * User experience levels and progression
 * @description Defines user level progression system
 */
export const USER_LEVELS = {
  1: { name: 'Newcomer', minXP: 0, maxXP: 100, color: '#94A3B8' },
  2: { name: 'Explorer', minXP: 100, maxXP: 300, color: '#10B981' },
  3: { name: 'Builder', minXP: 300, maxXP: 600, color: '#3B82F6' },
  4: { name: 'Creator', minXP: 600, maxXP: 1000, color: '#8B5CF6' },
  5: { name: 'Expert', minXP: 1000, maxXP: 1500, color: '#F59E0B' },
  6: { name: 'Master', minXP: 1500, maxXP: 2200, color: '#EF4444' },
  7: { name: 'Innovator', minXP: 2200, maxXP: 3000, color: '#FF7B00' },
  8: { name: 'Visionary', minXP: 3000, maxXP: 4000, color: '#E91E63' },
  9: { name: 'Pioneer', minXP: 4000, maxXP: 5500, color: '#00B4D8' },
  10: { name: 'Legend', minXP: 5500, maxXP: -1, color: '#FFD700' }
} as const;

/**
 * Experience point rewards for various actions
 * @description XP values for gamification system
 */
export const XP_REWARDS = {
  // Basic actions
  SIGN_UP: 50,
  COMPLETE_PROFILE: 25,
  FIRST_LOGIN: 10,
  DAILY_LOGIN: 5,
  
  // Project actions
  CREATE_PROJECT: 30,
  FIRST_PROJECT_SETUP: 100,
  PROJECT_DEPLOYMENT: 50,
  PROJECT_COMPLETION: 75,
  
  // Tool usage
  TOOL_USAGE: 10,
  FIRST_AI_TOOL: 25,
  TOOL_MASTERY: 100, // Using same tool 50+ times
  
  // Creator Mode
  BRAND_KIT_CREATION: 100,
  CONTENT_CREATION: 15,
  VIRAL_CONTENT: 200, // Content gets 10k+ views
  COLLABORATION: 50,
  
  // Print-on-Demand
  FIRST_DESIGN: 50,
  PRODUCT_SALE: 25,
  MARKETPLACE_LISTING: 20,
  
  // Social actions
  SHARE_PROJECT: 20,
  REFER_USER: 100,
  COMMUNITY_CONTRIBUTION: 50,
  
  // Achievements
  STREAK_7_DAYS: 100,
  STREAK_30_DAYS: 500,
  LEVEL_UP_BONUS: 200
} as const;

/**
 * FlashFusion brand color palette
 * @description Official brand colors for consistent theming
 */
export const BRAND_COLORS = {
  PRIMARY: '#FF7B00', // Orange
  SECONDARY: '#00B4D8', // Cyan
  ACCENT: '#E91E63', // Magenta
  
  // Background colors
  BG_DARK: '#0F172A', // Dark Navy
  SURFACE: '#1E293B', // Surface Slate
  SURFACE_LIGHT: '#334155', // Light Surface
  
  // Text colors
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#CBD5E1',
  TEXT_MUTED: '#94A3B8',
  
  // Status colors
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#00B4D8'
} as const;

/**
 * Typography configuration
 * @description Font families and weights for consistent typography
 */
export const TYPOGRAPHY = {
  FONTS: {
    PRIMARY: 'Sora, system-ui, -apple-system, sans-serif',
    BODY: 'Inter, system-ui, -apple-system, sans-serif',
    MONO: 'JetBrains Mono, SF Mono, Consolas, monospace'
  },
  WEIGHTS: {
    LIGHT: 300,
    REGULAR: 400,
    MEDIUM: 500,
    SEMIBOLD: 600,
    BOLD: 700
  },
  SIZES: {
    XS: '0.75rem',    // 12px
    SM: '0.875rem',   // 14px
    BASE: '1rem',     // 16px
    LG: '1.125rem',   // 18px
    XL: '1.25rem',    // 20px
    '2XL': '1.5rem',  // 24px
    '3XL': '1.875rem', // 30px
    '4XL': '2.25rem', // 36px
    '5XL': '3rem'     // 48px
  }
} as const;

/**
 * Animation and transition constants
 * @description Consistent timing and easing for animations
 */
export const ANIMATIONS = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 450,
    SLOWER: 600
  },
  EASING: {
    DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    IN: 'cubic-bezier(0.4, 0, 1, 1)',
    OUT: 'cubic-bezier(0, 0, 0.2, 1)',
    IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },
  SPRING: {
    GENTLE: { type: 'spring', stiffness: 300, damping: 30 },
    BOUNCY: { type: 'spring', stiffness: 400, damping: 25 },
    SNAPPY: { type: 'spring', stiffness: 500, damping: 35 }
  }
} as const;

/**
 * Spacing system constants
 * @description Consistent spacing values for layout
 */
export const SPACING = {
  XS: '0.25rem',  // 4px
  SM: '0.5rem',   // 8px
  MD: '1rem',     // 16px
  LG: '1.5rem',   // 24px
  XL: '2rem',     // 32px
  '2XL': '3rem',  // 48px
  '3XL': '4rem',  // 64px
  '4XL': '5rem',  // 80px
  '5XL': '6rem'   // 96px
} as const;

/**
 * Breakpoint constants for responsive design
 * @description Screen size breakpoints
 */
export const BREAKPOINTS = {
  SM: 640,   // Small devices
  MD: 768,   // Medium devices
  LG: 1024,  // Large devices
  XL: 1280,  // Extra large devices
  '2XL': 1536 // 2X large devices
} as const;

/**
 * Z-index layering system
 * @description Consistent z-index values for proper layering
 */
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080
} as const;

/**
 * Notification types and configurations
 * @description Standard notification types with styling
 */
export const NOTIFICATION_TYPES = {
  INFO: {
    type: 'info',
    icon: 'Info',
    color: BRAND_COLORS.INFO,
    duration: 5000
  },
  SUCCESS: {
    type: 'success',
    icon: 'CheckCircle',
    color: BRAND_COLORS.SUCCESS,
    duration: 4000
  },
  WARNING: {
    type: 'warning',
    icon: 'AlertTriangle',
    color: BRAND_COLORS.WARNING,
    duration: 6000
  },
  ERROR: {
    type: 'error',
    icon: 'AlertCircle',
    color: BRAND_COLORS.ERROR,
    duration: 8000
  }
} as const;

/**
 * Default avatar images and placeholders
 * @description Fallback images and placeholder content
 */
export const DEFAULTS = {
  AVATAR_URL: '/images/default-avatar.png',
  PROJECT_IMAGE: '/images/default-project.png',
  BRAND_LOGO_PLACEHOLDER: '/images/brand-placeholder.svg',
  
  // Pagination
  ITEMS_PER_PAGE: 12,
  MAX_ITEMS_PER_PAGE: 50,
  
  // File upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'text/plain']
} as const;