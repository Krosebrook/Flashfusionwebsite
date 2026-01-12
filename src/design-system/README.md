# FlashFusion Design System

A comprehensive, production-ready design system for the FlashFusion platform featuring dark-first design, glassmorphism, and WCAG AA accessibility compliance.

## 📁 Structure

```
src/design-system/
├── color-system.json              # Complete color palette definitions
├── tailwind-theme-extension.json  # Tailwind configuration
├── css-variables.css              # HSL CSS variables
├── component-color-map.json       # Component state mappings
├── accessibility-report.md        # WCAG AA compliance report
└── README.md                      # This file

docs/
└── BRAND_GUIDELINES.md            # Complete brand guidelines

design-tokens.json                  # Design tokens for Figma/Storybook
```

## 🎨 Brand Colors

### Primary (Purple)
- **Base**: `#a855f7` (HSL: 271, 91%, 65%)
- **Usage**: Primary actions, brand elements, key interactive components
- **Scale**: 50-900 with full HSL support

### Secondary (Rose/Pink)
- **Base**: `#f472b6` (HSL: 328, 86%, 70%)
- **Usage**: Secondary actions, highlights, complementary elements
- **Scale**: 50-900 with full HSL support

### Semantic Colors
- **Success**: `#22c55e` - Green for positive feedback
- **Warning**: `#f59e0b` - Amber for warnings
- **Error**: `#ef4444` - Red for errors
- **Info**: `#3b82f6` - Blue for information

### Dark Mode
- **Background**: `#0f0618` - Deep purple-tinted black
- **Surface**: `#1a0b2e` - Cards and panels
- **Surface Light**: `#2d1b4e` - Elevated elements

## 🚀 Quick Start

### 1. Import Fonts

Already included in `globals.css`:
```html
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Inter:wght@300;400&display=swap');
```

### 2. Use Color Classes

```jsx
// Primary button
<button className="bg-primary hover:bg-primary-600 text-white">
  Click me
</button>

// Secondary button
<button className="bg-secondary hover:bg-secondary-600 text-white">
  Secondary
</button>

// Card with glass effect
<div className="glass rounded-lg p-6">
  <h2 className="text-primary-100">Glassy Card</h2>
</div>

// Success badge
<span className="bg-success/10 text-success-300 border border-success/30 px-3 py-1 rounded-md">
  Success
</span>
```

### 3. Use Semantic Colors

```jsx
// Success state
<div className="bg-success/10 text-success border border-success/30">
  Operation successful!
</div>

// Error state
<div className="bg-error/10 text-error border border-error/30">
  Something went wrong
</div>

// Warning state
<div className="bg-warning/10 text-warning border border-warning/30">
  Please review this
</div>
```

### 4. Apply Glow Effects

```jsx
// Primary glow
<button className="glow-primary bg-primary text-white">
  Glowing Button
</button>

// Secondary glow
<div className="glow-secondary rounded-lg p-4">
  Highlighted content
</div>

// Using Tailwind utility
<button className="shadow-glow hover:shadow-glow bg-primary">
  Custom Glow
</button>
```

### 5. Dark Mode Support

Dark mode is automatically applied via the `.dark` class:

```jsx
// Automatically adapts to dark mode
<div className="bg-card text-card-foreground">
  This card adapts to theme
</div>

// Explicit background
<div className="bg-background text-foreground">
  Background and foreground
</div>
```

## 🎯 Component Examples

### Button Variants

```jsx
// Primary
<button className="bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-glow">
  Primary Action
</button>

// Secondary
<button className="bg-secondary hover:bg-secondary-600 text-white px-6 py-3 rounded-lg font-semibold">
  Secondary Action
</button>

// Outline
<button className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-lg font-semibold">
  Outline Button
</button>

// Ghost
<button className="text-neutral-100 hover:bg-muted px-6 py-3 rounded-lg font-semibold">
  Ghost Button
</button>
```

### Form Elements

```jsx
// Input
<input 
  type="text"
  className="bg-card/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/20 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground"
  placeholder="Enter text..."
/>

// Textarea
<textarea
  className="bg-card/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/20 rounded-lg px-4 py-3 text-foreground w-full"
  rows={4}
/>

// Select
<select className="bg-card border border-border focus:border-primary rounded-lg px-4 py-3 text-foreground">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

### Cards

```jsx
// Standard card
<div className="bg-card border border-border/50 rounded-lg p-6 shadow-md">
  <h3 className="text-xl font-semibold text-foreground mb-2">Card Title</h3>
  <p className="text-muted-foreground">Card content goes here</p>
</div>

// Glass card
<div className="glass rounded-lg p-6">
  <h3 className="text-xl font-semibold text-primary-100">Glass Card</h3>
  <p className="text-neutral-300">Frosted glass effect</p>
</div>

// Elevated card
<div className="bg-card hover:bg-card/80 border border-primary/30 hover:border-primary/50 rounded-lg p-6 shadow-lg hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
  <h3 className="text-xl font-semibold">Interactive Card</h3>
  <p className="text-muted-foreground">Hover for effect</p>
</div>
```

### Badges

```jsx
// Primary badge
<span className="bg-primary/15 text-primary-300 border border-primary/30 px-3 py-1 rounded-md text-sm font-semibold">
  Primary
</span>

// Success badge
<span className="bg-success/15 text-success-300 border border-success/30 px-3 py-1 rounded-md text-sm font-semibold">
  Success
</span>

// Warning badge
<span className="bg-warning/15 text-warning-300 border border-warning/30 px-3 py-1 rounded-md text-sm font-semibold">
  Warning
</span>

// Error badge
<span className="bg-error/15 text-error-300 border border-error/30 px-3 py-1 rounded-md text-sm font-semibold">
  Error
</span>
```

### Alerts

```jsx
// Success alert
<div className="bg-success/10 border border-success/30 rounded-lg p-4 flex items-start gap-3">
  <svg className="w-5 h-5 text-success mt-0.5" />
  <div>
    <p className="font-semibold text-success-300">Success!</p>
    <p className="text-success-300/80">Operation completed successfully.</p>
  </div>
</div>

// Error alert
<div className="bg-error/10 border border-error/30 rounded-lg p-4 flex items-start gap-3">
  <svg className="w-5 h-5 text-error mt-0.5" />
  <div>
    <p className="font-semibold text-error-300">Error</p>
    <p className="text-error-300/80">Something went wrong.</p>
  </div>
</div>
```

## 📐 Typography

### Font Families

```jsx
// Headings (Poppins)
<h1 className="font-heading">Heading with Poppins</h1>

// Body text (Inter)
<p className="font-body">Body text with Inter</p>

// Code (JetBrains Mono)
<code className="font-mono">const code = "example";</code>
```

### Font Sizes

```jsx
<p className="text-xs">Extra small (12px)</p>
<p className="text-sm">Small (14px)</p>
<p className="text-base">Base (16px)</p>
<p className="text-lg">Large (18px)</p>
<p className="text-xl">Extra large (20px)</p>
<p className="text-2xl">2X large (24px)</p>
<p className="text-3xl">3X large (30px)</p>
<p className="text-4xl">4X large (36px)</p>
<p className="text-5xl">5X large (48px)</p>
<p className="text-6xl">6X large (60px)</p>
```

## ♿ Accessibility

All color combinations are WCAG AA compliant when used correctly:

### ✅ Safe for Body Text (< 18pt)
- `primary-100` to `primary-400` on dark backgrounds
- `neutral-100` to `neutral-400` on dark backgrounds
- White text on `primary-500+`, `secondary-400+`

### ✅ Safe for Large Text (≥ 18pt)
- All "PASS" combinations plus:
- `primary-500` to `primary-600` on surface colors
- `neutral-500` on surface colors

### ⚠️ Use with Caution
- `primary-500` on surface: Large text only (18pt+)
- `neutral-500` on surface: Large text only (18pt+)

See `accessibility-report.md` for complete details.

## 🎭 Effects & Animations

### Glassmorphism

```jsx
// Light glass
<div className="glass-light rounded-lg p-6">
  Light frosted glass
</div>

// Standard glass
<div className="glass rounded-lg p-6">
  Standard frosted glass
</div>

// Heavy glass
<div className="glass-heavy rounded-lg p-6">
  Heavy frosted glass
</div>
```

### Glow Effects

```jsx
// Primary glow
<div className="glow-primary rounded-lg p-6">
  Purple glow
</div>

// Secondary glow
<div className="glow-secondary rounded-lg p-6">
  Pink glow
</div>

// Accent glow
<div className="glow-accent rounded-lg p-6">
  Accent glow
</div>
```

### Animations

```jsx
// Fade in
<div className="animate-fade-in">Fades in</div>

// Slide up
<div className="animate-slide-up">Slides up</div>

// Scale in
<div className="animate-scale-in">Scales in</div>

// Glow animation
<div className="animate-glow">Pulsing glow</div>

// Float animation
<div className="animate-float">Floating</div>

// Shimmer animation
<div className="animate-shimmer">Shimmering</div>
```

## 🔧 Customization

### CSS Variables

All colors are available as CSS variables:

```css
/* Use directly in CSS */
.my-component {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border: 1px solid hsl(var(--border));
}

/* With opacity */
.my-semi-transparent {
  background: hsl(var(--primary) / 0.5);
}
```

### Tailwind Utilities

Create custom utilities in your `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    // Your custom extensions
  }
}
```

## 📦 Figma & Storybook Integration

Use `design-tokens.json` for:
- **Figma Tokens Plugin**: Import directly
- **Storybook**: Use with token documentation
- **CSS-in-JS**: Parse and use in styled-components/emotion

## 📚 Documentation

- **Full Brand Guidelines**: See `/docs/BRAND_GUIDELINES.md`
- **Accessibility Report**: See `src/design-system/accessibility-report.md`
- **Color System**: See `src/design-system/color-system.json`
- **Component Mappings**: See `src/design-system/component-color-map.json`

## 🆘 Support

For issues or questions:
1. Check the Brand Guidelines
2. Review the Accessibility Report
3. See component examples above
4. Open an issue in the repository

## 📝 License

Part of the FlashFusion platform. © 2026 FlashFusion. All rights reserved.
