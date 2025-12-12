# FlashFusion: Veteran Full-Stack Developer Playbook (v6.0)

---

## 1. Core Philosophy & Vision 🎯
Build a **production-grade, AI-powered development platform** that rivals top-tier SaaS products. We prioritize **type safety, performance, accessibility, and scalability**.
*   **Quality Target**: ≥95% parity with veteran UI/UX studio quality.
*   **Architecture**: High-performance Turborepo, React, TypeScript, Vite.
*   **Design System**: Strict adherence to FlashFusion Identity (Orange/Cyan/Magenta).

---

## 2. FlashFusion Design System 🎨

### 2.1 Brand Identity
*   **Primary (Innovation Orange)**: `#FF7B00` (Actions, CTAs, Highlights)
*   **Secondary (Cyan Future)**: `#00B4D8` (Information, Secondary Actions)
*   **Accent (Magenta Bold)**: `#E91E63` (Special Features, Alerts)
*   **Backgrounds**: Dark Navy `#0F172A` (Main), Slate `#1E293B` (Surface)
*   **Typography**:
    *   **Headings**: `Sora` (Weights: 600, 700) - Modern, geometric, accessible.
    *   **Body**: `Inter` (Weights: 400, 500) - Clean, legible, standardized.
    *   **Monospace**: `JetBrains Mono` or system mono.

### 2.2 Global CSS Variables
We adhere to a strict CSS Variable system in `/styles/globals.css`.
*   **DO NOT** hardcode hex values in components. Use `var(--ff-primary)`, `var(--ff-bg-dark)`, etc.
*   **Tailwind Mapping**:
    *   `bg-primary` → `var(--ff-primary)`
    *   `bg-background` → `var(--ff-bg-dark)`
    *   `text-foreground` → `var(--ff-text-primary)`

### 2.3 Layout & Grid
*   **Base Grid**: 4px / 8px spacing.
*   **Container**: `max-w-7xl` centered.
*   **Responsiveness**: Mobile First. Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`.

---

## 3. Production-Ready Development Patterns ⚙️

### 3.1 Component Architecture
*   **Strict Typing**: No `any`. Define interfaces for all props.
*   **Error Boundaries**: Wrap all major route segments and complex widgets in `<ErrorBoundary>`.
    *   Use `components/ui/error-boundary-enhanced.tsx` for granular recovery.
*   **Suspense**: Use `<Suspense>` with skeleton loaders (`components/ui/skeleton.tsx`) for async data.

### 3.2 State Management
*   **Local State**: `useState` for simple UI state.
*   **Server State**: React Query (TanStack Query) for data fetching (if applicable) or strict `useEffect` + local cache patterns.
*   **Global State**: Minimal context usage. Prefer composition.

### 3.3 Performance Optimization
*   **Code Splitting**: Lazy load routes and heavy components.
*   **Asset Optimization**: Use `figma:asset` imports. WebP format preferred.
*   **Memoization**: Use `useMemo` and `useCallback` for expensive computations or referential equality in dependency arrays.

---

## 4. Shadcn & Component Overrides 🛠️

We use Shadcn UI as a base, but **strictly override** styling to match FlashFusion.

### 4.1 Button Overrides
*   **Base**: Rounded corners (`rounded-xl`), explicit padding.
*   **Primary**: `bg-[var(--ff-primary)] hover:bg-[var(--ff-primary-600)] text-white shadow-lg shadow-orange-500/20`.
*   **Secondary**: `bg-[var(--ff-secondary)] hover:bg-[var(--ff-secondary-600)] text-white`.
*   **Outline**: `border-2 border-[var(--ff-surface-light)] hover:border-[var(--ff-primary)]`.

### 4.2 Card Overrides
*   **Background**: `bg-[var(--ff-surface)]` (Slate).
*   **Border**: `border border-[var(--ff-surface-light)]`.
*   **Shadow**: `shadow-xl`.

### 4.3 Animation & Micro-Interactions
*   **Hover**: `transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`.
*   **Transitions**: Use `ease-out` curves.
*   **Motion**: `framer-motion` (Motion) for complex page transitions and entrance animations.

---

## 5. Security & Reliability 🛡️

### 5.1 Authentication
*   **Supabase Auth**: Strictly adhere to the Supabase implementation in `/components/auth`.
*   **Protected Routes**: Use `AuthGuard` or `ProtectedPageRouter` to wrap private content.
*   **Secrets**: Access environment variables via `import.meta.env` or `Deno.env` (server-side).

### 5.2 Error Handling
*   **Graceful Degradation**: UI should not crash completely. Show fallback UI.
*   **Logging**: `console.error` with structural context in dev; logging service in prod.

---

## 6. Testing & Quality Assurance 🧪
*   **Unit Tests**: Vitest for utility functions and hooks.
*   **Component Tests**: React Testing Library for critical UI components.
*   **E2E**: Playwright for critical user flows (Sign Up, Checkout, Core Workflow).
*   **Accessibility**: WCAG 2.1 AA compliance. Keyboard navigable. Screen reader friendly.

---

## 7. Workflow & CI/CD 🚀
*   **Commit**: Semantic commits (`feat:`, `fix:`, `chore:`).
*   **Linting**: ESLint + Prettier.
*   **Build**: `vite build` must pass without warnings.

---

## 8. Summary Checklist ✅
1.  **Brand**: Is it Orange/Cyan/Magenta? Are fonts Sora/Inter?
2.  **Type Safe**: Are all props typed?
3.  **Resilient**: Is it wrapped in an Error Boundary?
4.  **Responsive**: Does it work on mobile?
5.  **Performant**: Are images optimized and heavy codesplit?

**"Build it once, build it right. Production quality from Day 1."**
