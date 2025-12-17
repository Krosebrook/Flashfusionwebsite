#!/usr/bin/env node

/**
 * FlashFusion Comprehensive Codebase Audit
 * 
 * This script performs a thorough audit of the codebase including:
 * - Security vulnerabilities
 * - Code quality issues
 * - Dependency analysis
 * - Configuration validation
 * - Best practices compliance
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class CodebaseAuditor {
  constructor() {
    this.findings = {
      critical: [],
      high: [],
      medium: [],
      low: [],
      info: []
    };
    this.metrics = {
      filesAnalyzed: 0,
      securityIssues: 0,
      codeQualityIssues: 0,
      configurationIssues: 0,
      totalIssues: 0
    };
  }

  async runAudit() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║       FlashFusion Comprehensive Codebase Audit            ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log();

    try {
      await this.checkDependencySecurity();
      await this.analyzeDependencyConflicts();
      await this.checkCodeSecurity();
      await this.analyzeCodeQuality();
      await this.validateConfiguration();
      await this.checkBestPractices();
      await this.analyzeFileStructure();
      
      this.generateReport();
      this.saveReport();
      
      return this.getExitCode();
    } catch (error) {
      console.error('❌ Audit failed:', error.message);
      process.exit(1);
    }
  }

  async checkDependencySecurity() {
    console.log('🔒 [1/7] Checking Dependency Security...');
    
    try {
      const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
      const dependencies = { 
        ...packageJson.dependencies || {}, 
        ...packageJson.devDependencies || {} 
      };

      // Check for packages with known vulnerabilities
      const vulnerablePatterns = [
        { name: 'node-fetch', version: '<2.6.7', issue: 'SSRF vulnerability' },
        { name: 'lodash', version: '<4.17.21', issue: 'Prototype pollution' },
        { name: 'react-scripts', version: '<5.0.0', issue: 'Multiple vulnerabilities' },
        { name: 'moment', version: '*', issue: 'Large bundle, unmaintained - use date-fns' }
      ];

      // Check for wildcard dependencies
      Object.entries(dependencies).forEach(([name, version]) => {
        if (version === '*' || version === 'latest') {
          this.addFinding('high', 'dependency', 
            `Unpinned dependency: ${name}@${version}`,
            `Pin to specific version for reproducible builds`
          );
        }
      });

      // Check dependency count
      const depCount = Object.keys(dependencies).length;
      if (depCount > 100) {
        this.addFinding('medium', 'dependency',
          `High dependency count: ${depCount} packages`,
          'Consider reducing dependencies to minimize attack surface'
        );
      }

      console.log(`   ✓ Analyzed ${depCount} dependencies`);
      
    } catch (error) {
      console.warn('   ⚠️  Could not analyze dependencies:', error.message);
    }
  }

  async analyzeDependencyConflicts() {
    console.log('🔍 [2/7] Analyzing Dependency Conflicts...');
    
    try {
      const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
      
      // Check for peer dependency issues
      const viteVersion = packageJson.devDependencies?.vite || packageJson.dependencies?.vite;
      const viteLegacy = packageJson.dependencies?.['@vitejs/plugin-legacy'];
      
      if (viteVersion && viteLegacy) {
        const viteVersionNum = viteVersion.match(/[\d.]+/)?.[0];
        if (viteVersionNum && parseFloat(viteVersionNum) < 7) {
          this.addFinding('critical', 'dependency',
            `Dependency conflict: @vitejs/plugin-legacy@7.2.1 requires vite@^7.0.0 but vite@${viteVersion} is installed`,
            'Either upgrade vite to ^7.0.0 or downgrade @vitejs/plugin-legacy to match your vite version'
          );
        }
      }

      console.log('   ✓ Dependency conflict analysis complete');
      
    } catch (error) {
      console.warn('   ⚠️  Could not analyze conflicts:', error.message);
    }
  }

  async checkCodeSecurity() {
    console.log('🛡️  [3/7] Checking Code Security...');
    
    try {
      const securityPatterns = [
        {
          pattern: /eval\(/gi,
          severity: 'critical',
          message: 'Use of eval() detected - major security risk',
          recommendation: 'Replace eval() with safer alternatives'
        },
        {
          pattern: /dangerouslySetInnerHTML/gi,
          severity: 'high',
          message: 'Use of dangerouslySetInnerHTML - XSS risk',
          recommendation: 'Sanitize HTML content before rendering'
        },
        {
          pattern: /localStorage\.setItem\([^,]+,\s*password/gi,
          severity: 'critical',
          message: 'Storing password in localStorage',
          recommendation: 'Never store passwords in localStorage'
        },
        {
          pattern: /console\.log.*password/gi,
          severity: 'high',
          message: 'Logging sensitive data (password)',
          recommendation: 'Remove console.log statements with sensitive data'
        },
        {
          pattern: /(api[_-]?key|secret|token|password)\s*=\s*['"]\w+['"]/gi,
          severity: 'critical',
          message: 'Hardcoded credentials detected',
          recommendation: 'Move credentials to environment variables'
        },
        {
          pattern: /innerHTML\s*=/gi,
          severity: 'medium',
          message: 'Direct innerHTML assignment - potential XSS',
          recommendation: 'Use textContent or sanitize HTML'
        },
        {
          pattern: /document\.write/gi,
          severity: 'medium',
          message: 'Use of document.write',
          recommendation: 'Use modern DOM manipulation methods'
        }
      ];

      const sourceFiles = this.getAllFiles('./src', ['.ts', '.tsx', '.js', '.jsx']);
      let securityIssuesFound = 0;

      for (const file of sourceFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        const relativePath = path.relative('.', file);

        for (const check of securityPatterns) {
          const matches = content.match(check.pattern);
          if (matches) {
            securityIssuesFound++;
            this.addFinding(check.severity, 'security',
              `${check.message} in ${relativePath}`,
              check.recommendation,
              { file: relativePath, matches: matches.length }
            );
          }
        }
      }

      this.metrics.securityIssues = securityIssuesFound;
      console.log(`   ✓ Scanned ${sourceFiles.length} files, found ${securityIssuesFound} security issues`);
      
    } catch (error) {
      console.warn('   ⚠️  Could not check code security:', error.message);
    }
  }

  async analyzeCodeQuality() {
    console.log('📊 [4/7] Analyzing Code Quality...');
    
    try {
      const sourceFiles = this.getAllFiles('./src', ['.ts', '.tsx', '.js', '.jsx']);
      let qualityIssues = 0;

      const qualityChecks = [
        {
          pattern: /console\.(log|debug|info|warn|error)/gi,
          severity: 'low',
          message: 'Console statements found',
          recommendation: 'Remove console statements before production'
        },
        {
          pattern: /debugger/gi,
          severity: 'medium',
          message: 'Debugger statement found',
          recommendation: 'Remove debugger statements'
        },
        {
          pattern: /\/\/ TODO:|\/\/ FIXME:|\/\/ HACK:/gi,
          severity: 'info',
          message: 'TODO/FIXME comments found',
          recommendation: 'Address technical debt'
        },
        {
          pattern: /any\s+\w+\s*:/gi,
          severity: 'medium',
          message: 'Excessive use of "any" type',
          recommendation: 'Use proper TypeScript types'
        },
        {
          pattern: /@ts-ignore|@ts-nocheck/gi,
          severity: 'medium',
          message: 'TypeScript checks disabled',
          recommendation: 'Fix TypeScript errors instead of ignoring them'
        }
      ];

      for (const file of sourceFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        const relativePath = path.relative('.', file);
        const lines = content.split('\n').length;

        // Check file size
        if (lines > 500) {
          qualityIssues++;
          this.addFinding('medium', 'code-quality',
            `Large file: ${relativePath} (${lines} lines)`,
            'Consider splitting into smaller, more maintainable files'
          );
        }

        // Run quality checks
        for (const check of qualityChecks) {
          const matches = content.match(check.pattern);
          if (matches && matches.length > 5) { // Only report if many instances
            qualityIssues++;
            this.addFinding(check.severity, 'code-quality',
              `${check.message} in ${relativePath} (${matches.length} instances)`,
              check.recommendation
            );
          }
        }
      }

      this.metrics.codeQualityIssues = qualityIssues;
      this.metrics.filesAnalyzed = sourceFiles.length;
      console.log(`   ✓ Analyzed ${sourceFiles.length} files, found ${qualityIssues} quality issues`);
      
    } catch (error) {
      console.warn('   ⚠️  Could not analyze code quality:', error.message);
    }
  }

  async validateConfiguration() {
    console.log('⚙️  [5/7] Validating Configuration...');
    
    try {
      let configIssues = 0;

      // Check for essential config files
      const requiredFiles = [
        { file: 'package.json', critical: true },
        { file: 'tsconfig.json', critical: false },
        { file: '.gitignore', critical: true },
        { file: 'vite.config.ts', critical: true },
        { file: 'README.md', critical: false }
      ];

      for (const { file, critical } of requiredFiles) {
        if (!fs.existsSync(file)) {
          configIssues++;
          this.addFinding(critical ? 'high' : 'low', 'configuration',
            `Missing ${file}`,
            `Create ${file} for proper project configuration`
          );
        }
      }

      // Check .gitignore
      if (fs.existsSync('.gitignore')) {
        const gitignore = fs.readFileSync('.gitignore', 'utf-8');
        const requiredIgnores = ['node_modules', '.env', 'dist', 'build', '.DS_Store'];
        
        for (const pattern of requiredIgnores) {
          if (!gitignore.includes(pattern)) {
            configIssues++;
            this.addFinding('medium', 'configuration',
              `.gitignore missing pattern: ${pattern}`,
              `Add ${pattern} to .gitignore`
            );
          }
        }
      }

      // Check package.json scripts
      const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
      const recommendedScripts = ['dev', 'build', 'test', 'lint'];
      
      for (const script of recommendedScripts) {
        if (!packageJson.scripts?.[script] && script !== 'test' && script !== 'lint') {
          // Only warn about test and lint as they're optional
          if (script === 'test' || script === 'lint') {
            this.addFinding('info', 'configuration',
              `Missing recommended script: ${script}`,
              `Add ${script} script to package.json`
            );
          }
        }
      }

      this.metrics.configurationIssues = configIssues;
      console.log(`   ✓ Configuration validated, found ${configIssues} issues`);
      
    } catch (error) {
      console.warn('   ⚠️  Could not validate configuration:', error.message);
    }
  }

  async checkBestPractices() {
    console.log('✨ [6/7] Checking Best Practices...');
    
    try {
      // Check for environment variables handling
      if (fs.existsSync('./src')) {
        const envFiles = this.getAllFiles('./src', ['.ts', '.tsx', '.js', '.jsx'])
          .filter(file => {
            const content = fs.readFileSync(file, 'utf-8');
            return content.includes('process.env') && !file.includes('env.ts') && !file.includes('env.js');
          });

        if (envFiles.length > 5) {
          this.addFinding('medium', 'best-practices',
            `Environment variables accessed directly in ${envFiles.length} files`,
            'Centralize environment variable access in a config file'
          );
        }
      }

      // Check for proper error handling
      const appFiles = this.getAllFiles('./src', ['.tsx', '.ts'])
        .filter(file => file.includes('App.tsx') || file.includes('main.tsx'));
      
      for (const file of appFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        if (!content.includes('ErrorBoundary') && !content.includes('try') && file.includes('App.tsx')) {
          this.addFinding('medium', 'best-practices',
            `No error boundary detected in ${path.relative('.', file)}`,
            'Add error boundary for better error handling'
          );
        }
      }

      // Check for accessibility
      const componentFiles = this.getAllFiles('./src/components', ['.tsx'])
        .filter(file => fs.existsSync(file));
      
      let accessibilityIssues = 0;
      for (const file of componentFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        
        // Check for buttons without aria labels or accessible text
        const buttonMatches = content.match(/<button[^>]*>/gi) || [];
        for (const button of buttonMatches) {
          if (!button.includes('aria-label') && !button.includes('aria-labelledby')) {
            accessibilityIssues++;
          }
        }
      }

      if (accessibilityIssues > 10) {
        this.addFinding('low', 'best-practices',
          `Found ${accessibilityIssues} potential accessibility issues`,
          'Add aria-labels to interactive elements'
        );
      }

      console.log('   ✓ Best practices check complete');
      
    } catch (error) {
      console.warn('   ⚠️  Could not check best practices:', error.message);
    }
  }

  async analyzeFileStructure() {
    console.log('📁 [7/7] Analyzing File Structure...');
    
    try {
      // Check for common structure issues
      const srcExists = fs.existsSync('./src');
      const publicExists = fs.existsSync('./public');
      
      if (!srcExists) {
        this.addFinding('high', 'structure',
          'Missing src directory',
          'Create src directory for source code'
        );
      }

      if (!publicExists) {
        this.addFinding('low', 'structure',
          'Missing public directory',
          'Create public directory for static assets'
        );
      }

      // Check for deeply nested files
      if (srcExists) {
        const allFiles = this.getAllFiles('./src', ['.ts', '.tsx', '.js', '.jsx']);
        for (const file of allFiles) {
          const depth = file.split(path.sep).length;
          if (depth > 8) {
            this.addFinding('low', 'structure',
              `Deeply nested file: ${path.relative('.', file)} (depth: ${depth})`,
              'Consider flattening directory structure'
            );
          }
        }
      }

      console.log('   ✓ File structure analysis complete');
      
    } catch (error) {
      console.warn('   ⚠️  Could not analyze file structure:', error.message);
    }
  }

  addFinding(severity, category, message, recommendation, metadata = {}) {
    const finding = {
      severity,
      category,
      message,
      recommendation,
      ...metadata
    };

    this.findings[severity].push(finding);
    this.metrics.totalIssues++;
  }

  generateReport() {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                     AUDIT REPORT                           ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log();

    // Summary
    console.log('📊 SUMMARY:');
    console.log(`   Files Analyzed: ${this.metrics.filesAnalyzed}`);
    console.log(`   Total Issues: ${this.metrics.totalIssues}`);
    console.log(`   - Critical: ${this.findings.critical.length}`);
    console.log(`   - High: ${this.findings.high.length}`);
    console.log(`   - Medium: ${this.findings.medium.length}`);
    console.log(`   - Low: ${this.findings.low.length}`);
    console.log(`   - Info: ${this.findings.info.length}`);
    console.log();

    // Critical Issues
    if (this.findings.critical.length > 0) {
      console.log('🚨 CRITICAL ISSUES:');
      this.findings.critical.forEach((finding, i) => {
        console.log(`   ${i + 1}. ${finding.message}`);
        console.log(`      → ${finding.recommendation}`);
      });
      console.log();
    }

    // High Priority Issues
    if (this.findings.high.length > 0) {
      console.log('⚠️  HIGH PRIORITY ISSUES:');
      this.findings.high.slice(0, 5).forEach((finding, i) => {
        console.log(`   ${i + 1}. ${finding.message}`);
        console.log(`      → ${finding.recommendation}`);
      });
      if (this.findings.high.length > 5) {
        console.log(`   ... and ${this.findings.high.length - 5} more`);
      }
      console.log();
    }

    // Medium Priority Issues
    if (this.findings.medium.length > 0) {
      console.log('⚡ MEDIUM PRIORITY ISSUES:');
      this.findings.medium.slice(0, 3).forEach((finding, i) => {
        console.log(`   ${i + 1}. ${finding.message}`);
        console.log(`      → ${finding.recommendation}`);
      });
      if (this.findings.medium.length > 3) {
        console.log(`   ... and ${this.findings.medium.length - 3} more`);
      }
      console.log();
    }

    // Calculate score
    const score = this.calculateScore();
    console.log('═'.repeat(60));
    console.log(`🎯 AUDIT SCORE: ${score}/100`);
    
    if (score >= 90) {
      console.log('✅ Excellent! Your codebase is in great shape.');
    } else if (score >= 70) {
      console.log('👍 Good! Address high priority issues for improvement.');
    } else if (score >= 50) {
      console.log('⚠️  Fair. Several issues need attention.');
    } else {
      console.log('🚨 Poor. Immediate action required for critical issues.');
    }
    console.log('═'.repeat(60));
  }

  calculateScore() {
    let score = 100;
    
    score -= this.findings.critical.length * 20;
    score -= this.findings.high.length * 10;
    score -= this.findings.medium.length * 5;
    score -= this.findings.low.length * 2;
    score -= this.findings.info.length * 1;
    
    return Math.max(0, score);
  }

  saveReport() {
    const report = {
      timestamp: new Date().toISOString(),
      score: this.calculateScore(),
      metrics: this.metrics,
      findings: this.findings,
      summary: {
        critical: this.findings.critical.length,
        high: this.findings.high.length,
        medium: this.findings.medium.length,
        low: this.findings.low.length,
        info: this.findings.info.length,
        total: this.metrics.totalIssues
      }
    };

    const reportPath = './audit-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Detailed report saved: ${reportPath}`);
    
    // Also create a markdown report
    this.saveMarkdownReport(report);
  }

  saveMarkdownReport(report) {
    let markdown = '# Codebase Audit Report\n\n';
    markdown += `**Date:** ${new Date().toLocaleString()}\n\n`;
    markdown += `**Score:** ${report.score}/100\n\n`;
    
    markdown += '## Summary\n\n';
    markdown += `- Files Analyzed: ${this.metrics.filesAnalyzed}\n`;
    markdown += `- Total Issues: ${this.metrics.totalIssues}\n`;
    markdown += `- Critical: ${this.findings.critical.length}\n`;
    markdown += `- High: ${this.findings.high.length}\n`;
    markdown += `- Medium: ${this.findings.medium.length}\n`;
    markdown += `- Low: ${this.findings.low.length}\n`;
    markdown += `- Info: ${this.findings.info.length}\n\n`;

    if (this.findings.critical.length > 0) {
      markdown += '## 🚨 Critical Issues\n\n';
      this.findings.critical.forEach((finding, i) => {
        markdown += `${i + 1}. **${finding.message}**\n`;
        markdown += `   - Recommendation: ${finding.recommendation}\n\n`;
      });
    }

    if (this.findings.high.length > 0) {
      markdown += '## ⚠️ High Priority Issues\n\n';
      this.findings.high.forEach((finding, i) => {
        markdown += `${i + 1}. **${finding.message}**\n`;
        markdown += `   - Recommendation: ${finding.recommendation}\n\n`;
      });
    }

    if (this.findings.medium.length > 0) {
      markdown += '## ⚡ Medium Priority Issues\n\n';
      this.findings.medium.forEach((finding, i) => {
        markdown += `${i + 1}. ${finding.message}\n`;
        markdown += `   - Recommendation: ${finding.recommendation}\n\n`;
      });
    }

    markdown += '## Next Steps\n\n';
    markdown += '1. Address all critical issues immediately\n';
    markdown += '2. Plan to resolve high priority issues\n';
    markdown += '3. Schedule medium priority issues for future sprints\n';
    markdown += '4. Review low priority and info items as time permits\n';

    fs.writeFileSync('./AUDIT_REPORT.md', markdown);
    console.log('📄 Markdown report saved: AUDIT_REPORT.md');
  }

  getExitCode() {
    // Exit with error code if critical issues found
    if (this.findings.critical.length > 0) {
      return 1;
    }
    return 0;
  }

  getAllFiles(dir, extensions = []) {
    let files = [];
    
    if (!fs.existsSync(dir)) {
      return files;
    }
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      
      try {
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'dist' && item !== 'build') {
          files = files.concat(this.getAllFiles(itemPath, extensions));
        } else if (stats.isFile()) {
          if (extensions.length === 0 || extensions.some(ext => item.endsWith(ext))) {
            files.push(itemPath);
          }
        }
      } catch (error) {
        // Skip files we can't access
        continue;
      }
    }
    
    return files;
  }
}

// CLI interface
async function main() {
  const auditor = new CodebaseAuditor();
  const exitCode = await auditor.runAudit();
  process.exit(exitCode);
}

if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = CodebaseAuditor;
