import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Brain, 
  Users, 
  Mic, 
  FileText, 
  TrendingUp, 
  Eye,
  Layers,
  Zap,
  Settings,
  RefreshCw,
  Download
} from 'lucide-react';

// Import orchestration components
import { MultiAgentOrchestrationDashboard } from '../agents/MultiAgentOrchestrationDashboard';
import { LiveCollaborationCanvas } from '../agents/LiveCollaborationCanvas';
import { AgentPersonalityPanel } from '../agents/AgentPersonalityPanel';
import { PredictiveFailureDetection } from '../agents/PredictiveFailureDetection';
import { VoiceCommandInterface } from '../agents/VoiceCommandInterface';
import { LiveDocumentationSystem } from '../agents/LiveDocumentationSystem';
import { AgentPerformanceAnalytics } from '../agents/AgentPerformanceAnalytics';
import { StakeholderPortal } from '../agents/StakeholderPortal';
import { MultiProjectOrchestrator } from '../agents/MultiProjectOrchestrator';

// Import types
import { Agent, AgentInteraction, ProjectRisk, VoiceCommand } from '../../types/multi-agent-orchestration';
import { UserStats } from '../../types';

// Import constants
import { AGENT_DEFINITIONS } from '../../constants/multi-agent-orchestration';

interface MultiAgentOrchestrationPageProps {
  userStats?: UserStats;
  user?: any;
}

export function MultiAgentOrchestrationPage({ userStats, user }: MultiAgentOrchestrationPageProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isListening, setIsListening] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [timeframe, setTimeframe] = useState<'hour' | 'day' | 'week' | 'month'>('day');
  
  // Orchestration state
  const [agents, setAgents] = useState<Agent[]>([]);
  const [interactions, setInteractions] = useState<AgentInteraction[]>([]);
  const [risks, setRisks] = useState<ProjectRisk[]>([]);
  const [voiceCommands, setVoiceCommands] = useState<VoiceCommand[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize the orchestration system
  useEffect(() => {
    initializeOrchestration();
  }, []);

  const initializeOrchestration = async () => {
    // Generate initial agents based on definitions
    const initialAgents: Agent[] = Object.entries(AGENT_DEFINITIONS).map(([role, definition], index) => ({
      id: `agent-${role}`,
      name: definition.name,
      role: role as any,
      status: 'active' as any,
      personality: definition.defaultPersonality,
      workload: Math.floor(Math.random() * 40) + 30,
      efficiency: Math.floor(Math.random() * 30) + 70,
      location: {
        x: 100 + (index % 4) * 250,
        y: 100 + Math.floor(index / 4) * 200
      },
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`,
      capabilities: definition.capabilities,
      connectedAgents: [],
      lastActive: new Date(),
      totalTasksCompleted: Math.floor(Math.random() * 50) + 10,
      averageTaskTime: Math.floor(Math.random() * 60) + 30,
      expertise: Math.floor(Math.random() * 30) + 70,
      currentTask: generateRandomTask(definition.name)
    }));

    setAgents(initialAgents);
    setIsInitialized(true);

    // Generate some initial interactions
    generateInitialInteractions(initialAgents);
  };

  const generateRandomTask = (agentName: string) => {
    const tasks = {
      'Visionary': [
        'Developing strategic roadmap for Q2',
        'Analyzing market opportunities',
        'Reviewing product vision alignment',
        'Planning innovation initiatives'
      ],
      'Product Manager': [
        'Prioritizing backlog items',
        'Gathering stakeholder feedback',
        'Updating product requirements',
        'Coordinating with development team'
      ],
      'UI Designer': [
        'Creating component library',
        'Designing user interface mockups',
        'Updating design system',
        'Conducting design reviews'
      ],
      'Frontend Developer': [
        'Implementing React components',
        'Optimizing bundle performance',
        'Adding responsive layouts',
        'Writing unit tests'
      ],
      'Backend Developer': [
        'Building REST API endpoints',
        'Optimizing database queries',
        'Implementing authentication',
        'Setting up monitoring'
      ],
      'QA Engineer': [
        'Writing automated tests',
        'Performing regression testing',
        'Reviewing code quality',
        'Testing user workflows'
      ]
    };

    const agentTasks = tasks[agentName as keyof typeof tasks] || ['Working on assigned tasks'];
    return agentTasks[Math.floor(Math.random() * agentTasks.length)];
  };

  const generateInitialInteractions = (agentList: Agent[]) => {
    const newInteractions: AgentInteraction[] = [
      {
        id: 'int-1',
        fromAgent: 'agent-ui_designer',
        toAgent: 'agent-frontend_developer',
        type: 'handoff',
        content: 'Design mockups ready for implementation',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: 'completed',
        priority: 'medium'
      },
      {
        id: 'int-2',
        fromAgent: 'agent-product_manager',
        toAgent: 'agent-backend_developer',
        type: 'collaboration',
        content: 'API requirements for user authentication',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        status: 'in_progress',
        priority: 'high'
      },
      {
        id: 'int-3',
        fromAgent: 'agent-qa_engineer',
        toAgent: 'agent-frontend_developer',
        type: 'feedback',
        content: 'Found UI inconsistency in navigation component',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        status: 'pending',
        priority: 'medium'
      }
    ];

    setInteractions(newInteractions);
  };

  const handleVoiceCommand = (command: VoiceCommand) => {
    setVoiceCommands(prev => [command, ...prev.slice(0, 9)]); // Keep last 10 commands
    
    // Handle specific voice commands
    switch (command.intent) {
      case 'show_agent_status':
        setActiveTab('dashboard');
        break;
      case 'check_progress':
        setActiveTab('analytics');
        break;
      case 'schedule_handoff':
        setActiveTab('canvas');
        break;
      case 'resolve_conflict':
        setActiveTab('risks');
        break;
    }
  };

  const handleRiskUpdate = (updatedRisks: ProjectRisk[]) => {
    setRisks(updatedRisks);
  };

  const handleAgentUpdate = (updatedAgents: Agent[]) => {
    setAgents(updatedAgents);
  };

  const orchestrationStats = {
    activeAgents: agents.filter(a => a.status === 'active').length,
    completedTasks: agents.reduce((sum, a) => sum + a.totalTasksCompleted, 0),
    efficiency: Math.round(agents.reduce((sum, a) => sum + a.efficiency, 0) / agents.length),
    collaborationScore: 87 // Calculated based on interactions
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
          <div className="text-lg font-semibold">Initializing Multi-Agent Orchestration...</div>
          <div className="text-sm text-muted-foreground">Setting up 11 specialized AI agents</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold ff-text-gradient">Multi-Agent Orchestration</h1>
          <p className="text-muted-foreground mt-2">
            Command center for 11 specialized AI agents working in perfect harmony
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge className="bg-primary/20 text-primary border-primary/30 px-3 py-1">
            {orchestrationStats.activeAgents} Active Agents
          </Badge>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="flex items-center gap-2 ff-btn-primary">
            <RefreshCw className="h-4 w-4" />
            Optimize System
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 ff-card-interactive">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Active Agents</div>
              <div className="text-2xl font-bold text-primary">{orchestrationStats.activeAgents}</div>
            </div>
            <Users className="h-6 w-6 text-primary" />
          </div>
        </Card>

        <Card className="p-4 ff-card-interactive">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Tasks Completed</div>
              <div className="text-2xl font-bold text-secondary">{orchestrationStats.completedTasks}</div>
            </div>
            <Zap className="h-6 w-6 text-secondary" />
          </div>
        </Card>

        <Card className="p-4 ff-card-interactive">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">System Efficiency</div>
              <div className="text-2xl font-bold text-accent">{orchestrationStats.efficiency}%</div>
            </div>
            <TrendingUp className="h-6 w-6 text-accent" />
          </div>
        </Card>

        <Card className="p-4 ff-card-interactive">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Collaboration Score</div>
              <div className="text-2xl font-bold text-primary">{orchestrationStats.collaborationScore}</div>
            </div>
            <Brain className="h-6 w-6 text-primary" />
          </div>
        </Card>
      </div>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="canvas" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">Canvas</span>
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            <span className="hidden sm:inline">Voice</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="risks" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Risks</span>
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Portfolio</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <MultiAgentOrchestrationDashboard
            agents={agents}
            interactions={interactions}
            risks={risks}
            userStats={userStats}
            onAgentSelect={setSelectedAgent}
            onAgentUpdate={handleAgentUpdate}
          />
        </TabsContent>

        <TabsContent value="canvas" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <LiveCollaborationCanvas
                agents={agents}
                interactions={interactions}
                onAgentMove={handleAgentUpdate}
                onInteractionCreate={(interaction) => setInteractions(prev => [interaction, ...prev])}
                selectedAgent={selectedAgent}
                onAgentSelect={setSelectedAgent}
              />
            </div>
            <div>
              {selectedAgent && (
                <AgentPersonalityPanel
                  agent={agents.find(a => a.id === selectedAgent)!}
                  onPersonalityUpdate={(agentId, personality) => {
                    setAgents(prev => prev.map(a => 
                      a.id === agentId ? { ...a, personality } : a
                    ));
                  }}
                />
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="voice" className="space-y-6">
          <VoiceCommandInterface
            isListening={isListening}
            onToggleListening={setIsListening}
            onCommand={handleVoiceCommand}
            recentCommands={voiceCommands}
            agents={agents}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AgentPerformanceAnalytics
            agents={agents}
            interactions={interactions}
            timeframe={timeframe}
          />
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          <PredictiveFailureDetection
            projectId="current-project"
            agents={agents}
            risks={risks}
            onRiskUpdate={handleRiskUpdate}
          />
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          <MultiProjectOrchestrator
            currentProjectId="current-project"
            agents={agents}
            userStats={userStats}
          />
        </TabsContent>
      </Tabs>

      {/* Enterprise Features */}
      {userStats?.subscription === 'enterprise' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-border pt-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              Enterprise
            </Badge>
            <h3 className="text-lg font-semibold">Advanced Features</h3>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-6">
            <StakeholderPortal
              projectId="current-project"
              agents={agents}
              interactions={interactions}
              risks={risks}
              stats={orchestrationStats}
            />
            
            <LiveDocumentationSystem
              projectId="current-project"
              agents={agents}
              interactions={interactions}
            />
          </div>
        </motion.div>
      )}

      {/* Pro/Free Tier Upgrade Prompt */}
      {userStats?.subscription !== 'enterprise' && (
        <Card className="p-6 border-gradient-to-r from-primary/20 to-secondary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-2">Unlock Advanced Orchestration Features</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Get stakeholder portals, live documentation, advanced analytics and more with Enterprise tier.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Stakeholder Dashboards</Badge>
                <Badge variant="secondary">Live Documentation</Badge>
                <Badge variant="secondary">Advanced Risk Analysis</Badge>
                <Badge variant="secondary">Multi-Project Synergies</Badge>
              </div>
            </div>
            <Button className="ff-btn-primary">
              Upgrade to Enterprise
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}