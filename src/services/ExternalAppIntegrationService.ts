/**
 * @fileoverview External App Integration Service for FlashFusion
 * @chunk services
 * @category integrations
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Service layer for managing integrations with external platforms
 * like Bolt.new, Replit, Loveable.dev, etc.
 */

// Platform-specific integration configurations
export const PLATFORM_CONFIGS = {
  'bolt.new': {
    apiBase: 'https://api.bolt.new/v1',
    oauthUrl: 'https://bolt.new/oauth/authorize',
    webhookEvents: ['app.deployed', 'app.updated', 'build.completed'],
    requiredScopes: ['read:apps', 'write:apps', 'read:deployments'],
    exportFormats: ['zip', 'git', 'docker'],
    syncCapabilities: ['code', 'assets', 'config', 'dependencies']
  },
  
  'app.base.44': {
    apiBase: 'https://api.app.base.44/v2',
    oauthUrl: 'https://app.base.44/oauth/authorize',
    webhookEvents: ['app.published', 'data.updated', 'user.action'],
    requiredScopes: ['read:apps', 'read:data', 'write:data'],
    exportFormats: ['json', 'csv', 'api'],
    syncCapabilities: ['data', 'users', 'workflows', 'settings']
  },
  
  'replit.com': {
    apiBase: 'https://replit.com/graphql',
    oauthUrl: 'https://replit.com/oauth/authorize',
    webhookEvents: ['repl.run', 'repl.stop', 'git.push'],
    requiredScopes: ['read:repls', 'write:repls', 'read:git'],
    exportFormats: ['git', 'zip', 'docker'],
    syncCapabilities: ['code', 'environment', 'secrets', 'collaborators']
  },
  
  'loveable.dev': {
    apiBase: 'https://api.loveable.dev/v1',
    oauthUrl: 'https://loveable.dev/oauth/authorize',
    webhookEvents: ['generation.completed', 'app.deployed', 'template.updated'],
    requiredScopes: ['read:apps', 'read:generations', 'write:apps'],
    exportFormats: ['react', 'vue', 'angular', 'zip'],
    syncCapabilities: ['components', 'themes', 'assets', 'config']
  },
  
  'leap.new': {
    apiBase: 'https://api.leap.new/v1',
    oauthUrl: 'https://leap.new/oauth/authorize',
    webhookEvents: ['model.trained', 'inference.completed', 'deployment.ready'],
    requiredScopes: ['read:models', 'write:models', 'read:deployments'],
    exportFormats: ['api', 'sdk', 'docker'],
    syncCapabilities: ['models', 'datasets', 'apis', 'analytics']
  },
  
  'vercel.com': {
    apiBase: 'https://api.vercel.com/v13',
    oauthUrl: 'https://vercel.com/oauth/authorize',
    webhookEvents: ['deployment.created', 'deployment.ready', 'domain.created'],
    requiredScopes: ['read:projects', 'write:projects', 'read:deployments'],
    exportFormats: ['git', 'env', 'config'],
    syncCapabilities: ['deployments', 'domains', 'env-vars', 'analytics']
  },
  
  'netlify.com': {
    apiBase: 'https://api.netlify.com/api/v1',
    oauthUrl: 'https://app.netlify.com/authorize',
    webhookEvents: ['deploy-created', 'deploy-succeeded', 'deploy-failed'],
    requiredScopes: ['read:sites', 'write:sites', 'read:deploys'],
    exportFormats: ['git', 'zip', 'functions'],
    syncCapabilities: ['sites', 'forms', 'functions', 'redirects']
  },
  
  'railway.app': {
    apiBase: 'https://backboard.railway.app/graphql',
    oauthUrl: 'https://railway.app/oauth/authorize',
    webhookEvents: ['deployment.success', 'deployment.failed', 'service.updated'],
    requiredScopes: ['read:projects', 'write:projects', 'read:deployments'],
    exportFormats: ['docker', 'env', 'config'],
    syncCapabilities: ['services', 'databases', 'variables', 'logs']
  }
};

export interface IntegrationCredentials {
  accessToken?: string;
  refreshToken?: string;
  apiKey?: string;
  secretKey?: string;
  webhookSecret?: string;
  expiresAt?: Date;
}

export interface SyncResult {
  success: boolean;
  message: string;
  data?: any;
  errors?: string[];
  timestamp: Date;
}

export interface WebhookPayload {
  platform: string;
  event: string;
  data: any;
  timestamp: Date;
  signature?: string;
}

export class ExternalAppIntegrationService {
  private static instance: ExternalAppIntegrationService;
  private credentials: Map<string, IntegrationCredentials> = new Map();
  private webhookHandlers: Map<string, Function[]> = new Map();

  static getInstance(): ExternalAppIntegrationService {
    if (!ExternalAppIntegrationService.instance) {
      ExternalAppIntegrationService.instance = new ExternalAppIntegrationService();
    }
    return ExternalAppIntegrationService.instance;
  }

  // OAuth Authentication Flow
  async initiateOAuth(platform: string, redirectUri: string): Promise<string> {
    const config = PLATFORM_CONFIGS[platform as keyof typeof PLATFORM_CONFIGS];
    if (!config) {
      throw new Error(`Platform ${platform} not supported`);
    }

    const params = new URLSearchParams({
      client_id: this.getClientId(platform),
      redirect_uri: redirectUri,
      scope: config.requiredScopes.join(' '),
      response_type: 'code',
      state: this.generateState()
    });

    return `${config.oauthUrl}?${params.toString()}`;
  }

  // Exchange OAuth code for access token
  async exchangeOAuthCode(platform: string, code: string, redirectUri: string): Promise<IntegrationCredentials> {
    const config = PLATFORM_CONFIGS[platform as keyof typeof PLATFORM_CONFIGS];
    if (!config) {
      throw new Error(`Platform ${platform} not supported`);
    }

    try {
      const response = await fetch(`${config.apiBase}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          client_id: this.getClientId(platform),
          client_secret: this.getClientSecret(platform),
          code,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        })
      });

      if (!response.ok) {
        throw new Error(`OAuth exchange failed: ${response.statusText}`);
      }

      const tokenData = await response.json();
      
      const credentials: IntegrationCredentials = {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: tokenData.expires_in 
          ? new Date(Date.now() + tokenData.expires_in * 1000)
          : undefined
      };

      this.credentials.set(platform, credentials);
      return credentials;
    } catch (error) {
      console.error(`OAuth exchange failed for ${platform}:`, error);
      throw error;
    }
  }

  // API Key Authentication
  async setApiKey(platform: string, apiKey: string, secretKey?: string): Promise<void> {
    const credentials: IntegrationCredentials = {
      apiKey,
      secretKey
    };

    // Validate API key by making a test request
    const isValid = await this.validateCredentials(platform, credentials);
    if (!isValid) {
      throw new Error('Invalid API credentials');
    }

    this.credentials.set(platform, credentials);
  }

  // Validate credentials
  private async validateCredentials(platform: string, credentials: IntegrationCredentials): Promise<boolean> {
    const config = PLATFORM_CONFIGS[platform as keyof typeof PLATFORM_CONFIGS];
    if (!config) return false;

    try {
      const headers: Record<string, string> = {
        'Accept': 'application/json'
      };

      if (credentials.accessToken) {
        headers['Authorization'] = `Bearer ${credentials.accessToken}`;
      } else if (credentials.apiKey) {
        headers['Authorization'] = `Bearer ${credentials.apiKey}`;
      }

      const response = await fetch(`${config.apiBase}/user`, { headers });
      return response.ok;
    } catch (error) {
      console.error(`Credential validation failed for ${platform}:`, error);
      return false;
    }
  }

  // Sync app data from external platform
  async syncAppData(platform: string, appId: string): Promise<SyncResult> {
    const credentials = this.credentials.get(platform);
    if (!credentials) {
      return {
        success: false,
        message: 'No credentials found for platform',
        timestamp: new Date()
      };
    }

    const config = PLATFORM_CONFIGS[platform as keyof typeof PLATFORM_CONFIGS];
    if (!config) {
      return {
        success: false,
        message: 'Platform not supported',
        timestamp: new Date()
      };
    }

    try {
      const headers = this.getRequestHeaders(platform, credentials);
      const response = await fetch(`${config.apiBase}/apps/${appId}`, { headers });

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.statusText}`);
      }

      const appData = await response.json();
      
      // Platform-specific data processing
      const processedData = await this.processAppData(platform, appData);

      return {
        success: true,
        message: 'App data synced successfully',
        data: processedData,
        timestamp: new Date()
      };
    } catch (error) {
      console.error(`Sync failed for ${platform}:`, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        timestamp: new Date()
      };
    }
  }

  // Export app from external platform
  async exportApp(platform: string, appId: string, format: string): Promise<Blob | string> {
    const credentials = this.credentials.get(platform);
    if (!credentials) {
      throw new Error('No credentials found for platform');
    }

    const config = PLATFORM_CONFIGS[platform as keyof typeof PLATFORM_CONFIGS];
    if (!config || !config.exportFormats.includes(format)) {
      throw new Error(`Export format ${format} not supported for ${platform}`);
    }

    const headers = this.getRequestHeaders(platform, credentials);
    const response = await fetch(`${config.apiBase}/apps/${appId}/export?format=${format}`, {
      headers
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    if (format === 'zip' || format === 'docker') {
      return await response.blob();
    } else {
      return await response.text();
    }
  }

  // Deploy app to external platform
  async deployApp(platform: string, appConfig: any): Promise<SyncResult> {
    const credentials = this.credentials.get(platform);
    if (!credentials) {
      return {
        success: false,
        message: 'No credentials found for platform',
        timestamp: new Date()
      };
    }

    const config = PLATFORM_CONFIGS[platform as keyof typeof PLATFORM_CONFIGS];
    if (!config) {
      return {
        success: false,
        message: 'Platform not supported',
        timestamp: new Date()
      };
    }

    try {
      const headers = this.getRequestHeaders(platform, credentials);
      headers['Content-Type'] = 'application/json';

      const response = await fetch(`${config.apiBase}/apps`, {
        method: 'POST',
        headers,
        body: JSON.stringify(appConfig)
      });

      if (!response.ok) {
        throw new Error(`Deployment failed: ${response.statusText}`);
      }

      const deploymentData = await response.json();

      return {
        success: true,
        message: 'App deployed successfully',
        data: deploymentData,
        timestamp: new Date()
      };
    } catch (error) {
      console.error(`Deployment failed for ${platform}:`, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        timestamp: new Date()
      };
    }
  }

  // Setup webhook for platform
  async setupWebhook(platform: string, webhookUrl: string, events: string[]): Promise<SyncResult> {
    const credentials = this.credentials.get(platform);
    if (!credentials) {
      return {
        success: false,
        message: 'No credentials found for platform',
        timestamp: new Date()
      };
    }

    const config = PLATFORM_CONFIGS[platform as keyof typeof PLATFORM_CONFIGS];
    if (!config) {
      return {
        success: false,
        message: 'Platform not supported',
        timestamp: new Date()
      };
    }

    try {
      const headers = this.getRequestHeaders(platform, credentials);
      headers['Content-Type'] = 'application/json';

      const webhookConfig = {
        url: webhookUrl,
        events: events.filter(event => config.webhookEvents.includes(event)),
        secret: this.generateWebhookSecret()
      };

      const response = await fetch(`${config.apiBase}/webhooks`, {
        method: 'POST',
        headers,
        body: JSON.stringify(webhookConfig)
      });

      if (!response.ok) {
        throw new Error(`Webhook setup failed: ${response.statusText}`);
      }

      const webhookData = await response.json();

      // Store webhook secret
      const updatedCredentials = { ...credentials, webhookSecret: webhookConfig.secret };
      this.credentials.set(platform, updatedCredentials);

      return {
        success: true,
        message: 'Webhook configured successfully',
        data: webhookData,
        timestamp: new Date()
      };
    } catch (error) {
      console.error(`Webhook setup failed for ${platform}:`, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        timestamp: new Date()
      };
    }
  }

  // Handle incoming webhook
  async handleWebhook(platform: string, payload: WebhookPayload): Promise<void> {
    const credentials = this.credentials.get(platform);
    if (!credentials?.webhookSecret) {
      throw new Error('No webhook secret found for platform');
    }

    // Verify webhook signature
    if (payload.signature && !this.verifyWebhookSignature(payload, credentials.webhookSecret)) {
      throw new Error('Invalid webhook signature');
    }

    // Execute registered handlers
    const handlers = this.webhookHandlers.get(`${platform}:${payload.event}`) || [];
    for (const handler of handlers) {
      try {
        await handler(payload);
      } catch (error) {
        console.error(`Webhook handler failed for ${platform}:${payload.event}:`, error);
      }
    }
  }

  // Register webhook handler
  registerWebhookHandler(platform: string, event: string, handler: Function): void {
    const key = `${platform}:${event}`;
    const handlers = this.webhookHandlers.get(key) || [];
    handlers.push(handler);
    this.webhookHandlers.set(key, handlers);
  }

  // Get app list from platform
  async getAppList(platform: string): Promise<any[]> {
    const credentials = this.credentials.get(platform);
    if (!credentials) {
      throw new Error('No credentials found for platform');
    }

    const config = PLATFORM_CONFIGS[platform as keyof typeof PLATFORM_CONFIGS];
    if (!config) {
      throw new Error('Platform not supported');
    }

    const headers = this.getRequestHeaders(platform, credentials);
    const response = await fetch(`${config.apiBase}/apps`, { headers });

    if (!response.ok) {
      throw new Error(`Failed to fetch apps: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.apps || data.data || [];
  }

  // Platform-specific data processing
  private async processAppData(platform: string, rawData: any): Promise<any> {
    switch (platform) {
      case 'bolt.new':
        return {
          id: rawData.id,
          name: rawData.name,
          framework: rawData.stack,
          deploymentUrl: rawData.deployment?.url,
          lastUpdate: new Date(rawData.updatedAt),
          status: rawData.status,
          repository: rawData.git?.repository
        };

      case 'replit.com':
        return {
          id: rawData.id,
          name: rawData.title,
          language: rawData.language,
          deploymentUrl: rawData.hostedUrl,
          lastUpdate: new Date(rawData.timeUpdated),
          status: rawData.isPrivate ? 'private' : 'public',
          repository: rawData.origin?.type === 'github' ? rawData.origin.url : null
        };

      case 'vercel.com':
        return {
          id: rawData.id,
          name: rawData.name,
          framework: rawData.framework,
          deploymentUrl: `https://${rawData.alias?.[0] || rawData.url}`,
          lastUpdate: new Date(rawData.updatedAt),
          status: rawData.readyState,
          repository: rawData.link?.repo
        };

      default:
        return rawData;
    }
  }

  // Helper methods
  private getRequestHeaders(platform: string, credentials: IntegrationCredentials): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': 'FlashFusion/1.0'
    };

    if (credentials.accessToken) {
      headers['Authorization'] = `Bearer ${credentials.accessToken}`;
    } else if (credentials.apiKey) {
      headers['Authorization'] = `Bearer ${credentials.apiKey}`;
    }

    return headers;
  }

  private getClientId(platform: string): string {
    return process.env[`${platform.toUpperCase().replace('.', '_')}_CLIENT_ID`] || '';
  }

  private getClientSecret(platform: string): string {
    return process.env[`${platform.toUpperCase().replace('.', '_')}_CLIENT_SECRET`] || '';
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private generateWebhookSecret(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private verifyWebhookSignature(payload: WebhookPayload, secret: string): boolean {
    // Implementation depends on platform-specific signature verification
    // This is a simplified version
    return true; // In real implementation, verify HMAC signature
  }

  // Refresh expired tokens
  async refreshTokenIfNeeded(platform: string): Promise<boolean> {
    const credentials = this.credentials.get(platform);
    if (!credentials?.refreshToken || !credentials.expiresAt) {
      return false;
    }

    if (credentials.expiresAt > new Date()) {
      return true; // Token still valid
    }

    try {
      const config = PLATFORM_CONFIGS[platform as keyof typeof PLATFORM_CONFIGS];
      const response = await fetch(`${config.apiBase}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: this.getClientId(platform),
          client_secret: this.getClientSecret(platform),
          refresh_token: credentials.refreshToken,
          grant_type: 'refresh_token'
        })
      });

      if (!response.ok) {
        return false;
      }

      const tokenData = await response.json();
      
      const updatedCredentials: IntegrationCredentials = {
        ...credentials,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || credentials.refreshToken,
        expiresAt: tokenData.expires_in 
          ? new Date(Date.now() + tokenData.expires_in * 1000)
          : undefined
      };

      this.credentials.set(platform, updatedCredentials);
      return true;
    } catch (error) {
      console.error(`Token refresh failed for ${platform}:`, error);
      return false;
    }
  }

  // Disconnect platform
  async disconnect(platform: string): Promise<void> {
    this.credentials.delete(platform);
    
    // Clean up webhook handlers
    const handlersToRemove = Array.from(this.webhookHandlers.keys())
      .filter(key => key.startsWith(`${platform}:`));
    
    handlersToRemove.forEach(key => {
      this.webhookHandlers.delete(key);
    });
  }

  // Get connection status
  getConnectionStatus(platform: string): 'connected' | 'expired' | 'disconnected' {
    const credentials = this.credentials.get(platform);
    if (!credentials) {
      return 'disconnected';
    }

    if (credentials.expiresAt && credentials.expiresAt <= new Date()) {
      return 'expired';
    }

    return 'connected';
  }
}

// Export singleton instance
export const integrationService = ExternalAppIntegrationService.getInstance();