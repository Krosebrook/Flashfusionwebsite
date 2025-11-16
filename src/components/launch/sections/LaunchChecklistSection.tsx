/**
 * @fileoverview Launch checklist section for LaunchPreparationHub
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { CheckCircle2 } from 'lucide-react';
import type { LaunchChecklistCategory } from '../LaunchPreparationHub.types';

interface LaunchChecklistSectionProps {
  readonly checklist: LaunchChecklistCategory[];
  readonly completionPercentage: number;
}

export function LaunchChecklistSection({ checklist, completionPercentage }: LaunchChecklistSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Launch Checklist</CardTitle>
        <CardDescription>Cross-functional milestones spanning marketing, legal, product, and support readiness.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
            <span>Checklist completion</span>
            <Badge variant="secondary">{Math.round(completionPercentage)}% complete</Badge>
          </div>
          <Progress value={completionPercentage} className="mt-3" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {checklist.map((category) => (
            <Card key={category.category} className="border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{category.category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {category.items.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
