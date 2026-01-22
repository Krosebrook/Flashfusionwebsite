// Enhanced Core Type Definitions for FlashFusion
export type PageType = 'home' | 'dashboard' | 'tools' | 'projects' | 'deployments' | 
                       'analytics' | 'analytics-dashboard' | 'collaboration' | 'templates' | 'integrations' | 
                       'settings' | 'about' | 'pricing' | 'pricing-wireframe' | 'user-personas' | 'contact' | 'ai-models' | 
                       'live-collaboration' | 'cicd-pipeline' | 'responsive-ui-kit' | 'backend-architecture' | 'infrastructure-strategy' |
                       'notifications' | 'profile' | 'search' | 'plugins' | 'data-hub' | 'insights' | 'business-intelligence' | 'workspace' | 'external-integrations' | 'repository-hub' |
                       'creator-hub' | 'creator-content-pipeline' | 'creator-commerce' | 'brand-kit' | 'content-creation' | 'education' |
                       'studio-analytics-behavior' | 'studio-ai-optimization' | 'repositories' | 'features' | 'testimonials' | 'faq' | 'privacy' | 'terms' | 'demo' | 'multi-agent' | 'security' | 'tool-detail' | 'not-found' | 'github-assistant';

// User preferences and settings types
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
    types: string[];
  };
  privacy: {
    profileVisibility: 'public' | 'team' | 'private';
    dataSharing: boolean;
    analytics: boolean;
  };
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
    screenReader: boolean;
  };
}

// Subscription details type
export interface Subscription {
  id: string;
  plan: string;
  status: 'active' | 'cancelled' | 'expired' | 'trialing';
  currentPeriodEnd: string;
  features: string[];
  billingCycle?: 'monthly' | 'yearly';
  cancelAtPeriodEnd?: boolean;
}

// Enhanced User type with preferences
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'enterprise';
  credits: number;
  joinedAt: string;
  lastActive: string;
  preferences?: UserPreferences;
  subscription?: Subscription;
}