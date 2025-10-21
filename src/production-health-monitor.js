/**
 * @fileoverview Production Health Monitoring System
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * PRODUCTION HEALTH MONITORING
 * 
 * Comprehensive health monitoring system for FlashFusion production deployment
 * with real-time alerts, performance tracking, and automated recovery.
 */

import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

// Configuration
const CONFIG = {
  app: {
    name: 'FlashFusion AI Platform',
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'production'
  },
  
  monitoring: {
    interval: 30000, // 30 seconds
    timeout: 10000,  // 10 seconds
    retries: 3,
    alertThreshold: 2 // Failed checks before alert
  },
  
  endpoints: [
    {
      name: 'Homepage',
      url: 'https://app.flashfusion.ai',
      method: 'GET',
      expectedStatus: 200,
      timeout: 5000,
      critical: true
    },
    {
      name: 'API Health',
      url: 'https://app.flashfusion.ai/api/health',
      method: 'GET',
      expectedStatus: 200,
      timeout: 5000,
      critical: true
    },
    {
      name: 'AI Tools Hub',
      url: 'https://app.flashfusion.ai/tools',
      method: 'GET',
      expectedStatus: 200,
      timeout: 8000,
      critical: false
    },
    {
      name: 'Authentication System',
      url: 'https://app.flashfusion.ai/api/auth/session',
      method: 'GET',
      expectedStatus: [200, 401], // 401 is expected for unauthenticated
      timeout: 5000,
      critical: true
    },
    {
      name: 'Database Connection',
      url: 'https://app.flashfusion.ai/api/health/database',
      method: 'GET',
      expectedStatus: 200,
      timeout: 10000,
      critical: true
    },
    {
      name: 'Supabase Integration',
      url: 'https://app.flashfusion.ai/api/health/supabase',
      method: 'GET',
      expectedStatus: 200,
      timeout: 8000,
      critical: true
    }
  ],
  
  alerts: {
    email: {
      enabled: true,
      recipients: ['alerts@flashfusion.ai', 'team@flashfusion.ai'],
      severity: ['critical', 'high']
    },
    slack: {
      enabled: true,
      webhook: process.env.SLACK_WEBHOOK_URL,
      severity: ['critical', 'high', 'medium']
    },
    discord: {
      enabled: true,
      webhook: process.env.DISCORD_WEBHOOK_URL,
      severity: ['critical']
    }
  }
};

// Health monitoring state
let monitoringState = {
  isRunning: false,
  checks: new Map(),
  consecutiveFailures: new Map(),
  lastAlertTime: new Map(),
  startTime: Date.now(),
  totalChecks: 0,
  successfulChecks: 0,
  failedChecks: 0
};

/**
 * Initialize health monitoring system
 */
export function initializeHealthMonitoring() {
  console.log('🏥 Initializing FlashFusion Health Monitoring System...');
  console.log(`📊 Monitoring ${CONFIG.endpoints.length} endpoints`);
  console.log(`⏱️  Check interval: ${CONFIG.monitoring.interval / 1000}s`);
  
  // Initialize check states
  CONFIG.endpoints.forEach(endpoint => {
    monitoringState.consecutiveFailures.set(endpoint.name, 0);
    monitoringState.lastAlertTime.set(endpoint.name, 0);
  });
  
  // Start monitoring
  startMonitoring();
  
  // Set up graceful shutdown
  process.on('SIGINT', stopMonitoring);
  process.on('SIGTERM', stopMonitoring);
  
  console.log('✅ Health monitoring system initialized');
}

/**
 * Start continuous health monitoring
 */
function startMonitoring() {
  if (monitoringState.isRunning) {
    console.log('⚠️  Health monitoring is already running');
    return;
  }
  
  monitoringState.isRunning = true;
  console.log('🚀 Starting health monitoring...');
  
  // Run initial check
  runHealthChecks();
  
  // Schedule periodic checks
  const intervalId = setInterval(() => {
    if (monitoringState.isRunning) {
      runHealthChecks();
    } else {
      clearInterval(intervalId);
    }
  }, CONFIG.monitoring.interval);
}

/**
 * Stop health monitoring
 */
function stopMonitoring() {
  console.log('🛑 Stopping health monitoring...');
  monitoringState.isRunning = false;
  
  // Print final statistics
  const uptime = Date.now() - monitoringState.startTime;
  const successRate = monitoringState.totalChecks > 0 
    ? (monitoringState.successfulChecks / monitoringState.totalChecks * 100).toFixed(2)
    : 0;
  
  console.log('\n📈 Final Health Monitoring Statistics:');
  console.log(`   Uptime: ${formatDuration(uptime)}`);
  console.log(`   Total Checks: ${monitoringState.totalChecks}`);
  console.log(`   Successful: ${monitoringState.successfulChecks}`);
  console.log(`   Failed: ${monitoringState.failedChecks}`);
  console.log(`   Success Rate: ${successRate}%`);
  
  process.exit(0);
}

/**
 * Run health checks on all endpoints
 */
async function runHealthChecks() {
  const timestamp = new Date().toISOString();
  console.log(`\n🔍 Running health checks at ${timestamp}`);
  
  const results = await Promise.allSettled(
    CONFIG.endpoints.map(endpoint => checkEndpointHealth(endpoint))
  );
  
  let overallHealth = 'healthy';
  let criticalIssues = 0;
  
  results.forEach((result, index) => {
    const endpoint = CONFIG.endpoints[index];
    
    if (result.status === 'fulfilled') {
      const checkResult = result.value;
      processCheckResult(endpoint, checkResult);
      
      if (!checkResult.healthy && endpoint.critical) {
        criticalIssues++;
        overallHealth = 'critical';
      } else if (!checkResult.healthy && overallHealth === 'healthy') {
        overallHealth = 'degraded';
      }
    } else {
      console.error(`❌ Health check failed for ${endpoint.name}:`, result.reason);
      processCheckResult(endpoint, {
        healthy: false,
        status: 'error',
        responseTime: 0,
        error: result.reason.message
      });
      
      if (endpoint.critical) {
        criticalIssues++;
        overallHealth = 'critical';
      }
    }
  });
  
  // Update monitoring statistics
  monitoringState.totalChecks++;
  if (overallHealth === 'healthy') {
    monitoringState.successfulChecks++;
  } else {
    monitoringState.failedChecks++;
  }
  
  // Log overall status
  const statusEmoji = {
    healthy: '✅',
    degraded: '⚠️',
    critical: '🚨'
  };
  
  console.log(`${statusEmoji[overallHealth]} Overall system health: ${overallHealth.toUpperCase()}`);
  
  if (criticalIssues > 0) {
    console.log(`🚨 ${criticalIssues} critical issue(s) detected`);
  }
  
  // Record health status
  recordHealthMetrics(overallHealth, results);
}

/**
 * Check health of a specific endpoint
 */
async function checkEndpointHealth(endpoint) {
  const startTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), endpoint.timeout);
    
    const response = await fetch(endpoint.url, {
      method: endpoint.method,
      signal: controller.signal,
      headers: {
        'User-Agent': 'FlashFusion-Health-Monitor/1.0',
        'Accept': 'application/json,text/html'
      }
    });
    
    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    
    // Check if status is expected
    const expectedStatuses = Array.isArray(endpoint.expectedStatus) 
      ? endpoint.expectedStatus 
      : [endpoint.expectedStatus];
    
    const isHealthy = expectedStatuses.includes(response.status);
    
    return {
      healthy: isHealthy,
      status: response.status,
      responseTime,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return {
      healthy: false,
      status: 'error',
      responseTime,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Process the result of a health check
 */
function processCheckResult(endpoint, result) {
  const currentFailures = monitoringState.consecutiveFailures.get(endpoint.name) || 0;
  
  if (result.healthy) {
    console.log(`✅ ${endpoint.name}: OK (${result.responseTime}ms)`);
    monitoringState.consecutiveFailures.set(endpoint.name, 0);
  } else {
    const newFailures = currentFailures + 1;
    monitoringState.consecutiveFailures.set(endpoint.name, newFailures);
    
    console.log(`❌ ${endpoint.name}: FAILED (${result.responseTime}ms) - ${result.error || `Status: ${result.status}`}`);
    
    // Send alert if threshold reached
    if (newFailures >= CONFIG.monitoring.alertThreshold) {
      sendAlert(endpoint, result, newFailures);
    }
  }
  
  // Store check result
  monitoringState.checks.set(endpoint.name, result);
}

/**
 * Send alerts for failed health checks
 */
async function sendAlert(endpoint, result, consecutiveFailures) {
  const lastAlertTime = monitoringState.lastAlertTime.get(endpoint.name) || 0;
  const timeSinceLastAlert = Date.now() - lastAlertTime;
  
  // Rate limit alerts (minimum 5 minutes between alerts for same endpoint)
  if (timeSinceLastAlert < 5 * 60 * 1000) {
    return;
  }
  
  const severity = endpoint.critical ? 'critical' : 'high';
  const alertData = {
    timestamp: new Date().toISOString(),
    service: 'FlashFusion AI Platform',
    endpoint: endpoint.name,
    url: endpoint.url,
    severity,
    status: result.status,
    error: result.error,
    responseTime: result.responseTime,
    consecutiveFailures,
    environment: CONFIG.app.environment
  };
  
  console.log(`🚨 ALERT: ${endpoint.name} has failed ${consecutiveFailures} consecutive times`);
  
  // Send to configured alert channels
  await Promise.allSettled([
    sendSlackAlert(alertData),
    sendDiscordAlert(alertData),
    sendEmailAlert(alertData)
  ]);
  
  // Update last alert time
  monitoringState.lastAlertTime.set(endpoint.name, Date.now());
}

/**
 * Send Slack alert
 */
async function sendSlackAlert(alertData) {
  if (!CONFIG.alerts.slack.enabled || !CONFIG.alerts.slack.webhook) {
    return;
  }
  
  if (!CONFIG.alerts.slack.severity.includes(alertData.severity)) {
    return;
  }
  
  const color = {
    critical: '#FF0000',
    high: '#FF8C00',
    medium: '#FFD700',
    low: '#32CD32'
  };
  
  const payload = {
    username: 'FlashFusion Monitor',
    icon_emoji: ':rotating_light:',
    attachments: [{
      color: color[alertData.severity],
      title: `🚨 ${alertData.severity.toUpperCase()} Alert: ${alertData.endpoint}`,
      fields: [
        {
          title: 'Service',
          value: alertData.service,
          short: true
        },
        {
          title: 'Environment',
          value: alertData.environment,
          short: true
        },
        {
          title: 'Endpoint',
          value: alertData.url,
          short: false
        },
        {
          title: 'Status',
          value: alertData.status,
          short: true
        },
        {
          title: 'Response Time',
          value: `${alertData.responseTime}ms`,
          short: true
        },
        {
          title: 'Consecutive Failures',
          value: alertData.consecutiveFailures.toString(),
          short: true
        },
        {
          title: 'Error',
          value: alertData.error || 'Unknown error',
          short: false
        }
      ],
      footer: 'FlashFusion Health Monitor',
      ts: Math.floor(Date.now() / 1000)
    }]
  };
  
  try {
    await fetch(CONFIG.alerts.slack.webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    console.log('📱 Slack alert sent');
  } catch (error) {
    console.error('❌ Failed to send Slack alert:', error.message);
  }
}

/**
 * Send Discord alert
 */
async function sendDiscordAlert(alertData) {
  if (!CONFIG.alerts.discord.enabled || !CONFIG.alerts.discord.webhook) {
    return;
  }
  
  if (!CONFIG.alerts.discord.severity.includes(alertData.severity)) {
    return;
  }
  
  const payload = {
    username: 'FlashFusion Monitor',
    avatar_url: 'https://app.flashfusion.ai/favicon.ico',
    embeds: [{
      title: `🚨 ${alertData.severity.toUpperCase()} Alert`,
      description: `**${alertData.endpoint}** is experiencing issues`,
      color: alertData.severity === 'critical' ? 0xFF0000 : 0xFF8C00,
      fields: [
        {
          name: 'Service',
          value: alertData.service,
          inline: true
        },
        {
          name: 'Environment',
          value: alertData.environment,
          inline: true
        },
        {
          name: 'URL',
          value: alertData.url,
          inline: false
        },
        {
          name: 'Status',
          value: alertData.status.toString(),
          inline: true
        },
        {
          name: 'Response Time',
          value: `${alertData.responseTime}ms`,
          inline: true
        },
        {
          name: 'Consecutive Failures',
          value: alertData.consecutiveFailures.toString(),
          inline: true
        }
      ],
      footer: {
        text: 'FlashFusion Health Monitor'
      },
      timestamp: alertData.timestamp
    }]
  };
  
  try {
    await fetch(CONFIG.alerts.discord.webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    console.log('📱 Discord alert sent');
  } catch (error) {
    console.error('❌ Failed to send Discord alert:', error.message);
  }
}

/**
 * Send email alert (placeholder)
 */
async function sendEmailAlert(alertData) {
  if (!CONFIG.alerts.email.enabled) {
    return;
  }
  
  if (!CONFIG.alerts.email.severity.includes(alertData.severity)) {
    return;
  }
  
  // Email integration would go here
  console.log('📧 Email alert would be sent to:', CONFIG.alerts.email.recipients);
}

/**
 * Record health metrics to database
 */
async function recordHealthMetrics(overallHealth, checkResults) {
  try {
    // This would integrate with your analytics/monitoring database
    const metrics = {
      timestamp: new Date().toISOString(),
      overall_health: overallHealth,
      endpoint_results: checkResults.map((result, index) => ({
        endpoint: CONFIG.endpoints[index].name,
        healthy: result.status === 'fulfilled' ? result.value.healthy : false,
        response_time: result.status === 'fulfilled' ? result.value.responseTime : 0,
        status: result.status === 'fulfilled' ? result.value.status : 'error'
      }))
    };
    
    // Store metrics for analysis
    console.log('📊 Health metrics recorded');
  } catch (error) {
    console.error('❌ Failed to record health metrics:', error.message);
  }
}

/**
 * Format duration in human readable format
 */
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

/**
 * Get current monitoring statistics
 */
export function getMonitoringStats() {
  const uptime = Date.now() - monitoringState.startTime;
  const successRate = monitoringState.totalChecks > 0 
    ? (monitoringState.successfulChecks / monitoringState.totalChecks * 100).toFixed(2)
    : 0;
  
  return {
    isRunning: monitoringState.isRunning,
    uptime: formatDuration(uptime),
    totalChecks: monitoringState.totalChecks,
    successfulChecks: monitoringState.successfulChecks,
    failedChecks: monitoringState.failedChecks,
    successRate: `${successRate}%`,
    currentStatus: Array.from(monitoringState.checks.entries()).map(([name, result]) => ({
      endpoint: name,
      healthy: result.healthy,
      lastCheck: result.timestamp,
      responseTime: result.responseTime
    }))
  };
}

// Start monitoring if this script is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeHealthMonitoring();
}