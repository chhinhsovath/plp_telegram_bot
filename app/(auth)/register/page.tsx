"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Loader2, User, Mail, Lock, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/register-public", {
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
        throw new Error(data.error || t('auth.registrationError'));
      }

      setSuccess(true);
      
      // Auto login after successful registration
      setTimeout(async () => {
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.ok) {
          router.push("/dashboard");
          router.refresh();
        }
      }, 1500);

    } catch (error: any) {
      setError(error.message || t('auth.registrationError'));
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 relative overflow-hidden">
      {/* Animated background */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute top-20 -right-20 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"
      />

      {/* Language Switcher */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 right-4"
      >
        <LanguageSwitcher />
      </motion.div>

      {/* Back to Home */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 left-4"
      >
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className={language === 'km' ? 'font-hanuman' : ''}>{t('auth.backToHome')}</span>
        </Link>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md relative z-10"
      >
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-2xl border-0">
          <CardHeader className="space-y-1">
            <motion.div variants={itemVariants}>
              <CardTitle className={`text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text ${language === 'km' ? 'font-hanuman' : ''}`}>
                {t('auth.welcome')}
              </CardTitle>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardDescription className={`text-center ${language === 'km' ? 'font-hanuman' : ''}`}>
                {t('auth.registerSubtitle')}
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center gap-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span className={`text-sm ${language === 'km' ? 'font-hanuman' : ''}`}>{error}</span>
                </motion.div>
              )}
              {success && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-lg flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span className={`text-sm ${language === 'km' ? 'font-hanuman' : ''}`}>
                    {t('auth.registrationSuccess')}
                  </span>
                </motion.div>
              )}
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="name" className={language === 'km' ? 'font-hanuman' : ''}>
                  {t('auth.name')}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isLoading || success}
                    className="pl-10 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                  />
                </div>
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="email" className={language === 'km' ? 'font-hanuman' : ''}>
                  {t('auth.email')}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading || success}
                    className="pl-10 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                  />
                </div>
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="password" className={language === 'km' ? 'font-hanuman' : ''}>
                  {t('auth.password')}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading || success}
                    className="pl-10 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                  />
                </div>
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="confirmPassword" className={language === 'km' ? 'font-hanuman' : ''}>
                  {t('auth.confirmPassword')}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={isLoading || success}
                    className="pl-10 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                  />
                </div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 ${language === 'km' ? 'font-hanuman' : ''}`}
                  disabled={isLoading || success}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('common.loading')}
                    </>
                  ) : (
                    t('auth.signUp')
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <motion.div variants={itemVariants} className={`text-sm text-gray-600 dark:text-gray-400 text-center ${language === 'km' ? 'font-hanuman' : ''}`}>
              {t('auth.alreadyHaveAccount')}{" "}
              <Link href="/login" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium">
                {t('auth.signIn')}
              </Link>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}