import { toast } from 'sonner';
import { APIKeyService, type APIProvider } from './APIKeyService';

/**
 * FlashFusion AI Service
 * Centralized service for all AI model integrations and API calls
 */

export type AIProvider = 'openai' | 'anthropic' | 'google' | 'meta' | 'local' | 'github' | 'xai' | 'deepseek';

export type AIModel = {
  id: string;
  name: string;
  provider: AIProvider;
  description: string;
  capabilities: string[];
  costPer1k: number;
  maxTokens: number;
  speedRating: 1 | 2 | 3 | 4 | 5; // 1 = slowest, 5 = fastest
  qualityRating: 1 | 2 | 3 | 4 | 5; // 1 = lowest, 5 = highest
  available: boolean;
};

export type AIRequest = {
  prompt: string;
  model: string;
  provider: AIProvider;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  context?: Record<string, any>;
};

export type AIResponse = {
  content: string;
  model: string;
  provider: AIProvider;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCost: number;
  };
  metadata: {
    requestId: string;
    timestamp: string;
    processingTime: number;
  };
};

export type RepositoryInfo = {
  url: string;
  branch: string;
  accessToken?: string;
  provider: 'github' | 'gitlab' | 'bitbucket';
  isPrivate: boolean;
};

export type CodeGenerationRequest = {
  type: 'component' | 'page' | 'api' | 'full-stack' | 'config' | 'test';
  framework: string;
  requirements: string;
  context?: {
    existingCode?: string;
    dependencies?: string[];
    styleGuide?: string;
    targetPlatform?: string;
    repository?: RepositoryInfo;
  };
  options?: {
    includeTests?: boolean;
    includeDocumentation?: boolean;
    includeTypeScript?: boolean;
    optimizeForPerformance?: boolean;
    analyzeRepository?: boolean;
  };
};

// Available AI Models Configuration
export const AI_MODELS: AIModel[] = [
  // OpenAI Models
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    description: 'Most capable OpenAI model for complex code generation',
    capabilities: ['code-generation', 'architecture', 'debugging', 'optimization'],
    costPer1k: 0.03,
    maxTokens: 128000,
    speedRating: 4,
    qualityRating: 5,
    available: true
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    description: 'Latest multimodal GPT-4 model with enhanced capabilities',
    capabilities: ['code-generation', 'architecture', 'multimodal', 'optimization'],
    costPer1k: 0.025,
    maxTokens: 128000,
    speedRating: 5,
    qualityRating: 5,
    available: true
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    description: 'Fast and cost-effective for simple tasks',
    capabilities: ['code-generation', 'basic-debugging'],
    costPer1k: 0.002,
    maxTokens: 16384,
    speedRating: 5,
    qualityRating: 3,
    available: true
  },

  // Anthropic (Claude) Models
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    description: 'Latest Claude model with excellent coding and reasoning abilities',
    capabilities: ['code-generation', 'architecture', 'analysis', 'refactoring'],
    costPer1k: 0.015,
    maxTokens: 200000,
    speedRating: 4,
    qualityRating: 5,
    available: true
  },
  {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    description: 'Most powerful Claude model for complex tasks',
    capabilities: ['code-generation', 'architecture', 'analysis', 'refactoring', 'complex-reasoning'],
    costPer1k: 0.075,
    maxTokens: 200000,
    speedRating: 2,
    qualityRating: 5,
    available: true
  },
  {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    description: 'Fast and efficient Claude model for simple code tasks',
    capabilities: ['code-generation', 'basic-debugging'],
    costPer1k: 0.0025,
    maxTokens: 200000,
    speedRating: 5,
    qualityRating: 4,
    available: true
  },

  // Google Models
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'google',
    description: 'Google\'s latest multimodal AI with massive context window',
    capabilities: ['code-generation', 'multimodal', 'optimization', 'long-context'],
    costPer1k: 0.0035,
    maxTokens: 2000000,
    speedRating: 4,
    qualityRating: 5,
    available: false
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'google',
    description: 'Fast and efficient Gemini model for rapid development',
    capabilities: ['code-generation', 'multimodal', 'optimization'],
    costPer1k: 0.001,
    maxTokens: 1000000,
    speedRating: 5,
    qualityRating: 4,
    available: false
  },

  // GitHub Copilot Models
  {
    id: 'copilot-chat',
    name: 'GitHub Copilot Chat',
    provider: 'github',
    description: 'GitHub\'s AI assistant for code generation and explanation',
    capabilities: ['code-generation', 'debugging', 'explanation', 'repository-analysis'],
    costPer1k: 0.002,
    maxTokens: 8192,
    speedRating: 4,
    qualityRating: 4,
    available: false
  },

  // xAI (Grok) Models
  {
    id: 'grok-beta',
    name: 'Grok Beta',
    provider: 'xai',
    description: 'xAI\'s conversational AI with real-time knowledge',
    capabilities: ['code-generation', 'analysis', 'real-time-data'],
    costPer1k: 0.01,
    maxTokens: 32768,
    speedRating: 4,
    qualityRating: 4,
    available: false
  },

  // DeepSeek Models
  {
    id: 'deepseek-coder-33b-instruct',
    name: 'DeepSeek Coder 33B',
    provider: 'deepseek',
    description: 'Specialized coding model with strong programming capabilities',
    capabilities: ['code-generation', 'debugging', 'optimization', 'code-review'],
    costPer1k: 0.0014,
    maxTokens: 16384,
    speedRating: 3,
    qualityRating: 4,
    available: false
  },
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    provider: 'deepseek',
    description: 'General purpose DeepSeek model for various tasks',
    capabilities: ['code-generation', 'analysis', 'explanation'],
    costPer1k: 0.0014,
    maxTokens: 32768,
    speedRating: 4,
    qualityRating: 4,
    available: false
  }
];

class AIServiceClass {
  private selectedModel: string = 'gpt-4-turbo';
  private selectedProvider: AIProvider = 'openai';
  private apiKeys: Map<AIProvider, string> = new Map();
  private requestCount: number = 0;
  private totalCost: number = 0;

  constructor() {
    this.initializeAsync();
  }

  private async initializeAsync() {
    await this.loadApiKeys();
    await this.loadUserPreferences();
  }

  private async loadApiKeys() {
    try {
      // Initialize the API key service
      await APIKeyService.initialize();
      
      // Load API keys for AI providers
      const providers: Array<{ provider: AIProvider; aiProvider: string }> = [
        { provider: 'openai', aiProvider: 'openai' },
        { provider: 'anthropic', aiProvider: 'anthropic' },
        { provider: 'google', aiProvider: 'google' },
        { provider: 'github', aiProvider: 'github' },
        { provider: 'xai', aiProvider: 'xai' },
        { provider: 'deepseek', aiProvider: 'deepseek' }
      ];

      for (const { provider, aiProvider } of providers) {
        const key = await APIKeyService.getApiKey(provider);
        if (key) {
          this.apiKeys.set(aiProvider as AIProvider, key);
        }
      }

      console.log(`🤖 AI Service loaded ${this.apiKeys.size} API keys from Supabase`);
    } catch (error) {
      console.error('Failed to load API keys for AI Service:', error);
      
      // Fallback to local environment variables
      this.loadFallbackKeys();
    }
  }

  private loadFallbackKeys() {
    console.log('🔄 AI Service falling back to local environment variables...');
    
    const keyMappings = {
      openai: 'VITE_OPENAI_API_KEY',
      anthropic: 'VITE_ANTHROPIC_API_KEY',
      google: 'VITE_GOOGLE_AI_API_KEY',
      github: 'VITE_GITHUB_TOKEN',
      xai: 'VITE_XAI_API_KEY',
      deepseek: 'VITE_DEEPSEEK_API_KEY'
    };

    Object.entries(keyMappings).forEach(([provider, envVar]) => {
      const key = import.meta.env[envVar];
      if (key) {
        this.apiKeys.set(provider as AIProvider, key);
      }
    });
  }

  private async loadUserPreferences() {
    const savedModel = localStorage.getItem('ff_selected_ai_model');
    const savedProvider = localStorage.getItem('ff_selected_ai_provider') as AIProvider;
    
    const availableModels = await this.getAvailableModels();
    if (savedModel && availableModels.find(m => m.id === savedModel)) {
      this.selectedModel = savedModel;
    }
    
    if (savedProvider && this.apiKeys.has(savedProvider)) {
      this.selectedProvider = savedProvider;
    }
  }

  public async getAvailableModels(): Promise<AIModel[]> {
    await this.loadApiKeys(); // Ensure keys are loaded
    return AI_MODELS.filter(model => {
      // Only show models for which we have API keys
      return this.apiKeys.has(model.provider);
    });
  }

  public async setModel(modelId: string) {
    await this.loadApiKeys(); // Ensure keys are loaded
    
    const model = AI_MODELS.find(m => m.id === modelId);
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    if (!this.apiKeys.has(model.provider)) {
      throw new Error(`API key not configured for ${model.provider}`);
    }

    this.selectedModel = modelId;
    this.selectedProvider = model.provider;
    
    localStorage.setItem('ff_selected_ai_model', modelId);
    localStorage.setItem('ff_selected_ai_provider', model.provider);
  }

  public getCurrentModel(): AIModel | null {
    return AI_MODELS.find(m => m.id === this.selectedModel) || null;
  }

  public async generateCode(request: CodeGenerationRequest): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(request);
    const userPrompt = this.buildUserPrompt(request);

    const aiResponse = await this.makeAIRequest({
      prompt: userPrompt,
      systemPrompt,
      model: this.selectedModel,
      provider: this.selectedProvider,
      temperature: 0.1, // Lower temperature for more consistent code
      maxTokens: 4000
    });

    return this.extractCode(aiResponse.content);
  }

  public async generateCodeWithRepository(request: CodeGenerationRequest): Promise<string> {
    if (!request.context?.repository) {
      throw new Error('Repository context is required for repository-based code generation');
    }

    // First, analyze the repository if not already done
    const repoInfo = request.context.repository;
    const repoAnalysis = await this.analyzeRepository(
      repoInfo.url,
      repoInfo.branch,
      repoInfo.accessToken
    );

    // Enhance the request with repository context
    const enhancedRequest: CodeGenerationRequest = {
      ...request,
      context: {
        ...request.context,
        repositoryStructure: repoAnalysis.structure,
        detectedTechnologies: repoAnalysis.technologies,
        codebaseSummary: repoAnalysis.codebase_summary,
        repositoryRecommendations: repoAnalysis.recommendations
      }
    };

    const systemPrompt = this.buildSystemPrompt(enhancedRequest);
    const userPrompt = this.buildUserPrompt(enhancedRequest);

    const aiResponse = await this.makeAIRequest({
      prompt: userPrompt,
      systemPrompt,
      model: this.selectedModel,
      provider: this.selectedProvider,
      temperature: 0.1, // Lower temperature for more consistent code
      maxTokens: 6000, // Increased for repository context
      context: {
        repository: repoInfo,
        analysis: repoAnalysis
      }
    });

    return this.extractCode(aiResponse.content);
  }

  public async improveCode(code: string, improvements: string): Promise<string> {
    const systemPrompt = `You are a senior software engineer specializing in code optimization and best practices. 
Your task is to improve the provided code based on the specific requirements.
Always maintain the original functionality while implementing the requested improvements.
Return only the improved code without explanations.`;

    const userPrompt = `Please improve this code:

\`\`\`
${code}
\`\`\`

Improvements requested:
${improvements}

Return the improved code:`;

    const aiResponse = await this.makeAIRequest({
      prompt: userPrompt,
      systemPrompt,
      model: this.selectedModel,
      provider: this.selectedProvider,
      temperature: 0.1
    });

    return this.extractCode(aiResponse.content);
  }

  public async debugCode(code: string, error: string): Promise<{ analysis: string; fixedCode: string }> {
    const systemPrompt = `You are an expert debugging assistant. Analyze the provided code and error, 
then provide both an explanation of the issue and the corrected code.
Format your response as JSON with 'analysis' and 'fixedCode' properties.`;

    const userPrompt = `Debug this code:

\`\`\`
${code}
\`\`\`

Error encountered:
${error}

Provide analysis and fixed code:`;

    const aiResponse = await this.makeAIRequest({
      prompt: userPrompt,
      systemPrompt,
      model: this.selectedModel,
      provider: this.selectedProvider,
      temperature: 0.2
    });

    try {
      return JSON.parse(aiResponse.content);
    } catch {
      // Fallback if JSON parsing fails
      return {
        analysis: "Unable to parse debug response",
        fixedCode: code
      };
    }
  }

  public async generateDocumentation(code: string, type: 'api' | 'component' | 'function' = 'component'): Promise<string> {
    const systemPrompt = `You are a technical documentation expert. Generate comprehensive, clear documentation 
for the provided code. Include usage examples, parameter descriptions, and return values where applicable.`;

    const userPrompt = `Generate ${type} documentation for this code:

\`\`\`
${code}
\`\`\`

Documentation:`;

    const aiResponse = await this.makeAIRequest({
      prompt: userPrompt,
      systemPrompt,
      model: this.selectedModel,
      provider: this.selectedProvider,
      temperature: 0.3
    });

    return aiResponse.content;
  }

  private buildSystemPrompt(request: CodeGenerationRequest): string {
    const basePrompt = `You are an expert ${request.framework} developer working on FlashFusion, 
a comprehensive AI-powered platform for generating web applications.

CRITICAL REQUIREMENTS:
- Follow FlashFusion design system guidelines exactly
- Use brand colors: Primary Orange (#FF7B00), Secondary Cyan (#00B4D8), Accent Magenta (#E91E63)
- Use Sora font for headings/labels, Inter for body text
- Apply consistent animation classes: ff-fade-in-up, ff-hover-glow, ff-card-interactive
- Implement proper accessibility with ff-focus-ring classes
- Include proper TypeScript types and error handling
- Use semantic HTML and ARIA labels
- Optimize for performance with React.memo, useMemo, useCallback where appropriate
- Include proper loading states and error boundaries

STYLE SYSTEM:
- Buttons: ff-btn-primary, ff-btn-secondary, ff-btn-accent
- Cards: ff-card-interactive with ff-hover-lift
- Text: ff-text-gradient for headings, ff-text-primary, ff-text-secondary, ff-text-muted
- Animations: ff-stagger-fade for containers, ff-fade-in-up for elements
- Focus: ff-focus-ring for all interactive elements

Generate production-ready code that follows these guidelines exactly.`;

    if (request.options?.includeTypeScript) {
      return basePrompt + "\n\nUSE TYPESCRIPT: All code must be TypeScript with proper types and interfaces.";
    }

    return basePrompt;
  }

  private buildUserPrompt(request: CodeGenerationRequest): string {
    let prompt = `Generate a ${request.type} for ${request.framework}:\n\n${request.requirements}\n\n`;

    if (request.context?.existingCode) {
      prompt += `Existing code context:\n\`\`\`\n${request.context.existingCode}\n\`\`\`\n\n`;
    }

    if (request.context?.dependencies) {
      prompt += `Required dependencies: ${request.context.dependencies.join(', ')}\n\n`;
    }

    if (request.context?.styleGuide) {
      prompt += `Style guide requirements:\n${request.context.styleGuide}\n\n`;
    }

    // Add repository context if available
    if ((request.context as any)?.repositoryStructure) {
      prompt += `Repository context:\n`;
      prompt += `- Technologies: ${(request.context as any).detectedTechnologies.join(', ')}\n`;
      prompt += `- Codebase summary: ${(request.context as any).codebaseSummary}\n`;
      
      if ((request.context as any)?.repositoryRecommendations) {
        prompt += `- Architecture recommendations: ${(request.context as any).repositoryRecommendations.join(', ')}\n`;
      }
      
      // Add key files from repository structure for better context
      const keyFiles = this.extractKeyFilesFromStructure((request.context as any).repositoryStructure);
      if (keyFiles.length > 0) {
        prompt += `- Key project files: ${keyFiles.join(', ')}\n`;
      }
      
      prompt += `\nGenerate code that follows the existing project structure and patterns.\n\n`;
    }

    if (request.options?.includeTests) {
      prompt += "Include comprehensive unit tests.\n\n";
    }

    if (request.options?.includeDocumentation) {
      prompt += "Include JSDoc documentation for all functions and components.\n\n";
    }

    prompt += "Return only the code without explanations or markdown formatting.";

    return prompt;
  }

  private async makeAIRequest(request: AIRequest): Promise<AIResponse> {
    const model = AI_MODELS.find(m => m.id === request.model);
    if (!model) {
      throw new Error(`Model ${request.model} not found`);
    }

    const apiKey = this.apiKeys.get(request.provider);
    if (!apiKey) {
      throw new Error(`API key not configured for ${request.provider}`);
    }

    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      let response: Response;
      
      switch (request.provider) {
        case 'openai':
          response = await this.callOpenAI(request, apiKey);
          break;
        case 'anthropic':
          response = await this.callAnthropic(request, apiKey);
          break;
        case 'google':
          response = await this.callGoogle(request, apiKey);
          break;
        case 'github':
          response = await this.callGitHubCopilot(request, apiKey);
          break;
        case 'xai':
          response = await this.callXAI(request, apiKey);
          break;
        case 'deepseek':
          response = await this.callDeepSeek(request, apiKey);
          break;
        default:
          throw new Error(`Provider ${request.provider} not implemented`);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`AI API Error: ${response.status} - ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      const processingTime = Date.now() - startTime;

      // Parse response based on provider
      const parsedResponse = this.parseProviderResponse(data, request.provider, model);
      
      // Update usage statistics
      this.requestCount++;
      this.totalCost += parsedResponse.usage.estimatedCost;

      return {
        ...parsedResponse,
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime
        }
      };

    } catch (error) {
      console.error('AI Service Error:', error);
      toast.error(`AI request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  private async callOpenAI(request: AIRequest, apiKey: string): Promise<Response> {
    return fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: request.model,
        messages: [
          ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
          { role: 'user', content: request.prompt }
        ],
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 2000,
        stream: false
      })
    });
  }

  private async callAnthropic(request: AIRequest, apiKey: string): Promise<Response> {
    return fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: request.model,
        max_tokens: request.maxTokens || 2000,
        temperature: request.temperature || 0.7,
        system: request.systemPrompt || '',
        messages: [
          { role: 'user', content: request.prompt }
        ]
      })
    });
  }

  private async callGoogle(request: AIRequest, apiKey: string): Promise<Response> {
    return fetch(`https://generativelanguage.googleapis.com/v1/models/${request.model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: (request.systemPrompt ? request.systemPrompt + '\n\n' : '') + request.prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: request.temperature || 0.7,
          maxOutputTokens: request.maxTokens || 2000
        }
      })
    });
  }

  private async callGitHubCopilot(request: AIRequest, apiKey: string): Promise<Response> {
    // GitHub Copilot Chat API
    return fetch('https://api.github.com/copilot/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json'
      },
      body: JSON.stringify({
        messages: [
          ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
          { role: 'user', content: request.prompt }
        ],
        model: request.model,
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 2000
      })
    });
  }

  private async callXAI(request: AIRequest, apiKey: string): Promise<Response> {
    // xAI Grok API (similar to OpenAI format)
    return fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: request.model,
        messages: [
          ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
          { role: 'user', content: request.prompt }
        ],
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 2000,
        stream: false
      })
    });
  }

  private async callDeepSeek(request: AIRequest, apiKey: string): Promise<Response> {
    // DeepSeek API (OpenAI-compatible)
    return fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: request.model,
        messages: [
          ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
          { role: 'user', content: request.prompt }
        ],
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 2000,
        stream: false
      })
    });
  }

  private parseProviderResponse(data: any, provider: AIProvider, model: AIModel): Omit<AIResponse, 'metadata'> {
    switch (provider) {
      case 'openai':
      case 'xai':
      case 'deepseek':
      case 'github':
        // OpenAI-compatible format
        const usage = data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
        return {
          content: data.choices?.[0]?.message?.content || '',
          model: model.id,
          provider,
          usage: {
            promptTokens: usage.prompt_tokens,
            completionTokens: usage.completion_tokens,
            totalTokens: usage.total_tokens,
            estimatedCost: (usage.total_tokens / 1000) * model.costPer1k
          }
        };

      case 'anthropic':
        const anthropicUsage = data.usage || { input_tokens: 0, output_tokens: 0 };
        const totalTokens = anthropicUsage.input_tokens + anthropicUsage.output_tokens;
        return {
          content: data.content?.[0]?.text || '',
          model: model.id,
          provider,
          usage: {
            promptTokens: anthropicUsage.input_tokens,
            completionTokens: anthropicUsage.output_tokens,
            totalTokens,
            estimatedCost: (totalTokens / 1000) * model.costPer1k
          }
        };

      case 'google':
        // Google's response structure
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const estimatedTokens = Math.ceil(content.length / 4); // Rough estimate
        return {
          content,
          model: model.id,
          provider,
          usage: {
            promptTokens: 0, // Google doesn't provide detailed usage
            completionTokens: estimatedTokens,
            totalTokens: estimatedTokens,
            estimatedCost: (estimatedTokens / 1000) * model.costPer1k
          }
        };

      default:
        throw new Error(`Provider ${provider} response parsing not implemented`);
    }
  }

  private extractCode(content: string): string {
    // Remove markdown code blocks if present
    const codeBlockRegex = /```[\w]*\n?([\s\S]*?)\n?```/g;
    const match = codeBlockRegex.exec(content);
    
    if (match) {
      return match[1].trim();
    }
    
    // If no code blocks found, return the entire content
    return content.trim();
  }

  private extractKeyFilesFromStructure(structure: any[]): string[] {
    const keyFiles: string[] = [];
    const importantFiles = [
      'package.json', 'tsconfig.json', 'tailwind.config.js', 'next.config.js',
      'vite.config.js', 'webpack.config.js', '.eslintrc.json', 'README.md'
    ];

    structure.forEach((item: any) => {
      if (item.type === 'file' && importantFiles.includes(item.name)) {
        keyFiles.push(item.name);
      }
    });

    return keyFiles;
  }

  public getUsageStats() {
    return {
      requestCount: this.requestCount,
      totalCost: this.totalCost,
      selectedModel: this.selectedModel,
      selectedProvider: this.selectedProvider
    };
  }

  public resetUsageStats() {
    this.requestCount = 0;
    this.totalCost = 0;
  }

  public async hasValidApiKey(provider: AIProvider): Promise<boolean> {
    await this.loadApiKeys(); // Ensure keys are loaded
    return this.apiKeys.has(provider) && !!this.apiKeys.get(provider);
  }

  public setApiKey(provider: AIProvider, apiKey: string) {
    this.apiKeys.set(provider, apiKey);
    // Note: In production, you'd want to securely store these
    // For now, we're keeping them in memory only
  }

  // Repository Analysis Methods
  public async analyzeRepository(repoUrl: string, branch: string = 'main', accessToken?: string): Promise<{
    structure: any;
    technologies: string[];
    recommendations: string[];
    codebase_summary: string;
  }> {
    try {
      // Parse GitHub/GitLab URL
      const { owner, repo, provider } = this.parseRepositoryUrl(repoUrl);
      
      // Get repository structure
      const structure = await this.getRepositoryStructure(owner, repo, branch, accessToken, provider);
      
      // Analyze technologies used
      const technologies = this.detectTechnologies(structure);
      
      // Generate AI analysis
      const analysis = await this.generateRepositoryAnalysis(structure, technologies);
      
      return {
        structure,
        technologies,
        recommendations: analysis.recommendations,
        codebase_summary: analysis.summary
      };
    } catch (error) {
      console.error('Repository analysis failed:', error);
      throw new Error(`Failed to analyze repository: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private parseRepositoryUrl(url: string): { owner: string; repo: string; provider: 'github' | 'gitlab' | 'bitbucket' } {
    // Handle GitHub URLs
    const githubMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (githubMatch) {
      return { owner: githubMatch[1], repo: githubMatch[2].replace('.git', ''), provider: 'github' };
    }
    
    // Handle GitLab URLs
    const gitlabMatch = url.match(/gitlab\.com\/([^\/]+)\/([^\/]+)/);
    if (gitlabMatch) {
      return { owner: gitlabMatch[1], repo: gitlabMatch[2].replace('.git', ''), provider: 'gitlab' };
    }
    
    throw new Error('Unsupported repository URL format');
  }

  private async getRepositoryStructure(
    owner: string, 
    repo: string, 
    branch: string, 
    accessToken?: string,
    provider: 'github' | 'gitlab' | 'bitbucket' = 'github'
  ): Promise<any> {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json'
    };
    
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    let apiUrl: string;
    switch (provider) {
      case 'github':
        apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents?ref=${branch}`;
        break;
      case 'gitlab':
        apiUrl = `https://gitlab.com/api/v4/projects/${owner}%2F${repo}/repository/tree?ref=${branch}`;
        break;
      default:
        throw new Error(`Provider ${provider} not supported for repository analysis`);
    }

    const response = await fetch(apiUrl, { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch repository structure: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  }

  private detectTechnologies(structure: any[]): string[] {
    const technologies = new Set<string>();
    const fileExtensions = new Map([
      ['js', 'JavaScript'],
      ['ts', 'TypeScript'],
      ['tsx', 'React TypeScript'],
      ['jsx', 'React'],
      ['py', 'Python'],
      ['java', 'Java'],
      ['kt', 'Kotlin'],
      ['swift', 'Swift'],
      ['go', 'Go'],
      ['rs', 'Rust'],
      ['cpp', 'C++'],
      ['c', 'C'],
      ['cs', 'C#'],
      ['php', 'PHP'],
      ['rb', 'Ruby'],
      ['vue', 'Vue.js'],
      ['svelte', 'Svelte'],
      ['dart', 'Dart'],
      ['css', 'CSS'],
      ['scss', 'Sass'],
      ['less', 'Less'],
      ['html', 'HTML'],
      ['md', 'Markdown'],
      ['json', 'JSON'],
      ['yml', 'YAML'],
      ['yaml', 'YAML'],
      ['dockerfile', 'Docker'],
      ['toml', 'TOML'],
      ['lock', 'Package Lock'],
    ]);

    const configFiles = new Map([
      ['package.json', 'Node.js/npm'],
      ['yarn.lock', 'Yarn'],
      ['pnpm-lock.yaml', 'pnpm'],
      ['requirements.txt', 'Python pip'],
      ['Pipfile', 'Python Pipenv'],
      ['poetry.lock', 'Python Poetry'],
      ['Cargo.toml', 'Rust'],
      ['go.mod', 'Go Modules'],
      ['pom.xml', 'Maven'],
      ['build.gradle', 'Gradle'],
      ['Dockerfile', 'Docker'],
      ['docker-compose.yml', 'Docker Compose'],
      ['.gitignore', 'Git'],
      ['tsconfig.json', 'TypeScript'],
      ['vite.config.ts', 'Vite'],
      ['next.config.js', 'Next.js'],
      ['nuxt.config.js', 'Nuxt.js'],
      ['angular.json', 'Angular'],
      ['vue.config.js', 'Vue.js'],
      ['svelte.config.js', 'Svelte'],
      ['.eslintrc', 'ESLint'],
      ['prettier.config.js', 'Prettier'],
      ['tailwind.config.js', 'Tailwind CSS'],
      ['webpack.config.js', 'Webpack'],
    ]);

    structure.forEach((item: any) => {
      const fileName = item.name || item.path || '';
      const extension = fileName.split('.').pop()?.toLowerCase();
      
      // Check file extensions
      if (extension && fileExtensions.has(extension)) {
        technologies.add(fileExtensions.get(extension)!);
      }
      
      // Check config files
      if (configFiles.has(fileName)) {
        technologies.add(configFiles.get(fileName)!);
      }
    });

    return Array.from(technologies);
  }

  private async generateRepositoryAnalysis(structure: any[], technologies: string[]): Promise<{
    summary: string;
    recommendations: string[];
  }> {
    const prompt = `Analyze this codebase structure and technologies:

Technologies detected: ${technologies.join(', ')}

File structure: ${JSON.stringify(structure.slice(0, 20), null, 2)}

Provide:
1. A concise summary of the codebase
2. 3-5 specific recommendations for improvement or enhancement

Format as JSON:
{
  "summary": "Brief description of the codebase...",
  "recommendations": ["recommendation 1", "recommendation 2", ...]
}`;

    try {
      const response = await this.makeAIRequest({
        prompt,
        model: this.selectedModel,
        provider: this.selectedProvider,
        systemPrompt: 'You are a senior software architect analyzing codebases. Provide clear, actionable insights.',
        temperature: 0.3
      });

      return JSON.parse(response.content);
    } catch (error) {
      // Fallback if AI analysis fails
      return {
        summary: `This appears to be a ${technologies.join(', ')} project with ${structure.length} files/directories in the root.`,
        recommendations: [
          'Consider adding comprehensive documentation',
          'Implement automated testing if not present',
          'Set up continuous integration/deployment',
          'Review security best practices',
          'Optimize performance and bundle size'
        ]
      };
    }
  }

  public async generateCodeWithRepository(request: CodeGenerationRequest & { repositoryContext?: any }): Promise<string> {
    // Enhanced code generation with repository context
    const enhancedRequest = { ...request };
    
    if (request.options?.analyzeRepository && request.context?.repository) {
      try {
        const repoAnalysis = await this.analyzeRepository(
          request.context.repository.url,
          request.context.repository.branch,
          request.context.repository.accessToken
        );
        
        // Add repository context to the request
        enhancedRequest.context = {
          ...enhancedRequest.context,
          existingCode: enhancedRequest.context?.existingCode || '',
          repositoryStructure: repoAnalysis.structure,
          detectedTechnologies: repoAnalysis.technologies,
          codebaseSummary: repoAnalysis.codebase_summary,
        };
      } catch (error) {
        console.warn('Repository analysis failed, proceeding without repository context:', error);
        toast.error('Repository analysis failed, generating code without repository context');
      }
    }
    
    return this.generateCode(enhancedRequest);
  }
}

// Export singleton instance
export const AIService = new AIServiceClass();
export default AIService;