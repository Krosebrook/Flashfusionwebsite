import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  FileText, 
  Download, 
  Loader2, 
  CheckCircle, 
  Copy,
  Share2,
  Eye,
  Edit3,
  Image,
  Video,
  Mic
} from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface ContentResult {
  generationId: string;
  content: string;
  contentType: string;
  wordCount: number;
}

function ContentCreationHub() {
  const [formData, setFormData] = useState({
    contentType: '',
    prompt: '',
    style: '',
    length: 'medium'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ContentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const contentTypes = [
    { value: 'blog-post', label: 'Blog Post', icon: FileText, description: 'Long-form articles and blog content' },
    { value: 'social-media', label: 'Social Media', icon: Share2, description: 'Posts for Twitter, LinkedIn, Instagram' },
    { value: 'product-description', label: 'Product Description', icon: Edit3, description: 'E-commerce product descriptions' },
    { value: 'email-campaign', label: 'Email Campaign', icon: Edit3, description: 'Marketing emails and newsletters' },
    { value: 'landing-page', label: 'Landing Page', icon: FileText, description: 'Sales pages and landing content' }
  ];

  const styles = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'creative', label: 'Creative' },
    { value: 'technical', label: 'Technical' },
    { value: 'persuasive', label: 'Persuasive' },
    { value: 'informative', label: 'Informative' }
  ];

  const lengths = [
    { value: 'short', label: 'Short (300-500 words)' },
    { value: 'medium', label: 'Medium (500-1000 words)' },
    { value: 'long', label: 'Long (1000-2000 words)' }
  ];

  const handleGenerate = async () => {
    if (!formData.contentType || !formData.prompt) {
      setError('Please select content type and provide a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem('ff-auth-token');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-88829a40/generate/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken || publicAnonKey}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Content generation failed');
      }

      const result = await response.json();
      setResult(result);
    } catch (error) {
      console.error('Content generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!result?.content) return;
    
    try {
      await navigator.clipboard.writeText(result.content);
      // Show success feedback
    } catch (error) {
      console.error('Copy error:', error);
    }
  };

  const handleDownload = () => {
    if (!result?.content) return;

    const blob = new Blob([result.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formData.contentType}-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold ff-text-gradient">AI Content Creation Hub</h1>
        <p className="text-lg text-muted-foreground">
          Generate high-quality content with AI-powered writing tools
        </p>
      </div>

      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generator">Content Generator</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="assets">Media Assets</TabsTrigger>
          <TabsTrigger value="analytics">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Content Configuration */}
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Content Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Content Type</Label>
                  <div className="grid gap-3">
                    {contentTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <div
                          key={type.value}
                          onClick={() => setFormData(prev => ({ ...prev, contentType: type.value }))}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            formData.contentType === type.value
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <IconComponent className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <h4 className="font-medium">{type.label}</h4>
                              <p className="text-sm text-muted-foreground">{type.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt">Content Prompt</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe what you want to create..."
                    value={formData.prompt}
                    onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                    className="ff-focus-ring"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Writing Style</Label>
                    <Select value={formData.style} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, style: value }))
                    }>
                      <SelectTrigger className="ff-focus-ring">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        {styles.map((style) => (
                          <SelectItem key={style.value} value={style.value}>
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Content Length</Label>
                    <Select value={formData.length} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, length: value }))
                    }>
                      <SelectTrigger className="ff-focus-ring">
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        {lengths.map((length) => (
                          <SelectItem key={length.value} value={length.value}>
                            {length.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                    {error}
                  </div>
                )}

                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !formData.contentType || !formData.prompt}
                  className="w-full ff-btn-primary"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Generating Content...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Content */}
            <Card className={`${result ? 'ff-card-interactive' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {result ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  )}
                  Generated Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!result && !isGenerating && (
                  <div className="text-center text-muted-foreground py-8">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Configure your content and click generate to see the results</p>
                  </div>
                )}

                {isGenerating && (
                  <div className="text-center py-8">
                    <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
                    <p className="text-muted-foreground">Creating your content...</p>
                    <div className="mt-4 space-y-2">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary ff-progress-bar"></div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Generating {formData.contentType} in {formData.style} style
                      </p>
                    </div>
                  </div>
                )}

                {result && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{formData.contentType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                        <p className="text-sm text-muted-foreground">
                          {result.wordCount} words • {formData.style} style
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Ready
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={handleCopy}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleDownload}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Generated Content</Label>
                      <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                        <div className="whitespace-pre-wrap text-sm">
                          {result.content}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground text-center">
                      Content generated by FlashFusion AI. Review and edit as needed.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Product Launch', type: 'blog-post', category: 'Marketing' },
              { name: 'How-to Guide', type: 'blog-post', category: 'Educational' },
              { name: 'Social Announcement', type: 'social-media', category: 'Social' },
              { name: 'Newsletter', type: 'email-campaign', category: 'Email' },
              { name: 'Sales Page', type: 'landing-page', category: 'Sales' },
              { name: 'Feature Description', type: 'product-description', category: 'Product' }
            ].map((template) => (
              <Card key={template.name} className="ff-card-interactive cursor-pointer">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                      <FileText className="h-12 w-12 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.category}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {template.type.replace('-', ' ')}
                    </Badge>
                    <Button size="sm" className="w-full">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assets" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'AI Image Generator', icon: Image, description: 'Generate custom images for your content' },
              { name: 'Video Creator', icon: Video, description: 'Create promotional videos and animations' },
              { name: 'Voice Generator', icon: Mic, description: 'Convert text to speech for audio content' }
            ].map((asset) => {
              const IconComponent = asset.icon;
              return (
                <Card key={asset.name} className="ff-card-interactive">
                  <CardContent className="p-6 text-center">
                    <IconComponent className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">{asset.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{asset.description}</p>
                    <Button size="sm" className="w-full">
                      Generate
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Content Generated', value: '156', change: '+12%' },
              { label: 'Words Written', value: '45.2K', change: '+25%' },
              { label: 'Templates Used', value: '23', change: '+8%' },
              { label: 'Downloads', value: '89', change: '+15%' }
            ].map((metric) => (
              <Card key={metric.label}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {metric.change}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Named export for internal use
export { ContentCreationHub };

// Default export for lazy loading
export default ContentCreationHub;