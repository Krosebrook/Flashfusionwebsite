import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname

    // Health check
    if (path === '/health') {
      return new Response(
        JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Basic auth endpoints
    if (path === '/auth/login' && req.method === 'POST') {
      const { email, password } = await req.json()
      
      if (email === 'demo@flashfusion.ai' && password === 'demo123') {
        return new Response(
          JSON.stringify({
            success: true,
            user: { id: 'demo', email, name: 'Demo User' },
            token: 'demo-token'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      return new Response(
        JSON.stringify({ success: false, message: 'Invalid credentials' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Server error', message: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})