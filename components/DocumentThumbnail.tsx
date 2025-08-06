'use client';

import { FileText, File, FileSpreadsheet, Presentation } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentThumbnailProps {
  attachment: {
    id: string;
    fileType: string;
    fileName?: string | null;
    mimeType?: string | null;
    storageUrl?: string | null;
  };
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function DocumentThumbnail({ attachment, size = 'medium', className }: DocumentThumbnailProps) {
  const sizeMap = {
    small: { width: 100, height: 141, iconSize: 32, fontSize: 'text-xs' },
    medium: { width: 200, height: 282, iconSize: 48, fontSize: 'text-sm' },
    large: { width: 300, height: 424, iconSize: 64, fontSize: 'text-base' }
  };

  const dimensions = sizeMap[size];
  
  // Determine file type
  const isPDF = attachment.mimeType?.includes('pdf') || 
                attachment.fileName?.toLowerCase().endsWith('.pdf');
  const isWord = attachment.mimeType?.includes('word') || 
                 attachment.mimeType?.includes('document') ||
                 attachment.fileName?.toLowerCase().endsWith('.docx') ||
                 attachment.fileName?.toLowerCase().endsWith('.doc');
  const isExcel = attachment.mimeType?.includes('excel') || 
                  attachment.mimeType?.includes('spreadsheet') ||
                  attachment.fileName?.toLowerCase().endsWith('.xlsx') ||
                  attachment.fileName?.toLowerCase().endsWith('.xls');
  const isPowerPoint = attachment.mimeType?.includes('powerpoint') || 
                       attachment.mimeType?.includes('presentation') ||
                       attachment.fileName?.toLowerCase().endsWith('.pptx') ||
                       attachment.fileName?.toLowerCase().endsWith('.ppt');

  // Get appropriate icon and styling
  const getDocumentStyle = () => {
    if (isPDF) {
      return {
        icon: FileText,
        gradient: 'from-red-500 to-red-600',
        label: 'PDF',
        iconColor: 'text-white'
      };
    }
    if (isWord) {
      return {
        icon: FileText,
        gradient: 'from-blue-500 to-blue-600',
        label: 'DOCX',
        iconColor: 'text-white'
      };
    }
    if (isExcel) {
      return {
        icon: FileSpreadsheet,
        gradient: 'from-green-500 to-green-600',
        label: 'XLSX',
        iconColor: 'text-white'
      };
    }
    if (isPowerPoint) {
      return {
        icon: Presentation,
        gradient: 'from-orange-500 to-orange-600',
        label: 'PPTX',
        iconColor: 'text-white'
      };
    }
    return {
      icon: File,
      gradient: 'from-purple-500 to-purple-600',
      label: attachment.mimeType?.split('/').pop()?.toUpperCase() || 'FILE',
      iconColor: 'text-white'
    };
  };

  const style = getDocumentStyle();
  const Icon = style.icon;

  // For PDF files, we can show an iframe preview
  if (isPDF && attachment.storageUrl && size === 'large') {
    return (
      <div 
        className={cn(
          "relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800",
          className
        )}
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <iframe
          src={`${attachment.storageUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
          className="w-full h-full"
          style={{ border: 'none' }}
          title={attachment.fileName || 'PDF Preview'}
        />
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
          <p className={cn("text-white font-semibold text-center line-clamp-1", dimensions.fontSize)}>
            {attachment.fileName || 'PDF Document'}
          </p>
        </div>
      </div>
    );
  }

  // For all other documents, show a styled icon preview
  return (
    <div 
      className={cn(
        `relative overflow-hidden rounded-lg bg-gradient-to-br ${style.gradient} flex flex-col items-center justify-center shadow-lg`,
        className
      )}
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
      <div className="relative z-10 flex flex-col items-center justify-center text-white p-4">
        <Icon 
          className={cn("mb-3", style.iconColor)} 
          style={{ width: dimensions.iconSize, height: dimensions.iconSize }}
        />
        <p className={cn("font-semibold text-center line-clamp-2 mb-1", dimensions.fontSize)}>
          {attachment.fileName || 'Document'}
        </p>
        <p className={cn("opacity-75", dimensions.fontSize === 'text-xs' ? 'text-xs' : 'text-sm')}>
          {style.label}
        </p>
      </div>
    </div>
  );
}