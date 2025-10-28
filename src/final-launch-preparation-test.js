#!/usr/bin/env node

/**
 * FlashFusion Final Launch Preparation Test Suite
 * Comprehensive testing for production readiness
 */

const fs = require('fs');
const path = require('path');

console.log('\n🚀 FlashFusion Final Launch Preparation Test Suite');
console.log('=' .repeat(60));

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const testResults = [];

function runTest(testName, testFunction) {
  totalTests++;
  try {
    const result = testFunction();
    if (result === true || result === undefined) {
      passedTests++;
      console.log(`✅ ${testName}`);
      testResults.push({ name: testName, status: 'PASS', details: 'OK' });
    } else {
      failedTests++;
      console.log(`❌ ${testName}: ${result}`);
      testResults.push({ name: testName, status: 'FAIL', details: result });
    }
  } catch (error) {
    failedTests++;
    console.log(`❌ ${testName}: ${error.message}`);
    testResults.push({ name: testName, status: 'FAIL', details: error.message });
  }
}

// Test 1: Critical Files Exist
runTest('Critical Files Exist', () => {
  const criticalFiles = [
    'App.tsx',
    'package.json',
    'vite.config.ts',
    'tsconfig.json',
    'styles/globals.css',
    'Guidelines.md'
  ];
  
  for (const file of criticalFiles) {
    if (!fs.existsSync(file)) {
      return `Missing critical file: ${file}`;
    }
  }
  return true;
});

// Test 2: Fixed Component Files Exist
runTest('Fixed Components Exist', () => {
  const fixedComponents = [
    'components/deployment/AdvancedProductionDeployment.tsx',
    'components/tools/EnhancedWorkflowBuilder.tsx'
  ];
  
  for (const component of fixedComponents) {
    if (!fs.existsSync(component)) {
      return `Missing fixed component: ${component}`;
    }
  }
  return true;
});

// Test 3: Package.json Structure
runTest('Package.json Validation', () => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (!packageJson.name) return 'Missing package name';
  if (!packageJson.version) return 'Missing package version';
  if (!packageJson.scripts) return 'Missing package scripts';
  if (!packageJson.scripts.dev) return 'Missing dev script';
  if (!packageJson.scripts.build) return 'Missing build script';
  if (!packageJson.dependencies) return 'Missing dependencies';
  
  return true;
});

// Test 4: TypeScript Configuration
runTest('TypeScript Configuration', () => {
  const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  
  if (!tsConfig.compilerOptions) return 'Missing compiler options';
  if (!tsConfig.compilerOptions.target) return 'Missing compilation target';
  if (!tsConfig.compilerOptions.lib) return 'Missing library configuration';
  
  return true;
});

// Test 5: App.tsx Structure
runTest('App.tsx Structure Check', () => {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // Check for critical imports
  if (!appContent.includes('import React')) return 'Missing React import';
  if (!appContent.includes('useAuthentication')) return 'Missing authentication hook';
  if (!appContent.includes('FlashFusionInterface')) return 'Missing main interface component';
  if (!appContent.includes('FlashFusionLandingPage')) return 'Missing landing page component';
  if (!appContent.includes('AuthenticationSystem')) return 'Missing auth system component';
  if (!appContent.includes('export default App')) return 'Missing default export';
  
  return true;
});

// Test 6: Fixed Components Structure Check
runTest('Fixed Components JSX Structure', () => {
  const deployment = fs.readFileSync('components/deployment/AdvancedProductionDeployment.tsx', 'utf8');
  const workflow = fs.readFileSync('components/tools/EnhancedWorkflowBuilder.tsx', 'utf8');
  
  // Check for proper JSX syntax (no malformed JSX)
  if (deployment.includes('{{') || deployment.includes('}}')) {
    return 'AdvancedProductionDeployment contains malformed JSX';
  }
  
  if (workflow.includes('{{') || workflow.includes('}}')) {
    return 'EnhancedWorkflowBuilder contains malformed JSX';
  }
  
  // Check for proper exports
  if (!deployment.includes('export function AdvancedProductionDeployment')) {
    return 'AdvancedProductionDeployment missing proper export';
  }
  
  if (!workflow.includes('export function EnhancedWorkflowBuilder')) {
    return 'EnhancedWorkflowBuilder missing proper export';
  }
  
  return true;
});

// Test 7: Supabase Configuration
runTest('Supabase Configuration', () => {
  const hasSupabaseClient = fs.existsSync('utils/supabase/client.ts');
  const hasSupabaseInfo = fs.existsSync('utils/supabase/info.tsx');
  const hasSupabaseKV = fs.existsSync('supabase/functions/server/kv_store.tsx');
  
  if (!hasSupabaseClient) return 'Missing Supabase client configuration';
  if (!hasSupabaseInfo) return 'Missing Supabase info configuration';
  if (!hasSupabaseKV) return 'Missing Supabase KV store';
  
  return true;
});

// Test 8: Authentication System Files
runTest('Authentication System', () => {
  const authFiles = [
    'components/auth/AuthenticationSystem.tsx',
    'components/auth/AuthCallback.tsx',
    'components/auth/EmailVerification.tsx',
    'components/auth/PasswordReset.tsx',
    'hooks/useAuthentication.ts'
  ];
  
  for (const file of authFiles) {
    if (!fs.existsSync(file)) {
      return `Missing auth file: ${file}`;
    }
  }
  
  return true;
});

// Test 9: Core UI Components
runTest('Core UI Components', () => {
  const uiComponents = [
    'components/ui/button.tsx',
    'components/ui/card.tsx',
    'components/ui/input.tsx',
    'components/ui/dialog.tsx',
    'components/ui/tabs.tsx'
  ];
  
  for (const component of uiComponents) {
    if (!fs.existsSync(component)) {
      return `Missing UI component: ${component}`;
    }
  }
  
  return true;
});

// Test 10: Landing Page Components
runTest('Landing Page System', () => {
  const landingFiles = [
    'components/landing/FlashFusionLandingPage.tsx',
    'components/core/flash-fusion-interface.tsx'
  ];
  
  for (const file of landingFiles) {
    if (!fs.existsSync(file)) {
      return `Missing landing file: ${file}`;
    }
  }
  
  return true;
});

// Test 11: Build Configuration
runTest('Build Configuration', () => {
  if (!fs.existsSync('vite.config.ts')) return 'Missing Vite configuration';
  
  const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
  if (!viteConfig.includes('defineConfig')) return 'Invalid Vite configuration';
  
  return true;
});

// Test 12: CSS and Styling
runTest('CSS and Styling System', () => {
  const globalCSS = fs.readFileSync('styles/globals.css', 'utf8');
  
  // Check for FlashFusion brand colors
  if (!globalCSS.includes('--ff-primary')) return 'Missing FlashFusion primary color variables';
  if (!globalCSS.includes('--ff-secondary')) return 'Missing FlashFusion secondary color variables';
  if (!globalCSS.includes('--ff-accent')) return 'Missing FlashFusion accent color variables';
  if (!globalCSS.includes('--ff-font-primary')) return 'Missing FlashFusion font variables';
  
  return true;
});

// Test 13: Environment Configuration
runTest('Environment Configuration', () => {
  // Check for example environment file
  if (fs.existsSync('.env.example') || fs.existsSync('_env_example.tsx')) {
    return true;
  }
  return 'Missing environment example file';
});

// Test 14: Deployment Files
runTest('Deployment Configuration', () => {
  const deploymentFiles = [
    'vercel.json',
    'netlify.toml'
  ];
  
  let hasDeploymentConfig = false;
  for (const file of deploymentFiles) {
    if (fs.existsSync(file)) {
      hasDeploymentConfig = true;
      break;
    }
  }
  
  if (!hasDeploymentConfig) return 'Missing deployment configuration files';
  return true;
});

// Test 15: Production Readiness
runTest('Production Readiness Check', () => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check for production build script
  if (!packageJson.scripts.build) return 'Missing production build script';
  
  // Check for essential production dependencies
  const essentialDeps = ['react', 'react-dom', 'typescript'];
  for (const dep of essentialDeps) {
    if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
      return `Missing essential dependency: ${dep}`;
    }
  }
  
  return true;
});

// Test 16: Documentation
runTest('Documentation Completeness', () => {
  const docFiles = [
    'README.md',
    'Guidelines.md'
  ];
  
  for (const file of docFiles) {
    if (!fs.existsSync(file)) {
      return `Missing documentation file: ${file}`;
    }
  }
  
  return true;
});

// Test 17: Core Hooks
runTest('Essential Hooks', () => {
  const hooks = [
    'hooks/useAuthentication.ts',
    'hooks/useAppInitialization.ts'
  ];
  
  for (const hook of hooks) {
    if (!fs.existsSync(hook)) {
      return `Missing essential hook: ${hook}`;
    }
  }
  
  return true;
});

// Test 18: Error Boundaries
runTest('Error Handling System', () => {
  const errorFiles = [
    'components/ui/simple-error-boundary.tsx',
    'components/ui/timeout-error-boundary.tsx',
    'components/ui/emergency-mode.tsx'
  ];
  
  for (const file of errorFiles) {
    if (!fs.existsSync(file)) {
      return `Missing error handling component: ${file}`;
    }
  }
  
  return true;
});

// Test 19: Performance Components
runTest('Performance System', () => {
  const perfFiles = [
    'components/core/app-states/LoadingState.tsx',
    'components/core/app-states/ErrorState.tsx',
    'components/core/app-states/PerformanceMonitor.tsx'
  ];
  
  for (const file of perfFiles) {
    if (!fs.existsSync(file)) {
      return `Missing performance component: ${file}`;
    }
  }
  
  return true;
});

// Test 20: Navigation System
runTest('Navigation System', () => {
  const navFiles = [
    'utils/navigation-system.ts'
  ];
  
  for (const file of navFiles) {
    if (!fs.existsSync(file)) {
      return `Missing navigation file: ${file}`;
    }
  }
  
  // Check App.tsx for navigation integration
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  if (!appContent.includes('NavigationEventManager')) {
    return 'Missing navigation event manager integration';
  }
  
  return true;
});

console.log('\n' + '='.repeat(60));
console.log('📊 TEST RESULTS SUMMARY');
console.log('='.repeat(60));
console.log(`Total Tests: ${totalTests}`);
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);
console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (failedTests > 0) {
  console.log('\n🚨 FAILED TESTS:');
  testResults
    .filter(result => result.status === 'FAIL')
    .forEach(result => {
      console.log(`   ❌ ${result.name}: ${result.details}`);
    });
}

console.log('\n🚀 LAUNCH READINESS ASSESSMENT:');
if (failedTests === 0) {
  console.log('🎉 READY FOR LAUNCH! All tests passed.');
} else if (failedTests <= 2) {
  console.log('⚠️  MOSTLY READY: Minor issues need attention.');
} else if (failedTests <= 5) {
  console.log('🔧 NEEDS WORK: Several issues require fixing.');
} else {
  console.log('🚫 NOT READY: Major issues need resolution.');
}

console.log('\n📋 RECOMMENDED NEXT STEPS:');
if (failedTests === 0) {
  console.log('1. Run final build test: npm run build');
  console.log('2. Test authentication flows');
  console.log('3. Verify deployment configuration');
  console.log('4. Perform user acceptance testing');
  console.log('5. Monitor performance metrics');
} else {
  console.log('1. Fix all failed tests above');
  console.log('2. Re-run this test suite');
  console.log('3. Perform manual testing of fixed components');
  console.log('4. Verify build process works correctly');
}

console.log('\n' + '='.repeat(60));

// Save detailed results to file
const reportPath = 'launch-readiness-report.json';
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    totalTests,
    passedTests,
    failedTests,
    successRate: ((passedTests / totalTests) * 100).toFixed(1)
  },
  results: testResults,
  recommendation: failedTests === 0 ? 'READY_FOR_LAUNCH' : 
                   failedTests <= 2 ? 'MOSTLY_READY' :
                   failedTests <= 5 ? 'NEEDS_WORK' : 'NOT_READY'
};

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`📄 Detailed report saved to: ${reportPath}`);

process.exit(failedTests > 0 ? 1 : 0);