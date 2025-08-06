"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  FolderOpen,
  Bot,
} from "lucide-react";
import { minimal } from "@/lib/design-system";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Groups", href: "/groups", icon: Users },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Media", href: "/media", icon: FolderOpen },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <Bot className="h-6 w-6 text-blue-600 mr-2" />
            <span className={cn("text-lg font-semibold", minimal.heading)}>
              PLP Manager
            </span>
          </div>
          
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            />

            {/* Menu Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 shadow-xl"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                <div className="flex items-center">
                  <Bot className="h-6 w-6 text-blue-600 mr-2" />
                  <span className={cn("text-lg font-semibold", minimal.heading)}>
                    PLP Manager
                  </span>
                </div>
                <button
                  onClick={toggleMenu}
                  className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6">
                <ul className="space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <li key={item.name}>
                        <Link href={item.href} onClick={toggleMenu}>
                          <div
                            className={cn(
                              "flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors duration-200",
                              isActive
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                          >
                            <item.icon
                              className={cn(
                                "h-5 w-5 mr-3",
                                isActive ? "text-blue-600" : "text-gray-400"
                              )}
                            />
                            <span>{item.name}</span>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Stats */}
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}