import { projectId, publicAnonKey } from '../utils/supabase/info';

/**
 * FlashFusion API Key Service
 * Securely manages API keys from Supabase environment variables
 */

export type APIProvider = 
  | 'openai' 
  | 'anthropic' 
  | 'google' 
  | 'github' 
  | 'xai' 
  | 'deepseek'
  | 'vercel'
  | 'firecrawl'
  | 'leap'
  | 'openrouter'
  | 'grok'
  | 'notion'
  | 'printify'
  | 'elevenlabs'
  | 'stripe'
  | 'gemini';

export interface APIKeyConfig {
  provider: APIProvider;
  keyName: string;
  required: boolean;
  description: string;
}

// Complete list of API integrations in FlashFusion
export const API_KEY_CONFIGS: APIKeyConfig[] = [
  // AI Models
  {
    provider: 'openai',
    keyName: 'Openai_api_key',
    required: true,
    description: 'OpenAI GPT models for code generation and chat'
  },
  {
    provider: 'anthropic',
    keyName: 'Anthropic',
    required: true,
    description: 'Anthropic Claude models for advanced reasoning'
  },
  {
    provider: 'google',
    keyName: 'Gemini_api_key',
    required: false,
    description: 'Google Gemini models with massive context'
  },
  {
    provider: 'xai',
    keyName: 'grok_api_key',
    required: false,
    description: 'xAI Grok models with real-time data'
  },
  {
    provider: 'deepseek',
    keyName: 'deepseek_api_key',
    required: false,
    description: 'DeepSeek specialized coding models'
  },
  {
    provider: 'openrouter',
    keyName: 'OpenRouter_API_KEY',
    required: false,
    description: 'OpenRouter for accessing multiple AI models'
  },

  // Development & Repository
  {
    provider: 'github',
    keyName: 'Github',
    required: true,
    description: 'GitHub API for repository analysis and integration'
  },
  {
    provider: 'vercel',
    keyName: 'Vercel',
    required: false,
    description: 'Vercel API for automated deployments'
  },

  // Content & Automation
  {
    provider: 'firecrawl',
    keyName: 'FireCrawl_api_key',
    required: false,
    description: 'FireCrawl for web scraping and content extraction'
  },
  {
    provider: 'notion',
    keyName: 'Notion_api_key',
    required: false,
    description: 'Notion API for documentation and content management'
  },

  // Media & Design
  {
    provider: 'leap',
    keyName: 'Leap_api_key',
    required: false,
    description: 'Leap AI for image generation and processing'
  },
  {
    provider: 'elevenlabs',
    keyName: 'Elevellabs_api_key',
    required: false,
    description: 'ElevenLabs for voice synthesis and audio generation'
  },

  // E-commerce & Print-on-Demand
  {
    provider: 'printify',
    keyName: 'Printify_api_key',
    required: false,
    description: 'Printify API for print-on-demand integration'
  },
  {
    provider: 'stripe',
    keyName: 'stripe_secret_api_key',
    required: true,
    description: 'Stripe for payment processing and subscriptions'
  }
];

class APIKeyServiceClass {
  private apiKeys: Map<APIProvider, string> = new Map();
  private isInitialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;

  /**
   * Initialize the API key service by fetching keys from Supabase
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.fetchAPIKeys();
    await this.initializationPromise;
    this.isInitialized = true;
  }

  /**
   * Fetch API keys from Supabase environment variables
   */
  private async fetchAPIKeys(): Promise<void> {
    try {
      // Call the Supabase function to get environment variables
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-88829a40/api-keys`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch API keys: ${response.status}`);
      }

      const data = await response.json();
      
      // Store the API keys
      API_KEY_CONFIGS.forEach(config => {
        const key = data[config.keyName];
        if (key) {
          this.apiKeys.set(config.provider, key);
        } else if (config.required) {
          console.warn(`Required API key missing: ${config.keyName} for ${config.provider}`);
        }
      });

      console.log(`✅ Loaded ${this.apiKeys.size} API keys from Supabase`);

    } catch (error) {
      console.error('Failed to load API keys from Supabase:', error);
      
      // Fallback to local environment variables if Supabase fails
      this.loadFallbackKeys();
    }
  }

  /**
   * Fallback to load API keys from local environment variables
   */
  private loadFallbackKeys(): void {
    console.log('🔄 Falling back to local environment variables...');

    const keyMappings: Record<APIProvider, string> = {
      openai: 'VITE_OPENAI_API_KEY',
      anthropic: 'VITE_ANTHROPIC_API_KEY',
      google: 'VITE_GOOGLE_AI_API_KEY',
      github: 'VITE_GITHUB_TOKEN',
      xai: 'VITE_XAI_API_KEY',
      deepseek: 'VITE_DEEPSEEK_API_KEY',
      vercel: 'VITE_VERCEL_TOKEN',
      firecrawl: 'VITE_FIRECRAWL_API_KEY',
      leap: 'VITE_LEAP_API_KEY',
      openrouter: 'VITE_OPENROUTER_API_KEY',
      grok: 'VITE_GROK_API_KEY',
      notion: 'VITE_NOTION_API_KEY',
      printify: 'VITE_PRINTIFY_API_KEY',
      elevenlabs: 'VITE_ELEVENLABS_API_KEY',
      stripe: 'VITE_STRIPE_SECRET_KEY',
      gemini: 'VITE_GEMINI_API_KEY'
    };

    Object.entries(keyMappings).forEach(([provider, envVar]) => {
      const key = import.meta.env[envVar];
      if (key) {
        this.apiKeys.set(provider as APIProvider, key);
      }
    });

    console.log(`📋 Loaded ${this.apiKeys.size} API keys from local environment`);
  }

  /**
   * Get an API key for a specific provider
   */
  public async getApiKey(provider: APIProvider): Promise<string | null> {
    await this.initialize();
    return this.apiKeys.get(provider) || null;
  }

  /**
   * Check if an API key is available for a provider
   */
  public async hasApiKey(provider: APIProvider): Promise<boolean> {
    await this.initialize();
    return this.apiKeys.has(provider) && !!this.apiKeys.get(provider);
  }

  /**
   * Get all available API providers
   */
  public async getAvailableProviders(): Promise<APIProvider[]> {
    await this.initialize();
    return Array.from(this.apiKeys.keys());
  }

  /**
   * Get API key status for all configured providers
   */
  public async getKeyStatus(): Promise<Record<APIProvider, { available: boolean; required: boolean; description: string }>> {
    await this.initialize();
    
    const status: Record<string, { available: boolean; required: boolean; description: string }> = {};
    
    API_KEY_CONFIGS.forEach(config => {
      status[config.provider] = {
        available: this.apiKeys.has(config.provider),
        required: config.required,
        description: config.description
      };
    });

    return status as Record<APIProvider, { available: boolean; required: boolean; description: string }>;
  }

  /**
   * Validate that all required API keys are available
   */
  public async validateRequiredKeys(): Promise<{ valid: boolean; missing: string[] }> {
    await this.initialize();
    
    const missing: string[] = [];
    
    API_KEY_CONFIGS.forEach(config => {
      if (config.required && !this.apiKeys.has(config.provider)) {
        missing.push(`${config.provider} (${config.keyName})`);
      }
    });

    return {
      valid: missing.length === 0,
      missing
    };
  }

  /**
   * Refresh API keys from Supabase
   */
  public async refresh(): Promise<void> {
    this.isInitialized = false;
    this.initializationPromise = null;
    this.apiKeys.clear();
    await this.initialize();
  }

  /**
   * Get configuration for a specific provider
   */
  public getProviderConfig(provider: APIProvider): APIKeyConfig | null {
    return API_KEY_CONFIGS.find(config => config.provider === provider) || null;
  }

  /**
   * Get all provider configurations
   */
  public getAllConfigs(): APIKeyConfig[] {
    return [...API_KEY_CONFIGS];
  }
}

// Export singleton instance
export const APIKeyService = new APIKeyServiceClass();

// Export for use in components
export default APIKeyService;