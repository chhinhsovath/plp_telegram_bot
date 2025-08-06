#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDashboardData() {
  console.log('🔍 Testing Dashboard Data Retrieval');
  console.log('===================================\n');

  try {
    // Test the exact same queries as the dashboard API
    const [groupCount, messageCount, userCount, attachmentCount] = await Promise.all([
      prisma.telegramGroup.count({ where: { isActive: true } }),
      prisma.message.count({ where: { isDeleted: false } }),
      prisma.user.count(),
      prisma.attachment.count(),
    ]);

    console.log('📊 Dashboard Stats:');
    console.log(`   - Active Groups: ${groupCount}`);
    console.log(`   - Non-deleted Messages: ${messageCount}`);
    console.log(`   - Total Users: ${userCount}`);
    console.log(`   - Total Attachments: ${attachmentCount}`);

    const recentMessages = await prisma.message.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        group: true,
        user: true,
      },
    });

    console.log(`\n💬 Recent Messages (${recentMessages.length} found):`);
    recentMessages.forEach((msg, i) => {
      console.log(`${i + 1}. ${msg.group.title} - ${msg.telegramUsername || 'Unknown'}: ${msg.text?.substring(0, 50)}...`);
    });

    // Check if any messages are marked as deleted
    const deletedCount = await prisma.message.count({ where: { isDeleted: true } });
    console.log(`\n🗑️ Deleted Messages: ${deletedCount}`);

    // Check if any groups are marked as inactive
    const inactiveGroups = await prisma.telegramGroup.count({ where: { isActive: false } });
    console.log(`📴 Inactive Groups: ${inactiveGroups}`);

    console.log('\n✅ Dashboard data retrieval test complete!');

  } catch (error) {
    console.error('❌ Error testing dashboard data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDashboardData();