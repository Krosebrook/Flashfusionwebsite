#!/usr/bin/env node

/**
 * Simple script to test analytics endpoints
 */

async function testAnalyticsEndpoints() {
  console.log('🧪 Testing analytics endpoints...\n');
  
  // Test health endpoint
  try {
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:5173/api/health');
    
    if (healthResponse.ok) {
      const data = await healthResponse.json();
      console.log('✅ Health endpoint working:', data);
    } else {
      console.log('❌ Health endpoint failed:', healthResponse.status);
    }
  } catch (error) {
    console.log('❌ Health endpoint error:', error.message);
  }
  
  console.log();
  
  // Test analytics track endpoint
  try {
    console.log('2. Testing analytics track endpoint...');
    const trackResponse = await fetch('http://localhost:5173/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event: 'test_event',
        properties: {
          category: 'test',
          source: 'validation_script'
        },
        timestamp: Date.now()
      })
    });
    
    if (trackResponse.ok) {
      const data = await trackResponse.json();
      console.log('✅ Analytics track endpoint working:', data);
    } else {
      console.log('❌ Analytics track endpoint failed:', trackResponse.status);
    }
  } catch (error) {
    console.log('❌ Analytics track endpoint error:', error.message);
  }
  
  console.log();
  
  // Test analytics batch endpoint
  try {
    console.log('3. Testing analytics batch endpoint...');
    const batchResponse = await fetch('http://localhost:5173/api/analytics/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        events: [
          {
            event: 'test_batch_1',
            properties: { category: 'test' },
            timestamp: Date.now()
          },
          {
            event: 'test_batch_2',
            properties: { category: 'test' },
            timestamp: Date.now()
          }
        ]
      })
    });
    
    if (batchResponse.ok) {
      const data = await batchResponse.json();
      console.log('✅ Analytics batch endpoint working:', data);
    } else {
      console.log('❌ Analytics batch endpoint failed:', batchResponse.status);
    }
  } catch (error) {
    console.log('❌ Analytics batch endpoint error:', error.message);
  }
  
  console.log('\n🎉 Analytics endpoint testing complete!');
}

// Run if called directly
if (require.main === module) {
  testAnalyticsEndpoints().catch(console.error);
}

module.exports = { testAnalyticsEndpoints };