"use client";

import { forwardRef, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ label, icon, error, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative"
      >
        <div className="relative">
          {icon && (
            <motion.div
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10"
              animate={{
                color: isFocused ? "rgb(147, 51, 234)" : "rgb(156, 163, 175)",
              }}
            >
              {icon}
            </motion.div>
          )}
          
          <Input
            ref={ref}
            className={cn(
              "pl-10 pr-4 py-6 bg-white/5 border-white/10 text-white placeholder-transparent",
              "focus:bg-white/10 focus:border-purple-500 transition-all duration-300",
              error && "border-red-500",
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false);
              setHasValue(!!e.target.value);
            }}
            onChange={(e) => {
              setHasValue(!!e.target.value);
              props.onChange?.(e);
            }}
            {...props}
          />
          
          <motion.label
            className={cn(
              "absolute left-10 text-gray-400 pointer-events-none",
              "transition-all duration-300"
            )}
            animate={{
              top: isFocused || hasValue ? "0.5rem" : "1.5rem",
              fontSize: isFocused || hasValue ? "0.75rem" : "0.875rem",
              color: isFocused ? "rgb(147, 51, 234)" : "rgb(156, 163, 175)",
            }}
          >
            {label}
          </motion.label>

          {/* Focus ring animation */}
          <motion.div
            className="absolute inset-0 rounded-md pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isFocused ? 1 : 0,
              boxShadow: isFocused
                ? "0 0 0 2px rgba(147, 51, 234, 0.5), 0 0 20px rgba(147, 51, 234, 0.3)"
                : "0 0 0 0px rgba(147, 51, 234, 0)",
            }}
            transition={{ duration: 0.2 }}
          />
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";