import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Code, 
  Palette, 
  BarChart3,
  Settings,
  Users,
  Play,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export function ScreenshotsSection() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentScreenshot, setCurrentScreenshot] = useState(0);

  const screenshotCategories = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: Monitor,
      description: 'Main development interface'
    },
    {
      id: 'ai-tools',
      name: 'AI Tools',
      icon: Code,
      description: 'AI-powered development tools'
    },
    {
      id: 'design',
      name: 'Design System',
      icon: Palette,
      description: 'UI/UX design capabilities'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: BarChart3,
      description: 'Performance insights'
    },
    {
      id: 'collaboration',
      name: 'Collaboration',
      icon: Users,
      description: 'Team features'
    },
    {
      id: 'mobile',
      name: 'Mobile',
      icon: Smartphone,
      description: 'Mobile-responsive design'
    }
  ];

  const screenshots = {
    dashboard: [
      {
        title: 'Main Dashboard',
        description: 'Overview of projects, XP progress, and daily tasks',
        image: 'dashboard main interface',
        features: ['Project Overview', 'XP Progress', 'Daily Tasks', 'Quick Actions']
      },
      {
        title: 'Project Management',
        description: 'Manage all your projects with AI-powered insights',
        image: 'project management interface',
        features: ['Project List', 'Status Tracking', 'AI Recommendations', 'Team Collaboration']
      },
      {
        title: 'Gamification System',
        description: 'Level up with XP, achievements, and leaderboards',
        image: 'gamification dashboard',
        features: ['XP System', 'Achievements', 'Leaderboards', 'Daily Challenges']
      }
    ],
    'ai-tools': [
      {
        title: 'Code Generation',
        description: 'Natural language to code with AI assistance',
        image: 'ai code generation interface',
        features: ['Natural Language Input', 'Code Generation', 'Multi-language Support', 'Real-time Preview']
      },
      {
        title: 'AI Code Review',
        description: 'Intelligent code analysis and improvement suggestions',
        image: 'ai code review interface',
        features: ['Code Analysis', 'Security Scanning', 'Performance Tips', 'Best Practices']
      },
      {
        title: 'Smart Documentation',
        description: 'Automated documentation generation with AI',
        image: 'ai documentation interface',
        features: ['Auto Documentation', 'API Docs', 'Code Comments', 'README Generation']
      }
    ],
    design: [
      {
        title: 'UI Generator',
        description: 'AI-powered UI component generation',
        image: 'ui generator interface',
        features: ['Component Library', 'Design System', 'Responsive Design', 'Theme Customization']
      },
      {
        title: 'Design System Builder',
        description: 'Create comprehensive design systems automatically',
        image: 'design system interface',
        features: ['Design Tokens', 'Component Variants', 'Color Palettes', 'Typography']
      },
      {
        title: 'Responsive Preview',
        description: 'See your designs across all device sizes',
        image: 'responsive preview interface',
        features: ['Multi-device Preview', 'Breakpoint Testing', 'Interactive Elements', 'Performance Metrics']
      }
    ],
    analytics: [
      {
        title: 'Performance Dashboard',
        description: 'Comprehensive application performance metrics',
        image: 'analytics dashboard interface',
        features: ['Performance Metrics', 'User Analytics', 'Error Tracking', 'Usage Statistics']
      },
      {
        title: 'Development Insights',
        description: 'Track your coding progress and productivity',
        image: 'development analytics interface',
        features: ['Coding Activity', 'Productivity Metrics', 'Learning Progress', 'Goal Tracking']
      },
      {
        title: 'Team Analytics',
        description: 'Monitor team performance and collaboration',
        image: 'team analytics interface',
        features: ['Team Performance', 'Collaboration Metrics', 'Project Velocity', 'Resource Utilization']
      }
    ],
    collaboration: [
      {
        title: 'Real-time Editing',
        description: 'Collaborate in real-time with live cursors',
        image: 'real-time collaboration interface',
        features: ['Live Cursors', 'Real-time Sync', 'Comment System', 'Version History']
      },
      {
        title: 'Team Workspace',
        description: 'Organize projects and manage team access',
        image: 'team workspace interface',
        features: ['Team Organization', 'Role Management', 'Shared Resources', 'Permission Control']
      },
      {
        title: 'Code Reviews',
        description: 'Collaborative code review workflow',
        image: 'code review interface',
        features: ['Review Workflow', 'Inline Comments', 'Approval Process', 'Merge Management']
      }
    ],
    mobile: [
      {
        title: 'Mobile Dashboard',
        description: 'Full dashboard experience on mobile devices',
        image: 'mobile dashboard interface',
        features: ['Touch Optimized', 'Responsive Layout', 'Mobile Navigation', 'Quick Actions']
      },
      {
        title: 'Mobile Code Editor',
        description: 'Edit code efficiently on mobile devices',
        image: 'mobile code editor interface',
        features: ['Mobile Editor', 'Syntax Highlighting', 'Auto-complete', 'Touch Gestures']
      },
      {
        title: 'Mobile Preview',
        description: 'Preview your applications on actual mobile devices',
        image: 'mobile preview interface',
        features: ['Device Preview', 'Touch Testing', 'Performance Testing', 'Network Simulation']
      }
    ]
  };

  const currentScreenshots = screenshots[activeTab as keyof typeof screenshots];

  const nextScreenshot = () => {
    setCurrentScreenshot((prev) => (prev + 1) % currentScreenshots.length);
  };

  const prevScreenshot = () => {
    setCurrentScreenshot((prev) => (prev - 1 + currentScreenshots.length) % currentScreenshots.length);
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 ff-text-gradient">
            See FlashFusion in Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our intuitive interface and powerful features designed to accelerate your development workflow.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {screenshotCategories.map((category) => (
            <Button
              key={category.id}
              variant={activeTab === category.id ? "default" : "outline"}
              onClick={() => {
                setActiveTab(category.id);
                setCurrentScreenshot(0);
              }}
              className={`flex items-center gap-2 ${activeTab === category.id ? 'ff-btn-primary' : ''}`}
            >
              <category.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{category.name}</span>
            </Button>
          ))}
        </motion.div>

        {/* Screenshot Display */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
        >
          {/* Main Screenshot */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-secondary/10">
                  {/* Placeholder for actual screenshot */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Monitor className="w-24 h-24 text-primary/30 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">
                        {currentScreenshots[currentScreenshot].title}
                      </h3>
                      <p className="text-muted-foreground">
                        {currentScreenshots[currentScreenshot].description}
                      </p>
                      <Button className="mt-4 ff-btn-primary">
                        <Play className="w-4 h-4 mr-2" />
                        View Live Demo
                      </Button>
                    </div>
                  </div>

                  {/* Navigation Controls */}
                  {currentScreenshots.length > 1 && (
                    <>
                      <button
                        onClick={prevScreenshot}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextScreenshot}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Screenshot Indicators */}
                  {currentScreenshots.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {currentScreenshots.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentScreenshot(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            currentScreenshot === index ? 'bg-primary' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features List */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">Key Features</h4>
                <div className="space-y-3">
                  {currentScreenshots[currentScreenshot].features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">Quick Actions</h4>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Try Live Demo
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Tutorial
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    View Documentation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* All Screenshots Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-center mb-8">
            Explore All Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentScreenshots.map((screenshot, index) => (
              <motion.div
                key={screenshot.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setCurrentScreenshot(index)}
                className="cursor-pointer"
              >
                <Card className={`ff-card-interactive ${currentScreenshot === index ? 'ring-2 ring-primary' : ''}`}>
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg mb-3 flex items-center justify-center">
                      <Monitor className="w-8 h-8 text-primary/40" />
                    </div>
                    <h4 className="font-semibold mb-1">{screenshot.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{screenshot.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {screenshot.features.slice(0, 2).map((feature, featureIndex) => (
                        <Badge key={featureIndex} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {screenshot.features.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{screenshot.features.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Interactive Demo CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16 p-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg"
        >
          <h4 className="text-2xl font-bold mb-4">Experience FlashFusion Yourself</h4>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Ready to see how FlashFusion can transform your development workflow? 
            Try our interactive demo or start building your first project for free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="ff-btn-primary px-8 py-3">
              <Play className="w-4 h-4 mr-2" />
              Try Interactive Demo
            </Button>
            <Button className="ff-btn-secondary px-8 py-3">
              <Code className="w-4 h-4 mr-2" />
              Start Building Now
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}