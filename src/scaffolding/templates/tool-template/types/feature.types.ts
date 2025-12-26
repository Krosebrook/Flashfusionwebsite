/**
 * @fileoverview Type definitions for {{FEATURE_NAME}} Tool
 * @version 1.0.0
 * @type tool
 * 
 * Comprehensive TypeScript types optimized for interactive tool features:
 * - Input/output processing types
 * - AI integration types
 * - Export/download types
 * - Real-time processing types
 */

/**
 * Tool processing status
 */
export type FeatureStatus = 
  | 'idle'        // Initial state, awaiting input
  | 'validating'  // Validating input data
  | 'processing'  // Processing user input
  | 'success'     // Completed successfully
  | 'error';      // Error occurred

/**
 * Input data for the tool
 */
export interface FeatureData {
  /**
   * Unique identifier for this processing session
   */
  id: string;
  
  /**
   * User input or source data
   */
  input: string;
  
  /**
   * Processed output data
   */
  output?: string;
  
  /**
   * Processing metadata
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
 * Tool configuration options
 */
export interface FeatureConfig {
  /**
   * Enable/disable tool capabilities
   */
  enabled: {
    autoProcess: boolean;      // Auto-process on input change
    caching: boolean;           // Cache results
    analytics: boolean;         // Track usage analytics
    aiPowered: boolean;         // Use AI for processing
    realTime: boolean;          // Real-time processing
  };
  
  /**
   * Tool-specific settings
   */
  settings: {
    timeout: number;            // Processing timeout in ms
    retryAttempts: number;      // Number of retry attempts
    retryDelay: number;         // Delay between retries in ms
    maxInputSize: number;       // Max input size in bytes
    maxOutputSize: number;      // Max output size in bytes
    quality: 'low' | 'medium' | 'high' | 'ultra';
  };
  
  /**
   * Export/download options
   */
  export: {
    formats: ('txt' | 'json' | 'csv' | 'md')[];
    includeMetadata: boolean;
    compression: boolean;
  };
  
  /**
   * UI preferences
   */
  ui: {
    theme: 'auto' | 'light' | 'dark';
    compact: boolean;
    showAdvanced: boolean;
    animationsEnabled: boolean;
  };
}

/**
 * Processing result
 */
export interface FeatureResult {
  /**
   * Processed output data
   */
  output: string;
  
  /**
   * Result metadata
   */
  metadata?: {
    processingTime?: number;    // Time taken in ms
    tokensUsed?: number;        // AI tokens used
    cost?: number;              // Processing cost
    model?: string;             // AI model used
    quality?: string;           // Output quality
  };
  
  /**
   * Suggestions or recommendations
   */
  suggestions?: string[];
  
  /**
   * Warnings or notices
   */
  warnings?: string[];
  
  /**
   * Additional result data
   */
  data?: Record<string, unknown>;
}

/**
 * Processing options for the tool
 */
export interface ProcessingOptions {
  /**
   * Processing mode
   */
  mode: 'fast' | 'balanced' | 'quality';
  
  /**
   * Target output format
   */
  format?: string;
  
  /**
   * Custom parameters
   */
  parameters?: Record<string, unknown>;
  
  /**
   * Stream results in real-time
   */
  stream?: boolean;
  
  /**
   * Include intermediate results
   */
  includeSteps?: boolean;
}

/**
 * Tool-specific error types
 */
export type FeatureErrorCode =
  | 'INVALID_INPUT'
  | 'PROCESSING_FAILED'
  | 'TIMEOUT'
  | 'RATE_LIMIT'
  | 'QUOTA_EXCEEDED'
  | 'API_ERROR'
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR'
  | 'EXPORT_ERROR'
  | 'UNKNOWN_ERROR';

/**
 * Error object with recovery information
 */
export interface FeatureError {
  /**
   * Error code for categorization
   */
  code: FeatureErrorCode;
  
  /**
   * Human-readable error message
   */
  message: string;
  
  /**
   * Detailed error information
   */
  details?: Record<string, unknown>;
  
  /**
   * Whether the operation can be retried
   */
  retryable: boolean;
  
  /**
   * Suggested recovery action
   */
  recovery?: {
    action: 'retry' | 'adjust_input' | 'change_settings' | 'contact_support';
    message: string;
  };
  
  /**
   * Timestamp when error occurred
   */
  timestamp: Date;
}

/**
 * API request payload for tool processing
 */
export interface FeatureAPIRequest {
  /**
   * Input data to process
   */
  input: string;
  
  /**
   * Processing options
   */
  options?: ProcessingOptions;
  
  /**
   * Session ID for tracking
   */
  sessionId?: string;
  
  /**
   * User ID for tracking
   */
  userId?: string;
  
  /**
   * Additional request metadata
   */
  metadata?: Record<string, unknown>;
}

/**
 * API response from tool processing
 */
export interface FeatureAPIResponse {
  /**
   * Whether the request was successful
   */
  success: boolean;
  
  /**
   * Result data
   */
  result?: FeatureResult;
  
  /**
   * Error information if failed
   */
  error?: FeatureError;
  
  /**
   * Request ID for tracking
   */
  requestId: string;
  
  /**
   * Response timestamp
   */
  timestamp: Date;
}

/**
 * Input validation result
 */
export interface ValidationResult {
  /**
   * Whether input is valid
   */
  valid: boolean;
  
  /**
   * Validation errors
   */
  errors?: Array<{
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
 * Export options for downloading results
 */
export interface ExportOptions {
  /**
   * Export format
   */
  format: 'txt' | 'json' | 'csv' | 'md' | 'html';
  
  /**
   * File name (without extension)
   */
  filename?: string;
  
  /**
   * Include metadata in export
   */
  includeMetadata?: boolean;
  
  /**
   * Compress the export
   */
  compress?: boolean;
  
  /**
   * Encoding for text formats
   */
  encoding?: 'utf-8' | 'ascii';
}

/**
 * Cache entry for storing processed results
 */
export interface CacheEntry<T> {
  /**
   * Cached data
   */
  data: T;
  
  /**
   * When the cache entry was created
   */
  timestamp: number;
  
  /**
   * Time-to-live in milliseconds
   */
  ttl: number;
  
  /**
   * Cache key
   */
  key: string;
}

/**
 * Service options for tool operations
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
   * Retry configuration
   */
  retry?: {
    attempts: number;
    delay: number;
    backoff?: boolean;
  };
  
  /**
   * Signal for aborting the request
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
  result: FeatureResult | null;
  config: FeatureConfig;
  history: FeatureResult[];
  
  // Actions
  processData: (data: FeatureData, options?: ProcessingOptions) => Promise<void>;
  updateConfig: (config: Partial<FeatureConfig>) => void;
  clearError: () => void;
  reset: () => void;
  clearHistory: () => void;
  exportResult: (options: ExportOptions) => Promise<void>;
  
  // Computed values
  canProcess: () => boolean;
  hasResult: () => boolean;
  isProcessing: () => boolean;
}

/**
 * Real-time streaming chunk
 */
export interface StreamChunk {
  /**
   * Chunk data
   */
  data: string;
  
  /**
   * Whether this is the final chunk
   */
  isFinal: boolean;
  
  /**
   * Chunk sequence number
   */
  sequence: number;
  
  /**
   * Metadata for this chunk
   */
  metadata?: Record<string, unknown>;
}

/**
 * Analytics event for tracking tool usage
 */
export interface AnalyticsEvent {
  /**
   * Event name
   */
  event: 'tool_used' | 'processing_started' | 'processing_completed' | 'export_completed' | 'error_occurred';
  
  /**
   * Event properties
   */
  properties: Record<string, unknown>;
  
  /**
   * Event timestamp
   */
  timestamp: Date;
  
  /**
   * User ID (if authenticated)
   */
  userId?: string;
  
  /**
   * Session ID
   */
  sessionId?: string;
}
