import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface ConfigWizardProps {
  onComplete: () => void;
}

const steps = [
  { id: 'project', title: 'Project Details', description: 'Basic information about your project' },
  { id: 'framework', title: 'Framework', description: 'Choose your preferred framework' },
  { id: 'features', title: 'Features', description: 'Select the features you need' },
  { id: 'review', title: 'Review', description: 'Review your configuration' }
];

const frameworks = [
  { id: 'react', name: 'React', description: 'Popular UI library', icon: '⚛️' },
  { id: 'vue', name: 'Vue.js', description: 'Progressive framework', icon: '💚' },
  { id: 'angular', name: 'Angular', description: 'Full-featured framework', icon: '🅰️' },
  { id: 'svelte', name: 'Svelte', description: 'Compile-time framework', icon: '🧡' }
];

const features = [
  { id: 'auth', name: 'Authentication', description: 'User login/signup' },
  { id: 'database', name: 'Database', description: 'Data persistence' },
  { id: 'api', name: 'REST API', description: 'Backend API endpoints' },
  { id: 'payments', name: 'Payments', description: 'Payment processing' },
  { id: 'admin', name: 'Admin Panel', description: 'Administrative interface' },
  { id: 'analytics', name: 'Analytics', description: 'Usage tracking' }
];

export function ConfigWizard({ onComplete }: ConfigWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState({
    projectName: '',
    description: '',
    framework: '',
    selectedFeatures: [] as string[]
  });

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFeatureToggle = (featureId: string) => {
    setConfig(prev => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(featureId)
        ? prev.selectedFeatures.filter(id => id !== featureId)
        : [...prev.selectedFeatures, featureId]
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return config.projectName.trim() !== '';
      case 1: return config.framework !== '';
      case 2: return config.selectedFeatures.length > 0;
      case 3: return true;
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={config.projectName}
                onChange={(e) => setConfig(prev => ({ ...prev, projectName: e.target.value }))}
                placeholder="My Awesome Project"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={config.description}
                onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of your project"
                className="mt-2"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {frameworks.map((framework) => (
              <Card
                key={framework.id}
                className={`cursor-pointer transition-all ${
                  config.framework === framework.id
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setConfig(prev => ({ ...prev, framework: framework.id }))}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-2">{framework.icon}</div>
                  <h3 className="font-medium mb-1">{framework.name}</h3>
                  <p className="text-sm text-muted-foreground">{framework.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature) => (
              <Card
                key={feature.id}
                className={`cursor-pointer transition-all ${
                  config.selectedFeatures.includes(feature.id)
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => handleFeatureToggle(feature.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{feature.name}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                    {config.selectedFeatures.includes(feature.id) && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Project Name</h3>
              <p className="text-muted-foreground">{config.projectName}</p>
            </div>
            
            {config.description && (
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{config.description}</p>
              </div>
            )}
            
            <div>
              <h3 className="font-medium mb-2">Framework</h3>
              <Badge variant="secondary" className="capitalize">
                {config.framework}
              </Badge>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Features</h3>
              <div className="flex flex-wrap gap-2">
                {config.selectedFeatures.map(featureId => {
                  const feature = features.find(f => f.id === featureId);
                  return (
                    <Badge key={featureId} variant="outline">
                      {feature?.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Project Setup Wizard</CardTitle>
            <p className="text-muted-foreground mt-1">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {Math.round(((currentStep + 1) / steps.length) * 100)}% complete
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 mt-4">
          <motion.div
            className="bg-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </CardHeader>

      <CardContent>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button onClick={onComplete} className="ff-btn-primary">
              <Check className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="ff-btn-primary"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}