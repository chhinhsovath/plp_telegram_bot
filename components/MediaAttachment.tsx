'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  FileText, 
  Film, 
  Music, 
  Download, 
  Eye,
  X,
  Loader2,
  Link as LinkIcon,
  File
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface MediaAttachmentProps {
  attachment: {
    id: string;
    fileType: string;
    fileName?: string | null;
    fileSize?: bigint | null;
    storageUrl?: string | null;
    thumbnailUrl?: string | null;
    width?: number | null;
    height?: number | null;
    duration?: number | null;
    mimeType?: string | null;
  };
  className?: string;
}

export function MediaAttachment({ attachment, className }: MediaAttachmentProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'photo':
      case 'image':
        return null; // Will show actual image
      case 'video':
        return <Film className="h-8 w-8" />;
      case 'audio':
      case 'voice':
        return <Music className="h-8 w-8" />;
      case 'document':
        if (attachment.mimeType?.includes('pdf')) {
          return <FileText className="h-8 w-8" />;
        }
        return <File className="h-8 w-8" />;
      case 'link':
        return <LinkIcon className="h-8 w-8" />;
      default:
        return <File className="h-8 w-8" />;
    }
  };

  const formatFileSize = (bytes: bigint | null | undefined) => {
    if (!bytes) return '';
    const size = Number(bytes);
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const formatDuration = (seconds: number | null | undefined) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMediaPreview = () => {
    const fileType = attachment.fileType.toLowerCase();
    const url = attachment.storageUrl || attachment.thumbnailUrl;

    if (!url) {
      return (
        <div className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded">
          {getFileIcon(fileType)}
          <span className="text-sm mt-2">No preview available</span>
        </div>
      );
    }

    switch (fileType) {
      case 'photo':
      case 'image':
        return (
          <div className="relative group cursor-pointer" onClick={() => setIsPreviewOpen(true)}>
            <div className={cn(
              "relative overflow-hidden rounded-lg",
              attachment.width && attachment.height && attachment.width > attachment.height 
                ? "max-w-sm" 
                : "max-w-xs"
            )}>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              )}
              {hasError ? (
                <div className="flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded">
                  <FileText className="h-8 w-8 mb-2" />
                  <span className="text-sm">Failed to load image</span>
                </div>
              ) : (
                <Image
                  src={attachment.thumbnailUrl || url}
                  alt={attachment.fileName || 'Image'}
                  width={attachment.width || 300}
                  height={attachment.height || 200}
                  className="object-cover"
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setIsLoading(false);
                    setHasError(true);
                  }}
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="relative group">
            <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
              {attachment.thumbnailUrl ? (
                <Image
                  src={attachment.thumbnailUrl}
                  alt={attachment.fileName || 'Video thumbnail'}
                  width={attachment.width || 300}
                  height={attachment.height || 200}
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center p-8">
                  <Film className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                {formatDuration(attachment.duration)}
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => attachment.storageUrl && window.open(attachment.storageUrl, '_blank')}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 'audio':
      case 'voice':
        return (
          <div className="flex items-center space-x-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Music className="h-8 w-8 text-gray-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                {attachment.fileName || 'Audio message'}
              </p>
              <p className="text-xs text-gray-500">
                {formatDuration(attachment.duration)} • {formatFileSize(attachment.fileSize)}
              </p>
            </div>
            {attachment.storageUrl && (
              <audio controls className="max-w-xs">
                <source src={attachment.storageUrl} type={attachment.mimeType || 'audio/mpeg'} />
              </audio>
            )}
          </div>
        );

      default:
        return (
          <div className="flex items-center space-x-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {getFileIcon(fileType)}
            <div className="flex-1">
              <p className="text-sm font-medium">
                {attachment.fileName || `${fileType} file`}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(attachment.fileSize)}
              </p>
            </div>
            {attachment.storageUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(attachment.storageUrl!, '_blank')}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
    }
  };

  return (
    <>
      <div className={cn("inline-block", className)}>
        {renderMediaPreview()}
      </div>

      {/* Image Preview Dialog */}
      {(attachment.fileType === 'photo' || attachment.fileType === 'image') && (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <DialogHeader className="p-4 pb-0">
              <DialogTitle className="flex items-center justify-between">
                <span>{attachment.fileName || 'Image Preview'}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsPreviewOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="relative flex items-center justify-center p-4">
              <Image
                src={attachment.storageUrl || attachment.thumbnailUrl || ''}
                alt={attachment.fileName || 'Image'}
                width={attachment.width || 800}
                height={attachment.height || 600}
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
            <div className="flex items-center justify-between p-4 border-t">
              <span className="text-sm text-gray-500">
                {attachment.width} × {attachment.height} • {formatFileSize(attachment.fileSize)}
              </span>
              {attachment.storageUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(attachment.storageUrl!, '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}