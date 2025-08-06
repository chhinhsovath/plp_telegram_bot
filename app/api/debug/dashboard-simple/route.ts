import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// Temporary debug endpoint without authentication to test if that's the issue
export async function GET() {
  try {
    console.log("🐛 Debug dashboard (no auth) called");

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
        group: {
          select: {
            title: true,
          }
        },
        user: {
          select: {
            name: true,
          }
        },
      },
    });

    const result = {
      groupCount,
      messageCount,
      userCount,
      attachmentCount,
      recentMessages: recentMessages.map(msg => ({
        id: msg.id,
        text: msg.text?.substring(0, 100) + (msg.text && msg.text.length > 100 ? '...' : ''),
        messageType: msg.messageType,
        telegramUsername: msg.telegramUsername,
        createdAt: msg.createdAt,
        group: { title: msg.group.title },
        user: msg.user ? { name: msg.user.name } : null,
      })),
      previousStats: {
        groupCount: groupCount,
        messageCount: 0,
        userCount: 0,
        attachmentCount: 0,
      },
      debug: true,
      timestamp: new Date().toISOString()
    };

    console.log("✅ Debug dashboard successful:", { groupCount, messageCount, userCount, attachmentCount });
    return NextResponse.json(result);

  } catch (error) {
    console.error("❌ Debug dashboard error:", error);
    return NextResponse.json(
      { 
        error: "Debug dashboard failed", 
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}