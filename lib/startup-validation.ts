import { env } from './env';

// This file ensures environment variables are validated on startup
console.log('🚀 Starting PLP Telegram Bot Manager');
console.log('📋 Environment:', env.NODE_ENV);
console.log('🔧 Database:', env.DATABASE_URL.split('@')[1]?.split('/')[0] || 'configured');
console.log('🤖 Telegram Bot:', env.TELEGRAM_BOT_TOKEN.split(':')[0] + ':***');
console.log('🔐 Webhook Secret:', env.TELEGRAM_WEBHOOK_SECRET ? 'configured' : 'missing');

// Validate Telegram bot token format
if (!env.TELEGRAM_BOT_TOKEN.includes(':')) {
  throw new Error('Invalid TELEGRAM_BOT_TOKEN format. Expected format: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz');
}

// Validate database URL
if (!env.DATABASE_URL.includes('postgresql://')) {
  throw new Error('DATABASE_URL must be a PostgreSQL connection string');
}

export { env };