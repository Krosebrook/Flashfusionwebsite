/**
 * CI/CD file generators (GitHub Actions, issue templates, etc.)
 */

import type { GeneratedApp } from './types';

/**
 * Generate GitHub Actions CI workflow
 */
export function generateGitHubActionsCI(app: GeneratedApp): string {
  return `name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_${app.name.toLowerCase().replace(/\s+/g, '_')}
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm run setup

    - name: Run linting
      run: npm run lint

    - name: Run type checking
      run: npm run type-check

    - name: Run tests
      run: npm run test:coverage
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_${app.name.toLowerCase().replace(/\s+/g, '_')}

    - name: Build application
      run: npm run build
`;
}

/**
 * Generate GitHub Actions Deploy workflow
 */
export function generateGitHubActionsDeploy(_app: GeneratedApp): string {
  return `name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm run setup

    - name: Build application
      run: npm run build

    - name: Deploy to production
      run: npm run deploy:production
      env:
        DEPLOY_TOKEN: \${{ secrets.DEPLOY_TOKEN }}
`;
}

/**
 * Generate GitHub issue templates
 */
export function generateIssueTemplate(type: 'bug' | 'feature'): string {
  if (type === 'bug') {
    return `---
name: Bug report
about: Create a report to help us improve
title: ''
labels: 'bug'
assignees: ''
---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. iOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]

**Additional context**
Add any other context about the problem here.`;
  } else {
    return `---
name: Feature request
about: Suggest an idea for this project
title: ''
labels: 'enhancement'
assignees: ''
---

**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.`;
  }
}
