import { z } from 'zod';

// Define the schema for environment variables
const EnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().describe('PostgreSQL connection string'),
  
  // Telegram Bot
  TELEGRAM_BOT_TOKEN: z
    .string()
    .regex(/^\d+:[\w-]+$/, 'Invalid Telegram bot token format')
    .describe('Telegram bot token from @BotFather'),
  
  TELEGRAM_WEBHOOK_SECRET: z
    .string()
    .min(32, 'Webhook secret must be at least 32 characters')
    .describe('Secret token for webhook verification'),
  
  // NextAuth (optional since auth is disabled)
  NEXTAUTH_URL: z
    .string()
    .url()
    .optional()
    .describe('Canonical URL of your site'),
  
  NEXTAUTH_SECRET: z
    .string()
    .min(32, 'NextAuth secret must be at least 32 characters')
    .optional()
    .describe('Secret used to encrypt JWT tokens'),
  
  // Node environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development')
    .describe('Node environment'),
});

// Validate environment variables
function validateEnv() {
  try {
    const env = EnvSchema.parse(process.env);
    console.log('✅ Environment variables validated successfully');
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      error.issues.forEach(issue => {
        console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
      });
      
      // In development, show which env vars are missing
      if (process.env.NODE_ENV !== 'production') {
        console.error('\n📋 Required environment variables:');
        console.error('  DATABASE_URL=postgresql://user:password@host:port/database');
        console.error('  TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz');
        console.error('  TELEGRAM_WEBHOOK_SECRET=your-32-character-or-longer-secret-string');
      }
      
      throw new Error('Environment validation failed');
    }
    throw error;
  }
}

// Export validated environment variables
export const env = validateEnv();

// Type-safe environment variable access
export type Env = z.infer<typeof EnvSchema>;