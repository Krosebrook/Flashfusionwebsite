/**
 * @fileoverview Advanced AI Image Generation Tool for FlashFusion
 * @chunk tools
 * @category generation
 * @version 2.0.0
 * @author FlashFusion Team
 * 
 * FLASHFUSION - IMAGE GENERATION SUITE
 * 
 * State-of-the-art image generation tool featuring multi-model AI support,
 * advanced customization options, batch processing, and professional
 * export capabilities.
 * 
 * Features:
 * - Multi-model AI support (DALL-E, Midjourney, Stable Diffusion)
 * - Advanced style presets and customization
 * - Batch generation with queue management
 * - Professional export formats
 * - Image enhancement and upscaling
 * - History and favorites system
 * - Real-time generation preview
 * 
 * @example
 * ```tsx
 * <ImageGeneratorTool 
 *   onGenerate={(images) => handleGenerated(images)}
 *   defaultSettings={userPreferences}
 * />
 * ```
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Slider } from '../../ui/slider';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { Separator } from '../../ui/separator';
import { Progress } from '../../ui/progress';
import { ScrollArea } from '../../ui/scroll-area';
import { toast } from 'sonner';
import { 
  Image, 
  Download, 
  Settings, 
  Wand2, 
  Palette, 
  Layers, 
  Zap,
  Heart,
  History,
  RefreshCw,
  Copy,
  Share2,
  Maximize2,
  Grid,
  MoreHorizontal,
  Sparkles,
  Camera,
  Filter,
  Sliders,
  Eye,
  ImageIcon,
  Upload,
  Trash2,
  Star,
  ChevronDown,
  Play,
  Pause,
  Square,
  RotateCcw
} from 'lucide-react';
import { 
  AI_MODELS, 
  STYLE_PRESETS, 
  ASPECT_RATIOS, 
  QUALITY_SETTINGS,
  EXPORT_FORMATS,
  type ImageGenerationRequest,
  type GeneratedImage,
  type StylePreset,
  type AIModel
} from '../../../types/image-generation';
import { useImageGeneration } from '../../../hooks/useImageGeneration';
import { ImagePreviewGrid } from './components/ImagePreviewGrid';
import { GenerationHistory } from './components/GenerationHistory';
import { StylePresetSelector } from './components/StylePresetSelector';
import { AdvancedSettings } from './components/AdvancedSettings';
import { BatchGenerationManager } from './components/BatchGenerationManager';
import { ImageEnhancer } from './components/ImageEnhancer';

/**
 * Image Generator Tool Props Interface
 */
interface ImageGeneratorToolProps {
  /** Callback fired when images are generated */
  onGenerate?: (images: GeneratedImage[]) => void;
  /** Default generation settings */
  defaultSettings?: Partial<ImageGenerationRequest>;
  /** Maximum number of images to generate in batch */
  maxBatchSize?: number;
  /** Available AI models */
  availableModels?: AIModel[];
  /** Enable advanced features */
  enableAdvanced?: boolean;
}

/**
 * Generation State Interface
 */
interface GenerationState {
  isGenerating: boolean;
  progress: number;
  currentModel: string;
  queueSize: number;
  estimatedTime: number;
}

/**
 * Advanced AI Image Generation Tool Component
 * 
 * Professional image generation suite with multi-model support,
 * advanced customization, and batch processing capabilities.
 * 
 * @component
 * @example
 * ```tsx
 * <ImageGeneratorTool 
 *   onGenerate={(images) => console.log('Generated:', images)}
 *   maxBatchSize={10}
 *   enableAdvanced={true}
 * />
 * ```
 */
export function ImageGeneratorTool({
  onGenerate,
  defaultSettings,
  maxBatchSize = 4,
  availableModels = AI_MODELS,
  enableAdvanced = true
}: ImageGeneratorToolProps): JSX.Element {
  // Generation state management
  const [prompt, setPrompt] = useState<string>(defaultSettings?.prompt || '');
  const [negativePrompt, setNegativePrompt] = useState<string>(defaultSettings?.negativePrompt || '');
  const [selectedModel, setSelectedModel] = useState<string>(defaultSettings?.model || 'dall-e-3');
  const [selectedStyle, setSelectedStyle] = useState<string>(defaultSettings?.style || 'photorealistic');
  const [aspectRatio, setAspectRatio] = useState<string>(defaultSettings?.aspectRatio || '1:1');
  const [quality, setQuality] = useState<number>(defaultSettings?.quality || 80);
  const [batchCount, setBatchCount] = useState<number>(defaultSettings?.batchCount || 1);
  const [seed, setSeed] = useState<number | undefined>(defaultSettings?.seed);
  const [steps, setSteps] = useState<number>(defaultSettings?.steps || 20);
  const [guidanceScale, setGuidanceScale] = useState<number>(defaultSettings?.guidanceScale || 7.5);
  
  // UI state
  const [activeTab, setActiveTab] = useState<string>('generate');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  
  // Generation state
  const [generationState, setGenerationState] = useState<GenerationState>({
    isGenerating: false,
    progress: 0,
    currentModel: '',
    queueSize: 0,
    estimatedTime: 0
  });

  // Custom hook for image generation
  const {
    generateImages,
    generatedImages,
    generationHistory,
    isLoading,
    error,
    clearHistory
  } = useImageGeneration();

  /**
   * Memoized generation request object
   */
  const generationRequest = useMemo((): ImageGenerationRequest => ({
    prompt,
    negativePrompt,
    model: selectedModel,
    style: selectedStyle,
    aspectRatio,
    quality,
    batchCount,
    seed,
    steps,
    guidanceScale,
    timestamp: Date.now()
  }), [
    prompt, negativePrompt, selectedModel, selectedStyle, 
    aspectRatio, quality, batchCount, seed, steps, guidanceScale
  ]);

  /**
   * Handle image generation with validation and progress tracking
   */
  const handleGenerate = useCallback(async (): Promise<void> => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to generate images');
      return;
    }

    if (prompt.trim().length < 3) {
      toast.error('Prompt must be at least 3 characters long');
      return;
    }

    try {
      setGenerationState(prev => ({
        ...prev,
        isGenerating: true,
        progress: 0,
        currentModel: selectedModel,
        queueSize: batchCount
      }));

      // Progress simulation for better UX
      const progressInterval = setInterval(() => {
        setGenerationState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + Math.random() * 15, 95)
        }));
      }, 500);

      const images = await generateImages(generationRequest);
      
      clearInterval(progressInterval);
      
      setGenerationState(prev => ({
        ...prev,
        isGenerating: false,
        progress: 100
      }));

      // Call parent callback if provided
      if (onGenerate) {
        onGenerate(images);
      }

      toast.success(`Successfully generated ${images.length} image${images.length > 1 ? 's' : ''}!`);
      
      // Auto-switch to results tab
      setActiveTab('results');
      
    } catch (error) {
      console.error('Image generation failed:', error);
      
      setGenerationState(prev => ({
        ...prev,
        isGenerating: false,
        progress: 0
      }));
      
      toast.error(error instanceof Error ? error.message : 'Failed to generate images');
    }
  }, [generationRequest, generateImages, onGenerate, selectedModel, batchCount]);

  /**
   * Handle prompt enhancement using AI
   */
  const handleEnhancePrompt = useCallback(async (): Promise<void> => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to enhance');
      return;
    }

    try {
      // Simulate prompt enhancement
      toast.info('Enhancing prompt with AI...');
      
      // This would call an AI service to enhance the prompt
      const enhancedPrompt = `${prompt}, highly detailed, professional photography, studio lighting, vibrant colors, sharp focus, masterpiece`;
      
      setPrompt(enhancedPrompt);
      toast.success('Prompt enhanced successfully!');
      
    } catch (error) {
      console.error('Prompt enhancement failed:', error);
      toast.error('Failed to enhance prompt');
    }
  }, [prompt]);

  /**
   * Handle style preset selection
   */
  const handleStyleSelect = useCallback((styleId: string): void => {
    const style = STYLE_PRESETS.find(s => s.id === styleId);
    if (style) {
      setSelectedStyle(styleId);
      
      // Apply style-specific optimizations
      if (style.recommendedSettings) {
        setSteps(style.recommendedSettings.steps || steps);
        setGuidanceScale(style.recommendedSettings.guidanceScale || guidanceScale);
      }
      
      toast.success(`Applied ${style.name} style`);
    }
  }, [steps, guidanceScale]);

  /**
   * Handle image favoriting
   */
  const handleToggleFavorite = useCallback((imageId: string): void => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(imageId)) {
        newFavorites.delete(imageId);
        toast.info('Removed from favorites');
      } else {
        newFavorites.add(imageId);
        toast.success('Added to favorites');
      }
      return newFavorites;
    });
  }, []);

  /**
   * Handle batch image selection
   */
  const handleImageSelect = useCallback((imageId: string): void => {
    setSelectedImages(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(imageId)) {
        newSelection.delete(imageId);
      } else {
        newSelection.add(imageId);
      }
      return newSelection;
    });
  }, []);

  /**
   * Handle random seed generation
   */
  const handleRandomSeed = useCallback((): void => {
    const randomSeed = Math.floor(Math.random() * 1000000);
    setSeed(randomSeed);
    toast.info(`Generated random seed: ${randomSeed}`);
  }, []);

  /**
   * Reset all settings to default
   */
  const handleResetSettings = useCallback((): void => {
    setPrompt('');
    setNegativePrompt('');
    setSelectedModel('dall-e-3');
    setSelectedStyle('photorealistic');
    setAspectRatio('1:1');
    setQuality(80);
    setBatchCount(1);
    setSeed(undefined);
    setSteps(20);
    setGuidanceScale(7.5);
    setSelectedImages(new Set());
    toast.success('Settings reset to default');
  }, []);

  return (
    <div className="space-y-6 ff-fade-in-up">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-[var(--ff-primary)] to-[var(--ff-secondary)]">
            <ImageIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-['Sora'] text-2xl font-bold text-[var(--ff-text-primary)]">
              AI Image Generator
            </h1>
            <p className="text-[var(--ff-text-secondary)] text-sm">
              Create stunning visuals with advanced AI models
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {availableModels.length} Models Available
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="ff-btn-ghost"
          >
            <Settings className="h-4 w-4 mr-2" />
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </Button>
        </div>
      </div>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto">
          <TabsTrigger value="generate" className="ff-nav-item">
            <Wand2 className="h-4 w-4 mr-2" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="results" className="ff-nav-item">
            <Grid className="h-4 w-4 mr-2" />
            Results
          </TabsTrigger>
          <TabsTrigger value="history" className="ff-nav-item">
            <History className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
          <TabsTrigger value="enhance" className="ff-nav-item">
            <Sparkles className="h-4 w-4 mr-2" />
            Enhance
          </TabsTrigger>
        </TabsList>

        {/* Generation Tab */}
        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Prompt Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="ff-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-[var(--ff-primary)]" />
                    Creative Prompt
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="prompt" className="text-sm font-semibold">
                      Describe your image
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="prompt"
                        placeholder="A majestic mountain landscape at sunset, with snow-capped peaks reflecting golden light..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="ff-input min-h-[100px] pr-12"
                        maxLength={1000}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEnhancePrompt}
                        className="absolute top-2 right-2 ff-btn-ghost"
                        disabled={!prompt.trim()}
                      >
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex justify-between text-xs text-[var(--ff-text-muted)]">
                      <span>{prompt.length}/1000 characters</span>
                      <span>Be specific for better results</span>
                    </div>
                  </div>

                  {showAdvanced && (
                    <div className="space-y-2">
                      <Label htmlFor="negative-prompt" className="text-sm font-semibold">
                        Negative Prompt (what to avoid)
                      </Label>
                      <Textarea
                        id="negative-prompt"
                        placeholder="blurry, low quality, distorted, watermark..."
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        className="ff-input"
                        maxLength={500}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Style Presets */}
              <StylePresetSelector
                selectedStyle={selectedStyle}
                onStyleSelect={handleStyleSelect}
                showAdvanced={showAdvanced}
              />
            </div>

            {/* Settings Panel */}
            <div className="space-y-6">
              <Card className="ff-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-[var(--ff-secondary)]" />
                    Generation Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* AI Model Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">AI Model</Label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger className="ff-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableModels.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full bg-${model.status === 'active' ? 'green' : 'yellow'}-500`} />
                              <span>{model.name}</span>
                              {model.isPremium && (
                                <Badge variant="secondary" className="text-xs">Pro</Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Aspect Ratio */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Aspect Ratio</Label>
                    <Select value={aspectRatio} onValueChange={setAspectRatio}>
                      <SelectTrigger className="ff-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ASPECT_RATIOS.map((ratio) => (
                          <SelectItem key={ratio.value} value={ratio.value}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-3 border border-[var(--ff-text-muted)] rounded-sm"
                                style={{ aspectRatio: ratio.value.replace(':', '/') }}
                              />
                              <span>{ratio.label}</span>
                              <span className="text-xs text-[var(--ff-text-muted)]">
                                {ratio.value}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quality Settings */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Quality</Label>
                      <Badge variant="outline" className="text-xs">
                        {quality}%
                      </Badge>
                    </div>
                    <Slider
                      value={[quality]}
                      onValueChange={([value]) => setQuality(value)}
                      max={100}
                      min={10}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  {/* Batch Count */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Batch Size</Label>
                      <Badge variant="outline" className="text-xs">
                        {batchCount} image{batchCount > 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <Slider
                      value={[batchCount]}
                      onValueChange={([value]) => setBatchCount(value)}
                      max={maxBatchSize}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Advanced Settings */}
                  {showAdvanced && (
                    <AdvancedSettings
                      steps={steps}
                      onStepsChange={setSteps}
                      guidanceScale={guidanceScale}
                      onGuidanceScaleChange={setGuidanceScale}
                      seed={seed}
                      onSeedChange={setSeed}
                      onRandomSeed={handleRandomSeed}
                    />
                  )}

                  <Separator />

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleGenerate}
                      disabled={generationState.isGenerating || !prompt.trim()}
                      className="w-full ff-btn-primary"
                      size="lg"
                    >
                      {generationState.isGenerating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Generate Images
                        </>
                      )}
                    </Button>

                    {generationState.isGenerating && (
                      <div className="space-y-2">
                        <Progress value={generationState.progress} className="w-full" />
                        <div className="flex justify-between text-xs text-[var(--ff-text-muted)]">
                          <span>Using {generationState.currentModel}</span>
                          <span>{Math.round(generationState.progress)}%</span>
                        </div>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      onClick={handleResetSettings}
                      className="w-full ff-btn-ghost"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results">
          <ImagePreviewGrid
            images={generatedImages}
            selectedImages={selectedImages}
            favorites={favorites}
            onImageSelect={handleImageSelect}
            onToggleFavorite={handleToggleFavorite}
            isLoading={generationState.isGenerating}
          />
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <GenerationHistory
            history={generationHistory}
            onClearHistory={clearHistory}
            onRegenerateFromHistory={(request) => {
              // Apply history settings to current form
              setPrompt(request.prompt);
              setNegativePrompt(request.negativePrompt || '');
              setSelectedModel(request.model);
              setSelectedStyle(request.style);
              setAspectRatio(request.aspectRatio);
              setQuality(request.quality);
              setBatchCount(request.batchCount);
              setSeed(request.seed);
              setSteps(request.steps || 20);
              setGuidanceScale(request.guidanceScale || 7.5);
              
              setActiveTab('generate');
              toast.success('Settings applied from history');
            }}
          />
        </TabsContent>

        {/* Enhancement Tab */}
        <TabsContent value="enhance">
          <ImageEnhancer
            selectedImages={Array.from(selectedImages)}
            generatedImages={generatedImages}
            onEnhance={(enhancedImages) => {
              toast.success(`Enhanced ${enhancedImages.length} image${enhancedImages.length > 1 ? 's' : ''}!`);
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Generation Queue Status */}
      {generationState.queueSize > 0 && (
        <Card className="ff-card border-[var(--ff-primary)] bg-gradient-to-r from-[var(--ff-primary)]/10 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-[var(--ff-primary)]/20">
                  <Zap className="h-4 w-4 text-[var(--ff-primary)]" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--ff-text-primary)]">
                    Generation in Progress
                  </p>
                  <p className="text-sm text-[var(--ff-text-secondary)]">
                    {generationState.queueSize} image{generationState.queueSize > 1 ? 's' : ''} remaining
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="animate-pulse">
                {generationState.currentModel}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ImageGeneratorTool;