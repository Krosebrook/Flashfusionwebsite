'use client';

import { useState } from 'react';
import Link from 'next/link';
import BackButton from '../../components/BackButton';
import { Mail, Send, CheckCircle, AlertCircle, MessageSquare, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    // Validate
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    // Simulate API call (replace with actual endpoint)
    setTimeout(() => {
      setSuccess(true);
      setIsSubmitting(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        className="py-20 px-6"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 123, 0, 0.1) 0%, rgba(0, 180, 216, 0.1) 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <BackButton href="/" label="Back to Home" className="mb-8" />
          
          <div className="text-center">
            <h1 
              className="mb-6"
              style={{
                fontFamily: 'var(--ff-font-primary)',
                fontSize: 'var(--ff-text-5xl)',
                fontWeight: 'var(--ff-weight-extrabold)',
                lineHeight: 'var(--ff-leading-tight)',
                background: 'linear-gradient(135deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Get in Touch
            </h1>
            <p 
              className="text-xl max-w-2xl mx-auto"
              style={{
                color: 'var(--ff-text-secondary)',
                fontFamily: 'var(--ff-font-secondary)',
                lineHeight: 'var(--ff-leading-relaxed)'
              }}
            >
              Have questions? We're here to help. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div 
                className="p-8 rounded-2xl border"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <h2 
                  className="mb-6"
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-2xl)',
                    fontWeight: 'var(--ff-weight-bold)',
                    color: 'var(--ff-text-primary)'
                  }}
                >
                  Send us a message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label 
                      htmlFor="name"
                      className="block mb-2"
                      style={{
                        color: 'var(--ff-text-primary)',
                        fontFamily: 'var(--ff-font-primary)',
                        fontSize: 'var(--ff-text-sm)',
                        fontWeight: 'var(--ff-weight-semibold)'
                      }}
                    >
                      Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
                      style={{
                        background: 'var(--ff-bg-dark)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'var(--ff-text-primary)',
                        fontFamily: 'var(--ff-font-secondary)'
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label 
                      htmlFor="email"
                      className="block mb-2"
                      style={{
                        color: 'var(--ff-text-primary)',
                        fontFamily: 'var(--ff-font-primary)',
                        fontSize: 'var(--ff-text-sm)',
                        fontWeight: 'var(--ff-weight-semibold)'
                      }}
                    >
                      Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
                      style={{
                        background: 'var(--ff-bg-dark)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'var(--ff-text-primary)',
                        fontFamily: 'var(--ff-font-secondary)'
                      }}
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label 
                      htmlFor="subject"
                      className="block mb-2"
                      style={{
                        color: 'var(--ff-text-primary)',
                        fontFamily: 'var(--ff-font-primary)',
                        fontSize: 'var(--ff-text-sm)',
                        fontWeight: 'var(--ff-weight-semibold)'
                      }}
                    >
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
                      style={{
                        background: 'var(--ff-bg-dark)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'var(--ff-text-primary)',
                        fontFamily: 'var(--ff-font-secondary)'
                      }}
                    >
                      <option value="">Select a topic...</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="sales">Sales & Pricing</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="feedback">Feedback</option>
                      <option value="bug">Report a Bug</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label 
                      htmlFor="message"
                      className="block mb-2"
                      style={{
                        color: 'var(--ff-text-primary)',
                        fontFamily: 'var(--ff-font-primary)',
                        fontSize: 'var(--ff-text-sm)',
                        fontWeight: 'var(--ff-weight-semibold)'
                      }}
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all resize-none"
                      style={{
                        background: 'var(--ff-bg-dark)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'var(--ff-text-primary)',
                        fontFamily: 'var(--ff-font-secondary)'
                      }}
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div 
                      className="flex items-center gap-2 p-3 rounded-lg"
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)'
                      }}
                    >
                      <AlertCircle className="h-5 w-5" style={{ color: 'var(--ff-error)' }} />
                      <p 
                        style={{
                          color: 'var(--ff-error)',
                          fontFamily: 'var(--ff-font-secondary)',
                          fontSize: 'var(--ff-text-sm)'
                        }}
                      >
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Success Message */}
                  {success && (
                    <div 
                      className="flex items-center gap-2 p-3 rounded-lg"
                      style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      <CheckCircle className="h-5 w-5" style={{ color: 'var(--ff-success)' }} />
                      <p 
                        style={{
                          color: 'var(--ff-success)',
                          fontFamily: 'var(--ff-font-secondary)',
                          fontSize: 'var(--ff-text-sm)'
                        }}
                      >
                        Message sent! We'll get back to you within 24 hours.
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                      background: 'var(--ff-gradient-primary)',
                      color: 'white',
                      fontFamily: 'var(--ff-font-primary)',
                      fontWeight: 'var(--ff-weight-semibold)',
                      boxShadow: 'var(--ff-glow)'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 
                  className="mb-6"
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-2xl)',
                    fontWeight: 'var(--ff-weight-bold)',
                    color: 'var(--ff-text-primary)'
                  }}
                >
                  Other ways to reach us
                </h2>

                <div className="space-y-4">
                  {/* Email */}
                  <div 
                    className="p-6 rounded-xl border"
                    style={{
                      background: 'var(--ff-surface)',
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: 'rgba(255, 123, 0, 0.1)',
                          color: 'var(--ff-primary)'
                        }}
                      >
                        <Mail className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 
                          className="mb-1"
                          style={{
                            fontFamily: 'var(--ff-font-primary)',
                            fontSize: 'var(--ff-text-lg)',
                            fontWeight: 'var(--ff-weight-semibold)',
                            color: 'var(--ff-text-primary)'
                          }}
                        >
                          Email Support
                        </h3>
                        <p 
                          style={{
                            color: 'var(--ff-text-secondary)',
                            fontFamily: 'var(--ff-font-secondary)',
                            fontSize: 'var(--ff-text-sm)',
                            marginBottom: '0.5rem'
                          }}
                        >
                          For general inquiries and support
                        </p>
                        <a
                          href="mailto:support@flashfusion.co"
                          style={{
                            color: 'var(--ff-primary)',
                            fontFamily: 'var(--ff-font-secondary)',
                            fontSize: 'var(--ff-text-sm)',
                            fontWeight: 'var(--ff-weight-semibold)'
                          }}
                        >
                          support@flashfusion.co
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Sales */}
                  <div 
                    className="p-6 rounded-xl border"
                    style={{
                      background: 'var(--ff-surface)',
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: 'rgba(0, 180, 216, 0.1)',
                          color: 'var(--ff-secondary)'
                        }}
                      >
                        <MessageSquare className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 
                          className="mb-1"
                          style={{
                            fontFamily: 'var(--ff-font-primary)',
                            fontSize: 'var(--ff-text-lg)',
                            fontWeight: 'var(--ff-weight-semibold)',
                            color: 'var(--ff-text-primary)'
                          }}
                        >
                          Sales Team
                        </h3>
                        <p 
                          style={{
                            color: 'var(--ff-text-secondary)',
                            fontFamily: 'var(--ff-font-secondary)',
                            fontSize: 'var(--ff-text-sm)',
                            marginBottom: '0.5rem'
                          }}
                        >
                          Enterprise plans and partnerships
                        </p>
                        <a
                          href="mailto:sales@flashfusion.co"
                          style={{
                            color: 'var(--ff-secondary)',
                            fontFamily: 'var(--ff-font-secondary)',
                            fontSize: 'var(--ff-text-sm)',
                            fontWeight: 'var(--ff-weight-semibold)'
                          }}
                        >
                          sales@flashfusion.co
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Link */}
              <div 
                className="p-6 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 123, 0, 0.1) 0%, rgba(0, 180, 216, 0.1) 100%)',
                  border: '1px solid rgba(255, 123, 0, 0.2)'
                }}
              >
                <h3 
                  className="mb-2"
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-lg)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    color: 'var(--ff-text-primary)'
                  }}
                >
                  Need help quickly?
                </h3>
                <p 
                  className="mb-4"
                  style={{
                    color: 'var(--ff-text-secondary)',
                    fontFamily: 'var(--ff-font-secondary)',
                    fontSize: 'var(--ff-text-sm)'
                  }}
                >
                  Check out our FAQ for instant answers to common questions
                </p>
                <Link
                  href="/faq"
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-lg transition-all hover:scale-105"
                  style={{
                    background: 'var(--ff-gradient-primary)',
                    color: 'white',
                    fontFamily: 'var(--ff-font-primary)',
                    fontWeight: 'var(--ff-weight-semibold)'
                  }}
                >
                  View FAQ
                </Link>
              </div>

              {/* Response Time */}
              <div 
                className="p-6 rounded-xl border"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <h3 
                  className="mb-4"
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-lg)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    color: 'var(--ff-text-primary)'
                  }}
                >
                  Response Times
                </h3>
                <ul className="space-y-3">
                  <li 
                    style={{
                      color: 'var(--ff-text-secondary)',
                      fontFamily: 'var(--ff-font-secondary)',
                      fontSize: 'var(--ff-text-sm)'
                    }}
                  >
                    <span style={{ color: 'var(--ff-success)', fontWeight: 'var(--ff-weight-semibold)' }}>
                      General inquiries:
                    </span> Within 24 hours
                  </li>
                  <li 
                    style={{
                      color: 'var(--ff-text-secondary)',
                      fontFamily: 'var(--ff-font-secondary)',
                      fontSize: 'var(--ff-text-sm)'
                    }}
                  >
                    <span style={{ color: 'var(--ff-success)', fontWeight: 'var(--ff-weight-semibold)' }}>
                      Technical support:
                    </span> Within 12 hours
                  </li>
                  <li 
                    style={{
                      color: 'var(--ff-text-secondary)',
                      fontFamily: 'var(--ff-font-secondary)',
                      fontSize: 'var(--ff-text-sm)'
                    }}
                  >
                    <span style={{ color: 'var(--ff-success)', fontWeight: 'var(--ff-weight-semibold)' }}>
                      Enterprise clients:
                    </span> Within 1 hour
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}