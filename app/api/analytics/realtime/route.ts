import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { format } from "date-fns";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the 10 most recent messages
    const recentMessages = await prisma.message.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        group: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    // Format messages for display
    const formattedMessages = recentMessages.map((msg) => ({
      id: msg.id,
      groupName: msg.group.title,
      username: msg.telegramUsername || "Unknown User",
      messageType: msg.messageType,
      timestamp: format(msg.createdAt, "HH:mm:ss"),
    }));

    // Get current stats
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    const recentMessageCount = await prisma.message.count({
      where: {
        createdAt: {
          gte: fiveMinutesAgo,
        },
        isDeleted: false,
      },
    });

    const activeUsersRecent = await prisma.message.findMany({
      where: {
        createdAt: {
          gte: fiveMinutesAgo,
        },
        isDeleted: false,
      },
      select: {
        telegramUserId: true,
      },
      distinct: ["telegramUserId"],
    });

    return NextResponse.json({
      recentMessages: formattedMessages,
      stats: {
        messagesInLast5Min: recentMessageCount,
        activeUsersInLast5Min: activeUsersRecent.length,
      },
    });
  } catch (error) {
    console.error("Realtime analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch realtime data" },
      { status: 500 }
    );
  }
}