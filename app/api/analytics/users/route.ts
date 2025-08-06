import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
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

    // Get user growth over time
    const userGrowth = await prisma.$queryRaw<Array<{ date: Date; newUsers: bigint }>>`
      SELECT 
        DATE(created_at) as date,
        COUNT(DISTINCT telegram_user_id) as "newUsers"
      FROM messages
      WHERE created_at >= ${startDate}
        AND is_deleted = false
        ${groupId ? prisma.$queryRaw`AND group_id = ${groupId}` : prisma.$queryRaw``}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    // Get user activity patterns
    const activityPatterns = await prisma.$queryRaw<Array<{ 
      dayOfWeek: number; 
      hour: number; 
      messageCount: bigint 
    }>>`
      SELECT 
        EXTRACT(DOW FROM created_at) as "dayOfWeek",
        EXTRACT(HOUR FROM created_at) as hour,
        COUNT(*) as "messageCount"
      FROM messages
      WHERE created_at >= ${startDate}
        AND is_deleted = false
        ${groupId ? prisma.$queryRaw`AND group_id = ${groupId}` : prisma.$queryRaw``}
      GROUP BY "dayOfWeek", hour
      ORDER BY "messageCount" DESC
    `;

    // Format top contributors data
    const contributorsData = topContributors.map(user => ({
      userId: user.telegramUserId.toString(),
      username: user.telegramUsername || 'Unknown User',
      messageCount: user._count.id
    }));

    // Format user growth data
    const growthData = userGrowth.map(item => ({
      date: item.date.toISOString().split('T')[0],
      newUsers: Number(item.newUsers)
    }));

    // Create activity heatmap data
    const heatmapData = Array.from({ length: 7 }, (_, dayIndex) => {
      return Array.from({ length: 24 }, (_, hourIndex) => {
        const activity = activityPatterns.find(
          ap => ap.dayOfWeek === dayIndex && ap.hour === hourIndex
        );
        return activity ? Number(activity.messageCount) : 0;
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