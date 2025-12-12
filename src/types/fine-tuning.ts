/**
 * Type definitions for AI Model Fine-Tuning Platform
 * Comprehensive type safety for custom model training
 */

export type ModelProvider = 'openai' | 'anthropic' | 'google' | 'meta' | 'custom';
export type ModelType = 'text' | 'code' | 'image' | 'multimodal';
export type TrainingStatus = 'pending' | 'validating' | 'training' | 'evaluating' | 'completed' | 'failed' | 'cancelled';
export type DatasetFormat = 'jsonl' | 'csv' | 'parquet' | 'json' | 'text';

export interface Dataset {
  id: string;
  name: string;
  description?: string;
  format: DatasetFormat;
  size: number;
  recordCount: number;
  uploadedAt: Date;
  validatedAt?: Date;
  validation: DatasetValidation;
  metadata: Record<string, any>;
  splits?: DatasetSplits;
}

export interface DatasetValidation {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  statistics: DatasetStatistics;
}

export interface ValidationError {
  line?: number;
  field?: string;
  message: string;
  severity: 'error' | 'critical';
}

export interface ValidationWarning {
  line?: number;
  field?: string;
  message: string;
  suggestion?: string;
}

export interface DatasetStatistics {
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  averageLength: number;
  maxLength: number;
  minLength: number;
  tokenDistribution?: TokenDistribution;
  uniqueTokens?: number;
}

export interface TokenDistribution {
  p50: number;
  p75: number;
  p90: number;
  p95: number;
  p99: number;
}

export interface DatasetSplits {
  train: number;
  validation: number;
  test: number;
}

export interface FineTuningConfig {
  id: string;
  name: string;
  baseModel: BaseModel;
  dataset: Dataset;
  hyperparameters: Hyperparameters;
  trainingOptions: TrainingOptions;
  costEstimation: CostEstimation;
  createdAt: Date;
  updatedAt: Date;
}

export interface BaseModel {
  id: string;
  name: string;
  provider: ModelProvider;
  type: ModelType;
  version: string;
  parameters: number;
  contextWindow: number;
  capabilities: ModelCapability[];
  pricing: ModelPricing;
}

export interface ModelCapability {
  name: string;
  description: string;
  supported: boolean;
}

export interface ModelPricing {
  training: {
    perToken: number;
    perEpoch: number;
    minimum: number;
  };
  inference: {
    input: number;
    output: number;
  };
}

export interface Hyperparameters {
  learningRate: number;
  batchSize: number;
  epochs: number;
  warmupSteps?: number;
  weightDecay?: number;
  gradientClipping?: number;
  optimizer?: 'adam' | 'adamw' | 'sgd';
  scheduler?: 'linear' | 'cosine' | 'constant';
  earlyStoppingPatience?: number;
  validationSplit?: number;
}

export interface TrainingOptions {
  distributed: boolean;
  mixedPrecision: boolean;
  gradientAccumulation: number;
  checkpointFrequency: number;
  evaluationFrequency: number;
  logging: LoggingConfig;
  notifications: NotificationConfig;
}

export interface LoggingConfig {
  level: 'debug' | 'info' | 'warning' | 'error';
  logMetrics: boolean;
  logGradients: boolean;
  logSamples: boolean;
  sampleFrequency: number;
}

export interface NotificationConfig {
  email: boolean;
  webhook?: string;
  slack?: string;
  milestones: boolean;
  errors: boolean;
}

export interface CostEstimation {
  trainingCost: number;
  storageCost: number;
  inferenceCost: number;
  totalCost: number;
  estimatedTime: number; // in minutes
  currency: string;
  breakdown: CostBreakdown;
}

export interface CostBreakdown {
  dataPreparation: number;
  training: number;
  evaluation: number;
  deployment: number;
  storage: number;
}

export interface TrainingJob {
  id: string;
  configId: string;
  status: TrainingStatus;
  progress: TrainingProgress;
  metrics: TrainingMetrics;
  startedAt?: Date;
  completedAt?: Date;
  estimatedCompletion?: Date;
  error?: TrainingError;
  checkpoints: Checkpoint[];
  logs: TrainingLog[];
}

export interface TrainingProgress {
  currentEpoch: number;
  totalEpochs: number;
  currentStep: number;
  totalSteps: number;
  percentComplete: number;
  samplesProcessed: number;
  totalSamples: number;
  tokensProcessed: number;
  totalTokens: number;
}

export interface TrainingMetrics {
  loss: MetricHistory;
  validationLoss?: MetricHistory;
  accuracy?: MetricHistory;
  learningRate: MetricHistory;
  perplexity?: MetricHistory;
  bleu?: MetricHistory;
  rouge?: MetricHistory;
  custom?: Record<string, MetricHistory>;
}

export interface MetricHistory {
  current: number;
  best: number;
  worst: number;
  average: number;
  history: MetricPoint[];
}

export interface MetricPoint {
  step: number;
  epoch: number;
  value: number;
  timestamp: Date;
}

export interface TrainingError {
  code: string;
  message: string;
  details: string;
  recoverable: boolean;
  suggestions: string[];
}

export interface Checkpoint {
  id: string;
  epoch: number;
  step: number;
  loss: number;
  validationLoss?: number;
  metrics: Record<string, number>;
  size: number;
  path: string;
  createdAt: Date;
  isBest: boolean;
}

export interface TrainingLog {
  timestamp: Date;
  level: 'debug' | 'info' | 'warning' | 'error';
  message: string;
  metadata?: Record<string, any>;
}

export interface ModelEvaluation {
  id: string;
  modelId: string;
  jobId: string;
  testDataset: Dataset;
  metrics: EvaluationMetrics;
  benchmarks: Benchmark[];
  samples: EvaluationSample[];
  createdAt: Date;
}

export interface EvaluationMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  perplexity?: number;
  bleuScore?: number;
  rougeScore?: Record<string, number>;
  custom?: Record<string, number>;
}

export interface Benchmark {
  name: string;
  score: number;
  baseline: number;
  percentile: number;
  comparison: 'better' | 'similar' | 'worse';
}

export interface EvaluationSample {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  score: number;
  metadata?: Record<string, any>;
}

export interface FineTunedModel {
  id: string;
  name: string;
  description?: string;
  baseModel: BaseModel;
  trainingJob: TrainingJob;
  evaluation: ModelEvaluation;
  status: 'training' | 'ready' | 'deploying' | 'deployed' | 'archived';
  version: string;
  endpoint?: ModelEndpoint;
  deployment?: ModelDeployment;
  usage: ModelUsage;
  createdAt: Date;
  updatedAt: Date;
}

export interface ModelEndpoint {
  id: string;
  url: string;
  apiKey: string;
  region: string;
  status: 'active' | 'inactive' | 'error';
  health: EndpointHealth;
}

export interface EndpointHealth {
  isHealthy: boolean;
  latency: number;
  uptime: number;
  lastChecked: Date;
  errors: number;
}

export interface ModelDeployment {
  id: string;
  modelId: string;
  environment: 'development' | 'staging' | 'production';
  replicas: number;
  autoscaling: AutoscalingConfig;
  monitoring: MonitoringConfig;
  deployedAt: Date;
  lastUpdated: Date;
}

export interface AutoscalingConfig {
  enabled: boolean;
  minReplicas: number;
  maxReplicas: number;
  targetCPU: number;
  targetMemory: number;
  scaleUpCooldown: number;
  scaleDownCooldown: number;
}

export interface MonitoringConfig {
  enabled: boolean;
  metrics: string[];
  alerts: AlertConfig[];
  logging: boolean;
}

export interface AlertConfig {
  name: string;
  condition: string;
  threshold: number;
  action: 'notify' | 'scale' | 'rollback';
  channels: string[];
}

export interface ModelUsage {
  totalRequests: number;
  totalTokens: number;
  averageLatency: number;
  errorRate: number;
  cost: number;
  lastUsed?: Date;
}

export interface ABTest {
  id: string;
  name: string;
  description: string;
  models: ABTestModel[];
  traffic: TrafficSplit;
  metrics: ABTestMetrics;
  status: 'draft' | 'running' | 'completed' | 'cancelled';
  startedAt?: Date;
  completedAt?: Date;
  winner?: string;
}

export interface ABTestModel {
  id: string;
  name: string;
  modelId: string;
  version: string;
}

export interface TrafficSplit {
  [modelId: string]: number; // percentage
}

export interface ABTestMetrics {
  [modelId: string]: {
    requests: number;
    latency: number;
    errorRate: number;
    userSatisfaction: number;
    customMetrics?: Record<string, number>;
  };
}

export interface FineTuningTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  baseModel: string;
  defaultConfig: Partial<FineTuningConfig>;
  datasetRequirements: DatasetRequirements;
  estimatedCost: number;
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

export interface DatasetRequirements {
  minRecords: number;
  maxRecords?: number;
  format: DatasetFormat[];
  schema?: Record<string, any>;
  examples: string[];
}
