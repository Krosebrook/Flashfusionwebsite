import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Rocket, Plus, ExternalLink, Clock } from 'lucide-react';
import { UserRole } from '../../types';
import { deploymentService } from '../../services/database';

interface DeploymentsPageProps {
  userRole?: UserRole;
  onDeploy: () => void;
}

export function DeploymentsPage({ userRole = 'free', onDeploy }: DeploymentsPageProps) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold ff-text-gradient">Deployments</h1>
          <p className="text-muted-foreground mt-2">
            Deploy your projects to production
          </p>
        </div>
        <Button onClick={onDeploy} className="ff-btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Deployment
        </Button>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            Recent Deployments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Rocket className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No deployments yet</p>
            <p className="text-sm">Start by deploying your first project</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}