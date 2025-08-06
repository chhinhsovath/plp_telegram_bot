'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FileText, File, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const sizeMap = {
    small: { width: 100, height: 141 },
    medium: { width: 200, height: 282 },
    large: { width: 300, height: 424 }
  };

  const dimensions = sizeMap[size];
  const isPDF = attachment.mimeType?.includes('pdf');
  const isWord = attachment.mimeType?.includes('word') || 
                 attachment.mimeType?.includes('document') ||
                 attachment.fileName?.toLowerCase().endsWith('.docx') ||
                 attachment.fileName?.toLowerCase().endsWith('.doc');

  // Generate a preview for PDF files
  const generatePDFThumbnail = async () => {
    if (!attachment.storageUrl || !isPDF) return;

    try {
      setLoading(true);
      // For PDF, we'll render the first page as a thumbnail
      // This will be handled by the Document component below
      setLoading(false);
    } catch (err) {
      console.error('Error generating PDF thumbnail:', err);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPDF && attachment.storageUrl) {
      generatePDFThumbnail();
    } else {
      setLoading(false);
    }
  }, [attachment.storageUrl, isPDF]);

  const onDocumentLoadSuccess = () => {
    setLoading(false);
    setError(false);
  };

  const onDocumentLoadError = () => {
    setLoading(false);
    setError(true);
  };

  // For Word documents, we'll show a styled preview
  if (isWord) {
    return (
      <div 
        className={cn(
          "relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex flex-col items-center justify-center",
          className
        )}
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
        <div className="relative z-10 flex flex-col items-center justify-center text-white p-4">
          <FileText className="w-12 h-12 mb-2" />
          <p className="text-xs font-semibold text-center line-clamp-2">
            {attachment.fileName || 'Word Document'}
          </p>
          <p className="text-xs opacity-75 mt-1">DOCX</p>
        </div>
      </div>
    );
  }

  // For PDF documents, render the first page
  if (isPDF && attachment.storageUrl) {
    return (
      <div 
        className={cn(
          "relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800",
          className
        )}
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}
        
        {error ? (
          <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-red-500 to-red-600 text-white p-4">
            <FileText className="w-12 h-12 mb-2" />
            <p className="text-xs font-semibold text-center line-clamp-2">
              {attachment.fileName || 'PDF Document'}
            </p>
            <p className="text-xs opacity-75 mt-1">PDF</p>
          </div>
        ) : (
          <Document
            file={attachment.storageUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            }
            error={
              <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-red-500 to-red-600 text-white p-4">
                <FileText className="w-12 h-12 mb-2" />
                <p className="text-xs font-semibold">Preview unavailable</p>
              </div>
            }
            className="flex items-center justify-center h-full"
          >
            <Page 
              pageNumber={1} 
              width={dimensions.width}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="shadow-lg"
            />
          </Document>
        )}
      </div>
    );
  }

  // Default document icon for other file types
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex flex-col items-center justify-center",
        className
      )}
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
      <div className="relative z-10 flex flex-col items-center justify-center text-white p-4">
        <File className="w-12 h-12 mb-2" />
        <p className="text-xs font-semibold text-center line-clamp-2">
          {attachment.fileName || 'Document'}
        </p>
        {attachment.mimeType && (
          <p className="text-xs opacity-75 mt-1">
            {attachment.mimeType.split('/').pop()?.toUpperCase()}
          </p>
        )}
      </div>
    </div>
  );
}