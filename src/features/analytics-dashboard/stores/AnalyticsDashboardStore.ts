/**
 * @fileoverview Zustand store for AnalyticsDashboard
 * @version 2.0.0
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AnalyticsDashboardService } from '../services/AnalyticsDashboardService';
import {
  DEFAULT_ANALYTICS_CONFIG,
  DEFAULT_ANALYTICS_FILTERS
} from '../types/feature.types';
import type {
  AnalyticsStore,
  AnalyticsDashboardData,
  AnalyticsError,
  AnalyticsDashboardConfig,
  AnalyticsFilters
} from '../types/feature.types';

export const useAnalyticsDashboardStore = create<AnalyticsStore>()(
  devtools(
    persist(
      (set, get) => ({
        data: null,
        status: 'idle',
        error: null,
        filters: DEFAULT_ANALYTICS_FILTERS,
        config: DEFAULT_ANALYTICS_CONFIG,
        lastUpdated: null,
        history: [],

        initialize: async (config, initialData) => {
          const mergedConfig = { ...DEFAULT_ANALYTICS_CONFIG, ...config };
          set({
            status: 'loading',
            error: null,
            config: mergedConfig,
            filters: {
              ...DEFAULT_ANALYTICS_FILTERS,
              timeRange: mergedConfig.timeRange
            }
          });

          try {
            const service = AnalyticsDashboardService.getInstance();
            await service.initialize(get().config);

            set({
              status: 'ready',
              data: initialData ?? null,
              lastUpdated: initialData ? new Date().toISOString() : null
            });
          } catch (error) {
            set({
              status: 'error',
              error: error as AnalyticsError
            });
            throw error;
          }
        },

        loadAnalytics: async (userId) => {
          const { config, filters, status } = get();
          if (status === 'loading') {
            return;
          }

          set({ status: 'loading', error: null });

          try {
            const service = AnalyticsDashboardService.getInstance();
            const response = await service.fetchAnalytics(userId, {
              ...config,
              timeRange: filters.timeRange
            });

            set((state) => ({
              data: response.data,
              status: 'ready',
              lastUpdated: response.metadata.fetchedAt,
              history: appendHistory(state.history, response.data)
            }));
          } catch (error) {
            set({ status: 'error', error: error as AnalyticsError });
          }
        },

        refresh: async (userId) => {
          const service = AnalyticsDashboardService.getInstance();
          service.clearCache();
          await get().loadAnalytics(userId);
        },

        updateFilters: (filters) => {
          set((state) => ({
            filters: {
              ...state.filters,
              ...filters
            }
          }));
        },

        updateConfig: (config) => {
          set((state) => ({
            config: {
              ...state.config,
              ...config
            }
          }));
        },

        clearError: () => {
          set({ error: null, status: 'idle' });
        },

        reset: () => {
          set({
            data: null,
            status: 'idle',
            error: null,
            filters: DEFAULT_ANALYTICS_FILTERS,
            config: DEFAULT_ANALYTICS_CONFIG,
            lastUpdated: null,
            history: []
          });

          const service = AnalyticsDashboardService.getInstance();
          service.clearCache();
        }
      }),
      {
        name: 'analytics-dashboard-store',
        partialize: (state) => ({
          config: state.config,
          filters: state.filters,
          history: state.history.slice(-5)
        })
      }
    ),
    {
      name: 'AnalyticsDashboardStore',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);

const appendHistory = (history: AnalyticsStore['history'], data: AnalyticsDashboardData): AnalyticsStore['history'] => {
  const next = [
    ...history,
    {
      id: `${Date.now()}`,
      capturedAt: new Date().toISOString(),
      data
    }
  ];

  return next.length > 10 ? next.slice(-10) : next;
};

const buildSelector = <T>(selector: (state: AnalyticsStore) => T) => selector;

export const analyticsSelectors = {
  isLoading: buildSelector((state: AnalyticsStore) => state.status === 'loading'),
  hasData: buildSelector((state: AnalyticsStore) => Boolean(state.data)),
  filteredTools: buildSelector((state: AnalyticsStore) => {
    if (!state.data) return [];
    const query = state.filters.search.toLowerCase();
    const tools = state.data.toolUsage.slice(0, state.config.maxTools);
    return query
      ? tools.filter((tool) => tool.tool.toLowerCase().includes(query))
      : tools;
  })
};

export const useAnalyticsDashboardSelector = <T>(selector: (state: AnalyticsStore) => T): T =>
  useAnalyticsDashboardStore(selector);

export const useAnalyticsDashboardSelectors = <T extends Record<string, (state: AnalyticsStore) => unknown>>(
  selectors: T
): { [K in keyof T]: ReturnType<T[K]> } => {
  const state = useAnalyticsDashboardStore();

  return Object.keys(selectors).reduce((acc, key) => {
    acc[key as keyof T] = selectors[key](state) as ReturnType<T[typeof key]>;
    return acc;
  }, {} as { [K in keyof T]: ReturnType<T[K]> });
};
