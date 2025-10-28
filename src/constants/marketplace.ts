/**
 * @fileoverview Marketplace manager constants and sample data
 * @description Contains sample data, filter options, and configuration for marketplace management
 */

import { MARKETPLACES, ORDER_STATUSES } from './print-on-demand';

/**
 * Sample marketplace listings for development and testing
 */
export const SAMPLE_LISTINGS = [
  {
    id: 'listing_1',
    title: 'Minimalist Mountain Landscape T-Shirt',
    description: 'Beautiful minimalist design featuring mountain silhouettes perfect for nature lovers.',
    category: 'apparel',
    tags: ['nature', 'minimalist', 'mountains', 'outdoor'],
    price: 24.99,
    images: ['/images/designs/mountain-tshirt.jpg'],
    product: { type: 'tshirt', size: 'M', color: 'white' },
    design: { id: 'design_1' },
    marketplaces: {
      etsy: {
        listingId: 'etsy_123',
        status: 'active' as const,
        views: 1234,
        favorites: 67,
        sales: 23,
        revenue: 574.77,
        lastSynced: new Date().toISOString()
      },
      printful: {
        listingId: 'pf_456',
        status: 'active' as const,
        views: 0,
        favorites: 0,
        sales: 23,
        revenue: 574.77,
        lastSynced: new Date().toISOString()
      }
    },
    totalViews: 1234,
    totalSales: 23,
    totalRevenue: 574.77,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'listing_2',
    title: 'Abstract Geometric Coffee Mug',
    description: 'Modern abstract geometric pattern perfect for your morning coffee ritual.',
    category: 'home_decor',
    tags: ['geometric', 'abstract', 'coffee', 'modern'],
    price: 16.99,
    images: ['/images/designs/geometric-mug.jpg'],
    product: { type: 'mug', size: '11oz', color: 'white' },
    design: { id: 'design_2' },
    marketplaces: {
      etsy: {
        listingId: 'etsy_789',
        status: 'active' as const,
        views: 892,
        favorites: 34,
        sales: 12,
        revenue: 203.88,
        lastSynced: new Date().toISOString()
      }
    },
    totalViews: 892,
    totalSales: 12,
    totalRevenue: 203.88,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

/**
 * Sample order data for development and testing
 */
export const SAMPLE_ORDERS = [
  {
    id: 'order_1',
    orderId: 'ORD-2024-001',
    marketplace: 'etsy',
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      address: {
        street: '123 Main St',
        city: 'Portland',
        state: 'OR',
        zip: '97201',
        country: 'US'
      }
    },
    items: [
      {
        listingId: 'listing_1',
        productName: 'Minimalist Mountain Landscape T-Shirt',
        quantity: 1,
        price: 24.99,
        options: { size: 'M', color: 'white' }
      }
    ],
    totalAmount: 24.99,
    commission: 1.62,
    profit: 11.38,
    status: 'printing' as const,
    trackingNumber: 'TRK123456789',
    fulfillmentProvider: 'printful',
    notes: ['Customer requested eco-friendly packaging'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'order_2',
    orderId: 'ORD-2024-002',
    marketplace: 'etsy',
    customer: {
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      address: {
        street: '456 Oak Ave',
        city: 'Seattle',
        state: 'WA',
        zip: '98101',
        country: 'US'
      }
    },
    items: [
      {
        listingId: 'listing_2',
        productName: 'Abstract Geometric Coffee Mug',
        quantity: 2,
        price: 16.99,
        options: { size: '11oz', color: 'white' }
      }
    ],
    totalAmount: 33.98,
    commission: 2.21,
    profit: 15.54,
    status: 'delivered' as const,
    trackingNumber: 'TRK987654321',
    fulfillmentProvider: 'printful',
    notes: [],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

/**
 * Default connected marketplaces state
 */
export const DEFAULT_CONNECTED_MARKETPLACES = {
  etsy: true,
  shopify: false,
  amazon: false,
  printful: true,
  redbubble: false,
  society6: false
};

/**
 * Filter options for listings and orders
 */
export const FILTER_OPTIONS = {
  MARKETPLACE: [
    { value: 'all', label: 'All Marketplaces' },
    ...Object.entries(MARKETPLACES).map(([key, marketplace]) => ({
      value: key,
      label: marketplace.name
    }))
  ],
  STATUS: [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'draft', label: 'Draft' },
    { value: 'sold_out', label: 'Sold Out' }
  ],
  ORDER_STATUS: [
    { value: 'all', label: 'All Status' },
    ...Object.values(ORDER_STATUSES).map(status => ({
      value: status.id,
      label: status.name
    }))
  ],
  DATE_RANGE: [
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 90 days' },
    { value: '1year', label: 'Last year' },
    { value: 'all', label: 'All time' }
  ]
};

/**
 * Analytics calculation helpers
 */
export const ANALYTICS_DEFAULTS = {
  totalListings: 0,
  totalOrders: 0,
  totalRevenue: 0,
  avgOrderValue: 0,
  conversionRate: 0,
  topMarketplace: '',
  recentOrders: []
};

/**
 * Marketplace connection form fields
 */
export const MARKETPLACE_CREDENTIALS = {
  etsy: [
    { name: 'api_key', label: 'API Key', type: 'password', required: true },
    { name: 'shop_id', label: 'Shop ID', type: 'text', required: true }
  ],
  amazon: [
    { name: 'seller_id', label: 'Seller ID', type: 'text', required: true },
    { name: 'mws_auth_token', label: 'MWS Auth Token', type: 'password', required: true }
  ],
  shopify: [
    { name: 'store_url', label: 'Store URL', type: 'url', required: true },
    { name: 'access_token', label: 'Access Token', type: 'password', required: true }
  ],
  printful: [
    { name: 'api_key', label: 'API Key', type: 'password', required: true }
  ],
  redbubble: [
    { name: 'username', label: 'Username', type: 'text', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true }
  ],
  society6: [
    { name: 'artist_profile', label: 'Artist Profile URL', type: 'url', required: true }
  ]
};

/**
 * Table column configurations
 */
export const LISTING_COLUMNS = [
  { key: 'title', label: 'Product', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'price', label: 'Price', sortable: true },
  { key: 'totalViews', label: 'Views', sortable: true },
  { key: 'totalSales', label: 'Sales', sortable: true },
  { key: 'totalRevenue', label: 'Revenue', sortable: true },
  { key: 'updatedAt', label: 'Last Updated', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
];

export const ORDER_COLUMNS = [
  { key: 'orderId', label: 'Order ID', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'marketplace', label: 'Marketplace', sortable: true },
  { key: 'totalAmount', label: 'Amount', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'createdAt', label: 'Date', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
];

/**
 * Status color mappings
 */
export const STATUS_COLORS = {
  active: 'bg-green-500/10 text-green-400 border-green-500/20',
  inactive: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  draft: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  sold_out: 'bg-red-500/10 text-red-400 border-red-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20'
};