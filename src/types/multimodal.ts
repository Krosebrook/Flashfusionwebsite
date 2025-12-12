/**
 * Multi-Modal AI Type Definitions
 * Comprehensive types for cross-modal AI generation and processing
 */

export type ModalityType = 'text' | 'image' | 'audio' | 'video' | 'code' | '3d';
export type GenerationStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface MultiModalInput {
  id: string;
  type: ModalityType;
  content: string | Blob | Buffer;
  metadata?: Record<string, any>;
  options?: GenerationOptions;
}

export interface MultiModalOutput {
  id: string;
  type: ModalityType;
  content: string | Blob | Buffer;
  metadata: OutputMetadata;
  quality: QualityMetrics;
}

export interface OutputMetadata {
  generatedAt: Date;
  model: string;
  processingTime: number;
  tokensUsed?: number;
  dimensions?: Dimensions;
  duration?: number; // for audio/video in seconds
  format: string;
}

export interface Dimensions {
  width: number;
  height: number;
  depth?: number; // for 3D
}

export interface QualityMetrics {
  resolution?: number;
  bitrate?: number;
  clarity: number; // 0-1
  accuracy: number; // 0-1
  confidence: number; // 0-1
}

export interface GenerationOptions {
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  style?: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
  aspectRatio?: string;
  duration?: number;
}

export interface CrossModalGeneration {
  id: string;
  inputModality: ModalityType;
  outputModality: ModalityType;
  input: MultiModalInput;
  output?: MultiModalOutput;
  status: GenerationStatus;
  progress: number;
  startedAt: Date;
  completedAt?: Date;
  error?: GenerationError;
}

export interface GenerationError {
  code: string;
  message: string;
  details: string;
  recoverable: boolean;
}

export interface TextToImageOptions extends GenerationOptions {
  negativePrompt?: string;
  guidanceScale?: number;
  steps?: number;
  seed?: number;
}

export interface ImageToTextOptions extends GenerationOptions {
  detailLevel?: 'low' | 'medium' | 'high';
  language?: string;
}

export interface AudioToTextOptions extends GenerationOptions {
  language?: string;
  timestamps?: boolean;
  speakerDiarization?: boolean;
}

export interface TextToAudioOptions extends GenerationOptions {
  voice?: string;
  speed?: number;
  pitch?: number;
  emotion?: string;
}

export interface VideoGenerationOptions extends GenerationOptions {
  fps?: number;
  codec?: string;
  resolution?: string;
  transitions?: boolean;
}

export interface ThreeDGenerationOptions extends GenerationOptions {
  format?: 'obj' | 'gltf' | 'fbx' | 'stl';
  texture?: boolean;
  rigging?: boolean;
  animations?: boolean;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  inputModalities: ModalityType[];
  outputModalities: ModalityType[];
  capabilities: string[];
  pricing: ModelPricing;
  performance: PerformanceMetrics;
}

export interface ModelPricing {
  inputCost: number;
  outputCost: number;
  currency: string;
  unit: 'token' | 'second' | 'image' | 'request';
}

export interface PerformanceMetrics {
  averageLatency: number; // ms
  throughput: number; // requests/second
  quality: number; // 0-1
  reliability: number; // 0-1
}

export interface MultiModalPipeline {
  id: string;
  name: string;
  description: string;
  steps: PipelineStep[];
  inputModality: ModalityType;
  outputModality: ModalityType;
}

export interface PipelineStep {
  id: string;
  operation: string;
  inputModality: ModalityType;
  outputModality: ModalityType;
  model: string;
  options: Record<string, any>;
}
