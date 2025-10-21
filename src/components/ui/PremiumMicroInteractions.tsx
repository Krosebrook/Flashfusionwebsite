import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Progress } from './progress';
import { 
  Sparkles, 
  Star, 
  Heart, 
  Zap, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Eye,
  MousePointer,
  Layers,
  Palette,
  Settings,
  Wand2,
  Wand2
} from 'lucide-react';

interface MicroInteractionProps {
  children: React.ReactNode;
  className?: string;
  type?: 'hover' | 'click' | 'focus' | 'gradient' | 'magnetic' | 'ripple' | 'glow';
  intensity?: 'subtle' | 'medium' | 'strong';
  disabled?: boolean;
}

// Magnetic Button Component
const MagneticButton: React.FC<MicroInteractionProps> = ({ 
  children, 
  className = '', 
  intensity = 'medium',
  disabled = false 
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const handleMouseMove = (event: React.MouseEvent) => {
    if (disabled || !ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const intensityMap = { subtle: 0.3, medium: 0.5, strong: 0.8 };
    const factor = intensityMap[intensity];
    
    x.set((event.clientX - centerX) * factor);
    y.set((event.clientY - centerY) * factor);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden transition-all duration-200 ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

// Ripple Effect Component
const RippleEffect: React.FC<{ trigger: boolean; onComplete?: () => void }> = ({ 
  trigger, 
  onComplete 
}) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (trigger) {
      const newRipple = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 100
      };
      
      setRipples(prev => [...prev, newRipple]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        onComplete?.();
      }, 1000);
    }
  }, [trigger, onComplete]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute w-4 h-4 bg-primary/20 rounded-full"
          style={{
            left: `${ripple.x}%`,
            top: `${ripple.y}%`,
          }}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 20, opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

// Gradient Shift Card
const GradientShiftCard: React.FC<MicroInteractionProps> = ({ 
  children, 
  className = '',
  intensity = 'medium' 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const gradients = {
    subtle: 'bg-gradient-to-br from-muted via-muted to-muted/80',
    medium: 'bg-gradient-to-br from-primary/5 via-muted to-secondary/5',
    strong: 'bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10'
  };

  const hoverGradients = {
    subtle: 'bg-gradient-to-br from-muted/80 via-muted/90 to-muted',
    medium: 'bg-gradient-to-br from-primary/10 via-muted/90 to-secondary/10',
    strong: 'bg-gradient-to-br from-primary/15 via-accent/10 to-secondary/15'
  };

  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg border transition-all duration-500 ${
        isHovered ? hoverGradients[intensity] : gradients[intensity]
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full"
        animate={{
          translateX: isHovered ? '200%' : '-100%'
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      {children}
    </motion.div>
  );
};

// Floating Action Button
const FloatingActionButton: React.FC<MicroInteractionProps> = ({ 
  children, 
  className = '',
  intensity = 'medium' 
}) => {
  const [isPressed, setIsPressed] = useState(false);
  
  const shadowIntensity = {
    subtle: 'shadow-lg',
    medium: 'shadow-xl',
    strong: 'shadow-2xl'
  };

  return (
    <motion.button
      className={`relative rounded-full p-4 bg-primary text-primary-foreground 
                 ${shadowIntensity[intensity]} transition-all duration-200 ${className}`}
      whileHover={{ 
        scale: 1.05,
        boxShadow: intensity === 'strong' 
          ? '0 20px 40px rgba(0,0,0,0.3)' 
          : '0 10px 25px rgba(0,0,0,0.2)'
      }}
      whileTap={{ scale: 0.95 }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      <motion.div
        animate={{ 
          rotate: isPressed ? 180 : 0,
          scale: isPressed ? 0.9 : 1
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
      
      <motion.div
        className="absolute inset-0 rounded-full bg-white/20"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: isPressed ? 1 : 0,
          opacity: isPressed ? 1 : 0
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
};

// Morphing Icon Button
const MorphingIconButton: React.FC<{
  icons: React.ReactNode[];
  labels: string[];
  className?: string;
  onStateChange?: (index: number) => void;
}> = ({ icons, labels, className = '', onStateChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClick = () => {
    const nextIndex = (currentIndex + 1) % icons.length;
    setCurrentIndex(nextIndex);
    onStateChange?.(nextIndex);
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`relative p-3 rounded-lg bg-muted hover:bg-muted/80 
                 transition-colors duration-200 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center"
      >
        {icons[currentIndex]}
      </motion.div>
      
      <motion.span
        key={`label-${currentIndex}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                   ff-text-xs text-muted-foreground whitespace-nowrap font-inter"
      >
        {labels[currentIndex]}
      </motion.span>
    </motion.button>
  );
};

// Progress Ring Component
const ProgressRing: React.FC<{
  progress: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
  color?: string;
}> = ({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  children, 
  color = 'currentColor' 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted/20"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="text-primary drop-shadow-sm"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

// Staggered List Animation
const StaggeredList: React.FC<{
  items: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
}> = ({ items, className = '', staggerDelay = 0.1 }) => {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: index * staggerDelay,
            ease: "easeOut"
          }}
        >
          {item}
        </motion.div>
      ))}
    </div>
  );
};

// Main Demo Component
const PremiumMicroInteractions: React.FC = () => {
  const [rippleTrigger, setRippleTrigger] = useState(false);
  const [progress, setProgress] = useState(65);
  const [likeCount, setLikeCount] = useState(142);
  const [isLiked, setIsLiked] = useState(false);

  const morphingIcons = [
    <Heart className="h-5 w-5" />,
    <Star className="h-5 w-5" />,
    <Sparkles className="h-5 w-5" />,
    <Zap className="h-5 w-5" />
  ];

  const morphingLabels = ['Like', 'Favorite', 'Sparkle', 'Boost'];

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    setRippleTrigger(true);
  };

  const demoItems = [
    <Card className="p-4 bg-muted/50">
      <div className="flex items-center gap-3">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <span className="font-medium font-sora">Performance Optimized</span>
      </div>
    </Card>,
    <Card className="p-4 bg-muted/50">
      <div className="flex items-center gap-3">
        <TrendingUp className="h-5 w-5 text-blue-500" />
        <span className="font-medium font-sora">User Engagement Up 23%</span>
      </div>
    </Card>,
    <Card className="p-4 bg-muted/50">
      <div className="flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-purple-500" />
        <span className="font-medium font-sora">Premium Experience Active</span>
      </div>
    </Card>
  ];

  return (
    <div className="space-y-8 ff-stagger-fade">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Wand2 className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <h1 className="ff-text-2xl font-bold ff-text-gradient font-sora">
              Premium Micro-Interactions
            </h1>
            <p className="ff-text-sm text-muted-foreground font-inter">
              Subtle, sophisticated interactions that enhance user experience
            </p>
          </div>
        </div>
      </div>

      {/* Magnetic Buttons */}
      <GradientShiftCard intensity="medium" className="p-6">
        <h3 className="ff-text-lg font-semibold mb-4 font-sora">Magnetic Attraction</h3>
        <div className="flex flex-wrap gap-4">
          <MagneticButton 
            className="ff-btn-primary px-6 py-3 rounded-lg font-sora"
            intensity="subtle"
          >
            <div className="flex items-center gap-2">
              <MousePointer className="h-4 w-4" />
              Hover Me (Subtle)
            </div>
          </MagneticButton>
          
          <MagneticButton 
            className="ff-btn-secondary px-6 py-3 rounded-lg font-sora"
            intensity="medium"
          >
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Medium Magnetism
            </div>
          </MagneticButton>
          
          <MagneticButton 
            className="ff-btn-accent px-6 py-3 rounded-lg font-sora"
            intensity="strong"
          >
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Strong Pull
            </div>
          </MagneticButton>
        </div>
      </GradientShiftCard>

      {/* Interactive Elements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Progress Ring */}
        <GradientShiftCard intensity="subtle" className="p-6 text-center">
          <h4 className="ff-text-base font-semibold mb-4 font-sora">Progress Ring</h4>
          <ProgressRing progress={progress} color="rgb(var(--ff-primary))">
            <div className="text-center">
              <div className="ff-text-2xl font-bold text-primary font-sora">
                {progress}%
              </div>
              <div className="ff-text-xs text-muted-foreground font-inter">
                Complete
              </div>
            </div>
          </ProgressRing>
          <div className="mt-4 space-y-2">
            <Button 
              onClick={() => setProgress(Math.min(100, progress + 10))}
              size="sm"
              variant="outline"
              className="ff-hover-scale"
            >
              Increase
            </Button>
            <Button 
              onClick={() => setProgress(Math.max(0, progress - 10))}
              size="sm"
              variant="outline"
              className="ff-hover-scale"
            >
              Decrease
            </Button>
          </div>
        </GradientShiftCard>

        {/* Morphing Icon Button */}
        <GradientShiftCard intensity="medium" className="p-6 text-center">
          <h4 className="ff-text-base font-semibold mb-6 font-sora">Morphing Icon</h4>
          <div className="flex justify-center">
            <MorphingIconButton
              icons={morphingIcons}
              labels={morphingLabels}
              onStateChange={(index) => console.log('State changed to:', morphingLabels[index])}
            />
          </div>
          <p className="ff-text-xs text-muted-foreground mt-8 font-inter">
            Click to cycle through different states
          </p>
        </GradientShiftCard>

        {/* Like Button with Ripple */}
        <GradientShiftCard intensity="strong" className="p-6 text-center relative">
          <RippleEffect trigger={rippleTrigger} onComplete={() => setRippleTrigger(false)} />
          <h4 className="ff-text-base font-semibold mb-4 font-sora">Ripple Effect</h4>
          <motion.button
            onClick={handleLike}
            className={`relative p-4 rounded-full transition-all duration-300 ${
              isLiked 
                ? 'bg-red-500 text-white shadow-lg' 
                : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ 
                scale: isLiked ? [1, 1.3, 1] : 1,
                rotate: isLiked ? [0, -10, 10, 0] : 0
              }}
              transition={{ duration: 0.3 }}
            >
              <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
            </motion.div>
          </motion.button>
          <div className="mt-3">
            <motion.div
              key={likeCount}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="ff-text-sm font-medium font-sora"
            >
              {likeCount} likes
            </motion.div>
          </div>
        </GradientShiftCard>
      </div>

      {/* Floating Action Buttons */}
      <GradientShiftCard intensity="medium" className="p-6">
        <h3 className="ff-text-lg font-semibold mb-4 font-sora">Floating Actions</h3>
        <div className="flex justify-center gap-6">
          <FloatingActionButton intensity="subtle">
            <Eye className="h-5 w-5" />
          </FloatingActionButton>
          
          <FloatingActionButton intensity="medium">
            <Settings className="h-5 w-5" />
          </FloatingActionButton>
          
          <FloatingActionButton intensity="strong">
            <Sparkles className="h-5 w-5" />
          </FloatingActionButton>
        </div>
      </GradientShiftCard>

      {/* Staggered List Animation */}
      <GradientShiftCard intensity="subtle" className="p-6">
        <h3 className="ff-text-lg font-semibold mb-4 font-sora">Staggered Animations</h3>
        <StaggeredList 
          items={demoItems}
          className="space-y-3"
          staggerDelay={0.15}
        />
      </GradientShiftCard>

      {/* Usage Guidelines */}
      <Card className="p-6 border-dashed border-2 border-muted-foreground/20">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-blue-500" />
            <h3 className="ff-text-lg font-semibold font-sora">Design Principles</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ff-text-sm font-inter">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600 font-sora">✓ Do</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Use subtle animations (200-400ms)</li>
                <li>• Provide immediate visual feedback</li>
                <li>• Maintain consistency across interactions</li>
                <li>• Consider accessibility preferences</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-red-600 font-sora">✗ Don't</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Overuse flashy animations</li>
                <li>• Create distracting movements</li>
                <li>• Ignore motion sensitivity</li>
                <li>• Sacrifice performance for effects</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-4 border-t border-muted">
            <p className="ff-text-sm text-muted-foreground font-inter">
              <strong className="text-foreground font-sora">Pro Tip:</strong> These micro-interactions 
              should enhance the user experience without drawing attention to themselves. 
              The best interactions feel natural and intuitive.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PremiumMicroInteractions;