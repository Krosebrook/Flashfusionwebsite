import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { Check, X, Star, Zap, Crown, Building2, Shield, Users } from 'lucide-react';

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Starter",
      icon: Zap,
      price: { monthly: 29, yearly: 290 },
      originalPrice: { monthly: null, yearly: 348 },
      description: "Perfect for individual creators and small projects",
      popular: true,
      highlight: false,
      badge: "Most Popular",
      badgeColor: "bg-primary",
      features: [
        { name: "5 AI Tools Access", included: true, detail: "Core development tools" },
        { name: "50 Generations/Month", included: true, detail: "AI-powered outputs" },
        { name: "Basic Templates", included: true, detail: "Starter project templates" },
        { name: "1 Project", included: true, detail: "Active project limit" },
        { name: "Email Support", included: true, detail: "Standard response time" },
        { name: "Community Access", included: true, detail: "Discord community" },
        { name: "Standard Deployment", included: true, detail: "5 deployments/month" },
        { name: "Advanced AI Models", included: false },
        { name: "Team Collaboration", included: false },
        { name: "Priority Support", included: false },
        { name: "Custom Integrations", included: false },
        { name: "White-label Solutions", included: false }
      ],
      limits: {
        projects: 1,
        aiGenerations: 50,
        teamMembers: 1,
        storage: "5GB",
        deployments: 5
      }
    },
    {
      name: "Professional",
      icon: Crown,
      price: { monthly: 79, yearly: 790 },
      originalPrice: { monthly: null, yearly: 948 },
      description: "Ideal for growing businesses and professional developers",
      popular: false,
      highlight: true,
      badge: "Recommended",
      badgeColor: "bg-secondary",
      features: [
        { name: "25 AI Tools Access", included: true, detail: "Advanced development suite" },
        { name: "500 Generations/Month", included: true, detail: "High-volume AI outputs" },
        { name: "Premium Templates", included: true, detail: "Professional templates" },
        { name: "10 Projects", included: true, detail: "Multiple active projects" },
        { name: "Priority Support", included: true, detail: "Email & chat support" },
        { name: "Discord + Community", included: true, detail: "Premium community access" },
        { name: "Advanced Deployment", included: true, detail: "25 deployments/month" },
        { name: "Advanced AI Models", included: true, detail: "GPT-4, Claude access" },
        { name: "5 Team Members", included: true, detail: "Collaborative workflows" },
        { name: "Basic Integrations", included: true, detail: "Popular tool integrations" },
        { name: "API Access", included: true, detail: "REST API access" },
        { name: "White-label Solutions", included: false }
      ],
      limits: {
        projects: 10,
        aiGenerations: 500,
        teamMembers: 5,
        storage: "50GB",
        deployments: 25
      }
    },
    {
      name: "Enterprise",
      icon: Building2,
      price: { monthly: 199, yearly: 1990 },
      originalPrice: { monthly: null, yearly: 2388 },
      description: "Complete solution for large teams and enterprises",
      popular: false,
      highlight: false,
      badge: "Full Access",
      badgeColor: "bg-accent",
      features: [
        { name: "All 60+ AI Tools", included: true, detail: "Complete AI toolkit" },
        { name: "Unlimited Generations", included: true, detail: "No limits on AI outputs" },
        { name: "Custom Templates", included: true, detail: "Branded templates" },
        { name: "Unlimited Projects", included: true, detail: "No project limits" },
        { name: "24/7 Priority Support", included: true, detail: "Dedicated support team" },
        { name: "Private Community", included: true, detail: "Exclusive enterprise community" },
        { name: "Enterprise Deployment", included: true, detail: "Unlimited deployments" },
        { name: "All AI Models", included: true, detail: "Access to all AI providers" },
        { name: "Unlimited Team Members", included: true, detail: "Scale your team" },
        { name: "Custom Integrations", included: true, detail: "Bespoke integrations" },
        { name: "Full API Access", included: true, detail: "Complete API suite" },
        { name: "White-label Solutions", included: true, detail: "Brand customization" }
      ],
      limits: {
        projects: "Unlimited",
        aiGenerations: "Unlimited",
        teamMembers: "Unlimited",
        storage: "500GB",
        deployments: "Unlimited"
      }
    }
  ];

  const savings = {
    starter: 17, // (348 - 290) / 348 * 100
    professional: 17, // (948 - 790) / 948 * 100
    enterprise: 17 // (2388 - 1990) / 2388 * 100
  };

  const features = [
    {
      category: "Development Tools",
      items: [
        { name: "AI Code Generation", starter: "Basic", pro: "Advanced", enterprise: "Full Access" },
        { name: "Framework Support", starter: "5 frameworks", pro: "10+ frameworks", enterprise: "15+ frameworks" },
        { name: "Repository Integration", starter: "❌", pro: "GitHub only", enterprise: "All platforms" },
        { name: "Code Review AI", starter: "❌", pro: "✅", enterprise: "✅ + Custom Rules" },
        { name: "Full-Stack Builder", starter: "❌", pro: "✅", enterprise: "✅ + Enterprise Features" }
      ]
    },
    {
      category: "AI & Automation",
      items: [
        { name: "AI Models Access", starter: "3 models", pro: "6 models", enterprise: "8+ models" },
        { name: "Multi-Agent Orchestration", starter: "❌", pro: "Basic", enterprise: "Advanced" },
        { name: "Custom AI Training", starter: "❌", pro: "❌", enterprise: "✅" },
        { name: "Workflow Automation", starter: "❌", pro: "✅", enterprise: "✅ + Custom" },
        { name: "API Integrations", starter: "❌", pro: "Basic", enterprise: "Unlimited" }
      ]
    },
    {
      category: "Collaboration & Support",
      items: [
        { name: "Team Members", starter: "1", pro: "5", enterprise: "Unlimited" },
        { name: "Support Level", starter: "Email", pro: "Priority", enterprise: "24/7 Dedicated" },
        { name: "SLA Guarantee", starter: "❌", pro: "99.5%", enterprise: "99.9%" },
        { name: "Training & Onboarding", starter: "Self-service", pro: "Group sessions", enterprise: "1-on-1 + Custom" },
        { name: "Account Management", starter: "❌", pro: "❌", enterprise: "Dedicated CSM" }
      ]
    }
  ];

  const enterpriseFeatures = [
    "SOC 2 Type II Compliance",
    "Custom SSO Integration", 
    "Advanced Audit Logs",
    "Private Cloud Deployment",
    "Custom AI Model Training",
    "Dedicated Infrastructure",
    "99.9% Uptime SLA",
    "24/7 Premium Support"
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 ff-text-gradient">
            Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Start free and scale as you grow. All plans include core AI tools, real outputs, and our gamification system.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Label htmlFor="billing" className={!isYearly ? 'font-semibold text-primary' : 'text-muted-foreground'}>
              Monthly
            </Label>
            <Switch
              id="billing"
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <Label htmlFor="billing" className={isYearly ? 'font-semibold text-primary' : 'text-muted-foreground'}>
              Yearly
            </Label>
            <Badge variant="secondary" className="ml-2 ff-badge-glow">
              Save 17%
            </Badge>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price = isYearly ? plan.price.yearly : plan.price.monthly;
            const monthlyPrice = isYearly ? price / 12 : price;
            const originalPrice = isYearly ? plan.originalPrice.yearly : plan.originalPrice.monthly;
            const savingsPercent = isYearly ? savings[plan.name.toLowerCase() as keyof typeof savings] : 0;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${plan.highlight ? 'z-10 scale-105' : ''}`}
              >
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-white text-sm font-medium ${plan.badgeColor}`}>
                    {plan.badge}
                  </div>
                )}
                
                <Card className={`h-full ${plan.highlight ? 'ring-2 ring-primary shadow-xl ff-hover-glow' : 'ff-card-interactive'}`}>
                  <CardHeader className="text-center pb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    
                    <CardTitle className="text-2xl ff-text-gradient mb-2">
                      {plan.name}
                    </CardTitle>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-baseline justify-center space-x-1">
                        <span className="text-4xl font-bold text-primary">
                          ${Math.round(monthlyPrice)}
                        </span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      
                      {isYearly && savingsPercent > 0 && (
                        <div className="flex items-center justify-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            Save {savingsPercent}%
                          </Badge>
                          {originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              ${Math.round(originalPrice / 12)}/mo
                            </span>
                          )}
                        </div>
                      )}
                      
                      {isYearly && (
                        <div className="text-sm text-muted-foreground">
                          Billed annually (${price})
                        </div>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-6">
                    {/* Key Limits */}
                    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Projects</span>
                        <span className="font-medium">{plan.limits.projects}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">AI Generations</span>
                        <span className="font-medium">{plan.limits.aiGenerations}/mo</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Team Size</span>
                        <span className="font-medium">{plan.limits.teamMembers}</span>
                      </div>
                    </div>

                    <Button 
                      size="lg" 
                      className={`w-full ${
                        plan.highlight 
                          ? 'ff-btn-primary ff-hover-glow' 
                          : plan.name === 'Enterprise' 
                            ? 'ff-btn-accent' 
                            : 'ff-btn-secondary'
                      }`}
                    >
                      {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                    </Button>
                    
                    {/* Features List */}
                    <div className="space-y-3">
                      {plan.features.slice(0, 8).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-3">
                          <Check 
                            className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                              feature.included ? 'text-green-500' : 'text-muted-foreground/30'
                            }`} 
                          />
                          <div className={`text-sm ${
                            feature.included ? 'text-foreground' : 'text-muted-foreground line-through'
                          }`}>
                            <div>{feature.name}</div>
                            {feature.detail && feature.included && (
                              <div className="text-xs text-muted-foreground">{feature.detail}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-center pt-4 border-t border-muted">
                      <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary">
                        View All Features
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-bold ff-text-gradient">
              Compare All Features
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See exactly what's included in each plan to make the right choice for your needs.
            </p>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-full space-y-8">
              {features.map((category, categoryIndex) => (
                <Card key={categoryIndex} className="ff-card-interactive">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="font-semibold text-muted-foreground">Feature</div>
                      <div className="font-semibold text-center">Starter</div>
                      <div className="font-semibold text-center">Professional</div>
                      <div className="font-semibold text-center">Enterprise</div>
                      
                      {category.items.map((item, itemIndex) => (
                        <React.Fragment key={itemIndex}>
                          <div className="py-2 text-sm">{item.name}</div>
                          <div className="py-2 text-center text-sm text-muted-foreground">{item.starter}</div>
                          <div className="py-2 text-center text-sm text-muted-foreground">{item.pro}</div>
                          <div className="py-2 text-center text-sm text-muted-foreground">{item.enterprise}</div>
                        </React.Fragment>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Enterprise Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <Card className="ff-card-interactive bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
            <CardContent className="p-12 text-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                    <Building2 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold ff-text-gradient">
                    Enterprise-Grade Security
                  </h3>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Built for large organizations with strict security and compliance requirements.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {enterpriseFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-muted-foreground text-left">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="ff-btn-primary ff-hover-glow">
                    <Building2 className="w-5 h-5 mr-2" />
                    Schedule Demo
                  </Button>
                  <Button size="lg" variant="outline" className="ff-focus-ring">
                    <Users className="w-5 h-5 mr-2" />
                    Contact Sales
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="ff-card-interactive bg-green-500/5 border-green-500/20">
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto">
                  <Shield className="w-6 h-6 text-green-500" />
                </div>
                <h4 className="text-xl font-semibold">30-Day Money-Back Guarantee</h4>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Try FlashFusion risk-free for 30 days. If you're not completely satisfied with the results, 
                  we'll refund every penny. No questions asked.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary">14-Day Trial</div>
                    <div className="text-sm text-muted-foreground">Full feature access</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-secondary">No Credit Card</div>
                    <div className="text-sm text-muted-foreground">Required for trial</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-accent">Cancel Anytime</div>
                    <div className="text-sm text-muted-foreground">No long-term commitment</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

export default PricingSection;