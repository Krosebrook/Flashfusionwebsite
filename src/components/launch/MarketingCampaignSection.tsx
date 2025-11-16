import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import type { MarketingCampaignSectionProps } from './LaunchPreparationHub.types';
import { BarChart3, Edit } from 'lucide-react';

export function MarketingCampaignSection({ campaigns, onGetCampaignROI }: MarketingCampaignSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[var(--ff-text-primary)]">Active Campaigns</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map((campaign) => {
          const roiMetrics = onGetCampaignROI(campaign);
          return (
            <Card key={campaign.id} className="bg-[var(--ff-surface)] border-[var(--border)]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-[var(--ff-text-primary)]">{campaign.name}</h4>
                  <Badge variant={campaign.status === 'active' ? 'default' : campaign.status === 'scheduled' ? 'secondary' : 'outline'}>
                    {campaign.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[var(--ff-text-muted)]">Reach</p>
                    <p className="text-[var(--ff-text-primary)] font-semibold">{campaign.reach.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[var(--ff-text-muted)]">Engagement</p>
                    <p className="text-[var(--ff-text-primary)] font-semibold">{campaign.engagement}%</p>
                  </div>
                  <div>
                    <p className="text-[var(--ff-text-muted)]">Budget</p>
                    <p className="text-[var(--ff-text-primary)] font-semibold">${campaign.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[var(--ff-text-muted)]">ROI</p>
                    <p className="text-[var(--ff-text-primary)] font-semibold">{roiMetrics.roi}%</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default MarketingCampaignSection;
