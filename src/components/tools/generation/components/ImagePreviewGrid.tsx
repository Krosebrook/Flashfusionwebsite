/**
 * @fileoverview Image Preview Grid Component
 * @chunk tools
 * @category generation
 * @version 2.0.0
 * @author FlashFusion Team
 */

import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { 
  Download, 
  Heart, 
  Share2, 
  Maximize2, 
  MoreHorizontal,
  Copy,
  Eye,
  Trash2,
  Star,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { type GeneratedImage } from '../../../../types/image-generation';

interface ImagePreviewGridProps {
  images: GeneratedImage[];
  selectedImages: Set<string>;
  favorites: Set<string>;
  onImageSelect: (imageId: string) => void;
  onToggleFavorite: (imageId: string) => void;
  isLoading?: boolean;
}

export function ImagePreviewGrid({
  images,
  selectedImages,
  favorites,
  onImageSelect,
  onToggleFavorite,
  isLoading = false
}: ImagePreviewGridProps): JSX.Element {
  const [previewImage, setPreviewImage] = useState<GeneratedImage | null>(null);
  const [loadingStates, setLoadingStates] = useState<Set<string>>(new Set());

  const handleDownload = useCallback(async (image: GeneratedImage): Promise<void> => {
    setLoadingStates(prev => new Set(prev).add(image.id));
    
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `ff-generated-${image.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Image downloaded successfully');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download image');
    } finally {
      setLoadingStates(prev => {
        const newSet = new Set(prev);
        newSet.delete(image.id);
        return newSet;
      });
    }
  }, []);

  const handleShare = useCallback(async (image: GeneratedImage): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Generated Image',
          text: image.prompt,
          url: image.url
        });
      } catch (error) {
        console.error('Sharing failed:', error);
      }
    } else {
      await navigator.clipboard.writeText(image.url);
      toast.success('Image URL copied to clipboard');
    }
  }, []);

  const handleCopyPrompt = useCallback(async (prompt: string): Promise<void> => {
    await navigator.clipboard.writeText(prompt);
    toast.success('Prompt copied to clipboard');
  }, []);

  if (isLoading && images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--ff-primary)]" />
        <p className="text-[var(--ff-text-secondary)]">Generating your images...</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="p-4 rounded-full bg-[var(--ff-surface)]">
          <Eye className="h-8 w-8 text-[var(--ff-text-muted)]" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-[var(--ff-text-primary)]">No images yet</h3>
          <p className="text-[var(--ff-text-secondary)] max-w-md">
            Generated images will appear here. Start by creating your first image!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Grid Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[var(--ff-text-primary)]">
              Generated Images
            </h3>
            <Badge variant="secondary" className="text-xs">
              {images.length} image{images.length > 1 ? 's' : ''}
            </Badge>
          </div>
          
          {selectedImages.size > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {selectedImages.size} selected
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const selectedImageObjects = images.filter(img => selectedImages.has(img.id));
                  selectedImageObjects.forEach(img => handleDownload(img));
                }}
                disabled={loadingStates.size > 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Selected
              </Button>
            </div>
          )}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image) => (
            <Card 
              key={image.id} 
              className={`ff-card ff-card-interactive group cursor-pointer transition-all duration-200 ${
                selectedImages.has(image.id) ? 'ring-2 ring-[var(--ff-primary)]' : ''
              }`}
              onClick={() => onImageSelect(image.id)}
            >
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={image.thumbnailUrl || image.url}
                    alt={image.prompt}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImage(image);
                        }}
                        className="text-white bg-black/20 backdrop-blur-sm border-white/20"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(image);
                        }}
                        disabled={loadingStates.has(image.id)}
                        className="text-white bg-black/20 backdrop-blur-sm border-white/20"
                      >
                        {loadingStates.has(image.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </Button>
                      
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(image);
                        }}
                        className="text-white bg-black/20 backdrop-blur-sm border-white/20"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {image.status !== 'completed' && (
                    <div className="absolute top-2 left-2">
                      <Badge 
                        variant={image.status === 'failed' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {image.status}
                      </Badge>
                    </div>
                  )}

                  {/* Favorite Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(image.id);
                    }}
                    className={`absolute top-2 right-2 p-1 h-8 w-8 ${
                      favorites.has(image.id) 
                        ? 'text-[var(--ff-accent)] bg-white/20' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {favorites.has(image.id) ? (
                      <Heart className="h-4 w-4 fill-current" />
                    ) : (
                      <Heart className="h-4 w-4" />
                    )}
                  </Button>

                  {/* Selection Indicator */}
                  {selectedImages.has(image.id) && (
                    <div className="absolute top-2 left-2">
                      <div className="w-6 h-6 bg-[var(--ff-primary)] rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Image Info */}
                <div className="p-4 space-y-3">
                  {/* Prompt */}
                  <div className="space-y-1">
                    <p className="text-sm text-[var(--ff-text-primary)] font-medium line-clamp-2">
                      {image.prompt}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyPrompt(image.prompt);
                      }}
                      className="h-6 px-2 text-xs text-[var(--ff-text-muted)] hover:text-[var(--ff-text-secondary)]"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy prompt
                    </Button>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-[var(--ff-text-muted)]">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {image.model}
                      </Badge>
                      <span>{image.dimensions.width}×{image.dimensions.height}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {image.likeCount > 0 && (
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          <span>{image.likeCount}</span>
                        </div>
                      )}
                      {image.downloadCount > 0 && (
                        <div className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          <span>{image.downloadCount}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  {image.averageRating > 0 && (
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${
                            star <= image.averageRating
                              ? 'text-yellow-400 fill-current'
                              : 'text-[var(--ff-text-muted)]'
                          }`}
                        />
                      ))}
                      <span className="text-xs text-[var(--ff-text-muted)] ml-1">
                        ({image.averageRating.toFixed(1)})
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Full Preview Modal */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-['Sora'] text-xl">
              Image Preview
            </DialogTitle>
          </DialogHeader>
          
          {previewImage && (
            <div className="space-y-6">
              {/* Full Size Image */}
              <div className="relative">
                <img
                  src={previewImage.url}
                  alt={previewImage.prompt}
                  className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                />
              </div>

              {/* Image Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-[var(--ff-text-primary)] mb-1">
                        Prompt
                      </h4>
                      <p className="text-sm text-[var(--ff-text-secondary)]">
                        {previewImage.prompt}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-[var(--ff-text-primary)] mb-1">
                        Model & Style
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{previewImage.model}</Badge>
                        <Badge variant="outline">{previewImage.style}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-[var(--ff-text-primary)] mb-1">
                        Dimensions
                      </h4>
                      <p className="text-sm text-[var(--ff-text-secondary)]">
                        {previewImage.dimensions.width} × {previewImage.dimensions.height} pixels
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-[var(--ff-text-primary)] mb-1">
                        Created
                      </h4>
                      <p className="text-sm text-[var(--ff-text-secondary)]">
                        {new Date(previewImage.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-[var(--border)]">
                  <Button
                    onClick={() => handleDownload(previewImage)}
                    disabled={loadingStates.has(previewImage.id)}
                    className="ff-btn-primary"
                  >
                    {loadingStates.has(previewImage.id) ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Download
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleShare(previewImage)}
                    className="ff-btn-ghost"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleCopyPrompt(previewImage.prompt)}
                    className="ff-btn-ghost"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Prompt
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => onToggleFavorite(previewImage.id)}
                    className={`ff-btn-ghost ${
                      favorites.has(previewImage.id) ? 'text-[var(--ff-accent)]' : ''
                    }`}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${
                      favorites.has(previewImage.id) ? 'fill-current' : ''
                    }`} />
                    {favorites.has(previewImage.id) ? 'Unfavorite' : 'Favorite'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}