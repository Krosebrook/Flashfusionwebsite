# Internal Debug & Test Artifacts

**⚠️ WARNING: This directory contains debug and test code that should NOT be included in production builds.**

## Purpose

This directory contains:
- Test components and utilities
- Debug panels and diagnostic tools
- Performance testing scripts
- Configuration test files
- Integration test suites

## Usage Policy

### Development Environment Only

All code in this directory is intended for **development and testing purposes only**:

```typescript
// ✅ Correct usage - gated by environment
if (process.env.NODE_ENV !== 'production') {
  const { AppDebugger } = await import('../../internal/debug/components/debug/AppDebugger');
  // Use debug component
}
```

### Production Build Exclusion

Ensure your bundler configuration excludes this directory:

**Vite Configuration**:
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      external: [/^\/internal\//]
    }
  }
});
```

**Webpack Configuration**:
```javascript
module.exports = {
  resolve: {
    alias: {
      // Exclude internal directory in production
      ...(process.env.NODE_ENV === 'production' && {
        '/internal': false
      })
    }
  }
};
```

## Directory Structure

```
internal/debug/
├── components/          # Debug/test UI components
│   ├── test/           # Test component suite
│   ├── testing/        # Integration test components
│   └── debug/          # Debug panels and tools
├── scripts/            # Test and validation scripts
├── utils/              # Debug utilities and helpers
└── config/             # Test configuration files
```

## Migrated Files

See `../../migration-notes.md` for the complete list of files relocated to this directory during the refactoring process.

## JSDoc Annotations

All exports from this directory are marked with `@internal`:

```typescript
/**
 * @internal
 * Debug component for performance monitoring
 * Only available in development mode
 */
export const PerformanceDebugPanel = () => { /* ... */ };
```

## Best Practices

1. **Never import in production code** - Always gate imports behind environment checks
2. **Use dynamic imports** - Prefer `import()` over static imports to enable tree-shaking
3. **Add JSDoc @internal tags** - Clearly mark all exports as internal-only
4. **Document test scenarios** - Include comments explaining what each test validates
5. **Keep dependencies minimal** - Avoid adding production dependencies for test code

## Related Documentation

- `/migration-notes.md` - Refactoring changelog with before/after references
- `/reports/duplicates-resolution.json` - Machine-readable relocation report
