import { Metadata } from 'next';
import Link from 'next/link';
import BackButton from '../../components/BackButton';
import { BookOpen, Video, Code, Clock, Tag, ArrowRight, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tutorials | FlashFusion - Learn AI-Powered Development',
  description: 'Step-by-step tutorials for mastering FlashFusion\'s AI-powered development platform. From basics to advanced techniques.',
  openGraph: {
    title: 'FlashFusion Tutorials - Learn by Doing',
    description: 'Comprehensive tutorials for building with FlashFusion.',
    type: 'website',
  },
};

const tutorials = [
  {
    id: 1,
    title: 'Building Your First Application',
    description: 'Create and deploy a full-stack application from scratch in under 15 minutes.',
    level: 'Beginner',
    duration: '15 min',
    type: 'Video',
    category: 'Getting Started',
    featured: true,
    skills: ['React', 'Node.js', 'Deployment']
  },
  {
    id: 2,
    title: 'Multi-Agent Workflow Setup',
    description: 'Learn how to configure and optimize AI agents for complex development tasks.',
    level: 'Intermediate',
    duration: '25 min',
    type: 'Interactive',
    category: 'AI Agents',
    skills: ['Agents', 'Workflows', 'Optimization']
  },
  {
    id: 3,
    title: 'Custom Integration with External APIs',
    description: 'Connect FlashFusion with third-party services and create custom workflows.',
    level: 'Advanced',
    duration: '30 min',
    type: 'Written',
    category: 'Integrations',
    skills: ['APIs', 'Webhooks', 'Authentication']
  },
  {
    id: 4,
    title: 'AI-Powered Code Generation Masterclass',
    description: 'Master the art of describing features for optimal code generation results.',
    level: 'Intermediate',
    duration: '20 min',
    type: 'Video',
    category: 'Code Generation',
    skills: ['AI Prompts', 'Code Quality', 'Best Practices']
  },
  {
    id: 5,
    title: 'Deploying to Multiple Platforms',
    description: 'Deploy your application to AWS, Vercel, and Netlify simultaneously.',
    level: 'Intermediate',
    duration: '18 min',
    type: 'Written',
    category: 'Deployment',
    skills: ['AWS', 'Vercel', 'Netlify', 'CI/CD']
  },
  {
    id: 6,
    title: 'Building a Real-Time Collaboration Tool',
    description: 'Create a multi-user collaborative application with live updates.',
    level: 'Advanced',
    duration: '45 min',
    type: 'Interactive',
    category: 'Advanced Projects',
    skills: ['WebSockets', 'Real-time', 'Scaling']
  },
  {
    id: 7,
    title: 'Optimizing AI Model Selection',
    description: 'Choose the right AI model for your specific use case and budget.',
    level: 'Beginner',
    duration: '12 min',
    type: 'Written',
    category: 'AI Models',
    skills: ['GPT-4', 'Claude', 'Gemini', 'Cost Optimization']
  },
  {
    id: 8,
    title: 'Database Schema Design with AI',
    description: 'Let AI help you design optimal database schemas for your applications.',
    level: 'Intermediate',
    duration: '22 min',
    type: 'Video',
    category: 'Database',
    skills: ['PostgreSQL', 'Schema Design', 'Supabase']
  },
  {
    id: 9,
    title: 'Security Best Practices',
    description: 'Implement authentication, authorization, and security measures in your apps.',
    level: 'Advanced',
    duration: '35 min',
    type: 'Interactive',
    category: 'Security',
    skills: ['Auth', 'Encryption', 'OWASP', 'Compliance']
  }
];

const categories = ['All', 'Getting Started', 'AI Agents', 'Code Generation', 'Deployment', 'Integrations', 'Security'];

const levelColors = {
  'Beginner': '#10B981',
  'Intermediate': 'var(--ff-secondary)',
  'Advanced': 'var(--ff-accent)'
};

const typeIcons = {
  'Video': Video,
  'Written': BookOpen,
  'Interactive': Code
};

export default function TutorialsPage() {
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
        <div className="max-w-6xl mx-auto text-center">
          <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8"
            style={{
              background: 'rgba(233, 30, 99, 0.1)',
              color: 'var(--ff-accent)'
            }}
          >
            <Sparkles className="h-10 w-10" />
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
            <span className="ff-text-gradient">Learn by Doing</span>
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
            Master FlashFusion with hands-on tutorials from basics to advanced techniques
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <span 
              className="px-6 py-3 rounded-full"
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10B981',
                fontFamily: 'Sora, sans-serif',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              {tutorials.filter(t => t.level === 'Beginner').length} Beginner Tutorials
            </span>
            <span 
              className="px-6 py-3 rounded-full"
              style={{
                background: 'rgba(0, 180, 216, 0.1)',
                color: 'var(--ff-secondary)',
                fontFamily: 'Sora, sans-serif',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              {tutorials.filter(t => t.level === 'Intermediate').length} Intermediate Tutorials
            </span>
            <span 
              className="px-6 py-3 rounded-full"
              style={{
                background: 'rgba(233, 30, 99, 0.1)',
                color: 'var(--ff-accent)',
                fontFamily: 'Sora, sans-serif',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              {tutorials.filter(t => t.level === 'Advanced').length} Advanced Tutorials
            </span>
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

      {/* Featured Tutorial */}
      {tutorials.filter(t => t.featured).map(tutorial => (
        <section key={tutorial.id} className="py-16 px-6">
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
                  {tutorial.category}
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
                {tutorial.title}
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
                {tutorial.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  {React.createElement(typeIcons[tutorial.type as keyof typeof typeIcons], { 
                    className: "h-4 w-4", 
                    style: { color: 'var(--ff-text-muted)' } 
                  })}
                  <span style={{ color: 'var(--ff-text-muted)', fontSize: '0.875rem' }}>
                    {tutorial.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" style={{ color: 'var(--ff-text-muted)' }} />
                  <span style={{ color: 'var(--ff-text-muted)', fontSize: '0.875rem' }}>
                    {tutorial.duration}
                  </span>
                </div>
                <span 
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: `${levelColors[tutorial.level as keyof typeof levelColors]}15`,
                    color: levelColors[tutorial.level as keyof typeof levelColors],
                    fontFamily: 'Sora, sans-serif'
                  }}
                >
                  {tutorial.level}
                </span>
              </div>

              <Link
                href={`/tutorials/${tutorial.id}`}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)',
                  color: 'white',
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: '600'
                }}
              >
                Start Tutorial
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      ))}

      {/* All Tutorials */}
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
            All Tutorials
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tutorials.filter(t => !t.featured).map((tutorial) => (
              <article 
                key={tutorial.id}
                className="rounded-2xl border transition-all hover:scale-105 overflow-hidden"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" style={{ color: 'var(--ff-primary)' }} />
                      <span 
                        className="text-xs font-semibold"
                        style={{
                          color: 'var(--ff-primary)',
                          fontFamily: 'Sora, sans-serif'
                        }}
                      >
                        {tutorial.category}
                      </span>
                    </div>
                    <span 
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{
                        background: `${levelColors[tutorial.level as keyof typeof levelColors]}15`,
                        color: levelColors[tutorial.level as keyof typeof levelColors],
                        fontFamily: 'Sora, sans-serif'
                      }}
                    >
                      {tutorial.level}
                    </span>
                  </div>

                  <h3 
                    className="mb-3"
                    style={{
                      fontFamily: 'Sora, sans-serif',
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: 'var(--ff-text-primary)',
                      lineHeight: '1.4',
                      minHeight: '3.2rem'
                    }}
                  >
                    {tutorial.title}
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
                    {tutorial.description}
                  </p>

                  <div className="flex items-center gap-4 mb-4 pb-4 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <div className="flex items-center gap-2">
                      {React.createElement(typeIcons[tutorial.type as keyof typeof typeIcons], { 
                        className: "h-3.5 w-3.5", 
                        style: { color: 'var(--ff-text-muted)' } 
                      })}
                      <span style={{ color: 'var(--ff-text-muted)', fontSize: '0.8125rem' }}>
                        {tutorial.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" style={{ color: 'var(--ff-text-muted)' }} />
                      <span style={{ color: 'var(--ff-text-muted)', fontSize: '0.8125rem' }}>
                        {tutorial.duration}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/tutorials/${tutorial.id}`}
                    className="inline-flex items-center gap-2 transition-colors"
                    style={{
                      color: 'var(--ff-primary)',
                      fontFamily: 'Sora, sans-serif',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}
                  >
                    Start Learning
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
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
            Need a Learning Path?
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
            Not sure where to start? Check out our curated learning paths designed for different roles and skill levels
          </p>

          <Link
            href="/docs"
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
            Explore Learning Paths
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
