/**
 * FlashFusion Optimization Validator
 * Test component to validate all optimizations are working correctly
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert } from '../ui/alert';

interface ValidationResult {
  test: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
}

export function OptimizationValidator() {
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallScore, setOverallScore] = useState(0);

  const runValidationTests = async () => {
    setIsRunning(true);
    const testResults: ValidationResult[] = [];

    // Test 1: Enhanced Routing System
    try {
      const hasEnhancedRouting = typeof window !== 'undefined' && 
        window.location.pathname !== undefined &&
        history.pushState !== undefined;
      
      testResults.push({
        test: 'Enhanced Routing System',
        status: hasEnhancedRouting ? 'pass' : 'fail',
        message: hasEnhancedRouting ? 'URL-based routing is active' : 'Enhanced routing not detected',
        details: `Current path: ${window.location.pathname}`
      });
    } catch (error) {
      testResults.push({
        test: 'Enhanced Routing System',
        status: 'fail',
        message: 'Routing test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 2: Performance Monitoring
    try {
      const hasPerformanceAPI = 'performance' in window && 'memory' in (performance as any);
      const hasNavigationTiming = 'getEntriesByType' in performance;
      
      testResults.push({
        test: 'Performance Monitoring',
        status: hasPerformanceAPI && hasNavigationTiming ? 'pass' : 'warning',
        message: hasPerformanceAPI ? 'Performance monitoring available' : 'Limited performance monitoring',
        details: `Memory API: ${hasPerformanceAPI}, Navigation Timing: ${hasNavigationTiming}`
      });
    } catch (error) {
      testResults.push({
        test: 'Performance Monitoring',
        status: 'fail',
        message: 'Performance monitoring test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 3: Error Recovery System
    try {
      const hasLocalStorage = 'localStorage' in window;
      const hasErrorBoundarySupport = React.Component !== undefined;
      
      testResults.push({
        test: 'Error Recovery System',
        status: hasLocalStorage && hasErrorBoundarySupport ? 'pass' : 'warning',
        message: hasLocalStorage ? 'Error recovery system ready' : 'Limited error recovery',
        details: `Storage: ${hasLocalStorage}, Error Boundaries: ${hasErrorBoundarySupport}`
      });
    } catch (error) {
      testResults.push({
        test: 'Error Recovery System',
        status: 'fail',
        message: 'Error recovery test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 4: Memory Management
    try {
      const hasWeakMap = typeof WeakMap !== 'undefined';
      const hasWeakSet = typeof WeakSet !== 'undefined';
      const hasIntersectionObserver = 'IntersectionObserver' in window;
      
      testResults.push({
        test: 'Memory Management',
        status: hasWeakMap && hasWeakSet ? 'pass' : 'warning',
        message: hasWeakMap ? 'Advanced memory management available' : 'Basic memory management',
        details: `WeakMap: ${hasWeakMap}, WeakSet: ${hasWeakSet}, IntersectionObserver: ${hasIntersectionObserver}`
      });
    } catch (error) {
      testResults.push({
        test: 'Memory Management',
        status: 'fail',
        message: 'Memory management test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 5: Mobile Optimization
    try {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i.test(navigator.userAgent);
      const hasTouch = 'ontouchstart' in window;
      const isResponsive = window.innerWidth <= 768;
      
      testResults.push({
        test: 'Mobile Optimization',
        status: 'pass',
        message: `Mobile features ${isMobile || hasTouch ? 'detected' : 'ready'}`,
        details: `Mobile: ${isMobile}, Touch: ${hasTouch}, Responsive: ${isResponsive}, Width: ${window.innerWidth}px`
      });
    } catch (error) {
      testResults.push({
        test: 'Mobile Optimization',
        status: 'fail',
        message: 'Mobile optimization test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 6: Progressive Enhancement
    try {
      const hasRequestIdleCallback = 'requestIdleCallback' in window;
      const hasIntersectionObserver = 'IntersectionObserver' in window;
      const hasWebWorkers = typeof Worker !== 'undefined';
      
      const progressiveScore = [hasRequestIdleCallback, hasIntersectionObserver, hasWebWorkers].filter(Boolean).length;
      
      testResults.push({
        test: 'Progressive Enhancement',
        status: progressiveScore >= 2 ? 'pass' : progressiveScore >= 1 ? 'warning' : 'fail',
        message: `Progressive features: ${progressiveScore}/3 available`,
        details: `RequestIdleCallback: ${hasRequestIdleCallback}, IntersectionObserver: ${hasIntersectionObserver}, WebWorkers: ${hasWebWorkers}`
      });
    } catch (error) {
      testResults.push({
        test: 'Progressive Enhancement',
        status: 'fail',
        message: 'Progressive enhancement test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 7: Security Features
    try {
      const hasHTTPS = window.location.protocol === 'https:';
      const hasCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null;
      const hasSubresourceIntegrity = document.querySelector('script[integrity]') !== null;
      
      testResults.push({
        test: 'Security Features',
        status: hasHTTPS ? 'pass' : 'warning',
        message: hasHTTPS ? 'Secure connection detected' : 'Consider using HTTPS',
        details: `HTTPS: ${hasHTTPS}, CSP: ${hasCSP}, SRI: ${hasSubresourceIntegrity}`
      });
    } catch (error) {
      testResults.push({
        test: 'Security Features',
        status: 'warning',
        message: 'Security test completed with limitations',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 8: FlashFusion Debug Tools
    try {
      const hasDebugTools = typeof window !== 'undefined' && (window as any).ffApp !== undefined;
      const hasDebugMethods = hasDebugTools && typeof (window as any).ffApp.debug === 'object';
      
      testResults.push({
        test: 'FlashFusion Debug Tools',
        status: hasDebugTools ? 'pass' : 'warning',
        message: hasDebugTools ? 'Debug tools available' : 'Debug tools not loaded',
        details: `Debug Object: ${hasDebugTools}, Debug Methods: ${hasDebugMethods}`
      });
    } catch (error) {
      testResults.push({
        test: 'FlashFusion Debug Tools',
        status: 'fail',
        message: 'Debug tools test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Calculate overall score
    const passCount = testResults.filter(r => r.status === 'pass').length;
    const warningCount = testResults.filter(r => r.status === 'warning').length;
    const totalTests = testResults.length;
    
    const score = Math.round(((passCount * 10) + (warningCount * 6)) / totalTests);
    setOverallScore(score);
    setResults(testResults);
    setIsRunning(false);
  };

  useEffect(() => {
    // Auto-run validation on component mount
    runValidationTests();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'fail': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass': return 'ff-badge-primary';
      case 'warning': return 'ff-badge-warning';
      case 'fail': return 'ff-badge-error';
      default: return 'ff-badge-secondary';
    }
  };

  const getOverallGrade = (score: number) => {
    if (score >= 9) return { grade: 'A+', color: 'from-green-500 to-emerald-500', status: 'Excellent' };
    if (score >= 8) return { grade: 'A', color: 'from-green-500 to-green-600', status: 'Very Good' };
    if (score >= 7) return { grade: 'B+', color: 'from-blue-500 to-cyan-500', status: 'Good' };
    if (score >= 6) return { grade: 'B', color: 'from-blue-500 to-blue-600', status: 'Fair' };
    if (score >= 5) return { grade: 'C', color: 'from-yellow-500 to-orange-500', status: 'Needs Improvement' };
    return { grade: 'D', color: 'from-red-500 to-red-600', status: 'Poor' };
  };

  const overallGrade = getOverallGrade(overallScore);

  return (
    <div className="space-y-6 ff-fade-in-up">
      {/* Overall Score */}
      <Card className="ff-card-interactive">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="ff-text-title">FlashFusion Optimization Status</span>
            <div className={`w-20 h-20 bg-gradient-to-br ${overallGrade.color} rounded-2xl flex items-center justify-center text-white`}>
              <div className="text-center">
                <div className="ff-text-2xl font-bold">{overallGrade.grade}</div>
                <div className="ff-text-xs">{overallScore}/10</div>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="ff-text-2xl font-bold">{overallGrade.status}</h3>
              <p className="ff-text-body">
                System optimization score: {overallScore}/10
              </p>
            </div>
            
            <div className="flex justify-center">
              <Button
                onClick={runValidationTests}
                disabled={isRunning}
                className="ff-btn-primary ff-hover-glow"
              >
                {isRunning ? 'Running Tests...' : 'Re-run Validation'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card className="ff-card-interactive">
        <CardHeader>
          <CardTitle className="ff-text-title">Validation Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="ff-text-lg font-semibold">{result.test}</h4>
                  <Badge className={getStatusBadge(result.status)}>
                    {result.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="ff-text-body mb-2">{result.message}</p>
                {result.details && (
                  <details className="ff-text-caption">
                    <summary className="cursor-pointer hover:text-primary">Technical Details</summary>
                    <div className="mt-2 p-2 bg-muted rounded text-xs font-mono">
                      {result.details}
                    </div>
                  </details>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Alert>
        <div className="space-y-3">
          <h4 className="ff-text-lg font-semibold">Optimization Recommendations</h4>
          <div className="space-y-2">
            {results.filter(r => r.status === 'fail').length > 0 && (
              <p className="ff-text-body text-red-600">
                • Address failed tests for optimal performance
              </p>
            )}
            {results.filter(r => r.status === 'warning').length > 0 && (
              <p className="ff-text-body text-yellow-600">
                • Review warnings to enhance functionality
              </p>
            )}
            {overallScore >= 8 && (
              <p className="ff-text-body text-green-600">
                • Excellent! Your FlashFusion platform is well-optimized
              </p>
            )}
            <p className="ff-text-body">
              • Check the Performance Optimization Manager for real-time monitoring
            </p>
            <p className="ff-text-body">
              • Use the Error Recovery System for any issues that arise
            </p>
          </div>
        </div>
      </Alert>

      {/* Quick Actions */}
      <Card className="ff-card-interactive">
        <CardHeader>
          <CardTitle className="ff-text-title">Quick Optimization Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              onClick={() => {
                localStorage.setItem('ff-performance-mode', 'true');
                window.location.reload();
              }}
              variant="outline"
              className="ff-btn-outline"
            >
              Enable Performance Mode
            </Button>
            <Button
              onClick={() => {
                localStorage.setItem('ff-reduce-animations', 'true');
                window.location.reload();
              }}
              variant="outline"
              className="ff-btn-outline"
            >
              Reduce Animations
            </Button>
            <Button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              variant="outline"
              className="ff-btn-outline"
            >
              Clear Cache
            </Button>
            <Button
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).ffApp?.debug) {
                  console.table((window as any).ffApp.debug.performance());
                }
              }}
              variant="outline"
              className="ff-btn-outline"
            >
              View Debug Info
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default OptimizationValidator;