import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Slider } from '../ui/slider';
import { toast } from "sonner";
import { 
  Palette, 
  Type, 
  Image as ImageIcon, 
  Layers,
  Download,
  Upload,
  Save,
  Share,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Crop,
  Sparkles,
  ShoppingBag,
  DollarSign,
  Globe,
  Target,
  Wand2,
  Square,
  Circle,
  Triangle,
  Star,
  Play,
  Pause,
  RefreshCw,
  Check,
  X,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Copy,
  Trash2,
  Settings,
  ArrowUp,
  ArrowDown,
  Move,
  RotateCw,
  Flip,
  Maximize,
  Minimize
} from 'lucide-react';
import { PRODUCT_TYPES, DESIGN_CATEGORIES, PRINT_SPECS, MARKETPLACES } from '../../constants/print-on-demand';

interface DesignElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'vector';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  locked: boolean;
  visible: boolean;
  properties: Record<string, any>;
}

interface CanvasState {
  elements: DesignElement[];
  selectedElements: string[];
  zoom: number;
  panX: number;
  panY: number;
  canvasWidth: number;
  canvasHeight: number;
  backgroundColor: string;
}

interface PrintDesignSuiteProps {
  user: any;
  userTier: 'free' | 'pro' | 'enterprise';
  onSaveDesign: (design: any) => void;
  onPublishToMarketplace: (marketplaceId: string, product: any) => void;
  initialProduct?: any;
}

interface AIGenerationProgress {
  stage: 'idle' | 'processing_prompt' | 'generating_image' | 'enhancing' | 'finalizing' | 'complete';
  progress: number;
  message: string;
}

interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  elements: DesignElement[];
  tags: string[];
  premium: boolean;
}

// Realistic AI prompts and suggestions
const AI_PROMPT_SUGGESTIONS = [
  "Minimalist geometric abstract design with orange and blue gradients",
  "Vintage retro sunset with palm trees silhouette",
  "Modern typography design with inspirational quote",
  "Watercolor floral pattern with delicate details",
  "Cyberpunk neon cityscape with glowing elements",
  "Hand-drawn mandala with intricate patterns",
  "Pop art style portrait with bold colors",
  "Nature landscape with mountains and forests",
  "Abstract marble texture with gold accents",
  "Space galaxy with stars and nebula effects"
];

// Design templates with realistic data
const DESIGN_TEMPLATES: Template[] = [
  {
    id: 'temp_001',
    name: 'Motivational Quote',
    category: 'text',
    thumbnail: '/templates/motivational-quote.jpg',
    elements: [
      {
        id: 'text_1',
        type: 'text',
        content: 'DREAM BIG\nWORK HARD',
        x: 100,
        y: 150,
        width: 300,
        height: 100,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
        locked: false,
        visible: true,
        properties: {
          fontFamily: 'Sora',
          fontSize: 48,
          fontWeight: 'bold',
          color: '#FF7B00',
          textAlign: 'center',
          letterSpacing: 2
        }
      }
    ],
    tags: ['motivational', 'typography', 'modern'],
    premium: false
  },
  {
    id: 'temp_002',
    name: 'Geometric Abstract',
    category: 'abstract',
    thumbnail: '/templates/geometric-abstract.jpg',
    elements: [
      {
        id: 'shape_1',
        type: 'shape',
        content: 'circle',
        x: 50,
        y: 50,
        width: 150,
        height: 150,
        rotation: 0,
        opacity: 0.8,
        zIndex: 1,
        locked: false,
        visible: true,
        properties: {
          fill: '#00B4D8',
          stroke: 'none',
          strokeWidth: 0
        }
      },
      {
        id: 'shape_2',
        type: 'shape',
        content: 'rectangle',
        x: 180,
        y: 120,
        width: 200,
        height: 80,
        rotation: 25,
        opacity: 0.9,
        zIndex: 2,
        locked: false,
        visible: true,
        properties: {
          fill: '#E91E63',
          stroke: 'none',
          strokeWidth: 0
        }
      }
    ],
    tags: ['geometric', 'abstract', 'colorful'],
    premium: true
  },
  {
    id: 'temp_003',
    name: 'Vintage Badge',
    category: 'vintage',
    thumbnail: '/templates/vintage-badge.jpg',
    elements: [
      {
        id: 'shape_circle',
        type: 'shape',
        content: 'circle',
        x: 75,
        y: 75,
        width: 250,
        height: 250,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
        locked: false,
        visible: true,
        properties: {
          fill: 'none',
          stroke: '#2D3748',
          strokeWidth: 4
        }
      },
      {
        id: 'text_brand',
        type: 'text',
        content: 'AUTHENTIC\nBRAND',
        x: 125,
        y: 175,
        width: 150,
        height: 50,
        rotation: 0,
        opacity: 1,
        zIndex: 2,
        locked: false,
        visible: true,
        properties: {
          fontFamily: 'Georgia',
          fontSize: 24,
          fontWeight: 'bold',
          color: '#2D3748',
          textAlign: 'center'
        }
      }
    ],
    tags: ['vintage', 'badge', 'classic'],
    premium: false
  }
];

// Font options with realistic variety
const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter (Modern Sans)', category: 'sans-serif' },
  { value: 'Sora', label: 'Sora (Display)', category: 'display' },
  { value: 'Georgia', label: 'Georgia (Classic Serif)', category: 'serif' },
  { value: 'Playfair Display', label: 'Playfair Display (Elegant)', category: 'serif' },
  { value: 'Roboto', label: 'Roboto (Clean Sans)', category: 'sans-serif' },
  { value: 'Montserrat', label: 'Montserrat (Geometric)', category: 'sans-serif' },
  { value: 'Open Sans', label: 'Open Sans (Readable)', category: 'sans-serif' },
  { value: 'Lora', label: 'Lora (Contemporary Serif)', category: 'serif' },
  { value: 'Poppins', label: 'Poppins (Friendly)', category: 'sans-serif' },
  { value: 'Dancing Script', label: 'Dancing Script (Handwritten)', category: 'script' },
  { value: 'Bebas Neue', label: 'Bebas Neue (Bold Display)', category: 'display' },
  { value: 'JetBrains Mono', label: 'JetBrains Mono (Code)', category: 'monospace' }
];

export function PrintDesignSuite({ 
  user, 
  userTier, 
  onSaveDesign, 
  onPublishToMarketplace,
  initialProduct 
}: PrintDesignSuiteProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Design state
  const [selectedProduct, setSelectedProduct] = useState(initialProduct || PRODUCT_TYPES.APPAREL.T_SHIRT);
  const [selectedSize, setSelectedSize] = useState(selectedProduct.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(selectedProduct.colors[0]);
  const [selectedMaterial, setSelectedMaterial] = useState(selectedProduct.materials[0]);
  
  // Canvas state
  const [canvasState, setCanvasState] = useState<CanvasState>({
    elements: [],
    selectedElements: [],
    zoom: 1,
    panX: 0,
    panY: 0,
    canvasWidth: selectedProduct.dimensions.width,
    canvasHeight: selectedProduct.dimensions.height,
    backgroundColor: selectedColor === 'white' ? '#FFFFFF' : '#000000'
  });
  
  // UI state
  const [activeTab, setActiveTab] = useState('design');
  const [activeTool, setActiveTool] = useState('select');
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [saveProgress, setSaveProgress] = useState(0);
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  
  // AI Generation
  const [aiGenerationProgress, setAiGenerationProgress] = useState<AIGenerationProgress>({
    stage: 'idle',
    progress: 0,
    message: ''
  });
  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(DESIGN_CATEGORIES.CREATIVE);
  
  // Design properties
  const [designTitle, setDesignTitle] = useState('Untitled Design');
  const [designDescription, setDesignDescription] = useState('');
  const [textProperties, setTextProperties] = useState({
    fontFamily: 'Inter',
    fontSize: 36,
    fontWeight: 'normal',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: 0,
    lineHeight: 1.2
  });
  
  // History for undo/redo
  const [history, setHistory] = useState<CanvasState[]>([canvasState]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // Realistic pricing calculation
  const calculatePricing = () => {
    const basePrice = selectedProduct.basePrice;
    const materialMultiplier = selectedMaterial === 'premium' ? 1.4 : selectedMaterial === 'blend' ? 1.2 : 1;
    const sizeMultiplier = selectedSize === 'XXL' ? 1.3 : selectedSize === 'XL' ? 1.15 : 1;
    const complexityMultiplier = 1 + (canvasState.elements.length * 0.08);
    
    const productionCost = Math.round(basePrice * materialMultiplier * sizeMultiplier * 100) / 100;
    const suggestedPrice = Math.round(productionCost * 2.8 * complexityMultiplier * 100) / 100;
    const profit = Math.round((suggestedPrice - productionCost) * 100) / 100;
    
    return {
      production: productionCost,
      suggested: suggestedPrice,
      profit: profit,
      margin: Math.round(((profit / suggestedPrice) * 100) * 10) / 10
    };
  };

  // Add element to canvas with improved positioning
  const addElement = (element: Omit<DesignElement, 'id' | 'zIndex'>) => {
    const newElement: DesignElement = {
      ...element,
      id: `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      zIndex: canvasState.elements.length,
      locked: false,
      visible: true
    };
    
    const newState = {
      ...canvasState,
      elements: [...canvasState.elements, newElement],
      selectedElements: [newElement.id]
    };
    
    setCanvasState(newState);
    addToHistory(newState);
    toast.success(`${element.type} element added to canvas`);
  };

  // Enhanced text addition with better defaults
  const addText = () => {
    addElement({
      type: 'text',
      content: 'Your Text Here',
      x: canvasState.canvasWidth / 2 - 100,
      y: canvasState.canvasHeight / 2 - 20,
      width: 200,
      height: 40,
      rotation: 0,
      opacity: 1,
      properties: { 
        ...textProperties,
        fontSize: Math.max(24, Math.min(48, canvasState.canvasWidth / 15))
      }
    });
  };

  // Enhanced shape addition with better variety
  const addShape = (shapeType: 'rectangle' | 'circle' | 'triangle' | 'star' | 'hexagon' | 'arrow') => {
    const size = Math.min(canvasState.canvasWidth, canvasState.canvasHeight) / 6;
    addElement({
      type: 'shape',
      content: shapeType,
      x: canvasState.canvasWidth / 2 - size / 2,
      y: canvasState.canvasHeight / 2 - size / 2,
      width: size,
      height: size,
      rotation: 0,
      opacity: 1,
      properties: {
        shapeType,
        fill: '#FF7B00',
        stroke: 'transparent',
        strokeWidth: 0,
        borderRadius: shapeType === 'rectangle' ? 8 : 0
      }
    });
  };

  // Enhanced AI generation with realistic progress
  const generateAIDesign = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter a design prompt");
      return;
    }
    
    if (userTier === 'free') {
      toast.error("AI generation requires Pro or Enterprise subscription");
      return;
    }

    const stages: AIGenerationProgress[] = [
      { stage: 'processing_prompt', progress: 20, message: 'Analyzing your prompt...' },
      { stage: 'generating_image', progress: 50, message: 'Generating AI artwork...' },
      { stage: 'enhancing', progress: 75, message: 'Enhancing quality...' },
      { stage: 'finalizing', progress: 95, message: 'Finalizing design...' },
      { stage: 'complete', progress: 100, message: 'AI design complete!' }
    ];

    try {
      for (const stage of stages) {
        setAiGenerationProgress(stage);
        await new Promise(resolve => setTimeout(resolve, 1200));
      }
      
      // Simulate AI-generated design elements
      const aiElements = [
        {
          type: 'image' as const,
          content: `https://picsum.photos/800/600?random=${Date.now()}`, // Placeholder for AI image
          x: 50,
          y: 50,
          width: canvasState.canvasWidth - 100,
          height: (canvasState.canvasWidth - 100) * 0.75,
          rotation: 0,
          opacity: 1,
          properties: {
            aiGenerated: true,
            prompt: aiPrompt,
            style: selectedCategory.id,
            filter: 'none',
            brightness: 100,
            contrast: 100,
            saturation: 100
          }
        }
      ];

      // Add generated elements
      aiElements.forEach(element => addElement(element));
      
      setAiGenerationProgress({ stage: 'idle', progress: 0, message: '' });
      toast.success("AI design generated successfully!");
      
    } catch (error) {
      console.error('AI generation failed:', error);
      setAiGenerationProgress({ stage: 'idle', progress: 0, message: '' });
      toast.error("AI generation failed. Please try again.");
    }
  };

  // Apply template to canvas
  const applyTemplate = (template: Template) => {
    const newState = {
      ...canvasState,
      elements: template.elements.map(el => ({
        ...el,
        id: `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      })),
      selectedElements: []
    };
    
    setCanvasState(newState);
    addToHistory(newState);
    setShowTemplates(false);
    toast.success(`Template "${template.name}" applied successfully!`);
  };

  // Enhanced save with realistic progress
  const saveDesign = async () => {
    setSaveProgress(0);
    
    const designData = {
      id: `design_${Date.now()}`,
      title: designTitle,
      description: designDescription,
      product: selectedProduct,
      size: selectedSize,
      color: selectedColor,
      material: selectedMaterial,
      canvas: canvasState,
      category: selectedCategory.id,
      pricing: calculatePricing(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user?.id,
      version: 1,
      tags: [selectedProduct.category, selectedSize, selectedColor],
      metadata: {
        elementsCount: canvasState.elements.length,
        hasAIContent: canvasState.elements.some(el => el.properties.aiGenerated),
        complexity: canvasState.elements.length > 5 ? 'high' : canvasState.elements.length > 2 ? 'medium' : 'low'
      }
    };
    
    // Simulate save progress with realistic steps
    const steps = [
      { progress: 20, message: 'Preparing design data...' },
      { progress: 40, message: 'Optimizing elements...' },
      { progress: 60, message: 'Generating previews...' },
      { progress: 80, message: 'Saving to database...' },
      { progress: 100, message: 'Design saved successfully!' }
    ];

    for (const step of steps) {
      setSaveProgress(step.progress);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    onSaveDesign(designData);
    setSaveProgress(0);
    toast.success("Design saved successfully!");
  };

  // Enhanced export with multiple formats
  const exportDesign = async (format: 'png' | 'jpg' | 'svg' | 'pdf') => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      const steps = [
        { progress: 25, message: 'Preparing canvas...' },
        { progress: 50, message: 'Rendering elements...' },
        { progress: 75, message: 'Optimizing output...' },
        { progress: 100, message: 'Download ready!' }
      ];

      for (const step of steps) {
        setExportProgress(step.progress);
        await new Promise(resolve => setTimeout(resolve, 400));
      }

      // Simulate file download
      const canvas = canvasRef.current;
      if (canvas) {
        const dataURL = canvas.toDataURL(`image/${format}`, 0.9);
        const link = document.createElement('a');
        link.download = `${designTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format}`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast.success(`Design exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  // Publish to marketplace with validation
  const publishToMarketplace = (marketplaceId: string) => {
    const marketplace = Object.values(MARKETPLACES).find(m => m.id === marketplaceId);
    if (!marketplace) return;

    // Validate design for marketplace
    const validation = {
      hasContent: canvasState.elements.length > 0,
      hasTitle: designTitle.trim().length > 0,
      hasDescription: designDescription.trim().length > 0,
      titleLength: designTitle.length <= marketplace.maxTitleLength,
      descriptionLength: designDescription.length <= marketplace.maxDescriptionLength
    };

    const isValid = Object.values(validation).every(Boolean);
    
    if (!isValid) {
      toast.error("Please complete all required fields for marketplace publishing");
      return;
    }

    const productData = {
      design: {
        id: `design_${Date.now()}`,
        title: designTitle,
        description: designDescription,
        canvas: canvasState
      },
      product: selectedProduct,
      variant: {
        size: selectedSize,
        color: selectedColor,
        material: selectedMaterial
      },
      pricing: calculatePricing(),
      marketplace: marketplace.id,
      tags: [selectedProduct.category, selectedSize, selectedColor, selectedCategory.id],
      metadata: {
        designComplexity: canvasState.elements.length,
        hasAIContent: canvasState.elements.some(el => el.properties.aiGenerated)
      }
    };

    onPublishToMarketplace(marketplaceId, productData);
    toast.success(`Publishing to ${marketplace.name}...`);
  };

  // History management
  const addToHistory = (state: CanvasState) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ ...state });
    if (newHistory.length > 50) newHistory.shift(); // Limit history size
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCanvasState(history[historyIndex - 1]);
      toast.info("Undo");
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCanvasState(history[historyIndex + 1]);
      toast.info("Redo");
    }
  };

  // Update canvas background when color changes
  useEffect(() => {
    setCanvasState(prev => ({
      ...prev,
      backgroundColor: selectedColor === 'white' ? '#FFFFFF' : 
                      selectedColor === 'black' ? '#000000' :
                      selectedColor === 'gray' ? '#9CA3AF' :
                      selectedColor === 'navy' ? '#1E293B' :
                      selectedColor === 'red' ? '#EF4444' :
                      selectedColor === 'blue' ? '#3B82F6' : selectedColor
    }));
  }, [selectedColor]);

  const pricing = calculatePricing();

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Left Toolbar */}
      <Card className="w-16 h-full rounded-none border-r border-border flex flex-col items-center py-4 space-y-2">
        <Button
          variant={activeTool === 'select' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTool('select')}
          className="w-12 h-12 p-0"
          title="Select Tool"
        >
          <Target className="h-4 w-4" />
        </Button>
        
        <Button
          variant={activeTool === 'text' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => {
            setActiveTool('text');
            addText();
          }}
          className="w-12 h-12 p-0"
          title="Add Text"
        >
          <Type className="h-4 w-4" />
        </Button>
        
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => addShape('rectangle')}
            className="w-12 h-12 p-0"
            title="Rectangle"
          >
            <Square className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => addShape('circle')}
            className="w-12 h-12 p-0"
            title="Circle"
          >
            <Circle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => addShape('triangle')}
            className="w-12 h-12 p-0"
            title="Triangle"
          >
            <Triangle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => addShape('star')}
            className="w-12 h-12 p-0"
            title="Star"
          >
            <Star className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="w-12 h-12 p-0"
          title="Upload Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowTemplates(true)}
          className="w-12 h-12 p-0"
          title="Templates"
        >
          <Layers className="h-4 w-4" />
        </Button>
        
        {userTier !== 'free' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('ai-generator')}
            className="w-12 h-12 p-0 bg-gradient-to-r from-primary to-secondary text-white hover:opacity-80"
            title="AI Generator (Pro)"
          >
            <Sparkles className="h-4 w-4" />
          </Button>
        )}

        <div className="flex-1" />
        
        {/* Export buttons */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => exportDesign('png')}
            className="w-12 h-12 p-0"
            title="Export PNG"
            disabled={isExporting}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('publish')}
            className="w-12 h-12 p-0"
            title="Publish"
          >
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <Card className="h-16 rounded-none border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Input
              value={designTitle}
              onChange={(e) => setDesignTitle(e.target.value)}
              className="w-64 bg-transparent border-none text-lg font-semibold focus:bg-input"
              placeholder="Design Title"
            />
            <Badge variant="outline" className="bg-primary/10">
              {selectedProduct.name}
            </Badge>
            <Badge variant="secondary">{selectedSize}</Badge>
            <Badge variant="outline" style={{ backgroundColor: canvasState.backgroundColor, color: selectedColor === 'white' ? '#000' : '#fff' }}>
              {selectedColor}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={undo} disabled={historyIndex <= 0} title="Undo">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1} title="Redo">
              <Redo className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-2 px-2 border-l border-r border-border">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setCanvasState(prev => ({ ...prev, zoom: Math.max(0.1, prev.zoom - 0.1) }))}
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-mono w-12 text-center">
                {Math.round(canvasState.zoom * 100)}%
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setCanvasState(prev => ({ ...prev, zoom: Math.min(3, prev.zoom + 0.1) }))}
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            
            <Button 
              onClick={saveDesign} 
              className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
              disabled={saveProgress > 0}
            >
              {saveProgress > 0 ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving... {saveProgress}%
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Design
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Canvas Area */}
        <div className="flex-1 flex">
          {/* Canvas */}
          <div className="flex-1 bg-muted/30 flex items-center justify-center p-8 relative overflow-hidden">
            <motion.div 
              className="relative bg-white rounded-lg shadow-2xl border-2 border-border/20"
              animate={{ scale: canvasState.zoom }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <canvas
                ref={canvasRef}
                width={selectedProduct.dimensions.width / 4}
                height={selectedProduct.dimensions.height / 4}
                className="rounded-lg"
                style={{
                  backgroundColor: canvasState.backgroundColor,
                  cursor: activeTool === 'select' ? 'default' : 'crosshair',
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
              />
              
              {/* Product Mockup Overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-10">
                {selectedProduct.id === 'tshirt' && (
                  <svg viewBox="0 0 400 500" className="w-full h-full">
                    <path
                      d="M80,120 L80,80 Q80,60 100,60 L140,60 Q160,40 240,40 Q260,60 300,60 Q320,60 320,80 L320,120 L340,140 L340,480 Q340,490 330,490 L70,490 Q60,490 60,480 L60,140 Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.3"
                    />
                  </svg>
                )}
              </div>

              {/* Grid overlay when zoomed in */}
              {canvasState.zoom > 1.5 && (
                <div className="absolute inset-0 pointer-events-none opacity-20">
                  <svg className="w-full h-full">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>
              )}
            </motion.div>

            {/* Canvas controls */}
            <div className="absolute bottom-4 left-4 flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCanvasState(prev => ({ ...prev, zoom: 1, panX: 0, panY: 0 }))}
              >
                <Maximize className="h-4 w-4 mr-1" />
                Fit to Screen
              </Button>
            </div>
          </div>

          {/* Right Panel */}
          <Card className="w-80 h-full rounded-none border-l border-border">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="product">Product</TabsTrigger>
                <TabsTrigger value="ai-generator">AI</TabsTrigger>
                <TabsTrigger value="publish">Publish</TabsTrigger>
              </TabsList>

              <TabsContent value="design" className="p-4 space-y-6 overflow-y-auto">
                {/* Text Properties */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Type className="h-4 w-4 mr-2" />
                    Text Properties
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label>Font Family</Label>
                      <Select 
                        value={textProperties.fontFamily} 
                        onValueChange={(value) => setTextProperties(prev => ({ ...prev, fontFamily: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FONT_OPTIONS.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Size</Label>
                        <Input
                          type="number"
                          value={textProperties.fontSize}
                          onChange={(e) => setTextProperties(prev => ({ ...prev, fontSize: parseInt(e.target.value) || 16 }))}
                          min="8"
                          max="200"
                        />
                      </div>
                      <div>
                        <Label>Weight</Label>
                        <Select 
                          value={textProperties.fontWeight} 
                          onValueChange={(value) => setTextProperties(prev => ({ ...prev, fontWeight: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="bold">Bold</SelectItem>
                            <SelectItem value="lighter">Light</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Text Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          type="color"
                          value={textProperties.color}
                          onChange={(e) => setTextProperties(prev => ({ ...prev, color: e.target.value }))}
                          className="w-12 h-10 p-0 border-2 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={textProperties.color}
                          onChange={(e) => setTextProperties(prev => ({ ...prev, color: e.target.value }))}
                          className="flex-1"
                          placeholder="#000000"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Alignment</Label>
                      <Select 
                        value={textProperties.textAlign} 
                        onValueChange={(value) => setTextProperties(prev => ({ ...prev, textAlign: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                          <SelectItem value="justify">Justify</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Layers Panel */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Layers className="h-4 w-4 mr-2" />
                    Layers ({canvasState.elements.length})
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {canvasState.elements
                      .sort((a, b) => b.zIndex - a.zIndex)
                      .map((element, index) => (
                      <motion.div
                        key={element.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                          canvasState.selectedElements.includes(element.id) 
                            ? 'bg-primary/10 border-primary' 
                            : 'border-border hover:bg-accent/50'
                        }`}
                        onClick={() => setCanvasState(prev => ({
                          ...prev,
                          selectedElements: [element.id]
                        }))}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              {element.type === 'text' && <Type className="h-3 w-3" />}
                              {element.type === 'image' && <ImageIcon className="h-3 w-3" />}
                              {element.type === 'shape' && <Square className="h-3 w-3" />}
                              <span className="text-sm font-medium capitalize">{element.type}</span>
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCanvasState(prev => ({
                                    ...prev,
                                    elements: prev.elements.map(el =>
                                      el.id === element.id ? { ...el, visible: !el.visible } : el
                                    )
                                  }));
                                }}
                                className="w-6 h-6 p-0"
                              >
                                {element.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCanvasState(prev => ({
                                    ...prev,
                                    elements: prev.elements.map(el =>
                                      el.id === element.id ? { ...el, locked: !el.locked } : el
                                    )
                                  }));
                                }}
                                className="w-6 h-6 p-0"
                              >
                                {element.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                              </Button>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {canvasState.elements.length - element.zIndex}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground truncate mt-1">
                          {element.type === 'text' ? element.content : 
                           element.type === 'shape' ? element.content : 
                           'Image element'}
                        </div>
                        {element.properties.aiGenerated && (
                          <Badge className="text-xs mt-1 bg-gradient-to-r from-primary to-secondary">
                            AI Generated
                          </Badge>
                        )}
                      </motion.div>
                    ))}
                    {canvasState.elements.length === 0 && (
                      <div className="text-center text-muted-foreground py-8">
                        <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No elements yet</p>
                        <p className="text-xs">Add text, shapes, or images to get started</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="product" className="p-4 space-y-6 overflow-y-auto">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Product Configuration
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Product Type</Label>
                      <Select 
                        value={selectedProduct.id} 
                        onValueChange={(value) => {
                          const product = Object.values(PRODUCT_TYPES)
                            .flatMap(category => Object.values(category))
                            .find(p => p.id === value);
                          if (product) {
                            setSelectedProduct(product);
                            setSelectedSize(product.sizes[0]);
                            setSelectedColor(product.colors[0]);
                            setSelectedMaterial(product.materials[0]);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(PRODUCT_TYPES).map(([categoryKey, category]) => (
                            <div key={categoryKey}>
                              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase">
                                {categoryKey.replace('_', ' ')}
                              </div>
                              {Object.entries(category).map(([key, product]) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name} - ${product.basePrice}
                                </SelectItem>
                              ))}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Size</Label>
                        <Select value={selectedSize} onValueChange={setSelectedSize}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedProduct.sizes.map((size) => (
                              <SelectItem key={size} value={size}>{size}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Material</Label>
                        <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedProduct.materials.map((material) => (
                              <SelectItem key={material} value={material} className="capitalize">
                                {material.replace('_', ' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Color</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedProduct.colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                              selectedColor === color ? 'border-primary shadow-lg' : 'border-border'
                            }`}
                            style={{ 
                              backgroundColor: 
                                color === 'white' ? '#FFFFFF' : 
                                color === 'black' ? '#000000' :
                                color === 'gray' ? '#9CA3AF' :
                                color === 'navy' ? '#1E293B' :
                                color === 'red' ? '#EF4444' :
                                color === 'blue' ? '#3B82F6' : 
                                color === 'natural' ? '#F5F5DC' :
                                color === 'clear' ? 'transparent' : color,
                              border: color === 'clear' ? '2px dashed #ccc' : undefined
                            }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Pricing Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Pricing Analysis
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Production Cost:</span>
                        <span className="font-semibold">${pricing.production}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Suggested Price:</span>
                        <span className="font-semibold text-primary">${pricing.suggested}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Your Profit:</span>
                        <span className="font-semibold text-green-500">${pricing.profit}</span>
                      </div>
                      <div className="flex justify-between items-center border-t pt-2">
                        <span className="text-sm font-medium">Profit Margin:</span>
                        <Badge className="bg-green-500/20 text-green-600">
                          {pricing.margin}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• Pricing includes material and size modifiers</p>
                      <p>• Design complexity affects suggested pricing</p>
                      <p>• Marketplace fees not included in calculations</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai-generator" className="p-4 space-y-6 overflow-y-auto">
                {userTier === 'free' ? (
                  <div className="text-center py-8">
                    <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">AI Generator</h3>
                    <p className="text-muted-foreground mb-4">
                      Upgrade to Pro to access AI-powered design generation
                    </p>
                    <Button className="bg-gradient-to-r from-primary to-secondary">
                      Upgrade to Pro
                    </Button>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI Design Generator
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Design Prompt</Label>
                          <Textarea
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="Describe your design idea..."
                            className="min-h-20 resize-none"
                          />
                          <div className="mt-2 text-xs text-muted-foreground">
                            Be specific about colors, style, and mood for best results
                          </div>
                        </div>

                        <div>
                          <Label>Style Category</Label>
                          <Select 
                            value={selectedCategory.id} 
                            onValueChange={(value) => {
                              const category = Object.values(DESIGN_CATEGORIES).find(c => c.id === value);
                              if (category) setSelectedCategory(category);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(DESIGN_CATEGORIES).map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Quick Prompts</Label>
                          <div className="grid grid-cols-1 gap-2 mt-2">
                            {AI_PROMPT_SUGGESTIONS.slice(0, 4).map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="text-left h-auto p-2 justify-start"
                                onClick={() => setAiPrompt(suggestion)}
                              >
                                <span className="text-xs truncate">{suggestion}</span>
                              </Button>
                            ))}
                          </div>
                        </div>

                        <Button
                          onClick={generateAIDesign}
                          disabled={!aiPrompt.trim() || aiGenerationProgress.stage !== 'idle'}
                          className="w-full bg-gradient-to-r from-primary to-secondary"
                        >
                          {aiGenerationProgress.stage !== 'idle' ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              {aiGenerationProgress.message}
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Generate AI Design
                            </>
                          )}
                        </Button>

                        {aiGenerationProgress.stage !== 'idle' && (
                          <div className="space-y-2">
                            <Progress value={aiGenerationProgress.progress} className="h-2" />
                            <p className="text-sm text-muted-foreground text-center">
                              {aiGenerationProgress.message}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="publish" className="p-4 space-y-6 overflow-y-auto">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Publish to Marketplaces
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <Label>Design Title</Label>
                      <Input
                        value={designTitle}
                        onChange={(e) => setDesignTitle(e.target.value)}
                        placeholder="Enter design title..."
                      />
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={designDescription}
                        onChange={(e) => setDesignDescription(e.target.value)}
                        placeholder="Describe your design..."
                        className="min-h-20 resize-none"
                      />
                    </div>

                    <div>
                      <Label>Available Marketplaces</Label>
                      <div className="grid grid-cols-1 gap-3 mt-2">
                        {Object.values(MARKETPLACES).map((marketplace) => (
                          <Card 
                            key={marketplace.id} 
                            className="p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                            onClick={() => publishToMarketplace(marketplace.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                                  <Globe className="h-4 w-4" />
                                </div>
                                <div>
                                  <div className="font-medium">{marketplace.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {marketplace.commission}% commission
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {marketplace.category}
                                </Badge>
                                <Button size="sm" variant="outline">
                                  Publish
                                </Button>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-2">
                              Features: {marketplace.features.slice(0, 2).join(', ')}
                              {marketplace.features.length > 2 && '...'}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Export Options</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {(['png', 'jpg', 'svg', 'pdf'] as const).map((format) => (
                          <Button
                            key={format}
                            variant="outline"
                            onClick={() => exportDesign(format)}
                            disabled={isExporting}
                            className="justify-center"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {format.toUpperCase()}
                          </Button>
                        ))}
                      </div>
                      
                      {isExporting && (
                        <div className="space-y-2">
                          <Progress value={exportProgress} className="h-2" />
                          <p className="text-xs text-muted-foreground text-center">
                            Exporting... {exportProgress}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const img = new Image();
              img.onload = () => {
                const maxSize = Math.min(canvasState.canvasWidth, canvasState.canvasHeight) / 2;
                const aspectRatio = img.width / img.height;
                const width = aspectRatio > 1 ? maxSize : maxSize * aspectRatio;
                const height = aspectRatio > 1 ? maxSize / aspectRatio : maxSize;
                
                addElement({
                  type: 'image',
                  content: event.target?.result as string,
                  x: canvasState.canvasWidth / 2 - width / 2,
                  y: canvasState.canvasHeight / 2 - height / 2,
                  width,
                  height,
                  rotation: 0,
                  opacity: 1,
                  properties: {
                    originalWidth: img.width,
                    originalHeight: img.height,
                    maintainAspectRatio: true,
                    filter: 'none',
                    brightness: 100,
                    contrast: 100,
                    saturation: 100
                  }
                });
              };
              img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
          }
        }}
      />

      {/* Templates Modal */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowTemplates(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Design Templates</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowTemplates(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {DESIGN_TEMPLATES.map((template) => (
                    <Card 
                      key={template.id}
                      className="cursor-pointer hover:shadow-lg transition-all group"
                      onClick={() => applyTemplate(template)}
                    >
                      <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center">
                        <div className="text-4xl opacity-50">
                          {template.category === 'text' && <Type />}
                          {template.category === 'abstract' && <Sparkles />}
                          {template.category === 'vintage' && <Star />}
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium group-hover:text-primary transition-colors">
                            {template.name}
                          </h3>
                          {template.premium && (
                            <Badge className="bg-gradient-to-r from-primary to-secondary text-white">
                              Pro
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {template.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}