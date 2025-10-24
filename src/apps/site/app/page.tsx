import ConsentBanner from './consent-banner';
import { submitLead } from './actions';

export default function HomePage() {
  return (
    <>
      <main className="min-h-screen w-full">
        {/* Hero Section */}
        <section className="ff-section">
          <div className="ff-container">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              {/* Main Heading */}
              <h1 className="mb-6">
                <span className="ff-text-gradient block">FlashFusion</span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-2xl md:text-3xl mb-4" style={{ 
                color: 'var(--ff-text-secondary)',
                fontWeight: 500,
                lineHeight: 1.4
              }}>
                AI-Powered Development Platform
              </p>
              
              {/* Description */}
              <p className="text-lg mb-12 max-w-2xl mx-auto" style={{ 
                color: 'var(--ff-text-muted)',
                fontWeight: 400,
                lineHeight: 1.7
              }}>
                Ship faster with multi-agent orchestration, intelligent automation, 
                and comprehensive development tools. Transform ideas into production-ready applications.
              </p>
              
              {/* Waitlist Form */}
              <form action={submitLead} className="max-w-lg mx-auto mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    required
                    className="ff-input flex-1"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '1rem'
                    }}
                  />
                  <input type="hidden" name="source" value="next_site" />
                  <button
                    type="submit"
                    className="ff-btn-primary whitespace-nowrap"
                    data-cta="hero_primary"
                  >
                    Join Waitlist
                  </button>
                </div>
              </form>
              
              <p className="text-sm" style={{ color: 'var(--ff-text-muted)' }}>
                Join 1,000+ developers shipping faster with AI
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="ff-section" style={{ 
          background: 'linear-gradient(180deg, transparent 0%, rgba(255, 123, 0, 0.03) 100%)'
        }}>
          <div className="ff-container">
            <h2 className="text-center mb-12" style={{ fontFamily: 'Sora, sans-serif' }}>
              Everything You Need to Ship Fast
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Feature 1 */}
              <div className="ff-card">
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="mb-3" style={{ 
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 600
                }}>
                  Multi-Agent Orchestration
                </h3>
                <p style={{ 
                  color: 'var(--ff-text-muted)',
                  fontSize: '1rem',
                  lineHeight: 1.6
                }}>
                  Coordinate multiple AI agents to handle complex workflows automatically with intelligent task distribution.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="ff-card">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="mb-3" style={{ 
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 600
                }}>
                  Full-Stack Builder
                </h3>
                <p style={{ 
                  color: 'var(--ff-text-muted)',
                  fontSize: '1rem',
                  lineHeight: 1.6
                }}>
                  Generate complete applications with frontend, backend, database schema, and infrastructure configurations.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="ff-card">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="mb-3" style={{ 
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 600
                }}>
                  Business Intelligence
                </h3>
                <p style={{ 
                  color: 'var(--ff-text-muted)',
                  fontSize: '1rem',
                  lineHeight: 1.6
                }}>
                  Real-time analytics, performance monitoring, and AI-powered optimization recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="ff-section">
          <div className="ff-container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
                Why FlashFusion?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="p-6 rounded-lg" style={{ background: 'rgba(255, 123, 0, 0.05)' }}>
                  <div className="text-3xl mb-3">🚀</div>
                  <h3 className="mb-2" style={{ 
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '1.25rem',
                    fontWeight: 600
                  }}>
                    10x Faster Development
                  </h3>
                  <p style={{ color: 'var(--ff-text-muted)', fontSize: '0.9375rem' }}>
                    From idea to production in hours, not weeks
                  </p>
                </div>

                <div className="p-6 rounded-lg" style={{ background: 'rgba(0, 180, 216, 0.05)' }}>
                  <div className="text-3xl mb-3">💎</div>
                  <h3 className="mb-2" style={{ 
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '1.25rem',
                    fontWeight: 600
                  }}>
                    Production-Ready Code
                  </h3>
                  <p style={{ color: 'var(--ff-text-muted)', fontSize: '0.9375rem' }}>
                    Best practices, security, and scalability built-in
                  </p>
                </div>

                <div className="p-6 rounded-lg" style={{ background: 'rgba(233, 30, 99, 0.05)' }}>
                  <div className="text-3xl mb-3">🔐</div>
                  <h3 className="mb-2" style={{ 
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '1.25rem',
                    fontWeight: 600
                  }}>
                    Enterprise Security
                  </h3>
                  <p style={{ color: 'var(--ff-text-muted)', fontSize: '0.9375rem' }}>
                    SOC 2 compliant with advanced threat detection
                  </p>
                </div>

                <div className="p-6 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                  <div className="text-3xl mb-3">🎯</div>
                  <h3 className="mb-2" style={{ 
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '1.25rem',
                    fontWeight: 600
                  }}>
                    Smart Automation
                  </h3>
                  <p style={{ color: 'var(--ff-text-muted)', fontSize: '0.9375rem' }}>
                    AI learns your patterns and optimizes workflows
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="ff-section" style={{ 
          background: 'linear-gradient(135deg, rgba(255, 123, 0, 0.1) 0%, rgba(0, 180, 216, 0.1) 100%)'
        }}>
          <div className="ff-container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
                Ready to Ship Faster?
              </h2>
              <p className="text-xl mb-8" style={{ 
                color: 'var(--ff-text-secondary)',
                lineHeight: 1.6
              }}>
                Join the waitlist and be among the first to experience the future of AI-powered development
              </p>
              
              <form action={submitLead} className="max-w-md mx-auto">
                <input type="hidden" name="source" value="cta_footer" />
                <input type="hidden" name="plan" value="pro" />
                <button
                  type="submit"
                  className="ff-btn-primary text-lg px-10 py-4"
                  data-cta="footer_cta"
                  style={{
                    fontSize: '1.125rem',
                    padding: '1rem 2.5rem'
                  }}
                >
                  Get Early Access
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12" style={{ 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'var(--ff-bg-dark)'
        }}>
          <div className="ff-container">
            <div className="text-center">
              <p style={{ 
                color: 'var(--ff-text-muted)',
                fontSize: '0.875rem'
              }}>
                © 2025 FlashFusion. Built with AI, for developers.
              </p>
            </div>
          </div>
        </footer>
      </main>

      <ConsentBanner />
    </>
  );
}