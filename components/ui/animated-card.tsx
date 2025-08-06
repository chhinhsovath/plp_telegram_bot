"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { animations, minimal } from "@/lib/design-system";
import { ReactNode } from "react";

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  variant?: "default" | "minimal" | "hover";
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
    default: minimal.card,
    minimal: "bg-white border border-gray-200 rounded-lg",
    hover: cn(minimal.card, minimal.cardHover),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={hover ? animations.cardHover : undefined}
      transition={{ duration: 0.2 }}
      className={cn(
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}