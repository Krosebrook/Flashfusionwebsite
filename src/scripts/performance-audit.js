#!/usr/bin/env node

/**
 * FlashFusion Performance Audit Script
 * Comprehensive performance analysis and optimization recommendations
 */

const fs = require('fs');
const path = require('path');

class FlashFusionPerformanceAuditor {
  constructor() {
    this.issues = [];
    this.recommendations = [];
    this.metrics = {
      bundleSize: 0,
      componentCount: 0,
      heavyComponents: [],
      unusedDependencies: [],
      optimizationOpportunities: []
    };
  }

  async runAudit() {
    console.log('🔥 FlashFusion Performance Audit');
    console.log('=' .repeat(50));
    console.log();

    try {
      await this.analyzeBundleSize();
      await this.analyzeComponents();
      await this.analyzeDependencies();
      await this.analyzeAssets();
      await this.checkPerformanceBestPractices();
      
      this.generateReport();
    } catch (error) {
      console.error('❌ Audit failed:', error.message);
      process.exit(1);
    }
  }

  async analyzeBundleSize() {
    console.log('📦 Analyzing bundle size...');
    
    const distPath = './dist';
    if (!fs.existsSync(distPath)) {
      this.issues.push({
        type: 'bundle',
        severity: 'info',
        message: 'No dist folder found. Run build first for accurate analysis.',
        recommendation: 'Run: npm run build:prod'
      });
      return;
    }

    try {
      const stats = this.getDirectorySize(distPath);
      this.metrics.bundleSize = stats.size;
      
      console.log(`   Total bundle size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
      
      // Check bundle size thresholds
      const bundleSizeMB = stats.size / 1024 / 1024;
      if (bundleSizeMB > 5) {
        this.issues.push({
          type: 'bundle',
          severity: 'critical',
          message: `Bundle size is ${bundleSizeMB.toFixed(2)}MB, which is too large`,
          recommendation: 'Implement code splitting and tree shaking'
        });
      } else if (bundleSizeMB > 2) {
        this.issues.push({
          type: 'bundle',
          severity: 'warning',
          message: `Bundle size is ${bundleSizeMB.toFixed(2)}MB, consider optimization`,
          recommendation: 'Review and optimize large dependencies'
        });
      }

      // Analyze individual files
      const files = this.getFilesRecursively(distPath);
      const largeFiles = files
        .filter(file => file.size > 1024 * 1024) // > 1MB
        .sort((a, b) => b.size - a.size);

      if (largeFiles.length > 0) {
        this.issues.push({
          type: 'bundle',
          severity: 'warning',
          message: `Found ${largeFiles.length} large files (>1MB)`,
          recommendation: 'Consider splitting or optimizing these files',
          details: largeFiles.slice(0, 5).map(f => `${f.name}: ${(f.size / 1024 / 1024).toFixed(2)}MB`)
        });
      }
      
    } catch (error) {
      console.warn('   Warning: Could not analyze bundle size');
    }
  }

  async analyzeComponents() {
    console.log('🧩 Analyzing components...');
    
    const componentsDir = './components';
    if (!fs.existsSync(componentsDir)) {
      return;
    }

    const componentFiles = this.getAllTsxFiles(componentsDir);
    this.metrics.componentCount = componentFiles.length;
    
    console.log(`   Found ${componentFiles.length} components`);

    // Analyze each component
    for (const file of componentFiles) {
      const analysis = this.analyzeComponentFile(file);
      if (analysis.isHeavy) {
        this.metrics.heavyComponents.push(analysis);
      }
    }

    if (this.metrics.heavyComponents.length > 0) {
      this.issues.push({
        type: 'components',
        severity: 'warning',
        message: `Found ${this.metrics.heavyComponents.length} potentially heavy components`,
        recommendation: 'Consider optimizing with React.memo, useMemo, or code splitting',
        details: this.metrics.heavyComponents.map(c => `${c.name}: ${c.lines} lines, ${c.imports} imports`)
      });
    }
  }

  async analyzeDependencies() {
    console.log('📚 Analyzing dependencies...');
    
    const packageJsonPath = './package.json';
    if (!fs.existsSync(packageJsonPath)) {
      return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const dependencies = { 
      ...packageJson.dependencies, 
      ...packageJson.devDependencies 
    };

    const heavyDependencies = [
      'moment', 'lodash', 'jquery', 'bootstrap', 'material-ui'
    ];

    const foundHeavyDeps = Object.keys(dependencies).filter(dep => 
      heavyDependencies.some(heavy => dep.includes(heavy))
    );

    if (foundHeavyDeps.length > 0) {
      this.issues.push({
        type: 'dependencies',
        severity: 'warning',
        message: `Found potentially heavy dependencies: ${foundHeavyDeps.join(', ')}`,
        recommendation: 'Consider lighter alternatives or tree shaking',
        details: foundHeavyDeps
      });
    }

    // Check for unused dependencies (basic heuristic)
    const allFiles = this.getAllFiles('./', ['.tsx', '.ts', '.js', '.jsx']);
    const allFileContents = allFiles.map(file => fs.readFileSync(file, 'utf-8')).join(' ');
    
    const potentiallyUnused = Object.keys(dependencies).filter(dep => {
      // Skip common system dependencies
      if (['react', 'react-dom', 'typescript', 'vite', '@types/', 'eslint', 'prettier'].some(common => dep.includes(common))) {
        return false;
      }
      
      const depName = dep.replace(/[-@]/g, '');
      return !allFileContents.includes(dep) && !allFileContents.includes(depName);
    });

    if (potentiallyUnused.length > 0) {
      this.metrics.unusedDependencies = potentiallyUnused;
      this.issues.push({
        type: 'dependencies',
        severity: 'info',
        message: `Found ${potentiallyUnused.length} potentially unused dependencies`,
        recommendation: 'Review and remove unused packages',
        details: potentiallyUnused.slice(0, 10)
      });
    }

    console.log(`   Analyzed ${Object.keys(dependencies).length} dependencies`);
  }

  async analyzeAssets() {
    console.log('🖼️  Analyzing assets...');
    
    const publicPath = './public';
    if (!fs.existsSync(publicPath)) {
      return;
    }

    const imageFiles = this.getAllFiles(publicPath, ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']);
    let totalImageSize = 0;
    const largeImages = [];

    imageFiles.forEach(file => {
      const stats = fs.statSync(file);
      totalImageSize += stats.size;
      
      if (stats.size > 500 * 1024) { // > 500KB
        largeImages.push({
          name: path.basename(file),
          size: stats.size,
          path: file
        });
      }
    });

    if (largeImages.length > 0) {
      this.issues.push({
        type: 'assets',
        severity: 'warning',
        message: `Found ${largeImages.length} large images (>500KB)`,
        recommendation: 'Optimize images with compression or WebP format',
        details: largeImages.map(img => `${img.name}: ${(img.size / 1024).toFixed(0)}KB`)
      });
    }

    console.log(`   Analyzed ${imageFiles.length} images, total: ${(totalImageSize / 1024 / 1024).toFixed(2)}MB`);
  }

  async checkPerformanceBestPractices() {
    console.log('⚡ Checking performance best practices...');
    
    // Check for lazy loading
    const appTsxPath = './App.tsx';
    if (fs.existsSync(appTsxPath)) {
      const appContent = fs.readFileSync(appTsxPath, 'utf-8');
      
      if (!appContent.includes('React.lazy')) {
        this.recommendations.push({
          type: 'optimization',
          message: 'Consider implementing lazy loading for routes',
          implementation: 'Use React.lazy() for code splitting'
        });
      }
      
      if (!appContent.includes('Suspense')) {
        this.recommendations.push({
          type: 'optimization',
          message: 'Add Suspense boundaries for better loading states',
          implementation: 'Wrap lazy components with <Suspense>'
        });
      }
      
      if (!appContent.includes('memo') && !appContent.includes('useMemo')) {
        this.recommendations.push({
          type: 'optimization',
          message: 'Consider using React.memo and useMemo for expensive components',
          implementation: 'Memoize heavy computations and components'
        });
      }
    }

    // Check vite config
    const viteConfigPath = './vite.config.ts';
    if (fs.existsSync(viteConfigPath)) {
      const viteContent = fs.readFileSync(viteConfigPath, 'utf-8');
      
      if (!viteContent.includes('rollupOptions')) {
        this.recommendations.push({
          type: 'build',
          message: 'Configure Rollup options for better bundling',
          implementation: 'Add manual chunk configuration in vite.config.ts'
        });
      }
    }
  }

  analyzeComponentFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').length;
    const imports = (content.match(/^import/gm) || []).length;
    const hasUseEffect = content.includes('useEffect');
    const hasLargeJSX = content.length > 10000; // > 10KB
    
    return {
      name: path.basename(filePath),
      path: filePath,
      lines,
      imports,
      hasUseEffect,
      isHeavy: lines > 200 || imports > 15 || hasLargeJSX
    };
  }

  getDirectorySize(dirPath) {
    let totalSize = 0;
    let fileCount = 0;
    
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        const subDirStats = this.getDirectorySize(filePath);
        totalSize += subDirStats.size;
        fileCount += subDirStats.count;
      } else {
        totalSize += stats.size;
        fileCount++;
      }
    }
    
    return { size: totalSize, count: fileCount };
  }

  getFilesRecursively(dirPath) {
    let files = [];
    
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        files = files.concat(this.getFilesRecursively(itemPath));
      } else {
        files.push({
          name: item,
          path: itemPath,
          size: stats.size
        });
      }
    }
    
    return files;
  }

  getAllTsxFiles(dir) {
    return this.getAllFiles(dir, ['.tsx']);
  }

  getAllFiles(dir, extensions = []) {
    let files = [];
    
    if (!fs.existsSync(dir)) {
      return files;
    }
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        files = files.concat(this.getAllFiles(itemPath, extensions));
      } else if (stats.isFile()) {
        if (extensions.length === 0 || extensions.some(ext => item.endsWith(ext))) {
          files.push(itemPath);
        }
      }
    }
    
    return files;
  }

  generateReport() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 PERFORMANCE AUDIT REPORT');
    console.log('='.repeat(50));

    // Summary
    console.log('\n📈 SUMMARY:');
    console.log(`   Bundle Size: ${(this.metrics.bundleSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Components: ${this.metrics.componentCount}`);
    console.log(`   Heavy Components: ${this.metrics.heavyComponents.length}`);
    console.log(`   Unused Dependencies: ${this.metrics.unusedDependencies.length}`);
    console.log(`   Issues Found: ${this.issues.length}`);
    console.log(`   Recommendations: ${this.recommendations.length}`);

    // Issues
    if (this.issues.length > 0) {
      console.log('\n🚨 ISSUES:');
      
      const critical = this.issues.filter(i => i.severity === 'critical');
      const warnings = this.issues.filter(i => i.severity === 'warning');
      const info = this.issues.filter(i => i.severity === 'info');

      if (critical.length > 0) {
        console.log('\n   ❌ CRITICAL:');
        critical.forEach(issue => {
          console.log(`      • ${issue.message}`);
          console.log(`        → ${issue.recommendation}`);
          if (issue.details) {
            issue.details.forEach(detail => console.log(`          - ${detail}`));
          }
        });
      }

      if (warnings.length > 0) {
        console.log('\n   ⚠️  WARNINGS:');
        warnings.forEach(issue => {
          console.log(`      • ${issue.message}`);
          console.log(`        → ${issue.recommendation}`);
          if (issue.details) {
            issue.details.slice(0, 3).forEach(detail => console.log(`          - ${detail}`));
            if (issue.details.length > 3) {
              console.log(`          ... and ${issue.details.length - 3} more`);
            }
          }
        });
      }

      if (info.length > 0) {
        console.log('\n   ℹ️  INFO:');
        info.forEach(issue => {
          console.log(`      • ${issue.message}`);
          console.log(`        → ${issue.recommendation}`);
        });
      }
    }

    // Recommendations
    if (this.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      this.recommendations.forEach(rec => {
        console.log(`   • ${rec.message}`);
        console.log(`     Implementation: ${rec.implementation}`);
      });
    }

    // Performance Score
    const score = this.calculatePerformanceScore();
    console.log('\n' + '='.repeat(50));
    console.log(`🏆 PERFORMANCE SCORE: ${score}/100`);
    
    if (score >= 90) {
      console.log('🎉 Excellent! Your FlashFusion app is highly optimized.');
    } else if (score >= 70) {
      console.log('👍 Good performance, but there\'s room for improvement.');
    } else if (score >= 50) {
      console.log('⚠️  Fair performance. Address the critical issues first.');
    } else {
      console.log('🚨 Poor performance. Immediate optimization needed.');
    }

    console.log('='.repeat(50));

    // Save detailed report
    this.saveDetailedReport();
  }

  calculatePerformanceScore() {
    let score = 100;

    // Deduct points for issues
    this.issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical':
          score -= 20;
          break;
        case 'warning':
          score -= 10;
          break;
        case 'info':
          score -= 2;
          break;
      }
    });

    // Bundle size penalty
    const bundleSizeMB = this.metrics.bundleSize / 1024 / 1024;
    if (bundleSizeMB > 5) score -= 15;
    else if (bundleSizeMB > 3) score -= 10;
    else if (bundleSizeMB > 2) score -= 5;

    // Heavy components penalty
    if (this.metrics.heavyComponents.length > 10) score -= 10;
    else if (this.metrics.heavyComponents.length > 5) score -= 5;

    return Math.max(0, score);
  }

  saveDetailedReport() {
    const report = {
      timestamp: new Date().toISOString(),
      score: this.calculatePerformanceScore(),
      metrics: this.metrics,
      issues: this.issues,
      recommendations: this.recommendations,
      summary: {
        bundleSize: this.metrics.bundleSize,
        componentCount: this.metrics.componentCount,
        heavyComponents: this.metrics.heavyComponents.length,
        unusedDependencies: this.metrics.unusedDependencies.length,
        totalIssues: this.issues.length
      }
    };

    const reportPath = `./performance-audit-${Date.now()}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Detailed report saved: ${reportPath}`);
  }
}

// CLI interface
async function main() {
  const auditor = new FlashFusionPerformanceAuditor();
  await auditor.runAudit();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = FlashFusionPerformanceAuditor;