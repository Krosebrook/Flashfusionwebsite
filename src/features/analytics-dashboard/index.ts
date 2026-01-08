/**
 * @fileoverview Analytics Dashboard Feature - Public API
 * @version 1.0.0
 * 
 * Entry point for the Analytics Dashboard feature
 */

// Export main component
export { AnalyticsDashboard, default } from './components/AnalyticsDashboard';

// Export store
export { useFeatureStore } from './stores/FeatureStore';

// Export service
export { FeatureService } from './services/FeatureService';

// Export types
export type {
  FeatureData,
  FeatureConfig,
  FeatureResult,
  FeatureError,
  FeatureStatus
} from './types/feature.types';
