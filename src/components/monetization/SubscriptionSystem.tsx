import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Check, 
  Crown, 
  Zap, 
  Star, 
  ArrowRight, 
  CreditCard,
  Shield,
  Users,
  Rocket
} from 'lucide-react';
import { useAuth } from '../auth/AuthSystem';
import { cn } from '../ui/utils';

// Subscription tiers configuration
export const SUBSCRIPTION_TIERS = {
  FREE: {
    id: 'free',
    name: 'Starter',
    price: 0,
    description: 'Perfect for getting started with AI-powered development',
    icon: Zap,
    color: 'text-muted-foreground',
    gradient: 'from-gray-500 to-gray-600',
    limits: {
      aiToolUsage: 50,
      projects: 3,
      deployments: 1,
      collaboration: false,
      advancedTemplates: false,
      prioritySupport: false,
      apiAccess: false,
      customBranding: false,
      analytics: 'basic',
      storage: '100MB',
    },
    features: [
      '50 AI tool uses per month',
      '3 projects',
      '1 deployment per project',
      'Basic templates',
      'Community support',
      '100MB storage',
    ],
  },
  PRO: {
    id: 'pro',
    name: 'Professional',
    price: 29,
    originalPrice: 49,
    description: 'For professional developers and small teams',
    icon: Crown,
    color: 'text-primary',
    gradient: 'from-primary to-orange-500',
    popular: true,
    limits: {
      aiToolUsage: 1000,
      projects: 25,
      deployments: 10,
      collaboration: true,
      advancedTemplates: true,
      prioritySupport: true,
      apiAccess: false,
      customBranding: false,
      analytics: 'advanced',
      storage: '10GB',
    },
    features: [
      '1,000 AI tool uses per month',
      '25 projects',
      '10 deployments per project',
      'Real-time collaboration',
      'Advanced templates',
      'Priority support',
      'Advanced analytics',
      '10GB storage',
      'Custom domains',
    ],
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    description: 'For large teams and organizations',
    icon: Rocket,
    color: 'text-accent',
    gradient: 'from-accent to-pink-500',
    limits: {
      aiToolUsage: 'unlimited',
      projects: 'unlimited',
      deployments: 'unlimited',
      collaboration: true,
      advancedTemplates: true,
      prioritySupport: true,
      apiAccess: true,
      customBranding: true,
      analytics: 'enterprise',
      storage: '100GB',
    },
    features: [
      'Unlimited AI tool usage',
      'Unlimited projects',
      'Unlimited deployments',
      'Team collaboration',
      'White-label options',
      'API access',
      'Custom integrations',
      'Dedicated support',
      '100GB storage',
      'SSO integration',
      'Advanced security',
    ],
  },
} as const;

interface SubscriptionSystemProps {
  currentTier?: string;
  onUpgrade?: (tierId: string) => Promise<void>;
  onDowngrade?: (tierId: string) => Promise<void>;
  className?: string;
}

export const SubscriptionSystem: React.FC<SubscriptionSystemProps> = ({
  currentTier = 'free',
  onUpgrade,
  onDowngrade,
  className,
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleSubscriptionChange = async (tierId: string) => {
    if (!user || isLoading) return;
    
    setIsLoading(tierId);
    
    try {
      if (tierId === 'free' && onDowngrade) {
        await onDowngrade(tierId);
      } else if (onUpgrade) {
        await onUpgrade(tierId);
      }
    } catch (error) {
      console.error('Subscription change failed:', error);
    } finally {
      setIsLoading(null);
    }
  };

  const getButtonText = (tier: typeof SUBSCRIPTION_TIERS.FREE, isCurrentTier: boolean) => {
    if (isCurrentTier) return 'Current Plan';
    if (tier.id === 'free') return 'Downgrade';
    if (tier.id === 'enterprise') return 'Contact Sales';
    return 'Upgrade';
  };

  const getDiscountedPrice = (price: number) => {
    return billingCycle === 'yearly' ? Math.floor(price * 0.8) : price;
  };

  return (
    <div className={cn('space-y-8', className)}>
      {/* Billing Toggle */}
      <div className="flex items-center justify-center space-x-4">
        <span className={cn(
          'text-sm font-medium',
          billingCycle === 'monthly' ? 'text-primary' : 'text-muted-foreground'
        )}>
          Monthly
        </span>
        <button
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
            billingCycle === 'yearly' ? 'bg-primary' : 'bg-muted'
          )}
        >
          <span
            className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </button>
        <span className={cn(
          'text-sm font-medium flex items-center gap-2',
          billingCycle === 'yearly' ? 'text-primary' : 'text-muted-foreground'
        )}>
          Yearly
          <Badge variant="secondary" className="text-xs">
            Save 20%
          </Badge>
        </span>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.values(SUBSCRIPTION_TIERS).map((tier) => {
          const isCurrentTier = currentTier === tier.id;
          const IconComponent = tier.icon;
          const discountedPrice = tier.price > 0 ? getDiscountedPrice(tier.price) : 0;
          
          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-primary to-orange-500 text-white px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <Card className={cn(
                'relative overflow-hidden transition-all duration-300 ff-hover-lift',
                isCurrentTier && 'ring-2 ring-primary',
                tier.popular && 'border-primary/50 shadow-lg shadow-primary/20'
              )}>
                {tier.popular && (
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-orange-500" />
                )}
                
                <CardHeader className="text-center pb-2">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <IconComponent className={cn('w-6 h-6', tier.color)} />
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-center space-x-2">
                      {tier.price > 0 && billingCycle === 'yearly' && (
                        <span className="text-lg text-muted-foreground line-through">
                          ${tier.price}
                        </span>
                      )}
                      <span className="text-3xl font-bold text-primary">
                        ${discountedPrice}
                      </span>
                      <span className="text-muted-foreground">
                        /{billingCycle === 'yearly' ? 'year' : 'month'}
                      </span>
                    </div>
                    
                    {billingCycle === 'yearly' && tier.price > 0 && (
                      <div className="text-sm text-green-500 font-medium">
                        Save ${tier.price * 12 - discountedPrice * 12}/year
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-2">
                    {tier.description}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handleSubscriptionChange(tier.id)}
                    disabled={isCurrentTier || isLoading === tier.id}
                    className={cn(
                      'w-full',
                      tier.id === 'pro' && 'ff-btn-primary',
                      tier.id === 'enterprise' && 'ff-btn-accent',
                      isCurrentTier && 'opacity-50'
                    )}
                    variant={tier.id === 'free' ? 'outline' : 'default'}
                  >
                    {isLoading === tier.id ? (
                      'Processing...'
                    ) : (
                      <>
                        {getButtonText(tier, isCurrentTier)}
                        {!isCurrentTier && tier.id !== 'free' && (
                          <ArrowRight className="w-4 h-4 ml-2" />
                        )}
                      </>
                    )}
                  </Button>
                  
                  {isCurrentTier && (
                    <div className="text-center">
                      <Badge variant="secondary" className="text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        Active Plan
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Usage Tracking for Current Plan */}
      {user && currentTier !== 'enterprise' && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Current Usage</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UsageTracker currentTier={currentTier} />
          </CardContent>
        </Card>
      )}

      {/* Enterprise Contact */}
      <Card className="bg-gradient-to-r from-accent/10 to-pink-500/10 border-accent/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Users className="w-6 h-6 text-accent" />
              <h3 className="text-xl font-semibold">Need a Custom Solution?</h3>
            </div>
            <p className="text-muted-foreground">
              Contact our sales team for custom pricing, on-premise deployment, 
              and enterprise features tailored to your organization.
            </p>
            <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white">
              Contact Sales
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Usage tracker component
interface UsageTrackerProps {
  currentTier: string;
}

const UsageTracker: React.FC<UsageTrackerProps> = ({ currentTier }) => {
  const tier = SUBSCRIPTION_TIERS[currentTier.toUpperCase() as keyof typeof SUBSCRIPTION_TIERS];
  
  // Mock usage data - replace with real data from your backend
  const [usage, setUsage] = useState({
    aiToolUsage: 23,
    projects: 1,
    deployments: 2,
    storage: '45MB',
  });

  if (!tier || tier.id === 'enterprise') return null;

  const getUsagePercentage = (used: number, limit: number | string) => {
    if (typeof limit === 'string') return 0;
    return Math.min((used / limit) * 100, 100);
  };

  return (
    <div className="space-y-4">
      {/* AI Tool Usage */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>AI Tool Usage</span>
          <span className="text-muted-foreground">
            {usage.aiToolUsage} / {tier.limits.aiToolUsage}
          </span>
        </div>
        <Progress 
          value={getUsagePercentage(usage.aiToolUsage, tier.limits.aiToolUsage)} 
          className="h-2"
        />
      </div>

      {/* Projects */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Projects</span>
          <span className="text-muted-foreground">
            {usage.projects} / {tier.limits.projects}
          </span>
        </div>
        <Progress 
          value={getUsagePercentage(usage.projects, tier.limits.projects)} 
          className="h-2"
        />
      </div>

      {/* Storage */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Storage</span>
          <span className="text-muted-foreground">
            {usage.storage} / {tier.limits.storage}
          </span>
        </div>
        <Progress value={45} className="h-2" />
      </div>

      {/* Upgrade prompt if near limits */}
      {(getUsagePercentage(usage.aiToolUsage, tier.limits.aiToolUsage) > 80) && (
        <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-center space-x-2 text-sm">
            <Zap className="w-4 h-4 text-primary" />
            <span>You're approaching your usage limits. Consider upgrading for unlimited access.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionSystem;