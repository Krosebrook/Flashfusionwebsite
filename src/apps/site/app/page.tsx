import { Metadata } from 'next';
import Link from 'next/link';
import ConsentBanner from './consent-banner';
import { submitLead } from './actions';
import BackButton from '../components/BackButton';
import SmartDownloadButton from '../components/SmartDownloadButton';
import { 
  Rocket, 
  Code2, 
  Zap, 
  Shield, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  BarChart3
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'FlashFusion - AI-Powered Development Platform | Build Apps 10x Faster',
  description: 'Transform ideas into production-ready applications with FlashFusion\'s multi-agent AI orchestration. Full-stack builder, intelligent automation, and enterprise-grade tools for modern developers.',
  keywords: 'AI development platform, full-stack builder, multi-agent AI, code generation, automated deployment, business intelligence, developer tools',
  openGraph: {
    title: 'FlashFusion - AI-Powered Development Platform',
    description: 'Build production-ready applications 10x faster with AI-powered tools and multi-agent orchestration.',
    type: 'website',
    url: 'https://flashfusion.co',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlashFusion - AI-Powered Development Platform',
    description: 'Transform ideas into production-ready apps with AI orchestration',
  }
};

export default function HomePage() {
  return (
    <>
      <main className="min-h-screen w-full">
        {/* Hero Section */}
        <section 
          className="relative py-24 md:py-32 px-6 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 123, 0, 0.05) 0%, rgba(0, 180, 216, 0.05) 50%, rgba(233, 30, 99, 0.05) 100%)'
          }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div 
              className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20"
              style={{ background: 'var(--ff-primary)' }}
            />
            <div 
              className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20"
              style={{ background: 'var(--ff-secondary)' }}
            />
          </div>

          <div className="max-w-6xl mx-auto relative">
            <div className="text-center max-w-4xl mx-auto mb-16">
              {/* Badge */}
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                style={{
                  background: 'rgba(255, 123, 0, 0.1)',
                  border: '1px solid rgba(255, 123, 0, 0.3)'
                }}
              >
                <Sparkles className="h-4 w-4" style={{ color: 'var(--ff-primary)' }} />
                <span 
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-sm)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    color: 'var(--ff-primary)'
                  }}
                >
                  Now in Beta • Join 1,000+ Developers
                </span>
              </div>

              {/* Main Heading */}
              <h1 
                className="mb-8"
                style={{
                  fontFamily: 'var(--ff-font-primary)',
                  fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                  fontWeight: 'var(--ff-weight-extrabold)',
                  lineHeight: 'var(--ff-leading-tight)',
                  letterSpacing: '-0.02em'
                }}
              >
                <span 
                  className="block mb-2"
                  style={{
                    background: 'linear-gradient(135deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Build Apps 10x Faster
                </span>
                <span 
                  className="block"
                  style={{
                    fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                    color: 'var(--ff-text-primary)',
                    fontWeight: 'var(--ff-weight-bold)'
                  }}
                >
                  with AI-Powered Development
                </span>
              </h1>
              
              {/* Description */}
              <p 
                className="text-xl mb-12 max-w-3xl mx-auto"
                style={{ 
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'var(--ff-font-secondary)',
                  lineHeight: 'var(--ff-leading-relaxed)',
                  fontSize: 'clamp(1rem, 2vw, 1.25rem)'
                }}
              >
                Transform ideas into production-ready applications with multi-agent AI orchestration, 
                intelligent automation, and comprehensive development tools. Ship faster, scale smarter.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)',
                    color: 'white',
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-lg)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    boxShadow: '0 10px 40px rgba(255, 123, 0, 0.3)'
                  }}
                >
                  <Rocket className="h-5 w-5" />
                  Get Started Free
                </Link>

                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 transition-all hover:scale-105"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'var(--ff-text-primary)',
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-lg)',
                    fontWeight: 'var(--ff-weight-semibold)'
                  }}
                >
                  Watch Demo
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-8 justify-center items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" style={{ color: 'var(--ff-success)' }} />
                  <span 
                    style={{
                      color: 'var(--ff-text-muted)',
                      fontFamily: 'var(--ff-font-secondary)',
                      fontSize: 'var(--ff-text-sm)'
                    }}
                  >
                    No credit card required
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" style={{ color: 'var(--ff-success)' }} />
                  <span 
                    style={{
                      color: 'var(--ff-text-muted)',
                      fontFamily: 'var(--ff-font-secondary)',
                      fontSize: 'var(--ff-text-sm)'
                    }}
                  >
                    14-day free trial
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" style={{ color: 'var(--ff-success)' }} />
                  <span 
                    style={{
                      color: 'var(--ff-text-muted)',
                      fontFamily: 'var(--ff-font-secondary)',
                      fontSize: 'var(--ff-text-sm)'
                    }}
                  >
                    Cancel anytime
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-6 border-y" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '10x', label: 'Faster Development' },
                { value: '99.9%', label: 'Uptime SLA' },
                { value: '1,000+', label: 'Developers' },
                { value: '50k+', label: 'Apps Deployed' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div 
                    className="mb-2"
                    style={{
                      fontFamily: 'var(--ff-font-primary)',
                      fontSize: 'clamp(2rem, 4vw, 3rem)',
                      fontWeight: 'var(--ff-weight-extrabold)',
                      background: 'linear-gradient(135deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    {stat.value}
                  </div>
                  <div 
                    style={{
                      color: 'var(--ff-text-muted)',
                      fontFamily: 'var(--ff-font-secondary)',
                      fontSize: 'var(--ff-text-sm)'
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 
                className="mb-4"
                style={{
                  fontFamily: 'var(--ff-font-primary)',
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: 'var(--ff-weight-bold)',
                  color: 'var(--ff-text-primary)'
                }}
              >
                Everything You Need to Ship Fast
              </h2>
              <p 
                className="text-xl max-w-2xl mx-auto"
                style={{
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'var(--ff-font-secondary)',
                  lineHeight: 'var(--ff-leading-relaxed)'
                }}
              >
                Comprehensive AI-powered tools for modern development teams
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div 
                className="p-8 rounded-2xl border transition-all hover:scale-105 hover:shadow-2xl"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{
                    background: 'rgba(255, 123, 0, 0.1)',
                    color: 'var(--ff-primary)'
                  }}
                >
                  <Code2 className="h-7 w-7" />
                </div>
                <h3 
                  className="mb-3"
                  style={{ 
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-xl)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    color: 'var(--ff-text-primary)'
                  }}
                >
                  AI Code Generation
                </h3>
                <p 
                  style={{ 
                    color: 'var(--ff-text-secondary)',
                    fontFamily: 'var(--ff-font-secondary)',
                    fontSize: 'var(--ff-text-base)',
                    lineHeight: 'var(--ff-leading-relaxed)',
                    marginBottom: '1rem'
                  }}
                >
                  Generate production-ready code across 15+ frameworks with intelligent context awareness and best practices.
                </p>
                <Link
                  href="/features#code-generation"
                  className="inline-flex items-center gap-1 transition-colors"
                  style={{
                    color: 'var(--ff-primary)',
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-sm)',
                    fontWeight: 'var(--ff-weight-semibold)'
                  }}
                >
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Feature 2 */}
              <div 
                className="p-8 rounded-2xl border transition-all hover:scale-105 hover:shadow-2xl"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{
                    background: 'rgba(0, 180, 216, 0.1)',
                    color: 'var(--ff-secondary)'
                  }}
                >
                  <Users className="h-7 w-7" />
                </div>
                <h3 
                  className="mb-3"
                  style={{ 
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-xl)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    color: 'var(--ff-text-primary)'
                  }}
                >
                  Multi-Agent Orchestration
                </h3>
                <p 
                  style={{ 
                    color: 'var(--ff-text-secondary)',
                    fontFamily: 'var(--ff-font-secondary)',
                    fontSize: 'var(--ff-text-base)',
                    lineHeight: 'var(--ff-leading-relaxed)',
                    marginBottom: '1rem'
                  }}
                >
                  Coordinate multiple AI agents to handle complex workflows with intelligent task distribution and optimization.
                </p>
                <Link
                  href="/features#multi-agent"
                  className="inline-flex items-center gap-1 transition-colors"
                  style={{
                    color: 'var(--ff-secondary)',
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-sm)',
                    fontWeight: 'var(--ff-weight-semibold)'
                  }}
                >
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Feature 3 */}
              <div 
                className="p-8 rounded-2xl border transition-all hover:scale-105 hover:shadow-2xl"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{
                    background: 'rgba(233, 30, 99, 0.1)',
                    color: 'var(--ff-accent)'
                  }}
                >
                  <Zap className="h-7 w-7" />
                </div>
                <h3 
                  className="mb-3"
                  style={{ 
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-xl)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    color: 'var(--ff-text-primary)'
                  }}
                >
                  One-Click Deployment
                </h3>
                <p 
                  style={{ 
                    color: 'var(--ff-text-secondary)',
                    fontFamily: 'var(--ff-font-secondary)',
                    fontSize: 'var(--ff-text-base)',
                    lineHeight: 'var(--ff-leading-relaxed)',
                    marginBottom: '1rem'
                  }}
                >
                  Deploy to 8+ platforms instantly with automated CI/CD, zero-downtime updates, and rollback capabilities.
                </p>
                <Link
                  href="/features#deployment"
                  className="inline-flex items-center gap-1 transition-colors"
                  style={{
                    color: 'var(--ff-accent)',
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-sm)',
                    fontWeight: 'var(--ff-weight-semibold)'
                  }}
                >
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Feature 4 */}
              <div 
                className="p-8 rounded-2xl border transition-all hover:scale-105 hover:shadow-2xl"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    color: 'var(--ff-success)'
                  }}
                >
                  <BarChart3 className="h-7 w-7" />
                </div>
                <h3 
                  className="mb-3"
                  style={{ 
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-xl)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    color: 'var(--ff-text-primary)'
                  }}
                >
                  Business Intelligence
                </h3>
                <p 
                  style={{ 
                    color: 'var(--ff-text-secondary)',
                    fontFamily: 'var(--ff-font-secondary)',
                    fontSize: 'var(--ff-text-base)',
                    lineHeight: 'var(--ff-leading-relaxed)',
                    marginBottom: '1rem'
                  }}
                >
                  Real-time analytics, performance monitoring, and AI-powered insights to optimize your applications.
                </p>
                <Link
                  href="/features#analytics"
                  className="inline-flex items-center gap-1 transition-colors"
                  style={{
                    color: 'var(--ff-success)',
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-sm)',
                    fontWeight: 'var(--ff-weight-semibold)'
                  }}
                >
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Feature 5 */}
              <div 
                className="p-8 rounded-2xl border transition-all hover:scale-105 hover:shadow-2xl"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    color: '#8B5CF6'
                  }}
                >
                  <Shield className="h-7 w-7" />
                </div>
                <h3 
                  className="mb-3"
                  style={{ 
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-xl)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    color: 'var(--ff-text-primary)'
                  }}
                >
                  Enterprise Security
                </h3>
                <p 
                  style={{ 
                    color: 'var(--ff-text-secondary)',
                    fontFamily: 'var(--ff-font-secondary)',
                    fontSize: 'var(--ff-text-base)',
                    lineHeight: 'var(--ff-leading-relaxed)',
                    marginBottom: '1rem'
                  }}
                >
                  SOC 2 compliant with advanced threat detection, encryption, and compliance monitoring built-in.
                </p>
                <Link
                  href="/features#security"
                  className="inline-flex items-center gap-1 transition-colors"
                  style={{
                    color: '#8B5CF6',
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-sm)',
                    fontWeight: 'var(--ff-weight-semibold)'
                  }}
                >
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Feature 6 */}
              <div 
                className="p-8 rounded-2xl border transition-all hover:scale-105 hover:shadow-2xl"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{
                    background: 'rgba(251, 191, 36, 0.1)',
                    color: '#FBB F24'
                  }}
                >
                  <TrendingUp className="h-7 w-7" />
                </div>
                <h3 
                  className="mb-3"
                  style={{ 
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-xl)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    color: 'var(--ff-text-primary)'
                  }}
                >
                  Creator Commerce
                </h3>
                <p 
                  style={{ 
                    color: 'var(--ff-text-secondary)',
                    fontFamily: 'var(--ff-font-secondary)',
                    fontSize: 'var(--ff-text-base)',
                    lineHeight: 'var(--ff-leading-relaxed)',
                    marginBottom: '1rem'
                  }}
                >
                  Monetize your creations with integrated payment processing, analytics, and marketplace features.
                </p>
                <Link
                  href="/features#commerce"
                  className="inline-flex items-center gap-1 transition-colors"
                  style={{
                    color: '#FBBF24',
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-sm)',
                    fontWeight: 'var(--ff-weight-semibold)'
                  }}
                >
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* View All Features CTA */}
            <div className="text-center mt-12">
              <Link
                href="/features"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all hover:scale-105"
                style={{
                  borderColor: 'var(--ff-primary)',
                  color: 'var(--ff-primary)',
                  fontFamily: 'var(--ff-font-primary)',
                  fontWeight: 'var(--ff-weight-semibold)'
                }}
              >
                View All Features
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section 
          className="py-24 px-6"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(255, 123, 0, 0.03) 100%)'
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 
                className="mb-4"
                style={{
                  fontFamily: 'var(--ff-font-primary)',
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: 'var(--ff-weight-bold)',
                  color: 'var(--ff-text-primary)'
                }}
              >
                How FlashFusion Works
              </h2>
              <p 
                className="text-xl max-w-2xl mx-auto"
                style={{
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'var(--ff-font-secondary)',
                  lineHeight: 'var(--ff-leading-relaxed)'
                }}
              >
                From idea to production in three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  step: '01',
                  title: 'Describe Your App',
                  description: 'Tell our AI what you want to build. Use natural language—no technical expertise required.',
                  icon: '💬'
                },
                {
                  step: '02',
                  title: 'AI Generates Everything',
                  description: 'Watch as multiple AI agents collaborate to create your frontend, backend, database, and infrastructure.',
                  icon: '⚡'
                },
                {
                  step: '03',
                  title: 'Deploy & Scale',
                  description: 'Deploy instantly to your preferred platform. Monitor, optimize, and scale with built-in analytics.',
                  icon: '🚀'
                }
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div 
                    className="text-8xl mb-4 opacity-10 absolute -top-4 -left-2"
                    style={{
                      fontFamily: 'var(--ff-font-primary)',
                      fontWeight: 'var(--ff-weight-extrabold)',
                      color: 'var(--ff-primary)'
                    }}
                  >
                    {item.step}
                  </div>
                  <div className="relative">
                    <div className="text-5xl mb-6">{item.icon}</div>
                    <h3 
                      className="mb-3"
                      style={{
                        fontFamily: 'var(--ff-font-primary)',
                        fontSize: 'var(--ff-text-2xl)',
                        fontWeight: 'var(--ff-weight-semibold)',
                        color: 'var(--ff-text-primary)'
                      }}
                    >
                      {item.title}
                    </h3>
                    <p 
                      style={{
                        color: 'var(--ff-text-secondary)',
                        fontFamily: 'var(--ff-font-secondary)',
                        lineHeight: 'var(--ff-leading-relaxed)'
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 
              className="mb-12"
              style={{
                fontFamily: 'var(--ff-font-primary)',
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 'var(--ff-weight-bold)',
                color: 'var(--ff-text-primary)'
              }}
            >
              Trusted by Modern Development Teams
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  quote: "FlashFusion cut our development time by 75%. What used to take weeks now takes days.",
                  author: "Sarah Chen",
                  role: "CTO, TechStartup Inc"
                },
                {
                  quote: "The multi-agent orchestration is game-changing. It's like having an entire team working 24/7.",
                  author: "Marcus Johnson",
                  role: "Lead Developer, Innovation Labs"
                }
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="p-8 rounded-2xl border text-left"
                  style={{
                    background: 'var(--ff-surface)',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <p 
                    className="mb-6"
                    style={{
                      color: 'var(--ff-text-primary)',
                      fontFamily: 'var(--ff-font-secondary)',
                      fontSize: 'var(--ff-text-lg)',
                      lineHeight: 'var(--ff-leading-relaxed)',
                      fontStyle: 'italic'
                    }}
                  >
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <div 
                      style={{
                        fontFamily: 'var(--ff-font-primary)',
                        fontWeight: 'var(--ff-weight-semibold)',
                        color: 'var(--ff-text-primary)',
                        marginBottom: '0.25rem'
                      }}
                    >
                      {testimonial.author}
                    </div>
                    <div 
                      style={{
                        color: 'var(--ff-text-muted)',
                        fontFamily: 'var(--ff-font-secondary)',
                        fontSize: 'var(--ff-text-sm)'
                      }}
                    >
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
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
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 'var(--ff-weight-extrabold)',
                color: 'var(--ff-text-primary)'
              }}
            >
              Ready to Build Faster?
            </h2>
            <p 
              className="text-xl mb-12 max-w-2xl mx-auto"
              style={{ 
                color: 'var(--ff-text-secondary)',
                fontFamily: 'var(--ff-font-secondary)',
                lineHeight: 'var(--ff-leading-relaxed)'
              }}
            >
              Join thousands of developers shipping production-ready apps 10x faster with FlashFusion
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-10 py-5 rounded-xl transition-all hover:scale-105 shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)',
                  color: 'white',
                  fontFamily: 'var(--ff-font-primary)',
                  fontSize: 'var(--ff-text-xl)',
                  fontWeight: 'var(--ff-weight-semibold)',
                  boxShadow: '0 20px 60px rgba(255, 123, 0, 0.4)'
                }}
              >
                Start Building Free
                <Rocket className="h-6 w-6" />
              </Link>

              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-10 py-5 rounded-xl border-2 transition-all hover:scale-105"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'var(--ff-text-primary)',
                  fontFamily: 'var(--ff-font-primary)',
                  fontSize: 'var(--ff-text-xl)',
                  fontWeight: 'var(--ff-weight-semibold)'
                }}
              >
                View Pricing
              </Link>
            </div>

            <p 
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

        {/* Footer */}
        <footer 
          className="py-16 px-6" 
          style={{ 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'var(--ff-bg-dark)'
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {/* Product */}
              <div>
                <h3 
                  className="mb-4"
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    color: 'var(--ff-text-primary)',
                    fontSize: 'var(--ff-text-sm)'
                  }}
                >
                  Product
                </h3>
                <ul className="space-y-2">
                  {['Features', 'Pricing', 'Download', 'Demo'].map((item) => (
                    <li key={item}>
                      <Link
                        href={`/${item.toLowerCase()}`}
                        className="transition-colors"
                        style={{
                          color: 'var(--ff-text-muted)',
                          fontFamily: 'var(--ff-font-secondary)',
                          fontSize: 'var(--ff-text-sm)'
                        }}
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 
                  className="mb-4"
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    color: 'var(--ff-text-primary)',
                    fontSize: 'var(--ff-text-sm)'
                  }}
                >
                  Company
                </h3>
                <ul className="space-y-2">
                  {['About', 'Contact', 'FAQ'].map((item) => (
                    <li key={item}>
                      <Link
                        href={`/${item.toLowerCase()}`}
                        className="transition-colors"
                        style={{
                          color: 'var(--ff-text-muted)',
                          fontFamily: 'var(--ff-font-secondary)',
                          fontSize: 'var(--ff-text-sm)'
                        }}
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 
                  className="mb-4"
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    color: 'var(--ff-text-primary)',
                    fontSize: 'var(--ff-text-sm)'
                  }}
                >
                  Resources
                </h3>
                <ul className="space-y-2">
                  {[
                    { name: 'Documentation', href: '/docs' },
                    { name: 'API Reference', href: '/api' },
                    { name: 'Tutorials', href: '/tutorials' },
                    { name: 'Blog', href: '/blog' }
                  ].map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="transition-colors"
                        style={{
                          color: 'var(--ff-text-muted)',
                          fontFamily: 'var(--ff-font-secondary)',
                          fontSize: 'var(--ff-text-sm)'
                        }}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 
                  className="mb-4"
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    color: 'var(--ff-text-primary)',
                    fontSize: 'var(--ff-text-sm)'
                  }}
                >
                  Legal
                </h3>
                <ul className="space-y-2">
                  {[
                    { name: 'Privacy Policy', href: '/privacy' },
                    { name: 'Terms of Service', href: '/terms' },
                    { name: 'Security', href: '/security' }
                  ].map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="transition-colors"
                        style={{
                          color: 'var(--ff-text-muted)',
                          fontFamily: 'var(--ff-font-secondary)',
                          fontSize: 'var(--ff-text-sm)'
                        }}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div 
              className="pt-8 border-t text-center"
              style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <p 
                style={{ 
                  color: 'var(--ff-text-muted)',
                  fontFamily: 'var(--ff-font-secondary)',
                  fontSize: 'var(--ff-text-sm)'
                }}
              >
                © 2025 FlashFusion. Built with AI, for developers. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>

      <ConsentBanner />
    </>
  );
}
