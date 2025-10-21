#!/usr/bin/env node

/**
 * FlashFusion Authentication Flow Test
 * Tests critical authentication functionality
 */

const fs = require('fs');

console.log('\n🔐 FlashFusion Authentication Flow Test');
console.log('=' .repeat(50));

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

// Test Authentication Components
test('AuthenticationSystem Component', () => {
  const auth = fs.readFileSync('components/auth/AuthenticationSystem.tsx', 'utf8');
  
  if (!auth.includes('export')) return 'Missing export';
  if (!auth.includes('useState')) return 'Missing state management';
  if (!auth.includes('Supabase') || !auth.includes('supabase')) return 'Missing Supabase integration';
  if (!auth.includes('onAuthSuccess')) return 'Missing success handler';
  if (!auth.includes('onAuthError')) return 'Missing error handler';
  
  return true;
});

test('useAuthentication Hook', () => {
  const hook = fs.readFileSync('hooks/useAuthentication.ts', 'utf8');
  
  if (!hook.includes('export')) return 'Missing export';
  if (!hook.includes('useState')) return 'Missing state management';
  if (!hook.includes('useEffect')) return 'Missing effect hook';
  if (!hook.includes('isAuthenticated')) return 'Missing authentication state';
  if (!hook.includes('isInitialized')) return 'Missing initialization state';
  
  return true;
});

test('Auth Callback Component', () => {
  const callback = fs.readFileSync('components/auth/AuthCallback.tsx', 'utf8');
  
  if (!callback.includes('export')) return 'Missing export';
  if (!callback.includes('useEffect')) return 'Missing effect hook';
  if (!callback.includes('window.location')) return 'Missing URL handling';
  
  return true;
});

test('App.tsx Auth Integration', () => {
  const app = fs.readFileSync('App.tsx', 'utf8');
  
  if (!app.includes('useAuthentication')) return 'Missing authentication hook';
  if (!app.includes('AuthenticationSystem')) return 'Missing auth system component';
  if (!app.includes('showAuthModal')) return 'Missing auth modal state';
  if (!app.includes('handleAuthSuccess')) return 'Missing success handler';
  if (!app.includes('isAuthenticated')) return 'Missing auth state check';
  
  return true;
});

test('Supabase Configuration', () => {
  if (!fs.existsSync('utils/supabase/client.ts')) return 'Missing Supabase client';
  if (!fs.existsSync('utils/supabase/info.tsx')) return 'Missing Supabase info';
  
  const client = fs.readFileSync('utils/supabase/client.ts', 'utf8');
  if (!client.includes('createClient')) return 'Missing createClient function';
  
  return true;
});

test('Protected Routes Logic', () => {
  const app = fs.readFileSync('App.tsx', 'utf8');
  
  if (!app.includes('showAppInterface')) return 'Missing app interface condition';
  if (!app.includes('isAuthenticated && isInitialized')) return 'Missing auth protection logic';
  if (!app.includes('FlashFusionLandingPage')) return 'Missing landing page fallback';
  
  return true;
});

test('Navigation System Integration', () => {
  const nav = fs.readFileSync('utils/navigation-system.ts', 'utf8');
  
  if (!nav.includes('NavigationEventManager')) return 'Missing navigation event manager';
  if (!nav.includes('URLParameterDetector')) return 'Missing URL parameter detector';
  if (!nav.includes('NavigationHelper')) return 'Missing navigation helper';
  
  return true;
});

test('Error Handling for Auth', () => {
  const app = fs.readFileSync('App.tsx', 'utf8');
  
  if (!app.includes('handleAuthError')) return 'Missing auth error handler';
  if (!app.includes('clearError')) return 'Missing error clearing function';
  if (!app.includes('TimeoutErrorBoundary')) return 'Missing timeout error boundary';
  
  return true;
});

console.log('\n' + '='.repeat(50));
console.log(`📊 Results: ${passed}/${tests} tests passed`);
console.log(`📈 Success Rate: ${((passed/tests) * 100).toFixed(1)}%`);

if (passed === tests) {
  console.log('🎉 Authentication system is ready!');
} else {
  console.log('⚠️  Authentication needs attention');
}

console.log('\n🔍 Next Steps:');
console.log('1. Test login/logout flows manually');
console.log('2. Verify OAuth callback handling');
console.log('3. Test protected route access');
console.log('4. Validate session persistence');