import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, Star, Users, Crown, Zap } from 'lucide-react';
import { PageType, UserRole } from '../../types';

interface ToolDetailPageProps {
  toolId: string;
  setCurrentPage: (page: PageType) => void;
  userRole?: UserRole;
  onToolUse: (toolId: string) => void;
}

export function ToolDetailPage({ toolId, setCurrentPage, userRole = 'free', onToolUse }: ToolDetailPageProps) {
  // Mock tool data - in real app, fetch by toolId
  const tool = {
    id: toolId,
    name: 'React Component Generator',
    description: 'Generate React components with TypeScript and Tailwind CSS',
    longDescription: 'This powerful AI tool helps you create production-ready React components with TypeScript support, Tailwind CSS styling, and best practices built-in. Perfect for rapid prototyping and maintaining consistent code quality across your projects.',
    category: 'code',
    icon: '⚛️',
    isPremium: false,
    difficulty: 'beginner',
    rating: 4.8,
    usage: 1250,
    tags: ['React', 'TypeScript', 'Components', 'Tailwind'],
    features: [
      'TypeScript support out of the box',
      'Tailwind CSS integration',
      'Responsive design patterns',
      'Accessibility best practices',
      'Component documentation generation',
      'Props interface generation'
    ],
    examples: [
      {
        title: 'Button Component',
        description: 'Generate a customizable button with variants',
        code: `interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ variant, size, children }: ButtonProps) {
  return (
    <button className={\`btn btn-\${variant} btn-\${size}\`}>
      {children}
    </button>
  );
}`
      }
    ]
  };

  const handleUseTool = () => {
    if (tool.isPremium && userRole === 'free') {
      // Show upgrade modal
      return;
    }
    onToolUse(tool.id);
    // Navigate to code generator or open tool interface
    setCurrentPage('generator');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => setCurrentPage('tools')}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Tools
      </Button>

      {/* Tool Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="text-6xl mb-4">{tool.icon}</div>
        <h1 className="text-3xl font-bold ff-text-gradient mb-2">
          {tool.name}
          {tool.isPremium && (
            <Crown className="w-6 h-6 text-yellow-500 inline ml-2" />
          )}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {tool.longDescription}
        </p>
        
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            <span className="font-medium">{tool.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-5 h-5 text-muted-foreground" />
            <span>{tool.usage} uses</span>
          </div>
          <Badge variant="secondary" className="text-sm">
            {tool.difficulty}
          </Badge>
        </div>
      </motion.div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <Button 
          onClick={handleUseTool}
          className={`text-lg px-8 py-3 ${
            tool.isPremium && userRole === 'free' 
              ? 'ff-btn-accent' 
              : 'ff-btn-primary'
          }`}
          disabled={tool.isPremium && userRole === 'free'}
        >
          <Zap className="w-5 h-5 mr-2" />
          {tool.isPremium && userRole === 'free' ? 'Upgrade to Use' : 'Use This Tool'}
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Features */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {tool.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Example */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Example Output</CardTitle>
            </CardHeader>
            <CardContent>
              {tool.examples.map((example, index) => (
                <div key={index} className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">{example.title}</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {example.description}
                    </p>
                  </div>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{example.code}</code>
                  </pre>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tool.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="capitalize">
                {tool.category}
              </Badge>
            </CardContent>
          </Card>

          {/* Usage Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Uses</span>
                <span className="font-medium">{tool.usage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Average Rating</span>
                <span className="font-medium">{tool.rating}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Difficulty</span>
                <span className="font-medium capitalize">{tool.difficulty}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}