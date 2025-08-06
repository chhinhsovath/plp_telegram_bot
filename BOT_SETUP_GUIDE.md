# 🤖 Telegram Bot Setup Guide

## ⚠️ Current Issue
Your bot (@plp_telegram_bot) is configured but **cannot read group messages** because it doesn't have the necessary permissions.

## 🔧 How to Fix

### Option 1: Enable Privacy Mode (Recommended)
1. Open Telegram and go to @BotFather
2. Send: `/mybots`
3. Select your bot: @plp_telegram_bot
4. Click "Bot Settings"
5. Click "Group Privacy"
6. Click "Turn off" to disable privacy mode

This allows your bot to read ALL messages in groups, not just commands.

### Option 2: Make Bot Admin in Each Group
If you can't disable privacy mode, make the bot an admin:

1. Open your Telegram group
2. Click the group name at the top
3. Click "Administrators"
4. Click "Add Administrator"
5. Search for @plp_telegram_bot
6. Give it these permissions:
   - ✅ Delete messages
   - ✅ Ban users (optional)
   - ✅ Add new admins (optional)

## 📱 Adding Bot to Groups

1. Open the Telegram group
2. Click group name → "Add Members"
3. Search for: @plp_telegram_bot
4. Add the bot
5. Make it admin (if privacy mode is on)

## 🧹 Clean Sample Data

Run this command to remove the demo data:
```bash
npx tsx scripts/clear-sample-data.ts --confirm
```

## ✅ Verify It's Working

1. Send a test message in your group
2. Check the dashboard: https://telebot.openplp.com/groups
3. Or run: `npx tsx scripts/check-telegram-data.ts`

## 🔍 Troubleshooting

### Bot not receiving messages?
- Check webhook status: `npx tsx scripts/check-webhook-simple.ts`
- Verify bot is admin in the group
- Ensure privacy mode is disabled

### Still seeing sample data?
- Clear it with: `npx tsx scripts/clear-sample-data.ts --confirm`
- Refresh the dashboard

### Need to check logs?
- Webhook logs: Check Vercel function logs
- Local testing: `npm run bot:dev` (uses polling mode)

## 📊 What Data is Collected

When properly configured, the bot collects:
- Group information (name, ID, member count)
- Messages (text, sender, timestamp)
- Media files (photos, videos, documents)
- Member join/leave events

## 🔐 Privacy Note

The bot only collects data from groups where it's been added. It cannot access:
- Private messages (unless sent directly to the bot)
- Groups where it's not a member
- Messages sent before it joined the group