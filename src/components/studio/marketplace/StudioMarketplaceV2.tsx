import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Star,
  Download,
  Eye,
  Package,
  Settings,
  CreditCard,
  BarChart3,
  Calendar,
  Filter,
  Search,
  Upload
} from 'lucide-react';

interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  category: 'samples' | 'presets' | 'templates' | 'full-tracks';
  price: number;
  currency: string;
  thumbnail: string;
  seller: SellerInfo;
  stats: ListingStats;
  rating: number;
  reviews: number;
  tags: string[];
  createdAt: string;
}

interface SellerInfo {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  totalSales: number;
  rating: number;
}

interface ListingStats {
  views: number;
  purchases: number;
  favorites: number;
  conversionRate: number;
}

interface EarningsData {
  totalEarnings: number;
  monthlyEarnings: number;
  pendingPayouts: number;
  lifetimeRevenue: number;
  revenueShare: number; // percentage
  chartData: { month: string; earnings: number }[];
}

interface Review {
  id: string;
  listingId: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}

const StudioMarketplaceV2: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'browse' | 'sell' | 'earnings'>('browse');
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [myListings, setMyListings] = useState<MarketplaceListing[]>([]);
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  const loadMarketplaceData = async () => {
    // Simulate API calls
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockListings: MarketplaceListing[] = [
      {
        id: 'listing-1',
        title: 'Lo-Fi Hip Hop Sample Pack',
        description: '50 high-quality lo-fi samples including drums, bass, and melody loops',
        category: 'samples',
        price: 29.99,
        currency: 'USD',
        thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
        seller: {
          id: 'seller-1',
          name: 'BeatMaker Pro',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Beatmaker',
          verified: true,
          totalSales: 1247,
          rating: 4.8
        },
        stats: {
          views: 5420,
          purchases: 342,
          favorites: 891,
          conversionRate: 6.3
        },
        rating: 4.7,
        reviews: 89,
        tags: ['lo-fi', 'hip-hop', 'samples', 'drums'],
        createdAt: new Date(Date.now() - 2592000000).toISOString()
      },
      {
        id: 'listing-2',
        title: 'Synthwave Presets Collection',
        description: '100+ Serum presets for creating 80s-inspired synthwave music',
        category: 'presets',
        price: 19.99,
        currency: 'USD',
        thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400',
        seller: {
          id: 'seller-2',
          name: 'Synth Master',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Synth',
          verified: true,
          totalSales: 892,
          rating: 4.9
        },
        stats: {
          views: 3210,
          purchases: 248,
          favorites: 567,
          conversionRate: 7.7
        },
        rating: 4.9,
        reviews: 67,
        tags: ['synthwave', '80s', 'presets', 'serum'],
        createdAt: new Date(Date.now() - 1296000000).toISOString()
      },
      {
        id: 'listing-3',
        title: 'EDM Song Starter Templates',
        description: 'Professional EDM project templates for Ableton Live with full arrangement',
        category: 'templates',
        price: 49.99,
        currency: 'USD',
        thumbnail: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400',
        seller: {
          id: 'seller-3',
          name: 'EDM Wizard',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EDM',
          verified: true,
          totalSales: 567,
          rating: 4.6
        },
        stats: {
          views: 4120,
          purchases: 178,
          favorites: 423,
          conversionRate: 4.3
        },
        rating: 4.6,
        reviews: 45,
        tags: ['edm', 'templates', 'ableton', 'dance'],
        createdAt: new Date(Date.now() - 864000000).toISOString()
      }
    ];

    const mockMyListings: MarketplaceListing[] = [
      {
        id: 'my-listing-1',
        title: 'Ambient Soundscapes Vol. 1',
        description: 'Collection of atmospheric pads and textures for ambient music',
        category: 'samples',
        price: 24.99,
        currency: 'USD',
        thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
        seller: {
          id: 'me',
          name: 'You',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Me',
          verified: false,
          totalSales: 45,
          rating: 4.5
        },
        stats: {
          views: 892,
          purchases: 45,
          favorites: 123,
          conversionRate: 5.0
        },
        rating: 4.5,
        reviews: 12,
        tags: ['ambient', 'soundscapes', 'pads'],
        createdAt: new Date(Date.now() - 432000000).toISOString()
      }
    ];

    const mockEarnings: EarningsData = {
      totalEarnings: 1124.55,
      monthlyEarnings: 342.80,
      pendingPayouts: 89.20,
      lifetimeRevenue: 3450.75,
      revenueShare: 80, // 80/20 split
      chartData: [
        { month: 'Jan', earnings: 120.50 },
        { month: 'Feb', earnings: 180.30 },
        { month: 'Mar', earnings: 240.70 },
        { month: 'Apr', earnings: 198.40 },
        { month: 'May', earnings: 280.90 },
        { month: 'Jun', earnings: 342.80 }
      ]
    };

    const mockReviews: Review[] = [
      {
        id: 'review-1',
        listingId: 'my-listing-1',
        userId: 'user-1',
        username: 'MusicProducer123',
        rating: 5,
        comment: 'Amazing soundscapes! Perfect for my ambient tracks.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        helpful: 8
      },
      {
        id: 'review-2',
        listingId: 'my-listing-1',
        userId: 'user-2',
        username: 'AmbientLover',
        rating: 4,
        comment: 'Great quality, would love to see more variations.',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        helpful: 5
      }
    ];

    setListings(mockListings);
    setMyListings(mockMyListings);
    setEarnings(mockEarnings);
    setReviews(mockReviews);
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#0F172A] p-6">
      <div className="max-w-7xl mx-auto space-y-6 ff-stagger-fade">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white font-['Sora'] ff-text-gradient">
            FlashFusion Studio Marketplace
          </h1>
          <p className="text-[#CBD5E1] mt-2 font-['Inter']">
            Buy and sell music production assets
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="bg-[#1E293B] border-[#334155] mb-6">
            <TabsTrigger value="browse" className="data-[state=active]:bg-[#FF7B00] data-[state=active]:text-white">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Browse
            </TabsTrigger>
            <TabsTrigger value="sell" className="data-[state=active]:bg-[#FF7B00] data-[state=active]:text-white">
              <Package className="h-4 w-4 mr-2" />
              My Listings
            </TabsTrigger>
            <TabsTrigger value="earnings" className="data-[state=active]:bg-[#FF7B00] data-[state=active]:text-white">
              <DollarSign className="h-4 w-4 mr-2" />
              Earnings
            </TabsTrigger>
          </TabsList>

          {/* Browse Tab */}
          <TabsContent value="browse" className="space-y-6">
            {/* Search & Filter */}
            <Card className="ff-card-interactive bg-[#1E293B] border-[#334155]">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                      <Input
                        placeholder="Search marketplace..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 ff-focus-ring bg-[#0F172A] border-[#334155] text-white"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {['all', 'samples', 'presets', 'templates', 'full-tracks'].map((cat) => (
                      <Button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={
                          selectedCategory === cat
                            ? 'ff-btn-primary'
                            : 'ff-btn-secondary'
                        }
                        size="sm"
                      >
                        {cat.replace('-', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing, index) => (
                <Card
                  key={listing.id}
                  className="ff-card-interactive bg-[#1E293B] border-[#334155] ff-fade-in-up ff-hover-lift overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={listing.thumbnail}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-[#FF7B00] text-white border-none">
                        ${listing.price}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-white font-['Sora'] mb-1">
                        {listing.title}
                      </h3>
                      <p className="text-sm text-[#94A3B8] line-clamp-2">
                        {listing.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <img
                        src={listing.seller.avatar}
                        alt={listing.seller.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-[#CBD5E1]">{listing.seller.name}</span>
                      {listing.seller.verified && (
                        <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-white">{listing.rating}</span>
                        <span className="text-xs text-[#94A3B8]">({listing.reviews})</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {listing.stats.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {listing.stats.purchases}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {listing.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          className="bg-[#00B4D8]/10 text-[#00B4D8] border-[#00B4D8]/20 text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button className="w-full ff-btn-primary">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Listings Tab */}
          <TabsContent value="sell" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white font-['Sora']">My Listings</h2>
                <p className="text-[#94A3B8] mt-1">{myListings.length} active listings</p>
              </div>
              <Button className="ff-btn-primary">
                <Upload className="h-4 w-4 mr-2" />
                Create New Listing
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {myListings.map((listing, index) => (
                <Card
                  key={listing.id}
                  className="ff-card-interactive bg-[#1E293B] border-[#334155] ff-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <img
                        src={listing.thumbnail}
                        alt={listing.title}
                        className="w-32 h-32 rounded-lg object-cover"
                      />
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-white font-['Sora']">
                              {listing.title}
                            </h3>
                            <p className="text-[#94A3B8] mt-1">{listing.description}</p>
                          </div>
                          <Badge className="bg-[#FF7B00] text-white border-none">
                            ${listing.price}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-[#94A3B8]">Views</p>
                            <p className="text-lg font-bold text-white">{listing.stats.views}</p>
                          </div>
                          <div>
                            <p className="text-xs text-[#94A3B8]">Sales</p>
                            <p className="text-lg font-bold text-white">{listing.stats.purchases}</p>
                          </div>
                          <div>
                            <p className="text-xs text-[#94A3B8]">Rating</p>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <p className="text-lg font-bold text-white">{listing.rating}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-[#94A3B8]">Conversion</p>
                            <p className="text-lg font-bold text-white">{listing.stats.conversionRate}%</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button className="ff-btn-secondary" size="sm">
                            <Settings className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button className="ff-btn-secondary" size="sm">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Analytics
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            {earnings && (
              <>
                {/* Earnings Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="ff-card-interactive bg-[#1E293B] border-[#334155]">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-[#94A3B8]">This Month</p>
                          <p className="text-2xl font-bold text-white mt-1">
                            ${earnings.monthlyEarnings.toFixed(2)}
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="ff-card-interactive bg-[#1E293B] border-[#334155]">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-[#94A3B8]">Total Earnings</p>
                          <p className="text-2xl font-bold text-white mt-1">
                            ${earnings.totalEarnings.toFixed(2)}
                          </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-[#FF7B00]" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="ff-card-interactive bg-[#1E293B] border-[#334155]">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-[#94A3B8]">Pending Payout</p>
                          <p className="text-2xl font-bold text-white mt-1">
                            ${earnings.pendingPayouts.toFixed(2)}
                          </p>
                        </div>
                        <Calendar className="h-8 w-8 text-[#00B4D8]" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="ff-card-interactive bg-[#1E293B] border-[#334155]">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-[#94A3B8]">Revenue Share</p>
                          <p className="text-2xl font-bold text-white mt-1">
                            {earnings.revenueShare}%
                          </p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-[#E91E63]" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Payout Settings */}
                <Card className="ff-card-interactive bg-[#1E293B] border-[#334155]">
                  <CardHeader>
                    <CardTitle className="text-white font-['Sora'] flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-[#00B4D8]" />
                      Payout Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-[#0F172A] border border-[#334155]">
                      <div>
                        <p className="text-white font-semibold">Stripe Connect</p>
                        <p className="text-sm text-[#94A3B8]">Connected • Next payout: 3 days</p>
                      </div>
                      <Button className="ff-btn-secondary" size="sm">
                        Manage
                      </Button>
                    </div>
                    <Button className="w-full ff-btn-primary">
                      Request Payout
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudioMarketplaceV2;
