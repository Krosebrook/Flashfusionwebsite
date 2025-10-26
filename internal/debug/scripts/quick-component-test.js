#!/usr/bin/env node

/**
 * Quick Component Structure Test
 */

const fs = require('fs');

console.log('\n🔍 Quick Component Structure Test');
console.log('=' .repeat(40));

let tests = 0;
let passed = 0;

function test(name, fn) {
  tests++;
  try {
    const result = fn();
    if (result === true || result === undefined) {
      passed++;
      console.log(`✅ ${name}`);
    } else {
      console.log(`❌ ${name}: ${result}`);
    }
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
  }
}

// Test 1: App.tsx exists and has basic structure
test('App.tsx Structure', () => {
  if (!fs.existsSync('App.tsx')) return 'App.tsx missing';
  
  const content = fs.readFileSync('App.tsx', 'utf8');
  if (!content.includes('export default App')) return 'Missing default export';
  if (!content.includes('useAuthentication')) return 'Missing authentication hook';
  if (!content.includes('FlashFusionInterface')) return 'Missing main interface';
  if (!content.includes('FlashFusionLandingPage')) return 'Missing landing page';
  
  return true;
});

// Test 2: Landing page component
test('Landing Page Component', () => {
  if (!fs.existsSync('components/landing/FlashFusionLandingPage.tsx')) {
    return 'Landing page component missing';
  }
  return true;
});

// Test 3: Authentication components
test('Authentication Components', () => {
  const authFiles = [
    'components/auth/AuthenticationSystem.tsx',
    'components/auth/AuthCallback.tsx'
  ];
  
  for (const file of authFiles) {
    if (!fs.existsSync(file)) {
      return `Missing auth component: ${file}`;
    }
  }
  return true;
});

// Test 4: Main interface component
test('Main Interface Component', () => {
  if (!fs.existsSync('components/core/flash-fusion-interface.tsx')) {
    return 'Main interface component missing';
  }
  return true;
});

// Test 5: Authentication hook
test('Authentication Hook', () => {
  if (!fs.existsSync('hooks/useAuthentication.ts')) {
    return 'Authentication hook missing';
  }
  return true;
});

// Test 6: Navigation system
test('Navigation System', () => {
  const navFiles = [
    'components/layout/Navigation.tsx',
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
});

// Test 7: Basic configuration files
test('Configuration Files', () => {
  const configFiles = [
    'package.json',
    'tsconfig.json',
    'vite.config.ts'
  ];
  
  for (const file of configFiles) {
    if (!fs.existsSync(file)) {
      return `Missing config file: ${file}`;
    }
  }
  return true;
});

// Test 8: Styles
test('Styles System', () => {
  if (!fs.existsSync('styles/globals.css')) {
    return 'Global styles missing';
  }
  
  const content = fs.readFileSync('styles/globals.css', 'utf8');
  if (!content.includes('--ff-primary')) return 'Missing FlashFusion variables';
  
  return true;
});

console.log('\n' + '='.repeat(40));
console.log(`📊 Results: ${passed}/${tests} tests passed`);
console.log(`📈 Success Rate: ${((passed/tests) * 100).toFixed(1)}%`);

if (passed === tests) {
  console.log('🎉 All basic component tests passed!');
} else {
  console.log('⚠️  Some component issues detected');
}

console.log('\n' + '='.repeat(40));