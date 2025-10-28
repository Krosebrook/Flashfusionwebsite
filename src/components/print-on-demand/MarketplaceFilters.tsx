import React from 'react';
import { Card } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Filter } from 'lucide-react';
import { FilterState } from '../../types/marketplace';
import { FILTER_OPTIONS } from '../../constants/marketplace';

interface MarketplaceFiltersProps {
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
  showOrderStatus?: boolean;
}

export function MarketplaceFilters({ 
  filter, 
  onFilterChange, 
  showOrderStatus = false 
}: MarketplaceFiltersProps) {
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filter, [key]: value });
  };

  const statusOptions = showOrderStatus ? FILTER_OPTIONS.ORDER_STATUS : FILTER_OPTIONS.STATUS;

  return (
    <Card className="p-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <Select 
          value={filter.marketplace} 
          onValueChange={(value) => handleFilterChange('marketplace', value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Marketplaces" />
          </SelectTrigger>
          <SelectContent>
            {FILTER_OPTIONS.MARKETPLACE.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select 
          value={filter.status} 
          onValueChange={(value) => handleFilterChange('status', value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select 
          value={filter.dateRange} 
          onValueChange={(value) => handleFilterChange('dateRange', value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="30 days" />
          </SelectTrigger>
          <SelectContent>
            {FILTER_OPTIONS.DATE_RANGE.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}