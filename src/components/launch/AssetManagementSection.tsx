import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { AssetManagementSectionProps } from './LaunchPreparationHub.types';
import { BarChart3, Calendar, Camera, Download, Edit, FileText, Mail, Share2, TrendingUp, Users } from 'lucide-react';

export function AssetManagementSection({ onGeneratePressKit }: AssetManagementSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-[var(--ff-text-primary)] flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Visual Assets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full border-[var(--border)]">
            <Download className="w-4 h-4 mr-2" />
            Logo Package
          </Button>
          <Button variant="outline" className="w-full border-[var(--border)]">
            <Camera className="w-4 h-4 mr-2" />
            Screenshots
          </Button>
          <Button
            onClick={onGeneratePressKit}
            className="w-full bg-[var(--ff-primary)] hover:bg-[var(--ff-primary-600)] text-white"
          >
            <FileText className="w-4 h-4 mr-2" />
            Press Kit
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-[var(--ff-text-primary)] flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Social Media
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full border-[var(--border)]">
            <Edit className="w-4 h-4 mr-2" />
            Create Posts
          </Button>
          <Button variant="outline" className="w-full border-[var(--border)]">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Campaign
          </Button>
          <Button variant="outline" className="w-full border-[var(--border)]">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-[var(--ff-text-primary)] flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Marketing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full border-[var(--border)]">
            <Edit className="w-4 h-4 mr-2" />
            Create Sequence
          </Button>
          <Button variant="outline" className="w-full border-[var(--border)]">
            <Users className="w-4 h-4 mr-2" />
            Manage Lists
          </Button>
          <Button variant="outline" className="w-full border-[var(--border)]">
            <TrendingUp className="w-4 h-4 mr-2" />
            Track Performance
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default AssetManagementSection;
