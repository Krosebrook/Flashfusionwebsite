# 🎨 FlashFusion Styling Compliance Guide

## 🎯 Overview
This guide ensures all FlashFusion components follow the brand design system and maintain visual consistency across the platform.

## 📋 Quick Compliance Checklist

### ✅ Typography Classes (REQUIRED)
- **Headlines/Headings**: Use `font-sora` + `ff-text-*` sizing classes
- **Body Text**: Use `font-inter` + `ff-text-*` sizing classes  
- **Buttons/Labels**: Use `font-sora` + appropriate sizing
- **Code**: Use `font-mono` or default monospace

```tsx
// ✅ CORRECT - FlashFusion compliant
<h1 className="ff-text-3xl font-bold ff-text-gradient font-sora">
  FlashFusion Platform
</h1>
<p className="ff-text-base text-muted-foreground font-inter">
  Your AI development companion
</p>
<Button className="ff-btn-primary font-sora">
  Generate Code
</Button>

// ❌ INCORRECT - Not compliant
<h1 className="text-3xl font-bold">FlashFusion Platform</h1>
<p className="text-base text-gray-600">Your AI development companion</p>
<Button className="bg-blue-500">Generate Code</Button>
```

### ✅ Animation Classes (REQUIRED)
- **Page/Component Entry**: `ff-fade-in-up`, `ff-stagger-fade`
- **Success States**: `ff-scale-pop`
- **Hover Effects**: `ff-hover-glow`, `ff-hover-lift`, `ff-hover-scale`
- **Progress Elements**: `ff-pulse-glow`, `ff-progress-bar`

```tsx
// ✅ CORRECT - FlashFusion animations
<div className="ff-stagger-fade">
  <Card className="ff-card-interactive ff-hover-lift">
    <Button className="ff-btn-primary ff-hover-glow">
      Generate
    </Button>
  </Card>
</div>

// ❌ INCORRECT - Generic animations
<div className="animate-fade-in">
  <Card className="hover:shadow-lg">
    <Button className="hover:bg-blue-600">Generate</Button>
  </Card>
</div>
```

### ✅ Button Classes (REQUIRED)
- **Primary Actions**: `ff-btn-primary`
- **Secondary Actions**: `ff-btn-secondary` 
- **Accent Actions**: `ff-btn-accent`
- **All Buttons**: Add `font-sora` for consistent typography

```tsx
// ✅ CORRECT - FlashFusion button styles
<Button className="ff-btn-primary font-sora">Primary Action</Button>
<Button className="ff-btn-secondary font-sora">Secondary</Button>
<Button className="ff-btn-accent font-sora">Special Feature</Button>

// ❌ INCORRECT - Generic button styles  
<Button className="bg-blue-500 text-white">Primary Action</Button>
```

### ✅ Card Classes (REQUIRED)
- **Interactive Cards**: `ff-card-interactive`
- **Hover Effects**: `ff-hover-lift` or `ff-hover-scale`
- **Glass Effect**: `ff-glass` for overlay cards

```tsx
// ✅ CORRECT - FlashFusion card styling
<Card className="ff-card-interactive ff-hover-lift">
  <CardHeader>
    <CardTitle className="font-sora ff-text-gradient">
      AI Tool
    </CardTitle>
  </CardHeader>
</Card>

// ❌ INCORRECT - Generic card styling
<Card className="hover:shadow-lg border">
  <CardHeader>
    <CardTitle>AI Tool</CardTitle>
  </CardHeader>
</Card>
```

### ✅ Focus States (REQUIRED)
- **All Interactive Elements**: `ff-focus-ring`
- **Form Inputs**: `ff-focus-ring` class

```tsx
// ✅ CORRECT - FlashFusion focus states
<Input className="ff-focus-ring font-inter" />
<Button className="ff-btn-primary ff-focus-ring font-sora">Click Me</Button>

// ❌ INCORRECT - Default focus states
<Input className="border rounded" />
<Button>Click Me</Button>
```

### ✅ Text Gradient (REQUIRED for Headlines)
- **Main Headlines**: `ff-text-gradient`
- **Important Text**: `ff-text-gradient`

```tsx
// ✅ CORRECT - FlashFusion gradients
<h1 className="ff-text-3xl font-bold ff-text-gradient font-sora">
  Welcome to FlashFusion
</h1>

// ❌ INCORRECT - Plain text headlines
<h1 className="text-3xl font-bold text-white">
  Welcome to FlashFusion  
</h1>
```

## 🔧 Auto-Fix Commands

### Find and Replace Patterns

1. **Fix Typography Classes**:
```bash
# Replace generic text sizes with FlashFusion classes
find . -name "*.tsx" -exec sed -i 's/text-xs/ff-text-xs/g' {} +
find . -name "*.tsx" -exec sed -i 's/text-sm/ff-text-sm/g' {} +
find . -name "*.tsx" -exec sed -i 's/text-base/ff-text-base/g' {} +
find . -name "*.tsx" -exec sed -i 's/text-lg/ff-text-lg/g' {} +
find . -name "*.tsx" -exec sed -i 's/text-xl/ff-text-xl/g' {} +
find . -name "*.tsx" -exec sed -i 's/text-2xl/ff-text-2xl/g' {} +
find . -name "*.tsx" -exec sed -i 's/text-3xl/ff-text-3xl/g' {} +
```

2. **Add Font Classes**:
```bash
# Add font-sora to headings and buttons
find . -name "*.tsx" -exec sed -i 's/<h1 className="/<h1 className="font-sora /g' {} +
find . -name "*.tsx" -exec sed -i 's/<h2 className="/<h2 className="font-sora /g' {} +
find . -name "*.tsx" -exec sed -i 's/<h3 className="/<h3 className="font-sora /g' {} +
find . -name "*.tsx" -exec sed -i 's/<Button className="/<Button className="font-sora /g' {} +

# Add font-inter to paragraphs
find . -name "*.tsx" -exec sed -i 's/<p className="/<p className="font-inter /g' {} +
```

3. **Fix Button Classes**:
```bash
# Replace generic button classes with FlashFusion classes
find . -name "*.tsx" -exec sed -i 's/bg-blue-500/ff-btn-primary/g' {} +
find . -name "*.tsx" -exec sed -i 's/bg-cyan-500/ff-btn-secondary/g' {} +
find . -name "*.tsx" -exec sed -i 's/bg-pink-500/ff-btn-accent/g' {} +
```

## 🎨 Complete Component Template

```tsx
import React, { useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface FlashFusionComponentProps {
  title: string;
  isActive?: boolean;
  onAction: () => void;
}

export function FlashFusionComponent({ 
  title, 
  isActive = false, 
  onAction 
}: FlashFusionComponentProps) {
  const [loading, setLoading] = useState(false);

  const handleAction = useCallback(async () => {
    setLoading(true);
    try {
      await onAction();
    } finally {
      setLoading(false);
    }
  }, [onAction]);

  return (
    <div className="ff-stagger-fade">
      <Card className="ff-card-interactive ff-hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="ff-text-xl font-sora ff-text-gradient">
              {title}
            </CardTitle>
            {isActive && (
              <Badge className="ff-badge-glow font-sora">
                Active
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="ff-text-base text-muted-foreground font-inter">
            FlashFusion AI-powered component description with proper typography.
          </p>
          
          <div className="flex gap-3">
            <Button 
              onClick={handleAction}
              disabled={loading}
              className="ff-btn-primary ff-hover-glow ff-focus-ring font-sora"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                'Generate with AI'
              )}
            </Button>
            
            <Button 
              variant="outline"
              className="ff-hover-scale ff-focus-ring font-sora"
            >
              Preview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FlashFusionComponent;
```

## 📊 Compliance Validation Script

Create this script to automatically check component compliance:

```typescript
// scripts/validate-ff-compliance.ts
import fs from 'fs';
import path from 'path';

interface ComplianceIssue {
  file: string;
  line: number;
  issue: string;
  suggestion: string;
}

export function validateFlashFusionCompliance(componentPath: string): ComplianceIssue[] {
  const issues: ComplianceIssue[] = [];
  const content = fs.readFileSync(componentPath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Check for generic text classes
    if (/text-(xs|sm|base|lg|xl|2xl|3xl)/.test(line) && !/ff-text-/.test(line)) {
      issues.push({
        file: componentPath,
        line: index + 1,
        issue: 'Generic text size class found',
        suggestion: 'Replace with ff-text-* class'
      });
    }

    // Check for missing font classes on headings
    if (/<h[1-6]/.test(line) && !/font-sora/.test(line)) {
      issues.push({
        file: componentPath,
        line: index + 1,
        issue: 'Heading missing font-sora class',
        suggestion: 'Add font-sora class to heading'
      });
    }

    // Check for missing font classes on buttons
    if (/<Button/.test(line) && !/font-sora/.test(line)) {
      issues.push({
        file: componentPath,
        line: index + 1,
        issue: 'Button missing font-sora class',
        suggestion: 'Add font-sora class to Button'
      });
    }

    // Check for missing font classes on paragraphs
    if (/<p\s/.test(line) && !/font-inter/.test(line)) {
      issues.push({
        file: componentPath,
        line: index + 1,
        issue: 'Paragraph missing font-inter class',
        suggestion: 'Add font-inter class to paragraph'
      });
    }

    // Check for generic button classes
    if (/bg-(blue|red|green|yellow|purple|pink|gray)-\d+/.test(line)) {
      issues.push({
        file: componentPath,
        line: index + 1,
        issue: 'Generic button background class found',
        suggestion: 'Replace with ff-btn-primary, ff-btn-secondary, or ff-btn-accent'
      });
    }

    // Check for missing animation classes on cards
    if (/<Card/.test(line) && !/ff-card-interactive/.test(line)) {
      issues.push({
        file: componentPath,
        line: index + 1,
        issue: 'Card missing ff-card-interactive class',
        suggestion: 'Add ff-card-interactive class to Card'
      });
    }
  });

  return issues;
}
```

## 🚀 Quick Fix Checklist for Existing Components

1. **Typography** ✅
   - [ ] Replace `text-*` with `ff-text-*`
   - [ ] Add `font-sora` to headings and buttons
   - [ ] Add `font-inter` to body text and paragraphs

2. **Buttons** ✅
   - [ ] Replace generic backgrounds with `ff-btn-*` classes
   - [ ] Add `font-sora` to all buttons
   - [ ] Add `ff-hover-glow` or `ff-hover-scale` for hover effects
   - [ ] Add `ff-focus-ring` for accessibility

3. **Cards** ✅
   - [ ] Add `ff-card-interactive` to interactive cards
   - [ ] Add `ff-hover-lift` or `ff-hover-scale` for hover effects
   - [ ] Use `ff-glass` for overlay/modal cards

4. **Animations** ✅
   - [ ] Add `ff-stagger-fade` to container elements
   - [ ] Use `ff-fade-in-up` for page transitions
   - [ ] Add `ff-scale-pop` for success states
   - [ ] Use `ff-pulse-glow` for loading/active states

5. **Layout** ✅
   - [ ] Use `ff-container-tight` for content containers
   - [ ] Add proper spacing with FlashFusion utilities
   - [ ] Ensure proper color contrast and accessibility

## 🎯 Priority Order for Fixes

1. **High Priority**: Typography (font classes and text sizing)
2. **Medium Priority**: Button styling and interactions
3. **Low Priority**: Animation enhancements and micro-interactions

This ensures FlashFusion maintains its professional, cohesive brand experience across all components! 🚀