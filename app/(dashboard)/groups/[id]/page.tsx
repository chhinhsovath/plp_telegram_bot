import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  ArrowLeft, 
  Download,
  Filter,
  Search,
  MoreVertical,
  Image as ImageIcon,
  FileText,
  Film,
  Music
} from "lucide-react";
import prisma from "@/lib/db";
import Link from "next/link";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

async function getGroup(id: string) {
  const group = await prisma.telegramGroup.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { telegramDate: "desc" },
        take: 50,
        include: {
          user: true,
          attachments: true,
        },
      },
      groupMembers: {
        include: {
          user: true,
        },
      },
      _count: {
        select: {
          messages: true,
          groupMembers: true,
        },
      },
    },
  });

  return group;
}

function getMessageTypeIcon(type: string) {
  switch (type) {
    case 'photo':
      return <ImageIcon className="h-4 w-4" />;
    case 'document':
      return <FileText className="h-4 w-4" />;
    case 'video':
      return <Film className="h-4 w-4" />;
    case 'audio':
      return <Music className="h-4 w-4" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
}

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const group = await getGroup(id);

  if (!group) {
    notFound();
  }

  // Group messages by date
  const messagesByDate = group.messages.reduce((acc, message) => {
    const date = format(new Date(message.telegramDate), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {} as Record<string, typeof group.messages>);

  // Get unique users who have sent messages
  const activeUsers = new Set(group.messages.map(m => m.user?.id).filter(Boolean));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/groups">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{group.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {group.username ? `@${group.username}` : `ID: ${group.telegramId}`}
            </p>
          </div>
          <Badge variant={group.isActive ? "default" : "secondary"}>
            {group.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MoreVertical className="h-4 w-4 mr-2" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" />
              Export Messages
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Filter className="h-4 w-4 mr-2" />
              Filter Messages
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Remove Group
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{group._count.messages}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{group.memberCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers.size}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bot Added</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">
              {format(new Date(group.botAddedAt), "MMM d, yyyy")}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Messages Timeline */}
      <div className="space-y-6">
        {Object.entries(messagesByDate).map(([date, messages]) => (
          <div key={date}>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
              <span className="text-sm text-gray-500 px-3">
                {format(new Date(date), "MMMM d, yyyy")}
              </span>
              <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
            </div>
            
            <div className="space-y-4">
              {messages.map((message) => (
                <Card key={message.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${message.user?.telegramUsername || 'U'}`} />
                        <AvatarFallback>
                          {message.user?.telegramUsername?.substring(0, 2).toUpperCase() || 'UN'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">
                              {message.user?.name || message.user?.telegramUsername || 'Unknown User'}
                            </p>
                            {message.user?.telegramUsername && (
                              <span className="text-xs text-gray-500">
                                @{message.user.telegramUsername}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            {getMessageTypeIcon(message.messageType)}
                            <span>{format(new Date(message.telegramDate), "h:mm a")}</span>
                          </div>
                        </div>
                        
                        {message.text && (
                          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        )}
                        
                        {message.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.attachments.map((attachment) => (
                              <div
                                key={attachment.id}
                                className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded"
                              >
                                {getMessageTypeIcon(attachment.fileType)}
                                <span className="text-sm">
                                  {attachment.fileName || `${attachment.fileType} attachment`}
                                </span>
                                {attachment.fileSize && (
                                  <span className="text-xs text-gray-500">
                                    ({(Number(attachment.fileSize) / 1024).toFixed(1)} KB)
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {message.isEdited && (
                          <p className="text-xs text-gray-500">
                            edited
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
        
        {group.messages.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Messages will appear here once they are sent in the group
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}