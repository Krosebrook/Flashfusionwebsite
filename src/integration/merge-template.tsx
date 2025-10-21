/**
 * FlashFusion Component Merge Template
 * Use this template when manually merging components
 */

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../components/ui/utils';

// Import FlashFusion UI components
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

// Import any necessary FlashFusion hooks
import { useAuth } from '../components/auth/AuthSystem';

// Import the original component from the other project
// import { OriginalComponent } from './path-to-original-component';

interface MergedComponentProps {
  // Define props that combine both component interfaces
  // Original component props
  originalProp?: string;
  
  // FlashFusion enhanced props
  flashfusionEnhanced?: boolean;
  className?: string;
  
  // Common props
  children?: React.ReactNode;
}

/**
 * Template for merging external components with FlashFusion
 * 
 * MERGE STRATEGY:
 * 1. Keep FlashFusion UI/UX patterns
 * 2. Integrate functionality from other component
 * 3. Apply FlashFusion theming and animations
 * 4. Maintain accessibility standards
 */
export const MergedComponent: React.FC<MergedComponentProps> = ({
  originalProp,
  flashfusionEnhanced = true,
  className,
  children,
  ...props
}) => {
  // Use FlashFusion hooks and state management
  const { user } = useAuth();
  
  // Integrate any state/logic from the original component
  // const originalLogic = useOriginalComponentLogic();
  
  // Enhanced logic that combines both approaches
  const handleAction = () => {
    // Combine original functionality with FlashFusion enhancements
    // originalLogic.performAction();
    
    // Add FlashFusion specific enhancements
    console.log('Enhanced action with FlashFusion patterns');
  };

  return (
    <motion.div
      // Apply FlashFusion animation patterns
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        // Base FlashFusion styling
        'ff-component-wrapper',
        'relative',
        
        // FlashFusion interactive patterns
        flashfusionEnhanced && 'ff-card-interactive',
        
        // Custom className
        className
      )}
    >
      <Card className="ff-hover-lift">
        <CardHeader>
          <CardTitle className="ff-text-gradient">
            {/* Keep FlashFusion typography patterns */}
            Merged Component Title
          </CardTitle>
          
          {/* Add FlashFusion status indicators */}
          {flashfusionEnhanced && (
            <Badge variant="outline" className="ff-badge-glow">
              Enhanced
            </Badge>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Integrate original component content */}
          {/* <OriginalComponent {...originalProps} /> */}
          
          {/* Add FlashFusion enhancements */}
          <div className="ff-stagger-fade">
            {children}
            
            {/* Example: Enhanced interaction */}
            <Button
              onClick={handleAction}
              className="ff-btn-primary"
              size="sm"
            >
              Enhanced Action
            </Button>
          </div>
          
          {/* Show user-specific content using FlashFusion auth */}
          {user && (
            <div className="ff-fade-in-up">
              <p className="text-muted-foreground">
                Welcome back, {user.email}!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

/**
 * Higher-Order Component for automatic FlashFusion integration
 */
export const withFlashFusionIntegration = <P extends object>(
  OriginalComponent: React.ComponentType<P>
) => {
  return React.forwardRef<any, P & { flashfusionTheme?: boolean }>((props, ref) => {
    const { flashfusionTheme = true, ...originalProps } = props;
    
    if (!flashfusionTheme) {
      return <OriginalComponent {...(originalProps as P)} ref={ref} />;
    }
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="ff-component-wrapper"
      >
        <OriginalComponent {...(originalProps as P)} ref={ref} />
      </motion.div>
    );
  });
};

/**
 * Utility function to adapt external component props to FlashFusion patterns
 */
export const adaptToFlashFusion = (externalProps: any) => {
  const adaptedProps = { ...externalProps };
  
  // Adapt color schemes
  if (adaptedProps.color === 'blue') adaptedProps.color = 'primary';
  if (adaptedProps.color === 'cyan') adaptedProps.color = 'secondary';
  if (adaptedProps.color === 'pink') adaptedProps.color = 'accent';
  
  // Adapt size patterns
  if (adaptedProps.size === 'large') adaptedProps.size = 'lg';
  if (adaptedProps.size === 'small') adaptedProps.size = 'sm';
  
  // Add FlashFusion class patterns
  const ffClasses = [];
  
  if (adaptedProps.interactive) ffClasses.push('ff-card-interactive');
  if (adaptedProps.glowing) ffClasses.push('ff-hover-glow');
  if (adaptedProps.animated) ffClasses.push('ff-fade-in-up');
  
  adaptedProps.className = cn(adaptedProps.className, ...ffClasses);
  
  return adaptedProps;
};

/**
 * Example usage:
 * 
 * // For automatic integration:
 * const EnhancedExternalComponent = withFlashFusionIntegration(ExternalComponent);
 * 
 * // For manual integration:
 * <MergedComponent
 *   originalProp="value"
 *   flashfusionEnhanced={true}
 *   className="custom-styling"
 * >
 *   Content here
 * </MergedComponent>
 * 
 * // For prop adaptation:
 * const adaptedProps = adaptToFlashFusion({
 *   color: 'blue',
 *   size: 'large',
 *   interactive: true
 * });
 */