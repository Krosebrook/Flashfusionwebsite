/**
 * Pre-built templates for quick start generation
 */

import type { GenerationTemplate } from '../types/generation';

export const GENERATION_TEMPLATES: GenerationTemplate[] = [
  // Full-Stack App Templates
  {
    id: 'template-saas-dashboard',
    name: 'SaaS Dashboard',
    description: 'Modern SaaS dashboard with authentication, billing, and analytics',
    type: 'fullstack-app',
    prompt: 'Create a modern SaaS dashboard application with user authentication, subscription billing integration (Stripe), real-time analytics dashboard, and admin panel. Include responsive design, dark mode support, and comprehensive API documentation.',
    model: 'GPT-4 Turbo',
    tags: ['saas', 'dashboard', 'authentication', 'billing'],
    popularity: 95,
  },
  {
    id: 'template-ecommerce',
    name: 'E-Commerce Platform',
    description: 'Complete e-commerce solution with cart, payments, and inventory',
    type: 'fullstack-app',
    prompt: 'Build a full-featured e-commerce platform with product catalog, shopping cart, secure checkout with Stripe/PayPal, order management, inventory tracking, customer reviews, and admin dashboard. Include responsive mobile-first design.',
    model: 'Claude 3.5 Sonnet',
    tags: ['ecommerce', 'shopping', 'payments', 'inventory'],
    popularity: 92,
  },
  {
    id: 'template-social-platform',
    name: 'Social Media Platform',
    description: 'Social networking app with posts, comments, and real-time chat',
    type: 'fullstack-app',
    prompt: 'Create a social media platform with user profiles, news feed, post creation with media upload, comments, likes, real-time notifications, direct messaging with WebSocket, and friend connections. Include moderation tools.',
    model: 'GPT-4 Turbo',
    tags: ['social', 'realtime', 'chat', 'community'],
    popularity: 88,
  },

  // Content Suite Templates
  {
    id: 'template-product-launch',
    name: 'Product Launch Campaign',
    description: 'Complete marketing suite for new product launches',
    type: 'content-suite',
    prompt: 'Generate a comprehensive product launch campaign including: press release, 5 blog posts, 20 social media posts (LinkedIn, Twitter, Instagram), email sequence (5 emails), landing page copy, FAQ section, and content calendar. Target tech-savvy professionals.',
    model: 'Claude 3.5 Sonnet',
    tags: ['marketing', 'launch', 'campaign', 'social'],
    popularity: 90,
  },
  {
    id: 'template-thought-leadership',
    name: 'Thought Leadership Series',
    description: 'Expert content series to establish industry authority',
    type: 'content-suite',
    prompt: 'Create a thought leadership content series including: 3 in-depth articles (2000+ words), LinkedIn carousel posts, Twitter threads, Medium stories, and speaking proposal. Focus on AI/ML trends and best practices.',
    model: 'GPT-4 Turbo',
    tags: ['thought-leadership', 'blog', 'expertise'],
    popularity: 85,
  },
  {
    id: 'template-video-content',
    name: 'YouTube Content Package',
    description: 'Complete YouTube channel content strategy and scripts',
    type: 'content-suite',
    prompt: 'Generate YouTube content package: 5 video scripts (10-15 min each), video titles, descriptions optimized for SEO, thumbnail concepts, pinned comment templates, and content calendar for 3 months. Focus on tech tutorials and reviews.',
    model: 'GPT-4 Turbo',
    tags: ['youtube', 'video', 'scripts', 'seo'],
    popularity: 87,
  },

  // Visual Assets Templates
  {
    id: 'template-startup-brand',
    name: 'Startup Brand Kit',
    description: 'Complete brand identity for tech startups',
    type: 'visual-assets',
    prompt: 'Create a modern tech startup brand identity package: minimalist logo (primary + 5 variations), vibrant color palette (primary, secondary, accent colors), typography system (heading, body, mono fonts), brand guidelines PDF, business card design, and social media templates.',
    model: 'DALL-E 3',
    tags: ['branding', 'startup', 'logo', 'identity'],
    popularity: 93,
  },
  {
    id: 'template-social-graphics',
    name: 'Social Media Graphics Pack',
    description: 'Branded templates for all social platforms',
    type: 'visual-assets',
    prompt: 'Design a comprehensive social media graphics pack: Instagram post templates (10), Instagram story templates (8), LinkedIn carousel templates (5), Twitter header, Facebook cover, YouTube thumbnail templates (5). Modern, professional style with consistent branding.',
    model: 'Midjourney',
    tags: ['social-media', 'graphics', 'templates'],
    popularity: 91,
  },

  // Code Components Templates
  {
    id: 'template-component-library',
    name: 'React Component Library',
    description: 'Production-ready UI component library',
    type: 'code-components',
    prompt: 'Build a comprehensive React component library with TypeScript: 20+ UI components (buttons, forms, modals, cards, tables, navigation), custom hooks, utility functions, Storybook documentation, Jest tests, and accessible components (WCAG 2.1 AA). Include build configuration and npm publishing setup.',
    model: 'Claude 3.5 Sonnet',
    tags: ['react', 'components', 'typescript', 'ui'],
    popularity: 94,
  },
  {
    id: 'template-api-wrapper',
    name: 'API Client Library',
    description: 'Type-safe API client with full documentation',
    type: 'code-components',
    prompt: 'Create a type-safe API client library with: TypeScript interfaces, request/response types, authentication handling, error handling with retries, rate limiting, caching layer, comprehensive documentation, example usage, and integration tests.',
    model: 'GPT-4 Turbo',
    tags: ['api', 'typescript', 'client', 'sdk'],
    popularity: 89,
  },
];

export function getTemplatesByType(type: string): GenerationTemplate[] {
  return GENERATION_TEMPLATES.filter(template => template.type === type).sort(
    (a, b) => b.popularity - a.popularity
  );
}

export function getPopularTemplates(limit: number = 5): GenerationTemplate[] {
  return [...GENERATION_TEMPLATES]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

export function searchTemplates(query: string): GenerationTemplate[] {
  const lowerQuery = query.toLowerCase();
  return GENERATION_TEMPLATES.filter(
    template =>
      template.name.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
