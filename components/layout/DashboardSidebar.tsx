"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  FolderOpen,
  Bot,
} from "lucide-react";
import { animations } from "@/lib/design-system";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, color: "purple" },
  { name: "Groups", href: "/groups", icon: Users, color: "blue" },
  { name: "Messages", href: "/messages", icon: MessageSquare, color: "pink" },
  { name: "Media", href: "/media", icon: FolderOpen, color: "purple" },
  { name: "Analytics", href: "/analytics", icon: BarChart3, color: "blue" },
  { name: "Settings", href: "/settings", icon: Settings, color: "pink" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-white/10 dark:bg-gray-900/20 backdrop-blur-xl border-r border-white/20">
      <div className="flex items-center h-16 px-6 border-b border-white/10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Bot className="h-8 w-8 text-purple-500 mr-3" />
        </motion.div>
        <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          PLP Manager
        </span>
      </div>
      
      <nav className="flex-1 px-4 py-6">
        <motion.ul 
          variants={animations.staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-2"
        >
          {navigation.map((item, index) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <motion.li key={item.name} variants={animations.staggerItem} custom={index}>
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-xl transition-all duration-300 relative group",
                      isActive
                        ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 shadow-lg shadow-purple-500/20"
                        : "hover:bg-white/10 border border-transparent"
                    )}
                  >
                    <motion.div
                      className={`p-2 rounded-lg bg-${item.color}-500/10 mr-3`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <item.icon className={`h-4 w-4 text-${item.color}-500`} />
                    </motion.div>
                    <span className={cn(
                      "font-medium text-sm",
                      isActive ? "text-white" : "text-gray-300"
                    )}>
                      {item.name}
                    </span>
                    
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute right-2 w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"
                      />
                    )}
                  </motion.div>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 space-y-2">
          <div className="text-xs text-gray-400">
            Connected Groups: <span className="font-bold text-purple-400">3</span>
          </div>
          <div className="text-xs text-gray-400">
            Total Messages: <span className="font-bold text-blue-400">1,247</span>
          </div>
        </div>
      </div>
    </div>
  );
}