/**
 * Mock data fixtures for ContentGeneratorTool
 * Extracted from components/tools/ContentGeneratorTool.tsx
 */

export const CONTENT_TYPES = [
  { value: 'social-post', label: 'Social Media Post', description: 'Engaging social content' },
  { value: 'blog-article', label: 'Blog Article', description: 'Long-form blog content' },
  {
    value: 'product-description',
    label: 'Product Description',
    description: 'E-commerce product copy',
  },
  { value: 'email-campaign', label: 'Email Campaign', description: 'Email marketing content' },
  { value: 'ad-copy', label: 'Advertisement Copy', description: 'Promotional ad content' },
  { value: 'video-script', label: 'Video Script', description: 'Video content script' },
  { value: 'newsletter', label: 'Newsletter', description: 'Weekly/monthly newsletter' },
  { value: 'press-release', label: 'Press Release', description: 'Official announcements' },
];

export const PLATFORMS = [
  { value: 'twitter', label: 'Twitter/X', icon: '𝕏', limit: 280 },
  { value: 'instagram', label: 'Instagram', icon: '📸', limit: 2200 },
  { value: 'facebook', label: 'Facebook', icon: '👥', limit: 63206 },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼', limit: 3000 },
  { value: 'tiktok', label: 'TikTok', icon: '🎵', limit: 150 },
  { value: 'youtube', label: 'YouTube', icon: '📺', limit: 5000 },
  { value: 'blog', label: 'Blog', icon: '📝', limit: null },
  { value: 'email', label: 'Email', icon: '✉️', limit: 200 },
];

export const TONES = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
  { value: 'casual', label: 'Casual', description: 'Relaxed and friendly' },
  { value: 'humorous', label: 'Humorous', description: 'Light-hearted and funny' },
  { value: 'inspirational', label: 'Inspirational', description: 'Motivating and uplifting' },
  { value: 'educational', label: 'Educational', description: 'Informative and teaching' },
  { value: 'conversational', label: 'Conversational', description: 'Natural dialogue style' },
  { value: 'urgent', label: 'Urgent', description: 'Time-sensitive and pressing' },
  { value: 'luxury', label: 'Luxury', description: 'Premium and sophisticated' },
];

export const AUDIENCES = [
  { value: 'general', label: 'General Audience', description: 'Broad appeal' },
  { value: 'millennials', label: 'Millennials', description: '25-40 years old' },
  { value: 'gen-z', label: 'Gen Z', description: '18-25 years old' },
  { value: 'professionals', label: 'Professionals', description: 'Business audience' },
  { value: 'entrepreneurs', label: 'Entrepreneurs', description: 'Business owners' },
  { value: 'tech-enthusiasts', label: 'Tech Enthusiasts', description: 'Technology interested' },
  { value: 'creatives', label: 'Creatives', description: 'Artists and designers' },
  { value: 'parents', label: 'Parents', description: 'Family-focused audience' },
];

export const LANGUAGES = [
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
