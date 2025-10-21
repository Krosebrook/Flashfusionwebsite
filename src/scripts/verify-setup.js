#!/usr/bin/env node

/**
 * FlashFusion Setup Verification Script
 * Checks if all development workflow fixes are properly applied
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying FlashFusion development setup...\n');

const checks = [
  {
    name: 'React entry point exists',
    check: () => fs.existsSync(path.join(__dirname, '..', 'main.tsx')),
    fix: 'Run: Create main.tsx with React app entry point'
  },
  {
    name: 'Storybook config in correct location',
    check: () => fs.existsSync(path.join(__dirname, '..', '.storybook', 'main.ts')),
    fix: 'Move Storybook config to .storybook/main.ts'
  },
  {
    name: 'Package.json has correct scripts',
    check: () => {
      const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json')));
      return pkg.scripts && pkg.scripts.dev === 'vite';
    },
    fix: 'Ensure package.json has "dev": "vite" script'
  },
  {
    name: 'Vite config exists',
    check: () => fs.existsSync(path.join(__dirname, '..', 'vite.config.ts')),
    fix: 'Create vite.config.ts file'
  },
  {
    name: 'Environment example uses VITE_ prefix',
    check: () => {
      const envExample = fs.readFileSync(path.join(__dirname, '..', '.env.example'), 'utf8');
      return envExample.includes('VITE_SUPABASE_URL');
    },
    fix: 'Update .env.example to use VITE_ prefixed variables'
  },
  {
    name: 'Development environment file exists',
    check: () => fs.existsSync(path.join(__dirname, '..', '.env.local')),
    fix: 'Run: npm run setup to create .env.local'
  },
  {
    name: 'Index.html points to main.tsx',
    check: () => {
      const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
      return indexHtml.includes('src="/main.tsx"');
    },
    fix: 'Update index.html script tag to point to /main.tsx'
  },
  {
    name: 'Multi-Agent Orchestration page exists',
    check: () => fs.existsSync(path.join(__dirname, '..', 'components', 'pages', 'MultiAgentOrchestrationPage.tsx')),
    fix: 'Multi-Agent Orchestration feature files exist'
  }
];

let allPassed = true;

checks.forEach((check, index) => {
  const passed = check.check();
  const icon = passed ? '✅' : '❌';
  const status = passed ? 'PASS' : 'FAIL';
  
  console.log(`${icon} ${index + 1}. ${check.name}: ${status}`);
  
  if (!passed) {
    console.log(`   💡 Fix: ${check.fix}`);
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('🎉 All checks passed! Your development setup is ready.');
  console.log('\n🚀 Quick Start:');
  console.log('   npm run dev                    # Start development');
  console.log('   npm run setup:dev              # Full automated setup');
  console.log('\n🌐 Your app will open at: http://localhost:5173');
  console.log('💾 Changes will appear instantly with hot reload');
  console.log('🚀 Push to main branch to deploy to live website');
  console.log('\n✅ No configuration warnings - demo environment ready!');
} else {
  console.log('⚠️  Some checks failed. Please fix the issues above.');
  console.log('\n📚 See DEVELOPMENT_WORKFLOW_FIXED.md for detailed instructions');
}

console.log('\n🔗 Key files for your changes:');
console.log('   ./App.tsx                                    - Main app');
console.log('   ./styles/globals.css                         - Global styles');
console.log('   ./components/pages/MultiAgentOrchestrationPage.tsx - Main feature');
console.log('   ./components/layout/Sidebar.tsx              - Navigation');

console.log('\n✨ Happy coding with FlashFusion!');