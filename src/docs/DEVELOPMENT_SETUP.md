# FlashFusion Development Setup

Complete guide to setting up a development environment for FlashFusion, whether you're contributing to the platform or building custom extensions.

## 🎯 Prerequisites

### System Requirements

**Operating System Support**
- **macOS**: 10.15+ (Catalina or later)
- **Windows**: 10/11 with WSL2 recommended
- **Linux**: Ubuntu 18.04+, Debian 10+, or equivalent

**Required Software**
```bash
# Node.js 18+ (LTS recommended)
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 8.0.0 or higher

# pnpm (required for monorepo)
pnpm --version  # Should be 8.0.0 or higher

# Git
git --version   # Should be 2.20.0 or higher
```

### Development Tools

**Essential Tools**
- **Visual Studio Code** (recommended) with extensions:
  - TypeScript and JavaScript Language Features
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - ESLint
  - Tailwind CSS IntelliSense
  - GitLens
  - Auto Rename Tag
  - Bracket Pair Colorizer

**Alternative Editors**
- **WebStorm/IntelliJ IDEA**: Full IDE with TypeScript support
- **Neovim/Vim**: With appropriate TypeScript and React plugins
- **Sublime Text**: With TypeScript and React packages

## 🚀 Quick Development Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-org/flashfusion.git
cd flashfusion

# Install dependencies for all packages
pnpm install

# Verify installation
pnpm --version
node --version
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables
code .env.local  # or your preferred editor
```

**Essential Environment Variables:**
```env
# Core Configuration
NODE_ENV=development
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=FlashFusion

# Supabase (Required for backend functionality)
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# AI Services (At least one required)
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
GOOGLE_AI_API_KEY=your-google-ai-api-key

# Development Features
VITE_FEATURE_DEBUG_PANEL=true
VITE_FEATURE_PERFORMANCE_MONITOR=true
VITE_DEV_MODE=true
```

### 3. Database Setup

**Supabase Setup:**
```bash
# Option 1: Use Supabase Cloud (Recommended for beginners)
# 1. Sign up at https://supabase.com
# 2. Create a new project
# 3. Copy the URL and keys to .env.local
# 4. Run initial migrations
pnpm db:setup

# Option 2: Local Supabase (Advanced users)
# Install Supabase CLI
npm install -g @supabase/cli

# Initialize local Supabase
supabase init
supabase start

# Apply migrations
supabase db push
```

### 4. Start Development

```bash
# Start all development services
pnpm dev

# Or start specific services
pnpm dev:web     # Main web application
pnpm dev:server  # Backend server only
pnpm dev:docs    # Documentation site
```

**Development URLs:**
- **Main App**: http://localhost:5173
- **Supabase Studio**: http://localhost:54323 (if using local)
- **API Server**: http://localhost:3001

## 🏗️ Monorepo Architecture

### Turborepo Structure

FlashFusion uses Turborepo for efficient monorepo management:

```
flashfusion/
├── apps/
│   └── web/                 # Main web application
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── hooks/               # Custom React hooks
│   ├── services/            # Business logic services
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   └── config/              # Configuration management
├── components/              # Legacy component structure
├── docs/                    # Documentation
└── supabase/               # Backend services
```

### Package Management

**Working with Packages:**
```bash
# Add dependency to specific package
pnpm add lodash --filter @flashfusion/utils

# Add dev dependency to workspace root
pnpm add -D eslint -w

# Run command in specific package
pnpm --filter @flashfusion/ui build

# Run command in all packages
pnpm -r build

# Check package dependencies
pnpm list --depth=0
```

**Turborepo Commands:**
```bash
# Build all packages in correct order
pnpm build

# Run tests across all packages
pnpm test

# Lint all packages
pnpm lint

# Clean all build outputs
pnpm clean

# Check for outdated dependencies
pnpm outdated
```

## 🛠️ Development Scripts

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm dev:web          # Start web app only
pnpm dev:server       # Start backend server only
pnpm dev:docs         # Start documentation site

# Building
pnpm build            # Build all packages
pnpm build:web        # Build web app only
pnpm build:packages   # Build shared packages only

# Testing
pnpm test             # Run all tests
pnpm test:unit        # Run unit tests only
pnpm test:e2e         # Run end-to-end tests
pnpm test:coverage    # Run tests with coverage

# Code Quality
pnpm lint             # Lint all code
pnpm lint:fix         # Auto-fix linting issues
pnpm format           # Format code with Prettier
pnpm type-check       # TypeScript type checking

# Database
pnpm db:setup         # Initialize database
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed with sample data
pnpm db:reset         # Reset database

# Deployment
pnpm deploy           # Deploy to production
pnpm deploy:staging   # Deploy to staging
pnpm preview          # Preview production build
```

### Custom Scripts

**Adding Custom Scripts:**
```json
{
  "scripts": {
    "custom:task": "echo 'Custom task'",
    "analyze": "pnpm build && npx @next/bundle-analyzer",
    "check-deps": "pnpm audit && pnpm outdated"
  }
}
```

## 🧪 Testing Setup

### Testing Framework

FlashFusion uses a comprehensive testing setup:

**Test Types:**
- **Unit Tests**: Vitest for component and utility testing
- **Integration Tests**: Testing API endpoints and services
- **E2E Tests**: Playwright for end-to-end user workflows
- **Visual Tests**: Chromatic for visual regression testing

**Testing Configuration:**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
});
```

### Running Tests

```bash
# Unit tests
pnpm test                    # Run all unit tests
pnpm test --watch           # Watch mode for development
pnpm test --coverage        # Generate coverage report
pnpm test Button            # Run specific test file

# E2E tests
pnpm test:e2e               # Run all E2E tests
pnpm test:e2e --ui          # Run with Playwright UI
pnpm test:e2e --debug      # Run in debug mode
pnpm test:e2e --project=chromium  # Run in specific browser

# Visual tests
pnpm test:visual            # Run visual regression tests
pnpm test:visual:approve    # Approve visual changes
```

### Writing Tests

**Component Test Example:**
```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct CSS classes', () => {
    render(<Button className="ff-btn-primary">Primary Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('ff-btn-primary');
  });
});
```

**E2E Test Example:**
```typescript
// auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('user can sign up and log in', async ({ page }) => {
    // Navigate to sign up page
    await page.goto('/auth/signup');
    
    // Fill out sign up form
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="signup-button"]');
    
    // Verify successful signup
    await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible();
    
    // Test login flow
    await page.goto('/auth/login');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // Verify successful login
    await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
  });
});
```

## 🎨 Code Style & Guidelines

### TypeScript Configuration

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./components/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/services/*": ["./services/*"],
      "@/types/*": ["./types/*"],
      "@/utils/*": ["./utils/*"]
    }
  },
  "include": ["src", "components", "hooks", "services", "types", "utils"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### ESLint Configuration

**eslintrc.json:**
```json
{
  "extends": [
    "@next/eslint-config-next",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "react", "react-hooks"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

### Prettier Configuration

**.prettierrc.json:**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### Code Style Guidelines

**Component Structure:**
```typescript
// ComponentName.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { ComponentProps } from './types';

interface Props {
  title: string;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export function ComponentName({ title, onSubmit, isLoading = false }: Props) {
  // State
  const [formData, setFormData] = useState<FormData>({});
  
  // Callbacks
  const handleSubmit = useCallback(() => {
    onSubmit(formData);
  }, [formData, onSubmit]);
  
  // Memoized values
  const isValid = useMemo(() => {
    return formData.name && formData.email;
  }, [formData]);
  
  return (
    <Card className="ff-card-interactive">
      <CardHeader>
        <CardTitle className="ff-text-gradient">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Component content */}
        <Button 
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          className="ff-btn-primary"
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </CardContent>
    </Card>
  );
}
```

**Hook Structure:**
```typescript
// useCustomHook.ts
import { useState, useEffect, useCallback } from 'react';
import type { HookOptions, HookReturn } from './types';

export function useCustomHook(options: HookOptions): HookReturn {
  const [state, setState] = useState(options.initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await someAsyncOperation();
      setState(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (options.autoExecute) {
      execute();
    }
  }, [execute, options.autoExecute]);
  
  return {
    state,
    loading,
    error,
    execute,
  };
}
```

## 🔧 Development Tools

### VS Code Extensions

**Essential Extensions:**
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

**VS Code Settings:**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### Browser DevTools

**Chrome Extensions:**
- **React Developer Tools**: Debug React components
- **Redux DevTools**: Debug state management (if using Redux)
- **Web Vitals**: Monitor Core Web Vitals
- **Lighthouse**: Performance auditing

**Firefox Extensions:**
- **React Developer Tools**: React debugging for Firefox
- **Vue.js devtools**: If working with Vue components

### Performance Monitoring

**Development Performance Tools:**
```bash
# Bundle analysis
pnpm analyze

# Performance monitoring
pnpm dev:perf

# Memory usage analysis
pnpm dev:memory

# Lighthouse CI
pnpm lighthouse
```

**Performance Configuration:**
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
});
```

## 🐛 Debugging

### Debug Configuration

**VS Code Debug Configuration:**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "request": "launch",
      "type": "chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src",
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    },
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/vitest",
      "args": ["--run"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Common Debug Scenarios

**React Component Debugging:**
```typescript
// Add debug logging
useEffect(() => {
  console.log('Component mounted with props:', props);
  return () => console.log('Component unmounting');
}, []);

// Use React DevTools Profiler
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration) {
  console.log('Render performance:', { id, phase, actualDuration });
}

<Profiler id="MyComponent" onRender={onRenderCallback}>
  <MyComponent />
</Profiler>
```

**API Debugging:**
```typescript
// Add request/response logging
const api = {
  async request(url: string, options: RequestInit) {
    console.log('API Request:', { url, options });
    
    try {
      const response = await fetch(url, options);
      console.log('API Response:', {
        status: response.status,
        headers: Object.fromEntries(response.headers),
      });
      
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};
```

## 📦 Package Development

### Creating New Packages

**Package Structure:**
```bash
# Create new package
mkdir packages/my-package
cd packages/my-package

# Initialize package
pnpm init

# Create standard structure
mkdir src
touch src/index.ts
touch README.md
touch tsconfig.json
```

**Package.json Template:**
```json
{
  "name": "@flashfusion/my-package",
  "version": "0.1.0",
  "description": "Description of the package",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "clean": "rm -rf dist"
  },
  "dependencies": {},
  "devDependencies": {
    "tsup": "^7.0.0",
    "typescript": "^5.0.0"
  },
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  }
}
```

### Package Linking

**Local Package Development:**
```bash
# Link package for development
pnpm link packages/my-package

# Use in another package
pnpm link @flashfusion/my-package

# Auto-link workspace packages
pnpm install
```

## 🚀 Deployment Setup

### Environment-Specific Configuration

**Development Environment:**
```bash
# .env.development
NODE_ENV=development
VITE_API_URL=http://localhost:3001
VITE_DEBUG_MODE=true
VITE_HOT_RELOAD=true
```

**Production Environment:**
```bash
# .env.production
NODE_ENV=production
VITE_API_URL=https://api.flashfusion.com
VITE_DEBUG_MODE=false
VITE_CDN_URL=https://cdn.flashfusion.com
```

### Build Configuration

**Production Build:**
```bash
# Build for production
pnpm build

# Analyze bundle size
pnpm analyze

# Test production build locally
pnpm preview

# Deploy to staging
pnpm deploy:staging

# Deploy to production
pnpm deploy:production
```

## 🆘 Troubleshooting

### Common Issues

**Node Modules Issues:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear pnpm cache
pnpm store prune

# Verify pnpm installation
pnpm --version
```

**TypeScript Issues:**
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache/
pnpm tsc --build --clean

# Restart TypeScript server in VS Code
# Command Palette: "TypeScript: Restart TS Server"
```

**Build Issues:**
```bash
# Clear build cache
rm -rf dist .vite .turbo
pnpm clean

# Rebuild packages in order
pnpm build --force
```

**Port Conflicts:**
```bash
# Find process using port 5173
lsof -i :5173

# Kill process
kill -9 <process-id>

# Or use different port
pnpm dev --port 3000
```

### Getting Help

**Internal Resources:**
1. Check the [troubleshooting guide](./support/COMMON_ISSUES.md)
2. Search [existing issues](https://github.com/your-org/flashfusion/issues)
3. Review [development logs](./logs/)

**Community Support:**
1. [GitHub Discussions](https://github.com/your-org/flashfusion/discussions)
2. [Discord Community](https://discord.gg/flashfusion)
3. [Stack Overflow](https://stackoverflow.com/questions/tagged/flashfusion)

**Professional Support:**
- Enterprise customers: support@flashfusion.com
- Priority support through Pro/Enterprise plans
- Custom development services available

---

*Ready to contribute to FlashFusion? Check out our [Contributing Guidelines](./CONTRIBUTING.md) to get started!*