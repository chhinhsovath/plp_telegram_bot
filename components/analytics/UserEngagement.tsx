"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface UserData {
  topContributors: Array<{
    userId: string;
    username: string;
    messageCount: number;
  }>;
  userGrowth: Array<{
    date: string;
    newUsers: number;
  }>;
  activityHeatmap: {
    data: number[][];
    days: string[];
    hours: string[];
  };
}

export function UserEngagement() {
  const { data, isLoading } = useQuery<UserData>({
    queryKey: ["analytics-users"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/users?days=7&limit=10");
      if (!response.ok) throw new Error("Failed to fetch user data");
      return response.json();
    },
    refetchInterval: 60000,
  });

  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Engagement</CardTitle>
          <CardDescription>Top contributors and their activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <p className="text-center text-muted-foreground py-8">
              Loading user data...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Find the max value for heatmap scaling
  const maxHeatmapValue = Math.max(...data.activityHeatmap.data.flat());

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Engagement</CardTitle>
        <CardDescription>User activity patterns and top contributors</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="contributors" className="space-y-4">
          <TabsList>
            <TabsTrigger value="contributors">Top Contributors</TabsTrigger>
            <TabsTrigger value="growth">User Growth</TabsTrigger>
            <TabsTrigger value="heatmap">Activity Heatmap</TabsTrigger>
          </TabsList>

          <TabsContent value="contributors" className="space-y-4">
            <div className="space-y-4">
              {data.topContributors.map((user, index) => (
                <div
                  key={user.userId}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                      {index + 1}
                    </div>
                    <Avatar className="h-8 w-8">
                      <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-600">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">@{user.username}</p>
                      <p className="text-xs text-muted-foreground">
                        User ID: {user.userId}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{user.messageCount}</p>
                    <p className="text-xs text-muted-foreground">messages</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="growth" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="newUsers"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="heatmap" className="space-y-4">
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-25 gap-1 text-xs">
                  <div className="col-span-1"></div>
                  {Array.from({ length: 24 }, (_, i) => (
                    <div key={i} className="text-center text-muted-foreground">
                      {i}
                    </div>
                  ))}
                </div>
                {data.activityHeatmap.days.map((day, dayIndex) => (
                  <div key={day} className="grid grid-cols-25 gap-1 mt-1">
                    <div className="col-span-1 text-xs text-muted-foreground pr-2">
                      {day.substring(0, 3)}
                    </div>
                    {data.activityHeatmap.data[dayIndex].map((value, hourIndex) => {
                      const intensity = maxHeatmapValue > 0 ? value / maxHeatmapValue : 0;
                      const opacity = intensity * 0.8 + 0.2;
                      return (
                        <div
                          key={`${dayIndex}-${hourIndex}`}
                          className="aspect-square rounded-sm"
                          style={{
                            backgroundColor: `rgba(99, 102, 241, ${opacity})`,
                          }}
                          title={`${day} ${hourIndex}:00 - ${value} messages`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-1">
                  {[0.2, 0.4, 0.6, 0.8, 1].map((opacity) => (
                    <div
                      key={opacity}
                      className="w-4 h-4 rounded-sm"
                      style={{
                        backgroundColor: `rgba(99, 102, 241, ${opacity})`,
                      }}
                    />
                  ))}
                </div>
                <span>More</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}