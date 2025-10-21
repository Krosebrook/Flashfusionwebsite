import React from 'react';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Textarea } from '../../../ui/textarea';
import { Label } from '../../../ui/label';
import type { AppTypeOption } from '../../../../types/full-stack-builder';

interface AppConfigurationSectionProps {
  appName: string;
  setAppName: (name: string) => void;
  appDescription: string;
  setAppDescription: (description: string) => void;
  appType: string;
  setAppType: (type: string) => void;
  appTypes: AppTypeOption[];
}

export function AppConfigurationSection({
  appName,
  setAppName,
  appDescription,
  setAppDescription,
  appType,
  setAppType,
  appTypes
}: AppConfigurationSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="appName" className="text-sm font-medium">Application Name *</Label>
          <Input
            id="appName"
            placeholder="My Awesome App"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            className="ff-focus-ring"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="appDescription" className="text-sm font-medium">Description *</Label>
          <Textarea
            id="appDescription"
            placeholder="Describe what your application does..."
            value={appDescription}
            onChange={(e) => setAppDescription(e.target.value)}
            className="ff-focus-ring"
            rows={3}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Application Type</Label>
          <div className="grid grid-cols-2 gap-2">
            {appTypes.slice(0, 6).map(type => (
              <Button
                key={type.id}
                variant={appType === type.id ? "default" : "outline"}
                size="sm"
                onClick={() => setAppType(type.id)}
                className="justify-start h-auto p-3 ff-hover-scale"
              >
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span>{type.icon}</span>
                    <span className="text-xs font-medium">{type.name}</span>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}