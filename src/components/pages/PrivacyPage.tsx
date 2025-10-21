import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Shield, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function PrivacyPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-2">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="ff-text-gradient">Privacy Policy</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Your privacy is important to us. Learn how we collect, use, and protect your information on FlashFusion.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="ff-card-interactive">
          <CardHeader className="text-center">
            <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
            <CardTitle>Privacy Policy Coming Soon</CardTitle>
            <CardDescription>
              We're finalizing our comprehensive privacy policy that will detail our commitment to protecting your data and privacy.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Badge className="ff-badge-glow">
              In Development
            </Badge>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}