#!/usr/bin/env node
/**
 * @fileoverview Veteran Grade Snapshot Demo Script
 * Simple demonstration of the veteran grade snapshot functionality
 * Run with: node veteranGradeSnapshotDemo.js
 */

// Mock localStorage for Node.js environment
if (typeof localStorage === 'undefined') {
  global.localStorage = {
    storage: {},
    getItem(key) {
      return this.storage[key] || null;
    },
    setItem(key, value) {
      this.storage[key] = value;
    },
    removeItem(key) {
      delete this.storage[key];
    },
    clear() {
      this.storage = {};
    }
  };
}

// Calculate grade based on score
function calculateGrade(score) {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'B+';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

// Determine status based on score
function calculateStatus(score) {
  if (score >= 95) return 'excellent';
  if (score >= 85) return 'very-good';
  if (score >= 75) return 'good';
  if (score >= 65) return 'fair';
  if (score >= 50) return 'needs-improvement';
  return 'poor';
}

// Generate sample metrics
function generateSampleMetrics() {
  const categories = [
    { id: 'performance', name: 'Performance Optimization' },
    { id: 'optimization', name: 'Code Optimization' },
    { id: 'code-quality', name: 'Code Quality Standards' },
    { id: 'deployment', name: 'Deployment Efficiency' },
    { id: 'collaboration', name: 'Team Collaboration' },
    { id: 'security', name: 'Security Best Practices' }
  ];

  return categories.map((category, index) => {
    const baseScore = 75 + Math.random() * 20;
    const score = Math.round(baseScore);

    return {
      id: `metric_${category.id}_${Date.now()}_${index}`,
      name: category.name,
      category: category.id,
      score,
      grade: calculateGrade(score),
      status: calculateStatus(score),
      timestamp: new Date(),
      details: `${category.name} score: ${score}/100`
    };
  });
}

// Create a veteran grade snapshot
function createVeteranGradeSnapshot(userId) {
  console.log('\n📊 Creating Veteran Grade Snapshot...\n');
  
  // Generate metrics
  const metrics = generateSampleMetrics();

  // Calculate overall statistics
  const totalScore = metrics.reduce((sum, m) => sum + m.score, 0);
  const averageScore = Math.round(totalScore / metrics.length);
  const overallGrade = calculateGrade(averageScore);
  const overallStatus = calculateStatus(averageScore);

  // Count status types
  const excellentCount = metrics.filter(m => 
    m.status === 'excellent' || m.status === 'very-good'
  ).length;
  const goodCount = metrics.filter(m => 
    m.status === 'good' || m.status === 'fair'
  ).length;
  const needsImprovementCount = metrics.filter(m => 
    m.status === 'needs-improvement' || m.status === 'poor'
  ).length;

  // Create snapshot
  const snapshot = {
    id: `snapshot_${Date.now()}`,
    userId: userId,
    experienceLevel: 'veteran',
    timestamp: new Date(),
    overallScore: averageScore,
    overallGrade,
    overallStatus,
    metrics,
    summary: {
      totalMetrics: metrics.length,
      excellentCount,
      goodCount,
      needsImprovementCount,
      averageScore
    },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      version: '1.0.0',
      source: 'demo'
    }
  };

  return snapshot;
}

// Display snapshot results
function displaySnapshot(snapshot) {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('           🏆 VETERAN GRADE SNAPSHOT REPORT 🏆            ');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log(`User ID:          ${snapshot.userId}`);
  console.log(`Experience Level: ${snapshot.experienceLevel.toUpperCase()}`);
  console.log(`Timestamp:        ${snapshot.timestamp.toLocaleString()}\n`);
  
  console.log('───────────────────────────────────────────────────────────');
  console.log('                    OVERALL PERFORMANCE                    ');
  console.log('───────────────────────────────────────────────────────────\n');
  
  console.log(`  Overall Grade:  ${snapshot.overallGrade}`);
  console.log(`  Overall Score:  ${snapshot.overallScore}/100`);
  console.log(`  Status:         ${snapshot.overallStatus.replace('-', ' ').toUpperCase()}\n`);
  
  console.log('───────────────────────────────────────────────────────────');
  console.log('                    METRICS BREAKDOWN                      ');
  console.log('───────────────────────────────────────────────────────────\n');
  
  snapshot.metrics.forEach((metric, index) => {
    console.log(`${index + 1}. ${metric.name}`);
    console.log(`   Grade: ${metric.grade} | Score: ${metric.score}/100 | Status: ${metric.status}`);
    console.log(`   ${metric.details}\n`);
  });
  
  console.log('───────────────────────────────────────────────────────────');
  console.log('                   SUMMARY STATISTICS                      ');
  console.log('───────────────────────────────────────────────────────────\n');
  
  console.log(`  Total Metrics:           ${snapshot.summary.totalMetrics}`);
  console.log(`  Excellent/Very Good:     ${snapshot.summary.excellentCount}`);
  console.log(`  Good/Fair:               ${snapshot.summary.goodCount}`);
  console.log(`  Needs Improvement:       ${snapshot.summary.needsImprovementCount}`);
  console.log(`  Average Score:           ${snapshot.summary.averageScore}/100\n`);
  
  console.log('═══════════════════════════════════════════════════════════\n');
}

// Main execution
function main() {
  console.log('\n🚀 FlashFusion Veteran Grade Snapshot Demo\n');
  
  // Create snapshot for a test user
  const userId = 'veteran-user-001';
  const snapshot = createVeteranGradeSnapshot(userId);
  
  // Display the results
  displaySnapshot(snapshot);
  
  // Show JSON export option
  console.log('💾 Snapshot Data (JSON):');
  console.log('─────────────────────────────────────────────────────────────');
  console.log(JSON.stringify(snapshot, null, 2).substring(0, 500) + '...\n');
  
  console.log('✅ Demo completed successfully!');
  console.log('📝 The snapshot has been generated and can be exported as JSON.');
  console.log('🔄 In production, this would be saved to localStorage or a database.\n');
}

// Run the demo
main();
