#!/usr/bin/env node
// Make executable
require('child_process').execSync('chmod +x test-business-intelligence-hub.js', { stdio: 'inherit' });

/**
 * FlashFusion Business Intelligence Hub Integration Test
 * 
 * This script validates that the Business Intelligence Hub is properly
 * integrated into the FlashFusion platform with all required components.
 */

const fs = require('fs');
const path = require('path');

console.log('🧠 FlashFusion Business Intelligence Hub Integration Test\n');

// Test configuration
const tests = [
  {
    name: 'Business Intelligence Hub Component',
    file: '/components/analytics/FlashFusionBusinessIntelligenceHub.tsx',
    required: true
  },
  {
    name: 'Business Intelligence Page Component',
    file: '/components/pages/BusinessIntelligencePage.tsx',
    required: true
  },
  {
    name: 'Core Routes Integration',
    file: '/components/layout/route-handlers/coreSystemRoutes.tsx',
    required: true,
    checkContent: (content) => {
      return content.includes('FlashFusionBusinessIntelligenceHub') &&
             content.includes("'business-intelligence'") &&
             content.includes("'insights'");
    }
  },
  {
    name: 'Navigation Integration',
    file: '/components/layout/Navigation.tsx',
    required: true,
    checkContent: (content) => {
      return content.includes('business-intelligence') &&
             content.includes('BarChart3') &&
             content.includes('Business Intelligence');
    }
  },
  {
    name: 'Core Types Update',
    file: '/types/core.ts',
    required: true,
    checkContent: (content) => {
      return content.includes("'business-intelligence'") &&
             content.includes("'insights'");
    }
  }
];

let passedTests = 0;
let totalTests = tests.length;

console.log('🔍 Testing Business Intelligence Hub Integration...\n');

tests.forEach((test, index) => {
  const testNumber = `${index + 1}`.padStart(2, '0');
  const filePath = path.join(process.cwd(), test.file);
  
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      if (test.checkContent) {
        if (test.checkContent(content)) {
          console.log(`✅ Test ${testNumber}: ${test.name} - PASSED`);
          passedTests++;
        } else {
          console.log(`❌ Test ${testNumber}: ${test.name} - FAILED (Content validation failed)`);
        }
      } else {
        console.log(`✅ Test ${testNumber}: ${test.name} - PASSED`);
        passedTests++;
      }
    } else {
      console.log(`❌ Test ${testNumber}: ${test.name} - FAILED (File missing: ${test.file})`);
    }
  } catch (error) {
    console.log(`❌ Test ${testNumber}: ${test.name} - ERROR: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`📊 TEST RESULTS: ${passedTests}/${totalTests} tests passed`);

if (passedTests === totalTests) {
  console.log('🎉 All tests passed! Business Intelligence Hub is properly integrated.');
  console.log('\n🚀 Integration Status: READY FOR USE');
  console.log('\n📋 Business Intelligence Hub Features:');
  console.log('   • Multi-business ERP system integration');
  console.log('   • Market intelligence pipeline');
  console.log('   • Revenue stream analytics');
  console.log('   • Client project portfolio management');
  console.log('   • Business process automation monitoring');
  console.log('   • ROI analytics dashboard');
  console.log('   • Security & compliance metrics');
  console.log('   • Real-time performance monitoring');
  
  console.log('\n🎯 Access Instructions:');
  console.log('   1. Sign in to FlashFusion');
  console.log('   2. Navigate to "Business Intelligence" in the menu');
  console.log('   3. Explore the comprehensive analytics dashboard');
  console.log('   4. Use the navigation tabs to view different metrics');
  
  console.log('\n🔗 Navigation Paths:');
  console.log('   • Desktop: Click "Business Intelligence" in the navigation bar');
  console.log('   • Mobile: Open menu → Account → Business Intelligence');
  console.log('   • Direct Route: /business-intelligence');
  
  process.exit(0);
} else {
  console.log('❌ Some tests failed. Please check the integration.');
  console.log('\n🔧 Troubleshooting:');
  console.log('   1. Ensure all required files are present');
  console.log('   2. Check that imports are correctly configured');
  console.log('   3. Verify route handlers are properly updated');
  console.log('   4. Confirm navigation includes new menu items');
  
  process.exit(1);
}