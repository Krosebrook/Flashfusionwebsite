/**
 * @fileoverview Launch Preparation Hub - decomposed composition layer
 */

import React, { useMemo } from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { BookOpen, CheckCircle, Megaphone, Rocket, Shield, Target, Users } from 'lucide-react';
import { useLaunchAssets } from './useLaunchAssets';
import { useMarketingCampaigns } from './useMarketingCampaigns';
import { useSupportChannels } from './useSupportChannels';
import { useDocumentationGenerator } from './useDocumentationGenerator';
import { calculateLaunchReadiness } from './LaunchPreparationHub.logic';
import {
  INITIAL_ASSETS,
  INITIAL_CAMPAIGNS,
  INITIAL_SUPPORT_CHANNELS,
  LAUNCH_CHECKLIST,
} from '../../fixtures/launch/launch-preparation-fixtures';
import { DocumentationGeneratorSection } from './DocumentationGeneratorSection';
import { AssetManagementSection } from './AssetManagementSection';
import { MarketingCampaignSection } from './MarketingCampaignSection';
import { SupportChannelSection } from './SupportChannelSection';
import { LaunchChecklistSection } from './LaunchChecklistSection';
import { LegalComplianceSection } from './sections/LegalComplianceSection';

export function LaunchPreparationHub() {
  const { getAssetsByType } = useLaunchAssets(INITIAL_ASSETS);
  const { campaigns, getCampaignROI } = useMarketingCampaigns(INITIAL_CAMPAIGNS);
  const { channels: supportChannels, getChannelStatus } = useSupportChannels(INITIAL_SUPPORT_CHANNELS);
  const {
    isGenerating,
    generationProgress,
    generateDocumentation,
    generatePressKit,
  } = useDocumentationGenerator();

  const launchReadiness = useMemo(
    () => calculateLaunchReadiness(LAUNCH_CHECKLIST),
    []
  );

  return (
    <div className="space-y-6" style={{ fontFamily: 'var(--ff-font-secondary)' }}>
      <Card className="bg-[var(--ff-surface)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)' }}>
            <Rocket className="w-6 h-6 text-[var(--ff-primary)]" />
            Launch Preparation Hub
          </CardTitle>
          <CardDescription className="text-[var(--ff-text-secondary)]">
            Comprehensive launch preparation with documentation generation, marketing materials, support systems, and legal compliance tools.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Launch Readiness Overview */}
          <Alert className="border-[var(--ff-primary)] bg-[var(--ff-primary)]/10 mb-6">
            <Target className="h-4 w-4 text-[var(--ff-primary)]" />
            <AlertDescription className="text-[var(--ff-text-secondary)]">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-[var(--ff-primary)]">Launch Readiness:</strong> {launchReadiness}% complete
                </div>
                <Badge variant={launchReadiness >= 80 ? 'default' : launchReadiness >= 60 ? 'secondary' : 'destructive'}>
                  {launchReadiness >= 80 ? 'Ready' : launchReadiness >= 60 ? 'In Progress' : 'Needs Work'}
                </Badge>
              </div>
              <Progress value={launchReadiness} className="h-2 mt-2" />
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="documentation">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="documentation" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Docs
              </TabsTrigger>
              <TabsTrigger value="marketing" className="flex items-center gap-2">
                <Megaphone className="w-4 h-4" />
                Marketing
              </TabsTrigger>
              <TabsTrigger value="support" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Support
              </TabsTrigger>
              <TabsTrigger value="legal" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Legal
              </TabsTrigger>
              <TabsTrigger value="checklist" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Checklist
              </TabsTrigger>
            </TabsList>

            <TabsContent value="documentation" className="space-y-6">
              <DocumentationGeneratorSection
                isGenerating={isGenerating}
                generationProgress={generationProgress}
                onGenerateDocumentation={generateDocumentation}
                getAssetsByType={getAssetsByType}
              />
            </TabsContent>

            <TabsContent value="marketing" className="space-y-6">
              <Alert className="border-[var(--ff-accent)] bg-[var(--ff-accent)]/10">
                <Megaphone className="h-4 w-4 text-[var(--ff-accent)]" />
                <AlertDescription className="text-[var(--ff-text-secondary)]">
                  <strong className="text-[var(--ff-accent)]">Marketing Campaign Management:</strong> Create and manage launch campaigns across multiple channels with performance tracking.
                </AlertDescription>
              </Alert>

              <AssetManagementSection onGeneratePressKit={generatePressKit} />
              <MarketingCampaignSection
                campaigns={campaigns}
                onGetCampaignROI={getCampaignROI}
              />
            </TabsContent>

            <TabsContent value="support" className="space-y-6">
              <SupportChannelSection
                channels={supportChannels}
                onGetChannelStatus={getChannelStatus}
              />
            </TabsContent>

            <TabsContent value="legal" className="space-y-6">
              <LegalComplianceSection />
            </TabsContent>

            <TabsContent value="checklist" className="space-y-6">
              <LaunchChecklistSection categories={LAUNCH_CHECKLIST} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default LaunchPreparationHub;
