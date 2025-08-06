'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PhotoThumbnailProps {
  attachment: {
    id: string;
    fileType: string;
    fileName?: string | null;
    storageUrl?: string | null;
    thumbnailUrl?: string | null;
    width?: number | null;
    height?: number | null;
  };
  size?: 'small' | 'medium' | 'large';
  showHoverPreview?: boolean;
}

export function PhotoThumbnail({ 
  attachment, 
  size = 'small',
  showHoverPreview = true 
}: PhotoThumbnailProps) {
  const [isFullView, setIsFullView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    small: 'h-20 w-20',
    medium: 'h-32 w-32',
    large: 'h-48 w-48'
  };

  const imageUrl = attachment.storageUrl || attachment.thumbnailUrl || `/api/files/${attachment.id}`;

  if (attachment.fileType !== 'photo' && attachment.fileType !== 'image') {
    return null;
  }

  const thumbnail = (
    <div 
      className={`${sizeClasses[size]} bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all`}
      onClick={() => setIsFullView(true)}
    >
      {hasError ? (
        <div className="h-full w-full flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-gray-400" />
        </div>
      ) : (
        <div className="relative h-full w-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-6 w-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            </div>
          )}
          <Image
            src={imageUrl}
            alt={attachment.fileName || 'Photo'}
            fill
            className="object-cover"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            unoptimized
          />
        </div>
      )}
    </div>
  );

  return (
    <>
      {showHoverPreview ? (
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              {thumbnail}
            </TooltipTrigger>
            <TooltipContent side="top" className="p-0 border-0">
              <div className="relative">
                <Image
                  src={imageUrl}
                  alt={attachment.fileName || 'Photo preview'}
                  width={300}
                  height={200}
                  className="rounded-md max-h-[300px] object-contain"
                  unoptimized
                />
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        thumbnail
      )}

      {/* Full View Dialog */}
      <Dialog open={isFullView} onOpenChange={setIsFullView}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <div className="relative flex items-center justify-center p-4">
            <Image
              src={imageUrl}
              alt={attachment.fileName || 'Photo'}
              width={attachment.width || 800}
              height={attachment.height || 600}
              className="max-w-full max-h-[80vh] object-contain"
              unoptimized
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}