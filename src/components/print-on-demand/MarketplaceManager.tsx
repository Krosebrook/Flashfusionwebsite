import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { toast } from "sonner@2.0.3";
import { 
  Plus,
  RefreshCw,
  Settings,
  Globe,
  ShoppingBag,
  BarChart3,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Package,
  Star,
  Users,
  Zap,
  Target,
  Activity,
  Calendar,
  Filter,
  Download,
  Upload,
  Sync,
  Link,
  Unlink,
  Power,
  PowerOff
} from 'lucide-react';
import { MARKETPLACES, ORDER_STATUSES } from '../../constants/print-on-demand';

interface MarketplaceManagerProps {
  user: any;
  userTier: 'free' | 'pro' | 'enterprise';
  onConnectMarketplace: (marketplaceId: string, credentials: any) => void;
  onSyncListings: () => void;
}

interface MarketplaceConnection {
  id: string;
  marketplaceId: string;
  name: string;
  connected: boolean;
  status: 'active' | 'error' | 'syncing' | 'paused';
  lastSync: string;
  credentials: Record<string, any>;
  stats: {
    totalListings: number;
    activeListings: number;
    totalSales: number;
    monthlyRevenue: number;
    conversionRate: number;
    averageOrderValue: number;
  };
  settings: {
    autoSync: boolean;
    syncInterval: number; // hours
    autoPublish: boolean;
    priceSync: boolean;
    inventorySync: boolean;
  };
}

interface ProductListing {
  id: string;
  marketplaceId: string;
  productId: string;
  title: string;
  description: string;
  price: number;
  status: 'active' | 'inactive' | 'pending' | 'error';
  views: number;
  favorites: number;
  orders: number;
  revenue: number;
  lastUpdated: string;
  images: string[];
  tags: string[];
  marketplace: {
    name: string;
    listingUrl: string;
  };
}

interface SyncOperation {
  id: string;
  type: 'listings' | 'orders' | 'inventory' | 'prices';
  status: 'running' | 'completed' | 'failed';
  progress: number;
  message: string;
  startTime: string;
  endTime?: string;
  results?: {
    processed: number;
    updated: number;
    errors: number;
  };
}

// Realistic marketplace connections data
const MOCK_CONNECTIONS: MarketplaceConnection[] = [
  {
    id: 'conn_etsy_001',
    marketplaceId: 'etsy',
    name: 'My Etsy Shop',
    connected: true,
    status: 'active',
    lastSync: '2024-03-15T10:30:00Z',
    credentials: { apiKey: '***', shopId: 'myeshop123' },
    stats: {
      totalListings: 47,
      activeListings: 43,
      totalSales: 284,
      monthlyRevenue: 2847.50,
      conversionRate: 3.2,
      averageOrderValue: 18.95
    },
    settings: {
      autoSync: true,
      syncInterval: 6,
      autoPublish: false,
      priceSync: true,
      inventorySync: true
    }
  },
  {
    id: 'conn_amazon_001',
    marketplaceId: 'amazon',
    name: 'Amazon Seller Account',
    connected: true,
    status: 'active',
    lastSync: '2024-03-15T09:45:00Z',
    credentials: { sellerId: '***', authToken: '***' },
    stats: {
      totalListings: 23,
      activeListings: 21,
      totalSales: 156,
      monthlyRevenue: 1923.75,
      conversionRate: 5.1,
      averageOrderValue: 24.50
    },
    settings: {
      autoSync: true,
      syncInterval: 12,
      autoPublish: true,
      priceSync: true,
      inventorySync: true
    }
  },
  {
    id: 'conn_shopify_001',
    marketplaceId: 'shopify',
    name: 'FlashFusion Store',
    connected: false,
    status: 'error',
    lastSync: '2024-03-14T15:20:00Z',
    credentials: {},
    stats: {
      totalListings: 0,
      activeListings: 0,
      totalSales: 0,
      monthlyRevenue: 0,
      conversionRate: 0,
      averageOrderValue: 0
    },
    settings: {
      autoSync: false,
      syncInterval: 24,
      autoPublish: false,
      priceSync: false,
      inventorySync: false
    }
  }
];

// Mock listings data
const MOCK_LISTINGS: ProductListing[] = [
  {
    id: 'listing_001',
    marketplaceId: 'etsy',
    productId: 'prod_001',
    title: 'Motivational Quote T-Shirt - Dream Big Work Hard',
    description: 'Premium cotton t-shirt with inspirational design perfect for entrepreneurs and go-getters.',
    price: 24.99,
    status: 'active',
    views: 1247,
    favorites: 89,
    orders: 23,
    revenue: 574.77,
    lastUpdated: '2024-03-14T14:30:00Z',
    images: ['https://picsum.photos/400/400?random=1'],
    tags: ['motivational', 't-shirt', 'entrepreneur', 'inspiration'],
    marketplace: {
      name: 'Etsy',
      listingUrl: 'https://etsy.com/listing/123456789'
    }
  },
  {
    id: 'listing_002',
    marketplaceId: 'amazon',
    productId: 'prod_002',
    title: 'Abstract Geometric Wall Art Poster',
    description: 'Modern minimalist poster featuring geometric shapes in vibrant colors.',
    price: 18.95,
    status: 'active',
    views: 892,
    favorites: 34,
    orders: 15,
    revenue: 284.25,
    lastUpdated: '2024-03-15T08:15:00Z',
    images: ['https://picsum.photos/400/400?random=2'],
    tags: ['poster', 'wall-art', 'geometric', 'modern'],
    marketplace: {
      name: 'Amazon',
      listingUrl: 'https://amazon.com/dp/B08XYZ123'
    }
  },
  {
    id: 'listing_003',
    marketplaceId: 'etsy',
    productId: 'prod_003',
    title: 'Vintage Badge Design Hoodie',
    description: 'Comfortable hoodie with vintage-inspired badge design. Perfect for casual wear.',
    price: 39.99,
    status: 'pending',
    views: 234,
    favorites: 12,
    orders: 0,
    revenue: 0,
    lastUpdated: '2024-03-15T11:00:00Z',
    images: ['https://picsum.photos/400/400?random=3'],
    tags: ['hoodie', 'vintage', 'badge', 'casual'],
    marketplace: {
      name: 'Etsy',
      listingUrl: ''
    }
  }
];

export function MarketplaceManager({ user, userTier, onConnectMarketplace, onSyncListings }: MarketplaceManagerProps) {
  const [connections, setConnections] = useState<MarketplaceConnection[]>(MOCK_CONNECTIONS);
  const [listings, setListings] = useState<ProductListing[]>(MOCK_LISTINGS);
  const [syncOperations, setSyncOperations] = useState<SyncOperation[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<string>('');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedMarketplace, setSelectedMarketplace] = useState<string>('');
  const [activeTab, setActiveTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMarketplace, setFilterMarketplace] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('revenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Connect to marketplace
  const connectMarketplace = async (marketplaceId: string, credentials: any) => {
    const marketplace = Object.values(MARKETPLACES).find(m => m.id === marketplaceId);
    if (!marketplace) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newConnection: MarketplaceConnection = {
        id: `conn_${marketplaceId}_${Date.now()}`,
        marketplaceId,
        name: `${marketplace.name} Store`,
        connected: true,
        status: 'active',
        lastSync: new Date().toISOString(),
        credentials,
        stats: {
          totalListings: 0,
          activeListings: 0,
          totalSales: 0,
          monthlyRevenue: 0,
          conversionRate: 0,
          averageOrderValue: 0
        },
        settings: {
          autoSync: true,
          syncInterval: 6,
          autoPublish: false,
          priceSync: true,
          inventorySync: true
        }
      };

      setConnections(prev => [...prev, newConnection]);
      onConnectMarketplace(marketplaceId, credentials);
      setShowConnectModal(false);
      toast.success(`Connected to ${marketplace.name} successfully!`);
      
    } catch (error) {
      toast.error(`Failed to connect to ${marketplace.name}. Please check your credentials.`);
    }
  };

  // Disconnect marketplace
  const disconnectMarketplace = (connectionId: string) => {
    const connection = connections.find(c => c.id === connectionId);
    if (!connection) return;

    setConnections(prev => prev.map(c => 
      c.id === connectionId ? { ...c, connected: false, status: 'error' as const } : c
    ));
    
    toast.success(`Disconnected from ${connection.name}`);
  };

  // Sync marketplace data
  const syncMarketplace = async (connectionId: string, type: SyncOperation['type'] = 'listings') => {
    const connection = connections.find(c => c.id === connectionId);
    if (!connection) return;

    const operationId = `sync_${Date.now()}`;
    const newOperation: SyncOperation = {
      id: operationId,
      type,
      status: 'running',
      progress: 0,
      message: `Starting ${type} sync...`,
      startTime: new Date().toISOString()
    };

    setSyncOperations(prev => [...prev, newOperation]);
    
    try {
      // Simulate sync progress
      const stages = [
        { progress: 20, message: 'Connecting to marketplace...' },
        { progress: 40, message: 'Fetching data...' },
        { progress: 60, message: 'Processing updates...' },
        { progress: 80, message: 'Saving changes...' },
        { progress: 100, message: 'Sync completed successfully!' }
      ];

      for (const stage of stages) {
        setSyncOperations(prev => prev.map(op => 
          op.id === operationId ? { ...op, progress: stage.progress, message: stage.message } : op
        ));
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Update connection stats
      setConnections(prev => prev.map(c => 
        c.id === connectionId ? { 
          ...c, 
          lastSync: new Date().toISOString(),
          stats: {
            ...c.stats,
            totalListings: c.stats.totalListings + Math.floor(Math.random() * 5),
            activeListings: c.stats.activeListings + Math.floor(Math.random() * 3),
            monthlyRevenue: c.stats.monthlyRevenue + (Math.random() * 100)
          }
        } : c
      ));

      // Complete operation
      setSyncOperations(prev => prev.map(op => 
        op.id === operationId ? { 
          ...op, 
          status: 'completed' as const, 
          endTime: new Date().toISOString(),
          results: {
            processed: 25,
            updated: 23,
            errors: 0
          }
        } : op
      ));

      onSyncListings();
      toast.success(`${type} sync completed successfully!`);
      
    } catch (error) {
      setSyncOperations(prev => prev.map(op => 
        op.id === operationId ? { 
          ...op, 
          status: 'failed' as const,
          message: 'Sync failed. Please try again.',
          endTime: new Date().toISOString()
        } : op
      ));
      toast.error('Sync failed. Please check your connection and try again.');
    }
  };

  // Update listing status
  const updateListingStatus = (listingId: string, status: ProductListing['status']) => {
    setListings(prev => prev.map(listing => 
      listing.id === listingId ? { ...listing, status, lastUpdated: new Date().toISOString() } : listing
    ));
    toast.success('Listing status updated');
  };

  // Calculate total stats
  const totalStats = connections.reduce((acc, conn) => ({
    totalListings: acc.totalListings + conn.stats.totalListings,
    activeListings: acc.activeListings + conn.stats.activeListings,
    totalSales: acc.totalSales + conn.stats.totalSales,
    monthlyRevenue: acc.monthlyRevenue + conn.stats.monthlyRevenue,
    avgConversionRate: acc.avgConversionRate + conn.stats.conversionRate,
    avgOrderValue: acc.avgOrderValue + conn.stats.averageOrderValue
  }), {
    totalListings: 0,
    activeListings: 0,
    totalSales: 0,
    monthlyRevenue: 0,
    avgConversionRate: 0,
    avgOrderValue: 0
  });

  // Filter and sort listings
  const filteredListings = listings
    .filter(listing => {
      if (filterStatus !== 'all' && listing.status !== filterStatus) return false;
      if (filterMarketplace !== 'all' && listing.marketplaceId !== filterMarketplace) return false;
      return true;
    })
    .sort((a, b) => {
      const aVal = a[sortBy as keyof ProductListing] as number;
      const bVal = b[sortBy as keyof ProductListing] as number;
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });

  const ConnectMarketplaceModal = () => {
    const [credentials, setCredentials] = useState<Record<string, string>>({});
    const [isConnecting, setIsConnecting] = useState(false);

    const marketplace = Object.values(MARKETPLACES).find(m => m.id === selectedMarketplace);
    if (!marketplace) return null;

    const handleConnect = async () => {
      setIsConnecting(true);
      await connectMarketplace(selectedMarketplace, credentials);
      setIsConnecting(false);
      setCredentials({});
    };

    return (
      <Dialog open={showConnectModal} onOpenChange={setShowConnectModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect to {marketplace.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Globe className="h-8 w-8 text-primary" />
              <div>
                <div className="font-medium">{marketplace.name}</div>
                <div className="text-sm text-muted-foreground">
                  {marketplace.commission}% commission • {marketplace.category}
                </div>
              </div>
            </div>

            {marketplace.requirements.map((requirement) => (
              <div key={requirement}>
                <Label className="capitalize">{requirement.replace('_', ' ')}</Label>
                <Input
                  type={requirement.includes('key') || requirement.includes('token') ? 'password' : 'text'}
                  value={credentials[requirement] || ''}
                  onChange={(e) => setCredentials(prev => ({ 
                    ...prev, 
                    [requirement]: e.target.value 
                  }))}
                  placeholder={`Enter your ${requirement.replace('_', ' ')}`}
                />
              </div>
            ))}

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Your credentials are encrypted and stored securely</p>
              <p>• FlashFusion will only access data necessary for listing management</p>
              <p>• You can disconnect at any time</p>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowConnectModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConnect}
                disabled={isConnecting || marketplace.requirements.some(req => !credentials[req])}
                className="flex-1 bg-gradient-to-r from-primary to-secondary"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Link className="h-4 w-4 mr-2" />
                    Connect
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Marketplace Manager
          </h1>
          <p className="text-muted-foreground mt-2">
            Connect and manage your listings across multiple marketplaces
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              connections.forEach(conn => {
                if (conn.connected) syncMarketplace(conn.id);
              });
            }}
            disabled={syncOperations.some(op => op.status === 'running')}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncOperations.some(op => op.status === 'running') ? 'animate-spin' : ''}`} />
            Sync All
          </Button>
          <Button 
            className="bg-gradient-to-r from-primary to-secondary"
            onClick={() => setShowConnectModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Connect Marketplace
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 ff-card-interactive">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Listings</p>
              <p className="text-2xl font-bold">{totalStats.totalListings}</p>
              <p className="text-xs text-muted-foreground">
                {totalStats.activeListings} active
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 ff-card-interactive">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              <p className="text-2xl font-bold">${totalStats.monthlyRevenue.toFixed(2)}</p>
              <p className="text-xs text-green-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% from last month
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-secondary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 ff-card-interactive">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Sales</p>
              <p className="text-2xl font-bold">{totalStats.totalSales}</p>
              <p className="text-xs text-muted-foreground">
                ${(totalStats.avgOrderValue / connections.length).toFixed(2)} avg order
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-accent" />
            </div>
          </div>
        </Card>

        <Card className="p-6 ff-card-interactive">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold">
                {(totalStats.avgConversionRate / connections.length).toFixed(1)}%
              </p>
              <p className="text-xs text-green-400 flex items-center">
                <Target className="h-3 w-3 mr-1" />
                Above average
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Connections</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="sync">Sync Status</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Connected Marketplaces */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.values(MARKETPLACES).map((marketplace) => {
              const connection = connections.find(c => c.marketplaceId === marketplace.id);
              
              return (
                <Card key={marketplace.id} className="p-6 ff-card-interactive">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        connection?.connected ? 'bg-green-100 dark:bg-green-900/30' : 'bg-muted'
                      }`}>
                        <Globe className={`h-6 w-6 ${
                          connection?.connected ? 'text-green-600' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{marketplace.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {marketplace.commission}% commission • {marketplace.category}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {connection?.connected ? (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <XCircle className="h-3 w-3 mr-1" />
                          Disconnected
                        </Badge>
                      )}
                    </div>
                  </div>

                  {connection?.connected ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold">{connection.stats.totalListings}</div>
                          <div className="text-xs text-muted-foreground">Total Listings</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-600">
                            ${connection.stats.monthlyRevenue.toFixed(0)}
                          </div>
                          <div className="text-xs text-muted-foreground">Monthly Revenue</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Last sync:</span>
                        <span>{new Date(connection.lastSync).toLocaleDateString()}</span>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => syncMarketplace(connection.id)}
                          disabled={syncOperations.some(op => op.status === 'running')}
                          className="flex-1"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Sync Now
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedConnection(connection.id)}
                        >
                          <Settings className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => disconnectMarketplace(connection.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Unlink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Connect to start listing your products on {marketplace.name}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm">Features:</div>
                        <div className="flex flex-wrap gap-1">
                          {marketplace.features.slice(0, 3).map((feature) => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-primary to-secondary"
                        onClick={() => {
                          setSelectedMarketplace(marketplace.id);
                          setShowConnectModal(true);
                        }}
                      >
                        <Link className="h-4 w-4 mr-2" />
                        Connect to {marketplace.name}
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="listings" className="space-y-6">
          {/* Filters and Controls */}
          <Card className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Select value={filterMarketplace} onValueChange={setFilterMarketplace}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Marketplaces</SelectItem>
                    {Object.values(MARKETPLACES).map((marketplace) => (
                      <SelectItem key={marketplace.id} value={marketplace.id}>
                        {marketplace.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="orders">Orders</SelectItem>
                    <SelectItem value="views">Views</SelectItem>
                    <SelectItem value="lastUpdated">Updated</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'desc' ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-primary to-secondary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Listing
                </Button>
              </div>
            </div>
          </Card>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden ff-card-interactive">
                <div className="aspect-video bg-muted relative">
                  <img 
                    src={listing.images[0]} 
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge 
                      className={
                        listing.status === 'active' ? 'bg-green-500' :
                        listing.status === 'pending' ? 'bg-yellow-500' :
                        listing.status === 'inactive' ? 'bg-gray-500' : 'bg-red-500'
                      }
                    >
                      {listing.status}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {listing.marketplace.name}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold line-clamp-2 text-sm">{listing.title}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-lg font-bold text-primary">${listing.price}</span>
                      <div className="flex space-x-2 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {listing.views}
                        </span>
                        <span className="flex items-center">
                          <ShoppingBag className="h-3 w-3 mr-1" />
                          {listing.orders}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Revenue:</span>
                      <div className="font-semibold text-green-600">${listing.revenue.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Favorites:</span>
                      <div className="font-semibold">{listing.favorites}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {listing.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(listing.marketplace.listingUrl, '_blank')}
                      disabled={!listing.marketplace.listingUrl}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateListingStatus(
                        listing.id, 
                        listing.status === 'active' ? 'inactive' : 'active'
                      )}
                    >
                      {listing.status === 'active' ? <PowerOff className="h-3 w-3" /> : <Power className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredListings.length === 0 && (
            <Card className="p-12 text-center">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No listings found</h3>
              <p className="text-muted-foreground mb-4">
                {filterStatus !== 'all' || filterMarketplace !== 'all' 
                  ? 'Try adjusting your filters to see more listings'
                  : 'Create your first listing to start selling your designs'
                }
              </p>
              <Button className="bg-gradient-to-r from-primary to-secondary">
                <Plus className="h-4 w-4 mr-2" />
                Create First Listing
              </Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sync" className="space-y-6">
          {/* Active Sync Operations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sync Operations</h3>
            
            {syncOperations.length === 0 ? (
              <Card className="p-8 text-center">
                <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No sync operations</h3>
                <p className="text-muted-foreground">
                  Sync operations will appear here when running
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {syncOperations.map((operation) => (
                  <Card key={operation.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Badge className={
                            operation.status === 'running' ? 'bg-blue-500' :
                            operation.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                          }>
                            {operation.status === 'running' && <RefreshCw className="h-3 w-3 mr-1 animate-spin" />}
                            {operation.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {operation.status === 'failed' && <XCircle className="h-3 w-3 mr-1" />}
                            {operation.status}
                          </Badge>
                          <span className="font-medium capitalize">{operation.type} Sync</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {operation.message}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(operation.startTime).toLocaleTimeString()}
                      </div>
                    </div>

                    {operation.status === 'running' && (
                      <div className="space-y-2">
                        <Progress value={operation.progress} className="h-2" />
                        <div className="text-xs text-muted-foreground text-center">
                          {operation.progress}% complete
                        </div>
                      </div>
                    )}

                    {operation.results && (
                      <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-border">
                        <div className="text-center">
                          <div className="text-lg font-semibold">{operation.results.processed}</div>
                          <div className="text-xs text-muted-foreground">Processed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-600">{operation.results.updated}</div>
                          <div className="text-xs text-muted-foreground">Updated</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-red-600">{operation.results.errors}</div>
                          <div className="text-xs text-muted-foreground">Errors</div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance by Marketplace */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Performance by Marketplace</h3>
              <div className="space-y-4">
                {connections.filter(c => c.connected).map((connection) => (
                  <div key={connection.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{connection.name}</span>
                      <span className="text-sm text-muted-foreground">
                        ${connection.stats.monthlyRevenue.toFixed(2)}
                      </span>
                    </div>
                    <Progress 
                      value={(connection.stats.monthlyRevenue / Math.max(...connections.map(c => c.stats.monthlyRevenue))) * 100} 
                      className="h-2" 
                    />
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div>{connection.stats.totalListings} listings</div>
                      <div>{connection.stats.totalSales} sales</div>
                      <div>{connection.stats.conversionRate}% conversion</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { time: '2 hours ago', action: 'New order on Etsy', amount: '$24.99' },
                  { time: '4 hours ago', action: 'Listing updated on Amazon', amount: '' },
                  { time: '6 hours ago', action: 'New listing published', amount: '' },
                  { time: '1 day ago', action: 'Sync completed successfully', amount: '' },
                  { time: '1 day ago', action: 'New order on Amazon', amount: '$18.95' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <div className="text-sm font-medium">{activity.action}</div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                    {activity.amount && (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {activity.amount}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Connect Marketplace Modal */}
      <ConnectMarketplaceModal />
    </div>
  );
}