import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Users, MessageSquare, Eye, Edit3, Share2, 
  Save, Play, GitBranch, Clock, Cursor, 
  FileText, Code, Settings, Bell, Video,
  Mic, MicOff, VideoOff, Phone, PhoneOff
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'sonner@2.0.3';

interface CollaboratorPresence {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    color: string;
  };
  cursor?: {
    line: number;
    column: number;
  };
  selection?: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
  isActive: boolean;
  isTyping: boolean;
  lastActive: string;
  currentFile: string;
}

interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  position: {
    line: number;
    column: number;
  };
  isResolved: boolean;
  createdAt: string;
  replies: Comment[];
}

interface FileContent {
  id: string;
  name: string;
  content: string;
  language: string;
  lastModified: string;
  modifiedBy: string;
}

interface LiveCollaborationEditorProps {
  projectId: string;
  currentUserId: string;
  onContentChange?: (fileId: string, content: string) => void;
  onSave?: (files: FileContent[]) => void;
}

export function LiveCollaborationEditor({ 
  projectId, 
  currentUserId, 
  onContentChange,
  onSave 
}: LiveCollaborationEditorProps) {
  const [collaborators, setCollaborators] = useState<CollaboratorPresence[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [files, setFiles] = useState<FileContent[]>([]);
  const [activeFile, setActiveFile] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [showPresence, setShowPresence] = useState(true);
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeCollaboration();
    loadProjectFiles();
  }, [projectId]);

  const initializeCollaboration = async () => {
    try {
      // Mock WebSocket connection simulation
      setIsConnected(true);
      
      // Mock collaborators
      const mockCollaborators: CollaboratorPresence[] = [
        {
          id: '1',
          user: {
            id: '1',
            name: 'Alice Johnson',
            avatar: '/api/placeholder/32/32',
            color: '#FF7B00'
          },
          cursor: { line: 15, column: 23 },
          isActive: true,
          isTyping: false,
          lastActive: '2 seconds ago',
          currentFile: 'App.tsx'
        },
        {
          id: '2',
          user: {
            id: '2',
            name: 'Bob Smith',
            avatar: '/api/placeholder/32/32',
            color: '#00B4D8'
          },
          cursor: { line: 8, column: 10 },
          selection: {
            start: { line: 8, column: 5 },
            end: { line: 8, column: 20 }
          },
          isActive: true,
          isTyping: true,
          lastActive: '1 minute ago',
          currentFile: 'components/Header.tsx'
        },
        {
          id: '3',
          user: {
            id: '3',
            name: 'Carol Davis',
            color: '#E91E63'
          },
          isActive: false,
          isTyping: false,
          lastActive: '5 minutes ago',
          currentFile: 'styles/globals.css'
        }
      ];
      
      setCollaborators(mockCollaborators);
      toast.success('Connected to collaborative session');
    } catch (error) {
      console.error('Error initializing collaboration:', error);
      toast.error('Failed to connect to collaborative session');
    }
  };

  const loadProjectFiles = async () => {
    try {
      // Mock project files
      const mockFiles: FileContent[] = [
        {
          id: 'app-tsx',
          name: 'App.tsx',
          content: `import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;`,
          language: 'typescript',
          lastModified: '2 minutes ago',
          modifiedBy: 'Alice Johnson'
        },
        {
          id: 'header-tsx',
          name: 'components/Header.tsx',
          content: `import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            MyApp
          </Link>
          <div className="space-x-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600">
              Home
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600">
              About
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;`,
          language: 'typescript',
          lastModified: '5 minutes ago',
          modifiedBy: 'Bob Smith'
        },
        {
          id: 'globals-css',
          name: 'styles/globals.css',
          content: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --background: #ffffff;
  --foreground: #0f172a;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  color: var(--foreground);
  background: var(--background);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}`,
          language: 'css',
          lastModified: '10 minutes ago',
          modifiedBy: 'Carol Davis'
        }
      ];
      
      setFiles(mockFiles);
      setActiveFile(mockFiles[0].id);
      setEditorContent(mockFiles[0].content);
      
      // Mock comments
      const mockComments: Comment[] = [
        {
          id: '1',
          author: {
            id: '2',
            name: 'Bob Smith',
            avatar: '/api/placeholder/32/32'
          },
          content: 'Should we add error handling here?',
          position: { line: 10, column: 0 },
          isResolved: false,
          createdAt: '5 minutes ago',
          replies: [
            {
              id: '2',
              author: {
                id: '1',
                name: 'Alice Johnson',
                avatar: '/api/placeholder/32/32'
              },
              content: 'Good point! I\'ll add a try-catch block.',
              position: { line: 10, column: 0 },
              isResolved: false,
              createdAt: '3 minutes ago',
              replies: []
            }
          ]
        }
      ];
      
      setComments(mockComments);
    } catch (error) {
      console.error('Error loading project files:', error);
    }
  };

  const handleContentChange = useCallback((content: string) => {
    setEditorContent(content);
    setIsTyping(true);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
    
    // Broadcast changes to other collaborators
    onContentChange?.(activeFile, content);
    
    // Update file content
    setFiles(prev => prev.map(file => 
      file.id === activeFile 
        ? { ...file, content, lastModified: 'just now', modifiedBy: 'You' }
        : file
    ));
  }, [activeFile, onContentChange]);

  const handleSaveFiles = async () => {
    try {
      await onSave?.(files);
      toast.success('Files saved successfully');
    } catch (error) {
      toast.error('Failed to save files');
    }
  };

  const addComment = (line: number) => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        id: currentUserId,
        name: 'You'
      },
      content: newComment,
      position: { line, column: 0 },
      isResolved: false,
      createdAt: 'just now',
      replies: []
    };
    
    setComments(prev => [...prev, comment]);
    setNewComment('');
    setSelectedLine(null);
    toast.success('Comment added');
  };

  const toggleVoiceCall = () => {
    setIsVoiceCallActive(!isVoiceCallActive);
    if (!isVoiceCallActive) {
      toast.success('Voice call started');
    } else {
      toast.success('Voice call ended');
    }
  };

  const currentFile = files.find(f => f.id === activeFile);
  const activeCollaborators = collaborators.filter(c => c.isActive);
  const currentFileComments = comments.filter(c => 
    c.position.line >= 0 // All comments for now, in real app would filter by file
  );

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          {/* Active Collaborators */}
          <div className="flex items-center gap-1">
            {activeCollaborators.map((collaborator) => (
              <div key={collaborator.id} className="relative">
                <Avatar className="h-6 w-6 border-2" style={{ borderColor: collaborator.user.color }}>
                  <AvatarImage src={collaborator.user.avatar} />
                  <AvatarFallback className="text-xs">
                    {collaborator.user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {collaborator.isTyping && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border border-background" />
                )}
              </div>
            ))}
            <Badge variant="secondary" className="text-xs ml-2">
              {activeCollaborators.length} online
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isVoiceCallActive ? 'destructive' : 'outline'}
            size="sm"
            onClick={toggleVoiceCall}
          >
            {isVoiceCallActive ? (
              <PhoneOff className="h-4 w-4" />
            ) : (
              <Phone className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            disabled={isMuted}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPresence(!showPresence)}
          >
            <Users className="h-4 w-4" />
          </Button>

          <Button onClick={handleSaveFiles} className="ff-btn-primary">
            <Save className="h-4 w-4 mr-2" />
            Save All
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* File Explorer */}
        <div className="w-64 border-r bg-card">
          <div className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Project Files
            </h3>
            <div className="space-y-1">
              {files.map((file) => (
                <button
                  key={file.id}
                  onClick={() => {
                    setActiveFile(file.id);
                    setEditorContent(file.content);
                  }}
                  className={`w-full text-left p-2 rounded text-sm transition-colors ${
                    activeFile === file.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{file.name}</span>
                    {file.lastModified === 'just now' && (
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {file.lastModified} by {file.modifiedBy}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col">
          {currentFile && (
            <>
              {/* Editor Header */}
              <div className="flex items-center justify-between p-3 border-b bg-card">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  <span className="font-medium">{currentFile.name}</span>
                  {isTyping && (
                    <Badge variant="secondary" className="text-xs animate-pulse">
                      Typing...
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Last modified {currentFile.lastModified}</span>
                </div>
              </div>

              {/* Code Editor */}
              <div className="flex-1 relative">
                <div className="absolute inset-0 flex">
                  <div className="flex-1 relative">
                    <textarea
                      ref={editorRef}
                      value={editorContent}
                      onChange={(e) => handleContentChange(e.target.value)}
                      className="w-full h-full p-4 font-mono text-sm bg-background border-none outline-none resize-none"
                      style={{ 
                        fontFamily: 'JetBrains Mono, SF Mono, Consolas, monospace',
                        lineHeight: '1.5',
                        tabSize: 2
                      }}
                      spellCheck={false}
                      onClick={(e) => {
                        const textarea = e.target as HTMLTextAreaElement;
                        const lines = textarea.value.substr(0, textarea.selectionStart).split('\n');
                        const currentLine = lines.length;
                        setSelectedLine(currentLine);
                      }}
                    />
                    
                    {/* Live Cursors */}
                    {showPresence && collaborators.map((collaborator) => (
                      collaborator.cursor && collaborator.isActive && (
                        <motion.div
                          key={collaborator.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute pointer-events-none"
                          style={{
                            top: `${collaborator.cursor.line * 1.5}rem`,
                            left: `${collaborator.cursor.column * 0.6}rem`,
                            zIndex: 10
                          }}
                        >
                          <div 
                            className="w-0.5 h-5 animate-pulse"
                            style={{ backgroundColor: collaborator.user.color }}
                          />
                          <div 
                            className="absolute -top-6 left-0 px-2 py-1 rounded text-xs text-white whitespace-nowrap"
                            style={{ backgroundColor: collaborator.user.color }}
                          >
                            {collaborator.user.name}
                          </div>
                        </motion.div>
                      )
                    ))}

                    {/* Comment Indicators */}
                    {showComments && currentFileComments.map((comment) => (
                      <div
                        key={comment.id}
                        className="absolute left-0 w-2 h-5 bg-yellow-500 rounded-r cursor-pointer hover:bg-yellow-600"
                        style={{
                          top: `${comment.position.line * 1.5}rem`,
                          zIndex: 5
                        }}
                        title={`${comment.author.name}: ${comment.content}`}
                      />
                    ))}
                  </div>

                  {/* Syntax Highlighted Preview */}
                  <div className="w-1/2 border-l bg-card">
                    <div className="p-3 border-b">
                      <span className="text-sm font-medium">Live Preview</span>
                    </div>
                    <ScrollArea className="h-full p-4">
                      <SyntaxHighlighter
                        language={currentFile.language}
                        style={vscDarkPlus}
                        customStyle={{
                          backgroundColor: 'transparent',
                          padding: 0,
                          margin: 0,
                          fontSize: '0.875rem'
                        }}
                        wrapLongLines={true}
                      >
                        {editorContent}
                      </SyntaxHighlighter>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Comments Panel */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-80 border-l bg-card flex flex-col"
            >
              <div className="p-4 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Comments
                </h3>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {currentFileComments.map((comment) => (
                    <Card key={comment.id} className="p-3">
                      <div className="flex items-start gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={comment.author.avatar} />
                          <AvatarFallback className="text-xs">
                            {comment.author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{comment.author.name}</span>
                            <span className="text-xs text-muted-foreground">
                              Line {comment.position.line}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm mb-2">{comment.content}</p>
                      
                      {comment.replies.length > 0 && (
                        <div className="pl-4 border-l space-y-2">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="text-sm">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{reply.author.name}</span>
                                <span className="text-xs text-muted-foreground">{reply.createdAt}</span>
                              </div>
                              <p>{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex gap-2 mt-2">
                        <Button variant="ghost" size="sm" className="text-xs">
                          Reply
                        </Button>
                        {!comment.isResolved && (
                          <Button variant="ghost" size="sm" className="text-xs">
                            Resolve
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
              
              {/* Add Comment */}
              {selectedLine && (
                <div className="p-4 border-t">
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      Add comment to line {selectedLine}
                    </div>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full p-2 text-sm border rounded resize-none bg-background"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => addComment(selectedLine)}
                        disabled={!newComment.trim()}
                        className="ff-btn-primary"
                      >
                        Add Comment
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedLine(null);
                          setNewComment('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-card border-t text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>
            {collaborators.filter(c => c.isTyping).length > 0 && (
              <span className="text-green-500 animate-pulse">
                {collaborators.filter(c => c.isTyping).map(c => c.user.name).join(', ')} typing...
              </span>
            )}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <span>Language: {currentFile?.language}</span>
          <span>Lines: {editorContent.split('\n').length}</span>
          <span>Characters: {editorContent.length}</span>
        </div>
      </div>
    </div>
  );
}