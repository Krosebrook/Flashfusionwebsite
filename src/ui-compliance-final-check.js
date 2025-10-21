#!/usr/bin/env node

/**
 * FlashFusion Final UI Compliance Check
 * 
 * This script performs a comprehensive analysis of your FlashFusion platform
 * to identify and fix remaining UI compliance issues before launch.
 */

const fs = require('fs');
const path = require('path');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m'
};

// Enhanced patterns for FlashFusion compliance
const compliancePatterns = {
  typography: {
    // Check for non-FlashFusion text classes
    issues: [
      {
        pattern: /className="[^"]*\btext-(xs|sm|base|lg|xl|2xl|3xl)\b[^"]*"/g,
        message: 'Use FlashFusion typography classes (ff-text-*)',
        severity: 'high',
        fix: (match) => match.replace(/text-(xs|sm|base|lg|xl|2xl|3xl)/g, 'ff-text-$1')
      },
      {
        pattern: /className="[^"]*\bfont-(thin|light|normal|medium|semibold|bold|extrabold|black)\b[^"]*"/g,
        message: 'Use consistent font weights with font families',
        severity: 'medium',
        fix: (match) => match.includes('font-sora') ? match : match.replace(/font-(semibold|bold)/, 'font-$1 font-sora')
      }
    ]
  },
  fonts: {
    issues: [
      {
        pattern: /<h[1-6][^>]*className="([^"]*)"[^>]*>/g,
        message: 'Headings should use font-sora',
        severity: 'high',
        fix: (match) => {
          if (!match.includes('font-sora')) {
            return match.replace(/className="([^"]*)"/, 'className="$1 font-sora"');
          }
          return match;
        }
      },
      {
        pattern: /<(label|button)[^>]*className="([^"]*)"[^>]*>/g,
        message: 'Labels and buttons should use font-sora',
        severity: 'medium',
        fix: (match) => {
          if (!match.includes('font-sora')) {
            return match.replace(/className="([^"]*)"/, 'className="$1 font-sora"');
          }
          return match;
        }
      }
    ]
  },
  interactivity: {
    issues: [
      {
        pattern: /<(input|textarea|select|button)[^>]*className="([^"]*)"[^>]*>/g,
        message: 'Interactive elements should have ff-focus-ring',
        severity: 'medium',
        fix: (match) => {
          if (!match.includes('ff-focus-ring')) {
            return match.replace(/className="([^"]*)"/, 'className="$1 ff-focus-ring"');
          }
          return match;
        }
      },
      {
        pattern: /<Card[^>]*className="([^"]*)"[^>]*>/g,
        message: 'Cards should be interactive with ff-card-interactive',
        severity: 'low',
        fix: (match) => {
          if (!match.includes('ff-card-interactive') && !match.includes('non-interactive')) {
            return match.replace(/className="([^"]*)"/, 'className="$1 ff-card-interactive"');
          }
          return match;
        }
      }
    ]
  },
  buttons: {
    issues: [
      {
        pattern: /className="[^"]*\bbg-(blue|red|green|purple|gray|slate)-\d+\b[^"]*"/g,
        message: 'Use FlashFusion button classes instead of generic colors',
        severity: 'high',
        fix: (match) => match.replace(/bg-(blue|red|green|purple)-\d+/, 'ff-btn-primary')
      }
    ]
  }
};

// File scan configuration
const scanConfig = {
  includeExtensions: ['.tsx', '.ts'],
  excludePaths: [
    'node_modules',
    '.git',
    'dist',
    'build',
    '.next',
    'coverage'
  ],
  priorityDirs: [
    'components/ui',
    'components/layout', 
    'components/pages',
    'App.tsx'
  ]
};

class UIComplianceAnalyzer {
  constructor() {
    this.results = {
      totalFiles: 0,
      issuesFound: 0,
      issuesFixed: 0,
      fileResults: new Map(),
      summary: {
        high: 0,
        medium: 0,
        low: 0
      }
    };
  }

  async analyzeProject() {
    console.log(`${colors.bold}${colors.cyan}🎨 FlashFusion Final UI Compliance Check${colors.reset}\n`);
    
    const startTime = Date.now();
    
    // Scan all relevant files
    const files = this.getAllFiles(process.cwd());
    console.log(`Found ${files.length} files to analyze...\n`);
    
    for (const file of files) {
      await this.analyzeFile(file);
    }
    
    const endTime = Date.now();
    this.generateReport(endTime - startTime);
  }

  getAllFiles(dir, files = []) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!scanConfig.excludePaths.some(exclude => fullPath.includes(exclude))) {
          this.getAllFiles(fullPath, files);
        }
      } else if (scanConfig.includeExtensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  async analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(process.cwd(), filePath);
      
      this.results.totalFiles++;
      
      const fileIssues = [];
      
      // Check each compliance pattern
      Object.entries(compliancePatterns).forEach(([category, config]) => {
        config.issues.forEach(issue => {
          const matches = [...content.matchAll(issue.pattern)];
          
          if (matches.length > 0) {
            fileIssues.push({
              category,
              ...issue,
              matches: matches.slice(0, 5), // Limit examples
              count: matches.length
            });
            
            this.results.issuesFound += matches.length;
            this.results.summary[issue.severity] += matches.length;
          }
        });
      });
      
      if (fileIssues.length > 0) {
        this.results.fileResults.set(relativePath, {
          issues: fileIssues,
          priority: this.calculateFilePriority(relativePath),
          content
        });
      }
      
    } catch (error) {
      console.warn(`${colors.yellow}Warning: Could not analyze ${filePath}${colors.reset}`);
    }
  }

  calculateFilePriority(filePath) {
    if (filePath.includes('components/ui/')) return 'critical';
    if (filePath.includes('components/layout/')) return 'high';
    if (filePath.includes('components/pages/')) return 'medium';
    if (filePath === 'App.tsx') return 'critical';
    return 'low';
  }

  generateReport(analysisTime) {
    console.log(`${colors.bold}📊 Analysis Complete${colors.reset}`);
    console.log(`Analysis time: ${analysisTime}ms`);
    console.log(`Files analyzed: ${this.results.totalFiles}`);
    console.log(`Issues found: ${this.results.issuesFound}\n`);

    if (this.results.issuesFound === 0) {
      console.log(`${colors.green}${colors.bold}✅ Your FlashFusion platform is fully compliant!${colors.reset}`);
      console.log(`${colors.green}Ready for production launch! 🚀${colors.reset}\n`);
      return;
    }

    // Summary by severity
    console.log(`${colors.bold}🎯 Issues by Priority:${colors.reset}`);
    console.log(`${colors.red}Critical/High: ${this.results.summary.high}${colors.reset}`);
    console.log(`${colors.yellow}Medium: ${this.results.summary.medium}${colors.reset}`);
    console.log(`${colors.blue}Low: ${this.results.summary.low}${colors.reset}\n`);

    // Top priority files
    const sortedFiles = Array.from(this.results.fileResults.entries())
      .sort(([, a], [, b]) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        
        return b.issues.reduce((sum, issue) => sum + issue.count, 0) - 
               a.issues.reduce((sum, issue) => sum + issue.count, 0);
      });

    console.log(`${colors.bold}🔧 Top Priority Fixes:${colors.reset}\n`);

    sortedFiles.slice(0, 10).forEach(([filePath, result], index) => {
      const totalIssues = result.issues.reduce((sum, issue) => sum + issue.count, 0);
      const priorityColor = {
        critical: colors.red,
        high: colors.yellow,
        medium: colors.blue,
        low: colors.green
      }[result.priority];

      console.log(`${index + 1}. ${priorityColor}${filePath}${colors.reset} (${totalIssues} issues, ${result.priority} priority)`);
      
      result.issues.forEach(issue => {
        console.log(`   ${colors.dim}├─ ${issue.category}: ${issue.message}${colors.reset}`);
        console.log(`   ${colors.dim}│  Count: ${issue.count}, Severity: ${issue.severity}${colors.reset}`);
        if (issue.matches.length > 0) {
          const example = issue.matches[0][0].substring(0, 60) + '...';
          console.log(`   ${colors.dim}│  Example: ${example}${colors.reset}`);
        }
        console.log(`   ${colors.dim}└─ Fix: ${this.generateFixSuggestion(issue)}${colors.reset}`);
      });
      console.log('');
    });

    // Quick fix commands
    console.log(`${colors.bold}⚡ Quick Fix Commands:${colors.reset}`);
    console.log(`${colors.cyan}# Fix typography issues${colors.reset}`);
    console.log(`npm run ui:fix-typography`);
    console.log(`${colors.cyan}# Validate all fixes${colors.reset}`);
    console.log(`npm run ui:validate\n`);

    // Next steps
    console.log(`${colors.bold}📋 Recommended Action Plan:${colors.reset}`);
    console.log(`${colors.yellow}1. Fix CRITICAL priority files first${colors.reset}`);
    console.log(`${colors.yellow}2. Update typography classes (highest impact)${colors.reset}`);
    console.log(`${colors.yellow}3. Add font families to headings and labels${colors.reset}`);
    console.log(`${colors.yellow}4. Implement interactive states${colors.reset}`);
    console.log(`${colors.yellow}5. Test on mobile devices${colors.reset}\n`);

    // Compliance score
    const totalPossibleIssues = this.results.totalFiles * 10; // Rough estimate
    const complianceScore = Math.max(0, Math.round((1 - this.results.issuesFound / totalPossibleIssues) * 100));
    
    console.log(`${colors.bold}🎯 Current Compliance Score: ${complianceScore}%${colors.reset}`);
    if (complianceScore >= 95) {
      console.log(`${colors.green}Excellent! Ready for launch! 🚀${colors.reset}`);
    } else if (complianceScore >= 85) {
      console.log(`${colors.yellow}Good! A few quick fixes and you're ready! ⚡${colors.reset}`);
    } else {
      console.log(`${colors.red}Needs attention. Follow the action plan above. 🔧${colors.reset}`);
    }
  }

  generateFixSuggestion(issue) {
    const suggestions = {
      'Use FlashFusion typography classes (ff-text-*)': 'Replace text-* with ff-text-*',
      'Headings should use font-sora': 'Add font-sora class to heading',
      'Interactive elements should have ff-focus-ring': 'Add ff-focus-ring class',
      'Cards should be interactive with ff-card-interactive': 'Add ff-card-interactive class',
      'Use FlashFusion button classes instead of generic colors': 'Replace with ff-btn-primary/secondary/accent'
    };
    
    return suggestions[issue.message] || 'Apply FlashFusion design system classes';
  }
}

// Run the analyzer
if (require.main === module) {
  const analyzer = new UIComplianceAnalyzer();
  analyzer.analyzeProject().catch(error => {
    console.error(`${colors.red}Error during analysis: ${error.message}${colors.reset}`);
    process.exit(1);
  });
}

module.exports = UIComplianceAnalyzer;