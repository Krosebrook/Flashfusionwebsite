# Feature Scaffolding Examples

This document provides practical examples of using the FlashFusion feature scaffolding system.

## Quick Start

### Using npm scripts (recommended)

```bash
# Interactive mode (prompts for all options)
npm run scaffold

# Generate a tool with all options
npm run scaffold:tool -- --name MyTool --description "Description here"

# Generate a page
npm run scaffold:page -- --name MyPage --description "Description here"

# Generate a widget
npm run scaffold:widget -- --name MyWidget --description "Description here"
```

### Using node directly

```bash
# Full command
node src/scaffolding/generate-feature.js --name MyFeature --type tool --description "My feature" --category general

# With options
node src/scaffolding/generate-feature.js --name MyFeature --type tool --no-service --no-tests
```

## Real-World Examples

### Example 1: Image Editor Tool

Create an interactive tool for editing images with AI.

```bash
npm run scaffold:tool -- --name ImageEditor --description "AI-powered image editing tool" --category generation
```

**Generated files:**
- `src/features/image-editor/components/ImageEditor.tsx`
- `src/features/image-editor/services/ImageEditorService.ts`
- `src/features/image-editor/stores/ImageEditorStore.ts`
- `src/features/image-editor/types/feature.types.ts`
- `src/features/image-editor/__tests__/ImageEditor.test.tsx`
- `src/features/image-editor/docs/FEATURE_README.md`

**Key features:**
- Input/output tabs for before/after
- Export in multiple formats
- Copy to clipboard
- Advanced processing options
- Real-time preview

**Next steps:**
1. Implement image processing logic in `ImageEditorService.ts`
2. Add AI API integration
3. Customize UI in `ImageEditor.tsx`
4. Add image format options

### Example 2: Analytics Dashboard Page

Create a full dashboard page with charts and metrics.

```bash
npm run scaffold:page -- --name AnalyticsDashboard --description "Analytics and metrics dashboard" --category analytics
```

**Generated files:**
- `src/features/analytics-dashboard/components/AnalyticsDashboard.tsx`
- `src/features/analytics-dashboard/services/AnalyticsDashboardService.ts`
- `src/features/analytics-dashboard/stores/AnalyticsDashboardStore.ts`
- `src/features/analytics-dashboard/types/feature.types.ts`
- `src/features/analytics-dashboard/__tests__/AnalyticsDashboard.test.tsx`
- `src/features/analytics-dashboard/docs/FEATURE_README.md`

**Key features:**
- SEO-optimized metadata
- Breadcrumb navigation
- Responsive grid layout
- Multiple sections for different metrics
- Auto-refresh capability

**Next steps:**
1. Implement data fetching in `AnalyticsDashboardService.ts`
2. Add chart components to sections
3. Configure SEO metadata
4. Add route to router
5. Update navigation menu

### Example 3: Metric Card Widget

Create a reusable stat card for displaying metrics.

```bash
npm run scaffold:widget -- --name MetricCard --description "Reusable metric display card" --category ui
```

**Generated files:**
- `src/features/metric-card/components/MetricCard.tsx`
- `src/features/metric-card/types/feature.types.ts`
- `src/features/metric-card/__tests__/MetricCard.test.tsx`
- `src/features/metric-card/docs/FEATURE_README.md`

**Key features:**
- Multiple size variants
- Lightweight (no service/store)
- Composable props
- Grid helper included

**Next steps:**
1. Customize the widget layout
2. Add stat-specific props
3. Add trend indicators
4. Use in dashboard pages

### Example 4: Code Generator Tool

Create a tool that generates code from templates.

```bash
npm run scaffold:tool -- --name CodeGenerator --description "Generate code from templates" --category generation
```

**Customization:**
1. Edit `CodeGeneratorService.ts`:
   ```typescript
   async processData(data: FeatureData, config: FeatureConfig): Promise<FeatureResult> {
     const template = this.loadTemplate(config.settings.template);
     const generated = this.applyTemplate(template, data.input);
     
     return {
       output: generated,
       metadata: {
         processingTime: Date.now() - startTime,
         linesGenerated: generated.split('\n').length
       }
     };
   }
   ```

2. Add template options in component:
   ```typescript
   <Select
     value={selectedTemplate}
     onValueChange={setSelectedTemplate}
   >
     <SelectItem value="react">React Component</SelectItem>
     <SelectItem value="vue">Vue Component</SelectItem>
     <SelectItem value="api">API Endpoint</SelectItem>
   </Select>
   ```

### Example 5: Settings Page

Create a settings page with multiple configuration sections.

```bash
npm run scaffold:page -- --name Settings --description "Application settings and preferences" --category app
```

**Customization:**
1. Define settings sections in component:
   ```typescript
   const sections: PageSection[] = [
     {
       id: 'account',
       title: 'Account Settings',
       icon: User,
       content: <AccountSettings />
     },
     {
       id: 'appearance',
       title: 'Appearance',
       icon: Palette,
       content: <AppearanceSettings />
     },
     {
       id: 'security',
       title: 'Security',
       icon: Shield,
       content: <SecuritySettings />
     }
   ];
   ```

2. Add form handling in store:
   ```typescript
   saveSettings: async (settings: Partial<Settings>) => {
     set({ status: 'loading' });
     try {
       await service.updateSettings(settings);
       set({ status: 'success', data: settings });
     } catch (error) {
       set({ status: 'error', error });
     }
   }
   ```

### Example 6: Notification Widget

Create a lightweight notification widget.

```bash
npm run scaffold:widget -- --name NotificationCard --description "Display notification messages" --category ui
```

**Customization:**
1. Add notification types:
   ```typescript
   export type NotificationType = 'info' | 'success' | 'warning' | 'error';
   
   interface NotificationCardProps extends FeatureWidgetProps {
     type: NotificationType;
     message: string;
     timestamp?: Date;
     onDismiss?: () => void;
   }
   ```

2. Add type-specific styling:
   ```typescript
   const typeClasses = {
     info: 'border-blue-500 bg-blue-50',
     success: 'border-green-500 bg-green-50',
     warning: 'border-yellow-500 bg-yellow-50',
     error: 'border-red-500 bg-red-50'
   };
   ```

## Template Comparison

### When to use each template

| Use Case | Template | Why |
|----------|----------|-----|
| Process user input | Tool | Input/output UI, export, copy |
| Full page with routing | Page | SEO, navigation, sections |
| Reusable component | Widget | Lightweight, composable |
| AI integration | Tool | Service layer, streaming support |
| Dashboard | Page | Multiple sections, analytics |
| Chart/stat display | Widget | Minimal deps, prop-driven |
| Data transformation | Tool | Processing, caching, history |
| Settings/config | Page | Forms, sections, persistence |

## Advanced Usage

### Minimal Widget (No Tests)

For quick prototyping:

```bash
npm run scaffold:widget -- --name QuickCard --no-tests
```

### Tool Without Service

For client-side only processing:

```bash
npm run scaffold:tool -- --name ClientTool --no-service
```

### Page With Custom Layout

Generate and then customize sections:

```bash
npm run scaffold:page -- --name CustomPage
# Then edit the sections array in CustomPage.tsx
```

## Integration Guide

### Adding to Router

For pages:

```typescript
// In your router configuration
import { AnalyticsDashboard } from '@/features/analytics-dashboard';

const routes = [
  {
    path: '/analytics',
    element: <AnalyticsDashboard />
  }
];
```

### Adding to Navigation

```typescript
// In your navigation config
{
  id: 'analytics',
  label: 'Analytics',
  path: '/analytics',
  icon: BarChart3
}
```

### Using Widgets

```typescript
import { MetricCard, WidgetGrid } from '@/features/metric-card';

function Dashboard() {
  return (
    <WidgetGrid cols={{ default: 1, md: 2, lg: 3 }}>
      <MetricCard
        title="Total Users"
        value="1,234"
        icon={Users}
        size="md"
      />
      <MetricCard
        title="Revenue"
        value="$12,345"
        icon={DollarSign}
        size="md"
      />
    </WidgetGrid>
  );
}
```

### Using Tools

```typescript
import { ImageEditor } from '@/features/image-editor';

function ImageEditorPage() {
  return (
    <ImageEditor
      config={{
        settings: { quality: 'high' }
      }}
      onComplete={(result) => {
        console.log('Image processed:', result);
      }}
    />
  );
}
```

## Best Practices

### 1. Choose the Right Template

- **Tool**: Interactive features with input→processing→output flow
- **Page**: Full-page experiences with routing and SEO
- **Widget**: Small, reusable UI components

### 2. Customize Immediately

After generation:
1. Review generated files
2. Replace placeholder content
3. Add feature-specific types
4. Implement business logic
5. Write tests

### 3. Follow Naming Conventions

- **PascalCase** for feature names: `ImageEditor`, `AnalyticsDashboard`
- **kebab-case** for directories: `image-editor`, `analytics-dashboard`
- Keep names descriptive and concise

### 4. Organize by Feature

```
src/features/
├── image-editor/        # Tool
├── analytics-dashboard/ # Page
└── metric-card/         # Widget
```

### 5. Document Your Features

Update the generated README with:
- Specific usage examples
- Configuration options
- API integration details
- Known limitations

## Troubleshooting

### Feature Already Exists

**Error:** `Error: Feature already exists at src/features/my-feature`

**Solution:** Choose a different name or remove the existing feature:
```bash
rm -rf src/features/my-feature
```

### Invalid Feature Name

**Error:** `Error: Feature name must be in PascalCase`

**Solution:** Use PascalCase (e.g., MyFeature, not myFeature or my-feature)

### Template Not Found

**Error:** `Invalid feature type`

**Solution:** Use one of the valid types: `tool`, `page`, or `widget`

## Tips & Tricks

### 1. Use Interactive Mode

For new features, start with interactive mode to explore options:
```bash
npm run scaffold
```

### 2. Copy Example Features

Learn from generated examples:
```bash
npm run scaffold:tool -- --name ExampleTool
# Study the generated code
# Delete when done learning
```

### 3. Combine Templates

Create a tool, then add widgets for sub-components:
```bash
npm run scaffold:tool -- --name ImageEditor
npm run scaffold:widget -- --name ImagePreview
# Use ImagePreview widget inside ImageEditor
```

### 4. Iterate Quickly

Generate, test, delete, regenerate:
```bash
npm run scaffold:widget -- --name TestCard --no-tests
# Test the structure
rm -rf src/features/test-card
# Regenerate with modifications
```

## Resources

- [Scaffolding README](./README.md) - Complete documentation
- [Feature Development Guide](../../docs/FEATURE_DEVELOPMENT_GUIDE.md) - Best practices
- [Component Library](../../docs/COMPONENTS.md) - Available UI components
- [Type Definitions](./templates/*/types/) - Type reference for each template

## Support

For issues or questions:
1. Check the [scaffolding README](./README.md)
2. Review template documentation in `templates/*/docs/`
3. Look at generated FEATURE_README.md for feature-specific info
4. Contact the development team
