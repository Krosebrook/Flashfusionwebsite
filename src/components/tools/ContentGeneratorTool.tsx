import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Slider } from '../ui/slider';
import { 
  PenTool, 
  Sparkles, 
  Download, 
  Copy, 
  RefreshCw, 
  Target,
  Hash,
  Calendar,
  Users,
  TrendingUp,
  Image,
  Video,
  MessageSquare,
  Share2,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap
} from 'lucide-react';
import { aiServiceManager } from '../../services/AIServiceManager';

interface ContentConfig {
  topic: string;
  contentType: string;
  platform: string[];
  tone: string;
  audience: string;
  length: string;
  includeHashtags: boolean;
  includeEmojis: boolean;
  includeCTA: boolean;
  keywords: string[];
  targetLanguage: string;
  brandVoice?: string;
}

interface GeneratedContent {
  id: string;
  platform: string;
  content: string;
  hashtags: string[];
  engagement_prediction: number;
  character_count: number;
  word_count: number;
  readability_score: number;
  seo_score: number;
  timestamp: number;
}

interface ContentAnalytics {
  sentiment: 'positive' | 'neutral' | 'negative';
  readability: number;
  engagement_potential: number;
  brand_alignment: number;
  trending_topics: string[];
  optimal_posting_time: string;
}

const CONTENT_TYPES = [
  { value: 'social-post', label: 'Social Media Post', description: 'Engaging social content' },
  { value: 'blog-article', label: 'Blog Article', description: 'Long-form blog content' },
  { value: 'product-description', label: 'Product Description', description: 'E-commerce product copy' },
  { value: 'email-campaign', label: 'Email Campaign', description: 'Email marketing content' },
  { value: 'ad-copy', label: 'Advertisement Copy', description: 'Promotional ad content' },
  { value: 'video-script', label: 'Video Script', description: 'Video content script' },
  { value: 'newsletter', label: 'Newsletter', description: 'Weekly/monthly newsletter' },
  { value: 'press-release', label: 'Press Release', description: 'Official announcements' }
];

const PLATFORMS = [
  { value: 'twitter', label: 'Twitter/X', icon: '𝕏', limit: 280 },
  { value: 'instagram', label: 'Instagram', icon: '📸', limit: 2200 },
  { value: 'facebook', label: 'Facebook', icon: '👥', limit: 63206 },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼', limit: 3000 },
  { value: 'tiktok', label: 'TikTok', icon: '🎵', limit: 150 },
  { value: 'youtube', label: 'YouTube', icon: '📺', limit: 5000 },
  { value: 'blog', label: 'Blog', icon: '📝', limit: null },
  { value: 'email', label: 'Email', icon: '✉️', limit: 200 }
];

const TONES = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
  { value: 'casual', label: 'Casual', description: 'Relaxed and friendly' },
  { value: 'humorous', label: 'Humorous', description: 'Light-hearted and funny' },
  { value: 'inspirational', label: 'Inspirational', description: 'Motivating and uplifting' },
  { value: 'educational', label: 'Educational', description: 'Informative and teaching' },
  { value: 'conversational', label: 'Conversational', description: 'Natural dialogue style' },
  { value: 'urgent', label: 'Urgent', description: 'Time-sensitive and pressing' },
  { value: 'luxury', label: 'Luxury', description: 'Premium and sophisticated' }
];

const AUDIENCES = [
  { value: 'general', label: 'General Audience', description: 'Broad appeal' },
  { value: 'millennials', label: 'Millennials', description: '25-40 years old' },
  { value: 'gen-z', label: 'Gen Z', description: '18-25 years old' },
  { value: 'professionals', label: 'Professionals', description: 'Business audience' },
  { value: 'entrepreneurs', label: 'Entrepreneurs', description: 'Business owners' },
  { value: 'tech-enthusiasts', label: 'Tech Enthusiasts', description: 'Technology interested' },
  { value: 'creatives', label: 'Creatives', description: 'Artists and designers' },
  { value: 'parents', label: 'Parents', description: 'Family-focused audience' }
];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' }
];

export function ContentGeneratorTool() {
  const [config, setConfig] = useState<ContentConfig>({
    topic: '',
    contentType: 'social-post',
    platform: ['twitter'],
    tone: 'professional',
    audience: 'general',
    length: 'medium',
    includeHashtags: true,
    includeEmojis: false,
    includeCTA: true,
    keywords: [],
    targetLanguage: 'en'
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);
  const [contentAnalytics, setContentAnalytics] = useState<ContentAnalytics | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  const addKeyword = () => {
    if (keywordInput.trim() && !config.keywords.includes(keywordInput.trim())) {
      setConfig(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setConfig(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const generateContent = async () => {
    if (!config.topic.trim()) {
      alert('Please provide a topic for content generation');
      return;
    }

    setIsGenerating(true);
    setGeneratedContent([]);
    setSelectedContent(null);
    setGenerationProgress(0);

    try {
      const contents: GeneratedContent[] = [];
      
      for (let i = 0; i < config.platform.length; i++) {
        const platform = config.platform[i];
        const platformData = PLATFORMS.find(p => p.value === platform);
        
        setGenerationProgress((i / config.platform.length) * 100);

        const prompt = buildContentPrompt(config, platform, platformData);
        const response = await aiServiceManager.generateContent(prompt, config.contentType);

        const content = parseContentResponse(response.content, platform);
        const analytics = await analyzeContent(content.content, platform);

        contents.push({
          ...content,
          id: `content_${Date.now()}_${i}`,
          platform,
          engagement_prediction: analytics.engagement_potential,
          readability_score: analytics.readability,
          seo_score: calculateSEOScore(content.content, config.keywords),
          timestamp: Date.now()
        });

        // Simulate progress
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setGeneratedContent(contents);
      setSelectedContent(contents[0]);
      setGenerationProgress(100);

    } catch (error) {
      console.error('Content generation failed:', error);
      alert('Content generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const buildContentPrompt = (config: ContentConfig, platform: string, platformData: any): string => {
    const platformLimit = platformData?.limit ? ` (max ${platformData.limit} characters)` : '';
    
    return `Create ${config.contentType} content for ${platform}${platformLimit}.

Topic: ${config.topic}
Tone: ${config.tone}
Target Audience: ${config.audience}
Language: ${config.targetLanguage}
Length: ${config.length}

Requirements:
- ${config.includeHashtags ? 'Include relevant hashtags' : 'No hashtags'}
- ${config.includeEmojis ? 'Include appropriate emojis' : 'No emojis'}
- ${config.includeCTA ? 'Include a clear call-to-action' : 'No call-to-action'}
${config.keywords.length > 0 ? `- Include these keywords naturally: ${config.keywords.join(', ')}` : ''}
${config.brandVoice ? `- Brand voice: ${config.brandVoice}` : ''}

Platform-specific considerations:
${getPlatformGuidelines(platform)}

Create engaging, platform-optimized content that resonates with the target audience and drives engagement.`;
  };

  const getPlatformGuidelines = (platform: string): string => {
    const guidelines: Record<string, string> = {
      twitter: '- Use threading for longer content\n- Include trending hashtags\n- Encourage retweets and replies',
      instagram: '- Visual-first content\n- Use Instagram-specific hashtags\n- Encourage saves and shares',
      facebook: '- Longer-form content allowed\n- Encourage meaningful comments\n- Include questions to drive engagement',
      linkedin: '- Professional tone mandatory\n- Include industry insights\n- Tag relevant connections or companies',
      tiktok: '- Short, catchy content\n- Include trending sounds/hashtags\n- Call for user-generated content',
      youtube: '- Hook viewers in first 15 seconds\n- Include timestamps for longer content\n- Encourage likes and subscriptions',
      blog: '- SEO-optimized headlines\n- Include subheadings and bullet points\n- Add internal and external links',
      email: '- Compelling subject line\n- Personalized greeting\n- Clear value proposition and CTA'
    };

    return guidelines[platform] || '- Follow platform best practices';
  };

  const parseContentResponse = (content: string, platform: string): Partial<GeneratedContent> => {
    // Extract hashtags
    const hashtagRegex = /#\w+/g;
    const hashtags = content.match(hashtagRegex) || [];
    
    // Remove hashtags from main content for cleaner parsing
    const mainContent = content.replace(hashtagRegex, '').trim();
    
    return {
      content: mainContent,
      hashtags: hashtags.map(h => h.slice(1)), // Remove # symbol
      character_count: content.length,
      word_count: content.split(/\s+/).filter(word => word.length > 0).length
    };
  };

  const analyzeContent = async (content: string, platform: string): Promise<ContentAnalytics> => {
    // Simplified content analysis - in production, use more sophisticated NLP
    const words = content.split(/\s+/);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim());
    
    const avgWordsPerSentence = words.length / sentences.length;
    const readability = Math.max(0, Math.min(100, 100 - (avgWordsPerSentence - 15) * 2));
    
    // Engagement prediction based on various factors
    const engagementFactors = [
      content.includes('?') ? 10 : 0, // Questions increase engagement
      content.includes('!') ? 5 : 0,  // Exclamation points
      words.filter(w => ['you', 'your'].includes(w.toLowerCase())).length * 2, // Personal pronouns
      config.includeHashtags ? 15 : 0, // Hashtags
      config.includeCTA ? 20 : 0       // Call to action
    ];
    
    const engagement_potential = Math.min(100, engagementFactors.reduce((a, b) => a + b, 40));
    
    return {
      sentiment: 'positive', // Simplified sentiment analysis
      readability,
      engagement_potential,
      brand_alignment: 85, // Mock score
      trending_topics: ['AI', 'productivity', 'innovation'], // Mock trending topics
      optimal_posting_time: '9:00 AM'
    };
  };

  const calculateSEOScore = (content: string, keywords: string[]): number => {
    if (keywords.length === 0) return 50; // Base score
    
    const contentLower = content.toLowerCase();
    const keywordMatches = keywords.filter(keyword => 
      contentLower.includes(keyword.toLowerCase())
    ).length;
    
    return Math.min(100, (keywordMatches / keywords.length) * 100);
  };

  const copyContent = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // Show success message
    } catch (error) {
      console.error('Failed to copy content:', error);
    }
  };

  const downloadContent = () => {
    const allContent = generatedContent.map(content => 
      `=== ${content.platform.toUpperCase()} ===\n${content.content}\n\nHashtags: ${content.hashtags.map(h => '#' + h).join(' ')}\n\n`
    ).join('\n');
    
    const blob = new Blob([allContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `content-${config.topic.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const regenerateContent = (contentId: string) => {
    // Regenerate specific content piece
    const content = generatedContent.find(c => c.id === contentId);
    if (content) {
      // Trigger regeneration for this specific platform
      generateSingleContent(content.platform);
    }
  };

  const generateSingleContent = async (platform: string) => {
    const platformData = PLATFORMS.find(p => p.value === platform);
    const prompt = buildContentPrompt(config, platform, platformData);
    
    try {
      const response = await aiServiceManager.generateContent(prompt, config.contentType);
      const content = parseContentResponse(response.content, platform);
      const analytics = await analyzeContent(content.content!, platform);

      const newContent: GeneratedContent = {
        ...content as GeneratedContent,
        id: `content_${Date.now()}_${platform}`,
        platform,
        engagement_prediction: analytics.engagement_potential,
        readability_score: analytics.readability,
        seo_score: calculateSEOScore(content.content!, config.keywords),
        timestamp: Date.now()
      };

      setGeneratedContent(prev => 
        prev.map(c => c.platform === platform ? newContent : c)
      );
      
      if (selectedContent?.platform === platform) {
        setSelectedContent(newContent);
      }
    } catch (error) {
      console.error('Content regeneration failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl font-bold ff-text-gradient">
            AI Content Generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create engaging, platform-optimized content with AI. From social posts to long-form articles.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <Card className="ff-card-interactive sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-primary" />
                  Content Configuration
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Topic */}
                <div>
                  <Label htmlFor="topic">Content Topic</Label>
                  <Textarea
                    id="topic"
                    value={config.topic}
                    onChange={(e) => setConfig(prev => ({ ...prev, topic: e.target.value }))}
                    placeholder="Describe what you want to create content about..."
                    className="ff-focus-ring"
                    rows={3}
                  />
                </div>

                {/* Content Type */}
                <div>
                  <Label>Content Type</Label>
                  <Select value={config.contentType} onValueChange={(value) => setConfig(prev => ({ ...prev, contentType: value }))}>
                    <SelectTrigger className="ff-focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Platforms */}
                <div>
                  <Label>Target Platforms</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {PLATFORMS.map((platform) => (
                      <div key={platform.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={platform.value}
                          checked={config.platform.includes(platform.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setConfig(prev => ({ ...prev, platform: [...prev.platform, platform.value] }));
                            } else {
                              setConfig(prev => ({ ...prev, platform: prev.platform.filter(p => p !== platform.value) }));
                            }
                          }}
                          className="ff-focus-ring"
                        />
                        <Label htmlFor={platform.value} className="text-sm flex items-center gap-1">
                          <span>{platform.icon}</span>
                          {platform.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tone */}
                <div>
                  <Label>Tone & Style</Label>
                  <Select value={config.tone} onValueChange={(value) => setConfig(prev => ({ ...prev, tone: value }))}>
                    <SelectTrigger className="ff-focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TONES.map((tone) => (
                        <SelectItem key={tone.value} value={tone.value}>
                          <div>
                            <div className="font-medium">{tone.label}</div>
                            <div className="text-xs text-muted-foreground">{tone.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Audience */}
                <div>
                  <Label>Target Audience</Label>
                  <Select value={config.audience} onValueChange={(value) => setConfig(prev => ({ ...prev, audience: value }))}>
                    <SelectTrigger className="ff-focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AUDIENCES.map((audience) => (
                        <SelectItem key={audience.value} value={audience.value}>
                          <div>
                            <div className="font-medium">{audience.label}</div>
                            <div className="text-xs text-muted-foreground">{audience.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Keywords */}
                <div>
                  <Label>Target Keywords</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        placeholder="Add keyword"
                        className="ff-focus-ring"
                        onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                      />
                      <Button onClick={addKeyword} size="sm" variant="outline">
                        Add
                      </Button>
                    </div>
                    
                    {config.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {config.keywords.map((keyword, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => removeKeyword(keyword)}
                          >
                            {keyword} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <Label>Content Options</Label>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hashtags"
                      checked={config.includeHashtags}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeHashtags: !!checked }))}
                      className="ff-focus-ring"
                    />
                    <Label htmlFor="hashtags" className="text-sm">Include Hashtags</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="emojis"
                      checked={config.includeEmojis}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeEmojis: !!checked }))}
                      className="ff-focus-ring"
                    />
                    <Label htmlFor="emojis" className="text-sm">Include Emojis</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cta"
                      checked={config.includeCTA}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeCTA: !!checked }))}
                      className="ff-focus-ring"
                    />
                    <Label htmlFor="cta" className="text-sm">Include Call-to-Action</Label>
                  </div>
                </div>

                {/* Language */}
                <div>
                  <Label>Language</Label>
                  <Select value={config.targetLanguage} onValueChange={(value) => setConfig(prev => ({ ...prev, targetLanguage: value }))}>
                    <SelectTrigger className="ff-focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={generateContent}
                  disabled={isGenerating || !config.topic.trim() || config.platform.length === 0}
                  className="w-full ff-btn-primary"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>

                {isGenerating && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(generationProgress)}%</span>
                    </div>
                    <Progress value={generationProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {generatedContent.length > 0 ? (
              <div className="space-y-6">
                {/* Content Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Generated Content
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {generatedContent.length} platforms
                        </Badge>
                        <Button onClick={downloadContent} size="sm" className="ff-btn-secondary">
                          <Download className="w-4 h-4 mr-1" />
                          Download All
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {generatedContent.map((content) => {
                        const platform = PLATFORMS.find(p => p.value === content.platform);
                        return (
                          <Card
                            key={content.id}
                            className={`cursor-pointer transition-all duration-300 ${
                              selectedContent?.id === content.id 
                                ? 'ring-2 ring-primary bg-primary/5' 
                                : 'hover:border-primary/40'
                            }`}
                            onClick={() => setSelectedContent(content)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{platform?.icon}</span>
                                  <span className="font-medium text-sm">{platform?.label}</span>
                                </div>
                                
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    regenerateContent(content.id);
                                  }}
                                >
                                  <RefreshCw className="w-3 h-3" />
                                </Button>
                              </div>
                              
                              <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                  <span>Engagement</span>
                                  <span className="font-medium">{content.engagement_prediction}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Readability</span>
                                  <span className="font-medium">{content.readability_score}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Characters</span>
                                  <span className="font-medium">{content.character_count}</span>
                                </div>
                              </div>
                              
                              <div className="mt-3 text-xs text-muted-foreground line-clamp-3">
                                {content.content}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Selected Content Detail */}
                {selectedContent && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span className="text-lg">
                            {PLATFORMS.find(p => p.value === selectedContent.platform)?.icon}
                          </span>
                          {PLATFORMS.find(p => p.value === selectedContent.platform)?.label} Content
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyContent(selectedContent.content)}
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => regenerateContent(selectedContent.id)}
                          >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Regenerate
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      {/* Content Text */}
                      <div>
                        <Label className="text-sm font-medium">Generated Content</Label>
                        <div className="mt-2 p-4 bg-muted/50 rounded-lg">
                          <p className="whitespace-pre-wrap">{selectedContent.content}</p>
                        </div>
                      </div>

                      {/* Hashtags */}
                      {selectedContent.hashtags.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium">Hashtags</Label>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {selectedContent.hashtags.map((hashtag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                #{hashtag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Analytics */}
                      <div>
                        <Label className="text-sm font-medium">Content Analytics</Label>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">
                              {selectedContent.engagement_prediction}%
                            </div>
                            <div className="text-xs text-muted-foreground">Engagement Score</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-2xl font-bold text-secondary">
                              {selectedContent.readability_score}%
                            </div>
                            <div className="text-xs text-muted-foreground">Readability</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-2xl font-bold text-accent">
                              {selectedContent.seo_score}%
                            </div>
                            <div className="text-xs text-muted-foreground">SEO Score</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-2xl font-bold text-muted-foreground">
                              {selectedContent.word_count}
                            </div>
                            <div className="text-xs text-muted-foreground">Words</div>
                          </div>
                        </div>
                      </div>

                      {/* Platform Limits */}
                      {(() => {
                        const platform = PLATFORMS.find(p => p.value === selectedContent.platform);
                        if (platform?.limit) {
                          const isOverLimit = selectedContent.character_count > platform.limit;
                          return (
                            <div className={`p-3 rounded-lg ${isOverLimit ? 'bg-destructive/10 border border-destructive/20' : 'bg-success/10 border border-success/20'}`}>
                              <div className="flex items-center gap-2 text-sm">
                                {isOverLimit ? (
                                  <AlertCircle className="w-4 h-4 text-destructive" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 text-success" />
                                )}
                                <span className={isOverLimit ? 'text-destructive' : 'text-success'}>
                                  {selectedContent.character_count} / {platform.limit} characters
                                  {isOverLimit && ' (Over limit!)'}
                                </span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <PenTool className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Ready to Create</h3>
                  <p className="text-muted-foreground mb-4">
                    Configure your content settings and click "Generate Content" to create engaging, platform-optimized content.
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-success" />
                      Multi-Platform
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-success" />
                      SEO Optimized
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-success" />
                      Engagement Focused
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentGeneratorTool;