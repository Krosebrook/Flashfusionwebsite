# FlashFusion Studio - Privacy Baseline

## Overview

This document establishes the privacy baseline for FlashFusion Studio, ensuring compliance with GDPR, CCPA, and other privacy regulations while maintaining transparency with users about data collection, usage, and protection.

**Classification:** Public  
**Last Updated:** January 2025  
**Review Cadence:** Quarterly or upon regulatory changes  
**Owner:** FlashFusion Legal & Privacy Team

---

## 1. Privacy Principles

### 1.1 Core Commitments

**We commit to:**
1. **Transparency** - Clear communication about data practices
2. **User Control** - Users own and control their data
3. **Data Minimization** - Collect only what's necessary
4. **Purpose Limitation** - Use data only for stated purposes
5. **Security** - Protect data with industry-standard security
6. **Accountability** - Take responsibility for data protection

---

## 2. Data Collection

### 2.1 Personal Information Collected

**Account Data:**
```typescript
interface UserAccount {
  // Required
  email: string;
  passwordHash: string;      // Never store plaintext
  
  // Optional
  username?: string;
  displayName?: string;
  avatar?: string;
  
  // System-generated
  userId: string;
  createdAt: Date;
  lastLoginAt: Date;
}
```

**Profile Data:**
```typescript
interface UserProfile {
  // Optional user-provided
  bio?: string;
  website?: string;
  socialLinks?: {
    spotify?: string;
    soundcloud?: string;
    youtube?: string;
  };
  genres?: string[];
  
  // Privacy settings
  profileVisibility: 'public' | 'private';
  showEmail: boolean;
}
```

**Project Data:**
```typescript
interface StudioProject {
  projectId: string;
  userId: string;
  title: string;
  description?: string;
  
  // Audio files (stored separately in encrypted storage)
  audioFiles: AudioFileReference[];
  
  // Metadata
  genre?: string;
  tempo?: number;
  key?: string;
  
  // Timestamps
  createdAt: Date;
  lastModifiedAt: Date;
}
```

**Usage Data:**
```typescript
interface UsageData {
  // User actions (for analytics and billing)
  songsGenerated: number;
  exportsCreated: number;
  publishingEvents: number;
  
  // Session data
  sessionDuration: number;
  featuresUsed: string[];
  
  // No PII in usage data
}
```

**Payment Data:**
```typescript
interface PaymentData {
  // Stored by Stripe (not us)
  stripeCustomerId: string;
  
  // We store only references
  subscriptionTier: 'free' | 'pro' | 'studio' | 'enterprise';
  subscriptionStatus: 'active' | 'canceled' | 'past_due';
  billingEmail: string;
  
  // NO credit card numbers stored
}
```

---

### 2.2 Data NOT Collected

**We do NOT collect:**
- ❌ Precise geolocation (only country-level for compliance)
- ❌ Biometric data
- ❌ Health information
- ❌ Financial data (Stripe handles this)
- ❌ Social Security Numbers or government IDs
- ❌ Children's data (platform is 13+)

---

### 2.3 Cookies & Tracking

**Essential Cookies (Required):**
```typescript
const ESSENTIAL_COOKIES = {
  'ff_session': {
    purpose: 'Authentication session',
    duration: '1 hour',
    domain: '.flashfusion.co',
  },
  'ff_csrf': {
    purpose: 'CSRF protection',
    duration: 'Session',
    domain: '.flashfusion.co',
  },
};
```

**Analytics Cookies (Opt-in):**
```typescript
const ANALYTICS_COOKIES = {
  '_ga': {
    purpose: 'Google Analytics - Usage patterns',
    duration: '2 years',
    provider: 'Google',
  },
  'segment_aid': {
    purpose: 'Segment - Product analytics',
    duration: '1 year',
    provider: 'Segment',
  },
};

// User can opt-out via settings
const trackingConsent = getUserTrackingConsent(userId);
if (!trackingConsent) {
  // Don't load analytics scripts
}
```

---

## 3. Data Usage

### 3.1 Primary Use Cases

**We use your data to:**

1. **Provide Services**
   - Generate music from prompts
   - Save and load projects
   - Export audio files
   - Publish to streaming platforms

2. **Improve Product**
   - Analyze usage patterns
   - Identify bugs and issues
   - A/B test new features
   - Train AI models (opt-in only)

3. **Communicate**
   - Send service notifications
   - Provide customer support
   - Share product updates (opt-in)

4. **Process Payments**
   - Manage subscriptions
   - Issue invoices
   - Handle refunds

5. **Comply with Law**
   - Respond to legal requests
   - Prevent fraud and abuse
   - Enforce Terms of Service

---

### 3.2 Data Sharing

**We share data with:**

**Service Providers (Data Processors):**
| Provider | Purpose | Data Shared | Location |
|----------|---------|-------------|----------|
| **Supabase** | Database & Auth | Email, userId, projects | US (SOC 2) |
| **AWS S3** | Audio file storage | Audio files, userId | US (configurable) |
| **Stripe** | Payment processing | Email, billing info | US (PCI DSS) |
| **Segment** | Analytics | Usage data (no PII) | US |
| **Sentry** | Error tracking | Error logs, userId | US |

**Integration Partners (With User Permission):**
| Partner | Purpose | Data Shared | User Control |
|---------|---------|-------------|--------------|
| **Spotify** | Publishing | Track metadata, audio | Opt-in per publish |
| **Apple Music** | Publishing | Track metadata, audio | Opt-in per publish |
| **SoundCloud** | Publishing | Track metadata, audio | Opt-in per publish |

**We do NOT:**
- ❌ Sell personal data to third parties
- ❌ Share data with advertisers
- ❌ Use data for unrelated purposes

---

### 3.3 AI Model Training

**Opt-In Policy:**
```typescript
interface AITrainingConsent {
  allowMusicTraining: boolean;      // Use my music to improve AI models
  allowLyricTraining: boolean;      // Use my lyrics for AI training
  allowAnonymizedUsage: boolean;    // Share anonymized usage patterns
}

// Default: All FALSE (opt-in required)
const defaultConsent: AITrainingConsent = {
  allowMusicTraining: false,
  allowLyricTraining: false,
  allowAnonymizedUsage: false,
};
```

**If you opt-in:**
- Your music may be used to train our AI models
- Data is anonymized (no personal identifiers)
- You can revoke consent anytime
- Previous contributions remain in training set (cannot be removed)

**If you opt-out:**
- Your data is NEVER used for AI training
- No impact on service quality
- All features remain available

---

## 4. User Rights (GDPR & CCPA)

### 4.1 Right to Access

**Request your data:**
```typescript
// API endpoint
POST /api/studio/privacy/data-export

// Response: Download link to ZIP file containing:
{
  "user_profile.json",      // Account info
  "projects/",              // All project metadata
  "audio_files/",           // All audio files
  "usage_data.json",        // Analytics data
  "payment_history.json",   // Invoice history
  "activity_log.json",      // Audit log
}

// Delivered within 30 days (typically < 24 hours)
```

---

### 4.2 Right to Deletion ("Right to Be Forgotten")

**Request account deletion:**
```typescript
POST /api/studio/privacy/delete-account

// What gets deleted:
- User account and profile
- All projects and audio files
- Usage analytics data
- Collaboration records

// What we retain (legal obligation):
- Payment records (7 years for tax compliance)
- Anonymized usage statistics
- Published music (cannot revoke once distributed)

// Timeline: 30 days
```

**Soft Delete vs. Hard Delete:**
```typescript
// Day 0-30: Soft delete (recoverable)
user.deletedAt = new Date();
user.status = 'pending_deletion';

// Day 30: Hard delete (permanent)
await deleteUserData(userId);
await deleteAudioFiles(userId);
await anonymizeAnalytics(userId);
```

---

### 4.3 Right to Rectification

**Correct inaccurate data:**
- Edit your profile anytime via Settings
- Contact support for data correction
- We'll update within 7 days

---

### 4.4 Right to Data Portability

**Export in machine-readable format:**
```json
// All data exported as JSON
{
  "format": "JSON",
  "version": "1.0",
  "exported_at": "2025-01-20T12:00:00Z",
  "user": {
    "email": "user@example.com",
    "username": "musiccreator",
    "created_at": "2024-06-15T08:00:00Z"
  },
  "projects": [
    {
      "id": "proj_123",
      "title": "My Song",
      "audio_url": "https://download.flashfusion.co/...",
      "metadata": { ... }
    }
  ]
}
```

---

### 4.5 Right to Object

**Object to data processing:**
- Opt-out of marketing emails (unsubscribe link)
- Disable analytics cookies (Settings)
- Object to AI training (Settings)
- Stop data processing (delete account)

---

### 4.6 Right to Restrict Processing

**Limit how we use your data:**
```typescript
interface ProcessingRestrictions {
  suspendAnalytics: boolean;        // Stop collecting usage data
  suspendMarketing: boolean;        // No promotional emails
  suspendAITraining: boolean;       // Don't use for AI training
  minimumDataCollection: boolean;   // Only essential data
}

// User can toggle via Settings
```

---

## 5. Data Retention

### 5.1 Retention Schedule

| Data Type | Retention Period | Reason |
|-----------|-----------------|--------|
| **Account Info** | Until deletion | Provide service |
| **Project Data** | Until deletion or 2 years inactive | User access |
| **Audio Files** | Until deletion or 1 year inactive (Free tier) | Storage costs |
| **Usage Analytics** | 2 years | Product improvement |
| **Payment Records** | 7 years | Tax compliance |
| **Support Tickets** | 3 years | Customer service |
| **Audit Logs** | 1 year | Security |
| **Backup Data** | 90 days | Disaster recovery |

---

### 5.2 Inactive Account Policy

**Free Tier:**
- **No activity for 1 year** → Email warning (30 days notice)
- **No response** → Audio files deleted, account archived
- **Account reactivation** → Metadata restored, audio files lost

**Paid Tier:**
- **Subscription active** → No deletion (as long as paying)
- **Subscription canceled** → 90-day grace period
- **After 90 days** → Same as Free tier

---

### 5.3 Data Deletion Process

**Manual Deletion:**
```typescript
// User requests deletion
const deleteUserData = async (userId: string) => {
  // 1. Mark account as pending deletion
  await db.users.update(userId, {
    status: 'pending_deletion',
    deletionRequestedAt: new Date(),
  });
  
  // 2. Send confirmation email
  await sendEmail({
    to: user.email,
    subject: 'Account Deletion Requested',
    body: 'You have 30 days to cancel this request...',
  });
  
  // 3. After 30 days, hard delete (cron job)
  await hardDeleteUser(userId);
};

const hardDeleteUser = async (userId: string) => {
  // Delete in order (referential integrity)
  await db.projects.deleteMany({ userId });
  await storage.deleteFolder(`users/${userId}/`);
  await analytics.anonymizeUser(userId);
  await db.users.hardDelete(userId);
  
  // Audit log
  await logEvent({
    type: 'user_deletion_complete',
    userId,
    timestamp: new Date(),
  });
};
```

---

## 6. Data Security

### 6.1 Encryption

**In Transit:**
- TLS 1.3 for all API calls
- HTTPS enforced (no HTTP)
- Certificate pinning for mobile apps

**At Rest:**
- Database: AES-256 encryption (Supabase)
- Files: Server-side encryption (AWS S3 + KMS)
- Backups: Also encrypted

---

### 6.2 Access Controls

**Who can access your data:**

| Role | Access | Purpose |
|------|--------|---------|
| **You** | Full access | Your data |
| **Collaborators** | View/Edit projects (if invited) | Collaboration |
| **Support Team** | View only (with permission) | Customer support |
| **Engineering** | Aggregated data only (no PII) | Bug fixing |
| **Security Team** | Audit logs only | Incident response |

**Admin Access:**
- Requires 2FA
- Audit logged
- Time-limited (4-hour sessions)
- Reviewed monthly

---

## 7. Data Breach Notification

### 7.1 Breach Response

**If we discover a breach:**

**Within 1 hour:**
- Assemble security team
- Contain the breach
- Assess impact

**Within 24 hours:**
- Determine affected users
- Prepare notification
- Notify regulators (if required)

**Within 72 hours:**
- Email affected users
- Post public notice (if widespread)
- Provide remediation steps

---

### 7.2 User Notification Template

```
Subject: Important Security Notice - FlashFusion Studio

Dear [User],

We're writing to inform you of a security incident that may have affected your FlashFusion Studio account.

WHAT HAPPENED:
[Brief description of incident]

WHAT DATA WAS AFFECTED:
[Specific data types: email, project metadata, etc.]

WHAT WAS NOT AFFECTED:
[Data that is safe]

WHAT WE'RE DOING:
- [Action 1: e.g., patched vulnerability]
- [Action 2: e.g., reset passwords]
- [Action 3: e.g., enhanced monitoring]

WHAT YOU SHOULD DO:
1. Change your password immediately
2. Enable 2FA if not already enabled
3. Review recent account activity
4. Contact us with questions: security@flashfusion.co

We sincerely apologize for this incident and are taking steps to prevent future occurrences.

FlashFusion Security Team
```

---

## 8. International Data Transfers

### 8.1 Data Residency

**Default Storage Locations:**
- **US Users** → US East (Virginia) AWS region
- **EU Users** → EU West (Ireland) AWS region
- **Other** → Nearest available region

**Cross-Border Transfers:**
- EU → US: Standard Contractual Clauses (SCCs)
- US → EU: Adequacy Decision (when available)
- Encryption in transit for all transfers

---

### 8.2 GDPR-Specific Provisions

**For EU users:**
- ✅ Data Processing Agreement (DPA) available on request
- ✅ Data Protection Impact Assessment (DPIA) completed
- ✅ EU representative appointed (if required)
- ✅ Supervisory authority: [Country-specific DPA]

---

## 9. Children's Privacy (COPPA)

### 9.1 Age Restrictions

**FlashFusion Studio is 13+ only**
- Age verification at signup
- Parental consent required for 13-17 (US)
- Enhanced protections for minors

**If we discover a user under 13:**
- Immediate account suspension
- Delete all data within 30 days
- Notify parent/guardian

---

## 10. Data Protection Impact Assessment (DPIA)

### 10.1 High-Risk Processing Activities

**Identified High-Risk Activities:**

1. **AI Music Generation**
   - Risk: Model may memorize copyrighted music
   - Mitigation: Training data filtering, output validation

2. **Real-Time Collaboration**
   - Risk: Accidental data exposure to wrong collaborators
   - Mitigation: Strict access controls, audit logs

3. **Audio File Storage**
   - Risk: Unauthorized access to private music
   - Mitigation: Encryption, signed URLs, RLS

4. **Payment Processing**
   - Risk: Financial data breach
   - Mitigation: PCI-compliant processor (Stripe), no card storage

---

### 10.2 DPIA Template

```markdown
# DPIA Template

## 1. Description of Processing
[What data is processed and why]

## 2. Necessity and Proportionality
[Is this processing necessary? Least invasive method?]

## 3. Risks to Individuals
[What could go wrong? Impact on users?]

## 4. Measures to Address Risks
[How are risks mitigated?]

## 5. Consultation
[Have users been consulted? DPO review?]

## 6. Sign-Off
[Legal and DPO approval]
```

---

## 11. Contacts & Requests

### 11.1 Data Protection Officer (DPO)

**Contact Information:**
- Email: dpo@flashfusion.co
- Address: [Physical address for GDPR compliance]
- Phone: [Phone number]
- Response Time: Within 5 business days

---

### 11.2 Privacy Request Portal

**Submit requests at:**
https://flashfusion.co/privacy/requests

**Request Types:**
- Data access (export)
- Data deletion
- Data correction
- Opt-out of processing
- General privacy questions

**Verification:**
- We may ask for ID verification (security)
- Requests processed within 30 days
- Status updates via email

---

### 11.3 Supervisory Authorities

**EU Users:**
- Your national Data Protection Authority
- EU DPA List: https://edpb.europa.eu/

**California Users:**
- California Attorney General
- CCPA Portal: https://oag.ca.gov/

**Other Jurisdictions:**
- Contact your local privacy regulator

---

## 12. Policy Updates

### 12.1 Notification of Changes

**We will notify you of material changes:**
- Email to all users (30 days notice)
- Banner on website
- Update version history below

**Material changes:**
- New data collection
- Sharing with new third parties
- Changes to user rights
- Reduced security measures

**Non-material changes:**
- Clarifications of existing practices
- Contact information updates
- Legal reference updates

---

### 12.2 Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Jan 2025 | Initial privacy baseline | Legal Team |

---

## 13. Compliance Checklist

### 13.1 GDPR Compliance

- ✅ Lawful basis for processing (contract, consent, legitimate interest)
- ✅ Privacy by design and default
- ✅ Data Protection Impact Assessment (DPIA)
- ✅ Data Processing Agreement with processors
- ✅ Records of processing activities
- ✅ Data breach notification procedure (72 hours)
- ✅ DPO appointed (if required)
- ✅ User rights implementation (access, deletion, portability)
- ✅ International transfer safeguards (SCCs)
- ✅ Cookie consent (opt-in for non-essential)

---

### 13.2 CCPA Compliance

- ✅ Privacy policy with required disclosures
- ✅ Categories of data collected disclosed
- ✅ Purposes of collection disclosed
- ✅ Third parties receiving data disclosed
- ✅ Right to know implementation
- ✅ Right to delete implementation
- ✅ Right to opt-out (we don't sell data)
- ✅ Non-discrimination policy
- ✅ Verification process for requests
- ✅ Authorized agent process

---

## Appendix A: Definitions

**Personal Data:** Any information relating to an identified or identifiable individual.

**Processing:** Any operation performed on personal data (collection, storage, use, deletion).

**Data Controller:** FlashFusion (determines purposes and means of processing).

**Data Processor:** Third-party service providers (process data on our behalf).

**Data Subject:** You (the user whose data is processed).

---

## Appendix B: Legal Bases for Processing (GDPR)

| Processing Activity | Legal Basis |
|---------------------|-------------|
| Account creation | Contract |
| Service provision | Contract |
| Payment processing | Contract |
| Analytics | Legitimate interest |
| Marketing emails | Consent |
| AI training | Consent |
| Legal compliance | Legal obligation |

---

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Next Review:** April 2025 or upon regulatory change  
**Effective Date:** Upon Studio launch  
**Contact:** dpo@flashfusion.co
