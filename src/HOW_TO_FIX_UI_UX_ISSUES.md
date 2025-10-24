# 🎯 How to Fix UI/UX Issues - Prompting Guide

## **Quick Answer**

When you see UI/UX issues (off-center content, overlapping elements, broken layouts), simply tell me:

### **Option 1: Show Me the Issue**
```
The homepage is off-center. Here's what I'm seeing:
[paste the broken content or describe the issue]
```

### **Option 2: Direct Fix Request**
```
Fix /apps/site/app/page.tsx - it's off-center and overlapping
```

### **Option 3: Full Audit**
```
Audit the entire site for UI/UX issues and fix everything
```

---

## **Common UI/UX Issues & How to Report Them**

### **1. Off-Center Content**

**What You See:**
- Content hugging the left side
- No centered layout
- Uneven margins

**How to Prompt:**
```
"The content is off-center on /page-name"
"Fix the centering on the Features page"
"Add max-width containers to center the layout"
```

**What I'll Do:**
- Add `.ff-container` (max-width: 1280px, centered)
- Ensure proper padding
- Fix grid alignment

---

### **2. Overlapping Elements**

**What You See:**
- Hero text hidden behind navigation
- Buttons overlapping images
- Cards stacking incorrectly

**How to Prompt:**
```
"The hero title overlaps the nav bar"
"Fix overlapping elements on /pricing"
"The promotional banner is covering the headline"
```

**What I'll Do:**
- Add proper z-index layers
- Fix sticky navigation spacing
- Add padding-top to content below nav
- Remove conflicting position styles

---

### **3. Broken Responsive Design**

**What You See:**
- Horizontal scrolling on mobile
- Text too small on mobile
- Buttons cut off on tablet

**How to Prompt:**
```
"The site doesn't work on mobile"
"Fix responsive design for tablet/mobile"
"Add mobile breakpoints to /page-name"
```

**What I'll Do:**
- Add responsive grid classes (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Use fluid typography (clamp())
- Add mobile-first padding/margins
- Test at 375px, 768px, 1024px breakpoints

---

### **4. Misaligned Cards/Grids**

**What You See:**
- Cards different sizes
- Uneven spacing between cards
- Grid items not aligned

**How to Prompt:**
```
"The feature cards are misaligned"
"Fix the grid spacing on /features"
"Make all cards the same height"
```

**What I'll Do:**
- Use CSS Grid with equal columns
- Add consistent gap spacing
- Ensure cards have same padding
- Use `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`

---

### **5. Inconsistent Fonts/Colors**

**What You See:**
- Wrong font family
- Colors not matching brand
- Inconsistent font sizes

**How to Prompt:**
```
"The fonts don't match the Guidelines.md"
"Fix typography on /page-name"
"Apply FlashFusion design system to all pages"
```

**What I'll Do:**
- Use Sora for headings
- Use Inter for body text
- Apply CSS variables (var(--ff-primary), etc.)
- Fix font weights and sizes

---

### **6. Missing Design System Classes**

**What You See:**
- Plain HTML with no styling
- Missing hover effects
- No branded colors

**How to Prompt:**
```
"Apply FlashFusion design system to /page-name"
"Add .ff-btn-primary, .ff-card, etc. classes"
"Use the design system from Guidelines.md"
```

**What I'll Do:**
- Replace inline styles with design system classes
- Add `.ff-btn-primary`, `.ff-card-interactive`, `.ff-hover-glow`
- Use proper color variables
- Add animations and transitions

---

### **7. No Focus States/Accessibility**

**What You See:**
- No visible focus when tabbing
- Can't navigate with keyboard
- Poor color contrast

**How to Prompt:**
```
"Add focus states to all interactive elements"
"Fix accessibility on /page-name"
"Ensure WCAG AA compliance"
```

**What I'll Do:**
- Add `.ff-focus-ring` to all inputs/buttons
- Ensure 4.5:1 contrast ratio
- Add proper ARIA labels
- Make everything keyboard accessible

---

### **8. Performance Issues**

**What You See:**
- Slow page loads
- Laggy animations
- Large bundle sizes

**How to Prompt:**
```
"Optimize performance on /page-name"
"The page is slow to load"
"Reduce bundle size"
```

**What I'll Do:**
- Implement lazy loading
- Use React.memo() for expensive components
- Optimize images
- Remove unused dependencies

---

## **Step-by-Step Fix Process**

When you report an issue, I follow this process:

### **1. Identify the Problem**
- Read your description
- Check the file you mentioned
- View the current code

### **2. Analyze the Root Cause**
- Missing design system classes?
- Incorrect CSS?
- Layout structure broken?
- Missing responsive styles?

### **3. Apply the Fix**
```tsx
// Before (broken)
<div className="p-4">
  <h1>Title</h1>
</div>

// After (fixed)
<div className="ff-container ff-section">
  <h1 style={{
    fontFamily: 'var(--ff-font-primary)',
    fontSize: 'var(--ff-text-5xl)',
    fontWeight: 'var(--ff-weight-extrabold)'
  }}>
    Title
  </h1>
</div>
```

### **4. Test Responsiveness**
- Mobile (375px)
- Tablet (768px)
- Desktop (1024px+)

### **5. Verify Design System Compliance**
- ✅ Uses FlashFusion colors
- ✅ Uses Sora/Inter fonts
- ✅ Has hover/focus states
- ✅ Responsive
- ✅ Accessible

---

## **Design System Quick Reference**

### **Layout Classes**
```tsx
.ff-container  // max-width: 1280px, centered, padded
.ff-section    // py-20 (5rem top/bottom padding)
```

### **Button Classes**
```tsx
.ff-btn-primary    // Orange gradient button
.ff-btn-secondary  // Transparent with border
.ff-btn-accent     // Magenta button
```

### **Card Classes**
```tsx
.ff-card             // Basic card styling
.ff-card-interactive // Card with hover effect
.ff-hover-lift       // Elevation on hover
```

### **Input Classes**
```tsx
.ff-input      // Styled input field
.ff-focus-ring // Focus state styling
```

### **Text Classes**
```tsx
.ff-text-gradient // Orange to cyan gradient
```

### **Animation Classes**
```tsx
.ff-hover-glow   // Glow effect on hover
.ff-hover-scale  // Scale up on hover
.ff-fade-in-up   // Fade in from bottom
```

---

## **Color Variables**
```css
--ff-primary: #FF7B00      (Orange)
--ff-secondary: #00B4D8    (Cyan)
--ff-accent: #E91E63       (Magenta)
--ff-bg-dark: #0F172A      (Dark Navy)
--ff-surface: #1E293B      (Slate)
--ff-text-primary: #FFFFFF (White)
--ff-text-secondary: #CBD5E1 (Light Gray)
--ff-text-muted: #94A3B8   (Muted Gray)
```

---

## **Font Variables**
```css
--ff-font-primary: 'Sora', sans-serif    (Headings, buttons)
--ff-font-secondary: 'Inter', sans-serif (Body text, inputs)
```

---

## **Example Prompts**

### **Good Prompts ✅**
```
"Fix the homepage - content is off-center"
"The pricing cards are misaligned, please fix"
"Apply FlashFusion design system to /features page"
"The nav bar overlaps the hero on mobile"
"Fix typography on all pages to match Guidelines.md"
```

### **Less Effective Prompts ❌**
```
"Fix it" (too vague - fix what?)
"Make it better" (what specifically needs improvement?)
"It's broken" (what's broken? which page?)
```

---

## **What I Need to Fix Issues Effectively**

### **Option A: Show Me the Issue**
Paste the content you're seeing, like:
```
🎉 Limited Time Launch Offer:
50% OFF for 4 months
[overlapping text here]
Transform Ideas Into Reality With AI
```

### **Option B: Tell Me the Page**
```
"Fix /apps/site/app/page.tsx"
"The Features page (/features) is broken"
```

### **Option C: Describe the Issue**
```
"The hero section overlaps the navigation"
"Cards are not centered on the pricing page"
"Mobile view has horizontal scroll"
```

---

## **Common Fixes I Apply**

### **1. Centering Content**
```tsx
// Add this wrapper
<div className="ff-container">
  <div className="max-w-4xl mx-auto">
    {/* Your content */}
  </div>
</div>
```

### **2. Fixing Overlaps**
```tsx
// Add padding-top to account for fixed nav
<section className="pt-24"> 
  {/* Content */}
</section>
```

### **3. Responsive Grids**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* Cards */}
</div>
```

### **4. Typography**
```tsx
<h1 style={{
  fontFamily: 'var(--ff-font-primary)',
  fontSize: 'var(--ff-text-5xl)',
  fontWeight: 'var(--ff-weight-extrabold)'
}}>
  Heading
</h1>
```

### **5. Colors**
```tsx
<button style={{
  background: 'var(--ff-gradient-primary)',
  color: 'white'
}}>
  Button
</button>
```

---

## **Testing Checklist**

After I fix an issue, I verify:

- [ ] Content is centered (max-width container)
- [ ] No overlapping elements
- [ ] Works on mobile (375px)
- [ ] Works on tablet (768px)
- [ ] Works on desktop (1024px+)
- [ ] Uses FlashFusion colors
- [ ] Uses Sora/Inter fonts
- [ ] Has hover states
- [ ] Has focus states
- [ ] Proper spacing (8px grid)
- [ ] Accessible (WCAG AA)

---

## **When to Use Each Prompt Type**

### **Quick Fix**
```
"Fix /page-name" 
```
Use when: You just need one page fixed

### **Specific Issue**
```
"The hero title overlaps the nav on /page-name"
```
Use when: You know exactly what's wrong

### **Full Audit**
```
"Audit all pages for UI/UX issues and fix everything"
```
Use when: Multiple issues across the site

### **Design System Application**
```
"Apply FlashFusion design system to /page-name"
```
Use when: Page exists but needs styling

### **Show Issue**
```
"Here's what I'm seeing: [paste content]"
```
Use when: Easier to show than describe

---

## **What Happens After You Prompt**

1. **I read your prompt** and identify the issue
2. **I view the file** to see current code
3. **I analyze the problem** (layout? fonts? colors?)
4. **I apply the fix** using design system
5. **I create the updated file**
6. **I explain what I fixed**

---

## **Real Example**

**Your Prompt:**
```
The homepage is off-center and the hero overlaps the nav
```

**What I Do:**
1. View `/apps/site/app/page.tsx`
2. See the issue: no `.ff-container`, no nav padding
3. Fix:
   - Add `<Navigation />` to layout
   - Wrap content in `.ff-container`
   - Add `pt-16` to account for sticky nav
   - Apply proper typography styles
4. Test responsiveness
5. Confirm design system compliance

**Result:**
✅ Centered content  
✅ No overlaps  
✅ Responsive  
✅ FlashFusion branded  

---

## **Summary**

### **To Fix UI/UX Issues, Just Tell Me:**

1. **Which page** has the issue
2. **What's wrong** (off-center, overlapping, broken mobile, etc.)
3. **Optional:** Show me what you're seeing

### **I'll Then:**

1. View the file
2. Identify the root cause
3. Apply FlashFusion design system
4. Fix layout, typography, colors
5. Ensure responsiveness
6. Test accessibility

### **Common Fixes:**

- Add `.ff-container` for centering
- Use design system classes (`.ff-btn-primary`, `.ff-card`, etc.)
- Apply FlashFusion colors and fonts
- Fix responsive breakpoints
- Add hover/focus states
- Remove overlaps with proper spacing

---

**Remember:** You don't need to be technical! Just describe what looks wrong, and I'll handle the rest. 🚀
