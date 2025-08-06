"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity, Users, MessageSquare, Calendar, Minus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface OverviewData {
  messagestoday: number;
  messageChange: number;
  activeUsersCount: number;
  userChange: number;
  avgMessagesPerDay: number;
  peakHour: string;
}

export function OverviewCards() {
  const { data, isLoading } = useQuery<OverviewData>({
    queryKey: ["analytics-overview"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/overview");
      if (!response.ok) throw new Error("Failed to fetch overview data");
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const renderTrend = (value: number) => {
    if (value > 0) {
      return (
        <p className="text-xs text-muted-foreground flex items-center">
          <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
          +{value}% from yesterday
        </p>
      );
    } else if (value < 0) {
      return (
        <p className="text-xs text-muted-foreground flex items-center">
          <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
          {value}% from yesterday
        </p>
      );
    }
    return (
      <p className="text-xs text-muted-foreground flex items-center">
        <Minus className="h-3 w-3 text-gray-500 mr-1" />
        No change from yesterday
      </p>
    );
  };

  const renderUserTrend = (value: number) => {
    if (value > 0) {
      return (
        <p className="text-xs text-muted-foreground flex items-center">
          <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
          +{value}% from last week
        </p>
      );
    } else if (value < 0) {
      return (
        <p className="text-xs text-muted-foreground flex items-center">
          <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
          {value}% from last week
        </p>
      );
    }
    return (
      <p className="text-xs text-muted-foreground flex items-center">
        <Minus className="h-3 w-3 text-gray-500 mr-1" />
        No change from last week
      </p>
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Messages Today</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : data?.messagestoday || 0}
          </div>
          {!isLoading && data && renderTrend(data.messageChange)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : data?.activeUsersCount || 0}
          </div>
          {!isLoading && data && renderUserTrend(data.userChange)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Messages/Day</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : data?.avgMessagesPerDay || 0}
          </div>
          <p className="text-xs text-muted-foreground">Last 30 days average</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Peak Hour</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : data?.peakHour || "-"}
          </div>
          <p className="text-xs text-muted-foreground">Most active time</p>
        </CardContent>
      </Card>
    </div>
  );
}