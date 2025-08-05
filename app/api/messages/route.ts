import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { MessageFilterSchema } from "@/lib/validations";
import { z } from "zod";

export async function GET(req: NextRequest) {
  // Since auth is disabled, we'll skip the session check
  // const session = await getServerSession(authOptions);
  // if (!session) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  try {
    // Parse and validate query parameters with Zod
    const searchParams = req.nextUrl.searchParams;
    const rawParams = {
      groupId: searchParams.get("groupId") || undefined,
      messageType: searchParams.get("type") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      search: searchParams.get("search") || undefined,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 20,
      offset: searchParams.get("page") ? (parseInt(searchParams.get("page")!) - 1) * 20 : 0,
    };

    const filters = MessageFilterSchema.parse(rawParams);
    
    // Use validated filters
    const { limit, offset, groupId, messageType, startDate, endDate, search } = filters;

    const where: any = {
      isDeleted: false,
    };

    if (search) {
      where.OR = [
        { text: { contains: search, mode: "insensitive" } },
        { telegramUsername: { contains: search, mode: "insensitive" } },
      ];
    }

    if (groupId) {
      where.groupId = groupId;
    }

    if (messageType) {
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
        skip: offset,
        take: limit,
      }),
      prisma.message.count({ where }),
    ]);

    const page = Math.floor(offset / limit) + 1;

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
    // Handle Zod validation errors specifically
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Invalid query parameters",
          details: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }
    
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}