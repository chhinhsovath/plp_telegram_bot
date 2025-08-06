#!/usr/bin/env tsx

import * as dotenv from 'dotenv';
dotenv.config();

async function checkWebhookStatus() {
  console.log('🔍 Checking Telegram Bot Webhook Status');
  console.log('======================================\n');

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const baseUrl = process.env.NEXTAUTH_URL || 'https://telebot.openplp.com';
  const webhookUrl = `${baseUrl}/api/telegram/webhook`;

  if (!botToken) {
    console.error('❌ TELEGRAM_BOT_TOKEN not found in environment variables');
    return;
  }

  try {
    // 1. Get current webhook info
    console.log('1️⃣ Getting current webhook info...');
    const infoResponse = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
    const info = await infoResponse.json();

    if (!info.ok) {
      console.error('❌ Failed to get webhook info:', info.description);
      return;
    }

    console.log('\n📋 Current Webhook Status:');
    console.log(`   - URL: ${info.result.url || 'Not set'}`);
    console.log(`   - Has custom certificate: ${info.result.has_custom_certificate}`);
    console.log(`   - Pending updates: ${info.result.pending_update_count}`);
    console.log(`   - Max connections: ${info.result.max_connections || 40}`);
    
    if (info.result.last_error_date) {
      const errorDate = new Date(info.result.last_error_date * 1000);
      console.log(`   - Last error: ${info.result.last_error_message} (${errorDate.toLocaleString()})`);
    }

    // 2. Check if webhook needs to be set
    if (!info.result.url || info.result.url !== webhookUrl) {
      console.log('\n⚠️  Webhook not set or incorrect URL');
      console.log(`   Expected: ${webhookUrl}`);
      console.log(`   Current: ${info.result.url || 'None'}`);
      
      console.log('\n2️⃣ Setting webhook...');
      const setResponse = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: webhookUrl,
          secret_token: webhookSecret,
          allowed_updates: ['message', 'edited_message', 'channel_post', 'edited_channel_post', 'my_chat_member', 'chat_member']
        })
      });
      
      const setResult = await setResponse.json();
      if (setResult.ok) {
        console.log('✅ Webhook set successfully!');
      } else {
        console.error('❌ Failed to set webhook:', setResult.description);
      }
    } else {
      console.log('\n✅ Webhook is correctly configured');
    }

    // 3. Get bot info
    console.log('\n3️⃣ Getting bot info...');
    const meResponse = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    const me = await meResponse.json();

    if (me.ok) {
      console.log('\n🤖 Bot Information:');
      console.log(`   - Username: @${me.result.username}`);
      console.log(`   - Name: ${me.result.first_name}`);
      console.log(`   - ID: ${me.result.id}`);
      console.log(`   - Can join groups: ${me.result.can_join_groups}`);
      console.log(`   - Can read all messages: ${me.result.can_read_all_group_messages}`);
    }

    // 4. Instructions
    console.log('\n📌 Next Steps:');
    console.log('1. Make sure your bot is added to Telegram groups');
    console.log('2. Ensure the bot has admin privileges in the groups');
    console.log('3. Send some test messages in the groups');
    console.log('4. Check the webhook endpoint is accessible');
    console.log('\n💡 To add the bot to a group:');
    console.log(`   - Open the group in Telegram`);
    console.log(`   - Click group name → Add Members`);
    console.log(`   - Search for @${me.result?.username || 'your_bot'}`);
    console.log(`   - Make the bot an admin for full functionality`);

  } catch (error) {
    console.error('❌ Error checking webhook:', error);
  }
}

checkWebhookStatus();