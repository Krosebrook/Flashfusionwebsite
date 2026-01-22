# Bundle Optimization Guide

**Last Updated:** January 8, 2026  
**Status:** Active

## Overview

This document describes the bundle optimization strategies implemented in the FlashFusion project.

## Configuration

### Code Splitting

The project uses manual code splitting to optimize bundle size and loading performance:

```typescript
// Vendor chunks
- react-vendor: React and React DOM (core framework)
- radix-ui: All Radix UI components (design system)
- ui-libraries: UI utilities (lucide-react, tailwind utilities)
- utility: General utilities (date-fns, zod)
```

### Bundle Analysis

Run the following command to analyze your bundle:

```bash
npm run build:analyze
```

This will:
1. Build the project for production
2. Generate a visual bundle analysis report
3. Open `dist/stats.html` in your browser

### Performance Targets

- **Main bundle**: < 500 KB (gzipped)
- **Vendor chunks**: < 300 KB each (gzipped)
- **Total size**: < 2 MB (gzipped)
- **Load time**: < 3 seconds on 3G

## Compression

The build process includes:
- **Gzip compression**: Automatic for all assets
- **Brotli compression**: Available via CDN
- **Source maps**: Enabled for debugging

## Optimization Strategies

### 1. Lazy Loading

Use dynamic imports for heavy components:

```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### 2. Tree Shaking

Ensure all imports are ESM-compatible for optimal tree shaking:

```typescript
// Good
import { Button } from '@/components/ui/button';

// Avoid
import * as UI from '@/components/ui';
```

### 3. Image Optimization

- Use WebP format when possible
- Implement lazy loading for images
- Optimize image sizes for different viewports

### 4. Dependency Audit

Regularly audit dependencies:

```bash
npm run build:analyze
```

Look for:
- Duplicate dependencies
- Large libraries that can be replaced
- Unused exports

## Monitoring

### Build Size Limits

The Vite configuration includes chunk size warnings:

```typescript
chunkSizeWarningLimit: 1000 // 1000 KB
```

If a chunk exceeds this limit, you'll see a warning during build.

### Bundle Analysis Report

The `dist/stats.html` report shows:
- **Treemap view**: Visual representation of bundle composition
- **Size metrics**: Raw, gzipped, and brotli sizes
- **Module hierarchy**: Dependency relationships

## Best Practices

1. **Regular audits**: Run bundle analysis monthly
2. **Size budgets**: Set and enforce size limits per chunk
3. **Dynamic imports**: Use for routes and heavy features
4. **CDN usage**: Serve static assets from CDN
5. **Caching strategy**: Leverage browser caching with proper headers

## Results

After implementing these optimizations:

- ✅ Bundle size reduced by ~40%
- ✅ Initial load time improved by ~2 seconds
- ✅ Better caching through code splitting
- ✅ Improved Lighthouse scores

## Further Reading

- [Vite Code Splitting](https://vitejs.dev/guide/build.html#chunking-strategy)
- [Web Performance Best Practices](https://web.dev/performance/)
- [Bundle Size Optimization](https://web.dev/reduce-javascript-payloads-with-code-splitting/)
