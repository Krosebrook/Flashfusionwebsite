/**
 * @fileoverview Phase 1 Business Intelligence Layer Demo
 * @chunk demo
 * @category components
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Interactive demonstration of the completed Phase 1 Business Intelligence Layer
 * showcasing the comprehensive SaaS pricing wireframes and user persona matrix.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  CheckCircle, 
  ExternalLink, 
  Users, 
  DollarSign, 
  BarChart3,
  ArrowRight,
  Target,
  Zap,
  Shield,
  Award,
  TrendingUp,
  Eye,
  MousePointer
} from 'lucide-react';

/**
 * Phase 1 Business Intelligence Demo Component
 * 
 * Provides quick access and overview of the completed Business Intelligence Layer
 */
export function Phase1BusinessIntelligenceDemo() {
  const [demoStats] = useState({
    pricingViews: 1247,
    personaViews: 892,
    conversionRate: 12.8,
    completionStatus: 100
  });

  const businessIntelligenceFeatures = [
    {
      id: 'pricing-optimization',
      title: 'SaaS Pricing Optimization',
      description: 'Three-tier pricing structure with conversion tracking',
      icon: <DollarSign className="w-5 h-5" />,
      status: 'complete',
      access: '?app=true&page=pricing-wireframe',
      features: [
        'Starter Plan ($29/month)',
        'Professional Plan ($79/month)', 
        'Enterprise Plan (Custom)',
        'Live conversion metrics',
        'Annual/monthly toggle',
        'Trust signals & guarantees'
      ]
    },
    {
      id: 'user-personas',
      title: 'User Persona Matrix',
      description: 'Comprehensive persona analysis with behavioral insights',
      icon: <Users className="w-5 h-5" />,
      status: 'complete',
      access: '?app=true&page=user-personas',
      features: [
        'Solo Creator persona',
        'Development Team persona',
        'Enterprise Client persona',
        'Pain points analysis',
        'Workflow visualization',
        'Success metrics tracking'
      ]
    },
    {
      id: 'analytics-tracking',
      title: 'Business Analytics',
      description: 'Real-time metrics and conversion optimization',
      icon: <BarChart3 className="w-5 h-5" />,
      status: 'complete',
      access: 'Built-in analytics dashboard',
      features: [
        'Page view tracking',
        'Conversion rate monitoring',
        'User behavior analytics',
        'Tier selection insights',
        'Performance metrics',
        'ROI measurement'
      ]
    }
  ];

  const handleQuickAccess = (access: string) => {
    if (access.startsWith('?')) {
      const newUrl = `${window.location.origin}${window.location.pathname}${access}`;
      window.open(newUrl, '_blank');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4 ff-fade-in-up">
        <Badge className="ff-badge-success px-4 py-2">
          <CheckCircle className="w-4 h-4 mr-2" />
          Phase 1 Complete
        </Badge>
        
        <h1 className="ff-text-display">
          Business Intelligence
          <span className="ff-text-gradient"> Layer</span>
        </h1>
        
        <p className="ff-text-body max-w-3xl mx-auto">
          Complete implementation of SaaS pricing optimization and user persona matrix 
          with real-time analytics and conversion tracking capabilities.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ff-stagger-fade">
        <Card className="ff-card text-center p-4">
          <div className="w-10 h-10 bg-[var(--ff-primary)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Eye className="w-5 h-5 text-[var(--ff-primary)]" />
          </div>
          <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
            {demoStats.pricingViews.toLocaleString()}
          </div>
          <div className="ff-text-xs text-[var(--ff-text-muted)]">Pricing Views</div>
        </Card>

        <Card className="ff-card text-center p-4">
          <div className="w-10 h-10 bg-[var(--ff-secondary)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Users className="w-5 h-5 text-[var(--ff-secondary)]" />
          </div>
          <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
            {demoStats.personaViews.toLocaleString()}
          </div>
          <div className="ff-text-xs text-[var(--ff-text-muted)]">Persona Views</div>
        </Card>

        <Card className="ff-card text-center p-4">
          <div className="w-10 h-10 bg-[var(--ff-success)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="w-5 h-5 text-[var(--ff-success)]" />
          </div>
          <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
            {demoStats.conversionRate}%
          </div>
          <div className="ff-text-xs text-[var(--ff-text-muted)]">Conversion Rate</div>
        </Card>

        <Card className="ff-card text-center p-4">
          <div className="w-10 h-10 bg-[var(--ff-accent)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Award className="w-5 h-5 text-[var(--ff-accent)]" />
          </div>
          <div className="ff-text-lg text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
            {demoStats.completionStatus}%
          </div>
          <div className="ff-text-xs text-[var(--ff-text-muted)]">Complete</div>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="grid lg:grid-cols-3 gap-6 ff-stagger-fade">
        {businessIntelligenceFeatures.map((feature, index) => (
          <Card 
            key={feature.id} 
            className="ff-card-interactive hover:border-[var(--ff-primary)]/30"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--ff-primary)]/20 rounded-lg flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div>
                    <CardTitle className="ff-text-base text-[var(--ff-text-primary)] mb-1">
                      {feature.title}
                    </CardTitle>
                    <Badge className="ff-badge-success text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {feature.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <p className="ff-text-sm text-[var(--ff-text-muted)] mt-3">
                {feature.description}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Feature List */}
              <div className="space-y-2">
                {feature.features.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[var(--ff-success)] flex-shrink-0" />
                    <span className="ff-text-sm text-[var(--ff-text-secondary)]">{item}</span>
                  </div>
                ))}
              </div>

              {/* Access Button */}
              <Button
                onClick={() => handleQuickAccess(feature.access)}
                className="w-full ff-btn-outline flex items-center justify-center gap-2"
                disabled={!feature.access.startsWith('?')}
                style={{
                  fontFamily: 'var(--ff-font-primary)',
                  fontWeight: 'var(--ff-weight-semibold)',
                  fontSize: 'var(--ff-text-sm)'
                }}
              >
                {feature.access.startsWith('?') ? (
                  <>
                    <MousePointer className="w-4 h-4" />
                    Quick Access
                    <ExternalLink className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4" />
                    {feature.access}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Implementation Status */}
      <Card className="ff-card bg-gradient-to-r from-[var(--ff-surface)] to-[var(--ff-surface-light)]">
        <CardHeader>
          <CardTitle className="ff-text-title flex items-center gap-2">
            <Target className="w-5 h-5 text-[var(--ff-success)]" />
            Implementation Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Business Model Optimization */}
            <div className="space-y-3">
              <h3 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                Business Model Optimization ✅
              </h3>
              <div className="space-y-2">
                {[
                  'Three-tier pricing structure (Starter/Pro/Enterprise)',
                  'Feature lists with clear call-to-actions',
                  'Conversion metrics tracking space',
                  'Clean, modern layout with FlashFusion typography',
                  'Consistent color usage throughout'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[var(--ff-success)]" />
                    <span className="ff-text-sm text-[var(--ff-text-secondary)]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* User Persona Matrix */}
            <div className="space-y-3">
              <h3 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                User Persona Matrix ✅
              </h3>
              <div className="space-y-2">
                {[
                  'Solo Creator, Development Team, Enterprise personas',
                  'Comprehensive pain points analysis',
                  'Workflow steps with tool mapping',
                  'Device preferences and usage patterns',
                  'Success metrics with progress tracking',
                  'Visual avatars and distinct color accents'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[var(--ff-success)]" />
                    <span className="ff-text-sm text-[var(--ff-text-secondary)]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Access Section */}
          <div className="border-t border-[var(--border)] pt-6">
            <h3 className="ff-text-base text-[var(--ff-text-primary)] mb-4" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
              Quick Access to Phase 1 Components
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => handleQuickAccess('?app=true&page=pricing-wireframe')}
                className="ff-btn-primary"
                style={{
                  fontFamily: 'var(--ff-font-primary)',
                  fontWeight: 'var(--ff-weight-semibold)',
                  fontSize: 'var(--ff-text-sm)'
                }}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Pricing Wireframes
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
              
              <Button
                onClick={() => handleQuickAccess('?app=true&page=user-personas')}
                className="ff-btn-secondary"
                style={{
                  fontFamily: 'var(--ff-font-primary)',
                  fontWeight: 'var(--ff-weight-semibold)',
                  fontSize: 'var(--ff-text-sm)'
                }}
              >
                <Users className="w-4 h-4 mr-2" />
                User Personas
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>

              <Button
                onClick={() => handleQuickAccess('?app=true&page=responsive-ui-kit')}
                className="ff-btn-accent"
                style={{
                  fontFamily: 'var(--ff-font-primary)',
                  fontWeight: 'var(--ff-weight-semibold)',
                  fontSize: 'var(--ff-text-sm)'
                }}
              >
                <Zap className="w-4 h-4 mr-2" />
                Phase 2 Preview
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="ff-card border-[var(--ff-primary)]/20">
        <CardHeader>
          <CardTitle className="ff-text-title flex items-center gap-2">
            <Rocket className="w-5 h-5 text-[var(--ff-primary)]" />
            Ready for Phase 2: Technical Architecture Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="ff-text-body mb-4">
            Phase 1 Business Intelligence Layer is complete and production-ready. 
            Phase 2 components are also implemented and ready for exploration.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => handleQuickAccess('?app=true&page=responsive-ui-kit')}
              className="ff-btn-outline"
            >
              <Shield className="w-4 h-4 mr-2" />
              Responsive UI Kit
            </Button>
            <Button
              onClick={() => handleQuickAccess('?app=true&page=backend-architecture')}
              className="ff-btn-outline"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Backend Architecture
            </Button>
            <Button
              onClick={() => handleQuickAccess('?app=true&page=infrastructure-strategy')}
              className="ff-btn-outline"
            >
              <Award className="w-4 h-4 mr-2" />
              Infrastructure Strategy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Phase1BusinessIntelligenceDemo;