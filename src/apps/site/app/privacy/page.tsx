import { Metadata } from 'next';
import Link from 'next/link';
import BackButton from '../../components/BackButton';
import { Shield, Lock, Eye, Database, FileText, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | FlashFusion',
  description: 'FlashFusion Privacy Policy - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  const lastUpdated = 'January 15, 2025';

  return (
    <main className="min-h-screen w-full">
      <BackButton />
      
      {/* Hero Section */}
      <section 
        className="py-24 px-6"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 123, 0, 0.05) 0%, rgba(0, 180, 216, 0.05) 100%)'
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8"
            style={{
              background: 'rgba(255, 123, 0, 0.1)',
              color: 'var(--ff-primary)'
            }}
          >
            <Shield className="h-10 w-10" />
          </div>

          <h1 
            className="mb-4"
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
              fontWeight: '800',
              color: 'var(--ff-text-primary)'
            }}
          >
            Privacy Policy
          </h1>
          
          <p 
            style={{ 
              color: 'var(--ff-text-muted)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '1rem'
            }}
          >
            Last Updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div 
            className="p-10 rounded-2xl border mb-12"
            style={{
              background: 'var(--ff-surface)',
              borderColor: 'rgba(255, 123, 0, 0.2)'
            }}
          >
            <p 
              style={{ 
                color: 'var(--ff-text-secondary)',
                fontFamily: 'Inter, sans-serif',
                lineHeight: '1.8',
                fontSize: '1.125rem'
              }}
            >
              At FlashFusion, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our AI-powered development platform.
            </p>
          </div>

          {/* Privacy Sections */}
          <div className="space-y-12">
            {[
              {
                icon: Database,
                title: '1. Information We Collect',
                content: [
                  {
                    subtitle: 'Personal Information',
                    text: 'We collect information you provide directly, including your name, email address, payment information, and account credentials.'
                  },
                  {
                    subtitle: 'Usage Data',
                    text: 'We automatically collect information about your interactions with our platform, including features used, projects created, and deployment metrics.'
                  },
                  {
                    subtitle: 'Technical Data',
                    text: 'We collect device information, IP addresses, browser types, and analytics data to improve our services and ensure platform security.'
                  }
                ]
              },
              {
                icon: Lock,
                title: '2. How We Use Your Information',
                content: [
                  {
                    subtitle: 'Service Delivery',
                    text: 'We use your information to provide, maintain, and improve our AI development tools and platform features.'
                  },
                  {
                    subtitle: 'Communication',
                    text: 'We may send you service updates, security alerts, and promotional communications (you can opt-out anytime).'
                  },
                  {
                    subtitle: 'Analytics & Improvement',
                    text: 'We analyze usage patterns to enhance user experience, develop new features, and optimize platform performance.'
                  }
                ]
              },
              {
                icon: Eye,
                title: '3. Information Sharing',
                content: [
                  {
                    subtitle: 'Service Providers',
                    text: 'We share data with trusted third-party providers who assist in platform operations, including cloud hosting, payment processing, and analytics.'
                  },
                  {
                    subtitle: 'Legal Requirements',
                    text: 'We may disclose information if required by law or to protect our rights, users, or public safety.'
                  },
                  {
                    subtitle: 'Business Transfers',
                    text: 'In the event of a merger or acquisition, user information may be transferred as part of the business assets.'
                  }
                ]
              },
              {
                icon: Shield,
                title: '4. Data Security',
                content: [
                  {
                    subtitle: 'Encryption',
                    text: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256) to protect against unauthorized access.'
                  },
                  {
                    subtitle: 'Access Controls',
                    text: 'We implement strict access controls and authentication measures to limit data access to authorized personnel only.'
                  },
                  {
                    subtitle: 'Regular Audits',
                    text: 'We conduct regular security audits and vulnerability assessments to maintain the highest security standards.'
                  }
                ]
              },
              {
                icon: FileText,
                title: '5. Your Rights & Choices',
                content: [
                  {
                    subtitle: 'Access & Correction',
                    text: 'You can access, update, or correct your personal information through your account settings.'
                  },
                  {
                    subtitle: 'Data Deletion',
                    text: 'You may request deletion of your account and associated data. Some information may be retained for legal or operational purposes.'
                  },
                  {
                    subtitle: 'Opt-Out',
                    text: 'You can opt out of marketing communications, cookies, and certain data collection practices.'
                  },
                  {
                    subtitle: 'Data Portability',
                    text: 'You can request a copy of your data in a structured, machine-readable format.'
                  }
                ]
              },
              {
                icon: Mail,
                title: '6. Cookies & Tracking',
                content: [
                  {
                    subtitle: 'Essential Cookies',
                    text: 'We use cookies necessary for platform functionality, authentication, and security.'
                  },
                  {
                    subtitle: 'Analytics Cookies',
                    text: 'We use analytics tools to understand how users interact with our platform and improve user experience.'
                  },
                  {
                    subtitle: 'Your Control',
                    text: 'You can manage cookie preferences through your browser settings or our consent banner.'
                  }
                ]
              }
            ].map((section, index) => (
              <div key={index}>
                <div className="flex items-start gap-4 mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'rgba(255, 123, 0, 0.1)',
                      color: 'var(--ff-primary)'
                    }}
                  >
                    <section.icon className="h-6 w-6" />
                  </div>
                  <h2 
                    style={{
                      fontFamily: 'Sora, sans-serif',
                      fontSize: '1.75rem',
                      fontWeight: '700',
                      color: 'var(--ff-text-primary)',
                      marginTop: '0.5rem'
                    }}
                  >
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-6 ml-16">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <h3 
                        className="mb-2"
                        style={{
                          fontFamily: 'Sora, sans-serif',
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          color: 'var(--ff-text-primary)'
                        }}
                      >
                        {item.subtitle}
                      </h3>
                      <p 
                        style={{ 
                          color: 'var(--ff-text-secondary)',
                          fontFamily: 'Inter, sans-serif',
                          lineHeight: '1.7'
                        }}
                      >
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Additional Sections */}
            <div>
              <h2 
                className="mb-4"
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  color: 'var(--ff-text-primary)'
                }}
              >
                7. Children's Privacy
              </h2>
              <p 
                style={{ 
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.7'
                }}
              >
                Our platform is not intended for users under 13 years of age. We do not knowingly collect 
                personal information from children. If you believe we have collected information from a 
                child, please contact us immediately.
              </p>
            </div>

            <div>
              <h2 
                className="mb-4"
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  color: 'var(--ff-text-primary)'
                }}
              >
                8. International Data Transfers
              </h2>
              <p 
                style={{ 
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.7'
                }}
              >
                Your information may be transferred to and processed in countries other than your country 
                of residence. We ensure appropriate safeguards are in place to protect your data in 
                accordance with this Privacy Policy.
              </p>
            </div>

            <div>
              <h2 
                className="mb-4"
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  color: 'var(--ff-text-primary)'
                }}
              >
                9. Changes to This Policy
              </h2>
              <p 
                style={{ 
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.7'
                }}
              >
                We may update this Privacy Policy periodically. We will notify you of significant changes 
                via email or platform notification. Continued use of our services after changes constitutes 
                acceptance of the updated policy.
              </p>
            </div>

            <div>
              <h2 
                className="mb-4"
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  color: 'var(--ff-text-primary)'
                }}
              >
                10. Contact Us
              </h2>
              <p 
                className="mb-4"
                style={{ 
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.7'
                }}
              >
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div 
                className="p-6 rounded-xl border"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <p style={{ color: 'var(--ff-text-secondary)', fontFamily: 'Inter, sans-serif', marginBottom: '0.5rem' }}>
                  <strong style={{ color: 'var(--ff-text-primary)' }}>Email:</strong> privacy@flashfusion.co
                </p>
                <p style={{ color: 'var(--ff-text-secondary)', fontFamily: 'Inter, sans-serif', marginBottom: '0.5rem' }}>
                  <strong style={{ color: 'var(--ff-text-primary)' }}>Address:</strong> FlashFusion Inc., 123 Tech Street, San Francisco, CA 94105
                </p>
                <p style={{ color: 'var(--ff-text-secondary)', fontFamily: 'Inter, sans-serif' }}>
                  <strong style={{ color: 'var(--ff-text-primary)' }}>Data Protection Officer:</strong> dpo@flashfusion.co
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <section className="py-12 px-6 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8">
            <Link
              href="/terms"
              className="transition-colors"
              style={{
                color: 'var(--ff-primary)',
                fontFamily: 'Sora, sans-serif',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}
            >
              Terms of Service
            </Link>
            <Link
              href="/security"
              className="transition-colors"
              style={{
                color: 'var(--ff-primary)',
                fontFamily: 'Sora, sans-serif',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}
            >
              Security
            </Link>
            <Link
              href="/contact"
              className="transition-colors"
              style={{
                color: 'var(--ff-primary)',
                fontFamily: 'Sora, sans-serif',
                fontWeight: '600',
                fontSize: '0.875rem'
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
