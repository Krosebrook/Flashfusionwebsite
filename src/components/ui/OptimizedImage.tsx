/**
 * Optimized Image Component
 * 
 * Features:
 * - WebP/AVIF with fallbacks
 * - Lazy loading
 * - Responsive sizes
 * - Blur placeholders
 * - Performance optimized
 * 
 * Follows FlashFusion Guidelines for image handling
 */

import React, { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean; // Load immediately (above fold images)
  quality?: number; // 1-100, default 85
  sizes?: string; // Responsive sizes
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: (error: Error) => void;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

/**
 * Generate WebP and AVIF URLs from original image URL
 */
function generateOptimizedUrls(src: string, quality: number = 85) {
  // If it's an Unsplash URL, use their optimization parameters
  if (src.includes('unsplash.com')) {
    const url = new URL(src);
    url.searchParams.set('fm', 'webp');
    url.searchParams.set('q', quality.toString());
    url.searchParams.set('auto', 'format');
    
    return {
      webp: url.toString(),
      avif: url.toString().replace('fm=webp', 'fm=avif'),
      original: src,
    };
  }
  
  // For local images, assume optimized versions exist
  const extension = src.split('.').pop();
  const basePath = src.replace(`.${extension}`, '');
  
  return {
    webp: `${basePath}.webp`,
    avif: `${basePath}.avif`,
    original: src,
  };
}

/**
 * Generate responsive srcSet for different screen sizes
 */
function generateSrcSet(src: string, width?: number): string {
  if (!width) return '';
  
  const sizes = [0.5, 0.75, 1, 1.5, 2];
  
  return sizes
    .map((multiplier) => {
      const scaledWidth = Math.round(width * multiplier);
      
      if (src.includes('unsplash.com')) {
        const url = new URL(src);
        url.searchParams.set('w', scaledWidth.toString());
        return `${url.toString()} ${scaledWidth}w`;
      }
      
      return `${src}?w=${scaledWidth} ${scaledWidth}w`;
    })
    .join(', ');
}

/**
 * Generate blur placeholder (tiny base64 image)
 */
function generateBlurPlaceholder(src: string): string {
  // For demo purposes, return a simple gray blur
  // In production, this would be generated at build time
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%230F172A' filter='url(%23b)'/%3E%3C/svg%3E`;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  sizes,
  objectFit = 'cover',
  loading: loadingProp,
  onLoad,
  onError,
  placeholder = 'blur',
  blurDataURL,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Determine loading strategy
  const loading = loadingProp || (priority ? 'eager' : 'lazy');
  
  // Generate optimized URLs
  const urls = generateOptimizedUrls(src, quality);
  
  // Generate srcSet for responsive images
  const srcSet = width ? generateSrcSet(src, width) : undefined;
  
  // Generate blur placeholder
  const blurPlaceholder = blurDataURL || (placeholder === 'blur' ? generateBlurPlaceholder(src) : undefined);
  
  // Intersection Observer for lazy loading (fallback for older browsers)
  useEffect(() => {
    if (loading === 'eager' || !imgRef.current) return;
    
    const img = imgRef.current;
    
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: load immediately
      setIsLoaded(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoaded(true);
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before visible
      }
    );
    
    observer.observe(img);
    
    return () => {
      observer.disconnect();
    };
  }, [loading]);
  
  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  };
  
  // Handle image error
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    onError?.(new Error(`Failed to load image: ${src}`));
  };
  
  // Accessibility: Ensure alt text is provided
  if (!alt && process.env.NODE_ENV === 'development') {
    console.warn(`OptimizedImage: Missing alt text for image: ${src}`);
  }
  
  return (
    <picture className={`ff-optimized-image ${className}`}>
      {/* AVIF format (best compression, modern browsers) */}
      {urls.avif && (
        <source
          type="image/avif"
          srcSet={urls.avif}
          sizes={sizes}
        />
      )}
      
      {/* WebP format (good compression, wide support) */}
      {urls.webp && (
        <source
          type="image/webp"
          srcSet={urls.webp}
          sizes={sizes}
        />
      )}
      
      {/* Fallback to original format */}
      <img
        ref={imgRef}
        src={urls.original}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        srcSet={srcSet}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        className={`
          ${className}
          transition-opacity duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          ${hasError ? 'hidden' : ''}
        `}
        style={{
          objectFit,
          width: width ? `${width}px` : undefined,
          height: height ? `${height}px` : undefined,
        }}
      />
      
      {/* Blur placeholder (shown while loading) */}
      {!isLoaded && blurPlaceholder && !hasError && (
        <img
          src={blurPlaceholder}
          alt=""
          aria-hidden="true"
          className={`
            absolute inset-0 w-full h-full
            ${isLoaded ? 'opacity-0' : 'opacity-100'}
            transition-opacity duration-300
            pointer-events-none
          `}
          style={{
            objectFit,
          }}
        />
      )}
      
      {/* Error fallback */}
      {hasError && (
        <div
          className="flex items-center justify-center bg-gray-800 text-gray-400"
          style={{
            width: width ? `${width}px` : '100%',
            height: height ? `${height}px` : '100%',
          }}
        >
          <div className="text-center p-4">
            <svg
              className="w-12 h-12 mx-auto mb-2 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">Image failed to load</p>
          </div>
        </div>
      )}
    </picture>
  );
}

/**
 * Optimized Background Image Component
 * For use with div backgrounds instead of img tags
 */
export function OptimizedBackgroundImage({
  src,
  alt,
  className = '',
  priority = false,
  quality = 85,
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  quality?: number;
  children?: React.ReactNode;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const urls = generateOptimizedUrls(src, quality);
  
  useEffect(() => {
    const img = new Image();
    img.src = urls.webp || urls.original;
    img.onload = () => setIsLoaded(true);
  }, [urls]);
  
  return (
    <div
      className={`ff-optimized-bg-image ${className} transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        backgroundImage: `url(${urls.webp || urls.original})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      role="img"
      aria-label={alt}
    >
      {children}
    </div>
  );
}

/**
 * Image preloader utility
 * Preload images before they're needed
 */
export function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(
    urls.map((url) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to preload: ${url}`));
        img.src = url;
      });
    })
  );
}

/**
 * Usage Examples:
 * 
 * // Basic usage
 * <OptimizedImage
 *   src="/hero-image.jpg"
 *   alt="FlashFusion AI Platform"
 *   width={1200}
 *   height={600}
 * />
 * 
 * // Priority image (above fold)
 * <OptimizedImage
 *   src="/hero.jpg"
 *   alt="Hero image"
 *   priority
 *   width={1920}
 *   height={1080}
 * />
 * 
 * // Responsive image
 * <OptimizedImage
 *   src="/product.jpg"
 *   alt="Product screenshot"
 *   width={800}
 *   height={600}
 *   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
 * />
 * 
 * // With custom blur placeholder
 * <OptimizedImage
 *   src="/photo.jpg"
 *   alt="Photo"
 *   width={400}
 *   height={300}
 *   blurDataURL="data:image/jpeg;base64,..."
 * />
 * 
 * // Background image
 * <OptimizedBackgroundImage
 *   src="/background.jpg"
 *   alt="Background pattern"
 * >
 *   <div className="p-8">Content here</div>
 * </OptimizedBackgroundImage>
 */

export default OptimizedImage;
