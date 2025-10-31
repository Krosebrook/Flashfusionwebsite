/**
 * @fileoverview Legal compliance section for LaunchPreparationHub
 */

import { Alert, AlertDescription } from '../../ui/alert';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Textarea } from '../../ui/textarea';
import { Shield } from 'lucide-react';

export function LegalComplianceSection() {
  return (
    <>
      <Alert className="border-[var(--ff-error)] bg-[var(--ff-error)]/10">
        <Shield className="h-4 w-4 text-[var(--ff-error)]" />
        <AlertDescription className="text-[var(--ff-text-secondary)]">
          <strong className="text-[var(--ff-error)]">Legal Compliance:</strong> Ensure all legal documents, privacy policies, and compliance requirements are properly configured before launch.
        </AlertDescription>
      </Alert>

      <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-[var(--ff-text-primary)]">Legal Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[var(--ff-text-primary)]">Terms of Service</span>
            <Badge variant="default" className="bg-[var(--ff-success)] text-white">Complete</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--ff-text-primary)]">Privacy Policy</span>
            <Badge variant="default" className="bg-[var(--ff-success)] text-white">Complete</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--ff-text-primary)]">Cookie Policy</span>
            <Badge variant="secondary">Review</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--ff-text-primary)]">GDPR Compliance</span>
            <Badge variant="default" className="bg-[var(--ff-success)] text-white">Complete</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--ff-text-primary)]">Data Processing Agreement</span>
            <Badge variant="outline">Draft</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[var(--ff-surface-light)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-[var(--ff-text-primary)]">Compliance &amp; Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[var(--ff-text-primary)]">SOC 2 Type II</span>
            <Badge variant="default" className="bg-[var(--ff-success)] text-white">Certified</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--ff-text-primary)]">ISO 27001</span>
            <Badge variant="secondary">In Progress</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--ff-text-primary)]">CCPA Compliance</span>
            <Badge variant="default" className="bg-[var(--ff-success)] text-white">Complete</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--ff-text-primary)]">PCI DSS</span>
            <Badge variant="outline">Not Required</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--ff-text-primary)]">Security Audit</span>
            <Badge variant="default" className="bg-[var(--ff-success)] text-white">Passed</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[var(--ff-surface)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-[var(--ff-text-primary)]">Legal Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[var(--ff-text-primary)]">Company Legal Name</Label>
              <Input
                defaultValue="FlashFusion, Inc."
                className="bg-[var(--input-background)] border-[var(--border)]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[var(--ff-text-primary)]">Jurisdiction</Label>
              <Select defaultValue="delaware">
                <SelectTrigger className="bg-[var(--input-background)] border-[var(--border)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delaware">Delaware, USA</SelectItem>
                  <SelectItem value="california">California, USA</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="eu">European Union</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[var(--ff-text-primary)]">Data Protection Officer Email</Label>
            <Input
              defaultValue="dpo@flashfusion.ai"
              className="bg-[var(--input-background)] border-[var(--border)]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[var(--ff-text-primary)]">Legal Contact Address</Label>
            <Textarea
              defaultValue="123 Innovation Drive, San Francisco, CA 94105, USA"
              className="bg-[var(--input-background)] border-[var(--border)]"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
