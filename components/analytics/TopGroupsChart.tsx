"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface GroupData {
  topGroups: Array<{
    id: string;
    name: string;
    messages: number;
    members: number;
    activeMembers: number;
    engagementRate: string;
  }>;
  groupStats: {
    total: number;
    active: number;
    inactive: number;
  };
}

export function TopGroupsChart() {
  const { data, isLoading } = useQuery<GroupData>({
    queryKey: ["analytics-groups"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/groups?days=7&limit=10");
      if (!response.ok) throw new Error("Failed to fetch group data");
      return response.json();
    },
    refetchInterval: 60000,
  });

  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Groups</CardTitle>
          <CardDescription>Most active groups by message count</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Loading chart data...
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.topGroups.slice(0, 5).map((group) => ({
    name: group.name.length > 20 ? group.name.substring(0, 20) + "..." : group.name,
    messages: group.messages,
    activeMembers: group.activeMembers,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Groups</CardTitle>
        <CardDescription>
          Most active groups by message count
          <div className="flex gap-2 mt-2">
            <Badge variant="outline">Total: {data.groupStats.total}</Badge>
            <Badge variant="default">Active: {data.groupStats.active}</Badge>
            <Badge variant="secondary">Inactive: {data.groupStats.inactive}</Badge>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="messages" fill="#8884d8" name="Messages" />
              <Bar dataKey="activeMembers" fill="#82ca9d" name="Active Members" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed list */}
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {data.topGroups.map((group) => (
            <div
              key={group.id}
              className="flex items-center justify-between p-2 rounded-lg border"
            >
              <div className="flex-1">
                <p className="font-medium text-sm">{group.name}</p>
                <p className="text-xs text-muted-foreground">
                  {group.members} members • {group.activeMembers} active
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{group.messages} messages</p>
                <p className="text-xs text-muted-foreground">
                  {group.engagementRate}% engagement
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}