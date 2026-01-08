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

      const response = await this.aiService.makeRequest(aiRequest);
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

    const response = await this.aiService.makeRequest(aiRequest);
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

    const response = await this.aiService.makeRequest(aiRequest);
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

    const response = await this.aiService.makeRequest(aiRequest);
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

    const response = await this.aiService.makeRequest(aiRequest);
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

    const response = await this.aiService.makeRequest(aiRequest);
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

    const response = await this.aiService.makeRequest(aiRequest);
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

    const response = await this.aiService.makeRequest(aiRequest);
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

    const response = await this.aiService.makeRequest(aiRequest);
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

    const response = await this.aiService.makeRequest(aiRequest);
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
