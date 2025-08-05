import { NextRequest, NextResponse } from 'next/server';
import { bot } from '@/lib/telegram/bot';
import { handleMessage, handleMemberJoin, handleMemberLeft } from '@/lib/telegram/handlers';
import { TelegramUpdateSchema } from '@/lib/validations';
import { z } from 'zod';

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
    
    // Validate the incoming webhook data with Zod
    try {
      const validatedUpdate = TelegramUpdateSchema.parse(body);
      console.log('✅ Valid Telegram update received:', {
        update_id: validatedUpdate.update_id,
        type: validatedUpdate.message ? 'message' : 
              validatedUpdate.edited_message ? 'edited_message' : 
              validatedUpdate.channel_post ? 'channel_post' : 'other'
      });
      
      // Process validated update
      await bot.handleUpdate(validatedUpdate);
      
      return NextResponse.json({ ok: true });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        console.error('❌ Invalid Telegram webhook data:', validationError.errors);
        return NextResponse.json({ 
          error: 'Invalid webhook format',
          details: validationError.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        }, { status: 400 });
      }
      throw validationError;
    }
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