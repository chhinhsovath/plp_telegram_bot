# Media Handling in PLP Telegram Bot

## Overview

The platform handles media files (photos, videos, documents) from Telegram groups with a fallback system to ensure media is always accessible.

## How It Works

### 1. Message Reception
When a message with media is received via webhook:
- The file metadata is stored in the `attachments` table
- The `telegramFileId` is always saved (required for Telegram API access)
- If Vercel Blob storage is configured, the file is downloaded and stored
- The `storageUrl` is saved if storage is successful

### 2. Media Display
When displaying media in the UI:
1. **Primary**: Use `storageUrl` if available (Vercel Blob Storage)
2. **Fallback**: Use `/api/files/{id}` endpoint which:
   - Checks for `storageUrl` first
   - Falls back to fetching from Telegram API
   - Attempts to store the file for future use

### 3. File Access Flow
```
User requests image → MediaAttachment component
  ↓
Check storageUrl exists?
  ├─ Yes → Use storageUrl directly
  └─ No → Use /api/files/{id}
           ↓
         API endpoint:
           ├─ Has storageUrl? → Redirect to it
           └─ No storageUrl? → Fetch from Telegram
                               ├─ Success → Redirect to Telegram URL
                               └─ Fail → Try to store & redirect
```

## Configuration

### Environment Variables
- `TELEGRAM_BOT_TOKEN`: Required for accessing Telegram files
- `BLOB_READ_WRITE_TOKEN`: Optional, enables Vercel Blob Storage

### Next.js Image Configuration
The `next.config.ts` allows images from:
- `api.telegram.org` - Direct Telegram file access
- `*.public.blob.vercel-storage.com` - Vercel Blob Storage
- `api.dicebear.com` - Avatar generation

## Troubleshooting

### "Failed to load image" Error
This can happen when:
1. The Telegram file has expired (files are only available for ~1 hour)
2. The bot token is invalid
3. The file was deleted from Telegram

### Fixing Missing Media
Run the fix script to attempt re-downloading missing media:
```bash
npm run fix:media
```

### Testing Media Access
To verify media files are accessible:
```bash
npm run test:media
```

## Best Practices

1. **Always store telegramFileId**: This is the minimum required to access files
2. **Enable Blob Storage in Production**: Telegram file URLs expire, storage URLs don't
3. **Handle errors gracefully**: Show placeholder images when files can't be loaded
4. **Monitor file sizes**: Large files may fail to upload to Blob Storage

## Security Considerations

- File access requires authentication (NextAuth session)
- Files are served through the API, not directly exposed
- Telegram file URLs are temporary and expire
- Stored files in Blob Storage are public but URLs are unguessable