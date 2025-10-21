import { 
  Brain, 
  Target, 
  Palette, 
  Users, 
  Code, 
  Server, 
  Bug, 
  Settings, 
  BarChart3, 
  Megaphone, 
  TrendingUp 
} from 'lucide-react';
import { Agent, AgentRole } from '../types/multi-agent-orchestration';

export const AGENT_DEFINITIONS: Record<AgentRole, {
  name: string;
  icon: any;
  color: string;
  description: string;
  defaultPersonality: any;
  capabilities: string[];
}> = {
  visionary: {
    name: 'Visionary',
    icon: Brain,
    color: 'from-purple-500 to-indigo-600',
    description: 'Sets the big picture vision and strategic direction',
    defaultPersonality: {
      traits: ['optimistic', 'big_picture', 'inspirational'],
      communicationStyle: 'enthusiastic',
      stressResponses: ['tunnel_vision', 'over_promising'],
      workingStyle: 'collaborative',
      collaboration: 'leader',
      decisionMaking: 'intuitive'
    },
    capabilities: ['Strategy Planning', 'Vision Setting', 'Innovation', 'Leadership']
  },
  product_manager: {
    name: 'Product Manager',
    icon: Target,
    color: 'from-green-500 to-emerald-600',
    description: 'Manages product roadmap and stakeholder requirements',
    defaultPersonality: {
      traits: ['analytical', 'methodical', 'diplomatic'],
      communicationStyle: 'diplomatic',
      stressResponses: ['scope_creep', 'analysis_paralysis'],
      workingStyle: 'iterative',
      collaboration: 'mediator',
      decisionMaking: 'data_driven'
    },
    capabilities: ['Requirement Analysis', 'Roadmap Planning', 'Stakeholder Management', 'Prioritization']
  },
  ui_designer: {
    name: 'UI Designer',
    icon: Palette,
    color: 'from-pink-500 to-rose-600',
    description: 'Creates visual designs and user interfaces',
    defaultPersonality: {
      traits: ['creative', 'detail_oriented', 'innovative'],
      communicationStyle: 'supportive',
      stressResponses: ['perfectionism', 'rushed_decisions'],
      workingStyle: 'iterative',
      collaboration: 'specialist',
      decisionMaking: 'intuitive'
    },
    capabilities: ['Visual Design', 'Prototyping', 'Design Systems', 'Brand Consistency']
  },
  ux_designer: {
    name: 'UX Designer',
    icon: Users,
    color: 'from-blue-500 to-cyan-600',
    description: 'Designs user experiences and interaction flows',
    defaultPersonality: {
      traits: ['analytical', 'collaborative', 'adaptable'],
      communicationStyle: 'analytical',
      stressResponses: ['analysis_paralysis', 'perfectionism'],
      workingStyle: 'collaborative',
      collaboration: 'facilitator',
      decisionMaking: 'data_driven'
    },
    capabilities: ['User Research', 'Information Architecture', 'Interaction Design', 'Usability Testing']
  },
  frontend_developer: {
    name: 'Frontend Developer',
    icon: Code,
    color: 'from-orange-500 to-amber-600',
    description: 'Implements user interfaces and client-side logic',
    defaultPersonality: {
      traits: ['methodical', 'detail_oriented', 'innovative'],
      communicationStyle: 'precise',
      stressResponses: ['perfectionism', 'bottlenecking'],
      workingStyle: 'parallel',
      collaboration: 'specialist',
      decisionMaking: 'deliberate'
    },
    capabilities: ['React/Vue Development', 'CSS/Styling', 'Performance Optimization', 'Responsive Design']
  },
  backend_developer: {
    name: 'Backend Developer',
    icon: Server,
    color: 'from-slate-500 to-gray-600',
    description: 'Builds server-side logic and database systems',
    defaultPersonality: {
      traits: ['analytical', 'methodical', 'focused'],
      communicationStyle: 'precise',
      stressResponses: ['perfectionism', 'isolation'],
      workingStyle: 'sequential',
      collaboration: 'specialist',
      decisionMaking: 'data_driven'
    },
    capabilities: ['API Development', 'Database Design', 'Security', 'Scalability']
  },
  qa_engineer: {
    name: 'QA Engineer',
    icon: Bug,
    color: 'from-red-500 to-pink-600',
    description: 'Tests quality and identifies issues',
    defaultPersonality: {
      traits: ['detail_oriented', 'skeptical', 'thorough'],
      communicationStyle: 'precise',
      stressResponses: ['perfectionism', 'bottlenecking'],
      workingStyle: 'methodical',
      collaboration: 'supporter',
      decisionMaking: 'deliberate'
    },
    capabilities: ['Testing Strategy', 'Bug Detection', 'Quality Assurance', 'Test Automation']
  },
  devops_engineer: {
    name: 'DevOps Engineer',
    icon: Settings,
    color: 'from-teal-500 to-green-600',
    description: 'Manages deployment and infrastructure',
    defaultPersonality: {
      traits: ['methodical', 'focused', 'adaptable'],
      communicationStyle: 'direct',
      stressResponses: ['isolation', 'bottlenecking'],
      workingStyle: 'parallel',
      collaboration: 'specialist',
      decisionMaking: 'rapid'
    },
    capabilities: ['CI/CD', 'Infrastructure', 'Monitoring', 'Security']
  },
  project_manager: {
    name: 'Project Manager',
    icon: BarChart3,
    color: 'from-violet-500 to-purple-600',
    description: 'Coordinates timelines and manages resources',
    defaultPersonality: {
      traits: ['diplomatic', 'methodical', 'collaborative'],
      communicationStyle: 'diplomatic',
      stressResponses: ['scope_creep', 'rushed_decisions'],
      workingStyle: 'collaborative',
      collaboration: 'facilitator',
      decisionMaking: 'consensus_based'
    },
    capabilities: ['Timeline Management', 'Resource Allocation', 'Risk Management', 'Communication']
  },
  marketing_specialist: {
    name: 'Marketing Specialist',
    icon: Megaphone,
    color: 'from-emerald-500 to-teal-600',
    description: 'Creates marketing strategies and campaigns',
    defaultPersonality: {
      traits: ['creative', 'inspirational', 'adaptable'],
      communicationStyle: 'enthusiastic',
      stressResponses: ['over_promising', 'rushed_decisions'],
      workingStyle: 'iterative',
      collaboration: 'supporter',
      decisionMaking: 'intuitive'
    },
    capabilities: ['Campaign Strategy', 'Content Creation', 'Market Analysis', 'Brand Management']
  },
  data_analyst: {
    name: 'Data Analyst',
    icon: TrendingUp,
    color: 'from-cyan-500 to-blue-600',
    description: 'Analyzes data and provides insights',
    defaultPersonality: {
      traits: ['analytical', 'methodical', 'thorough'],
      communicationStyle: 'analytical',
      stressResponses: ['analysis_paralysis', 'perfectionism'],
      workingStyle: 'sequential',
      collaboration: 'specialist',
      decisionMaking: 'data_driven'
    },
    capabilities: ['Data Analysis', 'Reporting', 'Insights Generation', 'Metrics Tracking']
  }
};

export const CANVAS_DIMENSIONS = {
  width: 1200,
  height: 800,
  padding: 50
};

export const AGENT_CANVAS_SETTINGS = {
  agentSize: 60,
  connectionLineWidth: 2,
  animationDuration: 300,
  collaborationRadius: 150,
  conflictRadius: 100
};

export const RISK_SEVERITY_COLORS = {
  low: '#10B981',
  medium: '#F59E0B', 
  high: '#EF4444',
  critical: '#DC2626'
};

export const RISK_PROBABILITY_THRESHOLDS = {
  scope_creep: 75,
  team_burnout: 60,
  technical_debt: 80,
  stakeholder_alignment: 45,
  timeline_slip: 70,
  quality_degradation: 55,
  resource_conflict: 40,
  dependency_block: 65
};

export const VOICE_COMMAND_PATTERNS = {
  'show_agent_status': [
    'show me {agent} status',
    'how is {agent} doing',
    'what is {agent} working on',
    '{agent} progress'
  ],
  'schedule_handoff': [
    'schedule handoff from {agent} to {agent}',
    'create handoff between {agent} and {agent}',
    'set up transfer from {agent} to {agent}'
  ],
  'check_progress': [
    'show project progress',
    'how are we doing',
    'project status',
    'overall progress'
  ],
  'resolve_conflict': [
    'resolve conflict between {agent} and {agent}',
    'fix issue with {agent}',
    'help {agent} and {agent} collaborate'
  ]
};

export const DOCUMENTATION_TEMPLATES = {
  technical_specs: {
    sections: ['Overview', 'Architecture', 'API Reference', 'Database Schema', 'Security'],
    autoUpdate: true,
    reviewRequired: true
  },
  user_stories: {
    sections: ['Epic', 'User Story', 'Acceptance Criteria', 'Definition of Done'],
    autoUpdate: true,
    reviewRequired: false
  },
  decision_log: {
    sections: ['Decision', 'Context', 'Options Considered', 'Outcome', 'Consequences'],
    autoUpdate: true,
    reviewRequired: false
  },
  api_docs: {
    sections: ['Endpoints', 'Authentication', 'Request/Response', 'Error Codes', 'Examples'],
    autoUpdate: true,
    reviewRequired: true
  }
};

export const STAKEHOLDER_UPDATE_TEMPLATES = {
  milestone: 'We\'ve successfully completed {milestone}. This brings us {percentage}% closer to our goal.',
  progress: 'Great progress this week! {agent} completed {tasks} tasks, and we\'re on track for {timeline}.',
  decision: 'Important decision made: {decision}. This will {impact} and is expected to {timeline}.',
  risk: 'We\'ve identified a potential risk: {risk}. Our mitigation plan includes {mitigation}.',
  achievement: 'Exciting news! We\'ve achieved {achievement}. This demonstrates our commitment to {value}.'
};

export const SYNERGY_OPPORTUNITIES = {
  knowledge_transfer: {
    threshold: 70,
    weight: 0.8,
    description: 'Share learnings and best practices between projects'
  },
  resource_sharing: {
    threshold: 60,
    weight: 0.9,
    description: 'Optimize agent allocation across multiple projects'
  },
  component_reuse: {
    threshold: 80,
    weight: 0.7,
    description: 'Reuse components and solutions from other projects'
  },
  technical_alignment: {
    threshold: 75,
    weight: 0.6,
    description: 'Align technical standards and architectures'
  }
};