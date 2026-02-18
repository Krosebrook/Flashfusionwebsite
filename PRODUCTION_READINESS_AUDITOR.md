# Production Readiness Auditor

A strict, evidence-based auditor that evaluates software readiness for Employee/Internal Use, Public Beta, and Production-Grade Launch.

## Overview

The Production Readiness Auditor performs comprehensive assessments of software systems based on **evidence only**. If something cannot be verified from the repository, deployment configuration, or runtime behavior, it is marked as **"UNVERIFIED — ASSUME MISSING."**

This auditor helps answer critical questions:

- Is this safe for employees?
- Is this safe for customers?
- What would break first under real usage?
- What would scare a security review?

## Features

### Phase 1: Repository & Deployment Audit (10 Categories, 0-5 each)

1. **Identity & Access Control**
   - Authentication implementation
   - Role-based access control (RBAC)
   - Least privilege enforcement
   - Hardcoded credentials detection

2. **Secrets & Configuration Hygiene**
   - .env file handling
   - Committed secrets detection
   - Configuration documentation
   - Secret rotation capability

3. **Data Safety & Privacy**
   - Data storage verification
   - Encryption implementation
   - Backup strategy
   - Data retention policies
   - GDPR/Privacy compliance (if handles PII)

4. **Reliability & Error Handling**
   - Graceful error handling
   - Timeout implementations
   - Retry logic
   - Fail-safe mechanisms
   - Error boundaries

5. **Observability & Monitoring**
   - Logging implementation
   - Structured logs
   - Error tracking services
   - Metrics collection
   - Health check endpoints

6. **CI/CD & Deployment Safety**
   - CI configuration
   - Tests in CI pipeline
   - Linting in CI
   - Build verification
   - Deployment strategy
   - Rollback capability

7. **Security Hardening**
   - OWASP basics coverage
   - Input validation
   - Rate limiting
   - CORS configuration
   - Security headers (CSP, X-Frame-Options, etc.)
   - Dependency scanning

8. **Testing Coverage**
   - Unit tests
   - Integration tests
   - E2E/Smoke tests
   - Test coverage configuration
   - Test framework setup

9. **Performance & Cost Controls**
   - API rate limiting
   - Resource limits
   - Caching strategies
   - Performance budgets
   - Pagination implementation

10. **Documentation & Operational Readiness**
    - README accuracy
    - Setup instructions
    - API documentation
    - Operational runbook
    - Incident response procedures

### Phase 2: Runtime Check (if deployment URL provided)

- HTTP status verification
- Response time measurement
- Security headers inspection
- HTTPS enforcement
- Error page behavior
- Authentication flow validation
- Visible security misconfigurations

### Phase 3: Readiness Classification

Based on total score (0-50):

- **0-25**: Prototype - Not ready for any deployment
- **26-35**: Dev Preview - Internal development/testing only
- **36-42**: Employee Pilot Ready (with conditions)
- **43-50**: Public Beta Ready
- **51+**: Production Ready

### Phase 4: Executive Summary

Provides blunt, no-fluff answers to:

- Is this safe for employees?
- Is this safe for customers?
- What would break first under real usage?
- What would scare a security review?

## Installation

The auditor is a standalone Node.js script with no external dependencies.

```bash
# No installation needed - just run it
node production-readiness-auditor.cjs
```

## Usage

### Basic Usage

```bash
# Audit current repository
node production-readiness-auditor.cjs

# Audit with deployment URL for runtime checks
node production-readiness-auditor.cjs --deployment https://example.com

# Audit specific repository
node production-readiness-auditor.cjs --repo /path/to/repo
```

### Advanced Usage

```bash
# Full audit with all options
node production-readiness-auditor.cjs \
  --repo /path/to/repo \
  --deployment https://app.example.com \
  --audience Public \
  --pii \
  --payments \
  --secrets

# Audit for employee use only
node production-readiness-auditor.cjs \
  --audience Employee \
  --secrets

# Audit for public beta with PII
node production-readiness-auditor.cjs \
  --deployment https://beta.example.com \
  --audience Public \
  --pii
```

### Command Line Options

| Option               | Description                                  | Default           |
| -------------------- | -------------------------------------------- | ----------------- |
| `--repo <path>`      | Repository path to audit                     | Current directory |
| `--deployment <url>` | Deployment URL for runtime checks            | None              |
| `--audience <type>`  | Intended audience: Employee, Public, or Both | Both              |
| `--pii`              | System handles PII data                      | false             |
| `--payments`         | System handles payments                      | false             |
| `--secrets`          | System handles API keys or secrets           | true              |
| `--help`             | Show help message                            | -                 |

## Output

The auditor generates:

1. **Console Output**: Real-time progress and results
2. **Scorecard Table**: Visual summary of all categories
3. **Detailed Findings**: Category-by-category analysis
4. **Blockers List**: Critical and public launch blockers
5. **Readiness Verdict**: Overall classification and recommendation
6. **Action Plan**: Top 5 highest-leverage improvements
7. **Report File**: Complete audit saved to timestamped file

### Sample Output Structure

```
SECTION A — SCORECARD TABLE
┌─────────────────────────────────────────────┬────────┬────────┐
│ Category                                    │ Score  │ Status │
├─────────────────────────────────────────────┼────────┼────────┤
│ Identity & Access Control                   │ 4/5    │ ✓ Good │
...

SECTION B — DETAILED FINDINGS
Per-category analysis with ✓, ⚠, and ✗ indicators

SECTION C — BLOCKERS
Critical blockers and public launch blockers

SECTION D — READINESS VERDICT
Total score, readiness level, and recommendation

SECTION E — IMMEDIATE ACTION PLAN
Top 5 prioritized improvements
```

## Scoring Philosophy

The auditor follows strict principles:

### Evidence-Based Only

- Only counts what can be verified in the repository
- Unverifiable items are marked as missing
- No assumptions or benefit of the doubt

### Conservative Scoring

- Assumes real users, real data, and real risk
- Prioritizes safety over optimism
- Better to under-score than over-score

### Critical Focus

- Identifies blocking issues for each deployment stage
- Separates "employee pilot" from "public launch" blockers
- Highlights security and reliability gaps

## Examples

### Example 1: Basic Repository Audit

```bash
node production-readiness-auditor.cjs
```

Output:

```
Total Score: 42/50
Readiness Level: Employee Pilot Ready (with conditions)
Critical Blockers: 1 (Hardcoded credentials)
Public Launch Blockers: 2 (RBAC not implemented, No runbook)
```

### Example 2: Public Beta with PII

```bash
node production-readiness-auditor.cjs \
  --deployment https://beta.example.com \
  --audience Public \
  --pii
```

Additional checks performed:

- GDPR/Privacy compliance verification
- Encryption for PII data
- Data retention policies
- Privacy documentation

### Example 3: Payment Processing System

```bash
node production-readiness-auditor.cjs \
  --audience Public \
  --pii \
  --payments
```

Stricter requirements for:

- PCI compliance indicators
- Encryption standards
- Security hardening
- Audit logging

## Integration with CI/CD

### GitHub Actions

```yaml
name: Production Readiness Check

on:
  push:
    branches: [main]
  pull_request:

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Production Readiness Audit
        run: node production-readiness-auditor.cjs
      - name: Upload Audit Report
        uses: actions/upload-artifact@v3
        with:
          name: readiness-audit
          path: production-readiness-audit-*.txt
```

### Pre-deployment Check

```bash
#!/bin/bash
# pre-deploy.sh

echo "Running production readiness audit..."
node production-readiness-auditor.cjs --deployment $STAGING_URL

if [ $? -ne 0 ]; then
  echo "❌ Audit failed. Deployment blocked."
  exit 1
fi

echo "✅ Audit passed. Proceeding with deployment."
```

## Interpreting Results

### Score Ranges

| Score | Level     | Meaning                                     |
| ----- | --------- | ------------------------------------------- |
| 45-50 | Excellent | Production-ready with minimal gaps          |
| 40-44 | Good      | Public beta ready, some improvements needed |
| 35-39 | Fair      | Employee pilot possible with monitoring     |
| 30-34 | Poor      | Development preview only                    |
| 0-29  | Critical  | Not ready for any deployment                |

### Common Issues

**Low Identity & Access Control Score**

- Implement authentication system
- Add RBAC for different user roles
- Remove hardcoded credentials
- Add route protection middleware

**Low Testing Coverage Score**

- Add unit tests for critical functions
- Implement integration tests
- Set up E2E testing framework
- Configure coverage thresholds

**Low CI/CD Score**

- Add automated testing to pipeline
- Implement linting checks
- Add build verification
- Configure deployment automation

**Low Security Hardening Score**

- Implement input validation
- Add rate limiting
- Configure CORS properly
- Set security headers
- Enable dependency scanning

## Limitations

- **Static Analysis Only**: Cannot detect runtime-only issues
- **Pattern Matching**: May have false positives/negatives
- **No Code Execution**: Cannot verify actual functionality
- **Network Access**: Runtime checks require accessible deployment URL
- **Context Limited**: Cannot understand business requirements

## Best Practices

1. **Run Early and Often**: Audit at each major milestone
2. **Track Progress**: Compare scores over time
3. **Fix Blockers First**: Address critical issues before others
4. **Automate**: Integrate into CI/CD pipeline
5. **Document**: Save reports for compliance and audits

## Troubleshooting

### Issue: "No tests detected" but tests exist

**Solution**: Ensure test files follow naming conventions:

- `*.test.ts`, `*.test.js`
- `*.spec.ts`, `*.spec.js`
- Files in `__tests__/` directory

### Issue: "Hardcoded credentials" false positive

**Solution**: The auditor looks for patterns like:

- `password = "..."`
- `api_key = "..."`
- `secret = "..."`

If these are test fixtures or examples, consider:

- Moving to separate config files
- Using environment variables
- Adding comments explaining they're not real

### Issue: Runtime checks fail

**Causes**:

- Deployment URL not accessible from audit environment
- Authentication required for health check
- Network restrictions or firewalls

**Solution**:

- Verify URL is publicly accessible
- Provide unauthenticated health endpoint
- Run audit from allowed network

## Contributing

To extend the auditor:

1. Add new audit categories in the `scores` object
2. Implement audit method (e.g., `auditNewCategory()`)
3. Update `formatAreaName()` with display name
4. Add findings to report generation
5. Update documentation

## License

Private - All rights reserved

## Support

For issues or questions:

1. Check troubleshooting section
2. Review sample output
3. Open an issue on GitHub
4. Contact the development team

---

**Remember**: This auditor is strict by design. A low score is better than a false sense of security.
