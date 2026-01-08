import { Metadata } from 'next';
import Link from 'next/link';
import BackButton from '../../components/BackButton';
import { Shield, Lock, Eye, Server, CheckCircle, FileCheck, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Security | FlashFusion - Enterprise-Grade Protection',
  description: 'Learn about FlashFusion\'s comprehensive security measures, compliance certifications, and data protection practices.',
  openGraph: {
    title: 'FlashFusion Security - Enterprise-Grade Protection',
    description: 'SOC 2 compliant with advanced threat detection and encryption.',
    type: 'website',
  },
};

export default function SecurityPage() {
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
            className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-8"
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#10B981'
            }}
          >
            <Shield className="h-12 w-12" />
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
            Enterprise-Grade Security
          </h1>
          
          <p 
            className="text-xl max-w-3xl mx-auto"
            style={{ 
              color: 'var(--ff-text-secondary)',
              fontFamily: 'Inter, sans-serif',
              lineHeight: '1.8',
              fontSize: 'clamp(1rem, 2vw, 1.25rem)'
            }}
          >
            Your code and data are protected by industry-leading security measures, 
            compliance certifications, and continuous monitoring.
          </p>
        </div>
      </section>

      {/* Security Stats */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '99.9%', label: 'Uptime SLA' },
              { value: 'SOC 2', label: 'Type II Compliant' },
              { value: 'AES-256', label: 'Encryption' },
              { value: '24/7', label: 'Security Monitoring' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div 
                  className="mb-2"
                  style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    fontWeight: '800',
                    color: '#10B981'
                  }}
                >
                  {stat.value}
                </div>
                <div 
                  style={{
                    color: 'var(--ff-text-muted)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem'
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 px-6">
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
              Comprehensive Security Measures
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Lock,
                title: 'End-to-End Encryption',
                description: 'All data is encrypted in transit with TLS 1.3 and at rest with AES-256 encryption.',
                color: '#10B981'
              },
              {
                icon: Eye,
                title: 'Real-Time Monitoring',
                description: '24/7 security monitoring with automated threat detection and incident response.',
                color: 'var(--ff-primary)'
              },
              {
                icon: Server,
                title: 'Secure Infrastructure',
                description: 'Hosted on enterprise-grade cloud infrastructure with redundancy and failover.',
                color: 'var(--ff-secondary)'
              },
              {
                icon: CheckCircle,
                title: 'Access Controls',
                description: 'Role-based access control (RBAC) with multi-factor authentication (MFA).',
                color: '#10B981'
              },
              {
                icon: FileCheck,
                title: 'Regular Audits',
                description: 'Third-party security audits and penetration testing conducted quarterly.',
                color: 'var(--ff-primary)'
              },
              {
                icon: Shield,
                title: 'DDoS Protection',
                description: 'Advanced DDoS mitigation and rate limiting to ensure service availability.',
                color: 'var(--ff-secondary)'
              }
            ].map((feature, index) => (
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
                    background: `${feature.color}15`,
                    color: feature.color
                  }}
                >
                  <feature.icon className="h-7 w-7" />
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
                  {feature.title}
                </h3>
                <p 
                  style={{ 
                    color: 'var(--ff-text-secondary)',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: '1.7',
                    fontSize: '0.95rem'
                  }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section 
        className="py-24 px-6"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(16, 185, 129, 0.03) 100%)'
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
              Compliance & Certifications
            </h2>
            <p 
              className="text-xl max-w-2xl mx-auto"
              style={{
                color: 'var(--ff-text-secondary)',
                fontFamily: 'Inter, sans-serif',
                lineHeight: '1.8'
              }}
            >
              We maintain the highest standards of compliance and security
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'SOC 2 Type II',
                description: 'Independently audited and certified for security, availability, and confidentiality.',
                status: 'Certified'
              },
              {
                title: 'GDPR Compliant',
                description: 'Full compliance with EU data protection regulations and user privacy rights.',
                status: 'Compliant'
              },
              {
                title: 'CCPA Compliant',
                description: 'Adherence to California Consumer Privacy Act requirements.',
                status: 'Compliant'
              },
              {
                title: 'HIPAA Ready',
                description: 'Infrastructure and processes ready for healthcare compliance requirements.',
                status: 'Ready'
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="p-8 rounded-2xl border"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: 'rgba(16, 185, 129, 0.2)'
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 
                    style={{
                      fontFamily: 'Sora, sans-serif',
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      color: 'var(--ff-text-primary)'
                    }}
                  >
                    {item.title}
                  </h3>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      color: '#10B981',
                      fontFamily: 'Sora, sans-serif'
                    }}
                  >
                    {item.status}
                  </span>
                </div>
                <p 
                  style={{ 
                    color: 'var(--ff-text-secondary)',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: '1.7'
                  }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="mb-12 text-center"
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: '700',
              color: 'var(--ff-text-primary)'
            }}
          >
            Security Best Practices
          </h2>

          <div className="space-y-8">
            {[
              {
                title: 'Data Encryption',
                points: [
                  'TLS 1.3 for all data in transit',
                  'AES-256 encryption for data at rest',
                  'Encrypted backups with secure key management',
                  'End-to-end encryption for sensitive data'
                ]
              },
              {
                title: 'Access Management',
                points: [
                  'Multi-factor authentication (MFA) required',
                  'Role-based access control (RBAC)',
                  'Session management and timeout policies',
                  'Regular access reviews and audits'
                ]
              },
              {
                title: 'Incident Response',
                points: [
                  'Dedicated security operations center (SOC)',
                  'Automated threat detection and alerting',
                  'Documented incident response procedures',
                  'Regular security drills and testing'
                ]
              },
              {
                title: 'Data Protection',
                points: [
                  'Automated daily backups with 30-day retention',
                  'Geographic data redundancy',
                  'Disaster recovery plan with <4hr RTO',
                  'Data sanitization for deleted accounts'
                ]
              }
            ].map((section, index) => (
              <div 
                key={index}
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
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: 'var(--ff-text-primary)'
                  }}
                >
                  {section.title}
                </h3>
                <div className="space-y-3">
                  {section.points.map((point, pointIndex) => (
                    <div key={pointIndex} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                      <p 
                        style={{ 
                          color: 'var(--ff-text-secondary)',
                          fontFamily: 'Inter, sans-serif',
                          lineHeight: '1.7'
                        }}
                      >
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsible Disclosure */}
      <section 
        className="py-24 px-6"
        style={{
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.05) 0%, rgba(239, 68, 68, 0.05) 100%)'
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div 
            className="p-10 rounded-2xl border"
            style={{
              background: 'var(--ff-surface)',
              borderColor: 'rgba(251, 191, 36, 0.2)'
            }}
          >
            <div className="flex items-start gap-4 mb-6">
              <AlertTriangle className="h-8 w-8 flex-shrink-0" style={{ color: '#FBBF24' }} />
              <div>
                <h2 
                  className="mb-4"
                  style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: 'var(--ff-text-primary)'
                  }}
                >
                  Responsible Disclosure
                </h2>
                <p 
                  className="mb-4"
                  style={{ 
                    color: 'var(--ff-text-secondary)',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: '1.8',
                    fontSize: '1.125rem'
                  }}
                >
                  We welcome security researchers to help us keep FlashFusion secure. If you discover 
                  a security vulnerability, please report it responsibly.
                </p>
                <div 
                  className="p-6 rounded-xl border mb-4"
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <p style={{ color: 'var(--ff-text-secondary)', fontFamily: 'Inter, sans-serif', marginBottom: '0.5rem' }}>
                    <strong style={{ color: 'var(--ff-text-primary)' }}>Email:</strong> security@flashfusion.co
                  </p>
                  <p style={{ color: 'var(--ff-text-secondary)', fontFamily: 'Inter, sans-serif' }}>
                    <strong style={{ color: 'var(--ff-text-primary)' }}>PGP Key:</strong> Available on request
                  </p>
                </div>
                <p 
                  style={{ 
                    color: 'var(--ff-text-muted)',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: '1.7',
                    fontSize: '0.9375rem'
                  }}
                >
                  We commit to acknowledging reports within 24 hours and providing regular updates 
                  on remediation progress. Eligible vulnerabilities may qualify for our bug bounty program.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="mb-6"
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 2.5rem)',
              fontWeight: '700',
              color: 'var(--ff-text-primary)'
            }}
          >
            Questions About Security?
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
            Our security team is here to answer your questions and provide detailed information
          </p>
          
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-xl transition-all hover:scale-105 shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, var(--ff-secondary) 100%)',
              color: 'white',
              fontFamily: 'Sora, sans-serif',
              fontSize: '1.125rem',
              fontWeight: '600',
              boxShadow: '0 20px 60px rgba(16, 185, 129, 0.4)'
            }}
          >
            Contact Security Team
          </Link>
        </div>
      </section>
    </main>
  );
}
