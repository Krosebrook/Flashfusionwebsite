import { Metadata } from 'next';
import Link from 'next/link';
import BackButton from '../../components/BackButton';
import { 
  Zap, 
  Palette, 
  Rocket, 
  DollarSign, 
  Shield, 
  BarChart3,
  Code2,
  Sparkles,
  Cloud,
  Users,
  Lock,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Features | FlashFusion - AI-Powered Development Platform',
  description: 'Explore FlashFusion\'s comprehensive suite of AI-powered features for full-stack development, content creation, deployment, and monetization.',
};

const features = [
  {
    icon: Code2,
    title: 'AI Code Generation',
    description: 'Generate production-ready code across 15+ frameworks with intelligent context awareness and best practices built-in.',
    stats: '99.9% accuracy',
    color: 'var(--ff-primary)',
    benefits: [
      'Full-stack app generation',
      'Component libraries',
      'API endpoints',
      'Database schemas'
    ]
  },
  {
    icon: Palette,
    title: 'Content Creation Suite',
    description: 'Create professional content at scale with AI-powered writing, image generation, and brand consistency tools.',
    stats: '10× faster',
    color: 'var(--ff-secondary)',
    benefits: [
      'Blog posts & articles',
      'Social media content',
      'Marketing copy',
      'AI image generation'
    ]
  },
  {
    icon: Rocket,
    title: 'One-Click Deploy',
    description: 'Deploy to 8+ cloud platforms instantly with intelligent infrastructure provisioning and zero-config setup.',
    stats: '< 60 seconds',
    color: 'var(--ff-accent)',
    benefits: [
      'AWS, Vercel, Netlify',
      'Auto SSL & CDN',
      'CI/CD pipelines',
      'Environment management'
    ]
  },
  {
    icon: DollarSign,
    title: 'Revenue Streams',
    description: 'Monetize your creations with integrated payment processing, subscription management, and analytics.',
    stats: '$500K+ processed',
    color: 'var(--ff-success)',
    benefits: [
      'Stripe integration',
      'Subscription billing',
      'Digital products',
      'Affiliate tracking'
    ]
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level security with SOC 2 compliance, end-to-end encryption, and advanced threat detection.',
    stats: '100% uptime SLA',
    color: 'var(--ff-error)',
    benefits: [
      'Data encryption',
      'SSO & 2FA',
      'Compliance reports',
      'Security audits'
    ]
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    description: 'Real-time analytics dashboards with AI-powered insights and predictive recommendations.',
    stats: 'Real-time data',
    color: 'var(--ff-warning)',
    benefits: [
      'User behavior tracking',
      'Performance metrics',
      'AI recommendations',
      'Custom reports'
    ]
  }
];

const advancedFeatures = [
  {
    icon: Sparkles,
    title: 'Multi-Agent Orchestration',
    description: 'Deploy specialized AI agents that collaborate to handle complex development workflows autonomously.'
  },
  {
    icon: Cloud,
    title: 'Infrastructure as Code',
    description: 'Automatically generate Terraform, CloudFormation, and Kubernetes configs for any architecture.'
  },
  {
    icon: Users,
    title: 'Real-Time Collaboration',
    description: 'Work with your team in real-time with live code editing, comments, and AI-assisted reviews.'
  },
  {
    icon: Lock,
    title: 'Compliance Automation',
    description: 'Automatically ensure GDPR, HIPAA, and SOC 2 compliance with built-in validation and reporting.'
  },
  {
    icon: TrendingUp,
    title: 'Predictive Scaling',
    description: 'AI predicts traffic patterns and automatically scales infrastructure before demand spikes.'
  },
  {
    icon: Zap,
    title: 'Edge Computing',
    description: 'Deploy serverless functions to 200+ edge locations worldwide for ultra-low latency.'
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        className="relative py-24 px-6 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 123, 0, 0.1) 0%, rgba(0, 180, 216, 0.1) 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <BackButton href="/" label="Back to Home" className="mb-8" />
          
          <div className="text-center max-w-3xl mx-auto mb-16 ff-fade-in-up">
            <h1 
              className="mb-6"
              style={{
                fontFamily: 'var(--ff-font-primary)',
                fontSize: 'var(--ff-text-5xl)',
                fontWeight: 'var(--ff-weight-extrabold)',
                lineHeight: 'var(--ff-leading-tight)',
                background: 'linear-gradient(135deg, var(--ff-primary) 0%, var(--ff-secondary) 50%, var(--ff-accent) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Everything You Need to Build & Deploy
            </h1>
            <p 
              className="text-xl mb-8"
              style={{
                color: 'var(--ff-text-secondary)',
                fontFamily: 'var(--ff-font-secondary)',
                lineHeight: 'var(--ff-leading-relaxed)'
              }}
            >
              From idea to production in minutes. FlashFusion provides a complete AI-powered platform for modern development, content creation, and business growth.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg transition-all hover:scale-105"
                style={{
                  background: 'var(--ff-gradient-primary)',
                  color: 'white',
                  fontFamily: 'var(--ff-font-primary)',
                  fontWeight: 'var(--ff-weight-semibold)',
                  boxShadow: 'var(--ff-glow)'
                }}
              >
                Start Building Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border-2 transition-all hover:scale-105"
                style={{
                  borderColor: 'var(--ff-primary)',
                  color: 'var(--ff-primary)',
                  fontFamily: 'var(--ff-font-primary)',
                  fontWeight: 'var(--ff-weight-semibold)'
                }}
              >
                Try Interactive Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 
              className="mb-4"
              style={{
                fontFamily: 'var(--ff-font-primary)',
                fontSize: 'var(--ff-text-4xl)',
                fontWeight: 'var(--ff-weight-bold)',
                lineHeight: 'var(--ff-leading-tight)'
              }}
            >
              Core Features
            </h2>
            <p 
              style={{
                color: 'var(--ff-text-secondary)',
                fontFamily: 'var(--ff-font-secondary)',
                fontSize: 'var(--ff-text-lg)'
              }}
            >
              Powerful tools that work together seamlessly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ff-stagger-fade">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-xl border transition-all hover:scale-105 hover:shadow-2xl cursor-pointer"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-6"
                  style={{
                    background: `${feature.color}20`,
                    color: feature.color
                  }}
                >
                  <feature.icon className="h-6 w-6" />
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
                  {feature.title}
                </h3>
                
                <p 
                  className="mb-4"
                  style={{
                    color: 'var(--ff-text-secondary)',
                    fontFamily: 'var(--ff-font-secondary)',
                    lineHeight: 'var(--ff-leading-relaxed)'
                  }}
                >
                  {feature.description}
                </p>

                <div 
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
                  style={{
                    background: `${feature.color}20`,
                    color: feature.color,
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-xs)',
                    fontWeight: 'var(--ff-weight-semibold)'
                  }}
                >
                  {feature.stats}
                </div>

                <ul className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <li 
                      key={i}
                      className="flex items-center gap-2"
                      style={{
                        color: 'var(--ff-text-secondary)',
                        fontFamily: 'var(--ff-font-secondary)',
                        fontSize: 'var(--ff-text-sm)'
                      }}
                    >
                      <div 
                        className="w-1.5 h-1.5 rounded-full" 
                        style={{ background: feature.color }}
                      />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section 
        className="py-20 px-6"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(255, 123, 0, 0.05) 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 
              className="mb-4"
              style={{
                fontFamily: 'var(--ff-font-primary)',
                fontSize: 'var(--ff-text-4xl)',
                fontWeight: 'var(--ff-weight-bold)',
                lineHeight: 'var(--ff-leading-tight)'
              }}
            >
              Advanced Capabilities
            </h2>
            <p 
              style={{
                color: 'var(--ff-text-secondary)',
                fontFamily: 'var(--ff-font-secondary)',
                fontSize: 'var(--ff-text-lg)'
              }}
            >
              Enterprise-grade features for scaling teams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advancedFeatures.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border transition-all hover:border-opacity-30"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <feature.icon 
                  className="h-8 w-8 mb-4" 
                  style={{ color: 'var(--ff-primary)' }}
                />
                <h3 
                  className="mb-2"
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-lg)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    color: 'var(--ff-text-primary)'
                  }}
                >
                  {feature.title}
                </h3>
                <p 
                  style={{
                    color: 'var(--ff-text-secondary)',
                    fontFamily: 'var(--ff-font-secondary)',
                    fontSize: 'var(--ff-text-sm)',
                    lineHeight: 'var(--ff-leading-relaxed)'
                  }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div 
          className="max-w-4xl mx-auto text-center p-12 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 123, 0, 0.1) 0%, rgba(0, 180, 216, 0.1) 100%)',
            border: '1px solid rgba(255, 123, 0, 0.2)'
          }}
        >
          <h2 
            className="mb-6"
            style={{
              fontFamily: 'var(--ff-font-primary)',
              fontSize: 'var(--ff-text-4xl)',
              fontWeight: 'var(--ff-weight-bold)',
              lineHeight: 'var(--ff-leading-tight)'
            }}
          >
            Ready to transform your development workflow?
          </h2>
          <p 
            className="mb-8"
            style={{
              color: 'var(--ff-text-secondary)',
              fontFamily: 'var(--ff-font-secondary)',
              fontSize: 'var(--ff-text-lg)'
            }}
          >
            Join thousands of developers building faster with AI
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg transition-all hover:scale-105"
              style={{
                background: 'var(--ff-gradient-primary)',
                color: 'white',
                fontFamily: 'var(--ff-font-primary)',
                fontWeight: 'var(--ff-weight-semibold)',
                boxShadow: 'var(--ff-glow)'
              }}
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border-2 transition-all hover:scale-105"
              style={{
                borderColor: 'var(--ff-primary)',
                color: 'var(--ff-primary)',
                fontFamily: 'var(--ff-font-primary)',
                fontWeight: 'var(--ff-weight-semibold)'
              }}
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}