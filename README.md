# FlashFusion

> AI-Powered Development Platform - Transforming ideas into production-ready applications

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646cff.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Best Practices](#development-best-practices)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Resources](#resources)

---

## 🎯 Overview

FlashFusion is a comprehensive AI development assistant that transforms ideas into production-ready applications through advanced AI orchestration. Built with React, TypeScript, and modern web technologies, it provides a sophisticated platform for developers to build, deploy, and manage applications.

**Original Design**: [Figma - FlashFusionWebsite](https://www.figma.com/design/8kPZxN1nfg3DN1gdwYahiS/FlashFusionWebsite)

### Key Features

- 🤖 **AI-Powered Development Tools** - Code generation, full-stack app builder, agent designer
- 🎨 **Advanced UI Components** - 400+ React components with shadcn/ui
- 🎮 **Gamification System** - Achievement tracking and user engagement
- 🚀 **One-Click Deployment** - Integrated CI/CD and deployment workflows
- 📊 **Business Intelligence** - Analytics dashboard and performance monitoring
- 🔐 **Enterprise Authentication** - Supabase-powered auth with social providers
- 🎨 **Print-on-Demand Studio** - Design suite for custom merchandise

---

## 🛠 Tech Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3 | UI framework with JSX runtime |
| **TypeScript** | 5.3 | Type-safe JavaScript |
| **Vite** | 6.3 | Build tool and dev server |
| **Next.js** | 15 | Marketing site (apps/site) |
| **Tailwind CSS** | 4 | Utility-first styling |
| **Motion** | Latest | Animation (Framer Motion) |

### Monorepo & Build

- **Turborepo** - Monorepo task orchestration
- **pnpm** - Fast, disk-efficient package manager
- **ESLint** - Code linting with TypeScript support
- **Prettier** - Code formatting

### Backend & Data

- **Supabase** - PostgreSQL database, authentication, storage
- **React Query** - Server state management
- **Zustand** - Client state management (via custom hooks)

### UI & Components

- **shadcn/ui** - Radix UI + Tailwind component library
- **Lucide React** - Icon system
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Testing

- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing
- **Playwright** - E2E testing

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (recommended) or npm >= 9.0.0
- **Git** >= 2.30.0

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Krosebrook/Flashfusionwebsite.git
   cd Flashfusionwebsite
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix linting issues |
| `pnpm format` | Format code with Prettier |
| `pnpm type-check` | Run TypeScript compiler check |
| `pnpm test` | Run tests |
| `pnpm test:ui` | Run tests with UI |

---

## 📁 Project Structure

```
FlashFusionWebsite/
├── src/
│   ├── apps/                      # Application packages
│   │   ├── web/                   # Main React app (Vite)
│   │   └── site/                  # Marketing site (Next.js)
│   ├── packages/                  # Shared libraries
│   │   ├── config/                # Environment config
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── services/              # Business logic services
│   │   ├── types/                 # TypeScript definitions
│   │   ├── ui/                    # Reusable UI components
│   │   └── utils/                 # Utility functions
│   ├── components/                # React components (457 files)
│   │   ├── auth/                  # Authentication
│   │   ├── dashboard/             # Dashboard features
│   │   ├── tools/                 # Development tools
│   │   ├── ui/                    # Base UI components
│   │   │   └── primitives/        # Layout primitives (NEW)
│   │   └── ...                    # 70+ feature directories
│   ├── fixtures/                  # Mock data (NEW)
│   └── utils/                     # Shared utilities
├── docs/                          # Documentation (NEW)
│   ├── guides/                    # How-to guides
│   ├── architecture/              # System design docs
│   ├── refactoring/               # Refactoring guides
│   └── project/                   # Project management
├── internal/                      # Internal tooling (NEW)
│   └── debug/                     # Debug/test artifacts
├── archive/                       # Archived code (NEW)
├── reports/                       # Refactoring reports (NEW)
├── .eslintrc.cjs                  # ESLint config (NEW)
├── .prettierrc                    # Prettier config (NEW)
├── turbo.json                     # Turborepo config
├── pnpm-workspace.yaml            # Workspace definition
└── package.json                   # Root package config
```

### Key Directories

- **`src/components/ui/primitives/`** - Reusable layout primitives (Flex, Grid) that replace 2,400+ repeated Tailwind patterns
- **`src/fixtures/`** - Centralized mock data for development/testing
- **`internal/debug/`** - Debug components and test files (excluded from production)
- **`archive/`** - Deprecated code versions (preserved for reference)
- **`docs/`** - Comprehensive documentation (guides, architecture, API)
- **`reports/`** - Machine-readable refactoring audit reports

---

## 💡 Development Best Practices

### Component Development

#### Use Layout Primitives

**❌ Avoid repeated Tailwind patterns:**
```tsx
<div className="flex items-center gap-2">...</div>
<div className="flex items-center justify-between">...</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">...</div>
```

**✅ Use type-safe primitives:**
```tsx
import { FlexCenterGap2, FlexBetween, GridResponsive2Cols } from '@/components/ui/primitives';

<FlexCenterGap2>...</FlexCenterGap2>
<FlexBetween>...</FlexBetween>
<GridResponsive2Cols>...</GridResponsive2Cols>

// Or with custom props
<Flex align="center" justify="between" gap={4}>...</Flex>
<Grid cols={1} mdCols={3} lgCols={4} gap={6}>...</Grid>
```

**Benefits:**
- Type-safe props with IntelliSense
- Consistent spacing across app
- Update 1 component vs 800+ instances
- Smaller bundle size

#### Keep Components Small

**Target**: < 500 lines per file (ideally < 200)

If a component exceeds 500 lines, decompose it:

1. **Create `.types.ts`** - Centralize interfaces
2. **Extract mock data** - Move to `src/fixtures/`
3. **Extract logic** - Pure functions to `.logic.ts`
4. **Extract hooks** - State management to `useComponentName.ts`
5. **Extract UI sections** - Self-contained components to `.Section.tsx`

See [`docs/COMPONENT_DECOMPOSITION_GUIDE.md`](./docs/COMPONENT_DECOMPOSITION_GUIDE.md) for details.

### Mock Data Management

**❌ Don't embed mock data in components:**
```tsx
const [items] = useState([
  { id: 1, name: 'Item 1', ... },
  { id: 2, name: 'Item 2', ... },
  // 50+ lines of mock data
]);
```

**✅ Import from fixtures:**
```tsx
import { mockLaunchAssets } from '@/fixtures/launch.fixtures';

const [items] = useState(mockLaunchAssets);
```

**Benefits:**
- Cleaner components
- Reusable test data
- Easy to update
- Better organization

### Import Organization

Imports are automatically ordered by ESLint:

```tsx
// 1. Node built-ins
import fs from 'fs';

// 2. External packages
import React, { useState } from 'react';
import { motion } from 'motion/react';

// 3. Internal packages
import { Button } from '@/components/ui/button';

// 4. Relative imports
import { Header } from './Header';

// 5. Type imports (separated)
import type { User } from '@/types';
```

### Type Safety

**✅ Use type imports for types:**
```tsx
// Good - type imports are stripped at build time
import type { User, Project } from '@/types';
import { fetchUser } from '@/api';

// Avoid - imports everything
import { User, Project, fetchUser } from '@/api';
```

**✅ Avoid `any`:**
```tsx
// Bad
const processData = (data: any) => { ... };

// Good - use proper types
const processData = (data: User[]) => { ... };

// Good - use generics for flexibility
const processData = <T extends BaseData>(data: T[]) => { ... };
```

### File Organization

**Single Responsibility Principle:**

```
components/feature/
├── FeatureComponent.tsx           # Main component (< 200 lines)
├── FeatureComponent.types.ts      # Shared types
├── FeatureComponent.logic.ts      # Business logic
├── FeatureComponent.Section.tsx   # UI section
├── useFeatureData.ts              # Custom hook
└── index.ts                       # Barrel export
```

---

## 📏 Code Standards

### Linting & Formatting

We use **ESLint** for code quality and **Prettier** for formatting.

**Run linting:**
```bash
pnpm lint          # Check for issues
pnpm lint:fix      # Auto-fix issues
```

**Run formatting:**
```bash
pnpm format        # Format all files
```

### ESLint Rules

Key enforced rules:

- ✅ **No unused variables** (error) - except with `_` prefix
- ⚠️ **No explicit `any`** (warning) - prefer proper types
- ✅ **Consistent type imports** - use `import type { ... }`
- ✅ **Import ordering** - alphabetized groups
- ✅ **React hooks rules** - exhaustive deps
- ⚠️ **No console** - except `warn`, `error`, `info`

See [`.eslintrc.cjs`](./.eslintrc.cjs) for full configuration.

### Prettier Configuration

- **Single quotes** for strings
- **Semicolons** required
- **2 spaces** for indentation
- **100 characters** print width
- **LF** line endings

See [`.prettierrc`](./.prettierrc) for full configuration.

### TypeScript

**Strict mode enabled:**
- `strict: true`
- `noImplicitAny: true`
- `strictNullChecks: true`

**Run type checking:**
```bash
pnpm type-check
```

---

## 🧪 Testing

### Test Structure

```
src/
├── components/
│   └── Button/
│       ├── Button.tsx
│       └── Button.test.tsx          # Unit tests
└── __tests__/
    ├── integration/                 # Integration tests
    └── e2e/                         # E2E tests
```

### Running Tests

```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:ui           # Run with UI
pnpm test:coverage     # Generate coverage report
```

### Coverage Targets

- **Baseline**: 35% lines/functions
- **Short-term**: 50% (critical paths)
- **Long-term**: 70%
- **Critical components**: 80% minimum

### Writing Tests

**Component tests:**
```tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

**Hook tests:**
```tsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('increments count', () => {
    const { result } = renderHook(() => useCounter());
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });
});
```

---

## 📚 Documentation

### Documentation Structure

All documentation is in the [`docs/`](./docs/) directory:

- **[`docs/guides/`](./docs/guides/)** - How-to guides and tutorials
  - `development/` - Development workflows
  - `deployment/` - Deployment guides
  - `features/` - Feature documentation
  - `troubleshooting/` - Debug and fix guides

- **[`docs/architecture/`](./docs/architecture/)** - System design docs
  - Component architecture
  - Data flow diagrams
  - Infrastructure setup

- **[`docs/refactoring/`](./docs/refactoring/)** - Refactoring guides
  - [Component Decomposition Guide](./docs/COMPONENT_DECOMPOSITION_GUIDE.md)
  - [Utility Split Plan](./docs/UTILITY_SPLIT_PLAN.md)

- **[`docs/project/`](./docs/project/)** - Project management
  - Roadmap
  - Development phases
  - Quality metrics

### Quick Links

- 📖 [Documentation Index](./docs/README.md)
- 🔧 [Component Decomposition Guide](./docs/COMPONENT_DECOMPOSITION_GUIDE.md)
- 🛠 [Utility Split Plan](./docs/UTILITY_SPLIT_PLAN.md)
- 📝 [Migration Notes](./migration-notes.md)
- 📊 [Refactoring Reports](./reports/)

### Adding Documentation

1. Create markdown file in appropriate `docs/` subdirectory
2. Follow documentation standards (see [`docs/README.md`](./docs/README.md))
3. Add entry to [`docs/README.md`](./docs/README.md) index
4. Use clear headings and examples

---

## 🤝 Contributing

### Before You Start

1. **Read the docs** - Familiarize yourself with [`docs/`](./docs/)
2. **Check existing issues** - Avoid duplicate work
3. **Discuss major changes** - Open an issue first

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow code standards
   - Add tests
   - Update documentation

3. **Run quality checks**
   ```bash
   pnpm lint          # Linting
   pnpm type-check    # Type checking
   pnpm test          # Tests
   pnpm format        # Formatting
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   Use [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `refactor:` - Code refactoring
   - `test:` - Tests
   - `chore:` - Maintenance

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Review Checklist

- [ ] Code follows project standards
- [ ] All tests pass
- [ ] No linting errors
- [ ] Types are correct
- [ ] Documentation updated
- [ ] No console logs (except warn/error/info)
- [ ] Components < 500 lines
- [ ] Mock data in fixtures/
- [ ] Used layout primitives where applicable

---

## 📦 Deployment

### Production Build

```bash
pnpm build
```

Build output will be in `dist/` directory.

### Preview Build

```bash
pnpm preview
```

### Environment Variables

Required environment variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

See `.env.example` for full list.

---

## 📊 Project Status

### Recent Refactoring (2025-10-26)

Comprehensive refactoring completed with audit-ready deliverables:

- ✅ **Removed** 5 duplicate component versions
- ✅ **Relocated** 50 test/debug files to `internal/debug/`
- ✅ **Created** Tailwind primitives (addresses 2,466 patterns)
- ✅ **Identified** 29 oversized components for decomposition
- ✅ **Established** linting and type hygiene standards
- ✅ **Organized** documentation structure

See [`migration-notes.md`](./migration-notes.md) and [`reports/`](./reports/) for details.

### Metrics

- **Components**: 457 files
- **Lines of Code**: 200,000+
- **Test Files**: 4 (coverage improvement in progress)
- **Documentation Files**: 186 (consolidation in progress)
- **Estimated Bundle Size Reduction**: ~300KB

---

## 🔗 Resources

### Official Links

- **Design**: [Figma - FlashFusionWebsite](https://www.figma.com/design/8kPZxN1nfg3DN1gdwYahiS/FlashFusionWebsite)
- **Repository**: [GitHub - Flashfusionwebsite](https://github.com/Krosebrook/Flashfusionwebsite)

### Documentation

- [Documentation Index](./docs/README.md)
- [Migration Notes](./migration-notes.md)
- [Refactoring Reports](./reports/)

### Tech Stack Docs

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Vite](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/docs)
- [Turborepo](https://turbo.build/repo/docs)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Original design from Figma community
- Built with React, TypeScript, and modern web technologies
- UI components from shadcn/ui and Radix UI
- Icons from Lucide React

---

**Built with ❤️ by the FlashFusion Team**

*Last updated: 2025-10-26*
