/**
 * @fileoverview Advanced Settings Component for Image Generation
 * @chunk tools
 * @category generation
 * @version 2.0.0
 * @author FlashFusion Team
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Slider } from '../../../ui/slider';
import { Badge } from '../../../ui/badge';
import { Separator } from '../../../ui/separator';
import { Switch } from '../../../ui/switch';
import { 
  Settings, 
  Dice6, 
  Info, 
  Zap, 
  Target,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../ui/tooltip';

interface AdvancedSettingsProps {
  steps: number;
  onStepsChange: (steps: number) => void;
  guidanceScale: number;
  onGuidanceScaleChange: (scale: number) => void;
  seed?: number;
  onSeedChange: (seed: number | undefined) => void;
  onRandomSeed: () => void;
}

export function AdvancedSettings({
  steps,
  onStepsChange,
  guidanceScale,
  onGuidanceScaleChange,
  seed,
  onSeedChange,
  onRandomSeed
}: AdvancedSettingsProps): JSX.Element {
  const [showTooltips, setShowTooltips] = useState<boolean>(false);
  const [customSeed, setCustomSeed] = useState<string>(seed?.toString() || '');

  const handleSeedInputChange = (value: string) => {
    setCustomSeed(value);
    
    if (value === '') {
      onSeedChange(undefined);
    } else {
      const numericValue = parseInt(value, 10);
      if (!isNaN(numericValue)) {
        onSeedChange(numericValue);
      }
    }
  };

  return (
    <TooltipProvider>
      <Card className="bg-[var(--ff-surface-light)]/30 border-[var(--ff-secondary)]/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-4 w-4 text-[var(--ff-secondary)]" />
              Advanced Settings
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Switch
                checked={showTooltips}
                onCheckedChange={setShowTooltips}
                className="scale-75"
              />
              <Label className="text-xs text-[var(--ff-text-muted)]">
                Help
              </Label>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Inference Steps */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-semibold">Inference Steps</Label>
                {showTooltips && (
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-[var(--ff-text-muted)]" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-xs">
                        Number of denoising steps. More steps generally mean higher quality 
                        but longer generation time. 20-30 steps work well for most images.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {steps} steps
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    steps < 20 ? 'text-yellow-600 border-yellow-600/20' :
                    steps > 50 ? 'text-red-600 border-red-600/20' :
                    'text-green-600 border-green-600/20'
                  }`}
                >
                  {steps < 20 ? 'Fast' : steps > 50 ? 'Slow' : 'Optimal'}
                </Badge>
              </div>
            </div>
            
            <Slider
              value={[steps]}
              onValueChange={([value]) => onStepsChange(value)}
              max={100}
              min={1}
              step={1}
              className="w-full"
            />
            
            <div className="flex justify-between text-xs text-[var(--ff-text-muted)]">
              <span>1 (Fastest)</span>
              <span>50 (Balanced)</span>
              <span>100 (Highest Quality)</span>
            </div>
            
            {/* Quick presets */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStepsChange(15)}
                className="text-xs px-2 py-1 h-7"
              >
                <Zap className="h-3 w-3 mr-1" />
                Fast (15)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStepsChange(30)}
                className="text-xs px-2 py-1 h-7"
              >
                <Target className="h-3 w-3 mr-1" />
                Balanced (30)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStepsChange(50)}
                className="text-xs px-2 py-1 h-7"
              >
                <Settings className="h-3 w-3 mr-1" />
                Quality (50)
              </Button>
            </div>
          </div>

          <Separator />

          {/* Guidance Scale */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-semibold">Guidance Scale</Label>
                {showTooltips && (
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-[var(--ff-text-muted)]" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-xs">
                        How closely the AI follows your prompt. Higher values (7-15) mean 
                        stricter adherence but may reduce creativity. Lower values (1-7) 
                        allow more artistic freedom.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {guidanceScale.toFixed(1)}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    guidanceScale < 5 ? 'text-blue-600 border-blue-600/20' :
                    guidanceScale > 12 ? 'text-orange-600 border-orange-600/20' :
                    'text-green-600 border-green-600/20'
                  }`}
                >
                  {guidanceScale < 5 ? 'Creative' : guidanceScale > 12 ? 'Strict' : 'Balanced'}
                </Badge>
              </div>
            </div>
            
            <Slider
              value={[guidanceScale]}
              onValueChange={([value]) => onGuidanceScaleChange(value)}
              max={20}
              min={1}
              step={0.5}
              className="w-full"
            />
            
            <div className="flex justify-between text-xs text-[var(--ff-text-muted)]">
              <span>1 (Most Creative)</span>
              <span>7.5 (Recommended)</span>
              <span>20 (Strictest)</span>
            </div>
          </div>

          <Separator />

          {/* Seed Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-semibold">Seed</Label>
                {showTooltips && (
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-3 w-3 text-[var(--ff-text-muted)]" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-xs">
                        Random seed for reproducible results. Use the same seed with 
                        identical settings to generate similar images. Leave empty 
                        for random generation.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  seed ? 'text-[var(--ff-primary)] border-[var(--ff-primary)]/20' : 
                  'text-[var(--ff-text-muted)]'
                }`}
              >
                {seed ? 'Fixed' : 'Random'}
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Enter seed number..."
                value={customSeed}
                onChange={(e) => handleSeedInputChange(e.target.value)}
                className="ff-input flex-1"
                type="number"
                min="0"
                max="999999999"
              />
              
              <Button
                variant="outline"
                onClick={onRandomSeed}
                className="ff-btn-ghost px-3"
              >
                <Dice6 className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  setCustomSeed('');
                  onSeedChange(undefined);
                }}
                className="ff-btn-ghost px-3"
                disabled={!seed}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-xs text-[var(--ff-text-muted)]">
              {seed 
                ? `Using seed ${seed} for reproducible results`
                : 'Random seed will be generated for each image'
              }
            </p>
          </div>

          {/* Performance Impact Warning */}
          {(steps > 50 || guidanceScale > 15) && (
            <>
              <Separator />
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-yellow-600">
                      Performance Impact
                    </p>
                    <p className="text-xs text-yellow-600/80">
                      Current settings may result in longer generation times and higher costs.
                      {steps > 50 && ' Consider reducing steps for faster results.'}
                      {guidanceScale > 15 && ' Very high guidance may produce over-processed images.'}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Reset to Defaults */}
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onStepsChange(20);
                onGuidanceScaleChange(7.5);
                onSeedChange(undefined);
                setCustomSeed('');
              }}
              className="w-full ff-btn-ghost text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}