import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Lock, LogIn, UserPlus, Shield, Zap, Crown } from 'lucide-react';
import { motion } from 'motion/react';
import type { PageType } from '../../types/core';

interface AuthRequiredPageProps {
  onPageChange: (page: PageType) => void;
}

export default function AuthRequiredPage({ onPageChange }: AuthRequiredPageProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="relative">
              <Lock className="w-16 h-16 text-primary mx-auto" />
              <Shield className="w-6 h-6 text-secondary absolute -top-1 -right-1" />
            </div>
            <h1 className="text-3xl font-bold ff-text-gradient">Authentication Required</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Please sign in or create an account to access FlashFusion's powerful AI tools and features.
            </p>
          </div>

          {/* Auth Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="ff-card-interactive">
              <CardHeader className="text-center">
                <LogIn className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Already have an account? Sign in to continue.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full ff-btn-primary">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button variant="outline" className="w-full">
                  Sign in with Google
                </Button>
                <Button variant="outline" className="w-full">
                  Sign in with GitHub
                </Button>
              </CardContent>
            </Card>

            <Card className="ff-card-interactive">
              <CardHeader className="text-center">
                <UserPlus className="w-8 h-8 text-secondary mx-auto mb-2" />
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  New to FlashFusion? Start your free account today.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full ff-btn-secondary">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Free Account
                </Button>
                <Button variant="outline" className="w-full">
                  Sign up with Google
                </Button>
                <Button variant="outline" className="w-full">
                  Sign up with GitHub
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Features Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">What You'll Get Access To</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <Zap className="w-8 h-8 text-primary mx-auto" />
                  <h4 className="font-medium">60+ AI Tools</h4>
                  <p className="text-sm text-muted-foreground">
                    Access our complete suite of AI-powered creation tools
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <Crown className="w-8 h-8 text-secondary mx-auto" />
                  <h4 className="font-medium">Creator Commerce</h4>
                  <p className="text-sm text-muted-foreground">
                    Build and monetize your content with our commerce platform
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <Shield className="w-8 h-8 text-accent mx-auto" />
                  <h4 className="font-medium">Validation Suite</h4>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive validation and quality assurance tools
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alternative Actions */}
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Want to explore first?
            </p>
            <div className="flex justify-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => onPageChange('demo')}
              >
                View Demo
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => onPageChange('features')}
              >
                See Features
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => onPageChange('pricing')}
              >
                View Pricing
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}