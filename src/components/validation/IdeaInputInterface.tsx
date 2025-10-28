import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { 
  FileText, 
  Mic, 
  Upload, 
  Play, 
  Pause, 
  Square,
  Check,
  X,
  Loader2,
  Sparkles,
  Brain,
  Target,
  Users,
  Lightbulb,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Info,
  ArrowRight,
  Zap,
  Clock,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { ValidationIdea } from '../../types/core';

interface IdeaInputInterfaceProps {
  onIdeaSubmit?: (idea: Partial<ValidationIdea>) => void;
  onBack?: () => void;
}

export function IdeaInputInterface({ onIdeaSubmit, onBack }: IdeaInputInterfaceProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'voice' | 'document'>('text');
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout>();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    targetAudience: '',
    problemStatement: '',
    proposedSolution: '',
    rawInput: '',
    additionalContext: ''
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const categories = [
    'saas',
    'ecommerce', 
    'content',
    'service',
    'marketplace',
    'other'
  ];

  const processingSteps = [
    'Analyzing input content...',
    'Extracting key insights...',
    'Identifying problem statement...',
    'Determining target audience...',
    'Preparing validation pipeline...'
  ];

  // Voice recording handlers
  const startRecording = useCallback(() => {
    setIsRecording(true);
    setRecordingTime(0);
    
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    // Simulate voice recording
    setTimeout(() => {
      if (isRecording) {
        stopRecording();
      }
    }, 30000); // Auto-stop after 30 seconds for demo
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
    
    // Simulate transcription
    setTimeout(() => {
      setVoiceTranscript("I have an idea for a SaaS platform that helps small businesses manage their social media presence more effectively. The problem is that many small business owners don't have time to create consistent, engaging content across multiple platforms, and they can't afford to hire social media managers. My solution would be an AI-powered tool that generates personalized content based on their business type, analyzes their audience engagement, and automatically schedules posts across platforms. The target audience would be small to medium business owners who want to improve their online presence but lack the time or expertise.");
    }, 2000);
  }, []);

  const pauseRecording = useCallback(() => {
    // In a real implementation, this would pause the recording
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
  }, []);

  // File upload handler
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate file upload and processing
    setTimeout(() => {
      setIsUploading(false);
      setFormData(prev => ({
        ...prev,
        rawInput: `Document processed: "${file.name}"\n\nExtracted content: Business concept for an AI-powered fitness coaching app that provides personalized workout plans and nutrition guidance. The app would use machine learning to adapt to user progress and preferences, offering real-time form correction through computer vision, and integration with wearable devices for comprehensive health tracking.`
      }));
    }, 3000);
  }, []);

  // Form validation
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    
    if (!formData.targetAudience.trim()) {
      errors.targetAudience = 'Target audience is required';
    }
    
    if (!formData.problemStatement.trim()) {
      errors.problemStatement = 'Problem statement is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // AI-powered field suggestions
  const generateSuggestions = useCallback((field: string) => {
    setIsProcessing(true);
    setProcessingStep(0);
    
    const interval = setInterval(() => {
      setProcessingStep(prev => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(interval);
          setIsProcessing(false);
          
          // Generate suggestions based on field
          switch (field) {
            case 'problemStatement':
              setFormData(prev => ({
                ...prev,
                problemStatement: 'Small business owners struggle to maintain consistent social media presence due to time constraints and lack of content creation expertise, resulting in poor online engagement and missed customer acquisition opportunities.'
              }));
              break;
            case 'targetAudience':
              setFormData(prev => ({
                ...prev,
                targetAudience: 'Small to medium business owners (1-50 employees) who want to improve their social media presence but lack dedicated marketing resources or expertise.'
              }));
              break;
            case 'proposedSolution':
              setFormData(prev => ({
                ...prev,
                proposedSolution: 'An AI-powered SaaS platform that generates personalized social media content, provides engagement analytics, and automates posting schedules across multiple platforms, specifically designed for small businesses.'
              }));
              break;
          }
          return prev;
        }
        return prev + 1;
      });
    }, 800);
  }, []);

  // Form submission
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    const ideaData: Partial<ValidationIdea> = {
      title: formData.title,
      description: formData.description,
      category: formData.category as any,
      targetAudience: formData.targetAudience,
      problemStatement: formData.problemStatement,
      proposedSolution: formData.proposedSolution,
      inputMethod: activeTab,
      rawInput: activeTab === 'voice' ? voiceTranscript : formData.rawInput,
      voiceTranscript: activeTab === 'voice' ? voiceTranscript : undefined,
      status: 'submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onIdeaSubmit?.(ideaData);
  }, [formData, activeTab, voiceTranscript, validateForm, onIdeaSubmit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-2">
          <Lightbulb className="w-8 h-8 text-primary" />
          <h1 className="ff-text-gradient">Submit Your Idea</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Share your business idea through text, voice, or document upload. Our AI will analyze and prepare it for comprehensive validation.
        </p>
      </motion.div>

      {/* Input Method Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Text Input</span>
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center space-x-2">
              <Mic className="w-4 h-4" />
              <span>Voice Recording</span>
            </TabsTrigger>
            <TabsTrigger value="document" className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Document Upload</span>
            </TabsTrigger>
          </TabsList>

          {/* Text Input Tab */}
          <TabsContent value="text" className="space-y-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <span>Describe Your Idea</span>
                </CardTitle>
                <CardDescription>
                  Provide detailed information about your business concept
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Idea Title *</label>
                    <Input
                      placeholder="e.g., AI-Powered Social Media Manager for SMBs"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className={validationErrors.title ? 'border-red-500' : ''}
                    />
                    {validationErrors.title && (
                      <p className="text-sm text-red-500">{validationErrors.title}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category *</label>
                    <Select value={formData.category} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, category: value }))
                    }>
                      <SelectTrigger className={validationErrors.category ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.category && (
                      <p className="text-sm text-red-500">{validationErrors.category}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description *</label>
                  <Textarea
                    placeholder="Provide a comprehensive description of your business idea, including what it does and how it works..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className={validationErrors.description ? 'border-red-500' : ''}
                  />
                  {validationErrors.description && (
                    <p className="text-sm text-red-500">{validationErrors.description}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Target Audience *</label>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => generateSuggestions('targetAudience')}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3 mr-1" />
                      )}
                      AI Suggest
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Describe who would use your product or service..."
                    value={formData.targetAudience}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                    rows={2}
                    className={validationErrors.targetAudience ? 'border-red-500' : ''}
                  />
                  {validationErrors.targetAudience && (
                    <p className="text-sm text-red-500">{validationErrors.targetAudience}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Problem Statement *</label>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => generateSuggestions('problemStatement')}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3 mr-1" />
                      )}
                      AI Suggest
                    </Button>
                  </div>
                  <Textarea
                    placeholder="What specific problem does your idea solve?"
                    value={formData.problemStatement}
                    onChange={(e) => setFormData(prev => ({ ...prev, problemStatement: e.target.value }))}
                    rows={3}
                    className={validationErrors.problemStatement ? 'border-red-500' : ''}
                  />
                  {validationErrors.problemStatement && (
                    <p className="text-sm text-red-500">{validationErrors.problemStatement}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Proposed Solution</label>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => generateSuggestions('proposedSolution')}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3 mr-1" />
                      )}
                      AI Suggest
                    </Button>
                  </div>
                  <Textarea
                    placeholder="How does your idea solve the problem?"
                    value={formData.proposedSolution}
                    onChange={(e) => setFormData(prev => ({ ...prev, proposedSolution: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Additional Context</label>
                  <Textarea
                    placeholder="Any additional information, market research, or context you'd like to share..."
                    value={formData.additionalContext}
                    onChange={(e) => setFormData(prev => ({ ...prev, additionalContext: e.target.value }))}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Voice Recording Tab */}
          <TabsContent value="voice" className="space-y-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mic className="w-5 h-5 text-secondary" />
                  <span>Voice Recording</span>
                </CardTitle>
                <CardDescription>
                  Record yourself explaining your business idea (up to 5 minutes)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative">
                    <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center ${
                      isRecording ? 'border-red-500 bg-red-500/10' : 'border-secondary bg-secondary/10'
                    }`}>
                      <Mic className={`w-12 h-12 ${isRecording ? 'text-red-500' : 'text-secondary'}`} />
                      {isRecording && (
                        <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping" />
                      )}
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <div className="text-2xl font-mono">
                      {formatTime(recordingTime)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {isRecording ? 'Recording in progress...' : 'Ready to record'}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {!isRecording ? (
                      <Button onClick={startRecording} className="ff-btn-secondary">
                        <Play className="w-4 h-4 mr-2" />
                        Start Recording
                      </Button>
                    ) : (
                      <>
                        <Button onClick={pauseRecording} variant="outline">
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </Button>
                        <Button onClick={stopRecording} className="ff-btn-accent">
                          <Square className="w-4 h-4 mr-2" />
                          Stop
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {voiceTranscript && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Transcription</h4>
                      <Badge variant="outline" className="text-green-500 border-green-500">
                        <Check className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm leading-relaxed">{voiceTranscript}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Re-record
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit Transcript
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Document Upload Tab */}
          <TabsContent value="document" className="space-y-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-accent" />
                  <span>Document Upload</span>
                </CardTitle>
                <CardDescription>
                  Upload a business plan, pitch deck, or any document describing your idea
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4 hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground">
                      PDF, DOC, DOCX, TXT files (max 10MB)
                    </p>
                  </div>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Browse Files
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {isUploading && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Processing document...</span>
                    </div>
                    <Progress value={66} className="h-2" />
                  </div>
                )}

                {formData.rawInput && !isUploading && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Extracted Content</h4>
                      <Badge variant="outline" className="text-green-500 border-green-500">
                        <Check className="w-3 h-3 mr-1" />
                        Processed
                      </Badge>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm leading-relaxed">{formData.rawInput}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Processing Status */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-primary/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-primary animate-pulse" />
                    <span className="font-medium">AI Processing</span>
                  </div>
                  <div className="space-y-2">
                    {processingSteps.map((step, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {index < processingStep ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : index === processingStep ? (
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        ) : (
                          <Clock className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className={`text-sm ${
                          index <= processingStep ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Progress value={(processingStep / (processingSteps.length - 1)) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between pt-6"
      >
        <Button variant="outline" onClick={onBack}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            Validation cost: <span className="font-medium text-primary">5 credits</span>
          </div>
          <Button 
            onClick={handleSubmit} 
            className="ff-btn-primary"
            disabled={isProcessing || isRecording || isUploading}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Start Validation
              </>
            )}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>

      {/* Help Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-500">Pro Tip</h4>
                <p className="text-sm text-muted-foreground">
                  Be specific about the problem you're solving and who experiences it.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Target className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-500">Better Results</h4>
                <p className="text-sm text-muted-foreground">
                  Include market size estimates and competitive analysis if available.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20 bg-orange-500/5">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-500">Remember</h4>
                <p className="text-sm text-muted-foreground">
                  Validation takes 15-30 minutes. You'll be notified when complete.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}