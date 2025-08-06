'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SyncGroupsButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncMessage(null);

    try {
      const response = await fetch('/api/groups/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSyncMessage(data.message || 'Groups synced successfully');
        // Refresh the page to show updated groups
        router.refresh();
      } else {
        setSyncMessage(data.error || 'Failed to sync groups');
      }
    } catch (error) {
      setSyncMessage('Error connecting to server');
    } finally {
      setIsSyncing(false);
      // Clear message after 5 seconds
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };

  return (
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
      {syncMessage && (
        <span className={`text-sm ${syncMessage.includes('error') || syncMessage.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
          {syncMessage}
        </span>
      )}
    </div>
  );
}