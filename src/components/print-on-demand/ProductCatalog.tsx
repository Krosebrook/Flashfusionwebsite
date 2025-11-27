import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { toast } from "sonner";
import { 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Star,
  ShoppingCart,
  BarChart3,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Download,
  Power,
  PowerOff,
  ExternalLink
} from 'lucide-react';
import { PRODUCT_TYPES, MARKETPLACES } from '../../constants/print-on-demand';
import { 
  MOCK_PRODUCTS, 
  PRODUCT_CATEGORIES, 
  PRODUCT_STATUS_OPTIONS,
  SORT_OPTIONS,
  Product 
} from '../../constants/product-catalog';
import {
  calculateCatalogStats,
  filterProducts,
  sortProducts,
  updateProductInArray,
  createDuplicateProduct,
  formatCurrency,
  formatNumber,
  getStatusColor
} from '../../utils/product-catalog';
import { ProductDetailModal } from './ProductDetailModal';

interface ProductCatalogProps {
  userTier: 'free' | 'pro' | 'enterprise';
  onCreateProduct: () => void;
  onEditProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
}

export function ProductCatalog({ userTier, onCreateProduct, onEditProduct, onDeleteProduct }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterProductType, setFilterProductType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Apply filters and sorting
  const filteredProducts = filterProducts(products, searchQuery, filterStatus, filterCategory, filterProductType);
  const sortedProducts = sortProducts(filteredProducts, sortBy, sortOrder);
  
  // Calculate stats
  const catalogStats = calculateCatalogStats(products);

  // Event handlers
  const updateProductStatus = (productId: string, status: Product['status']) => {
    setProducts(prev => updateProductInArray(prev, productId, { status }));
    toast.success(`Product status updated to ${status}`);
  };

  const toggleProductVisibility = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newVisibility = product.visibility === 'public' ? 'private' : 'public';
    setProducts(prev => updateProductInArray(prev, productId, { visibility: newVisibility }));
    toast.success('Product visibility updated');
  };

  const duplicateProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newProduct = createDuplicateProduct(product);
    setProducts(prev => [newProduct, ...prev]);
    toast.success('Product duplicated successfully');
  };

  const bulkUpdateStatus = (status: Product['status']) => {
    setProducts(prev => prev.map(product => 
      selectedProducts.includes(product.id)
        ? { ...product, status, updatedAt: new Date().toISOString() }
        : product
    ));
    setSelectedProducts([]);
    toast.success(`${selectedProducts.length} products updated to ${status}`);
  };

  const bulkDelete = () => {
    setProducts(prev => prev.filter(product => !selectedProducts.includes(product.id)));
    selectedProducts.forEach(id => onDeleteProduct(id));
    setSelectedProducts([]);
    toast.success(`${selectedProducts.length} products deleted`);
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="overflow-hidden ff-card-interactive">
      <div className="aspect-video bg-muted relative">
        <img 
          src={product.images[0]} 
          alt={product.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge className={getStatusColor(product.status)}>
            {product.status}
          </Badge>
        </div>
        <div className="absolute bottom-2 left-2 flex space-x-1">
          {product.marketplaces.slice(0, 2).map((marketplace) => {
            const mp = Object.values(MARKETPLACES).find(m => m.id === marketplace);
            return mp ? (
              <Badge key={marketplace} variant="secondary" className="text-xs">
                {mp.name}
              </Badge>
            ) : null;
          })}
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold line-clamp-2 text-sm">{product.title}</h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-lg font-bold text-primary">{formatCurrency(product.suggestedPrice)}</span>
            <div className="flex space-x-2 text-xs text-muted-foreground">
              <span className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                {formatNumber(product.stats.views)}
              </span>
              <span className="flex items-center">
                <ShoppingCart className="h-3 w-3 mr-1" />
                {product.stats.orders}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Revenue:</span>
            <div className="font-semibold text-green-600">{formatCurrency(product.stats.revenue)}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Rating:</span>
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">
                {product.stats.rating > 0 ? product.stats.rating.toFixed(1) : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {product.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedProduct(product)}
          >
            <Eye className="h-3 w-3 mr-1" />
            View Details
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onEditProduct(product.id)}>
                <Edit className="h-3 w-3 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => duplicateProduct(product.id)}>
                <Copy className="h-3 w-3 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleProductVisibility(product.id)}>
                {product.visibility === 'public' ? <EyeOff className="h-3 w-3 mr-2" /> : <Eye className="h-3 w-3 mr-2" />}
                {product.visibility === 'public' ? 'Make Private' : 'Make Public'}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => updateProductStatus(product.id, product.status === 'active' ? 'paused' : 'active')}
              >
                {product.status === 'active' ? <PowerOff className="h-3 w-3 mr-2" /> : <Power className="h-3 w-3 mr-2" />}
                {product.status === 'active' ? 'Pause' : 'Activate'}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDeleteProduct(product.id)}
                className="text-destructive"
              >
                <Trash2 className="h-3 w-3 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Product Catalog
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your product designs, variants, and marketplace listings
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button 
            className="bg-gradient-to-r from-primary to-secondary"
            onClick={onCreateProduct}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Product
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 ff-card-interactive">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold">{catalogStats.total}</p>
              <p className="text-xs text-muted-foreground">
                {catalogStats.active} active, {catalogStats.draft} draft
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 ff-card-interactive">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(catalogStats.revenue)}</p>
              <p className="text-xs text-green-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +18.2% from last month
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 ff-card-interactive">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">{catalogStats.orders}</p>
              <p className="text-xs text-muted-foreground">
                Avg: {formatCurrency(catalogStats.revenue / Math.max(catalogStats.orders, 1))} per order
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-secondary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 ff-card-interactive">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
              <p className="text-2xl font-bold flex items-center">
                {catalogStats.avgRating.toFixed(1)}
                <Star className="h-4 w-4 ml-1 fill-yellow-400 text-yellow-400" />
              </p>
              <p className="text-xs text-muted-foreground">
                {formatNumber(catalogStats.views)} total views
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Controls */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {PRODUCT_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category} className="capitalize">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterProductType} onValueChange={setFilterProductType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {Object.values(PRODUCT_TYPES)
                      .flatMap(category => Object.values(category))
                      .map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortOrder === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => bulkUpdateStatus('active')}>
                Activate
              </Button>
              <Button variant="outline" size="sm" onClick={() => bulkUpdateStatus('paused')}>
                Pause
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedProducts([])}>
                Clear Selection
              </Button>
              <Button variant="destructive" size="sm" onClick={bulkDelete}>
                Delete Selected
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {sortedProducts.length} of {catalogStats.total} products
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Products Grid/List */}
      {sortedProducts.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" 
            : "space-y-4"
        }>
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || filterStatus !== 'all' || filterCategory !== 'all' || filterProductType !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first product to get started'
            }
          </p>
          <Button 
            className="bg-gradient-to-r from-primary to-secondary"
            onClick={onCreateProduct}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create First Product
          </Button>
        </Card>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}