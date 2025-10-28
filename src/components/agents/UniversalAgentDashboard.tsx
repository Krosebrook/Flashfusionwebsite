import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Brain,
  Palette,
  Zap,
  Cog,
  BarChart3,
  Network,
  ChevronRight,
  Sparkles,
  Target,
  TrendingUp,
  Layers,
  Globe
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  type: 'researcher' | 'creator' | 'optimizer' | 'automator' | 'analyzer' | 'orchestrator';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  capabilities: string[];
  status: 'idle' | 'working' | 'completed';
  progress?: number;
  lastActive?: string;
  tasksCompleted: number;
  efficiency: number;
}

const UNIVERSAL_AGENTS: Agent[] = [
  {
    id: 'researcher',
    name: 'Researcher',
    type: 'researcher',
    description: 'Analyzes trends, markets, and user behavior to provide data-driven insights',
    icon: Brain,
    accentColor: '#61dafb', // Cyan
    capabilities: ['Market Analysis', 'User Research', 'Trend Forecasting', 'Competitive Intelligence'],
    status: 'idle',
    lastActive: '2 hours ago',
    tasksCompleted: 847,
    efficiency: 94
  },
  {
    id: 'creator',
    name: 'Creator',
    type: 'creator',
    description: 'Generates content, designs, and creative assets across multiple formats',
    icon: Palette,
    accentColor: '#d14d21', // Orange
    capabilities: ['Content Generation', 'Design Creation', 'Brand Assets', 'Visual Content'],
    status: 'working',
    progress: 68,
    tasksCompleted: 1203,
    efficiency: 96
  },
  {
    id: 'optimizer',
    name: 'Optimizer',
    type: 'optimizer',
    description: 'Enhances performance, conversions, and operational efficiency',
    icon: TrendingUp,
    accentColor: '#10b981', // Green
    capabilities: ['Performance Tuning', 'A/B Testing', 'Conversion Optimization', 'Process Improvement'],
    status: 'completed',
    lastActive: '15 minutes ago',
    tasksCompleted: 623,
    efficiency: 91
  },
  {
    id: 'automator',
    name: 'Automator',
    type: 'automator',
    description: 'Streamlines workflows and automates repetitive business processes',
    icon: Cog,
    accentColor: '#764ba2', // Purple
    capabilities: ['Workflow Automation', 'Task Scheduling', 'Integration Setup', 'Process Optimization'],
    status: 'idle',
    lastActive: '1 hour ago',
    tasksCompleted: 756,
    efficiency: 89
  },
  {
    id: 'analyzer',
    name: 'Analyzer',
    type: 'analyzer',
    description: 'Processes data and generates actionable business intelligence',
    icon: BarChart3,
    accentColor: '#667eea', // Blue
    capabilities: ['Data Analysis', 'Report Generation', 'KPI Tracking', 'Predictive Analytics'],
    status: 'working',
    progress: 34,
    tasksCompleted: 934,
    efficiency: 93
  },
  {
    id: 'orchestrator',
    name: 'Orchestrator',
    type: 'orchestrator',
    description: 'Coordinates multi-agent workflows and manages complex operations',
    icon: Network,
    accentColor: '#2a5298', // Deep Blue
    capabilities: ['Agent Coordination', 'Workflow Management', 'Resource Allocation', 'Quality Control'],
    status: 'idle',
    lastActive: '30 minutes ago',
    tasksCompleted: 542,
    efficiency: 97
  }
];

interface UniversalAgentDashboardProps {
  onAgentSelect: (agentId: string) => void;
  selectedAgent?: string;
}

export function UniversalAgentDashboard({ onAgentSelect, selectedAgent }: UniversalAgentDashboardProps) {
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'working':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: Agent['status']) => {
    switch (status) {
      case 'working':
        return 'Active';
      case 'completed':
        return 'Completed';
      default:
        return 'Ready';
    }
  };

  return (
    <div className="relative">
      {/* FlashFusion Hero Background */}
      <div 
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
        }}
      />
      
      {/* Glassmorphism Container */}
      <div className="relative z-10 p-8">
        <div className="text-center mb-8">
          <motion.h1 
            className="text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Universal AI Agents
          </motion.h1>
          <motion.p 
            className="text-blue-100 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Deploy specialized AI agents to handle different aspects of your business operations
          </motion.p>
        </div>

        {/* Agent Grid - 2x3 Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {UNIVERSAL_AGENTS.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              onHoverStart={() => setHoveredAgent(agent.id)}
              onHoverEnd={() => setHoveredAgent(null)}
            >
              <Card 
                className="relative overflow-hidden cursor-pointer transition-all duration-300 border-transparent"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: selectedAgent === agent.id 
                    ? `2px solid ${agent.accentColor}` 
                    : hoveredAgent === agent.id 
                    ? `1px solid ${agent.accentColor}30` 
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  transform: hoveredAgent === agent.id ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: hoveredAgent === agent.id 
                    ? `0 8px 32px rgba(0,0,0,0.15), 0 0 20px ${agent.accentColor}30`
                    : '0 8px 32px rgba(0,0,0,0.1)'
                }}
                onClick={() => onAgentSelect(agent.id)}
              >
                {/* Agent Icon with Accent Color */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300"
                      style={{ 
                        backgroundColor: `${agent.accentColor}15`,
                        transform: hoveredAgent === agent.id ? 'scale(1.1)' : 'scale(1)'
                      }}
                    >
                      <agent.icon 
                        className="h-7 w-7" 
                        style={{ color: agent.accentColor }}
                      />
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <Badge 
                        className={`${getStatusColor(agent.status)} text-white text-xs px-2 py-1`}
                      >
                        {getStatusText(agent.status)}
                      </Badge>
                      
                      {agent.status === 'working' && agent.progress && (
                        <div className="w-20">
                          <Progress 
                            value={agent.progress} 
                            className="h-2"
                            style={{
                              background: '#f1f5f9'
                            }}
                          />
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              background: agent.accentColor,
                              width: `${agent.progress}%`,
                              position: 'absolute',
                              top: 0,
                              left: 0
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{agent.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {agent.description}
                  </p>

                  {/* Capabilities */}
                  <div className="space-y-3 mb-4">
                    <div className="flex flex-wrap gap-1">
                      {agent.capabilities.slice(0, 2).map((capability) => (
                        <Badge 
                          key={capability} 
                          variant="outline" 
                          className="text-xs border-gray-200 text-gray-600"
                        >
                          {capability}
                        </Badge>
                      ))}
                      {agent.capabilities.length > 2 && (
                        <Badge variant="outline" className="text-xs border-gray-200 text-gray-500">
                          +{agent.capabilities.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {agent.tasksCompleted.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">Tasks Done</div>
                    </div>
                    <div className="text-center">
                      <div 
                        className="text-lg font-bold"
                        style={{ color: agent.accentColor }}
                      >
                        {agent.efficiency}%
                      </div>
                      <div className="text-xs text-gray-500">Efficiency</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    className="w-full transition-all duration-300"
                    style={{
                      background: hoveredAgent === agent.id 
                        ? `linear-gradient(135deg, ${agent.accentColor}, ${agent.accentColor}dd)`
                        : 'transparent',
                      border: `1px solid ${agent.accentColor}`,
                      color: hoveredAgent === agent.id ? 'white' : agent.accentColor
                    }}
                  >
                    Deploy Agent
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>

                  {agent.lastActive && agent.status === 'idle' && (
                    <div className="text-xs text-gray-400 mt-2 text-center">
                      Last active: {agent.lastActive}
                    </div>
                  )}
                </div>

                {/* Subtle accent line */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 transition-opacity duration-300"
                  style={{ 
                    background: agent.accentColor,
                    opacity: hoveredAgent === agent.id ? 1 : 0.3
                  }}
                />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats Footer */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex justify-center space-x-8 text-blue-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {UNIVERSAL_AGENTS.reduce((sum, agent) => sum + agent.tasksCompleted, 0).toLocaleString()}
              </div>
              <div className="text-sm">Total Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {Math.round(UNIVERSAL_AGENTS.reduce((sum, agent) => sum + agent.efficiency, 0) / UNIVERSAL_AGENTS.length)}%
              </div>
              <div className="text-sm">Average Efficiency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {UNIVERSAL_AGENTS.filter(agent => agent.status === 'working').length}
              </div>
              <div className="text-sm">Agents Active</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}