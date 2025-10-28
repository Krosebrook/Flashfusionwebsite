export interface ContentOutput {
  id: string;
  platform: string;
  type: string;
  content: string;
  status: 'generating' | 'completed' | 'error';
  wordCount?: number;
  characterCount?: number;
  estimatedEngagement?: number;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  strengths: string[];
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export interface PlatformConfig {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  outputs: string[];
}

export interface ContentSettings {
  tone: string;
  targetAudience: string;
  seoOptimization: boolean;
  autoPosting: boolean;
}

export interface GenerationState {
  isGenerating: boolean;
  progress: number;
  outputs: ContentOutput[];
}