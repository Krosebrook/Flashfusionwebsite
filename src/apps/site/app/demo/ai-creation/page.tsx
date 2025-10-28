'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BackButton from '../../../components/BackButton';
import { ArrowLeft, Play, Pause, RotateCcw, Check, Loader2, Code, Sparkles, Layout, Eye } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
  code: string;
  duration: number;
}

const steps: Step[] = [
  {
    id: 1,
    title: 'Project Description',
    description: 'Analyzing your project requirements and generating architecture plan...',
    code: `// Project: Task Management App
// Tech Stack: React + TypeScript + Tailwind
// Backend: Supabase
// Features: Authentication, CRUD operations, Real-time updates

const projectSpec = {
  name: "TaskMaster Pro",
  type: "Full-Stack Web App",
  framework: "React 18 + TypeScript",
  styling: "Tailwind CSS",
  backend: "Supabase",
  features: [
    "User authentication",
    "Task CRUD operations",
    "Real-time collaboration",
    "Priority management",
    "Due date tracking"
  ]
};`,
    duration: 3000
  },
  {
    id: 2,
    title: 'AI Analysis',
    description: 'AI is analyzing project requirements and selecting optimal architecture...',
    code: `// AI Architecture Analysis Results
const architectureDecision = {
  frontend: {
    framework: "React 18",
    stateManagement: "Zustand",
    routing: "React Router v6",
    uiLibrary: "shadcn/ui + Tailwind",
    forms: "React Hook Form + Zod"
  },
  backend: {
    database: "Supabase PostgreSQL",
    auth: "Supabase Auth",
    realtime: "Supabase Realtime",
    storage: "Supabase Storage"
  },
  deployment: {
    frontend: "Vercel",
    backend: "Supabase Cloud",
    ci_cd: "GitHub Actions"
  }
};

console.log("✅ Architecture validated by AI");`,
    duration: 3000
  },
  {
    id: 3,
    title: 'Code Generation',
    description: 'Generating production-ready code with best practices and type safety...',
    code: `// Generated React Component
import { useState } from 'react';
import { supabase } from './lib/supabase';
import { Task } from './types';

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Task list implementation */}
    </div>
  );
}`,
    duration: 4000
  },
  {
    id: 4,
    title: 'UI/UX Design',
    description: 'Applying modern design system with accessibility and responsive layout...',
    code: `// Tailwind CSS Configuration
export default {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        accent: '#EC4899'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out'
      }
    }
  }
};

// Component with Tailwind classes
<div className="max-w-7xl mx-auto px-6 py-12">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Task cards with hover effects */}
  </div>
</div>`,
    duration: 3000
  },
  {
    id: 5,
    title: 'Preview Ready',
    description: 'Your full-stack application is ready! Review, customize, or deploy now.',
    code: `// 🎉 Application Generated Successfully!

✅ React components: 12 files
✅ TypeScript types: 5 files
✅ Supabase schema: Created
✅ API endpoints: 8 routes
✅ Authentication: Configured
✅ Tests: 24 unit tests
✅ Documentation: README.md

// Ready to deploy
const deploymentOptions = [
  'Vercel (Recommended)',
  'Netlify',
  'AWS Amplify',
  'Railway',
  'Render'
];

// Next steps:
// 1. Review generated code
// 2. Customize as needed
// 3. Deploy with one click
// 4. Share with your team!`,
    duration: 2000
  }
];

export default function AICreationDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (!isRunning || isPaused) return;

    const step = steps[currentStep];
    const progressIncrement = 100 / (step.duration / 100);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + progressIncrement;
        if (next >= 100) {
          clearInterval(interval);
          setCompletedSteps((prev) => [...prev, currentStep]);
          
          // Move to next step after a brief pause
          setTimeout(() => {
            if (currentStep < steps.length - 1) {
              setCurrentStep(currentStep + 1);
              setProgress(0);
            } else {
              setIsRunning(false);
            }
          }, 500);
          
          return 100;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, isPaused, currentStep]);

  const startDemo = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseDemo = () => {
    setIsPaused(!isPaused);
  };

  const resetDemo = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStep(0);
    setProgress(0);
    setCompletedSteps([]);
  };

  const jumpToStep = (stepIndex: number) => {
    if (!isRunning) {
      setCurrentStep(stepIndex);
      setProgress(0);
      setCompletedSteps(Array.from({ length: stepIndex }, (_, i) => i));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div 
        className="border-b py-4 px-6"
        style={{
          background: 'var(--ff-surface)',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <BackButton href="/demo" label="Back to Workflows" />

          <div className="flex items-center gap-4">
            {!isRunning && completedSteps.length === 0 && (
              <button
                onClick={startDemo}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-lg transition-all hover:scale-105"
                style={{
                  background: 'var(--ff-gradient-primary)',
                  color: 'white',
                  fontFamily: 'var(--ff-font-primary)',
                  fontWeight: 'var(--ff-weight-semibold)'
                }}
              >
                <Play className="h-4 w-4" />
                Start Demo
              </button>
            )}

            {isRunning && (
              <button
                onClick={pauseDemo}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-lg border-2 transition-all hover:scale-105"
                style={{
                  borderColor: 'var(--ff-primary)',
                  color: 'var(--ff-primary)',
                  fontFamily: 'var(--ff-font-primary)',
                  fontWeight: 'var(--ff-weight-semibold)'
                }}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
            )}

            {(completedSteps.length > 0 || isRunning) && (
              <button
                onClick={resetDemo}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-lg border-2 transition-all hover:scale-105"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'var(--ff-text-secondary)',
                  fontFamily: 'var(--ff-font-primary)',
                  fontWeight: 'var(--ff-weight-semibold)'
                }}
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            )}

            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-2 rounded-lg transition-all hover:scale-105"
              style={{
                background: 'var(--ff-secondary)',
                color: 'white',
                fontFamily: 'var(--ff-font-primary)',
                fontWeight: 'var(--ff-weight-semibold)'
              }}
            >
              Sign Up to Build Real Apps
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Steps Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <h2 
              className="mb-4"
              style={{
                fontFamily: 'var(--ff-font-primary)',
                fontSize: 'var(--ff-text-lg)',
                fontWeight: 'var(--ff-weight-semibold)',
                color: 'var(--ff-text-primary)'
              }}
            >
              Generation Steps
            </h2>

            <div className="space-y-2">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => jumpToStep(index)}
                  disabled={isRunning}
                  className="w-full text-left p-4 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: currentStep === index 
                      ? 'rgba(255, 123, 0, 0.1)'
                      : completedSteps.includes(index)
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'var(--ff-surface)',
                    border: currentStep === index
                      ? '2px solid var(--ff-primary)'
                      : '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: completedSteps.includes(index)
                          ? 'var(--ff-success)'
                          : currentStep === index
                          ? 'var(--ff-primary)'
                          : 'rgba(255, 255, 255, 0.1)',
                        color: 'white'
                      }}
                    >
                      {completedSteps.includes(index) ? (
                        <Check className="h-4 w-4" />
                      ) : currentStep === index && isRunning && !isPaused ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <span style={{ fontFamily: 'var(--ff-font-primary)', fontSize: 'var(--ff-text-sm)' }}>
                          {step.id}
                        </span>
                      )}
                    </div>
                    
                    <span 
                      style={{
                        fontFamily: 'var(--ff-font-primary)',
                        fontSize: 'var(--ff-text-sm)',
                        fontWeight: 'var(--ff-weight-semibold)',
                        color: currentStep === index
                          ? 'var(--ff-primary)'
                          : completedSteps.includes(index)
                          ? 'var(--ff-success)'
                          : 'var(--ff-text-secondary)'
                      }}
                    >
                      {step.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Code Preview */}
          <div className="col-span-12 lg:col-span-9">
            <div 
              className="p-6 rounded-xl border"
              style={{
                background: 'var(--ff-surface)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 
                    style={{
                      fontFamily: 'var(--ff-font-primary)',
                      fontSize: 'var(--ff-text-2xl)',
                      fontWeight: 'var(--ff-weight-bold)',
                      color: 'var(--ff-text-primary)'
                    }}
                  >
                    {steps[currentStep].title}
                  </h3>
                  <span 
                    style={{
                      fontFamily: 'var(--ff-font-primary)',
                      fontSize: 'var(--ff-text-sm)',
                      color: 'var(--ff-primary)',
                      fontWeight: 'var(--ff-weight-semibold)'
                    }}
                  >
                    {Math.round(progress)}%
                  </span>
                </div>

                <div 
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <div 
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)'
                    }}
                  />
                </div>

                <p 
                  className="mt-2"
                  style={{
                    color: 'var(--ff-text-muted)',
                    fontFamily: 'var(--ff-font-secondary)',
                    fontSize: 'var(--ff-text-sm)'
                  }}
                >
                  {steps[currentStep].description}
                </p>
              </div>

              {/* Code Display */}
              <div 
                className="p-6 rounded-lg overflow-x-auto"
                style={{
                  background: 'var(--ff-bg-dark)',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                <pre 
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 'var(--ff-text-sm)',
                    color: 'var(--ff-text-secondary)',
                    lineHeight: '1.7'
                  }}
                >
                  {steps[currentStep].code}
                </pre>
              </div>

              {/* Completion Message */}
              {currentStep === steps.length - 1 && completedSteps.includes(currentStep) && (
                <div 
                  className="mt-6 p-6 rounded-lg"
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'var(--ff-success)' }}
                    >
                      <Check className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 
                        className="mb-2"
                        style={{
                          fontFamily: 'var(--ff-font-primary)',
                          fontSize: 'var(--ff-text-lg)',
                          fontWeight: 'var(--ff-weight-semibold)',
                          color: 'var(--ff-success)'
                        }}
                      >
                        Application Generated Successfully!
                      </h4>
                      <p 
                        style={{
                          color: 'var(--ff-text-secondary)',
                          fontFamily: 'var(--ff-font-secondary)',
                          fontSize: 'var(--ff-text-sm)',
                          lineHeight: 'var(--ff-leading-relaxed)'
                        }}
                      >
                        Your full-stack application is ready to deploy. Sign up now to download the code, customize it, and deploy to your preferred platform!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}