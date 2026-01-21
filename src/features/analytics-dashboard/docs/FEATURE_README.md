# AnalyticsDashboard

## Overview

The Analytics Dashboard provides a production-ready analytics experience for FlashFusion users. It connects to the existing analytics services, surfaces KPI snapshots, visualizes usage trends, and highlights actionable insights.

## Features

- ✅ **Real Data Integration** - Uses the database analytics service with demo fallback
- ✅ **Time-range Filtering** - 7/30/90/365 day views with automatic refresh
- ✅ **Tool Usage Analytics** - Usage, success rate, and trend indicators
- ✅ **Deployment Mix** - Platform breakdown and share percentages
- ✅ **Usage History** - Daily usage entries across top tools
- ✅ **Actionable Insights** - Recommendations based on behavior signals
- ✅ **State Management** - Zustand store with persistence and selectors
- ✅ **Error Handling** - Retry-ready alerts with recoverable states
- ✅ **Export Support** - JSON analytics export for reports
- ✅ **Accessibility** - Keyboard-friendly controls and semantic markup

## Usage

### Basic Usage

```tsx
import { AnalyticsDashboard } from '@/features/analytics-dashboard';

export function AnalyticsPage() {
  return <AnalyticsDashboard />;
}
```

### With Configuration

```tsx
<AnalyticsDashboard
  config={{
    timeRange: '30d',
    maxTools: 8,
    autoRefresh: true,
    refreshIntervalMs: 300000,
    includeGlobalBenchmarks: true
  }}
/>
```

### Debugging

```tsx
<AnalyticsDashboard debug />
```

## Store API

```typescript
const {
  data,
  status,
  error,
  filters,
  lastUpdated,
  loadAnalytics,
  refresh,
  updateFilters,
  updateConfig,
  reset
} = useAnalyticsDashboardStore();
```

## Hook API

```typescript
const {
  data,
  filteredTools,
  isLoading,
  refresh
} = useAnalyticsDashboard();
```

## Edge Cases Covered

- **No authenticated user**: Falls back to global/demo analytics.
- **Empty activity**: Displays empty-state panels with guidance.
- **Empty tool usage**: Prompts the user to run tools before analytics appear.
- **Failed fetch**: Shows retry option and preserves previous state.
- **Rapid filter changes**: Uses cached data and prevents overlapping loads.

## Next 9 Logical Steps

1. Add CSV export alongside JSON for executive reporting.
2. Surface anomaly detection for usage spikes or drop-offs.
3. Add cohort comparison (current vs. previous period).
4. Visualize tool usage history as a stacked area chart.
5. Integrate A/B experiment metrics into the insights feed.
6. Add personalization controls (pin metrics, reorder cards).
7. Expand deployment mix with failure rates and latency.
8. Introduce notification hooks for critical thresholds.
9. Add automated weekly email summaries.

## Development

```bash
npm run dev
```

## Testing

```bash
npm test src/features/analytics-dashboard/__tests__/AnalyticsDashboard.test.tsx
```
