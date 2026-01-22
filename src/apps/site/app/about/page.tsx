import { Metadata } from 'next';
import Link from 'next/link';
import BackButton from '../../components/BackButton';
import { 
  Target, 
  Users, 
  Zap, 
  Heart,
  Award,
  Globe,
  Rocket,
  CheckCircle
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | FlashFusion - AI-Powered Development Platform',
  description: 'Learn about FlashFusion\'s mission to revolutionize software development with AI-powered tools and multi-agent orchestration. Building the future of development.',
  openGraph: {
    title: 'About FlashFusion - Building the Future of Development',
    description: 'Revolutionizing software development with AI-powered tools and multi-agent orchestration.',
    type: 'website',
  },
};

export default function AboutPage() {
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
                lineHeight: '1.2',
                letterSpacing: '-0.02em'
              }}
            >
              <span className="ff-text-gradient">Building the Future</span>
              <br />
              <span style={{ color: 'var(--ff-text-primary)' }}>
                of Software Development
              </span>
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
              FlashFusion is on a mission to democratize software development by empowering 
              creators and developers with AI-powered tools that make building applications 
              10x faster, smarter, and more accessible.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission */}
            <div 
              className="p-8 rounded-2xl border"
              style={{
                background: 'var(--ff-surface)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                style={{
                  background: 'rgba(255, 123, 0, 0.1)',
                  color: 'var(--ff-primary)'
                }}
              >
                <Target className="h-8 w-8" />
              </div>
              <h2 
                className="mb-4"
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: 'var(--ff-text-primary)'
                }}
              >
                Our Mission
              </h2>
              <p 
                style={{ 
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.8',
                  fontSize: '1.125rem'
                }}
              >
                To revolutionize software development by combining the power of multi-agent 
                AI orchestration with intuitive tools, enabling anyone—from solo creators to 
                enterprise teams—to build production-ready applications faster than ever before.
              </p>
            </div>

            {/* Vision */}
            <div 
              className="p-8 rounded-2xl border"
              style={{
                background: 'var(--ff-surface)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                style={{
                  background: 'rgba(0, 180, 216, 0.1)',
                  color: 'var(--ff-secondary)'
                }}
              >
                <Rocket className="h-8 w-8" />
              </div>
              <h2 
                className="mb-4"
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: 'var(--ff-text-primary)'
                }}
              >
                Our Vision
              </h2>
              <p 
                style={{ 
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.8',
                  fontSize: '1.125rem'
                }}
              >
                A world where every idea can become reality. We envision a future where 
                sophisticated AI agents work alongside humans to eliminate technical barriers, 
                accelerate innovation, and make software development accessible to all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
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
                fontFamily: 'Sora, sans-serif',
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: '700',
                color: 'var(--ff-text-primary)'
              }}
            >
              Our Core Values
            </h2>
            <p 
              className="text-xl max-w-2xl mx-auto"
              style={{
                color: 'var(--ff-text-secondary)',
                fontFamily: 'Inter, sans-serif',
                lineHeight: '1.8'
              }}
            >
              The principles that guide everything we build
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Speed & Efficiency',
                description: 'We obsess over performance and productivity. Every feature is designed to help you ship faster without compromising quality.',
                color: 'var(--ff-primary)'
              },
              {
                icon: Users,
                title: 'Developer-First',
                description: 'Built by developers, for developers. We understand your workflow and create tools that feel intuitive and powerful.',
                color: 'var(--ff-secondary)'
              },
              {
                icon: Heart,
                title: 'User Empowerment',
                description: 'Technology should empower, not complicate. We make advanced AI accessible to everyone, regardless of technical expertise.',
                color: 'var(--ff-accent)'
              },
              {
                icon: Award,
                title: 'Excellence',
                description: 'We maintain the highest standards in code quality, security, and user experience. Production-ready means production-ready.',
                color: '#10B981'
              },
              {
                icon: Globe,
                title: 'Open Innovation',
                description: 'We believe in transparency and collaboration. Our platform evolves through community feedback and shared knowledge.',
                color: 'var(--ff-secondary)'
              },
              {
                icon: CheckCircle,
                title: 'Reliability',
                description: 'Dependable infrastructure with 99.9% uptime. Your projects deserve tools that work when you need them.',
                color: '#10B981'
              }
            ].map((value, index) => (
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
                    background: `${value.color}15`,
                    color: value.color
                  }}
                >
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 
                  className="mb-3"
                  style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: 'var(--ff-text-primary)'
                  }}
                >
                  {value.title}
                </h3>
                <p 
                  style={{ 
                    color: 'var(--ff-text-secondary)',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: '1.7',
                    fontSize: '0.95rem'
                  }}
                >
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Story */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 
              className="mb-4"
              style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: '700',
                color: 'var(--ff-text-primary)'
              }}
            >
              Our Story
            </h2>
          </div>

          <div 
            className="p-10 rounded-2xl border"
            style={{
              background: 'var(--ff-surface)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="space-y-6">
              <p 
                style={{ 
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.9',
                  fontSize: '1.125rem'
                }}
              >
                FlashFusion was born from a simple observation: building software is too slow 
                and too complex. Despite advances in technology, developers still spend countless 
                hours on repetitive tasks, configuration, and deployment.
              </p>

              <p 
                style={{ 
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.9',
                  fontSize: '1.125rem'
                }}
              >
                We asked ourselves: What if AI agents could handle the tedious parts while 
                developers focus on creativity and innovation? What if we could reduce weeks 
                of work to hours, and hours to minutes?
              </p>

              <p 
                style={{ 
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.9',
                  fontSize: '1.125rem'
                }}
              >
                Today, FlashFusion is trusted by thousands of developers worldwide. From solo 
                creators launching their first MVP to enterprise teams scaling production 
                applications, we're helping build the future of software—one feature at a time.
              </p>

              <p 
                style={{ 
                  color: 'var(--ff-primary)',
                  fontFamily: 'Sora, sans-serif',
                  lineHeight: '1.9',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginTop: '2rem'
                }}
              >
                This is just the beginning. Join us in revolutionizing software development.
              </p>
            </div>
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
              fontFamily: 'Sora, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: '800',
              color: 'var(--ff-text-primary)'
            }}
          >
            Ready to Build with Us?
          </h2>
          <p 
            className="text-xl mb-12 max-w-2xl mx-auto"
            style={{ 
              color: 'var(--ff-text-secondary)',
              fontFamily: 'Inter, sans-serif',
              lineHeight: '1.8'
            }}
          >
            Join thousands of developers building the future with FlashFusion
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-10 py-5 rounded-xl transition-all hover:scale-105 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)',
                color: 'white',
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.125rem',
                fontWeight: '600',
                boxShadow: '0 20px 60px rgba(255, 123, 0, 0.4)'
              }}
            >
              Start Building Free
              <Rocket className="h-5 w-5" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-10 py-5 rounded-xl border-2 transition-all hover:scale-105"
              style={{
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: 'var(--ff-text-primary)',
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
