import { z } from 'zod';

// ===== Environment Variables =====
export const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  TELEGRAM_BOT_TOKEN: z.string().regex(/^\d+:[\w-]+$/, "Invalid Telegram bot token format"),
  TELEGRAM_WEBHOOK_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(32).optional(),
});

// ===== Telegram Webhook Schemas =====
export const TelegramUserSchema = z.object({
  id: z.number(),
  is_bot: z.boolean(),
  first_name: z.string(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  language_code: z.string().optional(),
});

export const TelegramChatSchema = z.object({
  id: z.number(),
  type: z.enum(['private', 'group', 'supergroup', 'channel']),
  title: z.string().optional(),
  username: z.string().optional(),
});

export const TelegramPhotoSchema = z.object({
  file_id: z.string(),
  file_unique_id: z.string(),
  width: z.number(),
  height: z.number(),
  file_size: z.number().optional(),
});

export const TelegramMessageSchema = z.object({
  message_id: z.number(),
  from: TelegramUserSchema.optional(),
  chat: TelegramChatSchema,
  date: z.number(),
  text: z.string().optional(),
  photo: z.array(TelegramPhotoSchema).optional(),
  document: z.object({
    file_id: z.string(),
    file_unique_id: z.string(),
    file_name: z.string().optional(),
    mime_type: z.string().optional(),
    file_size: z.number().optional(),
  }).optional(),
  video: z.object({
    file_id: z.string(),
    file_unique_id: z.string(),
    width: z.number(),
    height: z.number(),
    duration: z.number(),
    file_size: z.number().optional(),
  }).optional(),
});

export const TelegramUpdateSchema = z.object({
  update_id: z.number(),
  message: TelegramMessageSchema.optional(),
  edited_message: TelegramMessageSchema.optional(),
  channel_post: TelegramMessageSchema.optional(),
  edited_channel_post: TelegramMessageSchema.optional(),
});

// ===== API Request Schemas =====
export const CreateGroupSchema = z.object({
  telegramId: z.string(),
  title: z.string().min(1).max(255),
  type: z.enum(['group', 'supergroup', 'channel']),
  username: z.string().optional(),
  description: z.string().max(1000).optional(),
});

export const UpdateGroupSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  isActive: z.boolean().optional(),
});

export const MessageFilterSchema = z.object({
  groupId: z.string().uuid().optional(),
  messageType: z.enum(['text', 'photo', 'video', 'document']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  search: z.string().optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().default(0),
});

// ===== Form Validation Schemas =====
export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const SettingsSchema = z.object({
  webhookUrl: z.string().url().optional(),
  maxFileSize: z.number().min(1).max(50 * 1024 * 1024), // 1B to 50MB
  allowedFileTypes: z.array(z.enum(['image', 'video', 'document', 'audio'])),
  retentionDays: z.number().int().min(1).max(365),
  autoDeleteEnabled: z.boolean(),
});

// ===== Type Exports =====
export type TelegramUpdate = z.infer<typeof TelegramUpdateSchema>;
export type TelegramMessage = z.infer<typeof TelegramMessageSchema>;
export type CreateGroupInput = z.infer<typeof CreateGroupSchema>;
export type UpdateGroupInput = z.infer<typeof UpdateGroupSchema>;
export type MessageFilter = z.infer<typeof MessageFilterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type SettingsInput = z.infer<typeof SettingsSchema>;