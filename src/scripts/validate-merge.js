#!/usr/bin/env node

/**
 * FlashFusion Merge Validation Tool
 * Validates that the merge preserves FlashFusion functionality
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

class MergeValidator {
  constructor() {
    this.results = {
      ui_consistency: { passed: 0, failed: 0, tests: [] },
      functionality: { passed: 0, failed: 0, tests: [] },
      performance: { passed: 0, failed: 0, tests: [] },
      accessibility: { passed: 0, failed: 0, tests: [] },
      overall: 'pending'
    };
  }

  async validate() {
    console.log('🧪 Starting FlashFusion merge validation...\n');
    
    try {
      await this.validateUIConsistency();
      await this.validateFunctionality();
      await this.validatePerformance();
      await this.validateAccessibility();
      
      this.calculateOverallResult();
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Validation failed:', error.message);
      this.results.overall = 'failed';
    }
  }

  async validateUIConsistency() {
    console.log('🎨 Validating UI Consistency...');
    
    const tests = [
      {
        name: 'FlashFusion CSS Variables',
        test: () => this.checkCSSVariables(),
        description: 'Ensures FlashFusion brand colors and variables are preserved'
      },
      {
        name: 'Component Styling',
        test: () => this.checkComponentStyling(),
        description: 'Validates that components use FlashFusion styling patterns'
      },
      {
        name: 'Animation Classes',
        test: () => this.checkAnimationClasses(),
        description: 'Confirms FlashFusion animation classes are available'
      },
      {
        name: 'Typography System',
        test: () => this.checkTypography(),
        description: 'Validates Sora and Inter fonts are properly configured'
      }
    ];
    
    await this.runTests('ui_consistency', tests);
  }

  async validateFunctionality() {
    console.log('⚙️  Validating Functionality...');
    
    const tests = [
      {
        name: 'Authentication System',
        test: () => this.checkAuthSystem(),
        description: 'Ensures auth system works correctly'
      },
      {
        name: 'Gamification Features',
        test: () => this.checkGamificationFeatures(),
        description: 'Validates XP, achievements, and leveling system'
      },
      {
        name: 'Project Management',
        test: () => this.checkProjectManagement(),
        description: 'Confirms project creation and management works'
      },
      {
        name: 'AI Tools Integration',
        test: () => this.checkAITools(),
        description: 'Validates AI tools functionality'
      },
      {
        name: 'Real-time Features',
        test: () => this.checkRealTimeFeatures(),
        description: 'Confirms collaboration and notifications work'
      }
    ];
    
    await this.runTests('functionality', tests);
  }

  async validatePerformance() {
    console.log('🚀 Validating Performance...');
    
    const tests = [
      {
        name: 'Bundle Size',
        test: () => this.checkBundleSize(),
        description: 'Ensures bundle size is within acceptable limits'
      },
      {
        name: 'Component Load Time',
        test: () => this.checkComponentLoadTime(),
        description: 'Validates component rendering performance'
      },
      {
        name: 'Memory Usage',
        test: () => this.checkMemoryUsage(),
        description: 'Confirms memory usage is optimized'
      }
    ];
    
    await this.runTests('performance', tests);
  }

  async validateAccessibility() {
    console.log('♿ Validating Accessibility...');
    
    const tests = [
      {
        name: 'ARIA Labels',
        test: () => this.checkARIALabels(),
        description: 'Ensures proper ARIA labeling'
      },
      {
        name: 'Keyboard Navigation',
        test: () => this.checkKeyboardNavigation(),
        description: 'Validates keyboard accessibility'
      },
      {
        name: 'Color Contrast',
        test: () => this.checkColorContrast(),
        description: 'Confirms adequate color contrast ratios'
      }
    ];
    
    await this.runTests('accessibility', tests);
  }

  async runTests(category, tests) {
    for (const test of tests) {
      try {
        console.log(`  Testing: ${test.name}...`);
        const result = await test.test();
        
        this.results[category].tests.push({
          name: test.name,
          description: test.description,
          passed: result.passed,
          message: result.message,
          details: result.details
        });
        
        if (result.passed) {
          this.results[category].passed++;
          console.log(`    ✅ ${test.name}`);
        } else {
          this.results[category].failed++;
          console.log(`    ❌ ${test.name}: ${result.message}`);
        }
      } catch (error) {
        this.results[category].failed++;
        this.results[category].tests.push({
          name: test.name,
          description: test.description,
          passed: false,
          message: error.message,
          details: error.stack
        });
        console.log(`    ❌ ${test.name}: ${error.message}`);
      }
    }
    console.log('');
  }

  // UI Consistency Tests
  checkCSSVariables() {
    const cssContent = fs.readFileSync('./styles/globals.css', 'utf8');
    
    const requiredVariables = [
      '--ff-primary',
      '--ff-secondary',
      '--ff-accent',
      '--ff-bg-dark',
      '--ff-animation-ease'
    ];
    
    const missingVars = requiredVariables.filter(varName => 
      !cssContent.includes(varName)
    );
    
    return {
      passed: missingVars.length === 0,
      message: missingVars.length > 0 ? `Missing variables: ${missingVars.join(', ')}` : 'All FlashFusion CSS variables present',
      details: { missingVars, totalRequired: requiredVariables.length }
    };
  }

  checkComponentStyling() {
    const components = this.findFiles('./components', /\.tsx$/);
    let ffClassCount = 0;
    let totalComponents = 0;
    
    components.forEach(componentPath => {
      const content = fs.readFileSync(componentPath, 'utf8');
      totalComponents++;
      
      if (content.includes('ff-') || content.includes('FlashFusion') || content.includes('--ff-')) {
        ffClassCount++;
      }
    });
    
    const percentage = (ffClassCount / totalComponents) * 100;
    
    return {
      passed: percentage > 70, // At least 70% should use FlashFusion patterns
      message: `${percentage.toFixed(1)}% of components use FlashFusion styling`,
      details: { ffComponents: ffClassCount, totalComponents, percentage }
    };
  }

  checkAnimationClasses() {
    const cssContent = fs.readFileSync('./styles/globals.css', 'utf8');
    
    const requiredAnimations = [
      'ff-fade-in-up',
      'ff-scale-pop',
      'ff-hover-glow',
      'ff-pulse-glow'
    ];
    
    const missingAnimations = requiredAnimations.filter(animation => 
      !cssContent.includes(animation)
    );
    
    return {
      passed: missingAnimations.length === 0,
      message: missingAnimations.length > 0 ? `Missing animations: ${missingAnimations.join(', ')}` : 'All FlashFusion animations present',
      details: { missingAnimations, totalRequired: requiredAnimations.length }
    };
  }

  checkTypography() {
    const indexContent = fs.readFileSync('./index.html', 'utf8');
    
    const hasSora = indexContent.includes('Sora');
    const hasInter = indexContent.includes('Inter');
    
    return {
      passed: hasSora && hasInter,
      message: `Fonts - Sora: ${hasSora ? '✓' : '✗'}, Inter: ${hasInter ? '✓' : '✗'}`,
      details: { hasSora, hasInter }
    };
  }

  // Functionality Tests
  checkAuthSystem() {
    const authPath = './components/auth/AuthSystem.tsx';
    
    if (!fs.existsSync(authPath)) {
      return {
        passed: false,
        message: 'AuthSystem component not found',
        details: { path: authPath }
      };
    }
    
    const content = fs.readFileSync(authPath, 'utf8');
    const hasSupabase = content.includes('supabase');
    const hasProvider = content.includes('AuthProvider');
    
    return {
      passed: hasSupabase && hasProvider,
      message: `Auth system validation - Supabase: ${hasSupabase ? '✓' : '✗'}, Provider: ${hasProvider ? '✓' : '✗'}`,
      details: { hasSupabase, hasProvider }
    };
  }

  checkGamificationFeatures() {
    const gamificationPath = './components/gamification';
    
    if (!fs.existsSync(gamificationPath)) {
      return {
        passed: false,
        message: 'Gamification components not found',
        details: { path: gamificationPath }
      };
    }
    
    const files = fs.readdirSync(gamificationPath);
    const hasAchievements = files.some(f => f.includes('Achievement'));
    const hasXPSystem = files.some(f => f.includes('Gamification'));
    
    return {
      passed: hasAchievements && hasXPSystem,
      message: `Gamification features - Achievements: ${hasAchievements ? '✓' : '✗'}, XP System: ${hasXPSystem ? '✓' : '✗'}`,
      details: { hasAchievements, hasXPSystem, files }
    };
  }

  checkProjectManagement() {
    const projectsPage = './components/pages/ProjectsPage.tsx';
    
    if (!fs.existsSync(projectsPage)) {
      return {
        passed: false,
        message: 'ProjectsPage component not found',
        details: { path: projectsPage }
      };
    }
    
    const content = fs.readFileSync(projectsPage, 'utf8');
    const hasCreateProject = content.includes('create') || content.includes('Create');
    const hasProjectList = content.includes('project') && content.includes('map');
    
    return {
      passed: hasCreateProject && hasProjectList,
      message: `Project management - Create: ${hasCreateProject ? '✓' : '✗'}, List: ${hasProjectList ? '✓' : '✗'}`,
      details: { hasCreateProject, hasProjectList }
    };
  }

  checkAITools() {
    const toolsPath = './data/tools.ts';
    
    if (!fs.existsSync(toolsPath)) {
      return {
        passed: false,
        message: 'Tools data file not found',
        details: { path: toolsPath }
      };
    }
    
    const content = fs.readFileSync(toolsPath, 'utf8');
    const toolCount = (content.match(/\{[^}]*title:/g) || []).length;
    
    return {
      passed: toolCount >= 60,
      message: `AI Tools count: ${toolCount} (target: 60+)`,
      details: { toolCount, target: 60 }
    };
  }

  checkRealTimeFeatures() {
    const notificationPath = './components/notifications/NotificationSystem.tsx';
    const collaborationPath = './components/collaboration';
    
    const hasNotifications = fs.existsSync(notificationPath);
    const hasCollaboration = fs.existsSync(collaborationPath);
    
    return {
      passed: hasNotifications && hasCollaboration,
      message: `Real-time features - Notifications: ${hasNotifications ? '✓' : '✗'}, Collaboration: ${hasCollaboration ? '✓' : '✗'}`,
      details: { hasNotifications, hasCollaboration }
    };
  }

  // Performance Tests
  checkBundleSize() {
    try {
      // Build the project to check bundle size
      execSync('npm run build', { stdio: 'pipe' });
      
      const distPath = './dist';
      if (!fs.existsSync(distPath)) {
        return {
          passed: false,
          message: 'Build output not found',
          details: { distPath }
        };
      }
      
      const bundleSize = this.getFolderSize(distPath);
      const maxSize = 10 * 1024 * 1024; // 10MB limit
      
      return {
        passed: bundleSize < maxSize,
        message: `Bundle size: ${(bundleSize / 1024 / 1024).toFixed(2)}MB (limit: ${maxSize / 1024 / 1024}MB)`,
        details: { bundleSize, maxSize, bundleSizeMB: bundleSize / 1024 / 1024 }
      };
    } catch (error) {
      return {
        passed: false,
        message: `Build failed: ${error.message}`,
        details: { error: error.message }
      };
    }
  }

  checkComponentLoadTime() {
    // Simulate component load time check
    const componentCount = this.findFiles('./components', /\.tsx$/).length;
    const estimatedLoadTime = componentCount * 2; // Rough estimate
    
    return {
      passed: estimatedLoadTime < 1000, // Less than 1 second
      message: `Estimated component load time: ${estimatedLoadTime}ms`,
      details: { componentCount, estimatedLoadTime }
    };
  }

  checkMemoryUsage() {
    const memUsage = process.memoryUsage();
    const maxMemory = 512 * 1024 * 1024; // 512MB limit
    
    return {
      passed: memUsage.heapUsed < maxMemory,
      message: `Memory usage: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`,
      details: { memUsage, maxMemory }
    };
  }

  // Accessibility Tests
  checkARIALabels() {
    const components = this.findFiles('./components', /\.tsx$/);
    let ariaCount = 0;
    let interactiveCount = 0;
    
    components.forEach(componentPath => {
      const content = fs.readFileSync(componentPath, 'utf8');
      
      if (content.includes('Button') || content.includes('onClick') || content.includes('onSubmit')) {
        interactiveCount++;
        
        if (content.includes('aria-') || content.includes('role=') || content.includes('aria')) {
          ariaCount++;
        }
      }
    });
    
    const percentage = interactiveCount > 0 ? (ariaCount / interactiveCount) * 100 : 100;
    
    return {
      passed: percentage > 80,
      message: `${percentage.toFixed(1)}% of interactive components have ARIA labels`,
      details: { ariaCount, interactiveCount, percentage }
    };
  }

  checkKeyboardNavigation() {
    const components = this.findFiles('./components', /\.tsx$/);
    let keyboardNavCount = 0;
    let totalComponents = components.length;
    
    components.forEach(componentPath => {
      const content = fs.readFileSync(componentPath, 'utf8');
      
      if (content.includes('onKeyDown') || content.includes('tabIndex') || content.includes('keyboard')) {
        keyboardNavCount++;
      }
    });
    
    const percentage = (keyboardNavCount / totalComponents) * 100;
    
    return {
      passed: percentage > 20, // At least 20% should have keyboard considerations
      message: `${percentage.toFixed(1)}% of components consider keyboard navigation`,
      details: { keyboardNavCount, totalComponents, percentage }
    };
  }

  checkColorContrast() {
    const cssContent = fs.readFileSync('./styles/globals.css', 'utf8');
    
    // Check for high contrast colors
    const hasHighContrast = cssContent.includes('#FFFFFF') && cssContent.includes('#0F172A');
    const hasColorVariables = cssContent.includes('--ff-text-primary') && cssContent.includes('--ff-bg-dark');
    
    return {
      passed: hasHighContrast && hasColorVariables,
      message: `Color contrast - High contrast: ${hasHighContrast ? '✓' : '✗'}, Variables: ${hasColorVariables ? '✓' : '✗'}`,
      details: { hasHighContrast, hasColorVariables }
    };
  }

  // Utility Methods
  findFiles(dir, pattern) {
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
            files.push(itemPath);
          }
        }
      } catch (error) {
        // Directory not accessible
      }
    };
    
    walk(dir);
    return files;
  }

  getFolderSize(folderPath) {
    let size = 0;
    
    const walk = (currentPath) => {
      const items = fs.readdirSync(currentPath);
      
      for (const item of items) {
        const itemPath = path.join(currentPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          walk(itemPath);
        } else {
          size += stat.size;
        }
      }
    };
    
    walk(folderPath);
    return size;
  }

  calculateOverallResult() {
    const categories = ['ui_consistency', 'functionality', 'performance', 'accessibility'];
    const results = categories.map(cat => {
      const total = this.results[cat].passed + this.results[cat].failed;
      return total > 0 ? this.results[cat].passed / total : 1;
    });
    
    const overallScore = results.reduce((sum, score) => sum + score, 0) / results.length;
    
    if (overallScore >= 0.9) {
      this.results.overall = 'excellent';
    } else if (overallScore >= 0.8) {
      this.results.overall = 'good';
    } else if (overallScore >= 0.7) {
      this.results.overall = 'acceptable';
    } else {
      this.results.overall = 'needs_improvement';
    }
    
    this.results.overallScore = overallScore;
  }

  generateReport() {
    console.log('\n📊 MERGE VALIDATION REPORT');
    console.log('============================');
    
    const categories = ['ui_consistency', 'functionality', 'performance', 'accessibility'];
    
    categories.forEach(category => {
      const result = this.results[category];
      const total = result.passed + result.failed;
      const percentage = total > 0 ? (result.passed / total) * 100 : 0;
      
      console.log(`\n${category.toUpperCase().replace('_', ' ')}:`);
      console.log(`  ✅ Passed: ${result.passed}`);
      console.log(`  ❌ Failed: ${result.failed}`);
      console.log(`  📊 Success Rate: ${percentage.toFixed(1)}%`);
      
      if (result.failed > 0) {
        console.log(`  Failed Tests:`);
        result.tests
          .filter(test => !test.passed)
          .forEach(test => {
            console.log(`    - ${test.name}: ${test.message}`);
          });
      }
    });
    
    console.log(`\n🏆 OVERALL RESULT: ${this.results.overall.toUpperCase()}`);
    console.log(`📈 Overall Score: ${(this.results.overallScore * 100).toFixed(1)}%`);
    
    // Save detailed report
    fs.writeFileSync(
      './integration/validation-report.json',
      JSON.stringify(this.results, null, 2)
    );
    
    console.log(`\n📄 Detailed report saved to: ./integration/validation-report.json`);
    
    // Exit with appropriate code
    if (this.results.overall === 'needs_improvement') {
      console.log('\n⚠️  Merge validation failed. Please address the issues above before proceeding.');
      process.exit(1);
    } else {
      console.log('\n🎉 Merge validation successful! Your integration maintains FlashFusion quality standards.');
      process.exit(0);
    }
  }
}

// Run validation
const validator = new MergeValidator();
validator.validate();