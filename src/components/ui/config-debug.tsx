import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { ENV, isDevelopment } from '../../lib/env';
import { 
  Settings, 
  Monitor, 
  Database, 
  Zap, 
  Eye, 
  EyeOff,
  Copy,
  RefreshCw,
  Bug,
  Wifi
} from 'lucide-react';

interface SystemInfo {
  userAgent: string;
  viewport: { width: number; height: number };
  colorScheme: string;
  reducedMotion: boolean;
  connection: string;
  memory?: number;
  cores?: number;
}

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  memoryUsage?: number;
  renderTime: number;
}

export function ConfigDebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [storageInfo, setStorageInfo] = useState<Record<string, any>>({});
  const [environmentVars, setEnvironmentVars] = useState<Record<string, string>>({});

  useEffect(() => {
    // Collect system information
    const updateSystemInfo = () => {
      const info: SystemInfo = {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        connection: (navigator as any).connection?.effectiveType || 'unknown'
      };

      // Add memory info if available
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        info.memory = memory.usedJSHeapSize / 1024 / 1024; // MB
      }

      // Add CPU info if available
      if ('hardwareConcurrency' in navigator) {
        info.cores = navigator.hardwareConcurrency;
      }

      setSystemInfo(info);
    };

    // Collect performance metrics
    const updatePerformanceMetrics = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const metrics: PerformanceMetrics = {
          loadTime: navigation.loadEventEnd - navigation.fetchStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
          renderTime: navigation.loadEventStart - navigation.fetchStart
        };

        // Add memory usage if available
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024;
        }

        setPerformanceMetrics(metrics);
      }
    };

    // Collect storage information
    const updateStorageInfo = () => {
      const storage: Record<string, any> = {};
      
      try {
        // LocalStorage
        storage.localStorage = {
          itemCount: localStorage.length,
          items: {}
        };
        
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            storage.localStorage.items[key] = localStorage.getItem(key)?.substring(0, 100) + '...';
          }
        }

        // SessionStorage
        storage.sessionStorage = {
          itemCount: sessionStorage.length,
          items: {}
        };
        
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key) {
            storage.sessionStorage.items[key] = sessionStorage.getItem(key)?.substring(0, 100) + '...';
          }
        }
      } catch (error) {
        storage.error = 'Storage access denied';
      }

      setStorageInfo(storage);
    };

    // Collect environment variables (only safe ones for client)
    const updateEnvironmentVars = () => {
      const env: Record<string, string> = {};
      
      try {
        // Use centralized environment configuration
        env['NODE_ENV'] = ENV.NODE_ENV || 'unknown';
        env['MODE'] = ENV.MODE || 'unknown';
        env['VITE_APP_NAME'] = ENV.VITE_APP_NAME || 'N/A';
        env['VITE_APP_VERSION'] = ENV.VITE_APP_VERSION || 'N/A';
        env['VITE_BUILD_TIME'] = ENV.VITE_BUILD_TIME || 'N/A';
        env['VITE_ENABLE_ANALYTICS'] = ENV.VITE_ENABLE_ANALYTICS || 'N/A';
        env['VITE_ENABLE_DEBUG'] = ENV.VITE_ENABLE_DEBUG || 'N/A';
      } catch (error) {
        console.warn('Failed to load environment variables:', error);
        env['ERROR'] = 'Failed to load environment variables';
      }

      setEnvironmentVars(env);
    };

    if (isOpen) {
      updateSystemInfo();
      updatePerformanceMetrics();
      updateStorageInfo();
      updateEnvironmentVars();

      // Update system info on resize
      window.addEventListener('resize', updateSystemInfo);
      return () => window.removeEventListener('resize', updateSystemInfo);
    }
  }, [isOpen]);

  const copyToClipboard = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      .then(() => console.log('Debug info copied to clipboard'))
      .catch(console.error);
  };

  const refreshData = () => {
    setSystemInfo(null);
    setPerformanceMetrics(null);
    setStorageInfo({});
    setEnvironmentVars({});
    
    // Trigger re-collection
    setTimeout(() => {
      if (isOpen) {
        window.location.reload();
      }
    }, 100);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary/10"
        >
          <Bug className="h-4 w-4 mr-2" />
          Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden ff-card-interactive">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-primary" />
            FlashFusion Debug Panel
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Development Mode
            </Badge>
            <Button size="sm" variant="outline" onClick={refreshData}>
              <RefreshCw className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsOpen(false)}>
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs defaultValue="system" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mx-6 mb-4">
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Monitor className="h-3 w-3" />
                System
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <Zap className="h-3 w-3" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="storage" className="flex items-center gap-2">
                <Database className="h-3 w-3" />
                Storage
              </TabsTrigger>
              <TabsTrigger value="environment" className="flex items-center gap-2">
                <Settings className="h-3 w-3" />
                Environment
              </TabsTrigger>
            </TabsList>

            <div className="max-h-96 overflow-y-auto px-6 pb-6">
              <TabsContent value="system" className="space-y-4">
                {systemInfo && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">System Information</h4>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(systemInfo)}>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Viewport:</span>{' '}
                        {systemInfo.viewport.width} × {systemInfo.viewport.height}
                      </div>
                      <div>
                        <span className="font-medium">Color Scheme:</span>{' '}
                        {systemInfo.colorScheme}
                      </div>
                      <div>
                        <span className="font-medium">Reduced Motion:</span>{' '}
                        {systemInfo.reducedMotion ? 'Yes' : 'No'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Wifi className="h-3 w-3" />
                        <span className="font-medium">Connection:</span>{' '}
                        {systemInfo.connection}
                      </div>
                      {systemInfo.memory && (
                        <div>
                          <span className="font-medium">Memory Used:</span>{' '}
                          {systemInfo.memory.toFixed(2)} MB
                        </div>
                      )}
                      {systemInfo.cores && (
                        <div>
                          <span className="font-medium">CPU Cores:</span>{' '}
                          {systemInfo.cores}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <span className="font-medium text-sm">User Agent:</span>
                      <pre className="text-xs bg-muted/50 p-2 rounded mt-1 whitespace-pre-wrap">
                        {systemInfo.userAgent}
                      </pre>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                {performanceMetrics && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">Performance Metrics</h4>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(performanceMetrics)}>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Page Load:</span>{' '}
                        {performanceMetrics.loadTime.toFixed(2)} ms
                      </div>
                      <div>
                        <span className="font-medium">DOM Ready:</span>{' '}
                        {performanceMetrics.domContentLoaded.toFixed(2)} ms
                      </div>
                      <div>
                        <span className="font-medium">Render Time:</span>{' '}
                        {performanceMetrics.renderTime.toFixed(2)} ms
                      </div>
                      {performanceMetrics.memoryUsage && (
                        <div>
                          <span className="font-medium">Memory Usage:</span>{' '}
                          {performanceMetrics.memoryUsage.toFixed(2)} MB
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="storage" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Storage Information</h4>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(storageInfo)}>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  
                  {storageInfo.localStorage && (
                    <div>
                      <h5 className="font-medium text-sm mb-2">LocalStorage ({storageInfo.localStorage.itemCount} items)</h5>
                      <div className="text-xs bg-muted/50 p-2 rounded max-h-32 overflow-y-auto">
                        {Object.entries(storageInfo.localStorage.items).map(([key, value]) => (
                          <div key={key} className="mb-1">
                            <span className="font-medium text-primary">{key}:</span> {value as string}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {storageInfo.sessionStorage && (
                    <div>
                      <h5 className="font-medium text-sm mb-2">SessionStorage ({storageInfo.sessionStorage.itemCount} items)</h5>
                      <div className="text-xs bg-muted/50 p-2 rounded max-h-32 overflow-y-auto">
                        {Object.entries(storageInfo.sessionStorage.items).map(([key, value]) => (
                          <div key={key} className="mb-1">
                            <span className="font-medium text-secondary">{key}:</span> {value as string}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="environment" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Environment Variables</h4>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(environmentVars)}>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  
                  <div className="text-sm space-y-2">
                    {Object.entries(environmentVars).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium">{key}:</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded">
                    <p className="font-medium mb-1">Note:</p>
                    <p>Only safe, non-sensitive environment variables are displayed here. Sensitive keys like API tokens are never exposed in the debug panel.</p>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default ConfigDebugPanel;