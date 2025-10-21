#!/usr/bin/env node

/**
 * FlashFusion App Integration Validation Script
 * Comprehensive validation of the main App.tsx and its dependencies
 * Version: 1.0.0
 * Author: FlashFusion Team
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Helper function to colorize console output
const colorize = (text, color) => `${colors[color]}${text}${colors.reset}`;

console.log(colorize('\n🚀 FlashFusion App Integration Validation', 'cyan'));
console.log(colorize('='.repeat(50), 'blue'));

let validationResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  issues: []
};

/**
 * Add validation result
 */
function addResult(type, message, details = null) {
  validationResults[type]++;
  validationResults.issues.push({ type, message, details });
  
  const icon = type === 'passed' ? '✅' : type === 'failed' ? '❌' : '⚠️';
  const color = type === 'passed' ? 'green' : type === 'failed' ? 'red' : 'yellow';
  
  console.log(colorize(`${icon} ${message}`, color));
  if (details) {
    console.log(colorize(`   📝 ${details}`, 'reset'));
  }
}

/**
 * Check if file exists
 */
function checkFileExists(filePath, description) {
  const fullPath = path.resolve(__dirname, '..', filePath);
  if (fs.existsSync(fullPath)) {
    addResult('passed', `${description} exists`);
    return true;
  } else {
    addResult('failed', `${description} missing`, `Expected: ${filePath}`);
    return false;
  }
}

/**
 * Check file content for specific patterns
 */
function checkFileContent(filePath, patterns, description) {
  const fullPath = path.resolve(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    addResult('failed', `Cannot validate ${description} - file missing`);
    return false;
  }
  
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    let allPassed = true;
    
    patterns.forEach(({ pattern, description: patternDesc, required = true }) => {
      const regex = typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern;
      const found = regex.test(content);
      
      if (required && !found) {
        addResult('failed', `${description}: Missing ${patternDesc}`);
        allPassed = false;
      } else if (!required && !found) {
        addResult('warnings', `${description}: Optional ${patternDesc} not found`);
      } else if (found) {
        addResult('passed', `${description}: ${patternDesc} found`);
      }
    });
    
    return allPassed;
  } catch (error) {
    addResult('failed', `Error reading ${description}`, error.message);
    return false;
  }
}

/**
 * Validate TypeScript imports
 */
function validateImports(filePath, expectedImports, description) {
  const fullPath = path.resolve(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    addResult('failed', `Cannot validate imports for ${description} - file missing`);
    return false;
  }
  
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    let allImportsFound = true;
    
    expectedImports.forEach(importPath => {
      const importRegex = new RegExp(`from\\s+['"]${importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'i');
      if (importRegex.test(content)) {
        addResult('passed', `${description}: Import ${importPath} found`);
      } else {
        addResult('failed', `${description}: Missing import ${importPath}`);
        allImportsFound = false;
      }
    });
    
    return allImportsFound;
  } catch (error) {
    addResult('failed', `Error validating imports for ${description}`, error.message);
    return false;
  }
}

console.log(colorize('\n📂 Checking Core Files...', 'yellow'));

// Check main App.tsx file
checkFileExists('App.tsx', 'Main App.tsx');

// Check core dependencies
const coreFiles = [
  'components/ui/simple-error-boundary.tsx',
  'components/ui/flash-fusion-loader.tsx', 
  'components/ui/emergency-mode.tsx',
  'components/core/flash-fusion-interface.tsx',
  'utils/system-detection.ts'
];

coreFiles.forEach(file => {
  checkFileExists(file, `Core component: ${file}`);
});

console.log(colorize('\n🔍 Validating App.tsx Content...', 'yellow'));

// Validate App.tsx content
checkFileContent('App.tsx', [
  {
    pattern: /import.*SimpleErrorBoundary.*from.*components\/ui\/simple-error-boundary/,
    description: 'SimpleErrorBoundary import'
  },
  {
    pattern: /import.*FlashFusionLoader.*from.*components\/ui\/flash-fusion-loader/,
    description: 'FlashFusionLoader import'
  },
  {
    pattern: /import.*EmergencyMode.*from.*components\/ui\/emergency-mode/,
    description: 'EmergencyMode import'
  },
  {
    pattern: /import.*FlashFusionInterface.*from.*components\/core\/flash-fusion-interface/,
    description: 'FlashFusionInterface import'
  },
  {
    pattern: /import.*initializeApp.*from.*utils\/system-detection/,
    description: 'initializeApp import'
  },
  {
    pattern: /useState.*AppState/,
    description: 'AppState usage'
  },
  {
    pattern: /useCallback/,
    description: 'useCallback hook usage'
  },
  {
    pattern: /useMemo/,
    description: 'useMemo hook usage'
  },
  {
    pattern: /handleRetryInitialization/,
    description: 'Retry initialization logic'
  },
  {
    pattern: /trackPerformanceMetrics/,
    description: 'Performance tracking'
  },
  {
    pattern: /ff-.*class/,
    description: 'FlashFusion CSS classes'
  },
  {
    pattern: /var\(--ff-/,
    description: 'FlashFusion CSS variables'
  },
  {
    pattern: /errorBoundary|ErrorBoundary/,
    description: 'Error boundary implementation'
  }
], 'App.tsx content');

console.log(colorize('\n🎨 Validating Design System Compliance...', 'yellow'));

// Check CSS variables and classes
checkFileContent('styles/globals.css', [
  {
    pattern: /--ff-primary.*#FF7B00/,
    description: 'Primary color variable'
  },
  {
    pattern: /--ff-secondary.*#00B4D8/,
    description: 'Secondary color variable'
  },
  {
    pattern: /--ff-accent.*#E91E63/,
    description: 'Accent color variable'
  },
  {
    pattern: /--ff-font-primary.*Sora/,
    description: 'Primary font variable'
  },
  {
    pattern: /--ff-font-secondary.*Inter/,
    description: 'Secondary font variable'
  },
  {
    pattern: /\.ff-btn-primary/,
    description: 'Primary button class'
  },
  {
    pattern: /\.ff-fade-in-up/,
    description: 'Animation classes'
  }
], 'CSS Design System');

console.log(colorize('\n🔧 Validating System Detection...', 'yellow'));

// Validate system detection utilities
checkFileContent('utils/system-detection.ts', [
  {
    pattern: /export.*type.*AppMode/,
    description: 'AppMode type export'
  },
  {
    pattern: /detectOptimalMode/,
    description: 'Optimal mode detection function'
  },
  {
    pattern: /initializeApp/,
    description: 'App initialization function'
  },
  {
    pattern: /emergency.*lite.*full/,
    description: 'Performance modes'
  },
  {
    pattern: /deviceMemory/,
    description: 'Device memory detection'
  },
  {
    pattern: /browserFeatures/,
    description: 'Browser feature detection'
  }
], 'System Detection');

console.log(colorize('\n🛡️ Validating Error Handling...', 'yellow'));

// Validate error boundary
checkFileContent('components/ui/simple-error-boundary.tsx', [
  {
    pattern: /class.*SimpleErrorBoundary.*extends.*Component/,
    description: 'Error boundary class definition'
  },
  {
    pattern: /componentDidCatch/,
    description: 'Error catching method'
  },
  {
    pattern: /getDerivedStateFromError/,
    description: 'Error state derivation'
  },
  {
    pattern: /handleRetry/,
    description: 'Retry mechanism'
  },
  {
    pattern: /ff-.*class/,
    description: 'FlashFusion styling'
  },
  {
    pattern: /exponential.*backoff/i,
    description: 'Exponential backoff logic'
  }
], 'Error Boundary');

console.log(colorize('\n🏗️ Validating Component Structure...', 'yellow'));

// Validate core interface component
checkFileContent('components/core/flash-fusion-interface.tsx', [
  {
    pattern: /FlashFusionInterface/,
    description: 'Main interface component'
  },
  {
    pattern: /useRouteNavigation/,
    description: 'Route navigation hook'
  },
  {
    pattern: /Suspense/,
    description: 'React Suspense usage'
  },
  {
    pattern: /lazy.*import/,
    description: 'Lazy loading implementation'
  }
], 'Core Interface');

console.log(colorize('\n📱 Validating UI Components...', 'yellow'));

// Check UI components
const uiComponents = [
  'components/ui/flash-fusion-loader.tsx',
  'components/ui/emergency-mode.tsx'
];

uiComponents.forEach(component => {
  if (checkFileExists(component, `UI component: ${component}`)) {
    checkFileContent(component, [
      {
        pattern: /memo|React\.memo/,
        description: 'Performance optimization with memo'
      },
      {
        pattern: /ff-.*class/,
        description: 'FlashFusion CSS classes'
      }
    ], `UI Component: ${component}`);
  }
});

console.log(colorize('\n🔗 Validating Import Structure...', 'yellow'));

// Validate App.tsx imports
validateImports('App.tsx', [
  './components/ui/simple-error-boundary',
  './components/ui/flash-fusion-loader',
  './components/ui/emergency-mode',
  './components/core/flash-fusion-interface',
  './utils/system-detection'
], 'App.tsx');

console.log(colorize('\n📊 Validation Summary', 'cyan'));
console.log(colorize('='.repeat(50), 'blue'));

const totalChecks = validationResults.passed + validationResults.failed + validationResults.warnings;
const successRate = totalChecks > 0 ? ((validationResults.passed / totalChecks) * 100).toFixed(1) : 0;

console.log(colorize(`\n📈 Total Checks: ${totalChecks}`, 'bright'));
console.log(colorize(`✅ Passed: ${validationResults.passed}`, 'green'));
console.log(colorize(`❌ Failed: ${validationResults.failed}`, 'red'));
console.log(colorize(`⚠️  Warnings: ${validationResults.warnings}`, 'yellow'));
console.log(colorize(`🎯 Success Rate: ${successRate}%`, 'cyan'));

if (validationResults.failed > 0) {
  console.log(colorize('\n🚨 Critical Issues Found:', 'red'));
  validationResults.issues
    .filter(issue => issue.type === 'failed')
    .forEach(issue => {
      console.log(colorize(`   ❌ ${issue.message}`, 'red'));
      if (issue.details) {
        console.log(colorize(`      📝 ${issue.details}`, 'reset'));
      }
    });
}

if (validationResults.warnings > 0) {
  console.log(colorize('\n⚠️ Warnings:', 'yellow'));
  validationResults.issues
    .filter(issue => issue.type === 'warnings')
    .forEach(issue => {
      console.log(colorize(`   ⚠️  ${issue.message}`, 'yellow'));
    });
}

console.log(colorize('\n🎉 Validation Complete!', 'green'));

if (validationResults.failed === 0) {
  console.log(colorize('✅ All critical checks passed! FlashFusion App is ready.', 'green'));
  process.exit(0);
} else {
  console.log(colorize('❌ Critical issues found. Please fix before proceeding.', 'red'));
  process.exit(1);
}