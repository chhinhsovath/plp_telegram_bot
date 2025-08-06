import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.error('No session found for messages API');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const groupId = searchParams.get('groupId');
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where clause
    const where: any = {};

    // Search in message text
    if (search) {
      where.OR = [
        { text: { contains: search } },
        { telegramUsername: { contains: search } },
        { user: { name: { contains: search } } },
      ];
    }

    // Filter by group
    if (groupId && groupId !== 'all') {
      where.groupId = groupId;
    }

    // Filter by message type
    if (type && type !== 'all') {
      where.messageType = type;
    }

    // Filter by date range
    if (startDate || endDate) {
      where.telegramDate = {};
      if (startDate) where.telegramDate.gte = new Date(startDate);
      if (endDate) where.telegramDate.lte = new Date(endDate);
    }

    // Get total count
    const totalCount = await prisma.message.count({ where });

    // Get messages with pagination
    const messages = await prisma.message.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            telegramUsername: true,
          },
        },
        group: {
          select: {
            id: true,
            title: true,
            username: true,
          },
        },
        attachments: {
          select: {
            id: true,
            fileType: true,
            fileName: true,
            fileSize: true,
            storageUrl: true,
            thumbnailUrl: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
      orderBy: { telegramDate: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Calculate pagination
    const totalPages = Math.ceil(totalCount / limit);

    // Convert BigInt fields to strings for JSON serialization
    const serializedMessages = messages.map(message => ({
      ...message,
      telegramMessageId: message.telegramMessageId.toString(),
      telegramUserId: message.telegramUserId.toString(),
      attachments: message.attachments.map(att => ({
        ...att,
        fileSize: att.fileSize ? att.fileSize.toString() : null,
      })),
    }));

    return NextResponse.json({
      messages: serializedMessages,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch messages',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      { status: 500 }
    );
  }
}