/**
 * @fileoverview Marketing campaign section for LaunchPreparationHub
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { ScrollArea } from '../../ui/scroll-area';
import { Progress } from '../../ui/progress';
import { Calendar, PieChart, Rocket, Zap } from 'lucide-react';
import type { MarketingCampaign } from '../LaunchPreparationHub.types';

interface CampaignStatistics {
  readonly total: number;
  readonly active: number;
  readonly scheduled: number;
  readonly totalBudget: number;
  readonly totalReach: number;
  readonly averageEngagement: number;
  readonly portfolioROI: number;
}

interface MarketingCampaignSectionProps {
  readonly selectedCampaign: MarketingCampaign | null;
  readonly onSelectCampaign: (campaign: MarketingCampaign) => void;
  readonly sortedByROI: MarketingCampaign[];
  readonly statistics: CampaignStatistics;
  readonly getCampaignROI: (campaign: MarketingCampaign) => { roi: number; profit: number; costPerEngagement: number };
}

const STATUS_BADGE: Record<MarketingCampaign['status'], 'default' | 'secondary' | 'outline'> = {
  active: 'default',
  scheduled: 'secondary',
  planning: 'outline',
  created: 'secondary',
  completed: 'outline',
};

export function MarketingCampaignSection({
  selectedCampaign,
  onSelectCampaign,
  sortedByROI,
  statistics,
  getCampaignROI,
}: MarketingCampaignSectionProps) {
  const campaignPortfolioPercent = Math.min(Math.round(statistics.portfolioROI), 200);
  const averageEngagementPercent = Math.min(Math.round(statistics.averageEngagement), 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Marketing Operations</CardTitle>
        <CardDescription>Monitor reach, ROI, and channel mix across launch campaigns.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-2"><Rocket className="h-4 w-4 text-primary" /> Active Campaigns</span>
              <Badge variant="secondary">{statistics.active}/{statistics.total}</Badge>
            </div>
            <p className="mt-3 text-2xl font-semibold">{statistics.totalReach.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Prospects reached across active channels</p>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-2"><PieChart className="h-4 w-4 text-primary" /> Avg. Engagement</span>
              <Badge variant="secondary">{averageEngagementPercent}%</Badge>
            </div>
            <Progress value={averageEngagementPercent} className="mt-3" />
            <p className="mt-2 text-xs text-muted-foreground">Cross-channel engagement efficiency.</p>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Portfolio ROI</span>
              <Badge variant="secondary">{campaignPortfolioPercent}%</Badge>
            </div>
            <Progress value={Math.min(campaignPortfolioPercent, 100)} className="mt-3" />
            <p className="mt-2 text-xs text-muted-foreground">Blended ROI across all active initiatives.</p>
          </div>
        </div>

        <ScrollArea className="h-72 rounded-lg border">
          <div className="divide-y">
            {sortedByROI.map((campaign) => {
              const roi = getCampaignROI(campaign);
              return (
                <div key={campaign.id} className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <button
                      type="button"
                      className="text-left text-sm font-semibold hover:text-primary"
                      onClick={() => onSelectCampaign(campaign)}
                    >
                      {campaign.name}
                    </button>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant={STATUS_BADGE[campaign.status] ?? 'outline'}>{campaign.status}</Badge>
                      <span>{campaign.type}</span>
                      <span>•</span>
                      <span>{campaign.reach.toLocaleString()} reach</span>
                      <span>•</span>
                      <span>{campaign.engagement}% engagement</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Budget ${campaign.budget.toLocaleString()}</span>
                      <span>ROI {roi.roi}%</span>
                      <span>Cost/eng ${roi.costPerEngagement}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2 md:items-end">
                    <Badge variant="outline">Profit ${roi.profit.toLocaleString()}</Badge>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {campaign.startDate.toLocaleDateString()} – {campaign.endDate.toLocaleDateString()}
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => onSelectCampaign(campaign)}>
                      View focus
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {selectedCampaign ? (
          <div className="rounded-lg border bg-muted/30 p-4">
            <h3 className="text-sm font-semibold">Highlighted campaign</h3>
            <p className="text-sm text-muted-foreground">{selectedCampaign.name} ({selectedCampaign.type})</p>
            <p className="text-xs text-muted-foreground">
              Launch window {selectedCampaign.startDate.toLocaleDateString()} - {selectedCampaign.endDate.toLocaleDateString()} with
              budget ${selectedCampaign.budget.toLocaleString()}.
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
