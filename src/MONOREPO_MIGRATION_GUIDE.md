# 🏗️ FlashFusion Turborepo Migration Guide

## 📋 Overview

Converting FlashFusion to a **Turborepo monorepo** for improved:
- ⚡ Build performance with intelligent caching
- 🔄 Code sharing across packages
- 📦 Better dependency management
- 🎯 Isolated testing and deployment
- 🚀 Parallel task execution

---

## 🎯 New Monorepo Structure

```
flashfusion-monorepo/
├── apps/
│   └── web/                          # Main FlashFusion web app
│       ├── src/
│       │   ├── components/           # App-specific components
│       │   ├── pages/               # Route pages
│       │   ├── styles/              # App styles
│       │   └── main.tsx             # Entry point
│       ├── public/
│       ├── package.json
│       ├── vite.config.ts
│       └── tsconfig.json
│
├── packages/
│   ├── ui/                          # Shared UI components
│   │   ├── src/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── types/                       # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── core.ts
│   │   │   ├── project.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── hooks/                       # Shared React hooks
│   │   ├── src/
│   │   │   ├── app-state.ts
│   │   │   ├── gamification.tsx
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── services/                    # Business logic services
│   │   ├── src/
│   │   │   ├── analytics.ts
│   │   │   ├── auth.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── utils/                       # Utility functions
│   │   ├── src/
│   │   │   ├── performance.ts
│   │   │   ├── validation.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── config/                      # Shared configuration
│       ├── src/
│       │   ├── env.ts
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── turbo.json                       # Turborepo configuration
├── pnpm-workspace.yaml              # PNPM workspace config
├── package.json                     # Root package.json
└── tsconfig.json                    # Base TypeScript config
```

---

## 🔧 Step-by-Step Migration

### **Phase 1: Update Root Configuration**

#### 1.1 Update `package.json`
```json
{
  "name": "flashfusion-monorepo",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean && rm -rf node_modules",
    "format": "prettier --write \"**/*.{ts,tsx,md}\""
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.1",
    "@turbo/gen": "^1.12.4",
    "prettier": "^3.2.5",
    "turbo": "^1.12.4",
    "typescript": "^5.3.3"
  },
  "packageManager": "pnpm@8.15.1",
  "engines": {
    "node": ">=18",
    "pnpm": ">=8"
  }
}
```

#### 1.2 Update `turbo.json`
```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "globalDependencies": [
    "**/.env.*local",
    ".env",
    "tsconfig.json"
  ],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [
        "dist/**",
        ".next/**",
        "!.next/cache/**",
        "build/**"
      ]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "type-check": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", "tsconfig.json"],
      "outputs": []
    },
    "test": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", "vitest.config.*"],
      "outputs": ["coverage/**"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

---

### **Phase 2: Create Package Structure**

#### 2.1 Create `packages/ui/package.json`
```json
{
  "name": "@flashfusion/ui",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./button": "./src/button.tsx",
    "./card": "./src/card.tsx"
  },
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "@radix-ui/react-slot": "^1.1.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "typescript": "^5.3.3"
  },
  "peerDependencies": {
    "react": "^18.2.0"
  }
}
```

#### 2.2 Create `packages/types/package.json`
```json
{
  "name": "@flashfusion/types",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./core": "./src/core.ts",
    "./project": "./src/project.ts"
  },
  "scripts": {
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
```

#### 2.3 Create `packages/hooks/package.json`
```json
{
  "name": "@flashfusion/hooks",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@flashfusion/types": "workspace:*",
    "react": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "typescript": "^5.3.3"
  },
  "peerDependencies": {
    "react": "^18.2.0"
  }
}
```

#### 2.4 Create `packages/services/package.json`
```json
{
  "name": "@flashfusion/services",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@flashfusion/types": "workspace:*",
    "@supabase/supabase-js": "^2.39.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
```

#### 2.5 Create `packages/utils/package.json`
```json
{
  "name": "@flashfusion/utils",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@flashfusion/types": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
```

#### 2.6 Create `packages/config/package.json`
```json
{
  "name": "@flashfusion/config",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
```

---

### **Phase 3: Update Main App**

#### 3.1 Update `apps/web/package.json`
```json
{
  "name": "@flashfusion/web",
  "version": "2.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint . --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@flashfusion/ui": "workspace:*",
    "@flashfusion/types": "workspace:*",
    "@flashfusion/hooks": "workspace:*",
    "@flashfusion/services": "workspace:*",
    "@flashfusion/utils": "workspace:*",
    "@flashfusion/config": "workspace:*",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.39.0",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.5",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.3",
    "vite": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

---

### **Phase 4: Create TypeScript Configurations**

#### 4.1 Root `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
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
      "@flashfusion/ui": ["./packages/ui/src"],
      "@flashfusion/types": ["./packages/types/src"],
      "@flashfusion/hooks": ["./packages/hooks/src"],
      "@flashfusion/services": ["./packages/services/src"],
      "@flashfusion/utils": ["./packages/utils/src"],
      "@flashfusion/config": ["./packages/config/src"]
    }
  },
  "include": [],
  "references": [
    { "path": "./apps/web" },
    { "path": "./packages/ui" },
    { "path": "./packages/types" },
    { "path": "./packages/hooks" },
    { "path": "./packages/services" },
    { "path": "./packages/utils" },
    { "path": "./packages/config" }
  ]
}
```

#### 4.2 Package `tsconfig.json` Template
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 🚀 Migration Commands

### **Step 1: Install Dependencies**
```bash
# Install root dependencies
pnpm install

# Install turbo globally (optional)
pnpm add -g turbo
```

### **Step 2: Build All Packages**
```bash
# Build all packages in dependency order
turbo build

# Or build specific package
turbo build --filter=@flashfusion/ui
```

### **Step 3: Run Development**
```bash
# Run all apps in dev mode
turbo dev

# Run specific app
turbo dev --filter=@flashfusion/web
```

### **Step 4: Test Everything**
```bash
# Run all tests
turbo test

# Run tests with coverage
turbo test -- --coverage
```

---

## 📦 Import Changes

### **Before (Old Structure)**
```typescript
// Old imports
import { Button } from './components/ui/button';
import { User } from './types/core';
import { useAppState } from './hooks/useAppState';
import { AnalyticsService } from './services/AnalyticsService';
```

### **After (Monorepo Structure)**
```typescript
// New imports
import { Button } from '@flashfusion/ui';
import { User } from '@flashfusion/types';
import { useAppState } from '@flashfusion/hooks';
import { AnalyticsService } from '@flashfusion/services';
```

---

## 🎯 Benefits

### **1. Build Performance**
- ✅ Intelligent caching (up to 10x faster rebuilds)
- ✅ Parallel task execution
- ✅ Only rebuild changed packages

### **2. Code Sharing**
- ✅ Shared UI components across apps
- ✅ Centralized types and utilities
- ✅ DRY principle enforcement

### **3. Developer Experience**
- ✅ Better IDE support with package references
- ✅ Isolated testing per package
- ✅ Clear dependency graph

### **4. Deployment**
- ✅ Deploy only changed apps
- ✅ Smaller bundle sizes
- ✅ Better caching strategies

---

## 📊 Package Dependency Graph

```
@flashfusion/web (app)
├── @flashfusion/ui
│   └── @flashfusion/types
├── @flashfusion/hooks
│   └── @flashfusion/types
├── @flashfusion/services
│   └── @flashfusion/types
├── @flashfusion/utils
│   └── @flashfusion/types
└── @flashfusion/config
```

---

## 🧪 Testing Strategy

### **Package-Level Tests**
```bash
# Test specific package
turbo test --filter=@flashfusion/ui

# Test with watch mode
turbo test --filter=@flashfusion/ui -- --watch
```

### **Integration Tests**
```bash
# Test app with all dependencies
turbo test --filter=@flashfusion/web
```

---

## 🔍 Troubleshooting

### **Issue: Module not found**
```bash
# Clear cache and reinstall
turbo clean
rm -rf node_modules
pnpm install
```

### **Issue: Type errors across packages**
```bash
# Rebuild all packages
turbo build --force
```

### **Issue: Circular dependencies**
```bash
# Check dependency graph
turbo run build --graph
```

---

## 📚 Next Steps

1. ✅ **Complete Migration** - Follow phases 1-4
2. 🔄 **Update Imports** - Replace old imports with new package imports
3. 🧪 **Test Thoroughly** - Run `turbo test` to verify
4. 📦 **Build Packages** - Run `turbo build`
5. 🚀 **Deploy** - Use Vercel/Netlify with monorepo support

---

## 🎓 Resources

- [Turborepo Docs](https://turbo.build/repo/docs)
- [PNPM Workspaces](https://pnpm.io/workspaces)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)

---

**Status:** Ready for Migration 🚀  
**Estimated Time:** 2-3 hours  
**Complexity:** Medium  
**Impact:** High Performance Gains
