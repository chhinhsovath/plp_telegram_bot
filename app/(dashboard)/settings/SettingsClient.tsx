"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedCard } from "@/components/ui/animated-card";
import { PageHeader } from "@/components/ui/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  User, 
  Bot, 
  Bell, 
  Shield, 
  Database,
  Palette,
  Globe,
  Key,
  Download,
  Upload,
  Check,
  Copy,
  Eye,
  EyeOff,
  Lock,
  UserPlus,
  Activity,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { animations, colors } from "@/lib/design-system";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";

interface SettingsClientProps {
  session: Session | null;
}

export default function SettingsClient({ session }: SettingsClientProps) {
  const [activeSection, setActiveSection] = useState("general");
  const [showToken, setShowToken] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<"active" | "inactive">("active");
  const [notifications, setNotifications] = useState({
    messages: true,
    groups: false,
    system: true,
  });

  const sections = [
    { id: "general", label: "General", icon: User, color: "purple" },
    { id: "telegram", label: "Telegram Bot", icon: Bot, color: "blue" },
    { id: "notifications", label: "Notifications", icon: Bell, color: "pink" },
    { id: "security", label: "Security", icon: Shield, color: "purple" },
    { id: "appearance", label: "Appearance", icon: Palette, color: "blue" },
    { id: "advanced", label: "Advanced", icon: Database, color: "pink" },
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case "general":
        return (
          <motion.div
            key="general"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <AnimatedCard variant="glass">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        defaultValue={session?.user?.name || ""}
                        placeholder="Your name"
                        className="bg-white/5 border-white/10 focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={session?.user?.email || ""}
                        disabled
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <div className="relative">
                        <Input
                          id="role"
                          value={session?.user?.role || "viewer"}
                          disabled
                          className="bg-white/5 border-white/10 capitalize pr-20"
                        />
                        <Badge className="absolute right-2 top-1/2 -translate-y-1/2" variant="secondary">
                          {session?.user?.role || "viewer"}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Input
                        id="timezone"
                        defaultValue="UTC"
                        placeholder="Select timezone"
                        className="bg-white/5 border-white/10 focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </div>
            </AnimatedCard>
          </motion.div>
        );

      case "telegram":
        return (
          <motion.div
            key="telegram"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <AnimatedCard variant="glass">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Bot Configuration</h3>
                  
                  {/* Bot Status */}
                  <motion.div
                    className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg mb-6"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Bot className="w-8 h-8 text-blue-500" />
                        </motion.div>
                        <div>
                          <p className="font-semibold">@plp_telegram_bot</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Bot is active and running
                          </p>
                        </div>
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-3 h-3 bg-green-500 rounded-full"
                      />
                    </div>
                  </motion.div>

                  {/* Webhook Status */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        {webhookStatus === "active" ? (
                          <Wifi className="w-5 h-5 text-green-500" />
                        ) : (
                          <WifiOff className="w-5 h-5 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium">Webhook Status</p>
                          <p className="text-sm text-gray-500">
                            {webhookStatus === "active" ? "Connected" : "Disconnected"}
                          </p>
                        </div>
                      </div>
                      <Badge variant={webhookStatus === "active" ? "default" : "destructive"}>
                        {webhookStatus === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <Label>Webhook URL</Label>
                      <div className="flex gap-2">
                        <Input
                          value="https://telebot.openplp.com/api/telegram/webhook"
                          readOnly
                          className="bg-white/5 border-white/10 font-mono text-sm"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Copy
                        </motion.button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Bot Token</Label>
                      <div className="flex gap-2">
                        <Input
                          type={showToken ? "text" : "password"}
                          value="7883297565:AAFKQsNcHxgZOHqUu7cQhzwZ7F6v77TdJfU"
                          readOnly
                          className="bg-white/5 border-white/10 font-mono text-sm"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowToken(!showToken)}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
                  >
                    Update Webhook
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg font-medium hover:bg-white/10 transition-colors"
                  >
                    Test Connection
                  </motion.button>
                </div>
              </div>
            </AnimatedCard>
          </motion.div>
        );

      case "notifications":
        return (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <AnimatedCard variant="glass">
              <div className="p-6 space-y-6">
                <h3 className="text-lg font-semibold">Notification Preferences</h3>
                
                <div className="space-y-4">
                  {[
                    {
                      id: "messages",
                      title: "New Messages",
                      description: "Get notified when new messages are collected",
                      icon: Bell,
                    },
                    {
                      id: "groups",
                      title: "Group Changes",
                      description: "Notifications for group member changes",
                      icon: UserPlus,
                    },
                    {
                      id: "system",
                      title: "System Alerts",
                      description: "Important system notifications and errors",
                      icon: AlertCircle,
                    },
                  ].map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className="p-2 bg-pink-500/10 rounded-lg"
                        >
                          <item.icon className="w-5 h-5 text-pink-500" />
                        </motion.div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications[item.id as keyof typeof notifications]}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, [item.id]: checked }))
                        }
                      />
                    </motion.div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
                  >
                    Save Preferences
                  </motion.button>
                </div>
              </div>
            </AnimatedCard>
          </motion.div>
        );

      case "security":
        return (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <AnimatedCard variant="glass">
              <div className="p-6 space-y-6">
                <h3 className="text-lg font-semibold">Security Settings</h3>
                
                <div className="space-y-4">
                  {[
                    {
                      title: "Change Password",
                      description: "Update your account password",
                      icon: Key,
                      color: "purple",
                      action: "Change",
                    },
                    {
                      title: "Two-Factor Authentication",
                      description: "Add an extra layer of security",
                      icon: Shield,
                      color: "blue",
                      action: "Enable",
                    },
                    {
                      title: "Login History",
                      description: "View recent login activity",
                      icon: Activity,
                      color: "pink",
                      action: "View",
                    },
                    {
                      title: "Active Sessions",
                      description: "Manage your active sessions",
                      icon: Database,
                      color: "purple",
                      action: "Manage",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      variants={animations.staggerItem}
                      custom={index}
                      className="p-4 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className={`p-3 bg-${item.color}-500/10 rounded-lg`}
                          >
                            <item.icon className={`w-5 h-5 text-${item.color}-500`} />
                          </motion.div>
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-gray-500">{item.description}</p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          {item.action}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-red-600/10 border border-red-600/50 text-red-600 rounded-lg font-medium hover:bg-red-600/20 transition-colors"
                  >
                    Delete Account
                  </motion.button>
                </div>
              </div>
            </AnimatedCard>
          </motion.div>
        );

      case "appearance":
        return (
          <motion.div
            key="appearance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <AnimatedCard variant="glass">
              <div className="p-6 space-y-6">
                <h3 className="text-lg font-semibold">Appearance Settings</h3>
                
                <div className="space-y-6">
                  {/* Theme Selection */}
                  <div>
                    <Label className="mb-3 block">Theme</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {["Light", "Dark", "System"].map((theme) => (
                        <motion.button
                          key={theme}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-center"
                        >
                          <Palette className="w-6 h-6 mx-auto mb-2" />
                          <p className="text-sm font-medium">{theme}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Color Accent */}
                  <div>
                    <Label className="mb-3 block">Accent Color</Label>
                    <div className="grid grid-cols-6 gap-3">
                      {[
                        "bg-purple-500",
                        "bg-blue-500",
                        "bg-pink-500",
                        "bg-green-500",
                        "bg-orange-500",
                        "bg-red-500",
                      ].map((color) => (
                        <motion.button
                          key={color}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`w-12 h-12 ${color} rounded-lg shadow-lg`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Language */}
                  <div>
                    <Label className="mb-3 block">Language</Label>
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                      <Globe className="w-5 h-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="font-medium">English (US)</p>
                        <p className="text-sm text-gray-500">Default language</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        Change
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </motion.div>
        );

      case "advanced":
        return (
          <motion.div
            key="advanced"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <AnimatedCard variant="glass">
              <div className="p-6 space-y-6">
                <h3 className="text-lg font-semibold">Advanced Settings</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="font-medium">Export Data</p>
                          <p className="text-sm text-gray-500">Download all your data</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-green-600/10 border border-green-600/50 text-green-600 rounded-lg font-medium hover:bg-green-600/20 transition-colors"
                      >
                        Export
                      </motion.button>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Upload className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium">Import Data</p>
                          <p className="text-sm text-gray-500">Import from backup</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-blue-600/10 border border-blue-600/50 text-blue-600 rounded-lg font-medium hover:bg-blue-600/20 transition-colors"
                      >
                        Import
                      </motion.button>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="font-medium">Clear Cache</p>
                          <p className="text-sm text-gray-500">Free up storage space</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-purple-600/10 border border-purple-600/50 text-purple-600 rounded-lg font-medium hover:bg-purple-600/20 transition-colors"
                      >
                        Clear
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={animations.pageTransition}
      className="space-y-8"
    >
      <PageHeader
        title="Settings"
        description="Manage your application settings and preferences"
        icon={<Settings className="w-6 h-6" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <motion.div
          variants={animations.staggerContainer}
          initial="initial"
          animate="animate"
          className="lg:col-span-1 space-y-2"
        >
          {sections.map((section, index) => (
            <motion.button
              key={section.id}
              variants={animations.staggerItem}
              custom={index}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "w-full p-4 rounded-lg transition-all duration-300 flex items-center gap-3",
                activeSection === section.id
                  ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/50"
                  : "bg-white/5 hover:bg-white/10 border border-transparent"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className={`p-2 rounded-lg bg-${section.color}-500/10`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <section.icon className={`w-5 h-5 text-${section.color}-500`} />
              </motion.div>
              <span className="font-medium">{section.label}</span>
              {activeSection === section.id && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {renderSectionContent()}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}