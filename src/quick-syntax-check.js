#!/usr/bin/env node

/**
 * Quick Syntax Check for Workflow Components
 */

const fs = require('fs');

console.log('\n🔍 Quick Syntax Check for Workflow Components');
console.log('=' .repeat(50));

const workflowFiles = [
  'components/workflows/AICreationWorkflow.tsx',
  'components/workflows/OneClickPublishingWorkflow.tsx',
  'components/workflows/CreatorCommerceWorkflow.tsx',
  'components/workflows/EnterpriseSecurityWorkflow.tsx',
  'components/workflows/SmartAnalyticsWorkflow.tsx',
  'components/workflows/QualityAssuranceWorkflow.tsx',
  'components/workflows/CompleteFeatureWorkflowDemo.tsx'
];

let totalFiles = 0;
let validFiles = 0;
let issues = [];

for (const file of workflowFiles) {
  totalFiles++;
  console.log(`\n📄 Checking: ${file}`);
  
  try {
    if (!fs.existsSync(file)) {
      console.log(`   ❌ File not found`);
      issues.push(`File not found: ${file}`);
      continue;
    }
    
    const content = fs.readFileSync(file, 'utf8');
    
    // Check for common JSX syntax issues
    const commonIssues = [];
    
    // Check for incomplete JSX elements
    if (content.match(/<[a-zA-Z][^>]*\?[^>]*>/)) {
      commonIssues.push('Potential JSX syntax error with conditional rendering');
    }
    
    // Check for incomplete component references
    if (content.match(/<[a-z]+\?[^>]*>/)) {
      commonIssues.push('Invalid component reference syntax');
    }
    
    // Check for basic React imports
    if (!content.includes('import React')) {
      commonIssues.push('Missing React import');
    }
    
    // Check for export
    if (!content.includes('export function') && !content.includes('export default')) {
      commonIssues.push('Missing export statement');
    }
    
    // Check for JSX return
    if (!content.includes('return (')) {
      commonIssues.push('Missing JSX return statement');
    }
    
    if (commonIssues.length === 0) {
      console.log(`   ✅ No obvious syntax issues found`);
      validFiles++;
    } else {
      console.log(`   ⚠️  Potential issues:`);
      commonIssues.forEach(issue => {
        console.log(`      - ${issue}`);
        issues.push(`${file}: ${issue}`);
      });
    }
    
  } catch (error) {
    console.log(`   ❌ Error reading file: ${error.message}`);
    issues.push(`Error reading ${file}: ${error.message}`);
  }
}

console.log('\n' + '='.repeat(50));
console.log('📊 Syntax Check Results');
console.log('='.repeat(50));

console.log(`Total Files: ${totalFiles}`);
console.log(`Valid Files: ${validFiles}`);
console.log(`Files with Issues: ${totalFiles - validFiles}`);

if (issues.length > 0) {
  console.log('\n🚨 Issues Found:');
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue}`);
  });
} else {
  console.log('\n✅ All workflow files pass basic syntax checks!');
}

console.log('\n' + '='.repeat(50));