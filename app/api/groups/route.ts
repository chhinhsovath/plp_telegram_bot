import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { CreateGroupSchema, UpdateGroupSchema } from "@/lib/validations";
import { z } from "zod";

export async function GET(req: NextRequest) {
  // Auth disabled - skip session check
  // const session = await getServerSession(authOptions);
  // if (!session) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  try {
    const groups = await prisma.telegramGroup.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            messages: true,
            groupMembers: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // Auth disabled - skip session check
  
  try {
    const body = await req.json();
    
    // Validate request body with Zod
    const validatedData = CreateGroupSchema.parse(body);
    
    // Check if group already exists
    const existingGroup = await prisma.telegramGroup.findUnique({
      where: { telegramId: validatedData.telegramId }
    });
    
    if (existingGroup) {
      return NextResponse.json(
        { error: "Group already exists" },
        { status: 409 }
      );
    }
    
    // Create new group
    const group = await prisma.telegramGroup.create({
      data: {
        telegramId: validatedData.telegramId,
        title: validatedData.title,
        type: validatedData.type,
        username: validatedData.username,
        description: validatedData.description,
      },
    });
    
    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Invalid request data",
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }
    
    console.error("Error creating group:", error);
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}