# FlashFusion Development Guidelines

**Production-First. Performance-Focused. Battle-Tested.**

---

## Core Philosophy

FlashFusion is a production AI development platform. Every line of code ships to users. No demos, no mocks, no placeholders.

**Non-Negotiables:**
1. **Shadcn components require explicit styling overrides** - Their defaults will break our brand
2. **All features must handle failure gracefully** - Network fails, APIs timeout, users fat-finger inputs
3. **Performance budget: <100KB initial JS, <2s LCP** - Mobile users on 3G exist
4. **Zero TypeScript `any`** - If you don't know the type, find out
5. **Accessibility isn't optional** - 4.5:1 contrast minimum, keyboard nav, screen readers

---

## 🎨 Design System - FlashFusion Brand

### Critical Override Pattern

**Problem:** Shadcn components ship with baked-in defaults (gaps, typography, colors, spacing).  
**Solution:** Explicit overrides on every component. No exceptions.

```tsx
// ❌ BREAKS BRAND - Uses Shadcn defaults
<Button>Click Me</Button>

// ✅ CORRECT - Explicit FlashFusion styling
<Button 
  className="bg-gradient-to-r from-[#FF9F33] to-[#FF7B00] text-white font-semibold px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(255,123,0,0.5)] transition-all"
  style={{ fontFamily: "'Sora', sans-serif" }}
>
  Click Me
</Button>
```

**Why inline font-family?** Tailwind doesn't know about our custom fonts. CSS variables work but inline styles guarantee it.

### Brand Colors (Memorize These)

```tsx
// Primary palette - Use in 80% of UI
const BRAND = {
  primary: '#FF7B00',    // Orange - CTAs, primary actions
  secondary: '#00B4D8',  // Cyan - secondary actions, info states
  accent: '#E91E63',     // Magenta - premium, highlights
  
  bgDark: '#0F172A',     // Page background (dark navy)
  surface: '#1E293B',    // Cards, panels (slate)
  surfaceLight: '#334155', // Elevated cards
  
  textPrimary: '#FFFFFF',   // 15.8:1 contrast ✅
  textSecondary: '#CBD5E1', // 11.6:1 contrast ✅
  textMuted: '#94A3B8',     // 6.2:1 contrast ✅
  
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

// Gradients - Copy-paste these
const GRADIENTS = {
  primary: 'linear-gradient(135deg, #FF9F33 0%, #FF7B00 100%)',
  secondary: 'linear-gradient(135deg, #33C3DF 0%, #00B4D8 100%)',
  accent: 'linear-gradient(135deg, #E74787 0%, #E91E63 100%)',
  hero: 'linear-gradient(135deg, #FF7B00 0%, #00B4D8 50%, #E91E63 100%)',
};
```

**Pro Tip:** Use hex codes directly in classNames for one-off colors. Use CSS variables for theming.

### Typography Stack

```tsx
// Font loading - Preload critical fonts in <head>
<link rel="preload" href="/fonts/Sora-Bold.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin />

// Usage
const FONTS = {
  primary: "'Sora', sans-serif",      // Headings, buttons, labels
  secondary: "'Inter', sans-serif",   // Body text, descriptions
  mono: "'JetBrains Mono', monospace" // Code blocks
};

// Always set inline
style={{ fontFamily: FONTS.primary }}
```

**Why these fonts?**
- **Sora:** Geometric sans-serif. Modern, tech-forward. Great for UI elements.
- **Inter:** Designed for screens. 9px is still readable. Perfect for body text.
- **JetBrains Mono:** Clear character distinction. Ligature support. Developer-friendly.

---

## 🏗️ Architecture Patterns

### Component Structure

```tsx
// components/feature/FeatureName.tsx
import { memo, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import type { FeatureProps } from './types';

/**
 * FeatureName - Brief description
 * 
 * @performance Memoized, ~50ms render
 * @accessibility WCAG AA, keyboard nav
 */
export const FeatureName = memo<FeatureProps>(({ 
  data, 
  onAction 
}) => {
  // Expensive calculations - memoize
  const processedData = useMemo(() => 
    data.map(item => expensiveTransform(item)),
    [data]
  );
  
  // Event handlers - useCallback prevents re-renders
  const handleAction = useCallback((id: string) => {
    onAction(id);
  }, [onAction]);
  
  return (
    <div className="space-y-6">
      {processedData.map(item => (
        <div key={item.id}>
          <Button 
            onClick={() => handleAction(item.id)}
            className="bg-gradient-to-r from-[#FF9F33] to-[#FF7B00] text-white font-semibold px-6 py-3 rounded-xl"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            {item.label}
          </Button>
        </div>
      ))}
    </div>
  );
});

FeatureName.displayName = 'FeatureName'; // Required for React DevTools
```

**Why memo?** Re-renders are expensive. Profile with React DevTools, memoize hot paths.

### Error Boundaries (Required for Production)

```tsx
// components/ErrorBoundary.tsx
import { Component, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to monitoring service (Sentry, LogRocket, etc.)
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
    
    // Send to backend
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      }),
    }).catch(console.error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-[#1E293B] rounded-2xl border border-[#EF4444]/30">
          <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>
            Something went wrong
          </h2>
          <p className="text-[#CBD5E1] mb-6 max-w-md text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-[#FF9F33] to-[#FF7B00] text-white font-semibold px-6 py-3 rounded-xl"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Reload Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage - Wrap at route level
<ErrorBoundary>
  <YourPage />
</ErrorBoundary>
```

### Data Fetching (Real-World Pattern)

```tsx
// hooks/useFeatureData.ts
import { useState, useEffect } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useFetch<T>(
  url: string,
  options?: RequestInit
): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted && err.name !== 'AbortError') {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          console.error('Fetch error:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [url, refetchTrigger]);

  const refetch = () => setRefetchTrigger(prev => prev + 1);

  return { data, loading, error, refetch };
}

// Usage in component
function FeatureList() {
  const { data, loading, error, refetch } = useFetch<Feature[]>('/api/features');

  if (loading) {
    return (
      <div className="flex items-center gap-3 p-8">
        <Loader2 className="h-6 w-6 animate-spin text-[#FF7B00]" />
        <span className="text-[#CBD5E1]" style={{ fontFamily: "'Inter', sans-serif" }}>
          Loading features...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-2xl">
        <p className="text-[#EF4444] font-semibold mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>
          Failed to load features
        </p>
        <p className="text-[#CBD5E1] text-sm mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
          {error.message}
        </p>
        <Button 
          onClick={refetch}
          className="bg-gradient-to-r from-[#FF9F33] to-[#FF7B00] text-white font-semibold px-4 py-2 rounded-lg"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-12 text-center bg-[#1E293B] rounded-2xl border border-white/10">
        <p className="text-[#94A3B8]" style={{ fontFamily: "'Inter', sans-serif" }}>
          No features found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map(feature => (
        <FeatureCard key={feature.id} feature={feature} />
      ))}
    </div>
  );
}
```

**Key points:**
- Cleanup on unmount (AbortController)
- Proper error messages with retry
- Loading/error/empty states
- TypeScript generics for type safety

---

## ⚡ Performance Optimization

### Code Splitting (Mandatory for Routes)

```tsx
// App.tsx - Route-based splitting
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load heavy pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// Loading component with FlashFusion branding
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#0F172A]">
    <div className="text-center">
      <Loader2 className="h-12 w-12 animate-spin text-[#FF7B00] mx-auto mb-4" />
      <p className="text-[#CBD5E1]" style={{ fontFamily: "'Inter', sans-serif" }}>
        Loading...
      </p>
    </div>
  </div>
);

export function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
```

### Image Optimization

```tsx
// components/OptimizedImage.tsx
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface Props {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function OptimizedImage({ src, alt, width, height, className }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1E293B] rounded-lg">
          <Loader2 className="h-6 w-6 animate-spin text-[#FF7B00]" />
        </div>
      )}
      
      {error ? (
        <div className="flex items-center justify-center bg-[#1E293B] rounded-lg p-4 text-[#94A3B8]">
          Image failed to load
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ${className}`}
        />
      )}
    </div>
  );
}
```

### Bundle Size Monitoring

```bash
# Check bundle size before commit
npm run build
npx vite-bundle-visualizer

# Set budget alerts in package.json
{
  "bundlesize": [
    {
      "path": "./dist/assets/*.js",
      "maxSize": "100kb"
    }
  ]
}
```

---

## 🔒 Security & Auth

### Input Sanitization (Always)

```tsx
// utils/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeInput(input: string): string {
  // Remove HTML tags, scripts, etc.
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
}

export function sanitizeHTML(html: string): string {
  // Allow safe HTML
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target']
  });
}

// Usage
<Input
  value={input}
  onChange={(e) => setInput(sanitizeInput(e.target.value))}
  className="..."
  style={{ fontFamily: "'Inter', sans-serif" }}
/>
```

### Authentication Pattern

```tsx
// hooks/useAuth.ts
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/lib/supabase';

interface AuthContext {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

// Protected route component
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/signin" replace />;
  
  return <>{children}</>;
}
```

---

## 🧪 Testing Strategy

### Component Tests (Vitest + React Testing Library)

```tsx
// components/__tests__/FeatureCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FeatureCard } from '../FeatureCard';

describe('FeatureCard', () => {
  const mockFeature = {
    id: '1',
    title: 'AI Code Generator',
    description: 'Generate code with AI',
  };

  it('renders feature title and description', () => {
    render(<FeatureCard feature={mockFeature} />);
    
    expect(screen.getByText('AI Code Generator')).toBeInTheDocument();
    expect(screen.getByText('Generate code with AI')).toBeInTheDocument();
  });

  it('uses FlashFusion branding styles', () => {
    render(<FeatureCard feature={mockFeature} />);
    
    const card = screen.getByRole('article');
    expect(card).toHaveClass('bg-[#1E293B]');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<FeatureCard feature={mockFeature} onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('article'));
    expect(handleClick).toHaveBeenCalledWith('1');
  });
});
```

### Integration Tests

```tsx
// tests/auth-flow.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from '../App';

describe('Authentication Flow', () => {
  it('redirects to signin when accessing protected route', async () => {
    render(<App />);
    
    // Try to access protected route
    fireEvent.click(screen.getByText('Dashboard'));
    
    await waitFor(() => {
      expect(screen.getByText('Sign In to FlashFusion')).toBeInTheDocument();
    });
  });

  it('allows access after successful login', async () => {
    render(<App />);
    
    // Fill in login form
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });
    
    // Submit form
    fireEvent.click(screen.getByText('Sign In'));
    
    // Should redirect to dashboard
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });
});
```

---

## 🚀 Deployment & Production

### Environment Variables

```bash
# .env.production
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx
VITE_API_URL=https://api.flashfusion.co
VITE_ENV=production

# Never commit these - use Vercel/Netlify env UI
SUPABASE_SERVICE_ROLE_KEY=xxx
STRIPE_SECRET_KEY=xxx
```

### Build Optimization

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ],
  build: {
    sourcemap: false, // Disable in production for security
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'sonner'],
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Warn if chunk > 1MB
  },
  server: {
    port: 3000,
    open: true,
  }
});
```

### Health Checks

```ts
// api/health.ts
export async function GET() {
  const checks = await Promise.all([
    checkDatabase(),
    checkRedis(),
    checkStorage(),
  ]);

  const allHealthy = checks.every(check => check.status === 'healthy');

  return new Response(JSON.stringify({
    status: allHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    checks,
  }), {
    status: allHealthy ? 200 : 503,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function checkDatabase() {
  try {
    const { error } = await supabase.from('users').select('count').limit(1);
    return { 
      name: 'database', 
      status: error ? 'unhealthy' : 'healthy',
      latency: Date.now() - start 
    };
  } catch {
    return { name: 'database', status: 'unhealthy' };
  }
}
```

---

## 📊 Monitoring & Analytics

### Error Tracking

```tsx
// lib/monitoring.ts
import * as Sentry from '@sentry/react';

export function initMonitoring() {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.VITE_ENV,
      tracesSampleRate: 0.1, // 10% of transactions
      beforeSend(event) {
        // Strip sensitive data
        if (event.request?.cookies) {
          delete event.request.cookies;
        }
        return event;
      },
    });
  }
}

// Track custom events
export function trackError(error: Error, context?: Record<string, any>) {
  console.error('Error:', error, context);
  
  if (import.meta.env.PROD) {
    Sentry.captureException(error, { extra: context });
  }
}
```

### Performance Monitoring

```tsx
// lib/performance.ts
export function measurePageLoad() {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    const metrics = {
      dns: perfData.domainLookupEnd - perfData.domainLookupStart,
      tcp: perfData.connectEnd - perfData.connectStart,
      ttfb: perfData.responseStart - perfData.requestStart,
      download: perfData.responseEnd - perfData.responseStart,
      domInteractive: perfData.domInteractive - perfData.fetchStart,
      domComplete: perfData.domComplete - perfData.fetchStart,
      loadComplete: perfData.loadEventEnd - perfData.fetchStart,
    };

    // Send to analytics
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metrics,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      }),
    });

    console.log('Performance metrics:', metrics);
  });
}
```

---

## 🎯 Common Gotchas & Solutions

### 1. Memory Leaks in useEffect

```tsx
// ❌ BAD - Memory leak
useEffect(() => {
  const interval = setInterval(() => {
    fetchData();
  }, 5000);
  // Missing cleanup!
}, []);

// ✅ GOOD - Cleanup on unmount
useEffect(() => {
  const interval = setInterval(() => {
    fetchData();
  }, 5000);

  return () => clearInterval(interval);
}, []);
```

### 2. Stale Closures

```tsx
// ❌ BAD - Stale count value
const [count, setCount] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCount(count + 1); // Always uses initial count (0)
  }, 1000);

  return () => clearInterval(interval);
}, []); // Empty deps!

// ✅ GOOD - Functional update
const [count, setCount] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCount(prev => prev + 1); // Uses current value
  }, 1000);

  return () => clearInterval(interval);
}, []);
```

### 3. Race Conditions

```tsx
// ❌ BAD - Race condition
async function searchUsers(query: string) {
  setLoading(true);
  const results = await api.search(query);
  setResults(results); // Old requests can overwrite new ones!
  setLoading(false);
}

// ✅ GOOD - Cancel previous requests
let abortController: AbortController | null = null;

async function searchUsers(query: string) {
  // Cancel previous request
  abortController?.abort();
  abortController = new AbortController();

  setLoading(true);
  try {
    const results = await api.search(query, { 
      signal: abortController.signal 
    });
    setResults(results);
  } catch (err) {
    if (err.name !== 'AbortError') {
      setError(err);
    }
  } finally {
    setLoading(false);
  }
}
```

### 4. Prop Drilling Hell

```tsx
// ❌ BAD - Props passed through 5 levels
<Parent user={user}>
  <Child user={user}>
    <GrandChild user={user}>
      <GreatGrandChild user={user}>
        <ActualComponent user={user} />

// ✅ GOOD - Context API
const UserContext = createContext<User | null>(null);

function App() {
  const [user, setUser] = useState<User | null>(null);
  
  return (
    <UserContext.Provider value={user}>
      <Parent />
    </UserContext.Provider>
  );
}

// Deep component
function ActualComponent() {
  const user = useContext(UserContext);
  // Use user directly
}
```

---

## 📝 Quick Reference

### Component Checklist

Before committing any component:

- [ ] Explicit FlashFusion styling (no Shadcn defaults)
- [ ] Font-family inline styles on text elements
- [ ] Proper TypeScript types (no `any`)
- [ ] Loading/error/empty states
- [ ] Keyboard navigation works
- [ ] Memoized if re-renders are expensive
- [ ] Cleanup effects (useEffect return function)
- [ ] Error boundary wraps risky code
- [ ] Tested with Vitest
- [ ] Accessible (WCAG AA minimum)

### Performance Checklist

- [ ] Bundle size < 100KB (initial)
- [ ] Images lazy loaded and optimized (WebP)
- [ ] Code split by route
- [ ] Expensive calculations memoized
- [ ] Database queries indexed
- [ ] API responses cached (SWR/React Query)
- [ ] Lighthouse score > 90

### Security Checklist

- [ ] All user input sanitized
- [ ] HTTPS everywhere
- [ ] Secrets in environment variables (never committed)
- [ ] Auth tokens in httpOnly cookies
- [ ] CORS configured correctly
- [ ] Rate limiting on API routes
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (DOMPurify)

---

## 🆘 Debugging Strategies

### React DevTools Profiler

```tsx
// Wrap expensive components
import { Profiler } from 'react';

function onRenderCallback(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
) {
  console.log(`${id} ${phase} took ${actualDuration}ms`);
  
  if (actualDuration > 16) { // Slower than 60fps
    console.warn(`Slow render detected in ${id}`);
  }
}

<Profiler id="FeatureList" onRender={onRenderCallback}>
  <FeatureList />
</Profiler>
```

### Network Debugging

```tsx
// Log all API calls in development
if (import.meta.env.DEV) {
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    console.log('Fetch:', args[0]);
    const response = await originalFetch(...args);
    console.log('Response:', response.status, response.statusText);
    return response;
  };
}
```

### Memory Leak Detection

```tsx
// Check for leaks
if (import.meta.env.DEV) {
  setInterval(() => {
    if (performance.memory) {
      const used = performance.memory.usedJSHeapSize / 1048576;
      const limit = performance.memory.jsHeapSizeLimit / 1048576;
      console.log(`Memory: ${used.toFixed(2)}MB / ${limit.toFixed(2)}MB`);
      
      if (used / limit > 0.9) {
        console.warn('Memory usage high!');
      }
    }
  }, 10000); // Check every 10s
}
```

---

## 🚦 Production Readiness

### Pre-Deploy Checklist

**Code Quality:**
- [ ] TypeScript strict mode enabled
- [ ] All tests passing (`npm test`)
- [ ] No console.logs in production code
- [ ] Bundle analyzed (`npm run build && npx vite-bundle-visualizer`)
- [ ] Lighthouse audit passed (>90 all categories)

**Security:**
- [ ] Environment variables set in deployment platform
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Secrets rotated

**Monitoring:**
- [ ] Error tracking configured (Sentry/LogRocket)
- [ ] Analytics tracking verified
- [ ] Performance monitoring active
- [ ] Health check endpoint responding

**Deployment:**
- [ ] Rollback plan documented
- [ ] Database migrations tested
- [ ] CDN cache purged
- [ ] DNS configured correctly
- [ ] Staging environment matches production

---

## 💡 Philosophy

**Ship Fast, Ship Safe:**
- Prioritize user-facing features over internal tools
- Refactor after it works, not before
- Measure performance, don't guess
- Delete code more than you write it
- Production is the only environment that matters

**Code is a Liability:**
- Less code = fewer bugs
- Copy-paste beats abstraction until you have 3+ duplicates
- Delete features users don't use
- Complexity kills velocity

**Users Don't Care:**
- About your tech stack
- About your code quality
- About your clever abstractions
- **They care:** Does it work? Is it fast? Does it solve my problem?

---

**Remember:** Every line of code you write is technical debt. Make it count.

---

**Questions?** Check `/docs/` or ask in team chat. Don't assume - verify.

**Found a bug?** Fix it. Found a pattern others should follow? Add it here.

This is a living document. When you learn something valuable, share it.
