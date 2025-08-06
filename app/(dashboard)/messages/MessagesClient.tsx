"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedCard } from "@/components/ui/animated-card";
import { PageHeader } from "@/components/ui/page-header";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  User, 
  MessageSquare, 
  Loader2, 
  Image as ImageIcon, 
  Video, 
  FileText,
  Send,
  Clock,
  ChevronDown
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMessages } from "@/hooks/useMessages";
import { useGroups } from "@/hooks/useGroups";
import { format, formatDistanceToNow } from "date-fns";
import { PhotoThumbnail } from "@/components/PhotoThumbnail";
import { animations, colors } from "@/lib/design-system";

export default function MessagesClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [messageType, setMessageType] = useState("all");
  const [page, setPage] = useState(1);
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);

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
    const iconMap = {
      photo: { icon: ImageIcon, color: "text-green-500", bg: "bg-green-500/10" },
      video: { icon: Video, color: "text-blue-500", bg: "bg-blue-500/10" },
      document: { icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10" },
      text: { icon: MessageSquare, color: "text-gray-500", bg: "bg-gray-500/10" },
    };
    return iconMap[type as keyof typeof iconMap] || iconMap.text;
  };

  const stats = {
    total: data?.total || 0,
    photos: data?.messages?.filter(m => m.messageType === 'photo').length || 0,
    videos: data?.messages?.filter(m => m.messageType === 'video').length || 0,
    documents: data?.messages?.filter(m => m.messageType === 'document').length || 0,
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={animations.pageTransition}
      className="space-y-8"
    >
      <PageHeader
        title="Messages"
        description="Browse and search through all collected messages"
        icon={<MessageSquare className="w-6 h-6" />}
        actions={
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
        }
      />

      {/* Stats Overview */}
      <motion.div
        variants={animations.staggerContainer}
        initial="initial"
        animate="animate"
        className="grid gap-4 md:grid-cols-4"
      >
        {[
          { label: "Total Messages", value: stats.total.toLocaleString(), icon: MessageSquare, color: "purple" },
          { label: "Photos", value: stats.photos.toLocaleString(), icon: ImageIcon, color: "green" },
          { label: "Videos", value: stats.videos.toLocaleString(), icon: Video, color: "blue" },
          { label: "Documents", value: stats.documents.toLocaleString(), icon: FileText, color: "pink" },
        ].map((stat, index) => (
          <motion.div key={stat.label} variants={animations.staggerItem} custom={index}>
            <AnimatedCard variant="glass" className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-500/10`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                </div>
              </div>
            </AnimatedCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Search and Filters */}
      <AnimatedCard variant="glass" className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 pr-4 bg-white/5 border-white/10 focus:border-purple-500 transition-colors"
              />
            </div>
            
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className="w-[200px] bg-white/5 border-white/10">
                <SelectValue placeholder="All Groups" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                {groupsData?.groups?.map((group: any) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={messageType} onValueChange={setMessageType}>
              <SelectTrigger className="w-[150px] bg-white/5 border-white/10">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="photo">Photos</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
              </SelectContent>
            </Select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
            >
              Search
            </motion.button>
          </div>
        </div>
      </AnimatedCard>

      {/* Messages List */}
      <motion.div
        variants={animations.staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-4"
      >
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"
              />
            ))}
          </div>
        ) : error ? (
          <AnimatedCard variant="glass" className="p-12 text-center">
            <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-semibold mb-2">Failed to load messages</p>
            <p className="text-gray-500">Please try again later</p>
          </AnimatedCard>
        ) : data?.messages?.length === 0 ? (
          <AnimatedCard variant="glass" className="p-12 text-center">
            <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-semibold mb-2">No messages found</p>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </AnimatedCard>
        ) : (
          <AnimatePresence mode="popLayout">
            {data?.messages?.map((message: any, index: number) => {
              const messageIcon = getMessageIcon(message.messageType);
              const IconComponent = messageIcon.icon;
              
              return (
                <motion.div
                  key={message.id}
                  layout
                  variants={animations.staggerItem}
                  custom={index}
                  exit={{ opacity: 0, x: -20 }}
                  onHoverStart={() => setHoveredMessage(message.id)}
                  onHoverEnd={() => setHoveredMessage(null)}
                >
                  <AnimatedCard 
                    variant="glass" 
                    className="p-6 relative overflow-hidden"
                    hover={true}
                  >
                    {/* Hover gradient */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5"
                      animate={{
                        opacity: hoveredMessage === message.id ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    />

                    <div className="relative z-10">
                      <div className="flex items-start gap-4">
                        {/* Message Type Icon */}
                        <motion.div
                          className={`p-3 rounded-lg ${messageIcon.bg}`}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <IconComponent className={`w-5 h-5 ${messageIcon.color}`} />
                        </motion.div>

                        {/* Message Content */}
                        <div className="flex-1 space-y-2">
                          {/* Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">
                                  {message.user?.name || message.telegramUsername || "Unknown User"}
                                </span>
                              </div>
                              <span className="text-gray-500">in</span>
                              <span className="font-medium text-purple-600">
                                {message.group?.title || "Unknown Group"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span title={format(new Date(message.createdAt), "PPpp")}>
                                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                          </div>

                          {/* Message Text */}
                          {message.text && (
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {message.text}
                            </p>
                          )}

                          {/* Attachments */}
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {message.attachments.map((attachment: any) => (
                                <motion.div
                                  key={attachment.id}
                                  whileHover={{ scale: 1.05 }}
                                  className="relative"
                                >
                                  {attachment.fileType === "photo" ? (
                                    <PhotoThumbnail
                                      attachment={attachment}
                                      size="small"
                                    />
                                  ) : (
                                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-gray-500" />
                                      <span className="text-sm">{attachment.fileName || "File"}</span>
                                    </div>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          )}

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-4">
                              <Badge variant="outline" className="text-xs">
                                {message.messageType}
                              </Badge>
                              {message.isEdited && (
                                <span className="text-xs text-gray-500">edited</span>
                              )}
                            </div>
                            <motion.button
                              initial={{ opacity: 0 }}
                              animate={{ opacity: hoveredMessage === message.id ? 1 : 0 }}
                              whileHover={{ scale: 1.1 }}
                              className="text-purple-600 hover:text-purple-700"
                            >
                              <Send className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </motion.div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
          >
            Previous
          </motion.button>
          
          <span className="px-4 py-2">
            Page {page} of {data.totalPages}
          </span>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
          >
            Next
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}