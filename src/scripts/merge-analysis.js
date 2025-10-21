#!/usr/bin/env node

/**
 * FlashFusion Merge Analysis Tool
 * Analyzes another project for integration compatibility
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ANALYSIS_OUTPUT = './integration/analysis-report.json';

class MergeAnalyzer {
  constructor(otherProjectPath) {
    this.otherProjectPath = otherProjectPath;
    this.analysis = {
      structure: {},
      dependencies: {},
      components: [],
      services: [],
      conflicts: [],
      opportunities: []
    };
  }

  async analyze() {
    console.log('🔍 Starting merge analysis...');
    
    try {
      this.analyzeStructure();
      this.analyzeDependencies();
      this.analyzeComponents();
      this.analyzeServices();
      this.detectConflicts();
      this.identifyOpportunities();
      
      this.saveAnalysis();
      this.generateReport();
      
      console.log('✅ Analysis complete! Check integration/analysis-report.json');
    } catch (error) {
      console.error('❌ Analysis failed:', error.message);
    }
  }

  analyzeStructure() {
    console.log('📁 Analyzing project structure...');
    
    const structure = this.getDirectoryStructure(this.otherProjectPath);
    this.analysis.structure = structure;
    
    // Check for common patterns
    const hasComponents = fs.existsSync(path.join(this.otherProjectPath, 'components'));
    const hasServices = fs.existsSync(path.join(this.otherProjectPath, 'services'));
    const hasUtils = fs.existsSync(path.join(this.otherProjectPath, 'utils'));
    
    this.analysis.structure.patterns = {
      hasComponents,
      hasServices,
      hasUtils,
      framework: this.detectFramework()
    };
  }

  analyzeDependencies() {
    console.log('📦 Analyzing dependencies...');
    
    const packageJsonPath = path.join(this.otherProjectPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      this.analysis.dependencies = {
        dependencies: packageJson.dependencies || {},
        devDependencies: packageJson.devDependencies || {},
        scripts: packageJson.scripts || {}
      };
      
      // Compare with FlashFusion dependencies
      this.compareDependencies();
    }
  }

  analyzeComponents() {
    console.log('🧩 Analyzing components...');
    
    const componentsPath = path.join(this.otherProjectPath, 'components');
    if (fs.existsSync(componentsPath)) {
      this.analysis.components = this.findFiles(componentsPath, /\.(tsx|jsx|ts|js)$/);
    }
  }

  analyzeServices() {
    console.log('🔧 Analyzing services...');
    
    const servicesPath = path.join(this.otherProjectPath, 'services');
    if (fs.existsSync(servicesPath)) {
      this.analysis.services = this.findFiles(servicesPath, /\.(ts|js)$/);
    }
  }

  detectConflicts() {
    console.log('⚠️  Detecting potential conflicts...');
    
    // Check for file name conflicts
    const flashfusionFiles = this.getFlashFusionFiles();
    const otherProjectFiles = this.getOtherProjectFiles();
    
    const conflicts = flashfusionFiles.filter(file => 
      otherProjectFiles.includes(file)
    );
    
    this.analysis.conflicts = conflicts.map(file => ({
      type: 'filename',
      file,
      resolution: 'rename_or_merge'
    }));
  }

  identifyOpportunities() {
    console.log('✨ Identifying integration opportunities...');
    
    const opportunities = [];
    
    // Check for complementary features
    if (this.analysis.components.some(c => c.includes('auth'))) {
      opportunities.push({
        type: 'auth_enhancement',
        description: 'Potential authentication system enhancement',
        files: this.analysis.components.filter(c => c.includes('auth'))
      });
    }
    
    if (this.analysis.services.some(s => s.includes('api'))) {
      opportunities.push({
        type: 'api_enhancement',
        description: 'Potential API service enhancement',
        files: this.analysis.services.filter(s => s.includes('api'))
      });
    }
    
    this.analysis.opportunities = opportunities;
  }

  getDirectoryStructure(dirPath, level = 0, maxLevel = 3) {
    if (level > maxLevel) return {};
    
    const structure = {};
    
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        if (item.startsWith('.') || item === 'node_modules') continue;
        
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          structure[item] = this.getDirectoryStructure(itemPath, level + 1, maxLevel);
        } else {
          structure[item] = 'file';
        }
      }
    } catch (error) {
      // Directory not accessible
    }
    
    return structure;
  }

  detectFramework() {
    const packageJsonPath = path.join(this.otherProjectPath, 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      if (deps.react) return 'react';
      if (deps.vue) return 'vue';
      if (deps.angular) return 'angular';
      if (deps.svelte) return 'svelte';
    }
    
    return 'unknown';
  }

  findFiles(dirPath, pattern) {
    const files = [];
    
    const walk = (currentPath) => {
      try {
        const items = fs.readdirSync(currentPath);
        
        for (const item of items) {
          const itemPath = path.join(currentPath, item);
          const stat = fs.statSync(itemPath);
          
          if (stat.isDirectory() && !item.startsWith('.')) {
            walk(itemPath);
          } else if (pattern.test(item)) {
            files.push(path.relative(this.otherProjectPath, itemPath));
          }
        }
      } catch (error) {
        // Directory not accessible
      }
    };
    
    walk(dirPath);
    return files;
  }

  compareDependencies() {
    const flashfusionPackageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const flashfusionDeps = flashfusionPackageJson.dependencies || {};
    const otherDeps = this.analysis.dependencies.dependencies;
    
    const conflicts = [];
    const additions = [];
    
    for (const [pkg, version] of Object.entries(otherDeps)) {
      if (flashfusionDeps[pkg]) {
        if (flashfusionDeps[pkg] !== version) {
          conflicts.push({ package: pkg, flashfusion: flashfusionDeps[pkg], other: version });
        }
      } else {
        additions.push({ package: pkg, version });
      }
    }
    
    this.analysis.dependencies.conflicts = conflicts;
    this.analysis.dependencies.additions = additions;
  }

  getFlashFusionFiles() {
    return this.findFiles('./components', /\.(tsx|jsx|ts|js)$/);
  }

  getOtherProjectFiles() {
    const componentsPath = path.join(this.otherProjectPath, 'components');
    if (fs.existsSync(componentsPath)) {
      return this.findFiles(componentsPath, /\.(tsx|jsx|ts|js)$/);
    }
    return [];
  }

  saveAnalysis() {
    const outputDir = path.dirname(ANALYSIS_OUTPUT);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(ANALYSIS_OUTPUT, JSON.stringify(this.analysis, null, 2));
  }

  generateReport() {
    console.log('\n📊 MERGE ANALYSIS REPORT');
    console.log('========================');
    
    console.log(`\n📁 Project Structure:`);
    console.log(`   Framework: ${this.analysis.structure.patterns?.framework || 'unknown'}`);
    console.log(`   Components: ${this.analysis.components.length} files`);
    console.log(`   Services: ${this.analysis.services.length} files`);
    
    console.log(`\n📦 Dependencies:`);
    console.log(`   New packages: ${this.analysis.dependencies.additions?.length || 0}`);
    console.log(`   Conflicts: ${this.analysis.dependencies.conflicts?.length || 0}`);
    
    console.log(`\n⚠️  Potential Conflicts:`);
    console.log(`   File conflicts: ${this.analysis.conflicts.length}`);
    
    console.log(`\n✨ Integration Opportunities:`);
    console.log(`   Identified: ${this.analysis.opportunities.length}`);
    
    if (this.analysis.opportunities.length > 0) {
      this.analysis.opportunities.forEach(opp => {
        console.log(`   - ${opp.description}`);
      });
    }
    
    console.log(`\n📄 Full report saved to: ${ANALYSIS_OUTPUT}`);
  }
}

// CLI usage
if (process.argv.length < 3) {
  console.log('Usage: node merge-analysis.js <path-to-other-project>');
  process.exit(1);
}

const otherProjectPath = process.argv[2];

if (!fs.existsSync(otherProjectPath)) {
  console.error(`❌ Path does not exist: ${otherProjectPath}`);
  process.exit(1);
}

const analyzer = new MergeAnalyzer(otherProjectPath);
analyzer.analyze();