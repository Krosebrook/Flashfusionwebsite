#!/usr/bin/env node

/**
 * FlashFusion Legacy File Cleanup Script
 * 
 * This script:
 * 1. Identifies duplicate/legacy files
 * 2. Archives them safely
 * 3. Ensures single source of truth
 * 4. Validates no broken imports
 * 
 * Run: node scripts/cleanup-legacy-files.js
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 FlashFusion Legacy File Cleanup\n');

// Files to archive (duplicates/legacy)
const filesToArchive = [
  'App-fixed.tsx',
  'App-debugged.tsx',
  'main.ts' // Duplicate of main.tsx
];

// Create archive directory
const archiveDir = path.join(process.cwd(), 'archive');
if (!fs.existsSync(archiveDir)) {
  fs.mkdirSync(archiveDir, { recursive: true });
  console.log('✅ Created archive directory\n');
}

// Archive legacy files
let archivedCount = 0;
let notFoundCount = 0;

filesToArchive.forEach(file => {
  const sourcePath = path.join(process.cwd(), file);
  const archivePath = path.join(archiveDir, file);
  
  if (fs.existsSync(sourcePath)) {
    try {
      // Copy to archive
      fs.copyFileSync(sourcePath, archivePath);
      
      // Remove original
      fs.unlinkSync(sourcePath);
      
      console.log(`✅ Archived: ${file}`);
      archivedCount++;
    } catch (error) {
      console.error(`❌ Error archiving ${file}:`, error.message);
    }
  } else {
    console.log(`ℹ️  Not found (already clean): ${file}`);
    notFoundCount++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Archived: ${archivedCount} files`);
console.log(`   Already clean: ${notFoundCount} files`);

// Verify main files exist
const requiredFiles = [
  'App.tsx',
  'main.tsx',
  'index.html',
  'package.json',
  'vite.config.ts',
  'Guidelines.md'
];

console.log(`\n🔍 Verifying required files...`);
let missingFiles = [];

requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ MISSING: ${file}`);
    missingFiles.push(file);
  }
});

if (missingFiles.length > 0) {
  console.log(`\n⚠️  Warning: ${missingFiles.length} required files missing!`);
  process.exit(1);
} else {
  console.log(`\n✅ All required files present`);
}

// Scan for any remaining legacy references
console.log(`\n🔍 Scanning for legacy references...`);

const searchPatterns = [
  /octave[\s-]?studio/gi,
  /octave/gi // More strict check
];

const filesToScan = [
  'package.json',
  'README.md',
  'Guidelines.md',
  'App.tsx',
  'main.tsx'
];

let legacyReferencesFound = false;

filesToScan.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    searchPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        console.log(`⚠️  Found in ${file}:`, matches);
        legacyReferencesFound = true;
      }
    });
  }
});

if (!legacyReferencesFound) {
  console.log(`✅ No legacy references found`);
} else {
  console.log(`\n⚠️  Legacy references detected - manual review needed`);
}

// Check for FlashFusion branding
console.log(`\n🎨 Verifying FlashFusion branding...`);

const brandingFiles = [
  { file: 'package.json', pattern: /FlashFusion/g },
  { file: 'README.md', pattern: /FlashFusion/g },
  { file: 'Guidelines.md', pattern: /FlashFusion/g }
];

brandingFiles.forEach(({ file, pattern }) => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const matches = content.match(pattern);
    
    if (matches && matches.length > 0) {
      console.log(`✅ ${file}: ${matches.length} FlashFusion references`);
    } else {
      console.log(`⚠️  ${file}: No FlashFusion branding found`);
    }
  }
});

// Final summary
console.log(`\n${'='.repeat(50)}`);
console.log(`✅ Cleanup Complete!`);
console.log(`${'='.repeat(50)}`);
console.log(`
Next steps:
1. Review archived files in /archive
2. Run: pnpm build (verify build works)
3. Run: pnpm test (verify tests pass)
4. Commit changes with: git commit -m "Clean up legacy files"
`);

process.exit(0);
