import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const startTime = Date.now();
  const logs: string[] = [];
  
  try {
    logs.push(`🐛 Debug stats API called at ${new Date().toISOString()}`);
    
    // Test 1: Basic database connection
    logs.push("1️⃣ Testing database connection...");
    try {
      await prisma.$connect();
      logs.push("✅ Database connection successful");
    } catch (dbError) {
      logs.push(`❌ Database connection failed: ${dbError}`);
      return NextResponse.json({ logs, error: "Database connection failed" });
    }

    // Test 2: Simple count queries
    logs.push("2️⃣ Testing simple count queries...");
    try {
      const groupCount = await prisma.telegramGroup.count();
      logs.push(`✅ Total groups: ${groupCount}`);
      
      const activeGroupCount = await prisma.telegramGroup.count({ where: { isActive: true } });
      logs.push(`✅ Active groups: ${activeGroupCount}`);
      
      const messageCount = await prisma.message.count();
      logs.push(`✅ Total messages: ${messageCount}`);
      
      const nonDeletedMessageCount = await prisma.message.count({ where: { isDeleted: false } });
      logs.push(`✅ Non-deleted messages: ${nonDeletedMessageCount}`);
      
      const userCount = await prisma.user.count();
      logs.push(`✅ Total users: ${userCount}`);
      
      const attachmentCount = await prisma.attachment.count();
      logs.push(`✅ Total attachments: ${attachmentCount}`);
      
    } catch (countError) {
      logs.push(`❌ Count query failed: ${countError}`);
      return NextResponse.json({ logs, error: "Count query failed", details: String(countError) });
    }

    // Test 3: Recent messages query
    logs.push("3️⃣ Testing recent messages query...");
    try {
      const recentMessages = await prisma.message.findMany({
        take: 3,
        orderBy: { createdAt: "desc" },
        include: {
          group: true,
          user: true,
        },
      });
      logs.push(`✅ Recent messages query successful: ${recentMessages.length} messages`);
      
      // Log message details
      recentMessages.forEach((msg, index) => {
        logs.push(`   Message ${index + 1}: ${msg.group.title} - ${msg.telegramUsername || 'Unknown'}`);
      });
      
    } catch (messageError) {
      logs.push(`❌ Recent messages query failed: ${messageError}`);
      return NextResponse.json({ logs, error: "Recent messages query failed", details: String(messageError) });
    }

    // Test 4: Date-based queries
    logs.push("4️⃣ Testing date-based queries...");
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      logs.push(`   Using date filter: ${sevenDaysAgo.toISOString()}`);

      const oldMessageCount = await prisma.message.count({ 
        where: { 
          isDeleted: false,
          createdAt: { lt: sevenDaysAgo }
        } 
      });
      logs.push(`✅ Old messages: ${oldMessageCount}`);
      
      const oldUserCount = await prisma.user.count({ 
        where: { 
          createdAt: { lt: sevenDaysAgo }
        } 
      });
      logs.push(`✅ Old users: ${oldUserCount}`);
      
    } catch (dateError) {
      logs.push(`❌ Date-based query failed: ${dateError}`);
      return NextResponse.json({ logs, error: "Date-based query failed", details: String(dateError) });
    }

    const endTime = Date.now();
    logs.push(`✅ All debug tests completed in ${endTime - startTime}ms`);

    return NextResponse.json({ 
      status: "success",
      logs,
      executionTime: endTime - startTime,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    const endTime = Date.now();
    logs.push(`❌ Unexpected error: ${error}`);
    
    return NextResponse.json(
      { 
        status: "error",
        logs,
        error: error instanceof Error ? error.message : String(error),
        executionTime: endTime - startTime,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}