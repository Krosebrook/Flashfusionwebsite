import { Metadata } from 'next';
import Link from 'next/link';
import BackButton from '../../components/BackButton';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog | FlashFusion - AI Development Insights & Updates',
  description: 'Stay updated with the latest AI development trends, FlashFusion product updates, tutorials, and insights from our engineering team.',
  openGraph: {
    title: 'FlashFusion Blog - AI Development Insights',
    description: 'Latest updates, tutorials, and insights on AI-powered development.',
    type: 'website',
  },
};

// Sample blog posts - in production, these would come from a CMS or database
const blogPosts = [
  {
    id: 1,
    title: 'Introducing Multi-Agent Orchestration: The Future of AI Development',
    excerpt: 'Learn how our multi-agent system coordinates specialized AI agents to build production-ready applications faster than ever.',
    author: 'FlashFusion Team',
    date: '2025-01-15',
    readTime: '5 min read',
    category: 'Product Updates',
    slug: 'multi-agent-orchestration',
    featured: true
  },
  {
    id: 2,
    title: 'Building a Full-Stack Application in Under 10 Minutes',
    excerpt: 'A step-by-step guide to creating and deploying a complete React + Node.js application using FlashFusion\'s AI-powered tools.',
    author: 'Sarah Chen',
    date: '2025-01-10',
    readTime: '8 min read',
    category: 'Tutorials',
    slug: 'full-stack-10-minutes'
  },
  {
    id: 3,
    title: '10x Developer Productivity: AI-Powered Development Best Practices',
    excerpt: 'Discover the strategies and workflows that top developers use to maximize their productivity with AI assistance.',
    author: 'Marcus Johnson',
    date: '2025-01-05',
    readTime: '6 min read',
    category: 'Best Practices',
    slug: 'developer-productivity'
  },
  {
    id: 4,
    title: 'Security First: How FlashFusion Protects Your Code and Data',
    excerpt: 'An inside look at our security architecture, encryption practices, and compliance certifications.',
    author: 'Security Team',
    date: '2025-01-01',
    readTime: '7 min read',
    category: 'Security',
    slug: 'security-first'
  },
  {
    id: 5,
    title: 'From Idea to Production: A Creator\'s Journey with FlashFusion',
    excerpt: 'How one solo creator built and launched a profitable SaaS application in just two weeks using our platform.',
    author: 'Alex Rivera',
    date: '2024-12-28',
    readTime: '10 min read',
    category: 'Case Studies',
    slug: 'creator-journey'
  },
  {
    id: 6,
    title: 'AI Model Comparison: GPT-4 vs Claude vs Gemini for Code Generation',
    excerpt: 'We tested leading AI models on real-world coding tasks. Here\'s what we found.',
    author: 'Research Team',
    date: '2024-12-20',
    readTime: '12 min read',
    category: 'Research',
    slug: 'ai-model-comparison'
  }
];

const categories = ['All', 'Product Updates', 'Tutorials', 'Best Practices', 'Security', 'Case Studies', 'Research'];

export default function BlogPage() {
  return (
    <main className="min-h-screen w-full">
      <BackButton />
      
      {/* Hero Section */}
      <section 
        className="relative py-24 md:py-32 px-6 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 123, 0, 0.05) 0%, rgba(0, 180, 216, 0.05) 50%, rgba(233, 30, 99, 0.05) 100%)'
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 
              className="mb-6"
              style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                fontWeight: '800',
                lineHeight: '1.2'
              }}
            >
              <span className="ff-text-gradient">FlashFusion Blog</span>
            </h1>
            
            <p 
              className="text-xl"
              style={{ 
                color: 'var(--ff-text-secondary)',
                fontFamily: 'Inter, sans-serif',
                lineHeight: '1.8'
              }}
            >
              Insights, tutorials, and updates on AI-powered development
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-6 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 rounded-full border transition-all hover:scale-105"
                style={{
                  borderColor: category === 'All' ? 'var(--ff-primary)' : 'rgba(255, 255, 255, 0.2)',
                  background: category === 'All' ? 'rgba(255, 123, 0, 0.1)' : 'transparent',
                  color: category === 'All' ? 'var(--ff-primary)' : 'var(--ff-text-secondary)',
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {blogPosts.filter(post => post.featured).map(post => (
        <section key={post.id} className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div 
              className="p-12 rounded-3xl border transition-all hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 123, 0, 0.05) 0%, rgba(0, 180, 216, 0.05) 100%)',
                borderColor: 'rgba(255, 123, 0, 0.3)'
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span 
                  className="px-4 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: 'var(--ff-primary)',
                    color: 'white',
                    fontFamily: 'Sora, sans-serif'
                  }}
                >
                  Featured
                </span>
                <span 
                  className="text-sm"
                  style={{
                    color: 'var(--ff-text-muted)',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  {post.category}
                </span>
              </div>

              <h2 
                className="mb-4"
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  fontWeight: '700',
                  color: 'var(--ff-text-primary)',
                  lineHeight: '1.3'
                }}
              >
                {post.title}
              </h2>

              <p 
                className="mb-6"
                style={{ 
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.8',
                  fontSize: '1.125rem'
                }}
              >
                {post.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" style={{ color: 'var(--ff-text-muted)' }} />
                  <span style={{ color: 'var(--ff-text-muted)', fontSize: '0.875rem' }}>
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" style={{ color: 'var(--ff-text-muted)' }} />
                  <span style={{ color: 'var(--ff-text-muted)', fontSize: '0.875rem' }}>
                    {post.readTime}
                  </span>
                </div>
                <span style={{ color: 'var(--ff-text-muted)', fontSize: '0.875rem' }}>
                  By {post.author}
                </span>
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)',
                  color: 'white',
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: '600'
                }}
              >
                Read Article
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      ))}

      {/* Blog Posts Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="mb-12"
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: '700',
              color: 'var(--ff-text-primary)'
            }}
          >
            Latest Articles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.filter(post => !post.featured).map((post) => (
              <article 
                key={post.id}
                className="rounded-2xl border transition-all hover:scale-105 overflow-hidden"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="h-4 w-4" style={{ color: 'var(--ff-primary)' }} />
                    <span 
                      className="text-xs font-semibold"
                      style={{
                        color: 'var(--ff-primary)',
                        fontFamily: 'Sora, sans-serif'
                      }}
                    >
                      {post.category}
                    </span>
                  </div>

                  <h3 
                    className="mb-3"
                    style={{
                      fontFamily: 'Sora, sans-serif',
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: 'var(--ff-text-primary)',
                      lineHeight: '1.4'
                    }}
                  >
                    {post.title}
                  </h3>

                  <p 
                    className="mb-4"
                    style={{ 
                      color: 'var(--ff-text-secondary)',
                      fontFamily: 'Inter, sans-serif',
                      lineHeight: '1.6',
                      fontSize: '0.9375rem'
                    }}
                  >
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mb-4 pb-4 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" style={{ color: 'var(--ff-text-muted)' }} />
                      <span style={{ color: 'var(--ff-text-muted)', fontSize: '0.8125rem' }}>
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" style={{ color: 'var(--ff-text-muted)' }} />
                      <span style={{ color: 'var(--ff-text-muted)', fontSize: '0.8125rem' }}>
                        {post.readTime}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 transition-colors"
                    style={{
                      color: 'var(--ff-primary)',
                      fontFamily: 'Sora, sans-serif',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}
                  >
                    Read More
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section 
        className="py-24 px-6"
        style={{ 
          background: 'linear-gradient(135deg, rgba(255, 123, 0, 0.1) 0%, rgba(0, 180, 216, 0.1) 100%)'
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="mb-4"
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 2.5rem)',
              fontWeight: '700',
              color: 'var(--ff-text-primary)'
            }}
          >
            Stay Updated
          </h2>
          <p 
            className="mb-8"
            style={{ 
              color: 'var(--ff-text-secondary)',
              fontFamily: 'Inter, sans-serif',
              lineHeight: '1.8',
              fontSize: '1.125rem'
            }}
          >
            Get the latest insights, tutorials, and product updates delivered to your inbox
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-6 py-4 rounded-xl border focus:outline-none focus:border-[var(--ff-primary)] transition-colors"
              style={{
                background: 'var(--ff-surface)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: 'var(--ff-text-primary)',
                fontFamily: 'Inter, sans-serif'
              }}
            />
            <button
              type="submit"
              className="px-8 py-4 rounded-xl transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)',
                color: 'white',
                fontFamily: 'Sora, sans-serif',
                fontWeight: '600',
                border: 'none'
              }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
