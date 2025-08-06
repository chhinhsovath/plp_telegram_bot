"use client";

import { motion } from "framer-motion";
import DashboardNav from "@/components/layout/DashboardNav";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import MobileNav from "@/components/layout/MobileNav";
import { minimal, animations } from "@/lib/design-system";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mock user for display purposes
  const mockUser = {
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
    role: "admin"
  };

  return (
    <div className={minimal.container}>
      {/* Mobile Navigation */}
      <MobileNav />
      
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="hidden lg:block"
        >
          <DashboardSidebar />
        </motion.div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="hidden lg:block"
          >
            <DashboardNav user={mockUser} />
          </motion.div>
          
          {/* Main Content with mobile padding */}
          <motion.main
            {...animations.pageTransition}
            className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-6 pt-20 lg:pt-6"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
}