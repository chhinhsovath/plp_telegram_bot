"use client";

import { motion } from "framer-motion";
import DashboardNav from "@/components/layout/DashboardNav";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { GradientBackground } from "@/components/ui/gradient-background";

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
    <GradientBackground variant="mesh">
      <div className="flex h-screen">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <DashboardSidebar />
        </motion.div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <DashboardNav user={mockUser} />
          </motion.div>
          
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex-1 overflow-y-auto p-6"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </GradientBackground>
  );
}