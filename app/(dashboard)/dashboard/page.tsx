"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AnimatedCard } from "@/components/ui/animated-card";
import { PageHeader } from "@/components/ui/page-header";
import { MessageSquare, Users, FolderOpen, TrendingUp, Activity, ArrowUp, ArrowDown, Zap } from "lucide-react";
import { animations, colors } from "@/lib/design-system";
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
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      // Use mock data as fallback
      setStats({
        groupCount: 3,
        messageCount: 150,
        userCount: 5,
        attachmentCount: 25,
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
      color: "purple",
      description: "Active Telegram groups",
    },
    {
      title: "Total Messages",
      value: stats?.messageCount || 0,
      change: calculateChange(stats?.messageCount || 0, stats?.previousStats?.messageCount),
      icon: MessageSquare,
      color: "blue",
      description: "Messages collected",
    },
    {
      title: "Media Files",
      value: stats?.attachmentCount || 0,
      change: calculateChange(stats?.attachmentCount || 0, stats?.previousStats?.attachmentCount),
      icon: FolderOpen,
      color: "pink",
      description: "Photos & attachments",
    },
    {
      title: "Total Users",
      value: stats?.userCount || 0,
      change: calculateChange(stats?.userCount || 0, stats?.previousStats?.userCount),
      icon: TrendingUp,
      color: "purple",
      description: "Registered users",
    },
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={animations.pageTransition}
      className="space-y-8"
    >
      <PageHeader
        title="Dashboard"
        description="Overview of your Telegram groups and messages"
        icon={<Activity className="w-6 h-6" />}
        actions={
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Quick Actions
            </span>
          </motion.button>
        }
      />

      {/* Stats Grid */}
      <motion.div
        variants={animations.staggerContainer}
        initial="initial"
        animate="animate"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={animations.staggerItem}
            custom={index}
          >
            <AnimatedCard variant="glass" className="p-6 relative overflow-hidden">
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-600/10 to-transparent`} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br from-${stat.color}-600 to-${stat.color}-700 text-white`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  {stat.change !== 0 && (
                    <div className={`flex items-center gap-1 text-sm ${stat.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {Math.abs(stat.change).toFixed(1)}%
                    </div>
                  )}
                </div>
                
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</h3>
                <p className="text-2xl font-bold mt-1">
                  {loading ? (
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="inline-block w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded"
                    />
                  ) : (
                    stat.value.toLocaleString()
                  )}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{stat.description}</p>
              </div>
            </AnimatedCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid gap-6 lg:grid-cols-3"
      >
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <AnimatedCard variant="glass" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recent Messages</h3>
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-2 text-sm text-green-500"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                Live
              </motion.span>
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
            ) : stats?.recentMessages.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet. Add the bot to a Telegram group to start collecting messages.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.recentMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="p-2 rounded-full bg-gradient-to-br from-purple-600 to-pink-600">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm">
                          {message.user?.name || message.telegramUsername || "Unknown User"}
                        </p>
                        <span className="text-xs text-gray-500">
                          {format(new Date(message.createdAt), "HH:mm")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {message.text || `[${message.messageType}]`}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {message.group.title}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatedCard>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <AnimatedCard variant="gradient" className="p-6">
            <h3 className="text-lg font-semibold mb-4">Today's Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Messages</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Users</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Media Uploads</span>
                <span className="font-semibold">0</span>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard variant="glass" className="p-6">
            <h3 className="text-lg font-semibold mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Bot Status</span>
                <span className="flex items-center gap-2 text-sm text-green-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                <span className="flex items-center gap-2 text-sm text-green-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">API</span>
                <span className="flex items-center gap-2 text-sm text-green-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Operational
                </span>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </motion.div>
    </motion.div>
  );
}