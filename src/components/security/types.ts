export interface SecurityMetric {
  id: string;
  name: string;
  category: 'authentication' | 'data-protection' | 'network' | 'compliance' | 'monitoring';
  score: number;
  status: 'secure' | 'warning' | 'critical' | 'unknown';
  lastChecked: Date;
  details: string;
  recommendations?: string[];
  trend: 'up' | 'down' | 'stable';
}

export interface SecurityThreat {
  id: string;
  type: 'intrusion-attempt' | 'data-breach' | 'malware' | 'phishing' | 'ddos' | 'insider-threat';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  source: string;
  timestamp: Date;
  status: 'detected' | 'investigating' | 'mitigated' | 'resolved';
  affectedAssets: string[];
  responseTime?: number; // in minutes
}

export interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  requirements: {
    id: string;
    title: string;
    status: 'compliant' | 'partial' | 'non-compliant' | 'not-applicable';
    lastAudit: Date;
    evidence?: string[];
  }[];
  overallCompliance: number;
  certification?: {
    status: 'certified' | 'pending' | 'expired';
    validUntil?: Date;
    certifier: string;
  };
}

export interface AccessToken {
  id: string;
  name: string;
  type: 'api-key' | 'oauth-token' | 'jwt' | 'service-account';
  scope: string[];
  createdAt: Date;
  lastUsed?: Date;
  expiresAt?: Date;
  status: 'active' | 'expired' | 'revoked' | 'suspended';
  permissions: string[];
  riskLevel: 'low' | 'medium' | 'high';
  usageCount: number;
}

export interface SecurityOverview {
  overallScore: number;
  totalThreats: number;
  resolvedThreats: number;
  activeTokens: number;
  complianceScore: number;
  lastScan: Date;
}