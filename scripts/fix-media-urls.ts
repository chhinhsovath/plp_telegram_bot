import prisma from '@/lib/db';
import { bot } from '@/lib/telegram/bot';
import { downloadAndStoreFile } from '@/lib/telegram/file-handler';

async function fixMediaUrls() {
  console.log('🔧 Fixing media URLs for attachments without storage URLs...');

  try {
    // Find all attachments without storage URLs
    const attachments = await prisma.attachment.findMany({
      where: {
        storageUrl: null,
      },
      include: {
        message: {
          include: {
            group: true,
          },
        },
      },
    });

    console.log(`Found ${attachments.length} attachments without storage URLs`);

    let fixed = 0;
    let failed = 0;

    for (const attachment of attachments) {
      try {
        console.log(`Processing attachment ${attachment.id} (${attachment.fileType})`);
        
        // Skip if we don't have blob storage configured
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
          console.log('⚠️  No BLOB_READ_WRITE_TOKEN configured, skipping storage');
          continue;
        }

        // Try to download and store the file
        const fileName = attachment.fileName || 
          `${attachment.fileType}_${attachment.message.groupId}_${Date.now()}`;
        
        const stored = await downloadAndStoreFile(
          attachment.telegramFileId,
          fileName
        );

        // Update the attachment with the storage URL
        await prisma.attachment.update({
          where: { id: attachment.id },
          data: { storageUrl: stored.url },
        });

        console.log(`✅ Fixed attachment ${attachment.id} - stored at ${stored.url}`);
        fixed++;
      } catch (error) {
        console.error(`❌ Failed to fix attachment ${attachment.id}:`, error);
        failed++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Fixed: ${fixed}`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Skipped: ${attachments.length - fixed - failed}`);

  } catch (error) {
    console.error('Error fixing media URLs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
fixMediaUrls().catch(console.error);