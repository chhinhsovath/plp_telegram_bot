#!/usr/bin/env tsx

import prisma from "../lib/db";

const sampleGroups = [
  {
    telegramId: BigInt(-1001234567890),
    title: "PLP Development Team",
    username: "plp_dev",
    description: "Main development discussion group",
    memberCount: 15
  },
  {
    telegramId: BigInt(-1001234567891),
    title: "PLP General Chat",
    username: "plp_general",
    description: "General discussion and announcements",
    memberCount: 45
  },
  {
    telegramId: BigInt(-1001234567892),
    title: "PLP Support",
    username: "plp_support",
    description: "Technical support and help",
    memberCount: 23
  }
];

const sampleMessages = [
  "Hello everyone! 👋",
  "How is the project going?",
  "Just pushed the latest updates to the repo",
  "Can someone help me with the authentication flow?",
  "Great work on the new features!",
  "Meeting scheduled for tomorrow at 10 AM",
  "Please review the latest pull request",
  "Documentation has been updated",
  "Testing the new telegram integration",
  "Anyone having issues with the deployment?"
];

async function createSampleData() {
  console.log("🚀 Creating sample data...");

  try {
    // Create sample groups
    for (const groupData of sampleGroups) {
      const existingGroup = await prisma.telegramGroup.findUnique({
        where: { telegramId: groupData.telegramId }
      });

      if (!existingGroup) {
        const group = await prisma.telegramGroup.create({
          data: groupData
        });
        console.log(`✅ Created group: ${groupData.title}`);

        // Create sample messages for each group
        for (let i = 0; i < 5; i++) {
          await prisma.message.create({
            data: {
              telegramMessageId: BigInt(Date.now() + i),
              groupId: group.id,
              telegramUserId: BigInt(123456789 + i),
              telegramUsername: `user${i + 1}`,
              text: sampleMessages[Math.floor(Math.random() * sampleMessages.length)],
              messageType: "text",
              telegramDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date within last week
            }
          });
        }
        console.log(`✅ Created 5 sample messages for ${groupData.title}`);
      } else {
        console.log(`✅ Group ${groupData.title} already exists`);
      }
    }

    // Create some analytics events
    const groups = await prisma.telegramGroup.findMany();
    for (const group of groups) {
      for (let i = 0; i < 3; i++) {
        const existingEvent = await prisma.analyticsEvent.findFirst({
          where: {
            groupId: group.id,
            eventType: "message_received"
          }
        });

        if (!existingEvent) {
          await prisma.analyticsEvent.create({
            data: {
              groupId: group.id,
              eventType: "message_received",
              eventData: { messageCount: Math.floor(Math.random() * 100) + 1 },
              createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
            }
          });
        }
      }
    }

    console.log("🎉 Sample data created successfully!");
    console.log("\n📊 Sample Data Summary:");
    console.log("=======================");
    
    const totalGroups = await prisma.telegramGroup.count();
    const totalMessages = await prisma.message.count();
    const totalEvents = await prisma.analyticsEvent.count();
    
    console.log(`📱 Telegram Groups: ${totalGroups}`);
    console.log(`💬 Messages: ${totalMessages}`);
    console.log(`📈 Analytics Events: ${totalEvents}`);

  } catch (error) {
    console.error("❌ Error creating sample data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createSampleData();