"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatedCard } from "@/components/ui/animated-card";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Search, 
  Filter,
  MoreVertical,
  UserPlus,
  Activity,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle
} from "lucide-react";
import { format } from "date-fns";
import { animations } from "@/lib/design-system";
import { SyncGroupsButton } from "@/components/SyncGroupsButton";
import { CleanupInactiveGroups } from "@/components/CleanupInactiveGroups";

interface Group {
  id: string;
  telegramId: bigint;
  title: string;
  username: string | null;
  description: string | null;
  memberCount: number;
  isActive: boolean;
  botAddedAt: Date;
  _count: {
    messages: number;
    groupMembers: number;
  };
}

interface GroupsClientProps {
  groups?: Group[];
  isAdmin: boolean;
}

export default function GroupsClient({ groups = [], isAdmin }: GroupsClientProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);

  const filteredGroups = (groups || []).filter((group) => {
    const matchesSearch = group.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterActive === null || group.isActive === filterActive;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: (groups || []).length,
    active: (groups || []).filter(g => g.isActive).length,
    inactive: (groups || []).filter(g => !g.isActive).length,
    totalMessages: (groups || []).reduce((acc, g) => acc + g._count.messages, 0),
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={animations.pageTransition}
      className="space-y-8"
    >
      <PageHeader
        title="Groups"
        description="Manage your Telegram groups and monitor activity"
        icon={<Users className="w-6 h-6" />}
        actions={
          <div className="flex items-center gap-3">
            {isAdmin && (
              <>
                <SyncGroupsButton />
                <CleanupInactiveGroups />
              </>
            )}
          </div>
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
          { label: "Total Groups", value: stats.total, icon: Users, color: "purple" },
          { label: "Active Groups", value: stats.active, icon: CheckCircle, color: "green" },
          { label: "Inactive Groups", value: stats.inactive, icon: XCircle, color: "red" },
          { label: "Total Messages", value: stats.totalMessages.toLocaleString(), icon: MessageSquare, color: "blue" },
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

      {/* Search and Filter */}
      <AnimatedCard variant="glass" className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search groups by name or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 focus:border-purple-500 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterActive(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterActive === null
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                  : "bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-white/10"
              }`}
            >
              All
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterActive(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterActive === true
                  ? "bg-green-600 text-white shadow-lg shadow-green-500/25"
                  : "bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-white/10"
              }`}
            >
              Active
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterActive(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterActive === false
                  ? "bg-red-600 text-white shadow-lg shadow-red-500/25"
                  : "bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-white/10"
              }`}
            >
              Inactive
            </motion.button>
          </div>
        </div>
      </AnimatedCard>

      {/* Groups Grid */}
      <motion.div
        variants={animations.staggerContainer}
        initial="initial"
        animate="animate"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredGroups.map((group, index) => (
            <motion.div
              key={group.id}
              layout
              variants={animations.staggerItem}
              custom={index}
              exit={{ opacity: 0, scale: 0.9 }}
              onHoverStart={() => setHoveredGroup(group.id)}
              onHoverEnd={() => setHoveredGroup(null)}
            >
              <Link href={`/groups/${group.id}`}>
                <AnimatedCard 
                  variant="glass" 
                  className="p-6 cursor-pointer relative overflow-hidden h-full"
                  hover={true}
                >
                  {/* Background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5"
                    animate={{
                      opacity: hoveredGroup === group.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="p-3 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 text-white"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Users className="w-5 h-5" />
                        </motion.div>
                        <div>
                          <h3 className="font-semibold text-lg line-clamp-1">{group.title}</h3>
                          {group.username && (
                            <p className="text-sm text-gray-500">@{group.username}</p>
                          )}
                        </div>
                      </div>
                      <Badge variant={group.isActive ? "default" : "secondary"}>
                        {group.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          <span className="font-semibold">{group._count.messages}</span>
                          {" messages"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          <span className="font-semibold">{group.memberCount}</span>
                          {" members"}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {group.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                        {group.description}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(group.botAddedAt), "MMM d, yyyy")}
                      </span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredGroup === group.id ? 1 : 0 }}
                        className="flex items-center gap-1 text-purple-500"
                      >
                        View Details
                        <MoreVertical className="w-3 h-3" />
                      </motion.span>
                    </div>
                  </div>
                </AnimatedCard>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredGroups.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No groups found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchTerm || filterActive !== null
              ? "Try adjusting your search or filter criteria"
              : "Add the bot to a Telegram group to get started"}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}