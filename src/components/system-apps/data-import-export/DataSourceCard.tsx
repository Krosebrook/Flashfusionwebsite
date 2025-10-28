import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Settings, Globe, X } from 'lucide-react';
import { formatDuration } from '../../../utils/data-import-export';
import type { DataSourceCardProps } from '../../../types/data-import-export';

export function DataSourceCard({ source, onConnect, onDisconnect, onConfigure }: DataSourceCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'error':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted/50 text-muted-foreground border-muted';
    }
  };

  return (
    <Card className="ff-card-interactive">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{source.icon}</div>
            <div>
              <CardTitle className="text-base">{source.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{source.provider}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(source.syncStatus)}>
              {source.syncStatus}
            </Badge>
            {source.connected && (
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm">
            <span className="text-muted-foreground">Supported formats:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {source.supportedFormats.slice(0, 3).map(format => (
                <Badge key={format} variant="outline" className="text-xs">
                  {format}
                </Badge>
              ))}
              {source.supportedFormats.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{source.supportedFormats.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>

        {source.connected && (
          <div className="text-xs text-muted-foreground">
            Last sync: {formatDuration(source.lastSync)} ago
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onConfigure(source)}
            className="text-xs"
          >
            <Settings className="w-3 h-3 mr-1" />
            Configure
          </Button>

          {source.connected ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDisconnect(source.id)}
              className="text-xs text-destructive"
            >
              <X className="w-3 h-3 mr-1" />
              Disconnect
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => onConnect(source.id)}
              className="ff-btn-primary text-xs"
            >
              <Globe className="w-3 h-3 mr-1" />
              Connect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}