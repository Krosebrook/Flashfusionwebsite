/**
 * Custom hook for AI generation workflow
 * Handles generation state, progress tracking, and cancellation
 */

import { useState, useCallback, useRef } from 'react';

export interface GenerationConfig {
  type: string;
  prompt: string;
  model: string;
  options?: Record<string, any>;
}

export interface GeneratedFile {
  name: string;
  type: 'file' | 'folder';
  size: string;
}

export interface GenerationPreview {
  type: 'app' | 'content' | 'visual' | 'code';
  features?: string[];
  techStack?: string[];
  pieces?: string[];
  platforms?: string[];
  assets?: string[];
  formats?: string[];
  components?: string[];
}

export interface GenerationResult {
  id: string;
  type: string;
  title: string;
  description: string;
  files: GeneratedFile[];
  preview: GenerationPreview | null;
  timestamp: Date;
  model: string;
  prompt: string;
}

export interface GenerationState {
  isGenerating: boolean;
  progress: number;
  error: Error | null;
  result: GenerationResult | null;
}

export function useAIGeneration() {
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    progress: 0,
    error: null,
    result: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const generate = useCallback(async (config: GenerationConfig): Promise<GenerationResult | null> => {
    // Clean up previous abort controller if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller for cancellation support
    abortControllerRef.current = new AbortController();
    
    setState({
      isGenerating: true,
      progress: 0,
      error: null,
      result: null,
    });

    try {
      // Simulate AI generation with progressive updates
      for (let i = 0; i <= 100; i += 5) {
        // Check if generation was cancelled
        if (abortControllerRef.current.signal.aborted) {
          throw new Error('Generation cancelled');
        }

        setState(prev => ({ ...prev, progress: i }));
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // In a real implementation, this would call an API
      // const response = await fetch('/api/generate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(config),
      //   signal: abortControllerRef.current.signal,
      // });

      const result: GenerationResult = {
        id: `gen-${Date.now()}`,
        type: config.type,
        title: generateTitle(config.type),
        description: generateDescription(config.type),
        files: generateFiles(config.type),
        preview: generatePreview(config.type),
        timestamp: new Date(),
        model: config.model,
        prompt: config.prompt,
      };

      setState({
        isGenerating: false,
        progress: 100,
        error: null,
        result,
      });

      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Generation failed');
      setState({
        isGenerating: false,
        progress: 0,
        error: err,
        result: null,
      });
      return null;
    }
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setState(prev => ({
        ...prev,
        isGenerating: false,
        progress: 0,
        error: new Error('Generation cancelled by user'),
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isGenerating: false,
      progress: 0,
      error: null,
      result: null,
    });
  }, []);

  return {
    ...state,
    generate,
    cancel,
    reset,
  };
}

// Helper functions for generating mock content
function generateTitle(type: string): string {
  const titles: Record<string, string> = {
    'fullstack-app': 'TaskFlow Pro - Project Management App',
    'content-suite': 'Content Marketing Campaign - "AI Revolution 2024"',
    'visual-assets': 'TechStart Brand Identity Package',
    'code-components': 'Advanced React Component Library',
  };
  return titles[type] || 'Generated Creation';
}

function generateDescription(type: string): string {
  const descriptions: Record<string, string> = {
    'fullstack-app': 'Complete project management application with React frontend, Node.js backend, PostgreSQL database, and real-time collaboration features.',
    'content-suite': 'Complete marketing campaign including blog posts, social media content, email templates, and promotional materials focused on AI innovation.',
    'visual-assets': 'Professional brand identity package including logo variations, color palette, typography guide, and marketing materials.',
    'code-components': 'Production-ready React component library with TypeScript, Storybook documentation, and comprehensive testing suite.',
  };
  return descriptions[type] || 'AI-generated creation ready for use.';
}

function generateFiles(type: string): GeneratedFile[] {
  const fileStructures: Record<string, GeneratedFile[]> = {
    'fullstack-app': [
      { name: 'frontend/', type: 'folder', size: '15 files' },
      { name: 'backend/', type: 'folder', size: '12 files' },
      { name: 'database/', type: 'folder', size: '5 files' },
      { name: 'docker-compose.yml', type: 'file', size: '2.1 KB' },
      { name: 'README.md', type: 'file', size: '4.3 KB' },
      { name: 'package.json', type: 'file', size: '1.8 KB' },
    ],
    'content-suite': [
      { name: 'blog-posts/', type: 'folder', size: '8 files' },
      { name: 'social-media/', type: 'folder', size: '15 files' },
      { name: 'email-templates/', type: 'folder', size: '6 files' },
      { name: 'content-calendar.xlsx', type: 'file', size: '156 KB' },
      { name: 'brand-guidelines.pdf', type: 'file', size: '2.3 MB' },
    ],
    'visual-assets': [
      { name: 'logos/', type: 'folder', size: '12 files' },
      { name: 'brand-colors.pdf', type: 'file', size: '890 KB' },
      { name: 'typography-guide.pdf', type: 'file', size: '1.2 MB' },
      { name: 'marketing-materials/', type: 'folder', size: '8 files' },
      { name: 'social-media-templates/', type: 'folder', size: '20 files' },
    ],
    'code-components': [
      { name: 'src/components/', type: 'folder', size: '25 files' },
      { name: 'src/hooks/', type: 'folder', size: '8 files' },
      { name: 'src/utils/', type: 'folder', size: '12 files' },
      { name: 'storybook/', type: 'folder', size: '15 files' },
      { name: 'tests/', type: 'folder', size: '30 files' },
      { name: 'package.json', type: 'file', size: '3.2 KB' },
    ],
  };
  return fileStructures[type] || [];
}

function generatePreview(type: string): GenerationPreview | null {
  const previews: Record<string, GenerationPreview> = {
    'fullstack-app': {
      type: 'app',
      features: ['User Authentication', 'Project Dashboard', 'Real-time Chat', 'File Upload', 'API Integration', 'Responsive Design'],
      techStack: ['React', 'Node.js', 'PostgreSQL', 'WebSocket', 'JWT Auth', 'Docker'],
    },
    'content-suite': {
      type: 'content',
      pieces: ['5 Blog Posts', '20 Social Media Posts', '6 Email Templates', '1 Content Calendar', '1 Brand Guide'],
      platforms: ['LinkedIn', 'Twitter', 'Instagram', 'Facebook', 'Medium', 'Newsletter'],
    },
    'visual-assets': {
      type: 'visual',
      assets: ['Primary Logo', '6 Logo Variations', 'Color Palette', 'Typography System', '8 Marketing Templates', '20 Social Templates'],
      formats: ['SVG', 'PNG', 'PDF', 'AI', 'PSD', 'Figma'],
    },
    'code-components': {
      type: 'code',
      components: ['UI Components', 'Custom Hooks', 'Utility Functions', 'Test Suite', 'Storybook Docs', 'TypeScript Types'],
      features: ['TypeScript', 'Responsive', 'Accessible', 'Tested', 'Documented', 'Tree-shakable'],
    },
  };
  return previews[type] || null;
}
