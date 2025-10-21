import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  Shield, 
  Clock,
  Target,
  Users,
  Zap,
  Activity,
  Brain,
  RefreshCw,
  Filter,
  Download,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../ui/utils';
import { Agent, ProjectRisk } from '../../types/multi-agent-orchestration';
import { RISK_SEVERITY_COLORS, RISK_PROBABILITY_THRESHOLDS } from '../../constants/multi-agent-orchestration';

interface PredictiveFailureDetectionProps {
  projectId: string;
  agents: Agent[];
  risks: ProjectRisk[];
  onRiskUpdate: (risks: ProjectRisk[]) => void;
}

export function PredictiveFailureDetection({
  projectId,
  agents,
  risks,
  onRiskUpdate
}: PredictiveFailureDetectionProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<string>('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [predictiveMetrics, setPredictiveMetrics] = useState({
    overallRiskScore: 0,
    trendDirection: 'stable' as 'increasing' | 'decreasing' | 'stable',
    nextRiskWindow: '3-5 days',
    confidenceLevel: 85
  });

  useEffect(() => {
    generateRiskPredictions();
    const interval = setInterval(generateRiskPredictions, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [agents, projectId]);

  const generateRiskPredictions = async () => {
    setIsAnalyzing(true);

    // Simulate AI risk analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newRisks: ProjectRisk[] = [
      {
        id: 'risk-scope-creep',
        type: 'scope_creep',
        severity: 'medium',
        probability: 78,
        impact: 65,
        description: 'Multiple feature requests detected outside original scope',
        affectedAgents: ['agent-product_manager', 'agent-visionary'],
        mitigation: [
          'Schedule stakeholder alignment meeting',
          'Review and lock feature scope',
          'Set up change request process'
        ],
        timeline: '2-3 days',
        earlyWarnings: [
          'Increased communication volume between stakeholders',
          'New requirements appearing in backlog',
          'Product Manager showing stress patterns'
        ],
        status: 'identified'
      },
      {
        id: 'risk-technical-debt',
        type: 'technical_debt',
        severity: 'high',
        probability: 85,
        impact: 80,
        description: 'Rapid development pace creating technical debt accumulation',
        affectedAgents: ['agent-frontend_developer', 'agent-backend_developer', 'agent-qa_engineer'],
        mitigation: [
          'Schedule refactoring sprint',
          'Implement code review checkpoints',
          'Add automated testing coverage'
        ],
        timeline: '1-2 weeks',
        earlyWarnings: [
          'Increasing bug reports from QA',
          'Slower development velocity',
          'Developer frustration indicators'
        ],
        status: 'mitigating'
      },
      {
        id: 'risk-team-burnout',
        type: 'team_burnout',
        severity: 'low',
        probability: 45,
        impact: 90,
        description: 'Extended work periods may lead to team fatigue',
        affectedAgents: ['agent-frontend_developer', 'agent-ui_designer'],
        mitigation: [
          'Distribute workload more evenly',
          'Schedule team wellness check',
          'Consider timeline adjustments'
        ],
        timeline: '1 week',
        earlyWarnings: [
          'Decreased efficiency in UI Designer',
          'Longer response times to requests',
          'Reduced collaboration frequency'
        ],
        status: 'identified'
      }
    ];

    // Calculate overall metrics
    const avgProbability = newRisks.reduce((sum, risk) => sum + risk.probability, 0) / newRisks.length;
    const avgImpact = newRisks.reduce((sum, risk) => sum + risk.impact, 0) / newRisks.length;
    const overallScore = (avgProbability * avgImpact) / 100;

    setPredictiveMetrics({
      overallRiskScore: Math.round(overallScore),
      trendDirection: overallScore > 60 ? 'increasing' : overallScore < 40 ? 'decreasing' : 'stable',
      nextRiskWindow: overallScore > 70 ? '1-2 days' : overallScore > 50 ? '3-5 days' : '1-2 weeks',
      confidenceLevel: Math.round(85 + Math.random() * 10)
    });

    onRiskUpdate(newRisks);
    setIsAnalyzing(false);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Activity className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Shield className="h-4 w-4 text-green-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getRiskTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      scope_creep: 'bg-purple-500',
      team_burnout: 'bg-red-500',
      technical_debt: 'bg-orange-500',
      stakeholder_alignment: 'bg-blue-500',
      timeline_slip: 'bg-yellow-500',
      quality_degradation: 'bg-pink-500',
      resource_conflict: 'bg-teal-500',
      dependency_block: 'bg-indigo-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  const filteredRisks = filterSeverity === 'all' 
    ? risks 
    : risks.filter(risk => risk.severity === filterSeverity);

  const handleMitigateRisk = (riskId: string) => {
    onRiskUpdate(risks.map(risk => 
      risk.id === riskId 
        ? { ...risk, status: 'mitigating' }
        : risk
    ));
  };

  const handleResolveRisk = (riskId: string) => {
    onRiskUpdate(risks.map(risk => 
      risk.id === riskId 
        ? { ...risk, status: 'resolved' }
        : risk
    ));
  };

  return (
    <div className="space-y-6">
      {/* Risk Overview Dashboard */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Risk Score</p>
              <p className="text-2xl font-bold text-primary">{predictiveMetrics.overallRiskScore}%</p>
            </div>
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <Progress 
            value={predictiveMetrics.overallRiskScore} 
            className="mt-2"
          />
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Risk Trend</p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold capitalize">
                  {predictiveMetrics.trendDirection}
                </span>
                {predictiveMetrics.trendDirection === 'increasing' ? (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                ) : predictiveMetrics.trendDirection === 'decreasing' ? (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                ) : (
                  <Activity className="h-4 w-4 text-blue-500" />
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Next Risk Window</p>
              <p className="text-lg font-bold">{predictiveMetrics.nextRiskWindow}</p>
            </div>
            <Clock className="h-6 w-6 text-secondary" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">AI Confidence</p>
              <p className="text-lg font-bold">{predictiveMetrics.confidenceLevel}%</p>
            </div>
            <Target className="h-6 w-6 text-accent" />
          </div>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={generateRiskPredictions}
            disabled={isAnalyzing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", isAnalyzing && "animate-spin")} />
            {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
          </Button>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select 
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-card border border-border rounded-md px-3 py-1 text-sm"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Risk Analysis Status */}
      {isAnalyzing && (
        <Card className="p-6">
          <div className="flex items-center justify-center space-y-4 flex-col">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
              <span className="font-medium">AI Risk Analysis in Progress...</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Analyzing agent behaviors, project metrics, and predictive patterns
            </div>
            <Progress value={75} className="w-64" />
          </div>
        </Card>
      )}

      {/* Risk Cards */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredRisks.map((risk, index) => (
            <motion.div
              key={risk.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn(
                "p-6 border-l-4 transition-all duration-300",
                risk.severity === 'critical' && "border-l-red-500",
                risk.severity === 'high' && "border-l-orange-500", 
                risk.severity === 'medium' && "border-l-yellow-500",
                risk.severity === 'low' && "border-l-green-500"
              )}>
                <div className="space-y-4">
                  {/* Risk Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(risk.severity)}
                      <div>
                        <h3 className="font-semibold">{risk.description}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            className={cn(
                              "text-white text-xs",
                              getRiskTypeColor(risk.type)
                            )}
                          >
                            {risk.type.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {risk.timeline}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedRisk(selectedRisk === risk.id ? '' : risk.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {risk.status === 'identified' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMitigateRisk(risk.id)}
                          className="text-orange-600 border-orange-600 hover:bg-orange-50"
                        >
                          Start Mitigation
                        </Button>
                      )}
                      
                      {risk.status === 'mitigating' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResolveRisk(risk.id)}
                          className="text-green-600 border-green-600 hover:bg-green-50"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Risk Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Probability</div>
                      <div className="flex items-center gap-2">
                        <Progress value={risk.probability} className="flex-1" />
                        <span className="text-sm font-medium">{risk.probability}%</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Impact</div>
                      <div className="flex items-center gap-2">
                        <Progress value={risk.impact} className="flex-1" />
                        <span className="text-sm font-medium">{risk.impact}%</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Risk Score</div>
                      <div className="flex items-center gap-2">
                        <Progress value={(risk.probability * risk.impact) / 100} className="flex-1" />
                        <span className="text-sm font-medium">
                          {Math.round((risk.probability * risk.impact) / 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Affected Agents */}
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Affected Agents</div>
                    <div className="flex flex-wrap gap-1">
                      {risk.affectedAgents.map(agentId => {
                        const agent = agents.find(a => a.id === agentId);
                        return agent ? (
                          <Badge key={agentId} variant="secondary" className="text-xs">
                            {agent.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {selectedRisk === risk.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-border pt-4 space-y-4"
                      >
                        {/* Early Warnings */}
                        <div>
                          <h4 className="font-medium mb-2">Early Warning Signals</h4>
                          <ul className="space-y-1">
                            {risk.earlyWarnings.map((warning, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                                {warning}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Mitigation Strategies */}
                        <div>
                          <h4 className="font-medium mb-2">Recommended Mitigation</h4>
                          <ul className="space-y-1">
                            {risk.mitigation.map((action, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredRisks.length === 0 && !isAnalyzing && (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <Shield className="h-12 w-12 text-green-500 mx-auto" />
            <div>
              <h3 className="font-semibold text-lg">All Clear!</h3>
              <p className="text-muted-foreground">
                No significant risks detected in current project trajectory
              </p>
            </div>
            <Button onClick={generateRiskPredictions} className="mt-4">
              Run Fresh Analysis
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}