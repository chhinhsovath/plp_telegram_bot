import { Context } from 'telegraf';
import prisma from '@/lib/db';
import { downloadAndStoreFile } from './file-handler';

export async function handleMessage(ctx: Context) {
  if (!ctx.message || !ctx.chat || ctx.chat.type === 'private') {
    return;
  }

  const message = ctx.message as any;
  const chat = ctx.chat;
  const from = ctx.from;

  if (!from) return;

  try {
    // Check if group exists in database
    let group = await prisma.telegramGroup.findUnique({
      where: { telegramId: BigInt(chat.id) }
    });

    // Create group if it doesn't exist
    if (!group) {
      group = await prisma.telegramGroup.create({
        data: {
          telegramId: BigInt(chat.id),
          title: chat.title || 'Unknown Group',
          username: 'username' in chat ? chat.username : null,
          memberCount: await ctx.getChatMembersCount()
        }
      });
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { telegramId: BigInt(from.id) }
    });

    // Create user if doesn't exist
    if (!user) {
      user = await prisma.user.create({
        data: {
          telegramId: BigInt(from.id),
          telegramUsername: from.username || null,
          name: `${from.first_name} ${from.last_name || ''}`.trim(),
          email: `telegram_${from.id}@plp.local`, // Placeholder email
        }
      });
    }

    // Determine message type and text
    let messageType = 'text';
    let text = '';

    if ('text' in message) {
      text = message.text;
    } else if ('caption' in message) {
      text = message.caption || '';
      if ('photo' in message) messageType = 'photo';
      else if ('video' in message) messageType = 'video';
      else if ('document' in message) messageType = 'document';
      else if ('audio' in message) messageType = 'audio';
      else if ('voice' in message) messageType = 'voice';
    }

    // Store message
    const storedMessage = await prisma.message.create({
      data: {
        telegramMessageId: BigInt(message.message_id),
        groupId: group.id,
        userId: user.id,
        telegramUserId: BigInt(from.id),
        telegramUsername: from.username || null,
        text,
        messageType,
        telegramDate: new Date(message.date * 1000),
      }
    });

    // Handle attachments
    if ('photo' in message && message.photo) {
      // Store the largest photo
      const photo = message.photo[message.photo.length - 1];
      
      // Optionally download and store the file
      let storageUrl = null;
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        try {
          const stored = await downloadAndStoreFile(photo.file_id, `photo_${Date.now()}.jpg`);
          storageUrl = stored.url;
        } catch (error) {
          console.error('Error storing photo:', error);
        }
      }
      
      await prisma.attachment.create({
        data: {
          messageId: storedMessage.id,
          telegramFileId: photo.file_id,
          fileType: 'photo',
          width: photo.width,
          height: photo.height,
          fileSize: photo.file_size ? BigInt(photo.file_size) : null,
          storageUrl,
        }
      });
    } else if ('video' in message && message.video) {
      let storageUrl = null;
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        try {
          const stored = await downloadAndStoreFile(
            message.video.file_id, 
            message.video.file_name || `video_${Date.now()}.mp4`
          );
          storageUrl = stored.url;
        } catch (error) {
          console.error('Error storing video:', error);
        }
      }
      
      await prisma.attachment.create({
        data: {
          messageId: storedMessage.id,
          telegramFileId: message.video.file_id,
          fileType: 'video',
          fileName: message.video.file_name || null,
          width: message.video.width,
          height: message.video.height,
          duration: message.video.duration,
          fileSize: message.video.file_size ? BigInt(message.video.file_size) : null,
          mimeType: message.video.mime_type || null,
          storageUrl,
        }
      });
    } else if ('document' in message && message.document) {
      let storageUrl = null;
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        try {
          const stored = await downloadAndStoreFile(
            message.document.file_id,
            message.document.file_name || `document_${Date.now()}`
          );
          storageUrl = stored.url;
        } catch (error) {
          console.error('Error storing document:', error);
        }
      }
      
      await prisma.attachment.create({
        data: {
          messageId: storedMessage.id,
          telegramFileId: message.document.file_id,
          fileType: 'document',
          fileName: message.document.file_name || null,
          fileSize: message.document.file_size ? BigInt(message.document.file_size) : null,
          mimeType: message.document.mime_type || null,
          storageUrl,
        }
      });
    }

    // Update group member if needed
    await prisma.groupMember.upsert({
      where: {
        groupId_userId: {
          groupId: group.id,
          userId: user.id
        }
      },
      update: {
        isActive: true,
        leftAt: null
      },
      create: {
        groupId: group.id,
        userId: user.id,
        telegramUserId: BigInt(from.id),
      }
    });

    // Log analytics event
    await prisma.analyticsEvent.create({
      data: {
        groupId: group.id,
        eventType: 'message_received',
        eventData: {
          messageType,
          userId: user.id,
          hasAttachment: ['photo', 'video', 'document', 'audio', 'voice'].includes(messageType)
        }
      }
    });

  } catch (error) {
    console.error('Error handling message:', error);
  }
}

export async function handleMemberJoin(ctx: Context) {
  if (!ctx.chat || ctx.chat.type === 'private') return;
  
  const message = ctx.message as any;
  if (!message.new_chat_members) return;

  try {
    let group = await prisma.telegramGroup.findUnique({
      where: { telegramId: BigInt(ctx.chat.id) }
    });

    if (!group) {
      group = await prisma.telegramGroup.create({
        data: {
          telegramId: BigInt(ctx.chat.id),
          title: ctx.chat.title || 'Unknown Group',
          memberCount: await ctx.getChatMembersCount()
        }
      });
    }

    for (const member of message.new_chat_members) {
      let user = await prisma.user.findUnique({
        where: { telegramId: BigInt(member.id) }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            telegramId: BigInt(member.id),
            telegramUsername: member.username || null,
            name: `${member.first_name} ${member.last_name || ''}`.trim(),
            email: `telegram_${member.id}@plp.local`,
          }
        });
      }

      await prisma.groupMember.upsert({
        where: {
          groupId_userId: {
            groupId: group.id,
            userId: user.id
          }
        },
        update: {
          isActive: true,
          leftAt: null
        },
        create: {
          groupId: group.id,
          userId: user.id,
          telegramUserId: BigInt(member.id),
        }
      });

      await prisma.analyticsEvent.create({
        data: {
          groupId: group.id,
          eventType: 'member_joined',
          eventData: { userId: user.id }
        }
      });
    }

    // Update member count
    await prisma.telegramGroup.update({
      where: { id: group.id },
      data: { memberCount: await ctx.getChatMembersCount() }
    });

  } catch (error) {
    console.error('Error handling member join:', error);
  }
}

export async function handleBotAddedToGroup(ctx: Context) {
  const update = ctx.update as any;
  
  if (!update.my_chat_member) return;
  
  const { chat, new_chat_member } = update.my_chat_member;
  
  // Check if the bot was added to a group/supergroup
  if ((chat.type === 'group' || chat.type === 'supergroup') && 
      new_chat_member.user.id === ctx.botInfo?.id &&
      new_chat_member.status === 'member') {
    
    try {
      // Create or update the group
      await prisma.telegramGroup.upsert({
        where: { telegramId: BigInt(chat.id) },
        create: {
          telegramId: BigInt(chat.id),
          title: chat.title || 'Unknown Group',
          username: chat.username || null,
          memberCount: 0, // Will be updated when we receive messages
          isActive: true,
        },
        update: {
          title: chat.title || 'Unknown Group',
          username: chat.username || null,
          isActive: true,
        }
      });
      
      console.log(`Bot added to group: ${chat.title} (${chat.id})`);
    } catch (error) {
      console.error('Error handling bot added to group:', error);
    }
  }
  
  // Check if bot was removed from a group
  if ((chat.type === 'group' || chat.type === 'supergroup') && 
      new_chat_member.user.id === ctx.botInfo?.id &&
      (new_chat_member.status === 'left' || new_chat_member.status === 'kicked')) {
    
    try {
      await prisma.telegramGroup.update({
        where: { telegramId: BigInt(chat.id) },
        data: { isActive: false }
      });
      
      console.log(`Bot removed from group: ${chat.title} (${chat.id})`);
    } catch (error) {
      console.error('Error handling bot removed from group:', error);
    }
  }
}

export async function handleMemberLeft(ctx: Context) {
  if (!ctx.chat || ctx.chat.type === 'private') return;
  
  const message = ctx.message as any;
  if (!message.left_chat_member) return;

  try {
    const group = await prisma.telegramGroup.findUnique({
      where: { telegramId: BigInt(ctx.chat.id) }
    });

    if (!group) return;

    const user = await prisma.user.findUnique({
      where: { telegramId: BigInt(message.left_chat_member.id) }
    });

    if (user) {
      await prisma.groupMember.update({
        where: {
          groupId_userId: {
            groupId: group.id,
            userId: user.id
          }
        },
        data: {
          isActive: false,
          leftAt: new Date()
        }
      });

      await prisma.analyticsEvent.create({
        data: {
          groupId: group.id,
          eventType: 'member_left',
          eventData: { userId: user.id }
        }
      });
    }

    // Update member count
    await prisma.telegramGroup.update({
      where: { id: group.id },
      data: { memberCount: await ctx.getChatMembersCount() }
    });

  } catch (error) {
    console.error('Error handling member left:', error);
  }
}