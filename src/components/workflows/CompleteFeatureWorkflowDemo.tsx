import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { CheckCircle, Sparkles, Rocket, DollarSign, Shield, BarChart3, FileCheck, ArrowRight, Play, RotateCcw } from 'lucide-react';
import { AICreationWorkflow } from './AICreationWorkflow';
import { OneClickPublishingWorkflow } from './OneClickPublishingWorkflow';
import { CreatorCommerceWorkflow } from './CreatorCommerceWorkflow';
import { EnterpriseSecurityWorkflow } from './EnterpriseSecurityWorkflow';
import { SmartAnalyticsWorkflow } from './SmartAnalyticsWorkflow';
import { QualityAssuranceWorkflow } from './QualityAssuranceWorkflow';

interface CompleteFeatureWorkflowDemoProps {
  onClose?: () => void;
}

export function CompleteFeatureWorkflowDemo({ onClose }: CompleteFeatureWorkflowDemoProps) {
  const [currentWorkflow, setCurrentWorkflow] = useState<string>('overview');
  const [completedWorkflows, setCompletedWorkflows] = useState<string[]>([]);
  const [workflowData, setWorkflowData] = useState<any>({});

  const workflows = [
    {
      id: 'ai-creation',
      name: 'AI-Powered Creation',
      description: 'Generate stunning content, code, and creative assets in seconds with advanced AI models.',
      icon: Sparkles,
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
      estimatedTime: '2-5 minutes',
      complexity: 'Simple'
    },
    {
      id: 'one-click-publishing',
      name: 'One-Click Publishing',
      description: 'Deploy your creations instantly across 20+ platforms with automated optimization.',
      icon: Rocket,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      estimatedTime: '1-3 minutes',
      complexity: 'Simple'
    },
    {
      id: 'creator-commerce',
      name: 'Creator Commerce',
      description: 'Turn your creative work into revenue streams with integrated marketplace tools.',
      icon: DollarSign,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      estimatedTime: '3-5 minutes',
      complexity: 'Medium'
    },
    {
      id: 'enterprise-security',
      name: 'Enterprise Security',
      description: 'Bank-level security with end-to-end encryption and compliance standards.',
      icon: Shield,
      color: 'bg-gradient-to-r from-blue-600 to-purple-600',
      estimatedTime: '5-10 minutes',
      complexity: 'Advanced'
    },
    {
      id: 'smart-analytics',
      name: 'Smart Analytics',
      description: 'Track performance, audience insights, and revenue optimization in real-time.',
      icon: BarChart3,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      estimatedTime: '3-7 minutes',
      complexity: 'Medium'
    },
    {
      id: 'quality-assurance',
      name: 'Quality Assurance',
      description: 'Automated quality checks ensure your content meets professional standards.',
      icon: FileCheck,
      color: 'bg-gradient-to-r from-emerald-500 to-green-500',
      estimatedTime: '2-4 minutes',
      complexity: 'Simple'
    }
  ];

  const handleWorkflowComplete = (workflowId: string, data?: any) => {
    setCompletedWorkflows(prev => [...prev, workflowId]);
    if (data) {
      setWorkflowData(prev => ({ ...prev, [workflowId]: data }));
    }
    setCurrentWorkflow('overview');
  };

  const resetDemo = () => {
    setCurrentWorkflow('overview');
    setCompletedWorkflows([]);
    setWorkflowData({});
  };

  const getCompletionPercentage = () => {
    return Math.round((completedWorkflows.length / workflows.length) * 100);
  };

  const renderWorkflowContent = () => {
    switch (currentWorkflow) {
      case 'ai-creation':
        return (
          <AICreationWorkflow 
            onComplete={() => handleWorkflowComplete('ai-creation', { type: 'fullstack-app' })}
          />
        );
      case 'one-click-publishing':
        return (
          <OneClickPublishingWorkflow 
            createdContent={workflowData['ai-creation']}
            onComplete={() => handleWorkflowComplete('one-click-publishing', { platforms: 3 })}
          />
        );
      case 'creator-commerce':
        return (
          <CreatorCommerceWorkflow 
            createdContent={workflowData['ai-creation']}
            publishedContent={workflowData['one-click-publishing']}
            onComplete={() => handleWorkflowComplete('creator-commerce', { revenue: 2500 })}
          />
        );
      case 'enterprise-security':
        return (
          <EnterpriseSecurityWorkflow 
            onComplete={() => handleWorkflowComplete('enterprise-security', { score: 95 })}
          />
        );
      case 'smart-analytics':
        return (
          <SmartAnalyticsWorkflow 
            onComplete={() => handleWorkflowComplete('smart-analytics', { metrics: 5 })}
          />
        );
      case 'quality-assurance':
        return (
          <QualityAssuranceWorkflow 
            onComplete={() => handleWorkflowComplete('quality-assurance', { score: 92 })}
          />
        );
      default:
        return (
          <div className="max-w-6xl mx-auto p-6 space-y-8">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-orange-500 to-pink-500">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="ff-text-display text-4xl lg:text-6xl">FlashFusion Complete Workflows</h1>
                <p className="ff-text-body text-lg max-w-3xl mx-auto">
                  Experience the complete user journey through FlashFusion's six core features. 
                  Each workflow demonstrates real functionality and user interactions.
                </p>
              </div>
              
              {completedWorkflows.length > 0 && (
                <Card className="ff-card max-w-md mx-auto">
                  <CardContent className="p-6">
                    <div className="text-center space-y-3">
                      <h3 className="ff-text-title">Workflow Progress</h3>
                      <div className="text-3xl font-bold text-green-500">{getCompletionPercentage()}%</div>
                      <Progress value={getCompletionPercentage()} className="h-2" />
                      <p className="text-sm text-gray-400">
                        {completedWorkflows.length} of {workflows.length} workflows completed
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflows.map((workflow) => {
                const Icon = workflow.icon;
                const isCompleted = completedWorkflows.includes(workflow.id);
                
                return (
                  <Card 
                    key={workflow.id}
                    className={`ff-card-interactive cursor-pointer transition-all duration-200 ${
                      isCompleted 
                        ? 'ring-2 ring-green-500 bg-green-500/10' 
                        : 'hover:bg-white/5 hover:scale-105'
                    }`}
                    onClick={() => setCurrentWorkflow(workflow.id)}
                  >
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className={`p-4 rounded-xl ${workflow.color}`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          {isCompleted && (
                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <h3 className="ff-text-title text-xl">{workflow.name}</h3>
                          <p className="ff-text-body text-sm leading-relaxed">{workflow.description}</p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Estimated Time:</span>
                            <Badge variant="secondary">{workflow.estimatedTime}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Complexity:</span>
                            <Badge variant={
                              workflow.complexity === 'Simple' ? 'secondary' :
                              workflow.complexity === 'Medium' ? 'outline' : 'destructive'
                            }>
                              {workflow.complexity}
                            </Badge>
                          </div>
                        </div>
                        
                        <Button 
                          className={`w-full ${isCompleted ? 'ff-btn-success' : 'ff-btn-primary'}`}
                          onClick={() => setCurrentWorkflow(workflow.id)}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Review Workflow
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Start Workflow
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {completedWorkflows.length === workflows.length && (
              <Card className="ff-card max-w-4xl mx-auto">
                <CardHeader>
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="ff-text-headline text-2xl">🎉 All Workflows Complete!</CardTitle>
                      <p className="ff-text-body">You've experienced the complete FlashFusion creator journey</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg text-center">
                      <Sparkles className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-xl font-bold text-blue-500">AI Creation</div>
                      <div className="text-sm text-gray-400">Content generated</div>
                    </div>
                    <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                      <Rocket className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <div className="text-xl font-bold text-green-500">Published</div>
                      <div className="text-sm text-gray-400">3+ platforms deployed</div>
                    </div>
                    <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-lg text-center">
                      <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <div className="text-xl font-bold text-purple-500">Monetized</div>
                      <div className="text-sm text-gray-400">Revenue streams active</div>
                    </div>
                  </div>

                  <div className="text-center space-y-4">
                    <h3 className="ff-text-title text-lg">Ready to Start Your Creator Journey?</h3>
                    <div className="flex justify-center space-x-4">
                      <Button 
                        onClick={resetDemo}
                        variant="outline"
                        className="ff-btn-outline"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Restart Demo
                      </Button>
                      <Button 
                        onClick={onClose}
                        className="ff-btn-primary ff-btn-lg"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Enter FlashFusion App
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {completedWorkflows.length > 0 && (
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={resetDemo}
                  variant="outline"
                  className="ff-btn-outline"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Demo
                </Button>
                
                {completedWorkflows.length < workflows.length && (
                  <Button 
                    onClick={() => {
                      // Find next uncompleted workflow
                      const nextWorkflow = workflows.find(w => !completedWorkflows.includes(w.id));
                      if (nextWorkflow) {
                        setCurrentWorkflow(nextWorkflow.id);
                      }
                    }}
                    className="ff-btn-primary"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Continue Next Workflow
                  </Button>
                )}
              </div>
            )}
          </div>
        );
    }
  };

  if (currentWorkflow === 'overview') {
    return renderWorkflowContent();
  }

  // Render individual workflow with back button
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => setCurrentWorkflow('overview')}
          className="ff-btn-outline"
        >
          ← Back to Overview
        </Button>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            Workflow {workflows.findIndex(w => w.id === currentWorkflow) + 1} of {workflows.length}
          </div>
          <Badge variant="secondary">
            {completedWorkflows.length} completed
          </Badge>
        </div>
      </div>
      
      {renderWorkflowContent()}
    </div>
  );
}