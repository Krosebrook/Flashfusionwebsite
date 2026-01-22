# FlashFusion Design & Engineering Guidelines (v6.0)

---

## 1. Purpose & Vision 🎯
Build **FlashFusion**, a high-performance AI-powered development platform.
**Core Philosophy**: "Veteran Full-Stack Developer" playbook.
- **Zero Redundancy**: Every file must have a purpose.
- **Strict Type Safety**: No `any` types. Strict strictness.
- **Production-Ready**: Robust error boundaries, optimized loading states, and studio-grade UX.

---

## 2. Architecture & Code Standards ⚙️

### 2.1 "Veteran" Playbook Rules
- **Explicit Shadcn Overrides**: Do not use default Shadcn styles blindly. Override with FlashFusion design tokens (`--ff-primary`, etc.).
- **Robust Error Boundaries**: Wrap all major features in `FlashFusionErrorBoundary`. Never let the app crash to a white screen.
- **Zero Redundant Files**: Prune unused components immediately.
- **Type-Compliant**: Ensure strict TypeScript compliance before implementing new features.

### 2.2 Environment & Configuration
- **Centralized Env**: ALWAYS use `src/lib/env.ts` and the `ENV` object.
  - ✅ Correct: `import { ENV } from '@/lib/env'; const key = ENV.VITE_SUPABASE_URL;`
  - ❌ Incorrect: `process.env.VITE_SUPABASE_URL` or `import.meta.env.VITE_SUPABASE_URL`.
- **Syncing**: Keep `lib/env.ts` and `packages/config/src/env.ts` in sync with `API_KEYS_REQUIRED.md`.

### 2.3 Core Application Structure
- **Entry Point**: `App.tsx` wraps `AppCoreOptimized`.
- **Core Logic**: `AppCoreOptimized.tsx` handles routing, auth, and global states.
- **Performance**: Use `React.memo`, `useMemo`, and `React.lazy` for all heavy components.
- **Authentication**: Centralized `AuthProvider`.

---

## 3. Visual System (FlashFusion Brand) 🎨

### 3.1 Color Palette (Strict)
Enforce the **Orange / Cyan / Magenta** triad.
- **Primary (Orange)**: `var(--ff-primary)` (approx `#FF7B00`) → Main Actions, Brand Identity.
- **Secondary (Cyan)**: `var(--ff-secondary)` (approx `#00B4D8`) → Information, Tech Accents.
- **Accent (Magenta)**: `var(--ff-accent)` (approx `#E91E63`) → Highlights, "Magic" AI moments.
- **Backgrounds**: `var(--ff-bg-dark)` (Dark Mode Default), `var(--ff-surface)`.

### 3.2 Typography
- **Headings / Display**: **Sora** (Weights: 600, 700). Use for hero text and major headers.
- **Body / UI**: **Inter** (Weights: 400, 500). Use for density and readability.
- **Code**: `var(--ff-font-mono)` (e.g., JetBrains Mono or Fira Code).

### 3.3 Styling Implementation
- Use CSS Variables for everything:
  - Spacing: `var(--ff-space-4)`, `var(--ff-space-8)`
  - Radius: `var(--ff-radius-lg)`
  - Shadows: `var(--ff-shadow-xl)`, `var(--ff-glow)`
- **Tailwind**: Map Tailwind config to these variables (e.g., `bg-primary` -> `var(--ff-primary)`).

---

## 4. UI/UX Patterns 📊

### 4.1 Interaction Logic
- **Loading States**: Use `LoadingState` component with branded animations (pulse, shimmer).
- **Error States**: Use `ErrorState` with clear recovery actions (Retry, Safe Mode).
- **Feedback**: Immediate visual feedback for all user actions (< 100ms).

### 4.2 Responsiveness
- **Mobile First**: Design for touch targets (≥ 44px).
- **Adaptive Layouts**:
  - Desktop: Multi-pane, high density.
  - Mobile: Focused single-column, bottom navigation.

---

## 5. Quality Assurance 🧪

### 5.1 Validation
- **Infrastructure**: Use `InfrastructureValidator` (powered by `ENV`) to verify setup on boot.
- **Linting**: Strict ESLint rules. No unused vars, no console logs in production.
- **Accessibility**: WCAG 2.1 AA compliance (Contrast check on Orange/Cyan against Dark backgrounds is critical).

### 5.2 Performance
- **Metrics**: Monitor First Contentful Paint (FCP) and Time to Interactive (TTI).
- **Optimization**: Lazy load all non-critical routes.

---

## 6. Summary ✅

**Design Principles:**
1. **FlashFusion Identity**: Bold, Dark, Neon (Orange/Cyan/Magenta).
2. **Engineering Excellence**: Type-safe, Robust, Optimized.
3. **User Trust**: No crashes, clear errors, predictable auth.

**Quality Target**: Production-ready code that looks and feels like a top-tier SaaS product.
