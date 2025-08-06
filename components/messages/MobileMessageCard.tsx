"use client";

import { motion } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";
import { User, Clock, Paperclip, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PhotoThumbnail } from "@/components/PhotoThumbnail";

interface MobileMessageCardProps {
  message: any;
  index: number;
}

export function MobileMessageCard({ message, index }: MobileMessageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
    >
      {/* Header - Mobile Optimized */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded">
              <User className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-medium truncate">
              {message.user?.name || message.telegramUsername || "Unknown User"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
        
        {/* Group Name */}
        <div className="mt-2">
          <span className="text-xs text-gray-500">in</span>
          <span className="text-xs font-medium text-purple-600 ml-1">
            {message.group?.title || "Unknown Group"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Message Type Badge */}
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            <MessageSquare className="w-3 h-3 mr-1" />
            {message.messageType}
          </Badge>
          {message.attachments && message.attachments.length > 0 && (
            <Badge variant="outline" className="text-xs">
              <Paperclip className="w-3 h-3 mr-1" />
              {message.attachments.length}
            </Badge>
          )}
        </div>

        {/* Message Text */}
        {message.text && (
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
            {message.text}
          </p>
        )}

        {/* Attachments Preview - Mobile Optimized */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-3">
            <div className="grid grid-cols-3 gap-2">
              {message.attachments.slice(0, 3).map((attachment: any, idx: number) => (
                <div key={attachment.id} className="relative">
                  {attachment.fileType === "photo" ? (
                    <div className="aspect-square rounded overflow-hidden bg-gray-100">
                      <PhotoThumbnail
                        attachment={attachment}
                        size="small"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Paperclip className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  {idx === 2 && message.attachments.length > 3 && (
                    <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                      <span className="text-white font-semibold">
                        +{message.attachments.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer with timestamp */}
      <div className="px-4 pb-3">
        <span className="text-xs text-gray-400">
          {format(new Date(message.createdAt), "PPp")}
        </span>
      </div>
    </motion.div>
  );
}