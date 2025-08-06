import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [groupCount, messageCount, userCount, attachmentCount] = await Promise.all([
      prisma.telegramGroup.count({ where: { isActive: true } }),
      prisma.message.count({ where: { isDeleted: false } }),
      prisma.user.count(),
      prisma.attachment.count(),
    ]);

    const recentMessages = await prisma.message.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        group: true,
        user: true,
      },
    });

    // Get previous stats for comparison (7 days ago)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [prevMessageCount, prevUserCount, prevAttachmentCount] = await Promise.all([
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

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}