# 🧱 Core System Components

## 📋 **Overview**

The core system components form the foundation of FlashFusion, handling application initialization, system detection, and high-level routing.

## 📁 **Components in this Chunk**

### **App.tsx** - Main Application Entry Point
**Purpose:** Application initialization and high-level state management
**Dependencies:** All core utilities and interface components
**Key Features:**
- System capability detection
- Loading state management  
- Error boundary integration
- Mode-based rendering (full/lite/emergency)

### **flash-fusion-interface.tsx** - Core Interface Manager  
**Purpose:** Main application interface with routing and layout
**Dependencies:** Navigation, pages, UI components
**Key Features:**
- Route management and navigation
- Page rendering and transitions
- Layout management
- Performance mode handling

### **system-detection.ts** - System Capability Detection
**Purpose:** Intelligent system resource detection
**Dependencies:** None (pure utility)
**Key Features:**
- Memory detection
- Connection quality assessment
- Browser capability checks
- Performance mode recommendations

## 🔧 **API Reference**

### **App Component**

```tsx
/**
 * Main FlashFusion Application Component
 * Handles initialization, system detection, and high-level routing
 */
function App(): JSX.Element
```

**State Management:**
- `mode: AppMode` - Current application mode (full/lite/emergency)
- `isLoading: boolean` - Application initialization state

**Lifecycle:**
1. Initialize system detection
2. Determine optimal performance mode
3. Render appropriate interface or fallback

### **FlashFusionInterface Component**

```tsx
/**
 * Core application interface with routing and layout management
 */
interface FlashFusionInterfaceProps {
  mode: AppMode; // Performance mode from system detection
}

function FlashFusionInterface(props: FlashFusionInterfaceProps): JSX.Element
```

**Features:**
- Intelligent route navigation with smooth transitions
- Mode-aware component rendering
- Performance indicators for lite mode
- Error boundaries for graceful degradation

### **System Detection Utilities**

```tsx
/**
 * Detect optimal application mode based on system capabilities
 */
function detectSystemCapabilities(): AppMode

/**
 * Initialize application with system detection
 */
async function initializeApp(): Promise<AppMode>
```

**Detection Criteria:**
- Device memory: `< 1GB = emergency, < 2GB = lite, >= 2GB = full`
- Connection: `slow-2g = lite mode`
- Browser: `Missing modern APIs = lite mode`
- Memory usage: `> 90% heap = lite mode`

## 🎯 **Usage Examples**

### **Basic App Initialization**
```tsx
import App from './components/core/App';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
```

### **Custom System Detection**
```tsx
import { detectSystemCapabilities, initializeApp } from './utils/system-detection';

// Manual detection
const mode = detectSystemCapabilities();
console.log(`System mode: ${mode}`);

// Full initialization with logging
const appMode = await initializeApp();
console.log(`FlashFusion initialized in ${appMode} mode`);
```

## 🚀 **Performance Considerations**

### **Memory Management**
- Emergency mode: < 1GB RAM detected
- Lite mode: < 2GB RAM or high memory usage
- Full mode: Optimal system resources available

### **Loading Strategy**
- Progressive enhancement based on system capabilities
- Graceful degradation for low-resource environments
- Intelligent component lazy loading

### **Error Recovery**
- Multiple fallback modes for different failure scenarios
- Automatic retry mechanisms with exponential backoff
- User-friendly error messages with recovery suggestions

## 🧪 **Testing**

### **Unit Tests**
```tsx
// Test system detection logic
describe('System Detection', () => {
  it('should detect emergency mode for low memory', () => {
    // Mock low memory environment
    const mode = detectSystemCapabilities();
    expect(mode).toBe('emergency');
  });
});
```

### **Integration Tests**
```tsx
// Test full app initialization flow
describe('App Initialization', () => {
  it('should initialize with correct mode', async () => {
    const mode = await initializeApp();
    expect(['full', 'lite', 'emergency']).toContain(mode);
  });
});
```

## 🔍 **Debugging Guide**

### **Common Issues**

1. **App stuck in loading state**
   - Check console for initialization errors
   - Verify system detection is completing
   - Ensure all required dependencies are loaded

2. **Emergency mode activation**
   - Check device memory availability
   - Monitor browser memory usage
   - Verify network connection quality

3. **Navigation not working**
   - Check route definitions in FlashFusionInterface
   - Verify navigation hooks are properly initialized
   - Ensure error boundaries aren't catching navigation errors

### **Debug Commands**
```typescript
// Enable detailed logging
localStorage.setItem('ff-debug-mode', 'true');

// Force specific mode for testing
localStorage.setItem('ff-emergency-mode', 'true'); // Emergency
localStorage.setItem('ff-lite-mode', 'true');      // Lite
localStorage.removeItem('ff-emergency-mode');       // Full

// Check system capabilities
console.log('System:', detectSystemCapabilities());
console.log('Memory:', navigator.deviceMemory);
console.log('Connection:', navigator.connection?.effectiveType);
```

## 📚 **Related Documentation**

- [System Detection Guide](/utils/system-detection.ts)
- [Performance Optimization](/docs/PERFORMANCE.md)
- [Error Handling Strategy](/docs/ERROR_HANDLING.md)
- [Testing Guidelines](/docs/TESTING.md)

## 🛠️ **Development Commands**

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run core system tests
npm run test:core

# Performance profiling
npm run profile:core
```

---

**Last Updated:** Current  
**Maintainers:** FlashFusion Core Team  
**Need Help?** Check [TROUBLESHOOTING.md](/docs/TROUBLESHOOTING.md)