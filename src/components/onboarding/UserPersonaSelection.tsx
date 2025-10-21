import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface UserPersona {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  primaryTools: string[];
  experience: 'beginner' | 'intermediate' | 'advanced';
  timeToValue: string;
}

const USER_PERSONAS: UserPersona[] = [
  {
    id: 'solo-developer',
    title: 'Solo Developer',
    description: 'Independent developer building personal projects or client work',
    icon: '👨‍💻',
    features: [
      'Code generation and optimization',
      'Full-stack app building',
      'Deployment automation',
      'AI debugging assistance'
    ],
    primaryTools: [
      'Full-Stack Builder',
      'Code Generator', 
      'Deployment Manager',
      'Performance Optimizer'
    ],
    experience: 'intermediate',
    timeToValue: '5 minutes'
  },
  {
    id: 'content-creator',
    title: 'Content Creator',
    description: 'Creator building audience through engaging content across platforms',
    icon: '🎨',
    features: [
      'Multi-platform content generation',
      'Brand voice consistency',
      'Social media automation',
      'Monetization tools'
    ],
    primaryTools: [
      'Creator Content Pipeline',
      'Brand Kit Generator',
      'Social Media Manager',
      'Creator Commerce Hub'
    ],
    experience: 'beginner',
    timeToValue: '2 minutes'
  },
  {
    id: 'startup-team',
    title: 'Startup Team',
    description: 'Small team building MVP and scaling quickly',
    icon: '🚀',
    features: [
      'Real-time collaboration',
      'Multi-agent workflows',
      'Rapid prototyping',
      'Team coordination'
    ],
    primaryTools: [
      'Multi-Agent Orchestration',
      'Team Collaboration',
      'Project Manager',
      'Analytics Dashboard'
    ],
    experience: 'advanced',
    timeToValue: '10 minutes'
  },
  {
    id: 'agency-team',
    title: 'Creative Agency',
    description: 'Agency team managing multiple client projects simultaneously',
    icon: '🎯',
    features: [
      'Client project management',
      'White-label solutions',
      'Bulk content generation',
      'Team workflow automation'
    ],
    primaryTools: [
      'Multi-Project Orchestrator',
      'Client Portal',
      'Bulk Export Manager',
      'Team Dashboard'
    ],
    experience: 'advanced',
    timeToValue: '15 minutes'
  },
  {
    id: 'enterprise-developer',
    title: 'Enterprise Developer',
    description: 'Developer in large organization with compliance and scale requirements',
    icon: '🏢',
    features: [
      'Enterprise security',
      'Compliance monitoring',
      'Advanced analytics',
      'Custom integrations'
    ],
    primaryTools: [
      'Security Compliance Monitor',
      'Enterprise Analytics',
      'Custom Integration Hub',
      'Audit Dashboard'
    ],
    experience: 'advanced',
    timeToValue: '20 minutes'
  }
];

interface UserPersonaSelectionProps {
  onPersonaSelect: (persona: UserPersona) => void;
  onSkip: () => void;
}

export function UserPersonaSelection({ onPersonaSelect, onSkip }: UserPersonaSelectionProps) {
  const [selectedPersona, setSelectedPersona] = useState<UserPersona | null>(null);

  const handleContinue = () => {
    if (selectedPersona) {
      onPersonaSelect(selectedPersona);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center space-y-6 mb-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold ff-text-gradient">
              Welcome to FlashFusion
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Let's personalize your AI development experience. Choose the profile that best describes you to get started with the most relevant tools.
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              60+ AI Tools
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-secondary rounded-full"></span>
              Multi-Agent Workflows
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-accent rounded-full"></span>
              One-Click Deployment
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {USER_PERSONAS.map((persona) => (
            <Card
              key={persona.id}
              className={`ff-card-interactive cursor-pointer transition-all duration-300 ${
                selectedPersona?.id === persona.id
                  ? 'ring-2 ring-primary bg-primary/5 border-primary/20'
                  : 'hover:border-primary/40'
              }`}
              onClick={() => setSelectedPersona(persona)}
            >
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-3">{persona.icon}</div>
                <CardTitle className="text-xl mb-2">{persona.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {persona.description}
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge 
                    variant={persona.experience === 'beginner' ? 'default' : 
                            persona.experience === 'intermediate' ? 'secondary' : 'destructive'}
                    className="text-xs"
                  >
                    {persona.experience}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {persona.timeToValue}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-foreground">Key Features:</h4>
                  <ul className="space-y-1">
                    {persona.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-foreground">Primary Tools:</h4>
                  <div className="flex flex-wrap gap-1">
                    {persona.primaryTools.slice(0, 3).map((tool, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tool}
                      </Badge>
                    ))}
                    {persona.primaryTools.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{persona.primaryTools.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            onClick={onSkip}
            className="px-8"
          >
            Skip for now
          </Button>
          
          <Button
            onClick={handleContinue}
            disabled={!selectedPersona}
            className="ff-btn-primary px-8"
          >
            Continue with {selectedPersona?.title || 'Selection'}
          </Button>
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            Don't worry, you can always change your preferences later in Settings
          </p>
        </div>
      </div>
    </div>
  );
}

export type { UserPersona };
export { USER_PERSONAS };