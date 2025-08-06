import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { bot } from '@/lib/telegram/bot';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if bot is configured
    if (!bot) {
      return NextResponse.json({ error: 'Bot not configured' }, { status: 503 });
    }

    // This is a simplified sync - in production, you might want to implement
    // a more sophisticated approach using Telegram's getUpdates or checking
    // each known group's status
    
    // Get all groups from database
    const groups = await prisma.telegramGroup.findMany({
      select: {
        id: true,
        telegramId: true,
        title: true,
      }
    });

    let syncedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Update each group's information
    for (const group of groups) {
      try {
        // Try to get chat info from Telegram
        const chat = await bot.telegram.getChat(Number(group.telegramId));
        
        if (chat.type === 'group' || chat.type === 'supergroup') {
          const memberCount = await bot.telegram.getChatMembersCount(Number(group.telegramId));
          
          await prisma.telegramGroup.update({
            where: { id: group.id },
            data: {
              title: chat.title || group.title,
              username: 'username' in chat ? chat.username : null,
              memberCount: memberCount,
              isActive: true,
            }
          });
          
          syncedCount++;
        }
      } catch (error: any) {
        // If we get a "chat not found" or "bot was kicked" error, mark as inactive
        if (error.message?.includes('chat not found') || 
            error.message?.includes('bot was kicked') ||
            error.message?.includes('bot is not a member')) {
          await prisma.telegramGroup.update({
            where: { id: group.id },
            data: { isActive: false }
          });
        } else {
          errorCount++;
          errors.push(`Failed to sync ${group.title}: ${error.message}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      syncedCount,
      errorCount,
      errors: errors.slice(0, 5), // Return first 5 errors only
      message: `Synced ${syncedCount} groups successfully${errorCount > 0 ? `, ${errorCount} errors` : ''}`
    });

  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ 
      error: 'Failed to sync groups',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}