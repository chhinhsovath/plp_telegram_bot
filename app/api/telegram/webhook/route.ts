import { NextRequest, NextResponse } from 'next/server';
import { bot } from '@/lib/telegram/bot';
import { handleMessage, handleMemberJoin, handleMemberLeft } from '@/lib/telegram/handlers';

// Set up message handlers
bot.on('message', handleMessage);
bot.on('new_chat_members', handleMemberJoin);
bot.on('left_chat_member', handleMemberLeft);

export async function POST(req: NextRequest) {
  try {
    // Verify webhook secret if provided
    const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (webhookSecret) {
      const providedSecret = req.headers.get('X-Telegram-Bot-Api-Secret-Token');
      if (providedSecret !== webhookSecret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const body = await req.json();
    
    // Process update
    await bot.handleUpdate(body);
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    bot: {
      username: bot.botInfo?.username || 'unknown',
      id: bot.botInfo?.id || 'unknown'
    }
  });
}