import React from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  AlertTriangle, 
  Shield, 
  Clock, 
  CheckCircle2, 
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { SecurityThreat } from './types';
import { THREAT_TYPES, SEVERITY_COLORS } from './constants';
import { formatTimeAgo } from './utils';

interface SecurityThreatCardProps {
  threat: SecurityThreat;
  onInvestigate?: (threatId: string) => void;
  onResolve?: (threatId: string) => void;
}

export function SecurityThreatCard({ threat, onInvestigate, onResolve }: SecurityThreatCardProps) {
  const threatConfig = THREAT_TYPES[threat.type];
  const severityColor = SEVERITY_COLORS[threat.severity];

  const getStatusIcon = () => {
    switch (threat.status) {
      case 'resolved': return CheckCircle2;
      case 'mitigated': return Shield;
      case 'investigating': return Eye;
      default: return AlertTriangle;
    }
  };

  const getStatusColor = () => {
    switch (threat.status) {
      case 'resolved': return '#10B981';
      case 'mitigated': return '#3B82F6';
      case 'investigating': return '#F59E0B';
      default: return '#EF4444';
    }
  };

  const StatusIcon = getStatusIcon();
  const statusColor = getStatusColor();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="relative overflow-hidden transition-all duration-300 hover:shadow-lg"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderLeft: `4px solid ${severityColor}`
        }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center mt-1"
                style={{ backgroundColor: `${severityColor}15` }}
              >
                <AlertTriangle className="h-5 w-5" style={{ color: severityColor }} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{threat.title}</h3>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge 
                    className="text-xs capitalize"
                    style={{
                      backgroundColor: `${severityColor}15`,
                      color: severityColor,
                      border: `1px solid ${severityColor}30`
                    }}
                  >
                    {threat.severity}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="text-xs"
                    style={{ color: threatConfig.color, borderColor: `${threatConfig.color}30` }}
                  >
                    {threatConfig.name}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {threat.description}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div 
                className="flex items-center space-x-1 px-2 py-1 rounded-full"
                style={{ backgroundColor: `${statusColor}15` }}
              >
                <StatusIcon className="h-3 w-3" style={{ color: statusColor }} />
                <span className="text-xs font-medium capitalize" style={{ color: statusColor }}>
                  {threat.status}
                </span>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Threat Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">Source</div>
              <div className="text-sm font-medium text-gray-900">{threat.source}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Detected</div>
              <div className="text-sm font-medium text-gray-900">
                {formatTimeAgo(threat.timestamp)}
              </div>
            </div>
          </div>

          {/* Affected Assets */}
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-2">Affected Assets</div>
            <div className="flex flex-wrap gap-1">
              {threat.affectedAssets.map((asset, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {asset}
                </Badge>
              ))}
            </div>
          </div>

          {/* Response Time */}
          {threat.responseTime && (
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Response time: {threat.responseTime} minutes
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2">
            {threat.status === 'detected' && (
              <Button 
                size="sm" 
                className="flex-1"
                style={{ backgroundColor: '#F59E0B', color: 'white' }}
                onClick={() => onInvestigate?.(threat.id)}
              >
                Investigate
              </Button>
            )}
            
            {threat.status === 'investigating' && (
              <Button 
                size="sm" 
                className="flex-1"
                style={{ backgroundColor: '#10B981', color: 'white' }}
                onClick={() => onResolve?.(threat.id)}
              >
                Mark Resolved
              </Button>
            )}

            <Button size="sm" variant="outline">
              View Details
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}