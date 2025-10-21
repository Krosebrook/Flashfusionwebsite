import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { 
  Brain, 
  Heart, 
  MessageCircle, 
  Zap, 
  Users, 
  Target,
  TrendingUp,
  AlertTriangle,
  Settings,
  RefreshCw
} from 'lucide-react';
import { cn } from '../ui/utils';
import { Agent, AgentPersonality } from '../../types/multi-agent-orchestration';
import { AGENT_DEFINITIONS } from '../../constants/multi-agent-orchestration';

interface AgentPersonalityPanelProps {
  agents: Agent[];
  selectedAgent: string;
  onAgentSelect: (agentId: string) => void;
  onPersonalityUpdate: (agentId: string, personality: AgentPersonality) => void;
}

export function AgentPersonalityPanel({
  agents,
  selectedAgent,
  onAgentSelect,
  onPersonalityUpdate
}: AgentPersonalityPanelProps) {
  const [editMode, setEditMode] = useState(false);
  const [personalityForm, setPersonalityForm] = useState<AgentPersonality | null>(null);

  const currentAgent = agents.find(a => a.id === selectedAgent) || agents[0];
  const definition = AGENT_DEFINITIONS[currentAgent?.role];

  const startEdit = () => {
    setPersonalityForm(currentAgent.personality);
    setEditMode(true);
  };

  const savePersonality = () => {
    if (personalityForm && currentAgent) {
      onPersonalityUpdate(currentAgent.id, personalityForm);
      setEditMode(false);
      setPersonalityForm(null);
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setPersonalityForm(null);
  };

  const resetToDefault = () => {
    if (currentAgent) {
      const defaultPersonality = definition.defaultPersonality;
      onPersonalityUpdate(currentAgent.id, defaultPersonality);
      setEditMode(false);
      setPersonalityForm(null);
    }
  };

  const getPersonalityScore = (agent: Agent) => {
    // Calculate a composite personality effectiveness score
    const traits = agent.personality.traits.length * 15;
    const communication = 20; // Base communication score
    const collaboration = agent.personality.collaboration === 'leader' ? 25 : 20;
    const adaptability = agent.personality.stressResponses.length < 3 ? 25 : 15;
    
    return Math.min(100, traits + communication + collaboration + adaptability);
  };

  const getTraitColor = (trait: string) => {
    const colors: Record<string, string> = {
      optimistic: 'bg-green-500',
      analytical: 'bg-blue-500',
      creative: 'bg-purple-500',
      detail_oriented: 'bg-orange-500',
      collaborative: 'bg-teal-500',
      innovative: 'bg-pink-500',
      methodical: 'bg-indigo-500',
      adaptable: 'bg-cyan-500'
    };
    return colors[trait] || 'bg-gray-500';
  };

  const getCommunicationStyleIcon = (style: string) => {
    switch (style) {
      case 'enthusiastic': return <Zap className="h-4 w-4" />;
      case 'precise': return <Target className="h-4 w-4" />;
      case 'diplomatic': return <Users className="h-4 w-4" />;
      case 'analytical': return <Brain className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Agent Selection Sidebar */}
      <div className="col-span-3">
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Select Agent</h3>
          <div className="space-y-2">
            {agents.map((agent) => {
              const agentDefinition = AGENT_DEFINITIONS[agent.role];
              const IconComponent = agentDefinition.icon;
              const score = getPersonalityScore(agent);
              
              return (
                <motion.div
                  key={agent.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={cn(
                      "p-3 cursor-pointer transition-all duration-200",
                      selectedAgent === agent.id 
                        ? "ring-2 ring-primary bg-primary/10" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => onAgentSelect(agent.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg bg-gradient-to-br",
                        agentDefinition.color
                      )}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{agent.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={score} className="h-1 flex-1" />
                          <span className="text-xs text-muted-foreground">{score}%</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Main Personality Panel */}
      <div className="col-span-9">
        {currentAgent && (
          <div className="space-y-6">
            {/* Agent Header */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-4 rounded-xl bg-gradient-to-br",
                    definition.color
                  )}>
                    <definition.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{currentAgent.name}</h2>
                    <p className="text-muted-foreground">{definition.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={resetToDefault}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset
                  </Button>
                  {editMode ? (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={cancelEdit}>
                        Cancel
                      </Button>
                      <Button onClick={savePersonality}>
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={startEdit} className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Edit Personality
                    </Button>
                  )}
                </div>
              </div>

              {/* Personality Score */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {getPersonalityScore(currentAgent)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Overall Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">
                    {currentAgent.efficiency}%
                  </div>
                  <div className="text-sm text-muted-foreground">Efficiency</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {currentAgent.totalTasksCompleted}
                  </div>
                  <div className="text-sm text-muted-foreground">Tasks Done</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {currentAgent.expertise}%
                  </div>
                  <div className="text-sm text-muted-foreground">Expertise</div>
                </div>
              </div>
            </Card>

            {/* Personality Traits */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="flex items-center gap-2 font-semibold mb-4">
                  <Brain className="h-5 w-5 text-primary" />
                  Personality Traits
                </h3>
                
                {editMode ? (
                  <div className="space-y-3">
                    {/* Trait editing would go here */}
                    <p className="text-sm text-muted-foreground">
                      Trait editing interface would be implemented here
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {currentAgent.personality.traits.map((trait) => (
                      <Badge
                        key={trait}
                        variant="secondary"
                        className={cn(
                          "text-white",
                          getTraitColor(trait)
                        )}
                      >
                        {trait.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <h3 className="flex items-center gap-2 font-semibold mb-4">
                  <MessageCircle className="h-5 w-5 text-secondary" />
                  Communication Style
                </h3>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary/20">
                    {getCommunicationStyleIcon(currentAgent.personality.communicationStyle)}
                  </div>
                  <div>
                    <div className="font-medium capitalize">
                      {currentAgent.personality.communicationStyle}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Primary communication approach
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Working Style & Collaboration */}
            <div className="grid grid-cols-3 gap-6">
              <Card className="p-6">
                <h3 className="flex items-center gap-2 font-semibold mb-4">
                  <Zap className="h-5 w-5 text-accent" />
                  Working Style
                </h3>
                
                <div className="text-center">
                  <div className="text-lg font-bold capitalize">
                    {currentAgent.personality.workingStyle}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Preferred work approach
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="flex items-center gap-2 font-semibold mb-4">
                  <Users className="h-5 w-5 text-primary" />
                  Collaboration
                </h3>
                
                <div className="text-center">
                  <div className="text-lg font-bold capitalize">
                    {currentAgent.personality.collaboration}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Team role preference
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="flex items-center gap-2 font-semibold mb-4">
                  <Target className="h-5 w-5 text-secondary" />
                  Decision Making
                </h3>
                
                <div className="text-center">
                  <div className="text-lg font-bold capitalize">
                    {currentAgent.personality.decisionMaking.replace('_', ' ')}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Decision approach
                  </div>
                </div>
              </Card>
            </div>

            {/* Stress Responses */}
            <Card className="p-6">
              <h3 className="flex items-center gap-2 font-semibold mb-4">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Stress Response Patterns
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {currentAgent.personality.stressResponses.map((response) => (
                  <div
                    key={response}
                    className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 border border-orange-200"
                  >
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="capitalize text-sm">
                      {response.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Mitigation:</strong> Monitor these patterns during high-stress periods 
                  and implement appropriate support mechanisms.
                </p>
              </div>
            </Card>

            {/* Personality Analytics */}
            <Card className="p-6">
              <h3 className="flex items-center gap-2 font-semibold mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                Personality Analytics
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Trait Distribution</h4>
                  <div className="space-y-2">
                    {['Creativity', 'Analytics', 'Collaboration', 'Detail Focus'].map((trait) => {
                      const value = Math.floor(Math.random() * 40) + 60;
                      return (
                        <div key={trait} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{trait}</span>
                            <span>{value}%</span>
                          </div>
                          <Progress value={value} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Performance Correlation</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Task Completion Rate</span>
                      <Badge variant="secondary">+12%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Team Collaboration</span>
                      <Badge variant="secondary">+8%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Quality Score</span>
                      <Badge variant="secondary">+15%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Innovation Index</span>
                      <Badge variant="secondary">+6%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}