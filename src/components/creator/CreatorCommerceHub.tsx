import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  ShoppingCart, 
  Download, 
  Loader2, 
  CheckCircle, 
  Package, 
  CreditCard,
  Truck,
  BarChart3
} from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface EcommerceResult {
  generationId: string;
  files: Record<string, string>;
  downloadUrl: string;
  fileName: string;
  productType: string;
  platform: string;
}

function CreatorCommerceHub() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    productType: '',
    platform: '',
    features: [] as string[]
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<EcommerceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const productTypes = [
    { value: 'physical', label: 'Physical Products', icon: Package },
    { value: 'digital', label: 'Digital Products', icon: Download },
    { value: 'subscription', label: 'Subscription Service', icon: CreditCard },
    { value: 'marketplace', label: 'Multi-vendor Marketplace', icon: ShoppingCart }
  ];

  const platforms = [
    { value: 'shopify', label: 'Shopify' },
    { value: 'woocommerce', label: 'WooCommerce' },
    { value: 'magento', label: 'Magento' },
    { value: 'bigcommerce', label: 'BigCommerce' },
    { value: 'custom', label: 'Custom Solution' }
  ];

  const availableFeatures = [
    'inventory-management',
    'payment-gateway',
    'shipping-calculator',
    'tax-calculation',
    'multi-currency',
    'product-reviews',
    'wishlist',
    'abandoned-cart',
    'analytics',
    'seo-optimization',
    'mobile-app',
    'social-integration'
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
    if (!formData.name || !formData.productType || !formData.platform) {
      setError('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem('ff-auth-token');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-88829a40/generate/ecommerce`, {
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
    } catch (error) {
      console.error('Ecommerce generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate ecommerce store');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!result?.downloadUrl) return;

    try {
      const link = document.createElement('a');
      link.href = result.downloadUrl;
      link.download = result.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      setError('Failed to download store files');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold ff-text-gradient">Creator Commerce Hub</h1>
        <p className="text-lg text-muted-foreground">
          Generate production-ready eCommerce stores with AI-powered customization
        </p>
      </div>

      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generator">Store Generator</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Store Configuration */}
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  Store Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    placeholder="My Amazing Store"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="ff-focus-ring"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeDescription">Store Description</Label>
                  <Textarea
                    id="storeDescription"
                    placeholder="Describe your store and products..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="ff-focus-ring"
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Product Type</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {productTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <div
                          key={type.value}
                          onClick={() => setFormData(prev => ({ ...prev, productType: type.value }))}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            formData.productType === type.value
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent className="h-5 w-5 text-primary" />
                            <span className="font-medium">{type.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Select value={formData.platform} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, platform: value }))
                  }>
                    <SelectTrigger className="ff-focus-ring">
                      <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Features</Label>
                  <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
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
                  disabled={isGenerating || !formData.name || !formData.productType || !formData.platform}
                  className="w-full ff-btn-primary"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Generating Store...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Generate eCommerce Store
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generation Result */}
            <Card className={`${result ? 'ff-card-interactive' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {result ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Package className="h-5 w-5 text-muted-foreground" />
                  )}
                  Generated Store
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!result && !isGenerating && (
                  <div className="text-center text-muted-foreground py-8">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Configure your store and click generate to see the results</p>
                  </div>
                )}

                {isGenerating && (
                  <div className="text-center py-8">
                    <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
                    <p className="text-muted-foreground">Creating your eCommerce store...</p>
                    <div className="mt-4 space-y-2">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary ff-progress-bar"></div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Setting up {formData.platform} for {formData.productType} products
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
                        Ready to Deploy
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <Package className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <div className="text-sm font-medium">{result.productType}</div>
                        <div className="text-xs text-muted-foreground">Product Type</div>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <ShoppingCart className="h-6 w-6 mx-auto mb-2 text-secondary" />
                        <div className="text-sm font-medium">{result.platform}</div>
                        <div className="text-xs text-muted-foreground">Platform</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Store Features</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature.replace('-', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Generated Files</Label>
                      <div className="bg-muted/50 rounded-lg p-3 max-h-40 overflow-y-auto">
                        {Object.keys(result.files).map((fileName) => (
                          <div key={fileName} className="text-sm font-mono py-1 flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            {fileName}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button 
                      onClick={handleDownload}
                      className="w-full ff-btn-secondary"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Store Package ({result.fileName})
                    </Button>

                    <div className="text-xs text-muted-foreground text-center">
                      Your store package includes theme files, configuration, 
                      payment setup, and deployment instructions.
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
              { name: 'Fashion Store', type: 'fashion', features: ['inventory', 'reviews', 'wishlist'] },
              { name: 'Digital Products', type: 'digital', features: ['instant-download', 'licensing'] },
              { name: 'Subscription Box', type: 'subscription', features: ['recurring-billing', 'customization'] },
              { name: 'B2B Marketplace', type: 'b2b', features: ['bulk-pricing', 'quotes', 'accounts'] },
              { name: 'Food Delivery', type: 'food', features: ['location', 'scheduling', 'tracking'] },
              { name: 'Electronics Store', type: 'electronics', features: ['specifications', 'comparisons'] }
            ].map((template) => (
              <Card key={template.name} className="ff-card-interactive cursor-pointer">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="h-12 w-12 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.type} optimized</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {template.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <Button size="sm" className="w-full">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Stripe', category: 'Payment', icon: CreditCard },
              { name: 'PayPal', category: 'Payment', icon: CreditCard },
              { name: 'FedEx', category: 'Shipping', icon: Truck },
              { name: 'UPS', category: 'Shipping', icon: Truck },
              { name: 'Google Analytics', category: 'Analytics', icon: BarChart3 },
              { name: 'Mailchimp', category: 'Marketing', icon: Package }
            ].map((integration) => {
              const IconComponent = integration.icon;
              return (
                <Card key={integration.name} className="ff-card-interactive">
                  <CardContent className="p-6 text-center">
                    <IconComponent className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold">{integration.name}</h3>
                    <p className="text-sm text-muted-foreground">{integration.category}</p>
                    <Button size="sm" className="w-full mt-4">
                      Connect
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
              { label: 'Total Sales', value: '$12,345', change: '+12%' },
              { label: 'Orders', value: '156', change: '+8%' },
              { label: 'Conversion Rate', value: '3.2%', change: '+15%' },
              { label: 'Avg Order Value', value: '$79', change: '+5%' }
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
export { CreatorCommerceHub };

// Default export for lazy loading
export default CreatorCommerceHub;