import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { subDays, format, startOfDay, endOfDay } from "date-fns";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "7");
    const groupId = searchParams.get("groupId");

    const startDate = startOfDay(subDays(new Date(), days - 1));
    const endDate = endOfDay(new Date());

    // Build where clause
    const whereClause: any = {
      createdAt: {
        gte: startDate,
        lte: endDate
      },
      isDeleted: false
    };

    if (groupId) {
      whereClause.groupId = groupId;
    }

    // Get daily message counts
    const dailyMessages = await prisma.$queryRaw<Array<{ date: Date; count: bigint }>>`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM messages
      WHERE created_at >= ${startDate}
        AND created_at <= ${endDate}
        AND is_deleted = false
        ${groupId ? prisma.$queryRaw`AND group_id = ${groupId}` : prisma.$queryRaw``}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    // Get hourly distribution for today
    const hourlyMessages = await prisma.$queryRaw<Array<{ hour: number; count: bigint }>>`
      SELECT 
        EXTRACT(HOUR FROM created_at) as hour,
        COUNT(*) as count
      FROM messages
      WHERE DATE(created_at) = CURRENT_DATE
        AND is_deleted = false
        ${groupId ? prisma.$queryRaw`AND group_id = ${groupId}` : prisma.$queryRaw``}
      GROUP BY hour
      ORDER BY hour ASC
    `;

    // Format data for charts
    const dailyData = dailyMessages.map(item => ({
      date: format(item.date, "MMM dd"),
      messages: Number(item.count)
    }));

    const hourlyData = Array.from({ length: 24 }, (_, i) => {
      const hourData = hourlyMessages.find(h => h.hour === i);
      return {
        hour: `${i}:00`,
        messages: hourData ? Number(hourData.count) : 0
      };
    });

    // Get message type distribution
    const messageTypes = await prisma.message.groupBy({
      by: ['messageType'],
      where: whereClause,
      _count: {
        messageType: true
      }
    });

    const typeData = messageTypes.map(type => ({
      type: type.messageType,
      count: type._count.messageType
    }));

    return NextResponse.json({
      dailyActivity: dailyData,
      hourlyDistribution: hourlyData,
      messageTypes: typeData
    });

  } catch (error) {
    console.error("Analytics activity error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity data" },
      { status: 500 }
    );
  }
}