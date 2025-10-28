/**
 * Landing Page Demo Component
 * Demonstrates the premium landing page with easy access and comparison
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ExternalLink, Eye, Zap, Target, Users, Shield } from 'lucide-react';

export function LandingPageDemo() {
  const openLandingPage = () => {
    const landingUrl = new URL(window.location.href);
    landingUrl.searchParams.set('landing', 'true');
    window.open(landingUrl.toString(), '_blank');
  };

  const features = [
    {
      icon: <Target className="w-5 h-5" />,
      title: 'Conversion Optimized',
      description: 'Every element designed for maximum conversion and user engagement'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Performance First',
      description: 'Lightning-fast loading with optimized images and progressive enhancement'
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'User-Centric Design',
      description: 'Clean, accessible interface that works perfectly on all devices'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Trust & Security',
      description: 'Professional credibility signals and transparent pricing'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge className="ff-badge-primary mb-4">
          Marketing Landing Page
        </Badge>
        <h1 className="ff-text-headline">
          Premium Landing Page Demo
        </h1>
        <p className="ff-text-body max-w-3xl mx-auto">
          Experience our conversion-optimized landing page designed for marketing campaigns, 
          user acquisition, and professional presentation. Built with modern design principles 
          and performance optimization.
        </p>
      </div>

      {/* Quick Preview Card */}
      <Card className="ff-card-interactive">
        <CardHeader className="text-center">
          <CardTitle className="ff-text-title">
            FlashFusion Premium Landing Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Preview Image Placeholder */}
          <div className="aspect-video bg-gradient-to-br from-[#00D4FF]/20 to-[#4DD0E1]/20 rounded-xl flex items-center justify-center border border-white/10">
            <div className="text-center">
              <Eye className="w-12 h-12 text-[#00D4FF] mx-auto mb-4" />
              <p className="text-white/80 font-medium">Landing Page Preview</p>
              <p className="text-white/60 text-sm">Clean, conversion-focused design</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={openLandingPage}
              className="ff-btn-primary"
              size="lg"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              View Landing Page
            </Button>
            <Button 
              onClick={() => window.location.href = '?landing=true'}
              variant="outline"
              className="ff-btn-outline"
              size="lg"
            >
              <Eye className="w-5 h-5 mr-2" />
              Switch to Landing Mode
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="ff-card-interactive">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="text-[#00D4FF] mt-1">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Technical Details */}
      <Card className="ff-card">
        <CardHeader>
          <CardTitle className="ff-text-title">
            Landing Page Specifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Design System */}
            <div>
              <h4 className="font-semibold text-white mb-3">Design System</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li>• Electric Blue (#00D4FF) primary color</li>
                <li>• Soft Cyan (#4DD0E1) accent color</li>
                <li>• Inter font family for optimal readability</li>
                <li>• 8px grid-based spacing system</li>
                <li>• Glass morphism effects (5% opacity)</li>
                <li>• Mobile-first responsive design</li>
              </ul>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-semibold text-white mb-3">Key Features</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li>• Conversion-optimized user journey</li>
                <li>• WCAG 2.1 AA accessibility compliance</li>
                <li>• Performance-first architecture</li>
                <li>• Progressive enhancement</li>
                <li>• Social proof and trust signals</li>
                <li>• Mobile touch-friendly interfaces</li>
              </ul>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="font-semibold text-white mb-2">Usage Instructions</h4>
            <p className="text-sm text-white/70 mb-3">
              Access the landing page in several ways:
            </p>
            <ul className="text-sm text-white/60 space-y-1">
              <li>• Add <code className="text-[#00D4FF]">?landing=true</code> to any URL</li>
              <li>• Visit <code className="text-[#00D4FF]">/landing</code> path</li>
              <li>• Set <code className="text-[#00D4FF]">ff-show-landing</code> in localStorage</li>
              <li>• Use the toggle button in development mode</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center py-8">
        <h3 className="ff-text-title mb-4">
          Ready to see it in action?
        </h3>
        <p className="ff-text-body mb-6">
          Experience the premium landing page designed for maximum conversion and user engagement.
        </p>
        <Button 
          onClick={openLandingPage}
          size="lg"
          className="ff-btn-primary"
        >
          <ExternalLink className="w-5 h-5 mr-2" />
          Launch Landing Page Demo
        </Button>
      </div>
    </div>
  );
}

export default LandingPageDemo;