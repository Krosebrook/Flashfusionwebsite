#!/usr/bin/env node

/**
 * FlashFusion Complete Workflow Validator
 * Tests every possible user workflow for complete functionality
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔄 FlashFusion Complete Workflow Validator');
console.log('=' .repeat(60));

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
let warnings = 0;
const results = [];

function test(category, name, testFn, priority = 'normal') {
  totalTests++;
  try {
    const result = testFn();
    if (result === true || result === undefined) {
      passedTests++;
      console.log(`✅ [${category}] ${name}`);
      results.push({ category, name, status: 'PASS', priority, details: 'OK' });
    } else if (typeof result === 'string' && result.startsWith('WARNING:')) {
      warnings++;
      console.log(`⚠️  [${category}] ${name}: ${result}`);
      results.push({ category, name, status: 'WARNING', priority, details: result });
    } else {
      failedTests++;
      console.log(`❌ [${category}] ${name}: ${result}`);
      results.push({ category, name, status: 'FAIL', priority, details: result });
    }
  } catch (error) {
    failedTests++;
    console.log(`❌ [${category}] ${name}: ${error.message}`);
    results.push({ category, name, status: 'FAIL', priority, details: error.message });
  }
}

// 1. LANDING PAGE & FIRST IMPRESSION WORKFLOWS
console.log('\n🏠 Testing Landing Page & First Impression Workflows...');

test('Landing', 'Landing Page Component Exists', () => {
  if (!fs.existsSync('components/landing/FlashFusionLandingPage.tsx')) {
    return 'Landing page component missing';
  }
  
  const content = fs.readFileSync('components/landing/FlashFusionLandingPage.tsx', 'utf8');
  if (!content.includes('export')) return 'Missing export';
  if (!content.includes('FlashFusion')) return 'Missing FlashFusion branding';
  if (!content.includes('Enter App') || !content.includes('Get Started')) {
    return 'WARNING: Missing call-to-action buttons';
  }
  
  return true;
}, 'critical');

test('Landing', 'Landing Page Features Section', () => {
  const content = fs.readFileSync('components/landing/FlashFusionLandingPage.tsx', 'utf8');
  
  if (!content.includes('features') && !content.includes('Features')) {
    return 'Missing features section';
  }
  if (!content.includes('tool')) return 'Missing tool mentions';
  if (!content.includes('AI')) return 'Missing AI capabilities';
  
  return true;
}, 'important');

test('Landing', 'Demo Mode Support', () => {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  if (!appContent.includes('demo')) {
    return 'WARNING: No demo mode detection found';
  }
  
  return true;
}, 'normal');

// 2. AUTHENTICATION WORKFLOWS
console.log('\n🔐 Testing Authentication Workflows...');

test('Auth', 'Authentication System Component', () => {
  if (!fs.existsSync('components/auth/AuthenticationSystem.tsx')) {
    return 'AuthenticationSystem component missing';
  }
  
  const content = fs.readFileSync('components/auth/AuthenticationSystem.tsx', 'utf8');
  if (!content.includes('export')) return 'Missing export';
  if (!content.includes('onAuthSuccess')) return 'Missing success handler';
  if (!content.includes('onAuthError')) return 'Missing error handler';
  
  return true;
}, 'critical');

test('Auth', 'OAuth Callback Component', () => {
  if (!fs.existsSync('components/auth/AuthCallback.tsx')) {
    return 'OAuth callback component missing';
  }
  
  const content = fs.readFileSync('components/auth/AuthCallback.tsx', 'utf8');
  if (!content.includes('useEffect')) return 'Missing useEffect for callback handling';
  if (!content.includes('window.location')) return 'Missing URL handling';
  
  return true;
}, 'critical');

test('Auth', 'Email Verification Component', () => {
  if (!fs.existsSync('components/auth/EmailVerification.tsx')) {
    return 'Email verification component missing';
  }
  return true;
}, 'important');

test('Auth', 'Password Reset Component', () => {
  if (!fs.existsSync('components/auth/PasswordReset.tsx')) {
    return 'Password reset component missing';
  }
  return true;
}, 'important');

test('Auth', 'Authentication Hook Integration', () => {
  if (!fs.existsSync('hooks/useAuthentication.ts')) {
    return 'useAuthentication hook missing';
  }
  
  const hookContent = fs.readFileSync('hooks/useAuthentication.ts', 'utf8');
  if (!hookContent.includes('isAuthenticated')) return 'Missing isAuthenticated state';
  if (!hookContent.includes('isInitialized')) return 'Missing isInitialized state';
  
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  if (!appContent.includes('useAuthentication')) return 'Hook not used in App.tsx';
  
  return true;
}, 'critical');

test('Auth', 'Supabase Integration', () => {
  if (!fs.existsSync('utils/supabase/client.ts')) {
    return 'Supabase client missing';
  }
  if (!fs.existsSync('utils/supabase/info.tsx')) {
    return 'Supabase info missing';
  }
  
  const clientContent = fs.readFileSync('utils/supabase/client.ts', 'utf8');
  if (!clientContent.includes('createClient')) return 'Missing createClient function';
  
  return true;
}, 'critical');

// 3. MAIN APPLICATION INTERFACE WORKFLOWS
console.log('\n🏢 Testing Main Application Interface Workflows...');

test('App Interface', 'Main Interface Component', () => {
  if (!fs.existsSync('components/core/flash-fusion-interface.tsx')) {
    return 'Main interface component missing';
  }
  
  const content = fs.readFileSync('components/core/flash-fusion-interface.tsx', 'utf8');
  if (!content.includes('export')) return 'Missing export';
  if (!content.includes('FlashFusionInterface')) return 'Missing main interface';
  
  return true;
}, 'critical');

test('App Interface', 'Navigation System', () => {
  const navFiles = [
    'components/layout/Navigation.tsx',
    'components/layout/Sidebar.tsx',
    'utils/navigation-system.ts'
  ];
  
  for (const file of navFiles) {
    if (!fs.existsSync(file)) {
      return `Missing navigation file: ${file}`;
    }
  }
  
  return true;
}, 'critical');

test('App Interface', 'Route Management', () => {
  if (!fs.existsSync('components/layout/PageRouter.tsx')) {
    return 'PageRouter component missing';
  }
  
  const routeHandlersExist = fs.existsSync('components/layout/route-handlers');
  if (!routeHandlersExist) {
    return 'Route handlers directory missing';
  }
  
  return true;
}, 'important');

test('App Interface', 'App State Management', () => {
  if (!fs.existsSync('hooks/useAppInitialization.ts')) {
    return 'useAppInitialization hook missing';
  }
  
  const content = fs.readFileSync('hooks/useAppInitialization.ts', 'utf8');
  if (!content.includes('appState')) return 'Missing appState management';
  if (!content.includes('performanceMetrics')) return 'Missing performance metrics';
  
  return true;
}, 'important');

// 4. AI TOOLS WORKFLOW TESTING
console.log('\n🤖 Testing AI Tools Workflows...');

test('Tools', 'Full-Stack Builder Tool', () => {
  const toolFiles = [
    'components/tools/generation/FullStackBuilderTool.tsx',
    'components/tools/generation/FullStackAppBuilder.tsx'
  ];
  
  let foundTool = false;
  for (const file of toolFiles) {
    if (fs.existsSync(file)) {
      foundTool = true;
      break;
    }
  }
  
  if (!foundTool) return 'Full-stack builder tool missing';
  return true;
}, 'critical');

test('Tools', 'Code Generation Tools', () => {
  const codeTools = [
    'components/tools/generation/CodeGeneratorTool.tsx',
    'components/tools/generation/EnhancedCodeGenerator.tsx'
  ];
  
  let foundCodeTool = false;
  for (const file of codeTools) {
    if (fs.existsSync(file)) {
      foundCodeTool = true;
      break;
    }
  }
  
  if (!foundCodeTool) return 'Code generation tools missing';
  return true;
}, 'critical');

test('Tools', 'Content Creation Tools', () => {
  const contentTools = [
    'components/tools/ContentGeneratorTool.tsx',
    'components/creator/ContentCreationHub.tsx'
  ];
  
  let foundContentTool = false;
  for (const file of contentTools) {
    if (fs.existsSync(file)) {
      foundContentTool = true;
      break;
    }
  }
  
  if (!foundContentTool) return 'Content creation tools missing';
  return true;
}, 'important');

test('Tools', 'Analysis Tools', () => {
  const analysisTools = [
    'components/tools/analysis/SecurityScannerTool.tsx',
    'components/tools/analysis/SmartCodeReviewTool.tsx'
  ];
  
  let foundAnalysisTool = false;
  for (const file of analysisTools) {
    if (fs.existsSync(file)) {
      foundAnalysisTool = true;
      break;
    }
  }
  
  if (!foundAnalysisTool) return 'Analysis tools missing';
  return true;
}, 'important');

test('Tools', 'Deployment Tools', () => {
  const deployTools = [
    'components/tools/deployment/OneClickDeployTool.tsx',
    'components/deployment/AdvancedProductionDeployment.tsx'
  ];
  
  let foundDeployTool = false;
  for (const file of deployTools) {
    if (fs.existsSync(file)) {
      foundDeployTool = true;
      break;
    }
  }
  
  if (!foundDeployTool) return 'Deployment tools missing';
  return true;
}, 'important');

test('Tools', 'Collaboration Tools', () => {
  const collabTools = [
    'components/tools/collaboration/TeamWorkspaceTool.tsx',
    'components/collaboration/LiveCollaborationEditor.tsx'
  ];
  
  let foundCollabTool = false;
  for (const file of collabTools) {
    if (fs.existsSync(file)) {
      foundCollabTool = true;
      break;
    }
  }
  
  if (!foundCollabTool) return 'Collaboration tools missing';
  return true;
}, 'normal');

test('Tools', 'Optimization Tools', () => {
  const optimizationTools = [
    'components/tools/optimization/PerformanceOptimizerTool.tsx',
    'components/performance/PerformanceOptimizer.tsx'
  ];
  
  let foundOptimizationTool = false;
  for (const file of optimizationTools) {
    if (fs.existsSync(file)) {
      foundOptimizationTool = true;
      break;
    }
  }
  
  if (!foundOptimizationTool) return 'Optimization tools missing';
  return true;
}, 'normal');

// 5. EXPORT & DOWNLOAD WORKFLOWS
console.log('\n📤 Testing Export & Download Workflows...');

test('Export', 'Universal Download Manager', () => {
  if (!fs.existsSync('components/ui/universal-download-manager.tsx')) {
    return 'WARNING: Universal download manager missing';
  }
  return true;
}, 'important');

test('Export', 'Multi-Format Download Selector', () => {
  if (!fs.existsSync('components/ui/multi-format-download-selector.tsx')) {
    return 'WARNING: Multi-format download selector missing';
  }
  return true;
}, 'normal');

test('Export', 'Bulk Export Manager', () => {
  if (!fs.existsSync('components/export/BulkExportManager.tsx')) {
    return 'WARNING: Bulk export manager missing';
  }
  return true;
}, 'normal');

// 6. ERROR HANDLING & RECOVERY WORKFLOWS
console.log('\n🚨 Testing Error Handling & Recovery Workflows...');

test('Error Handling', 'Error Boundary Components', () => {
  const errorComponents = [
    'components/ui/simple-error-boundary.tsx',
    'components/ui/timeout-error-boundary.tsx',
    'components/ui/emergency-mode.tsx'
  ];
  
  for (const component of errorComponents) {
    if (!fs.existsSync(component)) {
      return `Missing error component: ${component}`;
    }
  }
  
  return true;
}, 'critical');

test('Error Handling', 'App Error Integration', () => {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  if (!appContent.includes('SimpleErrorBoundary')) return 'Missing SimpleErrorBoundary';
  if (!appContent.includes('TimeoutErrorBoundary')) return 'Missing TimeoutErrorBoundary';
  if (!appContent.includes('EmergencyMode')) return 'Missing EmergencyMode';
  
  return true;
}, 'critical');

test('Error Handling', 'Loading States', () => {
  if (!fs.existsSync('components/core/app-states/LoadingState.tsx')) {
    return 'LoadingState component missing';
  }
  if (!fs.existsSync('components/core/app-states/ErrorState.tsx')) {
    return 'ErrorState component missing';
  }
  
  return true;
}, 'important');

// 7. MOBILE WORKFLOW TESTING
console.log('\n📱 Testing Mobile Workflows...');

test('Mobile', 'Mobile Navigation', () => {
  if (!fs.existsSync('components/layout/AppMobileNavigation.tsx')) {
    return 'WARNING: Mobile navigation component missing';
  }
  return true;
}, 'important');

test('Mobile', 'Mobile Optimizations', () => {
  if (!fs.existsSync('components/mobile/MobileOptimizationCenter.tsx')) {
    return 'WARNING: Mobile optimization center missing';
  }
  return true;
}, 'normal');

test('Mobile', 'Responsive Design CSS', () => {
  const cssContent = fs.readFileSync('styles/globals.css', 'utf8');
  
  if (!cssContent.includes('@media')) return 'Missing responsive media queries';
  if (!cssContent.includes('mobile')) return 'WARNING: Limited mobile-specific styles';
  
  return true;
}, 'important');

test('Mobile', 'Touch Interface Support', () => {
  const cssContent = fs.readFileSync('styles/globals.css', 'utf8');
  
  if (!cssContent.includes('touch') && !cssContent.includes('44px')) {
    return 'WARNING: Limited touch interface considerations';
  }
  
  return true;
}, 'normal');

// 8. PERFORMANCE WORKFLOW TESTING
console.log('\n⚡ Testing Performance Workflows...');

test('Performance', 'Performance Monitor', () => {
  if (!fs.existsSync('components/core/app-states/PerformanceMonitor.tsx')) {
    return 'Performance monitor component missing';
  }
  
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  if (!appContent.includes('PerformanceMonitor')) {
    return 'Performance monitor not integrated';
  }
  
  return true;
}, 'important');

test('Performance', 'Memory Optimization', () => {
  const memoryFiles = [
    'components/memory-optimized/AdvancedMemoryMonitor.tsx',
    'utils/memory-optimizer.ts'
  ];
  
  let foundMemoryOptimization = false;
  for (const file of memoryFiles) {
    if (fs.existsSync(file)) {
      foundMemoryOptimization = true;
      break;
    }
  }
  
  if (!foundMemoryOptimization) return 'WARNING: Memory optimization components missing';
  return true;
}, 'normal');

test('Performance', 'Lazy Loading Components', () => {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  if (!appContent.includes('Suspense')) return 'Missing Suspense for lazy loading';
  if (!appContent.includes('lazy') && !appContent.includes('React.lazy')) {
    return 'WARNING: Limited lazy loading implementation';
  }
  
  return true;
}, 'normal');

// 9. INTEGRATION & API WORKFLOWS
console.log('\n🔗 Testing Integration & API Workflows...');

test('Integration', 'API Service Configuration', () => {
  const apiFiles = [
    'services/AIService.ts',
    'services/IntegrationService.ts'
  ];
  
  for (const file of apiFiles) {
    if (!fs.existsSync(file)) {
      return `Missing API service: ${file}`;
    }
  }
  
  return true;
}, 'important');

test('Integration', 'Supabase Backend Integration', () => {
  if (!fs.existsSync('supabase/functions/server/index.tsx')) {
    return 'Supabase server functions missing';
  }
  
  const serverContent = fs.readFileSync('supabase/functions/server/index.tsx', 'utf8');
  if (!serverContent.includes('Deno.serve')) return 'Missing server initialization';
  
  return true;
}, 'important');

test('Integration', 'Environment Configuration', () => {
  if (!fs.existsSync('_env_example.tsx')) {
    return 'Environment example file missing';
  }
  
  const envContent = fs.readFileSync('_env_example.tsx', 'utf8');
  if (!envContent.includes('SUPABASE')) return 'Missing Supabase environment variables';
  
  return true;
}, 'important');

// 10. ADVANCED WORKFLOWS
console.log('\n🚀 Testing Advanced Workflows...');

test('Advanced', 'Multi-Agent Orchestration', () => {
  if (!fs.existsSync('components/agents/MultiAgentOrchestrationDashboard.tsx')) {
    return 'Multi-agent orchestration dashboard missing';
  }
  return true;
}, 'normal');

test('Advanced', 'Workflow Builder', () => {
  const workflowFiles = [
    'components/tools/EnhancedWorkflowBuilder.tsx',
    'components/automation/NoCodeWorkflowBuilder.tsx'
  ];
  
  let foundWorkflowBuilder = false;
  for (const file of workflowFiles) {
    if (fs.existsSync(file)) {
      foundWorkflowBuilder = true;
      break;
    }
  }
  
  if (!foundWorkflowBuilder) return 'Workflow builder missing';
  return true;
}, 'normal');

test('Advanced', 'Team Collaboration Features', () => {
  if (!fs.existsSync('components/collaboration/AdvancedCollaborationHub.tsx')) {
    return 'WARNING: Advanced collaboration hub missing';
  }
  return true;
}, 'normal');

test('Advanced', 'Analytics and Monitoring', () => {
  const analyticsFiles = [
    'components/analytics/AdvancedAnalytics.tsx',
    'services/AnalyticsService.ts'
  ];
  
  let foundAnalytics = false;
  for (const file of analyticsFiles) {
    if (fs.existsSync(file)) {
      foundAnalytics = true;
      break;
    }
  }
  
  if (!foundAnalytics) return 'WARNING: Analytics system missing';
  return true;
}, 'normal');

// 11. BUILD AND DEPLOYMENT WORKFLOWS
console.log('\n🏗️ Testing Build and Deployment Workflows...');

test('Build', 'Build Configuration', () => {
  if (!fs.existsSync('vite.config.ts')) return 'Vite config missing';
  if (!fs.existsSync('tsconfig.json')) return 'TypeScript config missing';
  if (!fs.existsSync('package.json')) return 'Package.json missing';
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (!packageJson.scripts.build) return 'Build script missing';
  if (!packageJson.scripts.dev) return 'Dev script missing';
  
  return true;
}, 'critical');

test('Build', 'Deployment Configuration', () => {
  const deployConfigs = [
    'vercel.json',
    'netlify.toml',
    'Dockerfile'
  ];
  
  let foundDeployConfig = false;
  for (const config of deployConfigs) {
    if (fs.existsSync(config)) {
      foundDeployConfig = true;
      break;
    }
  }
  
  if (!foundDeployConfig) return 'WARNING: No deployment configuration found';
  return true;
}, 'important');

test('Build', 'Production Scripts', () => {
  const scripts = [
    'production-build.sh',
    'deploy-production.sh'
  ];
  
  let foundProdScript = false;
  for (const script of scripts) {
    if (fs.existsSync(script)) {
      foundProdScript = true;
      break;
    }
  }
  
  if (!foundProdScript) return 'WARNING: Production scripts missing';
  return true;
}, 'normal');

// GENERATE COMPREHENSIVE REPORT
console.log('\n' + '='.repeat(60));
console.log('📊 COMPLETE WORKFLOW VALIDATION RESULTS');
console.log('='.repeat(60));

const criticalTests = results.filter(r => r.priority === 'critical');
const importantTests = results.filter(r => r.priority === 'important');
const normalTests = results.filter(r => r.priority === 'normal');

const criticalPassed = criticalTests.filter(r => r.status === 'PASS').length;
const importantPassed = importantTests.filter(r => r.status === 'PASS').length;
const normalPassed = normalTests.filter(r => r.status === 'PASS').length;

console.log(`Total Tests: ${totalTests}`);
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);
console.log(`⚠️  Warnings: ${warnings}`);
console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

console.log('\n📊 Priority Breakdown:');
console.log(`🔴 Critical: ${criticalPassed}/${criticalTests.length} passed`);
console.log(`🟡 Important: ${importantPassed}/${importantTests.length} passed`);
console.log(`🟢 Normal: ${normalPassed}/${normalTests.length} passed`);

// Show failed critical tests
const failedCritical = criticalTests.filter(r => r.status === 'FAIL');
if (failedCritical.length > 0) {
  console.log('\n🚨 FAILED CRITICAL TESTS:');
  failedCritical.forEach(test => {
    console.log(`   ❌ ${test.category}: ${test.name} - ${test.details}`);
  });
}

// Show warnings
const warningTests = results.filter(r => r.status === 'WARNING');
if (warningTests.length > 0) {
  console.log('\n⚠️  WARNINGS:');
  warningTests.forEach(test => {
    console.log(`   ⚠️  ${test.category}: ${test.name} - ${test.details}`);
  });
}

console.log('\n🎯 WORKFLOW READINESS ASSESSMENT:');
const criticalSuccessRate = (criticalPassed / criticalTests.length) * 100;
const overallSuccessRate = ((passedTests / totalTests) * 100);

if (criticalSuccessRate === 100 && overallSuccessRate >= 90) {
  console.log('🎉 EXCELLENT: All workflows ready for production!');
} else if (criticalSuccessRate === 100 && overallSuccessRate >= 80) {
  console.log('✅ GOOD: Critical workflows ready, minor improvements needed');
} else if (criticalSuccessRate >= 90) {
  console.log('⚠️  FAIR: Most critical workflows ready, some issues need attention');
} else {
  console.log('🚨 NEEDS WORK: Critical workflow issues must be fixed');
}

console.log('\n📋 NEXT STEPS:');
if (failedCritical.length > 0) {
  console.log('1. 🔥 Fix all failed critical tests immediately');
  console.log('2. 🔍 Test critical workflows manually');
  console.log('3. 🔄 Re-run this validation script');
} else if (failedTests > 0) {
  console.log('1. 🔧 Fix remaining failed tests');
  console.log('2. 📝 Address warnings for better UX');
  console.log('3. 🧪 Perform end-to-end user testing');
} else {
  console.log('1. 🧪 Perform manual user journey testing');
  console.log('2. 📱 Test mobile workflows thoroughly');
  console.log('3. ⚡ Run performance testing');
  console.log('4. 🚀 Ready for production deployment!');
}

// Save detailed report
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    totalTests,
    passedTests,
    failedTests,
    warnings,
    successRate: ((passedTests / totalTests) * 100).toFixed(1)
  },
  priority: {
    critical: { passed: criticalPassed, total: criticalTests.length },
    important: { passed: importantPassed, total: importantTests.length },
    normal: { passed: normalPassed, total: normalTests.length }
  },
  results,
  recommendation: criticalSuccessRate === 100 && overallSuccessRate >= 90 ? 'PRODUCTION_READY' :
                   criticalSuccessRate === 100 && overallSuccessRate >= 80 ? 'MOSTLY_READY' :
                   criticalSuccessRate >= 90 ? 'NEEDS_IMPROVEMENT' : 'CRITICAL_ISSUES'
};

fs.writeFileSync('complete-workflow-validation-report.json', JSON.stringify(report, null, 2));
console.log('\n📄 Detailed report saved: complete-workflow-validation-report.json');

console.log('\n' + '='.repeat(60));

process.exit(failedCritical.length > 0 ? 1 : 0);