/**
 * @fileoverview External Integrations Server Handlers for FlashFusion
 * @chunk server
 * @category integrations
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Server-side handlers for external app integrations and webhooks
 */

import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// CORS configuration
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}));

app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Platform configurations
const PLATFORM_CONFIGS = {
  'bolt.new': {
    webhookSecret: Deno.env.get('BOLT_NEW_WEBHOOK_SECRET'),
    apiKey: Deno.env.get('BOLT_NEW_API_KEY'),
    clientId: Deno.env.get('BOLT_NEW_CLIENT_ID'),
    clientSecret: Deno.env.get('BOLT_NEW_CLIENT_SECRET')
  },
  'replit.com': {
    webhookSecret: Deno.env.get('REPLIT_WEBHOOK_SECRET'),
    apiKey: Deno.env.get('REPLIT_API_KEY'),
    clientId: Deno.env.get('REPLIT_CLIENT_ID'),
    clientSecret: Deno.env.get('REPLIT_CLIENT_SECRET')
  },
  'vercel.com': {
    webhookSecret: Deno.env.get('VERCEL_WEBHOOK_SECRET'),
    apiKey: Deno.env.get('VERCEL_API_KEY'),
    clientId: Deno.env.get('VERCEL_CLIENT_ID'),
    clientSecret: Deno.env.get('VERCEL_CLIENT_SECRET')
  },
  'netlify.com': {
    webhookSecret: Deno.env.get('NETLIFY_WEBHOOK_SECRET'),
    apiKey: Deno.env.get('NETLIFY_API_KEY'),
    clientId: Deno.env.get('NETLIFY_CLIENT_ID'),
    clientSecret: Deno.env.get('NETLIFY_CLIENT_SECRET')
  }
};

// OAuth callback handler
app.get('/make-server-88829a40/integrations/oauth/callback/:platform', async (c) => {
  try {
    const platform = c.req.param('platform');
    const code = c.req.query('code');
    const state = c.req.query('state');
    const error = c.req.query('error');

    if (error) {
      console.error(`OAuth error for ${platform}:`, error);
      return c.json({ 
        success: false, 
        error: 'OAuth authorization failed',
        details: error
      }, 400);
    }

    if (!code) {
      return c.json({ 
        success: false, 
        error: 'Authorization code not provided' 
      }, 400);
    }

    const config = PLATFORM_CONFIGS[platform as keyof typeof PLATFORM_CONFIGS];
    if (!config) {
      return c.json({ 
        success: false, 
        error: 'Platform not supported' 
      }, 400);
    }

    // Exchange code for access token
    const tokenResponse = await exchangeOAuthCode(platform, code, config);
    
    if (!tokenResponse.success) {
      return c.json({
        success: false,
        error: 'Failed to exchange OAuth code',
        details: tokenResponse.error
      }, 400);
    }

    // Store credentials in KV store
    const credentialsKey = `integration:${platform}:credentials`;
    await kv.set(credentialsKey, {
      accessToken: tokenResponse.accessToken,
      refreshToken: tokenResponse.refreshToken,
      expiresAt: tokenResponse.expiresAt,
      createdAt: new Date().toISOString(),
      platform
    });

    // Store integration status
    const statusKey = `integration:${platform}:status`;
    await kv.set(statusKey, {
      connected: true,
      lastSync: new Date().toISOString(),
      platform,
      authType: 'oauth'
    });

    console.log(`✅ OAuth integration successful for ${platform}`);

    return c.json({
      success: true,
      message: 'Integration connected successfully',
      platform,
      connectedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('OAuth callback error:', error);
    return c.json({
      success: false,
      error: 'Internal server error during OAuth callback',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Webhook handler for external platforms
app.post('/make-server-88829a40/integrations/webhook/:platform', async (c) => {
  try {
    const platform = c.req.param('platform');
    const signature = c.req.header('x-signature') || c.req.header('x-hub-signature-256');
    const event = c.req.header('x-event') || c.req.header('x-github-event');
    
    const payload = await c.req.json();

    console.log(`📥 Webhook received from ${platform}:`, { event, signature: !!signature });

    const config = PLATFORM_CONFIGS[platform as keyof typeof PLATFORM_CONFIGS];
    if (!config) {
      return c.json({ 
        success: false, 
        error: 'Platform not supported' 
      }, 400);
    }

    // Verify webhook signature if provided
    if (signature && config.webhookSecret) {
      const isValid = await verifyWebhookSignature(
        JSON.stringify(payload), 
        signature, 
        config.webhookSecret
      );
      
      if (!isValid) {
        console.error(`❌ Invalid webhook signature for ${platform}`);
        return c.json({ 
          success: false, 
          error: 'Invalid webhook signature' 
        }, 401);
      }
    }

    // Process webhook based on platform and event
    const result = await processWebhook(platform, event || 'unknown', payload);

    // Store webhook event in KV store for audit
    const webhookKey = `webhook:${platform}:${Date.now()}`;
    await kv.set(webhookKey, {
      platform,
      event: event || 'unknown',
      timestamp: new Date().toISOString(),
      payload: payload,
      processed: result.success
    });

    console.log(`✅ Webhook processed for ${platform}:`, result.message);

    return c.json({
      success: true,
      message: 'Webhook processed successfully',
      platform,
      event,
      processedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return c.json({
      success: false,
      error: 'Failed to process webhook',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get connected integrations
app.get('/make-server-88829a40/integrations/connected', async (c) => {
  try {
    const connectedIntegrations = [];

    // Check each platform for connection status
    for (const platform of Object.keys(PLATFORM_CONFIGS)) {
      const statusKey = `integration:${platform}:status`;
      const status = await kv.get(statusKey);
      
      if (status && status.connected) {
        const credentialsKey = `integration:${platform}:credentials`;
        const credentials = await kv.get(credentialsKey);
        
        connectedIntegrations.push({
          platform,
          connected: true,
          lastSync: status.lastSync,
          authType: status.authType,
          hasValidCredentials: !!credentials,
          expiresAt: credentials?.expiresAt
        });
      }
    }

    return c.json({
      success: true,
      integrations: connectedIntegrations,
      total: connectedIntegrations.length
    });

  } catch (error) {
    console.error('Failed to get connected integrations:', error);
    return c.json({
      success: false,
      error: 'Failed to retrieve integrations',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Sync app data from external platform
app.post('/make-server-88829a40/integrations/sync/:platform/:appId', async (c) => {
  try {
    const platform = c.req.param('platform');
    const appId = c.req.param('appId');

    console.log(`🔄 Starting sync for ${platform} app: ${appId}`);

    // Get credentials
    const credentialsKey = `integration:${platform}:credentials`;
    const credentials = await kv.get(credentialsKey);

    if (!credentials) {
      return c.json({
        success: false,
        error: 'No credentials found for platform',
        platform
      }, 400);
    }

    // Check if token needs refresh
    if (credentials.expiresAt && new Date(credentials.expiresAt) <= new Date()) {
      const refreshResult = await refreshAccessToken(platform, credentials);
      if (!refreshResult.success) {
        return c.json({
          success: false,
          error: 'Failed to refresh access token',
          platform
        }, 401);
      }
    }

    // Fetch app data from external platform
    const appData = await fetchAppData(platform, appId, credentials);

    if (!appData.success) {
      return c.json({
        success: false,
        error: 'Failed to fetch app data',
        platform,
        details: appData.error
      }, 500);
    }

    // Store synced data
    const syncKey = `sync:${platform}:${appId}:${Date.now()}`;
    await kv.set(syncKey, {
      platform,
      appId,
      data: appData.data,
      syncedAt: new Date().toISOString()
    });

    // Update last sync time
    const statusKey = `integration:${platform}:status`;
    const status = await kv.get(statusKey);
    if (status) {
      await kv.set(statusKey, {
        ...status,
        lastSync: new Date().toISOString()
      });
    }

    console.log(`✅ Sync completed for ${platform} app: ${appId}`);

    return c.json({
      success: true,
      message: 'App data synced successfully',
      platform,
      appId,
      data: appData.data,
      syncedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Sync error:', error);
    return c.json({
      success: false,
      error: 'Sync failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Disconnect integration
app.delete('/make-server-88829a40/integrations/disconnect/:platform', async (c) => {
  try {
    const platform = c.req.param('platform');

    console.log(`🔌 Disconnecting integration: ${platform}`);

    // Remove credentials
    const credentialsKey = `integration:${platform}:credentials`;
    await kv.del(credentialsKey);

    // Update status
    const statusKey = `integration:${platform}:status`;
    await kv.set(statusKey, {
      connected: false,
      disconnectedAt: new Date().toISOString(),
      platform
    });

    console.log(`✅ Integration disconnected: ${platform}`);

    return c.json({
      success: true,
      message: 'Integration disconnected successfully',
      platform,
      disconnectedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Disconnect error:', error);
    return c.json({
      success: false,
      error: 'Failed to disconnect integration',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Helper functions

async function exchangeOAuthCode(platform: string, code: string, config: any) {
  try {
    const tokenEndpoint = getTokenEndpoint(platform);
    
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        grant_type: 'authorization_code'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Token exchange failed: ${response.statusText}`,
        details: errorText
      };
    }

    const tokenData = await response.json();

    return {
      success: true,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: tokenData.expires_in 
        ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
        : null
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function processWebhook(platform: string, event: string, payload: any) {
  try {
    console.log(`Processing ${platform} webhook event: ${event}`);

    switch (platform) {
      case 'bolt.new':
        return await processBoltWebhook(event, payload);
      case 'replit.com':
        return await processReplitWebhook(event, payload);
      case 'vercel.com':
        return await processVercelWebhook(event, payload);
      case 'netlify.com':
        return await processNetlifyWebhook(event, payload);
      default:
        return {
          success: true,
          message: `Webhook received for ${platform}:${event}`
        };
    }

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function processBoltWebhook(event: string, payload: any) {
  switch (event) {
    case 'app.deployed':
      console.log('Bolt app deployed:', payload.app?.name);
      // Trigger sync or update in FlashFusion
      break;
    case 'app.updated':
      console.log('Bolt app updated:', payload.app?.name);
      // Update app data in FlashFusion
      break;
    default:
      console.log('Unhandled Bolt webhook event:', event);
  }
  
  return { success: true, message: `Processed Bolt ${event} event` };
}

async function processReplitWebhook(event: string, payload: any) {
  switch (event) {
    case 'repl.run':
      console.log('Repl started:', payload.repl?.title);
      break;
    case 'git.push':
      console.log('Git push to repl:', payload.repl?.title);
      break;
    default:
      console.log('Unhandled Replit webhook event:', event);
  }
  
  return { success: true, message: `Processed Replit ${event} event` };
}

async function processVercelWebhook(event: string, payload: any) {
  switch (event) {
    case 'deployment.created':
      console.log('Vercel deployment created:', payload.deployment?.url);
      break;
    case 'deployment.ready':
      console.log('Vercel deployment ready:', payload.deployment?.url);
      break;
    default:
      console.log('Unhandled Vercel webhook event:', event);
  }
  
  return { success: true, message: `Processed Vercel ${event} event` };
}

async function processNetlifyWebhook(event: string, payload: any) {
  switch (event) {
    case 'deploy-succeeded':
      console.log('Netlify deploy succeeded:', payload.deploy?.ssl_url);
      break;
    case 'deploy-failed':
      console.log('Netlify deploy failed:', payload.deploy?.error_message);
      break;
    default:
      console.log('Unhandled Netlify webhook event:', event);
  }
  
  return { success: true, message: `Processed Netlify ${event} event` };
}

async function fetchAppData(platform: string, appId: string, credentials: any) {
  try {
    const apiEndpoint = getApiEndpoint(platform, appId);
    
    const response = await fetch(apiEndpoint, {
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return {
        success: false,
        error: `API request failed: ${response.statusText}`
      };
    }

    const data = await response.json();

    return {
      success: true,
      data: data
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function refreshAccessToken(platform: string, credentials: any) {
  try {
    if (!credentials.refreshToken) {
      return { success: false, error: 'No refresh token available' };
    }

    const config = PLATFORM_CONFIGS[platform as keyof typeof PLATFORM_CONFIGS];
    const tokenEndpoint = getTokenEndpoint(platform);

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        refresh_token: credentials.refreshToken,
        grant_type: 'refresh_token'
      })
    });

    if (!response.ok) {
      return { success: false, error: 'Token refresh failed' };
    }

    const tokenData = await response.json();

    // Update stored credentials
    const credentialsKey = `integration:${platform}:credentials`;
    await kv.set(credentialsKey, {
      ...credentials,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || credentials.refreshToken,
      expiresAt: tokenData.expires_in 
        ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
        : null
    });

    return { success: true };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function verifyWebhookSignature(payload: string, signature: string, secret: string): Promise<boolean> {
  try {
    // Implementation depends on platform-specific signature verification
    // This is a simplified version - in production, implement proper HMAC verification
    
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    const calculatedSignature = Array.from(new Uint8Array(signatureBytes))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Compare signatures (remove prefix if present)
    const providedSignature = signature.replace(/^sha256=/, '');
    
    return calculatedSignature === providedSignature;

  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

function getTokenEndpoint(platform: string): string {
  const endpoints: Record<string, string> = {
    'bolt.new': 'https://api.bolt.new/v1/oauth/token',
    'replit.com': 'https://replit.com/api/oauth/token',
    'vercel.com': 'https://api.vercel.com/v2/oauth/access_token',
    'netlify.com': 'https://api.netlify.com/oauth/token'
  };
  
  return endpoints[platform] || '';
}

function getApiEndpoint(platform: string, appId: string): string {
  const endpoints: Record<string, string> = {
    'bolt.new': `https://api.bolt.new/v1/apps/${appId}`,
    'replit.com': `https://replit.com/graphql`, // GraphQL endpoint
    'vercel.com': `https://api.vercel.com/v13/projects/${appId}`,
    'netlify.com': `https://api.netlify.com/api/v1/sites/${appId}`
  };
  
  return endpoints[platform] || '';
}

export default app;