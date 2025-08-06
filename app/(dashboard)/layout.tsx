"use client";

import { motion } from "framer-motion";
import DashboardNav from "@/components/layout/DashboardNav";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
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
      <div className="flex h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DashboardSidebar />
        </motion.div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <DashboardNav user={mockUser} />
          </motion.div>
          
          <motion.main
            {...animations.pageTransition}
            className="flex-1 overflow-y-auto p-6"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
}