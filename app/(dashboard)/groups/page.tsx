import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, Calendar, MoreVertical } from "lucide-react";
import prisma from "@/lib/db";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SyncGroupsButton } from "@/components/SyncGroupsButton";

async function getGroups() {
  const groups = await prisma.telegramGroup.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          messages: true,
          groupMembers: true,
        },
      },
    },
  });

  return groups;
}

export default async function GroupsPage() {
  const groups = await getGroups();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Groups</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your connected Telegram groups
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SyncGroupsButton />
          <Button>
            Add New Group
          </Button>
        </div>
      </div>

      {groups.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No groups connected</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Add the bot to a Telegram group to start collecting messages
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm font-mono">@plp_telegram_bot</p>
              <p className="text-xs text-gray-500 mt-1">
                Add this bot to your Telegram group as admin
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card key={group.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{group.title}</CardTitle>
                    <CardDescription>
                      {group.username ? `@${group.username}` : `ID: ${group.telegramId}`}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={group.isActive ? "default" : "secondary"}>
                      {group.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/groups/${group.id}`}>
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Export Messages
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Remove Group
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{group.memberCount} members</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                    <span>{group._count.messages} messages</span>
                  </div>
                  <div className="flex items-center space-x-2 col-span-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Added {new Date(group.botAddedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {group.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-2">
                    {group.description}
                  </p>
                )}
                <div className="mt-4">
                  <Link href={`/groups/${group.id}`}>
                    <Button className="w-full" variant="outline">
                      View Messages
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}