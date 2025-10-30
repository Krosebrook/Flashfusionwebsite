/**
 * @fileoverview Multi-agent orchestration type definitions
 * @module types/multi-agent-orchestration
 */

/**
 * AI agent with role, status, and capabilities
 * @interface Agent
 * @property {string} id - Unique agent identifier
 * @property {string} name - Agent name
 * @property {AgentRole} role - Agent role/specialization
 * @property {AgentStatus} status - Current status
 * @property {AgentPersonality} personality - Personality traits
 * @property {string} [currentTask] - Current task being worked on
 * @property {number} workload - Current workload (0-100)
 * @property {number} efficiency - Efficiency rating (0-100)
 * @property {CanvasPosition} location - Position on canvas
 * @property {string} avatar - Avatar image URL
 * @property {string[]} capabilities - List of capabilities
 * @property {string[]} connectedAgents - Connected agent IDs
 * @property {Date} lastActive - Last activity timestamp
 * @property {number} totalTasksCompleted - Total tasks completed
 * @property {number} averageTaskTime - Average task completion time
 * @property {number} expertise - Expertise level (0-100)
 */
export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  status: AgentStatus;
  personality: AgentPersonality;
  currentTask?: string;
  workload: number; // 0-100
  efficiency: number; // 0-100
  location: CanvasPosition;
  avatar: string;
  capabilities: string[];
  connectedAgents: string[];
  lastActive: Date;
  totalTasksCompleted: number;
  averageTaskTime: number;
  expertise: number; // 0-100
}

/**
 * Agent role specialization types
 * @typedef {'visionary' | 'product_manager' | 'ui_designer' | 'ux_designer' | 
 *           'frontend_developer' | 'backend_developer' | 'qa_engineer' | 
 *           'devops_engineer' | 'project_manager' | 'marketing_specialist' | 
 *           'data_analyst'} AgentRole
 */
export type AgentRole = 
  | 'visionary'
  | 'product_manager' 
  | 'ui_designer'
  | 'ux_designer'
  | 'frontend_developer'
  | 'backend_developer'
  | 'qa_engineer'
  | 'devops_engineer'
  | 'project_manager'
  | 'marketing_specialist'
  | 'data_analyst';

/**
 * Agent current status types
 * @typedef {'active' | 'busy' | 'idle' | 'offline' | 'collaborating' | 
 *           'problem_solving' | 'reviewing'} AgentStatus
 */
export type AgentStatus = 
  | 'active'
  | 'busy'
  | 'idle' 
  | 'offline'
  | 'collaborating'
  | 'problem_solving'
  | 'reviewing';

/**
 * Agent personality configuration
 * @interface AgentPersonality
 * @property {PersonalityTrait[]} traits - Personality traits
 * @property {CommunicationStyle} communicationStyle - Communication style
 * @property {StressResponse[]} stressResponses - Stress responses
 * @property {WorkingStyle} workingStyle - Working style preference
 * @property {CollaborationStyle} collaboration - Collaboration approach
 * @property {DecisionMakingStyle} decisionMaking - Decision-making style
 */
export interface AgentPersonality {
  traits: PersonalityTrait[];
  communicationStyle: CommunicationStyle;
  stressResponses: StressResponse[];
  workingStyle: WorkingStyle;
  collaboration: CollaborationStyle;
  decisionMaking: DecisionMakingStyle;
}

/**
 * Personality trait types for agents
 * @typedef {('optimistic' | 'realistic' | 'analytical' | 'creative' | 'detail_oriented' |
 *            'big_picture' | 'inspirational' | 'methodical' | 'adaptable' | 'skeptical' |
 *            'thorough' | 'innovative' | 'collaborative' | 'independent' | 'focused')} PersonalityTrait
 */
export type PersonalityTrait = 
  | 'optimistic' | 'realistic' | 'analytical' | 'creative' | 'detail_oriented'
  | 'big_picture' | 'inspirational' | 'methodical' | 'adaptable' | 'skeptical'
  | 'thorough' | 'innovative' | 'collaborative' | 'independent' | 'focused';

/**
 * Communication style types for agents
 * @typedef {('enthusiastic' | 'precise' | 'diplomatic' | 'direct' | 'supportive' | 'analytical')} CommunicationStyle
 */
export type CommunicationStyle = 
  | 'enthusiastic' | 'precise' | 'diplomatic' | 'direct' | 'supportive' | 'analytical';

/**
 * Stress response types for agents
 * @typedef {('tunnel_vision' | 'over_promising' | 'perfectionism' | 'bottlenecking')} StressResponse
 */
export type StressResponse = 
  | 'tunnel_vision' | 'over_promising' | 'perfectionism' | 'bottlenecking'
  | 'scope_creep' | 'analysis_paralysis' | 'rushed_decisions' | 'isolation';

export type WorkingStyle = 
  | 'parallel' | 'sequential' | 'iterative' | 'collaborative' | 'independent';

export type CollaborationStyle = 
  | 'leader' | 'supporter' | 'mediator' | 'specialist' | 'facilitator';

export type DecisionMakingStyle = 
  | 'data_driven' | 'intuitive' | 'consensus_based' | 'rapid' | 'deliberate';

export interface CanvasPosition {
  x: number;
  y: number;
  z?: number; // For 3D positioning
}

export interface AgentInteraction {
  id: string;
  fromAgent: string;
  toAgent: string;
  type: InteractionType;
  content: string;
  timestamp: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export type InteractionType = 
  | 'handoff' | 'collaboration' | 'review' | 'feedback' | 'question' 
  | 'conflict_resolution' | 'decision_request' | 'status_update';

export interface ProjectRisk {
  id: string;
  type: RiskType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number; // 0-100
  impact: number; // 0-100
  description: string;
  affectedAgents: string[];
  mitigation: string[];
  timeline: string;
  earlyWarnings: string[];
  status: 'identified' | 'mitigating' | 'resolved' | 'escalated';
}

export type RiskType = 
  | 'scope_creep' | 'team_burnout' | 'technical_debt' | 'stakeholder_alignment'
  | 'timeline_slip' | 'quality_degradation' | 'resource_conflict' | 'dependency_block';

export interface VoiceCommand {
  id: string;
  transcript: string;
  intent: VoiceIntent;
  entities: VoiceEntity[];
  confidence: number;
  timestamp: Date;
  response: string;
  actionTaken?: string;
}

export type VoiceIntent = 
  | 'show_agent_status' | 'schedule_handoff' | 'check_progress' | 'resolve_conflict'
  | 'assign_task' | 'generate_report' | 'predict_risks' | 'optimize_workflow';

export interface VoiceEntity {
  type: 'agent' | 'project' | 'task' | 'date' | 'priority' | 'metric';
  value: string;
  confidence: number;
}

export interface AgentMetrics {
  agentId: string;
  timeframe: 'hour' | 'day' | 'week' | 'month';
  tasksCompleted: number;
  averageTaskTime: number;
  qualityScore: number;
  collaborationScore: number;
  innovationScore: number;
  promptEffectiveness: PromptMetric[];
  handoffSuccessRate: number;
  blockerFrequency: number;
  clientSatisfaction: number;
  learningProgress: number;
}

export interface PromptMetric {
  prompt: string;
  usage: number;
  successRate: number;
  averageResponseTime: number;
  outputQuality: number;
}

export interface LiveDocumentation {
  id: string;
  projectId: string;
  type: DocumentationType;
  title: string;
  content: string;
  lastUpdated: Date;
  updatedBy: string;
  version: number;
  tags: string[];
  status: 'draft' | 'review' | 'approved' | 'published';
  autoGenerated: boolean;
}

export type DocumentationType = 
  | 'technical_specs' | 'user_stories' | 'decision_log' | 'api_docs' 
  | 'troubleshooting' | 'deployment_guide' | 'user_manual' | 'changelog';

export interface StakeholderUpdate {
  id: string;
  projectId: string;
  title: string;
  content: string;
  type: 'milestone' | 'progress' | 'decision' | 'risk' | 'achievement';
  timestamp: Date;
  agentsInvolved: string[];
  clientVisible: boolean;
  priority: 'low' | 'medium' | 'high';
  attachments: string[];
}

export interface ConflictVisualization {
  id: string;
  conflictType: ConflictType;
  severity: number; // 0-100
  agentsInvolved: string[];
  description: string;
  suggestedResolution: string;
  timeline: Date;
  heatMapData: HeatMapPoint[];
}

export type ConflictType = 
  | 'resource_conflict' | 'priority_mismatch' | 'technical_disagreement'
  | 'timeline_conflict' | 'scope_interpretation' | 'quality_standards';

export interface HeatMapPoint {
  x: number;
  y: number;
  intensity: number; // 0-100
  type: 'conflict' | 'collaboration' | 'bottleneck' | 'innovation';
}

export interface CrossProjectSynergy {
  projectIds: string[];
  synergyType: SynergyType;
  opportunity: string;
  impactScore: number;
  implementationEffort: 'low' | 'medium' | 'high';
  timeline: string;
  benefitDescription: string;
}

export type SynergyType = 
  | 'knowledge_transfer' | 'resource_sharing' | 'component_reuse'
  | 'technical_alignment' | 'skill_development' | 'risk_mitigation';