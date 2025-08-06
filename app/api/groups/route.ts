import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.error('No session found for groups API');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all groups
    const groups = await prisma.telegramGroup.findMany({
      select: {
        id: true,
        telegramId: true,
        title: true,
        username: true,
        description: true,
        memberCount: true,
        isActive: true,
        botAddedAt: true,
        _count: {
          select: {
            messages: true,
            groupMembers: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Convert BigInt to string for JSON serialization
    const serializedGroups = groups.map(group => ({
      ...group,
      telegramId: group.telegramId.toString(),
    }));

    return NextResponse.json(serializedGroups);

  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch groups',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      { status: 500 }
    );
  }
}