import { Context } from 'telegraf';
import { handleMessage, handleMemberJoin, handleBotAddedToGroup, handleMemberLeft } from '@/lib/telegram/handlers';
import prisma from '@/lib/db';
import { downloadAndStoreFile } from '@/lib/telegram/file-handler';

// Mock dependencies
jest.mock('@/lib/db', () => ({
  __esModule: true,
  default: {
    telegramGroup: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    message: {
      create: jest.fn(),
    },
    attachment: {
      create: jest.fn(),
    },
    groupMember: {
      upsert: jest.fn(),
      update: jest.fn(),
    },
    analyticsEvent: {
      create: jest.fn(),
    },
  },
}));

jest.mock('@/lib/telegram/file-handler', () => ({
  downloadAndStoreFile: jest.fn(),
}));

describe('Telegram Handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.BLOB_READ_WRITE_TOKEN = 'test-token';
  });

  describe('handleMessage', () => {
    it('should ignore private messages', async () => {
      const ctx = {
        message: { text: 'test' },
        chat: { type: 'private' },
      } as any;

      await handleMessage(ctx);

      expect(prisma.telegramGroup.findUnique).not.toHaveBeenCalled();
    });

    it('should create a new group if it does not exist', async () => {
      const mockGroup = { id: '1', telegramId: BigInt(123) };
      const mockUser = { id: '1', telegramId: BigInt(456) };
      
      (prisma.telegramGroup.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.telegramGroup.create as jest.Mock).mockResolvedValue(mockGroup);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.message.create as jest.Mock).mockResolvedValue({ id: '1' });

      const ctx = {
        message: {
          message_id: 789,
          text: 'Hello world',
          date: Math.floor(Date.now() / 1000),
        },
        chat: {
          id: 123,
          type: 'group',
          title: 'Test Group',
        },
        from: {
          id: 456,
          first_name: 'John',
          last_name: 'Doe',
          username: 'johndoe',
        },
        getChatMembersCount: jest.fn().mockResolvedValue(10),
      } as any;

      await handleMessage(ctx);

      expect(prisma.telegramGroup.create).toHaveBeenCalledWith({
        data: {
          telegramId: BigInt(123),
          title: 'Test Group',
          username: null,
          memberCount: 10,
        },
      });
    });

    it('should handle text messages correctly', async () => {
      const mockGroup = { id: '1', telegramId: BigInt(123) };
      const mockUser = { id: '1', telegramId: BigInt(456) };
      
      (prisma.telegramGroup.findUnique as jest.Mock).mockResolvedValue(mockGroup);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.message.create as jest.Mock).mockResolvedValue({ id: '1' });

      const ctx = {
        message: {
          message_id: 789,
          text: 'Hello world',
          date: Math.floor(Date.now() / 1000),
        },
        chat: {
          id: 123,
          type: 'group',
        },
        from: {
          id: 456,
          username: 'johndoe',
        },
        getChatMembersCount: jest.fn().mockResolvedValue(10),
      } as any;

      await handleMessage(ctx);

      expect(prisma.message.create).toHaveBeenCalledWith({
        data: {
          telegramMessageId: BigInt(789),
          groupId: '1',
          userId: '1',
          telegramUserId: BigInt(456),
          telegramUsername: 'johndoe',
          text: 'Hello world',
          messageType: 'text',
          telegramDate: expect.any(Date),
        },
      });
    });

    it('should handle photo messages with attachments', async () => {
      const mockGroup = { id: '1' };
      const mockUser = { id: '1' };
      const mockMessage = { id: '1' };
      
      (prisma.telegramGroup.findUnique as jest.Mock).mockResolvedValue(mockGroup);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.message.create as jest.Mock).mockResolvedValue(mockMessage);
      (downloadAndStoreFile as jest.Mock).mockResolvedValue({ url: 'https://example.com/photo.jpg' });

      const ctx = {
        message: {
          message_id: 789,
          caption: 'A nice photo',
          date: Math.floor(Date.now() / 1000),
          photo: [
            { file_id: 'small', width: 100, height: 100 },
            { file_id: 'large', width: 800, height: 600, file_size: 12345 },
          ],
        },
        chat: {
          id: 123,
          type: 'group',
        },
        from: {
          id: 456,
          username: 'johndoe',
        },
        getChatMembersCount: jest.fn(),
      } as any;

      await handleMessage(ctx);

      expect(prisma.attachment.create).toHaveBeenCalledWith({
        data: {
          messageId: '1',
          telegramFileId: 'large',
          fileType: 'photo',
          width: 800,
          height: 600,
          fileSize: BigInt(12345),
          storageUrl: 'https://example.com/photo.jpg',
        },
      });
    });
  });

  describe('handleMemberJoin', () => {
    it('should handle new members joining', async () => {
      const mockGroup = { id: '1' };
      (prisma.telegramGroup.findUnique as jest.Mock).mockResolvedValue(mockGroup);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({ id: 'newuser1' });

      const ctx = {
        message: {
          new_chat_members: [
            {
              id: 999,
              first_name: 'New',
              last_name: 'Member',
              username: 'newmember',
            },
          ],
        },
        chat: {
          id: 123,
          type: 'group',
        },
        getChatMembersCount: jest.fn().mockResolvedValue(11),
      } as any;

      await handleMemberJoin(ctx);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          telegramId: BigInt(999),
          telegramUsername: 'newmember',
          name: 'New Member',
          email: 'telegram_999@plp.local',
        },
      });

      expect(prisma.groupMember.upsert).toHaveBeenCalled();
      expect(prisma.analyticsEvent.create).toHaveBeenCalledWith({
        data: {
          groupId: '1',
          eventType: 'member_joined',
          eventData: { userId: 'newuser1' },
        },
      });
    });
  });

  describe('handleBotAddedToGroup', () => {
    it('should handle bot being added to a group', async () => {
      const ctx = {
        update: {
          my_chat_member: {
            chat: {
              id: 123,
              type: 'group',
              title: 'New Group',
              username: 'newgroup',
            },
            new_chat_member: {
              user: { id: 12345 },
              status: 'member',
            },
          },
        },
        botInfo: { id: 12345 },
      } as any;

      await handleBotAddedToGroup(ctx);

      expect(prisma.telegramGroup.upsert).toHaveBeenCalledWith({
        where: { telegramId: BigInt(123) },
        create: {
          telegramId: BigInt(123),
          title: 'New Group',
          username: 'newgroup',
          memberCount: 0,
          isActive: true,
        },
        update: {
          title: 'New Group',
          username: 'newgroup',
          isActive: true,
        },
      });
    });

    it('should handle bot being removed from a group', async () => {
      const ctx = {
        update: {
          my_chat_member: {
            chat: {
              id: 123,
              type: 'group',
              title: 'Old Group',
            },
            new_chat_member: {
              user: { id: 12345 },
              status: 'left',
            },
          },
        },
        botInfo: { id: 12345 },
      } as any;

      await handleBotAddedToGroup(ctx);

      expect(prisma.telegramGroup.update).toHaveBeenCalledWith({
        where: { telegramId: BigInt(123) },
        data: { isActive: false },
      });
    });
  });

  describe('handleMemberLeft', () => {
    it('should handle members leaving the group', async () => {
      const mockGroup = { id: '1' };
      const mockUser = { id: 'user1' };
      
      (prisma.telegramGroup.findUnique as jest.Mock).mockResolvedValue(mockGroup);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const ctx = {
        message: {
          left_chat_member: {
            id: 456,
          },
        },
        chat: {
          id: 123,
          type: 'group',
        },
        getChatMembersCount: jest.fn().mockResolvedValue(9),
      } as any;

      await handleMemberLeft(ctx);

      expect(prisma.groupMember.update).toHaveBeenCalledWith({
        where: {
          groupId_userId: {
            groupId: '1',
            userId: 'user1',
          },
        },
        data: {
          isActive: false,
          leftAt: expect.any(Date),
        },
      });

      expect(prisma.analyticsEvent.create).toHaveBeenCalledWith({
        data: {
          groupId: '1',
          eventType: 'member_left',
          eventData: { userId: 'user1' },
        },
      });
    });
  });
});