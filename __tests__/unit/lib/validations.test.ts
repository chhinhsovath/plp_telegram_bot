import {
  EnvSchema,
  TelegramUserSchema,
  TelegramChatSchema,
  TelegramMessageSchema,
  CreateGroupSchema,
  MessageFilterSchema,
  LoginSchema,
  RegisterSchema,
  SettingsSchema,
} from '@/lib/validations';

describe('Validation Schemas', () => {
  describe('EnvSchema', () => {
    it('should validate correct environment variables', () => {
      const validEnv = {
        DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
        TELEGRAM_BOT_TOKEN: '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11',
        TELEGRAM_WEBHOOK_SECRET: 'a'.repeat(32),
      };
      
      expect(() => EnvSchema.parse(validEnv)).not.toThrow();
    });

    it('should reject invalid bot token format', () => {
      const invalidEnv = {
        DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
        TELEGRAM_BOT_TOKEN: 'invalid-token',
        TELEGRAM_WEBHOOK_SECRET: 'a'.repeat(32),
      };
      
      expect(() => EnvSchema.parse(invalidEnv)).toThrow();
    });

    it('should reject short webhook secret', () => {
      const invalidEnv = {
        DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
        TELEGRAM_BOT_TOKEN: '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11',
        TELEGRAM_WEBHOOK_SECRET: 'short',
      };
      
      expect(() => EnvSchema.parse(invalidEnv)).toThrow();
    });
  });

  describe('TelegramUserSchema', () => {
    it('should validate a complete user object', () => {
      const user = {
        id: 123456,
        is_bot: false,
        first_name: 'John',
        last_name: 'Doe',
        username: 'johndoe',
        language_code: 'en',
      };
      
      expect(() => TelegramUserSchema.parse(user)).not.toThrow();
    });

    it('should validate a user with only required fields', () => {
      const user = {
        id: 123456,
        is_bot: false,
        first_name: 'John',
      };
      
      expect(() => TelegramUserSchema.parse(user)).not.toThrow();
    });
  });

  describe('TelegramChatSchema', () => {
    it('should validate different chat types', () => {
      const privateChat = { id: 123, type: 'private' };
      const groupChat = { id: -123, type: 'group', title: 'Test Group' };
      const supergroup = { id: -1001234, type: 'supergroup', title: 'Super Group', username: 'supergroup' };
      
      expect(() => TelegramChatSchema.parse(privateChat)).not.toThrow();
      expect(() => TelegramChatSchema.parse(groupChat)).not.toThrow();
      expect(() => TelegramChatSchema.parse(supergroup)).not.toThrow();
    });

    it('should reject invalid chat type', () => {
      const invalidChat = { id: 123, type: 'invalid' };
      
      expect(() => TelegramChatSchema.parse(invalidChat)).toThrow();
    });
  });

  describe('TelegramMessageSchema', () => {
    it('should validate a text message', () => {
      const message = {
        message_id: 1,
        chat: { id: 123, type: 'private' },
        date: 1234567890,
        text: 'Hello, world!',
      };
      
      expect(() => TelegramMessageSchema.parse(message)).not.toThrow();
    });

    it('should validate a photo message', () => {
      const message = {
        message_id: 1,
        chat: { id: 123, type: 'group', title: 'Test Group' },
        date: 1234567890,
        photo: [
          { file_id: 'photo1', file_unique_id: 'unique1', width: 100, height: 100 },
          { file_id: 'photo2', file_unique_id: 'unique2', width: 800, height: 600, file_size: 12345 },
        ],
      };
      
      expect(() => TelegramMessageSchema.parse(message)).not.toThrow();
    });
  });

  describe('CreateGroupSchema', () => {
    it('should transform string telegramId to bigint', () => {
      const input = {
        telegramId: '123456789',
        title: 'Test Group',
      };
      
      const result = CreateGroupSchema.parse(input);
      expect(result.telegramId).toBe(BigInt(123456789));
    });

    it('should accept optional fields', () => {
      const input = {
        telegramId: 123456789,
        title: 'Test Group',
        username: 'testgroup',
        description: 'A test group',
      };
      
      expect(() => CreateGroupSchema.parse(input)).not.toThrow();
    });
  });

  describe('MessageFilterSchema', () => {
    it('should provide default values', () => {
      const result = MessageFilterSchema.parse({});
      expect(result.limit).toBe(20);
      expect(result.offset).toBe(0);
    });

    it('should validate all filter options', () => {
      const filter = {
        groupId: '550e8400-e29b-41d4-a716-446655440000',
        messageType: 'photo',
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-12-31T23:59:59Z',
        search: 'test',
        limit: 50,
        offset: 10,
      };
      
      expect(() => MessageFilterSchema.parse(filter)).not.toThrow();
    });

    it('should reject invalid limit', () => {
      const filter = { limit: 200 };
      expect(() => MessageFilterSchema.parse(filter)).toThrow();
    });
  });

  describe('LoginSchema', () => {
    it('should validate correct credentials', () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };
      
      expect(() => LoginSchema.parse(credentials)).not.toThrow();
    });

    it('should reject invalid email', () => {
      const credentials = {
        email: 'not-an-email',
        password: 'password123',
      };
      
      expect(() => LoginSchema.parse(credentials)).toThrow();
    });

    it('should reject short password', () => {
      const credentials = {
        email: 'test@example.com',
        password: '12345',
      };
      
      expect(() => LoginSchema.parse(credentials)).toThrow();
    });
  });

  describe('RegisterSchema', () => {
    it('should validate matching passwords', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };
      
      expect(() => RegisterSchema.parse(data)).not.toThrow();
    });

    it('should reject mismatched passwords', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'different123',
      };
      
      expect(() => RegisterSchema.parse(data)).toThrow();
    });
  });

  describe('SettingsSchema', () => {
    it('should validate all settings', () => {
      const settings = {
        webhookUrl: 'https://example.com/webhook',
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedFileTypes: ['image', 'video', 'document'],
        retentionDays: 30,
        autoDeleteEnabled: true,
      };
      
      expect(() => SettingsSchema.parse(settings)).not.toThrow();
    });

    it('should reject invalid file size', () => {
      const settings = {
        maxFileSize: 100 * 1024 * 1024, // 100MB - too large
        allowedFileTypes: ['image'],
        retentionDays: 30,
        autoDeleteEnabled: false,
      };
      
      expect(() => SettingsSchema.parse(settings)).toThrow();
    });
  });
});