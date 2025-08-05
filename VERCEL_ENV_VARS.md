# Vercel Environment Variables

Copy and paste these into your Vercel project settings:

```
DATABASE_URL=postgresql://admin:P@ssw0rd@157.10.73.52:5432/plp_telegram_bot?schema=public
NEXTAUTH_URL=https://telebot.openplp.com
NEXTAUTH_SECRET=FdqSt9sEmMFnsBvzyKxh424wrhLccMtoJmS4V838/jM=
TELEGRAM_BOT_TOKEN=8307675454:AAFDatyf-qU-OnQOTZsMXZJkCjI9smT3_ho
TELEGRAM_WEBHOOK_SECRET=cf1be1187a34ee8d6a5131c741596ec068adaf11590b522fb826ac9a46865b0a
```

Note: BLOB_READ_WRITE_TOKEN is optional - only add it if you want to use Vercel Blob storage for media files.

## Steps to add in Vercel:

1. Go to https://vercel.com/dashboard
2. Select your `plp-telegram-bot` project
3. Go to Settings → Environment Variables
4. Add each variable above
5. Make sure they're enabled for Production, Preview, and Development
6. Click Save
7. Redeploy your application

## After deployment:

1. Run the webhook setup script:
   ```bash
   ./setup-webhook-prod.sh
   ```

2. Create admin user by visiting:
   https://telebot.openplp.com/api/auth/register
   
   Or run locally:
   ```bash
   DATABASE_URL="postgresql://admin:P@ssw0rd@157.10.73.52:5432/plp_telegram_bot?schema=public" npm run create:admin
   ```