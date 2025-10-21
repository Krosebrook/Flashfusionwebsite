import React, { useState, useEffect } from 'react';
import { FlashFusionShowcase } from './FlashFusionShowcase';
import { FullStackBuilderDemoPage } from './FullStackBuilderDemoPage';
import ConversionOptimizedLanding from '../marketing/ConversionOptimizedLanding';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import UserInteractionEngine from '../interactions/UserInteractionEngine';
import InfrastructureValidator from '../validation/InfrastructureValidator';
import WorkflowTest from '../ui/workflow-test';
import PlatformVerification from '../ui/platform-verification';
import { 
  Zap, 
  Users, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  Play,
  Settings,
  Monitor,
  TestTube
} from 'lucide-react';
import type { PageType } from '../../types/core';

interface HomePageProps {
  onPageChange?: (page: PageType) => void;
}

export function HomePage({ onPageChange }: HomePageProps = {}) {
  const [showValidator, setShowValidator] = useState(false);
  const [showWorkflowTest, setShowWorkflowTest] = useState(false);
  const [showPlatformVerification, setShowPlatformVerification] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [launchReadiness, setLaunchReadiness] = useState({
    infrastructure: 0,
    features: 0,
    performance: 0
  });

  // Check authentication status
  useEffect(() => {
    const authToken = localStorage.getItem('ff-auth-token');
    setIsAuthenticated(!!authToken);
  }, []);

  const handleValidationComplete = (results: { passed: number; failed: number; warnings: number }) => {
    console.log('Validation completed:', results);
    const successRate = (results.passed / (results.passed + results.failed + results.warnings)) * 100;
    setLaunchReadiness(prev => ({ ...prev, infrastructure: successRate }));
  };

  const handleCriticalFailure = (failures: any[]) => {
    console.error('Critical validation failures:', failures);
    // Handle critical failures - could show error modal or redirect
  };

  const handleActionTrigger = (action: string, context?: any) => {
    console.log('Action triggered:', action, context);
    
    switch (action) {
      case 'search-open':
        onPageChange?.('search');
        break;
      case 'tools-navigate':
        onPageChange?.('tools');
        break;
      case 'dashboard-navigate':
        onPageChange?.('dashboard');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleHelpRequest = () => {
    console.log('Help requested');
    // Could open help modal or navigate to help page
  };

  const handleFeedbackSubmit = (feedback: string, rating: number) => {
    console.log('Feedback submitted:', { feedback, rating });
    // Send feedback to analytics or feedback service
  };

  const handleSignup = (email: string) => {
    console.log('User signup:', email);
    // Enhanced user signup process with realistic onboarding flow
    localStorage.setItem('ff-signup-email', email);
    
    // Create comprehensive new user profile
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      name: email.split('@')[0],
      onboardingCompleted: false,
      signupDate: new Date().toISOString(),
      plan: 'free',
      persona: null, // Will be set during onboarding
      preferences: {
        notifications: true,
        theme: 'system',
        language: 'en'
      },
      stats: {
        projectsCreated: 0,
        toolsUsed: 0,
        timeSpent: 0
      }
    };
    
    // Store user data and auth token
    localStorage.setItem('ff-user-profile', JSON.stringify(newUser));
    localStorage.setItem('ff-auth-token', `demo_${Date.now()}`);
    localStorage.setItem('ff-onboarding-completed', 'false'); // Ensure onboarding triggers
    setIsAuthenticated(true);
    
    // Trigger page refresh to start workflow orchestrator
    // This will be picked up by the main App component's user check
    window.location.reload();
  };

  const handleDemoRequest = () => {
    console.log('Demo requested');
    // Navigate to demo page or trigger demo flow
    onPageChange?.('demo');
  };

  if (showValidator) {
    return (
      <div className="bg-background">
        <InfrastructureValidator
          onValidationComplete={handleValidationComplete}
          onCriticalFailure={handleCriticalFailure}
          autoStart={true}
        />
        
        {/* Quick Navigation */}
        <div className="fixed top-6 left-6 z-50">
          <Button
            variant="outline"
            onClick={() => setShowValidator(false)}
            className="ff-glass"
          >
            ← Back to Platform
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* User Interaction Engine */}
      <UserInteractionEngine
        currentPage="home"
        isAuthenticated={isAuthenticated}
        userPersona="developer" // Could be dynamic based on user selection
        onActionTrigger={handleActionTrigger}
        onHelpRequest={handleHelpRequest}
        onFeedbackSubmit={handleFeedbackSubmit}
      />

      {/* Launch Readiness Dashboard for Development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-6 right-6 z-30">
          <Card className="ff-glass w-72">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Monitor className="w-4 h-4 text-primary" />
                Launch Readiness
                <Badge variant="outline" className="ml-auto text-xs">
                  Day 1
                </Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-center">
                  <div className="text-xl font-bold text-primary">
                    {Math.round(launchReadiness.infrastructure)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Infrastructure</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-secondary">
                    {Math.round(launchReadiness.features)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Features</div>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start text-xs"
                  onClick={() => setShowValidator(true)}
                >
                  <Settings className="w-3 h-3 mr-2" />
                  Run Infrastructure Validation
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start text-xs"
                  onClick={() => onPageChange?.('tools')}
                >
                  <Target className="w-3 h-3 mr-2" />
                  Test Core Features
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start text-xs"
                  onClick={() => setShowWorkflowTest(true)}
                >
                  <TestTube className="w-3 h-3 mr-2" />
                  UI Workflow Test
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start text-xs"
                  onClick={() => setShowPlatformVerification(true)}
                >
                  <CheckCircle className="w-3 h-3 mr-2" />
                  Platform Verification
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions for Authenticated Users */}
      {isAuthenticated && (
        <div className="fixed bottom-20 right-6 z-30">
          <Card className="ff-glass">
            <CardContent className="p-4 space-y-2">
              <div className="text-xs font-medium text-muted-foreground mb-2">
                Quick Actions
              </div>
              
              <Button
                size="sm"
                className="w-full justify-start ff-btn-primary"
                onClick={() => onPageChange?.('tools')}
              >
                <Zap className="w-3 h-3 mr-2" />
                Start Building
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start"
                onClick={() => onPageChange?.('dashboard')}
              >
                <TrendingUp className="w-3 h-3 mr-2" />
                View Dashboard
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start"
                onClick={() => onPageChange?.('collaboration')}
              >
                <Users className="w-3 h-3 mr-2" />
                Collaborate
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Workflow Test Modal */}
      {showWorkflowTest && (
        <WorkflowTest onClose={() => setShowWorkflowTest(false)} />
      )}
      
      {/* Platform Verification Modal */}
      {showPlatformVerification && (
        <PlatformVerification onClose={() => setShowPlatformVerification(false)} />
      )}

      {/* Main Content */}
      <div className="sticky top-14 z-40 bg-background/95 backdrop-blur-sm border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Tabs defaultValue="landing" className="w-full">
            <TabsList className="inline-flex h-10 items-center justify-center rounded-xl bg-muted/30 p-1 text-muted-foreground">
              <TabsTrigger 
                value="landing" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ff-hover-scale"
              >
                Get Started
              </TabsTrigger>
              <TabsTrigger 
                value="showcase" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ff-hover-scale"
              >
                Platform Overview
              </TabsTrigger>
              <TabsTrigger 
                value="demo"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ff-hover-scale"
              >
                Live Demo
              </TabsTrigger>
              {process.env.NODE_ENV === 'development' && (
                <TabsTrigger 
                  value="validation"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ff-hover-scale"
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Validation
                </TabsTrigger>
              )}
            </TabsList>

            {/* Content with optimized spacing */}
            <TabsContent value="landing" className="mt-0 border-0 p-0">
              <ConversionOptimizedLanding
                onSignup={handleSignup}
                onDemoRequest={handleDemoRequest}
                onToolSelect={(tool) => onPageChange?.(tool as any)}
              />
            </TabsContent>

            <TabsContent value="showcase" className="mt-0 border-0 p-0">
              <FlashFusionShowcase />
            </TabsContent>

            <TabsContent value="demo" className="mt-0 border-0 p-0">
              <FullStackBuilderDemoPage />
            </TabsContent>

            {process.env.NODE_ENV === 'development' && (
              <TabsContent value="validation" className="mt-0 border-0 p-0">
                <div className="py-8">
                  <InfrastructureValidator
                    onValidationComplete={handleValidationComplete}
                    onCriticalFailure={handleCriticalFailure}
                  />
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Default export for lazy loading
export default HomePage;