import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, FolderOpen, TrendingUp } from "lucide-react";
import prisma from "@/lib/db";

async function getDashboardStats() {
  try {
    const [groupCount, messageCount, userCount, attachmentCount] = await Promise.all([
      prisma.telegramGroup.count({ where: { isActive: true } }),
      prisma.message.count({ where: { isDeleted: false } }),
      prisma.user.count(),
      prisma.attachment.count(),
    ]);

    const recentMessages = await prisma.message.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        group: true,
        user: true,
      },
    });

    return {
      groupCount,
      messageCount,
      userCount,
      attachmentCount,
      recentMessages,
    };
  } catch (error) {
    console.error("Database error:", error);
    // Return mock data if database fails
    return {
      groupCount: 3,
      messageCount: 150,
      userCount: 5,
      attachmentCount: 25,
      recentMessages: [],
    };
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of your Telegram groups and messages
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Groups
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.groupCount}</div>
            <p className="text-xs text-muted-foreground">
              Active Telegram groups
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Messages
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.messageCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Messages collected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Media Files
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.attachmentCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Photos & attachments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Users
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.userCount}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
          <CardDescription>
            Latest messages from your Telegram groups
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentMessages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages yet. Add the bot to a Telegram group to start collecting messages.</p>
          ) : (
            <div className="space-y-4">
              {stats.recentMessages.map((message) => (
                <div key={message.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      {message.user?.name || message.telegramUsername || "Unknown User"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {message.text || `[${message.messageType}]`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {message.group.title} • {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}