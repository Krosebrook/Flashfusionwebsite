# FlashFusion Quick Reference Card

## 🎨 Essential Brand Colors (Copy-Paste Ready)

### Primary Palette (Main Actions)

```css
/* PRIMARY ORANGE - Main CTAs */
#FF7B00  /* Primary-500 - Main */
#FF9F33  /* Primary-400 - Hover light */
#E66A00  /* Primary-600 - Hover dark */
#FFF4E6  /* Primary-50 - Backgrounds */
#FFE8CC  /* Primary-100 - Light backgrounds */

/* SECONDARY CYAN - Secondary Actions */
#00B4D8  /* Secondary-500 - Main */
#33C3DF  /* Secondary-400 - Hover light */
#00A2C2  /* Secondary-600 - Hover dark */
#E6F7FB  /* Secondary-50 - Backgrounds */
#CCF0F7  /* Secondary-100 - Light backgrounds */

/* ACCENT MAGENTA - Special Features */
#E91E63  /* Accent-500 - Main */
#E74787  /* Accent-400 - Hover light */
#D11B59  /* Accent-600 - Hover dark */
#FCE8F0  /* Accent-50 - Backgrounds */
#F9D1E1  /* Accent-100 - Light backgrounds */
```

### Background System

```css
#0F172A  /* bg-dark - Primary page background */
#1E293B  /* surface - Cards, panels */
#334155  /* surface-light - Elevated cards */
```

### Text Colors

```css
#FFFFFF  /* text-primary - Main text (15.8:1 contrast ✅) */
#CBD5E1  /* text-secondary - Secondary text (11.6:1 ✅) */
#94A3B8  /* text-muted - Muted text, placeholders (6.2:1 ✅) */
```

### Semantic Colors

```css
/* SUCCESS */
#10B981  /* success-500 - Success states */
#ECFDF5  /* success-50 - Success backgrounds */

/* WARNING */
#F59E0B  /* warning-500 - Warning states */
#FFFBEB  /* warning-50 - Warning backgrounds */

/* ERROR */
#EF4444  /* error-500 - Error states */
#FEF2F2  /* error-50 - Error backgrounds */

/* INFO */
#3B82F6  /* info-500 - Info states */
#EFF6FF  /* info-50 - Info backgrounds */
```

---

## 🎯 Component Class Quick Reference

### Buttons (Always Explicit Styling)

```tsx
/* PRIMARY - Most important actions */
<Button className="ff-btn-primary ff-hover-glow bg-gradient-to-r from-[#FF9F33] to-[#FF7B00] text-white font-semibold px-6 py-3 rounded-xl">
  Get Started Free
</Button>

/* SECONDARY - Alternative actions */
<Button className="ff-btn-secondary bg-gradient-to-r from-[#33C3DF] to-[#00B4D8] text-white font-semibold px-6 py-3 rounded-xl">
  Learn More
</Button>

/* ACCENT - Special features */
<Button className="ff-btn-accent bg-gradient-to-r from-[#E74787] to-[#E91E63] text-white font-semibold px-6 py-3 rounded-xl">
  Upgrade to Pro
</Button>

/* GHOST - Minimal */
<Button variant="ghost" className="border border-[#CBD5E1]/20 text-[#CBD5E1] hover:bg-white/5 px-6 py-3 rounded-xl">
  Cancel
</Button>
```

### Cards (Explicit Styling Override)

```tsx
/* INTERACTIVE CARD */
<Card className="bg-[#1E293B] border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-[#FF7B00] hover:-translate-y-1 hover:shadow-xl">
  <CardContent className="space-y-4">
    {/* Content */}
  </CardContent>
</Card>

/* PRICING CARD */
<Card className="bg-[#1E293B] border-2 border-[#FF7B00] rounded-2xl p-8 shadow-[0_0_30px_rgba(255,123,0,0.2)] scale-105">
  <CardHeader className="space-y-2">
    <Badge className="bg-[#E91E63]/20 text-[#E91E63] border-[#E91E63]/30 px-3 py-1 rounded-full text-xs font-semibold">
      Most Popular
    </Badge>
  </CardHeader>
</Card>
```

### Form Inputs (Override Defaults)

```tsx
/* TEXT INPUT */
<Input 
  className="bg-[#1E293B] border border-[#CBD5E1]/20 rounded-lg px-4 py-3 text-white placeholder:text-[#94A3B8] focus:border-[#FF7B00] focus:ring-2 focus:ring-[#FF7B00]/30 focus:outline-none"
  placeholder="Enter your email..."
/>

/* TEXTAREA */
<Textarea 
  className="bg-[#1E293B] border border-[#CBD5E1]/20 rounded-lg px-4 py-3 text-white placeholder:text-[#94A3B8] focus:border-[#FF7B00] focus:ring-2 focus:ring-[#FF7B00]/30 focus:outline-none min-h-[120px]"
  placeholder="Describe your project..."
/>

/* SELECT */
<Select>
  <SelectTrigger className="bg-[#1E293B] border border-[#CBD5E1]/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7B00] focus:ring-2 focus:ring-[#FF7B00]/30">
    <SelectValue placeholder="Choose option..." />
  </SelectTrigger>
  <SelectContent className="bg-[#1E293B] border border-white/10 rounded-lg shadow-2xl">
    <SelectItem value="1" className="text-white hover:bg-[#334155] px-3 py-2">
      Option 1
    </SelectItem>
  </SelectContent>
</Select>
```

### Badges (Explicit Colors)

```tsx
/* SUCCESS BADGE */
<Badge className="bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30 px-3 py-1 rounded-full text-xs font-semibold">
  ✓ Active
</Badge>

/* WARNING BADGE */
<Badge className="bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30 px-3 py-1 rounded-full text-xs font-semibold">
  ⚠ Pending
</Badge>

/* ERROR BADGE */
<Badge className="bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30 px-3 py-1 rounded-full text-xs font-semibold">
  ✗ Failed
</Badge>

/* PRO BADGE */
<Badge className="bg-gradient-to-r from-[#E91E63] to-[#FF7B00] text-white px-3 py-1 rounded-full text-xs font-bold">
  PRO
</Badge>
```

---

## 📝 Typography (Explicit Font Families)

```tsx
/* HEADING (Sora) */
<h1 className="text-5xl font-bold" style={{ fontFamily: "'Sora', sans-serif" }}>
  <span className="bg-gradient-to-r from-[#FF7B00] via-[#00B4D8] to-[#E91E63] bg-clip-text text-transparent">
    FlashFusion
  </span>
</h1>

/* SUBHEADING (Sora) */
<h2 className="text-3xl font-semibold" style={{ fontFamily: "'Sora', sans-serif" }}>
  Powerful Features
</h2>

/* BODY TEXT (Inter) */
<p className="text-base text-[#CBD5E1] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
  FlashFusion transforms ideas into production-ready applications.
</p>

/* CODE (JetBrains Mono) */
<code className="bg-[#1E293B] text-[#00B4D8] px-2 py-1 rounded text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
  npm install flashfusion
</code>
```

---

## 🎬 Animations (Ready to Use)

```tsx
/* PAGE ENTRANCE */
<div className="ff-fade-in-up">
  {/* Content fades in from bottom */}
</div>

/* STAGGERED GRID */
<div className="grid grid-cols-3 gap-6 ff-stagger-fade">
  <Card /> {/* Appears at 0ms */}
  <Card /> {/* Appears at 100ms */}
  <Card /> {/* Appears at 200ms */}
</div>

/* HOVER GLOW */
<Button className="ff-btn-primary ff-hover-glow">
  {/* Glows orange on hover */}
</Button>

/* HOVER LIFT */
<Card className="ff-card-interactive ff-hover-lift">
  {/* Lifts up 4px on hover */}
</Card>

/* PULSE ATTENTION */
<div className="ff-pulse-glow">
  {/* Pulses to grab attention */}
</div>
```

---

## 📏 Spacing (Explicit Values)

```tsx
/* COMPONENT SPACING */
padding: 0.5rem;    /* 8px - xs */
padding: 0.75rem;   /* 12px - sm */
padding: 1rem;      /* 16px - md */
padding: 1.5rem;    /* 24px - lg */
padding: 2rem;      /* 32px - xl */

/* SECTION SPACING */
padding: 4rem 0;    /* 64px - Section padding */
padding: 6rem 0;    /* 96px - Large section padding */
padding: 8rem 0;    /* 128px - Hero section padding */

/* GAPS */
gap: 1rem;          /* 16px - Default gap */
gap: 1.5rem;        /* 24px - Medium gap */
gap: 2rem;          /* 32px - Large gap */
```

---

## 🔧 Critical Override Rules

### ⚠️ IMPORTANT: Always Override Shadcn Defaults

Shadcn components come with default styling. **Always explicitly set:**

```tsx
// ❌ BAD - Uses Shadcn defaults
<Button>Click Me</Button>

// ✅ GOOD - Explicit FlashFusion styling
<Button className="bg-gradient-to-r from-[#FF9F33] to-[#FF7B00] text-white font-semibold px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(255,123,0,0.5)]">
  Click Me
</Button>
```

### Required Explicit Properties

**Always specify these explicitly:**

1. **Background colors** - Don't rely on defaults
   ```tsx
   className="bg-[#1E293B]"
   ```

2. **Text colors** - Always explicit
   ```tsx
   className="text-[#FFFFFF]"
   ```

3. **Font families** - Use inline styles for fonts
   ```tsx
   style={{ fontFamily: "'Sora', sans-serif" }}
   ```

4. **Borders** - Specify color and width
   ```tsx
   className="border border-[#CBD5E1]/20"
   ```

5. **Spacing** - Don't rely on component defaults
   ```tsx
   className="px-6 py-3 space-y-4"
   ```

6. **Border radius** - Always explicit
   ```tsx
   className="rounded-xl"
   ```

7. **Focus states** - Override Shadcn defaults
   ```tsx
   className="focus:border-[#FF7B00] focus:ring-2 focus:ring-[#FF7B00]/30 focus:outline-none"
   ```

---

## 🎯 Common Patterns (Copy-Paste)

### Hero Section

```tsx
<section className="py-20 md:py-32 bg-gradient-to-br from-[#FF7B00]/10 via-transparent to-[#00B4D8]/10">
  <div className="container mx-auto px-4 max-w-7xl">
    <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: "'Sora', sans-serif" }}>
      <span className="bg-gradient-to-r from-[#FF7B00] via-[#00B4D8] to-[#E91E63] bg-clip-text text-transparent">
        FlashFusion
      </span>
    </h1>
    <p className="text-xl text-[#CBD5E1] mb-8 max-w-2xl" style={{ fontFamily: "'Inter', sans-serif" }}>
      Transform ideas into production-ready applications
    </p>
    <Button className="ff-btn-primary ff-hover-glow bg-gradient-to-r from-[#FF9F33] to-[#FF7B00] text-white font-semibold px-8 py-4 rounded-xl">
      Get Started Free →
    </Button>
  </div>
</section>
```

### Feature Card Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ff-stagger-fade">
  {features.map((feature, idx) => (
    <Card key={idx} className="bg-[#1E293B] border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-[#FF7B00] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
      <div className="w-12 h-12 bg-gradient-to-br from-[#FF7B00] to-[#E91E63] rounded-xl flex items-center justify-center mb-4">
        <feature.icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
        {feature.title}
      </h3>
      <p className="text-[#CBD5E1]" style={{ fontFamily: "'Inter', sans-serif" }}>
        {feature.description}
      </p>
    </Card>
  ))}
</div>
```

### Form Section

```tsx
<form onSubmit={handleSubmit} className="space-y-6 max-w-md">
  <div className="space-y-2">
    <label htmlFor="email" className="block text-sm font-medium text-[#FFFFFF]" style={{ fontFamily: "'Sora', sans-serif" }}>
      Email Address
    </label>
    <Input
      id="email"
      type="email"
      placeholder="you@example.com"
      className="w-full bg-[#1E293B] border border-[#CBD5E1]/20 rounded-lg px-4 py-3 text-white placeholder:text-[#94A3B8] focus:border-[#FF7B00] focus:ring-2 focus:ring-[#FF7B00]/30 focus:outline-none"
      style={{ fontFamily: "'Inter', sans-serif" }}
    />
  </div>
  
  <Button 
    type="submit"
    className="w-full bg-gradient-to-r from-[#FF9F33] to-[#FF7B00] text-white font-semibold px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(255,123,0,0.5)] transition-all"
    style={{ fontFamily: "'Sora', sans-serif" }}
  >
    Submit
  </Button>
</form>
```

---

## 🚨 Common Mistakes to Avoid

### ❌ DON'T

```tsx
// Don't use Tailwind text-* classes for font size/weight
<h1 className="text-2xl font-bold">Title</h1>

// Don't rely on component defaults
<Button>Click</Button>

// Don't forget font families
<p className="text-white">Text</p>

// Don't use generic colors
<div className="bg-blue-500">Content</div>
```

### ✅ DO

```tsx
// Use semantic HTML, explicit styling
<h1 className="text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
  Title
</h1>

// Always explicit FlashFusion classes
<Button className="ff-btn-primary bg-gradient-to-r from-[#FF9F33] to-[#FF7B00] text-white font-semibold px-6 py-3 rounded-xl">
  Click
</Button>

// Always specify font family
<p className="text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
  Text
</p>

// Use exact brand colors
<div className="bg-[#FF7B00]">Content</div>
```

---

## 📦 Component Checklist

Before shipping any component, verify:

- [ ] Background color explicitly set (not default)
- [ ] Text color explicitly set (not default)
- [ ] Font family specified with inline style
- [ ] Spacing/padding explicitly defined
- [ ] Border radius matches FlashFusion system
- [ ] Focus states override Shadcn defaults
- [ ] Hover effects use FlashFusion classes
- [ ] Colors use exact hex values (not approximations)
- [ ] Animations use ff-* classes
- [ ] Responsive breakpoints implemented

---

## 🎨 Color Psychology Guide

**When to use which color:**

| Color | Use For | Example |
|-------|---------|---------|
| **Orange (#FF7B00)** | Primary CTAs, important actions | "Get Started", "Deploy Now", active states |
| **Cyan (#00B4D8)** | Secondary actions, info | "Learn More", "Documentation", info badges |
| **Magenta (#E91E63)** | Premium features, special | "Pro" badge, featured cards, upgrades |
| **Green (#10B981)** | Success, confirmation | "Success!", checkmarks, completed |
| **Amber (#F59E0B)** | Warnings, caution | "Warning", pending states |
| **Red (#EF4444)** | Errors, destructive | "Error", delete actions, failures |

---

**Print this card, bookmark it, pin it to your wall!** 📌

All styling must be **explicit** to override Shadcn/base component defaults. When in doubt, check `Guidelines.md` and this reference card.
