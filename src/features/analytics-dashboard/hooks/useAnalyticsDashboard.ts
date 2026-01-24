/**
 * @fileoverview Analytics dashboard data hook
 */

import { useCallback, useEffect } from 'react';
import { useAuthentication } from '@/hooks/useAuthentication';
import {
  analyticsSelectors,
  useAnalyticsDashboardStore,
  useAnalyticsDashboardSelectors
} from '../stores/AnalyticsDashboardStore';
import type { AnalyticsDashboardConfig, AnalyticsFilters } from '../types/feature.types';

export function useAnalyticsDashboard(config?: Partial<AnalyticsDashboardConfig>) {
  const { user } = useAuthentication();
  const store = useAnalyticsDashboardStore();
  const selectors = useAnalyticsDashboardSelectors({
    isLoading: analyticsSelectors.isLoading,
    hasData: analyticsSelectors.hasData,
    filteredTools: analyticsSelectors.filteredTools
  });

  const {
    status,
    filters,
    initialize,
    loadAnalytics,
    updateFilters: setFilters,
    refresh
  } = store;

  useEffect(() => {
    initialize(config);
  }, [initialize, config]);

  useEffect(() => {
    if (status === 'idle') {
      loadAnalytics(user?.id);
    }
  }, [status, loadAnalytics, user?.id]);

  useEffect(() => {
    if (status === 'ready') {
      loadAnalytics(user?.id);
    }
  }, [filters.timeRange, status, loadAnalytics, user?.id]);

  const updateFilters = useCallback(
    (nextFilters: Partial<AnalyticsFilters>) => {
      setFilters(nextFilters);
    },
    [setFilters]
  );

  return {
    ...store,
    ...selectors,
    updateFilters,
    refresh: () => refresh(user?.id)
  };
}

export default useAnalyticsDashboard;
