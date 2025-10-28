import { useState } from 'react';
import { LiveCollaborationEditor } from '../collaboration/LiveCollaborationEditor';
import { TeamCollaboration } from '../collaboration/TeamCollaboration';
import { TeamDevelopmentDashboard } from '../collaboration/TeamDevelopmentDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Users, Code, Workflow } from 'lucide-react';

interface CollaborationPageProps {
  projectId?: string;
  currentUserId: string;
}

export function CollaborationPage({ projectId = 'current-project', currentUserId }: CollaborationPageProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleContentChange = (fileId: string, content: string) => {
    console.log('File content changed:', fileId, content);
  };

  const handleSave = async (files: any[]) => {
    console.log('Saving files:', files);
  };

  return (
    <div className="space-y-6">
      <div className="ff-fade-in-up">
        <h1 className="text-3xl font-bold ff-text-gradient mb-2">Team Collaboration Hub</h1>
        <p className="text-ff-text-secondary">
          Real-time collaboration for AI-powered development workflows with your team.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 ff-stagger-fade">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            Development Dashboard
          </TabsTrigger>
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Live Editor
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <TeamDevelopmentDashboard
            userId={currentUserId}
            onSessionCreate={(session) => {
              console.log('New collaboration session created:', session);
            }}
            onSessionJoin={(sessionId) => {
              console.log('Joined collaboration session:', sessionId);
            }}
          />
        </TabsContent>

        <TabsContent value="editor" className="space-y-6">
          <LiveCollaborationEditor
            projectId={projectId}
            currentUserId={currentUserId}
            onContentChange={handleContentChange}
            onSave={handleSave}
          />
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <TeamCollaboration
            projectId={projectId}
            currentUserId={currentUserId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}