/**
 * @fileoverview Marketplace management type definitions
 * @description Type definitions for marketplace listings, orders, and analytics
 */

import { ORDER_STATUSES } from '../constants/print-on-demand';

/**
 * @interface MarketplaceListing
 * @description Represents a product listing across multiple marketplaces
 */
export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  images: string[];
  product: any;
  design: any;
  marketplaces: {
    [marketplaceId: string]: {
      listingId: string;
      status: 'draft' | 'active' | 'inactive' | 'rejected' | 'sold_out';
      views: number;
      favorites: number;
      sales: number;
      revenue: number;
      lastSynced: string;
    };
  };
  totalViews: number;
  totalSales: number;
  totalRevenue: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * @interface OrderData
 * @description Represents an order from any marketplace
 */
export interface OrderData {
  id: string;
  orderId: string;
  marketplace: string;
  customer: {
    name: string;
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  };
  items: {
    listingId: string;
    productName: string;
    quantity: number;
    price: number;
    options: Record<string, string>;
  }[];
  totalAmount: number;
  commission: number;
  profit: number;
  status: keyof typeof ORDER_STATUSES;
  trackingNumber?: string;
  fulfillmentProvider: string;
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * @interface MarketplaceAnalytics
 * @description Analytics data for marketplace performance
 */
export interface MarketplaceAnalytics {
  totalListings: number;
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  conversionRate: number;
  topMarketplace: string;
  recentOrders: OrderData[];
}

/**
 * @interface FilterState
 * @description State for filtering listings and orders
 */
export interface FilterState {
  marketplace: string;
  status: string;
  dateRange: string;
}

/**
 * @interface MarketplaceCredentials
 * @description Credentials required for marketplace connections
 */
export interface MarketplaceCredentials {
  [key: string]: string;
}

/**
 * @interface ConnectedMarketplaces
 * @description State tracking which marketplaces are connected
 */
export interface ConnectedMarketplaces {
  [marketplaceId: string]: boolean;
}

/**
 * @interface TableColumn
 * @description Configuration for table columns
 */
export interface TableColumn {
  key: string;
  label: string;
  sortable: boolean;
}

/**
 * @interface SortState
 * @description Current sorting configuration
 */
export interface SortState {
  column: string;
  direction: 'asc' | 'desc';
}

/**
 * @interface MarketplaceManagerProps
 * @description Props for the main MarketplaceManager component
 */
export interface MarketplaceManagerProps {
  user: any;
  userTier: 'free' | 'pro' | 'enterprise';
  onConnectMarketplace: (marketplaceId: string, credentials: any) => void;
  onSyncListings: () => void;
}