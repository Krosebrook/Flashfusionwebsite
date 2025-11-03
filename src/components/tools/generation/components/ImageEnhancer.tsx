/**
 * @fileoverview Image Enhancement Component
 * @chunk tools
 * @category generation
 * @version 2.0.0
 * @author FlashFusion Team
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Slider } from '../../../ui/slider';
import { Label } from '../../../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { 
  Sparkles, 
  Zap, 
  Palette, 
  Scissors,
  Maximize2,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { type GeneratedImage, type EnhancementType } from '../../../../types/image-generation';

interface ImageEnhancerProps {
  selectedImages: string[];
  generatedImages: GeneratedImage[];
  onEnhance: (enhancedImages: GeneratedImage[]) => void;
}

const ENHANCEMENT_OPTIONS = [
  {
    id: 'upscale' as EnhancementType,
    name: 'Upscale',
    description: 'Increase image resolution using AI',
    icon: Maximize2,
    color: 'text-blue-600',
    settings: ['scale']
  },
  {
    id: 'super-resolution' as EnhancementType,
    name: 'Super Resolution',
    description: 'Advanced AI upscaling with detail enhancement',
    icon: Sparkles,
    color: 'text-purple-600',
    settings: ['scale', 'detail']
  },
  {
    id: 'face-enhance' as EnhancementType,
    name: 'Face Enhancement',
    description: 'Improve facial features and clarity',
    icon: Eye,
    color: 'text-green-600',
    settings: ['strength']
  },
  {
    id: 'color-correction' as EnhancementType,
    name: 'Color Correction',
    description: 'Automatic color balance and saturation',
    icon: Palette,
    color: 'text-orange-600',
    settings: ['saturation', 'contrast', 'brightness']
  },
  {
    id: 'noise-reduction' as EnhancementType,
    name: 'Noise Reduction',
    description: 'Remove noise and improve clarity',
    icon: Zap,
    color: 'text-cyan-600',
    settings: ['strength']
  },
  {
    id: 'background-removal' as EnhancementType,
    name: 'Background Removal',
    description: 'Remove or replace image background',
    icon: Scissors,
    color: 'text-red-600',
    settings: []
  }
];

export function ImageEnhancer({
  selectedImages,
  generatedImages,
  onEnhance
}: ImageEnhancerProps): JSX.Element {
  const [selectedEnhancement, setSelectedEnhancement] = useState<EnhancementType>('upscale');
  const [enhancementSettings, setEnhancementSettings] = useState({
    scale: 2,
    detail: 50,
    strength: 75,
    saturation: 50,
    contrast: 50,
    brightness: 50
  });
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  const selectedImageObjects = generatedImages.filter(img => selectedImages.includes(img.id));
  const selectedEnhancementOption = ENHANCEMENT_OPTIONS.find(opt => opt.id === selectedEnhancement);

  const handleEnhance = async () => {
    if (selectedImageObjects.length === 0) {
      toast.error('Please select images to enhance');
      return;
    }

    setIsEnhancing(true);
    
    try {
      // Simulate enhancement process
      const enhancedImages = await Promise.all(
        selectedImageObjects.map(async (image) => {
          // This would call the actual enhancement API
          const enhancedImage: GeneratedImage = {
            ...image,
            id: `enhanced_${image.id}_${Date.now()}`,
            url: image.url, // In real implementation, this would be the enhanced image URL
            enhancements: [
              ...(image.enhancements || []),
              {
                type: selectedEnhancement,
                timestamp: Date.now(),
                parameters: enhancementSettings,
                resultUrl: image.url, // Would be actual enhanced URL
                processingTime: Math.random() * 5000 + 2000
              }
            ]
          };
          
          // Simulate processing time
          await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
          
          return enhancedImage;
        })
      );
      
      onEnhance(enhancedImages);
      toast.success(`Enhanced ${enhancedImages.length} image${enhancedImages.length > 1 ? 's' : ''}!`);
      
    } catch (error) {
      console.error('Enhancement failed:', error);
      toast.error('Failed to enhance images');
    } finally {
      setIsEnhancing(false);
    }
  };

  const renderSettingControl = (settingKey: string) => {
    const value = enhancementSettings[settingKey as keyof typeof enhancementSettings];
    
    switch (settingKey) {
      case 'scale':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Scale Factor</Label>
              <Badge variant="outline" className="text-xs">
                {value}x
              </Badge>
            </div>
            <Slider
              value={[value]}
              onValueChange={([newValue]) => setEnhancementSettings(prev => ({ ...prev, scale: newValue }))}
              min={1}
              max={8}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[var(--ff-text-muted)]">
              <span>1x (Original)</span>
              <span>4x (Recommended)</span>
              <span>8x (Maximum)</span>
            </div>
          </div>
        );
        
      case 'detail':
      case 'strength':
      case 'saturation':
      case 'contrast':
      case 'brightness':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">
                {settingKey.charAt(0).toUpperCase() + settingKey.slice(1)}
              </Label>
              <Badge variant="outline" className="text-xs">
                {value}%
              </Badge>
            </div>
            <Slider
              value={[value]}
              onValueChange={([newValue]) => setEnhancementSettings(prev => ({ ...prev, [settingKey]: newValue }))}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  if (selectedImageObjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="p-4 rounded-full bg-[var(--ff-surface)]">
          <Sparkles className="h-8 w-8 text-[var(--ff-text-muted)]" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-[var(--ff-text-primary)]">No images selected</h3>
          <p className="text-[var(--ff-text-secondary)] max-w-md">
            Select images from the Results tab to enhance them with AI-powered tools.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="ff-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[var(--ff-accent)]" />
            Image Enhancement Suite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {selectedImageObjects.length} image{selectedImageObjects.length > 1 ? 's' : ''} selected
              </Badge>
              <Badge variant="outline" className="text-xs">
                {selectedEnhancementOption?.name}
              </Badge>
            </div>
            
            <Button
              onClick={handleEnhance}
              disabled={isEnhancing}
              className="ff-btn-primary"
            >
              {isEnhancing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Enhance Images
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhancement Options */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selected Images Preview */}
          <Card className="ff-card">
            <CardHeader>
              <CardTitle className="text-base">Selected Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedImageObjects.map((image) => (
                  <div key={image.id} className="space-y-2">
                    <div className="aspect-square rounded-lg overflow-hidden bg-[var(--ff-surface)] group">
                      <img
                        src={image.thumbnailUrl || image.url}
                        alt={image.prompt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-[var(--ff-text-primary)] font-medium line-clamp-2">
                        {image.prompt}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-[var(--ff-text-muted)]">
                        <span>{image.dimensions.width}×{image.dimensions.height}</span>
                        {image.enhancements && image.enhancements.length > 0 && (
                          <>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">
                              {image.enhancements.length} enhancement{image.enhancements.length > 1 ? 's' : ''}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhancement Type Selection */}
          <Card className="ff-card">
            <CardHeader>
              <CardTitle className="text-base">Enhancement Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ENHANCEMENT_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedEnhancement === option.id;
                  
                  return (
                    <Card
                      key={option.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'ring-2 ring-[var(--ff-primary)] bg-gradient-to-br from-[var(--ff-primary)]/10 to-transparent' 
                          : 'hover:shadow-lg hover:scale-105'
                      }`}
                      onClick={() => setSelectedEnhancement(option.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg bg-gray-100 ${option.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          
                          <div className="flex-1 space-y-1">
                            <h4 className="font-semibold text-sm text-[var(--ff-text-primary)]">
                              {option.name}
                            </h4>
                            <p className="text-xs text-[var(--ff-text-secondary)]">
                              {option.description}
                            </p>
                          </div>
                          
                          {isSelected && (
                            <div className="w-5 h-5 bg-[var(--ff-primary)] rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Panel */}
        <div className="space-y-6">
          <Card className="ff-card">
            <CardHeader>
              <CardTitle className="text-base">Enhancement Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedEnhancementOption?.settings.map((setting) => (
                <div key={setting}>
                  {renderSettingControl(setting)}
                </div>
              ))}
              
              {selectedEnhancementOption?.settings.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-sm text-[var(--ff-text-muted)]">
                    This enhancement doesn't require additional settings.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cost Estimation */}
          <Card className="ff-card border-[var(--ff-primary)]/20">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--ff-text-secondary)]">Images to enhance:</span>
                  <span className="font-medium">{selectedImageObjects.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--ff-text-secondary)]">Cost per image:</span>
                  <span className="font-medium">$0.05</span>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                  <span className="font-semibold text-[var(--ff-text-primary)]">Total cost:</span>
                  <span className="font-bold text-[var(--ff-primary)]">
                    ${(selectedImageObjects.length * 0.05).toFixed(2)}
                  </span>
                </div>
                
                <div className="text-xs text-[var(--ff-text-muted)] text-center pt-2">
                  Estimated processing time: {Math.ceil(selectedImageObjects.length * 2)}–{Math.ceil(selectedImageObjects.length * 5)} seconds
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Previous Enhancements */}
          {selectedImageObjects.some(img => img.enhancements && img.enhancements.length > 0) && (
            <Card className="ff-card">
              <CardHeader>
                <CardTitle className="text-base">Previous Enhancements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedImageObjects.map((image) => (
                    image.enhancements && image.enhancements.length > 0 && (
                      <div key={image.id} className="space-y-2">
                        <p className="text-xs font-medium text-[var(--ff-text-primary)] line-clamp-1">
                          {image.prompt}
                        </p>
                        <div className="space-y-1">
                          {image.enhancements.map((enhancement, index) => (
                            <div key={index} className="flex items-center justify-between text-xs">
                              <Badge variant="outline" className="text-xs">
                                {enhancement.type.replace('-', ' ')}
                              </Badge>
                              <span className="text-[var(--ff-text-muted)]">
                                {(enhancement.processingTime / 1000).toFixed(1)}s
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}