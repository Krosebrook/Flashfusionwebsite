import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Globe, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { MARKETPLACES } from '../../constants/print-on-demand';
import { MARKETPLACE_CREDENTIALS } from '../../constants/marketplace';
import { validateMarketplaceCredentials } from '../../utils/marketplace';

interface MarketplaceConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMarketplace: string;
  onConnect: (marketplaceId: string, credentials: any) => void;
  isConnecting: boolean;
}

export function MarketplaceConnectModal({
  isOpen,
  onClose,
  selectedMarketplace,
  onConnect,
  isConnecting
}: MarketplaceConnectModalProps) {
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const marketplace = selectedMarketplace ? MARKETPLACES[selectedMarketplace as keyof typeof MARKETPLACES] : null;
  const credentialFields = selectedMarketplace ? MARKETPLACE_CREDENTIALS[selectedMarketplace as keyof typeof MARKETPLACE_CREDENTIALS] || [] : [];

  useEffect(() => {
    if (isOpen && selectedMarketplace) {
      setCredentials({});
      setErrors([]);
      setCurrentStep(0);
    }
  }, [isOpen, selectedMarketplace]);

  const handleCredentialChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleConnect = async () => {
    if (!selectedMarketplace) return;

    const validation = validateMarketplaceCredentials(selectedMarketplace, credentials);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);
    await onConnect(selectedMarketplace, credentials);
  };

  const steps = [
    {
      title: 'Marketplace Information',
      description: 'Learn about this marketplace and its requirements'
    },
    {
      title: 'API Credentials',
      description: 'Enter your marketplace API credentials'
    },
    {
      title: 'Connection Test',
      description: 'Verify and establish the connection'
    }
  ];

  if (!marketplace) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Globe className="h-6 w-6 text-primary" />
            <span>Connect to {marketplace.name}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 ${
                index <= currentStep ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                  index < currentStep
                    ? 'bg-primary border-primary text-white'
                    : index === currentStep
                    ? 'border-primary text-primary'
                    : 'border-muted text-muted-foreground'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-sm font-medium hidden sm:block">{step.title}</span>
              
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 ${
                    index < currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 0 && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{marketplace.name}</h3>
                      <p className="text-muted-foreground capitalize mb-3">
                        {marketplace.category} marketplace
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <Badge variant="outline">
                          {marketplace.commission}% commission
                        </Badge>
                        <Badge variant="secondary">
                          {marketplace.supportedProducts.includes('all') ? 'All Products' : 'Limited Products'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>

                <div>
                  <h4 className="font-semibold mb-3">Features & Benefits</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {marketplace.features.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm capitalize">
                          {feature.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Requirements</h4>
                  <div className="space-y-2">
                    {marketplace.requirements.map((requirement) => (
                      <div key={requirement} className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm capitalize">
                          {requirement.replace('_', ' ')} required
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You'll need to create an account and obtain API credentials from {marketplace.name} 
                    before connecting. 
                    <Button variant="link" className="h-auto p-0 ml-1">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Get credentials
                    </Button>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Enter API Credentials</h4>
                  <p className="text-muted-foreground text-sm mb-6">
                    Enter your {marketplace.name} API credentials to establish the connection.
                  </p>
                </div>

                <div className="space-y-4">
                  {credentialFields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <Label htmlFor={field.name} className="flex items-center space-x-2">
                        <span>{field.label}</span>
                        {field.required && <span className="text-red-500">*</span>}
                      </Label>
                      <Input
                        id={field.name}
                        type={field.type}
                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                        value={credentials[field.name] || ''}
                        onChange={(e) => handleCredentialChange(field.name, e.target.value)}
                        className={errors.length > 0 ? 'border-red-500' : ''}
                      />
                    </div>
                  ))}
                </div>

                {errors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        {errors.map((error, index) => (
                          <div key={index}>{error}</div>
                        ))}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  {isConnecting ? (
                    <div>
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                      <h4 className="font-semibold mb-2">Connecting to {marketplace.name}</h4>
                      <p className="text-muted-foreground">
                        Verifying credentials and establishing connection...
                      </p>
                    </div>
                  ) : (
                    <div>
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h4 className="font-semibold mb-2">Ready to Connect</h4>
                      <p className="text-muted-foreground">
                        Your credentials have been validated. Click connect to establish the connection.
                      </p>
                    </div>
                  )}
                </div>

                <Card className="p-4">
                  <h5 className="font-semibold mb-2">Connection Summary</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Marketplace:</span>
                      <span>{marketplace.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Commission:</span>
                      <span>{marketplace.commission}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Products:</span>
                      <span>
                        {marketplace.supportedProducts.includes('all') ? 'All' : marketplace.supportedProducts.join(', ')}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          
          <div className="flex items-center space-x-3">
            {currentStep > 0 && (
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={isConnecting}
              >
                Back
              </Button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={currentStep === 1 && credentialFields.some(field => 
                  field.required && !credentials[field.name]
                )}
                className="bg-gradient-to-r from-primary to-secondary"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="bg-gradient-to-r from-primary to-secondary"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Connecting...
                  </>
                ) : (
                  'Connect Marketplace'
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}