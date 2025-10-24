import { Metadata } from 'next';
import Link from 'next/link';
import BackButton from '../../components/BackButton';
import { Check, X, ArrowRight, Zap, Crown, Building2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing | FlashFusion - Simple, Transparent Pricing',
  description: 'Choose the perfect plan for your needs. From free starter to enterprise, FlashFusion scales with you.',
};

const plans = [
  {
    name: 'Starter',
    icon: Zap,
    price: '0',
    period: 'forever',
    description: 'Perfect for trying out FlashFusion and small projects',
    color: 'var(--ff-text-secondary)',
    features: [
      { name: '5 projects', included: true },
      { name: '10 AI generations/month', included: true },
      { name: 'Basic deployment', included: true },
      { name: 'Community support', included: true },
      { name: 'Advanced AI models', included: false },
      { name: 'Team collaboration', included: false },
      { name: 'Priority support', included: false },
      { name: 'White-label options', included: false }
    ],
    cta: 'Start Free',
    href: '/signup',
    popular: false
  },
  {
    name: 'Professional',
    icon: Crown,
    price: '29',
    originalPrice: '58',
    period: 'month',
    promo: '50% OFF for 4 months',
    description: 'For professional developers and growing teams',
    color: 'var(--ff-primary)',
    features: [
      { name: 'Unlimited projects', included: true },
      { name: 'Unlimited AI generations', included: true },
      { name: 'Advanced deployment (8+ platforms)', included: true },
      { name: 'Priority email support', included: true },
      { name: 'Advanced AI models (GPT-4, Claude)', included: true },
      { name: 'Team collaboration (5 members)', included: true },
      { name: 'Custom domains', included: true },
      { name: 'White-label options', included: false }
    ],
    cta: 'Start 14-Day Trial',
    href: '/signup?plan=professional',
    popular: true
  },
  {
    name: 'Enterprise',
    icon: Building2,
    price: 'Custom',
    period: '',
    description: 'For large teams with custom requirements',
    color: 'var(--ff-secondary)',
    features: [
      { name: 'Everything in Professional', included: true },
      { name: 'Unlimited team members', included: true },
      { name: 'Dedicated support & SLA', included: true },
      { name: 'Custom AI model training', included: true },
      { name: 'On-premise deployment', included: true },
      { name: 'SSO & advanced security', included: true },
      { name: 'White-label & reseller options', included: true },
      { name: 'Custom integrations', included: true }
    ],
    cta: 'Contact Sales',
    href: '/contact?inquiry=enterprise',
    popular: false
  }
];

const faqs = [
  {
    question: 'Can I change plans later?',
    answer: 'Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately, and we\'ll pro-rate any charges.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and wire transfer for Enterprise plans.'
  },
  {
    question: 'Is there a free trial?',
    answer: 'Professional and Enterprise plans include a 14-day free trial. No credit card required. The Starter plan is free forever.'
  },
  {
    question: 'What happens when I hit my generation limit?',
    answer: 'On the Starter plan, you\'ll be notified when approaching your limit. You can upgrade anytime to get unlimited generations.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied, contact support for a full refund—no questions asked.'
  },
  {
    question: 'Can I get a discount for annual billing?',
    answer: 'Yes! Annual billing saves you 20% compared to monthly. Plus, you get priority support and early access to new features.'
  }
];

const addOns = [
  {
    name: 'Additional Team Members',
    price: '$9',
    period: 'per member/month',
    description: 'Add unlimited team members beyond your plan limit'
  },
  {
    name: 'Advanced AI Credits',
    price: '$0.02',
    period: 'per generation',
    description: 'Pay-as-you-go for GPT-4, Claude 3, and other premium models'
  },
  {
    name: 'Priority Support',
    price: '$49',
    period: 'month',
    description: '< 1 hour response time and dedicated Slack channel'
  },
  {
    name: 'Custom Training',
    price: '$499',
    period: 'one-time',
    description: 'Train AI models on your codebase and brand guidelines'
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Promo Banner */}
      <div 
        className="py-3 px-6 text-center"
        style={{
          background: 'linear-gradient(90deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)'
        }}
      >
        <p 
          style={{
            fontFamily: 'var(--ff-font-primary)',
            fontWeight: 'var(--ff-weight-semibold)',
            color: 'white'
          }}
        >
          🎉 Limited Time: Get 50% OFF Professional plan for 4 months!
        </p>
      </div>

      {/* Hero Section */}
      <section className="py-20 px-6">
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
              Simple, Transparent Pricing
            </h1>
            <p 
              className="text-xl max-w-2xl mx-auto"
              style={{
                color: 'var(--ff-text-secondary)',
                fontFamily: 'var(--ff-font-secondary)',
                lineHeight: 'var(--ff-leading-relaxed)'
              }}
            >
              Choose the perfect plan for your needs. Start free, scale as you grow. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl border-2 transition-all hover:scale-105 relative"
                style={{
                  background: plan.popular 
                    ? 'linear-gradient(135deg, rgba(255, 123, 0, 0.1) 0%, rgba(0, 180, 216, 0.1) 100%)'
                    : 'var(--ff-surface)',
                  borderColor: plan.popular ? plan.color : 'rgba(255, 255, 255, 0.1)',
                  boxShadow: plan.popular ? 'var(--ff-shadow-xl)' : 'none'
                }}
              >
                {plan.popular && (
                  <div 
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full"
                    style={{
                      background: 'var(--ff-gradient-primary)',
                      color: 'white',
                      fontFamily: 'var(--ff-font-primary)',
                      fontSize: 'var(--ff-text-sm)',
                      fontWeight: 'var(--ff-weight-semibold)'
                    }}
                  >
                    Most Popular
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{
                      background: `${plan.color}20`,
                      color: plan.color
                    }}
                  >
                    <plan.icon className="h-6 w-6" />
                  </div>
                  <h3 
                    style={{
                      fontFamily: 'var(--ff-font-primary)',
                      fontSize: 'var(--ff-text-2xl)',
                      fontWeight: 'var(--ff-weight-bold)',
                      color: 'var(--ff-text-primary)'
                    }}
                  >
                    {plan.name}
                  </h3>
                </div>

                <p 
                  className="mb-6"
                  style={{
                    color: 'var(--ff-text-secondary)',
                    fontFamily: 'var(--ff-font-secondary)',
                    lineHeight: 'var(--ff-leading-relaxed)'
                  }}
                >
                  {plan.description}
                </p>

                <div className="mb-6">
                  {plan.promo && (
                    <div 
                      className="inline-block px-3 py-1 rounded-full mb-2"
                      style={{
                        background: 'var(--ff-success)',
                        color: 'white',
                        fontFamily: 'var(--ff-font-primary)',
                        fontSize: 'var(--ff-text-xs)',
                        fontWeight: 'var(--ff-weight-semibold)'
                      }}
                    >
                      {plan.promo}
                    </div>
                  )}
                  <div className="flex items-baseline gap-2">
                    {plan.originalPrice && (
                      <span 
                        className="line-through"
                        style={{
                          color: 'var(--ff-text-muted)',
                          fontFamily: 'var(--ff-font-primary)',
                          fontSize: 'var(--ff-text-2xl)'
                        }}
                      >
                        ${plan.originalPrice}
                      </span>
                    )}
                    <span 
                      style={{
                        fontFamily: 'var(--ff-font-primary)',
                        fontSize: plan.price === 'Custom' ? 'var(--ff-text-3xl)' : 'var(--ff-text-5xl)',
                        fontWeight: 'var(--ff-weight-bold)',
                        color: plan.color
                      }}
                    >
                      {plan.price === 'Custom' ? plan.price : `$${plan.price}`}
                    </span>
                    {plan.period && (
                      <span 
                        style={{
                          color: 'var(--ff-text-muted)',
                          fontFamily: 'var(--ff-font-secondary)',
                          fontSize: 'var(--ff-text-base)'
                        }}
                      >
                        /{plan.period}
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={plan.href}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all hover:scale-105 mb-8"
                  style={{
                    background: plan.popular ? 'var(--ff-gradient-primary)' : 'transparent',
                    border: plan.popular ? 'none' : `2px solid ${plan.color}`,
                    color: plan.popular ? 'white' : plan.color,
                    fontFamily: 'var(--ff-font-primary)',
                    fontWeight: 'var(--ff-weight-semibold)'
                  }}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li 
                      key={i}
                      className="flex items-start gap-3"
                    >
                      {feature.included ? (
                        <Check 
                          className="h-5 w-5 mt-0.5 flex-shrink-0" 
                          style={{ color: 'var(--ff-success)' }}
                        />
                      ) : (
                        <X 
                          className="h-5 w-5 mt-0.5 flex-shrink-0" 
                          style={{ color: 'var(--ff-text-muted)' }}
                        />
                      )}
                      <span 
                        style={{
                          color: feature.included ? 'var(--ff-text-primary)' : 'var(--ff-text-muted)',
                          fontFamily: 'var(--ff-font-secondary)',
                          fontSize: 'var(--ff-text-sm)'
                        }}
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section 
        className="py-20 px-6"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(255, 123, 0, 0.05) 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 
              className="mb-4"
              style={{
                fontFamily: 'var(--ff-font-primary)',
                fontSize: 'var(--ff-text-4xl)',
                fontWeight: 'var(--ff-weight-bold)'
              }}
            >
              Add-Ons & Extensions
            </h2>
            <p 
              style={{
                color: 'var(--ff-text-secondary)',
                fontFamily: 'var(--ff-font-secondary)',
                fontSize: 'var(--ff-text-lg)'
              }}
            >
              Customize your plan with additional features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
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
                  {addon.name}
                </h3>
                <div 
                  className="mb-3"
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-2xl)',
                    fontWeight: 'var(--ff-weight-bold)',
                    color: 'var(--ff-primary)'
                  }}
                >
                  {addon.price}
                  <span 
                    style={{
                      fontSize: 'var(--ff-text-sm)',
                      color: 'var(--ff-text-muted)',
                      fontWeight: 'var(--ff-weight-normal)'
                    }}
                  >
                    {' '}{addon.period}
                  </span>
                </div>
                <p 
                  style={{
                    color: 'var(--ff-text-secondary)',
                    fontFamily: 'var(--ff-font-secondary)',
                    fontSize: 'var(--ff-text-sm)'
                  }}
                >
                  {addon.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 
            className="text-center mb-12"
            style={{
              fontFamily: 'var(--ff-font-primary)',
              fontSize: 'var(--ff-text-4xl)',
              fontWeight: 'var(--ff-weight-bold)'
            }}
          >
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border"
                style={{
                  background: 'var(--ff-surface)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <h3 
                  className="mb-3"
                  style={{
                    fontFamily: 'var(--ff-font-primary)',
                    fontSize: 'var(--ff-text-lg)',
                    fontWeight: 'var(--ff-weight-semibold)',
                    color: 'var(--ff-text-primary)'
                  }}
                >
                  {faq.question}
                </h3>
                <p 
                  style={{
                    color: 'var(--ff-text-secondary)',
                    fontFamily: 'var(--ff-font-secondary)',
                    lineHeight: 'var(--ff-leading-relaxed)'
                  }}
                >
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
              fontWeight: 'var(--ff-weight-bold)'
            }}
          >
            Still have questions?
          </h2>
          <p 
            className="mb-8"
            style={{
              color: 'var(--ff-text-secondary)',
              fontFamily: 'var(--ff-font-secondary)',
              fontSize: 'var(--ff-text-lg)'
            }}
          >
            Our team is here to help you find the perfect plan
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg transition-all hover:scale-105"
            style={{
              background: 'var(--ff-gradient-primary)',
              color: 'white',
              fontFamily: 'var(--ff-font-primary)',
              fontWeight: 'var(--ff-weight-semibold)',
              boxShadow: 'var(--ff-glow)'
            }}
          >
            Contact Sales
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}