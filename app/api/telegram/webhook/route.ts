import { NextRequest, NextResponse } from 'next/server';
import { bot } from '@/lib/telegram/bot';
import { handleMessage, handleMemberJoin, handleMemberLeft } from '@/lib/telegram/handlers';
import { TelegramUpdateSchema } from '@/lib/validations';
import { z } from 'zod';

// Set up message handlers
if (bot) {
  bot.on('message', handleMessage);
  bot.on('new_chat_members', handleMemberJoin);
  bot.on('left_chat_member', handleMemberLeft);
}

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
    
    // Validate the incoming webhook data with Zod for logging/monitoring
    try {
      const validatedUpdate = TelegramUpdateSchema.parse(body);
      console.log('✅ Valid Telegram update received:', {
        update_id: validatedUpdate.update_id,
        type: validatedUpdate.message ? 'message' : 
              validatedUpdate.edited_message ? 'edited_message' : 
              validatedUpdate.channel_post ? 'channel_post' : 'other'
      });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        console.error('❌ Invalid Telegram webhook data:', validationError.issues);
        // Log but don't reject - let Telegraf handle its own validation
        console.error('Validation issues:', validationError.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message
        })));
      }
    }
    
    // Process update with bot
    if (!bot) {
      console.error('❌ Telegram bot not initialized');
      return NextResponse.json({ error: 'Bot not configured' }, { status: 503 });
    }
    
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
    status: bot ? 'ok' : 'not configured',
    bot: bot ? {
      username: bot.botInfo?.username || 'unknown',
      id: bot.botInfo?.id || 'unknown'
    } : null
  });
}