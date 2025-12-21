import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div 
          className="mb-8"
          style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: 'clamp(6rem, 15vw, 10rem)',
            fontWeight: '800',
            lineHeight: '1',
            background: 'linear-gradient(135deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          404
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
          Page Not Found
        </h1>
        
        <p 
          className="text-xl mb-12"
          style={{ 
            color: 'var(--ff-text-secondary)',
            fontFamily: 'Inter, sans-serif',
            lineHeight: '1.8'
          }}
        >
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)',
              color: 'white',
              fontFamily: 'Sora, sans-serif',
              fontWeight: '600',
              boxShadow: '0 10px 40px rgba(255, 123, 0, 0.3)'
            }}
          >
            <Home className="h-5 w-5" />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 transition-all hover:scale-105"
            style={{
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: 'var(--ff-text-primary)',
              fontFamily: 'Sora, sans-serif',
              fontWeight: '600',
              background: 'transparent'
            }}
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-16 pt-8 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <p 
            className="mb-6"
            style={{
              color: 'var(--ff-text-muted)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem'
            }}
          >
            Here are some helpful links:
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { label: 'Documentation', href: '/docs' },
              { label: 'Features', href: '/features' },
              { label: 'Pricing', href: '/pricing' },
              { label: 'Contact', href: '/contact' }
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors"
                style={{
                  color: 'var(--ff-primary)',
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: '600',
                  fontSize: '0.875rem'
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
