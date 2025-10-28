'use client';

import { Metadata } from 'next';
import { useState } from 'react';
import Link from 'next/link';
import BackButton from '../../components/BackButton';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ThumbsUp, 
  ThumbsDown,
  TrendingUp,
  ExternalLink,
  Book,
  MessageCircle,
  FileText,
  HelpCircle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

// Note: Metadata must be exported from a Server Component
// This is a Client Component, so metadata should be in layout.tsx or a wrapper

// FAQ Data with popularity and helpful metrics
const faqData = [
  {
    id: 'what-is-flashfusion',
    category: 'general',
    question: 'What is FlashFusion and how does it work?',
    answer: 'FlashFusion is an AI-powered development platform that transforms ideas into production-ready applications through multi-agent orchestration. Our system coordinates multiple specialized AI agents that handle different aspects of development—from code generation and UI design to deployment and optimization. Simply describe what you want to build, and our AI agents collaborate to create a complete, scalable application with frontend, backend, database, and infrastructure configuration.',
    popular: true,
    helpfulCount: 247,
    relatedResources: [
      { title: 'Getting Started Guide', url: '/docs/getting-started' },
      { title: 'How Multi-Agent Orchestration Works', url: '/features#multi-agent' },
      { title: 'Watch Demo Video', url: '/demo' }
    ],
    tags: ['platform', 'ai', 'overview']
  },
  {
    id: 'ai-content-generation',
    category: 'features',
    question: 'How does the AI content generation work?',
    answer: 'Our AI content generation uses advanced language models (GPT-4, Claude 3, Gemini) to create high-quality content across multiple formats. You provide context like topic, tone, audience, and length—then our AI generates blogs, social media posts, marketing copy, documentation, and more. The system learns from your brand guidelines and previous content to maintain consistency. Professional plans include unlimited generations with access to all premium AI models.',
    popular: true,
    helpfulCount: 189,
    relatedResources: [
      { title: 'Content Creation Guide', url: '/docs/content-creation' },
      { title: 'AI Model Comparison', url: '/features#ai-models' },
      { title: 'Try Content Generator Demo', url: '/demo/ai-creation' }
    ],
    tags: ['ai', 'content', 'generation']
  },
  {
    id: 'data-security',
    category: 'security',
    question: 'How secure is my data and content?',
    answer: 'Security is our top priority. All data is encrypted at rest with AES-256 and in transit with TLS 1.3. We\'re SOC 2 Type II compliant and undergo regular third-party security audits. Your code and content are stored in geo-redundant data centers with automatic backups. We never use your data to train AI models—your intellectual property remains 100% yours. Enterprise plans include SSO, custom data residency, and on-premise deployment options.',
    popular: true,
    helpfulCount: 167,
    relatedResources: [
      { title: 'Security Whitepaper', url: '/security' },
      { title: 'Privacy Policy', url: '/privacy' },
      { title: 'Compliance Certifications', url: '/security#compliance' }
    ],
    tags: ['security', 'privacy', 'encryption']
  },
  {
    id: 'commercial-use',
    category: 'general',
    question: 'Can I use FlashFusion content for commercial purposes?',
    answer: 'Yes! All content and code generated through FlashFusion is 100% yours to use commercially. You own full rights to everything created on our platform—no attribution required. This includes code, content, designs, and any AI-generated assets. You can use, modify, distribute, and monetize your work freely. Professional and Enterprise plans include commercial licensing and indemnification for additional protection.',
    popular: true,
    helpfulCount: 156,
    relatedResources: [
      { title: 'Terms of Service', url: '/terms' },
      { title: 'Licensing Guide', url: '/docs/licensing' },
      { title: 'Enterprise Features', url: '/pricing#enterprise' }
    ],
    tags: ['licensing', 'commercial', 'rights']
  },
  {
    id: 'pricing-plans',
    category: 'pricing',
    question: 'What are the different pricing plans available?',
    answer: 'We offer three main plans: Starter (Free) with 5 projects and 10 AI generations/month—perfect for trying FlashFusion. Professional ($29/month, currently 50% off) includes unlimited projects, unlimited AI generations, advanced deployment, priority support, and team collaboration. Enterprise (Custom pricing) adds unlimited team members, dedicated support, custom AI training, on-premise deployment, and white-label options. All paid plans include a 14-day free trial.',
    popular: false,
    helpfulCount: 203,
    relatedResources: [
      { title: 'View Full Pricing', url: '/pricing' },
      { title: 'Compare Plans', url: '/pricing#comparison' },
      { title: 'Start Free Trial', url: '/signup' }
    ],
    tags: ['pricing', 'plans', 'billing']
  },
  {
    id: 'free-trial',
    category: 'pricing',
    question: 'Is there a free trial available?',
    answer: 'Yes! Professional and Enterprise plans include a 14-day free trial with full access to all features—no credit card required. You can test unlimited AI generations, advanced deployment, team collaboration, and all premium features. The Starter plan is free forever with generous limits for small projects. If you need more time to evaluate, contact our sales team for an extended trial.',
    popular: false,
    helpfulCount: 178,
    relatedResources: [
      { title: 'Start Your Free Trial', url: '/signup?trial=true' },
      { title: 'Trial Feature Access', url: '/pricing#trial' },
      { title: 'Contact Sales', url: '/contact?inquiry=trial' }
    ],
    tags: ['trial', 'free', 'pricing']
  },
  {
    id: 'support-options',
    category: 'general',
    question: 'What kind of support do you provide?',
    answer: 'We offer multiple support channels: Starter plans get community support via Discord and documentation. Professional plans include priority email support with 24-hour response time, plus access to our knowledge base and tutorial library. Enterprise plans add dedicated account managers, 1-hour SLA, phone support, and a private Slack channel with our engineering team. All plans include extensive documentation, video tutorials, and weekly office hours.',
    popular: false,
    helpfulCount: 156,
    relatedResources: [
      { title: 'Contact Support', url: '/contact' },
      { title: 'Documentation', url: '/docs' },
      { title: 'Community Discord', url: '/community' }
    ],
    tags: ['support', 'help', 'customer-service']
  },
  {
    id: 'cancel-subscription',
    category: 'pricing',
    question: 'Can I cancel my subscription anytime?',
    answer: 'Absolutely. You can cancel your subscription at any time with no cancellation fees or penalties. You\'ll continue to have access to all features until the end of your current billing period. After cancellation, you can still access your generated content and export your data. You can also reactivate your subscription at any time and pick up right where you left off. We also offer plan downgrades if you need fewer features.',
    popular: false,
    helpfulCount: 145,
    relatedResources: [
      { title: 'Cancellation Policy', url: '/docs/cancellation' },
      { title: 'Export Your Data', url: '/docs/export' },
      { title: 'Downgrade Options', url: '/pricing' }
    ],
    tags: ['cancellation', 'billing', 'subscription']
  },
  {
    id: 'deployment-platforms',
    category: 'features',
    question: 'What platforms can I publish to?',
    answer: 'FlashFusion supports one-click deployment to 8+ major platforms: Vercel, Netlify, AWS, Google Cloud, Azure, Railway, Render, and Heroku. You can also export your code as a ZIP file or push directly to GitHub/GitLab/Bitbucket. Our deployment system includes automatic CI/CD setup, environment configuration, SSL certificates, and zero-downtime updates. Professional plans include deployment analytics and rollback capabilities.',
    popular: false,
    helpfulCount: 134,
    relatedResources: [
      { title: 'Deployment Guide', url: '/docs/deployment' },
      { title: 'Platform Comparison', url: '/features#deployment' },
      { title: 'Try Deployment Demo', url: '/demo/one-click-publish' }
    ],
    tags: ['deployment', 'publishing', 'platforms']
  },
  {
    id: 'api-access',
    category: 'technical',
    question: 'Do you provide API access for developers?',
    answer: 'Yes! Professional and Enterprise plans include full REST API access with comprehensive documentation. You can programmatically create projects, generate code, manage deployments, and access analytics. We provide SDKs for JavaScript/TypeScript, Python, and Go. Rate limits scale with your plan—Professional gets 1,000 requests/hour, Enterprise gets unlimited. API keys support granular permissions and can be rotated anytime.',
    popular: false,
    helpfulCount: 112,
    relatedResources: [
      { title: 'API Documentation', url: '/docs/api' },
      { title: 'SDK Downloads', url: '/docs/sdks' },
      { title: 'API Examples', url: '/docs/api-examples' }
    ],
    tags: ['api', 'developers', 'integration']
  },
  {
    id: 'team-collaboration',
    category: 'collaboration',
    question: 'How does team collaboration work?',
    answer: 'Professional plans support up to 5 team members with role-based permissions (Owner, Editor, Viewer). Teams get real-time collaborative editing, inline comments, code reviews, and shared project libraries. Enterprise plans include unlimited members, custom roles, audit logs, and advanced approval workflows. All collaboration features work across code, content, and deployments. Integration with Slack and Microsoft Teams keeps your team synchronized.',
    popular: false,
    helpfulCount: 98,
    relatedResources: [
      { title: 'Team Features Guide', url: '/docs/teams' },
      { title: 'Collaboration Best Practices', url: '/docs/collaboration' },
      { title: 'Enterprise Team Features', url: '/pricing#enterprise' }
    ],
    tags: ['collaboration', 'teams', 'workflow']
  },
  {
    id: 'custom-ai-training',
    category: 'features',
    question: 'Can I train custom AI models with my data?',
    answer: 'Enterprise plans support custom AI model training on your codebase and brand guidelines. Our AI learns your coding patterns, design preferences, naming conventions, and documentation style. This creates a personalized development experience that generates code matching your exact standards. Training typically takes 24-48 hours and improves accuracy by 30-40%. Models are private to your organization and never shared.',
    popular: false,
    helpfulCount: 87,
    relatedResources: [
      { title: 'Custom AI Training Guide', url: '/docs/custom-ai' },
      { title: 'Enterprise Features', url: '/pricing#enterprise' },
      { title: 'Contact Enterprise Sales', url: '/contact?inquiry=enterprise' }
    ],
    tags: ['ai', 'custom', 'enterprise', 'training']
  }
];

const categories = [
  { id: 'all', label: 'All', icon: HelpCircle },
  { id: 'general', label: 'General', icon: MessageCircle },
  { id: 'pricing', label: 'Pricing & Billing', icon: CheckCircle },
  { id: 'features', label: 'Features & AI Tools', icon: TrendingUp },
  { id: 'technical', label: 'Technical', icon: Book },
  { id: 'security', label: 'Security & Privacy', icon: CheckCircle },
  { id: 'collaboration', label: 'Teams & Collaboration', icon: MessageCircle }
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [helpfulVotes, setHelpfulVotes] = useState<{ [key: string]: boolean | null }>({});

  // Filter FAQs based on category and search
  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Sort by popular first, then by helpful count
  const sortedFAQs = [...filteredFAQs].sort((a, b) => {
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;
    return b.helpfulCount - a.helpfulCount;
  });

  const handleHelpfulVote = (faqId: string, isHelpful: boolean) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [faqId]: isHelpful
    }));
  };

  // Generate JSON-LD structured data for SEO
  const faqSchemaData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaData) }}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section 
          className="py-20 md:py-24 px-6"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 123, 0, 0.05) 0%, rgba(0, 180, 216, 0.05) 100%)'
          }}
        >
          <div className="max-w-5xl mx-auto">
            <BackButton href="/" label="Back to Home" className="mb-8" />
            
            <div className="text-center mb-12">
              <h1 
                className="mb-6"
                style={{
                  fontFamily: 'var(--ff-font-primary)',
                  fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                  fontWeight: 'var(--ff-weight-extrabold)',
                  lineHeight: 'var(--ff-leading-tight)',
                  background: 'linear-gradient(135deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Frequently Asked Questions
              </h1>
              <p 
                className="text-xl max-w-3xl mx-auto mb-8"
                style={{
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'var(--ff-font-secondary)',
                  lineHeight: 'var(--ff-leading-relaxed)'
                }}
              >
                Find answers to common questions about FlashFusion. Can't find what you're looking for? 
                Our support team is here to help.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5"
                  style={{ color: 'var(--ff-text-muted)' }}
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder="Search FAQ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:outline-none transition-all"
                  style={{
                    background: 'var(--ff-surface)',
                    borderColor: searchQuery ? 'var(--ff-primary)' : 'rgba(255, 255, 255, 0.1)',
                    color: 'var(--ff-text-primary)',
                    fontFamily: 'var(--ff-font-secondary)',
                    fontSize: 'var(--ff-text-base)'
                  }}
                  aria-label="Search FAQs"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Category Tabs */}
        <section 
          className="py-6 px-6 sticky top-0 z-20 border-b backdrop-blur-lg"
          style={{ 
            background: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <h2 
                style={{
                  fontFamily: 'var(--ff-font-primary)',
                  fontSize: 'var(--ff-text-sm)',
                  fontWeight: 'var(--ff-weight-semibold)',
                  color: 'var(--ff-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                Browse by Category
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105"
                    style={{
                      background: isActive 
                        ? 'linear-gradient(135deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)'
                        : 'transparent',
                      border: isActive
                        ? 'none'
                        : '2px solid rgba(255, 255, 255, 0.1)',
                      color: isActive
                        ? 'white'
                        : 'var(--ff-text-secondary)',
                      fontFamily: 'var(--ff-font-primary)',
                      fontWeight: 'var(--ff-weight-semibold)',
                      fontSize: 'var(--ff-text-sm)'
                    }}
                    aria-pressed={isActive}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ List */}
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            {sortedFAQs.length === 0 ? (
              <div 
                className="text-center py-16 px-6 rounded-2xl border"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <HelpCircle 
                  className="h-16 w-16 mx-auto mb-4"
                  style={{ color: 'var(--ff-text-muted)' }}
                />
                <h3 
                  className="mb-2"
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-xl)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    color: 'var(--ff-text-primary)'
                  }}
                >
                  No FAQs found
                </h3>
                <p 
                  style={{
                    color: 'var(--ff-text-muted)',
                    fontFamily: 'var(--ff-font-secondary)',
                    fontSize: 'var(--ff-text-base)'
                  }}
                >
                  Try a different search term or browse all categories
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedFAQs.map((faq) => {
                  const isExpanded = expandedId === faq.id;
                  const userVote = helpfulVotes[faq.id];
                  
                  return (
                    <article
                      key={faq.id}
                      className="border rounded-xl overflow-hidden transition-all hover:shadow-lg"
                      style={{
                        background: 'var(--ff-surface)',
                        borderColor: isExpanded 
                          ? 'var(--ff-primary)' 
                          : 'rgba(255, 255, 255, 0.1)',
                        boxShadow: isExpanded ? '0 10px 40px rgba(255, 123, 0, 0.2)' : 'none'
                      }}
                    >
                      {/* Question Header */}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                        className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left transition-all hover:bg-opacity-80"
                        aria-expanded={isExpanded}
                        aria-controls={`faq-answer-${faq.id}`}
                      >
                        <div className="flex-1">
                          {/* Badges */}
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            {faq.popular && (
                              <span 
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full"
                                style={{
                                  background: 'rgba(255, 123, 0, 0.15)',
                                  color: 'var(--ff-primary)',
                                  fontFamily: 'var(--ff-font-primary)',
                                  fontSize: 'var(--ff-text-xs)',
                                  fontWeight: 'var(--ff-weight-semibold)'
                                }}
                              >
                                <TrendingUp className="h-3 w-3" />
                                Popular
                              </span>
                            )}
                            <span 
                              className="inline-block px-3 py-1 rounded-full"
                              style={{
                                background: 'rgba(0, 180, 216, 0.15)',
                                color: 'var(--ff-secondary)',
                                fontFamily: 'var(--ff-font-primary)',
                                fontSize: 'var(--ff-text-xs)',
                                fontWeight: 'var(--ff-weight-semibold)',
                                textTransform: 'capitalize'
                              }}
                            >
                              {faq.category}
                            </span>
                            <span 
                              className="inline-flex items-center gap-1"
                              style={{
                                color: 'var(--ff-text-muted)',
                                fontFamily: 'var(--ff-font-secondary)',
                                fontSize: 'var(--ff-text-xs)'
                              }}
                            >
                              <ThumbsUp className="h-3 w-3" />
                              {faq.helpfulCount} found helpful
                            </span>
                          </div>
                          
                          {/* Question */}
                          <h3 
                            style={{
                              fontFamily: 'var(--ff-font-primary)',
                              fontSize: 'var(--ff-text-lg)',
                              fontWeight: 'var(--ff-weight-semibold)',
                              color: 'var(--ff-text-primary)',
                              lineHeight: 'var(--ff-leading-snug)'
                            }}
                          >
                            {faq.question}
                          </h3>
                        </div>
                        
                        {/* Expand Icon */}
                        <div className="flex-shrink-0 mt-1">
                          {isExpanded ? (
                            <ChevronUp 
                              className="h-6 w-6 transition-transform" 
                              style={{ color: 'var(--ff-primary)' }}
                            />
                          ) : (
                            <ChevronDown 
                              className="h-6 w-6 transition-transform" 
                              style={{ color: 'var(--ff-text-muted)' }}
                            />
                          )}
                        </div>
                      </button>

                      {/* Answer Content */}
                      {isExpanded && (
                        <div 
                          id={`faq-answer-${faq.id}`}
                          className="px-6 pb-6 pt-2"
                          style={{
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                          }}
                        >
                          {/* Answer Text */}
                          <p 
                            className="mb-6"
                            style={{
                              color: 'var(--ff-text-secondary)',
                              fontFamily: 'var(--ff-font-secondary)',
                              fontSize: 'var(--ff-text-base)',
                              lineHeight: 'var(--ff-leading-relaxed)'
                            }}
                          >
                            {faq.answer}
                          </p>

                          {/* Related Resources */}
                          {faq.relatedResources && faq.relatedResources.length > 0 && (
                            <div 
                              className="mb-6 p-4 rounded-lg"
                              style={{
                                background: 'rgba(0, 180, 216, 0.05)',
                                border: '1px solid rgba(0, 180, 216, 0.2)'
                              }}
                            >
                              <h4 
                                className="mb-3 flex items-center gap-2"
                                style={{
                                  fontFamily: 'var(--ff-font-primary)',
                                  fontSize: 'var(--ff-text-sm)',
                                  fontWeight: 'var(--ff-weight-semibold)',
                                  color: 'var(--ff-text-primary)'
                                }}
                              >
                                <Book className="h-4 w-4" style={{ color: 'var(--ff-secondary)' }} />
                                Related Resources:
                              </h4>
                              <ul className="space-y-2">
                                {faq.relatedResources.map((resource, index) => (
                                  <li key={index}>
                                    <Link
                                      href={resource.url}
                                      className="inline-flex items-center gap-2 transition-colors hover:underline"
                                      style={{
                                        color: 'var(--ff-secondary)',
                                        fontFamily: 'var(--ff-font-secondary)',
                                        fontSize: 'var(--ff-text-sm)'
                                      }}
                                    >
                                      <ArrowRight className="h-3 w-3" />
                                      {resource.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Helpful Vote Buttons */}
                          <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <span 
                              style={{
                                fontFamily: 'var(--ff-font-primary)',
                                fontSize: 'var(--ff-text-sm)',
                                fontWeight: 'var(--ff-weight-semibold)',
                                color: 'var(--ff-text-muted)'
                              }}
                            >
                              Was this helpful?
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleHelpfulVote(faq.id, true)}
                                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg transition-all hover:scale-105"
                                style={{
                                  background: userVote === true ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                  border: userVote === true ? '1px solid var(--ff-success)' : '1px solid rgba(255, 255, 255, 0.1)',
                                  color: userVote === true ? 'var(--ff-success)' : 'var(--ff-text-muted)',
                                  fontFamily: 'var(--ff-font-primary)',
                                  fontSize: 'var(--ff-text-sm)',
                                  fontWeight: 'var(--ff-weight-semibold)'
                                }}
                                aria-label="Mark as helpful"
                              >
                                <ThumbsUp className="h-4 w-4" />
                                Yes
                              </button>
                              <button
                                onClick={() => handleHelpfulVote(faq.id, false)}
                                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg transition-all hover:scale-105"
                                style={{
                                  background: userVote === false ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                  border: userVote === false ? '1px solid var(--ff-error)' : '1px solid rgba(255, 255, 255, 0.1)',
                                  color: userVote === false ? 'var(--ff-error)' : 'var(--ff-text-muted)',
                                  fontFamily: 'var(--ff-font-primary)',
                                  fontSize: 'var(--ff-text-sm)',
                                  fontWeight: 'var(--ff-weight-semibold)'
                                }}
                                aria-label="Mark as not helpful"
                              >
                                <ThumbsDown className="h-4 w-4" />
                                No
                              </button>
                            </div>
                          </div>

                          {/* Thank you message */}
                          {userVote !== null && (
                            <div 
                              className="mt-3 p-3 rounded-lg"
                              style={{
                                background: userVote ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                border: `1px solid ${userVote ? 'var(--ff-success)' : 'var(--ff-error)'}`
                              }}
                            >
                              <p 
                                style={{
                                  color: userVote ? 'var(--ff-success)' : 'var(--ff-error)',
                                  fontFamily: 'var(--ff-font-secondary)',
                                  fontSize: 'var(--ff-text-sm)'
                                }}
                              >
                                {userVote 
                                  ? '✓ Thank you for your feedback!' 
                                  : 'Sorry this wasn\'t helpful. Please contact support for more assistance.'}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Still Need Help Section */}
        <section 
          className="py-20 px-6"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(255, 123, 0, 0.03) 100%)'
          }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 
                className="mb-4"
                style={{
                  fontFamily: 'var(--ff-font-primary)',
                  fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                  fontWeight: 'var(--ff-weight-bold)',
                  color: 'var(--ff-text-primary)'
                }}
              >
                Still need help?
              </h2>
              <p 
                className="text-lg max-w-2xl mx-auto"
                style={{
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'var(--ff-font-secondary)',
                  lineHeight: 'var(--ff-leading-relaxed)'
                }}
              >
                Can't find the answer you're looking for? Our support team is ready to help you succeed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Support Card */}
              <Link
                href="/contact"
                className="group p-8 rounded-2xl border transition-all hover:scale-105 hover:shadow-xl"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                  style={{
                    background: 'rgba(255, 123, 0, 0.1)',
                    color: 'var(--ff-primary)'
                  }}
                >
                  <MessageCircle className="h-6 w-6" />
                </div>
                <h3 
                  className="mb-2"
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-xl)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    color: 'var(--ff-text-primary)'
                  }}
                >
                  Contact Support
                </h3>
                <p 
                  className="mb-4"
                  style={{
                    color: 'var(--ff-text-secondary)',
                    fontFamily: 'var(--ff-font-secondary)',
                    fontSize: 'var(--ff-text-sm)',
                    lineHeight: 'var(--ff-leading-relaxed)'
                  }}
                >
                  Get in touch with our support team for personalized assistance
                </p>
                <div 
                  className="inline-flex items-center gap-1 transition-all group-hover:gap-2"
                  style={{
                    color: 'var(--ff-primary)',
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-sm)',
                    fontWeight: 'var(--ff-weight-semibold)'
                  }}
                >
                  Send a message
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>

              {/* View Documentation Card */}
              <Link
                href="/docs"
                className="group p-8 rounded-2xl border transition-all hover:scale-105 hover:shadow-xl"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                  style={{
                    background: 'rgba(0, 180, 216, 0.1)',
                    color: 'var(--ff-secondary)'
                  }}
                >
                  <Book className="h-6 w-6" />
                </div>
                <h3 
                  className="mb-2"
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-xl)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    color: 'var(--ff-text-primary)'
                  }}
                >
                  View Documentation
                </h3>
                <p 
                  className="mb-4"
                  style={{
                    color: 'var(--ff-text-secondary)',
                    fontFamily: 'var(--ff-font-secondary)',
                    fontSize: 'var(--ff-text-sm)',
                    lineHeight: 'var(--ff-leading-relaxed)'
                  }}
                >
                  Browse our comprehensive guides, tutorials, and API references
                </p>
                <div 
                  className="inline-flex items-center gap-1 transition-all group-hover:gap-2"
                  style={{
                    color: 'var(--ff-secondary)',
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-sm)',
                    fontWeight: 'var(--ff-weight-semibold)'
                  }}
                >
                  Read docs
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section 
          className="py-24 px-6"
          style={{ 
            background: 'linear-gradient(135deg, rgba(255, 123, 0, 0.1) 0%, rgba(0, 180, 216, 0.1) 100%)'
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 
              className="mb-6"
              style={{
                fontFamily: 'var(--ff-font-primary)',
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 'var(--ff-weight-extrabold)',
                color: 'var(--ff-text-primary)'
              }}
            >
              Ready to build the future?
            </h2>
            <p 
              className="text-xl mb-10 max-w-2xl mx-auto"
              style={{ 
                color: 'var(--ff-text-secondary)',
                fontFamily: 'var(--ff-font-secondary)',
                lineHeight: 'var(--ff-leading-relaxed)'
              }}
            >
              Join thousands of creators, developers, and entrepreneurs who are already building 
              amazing things with FlashFusion AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-10 py-5 rounded-xl transition-all hover:scale-105 shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)',
                  color: 'white',
                  fontFamily: 'var(--ff-font-primary)',
                  fontSize: 'var(--ff-text-lg)',
                  fontWeight: 'var(--ff-weight-semibold)',
                  boxShadow: '0 20px 60px rgba(255, 123, 0, 0.4)'
                }}
              >
                Start Building - 50% OFF
              </Link>

              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-10 py-5 rounded-xl border-2 transition-all hover:scale-105"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'var(--ff-text-primary)',
                  fontFamily: 'var(--ff-font-primary)',
                  fontSize: 'var(--ff-text-lg)',
                  fontWeight: 'var(--ff-weight-semibold)'
                }}
              >
                Try Demo First
              </Link>
            </div>

            <p 
              className="mt-6"
              style={{
                color: 'var(--ff-text-muted)',
                fontFamily: 'var(--ff-font-secondary)',
                fontSize: 'var(--ff-text-sm)'
              }}
            >
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </section>
      </div>
    </>
  );
}