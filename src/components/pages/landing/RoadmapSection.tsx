import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  CheckCircle, 
  Clock, 
  Target, 
  Brain, 
  Smartphone, 
  Globe, 
  Shield, 
  Zap,
  Users,
  Code,
  Palette,
  Database
} from 'lucide-react';

export function RoadmapSection() {
  const roadmapItems = [
    {
      quarter: "Q4 2024",
      status: "completed",
      progress: 100,
      icon: CheckCircle,
      title: "Foundation & Core Features",
      description: "Complete platform launch with essential AI tools",
      features: [
        "60+ AI development tools",
        "Multi-platform deployment",
        "Gamification system",
        "Real-time collaboration",
        "Enterprise security"
      ],
      color: "text-green-500"
    },
    {
      quarter: "Q1 2025",
      status: "in-progress",
      progress: 75,
      icon: Zap,
      title: "Enhanced AI Capabilities",
      description: "Advanced AI features and improved user experience",
      features: [
        "GPT-4 Turbo integration",
        "Advanced code review AI",
        "Natural language to app",
        "AI-powered testing",
        "Smart deployment optimization"
      ],
      color: "text-primary"
    },
    {
      quarter: "Q2 2025",
      status: "planned",
      progress: 0,
      icon: Smartphone,
      title: "Mobile Development Suite",
      description: "Native mobile app development with React Native and Flutter",
      features: [
        "React Native generation",
        "Flutter code creation",
        "Mobile UI components",
        "App store deployment",
        "Cross-platform testing"
      ],
      color: "text-secondary"
    },
    {
      quarter: "Q3 2025",
      status: "planned",
      progress: 0,
      icon: Brain,
      title: "Custom AI Models",
      description: "Train personalized AI models for your specific needs",
      features: [
        "Custom model training",
        "Domain-specific AI",
        "Private model hosting",
        "Transfer learning",
        "Model marketplace"
      ],
      color: "text-accent"
    },
    {
      quarter: "Q4 2025",
      status: "planned",
      progress: 0,
      icon: Globe,
      title: "Global Platform Expansion",
      description: "Multi-language support and global infrastructure",
      features: [
        "Multi-language interface",
        "Regional data centers",
        "Local compliance",
        "Currency support",
        "Global partnerships"
      ],
      color: "text-primary"
    },
    {
      quarter: "Q1 2026",
      status: "planned",
      progress: 0,
      icon: Database,
      title: "Advanced Backend Services",
      description: "Comprehensive backend-as-a-service platform",
      features: [
        "Serverless functions",
        "Real-time databases",
        "Authentication services",
        "File storage & CDN",
        "Analytics & monitoring"
      ],
      color: "text-secondary"
    }
  ];

  const upcomingFeatures = [
    {
      icon: Code,
      title: "AI Pair Programming",
      description: "Real-time AI coding assistant that learns your style",
      eta: "Q2 2025"
    },
    {
      icon: Palette,
      title: "Advanced Design System",
      description: "AI-generated design systems and brand guidelines",
      eta: "Q2 2025"
    },
    {
      icon: Shield,
      title: "Security Scanning",
      description: "Automated security vulnerability detection and fixes",
      eta: "Q3 2025"
    },
    {
      icon: Users,
      title: "Team Workspaces",
      description: "Enhanced collaboration with shared resources",
      eta: "Q3 2025"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'in-progress':
        return Clock;
      default:
        return Target;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'in-progress':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-primary/10 text-primary border-primary/20">In Progress</Badge>;
      default:
        return <Badge variant="secondary">Planned</Badge>;
    }
  };

  return (
    <section className="py-20 bg-card/30">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 ff-text-gradient">
            Product Roadmap
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See what's coming next for FlashFusion. We're constantly innovating to bring you the future of AI-powered development.
          </p>
        </motion.div>

        {/* Roadmap Timeline */}
        <div className="space-y-8 mb-16">
          {roadmapItems.map((item, index) => (
            <motion.div
              key={item.quarter}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="ff-card-interactive">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center ${item.color}`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{item.quarter}</p>
                      </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                  
                  {item.status === 'in-progress' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className="h-2" />
                    </div>
                  )}
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {item.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className={`w-4 h-4 ${item.status === 'completed' ? 'text-green-500' : 'text-muted-foreground'}`} />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Upcoming Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-center mb-8">Upcoming Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="ff-card-interactive h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{feature.title}</h4>
                          <Badge variant="outline" className="text-xs">{feature.eta}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Feedback CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16 p-8 bg-primary/5 rounded-lg"
        >
          <h4 className="text-xl font-semibold mb-4">Have Feature Requests?</h4>
          <p className="text-muted-foreground mb-6">
            Your feedback shapes our roadmap. Let us know what features would help you build better applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="ff-btn-primary px-6 py-2 rounded-lg">Submit Feature Request</button>
            <button className="ff-btn-secondary px-6 py-2 rounded-lg">Join Beta Program</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}