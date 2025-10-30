/**
 * @fileoverview Content requests section for LaunchPreparationHub
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Calendar, FileEdit } from 'lucide-react';
import type { ContentRequest } from '../LaunchPreparationHub.types';

interface ContentRequestsSectionProps {
  readonly requests: ContentRequest[];
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  pending: 'outline',
  'in-progress': 'secondary',
  review: 'secondary',
  completed: 'default',
  approved: 'default',
};

export function ContentRequestsSection({ requests }: ContentRequestsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Production Queue</CardTitle>
        <CardDescription>Editorial and creative assets required before launch marketing activation.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{requests.length} requests</span> spanning press, email, and social channels.
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead className="text-right">Deadline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileEdit className="h-4 w-4 text-primary" />
                    {request.title}
                  </div>
                </TableCell>
                <TableCell>{request.type}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[request.status] ?? 'outline'} className="capitalize">
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={request.priority === 'high' ? 'destructive' : request.priority === 'medium' ? 'secondary' : 'outline'}>
                    {request.priority}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  <div className="flex items-center justify-end gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(request.deadline).toLocaleDateString()}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
