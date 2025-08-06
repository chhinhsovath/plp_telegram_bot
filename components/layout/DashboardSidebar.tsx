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
import { animations, minimal } from "@/lib/design-system";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Groups", href: "/groups", icon: Users },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Media", href: "/media", icon: FolderOpen },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col w-64", minimal.sidebar)}>
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <Bot className="h-6 w-6 text-blue-600 mr-3" />
        <span className={cn("text-lg font-semibold", minimal.heading)}>
          PLP Manager
        </span>
      </div>
      
      <nav className="flex-1 px-4 py-6">
        <motion.ul 
          variants={animations.staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-1"
        >
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <motion.li key={item.name} variants={animations.staggerItem}>
                <Link href={item.href}>
                  <motion.div
                    whileHover={animations.cardHover}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                      isActive
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 mr-3",
                      isActive ? "text-blue-600" : "text-gray-400"
                    )} />
                    <span>{item.name}</span>
                  </motion.div>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className={cn("text-xs", minimal.textMuted)}>
            Connected Groups: <span className="font-semibold text-blue-600">3</span>
          </div>
          <div className={cn("text-xs", minimal.textMuted)}>
            Total Messages: <span className="font-semibold text-blue-600">1,247</span>
          </div>
        </div>
      </div>
    </div>
  );
}