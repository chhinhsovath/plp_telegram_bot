'use client';

import Link from "next/link";
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
  Globe
} from "lucide-react";

export default function HomePage() {
  const { t, language } = useLanguage();

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
      <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className={`text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent ${language === 'km' ? 'font-hanuman' : ''}`}>
              {t('home.title')}
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Link 
                href="/login" 
                className={`px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${language === 'km' ? 'font-hanuman' : ''}`}
              >
                {t('nav.login')}
              </Link>
              <Link 
                href="/register" 
                className={`px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-shadow ${language === 'km' ? 'font-hanuman' : ''}`}
              >
                {t('nav.register')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-900/20 dark:to-cyan-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent ${language === 'km' ? 'font-hanuman' : ''}`}>
            {t('home.title')}
          </h1>
          <p className={`text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto ${language === 'km' ? 'font-hanuman' : ''}`}>
            {t('home.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-lg font-semibold hover:shadow-xl transition-shadow ${language === 'km' ? 'font-hanuman' : ''}`}
            >
              {t('home.getStarted')}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/dashboard" 
              className={`inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-xl text-lg font-semibold hover:shadow-xl transition-shadow ${language === 'km' ? 'font-hanuman' : ''}`}
            >
              {t('home.viewDashboard')}
            </Link>
          </div>
        </div>
        
        {/* Background decorations */}
        <div className="absolute top-20 -right-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="relative group">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent ${language === 'km' ? 'font-hanuman' : ''}`}>
              {t('home.howItWorks.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {index + 1}
                  </div>
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 text-white ${language === 'km' ? 'font-hanuman' : ''}`}>
            {t('home.cta.title')}
          </h2>
          <p className={`text-xl text-blue-100 mb-8 ${language === 'km' ? 'font-hanuman' : ''}`}>
            {t('home.cta.description')}
          </p>
          <Link 
            href="/register" 
            className={`inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl text-lg font-semibold hover:shadow-2xl transition-shadow ${language === 'km' ? 'font-hanuman' : ''}`}
          >
            {t('home.cta.button')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}