import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const search = searchParams.get("search") || "";
  const groupId = searchParams.get("groupId");
  const messageType = searchParams.get("type");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const skip = (page - 1) * limit;

  try {
    const where: any = {
      isDeleted: false,
    };

    if (search) {
      where.OR = [
        { text: { contains: search, mode: "insensitive" } },
        { telegramUsername: { contains: search, mode: "insensitive" } },
      ];
    }

    if (groupId && groupId !== "all") {
      where.groupId = groupId;
    }

    if (messageType && messageType !== "all") {
      where.messageType = messageType;
    }

    if (startDate) {
      where.telegramDate = {
        ...where.telegramDate,
        gte: new Date(startDate),
      };
    }

    if (endDate) {
      where.telegramDate = {
        ...where.telegramDate,
        lte: new Date(endDate),
      };
    }

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        include: {
          group: true,
          user: true,
          attachments: true,
          _count: {
            select: { replies: true },
          },
        },
        orderBy: { telegramDate: "desc" },
        skip,
        take: limit,
      }),
      prisma.message.count({ where }),
    ]);

    return NextResponse.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}