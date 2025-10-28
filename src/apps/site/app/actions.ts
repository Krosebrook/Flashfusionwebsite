'use server';

import { headers, cookies } from 'next/headers';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const leadSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  source: z.string().default('next_site'),
  plan: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

export async function submitLead(formData: FormData) {
  try {
    // Parse and validate form data
    const rawData = {
      email: formData.get('email'),
      source: formData.get('source'),
      plan: formData.get('plan'),
    };

    const parsed = leadSchema.safeParse(rawData);
    
    if (!parsed.success) {
      console.error('Validation error:', parsed.error);
      return {
        ok: false,
        error: 'invalid',
        message: parsed.error.errors[0]?.message || 'Invalid form data'
      };
    }

    const data = parsed.data;

    // Create Supabase client with service role key (server-only)
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      return {
        ok: false,
        error: 'config',
        message: 'Server configuration error'
      };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Capture metadata
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') ?? '';
    const forwardedFor = headersList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0]?.trim() : null;

    // Insert lead into database
    const { error: dbError } = await supabase
      .from('leads')
      .insert({
        email: data.email,
        source: data.source,
        plan: data.plan || 'free',
        ua: userAgent,
        ip: ip,
        created_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error('Database error:', dbError);
      
      // Check for duplicate email
      if (dbError.code === '23505') {
        return {
          ok: false,
          error: 'duplicate',
          message: 'This email is already on the waitlist'
        };
      }

      return {
        ok: false,
        error: 'db',
        message: 'Failed to save your information. Please try again.'
      };
    }

    // Set cookie to prevent duplicate submissions
    const cookieStore = await cookies();
    cookieStore.set('lead_submitted', '1', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Track event (if analytics is configured)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'lead_submit', {
        source: data.source,
        plan: data.plan || 'free',
      });
    }

    return {
      ok: true,
      message: 'Successfully joined the waitlist! Check your email for confirmation.'
    };

  } catch (error) {
    console.error('Unexpected error in submitLead:', error);
    return {
      ok: false,
      error: 'unknown',
      message: 'An unexpected error occurred. Please try again.'
    };
  }
}
