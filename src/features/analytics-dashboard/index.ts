/**
 * @fileoverview Analytics Dashboard Feature - Public API
 * @version 2.0.0
 */

export { AnalyticsDashboard, default } from './components/AnalyticsDashboard';
export { useAnalyticsDashboard } from './hooks/useAnalyticsDashboard';

export {
  useAnalyticsDashboardStore,
  analyticsSelectors,
  useAnalyticsDashboardSelector,
  useAnalyticsDashboardSelectors
} from './stores/AnalyticsDashboardStore';

export { AnalyticsDashboardService } from './services/AnalyticsDashboardService';

export type {
  AnalyticsDashboardData,
  AnalyticsDashboardConfig,
  AnalyticsFilters,
  AnalyticsStatus,
  AnalyticsError
} from './types/feature.types';
