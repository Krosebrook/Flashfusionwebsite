/**
 * @fileoverview Type definitions for {{FEATURE_NAME}} Page
 * @version 1.0.0
 * @type page
 * 
 * Comprehensive TypeScript types optimized for full-page experiences:
 * - Page metadata and SEO types
 * - Navigation and routing types
 * - Analytics and tracking types
 * - Page section types
 */

import type { LucideIcon } from 'lucide-react';

/**
 * Page loading status
 */
export type FeatureStatus = 
  | 'idle'        // Initial state
  | 'loading'     // Loading page data
  | 'success'     // Data loaded successfully
  | 'error';      // Error occurred

/**
 * Page data model
 */
export interface FeatureData {
  /**
   * Unique page identifier
   */
  id: string;
  
  /**
   * Page content data
   */
  content: Record<string, unknown>;
  
  /**
   * Page metadata
   */
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: number;
    author?: string;
    status: 'draft' | 'published' | 'archived';
  };
  
  /**
   * Additional properties
   */
  properties?: Record<string, unknown>;
}

/**
 * Page configuration options
 */
export interface FeatureConfig {
  /**
   * Enable/disable page capabilities
   */
  enabled: {
    seo: boolean;               // SEO optimization
    analytics: boolean;         // Analytics tracking
    lazyLoading: boolean;       // Lazy load components
    caching: boolean;           // Cache page data
    breadcrumbs: boolean;       // Show breadcrumbs
  };
  
  /**
   * Page-specific settings
   */
  settings: {
    refreshInterval?: number;   // Auto-refresh interval (ms)
    maxCacheAge: number;        // Cache age in ms
    pageSize: number;           // Items per page for pagination
  };
  
  /**
   * SEO configuration
   */
  seo: {
    enableMetaTags: boolean;
    enableStructuredData: boolean;
    enableOpenGraph: boolean;
    enableTwitterCard: boolean;
  };
  
  /**
   * UI preferences
   */
  ui: {
    theme: 'auto' | 'light' | 'dark';
    layout: 'default' | 'compact' | 'wide';
    showHeader: boolean;
    showFooter: boolean;
  };
}

/**
 * Page metadata for SEO
 */
export interface PageMetadata {
  /**
   * Page title
   */
  title: string;
  
  /**
   * Meta description
   */
  description: string;
  
  /**
   * Keywords for SEO
   */
  keywords?: string[];
  
  /**
   * Canonical URL
   */
  canonical?: string;
  
  /**
   * Open Graph metadata
   */
  openGraph?: {
    title: string;
    description: string;
    image?: string;
    url?: string;
    type?: string;
  };
  
  /**
   * Twitter Card metadata
   */
  twitterCard?: {
    card: 'summary' | 'summary_large_image' | 'app' | 'player';
    title: string;
    description: string;
    image?: string;
  };
  
  /**
   * Structured data (JSON-LD)
   */
  structuredData?: Record<string, unknown>;
  
  /**
   * Robots meta tag
   */
  robots?: 'index,follow' | 'noindex,follow' | 'index,nofollow' | 'noindex,nofollow';
}

/**
 * Page section configuration
 */
export interface PageSection {
  /**
   * Section ID
   */
  id: string;
  
  /**
   * Section title
   */
  title: string;
  
  /**
   * Section description
   */
  description?: string;
  
  /**
   * Section icon
   */
  icon?: LucideIcon;
  
  /**
   * Section content
   */
  content: React.ReactNode;
  
  /**
   * Section order (for sorting)
   */
  order?: number;
  
  /**
   * Whether section is visible
   */
  visible?: boolean;
}

/**
 * Navigation item
 */
export interface NavigationItem {
  /**
   * Item label
   */
  label: string;
  
  /**
   * Item href
   */
  href?: string;
  
  /**
   * Item icon
   */
  icon?: LucideIcon;
  
  /**
   * Child items
   */
  children?: NavigationItem[];
  
  /**
   * Whether item is active
   */
  active?: boolean;
  
  /**
   * Whether item is disabled
   */
  disabled?: boolean;
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  /**
   * Item label
   */
  label: string;
  
  /**
   * Item href (optional for last item)
   */
  href?: string;
  
  /**
   * Item icon
   */
  icon?: LucideIcon;
}

/**
 * Page error types
 */
export type FeatureErrorCode =
  | 'LOAD_FAILED'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'UNKNOWN_ERROR';

/**
 * Error object
 */
export interface FeatureError {
  /**
   * Error code
   */
  code: FeatureErrorCode;
  
  /**
   * Error message
   */
  message: string;
  
  /**
   * Error details
   */
  details?: Record<string, unknown>;
  
  /**
   * HTTP status code
   */
  statusCode?: number;
  
  /**
   * Timestamp
   */
  timestamp: Date;
  
  /**
   * Whether error is retryable
   */
  retryable: boolean;
}

/**
 * API response for page data
 */
export interface FeatureAPIResponse {
  /**
   * Success status
   */
  success: boolean;
  
  /**
   * Page data
   */
  data?: FeatureData;
  
  /**
   * Error information
   */
  error?: FeatureError;
  
  /**
   * Response metadata
   */
  metadata?: {
    timestamp: Date;
    requestId: string;
    cached?: boolean;
  };
}

/**
 * Analytics event for page tracking
 */
export interface AnalyticsEvent {
  /**
   * Event name
   */
  event: 'page_view' | 'page_exit' | 'section_view' | 'interaction' | 'error';
  
  /**
   * Event properties
   */
  properties: {
    pageTitle?: string;
    pagePath?: string;
    section?: string;
    timeOnPage?: number;
    scrollDepth?: number;
    [key: string]: unknown;
  };
  
  /**
   * Event timestamp
   */
  timestamp: Date;
  
  /**
   * User ID
   */
  userId?: string;
  
  /**
   * Session ID
   */
  sessionId?: string;
}

/**
 * Cache entry for page data
 */
export interface CacheEntry<T> {
  /**
   * Cached data
   */
  data: T;
  
  /**
   * Cache timestamp
   */
  timestamp: number;
  
  /**
   * Time-to-live
   */
  ttl: number;
  
  /**
   * Cache key
   */
  key: string;
}

/**
 * Service options
 */
export interface ServiceOptions {
  /**
   * Enable caching
   */
  cache?: boolean;
  
  /**
   * Request timeout
   */
  timeout?: number;
  
  /**
   * Signal for aborting
   */
  signal?: AbortSignal;
}

/**
 * Store state interface for Zustand
 */
export interface FeatureStore {
  // State
  data: FeatureData | null;
  status: FeatureStatus;
  error: FeatureError | null;
  config: FeatureConfig;
  metadata: PageMetadata | null;
  
  // Actions
  loadData: (options?: ServiceOptions) => Promise<void>;
  updateConfig: (config: Partial<FeatureConfig>) => void;
  setMetadata: (metadata: Partial<PageMetadata>) => void;
  clearError: () => void;
  reset: () => void;
  
  // Computed values
  isLoading: () => boolean;
  hasError: () => boolean;
  hasData: () => boolean;
}

/**
 * Page layout type
 */
export type PageLayout = 'default' | 'compact' | 'wide' | 'dashboard' | 'article';

/**
 * Page theme
 */
export type PageTheme = 'auto' | 'light' | 'dark';

/**
 * Pagination info
 */
export interface PaginationInfo {
  /**
   * Current page number (1-indexed)
   */
  currentPage: number;
  
  /**
   * Total number of pages
   */
  totalPages: number;
  
  /**
   * Items per page
   */
  pageSize: number;
  
  /**
   * Total number of items
   */
  totalItems: number;
  
  /**
   * Whether there's a next page
   */
  hasNext: boolean;
  
  /**
   * Whether there's a previous page
   */
  hasPrevious: boolean;
}

/**
 * Tab configuration for page sections
 */
export interface TabConfig {
  /**
   * Tab ID
   */
  id: string;
  
  /**
   * Tab label
   */
  label: string;
  
  /**
   * Tab content
   */
  content: React.ReactNode;
  
  /**
   * Tab icon
   */
  icon?: LucideIcon;
  
  /**
   * Badge count
   */
  badge?: number;
  
  /**
   * Whether tab is disabled
   */
  disabled?: boolean;
}
