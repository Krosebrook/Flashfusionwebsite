/**
 * @fileoverview Example integration of Veteran Grade Snapshot
 * Shows how to integrate the snapshot feature into an existing app
 */

import React from 'react';
import { VeteranGradeSnapshotComponent } from '../components/snapshots';

/**
 * Example 1: Basic Usage in a Dashboard
 */
export function VeteranDashboard() {
  // Get current user ID from your auth system
  const userId = 'current-user-id'; // Replace with actual user ID from auth

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Veteran Dashboard</h1>
      
      {/* The component handles everything automatically */}
      <VeteranGradeSnapshotComponent 
        userId={userId}
        autoLoad={true}
      />
    </div>
  );
}

/**
 * Example 2: Manual Control with Custom Actions
 */
export function AdvancedVeteranDashboard() {
  const [userId] = React.useState('current-user-id');
  const [showSnapshot, setShowSnapshot] = React.useState(false);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Performance Metrics</h1>
        <button 
          onClick={() => setShowSnapshot(!showSnapshot)}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          {showSnapshot ? 'Hide' : 'Show'} Grade Snapshot
        </button>
      </div>
      
      {showSnapshot && (
        <VeteranGradeSnapshotComponent 
          userId={userId}
          autoLoad={false}
        />
      )}
    </div>
  );
}

/**
 * Example 3: Using the Service Directly
 */
export function CustomSnapshotHandler() {
  const [snapshot, setSnapshot] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const createSnapshot = async () => {
    setLoading(true);
    try {
      // Import the service
      const { VeteranGradeSnapshotService } = await import('../services/VeteranGradeSnapshotService');
      
      const response = await VeteranGradeSnapshotService.createSnapshot({
        userId: 'current-user-id',
        experienceLevel: 'veteran',
        includeHistory: true,
        source: 'manual'
      });

      if (response.success) {
        setSnapshot(response.snapshot);
        console.log('Snapshot created:', response.snapshot);
      }
    } catch (error) {
      console.error('Error creating snapshot:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <button 
        onClick={createSnapshot}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? 'Creating...' : 'Create Snapshot'}
      </button>

      {snapshot && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Snapshot Created!</h2>
          <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
            {JSON.stringify(snapshot, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

/**
 * Example 4: Scheduled Snapshots
 */
export function ScheduledSnapshotExample() {
  React.useEffect(() => {
    // Create a snapshot every hour
    const interval = setInterval(async () => {
      const { VeteranGradeSnapshotService } = await import('../services/VeteranGradeSnapshotService');
      
      await VeteranGradeSnapshotService.createSnapshot({
        userId: 'current-user-id',
        experienceLevel: 'veteran',
        includeHistory: true,
        source: 'scheduled'
      });
      
      console.log('Scheduled snapshot created');
    }, 60 * 60 * 1000); // Every hour

    return () => clearInterval(interval);
  }, []);

  return <div>Automated snapshots running...</div>;
}

/**
 * Example 5: Export Snapshot History
 */
export function SnapshotHistoryExporter() {
  const exportHistory = async () => {
    const { VeteranGradeSnapshotService } = await import('../services/VeteranGradeSnapshotService');
    
    const history = await VeteranGradeSnapshotService.getSnapshotHistory('current-user-id');
    
    // Convert to CSV
    const csv = [
      ['Date', 'Overall Score', 'Grade', 'Status', 'Trend'],
      ...history.snapshots.map(s => [
        s.timestamp.toISOString(),
        s.overallScore,
        s.overallGrade,
        s.overallStatus,
        s.comparison?.trend || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `snapshot-history-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={exportHistory} className="px-4 py-2 bg-green-500 text-white rounded">
      Export History to CSV
    </button>
  );
}
