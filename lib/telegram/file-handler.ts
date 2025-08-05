import { bot } from './bot';
import { put } from '@vercel/blob';

export async function downloadAndStoreFile(fileId: string, fileName?: string) {
  try {
    if (!bot) {
      throw new Error('Telegram bot not initialized');
    }
    
    // Get file info from Telegram
    const file = await bot.telegram.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
    
    // Download file
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    // Store in Vercel Blob or local storage
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Production: Use Vercel Blob Storage
      const { url } = await put(fileName || file.file_path || 'file', blob, {
        access: 'public',
      });
      
      return { url, size: blob.size };
    } else {
      // Development: Return Telegram URL directly
      return { url: fileUrl, size: file.file_size || 0 };
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}

export async function generateThumbnail(fileUrl: string): Promise<string | null> {
  // For now, return null. In production, you could use a service like
  // Sharp or ImageMagick to generate thumbnails
  return null;
}