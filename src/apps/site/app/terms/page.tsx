import { Metadata } from 'next';
import Link from 'next/link';
import BackButton from '../../components/BackButton';
import { FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | FlashFusion',
  description: 'FlashFusion Terms of Service - Legal terms and conditions for using our AI-powered development platform.',
};

export default function TermsPage() {
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
              background: 'rgba(0, 180, 216, 0.1)',
              color: 'var(--ff-secondary)'
            }}
          >
            <FileText className="h-10 w-10" />
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
            Terms of Service
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
              borderColor: 'rgba(0, 180, 216, 0.2)'
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
              These Terms of Service ("Terms") govern your access to and use of FlashFusion's AI-powered 
              development platform. By using our services, you agree to be bound by these Terms.
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-12">
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
                1. Acceptance of Terms
              </h2>
              <p 
                className="mb-4"
                style={{ 
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.7'
                }}
              >
                By accessing or using FlashFusion, you agree to comply with and be bound by these Terms. 
                If you do not agree to these Terms, you may not access or use our services.
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
                2. User Accounts
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                  <p style={{ color: 'var(--ff-text-secondary)', fontFamily: 'Inter, sans-serif', lineHeight: '1.7' }}>
                    You must be at least 13 years old to create an account
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                  <p style={{ color: 'var(--ff-text-secondary)', fontFamily: 'Inter, sans-serif', lineHeight: '1.7' }}>
                    You are responsible for maintaining the security of your account credentials
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 mt-1" style={{ color: '#10B981' }} />
                  <p style={{ color: 'var(--ff-text-secondary)', fontFamily: 'Inter, sans-serif', lineHeight: '1.7' }}>
                    You must provide accurate and complete information during registration
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 flex-shrink-0 mt-1" style={{ color: 'var(--ff-accent)' }} />
                  <p style={{ color: 'var(--ff-text-secondary)', fontFamily: 'Inter, sans-serif', lineHeight: '1.7' }}>
                    You may not share your account or allow others to access your account
                  </p>
                </div>
              </div>
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
                3. Acceptable Use
              </h2>
              <p 
                className="mb-4"
                style={{ 
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.7'
                }}
              >
                You agree not to:
              </p>
              <div className="space-y-3">
                {[
                  'Use our services for any illegal or unauthorized purpose',
                  'Violate any laws, regulations, or third-party rights',
                  'Transmit viruses, malware, or other harmful code',
                  'Attempt to gain unauthorized access to our systems',
                  'Interfere with or disrupt the integrity of our services',
                  'Use automated systems to access our services without permission',
                  'Reverse engineer or attempt to extract source code',
                  'Resell or redistribute our services without authorization'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 flex-shrink-0 mt-1" style={{ color: 'var(--ff-accent)' }} />
                    <p style={{ color: 'var(--ff-text-secondary)', fontFamily: 'Inter, sans-serif', lineHeight: '1.7' }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
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
                4. Intellectual Property
              </h2>
              <div className="space-y-4">
                <p style={{ color: 'var(--ff-text-secondary)', fontFamily: 'Inter, sans-serif', lineHeight: '1.7' }}>
                  <strong style={{ color: 'var(--ff-text-primary)' }}>FlashFusion IP:</strong> All rights, title, and 
                  interest in FlashFusion's platform, including software, designs, and trademarks, remain our property.
                </p>
                <p style={{ color: 'var(--ff-text-secondary)', fontFamily: 'Inter, sans-serif', lineHeight: '1.7' }}>
                  <strong style={{ color: 'var(--ff-text-primary)' }}>Your Content:</strong> You retain ownership of 
                  code and content you create using our platform. You grant us a license to host and process your content 
                  to provide our services.
                </p>
                <p style={{ color: 'var(--ff-text-secondary)', fontFamily: 'Inter, sans-serif', lineHeight: '1.7' }}>
                  <strong style={{ color: 'var(--ff-text-primary)' }}>AI-Generated Content:</strong> You own the output 
                  generated by our AI tools, subject to any applicable third-party AI provider terms.
                </p>
              </div>
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
                5. Payment & Subscription
              </h2>
              <div className="space-y-4">
                <p style={{ color: 'var(--ff-text-secondary)', fontFamily: 'Inter, sans-serif', lineHeight: '1.7' }}>
                  <strong style={{ color: 'var(--ff-text-primary)' }}>Billing:</strong> Subscriptions are billed in 
                  advance on a recurring basis. You authorize us to charge your payment method.
                </p>
                <p style={{ color: 'var(--ff-text-secondary)', fontFamily: 'Inter, sans-serif', lineHeight: '1.7' }}>
                  <strong style={{ color: 'var(--ff-text-primary)' }}>Cancellation:</strong> You may cancel your 
                  subscription at any time. Cancellations take effect at the end of the current billing period.
                </p>
                <p style={{ color: 'var(--ff-text-secondary)', fontFamily: 'Inter, sans-serif', lineHeight: '1.7' }}>
                  <strong style={{ color: 'var(--ff-text-primary)' }}>Refunds:</strong> We offer a 14-day money-back 
                  guarantee for new subscriptions. Contact support to request a refund.
                </p>
              </div>
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
                6. Service Availability
              </h2>
              <div 
                className="p-6 rounded-xl border"
                style={{
                  background: 'rgba(251, 191, 36, 0.05)',
                  borderColor: 'rgba(251, 191, 36, 0.2)'
                }}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: '#FBBF24' }} />
                  <p style={{ color: 'var(--ff-text-secondary)', fontFamily: 'Inter, sans-serif', lineHeight: '1.7' }}>
                    We strive for 99.9% uptime but do not guarantee uninterrupted access. We may suspend services 
                    for maintenance, updates, or security reasons. We are not liable for any downtime or service interruptions.
                  </p>
                </div>
              </div>
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
                7. Limitation of Liability
              </h2>
              <p 
                style={{ 
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.7'
                }}
              >
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, FLASHFUSION SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, 
                WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE 
                LOSSES RESULTING FROM YOUR USE OF OUR SERVICES.
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
                8. Termination
              </h2>
              <p 
                style={{ 
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.7'
                }}
              >
                We reserve the right to suspend or terminate your account if you violate these Terms. 
                You may terminate your account at any time through your account settings. Upon termination, 
                your right to use our services ceases immediately.
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
                9. Changes to Terms
              </h2>
              <p 
                style={{ 
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.7'
                }}
              >
                We may modify these Terms at any time. We will notify you of significant changes via email 
                or platform notification. Your continued use of our services after changes constitutes 
                acceptance of the modified Terms.
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
                10. Governing Law
              </h2>
              <p 
                style={{ 
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.7'
                }}
              >
                These Terms are governed by the laws of the State of California, United States, without 
                regard to its conflict of law provisions. Any disputes shall be resolved in the courts 
                located in San Francisco County, California.
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
                11. Contact
              </h2>
              <div 
                className="p-6 rounded-xl border"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <p style={{ color: 'var(--ff-text-secondary)', fontFamily: 'Inter, sans-serif', marginBottom: '0.5rem' }}>
                  <strong style={{ color: 'var(--ff-text-primary)' }}>Email:</strong> legal@flashfusion.co
                </p>
                <p style={{ color: 'var(--ff-text-secondary)', fontFamily: 'Inter, sans-serif' }}>
                  <strong style={{ color: 'var(--ff-text-primary)' }}>Address:</strong> FlashFusion Inc., 123 Tech Street, San Francisco, CA 94105
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
              href="/privacy"
              className="transition-colors"
              style={{
                color: 'var(--ff-secondary)',
                fontFamily: 'Sora, sans-serif',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/security"
              className="transition-colors"
              style={{
                color: 'var(--ff-secondary)',
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
                color: 'var(--ff-secondary)',
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
