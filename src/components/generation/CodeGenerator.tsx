import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Download, Code, Loader2, CheckCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface GenerationResult {
  generationId: string;
  files: Record<string, string>;
  downloadUrl: string;
  fileName: string;
}

function CodeGenerator() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    framework: '',
    features: [] as string[]
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const frameworks = [
    { value: 'react', label: 'React' },
    { value: 'nextjs', label: 'Next.js' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' }
  ];

  const availableFeatures = [
    'authentication',
    'database',
    'api',
    'routing',
    'state-management',
    'testing',
    'deployment',
    'responsive-design'
  ];

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleGenerate = async () => {
    if (!formData.name || !formData.framework) {
      setError('Please provide a project name and select a framework');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem('ff-auth-token');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-88829a40/generate/code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken || publicAnonKey}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const result = await response.json();
      setResult(result);
      
      // Show success animation
      const element = document.querySelector('.generation-result');
      if (element) {
        element.classList.add('ff-scale-pop');
      }
    } catch (error) {
      console.error('Generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate code');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!result?.downloadUrl) return;

    try {
      // Track download
      const link = document.createElement('a');
      link.href = result.downloadUrl;
      link.download = result.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      setError('Failed to download files');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold ff-text-gradient">AI Code Generator</h1>
        <p className="text-lg text-muted-foreground">
          Generate production-ready applications with AI-powered code generation
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Generation Form */}
        <Card className="ff-card-interactive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              Project Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                placeholder="My Awesome App"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="ff-focus-ring"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="A modern web application that..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="ff-focus-ring"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Framework</Label>
              <Select value={formData.framework} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, framework: value }))
              }>
                <SelectTrigger className="ff-focus-ring">
                  <SelectValue placeholder="Select a framework" />
                </SelectTrigger>
                <SelectContent>
                  {frameworks.map((framework) => (
                    <SelectItem key={framework.value} value={framework.value}>
                      {framework.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Features</Label>
              <div className="grid grid-cols-2 gap-3">
                {availableFeatures.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={formData.features.includes(feature)}
                      onCheckedChange={() => handleFeatureToggle(feature)}
                    />
                    <Label 
                      htmlFor={feature} 
                      className="text-sm capitalize cursor-pointer"
                    >
                      {feature.replace('-', ' ')}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !formData.name || !formData.framework}
              className="w-full ff-btn-primary"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Generating Code...
                </>
              ) : (
                <>
                  <Code className="h-4 w-4 mr-2" />
                  Generate Application
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generation Result */}
        <Card className={`generation-result ${result ? 'ff-card-interactive' : ''}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Download className="h-5 w-5 text-muted-foreground" />
              )}
              Generated Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!result && !isGenerating && (
              <div className="text-center text-muted-foreground py-8">
                <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Configure your project and click generate to see the results</p>
              </div>
            )}

            {isGenerating && (
              <div className="text-center py-8">
                <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
                <p className="text-muted-foreground">Generating your application...</p>
                <div className="mt-4 space-y-2">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary ff-progress-bar"></div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Creating {formData.framework} application with {formData.features.length} features
                  </p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{formData.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {Object.keys(result.files).length} files generated
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Ready
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label>Generated Features</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Project Files</Label>
                  <div className="bg-muted/50 rounded-lg p-3 max-h-40 overflow-y-auto">
                    {Object.keys(result.files).map((fileName) => (
                      <div key={fileName} className="text-sm font-mono py-1">
                        📄 {fileName}
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleDownload}
                  className="w-full ff-btn-secondary"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Project ({result.fileName})
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  Your generated project includes all necessary files, dependencies, 
                  and configuration for immediate development.
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Named export for internal use
export { CodeGenerator };

// Default export for lazy loading
export default CodeGenerator;