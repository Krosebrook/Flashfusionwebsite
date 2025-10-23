/**
 * Enhanced Vitest Configuration
 * 
 * Target: Achieve 85%+ test coverage
 * Coverage: Unit, Integration, E2E, Visual Regression
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  test: {
    // Test environment
    environment: 'jsdom',
    
    // Setup files
    setupFiles: [
      './tests/setup.ts',
      './tests/setup-dom.ts',
    ],
    
    // Global test configuration
    globals: true,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      
      // Coverage targets (85%+ for all metrics)
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 85,
        statements: 85,
      },
      
      // Files to include in coverage
      include: [
        'components/**/*.{ts,tsx}',
        'hooks/**/*.{ts,tsx}',
        'utils/**/*.{ts,tsx}',
        'services/**/*.{ts,tsx}',
        'lib/**/*.{ts,tsx}',
      ],
      
      // Files to exclude from coverage
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/*.stories.{ts,tsx}',
        '**/types/**',
        '**/constants/**',
        '**/node_modules/**',
        '**/dist/**',
        '**/.{idea,git,cache,output,temp}/**',
        // Exclude test utilities
        'tests/**',
        // Exclude configuration files
        '*.config.{ts,js}',
        // Exclude type definition files
        '**/*.d.ts',
      ],
      
      // Coverage reporters
      reporter: [
        'text',           // Console output
        'text-summary',   // Summary in console
        'html',           // HTML report
        'lcov',           // LCOV for CI/CD
        'json',           // JSON for programmatic access
      ],
      
      // Output directory
      reportsDirectory: './coverage',
      
      // All files must be covered
      all: true,
      
      // Clean coverage before each run
      clean: true,
      
      // Skip full coverage for some directories
      skipFull: false,
    },
    
    // Test execution
    testTimeout: 10000, // 10 seconds
    hookTimeout: 10000,
    
    // Parallel execution
    threads: true,
    maxThreads: 4,
    minThreads: 1,
    
    // Reporter
    reporters: [
      'default',
      'verbose',
      'html',
      'json',
    ],
    
    // Output
    outputFile: {
      html: './test-results/index.html',
      json: './test-results/results.json',
    },
    
    // Watch mode
    watch: false,
    
    // Include patterns
    include: [
      'tests/**/*.test.{ts,tsx}',
      'tests/**/*.spec.{ts,tsx}',
      'components/**/__tests__/**/*.{ts,tsx}',
      'hooks/**/__tests__/**/*.{ts,tsx}',
      'utils/**/__tests__/**/*.{ts,tsx}',
    ],
    
    // Exclude patterns
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/archive/**',
    ],
    
    // Mock configuration
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
    
    // CSS/Asset handling
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    
    // Aliases (same as Vite config)
    alias: {
      '@': path.resolve(__dirname, './'),
      '@components': path.resolve(__dirname, './components'),
      '@hooks': path.resolve(__dirname, './hooks'),
      '@utils': path.resolve(__dirname, './utils'),
      '@services': path.resolve(__dirname, './services'),
      '@lib': path.resolve(__dirname, './lib'),
      '@types': path.resolve(__dirname, './types'),
      '@styles': path.resolve(__dirname, './styles'),
    },
    
    // Snapshot configuration
    snapshotFormat: {
      escapeString: false,
      printBasicPrototype: false,
    },
    
    // Update snapshots
    update: false,
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@components': path.resolve(__dirname, './components'),
      '@hooks': path.resolve(__dirname, './hooks'),
      '@utils': path.resolve(__dirname, './utils'),
      '@services': path.resolve(__dirname, './services'),
      '@lib': path.resolve(__dirname, './lib'),
      '@types': path.resolve(__dirname, './types'),
      '@styles': path.resolve(__dirname, './styles'),
    },
  },
});

/**
 * Test Coverage Strategy:
 * 
 * 1. Unit Tests (Target: 90%+)
 *    - All utility functions
 *    - All hooks
 *    - All services
 *    - Pure components
 * 
 * 2. Integration Tests (Target: 80%+)
 *    - User workflows
 *    - API integrations
 *    - State management
 *    - Authentication flows
 * 
 * 3. E2E Tests (Critical Paths)
 *    - User registration/login
 *    - AI generation workflows
 *    - Deployment processes
 *    - Payment flows
 * 
 * 4. Visual Regression Tests
 *    - Component snapshots
 *    - Layout consistency
 *    - Responsive design
 * 
 * Overall Target: 85%+ total coverage
 */
