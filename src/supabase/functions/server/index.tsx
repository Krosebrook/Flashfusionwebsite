import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const app = new Hono();

// Global middleware
app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['*'],
}));

app.use('*', logger(console.log));

// Health check endpoint
app.get('/make-server-88829a40/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      ai: 'available',
      collaboration: 'available',
      cicd: 'available'
    }
  });
});

// Basic authentication endpoints
app.post('/make-server-88829a40/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ 
        success: false, 
        message: 'Email and password are required' 
      }, 400);
    }

    // Demo login for testing
    if (email === 'demo@flashfusion.ai' && password === 'demo123') {
      return c.json({
        success: true,
        message: 'Demo login successful',
        user: {
          id: 'demo-user-001',
          email: 'demo@flashfusion.ai',
          name: 'Demo User',
          role: 'pro'
        },
        token: 'demo-token-' + Date.now()
      });
    }

    // For real authentication, you would validate against your database
    return c.json({ 
      success: false, 
      message: 'Invalid credentials' 
    }, 401);

  } catch (error) {
    console.error('Login error:', error);
    return c.json({ 
      success: false, 
      message: 'Login failed' 
    }, 500);
  }
});

app.post('/make-server-88829a40/auth/signup', async (c) => {
  try {
    const { name, email, password } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ 
        success: false, 
        message: 'Name, email, and password are required' 
      }, 400);
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ 
        success: false, 
        message: 'Please enter a valid email address' 
      }, 400);
    }

    // For demo purposes, just return success
    return c.json({
      success: true,
      message: 'Account created successfully! You can now sign in.',
      user: {
        id: 'user-' + Date.now(),
        email,
        name,
        email_confirmed: true
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ 
      success: false, 
      message: 'Signup failed' 
    }, 500);
  }
});

// Image Generation Routes
app.post('/make-server-88829a40/generate-images', async (c) => {
  try {
    const request = await c.req.json();
    console.log('Image generation request:', request);

    // Validate request
    if (!request.prompt || request.prompt.trim().length < 3) {
      return c.json({ error: 'Prompt must be at least 3 characters long' }, 400);
    }

    // Get AI model configuration
    const modelConfig = getModelConfig(request.model || 'dall-e-3');
    if (!modelConfig) {
      return c.json({ error: 'Unsupported AI model' }, 400);
    }

    // Generate images based on model
    const images = await generateImagesWithModel(request, modelConfig);

    return c.json({
      success: true,
      images,
      model: request.model,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Image generation error:', error);
    return c.json({ 
      error: 'Image generation failed', 
      details: error.message 
    }, 500);
  }
});

// Stripe endpoints (simplified for now)
app.post('/make-server-88829a40/stripe/create-checkout-session', async (c) => {
  try {
    const body = await c.req.json();
    console.log('Creating Stripe checkout session:', body);

    // For demo purposes, return a mock checkout session
    return c.json({
      success: true,
      sessionId: 'cs_demo_' + Date.now(),
      url: 'https://checkout.stripe.com/demo'
    });

  } catch (error) {
    console.error('Checkout session creation error:', error);
    return c.json({ 
      success: false,
      message: 'Checkout session creation failed', 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// ============================================================================
// FLASHFUSION STUDIO ENDPOINTS (Phase 5)
// ============================================================================

// Studio: Track user behavior analytics
app.post('/make-server-88829a40/studio/analytics/track', async (c) => {
  try {
    const { event, userId, data } = await c.req.json();
    
    if (!event || !userId) {
      return c.json({ error: 'Event and userId required' }, 400);
    }

    // Store in KV (implement kv_store integration)
    const analyticsKey = `analytics:${userId}:${Date.now()}`;
    // await kv.set(analyticsKey, { event, data, timestamp: new Date().toISOString() });

    console.log('Analytics tracked:', { event, userId, data });
    
    return c.json({ success: true, event, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return c.json({ error: 'Failed to track analytics' }, 500);
  }
});

// Studio: Get behavior metrics
app.get('/make-server-88829a40/studio/analytics/behavior', async (c) => {
  try {
    const timeRange = c.req.query('timeRange') || '30d';
    
    // Mock data for now - replace with real aggregation from KV store
    const mockMetrics = {
      mostUsedFeatures: [
        {
          feature: 'Prompt-to-Song',
          usageCount: 45230,
          avgTimeSpent: 180,
          completionRate: 78,
          trend: 'up'
        },
        {
          feature: 'Chord Designer',
          usageCount: 32450,
          avgTimeSpent: 420,
          completionRate: 85,
          trend: 'up'
        }
      ],
      averageSessionDuration: 1260,
      dropOffPoints: [
        {
          step: 'Song Generation - AI Processing',
          dropOffRate: 15.3,
          usersAffected: 2340,
          severity: 'high'
        }
      ],
      conversionFunnels: [
        {
          name: 'song_creation',
          conversionRate: 42.3,
          avgTimeToConvert: 18,
          steps: [
            { name: 'Visit Studio', users: 10000, conversionRate: 100, avgTime: 0 },
            { name: 'Generate Song', users: 6240, conversionRate: 80, avgTime: 5 }
          ]
        }
      ],
      userSegments: [
        {
          name: 'Professional Producers',
          count: 2340,
          avgRevenue: 588,
          engagement: 92
        }
      ]
    };
    
    return c.json(mockMetrics);
  } catch (error) {
    console.error('Behavior metrics error:', error);
    return c.json({ error: 'Failed to fetch metrics' }, 500);
  }
});

// Studio: AI optimization
app.post('/make-server-88829a40/studio/ai/optimize', async (c) => {
  try {
    const { modelId } = await c.req.json();
    
    if (!modelId) {
      return c.json({ error: 'Model ID required' }, 400);
    }

    console.log('Optimizing model:', modelId);
    
    // Simulate optimization
    const result = {
      modelId,
      optimizations: {
        speed: '+45%',
        quality: '+6.1%',
        cost: '-32%'
      },
      timestamp: new Date().toISOString()
    };
    
    return c.json({ success: true, result });
  } catch (error) {
    console.error('AI optimization error:', error);
    return c.json({ error: 'Optimization failed' }, 500);
  }
});

// Studio: Marketplace listings
app.get('/make-server-88829a40/studio/marketplace/listings', async (c) => {
  try {
    const category = c.req.query('category');
    const search = c.req.query('search');
    
    // Mock marketplace data - replace with real KV store query
    const mockListings = [
      {
        id: 'listing-1',
        title: 'Lo-Fi Hip Hop Sample Pack',
        description: '50 high-quality lo-fi samples',
        category: 'samples',
        price: 29.99,
        rating: 4.7,
        reviews: 89,
        sales: 342
      }
    ];
    
    let filtered = mockListings;
    
    if (category && category !== 'all') {
      filtered = filtered.filter(l => l.category === category);
    }
    
    if (search) {
      filtered = filtered.filter(l => 
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return c.json({ listings: filtered, total: filtered.length });
  } catch (error) {
    console.error('Marketplace listings error:', error);
    return c.json({ error: 'Failed to fetch listings' }, 500);
  }
});

// Studio: Create collaboration session
app.post('/make-server-88829a40/studio/collaboration/create', async (c) => {
  try {
    const { projectId, participants } = await c.req.json();
    
    if (!projectId) {
      return c.json({ error: 'Project ID required' }, 400);
    }

    const sessionId = `collab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create WebSocket session (would integrate with Supabase Realtime)
    const session = {
      sessionId,
      projectId,
      participants: participants || [],
      startedAt: new Date().toISOString(),
      status: 'active'
    };
    
    console.log('Created collaboration session:', sessionId);
    
    return c.json({ success: true, session });
  } catch (error) {
    console.error('Collaboration creation error:', error);
    return c.json({ error: 'Failed to create session' }, 500);
  }
});

// Catch-all for undefined routes
app.notFound((c) => {
  return c.json({ error: 'Endpoint not found' }, 404);
});

// Global error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ 
    error: 'Internal server error',
    message: err.message 
  }, 500);
});

// Start the server
Deno.serve(app.fetch);

/**
 * Get AI model configuration
 */
function getModelConfig(modelId: string) {
  const models = {
    'dall-e-3': {
      id: 'dall-e-3',
      provider: 'openai',
      endpoint: 'https://api.openai.com/v1/images/generations',
      maxResolution: '1024x1024',
      costPerImage: 0.040
    },
    'dall-e-2': {
      id: 'dall-e-2', 
      provider: 'openai',
      endpoint: 'https://api.openai.com/v1/images/generations',
      maxResolution: '1024x1024',
      costPerImage: 0.020
    },
    'stable-diffusion-xl': {
      id: 'stable-diffusion-xl',
      provider: 'stability',
      endpoint: 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      maxResolution: '1024x1024',
      costPerImage: 0.015
    },
    'midjourney-v6': {
      id: 'midjourney-v6',
      provider: 'midjourney',  
      endpoint: 'https://api.midjourney.com/v1/imagine',
      maxResolution: '2048x2048',
      costPerImage: 0.025
    }
  };

  return models[modelId];
}

/**
 * Generate images with specific AI model
 */
async function generateImagesWithModel(request: any, modelConfig: any) {
  const images = [];
  
  for (let i = 0; i < (request.batchCount || 1); i++) {
    try {
      let imageUrl: string;
      let imageData: any;
      
      if (modelConfig.provider === 'openai') {
        imageData = await generateWithOpenAI(request, modelConfig);
        imageUrl = imageData.url;
      } else if (modelConfig.provider === 'stability') {
        imageData = await generateWithStability(request, modelConfig);
        imageUrl = imageData.url;
      } else {
        // Fallback to demo image for unsupported providers
        imageUrl = await generateDemoImage(request);
        imageData = { url: imageUrl, width: 1024, height: 1024 };
      }

      const image = {
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        url: imageUrl,
        thumbnailUrl: imageUrl,
        prompt: request.prompt,
        model: request.model,
        style: request.style,
        dimensions: {
          width: imageData.width || 1024,
          height: imageData.height || 1024
        },
        fileSize: imageData.fileSize || 1024000,
        createdAt: Date.now(),
        parameters: {
          prompt: request.prompt,
          model: request.model,
          style: request.style,
          aspectRatio: request.aspectRatio,
          quality: request.quality,
          seed: request.seed,
          steps: request.steps,
          guidanceScale: request.guidanceScale
        },
        downloadCount: 0,
        likeCount: 0,
        averageRating: 0,
        cost: modelConfig.costPerImage,
        status: 'completed'
      };

      images.push(image);
      
      // Add small delay between generations to avoid rate limits
      if (i < (request.batchCount || 1) - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
    } catch (error) {
      console.error(`Failed to generate image ${i + 1}:`, error);
      
      // Add failed image entry
      images.push({
        id: `img_failed_${Date.now()}_${i}`,
        url: '',
        thumbnailUrl: '',
        prompt: request.prompt,
        model: request.model,
        style: request.style,
        dimensions: { width: 0, height: 0 },
        fileSize: 0,
        createdAt: Date.now(),
        parameters: request,
        downloadCount: 0,
        likeCount: 0,
        averageRating: 0,
        cost: 0,
        status: 'failed',
        error: error.message
      });
    }
  }
  
  return images;
}

/**
 * Generate image with OpenAI DALL-E
 */
async function generateWithOpenAI(request: any, modelConfig: any) {
  const openaiKey = Deno.env.get('Openai_api_key');
  if (!openaiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const dimensions = parseDimensions(request.aspectRatio);
  
  const response = await fetch(modelConfig.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: modelConfig.id,
      prompt: request.prompt,
      n: 1,
      size: `${dimensions.width}x${dimensions.height}`,
      quality: request.quality > 80 ? 'hd' : 'standard',
      response_format: 'url'
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `OpenAI API error: ${response.status}`);
  }

  const result = await response.json();
  
  if (!result.data || result.data.length === 0) {
    throw new Error('No image generated by OpenAI');
  }

  return {
    url: result.data[0].url,
    width: dimensions.width,
    height: dimensions.height
  };
}

/**
 * Generate image with Stability AI
 */
async function generateWithStability(request: any, modelConfig: any) {
  const stabilityKey = Deno.env.get('STABILITY_API_KEY');
  if (!stabilityKey) {
    throw new Error('Stability AI API key not configured');
  }

  const dimensions = parseDimensions(request.aspectRatio);
  
  const response = await fetch(modelConfig.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${stabilityKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text_prompts: [
        {
          text: request.prompt,
          weight: 1
        }
      ],
      cfg_scale: request.guidanceScale || 7,
      height: dimensions.height,
      width: dimensions.width,
      steps: request.steps || 30,
      samples: 1,
      seed: request.seed
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Stability AI error: ${response.status}`);
  }

  const result = await response.json();
  
  if (!result.artifacts || result.artifacts.length === 0) {
    throw new Error('No image generated by Stability AI');
  }

  // Convert base64 to blob URL (in production, upload to storage)
  const base64Data = result.artifacts[0].base64;
  const imageUrl = `data:image/png;base64,${base64Data}`;

  return {
    url: imageUrl,
    width: dimensions.width,
    height: dimensions.height
  };
}

/**
 * Generate demo image for testing
 */
async function generateDemoImage(request: any): Promise<string> {
  // Use a placeholder service or return a demo image URL
  const dimensions = parseDimensions(request.aspectRatio);
  const encodedPrompt = encodeURIComponent(request.prompt.slice(0, 50));
  
  return `https://picsum.photos/${dimensions.width}/${dimensions.height}?random=${Date.now()}&text=${encodedPrompt}`;
}

/**
 * Parse aspect ratio to dimensions
 */
function parseDimensions(aspectRatio: string) {
  const ratioMap = {
    '1:1': { width: 1024, height: 1024 },
    '4:3': { width: 1024, height: 768 },
    '3:4': { width: 768, height: 1024 },
    '16:9': { width: 1024, height: 576 },
    '9:16': { width: 576, height: 1024 },
    '3:2': { width: 1024, height: 683 },
    '2:3': { width: 683, height: 1024 }
  };

  return ratioMap[aspectRatio] || ratioMap['1:1'];
}