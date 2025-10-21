#!/usr/bin/env node

/**
 * FlashFusion UI Improvements Tracker
 * 
 * This script helps track and validate UI improvements across the platform
 * Run: node scripts/ui-improvements-tracker.js
 */

const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// FlashFusion specific patterns to check
const patterns = {
  typography: {
    // Should use ff-text- instead of text-
    badPattern: /className="[^"]*\btext-(xs|sm|base|lg|xl|2xl|3xl)\b[^"]*"/g,
    goodPattern: /className="[^"]*\bff-text-(xs|sm|base|lg|xl|2xl|3xl)\b[^"]*"/g,
    message: 'Use FlashFusion typography classes (ff-text-*) instead of generic Tailwind'
  },
  fonts: {
    // Headings should use font-sora
    headingPattern: /<h[1-6][^>]*className="[^"]*"[^>]*>/g,
    shouldInclude: 'font-sora',
    message: 'Headings should use font-sora class'
  },
  buttons: {
    // Buttons should use FlashFusion button classes
    badPattern: /className="[^"]*\bbg-(blue|red|green|gray)-\d+\b[^"]*"/g,
    goodPattern: /className="[^"]*\bff-btn-(primary|secondary|accent)\b[^"]*"/g,
    message: 'Use FlashFusion button classes (ff-btn-*) instead of generic background colors'
  },
  focus: {
    // Interactive elements should have focus states
    inputPattern: /<(input|textarea|select|button)[^>]*className="[^"]*"[^>]*>/g,
    shouldInclude: 'ff-focus-ring',
    message: 'Interactive elements should include ff-focus-ring class'
  },
  animations: {
    // Cards should have hover effects
    cardPattern: /<Card[^>]*className="[^"]*"[^>]*>/g,
    shouldInclude: 'ff-card-interactive|ff-hover-',
    message: 'Cards should include interactive classes (ff-card-interactive or ff-hover-*)'
  }
};

// Components directory
const componentsDir = path.join(process.cwd(), 'components');

// Results tracking
const results = {
  total: 0,
  issues: 0,
  fixed: 0,
  files: []
};

/**
 * Analyze a single file for FlashFusion compliance
 */
function analyzeFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(process.cwd(), filePath);
  
  const fileIssues = [];
  
  // Check typography
  const badTypography = content.match(patterns.typography.badPattern);
  if (badTypography) {
    fileIssues.push({
      type: 'typography',
      count: badTypography.length,
      message: patterns.typography.message,
      examples: badTypography.slice(0, 3)
    });
  }

  // Check font usage in headings
  const headings = content.match(patterns.fonts.headingPattern);
  if (headings) {
    const badHeadings = headings.filter(h => !h.includes(patterns.fonts.shouldInclude));
    if (badHeadings.length > 0) {
      fileIssues.push({
        type: 'fonts',
        count: badHeadings.length,
        message: patterns.fonts.message,
        examples: badHeadings.slice(0, 3)
      });
    }
  }

  // Check button classes
  const badButtons = content.match(patterns.buttons.badPattern);
  if (badButtons) {
    fileIssues.push({
      type: 'buttons',
      count: badButtons.length,
      message: patterns.buttons.message,
      examples: badButtons.slice(0, 3)
    });
  }

  // Check focus states
  const inputs = content.match(patterns.focus.inputPattern);
  if (inputs) {
    const badInputs = inputs.filter(i => !i.includes(patterns.focus.shouldInclude));
    if (badInputs.length > 0) {
      fileIssues.push({
        type: 'focus',
        count: badInputs.length,
        message: patterns.focus.message,
        examples: badInputs.slice(0, 3)
      });
    }
  }

  // Check card animations
  const cards = content.match(patterns.animations.cardPattern);
  if (cards) {
    const badCards = cards.filter(c => !new RegExp(patterns.animations.shouldInclude).test(c));
    if (badCards.length > 0) {
      fileIssues.push({
        type: 'animations',
        count: badCards.length,
        message: patterns.animations.message,
        examples: badCards.slice(0, 3)
      });
    }
  }

  return {
    path: relativePath,
    issues: fileIssues,
    totalIssues: fileIssues.reduce((sum, issue) => sum + issue.count, 0)
  };
}

/**
 * Recursively scan directory for TypeScript/React files
 */
function scanDirectory(dir) {
  const files = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        files.push(...scanDirectory(fullPath));
      } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts'))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.warn(`${colors.yellow}Warning: Could not scan directory ${dir}${colors.reset}`);
  }
  
  return files;
}

/**
 * Generate improvement suggestions
 */
function generateSuggestions(fileResult) {
  const suggestions = [];
  
  fileResult.issues.forEach(issue => {
    switch (issue.type) {
      case 'typography':
        suggestions.push({
          find: 'text-(xs|sm|base|lg|xl|2xl|3xl)',
          replace: 'ff-text-$1',
          description: 'Replace generic text classes with FlashFusion typography'
        });
        break;
      case 'fonts':
        suggestions.push({
          find: '<h[1-6][^>]*className="([^"]*)"',
          replace: '<h[1-6] className="$1 font-sora"',
          description: 'Add font-sora class to headings'
        });
        break;
      case 'buttons':
        suggestions.push({
          find: 'bg-(blue|red|green)-\\d+',
          replace: 'ff-btn-primary (or secondary/accent)',
          description: 'Use FlashFusion button classes'
        });
        break;
      case 'focus':
        suggestions.push({
          find: 'className="([^"]*)"',
          replace: 'className="$1 ff-focus-ring"',
          description: 'Add focus ring to interactive elements'
        });
        break;
      case 'animations':
        suggestions.push({
          find: '<Card className="([^"]*)"',
          replace: '<Card className="$1 ff-card-interactive"',
          description: 'Add interactive classes to cards'
        });
        break;
    }
  });
  
  return suggestions;
}

/**
 * Main execution
 */
function main() {
  console.log(`${colors.bold}${colors.blue}🎨 FlashFusion UI Improvements Tracker${colors.reset}\n`);
  
  // Scan components directory
  const files = scanDirectory(componentsDir);
  
  // Also scan App.tsx and main files
  const mainFiles = ['App.tsx', 'main.tsx'].map(f => path.join(process.cwd(), f)).filter(f => fs.existsSync(f));
  files.push(...mainFiles);
  
  console.log(`Scanning ${files.length} files for FlashFusion compliance...\n`);
  
  files.forEach(file => {
    const result = analyzeFile(file);
    if (result && result.totalIssues > 0) {
      results.files.push(result);
      results.issues += result.totalIssues;
    }
    results.total++;
  });
  
  // Display results
  console.log(`${colors.bold}📊 Analysis Results${colors.reset}`);
  console.log(`Files scanned: ${results.total}`);
  console.log(`Files with issues: ${results.files.length}`);
  console.log(`Total issues found: ${results.issues}\n`);
  
  if (results.files.length === 0) {
    console.log(`${colors.green}✅ All files are FlashFusion compliant!${colors.reset}`);
    return;
  }
  
  // Sort files by issue count
  results.files.sort((a, b) => b.totalIssues - a.totalIssues);
  
  console.log(`${colors.bold}🔍 Files needing attention:${colors.reset}\n`);
  
  results.files.forEach((file, index) => {
    if (index < 10) { // Show top 10 files
      console.log(`${colors.red}${file.path}${colors.reset} (${file.totalIssues} issues)`);
      
      file.issues.forEach(issue => {
        console.log(`  ${colors.yellow}├─${colors.reset} ${issue.type}: ${issue.message}`);
        console.log(`     Count: ${issue.count}`);
        if (issue.examples && issue.examples.length > 0) {
          console.log(`     Example: ${issue.examples[0].substring(0, 80)}...`);
        }
      });
      
      // Show suggestions
      const suggestions = generateSuggestions(file);
      if (suggestions.length > 0) {
        console.log(`  ${colors.blue}└─ Suggestions:${colors.reset}`);
        suggestions.forEach(suggestion => {
          console.log(`     • ${suggestion.description}`);
          console.log(`       Find: ${suggestion.find}`);
          console.log(`       Replace: ${suggestion.replace}`);
        });
      }
      
      console.log('');
    }
  });
  
  if (results.files.length > 10) {
    console.log(`${colors.yellow}... and ${results.files.length - 10} more files${colors.reset}\n`);
  }
  
  // Priority recommendations
  console.log(`${colors.bold}🎯 Priority Actions:${colors.reset}`);
  
  const typographyIssues = results.files.reduce((sum, f) => sum + (f.issues.find(i => i.type === 'typography')?.count || 0), 0);
  const buttonIssues = results.files.reduce((sum, f) => sum + (f.issues.find(i => i.type === 'buttons')?.count || 0), 0);
  const focusIssues = results.files.reduce((sum, f) => sum + (f.issues.find(i => i.type === 'focus')?.count || 0), 0);
  
  if (typographyIssues > 0) {
    console.log(`1. ${colors.red}High Priority${colors.reset}: Fix ${typographyIssues} typography issues`);
    console.log(`   Run: find . -name "*.tsx" -exec sed -i 's/text-\\([a-z0-9]*\\)/ff-text-\\1/g' {} +`);
  }
  
  if (buttonIssues > 0) {
    console.log(`2. ${colors.yellow}Medium Priority${colors.reset}: Update ${buttonIssues} button classes`);
    console.log(`   Manual review needed for button styling`);
  }
  
  if (focusIssues > 0) {
    console.log(`3. ${colors.blue}Accessibility${colors.reset}: Add focus states to ${focusIssues} elements`);
    console.log(`   Add ff-focus-ring class to interactive elements`);
  }
  
  console.log(`\n${colors.bold}📖 For detailed guidance, see: UI_WORKFLOW_IMPROVEMENTS.md${colors.reset}`);
}

// Run the tracker
if (require.main === module) {
  main();
}

module.exports = { analyzeFile, scanDirectory, patterns };