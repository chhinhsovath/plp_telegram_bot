import prisma from '@/lib/db';
import { bot } from '@/lib/telegram/bot';

async function testMediaAccess() {
  console.log('🧪 Testing media file access...\n');

  try {
    // Get a few recent attachments
    const attachments = await prisma.attachment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        message: {
          include: {
            group: true,
            user: true,
          },
        },
      },
    });

    if (attachments.length === 0) {
      console.log('No attachments found in the database');
      return;
    }

    console.log(`Testing ${attachments.length} recent attachments:\n`);

    for (const attachment of attachments) {
      console.log(`📎 Attachment ID: ${attachment.id}`);
      console.log(`   Type: ${attachment.fileType}`);
      console.log(`   File: ${attachment.fileName || 'Unnamed'}`);
      console.log(`   Group: ${attachment.message.group.title}`);
      console.log(`   From: ${attachment.message.user?.name || 'Unknown'}`);
      console.log(`   Storage URL: ${attachment.storageUrl || 'None'}`);
      console.log(`   Telegram File ID: ${attachment.telegramFileId}`);

      // Test if we can get the file from Telegram
      if (bot) {
        try {
          const file = await bot.telegram.getFile(attachment.telegramFileId);
          const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
          console.log(`   ✅ Can access via Telegram API: ${file.file_path}`);
          console.log(`   File size: ${file.file_size} bytes`);
          
          // Test if the URL is accessible
          const response = await fetch(fileUrl, { method: 'HEAD' });
          if (response.ok) {
            console.log(`   ✅ File is accessible at Telegram URL`);
          } else {
            console.log(`   ❌ File not accessible: ${response.status} ${response.statusText}`);
          }
        } catch (error: any) {
          console.log(`   ❌ Cannot access via Telegram: ${error.message}`);
        }
      } else {
        console.log(`   ⚠️  Bot not initialized`);
      }

      // Test the API endpoint
      const apiUrl = `http://localhost:3000/api/files/${attachment.id}`;
      console.log(`   API endpoint: ${apiUrl}`);

      console.log('---');
    }

  } catch (error) {
    console.error('Error testing media access:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testMediaAccess().catch(console.error);