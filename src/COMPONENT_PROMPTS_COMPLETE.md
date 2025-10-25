# FlashFusion Component Implementation Prompts

## Complete Context-Engineered Prompts for Every Component

---

## 🎨 CORE DESIGN SYSTEM

### Fonts & Typography
```css
/* Actual FlashFusion Typography Stack */
--ff-font-primary: 'Sora', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
--ff-font-secondary: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
--ff-font-mono: 'JetBrains Mono', 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
```

**Usage:**
- **Headings, labels, buttons**: Sora (geometric sans-serif, modern tech feel)
- **Body text, paragraphs**: Inter (highly readable, UI-optimized)
- **Code blocks, terminals**: JetBrains Mono (developer-friendly, clear monospace)

### Color Palette
```typescript
const FlashFusionColors = {
  // Primary Brand
  primary: '#FF7B00',    // Orange - CTAs, primary actions
  secondary: '#00B4D8',  // Cyan - secondary actions, accents  
  accent: '#E91E63',     // Magenta - highlights, special elements
  
  // Backgrounds
  bgDark: '#0F172A',     // Primary background
  surface: '#1E293B',    // Card backgrounds
  surfaceLight: '#334155', // Elevated surfaces
  
  // Text
  textPrimary: '#FFFFFF',   // Primary text
  textSecondary: '#CBD5E1', // Secondary text
  textMuted: '#94A3B8',     // Muted text
  
  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};
```

---

## 📦 BUTTON COMPONENTS

### Primary Button
```tsx
/**
 * FlashFusion Primary Button - Main CTAs
 * Use for: Primary actions, main conversions, key interactions
 */
<Button className="ff-btn-primary ff-hover-glow">
  Generate Code
</Button>

// CSS Implementation:
.ff-btn-primary {
  background: linear-gradient(135deg, #FF9F33 0%, #FF7B00 100%);
  color: white;
  font-family: var(--ff-font-primary); // Sora
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;
}

.ff-btn-primary:hover {
  background: linear-gradient(135deg, #FF8F1F 0%, #FF7B00 100%);
  box-shadow: 0 0 20px rgba(255, 123, 0, 0.5);
  transform: translateY(-1px);
}

.ff-btn-primary:active {
  transform: translateY(0);
}

.ff-btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Secondary Button
```tsx
/**
 * FlashFusion Secondary Button - Alternative actions
 * Use for: Secondary actions, cancellations, alternative paths
 */
<Button className="ff-btn-secondary ff-hover-glow-secondary">
  Save Draft
</Button>

.ff-btn-secondary {
  background: linear-gradient(135deg, #33C3DF 0%, #00B4D8 100%);
  color: white;
  font-family: var(--ff-font-primary);
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.ff-btn-secondary:hover {
  background: linear-gradient(135deg, #1FC7ED 0%, #00B4D8 100%);
  box-shadow: 0 0 20px rgba(0, 180, 216, 0.4);
  transform: translateY(-1px);
}
```

### Accent Button
```tsx
/**
 * FlashFusion Accent Button - Special features
 * Use for: Premium features, upgrades, special actions
 */
<Button className="ff-btn-accent ff-hover-glow-accent">
  Upgrade to Pro ✨
</Button>

.ff-btn-accent {
  background: linear-gradient(135deg, #E74787 0%, #E91E63 100%);
  color: white;
  font-family: var(--ff-font-primary);
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
}

.ff-btn-accent:hover {
  background: linear-gradient(135deg, #ED75A5 0%, #E91E63 100%);
  box-shadow: 0 0 20px rgba(233, 30, 99, 0.4);
  transform: translateY(-1px);
}
```

### Ghost Button
```tsx
/**
 * Ghost Button - Minimal emphasis
 * Use for: Tertiary actions, navigation, back buttons
 */
<Button variant="ghost" className="ff-btn-ghost">
  Cancel
</Button>

.ff-btn-ghost {
  background: transparent;
  border: 1px solid rgba(203, 213, 225, 0.2);
  color: var(--ff-text-secondary);
  font-family: var(--ff-font-primary);
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
}

.ff-btn-ghost:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(203, 213, 225, 0.3);
  color: var(--ff-text-primary);
}
```

---

## 🎴 CARD COMPONENTS

### Interactive Card
```tsx
/**
 * FlashFusion Interactive Card - Hover-responsive cards
 * Use for: Feature cards, tool cards, clickable content
 */
<Card className="ff-card-interactive ff-hover-lift">
  <CardHeader>
    <CardTitle>Feature Name</CardTitle>
  </CardHeader>
  <CardContent>
    Feature description...
  </CardContent>
</Card>

.ff-card-interactive {
  background: var(--ff-surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.ff-card-interactive:hover {
  transform: translateY(-4px);
  border-color: var(--ff-primary);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 123, 0, 0.2);
}
```

### Pricing Card
```tsx
/**
 * Pricing Card - Subscription tier display
 * Use for: Pricing pages, plan comparisons
 */
<Card className="ff-pricing-card" data-featured={tier === 'Pro'}>
  <CardHeader>
    {featured && <Badge className="ff-badge-featured">Most Popular</Badge>}
    <CardTitle className="text-2xl">{tierName}</CardTitle>
    <div className="ff-price">
      <span className="text-5xl font-bold">${price}</span>
      <span className="text-muted">/month</span>
    </div>
  </CardHeader>
  <CardContent>
    <ul className="space-y-3">
      {features.map(feature => (
        <li className="flex items-start gap-2">
          <Check className="w-5 h-5 text-success mt-0.5" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  </CardContent>
  <CardFooter>
    <Button className="ff-btn-primary w-full">
      Get Started
    </Button>
  </CardFooter>
</Card>

.ff-pricing-card {
  background: var(--ff-surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 2rem;
  transition: all 300ms ease;
}

.ff-pricing-card[data-featured="true"] {
  border-color: var(--ff-primary);
  box-shadow: 0 0 30px rgba(255, 123, 0, 0.2);
  transform: scale(1.05);
  z-index: 10;
}

.ff-badge-featured {
  background: var(--ff-gradient-accent);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}
```

---

## 📝 FORM COMPONENTS

### Input Field
```tsx
/**
 * FlashFusion Input - Form text inputs
 * Use for: Text entry, email, password fields
 */
<div className="ff-form-field">
  <Label htmlFor="email">Email Address</Label>
  <Input 
    id="email"
    type="email"
    className="ff-focus-ring"
    placeholder="you@example.com"
  />
</div>

.ff-form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ff-focus-ring {
  background: var(--ff-surface);
  border: 1px solid rgba(203, 213, 225, 0.2);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  color: var(--ff-text-primary);
  font-family: var(--ff-font-secondary);
  transition: all 200ms ease;
}

.ff-focus-ring:focus {
  outline: none;
  border-color: var(--ff-primary);
  box-shadow: 0 0 0 3px rgba(255, 123, 0, 0.1);
}

.ff-focus-ring::placeholder {
  color: var(--ff-text-muted);
}
```

### Textarea
```tsx
/**
 * FlashFusion Textarea - Multi-line text input
 * Use for: Long-form text, descriptions, comments
 */
<div className="ff-form-field">
  <Label htmlFor="description">Description</Label>
  <Textarea 
    id="description"
    className="ff-focus-ring"
    rows={4}
    placeholder="Enter details..."
  />
</div>

/* Inherits .ff-focus-ring styles + */
textarea.ff-focus-ring {
  min-height: 6rem;
  resize: vertical;
  font-family: var(--ff-font-secondary);
}
```

### Select Dropdown
```tsx
/**
 * FlashFusion Select - Dropdown selection
 * Use for: Option selection, category filters
 */
<Select>
  <SelectTrigger className="ff-focus-ring">
    <SelectValue placeholder="Select option..." />
  </SelectTrigger>
  <SelectContent className="ff-dropdown">
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>

.ff-dropdown {
  background: var(--ff-surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 0.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.ff-dropdown [role="option"] {
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 150ms ease;
}

.ff-dropdown [role="option"]:hover {
  background: var(--ff-surface-light);
}

.ff-dropdown [role="option"][data-state="checked"] {
  background: rgba(255, 123, 0, 0.1);
  color: var(--ff-primary);
}
```

---

## 🎯 NAVIGATION COMPONENTS

### Site Header
```tsx
/**
 * FlashFusion Navigation Header - Site-wide navigation
 * Sticky, glassmorphic header with mobile menu
 */
<header className="ff-site-header">
  <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
    {/* Logo */}
    <Link to="/" className="ff-logo">
      <FlashFusionIcon className="h-8 w-8" />
      <span className="ff-text-gradient font-bold text-xl">
        FlashFusion
      </span>
    </Link>

    {/* Desktop Nav */}
    <div className="hidden md:flex items-center gap-8">
      <NavLink to="/features" className="ff-nav-link">
        Features
      </NavLink>
      <NavLink to="/pricing" className="ff-nav-link">
        Pricing
      </NavLink>
      <NavLink to="/demo" className="ff-nav-link">
        Demo
      </NavLink>
      
      <div className="w-px h-6 bg-border" />
      
      <Button variant="ghost" to="/signin">
        Sign In
      </Button>
      <Button className="ff-btn-primary" to="/signup">
        Get Started
      </Button>
    </div>

    {/* Mobile Menu Button */}
    <Button 
      variant="ghost" 
      className="md:hidden"
      onClick={() => setMobileMenuOpen(true)}
    >
      <Menu className="h-6 w-6" />
    </Button>
  </nav>
</header>

.ff-site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.ff-nav-link {
  color: var(--ff-text-secondary);
  font-family: var(--ff-font-primary);
  font-weight: 500;
  font-size: 0.9375rem;
  transition: color 200ms ease;
  position: relative;
}

.ff-nav-link::after {
  content: '';
  position: absolute;
  bottom: -0.25rem;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--ff-primary);
  transform: scaleX(0);
  transition: transform 200ms ease;
}

.ff-nav-link:hover {
  color: var(--ff-text-primary);
}

.ff-nav-link:hover::after,
.ff-nav-link.active::after {
  transform: scaleX(1);
}
```

### Back Button
```tsx
/**
 * FlashFusion Back Button - Page navigation
 * Use for: Returning to parent pages
 */
export function BackButton({ 
  to = '/', 
  label = 'Back to Home' 
}: BackButtonProps) {
  const navigate = useNavigate();
  
  return (
    <Button
      variant="ghost"
      onClick={() => to ? navigate(to) : navigate(-1)}
      className="ff-back-button group mb-4"
    >
      <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
      <span className="font-medium">{label}</span>
    </Button>
  );
}

.ff-back-button {
  color: var(--ff-text-secondary);
  font-family: var(--ff-font-primary);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 200ms ease;
}

.ff-back-button:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--ff-text-primary);
}
```

---

## 🎨 TEXT & TYPOGRAPHY COMPONENTS

### Gradient Heading
```tsx
/**
 * FlashFusion Gradient Text - Brand gradient headlines
 * Use for: Hero headings, section titles, brand text
 */
<h1 className="ff-text-gradient text-5xl font-bold">
  FlashFusion
</h1>

.ff-text-gradient {
  background: linear-gradient(
    135deg,
    #FF7B00 0%,
    #00B4D8 50%,
    #E91E63 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: var(--ff-font-primary); // Sora
}
```

### Code Block
```tsx
/**
 * FlashFusion Code Block - Syntax highlighting
 * Use for: Code snippets, terminal output
 */
<pre className="ff-code-block">
  <code className="language-typescript">
    {codeString}
  </code>
</pre>

.ff-code-block {
  background: var(--ff-surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 1.5rem;
  overflow-x: auto;
  font-family: var(--ff-font-mono); // JetBrains Mono
  font-size: 0.875rem;
  line-height: 1.7;
}

.ff-code-block code {
  color: var(--ff-text-secondary);
}
```

---

## 🔔 NOTIFICATION & FEEDBACK COMPONENTS

### Toast Notification
```tsx
/**
 * FlashFusion Toast - Temporary notifications
 * Use for: Success messages, errors, info alerts
 */
import { toast } from 'sonner';

// Success
toast.success('Code generated successfully!', {
  className: 'ff-toast-success',
  duration: 3000,
});

// Error
toast.error('Generation failed. Please try again.', {
  className: 'ff-toast-error',
  duration: 4000,
});

// Info
toast.info('Processing your request...', {
  className: 'ff-toast-info',
});

.ff-toast-success {
  background: var(--ff-success) !important;
  color: white !important;
  border: none !important;
  font-family: var(--ff-font-primary);
  font-weight: 600;
}

.ff-toast-error {
  background: var(--ff-error) !important;
  color: white !important;
  border: none !important;
  font-family: var(--ff-font-primary);
  font-weight: 600;
}

.ff-toast-info {
  background: var(--ff-secondary) !important;
  color: white !important;
  border: none !important;
  font-family: var(--ff-font-primary);
  font-weight: 600;
}
```

### Loading Spinner
```tsx
/**
 * FlashFusion Loading Spinner - Async operations
 * Use for: Data fetching, processing, waiting states
 */
<div className="ff-loader-container">
  <Loader2 className="h-8 w-8 animate-spin ff-loader-icon" />
  <p className="ff-loader-text">FlashFusion is generating...</p>
</div>

.ff-loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

.ff-loader-icon {
  color: var(--ff-primary);
}

.ff-loader-text {
  color: var(--ff-text-secondary);
  font-family: var(--ff-font-primary);
  font-weight: 500;
  animation: pulse 2s ease-in-out infinite;
}
```

---

## 📊 DATA DISPLAY COMPONENTS

### Feature List
```tsx
/**
 * Feature List - Checkmark list with icons
 * Use for: Pricing features, capability lists
 */
<ul className="ff-feature-list">
  {features.map((feature, idx) => (
    <li key={idx} className="ff-feature-item">
      <Check className="ff-feature-icon" />
      <span className="ff-feature-text">{feature}</span>
    </li>
  ))}
</ul>

.ff-feature-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ff-feature-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.ff-feature-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--ff-success);
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.ff-feature-text {
  color: var(--ff-text-secondary);
  font-family: var(--ff-font-secondary);
  font-size: 0.9375rem;
  line-height: 1.5;
}
```

### Stats Display
```tsx
/**
 * FlashFusion Stats - Metric display
 * Use for: Analytics, dashboard metrics, statistics
 */
<div className="ff-stat-card">
  <div className="ff-stat-icon">
    <Zap className="h-6 w-6" />
  </div>
  <div className="ff-stat-content">
    <div className="ff-stat-value">10,000+</div>
    <div className="ff-stat-label">Active Developers</div>
  </div>
</div>

.ff-stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--ff-surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
}

.ff-stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, var(--ff-primary-400) 0%, var(--ff-primary-600) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.ff-stat-value {
  font-size: 2rem;
  font-weight: 700;
  font-family: var(--ff-font-primary);
  color: var(--ff-text-primary);
  line-height: 1;
}

.ff-stat-label {
  font-size: 0.875rem;
  color: var(--ff-text-muted);
  font-family: var(--ff-font-secondary);
  margin-top: 0.25rem;
}
```

---

## 🎬 ANIMATION COMPONENTS

### Fade In Up (Default Entrance)
```tsx
/**
 * Fade In Up Animation - Default entrance
 * Use for: Page sections, cards, content reveals
 */
<div className="ff-fade-in-up">
  {content}
</div>

.ff-fade-in-up {
  animation: fadeInUp 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Staggered Children
```tsx
/**
 * Staggered Animation - Sequential reveals
 * Use for: Feature grids, pricing cards, lists
 */
<div className="ff-stagger-fade">
  <Card />
  <Card />
  <Card />
  <Card />
</div>

.ff-stagger-fade > * {
  opacity: 0;
  animation: fadeInUp 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.ff-stagger-fade > *:nth-child(1) { animation-delay: 0ms; }
.ff-stagger-fade > *:nth-child(2) { animation-delay: 100ms; }
.ff-stagger-fade > *:nth-child(3) { animation-delay: 200ms; }
.ff-stagger-fade > *:nth-child(4) { animation-delay: 300ms; }
/* ... up to 8 children */
```

### Pulse Glow (Attention)
```tsx
/**
 * Pulse Glow Animation - Attention grabber
 * Use for: CTAs, new features, important elements
 */
<Button className="ff-btn-primary ff-pulse-glow">
  Try New Feature
</Button>

.ff-pulse-glow {
  animation: pulseGlow 2s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 123, 0, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(255, 123, 0, 0);
  }
}
```

---

## 📱 RESPONSIVE PATTERNS

### Mobile Navigation
```tsx
/**
 * Mobile Menu - Sheet-based mobile navigation
 */
<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
  <SheetContent side="right" className="ff-mobile-menu">
    <SheetHeader>
      <SheetTitle className="ff-text-gradient">
        FlashFusion
      </SheetTitle>
    </SheetHeader>
    
    <nav className="ff-mobile-nav">
      <NavLink to="/features">Features</NavLink>
      <NavLink to="/pricing">Pricing</NavLink>
      <NavLink to="/demo">Demo</NavLink>
      <NavLink to="/faq">FAQ</NavLink>
      
      <Separator className="my-4" />
      
      <Button variant="ghost" to="/signin" className="w-full">
        Sign In
      </Button>
      <Button className="ff-btn-primary w-full" to="/signup">
        Get Started
      </Button>
    </nav>
  </SheetContent>
</Sheet>

.ff-mobile-menu {
  background: var(--ff-bg-dark);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.ff-mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 2rem;
}

.ff-mobile-nav a {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: var(--ff-text-secondary);
  font-family: var(--ff-font-primary);
  font-weight: 500;
  transition: all 200ms ease;
}

.ff-mobile-nav a:hover {
  background: var(--ff-surface);
  color: var(--ff-text-primary);
}
```

### Responsive Grid
```tsx
/**
 * Responsive Grid - Mobile-first grid system
 */
// 1 column mobile, 2 tablet, 3 desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => <Card key={item.id} />)}
</div>

// 1 column mobile, 2 tablet, 4 desktop (pricing)
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
  {pricingTiers.map(tier => <PricingCard key={tier.id} />)}
</div>

// Two-column layout
<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
  <LeftColumn />
  <RightColumn />
</div>
```

---

## ♿ ACCESSIBILITY PATTERNS

### Skip Link
```tsx
/**
 * Skip to Main Content - Screen reader navigation
 */
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only ff-skip-link"
>
  Skip to main content
</a>

<main id="main-content">
  {/* Page content */}
</main>

.ff-skip-link:focus {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  padding: 1rem 2rem;
  background: var(--ff-primary);
  color: white;
  font-family: var(--ff-font-primary);
  font-weight: 600;
  text-decoration: none;
}
```

### ARIA Live Region
```tsx
/**
 * Live Region - Dynamic content announcements
 */
<div 
  role="status" 
  aria-live="polite" 
  aria-atomic="true"
  className="sr-only"
>
  {statusMessage}
</div>
```

### Keyboard Navigation
```tsx
/**
 * Keyboard Accessible Div - Interactive non-button elements
 */
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
  className="ff-interactive"
>
  Interactive Element
</div>

.ff-interactive:focus-visible {
  outline: 2px solid var(--ff-primary);
  outline-offset: 2px;
}
```

---

## 🎯 USAGE GUIDELINES

### Component Selection Matrix

| Use Case | Component | Class |
|----------|-----------|-------|
| Primary CTA | Button | `.ff-btn-primary` |
| Secondary action | Button | `.ff-btn-secondary` |
| Premium feature | Button | `.ff-btn-accent` |
| Feature card | Card | `.ff-card-interactive` |
| Pricing tier | Card | `.ff-pricing-card` |
| Text input | Input | `.ff-focus-ring` |
| Long text | Textarea | `.ff-focus-ring` |
| Page entrance | Div | `.ff-fade-in-up` |
| Grid reveal | Div | `.ff-stagger-fade` |
| Hero heading | H1 | `.ff-text-gradient` |
| Code display | Pre/Code | `.ff-code-block` |

### Consistency Rules

1. **Always use FF classes** - Never create custom styles that duplicate FF components
2. **Respect the hierarchy** - Primary > Secondary > Accent > Ghost
3. **Follow font families** - Sora for UI, Inter for content, JetBrains Mono for code
4. **Use semantic colors** - Success (green), Warning (amber), Error (red), Info (cyan)
5. **Add hover effects** - `.ff-hover-glow`, `.ff-hover-lift`, `.ff-hover-scale`
6. **Include focus states** - `.ff-focus-ring` on all interactive elements
7. **Animate entrances** - `.ff-fade-in-up` for page content
8. **Stagger children** - `.ff-stagger-fade` for grids

---

## 📝 QUICK REFERENCE

### Most Common Patterns

```tsx
// Hero Section
<section className="ff-fade-in-up">
  <h1 className="ff-text-gradient text-5xl">FlashFusion</h1>
  <p className="text-xl text-text-secondary">Tagline</p>
  <Button className="ff-btn-primary ff-hover-glow">
    Get Started
  </Button>
</section>

// Feature Grid
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 ff-stagger-fade">
  {features.map(f => (
    <Card key={f.id} className="ff-card-interactive ff-hover-lift">
      <CardHeader>
        <CardTitle>{f.title}</CardTitle>
      </CardHeader>
      <CardContent>{f.description}</CardContent>
    </Card>
  ))}
</div>

// Form
<form className="space-y-4">
  <div className="ff-form-field">
    <Label htmlFor="email">Email</Label>
    <Input 
      id="email" 
      type="email" 
      className="ff-focus-ring"
    />
  </div>
  <Button type="submit" className="ff-btn-primary w-full">
    Submit
  </Button>
</form>

// Navigation
<header className="ff-site-header">
  <nav className="container mx-auto flex justify-between">
    <Link to="/" className="ff-logo">
      <span className="ff-text-gradient">FlashFusion</span>
    </Link>
    <div className="flex gap-8">
      <NavLink to="/features" className="ff-nav-link">
        Features
      </NavLink>
      <Button className="ff-btn-primary">Sign Up</Button>
    </div>
  </nav>
</header>
```

---

**End of Component Prompts** - Use these patterns throughout FlashFusion for consistency! 🚀
