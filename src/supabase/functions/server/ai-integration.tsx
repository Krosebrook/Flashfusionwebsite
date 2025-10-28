import { Hono } from 'npm:hono';
import { createClient } from 'npm:@supabase/supabase-js@2';

const aiApp = new Hono();

// AI Model Configuration
interface AIRequest {
  model: string;
  prompt: string;
  context?: any;
  maxTokens?: number;
  temperature?: number;
}

interface AIResponse {
  content: string;
  tokensUsed: number;
  confidence: number;
  responseTime: number;
  model: string;
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase configuration');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// AI Model Providers
const AI_PROVIDERS = {
  'gpt-4-turbo': {
    provider: 'openai',
    apiKey: Deno.env.get('Openai_api_key'),
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4-turbo-preview'
  },
  'claude-3-opus': {
    provider: 'anthropic',
    apiKey: Deno.env.get('Anthropic'),
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-opus-20240229'
  },
  'gemini-pro': {
    provider: 'google',
    apiKey: Deno.env.get('Gemini_api_key'),
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    model: 'gemini-pro'
  },
  'codellama-34b': {
    provider: 'openrouter',
    apiKey: Deno.env.get('OpenRouter_API_KEY'),
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'meta-llama/codellama-34b-instruct'
  },
  'mistral-large': {
    provider: 'openrouter',
    apiKey: Deno.env.get('OpenRouter_API_KEY'),
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'mistralai/mistral-large'
  }
};

// OpenAI API call
async function callOpenAI(config: any, prompt: string, maxTokens: number = 4000): Promise<AIResponse> {
  const startTime = Date.now();
  
  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const responseTime = Date.now() - startTime;

  return {
    content: data.choices[0].message.content,
    tokensUsed: data.usage?.total_tokens || 0,
    confidence: 0.95,
    responseTime,
    model: config.model
  };
}

// Anthropic API call
async function callAnthropic(config: any, prompt: string, maxTokens: number = 4000): Promise<AIResponse> {
  const startTime = Date.now();
  
  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'x-api-key': config.apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const responseTime = Date.now() - startTime;

  return {
    content: data.content[0].text,
    tokensUsed: data.usage?.output_tokens || 0,
    confidence: 0.96,
    responseTime,
    model: config.model
  };
}

// Google Gemini API call
async function callGemini(config: any, prompt: string, maxTokens: number = 4000): Promise<AIResponse> {
  const startTime = Date.now();
  
  const response = await fetch(`${config.endpoint}?key=${config.apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: 0.7,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const responseTime = Date.now() - startTime;

  return {
    content: data.candidates[0].content.parts[0].text,
    tokensUsed: 0, // Gemini doesn't return token count
    confidence: 0.94,
    responseTime,
    model: config.model
  };
}

// OpenRouter API call (for CodeLlama and Mistral)
async function callOpenRouter(config: any, prompt: string, maxTokens: number = 4000): Promise<AIResponse> {
  const startTime = Date.now();
  
  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': supabaseUrl,
      'X-Title': 'FlashFusion AI Platform',
    },
    body: JSON.stringify({
      model: config.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const responseTime = Date.now() - startTime;

  return {
    content: data.choices[0].message.content,
    tokensUsed: data.usage?.total_tokens || 0,
    confidence: 0.93,
    responseTime,
    model: config.model
  };
}

// Main AI generation endpoint
aiApp.post('/make-server-88829a40/ai/generate', async (c) => {
  try {
    const request: AIRequest = await c.req.json();
    const { model, prompt, maxTokens = 4000 } = request;

    if (!prompt?.trim()) {
      return c.json({ error: 'Prompt is required' }, 400);
    }

    const config = AI_PROVIDERS[model as keyof typeof AI_PROVIDERS];
    if (!config) {
      return c.json({ error: `Unsupported model: ${model}` }, 400);
    }

    if (!config.apiKey) {
      return c.json({ error: `API key not configured for ${model}` }, 500);
    }

    let result: AIResponse;

    // Route to appropriate provider
    switch (config.provider) {
      case 'openai':
        result = await callOpenAI(config, prompt, maxTokens);
        break;
      case 'anthropic':
        result = await callAnthropic(config, prompt, maxTokens);
        break;
      case 'google':
        result = await callGemini(config, prompt, maxTokens);
        break;
      case 'openrouter':
        result = await callOpenRouter(config, prompt, maxTokens);
        break;
      default:
        throw new Error(`Unknown provider: ${config.provider}`);
    }

    // Log usage to Supabase
    await supabase.from('ai_usage_logs').insert({
      model,
      prompt_length: prompt.length,
      tokens_used: result.tokensUsed,
      response_time: result.responseTime,
      success: true,
      created_at: new Date().toISOString()
    });

    return c.json(result);

  } catch (error) {
    console.error('AI generation error:', error);
    
    // Log error to Supabase
    try {
      await supabase.from('ai_usage_logs').insert({
        model: 'unknown',
        prompt_length: 0,
        tokens_used: 0,
        response_time: 0,
        success: false,
        error_message: error.message,
        created_at: new Date().toISOString()
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return c.json({
      error: 'AI generation failed',
      message: error.message
    }, 500);
  }
});

// Model status endpoint
aiApp.get('/make-server-88829a40/ai/models', async (c) => {
  const models = Object.entries(AI_PROVIDERS).map(([id, config]) => ({
    id,
    name: id.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    provider: config.provider,
    available: !!config.apiKey,
    status: !!config.apiKey ? 'available' : 'no_api_key'
  }));

  return c.json({ models });
});

// Usage analytics endpoint
aiApp.get('/make-server-88829a40/ai/analytics', async (c) => {
  try {
    const { data: usageData, error } = await supabase
      .from('ai_usage_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      throw error;
    }

    // Calculate analytics
    const totalCalls = usageData?.length || 0;
    const successfulCalls = usageData?.filter(log => log.success).length || 0;
    const averageResponseTime = usageData?.length > 0 
      ? usageData.reduce((sum, log) => sum + (log.response_time || 0), 0) / usageData.length 
      : 0;
    const totalTokens = usageData?.reduce((sum, log) => sum + (log.tokens_used || 0), 0) || 0;

    const modelUsage = usageData?.reduce((acc, log) => {
      acc[log.model] = (acc[log.model] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    return c.json({
      totalCalls,
      successfulCalls,
      successRate: totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0,
      averageResponseTime: Math.round(averageResponseTime),
      totalTokens,
      modelUsage
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return c.json({
      error: 'Failed to fetch analytics',
      message: error.message
    }, 500);
  }
});

export default aiApp;