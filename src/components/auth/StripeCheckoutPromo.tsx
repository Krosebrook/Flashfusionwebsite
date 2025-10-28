/**
 * @fileoverview FlashFusion Stripe Checkout with Promotional Pricing
 * @chunk stripe-checkout
 * @category payment
 * @version 1.0.0
 * 
 * Secure Stripe integration for FlashFusion promotional pricing with
 * PCI-compliant payment processing and security best practices.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { 
  CreditCard,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Gift,
  Clock,
  Star,
  Crown,
  Percent,
  X,
  DollarSign,
  Calendar,
  Zap,
  ArrowRight,
  Info
} from 'lucide-react';

interface StripeCheckoutPromoProps {
  onClose: () => void;
  onSuccess: (subscriptionData: any) => void;
  onError: (error: string) => void;
  userEmail?: string;
  userName?: string;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  billingPeriod: 'monthly' | 'annual';
  features: string[];
  popular: boolean;
  stripePriceId: string;
  promoCode: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'googlepay' | 'applepay';
  name: string;
  icon: React.ReactNode;
  available: boolean;
}

export function StripeCheckoutPromo({
  onClose,
  onSuccess,
  onError,
  userEmail = '',
  userName = ''
}: StripeCheckoutPromoProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>('professional');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(24 * 60 * 60); // 24 hours in seconds
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);

  // Promotional pricing plans
  const pricingPlans: PricingPlan[] = [
    {
      id: 'starter-promo',
      name: 'Starter Pro',
      description: 'Perfect for individual creators getting started',
      originalPrice: 29,
      discountedPrice: 14.50,
      discountPercentage: 50,
      billingPeriod: 'monthly',
      features: [
        '100 AI generations per month (2x normal)',
        '10 platforms publishing',
        'Priority support',
        '5GB storage',
        'Advanced analytics',
        'Custom branding'
      ],
      popular: false,
      stripePriceId: 'price_starter_promo_50off',
      promoCode: 'FLASHFUSION50'
    },
    {
      id: 'professional-promo',
      name: 'Professional Pro',
      description: 'Best value for growing businesses and agencies',
      originalPrice: 79,
      discountedPrice: 39.50,
      discountPercentage: 50,
      billingPeriod: 'monthly',
      features: [
        '1000 AI generations per month (2x normal)',
        '25+ platforms publishing',
        '24/7 priority support',
        '100GB storage',
        'Advanced analytics & insights',
        'White-label solutions',
        'API access & webhooks',
        'Team collaboration tools',
        'Custom integrations'
      ],
      popular: true,
      stripePriceId: 'price_professional_promo_50off',
      promoCode: 'FLASHFUSION50'
    },
    {
      id: 'enterprise-promo',
      name: 'Enterprise Pro',
      description: 'Custom solutions for large organizations',
      originalPrice: 199,
      discountedPrice: 99.50,
      discountPercentage: 50,
      billingPeriod: 'monthly',
      features: [
        'Unlimited AI generations',
        'All platforms + custom',
        'Dedicated success manager',
        'Unlimited storage',
        'Enterprise security & compliance',
        'On-premise deployment options',
        'Custom AI model training',
        'SLA guarantees',
        'Advanced reporting & analytics'
      ],
      popular: false,
      stripePriceId: 'price_enterprise_promo_50off',
      promoCode: 'FLASHFUSION50'
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      type: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-5 h-5" />,
      available: true
    },
    {
      id: 'paypal',
      type: 'paypal',
      name: 'PayPal',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.028-.026.058-.04.086-1.348 6.797-5.472 8.966-10.906 8.966H7.13l-.464 2.93h3.65c.454 0 .834-.331.908-.777l.057-.285 1.08-6.844.07-.378c.073-.446.454-.777.908-.777h.571c3.735 0 6.654-1.518 7.497-5.908.354-1.844.174-3.382-.665-4.47z"/>
        </svg>
      ),
      available: true
    },
    {
      id: 'googlepay',
      type: 'googlepay',
      name: 'Google Pay',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
      available: true
    },
    {
      id: 'applepay',
      type: 'applepay',
      name: 'Apple Pay',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      ),
      available: false // Will be enabled based on browser support
    }
  ];

  // Countdown timer for promotional offer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          setDiscountApplied(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format countdown time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle plan selection
  const handlePlanSelect = useCallback((planId: string) => {
    setSelectedPlan(planId);
  }, []);

  // Handle Stripe checkout
  const handleStripeCheckout = useCallback(async () => {
    if (!selectedPlan) return;

    setIsProcessing(true);

    try {
      const plan = pricingPlans.find(p => p.id === selectedPlan);
      if (!plan) throw new Error('Invalid plan selected');

      // Create Stripe checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ff-auth-token')}`
        },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          promoCode: discountApplied ? plan.promoCode : undefined,
          customerEmail: userEmail,
          customerName: userName,
          successUrl: `${window.location.origin}/auth/checkout/success`,
          cancelUrl: `${window.location.origin}/auth/checkout/cancel`,
          metadata: {
            planId: plan.id,
            discountApplied: discountApplied.toString(),
            signupSource: 'authentication_modal',
            userAgent: navigator.userAgent
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create checkout session');
      }

      const { sessionId, checkoutUrl } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl;

    } catch (error) {
      console.error('Stripe checkout error:', error);
      onError(error instanceof Error ? error.message : 'Payment setup failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedPlan, discountApplied, userEmail, userName, onError]);

  // Show discount offer after user shows interest in signing up
  useEffect(() => {
    if (authMode === 'signup') {
      const timer = setTimeout(() => {
        setShowDiscountOffer(true);
      }, 2000); // Show after 2 seconds of being on signup

      return () => clearTimeout(timer);
    } else {
      setShowDiscountOffer(false);
    }
  }, [authMode]);

  const selectedPlanData = pricingPlans.find(p => p.id === selectedPlan);

  if (showDiscountOffer && authMode === 'signup') {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-4xl bg-[var(--ff-surface)] border-[var(--ff-primary)]/20 shadow-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="relative text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-4 top-4 w-8 h-8 p-0 hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Promotional Header */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <Badge className="bg-gradient-to-r from-[var(--ff-accent)] to-[var(--ff-primary)] text-white px-4 py-2 text-sm font-semibold animate-pulse">
                  <Gift className="w-4 h-4 mr-2" />
                  Limited Time Offer
                </Badge>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--ff-font-primary)' }}>
                  Welcome to FlashFusion!
                </h1>
                <div className="flex items-center justify-center space-x-2">
                  <Percent className="w-6 h-6 text-[var(--ff-accent)]" />
                  <span className="text-2xl font-bold text-[var(--ff-accent)]">50% OFF</span>
                  <span className="text-lg text-white">for 4 months</span>
                </div>
                <p className="text-[var(--ff-text-muted)] max-w-2xl mx-auto">
                  Start your AI development journey with exclusive early access pricing
                </p>
              </div>

              {/* Countdown Timer */}
              {discountApplied && timeRemaining > 0 && (
                <div className="bg-gradient-to-r from-[var(--ff-primary)]/20 to-[var(--ff-accent)]/20 border border-[var(--ff-primary)]/30 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-3">
                    <Clock className="w-5 h-5 text-[var(--ff-primary)]" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-white">Offer expires in:</p>
                      <p className="text-xl font-bold text-[var(--ff-primary)] font-mono">
                        {formatTime(timeRemaining)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Plan Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white text-center">Choose Your Plan</h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                {pricingPlans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 relative ${
                      selectedPlan === plan.id
                        ? 'border-[var(--ff-primary)] bg-[var(--ff-primary)]/10 transform scale-105'
                        : 'border-white/20 bg-white/5 hover:border-white/30'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-[var(--ff-primary)] text-white px-3 py-1 text-xs font-semibold">
                          <Crown className="w-3 h-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="text-center">
                        <h4 className="text-lg font-bold text-white mb-2">{plan.name}</h4>
                        <p className="text-xs text-[var(--ff-text-muted)] mb-4">{plan.description}</p>
                        
                        <div className="space-y-2">
                          {discountApplied && (
                            <div className="flex items-center justify-center space-x-2">
                              <span className="text-lg text-[var(--ff-text-muted)] line-through">
                                ${plan.originalPrice}
                              </span>
                              <Badge className="bg-[var(--ff-accent)] text-white text-xs px-2 py-1">
                                {plan.discountPercentage}% OFF
                              </Badge>
                            </div>
                          )}
                          <div className="flex items-baseline justify-center">
                            <span className="text-3xl font-bold text-white">
                              ${discountApplied ? plan.discountedPrice : plan.originalPrice}
                            </span>
                            <span className="text-sm text-[var(--ff-text-muted)] ml-1">/month</span>
                          </div>
                          {discountApplied && (
                            <p className="text-xs text-[var(--ff-accent)]">
                              For the first 4 months, then ${plan.originalPrice}/month
                            </p>
                          )}
                        </div>
                      </div>

                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-[var(--ff-primary)] mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-[var(--ff-text-secondary)]">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Payment Method</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => method.available && setSelectedPaymentMethod(method.id)}
                    disabled={!method.available}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      selectedPaymentMethod === method.id && method.available
                        ? 'border-[var(--ff-primary)] bg-[var(--ff-primary)]/10 text-white'
                        : method.available
                        ? 'border-white/20 bg-white/5 text-[var(--ff-text-muted)] hover:bg-white/10'
                        : 'border-white/10 bg-white/5 text-[var(--ff-text-muted)]/50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className={selectedPaymentMethod === method.id && method.available ? 'text-[var(--ff-primary)]' : ''}>
                        {method.icon}
                      </div>
                      <span className="text-xs font-medium">{method.name}</span>
                      {!method.available && (
                        <span className="text-xs text-[var(--ff-text-muted)]">Coming Soon</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Security Information */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-400 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-white mb-1">Secure Payment Processing</h4>
                    <p className="text-xs text-[var(--ff-text-muted)] mb-2">
                      Powered by Stripe with bank-level security and PCI DSS compliance
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-[var(--ff-text-muted)]">
                      <div className="flex items-center space-x-1">
                        <Lock className="w-3 h-3 text-green-400" />
                        <span>256-bit SSL</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Shield className="w-3 h-3 text-green-400" />
                        <span>PCI Compliant</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        <span>SOC 2 Type II</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSecurityInfo(!showSecurityInfo)}
                  className="text-[var(--ff-text-muted)] hover:text-white"
                >
                  <Info className="w-4 h-4" />
                </Button>
              </div>

              {showSecurityInfo && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="space-y-3 text-xs text-[var(--ff-text-muted)]">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Your payment information is encrypted and never stored on our servers</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>All transactions are processed through Stripe's secure payment infrastructure</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>We comply with GDPR, CCPA, and international data protection standards</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Cancel anytime with no cancellation fees or penalties</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            {selectedPlanData && (
              <div className="bg-gradient-to-r from-[var(--ff-primary)]/10 to-[var(--ff-secondary)]/10 border border-[var(--ff-primary)]/20 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">Order Summary</h4>
                    <Badge className="bg-[var(--ff-primary)] text-white text-xs px-2 py-1">
                      {selectedPlanData.name}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {discountApplied && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[var(--ff-text-muted)]">Monthly Plan (Regular)</span>
                          <span className="text-sm text-[var(--ff-text-muted)] line-through">
                            ${selectedPlanData.originalPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-[var(--ff-accent)]">Promotional Discount (50% off)</span>
                            <Gift className="w-4 h-4 text-[var(--ff-accent)]" />
                          </div>
                          <span className="text-sm text-[var(--ff-accent)] font-semibold">
                            -${((selectedPlanData.originalPrice - selectedPlanData.discountedPrice) * 4).toFixed(2)}
                          </span>
                        </div>
                        <Separator className="bg-white/20" />
                      </>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-white">
                        {discountApplied ? 'First 4 months' : 'Monthly charge'}
                      </span>
                      <span className="text-lg font-bold text-white">
                        ${(discountApplied ? selectedPlanData.discountedPrice * 4 : selectedPlanData.originalPrice).toFixed(2)}
                        {discountApplied && <span className="text-sm font-normal text-[var(--ff-text-muted)]"> total</span>}
                      </span>
                    </div>

                    {discountApplied && (
                      <div className="flex justify-between items-center text-xs text-[var(--ff-text-muted)]">
                        <span>Then ${selectedPlanData.originalPrice}/month thereafter</span>
                        <span>Cancel anytime</span>
                      </div>
                    )}
                  </div>

                  {discountApplied && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium text-green-400">
                          You're saving ${((selectedPlanData.originalPrice - selectedPlanData.discountedPrice) * 4).toFixed(2)} with this offer!
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Checkout Button */}
            <div className="space-y-4">
              <Button
                onClick={handleStripeCheckout}
                disabled={isProcessing || !selectedPlan}
                className="w-full bg-gradient-to-r from-[var(--ff-primary)] to-[var(--ff-secondary)] hover:from-[var(--ff-primary-600)] hover:to-[var(--ff-secondary-600)] text-white font-semibold py-4 text-lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    {discountApplied ? `Claim 50% Discount - $${selectedPlanData?.discountedPrice.toFixed(2)}/mo` : 'Proceed to Payment'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              <div className="text-center space-y-2">
                <p className="text-xs text-[var(--ff-text-muted)]">
                  Secure checkout powered by Stripe • No hidden fees • Cancel anytime
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDiscountOffer(false)}
                  className="text-[var(--ff-text-muted)] hover:text-white"
                >
                  Continue with free account
                </Button>
              </div>
            </div>

            {/* Money-back Guarantee */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-[var(--ff-text-muted)]">
                <Shield className="w-4 h-4 text-green-400" />
                <span>30-day money-back guarantee</span>
                <Separator orientation="vertical" className="h-4 bg-white/20" />
                <Lock className="w-4 h-4 text-green-400" />
                <span>Secure & encrypted</span>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <Users className="w-6 h-6 text-[var(--ff-primary)] mx-auto" />
                <p className="text-xs font-medium text-white">10,000+</p>
                <p className="text-xs text-[var(--ff-text-muted)]">Happy Creators</p>
              </div>
              <div className="space-y-2">
                <Star className="w-6 h-6 text-[var(--ff-secondary)] mx-auto" />
                <p className="text-xs font-medium text-white">4.9/5</p>
                <p className="text-xs text-[var(--ff-text-muted)]">Average Rating</p>
              </div>
              <div className="space-y-2">
                <Zap className="w-6 h-6 text-[var(--ff-accent)] mx-auto" />
                <p className="text-xs font-medium text-white">99.9%</p>
                <p className="text-xs text-[var(--ff-text-muted)]">Uptime SLA</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Return null if not showing the promotional offer
  return null;
}

export default StripeCheckoutPromo;