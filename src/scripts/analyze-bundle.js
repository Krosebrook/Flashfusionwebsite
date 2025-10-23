#!/usr/bin/env node

/**
 * Bundle Size Analyzer
 * 
 * Analyzes bundle size and provides optimization recommendations
 * Target: Reduce from 650KB to <300KB
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 FlashFusion Bundle Size Analyzer\n');
console.log('='.repeat(60));

// ============================================
// Configuration
// ============================================

const config = {
  distDir: path.join(process.cwd(), 'dist'),
  targetSize: 300 * 1024, // 300 KB
  warningSize: 400 * 1024, // 400 KB
  maxChunkSize: 100 * 1024, // 100 KB
};

// ============================================
// Utility Functions
// ============================================

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  
  return arrayOfFiles;
}

// ============================================
// Build Application
// ============================================

console.log('\n📦 Step 1: Building Application...\n');

try {
  // Build with bundle analysis
  execSync('pnpm build', {
    stdio: 'inherit',
    env: { ...process.env, ANALYZE: 'false' },
  });
  console.log('✅ Build completed successfully\n');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// ============================================
// Analyze Bundle Size
// ============================================

console.log('\n📊 Step 2: Analyzing Bundle Size...\n');

if (!fs.existsSync(config.distDir)) {
  console.error('❌ dist directory not found. Build may have failed.');
  process.exit(1);
}

const allFiles = getAllFiles(config.distDir);

// Categorize files
const jsFiles = allFiles.filter(f => f.endsWith('.js'));
const cssFiles = allFiles.filter(f => f.endsWith('.css'));
const imageFiles = allFiles.filter(f => /\.(png|jpg|jpeg|gif|svg|webp|avif)$/i.test(f));
const otherFiles = allFiles.filter(f => 
  !jsFiles.includes(f) && 
  !cssFiles.includes(f) && 
  !imageFiles.includes(f)
);

// Calculate sizes
const jsSize = jsFiles.reduce((total, file) => total + getFileSize(file), 0);
const cssSize = cssFiles.reduce((total, file) => total + getFileSize(file), 0);
const imageSize = imageFiles.reduce((total, file) => total + getFileSize(file), 0);
const otherSize = otherFiles.reduce((total, file) => total + getFileSize(file), 0);
const totalSize = jsSize + cssSize + imageSize + otherSize;

// ============================================
// Display Results
// ============================================

console.log('Bundle Size Breakdown:');
console.log('─'.repeat(60));
console.log(`JavaScript: ${formatBytes(jsSize)} (${((jsSize / totalSize) * 100).toFixed(1)}%)`);
console.log(`CSS: ${formatBytes(cssSize)} (${((cssSize / totalSize) * 100).toFixed(1)}%)`);
console.log(`Images: ${formatBytes(imageSize)} (${((imageSize / totalSize) * 100).toFixed(1)}%)`);
console.log(`Other: ${formatBytes(otherSize)} (${((otherSize / totalSize) * 100).toFixed(1)}%)`);
console.log('─'.repeat(60));
console.log(`Total: ${formatBytes(totalSize)}`);
console.log(`Target: ${formatBytes(config.targetSize)}`);
console.log('─'.repeat(60));

// Status
if (totalSize <= config.targetSize) {
  console.log(`\n✅ Bundle size meets target! (${formatBytes(totalSize)} ≤ ${formatBytes(config.targetSize)})`);
} else if (totalSize <= config.warningSize) {
  console.log(`\n⚠️  Bundle size above target but acceptable (${formatBytes(totalSize)} > ${formatBytes(config.targetSize)})`);
} else {
  console.log(`\n❌ Bundle size exceeds limits! (${formatBytes(totalSize)} > ${formatBytes(config.warningSize)})`);
}

// ============================================
// Analyze Largest Files
// ============================================

console.log('\n📈 Largest JavaScript Chunks:');
console.log('─'.repeat(60));

const jsFileSizes = jsFiles.map(file => ({
  file: path.relative(config.distDir, file),
  size: getFileSize(file),
})).sort((a, b) => b.size - a.size);

jsFileSizes.slice(0, 10).forEach((item, index) => {
  const sizeKB = (item.size / 1024).toFixed(2);
  const percentage = ((item.size / jsSize) * 100).toFixed(1);
  const status = item.size > config.maxChunkSize ? '⚠️ ' : '✅';
  console.log(`${status} ${index + 1}. ${item.file}: ${sizeKB} KB (${percentage}%)`);
});

console.log('\n📈 Largest CSS Files:');
console.log('─'.repeat(60));

const cssFileSizes = cssFiles.map(file => ({
  file: path.relative(config.distDir, file),
  size: getFileSize(file),
})).sort((a, b) => b.size - a.size);

cssFileSizes.slice(0, 5).forEach((item, index) => {
  const sizeKB = (item.size / 1024).toFixed(2);
  const percentage = ((item.size / cssSize) * 100).toFixed(1);
  console.log(`${index + 1}. ${item.file}: ${sizeKB} KB (${percentage}%)`);
});

// ============================================
// Optimization Recommendations
// ============================================

console.log('\n💡 Optimization Recommendations:');
console.log('='.repeat(60));

const recommendations = [];

// Check for large chunks
const largeChunks = jsFileSizes.filter(f => f.size > config.maxChunkSize);
if (largeChunks.length > 0) {
  recommendations.push({
    priority: 'HIGH',
    issue: `${largeChunks.length} JavaScript chunks exceed 100 KB`,
    action: 'Implement code splitting for large chunks',
    impact: 'High - Could reduce initial load by 50%+',
  });
}

// Check for duplicate dependencies
if (jsSize > 500 * 1024) {
  recommendations.push({
    priority: 'HIGH',
    issue: 'Total JavaScript size exceeds 500 KB',
    action: 'Review dependencies and remove unused imports',
    impact: 'High - Potential 30-40% reduction',
  });
}

// Check for image optimization
if (imageSize > 200 * 1024) {
  recommendations.push({
    priority: 'MEDIUM',
    issue: `Images total ${formatBytes(imageSize)}`,
    action: 'Convert images to WebP/AVIF and implement lazy loading',
    impact: 'Medium - Could reduce image size by 60%',
  });
}

// Check for CSS optimization
if (cssSize > 100 * 1024) {
  recommendations.push({
    priority: 'MEDIUM',
    issue: `CSS size is ${formatBytes(cssSize)}`,
    action: 'Enable CSS purging and minification',
    impact: 'Medium - Could reduce CSS by 40%',
  });
}

// Check for vendor bundle
const vendorChunks = jsFileSizes.filter(f => f.file.includes('vendor'));
if (vendorChunks.length === 0) {
  recommendations.push({
    priority: 'LOW',
    issue: 'No separate vendor bundle detected',
    action: 'Split vendor dependencies into separate chunk',
    impact: 'Low - Improves caching',
  });
}

// Display recommendations
if (recommendations.length === 0) {
  console.log('✅ No optimization recommendations - bundle is well optimized!');
} else {
  recommendations.forEach((rec, index) => {
    console.log(`\n${index + 1}. [${rec.priority}] ${rec.issue}`);
    console.log(`   Action: ${rec.action}`);
    console.log(`   Impact: ${rec.impact}`);
  });
}

// ============================================
// Action Items
// ============================================

console.log('\n📋 Next Steps:');
console.log('='.repeat(60));

if (totalSize <= config.targetSize) {
  console.log('✅ Bundle is optimized! Monitor for regressions.');
} else {
  console.log('1. Review vite-bundle-config.ts for optimization settings');
  console.log('2. Run ANALYZE=true pnpm build to see detailed bundle analysis');
  console.log('3. Implement code splitting for large chunks');
  console.log('4. Remove unused dependencies and imports');
  console.log('5. Enable compression (Brotli + Gzip)');
}

// ============================================
// Save Report
// ============================================

const report = {
  timestamp: new Date().toISOString(),
  totalSize,
  targetSize: config.targetSize,
  breakdown: {
    javascript: jsSize,
    css: cssSize,
    images: imageSize,
    other: otherSize,
  },
  largestChunks: jsFileSizes.slice(0, 10),
  recommendations,
  meetsTarget: totalSize <= config.targetSize,
};

fs.writeFileSync(
  path.join(config.distDir, 'bundle-report.json'),
  JSON.stringify(report, null, 2)
);

console.log('\n📄 Report saved to dist/bundle-report.json');
console.log('='.repeat(60));

// Exit code
process.exit(totalSize <= config.warningSize ? 0 : 1);
