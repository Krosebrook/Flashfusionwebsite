/**
 * @fileoverview Zustand store for {{FEATURE_NAME}}
 * @version 1.0.0
 * 
 * Centralized state management using Zustand with:
 * - Type-safe state and actions
 * - Async action handling
 * - Devtools integration
 * - Persistence support
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { FeatureService } from '../services/FeatureService';

import type {
  FeatureStore,
  FeatureData,
  FeatureConfig,
  FeatureResult,
  FeatureError,
  FeatureStatus
} from '../types/feature.types';

/**
 * Default feature configuration
 */
const DEFAULT_CONFIG: FeatureConfig = {
  enabled: {
    autoProcess: false,
    caching: true,
    analytics: true,
    debugging: false
  },
  settings: {
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
    maxDataSize: 1024 * 1024 // 1MB
  },
  ui: {
    theme: 'auto',
    compact: false,
    showAdvanced: false
  }
};

/**
 * Feature Store
 * 
 * Manages global state for the feature including:
 * - Current data and processing status
 * - Configuration settings
 * - Processing results and history
 * - Error states
 * 
 * @example
 * ```typescript
 * const { data, status, processData } = useFeatureStore();
 * 
 * // Process data
 * await processData({ input: 'test' });
 * 
 * // Access result
 * if (status === 'success') {
 *   console.log(data);
 * }
 * ```
 */
export const useFeatureStore = create<FeatureStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        data: null,
        status: 'idle',
        error: null,
        result: null,
        config: DEFAULT_CONFIG,
        history: [],
        
        /**
         * Initialize feature with configuration and optional initial data
         */
        initialize: async (config, initialData) => {
          console.log('[FeatureStore] Initializing...');
          
          set({
            status: 'loading',
            error: null,
            config: { ...DEFAULT_CONFIG, ...config }
          });
          
          try {
            // Get service instance
            const service = FeatureService.getInstance();
            
            // Initialize service with config
            await service.initialize(get().config);
            
            // Set initial data if provided
            if (initialData) {
              set({
                data: initialData,
                status: 'idle'
              });
            } else {
              set({ status: 'idle' });
            }
            
            console.log('[FeatureStore] Initialization complete');
            
          } catch (error) {
            console.error('[FeatureStore] Initialization error:', error);
            
            set({
              status: 'error',
              error: error as FeatureError
            });
            
            throw error;
          }
        },
        
        /**
         * Process data through the feature
         */
        processData: async (dataInput) => {
          console.log('[FeatureStore] Processing data...', dataInput);
          
          const currentState = get();
          
          // Prevent concurrent processing
          if (currentState.status === 'processing' || currentState.status === 'loading') {
            console.warn('[FeatureStore] Already processing, ignoring request');
            return;
          }
          
          set({
            status: 'processing',
            error: null
          });
          
          try {
            // Get service instance
            const service = FeatureService.getInstance();
            
            // Merge input with existing data
            const fullData: Partial<FeatureData> = {
              ...currentState.data,
              ...dataInput,
              metadata: {
                ...currentState.data?.metadata,
                updatedAt: new Date(),
                version: (currentState.data?.metadata?.version || 0) + 1,
                tags: dataInput.metadata?.tags || currentState.data?.metadata?.tags || []
              }
            };
            
            // Process through service
            const result = await service.processData(
              fullData,
              currentState.config
            );
            
            console.log('[FeatureStore] Processing complete', result);
            
            // Update state with result
            set({
              status: 'success',
              data: result.data,
              result,
              error: null
            });
            
            // Add to history
            get().addToHistory(result);
            
          } catch (error) {
            console.error('[FeatureStore] Processing error:', error);
            
            set({
              status: 'error',
              error: error as FeatureError
            });
            
            throw error;
          }
        },
        
        /**
         * Update feature configuration
         */
        updateConfig: (configUpdate) => {
          console.log('[FeatureStore] Updating config:', configUpdate);
          
          set(state => ({
            config: {
              ...state.config,
              ...configUpdate,
              enabled: {
                ...state.config.enabled,
                ...configUpdate.enabled
              },
              settings: {
                ...state.config.settings,
                ...configUpdate.settings
              },
              ui: {
                ...state.config.ui,
                ...configUpdate.ui
              }
            }
          }));
        },
        
        /**
         * Reset feature to initial state
         */
        reset: () => {
          console.log('[FeatureStore] Resetting to initial state');
          
          set({
            data: null,
            status: 'idle',
            error: null,
            result: null,
            config: DEFAULT_CONFIG,
            history: []
          });
          
          // Clear service cache
          const service = FeatureService.getInstance();
          service.clearCache();
        },
        
        /**
         * Clear error state
         */
        clearError: () => {
          console.log('[FeatureStore] Clearing error');
          
          set({
            error: null,
            status: 'idle'
          });
        },
        
        /**
         * Add result to history
         */
        addToHistory: (result) => {
          set(state => {
            const newHistory = [...state.history, result];
            
            // Keep only last 50 results to prevent memory issues
            if (newHistory.length > 50) {
              newHistory.shift();
            }
            
            return { history: newHistory };
          });
        },
        
        /**
         * Clear processing history
         */
        clearHistory: () => {
          console.log('[FeatureStore] Clearing history');
          set({ history: [] });
        }
      }),
      {
        name: 'feature-store', // Unique name for localStorage key
        partialize: (state) => ({
          // Only persist these fields
          config: state.config,
          history: state.history.slice(-10) // Keep only last 10 results
        })
      }
    ),
    {
      name: 'FeatureStore', // Name for Redux DevTools
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);

/**
 * Selectors for derived state
 * 
 * Use these to access computed values efficiently
 */
export const featureSelectors = {
  /**
   * Check if feature is currently processing
   */
  isProcessing: (state: FeatureStore): boolean =>
    state.status === 'loading' || state.status === 'processing',
  
  /**
   * Check if feature has completed successfully
   */
  isSuccess: (state: FeatureStore): boolean =>
    state.status === 'success',
  
  /**
   * Check if feature has an error
   */
  hasError: (state: FeatureStore): boolean =>
    state.status === 'error' && state.error !== null,
  
  /**
   * Get latest result from history
   */
  latestResult: (state: FeatureStore): FeatureResult | null =>
    state.history.length > 0 ? state.history[state.history.length - 1] : null,
  
  /**
   * Get success rate from history
   */
  successRate: (state: FeatureStore): number => {
    if (state.history.length === 0) return 0;
    const successCount = state.history.filter(r => r.success).length;
    return (successCount / state.history.length) * 100;
  },
  
  /**
   * Get average processing time from history
   */
  averageProcessingTime: (state: FeatureStore): number => {
    if (state.history.length === 0) return 0;
    const totalTime = state.history.reduce(
      (sum, r) => sum + r.metadata.processingTime,
      0
    );
    return totalTime / state.history.length;
  }
};

/**
 * Hook for accessing selectors
 * 
 * @example
 * ```typescript
 * const isProcessing = useFeatureStore(featureSelectors.isProcessing);
 * const successRate = useFeatureStore(featureSelectors.successRate);
 * ```
 */
export const useFeatureSelector = <T>(
  selector: (state: FeatureStore) => T
): T => useFeatureStore(selector);

/**
 * Hook for accessing multiple selectors
 * 
 * @example
 * ```typescript
 * const { isProcessing, successRate } = useFeatureSelectors({
 *   isProcessing: featureSelectors.isProcessing,
 *   successRate: featureSelectors.successRate
 * });
 * ```
 */
export const useFeatureSelectors = <T extends Record<string, (state: FeatureStore) => unknown>>(
  selectors: T
): { [K in keyof T]: ReturnType<T[K]> } => {
  const state = useFeatureStore();
  
  return Object.keys(selectors).reduce((acc, key) => {
    acc[key as keyof T] = selectors[key](state) as ReturnType<T[typeof key]>;
    return acc;
  }, {} as { [K in keyof T]: ReturnType<T[K]> });
};

// Export default for convenience
export default useFeatureStore;
