import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    // Test database connection
    const groupCount = await prisma.telegramGroup.count();
    const messageCount = await prisma.message.count();
    
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      counts: {
        groups: groupCount,
        messages: messageCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}