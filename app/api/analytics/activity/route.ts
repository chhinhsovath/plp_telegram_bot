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

    // Get messages for daily counts (simplified)
    const allMessages = await prisma.message.findMany({
      where: whereClause,
      select: {
        createdAt: true,
      }
    });

    // Get today's messages for hourly distribution
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayWhereClause = { ...whereClause };
    todayWhereClause.createdAt = {
      gte: today,
      lt: tomorrow
    };

    const todayMessages = await prisma.message.findMany({
      where: todayWhereClause,
      select: {
        createdAt: true,
      }
    });

    // Process daily data
    const dailyMap = new Map<string, number>();
    allMessages.forEach(message => {
      const dateStr = format(message.createdAt, "MMM dd");
      dailyMap.set(dateStr, (dailyMap.get(dateStr) || 0) + 1);
    });

    const dailyData = Array.from(dailyMap.entries()).map(([date, messages]) => ({
      date,
      messages
    }));

    // Process hourly data
    const hourlyMap = new Map<number, number>();
    todayMessages.forEach(message => {
      const hour = message.createdAt.getHours();
      hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
    });

    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      messages: hourlyMap.get(i) || 0
    }));

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