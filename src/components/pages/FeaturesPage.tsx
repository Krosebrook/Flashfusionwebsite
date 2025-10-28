import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Star, 
  Code, 
  ShoppingCart, 
  FileText, 
  Palette, 
  Smartphone, 
  Rocket, 
  Brain, 
  BarChart3,
  Check,
  Zap,
  Database,
  Globe,
  Shield,
  Users,
  GitBranch,
  Bot,
  Workflow,
  TrendingUp,
  Camera,
  Megaphone,
  Package,
  Monitor,
  CloudUpload,
  Target,
  Award,
  Search,
  Filter,
  X,
  ChevronDown,
  Clock,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

const featureModules = [
  {
    id: 'development',
    title: 'Development Tools',
    icon: Code,
    color: '#FF7B00',
    description: 'Complete full-stack development suite with AI-powered code generation',
    features: [
      {
        name: 'AI Code Generation',
        description: 'Generate production-ready code across 15+ frameworks',
        capabilities: ['React/Next.js', 'Vue/Nuxt.js', 'Angular', 'Svelte/SvelteKit', 'Node.js APIs', 'Python/Django', 'PHP/Laravel', 'Ruby/Rails']
      },
      {
        name: 'Repository Integration',
        description: 'Connect and analyze existing codebases for context-aware generation',
        capabilities: ['GitHub Integration', 'GitLab Support', 'Bitbucket Connect', 'Live Code Analysis', 'Architecture Recommendations']
      },
      {
        name: 'Full-Stack App Builder',
        description: 'Complete application scaffolding with database, auth, and deployment',
        capabilities: ['Database Schema Generation', 'Authentication Setup', 'API Route Creation', 'Frontend Components', 'Testing Suite']
      },
      {
        name: 'Code Review & Optimization',
        description: 'AI-powered code analysis and performance optimization',
        capabilities: ['Security Analysis', 'Performance Audits', 'Best Practices Check', 'Refactoring Suggestions', 'Documentation Generation']
      },
      {
        name: 'Multi-Language Support',
        description: 'Support for modern programming languages and frameworks',
        capabilities: ['TypeScript/JavaScript', 'Python', 'Go', 'Rust', 'Java/Kotlin', 'C#/.NET', 'Swift', 'Dart/Flutter']
      }
    ]
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Suite',
    icon: ShoppingCart,
    color: '#00B4D8',
    description: 'Complete e-commerce solution from store creation to marketplace management',
    features: [
      {
        name: 'Store Builder',
        description: 'AI-generated e-commerce stores with modern designs and functionality',
        capabilities: ['Shopify Integration', 'WooCommerce Setup', 'Custom Cart Systems', 'Payment Processing', 'Inventory Management']
      },
      {
        name: 'Product Catalog AI',
        description: 'Automated product descriptions, images, and SEO optimization',
        capabilities: ['Product Description AI', 'Image Generation', 'SEO Optimization', 'Price Optimization', 'Category Organization']
      },
      {
        name: 'Marketplace Integration',
        description: 'Multi-platform selling with automated listing management',
        capabilities: ['Amazon Seller Central', 'eBay Integration', 'Etsy Connect', 'Facebook Marketplace', 'Google Shopping']
      },
      {
        name: 'Print-on-Demand Hub',
        description: 'Complete POD business automation with design tools',
        capabilities: ['Design Suite', 'Printful Integration', 'Gooten Connect', 'Automated Listings', 'Order Fulfillment']
      },
      {
        name: 'Analytics & Insights',
        description: 'Advanced e-commerce analytics and business intelligence',
        capabilities: ['Revenue Tracking', 'Customer Analytics', 'Inventory Insights', 'Marketing ROI', 'Profit Optimization']
      }
    ]
  },
  {
    id: 'content',
    title: 'Content Creation',
    icon: FileText,
    color: '#E91E63',
    description: 'AI-powered content creation and management for all platforms',
    features: [
      {
        name: 'AI Content Generator',
        description: 'Generate high-quality content across multiple formats and platforms',
        capabilities: ['Blog Posts & Articles', 'Social Media Content', 'Email Campaigns', 'Video Scripts', 'Podcast Outlines']
      },
      {
        name: 'Brand Kit Generator',
        description: 'Complete brand identity creation with consistent assets',
        capabilities: ['Logo Design', 'Color Palettes', 'Typography Systems', 'Brand Guidelines', 'Asset Libraries']
      },
      {
        name: 'Multi-Platform Publishing',
        description: 'One-click publishing to all major content platforms',
        capabilities: ['WordPress Integration', 'Medium Publishing', 'LinkedIn Articles', 'Twitter Threads', 'YouTube Descriptions']
      },
      {
        name: 'Content Rights Management',
        description: 'Protect and monetize your content across platforms',
        capabilities: ['Copyright Protection', 'Usage Tracking', 'License Management', 'Revenue Attribution', 'Plagiarism Detection']
      },
      {
        name: 'SEO Optimization Suite',
        description: 'Advanced SEO tools for maximum content visibility',
        capabilities: ['Keyword Research', 'Content Optimization', 'Meta Tag Generation', 'Schema Markup', 'Performance Tracking']
      }
    ]
  },
  {
    id: 'design',
    title: 'Design Systems',
    icon: Palette,
    color: '#10B981',
    description: 'Complete design workflow from concept to production assets',
    features: [
      {
        name: 'AI Design Generator',
        description: 'Generate stunning designs for web, mobile, and print',
        capabilities: ['Web UI/UX Design', 'Mobile App Designs', 'Print Materials', 'Social Media Graphics', 'Brand Assets']
      },
      {
        name: 'Figma Integration',
        description: 'Seamless workflow between design and development',
        capabilities: ['Import Figma Designs', 'Convert to Code', 'Design System Sync', 'Component Library', 'Asset Export']
      },
      {
        name: 'Image Generation Suite',
        description: 'AI-powered image creation and editing capabilities',
        capabilities: ['DALL-E Integration', 'Midjourney Connect', 'Image Editing AI', 'Background Removal', 'Style Transfer']
      },
      {
        name: 'Design System Builder',
        description: 'Create and maintain consistent design systems',
        capabilities: ['Component Libraries', 'Design Tokens', 'Style Guides', 'Pattern Libraries', 'Documentation']
      },
      {
        name: 'Responsive Design Tools',
        description: 'Ensure perfect designs across all devices and platforms',
        capabilities: ['Mobile-First Design', 'Tablet Optimization', 'Desktop Layouts', 'Cross-Browser Testing', 'Accessibility Compliance']
      }
    ]
  },
  {
    id: 'mobile',
    title: 'Mobile Development',
    icon: Smartphone,
    color: '#F59E0B',
    description: 'Complete mobile app development and deployment pipeline',
    features: [
      {
        name: 'Native App Generation',
        description: 'Generate native iOS and Android applications',
        capabilities: ['React Native Apps', 'Flutter Development', 'Swift/SwiftUI', 'Kotlin/Compose', 'Xamarin Integration']
      },
      {
        name: 'Progressive Web Apps',
        description: 'Create fast, reliable PWAs with native-like experiences',
        capabilities: ['Service Workers', 'Offline Support', 'Push Notifications', 'App Install Prompts', 'Native API Access']
      },
      {
        name: 'Cross-Platform Tools',
        description: 'Build once, deploy everywhere with unified development',
        capabilities: ['Shared Codebase', 'Platform-Specific UI', 'Native Performance', 'Device Integration', 'App Store Deployment']
      },
      {
        name: 'Mobile Backend Services',
        description: 'Complete backend infrastructure for mobile applications',
        capabilities: ['User Authentication', 'Real-time Database', 'Push Notifications', 'File Storage', 'Analytics Integration']
      },
      {
        name: 'App Store Optimization',
        description: 'Maximize app visibility and downloads',
        capabilities: ['ASO Strategy', 'Keyword Optimization', 'Screenshot Generation', 'Description Writing', 'Review Management']
      }
    ]
  },
  {
    id: 'deployment',
    title: 'Deployment & DevOps',
    icon: Rocket,
    color: '#8B5CF6',
    description: 'Automated deployment and infrastructure management',
    features: [
      {
        name: 'Multi-Platform Deployment',
        description: 'Deploy to 8+ platforms with automated workflows',
        capabilities: ['Vercel Integration', 'Netlify Deploy', 'AWS Amplify', 'Heroku Pipeline', 'DigitalOcean Apps', 'Google Cloud Run', 'Azure Static Apps', 'Firebase Hosting']
      },
      {
        name: 'CI/CD Pipeline Builder',
        description: 'Automated testing, building, and deployment pipelines',
        capabilities: ['GitHub Actions', 'GitLab CI/CD', 'Jenkins Integration', 'Automated Testing', 'Quality Gates', 'Rollback Systems']
      },
      {
        name: 'Infrastructure as Code',
        description: 'Automated infrastructure provisioning and management',
        capabilities: ['Docker Containerization', 'Kubernetes Orchestration', 'Terraform Scripts', 'CloudFormation', 'Environment Management']
      },
      {
        name: 'Monitoring & Observability',
        description: 'Comprehensive application monitoring and performance tracking',
        capabilities: ['Application Monitoring', 'Error Tracking', 'Performance Metrics', 'Log Aggregation', 'Alert Management']
      },
      {
        name: 'Security & Compliance',
        description: 'Enterprise-grade security and compliance automation',
        capabilities: ['Security Scanning', 'Vulnerability Assessment', 'Compliance Checks', 'Secret Management', 'Access Control']
      }
    ]
  },
  {
    id: 'ai',
    title: 'AI & Automation',
    icon: Brain,
    color: '#EF4444',
    description: 'Advanced AI capabilities and intelligent automation workflows',
    features: [
      {
        name: 'Multi-Agent Orchestration',
        description: 'Coordinate multiple AI agents for complex workflows',
        capabilities: ['Agent Collaboration', 'Workflow Automation', 'Task Distribution', 'Performance Optimization', 'Real-time Coordination']
      },
      {
        name: 'Custom AI Models',
        description: 'Train and deploy custom AI models for specific use cases',
        capabilities: ['Model Training', 'Fine-tuning', 'Custom Datasets', 'Model Deployment', 'Performance Monitoring']
      },
      {
        name: 'AI Model Integration',
        description: 'Access to 8+ leading AI providers and models',
        capabilities: ['OpenAI GPT Models', 'Anthropic Claude', 'Google Gemini', 'GitHub Copilot', 'xAI Grok', 'DeepSeek Coder', 'Local Models']
      },
      {
        name: 'Intelligent Automation',
        description: 'Smart workflow automation with decision-making capabilities',
        capabilities: ['Process Automation', 'Decision Trees', 'Conditional Logic', 'Data Processing', 'API Orchestration']
      },
      {
        name: 'AI Trust & Validation',
        description: 'Ensure AI outputs meet quality and safety standards',
        capabilities: ['Output Validation', 'Quality Assurance', 'Bias Detection', 'Safety Checks', 'Compliance Monitoring']
      }
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics & Insights',
    icon: BarChart3,
    color: '#06B6D4',
    description: 'Comprehensive analytics and business intelligence platform',
    features: [
      {
        name: 'Business Intelligence Suite',
        description: 'Advanced analytics and reporting across all business metrics',
        capabilities: ['Custom Dashboards', 'Real-time Analytics', 'Predictive Insights', 'Revenue Tracking', 'Performance KPIs']
      },
      {
        name: 'User Behavior Analytics',
        description: 'Deep insights into user interactions and engagement',
        capabilities: ['User Journey Mapping', 'Conversion Tracking', 'A/B Testing', 'Heatmap Analysis', 'Session Recording']
      },
      {
        name: 'Marketing Analytics',
        description: 'Comprehensive marketing performance and ROI tracking',
        capabilities: ['Campaign Performance', 'Attribution Modeling', 'Customer Acquisition', 'Lifetime Value', 'Channel Analytics']
      },
      {
        name: 'Technical Performance',
        description: 'Monitor and optimize technical performance metrics',
        capabilities: ['Site Speed Analysis', 'Core Web Vitals', 'Error Monitoring', 'Uptime Tracking', 'Performance Optimization']
      },
      {
        name: 'Competitive Intelligence',
        description: 'Stay ahead with market and competitor insights',
        capabilities: ['Market Analysis', 'Competitor Tracking', 'Trend Identification', 'Opportunity Assessment', 'Strategic Planning']
      }
    ]
  }
];

const FeatureCard = ({ feature, moduleColor }: { feature: any, moduleColor: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="group"
  >
    <Card className="ff-card-interactive h-full hover:border-opacity-50 transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {feature.name}
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              {feature.description}
            </CardDescription>
          </div>
          <Badge 
            variant="secondary" 
            className="ff-badge-glow text-xs px-2 py-1"
            style={{ borderColor: moduleColor + '40', backgroundColor: moduleColor + '10' }}
          >
            {feature.capabilities.length} Features
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="grid gap-2">
            {feature.capabilities.map((capability: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-muted-foreground">{capability}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const ModuleOverview = ({ module }: { module: any }) => {
  const Icon = module.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-8"
    >
      <Card className="ff-card-interactive border-2" style={{ borderColor: module.color + '40' }}>
        <CardHeader className="pb-6">
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: module.color + '15' }}
            >
              <Icon className="w-8 h-8" style={{ color: module.color }} />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl ff-text-gradient">
                {module.title}
              </CardTitle>
              <CardDescription className="text-base leading-relaxed max-w-2xl">
                {module.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span>{module.features.length} Feature Sets</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>{module.features.reduce((acc: number, feature: any) => acc + feature.capabilities.length, 0)} Capabilities</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>Production Ready</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function FeaturesPage() {
  const [selectedModule, setSelectedModule] = useState('development');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const currentModule = featureModules.find(m => m.id === selectedModule);

  // Enhanced interactivity - filter features based on search
  const filteredFeatures = currentModule?.features.filter(feature => 
    feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feature.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feature.capabilities.some(cap => cap.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 ff-stagger-fade">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 py-12"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Star className="w-10 h-10 text-primary" />
          <h1 className="ff-text-gradient text-4xl font-bold">
            Platform Features
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Discover FlashFusion's comprehensive suite of AI-powered tools and features designed to revolutionize your development, content creation, and business workflows.
        </p>
        
        {/* Enhanced Stats with animations */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12"
        >
          {[
            { value: '60+', label: 'AI Tools', color: 'text-primary', icon: Bot },
            { value: '8', label: 'Core Modules', color: 'text-secondary', icon: Package },
            { value: '15+', label: 'Frameworks', color: 'text-accent', icon: Code },
            { value: '100%', label: 'Production Ready', color: 'text-green-500', icon: Check }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="text-center space-y-3 p-4 rounded-lg bg-card/50 border border-border/50 hover:border-primary/20 transition-all duration-300 ff-hover-lift"
            >
              <div className="flex items-center justify-center mb-2">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Enhanced Module Navigation with Search and Filters */}
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold ff-text-gradient">Explore Our Feature Modules</h2>
          
          {/* Search and Filter Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto space-y-4"
          >
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search features, capabilities, or technologies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 ff-focus-ring bg-card/50"
                />
                {searchTerm && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setSearchTerm('')}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="ff-focus-ring"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            
            {/* Quick Filter Badges */}
            <div className="flex flex-wrap gap-2 justify-center">
              {featureModules.map((module) => (
                <Badge
                  key={module.id}
                  variant={selectedModule === module.id ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedModule === module.id 
                      ? 'ff-badge-glow' 
                      : 'hover:border-primary/50 hover:bg-primary/5'
                  }`}
                  onClick={() => setSelectedModule(module.id)}
                  style={{
                    borderColor: selectedModule === module.id ? module.color : undefined,
                    backgroundColor: selectedModule === module.id ? module.color + '15' : undefined
                  }}
                >
                  <module.icon className="w-3 h-3 mr-1" />
                  {module.title}
                </Badge>
              ))}
            </div>

            {/* Search Results Info */}
            {searchTerm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted-foreground"
              >
                Found {filteredFeatures.length} feature{filteredFeatures.length !== 1 ? 's' : ''} matching "{searchTerm}"
              </motion.div>
            )}
          </motion.div>
        </div>
        
        <Tabs value={selectedModule} onValueChange={setSelectedModule} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 w-full h-auto p-2 bg-muted/50">
            {featureModules.map((module) => {
              const Icon = module.icon;
              return (
                <TabsTrigger
                  key={module.id}
                  value={module.id}
                  className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs font-medium text-center leading-tight">
                    {module.title.split(' ').join('\n')}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {featureModules.map((module) => (
            <TabsContent key={module.id} value={module.id} className="mt-8 space-y-8">
              <ModuleOverview module={module} />
              
              {/* Enhanced Feature Grid with Search Results */}
              <div className="space-y-6">
                {searchTerm && filteredFeatures.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 space-y-4"
                  >
                    <div className="w-16 h-16 mx-auto bg-muted/20 rounded-full flex items-center justify-center">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No features found</h3>
                    <p className="text-muted-foreground">
                      Try searching for different terms or explore other modules
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchTerm('')}
                      className="ff-focus-ring"
                    >
                      Clear Search
                    </Button>
                  </motion.div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {(searchTerm ? filteredFeatures : module.features).map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <FeatureCard 
                          feature={feature} 
                          moduleColor={module.color}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Module Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 p-6 bg-gradient-to-r from-card/50 to-card/30 rounded-lg border border-border/50"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-primary">
                        {(searchTerm ? filteredFeatures : module.features).length}
                      </div>
                      <div className="text-xs text-muted-foreground">Features</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-secondary">
                        {(searchTerm ? filteredFeatures : module.features).reduce((acc, f) => acc + f.capabilities.length, 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">Capabilities</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-accent">24/7</div>
                      <div className="text-xs text-muted-foreground">Availability</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-green-500">
                        <Sparkles className="w-6 h-6 inline" />
                      </div>
                      <div className="text-xs text-muted-foreground">AI Powered</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Integration Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-16 py-12"
      >
        <Card className="ff-card-interactive bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader className="text-center pb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Workflow className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl ff-text-gradient">
                Seamless Integration Ecosystem
              </CardTitle>
            </div>
            <CardDescription className="text-lg max-w-3xl mx-auto">
              All FlashFusion modules work together seamlessly, creating a unified workflow from idea to deployment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <div className="font-semibold">Unified Data</div>
                  <div className="text-sm text-muted-foreground">Shared data across all modules</div>
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <div className="space-y-1">
                  <div className="font-semibold">Team Collaboration</div>
                  <div className="text-sm text-muted-foreground">Real-time team workflows</div>
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <div className="space-y-1">
                  <div className="font-semibold">Enterprise Security</div>
                  <div className="text-sm text-muted-foreground">SOC 2 compliant infrastructure</div>
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto">
                  <CloudUpload className="w-6 h-6 text-green-500" />
                </div>
                <div className="space-y-1">
                  <div className="font-semibold">Auto Deployment</div>
                  <div className="text-sm text-muted-foreground">One-click deployment to any platform</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 py-12"
      >
        <h2 className="text-3xl font-bold ff-text-gradient">
          Ready to Transform Your Workflow?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join thousands of developers, creators, and businesses using FlashFusion to build the future.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button size="lg" className="ff-btn-primary ff-hover-glow px-8">
            <Zap className="w-5 h-5 mr-2" />
            Start Free Trial
          </Button>
          <Button size="lg" variant="outline" className="ff-focus-ring px-8">
            <Monitor className="w-5 h-5 mr-2" />
            Watch Demo
          </Button>
        </div>
      </motion.div>
    </div>
  );
}