/**
 * @fileoverview Support channel section for LaunchPreparationHub
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { ScrollArea } from '../../ui/scroll-area';
import { Progress } from '../../ui/progress';
import { Headphones, LifeBuoy, ShieldCheck } from 'lucide-react';
import type { SupportChannel } from '../LaunchPreparationHub.types';

interface SupportChannelSectionProps {
  readonly activeChannel: SupportChannel | null;
  readonly onSelectChannel: (channel: SupportChannel | null) => void;
  readonly sortedBySatisfaction: SupportChannel[];
  readonly metrics: { totalVolume: number; averageSatisfaction: number; activeChannels: number; channelsByType: Record<string, number> };
  readonly statistics: {
    total: number;
    active: number;
    testing: number;
    setup: number;
    totalVolume: number;
    averageSatisfaction: number;
    healthy: number;
    needsAttention: number;
    inProgress: number;
  };
}

const STATUS_BADGE: Record<SupportChannel['status'], 'default' | 'secondary' | 'outline'> = {
  active: 'default',
  testing: 'secondary',
  setup: 'outline',
};

export function SupportChannelSection({
  activeChannel,
  onSelectChannel,
  sortedBySatisfaction,
  metrics,
  statistics,
}: SupportChannelSectionProps) {
  const csatPercent = Math.min(Math.round(metrics.averageSatisfaction * 20), 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Support Operations</CardTitle>
        <CardDescription>Staffing, satisfaction, and channel health across the launch support stack.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-2"><Headphones className="h-4 w-4 text-primary" /> Active Channels</span>
              <Badge variant="secondary">{statistics.active}/{statistics.total}</Badge>
            </div>
            <p className="mt-3 text-2xl font-semibold">{metrics.totalVolume.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Monthly conversations handled across all channels.</p>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-2"><LifeBuoy className="h-4 w-4 text-primary" /> Channel Health</span>
              <Badge variant="secondary">{statistics.healthy} healthy</Badge>
            </div>
            <Progress value={csatPercent} className="mt-3" />
            <p className="mt-2 text-xs text-muted-foreground">Avg. CSAT {(metrics.averageSatisfaction).toFixed(1)}/5</p>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Needs Attention</span>
              <Badge variant="secondary">{statistics.needsAttention}</Badge>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Ensure playbooks and staffing are ready before launch.</p>
          </div>
        </div>

        <ScrollArea className="h-72 rounded-lg border">
          <div className="divide-y">
            {sortedBySatisfaction.map((channel) => (
              <div key={channel.id} className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => onSelectChannel(channel)}
                    className="text-left text-sm font-semibold hover:text-primary"
                  >
                    {channel.name}
                  </button>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant={STATUS_BADGE[channel.status] ?? 'outline'}>{channel.status}</Badge>
                    <span>{channel.type}</span>
                    <span>•</span>
                    <span>{channel.responseTime} response</span>
                    <span>•</span>
                    <span>{channel.volume} tickets</span>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2 md:items-end">
                  <Badge variant="outline">CSAT {(channel.satisfaction).toFixed(1)}/5</Badge>
                  <Button size="sm" variant="ghost" onClick={() => onSelectChannel(channel)}>
                    View playbook
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {activeChannel ? (
          <div className="rounded-lg border bg-muted/30 p-4">
            <h3 className="text-sm font-semibold">Highlighted channel</h3>
            <p className="text-sm text-muted-foreground">{activeChannel.name} ({activeChannel.type})</p>
            <p className="text-xs text-muted-foreground">
              Response target {activeChannel.responseTime}. {activeChannel.volume.toLocaleString()} active tickets with CSAT {(activeChannel.satisfaction).toFixed(1)}/5.
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
