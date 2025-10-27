/**
 * @fileoverview Test Component for Promotional Buttons
 * @chunk ui-system
 * @category testing
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Test interface to validate the promotional button components
 * and ensure they handle text overflow properly.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { 
  PromoStartBuildingButton,
  TryInteractiveDemoButton,
  CompactPromoButton,
  CompactDemoButton,
  ResponsiveCTAGroup
} from './responsive-cta-buttons';

export function TestPromotionalButtons() {
  const [clickedButton, setClickedButton] = useState<string>('');
  const [isLoading, setIsLoading] = useState<string>('');

  const handleButtonClick = (buttonId: string) => {
    setClickedButton(buttonId);
    setIsLoading(buttonId);
    
    // Simulate loading state
    setTimeout(() => {
      setIsLoading('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="ff-text-headline text-4xl mb-4">
            Promotional Button Test Suite
          </h1>
          <p className="ff-text-body text-lg text-muted-foreground mb-8">
            Testing responsive button layouts and text overflow handling
          </p>
          
          {clickedButton && (
            <Badge className="bg-success/10 text-success border-success/20">
              Last clicked: {clickedButton}
            </Badge>
          )}
        </div>

        {/* Desktop Responsive Buttons */}
        <Card className="ff-card">
          <CardHeader>
            <CardTitle className="ff-text-title">
              Desktop & Mobile Responsive Buttons
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Responsive CTA Group */}
            <div>
              <h3 className="ff-text-body font-semibold mb-4">Responsive CTA Group</h3>
              <ResponsiveCTAGroup className="bg-card p-6 rounded-lg">
                <PromoStartBuildingButton
                  onClick={() => handleButtonClick('responsive-promo')}
                  loading={isLoading === 'responsive-promo'}
                />
                
                <TryInteractiveDemoButton
                  onClick={() => handleButtonClick('responsive-demo')}
                  loading={isLoading === 'responsive-demo'}
                />
              </ResponsiveCTAGroup>
            </div>

            {/* Individual Buttons */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="ff-text-body font-semibold mb-4">Promotional Button</h3>
                <PromoStartBuildingButton
                  onClick={() => handleButtonClick('individual-promo')}
                  loading={isLoading === 'individual-promo'}
                  className="w-full"
                />
              </div>
              
              <div>
                <h3 className="ff-text-body font-semibold mb-4">Demo Button</h3>
                <TryInteractiveDemoButton
                  onClick={() => handleButtonClick('individual-demo')}
                  loading={isLoading === 'individual-demo'}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compact Mobile Buttons */}
        <Card className="ff-card">
          <CardHeader>
            <CardTitle className="ff-text-title">
              Compact Mobile-First Buttons
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="max-w-md mx-auto space-y-4">
              <CompactPromoButton
                onClick={() => handleButtonClick('compact-promo')}
                loading={isLoading === 'compact-promo'}
              />
              
              <CompactDemoButton
                onClick={() => handleButtonClick('compact-demo')}
                loading={isLoading === 'compact-demo'}
              />
            </div>
          </CardContent>
        </Card>

        {/* Size Variations */}
        <Card className="ff-card">
          <CardHeader>
            <CardTitle className="ff-text-title">
              Text Overflow Stress Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Different Container Widths */}
            <div className="space-y-4">
              <h3 className="ff-text-body font-semibold">Container Width Tests</h3>
              
              {/* Very narrow container */}
              <div className="w-64 mx-auto bg-muted/20 p-4 rounded border-2 border-dashed border-muted">
                <p className="ff-text-caption text-center mb-2">Width: 256px (16rem)</p>
                <PromoStartBuildingButton
                  onClick={() => handleButtonClick('narrow-promo')}
                  className="w-full"
                />
              </div>
              
              {/* Medium container */}
              <div className="w-96 mx-auto bg-muted/20 p-4 rounded border-2 border-dashed border-muted">
                <p className="ff-text-caption text-center mb-2">Width: 384px (24rem)</p>
                <TryInteractiveDemoButton
                  onClick={() => handleButtonClick('medium-demo')}
                  className="w-full"
                />
              </div>
              
              {/* Wide container */}
              <div className="w-full max-w-2xl mx-auto bg-muted/20 p-4 rounded border-2 border-dashed border-muted">
                <p className="ff-text-caption text-center mb-2">Width: Full (max 672px)</p>
                <div className="flex gap-4">
                  <PromoStartBuildingButton
                    onClick={() => handleButtonClick('wide-promo')}
                    className="flex-1"
                  />
                  <TryInteractiveDemoButton
                    onClick={() => handleButtonClick('wide-demo')}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Original Button Comparison */}
        <Card className="ff-card">
          <CardHeader>
            <CardTitle className="ff-text-title">
              Before vs After Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Before - Original Implementation */}
              <div>
                <h3 className="ff-text-body font-semibold mb-4 text-warning">
                  Before: Text Overflow Issues
                </h3>
                <div className="space-y-4">
                  <Button 
                    size="lg"
                    className="ff-btn-primary w-full group relative overflow-hidden"
                  >
                    <div className="flex items-center relative z-10">
                      <div className="flex flex-col items-start">
                        <span className="text-lg font-bold">Get 50% Off - Start Building</span>
                        <span className="text-xs opacity-90">4 months promotional pricing</span>
                      </div>
                    </div>
                  </Button>
                  
                  <Button 
                    size="lg"
                    variant="outline"
                    className="ff-btn-outline w-full group"
                  >
                    <span className="text-lg font-semibold">Try Interactive Demo</span>
                  </Button>
                </div>
              </div>
              
              {/* After - New Implementation */}
              <div>
                <h3 className="ff-text-body font-semibold mb-4 text-success">
                  After: Responsive & Optimized
                </h3>
                <div className="space-y-4">
                  <PromoStartBuildingButton
                    onClick={() => handleButtonClick('comparison-promo')}
                    className="w-full"
                  />
                  
                  <TryInteractiveDemoButton
                    onClick={() => handleButtonClick('comparison-demo')}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Notes */}
        <Card className="ff-card">
          <CardHeader>
            <CardTitle className="ff-text-title">
              Implementation Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <h3 className="ff-text-body font-semibold mb-3 text-success">
                  ✅ Improvements Made
                </h3>
                <ul className="space-y-2 ff-text-caption text-muted-foreground">
                  <li>• Responsive text sizing (mobile vs desktop)</li>
                  <li>• Proper text wrapping and truncation</li>
                  <li>• Icon positioning that doesn't break layout</li>
                  <li>• Touch-friendly mobile interactions</li>
                  <li>• Professional loading states</li>
                  <li>• Consistent spacing across screen sizes</li>
                  <li>• Accessibility improvements</li>
                  <li>• Performance optimizations</li>
                </ul>
              </div>
              
              <div>
                <h3 className="ff-text-body font-semibold mb-3 text-primary">
                  🎯 Key Features
                </h3>
                <ul className="space-y-2 ff-text-caption text-muted-foreground">
                  <li>• Automatic text truncation on mobile</li>
                  <li>• Flexible layout system</li>
                  <li>• Professional icon integration</li>
                  <li>• Promotional badge positioning</li>
                  <li>• Hover and focus state management</li>
                  <li>• Loading state handling</li>
                  <li>• Analytics tracking ready</li>
                  <li>• FlashFusion design system compliant</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}