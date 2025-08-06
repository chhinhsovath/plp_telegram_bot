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
import { Bell, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { minimal } from "@/lib/design-system";

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
    <header className={cn("h-16 flex items-center justify-between px-6", minimal.nav)}>
      <div className="flex items-center">
        <h2 className={cn("text-lg font-medium", minimal.text)}>
          Welcome back, {user.name || "Demo User"}
        </h2>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-600 rounded-full" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="relative h-9 w-9 rounded-full hover:bg-gray-100"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-blue-600 text-white text-xs font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-56 bg-white border border-gray-200 shadow-lg rounded-lg" 
            align="end" 
            forceMount
          >
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex flex-col space-y-1">
                <p className={cn("text-sm font-medium", minimal.heading)}>
                  {user.name || "Demo User"}
                </p>
                <p className={cn("text-xs", minimal.textMuted)}>
                  {user.email || "demo@example.com"}
                </p>
                <span className={cn("text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full inline-block w-fit mt-1", minimal.textMuted)}>
                  {user.role || "admin"}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-gray-50">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="hover:bg-red-50 text-red-600 hover:text-red-700"
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