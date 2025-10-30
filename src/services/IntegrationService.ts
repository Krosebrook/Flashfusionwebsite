import { APIKeyService, type APIProvider } from './APIKeyService';
import { toast } from 'sonner';

/**
 * FlashFusion Integration Service
 * Manages all external API integrations and services
 */

export interface IntegrationConfig {
  name: string;
  provider: APIProvider;
  enabled: boolean;
  baseUrl?: string;
  description: string;
  category: 'development' | 'content' | 'ecommerce' | 'media' | 'automation' | 'analytics';
}

export interface IntegrationStatus {
  provider: APIProvider;
  connected: boolean;
  lastChecked: string;
  error?: string;
}

class IntegrationServiceClass {
  private integrations: Map<APIProvider, IntegrationConfig> = new Map();
  private statusCache: Map<APIProvider, IntegrationStatus> = new Map();

  constructor() {
    this.initializeIntegrations();
  }

  private initializeIntegrations() {
    const configs: IntegrationConfig[] = [
      // Development & Repository
      {
        name: 'GitHub',
        provider: 'github',
        enabled: true,
        baseUrl: 'https://api.github.com',
        description: 'Repository analysis, code review, and version control',
        category: 'development'
      },
      {
        name: 'Vercel',
        provider: 'vercel',
        enabled: true,
        baseUrl: 'https://api.vercel.com',
        description: 'Automated deployments and hosting',
        category: 'development'
      },
      
      // Content & Automation
      {
        name: 'FireCrawl',
        provider: 'firecrawl',
        enabled: true,
        baseUrl: 'https://api.firecrawl.dev',
        description: 'Web scraping and content extraction',
        category: 'content'
      },
      {
        name: 'Notion',
        provider: 'notion',
        enabled: true,
        baseUrl: 'https://api.notion.com',
        description: 'Documentation and content management',
        category: 'content'
      },
      
      // Media & Design
      {
        name: 'Leap AI',
        provider: 'leap',
        enabled: true,
        baseUrl: 'https://api.tryleap.ai',
        description: 'AI image generation and processing',
        category: 'media'
      },
      {
        name: 'ElevenLabs',
        provider: 'elevenlabs',
        enabled: true,
        baseUrl: 'https://api.elevenlabs.io',
        description: 'Voice synthesis and audio generation',
        category: 'media'
      },
      
      // E-commerce & Print-on-Demand
      {
        name: 'Printify',
        provider: 'printify',
        enabled: true,
        baseUrl: 'https://api.printify.com',
        description: 'Print-on-demand products and fulfillment',
        category: 'ecommerce'
      },
      {
        name: 'Stripe',
        provider: 'stripe',
        enabled: true,
        baseUrl: 'https://api.stripe.com',
        description: 'Payment processing and subscriptions',
        category: 'ecommerce'
      },
      
      // AI & Advanced Models
      {
        name: 'OpenRouter',
        provider: 'openrouter',
        enabled: true,
        baseUrl: 'https://openrouter.ai/api',
        description: 'Access to multiple AI models through unified API',
        category: 'automation'
      }
    ];

    configs.forEach(config => {
      this.integrations.set(config.provider, config);
    });
  }

  /**
   * Check if an integration is available and connected
   */
  async checkIntegration(provider: APIProvider): Promise<IntegrationStatus> {
    const cached = this.statusCache.get(provider);
    const now = new Date().toISOString();
    
    // Return cached status if checked recently (within 5 minutes)
    if (cached && new Date(cached.lastChecked).getTime() > Date.now() - 5 * 60 * 1000) {
      return cached;
    }

    const status: IntegrationStatus = {
      provider,
      connected: false,
      lastChecked: now
    };

    try {
      const hasKey = await APIKeyService.hasApiKey(provider);
      if (!hasKey) {
        status.error = 'API key not configured';
        this.statusCache.set(provider, status);
        return status;
      }

      // Test the connection
      const connected = await this.testConnection(provider);
      status.connected = connected;
      
      if (!connected) {
        status.error = 'Connection test failed';
      }

    } catch (error) {
      status.error = error instanceof Error ? error.message : 'Unknown error';
    }

    this.statusCache.set(provider, status);
    return status;
  }

  /**
   * Test connection to a specific integration
   */
  private async testConnection(provider: APIProvider): Promise<boolean> {
    try {
      const apiKey = await APIKeyService.getApiKey(provider);
      if (!apiKey) return false;

      const config = this.integrations.get(provider);
      if (!config) return false;

      // Simple health check for each provider
      switch (provider) {
        case 'github':
          return await this.testGitHub(apiKey);
        case 'vercel':
          return await this.testVercel(apiKey);
        case 'stripe':
          return await this.testStripe(apiKey);
        case 'notion':
          return await this.testNotion(apiKey);
        case 'printify':
          return await this.testPrintify(apiKey);
        default:
          // For other providers, just check if key exists
          return !!apiKey;
      }
    } catch (error) {
      console.error(`Connection test failed for ${provider}:`, error);
      return false;
    }
  }

  private async testGitHub(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async testVercel(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.vercel.com/v2/user', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async testStripe(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.stripe.com/v1/account', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async testNotion(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.notion.com/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Notion-Version': '2022-06-28'
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async testPrintify(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.printify.com/v1/shops.json', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get all integration statuses
   */
  async getAllStatuses(): Promise<IntegrationStatus[]> {
    const providers = Array.from(this.integrations.keys());
    const statuses = await Promise.all(
      providers.map(provider => this.checkIntegration(provider))
    );
    return statuses;
  }

  /**
   * Get integrations by category
   */
  getIntegrationsByCategory(category: IntegrationConfig['category']): IntegrationConfig[] {
    return Array.from(this.integrations.values()).filter(
      integration => integration.category === category
    );
  }

  /**
   * Get integration configuration
   */
  getIntegrationConfig(provider: APIProvider): IntegrationConfig | null {
    return this.integrations.get(provider) || null;
  }

  /**
   * GitHub Repository Operations
   */
  async analyzeRepository(repoUrl: string, branch = 'main'): Promise<any> {
    const apiKey = await APIKeyService.getApiKey('github');
    if (!apiKey) {
      throw new Error('GitHub API key not configured');
    }

    try {
      // Parse repository URL
      const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) {
        throw new Error('Invalid GitHub repository URL');
      }

      const [, owner, repo] = match;
      const cleanRepo = repo.replace('.git', '');

      // Get repository information
      const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!repoResponse.ok) {
        throw new Error(`Failed to fetch repository: ${repoResponse.statusText}`);
      }

      const repoData = await repoResponse.json();

      // Get repository contents
      const contentsResponse = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/contents?ref=${branch}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      const contents = contentsResponse.ok ? await contentsResponse.json() : [];

      return {
        repository: repoData,
        contents,
        technologies: this.detectTechnologies(contents),
        structure: await this.getFileStructure(owner, cleanRepo, branch, apiKey)
      };

    } catch (error) {
      console.error('Repository analysis failed:', error);
      throw error;
    }
  }

  private detectTechnologies(contents: any[]): string[] {
    const technologies: string[] = [];
    const filenames = contents.map((item: any) => item.name.toLowerCase());

    // Detect technologies based on files
    if (filenames.includes('package.json')) technologies.push('Node.js');
    if (filenames.includes('yarn.lock')) technologies.push('Yarn');
    if (filenames.includes('pnpm-lock.yaml')) technologies.push('PNPM');
    if (filenames.includes('requirements.txt')) technologies.push('Python');
    if (filenames.includes('composer.json')) technologies.push('PHP');
    if (filenames.includes('cargo.toml')) technologies.push('Rust');
    if (filenames.includes('go.mod')) technologies.push('Go');
    if (filenames.includes('gemfile')) technologies.push('Ruby');
    if (filenames.includes('dockerfile')) technologies.push('Docker');
    if (filenames.includes('docker-compose.yml')) technologies.push('Docker Compose');
    if (filenames.includes('next.config.js')) technologies.push('Next.js');
    if (filenames.includes('nuxt.config.js')) technologies.push('Nuxt.js');
    if (filenames.includes('vue.config.js')) technologies.push('Vue.js');
    if (filenames.includes('angular.json')) technologies.push('Angular');
    if (filenames.includes('svelte.config.js')) technologies.push('Svelte');
    if (filenames.includes('vite.config.js')) technologies.push('Vite');
    if (filenames.includes('webpack.config.js')) technologies.push('Webpack');
    if (filenames.includes('tsconfig.json')) technologies.push('TypeScript');
    if (filenames.includes('tailwind.config.js')) technologies.push('Tailwind CSS');

    return technologies;
  }

  private async getFileStructure(owner: string, repo: string, branch: string, apiKey: string): Promise<any[]> {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.tree || [];
    } catch {
      return [];
    }
  }

  /**
   * Vercel Deployment Operations
   */
  async deployToVercel(projectData: any): Promise<any> {
    const apiKey = await APIKeyService.getApiKey('vercel');
    if (!apiKey) {
      throw new Error('Vercel API key not configured');
    }

    try {
      const response = await fetch('https://api.vercel.com/v13/deployments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: projectData.name,
          files: projectData.files,
          projectSettings: {
            framework: projectData.framework
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Deployment failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Vercel deployment failed:', error);
      throw error;
    }
  }

  /**
   * Stripe Payment Operations
   */
  async createPaymentIntent(amount: number, currency = 'usd'): Promise<any> {
    const apiKey = await APIKeyService.getApiKey('stripe');
    if (!apiKey) {
      throw new Error('Stripe API key not configured');
    }

    try {
      const response = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          amount: amount.toString(),
          currency,
          automatic_payment_methods: JSON.stringify({ enabled: true })
        })
      });

      if (!response.ok) {
        throw new Error(`Payment intent creation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Stripe payment intent creation failed:', error);
      throw error;
    }
  }

  /**
   * Clear status cache
   */
  clearStatusCache() {
    this.statusCache.clear();
  }

  /**
   * Refresh all integration statuses
   */
  async refreshAllStatuses(): Promise<IntegrationStatus[]> {
    this.clearStatusCache();
    return await this.getAllStatuses();
  }
}

// Export singleton instance
export const IntegrationService = new IntegrationServiceClass();

// Export for use in components
export default IntegrationService;