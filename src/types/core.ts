/**
 * @fileoverview Enhanced core type definitions for FlashFusion platform
 * @module types/core
 */

/**
 * Available page types in the FlashFusion application
 * Defines all possible navigation destinations and views
 * @typedef {'home' | 'dashboard' | 'tools' | 'projects' | 'deployments' | 
 *           'analytics' | 'collaboration' | 'templates' | 'integrations' | 
 *           'settings' | 'about' | 'pricing' | 'pricing-wireframe' | 'user-personas' | 'contact' | 'ai-models' | 
 *           'live-collaboration' | 'cicd-pipeline' | 'responsive-ui-kit' | 'backend-architecture' | 'infrastructure-strategy' |
 *           'notifications' | 'profile' | 'search' | 'plugins' | 'data-hub' | 'insights' | 'business-intelligence' | 'workspace' | 'external-integrations' | 'repository-hub' |
 *           'creator-hub' | 'creator-content-pipeline' | 'creator-commerce' | 'brand-kit' | 'content-creation' | 'education' |
 *           'studio-analytics-behavior' | 'studio-ai-optimization'} PageType
 */
export type PageType = 'home' | 'dashboard' | 'tools' | 'projects' | 'deployments' | 
                       'analytics' | 'collaboration' | 'templates' | 'integrations' | 
                       'settings' | 'about' | 'pricing' | 'pricing-wireframe' | 'user-personas' | 'contact' | 'ai-models' | 
                       'live-collaboration' | 'cicd-pipeline' | 'responsive-ui-kit' | 'backend-architecture' | 'infrastructure-strategy' |
                       'notifications' | 'profile' | 'search' | 'plugins' | 'data-hub' | 'insights' | 'business-intelligence' | 'workspace' | 'external-integrations' | 'repository-hub' |
                       'creator-hub' | 'creator-content-pipeline' | 'creator-commerce' | 'brand-kit' | 'content-creation' | 'education' |
                       'studio-analytics-behavior' | 'studio-ai-optimization';