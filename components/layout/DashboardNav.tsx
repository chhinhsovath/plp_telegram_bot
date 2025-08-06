"use client";

import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, LogOut, User, Zap } from "lucide-react";

interface DashboardNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export default function DashboardNav({ user }: DashboardNavProps) {
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : user.email?.[0].toUpperCase() || "U";

  return (
    <header className="h-16 bg-white/5 dark:bg-gray-900/10 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6">
      <div className="flex items-center space-x-3">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Zap className="h-5 w-5 text-purple-500" />
        </motion.div>
        <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Welcome back, {user.name || "Demo User"}
        </h2>
      </div>
      
      <div className="flex items-center space-x-3">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="icon"
            className="relative bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl"
          >
            <Bell className="h-4 w-4 text-gray-300" />
            <motion.span 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
            />
          </Button>
        </motion.div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-64 bg-white/10 backdrop-blur-xl border-white/20 rounded-xl" 
            align="end" 
            forceMount
          >
            <DropdownMenuLabel className="font-normal p-4">
              <div className="flex flex-col space-y-2">
                <p className="text-sm font-semibold text-white">{user.name || "Demo User"}</p>
                <p className="text-xs text-gray-300">
                  {user.email || "demo@example.com"}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Role:</span>
                  <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300 capitalize">
                    {user.role || "admin"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="hover:bg-white/10 text-gray-300 hover:text-white">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              className="hover:bg-red-500/20 text-red-400 hover:text-red-300"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}