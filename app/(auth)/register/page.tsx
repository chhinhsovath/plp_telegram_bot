"use client";

import { useState } from "react";
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
import { AlertCircle, Mail, Lock, Eye, EyeOff, User, UserPlus, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError(t('auth.passwordTooShort'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('auth.registrationFailed'));
      }

      // Registration successful - redirect to login
      router.push("/login?registered=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Back to Home */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 left-4 z-20"
      >
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('common.backToHome')}</span>
        </Link>
      </motion.div>

      {/* Language Switcher */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 right-4 z-20"
      >
        <LanguageSwitcher />
      </motion.div>

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
            <UserPlus className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {t('auth.createAccount')}
          </h1>
          <p className="text-gray-400">
            {t('auth.registerSubtitle')}
          </p>
        </motion.div>

        {/* Register form */}
        <AnimatedCard className="p-0">
          <CardHeader>
            <CardTitle className="text-xl text-white">
              {t('auth.register')}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {t('auth.fillDetails')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatedInput
                id="name"
                name="name"
                type="text"
                label={t('auth.name')}
                icon={<User className="w-4 h-4" />}
                value={formData.name}
                onChange={handleChange}
                required
              />

              <AnimatedInput
                id="email"
                name="email"
                type="email"
                label={t('auth.email')}
                icon={<Mail className="w-4 h-4" />}
                value={formData.email}
                onChange={handleChange}
                required
              />

              <div className="relative">
                <AnimatedInput
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  label={t('auth.password')}
                  icon={<Lock className="w-4 h-4" />}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-10"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="relative">
                <AnimatedInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  label={t('auth.confirmPassword')}
                  icon={<Lock className="w-4 h-4" />}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-10"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
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
                {isLoading ? t('auth.registering') : t('auth.register')}
              </AnimatedButton>
            </form>

            {/* Terms and conditions */}
            <p className="mt-4 text-xs text-gray-400 text-center">
              {t('auth.byRegistering')}{" "}
              <Link href="/terms" className="text-purple-400 hover:text-purple-300">
                {t('auth.termsOfService')}
              </Link>{" "}
              {t('common.and')}{" "}
              <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
                {t('auth.privacyPolicy')}
              </Link>
            </p>
          </CardContent>

          <CardFooter>
            <Link
              href="/login"
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              {t('auth.alreadyHaveAccount')}
            </Link>
          </CardFooter>
        </AnimatedCard>
      </div>
    </AuthLayout>
  );
}