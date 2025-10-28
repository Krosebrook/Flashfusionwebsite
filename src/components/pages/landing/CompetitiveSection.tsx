import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Check, X, Star, Zap, Crown, Target } from 'lucide-react';

export function CompetitiveSection() {
  const competitors = [
    {
      name: 'FlashFusion',
      logo: '🚀',
      tagline: 'Complete AI Development Platform',
      isUs: true,
      pricing: 'Free - $99/mo',
      features: {
        'AI Tools': '60+',
        'Deployment Platforms': '8+',
        'Gamification': 'Full System',
        'Real-time Collaboration': 'Yes',
        'Code Review AI': 'Advanced',
        'Community Challenges': 'Yes',
        'Custom Templates': 'Unlimited',
        'White-label': 'Enterprise',
        'Mobile Development': 'Coming Q2',
        'Enterprise Support': '24/7'
      }
    },
    {
      name: 'GitHub Copilot',
      logo: '🐙',
      tagline: 'AI Programming Assistant',
      isUs: false,
      pricing: '$10 - $39/mo',
      features: {
        'AI Tools': 'Code Only',
        'Deployment Platforms': 'Limited',
        'Gamification': 'None',
        'Real-time Collaboration': 'Basic',
        'Code Review AI': 'Limited',
        'Community Challenges': 'None',
        'Custom Templates': 'None',
        'White-label': 'No',
        'Mobile Development': 'Limited',
        'Enterprise Support': 'Business Hours'
      }
    },
    {
      name: 'Replit',
      logo: '🌟',
      tagline: 'Online Development Environment',
      isUs: false,
      pricing: 'Free - $20/mo',
      features: {
        'AI Tools': 'Basic',
        'Deployment Platforms': '3',
        'Gamification': 'Basic',
        'Real-time Collaboration': 'Yes',
        'Code Review AI': 'None',
        'Community Challenges': 'Limited',
        'Custom Templates': 'Basic',
        'White-label': 'No',
        'Mobile Development': 'No',
        'Enterprise Support': 'Limited'
      }
    },
    {
      name: 'CodeSandbox',
      logo: '📦',
      tagline: 'Cloud Development Platform',
      isUs: false,
      pricing: 'Free - $24/mo',
      features: {
        'AI Tools': 'Limited',
        'Deployment Platforms': '2',
        'Gamification': 'None',
        'Real-time Collaboration': 'Yes',
        'Code Review AI': 'None',
        'Community Challenges': 'None',
        'Custom Templates': 'Limited',
        'White-label': 'No',
        'Mobile Development': 'No',
        'Enterprise Support': 'Email Only'
      }
    }
  ];

  const differentiators = [
    {
      icon: Zap,
      title: 'Comprehensive AI Suite',
      description: 'While others focus on single aspects, FlashFusion provides 60+ AI tools covering every aspect of development from design to deployment.',
      advantage: '60+ vs 1-5 tools'
    },
    {
      icon: Target,
      title: 'Gamified Learning',
      description: 'Unique XP system, achievements, and daily challenges make coding addictive and accelerate skill development.',
      advantage: 'Only platform with full gamification'
    },
    {
      icon: Crown,
      title: 'End-to-End Platform',
      description: 'Complete development lifecycle in one platform - from idea to deployment, monitoring, and scaling.',
      advantage: 'Full stack vs partial solutions'
    },
    {
      icon: Star,
      title: 'Community-Driven',
      description: 'Active community with challenges, mentorship, and shared components. Learning together accelerates growth.',
      advantage: 'Active learning community'
    }
  ];

  const useCases = [
    {
      title: 'For Beginners',
      description: 'Start with zero coding experience',
      advantages: [
        'Guided learning with gamification',
        'Natural language to code',
        'Step-by-step tutorials',
        'Community mentorship'
      ]
    },
    {
      title: 'For Professionals',
      description: 'Accelerate your development workflow',
      advantages: [
        '10x faster prototyping',
        'Advanced AI code review',
        'Multi-platform deployment',
        'Team collaboration tools'
      ]
    },
    {
      title: 'For Teams',
      description: 'Scale your development organization',
      advantages: [
        'Real-time collaboration',
        'Shared component libraries',
        'Standardized workflows',
        'Enterprise security'
      ]
    },
    {
      title: 'For Enterprises',
      description: 'Transform your development process',
      advantages: [
        'White-label solutions',
        'Custom AI training',
        'SOC 2 compliance',
        'Dedicated support'
      ]
    }
  ];

  const getFeatureValue = (feature: string, competitor: any) => {
    const value = competitor.features[feature];
    
    if (value === 'Yes' || value === 'Advanced' || value === 'Full System' || value === 'Unlimited') {
      return <Check className="w-5 h-5 text-green-500" />;
    }
    
    if (value === 'No' || value === 'None') {
      return <X className="w-5 h-5 text-red-500" />;
    }
    
    return <span className="text-sm text-muted-foreground">{value}</span>;
  };

  return (
    <section className="py-20 bg-card/30">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 ff-text-gradient">
            Why Choose FlashFusion?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how FlashFusion compares to other development platforms and discover why thousands of developers choose us.
          </p>
        </motion.div>

        {/* Key Differentiators */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {differentiators.map((diff, index) => (
            <motion.div
              key={diff.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="ff-card-interactive text-center h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <diff.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{diff.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{diff.description}</p>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {diff.advantage}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8">Feature Comparison</h3>
          <div className="overflow-x-auto">
            <Card>
              <CardContent className="p-0">
                <div className="min-w-[800px]">
                  {/* Header */}
                  <div className="grid grid-cols-5 border-b border-border">
                    <div className="p-4 font-medium">Features</div>
                    {competitors.map((competitor) => (
                      <div key={competitor.name} className={`p-4 text-center ${competitor.isUs ? 'bg-primary/5' : ''}`}>
                        <div className="flex items-center justify-center space-x-2 mb-1">
                          <span className="text-2xl">{competitor.logo}</span>
                          <span className="font-medium">{competitor.name}</span>
                          {competitor.isUs && <Crown className="w-4 h-4 text-primary" />}
                        </div>
                        <div className="text-xs text-muted-foreground">{competitor.tagline}</div>
                        <Badge variant="outline" className="mt-2 text-xs">{competitor.pricing}</Badge>
                      </div>
                    ))}
                  </div>

                  {/* Feature Rows */}
                  {Object.keys(competitors[0].features).map((feature, index) => (
                    <div key={feature} className={`grid grid-cols-5 border-b border-border ${index % 2 === 0 ? 'bg-muted/20' : ''}`}>
                      <div className="p-4 font-medium">{feature}</div>
                      {competitors.map((competitor) => (
                        <div key={`${competitor.name}-${feature}`} className={`p-4 text-center ${competitor.isUs ? 'bg-primary/5' : ''}`}>
                          {getFeatureValue(feature, competitor)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Use Cases */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-center mb-8">Perfect for Every Use Case</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="ff-card-interactive h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{useCase.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{useCase.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {useCase.advantages.map((advantage, advIndex) => (
                        <div key={advIndex} className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm">{advantage}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16 p-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg"
        >
          <h4 className="text-2xl font-bold mb-4">Ready to Experience the Difference?</h4>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of developers who have already discovered why FlashFusion is the future of AI-powered development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="ff-btn-primary px-8 py-3 rounded-lg">Start Free Trial</button>
            <button className="ff-btn-secondary px-8 py-3 rounded-lg">Schedule Demo</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}