/**
 * @fileoverview Marketplace management utility functions
 * @description Helper functions for filtering, calculations, and data manipulation
 */

import { MarketplaceListing, OrderData, MarketplaceAnalytics, FilterState } from '../types/marketplace';

/**
 * Calculate analytics from listings and orders data
 * @param listings - Array of marketplace listings
 * @param orders - Array of orders
 * @returns Analytics object with calculated metrics
 */
export function calculateAnalytics(
  listings: MarketplaceListing[], 
  orders: OrderData[]
): MarketplaceAnalytics {
  const totalRevenue = listings.reduce((sum, listing) => sum + listing.totalRevenue, 0);
  const avgOrderValue = orders.length > 0 
    ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length 
    : 0;

  // Calculate top marketplace by revenue
  const marketplaceRevenue: Record<string, number> = {};
  listings.forEach(listing => {
    Object.entries(listing.marketplaces).forEach(([marketplace, data]) => {
      marketplaceRevenue[marketplace] = (marketplaceRevenue[marketplace] || 0) + data.revenue;
    });
  });

  const topMarketplace = Object.entries(marketplaceRevenue).reduce(
    (top, [marketplace, revenue]) => revenue > top.revenue ? { marketplace, revenue } : top,
    { marketplace: '', revenue: 0 }
  ).marketplace;

  return {
    totalListings: listings.length,
    totalOrders: orders.length,
    totalRevenue,
    avgOrderValue,
    conversionRate: 2.1, // This would be calculated based on views vs sales
    topMarketplace: topMarketplace || 'None',
    recentOrders: orders.slice(0, 5)
  };
}

/**
 * Filter listings based on filter criteria
 * @param listings - Array of listings to filter
 * @param filter - Filter criteria
 * @returns Filtered array of listings
 */
export function filterListings(
  listings: MarketplaceListing[], 
  filter: FilterState
): MarketplaceListing[] {
  return listings.filter(listing => {
    // Filter by marketplace
    if (filter.marketplace !== 'all' && !listing.marketplaces[filter.marketplace]) {
      return false;
    }
    
    // Filter by status
    if (filter.status !== 'all') {
      const hasStatus = Object.values(listing.marketplaces).some(
        marketplace => marketplace.status === filter.status
      );
      if (!hasStatus) return false;
    }
    
    // Filter by date range (simplified - in real app would use actual date logic)
    if (filter.dateRange !== 'all') {
      // This would contain actual date filtering logic
      return true;
    }
    
    return true;
  });
}

/**
 * Filter orders based on filter criteria
 * @param orders - Array of orders to filter
 * @param filter - Filter criteria
 * @returns Filtered array of orders
 */
export function filterOrders(
  orders: OrderData[], 
  filter: FilterState
): OrderData[] {
  return orders.filter(order => {
    // Filter by marketplace
    if (filter.marketplace !== 'all' && order.marketplace !== filter.marketplace) {
      return false;
    }
    
    // Filter by status
    if (filter.status !== 'all' && order.status !== filter.status) {
      return false;
    }
    
    // Filter by date range (simplified)
    if (filter.dateRange !== 'all') {
      // This would contain actual date filtering logic
      return true;
    }
    
    return true;
  });
}

/**
 * Sort listings by specified column and direction
 * @param listings - Array of listings to sort
 * @param column - Column to sort by
 * @param direction - Sort direction
 * @returns Sorted array of listings
 */
export function sortListings(
  listings: MarketplaceListing[],
  column: string,
  direction: 'asc' | 'desc'
): MarketplaceListing[] {
  return [...listings].sort((a, b) => {
    let aValue: any = a[column as keyof MarketplaceListing];
    let bValue: any = b[column as keyof MarketplaceListing];
    
    // Handle special cases
    if (column === 'updatedAt' || column === 'createdAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    return direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Sort orders by specified column and direction
 * @param orders - Array of orders to sort
 * @param column - Column to sort by
 * @param direction - Sort direction
 * @returns Sorted array of orders
 */
export function sortOrders(
  orders: OrderData[],
  column: string,
  direction: 'asc' | 'desc'
): OrderData[] {
  return [...orders].sort((a, b) => {
    let aValue: any;
    let bValue: any;
    
    if (column === 'customer') {
      aValue = a.customer.name.toLowerCase();
      bValue = b.customer.name.toLowerCase();
    } else if (column === 'createdAt' || column === 'updatedAt') {
      aValue = new Date(a[column]).getTime();
      bValue = new Date(b[column]).getTime();
    } else {
      aValue = a[column as keyof OrderData];
      bValue = b[column as keyof OrderData];
    }
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    return direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Format currency value for display
 * @param amount - Amount to format
 * @param currency - Currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

/**
 * Format date for display
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Get status badge color class
 * @param status - Status string
 * @returns Tailwind CSS classes for status badge
 */
export function getStatusBadgeColor(status: string): string {
  const statusColors: Record<string, string> = {
    active: 'bg-green-500/10 text-green-400 border-green-500/20',
    inactive: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    draft: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    sold_out: 'bg-red-500/10 text-red-400 border-red-500/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    paid: 'bg-green-500/10 text-green-400 border-green-500/20',
    processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    printing: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    shipping: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
    failed: 'bg-red-500/10 text-red-400 border-red-500/20',
    refunded: 'bg-gray-500/10 text-gray-400 border-gray-500/20'
  };
  
  return statusColors[status] || statusColors.inactive;
}

/**
 * Calculate marketplace performance metrics
 * @param listings - Array of listings
 * @param marketplaceId - ID of marketplace to analyze
 * @returns Performance metrics for the marketplace
 */
export function calculateMarketplacePerformance(
  listings: MarketplaceListing[],
  marketplaceId: string
) {
  const marketplaceListings = listings.filter(
    listing => listing.marketplaces[marketplaceId]
  );
  
  const totalViews = marketplaceListings.reduce(
    (sum, listing) => sum + (listing.marketplaces[marketplaceId]?.views || 0), 0
  );
  
  const totalSales = marketplaceListings.reduce(
    (sum, listing) => sum + (listing.marketplaces[marketplaceId]?.sales || 0), 0
  );
  
  const totalRevenue = marketplaceListings.reduce(
    (sum, listing) => sum + (listing.marketplaces[marketplaceId]?.revenue || 0), 0
  );
  
  const conversionRate = totalViews > 0 ? (totalSales / totalViews) * 100 : 0;
  
  return {
    totalListings: marketplaceListings.length,
    totalViews,
    totalSales,
    totalRevenue,
    conversionRate,
    avgRevenueListing: marketplaceListings.length > 0 ? totalRevenue / marketplaceListings.length : 0
  };
}

/**
 * Validate marketplace credentials
 * @param marketplaceId - ID of marketplace
 * @param credentials - Credentials object
 * @returns Validation result
 */
export function validateMarketplaceCredentials(
  marketplaceId: string,
  credentials: Record<string, string>
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Define required fields for each marketplace
  const requiredFields: Record<string, string[]> = {
    etsy: ['api_key', 'shop_id'],
    amazon: ['seller_id', 'mws_auth_token'],
    shopify: ['store_url', 'access_token'],
    printful: ['api_key'],
    redbubble: ['username', 'password'],
    society6: ['artist_profile']
  };
  
  const required = requiredFields[marketplaceId] || [];
  
  required.forEach(field => {
    if (!credentials[field] || credentials[field].trim() === '') {
      errors.push(`${field.replace('_', ' ')} is required`);
    }
  });
  
  // Additional validation
  if (marketplaceId === 'shopify' && credentials.store_url) {
    if (!credentials.store_url.includes('.myshopify.com')) {
      errors.push('Store URL must be a valid Shopify store URL');
    }
  }
  
  if (marketplaceId === 'society6' && credentials.artist_profile) {
    if (!credentials.artist_profile.includes('society6.com')) {
      errors.push('Artist profile must be a valid Society6 URL');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}