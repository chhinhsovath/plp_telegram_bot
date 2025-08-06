#!/usr/bin/env tsx

import * as dotenv from 'dotenv';
dotenv.config();

async function resetWebhook() {
  console.log('🔄 Resetting Telegram Webhook');
  console.log('=============================\n');

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const baseUrl = process.env.NEXTAUTH_URL || 'https://telebot.openplp.com';
  const webhookUrl = `${baseUrl}/api/telegram/webhook`;

  if (!botToken) {
    console.error('❌ TELEGRAM_BOT_TOKEN not found');
    return;
  }

  try {
    // 1. Delete webhook to clear pending updates
    console.log('1️⃣ Deleting current webhook...');
    const deleteResponse = await fetch(`https://api.telegram.org/bot${botToken}/deleteWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drop_pending_updates: true })
    });
    
    const deleteResult = await deleteResponse.json();
    if (deleteResult.ok) {
      console.log('✅ Webhook deleted successfully');
    } else {
      console.error('❌ Failed to delete webhook:', deleteResult.description);
      return;
    }

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 2. Set webhook again without secret for now
    console.log('\n2️⃣ Setting new webhook...');
    const setResponse = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ['message', 'edited_message', 'channel_post', 'edited_channel_post', 'my_chat_member', 'chat_member']
      })
    });
    
    const setResult = await setResponse.json();
    if (setResult.ok) {
      console.log('✅ Webhook set successfully!');
    } else {
      console.error('❌ Failed to set webhook:', setResult.description);
      return;
    }

    // 3. Get webhook info
    console.log('\n3️⃣ Verifying webhook status...');
    const infoResponse = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
    const info = await infoResponse.json();

    if (info.ok) {
      console.log('\n📋 New Webhook Status:');
      console.log(`   - URL: ${info.result.url}`);
      console.log(`   - Pending updates: ${info.result.pending_update_count}`);
      console.log(`   - Last error: ${info.result.last_error_message || 'None'}`);
    }

    console.log('\n✅ Webhook reset complete!');
    console.log('\n📌 Next steps:');
    console.log('1. Send a test message in your Telegram group');
    console.log('2. Wait a few seconds');
    console.log('3. Check the dashboard: https://telebot.openplp.com/groups');
    console.log('4. Or run: npx tsx scripts/check-telegram-data.ts');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

resetWebhook();