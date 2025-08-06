"use client";

import { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends HTMLMotionProps<"button"> {
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
  children: React.ReactNode;
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, className, isLoading, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
          "bg-gradient-to-r from-purple-600 to-pink-600 text-white",
          "hover:from-purple-700 hover:to-pink-700",
          "disabled:opacity-50 disabled:pointer-events-none",
          "px-6 py-3",
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        disabled={isLoading}
        {...props}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 rounded-md overflow-hidden"
          initial={{ x: "-100%" }}
          whileHover={{
            x: "100%",
            transition: {
              repeat: Infinity,
              duration: 1.5,
              ease: "linear",
            },
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
        </motion.div>

        {/* Loading state */}
        {isLoading && (
          <motion.div
            className="absolute inset-0 rounded-md bg-white/20 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}

        {/* Button content */}
        <span className={cn("relative z-10", isLoading && "opacity-0")}>
          {children}
        </span>
      </motion.button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";