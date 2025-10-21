import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Settings, 
  Key, 
  Code, 
  User as UserIcon, 
  Brain,
  FileText,
  Globe,
  TestTube,
  GitBranch,
  Sliders
} from 'lucide-react';
import { User, UserStats } from '../../types';
import { APIKeyManager } from '../settings/APIKeyManager';
import { EnvironmentSetupGuide } from '../settings/EnvironmentSetupGuide';
import { RepositoryConnectionManager } from '../settings/RepositoryConnectionManager';
import { AIModelSelectionInterface } from '../ai/AIModelSelectionInterface';
import { AIServiceTest } from '../test/AIServiceTest';
import { QuickFeatureFlagPanel, FeatureFlagToggle } from '../patterns/FeatureFlag';

interface SettingsPageProps {
  user: User | null;
  userStats: UserStats | null;
}

export function SettingsPage({ user, userStats }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState('ai-models');

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold ff-text-gradient">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account, AI models, and system preferences
        </p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="ai-models" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI Models
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="repositories" className="flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            Repositories
          </TabsTrigger>
          <TabsTrigger value="environment" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Environment
          </TabsTrigger>
          <TabsTrigger value="feature-flags" className="flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            Test AI
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            Account
          </TabsTrigger>
        </TabsList>

        {/* AI Models Tab */}
        <TabsContent value="ai-models" className="space-y-6">
          <AIModelSelectionInterface />
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api-keys" className="space-y-6">
          <APIKeyManager />
        </TabsContent>

        {/* Repository Connections Tab */}
        <TabsContent value="repositories" className="space-y-6">
          <RepositoryConnectionManager />
        </TabsContent>

        {/* Environment Setup Tab */}
        <TabsContent value="environment" className="space-y-6">
          <EnvironmentSetupGuide />
        </TabsContent>

        {/* Feature Flags Tab */}
        <TabsContent value="feature-flags" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6 md:grid-cols-2"
          >
            {/* Quick Settings Panel */}
            <QuickFeatureFlagPanel />

            {/* Individual Feature Controls */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-base ff-text-gradient flex items-center gap-2">
                  <Sliders className="h-4 w-4" />
                  Feature Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FeatureFlagToggle
                  flag="advancedAnalytics"
                  label="Advanced Analytics"
                  description="Enable detailed analytics and reporting features"
                />
                <FeatureFlagToggle
                  flag="multiAgentOrchestration"
                  label="Multi-Agent Orchestration"
                  description="Advanced AI agent collaboration and workflow management"
                />
                <FeatureFlagToggle
                  flag="realTimeCollaboration"
                  label="Real-time Collaboration"
                  description="Live collaboration features with team members"
                />
                <FeatureFlagToggle
                  flag="enhancedCodeGeneration"
                  label="Enhanced Code Generation"
                  description="Advanced AI code generation with improved quality"
                />
                <FeatureFlagToggle
                  flag="aiValidation"
                  label="AI Validation"
                  description="Automatic validation of generated content and code"
                />
                <FeatureFlagToggle
                  flag="predictiveAnalytics"
                  label="Predictive Analytics"
                  description="AI-powered insights and recommendations"
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Platform Features */}
          <Card className="ff-card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-ff-primary" />
                Platform Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FeatureFlagToggle
                  flag="betaDeployments"
                  label="Beta Deployments"
                  description="Access to experimental deployment platforms"
                  size="sm"
                />
                <FeatureFlagToggle
                  flag="experimentalUI"
                  label="Experimental UI"
                  description="Early access to new interface features"
                  size="sm"
                />
                <FeatureFlagToggle
                  flag="advancedSecurity"
                  label="Advanced Security"
                  description="Enhanced security features and monitoring"
                  size="sm"
                />
                <FeatureFlagToggle
                  flag="performanceMonitoring"
                  label="Performance Monitoring"
                  description="Track and optimize application performance"
                  size="sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Monetization Features */}
          <Card className="ff-card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-ff-accent" />
                Premium Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FeatureFlagToggle
                  flag="premiumFeatures"
                  label="Premium Features"
                  description="Access to premium tools and capabilities"
                  size="sm"
                />
                <FeatureFlagToggle
                  flag="enterpriseFeatures"
                  label="Enterprise Features"
                  description="Advanced enterprise-grade functionality"
                  size="sm"
                />
              </div>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Premium and Enterprise features may require appropriate subscription tiers in production.
                  These toggles are for development and testing purposes.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Test Tab */}
        <TabsContent value="test" className="space-y-6">
          <AIServiceTest />
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card className="ff-card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-ff-primary" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-ff-text-primary">User Status</div>
                    <div className="text-ff-text-secondary">
                      {user ? 'Authenticated' : 'Guest User'}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-ff-text-primary">Session Type</div>
                    <div className="text-ff-text-secondary">
                      Development Mode
                    </div>
                  </div>
                </div>

                {userStats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="text-center p-4 bg-ff-surface rounded-lg">
                      <div className="text-lg font-bold text-ff-primary">
                        {userStats.totalProjects}
                      </div>
                      <div className="text-xs text-ff-text-muted">Total Projects</div>
                    </div>
                    
                    <div className="text-center p-4 bg-ff-surface rounded-lg">
                      <div className="text-lg font-bold text-ff-secondary">
                        {userStats.toolsUsed}
                      </div>
                      <div className="text-xs text-ff-text-muted">Tools Used</div>
                    </div>
                    
                    <div className="text-center p-4 bg-ff-surface rounded-lg">
                      <div className="text-lg font-bold text-ff-accent">
                        {userStats.downloadsGenerated}
                      </div>
                      <div className="text-xs text-ff-text-muted">Downloads</div>
                    </div>
                    
                    <div className="text-center p-4 bg-ff-surface rounded-lg">
                      <div className="text-lg font-bold text-ff-success">
                        {userStats.collaborationSessions}
                      </div>
                      <div className="text-xs text-ff-text-muted">Collaborations</div>
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-ff-surface-light">
                  <div className="text-center py-8 text-ff-text-muted">
                    <UserIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Additional account settings coming soon</p>
                    <p className="text-sm mt-2">Full user management, preferences, and billing</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}