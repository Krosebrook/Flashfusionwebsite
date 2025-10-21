import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname

    // Health check
    if (path === '/health' || path === '/make-server-88829a40/health') {
      return new Response(
        JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          services: {
            ai: 'available',
            collaboration: 'available',
            auth: 'available'
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Authentication endpoints
    if ((path === '/auth/login' || path === '/make-server-88829a40/auth/login') && req.method === 'POST') {
      const { email, password } = await req.json()
      
      if (!email || !password) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Email and password are required' 
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        )
      }

      // Demo login for testing
      if (email === 'demo@flashfusion.ai' && password === 'demo123') {
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Demo login successful',
            user: {
              id: 'demo-user-001',
              email: 'demo@flashfusion.ai',
              name: 'Demo User',
              role: 'pro'
            },
            token: 'demo-token-' + Date.now()
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Invalid credentials' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }

    if ((path === '/auth/signup' || path === '/make-server-88829a40/auth/signup') && req.method === 'POST') {
      const { name, email, password } = await req.json()
      
      if (!email || !password || !name) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Name, email, and password are required' 
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        )
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Please enter a valid email address' 
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        )
      }

      // For demo purposes, just return success
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Account created successfully! You can now sign in.',
          user: {
            id: 'user-' + Date.now(),
            email,
            name,
            email_confirmed: true
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Image generation endpoint
    if ((path === '/generate-images' || path === '/make-server-88829a40/generate-images') && req.method === 'POST') {
      const request = await req.json()
      
      // Validate request
      if (!request.prompt || request.prompt.trim().length < 3) {
        return new Response(
          JSON.stringify({ error: 'Prompt must be at least 3 characters long' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        )
      }

      // Generate demo images
      const images = []
      const batchCount = request.batchCount || 1

      for (let i = 0; i < batchCount; i++) {
        const image = {
          id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          url: `https://picsum.photos/1024/1024?random=${Date.now() + i}`,
          thumbnailUrl: `https://picsum.photos/256/256?random=${Date.now() + i}`,
          prompt: request.prompt,
          model: request.model || 'demo',
          style: request.style || 'default',
          dimensions: { width: 1024, height: 1024 },
          fileSize: 1024000,
          createdAt: Date.now(),
          parameters: request,
          downloadCount: 0,
          likeCount: 0,
          averageRating: 0,
          cost: 0.02,
          status: 'completed'
        }
        images.push(image)
      }

      return new Response(
        JSON.stringify({
          success: true,
          images,
          model: request.model,
          timestamp: Date.now()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Code generation endpoint
    if ((path === '/generate/code' || path === '/make-server-88829a40/generate/code') && req.method === 'POST') {
      const request = await req.json()
      
      return new Response(
        JSON.stringify({
          success: true,
          code: '// Generated code placeholder\nconsole.log("Hello, FlashFusion!");',
          language: request.language || 'javascript',
          timestamp: Date.now()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // AI generation endpoint
    if ((path === '/ai/generate' || path === '/make-server-88829a40/ai/generate') && req.method === 'POST') {
      const request = await req.json()
      
      return new Response(
        JSON.stringify({
          success: true,
          result: 'AI generated content: ' + (request.prompt || 'No prompt provided'),
          model: request.model || 'demo',
          timestamp: Date.now()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Content generation endpoint
    if ((path === '/generate/content' || path === '/make-server-88829a40/generate/content') && req.method === 'POST') {
      const request = await req.json()
      
      return new Response(
        JSON.stringify({
          success: true,
          content: 'Generated content: ' + (request.prompt || 'No prompt provided'),
          type: request.type || 'text',
          timestamp: Date.now()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // CICD deployment endpoint
    if ((path === '/cicd/deploy' || path === '/make-server-88829a40/cicd/deploy') && req.method === 'POST') {
      const request = await req.json()
      
      return new Response(
        JSON.stringify({
          success: true,
          deploymentId: 'deploy_' + Date.now(),
          status: 'pending',
          timestamp: Date.now()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // API keys endpoint
    if ((path === '/api-keys' || path === '/make-server-88829a40/api-keys') && req.method === 'GET') {
      return new Response(
        JSON.stringify({
          success: true,
          keys: {},
          timestamp: Date.now()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Stripe checkout session (demo)
    if ((path === '/stripe/create-checkout-session' || path === '/make-server-88829a40/stripe/create-checkout-session') && req.method === 'POST') {
      const body = await req.json()
      
      return new Response(
        JSON.stringify({
          success: true,
          sessionId: 'cs_demo_' + Date.now(),
          url: 'https://checkout.stripe.com/demo'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Default 404 response
    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      }
    )

  } catch (error) {
    console.error('Server error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})