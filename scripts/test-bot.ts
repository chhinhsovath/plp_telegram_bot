import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!token) {
    console.error('TELEGRAM_BOT_TOKEN is not set in .env.local');
    process.exit(1);
  }
  
  const bot = new Telegraf(token);
  
  try {
    const botInfo = await bot.telegram.getMe();
    console.log('Bot Information:');
    console.log('- ID:', botInfo.id);
    console.log('- Username:', botInfo.username);
    console.log('- Name:', botInfo.first_name);
    console.log('- Can join groups:', botInfo.can_join_groups);
    console.log('- Can read messages:', botInfo.can_read_all_group_messages);
    
    const webhookInfo = await bot.telegram.getWebhookInfo();
    console.log('\nWebhook Information:');
    console.log('- URL:', webhookInfo.url || 'Not set');
    console.log('- Pending updates:', webhookInfo.pending_update_count);
    
    if (webhookInfo.last_error_date) {
      console.log('- Last error:', new Date(webhookInfo.last_error_date * 1000));
      console.log('- Error message:', webhookInfo.last_error_message);
    }
  } catch (error) {
    console.error('Error testing bot:', error);
  }
  
  process.exit(0);
}

testBot();