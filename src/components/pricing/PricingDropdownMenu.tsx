/**
 * @fileoverview Pricing Dropdown Menu - FlashFusion Interactive Pricing
 * @chunk pricing
 * @category pricing
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Interactive pricing dropdown with hover/click functionality
 * featuring promotional offers, feature comparisons, and sub-plan options.
 */

import React, { useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { 
  Crown,
  Star,
  Zap,
  Users,
  Building,
  Check,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Shield,
  Rocket,
  DollarSign,
  Percent,
  Gift,
  ArrowRight,
  Info,
  Heart,
  TrendingUp
} from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  basePrice: string;
  discountedPrice?: string;
  period: string;
  description: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  icon: React.ReactNode;
  popular?: boolean;
  features: string[];
  subPlans?: {
    id: string;
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
  }[];
  addOns?: {
    id: string;
    name: string;
    price: string;
    description: string;
  }[];
}

interface PricingDropdownMenuProps {
  onSelectPlan?: (planId: string, subPlanId?: string) => void;
  onGetStarted?: (planId: string) => void;
  showPromotionalOffer?: boolean;
}

export function PricingDropdownMenu({ 
  onSelectPlan, 
  onGetStarted,
  showPromotionalOffer = true 
}: PricingDropdownMenuProps) {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const pricingPlans: PricingPlan[] = [
    {
      id: 'starter',
      name: 'Starter Pro',
      basePrice: '$29',
      discountedPrice: showPromotionalOffer ? '$14.50' : undefined,
      period: '/month',
      description: 'Perfect for individual creators',
      badge: showPromotionalOffer ? '50% OFF' : 'Popular',
      badgeVariant: showPromotionalOffer ? 'destructive' : 'default',
      icon: <Star className="w-5 h-5" />,
      popular: !showPromotionalOffer,
      features: [
        '100 AI generations per month',
        '10 platforms publishing',
        'Priority support',
        '5GB storage',
        'Advanced analytics',
        'Custom branding'
      ],
      subPlans: [
        {
          id: 'starter-monthly',
          name: 'Monthly',
          price: showPromotionalOffer ? '$14.50' : '$29',
          period: '/month',
          description: 'Pay monthly, cancel anytime',
          features: ['All Starter Pro features', 'Monthly billing', 'Cancel anytime']
        },
        {
          id: 'starter-yearly',
          name: 'Yearly',
          price: showPromotionalOffer ? '$145' : '$290',
          period: '/year',
          description: 'Save 2 months with yearly plan',
          features: ['All Starter Pro features', '2 months free', 'Yearly billing']
        }
      ],
      addOns: [
        {
          id: 'extra-storage',
          name: 'Extra Storage',
          price: '+$5',
          description: 'Additional 10GB storage'
        },
        {
          id: 'priority-generation',
          name: 'Priority Queue',
          price: '+$10',
          description: 'Skip generation queues'
        }
      ]
    },
    {
      id: 'professional',
      name: 'Professional Pro',
      basePrice: '$79',
      discountedPrice: showPromotionalOffer ? '$39.50' : undefined,
      period: '/month',
      description: 'Best for growing businesses',
      badge: 'Most Popular',
      badgeVariant: 'default',
      icon: <Crown className="w-5 h-5" />,
      popular: true,
      features: [
        '1000 AI generations per month',
        '25+ platforms publishing',
        '24/7 priority support',
        '100GB storage',
        'Advanced analytics & insights',
        'White-label solutions',
        'API access & webhooks',
        'Team collaboration tools'
      ],
      subPlans: [
        {
          id: 'pro-monthly',
          name: 'Monthly',
          price: showPromotionalOffer ? '$39.50' : '$79',
          period: '/month',
          description: 'Full professional features',
          features: ['All Professional features', 'Monthly billing', 'Priority support']
        },
        {
          id: 'pro-yearly',
          name: 'Yearly',
          price: showPromotionalOffer ? '$395' : '$790',
          period: '/year',
          description: 'Best value for professionals',
          features: ['All Professional features', '2 months free', 'Extended support']
        },
        {
          id: 'pro-quarterly',
          name: 'Quarterly',
          price: showPromotionalOffer ? '$118.50' : '$237',
          period: '/quarter',
          description: 'Flexible quarterly billing',
          features: ['All Professional features', 'Quarterly billing', 'Flexible commitment']
        }
      ],
      addOns: [
        {
          id: 'team-seats',
          name: 'Additional Team Seats',
          price: '+$15',
          description: 'Per additional team member'
        },
        {
          id: 'advanced-analytics',
          name: 'Advanced Analytics',
          price: '+$20',
          description: 'Deep insights and reporting'
        },
        {
          id: 'white-label-plus',
          name: 'White Label Plus',
          price: '+$25',
          description: 'Complete branding customization'
        }
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise Pro',
      basePrice: '$199',
      discountedPrice: showPromotionalOffer ? '$99.50' : undefined,
      period: '/month',
      description: 'For large organizations',
      badge: 'Enterprise',
      badgeVariant: 'secondary',
      icon: <Building className="w-5 h-5" />,
      features: [
        'Unlimited AI generations',
        'All platforms + custom integrations',
        'Dedicated success manager',
        'Unlimited storage',
        'Enterprise security & compliance',
        'On-premise deployment options',
        'Custom AI model training',
        'SLA guarantees'
      ],
      subPlans: [
        {
          id: 'enterprise-standard',
          name: 'Standard',
          price: showPromotionalOffer ? '$99.50' : '$199',
          period: '/month',
          description: 'Full enterprise features',
          features: ['All Enterprise features', 'Dedicated support', 'SLA included']
        },
        {
          id: 'enterprise-premium',
          name: 'Premium',
          price: showPromotionalOffer ? '$149.50' : '$299',
          period: '/month',
          description: 'Enhanced enterprise package',
          features: ['Everything in Standard', 'Custom integrations', 'On-premise option']
        },
        {
          id: 'enterprise-custom',
          name: 'Custom',
          price: 'Contact Sales',
          period: '',
          description: 'Tailored to your needs',
          features: ['Custom pricing', 'Unlimited everything', 'Personal account manager']
        }
      ],
      addOns: [
        {
          id: 'dedicated-infrastructure',
          name: 'Dedicated Infrastructure',
          price: '+$500',
          description: 'Private cloud deployment'
        },
        {
          id: 'custom-model-training',
          name: 'Custom AI Model',
          price: '+$1000',
          description: 'Train AI on your data'
        },
        {
          id: 'professional-services',
          name: 'Professional Services',
          price: 'Contact Sales',
          description: 'Implementation and consulting'
        }
      ]
    }
  ];

  const handlePlanSelect = useCallback((planId: string, subPlanId?: string) => {
    setSelectedPlan(planId);
    onSelectPlan?.(planId, subPlanId);
  }, [onSelectPlan]);

  const handleGetStarted = useCallback((planId: string) => {
    onGetStarted?.(planId);
  }, [onGetStarted]);

  const PlanDropdown = ({ plan }: { plan: PricingPlan }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Card 
          className={`ff-card-interactive cursor-pointer transition-all duration-300 ${
            plan.popular ? 'ring-2 ring-[var(--ff-primary)] ring-opacity-50' : ''
          } ${hoveredPlan === plan.id ? 'ff-hover-lift' : ''}`}
          onMouseEnter={() => setHoveredPlan(plan.id)}
          onMouseLeave={() => setHoveredPlan(null)}
          style={{ fontFamily: 'var(--ff-font-primary)' }}
          role="button"
          tabIndex={0}
        >
          <CardHeader className="relative pb-6">
            {plan.badge && (
              <Badge 
                variant={plan.badgeVariant || 'default'}
                className="absolute -top-2 -right-2 ff-badge-glow"
              >
                <Gift className="w-3 h-3 mr-1" />
                {plan.badge}
              </Badge>
            )}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--ff-primary)] to-[var(--ff-secondary)] rounded-lg flex items-center justify-center text-white">
                {plan.icon}
              </div>
              <div>
                <CardTitle className="text-xl text-[var(--ff-text-primary)] ff-text-title">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-[var(--ff-text-muted)] ff-text-caption">
                  {plan.description}
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-baseline gap-2 mb-4">
              {plan.discountedPrice && (
                <>
                  <span className="text-3xl font-bold text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)' }}>
                    {plan.discountedPrice}
                  </span>
                  <span className="text-lg text-[var(--ff-text-muted)] line-through">
                    {plan.basePrice}
                  </span>
                </>
              )}
              {!plan.discountedPrice && (
                <span className="text-3xl font-bold text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)' }}>
                  {plan.basePrice}
                </span>
              )}
              <span className="text-[var(--ff-text-muted)] ff-text-caption">
                {plan.period}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[var(--ff-text-secondary)] ff-text-caption">
              <ChevronDown className="w-4 h-4" />
              <span>View plans & options</span>
            </div>
          </CardHeader>
        </Card>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        className="w-80 bg-[var(--ff-surface)] border-[var(--border)] ff-fade-in-up"
        align="center"
        side="bottom"
      >
        <DropdownMenuLabel className="text-[var(--ff-text-primary)] ff-text-title">
          <div className="flex items-center gap-2">
            {plan.icon}
            {plan.name} Options
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[var(--border)]" />

        {/* Sub Plans */}
        {plan.subPlans && (
          <>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="text-[var(--ff-text-primary)] hover:bg-[var(--ff-surface-light)]">
                <DollarSign className="w-4 h-4 mr-2" />
                Billing Options
                <ChevronRight className="w-4 h-4 ml-auto" />
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="bg-[var(--ff-surface)] border-[var(--border)] w-64">
                {plan.subPlans.map((subPlan) => (
                  <DropdownMenuItem
                    key={subPlan.id}
                    className="text-[var(--ff-text-primary)] hover:bg-[var(--ff-surface-light)] cursor-pointer p-4"
                    onClick={() => handlePlanSelect(plan.id, subPlan.id)}
                  >
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{subPlan.name}</span>
                        <span className="text-[var(--ff-primary)] font-bold">{subPlan.price}{subPlan.period}</span>
                      </div>
                      <p className="text-xs text-[var(--ff-text-muted)]">{subPlan.description}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator className="bg-[var(--border)]" />
          </>
        )}

        {/* Features */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="text-[var(--ff-text-primary)] hover:bg-[var(--ff-surface-light)]">
            <Star className="w-4 h-4 mr-2" />
            Included Features
            <ChevronRight className="w-4 h-4 ml-auto" />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-[var(--ff-surface)] border-[var(--border)] w-72">
            <div className="p-3 space-y-2">
              {plan.features.slice(0, 6).map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-[var(--ff-success)] flex-shrink-0" />
                  <span className="text-[var(--ff-text-secondary)]">{feature}</span>
                </div>
              ))}
              {plan.features.length > 6 && (
                <div className="text-xs text-[var(--ff-text-muted)] pt-2 border-t border-[var(--border)]">
                  +{plan.features.length - 6} more features included
                </div>
              )}
            </div>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Add-ons */}
        {plan.addOns && (
          <>
            <DropdownMenuSeparator className="bg-[var(--border)]" />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="text-[var(--ff-text-primary)] hover:bg-[var(--ff-surface-light)]">
                <Sparkles className="w-4 h-4 mr-2" />
                Available Add-ons
                <ChevronRight className="w-4 h-4 ml-auto" />
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="bg-[var(--ff-surface)] border-[var(--border)] w-72">
                {plan.addOns.map((addOn) => (
                  <DropdownMenuItem
                    key={addOn.id}
                    className="text-[var(--ff-text-primary)] hover:bg-[var(--ff-surface-light)] cursor-pointer p-3"
                  >
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{addOn.name}</span>
                        <span className="text-[var(--ff-secondary)] font-semibold">{addOn.price}</span>
                      </div>
                      <p className="text-xs text-[var(--ff-text-muted)]">{addOn.description}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </>
        )}

        <DropdownMenuSeparator className="bg-[var(--border)]" />
        
        {/* Action Buttons */}
        <div className="p-3 space-y-2">
          <Button
            onClick={() => handleGetStarted(plan.id)}
            className="w-full ff-btn-primary ff-hover-glow"
          >
            <Rocket className="w-4 h-4 mr-2" />
            Get Started
          </Button>
          <Button
            variant="outline"
            className="w-full text-[var(--ff-text-primary)] border-[var(--border)] hover:bg-[var(--ff-surface-light)]"
            onClick={() => {/* Handle learn more */}}
          >
            <Info className="w-4 h-4 mr-2" />
            Learn More
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[var(--ff-primary)] to-[var(--ff-secondary)] rounded-xl flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <h2 className="ff-text-headline">
            Choose Your Plan
          </h2>
        </div>
        
        {showPromotionalOffer && (
          <div className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-[var(--ff-primary)]/10 to-[var(--ff-secondary)]/10 rounded-lg border border-[var(--ff-primary)]/20">
            <Percent className="w-5 h-5 text-[var(--ff-primary)]" />
            <p className="text-[var(--ff-text-primary)] ff-text-body">
              <span className="font-bold text-[var(--ff-primary)]">Limited Time:</span> 50% OFF all plans - Save up to $1,200/year!
            </p>
            <TrendingUp className="w-5 h-5 text-[var(--ff-success)]" />
          </div>
        )}
        
        <p className="text-[var(--ff-text-secondary)] ff-text-body max-w-2xl mx-auto">
          Hover or click on any plan to explore billing options, features, and available add-ons.
          All plans include our core AI development platform with premium support.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingPlans.map((plan) => (
          <div key={plan.id} className="ff-fade-in-up">
            <PlanDropdown plan={plan} />
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="text-center space-y-4 pt-8 border-t border-[var(--border)]">
        <div className="flex items-center justify-center gap-6 text-sm text-[var(--ff-text-muted)]">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[var(--ff-success)]" />
            <span>30-day money-back guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[var(--ff-accent)]" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--ff-secondary)]" />
            <span>24/7 support included</span>
          </div>
        </div>
        
        <p className="text-[var(--ff-text-muted)] ff-text-caption">
          Need a custom solution? <button className="text-[var(--ff-primary)] hover:underline font-semibold">Contact our sales team</button> for enterprise pricing and features.
        </p>
      </div>
    </div>
  );
}

export default PricingDropdownMenu;