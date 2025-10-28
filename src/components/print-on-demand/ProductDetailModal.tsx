import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Package, Star } from 'lucide-react';
import { Product } from '../../constants/product-catalog';
import { MARKETPLACES } from '../../constants/print-on-demand';
import { formatCurrency, formatNumber, calculateProfitMargin } from '../../utils/product-catalog';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  if (!product) return null;

  const profitMargin = calculateProfitMargin(product);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>{product.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Images */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img src={image} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Product Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Description</Label>
                <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
              </div>

              <div>
                <Label>Category & Type</Label>
                <div className="flex space-x-2 mt-1">
                  <Badge variant="outline">{product.category}</Badge>
                  <Badge variant="outline">{product.productType}</Badge>
                </div>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Marketplaces</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {product.marketplaces.length > 0 ? (
                    product.marketplaces.map((marketplace) => {
                      const mp = Object.values(MARKETPLACES).find(m => m.id === marketplace);
                      return mp ? (
                        <Badge key={marketplace} className="bg-green-100 text-green-700 dark:bg-green-900/30">
                          {mp.name}
                        </Badge>
                      ) : null;
                    })
                  ) : (
                    <span className="text-sm text-muted-foreground">Not published to any marketplace</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Pricing</Label>
                <div className="grid grid-cols-3 gap-4 mt-1">
                  <div>
                    <span className="text-sm text-muted-foreground">Base Cost:</span>
                    <div className="font-semibold">{formatCurrency(product.basePrice)}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Selling Price:</span>
                    <div className="font-semibold text-primary">{formatCurrency(product.suggestedPrice)}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Profit Margin:</span>
                    <div className="font-semibold text-green-600">{profitMargin}%</div>
                  </div>
                </div>
              </div>

              <div>
                <Label>Performance Stats</Label>
                <div className="grid grid-cols-2 gap-4 mt-1">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Views:</span>
                      <span className="font-semibold">{formatNumber(product.stats.views)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Orders:</span>
                      <span className="font-semibold">{product.stats.orders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Revenue:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(product.stats.revenue)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Favorites:</span>
                      <span className="font-semibold">{product.stats.favorites}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Conversion:</span>
                      <span className="font-semibold">{product.stats.conversionRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Rating:</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">
                          {product.stats.rating > 0 ? product.stats.rating.toFixed(1) : 'N/A'}
                        </span>
                        {product.stats.reviews > 0 && (
                          <span className="text-xs text-muted-foreground">
                            ({product.stats.reviews} reviews)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label>SEO Information</Label>
                <div className="space-y-2 mt-1">
                  <div>
                    <span className="text-sm text-muted-foreground">Meta Title:</span>
                    <p className="text-sm font-medium">{product.seo.metaTitle}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Meta Description:</span>
                    <p className="text-sm">{product.seo.metaDescription}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Keywords:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.seo.keywords.map((keyword) => (
                        <Badge key={keyword} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Variants */}
          <div>
            <Label className="text-lg">Product Variants ({product.variants.length})</Label>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              {product.variants.map((variant) => (
                <div key={variant.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{variant.size}</Badge>
                      <Badge variant="outline">{variant.color}</Badge>
                      <Badge variant="outline">{variant.material}</Badge>
                    </div>
                    <div className="font-semibold">{formatCurrency(variant.price)}</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Stock:</span>
                      <div className={`font-medium ${variant.stock < 10 ? 'text-red-500' : ''}`}>
                        {variant.stock} units
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">SKU:</span>
                      <div className="font-mono text-xs">{variant.sku}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Weight:</span>
                      <div>{variant.weight} kg</div>
                    </div>
                  </div>
                  
                  {variant.stock < 10 && (
                    <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      Low Stock
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Created:</span>
              <div>{new Date(product.createdAt).toLocaleDateString()}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Last Updated:</span>
              <div>{new Date(product.updatedAt).toLocaleDateString()}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Published:</span>
              <div>
                {product.publishedAt 
                  ? new Date(product.publishedAt).toLocaleDateString()
                  : 'Not published'
                }
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}