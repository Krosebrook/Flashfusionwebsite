import { 
  Brain, 
  Users, 
  Layers, 
  Settings, 
  Share2 
} from 'lucide-react';
import { 
  PROJECT_STATUS_COLORS, 
  PRIORITY_COLORS, 
  PERFORMANCE_GRADE_CONFIG,
  IMPLEMENTATION_EFFORT_COLORS,
  BOTTLENECK_RISK_COLORS
} from '../constants/multi-project-orchestrator';
import { Agent, AgentMetrics } from '../types/multi-agent-orchestration';

export const getProjectStatusColor = (status: string) => {
  return PROJECT_STATUS_COLORS[status as keyof typeof PROJECT_STATUS_COLORS] || 'text-gray-600 bg-gray-100';
};

export const getPriorityColor = (priority: string) => {
  return PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] || 'border-gray-500 text-gray-700';
};

export const getImplementationEffortColor = (effort: string) => {
  return IMPLEMENTATION_EFFORT_COLORS[effort as keyof typeof IMPLEMENTATION_EFFORT_COLORS] || 'bg-gray-100 text-gray-800';
};

export const getBottleneckRiskColor = (risk: string) => {
  return BOTTLENECK_RISK_COLORS[risk as keyof typeof BOTTLENECK_RISK_COLORS] || 'border-gray-500 text-gray-700';
};

export const getSynergyIcon = (type: string) => {
  switch (type) {
    case 'knowledge_transfer': return Brain;
    case 'resource_sharing': return Users;
    case 'component_reuse': return Layers;
    case 'technical_alignment': return Settings;
    default: return Share2;
  }
};

export const getPerformanceGrade = (score: number) => {
  const gradeConfig = PERFORMANCE_GRADE_CONFIG.find(config => score >= config.threshold);
  return gradeConfig || PERFORMANCE_GRADE_CONFIG[PERFORMANCE_GRADE_CONFIG.length - 1];
};

export const calculateOverallPerformance = (agentMetrics: AgentMetrics) => {
  return Math.round(
    (agentMetrics.qualityScore + 
     agentMetrics.collaborationScore + 
     agentMetrics.innovationScore + 
     agentMetrics.handoffSuccessRate + 
     agentMetrics.clientSatisfaction) / 5
  );
};

export const getTotalProjectProgress = (projects: any[]) => {
  return Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length);
};

export const getActiveAgentsCount = (agents: Agent[]) => {
  return agents.filter(a => a.status === 'active').length;
};

export const generateResourceAllocation = (agents: Agent[], projects: any[]) => {
  return agents.map(agent => {
    const allocation = Math.random() * 100;
    const efficiency = agent.efficiency + Math.random() * 10 - 5;
    
    return {
      agentId: agent.id,
      agentName: agent.name,
      currentAllocation: allocation,
      recommendedAllocation: Math.min(100, allocation + Math.random() * 20 - 10),
      projectDistribution: [
        { projectId: 'proj-1', percentage: Math.random() * 60 + 20 },
        { projectId: 'proj-2', percentage: Math.random() * 40 + 10 },
        { projectId: 'proj-3', percentage: Math.random() * 20 + 5 }
      ],
      efficiency,
      utilization: Math.random() * 30 + 70,
      bottleneckRisk: efficiency < 75 ? 'medium' : 'low'
    };
  });
};