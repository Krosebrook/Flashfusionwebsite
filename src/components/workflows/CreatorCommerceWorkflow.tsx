import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { CheckCircle, DollarSign, ShoppingCart, TrendingUp, CreditCard, Package, Users, BarChart3, Globe, Zap, Target, ArrowRight } from 'lucide-react';

interface CreatorCommerceWorkflowProps {
  createdContent?: any;
  publishedContent?: any;
  onComplete?: () => void;
}

export function CreatorCommerceWorkflow({ createdContent, publishedContent, onComplete }: CreatorCommerceWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRevenueStreams, setSelectedRevenueStreams] = useState<string[]>([]);
  const [marketplaceSettings, setMarketplaceSettings] = useState<any>({});
  const [pricingStrategy, setPricingStrategy] = useState<any>({});
  const [commerceResults, setCommerceResults] = useState<any>(null);

  const revenueStreams = [
    {
      id: 'direct-sales',
      name: 'Direct Sales',
      description: 'Sell your creations directly to customers',
      icon: ShoppingCart,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      revenue: '$2,500/month average',
      setup: 'Immediate',
      commission: '5%',
      features: ['Custom pricing', 'Instant payouts', 'Customer analytics', 'Marketing tools'],
      recommended: true
    },
    {
      id: 'subscription',
      name: 'Subscription Model',
      description: 'Recurring revenue from premium content access',
      icon: CreditCard,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      revenue: '$1,800/month average',
      setup: '1 day',
      commission: '8%',
      features: ['Tiered pricing', 'Member benefits', 'Content gating', 'Retention analytics']
    },
    {
      id: 'marketplace',
      name: 'Marketplace Listings',
      description: 'List on popular creative marketplaces',
      icon: Package,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      revenue: '$3,200/month average',
      setup: '2-3 days',
      commission: '15-30%',
      features: ['Wide reach', 'Built-in traffic', 'Payment processing', 'Reviews system']
    },
    {
      id: 'licensing',
      name: 'Content Licensing',
      description: 'License your work for commercial use',
      icon: Globe,
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
      revenue: '$4,100/month average',
      setup: '3-5 days',
      commission: '20%',
      features: ['Usage rights', 'Bulk licensing', 'Enterprise clients', 'Automated tracking']
    },
    {
      id: 'affiliate',
      name: 'Affiliate Marketing',
      description: 'Earn commissions promoting related products',
      icon: Target,
      color: 'bg-gradient-to-r from-indigo-500 to-purple-500',
      revenue: '$900/month average',
      setup: 'Immediate',
      commission: '0% (earn commissions)',
      features: ['Product recommendations', 'Tracking links', 'Performance analytics', 'Auto-optimization']
    },
    {
      id: 'courses',
      name: 'Educational Content',
      description: 'Create and sell online courses and tutorials',
      icon: Users,
      color: 'bg-gradient-to-r from-teal-500 to-green-500',
      revenue: '$2,800/month average',
      setup: '1-2 weeks',
      commission: '10%',
      features: ['Course builder', 'Student management', 'Certificates', 'Progress tracking']
    }
  ];

  const marketplaces = [
    {
      id: 'creative-market',
      name: 'Creative Market',
      category: 'Design Assets',
      audience: '2M+ designers',
      commission: '30%',
      avgSale: '$85',
      features: ['High-quality audience', 'Marketing support', 'Seasonal promotions']
    },
    {
      id: 'etsy',
      name: 'Etsy',
      category: 'Handmade & Digital',
      audience: '90M+ buyers',
      commission: '6.5%',
      avgSale: '$35',
      features: ['Massive reach', 'SEO optimized', 'Social integration']
    },
    {
      id: 'gumroad',
      name: 'Gumroad',
      category: 'Digital Products',
      audience: 'Creators & fans',
      commission: '10%',
      avgSale: '$42',
      features: ['Creator-friendly', 'Easy setup', 'Flexible pricing']
    },
    {
      id: 'shopify',
      name: 'Shopify Store',
      category: 'E-commerce',
      audience: 'Your customers',
      commission: '2.9%',
      avgSale: '$67',
      features: ['Full control', 'Custom branding', 'Advanced analytics']
    }
  ];

  const handleRevenueStreamToggle = (streamId: string) => {
    setSelectedRevenueStreams(prev => 
      prev.includes(streamId) 
        ? prev.filter(id => id !== streamId)
        : [...prev, streamId]
    );
  };

  const handleSetupCommerce = async () => {
    setCurrentStep(3);
    
    // Simulate commerce setup
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate commerce results
    setCommerceResults({
      revenueStreams: selectedRevenueStreams.map(streamId => {
        const stream = revenueStreams.find(s => s.id === streamId);
        return {
          id: streamId,
          name: stream?.name,
          status: 'active',
          estimatedRevenue: stream?.revenue,
          setupTime: stream?.setup,
          commission: stream?.commission
        };
      }),
      projections: {
        monthlyRevenue: calculateProjectedRevenue(),
        yearlyRevenue: calculateProjectedRevenue() * 12 * 1.15, // Growth factor
        customerBase: Math.floor(Math.random() * 5000) + 1000,
        conversionRate: (Math.random() * 3 + 2).toFixed(1) + '%'
      },
      marketplaces: selectedRevenueStreams.includes('marketplace') ? 
        marketplaces.slice(0, 2).map(mp => ({
          ...mp,
          status: 'connected',
          listingsCreated: Math.floor(Math.random() * 10) + 5
        })) : []
    });
    
    setCurrentStep(4);
  };

  const calculateProjectedRevenue = () => {
    const baseRevenues = {
      'direct-sales': 2500,
      'subscription': 1800,
      'marketplace': 3200,
      'licensing': 4100,
      'affiliate': 900,
      'courses': 2800
    };
    
    return selectedRevenueStreams.reduce((total, streamId) => {
      return total + (baseRevenues[streamId as keyof typeof baseRevenues] || 0);
    }, 0);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="ff-text-headline">Creator Commerce</h2>
                <p className="ff-text-body">Turn your creative work into revenue streams with integrated marketplace tools</p>
              </div>
            </div>

            <Card className="ff-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Ready to Monetize</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="text-blue-500 font-semibold mb-1">Content Created</div>
                    <div className="text-sm text-gray-300">Full-Stack Application</div>
                  </div>
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="text-green-500 font-semibold mb-1">Platforms Deployed</div>
                    <div className="text-sm text-gray-300">3 live deployments</div>
                  </div>
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <div className="text-purple-500 font-semibold mb-1">Market Ready</div>
                    <div className="text-sm text-gray-300">Optimized for sales</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="ff-text-title">Choose Your Revenue Streams</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {revenueStreams.map(stream => {
                  const Icon = stream.icon;
                  return (
                    <Card 
                      key={stream.id}
                      className={`ff-card-interactive cursor-pointer transition-all duration-200 ${
                        selectedRevenueStreams.includes(stream.id) 
                          ? 'ring-2 ring-green-500 bg-green-500/10' 
                          : 'hover:bg-white/5'
                      }`}
                      onClick={() => handleRevenueStreamToggle(stream.id)}
                    >
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`p-3 rounded-lg ${stream.color}`}>
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold">{stream.name}</h4>
                                {stream.recommended && (
                                  <Badge className="ff-badge-primary text-xs mt-1">Recommended</Badge>
                                )}
                              </div>
                            </div>
                            {selectedRevenueStreams.includes(stream.id) && (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-400">{stream.description}</p>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Avg Revenue:</span>
                              <span className="text-green-400 font-semibold">{stream.revenue}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Setup Time:</span>
                              <span className="text-gray-300">{stream.setup}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Commission:</span>
                              <span className="text-gray-300">{stream.commission}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="text-xs text-gray-500 font-medium">Key Features:</div>
                            <div className="flex flex-wrap gap-1">
                              {stream.features.slice(0, 2).map(feature => (
                                <Badge key={feature} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                              {stream.features.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{stream.features.length - 2}
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

            <div className="flex justify-center">
              <Button 
                onClick={() => setCurrentStep(2)}
                disabled={selectedRevenueStreams.length === 0}
                className="ff-btn-primary ff-btn-lg"
              >
                Configure Commerce ({selectedRevenueStreams.length} stream{selectedRevenueStreams.length !== 1 ? 's' : ''})
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="ff-text-headline">Commerce Configuration</h2>
              <p className="ff-text-body">Set up pricing, markets, and monetization settings</p>
            </div>

            <Card className="ff-card">
              <CardHeader>
                <CardTitle>Selected Revenue Streams ({selectedRevenueStreams.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedRevenueStreams.map(streamId => {
                    const stream = revenueStreams.find(s => s.id === streamId);
                    const Icon = stream?.icon || DollarSign;
                    return (
                      <div key={streamId} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded ${stream?.color || 'bg-gray-600'}`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">{stream?.name}</span>
                        </div>
                        <Badge variant="secondary">{stream?.revenue}</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="pricing" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="markets">Markets</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pricing" className="space-y-4">
                <Card className="ff-card">
                  <CardContent className="p-6 space-y-4">
                    <h4 className="ff-text-title">Pricing Strategy</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="ff-text-title text-sm">Base Price</label>
                        <Input 
                          placeholder="$99.00" 
                          className="ff-input"
                          defaultValue="$149.00"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="ff-text-title text-sm">Pricing Model</label>
                        <Select defaultValue="one-time">
                          <SelectTrigger className="ff-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="one-time">One-time Purchase</SelectItem>
                            <SelectItem value="subscription">Subscription</SelectItem>
                            <SelectItem value="tiered">Tiered Pricing</SelectItem>
                            <SelectItem value="usage">Usage-based</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="ff-text-title text-sm">Discount Strategy</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                          <div>
                            <div className="font-medium text-sm">Launch Discount</div>
                            <div className="text-xs text-gray-400">30% off for first month</div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                          <div>
                            <div className="font-medium text-sm">Bulk Pricing</div>
                            <div className="text-xs text-gray-400">Volume discounts</div>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="markets" className="space-y-4">
                <Card className="ff-card">
                  <CardContent className="p-6 space-y-4">
                    <h4 className="ff-text-title">Target Markets</h4>
                    
                    <div className="space-y-3">
                      {marketplaces.map(marketplace => (
                        <div key={marketplace.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <h5 className="font-semibold">{marketplace.name}</h5>
                              <Badge variant="secondary" className="text-xs">{marketplace.category}</Badge>
                            </div>
                            <div className="text-sm text-gray-400">
                              {marketplace.audience} • {marketplace.commission} commission • ${marketplace.avgSale} avg sale
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {marketplace.features.map(feature => (
                                <Badge key={feature} variant="outline" className="text-xs">
                                  {feature}
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
              
              <TabsContent value="payments" className="space-y-4">
                <Card className="ff-card">
                  <CardContent className="p-6 space-y-4">
                    <h4 className="ff-text-title">Payment Processing</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Stripe Integration</div>
                          <div className="text-xs text-gray-400">Credit cards, Apple Pay, Google Pay</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">PayPal</div>
                          <div className="text-xs text-gray-400">PayPal and PayPal Credit</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Crypto Payments</div>
                          <div className="text-xs text-gray-400">Bitcoin, Ethereum, USDC</div>
                        </div>
                        <Switch />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Bank Transfers</div>
                          <div className="text-xs text-gray-400">ACH and wire transfers</div>
                        </div>
                        <Switch />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="ff-text-title text-sm">Payout Schedule</label>
                      <Select defaultValue="weekly">
                        <SelectTrigger className="ff-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="on-demand">On Demand</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="analytics" className="space-y-4">
                <Card className="ff-card">
                  <CardContent className="p-6 space-y-4">
                    <h4 className="ff-text-title">Analytics & Tracking</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Revenue Tracking</div>
                          <div className="text-xs text-gray-400">Real-time revenue analytics</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Customer Analytics</div>
                          <div className="text-xs text-gray-400">Behavior and demographics</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Conversion Tracking</div>
                          <div className="text-xs text-gray-400">Sales funnel analysis</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Performance Alerts</div>
                          <div className="text-xs text-gray-400">Revenue and conversion alerts</div>
                        </div>
                        <Switch />
                      </div>
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
                Back to Revenue Streams
              </Button>
              <Button 
                onClick={handleSetupCommerce}
                className="ff-btn-primary ff-btn-lg"
              >
                Setup Commerce System
                <DollarSign className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="ff-text-headline">Setting Up Commerce</h2>
                <p className="ff-text-body">Configuring your revenue streams and marketplace integrations</p>
              </div>
            </div>

            <Card className="ff-card">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  {selectedRevenueStreams.map((streamId, index) => {
                    const stream = revenueStreams.find(s => s.id === streamId);
                    const Icon = stream?.icon || DollarSign;
                    
                    return (
                      <div key={streamId} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-lg ${stream?.color}`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{stream?.name}</h4>
                            <p className="text-sm text-gray-400">Setting up integrations...</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
                          <span className="text-sm text-green-500">Configuring</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-400 mb-2">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">Commerce Setup in Progress</span>
                  </div>
                  <ul className="text-sm text-blue-300 space-y-1">
                    <li>• Configuring payment processing</li>
                    <li>• Setting up marketplace integrations</li>
                    <li>• Initializing analytics tracking</li>
                    <li>• Creating revenue dashboards</li>
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
                <h2 className="ff-text-headline">Commerce System Active!</h2>
                <p className="ff-text-body">Your revenue streams are now configured and ready to generate income</p>
              </div>
            </div>

            {commerceResults && (
              <div className="space-y-6">
                <Card className="ff-card">
                  <CardHeader>
                    <CardTitle>Revenue Projections</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-500">
                          ${commerceResults.projections.monthlyRevenue.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">Monthly Revenue</div>
                      </div>
                      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-500">
                          ${Math.round(commerceResults.projections.yearlyRevenue).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">Yearly Projection</div>
                      </div>
                      <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-500">
                          {commerceResults.projections.customerBase.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">Potential Customers</div>
                      </div>
                      <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <div className="text-2xl font-bold text-orange-500">
                          {commerceResults.projections.conversionRate}
                        </div>
                        <div className="text-sm text-gray-400">Conversion Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="ff-card">
                  <CardHeader>
                    <CardTitle>Active Revenue Streams</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {commerceResults.revenueStreams.map((stream: any) => (
                      <div key={stream.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{stream.name}</h4>
                            <p className="text-sm text-gray-400">Setup completed in {stream.setupTime}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-500 font-semibold">{stream.estimatedRevenue}</div>
                          <div className="text-xs text-gray-400">{stream.commission} commission</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {commerceResults.marketplaces.length > 0 && (
                  <Card className="ff-card">
                    <CardHeader>
                      <CardTitle>Marketplace Integrations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {commerceResults.marketplaces.map((marketplace: any) => (
                        <div key={marketplace.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border">
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                              <Package className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{marketplace.name}</h4>
                              <p className="text-sm text-gray-400">
                                {marketplace.listingsCreated} listings created • {marketplace.audience}
                              </p>
                            </div>
                          </div>
                          <Badge className="ff-badge-success">Connected</Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                <Tabs defaultValue="dashboard" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="optimization">Optimization</TabsTrigger>
                    <TabsTrigger value="growth">Growth Plan</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="dashboard" className="space-y-4">
                    <Card className="ff-card">
                      <CardContent className="p-6">
                        <h4 className="ff-text-title mb-4">Revenue Dashboard</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <TrendingUp className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-medium text-green-500">Sales Growth</span>
                            </div>
                            <div className="text-2xl font-bold text-green-500">+23%</div>
                            <div className="text-xs text-green-400">vs last month</div>
                          </div>
                          
                          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Users className="w-4 h-4 text-blue-500" />
                              <span className="text-sm font-medium text-blue-500">Customer Acquisition</span>
                            </div>
                            <div className="text-2xl font-bold text-blue-500">156</div>
                            <div className="text-xs text-blue-400">new customers</div>
                          </div>
                          
                          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <BarChart3 className="w-4 h-4 text-purple-500" />
                              <span className="text-sm font-medium text-purple-500">Avg Order Value</span>
                            </div>
                            <div className="text-2xl font-bold text-purple-500">$127</div>
                            <div className="text-xs text-purple-400">+$12 increase</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="optimization" className="space-y-4">
                    <Card className="ff-card">
                      <CardContent className="p-6">
                        <h4 className="ff-text-title mb-4">Revenue Optimization</h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <div className="flex items-center space-x-2 mb-1">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-medium text-green-500">Pricing Optimization</span>
                            </div>
                            <p className="text-xs text-green-400">Increase prices by 15% to maximize revenue</p>
                          </div>
                          
                          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <div className="flex items-center space-x-2 mb-1">
                              <Target className="w-4 h-4 text-blue-500" />
                              <span className="text-sm font-medium text-blue-500">Market Expansion</span>
                            </div>
                            <p className="text-xs text-blue-400">Add 2 more marketplaces for 40% reach increase</p>
                          </div>
                          
                          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                            <div className="flex items-center space-x-2 mb-1">
                              <Zap className="w-4 h-4 text-purple-500" />
                              <span className="text-sm font-medium text-purple-500">Conversion Boost</span>
                            </div>
                            <p className="text-xs text-purple-400">A/B test checkout flow for 12% conversion lift</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="growth" className="space-y-4">
                    <Card className="ff-card">
                      <CardContent className="p-6">
                        <h4 className="ff-text-title mb-4">6-Month Growth Plan</h4>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-4 p-3 bg-gray-800 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">1</div>
                            <div>
                              <h5 className="font-semibold text-sm">Launch Marketing Campaign</h5>
                              <p className="text-xs text-gray-400">Drive initial traffic and sales</p>
                              <Badge variant="secondary" className="text-xs mt-1">Month 1-2</Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-4 p-3 bg-gray-800 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">2</div>
                            <div>
                              <h5 className="font-semibold text-sm">Expand to New Markets</h5>
                              <p className="text-xs text-gray-400">Add international marketplaces</p>
                              <Badge variant="secondary" className="text-xs mt-1">Month 2-4</Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-4 p-3 bg-gray-800 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold">3</div>
                            <div>
                              <h5 className="font-semibold text-sm">Product Line Extension</h5>
                              <p className="text-xs text-gray-400">Launch complementary products</p>
                              <Badge variant="secondary" className="text-xs mt-1">Month 4-6</Badge>
                            </div>
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
                  setSelectedRevenueStreams([]);
                  setCommerceResults(null);
                }}
                className="ff-btn-outline"
              >
                Setup Another
              </Button>
              <Button 
                onClick={onComplete}
                className="ff-btn-primary ff-btn-lg"
              >
                Continue to Security Setup
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
                ? 'bg-green-500 text-white' 
                : 'bg-gray-700 text-gray-400'
            }`}>
              {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
            </div>
            {step < 4 && (
              <div className={`w-16 h-1 mx-2 ${
                step < currentStep ? 'bg-green-500' : 'bg-gray-700'
              }`} />
            )}
          </div>
        ))}
      </div>

      {renderStepContent()}
    </div>
  );
}