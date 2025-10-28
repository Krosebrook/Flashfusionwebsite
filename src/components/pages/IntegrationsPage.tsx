import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Plug } from 'lucide-react';
import { UserRole } from '../../types';

interface IntegrationsPageProps {
  userRole?: UserRole;
}

export function IntegrationsPage({ userRole = 'free' }: IntegrationsPageProps) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold ff-text-gradient">Integrations</h1>
        <p className="text-muted-foreground mt-2">
          Connect FlashFusion with your favorite tools
        </p>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plug className="w-5 h-5 text-primary" />
            Available Integrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Plug className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Integrations coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}