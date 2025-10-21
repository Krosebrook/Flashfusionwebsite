import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Zap, 
  AlertTriangle, 
  TrendingUp,
  Users,
  GitBranch
} from 'lucide-react';
import { cn } from '../ui/utils';
import { Agent, AgentInteraction } from '../../types/multi-agent-orchestration';
import { AGENT_DEFINITIONS, CANVAS_DIMENSIONS, AGENT_CANVAS_SETTINGS } from '../../constants/multi-agent-orchestration';

interface LiveCollaborationCanvasProps {
  agents: Agent[];
  interactions: AgentInteraction[];
  mode: 'collaboration' | 'conflict' | 'performance';
  onAgentSelect: (agentId: string) => void;
  onModeChange: (mode: 'collaboration' | 'conflict' | 'performance') => void;
  isActive: boolean;
}

export function LiveCollaborationCanvas({
  agents,
  interactions,
  mode,
  onAgentSelect,
  onModeChange,
  isActive
}: LiveCollaborationCanvasProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [hoveredAgent, setHoveredAgent] = useState<string>('');
  const [connectionLines, setConnectionLines] = useState<any[]>([]);
  const canvasRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    updateConnectionLines();
  }, [interactions, agents, mode]);

  const updateConnectionLines = () => {
    const lines: any[] = [];
    
    interactions.forEach(interaction => {
      const fromAgent = agents.find(a => a.id === interaction.fromAgent);
      const toAgent = agents.find(a => a.id === interaction.toAgent);
      
      if (fromAgent && toAgent) {
        lines.push({
          id: interaction.id,
          from: fromAgent.location,
          to: toAgent.location,
          type: interaction.type,
          status: interaction.status,
          priority: interaction.priority
        });
      }
    });
    
    setConnectionLines(lines);
  };

  const getAgentStatusColor = (agent: Agent) => {
    switch (agent.status) {
      case 'active': return '#10B981';
      case 'busy': return '#F59E0B';
      case 'idle': return '#6B7280';
      case 'collaborating': return '#3B82F6';
      case 'problem_solving': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getConnectionColor = (type: string, priority: string) => {
    if (mode === 'conflict' && type === 'conflict_resolution') {
      return '#EF4444';
    }
    if (mode === 'collaboration' && type === 'collaboration') {
      return '#10B981';
    }
    if (mode === 'performance') {
      return priority === 'high' ? '#F59E0B' : '#6B7280';
    }
    return '#3B82F6';
  };

  const getAgentSizeModifier = (agent: Agent) => {
    if (mode === 'performance') {
      return (agent.efficiency / 100) * 0.5 + 0.75; // Scale between 0.75 and 1.25
    }
    if (mode === 'collaboration') {
      const collaborationCount = interactions.filter(
        i => i.fromAgent === agent.id || i.toAgent === agent.id
      ).length;
      return Math.min(1.5, 1 + collaborationCount * 0.1);
    }
    return 1;
  };

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent.id);
    onAgentSelect(agent.id);
  };

  const resetCanvasView = () => {
    // Reset agent positions to default
    // In a real implementation, this would restore default layout
    setSelectedAgent('');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300",
      isFullscreen ? "fixed inset-0 z-50" : "h-[600px]"
    )}>
      {/* Canvas Controls */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className="flex bg-background/90 backdrop-blur-sm rounded-lg p-1">
          <Button
            variant={mode === 'collaboration' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onModeChange('collaboration')}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Collaboration
          </Button>
          <Button
            variant={mode === 'conflict' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onModeChange('conflict')}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Conflicts
          </Button>
          <Button
            variant={mode === 'performance' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onModeChange('performance')}
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Performance
          </Button>
        </div>
      </div>

      {/* Canvas Tools */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={resetCanvasView}
          className="bg-background/90 backdrop-blur-sm"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFullscreen}
          className="bg-background/90 backdrop-blur-sm"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Activity Indicator */}
      {isActive && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <Badge variant="secondary" className="ff-pulse-glow">
            <Zap className="h-3 w-3 mr-1" />
            Live Orchestration Active
          </Badge>
        </div>
      )}

      {/* Canvas */}
      <div className="relative w-full h-full bg-gradient-to-br from-background to-muted/20">
        <svg
          ref={canvasRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${CANVAS_DIMENSIONS.width} ${CANVAS_DIMENSIONS.height}`}
          className="absolute inset-0"
        >
          {/* Grid Pattern */}
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-border opacity-20"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Connection Lines */}
          <AnimatePresence>
            {connectionLines.map((line) => (
              <motion.line
                key={line.id}
                x1={line.from.x}
                y1={line.from.y}
                x2={line.to.x}
                y2={line.to.y}
                stroke={getConnectionColor(line.type, line.priority)}
                strokeWidth={AGENT_CANVAS_SETTINGS.connectionLineWidth}
                strokeDasharray={line.status === 'pending' ? '5,5' : 'none'}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.7 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            ))}
          </AnimatePresence>

          {/* Collaboration Zones */}
          {mode === 'collaboration' && (
            <>
              {agents
                .filter(agent => 
                  interactions.some(i => 
                    (i.fromAgent === agent.id || i.toAgent === agent.id) && 
                    i.type === 'collaboration'
                  )
                )
                .map(agent => (
                  <circle
                    key={`zone-${agent.id}`}
                    cx={agent.location.x}
                    cy={agent.location.y}
                    r={AGENT_CANVAS_SETTINGS.collaborationRadius}
                    fill="rgba(16, 185, 129, 0.1)"
                    stroke="rgba(16, 185, 129, 0.3)"
                    strokeWidth="2"
                    strokeDasharray="10,5"
                  />
                ))}
            </>
          )}
        </svg>

        {/* Agents */}
        <div className="absolute inset-0">
          {agents.map((agent) => {
            const definition = AGENT_DEFINITIONS[agent.role];
            const IconComponent = definition.icon;
            const sizeModifier = getAgentSizeModifier(agent);
            
            return (
              <motion.div
                key={agent.id}
                className="absolute cursor-pointer group"
                style={{
                  left: agent.location.x - (AGENT_CANVAS_SETTINGS.agentSize * sizeModifier) / 2,
                  top: agent.location.y - (AGENT_CANVAS_SETTINGS.agentSize * sizeModifier) / 2,
                  width: AGENT_CANVAS_SETTINGS.agentSize * sizeModifier,
                  height: AGENT_CANVAS_SETTINGS.agentSize * sizeModifier
                }}
                animate={{
                  scale: selectedAgent === agent.id ? 1.2 : 1,
                  z: selectedAgent === agent.id ? 10 : 1
                }}
                whileHover={{ scale: 1.1 }}
                onClick={() => handleAgentClick(agent)}
                onMouseEnter={() => setHoveredAgent(agent.id)}
                onMouseLeave={() => setHoveredAgent('')}
              >
                {/* Agent Avatar */}
                <div
                  className={cn(
                    "w-full h-full rounded-full border-4 flex items-center justify-center",
                    "transition-all duration-300 bg-gradient-to-br",
                    definition.color,
                    selectedAgent === agent.id && "ring-4 ring-primary/50",
                    agent.status === 'active' && "animate-pulse"
                  )}
                  style={{
                    borderColor: getAgentStatusColor(agent)
                  }}
                >
                  <IconComponent className="h-1/2 w-1/2 text-white" />
                </div>

                {/* Status Indicator */}
                <div
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background"
                  style={{ backgroundColor: getAgentStatusColor(agent) }}
                />

                {/* Workload Indicator */}
                {mode === 'performance' && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-1 bg-background rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${agent.workload}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Agent Info Tooltip */}
                <AnimatePresence>
                  {(hoveredAgent === agent.id || selectedAgent === agent.id) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-20"
                    >
                      <Card className="p-3 min-w-48 bg-background/95 backdrop-blur-sm">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{agent.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {agent.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Workload:</span>
                              <span>{agent.workload}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Efficiency:</span>
                              <span>{agent.efficiency}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Tasks:</span>
                              <span>{agent.totalTasksCompleted}</span>
                            </div>
                          </div>

                          {agent.currentTask && (
                            <div className="text-xs">
                              <span className="text-muted-foreground">Current: </span>
                              <span className="truncate">{agent.currentTask}</span>
                            </div>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Canvas Legend */}
        <div className="absolute bottom-4 left-4 z-10">
          <Card className="p-3 bg-background/90 backdrop-blur-sm">
            <div className="space-y-2 text-xs">
              <h4 className="font-semibold">Legend</h4>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span>Busy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500" />
                <span>Idle</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>Collaborating</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Real-time Activity Feed */}
        <div className="absolute bottom-4 right-4 z-10 max-w-sm">
          <Card className="p-3 bg-background/90 backdrop-blur-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Recent Activity</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {interactions.slice(0, 3).map((interaction) => {
                  const fromAgent = agents.find(a => a.id === interaction.fromAgent);
                  const toAgent = agents.find(a => a.id === interaction.toAgent);
                  
                  return (
                    <div key={interaction.id} className="text-xs text-muted-foreground">
                      <span className="font-medium">{fromAgent?.name}</span>
                      <span className="mx-1">→</span>
                      <span className="font-medium">{toAgent?.name}</span>
                      <div className="text-xs opacity-75">
                        {interaction.type.replace('_', ' ')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Card>
  );
}