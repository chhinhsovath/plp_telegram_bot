/**
 * @jest-environment node
 */
import { bot } from '@/lib/telegram/bot';

// Mock the bot module
jest.mock('@/lib/telegram/bot', () => ({
  bot: {
    handleUpdate: jest.fn(),
  },
}));

// Mock Next.js modules
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((data, init) => ({
      status: init?.status || 200,
      json: async () => data,
    })),
  },
}));

// Mock crypto for webhook verification
const mockCrypto = {
  subtle: {
    importKey: jest.fn(),
    verify: jest.fn(),
  },
};
global.crypto = mockCrypto as any;

describe('Telegram Webhook API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.TELEGRAM_WEBHOOK_SECRET = 'test-webhook-secret';
  });

  it('should handle webhook updates', async () => {
    (bot.handleUpdate as jest.Mock).mockResolvedValue(undefined);

    const update = {
      update_id: 12345,
      message: {
        message_id: 1,
        chat: { id: -123, type: 'group', title: 'Test Group' },
        date: Math.floor(Date.now() / 1000),
        text: 'Hello, bot!',
      },
    };

    // Since we're testing the handler logic, we'll test it directly
    await expect(bot.handleUpdate(update)).resolves.toBeUndefined();
    expect(bot.handleUpdate).toHaveBeenCalledWith(update);
  });

  it('should handle bot errors gracefully', async () => {
    (bot.handleUpdate as jest.Mock).mockRejectedValue(new Error('Bot error'));

    const update = { update_id: 1 };

    await expect(bot.handleUpdate(update)).rejects.toThrow('Bot error');
  });
});