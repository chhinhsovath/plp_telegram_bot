import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const groupId = searchParams.get('groupId') || 'all';
    const fileType = searchParams.get('fileType') || 'all';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { fileName: { contains: search, mode: 'insensitive' } },
        { message: { text: { contains: search, mode: 'insensitive' } } }
      ];
    }
    
    if (groupId !== 'all') {
      where.message = { ...(where.message || {}), groupId };
    }
    
    if (fileType !== 'all') {
      where.fileType = fileType;
    }

    // Get total count for pagination
    const totalCount = await prisma.attachment.count({ where });

    // Get paginated attachments
    const attachments = await prisma.attachment.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        message: {
          include: {
            group: true,
            user: true,
          },
        },
      },
    });

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      attachments,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore,
      },
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}