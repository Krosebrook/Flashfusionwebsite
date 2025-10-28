import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Brain, 
  Code, 
  ShoppingCart,
  FileText,
  Palette, 
  Smartphone,
  Rocket, 
  BarChart3,
  Check,
  Zap,
  Star,
  Award,
  Target,
  TrendingUp
} from 'lucide-react';

export function FeaturesSection() {
  const [activeCategory, setActiveCategory] = useState('development');

  const featureModules = [
    {
      id: 'development',
      name: 'Development',
      icon: Code,
      color: 'text-primary',
      description: 'Full-stack development suite',
      highlight: '15+ Frameworks'
    },
    {
      id: 'ecommerce',
      name: 'E-commerce',
      icon: ShoppingCart,
      color: 'text-secondary',
      description: 'Complete commerce solution',
      highlight: 'Multi-Platform'
    },
    {
      id: 'content',
      name: 'Content',
      icon: FileText,
      color: 'text-accent',
      description: 'AI content creation',
      highlight: 'Brand Kit'
    },
    {
      id: 'design',
      name: 'Design',
      icon: Palette,
      color: 'text-primary',
      description: 'Design systems & UI',
      highlight: 'Figma Sync'
    },
    {
      id: 'mobile',
      name: 'Mobile',
      icon: Smartphone,
      color: 'text-secondary',
      description: 'Native & PWA apps',
      highlight: 'Cross-Platform'
    },
    {
      id: 'deployment',
      name: 'Deployment',
      icon: Rocket,
      color: 'text-accent',
      description: 'Automated deployment',
      highlight: '8+ Platforms'
    },
    {
      id: 'ai',
      name: 'AI & Automation',
      icon: Brain,
      color: 'text-primary',
      description: 'Advanced AI capabilities',
      highlight: 'Multi-Agent'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: BarChart3,
      color: 'text-secondary',
      description: 'Business intelligence',
      highlight: 'Real-time'
    }
  ];

  const moduleFeatures = {
    development: [
      {
        title: 'AI Code Generation',
        description: 'Generate production-ready code across 15+ frameworks with natural language',
        capabilities: ['React/Next.js', 'Vue/Nuxt', 'Angular', 'Svelte', 'Node.js APIs', 'Python/Django'],
        icon: Brain
      },
      {
        title: 'Repository Integration',
        description: 'Connect GitHub, GitLab, and Bitbucket for context-aware code generation',
        capabilities: ['Live Analysis', 'Architecture Recommendations', 'Code Reviews', 'Performance Audits'],
        icon: Code
      },
      {
        title: 'Full-Stack Builder',
        description: 'Complete application scaffolding with database, auth, and deployment setup',
        capabilities: ['Database Schema', 'Authentication', 'API Routes', 'Testing Suite'],
        icon: Zap
      }
    ],
    ecommerce: [
      {
        title: 'Store Builder AI',
        description: 'Generate complete e-commerce stores with modern designs and functionality',
        capabilities: ['Shopify Integration', 'WooCommerce', 'Payment Processing', 'Inventory Management'],
        icon: ShoppingCart
      },
      {
        title: 'Print-on-Demand Hub',
        description: 'Complete POD business automation with design tools and marketplace integration',
        capabilities: ['Design Suite', 'Printful Integration', 'Automated Listings', 'Order Fulfillment'],
        icon: Palette
      },
      {
        title: 'Marketplace Connect',
        description: 'Multi-platform selling with automated listing management',
        capabilities: ['Amazon Seller', 'eBay Integration', 'Etsy Connect', 'Facebook Marketplace'],
        icon: Target
      }
    ],
    content: [
      {
        title: 'AI Content Generator',
        description: 'Generate high-quality content across multiple formats and platforms',
        capabilities: ['Blog Posts', 'Social Media', 'Email Campaigns', 'Video Scripts'],
        icon: FileText
      },
      {
        title: 'Brand Kit Generator',
        description: 'Complete brand identity creation with consistent assets and guidelines',
        capabilities: ['Logo Design', 'Color Palettes', 'Typography Systems', 'Brand Guidelines'],
        icon: Palette
      },
      {
        title: 'Multi-Platform Publishing',
        description: 'One-click publishing to all major content platforms',
        capabilities: ['WordPress', 'Medium', 'LinkedIn Articles', 'Twitter Threads'],
        icon: Rocket
      }
    ],
    design: [
      {
        title: 'AI Design Generator',
        description: 'Generate stunning designs for web, mobile, and print applications',
        capabilities: ['Web UI/UX', 'Mobile Designs', 'Print Materials', 'Social Graphics'],
        icon: Palette
      },
      {
        title: 'Figma Integration',
        description: 'Seamless workflow between design and development with real-time sync',
        capabilities: ['Import Designs', 'Convert to Code', 'Component Library', 'Asset Export'],
        icon: Code
      },
      {
        title: 'Design System Builder',
        description: 'Create and maintain consistent design systems across projects',
        capabilities: ['Component Libraries', 'Design Tokens', 'Style Guides', 'Documentation'],
        icon: Award
      }
    ],
    mobile: [
      {
        title: 'Native App Generation',
        description: 'Generate native iOS and Android applications with platform optimization',
        capabilities: ['React Native', 'Flutter', 'Swift/SwiftUI', 'Kotlin/Compose'],
        icon: Smartphone
      },
      {
        title: 'Progressive Web Apps',
        description: 'Create fast, reliable PWAs with native-like experiences',
        capabilities: ['Service Workers', 'Offline Support', 'Push Notifications', 'App Install'],
        icon: Zap
      },
      {
        title: 'App Store Optimization',
        description: 'Maximize app visibility and downloads with ASO tools',
        capabilities: ['ASO Strategy', 'Keyword Optimization', 'Screenshot Generation', 'Review Management'],
        icon: TrendingUp
      }
    ],
    deployment: [
      {
        title: 'Multi-Platform Deploy',
        description: 'Deploy to 8+ platforms with automated workflows and monitoring',
        capabilities: ['Vercel', 'Netlify', 'AWS Amplify', 'Heroku', 'DigitalOcean', 'Google Cloud'],
        icon: Rocket
      },
      {
        title: 'CI/CD Pipeline Builder',
        description: 'Automated testing, building, and deployment with quality gates',
        capabilities: ['GitHub Actions', 'GitLab CI/CD', 'Automated Testing', 'Quality Gates'],
        icon: Target
      },
      {
        title: 'Infrastructure as Code',
        description: 'Automated infrastructure provisioning and management',
        capabilities: ['Docker', 'Kubernetes', 'Terraform', 'Environment Management'],
        icon: Code
      }
    ],
    ai: [
      {
        title: 'Multi-Agent Orchestration',
        description: 'Coordinate multiple AI agents for complex workflows and automation',
        capabilities: ['Agent Collaboration', 'Workflow Automation', 'Task Distribution', 'Performance Optimization'],
        icon: Brain
      },
      {
        title: 'AI Model Integration',
        description: 'Access to 8+ leading AI providers and models for diverse capabilities',
        capabilities: ['OpenAI GPT', 'Anthropic Claude', 'Google Gemini', 'GitHub Copilot'],
        icon: Zap
      },
      {
        title: 'Custom AI Training',
        description: 'Train and deploy custom AI models for specific use cases',
        capabilities: ['Model Training', 'Fine-tuning', 'Custom Datasets', 'Performance Monitoring'],
        icon: Award
      }
    ],
    analytics: [
      {
        title: 'Business Intelligence Suite',
        description: 'Advanced analytics and reporting across all business metrics',
        capabilities: ['Custom Dashboards', 'Real-time Analytics', 'Predictive Insights', 'Revenue Tracking'],
        icon: BarChart3
      },
      {
        title: 'User Behavior Analytics',
        description: 'Deep insights into user interactions and engagement patterns',
        capabilities: ['User Journey Mapping', 'Conversion Tracking', 'A/B Testing', 'Heatmap Analysis'],
        icon: Target
      },
      {
        title: 'Performance Monitoring',
        description: 'Monitor and optimize technical performance across all platforms',
        capabilities: ['Site Speed', 'Core Web Vitals', 'Error Monitoring', 'Uptime Tracking'],
        icon: TrendingUp
      }
    ]
  };

  const stats = [
    { value: '60+', label: 'AI Tools', icon: Brain },
    { value: '15+', label: 'Frameworks', icon: Code },
    { value: '8+', label: 'Deploy Platforms', icon: Rocket },
    { value: '100%', label: 'Production Ready', icon: Star }
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
            Complete Development Platform
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Everything you need to build, deploy, and scale modern applications with AI-powered tools and automation.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Module Navigation and Content */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          {/* Module Navigation */}
          <div className="mb-12 overflow-x-auto">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 h-auto p-2 bg-muted/50">
              {featureModules.map((module) => (
                <TabsTrigger
                  key={module.id}
                  value={module.id}
                  className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <module.icon className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium text-xs">{module.name}</div>
                    <div className="text-xs text-muted-foreground hidden lg:block">
                      {module.highlight}
                    </div>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Module Content */}
          {featureModules.map((module) => (
            <TabsContent key={module.id} value={module.id} className="space-y-8">
              {/* Module Header */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mb-8"
              >
                <Card className="ff-card-interactive border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                        <module.icon className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-2xl font-bold ff-text-gradient">{module.name}</h3>
                        <p className="text-muted-foreground">{module.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="ff-badge-glow">
                      {module.highlight} • Production Ready
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Feature Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              >
                {moduleFeatures[module.id as keyof typeof moduleFeatures]?.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="ff-card-interactive h-full hover:border-primary/30 transition-all duration-300">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <feature.icon className="w-6 h-6 text-primary" />
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {feature.capabilities.length} Features
                          </Badge>
                        </div>
                        <CardTitle className="text-lg leading-tight">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                        <div className="space-y-2">
                          {feature.capabilities.slice(0, 4).map((capability, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-muted-foreground">{capability}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Integration CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <Card className="ff-card-interactive bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
            <CardContent className="p-12">
              <div className="space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold ff-text-gradient">
                  Ready to Transform Your Workflow?
                </h3>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of developers, creators, and businesses using FlashFusion to build the future.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <Button size="lg" className="ff-btn-primary ff-hover-glow px-8">
                    <Star className="w-5 h-5 mr-2" />
                    Start Free Trial
                  </Button>
                  <Button size="lg" variant="outline" className="ff-focus-ring px-8">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    View All Features
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-muted">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary">No Setup</div>
                    <div className="text-sm text-muted-foreground">Start building instantly</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-secondary">14-Day Trial</div>
                    <div className="text-sm text-muted-foreground">Full feature access</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-accent">No Credit Card</div>
                    <div className="text-sm text-muted-foreground">Risk-free trial</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-500">24/7 Support</div>
                    <div className="text-sm text-muted-foreground">Always here to help</div>
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