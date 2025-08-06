"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AnimatedCard } from "@/components/auth/AnimatedCard";
import { AnimatedInput } from "@/components/auth/AnimatedInput";
import { AnimatedButton } from "@/components/auth/AnimatedButton";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Mail, Lock, Eye, EyeOff, Crown, Shield, User, Sparkles } from "lucide-react";

export default function EnhancedLoginPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const demoUsers = [
    { role: "admin", email: "admin@demo.com", password: "admin123", icon: Crown, color: "from-red-500 to-red-600" },
    { role: "moderator", email: "moderator@demo.com", password: "moderator123", icon: Shield, color: "from-blue-500 to-blue-600" },
    { role: "viewer", email: "viewer@demo.com", password: "viewer123", icon: User, color: "from-green-500 to-green-600" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/dashboard",
        redirect: false,
      });

      if (result?.ok) {
        window.location.href = "/dashboard";
      } else {
        setError(result?.error || t.login?.error || "Invalid credentials");
      }
    } catch (err) {
      setError(t.login?.error || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoUser: typeof demoUsers[0]) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: demoUser.email,
        password: demoUser.password,
        callbackUrl: "/dashboard",
        redirect: false,
      });

      if (result?.ok) {
        window.location.href = "/dashboard";
      } else {
        setError(result?.error || t.login?.error || "Invalid credentials");
      }
    } catch (err) {
      setError(t.login?.error || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md space-y-8">
        {/* Logo and title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            className="inline-flex p-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 mb-4"
            animate={{
              boxShadow: [
                "0 0 20px rgba(147, 51, 234, 0.5)",
                "0 0 40px rgba(147, 51, 234, 0.8)",
                "0 0 20px rgba(147, 51, 234, 0.5)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {t.login?.title || "Welcome Back"}
          </h1>
          <p className="text-gray-400">
            {t.login?.description || "Sign in to your account"}
          </p>
        </motion.div>

        {/* Login form */}
        <AnimatedCard className="p-0">
          <CardHeader>
            <CardTitle className="text-xl text-white">
              {t.login?.formTitle || "Sign In"}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {t.login?.formDescription || "Enter your credentials to continue"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatedInput
                id="email"
                type="email"
                label={t.login?.email || "Email"}
                icon={<Mail className="w-4 h-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                error={error && error.includes("email") ? error : undefined}
              />

              <div className="relative">
                <AnimatedInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  label={t.login?.password || "Password"}
                  icon={<Lock className="w-4 h-4" />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  error={error && error.includes("password") ? error : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && !error.includes("email") && !error.includes("password") && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-md"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </motion.div>
              )}

              <AnimatedButton
                type="submit"
                className="w-full"
                isLoading={isLoading}
              >
                {isLoading ? "Signing in..." : t.login?.submit || "Sign In"}
              </AnimatedButton>
            </form>

            {/* Demo accounts */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-black/40 px-2 text-gray-400">
                    {t.login?.orDemo || "Or use demo account"}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-2">
                {demoUsers.map((user, index) => (
                  <motion.button
                    key={user.role}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleDemoLogin(user)}
                    disabled={isLoading}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg",
                      "bg-gradient-to-r text-white",
                      "hover:scale-[1.02] transition-all duration-200",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      user.color
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <user.icon className="w-4 h-4" />
                      <span className="font-medium capitalize">{user.role}</span>
                    </div>
                    <span className="text-xs opacity-80">{user.email}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <div className="flex items-center justify-between w-full">
              <Link
                href="/register"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                {t.login?.noAccount || "Don't have an account?"}
              </Link>
              <LanguageSwitcher />
            </div>
          </CardFooter>
        </AnimatedCard>
      </div>
    </AuthLayout>
  );
}