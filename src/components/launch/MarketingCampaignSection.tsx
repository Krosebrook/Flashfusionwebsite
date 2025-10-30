import React from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { MarketingCampaignSectionProps } from './LaunchPreparationHub.types';
import {
  BarChart3,
  Camera,
  Calendar,
  Download,
  Edit,
  FileText,
  Mail,
  Megaphone,
  Share2,
  TrendingUp,
  Users,
} from 'lucide-react';

/**
 * Marketing campaign overview including collateral shortcuts.
 */
export function MarketingCampaignSection({
  campaigns,
  onGeneratePressKit,
  onSelectCampaign,
  onUpdateCampaign,
}: MarketingCampaignSectionProps) {
  return (
    <>
      <Alert className="border-[var(--ff-accent)] bg-[var(--ff-accent)]/10">
        <Megaphone className="h-4 w-4 text-[var(--ff-accent)]" />
        <AlertDescription className="text-[var(--ff-text-secondary)]">
          <strong className="text-[var(--ff-accent)]">Marketing Campaign Management:</strong> Create and manage launch campaigns
          across multiple channels with performance tracking.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-[var(--ff-text-primary)] flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Visual Assets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full border-[var(--border)]">
              <Download className="w-4 h-4 mr-2" />
              Logo Package
            </Button>
            <Button variant="outline" className="w-full border-[var(--border)]">
              <Camera className="w-4 h-4 mr-2" />
              Screenshots
            </Button>
            <Button
              onClick={onGeneratePressKit}
              className="w-full bg-[var(--ff-primary)] hover:bg-[var(--ff-primary-600)] text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Press Kit
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-[var(--ff-text-primary)] flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Social Media
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full border-[var(--border)]">
              <Edit className="w-4 h-4 mr-2" />
              Create Posts
            </Button>
            <Button variant="outline" className="w-full border-[var(--border)]">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Campaign
            </Button>
            <Button variant="outline" className="w-full border-[var(--border)]">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-[var(--ff-text-primary)] flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Marketing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full border-[var(--border)]">
              <Edit className="w-4 h-4 mr-2" />
              Create Sequence
            </Button>
            <Button variant="outline" className="w-full border-[var(--border)]">
              <Users className="w-4 h-4 mr-2" />
              Manage Lists
            </Button>
            <Button variant="outline" className="w-full border-[var(--border)]">
              <TrendingUp className="w-4 h-4 mr-2" />
              Track Performance
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[var(--ff-text-primary)]">Active Campaigns</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((campaign) => (
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
                    <p className="text-[var(--ff-text-primary)] font-semibold">{campaign.roi}%</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      onSelectCampaign?.(campaign);
                      onUpdateCampaign?.(campaign.id, { status: campaign.status });
                    }}
                  >
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
          ))}
        </div>
      </div>
    </>
  );
}
