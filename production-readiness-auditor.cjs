#!/usr/bin/env node

/**
 * Production Readiness Auditor
 * 
 * A strict auditor that evaluates software readiness for:
 * 1) Employee/Internal Use
 * 2) Public Beta
 * 3) Production-Grade Launch
 * 
 * Evaluates based on evidence only. If something cannot be verified,
 * it is marked as "UNVERIFIED — ASSUME MISSING."
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');
const http = require('http');
const url = require('url');

class ProductionReadinessAuditor {
  constructor(options = {}) {
    this.repoPath = options.repoPath || process.cwd();
    this.deploymentUrl = options.deploymentUrl || null;
    this.intendedAudience = options.intendedAudience || 'Both'; // Employee / Public / Both
    this.handlesPII = options.handlesPII || false;
    this.handlesPayments = options.handlesPayments || false;
    this.handlesSecrets = options.handlesSecrets || true;
    
    this.scores = {
      identityAccess: 0,
      secretsConfig: 0,
      dataSafety: 0,
      reliability: 0,
      observability: 0,
      cicd: 0,
      securityHardening: 0,
      testing: 0,
      performance: 0,
      documentation: 0
    };
    
    this.findings = {
      identityAccess: [],
      secretsConfig: [],
      dataSafety: [],
      reliability: [],
      observability: [],
      cicd: [],
      securityHardening: [],
      testing: [],
      performance: [],
      documentation: []
    };
    
    this.criticalBlockers = [];
    this.publicLaunchBlockers = [];
    this.improvements = [];
    this.runtimeChecks = {};
  }

  async runAudit() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║     PRODUCTION READINESS AUDITOR - STRICT MODE            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    
    console.log(`Repository: ${this.repoPath}`);
    console.log(`Deployment URL: ${this.deploymentUrl || 'Not provided'}`);
    console.log(`Intended Audience: ${this.intendedAudience}`);
    console.log(`Handles PII: ${this.handlesPII ? 'YES' : 'NO'}`);
    console.log(`Handles Payments: ${this.handlesPayments ? 'YES' : 'NO'}`);
    console.log(`Handles Secrets: ${this.handlesSecrets ? 'YES' : 'NO'}\n`);
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('PHASE 1 — REPO & DEPLOYMENT AUDIT');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    await this.auditIdentityAccess();
    await this.auditSecretsConfig();
    await this.auditDataSafety();
    await this.auditReliability();
    await this.auditObservability();
    await this.auditCICD();
    await this.auditSecurityHardening();
    await this.auditTesting();
    await this.auditPerformance();
    await this.auditDocumentation();
    
    if (this.deploymentUrl) {
      console.log('\n═══════════════════════════════════════════════════════════');
      console.log('PHASE 2 — RUNTIME CHECK');
      console.log('═══════════════════════════════════════════════════════════\n');
      await this.performRuntimeChecks();
    }
    
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('PHASE 3 — READINESS CLASSIFICATION');
    console.log('═══════════════════════════════════════════════════════════\n');
    this.classifyReadiness();
    
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('PHASE 4 — EXECUTIVE SUMMARY');
    console.log('═══════════════════════════════════════════════════════════\n');
    this.generateExecutiveSummary();
    
    this.generateReport();
    this.saveReport();
  }

  // ========================================================================
  // PHASE 1: REPO & DEPLOYMENT AUDIT
  // ========================================================================

  async auditIdentityAccess() {
    console.log('🔐 [1/10] Auditing Identity & Access Control...');
    let score = 0;
    const findings = [];
    
    // Check for authentication implementation
    const authFiles = this.findFiles(['auth', 'login', 'signin', 'authentication']);
    if (authFiles.length > 0) {
      score += 1;
      findings.push(`✓ Authentication files found: ${authFiles.length} files`);
    } else {
      findings.push(`✗ No authentication files detected`);
      this.criticalBlockers.push('Authentication not implemented');
    }
    
    // Check for role-based access control
    const rbacFiles = this.findFiles(['role', 'permission', 'rbac', 'access-control']);
    if (rbacFiles.length > 0) {
      score += 1;
      findings.push(`✓ RBAC files found: ${rbacFiles.length} files`);
    } else {
      findings.push(`✗ No RBAC implementation detected`);
      this.publicLaunchBlockers.push('Role-based access control not implemented');
    }
    
    // Check for middleware/guards
    const guardFiles = this.findFiles(['middleware', 'guard', 'protected']);
    if (guardFiles.length > 0) {
      score += 1;
      findings.push(`✓ Protection middleware found: ${guardFiles.length} files`);
    } else {
      findings.push(`✗ No route protection middleware detected`);
    }
    
    // Check for hardcoded credentials
    const hardcodedCreds = this.scanForHardcodedCredentials();
    if (hardcodedCreds.length === 0) {
      score += 2;
      findings.push(`✓ No hardcoded credentials detected`);
    } else {
      findings.push(`✗ CRITICAL: ${hardcodedCreds.length} potential hardcoded credentials found`);
      this.criticalBlockers.push(`Hardcoded credentials detected in ${hardcodedCreds.length} files`);
      hardcodedCreds.slice(0, 5).forEach(cred => {
        findings.push(`  ⚠ ${cred.file}: ${cred.pattern}`);
      });
    }
    
    this.scores.identityAccess = score;
    this.findings.identityAccess = findings;
    console.log(`   Score: ${score}/5\n`);
  }

  async auditSecretsConfig() {
    console.log('🔑 [2/10] Auditing Secrets & Configuration Hygiene...');
    let score = 0;
    const findings = [];
    
    // Check for .env.example
    if (this.fileExists('.env.example') || this.fileExists('.env.template')) {
      score += 1;
      findings.push(`✓ Environment template file exists`);
    } else {
      findings.push(`✗ No .env.example or .env.template found`);
      this.improvements.push('Create .env.example file documenting all required environment variables');
    }
    
    // Check .gitignore for secrets
    const gitignoreContent = this.readFileContent('.gitignore');
    if (gitignoreContent) {
      const secretPatterns = ['.env', '*.key', '*.pem', 'secrets'];
      const coveredPatterns = secretPatterns.filter(p => gitignoreContent.includes(p));
      if (coveredPatterns.length >= 3) {
        score += 1;
        findings.push(`✓ .gitignore covers ${coveredPatterns.length}/4 secret patterns`);
      } else {
        findings.push(`✗ .gitignore incomplete: only ${coveredPatterns.length}/4 secret patterns`);
      }
    }
    
    // Check for committed secrets
    const committedSecrets = this.scanForCommittedSecrets();
    if (committedSecrets.length === 0) {
      score += 2;
      findings.push(`✓ No committed secrets detected`);
    } else {
      findings.push(`✗ CRITICAL: ${committedSecrets.length} potential secrets committed`);
      this.criticalBlockers.push(`Secrets found in repository: ${committedSecrets.length} instances`);
      committedSecrets.slice(0, 5).forEach(secret => {
        findings.push(`  ⚠ ${secret.file}: ${secret.type}`);
      });
    }
    
    // Check for configuration documentation
    const configDocs = this.findFiles(['config', 'configuration', 'setup', 'environment']);
    const hasConfigDoc = configDocs.some(f => f.toLowerCase().includes('readme') || f.toLowerCase().includes('.md'));
    if (hasConfigDoc) {
      score += 1;
      findings.push(`✓ Configuration documentation found`);
    } else {
      findings.push(`✗ No configuration documentation detected`);
      this.improvements.push('Document configuration requirements in README or separate config guide');
    }
    
    this.scores.secretsConfig = score;
    this.findings.secretsConfig = findings;
    console.log(`   Score: ${score}/5\n`);
  }

  async auditDataSafety() {
    console.log('💾 [3/10] Auditing Data Safety & Privacy...');
    let score = 0;
    const findings = [];
    
    // Check for database configuration
    const dbFiles = this.findFiles(['database', 'db', 'schema', 'migration']);
    if (dbFiles.length > 0) {
      score += 1;
      findings.push(`✓ Database files found: ${dbFiles.length} files`);
    } else {
      findings.push(`⚠ No database files detected - data storage UNKNOWN`);
      if (this.handlesPII) {
        this.criticalBlockers.push('Data storage mechanism unknown but handles PII');
      }
    }
    
    // Check for encryption mentions
    const encryptionFiles = this.searchInFiles(['encrypt', 'crypto', 'hash', 'bcrypt', 'argon']);
    if (encryptionFiles.length > 0) {
      score += 1;
      findings.push(`✓ Encryption implementation detected in ${encryptionFiles.length} files`);
    } else {
      findings.push(`✗ No encryption implementation detected`);
      if (this.handlesPII || this.handlesPayments) {
        this.criticalBlockers.push('No encryption for sensitive data (PII/Payments)');
      }
    }
    
    // Check for backup strategy
    const backupFiles = this.findFiles(['backup', 'restore', 'snapshot']);
    if (backupFiles.length > 0) {
      score += 1;
      findings.push(`✓ Backup strategy files found`);
    } else {
      findings.push(`✗ UNVERIFIED: No backup strategy detected — ASSUME MISSING`);
      this.publicLaunchBlockers.push('No documented backup strategy');
    }
    
    // Check for data retention policy
    const retentionDocs = this.searchInFiles(['retention', 'data policy', 'privacy policy', 'gdpr']);
    if (retentionDocs.length > 0) {
      score += 1;
      findings.push(`✓ Data retention/privacy policy mentioned`);
    } else {
      findings.push(`✗ UNVERIFIED: No data retention policy — ASSUME MISSING`);
      if (this.handlesPII) {
        this.publicLaunchBlockers.push('No data retention policy (required for PII)');
      }
    }
    
    // GDPR/Privacy compliance check
    if (this.handlesPII) {
      const privacyFiles = this.searchInFiles(['privacy', 'gdpr', 'ccpa', 'data protection']);
      if (privacyFiles.length > 0) {
        score += 1;
        findings.push(`✓ Privacy compliance mentions found`);
      } else {
        findings.push(`✗ CRITICAL: Handles PII but no privacy compliance detected`);
        this.criticalBlockers.push('No GDPR/privacy compliance for PII handling');
      }
    } else {
      findings.push(`ℹ No PII handling — privacy compliance not required`);
    }
    
    this.scores.dataSafety = score;
    this.findings.dataSafety = findings;
    console.log(`   Score: ${score}/5\n`);
  }

  async auditReliability() {
    console.log('🔄 [4/10] Auditing Reliability & Error Handling...');
    let score = 0;
    const findings = [];
    
    // Check for error handling
    const errorHandling = this.searchInFiles(['try', 'catch', 'error', 'exception']);
    if (errorHandling.length > 10) {
      score += 1;
      findings.push(`✓ Error handling detected in ${errorHandling.length} files`);
    } else {
      findings.push(`✗ Limited error handling: only ${errorHandling.length} files`);
      this.improvements.push('Implement comprehensive error handling throughout codebase');
    }
    
    // Check for timeout implementations
    const timeouts = this.searchInFiles(['timeout', 'setTimeout', 'deadline', 'abort']);
    if (timeouts.length > 0) {
      score += 1;
      findings.push(`✓ Timeout handling detected in ${timeouts.length} files`);
    } else {
      findings.push(`✗ No timeout handling detected`);
      this.publicLaunchBlockers.push('No timeout handling for external requests');
    }
    
    // Check for retry logic
    const retries = this.searchInFiles(['retry', 'retries', 'exponential backoff', 'circuit breaker']);
    if (retries.length > 0) {
      score += 1;
      findings.push(`✓ Retry logic detected in ${retries.length} files`);
    } else {
      findings.push(`✗ No retry logic detected`);
      this.improvements.push('Implement retry logic for transient failures');
    }
    
    // Check for error boundaries (React)
    const errorBoundaries = this.findFiles(['ErrorBoundary', 'error-boundary']);
    if (errorBoundaries.length > 0) {
      score += 1;
      findings.push(`✓ Error boundaries found: ${errorBoundaries.length} files`);
    } else {
      findings.push(`✗ No error boundaries detected`);
      this.improvements.push('Implement React error boundaries');
    }
    
    // Check for graceful degradation
    const fallbacks = this.searchInFiles(['fallback', 'default', 'graceful', 'degradation']);
    if (fallbacks.length > 5) {
      score += 1;
      findings.push(`✓ Graceful degradation patterns detected`);
    } else {
      findings.push(`✗ Limited graceful degradation: ${fallbacks.length} instances`);
    }
    
    this.scores.reliability = score;
    this.findings.reliability = findings;
    console.log(`   Score: ${score}/5\n`);
  }

  async auditObservability() {
    console.log('📊 [5/10] Auditing Observability & Monitoring...');
    let score = 0;
    const findings = [];
    
    // Check for logging
    const logging = this.searchInFiles(['console.log', 'logger', 'log.', 'winston', 'pino']);
    if (logging.length > 10) {
      score += 1;
      findings.push(`✓ Logging detected in ${logging.length} files`);
    } else {
      findings.push(`✗ Limited logging: only ${logging.length} instances`);
      this.improvements.push('Implement comprehensive logging strategy');
    }
    
    // Check for structured logging
    const structuredLog = this.searchInFiles(['JSON.stringify', 'logger.info', 'logger.error', 'structured']);
    if (structuredLog.length > 5) {
      score += 1;
      findings.push(`✓ Structured logging patterns detected`);
    } else {
      findings.push(`✗ No structured logging detected`);
      this.publicLaunchBlockers.push('No structured logging for production debugging');
    }
    
    // Check for error tracking
    const errorTracking = this.searchInFiles(['sentry', 'rollbar', 'bugsnag', 'error tracking', 'airbrake']);
    if (errorTracking.length > 0) {
      score += 1;
      findings.push(`✓ Error tracking service detected`);
    } else {
      findings.push(`✗ UNVERIFIED: No error tracking service — ASSUME MISSING`);
      this.publicLaunchBlockers.push('No error tracking service configured');
    }
    
    // Check for metrics
    const metrics = this.searchInFiles(['metrics', 'prometheus', 'datadog', 'newrelic', 'cloudwatch']);
    if (metrics.length > 0) {
      score += 1;
      findings.push(`✓ Metrics collection detected`);
    } else {
      findings.push(`✗ UNVERIFIED: No metrics collection — ASSUME MISSING`);
      this.improvements.push('Implement metrics collection for performance monitoring');
    }
    
    // Check for health checks
    const health = this.findFiles(['health', 'healthcheck', 'ping', 'status']);
    if (health.length > 0) {
      score += 1;
      findings.push(`✓ Health check endpoints detected`);
    } else {
      findings.push(`✗ No health check endpoints detected`);
      this.publicLaunchBlockers.push('No health check endpoints for monitoring');
    }
    
    this.scores.observability = score;
    this.findings.observability = findings;
    console.log(`   Score: ${score}/5\n`);
  }

  async auditCICD() {
    console.log('🚀 [6/10] Auditing CI/CD & Deployment Safety...');
    let score = 0;
    const findings = [];
    
    // Check for CI configuration
    const ciFiles = [
      '.github/workflows',
      '.gitlab-ci.yml',
      '.circleci',
      'Jenkinsfile',
      '.travis.yml',
      'azure-pipelines.yml'
    ];
    const ciExists = ciFiles.some(f => this.fileExists(f));
    if (ciExists) {
      score += 1;
      findings.push(`✓ CI configuration found`);
      
      // Check GitHub Actions workflows
      const workflows = this.findFiles(['.github/workflows']);
      if (workflows.length > 0) {
        findings.push(`  Found ${workflows.length} workflow(s)`);
      }
    } else {
      findings.push(`✗ No CI configuration detected`);
      this.criticalBlockers.push('No CI/CD pipeline configured');
    }
    
    // Check for tests in CI
    if (ciExists) {
      const ciContent = this.readCIConfig();
      if (ciContent && (ciContent.includes('test') || ciContent.includes('npm test'))) {
        score += 1;
        findings.push(`✓ Tests run in CI`);
      } else {
        findings.push(`✗ Tests not running in CI`);
        this.improvements.push('Add test execution to CI pipeline');
      }
      
      // Check for linting in CI
      if (ciContent && (ciContent.includes('lint') || ciContent.includes('eslint'))) {
        score += 1;
        findings.push(`✓ Linting in CI`);
      } else {
        findings.push(`✗ No linting in CI`);
        this.improvements.push('Add linting to CI pipeline');
      }
      
      // Check for build verification
      if (ciContent && ciContent.includes('build')) {
        score += 1;
        findings.push(`✓ Build verification in CI`);
      } else {
        findings.push(`✗ No build verification in CI`);
        this.improvements.push('Add build verification to CI pipeline');
      }
    }
    
    // Check for deployment configuration
    const deployFiles = this.findFiles(['deploy', 'deployment', 'docker', 'kubernetes', 'terraform']);
    if (deployFiles.length > 0) {
      score += 1;
      findings.push(`✓ Deployment configuration found: ${deployFiles.length} files`);
    } else {
      findings.push(`✗ UNVERIFIED: No deployment configuration — ASSUME MISSING`);
      this.publicLaunchBlockers.push('No documented deployment strategy');
    }
    
    this.scores.cicd = score;
    this.findings.cicd = findings;
    console.log(`   Score: ${score}/5\n`);
  }

  async auditSecurityHardening() {
    console.log('🛡️ [7/10] Auditing Security Hardening...');
    let score = 0;
    const findings = [];
    
    // Check for input validation
    const validation = this.searchInFiles(['validate', 'validation', 'sanitize', 'zod', 'yup', 'joi']);
    if (validation.length > 5) {
      score += 1;
      findings.push(`✓ Input validation detected in ${validation.length} files`);
    } else {
      findings.push(`✗ Limited input validation: ${validation.length} files`);
      this.criticalBlockers.push('Insufficient input validation (security risk)');
    }
    
    // Check for rate limiting
    const rateLimiting = this.searchInFiles(['rate-limit', 'ratelimit', 'throttle', 'limiter']);
    if (rateLimiting.length > 0) {
      score += 1;
      findings.push(`✓ Rate limiting detected`);
    } else {
      findings.push(`✗ No rate limiting detected`);
      this.publicLaunchBlockers.push('No rate limiting (DoS vulnerability)');
    }
    
    // Check for CORS configuration
    const cors = this.searchInFiles(['cors', 'Access-Control-Allow-Origin']);
    if (cors.length > 0) {
      score += 1;
      findings.push(`✓ CORS configuration detected`);
    } else {
      findings.push(`✗ No CORS configuration detected`);
      this.improvements.push('Configure CORS properly for API security');
    }
    
    // Check for security headers
    const securityHeaders = this.searchInFiles([
      'Content-Security-Policy',
      'X-Frame-Options',
      'X-Content-Type-Options',
      'Strict-Transport-Security'
    ]);
    if (securityHeaders.length > 2) {
      score += 1;
      findings.push(`✓ Security headers configured`);
    } else {
      findings.push(`✗ Security headers missing or incomplete`);
      this.publicLaunchBlockers.push('Missing security headers (CSP, X-Frame-Options, etc.)');
    }
    
    // Check for dependency scanning
    const depScan = this.searchInFiles(['npm audit', 'snyk', 'dependabot', 'renovate']);
    const hasDependabot = this.fileExists('.github/dependabot.yml');
    if (depScan.length > 0 || hasDependabot) {
      score += 1;
      findings.push(`✓ Dependency scanning configured`);
    } else {
      findings.push(`✗ No dependency scanning detected`);
      this.improvements.push('Enable Dependabot or similar dependency scanning');
    }
    
    this.scores.securityHardening = score;
    this.findings.securityHardening = findings;
    console.log(`   Score: ${score}/5\n`);
  }

  async auditTesting() {
    console.log('🧪 [8/10] Auditing Testing Coverage...');
    let score = 0;
    const findings = [];
    
    // Check for test files
    const testFiles = this.findFiles(['.test.', '.spec.', '__tests__', 'test/']);
    if (testFiles.length > 10) {
      score += 2;
      findings.push(`✓ Substantial test files: ${testFiles.length} files`);
    } else if (testFiles.length > 0) {
      score += 1;
      findings.push(`⚠ Limited test files: ${testFiles.length} files`);
      this.improvements.push('Increase test coverage significantly');
    } else {
      findings.push(`✗ CRITICAL: No test files detected`);
      this.criticalBlockers.push('No automated tests found');
    }
    
    // Check for test framework
    const packageJson = this.readPackageJson();
    const testFrameworks = ['jest', 'vitest', 'mocha', 'jasmine', 'ava'];
    const hasFramework = testFrameworks.some(fw => 
      packageJson?.devDependencies?.[fw] || packageJson?.dependencies?.[fw]
    );
    if (hasFramework) {
      score += 1;
      findings.push(`✓ Test framework configured`);
    } else {
      findings.push(`✗ No test framework detected`);
    }
    
    // Check for integration tests
    const integrationTests = this.findFiles(['integration', 'e2e', 'playwright', 'cypress']);
    if (integrationTests.length > 0) {
      score += 1;
      findings.push(`✓ Integration/E2E tests found: ${integrationTests.length} files`);
    } else {
      findings.push(`✗ No integration/E2E tests detected`);
      this.publicLaunchBlockers.push('No integration or E2E tests');
    }
    
    // Check for coverage configuration
    const coverageConfig = this.searchInFiles(['coverage', 'coverageThreshold', 'collectCoverage']);
    if (coverageConfig.length > 0) {
      score += 1;
      findings.push(`✓ Test coverage configuration detected`);
    } else {
      findings.push(`✗ No test coverage configuration`);
      this.improvements.push('Configure test coverage thresholds');
    }
    
    this.scores.testing = score;
    this.findings.testing = findings;
    console.log(`   Score: ${score}/5\n`);
  }

  async auditPerformance() {
    console.log('⚡ [9/10] Auditing Performance & Cost Controls...');
    let score = 0;
    const findings = [];
    
    // Check for caching
    const caching = this.searchInFiles(['cache', 'Cache-Control', 'redis', 'memcached']);
    if (caching.length > 5) {
      score += 1;
      findings.push(`✓ Caching implementation detected in ${caching.length} files`);
    } else {
      findings.push(`✗ Limited or no caching detected`);
      this.improvements.push('Implement caching strategy for performance');
    }
    
    // Check for pagination
    const pagination = this.searchInFiles(['pagination', 'limit', 'offset', 'cursor', 'page']);
    if (pagination.length > 3) {
      score += 1;
      findings.push(`✓ Pagination detected in ${pagination.length} files`);
    } else {
      findings.push(`✗ Limited pagination implementation`);
      this.improvements.push('Implement pagination for large data sets');
    }
    
    // Check for lazy loading
    const lazyLoading = this.searchInFiles(['lazy', 'Suspense', 'dynamic import', 'code splitting']);
    if (lazyLoading.length > 0) {
      score += 1;
      findings.push(`✓ Lazy loading detected`);
    } else {
      findings.push(`✗ No lazy loading detected`);
      this.improvements.push('Implement lazy loading for better performance');
    }
    
    // Check for performance monitoring
    const perfMonitoring = this.searchInFiles(['performance', 'web-vitals', 'lighthouse', 'speed']);
    if (perfMonitoring.length > 0) {
      score += 1;
      findings.push(`✓ Performance monitoring detected`);
    } else {
      findings.push(`✗ No performance monitoring detected`);
      this.improvements.push('Add performance monitoring (Web Vitals, etc.)');
    }
    
    // Check for resource limits
    const limits = this.searchInFiles(['maxSize', 'maxLength', 'limit', 'quota']);
    if (limits.length > 5) {
      score += 1;
      findings.push(`✓ Resource limits detected`);
    } else {
      findings.push(`✗ Limited resource limit implementation`);
      this.improvements.push('Define and enforce resource limits');
    }
    
    this.scores.performance = score;
    this.findings.performance = findings;
    console.log(`   Score: ${score}/5\n`);
  }

  async auditDocumentation() {
    console.log('📚 [10/10] Auditing Documentation & Operational Readiness...');
    let score = 0;
    const findings = [];
    
    // Check for README
    const readme = this.fileExists('README.md');
    if (readme) {
      const readmeContent = this.readFileContent('README.md');
      const hasSetup = readmeContent && readmeContent.includes('install');
      const hasUsage = readmeContent && (readmeContent.includes('usage') || readmeContent.includes('getting started'));
      
      if (hasSetup && hasUsage) {
        score += 2;
        findings.push(`✓ Comprehensive README with setup and usage`);
      } else if (hasSetup || hasUsage) {
        score += 1;
        findings.push(`⚠ README exists but incomplete`);
        this.improvements.push('Complete README with setup instructions and usage examples');
      }
    } else {
      findings.push(`✗ No README.md found`);
      this.criticalBlockers.push('No README documentation');
    }
    
    // Check for API documentation
    const apiDocs = this.findFiles(['api', 'swagger', 'openapi', 'postman']);
    if (apiDocs.length > 0) {
      score += 1;
      findings.push(`✓ API documentation found: ${apiDocs.length} files`);
    } else {
      findings.push(`✗ No API documentation detected`);
      this.improvements.push('Document API endpoints and usage');
    }
    
    // Check for runbook
    const runbook = this.findFiles(['runbook', 'operations', 'ops', 'playbook']);
    if (runbook.length > 0) {
      score += 1;
      findings.push(`✓ Operational runbook found`);
    } else {
      findings.push(`✗ UNVERIFIED: No runbook detected — ASSUME MISSING`);
      this.publicLaunchBlockers.push('No operational runbook for production support');
    }
    
    // Check for incident procedure
    const incident = this.searchInFiles(['incident', 'emergency', 'disaster recovery', 'rollback']);
    if (incident.length > 0) {
      score += 1;
      findings.push(`✓ Incident procedures documented`);
    } else {
      findings.push(`✗ UNVERIFIED: No incident procedures — ASSUME MISSING`);
      this.publicLaunchBlockers.push('No incident response procedures');
    }
    
    this.scores.documentation = score;
    this.findings.documentation = findings;
    console.log(`   Score: ${score}/5\n`);
  }

  // ========================================================================
  // PHASE 2: RUNTIME CHECKS
  // ========================================================================

  async performRuntimeChecks() {
    console.log('🌐 Checking deployment runtime...');
    
    try {
      const startTime = Date.now();
      const response = await this.makeHttpRequest(this.deploymentUrl);
      const responseTime = Date.now() - startTime;
      
      this.runtimeChecks = {
        url: this.deploymentUrl,
        status: response.statusCode,
        responseTime: `${responseTime}ms`,
        headers: response.headers,
        accessible: response.statusCode >= 200 && response.statusCode < 400
      };
      
      console.log(`   Status: ${response.statusCode}`);
      console.log(`   Response Time: ${responseTime}ms`);
      console.log(`   Accessible: ${this.runtimeChecks.accessible ? '✓ YES' : '✗ NO'}`);
      
      // Check security headers
      const requiredHeaders = [
        'content-security-policy',
        'x-frame-options',
        'x-content-type-options',
        'strict-transport-security'
      ];
      
      const missingHeaders = requiredHeaders.filter(h => !response.headers[h]);
      if (missingHeaders.length > 0) {
        console.log(`   ⚠ Missing security headers: ${missingHeaders.join(', ')}`);
        this.publicLaunchBlockers.push(`Missing runtime security headers: ${missingHeaders.join(', ')}`);
      } else {
        console.log(`   ✓ All security headers present`);
      }
      
      // Check for HTTPS
      if (!this.deploymentUrl.startsWith('https://')) {
        console.log(`   ✗ WARNING: Not using HTTPS`);
        this.criticalBlockers.push('Deployment not using HTTPS');
      } else {
        console.log(`   ✓ Using HTTPS`);
      }
      
    } catch (error) {
      console.log(`   ✗ Failed to check deployment: ${error.message}`);
      this.runtimeChecks = {
        url: this.deploymentUrl,
        error: error.message,
        accessible: false
      };
      this.criticalBlockers.push(`Deployment URL not accessible: ${error.message}`);
    }
    
    console.log();
  }

  makeHttpRequest(urlString) {
    return new Promise((resolve, reject) => {
      const parsedUrl = url.parse(urlString);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;
      
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.path,
        method: 'GET',
        timeout: 10000,
        headers: {
          'User-Agent': 'Production-Readiness-Auditor/1.0'
        }
      };
      
      const req = protocol.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        });
      });
      
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
      
      req.end();
    });
  }

  // ========================================================================
  // PHASE 3: READINESS CLASSIFICATION
  // ========================================================================

  classifyReadiness() {
    const totalScore = Object.values(this.scores).reduce((a, b) => a + b, 0);
    
    let readinessLevel;
    let recommendation;
    
    if (totalScore <= 25) {
      readinessLevel = 'Prototype';
      recommendation = 'NOT READY for any deployment. Significant development needed.';
    } else if (totalScore <= 35) {
      readinessLevel = 'Dev Preview';
      recommendation = 'Only suitable for internal development/testing. NOT READY for employees.';
    } else if (totalScore <= 42) {
      readinessLevel = 'Employee Pilot Ready (with conditions)';
      recommendation = 'May be used by employees IF critical blockers are resolved.';
    } else if (totalScore <= 50) {
      readinessLevel = 'Public Beta Ready';
      recommendation = 'Ready for limited public beta with active monitoring.';
    } else {
      readinessLevel = 'Production Ready';
      recommendation = 'Ready for production deployment.';
    }
    
    console.log(`Total Score: ${totalScore}/50`);
    console.log(`Readiness Level: ${readinessLevel}`);
    console.log(`Recommendation: ${recommendation}\n`);
    
    this.totalScore = totalScore;
    this.readinessLevel = readinessLevel;
    this.recommendation = recommendation;
  }

  // ========================================================================
  // PHASE 4: EXECUTIVE SUMMARY
  // ========================================================================

  generateExecutiveSummary() {
    console.log('EXECUTIVE SUMMARY — No Fluff, Just Facts\n');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    // Is this safe for employees?
    console.log('Q: Is this safe for employees?');
    if (this.criticalBlockers.length === 0 && this.totalScore >= 36) {
      console.log('A: YES, with monitoring. All critical blockers resolved.\n');
    } else if (this.criticalBlockers.length > 0) {
      console.log(`A: NO. ${this.criticalBlockers.length} critical blocker(s) must be fixed first:`);
      this.criticalBlockers.slice(0, 5).forEach((blocker, i) => {
        console.log(`   ${i + 1}. ${blocker}`);
      });
      console.log();
    } else {
      console.log('A: NO. Score too low for employee deployment.\n');
    }
    
    // Is this safe for customers?
    console.log('Q: Is this safe for customers?');
    if (this.criticalBlockers.length === 0 && this.publicLaunchBlockers.length === 0 && this.totalScore >= 43) {
      console.log('A: YES, ready for public beta.\n');
    } else if (this.criticalBlockers.length > 0 || this.publicLaunchBlockers.length > 0) {
      const totalBlockers = this.criticalBlockers.length + this.publicLaunchBlockers.length;
      console.log(`A: NO. ${totalBlockers} blocker(s) for public launch:`);
      [...this.criticalBlockers, ...this.publicLaunchBlockers].slice(0, 5).forEach((blocker, i) => {
        console.log(`   ${i + 1}. ${blocker}`);
      });
      console.log();
    } else {
      console.log('A: NO. Additional hardening needed for public use.\n');
    }
    
    // What would break first under real usage?
    console.log('Q: What would break first under real usage?');
    const weakestAreas = Object.entries(this.scores)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 3)
      .map(([area, score]) => `${this.formatAreaName(area)} (${score}/5)`);
    console.log(`A: Weakest areas: ${weakestAreas.join(', ')}`);
    console.log('   These are most likely to cause issues under load.\n');
    
    // What would scare a security review?
    console.log('Q: What would scare a security review?');
    const securityIssues = [
      ...this.findings.identityAccess.filter(f => f.includes('✗')),
      ...this.findings.secretsConfig.filter(f => f.includes('✗') || f.includes('CRITICAL')),
      ...this.findings.securityHardening.filter(f => f.includes('✗'))
    ];
    if (securityIssues.length > 0) {
      console.log(`A: ${securityIssues.length} security concern(s):`);
      securityIssues.slice(0, 5).forEach((issue, i) => {
        console.log(`   ${i + 1}. ${issue.replace('✗ ', '')}`);
      });
      console.log();
    } else {
      console.log('A: No major security red flags detected.\n');
    }
  }

  // ========================================================================
  // REPORT GENERATION
  // ========================================================================

  generateReport() {
    console.log('\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('SECTION A — SCORECARD TABLE');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    console.log('┌─────────────────────────────────────────────┬────────┬────────┐');
    console.log('│ Category                                    │ Score  │ Status │');
    console.log('├─────────────────────────────────────────────┼────────┼────────┤');
    
    Object.entries(this.scores).forEach(([category, score]) => {
      const name = this.formatAreaName(category).padEnd(43);
      const scoreStr = `${score}/5`.padEnd(6);
      const status = score >= 4 ? '✓ Good' : score >= 3 ? '⚠ Fair' : '✗ Poor';
      console.log(`│ ${name} │ ${scoreStr} │ ${status.padEnd(6)} │`);
    });
    
    const totalScore = Object.values(this.scores).reduce((a, b) => a + b, 0);
    console.log('├─────────────────────────────────────────────┼────────┼────────┤');
    console.log(`│ ${'TOTAL'.padEnd(43)} │ ${`${totalScore}/50`.padEnd(6)} │ ${this.readinessLevel.padEnd(6)} │`);
    console.log('└─────────────────────────────────────────────┴────────┴────────┘\n');
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('SECTION B — DETAILED FINDINGS');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    Object.entries(this.findings).forEach(([category, findings]) => {
      console.log(`${this.formatAreaName(category).toUpperCase()}`);
      console.log('─'.repeat(60));
      findings.forEach(finding => console.log(finding));
      console.log();
    });
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('SECTION C — BLOCKERS');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    console.log('CRITICAL BLOCKERS (Must Fix Before Employee Use):');
    if (this.criticalBlockers.length === 0) {
      console.log('✓ None - all critical items resolved\n');
    } else {
      this.criticalBlockers.forEach((blocker, i) => {
        console.log(`${i + 1}. ${blocker}`);
      });
      console.log();
    }
    
    console.log('PUBLIC LAUNCH BLOCKERS:');
    if (this.publicLaunchBlockers.length === 0) {
      console.log('✓ None - ready for public launch\n');
    } else {
      this.publicLaunchBlockers.forEach((blocker, i) => {
        console.log(`${i + 1}. ${blocker}`);
      });
      console.log();
    }
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('SECTION D — READINESS VERDICT');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    console.log(`Total Score: ${this.totalScore}/50`);
    console.log(`Readiness Level: ${this.readinessLevel}`);
    console.log(`Recommendation: ${this.recommendation}\n`);
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('SECTION E — IMMEDIATE ACTION PLAN');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    console.log('TOP 5 HIGHEST-LEVERAGE IMPROVEMENTS:');
    const topImprovements = this.improvements
      .slice(0, 5)
      .map((imp, i) => `${i + 1}. ${imp}`);
    
    if (topImprovements.length > 0) {
      topImprovements.forEach(imp => console.log(imp));
    } else {
      console.log('No improvements needed at this time.');
    }
    console.log();
  }

  saveReport() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `production-readiness-audit-${timestamp}.txt`;
    
    // Create report content
    let report = `PRODUCTION READINESS AUDIT REPORT\n`;
    report += `Generated: ${new Date().toISOString()}\n`;
    report += `Repository: ${this.repoPath}\n`;
    report += `Deployment: ${this.deploymentUrl || 'N/A'}\n\n`;
    
    report += `TOTAL SCORE: ${this.totalScore}/50\n`;
    report += `READINESS: ${this.readinessLevel}\n`;
    report += `RECOMMENDATION: ${this.recommendation}\n\n`;
    
    report += `SCORECARD:\n`;
    Object.entries(this.scores).forEach(([category, score]) => {
      report += `${this.formatAreaName(category)}: ${score}/5\n`;
    });
    
    report += `\nCRITICAL BLOCKERS: ${this.criticalBlockers.length}\n`;
    this.criticalBlockers.forEach((blocker, i) => {
      report += `${i + 1}. ${blocker}\n`;
    });
    
    report += `\nPUBLIC LAUNCH BLOCKERS: ${this.publicLaunchBlockers.length}\n`;
    this.publicLaunchBlockers.forEach((blocker, i) => {
      report += `${i + 1}. ${blocker}\n`;
    });
    
    fs.writeFileSync(filename, report);
    console.log(`\n📄 Full report saved to: ${filename}\n`);
  }

  // ========================================================================
  // UTILITY METHODS
  // ========================================================================

  fileExists(filePath) {
    try {
      return fs.existsSync(path.join(this.repoPath, filePath));
    } catch {
      return false;
    }
  }

  readFileContent(filePath) {
    try {
      return fs.readFileSync(path.join(this.repoPath, filePath), 'utf-8');
    } catch {
      return null;
    }
  }

  readPackageJson() {
    try {
      const content = fs.readFileSync(path.join(this.repoPath, 'package.json'), 'utf-8');
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  readCIConfig() {
    const ciPaths = [
      '.github/workflows',
      '.gitlab-ci.yml',
      '.circleci/config.yml'
    ];
    
    for (const ciPath of ciPaths) {
      const fullPath = path.join(this.repoPath, ciPath);
      if (fs.existsSync(fullPath)) {
        if (fs.statSync(fullPath).isDirectory()) {
          const files = fs.readdirSync(fullPath);
          if (files.length > 0) {
            return fs.readFileSync(path.join(fullPath, files[0]), 'utf-8');
          }
        } else {
          return fs.readFileSync(fullPath, 'utf-8');
        }
      }
    }
    return null;
  }

  findFiles(patterns) {
    const found = [];
    
    const searchDir = (dir) => {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          const relativePath = path.relative(this.repoPath, fullPath);
          
          // Skip node_modules and .git
          if (relativePath.includes('node_modules') || relativePath.includes('.git')) {
            continue;
          }
          
          if (entry.isDirectory()) {
            searchDir(fullPath);
          } else {
            // Check if file matches any pattern
            if (patterns.some(pattern => 
              entry.name.toLowerCase().includes(pattern.toLowerCase()) ||
              relativePath.toLowerCase().includes(pattern.toLowerCase())
            )) {
              found.push(relativePath);
            }
          }
        }
      } catch (error) {
        // Ignore permission errors
      }
    };
    
    searchDir(this.repoPath);
    return found;
  }

  searchInFiles(patterns) {
    const found = [];
    
    const searchDir = (dir) => {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          const relativePath = path.relative(this.repoPath, fullPath);
          
          // Skip node_modules and .git
          if (relativePath.includes('node_modules') || relativePath.includes('.git')) {
            continue;
          }
          
          if (entry.isDirectory()) {
            searchDir(fullPath);
          } else if (entry.isFile()) {
            try {
              const content = fs.readFileSync(fullPath, 'utf-8');
              if (patterns.some(pattern => content.toLowerCase().includes(pattern.toLowerCase()))) {
                if (!found.includes(relativePath)) {
                  found.push(relativePath);
                }
              }
            } catch {
              // Ignore binary files
            }
          }
        }
      } catch {
        // Ignore permission errors
      }
    };
    
    searchDir(this.repoPath);
    return found;
  }

  scanForHardcodedCredentials() {
    const found = [];
    const patterns = [
      /password\s*=\s*["'][^"']+["']/gi,
      /api[_-]?key\s*=\s*["'][^"']+["']/gi,
      /secret\s*=\s*["'][^"']+["']/gi,
      /token\s*=\s*["'][^"']+["']/gi,
      /aws[_-]?access[_-]?key/gi,
      /private[_-]?key\s*=\s*["']/gi
    ];
    
    const files = this.findFiles(['.ts', '.js', '.tsx', '.jsx', '.py', '.java']);
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(this.repoPath, file), 'utf-8');
        for (const pattern of patterns) {
          if (pattern.test(content)) {
            found.push({
              file,
              pattern: pattern.source
            });
            break;
          }
        }
      } catch {
        // Ignore read errors
      }
    }
    
    return found;
  }

  scanForCommittedSecrets() {
    const found = [];
    const secretFiles = [
      '.env',
      'id_rsa',
      'id_dsa',
      '.pem',
      '.key',
      'credentials',
      'secrets.json'
    ];
    
    for (const secretFile of secretFiles) {
      if (this.fileExists(secretFile)) {
        found.push({
          file: secretFile,
          type: 'Secret file committed'
        });
      }
    }
    
    return found;
  }

  formatAreaName(area) {
    const names = {
      identityAccess: 'Identity & Access Control',
      secretsConfig: 'Secrets & Configuration Hygiene',
      dataSafety: 'Data Safety & Privacy',
      reliability: 'Reliability & Error Handling',
      observability: 'Observability & Monitoring',
      cicd: 'CI/CD & Deployment Safety',
      securityHardening: 'Security Hardening',
      testing: 'Testing Coverage',
      performance: 'Performance & Cost Controls',
      documentation: 'Documentation & Operational Readiness'
    };
    return names[area] || area;
  }
}

// ========================================================================
// CLI INTERFACE
// ========================================================================

function printUsage() {
  console.log(`
Production Readiness Auditor - Strict Mode

Usage:
  node production-readiness-auditor.cjs [options]

Options:
  --repo <path>              Repository path (default: current directory)
  --deployment <url>         Deployment URL for runtime checks
  --audience <type>          Employee | Public | Both (default: Both)
  --pii                      Handles PII data
  --payments                 Handles payments
  --secrets                  Handles API keys or secrets (default: true)
  --help                     Show this help message

Examples:
  # Audit current repository
  node production-readiness-auditor.cjs

  # Audit with deployment URL
  node production-readiness-auditor.cjs --deployment https://example.com

  # Audit for public launch with PII
  node production-readiness-auditor.cjs --audience Public --pii

  # Full audit
  node production-readiness-auditor.cjs \\
    --repo /path/to/repo \\
    --deployment https://app.example.com \\
    --audience Both \\
    --pii \\
    --payments \\
    --secrets
`);
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    repoPath: process.cwd(),
    deploymentUrl: null,
    intendedAudience: 'Both',
    handlesPII: false,
    handlesPayments: false,
    handlesSecrets: true
  };
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--help':
      case '-h':
        printUsage();
        process.exit(0);
        break;
      case '--repo':
        options.repoPath = args[++i];
        break;
      case '--deployment':
        options.deploymentUrl = args[++i];
        break;
      case '--audience':
        options.intendedAudience = args[++i];
        break;
      case '--pii':
        options.handlesPII = true;
        break;
      case '--payments':
        options.handlesPayments = true;
        break;
      case '--secrets':
        options.handlesSecrets = true;
        break;
    }
  }
  
  return options;
}

// Main execution
if (require.main === module) {
  const options = parseArgs();
  const auditor = new ProductionReadinessAuditor(options);
  
  auditor.runAudit().then(() => {
    console.log('✅ Audit completed successfully\n');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Audit failed:', error);
    process.exit(1);
  });
}

module.exports = ProductionReadinessAuditor;
