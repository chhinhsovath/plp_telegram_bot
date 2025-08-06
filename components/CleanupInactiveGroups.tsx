'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

interface DeletedGroup {
  title: string;
  messageCount: number;
}

export function CleanupInactiveGroups() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteResult, setDeleteResult] = useState<{
    success: boolean;
    deletedCount: number;
    deletedGroups: DeletedGroup[];
    message: string;
  } | null>(null);
  const router = useRouter();

  const handleCleanup = async () => {
    setIsDeleting(true);
    setDeleteResult(null);

    try {
      const response = await fetch('/api/groups/cleanup', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setDeleteResult(data);
        // Refresh the page to show updated groups list
        router.refresh();
      } else {
        setDeleteResult({
          success: false,
          deletedCount: 0,
          deletedGroups: [],
          message: data.error || 'Failed to cleanup groups',
        });
      }
    } catch (error) {
      setDeleteResult({
        success: false,
        deletedCount: 0,
        deletedGroups: [],
        message: 'Error connecting to server',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="destructive"
        size="sm"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Cleanup Inactive
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Cleanup Inactive Groups
            </DialogTitle>
            <DialogDescription>
              This will permanently delete all inactive groups and their associated data.
            </DialogDescription>
          </DialogHeader>

          {!deleteResult ? (
            <>
              <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  This action cannot be undone. All messages, attachments, and analytics data 
                  for inactive groups will be permanently deleted.
                </AlertDescription>
              </Alert>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCleanup}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Inactive Groups'}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <Alert 
                className={deleteResult.success 
                  ? "border-green-200 bg-green-50 dark:bg-green-900/20" 
                  : "border-red-200 bg-red-50 dark:bg-red-900/20"
                }
              >
                <AlertTitle>
                  {deleteResult.success ? 'Cleanup Complete' : 'Cleanup Failed'}
                </AlertTitle>
                <AlertDescription>{deleteResult.message}</AlertDescription>
              </Alert>

              {deleteResult.deletedGroups.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Deleted Groups:</h4>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {deleteResult.deletedGroups.map((group, index) => (
                      <div key={index} className="flex justify-between text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span>{group.title}</span>
                        <span className="text-gray-500">
                          {group.messageCount} message{group.messageCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button onClick={() => {
                  setIsOpen(false);
                  setDeleteResult(null);
                }}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}