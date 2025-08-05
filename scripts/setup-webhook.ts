import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function setupWebhook() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const webhookUrl = process.env.WEBHOOK_URL || 'https://your-domain.com/api/telegram/webhook';
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!botToken) {
    console.error('TELEGRAM_BOT_TOKEN is required');
    process.exit(1);
  }

  const bot = new Telegraf(botToken);

  try {
    // Get bot info
    const botInfo = await bot.telegram.getMe();
    console.log('Bot info:', botInfo);

    // Set webhook
    const options: any = {
      allowed_updates: ['message', 'edited_message', 'channel_post', 'edited_channel_post', 'callback_query'],
    };

    if (webhookSecret) {
      options.secret_token = webhookSecret;
    }

    await bot.telegram.setWebhook(webhookUrl, options);
    console.log(`Webhook set to: ${webhookUrl}`);

    // Verify webhook
    const webhookInfo = await bot.telegram.getWebhookInfo();
    console.log('Webhook info:', webhookInfo);

  } catch (error) {
    console.error('Error setting up webhook:', error);
    process.exit(1);
  }

  process.exit(0);
}

setupWebhook();