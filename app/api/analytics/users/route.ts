import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { subDays } from "date-fns";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "7");
    const limit = parseInt(searchParams.get("limit") || "10");
    const groupId = searchParams.get("groupId");

    const startDate = subDays(new Date(), days);

    // Build where clause
    const whereClause: any = {
      createdAt: {
        gte: startDate
      },
      isDeleted: false
    };

    if (groupId) {
      whereClause.groupId = groupId;
    }

    // Get top contributors
    const topContributors = await prisma.message.groupBy({
      by: ['telegramUserId', 'telegramUsername'],
      where: whereClause,
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: limit
    });

    // Get messages for user growth analysis (simplified)
    const recentMessages = await prisma.message.findMany({
      where: whereClause,
      select: {
        createdAt: true,
        telegramUserId: true,
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Get messages for activity patterns (simplified)
    const allMessages = await prisma.message.findMany({
      where: whereClause,
      select: {
        createdAt: true,
      }
    });

    // Format top contributors data
    const contributorsData = topContributors.map(user => ({
      userId: user.telegramUserId.toString(),
      username: user.telegramUsername || 'Unknown User',
      messageCount: user._count.id
    }));

    // Process user growth data (simplified)
    const growthByDay = new Map<string, Set<string>>();
    recentMessages.forEach(message => {
      const dateStr = message.createdAt.toISOString().split('T')[0];
      if (!growthByDay.has(dateStr)) {
        growthByDay.set(dateStr, new Set());
      }
      growthByDay.get(dateStr)!.add(message.telegramUserId.toString());
    });

    const growthData = Array.from(growthByDay.entries()).map(([date, userIds]) => ({
      date,
      newUsers: userIds.size
    })).sort((a, b) => a.date.localeCompare(b.date));

    // Process activity patterns (simplified)
    const activityMap = new Map<string, number>();
    allMessages.forEach(message => {
      const date = new Date(message.createdAt);
      const dayOfWeek = date.getDay();
      const hour = date.getHours();
      const key = `${dayOfWeek}-${hour}`;
      activityMap.set(key, (activityMap.get(key) || 0) + 1);
    });

    // Create activity heatmap data
    const heatmapData = Array.from({ length: 7 }, (_, dayIndex) => {
      return Array.from({ length: 24 }, (_, hourIndex) => {
        const key = `${dayIndex}-${hourIndex}`;
        return activityMap.get(key) || 0;
      });
    });

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return NextResponse.json({
      topContributors: contributorsData,
      userGrowth: growthData,
      activityHeatmap: {
        data: heatmapData,
        days: daysOfWeek,
        hours: Array.from({ length: 24 }, (_, i) => `${i}:00`)
      }
    });

  } catch (error) {
    console.error("Analytics users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user analytics" },
      { status: 500 }
    );
  }
}