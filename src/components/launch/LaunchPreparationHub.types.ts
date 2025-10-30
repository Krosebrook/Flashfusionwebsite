/**
 * @fileoverview Type definitions for LaunchPreparationHub
 * @chunk launch
 * @category marketing
 *
 * Extracted during Step 3: Component Decomposition
 */

/**
 * Launch Asset represents any deliverable needed for product launch
 */
export interface LaunchAsset {
  id: string;
  type: 'documentation' | 'video' | 'image' | 'press-kit' | 'legal' | 'tutorial';
  title: string;
  description: string;
  status: 'draft' | 'review' | 'approved' | 'published';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  dueDate?: Date;
  assignee?: string;
  tags: string[];
}

/**
 * Marketing Campaign configuration and metrics
 */
export interface MarketingCampaign {
  id: string;
  name: string;
  type: 'social' | 'email' | 'press' | 'influencer' | 'content';
  status: 'planning' | 'created' | 'scheduled' | 'active' | 'completed';
  reach: number;
  engagement: number;
  budget: number;
  roi: number;
  startDate: Date;
  endDate: Date;
}

/**
 * Support Channel configuration and performance metrics
 */
export interface SupportChannel {
  id: string;
  name: string;
  type: 'email' | 'chat' | 'phone' | 'docs' | 'community' | 'video';
  status: 'active' | 'setup' | 'testing';
  responseTime: string;
  satisfaction: number;
  volume: number;
}

/**
 * Launch checklist category
 */
export interface LaunchChecklistCategory {
  category: string;
  items: string[];
}

/**
 * Content request for marketing materials
 */
export interface ContentRequest {
  id: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  deadline: string;
}

/**
 * ROI calculation result for marketing campaigns
 */
export interface CampaignROIResult {
  roi: number;
  profit: number;
  costPerEngagement: number;
}

/**
 * Props for the documentation generator section
 */
export interface DocumentationGeneratorSectionProps {
  isGenerating: boolean;
  generationProgress: number;
  onGenerateDocumentation: (type: string) => void;
  getAssetsByType: (type: LaunchAsset['type']) => LaunchAsset[];
}

/**
 * Props for the asset management section
 */
export interface AssetManagementSectionProps {
  onGeneratePressKit: () => void;
}

/**
 * Props for the marketing campaign section
 */
export interface MarketingCampaignSectionProps {
  campaigns: MarketingCampaign[];
  onGetCampaignROI: (campaign: MarketingCampaign) => CampaignROIResult;
}

/**
 * Props for the support channel section
 */
export interface SupportChannelSectionProps {
  channels: SupportChannel[];
  onGetChannelStatus: (channel: SupportChannel) => {
    isHealthy: boolean;
    needsAttention: boolean;
    inProgress: boolean;
    statusLabel: string;
  };
}

/**
 * Props for the launch checklist section
 */
export interface LaunchChecklistSectionProps {
  categories: LaunchChecklistCategory[];
}
