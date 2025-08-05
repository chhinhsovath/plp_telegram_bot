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
import { AlertCircle, Loader2, Mail, Lock, Eye, EyeOff, ArrowLeft, Crown, Shield, User } from "lucide-react";

export default function LoginPage() {
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

  const handleDemoLogin = async (demoUser: typeof demoUsers[0]) => {
    setError("");
    setIsLoading(true);
    setEmail(demoUser.email);
    setPassword(demoUser.password);

    try {
      const result = await signIn("credentials", {
        email: demoUser.email,
        password: demoUser.password,
        callbackUrl: "/auth-success",
        redirect: true,
      });

      if (result?.error) {
        setError(t('auth.invalidCredentials'));
        setIsLoading(false);
      }
      // Don't set loading to false here - let the redirect happen
    } catch (error) {
      setError(t('common.error'));
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/auth-success",
        redirect: true,
      });

      if (result?.error) {
        setError(t('auth.invalidCredentials'));
        setIsLoading(false);
      }
      // Don't set loading to false here - let the redirect happen
    } catch (error) {
      setError(t('common.error'));
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
        className="absolute top-20 -right-20 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"
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
        className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
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
              <CardTitle className={`text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text ${language === 'km' ? 'font-hanuman' : ''}`}>
                {t('auth.welcomeBack')}
              </CardTitle>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardDescription className={`text-center ${language === 'km' ? 'font-hanuman' : ''}`}>
                {t('auth.loginSubtitle')}
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
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="email" className={language === 'km' ? 'font-hanuman' : ''}>
                  {t('auth.email')}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
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
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10 pr-10 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className={`w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 ${language === 'km' ? 'font-hanuman' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('common.loading')}
                    </>
                  ) : (
                    t('auth.signIn')
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Demo Login Buttons */}
            <motion.div variants={itemVariants} className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className={`text-sm text-gray-600 dark:text-gray-400 text-center mb-3 ${language === 'km' ? 'font-hanuman' : ''}`}>
                🎭 Quick Demo Access
              </div>
              <div className="grid grid-cols-1 gap-2">
                {demoUsers.map((demoUser) => {
                  const IconComponent = demoUser.icon;
                  return (
                    <Button
                      key={demoUser.role}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDemoLogin(demoUser)}
                      disabled={isLoading}
                      className={`w-full justify-start bg-gradient-to-r ${demoUser.color} text-white border-0 hover:opacity-90 transition-opacity ${language === 'km' ? 'font-hanuman' : ''}`}
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      Login as {demoUser.role.charAt(0).toUpperCase() + demoUser.role.slice(1)}
                    </Button>
                  );
                })}
              </div>
              <div className={`text-xs text-gray-500 dark:text-gray-400 text-center mt-2 ${language === 'km' ? 'font-hanuman' : ''}`}>
                Click any button above to instantly login and explore different user roles
              </div>
            </motion.div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <motion.div variants={itemVariants} className={`text-sm text-gray-600 dark:text-gray-400 text-center ${language === 'km' ? 'font-hanuman' : ''}`}>
              {t('auth.dontHaveAccount')}{" "}
              <Link href="/register" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                {t('auth.signUp')}
              </Link>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}