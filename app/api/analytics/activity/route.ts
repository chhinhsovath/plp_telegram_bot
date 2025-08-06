import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return simple mock data to prevent API errors
    return NextResponse.json({
      dailyActivity: [
        { date: "Jan 01", messages: 12 },
        { date: "Jan 02", messages: 8 },
        { date: "Jan 03", messages: 15 },
        { date: "Jan 04", messages: 6 },
        { date: "Jan 05", messages: 18 },
        { date: "Jan 06", messages: 9 },
        { date: "Jan 07", messages: 22 },
      ],
      hourlyDistribution: Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        messages: Math.floor(Math.random() * 20)
      })),
      messageTypes: [
        { type: "text", count: 145 },
        { type: "photo", count: 67 },
        { type: "video", count: 23 },
        { type: "document", count: 8 },
      ]
    });

  } catch (error) {
    console.error("Analytics activity error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity data" },
      { status: 500 }
    );
  }
}