/**
 * Advanced Vite Bundle Optimization Configuration
 * 
 * Target: Reduce bundle size from 650KB to <300KB
 * Strategy: Code splitting, tree shaking, compression, lazy loading
 */

import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { compression } from 'vite-plugin-compression2';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    react({
      // Enable automatic JSX runtime
      jsxRuntime: 'automatic',
      
      // Babel optimization
      babel: {
        plugins: [
          // Remove unnecessary code in production
          ['babel-plugin-transform-remove-console', { exclude: ['error', 'warn'] }],
        ],
      },
    }),
    
    // Brotli compression (better than gzip)
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 10240, // Only compress files > 10KB
      deleteOriginFile: false,
    }),
    
    // Gzip compression (fallback for older browsers)
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 10240,
      deleteOriginFile: false,
    }),
    
    // Legacy browser support (optional - adds ~50KB)
    // Uncomment if you need IE11 support
    // legacy({
    //   targets: ['defaults', 'not IE 11'],
    // }),
    
    // Bundle visualizer (run with ANALYZE=true)
    process.env.ANALYZE === 'true' &&
      visualizer({
        filename: './dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean) as Plugin[],

  build: {
    // Target modern browsers for smaller bundle
    target: 'es2020',
    
    // Enable minification
    minify: 'terser',
    
    terserOptions: {
      compress: {
        // Remove console.log in production
        drop_console: true,
        drop_debugger: true,
        
        // Advanced optimizations
        passes: 2,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        
        // Remove dead code
        dead_code: true,
        unused: true,
      },
      
      mangle: {
        // Mangle property names for smaller size
        properties: {
          // Don't mangle React internals
          reserved: ['useState', 'useEffect', 'useCallback', 'useMemo'],
        },
      },
      
      format: {
        // Remove comments
        comments: false,
      },
    },
    
    // Code splitting configuration
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          // React core
          'react-core': ['react', 'react-dom', 'react/jsx-runtime'],
          
          // Router
          'router': ['react-router-dom'],
          
          // UI library
          'ui-core': [
            './components/ui/button.tsx',
            './components/ui/card.tsx',
            './components/ui/input.tsx',
            './components/ui/label.tsx',
            './components/ui/select.tsx',
            './components/ui/dialog.tsx',
            './components/ui/sheet.tsx',
          ],
          
          // Icons (heavy dependency)
          'icons': ['lucide-react'],
          
          // Charts (only load when needed)
          'charts': ['recharts'],
          
          // AI/ML heavy features
          'ai-tools': [
            './components/ai/AICodeIntelligenceSystem.tsx',
            './components/ai/MultiModelAIService.tsx',
            './components/tools/generation/CodeGeneratorTool.tsx',
          ],
          
          // Analytics
          'analytics': [
            './components/analytics/FlashFusionBusinessIntelligenceHub.tsx',
            './components/analytics/IntelligentAnalyticsDashboard.tsx',
          ],
          
          // Workflows
          'workflows': [
            './components/workflows/AICreationWorkflow.tsx',
            './components/workflows/OneClickPublishingWorkflow.tsx',
            './components/workflows/CreatorCommerceWorkflow.tsx',
            './components/workflows/EnterpriseSecurityWorkflow.tsx',
            './components/workflows/SmartAnalyticsWorkflow.tsx',
            './components/workflows/QualityAssuranceWorkflow.tsx',
          ],
          
          // Vendor chunks (external dependencies)
          'vendor-utils': [
            'clsx',
            'date-fns',
            'zod',
          ],
        },
        
        // Optimize chunk file names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()
            : 'chunk';
          return `assets/js/${facadeModuleId}-[hash].js`;
        },
        
        // Optimize entry file names
        entryFileNames: 'assets/js/[name]-[hash].js',
        
        // Optimize asset file names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.');
          let extType = info?.[info.length - 1] || '';
          
          // Group by file type
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
            extType = 'images';
          } else if (/\.(woff2?|ttf|otf|eot)$/i.test(assetInfo.name || '')) {
            extType = 'fonts';
          } else if (/\.css$/i.test(assetInfo.name || '')) {
            extType = 'css';
          }
          
          return `assets/${extType}/[name]-[hash][extname]`;
        },
      },
      
      // External dependencies (don't bundle these)
      external: [
        // Externalize heavy dependencies if using CDN
        // 'react',
        // 'react-dom',
      ],
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 500, // Warn if chunk > 500KB
    
    // Asset size reporting
    reportCompressedSize: true,
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Source maps (disable in production for smaller bundle)
    sourcemap: process.env.NODE_ENV === 'development',
  },
  
  // Dependency optimization
  optimizeDeps: {
    include: [
      // Pre-bundle these dependencies
      'react',
      'react-dom',
      'react/jsx-runtime',
    ],
    
    exclude: [
      // Don't pre-bundle these (lazy load instead)
      '@supabase/supabase-js',
    ],
  },
  
  // Performance
  server: {
    // Fast refresh
    hmr: {
      overlay: true,
    },
  },
  
  // CSS optimization
  css: {
    modules: {
      // CSS modules naming
      localsConvention: 'camelCaseOnly',
    },
    
    preprocessorOptions: {
      // Remove unused CSS
      scss: {
        additionalData: `@import "./styles/variables.scss";`,
      },
    },
  },
});

/**
 * Bundle Size Targets (gzipped):
 * 
 * - Main bundle: <150 KB
 * - React core: ~45 KB
 * - UI core: ~40 KB
 * - Icons: ~30 KB
 * - Router: ~10 KB
 * - Vendor utils: ~20 KB
 * - Total initial load: ~150 KB
 * 
 * Lazy-loaded chunks:
 * - AI tools: ~80 KB
 * - Analytics: ~60 KB
 * - Workflows: ~70 KB
 * - Charts: ~50 KB
 * 
 * Total application: <300 KB (initial) + <260 KB (lazy)
 */
