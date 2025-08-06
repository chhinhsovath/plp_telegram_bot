#!/usr/bin/env tsx

import * as dotenv from 'dotenv';
import prisma from '../lib/db';
dotenv.config();

async function monitorWebhook() {
  console.log('📡 Monitoring Telegram Bot Activity');
  console.log('===================================\n');

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!botToken) {
    console.error('❌ TELEGRAM_BOT_TOKEN not found');
    return;
  }

  // Initial data count
  let lastMessageCount = await prisma.message.count();
  let lastGroupCount = await prisma.telegramGroup.count();
  
  console.log('📊 Initial State:');
  console.log(`   - Groups: ${lastGroupCount}`);
  console.log(`   - Messages: ${lastMessageCount}`);
  console.log('\n👀 Monitoring for changes...\n');

  // Check every 5 seconds
  setInterval(async () => {
    try {
      const [currentGroups, currentMessages] = await Promise.all([
        prisma.telegramGroup.count(),
        prisma.message.count()
      ]);

      // Check for new groups
      if (currentGroups > lastGroupCount) {
        console.log(`\n🎉 NEW GROUP DETECTED!`);
        const newGroups = await prisma.telegramGroup.findMany({
          orderBy: { createdAt: 'desc' },
          take: currentGroups - lastGroupCount,
          select: {
            title: true,
            username: true,
            telegramId: true
          } as const
        });
        
        newGroups.forEach(group => {
          console.log(`   - ${group.title} (@${group.username || 'N/A'})`);
        });
        
        lastGroupCount = currentGroups;
      }

      // Check for new messages
      if (currentMessages > lastMessageCount) {
        console.log(`\n💬 NEW MESSAGES DETECTED!`);
        const newMessages = await prisma.message.findMany({
          orderBy: { createdAt: 'desc' },
          take: currentMessages - lastMessageCount,
          include: {
            user: true,
            group: true
          }
        });
        
        newMessages.forEach(msg => {
          console.log(`   - [${msg.group.title}] ${msg.user?.telegramUsername || 'Unknown'}: ${msg.text?.substring(0, 50)}${msg.text && msg.text.length > 50 ? '...' : ''}`);
        });
        
        lastMessageCount = currentMessages;
      }

      // Show heartbeat every 30 seconds
      if (Date.now() % 30000 < 5000) {
        process.stdout.write('.');
      }

    } catch (error) {
      console.error('\n❌ Error checking database:', error);
    }
  }, 5000);

  console.log('Press Ctrl+C to stop monitoring\n');

  // Check webhook status periodically
  setInterval(async () => {
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
      const info = await response.json();
      
      if (info.result?.last_error_message) {
        console.log(`\n⚠️  Webhook Error: ${info.result.last_error_message}`);
      }
    } catch (error) {
      // Silent fail for webhook check
    }
  }, 30000);
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n👋 Stopping monitor...');
  await prisma.$disconnect();
  process.exit(0);
});

monitorWebhook();