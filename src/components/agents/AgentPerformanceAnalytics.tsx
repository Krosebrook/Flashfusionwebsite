import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Clock, 
  Target,
  Zap,
  Users,
  Brain,
  Settings,
  Download,
  RefreshCw,
  Award,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../ui/utils';
import { Agent, AgentInteraction, AgentMetrics } from '../../types/multi-agent-orchestration';

interface AgentPerformanceAnalyticsProps {
  agents: Agent[];
  interactions: AgentInteraction[];
  timeframe: 'hour' | 'day' | 'week' | 'month';
}

export function AgentPerformanceAnalytics({
  agents,
  interactions,
  timeframe
}: AgentPerformanceAnalyticsProps) {
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [metrics, setMetrics] = useState<AgentMetrics[]>([]);
  const [performanceTrends, setPerformanceTrends] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);

  useEffect(() => {
    generatePerformanceMetrics();
  }, [agents, interactions, selectedTimeframe]);

  const generatePerformanceMetrics = async () => {
    setIsAnalyzing(true);
    
    // Simulate analytics processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const agentMetrics: AgentMetrics[] = agents.map(agent => ({
      agentId: agent.id,
      timeframe: selectedTimeframe,
      tasksCompleted: Math.floor(Math.random() * 50) + 10,
      averageTaskTime: Math.floor(Math.random() * 120) + 30,
      qualityScore: Math.floor(Math.random() * 30) + 70,
      collaborationScore: Math.floor(Math.random() * 40) + 60,
      innovationScore: Math.floor(Math.random() * 35) + 65,
      promptEffectiveness: generatePromptMetrics(),
      handoffSuccessRate: Math.floor(Math.random() * 20) + 80,
      blockerFrequency: Math.floor(Math.random() * 5),
      clientSatisfaction: Math.floor(Math.random() * 25) + 75,
      learningProgress: Math.floor(Math.random() * 30) + 70
    }));
    
    const trends = generatePerformanceTrends();
    
    setMetrics(agentMetrics);
    setPerformanceTrends(trends);
    setIsAnalyzing(false);
  };

  const generatePromptMetrics = () => [
    {
      prompt: "Analyze user requirements and create feature specifications",
      usage: Math.floor(Math.random() * 20) + 5,
      successRate: Math.floor(Math.random() * 20) + 80,
      averageResponseTime: Math.floor(Math.random() * 5000) + 2000,
      outputQuality: Math.floor(Math.random() * 20) + 80
    },
    {
      prompt: "Generate code implementation based on design specs",
      usage: Math.floor(Math.random() * 15) + 3,
      successRate: Math.floor(Math.random() * 15) + 85,
      averageResponseTime: Math.floor(Math.random() * 3000) + 1500,
      outputQuality: Math.floor(Math.random() * 25) + 75
    },
    {
      prompt: "Review and provide feedback on deliverables",
      usage: Math.floor(Math.random() * 10) + 8,
      successRate: Math.floor(Math.random() * 10) + 90,
      averageResponseTime: Math.floor(Math.random() * 2000) + 1000,
      outputQuality: Math.floor(Math.random() * 15) + 85
    }
  ];

  const generatePerformanceTrends = () => {
    return Array.from({ length: 7 }, (_, i) => ({
      day: `Day ${i + 1}`,
      efficiency: Math.floor(Math.random() * 20) + 70,
      collaboration: Math.floor(Math.random() * 25) + 65,
      innovation: Math.floor(Math.random() * 30) + 60,
      quality: Math.floor(Math.random() * 15) + 80
    }));
  };

  const getPerformanceGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 85) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 80) return { grade: 'B+', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 75) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 70) return { grade: 'C+', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { grade: 'C', color: 'text-orange-600', bg: 'bg-orange-100' };
  };

  const getAgentMetrics = (agentId: string) => {
    return metrics.find(m => m.agentId === agentId);
  };

  const calculateOverallPerformance = (agentMetrics: AgentMetrics) => {
    return Math.round(
      (agentMetrics.qualityScore + 
       agentMetrics.collaborationScore + 
       agentMetrics.innovationScore + 
       agentMetrics.handoffSuccessRate + 
       agentMetrics.clientSatisfaction) / 5
    );
  };

  const topPerformers = metrics
    .map(m => ({
      ...m,
      agent: agents.find(a => a.id === m.agentId)!,
      overallScore: calculateOverallPerformance(m)
    }))
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 3);

  const selectedAgentMetrics = selectedAgent ? getAgentMetrics(selectedAgent) : null;
  const selectedAgentData = selectedAgent ? agents.find(a => a.id === selectedAgent) : null;

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Efficiency</p>
              <p className="text-2xl font-bold text-primary">
                {metrics.length > 0 ? Math.round(metrics.reduce((sum, m) => sum + m.qualityScore, 0) / metrics.length) : 0}%
              </p>
            </div>
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Collaboration Score</p>
              <p className="text-2xl font-bold text-secondary">
                {metrics.length > 0 ? Math.round(metrics.reduce((sum, m) => sum + m.collaborationScore, 0) / metrics.length) : 0}%
              </p>
            </div>
            <Users className="h-6 w-6 text-secondary" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Innovation Index</p>
              <p className="text-2xl font-bold text-accent">
                {metrics.length > 0 ? Math.round(metrics.reduce((sum, m) => sum + m.innovationScore, 0) / metrics.length) : 0}%
              </p>
            </div>
            <Brain className="h-6 w-6 text-accent" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tasks Completed</p>
              <p className="text-2xl font-bold text-primary">
                {metrics.reduce((sum, m) => sum + m.tasksCompleted, 0)}
              </p>
            </div>
            <Target className="h-6 w-6 text-primary" />
          </div>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="bg-card border border-border rounded-md px-3 py-2 text-sm"
          >
            <option value="hour">Last Hour</option>
            <option value="day">Last Day</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>

          <Button
            onClick={generatePerformanceMetrics}
            disabled={isAnalyzing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", isAnalyzing && "animate-spin")} />
            Refresh Data
          </Button>
        </div>

        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Analytics
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="individual">Individual Analysis</TabsTrigger>
          <TabsTrigger value="learning">Learning & Optimization</TabsTrigger>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Top Performers */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Top Performers</h3>
            <div className="grid gap-4">
              {topPerformers.map((performer, index) => {
                const grade = getPerformanceGrade(performer.overallScore);
                return (
                  <div key={performer.agentId} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Badge className={cn("text-xs px-2 py-1", grade.bg, grade.color)}>
                          #{index + 1}
                        </Badge>
                        {index === 0 && <Award className="h-4 w-4 text-yellow-500" />}
                      </div>
                      <span className="font-medium">{performer.agent.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {performer.agent.role.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{performer.overallScore}%</div>
                        <div className="text-xs text-muted-foreground">Overall Score</div>
                      </div>
                      <Badge className={cn("text-xs", grade.bg, grade.color)}>
                        {grade.grade}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Agent Performance Grid */}
          <div className="grid gap-4">
            {agents.map(agent => {
              const agentMetrics = getAgentMetrics(agent.id);
              if (!agentMetrics) return null;

              const overallScore = calculateOverallPerformance(agentMetrics);
              const grade = getPerformanceGrade(overallScore);

              return (
                <Card key={agent.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{agent.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {agent.role.replace('_', ' ')}
                      </Badge>
                    </div>
                    <Badge className={cn("text-xs", grade.bg, grade.color)}>
                      {grade.grade}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-5 gap-4">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Quality</div>
                      <Progress value={agentMetrics.qualityScore} className="h-2" />
                      <div className="text-xs">{agentMetrics.qualityScore}%</div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Collaboration</div>
                      <Progress value={agentMetrics.collaborationScore} className="h-2" />
                      <div className="text-xs">{agentMetrics.collaborationScore}%</div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Innovation</div>
                      <Progress value={agentMetrics.innovationScore} className="h-2" />
                      <div className="text-xs">{agentMetrics.innovationScore}%</div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Handoffs</div>
                      <Progress value={agentMetrics.handoffSuccessRate} className="h-2" />
                      <div className="text-xs">{agentMetrics.handoffSuccessRate}%</div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Client Satisfaction</div>
                      <Progress value={agentMetrics.clientSatisfaction} className="h-2" />
                      <div className="text-xs">{agentMetrics.clientSatisfaction}%</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <div className="text-sm text-muted-foreground">
                      {agentMetrics.tasksCompleted} tasks • {agentMetrics.averageTaskTime}min avg
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedAgent(selectedAgent === agent.id ? '' : agent.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="individual" className="space-y-6">
          {/* Agent Selector */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Select Agent for Detailed Analysis</h3>
            <div className="grid grid-cols-3 gap-2">
              {agents.map(agent => (
                <Button
                  key={agent.id}
                  variant={selectedAgent === agent.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedAgent(agent.id)}
                  className="justify-start"
                >
                  {agent.name}
                </Button>
              ))}
            </div>
          </Card>

          {/* Individual Agent Analysis */}
          {selectedAgentMetrics && selectedAgentData && (
            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">{selectedAgentData.name} Performance Analysis</h3>
                
                {/* Detailed Metrics */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">Task Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tasks Completed:</span>
                        <span className="font-medium">{selectedAgentMetrics.tasksCompleted}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Average Time:</span>
                        <span className="font-medium">{selectedAgentMetrics.averageTaskTime}min</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Blocker Frequency:</span>
                        <span className="font-medium">{selectedAgentMetrics.blockerFrequency}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Quality Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Quality Score:</span>
                        <span className="font-medium">{selectedAgentMetrics.qualityScore}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Client Satisfaction:</span>
                        <span className="font-medium">{selectedAgentMetrics.clientSatisfaction}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Innovation Index:</span>
                        <span className="font-medium">{selectedAgentMetrics.innovationScore}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Learning Progress</h4>
                    <div className="space-y-2">
                      <Progress value={selectedAgentMetrics.learningProgress} className="h-3" />
                      <div className="text-center text-sm font-medium">
                        {selectedAgentMetrics.learningProgress}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prompt Effectiveness */}
                <div className="space-y-3">
                  <h4 className="font-medium">Most Effective Prompts</h4>
                  <div className="space-y-2">
                    {selectedAgentMetrics.promptEffectiveness.map((prompt, index) => (
                      <div key={index} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium line-clamp-1">{prompt.prompt}</span>
                          <Badge variant="secondary" className="text-xs ml-2">
                            {prompt.successRate}% success
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                          <span>Used {prompt.usage}x</span>
                          <span>{prompt.averageResponseTime}ms avg</span>
                          <span>Quality: {prompt.outputQuality}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Learning & Optimization Insights</h3>
            
            <div className="space-y-6">
              {/* Optimization Recommendations */}
              <div>
                <h4 className="font-medium mb-3">Optimization Recommendations</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-800">High Collaboration Performance</div>
                      <div className="text-sm text-green-700">
                        UI Designer and Frontend Developer show excellent handoff patterns. 
                        Consider replicating this model for other agent pairs.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-yellow-800">Prompt Optimization Opportunity</div>
                      <div className="text-sm text-yellow-700">
                        Backend Developer's API generation prompts have 73% success rate. 
                        Suggested improvement: Add more specific context about data models.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-800">Learning Pattern Detected</div>
                      <div className="text-sm text-blue-700">
                        QA Engineer's efficiency increased 18% after implementing automated testing prompts.
                        Recommend similar automation for other repetitive tasks.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Learning Progress by Agent */}
              <div>
                <h4 className="font-medium mb-3">Learning Progress Tracking</h4>
                <div className="grid gap-3">
                  {metrics.map(metric => {
                    const agent = agents.find(a => a.id === metric.agentId);
                    if (!agent) return null;

                    return (
                      <div key={metric.agentId} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{agent.name}</span>
                          <Progress value={metric.learningProgress} className="w-32 h-2" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {metric.learningProgress}% progress
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Performance Trends</h3>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Performance metrics over the last 7 days showing efficiency, collaboration, innovation, and quality scores.
              </div>
              
              {/* Simple trend visualization */}
              <div className="grid gap-4">
                {performanceTrends.map((trend, index) => (
                  <div key={index} className="flex items-center gap-4 p-2 rounded">
                    <div className="w-16 text-sm">{trend.day}</div>
                    <div className="flex-1 grid grid-cols-4 gap-2">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Efficiency</div>
                        <Progress value={trend.efficiency} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Collaboration</div>
                        <Progress value={trend.collaboration} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Innovation</div>
                        <Progress value={trend.innovation} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Quality</div>
                        <Progress value={trend.quality} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}