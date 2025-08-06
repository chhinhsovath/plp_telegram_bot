"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { glassStyle, animations } from "@/lib/design-system";
import { ReactNode } from "react";

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  variant?: "default" | "glass" | "gradient" | "outline";
  hover?: boolean;
  className?: string;
}

export function AnimatedCard({
  children,
  variant = "default",
  hover = true,
  className,
  ...props
}: AnimatedCardProps) {
  const variants = {
    default: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
    glass: "bg-white/5 backdrop-blur-lg border border-white/10",
    gradient: "bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/20",
    outline: "bg-transparent border-2 border-gray-200 dark:border-gray-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { scale: 1.02, y: -5 } : undefined}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-xl shadow-lg transition-all duration-300",
        variants[variant],
        hover && "hover:shadow-xl hover:shadow-purple-500/10",
        variant === "glass" && "backdrop-blur-lg",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}