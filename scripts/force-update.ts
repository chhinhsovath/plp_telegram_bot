#!/usr/bin/env tsx

import * as dotenv from 'dotenv';
dotenv.config();

async function forceUpdate() {
  console.log('🔄 Forcing Telegram to Send Updates');
  console.log('===================================\n');

  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    console.error('❌ TELEGRAM_BOT_TOKEN not found');
    return;
  }

  try {
    // Get updates using polling to see what's pending
    console.log('1️⃣ Getting pending updates...');
    const updatesResponse = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`);
    const updates = await updatesResponse.json();

    if (updates.ok && updates.result.length > 0) {
      console.log(`\n📨 Found ${updates.result.length} pending updates:`);
      
      updates.result.forEach((update: any, index: number) => {
        console.log(`\nUpdate ${index + 1}:`);
        if (update.message) {
          console.log(`  - From: ${update.message.from?.username || 'Unknown'}`);
          console.log(`  - Chat: ${update.message.chat.title || update.message.chat.id}`);
          console.log(`  - Text: ${update.message.text || '[No text]'}`);
          console.log(`  - Date: ${new Date(update.message.date * 1000).toLocaleString()}`);
        }
      });

      // Mark updates as read
      const lastUpdateId = updates.result[updates.result.length - 1].update_id;
      await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offset: lastUpdateId + 1 })
      });
      
      console.log('\n✅ Cleared pending updates');
    } else {
      console.log('❌ No pending updates found');
    }

    // Get webhook info
    console.log('\n2️⃣ Checking webhook status...');
    const infoResponse = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
    const info = await infoResponse.json();

    if (info.ok) {
      console.log('\n📋 Webhook Status:');
      console.log(`   - URL: ${info.result.url}`);
      console.log(`   - Pending: ${info.result.pending_update_count}`);
      console.log(`   - Last error: ${info.result.last_error_message || 'None'}`);
      
      if (info.result.last_error_date) {
        const errorDate = new Date(info.result.last_error_date * 1000);
        console.log(`   - Error time: ${errorDate.toLocaleString()}`);
      }
    }

    console.log('\n📌 Bot is ready to receive messages!');
    console.log('   Send a message in your Telegram group and it should appear in the dashboard.');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

forceUpdate();