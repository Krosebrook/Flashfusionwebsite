/**
 * @fileoverview Demo Navigation Component - Quick Access to Component Demos
 * @chunk ui
 * @category demo
 * @version 1.0.0
 * @author FlashFusion Team
 * 
 * Quick navigation component for accessing various component demos
 * and interactive showcases within the FlashFusion platform.
 */

import React from 'react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { 
  Crown,
  HelpCircle,
  Play,
  ExternalLink,
  Sparkles,
  Code,
  Eye
} from 'lucide-react';

interface DemoNavigationProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export function DemoNavigation({ currentPath, onNavigate }: DemoNavigationProps) {
  const demos = [
    {
      id: 'pricing-faq-demo',
      title: 'Pricing & FAQ Dropdowns',
      description: 'Interactive pricing cards with dropdown menus and collapsible FAQ sections',
      icon: <Crown className="w-5 h-5" />,
      path: '/pricing-faq-demo',
      tags: ['Dropdown', 'Pricing', 'FAQ'],
      featured: true
    },
    {
      id: 'launch-readiness-demo',
      title: 'Launch Readiness',
      description: 'Platform readiness assessment and launch preparation checklist',
      icon: <Sparkles className="w-5 h-5" />,
      path: '/launch-readiness-demo',
      tags: ['Launch', 'Assessment'],
      featured: false
    }
  ];

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      // Fallback to hash navigation
      window.location.hash = path;
    }
  };

  return (
    <Card className="ff-card">
      <CardHeader>
        <CardTitle className="ff-text-title flex items-center gap-2">
          <Play className="w-5 h-5 text-[var(--ff-primary)]" />
          Component Demos
        </CardTitle>
        <CardDescription className="ff-text-caption">
          Interactive showcases of FlashFusion UI components and features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demos.map((demo) => (
            <Card 
              key={demo.id} 
              className={`ff-card-interactive cursor-pointer transition-all duration-300 ${
                currentPath?.includes(demo.id) ? 'ring-2 ring-[var(--ff-primary)] ring-opacity-50' : ''
              }`}
              onClick={() => handleNavigate(demo.path)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[var(--ff-primary)] to-[var(--ff-secondary)] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    {demo.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="ff-text-title text-[var(--ff-text-primary)] text-sm">
                        {demo.title}
                      </h3>
                      {demo.featured && (
                        <Badge className="ff-badge-primary">
                          <Sparkles className="w-3 h-3 mr-1" />
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-[var(--ff-text-muted)] ff-text-caption line-clamp-2">
                      {demo.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {demo.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs border-[var(--border)] text-[var(--ff-text-muted)]"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-[var(--ff-primary)] hover:bg-[var(--ff-primary)]/10 p-1 h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigate(demo.path);
                    }}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-[var(--ff-surface-light)] rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-[var(--ff-secondary)]" />
            <span className="ff-text-caption text-[var(--ff-text-primary)] font-semibold">
              Demo Features
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[var(--ff-text-muted)]">
            <div className="flex items-center gap-1">
              <Code className="w-3 h-3" />
              <span>Live Code</span>
            </div>
            <div className="flex items-center gap-1">
              <Play className="w-3 h-3" />
              <span>Interactive</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Real Components</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DemoNavigation;