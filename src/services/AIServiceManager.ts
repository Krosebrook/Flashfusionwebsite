import { createClient } from '@supabase/supabase-js';

export interface AIProvider {
  name: string;
  apiKey: string;
  baseUrl: string;
  models: string[];
  capabilities: string[];
  rateLimits: {
    requestsPerMinute: number;
    tokensPerMinute: number;
  };
}

export interface AIRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  context?: any;
}

export interface AIResponse {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  provider: string;
  timestamp: number;
  requestId: string;
}

export class AIServiceManager {
  private providers: Map<string, AIProvider> = new Map();
  private supabase: any;
  private rateLimitCache: Map<string, number[]> = new Map();

  constructor() {
    this.initializeProviders();
    this.initializeSupabase();
  }

  private initializeSupabase() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
  }

  private initializeProviders() {
    // OpenAI Provider
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (openaiKey) {
      this.providers.set('openai', {
        name: 'OpenAI',
        apiKey: openaiKey,
        baseUrl: 'https://api.openai.com/v1',
        models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
        capabilities: ['text-generation', 'code-generation', 'reasoning'],
        rateLimits: {
          requestsPerMinute: 3500,
          tokensPerMinute: 90000
        }
      });
    }

    // Anthropic Provider
    const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (anthropicKey) {
      this.providers.set('anthropic', {
        name: 'Anthropic',
        apiKey: anthropicKey,
        baseUrl: 'https://api.anthropic.com/v1',
        models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'],
        capabilities: ['text-generation', 'code-generation', 'analysis'],
        rateLimits: {
          requestsPerMinute: 1000,
          tokensPerMinute: 40000
        }
      });
    }

    // Gemini Provider
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (geminiKey) {
      this.providers.set('gemini', {
        name: 'Google Gemini',
        apiKey: geminiKey,
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
        models: ['gemini-1.5-pro', 'gemini-1.5-flash'],
        capabilities: ['text-generation', 'multimodal', 'reasoning'],
        rateLimits: {
          requestsPerMinute: 2000,
          tokensPerMinute: 32000
        }
      });
    }
  }

  async generateContent(request: AIRequest, preferredProvider?: string): Promise<AIResponse> {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      // Select optimal provider
      const provider = await this.selectOptimalProvider(preferredProvider, request);
      
      if (!provider) {
        throw new Error('No available AI providers configured');
      }

      // Check rate limits
      if (!this.checkRateLimit(provider.name)) {
        throw new Error(`Rate limit exceeded for ${provider.name}`);
      }

      // Generate content
      const response = await this.callProvider(provider, request);
      
      // Log usage for analytics
      await this.logUsage(requestId, provider.name, request, response, Date.now() - startTime);

      return {
        content: response.content,
        model: response.model,
        usage: response.usage,
        provider: provider.name,
        timestamp: Date.now(),
        requestId
      };

    } catch (error) {
      console.error('AI generation failed:', error);
      
      // Try fallback provider
      if (!preferredProvider) {
        const fallbackProvider = this.getFallbackProvider();
        if (fallbackProvider) {
          console.log(`Retrying with fallback provider: ${fallbackProvider.name}`);
          return this.generateContent(request, fallbackProvider.name);
        }
      }

      throw error;
    }
  }

  private async selectOptimalProvider(preferredProvider?: string, request?: AIRequest): Promise<AIProvider | null> {
    if (preferredProvider && this.providers.has(preferredProvider)) {
      return this.providers.get(preferredProvider)!;
    }

    // Score providers based on capabilities and availability
    const availableProviders = Array.from(this.providers.values())
      .filter(provider => this.checkRateLimit(provider.name));

    if (availableProviders.length === 0) {
      return null;
    }

    // Simple scoring: prefer providers with more capabilities
    const scored = availableProviders.map(provider => ({
      provider,
      score: provider.capabilities.length + (provider.rateLimits.requestsPerMinute / 1000)
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored[0].provider;
  }

  private async callProvider(provider: AIProvider, request: AIRequest): Promise<any> {
    switch (provider.name) {
      case 'OpenAI':
        return this.callOpenAI(provider, request);
      case 'Anthropic':
        return this.callAnthropic(provider, request);
      case 'Google Gemini':
        return this.callGemini(provider, request);
      default:
        throw new Error(`Unsupported provider: ${provider.name}`);
    }
  }

  private async callOpenAI(provider: AIProvider, request: AIRequest): Promise<any> {
    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: request.model || 'gpt-4-turbo',
        messages: [
          ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
          { role: 'user', content: request.prompt }
        ],
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 4000
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      model: data.model,
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens
      }
    };
  }

  private async callAnthropic(provider: AIProvider, request: AIRequest): Promise<any> {
    const response = await fetch(`${provider.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': provider.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: request.model || 'claude-3-5-sonnet-20241022',
        max_tokens: request.maxTokens || 4000,
        temperature: request.temperature || 0.7,
        system: request.systemPrompt || '',
        messages: [
          { role: 'user', content: request.prompt }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Anthropic API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    return {
      content: data.content[0].text,
      model: data.model,
      usage: {
        promptTokens: data.usage.input_tokens,
        completionTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens
      }
    };
  }

  private async callGemini(provider: AIProvider, request: AIRequest): Promise<any> {
    const model = request.model || 'gemini-1.5-pro';
    const response = await fetch(`${provider.baseUrl}/models/${model}:generateContent?key=${provider.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: request.prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: request.temperature || 0.7,
          maxOutputTokens: request.maxTokens || 4000
        }
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }
    
    return {
      content: data.candidates[0].content.parts[0].text,
      model: model,
      usage: {
        promptTokens: data.usageMetadata?.promptTokenCount || 0,
        completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: data.usageMetadata?.totalTokenCount || 0
      }
    };
  }

  private checkRateLimit(providerName: string): boolean {
    const now = Date.now();
    const minute = Math.floor(now / 60000);
    const key = `${providerName}_${minute}`;
    
    const requests = this.rateLimitCache.get(key) || [];
    const provider = this.providers.get(providerName);
    
    if (!provider) return false;
    
    if (requests.length >= provider.rateLimits.requestsPerMinute) {
      return false;
    }
    
    requests.push(now);
    this.rateLimitCache.set(key, requests);
    
    // Clean old entries
    this.cleanRateLimitCache();
    
    return true;
  }

  private cleanRateLimitCache() {
    const currentMinute = Math.floor(Date.now() / 60000);
    
    for (const [key] of this.rateLimitCache) {
      const keyMinute = parseInt(key.split('_').pop() || '0');
      if (currentMinute - keyMinute > 2) {
        this.rateLimitCache.delete(key);
      }
    }
  }

  private getFallbackProvider(): AIProvider | null {
    const availableProviders = Array.from(this.providers.values())
      .filter(provider => this.checkRateLimit(provider.name));
    
    return availableProviders[0] || null;
  }

  private async logUsage(requestId: string, provider: string, request: AIRequest, response: any, duration: number) {
    if (!this.supabase) return;

    try {
      await this.supabase.from('ai_usage_logs').insert({
        request_id: requestId,
        provider,
        model: response.model,
        prompt_tokens: response.usage.promptTokens,
        completion_tokens: response.usage.completionTokens,
        total_tokens: response.usage.totalTokens,
        duration_ms: duration,
        timestamp: new Date().toISOString(),
        success: true
      });
    } catch (error) {
      console.warn('Failed to log AI usage:', error);
    }
  }

  // Public utility methods
  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  getProviderCapabilities(providerName: string): string[] {
    const provider = this.providers.get(providerName);
    return provider ? provider.capabilities : [];
  }

  getProviderModels(providerName: string): string[] {
    const provider = this.providers.get(providerName);
    return provider ? provider.models : [];
  }

  isProviderAvailable(providerName: string): boolean {
    return this.providers.has(providerName) && this.checkRateLimit(providerName);
  }

  // Tool-specific generation methods
  async generateCode(prompt: string, language: string = 'typescript', framework?: string): Promise<AIResponse> {
    const systemPrompt = `You are an expert software developer. Generate clean, production-ready ${language} code${framework ? ` using ${framework}` : ''}. 

Requirements:
- Write complete, functional code
- Include proper error handling
- Add helpful comments
- Follow best practices and conventions
- Ensure code is ready to run without modifications
- Include necessary imports and dependencies`;

    return this.generateContent({
      prompt,
      systemPrompt,
      temperature: 0.2,
      maxTokens: 6000
    });
  }

  async generateContent(prompt: string, contentType: string = 'blog'): Promise<AIResponse> {
    const systemPrompt = `You are a professional content creator specializing in ${contentType} content. Create engaging, high-quality content that:

- Is well-structured and easy to read
- Includes relevant keywords naturally
- Has a compelling hook and strong conclusion
- Matches the target audience and platform
- Is optimized for engagement and sharing
- Follows best practices for ${contentType} content`;

    return this.generateContent({
      prompt,
      systemPrompt,
      temperature: 0.8,
      maxTokens: 4000
    });
  }

  async analyzeCode(code: string, analysisType: string = 'optimization'): Promise<AIResponse> {
    const systemPrompt = `You are a senior software architect and code reviewer. Analyze the provided code for ${analysisType} and provide:

- Detailed analysis of current implementation
- Specific improvement recommendations
- Security considerations
- Performance optimization suggestions
- Best practice violations and fixes
- Refactoring opportunities`;

    return this.generateContent({
      prompt: `Analyze this code:\n\n${code}`,
      systemPrompt,
      temperature: 0.3,
      maxTokens: 4000
    });
  }
}

// Singleton instance
export const aiServiceManager = new AIServiceManager();