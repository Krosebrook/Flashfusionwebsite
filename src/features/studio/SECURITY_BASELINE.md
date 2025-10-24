# FlashFusion Studio - Security Baseline

## Overview

This document defines the security baseline for FlashFusion Studio, establishing policies, controls, and best practices to protect user data, prevent abuse, and maintain system integrity.

**Classification:** Internal  
**Last Updated:** January 2025  
**Review Cadence:** Quarterly  
**Owner:** FlashFusion Security Team

---

## 1. Secrets Management

### 1.1 API Keys & Credentials

**Storage Policy:**
- ✅ Store ALL secrets in environment variables (never in code)
- ✅ Use Supabase Vault for production secrets
- ✅ Separate keys per environment (dev/staging/prod)
- ✅ Never commit `.env` files to version control

**Required Secrets:**
```bash
# AI/ML Services
MUSIC_GENERATION_API_KEY=<key>
LYRIC_GENERATION_API_KEY=<key>

# Distribution Platforms
SPOTIFY_CLIENT_ID=<key>
SPOTIFY_CLIENT_SECRET=<key>
APPLE_MUSIC_API_KEY=<key>
SOUNDCLOUD_CLIENT_ID=<key>

# Payment Processing
STRIPE_SECRET_KEY=<key>
STRIPE_WEBHOOK_SECRET=<key>

# Infrastructure
SUPABASE_SERVICE_ROLE_KEY=<key>  # NEVER expose to frontend
SUPABASE_ANON_KEY=<key>          # Safe for frontend
AWS_S3_ACCESS_KEY=<key>
AWS_S3_SECRET_KEY=<key>

# Monitoring & Analytics
SENTRY_DSN=<key>
SEGMENT_WRITE_KEY=<key>
```

---

### 1.2 Key Rotation Cadence

| Secret Type | Rotation Frequency | Method | Notification |
|-------------|-------------------|--------|--------------|
| **Production API Keys** | Every 90 days | Automated via Terraform | Security team + on-call |
| **Database Credentials** | Every 180 days | Manual with downtime window | All engineers |
| **Service Role Keys** | Every 90 days | Automated rollover | Security team |
| **OAuth Tokens** | Refresh on expiry | Automatic refresh flow | N/A |
| **Webhook Secrets** | Every 180 days | Manual update | Integration team |

**Emergency Rotation:**
- Trigger: Suspected compromise or public exposure
- Response Time: < 1 hour
- Process: Automated emergency rotation script → Update all services → Verify

---

### 1.3 Access Control

**Principle of Least Privilege:**
```typescript
// Backend: Service-level key access
const canAccessMusicGenerationAPI = (userRole: string) => {
  return ['admin', 'music-service'].includes(userRole);
};

// Frontend: NO direct API key exposure
// All AI calls go through backend proxy
const generateSong = async (prompt: string) => {
  // Frontend calls backend endpoint (no API key in client)
  const response = await fetch('/api/studio/generate-song', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userToken}`, // User token, NOT API key
    },
    body: JSON.stringify({ prompt }),
  });
  return response.json();
};
```

---

## 2. Content Security Policy (CSP)

### 2.1 CSP Headers

**Strict CSP for Studio:**
```nginx
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.vercel-insights.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https: blob:;
  media-src 'self' blob: https://flashfusion-studio.supabase.co;
  connect-src 'self' https://*.flashfusion.co https://*.supabase.co wss://*.supabase.co;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
```

**Rationale:**
- `script-src`: Allow analytics, block inline scripts (except React)
- `media-src`: Allow audio playback from CDN and blob URLs
- `connect-src`: Restrict API calls to trusted domains
- `frame-ancestors 'none'`: Prevent clickjacking

---

### 2.2 CORS Configuration

**Backend API CORS:**
```typescript
// /supabase/functions/server/cors.ts
const ALLOWED_ORIGINS = [
  'https://app.flashfusion.co',
  'https://staging-studio.flashfusion.co',
  process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : null,
].filter(Boolean);

export const corsHeaders = {
  'Access-Control-Allow-Origin': origin in ALLOWED_ORIGINS ? origin : ALLOWED_ORIGINS[0],
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-ID',
  'Access-Control-Max-Age': '86400', // 24 hours
};

// OPTIONS preflight handler
if (request.method === 'OPTIONS') {
  return new Response(null, { status: 204, headers: corsHeaders });
}
```

---

### 2.3 CSRF Protection

**Token-Based CSRF:**
```typescript
// Generate CSRF token on session creation
const generateCSRFToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Validate on state-changing requests (POST, PUT, DELETE)
const validateCSRFToken = (request: Request) => {
  const token = request.headers.get('X-CSRF-Token');
  const sessionToken = request.cookies.get('csrf_token');
  
  if (!token || token !== sessionToken) {
    throw new Error('CSRF token validation failed');
  }
};

// Apply to all Studio API routes
app.use('/api/studio/*', (req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    try {
      validateCSRFToken(req);
      next();
    } catch (error) {
      res.status(403).json({ error: 'CSRF validation failed' });
    }
  } else {
    next();
  }
});
```

---

## 3. File Upload Security

### 3.1 Allowed File Types

**Audio Files (Upload to Projects):**
```typescript
const ALLOWED_AUDIO_MIMES = [
  'audio/mpeg',      // MP3
  'audio/wav',       // WAV
  'audio/flac',      // FLAC
  'audio/ogg',       // OGG
  'audio/aac',       // AAC
  'audio/x-m4a',     // M4A
];

const ALLOWED_AUDIO_EXTENSIONS = ['.mp3', '.wav', '.flac', '.ogg', '.aac', '.m4a'];
```

**Image Files (Cover Art):**
```typescript
const ALLOWED_IMAGE_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
```

**Max File Sizes:**
- Audio: 100 MB per file
- Images: 10 MB per file
- Project (entire): 500 MB

---

### 3.2 File Validation

**Multi-Layer Validation:**
```typescript
const validateFile = async (file: File): Promise<ValidationResult> => {
  const errors: string[] = [];
  
  // 1. Extension check
  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  if (!ALLOWED_AUDIO_EXTENSIONS.includes(ext)) {
    errors.push(`Invalid file extension: ${ext}`);
  }
  
  // 2. MIME type check (from header)
  if (!ALLOWED_AUDIO_MIMES.includes(file.type)) {
    errors.push(`Invalid MIME type: ${file.type}`);
  }
  
  // 3. File size check
  if (file.size > 100 * 1024 * 1024) { // 100 MB
    errors.push('File too large (max 100 MB)');
  }
  
  // 4. Magic number validation (read file header)
  const buffer = await file.slice(0, 4).arrayBuffer();
  const header = new Uint8Array(buffer);
  const magicNumber = Array.from(header).map(b => b.toString(16).padStart(2, '0')).join('');
  
  const VALID_MAGIC_NUMBERS = {
    'fffb': 'MP3',
    '4944': 'MP3 (ID3)',
    '5249': 'WAV',
    '664c': 'FLAC',
    '4f67': 'OGG',
  };
  
  if (!Object.keys(VALID_MAGIC_NUMBERS).some(magic => magicNumber.startsWith(magic))) {
    errors.push('File header does not match declared type (possible spoofing)');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};
```

---

### 3.3 Malware Scanning

**ClamAV Integration (Server-Side):**
```typescript
import { NodeClamAV } from 'node-clamav';

const scanFile = async (filePath: string): Promise<ScanResult> => {
  const clam = new NodeClamAV();
  
  try {
    const { isInfected, viruses } = await clam.scanFile(filePath);
    
    if (isInfected) {
      // Log security incident
      await logSecurityEvent({
        type: 'malware_detected',
        file: filePath,
        viruses,
        timestamp: new Date(),
      });
      
      // Delete infected file immediately
      await fs.unlink(filePath);
      
      return {
        safe: false,
        reason: `Malware detected: ${viruses.join(', ')}`,
      };
    }
    
    return { safe: true };
  } catch (error) {
    // If scanning fails, reject upload (fail-safe)
    return {
      safe: false,
      reason: 'Unable to complete security scan',
    };
  }
};
```

**Cloud Alternative (AWS S3 + Lambda):**
- Upload to quarantine bucket
- Lambda triggers ClamAV scan
- If clean: move to production bucket
- If infected: delete + notify security team

---

### 3.4 MIME Sniffing Prevention

**Server Response Headers:**
```typescript
// Prevent browsers from MIME-sniffing
res.setHeader('X-Content-Type-Options', 'nosniff');

// Force download (prevent execution)
res.setHeader('Content-Disposition', 'attachment; filename="audio.mp3"');

// For audio playback (not download)
res.setHeader('Content-Type', 'audio/mpeg');
res.setHeader('X-Content-Type-Options', 'nosniff');
```

---

## 4. Rate Limiting & Abuse Prevention

### 4.1 Global Rate Limits

**API-Wide Limits:**
```typescript
// All API endpoints
const GLOBAL_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,                // 1000 requests per window
  message: 'Too many requests, please try again later',
};
```

---

### 4.2 Per-User Rate Limits

**By Subscription Tier:**
```typescript
const USER_RATE_LIMITS = {
  free: {
    songsPerMonth: 3,
    generationsPerHour: 5,
    exportsPerDay: 10,
  },
  pro: {
    songsPerMonth: Infinity,
    generationsPerHour: 50,
    exportsPerDay: 100,
  },
  studio: {
    songsPerMonth: Infinity,
    generationsPerHour: 200,
    exportsPerDay: 500,
  },
};

// Middleware to enforce limits
const checkUserRateLimit = async (userId: string, action: string) => {
  const user = await getUser(userId);
  const limits = USER_RATE_LIMITS[user.subscriptionTier];
  const usage = await getUserUsage(userId, action);
  
  if (usage >= limits[action]) {
    throw new RateLimitError(`${action} limit exceeded for ${user.subscriptionTier} tier`);
  }
};
```

---

### 4.3 Route-Specific Limits

**Critical Operations:**
```typescript
// Song generation (expensive AI operation)
app.post('/api/studio/generate-song', rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: (req) => {
    const tier = req.user.subscriptionTier;
    return USER_RATE_LIMITS[tier].generationsPerHour;
  },
  keyGenerator: (req) => req.user.id,
}));

// Audio export (bandwidth intensive)
app.post('/api/studio/export', rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: (req) => {
    const tier = req.user.subscriptionTier;
    return USER_RATE_LIMITS[tier].exportsPerDay;
  },
}));

// Publishing (external API calls)
app.post('/api/studio/publish', rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,                   // Max 10 publishes per hour (all tiers)
}));
```

---

### 4.4 Anti-Scraping Measures

**Bot Detection:**
```typescript
// Detect suspicious patterns
const detectBot = (req: Request): boolean => {
  // 1. Check User-Agent
  const userAgent = req.headers.get('user-agent') || '';
  const botPatterns = [
    /bot/i, /crawl/i, /spider/i, /scrape/i,
    /curl/i, /wget/i, /python/i,
  ];
  if (botPatterns.some(pattern => pattern.test(userAgent))) {
    return true;
  }
  
  // 2. Check request frequency
  const recentRequests = getRecentRequests(req.ip);
  if (recentRequests.length > 100 in 60 seconds) {
    return true;
  }
  
  // 3. Check for missing headers
  if (!req.headers.get('accept') || !req.headers.get('accept-language')) {
    return true;
  }
  
  return false;
};

// Apply challenge for suspected bots
app.use((req, res, next) => {
  if (detectBot(req)) {
    // Serve CAPTCHA challenge
    return res.status(403).json({
      error: 'Bot detected',
      challenge: 'Please complete CAPTCHA',
    });
  }
  next();
});
```

---

## 5. Threat Model (STRIDE)

### 5.1 Spoofing Identity

**Threat:** Attacker impersonates legitimate user  
**Mitigations:**
- ✅ Multi-factor authentication (MFA) for Pro+ tiers
- ✅ Email verification required
- ✅ Session tokens with short TTL (1 hour)
- ✅ IP-based anomaly detection

---

### 5.2 Tampering with Data

**Threat:** Attacker modifies audio files or project data  
**Mitigations:**
- ✅ Cryptographic signatures on audio files (SHA-256 hash)
- ✅ Audit logs for all project modifications
- ✅ Version control with rollback capability
- ✅ Immutable storage for published tracks

---

### 5.3 Repudiation

**Threat:** User denies performing action (publishing, payment)  
**Mitigations:**
- ✅ Comprehensive audit logs with timestamps
- ✅ User confirmation dialogs for critical actions
- ✅ Email receipts for all transactions
- ✅ Immutable event log in database

---

### 5.4 Information Disclosure

**Threat:** Unauthorized access to private music or user data  
**Mitigations:**
- ✅ Row Level Security (RLS) on all Supabase tables
- ✅ Encrypted storage for audio files (AES-256)
- ✅ Private-by-default project visibility
- ✅ Signed URLs for audio playback (expiring tokens)

---

### 5.5 Denial of Service (DoS)

**Threat:** Attacker overwhelms system with requests  
**Mitigations:**
- ✅ Rate limiting (see section 4)
- ✅ CDN for static assets (Cloudflare)
- ✅ Auto-scaling for compute resources
- ✅ Queue-based processing for AI generation
- ✅ DDoS protection (Cloudflare Enterprise)

---

### 5.6 Elevation of Privilege

**Threat:** User gains admin access or bypasses subscription limits  
**Mitigations:**
- ✅ Strict authorization checks on all endpoints
- ✅ Server-side subscription validation (never trust client)
- ✅ Separate admin interface with 2FA required
- ✅ Principle of least privilege for all roles

---

## 6. Authorization Model

### 6.1 Role Definitions

```typescript
enum UserRole {
  VIEWER = 'viewer',           // Can view shared projects
  COLLABORATOR = 'collaborator', // Can edit projects they're invited to
  OWNER = 'owner',             // Full control over their projects
  ADMIN = 'admin',             // Platform administration
}

enum ProjectPermission {
  VIEW = 'view',
  EDIT = 'edit',
  DELETE = 'delete',
  PUBLISH = 'publish',
  INVITE = 'invite',
}
```

---

### 6.2 Permission Matrix

| Role | View | Edit | Delete | Publish | Invite Collaborators |
|------|------|------|--------|---------|---------------------|
| **Viewer** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Collaborator** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Owner** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### 6.3 Supabase RLS Patterns

**Projects Table:**
```sql
-- Enable RLS
ALTER TABLE studio_projects ENABLE ROW LEVEL SECURITY;

-- Owners can do anything with their projects
CREATE POLICY "Owners have full access"
  ON studio_projects
  FOR ALL
  USING (auth.uid() = user_id);

-- Collaborators can view and edit
CREATE POLICY "Collaborators can view and edit"
  ON studio_projects
  FOR SELECT, UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM studio_collaborators
      WHERE project_id = studio_projects.id
        AND user_id = auth.uid()
        AND role IN ('collaborator', 'owner')
    )
  );

-- Public projects (if user opts in)
CREATE POLICY "Public projects are viewable"
  ON studio_projects
  FOR SELECT
  USING (visibility = 'public');
```

**Audio Files (Storage):**
```typescript
// Supabase Storage RLS
{
  "private": {
    "upload": "auth.role() = 'authenticated'",
    "select": "storage.folderId = auth.uid() OR isCollaborator(storage.folderId, auth.uid())",
    "delete": "storage.folderId = auth.uid()"
  }
}
```

---

## 7. Data Encryption

### 7.1 In Transit (TLS)

**Configuration:**
- ✅ TLS 1.3 minimum (disable TLS 1.2 and below)
- ✅ Strong cipher suites only (AES-256-GCM)
- ✅ HSTS headers with 1-year max-age
- ✅ Certificate pinning for mobile apps

```nginx
# Nginx TLS config
ssl_protocols TLSv1.3;
ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
ssl_prefer_server_ciphers on;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

---

### 7.2 At Rest (Storage)

**Database Encryption:**
- ✅ Supabase uses AES-256 encryption at rest
- ✅ Transparent Data Encryption (TDE) enabled
- ✅ Backups also encrypted

**File Storage Encryption:**
```typescript
// AWS S3 server-side encryption (SSE-KMS)
await s3.putObject({
  Bucket: 'flashfusion-studio-audio',
  Key: `${userId}/${projectId}/audio.mp3`,
  Body: audioBuffer,
  ServerSideEncryption: 'aws:kms',
  SSEKMSKeyId: process.env.AWS_KMS_KEY_ID,
});

// Or client-side encryption before upload
import { encrypt } from '@aws-crypto/client-node';

const encryptedAudio = await encrypt(audioBuffer, {
  keyring: keyring,
  encryptionContext: {
    userId,
    projectId,
  },
});
```

---

### 7.3 KMS-Managed Keys

**Key Hierarchy:**
```
Master Key (AWS KMS)
  ├── Data Encryption Key 1 (DEK) - Audio files
  ├── Data Encryption Key 2 (DEK) - Project metadata
  └── Data Encryption Key 3 (DEK) - User PII
```

**Key Rotation:**
- Master keys: Automatic rotation every 365 days
- Data keys: Rotate on master key rotation
- Manual rotation: Triggered by security incident

---

## 8. Incident Response

### 8.1 Security Incident Levels

**P0: Critical**
- Data breach (user data exposed)
- Complete service compromise
- Ransomware attack
- **Response:** Immediate war room, notify CEO/legal within 1 hour

**P1: High**
- Vulnerability actively exploited
- DDoS attack impacting service
- Payment system compromise
- **Response:** Assemble security team within 15 minutes

**P2: Medium**
- Vulnerability discovered (not exploited)
- Suspicious activity detected
- Minor data exposure
- **Response:** Investigate within 4 hours

---

### 8.2 Incident Response Plan

**1. Detection**
- Automated alerts (Sentry, DataDog)
- User reports
- Penetration test findings

**2. Containment**
- Isolate affected systems
- Revoke compromised credentials
- Enable additional logging

**3. Eradication**
- Patch vulnerabilities
- Remove malicious code
- Reset all secrets

**4. Recovery**
- Restore from clean backups
- Verify system integrity
- Gradual service restoration

**5. Post-Incident**
- Detailed postmortem
- User notification (if required by law)
- Update security controls

---

## 9. Compliance Checklist

### 9.1 GDPR (EU Users)
- ✅ Data processing agreement with Supabase
- ✅ User consent for data collection
- ✅ Right to access (data export)
- ✅ Right to be forgotten (data deletion)
- ✅ Data breach notification (72 hours)

### 9.2 CCPA (California Users)
- ✅ Privacy policy disclosure
- ✅ Opt-out of data sale (we don't sell data)
- ✅ Data access request process
- ✅ Non-discrimination for exercising rights

### 9.3 PCI DSS (Payment Data)
- ✅ No storage of payment card data (Stripe handles it)
- ✅ PCI-compliant payment processor (Stripe Level 1)
- ✅ Secure transmission of payment data (TLS)

---

## 10. Security Audit Schedule

| Activity | Frequency | Owner |
|----------|-----------|-------|
| **Vulnerability Scanning** | Weekly | Security Team |
| **Penetration Testing** | Quarterly | External Firm |
| **Code Security Review** | Per Release | Engineering + Security |
| **Dependency Audit** | Weekly (automated) | DevOps |
| **Access Review** | Monthly | Security Team |
| **Incident Response Drill** | Bi-annually | All Teams |

---

## Appendix A: Security Contacts

**Security Team:**
- Email: security@flashfusion.co
- PGP Key: [Link to public key]
- Bug Bounty: https://flashfusion.co/security/bug-bounty

**Responsible Disclosure:**
- Report vulnerabilities to security@flashfusion.co
- 90-day disclosure window
- Rewards for critical vulnerabilities ($100-$5,000)

---

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Next Review:** April 2025  
**Classification:** Internal - Security Team Only
