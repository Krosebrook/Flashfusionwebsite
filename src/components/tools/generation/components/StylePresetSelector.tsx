/**
 * @fileoverview Style Preset Selector Component
 * @chunk tools
 * @category generation
 * @version 2.0.0
 * @author FlashFusion Team
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { ScrollArea } from '../../../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { Search, Star, Sparkles, Crown } from 'lucide-react';
import { STYLE_PRESETS, type StylePreset, type StyleCategory } from '../../../../types/image-generation';

interface StylePresetSelectorProps {
  selectedStyle: string;
  onStyleSelect: (styleId: string) => void;
  showAdvanced?: boolean;
}

const CATEGORY_ICONS: Record<StyleCategory, React.ComponentType<{ className?: string }>> = {
  'photorealistic': Search,
  'artistic': Star,
  'anime': Sparkles,
  'digital-art': Star,
  'concept-art': Star,
  'portrait': Search,
  'landscape': Search,
  'abstract': Star,
  'vintage': Star,
  'minimalist': Star,
  'cyberpunk': Sparkles,
  'fantasy': Sparkles,
  'sci-fi': Sparkles,
  'architecture': Search,
  'fashion': Search
};

export function StylePresetSelector({
  selectedStyle,
  onStyleSelect,
  showAdvanced = false
}: StylePresetSelectorProps): JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<StyleCategory | 'all'>('all');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(STYLE_PRESETS.map(preset => preset.category))];
    return cats.sort();
  }, []);

  // Filter presets based on search and category
  const filteredPresets = useMemo(() => {
    return STYLE_PRESETS.filter(preset => {
      const matchesSearch = preset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           preset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           preset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || preset.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    }).sort((a, b) => b.popularity - a.popularity);
  }, [searchTerm, selectedCategory]);

  // Group presets by category for tabbed view
  const presetsByCategory = useMemo(() => {
    const grouped: Record<StyleCategory | 'all', StylePreset[]> = { all: filteredPresets };
    
    categories.forEach(category => {
      grouped[category] = filteredPresets.filter(preset => preset.category === category);
    });
    
    return grouped;
  }, [filteredPresets, categories]);

  const handleStyleSelect = (preset: StylePreset) => {
    onStyleSelect(preset.id);
  };

  return (
    <Card className="ff-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[var(--ff-accent)]" />
          Style Presets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--ff-text-muted)]" />
          <Input
            placeholder="Search styles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ff-input pl-10"
          />
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as StyleCategory | 'all')}>
          <TabsList className="grid grid-cols-3 lg:grid-cols-5 w-full">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            {categories.slice(0, 4).map((category) => {
              const Icon = CATEGORY_ICONS[category];
              return (
                <TabsTrigger key={category} value={category} className="text-xs">
                  <Icon className="h-3 w-3 mr-1" />
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Style Grid */}
          <ScrollArea className="h-[400px] w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-1">
              {filteredPresets.map((preset) => {
                const isSelected = selectedStyle === preset.id;
                const Icon = CATEGORY_ICONS[preset.category];
                
                return (
                  <Card
                    key={preset.id}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                      isSelected 
                        ? 'ring-2 ring-[var(--ff-primary)] bg-gradient-to-br from-[var(--ff-primary)]/10 to-transparent' 
                        : 'hover:shadow-lg'
                    }`}
                    onClick={() => handleStyleSelect(preset)}
                  >
                    <CardContent className="p-3 space-y-2">
                      {/* Preview */}
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-[var(--ff-surface)] to-[var(--ff-surface-light)]">
                        {preset.previewUrl ? (
                          <img
                            src={preset.previewUrl}
                            alt={preset.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Icon className="h-8 w-8 text-[var(--ff-text-muted)]" />
                          </div>
                        )}
                        
                        {/* Premium Badge */}
                        {preset.isPremium && (
                          <div className="absolute top-1 right-1">
                            <Badge variant="secondary" className="text-xs bg-gradient-to-r from-yellow-400 to-yellow-600 text-black">
                              <Crown className="h-3 w-3 mr-1" />
                              Pro
                            </Badge>
                          </div>
                        )}
                        
                        {/* Selection Indicator */}
                        {isSelected && (
                          <div className="absolute inset-0 bg-[var(--ff-primary)]/20 flex items-center justify-center">
                            <div className="w-6 h-6 bg-[var(--ff-primary)] rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Style Info */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm text-[var(--ff-text-primary)] truncate">
                            {preset.name}
                          </h4>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-[var(--ff-text-muted)]">
                              {preset.popularity}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-xs text-[var(--ff-text-secondary)] line-clamp-2">
                          {preset.description}
                        </p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {preset.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs px-1 py-0"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {preset.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              +{preset.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {filteredPresets.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 space-y-2">
                <Search className="h-8 w-8 text-[var(--ff-text-muted)]" />
                <p className="text-sm text-[var(--ff-text-muted)]">
                  No styles found matching your criteria
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="ff-btn-ghost"
                >
                  Clear filters
                </Button>
              </div>
            )}
          </ScrollArea>
        </Tabs>

        {/* Advanced Style Info */}
        {showAdvanced && selectedStyle && (
          <Card className="bg-[var(--ff-surface-light)]/50 border-[var(--ff-primary)]/20">
            <CardContent className="pt-4">
              {(() => {
                const preset = STYLE_PRESETS.find(p => p.id === selectedStyle);
                if (!preset) return null;
                
                return (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {preset.category.replace('-', ' ')}
                      </Badge>
                      {preset.isPremium && (
                        <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-600/20">
                          Premium
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        Popularity: {preset.popularity}%
                      </Badge>
                    </div>
                    
                    {preset.recommendedSettings && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-semibold text-[var(--ff-text-primary)]">
                          Recommended Settings:
                        </h5>
                        <div className="grid grid-cols-2 gap-2 text-xs text-[var(--ff-text-secondary)]">
                          {preset.recommendedSettings.steps && (
                            <div>Steps: {preset.recommendedSettings.steps}</div>
                          )}
                          {preset.recommendedSettings.guidanceScale && (
                            <div>Guidance: {preset.recommendedSettings.guidanceScale}</div>
                          )}
                        </div>
                        {preset.recommendedSettings.negativePrompt && (
                          <div className="text-xs text-[var(--ff-text-secondary)]">
                            <strong>Negative prompt:</strong> {preset.recommendedSettings.negativePrompt}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {preset.promptEnhancements && preset.promptEnhancements.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-semibold text-[var(--ff-text-primary)]">
                          Automatic Enhancements:
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {preset.promptEnhancements.map((enhancement, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {enhancement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}