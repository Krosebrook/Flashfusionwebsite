import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Eye, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Star, 
  TrendingUp,
  Clock,
  DollarSign,
  Heart
} from 'lucide-react';
import { MarketplaceListing, SortState } from '../../types/marketplace';
import { MARKETPLACES } from '../../constants/print-on-demand';
import { formatCurrency, formatDate, getStatusBadgeColor } from '../../utils/marketplace';

interface ListingsTableProps {
  listings: MarketplaceListing[];
  onEdit: (listingId: string) => void;
  onDelete: (listingId: string) => void;
  onView: (listingId: string) => void;
}

export function ListingsTable({ 
  listings, 
  onEdit, 
  onDelete, 
  onView 
}: ListingsTableProps) {
  const [sortState, setSortState] = useState<SortState>({ column: 'updatedAt', direction: 'desc' });

  const handleSort = (column: string) => {
    setSortState(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (listings.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Listings Found</h3>
          <p className="text-muted-foreground mb-6">
            Create your first product listing to start selling across marketplaces.
          </p>
          <Button className="bg-gradient-to-r from-primary to-secondary">
            Create First Listing
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border bg-muted/30">
            <tr>
              <th className="px-6 py-4 text-left">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSort('title')}
                  className="font-semibold text-xs p-0 h-auto"
                >
                  Product
                </Button>
              </th>
              <th className="px-6 py-4 text-left">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSort('category')}
                  className="font-semibold text-xs p-0 h-auto"
                >
                  Category
                </Button>
              </th>
              <th className="px-6 py-4 text-left">Marketplaces</th>
              <th className="px-6 py-4 text-left">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSort('price')}
                  className="font-semibold text-xs p-0 h-auto"
                >
                  Price
                </Button>
              </th>
              <th className="px-6 py-4 text-left">Performance</th>
              <th className="px-6 py-4 text-left">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSort('updatedAt')}
                  className="font-semibold text-xs p-0 h-auto"
                >
                  Updated
                </Button>
              </th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr 
                key={listing.id} 
                className="border-b border-border hover:bg-muted/20 transition-colors"
              >
                {/* Product Info */}
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      {listing.images[0] ? (
                        <img 
                          src={listing.images[0]} 
                          alt={listing.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm truncate">{listing.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {listing.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {listing.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {listing.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{listing.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-6 py-4">
                  <Badge variant="secondary" className="capitalize">
                    {listing.category.replace('_', ' ')}
                  </Badge>
                </td>

                {/* Marketplaces */}
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(listing.marketplaces).map(([marketplaceId, data]) => {
                      const marketplace = MARKETPLACES[marketplaceId as keyof typeof MARKETPLACES];
                      return (
                        <div key={marketplaceId} className="flex items-center space-x-1">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getStatusBadgeColor(data.status)}`}
                          >
                            {marketplace?.name || marketplaceId}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </td>

                {/* Price */}
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold">{formatCurrency(listing.price)}</div>
                  {listing.totalRevenue > 0 && (
                    <div className="text-xs text-green-400">
                      {formatCurrency(listing.totalRevenue)} total
                    </div>
                  )}
                </td>

                {/* Performance */}
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs">
                      <Eye className="h-3 w-3 text-muted-foreground" />
                      <span>{listing.totalViews.toLocaleString()}</span>
                      {listing.totalViews > 1000 && (
                        <TrendingUp className="h-3 w-3 text-green-400" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      <span>{listing.totalSales} sales</span>
                    </div>
                    {Object.values(listing.marketplaces).some(m => m.favorites > 0) && (
                      <div className="flex items-center space-x-2 text-xs">
                        <Heart className="h-3 w-3 text-red-400" />
                        <span>
                          {Object.values(listing.marketplaces).reduce((sum, m) => sum + m.favorites, 0)} likes
                        </span>
                      </div>
                    )}
                  </div>
                </td>

                {/* Updated */}
                <td className="px-6 py-4">
                  <div className="text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {formatDate(listing.updatedAt)}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(listing.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(listing.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const firstMarketplace = Object.entries(listing.marketplaces)[0];
                        if (firstMarketplace) {
                          window.open(`https://example.com/listing/${firstMarketplace[1].listingId}`, '_blank');
                        }
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(listing.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}