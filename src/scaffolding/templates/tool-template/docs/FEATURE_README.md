# {{FEATURE_NAME}} - Tool Documentation

## Overview

{{FEATURE_DESCRIPTION}}

This tool is built using the FlashFusion scaffolding system and follows best practices for interactive tool development.

## Features

- ✨ **Real-time Processing**: Process input data in real-time with immediate feedback
- 📥 **Export Results**: Download processed results in multiple formats
- 📋 **Copy to Clipboard**: Quickly copy results for use in other applications
- ⚙️ **Advanced Options**: Configure processing parameters for optimal results
- 🔄 **Retry Logic**: Automatic retry on failures with exponential backoff
- 💾 **Result History**: Keep track of previous processing sessions
- 🎨 **Responsive UI**: Works seamlessly on desktop, tablet, and mobile devices
- ♿ **Accessible**: WCAG 2.1 AA compliant with keyboard navigation support

## Usage

### Basic Usage

```typescript
import { {{FEATURE_NAME}}Tool } from './components/FeatureTemplate';

function MyApp() {
  return (
    <{{FEATURE_NAME}}Tool
      initialInput="Your input here"
      onComplete={(result) => {
        console.log('Processing complete:', result);
      }}
    />
  );
}
```

### With Configuration

```typescript
<{{FEATURE_NAME}}Tool
  config={{
    enabled: {
      autoProcess: true,
      caching: true,
      aiPowered: true,
      realTime: false
    },
    settings: {
      quality: 'high',
      timeout: 30000,
      maxInputSize: 1024 * 1024 // 1MB
    }
  }}
  enableExport={true}
  enableCopy={true}
  showAdvancedOptions={true}
/>
```

### Handling Callbacks

```typescript
<{{FEATURE_NAME}}Tool
  onComplete={(result) => {
    console.log('Success!', result.output);
    console.log('Processing time:', result.metadata?.processingTime);
  }}
  onError={(error) => {
    console.error('Processing failed:', error.message);
  }}
/>
```

## API Reference

### Component Props

#### FeatureToolProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `Partial<FeatureConfig>` | `undefined` | Configuration options |
| `onComplete` | `(result: FeatureResult) => void` | `undefined` | Callback on success |
| `onError` | `(error: Error) => void` | `undefined` | Callback on error |
| `initialInput` | `string` | `''` | Initial input value |
| `enableExport` | `boolean` | `true` | Enable export functionality |
| `enableCopy` | `boolean` | `true` | Enable copy functionality |
| `showAdvancedOptions` | `boolean` | `false` | Show advanced options by default |
| `className` | `string` | `''` | Custom CSS classes |

### Configuration Options

#### FeatureConfig

```typescript
interface FeatureConfig {
  enabled: {
    autoProcess: boolean;      // Auto-process on input change
    caching: boolean;           // Cache results
    analytics: boolean;         // Track usage analytics
    aiPowered: boolean;         // Use AI for processing
    realTime: boolean;          // Real-time processing
  };
  
  settings: {
    timeout: number;            // Processing timeout (ms)
    retryAttempts: number;      // Number of retry attempts
    retryDelay: number;         // Delay between retries (ms)
    maxInputSize: number;       // Max input size (bytes)
    maxOutputSize: number;      // Max output size (bytes)
    quality: 'low' | 'medium' | 'high' | 'ultra';
  };
  
  export: {
    formats: ('txt' | 'json' | 'csv' | 'md')[];
    includeMetadata: boolean;
    compression: boolean;
  };
  
  ui: {
    theme: 'auto' | 'light' | 'dark';
    compact: boolean;
    showAdvanced: boolean;
    animationsEnabled: boolean;
  };
}
```

### Store Actions

Access these via the `useFeatureStore` hook:

```typescript
const {
  processData,      // Process input data
  updateConfig,     // Update configuration
  clearError,       // Clear error state
  reset,            // Reset to initial state
  clearHistory,     // Clear processing history
  exportResult      // Export result
} = useFeatureStore();
```

### Service Methods

```typescript
const service = FeatureService.getInstance();

// Process data
const result = await service.processData(data, config);

// Export result
await service.exportResult(result, { format: 'json' });

// Validate input
const validation = service.validateInput(input);
```

## Processing Flow

1. **Input**: User enters data in the input area
2. **Validation**: Input is validated against rules
3. **Processing**: Data is processed (may involve API calls)
4. **Result**: Output is displayed with metadata
5. **Export**: User can copy or download the result

## Error Handling

The tool handles various error scenarios:

- **Invalid Input**: Shows validation errors
- **Processing Timeout**: Allows retry with adjusted timeout
- **Network Errors**: Automatic retry with exponential backoff
- **Rate Limiting**: Displays wait time and retry after delay
- **API Errors**: Shows error message with recovery suggestions

## Export Formats

Supported export formats:

- **Text (.txt)**: Plain text output
- **JSON (.json)**: Structured data with metadata
- **CSV (.csv)**: Comma-separated values (if applicable)
- **Markdown (.md)**: Formatted markdown output

## Performance

- **Lazy Loading**: Component is loaded on demand
- **Memoization**: Expensive computations are memoized
- **Caching**: Results are cached to avoid redundant processing
- **Debouncing**: Input changes are debounced for auto-process mode
- **Bundle Size**: ~15KB gzipped (component + dependencies)

## Accessibility

- ✅ Keyboard navigation support
- ✅ Screen reader compatible
- ✅ Focus management
- ✅ ARIA labels and roles
- ✅ Color contrast compliance
- ✅ Reduced motion support

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 14+, Chrome Android 90+

## Examples

### Image Processing Tool

```typescript
<ImageEditorTool
  config={{
    settings: {
      quality: 'high',
      maxInputSize: 10 * 1024 * 1024 // 10MB
    }
  }}
  enableExport={true}
/>
```

### Text Analysis Tool

```typescript
<TextAnalyzerTool
  initialInput="Analyze this text..."
  config={{
    enabled: {
      aiPowered: true,
      realTime: true
    }
  }}
  onComplete={(result) => {
    console.log('Analysis:', result.data);
  }}
/>
```

### Code Generator Tool

```typescript
<CodeGeneratorTool
  config={{
    export: {
      formats: ['txt', 'json'],
      includeMetadata: true
    }
  }}
  showAdvancedOptions={true}
/>
```

## Troubleshooting

### Processing Fails Immediately

- Check input validation requirements
- Verify API endpoint is accessible
- Check browser console for errors

### Results Not Showing

- Ensure `onComplete` callback is not preventing default behavior
- Check that result tab is active
- Verify processing completed successfully (check status)

### Export Not Working

- Check browser permissions for downloads
- Verify result data is available
- Check export format is supported

### Performance Issues

- Reduce input size
- Disable real-time processing
- Enable caching
- Use lower quality settings

## Development

### Adding Custom Processing

Edit `services/FeatureService.ts`:

```typescript
async processData(data: FeatureData, config: FeatureConfig): Promise<FeatureResult> {
  // Your custom processing logic here
  const output = await this.customProcessing(data.input);
  
  return {
    output,
    metadata: {
      processingTime: Date.now() - startTime
    }
  };
}
```

### Customizing UI

Edit `components/FeatureTemplate.tsx` to modify the user interface.

### Adding Advanced Options

1. Add option to `FeatureConfig` in `types/feature.types.ts`
2. Add UI control in the Advanced Options section
3. Use option value in processing logic

## Testing

```bash
# Run tests
npm test FeatureTemplate.test.tsx

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

## License

Part of the FlashFusion platform. See main repository for license information.

## Support

For issues or questions:
- Check the [main documentation](../../README.md)
- Review [feature development guide](../../../../docs/FEATURE_DEVELOPMENT_GUIDE.md)
- Contact the development team
