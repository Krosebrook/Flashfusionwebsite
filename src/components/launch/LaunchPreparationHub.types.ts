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
 * Documentation generation types supported by the hub
 */
export type DocumentationType = 'user-manual' | 'api-docs' | 'tutorials' | 'faq';

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
 * Props for the documentation generator section
 */
export interface DocumentationGeneratorSectionProps {
  isGenerating: boolean;
  generationProgress: number;
  onGenerateDocumentation: (type: DocumentationType) => Promise<void> | void;
}

/**
 * Props for the asset management section
 */
export interface AssetManagementSectionProps {
  assets: LaunchAsset[];
  selectedAssetId?: string | null;
  onSelectAsset?: (asset: LaunchAsset) => void;
  onUpdateAsset?: (id: string, updates: Partial<LaunchAsset>) => void;
  onDeleteAsset?: (id: string) => void;
  onAddAsset?: (asset: LaunchAsset) => void;
}

/**
 * Props for the marketing campaign section
 */
export interface MarketingCampaignSectionProps {
  campaigns: MarketingCampaign[];
  onGeneratePressKit: () => void;
  onSelectCampaign?: (campaign: MarketingCampaign) => void;
  onUpdateCampaign?: (id: string, updates: Partial<MarketingCampaign>) => void;
  onDeleteCampaign?: (id: string) => void;
}

/**
 * Props for the support channel section
 */
export interface SupportChannelSectionProps {
  channels: SupportChannel[];
  onSelectChannel?: (channel: SupportChannel) => void;
  onUpdateChannel?: (id: string, updates: Partial<SupportChannel>) => void;
  onDeleteChannel?: (id: string) => void;
}

/**
 * Props for the launch checklist section
 */
export interface LaunchChecklistSectionProps {
  checklist: LaunchChecklistCategory[];
  onScheduleLaunch?: () => void;
  onExportChecklist?: () => void;
  onShareProgress?: () => void;
}
