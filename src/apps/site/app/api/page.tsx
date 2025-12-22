import { Metadata } from 'next';
import Link from 'next/link';
import BackButton from '../../components/BackButton';
import { Code2, Key, Webhook, Database, Shield, Zap, Copy } from 'lucide-react';

export const metadata: Metadata = {
  title: 'API Reference | FlashFusion - Developer API Documentation',
  description: 'Complete API reference for FlashFusion\'s development platform. RESTful APIs, authentication, and integration guides.',
  openGraph: {
    title: 'FlashFusion API Reference',
    description: 'RESTful API documentation for developers building with FlashFusion.',
    type: 'website',
  },
};

const apiEndpoints = [
  {
    category: 'Authentication',
    icon: Key,
    color: 'var(--ff-primary)',
    endpoints: [
      { method: 'POST', path: '/auth/login', description: 'Authenticate user and receive access token' },
      { method: 'POST', path: '/auth/register', description: 'Create a new user account' },
      { method: 'POST', path: '/auth/refresh', description: 'Refresh expired access token' },
      { method: 'POST', path: '/auth/logout', description: 'Invalidate current session' }
    ]
  },
  {
    category: 'Projects',
    icon: Database,
    color: 'var(--ff-secondary)',
    endpoints: [
      { method: 'GET', path: '/projects', description: 'List all projects for authenticated user' },
      { method: 'POST', path: '/projects', description: 'Create a new project' },
      { method: 'GET', path: '/projects/:id', description: 'Get project details by ID' },
      { method: 'PATCH', path: '/projects/:id', description: 'Update project information' },
      { method: 'DELETE', path: '/projects/:id', description: 'Delete a project' }
    ]
  },
  {
    category: 'Code Generation',
    icon: Code2,
    color: 'var(--ff-accent)',
    endpoints: [
      { method: 'POST', path: '/generate/code', description: 'Generate code based on description' },
      { method: 'POST', path: '/generate/component', description: 'Generate UI component' },
      { method: 'POST', path: '/generate/api', description: 'Generate API endpoints' },
      { method: 'GET', path: '/generate/history', description: 'Get generation history' }
    ]
  },
  {
    category: 'Deployments',
    icon: Zap,
    color: '#10B981',
    endpoints: [
      { method: 'POST', path: '/deploy', description: 'Deploy project to platform' },
      { method: 'GET', path: '/deploy/:id/status', description: 'Check deployment status' },
      { method: 'GET', path: '/deploy/:id/logs', description: 'Get deployment logs' },
      { method: 'POST', path: '/deploy/:id/rollback', description: 'Rollback to previous version' }
    ]
  }
];

export default function APIPage() {
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
          <div className="text-center max-w-4xl mx-auto">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8"
              style={{
                background: 'rgba(0, 180, 216, 0.1)',
                color: 'var(--ff-secondary)'
              }}
            >
              <Code2 className="h-10 w-10" />
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
              API Reference
            </h1>
            
            <p 
              className="text-xl"
              style={{ 
                color: 'var(--ff-text-secondary)',
                fontFamily: 'Inter, sans-serif',
                lineHeight: '1.8',
                fontSize: 'clamp(1rem, 2vw, 1.25rem)'
              }}
            >
              RESTful API for integrating FlashFusion into your applications
            </p>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="mb-8"
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 2.5rem)',
              fontWeight: '700',
              color: 'var(--ff-text-primary)'
            }}
          >
            Quick Start
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Base URL */}
            <div 
              className="p-8 rounded-2xl border"
              style={{
                background: 'var(--ff-surface)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <h3 
                className="mb-4"
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: 'var(--ff-text-primary)'
                }}
              >
                Base URL
              </h3>
              <div 
                className="p-4 rounded-lg flex items-center justify-between"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.9375rem'
                }}
              >
                <code style={{ color: 'var(--ff-secondary)' }}>
                  https://api.flashfusion.co/v1
                </code>
                <button
                  className="p-2 rounded hover:bg-[rgba(255,255,255,0.1)]"
                  aria-label="Copy API base URL"
                >
                  <Copy className="h-4 w-4" style={{ color: 'var(--ff-text-muted)' }} />
                </button>
              </div>
            </div>

            {/* Authentication */}
            <div 
              className="p-8 rounded-2xl border"
              style={{
                background: 'var(--ff-surface)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <h3 
                className="mb-4"
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: 'var(--ff-text-primary)'
                }}
              >
                Authentication
              </h3>
              <div 
                className="p-4 rounded-lg"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.875rem',
                  color: 'var(--ff-text-secondary)'
                }}
              >
                <div className="mb-2">
                  <span style={{ color: 'var(--ff-accent)' }}>Authorization:</span>{' '}
                  <span style={{ color: 'var(--ff-primary)' }}>Bearer</span> {'<your_api_key>'}
                </div>
                <div>
                  <span style={{ color: 'var(--ff-accent)' }}>Content-Type:</span> application/json
                </div>
              </div>
            </div>
          </div>

          {/* Example Request */}
          <div 
            className="p-8 rounded-2xl border"
            style={{
              background: 'var(--ff-surface)',
              borderColor: 'rgba(255, 123, 0, 0.2)'
            }}
          >
            <h3 
              className="mb-4"
              style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.25rem',
                fontWeight: '600',
                color: 'var(--ff-text-primary)'
              }}
            >
              Example Request
            </h3>
            <pre 
              className="p-6 rounded-xl overflow-x-auto"
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.875rem',
                lineHeight: '1.6'
              }}
            >
              <code style={{ color: 'var(--ff-text-secondary)' }}>
{`curl -X POST https://api.flashfusion.co/v1/generate/code \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "description": "Create a React component for a user profile card",
    "framework": "react",
    "language": "typescript"
  }'`}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* API Endpoints */}
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
            API Endpoints
          </h2>

          <div className="space-y-8">
            {apiEndpoints.map((section, index) => (
              <div 
                key={index}
                className="p-8 rounded-2xl border"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: `${section.color}15`,
                      color: section.color
                    }}
                  >
                    <section.icon className="h-6 w-6" />
                  </div>
                  <h3 
                    style={{
                      fontFamily: 'Sora, sans-serif',
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      color: 'var(--ff-text-primary)'
                    }}
                  >
                    {section.category}
                  </h3>
                </div>

                <div className="space-y-4">
                  {section.endpoints.map((endpoint, endpointIndex) => (
                    <div 
                      key={endpointIndex}
                      className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.03)]"
                    >
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span 
                          className="px-3 py-1 rounded text-xs font-semibold"
                          style={{
                            background: endpoint.method === 'GET' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 123, 0, 0.2)',
                            color: endpoint.method === 'GET' ? '#10B981' : 'var(--ff-primary)',
                            fontFamily: 'JetBrains Mono, monospace'
                          }}
                        >
                          {endpoint.method}
                        </span>
                        <code 
                          style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '0.875rem',
                            color: 'var(--ff-secondary)'
                          }}
                        >
                          {endpoint.path}
                        </code>
                      </div>
                      <p 
                        style={{ 
                          color: 'var(--ff-text-muted)',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.875rem'
                        }}
                      >
                        {endpoint.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="mb-8"
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 2.5rem)',
              fontWeight: '700',
              color: 'var(--ff-text-primary)'
            }}
          >
            Additional Resources
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              href="/docs"
              className="p-8 rounded-2xl border transition-all hover:scale-105 text-center"
              style={{
                background: 'var(--ff-surface)',
                borderColor: 'rgba(255, 123, 0, 0.2)'
              }}
            >
              <Shield className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--ff-primary)' }} />
              <h3 
                className="mb-2"
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: 'var(--ff-text-primary)'
                }}
              >
                Authentication Guide
              </h3>
              <p 
                style={{ 
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9375rem'
                }}
              >
                Security & API keys
              </p>
            </Link>

            <Link
              href="/docs"
              className="p-8 rounded-2xl border transition-all hover:scale-105 text-center"
              style={{
                background: 'var(--ff-surface)',
                borderColor: 'rgba(0, 180, 216, 0.2)'
              }}
            >
              <Webhook className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--ff-secondary)' }} />
              <h3 
                className="mb-2"
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: 'var(--ff-text-primary)'
                }}
              >
                Webhooks
              </h3>
              <p 
                style={{ 
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9375rem'
                }}
              >
                Event notifications
              </p>
            </Link>

            <Link
              href="/docs"
              className="p-8 rounded-2xl border transition-all hover:scale-105 text-center"
              style={{
                background: 'var(--ff-surface)',
                borderColor: 'rgba(233, 30, 99, 0.2)'
              }}
            >
              <Code2 className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--ff-accent)' }} />
              <h3 
                className="mb-2"
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: 'var(--ff-text-primary)'
                }}
              >
                SDKs & Libraries
              </h3>
              <p 
                style={{ 
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9375rem'
                }}
              >
                Client libraries
              </p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
