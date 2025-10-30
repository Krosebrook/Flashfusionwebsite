import React from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { LaunchChecklistSectionProps } from './LaunchPreparationHub.types';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle,
  Clock,
  Download,
  Megaphone,
  Rocket,
  Share2,
  Shield,
  Users,
} from 'lucide-react';

/**
 * Launch checklist overview with quick actions.
 */
export function LaunchChecklistSection({
  checklist,
  onScheduleLaunch,
  onExportChecklist,
  onShareProgress,
}: LaunchChecklistSectionProps) {
  return (
    <>
      <Alert className="border-[var(--ff-success)] bg-[var(--ff-success)]/10">
        <CheckCircle className="h-4 w-4 text-[var(--ff-success)]" />
        <AlertDescription className="text-[var(--ff-text-secondary)]">
          <strong className="text-[var(--ff-success)]">Launch Checklist:</strong> Track completion of all essential launch
          preparation tasks across documentation, marketing, support, and legal requirements.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        {checklist.map((category, categoryIndex) => (
          <Card key={category.category} className="bg-[var(--ff-surface)] border-[var(--border)]">
            <CardHeader>
              <CardTitle className="text-[var(--ff-text-primary)] flex items-center gap-2">
                {categoryIndex === 0 && <BookOpen className="w-5 h-5" />}
                {categoryIndex === 1 && <Megaphone className="w-5 h-5" />}
                {categoryIndex === 2 && <Shield className="w-5 h-5" />}
                {categoryIndex === 3 && <Users className="w-5 h-5" />}
                {category.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.items.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {Math.random() > 0.3 ? (
                        <CheckCircle className="w-4 h-4 text-[var(--ff-success)]" />
                      ) : Math.random() > 0.5 ? (
                        <Clock className="w-4 h-4 text-[var(--ff-warning)]" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-[var(--ff-error)]" />
                      )}
                    </div>
                    <span className="text-[var(--ff-text-primary)]">{item}</span>
                    <div className="ml-auto">
                      {Math.random() > 0.3 && (
                        <Badge variant="default" className="bg-[var(--ff-success)] text-white">Done</Badge>
                      )}
                      {Math.random() > 0.7 && <Badge variant="secondary">In Progress</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-[var(--ff-text-primary)]">Launch Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              className="bg-[var(--ff-primary)] hover:bg-[var(--ff-primary-600)] text-white"
              onClick={onScheduleLaunch}
            >
              <Rocket className="w-4 h-4 mr-2" />
              Schedule Launch
            </Button>
            <Button variant="outline" className="border-[var(--border)]" onClick={onExportChecklist}>
              <Download className="w-4 h-4 mr-2" />
              Export Checklist
            </Button>
            <Button variant="outline" className="border-[var(--border)]" onClick={onShareProgress}>
              <Share2 className="w-4 h-4 mr-2" />
              Share Progress
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
