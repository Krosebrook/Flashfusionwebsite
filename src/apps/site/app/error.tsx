'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="min-h-screen w-full flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div 
          className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-8"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#EF4444'
          }}
        >
          <AlertTriangle className="h-12 w-12" />
        </div>

        <h1 
          className="mb-4"
          style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '700',
            color: 'var(--ff-text-primary)'
          }}
        >
          Something Went Wrong
        </h1>
        
        <p 
          className="text-xl mb-8"
          style={{ 
            color: 'var(--ff-text-secondary)',
            fontFamily: 'Inter, sans-serif',
            lineHeight: '1.8'
          }}
        >
          We encountered an unexpected error. Our team has been notified and is working on a fix.
        </p>

        {error.digest && (
          <div 
            className="mb-8 p-4 rounded-lg"
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              color: 'var(--ff-text-muted)'
            }}
          >
            Error ID: {error.digest}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)',
              color: 'white',
              fontFamily: 'Sora, sans-serif',
              fontWeight: '600',
              boxShadow: '0 10px 40px rgba(255, 123, 0, 0.3)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <RefreshCw className="h-5 w-5" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 transition-all hover:scale-105"
            style={{
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: 'var(--ff-text-primary)',
              fontFamily: 'Sora, sans-serif',
              fontWeight: '600'
            }}
          >
            <Home className="h-5 w-5" />
            Go Home
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-16 pt-8 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <p 
            className="mb-4"
            style={{
              color: 'var(--ff-text-muted)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem'
            }}
          >
            Need help? Contact our support team:
          </p>
          <Link
            href="/contact"
            className="transition-colors"
            style={{
              color: 'var(--ff-primary)',
              fontFamily: 'Sora, sans-serif',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}
          >
            support@flashfusion.co
          </Link>
        </div>
      </div>
    </main>
  );
}
