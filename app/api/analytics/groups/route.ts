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

    const startDate = subDays(new Date(), days);

    // Get top groups by message count
    const topGroups = await prisma.message.groupBy({
      by: ['groupId'],
      where: {
        createdAt: {
          gte: startDate
        },
        isDeleted: false
      },
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

    // Get group details
    const groupIds = topGroups.map(g => g.groupId);
    const groups = await prisma.telegramGroup.findMany({
      where: {
        id: {
          in: groupIds
        }
      },
      select: {
        id: true,
        title: true,
        memberCount: true
      }
    });

    // Combine data
    const groupData = topGroups.map(tg => {
      const group = groups.find(g => g.id === tg.groupId);
      return {
        id: tg.groupId,
        name: group?.title || 'Unknown Group',
        messages: tg._count.id,
        members: group?.memberCount || 0
      };
    });

    // Get group growth data
    const groupGrowth = await prisma.telegramGroup.groupBy({
      by: ['isActive'],
      _count: {
        id: true
      }
    });

    const activeGroups = groupGrowth.find(g => g.isActive)?._count.id || 0;
    const inactiveGroups = groupGrowth.find(g => !g.isActive)?._count.id || 0;

    // Get member activity distribution
    const memberActivity = await prisma.$queryRaw<Array<{ groupId: string; activeMembers: bigint }>>`
      SELECT 
        group_id as "groupId",
        COUNT(DISTINCT telegram_user_id) as "activeMembers"
      FROM messages
      WHERE created_at >= ${startDate}
        AND is_deleted = false
      GROUP BY group_id
      ORDER BY "activeMembers" DESC
      LIMIT ${limit}
    `;

    // Enhance group data with active members
    const enhancedGroupData = groupData.map(group => {
      const activity = memberActivity.find(ma => ma.groupId === group.id);
      return {
        ...group,
        activeMembers: activity ? Number(activity.activeMembers) : 0,
        engagementRate: group.members > 0 
          ? ((activity ? Number(activity.activeMembers) : 0) / group.members * 100).toFixed(1)
          : 0
      };
    });

    return NextResponse.json({
      topGroups: enhancedGroupData,
      groupStats: {
        total: activeGroups + inactiveGroups,
        active: activeGroups,
        inactive: inactiveGroups
      }
    });

  } catch (error) {
    console.error("Analytics groups error:", error);
    return NextResponse.json(
      { error: "Failed to fetch group analytics" },
      { status: 500 }
    );
  }
}