#!/usr/bin/env node

/**
 * FlashFusion Development Setup Script
 * Helps set up the development environment quickly
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up FlashFusion development environment...\n');

// Check if .env.local exists
const envLocalPath = path.join(__dirname, '..', '.env.local');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (!fs.existsSync(envLocalPath)) {
  console.log('📝 Creating .env.local file...');
  
  if (fs.existsSync(envExamplePath)) {
    // Copy from .env.example and modify for development
    let envContent = fs.readFileSync(envExamplePath, 'utf8');
    
    // Replace example values with development defaults
    envContent = envContent
      .replace('https://your-project.supabase.co', 'https://demo.supabase.co')
      .replace('your-anon-key-here', 'demo-anon-key-for-development')
      .replace('sk-your-openai-key-here', 'demo-openai-key')
      .replace('https://your-sentry-dsn-here', 'demo-sentry-dsn')
      .replace('G-XXXXXXXXXX', 'demo-ga-id')
      .replace('sk_test_your-stripe-key-here', 'demo-stripe-key');
    
    // Add development-specific settings
    envContent += '\n\n# Development Settings\nNODE_ENV=development\nVITE_DEBUG_MODE=true\n';
    
    fs.writeFileSync(envLocalPath, envContent);
    console.log('✅ Created .env.local with development defaults');
  } else {
    console.log('❌ .env.example not found');
  }
} else {
  console.log('✅ .env.local already exists');
}

// Check important files
const checks = [
  {
    file: 'main.tsx',
    description: 'React entry point'
  },
  {
    file: 'App.tsx', 
    description: 'Main App component'
  },
  {
    file: 'vite.config.ts',
    description: 'Vite configuration'
  },
  {
    file: '.storybook/main.ts',
    description: 'Storybook configuration'
  },
  {
    file: 'package.json',
    description: 'Package configuration'
  }
];

console.log('\n🔍 Checking essential files...');

let allFilesExist = true;

checks.forEach(check => {
  const filePath = path.join(__dirname, '..', check.file);
  const exists = fs.existsSync(filePath);
  const icon = exists ? '✅' : '❌';
  
  console.log(`${icon} ${check.file} - ${check.description}`);
  
  if (!exists) {
    allFilesExist = false;
  }
});

console.log('\n' + '='.repeat(60));

if (allFilesExist) {
  console.log('🎉 Development environment is ready!');
  
  console.log('\n📝 Quick Start Commands:');
  console.log('   npm install              # Install dependencies');
  console.log('   npm run dev              # Start development server');
  console.log('   npm run verify-setup     # Verify everything works');
  
  console.log('\n🌐 Your app will run at: http://localhost:5173');
  console.log('💾 Changes will appear instantly with hot reload');
  
  console.log('\n🔧 To enable real features:');
  console.log('   1. Create a Supabase project at https://supabase.com');
  console.log('   2. Update VITE_SUPABASE_URL in .env.local');
  console.log('   3. Update VITE_SUPABASE_ANON_KEY in .env.local');
  console.log('   4. Add other API keys as needed');
  
  console.log('\n📚 Key files for development:');
  console.log('   ./App.tsx                                         # Main app');
  console.log('   ./components/pages/MultiAgentOrchestrationPage.tsx # Your feature');
  console.log('   ./styles/globals.css                              # Global styles');
  console.log('   ./components/layout/Sidebar.tsx                   # Navigation');
} else {
  console.log('⚠️ Some files are missing. Please check the setup.');
}

console.log('\n✨ Happy coding with FlashFusion!');