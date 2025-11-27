import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Users, 
  GitBranch, 
  Shield, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Mail,
  Copy,
  Eye,
  EyeOff,
  UserPlus,
  UserMinus,
  Clock,
  Activity,
  MessageSquare,
  Bell,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Crown,
  Star,
  Globe,
  Github
} from 'lucide-react';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'maintainer' | 'developer' | 'viewer';
  status: 'active' | 'pending' | 'inactive';
  joinedAt: string;
  lastActive: string;
  permissions: {
    read: boolean;
    write: boolean;
    admin: boolean;
    delete: boolean;
  };
  repositories: string[];
}

interface Team {
  id: string;
  name: string;
  description: string;
  slug: string;
  visibility: 'public' | 'private' | 'internal';
  createdAt: string;
  memberCount: number;
  repositoryCount: number;
  settings: {
    allowFork: boolean;
    requireApproval: boolean;
    enableNotifications: boolean;
    defaultPermissions: string;
  };
}

interface CollaborationActivity {
  id: string;
  type: 'commit' | 'merge' | 'comment' | 'invite' | 'permission_change' | 'repository_added';
  actor: string;
  target?: string;
  repository?: string;
  message: string;
  timestamp: string;
}

interface RepositoryAccess {
  repositoryId: string;
  repositoryName: string;
  url: string;
  permissions: 'read' | 'write' | 'admin';
  assignedMembers: string[];
  lastActivity: string;
  isPrivate: boolean;
}

const ROLE_PERMISSIONS = {
  owner: { read: true, write: true, admin: true, delete: true },
  admin: { read: true, write: true, admin: true, delete: false },
  maintainer: { read: true, write: true, admin: false, delete: false },
  developer: { read: true, write: true, admin: false, delete: false },
  viewer: { read: true, write: false, admin: false, delete: false }
};

const ROLE_HIERARCHY = ['owner', 'admin', 'maintainer', 'developer', 'viewer'];

export function TeamRepositoryManager() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [activities, setActivities] = useState<CollaborationActivity[]>([]);
  const [repositories, setRepositories] = useState<RepositoryAccess[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [currentUser] = useState({ id: 'current-user', role: 'owner' }); // Mock current user
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'developer' as TeamMember['role'],
    repositories: [] as string[],
    message: ''
  });
  
  const [teamForm, setTeamForm] = useState({
    name: '',
    description: '',
    slug: '',
    visibility: 'private' as Team['visibility']
  });

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = () => {
    // Load mock data - in production, this would be API calls
    const mockTeams: Team[] = [
      {
        id: 'team_1',
        name: 'FlashFusion Core Team',
        description: 'Core development team for FlashFusion platform',
        slug: 'flashfusion-core',
        visibility: 'private',
        createdAt: '2024-01-10T10:00:00Z',
        memberCount: 5,
        repositoryCount: 8,
        settings: {
          allowFork: true,
          requireApproval: true,
          enableNotifications: true,
          defaultPermissions: 'developer'
        }
      }
    ];

    const mockMembers: TeamMember[] = [
      {
        id: 'member_1',
        name: 'John Doe',
        email: 'john@flashfusion.ai',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        role: 'owner',
        status: 'active',
        joinedAt: '2024-01-10T10:00:00Z',
        lastActive: '2024-01-25T14:30:00Z',
        permissions: ROLE_PERMISSIONS.owner,
        repositories: ['repo_1', 'repo_2', 'repo_3']
      },
      {
        id: 'member_2',
        name: 'Jane Smith',
        email: 'jane@flashfusion.ai',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=32&h=32&fit=crop&crop=face',
        role: 'admin',
        status: 'active',
        joinedAt: '2024-01-12T09:15:00Z',
        lastActive: '2024-01-25T16:45:00Z',
        permissions: ROLE_PERMISSIONS.admin,
        repositories: ['repo_1', 'repo_2']
      }
    ];

    const mockActivities: CollaborationActivity[] = [
      {
        id: 'activity_1',
        type: 'commit',
        actor: 'John Doe',
        repository: 'FlashFusion Core',
        message: 'Added new webhook integration features',
        timestamp: '2024-01-25T14:30:00Z'
      },
      {
        id: 'activity_2',
        type: 'invite',
        actor: 'Jane Smith',
        target: 'alex@example.com',
        message: 'Invited new team member as developer',
        timestamp: '2024-01-25T12:15:00Z'
      }
    ];

    const mockRepositories: RepositoryAccess[] = [
      {
        repositoryId: 'repo_1',
        repositoryName: 'flashfusion-core',
        url: 'https://github.com/flashfusion/core',
        permissions: 'admin',
        assignedMembers: ['member_1', 'member_2'],
        lastActivity: '2024-01-25T14:30:00Z',
        isPrivate: true
      }
    ];

    setTeams(mockTeams);
    setMembers(mockMembers);
    setActivities(mockActivities);
    setRepositories(mockRepositories);
    
    if (mockTeams.length > 0 && !selectedTeam) {
      setSelectedTeam(mockTeams[0].id);
    }
  };

  const inviteTeamMember = async () => {
    if (!inviteForm.email) {
      toast.error('Email is required');
      return;
    }

    try {
      const newMember: TeamMember = {
        id: `member_${Date.now()}`,
        name: inviteForm.email.split('@')[0],
        email: inviteForm.email,
        role: inviteForm.role,
        status: 'pending',
        joinedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        permissions: ROLE_PERMISSIONS[inviteForm.role],
        repositories: inviteForm.repositories
      };

      setMembers(prev => [...prev, newMember]);
      
      // Add activity
      const activity: CollaborationActivity = {
        id: `activity_${Date.now()}`,
        type: 'invite',
        actor: 'Current User',
        target: inviteForm.email,
        message: `Invited ${inviteForm.email} as ${inviteForm.role}`,
        timestamp: new Date().toISOString()
      };
      
      setActivities(prev => [activity, ...prev]);
      
      setInviteForm({
        email: '',
        role: 'developer',
        repositories: [],
        message: ''
      });
      setShowInviteModal(false);
      
      toast.success(`Invitation sent to ${inviteForm.email}`);
    } catch (error) {
      console.error('Failed to invite member:', error);
      toast.error('Failed to send invitation');
    }
  };

  const removeMember = async (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    // Check permissions
    if (member.role === 'owner' && currentUser.role !== 'owner') {
      toast.error('Only owners can remove other owners');
      return;
    }

    try {
      setMembers(prev => prev.filter(m => m.id !== memberId));
      
      const activity: CollaborationActivity = {
        id: `activity_${Date.now()}`,
        type: 'permission_change',
        actor: 'Current User',
        target: member.name,
        message: `Removed ${member.name} from the team`,
        timestamp: new Date().toISOString()
      };
      
      setActivities(prev => [activity, ...prev]);
      toast.success(`${member.name} has been removed from the team`);
    } catch (error) {
      console.error('Failed to remove member:', error);
      toast.error('Failed to remove member');
    }
  };

  const updateMemberRole = async (memberId: string, newRole: TeamMember['role']) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    // Check permissions
    const currentUserRoleIndex = ROLE_HIERARCHY.indexOf(currentUser.role as any);
    const targetRoleIndex = ROLE_HIERARCHY.indexOf(newRole);
    
    if (targetRoleIndex <= currentUserRoleIndex && currentUser.role !== 'owner') {
      toast.error('You cannot assign a role equal to or higher than your own');
      return;
    }

    try {
      setMembers(prev => prev.map(m => 
        m.id === memberId 
          ? { ...m, role: newRole, permissions: ROLE_PERMISSIONS[newRole] }
          : m
      ));
      
      const activity: CollaborationActivity = {
        id: `activity_${Date.now()}`,
        type: 'permission_change',
        actor: 'Current User',
        target: member.name,
        message: `Changed ${member.name}'s role to ${newRole}`,
        timestamp: new Date().toISOString()
      };
      
      setActivities(prev => [activity, ...prev]);
      toast.success(`${member.name}'s role updated to ${newRole}`);
    } catch (error) {
      console.error('Failed to update member role:', error);
      toast.error('Failed to update member role');
    }
  };

  const createTeam = async () => {
    if (!teamForm.name || !teamForm.slug) {
      toast.error('Team name and slug are required');
      return;
    }

    try {
      const newTeam: Team = {
        id: `team_${Date.now()}`,
        name: teamForm.name,
        description: teamForm.description,
        slug: teamForm.slug,
        visibility: teamForm.visibility,
        createdAt: new Date().toISOString(),
        memberCount: 1,
        repositoryCount: 0,
        settings: {
          allowFork: true,
          requireApproval: true,
          enableNotifications: true,
          defaultPermissions: 'developer'
        }
      };

      setTeams(prev => [...prev, newTeam]);
      setSelectedTeam(newTeam.id);
      
      setTeamForm({
        name: '',
        description: '',
        slug: '',
        visibility: 'private'
      });
      setShowCreateTeamModal(false);
      
      toast.success('Team created successfully');
    } catch (error) {
      console.error('Failed to create team:', error);
      toast.error('Failed to create team');
    }
  };

  const copyInviteLink = () => {
    const inviteUrl = `https://flashfusion.ai/invite/${selectedTeam}`;
    navigator.clipboard.writeText(inviteUrl);
    toast.success('Invite link copied to clipboard');
  };

  const getRoleIcon = (role: TeamMember['role']) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-3 w-3 text-ff-warning" />;
      case 'admin':
        return <Shield className="h-3 w-3 text-ff-primary" />;
      case 'maintainer':
        return <Star className="h-3 w-3 text-ff-secondary" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: TeamMember['status']) => {
    const variants = {
      active: 'default' as const,
      pending: 'secondary' as const,
      inactive: 'outline' as const
    };
    
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getActivityIcon = (type: CollaborationActivity['type']) => {
    switch (type) {
      case 'commit':
        return <GitBranch className="h-4 w-4 text-ff-success" />;
      case 'merge':
        return <GitBranch className="h-4 w-4 text-ff-primary" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-ff-secondary" />;
      case 'invite':
        return <UserPlus className="h-4 w-4 text-ff-accent" />;
      case 'permission_change':
        return <Shield className="h-4 w-4 text-ff-warning" />;
      case 'repository_added':
        return <Github className="h-4 w-4 text-ff-text-muted" />;
      default:
        return <Activity className="h-4 w-4 text-ff-text-muted" />;
    }
  };

  const currentTeam = teams.find(t => t.id === selectedTeam);
  const canManageTeam = ['owner', 'admin'].includes(currentUser.role);

  return (
    <div className="space-y-6 ff-stagger-fade">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="ff-text-gradient mb-2">Team Repository Manager</h2>
          <p className="text-ff-text-secondary">
            Manage team members, repository access, and collaboration settings for your FlashFusion teams.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowCreateTeamModal(true)}
            variant="outline"
            className="ff-hover-scale"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>
          {canManageTeam && (
            <Button
              onClick={() => setShowInviteModal(true)}
              className="ff-btn-primary ff-hover-glow"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          )}
        </div>
      </div>

      {/* Team Selection */}
      {teams.length > 1 && (
        <Card className="ff-card-interactive">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Label>Select Team:</Label>
              <Select value={selectedTeam || ''} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-64 ff-focus-ring">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      <div className="flex items-center gap-2">
                        {team.visibility === 'private' ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                        {team.name}
                        <Badge variant="outline" className="text-xs">
                          {team.memberCount} members
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {currentTeam && (
        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Members ({members.length})
            </TabsTrigger>
            <TabsTrigger value="repositories" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Repositories ({repositories.length})
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-6">
            {/* Team Overview */}
            <Card className="ff-card-interactive">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${currentTeam.visibility === 'private' ? 'bg-ff-warning/20' : 'bg-ff-success/20'}`}>
                      {currentTeam.visibility === 'private' ? <Lock className="h-5 w-5 text-ff-warning" /> : <Globe className="h-5 w-5 text-ff-success" />}
                    </div>
                    <div>
                      <CardTitle className="ff-text-gradient">{currentTeam.name}</CardTitle>
                      <p className="text-ff-text-secondary">{currentTeam.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyInviteLink}
                      className="ff-hover-scale"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy Invite Link
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Members List */}
            <div className="grid gap-4">
              {members.map((member) => (
                <Card key={member.id} className="ff-card-interactive">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-ff-text-primary">{member.name}</h3>
                            {getRoleIcon(member.role)}
                            <Badge variant="outline">{member.role}</Badge>
                            {getStatusBadge(member.status)}
                          </div>
                          
                          <p className="text-sm text-ff-text-muted mb-2">{member.email}</p>
                          
                          <div className="flex items-center gap-4 text-xs text-ff-text-muted">
                            <span>Joined: {new Date(member.joinedAt).toLocaleDateString()}</span>
                            <span>Last active: {new Date(member.lastActive).toLocaleDateString()}</span>
                            <span>{member.repositories.length} repositories</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {canManageTeam && member.role !== 'owner' && (
                          <>
                            <Select
                              value={member.role}
                              onValueChange={(value: TeamMember['role']) => updateMemberRole(member.id, value)}
                            >
                              <SelectTrigger className="w-32 ff-focus-ring">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ROLE_HIERARCHY.slice(1).map((role) => (
                                  <SelectItem key={role} value={role}>
                                    {role}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeMember(member.id)}
                              className="ff-hover-scale"
                            >
                              <UserMinus className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="ff-hover-scale"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Permissions Display */}
                    <div className="mt-4 flex items-center gap-4 text-sm">
                      <span className="text-ff-text-muted">Permissions:</span>
                      <div className="flex gap-2">
                        {Object.entries(member.permissions).map(([permission, hasPermission]) => (
                          <Badge
                            key={permission}
                            variant={hasPermission ? 'default' : 'outline'}
                            className="text-xs"
                          >
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="repositories" className="space-y-6">
            <div className="grid gap-4">
              {repositories.length === 0 ? (
                <Card className="ff-card-interactive text-center p-12">
                  <CardContent className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-ff-surface rounded-full flex items-center justify-center">
                      <GitBranch className="h-8 w-8 text-ff-text-muted" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-ff-text-primary mb-2">No repositories connected</h3>
                      <p className="text-ff-text-muted">
                        Connect repositories to enable team collaboration and access control
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                repositories.map((repo) => (
                  <Card key={repo.repositoryId} className="ff-card-interactive">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${repo.isPrivate ? 'bg-ff-warning/20' : 'bg-ff-success/20'}`}>
                            {repo.isPrivate ? <Lock className="h-5 w-5 text-ff-warning" /> : <Github className="h-5 w-5 text-ff-success" />}
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-ff-text-primary">{repo.repositoryName}</h3>
                              <Badge variant="outline">{repo.permissions}</Badge>
                              {repo.isPrivate && <Badge variant="secondary">Private</Badge>}
                            </div>
                            
                            <p className="text-sm text-ff-text-muted mb-2">{repo.url}</p>
                            
                            <div className="flex items-center gap-4 text-xs text-ff-text-muted">
                              <span>{repo.assignedMembers.length} members assigned</span>
                              <span>Last activity: {new Date(repo.lastActivity).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="ff-hover-scale"
                          >
                            <Settings className="h-3 w-3 mr-1" />
                            Manage Access
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            className="ff-hover-scale"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Assigned Members */}
                      <div className="mt-4">
                        <Label className="text-sm font-medium">Assigned Members:</Label>
                        <div className="flex items-center gap-2 mt-2">
                          {repo.assignedMembers.map((memberId) => {
                            const member = members.find(m => m.id === memberId);
                            return member ? (
                              <div key={memberId} className="flex items-center gap-1 text-xs">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={member.avatar} alt={member.name} />
                                  <AvatarFallback className="text-xs">
                                    {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{member.name}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-ff-primary" />
                  Team Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity className="h-12 w-12 mx-auto text-ff-text-muted mb-4" />
                      <p className="text-ff-text-muted">No team activity yet</p>
                    </div>
                  ) : (
                    activities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 border border-ff-border rounded-lg">
                        {getActivityIcon(activity.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-ff-text-primary">
                            <span className="font-medium">{activity.actor}</span>{' '}
                            {activity.message}
                            {activity.target && (
                              <span className="font-medium text-ff-secondary"> {activity.target}</span>
                            )}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-ff-text-muted">
                              {new Date(activity.timestamp).toLocaleString()}
                            </span>
                            {activity.repository && (
                              <Badge variant="outline" className="text-xs">
                                {activity.repository}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="ff-card-interactive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-ff-primary" />
                  Team Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!canManageTeam && (
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      You need admin or owner permissions to modify team settings.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <h4 className="font-semibold text-ff-text-primary">Repository Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Allow Repository Forking</Label>
                        <p className="text-sm text-ff-text-muted">Members can fork team repositories</p>
                      </div>
                      <Switch 
                        disabled={!canManageTeam}
                        defaultChecked={currentTeam.settings.allowFork}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Require Approval for Access</Label>
                        <p className="text-sm text-ff-text-muted">New members need approval for repository access</p>
                      </div>
                      <Switch 
                        disabled={!canManageTeam}
                        defaultChecked={currentTeam.settings.requireApproval}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-ff-text-primary">Notification Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable Team Notifications</Label>
                        <p className="text-sm text-ff-text-muted">Send notifications for team activities</p>
                      </div>
                      <Switch 
                        disabled={!canManageTeam}
                        defaultChecked={currentTeam.settings.enableNotifications}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-ff-text-primary">Default Permissions</h4>
                  <div>
                    <Label>New Member Default Role</Label>
                    <Select 
                      disabled={!canManageTeam}
                      defaultValue={currentTeam.settings.defaultPermissions}
                    >
                      <SelectTrigger className="w-full mt-2 ff-focus-ring">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">Viewer</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="maintainer">Maintainer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {canManageTeam && (
                  <div className="pt-6 border-t border-ff-border">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-ff-error">Danger Zone</h4>
                      <div className="p-4 border border-ff-error/30 rounded-lg bg-ff-error/5">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-ff-error">Delete Team</Label>
                            <p className="text-sm text-ff-text-muted">
                              Permanently delete this team and all associated data
                            </p>
                          </div>
                          <Button variant="destructive" size="sm">
                            Delete Team
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 ff-card-interactive">
            <CardHeader>
              <CardTitle>Invite Team Member</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="invite-email">Email Address</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="member@example.com"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                  className="ff-focus-ring"
                />
              </div>

              <div>
                <Label htmlFor="invite-role">Role</Label>
                <Select value={inviteForm.role} onValueChange={(value: TeamMember['role']) => setInviteForm(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger className="ff-focus-ring">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_HIERARCHY.slice(1).map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="invite-message">Personal Message (Optional)</Label>
                <Textarea
                  id="invite-message"
                  placeholder="Welcome to our team!"
                  value={inviteForm.message}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, message: e.target.value }))}
                  className="ff-focus-ring"
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={inviteTeamMember} className="ff-btn-primary flex-1">
                  Send Invitation
                </Button>
                <Button variant="outline" onClick={() => setShowInviteModal(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateTeamModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 ff-card-interactive">
            <CardHeader>
              <CardTitle>Create New Team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  placeholder="My Awesome Team"
                  value={teamForm.name}
                  onChange={(e) => setTeamForm(prev => ({ ...prev, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                  className="ff-focus-ring"
                />
              </div>

              <div>
                <Label htmlFor="team-slug">Team Slug</Label>
                <Input
                  id="team-slug"
                  placeholder="my-awesome-team"
                  value={teamForm.slug}
                  onChange={(e) => setTeamForm(prev => ({ ...prev, slug: e.target.value }))}
                  className="ff-focus-ring"
                />
              </div>

              <div>
                <Label htmlFor="team-description">Description</Label>
                <Textarea
                  id="team-description"
                  placeholder="Brief description of your team"
                  value={teamForm.description}
                  onChange={(e) => setTeamForm(prev => ({ ...prev, description: e.target.value }))}
                  className="ff-focus-ring"
                />
              </div>

              <div>
                <Label htmlFor="team-visibility">Visibility</Label>
                <Select value={teamForm.visibility} onValueChange={(value: Team['visibility']) => setTeamForm(prev => ({ ...prev, visibility: value }))}>
                  <SelectTrigger className="ff-focus-ring">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private - Only invited members</SelectItem>
                    <SelectItem value="internal">Internal - Anyone in organization</SelectItem>
                    <SelectItem value="public">Public - Anyone can join</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button onClick={createTeam} className="ff-btn-primary flex-1">
                  Create Team
                </Button>
                <Button variant="outline" onClick={() => setShowCreateTeamModal(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default TeamRepositoryManager;