#!/usr/bin/env node

/**
 * FlashFusion Monorepo Import Migration Script
 * 
 * Automatically updates imports to use workspace packages
 */

const fs = require('fs');
const path = require('path');

// Import mappings
const IMPORT_MAPPINGS = {
  // UI components
  "from '../../components/ui/": "from '@flashfusion/ui/",
  "from '../components/ui/": "from '@flashfusion/ui/",
  "from './components/ui/": "from '@flashfusion/ui/",
  "from '~/components/ui/": "from '@flashfusion/ui/",
  
  // Types
  "from '../../types/": "from '@flashfusion/types/",
  "from '../types/": "from '@flashfusion/types/",
  "from './types/": "from '@flashfusion/types/",
  "from '~/types/": "from '@flashfusion/types/",
  
  // Hooks
  "from '../../hooks/": "from '@flashfusion/hooks/",
  "from '../hooks/": "from '@flashfusion/hooks/",
  "from './hooks/": "from '@flashfusion/hooks/",
  "from '~/hooks/": "from '@flashfusion/hooks/",
  
  // Services
  "from '../../services/": "from '@flashfusion/services/",
  "from '../services/": "from '@flashfusion/services/",
  "from './services/": "from '@flashfusion/services/",
  "from '~/services/": "from '@flashfusion/services/",
  
  // Utils
  "from '../../utils/": "from '@flashfusion/utils/",
  "from '../utils/": "from '@flashfusion/utils/",
  "from './utils/": "from '@flashfusion/utils/",
  "from '~/utils/": "from '@flashfusion/utils/",
  
  // Config
  "from '../../lib/config'": "from '@flashfusion/config'",
  "from '../lib/config'": "from '@flashfusion/config'",
  "from './lib/config'": "from '@flashfusion/config'",
};

// Directories to process
const DIRS_TO_PROCESS = [
  'apps/web/src',
];

// File extensions to process
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

let filesProcessed = 0;
let importsUpdated = 0;

/**
 * Process a single file
 */
function processFile(filePath) {
  const ext = path.extname(filePath);
  if (!EXTENSIONS.includes(ext)) {
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  let updated = false;
  let fileUpdates = 0;

  // Apply each import mapping
  for (const [oldImport, newImport] of Object.entries(IMPORT_MAPPINGS)) {
    const regex = new RegExp(oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    
    if (matches) {
      content = content.replace(regex, newImport);
      updated = true;
      fileUpdates += matches.length;
    }
  }

  // Clean up any remaining relative paths to ui components
  const cleanupPatterns = [
    { 
      pattern: /from ['"]\.\.\/\.\.\/\.\.\/components\/ui\/([^'"]+)['"]/g,
      replacement: "from '@flashfusion/ui/$1'"
    },
    {
      pattern: /from ['"]\.\.\/\.\.\/components\/ui\/([^'"]+)['"]/g,
      replacement: "from '@flashfusion/ui/$1'"
    }
  ];

  for (const { pattern, replacement } of cleanupPatterns) {
    const matches = content.match(pattern);
    if (matches) {
      content = content.replace(pattern, replacement);
      updated = true;
      fileUpdates += matches.length;
    }
  }

  if (updated) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Updated ${filePath} (${fileUpdates} imports)`);
    importsUpdated += fileUpdates;
  }

  filesProcessed++;
}

/**
 * Recursively process directory
 */
function processDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`⚠️  Directory not found: ${dir}`);
    return;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip node_modules, dist, etc.
      if (['node_modules', 'dist', 'build', '.turbo', '.vite'].includes(entry.name)) {
        continue;
      }
      processDirectory(fullPath);
    } else if (entry.isFile()) {
      processFile(fullPath);
    }
  }
}

/**
 * Main execution
 */
console.log('🚀 FlashFusion Monorepo Import Migration\n');
console.log('Processing directories:');
DIRS_TO_PROCESS.forEach(dir => console.log(`  - ${dir}`));
console.log('');

const startTime = Date.now();

for (const dir of DIRS_TO_PROCESS) {
  processDirectory(dir);
}

const duration = ((Date.now() - startTime) / 1000).toFixed(2);

console.log('\n✨ Migration Complete!\n');
console.log(`📊 Results:`);
console.log(`  - Files processed: ${filesProcessed}`);
console.log(`  - Imports updated: ${importsUpdated}`);
console.log(`  - Time taken: ${duration}s`);
console.log('');
console.log('🎯 Next steps:');
console.log('  1. Run: pnpm install');
console.log('  2. Run: pnpm type-check');
console.log('  3. Run: pnpm dev');
console.log('  4. Test the application');
console.log('');
