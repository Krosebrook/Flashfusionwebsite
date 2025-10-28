import { 
  Sparkles,
  Brain,
  Wand2,
  Video,
  Camera,
  FileText,
  ShoppingBag,
  Users,
  Play
} from 'lucide-react';

export const AI_MODELS = [
  {
    id: 'gemini',
    name: 'Gemini Pro',
    description: 'Google\'s most capable model for long-form storytelling',
    strengths: ['Creative Writing', 'Storytelling', 'Technical Content'],
    icon: Sparkles,
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 'claude',
    name: 'Claude Sonnet',
    description: 'Anthropic\'s model optimized for micro-content',
    strengths: ['Concise Copy', 'Ad Copy', 'Social Media'],
    icon: Brain,
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'gpt4',
    name: 'GPT-4 Turbo',
    description: 'OpenAI\'s flagship model for structured SEO content',
    strengths: ['SEO Content', 'Technical Writing', 'Research'],
    icon: Wand2,
    color: 'from-green-500 to-teal-600'
  }
];

export const PLATFORM_CONFIGS = {
  tiktok: {
    name: 'TikTok',
    icon: Video,
    color: '#000000',
    outputs: ['Script', 'Hooks', 'Hashtags', 'Captions']
  },
  instagram: {
    name: 'Instagram',
    icon: Camera,
    color: '#E4405F',
    outputs: ['Post Captions', 'Story Copy', 'Reel Scripts', 'IGTV Descriptions']
  },
  blog: {
    name: 'Blog Content',
    icon: FileText,
    color: '#1DA1F2',
    outputs: ['Blog Posts', 'SEO Articles', 'Tutorials', 'Reviews']
  },
  shopify: {
    name: 'Shopify',
    icon: ShoppingBag,
    color: '#96BF48',
    outputs: ['Product Descriptions', 'Collection Copy', 'Ad Copy', 'Email Marketing']
  },
  linkedin: {
    name: 'LinkedIn',
    icon: Users,
    color: '#0077B5',
    outputs: ['Professional Posts', 'Articles', 'Company Updates', 'Thought Leadership']
  },
  youtube: {
    name: 'YouTube',
    icon: Play,
    color: '#FF0000',
    outputs: ['Video Descriptions', 'Titles', 'Thumbnails Text', 'Channel Copy']
  }
};

export const CONTENT_TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual & Friendly' },
  { value: 'humorous', label: 'Humorous' },
  { value: 'inspirational', label: 'Inspirational' },
  { value: 'educational', label: 'Educational' }
];

export const TARGET_AUDIENCES = [
  { value: 'creators', label: 'Content Creators' },
  { value: 'entrepreneurs', label: 'Entrepreneurs' },
  { value: 'professionals', label: 'Professionals' },
  { value: 'students', label: 'Students' },
  { value: 'general', label: 'General Audience' }
];