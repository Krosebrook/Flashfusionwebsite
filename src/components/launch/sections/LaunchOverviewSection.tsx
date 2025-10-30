/**
 * @fileoverview Launch overview section for LaunchPreparationHub
 */

import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { TrendingUp, CheckCircle, Activity } from 'lucide-react';

interface LaunchOverviewSectionProps {
  readonly launchReadiness: number;
  readonly overallProgress: number;
  readonly assetAverageProgress: number;
  readonly campaignPortfolioRoi: number;
  readonly supportSatisfaction: number;
  readonly totalSupportVolume: number;
}

function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function LaunchOverviewSection({
  launchReadiness,
  overallProgress,
  assetAverageProgress,
  campaignPortfolioRoi,
  supportSatisfaction,
  totalSupportVolume,
}: LaunchOverviewSectionProps) {
  const readinessStatus = launchReadiness >= 85 ? 'Ready' : launchReadiness >= 60 ? 'In Progress' : 'Needs Work';

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-2xl font-semibold">Launch Overview</CardTitle>
          <p className="text-sm text-muted-foreground">Centralized readiness metrics for the upcoming launch.</p>
        </div>
        <Badge variant={readinessStatus === 'Ready' ? 'default' : readinessStatus === 'In Progress' ? 'secondary' : 'destructive'}>
          {readinessStatus}
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              <span>Overall Launch Progress</span>
              <span>{formatPercentage(overallProgress)}</span>
            </div>
            <Progress value={overallProgress} className="mt-2" />
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-primary" />
              Launch Readiness
            </div>
            <p className="mt-2 text-3xl font-semibold">{formatPercentage(launchReadiness)}</p>
            <p className="text-sm text-muted-foreground">Checklist completion benchmark for legal, documentation, marketing, and support tracks.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Campaign ROI</span>
              <span>{formatPercentage(campaignPortfolioRoi)}</span>
            </div>
            <Progress value={campaignPortfolioRoi} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">Average return across all scheduled and active campaigns.</p>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> Support Health</span>
              <span>{formatPercentage(supportSatisfaction)}</span>
            </div>
            <Progress value={supportSatisfaction} className="mt-2" />
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{totalSupportVolume.toLocaleString()} monthly tickets</span>
              <span>Avg. CSAT {(supportSatisfaction / 20).toFixed(1)}/5</span>
            </div>
          </div>

          <Separator />

          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Asset Production Velocity:</span> {formatPercentage(assetAverageProgress)} average completion rate across critical launch deliverables.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
