import { Metadata } from 'next';
import Link from 'next/link';
import BackButton from '../../components/BackButton';
import { BookOpen, Code, Rocket, Wrench, Zap, ArrowRight, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Documentation | FlashFusion - Developer Guides & Resources',
  description: 'Comprehensive documentation for FlashFusion\'s AI-powered development platform. API references, guides, and tutorials.',
  openGraph: {
    title: 'FlashFusion Documentation - Developer Resources',
    description: 'Complete guides, API references, and tutorials for building with FlashFusion.',
    type: 'website',
  },
};

const docCategories = [
  {
    icon: Rocket,
    title: 'Getting Started',
    description: 'Quick start guides and platform introduction for new users.',
    color: 'var(--ff-primary)',
    links: [
      { label: 'Platform Overview', href: '/docs/overview' },
      { label: 'Quick Start Guide', href: '/docs/quickstart' },
      { label: 'Installation', href: '/docs/installation' },
      { label: 'First Project', href: '/docs/first-project' }
    ]
  },
  {
    icon: Code,
    title: 'Core Concepts',
    description: 'Understanding FlashFusion\'s architecture and key features.',
    color: 'var(--ff-secondary)',
    links: [
      { label: 'Multi-Agent Orchestration', href: '/docs/multi-agent' },
      { label: 'Code Generation', href: '/docs/code-generation' },
      { label: 'Deployment Pipeline', href: '/docs/deployment' },
      { label: 'Project Management', href: '/docs/projects' }
    ]
  },
  {
    icon: Wrench,
    title: 'Tools & Features',
    description: 'Detailed guides for each tool and feature in the platform.',
    color: 'var(--ff-accent)',
    links: [
      { label: 'AI Code Generator', href: '/docs/tools/code-generator' },
      { label: 'Content Creation Suite', href: '/docs/tools/content' },
      { label: 'Analytics Dashboard', href: '/docs/tools/analytics' },
      { label: 'Collaboration Tools', href: '/docs/tools/collaboration' }
    ]
  },
  {
    icon: Zap,
    title: 'Advanced Topics',
    description: 'Deep dives into advanced features and customization.',
    color: '#10B981',
    links: [
      { label: 'Custom Integrations', href: '/docs/advanced/integrations' },
      { label: 'API Webhooks', href: '/docs/advanced/webhooks' },
      { label: 'Performance Optimization', href: '/docs/advanced/performance' },
      { label: 'Security Best Practices', href: '/docs/advanced/security' }
    ]
  }
];

const popularDocs = [
  { title: 'Building Your First App', href: '/docs/first-app', category: 'Getting Started' },
  { title: 'API Authentication', href: '/docs/api/auth', category: 'API Reference' },
  { title: 'Deployment Guide', href: '/docs/deployment-guide', category: 'Deployment' },
  { title: 'Webhook Configuration', href: '/docs/webhooks', category: 'Integrations' },
  { title: 'Troubleshooting', href: '/docs/troubleshooting', category: 'Support' }
];

export default function DocsPage() {
  return (
    <main className="min-h-screen w-full">
      <BackButton />
      
      {/* Hero Section */}
      <section 
        className="py-24 md:py-32 px-6"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 123, 0, 0.05) 0%, rgba(0, 180, 216, 0.05) 100%)'
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8"
              style={{
                background: 'rgba(255, 123, 0, 0.1)',
                color: 'var(--ff-primary)'
              }}
            >
              <BookOpen className="h-10 w-10" />
            </div>

            <h1 
              className="mb-6"
              style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                fontWeight: '800',
                color: 'var(--ff-text-primary)'
              }}
            >
              Documentation
            </h1>
            
            <p 
              className="text-xl mb-8"
              style={{ 
                color: 'var(--ff-text-secondary)',
                fontFamily: 'Inter, sans-serif',
                lineHeight: '1.8',
                fontSize: 'clamp(1rem, 2vw, 1.25rem)'
              }}
            >
              Everything you need to build with FlashFusion
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div 
                className="flex items-center gap-3 px-6 py-4 rounded-xl border"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                }}
              >
                <Search className="h-5 w-5" style={{ color: 'var(--ff-text-muted)' }} />
                <input
                  type="search"
                  placeholder="Search documentation..."
                  className="flex-1 bg-transparent border-none outline-none"
                  style={{
                    color: 'var(--ff-text-primary)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Categories */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {docCategories.map((category, index) => (
              <div 
                key={index}
                className="p-8 rounded-2xl border transition-all hover:scale-105"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{
                    background: `${category.color}15`,
                    color: category.color
                  }}
                >
                  <category.icon className="h-7 w-7" />
                </div>

                <h2 
                  className="mb-3"
                  style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: 'var(--ff-text-primary)'
                  }}
                >
                  {category.title}
                </h2>

                <p 
                  className="mb-6"
                  style={{ 
                    color: 'var(--ff-text-secondary)',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: '1.7',
                    fontSize: '0.95rem'
                  }}
                >
                  {category.description}
                </p>

                <div className="space-y-2">
                  {category.links.map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      href={link.href}
                      className="flex items-center justify-between p-3 rounded-lg transition-colors group"
                      style={{
                        background: 'transparent'
                      }}
                    >
                      <span 
                        style={{
                          color: 'var(--ff-text-secondary)',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.9375rem'
                        }}
                        className="group-hover:text-[var(--ff-primary)]"
                      >
                        {link.label}
                      </span>
                      <ArrowRight 
                        className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" 
                        style={{ color: 'var(--ff-primary)' }} 
                      />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Docs */}
      <section 
        className="py-24 px-6"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(255, 123, 0, 0.03) 100%)'
        }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 
            className="mb-12"
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 2.5rem)',
              fontWeight: '700',
              color: 'var(--ff-text-primary)'
            }}
          >
            Popular Documentation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDocs.map((doc, index) => (
              <Link
                key={index}
                href={doc.href}
                className="p-6 rounded-xl border transition-all hover:scale-105 group"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: 'rgba(255, 123, 0, 0.1)',
                      color: 'var(--ff-primary)',
                      fontFamily: 'Sora, sans-serif'
                    }}
                  >
                    {doc.category}
                  </span>
                  <ArrowRight 
                    className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" 
                    style={{ color: 'var(--ff-primary)' }} 
                  />
                </div>
                <h3 
                  style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: 'var(--ff-text-primary)'
                  }}
                  className="group-hover:text-[var(--ff-primary)]"
                >
                  {doc.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              href="/api"
              className="p-8 rounded-2xl border transition-all hover:scale-105 text-center"
              style={{
                background: 'var(--ff-surface)',
                borderColor: 'rgba(255, 123, 0, 0.2)'
              }}
            >
              <Code className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--ff-primary)' }} />
              <h3 
                className="mb-2"
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: 'var(--ff-text-primary)'
                }}
              >
                API Reference
              </h3>
              <p 
                style={{ 
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9375rem'
                }}
              >
                Complete API documentation
              </p>
            </Link>

            <Link
              href="/tutorials"
              className="p-8 rounded-2xl border transition-all hover:scale-105 text-center"
              style={{
                background: 'var(--ff-surface)',
                borderColor: 'rgba(0, 180, 216, 0.2)'
              }}
            >
              <BookOpen className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--ff-secondary)' }} />
              <h3 
                className="mb-2"
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: 'var(--ff-text-primary)'
                }}
              >
                Tutorials
              </h3>
              <p 
                style={{ 
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9375rem'
                }}
              >
                Step-by-step guides
              </p>
            </Link>

            <Link
              href="/contact"
              className="p-8 rounded-2xl border transition-all hover:scale-105 text-center"
              style={{
                background: 'var(--ff-surface)',
                borderColor: 'rgba(233, 30, 99, 0.2)'
              }}
            >
              <Rocket className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--ff-accent)' }} />
              <h3 
                className="mb-2"
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: 'var(--ff-text-primary)'
                }}
              >
                Get Help
              </h3>
              <p 
                style={{ 
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9375rem'
                }}
              >
                Contact support
              </p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
