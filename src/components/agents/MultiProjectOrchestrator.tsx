import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Layers, 
  TrendingUp,
  Users,
  Zap,
  Plus,
  Download
} from 'lucide-react';
import { Agent, CrossProjectSynergy } from '../../types/multi-agent-orchestration';
import { SAMPLE_PROJECTS, SAMPLE_SYNERGIES } from '../../constants/multi-project-orchestrator';
import { 
  getTotalProjectProgress, 
  getActiveAgentsCount,
  generateResourceAllocation 
} from '../../utils/multi-project-orchestrator';
import { ProjectCard } from './multi-project/ProjectCard';
import { SynergyCard } from './multi-project/SynergyCard';
import { ResourceAllocationCard } from './multi-project/ResourceAllocationCard';
import { OptimizationRecommendation } from './multi-project/OptimizationRecommendation';

interface MultiProjectOrchestratorProps {
  currentProjectId: string;
  agents: Agent[];
  userStats: any;
}

export function MultiProjectOrchestrator({
  currentProjectId,
  agents,
  userStats
}: MultiProjectOrchestratorProps) {
  const [projects] = useState(SAMPLE_PROJECTS);
  const [synergies, setSynergies] = useState<CrossProjectSynergy[]>([]);
  const [resourceAllocation, setResourceAllocation] = useState<any[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedProject, setSelectedProject] = useState(currentProjectId);

  useEffect(() => {
    analyzeCrossProjectSynergies();
    optimizeResourceAllocation();
  }, [projects, agents]);

  const analyzeCrossProjectSynergies = async () => {
    setSynergies(SAMPLE_SYNERGIES);
  };

  const optimizeResourceAllocation = () => {
    const allocation = generateResourceAllocation(agents, projects);
    setResourceAllocation(allocation);
  };

  const handleImplementSynergy = async (synergyId: string) => {
    setIsOptimizing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSynergies(prev => prev.map(s => 
      s.projectIds.join('-') === synergyId 
        ? { ...s, implementationEffort: 'completed' as any }
        : s
    ));
    
    setIsOptimizing(false);
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Projects</p>
              <p className="text-2xl font-bold text-primary">
                {projects.filter(p => p.status === 'active').length}
              </p>
            </div>
            <Layers className="h-6 w-6 text-primary" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Portfolio Progress</p>
              <p className="text-2xl font-bold text-secondary">{getTotalProjectProgress(projects)}%</p>
            </div>
            <TrendingUp className="h-6 w-6 text-secondary" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Agents</p>
              <p className="text-2xl font-bold text-accent">{getActiveAgentsCount(agents)}</p>
            </div>
            <Users className="h-6 w-6 text-accent" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Synergies Found</p>
              <p className="text-2xl font-bold text-primary">{synergies.length}</p>
            </div>
            <Zap className="h-6 w-6 text-primary" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projects">Project Portfolio</TabsTrigger>
          <TabsTrigger value="synergies">Cross-Project Synergies</TabsTrigger>
          <TabsTrigger value="resources">Resource Allocation</TabsTrigger>
          <TabsTrigger value="optimization">Portfolio Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid gap-4">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                isSelected={selectedProject === project.id}
                onSelect={setSelectedProject}
                index={index}
              />
            ))}
          </div>

          <Card className="p-6 border-dashed border-2 border-border">
            <div className="text-center space-y-3">
              <Plus className="h-8 w-8 text-muted-foreground mx-auto" />
              <div>
                <h3 className="font-semibold">Start New Project</h3>
                <p className="text-sm text-muted-foreground">
                  Add another project to your portfolio and optimize resource allocation
                </p>
              </div>
              <Button className="mt-4">Create New Project</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="synergies" className="space-y-6">
          <div className="space-y-4">
            {synergies.map((synergy, index) => (
              <SynergyCard
                key={`${synergy.projectIds.join('-')}`}
                synergy={synergy}
                projects={projects}
                onImplement={handleImplementSynergy}
                isOptimizing={isOptimizing}
                index={index}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Agent Resource Allocation</h3>
            <div className="space-y-4">
              {resourceAllocation.map((resource) => (
                <ResourceAllocationCard
                  key={resource.agentId}
                  resource={resource}
                  projects={projects}
                />
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Portfolio Optimization Recommendations</h3>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </div>
            
            <div className="space-y-4">
              <OptimizationRecommendation
                type="success"
                title="High-Impact Optimization"
                description="Reallocating Backend Developer between E-commerce and Analytics projects could improve overall portfolio delivery by 23% with minimal effort."
              />

              <OptimizationRecommendation
                type="info"
                title="Efficiency Opportunity"
                description="Cross-training UI Designer on mobile patterns could reduce dependency bottlenecks and improve project resilience."
              />

              <OptimizationRecommendation
                type="warning"
                title="Resource Bottleneck Alert"
                description="QA Engineer is at 95% capacity across multiple projects. Consider redistributing testing tasks or adding additional QA resources."
              />

              <OptimizationRecommendation
                type="insight"
                title="Knowledge Sharing Opportunity"
                description="Frontend Developer's component library work on E-commerce project could accelerate Mobile Banking App development by 30%."
              />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}