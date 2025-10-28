import React from 'react';
import { Label } from '../../../ui/label';
import { Switch } from '../../../ui/switch';
import { Separator } from '../../../ui/separator';
import { Zap } from 'lucide-react';

interface FeaturesSectionProps {
  features: string[];
  selectedFeatures: string[];
  onFeatureToggle: (feature: string) => void;
}

export function FeaturesSection({
  features,
  selectedFeatures,
  onFeatureToggle
}: FeaturesSectionProps) {
  return (
    <>
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Features & Capabilities
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map(feature => (
            <div key={feature} className="flex items-center space-x-2">
              <Switch
                id={feature}
                checked={selectedFeatures.includes(feature)}
                onCheckedChange={() => onFeatureToggle(feature)}
              />
              <Label htmlFor={feature} className="text-sm cursor-pointer">
                {feature}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}