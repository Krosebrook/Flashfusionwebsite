import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { CheckCircle, Shield, Lock, Key, Eye, AlertTriangle, Zap, FileCheck, Users, Server, ArrowRight } from 'lucide-react';

interface EnterpriseSecurityWorkflowProps {
  onComplete?: () => void;
}

export function EnterpriseSecurityWorkflow({ onComplete }: EnterpriseSecurityWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [securityScore, setSecurityScore] = useState(0);
  const [setupProgress, setSetupProgress] = useState(0);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [securityResults, setSecurityResults] = useState<any>(null);

  const securityFeatures = [
    {
      id: 'encryption',
      name: 'End-to-End Encryption',
      description: 'AES-256 encryption for all data at rest and in transit',
      icon: Lock,
      category: 'encryption',
      priority: 'critical',
      impact: 25,
      compliance: ['SOC 2', 'GDPR', 'HIPAA'],
      features: ['256-bit AES encryption', 'Key rotation', 'Hardware security modules', 'Zero-knowledge architecture']
    },
    {
      id: 'auth',
      name: 'Multi-Factor Authentication',
      description: 'Advanced authentication with biometric and hardware token support',
      icon: Key,
      category: 'authentication',
      priority: 'critical',
      impact: 20,
      compliance: ['SOC 2', 'ISO 27001'],
      features: ['TOTP/HOTP', 'Hardware tokens', 'Biometric auth', 'Risk-based authentication']
    },
    {
      id: 'monitoring',
      name: 'Security Monitoring',
      description: '24/7 threat detection and incident response',
      icon: Eye,
      category: 'monitoring',
      priority: 'high',
      impact: 15,
      compliance: ['SOC 2', 'ISO 27001'],
      features: ['Real-time monitoring', 'AI threat detection', 'Incident response', 'Security analytics']
    },
    {
      id: 'compliance',
      name: 'Compliance Framework',
      description: 'Built-in compliance for major industry standards',
      icon: FileCheck,
      category: 'compliance',
      priority: 'high',
      impact: 15,
      compliance: ['SOC 2', 'GDPR', 'HIPAA', 'PCI DSS'],
      features: ['Audit trails', 'Data governance', 'Privacy controls', 'Compliance reporting']
    },
    {
      id: 'access',
      name: 'Access Control',
      description: 'Role-based access control with privileged access management',
      icon: Users,
      category: 'access',
      priority: 'high',
      impact: 12,
      compliance: ['SOC 2', 'ISO 27001'],
      features: ['RBAC', 'PAM', 'Just-in-time access', 'Access reviews']
    },
    {
      id: 'backup',
      name: 'Secure Backup & Recovery',
      description: 'Encrypted backups with disaster recovery capabilities',
      icon: Server,
      category: 'backup',
      priority: 'medium',
      impact: 8,
      compliance: ['SOC 2'],
      features: ['Encrypted backups', 'Point-in-time recovery', 'Geo-redundancy', 'RTO/RPO guarantees']
    },
    {
      id: 'vulnerability',
      name: 'Vulnerability Management',
      description: 'Continuous security scanning and patch management',
      icon: AlertTriangle,
      category: 'scanning',
      priority: 'medium',
      impact: 5,
      compliance: ['ISO 27001'],
      features: ['Vulnerability scanning', 'Penetration testing', 'Patch management', 'Security assessments']
    }
  ];

  const complianceStandards = [
    {
      id: 'soc2',
      name: 'SOC 2 Type II',
      description: 'Security, availability, processing integrity, confidentiality, and privacy',
      icon: '🛡️',
      status: 'available',
      timeline: '3-6 months',
      requirements: ['Security controls', 'Audit procedures', 'Risk assessments']
    },
    {
      id: 'gdpr',
      name: 'GDPR Compliance',
      description: 'European General Data Protection Regulation compliance',
      icon: '🇪🇺',
      status: 'available',
      timeline: '2-4 months',
      requirements: ['Data protection', 'Privacy by design', 'Consent management']
    },
    {
      id: 'hipaa',
      name: 'HIPAA Compliance',
      description: 'Health Insurance Portability and Accountability Act',
      icon: '🏥',
      status: 'available',
      timeline: '4-8 months',
      requirements: ['PHI protection', 'Access controls', 'Audit logs']
    },
    {
      id: 'pci',
      name: 'PCI DSS',
      description: 'Payment Card Industry Data Security Standard',
      icon: '💳',
      status: 'available',
      timeline: '6-12 months',
      requirements: ['Secure networks', 'Cardholder data protection', 'Regular testing']
    }
  ];

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures(prev => {
      const newFeatures = prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId];
      
      // Calculate security score
      const score = newFeatures.reduce((total, id) => {
        const feature = securityFeatures.find(f => f.id === id);
        return total + (feature?.impact || 0);
      }, 0);
      setSecurityScore(score);
      
      return newFeatures;
    });
  };

  const handleSetupSecurity = async () => {
    setIsSettingUp(true);
    setCurrentStep(3);
    
    // Simulate security setup
    for (let i = 0; i <= 100; i += 2) {
      setSetupProgress(i);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Generate security results
    setSecurityResults({
      features: selectedFeatures.map(featureId => {
        const feature = securityFeatures.find(f => f.id === featureId);
        return {
          id: featureId,
          name: feature?.name,
          status: 'active',
          compliance: feature?.compliance,
          implementation: 'complete'
        };
      }),
      score: securityScore,
      threats: {
        blocked: Math.floor(Math.random() * 1000) + 500,
        incidents: 0,
        vulnerabilities: Math.floor(Math.random() * 5),
        uptime: '99.9%'
      },
      certifications: selectedFeatures.includes('compliance') ? 
        complianceStandards.slice(0, 2).map(cert => ({
          ...cert,
          status: 'in-progress',
          completion: Math.floor(Math.random() * 60) + 20
        })) : []
    });
    
    setIsSettingUp(false);
    setCurrentStep(4);
  };

  const getSecurityLevel = (score: number) => {
    if (score >= 80) return { level: 'Enterprise', color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20' };
    if (score >= 60) return { level: 'Advanced', color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' };
    if (score >= 40) return { level: 'Standard', color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/20' };
    return { level: 'Basic', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' };
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="ff-text-headline">Enterprise Security</h2>
                <p className="ff-text-body">Bank-level security with end-to-end encryption and compliance standards</p>
              </div>
            </div>

            <Card className="ff-card">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="text-6xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text">
                    {securityScore}%
                  </div>
                  <div>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full ${getSecurityLevel(securityScore).bg}`}>
                      <span className={`font-semibold ${getSecurityLevel(securityScore).color}`}>
                        {getSecurityLevel(securityScore).level} Security Level
                      </span>
                    </div>
                  </div>
                  <Progress value={securityScore} className="h-3" />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="ff-text-title">Security Features</h3>
              
              {['critical', 'high', 'medium'].map(priority => {
                const priorityFeatures = securityFeatures.filter(f => f.priority === priority);
                const priorityLabels = {
                  critical: { name: 'Critical Security', color: 'text-red-500', icon: '🔴' },
                  high: { name: 'High Priority', color: 'text-orange-500', icon: '🟠' },
                  medium: { name: 'Additional Security', color: 'text-yellow-500', icon: '🟡' }
                };
                const label = priorityLabels[priority as keyof typeof priorityLabels];
                
                return (
                  <div key={priority} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{label.icon}</span>
                      <h4 className={`ff-text-title text-base ${label.color}`}>{label.name}</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {priorityFeatures.map(feature => {
                        const Icon = feature.icon;
                        return (
                          <Card 
                            key={feature.id}
                            className={`ff-card-interactive cursor-pointer transition-all duration-200 ${
                              selectedFeatures.includes(feature.id) 
                                ? 'ring-2 ring-blue-500 bg-blue-500/10' 
                                : 'hover:bg-white/5'
                            }`}
                            onClick={() => handleFeatureToggle(feature.id)}
                          >
                            <CardContent className="p-6">
                              <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="p-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                                      <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                      <h5 className="font-semibold">{feature.name}</h5>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <Badge className="ff-badge-primary text-xs">+{feature.impact}%</Badge>
                                        {feature.priority === 'critical' && (
                                          <Badge variant="destructive" className="text-xs">Required</Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {selectedFeatures.includes(feature.id) && (
                                    <CheckCircle className="w-5 h-5 text-blue-500" />
                                  )}
                                </div>
                                
                                <p className="text-sm text-gray-400">{feature.description}</p>
                                
                                <div className="space-y-2">
                                  <div className="text-xs text-gray-500 font-medium">Compliance:</div>
                                  <div className="flex flex-wrap gap-1">
                                    {feature.compliance.map(comp => (
                                      <Badge key={comp} variant="outline" className="text-xs">
                                        {comp}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="space-y-1">
                                  <div className="text-xs text-gray-500 font-medium">Includes:</div>
                                  <div className="flex flex-wrap gap-1">
                                    {feature.features.slice(0, 2).map(feat => (
                                      <Badge key={feat} variant="secondary" className="text-xs">
                                        {feat}
                                      </Badge>
                                    ))}
                                    {feature.features.length > 2 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{feature.features.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={() => setCurrentStep(2)}
                disabled={selectedFeatures.length === 0}
                className="ff-btn-primary ff-btn-lg"
              >
                Configure Security ({selectedFeatures.length} feature{selectedFeatures.length !== 1 ? 's' : ''})
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="ff-text-headline">Security Configuration</h2>
              <p className="ff-text-body">Configure advanced security settings and compliance requirements</p>
            </div>

            <Card className="ff-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Security Level: {getSecurityLevel(securityScore).level}</span>
                  <Badge className={getSecurityLevel(securityScore).bg.replace('bg-', 'ff-badge-')}>
                    {securityScore}% Security Score
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedFeatures.map(featureId => {
                    const feature = securityFeatures.find(f => f.id === featureId);
                    const Icon = feature?.icon || Shield;
                    return (
                      <div key={featureId} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded bg-gradient-to-r from-blue-600 to-purple-600">
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">{feature?.name}</span>
                        </div>
                        <Badge variant="secondary">+{feature?.impact}%</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="encryption" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="encryption">Encryption</TabsTrigger>
                <TabsTrigger value="access">Access Control</TabsTrigger>
                <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="encryption" className="space-y-4">
                <Card className="ff-card">
                  <CardContent className="p-6 space-y-4">
                    <h4 className="ff-text-title">Encryption Settings</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">AES-256 Encryption</div>
                          <div className="text-xs text-gray-400">Industry-standard encryption</div>
                        </div>
                        <Switch defaultChecked disabled />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Key Rotation</div>
                          <div className="text-xs text-gray-400">Automatic key rotation</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Hardware Security Module</div>
                          <div className="text-xs text-gray-400">FIPS 140-2 Level 3</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Zero-Knowledge Architecture</div>
                          <div className="text-xs text-gray-400">Server cannot decrypt data</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="ff-text-title text-sm">Encryption Key Length</label>
                      <div className="flex items-center space-x-4 p-3 bg-gray-800 rounded-lg">
                        <span className="text-sm">256-bit AES</span>
                        <Badge className="ff-badge-success">Maximum Security</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="access" className="space-y-4">
                <Card className="ff-card">
                  <CardContent className="p-6 space-y-4">
                    <h4 className="ff-text-title">Access Control Configuration</h4>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <label className="ff-text-title text-sm">Multi-Factor Authentication</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <div>
                              <div className="font-medium text-sm">TOTP/HOTP</div>
                              <div className="text-xs text-gray-400">Time/counter-based OTP</div>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <div>
                              <div className="font-medium text-sm">Hardware Tokens</div>
                              <div className="text-xs text-gray-400">YubiKey, FIDO2</div>
                            </div>
                            <Switch />
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <div>
                              <div className="font-medium text-sm">Biometric Authentication</div>
                              <div className="text-xs text-gray-400">Fingerprint, Face ID</div>
                            </div>
                            <Switch />
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <div>
                              <div className="font-medium text-sm">Risk-Based Auth</div>
                              <div className="text-xs text-gray-400">Adaptive authentication</div>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="ff-text-title text-sm">Session Timeout (minutes)</label>
                        <Input 
                          placeholder="30" 
                          className="ff-input"
                          defaultValue="30"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="monitoring" className="space-y-4">
                <Card className="ff-card">
                  <CardContent className="p-6 space-y-4">
                    <h4 className="ff-text-title">Security Monitoring</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Real-time Monitoring</div>
                          <div className="text-xs text-gray-400">24/7 security monitoring</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">AI Threat Detection</div>
                          <div className="text-xs text-gray-400">Machine learning anomaly detection</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Incident Response</div>
                          <div className="text-xs text-gray-400">Automated incident handling</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Security Analytics</div>
                          <div className="text-xs text-gray-400">Advanced security insights</div>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="compliance" className="space-y-4">
                <Card className="ff-card">
                  <CardContent className="p-6 space-y-4">
                    <h4 className="ff-text-title">Compliance Standards</h4>
                    
                    <div className="space-y-3">
                      {complianceStandards.map(standard => (
                        <div key={standard.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{standard.icon}</span>
                              <h5 className="font-semibold">{standard.name}</h5>
                              <Badge variant="secondary" className="text-xs">{standard.timeline}</Badge>
                            </div>
                            <p className="text-sm text-gray-400">{standard.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {standard.requirements.map(req => (
                                <Badge key={req} variant="outline" className="text-xs">
                                  {req}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Switch />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(1)}
                className="ff-btn-outline"
              >
                Back to Features
              </Button>
              <Button 
                onClick={handleSetupSecurity}
                className="ff-btn-primary ff-btn-lg"
              >
                Deploy Security System
                <Shield className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="ff-text-headline">Deploying Security Infrastructure</h2>
                <p className="ff-text-body">Setting up enterprise-grade security and compliance systems</p>
              </div>
            </div>

            <Card className="ff-card">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="ff-text-title text-sm">Security Deployment Progress</span>
                    <span className="ff-text-title text-sm">{Math.round(setupProgress)}%</span>
                  </div>
                  <Progress value={setupProgress} className="h-3" />
                </div>

                <div className="space-y-4">
                  {selectedFeatures.map((featureId, index) => {
                    const feature = securityFeatures.find(f => f.id === featureId);
                    const Icon = feature?.icon || Shield;
                    const progress = Math.min(setupProgress * (Math.random() * 0.3 + 0.8), 100);
                    
                    return (
                      <div key={featureId} className="p-4 bg-gray-800 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="p-2 rounded bg-gradient-to-r from-blue-600 to-purple-600">
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium text-sm">{feature?.name}</span>
                          </div>
                          {progress >= 100 ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                          )}
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="mt-2 text-xs text-gray-400">
                          {progress >= 100 ? 'Deployed successfully' : 'Deploying security controls...'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-400 mb-2">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">Security Infrastructure Deployment</span>
                  </div>
                  <ul className="text-sm text-blue-300 space-y-1">
                    <li>• Configuring encryption protocols</li>
                    <li>• Setting up access control systems</li>
                    <li>• Initializing monitoring infrastructure</li>
                    <li>• Enabling compliance frameworks</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="ff-text-headline">Security System Active!</h2>
                <p className="ff-text-body">Enterprise-grade security is now protecting your platform</p>
              </div>
            </div>

            {securityResults && (
              <div className="space-y-6">
                <Card className="ff-card">
                  <CardHeader>
                    <CardTitle>Security Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-500">{securityResults.score}%</div>
                        <div className="text-sm text-gray-400">Security Score</div>
                      </div>
                      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-500">{securityResults.threats.blocked}</div>
                        <div className="text-sm text-gray-400">Threats Blocked</div>
                      </div>
                      <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-500">{securityResults.threats.incidents}</div>
                        <div className="text-sm text-gray-400">Security Incidents</div>
                      </div>
                      <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-orange-500">{securityResults.threats.uptime}</div>
                        <div className="text-sm text-gray-400">System Uptime</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card">
                  <CardHeader>
                    <CardTitle>Active Security Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {securityResults.features.map((feature: any) => (
                      <div key={feature.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{feature.name}</h4>
                            <p className="text-sm text-gray-400">Implementation: {feature.implementation}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="ff-badge-success">Active</Badge>
                          <div className="flex flex-wrap gap-1">
                            {feature.compliance?.slice(0, 2).map((comp: string) => (
                              <Badge key={comp} variant="outline" className="text-xs">
                                {comp}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {securityResults.certifications.length > 0 && (
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle>Compliance Certifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {securityResults.certifications.map((cert: any) => (
                        <div key={cert.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border">
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl">{cert.icon}</div>
                            <div>
                              <h4 className="font-semibold">{cert.name}</h4>
                              <p className="text-sm text-gray-400">{cert.description}</p>
                              <div className="mt-2">
                                <div className="flex items-center space-x-2">
                                  <div className="w-32 bg-gray-700 rounded-full h-2">
                                    <div 
                                      className="bg-blue-500 h-2 rounded-full"
                                      style={{ width: `${cert.completion}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-gray-400">{cert.completion}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Badge className="ff-badge-secondary">In Progress</Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                <Tabs defaultValue="monitoring" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                    <TabsTrigger value="alerts">Alerts</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="monitoring" className="space-y-4">
                    <Card className="ff-card">
                      <CardContent className="p-6">
                        <h4 className="ff-text-title mb-4">Real-Time Security Monitoring</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <div>
                              <div className="font-medium text-sm">Threat Detection</div>
                              <div className="text-xs text-gray-400">AI-powered threat analysis</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-sm text-green-500">Active</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <div>
                              <div className="font-medium text-sm">Access Monitoring</div>
                              <div className="text-xs text-gray-400">User activity tracking</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-sm text-green-500">Active</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <div>
                              <div className="font-medium text-sm">Data Protection</div>
                              <div className="text-xs text-gray-400">Encryption and DLP</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-sm text-green-500">Active</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="reports" className="space-y-4">
                    <Card className="ff-card">
                      <CardContent className="p-6">
                        <h4 className="ff-text-title mb-4">Security Reports</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <div>
                              <div className="font-medium text-sm">Daily Security Report</div>
                              <div className="text-xs text-gray-400">Generated automatically</div>
                            </div>
                            <Button size="sm" variant="outline">Download</Button>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <div>
                              <div className="font-medium text-sm">Compliance Audit Report</div>
                              <div className="text-xs text-gray-400">Weekly compliance status</div>
                            </div>
                            <Button size="sm" variant="outline">Download</Button>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <div>
                              <div className="font-medium text-sm">Vulnerability Assessment</div>
                              <div className="text-xs text-gray-400">Monthly security scan</div>
                            </div>
                            <Button size="sm" variant="outline">Download</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="alerts" className="space-y-4">
                    <Card className="ff-card">
                      <CardContent className="p-6">
                        <h4 className="ff-text-title mb-4">Security Alerts</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <div>
                              <div className="font-medium text-sm text-green-500">All Systems Secure</div>
                              <div className="text-xs text-green-400">No active security threats detected</div>
                            </div>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <div>
                              <div className="font-medium text-sm text-blue-500">Security Update Available</div>
                              <div className="text-xs text-blue-400">New security patches ready for installation</div>
                            </div>
                            <Button size="sm" className="ff-btn-primary">Update</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedFeatures([]);
                  setSecurityScore(0);
                  setSetupProgress(0);
                  setSecurityResults(null);
                }}
                className="ff-btn-outline"
              >
                Configure Another
              </Button>
              <Button 
                onClick={onComplete}
                className="ff-btn-primary ff-btn-lg"
              >
                Continue to Analytics
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Progress indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step <= currentStep 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-400'
            }`}>
              {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
            </div>
            {step < 4 && (
              <div className={`w-16 h-1 mx-2 ${
                step < currentStep ? 'bg-blue-600' : 'bg-gray-700'
              }`} />
            )}
          </div>
        ))}
      </div>

      {renderStepContent()}
    </div>
  );
}