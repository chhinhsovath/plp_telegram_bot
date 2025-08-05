import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, BarChart3, Shield, Bot, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 font-hanuman">PLP Telegram Manager</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Manage and analyze your Telegram groups in one place
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <MessageSquare className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Message Collection</CardTitle>
              <CardDescription>
                Automatically collect and archive all messages from your Telegram groups
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Group Management</CardTitle>
              <CardDescription>
                Manage multiple Telegram groups from a single dashboard
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Get insights into group activity, user engagement, and content trends
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Secure Storage</CardTitle>
              <CardDescription>
                All data is securely stored with role-based access control
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-8 font-hanuman">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Bot to Group</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Add @plp_telegram_bot to your Telegram group with a simple command
              </p>
            </div>
            <div>
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Automatic Collection</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Messages and media are automatically collected and organized
              </p>
            </div>
            <div>
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Analyze & Manage</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Use our dashboard to search, analyze, and manage your content
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 max-w-2xl mx-auto">
            <Bot className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Join thousands of communities using our platform to manage their Telegram groups effectively.
            </p>
            <Link href="/register">
              <Button size="lg">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}