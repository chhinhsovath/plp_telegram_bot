# Deployment Guide for Vercel

## Prerequisites

1. Vercel account
2. GitHub repository with the code
3. PostgreSQL database (can use Supabase, Neon, or any PostgreSQL provider)
4. Telegram Bot Token

## Step 1: Prepare the Repository

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/plp-telegram-web.git
git push -u origin main
```

## Step 2: Set up PostgreSQL Database

### Option A: Using Supabase (Recommended)
1. Create account at https://supabase.com
2. Create new project
3. Go to Settings > Database
4. Copy the connection string

### Option B: Using existing PostgreSQL
Use your existing database connection string

## Step 3: Deploy to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables:

```
DATABASE_URL=postgresql://user:password@host:port/database?schema=public
NEXTAUTH_URL=https://telebot.openplp.com
NEXTAUTH_SECRET=generate-a-32-character-secret
TELEGRAM_BOT_TOKEN=8307675454:AAFDatyf-qU-OnQOTZsMXZJkCjI9smT3_ho
TELEGRAM_WEBHOOK_SECRET=generate-another-secret
```

5. Click "Deploy"

## Step 4: Set up Custom Domain

1. In Vercel dashboard, go to Settings > Domains
2. Add custom domain: telebot.openplp.com
3. Follow DNS configuration instructions

## Step 5: Configure Telegram Webhook

After deployment, set up the webhook:

```bash
WEBHOOK_URL="https://telebot.openplp.com/api/telegram/webhook" npm run webhook:setup
```

Or manually using curl:

```bash
curl -X POST https://api.telegram.org/bot8307675454:AAFDatyf-qU-OnQOTZsMXZJkCjI9smT3_ho/setWebhook \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://telebot.openplp.com/api/telegram/webhook",
    "allowed_updates": ["message", "edited_message", "channel_post", "edited_channel_post", "callback_query"]
  }'
```

## Step 6: Initialize Database

1. In Vercel dashboard, go to Functions tab
2. Or run locally with production DATABASE_URL:
```bash
DATABASE_URL="your-production-db-url" npm run db:push
DATABASE_URL="your-production-db-url" npm run create:admin
```

## Step 7: Verify Deployment

1. Visit https://telebot.openplp.com
2. Login with admin credentials
3. Add bot to a Telegram group
4. Check if messages are being collected

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | PostgreSQL connection string | Yes |
| NEXTAUTH_URL | Your app URL | Yes |
| NEXTAUTH_SECRET | Random 32+ character string | Yes |
| TELEGRAM_BOT_TOKEN | Bot token from @BotFather | Yes |
| TELEGRAM_WEBHOOK_SECRET | Secret for webhook verification | No |
| BLOB_READ_WRITE_TOKEN | Vercel Blob storage token | No |

## Troubleshooting

### Bot not receiving messages
1. Check webhook status: `https://api.telegram.org/bot<token>/getWebhookInfo`
2. Verify bot is admin in group
3. Check Vercel function logs

### Database connection issues
1. Verify DATABASE_URL is correct
2. Check if database allows connections from Vercel IPs
3. Run `npx prisma db push` to sync schema

### Authentication issues
1. Verify NEXTAUTH_URL matches your domain
2. Regenerate NEXTAUTH_SECRET
3. Clear browser cookies

## Security Checklist

- [ ] Change default admin password
- [ ] Set strong NEXTAUTH_SECRET
- [ ] Enable Vercel Analytics
- [ ] Set up error monitoring (Sentry)
- [ ] Configure rate limiting
- [ ] Enable HTTPS only
- [ ] Review environment variables

## Monitoring

1. **Vercel Analytics**: Automatically enabled
2. **Function Logs**: Check Vercel dashboard
3. **Database Monitoring**: Use your database provider's tools
4. **Bot Status**: Regular webhook health checks