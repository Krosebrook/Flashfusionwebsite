/**
 * @fileoverview Type definitions for AnalyticsDashboard
 * @version 2.0.0
 *
 * Analytics-focused TypeScript types for the dashboard including:
 * - Data models
 * - Filters and configuration
 * - Store contracts
 * - Error types
 */

export type AnalyticsStatus = 'idle' | 'loading' | 'ready' | 'error';

export type AnalyticsTimeRange = '7d' | '30d' | '90d' | '365d';

export type AnalyticsSegment = 'all' | 'projects' | 'deployments' | 'tools' | 'xp';

export type InsightType = 'opportunity' | 'warning' | 'success' | 'info';

export interface AnalyticsOverview {
  totalProjects: number;
  totalDeployments: number;
  totalXP: number;
  currentStreak: number;
  totalToolRuns: number;
  successRate: number;
}

export interface ActivityPoint {
  date: string;
  projects: number;
  deployments: number;
  xp: number;
}

export interface ToolUsageStat {
  tool: string;
  usage: number;
  successRate: number;
  trend: 'up' | 'down' | 'flat';
  lastUsedAt?: string;
}

export interface DeploymentStat {
  platform: string;
  count: number;
  share: number;
}

export interface UsageHistoryPoint {
  date: string;
  tool: string;
  usage: number;
  successRate: number;
}

export interface AnalyticsInsight {
  id: string;
  title: string;
  description: string;
  type: InsightType;
  actionLabel?: string;
}

export interface AnalyticsDashboardData {
  overview: AnalyticsOverview;
  activity: ActivityPoint[];
  toolUsage: ToolUsageStat[];
  deploymentStats: DeploymentStat[];
  usageHistory: UsageHistoryPoint[];
  insights: AnalyticsInsight[];
}

export interface AnalyticsFilters {
  search: string;
  timeRange: AnalyticsTimeRange;
  segment: AnalyticsSegment;
}

export interface AnalyticsDashboardConfig {
  autoRefresh: boolean;
  refreshIntervalMs: number;
  includeGlobalBenchmarks: boolean;
  maxTools: number;
  timeRange: AnalyticsTimeRange;
}

export interface AnalyticsError extends Error {
  code: string;
  retryable: boolean;
  details?: Record<string, unknown>;
}

export interface AnalyticsSnapshot {
  id: string;
  capturedAt: string;
  data: AnalyticsDashboardData;
}

export interface AnalyticsStore {
  data: AnalyticsDashboardData | null;
  status: AnalyticsStatus;
  error: AnalyticsError | null;
  filters: AnalyticsFilters;
  config: AnalyticsDashboardConfig;
  lastUpdated: string | null;
  history: AnalyticsSnapshot[];

  initialize: (config?: Partial<AnalyticsDashboardConfig>, initialData?: AnalyticsDashboardData) => Promise<void>;
  loadAnalytics: (userId?: string) => Promise<void>;
  refresh: (userId?: string) => Promise<void>;
  updateFilters: (filters: Partial<AnalyticsFilters>) => void;
  updateConfig: (config: Partial<AnalyticsDashboardConfig>) => void;
  clearError: () => void;
  reset: () => void;
}

export interface AnalyticsServiceOptions {
  useCache?: boolean;
  signal?: AbortSignal;
}

export interface AnalyticsCacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface AnalyticsServiceResponse {
  data: AnalyticsDashboardData;
  metadata: {
    requestId: string;
    fetchedAt: string;
    processingTimeMs: number;
  };
}

export const ANALYTICS_TIME_RANGE_DAYS: Record<AnalyticsTimeRange, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '365d': 365
};

export const DEFAULT_ANALYTICS_FILTERS: AnalyticsFilters = {
  search: '',
  timeRange: '7d',
  segment: 'all'
};

export const DEFAULT_ANALYTICS_CONFIG: AnalyticsDashboardConfig = {
  autoRefresh: true,
  refreshIntervalMs: 5 * 60 * 1000,
  includeGlobalBenchmarks: true,
  maxTools: 6,
  timeRange: '7d'
};

export type AnalyticsData = AnalyticsDashboardData;
export type AnalyticsConfig = AnalyticsDashboardConfig;
export type AnalyticsResult = AnalyticsDashboardData;
export type AnalyticsStatusType = AnalyticsStatus;
export type AnalyticsErrorType = AnalyticsError;
