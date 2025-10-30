/**
 * @fileoverview Launch Preparation Hub - decomposed composition layer
 */

import { useMemo } from 'react';
import { LaunchOverviewSection } from './sections/LaunchOverviewSection';
import { DocumentationGeneratorSection } from './sections/DocumentationGeneratorSection';
import { AssetManagementSection } from './sections/AssetManagementSection';
import { MarketingCampaignSection } from './sections/MarketingCampaignSection';
import { SupportChannelSection } from './sections/SupportChannelSection';
import { LaunchChecklistSection } from './sections/LaunchChecklistSection';
import { ContentRequestsSection } from './sections/ContentRequestsSection';
import { useLaunchAssets } from './useLaunchAssets';
import { useDocumentationGenerator } from './useDocumentationGenerator';
import { useMarketingCampaigns } from './useMarketingCampaigns';
import { useSupportChannels } from './useSupportChannels';
import {
  calculateLaunchReadiness,
  calculateOverallProgress,
  getCompletionScore,
  type DocumentationType,
} from './LaunchPreparationHub.logic';
import { LAUNCH_CHECKLIST, INITIAL_ASSETS, INITIAL_CAMPAIGNS, INITIAL_SUPPORT_CHANNELS, CONTENT_REQUESTS } from '@/fixtures/launch/launch-preparation-fixtures';

export function LaunchPreparationHub() {
  const launchReadiness = useMemo(() => calculateLaunchReadiness(LAUNCH_CHECKLIST), []);

  const {
    selectedAsset,
    setSelectedAsset,
    updateAsset,
    deleteAsset,
    sortedByPriority,
    statistics: assetStatistics,
  } = useLaunchAssets(INITIAL_ASSETS);

  const documentation = useDocumentationGenerator();

  const {
    selectedCampaign,
    setSelectedCampaign,
    sortedByROI,
    statistics: campaignStatistics,
    getCampaignROI,
  } = useMarketingCampaigns(INITIAL_CAMPAIGNS);

  const {
    activeChannel,
    setActiveChannel,
    sortedBySatisfaction,
    metrics: supportMetrics,
    statistics: supportStatistics,
  } = useSupportChannels(INITIAL_SUPPORT_CHANNELS);

  const checklistCompletion = useMemo(() => {
    const totalItems = LAUNCH_CHECKLIST.reduce((sum, category) => sum + category.items.length, 0);
    const completedItems = Math.round(totalItems * 0.78);
    return getCompletionScore(Array.from({ length: totalItems }), completedItems);
  }, []);

  const supportSatisfactionPercent = useMemo(
    () => Math.min(Math.round(supportMetrics.averageSatisfaction * 20), 100),
    [supportMetrics.averageSatisfaction]
  );

  const campaignPortfolioPercent = useMemo(
    () => Math.min(Math.round(campaignStatistics.portfolioROI), 200),
    [campaignStatistics.portfolioROI]
  );

  const overallProgress = useMemo(
    () =>
      calculateOverallProgress({
        assets: assetStatistics.averageProgress,
        campaigns: Math.min(campaignPortfolioPercent, 100),
        support: supportSatisfactionPercent,
        legal: launchReadiness,
      }),
    [assetStatistics.averageProgress, campaignPortfolioPercent, supportSatisfactionPercent, launchReadiness]
  );

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Launch Preparation Hub</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Coordinate product, marketing, legal, and support workstreams to deliver a successful launch. Monitor readiness,
          generate documentation, and keep every asset production track unblocked.
        </p>
      </header>

      <LaunchOverviewSection
        launchReadiness={launchReadiness}
        overallProgress={overallProgress}
        assetAverageProgress={assetStatistics.averageProgress}
        campaignPortfolioRoi={Math.min(campaignPortfolioPercent, 100)}
        supportSatisfaction={supportSatisfactionPercent}
        totalSupportVolume={supportMetrics.totalVolume}
      />

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <DocumentationGeneratorSection
            isGenerating={documentation.isGenerating}
            generationProgress={documentation.generationProgress}
            currentDocType={documentation.currentDocType as DocumentationType | 'press-kit' | null}
            generatedDocs={documentation.generatedDocs}
            onGenerate={documentation.generateDocumentation}
            onGeneratePressKit={documentation.generatePressKit}
            onDownload={documentation.downloadDocumentation}
            onPreview={documentation.previewDocumentation}
            onDelete={documentation.deleteGeneratedDoc}
            onClearAll={documentation.clearAllDocs}
          />

          <AssetManagementSection
            selectedAsset={selectedAsset}
            onSelectAsset={setSelectedAsset}
            onUpdateAsset={updateAsset}
            onDeleteAsset={deleteAsset}
            sortedByPriority={sortedByPriority}
            averageProgress={assetStatistics.averageProgress}
          />
        </div>

        <div className="space-y-6">
          <MarketingCampaignSection
            selectedCampaign={selectedCampaign}
            onSelectCampaign={setSelectedCampaign}
            sortedByROI={sortedByROI}
            statistics={campaignStatistics}
            getCampaignROI={getCampaignROI}
          />

          <SupportChannelSection
            activeChannel={activeChannel}
            onSelectChannel={setActiveChannel}
            sortedBySatisfaction={sortedBySatisfaction}
            metrics={supportMetrics}
            statistics={supportStatistics}
          />
        </div>
      </div>

      <LaunchChecklistSection checklist={LAUNCH_CHECKLIST} completionPercentage={checklistCompletion} />

      <ContentRequestsSection requests={CONTENT_REQUESTS} />
    </div>
  );
}
