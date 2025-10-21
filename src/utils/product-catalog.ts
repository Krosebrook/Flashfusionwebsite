import { Product } from '../constants/product-catalog';

// Calculate catalog statistics
export const calculateCatalogStats = (products: Product[]) => {
  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    draft: products.filter(p => p.status === 'draft').length,
    paused: products.filter(p => p.status === 'paused').length,
    outOfStock: products.filter(p => p.status === 'out_of_stock').length,
    revenue: products.reduce((sum, p) => sum + p.stats.revenue, 0),
    orders: products.reduce((sum, p) => sum + p.stats.orders, 0),
    views: products.reduce((sum, p) => sum + p.stats.views, 0),
    avgRating: 0,
    totalVariants: products.reduce((sum, p) => sum + p.variants.length, 0),
    totalStock: products.reduce((sum, p) => 
      sum + p.variants.reduce((vSum, v) => vSum + v.stock, 0), 0
    )
  };

  // Calculate average rating
  const ratedProducts = products.filter(p => p.stats.rating > 0);
  if (ratedProducts.length > 0) {
    stats.avgRating = ratedProducts.reduce((sum, p) => sum + p.stats.rating, 0) / ratedProducts.length;
  }

  return stats;
};

// Filter products based on search and filters
export const filterProducts = (
  products: Product[],
  searchQuery: string,
  filterStatus: string,
  filterCategory: string,
  filterProductType: string
) => {
  return products.filter(product => {
    const matchesSearch = searchQuery === '' || 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesProductType = filterProductType === 'all' || product.productType === filterProductType;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesProductType;
  });
};

// Sort products by specified field and order
export const sortProducts = (
  products: Product[],
  sortBy: string,
  sortOrder: 'asc' | 'desc'
) => {
  return [...products].sort((a, b) => {
    let aVal: any;
    let bVal: any;

    // Handle nested stats properties
    if (sortBy.includes('.')) {
      const [parent, child] = sortBy.split('.');
      aVal = (a as any)[parent]?.[child];
      bVal = (b as any)[parent]?.[child];
    } else {
      aVal = (a as any)[sortBy];
      bVal = (b as any)[sortBy];
    }

    // Handle date sorting
    if (sortBy === 'updatedAt' || sortBy === 'createdAt') {
      const aDate = new Date(aVal as string).getTime();
      const bDate = new Date(bVal as string).getTime();
      return sortOrder === 'desc' ? bDate - aDate : aDate - bDate;
    }
    
    // Handle numeric sorting
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    }
    
    // Handle string sorting
    return sortOrder === 'desc' 
      ? String(bVal).localeCompare(String(aVal))
      : String(aVal).localeCompare(String(bVal));
  });
};

// Update product in array
export const updateProductInArray = (
  products: Product[],
  productId: string,
  updates: Partial<Product>
): Product[] => {
  return products.map(product => 
    product.id === productId 
      ? { ...product, ...updates, updatedAt: new Date().toISOString() }
      : product
  );
};

// Create duplicate product
export const createDuplicateProduct = (originalProduct: Product): Product => {
  return {
    ...originalProduct,
    id: `prod_${Date.now()}`,
    title: `${originalProduct.title} (Copy)`,
    status: 'draft',
    visibility: 'private',
    marketplaces: [],
    stats: {
      views: 0,
      favorites: 0,
      orders: 0,
      revenue: 0,
      conversionRate: 0,
      rating: 0,
      reviews: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: undefined
  };
};

// Calculate profit margin
export const calculateProfitMargin = (product: Product): number => {
  const profit = product.suggestedPrice - product.basePrice;
  return Math.round(((profit / product.suggestedPrice) * 100) * 10) / 10;
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Format number with commas
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

// Get status color class
export const getStatusColor = (status: Product['status']): string => {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'draft':
      return 'bg-gray-500';
    case 'paused':
      return 'bg-yellow-500';
    case 'out_of_stock':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

// Get visibility icon
export const getVisibilityIcon = (visibility: Product['visibility']): string => {
  return visibility === 'public' ? 'Eye' : 'EyeOff';
};

// Calculate total stock for product
export const calculateTotalStock = (product: Product): number => {
  return product.variants.reduce((sum, variant) => sum + variant.stock, 0);
};

// Get low stock variants (less than 10)
export const getLowStockVariants = (product: Product) => {
  return product.variants.filter(variant => variant.stock < 10);
};

// Generate SKU for new variant
export const generateSKU = (product: Product, variant: Partial<Product['variants'][0]>): string => {
  const prefix = product.title.split(' ').map(word => word.substring(0, 2).toUpperCase()).join('');
  const size = variant.size?.toUpperCase() || 'STD';
  const color = variant.color?.substring(0, 3).toUpperCase() || 'CLR';
  const timestamp = Date.now().toString().slice(-4);
  
  return `${prefix}-${size}-${color}-${timestamp}`;
};