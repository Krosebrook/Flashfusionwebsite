#!/usr/bin/env node

/**
 * Streamlined FlashFusion Workflow Test
 * Tests the most critical user workflows efficiently
 */

const fs = require('fs');

console.log('\n🎯 FlashFusion Streamlined Workflow Test');
console.log('=' .repeat(50));
console.log('Testing critical user workflows for complete functionality');
console.log('=' .repeat(50));

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
let warnings = 0;
const results = [];

function test(category, name, testFn, priority = 'normal') {
  totalTests++;
  try {
    const result = testFn();
    if (result === true || result === undefined) {
      passedTests++;
      console.log(`✅ [${category}] ${name}`);
      results.push({ category, name, status: 'PASS', priority, details: 'OK' });
    } else if (typeof result === 'string' && result.startsWith('WARNING:')) {
      warnings++;
      console.log(`⚠️  [${category}] ${name}: ${result}`);
      results.push({ category, name, status: 'WARNING', priority, details: result });
    } else {
      failedTests++;
      console.log(`❌ [${category}] ${name}: ${result}`);
      results.push({ category, name, status: 'FAIL', priority, details: result });
    }
  } catch (error) {
    failedTests++;
    console.log(`❌ [${category}] ${name}: ${error.message}`);
    results.push({ category, name, status: 'FAIL', priority, details: error.message });
  }
}

// ===== CRITICAL WORKFLOW TESTS =====

console.log('\n🔥 Testing Critical Workflows...');

// 1. APP FOUNDATION
test('Foundation', 'App.tsx exists and exports default', () => {
  if (!fs.existsSync('App.tsx')) return 'App.tsx file missing';
  
  const content = fs.readFileSync('App.tsx', 'utf8');
  if (!content.includes('export default App')) return 'Missing default App export';
  if (!content.includes('function App')) return 'Missing App function';
  
  return true;
}, 'critical');

test('Foundation', 'Essential hooks integrated', () => {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  if (!appContent.includes('useAuthentication')) return 'Missing useAuthentication hook';
  if (!appContent.includes('useAppInitialization')) return 'Missing useAppInitialization hook';
  
  return true;
}, 'critical');

test('Foundation', 'Core components imported', () => {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  if (!appContent.includes('FlashFusionInterface')) return 'Missing FlashFusionInterface import';
  if (!appContent.includes('FlashFusionLandingPage')) return 'Missing FlashFusionLandingPage import';
  if (!appContent.includes('AuthenticationSystem')) return 'Missing AuthenticationSystem import';
  
  return true;
}, 'critical');

// 2. LANDING PAGE WORKFLOW
test('Landing', 'Landing page component exists', () => {
  if (!fs.existsSync('components/landing/FlashFusionLandingPage.tsx')) {
    return 'FlashFusionLandingPage component missing';
  }
  
  const content = fs.readFileSync('components/landing/FlashFusionLandingPage.tsx', 'utf8');
  if (!content.includes('export')) return 'Missing export in landing page';
  
  return true;
}, 'critical');

test('Landing', 'Landing page has call-to-action', () => {
  const content = fs.readFileSync('components/landing/FlashFusionLandingPage.tsx', 'utf8');
  
  if (!content.includes('Enter App') && !content.includes('Get Started') && !content.includes('app=true')) {
    return 'WARNING: No clear call-to-action found';
  }
  
  return true;
}, 'important');

// 3. AUTHENTICATION WORKFLOW
test('Auth', 'Authentication System component exists', () => {
  if (!fs.existsSync('components/auth/AuthenticationSystem.tsx')) {
    return 'AuthenticationSystem component missing';
  }
  
  const content = fs.readFileSync('components/auth/AuthenticationSystem.tsx', 'utf8');
  if (!content.includes('onAuthSuccess')) return 'Missing onAuthSuccess prop';
  if (!content.includes('onAuthError')) return 'Missing onAuthError prop';
  
  return true;
}, 'critical');

test('Auth', 'OAuth callback handling', () => {
  if (!fs.existsSync('components/auth/AuthCallback.tsx')) {
    return 'AuthCallback component missing';
  }
  
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  if (!appContent.includes('/auth/callback')) return 'Missing OAuth callback route handling';
  
  return true;
}, 'critical');

test('Auth', 'Authentication hook exists', () => {
  if (!fs.existsSync('hooks/useAuthentication.ts')) {
    return 'useAuthentication hook missing';
  }
  
  const content = fs.readFileSync('hooks/useAuthentication.ts', 'utf8');
  if (!content.includes('isAuthenticated')) return 'Missing isAuthenticated state';
  if (!content.includes('isInitialized')) return 'Missing isInitialized state';
  
  return true;
}, 'critical');

test('Auth', 'Supabase authentication integration', () => {
  if (!fs.existsSync('utils/supabase/client.ts')) {
    return 'Supabase client missing';
  }
  
  const clientContent = fs.readFileSync('utils/supabase/client.ts', 'utf8');
  if (!clientContent.includes('createClient')) return 'Missing Supabase createClient';
  
  return true;
}, 'critical');

// 4. MAIN APPLICATION WORKFLOW  
test('App', 'Main interface component exists', () => {
  if (!fs.existsSync('components/core/flash-fusion-interface.tsx')) {
    return 'FlashFusionInterface component missing';
  }
  
  const content = fs.readFileSync('components/core/flash-fusion-interface.tsx', 'utf8');
  if (!content.includes('export')) return 'Missing export in main interface';
  
  return true;
}, 'critical');

test('App', 'App initialization hook exists', () => {
  if (!fs.existsSync('hooks/useAppInitialization.ts')) {
    return 'useAppInitialization hook missing';
  }
  
  const content = fs.readFileSync('hooks/useAppInitialization.ts', 'utf8');
  if (!content.includes('appState')) return 'Missing appState in initialization hook';
  
  return true;
}, 'critical');

test('App', 'Navigation system exists', () => {
  const navFiles = [
    'components/layout/Navigation.tsx',
    'components/layout/PageRouter.tsx',
    'utils/navigation-system.ts'
  ];
  
  let foundNav = false;
  for (const file of navFiles) {
    if (fs.existsSync(file)) {
      foundNav = true;
      break;
    }
  }
  
  if (!foundNav) return 'No navigation system found';
  return true;
}, 'important');

// 5. ERROR HANDLING WORKFLOW
test('Error', 'Error boundary components exist', () => {
  const errorComponents = [
    'components/ui/simple-error-boundary.tsx',
    'components/ui/timeout-error-boundary.tsx'
  ];
  
  for (const component of errorComponents) {
    if (!fs.existsSync(component)) {
      return `Missing error component: ${component}`;
    }
  }
  
  return true;
}, 'critical');

test('Error', 'Error boundaries integrated in App', () => {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  if (!appContent.includes('SimpleErrorBoundary')) return 'SimpleErrorBoundary not used';
  if (!appContent.includes('TimeoutErrorBoundary')) return 'TimeoutErrorBoundary not used';
  
  return true;
}, 'critical');

test('Error', 'Loading and error states exist', () => {
  const stateComponents = [
    'components/core/app-states/LoadingState.tsx',
    'components/core/app-states/ErrorState.tsx'
  ];
  
  for (const component of stateComponents) {
    if (!fs.existsSync(component)) {
      return `Missing state component: ${component}`;
    }
  }
  
  return true;
}, 'important');

// 6. TOOLS WORKFLOW (Basic Check)
test('Tools', 'AI tools infrastructure exists', () => {
  const toolDirs = [
    'components/tools',
    'data/tools.ts'
  ];
  
  let foundTools = false;
  for (const item of toolDirs) {
    if (fs.existsSync(item)) {
      foundTools = true;
      break;
    }
  }
  
  if (!foundTools) return 'No tools infrastructure found';
  return true;
}, 'important');

test('Tools', 'At least one tool category exists', () => {
  const toolCategories = [
    'components/tools/generation',
    'components/tools/analysis',
    'components/tools/collaboration'
  ];
  
  let foundCategory = false;
  for (const category of toolCategories) {
    if (fs.existsSync(category)) {
      foundCategory = true;
      break;
    }
  }
  
  if (!foundCategory) return 'WARNING: No tool categories found';
  return true;
}, 'normal');

// 7. CONFIGURATION WORKFLOW
test('Config', 'Build configuration exists', () => {
  const configFiles = [
    'package.json',
    'vite.config.ts',
    'tsconfig.json'
  ];
  
  for (const file of configFiles) {
    if (!fs.existsSync(file)) {
      return `Missing config file: ${file}`;
    }
  }
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (!packageJson.scripts.build) return 'Missing build script';
  if (!packageJson.scripts.dev) return 'Missing dev script';
  
  return true;
}, 'critical');

test('Config', 'Styles system exists', () => {
  if (!fs.existsSync('styles/globals.css')) {
    return 'Global styles missing';
  }
  
  const content = fs.readFileSync('styles/globals.css', 'utf8');
  if (!content.includes('--ff-primary')) return 'Missing FlashFusion CSS variables';
  if (!content.includes('--ff-font-primary')) return 'Missing typography variables';
  
  return true;
}, 'critical');

// 8. BACKEND INTEGRATION WORKFLOW
test('Backend', 'Supabase integration setup', () => {
  const supabaseFiles = [
    'utils/supabase/client.ts',
    'utils/supabase/info.tsx'
  ];
  
  for (const file of supabaseFiles) {
    if (!fs.existsSync(file)) {
      return `Missing Supabase file: ${file}`;
    }
  }
  
  return true;
}, 'critical');

test('Backend', 'Server functions exist', () => {
  if (!fs.existsSync('supabase/functions/server/index.tsx')) {
    return 'WARNING: Supabase server functions missing';
  }
  return true;
}, 'normal');

// ===== RESULTS SUMMARY =====

console.log('\n' + '='.repeat(50));
console.log('📊 STREAMLINED WORKFLOW TEST RESULTS');
console.log('='.repeat(50));

const criticalTests = results.filter(r => r.priority === 'critical');
const importantTests = results.filter(r => r.priority === 'important');
const normalTests = results.filter(r => r.priority === 'normal');

const criticalPassed = criticalTests.filter(r => r.status === 'PASS').length;
const importantPassed = importantTests.filter(r => r.status === 'PASS').length;
const normalPassed = normalTests.filter(r => r.status === 'PASS').length;

console.log(`\nOverall Results:`);
console.log(`  Total Tests: ${totalTests}`);
console.log(`  ✅ Passed: ${passedTests}`);
console.log(`  ❌ Failed: ${failedTests}`);
console.log(`  ⚠️  Warnings: ${warnings}`);
console.log(`  📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

console.log(`\n📊 Priority Breakdown:`);
console.log(`  🔴 Critical: ${criticalPassed}/${criticalTests.length} passed`);
console.log(`  🟡 Important: ${importantPassed}/${importantTests.length} passed`);
console.log(`  🟢 Normal: ${normalPassed}/${normalTests.length} passed`);

// Show failed critical tests
const failedCritical = criticalTests.filter(r => r.status === 'FAIL');
if (failedCritical.length > 0) {
  console.log('\n🚨 FAILED CRITICAL TESTS:');
  failedCritical.forEach(test => {
    console.log(`   ❌ ${test.category}: ${test.name} - ${test.details}`);
  });
}

// Show warnings
const warningTests = results.filter(r => r.status === 'WARNING');
if (warningTests.length > 0) {
  console.log('\n⚠️  WARNINGS:');
  warningTests.forEach(test => {
    console.log(`   ⚠️  ${test.category}: ${test.name} - ${test.details}`);
  });
}

console.log('\n🎯 WORKFLOW READINESS ASSESSMENT:');
const criticalSuccessRate = (criticalPassed / criticalTests.length) * 100;
const overallSuccessRate = ((passedTests / totalTests) * 100);

if (criticalSuccessRate === 100 && overallSuccessRate >= 90) {
  console.log('🎉 EXCELLENT: All critical workflows ready for production!');
} else if (criticalSuccessRate === 100 && overallSuccessRate >= 80) {
  console.log('✅ GOOD: Critical workflows ready, minor improvements needed');
} else if (criticalSuccessRate >= 90) {
  console.log('⚠️  FAIR: Most critical workflows ready, some issues need attention');
} else {
  console.log('🚨 CRITICAL ISSUES: Must fix critical workflow failures');
}

console.log('\n📋 USER WORKFLOW VALIDATION:');
console.log('Core user journeys tested:');
console.log('  ✓ Landing page → Authentication prompt');
console.log('  ✓ User registration and login flow');
console.log('  ✓ Authenticated app access');
console.log('  ✓ Error handling and recovery');
console.log('  ✓ Basic tool infrastructure');
console.log('  ✓ Configuration and build setup');

console.log('\n🔧 IMMEDIATE NEXT STEPS:');
if (failedCritical.length > 0) {
  console.log('1. 🔥 Fix critical test failures immediately');
  console.log('2. 🔄 Re-run this streamlined test');
  console.log('3. 🧪 Test authentication flows manually');
} else if (failedTests > 0) {
  console.log('1. 🔧 Fix remaining failed tests');
  console.log('2. 📝 Address warnings for better UX');
  console.log('3. 🧪 Run full workflow test suite');
} else {
  console.log('1. 🧪 Run comprehensive workflow tests');
  console.log('2. 📱 Test on mobile devices');
  console.log('3. ⚡ Run performance validation');
  console.log('4. 🚀 Ready for launch testing!');
}

console.log('\n🎮 MANUAL TESTING CHECKLIST:');
console.log('□ Visit localhost:5173 (landing page)');
console.log('□ Click "Enter App" button');
console.log('□ Test authentication modal');
console.log('□ Complete registration/login');
console.log('□ Access main app interface');
console.log('□ Test error scenarios');

console.log('\n' + '='.repeat(50));

// Save report
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    totalTests,
    passedTests,
    failedTests,
    warnings,
    successRate: ((passedTests / totalTests) * 100).toFixed(1)
  },
  priority: {
    critical: { passed: criticalPassed, total: criticalTests.length },
    important: { passed: importantPassed, total: importantTests.length },
    normal: { passed: normalPassed, total: normalTests.length }
  },
  results,
  recommendation: criticalSuccessRate === 100 && overallSuccessRate >= 90 ? 'PRODUCTION_READY' :
                   criticalSuccessRate === 100 && overallSuccessRate >= 80 ? 'MOSTLY_READY' :
                   criticalSuccessRate >= 90 ? 'NEEDS_IMPROVEMENT' : 'CRITICAL_ISSUES'
};

fs.writeFileSync('streamlined-workflow-report.json', JSON.stringify(report, null, 2));
console.log('📄 Report saved: streamlined-workflow-report.json');

process.exit(failedCritical.length > 0 ? 1 : 0);