import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Eye, Play, FileText } from 'lucide-react';
import type { TemplateCardProps } from '../../../types/data-import-export';

export function TemplateCard({ template, onUse, onPreview }: TemplateCardProps) {
  const getTypeColor = (type: string) => {
    return type === 'import' 
      ? 'bg-primary/10 text-primary border-primary/20'
      : 'bg-secondary/10 text-secondary border-secondary/20';
  };

  const getTypeIcon = (type: string) => {
    return type === 'import' ? '📥' : '📤';
  };

  return (
    <Card className="ff-card-interactive">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="text-2xl">{getTypeIcon(template.type)}</div>
            <div>
              <CardTitle className="text-base">{template.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {template.description}
              </p>
            </div>
          </div>

          <Badge className={getTypeColor(template.type)}>
            {template.type}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span>Format: {template.format}</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {template.fields.length} fields • {template.sampleData.length} sample records
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Key Fields:</p>
            <div className="flex flex-wrap gap-1">
              {template.fields.slice(0, 4).map(field => (
                <Badge 
                  key={field.name} 
                  variant="outline" 
                  className={`text-xs ${field.required ? 'border-warning/30 text-warning' : ''}`}
                >
                  {field.name}
                  {field.required && '*'}
                </Badge>
              ))}
              {template.fields.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{template.fields.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPreview(template)}
            className="flex-1 text-xs"
          >
            <Eye className="w-3 h-3 mr-1" />
            Preview
          </Button>
          
          <Button
            size="sm"
            onClick={() => onUse(template)}
            className="ff-btn-primary flex-1 text-xs"
          >
            <Play className="w-3 h-3 mr-1" />
            Use Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}