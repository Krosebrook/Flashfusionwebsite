# FlashFusion Studio - Interface Contracts

## Overview

This document defines all interface contracts for FlashFusion Studio. These contracts serve as the single source of truth for routes, components, CTAs, and analytics events.

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Status:** Production Ready

---

## Contract A: Routes

All routes follow the pattern `/app/studio/*` to namespace Studio features within FlashFusion.

### Public Routes (Unauthenticated)

| Route | Component | Description | Meta Tags |
|-------|-----------|-------------|-----------|
| `/studio` | `StudioLandingPage` | Marketing page for Studio features | title: "FlashFusion Studio - AI Music Production" |
| `/studio/pricing` | `StudioPricingPage` | Pricing tiers for Studio | title: "Studio Pricing - FlashFusion" |
| `/studio/demo` | `StudioDemoPage` | Interactive demo (limited functionality) | title: "Try Studio - FlashFusion" |
| `/legal/studio-terms` | `StudioTermsPage` | Studio-specific terms (music rights) | title: "Studio Terms of Service" |
| `/legal/music-license` | `MusicLicensePage` | Music licensing information | title: "Music Licensing - FlashFusion Studio" |

---

### Protected Routes (Authentication Required)

| Route | Component | Description | Auth Level | Subscription |
|-------|-----------|-------------|------------|--------------|
| `/app/studio` | `StudioDashboard` | Main Studio dashboard | User | Free+ |
| `/app/studio/new` | `NewProjectWizard` | Create new music project | User | Free+ |
| `/app/studio/projects` | `ProjectsLibrary` | User's saved projects | User | Free+ |
| `/app/studio/project/:id` | `ProjectEditor` | Edit specific project | User + Owner | Free+ |
| **Prompt-to-Song** |
| `/app/studio/prompt-to-song` | `PromptToSongGenerator` | AI song generation interface | User | Free+ |
| `/app/studio/prompt-to-song/:id` | `PromptSongEditor` | Edit generated song | User + Owner | Free+ |
| **Chord Designer** |
| `/app/studio/chords` | `ChordProgressionDesigner` | Chord progression tool | User | Free+ |
| `/app/studio/chords/:id` | `ChordProgressionEditor` | Edit saved progression | User + Owner | Free+ |
| **Mixing Suite** |
| `/app/studio/mixer` | `MixingConsole` | Multi-track mixer | User | Pro+ |
| `/app/studio/mixer/:id` | `MixerSession` | Specific mixing session | User + Owner | Pro+ |
| **Lyrics Tool** |
| `/app/studio/lyrics` | `LyricGenerator` | AI lyric writing tool | User | Free+ |
| `/app/studio/lyrics/:id` | `LyricEditor` | Edit lyrics for project | User + Owner | Free+ |
| **Publishing** |
| `/app/studio/publish` | `PublishingHub` | Publish music to platforms | User | Pro+ |
| `/app/studio/publish/:id` | `PublishingWizard` | Publish specific track | User + Owner | Pro+ |
| **Marketplace** |
| `/app/studio/market` | `StudioMarketplace` | Buy/sell music assets | User | Free+ |
| `/app/studio/market/:id` | `MarketItemDetail` | View marketplace item | User | Free+ |
| **User Profile** |
| `/app/studio/profile` | `StudioProfile` | User profile and portfolio | User | Free+ |
| `/app/studio/profile/:username` | `PublicProfile` | Public creator profile | Public | N/A |
| **Collaboration** |
| `/app/studio/collaborate/:projectId` | `CollaborationWorkspace` | Real-time collaboration | User + Collaborator | Pro+ |
| **Admin** |
| `/admin/studio` | `StudioAdminDashboard` | Admin panel for Studio | Admin | N/A |
| `/admin/studio/users` | `StudioUserManagement` | Manage Studio users | Admin | N/A |
| `/admin/studio/content` | `StudioContentModeration` | Moderate user content | Admin | N/A |

---

### Route Parameters

**Project ID:** UUID v4 format  
**Username:** Alphanumeric + hyphens, 3-30 characters  
**Marketplace Item ID:** UUID v4 format

### Query Parameters

**Shared Query Params:**
```typescript
interface SharedQueryParams {
  ref?: string;           // Referral source for analytics
  utm_source?: string;    // Marketing campaign tracking
  utm_medium?: string;
  utm_campaign?: string;
  demo?: 'true' | 'false'; // Demo mode flag
}
```

**Project Editor Params:**
```typescript
interface ProjectEditorParams {
  tab?: 'arrange' | 'mix' | 'master' | 'publish';
  track?: number;         // Selected track number
  autoplay?: 'true' | 'false';
}
```

---

## Contract B: Components & Props

### Core Components

#### 1. StudioDashboard
```typescript
interface StudioDashboardProps {
  userId: string;
  projects: Project[];
  recentActivity: Activity[];
  subscription: SubscriptionTier;
  onCreateProject: () => void;
  onOpenProject: (projectId: string) => void;
}

interface Project {
  id: string;
  title: string;
  genre: string;
  tempo: number;
  key: string;
  lastModified: Date;
  thumbnail?: string;
  status: 'draft' | 'in-progress' | 'completed' | 'published';
  collaborators: Collaborator[];
}

interface Activity {
  id: string;
  type: 'project_created' | 'song_generated' | 'project_published' | 'collaboration_invited';
  timestamp: Date;
  projectId?: string;
  metadata: Record<string, any>;
}
```

---

#### 2. PromptToSongGenerator
```typescript
interface PromptToSongGeneratorProps {
  userId: string;
  onSongGenerated: (song: GeneratedSong) => void;
  onError: (error: Error) => void;
  remainingCredits?: number;
  subscription: SubscriptionTier;
}

interface GeneratedSong {
  id: string;
  prompt: string;
  audioUrl: string;
  waveformData: number[];
  genre: string;
  tempo: number;
  key: string;
  mood: string;
  duration: number;
  stems?: StemExport[];
  metadata: SongMetadata;
}

interface PromptToSongInput {
  prompt: string;
  genre?: string;
  tempo?: number;
  key?: string;
  mood?: string;
  duration?: number;
  style?: string;
  instruments?: string[];
  advancedOptions?: {
    structure?: string;  // e.g., "verse-chorus-verse-bridge-chorus"
    complexity?: 'simple' | 'moderate' | 'complex';
    energy?: number;     // 1-10 scale
  };
}
```

---

#### 3. ChordProgressionDesigner
```typescript
interface ChordProgressionDesignerProps {
  userId: string;
  initialKey?: string;
  initialProgression?: Chord[];
  onSave: (progression: ChordProgression) => void;
  onExport: (format: 'midi' | 'musicxml' | 'json') => void;
}

interface ChordProgression {
  id: string;
  title: string;
  key: string;
  tempo: number;
  timeSignature: string;
  chords: Chord[];
  analysis: ProgressionAnalysis;
}

interface Chord {
  id: string;
  root: string;           // e.g., "C", "F#", "Bb"
  quality: string;        // e.g., "major", "minor", "dominant7", "sus4"
  bass?: string;          // For slash chords
  duration: number;       // In beats
  position: number;       // Bar position
  voicing?: number[];     // MIDI note numbers
}

interface ProgressionAnalysis {
  romanNumerals: string[];
  functions: string[];     // e.g., "tonic", "subdominant", "dominant"
  complexity: number;      // 1-10 scale
  suggestions: ChordSuggestion[];
}

interface ChordSuggestion {
  chord: Chord;
  reason: string;
  confidence: number;      // 0-1
  category: 'modal_interchange' | 'secondary_dominant' | 'substitution' | 'common_progression';
}
```

---

#### 4. MixingConsole
```typescript
interface MixingConsoleProps {
  projectId: string;
  tracks: AudioTrack[];
  masterBus: MasterBus;
  onTrackUpdate: (trackId: string, updates: Partial<AudioTrack>) => void;
  onMasterUpdate: (updates: Partial<MasterBus>) => void;
  onExport: (format: ExportFormat) => void;
}

interface AudioTrack {
  id: string;
  name: string;
  audioUrl: string;
  waveformData: number[];
  
  // Levels
  volume: number;          // 0-1 (0dB to -inf)
  pan: number;             // -1 to 1 (left to right)
  mute: boolean;
  solo: boolean;
  
  // Effects
  eq: EQSettings;
  compression: CompressionSettings;
  reverb: ReverbSettings;
  delay: DelaySettings;
  
  // Routing
  sendToMaster: boolean;
  auxSends: AuxSend[];
  
  // Automation
  automation: AutomationCurve[];
}

interface EQSettings {
  enabled: boolean;
  bands: EQBand[];
}

interface EQBand {
  frequency: number;       // Hz
  gain: number;            // dB
  q: number;               // Quality factor
  type: 'lowshelf' | 'highshelf' | 'peaking' | 'lowpass' | 'highpass' | 'notch';
}

interface CompressionSettings {
  enabled: boolean;
  threshold: number;       // dB
  ratio: number;           // e.g., 4:1 = 4
  attack: number;          // ms
  release: number;         // ms
  knee: number;            // dB
  makeupGain: number;      // dB
}

interface MasterBus {
  volume: number;
  limitCeiling: number;    // dB, for mastering limiter
  dither: boolean;
  sampleRate: number;      // Hz
  bitDepth: number;        // 16, 24, 32
}

interface ExportFormat {
  format: 'wav' | 'mp3' | 'flac' | 'ogg';
  sampleRate: number;
  bitDepth?: number;       // For WAV/FLAC
  bitrate?: number;        // For MP3/OGG (kbps)
  stems: boolean;          // Export individual tracks
}
```

---

#### 5. LyricGenerator
```typescript
interface LyricGeneratorProps {
  projectId?: string;
  initialLyrics?: string;
  theme?: string;
  mood?: string;
  onGenerate: (lyrics: GeneratedLyrics) => void;
  onSave: (lyrics: SavedLyrics) => void;
}

interface GeneratedLyrics {
  id: string;
  content: string;
  sections: LyricSection[];
  analysis: LyricAnalysis;
  suggestions: LyricSuggestion[];
}

interface LyricSection {
  type: 'verse' | 'chorus' | 'bridge' | 'pre-chorus' | 'outro' | 'intro';
  content: string;
  lineCount: number;
  rhymeScheme: string;     // e.g., "ABAB", "AABB"
}

interface LyricAnalysis {
  sentiment: number;       // -1 to 1
  readability: number;     // Grade level
  rhymeDensity: number;    // 0-1
  syllableCount: number;
  uniqueWords: number;
  thematicKeywords: string[];
}

interface LyricSuggestion {
  line: string;
  position: number;        // Line number to insert
  reason: string;
  rhymesWith?: string;
  confidence: number;
}
```

---

#### 6. PublishingWizard
```typescript
interface PublishingWizardProps {
  projectId: string;
  audioUrl: string;
  onPublish: (publishConfig: PublishConfig) => Promise<void>;
  connectedPlatforms: Platform[];
}

interface PublishConfig {
  // Metadata
  title: string;
  artist: string;
  album?: string;
  genre: string;
  releaseDate: Date;
  
  // Rights & Licensing
  copyrightHolder: string;
  licenseType: 'all-rights-reserved' | 'creative-commons' | 'royalty-free';
  isrc?: string;           // International Standard Recording Code
  upc?: string;            // Universal Product Code
  
  // Distribution
  platforms: PlatformConfig[];
  territories: string[];   // ISO country codes
  pricing?: PricingConfig;
  
  // Additional
  coverArt: string;        // URL or base64
  lyrics?: string;
  credits: Credit[];
}

interface PlatformConfig {
  platformId: string;      // 'spotify', 'apple-music', 'soundcloud', etc.
  enabled: boolean;
  customMetadata?: Record<string, any>;
}

interface Credit {
  role: string;            // 'producer', 'songwriter', 'mixer', 'mastering', 'vocals'
  name: string;
  collaboratorId?: string; // If FlashFusion user
}

interface Platform {
  id: string;
  name: string;
  logo: string;
  connected: boolean;
  requirements: PlatformRequirement[];
}

interface PlatformRequirement {
  field: string;
  required: boolean;
  description: string;
}
```

---

#### 7. StudioMarketplace
```typescript
interface StudioMarketplaceProps {
  userId: string;
  onPurchase: (itemId: string) => Promise<void>;
  onSell: (listing: NewListing) => Promise<void>;
  userBalance: number;
}

interface MarketplaceItem {
  id: string;
  type: 'preset' | 'sample-pack' | 'midi-pack' | 'stem' | 'full-song';
  title: string;
  description: string;
  price: number;           // USD
  seller: {
    id: string;
    username: string;
    avatar: string;
    rating: number;        // 0-5
  };
  preview?: string;        // Audio preview URL
  downloads: number;
  rating: number;
  tags: string[];
  createdAt: Date;
}

interface NewListing {
  type: MarketplaceItem['type'];
  title: string;
  description: string;
  price: number;
  files: File[];
  preview?: File;
  tags: string[];
  licenseType: string;
}
```

---

## Contract C: CTAs (Call-to-Actions)

All CTAs follow the pattern: `{id}:{action}:{destination}`

### Primary CTAs

| CTA ID | Label | Action | Route/API | Location |
|--------|-------|--------|-----------|----------|
| `studio-hero-cta` | "Start Creating Music" | Navigate | `/app/studio/new` | Landing page hero |
| `studio-pricing-free` | "Get Started Free" | Navigate | `/app/studio?plan=free` | Pricing page |
| `studio-pricing-pro` | "Upgrade to Pro" | API → Navigate | `/api/stripe/checkout?plan=pro` | Pricing page |
| `studio-pricing-studio` | "Go Studio" | API → Navigate | `/api/stripe/checkout?plan=studio` | Pricing page |
| `new-project` | "New Project" | Navigate | `/app/studio/new` | Dashboard |
| `open-project` | "Open" | Navigate | `/app/studio/project/:id` | Project card |
| `delete-project` | "Delete" | API Confirm | `/api/studio/projects/:id` DELETE | Project menu |
| **Prompt-to-Song** |
| `generate-song` | "Generate Song" | API | `/api/studio/generate-song` POST | Prompt input |
| `regenerate-song` | "Regenerate" | API | `/api/studio/generate-song` POST | Generated song view |
| `save-song` | "Save to Projects" | API | `/api/studio/projects` POST | Generated song view |
| `export-song` | "Export" | Download | N/A | Generated song view |
| **Chord Designer** |
| `add-chord` | "+ Add Chord" | State Update | N/A | Chord designer toolbar |
| `suggest-chord` | "Get Suggestion" | API | `/api/studio/suggest-chord` POST | Chord designer |
| `play-progression` | "Play" | Audio Engine | N/A | Chord designer |
| `export-midi` | "Export MIDI" | Download | N/A | Chord designer |
| **Mixer** |
| `add-track` | "+ Add Track" | File Upload | `/api/studio/upload-audio` POST | Mixer toolbar |
| `ai-mix` | "AI Auto-Mix" | API | `/api/studio/auto-mix/:projectId` POST | Mixer toolbar |
| `export-mix` | "Export Mix" | API → Download | `/api/studio/export-mix/:projectId` POST | Mixer toolbar |
| `bounce-stems` | "Export Stems" | API → Download | `/api/studio/export-stems/:projectId` POST | Mixer menu |
| **Lyrics** |
| `generate-lyrics` | "Generate Lyrics" | API | `/api/studio/generate-lyrics` POST | Lyrics tool |
| `suggest-rhyme` | "Suggest Rhyme" | API | `/api/studio/suggest-rhyme` POST | Lyrics editor |
| `analyze-lyrics` | "Analyze" | API | `/api/studio/analyze-lyrics` POST | Lyrics editor |
| **Publishing** |
| `connect-platform` | "Connect {Platform}" | OAuth | `/api/integrations/{platform}/auth` | Publishing wizard |
| `publish-track` | "Publish" | API | `/api/studio/publish` POST | Publishing wizard |
| `view-analytics` | "View Analytics" | Navigate | `/app/studio/analytics/:trackId` | Published tracks |
| **Marketplace** |
| `list-item` | "List for Sale" | Navigate | `/app/studio/market/new` | Dashboard |
| `purchase-item` | "Purchase" | API Confirm | `/api/studio/marketplace/purchase/:id` POST | Item detail |
| `download-purchase` | "Download" | API → Download | `/api/studio/marketplace/download/:purchaseId` GET | Library |
| **Collaboration** |
| `invite-collaborator` | "Invite" | API | `/api/studio/collaborate/invite` POST | Project settings |
| `accept-invite` | "Accept Invitation" | API → Navigate | `/api/studio/collaborate/accept/:inviteId` POST | Notification |
| `join-session` | "Join Live Session" | Navigate | `/app/studio/collaborate/:projectId` | Project view |
| **Account** |
| `manage-subscription` | "Manage Subscription" | Navigate | `/app/studio/subscription` | Profile |
| `view-usage` | "View Usage" | Navigate | `/app/studio/usage` | Profile |

---

### Secondary CTAs

| CTA ID | Label | Action | Route/API | Context |
|--------|-------|--------|-----------|---------|
| `save-progress` | "Save" | API | `/api/studio/projects/:id` PATCH | Auto-save |
| `undo` | "Undo" | State | N/A | Editor history |
| `redo` | "Redo" | State | N/A | Editor history |
| `duplicate-project` | "Duplicate" | API | `/api/studio/projects/:id/duplicate` POST | Project menu |
| `share-project` | "Share" | Copy Link | N/A | Project menu |
| `rename-project` | "Rename" | State → API | `/api/studio/projects/:id` PATCH | Project menu |
| `view-tutorial` | "Watch Tutorial" | Modal | N/A | Contextual help |
| `contact-support` | "Get Help" | Navigate | `/support?context=studio` | Error states |

---

## Contract F: Analytics Events

All events follow the schema: `studio_{category}_{action}`

### Event Schema

```typescript
interface AnalyticsEvent {
  eventName: string;
  timestamp: Date;
  userId: string;
  sessionId: string;
  properties: Record<string, any>;
  context: EventContext;
}

interface EventContext {
  page: string;
  referrer?: string;
  userAgent: string;
  subscriptionTier: string;
  experimentVariants?: Record<string, string>;
}
```

---

### User Journey Events

**Onboarding:**
```typescript
// studio_onboarding_started
{
  eventName: 'studio_onboarding_started',
  properties: {
    source: 'landing_page' | 'app_menu' | 'external_link',
  }
}

// studio_onboarding_completed
{
  eventName: 'studio_onboarding_completed',
  properties: {
    timeToComplete: number,    // seconds
    stepsCompleted: number,
    skippedSteps: string[],
  }
}

// studio_onboarding_abandoned
{
  eventName: 'studio_onboarding_abandoned',
  properties: {
    lastStep: string,
    timeSpent: number,         // seconds
  }
}
```

---

**Project Management:**
```typescript
// studio_project_created
{
  eventName: 'studio_project_created',
  properties: {
    projectType: 'blank' | 'from_prompt' | 'from_template',
    genre?: string,
    templateId?: string,
  }
}

// studio_project_opened
{
  eventName: 'studio_project_opened',
  properties: {
    projectId: string,
    projectAge: number,        // days since creation
    lastOpenedDaysAgo: number,
  }
}

// studio_project_saved
{
  eventName: 'studio_project_saved',
  properties: {
    projectId: string,
    autoSave: boolean,
    fileSize: number,          // bytes
    sessionDuration: number,   // seconds
  }
}

// studio_project_deleted
{
  eventName: 'studio_project_deleted',
  properties: {
    projectId: string,
    projectAge: number,
    wasCompleted: boolean,
    wasPublished: boolean,
  }
}
```

---

**Music Generation:**
```typescript
// studio_song_generation_started
{
  eventName: 'studio_song_generation_started',
  properties: {
    promptLength: number,
    genre?: string,
    advancedOptionsUsed: boolean,
  }
}

// studio_song_generation_completed
{
  eventName: 'studio_song_generation_completed',
  properties: {
    generationTime: number,    // seconds
    genre: string,
    duration: number,          // seconds of generated audio
    quality: 'low' | 'medium' | 'high',
  }
}

// studio_song_generation_failed
{
  eventName: 'studio_song_generation_failed',
  properties: {
    errorCode: string,
    errorMessage: string,
    promptLength: number,
  }
}

// studio_song_regenerated
{
  eventName: 'studio_song_regenerated',
  properties: {
    originalSongId: string,
    reason: 'quality' | 'style' | 'other',
    attemptNumber: number,
  }
}
```

---

**Chord Progression:**
```typescript
// studio_chord_added
{
  eventName: 'studio_chord_added',
  properties: {
    chord: string,             // e.g., "Cmaj7"
    addedBy: 'manual' | 'ai_suggestion',
    positionInProgression: number,
  }
}

// studio_chord_suggestion_requested
{
  eventName: 'studio_chord_suggestion_requested',
  properties: {
    currentKey: string,
    progressionLength: number,
  }
}

// studio_chord_suggestion_accepted
{
  eventName: 'studio_chord_suggestion_accepted',
  properties: {
    suggestedChord: string,
    suggestionReason: string,
    confidence: number,
  }
}

// studio_chord_progression_exported
{
  eventName: 'studio_chord_progression_exported',
  properties: {
    format: 'midi' | 'musicxml' | 'json',
    chordCount: number,
    key: string,
  }
}
```

---

**Mixing:**
```typescript
// studio_mixer_track_added
{
  eventName: 'studio_mixer_track_added',
  properties: {
    trackType: 'audio' | 'midi' | 'generated',
    trackCount: number,        // total tracks after addition
  }
}

// studio_mixer_effect_applied
{
  eventName: 'studio_mixer_effect_applied',
  properties: {
    effectType: 'eq' | 'compression' | 'reverb' | 'delay' | 'other',
    trackId: string,
    preset?: string,
  }
}

// studio_mixer_auto_mix_used
{
  eventName: 'studio_mixer_auto_mix_used',
  properties: {
    trackCount: number,
    genre?: string,
  }
}

// studio_mixer_exported
{
  eventName: 'studio_mixer_exported',
  properties: {
    format: 'wav' | 'mp3' | 'flac',
    stemsExported: boolean,
    duration: number,          // seconds
    fileSize: number,          // bytes
  }
}
```

---

**Lyrics:**
```typescript
// studio_lyrics_generated
{
  eventName: 'studio_lyrics_generated',
  properties: {
    theme?: string,
    mood?: string,
    lineCount: number,
    generationTime: number,    // seconds
  }
}

// studio_lyrics_rhyme_suggested
{
  eventName: 'studio_lyrics_rhyme_suggested',
  properties: {
    wordToRhyme: string,
    suggestionsCount: number,
  }
}

// studio_lyrics_analyzed
{
  eventName: 'studio_lyrics_analyzed',
  properties: {
    sentiment: number,
    readabilityGrade: number,
    wordCount: number,
  }
}
```

---

**Publishing:**
```typescript
// studio_platform_connected
{
  eventName: 'studio_platform_connected',
  properties: {
    platform: 'spotify' | 'apple-music' | 'soundcloud' | 'bandcamp',
    authMethod: 'oauth' | 'api_key',
  }
}

// studio_track_published
{
  eventName: 'studio_track_published',
  properties: {
    trackId: string,
    platforms: string[],
    genre: string,
    duration: number,
    releaseDate: Date,
    isPublic: boolean,
  }
}

// studio_track_publish_failed
{
  eventName: 'studio_track_publish_failed',
  properties: {
    trackId: string,
    platform: string,
    errorCode: string,
    errorMessage: string,
  }
}
```

---

**Marketplace:**
```typescript
// studio_marketplace_item_viewed
{
  eventName: 'studio_marketplace_item_viewed',
  properties: {
    itemId: string,
    itemType: 'preset' | 'sample-pack' | 'midi-pack' | 'stem' | 'full-song',
    price: number,
    sellerId: string,
  }
}

// studio_marketplace_item_purchased
{
  eventName: 'studio_marketplace_item_purchased',
  properties: {
    itemId: string,
    itemType: string,
    price: number,
    sellerId: string,
    paymentMethod: string,
  }
}

// studio_marketplace_item_listed
{
  eventName: 'studio_marketplace_item_listed',
  properties: {
    itemId: string,
    itemType: string,
    price: number,
    tags: string[],
  }
}
```

---

**Collaboration:**
```typescript
// studio_collaborator_invited
{
  eventName: 'studio_collaborator_invited',
  properties: {
    projectId: string,
    inviteMethod: 'email' | 'link' | 'username',
  }
}

// studio_collaboration_session_joined
{
  eventName: 'studio_collaboration_session_joined',
  properties: {
    projectId: string,
    role: 'owner' | 'collaborator' | 'viewer',
    participantCount: number,
  }
}

// studio_collaboration_edit_made
{
  eventName: 'studio_collaboration_edit_made',
  properties: {
    projectId: string,
    editType: 'track_added' | 'effect_changed' | 'chord_added' | 'lyrics_edited',
    isRealtime: boolean,
  }
}
```

---

**Subscription:**
```typescript
// studio_subscription_upgraded
{
  eventName: 'studio_subscription_upgraded',
  properties: {
    fromTier: string,
    toTier: string,
    price: number,
    billingPeriod: 'monthly' | 'annual',
  }
}

// studio_subscription_downgraded
{
  eventName: 'studio_subscription_downgraded',
  properties: {
    fromTier: string,
    toTier: string,
    reason?: string,
  }
}

// studio_subscription_canceled
{
  eventName: 'studio_subscription_canceled',
  properties: {
    tier: string,
    daysSinceSubscribed: number,
    reason?: string,
  }
}

// studio_credit_limit_reached
{
  eventName: 'studio_credit_limit_reached',
  properties: {
    tier: string,
    creditType: 'song_generation' | 'ai_mixing' | 'exports',
    upgradePromptShown: boolean,
  }
}
```

---

**Errors & Performance:**
```typescript
// studio_error_occurred
{
  eventName: 'studio_error_occurred',
  properties: {
    errorType: string,
    errorMessage: string,
    component: string,
    stackTrace?: string,
    userAction: string,        // What user was doing when error occurred
  }
}

// studio_performance_issue
{
  eventName: 'studio_performance_issue',
  properties: {
    metric: 'generation_time' | 'export_time' | 'load_time' | 'playback_latency',
    value: number,
    threshold: number,
    device: string,
  }
}
```

---

## API Response Formats

### Success Response
```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    timestamp: string;
    requestId: string;
    credits?: {
      used: number;
      remaining: number;
    };
  };
}
```

### Error Response
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    retryable: boolean;
  };
  meta: {
    timestamp: string;
    requestId: string;
  };
}
```

---

## Contract Versioning

**Current Version:** 1.0.0  
**Breaking Changes:** Increment major version  
**New Features:** Increment minor version  
**Bug Fixes:** Increment patch version

---

## Change Log

**v1.0.0** (January 2025)
- Initial contract definitions
- All routes, components, CTAs, and analytics events defined
- Ready for implementation

---

**Document Owner:** FlashFusion Studio Product Team  
**Reviewers:** Engineering, Design, Analytics  
**Next Review:** Monthly or upon significant feature additions
