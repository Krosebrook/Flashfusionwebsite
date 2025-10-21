import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Play, 
  Code, 
  Zap, 
  CheckCircle, 
  Download,
  Globe,
  Sparkles,
  Clock,
  Cpu,
  Rocket,
  Users,
  Target,
  ArrowRight,
  Eye,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  duration: number;
  component: string;
  status: 'pending' | 'running' | 'completed';
}

interface DemoProps {
  onClose?: () => void;
  autoStart?: boolean;
  showTryButton?: boolean;
}

export function InteractiveLandingDemo({ onClose, autoStart = false, showTryButton = true }: DemoProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [appIdea, setAppIdea] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [deploymentUrl, setDeploymentUrl] = useState('');
  const [demoProgress, setDemoProgress] = useState(0);
  const [metrics, setMetrics] = useState({
    linesOfCode: 0,
    filesGenerated: 0,
    testsCreated: 0,
    performanceScore: 0
  });

  const demoSteps: DemoStep[] = [
    {
      id: 'idea-input',
      title: 'Describe Your App',
      description: 'Tell our AI what kind of application you want to build',
      duration: 3000,
      component: 'IdeaInput',
      status: 'pending'
    },
    {
      id: 'ai-analysis',
      title: 'AI Analysis',
      description: 'AI analyzes requirements and creates architecture plan',
      duration: 4000,
      component: 'AIAnalysis',
      status: 'pending'
    },
    {
      id: 'code-generation',
      title: 'Generate Full-Stack Code',
      description: 'Creating React frontend, Node.js backend, and database schema',
      duration: 5000,
      component: 'CodeGeneration',
      status: 'pending'
    },
    {
      id: 'testing',
      title: 'Automated Testing',
      description: 'Running unit tests, integration tests, and performance checks',
      duration: 3000,
      component: 'Testing',
      status: 'pending'
    },
    {
      id: 'deployment',
      title: 'Deploy to Production',
      description: 'Deploying to cloud with SSL, CDN, and monitoring',
      duration: 4000,
      component: 'Deployment',
      status: 'pending'
    }
  ];

  const [steps, setSteps] = useState(demoSteps);

  useEffect(() => {
    if (isRunning && currentStep < steps.length) {
      const currentStepObj = steps[currentStep];
      
      // Update step status to running
      setSteps(prev => prev.map((step, index) => 
        index === currentStep 
          ? { ...step, status: 'running' }
          : step
      ));

      const timer = setTimeout(() => {
        // Complete current step
        setSteps(prev => prev.map((step, index) => 
          index === currentStep 
            ? { ...step, status: 'completed' }
            : step
        ));

        // Simulate realistic code generation
        if (currentStep === 2) {
          simulateCodeGeneration();
        }

        // Simulate deployment
        if (currentStep === 4) {
          setDeploymentUrl('https://your-app-xyz123.flashfusion.app');
        }

        // Move to next step or finish
        if (currentStep < steps.length - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          setIsRunning(false);
          setDemoProgress(100);
        }
      }, currentStepObj.duration);

      return () => clearTimeout(timer);
    }
  }, [isRunning, currentStep, steps.length]);

  // Update progress
  useEffect(() => {
    if (isRunning) {
      const completedSteps = steps.filter(s => s.status === 'completed').length;
      const runningStep = steps.find(s => s.status === 'running');
      const baseProgress = (completedSteps / steps.length) * 100;
      
      if (runningStep) {
        // Simulate step progress
        const timer = setInterval(() => {
          setDemoProgress(prev => {
            const stepProgress = ((prev - baseProgress) / (100 / steps.length)) * 100;
            if (stepProgress < 90) {
              return prev + 1;
            }
            return prev;
          });
        }, 50);
        
        return () => clearInterval(timer);
      } else {
        setDemoProgress(baseProgress);
      }
    }
  }, [isRunning, steps]);

  const simulateCodeGeneration = () => {
    const codeTemplate = `// Generated React Component
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

export function ${appIdea.replace(/[^a-zA-Z]/g, '') || 'My'}App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Your ${appIdea || 'Amazing'} App</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div>
              {/* Your app content here */}
              <p>Ready for customization!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}`;

    setGeneratedCode(codeTemplate);
    
    // Animate metrics
    let currentMetrics = { linesOfCode: 0, filesGenerated: 0, testsCreated: 0, performanceScore: 0 };
    const targetMetrics = { linesOfCode: 847, filesGenerated: 12, testsCreated: 24, performanceScore: 97 };
    
    const interval = setInterval(() => {
      currentMetrics = {
        linesOfCode: Math.min(targetMetrics.linesOfCode, currentMetrics.linesOfCode + 25),
        filesGenerated: Math.min(targetMetrics.filesGenerated, currentMetrics.filesGenerated + 1),
        testsCreated: Math.min(targetMetrics.testsCreated, currentMetrics.testsCreated + 2),
        performanceScore: Math.min(targetMetrics.performanceScore, currentMetrics.performanceScore + 3)
      };
      
      setMetrics({ ...currentMetrics });
      
      if (currentMetrics.linesOfCode >= targetMetrics.linesOfCode) {
        clearInterval(interval);
      }
    }, 100);
  };

  const startDemo = () => {
    setIsRunning(true);
    setCurrentStep(0);
    setDemoProgress(0);
    setSteps(demoSteps.map(step => ({ ...step, status: 'pending' })));
  };

  const resetDemo = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setDemoProgress(0);
    setAppIdea('');
    setGeneratedCode('');
    setDeploymentUrl('');
    setMetrics({ linesOfCode: 0, filesGenerated: 0, testsCreated: 0, performanceScore: 0 });
    setSteps(demoSteps.map(step => ({ ...step, status: 'pending' })));
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold ff-text-gradient">
            FlashFusion Demo
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Watch how FlashFusion transforms your idea into a production-ready application in minutes
        </p>
      </div>

      {/* Demo Controls */}
      <div className="flex items-center justify-center gap-4">
        {!isRunning && demoProgress === 0 && (
          <Button onClick={startDemo} className="ff-btn-primary">
            <Play className="w-4 h-4 mr-2" />
            Start Demo
          </Button>
        )}
        
        {(isRunning || demoProgress > 0) && (
          <Button variant="outline" onClick={resetDemo}>
            Reset Demo
          </Button>
        )}
        
        {onClose && (
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {/* Demo Progress */}
      {(isRunning || demoProgress > 0) && (
        <Card className="ff-glass">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Demo Progress</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(demoProgress)}% Complete
                </span>
              </div>
              <Progress value={demoProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Demo Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Steps */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Build Process</h3>
          
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`transition-all duration-500 ${
                step.status === 'running' 
                  ? 'border-primary/40 bg-primary/5 ff-pulse-glow' 
                  : step.status === 'completed'
                  ? 'border-success/40 bg-success/5'
                  : 'border-border'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      step.status === 'completed'
                        ? 'bg-success text-success-foreground'
                        : step.status === 'running'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {step.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : step.status === 'running' ? (
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium text-sm">{step.title}</div>
                      <div className="text-xs text-muted-foreground">{step.description}</div>
                    </div>
                    
                    {step.status === 'running' && (
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <Clock className="w-3 h-3" />
                        Running...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Right Column: Output */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Live Output</h3>
          
          {/* Input Stage */}
          {currentStep >= 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  App Concept
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="e.g., Task management app with real-time collaboration"
                  value={appIdea}
                  onChange={(e) => setAppIdea(e.target.value)}
                  disabled={isRunning}
                  className="ff-focus-ring"
                />
                {appIdea && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    ✨ Great idea! AI will create: React frontend, Node.js API, PostgreSQL database
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Metrics Display */}
          {currentStep >= 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-secondary" />
                  Generation Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-bold text-primary text-lg">{metrics.linesOfCode.toLocaleString()}</div>
                    <div className="text-muted-foreground">Lines of Code</div>
                  </div>
                  <div>
                    <div className="font-bold text-secondary text-lg">{metrics.filesGenerated}</div>
                    <div className="text-muted-foreground">Files Generated</div>
                  </div>
                  <div>
                    <div className="font-bold text-accent text-lg">{metrics.testsCreated}</div>
                    <div className="text-muted-foreground">Tests Created</div>
                  </div>
                  <div>
                    <div className="font-bold text-success text-lg">{metrics.performanceScore}%</div>
                    <div className="text-muted-foreground">Performance Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Code Preview */}
          {generatedCode && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Code className="w-4 h-4 text-accent" />
                  Generated Code Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-3 max-h-48 overflow-y-auto">
                  <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                    {generatedCode.slice(0, 500)}...
                  </pre>
                </div>
                <div className="mt-2 flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    React + TypeScript
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Tailwind CSS
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Node.js API
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Deployment Result */}
          {deploymentUrl && (
            <Card className="border-success/40 bg-success/5">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="w-4 h-4 text-success" />
                  Live Deployment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Successfully deployed to production</span>
                </div>
                
                <div className="p-3 bg-background rounded-lg border">
                  <div className="text-xs text-muted-foreground mb-1">Live URL:</div>
                  <div className="font-mono text-sm text-primary break-all">
                    {deploymentUrl}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-3 h-3 mr-2" />
                    View Live App
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="w-3 h-3 mr-2" />
                    Download Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Call to Action */}
      {demoProgress === 100 && showTryButton && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg"
        >
          <h3 className="text-xl font-bold">
            Ready to Build Your Own App?
          </h3>
          <p className="text-muted-foreground">
            Start creating production-ready applications in minutes with FlashFusion
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button className="ff-btn-primary px-8">
              <Rocket className="w-4 h-4 mr-2" />
              Start Building Free
            </Button>
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              View More Demos
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default InteractiveLandingDemo;