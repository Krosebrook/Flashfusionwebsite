import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Eye, 
  Package, 
  Truck, 
  MapPin,
  Clock,
  DollarSign,
  User,
  ExternalLink
} from 'lucide-react';
import { OrderData, SortState } from '../../types/marketplace';
import { ORDER_STATUSES, MARKETPLACES } from '../../constants/print-on-demand';
import { formatCurrency, formatDate, getStatusBadgeColor } from '../../utils/marketplace';

interface OrdersTableProps {
  orders: OrderData[];
  onStatusUpdate: (orderId: string, newStatus: any) => void;
  onView: (orderId: string) => void;
}

export function OrdersTable({ 
  orders, 
  onStatusUpdate, 
  onView 
}: OrdersTableProps) {
  const [sortState, setSortState] = useState<SortState>({ column: 'createdAt', direction: 'desc' });

  const handleSort = (column: string) => {
    setSortState(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (orders.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-secondary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
          <p className="text-muted-foreground mb-6">
            Orders will appear here once customers start purchasing your products.
          </p>
          <Button variant="outline">
            View Marketing Tools
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
                  onClick={() => handleSort('orderId')}
                  className="font-semibold text-xs p-0 h-auto"
                >
                  Order
                </Button>
              </th>
              <th className="px-6 py-4 text-left">Customer</th>
              <th className="px-6 py-4 text-left">Items</th>
              <th className="px-6 py-4 text-left">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSort('marketplace')}
                  className="font-semibold text-xs p-0 h-auto"
                >
                  Marketplace
                </Button>
              </th>
              <th className="px-6 py-4 text-left">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSort('totalAmount')}
                  className="font-semibold text-xs p-0 h-auto"
                >
                  Amount
                </Button>
              </th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSort('createdAt')}
                  className="font-semibold text-xs p-0 h-auto"
                >
                  Date
                </Button>
              </th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr 
                key={order.id} 
                className="border-b border-border hover:bg-muted/20 transition-colors"
              >
                {/* Order ID */}
                <td className="px-6 py-4">
                  <div>
                    <div className="font-mono text-sm font-medium">{order.orderId}</div>
                    {order.trackingNumber && (
                      <div className="text-xs text-muted-foreground mt-1">
                        <Truck className="h-3 w-3 inline mr-1" />
                        {order.trackingNumber}
                      </div>
                    )}
                  </div>
                </td>

                {/* Customer */}
                <td className="px-6 py-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{order.customer.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {order.customer.email}
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {order.customer.address.city}, {order.customer.address.state}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Items */}
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium truncate max-w-32">
                          {item.productName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × {formatCurrency(item.price)}
                        </div>
                        {Object.keys(item.options).length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            {Object.entries(item.options).map(([key, value]) => (
                              <span key={key} className="capitalize">
                                {key}: {value}
                              </span>
                            )).join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </td>

                {/* Marketplace */}
                <td className="px-6 py-4">
                  <Badge variant="outline" className="capitalize">
                    {MARKETPLACES[order.marketplace as keyof typeof MARKETPLACES]?.name || order.marketplace}
                  </Badge>
                </td>

                {/* Amount */}
                <td className="px-6 py-4">
                  <div>
                    <div className="font-semibold text-sm">
                      {formatCurrency(order.totalAmount)}
                    </div>
                    <div className="text-xs space-y-0.5">
                      <div className="text-red-400">
                        -{formatCurrency(order.commission)} commission
                      </div>
                      <div className="text-green-400 font-medium">
                        +{formatCurrency(order.profit)} profit
                      </div>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <Badge 
                      variant="outline" 
                      className={`${getStatusBadgeColor(order.status)} capitalize`}
                    >
                      {ORDER_STATUSES[order.status]?.name || order.status}
                    </Badge>
                    
                    <Select
                      value={order.status}
                      onValueChange={(newStatus) => onStatusUpdate(order.id, newStatus)}
                    >
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ORDER_STATUSES).map((status) => (
                          <SelectItem key={status.id} value={status.id}>
                            {status.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </td>

                {/* Date */}
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {formatDate(order.createdAt)}
                    </div>
                    {order.updatedAt !== order.createdAt && (
                      <div className="text-xs text-muted-foreground">
                        Updated: {formatDate(order.updatedAt)}
                      </div>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(order.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {order.trackingNumber && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          window.open(`https://tracking.example.com/${order.trackingNumber}`, '_blank');
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Truck className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const marketplace = MARKETPLACES[order.marketplace as keyof typeof MARKETPLACES];
                        if (marketplace) {
                          window.open(`https://example.com/order/${order.orderId}`, '_blank');
                        }
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <ExternalLink className="h-4 w-4" />
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