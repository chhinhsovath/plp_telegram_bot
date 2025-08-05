import { Telegraf, Context } from 'telegraf';

const token = process.env.TELEGRAM_BOT_TOKEN;

// Don't throw during build time
const isBuilding = process.env.NODE_ENV === 'production' && !process.env.TELEGRAM_BOT_TOKEN && typeof window === 'undefined';

export const bot = token ? new Telegraf(token) : null as any;

// Bot commands
if (bot) {
  bot.command('start', (ctx: Context) => {
  ctx.reply(
    'Welcome to PLP Telegram Manager Bot!\n\n' +
    'Add me to your group to start collecting messages.\n\n' +
    'Commands:\n' +
    '/help - Show help message\n' +
    '/status - Check bot status\n' +
    '/info - Show group information'
  );
});

bot.command('help', (ctx: Context) => {
  ctx.reply(
    'Available commands:\n\n' +
    '/start - Start the bot\n' +
    '/help - Show this help message\n' +
    '/status - Check if bot is active in this group\n' +
    '/info - Show group information and statistics'
  );
});

bot.command('status', async (ctx: Context) => {
  if (ctx.chat?.type === 'private') {
    ctx.reply('This command only works in groups.');
    return;
  }
  
  ctx.reply('✅ Bot is active and collecting messages in this group.');
});

bot.command('info', async (ctx: Context) => {
  if (ctx.chat?.type === 'private') {
    ctx.reply('This command only works in groups.');
    return;
  }
  
  const chat = ctx.chat;
  const memberCount = await ctx.getChatMembersCount();
  
  ctx.reply(
    `📊 Group Information:\n\n` +
    `Name: ${chat?.title || 'N/A'}\n` +
    `ID: ${chat?.id || 'N/A'}\n` +
    `Type: ${chat?.type || 'N/A'}\n` +
    `Members: ${memberCount}\n`
  );
});

  // Handle errors
  bot.catch((err: any, ctx: Context) => {
    console.error(`Error for ${ctx.updateType}:`, err);
  });
}