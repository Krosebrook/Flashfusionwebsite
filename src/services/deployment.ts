import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { toast } from 'sonner';
import type { GeneratedApp } from '../types/full-stack-builder';

export interface DeploymentConfig {
  platform: 'vercel' | 'netlify' | 'railway' | 'heroku' | 'aws' | 'digitalocean' | 'github-pages' | 'render';
  projectId?: string;
  apiKey?: string;
  environmentVariables?: Record<string, string>;
  buildCommand?: string;
  outputDirectory?: string;
  nodeVersion?: string;
}

export interface DeploymentResult {
  id: string;
  url?: string;
  status: 'deploying' | 'deployed' | 'failed' | 'cancelled';
  platform: string;
  error?: string;
  buildTime?: number;
  logs?: string[];
}

export interface DeploymentStatus {
  id: string;
  status: 'deploying' | 'deployed' | 'failed' | 'cancelled' | 'building' | 'ready';
  progress?: number;
  message?: string;
  url?: string;
  logs?: string[];
  error?: string;
}

/**
 * Real Deployment Service for FlashFusion
 * Connects to actual deployment platforms with real APIs
 */
export class DeploymentService {
  
  /**
   * Deploy to Vercel using their API
   */
  async deployToVercel(app: GeneratedApp, config: DeploymentConfig): Promise<DeploymentResult> {
    try {
      const vercelToken = config.apiKey || await this.getStoredApiKey('vercel');
      
      if (!vercelToken) {
        throw new Error('Vercel API token is required. Please add it in Settings > Integrations.');
      }

      // Create deployment on Vercel
      const deploymentData = {
        name: app.name.toLowerCase().replace(/\s+/g, '-'),
        files: this.prepareVercelFiles(app),
        projectSettings: {
          framework: app.stack.frontend === 'nextjs' ? 'nextjs' : 'create-react-app',
          buildCommand: config.buildCommand || 'npm run build',
          outputDirectory: config.outputDirectory || (app.stack.frontend === 'nextjs' ? '.next' : 'build'),
          installCommand: 'npm install',
          devCommand: 'npm run dev'
        },
        env: this.prepareEnvironmentVariables(config.environmentVariables)
      };

      const response = await fetch('https://api.vercel.com/v13/deployments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(deploymentData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Vercel deployment failed');
      }

      const deploymentResult: DeploymentResult = {
        id: result.id,
        url: result.url,
        status: 'deploying',
        platform: 'vercel'
      };

      // Store deployment in database
      await this.storeDeployment(app, deploymentResult);

      toast.success('Deployment started on Vercel!');
      return deploymentResult;

    } catch (error) {
      console.error('Vercel deployment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown deployment error';
      toast.error(`Vercel deployment failed: ${errorMessage}`);
      
      return {
        id: Date.now().toString(),
        status: 'failed',
        platform: 'vercel',
        error: errorMessage
      };
    }
  }

  /**
   * Deploy to Netlify using their API
   */
  async deployToNetlify(app: GeneratedApp, config: DeploymentConfig): Promise<DeploymentResult> {
    try {
      const netlifyToken = config.apiKey || await this.getStoredApiKey('netlify');
      
      if (!netlifyToken) {
        throw new Error('Netlify API token is required. Please add it in Settings > Integrations.');
      }

      // Create a new site or use existing
      let siteId = config.projectId;
      
      if (!siteId) {
        // Create new site
        const siteResponse = await fetch('https://api.netlify.com/api/v1/sites', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${netlifyToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: app.name.toLowerCase().replace(/\s+/g, '-'),
            build_settings: {
              cmd: config.buildCommand || 'npm run build',
              dir: config.outputDirectory || 'build'
            }
          })
        });

        const siteData = await siteResponse.json();
        if (!siteResponse.ok) {
          throw new Error(siteData.message || 'Failed to create Netlify site');
        }
        
        siteId = siteData.id;
      }

      // Deploy to Netlify
      const files = this.prepareNetlifyFiles(app);
      const formData = new FormData();
      
      // Add files to form data
      Object.entries(files).forEach(([path, content]) => {
        formData.append(path, new Blob([content], { type: 'text/plain' }));
      });

      const deployResponse = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${netlifyToken}`
        },
        body: formData
      });

      const deployData = await deployResponse.json();
      
      if (!deployResponse.ok) {
        throw new Error(deployData.message || 'Netlify deployment failed');
      }

      const deploymentResult: DeploymentResult = {
        id: deployData.id,
        url: deployData.ssl_url || deployData.url,
        status: 'deploying',
        platform: 'netlify'
      };

      // Store deployment in database
      await this.storeDeployment(app, deploymentResult);

      toast.success('Deployment started on Netlify!');
      return deploymentResult;

    } catch (error) {
      console.error('Netlify deployment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown deployment error';
      toast.error(`Netlify deployment failed: ${errorMessage}`);
      
      return {
        id: Date.now().toString(),
        status: 'failed',
        platform: 'netlify',
        error: errorMessage
      };
    }
  }

  /**
   * Deploy to Railway using their API
   */
  async deployToRailway(app: GeneratedApp, config: DeploymentConfig): Promise<DeploymentResult> {
    try {
      const railwayToken = config.apiKey || await this.getStoredApiKey('railway');
      
      if (!railwayToken) {
        throw new Error('Railway API token is required. Please add it in Settings > Integrations.');
      }

      // Railway GraphQL API
      const mutation = `
        mutation deployProject($input: DeploymentCreateInput!) {
          deploymentCreate(input: $input) {
            id
            url
            status
          }
        }
      `;

      const variables = {
        input: {
          projectId: config.projectId,
          environment: 'production',
          source: {
            type: 'UPLOAD',
            files: this.prepareRailwayFiles(app)
          },
          variables: config.environmentVariables || {}
        }
      };

      const response = await fetch('https://backboard.railway.app/graphql/v2', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${railwayToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: mutation, variables })
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Railway deployment failed');
      }

      const deployment = result.data.deploymentCreate;
      
      const deploymentResult: DeploymentResult = {
        id: deployment.id,
        url: deployment.url,
        status: 'deploying',
        platform: 'railway'
      };

      // Store deployment in database
      await this.storeDeployment(app, deploymentResult);

      toast.success('Deployment started on Railway!');
      return deploymentResult;

    } catch (error) {
      console.error('Railway deployment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown deployment error';
      toast.error(`Railway deployment failed: ${errorMessage}`);
      
      return {
        id: Date.now().toString(),
        status: 'failed',
        platform: 'railway',
        error: errorMessage
      };
    }
  }

  /**
   * Deploy to Render using their API
   */
  async deployToRender(app: GeneratedApp, config: DeploymentConfig): Promise<DeploymentResult> {
    try {
      const renderToken = config.apiKey || await this.getStoredApiKey('render');
      
      if (!renderToken) {
        throw new Error('Render API token is required. Please add it in Settings > Integrations.');
      }

      const serviceData = {
        name: app.name.toLowerCase().replace(/\s+/g, '-'),
        type: 'web_service',
        repo: {
          type: 'git',
          url: 'https://github.com/flashfusion/generated-app.git' // Would be the actual repo
        },
        build: {
          command: config.buildCommand || 'npm run build'
        },
        start: {
          command: 'npm start'
        },
        env: config.environmentVariables || {}
      };

      const response = await fetch('https://api.render.com/v1/services', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${renderToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(serviceData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Render deployment failed');
      }

      const deploymentResult: DeploymentResult = {
        id: result.id,
        url: result.url,
        status: 'deploying',
        platform: 'render'
      };

      // Store deployment in database
      await this.storeDeployment(app, deploymentResult);

      toast.success('Deployment started on Render!');
      return deploymentResult;

    } catch (error) {
      console.error('Render deployment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown deployment error';
      toast.error(`Render deployment failed: ${errorMessage}`);
      
      return {
        id: Date.now().toString(),
        status: 'failed',
        platform: 'render',
        error: errorMessage
      };
    }
  }

  /**
   * Get deployment status from platform
   */
  async getDeploymentStatus(deploymentId: string, platform: string): Promise<DeploymentStatus> {
    try {
      switch (platform) {
        case 'vercel':
          return await this.getVercelDeploymentStatus(deploymentId);
        case 'netlify':
          return await this.getNetlifyDeploymentStatus(deploymentId);
        case 'railway':
          return await this.getRailwayDeploymentStatus(deploymentId);
        case 'render':
          return await this.getRenderDeploymentStatus(deploymentId);
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
    } catch (error) {
      console.error(`Error getting ${platform} deployment status:`, error);
      return {
        id: deploymentId,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async getVercelDeploymentStatus(deploymentId: string): Promise<DeploymentStatus> {
    const token = await this.getStoredApiKey('vercel');
    
    const response = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    return {
      id: deploymentId,
      status: this.mapVercelStatus(data.readyState),
      url: data.url,
      message: data.status
    };
  }

  private async getNetlifyDeploymentStatus(deploymentId: string): Promise<DeploymentStatus> {
    const token = await this.getStoredApiKey('netlify');
    
    const response = await fetch(`https://api.netlify.com/api/v1/deploys/${deploymentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    return {
      id: deploymentId,
      status: this.mapNetlifyStatus(data.state),
      url: data.ssl_url || data.url,
      message: data.error_message || data.title
    };
  }

  private async getRailwayDeploymentStatus(deploymentId: string): Promise<DeploymentStatus> {
    const token = await this.getStoredApiKey('railway');
    
    const query = `
      query getDeployment($id: String!) {
        deployment(id: $id) {
          id
          status
          url
          createdAt
          completedAt
        }
      }
    `;

    const response = await fetch('https://backboard.railway.app/graphql/v2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query, variables: { id: deploymentId } })
    });

    const result = await response.json();
    const deployment = result.data.deployment;
    
    return {
      id: deploymentId,
      status: this.mapRailwayStatus(deployment.status),
      url: deployment.url,
      message: deployment.status
    };
  }

  private async getRenderDeploymentStatus(deploymentId: string): Promise<DeploymentStatus> {
    const token = await this.getStoredApiKey('render');
    
    const response = await fetch(`https://api.render.com/v1/services/${deploymentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    return {
      id: deploymentId,
      status: this.mapRenderStatus(data.status),
      url: data.url,
      message: data.status
    };
  }

  /**
   * Store deployment in database
   */
  private async storeDeployment(app: GeneratedApp, deployment: DeploymentResult): Promise<void> {
    if (!isSupabaseConfigured) return;

    try {
      await supabase.from('deployments').insert({
        user_id: 'current-user', // Would get from auth context
        project_id: app.name, // Would be actual project ID
        platform: deployment.platform,
        url: deployment.url,
        status: deployment.status,
        deployment_id: deployment.id,
        auto_deploy: false
      });
    } catch (error) {
      console.error('Error storing deployment:', error);
    }
  }

  /**
   * Get stored API key for platform
   */
  private async getStoredApiKey(platform: string): Promise<string | null> {
    if (!isSupabaseConfigured) return null;

    try {
      const { data } = await supabase
        .from('integrations')
        .select('config')
        .eq('user_id', 'current-user') // Would get from auth context
        .eq('service', platform)
        .single();

      return data?.config?.apiKey || null;
    } catch (error) {
      console.error(`Error getting ${platform} API key:`, error);
      return null;
    }
  }

  /**
   * Prepare files for different platforms
   */
  private prepareVercelFiles(app: GeneratedApp): Record<string, { file: string }> {
    const files: Record<string, { file: string }> = {};
    
    app.files.forEach(file => {
      files[file.path] = { file: file.content };
    });

    return files;
  }

  private prepareNetlifyFiles(app: GeneratedApp): Record<string, string> {
    const files: Record<string, string> = {};
    
    app.files.forEach(file => {
      files[file.path] = file.content;
    });

    return files;
  }

  private prepareRailwayFiles(app: GeneratedApp): Array<{ path: string; content: string }> {
    return app.files.map(file => ({
      path: file.path,
      content: file.content
    }));
  }

  private prepareEnvironmentVariables(env?: Record<string, string>): Array<{ key: string; value: string }> {
    if (!env) return [];
    
    return Object.entries(env).map(([key, value]) => ({ key, value }));
  }

  /**
   * Status mapping functions
   */
  private mapVercelStatus(status: string): DeploymentStatus['status'] {
    switch (status) {
      case 'BUILDING': return 'building';
      case 'READY': return 'deployed';
      case 'ERROR': return 'failed';
      case 'CANCELED': return 'cancelled';
      default: return 'deploying';
    }
  }

  private mapNetlifyStatus(status: string): DeploymentStatus['status'] {
    switch (status) {
      case 'building': return 'building';
      case 'ready': return 'deployed';
      case 'error': return 'failed';
      case 'stopped': return 'cancelled';
      default: return 'deploying';
    }
  }

  private mapRailwayStatus(status: string): DeploymentStatus['status'] {
    switch (status) {
      case 'BUILDING': return 'building';
      case 'DEPLOYED': return 'deployed';
      case 'FAILED': return 'failed';
      case 'CANCELLED': return 'cancelled';
      default: return 'deploying';
    }
  }

  private mapRenderStatus(status: string): DeploymentStatus['status'] {
    switch (status) {
      case 'building': return 'building';
      case 'live': return 'deployed';
      case 'failed': return 'failed';
      case 'cancelled': return 'cancelled';
      default: return 'deploying';
    }
  }
}

// Export singleton instance
export const deploymentService = new DeploymentService();

// Helper function for easy deployment
export async function deployProject(
  app: GeneratedApp, 
  platform: DeploymentConfig['platform'], 
  config: Partial<DeploymentConfig> = {}
): Promise<DeploymentResult> {
  const fullConfig: DeploymentConfig = {
    platform,
    ...config
  };

  switch (platform) {
    case 'vercel':
      return await deploymentService.deployToVercel(app, fullConfig);
    case 'netlify':
      return await deploymentService.deployToNetlify(app, fullConfig);
    case 'railway':
      return await deploymentService.deployToRailway(app, fullConfig);
    case 'render':
      return await deploymentService.deployToRender(app, fullConfig);
    default:
      throw new Error(`Unsupported deployment platform: ${platform}`);
  }
}