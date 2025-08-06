import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function DELETE(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin users can delete groups
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Get all inactive groups
    const inactiveGroups = await prisma.telegramGroup.findMany({
      where: { isActive: false },
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            messages: true,
          },
        },
      },
    });

    if (inactiveGroups.length === 0) {
      return NextResponse.json({
        success: true,
        deletedCount: 0,
        message: 'No inactive groups found',
      });
    }

    // Delete inactive groups and all related data (messages, attachments, etc.)
    // Due to CASCADE delete, this will also remove related messages, attachments, group members, and analytics
    const deleteResult = await prisma.telegramGroup.deleteMany({
      where: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      deletedCount: deleteResult.count,
      deletedGroups: inactiveGroups.map(g => ({
        title: g.title,
        messageCount: g._count.messages,
      })),
      message: `Successfully deleted ${deleteResult.count} inactive group${deleteResult.count !== 1 ? 's' : ''}`,
    });

  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ 
      error: 'Failed to cleanup inactive groups',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}