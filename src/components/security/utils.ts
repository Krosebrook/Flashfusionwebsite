import { SecurityMetric, SecurityThreat, ComplianceFramework, AccessToken, SecurityOverview } from './types';

export const calculateOverallSecurityScore = (metrics: SecurityMetric[]): number => {
  if (metrics.length === 0) return 0;
  
  const totalScore = metrics.reduce((sum, metric) => sum + metric.score, 0);
  return Math.round(totalScore / metrics.length);
};

export const calculateComplianceScore = (frameworks: ComplianceFramework[]): number => {
  if (frameworks.length === 0) return 0;
  
  const totalCompliance = frameworks.reduce((sum, framework) => sum + framework.overallCompliance, 0);
  return Math.round(totalCompliance / frameworks.length);
};

export const getSecurityOverview = (
  metrics: SecurityMetric[],
  threats: SecurityThreat[],
  frameworks: ComplianceFramework[],
  tokens: AccessToken[]
): SecurityOverview => {
  const overallScore = calculateOverallSecurityScore(metrics);
  const totalThreats = threats.length;
  const resolvedThreats = threats.filter(t => t.status === 'resolved' || t.status === 'mitigated').length;
  const activeTokens = tokens.filter(t => t.status === 'active').length;
  const complianceScore = calculateComplianceScore(frameworks);
  const lastScan = new Date(); // Would come from actual scan data

  return {
    overallScore,
    totalThreats,
    resolvedThreats,
    activeTokens,
    complianceScore,
    lastScan
  };
};

export const getRiskLevel = (score: number): 'low' | 'medium' | 'high' | 'critical' => {
  if (score >= 90) return 'low';
  if (score >= 75) return 'medium';
  if (score >= 60) return 'high';
  return 'critical';
};

export const getScoreColor = (score: number): string => {
  if (score >= 90) return '#10B981'; // Green
  if (score >= 75) return '#F59E0B'; // Yellow
  if (score >= 60) return '#EF4444'; // Red
  return '#DC2626'; // Dark red
};

export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};

export const getSeverityLevel = (severity: string): number => {
  switch (severity) {
    case 'critical': return 4;
    case 'high': return 3;
    case 'medium': return 2;
    case 'low': return 1;
    default: return 0;
  }
};

export const sortThreatsBySeverity = (threats: SecurityThreat[]): SecurityThreat[] => {
  return [...threats].sort((a, b) => getSeverityLevel(b.severity) - getSeverityLevel(a.severity));
};

export const getTokenRiskScore = (token: AccessToken): number => {
  let score = 0;
  
  // High-risk permissions
  if (token.permissions.some(p => p.includes('admin') || p.includes('write'))) {
    score += 3;
  }
  
  // Token age
  const ageInDays = (Date.now() - token.createdAt.getTime()) / (1000 * 60 * 60 * 24);
  if (ageInDays > 365) score += 2;
  else if (ageInDays > 180) score += 1;
  
  // Last used
  if (token.lastUsed) {
    const daysSinceUse = (Date.now() - token.lastUsed.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUse > 90) score += 2;
    else if (daysSinceUse > 30) score += 1;
  } else {
    score += 3; // Never used is risky
  }
  
  // Expiration
  if (token.expiresAt) {
    const daysToExpiry = (token.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    if (daysToExpiry < 0) score += 4; // Expired
    else if (daysToExpiry < 30) score += 1; // Expiring soon
  } else {
    score += 1; // No expiration
  }
  
  return Math.min(score, 10); // Cap at 10
};

export const categorizeTokensByRisk = (tokens: AccessToken[]): Record<string, AccessToken[]> => {
  const categorized = {
    high: [] as AccessToken[],
    medium: [] as AccessToken[],
    low: [] as AccessToken[]
  };
  
  tokens.forEach(token => {
    const riskScore = getTokenRiskScore(token);
    if (riskScore >= 6) categorized.high.push(token);
    else if (riskScore >= 3) categorized.medium.push(token);
    else categorized.low.push(token);
  });
  
  return categorized;
};

export const getComplianceStatus = (score: number): 'compliant' | 'partial' | 'non-compliant' => {
  if (score >= 90) return 'compliant';
  if (score >= 70) return 'partial';
  return 'non-compliant';
};

export const generateSecurityRecommendations = (metrics: SecurityMetric[]): string[] => {
  const recommendations: string[] = [];
  
  metrics.forEach(metric => {
    if (metric.status === 'critical' || metric.status === 'warning') {
      if (metric.recommendations) {
        recommendations.push(...metric.recommendations);
      }
    }
  });
  
  // Remove duplicates and return top 5
  return Array.from(new Set(recommendations)).slice(0, 5);
};