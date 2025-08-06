#!/usr/bin/env tsx

import prisma from "../lib/db";

async function checkTelegramData() {
  console.log('🔍 Checking Telegram Bot Data Collection');
  console.log('=======================================\n');

  try {
    // 1. Check Telegram Groups
    console.log('1️⃣ Checking Telegram Groups in Database:');
    const groups = await prisma.telegramGroup.findMany({
      include: {
        _count: {
          select: {
            messages: true,
            groupMembers: true
          }
        }
      }
    });

    if (groups.length === 0) {
      console.log('❌ No groups found in database');
    } else {
      console.log(`✅ Found ${groups.length} groups:\n`);
      groups.forEach(group => {
        console.log(`📱 Group: ${group.title}`);
        console.log(`   - Telegram ID: ${group.telegramId}`);
        console.log(`   - Username: ${group.username || 'N/A'}`);
        console.log(`   - Messages: ${group._count.messages}`);
        console.log(`   - Members: ${group._count.groupMembers}`);
        console.log(`   - Active: ${group.isActive}`);
        console.log(`   - Added: ${group.botAddedAt}`);
        console.log('');
      });
    }

    // 2. Check Messages
    console.log('\n2️⃣ Checking Recent Messages:');
    const messages = await prisma.message.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        group: true
      }
    });

    if (messages.length === 0) {
      console.log('❌ No messages found in database');
    } else {
      console.log(`✅ Found ${messages.length} recent messages:\n`);
      messages.forEach(msg => {
        console.log(`💬 Message in ${msg.group.title}:`);
        console.log(`   - From: ${msg.telegramUsername || 'Unknown'}`);
        console.log(`   - Text: ${msg.text?.substring(0, 50)}...`);
        console.log(`   - Type: ${msg.messageType}`);
        console.log(`   - Date: ${msg.telegramDate}`);
        console.log('');
      });
    }

    // 3. Check Bot webhook status
    console.log('\n3️⃣ Checking Webhook Configuration:');
    console.log(`   - Bot Token: ${process.env.TELEGRAM_BOT_TOKEN ? '✅ Configured' : '❌ Missing'}`);
    console.log(`   - Webhook Secret: ${process.env.TELEGRAM_WEBHOOK_SECRET ? '✅ Configured' : '❌ Missing'}`);
    console.log(`   - Webhook URL: ${process.env.NEXTAUTH_URL || 'Not set'}/api/telegram/webhook`);

    // 4. Check for sample data
    console.log('\n4️⃣ Checking for Sample/Demo Data:');
    const sampleGroups = await prisma.telegramGroup.findMany({
      where: {
        OR: [
          { title: { contains: 'PLP Support' } },
          { title: { contains: 'PLP General Chat' } },
          { title: { contains: 'PLP Development Team' } }
        ]
      }
    });

    if (sampleGroups.length > 0) {
      console.log('⚠️  Found sample/demo groups in database. These might be from seed data.');
    }

    // 5. Database summary
    console.log('\n5️⃣ Database Summary:');
    const counts = await Promise.all([
      prisma.telegramGroup.count(),
      prisma.message.count(),
      prisma.user.count(),
      prisma.attachment.count()
    ]);

    console.log(`   - Total Groups: ${counts[0]}`);
    console.log(`   - Total Messages: ${counts[1]}`);
    console.log(`   - Total Users: ${counts[2]}`);
    console.log(`   - Total Attachments: ${counts[3]}`);

  } catch (error) {
    console.error('❌ Error checking data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTelegramData();