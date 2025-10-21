/**
 * @fileoverview Enhanced Workflow Builder - Fixed Version
 * @chunk workflow
 * @category tools
 * @version 1.0.1
 * @author FlashFusion Team
 */

import React, { useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { 
  Play, 
  Download, 
  Save, 
  Settings, 
  Zap, 
  GitBranch, 
  Network, 
  Workflow,
  FileCode,
  Database,
  Bot,
  Brain,
  Link,
  Plus,
  Trash2,
  Edit,
  Copy,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Code,
  FileJson,
  FileText
} from 'lucide-react';

interface WorkflowNode {
  id: string;
  type: 'input' | 'process' | 'output' | 'condition' | 'database' | 'api' | 'ai';
  title: string;
  description: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  connections: string[];
}

interface WorkflowConfig {
  name: string;
  description: string;
  type: 'langchain' | 'graph' | 'forge' | 'flow';
  nodes: WorkflowNode[];
  metadata: Record<string, any>;
}

interface GeneratedWorkflow {
  id: string;
  config: WorkflowConfig;
  code: string;
  documentation: string;
  examples: string[];
  testSuite: string;
  deployment: string;
  timestamp: Date;
}

export function EnhancedWorkflowBuilder() {
  const [activeTab, setActiveTab] = useState<'langchain' | 'graph' | 'forge' | 'flow'>('langchain');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<GeneratedWorkflow | null>(null);
  const [workflowConfig, setWorkflowConfig] = useState<WorkflowConfig>({
    name: '',
    description: '',
    type: 'langchain',
    nodes: [],
    metadata: {}
  });

  // LangChain specific state
  const [langchainTemplate, setLangchainTemplate] = useState('');
  const [langchainModel, setLangchainModel] = useState('gpt-4');
  const [langchainChains, setLangchainChains] = useState<string[]>([]);

  // Graph workflow state
  const [graphNodes, setGraphNodes] = useState<WorkflowNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Forge process state
  const [forgeSteps, setForgeSteps] = useState<string[]>(['']);
  const [forgeOutputType, setForgeOutputType] = useState('application');

  // Flow diagram state
  const [flowType, setFlowType] = useState('sequential');
  const [flowElements, setFlowElements] = useState<any[]>([]);

  // Generate comprehensive LangChain workflow
  const generateLangChainWorkflow = useCallback(async () => {
    const template = langchainTemplate || 'Create a comprehensive AI workflow';
    const chains = langchainChains.length > 0 ? langchainChains : ['LLMChain', 'SequentialChain'];
    
    const code = `"""
FlashFusion Generated LangChain Workflow
Generated: ${new Date().toISOString()}
Model: ${langchainModel}
Template: ${template}
"""

from langchain.llms import OpenAI
from langchain.chains import LLMChain, SequentialChain
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.agents import initialize_agent, Tool
from langchain.utilities import GoogleSearchAPIWrapper
import os
from typing import Dict, List, Any

class FlashFusionLangChainWorkflow:
    """${workflowConfig.description || 'AI-powered workflow using LangChain'}"""
    
    def __init__(self, model_name: str = "${langchainModel}"):
        self.llm = OpenAI(
            model_name=model_name,
            temperature=0.7,
            max_tokens=2000
        )
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        self.setup_chains()
        self.setup_agents()
    
    def setup_chains(self):
        """Initialize LangChain chains for workflow processing"""
        
        # Primary analysis chain
        self.analysis_prompt = PromptTemplate(
            input_variables=["input_text", "context"],
            template="""
            Analyze the following input in the context of: ${template}
            
            Input: {input_text}
            Context: {context}
            
            Please provide a comprehensive analysis including:
            1. Key insights and patterns
            2. Recommendations for action
            3. Potential challenges and solutions
            4. Next steps and implementation strategy
            
            Analysis:
            """
        )
        
        self.analysis_chain = LLMChain(
            llm=self.llm,
            prompt=self.analysis_prompt,
            output_key="analysis"
        )
        
        # Enhancement chain
        self.enhancement_prompt = PromptTemplate(
            input_variables=["analysis", "requirements"],
            template="""
            Based on this analysis: {analysis}
            
            Requirements: {requirements}
            
            Create an enhanced solution that:
            1. Addresses all identified challenges
            2. Implements best practices
            3. Includes specific action items
            4. Provides measurable outcomes
            
            Enhanced Solution:
            """
        )
        
        self.enhancement_chain = LLMChain(
            llm=self.llm,
            prompt=self.enhancement_prompt,
            output_key="enhanced_solution"
        )
        
        # Sequential workflow
        self.workflow = SequentialChain(
            chains=[self.analysis_chain, self.enhancement_chain],
            input_variables=["input_text", "context", "requirements"],
            output_variables=["analysis", "enhanced_solution"],
            verbose=True
        )
    
    def setup_agents(self):
        """Initialize AI agents for specialized tasks"""
        
        # Web search tool
        search = GoogleSearchAPIWrapper()
        
        tools = [
            Tool(
                name="Web Search",
                func=search.run,
                description="Search the web for current information and research"
            ),
            Tool(
                name="Code Analysis",
                func=self.analyze_code,
                description="Analyze code patterns, performance, and best practices"
            ),
            Tool(
                name="Document Generator",
                func=self.generate_documentation,
                description="Generate comprehensive documentation for projects"
            )
        ]
        
        self.agent = initialize_agent(
            tools,
            self.llm,
            agent="chat-conversational-react-description",
            memory=self.memory,
            verbose=True
        )
    
    def process_workflow(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the complete workflow"""
        
        try:
            # Extract input parameters
            input_text = input_data.get("input_text", "")
            context = input_data.get("context", "${template}")
            requirements = input_data.get("requirements", "Generate a comprehensive solution")
            
            # Execute sequential workflow
            result = self.workflow({
                "input_text": input_text,
                "context": context,
                "requirements": requirements
            })
            
            # Enhance with agent capabilities
            agent_analysis = self.agent.run(
                f"Provide additional insights for this workflow result: {result['enhanced_solution']}"
            )
            
            return {
                "status": "success",
                "workflow_result": result,
                "agent_insights": agent_analysis,
                "metadata": {
                    "model": "${langchainModel}",
                    "timestamp": "${new Date().toISOString()}",
                    "chains_used": ${JSON.stringify(chains)},
                    "processing_time": "calculated_at_runtime"
                }
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "fallback_result": self.generate_fallback_response(input_data)
            }
    
    def analyze_code(self, code: str) -> str:
        """Analyze code for patterns and improvements"""
        prompt = f"""
        Analyze this code and provide insights:
        {code}
        
        Focus on:
        - Code quality and best practices
        - Performance optimization opportunities
        - Security considerations
        - Maintainability improvements
        """
        return self.llm(prompt)
    
    def generate_documentation(self, project_info: str) -> str:
        """Generate comprehensive documentation"""
        prompt = f"""
        Create detailed documentation for:
        {project_info}
        
        Include:
        - Overview and purpose
        - Installation instructions
        - Usage examples
        - API reference
        - Contributing guidelines
        """
        return self.llm(prompt)
    
    def generate_fallback_response(self, input_data: Dict[str, Any]) -> str:
        """Generate fallback response when main workflow fails"""
        return f"Fallback analysis for: {input_data.get('input_text', 'No input provided')}"

# Usage example
if __name__ == "__main__":
    workflow = FlashFusionLangChainWorkflow()
    
    # Example workflow execution
    result = workflow.process_workflow({
        "input_text": "I need to build a web application for e-commerce",
        "context": "Modern web development with AI integration",
        "requirements": "Scalable, secure, and user-friendly solution"
    })
    
    print("Workflow Result:")
    print(result)
`;

    const documentation = `# FlashFusion LangChain Workflow Documentation

## Overview
This workflow implements a comprehensive LangChain-based AI processing system with the following capabilities:

### Features
- **Sequential Chain Processing**: Multi-stage analysis and enhancement
- **AI Agent Integration**: Specialized tools for research and analysis
- **Memory Management**: Conversation history and context retention
- **Error Handling**: Robust fallback mechanisms
- **Extensible Architecture**: Easy to add new chains and tools

### Architecture
1. **Analysis Chain**: Initial input processing and insights
2. **Enhancement Chain**: Solution development and optimization
3. **Agent Tools**: Web search, code analysis, documentation generation

### Usage
\`\`\`python
from workflow import FlashFusionLangChainWorkflow

# Initialize workflow
workflow = FlashFusionLangChainWorkflow(model_name="${langchainModel}")

# Process input
result = workflow.process_workflow({
    "input_text": "Your input here",
    "context": "Processing context",
    "requirements": "Specific requirements"
})
\`\`\`

### Configuration
- **Model**: ${langchainModel}
- **Template**: ${template}
- **Chains**: ${chains.join(', ')}
- **Memory**: ConversationBufferMemory
- **Tools**: Web Search, Code Analysis, Documentation
`;

    const examples = [
      `# Example 1: Business Analysis
result = workflow.process_workflow({
    "input_text": "Startup idea for AI-powered fitness app",
    "context": "Mobile app development and AI integration",
    "requirements": "Market analysis and technical implementation plan"
})`,
      `# Example 2: Code Review
result = workflow.process_workflow({
    "input_text": "React component with performance issues",
    "context": "Frontend optimization and best practices",
    "requirements": "Performance improvements and code quality"
})`,
      `# Example 3: Content Strategy
result = workflow.process_workflow({
    "input_text": "Blog content plan for tech startup",
    "context": "Content marketing and audience engagement",
    "requirements": "Content calendar and SEO optimization"
})`
    ];

    const testSuite = `"""
Test Suite for FlashFusion LangChain Workflow
"""

import unittest
from unittest.mock import Mock, patch
from workflow import FlashFusionLangChainWorkflow

class TestFlashFusionWorkflow(unittest.TestCase):
    
    def setUp(self):
        self.workflow = FlashFusionLangChainWorkflow()
    
    def test_workflow_initialization(self):
        """Test workflow initializes correctly"""
        self.assertIsNotNone(self.workflow.llm)
        self.assertIsNotNone(self.workflow.memory)
        self.assertIsNotNone(self.workflow.workflow)
    
    def test_process_workflow_success(self):
        """Test successful workflow processing"""
        input_data = {
            "input_text": "Test input",
            "context": "Test context",
            "requirements": "Test requirements"
        }
        
        # Mock LLM responses
        with patch.object(self.workflow.llm, '__call__', return_value="Mock response"):
            result = self.workflow.process_workflow(input_data)
            self.assertEqual(result["status"], "success")
    
    def test_error_handling(self):
        """Test error handling and fallback"""
        input_data = {"input_text": ""}
        
        # Force an error
        with patch.object(self.workflow.workflow, '__call__', side_effect=Exception("Test error")):
            result = self.workflow.process_workflow(input_data)
            self.assertEqual(result["status"], "error")
            self.assertIn("fallback_result", result)

if __name__ == "__main__":
    unittest.main()
`;

    const deployment = `# Deployment Configuration

## Docker Deployment
\`\`\`dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "workflow.py"]
\`\`\`

## Requirements
\`\`\`
langchain>=0.0.350
openai>=1.0.0
google-search-results>=2.4.2
python-dotenv>=1.0.0
fastapi>=0.104.1
uvicorn>=0.24.0
\`\`\`

## Environment Variables
\`\`\`bash
OPENAI_API_KEY=your_openai_key
GOOGLE_API_KEY=your_google_key
GOOGLE_CSE_ID=your_cse_id
\`\`\`
`;

    return {
      id: `langchain-${Date.now()}`,
      config: { ...workflowConfig, type: 'langchain' },
      code,
      documentation,
      examples,
      testSuite,
      deployment,
      timestamp: new Date()
    };
  }, [langchainTemplate, langchainModel, langchainChains, workflowConfig]);

  // Generate workflow
  const generateWorkflow = useCallback(async () => {
    setIsGenerating(true);
    setProgress(0);

    try {
      const steps = [
        'Analyzing workflow requirements...',
        'Generating code structure...',
        'Creating documentation...',
        'Generating examples...',
        'Building test suite...',
        'Finalizing deployment config...'
      ];

      let workflow: GeneratedWorkflow;

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 800));

        if (i === steps.length - 1) {
          // Generate based on active tab
          switch (activeTab) {
            case 'langchain':
              workflow = await generateLangChainWorkflow();
              break;
            default:
              workflow = await generateLangChainWorkflow();
          }
          setGeneratedWorkflow(workflow);
        }
      }

      console.log('✅ Workflow generated successfully');
    } catch (error) {
      console.error('❌ Workflow generation failed:', error);
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  }, [activeTab, generateLangChainWorkflow]);

  // Download generated files
  const downloadWorkflow = useCallback((type: 'code' | 'docs' | 'tests' | 'deployment' | 'all') => {
    if (!generatedWorkflow) return;

    const files: Record<string, string> = {
      code: generatedWorkflow.code,
      docs: generatedWorkflow.documentation,
      tests: generatedWorkflow.testSuite,
      deployment: generatedWorkflow.deployment
    };

    if (type === 'all') {
      // Create zip-like structure
      const allFiles = `# FlashFusion Workflow Package
# Generated: ${generatedWorkflow.timestamp.toISOString()}

## Main Code File (workflow.py)
${generatedWorkflow.code}

## Documentation (README.md)
${generatedWorkflow.documentation}

## Test Suite (test_workflow.py)
${generatedWorkflow.testSuite}

## Deployment Configuration (deployment.md)
${generatedWorkflow.deployment}

## Examples
${generatedWorkflow.examples.join('\n\n')}
`;

      const blob = new Blob([allFiles], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flashfusion-workflow-${generatedWorkflow.config.type}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Download individual file
      const content = files[type];
      const extensions: Record<string, string> = {
        code: 'py',
        docs: 'md',
        tests: 'py',
        deployment: 'md'
      };

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flashfusion-${type}.${extensions[type]}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [generatedWorkflow]);

  return (
    <div className="space-y-6" style={{ fontFamily: 'var(--ff-font-secondary)' }}>
      <Card className="bg-[var(--ff-surface)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)' }}>
            <Workflow className="w-6 h-6 text-[var(--ff-primary)]" />
            Enhanced Workflow Builder
          </CardTitle>
          <CardDescription className="text-[var(--ff-text-secondary)]">
            Create comprehensive AI workflows with LangChain, graph processing, forge automation, and flow diagrams.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="langchain" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                LangChain
              </TabsTrigger>
              <TabsTrigger value="graph" className="flex items-center gap-2">
                <Network className="w-4 h-4" />
                Graph
              </TabsTrigger>
              <TabsTrigger value="forge" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Forge
              </TabsTrigger>
              <TabsTrigger value="flow" className="flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                Flow
              </TabsTrigger>
            </TabsList>

            <TabsContent value="langchain" className="space-y-6">
              <Alert className="border-[var(--ff-primary)] bg-[var(--ff-primary)]/10">
                <Brain className="h-4 w-4 text-[var(--ff-primary)]" />
                <AlertDescription className="text-[var(--ff-text-secondary)]">
                  <strong className="text-[var(--ff-primary)]">LangChain Workflow:</strong> Build AI-powered workflows with sequential chains, agents, and memory.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
                  <CardHeader>
                    <CardTitle className="text-[var(--ff-text-primary)]">Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="workflow-name">Workflow Name</Label>
                      <Input
                        id="workflow-name"
                        placeholder="e.g., AI Content Analyzer"
                        value={workflowConfig.name}
                        onChange={(e) => setWorkflowConfig(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-[var(--ff-surface)] border-[var(--border)]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="workflow-description">Description</Label>
                      <Textarea
                        id="workflow-description"
                        placeholder="Describe your workflow purpose..."
                        value={workflowConfig.description}
                        onChange={(e) => setWorkflowConfig(prev => ({ ...prev, description: e.target.value }))}
                        className="bg-[var(--ff-surface)] border-[var(--border)]"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="langchain-model">AI Model</Label>
                      <Select value={langchainModel} onValueChange={setLangchainModel}>
                        <SelectTrigger className="bg-[var(--ff-surface)] border-[var(--border)]">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4">GPT-4</SelectItem>
                          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                          <SelectItem value="claude-2">Claude 2</SelectItem>
                          <SelectItem value="llama-2">Llama 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="langchain-template">Processing Template</Label>
                      <Textarea
                        id="langchain-template"
                        placeholder="Define your AI processing context..."
                        value={langchainTemplate}
                        onChange={(e) => setLangchainTemplate(e.target.value)}
                        className="bg-[var(--ff-surface)] border-[var(--border)]"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
                  <CardHeader>
                    <CardTitle className="text-[var(--ff-text-primary)]">Chain Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Chain Types</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {['LLMChain', 'SequentialChain', 'RouterChain', 'TransformChain'].map((chain) => (
                          <Button
                            key={chain}
                            variant={langchainChains.includes(chain) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => {
                              setLangchainChains(prev => 
                                prev.includes(chain) 
                                  ? prev.filter(c => c !== chain)
                                  : [...prev, chain]
                              );
                            }}
                            className={
                              langchainChains.includes(chain)
                                ? 'bg-[var(--ff-primary)] text-white'
                                : 'border-[var(--border)]'
                            }
                          >
                            {chain}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Selected Chains</Label>
                      <div className="flex flex-wrap gap-2">
                        {langchainChains.map((chain) => (
                          <Badge key={chain} className="bg-[var(--ff-primary)] text-white">
                            {chain}
                            <button
                              onClick={() => setLangchainChains(prev => prev.filter(c => c !== chain))}
                              className="ml-1 hover:text-red-300"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={generateWorkflow}
                        disabled={isGenerating}
                        className="w-full bg-[var(--ff-primary)] hover:bg-[var(--ff-primary-600)] text-white"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Generate Workflow
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {isGenerating && (
                <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
                  <CardHeader>
                    <CardTitle className="text-[var(--ff-text-primary)]">Generation Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-[var(--ff-text-secondary)]">
                      Generating your {activeTab} workflow...
                    </p>
                  </CardContent>
                </Card>
              )}

              {generatedWorkflow && (
                <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
                  <CardHeader>
                    <CardTitle className="text-[var(--ff-text-primary)]">Generated Workflow</CardTitle>
                    <CardDescription className="text-[var(--ff-text-muted)]">
                      Your workflow has been generated successfully. Download the files below.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      <Button
                        onClick={() => downloadWorkflow('code')}
                        variant="outline"
                        size="sm"
                        className="border-[var(--border)]"
                      >
                        <FileCode className="w-3 h-3 mr-1" />
                        Code
                      </Button>
                      <Button
                        onClick={() => downloadWorkflow('docs')}
                        variant="outline"
                        size="sm"
                        className="border-[var(--border)]"
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Docs
                      </Button>
                      <Button
                        onClick={() => downloadWorkflow('tests')}
                        variant="outline"
                        size="sm"
                        className="border-[var(--border)]"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Tests
                      </Button>
                      <Button
                        onClick={() => downloadWorkflow('deployment')}
                        variant="outline"
                        size="sm"
                        className="border-[var(--border)]"
                      >
                        <Settings className="w-3 h-3 mr-1" />
                        Deploy
                      </Button>
                      <Button
                        onClick={() => downloadWorkflow('all')}
                        className="bg-[var(--ff-secondary)] hover:bg-[var(--ff-secondary-600)] text-white"
                        size="sm"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        All
                      </Button>
                    </div>

                    <div className="p-4 bg-[var(--ff-surface)] rounded-lg border border-[var(--border)]">
                      <h4 className="text-sm font-semibold text-[var(--ff-text-primary)] mb-2">Workflow Summary</h4>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-[var(--ff-text-muted)]">Type:</span>
                          <span className="text-[var(--ff-text-primary)] ml-2 capitalize">{generatedWorkflow.config.type}</span>
                        </div>
                        <div>
                          <span className="text-[var(--ff-text-muted)]">Generated:</span>
                          <span className="text-[var(--ff-text-primary)] ml-2">{generatedWorkflow.timestamp.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[var(--ff-text-muted)]">Model:</span>
                          <span className="text-[var(--ff-text-primary)] ml-2">{langchainModel}</span>
                        </div>
                        <div>
                          <span className="text-[var(--ff-text-muted)]">Chains:</span>
                          <span className="text-[var(--ff-text-primary)] ml-2">{langchainChains.length || 2}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="graph" className="space-y-6">
              <Alert className="border-[var(--ff-secondary)] bg-[var(--ff-secondary)]/10">
                <Network className="h-4 w-4 text-[var(--ff-secondary)]" />
                <AlertDescription className="text-[var(--ff-text-secondary)]">
                  <strong className="text-[var(--ff-secondary)]">Graph Workflow:</strong> Build node-based processing pipelines with conditional logic and data flow.
                </AlertDescription>
              </Alert>
              
              <div className="text-center py-12">
                <Network className="w-16 h-16 text-[var(--ff-text-muted)] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[var(--ff-text-primary)] mb-2">Graph Workflow Builder</h3>
                <p className="text-[var(--ff-text-muted)] mb-4">Coming soon in the next update</p>
                <Button variant="outline" className="border-[var(--border)]">
                  Request Early Access
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="forge" className="space-y-6">
              <Alert className="border-[var(--ff-accent)] bg-[var(--ff-accent)]/10">
                <Settings className="h-4 w-4 text-[var(--ff-accent)]" />
                <AlertDescription className="text-[var(--ff-text-secondary)]">
                  <strong className="text-[var(--ff-accent)]">Forge Process:</strong> Automated build and deployment workflows with custom steps.
                </AlertDescription>
              </Alert>
              
              <div className="text-center py-12">
                <Settings className="w-16 h-16 text-[var(--ff-text-muted)] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[var(--ff-text-primary)] mb-2">Forge Process Builder</h3>
                <p className="text-[var(--ff-text-muted)] mb-4">Coming soon in the next update</p>
                <Button variant="outline" className="border-[var(--border)]">
                  Request Early Access
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="flow" className="space-y-6">
              <Alert className="border-[var(--ff-warning)] bg-[var(--ff-warning)]/10">
                <GitBranch className="h-4 w-4 text-[var(--ff-warning)]" />
                <AlertDescription className="text-[var(--ff-text-secondary)]">
                  <strong className="text-[var(--ff-warning)]">Flow Diagrams:</strong> Visual workflow representation with interactive elements.
                </AlertDescription>
              </Alert>
              
              <div className="text-center py-12">
                <GitBranch className="w-16 h-16 text-[var(--ff-text-muted)] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[var(--ff-text-primary)] mb-2">Flow Diagram Builder</h3>
                <p className="text-[var(--ff-text-muted)] mb-4">Coming soon in the next update</p>
                <Button variant="outline" className="border-[var(--border)]">
                  Request Early Access
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}