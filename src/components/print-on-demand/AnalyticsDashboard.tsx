import React from 'react';
import { Card } from '../ui/card';
import { ShoppingBag, Package, DollarSign, TrendingUp } from 'lucide-react';
import { MarketplaceAnalytics } from '../../types/marketplace';

interface AnalyticsDashboardProps {
  analytics: MarketplaceAnalytics;
}

export function AnalyticsDashboard({ analytics }: AnalyticsDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Listings</p>
            <p className="text-2xl font-bold text-primary">{analytics.totalListings}</p>
          </div>
          <ShoppingBag className="h-8 w-8 text-primary" />
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-2xl font-bold text-green-500">{analytics.totalOrders}</p>
          </div>
          <Package className="h-8 w-8 text-green-500" />
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold text-secondary">${analytics.totalRevenue.toFixed(2)}</p>
          </div>
          <DollarSign className="h-8 w-8 text-secondary" />
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
            <p className="text-2xl font-bold text-purple-500">{analytics.conversionRate}%</p>
          </div>
          <TrendingUp className="h-8 w-8 text-purple-500" />
        </div>
      </Card>
    </div>
  );
}