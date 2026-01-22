/**
 * GitHub Assistant Agent Types
 * Defines types and interfaces for the modular GitHub Assistant Agent
 */

export type AgentModule =
  | 'repo-understander'
  | 'code-summarizer'
  | 'pr-reviewer'
  | 'refactoring-advisor'
  | 'test-coverage-advisor'
  | 'issue-triager'
  | 'project-planner'
  | 'security-scanner'
  | 'cicd-inspector';

export interface ModuleCapability {
  id: AgentModule;
  name: string;
  description: string;
  icon: string;
  triggers: string[];
  enabled: boolean;
}

export interface AgentRequest {
  query: string;
  module?: AgentModule;
  context?: {
    repositoryUrl?: string;
    branch?: string;
    filePath?: string;
    prNumber?: number;
    issueNumber?: number;
    commitSha?: string;
  };
  options?: {
    format?: 'text' | 'markdown' | 'json';
    detail?: 'brief' | 'detailed' | 'comprehensive';
  };
}

export interface AgentResponse {
  module: AgentModule;
  result: string;
  metadata: {
    processingTime: number;
    timestamp: string;
    confidence: number;
  };
  recommendations?: Recommendation[];
  insights?: Insight[];
}

export interface Recommendation {
  type: 'action' | 'improvement' | 'warning' | 'info';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category?: string;
}

export interface Insight {
  category: string;
  value: string | number;
  description: string;
}

// Module-specific types

export interface RepositoryStructure {
  rootPath: string;
  directories: DirectoryInfo[];
  files: FileInfo[];
  technologies: Technology[];
  buildTools: string[];
  testingFrameworks: string[];
  dependencies: Dependency[];
}

export interface DirectoryInfo {
  path: string;
  purpose: string;
  fileCount: number;
  importance: 'low' | 'medium' | 'high';
}

export interface FileInfo {
  path: string;
  role: string;
  language: string;
  linesOfCode: number;
  complexity?: number;
}

export interface Technology {
  name: string;
  category: 'framework' | 'library' | 'language' | 'tool' | 'platform';
  version?: string;
  purpose: string;
}

export interface Dependency {
  name: string;
  version: string;
  type: 'production' | 'development';
  purpose: string;
}

export interface CodeSummary {
  filePath: string;
  purpose: string;
  keyFunctions: FunctionInfo[];
  exports: string[];
  imports: string[];
  complexity: 'low' | 'medium' | 'high';
  maintainability: number;
}

export interface FunctionInfo {
  name: string;
  purpose: string;
  parameters: string[];
  returnType?: string;
  complexity: number;
}

export interface PRReview {
  overall: 'approve' | 'request-changes' | 'comment';
  score: number;
  categories: ReviewCategory[];
  issues: ReviewIssue[];
  suggestions: string[];
}

export interface ReviewCategory {
  name: string;
  score: number;
  feedback: string;
}

export interface ReviewIssue {
  severity: 'error' | 'warning' | 'info';
  file: string;
  line?: number;
  message: string;
  suggestion?: string;
}

export interface RefactoringOpportunity {
  type: 'duplication' | 'complexity' | 'naming' | 'structure' | 'performance';
  location: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  suggestion: string;
  codeExample?: string;
}

export interface TestCoverageAnalysis {
  overallCoverage: number;
  lineCoverage: number;
  branchCoverage: number;
  functionCoverage: number;
  untestedFiles: string[];
  criticalGaps: CoverageGap[];
  suggestedTests: TestSuggestion[];
}

export interface CoverageGap {
  file: string;
  lines: number[];
  criticality: 'low' | 'medium' | 'high';
  reason: string;
}

export interface TestSuggestion {
  file: string;
  function: string;
  testCase: string;
  priority: 'low' | 'medium' | 'high';
  example?: string;
}

export interface IssueClassification {
  category: 'bug' | 'feature' | 'enhancement' | 'documentation' | 'question' | 'refactor';
  priority: 'low' | 'medium' | 'high' | 'critical';
  complexity: 'trivial' | 'simple' | 'moderate' | 'complex';
  suggestedLabels: string[];
  estimatedEffort: string;
  nextSteps: string[];
  relatedIssues?: number[];
}

export interface ProjectPlan {
  goal: string;
  epics: Epic[];
  features: Feature[];
  technicalTasks: TechnicalTask[];
  timeline: TimelinePhase[];
  dependencies: Dependency[];
  risks: Risk[];
}

export interface Epic {
  id: string;
  title: string;
  description: string;
  features: string[];
  priority: number;
}

export interface Feature {
  id: string;
  epic: string;
  title: string;
  description: string;
  userStories: string[];
  technicalRequirements: string[];
  estimatedEffort: string;
}

export interface TechnicalTask {
  id: string;
  feature: string;
  title: string;
  description: string;
  type: 'implementation' | 'testing' | 'documentation' | 'deployment';
  estimatedHours: number;
  dependencies: string[];
}

export interface TimelinePhase {
  phase: string;
  duration: string;
  tasks: string[];
  deliverables: string[];
}

export interface Risk {
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
}

export interface SecurityScan {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  vulnerabilities: SecurityVulnerability[];
  secrets: SecretExposure[];
  riskyPatterns: RiskyPattern[];
  recommendations: string[];
  score: number;
}

export interface SecurityVulnerability {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  description: string;
  remediation: string;
  cve?: string;
}

export interface SecretExposure {
  type: string;
  location: string;
  pattern: string;
  confidence: number;
}

export interface RiskyPattern {
  pattern: string;
  location: string;
  risk: string;
  alternative: string;
}

export interface CICDAnalysis {
  workflows: WorkflowInfo[];
  performance: PerformanceMetrics;
  optimizations: Optimization[];
  issues: CICDIssue[];
  bestPractices: BestPracticeCheck[];
}

export interface WorkflowInfo {
  name: string;
  file: string;
  triggers: string[];
  jobs: JobInfo[];
  averageDuration: number;
  successRate: number;
}

export interface JobInfo {
  name: string;
  steps: string[];
  averageDuration: number;
}

export interface PerformanceMetrics {
  averageBuildTime: number;
  averageTestTime: number;
  cacheHitRate: number;
  parallelizationScore: number;
}

export interface Optimization {
  category: 'caching' | 'parallelization' | 'dependencies' | 'configuration';
  description: string;
  impact: 'low' | 'medium' | 'high';
  implementation: string;
  estimatedImprovement: string;
}

export interface CICDIssue {
  severity: 'warning' | 'error';
  workflow: string;
  description: string;
  suggestion: string;
}

export interface BestPracticeCheck {
  practice: string;
  implemented: boolean;
  importance: 'low' | 'medium' | 'high';
  recommendation?: string;
}
