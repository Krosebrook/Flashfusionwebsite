/**
 * @fileoverview FlashFusion SaaS Pricing Page Wireframe
 * @chunk pricing
 * @category pages
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Comprehensive SaaS subscription pricing page with conversion optimization,
 * clean modern layout, and integrated analytics tracking.
 * 
 * Features:
 * - Three-tier pricing structure (Starter, Pro, Enterprise)
 * - Conversion metrics tracking
 * - FlashFusion design system compliance
 * - Mobile-first responsive design
 * - Interactive pricing toggles
 * - Trust signals and social proof
 * - Clear call-to-action hierarchy
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { 
  Check, 
  X, 
  Star, 
  Users, 
  Shield, 
  Zap, 
  ArrowRight,
  TrendingUp,
  Clock,
  Award,
  Headphones,
  Database,
  Cloud,
  Settings,
  Lock,
  BarChart3,
  Globe,
  Smartphone,
  Code,
  Palette,
  Rocket
} from 'lucide-react';

// Conversion metrics interface
interface ConversionMetrics {
  pageViews: number;
  uniqueVisitors: number;
  conversionRate: number;
  tierSelections: {
    starter: number;
    pro: number;
    enterprise: number;
  };
  averageTimeOnPage: number;
  bounceRate: number;
}

// Pricing tier interface
interface PricingTier {
  id: 'starter' | 'pro' | 'enterprise';
  name: string;
  tagline: string;
  monthlyPrice: number | string;
  yearlyPrice: number | string;
  savings?: string;
  popular?: boolean;
  enterprise?: boolean;
  features: Array<{
    name: string;
    included: boolean;
    icon?: React.ReactNode;
    tooltip?: string;
  }>;
  limits: {
    users?: string;
    projects?: string;
    storage?: string;
    aiGenerations?: string;
    support?: string;
  };
  cta: string;
  ctaVariant: 'primary' | 'secondary' | 'outline';
}

/**
 * FlashFusion SaaS Pricing Page Wireframe Component
 * 
 * Production-ready pricing page with conversion optimization and analytics
 */
export function PricingPageWireframe() {
  // State management
  const [isYearly, setIsYearly] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [conversionMetrics, setConversionMetrics] = useState<ConversionMetrics>({
    pageViews: 0,
    uniqueVisitors: 0,
    conversionRate: 0,
    tierSelections: { starter: 0, pro: 0, enterprise: 0 },
    averageTimeOnPage: 0,
    bounceRate: 0
  });

  // Pricing tiers configuration
  const pricingTiers: PricingTier[] = useMemo(() => [
    {
      id: 'starter',
      name: 'Starter',
      tagline: 'Perfect for individual creators',
      monthlyPrice: 29,
      yearlyPrice: 290,
      savings: 'Save $58/year',
      features: [
        { name: '50 AI generations per month', included: true, icon: <Zap className="w-4 h-4" /> },
        { name: '5 platforms publishing', included: true, icon: <Globe className="w-4 h-4" /> },
        { name: 'Basic analytics dashboard', included: true, icon: <BarChart3 className="w-4 h-4" /> },
        { name: 'Email support', included: true, icon: <Headphones className="w-4 h-4" /> },
        { name: '1GB cloud storage', included: true, icon: <Database className="w-4 h-4" /> },
        { name: 'Mobile app access', included: true, icon: <Smartphone className="w-4 h-4" /> },
        { name: 'Basic templates library', included: true, icon: <Palette className="w-4 h-4" /> },
        { name: 'Community forum access', included: true, icon: <Users className="w-4 h-4" /> },
        { name: 'Advanced AI models', included: false },
        { name: 'Priority support', included: false },
        { name: 'Custom branding', included: false },
        { name: 'API access', included: false },
        { name: 'White-label solution', included: false }
      ],
      limits: {
        users: '1 user',
        projects: '5 projects',
        storage: '1GB',
        aiGenerations: '50/month',
        support: 'Email'
      },
      cta: 'Start Free Trial',
      ctaVariant: 'outline'
    },
    {
      id: 'pro',
      name: 'Professional',
      tagline: 'Best for growing businesses',
      monthlyPrice: 79,
      yearlyPrice: 790,
      savings: 'Save $158/year',
      popular: true,
      features: [
        { name: '500 AI generations per month', included: true, icon: <Zap className="w-4 h-4" /> },
        { name: '20+ platforms publishing', included: true, icon: <Globe className="w-4 h-4" /> },
        { name: 'Advanced analytics & insights', included: true, icon: <BarChart3 className="w-4 h-4" /> },
        { name: 'Priority email & chat support', included: true, icon: <Headphones className="w-4 h-4" /> },
        { name: '50GB cloud storage', included: true, icon: <Database className="w-4 h-4" /> },
        { name: 'Mobile & desktop apps', included: true, icon: <Smartphone className="w-4 h-4" /> },
        { name: 'Premium templates library', included: true, icon: <Palette className="w-4 h-4" /> },
        { name: 'Team collaboration tools', included: true, icon: <Users className="w-4 h-4" /> },
        { name: 'Advanced AI models', included: true, icon: <Rocket className="w-4 h-4" /> },
        { name: 'Custom branding', included: true, icon: <Award className="w-4 h-4" /> },
        { name: 'API access & webhooks', included: true, icon: <Code className="w-4 h-4" /> },
        { name: 'A/B testing tools', included: true, icon: <Settings className="w-4 h-4" /> },
        { name: 'White-label solution', included: false }
      ],
      limits: {
        users: '5 users',
        projects: '50 projects',
        storage: '50GB',
        aiGenerations: '500/month',
        support: 'Priority'
      },
      cta: 'Start Free Trial',
      ctaVariant: 'primary'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      tagline: 'For large organizations',
      monthlyPrice: 'Custom',
      yearlyPrice: 'Custom',
      enterprise: true,
      features: [
        { name: 'Unlimited AI generations', included: true, icon: <Zap className="w-4 h-4" /> },
        { name: 'All platforms + custom integrations', included: true, icon: <Globe className="w-4 h-4" /> },
        { name: 'Enterprise analytics suite', included: true, icon: <BarChart3 className="w-4 h-4" /> },
        { name: 'Dedicated support manager', included: true, icon: <Headphones className="w-4 h-4" /> },
        { name: 'Unlimited cloud storage', included: true, icon: <Database className="w-4 h-4" /> },
        { name: 'All platform access', included: true, icon: <Smartphone className="w-4 h-4" /> },
        { name: 'Custom templates & assets', included: true, icon: <Palette className="w-4 h-4" /> },
        { name: 'Advanced team management', included: true, icon: <Users className="w-4 h-4" /> },
        { name: 'Cutting-edge AI models', included: true, icon: <Rocket className="w-4 h-4" /> },
        { name: 'Full white-label solution', included: true, icon: <Award className="w-4 h-4" /> },
        { name: 'Enterprise API & SDKs', included: true, icon: <Code className="w-4 h-4" /> },
        { name: 'Advanced security & compliance', included: true, icon: <Lock className="w-4 h-4" /> },
        { name: 'Custom integrations', included: true, icon: <Settings className="w-4 h-4" /> }
      ],
      limits: {
        users: 'Unlimited',
        projects: 'Unlimited',
        storage: 'Unlimited',
        aiGenerations: 'Unlimited',
        support: 'Dedicated'
      },
      cta: 'Contact Sales',
      ctaVariant: 'secondary'
    }
  ], []);

  // Mock conversion metrics (in real app, fetch from analytics service)
  useEffect(() => {
    const fetchConversionMetrics = () => {
      // Simulate real-time metrics
      setConversionMetrics({
        pageViews: 1247,
        uniqueVisitors: 892,
        conversionRate: 12.8,
        tierSelections: { starter: 245, pro: 567, enterprise: 80 },
        averageTimeOnPage: 3.4,
        bounceRate: 24.6
      });
    };

    fetchConversionMetrics();
    const interval = setInterval(fetchConversionMetrics, 30000); // Update every 30s

    return () => clearInterval(interval);
  }, []);

  // Handle tier selection analytics
  const handleTierSelection = (tierId: string) => {
    setSelectedTier(tierId);
    
    // Track conversion event
    const updatedMetrics = { ...conversionMetrics };
    if (tierId === 'starter') updatedMetrics.tierSelections.starter++;
    if (tierId === 'pro') updatedMetrics.tierSelections.pro++;
    if (tierId === 'enterprise') updatedMetrics.tierSelections.enterprise++;
    
    setConversionMetrics(updatedMetrics);
    
    // In real app, send to analytics service
    console.log(`Tier selected: ${tierId}`, { timestamp: new Date().toISOString() });
  };

  // Calculate savings display
  const getSavingsAmount = (tier: PricingTier) => {
    if (typeof tier.monthlyPrice === 'number' && typeof tier.yearlyPrice === 'number') {
      const monthlyCost = tier.monthlyPrice * 12;
      const savings = monthlyCost - tier.yearlyPrice;
      return `Save $${savings}`;
    }
    return tier.savings;
  };

  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)]" style={{ fontFamily: 'var(--ff-font-secondary)' }}>
      
      {/* Conversion Metrics Dashboard - Admin/Analytics View */}
      <div className="fixed top-4 right-4 z-50 bg-[var(--ff-surface)] border border-[var(--border)] rounded-lg p-4 text-xs ff-text-caption opacity-75 hover:opacity-100 transition-opacity">
        <div className="space-y-2 min-w-[200px]">
          <div className="ff-text-sm font-semibold text-[var(--ff-text-primary)] mb-2">📊 Live Metrics</div>
          <div className="grid grid-cols-2 gap-2">
            <div>Views: <span className="text-[var(--ff-primary)]">{conversionMetrics.pageViews}</span></div>
            <div>Visitors: <span className="text-[var(--ff-secondary)]">{conversionMetrics.uniqueVisitors}</span></div>
            <div>Conv Rate: <span className="text-[var(--ff-success)]">{conversionMetrics.conversionRate}%</span></div>
            <div>Bounce: <span className="text-[var(--ff-warning)]">{conversionMetrics.bounceRate}%</span></div>
          </div>
          <div className="text-xs text-[var(--ff-text-muted)] pt-2 border-t border-[var(--border)]">
            Avg Time: {conversionMetrics.averageTimeOnPage}min
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <div className="text-center mb-16 ff-fade-in-up">
          <Badge className="ff-badge-primary mb-4">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trusted by 10,000+ creators
          </Badge>
          
          <h1 className="ff-text-display mb-6">
            Choose Your
            <span className="ff-text-gradient"> Growth Plan</span>
          </h1>
          
          <p className="ff-text-body max-w-3xl mx-auto mb-8">
            Transform your creative workflow with FlashFusion's AI-powered platform. 
            Start free, scale seamlessly, and unlock unlimited potential.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`ff-text-sm ${!isYearly ? 'text-[var(--ff-text-primary)]' : 'text-[var(--ff-text-muted)]'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="ff-focus-ring"
            />
            <span className={`ff-text-sm ${isYearly ? 'text-[var(--ff-text-primary)]' : 'text-[var(--ff-text-muted)]'}`}>
              Yearly
            </span>
            <Badge className="ff-badge-success ml-2">Save up to 20%</Badge>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier, index) => (
            <Card 
              key={tier.id}
              className={`ff-card relative overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-2 ${
                tier.popular 
                  ? 'border-[var(--ff-primary)] bg-gradient-to-b from-[var(--ff-surface)] to-[var(--ff-surface-light)] scale-105' 
                  : 'ff-card-interactive hover:border-[var(--ff-primary)]/30'
              } ${
                selectedTier === tier.id ? 'ring-2 ring-[var(--ff-primary)] ring-opacity-50' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="ff-badge-primary px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                {/* Tier Name and Tagline */}
                <CardTitle className="ff-text-title mb-2">{tier.name}</CardTitle>
                <p className="ff-text-caption text-[var(--ff-text-muted)] mb-6">{tier.tagline}</p>

                {/* Pricing Display */}
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center">
                    <span className="ff-text-5xl text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)', fontWeight: 'var(--ff-weight-bold)' }}>
                      {typeof tier.monthlyPrice === 'number' 
                        ? `$${isYearly ? Math.floor((tier.yearlyPrice as number) / 12) : tier.monthlyPrice}`
                        : tier.monthlyPrice
                      }
                    </span>
                    {typeof tier.monthlyPrice === 'number' && (
                      <span className="ff-text-base text-[var(--ff-text-muted)] ml-1">/month</span>
                    )}
                  </div>
                  
                  {isYearly && !tier.enterprise && (
                    <div className="space-y-1">
                      <div className="ff-text-sm text-[var(--ff-text-muted)] line-through">
                        ${(tier.monthlyPrice as number) * 12}/year
                      </div>
                      <div className="ff-text-sm text-[var(--ff-success)]">
                        {getSavingsAmount(tier)}
                      </div>
                    </div>
                  )}
                  
                  {tier.enterprise && (
                    <div className="ff-text-sm text-[var(--ff-text-muted)]">
                      Custom pricing based on your needs
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                
                {/* Key Limits Display */}
                <div className="grid grid-cols-2 gap-3 p-4 bg-[var(--ff-surface-light)] rounded-lg">
                  <div className="text-center">
                    <div className="ff-text-xs text-[var(--ff-text-muted)]">Users</div>
                    <div className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                      {tier.limits.users}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="ff-text-xs text-[var(--ff-text-muted)]">Projects</div>
                    <div className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                      {tier.limits.projects}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="ff-text-xs text-[var(--ff-text-muted)]">Storage</div>
                    <div className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                      {tier.limits.storage}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="ff-text-xs text-[var(--ff-text-muted)]">AI Gens</div>
                    <div className="ff-text-sm text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                      {tier.limits.aiGenerations}
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      {feature.included ? (
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--ff-success)]/20 flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 text-[var(--ff-success)]" />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--ff-text-muted)]/20 flex items-center justify-center mt-0.5">
                          <X className="w-3 h-3 text-[var(--ff-text-muted)]" />
                        </div>
                      )}
                      <div className="flex items-center gap-2 flex-1">
                        {feature.icon && (
                          <span className={feature.included ? 'text-[var(--ff-primary)]' : 'text-[var(--ff-text-muted)]'}>
                            {feature.icon}
                          </span>
                        )}
                        <span className={`ff-text-sm ${
                          feature.included 
                            ? 'text-[var(--ff-text-primary)]' 
                            : 'text-[var(--ff-text-muted)]'
                        }`}>
                          {feature.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  className={`w-full ff-btn-${tier.ctaVariant} py-3 transition-all duration-200`}
                  onClick={() => handleTierSelection(tier.id)}
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    fontSize: 'var(--ff-text-base)'
                  }}
                >
                  {tier.cta}
                  {tier.ctaVariant !== 'outline' && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>

                {/* Trial Notice */}
                {tier.id !== 'enterprise' && (
                  <p className="text-center ff-text-xs text-[var(--ff-text-muted)]">
                    14-day free trial • No credit card required • Cancel anytime
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Signals Section */}
        <div className="text-center mb-16 space-y-8">
          
          {/* Security & Compliance */}
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-75">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[var(--ff-success)]" />
              <span className="ff-text-sm text-[var(--ff-text-muted)]">SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-[var(--ff-success)]" />
              <span className="ff-text-sm text-[var(--ff-text-muted)]">256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-[var(--ff-success)]" />
              <span className="ff-text-sm text-[var(--ff-text-muted)]">99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[var(--ff-success)]" />
              <span className="ff-text-sm text-[var(--ff-text-muted)]">ISO 27001</span>
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="max-w-md mx-auto p-6 bg-[var(--ff-surface)] border border-[var(--border)] rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-[var(--ff-success)]" />
              <span className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                30-Day Money-Back Guarantee
              </span>
            </div>
            <p className="ff-text-sm text-[var(--ff-text-muted)]">
              Not satisfied? Get a full refund within 30 days, no questions asked.
            </p>
          </div>
        </div>

        {/* Conversion Analytics Display */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="ff-card text-center p-6">
            <div className="w-12 h-12 bg-[var(--ff-primary)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-[var(--ff-primary)]" />
            </div>
            <div className="ff-text-2xl text-[var(--ff-text-primary)] mb-2" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
              {conversionMetrics.tierSelections.starter + conversionMetrics.tierSelections.pro}
            </div>
            <div className="ff-text-sm text-[var(--ff-text-muted)]">Active Subscribers</div>
          </Card>

          <Card className="ff-card text-center p-6">
            <div className="w-12 h-12 bg-[var(--ff-secondary)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-[var(--ff-secondary)]" />
            </div>
            <div className="ff-text-2xl text-[var(--ff-text-primary)] mb-2" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
              {conversionMetrics.averageTimeOnPage}min
            </div>
            <div className="ff-text-sm text-[var(--ff-text-muted)]">Avg. Decision Time</div>
          </Card>

          <Card className="ff-card text-center p-6">
            <div className="w-12 h-12 bg-[var(--ff-success)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-[var(--ff-success)]" />
            </div>
            <div className="ff-text-2xl text-[var(--ff-text-primary)] mb-2" style={{ fontWeight: 'var(--ff-weight-bold)' }}>
              {conversionMetrics.conversionRate}%
            </div>
            <div className="ff-text-sm text-[var(--ff-text-muted)]">Conversion Rate</div>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="ff-text-headline mb-8">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {[
              {
                q: "Can I change plans anytime?",
                a: "Yes, upgrade or downgrade your plan at any time. Changes take effect immediately with prorated billing."
              },
              {
                q: "What happens during the free trial?",
                a: "Get full access to your chosen plan for 14 days. No credit card required. Cancel anytime with no charges."
              },
              {
                q: "Do you offer discounts for nonprofits?",
                a: "Yes, we offer 50% discounts for qualified nonprofits and educational institutions. Contact our sales team."
              },
              {
                q: "How secure is my data?",
                a: "We use enterprise-grade security with SOC 2 compliance, 256-bit encryption, and regular security audits."
              }
            ].map((faq, index) => (
              <div key={index} className="space-y-2">
                <h3 className="ff-text-base text-[var(--ff-text-primary)]" style={{ fontWeight: 'var(--ff-weight-semibold)' }}>
                  {faq.q}
                </h3>
                <p className="ff-text-sm text-[var(--ff-text-muted)]">{faq.a}</p>
              </div>
            ))}
          </div>

          {/* Contact Sales CTA */}
          <div className="mt-12 p-8 bg-[var(--ff-surface)] border border-[var(--border)] rounded-lg">
            <h3 className="ff-text-title mb-4">Need a custom solution?</h3>
            <p className="ff-text-body mb-6">
              Talk to our sales team about enterprise pricing, custom integrations, and volume discounts.
            </p>
            <Button className="ff-btn-outline">
              <Headphones className="w-4 h-4 mr-2" />
              Contact Sales Team
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPageWireframe;