/**
 * Collaboration Type Definitions
 * Types for real-time collaboration, workspaces, and social features
 */

export type PresenceStatus = 'online' | 'away' | 'busy' | 'offline';
export type CollaborationRole = 'owner' | 'admin' | 'editor' | 'viewer';

// Real-Time Collaboration
export interface CollaborationSession {
  id: string;
  roomId: string;
  userId: string;
  role: CollaborationRole;
  presence: UserPresence;
  cursor?: CursorPosition;
  selection?: Selection;
  connectedAt: Date;
  lastActiveAt: Date;
}

export interface UserPresence {
  userId: string;
  status: PresenceStatus;
  name: string;
  avatar?: string;
  color: string;
  metadata?: Record<string, any>;
}

export interface CursorPosition {
  x: number;
  y: number;
  line?: number;
  column?: number;
  timestamp: Date;
}

export interface Selection {
  start: Position;
  end: Position;
  content?: string;
}

export interface Position {
  line: number;
  column: number;
}

export interface Operation {
  id: string;
  type: 'insert' | 'delete' | 'update' | 'move';
  path: string[];
  position?: number;
  value?: any;
  oldValue?: any;
  userId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface Conflict {
  id: string;
  operations: Operation[];
  resolution?: ConflictResolution;
  resolvedAt?: Date;
}

export interface ConflictResolution {
  strategy: 'manual' | 'automatic' | 'last-write-wins' | 'merge';
  winner?: string; // userId
  merged?: Operation;
}

// Workspaces & Organization
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  organizationId?: string;
  owner: string;
  members: WorkspaceMember[];
  projects: string[];
  settings: WorkspaceSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceMember {
  userId: string;
  role: CollaborationRole;
  permissions: string[];
  joinedAt: Date;
  invitedBy?: string;
}

export interface WorkspaceSettings {
  visibility: 'private' | 'internal' | 'public';
  allowInvites: boolean;
  requireApproval: boolean;
  defaultRole: CollaborationRole;
  features: string[];
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  owner: string;
  workspaces: string[];
  members: OrganizationMember[];
  billing: BillingInfo;
  settings: OrganizationSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationMember {
  userId: string;
  role: 'owner' | 'admin' | 'member';
  departments?: string[];
  title?: string;
  joinedAt: Date;
}

export interface BillingInfo {
  plan: string;
  status: 'active' | 'past_due' | 'cancelled';
  seats: number;
  usedSeats: number;
  billingCycle: 'monthly' | 'annual';
  nextBillingDate: Date;
}

export interface OrganizationSettings {
  ssoEnabled: boolean;
  ssoProvider?: string;
  domainVerification: boolean;
  verifiedDomains: string[];
  securityPolicies: SecurityPolicies;
}

export interface SecurityPolicies {
  mfaRequired: boolean;
  passwordPolicy: PasswordRequirements;
  sessionTimeout: number;
  ipWhitelist: string[];
}

export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
}

// Social Features
export interface UserProfile {
  userId: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  cover?: string;
  location?: string;
  website?: string;
  socialLinks?: SocialLinks;
  stats: ProfileStats;
  badges: Badge[];
  achievements: Achievement[];
}

export interface SocialLinks {
  github?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
}

export interface ProfileStats {
  followers: number;
  following: number;
  projects: number;
  contributions: number;
  reputation: number;
  level: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  completedAt?: Date;
  rewards?: Reward[];
}

export interface Reward {
  type: 'badge' | 'points' | 'feature';
  value: any;
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  attachments?: Attachment[];
  visibility: 'public' | 'followers' | 'private';
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Attachment {
  type: 'image' | 'video' | 'file' | 'link';
  url: string;
  metadata?: Record<string, any>;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  parentId?: string; // for threaded comments
  likes: number;
  replies: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Follow {
  followerId: string;
  followingId: string;
  createdAt: Date;
}

// Async Collaboration
export interface Thread {
  id: string;
  title: string;
  resourceType: string;
  resourceId: string;
  participants: string[];
  messages: Message[];
  status: 'open' | 'resolved' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  threadId: string;
  authorId: string;
  content: string;
  attachments?: Attachment[];
  mentions?: string[];
  reactions?: Reaction[];
  createdAt: Date;
  updatedAt: Date;
  editedAt?: Date;
}

export interface Reaction {
  emoji: string;
  userId: string;
  createdAt: Date;
}

export interface Annotation {
  id: string;
  resourceType: string;
  resourceId: string;
  position: AnnotationPosition;
  content: string;
  authorId: string;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnnotationPosition {
  type: 'line' | 'range' | 'point';
  start: Position;
  end?: Position;
  context?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  reporter: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: Date;
  tags: string[];
  attachments?: Attachment[];
  subtasks?: Task[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface Review {
  id: string;
  resourceType: string;
  resourceId: string;
  reviewer: string;
  status: 'pending' | 'approved' | 'changes_requested' | 'rejected';
  comments: ReviewComment[];
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface ReviewComment {
  id: string;
  position?: Position;
  content: string;
  suggestion?: string;
  resolved: boolean;
  createdAt: Date;
}
