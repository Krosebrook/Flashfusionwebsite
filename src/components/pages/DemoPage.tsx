import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Play, Zap, Settings, TestTube } from 'lucide-react';
import { motion } from 'motion/react';
import { FeatureFlagDemo } from '../demo/FeatureFlagDemo';
import { InteractiveDemo } from '../demo/InteractiveDemo';

export default function DemoPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-2">
          <Play className="w-8 h-8 text-primary" />
          <h1 className="ff-text-gradient">Live Demo</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Experience FlashFusion in action with our interactive demo showcasing the power of AI-driven development.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs defaultValue="feature-flags" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="feature-flags" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Feature Flags
            </TabsTrigger>
            <TabsTrigger value="interactive" className="flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              Interactive
            </TabsTrigger>
            <TabsTrigger value="full-demo" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Full Demo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feature-flags" className="mt-6">
            <FeatureFlagDemo />
          </TabsContent>

          <TabsContent value="interactive" className="mt-6">
            <InteractiveDemo />
          </TabsContent>

          <TabsContent value="full-demo" className="mt-6">
            <Card className="ff-card-interactive">
              <CardHeader className="text-center">
                <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Complete Platform Demo Coming Soon</CardTitle>
                <CardDescription>
                  We're creating an immersive demo experience that will showcase all the capabilities of FlashFusion in real-time.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Badge className="ff-badge-glow">
                  In Development
                </Badge>
                <div className="mt-6 space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-medium mb-2">🚀 Code Generation</h4>
                      <p className="text-sm text-muted-foreground">
                        Live AI-powered code generation with multiple frameworks
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-medium mb-2">🔄 Real-time Deployment</h4>
                      <p className="text-sm text-muted-foreground">
                        Watch applications deploy to multiple platforms instantly
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-medium mb-2">🤝 Collaboration</h4>
                      <p className="text-sm text-muted-foreground">
                        Experience live multi-user collaboration features
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}