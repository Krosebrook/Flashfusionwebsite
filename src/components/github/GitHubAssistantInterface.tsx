/**
 * GitHub Assistant Agent Interface
 * Interactive UI for the modular GitHub Assistant Agent
 */

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Book, 
  FileText, 
  Eye, 
  Brain, 
  TestTube, 
  GitBranch, 
  Layers, 
  Shield, 
  Settings,
  Send,
  Sparkles,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { githubAssistant } from '../../services/GitHubAssistantAgent';
import type { AgentModule, AgentResponse, ModuleCapability } from '../../types/github-assistant';
import { toast } from 'sonner@2.0.3';

const moduleIcons: Record<AgentModule, React.ReactNode> = {
  'repo-understander': <Book className="h-5 w-5" />,
  'code-summarizer': <FileText className="h-5 w-5" />,
  'pr-reviewer': <Eye className="h-5 w-5" />,
  'refactoring-advisor': <Brain className="h-5 w-5" />,
  'test-coverage-advisor': <TestTube className="h-5 w-5" />,
  'issue-triager': <GitBranch className="h-5 w-5" />,
  'project-planner': <Layers className="h-5 w-5" />,
  'security-scanner': <Shield className="h-5 w-5" />,
  'cicd-inspector': <Settings className="h-5 w-5" />,
};

interface QueryExample {
  text: string;
  module: AgentModule;
}

const queryExamples: QueryExample[] = [
  { text: 'Explain the overall structure of this repo', module: 'repo-understander' },
  { text: 'Summarize the changes in PR #42', module: 'code-summarizer' },
  { text: 'Review this PR for quality issues', module: 'pr-reviewer' },
  { text: 'Suggest refactors for readability', module: 'refactoring-advisor' },
  { text: 'Generate test cases for auth/utils.py', module: 'test-coverage-advisor' },
  { text: 'Categorize this issue and suggest labels', module: 'issue-triager' },
  { text: 'Plan a new billing module for this app', module: 'project-planner' },
  { text: 'Scan for security issues and hardcoded secrets', module: 'security-scanner' },
  { text: 'Review our CI setup and suggest optimizations', module: 'cicd-inspector' },
];

export const GitHubAssistantInterface: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<AgentModule | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<AgentResponse | null>(null);
  const [modules, setModules] = useState<ModuleCapability[]>([]);
  const [history, setHistory] = useState<AgentResponse[]>([]);

  useEffect(() => {
    setModules(githubAssistant.getModules());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      toast.error('Please enter a query');
      return;
    }

    setIsProcessing(true);
    setResponse(null);

    try {
      const result = await githubAssistant.processRequest({
        query,
        module: selectedModule,
        options: {
          format: 'markdown',
          detail: 'detailed',
        },
      });

      setResponse(result);
      setHistory((prev) => [result, ...prev].slice(0, 10));
      toast.success('Query processed successfully');
    } catch (error) {
      console.error('Error processing query:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process query');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExampleClick = (example: QueryExample) => {
    setQuery(example.text);
    setSelectedModule(example.module);
  };

  const clearResponse = () => {
    setResponse(null);
    setQuery('');
    setSelectedModule(undefined);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-4xl font-bold">GitHub Assistant Agent</h1>
            <p className="text-muted-foreground mt-1">
              AI-powered repository understanding, code review, and project planning
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Modules */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Modules
            </h2>
            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {modules.map((module) => (
                  <button
                    key={module.id}
                    onClick={() => setSelectedModule(module.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedModule === module.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{moduleIcons[module.id]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm mb-1">{module.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {module.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Right Column - Main Interface */}
        <div className="lg:col-span-2 space-y-6">
          {/* Query Input */}
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Ask the Assistant
                </label>
                <div className="flex gap-2">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., Explain the overall structure of this repo..."
                    className="flex-1"
                    disabled={isProcessing}
                  />
                  <Button type="submit" disabled={isProcessing || !query.trim()}>
                    {isProcessing ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Processing
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {selectedModule && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Selected module:</span>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {moduleIcons[selectedModule]}
                    {modules.find((m) => m.id === selectedModule)?.name}
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedModule(undefined)}
                  >
                    Clear
                  </Button>
                </div>
              )}
            </form>
          </Card>

          {/* Examples */}
          {!response && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Example Queries</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {queryExamples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    className="text-left p-3 rounded-lg border border-border hover:border-primary/50 transition-colors text-sm"
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 text-primary">
                        {moduleIcons[example.module]}
                      </div>
                      <span className="text-muted-foreground">{example.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Response */}
          {response && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {moduleIcons[response.module]}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {modules.find((m) => m.id === response.module)?.name}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {response.metadata.processingTime}ms
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        {Math.round(response.metadata.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={clearResponse}>
                  New Query
                </Button>
              </div>

              <Separator className="my-4" />

              <ScrollArea className="h-[500px]">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap">{response.result}</div>
                </div>

                {response.recommendations && response.recommendations.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold mb-3">Recommendations</h4>
                    <div className="space-y-2">
                      {response.recommendations.map((rec, index) => (
                        <div
                          key={index}
                          className="p-3 rounded-lg border border-border bg-card"
                        >
                          <div className="flex items-start gap-2">
                            {rec.type === 'warning' ? (
                              <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <div className="font-medium text-sm">{rec.title}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {rec.description}
                              </div>
                              <Badge variant="outline" className="mt-2 text-xs">
                                {rec.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </ScrollArea>
            </Card>
          )}

          {/* History */}
          {history.length > 0 && !response && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Queries</h3>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {history.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setResponse(item)}
                      className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-primary">{moduleIcons[item.module]}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">
                            {modules.find((m) => m.id === item.module)?.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(item.metadata.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GitHubAssistantInterface;
