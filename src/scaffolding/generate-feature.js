#!/usr/bin/env node

/**
 * @fileoverview FlashFusion Feature Generator
 * @version 1.0.0
 * 
 * Automated feature scaffolding tool that creates a complete feature structure
 * from templates with customization options.
 * 
 * Usage:
 *   node generate-feature.js --name MyFeature --type tool
 *   node generate-feature.js --name MyFeature --type page --with-tests --with-store
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    name: null,
    type: 'tool',
    description: '',
    category: 'general',
    withService: true,
    withStore: true,
    withTests: true,
    interactive: args.length === 0
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--name' && args[i + 1]) {
      options.name = args[++i];
    } else if (arg === '--type' && args[i + 1]) {
      options.type = args[++i];
    } else if (arg === '--description' && args[i + 1]) {
      options.description = args[++i];
    } else if (arg === '--category' && args[i + 1]) {
      options.category = args[++i];
    } else if (arg === '--no-service') {
      options.withService = false;
    } else if (arg === '--no-store') {
      options.withStore = false;
    } else if (arg === '--no-tests') {
      options.withTests = false;
    } else if (arg === '--help' || arg === '-h') {
      showHelp();
      process.exit(0);
    }
  }

  return options;
}

// Show help message
function showHelp() {
  console.log(`
${colors.bright}${colors.blue}FlashFusion Feature Generator${colors.reset}

${colors.bright}Usage:${colors.reset}
  node generate-feature.js [options]

${colors.bright}Options:${colors.reset}
  --name <name>         Feature name (PascalCase, e.g., MyFeature)
  --type <type>         Feature type: tool, page, widget (default: tool)
  --description <desc>  Feature description
  --category <cat>      Feature category (default: general)
  --no-service          Skip service layer generation
  --no-store            Skip store generation
  --no-tests            Skip test file generation
  -h, --help            Show this help message

${colors.bright}Examples:${colors.reset}
  ${colors.cyan}# Interactive mode${colors.reset}
  node generate-feature.js

  ${colors.cyan}# Quick generation${colors.reset}
  node generate-feature.js --name ImageEditor --type tool --description "Edit images with AI"

  ${colors.cyan}# Minimal feature (no service, no tests)${colors.reset}
  node generate-feature.js --name SimpleWidget --type widget --no-service --no-tests

${colors.bright}Feature Types:${colors.reset}
  tool    - Interactive tools and utilities (lazy-loaded, AI integration)
  page    - Full-page experiences (route-based, analytics)
  widget  - Reusable UI components (composable, minimal dependencies)
`);
}

// Interactive prompt
async function promptUser() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (query) => new Promise((resolve) => {
    rl.question(query, resolve);
  });

  console.log(`\n${colors.bright}${colors.blue}🚀 FlashFusion Feature Generator${colors.reset}\n`);

  const name = await question(`${colors.bright}Feature name (PascalCase):${colors.reset} `);
  const description = await question(`${colors.bright}Description:${colors.reset} `);
  const type = await question(`${colors.bright}Type (tool/page/widget):${colors.reset} `) || 'tool';
  const category = await question(`${colors.bright}Category:${colors.reset} `) || 'general';

  rl.close();

  return {
    name: name.trim(),
    description: description.trim(),
    type: type.trim(),
    category: category.trim(),
    withService: true,
    withStore: true,
    withTests: true
  };
}

// Validate feature name
function validateFeatureName(name) {
  if (!name) {
    throw new Error('Feature name is required');
  }

  // Check PascalCase
  if (!/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
    throw new Error('Feature name must be in PascalCase (e.g., MyFeature)');
  }

  return true;
}

// Convert PascalCase to kebab-case
function toKebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

// Replace placeholders in file content
function replacePlaceholders(content, options) {
  return content
    .replace(/\{\{FEATURE_NAME\}\}/g, options.name)
    .replace(/\{\{FEATURE_DESCRIPTION\}\}/g, options.description || `${options.name} feature`)
    .replace(/\{\{FEATURE_CATEGORY\}\}/g, options.category)
    .replace(/\{\{FEATURE_TYPE\}\}/g, options.type);
}

// Copy and process template files
function processTemplate(templateDir, targetDir, options) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const entries = fs.readdirSync(templateDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(templateDir, entry.name);
    const targetPath = path.join(
      targetDir,
      entry.name.replace(/FeatureTemplate/g, options.name)
    );

    if (entry.isDirectory()) {
      // Skip directories based on options
      if (entry.name === 'services' && !options.withService) continue;
      if (entry.name === 'stores' && !options.withStore) continue;
      if (entry.name === '__tests__' && !options.withTests) continue;

      processTemplate(sourcePath, targetPath, options);
    } else if (entry.isFile()) {
      const content = fs.readFileSync(sourcePath, 'utf8');
      const processedContent = replacePlaceholders(content, options);
      fs.writeFileSync(targetPath, processedContent, 'utf8');
    }
  }
}

// Generate feature
async function generateFeature(options) {
  try {
    console.log(`\n${colors.bright}Generating feature: ${colors.green}${options.name}${colors.reset}\n`);

    // Validate
    validateFeatureName(options.name);

    // Paths
    const templateDir = path.join(__dirname, 'templates', 'feature-template');
    const featuresDir = path.join(__dirname, '..', 'features');
    const featureDir = path.join(featuresDir, toKebabCase(options.name));

    // Check if feature already exists
    if (fs.existsSync(featureDir)) {
      console.error(`${colors.red}Error: Feature already exists at ${featureDir}${colors.reset}`);
      process.exit(1);
    }

    // Create features directory if it doesn't exist
    if (!fs.existsSync(featuresDir)) {
      fs.mkdirSync(featuresDir, { recursive: true });
    }

    // Copy and process templates
    console.log(`${colors.cyan}📁 Creating directory structure...${colors.reset}`);
    processTemplate(templateDir, featureDir, options);

    // Summary
    console.log(`\n${colors.green}✅ Feature generated successfully!${colors.reset}\n`);
    console.log(`${colors.bright}Location:${colors.reset} ${featureDir}`);
    console.log(`\n${colors.bright}Generated files:${colors.reset}`);
    console.log(`  ${colors.green}✓${colors.reset} Component: components/${options.name}.tsx`);
    if (options.withStore) console.log(`  ${colors.green}✓${colors.reset} Store: stores/${options.name}Store.ts`);
    if (options.withService) console.log(`  ${colors.green}✓${colors.reset} Service: services/${options.name}Service.ts`);
    console.log(`  ${colors.green}✓${colors.reset} Types: types/feature.types.ts`);
    if (options.withTests) console.log(`  ${colors.green}✓${colors.reset} Tests: __tests__/${options.name}.test.tsx`);
    console.log(`  ${colors.green}✓${colors.reset} Docs: docs/FEATURE_README.md`);

    // Next steps
    console.log(`\n${colors.bright}Next steps:${colors.reset}`);
    console.log(`  1. Review generated files in: ${colors.cyan}${featureDir}${colors.reset}`);
    console.log(`  2. Implement feature-specific logic`);
    console.log(`  3. Add feature to navigation/routing`);
    console.log(`  4. Run tests: ${colors.cyan}npm test ${options.name}.test.tsx${colors.reset}`);
    console.log(`  5. Start development server: ${colors.cyan}npm run dev${colors.reset}\n`);

  } catch (error) {
    console.error(`\n${colors.red}Error: ${error.message}${colors.reset}\n`);
    process.exit(1);
  }
}

// Main
async function main() {
  let options = parseArgs();

  if (options.interactive) {
    options = await promptUser();
  }

  if (!options.name) {
    console.error(`${colors.red}Error: Feature name is required${colors.reset}`);
    console.log(`Run with --help for usage information\n`);
    process.exit(1);
  }

  await generateFeature(options);
}

// Run
if (require.main === module) {
  main().catch((error) => {
    console.error(`\n${colors.red}Fatal error: ${error.message}${colors.reset}\n`);
    process.exit(1);
  });
}

module.exports = { generateFeature, parseArgs };
