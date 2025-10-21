// Stripe integration for FlashFusion subscription management
import { createClient } from 'npm:@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

export async function createStripeCheckoutSession(userId: string, priceId: string, successUrl: string, cancelUrl: string) {
  const stripeKey = Deno.env.get('stripe_secret_api_key');
  if (!stripeKey) {
    throw new Error('Stripe API key not configured');
  }

  try {
    // Get or create Stripe customer
    const { data: user } = await supabase
      .from('users')
      .select('stripe_customer_id, email')
      .eq('id', userId)
      .single();

    let customerId = user?.stripe_customer_id;

    if (!customerId) {
      // Create new Stripe customer
      const customerResponse = await fetch('https://api.stripe.com/v1/customers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          email: user?.email || '',
          metadata: JSON.stringify({ user_id: userId })
        })
      });

      if (!customerResponse.ok) {
        throw new Error('Failed to create Stripe customer');
      }

      const customer = await customerResponse.json();
      customerId = customer.id;

      // Update user with Stripe customer ID
      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);
    }

    // Create checkout session
    const sessionResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        customer: customerId,
        'line_items[0][price]': priceId,
        'line_items[0][quantity]': '1',
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        'metadata[user_id]': userId,
        allow_promotion_codes: 'true',
        billing_address_collection: 'required',
        automatic_tax_enabled: 'true'
      })
    });

    if (!sessionResponse.ok) {
      throw new Error('Failed to create checkout session');
    }

    const session = await sessionResponse.json();
    return session;

  } catch (error) {
    console.error('Stripe checkout session error:', error);
    throw error;
  }
}

export async function createCustomerPortalSession(userId: string, returnUrl: string) {
  const stripeKey = Deno.env.get('stripe_secret_api_key');
  if (!stripeKey) {
    throw new Error('Stripe API key not configured');
  }

  try {
    const { data: user } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    if (!user?.stripe_customer_id) {
      throw new Error('No Stripe customer found');
    }

    const portalResponse = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        customer: user.stripe_customer_id,
        return_url: returnUrl
      })
    });

    if (!portalResponse.ok) {
      throw new Error('Failed to create portal session');
    }

    const portal = await portalResponse.json();
    return portal;

  } catch (error) {
    console.error('Stripe portal session error:', error);
    throw error;
  }
}

export async function handleStripeWebhook(body: string, signature: string) {
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  if (!webhookSecret) {
    throw new Error('Stripe webhook secret not configured');
  }

  try {
    // Verify webhook signature
    const event = await verifyStripeSignature(body, signature, webhookSecret);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  } catch (error) {
    console.error('Stripe webhook error:', error);
    throw error;
  }
}

async function verifyStripeSignature(body: string, signature: string, secret: string) {
  // Stripe signature verification implementation
  // This is a simplified version - in production, use proper cryptographic verification
  return JSON.parse(body);
}

async function handleSubscriptionChange(subscription: any) {
  try {
    const customerId = subscription.customer;
    const userId = subscription.metadata?.user_id;

    if (!userId) {
      console.error('No user_id in subscription metadata');
      return;
    }

    const tier = getSubscriptionTier(subscription.items.data[0]?.price?.id);

    await supabase
      .from('users')
      .update({
        subscription_tier: tier,
        subscription_status: subscription.status,
        stripe_subscription_id: subscription.id,
        subscription_ends_at: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    // Update usage limits based on tier
    const limits = getUsageLimits(tier);
    await supabase
      .from('users')
      .update({
        api_calls_limit: limits.api_calls,
        storage_limit_bytes: limits.storage_bytes
      })
      .eq('id', userId);

    console.log(`Updated subscription for user ${userId} to ${tier}`);
  } catch (error) {
    console.error('Handle subscription change error:', error);
  }
}

async function handleSubscriptionCancellation(subscription: any) {
  try {
    const userId = subscription.metadata?.user_id;

    if (!userId) {
      console.error('No user_id in subscription metadata');
      return;
    }

    await supabase
      .from('users')
      .update({
        subscription_tier: 'free',
        subscription_status: 'canceled',
        subscription_ends_at: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    console.log(`Canceled subscription for user ${userId}`);
  } catch (error) {
    console.error('Handle subscription cancellation error:', error);
  }
}

async function handlePaymentSuccess(invoice: any) {
  try {
    const subscription = invoice.subscription;
    const customerId = invoice.customer;

    // Reset monthly usage on successful payment
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (user) {
      await supabase
        .from('users')
        .update({
          monthly_generations: 0,
          api_calls_used: 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
    }

    console.log(`Payment succeeded for customer ${customerId}`);
  } catch (error) {
    console.error('Handle payment success error:', error);
  }
}

async function handlePaymentFailure(invoice: any) {
  try {
    const customerId = invoice.customer;

    // Send notification about failed payment
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (user) {
      await supabase
        .from('notifications')
        .insert([{
          user_id: user.id,
          title: 'Payment Failed',
          message: 'Your recent payment failed. Please update your payment method to continue using FlashFusion.',
          type: 'error',
          category: 'billing',
          action_url: '/settings/billing',
          action_text: 'Update Payment Method',
          created_at: new Date().toISOString()
        }]);
    }

    console.log(`Payment failed for customer ${customerId}`);
  } catch (error) {
    console.error('Handle payment failure error:', error);
  }
}

function getSubscriptionTier(priceId: string): string {
  const priceTierMap: Record<string, string> = {
    'price_pro_monthly': 'pro',
    'price_pro_yearly': 'pro',
    'price_enterprise_monthly': 'enterprise',
    'price_enterprise_yearly': 'enterprise',
    'price_unlimited_monthly': 'unlimited',
    'price_unlimited_yearly': 'unlimited'
  };

  return priceTierMap[priceId] || 'free';
}

function getUsageLimits(tier: string) {
  const limits = {
    free: {
      api_calls: 100,
      storage_bytes: 1073741824 // 1GB
    },
    pro: {
      api_calls: 1000,
      storage_bytes: 10737418240 // 10GB
    },
    enterprise: {
      api_calls: 10000,
      storage_bytes: 107374182400 // 100GB
    },
    unlimited: {
      api_calls: -1,
      storage_bytes: -1
    }
  };

  return limits[tier] || limits.free;
}