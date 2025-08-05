'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { 
  MessageSquare, 
  Users, 
  BarChart3, 
  Shield, 
  Bot, 
  Zap, 
  Search,
  ArrowRight,
  Check
} from "lucide-react";

export default function Home() {
  const { t, language } = useLanguage();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    {
      icon: MessageSquare,
      titleKey: 'home.features.messageCollection.title',
      descKey: 'home.features.messageCollection.description',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      titleKey: 'home.features.groupManagement.title',
      descKey: 'home.features.groupManagement.description',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: BarChart3,
      titleKey: 'home.features.analytics.title',
      descKey: 'home.features.analytics.description',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Shield,
      titleKey: 'home.features.secureStorage.title',
      descKey: 'home.features.secureStorage.description',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const steps = [
    {
      icon: Bot,
      titleKey: 'home.howItWorks.step1.title',
      descKey: 'home.howItWorks.step1.description'
    },
    {
      icon: Zap,
      titleKey: 'home.howItWorks.step2.title',
      descKey: 'home.howItWorks.step2.description'
    },
    {
      icon: Search,
      titleKey: 'home.howItWorks.step3.title',
      descKey: 'home.howItWorks.step3.description'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className={`text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text ${language === 'km' ? 'font-hanuman' : ''}`}
            >
              {t('home.title')}
            </motion.div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link 
                  href="/login" 
                  className={`px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${language === 'km' ? 'font-hanuman' : ''}`}
                >
                  {t('nav.login')}
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/register" 
                  className={`px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-shadow ${language === 'km' ? 'font-hanuman' : ''}`}
                >
                  {t('nav.register')}
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-900/20 dark:to-cyan-900/20" />
        <motion.div 
          initial="initial"
          animate="animate"
          variants={stagger}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center"
        >
          <motion.h1 
            variants={fadeInUp}
            className={`text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text ${language === 'km' ? 'font-hanuman' : ''}`}
          >
            {t('home.title')}
          </motion.h1>
          <motion.p 
            variants={fadeInUp}
            className={`text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto ${language === 'km' ? 'font-hanuman' : ''}`}
          >
            {t('home.subtitle')}
          </motion.p>
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/register" 
                className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-lg font-semibold hover:shadow-xl transition-shadow ${language === 'km' ? 'font-hanuman' : ''}`}
              >
                {t('home.getStarted')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/dashboard" 
                className={`inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-xl text-lg font-semibold hover:shadow-xl transition-shadow ${language === 'km' ? 'font-hanuman' : ''}`}
              >
                {t('home.viewDashboard')}
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Animated background elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute top-20 -right-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        />
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                    '--tw-gradient-from': feature.color.split(' ')[1],
                    '--tw-gradient-to': feature.color.split(' ')[3],
                  } as any}
                />
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow">
                  <div className={`w-16 h-16 mb-4 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 text-gray-900 dark:text-white ${language === 'km' ? 'font-hanuman' : ''}`}>
                    {t(feature.titleKey)}
                  </h3>
                  <p className={`text-gray-600 dark:text-gray-300 ${language === 'km' ? 'font-hanuman' : ''}`}>
                    {t(feature.descKey)}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text ${language === 'km' ? 'font-hanuman' : ''}`}>
              {t('home.howItWorks.title')}
            </h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative"
              >
                <div className="text-center">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                  >
                    {index + 1}
                  </motion.div>
                  <div className="mb-4">
                    <step.icon className="w-12 h-12 mx-auto text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 text-gray-900 dark:text-white ${language === 'km' ? 'font-hanuman' : ''}`}>
                    {t(step.titleKey)}
                  </h3>
                  <p className={`text-gray-600 dark:text-gray-300 ${language === 'km' ? 'font-hanuman' : ''}`}>
                    {t(step.descKey)}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 transform origin-left"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 text-white ${language === 'km' ? 'font-hanuman' : ''}`}>
            {t('home.cta.title')}
          </h2>
          <p className={`text-xl text-blue-100 mb-8 ${language === 'km' ? 'font-hanuman' : ''}`}>
            {t('home.cta.description')}
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              href="/register" 
              className={`inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl text-lg font-semibold hover:shadow-2xl transition-shadow ${language === 'km' ? 'font-hanuman' : ''}`}
            >
              {t('home.cta.button')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}