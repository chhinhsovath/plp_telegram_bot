# Testing Your Telegram Bot

## Current Status ✅
- Webhook is configured correctly at: https://telebot.openplp.com/api/telegram/webhook
- Bot username: @plp_telegram_bot
- Bot can read all group messages
- No authentication errors
- Database is ready to receive data

## How to Test

### 1. Start the Monitor
```bash
npx tsx scripts/monitor-webhook.ts
```
This will show you when new groups or messages are detected.

### 2. Add Bot to a Telegram Group
1. Open Telegram
2. Go to one of your groups
3. Click the group name at the top
4. Click "Add Members"
5. Search for: @plp_telegram_bot
6. Add the bot
7. **IMPORTANT**: Make the bot an admin (for full functionality)

### 3. Send Test Messages
After adding the bot, send a few test messages in the group:
- "Hello bot!"
- "Testing 123"
- Any other messages

### 4. Check Results
The monitor script should show new groups and messages as they arrive.

You can also check:
- Dashboard: https://telebot.openplp.com/groups
- Run: `npx tsx scripts/check-telegram-data.ts`

## Troubleshooting

### Bot Not Receiving Messages?
1. Ensure bot is admin in the group
2. Check if privacy mode is disabled (run `npx tsx scripts/check-webhook-simple.ts`)
3. Try removing and re-adding the bot

### Still No Data?
Run these commands:
```bash
# Reset webhook
npx tsx scripts/reset-webhook.ts

# Force check for updates
npx tsx scripts/force-update.ts
```

## Quick Commands
- Monitor activity: `npx tsx scripts/monitor-webhook.ts`
- Check data: `npx tsx scripts/check-telegram-data.ts`
- Check webhook: `npx tsx scripts/check-webhook-simple.ts`
- Reset webhook: `npx tsx scripts/reset-webhook.ts`