import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Check, 
  CreditCard, 
  Star, 
  Zap, 
  Crown, 
  Building2,
  Users,
  Infinity,
  Clock,
  Shield,
  HeadphonesIcon,
  Sparkles,
  TrendingUp,
  Globe,
  Database,
  Bot,
  Rocket,
  Award,
  Target,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { motion } from 'motion/react';

const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    icon: Zap,
    price: { monthly: 29, yearly: 290 },
    description: 'Perfect for individual creators and small projects',
    badge: 'Most Popular',
    badgeColor: 'bg-primary',
    features: [
      { name: '5 AI Tools Access', included: true },
      { name: '50 Generations/Month', included: true },
      { name: 'Basic Templates', included: true },
      { name: 'Email Support', included: true },
      { name: '1 Project', included: true },
      { name: 'Standard Deployment', included: true },
      { name: 'Community Access', included: true },
      { name: 'Advanced AI Models', included: false },
      { name: 'Priority Support', included: false },
      { name: 'Custom Integrations', included: false },
      { name: 'Team Collaboration', included: false },
      { name: 'White-label Solutions', included: false }
    ],
    modules: {
      development: 'Basic',
      ecommerce: 'Limited',
      content: 'Standard',
      design: 'Basic',
      mobile: 'Limited',
      deployment: 'Standard',
      ai: 'Basic',
      analytics: 'Basic'
    },
    limits: {
      projects: 1,
      generations: 50,
      storage: '5GB',
      teamMembers: 1,
      aiModels: 3,
      deployments: 5
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    icon: Crown,
    price: { monthly: 79, yearly: 790 },
    description: 'Ideal for growing businesses and professional developers',
    badge: 'Recommended',
    badgeColor: 'bg-secondary',
    features: [
      { name: '25 AI Tools Access', included: true },
      { name: '500 Generations/Month', included: true },
      { name: 'Premium Templates', included: true },
      { name: 'Priority Email & Chat', included: true },
      { name: '10 Projects', included: true },
      { name: 'Advanced Deployment', included: true },
      { name: 'Community + Discord', included: true },
      { name: 'Advanced AI Models', included: true },
      { name: 'Priority Support', included: true },
      { name: 'Basic Integrations', included: true },
      { name: '5 Team Members', included: true },
      { name: 'White-label Solutions', included: false }
    ],
    modules: {
      development: 'Advanced',
      ecommerce: 'Standard',
      content: 'Advanced',
      design: 'Advanced',
      mobile: 'Standard',
      deployment: 'Advanced',
      ai: 'Advanced',
      analytics: 'Advanced'
    },
    limits: {
      projects: 10,
      generations: 500,
      storage: '50GB',
      teamMembers: 5,
      aiModels: 6,
      deployments: 25
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: Building2,
    price: { monthly: 199, yearly: 1990 },
    description: 'Complete solution for large teams and enterprises',
    badge: 'Full Access',
    badgeColor: 'bg-accent',
    features: [
      { name: 'All 60+ AI Tools', included: true },
      { name: 'Unlimited Generations', included: true },
      { name: 'Custom Templates', included: true },
      { name: '24/7 Priority Support', included: true },
      { name: 'Unlimited Projects', included: true },
      { name: 'Enterprise Deployment', included: true },
      { name: 'Private Community', included: true },
      { name: 'All AI Models', included: true },
      { name: 'Dedicated Support', included: true },
      { name: 'Custom Integrations', included: true },
      { name: 'Unlimited Team Members', included: true },
      { name: 'White-label Solutions', included: true }
    ],
    modules: {
      development: 'Enterprise',
      ecommerce: 'Enterprise',
      content: 'Enterprise',
      design: 'Enterprise',
      mobile: 'Enterprise',
      deployment: 'Enterprise',
      ai: 'Enterprise',
      analytics: 'Enterprise'
    },
    limits: {
      projects: 'Unlimited',
      generations: 'Unlimited',
      storage: '500GB',
      teamMembers: 'Unlimited',
      aiModels: 8,
      deployments: 'Unlimited'
    }
  }
];

const addOns = [
  {
    name: 'Extra AI Generations',
    description: '1000 additional generations per month',
    price: 19,
    icon: Bot
  },
  {
    name: 'Premium Storage',
    description: '100GB additional storage',
    price: 15,
    icon: Database
  },
  {
    name: 'Dedicated Support',
    description: 'Dedicated support agent',
    price: 99,
    icon: HeadphonesIcon
  },
  {
    name: 'Custom AI Model',
    description: 'Train a custom AI model for your use case',
    price: 299,
    icon: Sparkles
  }
];

const enterpriseFeatures = [
  {
    category: 'Security & Compliance',
    features: ['SOC 2 Type II Compliance', 'GDPR Compliance', 'Custom SSO Integration', 'Advanced Audit Logs', 'Data Residency Options']
  },
  {
    category: 'Custom Development',
    features: ['Custom AI Model Training', 'Bespoke Integrations', 'White-label Solutions', 'Custom Deployment Options', 'Dedicated Infrastructure']
  },
  {
    category: 'Support & Training',
    features: ['Dedicated Customer Success Manager', 'Custom Training Programs', 'On-site Implementation', 'Priority Feature Requests', '99.9% SLA Guarantee']
  }
];

const PricingCard = ({ plan, isYearly, isPopular }: { plan: any, isYearly: boolean, isPopular?: boolean }) => {
  const Icon = plan.icon;
  const price = isYearly ? plan.price.yearly : plan.price.monthly;
  const monthlyPrice = isYearly ? price / 12 : price;
  const savings = isYearly ? Math.round((1 - plan.price.yearly / (plan.price.monthly * 12)) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${isPopular ? 'z-10 scale-105' : ''}`}
    >
      {plan.badge && (
        <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-white text-sm font-medium ${plan.badgeColor}`}>
          {plan.badge}
        </div>
      )}
      
      <Card className={`ff-card-interactive h-full ${isPopular ? 'ring-2 ring-primary shadow-xl' : ''}`}>
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
              <Icon className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <CardTitle className="text-2xl ff-text-gradient mb-2">
            {plan.name}
          </CardTitle>
          
          <CardDescription className="text-muted-foreground mb-6">
            {plan.description}
          </CardDescription>
          
          <div className="space-y-2">
            <div className="flex items-baseline justify-center space-x-1">
              <span className="text-4xl font-bold text-primary">
                ${Math.round(monthlyPrice)}
              </span>
              <span className="text-muted-foreground">
                /month
              </span>
            </div>
            
            {isYearly && savings > 0 && (
              <div className="flex items-center justify-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  Save {savings}%
                </Badge>
                <span className="text-xs text-muted-foreground line-through">
                  ${plan.price.monthly}/mo
                </span>
              </div>
            )}
            
            {isYearly && (
              <div className="text-sm text-muted-foreground">
                Billed annually (${price})
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Key Limits */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Projects</span>
              <span className="font-medium">{plan.limits.projects}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">AI Generations</span>
              <span className="font-medium">{plan.limits.generations}/mo</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Team Members</span>
              <span className="font-medium">{plan.limits.teamMembers}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Storage</span>
              <span className="font-medium">{plan.limits.storage}</span>
            </div>
          </div>
          
          {/* Features */}
          <div className="space-y-3">
            {plan.features.slice(0, 8).map((feature: any, index: number) => (
              <div key={index} className="flex items-center space-x-3">
                <Check 
                  className={`w-4 h-4 flex-shrink-0 ${
                    feature.included ? 'text-green-500' : 'text-muted-foreground/30'
                  }`} 
                />
                <span className={`text-sm ${
                  feature.included ? 'text-foreground' : 'text-muted-foreground line-through'
                }`}>
                  {feature.name}
                </span>
              </div>
            ))}
          </div>
          
          <Button 
            size="lg" 
            className={`w-full ${
              isPopular 
                ? 'ff-btn-primary ff-hover-glow' 
                : 'ff-btn-secondary'
            }`}
          >
            {plan.id === 'enterprise' ? 'Contact Sales' : 'Start Free Trial'}
          </Button>
          
          <div className="text-center">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary">
              View All Features
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ComparisonTable = ({ isYearly }: { isYearly: boolean }) => (
  <div className="overflow-x-auto">
    <div className="min-w-full">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="space-y-4">
          <div className="h-32 flex items-end">
            <h3 className="text-lg font-semibold">Features</h3>
          </div>
        </div>
        {pricingPlans.map((plan) => (
          <div key={plan.id} className="text-center space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold ff-text-gradient">{plan.name}</h3>
              <div className="text-2xl font-bold text-primary">
                ${isYearly ? Math.round(plan.price.yearly / 12) : plan.price.monthly}
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
            </div>
            <Button size="sm" variant={plan.id === 'professional' ? 'default' : 'outline'} className="w-full">
              {plan.id === 'enterprise' ? 'Contact Sales' : 'Get Started'}
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {/* Core Features */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Core Features
          </h4>
          <div className="space-y-3">
            {[
              'AI Tools Access',
              'Monthly Generations',
              'Project Limits',
              'Team Members',
              'Storage Space',
              'Email Support'
            ].map((feature) => (
              <div key={feature} className="grid grid-cols-4 gap-4 items-center py-2 border-b border-muted last:border-0">
                <div className="text-sm text-muted-foreground">{feature}</div>
                <div className="text-center text-sm">5 tools, 50/mo</div>
                <div className="text-center text-sm">25 tools, 500/mo</div>
                <div className="text-center text-sm">All tools, Unlimited</div>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Features */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Crown className="w-4 h-4" />
            Advanced Features
          </h4>
          <div className="space-y-3">
            {[
              'Advanced AI Models',
              'Priority Support',
              'Custom Integrations',
              'Team Collaboration',
              'White-label Solutions',
              'Enterprise Security'
            ].map((feature) => (
              <div key={feature} className="grid grid-cols-4 gap-4 items-center py-2 border-b border-muted last:border-0">
                <div className="text-sm text-muted-foreground">{feature}</div>
                <div className="text-center">
                  <AlertCircle className="w-4 h-4 text-muted-foreground/30 mx-auto" />
                </div>
                <div className="text-center">
                  <Check className="w-4 h-4 text-green-500 mx-auto" />
                </div>
                <div className="text-center">
                  <Check className="w-4 h-4 text-green-500 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedTab, setSelectedTab] = useState('plans');

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12 ff-stagger-fade">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 py-12"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <CreditCard className="w-10 h-10 text-primary" />
          <h1 className="ff-text-gradient text-4xl font-bold">
            Pricing Plans
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Choose the perfect plan for your needs. From individual creators to enterprise teams, we have transparent pricing for everyone.
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mt-8">
          <Label htmlFor="billing-toggle" className={!isYearly ? 'text-primary font-semibold' : 'text-muted-foreground'}>
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={isYearly}
            onCheckedChange={setIsYearly}
          />
          <Label htmlFor="billing-toggle" className={isYearly ? 'text-primary font-semibold' : 'text-muted-foreground'}>
            Yearly
          </Label>
          <Badge variant="secondary" className="ml-2">
            Save up to 25%
          </Badge>
        </div>
      </motion.div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="comparison">Compare</TabsTrigger>
          <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-12">
          {/* Pricing Cards */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {pricingPlans.map((plan, index) => (
              <PricingCard 
                key={plan.id}
                plan={plan}
                isYearly={isYearly}
                isPopular={index === 1}
              />
            ))}
          </div>

          {/* Add-ons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold ff-text-gradient">Add-Ons & Extras</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Extend your plan with additional features and resources as needed.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {addOns.map((addon, index) => {
                const Icon = addon.icon;
                return (
                  <Card key={index} className="ff-card-interactive text-center">
                    <CardHeader className="pb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{addon.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {addon.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary mb-4">
                        ${addon.price}/mo
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        Add to Plan
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="comparison" className="mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold ff-text-gradient">Feature Comparison</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Compare all features across our pricing plans to find what works best for you.
              </p>
            </div>
            
            <Card className="ff-card-interactive">
              <CardContent className="p-6">
                <ComparisonTable isYearly={isYearly} />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="enterprise" className="mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <Building2 className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold ff-text-gradient">Enterprise Solutions</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Custom solutions for large organizations with specific requirements and compliance needs.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {enterpriseFeatures.map((category, index) => (
                <Card key={index} className="ff-card-interactive">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="ff-card-interactive bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold ff-text-gradient">Ready to Scale?</h3>
                    <p className="text-muted-foreground">
                      Let's discuss how FlashFusion can transform your enterprise workflows.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="ff-btn-primary ff-hover-glow">
                      <Building2 className="w-5 h-5 mr-2" />
                      Contact Sales
                    </Button>
                    <Button size="lg" variant="outline" className="ff-focus-ring">
                      <Calendar className="w-5 h-5 mr-2" />
                      Schedule Demo
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-8 pt-6 border-t border-muted">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">99.9%</div>
                      <div className="text-sm text-muted-foreground">Uptime SLA</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">24/7</div>
                      <div className="text-sm text-muted-foreground">Support</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">SOC 2</div>
                      <div className="text-sm text-muted-foreground">Compliant</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 pt-12"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold ff-text-gradient">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about our pricing? We've got answers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              question: 'Can I change plans at any time?',
              answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated.'
            },
            {
              question: 'What happens if I exceed my limits?',
              answer: 'We\'ll notify you when approaching limits. You can upgrade or purchase add-ons to continue uninterrupted service.'
            },
            {
              question: 'Is there a free trial?',
              answer: 'Yes, all plans include a 14-day free trial with full access to features. No credit card required.'
            },
            {
              question: 'Do you offer refunds?',
              answer: 'We offer a 30-day money-back guarantee for all plans. Cancel within 30 days for a full refund.'
            },
            {
              question: 'Can I use my own AI models?',
              answer: 'Enterprise plans support custom AI model integration. Professional plans include access to select external models.'
            },
            {
              question: 'Is my data secure?',
              answer: 'Yes, we\'re SOC 2 Type II compliant with end-to-end encryption and enterprise-grade security measures.'
            }
          ].map((faq, index) => (
            <Card key={index} className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}