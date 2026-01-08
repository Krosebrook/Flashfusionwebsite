/**
 * GitHub Assistant Agent Service
 * A modular AI agent embedded in production environment for GitHub repository assistance
 */

import {
  type AgentModule,
  type AgentRequest,
  type AgentResponse,
  type ModuleCapability,
  type RepositoryStructure,
  type CodeSummary,
  type PRReview,
  type RefactoringOpportunity,
  type TestCoverageAnalysis,
  type IssueClassification,
  type ProjectPlan,
  type SecurityScan,
  type CICDAnalysis,
  type Recommendation,
} from '../types/github-assistant';
import { AIService, type AIRequest } from './AIService';

export class GitHubAssistantAgent {
  private static instance: GitHubAssistantAgent;
  private aiService: typeof AIService;

  // Module definitions
  private modules: Map<AgentModule, ModuleCapability> = new Map([
    [
      'repo-understander',
      {
        id: 'repo-understander',
        name: '📘 Repo Understander',
        description: 'Analyze and explain repository structure, key components, and technologies',
        icon: '📘',
        triggers: ['what is this repo', 'explain the structure', 'where is', 'repository overview'],
        enabled: true,
      },
    ],
    [
      'code-summarizer',
      {
        id: 'code-summarizer',
        name: '🧾 Code Summarizer',
        description: 'Summarize files, diffs, commits, or pull requests in natural language',
        icon: '🧾',
        triggers: ['summarize', 'explain changes', 'what does this do', 'describe'],
        enabled: true,
      },
    ],
    [
      'pr-reviewer',
      {
        id: 'pr-reviewer',
        name: '👀 Pull Request Reviewer',
        description: 'Review PRs for quality, logic, testing, readability, and best practices',
        icon: '👀',
        triggers: ['review', 'check code', 'any issues', 'code quality'],
        enabled: true,
      },
    ],
    [
      'refactoring-advisor',
      {
        id: 'refactoring-advisor',
        name: '🧠 Refactoring Advisor',
        description: 'Suggest improvements to code, structure, and logic',
        icon: '🧠',
        triggers: ['improve', 'refactor', 'optimize', 'better way'],
        enabled: true,
      },
    ],
    [
      'test-coverage-advisor',
      {
        id: 'test-coverage-advisor',
        name: '🧪 Test Coverage Advisor',
        description: 'Check test adequacy and suggest or generate test cases',
        icon: '🧪',
        triggers: ['test', 'coverage', 'generate tests', 'enough tests'],
        enabled: true,
      },
    ],
    [
      'issue-triager',
      {
        id: 'issue-triager',
        name: '🔄 Issue Triager',
        description: 'Auto-categorize issues and suggest labels or next steps',
        icon: '🔄',
        triggers: ['categorize', 'triage', 'label', 'what next'],
        enabled: true,
      },
    ],
    [
      'project-planner',
      {
        id: 'project-planner',
        name: '🧱 Project Planner',
        description: 'Break down goals into epics, features, and implementation plans',
        icon: '🧱',
        triggers: ['plan', 'roadmap', 'how to build', 'break down'],
        enabled: true,
      },
    ],
    [
      'security-scanner',
      {
        id: 'security-scanner',
        name: '🔐 Security Scanner',
        description: 'Detect insecure patterns, secrets, or risky code',
        icon: '🔐',
        triggers: ['security', 'scan', 'secrets', 'vulnerabilities'],
        enabled: true,
      },
    ],
    [
      'cicd-inspector',
      {
        id: 'cicd-inspector',
        name: '⚙️ CI/CD Inspector',
        description: 'Evaluate workflows and suggest optimizations',
        icon: '⚙️',
        triggers: ['ci/cd', 'pipeline', 'workflow', 'build slow'],
        enabled: true,
      },
    ],
  ]);

  private constructor() {
    this.aiService = AIService;
  }

  static getInstance(): GitHubAssistantAgent {
    if (!GitHubAssistantAgent.instance) {
      GitHubAssistantAgent.instance = new GitHubAssistantAgent();
    }
    return GitHubAssistantAgent.instance;
  }

  /**
   * Determine which module to activate based on the query
   */
  async detectModule(query: string): Promise<AgentModule | null> {
    const lowerQuery = query.toLowerCase();

    for (const [moduleId, capability] of this.modules) {
      if (
        capability.triggers.some((trigger) => lowerQuery.includes(trigger.toLowerCase()))
      ) {
        return moduleId;
      }
    }

    // Use AI to determine the best module if no trigger matches
    try {
      const aiRequest: AIRequest = {
        prompt: `Analyze this query and determine which module best handles it:
Query: "${query}"

Available modules:
${Array.from(this.modules.values())
  .map((m) => `- ${m.id}: ${m.description}`)
  .join('\n')}

Respond with ONLY the module id (e.g., "repo-understander")`,
        model: 'gpt-4o',
        provider: 'openai',
        temperature: 0.3,
        maxTokens: 50,
      };

      const response = await this.makeAIRequest(aiRequest);
      const moduleId = response.content.trim() as AgentModule;

      if (this.modules.has(moduleId)) {
        return moduleId;
      }
    } catch (error) {
      console.error('Error detecting module:', error);
    }

    return null;
  }

  /**
   * Process a request through the appropriate module
   */
  async processRequest(request: AgentRequest): Promise<AgentResponse> {
    const startTime = Date.now();

    // Determine module if not specified
    const module = request.module || (await this.detectModule(request.query));

    if (!module) {
      throw new Error(
        'Unable to determine appropriate module. Please specify a module or refine your query.'
      );
    }

    // Route to appropriate handler
    let result: string;
    let recommendations: Recommendation[] = [];

    switch (module) {
      case 'repo-understander':
        result = await this.handleRepoUnderstand(request);
        break;
      case 'code-summarizer':
        result = await this.handleCodeSummarize(request);
        break;
      case 'pr-reviewer':
        result = await this.handlePRReview(request);
        break;
      case 'refactoring-advisor':
        result = await this.handleRefactoringAdvice(request);
        break;
      case 'test-coverage-advisor':
        result = await this.handleTestCoverage(request);
        break;
      case 'issue-triager':
        result = await this.handleIssueTriage(request);
        break;
      case 'project-planner':
        result = await this.handleProjectPlanning(request);
        break;
      case 'security-scanner':
        result = await this.handleSecurityScan(request);
        break;
      case 'cicd-inspector':
        result = await this.handleCICDInspection(request);
        break;
      default:
        throw new Error(`Module ${module} not implemented`);
    }

    const processingTime = Date.now() - startTime;

    return {
      module,
      result,
      metadata: {
        processingTime,
        timestamp: new Date().toISOString(),
        confidence: 0.85, // Could be calculated based on response quality
      },
      recommendations,
    };
  }

  /**
   * Make an AI request - for demo purposes, returns structured mock responses
   * In production, this would integrate with actual AI APIs
   */
  private async makeAIRequest(request: AIRequest): Promise<AIResponse> {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate contextual mock response based on the request
    const content = this.generateMockResponse(request);
    
    return {
      content,
      model: request.model,
      provider: request.provider,
      usage: {
        promptTokens: Math.floor(request.prompt.length / 4),
        completionTokens: Math.floor(content.length / 4),
        totalTokens: Math.floor((request.prompt.length + content.length) / 4),
        estimatedCost: 0.001,
      },
      metadata: {
        requestId: `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date().toISOString(),
        processingTime: 500,
      },
    };
  }

  /**
   * Generate mock response for demonstration
   */
  private generateMockResponse(request: AIRequest): string {
    const prompt = request.prompt.toLowerCase();
    
    if (prompt.includes('repository') || prompt.includes('structure')) {
      return this.getMockRepoAnalysis();
    } else if (prompt.includes('summarize') || prompt.includes('code')) {
      return this.getMockCodeSummary();
    } else if (prompt.includes('review') || prompt.includes('pull request')) {
      return this.getMockPRReview();
    } else if (prompt.includes('refactor') || prompt.includes('improve')) {
      return this.getMockRefactoringSuggestions();
    } else if (prompt.includes('test') || prompt.includes('coverage')) {
      return this.getMockTestSuggestions();
    } else if (prompt.includes('issue') || prompt.includes('triage')) {
      return this.getMockIssueTriage();
    } else if (prompt.includes('plan') || prompt.includes('roadmap')) {
      return this.getMockProjectPlan();
    } else if (prompt.includes('security') || prompt.includes('scan')) {
      return this.getMockSecurityScan();
    } else if (prompt.includes('ci/cd') || prompt.includes('workflow')) {
      return this.getMockCICDAnalysis();
    }
    
    return 'Analysis complete. Please provide more specific details for detailed recommendations.';
  }

  private getMockRepoAnalysis(): string {
    return `## Repository Analysis

### Overall Purpose
This repository is a modern React 18 + TypeScript web application built with Vite 6 and Tailwind CSS, featuring comprehensive AI-powered tools and workflows.

### Technology Stack
- **Frontend**: React 18, TypeScript 5.3, Vite 6
- **Styling**: Tailwind CSS 3.4, Radix UI components
- **State Management**: React hooks, context
- **Build Tool**: Vite with optimization plugins
- **Testing**: Vitest, Playwright
- **Deployment**: Vercel-ready configuration

### Directory Structure
- \`src/components/\` - React components organized by feature
- \`src/services/\` - Business logic and API integrations
- \`src/types/\` - TypeScript type definitions
- \`src/lib/\` - Utility functions and helpers
- \`src/features/\` - Feature-specific modules

### Key Components
- **AIService**: Centralized AI model integration
- **PageRouter**: Client-side routing system
- **UI Components**: Comprehensive design system with Radix UI
- **Authentication**: Supabase-based auth system

### Build & Deployment
- Development: \`npm run dev\`
- Production: \`npm run build\`
- Testing: \`npm run test\`
- Linting: \`npm run lint\`

### Recommendations
1. Well-structured monorepo setup with workspaces
2. Strong TypeScript typing throughout
3. Modern build optimization with Vite
4. Comprehensive component library`;
  }

  private getMockCodeSummary(): string {
    return `## Code Summary

### Purpose
This code implements a modular GitHub Assistant Agent with AI-powered capabilities for repository analysis, code review, and project planning.

### Key Functions
- \`processRequest()\`: Main entry point for handling user queries
- \`detectModule()\`: Intelligently routes requests to appropriate modules
- Module handlers: Specialized functions for each capability (repo analysis, code review, etc.)

### Exports
- \`GitHubAssistantAgent\`: Main service class
- \`githubAssistant\`: Singleton instance for application-wide use

### Dependencies
- AIService for AI model integration
- Type definitions from github-assistant.ts
- React for UI components

### Complexity: Medium
- Well-organized modular architecture
- Clear separation of concerns
- Good error handling patterns

### Notes
The code follows best practices with TypeScript strict mode, proper error handling, and clean architecture principles.`;
  }

  private getMockPRReview(): string {
    return `## Pull Request Review

### Overall Assessment: ✅ APPROVE with suggestions

### Code Quality: 8/10
- Clean, well-structured code
- Good TypeScript usage with proper types
- Consistent naming conventions

### Logic & Correctness: 9/10
- Implementation is sound
- Edge cases are handled
- No obvious bugs detected

### Test Coverage: 7/10
- Core functionality is testable
- **Suggestion**: Add unit tests for module detection logic
- **Suggestion**: Add integration tests for AI service calls

### Performance: 8/10
- Efficient module routing
- Good use of singleton pattern
- **Suggestion**: Consider caching module definitions

### Security: 9/10
- No exposed secrets
- Proper error handling
- Input validation present

### Best Practices: 8/10
✅ Good separation of concerns
✅ Proper TypeScript usage
✅ Clean architecture
⚠️ Consider adding JSDoc comments for public methods
⚠️ Add more comprehensive error messages

### Specific Suggestions
1. Add unit tests for each module handler
2. Document the module detection algorithm
3. Consider adding request/response logging
4. Add rate limiting for AI requests`;
  }

  private getMockRefactoringSuggestions(): string {
    return `## Refactoring Opportunities

### 1. Extract Module Registry (Medium Priority)
**Location**: GitHubAssistantAgent.ts
**Current**: Module definitions are inline in Map constructor
**Suggested**: Extract to separate configuration file
**Impact**: Improved maintainability
**Effort**: Low

\`\`\`typescript
// config/modules.ts
export const MODULE_DEFINITIONS: ModuleCapability[] = [
  { id: 'repo-understander', ... },
  // ...
];
\`\`\`

### 2. Add Request Caching (High Priority)
**Location**: processRequest method
**Suggested**: Cache repeated requests to reduce AI API calls
**Impact**: Performance improvement, cost reduction
**Effort**: Medium

### 3. Improve Error Messages (Low Priority)
**Location**: All handler methods
**Current**: Generic error messages
**Suggested**: Contextual, actionable error messages
**Impact**: Better developer experience
**Effort**: Low

### 4. Extract AI Request Logic (Medium Priority)
**Suggested**: Create separate AIRequestBuilder class
**Impact**: Better separation of concerns
**Effort**: Medium

### 5. Add Metrics Collection (Low Priority)
**Suggested**: Track module usage, response times, success rates
**Impact**: Better observability
**Effort**: Low`;
  }

  private getMockTestSuggestions(): string {
    return `## Test Coverage Analysis

### Current Coverage: Insufficient
- No unit tests detected for GitHub Assistant Agent
- Integration tests missing

### Critical Gaps

#### 1. Module Detection Tests
**Priority**: High
**Suggested Test Cases**:
\`\`\`typescript
describe('GitHubAssistantAgent', () => {
  it('should detect repo-understander module from query', () => {
    const query = 'Explain the structure of this repo';
    expect(agent.detectModule(query)).toBe('repo-understander');
  });
  
  it('should handle ambiguous queries', () => {
    const query = 'What is this?';
    // Should either detect a module or return null
  });
});
\`\`\`

#### 2. Request Processing Tests
**Priority**: High
**Suggested Test Cases**:
- Valid request handling
- Error handling for missing modules
- AI service integration
- Response format validation

#### 3. Module Handler Tests
**Priority**: Medium
**Suggested**: Test each module handler independently
**Example**:
\`\`\`typescript
describe('handleRepoUnderstand', () => {
  it('should generate repository analysis', async () => {
    const request = { query: 'Analyze repo', ... };
    const result = await agent['handleRepoUnderstand'](request);
    expect(result).toContain('Technology Stack');
  });
});
\`\`\`

### Recommended Test Structure
- Unit tests: 80%+ coverage target
- Integration tests: Key workflows
- E2E tests: User journeys

### Testing Framework
- Use Vitest (already configured)
- Add @testing-library/react for component tests
- Consider adding MSW for API mocking`;
  }

  private getMockIssueTriage(): string {
    return `## Issue Classification

### Category: Feature Request
This appears to be a request for new functionality rather than a bug report.

### Priority: Medium
- Adds value but not critical
- Can be scheduled in upcoming sprint
- No blocking dependencies

### Complexity: Moderate
- Requires new service implementation
- Integration with existing systems
- Testing requirements

### Suggested Labels
- \`enhancement\`
- \`ai-features\`
- \`good-first-issue\` (if appropriate)
- \`help-wanted\`

### Estimated Effort
**Time**: 2-3 days
**Breakdown**:
- Design & Planning: 4 hours
- Implementation: 8-12 hours
- Testing: 4 hours
- Documentation: 2 hours

### Next Steps
1. **Immediate**: Add to product backlog
2. **Week 1**: Review technical feasibility
3. **Week 2**: Assign to developer
4. **Sprint Planning**: Include in next sprint if capacity allows

### Related Issues
- Consider checking for similar feature requests
- May relate to #issue-xyz about AI integration

### Recommendations
- Gather user feedback before implementation
- Consider creating a design doc
- Plan for incremental rollout`;
  }

  private getMockProjectPlan(): string {
    return `## Project Plan: GitHub Assistant Agent

### Goal
Build a modular AI-powered assistant for GitHub repository analysis and code review.

### Epics

#### Epic 1: Core Infrastructure
**Features**:
- Module architecture system
- AI service integration
- Request routing logic

#### Epic 2: Analysis Modules
**Features**:
- Repository analyzer
- Code summarizer
- Security scanner

#### Epic 3: Review & Planning
**Features**:
- PR reviewer
- Test coverage advisor
- Project planner

### Implementation Timeline

#### Phase 1: Foundation (Week 1-2)
**Tasks**:
- [ ] Set up module architecture
- [ ] Implement base service class
- [ ] Create type definitions
- [ ] Add error handling
**Deliverables**: Working module system

#### Phase 2: Core Modules (Week 3-4)
**Tasks**:
- [ ] Implement repo understander
- [ ] Implement code summarizer
- [ ] Implement PR reviewer
- [ ] Add tests for each module
**Deliverables**: 3 working modules

#### Phase 3: Advanced Features (Week 5-6)
**Tasks**:
- [ ] Add remaining modules
- [ ] Implement caching
- [ ] Add metrics/logging
- [ ] Performance optimization
**Deliverables**: Complete feature set

#### Phase 4: Polish & Launch (Week 7-8)
**Tasks**:
- [ ] UI/UX refinement
- [ ] Documentation
- [ ] Security audit
- [ ] Beta testing
**Deliverables**: Production-ready system

### Technical Requirements
- TypeScript 5.3+
- React 18+
- AI API integration (OpenAI/Anthropic)
- Test coverage >80%

### Dependencies
- AI service implementation
- API key management
- Rate limiting system

### Risks & Mitigation
**Risk**: AI API costs
**Mitigation**: Implement caching, rate limiting

**Risk**: Response quality
**Mitigation**: Prompt engineering, user feedback loop`;
  }

  private getMockSecurityScan(): string {
    return `## Security Scan Results

### Overall Risk Level: LOW ✅

### Vulnerabilities Found: 0 Critical, 1 Medium, 2 Low

#### Medium Severity Issues

**1. Potential Information Disclosure**
- **Location**: GitHubAssistantAgent.ts line 275
- **Issue**: Error messages may expose internal implementation details
- **Recommendation**: Sanitize error messages before returning to client
- **Remediation**:
\`\`\`typescript
// Instead of:
throw new Error(\`Module \${module} not implemented\`);

// Use:
throw new Error('Requested functionality is not available');
\`\`\`

#### Low Severity Issues

**1. Missing Input Validation**
- **Location**: processRequest method
- **Issue**: Query length not validated
- **Recommendation**: Add max length validation
- **Remediation**:
\`\`\`typescript
if (request.query.length > 5000) {
  throw new Error('Query too long');
}
\`\`\`

**2. No Rate Limiting**
- **Location**: Service level
- **Issue**: No protection against request flooding
- **Recommendation**: Implement rate limiting per user/session

### Secrets Scan: ✅ PASSED
No hardcoded secrets, API keys, or credentials detected.

### Best Practices
✅ No eval() or Function() constructor usage
✅ Proper error handling
✅ Type-safe code with TypeScript
✅ No SQL injection vectors (no direct DB queries)
⚠️ Consider adding request logging for audit trail
⚠️ Add authentication/authorization checks

### Recommendations
1. **High Priority**: Add input validation
2. **Medium Priority**: Implement rate limiting
3. **Medium Priority**: Add request logging
4. **Low Priority**: Consider adding CSRF protection
5. **Low Priority**: Add Content Security Policy headers`;
  }

  private getMockCICDAnalysis(): string {
    return `## CI/CD Pipeline Analysis

### Current Workflow Assessment

#### Strengths ✅
- Modern GitHub Actions setup
- Automated testing on PR
- Multi-environment deployment
- Good use of caching

#### Performance Metrics
- Average Build Time: 3m 24s
- Average Test Time: 1m 47s
- Success Rate: 94%
- Cache Hit Rate: 78%

### Optimization Opportunities

#### 1. Parallel Job Execution (High Impact)
**Current**: Jobs run sequentially
**Recommended**: Run linting, type-checking, and tests in parallel
**Expected Improvement**: 40% faster CI time

\`\`\`yaml
jobs:
  quality-checks:
    strategy:
      matrix:
        check: [lint, typecheck, test]
    runs-on: ubuntu-latest
    steps:
      - name: Run ${{ matrix.check }}
\`\`\`

#### 2. Dependency Caching Improvement (Medium Impact)
**Current**: Basic npm cache
**Recommended**: Use actions/cache with better key strategy
**Expected Improvement**: 15% faster dependency installation

#### 3. Incremental Type Checking (Medium Impact)
**Recommended**: Use TypeScript project references
**Expected Improvement**: 30% faster type checking

#### 4. Test Splitting (Low Impact)
**Recommended**: Split test suite across multiple workers
**Expected Improvement**: 20% faster test execution

### Cost Optimization
- **Current**: ~2,400 minutes/month
- **Optimized**: ~1,600 minutes/month (33% reduction)
- **Savings**: Reduces to free tier range

### Best Practices Checklist
✅ Automated testing
✅ Branch protection rules
✅ Status checks required
⚠️ Missing: Automated security scanning
⚠️ Missing: Performance benchmarking
❌ Missing: Automated dependency updates

### Implementation Plan
1. **Week 1**: Implement parallel jobs
2. **Week 2**: Improve caching strategy
3. **Week 3**: Add security scanning (CodeQL)
4. **Week 4**: Set up performance monitoring

### Specific Recommendations
\`\`\`yaml
# Add to .github/workflows/ci.yml
- name: Security Scan
  uses: github/codeql-action/analyze@v2
  
- name: Performance Test
  run: npm run bench
  
- uses: dependabot/dependabot-core@v2
  with:
    schedule: weekly
\`\`\``;
  }

  /**
   * 📘 Repo Understander Module
   */
  private async handleRepoUnderstand(request: AgentRequest): Promise<string> {
    const systemPrompt = `You are a GitHub Assistant specializing in repository analysis. 
Analyze repositories to understand their structure, technologies, and purpose.
Provide clear, concise explanations that help developers quickly understand the codebase.
Focus on: structure, key components, technologies used, file roles, and overall architecture.`;

    const prompt = `${request.query}

Context: ${JSON.stringify(request.context || {})}

Provide a comprehensive repository analysis including:
1. Overall purpose and goals
2. Technology stack and frameworks
3. Directory structure and organization
4. Key components and their roles
5. Build and deployment setup
6. Testing approach`;

    const aiRequest: AIRequest = {
      prompt,
      systemPrompt,
      model: 'gpt-4o',
      provider: 'openai',
      temperature: 0.5,
      maxTokens: 2000,
    };

    const response = await this.makeAIRequest(aiRequest);
    return response.content;
  }

  /**
   * 🧾 Code Summarizer Module
   */
  private async handleCodeSummarize(request: AgentRequest): Promise<string> {
    const systemPrompt = `You are a GitHub Assistant specializing in code summarization.
Provide clear, concise summaries of code files, diffs, commits, or PRs.
Focus on: what changed, why it matters, impact on the codebase, and key functionality.`;

    const prompt = `${request.query}

Context: ${JSON.stringify(request.context || {})}

Provide a clear summary including:
1. What this code does
2. Key functions/components
3. Dependencies and imports
4. Notable patterns or approaches
5. Any potential concerns or complexities`;

    const aiRequest: AIRequest = {
      prompt,
      systemPrompt,
      model: 'gpt-4o',
      provider: 'openai',
      temperature: 0.4,
      maxTokens: 1500,
    };

    const response = await this.makeAIRequest(aiRequest);
    return response.content;
  }

  /**
   * 👀 Pull Request Reviewer Module
   */
  private async handlePRReview(request: AgentRequest): Promise<string> {
    const systemPrompt = `You are a GitHub Assistant specializing in code review.
Review pull requests for quality, logic, testing, readability, and best practices.
Be constructive and specific with feedback. Highlight both strengths and areas for improvement.`;

    const prompt = `${request.query}

Context: ${JSON.stringify(request.context || {})}

Provide a comprehensive code review covering:
1. Code quality and readability
2. Logic and correctness
3. Test coverage
4. Performance considerations
5. Security concerns
6. Best practices adherence
7. Specific suggestions for improvement`;

    const aiRequest: AIRequest = {
      prompt,
      systemPrompt,
      model: 'gpt-4o',
      provider: 'openai',
      temperature: 0.3,
      maxTokens: 2500,
    };

    const response = await this.makeAIRequest(aiRequest);
    return response.content;
  }

  /**
   * 🧠 Refactoring Advisor Module
   */
  private async handleRefactoringAdvice(request: AgentRequest): Promise<string> {
    const systemPrompt = `You are a GitHub Assistant specializing in code refactoring.
Suggest improvements to code structure, duplication, naming, and logic.
Focus on maintainability, readability, and performance. Provide specific, actionable advice.`;

    const prompt = `${request.query}

Context: ${JSON.stringify(request.context || {})}

Analyze the code and suggest improvements for:
1. Code duplication and reusability
2. Naming conventions
3. Structure and organization
4. Complexity reduction
5. Performance optimization
6. Design patterns application
7. Maintainability enhancements

Provide specific before/after examples where helpful.`;

    const aiRequest: AIRequest = {
      prompt,
      systemPrompt,
      model: 'gpt-4o',
      provider: 'openai',
      temperature: 0.4,
      maxTokens: 2000,
    };

    const response = await this.makeAIRequest(aiRequest);
    return response.content;
  }

  /**
   * 🧪 Test Coverage Advisor Module
   */
  private async handleTestCoverage(request: AgentRequest): Promise<string> {
    const systemPrompt = `You are a GitHub Assistant specializing in test coverage analysis.
Evaluate test adequacy and suggest or generate test cases.
Focus on: coverage gaps, edge cases, critical paths, and test quality.`;

    const prompt = `${request.query}

Context: ${JSON.stringify(request.context || {})}

Analyze testing and provide:
1. Assessment of current test coverage
2. Critical gaps in testing
3. Suggested test cases (with examples)
4. Edge cases to consider
5. Testing best practices recommendations
6. Test structure improvements`;

    const aiRequest: AIRequest = {
      prompt,
      systemPrompt,
      model: 'gpt-4o',
      provider: 'openai',
      temperature: 0.5,
      maxTokens: 2000,
    };

    const response = await this.makeAIRequest(aiRequest);
    return response.content;
  }

  /**
   * 🔄 Issue Triager Module
   */
  private async handleIssueTriage(request: AgentRequest): Promise<string> {
    const systemPrompt = `You are a GitHub Assistant specializing in issue triage.
Categorize issues and suggest labels, priority, and next steps.
Be practical and help teams organize their work effectively.`;

    const prompt = `${request.query}

Context: ${JSON.stringify(request.context || {})}

Analyze this issue and provide:
1. Category (bug, feature, enhancement, documentation, etc.)
2. Priority (low, medium, high, critical)
3. Complexity (trivial, simple, moderate, complex)
4. Suggested labels
5. Estimated effort
6. Next steps and action items
7. Related issues or dependencies`;

    const aiRequest: AIRequest = {
      prompt,
      systemPrompt,
      model: 'gpt-4o',
      provider: 'openai',
      temperature: 0.3,
      maxTokens: 1500,
    };

    const response = await this.makeAIRequest(aiRequest);
    return response.content;
  }

  /**
   * 🧱 Project Planner Module
   */
  private async handleProjectPlanning(request: AgentRequest): Promise<string> {
    const systemPrompt = `You are a GitHub Assistant specializing in project planning.
Break down user goals into epics, features, tasks, and technical implementation plans.
Be practical, organized, and provide actionable roadmaps.`;

    const prompt = `${request.query}

Context: ${JSON.stringify(request.context || {})}

Create a project plan including:
1. Goal and vision
2. Epics and major features
3. User stories
4. Technical requirements
5. Implementation tasks
6. Timeline and phases
7. Dependencies
8. Risks and mitigation strategies`;

    const aiRequest: AIRequest = {
      prompt,
      systemPrompt,
      model: 'gpt-4o',
      provider: 'openai',
      temperature: 0.6,
      maxTokens: 3000,
    };

    const response = await this.makeAIRequest(aiRequest);
    return response.content;
  }

  /**
   * 🔐 Security Scanner Module
   */
  private async handleSecurityScan(request: AgentRequest): Promise<string> {
    const systemPrompt = `You are a GitHub Assistant specializing in security analysis.
Detect insecure patterns, exposed secrets, and risky code practices.
Be thorough but practical, focusing on real risks with clear remediation steps.`;

    const prompt = `${request.query}

Context: ${JSON.stringify(request.context || {})}

Perform a security scan covering:
1. Potential vulnerabilities
2. Insecure patterns or practices
3. Hardcoded secrets or credentials
4. Input validation issues
5. Authentication/authorization concerns
6. Dependency vulnerabilities
7. Specific remediation steps for each finding`;

    const aiRequest: AIRequest = {
      prompt,
      systemPrompt,
      model: 'gpt-4o',
      provider: 'openai',
      temperature: 0.2,
      maxTokens: 2500,
    };

    const response = await this.makeAIRequest(aiRequest);
    return response.content;
  }

  /**
   * ⚙️ CI/CD Inspector Module
   */
  private async handleCICDInspection(request: AgentRequest): Promise<string> {
    const systemPrompt = `You are a GitHub Assistant specializing in CI/CD optimization.
Evaluate GitHub Actions and pipeline files, suggest optimizations and improvements.
Focus on: performance, reliability, cost, and best practices.`;

    const prompt = `${request.query}

Context: ${JSON.stringify(request.context || {})}

Analyze CI/CD setup and provide:
1. Current workflow assessment
2. Performance bottlenecks
3. Optimization opportunities
4. Caching strategies
5. Parallelization improvements
6. Cost reduction suggestions
7. Best practices recommendations
8. Specific implementation steps`;

    const aiRequest: AIRequest = {
      prompt,
      systemPrompt,
      model: 'gpt-4o',
      provider: 'openai',
      temperature: 0.4,
      maxTokens: 2500,
    };

    const response = await this.makeAIRequest(aiRequest);
    return response.content;
  }

  /**
   * Get all available modules
   */
  getModules(): ModuleCapability[] {
    return Array.from(this.modules.values());
  }

  /**
   * Get a specific module by ID
   */
  getModule(id: AgentModule): ModuleCapability | undefined {
    return this.modules.get(id);
  }

  /**
   * Enable/disable a module
   */
  setModuleEnabled(id: AgentModule, enabled: boolean): void {
    const module = this.modules.get(id);
    if (module) {
      module.enabled = enabled;
    }
  }
}

// Export singleton instance
export const githubAssistant = GitHubAssistantAgent.getInstance();
