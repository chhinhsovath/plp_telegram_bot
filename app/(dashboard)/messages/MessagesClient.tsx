"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Calendar, User, MessageSquare, Loader2, Image as ImageIcon, Video, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMessages } from "@/hooks/useMessages";
import { useGroups } from "@/hooks/useGroups";
import { format } from "date-fns";

export default function MessagesClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [messageType, setMessageType] = useState("all");
  const [page, setPage] = useState(1);

  const { data: groupsData } = useGroups();
  const { data, isLoading, error } = useMessages({
    page,
    search: searchQuery,
    groupId: selectedGroup,
    type: messageType,
  });

  const handleSearch = () => {
    setPage(1);
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'photo':
        return <ImageIcon className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Search and manage all collected messages
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search messages..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            <div className="flex gap-4 flex-wrap">
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  {groupsData?.map((group: any) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={messageType} onValueChange={setMessageType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Message type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="photo">Photo</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </Button>

              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>

              <Button variant="outline" className="ml-auto">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      {isLoading ? (
        <Card>
          <CardContent className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading messages...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-red-600">Error loading messages</p>
          </CardContent>
        </Card>
      ) : !data?.messages || data.messages.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No messages found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Messages will appear here once the bot starts collecting them from your groups.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {data.messages.map((message: any) => (
              <Card key={message.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {message.user?.name || message.telegramUsername || "Unknown User"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {message.group.title} • {format(new Date(message.telegramDate), "MMM d, yyyy h:mm a")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {getMessageIcon(message.messageType)}
                            <span className="ml-1">{message.messageType}</span>
                          </Badge>
                          {message._count.replies > 0 && (
                            <Badge variant="secondary">
                              {message._count.replies} replies
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        {message.text || `[${message.messageType}]`}
                      </p>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 flex gap-2">
                          {message.attachments.map((attachment: any) => (
                            <a
                              key={attachment.id}
                              href={`/api/files/${attachment.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <div className="h-20 w-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                {attachment.fileType === 'photo' ? (
                                  <ImageIcon className="h-8 w-8 text-gray-400" />
                                ) : attachment.fileType === 'video' ? (
                                  <Video className="h-8 w-8 text-gray-400" />
                                ) : (
                                  <FileText className="h-8 w-8 text-gray-400" />
                                )}
                              </div>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {data.pagination && data.pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {page} of {data.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page === data.pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}