/**
 * @fileoverview Pricing and FAQ Demo Page - FlashFusion Interactive Showcase
 * @chunk demo
 * @category demo
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Dedicated demo page showcasing the interactive pricing dropdown menus
 * and FAQ accordion system with full functionality.
 */

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { PricingDropdownMenu } from '../pricing/PricingDropdownMenu';
import { FAQDropdownSection } from '../faq/FAQDropdownSection';
import { ContactSupportSystem } from '../support/ContactSupportSystem';
import { 
  Crown,
  HelpCircle,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  Play,
  Settings,
  Eye,
  Code,
  MousePointer,
  Smartphone,
  Monitor
} from 'lucide-react';

interface PricingFAQDemoPageProps {
  onBack?: () => void;
}

export function PricingFAQDemoPage({ onBack }: PricingFAQDemoPageProps) {
  const [showContactSupport, setShowContactSupport] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<'pricing' | 'faq'>('pricing');
  const [interactions, setInteractions] = useState<string[]>([]);
  const [isPromotionalMode, setIsPromotionalMode] = useState(true);

  const addInteraction = (interaction: string) => {
    setInteractions(prev => [
      `${new Date().toLocaleTimeString()}: ${interaction}`,
      ...prev.slice(0, 9) // Keep last 10 interactions
    ]);
  };

  const handlePlanSelection = (planId: string, subPlanId?: string) => {
    addInteraction(`Selected plan: ${planId}${subPlanId ? ` (${subPlanId})` : ''}`);
  };

  const handleGetStarted = (planId: string) => {
    addInteraction(`Started signup for: ${planId}`);
  };

  const handleContactSupport = () => {
    addInteraction('Opened contact support');
    setShowContactSupport(true);
  };

  const demoFeatures = [
    {
      icon: <MousePointer className="w-5 h-5" />,
      title: 'Hover & Click Interactions',
      description: 'Dropdown menus respond to both hover and click events'
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: 'Visual Feedback',
      description: 'Smooth animations and visual cues for better UX'
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      title: 'Mobile Optimized',
      description: 'Touch-friendly interfaces that work across all devices'
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: 'Configurable Options',
      description: 'Customizable pricing tiers and FAQ categories'
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)] py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="border-[var(--border)] text-[var(--ff-text-primary)] hover:bg-[var(--ff-surface-light)]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <div>
              <h1 className="ff-text-headline text-3xl">Pricing & FAQ Demo</h1>
              <p className="text-[var(--ff-text-secondary)] ff-text-body">
                Interactive showcase of dropdown menus and collapsible FAQ sections
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className="ff-badge-primary">
              <Sparkles className="w-3 h-3 mr-1" />
              Interactive Demo
            </Badge>
            <Badge variant="outline" className="border-[var(--border)] text-[var(--ff-text-muted)]">
              <Code className="w-3 h-3 mr-1" />
              React + TypeScript
            </Badge>
          </div>
        </div>
      </div>

      {/* Demo Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Card className="ff-card">
          <CardHeader>
            <CardTitle className="ff-text-title flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Demo Controls
            </CardTitle>
            <CardDescription className="ff-text-caption">
              Customize the demo experience and track interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Demo Selection */}
              <div className="space-y-3">
                <label className="ff-text-caption font-semibold text-[var(--ff-text-primary)]">
                  Active Demo Component
                </label>
                <Tabs value={selectedDemo} onValueChange={(value) => setSelectedDemo(value as 'pricing' | 'faq')}>
                  <TabsList className="grid grid-cols-2 bg-[var(--ff-surface-light)]">
                    <TabsTrigger 
                      value="pricing"
                      className="data-[state=active]:bg-[var(--ff-primary)] data-[state=active]:text-white"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Pricing
                    </TabsTrigger>
                    <TabsTrigger 
                      value="faq"
                      className="data-[state=active]:bg-[var(--ff-primary)] data-[state=active]:text-white"
                    >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      FAQ
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Settings */}
              <div className="space-y-3">
                <label className="ff-text-caption font-semibold text-[var(--ff-text-primary)]">
                  Demo Settings
                </label>
                <div className="flex items-center gap-4">
                  <Button
                    size="sm"
                    variant={isPromotionalMode ? "default" : "outline"}
                    onClick={() => setIsPromotionalMode(!isPromotionalMode)}
                    className={isPromotionalMode ? 'ff-btn-primary' : 'border-[var(--border)] text-[var(--ff-text-primary)]'}
                  >
                    {isPromotionalMode ? 'Promotional ON' : 'Promotional OFF'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setInteractions([])}
                    className="border-[var(--border)] text-[var(--ff-text-primary)] hover:bg-[var(--ff-surface-light)]"
                  >
                    Clear Log
                  </Button>
                </div>
              </div>
            </div>

            {/* Interaction Log */}
            {interactions.length > 0 && (
              <div className="mt-6 p-4 bg-[var(--ff-surface-light)] rounded-lg">
                <h4 className="ff-text-caption font-semibold text-[var(--ff-text-primary)] mb-3">
                  Interaction Log
                </h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {interactions.map((interaction, index) => (
                    <div key={index} className="text-sm text-[var(--ff-text-secondary)] ff-text-code">
                      {interaction}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Demo Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {demoFeatures.map((feature, index) => (
            <Card key={index} className="ff-card ff-card-interactive">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-[var(--ff-primary)] to-[var(--ff-secondary)] rounded-lg flex items-center justify-center text-white">
                    {feature.icon}
                  </div>
                  <h3 className="ff-text-title text-sm">{feature.title}</h3>
                </div>
                <p className="text-xs text-[var(--ff-text-muted)] ff-text-caption">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Demo Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="ff-card">
          <CardContent className="p-8">
            {selectedDemo === 'pricing' ? (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <Crown className="w-8 h-8 text-[var(--ff-primary)]" />
                    <h2 className="ff-text-headline text-2xl">Interactive Pricing Demo</h2>
                  </div>
                  <p className="text-[var(--ff-text-secondary)] ff-text-body max-w-2xl mx-auto">
                    Hover over or click on any pricing card to explore billing options, features, and add-ons. 
                    Each interaction will be logged above for demonstration purposes.
                  </p>
                </div>

                <PricingDropdownMenu
                  onSelectPlan={handlePlanSelection}
                  onGetStarted={handleGetStarted}
                  showPromotionalOffer={isPromotionalMode}
                />
              </div>
            ) : (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <HelpCircle className="w-8 h-8 text-[var(--ff-secondary)]" />
                    <h2 className="ff-text-headline text-2xl">Interactive FAQ Demo</h2>
                  </div>
                  <p className="text-[var(--ff-text-secondary)] ff-text-body max-w-2xl mx-auto">
                    Search through questions, filter by category, and expand answers. 
                    Vote on helpfulness and explore related resources for each question.
                  </p>
                </div>

                <FAQDropdownSection
                  onContactSupport={handleContactSupport}
                  maxDisplayedItems={15}
                  showSearch={true}
                  showCategories={true}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center">
        <div className="space-y-4 py-8 border-t border-[var(--border)]">
          <h3 className="ff-text-title">Demo Features Implemented</h3>
          <div className="flex items-center justify-center gap-6 text-sm text-[var(--ff-text-muted)]">
            <div className="flex items-center gap-2">
              <MousePointer className="w-4 h-4 text-[var(--ff-success)]" />
              <span>Hover/Click Events</span>
            </div>
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-[var(--ff-secondary)]" />
              <span>Responsive Design</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--ff-accent)]" />
              <span>Smooth Animations</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-[var(--ff-primary)]" />
              <span>TypeScript + React</span>
            </div>
          </div>
          
          <p className="text-[var(--ff-text-muted)] ff-text-caption max-w-2xl mx-auto">
            These components use modern React patterns with TypeScript for type safety, 
            Tailwind CSS for styling, and our FlashFusion design system for consistent theming.
          </p>
        </div>
      </div>

      {/* Contact Support Modal */}
      {showContactSupport && (
        <ContactSupportSystem
          onClose={() => {
            setShowContactSupport(false);
            addInteraction('Closed contact support');
          }}
        />
      )}
    </div>
  );
}

export default PricingFAQDemoPage;