import { PRODUCT_TYPES, DESIGN_CATEGORIES, MARKETPLACES } from './print-on-demand';

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  material: string;
  price: number;
  stock: number;
  sku: string;
  weight: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  productType: string;
  basePrice: number;
  suggestedPrice: number;
  variants: ProductVariant[];
  images: string[];
  tags: string[];
  status: 'draft' | 'active' | 'paused' | 'out_of_stock';
  visibility: 'public' | 'private';
  marketplaces: string[];
  stats: {
    views: number;
    favorites: number;
    orders: number;
    revenue: number;
    conversionRate: number;
    rating: number;
    reviews: number;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// Mock products with realistic data
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_001',
    title: 'Motivational Quote T-Shirt - Dream Big Work Hard',
    description: 'Inspire yourself and others with this powerful motivational design. Perfect for entrepreneurs, students, and anyone pursuing their dreams. Premium cotton blend for comfort and durability.',
    category: 'motivational',
    productType: 'tshirt',
    basePrice: 12.99,
    suggestedPrice: 24.99,
    variants: [
      { id: 'var_001_1', size: 'S', color: 'black', material: 'cotton', price: 24.99, stock: 45, sku: 'MOT-TS-BLK-S', weight: 0.18 },
      { id: 'var_001_2', size: 'M', color: 'black', material: 'cotton', price: 24.99, stock: 67, sku: 'MOT-TS-BLK-M', weight: 0.20 },
      { id: 'var_001_3', size: 'L', color: 'black', material: 'cotton', price: 24.99, stock: 52, sku: 'MOT-TS-BLK-L', weight: 0.22 },
      { id: 'var_001_4', size: 'S', color: 'white', material: 'cotton', price: 24.99, stock: 38, sku: 'MOT-TS-WHT-S', weight: 0.18 },
      { id: 'var_001_5', size: 'M', color: 'white', material: 'cotton', price: 24.99, stock: 61, sku: 'MOT-TS-WHT-M', weight: 0.20 }
    ],
    images: ['https://picsum.photos/400/400?random=1', 'https://picsum.photos/400/400?random=2'],
    tags: ['motivational', 'entrepreneur', 'inspiration', 't-shirt', 'quote'],
    status: 'active',
    visibility: 'public',
    marketplaces: ['etsy', 'amazon', 'shopify'],
    stats: {
      views: 2847,
      favorites: 156,
      orders: 89,
      revenue: 2223.11,
      conversionRate: 3.1,
      rating: 4.7,
      reviews: 23
    },
    seo: {
      metaTitle: 'Motivational Quote T-Shirt - Dream Big Work Hard | Premium Design',
      metaDescription: 'Inspire yourself with this premium motivational t-shirt. High-quality cotton, comfortable fit, perfect for entrepreneurs and dreamers.',
      keywords: ['motivational t-shirt', 'entrepreneur shirt', 'inspiration clothing', 'dream big']
    },
    createdAt: '2024-02-15T10:30:00Z',
    updatedAt: '2024-03-14T16:20:00Z',
    publishedAt: '2024-02-16T09:00:00Z'
  },
  {
    id: 'prod_002',
    title: 'Abstract Geometric Wall Art Poster',
    description: 'Modern minimalist poster featuring bold geometric shapes in vibrant colors. Perfect for contemporary home or office decoration. High-quality print on premium paper.',
    category: 'abstract',
    productType: 'poster',
    basePrice: 8.99,
    suggestedPrice: 18.95,
    variants: [
      { id: 'var_002_1', size: '8x10', color: 'white', material: 'paper', price: 15.95, stock: 120, sku: 'GEO-PST-WHT-8x10', weight: 0.05 },
      { id: 'var_002_2', size: '11x14', color: 'white', material: 'paper', price: 18.95, stock: 95, sku: 'GEO-PST-WHT-11x14', weight: 0.08 },
      { id: 'var_002_3', size: '16x20', color: 'white', material: 'paper', price: 24.95, stock: 67, sku: 'GEO-PST-WHT-16x20', weight: 0.12 },
      { id: 'var_002_4', size: '11x14', color: 'matte', material: 'canvas', price: 28.95, stock: 34, sku: 'GEO-PST-CAN-11x14', weight: 0.15 }
    ],
    images: ['https://picsum.photos/400/400?random=3', 'https://picsum.photos/400/400?random=4'],
    tags: ['geometric', 'abstract', 'modern', 'poster', 'wall-art', 'minimalist'],
    status: 'active',
    visibility: 'public',
    marketplaces: ['etsy', 'redbubble', 'society6'],
    stats: {
      views: 1934,
      favorites: 87,
      orders: 45,
      revenue: 852.75,
      conversionRate: 2.3,
      rating: 4.4,
      reviews: 12
    },
    seo: {
      metaTitle: 'Abstract Geometric Wall Art Poster - Modern Minimalist Design',
      metaDescription: 'Transform your space with this stunning abstract geometric poster. Modern minimalist design, high-quality print, multiple sizes available.',
      keywords: ['geometric wall art', 'abstract poster', 'modern art', 'minimalist decor']
    },
    createdAt: '2024-02-20T14:15:00Z',
    updatedAt: '2024-03-13T11:45:00Z',
    publishedAt: '2024-02-21T10:30:00Z'
  },
  {
    id: 'prod_003',
    title: 'Vintage Badge Design Hoodie',
    description: 'Cozy hoodie featuring an authentic vintage-style badge design. Perfect for casual wear with a classic, timeless appeal. Soft fleece interior for warmth and comfort.',
    category: 'vintage',
    productType: 'hoodie',
    basePrice: 24.99,
    suggestedPrice: 45.99,
    variants: [
      { id: 'var_003_1', size: 'S', color: 'gray', material: 'fleece', price: 42.99, stock: 23, sku: 'VIN-HD-GRY-S', weight: 0.65 },
      { id: 'var_003_2', size: 'M', color: 'gray', material: 'fleece', price: 45.99, stock: 34, sku: 'VIN-HD-GRY-M', weight: 0.70 },
      { id: 'var_003_3', size: 'L', color: 'gray', material: 'fleece', price: 45.99, stock: 28, sku: 'VIN-HD-GRY-L', weight: 0.75 },
      { id: 'var_003_4', size: 'M', color: 'navy', material: 'fleece', price: 45.99, stock: 19, sku: 'VIN-HD-NVY-M', weight: 0.70 }
    ],
    images: ['https://picsum.photos/400/400?random=5'],
    tags: ['vintage', 'hoodie', 'badge', 'casual', 'retro'],
    status: 'draft',
    visibility: 'private',
    marketplaces: [],
    stats: {
      views: 156,
      favorites: 8,
      orders: 0,
      revenue: 0,
      conversionRate: 0,
      rating: 0,
      reviews: 0
    },
    seo: {
      metaTitle: 'Vintage Badge Design Hoodie - Retro Style Comfort',
      metaDescription: 'Stay cozy in style with this vintage badge hoodie. Authentic retro design, premium fleece material, perfect for casual wear.',
      keywords: ['vintage hoodie', 'badge design', 'retro clothing', 'casual wear']
    },
    createdAt: '2024-03-10T09:20:00Z',
    updatedAt: '2024-03-15T13:30:00Z'
  }
];

export const PRODUCT_CATEGORIES = [
  'motivational',
  'abstract', 
  'vintage',
  'minimalist',
  'modern',
  'retro',
  'creative',
  'business',
  'lifestyle',
  'tech',
  'education'
];

export const PRODUCT_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'paused', label: 'Paused' },
  { value: 'out_of_stock', label: 'Out of Stock' }
];

export const SORT_OPTIONS = [
  { value: 'updatedAt', label: 'Last Updated' },
  { value: 'createdAt', label: 'Date Created' },
  { value: 'title', label: 'Title' },
  { value: 'suggestedPrice', label: 'Price' },
  { value: 'stats.revenue', label: 'Revenue' },
  { value: 'stats.orders', label: 'Orders' },
  { value: 'stats.views', label: 'Views' },
  { value: 'stats.rating', label: 'Rating' }
];