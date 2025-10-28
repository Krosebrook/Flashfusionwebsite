import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Mic, 
  MicOff, 
  Zap,
  Brain,
  AlertTriangle,
  FileText,
  Users,
  BarChart3,
  Settings,
  Volume2,
  Download,
  Share2,
  Maximize2,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '../ui/utils';
import { Agent, ProjectRisk, VoiceCommand, AgentInteraction } from '../../types/multi-agent-orchestration';
import { AGENT_DEFINITIONS, CANVAS_DIMENSIONS } from '../../constants/multi-agent-orchestration';
import { LiveCollaborationCanvas } from './LiveCollaborationCanvas';
import { AgentPersonalityPanel } from './AgentPersonalityPanel';
import { PredictiveFailureDetection } from './PredictiveFailureDetection';
import { VoiceCommandInterface } from './VoiceCommandInterface';
import { LiveDocumentationSystem } from './LiveDocumentationSystem';
import { AgentPerformanceAnalytics } from './AgentPerformanceAnalytics';
import { StakeholderPortal } from './StakeholderPortal';
import { MultiProjectOrchestrator } from './MultiProjectOrchestrator';

interface MultiAgentOrchestrationDashboardProps {
  projectId: string;
  userStats: any;
  setCurrentPage: (page: any) => void;
}

export function MultiAgentOrchestrationDashboard({
  projectId,
  userStats,
  setCurrentPage
}: MultiAgentOrchestrationDashboardProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activeTab, setActiveTab] = useState('canvas');
  const [isOrchestrationActive, setIsOrchestrationActive] = useState(false);
  const [voiceListening, setVoiceListening] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [risks, setRisks] = useState<ProjectRisk[]>([]);
  const [interactions, setInteractions] = useState<AgentInteraction[]>([]);
  const [voiceCommands, setVoiceCommands] = useState<VoiceCommand[]>([]);
  const [canvasMode, setCanvasMode] = useState<'collaboration' | 'conflict' | 'performance'>('collaboration');
  const [showStakeholderView, setShowStakeholderView] = useState(false);
  const [orchestrationStats, setOrchestrationStats] = useState({
    activeAgents: 0,
    completedTasks: 0,
    efficiency: 0,
    collaborationScore: 0
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  // Initialize agents on component mount
  useEffect(() => {
    initializeAgents();
    startOrchestrationMonitoring();
  }, [projectId]);

  const initializeAgents = () => {
    const initialAgents: Agent[] = Object.entries(AGENT_DEFINITIONS).map(([role, definition], index) => ({
      id: `agent-${role}`,
      name: definition.name,
      role: role as any,
      status: index < 6 ? 'active' : 'idle',
      personality: definition.defaultPersonality,
      workload: Math.floor(Math.random() * 80) + 20,
      efficiency: Math.floor(Math.random() * 30) + 70,
      location: {
        x: (index % 4) * 200 + 100,
        y: Math.floor(index / 4) * 200 + 100
      },
      avatar: `agent-${role}.png`,
      capabilities: definition.capabilities,
      connectedAgents: [],
      lastActive: new Date(),
      totalTasksCompleted: Math.floor(Math.random() * 50) + 10,
      averageTaskTime: Math.floor(Math.random() * 120) + 30,
      expertise: Math.floor(Math.random() * 30) + 70
    }));

    setAgents(initialAgents);
  };

  const startOrchestrationMonitoring = () => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      updateAgentStatuses();
      generateRandomInteractions();
      updateOrchestrationStats();
    }, 3000);

    return () => clearInterval(interval);
  };

  const updateAgentStatuses = () => {
    setAgents(prev => prev.map(agent => ({
      ...agent,
      workload: Math.max(0, Math.min(100, agent.workload + (Math.random() - 0.5) * 20)),
      efficiency: Math.max(50, Math.min(100, agent.efficiency + (Math.random() - 0.5) * 10)),
      status: Math.random() > 0.8 ? getRandomStatus() : agent.status,
      lastActive: agent.status === 'active' ? new Date() : agent.lastActive
    })));
  };

  const generateRandomInteractions = () => {
    if (Math.random() > 0.7) {
      const activeAgents = agents.filter(a => a.status === 'active');
      if (activeAgents.length >= 2) {
        const from = activeAgents[Math.floor(Math.random() * activeAgents.length)];
        const to = activeAgents[Math.floor(Math.random() * activeAgents.length)];
        
        if (from.id !== to.id) {
          const interaction: AgentInteraction = {
            id: `interaction-${Date.now()}`,
            fromAgent: from.id,
            toAgent: to.id,
            type: getRandomInteractionType(),
            content: `${from.name} is collaborating with ${to.name}`,
            timestamp: new Date(),
            status: 'in_progress',
            priority: getRandomPriority()
          };
          
          setInteractions(prev => [interaction, ...prev].slice(0, 10));
        }
      }
    }
  };

  const updateOrchestrationStats = () => {
    const activeAgents = agents.filter(a => a.status === 'active').length;
    const avgEfficiency = agents.reduce((sum, a) => sum + a.efficiency, 0) / agents.length;
    const totalTasks = agents.reduce((sum, a) => sum + a.totalTasksCompleted, 0);
    
    setOrchestrationStats({
      activeAgents,
      completedTasks: totalTasks,
      efficiency: Math.round(avgEfficiency),
      collaborationScore: Math.round(interactions.length * 10 + Math.random() * 20)
    });
  };

  const getRandomStatus = () => {
    const statuses = ['active', 'busy', 'idle', 'collaborating'];
    return statuses[Math.floor(Math.random() * statuses.length)] as any;
  };

  const getRandomInteractionType = () => {
    const types = ['handoff', 'collaboration', 'review', 'feedback'];
    return types[Math.floor(Math.random() * types.length)] as any;
  };

  const getRandomPriority = () => {
    const priorities = ['low', 'medium', 'high'];
    return priorities[Math.floor(Math.random() * priorities.length)] as any;
  };

  const toggleOrchestration = () => {
    setIsOrchestrationActive(!isOrchestrationActive);
    // In a real implementation, this would start/stop the orchestration system
  };

  const handleVoiceCommand = (command: VoiceCommand) => {
    setVoiceCommands(prev => [command, ...prev].slice(0, 5));
    // Process the voice command
    processVoiceCommand(command);
  };

  const processVoiceCommand = (command: VoiceCommand) => {
    // Implementation would depend on the specific command
    console.log('Processing voice command:', command);
  };

  const exportOrchestrationData = () => {
    const data = {
      agents,
      interactions,
      risks,
      stats: orchestrationStats,
      timestamp: new Date()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orchestration-data-${projectId}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <Brain className="h-8 w-8 text-primary" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
              </div>
              <h1 className="ff-text-gradient">Multi-Agent Orchestration</h1>
            </div>
            <p className="text-muted-foreground">
              Coordinate and optimize your AI agent workforce with real-time collaboration
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowStakeholderView(!showStakeholderView)}
              variant={showStakeholderView ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              {showStakeholderView ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showStakeholderView ? 'Dev View' : 'Stakeholder View'}
            </Button>
            
            <Button
              onClick={exportOrchestrationData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Data
            </Button>

            <Button
              onClick={toggleOrchestration}
              className={cn(
                "flex items-center gap-2",
                isOrchestrationActive ? "ff-btn-accent" : "ff-btn-primary"
              )}
            >
              {isOrchestrationActive ? (
                <>
                  <Pause className="h-4 w-4" />
                  Pause Orchestration
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Start Orchestration
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Agents</p>
                <p className="text-2xl font-bold text-primary">{orchestrationStats.activeAgents}</p>
              </div>
              <Users className="h-6 w-6 text-primary" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Efficiency</p>
                <p className="text-2xl font-bold text-secondary">{orchestrationStats.efficiency}%</p>
              </div>
              <Zap className="h-6 w-6 text-secondary" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
                <p className="text-2xl font-bold text-accent">{orchestrationStats.completedTasks}</p>
              </div>
              <BarChart3 className="h-6 w-6 text-accent" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Collaboration Score</p>
                <p className="text-2xl font-bold text-primary">{orchestrationStats.collaborationScore}</p>
              </div>
              <Brain className="h-6 w-6 text-primary" />
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      {showStakeholderView ? (
        <StakeholderPortal
          projectId={projectId}
          agents={agents}
          interactions={interactions}
          risks={risks}
          stats={orchestrationStats}
        />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="canvas" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Canvas
            </TabsTrigger>
            <TabsTrigger value="personalities" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Personalities
            </TabsTrigger>
            <TabsTrigger value="risks" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Risks
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Voice
            </TabsTrigger>
            <TabsTrigger value="docs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Docs
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Portfolio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="canvas" className="space-y-6">
            <LiveCollaborationCanvas
              agents={agents}
              interactions={interactions}
              mode={canvasMode}
              onAgentSelect={setSelectedAgent}
              onModeChange={setCanvasMode}
              isActive={isOrchestrationActive}
            />
          </TabsContent>

          <TabsContent value="personalities" className="space-y-6">
            <AgentPersonalityPanel
              agents={agents}
              selectedAgent={selectedAgent}
              onAgentSelect={setSelectedAgent}
              onPersonalityUpdate={(agentId, personality) => {
                setAgents(prev => prev.map(a => 
                  a.id === agentId ? { ...a, personality } : a
                ));
              }}
            />
          </TabsContent>

          <TabsContent value="risks" className="space-y-6">
            <PredictiveFailureDetection
              projectId={projectId}
              agents={agents}
              risks={risks}
              onRiskUpdate={setRisks}
            />
          </TabsContent>

          <TabsContent value="voice" className="space-y-6">
            <VoiceCommandInterface
              isListening={voiceListening}
              onToggleListening={setVoiceListening}
              onCommand={handleVoiceCommand}
              recentCommands={voiceCommands}
              agents={agents}
            />
          </TabsContent>

          <TabsContent value="docs" className="space-y-6">
            <LiveDocumentationSystem
              projectId={projectId}
              agents={agents}
              interactions={interactions}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AgentPerformanceAnalytics
              agents={agents}
              interactions={interactions}
              timeframe="week"
            />
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <MultiProjectOrchestrator
              currentProjectId={projectId}
              agents={agents}
              userStats={userStats}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}