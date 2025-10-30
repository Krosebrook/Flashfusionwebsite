/**
 * Mock data fixtures for ContentGeneratorTool
 * Extracted from components/tools/generation/ContentGeneratorTool.tsx
 */

export interface ContentTypeOption {
  value: string;
  label: string;
  description: string;
  icon?: string;
}

export interface ToneOption {
  value: string;
  label: string;
  description: string;
}

export interface AudienceOption {
  value: string;
  label: string;
  description: string;
}

export const CONTENT_TYPES: ContentTypeOption[] = [
  { value: 'blog-post', label: 'Blog Post', icon: '📝', description: 'Engaging blog articles' },
  { value: 'article', label: 'Article', icon: '📰', description: 'In-depth articles' },
  {
    value: 'documentation',
    label: 'Documentation',
    icon: '📚',
    description: 'Technical documentation',
  },
  {
    value: 'marketing-copy',
    label: 'Marketing Copy',
    icon: '📢',
    description: 'Sales and marketing content',
  },
  { value: 'social-media', label: 'Social Media', icon: '📱', description: 'Social media posts' },
  { value: 'email', label: 'Email', icon: '✉️', description: 'Email campaigns' },
  {
    value: 'product-description',
    label: 'Product Description',
    icon: '🛍️',
    description: 'E-commerce descriptions',
  },
  { value: 'press-release', label: 'Press Release', icon: '📺', description: 'Media announcements' },
];

export const TONE_OPTIONS: ToneOption[] = [
  { value: 'professional', label: 'Professional', description: 'Formal business tone' },
  { value: 'conversational', label: 'Conversational', description: 'Friendly and approachable' },
  { value: 'authoritative', label: 'Authoritative', description: 'Expert and confident' },
  { value: 'casual', label: 'Casual', description: 'Relaxed and informal' },
  { value: 'persuasive', label: 'Persuasive', description: 'Compelling and action-oriented' },
  { value: 'educational', label: 'Educational', description: 'Informative and teaching' },
  { value: 'entertaining', label: 'Entertaining', description: 'Engaging and fun' },
  { value: 'empathetic', label: 'Empathetic', description: 'Understanding and caring' },
];

export const AUDIENCE_OPTIONS: AudienceOption[] = [
  { value: 'general', label: 'General Public', description: 'Broad audience appeal' },
  {
    value: 'technical',
    label: 'Technical Professionals',
    description: 'Developers and engineers',
  },
  { value: 'business', label: 'Business Leaders', description: 'Executives and managers' },
  { value: 'consumers', label: 'Consumers', description: 'End customers' },
  { value: 'students', label: 'Students', description: 'Educational audience' },
  { value: 'experts', label: 'Industry Experts', description: 'Specialized professionals' },
];

export interface PlatformOption {
  value: string;
  label: string;
  icon: string;
  limit: number | null;
}

export const PLATFORMS: PlatformOption[] = [
  { value: 'twitter', label: 'Twitter/X', icon: '𝕏', limit: 280 },
  { value: 'instagram', label: 'Instagram', icon: '📸', limit: 2200 },
  { value: 'facebook', label: 'Facebook', icon: '👥', limit: 63206 },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼', limit: 3000 },
  { value: 'tiktok', label: 'TikTok', icon: '🎵', limit: 150 },
  { value: 'youtube', label: 'YouTube', icon: '📺', limit: 5000 },
  { value: 'blog', label: 'Blog', icon: '📝', limit: null },
  { value: 'email', label: 'Email', icon: '✉️', limit: 200 },
];

export interface LanguageOption {
  value: string;
  label: string;
}

export const LANGUAGES: LanguageOption[] = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
];
