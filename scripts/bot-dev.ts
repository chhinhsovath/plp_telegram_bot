import { bot } from '../lib/telegram/bot';
import { handleMessage, handleMemberJoin, handleMemberLeft, handleBotAddedToGroup } from '../lib/telegram/handlers';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!bot) {
  console.error('❌ Bot not initialized. Check your TELEGRAM_BOT_TOKEN environment variable.');
  process.exit(1);
}

// Set up message handlers
bot.on('message', handleMessage);
bot.on('new_chat_members', handleMemberJoin);
bot.on('left_chat_member', handleMemberLeft);
bot.on('my_chat_member', handleBotAddedToGroup);

// Start bot in polling mode
bot.launch().then(() => {
  console.log('Bot started in polling mode');
  console.log('Bot username:', bot!.botInfo?.username);
});

// Enable graceful stop
process.once('SIGINT', () => bot!.stop('SIGINT'));
process.once('SIGTERM', () => bot!.stop('SIGTERM'));