# FlashFusion Feature Scaffolding System

## Overview

This directory contains templates and tools for scaffolding complete, production-ready features in the FlashFusion platform. The scaffolding system provides a consistent, best-practice approach to building new features.

## Feature Structure

A complete FlashFusion feature can use one of three specialized templates:

### 1. **Tool Template** (`tool-template/`)
Optimized for interactive tools and utilities

**Best for:**
- Code generators
- Image processors
- Data converters
- AI-powered tools
- Interactive calculators

**Includes:**
- Component with input/output UI
- Real-time processing
- Export/download functionality
- Copy to clipboard
- Advanced options panel
- Service layer for API integration
- Zustand store for state management
- Comprehensive types
- Tests
- Documentation

### 2. **Page Template** (`page-template/`)
Optimized for full-page experiences

**Best for:**
- Dashboard pages
- Settings pages
- Analytics views
- Profile pages
- Documentation pages

**Includes:**
- Full-page layout component
- SEO metadata handling
- Breadcrumb navigation
- Page header with actions
- Responsive grid sections
- Loading skeletons
- Error boundaries
- Service layer for data loading
- Zustand store for state management
- Comprehensive types
- Tests
- Documentation

### 3. **Widget Template** (`widget-template/`)
Optimized for reusable UI components

**Best for:**
- Stat cards
- Chart widgets
- List components
- Summary cards
- Notification widgets

**Includes:**
- Lightweight component
- Multiple size variants
- Composable props
- Grid container helper
- Minimal dependencies (no service/store)
- Comprehensive types
- Tests
- Documentation

### Core Feature Layers

All templates include:

#### **Component Layer** (`components/`)
- Main feature component (e.g., `MyFeature.tsx`)
- Sub-components for complex UI elements
- Loading and error states
- Responsive design patterns

#### **Types** (`types/`)
- TypeScript interfaces and types
- API request/response types
- Component prop types

#### **Tests** (`__tests__/`)
- Unit tests for components
- Service integration tests (tool/page only)
- Store behavior tests (tool/page only)

#### **Documentation** (`docs/`)
- Feature overview and user guide
- API documentation
- Development notes

#### **Service Layer** (`services/`) - Tool & Page only
- API integration logic
- Business logic and data transformations
- Error handling and retry logic
- Caching strategies

#### **State Management** (`stores/`) - Tool & Page only
- Zustand store for feature state
- Computed values and selectors
- Actions and side effects

## Quick Start

### Using the Feature Generator

```bash
# Generate a tool feature (interactive tools)
node src/scaffolding/generate-feature.js --name ImageEditor --type tool

# Generate a page feature (full-page experience)
node src/scaffolding/generate-feature.js --name Dashboard --type page

# Generate a widget feature (reusable component)
node src/scaffolding/generate-feature.js --name StatCard --type widget

# Interactive mode (prompts for all options)
node src/scaffolding/generate-feature.js
```

### Manual Scaffolding

1. Copy the appropriate template:
   ```bash
   # For a tool
   cp -r src/scaffolding/templates/tool-template src/features/my-tool
   
   # For a page
   cp -r src/scaffolding/templates/page-template src/features/my-page
   
   # For a widget
   cp -r src/scaffolding/templates/widget-template src/features/my-widget
   ```

2. Rename and customize files:
   - Update component names
   - Implement feature-specific logic
   - Add types and interfaces
   - Write tests

3. Integrate into the application:
   - Add route (if applicable)
   - Register in navigation
   - Update dependencies

## Feature Types

### Tool Feature (`tool-template/`)
Interactive tools and utilities with AI integration and export capabilities

**Template:** `templates/tool-template/`

**Characteristics:**
- ✨ Input/output processing interface
- 📥 Export and download capabilities
- 📋 Copy to clipboard functionality
- ⚙️ Advanced configuration options
- 🤖 AI service integration ready
- 💾 Result caching and history
- 🔄 Retry logic and error recovery
- ⚡ Real-time processing support

**Use cases:**
- Code generators
- Image processors
- Text analyzers
- Data converters
- AI-powered tools

**Example:**
```bash
node src/scaffolding/generate-feature.js --name CodeGenerator --type tool
```

### Page Feature (`page-template/`)
Full-page experiences with SEO, routing, and analytics

**Template:** `templates/page-template/`

**Characteristics:**
- 🎯 SEO-optimized metadata
- 🧭 Breadcrumb navigation
- 📊 Analytics integration
- 🔍 Loading skeletons
- 📱 Responsive layouts
- 🎨 Section-based organization
- 🔄 Auto-refresh capabilities
- 🚨 Error boundaries

**Use cases:**
- Dashboard pages
- Settings pages
- Analytics views
- Profile pages
- Documentation pages

**Example:**
```bash
node src/scaffolding/generate-feature.js --name AnalyticsDashboard --type page
```

### Widget Feature (`widget-template/`)
Reusable UI components with minimal dependencies

**Template:** `templates/widget-template/`

**Characteristics:**
- 🎨 Multiple size variants (sm, md, lg, xl)
- 🔧 Highly composable
- 📦 Minimal dependencies
- ⚡ Lightweight bundle size
- 🎯 Prop-driven configuration
- 🔄 Loading states
- ♿ Accessibility built-in
- 📐 Grid layout helper

**Use cases:**
- Stat cards
- Chart widgets
- List components
- Summary cards
- Notification widgets

**Example:**
```bash
node src/scaffolding/generate-feature.js --name MetricCard --type widget
```

## Best Practices

### Component Development

1. **Use TypeScript strictly**
   ```typescript
   interface MyFeatureProps {
     onComplete: (result: FeatureResult) => void;
     initialData?: FeatureData;
   }
   
   export const MyFeature: React.FC<MyFeatureProps> = ({ onComplete, initialData }) => {
     // Implementation
   };
   ```

2. **Implement error boundaries**
   ```typescript
   <ErrorBoundary fallback={<FeatureError onRetry={handleRetry} />}>
     <Suspense fallback={<FeatureLoading />}>
       <FeatureContent />
     </Suspense>
   </ErrorBoundary>
   ```

3. **Use FlashFusion design tokens**
   ```css
   background: var(--ff-surface);
   color: var(--ff-text-primary);
   border-radius: var(--ff-radius-lg);
   ```

### Service Layer

1. **Implement proper error handling**
   ```typescript
   export class MyFeatureService {
     async performAction(data: ActionData): Promise<ActionResult> {
       try {
         const response = await api.post('/endpoint', data);
         return this.transformResponse(response);
       } catch (error) {
         throw new FeatureError('Action failed', { cause: error });
       }
     }
   }
   ```

2. **Add caching for expensive operations**
   ```typescript
   private cache = new Map<string, CachedResult>();
   
   async getData(key: string): Promise<Data> {
     if (this.cache.has(key)) {
       return this.cache.get(key)!.data;
     }
     // Fetch and cache
   }
   ```

### State Management

1. **Use Zustand for feature state**
   ```typescript
   export const useMyFeatureStore = create<MyFeatureState>((set, get) => ({
     data: null,
     loading: false,
     error: null,
     
     fetchData: async () => {
       set({ loading: true, error: null });
       try {
         const data = await service.getData();
         set({ data, loading: false });
       } catch (error) {
         set({ error, loading: false });
       }
     }
   }));
   ```

2. **Implement cleanup on unmount**
   ```typescript
   useEffect(() => {
     return () => {
       store.getState().cleanup();
     };
   }, []);
   ```

## Testing Strategy

### Component Tests
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MyFeature } from './MyFeature';

describe('MyFeature', () => {
  it('renders with initial data', () => {
    render(<MyFeature initialData={mockData} />);
    expect(screen.getByText('Feature Title')).toBeInTheDocument();
  });
  
  it('handles user interactions', async () => {
    const onComplete = jest.fn();
    render(<MyFeature onComplete={onComplete} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(onComplete).toHaveBeenCalled());
  });
});
```

### Service Tests
```typescript
import { MyFeatureService } from './MyFeatureService';

describe('MyFeatureService', () => {
  let service: MyFeatureService;
  
  beforeEach(() => {
    service = new MyFeatureService();
  });
  
  it('fetches data successfully', async () => {
    const result = await service.fetchData('test-id');
    expect(result).toBeDefined();
    expect(result.id).toBe('test-id');
  });
  
  it('handles errors gracefully', async () => {
    await expect(service.fetchData('invalid')).rejects.toThrow();
  });
});
```

## Integration Checklist

- [ ] Component implements responsive design
- [ ] TypeScript types are complete and strict
- [ ] Error boundaries are in place
- [ ] Loading states are handled
- [ ] Accessibility attributes are added
- [ ] Service layer has error handling
- [ ] State management is optimized
- [ ] Tests achieve >80% coverage
- [ ] Documentation is complete
- [ ] Feature is integrated into navigation/routing
- [ ] Analytics events are tracked
- [ ] Performance metrics are acceptable

## Performance Guidelines

1. **Lazy load components**
   ```typescript
   const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
   ```

2. **Memoize expensive computations**
   ```typescript
   const expensiveValue = useMemo(() => computeValue(data), [data]);
   ```

3. **Optimize re-renders**
   ```typescript
   const MemoizedComponent = React.memo(MyComponent);
   ```

4. **Use virtualization for long lists**
   ```typescript
   import { useVirtualizer } from '@tanstack/react-virtual';
   ```

## Security Considerations

1. **Validate all user inputs**
2. **Sanitize data before rendering**
3. **Use proper authentication checks**
4. **Implement rate limiting for API calls**
5. **Follow OWASP security guidelines**

## Deployment Checklist

- [ ] Feature flag is configured
- [ ] Environment variables are set
- [ ] Database migrations are ready (if needed)
- [ ] API endpoints are documented
- [ ] Monitoring and logging are configured
- [ ] Error tracking is set up
- [ ] Performance budgets are met
- [ ] Security scan passes
- [ ] User documentation is published
- [ ] Release notes are prepared

## Examples

### Tool Example: Image Processor

```bash
node src/scaffolding/generate-feature.js --name ImageProcessor --type tool --category generation
```

**Generated structure:**
```
src/features/image-processor/
├── components/
│   └── ImageProcessor.tsx       # Tool UI with input/output
├── services/
│   └── ImageProcessorService.ts # Image processing API
├── stores/
│   └── ImageProcessorStore.ts   # State management
├── types/
│   └── feature.types.ts         # Types
├── __tests__/
│   └── ImageProcessor.test.tsx  # Tests
└── docs/
    └── FEATURE_README.md        # Documentation
```

### Page Example: Analytics Dashboard

```bash
node src/scaffolding/generate-feature.js --name AnalyticsDashboard --type page --category analytics
```

**Generated structure:**
```
src/features/analytics-dashboard/
├── components/
│   └── AnalyticsDashboard.tsx   # Full-page layout
├── services/
│   └── AnalyticsDashboardService.ts # Data fetching
├── stores/
│   └── AnalyticsDashboardStore.ts # State management
├── types/
│   └── feature.types.ts         # Types with SEO metadata
├── __tests__/
│   └── AnalyticsDashboard.test.tsx # Tests
└── docs/
    └── FEATURE_README.md        # Documentation
```

### Widget Example: Stat Card

```bash
node src/scaffolding/generate-feature.js --name StatCard --type widget --category ui
```

**Generated structure:**
```
src/features/stat-card/
├── components/
│   └── StatCard.tsx             # Lightweight widget
├── types/
│   └── feature.types.ts         # Prop types
├── __tests__/
│   └── StatCard.test.tsx        # Tests
└── docs/
    └── FEATURE_README.md        # Documentation
```

**Note:** Widgets don't include services or stores by default for minimal dependencies.

## Support

For questions or issues with the scaffolding system:
- Check the [Feature Development Guide](../docs/FEATURE_DEVELOPMENT_GUIDE.md)
- Review existing features for patterns
- Consult the team in #feature-development Slack channel
