# FlashFusion Progressive Web App - Complete Replication Prompt

## Context Engineering Prompt for AI-Powered Recreation

Use this prompt to recreate the FlashFusion platform with identical design, structure, and functionality.

---

## 🎯 Project Overview

Create a **comprehensive AI-powered development platform** called **FlashFusion** - an intelligent assistant that transforms ideas into production-ready applications through advanced AI orchestration. The platform features:

- **Multi-agent AI orchestration** with 60+ integrated tools
- **Creator commerce hub** with print-on-demand and marketplace integration
- **Full-stack development tools** with code generation and deployment
- **Business intelligence** and analytics dashboards
- **Gamification system** with XP progression and achievements
- **Progressive Web App** architecture with offline support

---

## 🎨 Design System & Branding

### Core Brand Identity

**FlashFusion** is positioned as a premium, cutting-edge AI development assistant with a modern, tech-forward aesthetic.

### Color Palette (AI Assistant Theme)

```css
/* Primary Colors */
--primary-orange: #FF7B00;      /* Main brand color - CTAs, primary actions */
--secondary-cyan: #00B4D8;      /* Secondary actions, accents */
--accent-magenta: #E91E63;      /* Highlights, special elements */

/* Background Colors */
--bg-dark-navy: #0F172A;        /* Primary background */
--surface-slate: #1E293B;       /* Card backgrounds, surfaces */
--surface-lighter: #334155;     /* Elevated surfaces */

/* Text Colors */
--text-primary: #FFFFFF;        /* Primary text */
--text-secondary: #CBD5E1;      /* Secondary text */
--text-muted: #94A3B8;          /* Muted text, placeholders */

/* Utility Colors */
--success-green: #10B981;       /* Success states */
--warning-amber: #F59E0B;       /* Warnings */
--error-red: #EF4444;           /* Errors */
--info-blue: #3B82F6;           /* Info messages */
```

### Typography System

```css
/* Font Families */
--font-primary: 'Sora', sans-serif;           /* Headings, labels, buttons */
--font-secondary: 'Inter', sans-serif;        /* Body text, paragraphs */
--font-mono: 'JetBrains Mono', monospace;     /* Code blocks */

/* Font Sizes - Use default HTML semantics, avoid Tailwind text-* classes */
/* Let the browser defaults handle sizing unless specifically overridden */

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Design Principles

1. **Dark theme by default** - Professional, modern, reduces eye strain
2. **Gradient accents** - Use for text highlights and special elements
3. **Glassmorphism effects** - Subtle backdrop blur for elevated surfaces
4. **Smooth animations** - 60fps, purposeful motion
5. **High contrast** - WCAG AA minimum (4.5:1 ratio)
6. **Accessible first** - Keyboard navigation, screen reader support

---

## 🏗️ Application Architecture

### Tech Stack

```typescript
// Frontend
- Next.js 15 (Site/Marketing app)
- Vite + React 19 (Web/Platform app)
- TypeScript (strict mode)
- Tailwind CSS v4.0
- Shadcn/ui components

// Backend
- Supabase (Database, Auth, Storage)
- Supabase Edge Functions (Deno)
- Hono web server

// Deployment
- Vercel (Frontend hosting)
- Supabase Cloud (Backend)
```

### Monorepo Structure

```
flashfusion-platform/
├── apps/
│   ├── site/          # Next.js 15 - Marketing site (flashfusion.co)
│   │   ├── app/       # App router pages
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── features/page.tsx     # Features overview
│   │   │   ├── pricing/page.tsx      # Pricing plans
│   │   │   ├── faq/page.tsx          # FAQ
│   │   │   ├── contact/page.tsx      # Contact form
│   │   │   ├── demo/page.tsx         # Demo overview
│   │   │   ├── signin/page.tsx       # Sign in
│   │   │   └── signup/page.tsx       # Sign up
│   │   ├── components/
│   │   │   ├── Navigation.tsx        # Site header
│   │   │   └── BackButton.tsx        # Back navigation
│   │   └── app/globals.css           # Global styles
│   │
│   └── web/           # Vite - Full platform (app.flashfusion.co)
│       ├── src/
│       │   ├── App.tsx               # Main app component
│       │   ├── components/           # App components
│       │   └── styles/globals.css    # App styles
│       └── index.html
│
├── components/        # Shared React components (200+)
├── packages/          # Workspace packages
│   ├── config/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   ├── ui/
│   └── utils/
└── supabase/          # Backend code
    └── functions/server/
```

---

## 📱 Page Structure & Layout

### Site App Pages (Marketing)

#### 1. Landing Page (`/`)

**Layout:**
```tsx
<LandingPage>
  {/* Hero Section */}
  <Hero>
    <h1 className="ff-text-gradient">FlashFusion</h1>
    <p>Transform ideas into production-ready apps with AI</p>
    <CTAButtons>
      <Button className="ff-btn-primary">Get Started Free</Button>
      <Button className="ff-btn-secondary">Watch Demo</Button>
    </CTAButtons>
    <TrustIndicators>
      <Badge>60+ AI Tools</Badge>
      <Badge>10K+ Developers</Badge>
      <Badge>4.9★ Rating</Badge>
    </TrustIndicators>
  </Hero>

  {/* Features Section */}
  <FeaturesSection>
    <Grid cols={3}>
      <FeatureCard icon={Zap} className="ff-card-interactive">
        <h3>AI Code Generation</h3>
        <p>Generate production-ready code in seconds</p>
      </FeatureCard>
      {/* ...more features */}
    </Grid>
  </FeaturesSection>

  {/* Demo Video/Screenshot Section */}
  <DemoSection>
    <VideoPlayer src="/demo.mp4" />
    {/* OR */}
    <ImageCarousel images={screenshots} />
  </DemoSection>

  {/* Pricing Teaser */}
  <PricingSection>
    <PricingCards showTopTier={3} />
    <Link to="/pricing">View All Plans →</Link>
  </PricingSection>

  {/* Testimonials */}
  <TestimonialsSection>
    <TestimonialGrid>
      <Testimonial author="Sarah Chen" role="Senior Developer">
        "FlashFusion cut our development time by 70%"
      </Testimonial>
      {/* ...more testimonials */}
    </TestimonialGrid>
  </TestimonialsSection>

  {/* Statistics */}
  <StatisticsSection>
    <Stat label="Apps Generated" value="50,000+" />
    <Stat label="Active Developers" value="10,000+" />
    <Stat label="Time Saved" value="1M+ hours" />
  </StatisticsSection>

  {/* FAQ Preview */}
  <FAQSection showTop={5}>
    <Accordion>
      <AccordionItem>Q: How does FlashFusion work?</AccordionItem>
      {/* ...more questions */}
    </Accordion>
    <Link to="/faq">View All FAQs →</Link>
  </FAQSection>

  {/* Final CTA */}
  <FinalCTA>
    <h2>Ready to Build Faster?</h2>
    <Button size="lg" className="ff-btn-primary ff-hover-glow">
      Start Building Free
    </Button>
  </FinalCTA>

  {/* Footer */}
  <Footer>
    <FooterLinks />
    <SocialLinks />
    <Newsletter />
  </Footer>
</LandingPage>
```

**Key Features:**
- Smooth scroll animations (ff-fade-in-up)
- Sticky navigation bar
- Gradient text on headlines
- Interactive hover effects on cards
- Mobile-responsive (collapsible menu)
- Fast load time (<2s)

#### 2. Features Page (`/features`)

**Layout:**
```tsx
<FeaturesPage>
  <PageHeader>
    <BackButton /> {/* Returns to home */}
    <h1>Platform Features</h1>
    <Breadcrumb path={['Home', 'Features']} />
  </PageHeader>

  {/* Feature Categories */}
  <TabNavigation>
    <Tab>Code Generation</Tab>
    <Tab>Deployment</Tab>
    <Tab>Collaboration</Tab>
    <Tab>Analytics</Tab>
  </TabNavigation>

  {/* Feature Grid */}
  <FeatureGrid cols={2} gap="lg">
    <FeatureDetailCard>
      <Icon size="2xl" />
      <h3>Full-Stack App Builder</h3>
      <Description>
        Generate complete applications with frontend, backend, 
        database schema, and deployment configuration
      </Description>
      <TechStack>
        <Badge>React</Badge>
        <Badge>Node.js</Badge>
        <Badge>PostgreSQL</Badge>
      </TechStack>
      <Button variant="outline">Try It Now →</Button>
    </FeatureDetailCard>
    {/* ...60+ features */}
  </FeatureGrid>

  {/* Comparison Table */}
  <ComparisonSection>
    <h2>How We Compare</h2>
    <ComparisonTable>
      <thead>
        <tr>
          <th>Feature</th>
          <th>FlashFusion</th>
          <th>Competitor A</th>
          <th>Competitor B</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>AI Models</td>
          <td>8+ (GPT-4, Claude, Gemini)</td>
          <td>1-2</td>
          <td>1</td>
        </tr>
        {/* ...more rows */}
      </tbody>
    </ComparisonTable>
  </ComparisonSection>
</FeaturesPage>
```

#### 3. Pricing Page (`/pricing`)

**Layout:**
```tsx
<PricingPage>
  <PageHeader>
    <BackButton />
    <h1>Choose Your Plan</h1>
    <ToggleSwitch>
      <Option>Monthly</Option>
      <Option selected>Annual (Save 20%)</Option>
    </ToggleSwitch>
  </PageHeader>

  {/* Pricing Cards */}
  <PricingGrid cols={4}>
    <PricingCard tier="Free">
      <Badge>Get Started</Badge>
      <Price>$0<span>/month</span></Price>
      <FeatureList>
        <Feature included>5 projects</Feature>
        <Feature included>Basic AI tools</Feature>
        <Feature>Advanced analytics</Feature>
        <Feature>Priority support</Feature>
      </FeatureList>
      <Button className="ff-btn-secondary">Get Started</Button>
    </PricingCard>

    <PricingCard tier="Pro" featured>
      <Badge variant="accent">Most Popular</Badge>
      <Price>$29<span>/month</span></Price>
      <FeatureList>
        <Feature included>Unlimited projects</Feature>
        <Feature included>All AI models</Feature>
        <Feature included>Advanced analytics</Feature>
        <Feature>Team collaboration</Feature>
      </FeatureList>
      <Button className="ff-btn-primary ff-hover-glow">
        Start Free Trial
      </Button>
    </PricingCard>

    <PricingCard tier="Team">
      {/* Team plan features */}
    </PricingCard>

    <PricingCard tier="Enterprise">
      <Price>Custom</Price>
      <Button className="ff-btn-accent">Contact Sales</Button>
    </PricingCard>
  </PricingGrid>

  {/* FAQ Dropdown (Integrated) */}
  <PricingFAQ>
    <Accordion>
      <AccordionItem>
        <Trigger>What payment methods do you accept?</Trigger>
        <Content>We accept all major credit cards...</Content>
      </AccordionItem>
      {/* ...more pricing FAQs */}
    </Accordion>
  </PricingFAQ>

  {/* Trust Signals */}
  <TrustSection>
    <SecurityBadges>
      <Badge>SOC 2 Certified</Badge>
      <Badge>GDPR Compliant</Badge>
      <Badge>256-bit Encryption</Badge>
    </SecurityBadges>
    <MoneyBackGuarantee />
  </TrustSection>
</PricingPage>
```

#### 4. FAQ Page (`/faq`)

**Layout:**
```tsx
<FAQPage>
  <PageHeader>
    <BackButton />
    <h1>Frequently Asked Questions</h1>
    <SearchBar placeholder="Search FAQs..." />
  </PageHeader>

  {/* Category Navigation */}
  <CategoryTabs>
    <Tab active>General</Tab>
    <Tab>Pricing & Billing</Tab>
    <Tab>Technical</Tab>
    <Tab>Security</Tab>
  </CategoryTabs>

  {/* FAQ Accordion */}
  <FAQAccordion>
    <AccordionItem>
      <Trigger>
        <Question>What makes FlashFusion different?</Question>
      </Trigger>
      <Content>
        <Answer>
          FlashFusion combines 60+ AI tools, gamification, 
          and instant deployment in one platform. Unlike other 
          tools that focus on single aspects, we provide a 
          complete end-to-end development experience...
        </Answer>
      </Content>
    </AccordionItem>
    {/* ...50+ FAQs */}
  </FAQAccordion>

  {/* Still Have Questions? */}
  <ContactCTA>
    <h3>Still have questions?</h3>
    <Button className="ff-btn-primary" to="/contact">
      Contact Support
    </Button>
  </ContactCTA>
</FAQPage>
```

#### 5. Contact Page (`/contact`)

**Layout:**
```tsx
<ContactPage>
  <PageHeader>
    <BackButton />
    <h1>Get in Touch</h1>
  </PageHeader>

  <TwoColumnLayout>
    {/* Left: Contact Info */}
    <ContactInfo>
      <InfoCard>
        <Icon><Mail /></Icon>
        <h3>Email</h3>
        <Link>support@flashfusion.co</Link>
      </InfoCard>

      <InfoCard>
        <Icon><MessageSquare /></Icon>
        <h3>Live Chat</h3>
        <p>Available 9am-5pm EST</p>
      </InfoCard>

      <SocialLinks>
        <Link><Twitter /></Link>
        <Link><Github /></Link>
        <Link><LinkedIn /></Link>
      </SocialLinks>
    </ContactInfo>

    {/* Right: Contact Form */}
    <ContactForm>
      <FormField>
        <Label>Name</Label>
        <Input 
          className="ff-focus-ring" 
          placeholder="John Doe"
        />
      </FormField>

      <FormField>
        <Label>Email</Label>
        <Input 
          type="email"
          className="ff-focus-ring"
          placeholder="john@example.com"
        />
      </FormField>

      <FormField>
        <Label>Subject</Label>
        <Select className="ff-focus-ring">
          <Option>General Inquiry</Option>
          <Option>Technical Support</Option>
          <Option>Sales</Option>
          <Option>Partnership</Option>
        </Select>
      </FormField>

      <FormField>
        <Label>Message</Label>
        <Textarea 
          className="ff-focus-ring"
          rows={6}
          placeholder="How can we help?"
        />
      </FormField>

      <Button 
        type="submit" 
        className="ff-btn-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </ContactForm>
  </TwoColumnLayout>
</ContactPage>
```

#### 6. Demo Page (`/demo`)

**Layout:**
```tsx
<DemoPage>
  <PageHeader>
    <BackButton />
    <h1>Interactive Demo</h1>
    <p>Explore FlashFusion's capabilities</p>
  </PageHeader>

  {/* Demo Categories */}
  <DemoGrid cols={3}>
    <DemoCard to="/demo/ai-creation">
      <Icon><Sparkles /></Icon>
      <h3>AI Code Generation</h3>
      <Description>
        See how FlashFusion generates production-ready code
      </Description>
      <Badge>Interactive</Badge>
    </DemoCard>

    <DemoCard>
      <Icon><Rocket /></Icon>
      <h3>One-Click Deploy</h3>
      <Description>
        Deploy to 8+ platforms with a single click
      </Description>
      <Badge>Video Demo</Badge>
    </DemoCard>

    <DemoCard>
      <Icon><Users /></Icon>
      <h3>Team Collaboration</h3>
      <Description>
        Real-time collaboration features
      </Description>
      <Badge>Live Demo</Badge>
    </DemoCard>
  </DemoGrid>

  {/* Featured Demo */}
  <FeaturedDemo>
    <VideoPlayer 
      src="/demos/full-stack-builder.mp4"
      poster="/demos/thumbnail.jpg"
    />
    <Transcript />
  </FeaturedDemo>
</DemoPage>
```

#### 7. Sign In Page (`/signin`)

**Layout:**
```tsx
<SignInPage>
  <AuthLayout>
    <BackButton /> {/* Returns to home */}
    
    <Logo>
      <FlashFusionIcon />
      <h2>Sign In to FlashFusion</h2>
    </Logo>

    {/* Social Sign In */}
    <SocialButtons>
      <Button variant="outline" className="w-full">
        <GithubIcon /> Continue with GitHub
      </Button>
      <Button variant="outline" className="w-full">
        <GoogleIcon /> Continue with Google
      </Button>
    </SocialButtons>

    <Divider>or</Divider>

    {/* Email/Password Form */}
    <SignInForm>
      <FormField>
        <Label>Email</Label>
        <Input 
          type="email"
          className="ff-focus-ring"
          autoComplete="email"
        />
      </FormField>

      <FormField>
        <Label>
          Password
          <Link to="/forgot-password">Forgot?</Link>
        </Label>
        <Input 
          type="password"
          className="ff-focus-ring"
          autoComplete="current-password"
        />
      </FormField>

      <RememberMe>
        <Checkbox /> Keep me signed in
      </RememberMe>

      <Button 
        type="submit"
        className="ff-btn-primary w-full"
      >
        Sign In
      </Button>
    </SignInForm>

    {/* Sign Up Link */}
    <Footer>
      Don't have an account? 
      <Link to="/signup">Sign up free</Link>
    </Footer>
  </AuthLayout>
</SignInPage>
```

#### 8. Sign Up Page (`/signup`)

**Layout:**
```tsx
<SignUpPage>
  <AuthLayout>
    <BackButton />
    
    <Logo>
      <h2>Create Your Account</h2>
      <Badge>Free 14-day trial</Badge>
    </Logo>

    {/* Social Sign Up */}
    <SocialButtons>
      <Button variant="outline">
        <GithubIcon /> Sign up with GitHub
      </Button>
      <Button variant="outline">
        <GoogleIcon /> Sign up with Google
      </Button>
    </SocialButtons>

    <Divider>or</Divider>

    {/* Registration Form */}
    <SignUpForm>
      <FormField>
        <Label>Full Name</Label>
        <Input className="ff-focus-ring" />
      </FormField>

      <FormField>
        <Label>Email</Label>
        <Input type="email" className="ff-focus-ring" />
      </FormField>

      <FormField>
        <Label>Password</Label>
        <Input type="password" className="ff-focus-ring" />
        <PasswordStrength value={strength} />
      </FormField>

      <FormField>
        <Checkbox required>
          I agree to the 
          <Link to="/terms">Terms</Link> and 
          <Link to="/privacy">Privacy Policy</Link>
        </Checkbox>
      </FormField>

      <Button 
        type="submit"
        className="ff-btn-primary w-full"
      >
        Create Account
      </Button>
    </SignUpForm>

    <Footer>
      Already have an account?
      <Link to="/signin">Sign in</Link>
    </Footer>
  </AuthLayout>
</SignUpPage>
```

---

## 🎨 Component Patterns

### Button Variants

```tsx
// Primary CTA - Most important actions
<Button className="ff-btn-primary">
  Generate Code
</Button>

// CSS:
.ff-btn-primary {
  background: linear-gradient(135deg, #FF7B00 0%, #FF9500 100%);
  color: white;
  font-family: var(--font-primary);
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  border: none;
}

.ff-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 123, 0, 0.4);
}

// Secondary - Alternative actions
<Button className="ff-btn-secondary">
  Save Draft
</Button>

.ff-btn-secondary {
  background: rgba(0, 180, 216, 0.1);
  border: 1px solid #00B4D8;
  color: #00B4D8;
}

// Accent - Special features
<Button className="ff-btn-accent">
  Upgrade to Pro
</Button>

.ff-btn-accent {
  background: linear-gradient(135deg, #E91E63 0%, #F06292 100%);
}
```

### Card Variants

```tsx
// Interactive Card - Hover effects
<Card className="ff-card-interactive">
  <CardContent>...</CardContent>
</Card>

.ff-card-interactive {
  background: var(--surface-slate);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.ff-card-interactive:hover {
  transform: translateY(-4px);
  border-color: var(--primary-orange);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 123, 0, 0.2);
}
```

### Text Gradient

```tsx
<h1 className="ff-text-gradient">FlashFusion</h1>

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
}
```

### Focus States

```tsx
<Input className="ff-focus-ring" />

.ff-focus-ring:focus {
  outline: none;
  ring: 2px solid var(--primary-orange);
  ring-offset: 2px;
  ring-offset-color: var(--bg-dark-navy);
}
```

### Loading States

```tsx
<FullPageLoader message="FlashFusion is generating..." />

<div className="ff-fade-in-up">
  <Loader2 className="h-8 w-8 animate-spin text-primary-orange" />
  <p>Loading...</p>
</div>
```

---

## 🎭 Animation System

### Core Animation Classes

```css
/* Fade In Up - Default entrance */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ff-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

/* Scale Pop - Success/completion */
@keyframes scalePop {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}

.ff-scale-pop {
  animation: scalePop 0.4s ease-out forwards;
}

/* Pulse Glow - Attention */
@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 123, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 123, 0, 0.6);
  }
}

.ff-pulse-glow {
  animation: pulseGlow 2s ease-in-out infinite;
}

/* Hover Effects */
.ff-hover-glow:hover {
  box-shadow: 
    0 0 30px rgba(255, 123, 0, 0.5),
    0 10px 30px rgba(0, 0, 0, 0.3);
}

.ff-hover-scale:hover {
  transform: scale(1.05);
}

.ff-hover-lift:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

/* Stagger Children */
.ff-stagger-fade > * {
  animation: fadeInUp 0.6s ease-out forwards;
}

.ff-stagger-fade > *:nth-child(1) { animation-delay: 0.1s; }
.ff-stagger-fade > *:nth-child(2) { animation-delay: 0.2s; }
.ff-stagger-fade > *:nth-child(3) { animation-delay: 0.3s; }
.ff-stagger-fade > *:nth-child(4) { animation-delay: 0.4s; }
```

### Usage Example

```tsx
<section className="ff-stagger-fade">
  <Card className="ff-card-interactive ff-hover-lift">
    <h3 className="ff-text-gradient">Feature Title</h3>
    <p>Description...</p>
    <Button className="ff-btn-primary ff-hover-glow">
      Try Now
    </Button>
  </Card>
</section>
```

---

## 📐 Layout Patterns

### Responsive Grid System

```tsx
// Feature Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <FeatureCard />
  <FeatureCard />
  <FeatureCard />
</div>

// Pricing Cards
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
  <PricingCard />
  <PricingCard />
  <PricingCard />
  <PricingCard />
</div>

// Two-Column Layout
<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
  <LeftColumn />
  <RightColumn />
</div>
```

### Container System

```tsx
// Page Container
<div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
  {/* Content */}
</div>

// Narrow Container (Forms, Auth)
<div className="container mx-auto px-4 max-w-md">
  {/* Content */}
</div>

// Wide Container (Dashboards)
<div className="container mx-auto px-4 max-w-[1400px]">
  {/* Content */}
</div>
```

### Section Spacing

```tsx
<section className="py-16 md:py-24 lg:py-32">
  {/* Section content */}
</section>

// Smaller sections
<section className="py-12 md:py-16">
  {/* Section content */}
</section>
```

---

## 🎯 Navigation System

### Site Header

```tsx
<header className="sticky top-0 z-50 bg-bg-dark-navy/80 backdrop-blur-lg border-b border-white/10">
  <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
    {/* Logo */}
    <Link to="/" className="flex items-center gap-2">
      <FlashFusionLogo className="h-8 w-8" />
      <span className="ff-text-gradient font-bold text-xl">
        FlashFusion
      </span>
    </Link>

    {/* Desktop Navigation */}
    <div className="hidden md:flex items-center gap-8">
      <NavLink to="/features">Features</NavLink>
      <NavLink to="/pricing">Pricing</NavLink>
      <NavLink to="/demo">Demo</NavLink>
      <NavLink to="/faq">FAQ</NavLink>
      
      <Separator orientation="vertical" className="h-6" />
      
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
      <Menu />
    </Button>
  </nav>

  {/* Mobile Menu */}
  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
    <SheetContent side="right">
      <nav className="flex flex-col gap-4">
        <NavLink to="/features">Features</NavLink>
        <NavLink to="/pricing">Pricing</NavLink>
        <NavLink to="/demo">Demo</NavLink>
        <NavLink to="/faq">FAQ</NavLink>
        <Separator />
        <Button variant="ghost" to="/signin">Sign In</Button>
        <Button className="ff-btn-primary" to="/signup">
          Get Started
        </Button>
      </nav>
    </SheetContent>
  </Sheet>
</header>
```

### Back Button Component

```tsx
export function BackButton({ 
  to = '/', 
  label = 'Back to Home' 
}: BackButtonProps) {
  const navigate = useNavigate();
  
  return (
    <Button
      variant="ghost"
      onClick={() => to ? navigate(to) : navigate(-1)}
      className="group mb-4"
    >
      <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
      {label}
    </Button>
  );
}
```

### Breadcrumb Navigation

```tsx
<Breadcrumb className="mb-6">
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink to="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink to="/features">Features</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Full-Stack Builder</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
/* Default: 320px - 767px (mobile) */

/* Tablet */
@media (min-width: 768px) { }

/* Desktop */
@media (min-width: 1024px) { }

/* Large Desktop */
@media (min-width: 1280px) { }

/* Extra Large */
@media (min-width: 1536px) { }
```

### Mobile Optimizations

```tsx
// Mobile Navigation
<nav className="md:hidden">
  <MobileMenu />
</nav>

// Responsive Typography
<h1 className="text-2xl md:text-4xl lg:text-5xl">
  FlashFusion
</h1>

// Responsive Grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {items.map(item => <Card key={item.id} />)}
</div>

// Touch-Friendly Targets
<button className="min-h-[44px] min-w-[44px]">
  {/* Touch target */}
</button>
```

---

## ♿ Accessibility Requirements

### WCAG 2.1 AA Compliance

```tsx
// Semantic HTML
<main>
  <h1>Page Title</h1>
  <section>
    <h2>Section Title</h2>
  </section>
</main>

// ARIA Labels
<button aria-label="Close dialog">
  <X />
</button>

// Alt Text
<img src="/feature.png" alt="AI code generation interface" />

// Form Labels
<label htmlFor="email">Email Address</label>
<input id="email" type="email" />

// Focus Management
const dialogRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (isOpen) {
    dialogRef.current?.focus();
  }
}, [isOpen]);

// Skip Links
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### Keyboard Navigation

```tsx
// All interactive elements must be keyboard accessible
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Interactive Element
</div>

// Modal Focus Trap
import { useFocusTrap } from '@/hooks/useFocusTrap';

function Modal({ children }) {
  const modalRef = useFocusTrap();
  
  return (
    <div ref={modalRef} role="dialog" aria-modal="true">
      {children}
    </div>
  );
}
```

---

## ⚡ Performance Optimization

### Code Splitting

```tsx
// Route-based code splitting
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));

function App() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <Routes>
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
      </Routes>
    </Suspense>
  );
}

// Component-level code splitting
const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Skeleton />}>
  <HeavyComponent />
</Suspense>
```

### Image Optimization

```tsx
// Next.js Image Component (Site App)
import Image from 'next/image';

<Image
  src="/hero-image.png"
  alt="FlashFusion Dashboard"
  width={1200}
  height={800}
  priority // For above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/..."
/>

// Lazy Loading (Vite App)
<img
  src="/feature.png"
  alt="Feature"
  loading="lazy"
  decoding="async"
/>
```

### React Optimization

```tsx
// Memoize expensive components
const FeatureCard = memo(({ feature }: Props) => {
  return <Card>{feature.title}</Card>;
});

// Memoize expensive calculations
const sortedFeatures = useMemo(() => {
  return features.sort((a, b) => a.priority - b.priority);
}, [features]);

// Memoize callbacks
const handleFeatureClick = useCallback((id: string) => {
  console.log('Feature clicked:', id);
}, []);
```

---

## 🔐 Authentication Flow

### Sign In Flow

```tsx
async function handleSignIn(email: string, password: string) {
  try {
    setIsLoading(true);
    setError(null);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Redirect to dashboard
    navigate('/dashboard');
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
}
```

### OAuth Sign In

```tsx
async function handleGitHubSignIn() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  if (error) {
    console.error('OAuth error:', error);
  }
}
```

### Protected Routes

```tsx
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <FullPageLoader />;
  }
  
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  
  return <>{children}</>;
}

// Usage
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } 
/>
```

---

## 📊 Analytics & Tracking

### Page View Tracking

```tsx
// In layout.tsx or _app.tsx
useEffect(() => {
  // Track page view
  track('page_view', {
    page_path: window.location.pathname,
    page_title: document.title,
  });
}, [pathname]);
```

### Event Tracking

```tsx
// Button click tracking
<Button
  className="ff-btn-primary"
  onClick={() => {
    track('cta_click', {
      button_text: 'Get Started',
      page: 'landing',
    });
    navigate('/signup');
  }}
>
  Get Started
</Button>

// Form submission tracking
async function handleSubmit(data: FormData) {
  track('form_submit', {
    form_name: 'contact_form',
    form_type: data.type,
  });
  
  await submitForm(data);
}
```

---

## 🎨 Complete Landing Page Example

```tsx
export function FlashFusionLandingPage() {
  return (
    <div className="min-h-screen bg-bg-dark-navy text-text-primary">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-orange/10 via-transparent to-secondary-cyan/10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center ff-fade-in-up">
            {/* Announcement Badge */}
            <Badge className="mb-6 bg-accent-magenta/20 text-accent-magenta border-accent-magenta/30">
              🚀 New: AI Multi-Agent Orchestration
            </Badge>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6">
              <span className="ff-text-gradient">FlashFusion</span>
              <br />
              Transform Ideas into Apps
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-text-secondary mb-8 max-w-2xl mx-auto">
              AI-powered development platform with 60+ tools, 
              instant deployment, and gamified learning
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="ff-btn-primary ff-hover-glow"
                onClick={() => track('cta_click', { location: 'hero' })}
              >
                Get Started Free
                <ArrowRight className="ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-secondary-cyan text-secondary-cyan hover:bg-secondary-cyan/10"
              >
                <Play className="mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <Zap className="text-primary-orange" />
                <span>60+ AI Tools</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-secondary-cyan" />
                <span>10,000+ Developers</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="text-accent-magenta" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Demo */}
          <div className="mt-16 ff-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Card className="ff-card-interactive overflow-hidden">
              <img
                src="/dashboard-preview.png"
                alt="FlashFusion Dashboard"
                className="w-full h-auto"
              />
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface-slate/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl mb-4">
              <span className="ff-text-gradient">Powerful Features</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Everything you need to build, deploy, and scale modern applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ff-stagger-fade">
            {features.map((feature, index) => (
              <Card 
                key={feature.id}
                className="ff-card-interactive ff-hover-lift"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-orange to-accent-magenta flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-secondary">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl mb-4">
              Simple, <span className="ff-text-gradient">Transparent Pricing</span>
            </h2>
            <p className="text-xl text-text-secondary">
              Start free, upgrade as you grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Pricing cards... */}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/pricing"
              className="text-secondary-cyan hover:text-secondary-cyan/80 inline-flex items-center gap-2"
            >
              View All Plans
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-surface-slate/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl mb-4">
              Loved by <span className="ff-text-gradient">Developers</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="ff-card-interactive">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent-magenta text-accent-magenta" />
                    ))}
                  </div>
                  <p className="text-text-secondary mb-6">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback>{testimonial.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-text-muted">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden ff-pulse-glow">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-orange/20 to-accent-magenta/20" />
            <CardContent className="relative z-10 py-16 text-center">
              <h2 className="text-3xl md:text-5xl mb-6">
                Ready to Build Faster?
              </h2>
              <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
                Join 10,000+ developers using FlashFusion to build 
                production-ready applications in minutes, not months
              </p>
              <Button 
                size="lg"
                className="ff-btn-primary ff-hover-glow"
              >
                Start Building Free
                <Rocket className="ml-2" />
              </Button>
              <p className="text-sm text-text-muted mt-4">
                No credit card required • 14-day free trial
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
```

---

## 📝 Implementation Checklist

### Phase 1: Setup & Structure
- [ ] Initialize Next.js 15 project for site app
- [ ] Initialize Vite + React 19 for web app
- [ ] Install dependencies (Tailwind, Shadcn/ui, etc.)
- [ ] Configure Tailwind with FlashFusion design tokens
- [ ] Set up Supabase project
- [ ] Configure environment variables

### Phase 2: Design System
- [ ] Create global CSS with FlashFusion colors
- [ ] Implement custom animation classes
- [ ] Create Button component with variants
- [ ] Create Card component with variants
- [ ] Implement focus ring styles
- [ ] Set up font families (Sora, Inter, JetBrains Mono)

### Phase 3: Core Components
- [ ] Navigation header (desktop + mobile)
- [ ] Footer component
- [ ] BackButton component
- [ ] Breadcrumb component
- [ ] Loading states (FullPageLoader, Skeleton)
- [ ] Error boundaries

### Phase 4: Marketing Pages
- [ ] Landing page (/)
- [ ] Features page (/features)
- [ ] Pricing page (/pricing)
- [ ] FAQ page (/faq)
- [ ] Contact page (/contact)
- [ ] Demo page (/demo)

### Phase 5: Authentication
- [ ] Sign in page (/signin)
- [ ] Sign up page (/signup)
- [ ] OAuth integration (GitHub, Google)
- [ ] Protected route wrapper
- [ ] Auth state management

### Phase 6: Optimization
- [ ] Image optimization
- [ ] Code splitting
- [ ] React.memo optimization
- [ ] Lazy loading
- [ ] Performance monitoring

### Phase 7: Accessibility
- [ ] Keyboard navigation
- [ ] ARIA labels
- [ ] Focus management
- [ ] Screen reader testing
- [ ] Color contrast verification

### Phase 8: Testing & Launch
- [ ] Component testing
- [ ] Integration testing
- [ ] Lighthouse audit
- [ ] Cross-browser testing
- [ ] Mobile responsiveness
- [ ] Deploy to Vercel

---

## 🎯 Key Success Metrics

### Performance Targets
- Lighthouse Score: 90+ (all categories)
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Time to Interactive: <3.5s
- Cumulative Layout Shift: <0.1

### Accessibility Targets
- WCAG 2.1 AA compliance: 100%
- Keyboard navigation: Full support
- Screen reader compatibility: Full support
- Color contrast: 4.5:1 minimum

### User Experience Targets
- Mobile responsive: All pages
- Touch targets: 44px minimum
- Loading states: All async operations
- Error handling: All user actions
- Smooth animations: 60fps

---

## 📚 Additional Resources

### Design References
- Follow Guidelines.md for all styling decisions
- Use Shadcn/ui components as base
- Override defaults with FlashFusion design system
- Maintain consistency across all pages

### Code Quality
- TypeScript strict mode
- ESLint + Prettier
- Meaningful variable names
- Comprehensive error handling
- Performance optimization
- Accessibility first

### Documentation
- Component Storybook (optional)
- API documentation
- User guides
- Developer documentation
- Deployment guides

---

## ✅ Final Notes

This prompt captures the complete FlashFusion progressive web app design, structure, and implementation patterns. Use it to:

1. **Recreate** the entire platform from scratch
2. **Extend** with new features while maintaining consistency
3. **Reference** for design decisions and patterns
4. **Train** AI models on FlashFusion's architecture

**Remember:**
- Always follow the FlashFusion design system
- Prioritize accessibility and performance
- Maintain semantic HTML structure
- Use the established animation and interaction patterns
- Keep components modular and reusable
- Test on multiple devices and browsers

**Brand Colors Quick Reference:**
```
Primary Orange: #FF7B00
Secondary Cyan: #00B4D8
Accent Magenta: #E91E63
BG Dark Navy: #0F172A
Surface Slate: #1E293B
```

**Typography Quick Reference:**
```
Headings: Sora
Body: Inter
Code: JetBrains Mono
```

**Animation Quick Reference:**
```
.ff-fade-in-up
.ff-scale-pop
.ff-pulse-glow
.ff-hover-glow
.ff-hover-lift
.ff-stagger-fade
```

---

**This is FlashFusion. Build with speed. Deploy with confidence. Scale with AI.** 🚀
