import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@flashfusion/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@flashfusion/utils': path.resolve(__dirname, '../../packages/utils/src'),
      '@flashfusion/types': path.resolve(__dirname, '../../packages/types/src'),
      '@flashfusion/services': path.resolve(__dirname, '../../packages/services/src'),
      '@flashfusion/hooks': path.resolve(__dirname, '../../packages/hooks/src'),
      '@flashfusion/config': path.resolve(__dirname, '../../packages/config/src'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'motion',
      'lucide-react',
      'recharts',
      'sonner'
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@flashfusion/ui'],
          utils: ['@flashfusion/utils'],
          services: ['@flashfusion/services'],
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
});