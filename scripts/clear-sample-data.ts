#!/usr/bin/env tsx

import prisma from "../lib/db";

async function clearSampleData() {
  console.log('🧹 Clearing Sample Data');
  console.log('======================\n');

  const confirm = process.argv[2] === '--confirm';
  
  if (!confirm) {
    console.log('⚠️  This will delete all sample/demo data from the database.');
    console.log('   Real data from Telegram will be preserved based on Telegram IDs.');
    console.log('\n   Run with --confirm to proceed:');
    console.log('   npx tsx scripts/clear-sample-data.ts --confirm\n');
    return;
  }

  try {
    // Delete sample groups (they have fake Telegram IDs)
    console.log('1️⃣ Deleting sample groups...');
    const sampleGroups = await prisma.telegramGroup.deleteMany({
      where: {
        OR: [
          { telegramId: BigInt('-1001234567890') },
          { telegramId: BigInt('-1001234567891') },
          { telegramId: BigInt('-1001234567892') }
        ]
      }
    });
    console.log(`   ✅ Deleted ${sampleGroups.count} sample groups`);

    // Delete orphaned messages
    console.log('\n2️⃣ Cleaning up orphaned messages...');
    const orphanedMessages = await prisma.message.deleteMany({
      where: {
        group: {
          is: null
        }
      }
    });
    console.log(`   ✅ Deleted ${orphanedMessages.count} orphaned messages`);

    // Show remaining data
    console.log('\n3️⃣ Remaining data in database:');
    const [groups, messages, users] = await Promise.all([
      prisma.telegramGroup.count(),
      prisma.message.count(),
      prisma.user.count()
    ]);

    console.log(`   - Groups: ${groups}`);
    console.log(`   - Messages: ${messages}`);
    console.log(`   - Users: ${users}`);

    console.log('\n✅ Sample data cleared successfully!');
    
  } catch (error) {
    console.error('❌ Error clearing data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearSampleData();