/**
 * Fine-Tuning Studio Component
 * Main interface for custom model fine-tuning
 * Production-grade, modular implementation
 */

import React, { useState, useCallback } from 'react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Alert, AlertDescription } from '../../ui/alert';
import { Progress } from '../../ui/progress';
import { Badge } from '../../ui/badge';
import type { FineTuningConfig, TrainingJob, Dataset } from '../../../types/fine-tuning';

interface FineTuningStudioProps {
  onStartTraining?: (config: FineTuningConfig) => void;
  onCancelTraining?: (jobId: string) => void;
}

export const FineTuningStudio: React.FC<FineTuningStudioProps> = ({
  onStartTraining,
  onCancelTraining
}) => {
  const [activeTab, setActiveTab] = useState<string>('dataset');
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [config, setConfig] = useState<Partial<FineTuningConfig> | null>(null);
  const [currentJob, setCurrentJob] = useState<TrainingJob | null>(null);

  const handleDatasetUpload = useCallback((uploadedDataset: Dataset) => {
    setDataset(uploadedDataset);
    setActiveTab('configure');
  }, []);

  const handleConfigComplete = useCallback((completedConfig: FineTuningConfig) => {
    setConfig(completedConfig);
    setActiveTab('review');
  }, []);

  const handleStartTraining = useCallback(() => {
    if (config && onStartTraining) {
      onStartTraining(config as FineTuningConfig);
      setActiveTab('monitor');
    }
  }, [config, onStartTraining]);

  const getTabStatus = (tab: string): 'complete' | 'active' | 'pending' => {
    const tabs = ['dataset', 'configure', 'review', 'monitor'];
    const currentIndex = tabs.indexOf(activeTab);
    const tabIndex = tabs.indexOf(tab);

    if (tabIndex < currentIndex) return 'complete';
    if (tabIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fine-Tuning Studio</h1>
          <p className="text-muted-foreground mt-1">
            Create custom AI models trained on your specific data
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            View Documentation
          </Button>
          <Button variant="outline">
            Browse Templates
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Training Workflow</h2>
          <Badge variant={currentJob ? 'default' : 'secondary'}>
            {currentJob ? 'Training In Progress' : 'Setup'}
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          {['Dataset', 'Configure', 'Review', 'Monitor'].map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    getTabStatus(step.toLowerCase()) === 'complete'
                      ? 'bg-green-500 text-white'
                      : getTabStatus(step.toLowerCase()) === 'active'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-sm font-medium">{step}</span>
              </div>
              {index < 3 && (
                <div className="flex-1 h-1 bg-gray-200">
                  <div
                    className={`h-full transition-all ${
                      getTabStatus(['dataset', 'configure', 'review', 'monitor'][index + 1]) !==
                      'pending'
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                    style={{ width: '100%' }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dataset" disabled={currentJob !== null}>
            1. Dataset
          </TabsTrigger>
          <TabsTrigger value="configure" disabled={!dataset || currentJob !== null}>
            2. Configure
          </TabsTrigger>
          <TabsTrigger value="review" disabled={!config || currentJob !== null}>
            3. Review
          </TabsTrigger>
          <TabsTrigger value="monitor" disabled={!currentJob}>
            4. Monitor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dataset" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Training Dataset</h2>
            <DatasetUploadSection onUpload={handleDatasetUpload} />
          </Card>
        </TabsContent>

        <TabsContent value="configure" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Configure Training</h2>
            {dataset && (
              <ConfigurationSection
                dataset={dataset}
                onComplete={handleConfigComplete}
              />
            )}
          </Card>
        </TabsContent>

        <TabsContent value="review" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Review & Start Training</h2>
            {config && (
              <ReviewSection
                config={config as FineTuningConfig}
                onStart={handleStartTraining}
              />
            )}
          </Card>
        </TabsContent>

        <TabsContent value="monitor" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Training Progress</h2>
            {currentJob && (
              <MonitoringSection
                job={currentJob}
                onCancel={() => onCancelTraining?.(currentJob.id)}
              />
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Help Section */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="text-blue-600">ℹ️</div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Need Help?</h3>
            <p className="text-sm text-blue-700">
              Check out our comprehensive guide on fine-tuning best practices, or explore
              our template library for common use cases.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Sub-components (placeholders for now - would be separate files in production)
const DatasetUploadSection: React.FC<{ onUpload: (dataset: Dataset) => void }> = ({
  onUpload
}) => {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          Upload your training data in JSONL, CSV, or JSON format. Minimum 10 records recommended.
        </AlertDescription>
      </Alert>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
        <div className="space-y-2">
          <div className="text-4xl">📁</div>
          <h3 className="text-lg font-semibold">Drag and drop your dataset</h3>
          <p className="text-sm text-muted-foreground">or click to browse</p>
          <Button variant="outline" className="mt-4">
            Select File
          </Button>
        </div>
      </div>
    </div>
  );
};

const ConfigurationSection: React.FC<{
  dataset: Dataset;
  onComplete: (config: FineTuningConfig) => void;
}> = ({ dataset, onComplete }) => {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          Configure your training parameters. We'll provide recommendations based on your dataset.
        </AlertDescription>
      </Alert>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Base Model</label>
          <select className="w-full mt-1 p-2 border rounded">
            <option>GPT-4</option>
            <option>Claude 3</option>
            <option>Llama 3</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Learning Rate</label>
          <input type="number" className="w-full mt-1 p-2 border rounded" defaultValue="0.0001" />
        </div>
        <div>
          <label className="text-sm font-medium">Batch Size</label>
          <input type="number" className="w-full mt-1 p-2 border rounded" defaultValue="8" />
        </div>
        <div>
          <label className="text-sm font-medium">Epochs</label>
          <input type="number" className="w-full mt-1 p-2 border rounded" defaultValue="3" />
        </div>
      </div>
      <Button onClick={() => {}} className="w-full">
        Continue to Review
      </Button>
    </div>
  );
};

const ReviewSection: React.FC<{
  config: FineTuningConfig;
  onStart: () => void;
}> = ({ config, onStart }) => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">Base Model:</span>
          <span>{config.baseModel.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Dataset:</span>
          <span>{config.dataset.recordCount} records</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Estimated Cost:</span>
          <span className="font-bold">${config.costEstimation.totalCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Estimated Time:</span>
          <span>{config.costEstimation.estimatedTime} minutes</span>
        </div>
      </div>
      <Button onClick={onStart} className="w-full" size="lg">
        Start Training
      </Button>
    </div>
  );
};

const MonitoringSection: React.FC<{
  job: TrainingJob;
  onCancel: () => void;
}> = ({ job, onCancel }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant={job.status === 'training' ? 'default' : 'secondary'}>
          {job.status}
        </Badge>
        <Button variant="destructive" size="sm" onClick={onCancel}>
          Cancel Training
        </Button>
      </div>
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Progress</span>
          <span>{job.progress.percentComplete.toFixed(1)}%</span>
        </div>
        <Progress value={job.progress.percentComplete} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-muted-foreground">Current Loss</div>
          <div className="text-2xl font-bold">{job.metrics.loss.current.toFixed(4)}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-muted-foreground">Best Loss</div>
          <div className="text-2xl font-bold">{job.metrics.loss.best.toFixed(4)}</div>
        </div>
      </div>
    </div>
  );
};

export default FineTuningStudio;
