'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SyncError {
  group: string;
  error: string;
  action: string;
}

interface SyncResult {
  success: boolean;
  syncedCount: number;
  errorCount: number;
  inactiveCount: number;
  syncedGroups: string[];
  inactiveGroups: string[];
  errors: SyncError[];
  message: string;
}

export function SyncGroupsButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);

    try {
      const response = await fetch('/api/groups/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        const syncData = data as SyncResult;
        setSyncResult(syncData);
        // Show details if there are errors or inactive groups
        if (syncData.errorCount > 0 || syncData.inactiveCount > 0) {
          setShowDetails(true);
        }
        // Refresh the page to show updated groups
        router.refresh();
      } else {
        // Handle error response
        const errorMessage = data.error || 'Failed to sync groups';
        setSyncResult({
          success: false,
          syncedCount: 0,
          errorCount: 1,
          inactiveCount: 0,
          syncedGroups: [],
          inactiveGroups: [],
          errors: [{ group: 'Unknown', error: errorMessage, action: 'Failed' }],
          message: errorMessage
        });
        setShowDetails(true);
      }
    } catch (error) {
      setSyncResult({
        success: false,
        syncedCount: 0,
        errorCount: 1,
        inactiveCount: 0,
        syncedGroups: [],
        inactiveGroups: [],
        errors: [{ group: 'Unknown', error: 'Error connecting to server', action: 'Failed' }],
        message: 'Error connecting to server'
      });
      setShowDetails(true);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          onClick={handleSync}
          disabled={isSyncing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Groups'}
        </Button>
        {syncResult && !showDetails && (
          <div className="flex items-center gap-2">
            <span className={`text-sm ${syncResult.errorCount > 0 ? 'text-amber-600' : 'text-green-600'}`}>
              {syncResult.message}
            </span>
            {(syncResult.errorCount > 0 || syncResult.inactiveCount > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(true)}
              >
                <AlertCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sync Results</DialogTitle>
            <DialogDescription>
              Detailed information about the group synchronization
            </DialogDescription>
          </DialogHeader>
          
          {syncResult && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{syncResult.syncedCount}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Synced</div>
                </div>
                <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <AlertCircle className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{syncResult.inactiveCount}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Inactive</div>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{syncResult.errorCount}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Errors</div>
                </div>
              </div>

              {/* Details */}
              {syncResult.errors.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Issues Found:</h3>
                  <div className="space-y-2">
                    {syncResult.errors.map((error, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-medium">{error.group}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{error.error}</div>
                          <div className="text-xs text-gray-500 mt-1">{error.action}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {syncResult.inactiveGroups.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Groups Marked as Inactive:</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {syncResult.inactiveGroups.join(', ')}
                    {syncResult.inactiveCount > syncResult.inactiveGroups.length && 
                      ` and ${syncResult.inactiveCount - syncResult.inactiveGroups.length} more`}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}