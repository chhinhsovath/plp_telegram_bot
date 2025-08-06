import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  try {
    console.log("📊 Dashboard stats API called");
    
    // Test database connection first
    try {
      await prisma.$connect();
      console.log("✅ Database connection successful");
    } catch (dbError) {
      console.error("❌ Database connection failed:", dbError);
      return NextResponse.json(
        { error: "Database connection failed", details: String(dbError) },
        { status: 500 }
      );
    }

    // Check session
    let session;
    try {
      session = await getServerSession(authOptions);
      console.log("🔍 Session check result:", session ? "authenticated" : "not authenticated");
    } catch (sessionError) {
      console.error("❌ Session error:", sessionError);
      return NextResponse.json(
        { error: "Authentication error", details: String(sessionError) },
        { status: 500 }
      );
    }

    if (!session) {
      console.log("❌ No session found, returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("✅ User authenticated:", session.user?.email);

    // Execute database queries with individual error handling
    let groupCount = 0, messageCount = 0, userCount = 0, attachmentCount = 0;
    
    try {
      console.log("📋 Fetching counts...");
      const counts = await Promise.all([
        prisma.telegramGroup.count({ where: { isActive: true } }),
        prisma.message.count({ where: { isDeleted: false } }),
        prisma.user.count(),
        prisma.attachment.count(),
      ]);
      [groupCount, messageCount, userCount, attachmentCount] = counts;
      console.log(`✅ Counts fetched - Groups: ${groupCount}, Messages: ${messageCount}, Users: ${userCount}, Attachments: ${attachmentCount}`);
    } catch (countError) {
      console.error("❌ Error fetching counts:", countError);
      return NextResponse.json(
        { error: "Failed to fetch counts", details: String(countError) },
        { status: 500 }
      );
    }

    // Fetch recent messages
    let recentMessages: any[] = [];
    try {
      console.log("💬 Fetching recent messages...");
      recentMessages = await prisma.message.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          group: true,
          user: true,
        },
      });
      console.log(`✅ Recent messages fetched: ${recentMessages.length}`);
    } catch (messageError) {
      console.error("❌ Error fetching recent messages:", messageError);
      // Continue without recent messages rather than failing completely
      console.log("⚠️ Continuing without recent messages");
    }

    // Get previous stats for comparison (7 days ago)
    let prevMessageCount = 0, prevUserCount = 0, prevAttachmentCount = 0;
    try {
      console.log("📈 Fetching previous stats...");
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      console.log(`📅 Using date: ${sevenDaysAgo.toISOString()}`);

      const prevCounts = await Promise.all([
        prisma.message.count({ 
          where: { 
            isDeleted: false,
            createdAt: { lt: sevenDaysAgo }
          } 
        }),
        prisma.user.count({ 
          where: { 
            createdAt: { lt: sevenDaysAgo }
          } 
        }),
        prisma.attachment.count({ 
          where: { 
            createdAt: { lt: sevenDaysAgo }
          } 
        }),
      ]);
      [prevMessageCount, prevUserCount, prevAttachmentCount] = prevCounts;
      console.log(`✅ Previous stats fetched - Messages: ${prevMessageCount}, Users: ${prevUserCount}, Attachments: ${prevAttachmentCount}`);
    } catch (prevError) {
      console.error("❌ Error fetching previous stats:", prevError);
      // Continue without previous stats rather than failing completely
      console.log("⚠️ Continuing without previous stats");
    }

    const result = {
      groupCount,
      messageCount,
      userCount,
      attachmentCount,
      recentMessages,
      previousStats: {
        groupCount, // Groups don't change much, use same value
        messageCount: prevMessageCount,
        userCount: prevUserCount,
        attachmentCount: prevAttachmentCount,
      }
    };

    console.log("✅ Dashboard stats API completed successfully");
    return NextResponse.json(result);

  } catch (error) {
    console.error("❌ Dashboard stats error:", error);
    console.error("❌ Error stack:", error instanceof Error ? error.stack : String(error));
    return NextResponse.json(
      { 
        error: "Failed to fetch dashboard stats", 
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}