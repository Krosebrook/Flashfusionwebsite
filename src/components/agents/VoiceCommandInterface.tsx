import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Waveform,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Settings,
  Headphones,
  Play,
  Pause
} from 'lucide-react';
import { cn } from '../ui/utils';
import { Agent, VoiceCommand } from '../../types/multi-agent-orchestration';
import { VOICE_COMMAND_PATTERNS } from '../../constants/multi-agent-orchestration';

interface VoiceCommandInterfaceProps {
  isListening: boolean;
  onToggleListening: (listening: boolean) => void;
  onCommand: (command: VoiceCommand) => void;
  recentCommands: VoiceCommand[];
  agents: Agent[];
}

export function VoiceCommandInterface({
  isListening,
  onToggleListening,
  onCommand,
  recentCommands,
  agents
}: VoiceCommandInterfaceProps) {
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [selectedModel, setSelectedModel] = useState('natural');
  const [confidence, setConfidence] = useState(0);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map(result => result.transcript)
          .join('');

        setCurrentTranscript(transcript);
        
        if (event.results[event.results.length - 1].isFinal) {
          processVoiceCommand(transcript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        onToggleListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.start();
      startAudioMonitoring();
    } else if (recognitionRef.current) {
      recognitionRef.current.stop();
      stopAudioMonitoring();
    }
  }, [isListening]);

  const startAudioMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        if (!analyserRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        setVolumeLevel(average / 255 * 100);
        
        if (isListening) {
          requestAnimationFrame(updateVolume);
        }
      };
      
      updateVolume();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopAudioMonitoring = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setVolumeLevel(0);
  };

  const processVoiceCommand = async (transcript: string) => {
    setIsProcessing(true);
    setCurrentTranscript('');
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const command = parseVoiceCommand(transcript);
    setConfidence(command.confidence);
    
    if (command.confidence > 0.7) {
      onCommand(command);
      
      // Provide voice feedback
      if (voiceEnabled) {
        speakResponse(command.response);
      }
    }
    
    setIsProcessing(false);
  };

  const parseVoiceCommand = (transcript: string): VoiceCommand => {
    const lowerTranscript = transcript.toLowerCase();
    
    // Simple pattern matching for demo
    let intent = 'unknown';
    let entities: any[] = [];
    let confidence = 0.5;
    let response = "I didn't understand that command.";

    if (lowerTranscript.includes('show') && lowerTranscript.includes('status')) {
      intent = 'show_agent_status';
      confidence = 0.9;
      response = "Showing agent status dashboard.";
    } else if (lowerTranscript.includes('schedule') && lowerTranscript.includes('handoff')) {
      intent = 'schedule_handoff';
      confidence = 0.85;
      response = "Scheduling agent handoff.";
    } else if (lowerTranscript.includes('progress') || lowerTranscript.includes('how are we doing')) {
      intent = 'check_progress';
      confidence = 0.88;
      response = "Here's your project progress overview.";
    } else if (lowerTranscript.includes('resolve') && lowerTranscript.includes('conflict')) {
      intent = 'resolve_conflict';
      confidence = 0.82;
      response = "Initiating conflict resolution protocol.";
    }

    return {
      id: `cmd-${Date.now()}`,
      transcript,
      intent: intent as any,
      entities,
      confidence,
      timestamp: new Date(),
      response
    };
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleToggleListening = () => {
    const newState = !isListening;
    setIsListening(newState);
    onToggleListening(newState);
  };

  const getCommandStatusIcon = (command: VoiceCommand) => {
    if (command.confidence > 0.8) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    } else if (command.confidence > 0.6) {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Main Voice Interface */}
      <Card className="p-8">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Voice Command Center</h2>
            <p className="text-muted-foreground">
              Control your agent orchestration with natural voice commands
            </p>
          </div>

          {/* Voice Control Button */}
          <div className="flex justify-center">
            <motion.button
              onClick={handleToggleListening}
              className={cn(
                "relative w-32 h-32 rounded-full border-4 transition-all duration-300",
                isListening 
                  ? "border-red-500 bg-red-500/20 shadow-lg shadow-red-500/25" 
                  : "border-primary bg-primary/20 hover:bg-primary/30"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isListening ? (
                  <motion.div
                    key="listening"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center justify-center h-full"
                  >
                    <MicOff className="h-8 w-8 text-red-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="not-listening"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center justify-center h-full"
                  >
                    <Mic className="h-8 w-8 text-primary" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Volume Level Indicator */}
              {isListening && (
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-red-500"
                  animate={{
                    scale: 1 + (volumeLevel / 100) * 0.3,
                    opacity: 0.6 + (volumeLevel / 100) * 0.4
                  }}
                  transition={{ duration: 0.1 }}
                />
              )}
            </motion.button>
          </div>

          {/* Status Display */}
          <div className="space-y-3">
            <div className={cn(
              "text-lg font-semibold",
              isListening ? "text-red-500" : "text-muted-foreground"
            )}>
              {isListening ? "Listening..." : "Click to Start"}
            </div>

            {/* Live Transcript */}
            <AnimatePresence>
              {currentTranscript && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-muted/50 rounded-lg p-3 min-h-12 flex items-center justify-center"
                >
                  <p className="text-center italic">"{currentTranscript}"</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Processing Indicator */}
            <AnimatePresence>
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2 text-primary"
                >
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                  <span className="text-sm">Processing command...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>

      {/* Voice Settings */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Voice Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Voice Feedback</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className="h-8 px-2"
              >
                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm">Recognition Model</label>
              <select 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-card border border-border rounded-md px-3 py-1 text-sm"
              >
                <option value="natural">Natural Speech</option>
                <option value="precise">Precise Commands</option>
                <option value="multilingual">Multi-language</option>
              </select>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3">Quick Commands</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs px-2">Say:</Badge>
              <span className="text-muted-foreground">"Show agent status"</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs px-2">Say:</Badge>
              <span className="text-muted-foreground">"Check progress"</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs px-2">Say:</Badge>
              <span className="text-muted-foreground">"Schedule handoff"</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs px-2">Say:</Badge>
              <span className="text-muted-foreground">"Resolve conflict"</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Commands */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Commands</h3>
          <Badge variant="outline">{recentCommands.length} commands</Badge>
        </div>
        
        <div className="space-y-3">
          {recentCommands.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No voice commands yet. Try saying "Show agent status"</p>
            </div>
          ) : (
            recentCommands.map((command, index) => (
              <motion.div
                key={command.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {getCommandStatusIcon(command)}
                  <Clock className="h-3 w-3 text-muted-foreground" />
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="text-sm font-medium">"{command.transcript}"</div>
                  <div className="text-xs text-muted-foreground">
                    Confidence: {Math.round(command.confidence * 100)}% • {command.response}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {command.timestamp.toLocaleTimeString()}
                  </div>
                </div>

                <Badge 
                  variant="secondary" 
                  className={cn(
                    "text-xs",
                    command.confidence > 0.8 && "bg-green-500/20 text-green-700",
                    command.confidence <= 0.8 && command.confidence > 0.6 && "bg-yellow-500/20 text-yellow-700",
                    command.confidence <= 0.6 && "bg-red-500/20 text-red-700"
                  )}
                >
                  {command.intent.replace('_', ' ')}
                </Badge>
              </motion.div>
            ))
          )}
        </div>
      </Card>

      {/* Microphone Permissions */}
      {'mediaDevices' in navigator && (
        <Card className="p-4 border-orange-200 bg-orange-50/50">
          <div className="flex items-start gap-3">
            <Headphones className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-medium text-orange-800">Microphone Access Required</h4>
              <p className="text-sm text-orange-700">
                Grant microphone permissions to use voice commands. Your voice data is processed locally and never stored.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}