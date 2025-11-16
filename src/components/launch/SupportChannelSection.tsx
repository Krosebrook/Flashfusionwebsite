import React from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import type { SupportChannelSectionProps } from './LaunchPreparationHub.types';
import { Settings, Star, Users } from 'lucide-react';

export function SupportChannelSection({ channels, onGetChannelStatus }: SupportChannelSectionProps) {
  return (
    <div className="space-y-6">
      <Alert className="border-[var(--ff-warning)] bg-[var(--ff-warning)]/10">
        <Users className="h-4 w-4 text-[var(--ff-warning)]" />
        <AlertDescription className="text-[var(--ff-text-secondary)]">
          <strong className="text-[var(--ff-warning)]">Support Systems:</strong> Configure help desk, community forums, knowledge base, and customer success tools for post-launch support.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {channels.map((channel) => {
          const status = onGetChannelStatus(channel);
          return (
            <Card key={channel.id} className="bg-[var(--ff-surface-light)] border-[var(--border)]">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-[var(--ff-text-primary)]">{channel.name}</h4>
                  <Badge variant={channel.status === 'active' ? 'default' : channel.status === 'testing' ? 'secondary' : 'outline'}>
                    {channel.status}
                  </Badge>
                </div>
                <Badge variant="outline" className="text-xs w-fit">
                  {status.statusLabel}
                </Badge>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--ff-text-muted)]">Response Time</span>
                    <span className="text-[var(--ff-text-primary)]">{channel.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--ff-text-muted)]">Satisfaction</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-[var(--ff-text-primary)]">{channel.satisfaction}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--ff-text-muted)]">Monthly Volume</span>
                    <span className="text-[var(--ff-text-primary)]">{channel.volume}</span>
                  </div>
                </div>

                <Button size="sm" variant="outline" className="w-full">
                  <Settings className="w-3 h-3 mr-1" />
                  Configure
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-[var(--ff-surface)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-[var(--ff-text-primary)]">Support Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-[var(--ff-text-primary)]">24/7 Live Chat</Label>
                <Switch checked={true} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-[var(--ff-text-primary)]">Auto-Response</Label>
                <Switch checked={true} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-[var(--ff-text-primary)]">Ticket Escalation</Label>
                <Switch checked={true} />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-[var(--ff-text-primary)]">Community Forum</Label>
                <Switch checked={false} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-[var(--ff-text-primary)]">Video Support</Label>
                <Switch checked={false} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-[var(--ff-text-primary)]">Phone Support</Label>
                <Switch checked={false} />
              </div>
            </div>
          </div>

          <Separator className="bg-[var(--border)]" />

          <div className="space-y-2">
            <Label className="text-[var(--ff-text-primary)]">Support Team Email</Label>
            <Input defaultValue="support@flashfusion.ai" className="bg-[var(--input-background)] border-[var(--border)]" />
          </div>

          <div className="space-y-2">
            <Label className="text-[var(--ff-text-primary)]">Auto-Response Message</Label>
            <Textarea
              defaultValue="Thank you for contacting FlashFusion support. We've received your message and will respond within 4 hours."
              className="bg-[var(--input-background)] border-[var(--border)]"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SupportChannelSection;
