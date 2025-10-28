import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  
  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@/components': resolve(__dirname, './components'),
      '@/lib': resolve(__dirname, './lib'),
      '@/utils': resolve(__dirname, './utils'),
      '@/types': resolve(__dirname, './types'),
      '@/styles': resolve(__dirname, './styles'),
      '@/hooks': resolve(__dirname, './hooks'),
      '@/services': resolve(__dirname, './services'),
      '@/data': resolve(__dirname, './data'),
      '@/constants': resolve(__dirname, './constants'),
    },
  },
  
  // Development server - Use Vite's default port 5173
  server: {
    port: 5173,
    host: true,
    open: true,
    hmr: {
      overlay: true,
    },
  },
  
  // Build options
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV === 'development',
    minify: 'terser',
    target: 'es2020',
    
    // Optimize chunks
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['lucide-react', 'motion/react', 'recharts'],
          forms: ['react-hook-form', 'zod'],
          
          // Feature chunks
          auth: ['./components/auth/AuthSystem'],
          gamification: [
            './components/gamification/AchievementSystem',
            './components/gamification/GamificationHub'
          ],
          collaboration: [
            './components/collaboration/LiveCollaborationEditor',
            './components/collaboration/TeamCollaboration'
          ],
          agents: [
            './components/agents/MultiAgentOrchestrationDashboard',
            './components/agents/AgentPerformanceAnalytics'
          ],
          templates: ['./components/templates/AdvancedTemplates'],
          integrations: ['./components/integrations/IntegrationMarketplace'],
          cicd: ['./components/cicd/CICDPipelineIntegration'],
        },
      },
    },
    
    // Terser options for production
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
      },
    },
  },
  
  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    global: 'globalThis',
  },
  
  // Optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@supabase/supabase-js',
      'motion/react',
      'lucide-react',
      'recharts',
      'sonner',
      'react-hook-form',
      'zod',
    ],
    exclude: [
      '@storybook/react',
    ],
  },
  
  // Preview server (for production build testing)
  preview: {
    port: 4173,
    host: true,
  },
  
  // CSS options
  css: {
    devSourcemap: true,
  },
  
  // Ensure proper handling of TypeScript
  esbuild: {
    target: 'es2020',
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
});