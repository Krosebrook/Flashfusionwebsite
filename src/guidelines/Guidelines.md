# FlashFusion Development Guidelines

## Overview
FlashFusion is your intelligent AI development assistant platform that transforms ideas into production-ready applications through advanced AI orchestration. These guidelines ensure consistency, performance, and maintainability across the FlashFusion codebase.

## General Development Principles

### Code Quality
- Use TypeScript for all components with strict type checking
- Follow React best practices with functional components and hooks
- Implement proper error boundaries and error handling
- Use meaningful variable and function names with clear intent
- Keep components small, focused, and reusable
- Implement proper loading states and skeleton screens
- Always handle edge cases and error states

### Performance Optimization
- Use React.memo() for expensive components
- Implement lazy loading for route-based code splitting
- Use useMemo() and useCallback() for expensive computations
- Optimize bundle size with dynamic imports
- Implement proper image optimization and lazy loading
- Use Suspense boundaries for better UX during loading

### Accessibility
- All interactive elements must be keyboard accessible
- Implement proper ARIA labels and roles
- Ensure proper color contrast ratios (4.5:1 minimum)
- Support screen readers with semantic HTML
- Implement focus management for modals and navigation
- Use the `ff-focus-ring` class for consistent focus styles

## FlashFusion Design System

### Brand Colors (AI Assistant Theme)
- **Primary Orange**: `#FF7B00` - Main brand color for CTAs and primary actions
- **Secondary Cyan**: `#00B4D8` - Secondary actions and accents  
- **Accent Magenta**: `#E91E63` - Highlights and special elements
- **BG Dark Navy**: `#0F172A` - Primary background color
- **Surface Slate**: `#1E293B` - Card backgrounds and surfaces
- **Text Primary**: `#FFFFFF` - Primary text color
- **Text Secondary**: `#CBD5E1` - Secondary text color
- **Text Muted**: `#94A3B8` - Muted text and placeholders

### Typography System
- **Primary Font**: Sora (headings, labels, buttons) - Modern geometric sans-serif
- **Secondary Font**: Inter (body text, paragraphs) - Highly readable interface font
- **Monospace Font**: JetBrains Mono (code blocks) - Developer-friendly monospace

### Component Guidelines

#### Buttons
```tsx
// Primary actions (most important)
<Button className="ff-btn-primary">Generate Code</Button>

// Secondary actions
<Button className="ff-btn-secondary">Save Draft</Button>

// Accent actions (special features)
<Button className="ff-btn-accent">Upgrade to Pro</Button>
```

#### Cards
```tsx
// Interactive cards that respond to hover
<Card className="ff-card-interactive">
  <CardContent>...</CardContent>
</Card>
```

#### Focus States
```tsx
// All form inputs should use consistent focus rings
<Input className="ff-focus-ring" />
<Textarea className="ff-focus-ring" />
<Select className="ff-focus-ring" />
```

#### Loading States
```tsx
// Use branded loading components
<FullPageLoader message="FlashFusion is generating your application..." />

// For in-component loading
<div className="ff-fade-in-up">
  <Loader2 className="h-4 w-4 animate-spin" />
</div>
```

## Animation System

### Core Animation Classes
- `ff-fade-in-up` - Subtle entrance animation
- `ff-scale-pop` - Success/completion animations
- `ff-slide-in-left` / `ff-slide-in-right` - Navigation transitions
- `ff-pulse-glow` - Attention-grabbing elements
- `ff-stagger-fade` - Container for staggered child animations

### Hover Effects
- `ff-hover-glow` - Primary glow effect
- `ff-hover-scale` - Subtle scale on hover
- `ff-hover-lift` - Elevation effect for cards

### Usage Example
```tsx
<div className="ff-stagger-fade">
  <Card className="ff-card-interactive ff-hover-lift">
    <Button className="ff-btn-primary ff-hover-glow">
      Generate with FlashFusion
    </Button>
  </Card>
</div>
```

## Component Architecture

### File Structure
- One component per file
- Co-locate types and interfaces
- Use barrel exports from index files
- Separate concerns (logic, UI, types)

### Component Template
```tsx
import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { ComponentProps } from './types';

interface Props {
  // Define props with proper TypeScript types
}

function ComponentName({ prop1, prop2 }: Props) {
  // State management
  const [state, setState] = useState(initialState);
  
  // Memoized handlers
  const handleAction = useCallback(() => {
    // Implementation
  }, [dependencies]);
  
  // Memoized computed values
  const computedValue = useMemo(() => {
    return expensiveCalculation(state);
  }, [state]);
  
  return (
    <Card className="ff-card-interactive">
      <CardHeader>
        <CardTitle className="ff-text-gradient">
          Component Title
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Component content */}
      </CardContent>
    </Card>
  );
}

// Named export for internal use
export { ComponentName };

// Default export for lazy loading
export default ComponentName;
```

## State Management

### Local State
- Use useState for simple component state
- Use useReducer for complex state logic
- Implement proper state updates with immutability

### Global State
- Use Context API for theme and user preferences
- Implement proper error boundaries
- Use Suspense for async state management

### Data Fetching
```tsx
const { data, error, isLoading } = useFetch('/api/endpoint');

if (isLoading) return <FullPageLoader />;
if (error) return <ErrorState error={error} />;
if (!data) return <EmptyState />;

return <DataComponent data={data} />;
```

## Backend Integration

### API Calls
- Always include proper error handling
- Use loading states during requests
- Implement retry mechanisms for failed requests
- Include proper TypeScript types for responses

```tsx
const handleGenerate = async () => {
  setIsLoading(true);
  setError(null);
  
  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    setResult(result);
  } catch (error) {
    console.error('Generation failed:', error);
    setError(error instanceof Error ? error.message : 'Unknown error');
  } finally {
    setIsLoading(false);
  }
};
```

### File Downloads
- Provide real downloadable outputs
- Use proper MIME types and file extensions
- Include progress indicators for large downloads
- Handle download errors gracefully

```tsx
const handleDownload = async () => {
  try {
    const response = await fetch(downloadUrl);
    const blob = await response.blob();
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
    // Show error toast
  }
};
```

## Tool Development Standards

### Input Validation
- Validate all user inputs on both client and server
- Provide clear error messages
- Use proper TypeScript types for validation

### Output Generation
- Generate real, usable code/content
- Include proper file structure and dependencies
- Provide configuration files and documentation
- Ensure outputs are production-ready

### User Experience
- Show progress during generation
- Provide preview capabilities when possible
- Include copy/download/share functionality
- Implement proper error recovery

## Testing Guidelines

### Component Testing
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
  
  it('should handle user interactions', () => {
    render(<ComponentName />);
    fireEvent.click(screen.getByRole('button'));
    // Assert expected behavior
  });
});
```

### Integration Testing
- Test complete user workflows
- Verify API integrations
- Test error scenarios and recovery

## Security Considerations

### Authentication
- Never expose API keys in client code
- Use proper token storage and rotation
- Implement proper session management
- Validate permissions on the server

### Data Handling
- Sanitize all user inputs
- Use HTTPS for all API calls
- Implement proper CORS policies
- Validate file uploads and downloads

## Performance Guidelines

### Bundle Optimization
- Use dynamic imports for large dependencies
- Implement proper tree shaking
- Optimize images and assets
- Use CDN for static assets

### Runtime Performance
- Avoid unnecessary re-renders
- Use proper dependency arrays in hooks
- Implement virtualization for large lists
- Use Web Workers for heavy computations

## Deployment and CI/CD

### Build Process
- Use proper environment variables
- Implement build-time optimizations
- Include proper error handling in builds
- Generate source maps for debugging

### Deployment
- Use automated deployment pipelines
- Implement proper health checks
- Use blue-green deployment for zero downtime
- Monitor deployment metrics

## Documentation Standards

### Code Documentation
- Use JSDoc for complex functions
- Include usage examples in components
- Document API interfaces thoroughly
- Maintain up-to-date README files

### User Documentation
- Provide clear setup instructions
- Include troubleshooting guides
- Document all features and capabilities
- Maintain changelog for updates

## Accessibility Requirements

### WCAG Compliance
- Meet WCAG 2.1 AA standards minimum
- Implement proper heading hierarchy
- Ensure all content is keyboard accessible
- Provide alternative text for images

### Screen Reader Support
- Use semantic HTML elements
- Implement proper ARIA attributes
- Provide skip navigation links
- Test with actual screen readers

## Mobile Responsiveness

### Breakpoints
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

### Touch Interfaces
- Minimum touch target size: 44px
- Implement proper touch feedback
- Support swipe gestures where appropriate
- Optimize for thumb navigation

## Error Handling

### User-Facing Errors
- Provide clear, actionable error messages
- Include recovery suggestions
- Implement proper error boundaries
- Log errors for debugging

### Development Errors
- Use proper TypeScript strict mode
- Implement comprehensive error logging
- Include stack traces in development
- Monitor error rates in production

## Best Practices Summary

1. **Always think production-ready** - Every feature should work in production
2. **User experience first** - Prioritize UX in all decisions
3. **Performance matters** - Optimize for speed and efficiency
4. **Accessibility is required** - Make features usable by everyone
5. **Security by default** - Implement security best practices
6. **Test thoroughly** - Include unit, integration, and e2e tests
7. **Document everything** - Code should be self-documenting
8. **Monitor and measure** - Track performance and user behavior
9. **Iterate based on feedback** - Continuously improve based on user needs
10. **Maintain consistency** - Follow established patterns and conventions