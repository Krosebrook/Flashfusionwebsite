'use client';

import { Metadata } from 'next';
import { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

const categories = ['All', 'General', 'Pricing & Billing', 'Technical', 'Security', 'Features'];

const faqs = [
  {
    category: 'General',
    question: 'What is FlashFusion?',
    answer: 'FlashFusion is an AI-powered development platform that helps you build, deploy, and scale applications faster. It combines code generation, content creation, deployment automation, and analytics in one integrated platform.'
  },
  {
    category: 'General',
    question: 'Who is FlashFusion for?',
    answer: 'FlashFusion is designed for developers, entrepreneurs, content creators, and businesses of all sizes. Whether you\'re building a side project or scaling an enterprise application, FlashFusion has tools for you.'
  },
  {
    category: 'General',
    question: 'Do I need coding experience?',
    answer: 'While FlashFusion is powerful for experienced developers, our AI-assisted tools and no-code features make it accessible to beginners. We provide templates, examples, and intelligent suggestions to help you learn as you build.'
  },
  {
    category: 'Pricing & Billing',
    question: 'Is there a free plan?',
    answer: 'Yes! Our Starter plan is free forever with 5 projects and 10 AI generations per month. It\'s perfect for trying out FlashFusion and small projects. Upgrade anytime to unlock unlimited features.'
  },
  {
    category: 'Pricing & Billing',
    question: 'Can I cancel my subscription anytime?',
    answer: 'Absolutely. You can cancel your subscription at any time with no penalties or fees. Your access continues until the end of your current billing period.'
  },
  {
    category: 'Pricing & Billing',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, Amex, Discover), PayPal, and wire transfer for Enterprise plans. All payments are processed securely through Stripe.'
  },
  {
    category: 'Pricing & Billing',
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied, contact our support team for a full refund—no questions asked.'
  },
  {
    category: 'Technical',
    question: 'What programming languages are supported?',
    answer: 'FlashFusion supports 15+ languages including JavaScript/TypeScript, Python, Java, Go, Rust, PHP, Ruby, and more. We also support frameworks like React, Vue, Angular, Next.js, Django, Flask, and Laravel.'
  },
  {
    category: 'Technical',
    question: 'Which cloud platforms can I deploy to?',
    answer: 'FlashFusion supports deployment to AWS, Google Cloud, Azure, Vercel, Netlify, Railway, Render, and Heroku. You can also export your code to deploy anywhere.'
  },
  {
    category: 'Technical',
    question: 'Can I use my own AI models?',
    answer: 'Yes! Enterprise plans support custom AI model integration. You can bring your own OpenAI, Anthropic, or custom-trained models, or use our pre-configured options.'
  },
  {
    category: 'Technical',
    question: 'How does version control work?',
    answer: 'FlashFusion integrates directly with GitHub, GitLab, and Bitbucket. All changes are automatically committed with detailed messages. You can also connect existing repositories.'
  },
  {
    category: 'Security',
    question: 'How secure is my code?',
    answer: 'Your code is encrypted at rest and in transit using AES-256 and TLS 1.3. We\'re SOC 2 compliant and undergo regular security audits. Your data is never used to train AI models.'
  },
  {
    category: 'Security',
    question: 'Where is my data stored?',
    answer: 'Data is stored in secure, geo-redundant data centers. You can choose your preferred region (US, EU, or Asia). Enterprise plans support on-premise deployment.'
  },
  {
    category: 'Security',
    question: 'Do you support SSO?',
    answer: 'Yes, Enterprise plans include SSO support via SAML 2.0, OAuth 2.0, and OpenID Connect. We integrate with Okta, Azure AD, Google Workspace, and custom identity providers.'
  },
  {
    category: 'Features',
    question: 'What AI models does FlashFusion use?',
    answer: 'We use a combination of GPT-4, Claude 3, Gemini, and specialized code models. Professional plans get access to all models. Starter plans use GPT-3.5 and Claude Instant.'
  },
  {
    category: 'Features',
    question: 'Can I collaborate with my team?',
    answer: 'Yes! Professional and Enterprise plans include team collaboration features like real-time editing, comments, code reviews, and role-based access control.'
  },
  {
    category: 'Features',
    question: 'What analytics are included?',
    answer: 'FlashFusion includes real-time analytics for app performance, user behavior, API usage, error tracking, and cost optimization. Enterprise plans add custom dashboards and predictive insights.'
  },
  {
    category: 'Features',
    question: 'Can I export my code?',
    answer: 'Absolutely! You own 100% of your code. Export as a ZIP file, push to GitHub, or deploy directly. No vendor lock-in—you can take your code anywhere.'
  },
  {
    category: 'Features',
    question: 'Do you provide templates?',
    answer: 'Yes, we offer 50+ production-ready templates for common use cases: SaaS apps, e-commerce, landing pages, dashboards, APIs, and more. All templates are fully customizable.'
  }
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        className="py-20 px-6"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 123, 0, 0.1) 0%, rgba(0, 180, 216, 0.1) 100%)'
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 
            className="mb-6"
            style={{
              fontFamily: 'var(--ff-font-primary)',
              fontSize: 'var(--ff-text-5xl)',
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
            className="text-xl mb-8"
            style={{
              color: 'var(--ff-text-secondary)',
              fontFamily: 'var(--ff-font-secondary)',
              lineHeight: 'var(--ff-leading-relaxed)'
            }}
          >
            Everything you need to know about FlashFusion
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5"
              style={{ color: 'var(--ff-text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg border-2 focus:outline-none focus:ring-2"
              style={{
                background: 'var(--ff-surface)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: 'var(--ff-text-primary)',
                fontFamily: 'var(--ff-font-secondary)',
                fontSize: 'var(--ff-text-base)'
              }}
            />
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-8 px-6 sticky top-0 z-10" style={{ background: 'var(--ff-bg-dark)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className="px-6 py-2 rounded-lg transition-all hover:scale-105"
                style={{
                  background: activeCategory === category 
                    ? 'var(--ff-gradient-primary)'
                    : 'transparent',
                  border: activeCategory === category
                    ? 'none'
                    : '2px solid rgba(255, 255, 255, 0.1)',
                  color: activeCategory === category
                    ? 'white'
                    : 'var(--ff-text-secondary)',
                  fontFamily: 'var(--ff-font-primary)',
                  fontWeight: 'var(--ff-weight-semibold)',
                  fontSize: 'var(--ff-text-sm)'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <p 
                style={{
                  color: 'var(--ff-text-muted)',
                  fontFamily: 'var(--ff-font-secondary)',
                  fontSize: 'var(--ff-text-lg)'
                }}
              >
                No FAQs found matching your search.
              </p>
            </div>
          ) : (
            filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="border rounded-lg overflow-hidden transition-all"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: expandedIndex === index 
                    ? 'var(--ff-primary)' 
                    : 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-opacity-80 transition-all"
                >
                  <div className="flex-1">
                    <div 
                      className="inline-block px-3 py-1 rounded-full mb-2"
                      style={{
                        background: 'var(--ff-primary)20',
                        color: 'var(--ff-primary)',
                        fontFamily: 'var(--ff-font-primary)',
                        fontSize: 'var(--ff-text-xs)',
                        fontWeight: 'var(--ff-weight-semibold)'
                      }}
                    >
                      {faq.category}
                    </div>
                    <h3 
                      style={{
                        fontFamily: 'var(--ff-font-primary)',
                        fontSize: 'var(--ff-text-lg)',
                        fontWeight: 'var(--ff-weight-semibold)',
                        color: 'var(--ff-text-primary)'
                      }}
                    >
                      {faq.question}
                    </h3>
                  </div>
                  <div>
                    {expandedIndex === index ? (
                      <ChevronUp 
                        className="h-5 w-5" 
                        style={{ color: 'var(--ff-primary)' }}
                      />
                    ) : (
                      <ChevronDown 
                        className="h-5 w-5" 
                        style={{ color: 'var(--ff-text-muted)' }}
                      />
                    )}
                  </div>
                </button>

                {expandedIndex === index && (
                  <div 
                    className="px-6 pb-4 pt-2"
                    style={{
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <p 
                      style={{
                        color: 'var(--ff-text-secondary)',
                        fontFamily: 'var(--ff-font-secondary)',
                        lineHeight: 'var(--ff-leading-relaxed)'
                      }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-6">
        <div 
          className="max-w-3xl mx-auto text-center p-12 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 123, 0, 0.1) 0%, rgba(0, 180, 216, 0.1) 100%)',
            border: '1px solid rgba(255, 123, 0, 0.2)'
          }}
        >
          <h2 
            className="mb-4"
            style={{
              fontFamily: 'var(--ff-font-primary)',
              fontSize: 'var(--ff-text-3xl)',
              fontWeight: 'var(--ff-weight-bold)'
            }}
          >
            Still have questions?
          </h2>
          <p 
            className="mb-6"
            style={{
              color: 'var(--ff-text-secondary)',
              fontFamily: 'var(--ff-font-secondary)',
              fontSize: 'var(--ff-text-lg)'
            }}
          >
            Our team is here to help 24/7
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg transition-all hover:scale-105"
            style={{
              background: 'var(--ff-gradient-primary)',
              color: 'white',
              fontFamily: 'var(--ff-font-primary)',
              fontWeight: 'var(--ff-weight-semibold)',
              boxShadow: 'var(--ff-glow)'
            }}
          >
            Contact Support
          </a>
        </div>
      </section>
    </div>
  );
}
