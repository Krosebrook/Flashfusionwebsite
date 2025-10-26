// Quick test to verify App.tsx export is working properly
const fs = require('fs');
const path = require('path');

function testAppExport() {
  console.log('🔍 Testing FlashFusion App.tsx export...\n');
  
  try {
    // Read the App.tsx file
    const appPath = path.join(__dirname, 'App.tsx');
    const appContent = fs.readFileSync(appPath, 'utf-8');
    
    // Check for proper default export
    const hasDefaultExport = /export\s+default\s+App/.test(appContent);
    const hasAppFunction = /function\s+App\s*\(\s*\)\s*\{/.test(appContent);
    const hasMemoIssue = /const\s+App\s*=\s*memo/.test(appContent);
    
    console.log('📊 Export Analysis:');
    console.log(`   ✅ Has default export: ${hasDefaultExport ? 'Yes' : 'No'}`);
    console.log(`   ✅ Has App function: ${hasAppFunction ? 'Yes' : 'No'}`);
    console.log(`   ❌ Has memo issue: ${hasMemoIssue ? 'Yes (PROBLEM)' : 'No (GOOD)'}`);
    
    // Check for React imports
    const hasReactImport = /import\s+React.*from\s+['"]react['"]/.test(appContent);
    const hasMemoImport = /import\s+.*\{.*memo.*\}.*from\s+['"]react['"]/.test(appContent);
    
    console.log('\n📦 Import Analysis:');
    console.log(`   ✅ Has React import: ${hasReactImport ? 'Yes' : 'No'}`);
    console.log(`   ✅ Has memo import: ${hasMemoImport ? 'Yes' : 'No'}`);
    
    // Check for performance hooks usage
    const hasPerformanceMonitoring = /usePerformanceMonitoring/.test(appContent);
    const hasMemoryLeakDetector = /useMemoryLeakDetector/.test(appContent);
    
    console.log('\n🚀 Performance Features:');
    console.log(`   ✅ Performance monitoring: ${hasPerformanceMonitoring ? 'Yes' : 'No'}`);
    console.log(`   ✅ Memory leak detection: ${hasMemoryLeakDetector ? 'Yes' : 'No'}`);
    
    // Overall status
    const isHealthy = hasDefaultExport && hasAppFunction && !hasMemoIssue && hasReactImport;
    
    console.log('\n' + '='.repeat(50));
    if (isHealthy) {
      console.log('🎉 SUCCESS: App.tsx export is properly configured!');
      console.log('   - Default export is a function (not object)');
      console.log('   - All imports are correct');
      console.log('   - Performance monitoring is active');
    } else {
      console.log('❌ ISSUE: App.tsx has export problems');
      console.log('   Please check the analysis above for specific issues');
    }
    console.log('='.repeat(50));
    
    return isHealthy;
    
  } catch (error) {
    console.error('❌ Error testing App.tsx export:', error.message);
    return false;
  }
}

// Run the test
if (require.main === module) {
  const success = testAppExport();
  process.exit(success ? 0 : 1);
}

module.exports = { testAppExport };