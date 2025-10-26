#!/usr/bin/env node

/**
 * Quick Build Verification Test
 * Validates that the platform can build successfully
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔨 FlashFusion Quick Build Test');
console.log('=' .repeat(40));

// Check package.json for build script
function checkBuildScript() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (!packageJson.scripts || !packageJson.scripts.build) {
      console.log('❌ No build script found in package.json');
      return false;
    }
    console.log('✅ Build script found');
    return true;
  } catch (error) {
    console.log('❌ Error reading package.json:', error.message);
    return false;
  }
}

// Check TypeScript configuration
function checkTypeScriptConfig() {
  try {
    if (!fs.existsSync('tsconfig.json')) {
      console.log('❌ tsconfig.json not found');
      return false;
    }
    
    const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    if (!tsConfig.compilerOptions) {
      console.log('❌ Invalid TypeScript configuration');
      return false;
    }
    
    console.log('✅ TypeScript configuration valid');
    return true;
  } catch (error) {
    console.log('❌ Error reading tsconfig.json:', error.message);
    return false;
  }
}

// Check Vite configuration
function checkViteConfig() {
  try {
    if (!fs.existsSync('vite.config.ts')) {
      console.log('❌ vite.config.ts not found');
      return false;
    }
    
    const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
    if (!viteConfig.includes('defineConfig')) {
      console.log('❌ Invalid Vite configuration');
      return false;
    }
    
    console.log('✅ Vite configuration valid');
    return true;
  } catch (error) {
    console.log('❌ Error reading vite.config.ts:', error.message);
    return false;
  }
}

// Check critical files exist
function checkCriticalFiles() {
  const criticalFiles = [
    'App.tsx',
    'main.tsx',
    'index.html',
    'styles/globals.css'
  ];
  
  for (const file of criticalFiles) {
    if (!fs.existsSync(file)) {
      console.log(`❌ Critical file missing: ${file}`);
      return false;
    }
  }
  
  console.log('✅ All critical files present');
  return true;
}

// Check for common syntax issues in key files
function checkSyntaxIssues() {
  try {
    const appContent = fs.readFileSync('App.tsx', 'utf8');
    
    // Check for common React/JSX issues
    if (appContent.includes('{{') || appContent.includes('}}')) {
      console.log('❌ Malformed JSX syntax detected in App.tsx');
      return false;
    }
    
    // Check for proper imports
    if (!appContent.includes('import React')) {
      console.log('❌ Missing React import in App.tsx');
      return false;
    }
    
    // Check for proper export
    if (!appContent.includes('export default')) {
      console.log('❌ Missing default export in App.tsx');
      return false;
    }
    
    console.log('✅ App.tsx syntax check passed');
    return true;
  } catch (error) {
    console.log('❌ Error checking App.tsx syntax:', error.message);
    return false;
  }
}

// Check environment configuration
function checkEnvironmentConfig() {
  // Check if there's at least an example environment file
  if (fs.existsSync('.env.example') || fs.existsSync('_env_example.tsx')) {
    console.log('✅ Environment configuration example found');
    return true;
  } else {
    console.log('⚠️  No environment example file found (non-critical)');
    return true; // Non-critical for build test
  }
}

// Run all checks
console.log('\n🔍 Running Build Readiness Checks...\n');

const checks = [
  { name: 'Package.json Build Script', fn: checkBuildScript },
  { name: 'TypeScript Configuration', fn: checkTypeScriptConfig },
  { name: 'Vite Configuration', fn: checkViteConfig },
  { name: 'Critical Files', fn: checkCriticalFiles },
  { name: 'Syntax Issues', fn: checkSyntaxIssues },
  { name: 'Environment Config', fn: checkEnvironmentConfig }
];

let allPassed = true;
for (const check of checks) {
  if (!check.fn()) {
    allPassed = false;
  }
}

console.log('\n' + '='.repeat(40));
if (allPassed) {
  console.log('🎉 BUILD READINESS: PASSED');
  console.log('\n📋 Next Steps:');
  console.log('1. Run: npm install (if needed)');
  console.log('2. Run: npm run build');
  console.log('3. Test production build locally');
  console.log('4. Deploy to production');
} else {
  console.log('🚨 BUILD READINESS: FAILED');
  console.log('\n📋 Required Actions:');
  console.log('1. Fix all issues marked with ❌');
  console.log('2. Re-run this test');
  console.log('3. Only proceed with build after all checks pass');
}

console.log('\n' + '='.repeat(40));