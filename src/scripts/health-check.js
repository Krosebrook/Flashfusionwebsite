#!/usr/bin/env node

import fetch from 'node-fetch';

const BASE_URL = process.env.HEALTH_CHECK_URL || 'http://localhost:4173';

const endpoints = [
  '/',
  '/features',
  '/pricing',
  '/demo',
  '/about',
  '/contact',
];

const checkEndpoint = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    const status = response.status;
    const statusText = response.statusText;
    
    if (status === 200) {
      console.log(`✅ ${endpoint} - ${status} ${statusText}`);
      return true;
    } else {
      console.log(`❌ ${endpoint} - ${status} ${statusText}`);
      return false;
    }
  } catch (error) {
    console.log(`💥 ${endpoint} - Error: ${error.message}`);
    return false;
  }
};

const runHealthCheck = async () => {
  console.log(`🏥 Health Check Starting - Base URL: ${BASE_URL}`);
  console.log('=' .repeat(50));
  
  const results = await Promise.all(
    endpoints.map(endpoint => checkEndpoint(endpoint))
  );
  
  const passed = results.filter(Boolean).length;
  const total = results.length;
  
  console.log('=' .repeat(50));
  console.log(`📊 Health Check Complete: ${passed}/${total} endpoints healthy`);
  
  if (passed === total) {
    console.log('🎉 All endpoints are healthy!');
    process.exit(0);
  } else {
    console.log('⚠️  Some endpoints are not responding correctly');
    process.exit(1);
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runHealthCheck();
}

export default runHealthCheck;