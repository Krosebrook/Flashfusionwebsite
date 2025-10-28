import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  MessageSquare,
  Calendar,
  Target,
  Activity,
  FileText,
  Download,
  Share2,
  Eye,
  Bell
} from 'lucide-react';
import { cn } from '../ui/utils';
import { Agent, AgentInteraction, ProjectRisk } from '../../types/multi-agent-orchestration';
import { STAKEHOLDER_UPDATE_TEMPLATES } from '../../constants/multi-agent-orchestration';

interface StakeholderPortalProps {
  projectId: string;
  agents: Agent[];
  interactions: AgentInteraction[];
  risks: ProjectRisk[];
  stats: {
    activeAgents: number;
    completedTasks: number;
    efficiency: number;
    collaborationScore: number;
  };
}

export function StakeholderPortal({
  projectId,
  agents,
  interactions,
  risks,
  stats
}: StakeholderPortalProps) {
  const [selectedUpdate, setSelectedUpdate] = useState<string>('');
  const [feedbackText, setFeedbackText] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  // Generate stakeholder-friendly updates
  const stakeholderUpdates = [
    {
      id: 'milestone-1',
      type: 'milestone' as const,
      title: 'UI Design Phase Completed',
      description: 'Our design team has successfully completed all user interface mockups and prototypes. The new design system ensures consistency across all platforms.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      agentsInvolved: ['agent-ui_designer', 'agent-ux_designer'],
      impact: 'high',
      clientVisible: true
    },
    {
      id: 'progress-1',
      type: 'progress' as const,
      title: 'Development Sprint Progress',
      description: 'Great progress this week! Our development team completed 15 tasks and we\'re ahead of schedule for the next milestone.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      agentsInvolved: ['agent-frontend_developer', 'agent-backend_developer'],
      impact: 'medium',
      clientVisible: true
    },
    {
      id: 'decision-1',
      type: 'decision' as const,
      title: 'Technology Stack Finalized',
      description: 'After careful evaluation, we\'ve selected React and Node.js for optimal performance and scalability.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      agentsInvolved: ['agent-visionary', 'agent-backend_developer'],
      impact: 'high',
      clientVisible: true
    }
  ];

  const upcomingMilestones = [
    {
      id: 'milestone-api',
      title: 'API Development Complete',
      description: 'Backend services and database integration',
      targetDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      progress: 78,
      responsible: 'Backend Development Team'
    },
    {
      id: 'milestone-testing',
      title: 'Quality Assurance Testing',
      description: 'Comprehensive testing and bug fixes',
      targetDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      progress: 25,
      responsible: 'QA Team'
    },
    {
      id: 'milestone-deployment',
      title: 'Production Deployment',
      description: 'Launch preparation and go-live',
      targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      progress: 10,
      responsible: 'DevOps Team'
    }
  ];

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'milestone': return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'progress': return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case 'decision': return <Target className="h-5 w-5 text-purple-600" />;
      default: return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'border-l-green-500 bg-green-50/50';
      case 'medium': return 'border-l-blue-500 bg-blue-50/50';
      case 'low': return 'border-l-gray-500 bg-gray-50/50';
      default: return 'border-l-gray-500 bg-gray-50/50';
    }
  };

  const handleSubmitFeedback = () => {
    // In a real implementation, this would submit feedback to the system
    console.log('Feedback submitted:', feedbackText);
    setFeedbackText('');
    setShowFeedbackForm(false);
  };

  const exportProgress = () => {
    const report = {
      projectId,
      timestamp: new Date(),
      stats,
      milestones: upcomingMilestones,
      updates: stakeholderUpdates,
      risks: risks.map(risk => ({
        type: risk.type,
        severity: risk.severity,
        description: risk.description,
        status: risk.status
      }))
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-report-${projectId}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center space-y-3 p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
        <h1 className="text-3xl font-bold">Project Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your project overview. Here's what your AI team has been working on.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <Users className="h-8 w-8 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold">{stats.activeAgents}</div>
          <div className="text-sm text-muted-foreground">Active Team Members</div>
        </Card>

        <Card className="p-4 text-center">
          <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold">{stats.completedTasks}</div>
          <div className="text-sm text-muted-foreground">Tasks Completed</div>
        </Card>

        <Card className="p-4 text-center">
          <TrendingUp className="h-8 w-8 text-secondary mx-auto mb-2" />
          <div className="text-2xl font-bold">{stats.efficiency}%</div>
          <div className="text-sm text-muted-foreground">Team Efficiency</div>
        </Card>

        <Card className="p-4 text-center">
          <Activity className="h-8 w-8 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold">{stats.collaborationScore}</div>
          <div className="text-sm text-muted-foreground">Collaboration Score</div>
        </Card>
      </div>

      {/* Recent Updates */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Updates</h2>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Subscribe to Updates
          </Button>
        </div>

        <div className="space-y-4">
          {stakeholderUpdates.map((update, index) => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn("p-4 border-l-4", getImpactColor(update.impact))}>
                <div className="flex items-start gap-3">
                  {getUpdateIcon(update.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{update.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs capitalize">
                          {update.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {update.timestamp.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-2">{update.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">Team members:</span>
                        {update.agentsInvolved.map(agentId => {
                          const agent = agents.find(a => a.id === agentId);
                          return agent ? (
                            <Badge key={agentId} variant="outline" className="text-xs">
                              {agent.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedUpdate(selectedUpdate === update.id ? '' : update.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Upcoming Milestones */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Upcoming Milestones</h2>
        <div className="space-y-4">
          {upcomingMilestones.map((milestone, index) => (
            <div key={milestone.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{milestone.title}</h3>
                  <p className="text-sm text-muted-foreground">{milestone.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {milestone.targetDate.toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {milestone.responsible}
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{milestone.progress}%</span>
                </div>
                <Progress value={milestone.progress} className="h-2" />
              </div>
              {index < upcomingMilestones.length - 1 && <div className="border-b border-border" />}
            </div>
          ))}
        </div>
      </Card>

      {/* Project Health */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Project Health</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">Current Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Timeline</span>
                <Badge className="bg-green-100 text-green-800">On Track</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Budget</span>
                <Badge className="bg-green-100 text-green-800">Within Budget</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Quality</span>
                <Badge className="bg-blue-100 text-blue-800">High Quality</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Team Performance</span>
                <Badge className="bg-green-100 text-green-800">Excellent</Badge>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Risk Assessment</h3>
            <div className="space-y-2">
              {risks.filter(risk => risk.severity !== 'low').map(risk => (
                <div key={risk.id} className="text-sm p-2 rounded bg-muted/50">
                  <div className="flex justify-between items-center">
                    <span>{risk.type.replace('_', ' ')}</span>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs",
                        risk.severity === 'critical' && "border-red-500 text-red-700",
                        risk.severity === 'high' && "border-orange-500 text-orange-700",
                        risk.severity === 'medium' && "border-yellow-500 text-yellow-700"
                      )}
                    >
                      {risk.severity}
                    </Badge>
                  </div>
                </div>
              ))}
              {risks.filter(risk => risk.severity !== 'low').length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No significant risks detected
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Feedback Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Feedback & Communication</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportProgress} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button
              onClick={() => setShowFeedbackForm(!showFeedbackForm)}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Provide Feedback
            </Button>
          </div>
        </div>

        {showFeedbackForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 mb-4"
          >
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Share your thoughts, questions, or feedback about the project progress..."
              className="w-full h-24 p-3 border border-border rounded-md resize-none"
            />
            <div className="flex gap-2">
              <Button onClick={handleSubmitFeedback} disabled={!feedbackText.trim()}>
                Submit Feedback
              </Button>
              <Button variant="outline" onClick={() => setShowFeedbackForm(false)}>
                Cancel
              </Button>
            </div>
          </motion.div>
        )}

        <div className="text-sm text-muted-foreground">
          Your feedback helps us improve the project and ensures we're meeting your expectations. 
          Our AI team will review and incorporate your input into the development process.
        </div>
      </Card>

      {/* Next Steps */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">What's Next</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <div className="font-medium">API Development Sprint</div>
              <div className="text-sm text-muted-foreground">
                Starting tomorrow, our backend team will focus on API development and database integration
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-secondary mt-0.5" />
            <div>
              <div className="font-medium">Design System Documentation</div>
              <div className="text-sm text-muted-foreground">
                Complete documentation of design components and usage guidelines
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <div className="font-medium">Stakeholder Review Session</div>
              <div className="text-sm text-muted-foreground">
                Scheduled for next week to review progress and gather additional requirements
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}