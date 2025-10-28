import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  CheckCircle,
  Clock,
  PlayCircle,
  ArrowRight,
  Zap,
  AlertCircle,
  Pause
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  agentId: string;
  agentName: string;
  agentColor: string;
  taskName: string;
  status: 'pending' | 'active' | 'completed' | 'error' | 'paused';
  progress?: number;
  duration?: string;
  output?: string;
  dependencies?: string[];
}

interface WorkflowPipelineProps {
  workflowId: string;
  title: string;
  description: string;
  steps: WorkflowStep[];
  onStepClick?: (stepId: string) => void;
}

export function WorkflowStatusPipeline({ 
  workflowId, 
  title, 
  description, 
  steps, 
  onStepClick 
}: WorkflowPipelineProps) {
  const [animationStep, setAnimationStep] = useState(0);

  // Animate active connections
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getStepIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'active':
        return PlayCircle;
      case 'error':
        return AlertCircle;
      case 'paused':
        return Pause;
      default:
        return Clock;
    }
  };

  const getStepColor = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return '#10b981'; // Green
      case 'active':
        return '#3b82f6'; // Blue
      case 'error':
        return '#ef4444'; // Red
      case 'paused':
        return '#f59e0b'; // Yellow
      default:
        return '#6b7280'; // Gray
    }
  };

  const getConnectionStatus = (currentStep: WorkflowStep, nextStep?: WorkflowStep) => {
    if (currentStep.status === 'completed' && nextStep?.status === 'active') {
      return 'transferring';
    } else if (currentStep.status === 'completed') {
      return 'completed';
    } else if (currentStep.status === 'active') {
      return 'active';
    }
    return 'pending';
  };

  return (
    <Card className="p-6 bg-white/95 backdrop-blur-[10px] border border-white/20">
      {/* Workflow Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <Badge 
            className={
              steps.every(s => s.status === 'completed') ? 'bg-green-100 text-green-700' :
              steps.some(s => s.status === 'error') ? 'bg-red-100 text-red-700' :
              steps.some(s => s.status === 'active') ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-700'
            }
          >
            {steps.every(s => s.status === 'completed') ? 'Completed' :
             steps.some(s => s.status === 'error') ? 'Error' :
             steps.some(s => s.status === 'active') ? 'In Progress' :
             'Pending'}
          </Badge>
        </div>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>

      {/* Pipeline Visualization */}
      <div className="relative">
        {/* Horizontal flow container */}
        <div className="flex items-center space-x-4 overflow-x-auto pb-4">
          {steps.map((step, index) => {
            const StepIcon = getStepIcon(step.status);
            const nextStep = steps[index + 1];
            const connectionStatus = getConnectionStatus(step, nextStep);

            return (
              <React.Fragment key={step.id}>
                {/* Agent Step */}
                <motion.div
                  className="flex-shrink-0"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div 
                    className="relative cursor-pointer"
                    onClick={() => onStepClick?.(step.id)}
                  >
                    {/* Agent Avatar */}
                    <motion.div
                      className="w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center relative overflow-hidden"
                      style={{ backgroundColor: step.agentColor }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Glow effect for active agents */}
                      {step.status === 'active' && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: `linear-gradient(45deg, ${step.agentColor}, transparent)`,
                            opacity: 0.6
                          }}
                          animate={{
                            rotate: 360,
                            scale: [1, 1.2, 1]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                      )}
                      
                      <StepIcon 
                        className="h-6 w-6 text-white relative z-10" 
                      />
                      
                      {/* Progress ring for active tasks */}
                      {step.status === 'active' && step.progress !== undefined && (
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                          <circle
                            cx="50%"
                            cy="50%"
                            r="30"
                            fill="none"
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth="2"
                          />
                          <motion.circle
                            cx="50%"
                            cy="50%"
                            r="30"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 30}`}
                            initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
                            animate={{ 
                              strokeDashoffset: 2 * Math.PI * 30 - (2 * Math.PI * 30 * (step.progress / 100))
                            }}
                            transition={{ duration: 0.5 }}
                          />
                        </svg>
                      )}
                    </motion.div>

                    {/* Step Info */}
                    <div className="mt-3 text-center min-w-[120px]">
                      <div className="font-semibold text-sm text-gray-900">
                        {step.agentName}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {step.taskName}
                      </div>
                      
                      {/* Progress info */}
                      {step.status === 'active' && step.progress !== undefined && (
                        <div className="text-xs font-semibold mt-1" style={{ color: step.agentColor }}>
                          {step.progress}%
                        </div>
                      )}
                      
                      {step.duration && (
                        <div className="text-xs text-gray-400 mt-1">
                          {step.duration}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="flex-shrink-0 relative">
                    <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                      {/* Base line */}
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: connectionStatus === 'completed' 
                            ? '#10b981'
                            : connectionStatus === 'active'
                            ? '#3b82f6'
                            : connectionStatus === 'transferring'
                            ? `linear-gradient(90deg, #10b981 0%, #3b82f6 100%)`
                            : '#e5e7eb'
                        }}
                        initial={{ width: 0 }}
                        animate={{ 
                          width: connectionStatus === 'pending' ? 0 : '100%' 
                        }}
                        transition={{ duration: 0.8, delay: index * 0.2 }}
                      />
                      
                      {/* Animated transfer effect */}
                      {connectionStatus === 'transferring' && (
                        <motion.div
                          className="absolute top-0 left-0 w-4 h-full bg-white/60 rounded-full"
                          animate={{
                            x: [-16, 64]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                    </div>
                    
                    {/* Arrow indicator */}
                    <ArrowRight 
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-3 w-3"
                      style={{ 
                        color: connectionStatus === 'completed' || connectionStatus === 'active' || connectionStatus === 'transferring'
                          ? '#3b82f6'
                          : '#9ca3af'
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Overall Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Workflow Progress</span>
            <span className="text-sm text-gray-500">
              {steps.filter(s => s.status === 'completed').length} of {steps.length} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500"
              initial={{ width: 0 }}
              animate={{ 
                width: `${(steps.filter(s => s.status === 'completed').length / steps.length) * 100}%` 
              }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>

        {/* Step Details for Active/Error States */}
        <AnimatePresence>
          {steps.some(s => s.status === 'active' || s.status === 'error') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100"
            >
              {steps.filter(s => s.status === 'active' || s.status === 'error').map(step => (
                <div key={step.id} className="flex items-start space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full mt-1"
                    style={{ backgroundColor: getStepColor(step.status) }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">
                      {step.agentName} - {step.taskName}
                    </div>
                    {step.status === 'active' && step.progress !== undefined && (
                      <div className="mt-1">
                        <Progress value={step.progress} className="h-1" />
                        <div className="text-xs text-gray-500 mt-1">
                          Processing... {step.progress}% complete
                        </div>
                      </div>
                    )}
                    {step.status === 'error' && (
                      <div className="text-xs text-red-600 mt-1">
                        Task failed - Click to retry
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}