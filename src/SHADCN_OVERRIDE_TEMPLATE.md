# Shadcn Component Override Template for FlashFusion

## 🎯 Purpose

Shadcn UI components come with **default styling baked in** (gap, typography, colors, etc.). This template shows **exactly** how to override these defaults with FlashFusion branding.

---

## ⚠️ Critical Rule

**ALWAYS explicitly set FlashFusion styling** to override Shadcn defaults. Never rely on component defaults.

---

## 📦 Component-by-Component Overrides

### Button Component

**Shadcn Default:**
```tsx
<Button>Click Me</Button>
// Uses Shadcn's default gray background, default padding, default font
```

**FlashFusion Override:**
```tsx
// PRIMARY BUTTON
<Button className="bg-gradient-to-r from-[#FF9F33] to-[#FF7B00] text-white font-semibold px-6 py-3 rounded-xl border-none hover:shadow-[0_0_20px_rgba(255,123,0,0.5)] hover:-translate-y-0.5 transition-all duration-300" style={{ fontFamily: "'Sora', sans-serif" }}>
  Click Me
</Button>

// SECONDARY BUTTON
<Button className="bg-gradient-to-r from-[#33C3DF] to-[#00B4D8] text-white font-semibold px-6 py-3 rounded-xl border-none hover:shadow-[0_0_20px_rgba(0,180,216,0.4)] hover:-translate-y-0.5 transition-all duration-300" style={{ fontFamily: "'Sora', sans-serif" }}>
  Learn More
</Button>

// GHOST BUTTON
<Button variant="ghost" className="bg-transparent border border-[#CBD5E1]/20 text-[#CBD5E1] font-medium px-6 py-3 rounded-xl hover:bg-white/5 hover:border-[#CBD5E1]/30 hover:text-white transition-all duration-300" style={{ fontFamily: "'Sora', sans-serif" }}>
  Cancel
</Button>

// OUTLINE BUTTON
<Button variant="outline" className="bg-transparent border-2 border-[#FF7B00] text-[#FF7B00] font-semibold px-6 py-3 rounded-xl hover:bg-[#FF7B00] hover:text-white transition-all duration-300" style={{ fontFamily: "'Sora', sans-serif" }}>
  Download
</Button>
```

---

### Card Component

**Shadcn Default:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
// Uses default background, spacing, border
```

**FlashFusion Override:**
```tsx
// STANDARD CARD
<Card className="bg-[#1E293B] border border-white/10 rounded-2xl p-0 shadow-lg transition-all duration-300">
  <CardHeader className="p-6 pb-4 space-y-2">
    <CardTitle className="text-2xl text-white font-bold" style={{ fontFamily: "'Sora', sans-serif" }}>
      Title
    </CardTitle>
    <CardDescription className="text-[#CBD5E1]" style={{ fontFamily: "'Inter', sans-serif" }}>
      Description text
    </CardDescription>
  </CardHeader>
  <CardContent className="p-6 pt-0 space-y-4">
    <p className="text-[#CBD5E1]" style={{ fontFamily: "'Inter', sans-serif" }}>
      Content goes here
    </p>
  </CardContent>
</Card>

// INTERACTIVE CARD (Hover Effects)
<Card className="bg-[#1E293B] border border-white/10 rounded-2xl p-0 shadow-lg cursor-pointer transition-all duration-300 hover:border-[#FF7B00] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,123,0,0.2)]">
  <CardHeader className="p-6 pb-4">
    <div className="w-12 h-12 bg-gradient-to-br from-[#FF7B00] to-[#E91E63] rounded-xl flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-white" />
    </div>
    <CardTitle className="text-xl text-white font-bold" style={{ fontFamily: "'Sora', sans-serif" }}>
      Feature Title
    </CardTitle>
  </CardHeader>
  <CardContent className="p-6 pt-0">
    <p className="text-[#CBD5E1]" style={{ fontFamily: "'Inter', sans-serif" }}>
      Feature description
    </p>
  </CardContent>
</Card>

// PRICING CARD (Featured)
<Card className="bg-[#1E293B] border-2 border-[#FF7B00] rounded-2xl p-0 shadow-[0_0_30px_rgba(255,123,0,0.2)] scale-105 relative overflow-hidden">
  {/* Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#FF7B00]/10 to-[#E91E63]/10 pointer-events-none" />
  
  <CardHeader className="p-8 pb-6 relative z-10">
    <Badge className="bg-[#E91E63] text-white px-3 py-1 rounded-full text-xs font-bold mb-4 w-fit">
      MOST POPULAR
    </Badge>
    <CardTitle className="text-3xl text-white font-bold mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
      Pro Plan
    </CardTitle>
    <div className="flex items-baseline">
      <span className="text-5xl font-bold bg-gradient-to-r from-[#FF7B00] via-[#00B4D8] to-[#E91E63] bg-clip-text text-transparent" style={{ fontFamily: "'Sora', sans-serif" }}>
        $29
      </span>
      <span className="text-[#CBD5E1] ml-2" style={{ fontFamily: "'Inter', sans-serif" }}>/month</span>
    </div>
  </CardHeader>
  
  <CardContent className="p-8 pt-0 space-y-4 relative z-10">
    <ul className="space-y-3">
      <li className="flex items-start gap-2">
        <Check className="h-5 w-5 text-[#10B981] mt-0.5 flex-shrink-0" />
        <span className="text-[#FFFFFF]" style={{ fontFamily: "'Inter', sans-serif" }}>
          Feature description
        </span>
      </li>
    </ul>
  </CardContent>
  
  <CardFooter className="p-8 pt-0 relative z-10">
    <Button className="w-full bg-gradient-to-r from-[#FF9F33] to-[#FF7B00] text-white font-semibold px-6 py-4 rounded-xl hover:shadow-[0_0_20px_rgba(255,123,0,0.5)] transition-all" style={{ fontFamily: "'Sora', sans-serif" }}>
      Get Started
    </Button>
  </CardFooter>
</Card>
```

---

### Input Component

**Shadcn Default:**
```tsx
<Input placeholder="Enter text..." />
// Uses default background, border, text color
```

**FlashFusion Override:**
```tsx
// TEXT INPUT
<Input 
  type="text"
  placeholder="Enter your email..."
  className="w-full bg-[#1E293B] border border-[#CBD5E1]/20 rounded-lg px-4 py-3 text-white placeholder:text-[#94A3B8] focus:border-[#FF7B00] focus:ring-2 focus:ring-[#FF7B00]/30 focus:outline-none transition-all duration-200"
  style={{ fontFamily: "'Inter', sans-serif" }}
/>

// WITH LABEL
<div className="space-y-2">
  <Label htmlFor="email" className="text-sm font-medium text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
    Email Address *
  </Label>
  <Input 
    id="email"
    type="email"
    placeholder="you@example.com"
    required
    className="w-full bg-[#1E293B] border border-[#CBD5E1]/20 rounded-lg px-4 py-3 text-white placeholder:text-[#94A3B8] focus:border-[#FF7B00] focus:ring-2 focus:ring-[#FF7B00]/30 focus:outline-none transition-all duration-200"
    style={{ fontFamily: "'Inter', sans-serif" }}
  />
</div>

// WITH ERROR STATE
<div className="space-y-2">
  <Input 
    type="text"
    placeholder="Enter value..."
    aria-invalid="true"
    aria-describedby="error-message"
    className="w-full bg-[#1E293B] border-2 border-[#EF4444] rounded-lg px-4 py-3 text-white placeholder:text-[#94A3B8] focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/30 focus:outline-none transition-all duration-200"
    style={{ fontFamily: "'Inter', sans-serif" }}
  />
  <p id="error-message" className="text-sm text-[#EF4444]" style={{ fontFamily: "'Inter', sans-serif" }}>
    This field is required
  </p>
</div>
```

---

### Textarea Component

**Shadcn Default:**
```tsx
<Textarea placeholder="Enter message..." />
```

**FlashFusion Override:**
```tsx
<Textarea 
  placeholder="Describe your project..."
  rows={6}
  className="w-full bg-[#1E293B] border border-[#CBD5E1]/20 rounded-lg px-4 py-3 text-white placeholder:text-[#94A3B8] focus:border-[#FF7B00] focus:ring-2 focus:ring-[#FF7B00]/30 focus:outline-none resize-vertical min-h-[120px] transition-all duration-200"
  style={{ fontFamily: "'Inter', sans-serif" }}
/>

// WITH LABEL AND CHARACTER COUNT
<div className="space-y-2">
  <div className="flex items-center justify-between">
    <Label htmlFor="description" className="text-sm font-medium text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
      Project Description
    </Label>
    <span className="text-xs text-[#94A3B8]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {value.length}/500
    </span>
  </div>
  <Textarea 
    id="description"
    placeholder="Tell us about your project..."
    maxLength={500}
    rows={6}
    value={value}
    onChange={(e) => setValue(e.target.value)}
    className="w-full bg-[#1E293B] border border-[#CBD5E1]/20 rounded-lg px-4 py-3 text-white placeholder:text-[#94A3B8] focus:border-[#FF7B00] focus:ring-2 focus:ring-[#FF7B00]/30 focus:outline-none resize-vertical min-h-[120px] transition-all duration-200"
    style={{ fontFamily: "'Inter', sans-serif" }}
  />
</div>
```

---

### Select Component

**Shadcn Default:**
```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
  </SelectContent>
</Select>
```

**FlashFusion Override:**
```tsx
<Select value={value} onValueChange={setValue}>
  <SelectTrigger className="w-full bg-[#1E293B] border border-[#CBD5E1]/20 rounded-lg px-4 py-3 text-white focus:border-[#FF7B00] focus:ring-2 focus:ring-[#FF7B00]/30 focus:outline-none transition-all duration-200" style={{ fontFamily: "'Inter', sans-serif" }}>
    <SelectValue placeholder="Choose an option..." className="text-[#94A3B8]" />
  </SelectTrigger>
  <SelectContent className="bg-[#1E293B] border border-white/10 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
    <SelectItem 
      value="option1" 
      className="text-white hover:bg-[#334155] focus:bg-[#334155] px-3 py-2 cursor-pointer rounded transition-colors"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      Option 1
    </SelectItem>
    <SelectItem 
      value="option2" 
      className="text-white hover:bg-[#334155] focus:bg-[#334155] px-3 py-2 cursor-pointer rounded transition-colors"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      Option 2
    </SelectItem>
    <SelectItem 
      value="option3" 
      className="text-white hover:bg-[#334155] focus:bg-[#334155] px-3 py-2 cursor-pointer rounded transition-colors"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      Option 3
    </SelectItem>
  </SelectContent>
</Select>
```

---

### Badge Component

**Shadcn Default:**
```tsx
<Badge>Label</Badge>
```

**FlashFusion Override:**
```tsx
// SUCCESS BADGE
<Badge className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 px-3 py-1 rounded-full text-xs font-semibold" style={{ fontFamily: "'Sora', sans-serif" }}>
  ✓ Active
</Badge>

// WARNING BADGE
<Badge className="bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30 px-3 py-1 rounded-full text-xs font-semibold" style={{ fontFamily: "'Sora', sans-serif" }}>
  ⚠ Pending
</Badge>

// ERROR BADGE
<Badge className="bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30 px-3 py-1 rounded-full text-xs font-semibold" style={{ fontFamily: "'Sora', sans-serif" }}>
  ✗ Failed
</Badge>

// INFO BADGE
<Badge className="bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30 px-3 py-1 rounded-full text-xs font-semibold" style={{ fontFamily: "'Sora', sans-serif" }}>
  ℹ Info
</Badge>

// PRO BADGE (Gradient)
<Badge className="bg-gradient-to-r from-[#E91E63] to-[#FF7B00] text-white border-none px-3 py-1 rounded-full text-xs font-bold shadow-lg" style={{ fontFamily: "'Sora', sans-serif" }}>
  PRO
</Badge>

// NEW BADGE
<Badge className="bg-[#E91E63]/20 text-[#E91E63] border border-[#E91E63]/30 px-3 py-1 rounded-full text-xs font-semibold animate-pulse" style={{ fontFamily: "'Sora', sans-serif" }}>
  🆕 NEW
</Badge>
```

---

### Dialog Component

**Shadcn Default:**
```tsx
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

**FlashFusion Override:**
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button className="bg-gradient-to-r from-[#FF9F33] to-[#FF7B00] text-white font-semibold px-6 py-3 rounded-xl" style={{ fontFamily: "'Sora', sans-serif" }}>
      Open Dialog
    </Button>
  </DialogTrigger>
  
  <DialogContent className="bg-[#1E293B] border border-white/10 rounded-2xl p-0 max-w-md shadow-2xl">
    <DialogHeader className="p-6 pb-4 border-b border-white/10">
      <DialogTitle className="text-2xl text-white font-bold" style={{ fontFamily: "'Sora', sans-serif" }}>
        Dialog Title
      </DialogTitle>
      <DialogDescription className="text-[#CBD5E1] mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
        Dialog description text goes here
      </DialogDescription>
    </DialogHeader>
    
    <div className="p-6 space-y-4">
      <p className="text-[#CBD5E1]" style={{ fontFamily: "'Inter', sans-serif" }}>
        Dialog content goes here
      </p>
    </div>
    
    <DialogFooter className="p-6 pt-0 flex flex-col-reverse sm:flex-row gap-3">
      <Button 
        variant="ghost" 
        onClick={() => setIsOpen(false)}
        className="border border-[#CBD5E1]/20 text-[#CBD5E1] font-medium px-6 py-3 rounded-xl hover:bg-white/5"
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        Cancel
      </Button>
      <Button 
        onClick={handleConfirm}
        className="bg-gradient-to-r from-[#FF9F33] to-[#FF7B00] text-white font-semibold px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(255,123,0,0.5)]"
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        Confirm
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### Tabs Component

**Shadcn Default:**
```tsx
<Tabs>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content</TabsContent>
</Tabs>
```

**FlashFusion Override:**
```tsx
<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
  <TabsList className="bg-[#1E293B] border border-white/10 rounded-xl p-1 grid grid-cols-3 gap-1 mb-6">
    <TabsTrigger 
      value="tab1"
      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF9F33] data-[state=active]:to-[#FF7B00] data-[state=active]:text-white text-[#CBD5E1] font-medium px-6 py-3 rounded-lg transition-all duration-200"
      style={{ fontFamily: "'Sora', sans-serif" }}
    >
      Tab 1
    </TabsTrigger>
    <TabsTrigger 
      value="tab2"
      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF9F33] data-[state=active]:to-[#FF7B00] data-[state=active]:text-white text-[#CBD5E1] font-medium px-6 py-3 rounded-lg transition-all duration-200"
      style={{ fontFamily: "'Sora', sans-serif" }}
    >
      Tab 2
    </TabsTrigger>
    <TabsTrigger 
      value="tab3"
      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF9F33] data-[state=active]:to-[#FF7B00] data-[state=active]:text-white text-[#CBD5E1] font-medium px-6 py-3 rounded-lg transition-all duration-200"
      style={{ fontFamily: "'Sora', sans-serif" }}
    >
      Tab 3
    </TabsTrigger>
  </TabsList>
  
  <TabsContent value="tab1" className="space-y-4">
    <p className="text-[#CBD5E1]" style={{ fontFamily: "'Inter', sans-serif" }}>
      Tab 1 content
    </p>
  </TabsContent>
  
  <TabsContent value="tab2" className="space-y-4">
    <p className="text-[#CBD5E1]" style={{ fontFamily: "'Inter', sans-serif" }}>
      Tab 2 content
    </p>
  </TabsContent>
  
  <TabsContent value="tab3" className="space-y-4">
    <p className="text-[#CBD5E1]" style={{ fontFamily: "'Inter', sans-serif" }}>
      Tab 3 content
    </p>
  </TabsContent>
</Tabs>
```

---

### Accordion Component

**Shadcn Default:**
```tsx
<Accordion>
  <AccordionItem value="item1">
    <AccordionTrigger>Question</AccordionTrigger>
    <AccordionContent>Answer</AccordionContent>
  </AccordionItem>
</Accordion>
```

**FlashFusion Override:**
```tsx
<Accordion type="single" collapsible className="space-y-4">
  <AccordionItem 
    value="item1"
    className="bg-[#1E293B] border border-white/10 rounded-xl px-6 py-0 transition-all duration-300 hover:border-[#FF7B00]"
  >
    <AccordionTrigger className="text-left hover:no-underline py-4 text-white font-semibold" style={{ fontFamily: "'Sora', sans-serif" }}>
      <span>What is FlashFusion?</span>
    </AccordionTrigger>
    <AccordionContent className="text-[#CBD5E1] pb-4 pt-0" style={{ fontFamily: "'Inter', sans-serif" }}>
      FlashFusion is an AI-powered development platform that transforms ideas into production-ready applications.
    </AccordionContent>
  </AccordionItem>
  
  <AccordionItem 
    value="item2"
    className="bg-[#1E293B] border border-white/10 rounded-xl px-6 py-0 transition-all duration-300 hover:border-[#FF7B00]"
  >
    <AccordionTrigger className="text-left hover:no-underline py-4 text-white font-semibold" style={{ fontFamily: "'Sora', sans-serif" }}>
      <span>How does pricing work?</span>
    </AccordionTrigger>
    <AccordionContent className="text-[#CBD5E1] pb-4 pt-0" style={{ fontFamily: "'Inter', sans-serif" }}>
      We offer flexible pricing starting with a free tier. Pro plans start at $29/month.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

---

## 🎯 Universal Override Pattern

For **any** Shadcn component, follow this pattern:

```tsx
<ShadcnComponent className="
  /* Background */
  bg-[#1E293B]
  
  /* Border */
  border border-[#CBD5E1]/20
  
  /* Border Radius */
  rounded-xl
  
  /* Text Color */
  text-white
  
  /* Spacing */
  px-6 py-3
  
  /* Focus State */
  focus:border-[#FF7B00]
  focus:ring-2
  focus:ring-[#FF7B00]/30
  focus:outline-none
  
  /* Hover State */
  hover:bg-[#334155]
  hover:border-[#FF7B00]
  
  /* Transition */
  transition-all
  duration-300
"
style={{ fontFamily: "'Inter', sans-serif" }}>
  Content
</ShadcnComponent>
```

---

## ✅ Quick Checklist

Before shipping any component, verify you've explicitly set:

- [ ] **Background color** (`bg-[#1E293B]` not default)
- [ ] **Text color** (`text-white` not default)
- [ ] **Font family** (inline `style={{ fontFamily: ... }}`)
- [ ] **Border** (`border border-[#CBD5E1]/20`)
- [ ] **Border radius** (`rounded-xl`)
- [ ] **Padding** (`px-6 py-3` not default)
- [ ] **Focus state** (`focus:border-[#FF7B00] focus:ring-2 focus:ring-[#FF7B00]/30 focus:outline-none`)
- [ ] **Hover state** (if interactive)
- [ ] **Transition** (`transition-all duration-300`)
- [ ] **Placeholder color** (if input: `placeholder:text-[#94A3B8]`)

---

## 🚀 Copy-Paste Templates

### Complete Form Example

```tsx
<form onSubmit={handleSubmit} className="space-y-6 max-w-md">
  {/* Email Field */}
  <div className="space-y-2">
    <Label htmlFor="email" className="text-sm font-medium text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
      Email Address *
    </Label>
    <Input 
      id="email"
      type="email"
      placeholder="you@example.com"
      required
      className="w-full bg-[#1E293B] border border-[#CBD5E1]/20 rounded-lg px-4 py-3 text-white placeholder:text-[#94A3B8] focus:border-[#FF7B00] focus:ring-2 focus:ring-[#FF7B00]/30 focus:outline-none transition-all duration-200"
      style={{ fontFamily: "'Inter', sans-serif" }}
    />
  </div>
  
  {/* Message Field */}
  <div className="space-y-2">
    <Label htmlFor="message" className="text-sm font-medium text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
      Message *
    </Label>
    <Textarea 
      id="message"
      placeholder="How can we help?"
      rows={6}
      required
      className="w-full bg-[#1E293B] border border-[#CBD5E1]/20 rounded-lg px-4 py-3 text-white placeholder:text-[#94A3B8] focus:border-[#FF7B00] focus:ring-2 focus:ring-[#FF7B00]/30 focus:outline-none resize-vertical min-h-[120px] transition-all duration-200"
      style={{ fontFamily: "'Inter', sans-serif" }}
    />
  </div>
  
  {/* Submit Button */}
  <Button 
    type="submit"
    disabled={isSubmitting}
    className="w-full bg-gradient-to-r from-[#FF9F33] to-[#FF7B00] text-white font-semibold px-6 py-4 rounded-xl hover:shadow-[0_0_20px_rgba(255,123,0,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
    style={{ fontFamily: "'Sora', sans-serif" }}
  >
    {isSubmitting ? 'Sending...' : 'Send Message'}
  </Button>
</form>
```

---

**Remember:** When in doubt, check `Guidelines.md`, `FLASHFUSION_QUICK_REFERENCE_CARD.md`, and this template. Always override Shadcn defaults! 🎨
