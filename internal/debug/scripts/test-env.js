#!/usr/bin/env node

/**
 * Environment Variable Test Script
 * Tests if .env.local is being read correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing environment variable setup...\n');

// Check if .env.local exists
const envLocalPath = path.join(__dirname, '..', '.env.local');
const envExamplePath = path.join(__dirname, '..', '.env.example');

console.log('📁 File checks:');
console.log(`   .env.local: ${fs.existsSync(envLocalPath) ? '✅ EXISTS' : '❌ MISSING'}`);
console.log(`   .env.example: ${fs.existsSync(envExamplePath) ? '✅ EXISTS' : '❌ MISSING'}`);

if (fs.existsSync(envLocalPath)) {
  console.log('\n📋 .env.local contents:');
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  
  // Parse environment variables
  const envVars = {};
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=');
      envVars[key] = value;
    }
  });
  
  // Check key variables
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'NODE_ENV'
  ];
  
  console.log('\n🔑 Environment variables:');
  requiredVars.forEach(varName => {
    const value = envVars[varName];
    const status = value ? '✅ SET' : '❌ MISSING';
    const preview = value ? (value.length > 20 ? value.substring(0, 20) + '...' : value) : '';
    console.log(`   ${varName}: ${status} ${preview ? `(${preview})` : ''}`);
  });
  
  // Check for demo mode
  const isDemoMode = envVars['VITE_SUPABASE_URL']?.includes('demo') || 
                     envVars['VITE_SUPABASE_ANON_KEY']?.includes('demo');
  
  console.log('\n🎯 Configuration status:');
  console.log(`   Demo Mode: ${isDemoMode ? '✅ ACTIVE' : '❌ INACTIVE'}`);
  console.log(`   Development Mode: ${envVars['NODE_ENV'] === 'development' ? '✅ YES' : '❌ NO'}`);
  
  if (isDemoMode) {
    console.log('\n✅ Everything looks good! Demo configuration is set up correctly.');
    console.log('   This should eliminate the configuration warnings.');
  } else {
    console.log('\n⚠️ Not using demo configuration - make sure your Supabase keys are valid.');
  }
  
} else {
  console.log('\n❌ .env.local file is missing!');
  console.log('\n💡 To fix this:');
  console.log('   1. Run: npm run setup');
  console.log('   2. Or copy .env.example to .env.local');
  console.log('   3. Or run: npm run setup:dev');
}

console.log('\n🚀 Next steps:');
console.log('   1. Start development: npm run dev');
console.log('   2. Check the browser console for configuration messages');
console.log('   3. Use the Config Debug panel in the app (bottom right)');