import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Globe, Plus } from 'lucide-react';
import { MARKETPLACES } from '../../constants/print-on-demand';
import { ConnectedMarketplaces } from '../../types/marketplace';

interface ConnectedMarketplacesGridProps {
  connectedMarketplaces: ConnectedMarketplaces;
  onConnect: (marketplaceId: string) => void;
}

export function ConnectedMarketplacesGrid({ 
  connectedMarketplaces, 
  onConnect 
}: ConnectedMarketplacesGridProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Connected Marketplaces</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(MARKETPLACES).map(([key, marketplace]) => (
          <div
            key={key}
            className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:scale-105 ${
              connectedMarketplaces[key]
                ? 'border-green-500/20 bg-green-500/10 ff-hover-glow'
                : 'border-muted bg-muted/50 hover:border-primary/30'
            }`}
            onClick={() => !connectedMarketplaces[key] && onConnect(key)}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <Globe className={`h-8 w-8 ${
                  connectedMarketplaces[key] ? 'text-green-500' : 'text-muted-foreground'
                }`} />
                {connectedMarketplaces[key] && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                )}
              </div>
              
              <div className="text-center">
                <span className="text-sm font-medium block">{marketplace.name}</span>
                <span className="text-xs text-muted-foreground">{marketplace.category}</span>
              </div>
              
              <Badge 
                variant={connectedMarketplaces[key] ? 'default' : 'secondary'}
                className={connectedMarketplaces[key] ? 'bg-green-500/20 text-green-400' : ''}
              >
                {connectedMarketplaces[key] ? 'Connected' : 'Available'}
              </Badge>
              
              {connectedMarketplaces[key] && (
                <div className="text-xs text-center space-y-1">
                  <div className="text-muted-foreground">Commission: {marketplace.commission}%</div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {marketplace.features.slice(0, 2).map((feature) => (
                      <span 
                        key={feature} 
                        className="px-1 py-0.5 bg-primary/10 text-primary rounded text-xs"
                      >
                        {feature.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {!connectedMarketplaces[key] && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-xs h-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    onConnect(key);
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Connect
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}