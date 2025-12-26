/**
 * @fileoverview Type definitions for AnalyticsDashboard
 * @version 1.0.0
 * 
 * Comprehensive TypeScript types for the feature including:
 * - Data models
 * - Configuration options
 * - API request/response types
 * - Component prop types
 * - State management types
 */

/**
 * Feature status enumeration
 */
export type FeatureStatus = 
  | 'idle'        // Initial state, not yet started
  | 'loading'     // Loading initial data
  | 'processing'  // Processing user input
  | 'success'     // Completed successfully
  | 'error';      // Error occurred

/**
 * Feature data model
 * Represents the core data structure used by the feature
 */
export interface FeatureData {
  /**
   * Unique identifier for the data
   */
  id: string;
  
  /**
   * User input or source data
   */
  input: string;
  
  /**
   * Processed or transformed data
   */
  output?: string;
  
  /**
   * Metadata about the data
   */
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: number;
    tags: string[];
  };
  
  /**
   * Additional custom properties
   */
  properties?: Record<string, unknown>;
}

/**
 * Feature configuration options
 * Defines how the feature behaves and what capabilities are enabled
 */
export interface FeatureConfig {
  /**
   * Enable/disable specific feature capabilities
   */
  enabled: {
    autoProcess: boolean;
    caching: boolean;
    analytics: boolean;
    debugging: boolean;
  };
  
  /**
   * Feature-specific settings
   */
  settings: {
    /**
     * Maximum processing time in milliseconds
     */
    timeout: number;
    
    /**
     * Number of retry attempts on failure
     */
    retryAttempts: number;
    
    /**
     * Delay between retries in milliseconds
     */
    retryDelay: number;
    
    /**
     * Maximum data size in bytes
     */
    maxDataSize: number;
  };
  
  /**
   * API configuration
   */
  api?: {
    baseUrl: string;
    apiKey?: string;
    headers?: Record<string, string>;
  };
  
  /**
   * UI preferences
   */
  ui?: {
    theme: 'light' | 'dark' | 'auto';
    compact: boolean;
    showAdvanced: boolean;
  };
}

/**
 * Feature processing result
 * The output returned when feature completes successfully
 */
export interface FeatureResult {
  /**
   * Success indicator
   */
  success: boolean;
  
  /**
   * Result message
   */
  message: string;
  
  /**
   * Processed data
   */
  data: FeatureData;
  
  /**
   * Processing metadata
   */
  metadata: {
    /**
     * Time taken to process in milliseconds
     */
    processingTime: number;
    
    /**
     * Timestamp when processing completed
     */
    completedAt: Date;
    
    /**
     * Number of operations performed
     */
    operationCount: number;
  };
  
  /**
   * Additional result properties
   */
  [key: string]: unknown;
}

/**
 * Feature error with additional context
 */
export interface FeatureError extends Error {
  /**
   * Error code for categorization
   */
  code: string;
  
  /**
   * HTTP status code if applicable
   */
  statusCode?: number;
  
  /**
   * Additional error details
   */
  details?: Record<string, unknown>;
  
  /**
   * Whether the operation can be retried
   */
  retryable: boolean;
  
  /**
   * Suggested recovery action
   */
  recovery?: string;
}

/**
 * API request payload
 */
export interface FeatureAPIRequest {
  /**
   * Request action type
   */
  action: 'process' | 'validate' | 'transform';
  
  /**
   * Request payload data
   */
  data: Partial<FeatureData>;
  
  /**
   * Request options
   */
  options?: {
    skipValidation?: boolean;
    async?: boolean;
    priority?: 'low' | 'normal' | 'high';
  };
}

/**
 * API response payload
 */
export interface FeatureAPIResponse<T = unknown> {
  /**
   * Success indicator
   */
  success: boolean;
  
  /**
   * Response data
   */
  data?: T;
  
  /**
   * Error information if request failed
   */
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  
  /**
   * Response metadata
   */
  metadata: {
    requestId: string;
    timestamp: Date;
    version: string;
  };
}

/**
 * Feature state for Zustand store
 */
export interface FeatureState {
  /**
   * Current feature data
   */
  data: FeatureData | null;
  
  /**
   * Current status
   */
  status: FeatureStatus;
  
  /**
   * Current error if any
   */
  error: FeatureError | null;
  
  /**
   * Latest result
   */
  result: FeatureResult | null;
  
  /**
   * Feature configuration
   */
  config: FeatureConfig;
  
  /**
   * Processing history
   */
  history: FeatureResult[];
}

/**
 * Feature store actions
 */
export interface FeatureActions {
  /**
   * Initialize the feature with configuration and optional initial data
   */
  initialize: (config?: Partial<FeatureConfig>, initialData?: FeatureData) => Promise<void>;
  
  /**
   * Process data through the feature
   */
  processData: (data: Partial<FeatureData>) => Promise<void>;
  
  /**
   * Update feature configuration
   */
  updateConfig: (config: Partial<FeatureConfig>) => void;
  
  /**
   * Reset feature to initial state
   */
  reset: () => void;
  
  /**
   * Clear error state
   */
  clearError: () => void;
  
  /**
   * Add result to history
   */
  addToHistory: (result: FeatureResult) => void;
  
  /**
   * Clear processing history
   */
  clearHistory: () => void;
}

/**
 * Complete feature store type (state + actions)
 */
export type FeatureStore = FeatureState & FeatureActions;

/**
 * Service method options
 */
export interface ServiceOptions {
  /**
   * Request timeout in milliseconds
   */
  timeout?: number;
  
  /**
   * Enable/disable caching
   */
  cache?: boolean;
  
  /**
   * Abort signal for cancellation
   */
  signal?: AbortSignal;
  
  /**
   * Additional headers for API requests
   */
  headers?: Record<string, string>;
}

/**
 * Cache entry structure
 */
export interface CacheEntry<T> {
  /**
   * Cached data
   */
  data: T;
  
  /**
   * Timestamp when cached
   */
  timestamp: number;
  
  /**
   * Time-to-live in milliseconds
   */
  ttl: number;
}

/**
 * Event payload for analytics
 */
export interface FeatureAnalyticsEvent {
  /**
   * Event name
   */
  event: string;
  
  /**
   * Event properties
   */
  properties: Record<string, unknown>;
  
  /**
   * Timestamp
   */
  timestamp: Date;
  
  /**
   * User identifier (if available)
   */
  userId?: string;
  
  /**
   * Session identifier
   */
  sessionId: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  /**
   * Whether validation passed
   */
  valid: boolean;
  
  /**
   * Validation errors if any
   */
  errors: Array<{
    field: string;
    message: string;
    code: string;
  }>;
  
  /**
   * Validation warnings
   */
  warnings?: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * Export all types as a namespace for convenience
 */
export namespace FeatureTypes {
  export type Status = FeatureStatus;
  export type Data = FeatureData;
  export type Config = FeatureConfig;
  export type Result = FeatureResult;
  export type Error = FeatureError;
  export type APIRequest = FeatureAPIRequest;
  export type APIResponse = FeatureAPIResponse;
  export type State = FeatureState;
  export type Actions = FeatureActions;
  export type Store = FeatureStore;
}
