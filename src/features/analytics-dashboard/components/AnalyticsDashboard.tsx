/**
 * @fileoverview AnalyticsDashboard - FlashFusion Feature Component
 * @version 2.0.0
 * @category analytics
 */

import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Loader2,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react';

import { useAnalyticsDashboard } from '../hooks/useAnalyticsDashboard';
import type { AnalyticsDashboardConfig, AnalyticsTimeRange, AnalyticsSegment } from '../types/feature.types';

const TIME_RANGES: Array<{ id: AnalyticsTimeRange; label: string }> = [
  { id: '7d', label: '7D' },
  { id: '30d', label: '30D' },
  { id: '90d', label: '90D' },
  { id: '365d', label: '365D' }
];

const SEGMENTS: Array<{ id: AnalyticsSegment; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'projects', label: 'Projects' },
  { id: 'deployments', label: 'Deployments' },
  { id: 'tools', label: 'Tools' },
  { id: 'xp', label: 'XP' }
];

interface AnalyticsDashboardProps {
  config?: Partial<AnalyticsDashboardConfig>;
  debug?: boolean;
  className?: string;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const variants: Record<string, { color: string; icon: React.ReactNode }> = {
    idle: { color: 'bg-slate-500', icon: <Info className="w-3 h-3" /> },
    loading: { color: 'bg-blue-500', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
    ready: { color: 'bg-emerald-500', icon: <CheckCircle2 className="w-3 h-3" /> },
    error: { color: 'bg-red-500', icon: <AlertCircle className="w-3 h-3" /> }
  };

  const variant = variants[status] ?? variants.idle;

  return (
    <Badge className={`${variant.color} flex items-center gap-1 text-white`}>{variant.icon}{status.toUpperCase()}</Badge>
  );
};

const TrendIcon: React.FC<{ trend: 'up' | 'down' | 'flat' }> = ({ trend }) => {
  if (trend === 'up') return <ArrowUp className="w-4 h-4 text-emerald-500" />;
  if (trend === 'down') return <ArrowDown className="w-4 h-4 text-red-500" />;
  return <ArrowRight className="w-4 h-4 text-yellow-500" />;
};

const EmptyState: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="rounded-lg border border-dashed border-muted-foreground/40 p-6 text-center">
    <h4 className="text-sm font-semibold text-[var(--ff-text-primary)] mb-2">{title}</h4>
    <p className="text-xs text-[var(--ff-text-secondary)]">{description}</p>
  </div>
);

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  config,
  debug = false,
  className = ''
}) => {
  const {
    data,
    status,
    error,
    filters,
    lastUpdated,
    updateFilters,
    filteredTools,
    refresh,
    isLoading
  } = useAnalyticsDashboard(config);

  const headerMeta = useMemo(() => {
    if (!lastUpdated) return 'No recent refresh';
    return `Updated ${new Date(lastUpdated).toLocaleString()}`;
  }, [lastUpdated]);

  const exportReport = () => {
    if (!data || typeof window === 'undefined') return;

    const payload = {
      generatedAt: new Date().toISOString(),
      filters,
      data
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-report-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`feature-analytics-dashboard space-y-6 ${className}`}>
      <Card className="border border-[var(--ff-border)]">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-[var(--ff-text-primary)]">Analytics Dashboard</CardTitle>
              <CardDescription className="text-[var(--ff-text-secondary)]">
                Monitor usage, deployment health, and tool performance in real time.
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={status} />
              <Button
                variant="outline"
                size="sm"
                onClick={refresh}
                disabled={isLoading}
                className="border-[var(--ff-border)]"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                Refresh
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={exportReport}
                disabled={!data}
                className="bg-[var(--ff-primary)] text-white"
              >
                Export
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2 text-xs text-[var(--ff-text-secondary)]">
              <TrendingUp className="h-4 w-4" />
              {headerMeta}
            </div>
            <div className="flex flex-wrap gap-2">
              {TIME_RANGES.map((range) => (
                <Button
                  key={range.id}
                  variant={filters.timeRange === range.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateFilters({ timeRange: range.id })}
                  className={filters.timeRange === range.id ? 'bg-[var(--ff-primary)] text-white' : 'border-[var(--ff-border)]'}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {status === 'error' && error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error.message}</span>
                <Button variant="outline" size="sm" onClick={refresh}>
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Input
              placeholder="Search tools"
              value={filters.search}
              onChange={(event) => updateFilters({ search: event.target.value })}
              className="max-w-xs"
              aria-label="Search tools"
            />
            <div className="flex flex-wrap gap-2">
              {SEGMENTS.map((segment) => (
                <Button
                  key={segment.id}
                  variant={filters.segment === segment.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateFilters({ segment: segment.id })}
                  className={filters.segment === segment.id ? 'bg-[var(--ff-secondary)] text-white' : 'border-[var(--ff-border)]'}
                >
                  {segment.label}
                </Button>
              ))}
            </div>
          </div>

          {!data && status === 'loading' && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-[var(--ff-primary)]" />
            </div>
          )}

          {data && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
                <MetricCard label="Projects" value={data.overview.totalProjects} />
                <MetricCard label="Deployments" value={data.overview.totalDeployments} />
                <MetricCard label="XP Earned" value={data.overview.totalXP} />
                <MetricCard label="Current Streak" value={`${data.overview.currentStreak} days`} />
                <MetricCard label="Tool Runs" value={data.overview.totalToolRuns} />
                <MetricCard label="Success Rate" value={`${data.overview.successRate}%`} />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border border-[var(--ff-border)]">
                  <CardHeader>
                    <CardTitle className="text-base">Activity Trend</CardTitle>
                    <CardDescription>Projects, deployments, and XP over time.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.activity.length === 0 ? (
                      <EmptyState
                        title="No activity data"
                        description="Run a project or deploy to populate analytics."
                      />
                    ) : (
                      data.activity.map((day) => (
                        <div key={day.date} className="flex items-center gap-3">
                          <div className="w-16 text-xs text-[var(--ff-text-secondary)]">{day.date}</div>
                          <div className="flex-1 space-y-2">
                            <ProgressRow label="Projects" value={day.projects} max={50} />
                            <ProgressRow label="Deployments" value={day.deployments} max={50} />
                            <ProgressRow label="XP" value={day.xp} max={500} />
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                <Card className="border border-[var(--ff-border)]">
                  <CardHeader>
                    <CardTitle className="text-base">Tool Usage</CardTitle>
                    <CardDescription>Top tools and success rates.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {filteredTools.length === 0 ? (
                      <EmptyState
                        title="No tools found"
                        description="Try adjusting filters or start using tools."
                      />
                    ) : (
                      filteredTools.map((tool) => (
                        <div key={tool.tool} className="flex items-center justify-between gap-4">
                          <div>
                            <div className="text-sm font-medium text-[var(--ff-text-primary)]">{tool.tool}</div>
                            <div className="text-xs text-[var(--ff-text-secondary)]">{tool.usage} runs • {tool.successRate}% success</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendIcon trend={tool.trend} />
                            <Badge variant="outline">{tool.trend}</Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <Card className="border border-[var(--ff-border)]">
                  <CardHeader>
                    <CardTitle className="text-base">Deployment Mix</CardTitle>
                    <CardDescription>Platform share across deployments.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.deploymentStats.length === 0 ? (
                      <EmptyState
                        title="No deployments"
                        description="Deploy a project to see platform share."
                      />
                    ) : (
                      data.deploymentStats.map((stat) => (
                        <div key={stat.platform} className="flex items-center justify-between text-sm">
                          <span className="text-[var(--ff-text-primary)]">{stat.platform}</span>
                          <span className="text-[var(--ff-text-secondary)]">{stat.count} • {stat.share}%</span>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                <Card className="border border-[var(--ff-border)] lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">Usage History</CardTitle>
                    <CardDescription>Daily usage by tool.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.usageHistory.length === 0 ? (
                      <EmptyState
                        title="Usage history unavailable"
                        description="Once tools are used, daily history appears here."
                      />
                    ) : (
                      data.usageHistory.slice(0, 6).map((entry) => (
                        <div key={`${entry.date}-${entry.tool}`} className="flex items-center justify-between text-sm">
                          <div>
                            <div className="font-medium text-[var(--ff-text-primary)]">{entry.tool}</div>
                            <div className="text-xs text-[var(--ff-text-secondary)]">{entry.date}</div>
                          </div>
                          <div className="text-right text-[var(--ff-text-secondary)]">
                            <div>{entry.usage} runs</div>
                            <div>{entry.successRate}% success</div>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card className="border border-[var(--ff-border)]">
                <CardHeader>
                  <CardTitle className="text-base">Actionable Insights</CardTitle>
                  <CardDescription>Recommended actions based on recent signals.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  {data.insights.map((insight) => (
                    <div key={insight.id} className="rounded-lg border border-muted p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[var(--ff-text-primary)]">{insight.title}</span>
                        <Badge variant="outline">{insight.type}</Badge>
                      </div>
                      <p className="mt-2 text-xs text-[var(--ff-text-secondary)]">{insight.description}</p>
                      {insight.actionLabel && (
                        <Button variant="ghost" size="sm" className="mt-2">
                          {insight.actionLabel}
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {debug && (
            <details className="text-xs text-[var(--ff-text-secondary)]">
              <summary className="cursor-pointer">Debug data</summary>
              <pre className="mt-2 rounded bg-[var(--ff-bg-dark)] p-3 overflow-auto">
                {JSON.stringify({ status, filters, lastUpdated, data, error: error?.message }, null, 2)}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const MetricCard: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <Card className="border border-[var(--ff-border)]">
    <CardContent className="pt-6">
      <div className="text-2xl font-semibold text-[var(--ff-text-primary)]">{value}</div>
      <div className="text-xs text-[var(--ff-text-secondary)]">{label}</div>
    </CardContent>
  </Card>
);

const ProgressRow: React.FC<{ label: string; value: number; max: number }> = ({ label, value, max }) => (
  <div>
    <div className="flex items-center justify-between text-xs text-[var(--ff-text-secondary)]">
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <div className="h-2 w-full rounded-full bg-muted">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-[var(--ff-primary)] to-[var(--ff-secondary)]"
        style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
      />
    </div>
  </div>
);

export default AnalyticsDashboard;
