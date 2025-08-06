"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Users, FolderOpen, TrendingUp, Activity, ArrowUp, ArrowDown } from "lucide-react";
import { animations, minimal } from "@/lib/design-system";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface DashboardStats {
  groupCount: number;
  messageCount: number;
  userCount: number;
  attachmentCount: number;
  recentMessages: any[];
  previousStats?: {
    groupCount: number;
    messageCount: number;
    userCount: number;
    attachmentCount: number;
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      
      if (response.status === 401) {
        // User is not authenticated, redirect to login
        window.location.href = '/login';
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      
      // Try to fetch basic data from health endpoint as fallback
      try {
        console.log("Attempting fallback to health endpoint...");
        const healthResponse = await fetch("/api/health");
        if (healthResponse.ok) {
          const healthData = await healthResponse.json();
          console.log("Health endpoint data:", healthData);
          
          setStats({
            groupCount: healthData.counts?.groups || 0,
            messageCount: healthData.counts?.messages || 0,
            userCount: 0, // Health endpoint doesn't provide user count
            attachmentCount: 0, // Health endpoint doesn't provide attachment count
            recentMessages: [],
            previousStats: {
              groupCount: healthData.counts?.groups || 0,
              messageCount: 0,
              userCount: 0,
              attachmentCount: 0,
            }
          });
          console.log("Using health endpoint fallback data");
          return;
        }
      } catch (fallbackError) {
        console.error("Health endpoint fallback also failed:", fallbackError);
      }
      
      // Final fallback: show zeros
      setStats({
        groupCount: 0,
        messageCount: 0,
        userCount: 0,
        attachmentCount: 0,
        recentMessages: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateChange = (current: number, previous?: number) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const statCards = [
    {
      title: "Total Groups",
      value: stats?.groupCount || 0,
      change: calculateChange(stats?.groupCount || 0, stats?.previousStats?.groupCount),
      icon: Users,
      description: "Active Telegram groups",
    },
    {
      title: "Total Messages",
      value: stats?.messageCount || 0,
      change: calculateChange(stats?.messageCount || 0, stats?.previousStats?.messageCount),
      icon: MessageSquare,
      description: "Messages collected",
    },
    {
      title: "Media Files",
      value: stats?.attachmentCount || 0,
      change: calculateChange(stats?.attachmentCount || 0, stats?.previousStats?.attachmentCount),
      icon: FolderOpen,
      description: "Photos & attachments",
    },
    {
      title: "Total Users",
      value: stats?.userCount || 0,
      change: calculateChange(stats?.userCount || 0, stats?.previousStats?.userCount),
      icon: TrendingUp,
      description: "Registered users",
    },
  ];

  return (
    <motion.div
      {...animations.pageTransition}
      className="space-y-6"
    >
      <div className="mb-6">
        <h1 className={cn("text-2xl font-semibold mb-2", minimal.heading)}>Dashboard</h1>
        <p className={minimal.textSecondary}>Overview of your Telegram groups and messages</p>
      </div>

      {/* Stats Grid - Mobile Responsive */}
      <motion.div
        variants={animations.staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={animations.staggerItem}
            whileHover={animations.cardHover}
          >
            <div className={cn(minimal.card, minimal.cardHover, "p-6")}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-blue-600 text-white">
                  <stat.icon className="w-5 h-5" />
                </div>
                {stat.change !== 0 && (
                  <div className={`flex items-center gap-1 text-sm ${
                    stat.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {Math.abs(stat.change).toFixed(1)}%
                  </div>
                )}
              </div>
              
              <h3 className={cn("text-sm font-medium mb-1", minimal.textSecondary)}>{stat.title}</h3>
              <p className={cn("text-2xl font-semibold", minimal.heading)}>
                {loading ? (
                  <span className="inline-block w-20 h-8 bg-gray-200 rounded animate-pulse" />
                ) : (
                  stat.value.toLocaleString()
                )}
              </p>
              <p className={cn("text-xs mt-1", minimal.textMuted)}>{stat.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Activity Section - Mobile Responsive */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid gap-6 grid-cols-1 lg:grid-cols-3"
      >
        {/* Recent Activity */}
        <div className="order-2 lg:order-1 lg:col-span-2">
          <div className={cn(minimal.card, "p-6")}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={cn("text-lg font-semibold", minimal.heading)}>Recent Messages</h3>
              <span className="flex items-center gap-2 text-sm text-green-600">
                <span className="w-2 h-2 bg-green-600 rounded-full" />
                Live
              </span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                    className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"
                  />
                ))}
              </div>
            ) : !stats?.recentMessages || stats.recentMessages.length === 0 ? (
              <div className={cn("text-center py-12", minimal.textMuted)}>
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No messages yet. Add the bot to a Telegram group to start collecting messages.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.recentMessages?.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={animations.cardHover}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="p-2 rounded-full bg-blue-600">
                      <MessageSquare className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={cn("font-medium text-sm truncate", minimal.text)}>
                          {message.user?.name || message.telegramUsername || "Unknown User"}
                        </p>
                        <span className={cn("text-xs whitespace-nowrap ml-2", minimal.textMuted)}>
                          {format(new Date(message.createdAt), "HH:mm")}
                        </span>
                      </div>
                      <p className={cn("text-sm line-clamp-2", minimal.textSecondary)}>
                        {message.text || `[${message.messageType}]`}
                      </p>
                      <p className={cn("text-xs mt-1", minimal.textMuted)}>
                        {message.group.title}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className={cn(minimal.card, "p-6")}>
            <h3 className={cn("text-lg font-semibold mb-4", minimal.heading)}>Today&apos;s Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={cn("text-sm", minimal.textSecondary)}>Messages</span>
                <span className={cn("font-semibold", minimal.text)}>0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={cn("text-sm", minimal.textSecondary)}>Active Users</span>
                <span className={cn("font-semibold", minimal.text)}>0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={cn("text-sm", minimal.textSecondary)}>Media Uploads</span>
                <span className={cn("font-semibold", minimal.text)}>0</span>
              </div>
            </div>
          </div>

          <div className={cn(minimal.card, "p-6")}>
            <h3 className={cn("text-lg font-semibold mb-4", minimal.heading)}>System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={cn("text-sm", minimal.textSecondary)}>Bot Status</span>
                <span className="flex items-center gap-2 text-sm text-green-600">
                  <span className="w-2 h-2 bg-green-600 rounded-full" />
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={cn("text-sm", minimal.textSecondary)}>Database</span>
                <span className="flex items-center gap-2 text-sm text-green-600">
                  <span className="w-2 h-2 bg-green-600 rounded-full" />
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={cn("text-sm", minimal.textSecondary)}>API</span>
                <span className="flex items-center gap-2 text-sm text-green-600">
                  <span className="w-2 h-2 bg-green-600 rounded-full" />
                  Operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}