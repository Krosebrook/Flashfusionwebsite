#!/usr/bin/env node

/**
 * FlashFusion Production Health Check
 * Comprehensive production readiness validation
 */

const fs = require('fs');
const path = require('path');

class ProductionHealthCheck {
  constructor() {
    this.checks = [];
    this.passed = 0;
    this.failed = 0;
    this.warnings = 0;
  }

  async runAllChecks() {
    console.log('🏥 FlashFusion Production Health Check\n');
    console.log('=' .repeat(50));

    await this.checkEnvironment();
    await this.checkBuild();
    await this.checkSecurity();
    await this.checkPerformance();
    await this.checkAccessibility();
    await this.checkFeatures();
    
    this.printSummary();
    return this.failed === 0;
  }

  check(name, condition, message, type = 'error') {
    const status = condition ? '✅' : (type === 'warning' ? '⚠️' : '❌');
    console.log(`${status} ${name}: ${message}`);
    
    if (condition) {
      this.passed++;
    } else if (type === 'warning') {
      this.warnings++;
    } else {
      this.failed++;
    }
  }

  async checkEnvironment() {
    console.log('\n🌍 Environment Configuration');
    console.log('-'.repeat(30));

    // Check Node.js version
    const nodeVersion = process.version;
    const isNodeOk = parseInt(nodeVersion.slice(1)) >= 18;
    this.check('Node.js Version', isNodeOk, 
      `${nodeVersion} ${isNodeOk ? '(✓ >= 18)' : '(✗ < 18 required)'}`);

    // Check environment variables
    const envVars = [
      'NODE_ENV',
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY'
    ];

    envVars.forEach(varName => {
      const exists = process.env[varName] !== undefined;
      this.check(`${varName}`, exists, 
        exists ? 'Set' : 'Missing (required for production)');
    });

    // Check package.json
    const packageExists = fs.existsSync('./package.json');
    this.check('package.json', packageExists, 
      packageExists ? 'Found' : 'Missing');

    if (packageExists) {
      try {
        const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
        this.check('App Version', !!pkg.version, 
          pkg.version || 'Not set');
        this.check('Production Scripts', !!pkg.scripts['build:prod'], 
          'Production build script available');
      } catch (error) {
        this.check('package.json Parse', false, 'Invalid JSON');
      }
    }
  }

  async checkBuild() {
    console.log('\n🏗️ Build Configuration');
    console.log('-'.repeat(30));

    // Check TypeScript config
    const tsconfigExists = fs.existsSync('./tsconfig.json');
    this.check('TypeScript Config', tsconfigExists, 
      tsconfigExists ? 'Found' : 'Missing');

    // Check Vite config
    const viteConfigExists = fs.existsSync('./vite.config.ts');
    this.check('Vite Config', viteConfigExists, 
      viteConfigExists ? 'Found' : 'Missing');

    // Check if dist folder exists (production build)
    const distExists = fs.existsSync('./dist');
    this.check('Production Build', distExists, 
      distExists ? 'Build artifacts found' : 'Run npm run build:prod', 
      'warning');

    // Check essential files
    const essentialFiles = [
      './App.tsx',
      './styles/globals.css',
      './components/layout/Navigation.tsx',
      './components/layout/PageRouter.tsx'
    ];

    essentialFiles.forEach(file => {
      const exists = fs.existsSync(file);
      this.check(`Essential File: ${path.basename(file)}`, exists, 
        exists ? 'Found' : 'Missing');
    });
  }

  async checkSecurity() {
    console.log('\n🔒 Security Configuration');
    console.log('-'.repeat(30));

    // Check for security headers in deployment config
    const vercelConfigExists = fs.existsSync('./vercel-production.json');
    this.check('Security Headers Config', vercelConfigExists, 
      vercelConfigExists ? 'Vercel security headers configured' : 'Configure security headers');

    // Check for sensitive files that shouldn't be in production
    const sensitiveFiles = [
      '.env',
      '.env.local',
      '.env.development'
    ];

    let sensitivesFound = 0;
    sensitiveFiles.forEach(file => {
      if (fs.existsSync(file)) {
        sensitivesFound++;
        console.log(`⚠️  Sensitive file found: ${file} (ensure it's in .gitignore)`);
      }
    });

    this.check('Sensitive Files', sensitivesFound === 0, 
      sensitivesFound === 0 ? 'No sensitive files in repository' : 
      `${sensitivesFound} sensitive files found`);

    // Check .gitignore
    const gitignoreExists = fs.existsSync('./.gitignore');
    this.check('.gitignore', gitignoreExists, 
      gitignoreExists ? 'Found' : 'Missing');

    if (gitignoreExists) {
      const gitignore = fs.readFileSync('./.gitignore', 'utf8');
      const hasEnvIgnore = gitignore.includes('.env');
      this.check('Environment Files Ignored', hasEnvIgnore, 
        hasEnvIgnore ? 'Environment files properly ignored' : 
        'Add .env* to .gitignore');
    }
  }

  async checkPerformance() {
    console.log('\n⚡ Performance Configuration');
    console.log('-'.repeat(30));

    // Check for lazy loading
    const routerFile = './components/layout/PageRouter.tsx';
    if (fs.existsSync(routerFile)) {
      const routerContent = fs.readFileSync(routerFile, 'utf8');
      const hasLazyLoading = routerContent.includes('lazy(') || routerContent.includes('Suspense');
      this.check('Lazy Loading', hasLazyLoading, 
        hasLazyLoading ? 'Implemented in router' : 'Consider implementing lazy loading');
    }

    // Check for code splitting patterns
    const appFile = './App.tsx';
    if (fs.existsSync(appFile)) {
      const appContent = fs.readFileSync(appFile, 'utf8');
      const hasCodeSplitting = appContent.includes('Suspense') && 
                              appContent.includes('lazy');
      this.check('Code Splitting', hasCodeSplitting, 
        hasCodeSplitting ? 'Implemented' : 'Consider implementing', 'warning');
    }

    // Check bundle analysis tools
    const hasAnalysis = fs.existsSync('./scripts/analyze-bundle.js') ||
                       fs.existsSync('./webpack-bundle-analyzer.config.js');
    this.check('Bundle Analysis', hasAnalysis, 
      hasAnalysis ? 'Bundle analysis tools available' : 
      'Consider adding bundle analysis', 'warning');
  }

  async checkAccessibility() {
    console.log('\n♿ Accessibility Configuration');
    console.log('-'.repeat(30));

    // Check for accessibility utilities in CSS
    const cssFile = './styles/globals.css';
    if (fs.existsSync(cssFile)) {
      const cssContent = fs.readFileSync(cssFile, 'utf8');
      const hasA11yClasses = cssContent.includes('sr-only') || 
                            cssContent.includes('skip-link');
      this.check('Accessibility Utilities', hasA11yClasses, 
        hasA11yClasses ? 'Screen reader utilities found' : 
        'Consider adding accessibility utilities');

      const hasFocusStyles = cssContent.includes('focus') || 
                            cssContent.includes('ff-focus-ring');
      this.check('Focus Styles', hasFocusStyles, 
        hasFocusStyles ? 'Focus styles implemented' : 
        'Implement focus styles');
    }

    // Check for ARIA attributes in components
    const navigationFile = './components/layout/Navigation.tsx';
    if (fs.existsSync(navigationFile)) {
      const navContent = fs.readFileSync(navigationFile, 'utf8');
      const hasAriaLabels = navContent.includes('aria-') || 
                           navContent.includes('role=');
      this.check('ARIA Attributes', hasAriaLabels, 
        hasAriaLabels ? 'ARIA attributes found in navigation' : 
        'Add ARIA attributes for accessibility');
    }
  }

  async checkFeatures() {
    console.log('\n🎯 Feature Completeness');
    console.log('-'.repeat(30));

    // Check critical components
    const criticalComponents = [
      './components/auth/AuthSystem.tsx',
      './components/security/SecurityPage.tsx',
      './components/tools/FullStackBuilderTool.tsx',
      './components/workflows/UserWorkflowOrchestrator.tsx',
      './components/pages/DashboardPage.tsx'
    ];

    criticalComponents.forEach(component => {
      const exists = fs.existsSync(component);
      const componentName = path.basename(component, '.tsx');
      this.check(`${componentName}`, exists, 
        exists ? 'Implemented' : 'Missing critical component');
    });

    // Check if error boundaries are implemented
    const errorBoundaryExists = fs.existsSync('./components/ui/error-boundary-enhanced.tsx');
    this.check('Error Boundaries', errorBoundaryExists, 
      errorBoundaryExists ? 'Enhanced error boundaries implemented' : 
      'Implement error boundaries');

    // Check for service integrations
    const servicesDir = './services';
    if (fs.existsSync(servicesDir)) {
      const services = fs.readdirSync(servicesDir);
      const hasAIService = services.some(s => s.includes('AI'));
      const hasAnalytics = services.some(s => s.includes('Analytics'));
      
      this.check('AI Services', hasAIService, 
        hasAIService ? 'AI services implemented' : 'AI services missing');
      this.check('Analytics Services', hasAnalytics, 
        hasAnalytics ? 'Analytics services implemented' : 'Analytics services missing');
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 PRODUCTION HEALTH CHECK SUMMARY');
    console.log('='.repeat(50));
    
    console.log(`✅ Passed: ${this.passed}`);
    console.log(`⚠️  Warnings: ${this.warnings}`);
    console.log(`❌ Failed: ${this.failed}`);
    
    const total = this.passed + this.warnings + this.failed;
    const score = Math.round((this.passed / total) * 100);
    
    console.log(`\n📈 Health Score: ${score}%`);
    
    if (this.failed === 0 && this.warnings <= 2) {
      console.log('\n🎉 FlashFusion is READY for production launch!');
      console.log('🚀 You can proceed with deployment.');
    } else if (this.failed === 0) {
      console.log('\n⚠️  FlashFusion has minor issues but can be deployed.');
      console.log('🔧 Consider addressing warnings before launch.');
    } else {
      console.log('\n❌ FlashFusion has critical issues that must be fixed.');
      console.log('🛠️  Address failed checks before deployment.');
    }
    
    console.log('\n📝 Next steps:');
    console.log('   1. Fix any failed checks');
    console.log('   2. Run: npm run build:prod');
    console.log('   3. Run: npm run deploy:prod');
    console.log('   4. Monitor: npm run health-check');
  }
}

// Run the health check
async function main() {
  const healthCheck = new ProductionHealthCheck();
  const isHealthy = await healthCheck.runAllChecks();
  process.exit(isHealthy ? 0 : 1);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ProductionHealthCheck;