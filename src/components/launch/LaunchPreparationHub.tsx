/**
 * @fileoverview Launch Preparation Hub - decomposed composition layer
 */

import React, { useMemo } from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
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
              <Alert className="border-[var(--ff-error)] bg-[var(--ff-error)]/10">
                <Shield className="h-4 w-4 text-[var(--ff-error)]" />
                <AlertDescription className="text-[var(--ff-text-secondary)]">
                  <strong className="text-[var(--ff-error)]">Legal Compliance:</strong> Ensure all legal documents, privacy policies, and compliance requirements are properly configured before launch.
                </AlertDescription>
              </Alert>

              <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
                <CardHeader>
                  <CardTitle className="text-[var(--ff-text-primary)]">Legal Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--ff-text-primary)]">Terms of Service</span>
                    <Badge variant="default" className="bg-[var(--ff-success)] text-white">Complete</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--ff-text-primary)]">Privacy Policy</span>
                    <Badge variant="default" className="bg-[var(--ff-success)] text-white">Complete</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--ff-text-primary)]">Cookie Policy</span>
                    <Badge variant="secondary">Review</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--ff-text-primary)]">GDPR Compliance</span>
                    <Badge variant="default" className="bg-[var(--ff-success)] text-white">Complete</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--ff-text-primary)]">Data Processing Agreement</span>
                    <Badge variant="outline">Draft</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
                <CardHeader>
                  <CardTitle className="text-[var(--ff-text-primary)]">Compliance &amp; Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--ff-text-primary)]">SOC 2 Type II</span>
                    <Badge variant="default" className="bg-[var(--ff-success)] text-white">Certified</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--ff-text-primary)]">ISO 27001</span>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--ff-text-primary)]">CCPA Compliance</span>
                    <Badge variant="default" className="bg-[var(--ff-success)] text-white">Complete</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--ff-text-primary)]">PCI DSS</span>
                    <Badge variant="outline">Not Required</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--ff-text-primary)]">Security Audit</span>
                    <Badge variant="default" className="bg-[var(--ff-success)] text-white">Passed</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[var(--ff-surface)] border-[var(--border)]">
                <CardHeader>
                  <CardTitle className="text-[var(--ff-text-primary)]">Legal Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[var(--ff-text-primary)]">Company Legal Name</Label>
                      <Input
                        defaultValue="FlashFusion, Inc."
                        className="bg-[var(--input-background)] border-[var(--border)]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[var(--ff-text-primary)]">Jurisdiction</Label>
                      <Select defaultValue="delaware">
                        <SelectTrigger className="bg-[var(--input-background)] border-[var(--border)]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="delaware">Delaware, USA</SelectItem>
                          <SelectItem value="california">California, USA</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="eu">European Union</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[var(--ff-text-primary)]">Data Protection Officer Email</Label>
                    <Input
                      defaultValue="dpo@flashfusion.ai"
                      className="bg-[var(--input-background)] border-[var(--border)]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[var(--ff-text-primary)]">Legal Contact Address</Label>
                    <Textarea
                      defaultValue="123 Innovation Drive, San Francisco, CA 94105, USA"
                      className="bg-[var(--input-background)] border-[var(--border)]"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
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
