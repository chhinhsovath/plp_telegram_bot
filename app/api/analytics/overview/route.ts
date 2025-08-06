import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { startOfToday, startOfYesterday, subDays, subWeeks, startOfDay } from "date-fns";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = startOfToday();
    const yesterday = startOfYesterday();
    const lastWeek = subWeeks(today, 1);
    const last30Days = subDays(today, 30);

    // Get messages today
    const messagestoday = await prisma.message.count({
      where: {
        createdAt: {
          gte: today
        },
        isDeleted: false
      }
    });

    // Get messages yesterday
    const messagesYesterday = await prisma.message.count({
      where: {
        createdAt: {
          gte: yesterday,
          lt: today
        },
        isDeleted: false
      }
    });

    // Calculate percentage change
    const messageChange = messagesYesterday > 0 
      ? ((messagestoday - messagesYesterday) / messagesYesterday * 100).toFixed(1)
      : messagestoday > 0 ? 100 : 0;

    // Get active users today
    const activeUsersToday = await prisma.message.findMany({
      where: {
        createdAt: {
          gte: today
        },
        isDeleted: false
      },
      select: {
        telegramUserId: true
      },
      distinct: ['telegramUserId']
    });

    // Get active users last week
    const activeUsersLastWeek = await prisma.message.findMany({
      where: {
        createdAt: {
          gte: lastWeek,
          lt: today
        },
        isDeleted: false
      },
      select: {
        telegramUserId: true
      },
      distinct: ['telegramUserId']
    });

    const userChange = activeUsersLastWeek.length > 0
      ? ((activeUsersToday.length - activeUsersLastWeek.length) / activeUsersLastWeek.length * 100).toFixed(1)
      : activeUsersToday.length > 0 ? 100 : 0;

    // Get average messages per day (last 30 days)
    const totalMessagesLast30Days = await prisma.message.count({
      where: {
        createdAt: {
          gte: last30Days
        },
        isDeleted: false
      }
    });

    const avgMessagesPerDay = Math.round(totalMessagesLast30Days / 30);

    // Get peak hour
    const hourlyMessages = await prisma.$queryRaw<Array<{ hour: number; count: bigint }>>`
      SELECT 
        EXTRACT(HOUR FROM created_at) as hour,
        COUNT(*) as count
      FROM messages
      WHERE created_at >= ${last30Days}
        AND is_deleted = false
      GROUP BY hour
      ORDER BY count DESC
      LIMIT 1
    `;

    const peakHour = hourlyMessages[0]?.hour ?? null;

    return NextResponse.json({
      messagestoday,
      messageChange: Number(messageChange),
      activeUsersCount: activeUsersToday.length,
      userChange: Number(userChange),
      avgMessagesPerDay,
      peakHour: peakHour !== null ? `${peakHour}:00` : '-'
    });

  } catch (error) {
    console.error("Analytics overview error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}