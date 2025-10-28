import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { 
  Palette, 
  Type, 
  Download, 
  Copy, 
  RefreshCw,
  Sparkles,
  Eye,
  Heart,
  Share2,
  Settings,
  Zap,
  Image,
  Crown,
  Target,
  Lightbulb,
  Wand2,
  CheckCircle,
  Star,
  Layers,
  Grid,
  Smile,
  Briefcase,
  Globe,
  Camera,
  PaintBucket
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BrandKit {
  id: string;
  name: string;
  description: string;
  industry: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    primary: string;
    secondary: string;
    display: string;
  };
  tone: {
    personality: string[];
    voice: string;
    style: string;
  };
  logos: {
    main: string;
    icon: string;
    wordmark: string;
  };
  templates: string[];
}

interface BrandInputData {
  businessName: string;
  industry: string;
  targetAudience: string;
  brandPersonality: string[];
  description: string;
  competitors: string;
  goals: string;
}

export function BrandKitGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [brandData, setBrandData] = useState<BrandInputData>({
    businessName: '',
    industry: '',
    targetAudience: '',
    brandPersonality: [],
    description: '',
    competitors: '',
    goals: ''
  });
  const [generatedBrandKit, setGeneratedBrandKit] = useState<BrandKit | null>(null);
  const [activeTab, setActiveTab] = useState('input');

  const industries = [
    'E-commerce & Retail',
    'Technology & Software',
    'Health & Wellness',
    'Food & Beverage',
    'Fashion & Beauty',
    'Creative Services',
    'Professional Services',
    'Education & Training',
    'Real Estate',
    'Finance & Insurance',
    'Travel & Hospitality',
    'Non-profit & Social'
  ];

  const personalityTraits = [
    'Professional', 'Friendly', 'Innovative', 'Trustworthy', 'Creative',
    'Bold', 'Elegant', 'Playful', 'Sophisticated', 'Authentic',
    'Energetic', 'Reliable', 'Inspiring', 'Approachable', 'Premium'
  ];

  const colorPalettes = [
    {
      name: 'Modern Tech',
      colors: { primary: '#2563eb', secondary: '#0ea5e9', accent: '#06b6d4', background: '#f8fafc', text: '#1e293b' }
    },
    {
      name: 'Natural Organic',
      colors: { primary: '#16a34a', secondary: '#84cc16', accent: '#65a30d', background: '#f7fee7', text: '#365314' }
    },
    {
      name: 'Creative Studio',
      colors: { primary: '#dc2626', secondary: '#ea580c', accent: '#d97706', background: '#fef2f2', text: '#7f1d1d' }
    },
    {
      name: 'Luxury Premium',
      colors: { primary: '#7c3aed', secondary: '#a855f7', accent: '#c084fc', background: '#faf5ff', text: '#581c87' }
    }
  ];

  const handleGenerate = async () => {
    if (!brandData.businessName || !brandData.industry) {
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setActiveTab('results');

    // Simulate AI generation with progress
    const progressSteps = [
      { step: 15, message: 'Analyzing brand requirements...' },
      { step: 30, message: 'Researching industry trends...' },
      { step: 45, message: 'Generating color palettes...' },
      { step: 60, message: 'Selecting typography...' },
      { step: 75, message: 'Creating brand voice...' },
      { step: 90, message: 'Designing logo concepts...' },
      { step: 100, message: 'Finalizing brand kit...' }
    ];

    for (const { step } of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setGenerationProgress(step);
    }

    // Generate sample brand kit
    const selectedPalette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
    
    const brandKit: BrandKit = {
      id: Date.now().toString(),
      name: brandData.businessName,
      description: brandData.description || `A modern ${brandData.industry.toLowerCase()} brand focused on ${brandData.targetAudience.toLowerCase()}`,
      industry: brandData.industry,
      colors: selectedPalette.colors,
      fonts: {
        primary: 'Inter',
        secondary: 'Open Sans',
        display: 'Poppins'
      },
      tone: {
        personality: brandData.brandPersonality,
        voice: brandData.brandPersonality.includes('Professional') ? 'Professional and authoritative' : 
               brandData.brandPersonality.includes('Friendly') ? 'Warm and approachable' :
               'Confident and engaging',
        style: brandData.brandPersonality.includes('Bold') ? 'Direct and impactful' :
               brandData.brandPersonality.includes('Elegant') ? 'Refined and sophisticated' :
               'Clear and conversational'
      },
      logos: {
        main: 'Logo with symbol and text',
        icon: 'Symbol only',
        wordmark: 'Text only'
      },
      templates: [
        'Business Card Template',
        'Social Media Template',
        'Email Signature Template',
        'Letterhead Template',
        'Invoice Template'
      ]
    };

    setGeneratedBrandKit(brandKit);
    setIsGenerating(false);
  };

  const handlePersonalityToggle = (trait: string) => {
    setBrandData(prev => ({
      ...prev,
      brandPersonality: prev.brandPersonality.includes(trait)
        ? prev.brandPersonality.filter(p => p !== trait)
        : [...prev.brandPersonality, trait]
    }));
  };

  const downloadBrandKit = () => {
    // Simulate download
    console.log('Downloading brand kit...');
  };

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-2">
          <Palette className="w-8 h-8 text-primary" />
          <h1 className="ff-text-gradient">AI Brand Kit Generator</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create a complete brand identity with AI-generated logos, color palettes, typography, and brand guidelines
        </p>
      </motion.div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="input">Brand Input</TabsTrigger>
          <TabsTrigger value="results">Generated Kit</TabsTrigger>
          <TabsTrigger value="customize">Customize</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Input Tab */}
        <TabsContent value="input" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <span>Business Information</span>
                </CardTitle>
                <CardDescription>
                  Tell us about your business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Business Name</label>
                  <Input
                    placeholder="Your business name"
                    value={brandData.businessName}
                    onChange={(e) => setBrandData(prev => ({ ...prev, businessName: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Industry</label>
                  <Select value={brandData.industry} onValueChange={(value) => 
                    setBrandData(prev => ({ ...prev, industry: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Target Audience</label>
                  <Input
                    placeholder="e.g., young professionals, creative entrepreneurs"
                    value={brandData.targetAudience}
                    onChange={(e) => setBrandData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Business Description</label>
                  <Textarea
                    placeholder="Describe what your business does and what makes it unique"
                    value={brandData.description}
                    onChange={(e) => setBrandData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smile className="w-5 h-5 text-secondary" />
                  <span>Brand Personality</span>
                </CardTitle>
                <CardDescription>
                  Select traits that describe your brand
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {personalityTraits.map(trait => (
                    <button
                      key={trait}
                      onClick={() => handlePersonalityToggle(trait)}
                      className={`p-2 text-xs border rounded-md transition-colors ${
                        brandData.brandPersonality.includes(trait)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {trait}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Competitors (Optional)</label>
                  <Input
                    placeholder="e.g., Apple, Nike, Airbnb"
                    value={brandData.competitors}
                    onChange={(e) => setBrandData(prev => ({ ...prev, competitors: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Brand Goals</label>
                  <Textarea
                    placeholder="What do you want your brand to achieve?"
                    value={brandData.goals}
                    onChange={(e) => setBrandData(prev => ({ ...prev, goals: e.target.value }))}
                    rows={2}
                  />
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={!brandData.businessName || !brandData.industry || isGenerating}
                  className="w-full ff-btn-primary mt-6"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Wand2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Brand Kit...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Brand Kit
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Wand2 className="w-5 h-5 text-primary animate-spin" />
                        <span className="font-medium">Creating Your Brand Kit</span>
                      </div>
                      <Progress value={generationProgress} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        AI is analyzing your business and creating a custom brand identity...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {generatedBrandKit && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Brand Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Crown className="w-5 h-5 text-primary" />
                        <span>{generatedBrandKit.name} Brand Kit</span>
                      </CardTitle>
                      <CardDescription>{generatedBrandKit.description}</CardDescription>
                    </div>
                    <Button onClick={downloadBrandKit} className="ff-btn-primary">
                      <Download className="w-4 h-4 mr-2" />
                      Download Kit
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {/* Color Palette */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PaintBucket className="w-5 h-5 text-primary" />
                    <span>Color Palette</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-4">
                    {Object.entries(generatedBrandKit.colors).map(([name, color]) => (
                      <motion.div
                        key={name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-2"
                      >
                        <div 
                          className="w-full h-20 rounded-lg border cursor-pointer group relative overflow-hidden"
                          style={{ backgroundColor: color }}
                          onClick={() => copyColor(color)}
                        >
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <Copy className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium capitalize">{name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{color}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Typography */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Type className="w-5 h-5 text-secondary" />
                    <span>Typography</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(generatedBrandKit.fonts).map(([type, font]) => (
                      <div key={type} className="space-y-3">
                        <div>
                          <h4 className="font-medium capitalize">{type} Font</h4>
                          <p className="text-sm text-muted-foreground">{font}</p>
                        </div>
                        <div 
                          className="p-4 border rounded-lg"
                          style={{ fontFamily: font }}
                        >
                          <h3 className="text-xl font-bold mb-2">{generatedBrandKit.name}</h3>
                          <p className="text-sm">The quick brown fox jumps over the lazy dog</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Brand Voice & Tone */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5 text-accent" />
                    <span>Brand Voice & Tone</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Personality Traits</h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedBrandKit.tone.personality.map(trait => (
                          <Badge key={trait} variant="outline">{trait}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Voice</h4>
                      <p className="text-sm text-muted-foreground">{generatedBrandKit.tone.voice}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Communication Style</h4>
                      <p className="text-sm text-muted-foreground">{generatedBrandKit.tone.style}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Logo Concepts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span>Logo Concepts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(generatedBrandKit.logos).map(([type, description]) => (
                      <div key={type} className="space-y-3">
                        <div className="h-32 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                          <div className="text-center space-y-2">
                            <Layers className="w-8 h-8 text-muted-foreground mx-auto" />
                            <p className="text-sm text-muted-foreground capitalize">{type} Logo</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <h4 className="font-medium capitalize">{type}</h4>
                          <p className="text-xs text-muted-foreground">{description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <Button className="ff-btn-secondary">
                      <Camera className="w-4 h-4 mr-2" />
                      Generate Logo Designs
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Templates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Grid className="w-5 h-5 text-green-500" />
                    <span>Brand Templates</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {generatedBrandKit.templates.map((template, index) => (
                      <motion.div
                        key={template}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border rounded-lg text-center space-y-2 ff-card-interactive"
                      >
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                          <Type className="w-4 h-4 text-primary" />
                        </div>
                        <p className="text-sm font-medium">{template}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        {/* Customize Tab */}
        <TabsContent value="customize" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-primary" />
                  <span>Customize Your Brand Kit</span>
                </CardTitle>
                <CardDescription>
                  Fine-tune colors, fonts, and styles to match your vision
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-12">
                  <Wand2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Customization Tools</h3>
                  <p className="text-muted-foreground">
                    Advanced customization features coming soon. Fine-tune every aspect of your brand.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Grid className="w-5 h-5 text-primary" />
                  <span>Brand Asset Templates</span>
                </CardTitle>
                <CardDescription>
                  Download ready-to-use templates with your brand applied
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-12">
                  <Download className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Template Library</h3>
                  <p className="text-muted-foreground">
                    Branded templates for business cards, social media, and more are being prepared.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}