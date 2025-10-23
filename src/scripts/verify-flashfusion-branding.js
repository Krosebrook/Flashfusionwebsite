#!/usr/bin/env node

/**
 * FlashFusion Branding Verification Script
 * 
 * Verifies that all files use proper FlashFusion branding and
 * no legacy references exist.
 * 
 * Run: node scripts/verify-flashfusion-branding.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎨 FlashFusion Branding Verification\n');
console.log('='.repeat(60));

// Configuration
const config = {
  requiredBranding: 'FlashFusion',
  prohibitedTerms: [
    'octave studio',
    'octavestudio',
    'octave-studio'
  ],
  criticalFiles: [
    'package.json',
    'README.md',
    'Guidelines.md',
    'App.tsx',
    'index.html',
    'vite.config.ts'
  ],
  componentFiles: [
    'components/landing/FlashFusionLandingPage.tsx',
    'components/analytics/FlashFusionBusinessIntelligenceHub.tsx',
    'styles/globals.css'
  ]
};

// Results tracking
const results = {
  filesScanned: 0,
  issuesFound: 0,
  warnings: [],
  errors: [],
  success: []
};

/**
 * Check if file exists
 */
function fileExists(filePath) {
  return fs.existsSync(path.join(process.cwd(), filePath));
}

/**
 * Read file content
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(path.join(process.cwd(), filePath), 'utf-8');
  } catch (error) {
    return null;
  }
}

/**
 * Check for prohibited terms
 */
function checkProhibitedTerms(content, filename) {
  const found = [];
  
  config.prohibitedTerms.forEach(term => {
    const regex = new RegExp(term, 'gi');
    const matches = content.match(regex);
    
    if (matches && matches.length > 0) {
      found.push({
        term,
        count: matches.length,
        file: filename
      });
    }
  });
  
  return found;
}

/**
 * Check for FlashFusion branding
 */
function checkFlashFusionBranding(content, filename) {
  const regex = /FlashFusion/g;
  const matches = content.match(regex);
  
  return {
    file: filename,
    count: matches ? matches.length : 0,
    present: matches && matches.length > 0
  };
}

/**
 * Verify design system usage
 */
function checkDesignSystem(content, filename) {
  const patterns = {
    colors: /--ff-(primary|secondary|accent|bg-dark|surface|text)/g,
    fonts: /--ff-font-(primary|secondary|mono)/g,
    animations: /ff-(fade|scale|slide|pulse|stagger|hover)/g,
    components: /ff-(btn|card|input|focus)/g
  };
  
  const results = {};
  
  Object.entries(patterns).forEach(([key, pattern]) => {
    const matches = content.match(pattern);
    results[key] = matches ? matches.length : 0;
  });
  
  return results;
}

// ============================================
// STEP 1: Verify Critical Files
// ============================================

console.log('\n📋 Step 1: Verifying Critical Files\n');

config.criticalFiles.forEach(file => {
  results.filesScanned++;
  
  if (!fileExists(file)) {
    results.errors.push(`❌ MISSING: ${file}`);
    results.issuesFound++;
    console.log(`❌ MISSING: ${file}`);
    return;
  }
  
  const content = readFile(file);
  if (!content) {
    results.errors.push(`❌ ERROR: Cannot read ${file}`);
    results.issuesFound++;
    console.log(`❌ ERROR: Cannot read ${file}`);
    return;
  }
  
  // Check for prohibited terms
  const prohibited = checkProhibitedTerms(content, file);
  if (prohibited.length > 0) {
    prohibited.forEach(({ term, count }) => {
      const msg = `⚠️  Found "${term}" ${count}x in ${file}`;
      results.warnings.push(msg);
      results.issuesFound++;
      console.log(msg);
    });
  }
  
  // Check for FlashFusion branding
  const branding = checkFlashFusionBranding(content, file);
  if (!branding.present) {
    const msg = `⚠️  No FlashFusion branding in ${file}`;
    results.warnings.push(msg);
    console.log(msg);
  } else {
    const msg = `✅ ${file} (${branding.count} FlashFusion references)`;
    results.success.push(msg);
    console.log(msg);
  }
});

// ============================================
// STEP 2: Verify Component Files
// ============================================

console.log('\n📦 Step 2: Verifying Component Files\n');

config.componentFiles.forEach(file => {
  results.filesScanned++;
  
  if (!fileExists(file)) {
    console.log(`ℹ️  Optional file not found: ${file}`);
    return;
  }
  
  const content = readFile(file);
  if (!content) {
    console.log(`⚠️  Cannot read: ${file}`);
    return;
  }
  
  const branding = checkFlashFusionBranding(content, file);
  console.log(`${branding.present ? '✅' : '⚠️ '} ${file} (${branding.count} references)`);
  
  // Check design system usage in CSS file
  if (file.endsWith('.css')) {
    const designSystem = checkDesignSystem(content, file);
    console.log(`   Design System:`);
    console.log(`     Colors: ${designSystem.colors}`);
    console.log(`     Fonts: ${designSystem.fonts}`);
    console.log(`     Animations: ${designSystem.animations}`);
    console.log(`     Components: ${designSystem.components}`);
  }
});

// ============================================
// STEP 3: Check Package.json
// ============================================

console.log('\n📦 Step 3: Verifying package.json\n');

const packageJson = readFile('package.json');
if (packageJson) {
  try {
    const pkg = JSON.parse(packageJson);
    
    console.log(`Name: ${pkg.name}`);
    console.log(`Version: ${pkg.version}`);
    console.log(`Description: ${pkg.description || 'N/A'}`);
    
    if (pkg.name && pkg.name.toLowerCase().includes('flashfusion')) {
      console.log(`✅ Package name contains FlashFusion`);
      results.success.push('Package name correct');
    } else {
      console.log(`⚠️  Package name does not contain FlashFusion`);
      results.warnings.push('Package name missing FlashFusion');
    }
    
    // Check scripts
    if (pkg.scripts) {
      console.log(`\nScripts: ${Object.keys(pkg.scripts).length} defined`);
      
      const requiredScripts = ['dev', 'build', 'preview'];
      requiredScripts.forEach(script => {
        if (pkg.scripts[script]) {
          console.log(`  ✅ ${script}`);
        } else {
          console.log(`  ❌ Missing: ${script}`);
          results.warnings.push(`Missing script: ${script}`);
        }
      });
    }
  } catch (error) {
    console.log(`❌ Invalid JSON in package.json`);
    results.errors.push('Invalid package.json');
    results.issuesFound++;
  }
}

// ============================================
// STEP 4: Verify Design System
// ============================================

console.log('\n🎨 Step 4: Verifying Design System\n');

const globalsCss = readFile('styles/globals.css');
if (globalsCss) {
  const designSystem = checkDesignSystem(globalsCss, 'globals.css');
  
  console.log(`Design System Variables:`);
  console.log(`  Colors: ${designSystem.colors} variables`);
  console.log(`  Fonts: ${designSystem.fonts} variables`);
  console.log(`  Animations: ${designSystem.animations} classes`);
  console.log(`  Components: ${designSystem.components} classes`);
  
  if (designSystem.colors > 0 && designSystem.fonts > 0) {
    console.log(`✅ Design system properly implemented`);
    results.success.push('Design system complete');
  } else {
    console.log(`⚠️  Design system incomplete`);
    results.warnings.push('Design system needs work');
  }
}

// ============================================
// STEP 5: Search for Legacy References
// ============================================

console.log('\n🔍 Step 5: Scanning for Legacy References\n');

try {
  // Use grep to search entire codebase (faster than Node traversal)
  const command = `grep -r -i "octave" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git --exclude-dir=archive --exclude="*.md" . || true`;
  
  const output = execSync(command, { encoding: 'utf-8' });
  
  if (output.trim()) {
    console.log(`⚠️  Found legacy references:`);
    console.log(output);
    results.warnings.push('Legacy references found');
    results.issuesFound++;
  } else {
    console.log(`✅ No legacy references found`);
    results.success.push('Codebase clean of legacy terms');
  }
} catch (error) {
  // grep returns non-zero if no matches, which is what we want
  if (error.status === 1) {
    console.log(`✅ No legacy references found`);
    results.success.push('Codebase clean of legacy terms');
  } else {
    console.log(`⚠️  Search failed:`, error.message);
  }
}

// ============================================
// Final Report
// ============================================

console.log('\n' + '='.repeat(60));
console.log('📊 VERIFICATION REPORT');
console.log('='.repeat(60));

console.log(`\nFiles Scanned: ${results.filesScanned}`);
console.log(`Issues Found: ${results.issuesFound}`);

if (results.success.length > 0) {
  console.log(`\n✅ Successes (${results.success.length}):`);
  results.success.forEach(msg => console.log(`   ${msg}`));
}

if (results.warnings.length > 0) {
  console.log(`\n⚠️  Warnings (${results.warnings.length}):`);
  results.warnings.forEach(msg => console.log(`   ${msg}`));
}

if (results.errors.length > 0) {
  console.log(`\n❌ Errors (${results.errors.length}):`);
  results.errors.forEach(msg => console.log(`   ${msg}`));
}

// Overall Status
console.log('\n' + '='.repeat(60));

if (results.errors.length === 0 && results.issuesFound === 0) {
  console.log('✅ VERIFICATION PASSED');
  console.log('   FlashFusion branding is consistent and clean!');
  console.log('='.repeat(60));
  process.exit(0);
} else if (results.errors.length === 0 && results.issuesFound < 5) {
  console.log('⚠️  VERIFICATION PASSED WITH WARNINGS');
  console.log('   Minor issues found - review warnings above');
  console.log('='.repeat(60));
  process.exit(0);
} else {
  console.log('❌ VERIFICATION FAILED');
  console.log('   Critical issues found - fix errors above');
  console.log('='.repeat(60));
  process.exit(1);
}
