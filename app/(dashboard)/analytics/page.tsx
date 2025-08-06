"use client";

import { OverviewCards } from "@/components/analytics/OverviewCards";
import { ActivityChart } from "@/components/analytics/ActivityChart";
import { TopGroupsChart } from "@/components/analytics/TopGroupsChart";
import { UserEngagement } from "@/components/analytics/UserEngagement";
import { RealtimeStats } from "@/components/analytics/RealtimeStats";
import { ExportButton } from "@/components/analytics/ExportButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive insights and real-time statistics for your Telegram groups
          </p>
        </div>
        <ExportButton />
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <OverviewCards />

          {/* Main Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <ActivityChart />
            <TopGroupsChart />
          </div>

          {/* User Engagement */}
          <UserEngagement />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <ActivityChart />
          <div className="grid gap-4 md:grid-cols-2">
            <TopGroupsChart />
            <RealtimeStats />
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <OverviewCards />
          <UserEngagement />
          <TopGroupsChart />
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RealtimeStats />
            </div>
            <div>
              <OverviewCards />
            </div>
          </div>
          <ActivityChart />
        </TabsContent>
      </Tabs>
    </div>
  );
}