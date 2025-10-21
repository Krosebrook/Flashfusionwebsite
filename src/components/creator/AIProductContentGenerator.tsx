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
  Sparkles, 
  Wand2, 
  Copy, 
  RefreshCw, 
  Download, 
  Upload,
  CheckCircle,
  AlertCircle,
  Zap,
  Target,
  Palette,
  Image,
  Type,
  Hash,
  DollarSign,
  Globe,
  TrendingUp,
  Settings,
  Save,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GeneratedContent {
  id: string;
  type: 'title' | 'description' | 'tags' | 'price' | 'features';
  content: string;
  confidence: number;
  platform?: string;
}

interface ProductData {
  category: string;
  targetAudience: string;
  keywords: string;
  priceRange: string;
  brand: string;
  features: string[];
}

export function AIProductContentGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [productData, setProductData] = useState<ProductData>({
    category: '',
    targetAudience: '',
    keywords: '',
    priceRange: '',
    brand: '',
    features: []
  });
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('input');

  const platforms = [
    { id: 'shopify', name: 'Shopify', icon: '🛍️', color: 'bg-green-500' },
    { id: 'etsy', name: 'Etsy', icon: '🎨', color: 'bg-orange-500' },
    { id: 'tiktok', name: 'TikTok Shop', icon: '🎵', color: 'bg-black' },
    { id: 'ebay', name: 'eBay', icon: '🏪', color: 'bg-blue-500' },
    { id: 'amazon', name: 'Amazon', icon: '📦', color: 'bg-yellow-500' },
    { id: 'facebook', name: 'Facebook Shop', icon: '📘', color: 'bg-blue-600' }
  ];

  const categories = [
    'Fashion & Apparel',
    'Home & Garden',
    'Electronics',
    'Health & Beauty',
    'Sports & Outdoors',
    'Arts & Crafts',
    'Jewelry & Accessories',
    'Pet Supplies',
    'Toys & Games',
    'Books & Media'
  ];

  const handleGenerate = async () => {
    if (!productData.category || !productData.targetAudience) {
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setActiveTab('results');

    // Simulate AI generation with progress
    const progressSteps = [
      { step: 20, message: 'Analyzing product category...' },
      { step: 40, message: 'Researching target audience...' },
      { step: 60, message: 'Generating titles...' },
      { step: 80, message: 'Creating descriptions...' },
      { step: 100, message: 'Optimizing for platforms...' }
    ];

    for (const { step } of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setGenerationProgress(step);
    }

    // Generate sample content
    const content: GeneratedContent[] = [
      {
        id: '1',
        type: 'title',
        content: `Premium ${productData.category} - Perfect for ${productData.targetAudience}`,
        confidence: 94,
        platform: 'universal'
      },
      {
        id: '2',
        type: 'title',
        content: `Eco-Friendly ${productData.category} Collection | Sustainable & Stylish`,
        confidence: 88,
        platform: 'etsy'
      },
      {
        id: '3',
        type: 'title',
        content: `🔥 Trending ${productData.category} - Limited Time Offer!`,
        confidence: 91,
        platform: 'tiktok'
      },
      {
        id: '4',
        type: 'description',
        content: `Discover our carefully curated ${productData.category.toLowerCase()} designed specifically for ${productData.targetAudience.toLowerCase()}. Made with premium materials and attention to detail, this product combines functionality with style. Perfect for everyday use or special occasions. ${productData.keywords ? `Features: ${productData.keywords}` : ''}`,
        confidence: 92,
        platform: 'shopify'
      },
      {
        id: '5',
        type: 'description',
        content: `Handcrafted with love! ✨ This unique ${productData.category.toLowerCase()} is perfect for anyone who appreciates quality and authenticity. Each piece tells a story and brings joy to your daily routine. Support small business and treat yourself to something special! #handmade #unique #supportsmall`,
        confidence: 87,
        platform: 'etsy'
      },
      {
        id: '6',
        type: 'tags',
        content: `${productData.category.toLowerCase()}, ${productData.targetAudience.toLowerCase()}, premium quality, trending, bestseller, gift idea, sustainable, eco-friendly, handmade, unique`,
        confidence: 90,
        platform: 'universal'
      },
      {
        id: '7',
        type: 'price',
        content: productData.priceRange || '$19.99 - $49.99',
        confidence: 85,
        platform: 'universal'
      }
    ];

    setGeneratedContent(content);
    setIsGenerating(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const regenerateContent = (contentId: string) => {
    // Simulate regeneration
    setGeneratedContent(prev => 
      prev.map(item => 
        item.id === contentId 
          ? { ...item, confidence: Math.floor(Math.random() * 20) + 80 }
          : item
      )
    );
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
          <Sparkles className="w-8 h-8 text-primary" />
          <h1 className="ff-text-gradient">AI Product Content Generator</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Generate compelling product titles, descriptions, tags, and pricing optimized for each platform using advanced AI
        </p>
      </motion.div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="input">Product Input</TabsTrigger>
          <TabsTrigger value="results">Generated Content</TabsTrigger>
          <TabsTrigger value="optimization">Platform Optimization</TabsTrigger>
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
                  <Target className="w-5 h-5 text-primary" />
                  <span>Product Details</span>
                </CardTitle>
                <CardDescription>
                  Provide basic information about your product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={productData.category} onValueChange={(value) => 
                    setProductData(prev => ({ ...prev, category: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Target Audience</label>
                  <Input
                    placeholder="e.g., fitness enthusiasts, busy professionals"
                    value={productData.targetAudience}
                    onChange={(e) => setProductData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Keywords</label>
                  <Input
                    placeholder="e.g., durable, lightweight, eco-friendly"
                    value={productData.keywords}
                    onChange={(e) => setProductData(prev => ({ ...prev, keywords: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Price Range</label>
                  <Input
                    placeholder="e.g., $25-$50"
                    value={productData.priceRange}
                    onChange={(e) => setProductData(prev => ({ ...prev, priceRange: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Brand Name (Optional)</label>
                  <Input
                    placeholder="Your brand name"
                    value={productData.brand}
                    onChange={(e) => setProductData(prev => ({ ...prev, brand: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-secondary" />
                  <span>Platform Selection</span>
                </CardTitle>
                <CardDescription>
                  Choose platforms to optimize content for
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {platforms.map(platform => (
                    <label
                      key={platform.id}
                      className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedPlatforms.includes(platform.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPlatforms.includes(platform.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPlatforms(prev => [...prev, platform.id]);
                          } else {
                            setSelectedPlatforms(prev => prev.filter(p => p !== platform.id));
                          }
                        }}
                        className="sr-only"
                      />
                      <span className="text-lg">{platform.icon}</span>
                      <span className="text-sm font-medium">{platform.name}</span>
                      {selectedPlatforms.includes(platform.id) && (
                        <CheckCircle className="w-4 h-4 text-primary ml-auto" />
                      )}
                    </label>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    onClick={handleGenerate} 
                    disabled={!productData.category || !productData.targetAudience || isGenerating}
                    className="w-full ff-btn-primary"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Wand2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating Content...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate AI Content
                      </>
                    )}
                  </Button>
                </div>
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
                        <span className="font-medium">Generating AI Content</span>
                      </div>
                      <Progress value={generationProgress} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        This may take a few moments...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {generatedContent.length > 0 && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Titles Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Type className="w-5 h-5 text-primary" />
                    <span>Generated Titles</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {generatedContent.filter(item => item.type === 'title').map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.content}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {item.platform === 'universal' ? 'All Platforms' : item.platform}
                          </Badge>
                          <Badge 
                            variant={item.confidence >= 90 ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {item.confidence}% confidence
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => copyToClipboard(item.content)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => regenerateContent(item.id)}>
                          <RefreshCw className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Descriptions Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-secondary" />
                    <span>Generated Descriptions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {generatedContent.filter(item => item.type === 'description').map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {item.platform === 'universal' ? 'All Platforms' : item.platform}
                          </Badge>
                          <Badge 
                            variant={item.confidence >= 90 ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {item.confidence}% confidence
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => copyToClipboard(item.content)}>
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => regenerateContent(item.id)}>
                            <RefreshCw className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed">{item.content}</p>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Tags and Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Hash className="w-5 h-5 text-accent" />
                      <span>SEO Tags</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {generatedContent.filter(item => item.type === 'tags').map(item => (
                      <div key={item.id} className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {item.content.split(', ').map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <Badge className="text-xs">{item.confidence}% confidence</Badge>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => copyToClipboard(item.content)}>
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => regenerateContent(item.id)}>
                              <RefreshCw className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      <span>Pricing Suggestion</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {generatedContent.filter(item => item.type === 'price').map(item => (
                      <div key={item.id} className="space-y-3">
                        <div className="text-2xl font-bold text-primary">{item.content}</div>
                        <p className="text-sm text-muted-foreground">
                          Based on market analysis and category trends
                        </p>
                        <div className="flex justify-between items-center">
                          <Badge className="text-xs">{item.confidence}% confidence</Badge>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => copyToClipboard(item.content)}>
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => regenerateContent(item.id)}>
                              <RefreshCw className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6">
                <Button className="ff-btn-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save All Content
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export to CSV
                </Button>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Publish to Platforms
                </Button>
              </div>
            </motion.div>
          )}
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span>Platform-Specific Optimization</span>
                </CardTitle>
                <CardDescription>
                  Tailored content recommendations for each platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {platforms.map(platform => (
                    <Card key={platform.id} className="p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-lg">{platform.icon}</span>
                        <span className="font-medium">{platform.name}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Title Length:</span>
                          <span>60-80 chars</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Description:</span>
                          <span>150-300 words</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tags:</span>
                          <span>10-15 tags</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Optimization:</span>
                          <Badge variant="outline" className="text-xs">
                            {Math.floor(Math.random() * 20) + 80}%
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}