# 🎨 UI Components Chunk

## 📋 **Overview**

The UI components chunk contains all reusable interface primitives that follow the FlashFusion design system. These components are the building blocks for all other features in the platform.

## 🏗️ **Component Categories**

### **🔘 Form Controls**
- `button.tsx` - FlashFusion styled buttons
- `input.tsx` - Text inputs with validation
- `textarea.tsx` - Multi-line text inputs
- `select.tsx` - Dropdown selections
- `checkbox.tsx` - Boolean selection controls
- `radio-group.tsx` - Single-choice selections
- `switch.tsx` - Toggle controls

### **📋 Layout & Containers**
- `card.tsx` - Content containers with FlashFusion styling
- `sheet.tsx` - Slide-out panels
- `dialog.tsx` - Modal overlays
- `drawer.tsx` - Side panels
- `tabs.tsx` - Tabbed interfaces
- `accordion.tsx` - Collapsible content sections

### **📊 Data Display**  
- `table.tsx` - Data tables with sorting/filtering
- `badge.tsx` - Status indicators and labels
- `avatar.tsx` - User profile pictures
- `progress.tsx` - Progress indicators
- `chart.tsx` - Data visualization components
- `skeleton.tsx` - Loading placeholders

### **🔔 Feedback & Status**
- `alert.tsx` - Notification messages
- `sonner.tsx` - Toast notifications
- `loading-states.tsx` - Loading indicators
- `emergency-mode.tsx` - Critical failure UI
- `lite-mode-indicator.tsx` - Performance mode indicator

### **🧭 Navigation**
- `navigation-menu.tsx` - Primary navigation
- `breadcrumb.tsx` - Path navigation
- `pagination.tsx` - Content pagination
- `menubar.tsx` - Menu bars
- `dropdown-menu.tsx` - Context menus

### **🎯 Specialized Components**
- `flash-fusion-loader.tsx` - Branded loading screen
- `command.tsx` - Command palette
- `calendar.tsx` - Date selection
- `carousel.tsx` - Content carousels
- `resizable.tsx` - Resizable panels

## 🎨 **Design System Integration**

All UI components follow the FlashFusion design system with:

### **Color Palette**
- `--ff-primary` (#FF7B00) - Primary orange
- `--ff-secondary` (#00B4D8) - Secondary cyan  
- `--ff-accent` (#E91E63) - Accent magenta
- Extended color variants (50-900 shades)

### **Typography**
- `--ff-font-primary` (Sora) - Headers and labels
- `--ff-font-secondary` (Inter) - Body text
- `--ff-font-mono` (JetBrains Mono) - Code

### **Component Classes**
- `.ff-btn-primary` - Primary button styling
- `.ff-card-interactive` - Interactive card effects
- `.ff-text-*` - Typography scale
- `.ff-fade-in-up` - Animation utilities

## 🔧 **API Reference**

### **Button Component**

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

/**
 * FlashFusion Button Component
 * Provides consistent styling and behavior across the platform
 */
function Button(props: ButtonProps): JSX.Element
```

### **Card Component**

```tsx
interface CardProps {
  variant?: 'default' | 'interactive' | 'elevated';
  className?: string;
  children: React.ReactNode;
}

/**
 * FlashFusion Card Container
 * Styled container following FlashFusion design system
 */
function Card(props: CardProps): JSX.Element
```

### **FlashFusion Loader**

```tsx
interface FlashFusionLoaderProps {
  message?: string;
  detail?: string;
  progress?: number;
}

/**
 * Branded loading component with animations
 * Used during app initialization and major transitions
 */
function FlashFusionLoader(props: FlashFusionLoaderProps): JSX.Element
```

## 💡 **Usage Examples**

### **Basic Button Usage**
```tsx
import { Button } from '@/components/ui/button';

function MyComponent() {
  return (
    <div className="space-y-4">
      <Button variant="primary" size="lg">
        Start Building
      </Button>
      
      <Button variant="outline" loading>
        Processing...
      </Button>
    </div>
  );
}
```

### **Interactive Card**
```tsx
import { Card, CardHeader, CardContent } from '@/components/ui/card';

function FeatureCard() {
  return (
    <Card variant="interactive" className="ff-card-interactive">
      <CardHeader>
        <h3 className="ff-text-title">AI Tools</h3>
      </CardHeader>
      <CardContent>
        <p className="ff-text-body">
          Access 60+ AI-powered development tools
        </p>
      </CardContent>
    </Card>
  );
}
```

### **Form Controls**
```tsx
import { Input, Button, Switch } from '@/components/ui';

function SettingsForm() {
  return (
    <form className="space-y-6">
      <Input 
        placeholder="Project name"
        className="ff-input"
      />
      
      <div className="flex items-center space-x-2">
        <Switch id="notifications" />
        <label htmlFor="notifications" className="ff-text-body">
          Enable notifications
        </label>
      </div>
      
      <Button type="submit" variant="primary">
        Save Settings
      </Button>
    </form>
  );
}
```

## 🧪 **Testing Guidelines**

### **Component Testing Template**
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button Component', () => {
  it('renders with correct variant styling', () => {
    render(<Button variant="primary">Test Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ff-btn-primary');
  });
  
  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('shows loading state correctly', () => {
    render(<Button loading>Loading</Button>);
    
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });
});
```

### **Visual Regression Testing**
```tsx
import { render } from '@testing-library/react';
import { Button } from './button';

describe('Button Visual Tests', () => {
  it('matches snapshot for all variants', () => {
    const variants = ['primary', 'secondary', 'accent', 'outline'] as const;
    
    variants.forEach(variant => {
      const { container } = render(
        <Button variant={variant}>Test Button</Button>
      );
      expect(container.firstChild).toMatchSnapshot(`button-${variant}`);
    });
  });
});
```

## 🎯 **Accessibility Standards**

### **WCAG Compliance**
- ✅ All interactive elements are keyboard accessible
- ✅ Proper ARIA labels and roles implemented
- ✅ Color contrast ratios meet AA standards (4.5:1)
- ✅ Focus indicators visible and consistent
- ✅ Screen reader support with semantic markup

### **Keyboard Navigation**
- `Tab` - Navigate between interactive elements
- `Enter/Space` - Activate buttons and controls
- `Escape` - Close modals and dropdowns
- `Arrow keys` - Navigate within components (menus, tabs)

### **Screen Reader Support**
```tsx
// Example of proper ARIA implementation
<Button 
  aria-label="Close modal"
  aria-describedby="modal-description"
  onClick={closeModal}
>
  <X aria-hidden="true" />
</Button>
```

## 🚀 **Performance Optimization**

### **Bundle Splitting**
- Each component is tree-shakeable
- Icons lazy-loaded when needed
- Animations conditionally loaded

### **Memory Efficiency**
- React.memo() for expensive renders
- Proper cleanup in useEffect hooks
- Event listener management

### **Reduced Motion Support**
```css
@media (prefers-reduced-motion: reduce) {
  .ff-fade-in-up,
  .ff-hover-scale,
  .ff-pulse-glow {
    animation: none !important;
    transition: none !important;
  }
}
```

## 📚 **Migration Guide**

### **From Legacy Components**
```tsx
// Before - Legacy styling
<button className="btn btn-primary">
  Click me
</button>

// After - FlashFusion UI
<Button variant="primary">
  Click me
</Button>
```

### **Custom Component Integration**
```tsx
// Extending UI components
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CustomButtonProps extends ButtonProps {
  icon?: React.ReactNode;
}

function CustomButton({ icon, children, className, ...props }: CustomButtonProps) {
  return (
    <Button className={cn("space-x-2", className)} {...props}>
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </Button>
  );
}
```

## 🔍 **Troubleshooting**

### **Common Issues**

1. **Styling not applying**
   - Ensure FlashFusion CSS is imported
   - Check CSS variable definitions
   - Verify component className props

2. **TypeScript errors**
   - Update component prop types
   - Check for missing imports
   - Verify interface definitions

3. **Animation issues**
   - Check CSS animation definitions
   - Verify reduced motion preferences
   - Ensure proper CSS variable scope

### **Debug Commands**
```typescript
// Check design system variables
console.log(getComputedStyle(document.documentElement)
  .getPropertyValue('--ff-primary'));

// Verify component registration
console.log(Object.keys(require('@/components/ui')));

// Test accessibility
axe.run().then(results => console.log(results));
```

---

**Last Updated:** Current  
**Maintainers:** FlashFusion UI Team  
**Storybook:** [View Components](http://localhost:6006)  
**Design System:** [FlashFusion Design System](/docs/DESIGN_SYSTEM.md)