import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { bot } from "@/lib/telegram/bot";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const attachment = await prisma.attachment.findUnique({
      where: { id: params.id },
    });

    if (!attachment) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // If we have a stored URL, redirect to it
    if (attachment.storageUrl) {
      return NextResponse.redirect(attachment.storageUrl);
    }

    // Otherwise, get the file from Telegram
    try {
      const file = await bot.telegram.getFile(attachment.telegramFileId);
      const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      
      // For development, redirect to Telegram URL
      // In production, you might want to proxy the file
      return NextResponse.redirect(fileUrl);
    } catch (error) {
      console.error("Error getting file from Telegram:", error);
      return NextResponse.json(
        { error: "Failed to retrieve file" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error fetching attachment:", error);
    return NextResponse.json(
      { error: "Failed to fetch attachment" },
      { status: 500 }
    );
  }
}