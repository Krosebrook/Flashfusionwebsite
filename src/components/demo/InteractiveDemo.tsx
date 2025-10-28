import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Code, 
  Rocket,
  CheckCircle,
  Clock,
  AlertCircle,
  Settings,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';

interface SimulationStep {
  id: string;
  title: string;
  description: string;
  duration: number;
  icon: React.ReactNode;
  status: 'pending' | 'running' | 'completed' | 'error';
}

export function InteractiveDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState<'web' | 'mobile' | 'fullstack'>('web');

  const simulationSteps: SimulationStep[] = [
    {
      id: 'input',
      title: 'Analyze Requirements',
      description: 'Processing your project requirements and preferences',
      duration: 2000,
      icon: <Settings className="h-4 w-4" />,
      status: currentStep > 0 ? 'completed' : currentStep === 0 ? 'running' : 'pending'
    },
    {
      id: 'generate',
      title: 'Generate Code',
      description: 'AI is creating your application code using multiple models',
      duration: 4000,
      icon: <Code className="h-4 w-4" />,
      status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'running' : 'pending'
    },
    {
      id: 'optimize',
      title: 'Optimize & Validate',
      description: 'Optimizing code structure and validating best practices',
      duration: 2500,
      icon: <Zap className="h-4 w-4" />,
      status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'running' : 'pending'
    },
    {
      id: 'deploy',
      title: 'Deploy Application',
      description: 'Deploying to your selected platforms and environments',
      duration: 3000,
      icon: <Rocket className="h-4 w-4" />,
      status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'running' : 'pending'
    }
  ];

  const platforms = [
    {
      id: 'web' as const,
      name: 'Web Application',
      icon: <Monitor className="h-5 w-5" />,
      description: 'Modern responsive web application',
      techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite']
    },
    {
      id: 'mobile' as const,
      name: 'Mobile App',
      icon: <Smartphone className="h-5 w-5" />,
      description: 'Cross-platform mobile application',
      techStack: ['React Native', 'Expo', 'TypeScript', 'NativeBase']
    },
    {
      id: 'fullstack' as const,
      name: 'Full-Stack Solution',
      icon: <Tablet className="h-5 w-5" />,
      description: 'Complete application with backend',
      techStack: ['Next.js', 'Node.js', 'Prisma', 'PostgreSQL']
    }
  ];

  const startSimulation = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    setProgress(0);

    for (let i = 0; i < simulationSteps.length; i++) {
      setCurrentStep(i);
      
      // Simulate progress for current step
      const step = simulationSteps[i];
      const duration = step.duration;
      const progressInterval = 50; // Update every 50ms
      const totalUpdates = duration / progressInterval;
      
      for (let j = 0; j <= totalUpdates; j++) {
        await new Promise(resolve => setTimeout(resolve, progressInterval));
        const stepProgress = (j / totalUpdates) * 100;
        const overallProgress = ((i * 100) + stepProgress) / simulationSteps.length;
        setProgress(overallProgress);
      }
    }
    
    setCurrentStep(simulationSteps.length);
    setIsRunning(false);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setProgress(0);
  };

  const getStatusIcon = (status: SimulationStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'running':
        return <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <Clock className="h-4 w-4 text-primary" />
        </motion.div>;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="text-2xl font-bold ff-text-gradient">
          Interactive FlashFusion Demo
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Experience the complete AI-powered development workflow from concept to deployment
        </p>
      </motion.div>

      {/* Platform Selection */}
      <Card className="ff-card-interactive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Select Your Platform
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedPlatform} onValueChange={(value) => setSelectedPlatform(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              {platforms.map((platform) => (
                <TabsTrigger key={platform.id} value={platform.id} className="flex items-center gap-2">
                  {platform.icon}
                  <span className="hidden sm:inline">{platform.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {platforms.map((platform) => (
              <TabsContent key={platform.id} value={platform.id} className="mt-4">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      {platform.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{platform.name}</h3>
                      <p className="text-sm text-muted-foreground">{platform.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-2">
                    {platform.techStack.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Simulation Controls */}
      <Card className="ff-card-interactive">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Play className="h-5 w-5 text-primary" />
              Development Simulation
            </div>
            <Badge variant="outline" className="text-xs">
              {Math.round(progress)}% Complete
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 ff-progress-bar" />
          </div>

          {/* Simulation Steps */}
          <div className="space-y-3">
            {simulationSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  flex items-center gap-3 p-3 rounded-lg border transition-all
                  ${step.status === 'completed' 
                    ? 'border-success/30 bg-success/5' 
                    : step.status === 'running'
                    ? 'border-primary/30 bg-primary/5 ff-pulse-glow'
                    : step.status === 'error'
                    ? 'border-destructive/30 bg-destructive/5'
                    : 'border-border bg-muted/30'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(step.status)}
                  {step.icon}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{step.title}</h4>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                
                {step.status === 'running' && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-xs text-primary font-medium"
                  >
                    Processing...
                  </motion.div>
                )}
                
                {step.status === 'completed' && (
                  <Badge variant="outline" className="text-xs bg-success/10 border-success/30 text-success">
                    Done
                  </Badge>
                )}
              </motion.div>
            ))}
          </div>

          {/* Control Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={startSimulation}
              disabled={isRunning}
              className="flex-1 ff-btn-primary flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                    <Pause className="h-4 w-4" />
                  </motion.div>
                  Running Simulation
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Start Demo
                </>
              )}
            </Button>
            
            <Button
              onClick={resetSimulation}
              variant="outline"
              disabled={isRunning}
              className="flex items-center gap-2 ff-hover-scale"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>

          {/* Completion Message */}
          {currentStep >= simulationSteps.length && !isRunning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4"
            >
              <Alert className="border-success/30 bg-success/5">
                <CheckCircle className="h-4 w-4 text-success" />
                <AlertDescription>
                  🎉 <strong>Demo Complete!</strong> Your {platforms.find(p => p.id === selectedPlatform)?.name.toLowerCase()} 
                  has been successfully generated and deployed. In the real FlashFusion platform, you would now have:
                  <ul className="mt-2 text-sm list-disc list-inside space-y-1">
                    <li>Downloadable source code with full project structure</li>
                    <li>Live deployment URL for immediate testing</li>
                    <li>Configuration files for easy customization</li>
                    <li>Documentation and setup instructions</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Feature Highlights */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: '🚀 Instant Deployment',
            description: 'Deploy to 8+ platforms with zero configuration'
          },
          {
            title: '🤖 Multi-AI Models',
            description: 'Leverage multiple AI models for optimal results'
          },
          {
            title: '📱 Cross-Platform',
            description: 'Generate web, mobile, and desktop applications'
          }
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <Card className="ff-card-interactive h-full">
              <CardContent className="p-4 text-center">
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default InteractiveDemo;