/**
 * @fileoverview FAQ Dropdown Section - FlashFusion Interactive FAQ
 * @chunk faq
 * @category faq
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Interactive FAQ section with collapsible dropdowns, search functionality,
 * and categorized questions for better user experience.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Star,
  Zap,
  Shield,
  CreditCard,
  Users,
  Code,
  Rocket,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink,
  BookOpen,
  Video,
  Mail
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  featured?: boolean;
  helpfulCount?: number;
  relatedLinks?: {
    title: string;
    url: string;
    type: 'docs' | 'video' | 'blog' | 'external';
  }[];
}

interface FAQCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface FAQDropdownSectionProps {
  onContactSupport?: () => void;
  maxDisplayedItems?: number;
  showSearch?: boolean;
  showCategories?: boolean;
}

export function FAQDropdownSection({ 
  onContactSupport,
  maxDisplayedItems = 10,
  showSearch = true,
  showCategories = true
}: FAQDropdownSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});

  const categories: FAQCategory[] = [
    {
      id: 'general',
      name: 'General',
      description: 'Basic questions about FlashFusion',
      icon: <HelpCircle className="w-5 h-5" />,
      color: 'var(--ff-primary)'
    },
    {
      id: 'pricing',
      name: 'Pricing & Billing',
      description: 'Payment, subscriptions, and billing',
      icon: <CreditCard className="w-5 h-5" />,
      color: 'var(--ff-secondary)'
    },
    {
      id: 'features',
      name: 'Features & AI Tools',
      description: 'AI capabilities and platform features',
      icon: <Zap className="w-5 h-5" />,
      color: 'var(--ff-accent)'
    },
    {
      id: 'technical',
      name: 'Technical',
      description: 'API, integrations, and development',
      icon: <Code className="w-5 h-5" />,
      color: 'var(--ff-success)'
    },
    {
      id: 'security',
      name: 'Security & Privacy',
      description: 'Data protection and compliance',
      icon: <Shield className="w-5 h-5" />,
      color: 'var(--ff-warning)'
    },
    {
      id: 'collaboration',
      name: 'Teams & Collaboration',
      description: 'Team features and user management',
      icon: <Users className="w-5 h-5" />,
      color: 'var(--ff-error)'
    }
  ];

  const faqItems: FAQItem[] = [
    {
      id: 'what-is-flashfusion',
      question: 'What is FlashFusion and how does it work?',
      answer: 'FlashFusion is an AI-powered development platform that transforms your ideas into production-ready applications, content, and revenue streams. Our advanced AI models analyze your requirements and generate complete solutions including code, designs, content, and deployment configurations. Simply describe what you want to build, and FlashFusion handles the technical implementation.',
      category: 'general',
      tags: ['platform', 'ai', 'overview'],
      featured: true,
      helpfulCount: 247,
      relatedLinks: [
        { title: 'Platform Overview', url: '/docs/overview', type: 'docs' },
        { title: 'Getting Started Video', url: '/videos/getting-started', type: 'video' }
      ]
    },
    {
      id: 'ai-content-generation',
      question: 'How does the AI content generation work?',
      answer: 'Our AI uses advanced machine learning models trained on vast datasets to generate high-quality content, code, and creative assets. The system analyzes your input, understands context and requirements, then creates professional-grade outputs in seconds. You can refine and iterate on generated content, and our AI learns from your preferences to improve future generations.',
      category: 'features',
      tags: ['ai', 'content', 'generation'],
      featured: true,
      helpfulCount: 189,
      relatedLinks: [
        { title: 'AI Models Documentation', url: '/docs/ai-models', type: 'docs' },
        { title: 'Content Generation Guide', url: '/blog/content-generation', type: 'blog' }
      ]
    },
    {
      id: 'commercial-usage',
      question: 'Can I use FlashFusion content for commercial purposes?',
      answer: 'Yes! All content generated through FlashFusion is yours to use commercially without any restrictions. We provide full licensing rights for all AI-generated content, including the ability to sell, modify, distribute, and create derivative works. Your generated content belongs to you completely, and we never claim ownership or usage rights.',
      category: 'general',
      tags: ['commercial', 'licensing', 'rights'],
      featured: true,
      helpfulCount: 156,
      relatedLinks: [
        { title: 'Commercial License Terms', url: '/legal/commercial-license', type: 'docs' }
      ]
    },
    {
      id: 'pricing-plans',
      question: 'What are the different pricing plans available?',
      answer: 'We offer three main plans: Starter Pro ($29/month), Professional Pro ($79/month), and Enterprise Pro ($199/month). Each plan includes different limits on AI generations, storage, platform integrations, and support levels. We also offer promotional pricing and yearly discounts. All plans include core AI features with no hidden fees.',
      category: 'pricing',
      tags: ['pricing', 'plans', 'billing'],
      helpfulCount: 203,
      relatedLinks: [
        { title: 'Detailed Pricing Comparison', url: '/pricing', type: 'external' },
        { title: 'Billing FAQ', url: '/docs/billing', type: 'docs' }
      ]
    },
    {
      id: 'supported-platforms',
      question: 'What platforms can I publish to?',
      answer: 'FlashFusion supports 25+ platforms including social media (Twitter, Instagram, LinkedIn, TikTok), content platforms (Medium, Substack, WordPress), e-commerce (Shopify, Etsy, Amazon), development platforms (GitHub, Vercel, Netlify), and many more. We also support custom integrations and API connections for enterprise clients.',
      category: 'features',
      tags: ['platforms', 'publishing', 'integrations'],
      helpfulCount: 134,
      relatedLinks: [
        { title: 'Supported Platforms List', url: '/docs/platforms', type: 'docs' },
        { title: 'Custom Integrations', url: '/docs/custom-integrations', type: 'docs' }
      ]
    },
    {
      id: 'free-trial',
      question: 'Is there a free trial available?',
      answer: 'Yes! We offer a 14-day free trial with no credit card required. You\'ll get full access to all features including AI generations, publishing tools, analytics, and support. The trial includes everything in our Professional Pro plan so you can test all capabilities before committing to a subscription.',
      category: 'pricing',
      tags: ['trial', 'free', 'testing'],
      helpfulCount: 178,
      relatedLinks: [
        { title: 'Start Free Trial', url: '/signup?trial=true', type: 'external' }
      ]
    },
    {
      id: 'data-security',
      question: 'How secure is my data and content?',
      answer: 'We use enterprise-grade security with end-to-end encryption, SOC 2 compliance, and regular security audits. Your data is stored in secure, encrypted databases with multiple backups. We never use your data to train AI models without explicit permission, and you maintain full ownership and control over your content and intellectual property.',
      category: 'security',
      tags: ['security', 'privacy', 'data'],
      featured: true,
      helpfulCount: 167,
      relatedLinks: [
        { title: 'Security Overview', url: '/security', type: 'docs' },
        { title: 'Privacy Policy', url: '/privacy', type: 'docs' },
        { title: 'SOC 2 Compliance', url: '/compliance/soc2', type: 'docs' }
      ]
    },
    {
      id: 'cancel-subscription',
      question: 'Can I cancel my subscription anytime?',
      answer: 'Absolutely. You can cancel your subscription at any time with no cancellation fees or penalties. You\'ll continue to have access to all features until the end of your current billing period. After cancellation, you can still access your generated content and export your data. You can also reactivate your subscription at any time.',
      category: 'pricing',
      tags: ['cancellation', 'billing', 'subscription'],
      helpfulCount: 145,
      relatedLinks: [
        { title: 'How to Cancel', url: '/docs/cancel-subscription', type: 'docs' }
      ]
    },
    {
      id: 'api-access',
      question: 'Do you provide API access for developers?',
      answer: 'Yes! Professional Pro and Enterprise Pro plans include full API access with comprehensive documentation, SDKs for popular languages, webhooks, and rate limiting. Our API allows you to integrate FlashFusion\'s AI capabilities directly into your applications, automate workflows, and build custom solutions on top of our platform.',
      category: 'technical',
      tags: ['api', 'developers', 'integration'],
      helpfulCount: 112,
      relatedLinks: [
        { title: 'API Documentation', url: '/docs/api', type: 'docs' },
        { title: 'SDK Downloads', url: '/developers/sdks', type: 'docs' },
        { title: 'API Examples', url: '/docs/api-examples', type: 'docs' }
      ]
    },
    {
      id: 'team-collaboration',
      question: 'How does team collaboration work?',
      answer: 'Teams can share projects, collaborate on content creation, and manage user permissions through our collaboration features. Professional and Enterprise plans include team workspaces, role-based access controls, shared asset libraries, commenting systems, and approval workflows. Admins can manage team members, monitor usage, and control access to different features.',
      category: 'collaboration',
      tags: ['teams', 'collaboration', 'permissions'],
      helpfulCount: 98,
      relatedLinks: [
        { title: 'Team Features Guide', url: '/docs/teams', type: 'docs' },
        { title: 'Permission Management', url: '/docs/permissions', type: 'docs' }
      ]
    },
    {
      id: 'ai-model-training',
      question: 'Can I train custom AI models with my data?',
      answer: 'Enterprise Pro plans include custom AI model training capabilities. You can train models on your specific data, industry terminology, brand voice, and use cases. This creates personalized AI that understands your business context and generates more relevant, on-brand content. Custom training is available with dedicated support and deployment options.',
      category: 'features',
      tags: ['custom models', 'training', 'enterprise'],
      helpfulCount: 87,
      relatedLinks: [
        { title: 'Custom Model Training', url: '/docs/custom-models', type: 'docs' },
        { title: 'Enterprise Features', url: '/enterprise', type: 'external' }
      ]
    },
    {
      id: 'support-availability',
      question: 'What kind of support do you provide?',
      answer: 'All plans include email support with response within 24 hours. Professional plans get priority support with faster response times. Enterprise customers receive 24/7 phone support, dedicated success managers, and SLA guarantees. We also provide extensive documentation, video tutorials, community forums, and regular webinars.',
      category: 'general',
      tags: ['support', 'help', 'assistance'],
      helpfulCount: 156,
      relatedLinks: [
        { title: 'Contact Support', url: '/support', type: 'external' },
        { title: 'Documentation', url: '/docs', type: 'docs' },
        { title: 'Video Tutorials', url: '/tutorials', type: 'video' }
      ]
    }
  ];

  const filteredItems = useMemo(() => {
    let items = faqItems;

    // Filter by category
    if (selectedCategory) {
      items = items.filter(item => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort by featured, then by helpful count
    items.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.helpfulCount || 0) - (a.helpfulCount || 0);
    });

    return items.slice(0, maxDisplayedItems);
  }, [faqItems, selectedCategory, searchQuery, maxDisplayedItems]);

  const handleToggleExpanded = useCallback((itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  const handleHelpfulVote = useCallback((itemId: string, isHelpful: boolean) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [itemId]: isHelpful
    }));
  }, []);

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.icon || <HelpCircle className="w-4 h-4" />;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || 'var(--ff-primary)';
  };

  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'docs': return <BookOpen className="w-3 h-3" />;
      case 'video': return <Video className="w-3 h-3" />;
      case 'blog': return <ExternalLink className="w-3 h-3" />;
      default: return <ExternalLink className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[var(--ff-secondary)] to-[var(--ff-accent)] rounded-xl flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <h2 className="ff-text-headline">
            Frequently Asked Questions
          </h2>
        </div>
        
        <p className="text-[var(--ff-text-secondary)] ff-text-body max-w-2xl mx-auto">
          Find answers to common questions about FlashFusion. Can't find what you're looking for? Our support team is here to help.
        </p>
      </div>

      {/* Search */}
      {showSearch && (
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--ff-text-muted)] w-5 h-5" />
            <Input
              placeholder="Search FAQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-[var(--ff-surface)] border-[var(--border)] text-[var(--ff-text-primary)] ff-focus-ring"
              style={{ fontFamily: 'var(--ff-font-secondary)' }}
            />
          </div>
        </div>
      )}

      {/* Categories */}
      {showCategories && (
        <div className="space-y-4">
          <h3 className="ff-text-title text-center">Browse by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className={`h-auto p-4 flex flex-col items-center gap-2 ${
                selectedCategory === null 
                  ? 'ff-btn-primary' 
                  : 'border-[var(--border)] text-[var(--ff-text-primary)] hover:bg-[var(--ff-surface-light)]'
              }`}
            >
              <HelpCircle className="w-5 h-5" />
              <span className="text-xs ff-text-caption">All</span>
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`h-auto p-4 flex flex-col items-center gap-2 ${
                  selectedCategory === category.id 
                    ? 'ff-btn-primary' 
                    : 'border-[var(--border)] text-[var(--ff-text-primary)] hover:bg-[var(--ff-surface-light)]'
                }`}
                title={category.description}
              >
                <div style={{ color: selectedCategory === category.id ? 'white' : category.color }}>
                  {category.icon}
                </div>
                <span className="text-xs ff-text-caption">{category.name}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Items */}
      <div className="max-w-4xl mx-auto space-y-4">
        {filteredItems.length === 0 ? (
          <Card className="ff-card p-8 text-center">
            <CardContent>
              <AlertCircle className="w-12 h-12 text-[var(--ff-text-muted)] mx-auto mb-4" />
              <h3 className="ff-text-title mb-2">No results found</h3>
              <p className="text-[var(--ff-text-muted)] ff-text-body mb-4">
                We couldn't find any FAQs matching your search. Try adjusting your search terms or browse by category.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
                variant="outline"
                className="border-[var(--border)] text-[var(--ff-text-primary)] hover:bg-[var(--ff-surface-light)]"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="multiple" className="space-y-4">
            {filteredItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-none"
              >
                <Card className="ff-card overflow-hidden">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-[var(--ff-surface-light)] transition-colors">
                    <div className="flex items-start gap-4 text-left w-full">
                      <div className="flex-shrink-0 mt-1">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${getCategoryColor(item.category)}20` }}
                        >
                          <div style={{ color: getCategoryColor(item.category) }}>
                            {getCategoryIcon(item.category)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="ff-text-title text-[var(--ff-text-primary)]">
                            {item.question}
                          </h3>
                          {item.featured && (
                            <Badge variant="default" className="ff-badge-primary">
                              <Star className="w-3 h-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-[var(--ff-text-muted)]">
                          <span className="capitalize">{item.category}</span>
                          {item.helpfulCount && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4 text-[var(--ff-success)]" />
                              <span>{item.helpfulCount} found helpful</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4">
                      <div className="pl-12">
                        <p className="text-[var(--ff-text-secondary)] ff-text-body leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                      
                      {/* Related Links */}
                      {item.relatedLinks && item.relatedLinks.length > 0 && (
                        <div className="pl-12 space-y-2">
                          <h4 className="text-sm font-semibold text-[var(--ff-text-primary)] ff-text-caption">
                            Related Resources:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {item.relatedLinks.map((link, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="text-xs border-[var(--border)] text-[var(--ff-text-primary)] hover:bg-[var(--ff-surface-light)]"
                                onClick={() => window.open(link.url, '_blank')}
                              >
                                {getLinkIcon(link.type)}
                                <span className="ml-1">{link.title}</span>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Helpful Voting */}
                      <div className="pl-12 flex items-center justify-between pt-4 border-t border-[var(--border)]">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-[var(--ff-text-muted)] ff-text-caption">
                            Was this helpful?
                          </span>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant={helpfulVotes[item.id] === true ? "default" : "outline"}
                              onClick={() => handleHelpfulVote(item.id, true)}
                              className={`px-3 py-1 ${
                                helpfulVotes[item.id] === true 
                                  ? 'ff-btn-primary' 
                                  : 'border-[var(--border)] text-[var(--ff-text-primary)] hover:bg-[var(--ff-surface-light)]'
                              }`}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Yes
                            </Button>
                            <Button
                              size="sm"
                              variant={helpfulVotes[item.id] === false ? "default" : "outline"}
                              onClick={() => handleHelpfulVote(item.id, false)}
                              className={`px-3 py-1 ${
                                helpfulVotes[item.id] === false 
                                  ? 'ff-btn-secondary' 
                                  : 'border-[var(--border)] text-[var(--ff-text-primary)] hover:bg-[var(--ff-surface-light)]'
                              }`}
                            >
                              <AlertCircle className="w-3 h-3 mr-1" />
                              No
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {item.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs border-[var(--border)] text-[var(--ff-text-muted)]"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      {/* Contact Support */}
      <div className="text-center space-y-4 pt-8 border-t border-[var(--border)]">
        <h3 className="ff-text-title">Still need help?</h3>
        <p className="text-[var(--ff-text-secondary)] ff-text-body">
          Can't find the answer you're looking for? Our support team is ready to help you succeed.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={onContactSupport}
            className="ff-btn-primary ff-hover-glow"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
          <Button
            variant="outline"
            className="border-[var(--border)] text-[var(--ff-text-primary)] hover:bg-[var(--ff-surface-light)]"
            onClick={() => window.open('/docs', '_blank')}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            View Documentation
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FAQDropdownSection;