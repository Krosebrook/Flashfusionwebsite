import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { 
  User, Settings, Palette, Bell, Shield, CreditCard, 
  Key, Globe, Moon, Sun, Monitor, Upload, Download,
  Trash2, Edit3, Save, X, Check, AlertTriangle,
  Smartphone, Laptop, Tablet, Users, Crown, Star,
  Activity, Clock, MapPin, Calendar, Github, Twitter,
  Linkedin, Mail, Link, Eye, EyeOff, Zap, Database
} from 'lucide-react';
import { toast } from 'sonner';

interface UserProfileSettingsHubProps {
  onClose?: () => void;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  bio: string;
  location: string;
  website: string;
  company: string;
  joinDate: Date;
  avatarUrl: string;
  tier: 'free' | 'pro' | 'enterprise';
  timezone: string;
  language: string;
  socialLinks: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

interface AppPreferences {
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
  language: string;
  timezone: string;
  autoSave: boolean;
  betaFeatures: boolean;
  analyticsTracking: boolean;
  marketingEmails: boolean;
  productUpdates: boolean;
  securityAlerts: boolean;
  collaborationNotifications: boolean;
  keyboardShortcuts: boolean;
  reducedMotion: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  smsNotifications: boolean;
  emailNotifications: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
  trustedDevices: Array<{
    id: string;
    name: string;
    type: 'desktop' | 'mobile' | 'tablet';
    lastUsed: Date;
    location: string;
  }>;
  activeSessions: Array<{
    id: string;
    device: string;
    location: string;
    lastActive: Date;
    current: boolean;
  }>;
}

interface BillingInfo {
  currentPlan: 'free' | 'pro' | 'enterprise';
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: Date;
  paymentMethod: {
    type: 'card' | 'paypal';
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
  };
  billingHistory: Array<{
    id: string;
    date: Date;
    amount: number;
    description: string;
    status: 'paid' | 'pending' | 'failed';
  }>;
  usage: {
    toolsUsed: number;
    projectsCreated: number;
    storageUsed: number;
    apiCalls: number;
    limits: {
      tools: number;
      projects: number;
      storage: number;
      apiCalls: number;
    };
  };
}

// Mock data - replace with real data from Supabase
const mockUserProfile: UserProfile = {
  id: 'user-123',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  username: 'alexj_dev',
  bio: 'Full-stack developer passionate about AI and automation. Building the future of web development.',
  location: 'San Francisco, CA',
  website: 'https://alexjohnson.dev',
  company: 'FlashFusion Inc.',
  joinDate: new Date('2024-01-15'),
  avatarUrl: '',
  tier: 'pro',
  timezone: 'America/Los_Angeles',
  language: 'en',
  socialLinks: {
    github: 'alexj_dev',
    twitter: 'alexjohnsondev',
    linkedin: 'alexjohnson-dev'
  }
};

const mockAppPreferences: AppPreferences = {
  theme: 'dark',
  primaryColor: '#FF7B00',
  fontSize: 'medium',
  language: 'en',
  timezone: 'America/Los_Angeles',
  autoSave: true,
  betaFeatures: false,
  analyticsTracking: true,
  marketingEmails: false,
  productUpdates: true,
  securityAlerts: true,
  collaborationNotifications: true,
  keyboardShortcuts: true,
  reducedMotion: false
};

const mockSecuritySettings: SecuritySettings = {
  twoFactorEnabled: true,
  smsNotifications: true,
  emailNotifications: true,
  loginAlerts: true,
  sessionTimeout: 30,
  trustedDevices: [
    {
      id: 'device-1',
      name: 'MacBook Pro',
      type: 'desktop',
      lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
      location: 'San Francisco, CA'
    },
    {
      id: 'device-2',
      name: 'iPhone 15 Pro',
      type: 'mobile',
      lastUsed: new Date(Date.now() - 30 * 60 * 1000),
      location: 'San Francisco, CA'
    }
  ],
  activeSession: [
    {
      id: 'session-1',
      device: 'MacBook Pro - Chrome',
      location: 'San Francisco, CA',
      lastActive: new Date(),
      current: true
    },
    {
      id: 'session-2',
      device: 'iPhone 15 Pro - Safari',
      location: 'San Francisco, CA',
      lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
      current: false
    }
  ]
};

const mockBillingInfo: BillingInfo = {
  currentPlan: 'pro',
  billingCycle: 'monthly',
  nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  paymentMethod: {
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    expiryMonth: 12,
    expiryYear: 2028
  },
  billingHistory: [
    {
      id: 'inv-123',
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      amount: 29.99,
      description: 'Pro Plan - Monthly',
      status: 'paid'
    },
    {
      id: 'inv-122',
      date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      amount: 29.99,
      description: 'Pro Plan - Monthly',
      status: 'paid'
    }
  ],
  usage: {
    toolsUsed: 47,
    projectsCreated: 12,
    storageUsed: 2.4,
    apiCalls: 8420,
    limits: {
      tools: 100,
      projects: 50,
      storage: 10,
      apiCalls: 50000
    }
  }
};

export function UserProfileSettingsHub({ onClose }: UserProfileSettingsHubProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Profile state
  const [profile, setProfile] = useState(mockUserProfile);
  const [preferences, setPreferences] = useState(mockAppPreferences);
  const [security, setSecurity] = useState(mockSecuritySettings);
  const [billing] = useState(mockBillingInfo);
  
  // Form state
  const [formData, setFormData] = useState(profile);
  const [preferencesData, setPreferencesData] = useState(preferences);

  const handleSaveProfile = useCallback(async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfile(formData);
      setIsEditing(false);
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [formData]);

  const handleSavePreferences = useCallback(async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setPreferences(preferencesData);
      
      toast.success('Preferences saved successfully!');
    } catch (error) {
      console.error('Failed to save preferences:', error);
      toast.error('Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [preferencesData]);

  const handleUploadAvatar = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const avatarUrl = e.target?.result as string;
          setFormData(prev => ({ ...prev, avatarUrl }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, []);

  const handleCancelEdit = useCallback(() => {
    setFormData(profile);
    setIsEditing(false);
  }, [profile]);

  const handleDeleteAccount = useCallback(() => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion initiated. You will receive a confirmation email.');
    }
  }, []);

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'pro':
        return <Crown className="w-4 h-4 text-primary" />;
      case 'enterprise':
        return <Star className="w-4 h-4 text-accent" />;
      default:
        return <User className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      default:
        return <Laptop className="w-4 h-4" />;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-card border border-border rounded-lg shadow-lg ff-fade-in-up">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={profile.avatarUrl} alt={profile.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold ff-text-gradient">Profile & Settings</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-muted-foreground">@{profile.username}</p>
              <Badge variant="outline" className="flex items-center gap-1">
                {getTierIcon(profile.tier)}
                {profile.tier}
              </Badge>
            </div>
          </div>
        </div>

        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="ff-hover-scale">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6 space-y-6">
            <Card className="ff-card-interactive">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                          className="ff-btn-primary"
                        >
                          {isSaving ? (
                            <>
                              <Clock className="w-4 h-4 mr-1 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-1" />
                              Save
                            </>
                          )}
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={formData.avatarUrl} alt={formData.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                        {formData.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleUploadAvatar}
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                      >
                        <Upload className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          disabled={!isEditing}
                          className="ff-focus-ring"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                          disabled={!isEditing}
                          className="ff-focus-ring"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        className="ff-focus-ring"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        disabled={!isEditing}
                        rows={3}
                        className="ff-focus-ring"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        disabled={!isEditing}
                        className="ff-focus-ring"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          disabled={!isEditing}
                          className="pl-9 ff-focus-ring"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <div className="relative">
                        <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                          disabled={!isEditing}
                          className="pl-9 ff-focus-ring"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-foreground">Social Links</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="github">GitHub</Label>
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="github"
                          value={formData.socialLinks.github || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            socialLinks: { ...prev.socialLinks, github: e.target.value }
                          }))}
                          disabled={!isEditing}
                          className="pl-9 ff-focus-ring"
                          placeholder="username"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="twitter">Twitter</Label>
                      <div className="relative">
                        <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="twitter"
                          value={formData.socialLinks.twitter || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                          }))}
                          disabled={!isEditing}
                          className="pl-9 ff-focus-ring"
                          placeholder="username"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="linkedin"
                          value={formData.socialLinks.linkedin || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                          }))}
                          disabled={!isEditing}
                          className="pl-9 ff-focus-ring"
                          placeholder="username"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {profile.joinDate.toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity className="w-4 h-4" />
                    Last active 2 minutes ago
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="mt-6 space-y-6">
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle>Application Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Appearance</h4>
                    
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <Select
                        value={preferencesData.theme}
                        onValueChange={(value: 'light' | 'dark' | 'system') =>
                          setPreferencesData(prev => ({ ...prev, theme: value }))
                        }
                      >
                        <SelectTrigger className="ff-focus-ring">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">
                            <div className="flex items-center gap-2">
                              <Sun className="w-4 h-4" />
                              Light
                            </div>
                          </SelectItem>
                          <SelectItem value="dark">
                            <div className="flex items-center gap-2">
                              <Moon className="w-4 h-4" />
                              Dark
                            </div>
                          </SelectItem>
                          <SelectItem value="system">
                            <div className="flex items-center gap-2">
                              <Monitor className="w-4 h-4" />
                              System
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Font Size</Label>
                      <Select
                        value={preferencesData.fontSize}
                        onValueChange={(value: 'small' | 'medium' | 'large') =>
                          setPreferencesData(prev => ({ ...prev, fontSize: value }))
                        }
                      >
                        <SelectTrigger className="ff-focus-ring">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select
                        value={preferencesData.language}
                        onValueChange={(value) =>
                          setPreferencesData(prev => ({ ...prev, language: value }))
                        }
                      >
                        <SelectTrigger className="ff-focus-ring">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                          <SelectItem value="ja">日本語</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Behavior</h4>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-save</Label>
                        <p className="text-xs text-muted-foreground">
                          Automatically save your work
                        </p>
                      </div>
                      <Switch
                        checked={preferencesData.autoSave}
                        onCheckedChange={(checked) =>
                          setPreferencesData(prev => ({ ...prev, autoSave: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Keyboard shortcuts</Label>
                        <p className="text-xs text-muted-foreground">
                          Enable keyboard navigation
                        </p>
                      </div>
                      <Switch
                        checked={preferencesData.keyboardShortcuts}
                        onCheckedChange={(checked) =>
                          setPreferencesData(prev => ({ ...prev, keyboardShortcuts: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Reduced motion</Label>
                        <p className="text-xs text-muted-foreground">
                          Minimize animations
                        </p>
                      </div>
                      <Switch
                        checked={preferencesData.reducedMotion}
                        onCheckedChange={(checked) =>
                          setPreferencesData(prev => ({ ...prev, reducedMotion: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Beta features</Label>
                        <p className="text-xs text-muted-foreground">
                          Access experimental features
                        </p>
                      </div>
                      <Switch
                        checked={preferencesData.betaFeatures}
                        onCheckedChange={(checked) =>
                          setPreferencesData(prev => ({ ...prev, betaFeatures: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Notifications</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Product updates</Label>
                        <p className="text-xs text-muted-foreground">
                          New features and improvements
                        </p>
                      </div>
                      <Switch
                        checked={preferencesData.productUpdates}
                        onCheckedChange={(checked) =>
                          setPreferencesData(prev => ({ ...prev, productUpdates: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Security alerts</Label>
                        <p className="text-xs text-muted-foreground">
                          Important security notifications
                        </p>
                      </div>
                      <Switch
                        checked={preferencesData.securityAlerts}
                        onCheckedChange={(checked) =>
                          setPreferencesData(prev => ({ ...prev, securityAlerts: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Collaboration</Label>
                        <p className="text-xs text-muted-foreground">
                          Team and project notifications
                        </p>
                      </div>
                      <Switch
                        checked={preferencesData.collaborationNotifications}
                        onCheckedChange={(checked) =>
                          setPreferencesData(prev => ({ ...prev, collaborationNotifications: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Marketing emails</Label>
                        <p className="text-xs text-muted-foreground">
                          Tips and promotional content
                        </p>
                      </div>
                      <Switch
                        checked={preferencesData.marketingEmails}
                        onCheckedChange={(checked) =>
                          setPreferencesData(prev => ({ ...prev, marketingEmails: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSavePreferences} disabled={isSaving} className="ff-btn-primary">
                    {isSaving ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6 space-y-6">
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Authentication</h4>
                    
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="space-y-0.5">
                        <Label>Two-factor authentication</Label>
                        <p className="text-xs text-muted-foreground">
                          Add an extra layer of security
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {security.twoFactorEnabled ? (
                          <Badge variant="default" className="bg-success/10 text-success border-success/20">
                            <Check className="w-3 h-3 mr-1" />
                            Enabled
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-warning border-warning/20">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Disabled
                          </Badge>
                        )}
                        <Button size="sm" variant="outline">
                          {security.twoFactorEnabled ? 'Disable' : 'Enable'}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>SMS notifications</Label>
                          <p className="text-xs text-muted-foreground">
                            Receive security alerts via SMS
                          </p>
                        </div>
                        <Switch
                          checked={security.smsNotifications}
                          onCheckedChange={(checked) =>
                            setSecurity(prev => ({ ...prev, smsNotifications: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email notifications</Label>
                          <p className="text-xs text-muted-foreground">
                            Security alerts via email
                          </p>
                        </div>
                        <Switch
                          checked={security.emailNotifications}
                          onCheckedChange={(checked) =>
                            setSecurity(prev => ({ ...prev, emailNotifications: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Login alerts</Label>
                          <p className="text-xs text-muted-foreground">
                            Notify on new device logins
                          </p>
                        </div>
                        <Switch
                          checked={security.loginAlerts}
                          onCheckedChange={(checked) =>
                            setSecurity(prev => ({ ...prev, loginAlerts: checked }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Password</h4>
                    
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Key className="w-4 h-4 mr-2" />
                        Change Password
                      </Button>
                      
                      <div className="space-y-2">
                        <Label>Session timeout</Label>
                        <Select
                          value={security.sessionTimeout.toString()}
                          onValueChange={(value) =>
                            setSecurity(prev => ({ ...prev, sessionTimeout: parseInt(value) }))
                          }
                        >
                          <SelectTrigger className="ff-focus-ring">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="240">4 hours</SelectItem>
                            <SelectItem value="480">8 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Active Sessions</h4>
                  <div className="space-y-3">
                    {security.activeSession.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getDeviceIcon(session.device.toLowerCase().includes('iphone') ? 'mobile' : 'desktop')}
                          <div>
                            <p className="text-sm font-medium">{session.device}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{session.location}</span>
                              <span>•</span>
                              <span>Last active {session.lastActive.toLocaleTimeString()}</span>
                              {session.current && (
                                <>
                                  <span>•</span>
                                  <Badge variant="default" className="text-xs bg-success/10 text-success">
                                    Current session
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        {!session.current && (
                          <Button size="sm" variant="outline" className="text-destructive">
                            Revoke
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Trusted Devices</h4>
                  <div className="space-y-3">
                    {security.trustedDevices.map((device) => (
                      <div key={device.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getDeviceIcon(device.type)}
                          <div>
                            <p className="text-sm font-medium">{device.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{device.location}</span>
                              <span>•</span>
                              <span>Last used {device.lastUsed.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="text-destructive">
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTierIcon(billing.currentPlan)}
                      <div>
                        <h3 className="text-lg font-semibold capitalize">{billing.currentPlan} Plan</h3>
                        <p className="text-sm text-muted-foreground">
                          Billed {billing.billingCycle}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">$29.99</p>
                      <p className="text-sm text-muted-foreground">per month</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Next billing date</span>
                      <span>{billing.nextBillingDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Payment method</span>
                      <span>{billing.paymentMethod.brand} •••• {billing.paymentMethod.last4}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      Upgrade Plan
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Manage Billing
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle>Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>AI Tools Used</span>
                        <span>{billing.usage.toolsUsed} / {billing.usage.limits.tools}</span>
                      </div>
                      <Progress value={getUsagePercentage(billing.usage.toolsUsed, billing.usage.limits.tools)} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Projects Created</span>
                        <span>{billing.usage.projectsCreated} / {billing.usage.limits.projects}</span>
                      </div>
                      <Progress value={getUsagePercentage(billing.usage.projectsCreated, billing.usage.limits.projects)} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Storage Used</span>
                        <span>{billing.usage.storageUsed} GB / {billing.usage.limits.storage} GB</span>
                      </div>
                      <Progress value={getUsagePercentage(billing.usage.storageUsed, billing.usage.limits.storage)} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>API Calls</span>
                        <span>{billing.usage.apiCalls.toLocaleString()} / {billing.usage.limits.apiCalls.toLocaleString()}</span>
                      </div>
                      <Progress value={getUsagePercentage(billing.usage.apiCalls, billing.usage.limits.apiCalls)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {billing.billingHistory.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{invoice.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {invoice.date.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">${invoice.amount}</span>
                        <Badge 
                          variant={invoice.status === 'paid' ? 'default' : 'outline'}
                          className={
                            invoice.status === 'paid' ? 'bg-success/10 text-success border-success/20' :
                            invoice.status === 'pending' ? 'bg-warning/10 text-warning border-warning/20' :
                            'bg-destructive/10 text-destructive border-destructive/20'
                          }
                        >
                          {invoice.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="mt-6 space-y-6">
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Data & Privacy</h4>
                    
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Export My Data
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start">
                        <Eye className="w-4 h-4 mr-2" />
                        View Privacy Settings
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start">
                        <Activity className="w-4 h-4 mr-2" />
                        Download Activity Log
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Account Actions</h4>
                    
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Transfer Ownership
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start">
                        <Clock className="w-4 h-4 mr-2" />
                        Deactivate Account
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    <h4 className="text-sm font-medium text-destructive">Danger Zone</h4>
                  </div>
                  
                  <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-sm font-medium">Delete Account</h5>
                        <p className="text-xs text-muted-foreground">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                      </div>
                      
                      <Button 
                        variant="destructive" 
                        onClick={handleDeleteAccount}
                        className="w-full sm:w-auto"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default UserProfileSettingsHub;