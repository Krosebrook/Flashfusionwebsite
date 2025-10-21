/**
 * @fileoverview Stripe Integration Handlers for FlashFusion
 * @chunk stripe-server
 * @category payment
 * @version 1.0.0
 * 
 * Secure Stripe webhook and checkout session management for
 * FlashFusion promotional pricing with comprehensive security.
 */

import Stripe from 'https://esm.sh/stripe@13.10.0';
import * as kv from './kv_store.tsx';

// Initialize Stripe with secret key
const stripe = new Stripe(Deno.env.get('stripe_secret_api_key')!, {
  apiVersion: '2023-10-16',
});

// Promotional pricing configuration
const PROMO_PLANS = {
  'price_starter_promo_50off': {
    planId: 'starter-promo',
    originalPrice: 29.00,
    discountedPrice: 14.50,
    name: 'Starter Pro',
    features: ['100 AI generations per month', '10 platforms', 'Priority support']
  },
  'price_professional_promo_50off': {
    planId: 'professional-promo',
    originalPrice: 79.00,
    discountedPrice: 39.50,
    name: 'Professional Pro',
    features: ['1000 AI generations', '25+ platforms', '24/7 support', 'API access']
  },
  'price_enterprise_promo_50off': {
    planId: 'enterprise-promo',
    originalPrice: 199.00,
    discountedPrice: 99.50,
    name: 'Enterprise Pro',
    features: ['Unlimited generations', 'All platforms', 'Dedicated manager']
  }
};

interface CheckoutSessionRequest {
  priceId: string;
  promoCode?: string;
  customerEmail: string;
  customerName: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

/**
 * Create a Stripe checkout session with promotional pricing
 */
export async function createCheckoutSession(request: Request): Promise<Response> {
  try {
    const {
      priceId,
      promoCode,
      customerEmail,
      customerName,
      successUrl,
      cancelUrl,
      metadata = {}
    }: CheckoutSessionRequest = await request.json();

    // Validate required fields
    if (!priceId || !customerEmail || !successUrl || !cancelUrl) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Missing required fields: priceId, customerEmail, successUrl, cancelUrl' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate promotional plan
    const plan = PROMO_PLANS[priceId as keyof typeof PROMO_PLANS];
    if (!plan) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Invalid promotional plan selected' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create or retrieve customer
    let customer;
    try {
      const customers = await stripe.customers.list({
        email: customerEmail,
        limit: 1
      });
      
      if (customers.data.length > 0) {
        customer = customers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: customerEmail,
          name: customerName,
          metadata: {
            source: 'flashfusion_promo_signup',
            planId: plan.planId,
            ...metadata
          }
        });
      }
    } catch (customerError) {
      console.error('Customer creation error:', customerError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Failed to create customer account' 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Prepare line items for checkout
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${plan.name} - 4 Month Promotional Package`,
          description: `${plan.features.join(', ')} - Special promotional pricing for first 4 months`,
          images: ['https://images.unsplash.com/photo-1639322537228-f710d846310a?w=300&h=200&fit=crop'],
          metadata: {
            planId: plan.planId,
            promoApplied: promoCode ? 'true' : 'false',
            originalPrice: plan.originalPrice.toString(),
            discountedPrice: plan.discountedPrice.toString()
          }
        },
        unit_amount: Math.round(plan.discountedPrice * 100), // Convert to cents
        recurring: {
          interval: 'month',
          interval_count: 1
        }
      },
      quantity: 1
    }];

    // Apply promotional discount if valid
    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
    if (promoCode === 'FLASHFUSION50') {
      try {
        // Create a one-time discount coupon for this session
        const coupon = await stripe.coupons.create({
          percent_off: 50,
          duration: 'repeating',
          duration_in_months: 4,
          name: 'FlashFusion 50% Off - 4 Months',
          metadata: {
            promoCode: 'FLASHFUSION50',
            validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
            planId: plan.planId
          }
        });

        discounts = [{
          coupon: coupon.id
        }];
      } catch (couponError) {
        console.error('Coupon creation error:', couponError);
        // Continue without discount if coupon creation fails
      }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card', 'link'],
      line_items: lineItems,
      mode: 'subscription',
      discounts,
      allow_promotion_codes: true,
      
      // URLs
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&plan=${plan.planId}`,
      cancel_url: `${cancelUrl}?reason=user_cancelled&plan=${plan.planId}`,
      
      // Subscription settings
      subscription_data: {
        trial_period_days: 7, // 7-day free trial
        metadata: {
          planId: plan.planId,
          promoApplied: promoCode ? 'true' : 'false',
          originalPrice: plan.originalPrice.toString(),
          discountedPrice: plan.discountedPrice.toString(),
          customerSource: 'flashfusion_auth_modal',
          ...metadata
        }
      },
      
      // Additional settings
      phone_number_collection: {
        enabled: false
      },
      customer_update: {
        address: 'auto',
        name: 'auto'
      },
      tax_id_collection: {
        enabled: false
      },
      
      // Security and compliance
      consent_collection: {
        terms_of_service: 'required',
        privacy_policy: 'required'
      },
      
      metadata: {
        planId: plan.planId,
        promoCode: promoCode || 'none',
        customerEmail,
        customerName,
        timestamp: new Date().toISOString(),
        ...metadata
      }
    });

    // Store session info in KV store for tracking
    await kv.set(`stripe_session:${session.id}`, {
      sessionId: session.id,
      customerId: customer.id,
      planId: plan.planId,
      customerEmail,
      customerName,
      promoCode: promoCode || null,
      originalPrice: plan.originalPrice,
      discountedPrice: plan.discountedPrice,
      status: 'pending',
      createdAt: new Date().toISOString(),
      metadata
    });

    console.log(`Created checkout session ${session.id} for ${customerEmail} with plan ${plan.planId}`);

    return new Response(
      JSON.stringify({
        success: true,
        sessionId: session.id,
        checkoutUrl: session.url,
        customerId: customer.id,
        planDetails: {
          name: plan.name,
          originalPrice: plan.originalPrice,
          discountedPrice: plan.discountedPrice,
          features: plan.features
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Stripe checkout session creation error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to create checkout session. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * Handle Stripe webhook events
 */
export async function handleStripeWebhook(request: Request): Promise<Response> {
  try {
    const signature = request.headers.get('stripe-signature');
    if (!signature) {
      return new Response('Missing stripe signature', { status: 400 });
    }

    const body = await request.text();
    
    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get('STRIPE_WEBHOOK_SECRET')!
      );
    } catch (error) {
      console.error('Stripe webhook signature verification failed:', error);
      return new Response('Invalid signature', { status: 400 });
    }

    console.log(`Processing Stripe webhook event: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCancelled(subscription);
        break;
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response('Webhook processed successfully', { status: 200 });

  } catch (error) {
    console.error('Stripe webhook processing error:', error);
    return new Response('Webhook processing failed', { status: 500 });
  }
}

/**
 * Handle successful checkout completion
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const sessionData = await kv.get(`stripe_session:${session.id}`);
    if (!sessionData) {
      console.error(`Session data not found for ${session.id}`);
      return;
    }

    // Update session status
    await kv.set(`stripe_session:${session.id}`, {
      ...sessionData,
      status: 'completed',
      completedAt: new Date().toISOString(),
      subscriptionId: session.subscription
    });

    // Create user subscription record
    await kv.set(`user_subscription:${session.customer}`, {
      customerId: session.customer,
      subscriptionId: session.subscription,
      planId: sessionData.planId,
      status: 'active',
      promoApplied: sessionData.promoCode !== null,
      originalPrice: sessionData.originalPrice,
      discountedPrice: sessionData.discountedPrice,
      createdAt: new Date().toISOString(),
      metadata: sessionData.metadata
    });

    console.log(`Checkout completed for customer ${session.customer}, subscription ${session.subscription}`);

  } catch (error) {
    console.error('Error handling checkout completion:', error);
  }
}

/**
 * Handle subscription creation
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;
    
    // Update subscription status
    await kv.set(`subscription:${subscription.id}`, {
      subscriptionId: subscription.id,
      customerId,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      planId: subscription.metadata?.planId,
      createdAt: new Date().toISOString()
    });

    console.log(`Subscription created: ${subscription.id} for customer ${customerId}`);

  } catch (error) {
    console.error('Error handling subscription creation:', error);
  }
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const existingData = await kv.get(`subscription:${subscription.id}`) || {};
    
    await kv.set(`subscription:${subscription.id}`, {
      ...existingData,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    });

    console.log(`Subscription updated: ${subscription.id}, status: ${subscription.status}`);

  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  try {
    const existingData = await kv.get(`subscription:${subscription.id}`) || {};
    
    await kv.set(`subscription:${subscription.id}`, {
      ...existingData,
      status: 'cancelled',
      cancelledAt: new Date().toISOString()
    });

    console.log(`Subscription cancelled: ${subscription.id}`);

  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const customerId = invoice.customer as string;
    
    // Log successful payment
    await kv.set(`payment:${invoice.id}`, {
      invoiceId: invoice.id,
      customerId,
      subscriptionId: invoice.subscription,
      amountPaid: invoice.amount_paid,
      currency: invoice.currency,
      status: 'paid',
      paidAt: new Date().toISOString()
    });

    console.log(`Payment succeeded: ${invoice.id}, amount: ${invoice.amount_paid / 100} ${invoice.currency}`);

  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const customerId = invoice.customer as string;
    
    // Log failed payment
    await kv.set(`payment_failed:${invoice.id}`, {
      invoiceId: invoice.id,
      customerId,
      subscriptionId: invoice.subscription,
      amountDue: invoice.amount_due,
      currency: invoice.currency,
      status: 'failed',
      failedAt: new Date().toISOString(),
      reason: invoice.last_finalization_error?.message || 'Unknown error'
    });

    console.log(`Payment failed: ${invoice.id}, customer: ${customerId}`);

  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

/**
 * Get subscription status for a customer
 */
export async function getSubscriptionStatus(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const customerId = url.searchParams.get('customerId');
    
    if (!customerId) {
      return new Response(
        JSON.stringify({ success: false, message: 'Customer ID required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const subscriptionData = await kv.get(`user_subscription:${customerId}`);
    
    if (!subscriptionData) {
      return new Response(
        JSON.stringify({ success: false, message: 'Subscription not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        subscription: subscriptionData
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error getting subscription status:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to get subscription status' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}